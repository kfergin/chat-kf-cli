import { AVAILABLE_MODELS } from './constants';
import { patchState } from './utils';

export default async function setModel(modelNameMatch: string) {
  const modelToSet = /^\s*$/.test(modelNameMatch)
    ? undefined
    : AVAILABLE_MODELS.find((model) =>
        modelNameMatch.split(',').every((part) => model.value.includes(part)),
      );

  if (!modelToSet) {
    process.stderr.write(
      `No matching model for "${modelNameMatch}".

Available models:\n- ${AVAILABLE_MODELS.join('\n- ')}
`,
    );
    process.exit(1);
  }

  try {
    await patchState({ selectedModel: modelToSet.value });
    process.stdout.write(`Model set to "${modelToSet.value}"\n`);
  } catch (error) {
    console.log(error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    process.stderr.write(`An error occurred:\n${errorMessage}\n`);
  }
}
