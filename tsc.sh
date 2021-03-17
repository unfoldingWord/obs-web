#!/usr/bin/env bash

declare -a files=("strings"
                  "obs"
                  "obs-start"
                  "lang-names"
                  "map_data"
                  "region_data"
                  "map_interactive"
                  )

for file in "${files[@]}"
do
   printf "   Compiling ${file}.ts... "
   tsc --sourcemap -d "src/ts/${file}.ts" --outDir build/js --declarationDir src/ts/d --removeComments

   printf "uglifying... "
   uglifyjs "build/js/${file}.js" -o "build/js/${file}.min.js" --compress --mangle

   printf "finished.\n"
done

echo "Finished compiling typescript files"
