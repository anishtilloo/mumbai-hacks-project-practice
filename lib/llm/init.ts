import { GoogleGenAI } from '@google/genai';

import { aiConfig } from '@/config';

export const geminiAI = new GoogleGenAI({
  apiKey: aiConfig.models.llm.apiKey,
});
