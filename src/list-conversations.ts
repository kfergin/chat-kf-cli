import fs from 'fs/promises';
import path from 'path';

import { conversationsDir, isTerminal } from './constants';
import { Stats } from 'fs';

export default async function listConversations() {
  const files = await fs.readdir(conversationsDir);
  const fileStatsMap = new Map<string, Stats>();
  for (const file of files) {
    fileStatsMap.set(file, await fs.stat(path.join(conversationsDir, file)));
  }
  const sortedFiles = files.sort((fileA, fileB) => {
    return (
      Number(fileStatsMap.get(fileB)!.mtime) -
      Number(fileStatsMap.get(fileA)!.mtime)
    );
  });

  if (isTerminal) {
    process.stdout.write('\n');
  }

  for (const file of sortedFiles) {
    const filePath = path.join(conversationsDir, file);
    const stats = await fs.stat(filePath);

    const fileId = file.replace(/\.json$/, '');

    const conversation = await fs
      .readFile(filePath, { encoding: 'utf8' })
      .then((file) => JSON.parse(file));
    let firstMessageLine: string = conversation[0].content
      .trim()
      .split('\n')[0];

    if (isTerminal && firstMessageLine.length > process.stdout.columns) {
      firstMessageLine = firstMessageLine.slice(0, process.stdout.columns + 1);
    }

    process.stdout.write(firstMessageLine + '\n');
    process.stdout.write(`  Id: ${fileId}\n`);
    process.stdout.write(`  Last Modified: ${stats.mtime}\n`);
    process.stdout.write('\n');
  }
}
