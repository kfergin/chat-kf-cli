import fs from 'fs/promises';
import path from 'path';

import { v4 as uuid } from 'uuid';

import { conversationsDir } from './constants';
import { getConversation, writeState } from './utils';
import { Message } from './types';
import promptOpenai from './prompt-openai';

interface PromptArgs {
  content: string;
  conversationId: string | null;
  fullConversation: boolean;
  saveConversation: boolean;
}

const FULL_CONVERSATION_DELIMITER = '---chat-delimiter---';

function getMessagesFromFullConversation(fullContent: string): Message[] {
  return fullContent
    .split(FULL_CONVERSATION_DELIMITER)
    .map((content, index) => ({
      role: index % 2 === 0 ? 'user' : 'assistant',
      content,
    }));
}

export default async function prompt({
  content,
  conversationId,
  fullConversation,
  saveConversation,
}: PromptArgs) {
  if (!content) {
    process.stderr.write(
      'Please provide text as an argument or pass through stdin\n',
    );
    process.exit(1);
  }

  if (fullConversation && saveConversation) {
    process.stderr.write(
      'You cannot save a full conversation. --full-conversation assumes the conversation is stored elsewhere, e.g. a file or buffer.\n',
    );
    process.exit(1);
  }

  process.stdout.write(
    `\n${
      fullConversation
        ? FULL_CONVERSATION_DELIMITER
        : String.fromCodePoint(0x1f916)
    }\n\n`,
  );

  try {
    const priorMessages: Message[] = fullConversation
      ? getMessagesFromFullConversation(content)
      : !conversationId
        ? []
        : await getConversation(conversationId).then(([messages]) => messages);
    const messages: Message[] = [...priorMessages, { role: 'user', content }];

    const fullResponse = await promptOpenai({ messages });

    if (!fullConversation) {
      process.stdout.write('\n\n');
    } else {
      process.stdout.write(`\n\n${FULL_CONVERSATION_DELIMITER}\n\n`);
    }

    if (!saveConversation) return;

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const convoId = conversationId || uuid();
    messages.push({ role: 'assistant', content: fullResponse });

    await writeState({ currentConversation: convoId });
    await fs.writeFile(
      path.join(conversationsDir, `./${convoId}.json`),
      JSON.stringify(messages),
      { encoding: 'utf8' },
    );
  } catch (error) {
    process.stderr.write('An error occurred while processing the request.\n');
    process.stderr.write(error?.toString() ?? '(No error message)');
    process.stderr.write('\n');
    process.exit(1);
  }
}
