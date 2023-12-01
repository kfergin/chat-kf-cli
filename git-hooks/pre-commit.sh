#!/usr/bin/env sh

set -e # exit immediately if a command exits with a non-zero status

# change to the repo root
cd "$(git rev-parse --show-toplevel)" || exit 1

echo "Checking TypeScript"
npx tsc --noEmit || { echo "TypeScript compilation failed"; exit 1; }

echo "Checking ESLint"
npx eslint . || { echo "ESLint failed"; exit 1; }

echo "Checking Prettier"
npx prettier --check --log-level warn . || { echo "Prettier check failed"; exit 1; }

echo "Pre-commit checks passed"

# if there are no errors, continue with the commit
exit 0
