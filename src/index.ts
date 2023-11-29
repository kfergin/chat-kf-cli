process.stdin.setEncoding('utf8');
process.stderr.setEncoding('utf8');

async function getMessage() {
  const [messageArg] = process.argv.slice(2);

  return new Promise<[string | null, string | null]>((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve([
        'Please provide an argument or pass data through stdin\n',
        null,
      ]);
    }, 100);

    if (messageArg) {
      clearTimeout(timeoutId);
      resolve([null, messageArg]);
    } else {
      // Receive data from a Here document
      process.stdin.on('data', function (data) {
        clearTimeout(timeoutId);
        resolve([null, data.toString()]);
      });
    }
  });
}

async function main() {
  process.stdin.setEncoding('utf8');
  process.stderr.setEncoding('utf8');

  const [errorMessage, message] = await getMessage();

  if (errorMessage) {
    process.stderr.write(errorMessage + '\n');
    process.exit(1);
  }

  process.stdout.write(message + '\n');
}

main();
