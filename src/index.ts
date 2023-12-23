import fs from 'fs/promises';
import path from 'path';

import dotenv from 'dotenv';

import { conversationsDir, dataDir } from './constants';

import getContentAndOptions from './get-content-and-options';
import askGpt from './ask-gpt';
import listConversations from './list-conversations';
import viewConversation from './view-conversation';

// the default `path` is `path.resolve(process.cwd(), '.env')`
// and I want to call this command from anywhere
dotenv.config({ path: path.join(__dirname, '../.env') });

const HELP_MESSAGE = `Usage: kf-chat-cli [options] [message]

Arguments:
  message       Text to be processed by the application. If not provided,
                the application will wait to receive input from stdin.

Options:
  -c, --continue-conversation=<id>
                Continues a conversation using the specified conversation ID.
                If no ID is provided, the application will use the current
                conversation state.

  -h, --help    Displays this help message and exits.

  -l, --list-conversations
                Lists all available conversations.

  -v, --view-conversation=<id>
                Views a particular conversation given its ID. If no ID is
                provided, the application will use the current conversation
                state.

Examples:
  kf-chat-cli -c "Hello world"
                Sends "Hello world" message and continues with the current
                conversation.

  kf-chat-cli --list-conversations
                Lists all conversations without sending a message.

  kf-chat-cli -v=12345
                Views the conversation with ID 12345.

  echo "Hello again" | kf-chat-cli
                Pipes "Hello again" message into the application and waits
                for further instructions.

  kf-chat-cli <<'EOF'
  heredoc> Hello, what does \`ls\` do?
  heredoc> EOF
                Uses a heredoc to send a message. Useful to not not worry
                about escaping lines.

Note:
  If a conversation ID is not specified with the '-c' or '-v' options and
  the current conversation state exists, the application will default to
  the current conversation.

`;

async function main() {
  process.stdin.setEncoding('utf8');
  process.stderr.setEncoding('utf8');

  try {
    await fs.access(dataDir);
  } catch {
    // we could add this check: `error.code === 'ENOENT'`
    // I think it's fine though
    await Promise.all([fs.mkdir(dataDir), fs.mkdir(conversationsDir)]);
  }

  const [content, options] = await getContentAndOptions();

  if (options.help) {
    process.stdout.write(HELP_MESSAGE);
    process.exit(0);
  }

  if (options.listConversations) {
    await listConversations();
    process.exit(0);
  }

  if (options.viewConversation) {
    await viewConversation(options.conversationId);
    process.exit(0);
  }

  await askGpt(content, options.conversationId);
}

main();
