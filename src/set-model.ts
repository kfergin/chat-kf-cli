import { AVAILABLE_MODELS } from './constants';
import { isValidModelName, patchState } from './utils';

export default async function setModel(modelName: string) {
  const modelToSet = isValidModelName(modelName)
    ? modelName
    : AVAILABLE_MODELS.find((model) => model.includes(modelName));

  if (!modelToSet) {
    process.stderr.write(
      `No matching model. Available options: ${AVAILABLE_MODELS.join(', ')}\n`,
    );
    process.exit(1);
  }

  try {
    await patchState({ selectedModel: modelToSet });
    process.stdout.write(`Model set to "${modelToSet}"\n`);
  } catch (error) {
    console.log(error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    process.stderr.write(`An error occurred:\n${errorMessage}\n`);
  }
}
