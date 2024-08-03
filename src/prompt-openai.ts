import OpenAI from 'openai';
import { Message, OpenAIModelName } from './types';

interface PromptOpenaiArgs {
  messages: Message[];
  modelName: OpenAIModelName;
}

export default async function promptOpenai({
  messages,
  modelName,
}: PromptOpenaiArgs) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw Error(
      'Please provide an OpenAI API key in the OPENAI_API_KEY environment variable.\n',
    );
  }
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    messages,
    model: modelName,
    stream: true,
    temperature: 0,
    // max_tokens: maxTokensResponse,
  });

  let fullResponse = '';

  for await (const chunk of completion) {
    const content = chunk.choices[0].delta.content;
    // e.g.
    // `choices: [ { index: 0, delta: { content: '.' }, finish_reason: null } ]`
    // `choices: [ { index: 0, delta: {}, finish_reason: 'stop' } ]`
    if (content) {
      process.stdout.write(content);
      fullResponse += content;
    }
  }

  return fullResponse;
}
