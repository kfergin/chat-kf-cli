#!/bin/bash

is_preview=false
file_to_save=

if [ "$1" = "-p" ]; then
  is_preview=true
else 
  file_to_save="$1"
  if [ -z "$file_to_save" ]; then
    echo "Please provide a file to save the output"
    exit 1
  fi
  
  if [ -f "$file_to_save" ]; then
    echo "File already exists. Please provide a new file"
    exit 1
  fi
fi

while IFS= read -r -d $'\0' file; do
  regex="(\.git/|\.DS_Store|server/data|node_modules|dist|package-lock\.json)"
  if [[ $file =~ $regex ]]; then
    continue
  fi

  if [ "$is_preview" = true ]; then
    echo "$file"
    continue
  fi

  {
    echo "File path: $file"
    echo "File content:"
    echo ""
    cat "$file"
    echo ""
    echo ""
  } >> "$file_to_save"
done < <(find . -type f -print0)
