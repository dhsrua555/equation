#!/usr/bin/env bash
# 분야마다 tools/test-<분야>.html을 헤드리스 Chrome으로 돌려 검사 결과를 출력하고,
# 분야 사이의 제목·링크 색인(core/net-index.js)과 허브 검색 색인(core/net-search.js)을 다시 만듭니다.
# 사용법: tools/netindex.sh            (색인을 만든 뒤 한 번 더 돌려 교차 링크까지 검사)
set -euo pipefail
cd "$(dirname "$0")/.."
FIELDS="${FIELDS:-base em dnn med}"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
ROOTW="$(pwd -W | sed 's# #%20#g')"
TMP="$(mktemp -d)"
unhtml() { sed -e 's/&lt;/</g' -e 's/&gt;/>/g' -e 's/&quot;/"/g' -e "s/&#39;/'/g" -e 's/&amp;/\&/g'; }
run() { # $1 field → $TMP/$1.html
  "$CHROME" --headless=new --disable-gpu --no-first-run --user-data-dir="$TMP/prof-$1" --allow-file-access-from-files \
    --virtual-time-budget=90000 --dump-dom "file:///$ROOTW/tools/test-$1.html" 2>/dev/null > "$TMP/$1.html" || true
}
pick() { # $1 file, $2 pre id
  tr -d '\r' < "$1" | perl -0ne 'print "$1\n" if /<pre id="'"$2"'">(.*?)<\/pre>/s' | unhtml
}
bash tools/build.sh > /dev/null
for pass in 1 2; do
  { echo '/* tools/netindex.sh가 만든 파일입니다. 고치지 마세요. */'
    echo 'window.NET = window.NET || {}; NET.index = NET.index || {}; NET.links = NET.links || [];'; } > "$TMP/index.js"
  { echo '/* tools/netindex.sh가 만든 파일입니다. 고치지 마세요. */'
    echo 'window.NET = window.NET || {}; NET.search = NET.search || {};'; } > "$TMP/search.js"
  for f in $FIELDS; do
    run "$f"
    pick "$TMP/$f.html" __index >> "$TMP/index.js"
    pick "$TMP/$f.html" __search >> "$TMP/search.js"
    if [ "$pass" = 2 ]; then echo "== $f"; pick "$TMP/$f.html" __out | grep -v '^note:' ; fi
  done
  cp "$TMP/index.js" core/net-index.js
  cp "$TMP/search.js" core/net-search.js
done
echo "core/net-index.js $(wc -c < core/net-index.js) bytes, core/net-search.js $(wc -c < core/net-search.js) bytes"
rm -rf "$TMP"
