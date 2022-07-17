#!/bin/sh
rm -rf dist build && npm run build:tailwind && npm run build:prod
serve -s build -l 8888