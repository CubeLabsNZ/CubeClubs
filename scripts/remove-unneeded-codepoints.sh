#!/bin/sh

set -eu

if [ "$#" -ne 2 ] || ! [ -f "$1" ]; then
  echo "Usage: $0 <input> <output>" >&2
  exit 1
fi

CODEPOINTS_FILE="$(dirname "$0")/font-unicodes-keep.txt"
TMP_FILE="$(mktemp)"

echo $CODEPOINTS_FILE



pyftsubset "$1" --flavor="woff2" --output-file="$TMP_FILE" --unicodes-file="$CODEPOINTS_FILE" \
  --layout-features='kern,liga' --verbose \
  --drop-tables='*'
fonttools varLib.instancer -o "$2" "$TMP_FILE" wdth=100 wght=400:600

rm "$TMP_FILE"
