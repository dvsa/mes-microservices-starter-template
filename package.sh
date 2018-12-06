#!/bin/sh
LAMBDAS=$1
if [[ -z ${LAMBDAS} ]]; then
  npx webpack && node zip.js
else
  npx webpack --env.lambdas=${LAMBDAS} && node zip.js
fi
