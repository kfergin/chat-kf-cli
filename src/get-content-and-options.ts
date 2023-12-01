import { readState } from './utils';

type Options = {
  conversationId: string | null;
  help: boolean;
};

export default async function getContentAndOptions(): Promise<
  [string, Options]
> {
  const [messageArg, flags] = process.argv.slice(2).reduce<[string, string[]]>(
    (arr, arg) => {
      if (/^-/.test(arg)) {
        arr[1].push(arg);
      } else {
        arr[0] = arg;
      }
      return arr;
    },
    ['', []],
  );

  const message = await new Promise<string>((resolve) => {
    const timeoutId = setTimeout(() => resolve(''), 100);

    if (messageArg) {
      clearTimeout(timeoutId);
      resolve(messageArg);
    } else {
      // Receive data from stdin (including a Here document)
      process.stdin.on('data', function (data) {
        clearTimeout(timeoutId);
        resolve(data.toString());
      });
    }
  });

  const options: Options = {
    help: false,
    conversationId: null,
  };

  for (const flag of flags) {
    if (/^-h|^--help/.test(flag)) {
      options.help = true;
    } else if (/^-c|^--continue-conversation/.test(flag)) {
      const state = await readState();
      options.conversationId = state.currentConversation;
    }
  }

  return [message, options];
}
