#!/usr/bin/env bash
# 분야마다 <분야>/index.html(GitHub Pages)과 tools/test-<분야>.html(검사 하네스)을 만들고,
# 루트의 publish.html(claude.ai 게시본의 첫 화면 = 허브)을 index.html에서 뽑아냅니다.
# 분야 목록은 FIELDS, 분야별 값은 <분야>/site.env, 데이터 파일 순서는 <분야>/manifest.txt에 있습니다.
set -euo pipefail
cd "$(dirname "$0")/.."
BASE_URL="https://dhsrua555.github.io/equation/"
FIELDS="${FIELDS:-base em ml dnn med}"

field_page() { # $1 field, $2 prefix to root ("../"), $3 prefix to the field folder
  local f="$1" R="$2" F="$3"
  echo "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.js\"></script>"
  echo "<script src=\"${R}core/net.js\"></script>"
  echo "<script src=\"${R}core/net-index.js\"></script>"
  echo "<script src=\"${F}site.js\"></script>"
  [ -f "$f/figs.js" ] && echo "<script src=\"${F}figs.js\"></script>"
  while read -r d; do d="${d%$'\r'}"; [ -n "$d" ] && echo "<script src=\"${F}data/$d\"></script>"; done < "$f/manifest.txt"
  echo "<script src=\"${R}core/calc.js\"></script>"
  echo "<script src=\"${R}core/plots.js\"></script>"
  [ -f "$f/plots.js" ] && echo "<script src=\"${F}plots.js\"></script>"
  echo "<script src=\"${R}core/app.js\"></script>"
}
stamp() { # $1 html: add ?v=<content hash> to every local .js/.css so a browser never mixes an old file with a new page
  perl -i -pe 'BEGIN { use Digest::MD5 qw(md5_hex); $d = shift @ARGV }
    s{((?:src|href)=")(?!https?:|//)([^"?#]+\.(?:js|css))(?:\?v=[0-9a-f]+)?"}{ my ($a, $p) = ($1, $2); my $h = ""; if (open my $fh, "<:raw", "$d/$p") { local $/; $h = "?v=" . substr(md5_hex(<$fh>), 0, 8) } "$a$p$h\"" }ge' "$(dirname "$1")" "$1"
}
body() {
  cat <<EOF
<header class="site-header" id="site-header"></header>
<main id="main"></main>
<div id="drawer-root"></div>
<div id="modal-root"></div>
<div id="toast-root" aria-live="polite"></div>
EOF
}

for f in $FIELDS; do
  TITLE=""; DESC=""; FONTS=""
  source "$f/site.env"
  theme=""; [ -f "$f/theme.css" ] && theme="<link rel=\"stylesheet\" href=\"theme.css\">"
  {
    cat <<EOF
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>$TITLE</title>
<meta name="description" content="$DESC">
<meta property="og:type" content="website">
<meta property="og:title" content="$TITLE">
<meta property="og:description" content="$DESC">
<meta property="og:url" content="${BASE_URL}$f/">
<meta property="og:image" content="${BASE_URL}$( [ -f "$f/og.png" ] && echo "$f/og.png" || echo assets/og.png )">
<meta property="og:image:width" content="1280">
<meta property="og:image:height" content="640">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="$FONTS">
<link rel="stylesheet" href="../core/katex.css">
<link rel="stylesheet" href="../core/style.css">
$theme
</head>
<body>
EOF
    body
    echo '<noscript><p style="padding:24px">이 사이트는 JavaScript가 필요합니다.</p></noscript>'
    field_page "$f" "../" ""
    echo "</body>"
    echo "</html>"
  } | grep -v '^$' > "$f/index.html"
  stamp "$f/index.html"
  # claude.ai 게시본은 올릴 때마다 새 판이라 캐시 걱정이 없고 ?v= 주소를 못 찾을 수 있으니, 꼬리표 없는 사본을 따로 둡니다.
  mkdir -p "tools/art/$f" && sed -e 's/?v=[0-9a-f]*//g' "$f/index.html" > "tools/art/$f/index.html"

  {
    cat <<EOF
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>test $f</title>
<link rel="stylesheet" href="$FONTS">
<link rel="stylesheet" href="../core/katex.css">
<link rel="stylesheet" href="../core/style.css">
$( [ -f "$f/theme.css" ] && echo "<link rel=\"stylesheet\" href=\"../$f/theme.css\">" )
</head><body>
<script>window.__errors=[];window.addEventListener("error",function(e){window.__errors.push("window.error: "+e.message+" @"+(e.filename||"")+":"+e.lineno)});try{localStorage.clear()}catch(e){}</script>
EOF
    body
    field_page "$f" "../" "../$f/"
    echo '<script src="checks.js"></script>'
    echo '</body></html>'
  } | grep -v '^$' > "tools/test-$f.html"
  echo "built $f/index.html, tools/test-$f.html ($(grep -c . "$f/manifest.txt") data files)"
done

if [ -f index.html ]; then
stamp index.html
# claude.ai 게시본의 첫 화면: index.html에서 <!doctype>·<html>·<head>·<body> 껍데기와 og 메타를 걷어 냅니다.
sed -e '/^<!doctype html>/d' -e '/^<html/d' -e '/^<\/html>/d' -e '/^<head>/d' -e '/^<\/head>/d' -e '/^<body/d' -e '/^<\/body>/d' \
    -e '/<meta charset/d' -e '/<meta name="viewport"/d' -e '/<meta property=/d' -e '/<meta name="twitter/d' -e 's/?v=[0-9a-f]*//g' index.html > publish.html
echo "built publish.html"
fi
