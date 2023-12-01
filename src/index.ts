import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';

import { dataDir } from './constants';

import getContentAndOptions from './get-content-and-options';
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

async function main() {
  process.stdin.setEncoding('utf8');
  process.stderr.setEncoding('utf8');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const [content, options] = await getContentAndOptions();

  if (options.some((opt) => /-h|--help/.test(opt))) {
    process.stdout.write(HELP_MESSAGE);
    process.exit(0);
  }

  askGpt(content);
}

main();
