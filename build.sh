#!/usr/bin/env bash

set -e

./tsc.sh
./less.sh
cp src/index.html build


