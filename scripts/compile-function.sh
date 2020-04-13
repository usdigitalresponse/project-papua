#!/bin/bash

# Overview:
#    This script is used to compile TS Lambda functions into JS
#    inside of the relevant `amplify` function source code folder.
#
#    You can compile all functions at once with `yarn compile`. You MUST do this
#    before running `amplify publish -y` or else your updated code will not be published.
# 
# Q: Why do we store code in `backend/...` instead of `amplify/...`?
#    For one, there's quite a bit of CloudFormation configuration inside of `amplify`
#    that is irrelevant to the business logic that exists in each function. Ideally,
#    we separate the two of those.
#    Secondly, by separating our TS code from the code that is zipped and deployed to Lambda,
#    we don't have to deploy the TS code -- just the compiled JS. Down the road, we may want
#    to pull in library code from elsewhere in this repo and we can use this step to copy
#    the relevant library code over.

set -e

if [ -z "${FUNCTION_NAME}" ]
then
  echo "You must set FUNCTION_NAME=..."
  exit 1
fi

echo "Compiling assets for function=${FUNCTION_NAME}"

# Initialize an empty src folder for this function, removing
# any existing files if any exist from a previous compilation.
mkdir -p amplify/backend/function/${FUNCTION_NAME}/src
rm -rf amplify/backend/function/${FUNCTION_NAME}/src/*

# Compile the TS into JS.
cd backend/functions/${FUNCTION_NAME}
yarn
yarn tsc
cd -

# Copy over the compiled JS + package.json + yarn.lock files.
cp -r backend/functions/${FUNCTION_NAME}/dist/* amplify/backend/function/${FUNCTION_NAME}/src
cp backend/functions/${FUNCTION_NAME}/package.json amplify/backend/function/${FUNCTION_NAME}/src/package.json
cp backend/functions/${FUNCTION_NAME}/yarn.lock amplify/backend/function/${FUNCTION_NAME}/src/yarn.lock

# The STATE_CODE is set as an Amplify Environment Variable. But those envs are only available
# at build-time so we copy it over.
echo "STATE_CODE=${STATE_CODE}" > amplify/backend/function/${FUNCTION_NAME}/src/.env

# Install dependencies based on the updated package.json
yarn --cwd=amplify/backend/function/${FUNCTION_NAME}/src install
