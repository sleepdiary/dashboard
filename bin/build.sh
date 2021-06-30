#!/bin/sh
#
# Build the documentation
#
# Called from .github/workflows

set -v # verbose mode - print commands to stderr
set -e # exit if any of the commands below return non-zero

#
# Check if there's anything to do
#

if ! git rev-list HEAD..origin/main | grep -q .
then
    echo "'main' has already been merged - stopping"
    exit 0
fi

#
# Merge changes from main
#

git merge --strategy-option=theirs --no-edit origin/main

#
# Initialise the build environment
#

yarn --frozen-lockfile

#
# Run the build itself
#

yarn build --dest docs

#
# Add/commit/push changes
#

git add .
if git diff --quiet HEAD
then echo "No changes to commit"
else git commit -a -m "Build updates from main branch"
fi
git push
