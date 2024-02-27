#!/bin/bash

more_filter="$1"

if [ -n "$more_filter" ]; then
  more_filter="|$more_filter"
fi

total_token_count=0

while IFS= read -r -d $'\0' file; do
  regex="(\.git/|\.DS_Store|node_modules|dist|package-lock\.json$more_filter)"
  if [[ $file =~ $regex ]]; then
    continue
  fi

  echo "Processing $file"

  file_info=$(cat "$file" | kf-chat-cli --token-count)
  regex="Token count: ([0-9]+)"
  if [[ $file_info =~ $regex ]]; then
    token_count="${BASH_REMATCH[1]}"
    ((total_token_count += token_count))
  fi
done < <(find . -type f -print0)

echo "Total token count: $total_token_count"
