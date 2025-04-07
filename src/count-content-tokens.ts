import { encoding_for_model } from 'tiktoken';

import { AVAILABLE_OPENAI_MODELS } from './constants';
import { isValidOpenAiModelName } from './utils';

export default function countContentTokens(content: string, modelName: string) {
  if (!content) {
    process.stderr.write(
      'Please provide text as an argument or pass through stdin\n',
    );
    process.exit(1);
  }

  if (!isValidOpenAiModelName(modelName)) {
    process.stderr.write(
      `Invalid model name: ${modelName}. Only OpenAI models are currently supported. Available models are: ${AVAILABLE_OPENAI_MODELS.join(', ')}\n`,
    );
    process.exit(1);
  }

  // @ts-expect-error ChatModel & TiktokenModel get out of sync sometimes
  const encoding = encoding_for_model(modelName);
  const tokenCount = encoding.encode(content).length;
  encoding.free();

  const costPerTokenInMillicents = 1; // 1¢ / 1K Tokens
  const exactCostInCents = (tokenCount * costPerTokenInMillicents) / 1000;
  const totalNumDigets =
    String(exactCostInCents).match(/\.(\d+)/)?.[1]?.length ?? 0;
  let digits = 3;
  let costInCents = exactCostInCents.toFixed(digits);
  while (digits <= totalNumDigets && /\.0+$/.test(String(costInCents))) {
    digits++;
    costInCents = exactCostInCents.toFixed(digits);
  }

  // https://platform.openai.com/docs/models
  // https://openai.com/pricing
  process.stdout.write(`
Model: ${modelName} @ 1¢ / 1K Tokens
Content Window: 128K tokens
Token count: ${tokenCount.toString()}
Cost: ${costInCents}¢

`);
}
