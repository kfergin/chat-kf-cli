import { isTerminal } from './constants';
import { getConversation } from './utils';

export default async function viewConversation(conversationId: string | null) {
  if (!conversationId) {
    process.stderr.write("You don't have any converstations to view\n");
    process.exit(1);
  }

  const [messages, stats] = await getConversation(conversationId);

  if (isTerminal) {
    process.stdout.write('\n');
  }

  process.stdout.write(`Id: ${conversationId}\n`);
  process.stdout.write(`Last Modified: ${stats.mtime}\n`);
  for (const message of messages) {
    process.stdout.write(
      `\n${
        message.role === 'user'
          ? String.fromCodePoint(0x1f978)
          : String.fromCodePoint(0x1f916)
      }\n\n`,
    );
    process.stdout.write(message.content + '\n');
  }
  process.stdout.write('\n');
}
