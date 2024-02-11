import path from 'path';

export const dataDir = path.join(__dirname, '../data/');
export const conversationsDir = path.join(dataDir, './conversations/');

export const isTerminal = process.stdout.isTTY;

export const HELP_MESSAGE = `Usage: kf-chat-cli [options] [message]

Arguments:
  message       Text to be processed by the application. If not provided,
                the application will wait to receive input from stdin.

Options:
  -c, --continue-conversation=<id>
                Continues a conversation using the specified conversation ID.
                If no ID is provided, the application will use the current
                conversation.

  -d, --delete-conversation=<id>
                Deletes a conversation using the specified conversation ID.
                If no ID is provided, the application will use the current
                conversation.

  -h, --help    Displays this help message and exits.

  -l, --list-conversations=<number>
                Lists all available conversations. If a number is provided,
                the application will only list that amount of conversations.

  -v, --view-conversation=<id>
                Views a particular conversation given its ID. If no ID is
                provided, the application will use the current conversation.

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
  If a conversation ID is not specified with the '-c', '-d', or '-v' options
  and the current conversation exists, the application will default to
  the current conversation.

`;
