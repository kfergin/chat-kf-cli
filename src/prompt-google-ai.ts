import { GoogleGenAI } from '@google/genai';

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

  const ai = new GoogleGenAI({ apiKey });
  const chat = ai.chats.create({
    model: modelName,
    history: priorMessages.map(({ role, content }) => ({
      role: role === 'user' ? 'user' : 'model',
      parts: [{ text: content }],
    })),
  });
  const response = await chat.sendMessageStream({
    message: lastMessage.content,
  });

  let fullResponse = '';

  for await (const chunk of response) {
    const chunkText = chunk.text;
    if (chunkText) {
      process.stdout.write(chunkText);
      fullResponse += chunkText;
    }
  }

  return fullResponse;
}
