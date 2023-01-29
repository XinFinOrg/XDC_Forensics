#!/bin/bash
export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh
kill $( lsof -i:8888 -t )
serve -l 8888 &