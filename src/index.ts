import path from 'path';

import dotenv from 'dotenv';

import askGpt from './ask-gpt';

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
      // Receive data from stdin (including a Here document)
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

  askGpt(content as string);
}

main();
