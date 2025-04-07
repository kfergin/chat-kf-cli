import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export type GoogleAIModelName = 'gemini-1.5-flash' | 'gemini-1.5-pro';

// Ollama model names depend on what models are installed through ollama.
// To view models, run `ollama ls`.
export type OllamaModelName = string;

export type ModelName =
  | Anthropic.Messages.Model
  | OllamaModelName
  | OpenAI.Chat.ChatModel
  | GoogleAIModelName;
