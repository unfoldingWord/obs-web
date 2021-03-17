#!/usr/bin/env bash

set -e

./tsc.sh
./less.sh
cp src/*.html build
cp -R src/json build


