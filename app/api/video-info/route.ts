// global imports
import { parseStringPromise } from 'xml2js';
import { NextRequest, NextResponse } from 'next/server';

// local imports
import {
  extractCaptionTrackUrl,
  extractYouTubeID,
  getInnertubeApiKey,
  getPlayerResponse,
} from '@/lib/transcript-extractor';
import { geminiAI } from '@/lib/llm/init';

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

    // 2. Fetch XML captions
    const xmlResponse = await fetch(captionUrl);
    const xml = await xmlResponse.text();

    // 3. Parse XML to extract text
    const parsedXml = await parseStringPromise(xml);

    // 4. Clean the XML to get pure text
    const allText = parsedXml.transcript.text.map((t: { _: string }) => t._);
    const fullTranscript = (allText as string[]).join(' ');

    // Get video metadata
    const videoDetails = playerResponse?.videoDetails;

    // Get response from LLM
    const response = await geminiAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Provide a point wise summary of this video transcript -
      ---
      ${fullTranscript}
      ---
      `,
      config: {
        systemInstruction: "You are a helpful AI Agent",
      },

    });

    // console.log(response.candidates![0].content?.parts![0].text);

    return NextResponse.json({
      success: true,
      data: {
        title: videoDetails?.title || 'Untitled Video',
        videoId: videoId,
        author: videoDetails?.author || 'Unknown',
        thumbnailUrl: videoDetails?.thumbnail?.thumbnails?.[0]?.url,
        fullTranscript: fullTranscript,
        aiResponse: response.candidates![0].content?.parts![0].text,
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
