import fetch from "node-fetch";

import { aiConfig } from '@/config';
/**
 * Searches the Google Fact Check Tools API for fact-checked claims.
 * @param query The search query (e.g., "covid vaccine")
 * @param apiKey Your Google API key
 * @param languageCode Optional. Language code (default: "en")
 * @param pageSize Optional. Number of results to return (default: 5)
 * @returns The JSON response from the API
 */
export async function factCheckSearch(
  query: string,
  languageCode: string = "en",
  pageSize: number = 10
) {
//   const url = new URL(`${aiConfig.google.factCheck.baseUrl}/claims:search`);
//   url.searchParams.append("query", query);
//   url.searchParams.append("languageCode", languageCode);
//   url.searchParams.append("pageSize", pageSize.toString());

  const response = await fetch(`${aiConfig.google.factCheck.baseUrl}/claims:search?query=${query}&languageCode=${languageCode}&pageSize=${pageSize.toString()}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "x-goog-api-key": `${aiConfig.google.factCheck.apiKey}`
    },
  });

  if (!response.ok) {
    throw new Error(`Google Fact Check API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Example usage:
// (async () => {
//   const data = await factCheckSearch("covid vaccine", "YOUR_API_KEY_HERE");
//   console.log(JSON.stringify(data, null, 2));
// })();
