import fs from 'fs/promises';
import path from 'path';

import { dataDir } from './constants';

type State = {
  currentConversation: string | null;
};

export async function readState(): Promise<State> {
  try {
    const file = await fs.readFile(path.join(dataDir, './state.json'), {
      encoding: 'utf8',
    });
    return JSON.parse(file);
  } catch {
    return { currentConversation: null };
  }
}

export function writeState(state: State) {
  return fs.writeFile(
    path.join(dataDir, './state.json'),
    JSON.stringify(state),
    { encoding: 'utf8' },
  );
}
