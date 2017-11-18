#!/usr/bin/env bash

thisDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

printf "Compiling library files... "
#"${thisDir}/node_modules/.bin/tsc" --declaration "ts/script.ts" --outDir ${thisDir}/ts/d
#find ${thisDir}/ts/d -not -path '*/\.*' -type f ! -name *.d.ts -delete


printf "compiling typescript files... "
"${thisDir}/node_modules/.bin/tsc" --sourcemap -d "src/ts/obs.ts" --outDir ${thisDir}/output/js --declarationDir ${thisDir}/src/ts/d --removeComments


printf "uglifying... "
"${thisDir}/node_modules/.bin/uglifyjs" "${thisDir}/output/js/obs.js" -o "${thisDir}/output/js/obs.min.js" --compress --mangle


printf "finished.\n"
