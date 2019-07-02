#!/usr/bin/env bash

thisDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

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
   "${thisDir}/node_modules/.bin/tsc" --sourcemap -d "src/ts/${file}.ts" --outDir ${thisDir}/output/js --declarationDir ${thisDir}/src/ts/d --removeComments

   printf "uglifying... "
   "${thisDir}/node_modules/.bin/uglifyjs" "${thisDir}/output/js/${file}.js" -o "${thisDir}/output/js/${file}.min.js" --compress --mangle

   printf "finished.\n"
done

echo "Finished compiling typescript files"
