#!/bin/bash
DIR=$(dirname "$BASH_SOURCE")
CYAN='\033[1;36m'
NC='\033[0m'
WARN='\033[0;33m'

pushd "$DIR/.." >/dev/null || exit 1
echo -e "${WARN}Installing dependecies!${NC}\n"
npm install --silent --legacy-peer-deps >/dev/null
popd >/dev/null || exit 1

echo -e "${CYAN}Done!${NC} 🎉"
