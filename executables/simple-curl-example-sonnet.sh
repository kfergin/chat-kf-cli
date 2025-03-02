#!/bin/bash

# https://docs.anthropic.com/en/api/getting-started
# https://docs.anthropic.com/en/api/messages
#
# example usage:
# `echo "Hello, world" | ./simple-curl-example-sonnet.sh`

read -r content_input

curl https://api.anthropic.com/v1/messages \
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
        }')"

# count_tokens example
# https://docs.anthropic.com/en/api/messages-count-tokens
#
# curl https://api.anthropic.com/v1/messages/count_tokens \
#      --header "x-api-key: $ANTHROPIC_API_KEY" \
#      --header "anthropic-version: 2023-06-01" \
#      --header "content-type: application/json" \
#      --data \
# '{
#     "model": "claude-3-5-sonnet-latest",
#     "messages": [
#         {"role": "user", "content": "Hello, world"}
#     ]
# }'
