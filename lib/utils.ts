import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
}

interface PlayerResponse {
  captions?: {
    playerCaptionsTracklistRenderer?: {
      captionTracks: CaptionTrack[];
    };
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const maxDuration = 150;
export const dynamic = 'force-dynamic';

// Extract YouTube video ID from URL or return ID if already formatted
export function extractYouTubeID(urlOrID: string): string | null {
  const regExpID = /^[a-zA-Z0-9_-]{11}$/;

  if (regExpID.test(urlOrID)) {
    return urlOrID;
  }

  const regExpStandard = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
  const regExpShorts = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;

  const matchStandard = urlOrID.match(regExpStandard);
  if (matchStandard) {
    return matchStandard[1];
  }

  const matchShorts = urlOrID.match(regExpShorts);
  if (matchShorts) {
    return matchShorts[1];
  }

  return null;
}

// Extract caption track URL from player response
export const extractCaptionTrackUrl = (playerResponse: PlayerResponse, lang = 'en'): string => {
  const tracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  if (!tracks) throw new Error('No caption tracks found.');

  const track = tracks.find((t: CaptionTrack) => t.languageCode === lang);
  if (!track) throw new Error(`No captions for language: ${lang}`);

  // Remove "&fmt=srv3" if present
  return track.baseUrl.replace(/&fmt=\w+$/, '');
};

// Get player response from YouTube's API
export const getPlayerResponse = async (videoId: string, apiKey: string) => {
  const endpoint = `https://www.youtube.com/youtubei/v1/player?key=${apiKey}`;

  const body = {
    context: {
      client: {
        clientName: 'ANDROID',
        clientVersion: '20.10.38',
      },
    },
    videoId: videoId,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return await response.json();
};

// Get YouTube's Innertube API key from the video page
export const getInnertubeApiKey = async (videoUrl: string): Promise<string | null> => {
  const response = await fetch(videoUrl);
  const html = await response.text();

  const apiKeyMatch = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
  return apiKeyMatch ? apiKeyMatch[1] : null;
};
