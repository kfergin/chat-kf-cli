import path from 'path';

import dotenv from 'dotenv';

import askGpt from './ask-gpt';

// the default `path` is `path.resolve(process.cwd(), '.env')`
// and I want to call this command from anywhere
dotenv.config({ path: path.join(__dirname, '../.env') });

async function getMessage() {
  const [messageArg] = process.argv.slice(2);

  const message = await new Promise<string>((resolve) => {
    const timeoutId = setTimeout(() => resolve(''), 100);

    if (messageArg) {
      clearTimeout(timeoutId);
      resolve(messageArg);
    } else {
      // Receive data from stdin (including a Here document)
      process.stdin.on('data', function (data) {
        clearTimeout(timeoutId);
        resolve(data.toString());
      });
    }
  });

  if (!message) {
    process.stderr.write(
      'Please provide an argument or pass data through stdin\n',
    );
    process.exit(1);
  }

  return message;
}

async function main() {
  process.stdin.setEncoding('utf8');
  process.stderr.setEncoding('utf8');

  const content = await getMessage();

  askGpt(content as string);
}

main();
