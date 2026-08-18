#!/bin/bash

git add .

added=$(git diff --cached --name-status | grep '^A' | wc -l)
modified=$(git diff --cached --name-status | grep '^M' | wc -l)
deleted=$(git diff --cached --name-status | grep '^D' | wc -l)

if [ $# -gt 0 ]; then
  message="$*"
else
  message="$(date +'%Y-%m-%d %H:%M:%S') - Added $added file(s), Modified $modified file(s), Deleted $deleted file(s)"
fi

git commit -m "$message"
git push
