import path from 'path';

import dotenv from 'dotenv';

import askGpt from './ask-gpt';

// the default `path` is `path.resolve(process.cwd(), '.env')`
// and I want to call this command from anywhere
dotenv.config({ path: path.join(__dirname, '../.env') });

const HELP_MESSAGE = `USAGE:

\`\`\`shell
$ kf-chat-cli [option flags] "What is the meaning of life?"
\`\`\`

Stdin can also be used to pass a message to gpt

\`\`\`shell
$ kf-chat-cli [option flags] <<'EOF'
heredoc>What does this do?
heredoc>\`\`\`javascript
heredoc>  console.log('42');
heredoc>\`\`\`
heredoc>EOF
$
# OR
$ cat some-file.ts | kf-chat-cli [option flags]
\`\`\`

`;

async function getContentAndOptions(): Promise<[string, string[]]> {
  const [messageArg, options] = process.argv
    .slice(2)
    .reduce<[string, string[]]>(
      (arr, arg) => {
        if (/^-/.test(arg)) {
          arr[1].push(arg);
        } else {
          arr[0] = arg;
        }
        return arr;
      },
      ['', []],
    );

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

  return [message, options];
}

async function main() {
  process.stdin.setEncoding('utf8');
  process.stderr.setEncoding('utf8');

  const [content, options] = await getContentAndOptions();

  if (options.some((opt) => /-h|--help/.test(opt))) {
    process.stdout.write(HELP_MESSAGE);
    process.exit(0);
  }

  askGpt(content as string);
}

main();
