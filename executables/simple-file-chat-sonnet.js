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

  const curlProcess = spawn('curl', [
    '--no-buffer',
    '--silent',
    'https://api.anthropic.com/v1/messages',
    '--header',
    `x-api-key: ${process.env.ANTHROPIC_API_KEY}`,
    '--header',
    'anthropic-version: 2023-06-01',
    '--header',
    'content-type: application/json',
    '--data',
    JSON.stringify({
      // https://docs.anthropic.com/en/docs/about-claude/models/all-models
      max_tokens: 8192,
      messages,
      model: 'claude-3-5-sonnet-latest',
      stream: true,
      temperature: 0,
    }),
  ]);

  let buffer = '';

  curlProcess.stdout.on('data', (data) => {
    const dataString = data.toString();

    if (dataString.startsWith(`{"type":"error"`)) {
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
          if (jsonData.delta?.text) {
            // write to stdout to show progress in terminal
            process.stdout.write(jsonData.delta.text);
            // update the chat file
            fs.appendFileSync(fileName, jsonData.delta.text);
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
