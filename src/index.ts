import path from 'path';

import OpenAI from 'openai';
import dotenv from 'dotenv';

// the default `path` is `path.resolve(process.cwd(), '.env')`
// and I want to call this command from anywhere
dotenv.config({ path: path.join(__dirname, '../.env') });

async function getMessage() {
  const [messageArg] = process.argv.slice(2);

  return new Promise<[string | null, string | null]>((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve([
        'Please provide an argument or pass data through stdin\n',
        null,
      ]);
    }, 100);

    if (messageArg) {
      clearTimeout(timeoutId);
      resolve([null, messageArg]);
    } else {
      // Receive data from a Here document
      process.stdin.on('data', function (data) {
        clearTimeout(timeoutId);
        resolve([null, data.toString()]);
      });
    }
  });
}

async function main() {
  process.stdin.setEncoding('utf8');
  process.stderr.setEncoding('utf8');

  const [errorMessage, content] = await getMessage();

  if (errorMessage) {
    process.stderr.write(errorMessage + '\n');
    process.exit(1);
  }

  process.stderr.write('\n' + String.fromCodePoint(0x1f916) + '...\n\n');

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content }],
      model: 'gpt-4-1106-preview',
      stream: true,
      // temperature: 0,
      // max_tokens: maxTokensResponse,
    });

    for await (const chunk of completion) {
      const content = chunk.choices[0].delta.content;
      // e.g.
      // `choices: [ { index: 0, delta: { content: '.' }, finish_reason: null } ]`
      // `choices: [ { index: 0, delta: {}, finish_reason: 'stop' } ]`
      if (content) {
        process.stdout.write(content);
      }
    }
    process.stdout.write('\n\n');
  } catch (error) {
    process.stderr.write('An error occurred while processing the request.\n');
    process.stderr.write(error?.toString() ?? '(No error message)');
    process.stderr.write('\n');
    process.exit(1);
  }
}

main();
