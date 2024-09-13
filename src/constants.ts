import path from 'path';

import { GoogleAIModelName, ModelName, OpenAIModelName } from './types';

export const dataDir = path.join(__dirname, '../data/');
export const conversationsDir = path.join(dataDir, './conversations/');

export const isTerminal = process.stdout.isTTY;

export const DEFAULT_MODEL = 'gpt-4-turbo';
// https://ai.google.dev/gemini-api/docs/models/gemini
const AVAILABLE_GOOGLE_AI_MODELS: GoogleAIModelName[] = [
  'gemini-1.5-flash', // 1M+ tokens - Free - May 2024 (last update)
  'gemini-1.5-pro', // 2M+ tokens - Free - May 2024 (last update)
];
// https://platform.openai.com/docs/models
// https://openai.com/api/pricing/
export const AVAILABLE_OPENAI_MODELS: OpenAIModelName[] = [
  DEFAULT_MODEL, // 128,000 tokens - $10.00 / 1M tokens - Up to Dec 2023
  'gpt-4o', // 128,000 tokens - $5.00 / 1M input tokens - Up to Oct 2023
  'gpt-4o-mini', // 128,000 tokens - $0.600 / 1M output tokens - Up to Oct 2023
  'gpt-3.5-turbo', // 16,385 tokens - $0.50 / 1M input tokens - Up to Sep 2021
  'o1-mini', // 128,000 tokens - $3.00 / 1M input tokens - $12.00 / 1M output tokens - Up to Oct 2023
  'o1-preview', // 128,000 tokens - $15.00 / 1M input tokens - $60.00 / 1M output tokens - Up to Oct 2023
];
export const AVAILABLE_MODELS: ModelName[] = [
  ...AVAILABLE_GOOGLE_AI_MODELS,
  ...AVAILABLE_OPENAI_MODELS,
];

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

  --full-conversation
                Tells the script to expect a full conversation in the message.
                i.e. multiple messages, a back and forth conversation. This
                option assumes the conversation is stored elsewhere, e.g.
                a file or buffer, and will not save the conversation.

  -h, --help    Displays this help message and exits.

  -l, --list-conversations=<number>
                Lists all available conversations. If a number is provided,
                the application will only list that amount of conversations.

  -m, --model-name=<name>
                Specifies the model to use for the conversation. The default
                model is "gpt-4-turbo".

                Available models:${AVAILABLE_MODELS.map((model) => `\n                - ${model}`).join('')}

  -n, --no-save
                Disables saving a new conversation or continuation of an
                existing conversation. The default is to save.

  -s, --set-model=<name>
                Sets the model to use for the conversation. This option
                will save the model for future conversations.

  -t, --token-count
                Displays the token count and cost in cents for the provided
                message.

  -v, --view-conversation=<id>
                Views a particular conversation given its ID. If no ID is
                provided, the application will use the current conversation.

  -vm --view-model
                Views the model currently in use.

Examples:
  kf-chat-cli -c "Hello world"
                Sends "Hello world" message, continuing with the current
                conversation.

  kf-chat-cli --list-conversations
                Lists all conversations without sending a message.

  kf-chat-cli -v=12345
                Views the conversation with ID 12345.

  echo "Hello again" | kf-chat-cli
                Sends "Hello again" message.

  kf-chat-cli <<'EOF'
  heredoc> Hello, what does \`ls\` do?
  heredoc> EOF
                Uses a heredoc to send a message. Useful for now worrying about
                escaping lines. EOF without quotes will perform variable and
                command substitution within the heredoc (you may want this).

  {
    echo "Some text before the file content"
    cat ./my-file.txt
    echo "Some text after the file content"
  } | kf-chat-cli
                Uses a group command \`{ ... }\` to group multiple commands
                together, whose combined output is then sent as a message.

Note:
  If a conversation ID is not specified with the '-c', '-d', or '-v' options
  and the current conversation exists, the application will default to
  the current conversation.

`;
