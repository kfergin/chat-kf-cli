export default async function getContentAndOptions(): Promise<
  [string, string[]]
> {
  const [messageArg, options] = process.argv
    .slice(2)
    .reduce<[string, string[]]>(
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

  if (!message) {
    process.stderr.write(
      'Please provide an argument or pass data through stdin\n',
    );
    process.exit(1);
  }

  return [message, options];
}
