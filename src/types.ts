import OpenAI from 'openai';
export interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export type GoogleAIModelName = 'gemini-1.5-flash' | 'gemini-1.5-pro';
export type OpenAIModelName = Extract<
  OpenAI.Chat.ChatModel,
  'gpt-4-turbo' | 'gpt-4o' | 'gpt-4o-mini' | 'gpt-3.5-turbo'
>;
export type ModelName = OpenAIModelName | GoogleAIModelName;
