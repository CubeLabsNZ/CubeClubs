#!/bin/sh

set -eu

if [ "$#" -ne 3 ] || ! [ -f "$1" ]; then
  echo "Usage: $0 <input> <output prefix> <output_format>" >&2
  exit 1
fi

ASCII_CODEPOINTS="U+0000-007F"

EXTRA_CODEPOINTS="U+0101,U+0113,U+012b,U+014d,U+016b,U+0100,U+0112,U+012a,U+014c,U+016a"


pyftsubset "$1" --flavor="$3" --output-file="${2}_ASCII.${3}" --unicodes="$ASCII_CODEPOINTS" \
  --layout-features='*' --verbose \
  --drop-tables=''


pyftsubset "$1" --flavor="$3" --output-file="${2}_EXTRA.${3}" --unicodes="$EXTRA_CODEPOINTS" \
  --layout-features='kern,liga' --verbose \
  --drop-tables='*'


echo "
@font-face {
	font-family: \"TwCenMt\";
	src: local(\"Tw Cen MT\"), url(\"/fonts/${2}_ASCII.${3}\") format(\"${3}\");
	font-display: swap;
	unicode-range: ${ASCII_CODEPOINTS};
}
@font-face {
	font-family: \"TwCenMt\";
	src: url(\"/fonts/${2}_EXTRA.${3}\") format(\"${3}\");
	font-display: swap;
	unicode-range: ${EXTRA_CODEPOINTS};
}
"
