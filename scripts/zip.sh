#!/usr/bin/env bash
set -eu;

version=$(jq -r .version < package.json | sed 's/\./_/g');
set -x;
zip -r dist_"${version}".zip dist