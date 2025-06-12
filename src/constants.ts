import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

import { GoogleAIModelName, ModelName, OllamaModelName } from './types';

export const dataDir = path.join(__dirname, '../data/');
export const conversationsDir = path.join(dataDir, './conversations/');

export const isTerminal = process.stdout.isTTY;

export const DEFAULT_MODEL = 'gpt-3.5-turbo';

type AvailableModel<Value> = {
  value: Value;
  description?: string;
};

// https://docs.anthropic.com/en/docs/about-claude/models
// https://www.anthropic.com/pricing#anthropic-api
// TODO: Add descriptions
export const AVAILABLE_ANTHROPIC_AI_MODELS: AvailableModel<Anthropic.Messages.Model>[] =
  [
    {
      value: 'claude-opus-4-0',
      description:
        'Our most capable model. Highest level of intelligence and capability.',
    },
    {
      value: 'claude-sonnet-4-0',
      description:
        'High-performance model. High intelligence and balanced performance.',
    },
    {
      value: 'claude-3-7-sonnet-latest',
      description:
        'High-performance model with early extended thinking. High intelligence with toggleable extended thinking.',
    },
    {
      value: 'claude-3-5-sonnet-latest',
      description:
        'Our previous intelligent model. High level of intelligence and capability.',
    },
    {
      value: 'claude-3-5-haiku-latest',
      description: 'Our fastest model. Intelligence at blazing speeds.',
    },
    {
      value: 'claude-3-opus-latest',
      description:
        'Powerful model for complex tasks. Top-level intelligence, fluency, and understanding.',
    },
  ];

// https://ai.google.dev/gemini-api/docs/models/gemini
// https://ai.google.dev/gemini-api/docs/pricing
// Note: many offer free tiers
export const AVAILABLE_GOOGLE_AI_MODELS: AvailableModel<GoogleAIModelName>[] = [
  {
    value: 'gemini-2.5-flash-preview-05-20',
    description:
      'Our best model in terms of price-performance, offering well-rounded capabilities. Gemini 2.5 Flash rate limits are more restricted since it is an experimental / preview model. Context: 1,048,576 input, 65,536 output. Price input: $0.15 / 1M prompts. Price output: Non-thinking: $0.60 / 1M prompts, Thinking: $3.50 / 1M prompts. Knowledge cutoff: January 2025.',
  },
  {
    value: 'gemini-2.5-pro-preview-06-05',
    description:
      'Gemini 2.5 Pro is our state-of-the-art thinking model, capable of reasoning over complex problems in code, math, and STEM, as well as analyzing large datasets, codebases, and documents using long context. Context: 1,048,576 input, 65,536 output. Price input: $1.25 / 1M prompts <= 200k tokens, $2.50 / 1M prompts > 200k tokens. Price output: $10.00 / 1M prompts <= 200k tokens, $15.00 / 1M prompts > 200k tokens. Knowledge cutoff: January 2025.',
  },
  {
    value: 'gemini-2.0-flash',
    description:
      'Gemini 2.0 Flash delivers next-gen features and improved capabilities, including superior speed, native tool use, multimodal generation, and a 1M token context window. Context: 1,048,576 input, 8,192 output. Price input: $0.10 / 1M prompts. Price output: $0.40 / 1M prompts. Knowledge cutoff: August 2024.',
  },
  {
    value: 'gemini-2.0-flash-lite',
    description:
      'A Gemini 2.0 Flash model optimized for cost efficiency and low latency. Context: 1,048,576 input, 8,192 output. Price input: $0.075 / 1M prompts. Price output: $0.30 / 1M prompts. Knowledge cutoff: August 2024.',
  },
  {
    value: 'gemini-1.5-flash',
    description:
      'Gemini 1.5 Flash is a fast and versatile multimodal model for scaling across diverse tasks. Context: 1,048,576 input, 8,192 output. Price input: $0.075 / 1M prompts <= 128k tokens, $0.15 / 1M prompts > 128k tokens. Price output: $0.30 / 1M prompts <= 128k tokens, $0.60 / 1M prompts > 128k tokens. Knowledge cutoff: September 2024.',
  },
  {
    value: 'gemini-1.5-pro',
    description:
      'Gemini 1.5 Pro is a mid-size multimodal model that is optimized for a wide-range of reasoning tasks. Context: 2,097,152 input, 8,192 output. Price input: $1.25 / 1M prompts <= 128k tokens, $2.50 / 1M prompts > 128k tokens. Price output: $5.00 / 1M prompts <= 128k tokens, $10.00 / 1M prompts > 128k tokens. Knowledge cutoff: September 2024.',
  },
];

