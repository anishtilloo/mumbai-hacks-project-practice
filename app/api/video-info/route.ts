// global imports
import { parseStringPromise } from 'xml2js';
import { NextRequest, NextResponse } from 'next/server';

// local imports
import {
  extractCaptionTrackUrl,
  extractJson,
  extractYouTubeID,
  getInnertubeApiKey,
  getPlayerResponse,
} from '@/lib/transcript-extractor';

import { factCheckSearch } from '@/lib/fact-check';
import { geminiAI } from '@/lib/llm/init';
import { system_prompt } from '@/prompts/claim-extractor-agent-prompts';
import { processGetApiInBatchs } from '@/lib/utils';

// route function
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { video_link } = body;
    // console.log(video_link);
    if (!video_link) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    // Extract video ID if URL is provided
    const videoId = extractYouTubeID(video_link);
    // console.log(videoId);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL or video ID' }, { status: 400 });
    }

    // Get API key and player response
    const apiKey = await getInnertubeApiKey(video_link);
    if (!apiKey) {
      return NextResponse.json({ error: 'Failed to retrieve YouTube API key' }, { status: 500 });
    }

    const playerResponse = await getPlayerResponse(videoId!, apiKey);

    // 1. Extract caption track URL
    const captionUrl = extractCaptionTrackUrl(playerResponse);
    console.log('works 1');

    // 2. Fetch XML captions
    const xmlResponse = await fetch(captionUrl);
    const xml = await xmlResponse.text();
    console.log('works 2');

    // 3. Parse XML to extract text
    const parsedXml = await parseStringPromise(xml);
    console.log('works 3');

    // 4. Clean the XML to get pure text
    const allText = parsedXml.transcript.text.map((t: { _: string }) => t._);
    const fullTranscript = (allText as string[]).join(' ');
    console.log('works 4');

    // 5. Get response from LLM
    const response = await geminiAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `This is the current transcript for you to analyse -
      ---
      ${fullTranscript}
      ---
      `,
      config: {
        systemInstruction: system_prompt,
      },
    });

    console.log('works 5');

    // const responseText = response.candidates![0].content?.parts![0].text;

    const parsedLlmResponse = JSON.parse(JSON.stringify(response.candidates![0].content?.parts![0].text));
    console.log('parsedLlmResponse', parsedLlmResponse);

    const extractedJson = extractJson(parsedLlmResponse);
    // parsedLlmResponse
    // const responseFromFactCheck = await factCheckSearch('covid vaccine');
    console.log('works 6', extractedJson?.claims?.content);

    const result = await processGetApiInBatchs(extractedJson?.claims?.content, 5, factCheckSearch)

    console.log('result', result);

    // console.log(response.candidates![0].content?.parts![0].text);

    // Get video metadata
    const videoDetails = playerResponse?.videoDetails;

    return NextResponse.json({
      success: true,
      data: {
        title: videoDetails?.title || 'Untitled Video',
        videoId: videoId,
        author: videoDetails?.author || 'Unknown',
        thumbnailUrl: videoDetails?.thumbnail?.thumbnails?.[0]?.url,
        fullTranscript: fullTranscript,
        extractedAIJson: extractedJson,
        aiResponse: response,
        apiBatchRepsponse: result,
        playerResponse: playerResponse,
        // aiResponse: response.candidates![0].content?.parts![0].text,
        // factCheckResponse: responseFromFactCheck,
      },
    });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch transcript',
      },
      { status: 500 }
    );
  }
}
