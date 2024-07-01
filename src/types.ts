export interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export type ModelName = 'gpt-4-turbo' | 'gemini-1.5-flash';
