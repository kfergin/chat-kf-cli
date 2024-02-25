import { readState } from './utils';

interface Options {
  conversationId: string | null;
  deleteConversation: boolean;
  help: boolean;
  listConversations: boolean;
  numConversationsListed: number | undefined;
  tokenCount: boolean;
  viewConversation: boolean;
}

export default async function getContentAndOptions(): Promise<
  [string, Options]
> {
  const [messageArg, flags] = process.argv.slice(2).reduce<[string, string[]]>(
    (arr, arg) => {
      if (arg.startsWith('-')) {
        arr[1].push(arg);
      } else {
        arr[0] = arg;
      }
      return arr;
    },
    ['', []],
  );

  const message = await new Promise<string>((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve('');
    }, 100);

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

  const state = await readState();

  const options: Options = {
    conversationId: null,
    deleteConversation: false,
    help: false,
    listConversations: false,
    numConversationsListed: undefined,
    tokenCount: false,
    viewConversation: false,
  };

  for (const flag of flags) {
    if (/^-c|^--continue-conversation/.test(flag)) {
      const [, shortMatch] = flag.match(/^-c=(.+)/) ?? [];
      const [, longMatch] = flag.match(/^--continue-conversation=(.+)/) ?? [];

      options.conversationId =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        shortMatch ?? longMatch ?? state.currentConversation;
    } else if (/^-d|^--delete-conversation/.test(flag)) {
      const [, shortMatch] = flag.match(/^-d=(.+)/) ?? [];
      const [, longMatch] = flag.match(/^--delete-conversation=(.+)/) ?? [];

      options.deleteConversation = true;
      options.conversationId =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        shortMatch ?? longMatch ?? state.currentConversation;
    } else if (/^-h|^--help/.test(flag)) {
      options.help = true;
    } else if (/^-l|^--list-conversations/.test(flag)) {
      const [, shortMatch] = flag.match(/^-l=([1-9][0-9]*)/) ?? [];
      const [, longMatch] =
        flag.match(/^--list-conversations=([1-9][0-9]*)/) ?? [];

      options.listConversations = true;
      if (shortMatch || longMatch) {
        options.numConversationsListed = parseInt(shortMatch || longMatch, 10);
      }
    } else if (/^-t|^--token-count/.test(flag)) {
      options.tokenCount = true;
    } else if (/^-v|^--view-conversation/.test(flag)) {
      const [, shortMatch] = flag.match(/^-v=(.+)/) ?? [];
      const [, longMatch] = flag.match(/^--view-conversation=(.+)/) ?? [];

      options.viewConversation = true;
      options.conversationId =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        shortMatch ?? longMatch ?? state.currentConversation;
    }
  }

  return [message, options];
}
