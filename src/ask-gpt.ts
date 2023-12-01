import OpenAI from 'openai';

export default async function askGpt(content: string) {
  if (!content) {
    process.stderr.write(
      'Please provide an argument or pass data through stdin\n',
    );
    process.exit(1);
  }

  process.stderr.write('\n' + String.fromCodePoint(0x1f916) + '...\n\n');

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content }],
      model: 'gpt-4-1106-preview',
      stream: true,
      // temperature: 0,
      // max_tokens: maxTokensResponse,
    });

    for await (const chunk of completion) {
      const content = chunk.choices[0].delta.content;
      // e.g.
      // `choices: [ { index: 0, delta: { content: '.' }, finish_reason: null } ]`
      // `choices: [ { index: 0, delta: {}, finish_reason: 'stop' } ]`
      if (content) {
        process.stdout.write(content);
      }
    }
    process.stdout.write('\n\n');
  } catch (error) {
    process.stderr.write('An error occurred while processing the request.\n');
    process.stderr.write(error?.toString() ?? '(No error message)');
    process.stderr.write('\n');
    process.exit(1);
  }
}
