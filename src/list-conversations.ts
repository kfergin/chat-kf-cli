import fs from 'fs/promises';

import { isTerminal } from './constants';
import { Message } from './types';
import { getConversationFiles } from './utils';

export default async function listConversations(
  numConversationsListed: number | undefined,
) {
  if (isTerminal) {
    process.stdout.write('\n');
  }

  for (const fileInfo of await getConversationFiles(numConversationsListed)) {
    const conversation = JSON.parse(
      await fs.readFile(fileInfo.fullPath, { encoding: 'utf8' }),
    ) as Message[];
    let firstMessageLine = conversation[0]?.content.trim().split('\n')[0];

    if (
      isTerminal &&
      firstMessageLine &&
      firstMessageLine.length > process.stdout.columns
    ) {
      firstMessageLine = firstMessageLine.slice(0, process.stdout.columns + 1);
    }

    process.stdout.write(firstMessageLine + '\n');
    process.stdout.write(`  Id: ${fileInfo.id}\n`);
    process.stdout.write(
      `  Last Modified: ${fileInfo.stats.mtime.toString()}\n`,
    );
    process.stdout.write('\n');
  }
}
