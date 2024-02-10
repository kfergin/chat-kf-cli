import { isTerminal } from './constants';
import {
  deleteConversation as deleteConversationFile,
  readState,
  writeState,
} from './utils';

export default async function deleteConversation(
  conversationId: string | null,
) {
  if (!conversationId) {
    process.stderr.write('Please specify a conversation to delete\n');
    process.exit(1);
  }

  try {
    await deleteConversationFile(conversationId);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
      process.stderr.write(`Invalid conversation id: "${conversationId}\n`);
      process.exit(1);
    } else {
      throw error;
    }
  }

  const { currentConversation } = await readState();
  if (conversationId === currentConversation) {
    await writeState({ currentConversation: null });
  }

  if (isTerminal) {
    process.stdout.write('\n');
  }

  process.stdout.write(`Id: ${conversationId}\n`);
  process.stdout.write(`Conversation deleted\n\n`);
}
