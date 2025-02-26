import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export type AnthropicAIModelName = Extract<
  Anthropic.Messages.Model,
  | 'claude-3-7-sonnet-latest'
  | 'claude-3-5-sonnet-latest'
  | 'claude-3-opus-latest'
>;
export type GoogleAIModelName = 'gemini-1.5-flash' | 'gemini-1.5-pro';
export type OpenAIModelName = Extract<
  OpenAI.Chat.ChatModel,
  | 'gpt-4-turbo'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-3.5-turbo'
  | 'o1-mini'
  | 'o1-preview'
>;
export type ModelName =
  | AnthropicAIModelName
  | OpenAIModelName
  | GoogleAIModelName;