const AVAILABLE_OLLAMA_MODELS: OllamaModelName[] = (() => {
  try {
    const filePath = path.join(__dirname, '../ollama-models.txt');
    const content = fs.readFileSync(filePath, 'utf8');
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    return [];
  }
})();

// https://platform.openai.com/docs/models
// https://openai.com/api/pricing/
export const AVAILABLE_OPENAI_MODELS: AvailableModel<OpenAI.Chat.ChatModel>[] =
  [
    /* FLAGSHIP CHAT MODELS */
    {
      value: 'gpt-4.1',
      description:
        'Flagship GPT model for complex tasks. 1,047,576 tokens - $2.00 / 1M input tokens - $8.00 / 1M output tokens - Up to May 31, 2024.',
    },
    {
      value: 'gpt-4.1-mini',
      description:
        'Balanced for intelligence, speed, and cost. 1,047,576 tokens - $0.40 / 1M input tokens - $1.60 / 1M output tokens - Up to May 31, 2024.',
    },
    {
      value: 'gpt-4.1-nano',
      description:
        'Fastest, most cost-effective GPT-4.1 model. 1,047,576 tokens - $0.10 / 1M input tokens - $0.40 / 1M output tokens - Up to May 31, 2024.',
    },
    {
      value: 'gpt-4o',
      description:
        'Fast, intelligent, flexible GPT model. 128,000 tokens - $2.50 / 1M input tokens - $10.00 / 1M output tokens - Up to Sep 30, 2023.',
    },
    {
      value: 'gpt-4o-mini',
      description:
        'Fast, affordable small model for focused tasks. 128,000 tokens - $0.15 / 1M output tokens - $0.60 / 1M output tokens - Up to Sep 30, 2023.',
    },
    {
      value: 'gpt-4-turbo',
      description:
        'An older high-intelligence GPT model. 128,000 tokens - $10.00 / 1M input tokens - $30.00 / 1M output tokens - Up to Nov 30, 2023.',
    },
    {
      value: 'gpt-4',
      description:
        'An older high-intelligence GPT model. 8,192 tokens - $30.00 / 1M input tokens - $60.00 / 1M output tokens - Up to Nov 30, 2023.',
    },
    {
      value: DEFAULT_MODEL,
      description:
        'Legacy GPT model for cheaper chat and non-chat tasks. 16,385 tokens - $0.50 / 1M input tokens - $1.50 / 1M input tokens - Up to Aug 31, 2021.',
    },

    /* REASONING MODELS */
    {
      value: 'o4-mini',
      description:
        'Faster, more affordable reasoning model. 200,000 tokens - $1.10 / 1M input tokens - $4.40 / 1M output tokens - Up to May 31, 2024.',
    },
    {
      value: 'o3',
      description:
        'Our most powerful reasoning model. 200,000 tokens - $10.00 / 1M input tokens - $40.00 / 1M output tokens - Up to May 31, 2024.',
    },
    {
      value: 'o3-mini',
      description:
        'A small model alternative to o3. 200,000 tokens - $1.10 / 1M input tokens - $4.40 / 1M output tokens - Up to Sep 30, 2023.',
    },
    {
      value: 'o1',
      description:
        'Previous full o-series reasoning model. 200,000 tokens - $15.00 / 1M input tokens - $60.00 / 1M output tokens - Up to Sep 30, 2023.',
    },
    {
      value: 'o1-mini',
      description:
        'A small model alternative to o1. 128,000 tokens - $1.10 / 1M input tokens - $4.40 / 1M output tokens - Up to Sep 30, 2023.',
    },
  ];

export const AVAILABLE_MODELS: AvailableModel<ModelName>[] = [
  ...AVAILABLE_ANTHROPIC_AI_MODELS,
  ...AVAILABLE_GOOGLE_AI_MODELS,
  ...AVAILABLE_OLLAMA_MODELS.map((value) => ({ value, description: '' })),
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

                Available models:${AVAILABLE_MODELS.map((model) => `\n                - ${model.value}`).join('')}

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
