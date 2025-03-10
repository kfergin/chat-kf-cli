#!/bin/bash

# example usage:
# `echo "Hello, world" | ./simple-curl-example-ollama.sh`

if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed. Please install jq first." >&2
    echo "Installation instructions: https://stedolan.github.io/jq/download/" >&2
    exit 1
fi

content_input=$(cat)

curl --no-buffer --silent http://localhost:11434/api/chat \
     --header "content-type: application/json" \
     --data "$(jq -n \
        --arg content "$content_input" \
        '{
            messages: [{role: "user", content: $content}],
            model: "llama3.2:latest",
            options: { temperature: 0 },
            stream: true
        }')" | while read -r line; do
    # parse data that is streamed back to us. example:
    # {"model":"...","created_at":"...","message":{"role":"assistant","content":" some text"},"done":false}
    # TODO: Preserve newline characters
    content=$(echo "$line" | jq -r '.message.content // empty' 2>/dev/null)
    if [ ! -z "$content" ]; then
        printf "%s" "$content"
    fi
done
echo # Add newline at the end
