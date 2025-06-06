import fs from 'fs/promises';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

import {
  AVAILABLE_ANTHROPIC_AI_MODELS,
  AVAILABLE_GOOGLE_AI_MODELS,
  AVAILABLE_MODELS,
  AVAILABLE_OPENAI_MODELS,
  conversationsDir,
  dataDir,
} from './constants';
import { GoogleAIModelName, Message, ModelName } from './types';
import { Stats } from 'fs';

interface CliState {
  currentConversation: string | null;
  selectedModel?: ModelName | null;
}

export async function deleteConversation(conversationId: string) {
  const filePath = path.join(conversationsDir, `./${conversationId}.json`);
  await fs.unlink(filePath);
}

export function isValidModelName(modelName: string): modelName is ModelName {
  return AVAILABLE_MODELS.some(
    ({ value }) => value === (modelName as ModelName),
  );
}

export function isValidAnthropicAiModelName(
  modelName: string,
): modelName is Anthropic.Messages.Model {
  return AVAILABLE_ANTHROPIC_AI_MODELS.some(
    ({ value }) => value === (modelName as Anthropic.Messages.Model),
  );
}

export function isValidGoogleAiModelName(
  modelName: string,
): modelName is GoogleAIModelName {
  return AVAILABLE_GOOGLE_AI_MODELS.some(
    ({ value }) => value === (modelName as GoogleAIModelName),
  );
}

export function isValidOpenAiModelName(
  modelName: string,
): modelName is OpenAI.Chat.ChatModel {
  return AVAILABLE_OPENAI_MODELS.some(
    ({ value }) => value === (modelName as OpenAI.Chat.ChatModel),
  );
}

export async function getConversation(
  conversationId: string,
): Promise<[Message[], Stats]> {
  const filePath = path.join(conversationsDir, `./${conversationId}.json`);
  return Promise.all([
    fs
      .readFile(filePath, { encoding: 'utf8' })
      .then((file) => JSON.parse(file) as Message[]),
    fs.stat(filePath),
  ]);
}

interface FileInfo {
  fullPath: string;
  id: string;
  stats: Stats;
}

export async function getConversationFiles(maxNum: number | undefined) {
  const pathsAndStats: FileInfo[] = [];

  for (const file of await fs.readdir(conversationsDir)) {
    const fullPath = path.join(conversationsDir, file);
    pathsAndStats.push({
      fullPath,
      id: file.replace(/\.json$/, ''),
      stats: await fs.stat(fullPath),
    });
  }

  return pathsAndStats
    .sort(({ stats: statsA }, { stats: statsB }) => {
      return Number(statsB.mtime) - Number(statsA.mtime);
    })
    .slice(0, maxNum);
}

export async function patchState(partialState: Partial<CliState>) {
  const state = await readState();
  return fs.writeFile(
    path.join(dataDir, './state.json'),
    JSON.stringify({ ...state, ...partialState }),
    { encoding: 'utf8' },
  );
}

export function printModelInformation(selectedModel: string) {
  process.stdout.write(
    `Model in use: ${selectedModel}.

Available models:\n- ${AVAILABLE_MODELS.map((model) => `${model.value}${!model.description ? '' : `\n  - ${model.description}`}`).join('\n- ')}

Pricing:
- https://www.anthropic.com/pricing#anthropic-api
- https://openai.com/api/pricing
- https://ai.google.dev/pricing
`,
  );
}

export async function readState(): Promise<CliState> {
  try {
    const file = await fs.readFile(path.join(dataDir, './state.json'), {
      encoding: 'utf8',
    });
    return JSON.parse(file) as CliState;
  } catch {
    return { currentConversation: null, selectedModel: null };
  }
}
