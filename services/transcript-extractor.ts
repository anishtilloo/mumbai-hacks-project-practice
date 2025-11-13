// services/transcript-extractor.ts
export const extractVideoInfo = async ({ id }: { id: string }) => {
  const response = await fetch('/api/video-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch video info');
  }

  const result = await response.json();
  return result.data;
};
