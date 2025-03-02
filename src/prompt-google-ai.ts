import { GoogleGenerativeAI } from '@google/generative-ai';

import { GoogleAIModelName, Message } from './types';

interface PromptGoogleAIArgs {
  messages: Message[];
  modelName: GoogleAIModelName;
}

export default async function promptGoogleAI({
  messages,
  modelName,
}: PromptGoogleAIArgs) {
  const apiKey = process.env['GOOGLE_API_KEY'];
  if (!apiKey) {
    throw Error(
      'Please provide a Google API key in the GOOGLE_API_KEY environment variable.\n',
    );
  }

  const priorMessages = messages.length > 1 ? messages.slice(0, -1) : [];
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage) {
    throw Error('promptGoogleAI() was called with zero messages.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  // https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=node
  const chat = model.startChat({
    history: priorMessages.map(({ role, content }) => ({
      role: role === 'user' ? 'user' : 'model',
      parts: [{ text: content }],
    })),
  });
  const result = await chat.sendMessageStream(lastMessage.content);

  let fullResponse = '';

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
    fullResponse += chunkText;
  }

  return fullResponse;
}
