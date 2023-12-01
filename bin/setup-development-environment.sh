#!/usr/bin/env sh

# change to the repo root
cd "$(git rev-parse --show-toplevel)" || exit 1

echo "Installing node_modules"
npm install

if [ ! -L ".git/hooks/pre-commit" ]; then
  echo "Wiring up pre-commit hook"
  ln -s "$(pwd)/git-hooks/pre-commit.sh" .git/hooks/pre-commit
fi
