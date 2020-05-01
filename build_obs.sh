#!/usr/bin/env bash

file="obs"

printf "   Compiling ${file}.ts... "
tsc --sourcemap -d "src/ts/${file}.ts" --outDir build/js --declarationDir src/ts/d --removeComments

printf "uglifying... "
uglifyjs "build/js/${file}.js" -o "build/js/${file}.min.js" --compress --mangle

printf "finished.\n"

