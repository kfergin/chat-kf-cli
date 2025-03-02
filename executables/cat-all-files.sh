#!/bin/bash

# Default output file
file_to_save="concatenated-files.txt"
show_help=false

# Process command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -o|--output)
      file_to_save="$2"
      shift 2
      ;;
    -h|--help)
      show_help=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Display help message
if [[ "$show_help" = true ]]; then
  cat << EOF
Usage: ./$(basename "$0") [OPTIONS]

This script concatenates the content of files provided via stdin, adding file paths as headers.

Options:
  -o, --output FILE    Specify the output file (default: concatenated-files.txt)
  -h, --help           Display this help message and exit

Examples:
  git ls-files '*.js' | ./$(basename "$0")
  git ls-files | grep -v tests | ./$(basename "$0") -o output.txt
  find . | ./$(basename "$0")

EOF
  exit 0
fi

# Check if there's input from stdin
if [ -t 0 ]; then
  echo "Error: No input provided. Please pipe a list of files to this script."
  echo "For help, run: ./$(basename "$0") --help"
  exit 1
fi

# Create or clear the output file
> "$file_to_save"

# Process each file
count=0
while IFS= read -r file; do
  # Skip if not a regular file or not readable
  if [[ ! -f "$file" || ! -r "$file" ]]; then
    echo "Warning: Skipping '$file' (not a regular file or not readable)" >&2
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

  ((count++))
done

echo "Successfully processed $count files. Output saved to '$file_to_save'"
