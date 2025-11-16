import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to chunk an array into smaller arrays of a specified size
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}


export async function processGetApiInBatchs(
  queryList: string[],
  batchSize: number = 10,
  apiFunction:(query: string) => Promise<unknown>
) {
  const batches = chunkArray(queryList, batchSize);
  const results = [];

  for (const batch of batches) {
    console.log(`Processing batch with ${batch.length} claims...`);

    // Run all calls in this batch simultaneously
    const batchResults = await Promise.all(
       batch.map(query => apiFunction(query))
    );

    results.push(...batchResults);
  }

  return results;
}
