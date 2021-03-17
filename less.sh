#!/usr/bin/env bash

ext=".css"
min_ext=".min.css"
path="build/css"

for file in src/less/*.less
do
    destination="${file/.less/$ext}"
    destination="${destination/"src/less"/$path}"

    lessc --no-color "$file" "$destination"
    echo "$destination"

    destination="${file/.less/$min_ext}"
    destination="${destination/"src/less"/$path}"

    lessc --clean-css="--s1" --no-color "$file" "$destination"
    echo "$destination"
done
echo "finished"
