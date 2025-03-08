import ollama, { ChatRequest } from 'ollama';

import { Message } from './types';

interface PromptOllamaArgs {
  messages: Message[];
  modelName: ChatRequest['model'];
}

export default async function promptOllama({
  messages,
  modelName,
}: PromptOllamaArgs) {
  const stream = await ollama.chat({
    model: modelName,
    messages,
    stream: true,
    options: { temperature: 0 },
  });

  let fullResponse = '';

  for await (const chunk of stream) {
    const text = chunk.message.content;
    process.stdout.write(text);
    fullResponse += text;
  }

  return fullResponse;
}
