import { encoding_for_model } from 'tiktoken';

export default async function countContentTokens(content: string) {
  if (!content) {
    process.stderr.write(
      'Please provide text as an argument or pass through stdin\n',
    );
    process.exit(1);
  }

  const model = 'gpt-4-turbo-preview';
  const encoding = encoding_for_model(model);
  const tokenCount = encoding.encode(content).length;
  encoding.free();

  const costPerTokenInMillicents = 1; // 1¢ / 1K Tokens
  const exactCostInCents = (tokenCount * costPerTokenInMillicents) / 1000;
  const totalNumDigets =
    String(exactCostInCents).match(/\.(\d+)/)?.[1].length ?? 0;
  let digits = 3;
  let costInCents = exactCostInCents.toFixed(digits);
  while (digits <= totalNumDigets && /\.0+$/.test(String(costInCents))) {
    digits++;
    costInCents = exactCostInCents.toFixed(digits);
  }

  process.stdout.write(`
Model: ${model} @ 1¢ / 1K Tokens
Token count: ${tokenCount}
Cost: ${costInCents}¢

`);
}
