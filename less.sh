#!/usr/bin/env bash

thisDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ext=".css"
min_ext=".min.css"
path="output/css"

for file in ${thisDir}/src/less/*.less
do
    destination="${file/.less/$ext}"
    destination="${destination/"src/less"/$path}"

    "${thisDir}/node_modules/.bin/lessc" --no-color "$file" "$destination"
    echo "$destination"

    destination="${file/.less/$min_ext}"
    destination="${destination/"src/less"/$path}"

    "${thisDir}/node_modules/.bin/lessc" --clean-css="--s1" --no-color "$file" "$destination"
    echo "$destination"
done
echo "finished"