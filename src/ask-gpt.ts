import fs from 'fs/promises';
import path from 'path';

import OpenAI from 'openai';
import { v4 as uuid } from 'uuid';
import { conversationsDir, dataDir } from './constants';

type Message = {
  role: 'assistant' | 'user';
  content: string;
};

export default async function askGpt(
  content: string,
  conversationId: string | null,
) {
  if (!content) {
    process.stderr.write(
      'Please provide an argument or pass data through stdin\n',
    );
    process.exit(1);
  }

  process.stderr.write('\n' + String.fromCodePoint(0x1f916) + '...\n\n');

  try {
    const priorMessages: Message[] = !conversationId
      ? []
      : await fs
          .readFile(path.join(conversationsDir, `./${conversationId}.json`), {
            encoding: 'utf8',
          })
          .then((file) => JSON.parse(file));
    const messages: Message[] = [...priorMessages, { role: 'user', content }];

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      messages,
      model: 'gpt-4-1106-preview',
      stream: true,
      // temperature: 0,
      // max_tokens: maxTokensResponse,
    });

    let fullResponse = '';

    for await (const chunk of completion) {
      const content = chunk.choices[0].delta.content;
      // e.g.
      // `choices: [ { index: 0, delta: { content: '.' }, finish_reason: null } ]`
      // `choices: [ { index: 0, delta: {}, finish_reason: 'stop' } ]`
      if (content) {
        process.stdout.write(content);
        fullResponse += content;
      }
    }
    process.stdout.write('\n\n');

    const convoId = conversationId || uuid();
    messages.push({ role: 'assistant', content: fullResponse });

    await fs.writeFile(
      path.join(dataDir, './state.json'),
      JSON.stringify({ currentConversation: convoId }),
      { encoding: 'utf8' },
    );
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
