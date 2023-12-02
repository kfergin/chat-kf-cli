import fs from 'fs/promises';
import path from 'path';

import { conversationsDir, dataDir } from './constants';
import { Message } from './types';
import { Stats } from 'fs';

type CliState = {
  currentConversation: string | null;
};

export async function getConversation(
  conversationId: string,
): Promise<[Message[], Stats]> {
  const filePath = path.join(conversationsDir, `./${conversationId}.json`);
  return Promise.all([
    fs
      .readFile(filePath, { encoding: 'utf8' })
      .then((file) => JSON.parse(file)),
    fs.stat(filePath),
  ]);
}

export async function readState(): Promise<CliState> {
  try {
    const file = await fs.readFile(path.join(dataDir, './state.json'), {
      encoding: 'utf8',
    });
    return JSON.parse(file);
  } catch {
    return { currentConversation: null };
  }
}

export function writeState(state: CliState) {
  return fs.writeFile(
    path.join(dataDir, './state.json'),
    JSON.stringify(state),
    { encoding: 'utf8' },
  );
}
