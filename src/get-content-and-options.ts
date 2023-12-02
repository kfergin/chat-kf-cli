import { readState } from './utils';

type Options = {
  conversationId: string | null;
  help: boolean;
  listConversations: boolean;
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
    conversationId: null,
    help: false,
    listConversations: false,
  };

  for (const flag of flags) {
    if (/^-c|^--continue-conversation/.test(flag)) {
      const state = await readState();
      options.conversationId = state.currentConversation;
    } else if (/^-h|^--help/.test(flag)) {
      options.help = true;
    } else if (/^-l|^--list-conversations/.test(flag)) {
      options.listConversations = true;
    }
  }

  return [message, options];
}
