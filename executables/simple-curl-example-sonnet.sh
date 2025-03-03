#!/bin/bash

# https://docs.anthropic.com/en/api/getting-started
# https://docs.anthropic.com/en/api/messages
# https://docs.anthropic.com/en/api/messages-streaming
#
# example usage:
# `echo "Hello, world" | ./simple-curl-example-sonnet.sh`

if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed. Please install jq first." >&2
    echo "Installation instructions: https://stedolan.github.io/jq/download/" >&2
    exit 1
fi

read -r content_input

curl --no-buffer --silent https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data "$(jq -n \
        --arg content "$content_input" \
        '{
            max_tokens: 1024,
            messages: [{role: "user", content: $content}],
            model: "claude-3-5-sonnet-latest",
            stream: true,
            temperature: 0
        }')" | while read -r line; do
    # parse data that is streamed back to us. example:
    # event: content_block_delta
    # data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"I see"}        }
    if [[ $line == data:* ]]; then
        content=$(echo "$line" | sed 's/^data: //' | jq -r '.delta.text // empty' 2>/dev/null)
        if [ ! -z "$content" ]; then
            printf "%s" "$content"
        fi
    fi
done
echo # Add newline at the end
