#!/usr/bin/env node
const fs = require('fs');
const { spawn } = require('child_process');

const fileName = process.argv[2];

const CHAT_DELIMITER = '---chat-delimiter---';

try {
  const content = fs.readFileSync(fileName, { encoding: 'utf8' });
  const messages = content.split('\n').reduce(
    (messages, line) => {
      const lastMessage = messages[messages.length - 1];

      if (line.includes(CHAT_DELIMITER)) {
        messages.push({
          role: lastMessage.role === 'user' ? 'assistant' : 'user',
          content: '',
        });
        return messages;
      }

      if (lastMessage.content !== '') {
        lastMessage.content += '\n';
      }
      lastMessage.content += line;

      return messages;
    },
    [{ role: 'user', content: '' }],
  );

  fs.appendFileSync(fileName, `\n${CHAT_DELIMITER}\n\n`);

  // https://platform.openai.com/docs/api-reference/chat
  const curlProcess = spawn('curl', [
    '--no-buffer',
    '--silent',
    'https://api.openai.com/v1/chat/completions',
    '--header',
    `Authorization: Bearer ${process.env.OPENAI_API_KEY}`,
    '--header',
    'content-type: application/json',
    '--data',
    JSON.stringify({
      messages,
      model: 'gpt-4o-mini',
      stream: true,
      temperature: 0,
    }),
  ]);

  let buffer = '';

  curlProcess.stdout.on('data', (data) => {
    const dataString = data.toString();

    if (!dataString.startsWith('data: ')) {
      throw Error(dataString);
    }

    buffer += dataString;

    // Process complete lines
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep the last incomplete line in the buffer

    lines.forEach((line) => {
      if (line.startsWith('data: ')) {
        try {
          const jsonData = JSON.parse(line.substring(6));
          const text = jsonData.choices?.[0]?.delta.content;
          if (text) {
            // write to stdout to show progress in terminal
            process.stdout.write(text);
            // update the chat file
            fs.appendFileSync(fileName, text);
          }
        } catch {
          // Ignore parsing errors
        }
      }
    });
  });

  curlProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  curlProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`curl process exited with code ${code}`);
    }

    fs.appendFileSync(fileName, `${buffer}\n\n${CHAT_DELIMITER}\n\n`);
    process.stdout.write('\n');
  });
} catch (err) {
  console.error(err);
}
