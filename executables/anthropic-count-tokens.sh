#!/bin/bash

# https://docs.anthropic.com/en/api/messages-count-tokens
#
# example usages:
# `echo "Hello, world" | ./anthropic-count-tokens.sh`
# `cat ./some-file.txt | ./anthropic-count-tokens.sh`

if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed. Please install jq first." >&2
    echo "Installation instructions: https://stedolan.github.io/jq/download/" >&2
    exit 1
fi

content_input=$(cat)

curl https://api.anthropic.com/v1/messages/count_tokens \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data "$(jq -n \
        --arg content "$content_input" \
        '{
            messages: [{role: "user", content: $content}],
            model: "claude-3-5-sonnet-latest",
        }')"
echo # Add newline at the end
