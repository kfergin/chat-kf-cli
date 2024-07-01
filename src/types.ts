export interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export type GoogleAIModelName = 'gemini-1.5-flash';
export type OpenAIModelName = 'gpt-4-turbo';
export type ModelName = OpenAIModelName | GoogleAIModelName;
