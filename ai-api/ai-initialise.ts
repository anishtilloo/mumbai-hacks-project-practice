import { GoogleGenAI } from '@google/genai';
import { aiConfig } from './ai-config';

export const geminiAI = new GoogleGenAI({
  apiKey: aiConfig.models.llm.apiKey,
});
