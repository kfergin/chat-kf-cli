import readline from 'readline';

import { isTerminal } from './constants';
import {
  deleteConversation as deleteConversationFile,
  getConversation,
  getConversationFiles,
  readState,
  writeState,
} from './utils';

function confirm(message: string) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Ask for confirmation
    rl.question(message, (answer) => {
      if (answer.toLowerCase() === 'yes') {
        resolve(true);
      } else {
        resolve(false);
      }
      rl.close();
    });
  });
}

export default async function deleteConversation(
  conversationId: string | null,
) {
  if (!conversationId) {
    process.stderr.write('Please specify a conversation to delete\n\n');
    process.exit(1);
  }

  let firstMessage;
  try {
    firstMessage = await getConversation(conversationId).then(([messages]) =>
      messages[0].content.trim(),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
      process.stderr.write(`Invalid conversation id: "${conversationId}"\n\n`);
      process.exit(1);
    } else {
      throw error;
    }
  }

  const shouldContinue = await confirm(
    `
Conversation Id: ${conversationId}
First Message: ${firstMessage}

Are you sure you want delete this conversation? yes/no: `,
  );

  if (!shouldContinue) {
    process.stdout.write('Canceling...\n\n');
    process.exit(0);
  }

  await deleteConversationFile(conversationId);

  const { currentConversation } = await readState();
  if (conversationId === currentConversation) {
    const [lastModified] = await getConversationFiles(1);
    await writeState({ currentConversation: lastModified?.id ?? null });
  }

  if (isTerminal) {
    process.stdout.write('\n');
  }

  process.stdout.write(`Deleted.\n\n`);
}
