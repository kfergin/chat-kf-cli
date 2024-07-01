import { readState } from './utils';

interface Options {
  conversationId: string | null;
  deleteConversation: boolean;
  fullConversation: boolean;
  help: boolean;
  listConversations: boolean;
  noSave: boolean;
  numConversationsListed: number | undefined;
  selectedModel: string;
  setModel: boolean;
  tokenCount: boolean;
  viewConversation: boolean;
  viewModel: boolean;
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
    fullConversation: false,
    help: false,
    listConversations: false,
    noSave: false,
    numConversationsListed: undefined,
    selectedModel: state.selectedModel ?? 'gpt-4-turbo',
    setModel: false,
    tokenCount: false,
    viewConversation: false,
    viewModel: false,
  };

  for (const flag of flags) {
    if (/^-c|^--continue-conversation/.test(flag)) {
      options.conversationId =
        flag.match(/^-c=(.+)/)?.[1] ??
        flag.match(/^--continue-conversation=(.+)/)?.[1] ??
        state.currentConversation;
    } else if (/^-d|^--delete-conversation/.test(flag)) {
      options.deleteConversation = true;
      options.conversationId =
        flag.match(/^-d=(.+)/)?.[1] ??
        flag.match(/^--delete-conversation=(.+)/)?.[1] ??
        state.currentConversation;
    } else if (/^--full-conversation/.test(flag)) {
      options.fullConversation = true;
      options.noSave = true;
    } else if (/^-h|^--help/.test(flag)) {
      options.help = true;
    } else if (/^-l|^--list-conversations/.test(flag)) {
      const match =
        flag.match(/^-l=([1-9][0-9]*)/)?.[1] ??
        flag.match(/^--list-conversations=([1-9][0-9]*)/)?.[1];

      options.listConversations = true;
      if (match) {
        options.numConversationsListed = parseInt(match, 10);
      }
    } else if (/^-m|^--model-name/.test(flag)) {
      options.selectedModel =
        flag.match(/^-m=(.+)/)?.[1] ??
        flag.match(/^--model-name=(.+)/)?.[1] ??
        '';
    } else if (/^-n|^--no-save/.test(flag)) {
      options.noSave = true;
    } else if (/^-s|^--set-model/.test(flag)) {
      options.setModel = true;
      options.selectedModel =
        flag.match(/^-s=(.+)/)?.[1] ??
        flag.match(/^--set-model=(.+)/)?.[1] ??
        '';
    } else if (/^-t|^--token-count/.test(flag)) {
      options.tokenCount = true;
    } else if (/^-v(=.*)?$|^--view-conversation/.test(flag)) {
      options.viewConversation = true;
      options.conversationId =
        flag.match(/^-v=(.+)/)?.[1] ??
        flag.match(/^--view-conversation=(.+)/)?.[1] ??
        state.currentConversation;
    } else if (/^-vm|^--view-model/.test(flag)) {
      options.viewModel = true;
    }
  }

  return [message, options];
}
