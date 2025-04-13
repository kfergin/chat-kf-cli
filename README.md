# chat-kf-cli

A command-line interface for interacting with various AI models including
OpenAI's GPT, Google's Gemini, Anthropic's Claude, and Ollama's local models.

This has been my exploration in using LLMs in development work. There are
likely better options out there.

## Features

- Support for multiple AI providers:
  - OpenAI
  - Google
  - Anthropic
  - Ollama (Local models)
- Conversation management (save, continue, list, view, delete)
- Token counting
  - only supported for OpenAI and Anthropic
- Model selection and management
- Streaming responses
- Support for input via arguments or stdin

## Installation

1. Clone the repository
2. Run build script:

```bash
./bin/build.sh
```

3. Create `.env` file from template:

```bash
cp .env.example .env
```

4. Add your API keys to `.env`:

```
OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

5. Make CLI available globally

```bash
# must be run in repo
npm link
```

## Customizing CLI Name

The name of the CLI is set under the `bin` field in `package.json`. If you
would like to use a different name for the CLI, update `package.json`. For
example:

```json
  "bin": {
    "custom-chat": "./executables/index.js"
  },
```

If you've already run `npm link`, you need to run `npm unlink` and `npm link`
again.

## Usage for main CLI

Basic command structure:

```bash
kf-chat-cli [options] [message]
```

### Examples

Send a message:

```bash
kf-chat-cli "Hello world"
```

Continue conversation:

```bash
kf-chat-cli -c "Tell me more"
```

Use stdin:

```bash
echo "What does ls do?" | kf-chat-cli
```

Use heredoc:

```bash
kf-chat-cli <<'EOF'
Hello, what does `ls` do?
EOF
```

Use command group:

```bash
{
  echo "Some text before the file content"
  cat ./my-file.txt
  echo "Some text after the file content"
} | kf-chat-cli
```

### Options

Use --help flag for more description.

- `-c, --continue-conversation=<id>`: Continue a conversation
- `-d, --delete-conversation=<id>`: Delete a conversation
- `--full-conversation`: Process a full conversation format
- `-h, --help`: Display help
- `-l, --list-conversations=<number>`: List conversations
- `-m, --model-name=<name>`: Specify model
- `-n, --no-save`: Disable conversation saving
- `-s, --set-model=<name>`: Set default model
- `-t, --token-count`: Display token count and cost
- `-v, --view-conversation=<id>`: View a conversation
- `-vm --view-model`: View current model

### Models

Anthropic, Google, and OpenAI models are hardcoded (see `AVAILABLE_MODELS`).
For Ollama models, add their names to a `ollama-models.txt` file, one per line,
at the root of this repo.

## Executables

This repo also includes other helper or example scripts under the
`./executables/` directory.

### `anthropic-count-tokens.sh`

A shell script that counts tokens for text using Anthropic's API. Pipe text
content to get a token count for Claude 3 Sonnet.

```bash
echo "Hello, world" | ./anthropic-count-tokens.sh
```

### `cat-all-files.sh`

Concatenates multiple files into a single output file, preserving file paths as
headers. Accepts file paths via stdin.

```bash
# Basic usage
git ls-files '*.js' | ./cat-all-files.sh

# Custom output file
git ls-files | ./cat-all-files.sh -o output.txt
```

### `index.js`

The main executables for this repo. Wired up under the `bin` field in
`package.json`.

### `simple-curl-example-ollama.sh`

Demonstrates streaming chat completion with Ollama's local API. Pipes input
text to llama3.2 model and streams the response.

```bash
echo "Hello, world" | ./simple-curl-example-ollama.sh
```

### `simple-curl-example-sonnet.sh`

Demonstrates streaming chat completion with Anthropic's Claude 3 Sonnet API.

```bash
echo "Hello, world" | ./simple-curl-example-sonnet.sh
```

### `simple-file-chat-gpt.js`

A Node.js script for interacting with the OpenAI's chat completion API
(gpt-4o-mini) and saving conversations to a file. Takes a filename as an
argument, reads the file contents as a chat log, sends it to the API, and
appends the response to the same file, using `---chat-delimiter---` to separate
turns.

```bash
./simple-file-chat-gpt.js mychatfile.txt
```

### `simple-file-chat-sonnet.js`

Nearly identical to `simple-file-chat-gpt.js`, except it uses Anthropic's
`claude-3-5-sonnet-latest` model.

**Note**: Several scripts require `jq` to be installed for JSON processing. The
Anthropic scripts require an `ANTHROPIC_API_KEY` environment variable to be
set.

## Neovim integration

This is the keymap I use to chat in a buffer:

```lua
vim.keymap.set('n', '<leader>l', function()
  local buf = vim.api.nvim_get_current_buf()
  local buf_lines = vim.api.nvim_buf_get_lines(buf, 0, vim.api.nvim_buf_line_count(buf), false)

  local Job = require('plenary.job')

  ---@diagnostic disable-next-line: missing-fields
  Job:new({
    command = 'kf-chat-cli',
    args = { '--full-conversation', '--no-save', table.concat(buf_lines, '\n') },
    on_stdout = function(_, data)
      local lines = vim.split(data, '\n', { trimempty = false })

      -- Schedule the API calls to be executed in the main loop
      vim.schedule(function()
        local end_row = vim.api.nvim_buf_line_count(buf)
        vim.api.nvim_buf_set_lines(buf, end_row, end_row, false, lines)
      end)
    end,
    on_stderr = function(_, data)
      print('Error: ' .. data)
    end,
  }):start()
end)
```

In addition, I use a custom telescope picker for setting the model, but that's
also easy to do through the command line.

## Development

### Scripts

Build the project:

```bash
./bin/build.sh
```

Setup development environment:

```bash
./bin/setup-development-environment.sh
```

### Project Structure

- `src/`: TypeScript source files
- `executables/`: CLI scripts and entry points
- `bin/`: Build and setup scripts
- `dist/`: Compiled JavaScript (generated)

## License

MIT License - See [LICENSE](LICENSE) for details.

## Requirements

- Node.js (ollama requires a version with `fetch`)
- npm
- Ollama (only for local models)
