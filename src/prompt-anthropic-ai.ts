import Anthropic from '@anthropic-ai/sdk';

import { Message } from './types';

interface PromptAnthropicaiArgs {
  messages: Message[];
  modelName: Anthropic.Messages.Model;
}

export default async function promptAnthropicAi({
  messages,
  modelName,
}: PromptAnthropicaiArgs) {
  const apiKey = process.env['ANTHROPIC_API_KEY'];
  if (!apiKey) {
    throw Error(
      'Please provide an Anthropic API key in the ANTHROPIC_API_KEY environment variable.\n',
    );
  }

  const anthropic = new Anthropic({ apiKey });

  const stream = await anthropic.messages.create({
    stream: true,
    model: modelName,
    max_tokens: 1000,
    temperature: 0,
    // system: 'Respond only with short poems.',
    messages,
  });

  let fullResponse = '';

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      const text = chunk.delta.text;
      process.stdout.write(text);
      fullResponse += text;
    }
  }

  return fullResponse;
}
