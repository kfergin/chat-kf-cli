import fs from 'fs/promises';
import path from 'path';

import dotenv from 'dotenv';

import { HELP_MESSAGE, conversationsDir, dataDir } from './constants';

import getContentAndOptions from './get-content-and-options';
import askGpt from './ask-gpt';
import countContentTokens from './count-content-tokens';
import deleteConversation from './delete-conversation';
import listConversations from './list-conversations';
import viewConversation from './view-conversation';

// the default `path` is `path.resolve(process.cwd(), '.env')`
// and I want to call this command from anywhere
dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  process.stdin.setEncoding('utf8');
  process.stderr.setEncoding('utf8');

  try {
    await fs.access(dataDir);
  } catch {
    // we could add this check: `error.code === 'ENOENT'`
    // I think it's fine though
    await Promise.all([fs.mkdir(dataDir), fs.mkdir(conversationsDir)]);
  }

  const [content, options] = await getContentAndOptions();

  if (options.help) {
    process.stdout.write(HELP_MESSAGE);
    process.exit(0);
  }

  if (options.listConversations) {
    await listConversations(options.numConversationsListed);
    process.exit(0);
  }

  if (options.viewConversation) {
    await viewConversation(options.conversationId);
    process.exit(0);
  }

  if (options.deleteConversation) {
    await deleteConversation(options.conversationId);
    process.exit(0);
  }

  if (options.tokenCount) {
    await countContentTokens(content);
    process.exit(0);
  }

  await askGpt(content, options.conversationId);
}

main();
