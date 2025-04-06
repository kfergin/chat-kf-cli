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

**Note**: Several scripts require `jq` to be installed for JSON processing. The
Anthropic scripts require an `ANTHROPIC_API_KEY` environment variable to be
set.

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
