#!/bin/bash

is_preview=false
file_to_save=
more_filter=""

usage() {
    echo "Usage: $0 [-h] [--help] [--filter value] [new-file value] [--preview]"
    echo "  -f value Filter out files with string. Treated as regex."
    echo "  -h       Display this help message"
    echo "  -p       Preview files that would be concatenated."
    echo "  -s value Path to file to create."
    exit 1
}

# Parse command-line options
while getopts "f:hps:" opt; do
  case $opt in
    f)
      more_filter=$OPTARG
      ;;
    h)
      usage
      ;;
    p)
      is_preview=true
      ;;
    s)
      file_to_save=$OPTARG
      ;;
    *)
      usage
      ;;
  esac
done

# Shift off the options and optional --.
shift "$((OPTIND-1))"

if [ "$is_preview" != true ]; then
  if [ -z "$file_to_save" ]; then
    echo "Please provide a file to save the output"
    exit 1
  fi
  
  if [ -f "$file_to_save" ]; then
    echo "File already exists. Please provide a new file"
    exit 1
  fi
fi

if [ -n "$more_filter" ]; then
  more_filter="|$more_filter"
fi

while IFS= read -r -d $'\0' file; do
  regex="(\.git/|\.DS_Store|node_modules|dist|package-lock\.json$more_filter)"
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
