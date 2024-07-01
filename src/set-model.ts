import { AVAILABLE_MODELS } from './constants';
import { isValidModelName, patchState } from './utils';

export default async function setModel(modelName: string) {
  if (!isValidModelName(modelName)) {
    process.stderr.write(
      `Invalid model name. Available options: ${AVAILABLE_MODELS.join(', ')}\n`,
    );
    process.exit(1);
  }

  try {
    await patchState({ selectedModel: modelName });
    process.stdout.write(`Model set to "${modelName}"\n`);
  } catch (error) {
    console.log(error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    process.stderr.write(`An error occurred:\n${errorMessage}\n`);
  }
}
