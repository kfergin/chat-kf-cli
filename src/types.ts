export interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export type GoogleAIModelName = 'gemini-1.5-flash' | 'gemini-1.5-pro';
export type OpenAIModelName = 'gpt-4-turbo' | 'gpt-4o' | 'gpt-3.5-turbo';
export type ModelName = OpenAIModelName | GoogleAIModelName;
