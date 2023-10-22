#!/bin/sh

set -eu

if [ "$#" -ne 2 ] || ! [ -f "$1" ]; then
  echo "Usage: $0 <input> <output>" >&2
  exit 1
fi

CODEPOINTS_FILE="$(dirname "$0")/font-unicodes-keep.txt"

echo $CODEPOINTS_FILE


pyftsubset "$1" --flavor="woff2" --output-file="$2" --unicodes-file="$CODEPOINTS_FILE" \
  --layout-features='kern,liga' --verbose \
  --drop-tables='*'

