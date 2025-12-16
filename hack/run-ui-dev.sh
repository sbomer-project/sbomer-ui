#!/usr/bin/env bash
set -e

SCRIPT_DIR=$(dirname "$0")

set -x

pushd "${SCRIPT_DIR}/../ui" > /dev/null
npm run start:dev "$@"
popd > /dev/null
