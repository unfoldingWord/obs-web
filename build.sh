#!/usr/bin/env bash

set -e

./tsc.sh
./less.sh
cp src/*.html build
cp src/css/*.css build/css
cp -R src/css/fonts build/css
echo "Fetching https://td.unfoldingword.org/exports/langnames.json..."
curl --create-dirs -o build/json/langnames.json https://td.unfoldingword.org/exports/langnames.json

