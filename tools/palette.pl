#!/usr/bin/env perl
# 분야별 색과 사이트 아이콘을 만듭니다.
#   core/fields.css        분야마다 종이·잉크·강조색·보조색·띠 (html과 허브 카드의 data-field로 고름)
#   assets/icons/<id>.svg  사이트 아이콘: 띠 색 바탕에 이탤릭 é (Bodoni Moda Italic, SIL OFL)
# 쓰는 법: perl tools/palette.pl          (파일을 쓰고 대비표를 찍음)
#          perl tools/palette.pl --check  (대비표만)
# 허브(index.html)의 색은 core/style.css의 기본값이고, 여기서는 아이콘만 만듭니다.
use strict;
use warnings;
use FindBin;
chdir "$FindBin::Bin/.." or die;
my $CHECK = grep { $_ eq '--check' } @ARGV;

# light / dark: 종이(paper, paper2 = 표지·상자, paper3 = 카드), 잉크, 강조색(denim, denim2), 보조색(camel = 선·점, camelInk = 글자), 띠(band = 맨 위 막대·모의고사 띠)
my @FIELDS = (
  [base => 'violet + gold',
    { paper => '#f4f2f8', paper2 => '#e8e4f1', paper3 => '#fbfafd', ink => '#17142b', denim => '#4b3f8c', denim2 => '#6456ad', camel => '#a88230', camelInk => '#76581a', band => '#1c1836' },
    { paper => '#121020', paper2 => '#1c1930', paper3 => '#16142a', ink => '#eeebf7', denim => '#b3a8f0', denim2 => '#978be0', camel => '#d9b865', camelInk => '#e0c378', band => '#221e3c' }],
  [em => 'blueprint blue + camel',
    { paper => '#eef2f6', paper2 => '#dfe7ef', paper3 => '#f8fafc', ink => '#0c1c28', denim => '#2d5f8f', denim2 => '#3a7fb8', camel => '#a8764b', camelInk => '#7e5230', band => '#0c1c2c' },
    { paper => '#0b1520', paper2 => '#13202e', paper3 => '#0f1b28', ink => '#eaf0f5', denim => '#8db8e0', denim2 => '#6f9fcb', camel => '#d2a57a', camelInk => '#dbb38b', band => '#172a3d' }],
  [solid => 'olive + steel',
    { paper => '#f2f2ea', paper2 => '#e4e4d5', paper3 => '#fafaf5', ink => '#1a1d10', denim => '#5a6818', denim2 => '#7a8a26', camel => '#4f7189', camelInk => '#3a566a', band => '#22271a' },
    { paper => '#121410', paper2 => '#1b1e16', paper3 => '#161913', ink => '#eef0e3', denim => '#c3d27e', denim2 => '#a9ba5e', camel => '#93b4cc', camelInk => '#a3c1d6', band => '#252b1c' }],
  [dyn => 'plum + teal',
    { paper => '#f6eff5', paper2 => '#ecdfea', paper3 => '#fcf8fb', ink => '#25111f', denim => '#8c2d7b', denim2 => '#a8428f', camel => '#2f8084', camelInk => '#1d6064', band => '#2a1227' },
    { paper => '#1a1018', paper2 => '#261723', paper3 => '#1f131d', ink => '#f6ecf2', denim => '#e3a0d6', denim2 => '#cf82c0', camel => '#7cc6c4', camelInk => '#8fd1cf', band => '#321b2e' }],
  [fluid => 'sea green + marine blue',
    { paper => '#edf4f1', paper2 => '#dceae3', paper3 => '#f7fbf9', ink => '#0e221a', denim => '#1f7548', denim2 => '#2e8f5c', camel => '#2f6699', camelInk => '#245280', band => '#0e2a21' },
    { paper => '#0c1814', paper2 => '#13241d', paper3 => '#0f1d18', ink => '#e8f3ee', denim => '#86d49e', denim2 => '#66bd83', camel => '#86b4e0', camelInk => '#9cc3e8', band => '#16332a' }],
  [robot => 'graphite + signal amber',
    { paper => '#f0f1f2', paper2 => '#e1e4e7', paper3 => '#f9fafa', ink => '#15191e', denim => '#3d5166', denim2 => '#54697f', camel => '#b0781a', camelInk => '#835709', band => '#1c2026' },
    { paper => '#111316', paper2 => '#1a1d22', paper3 => '#15181c', ink => '#eceef0', denim => '#a9bdd2', denim2 => '#8ea5bd', camel => '#e6b35a', camelInk => '#ecc06f', band => '#22272e' }],
  [ml => 'amber + indigo',
    { paper => '#f9f1e7', paper2 => '#f0e0cc', paper3 => '#fdf9f4', ink => '#25180c', denim => '#9a4b0e', denim2 => '#c0661c', camel => '#4a5596', camelInk => '#3b4585', band => '#2a1c0f' },
    { paper => '#17120c', paper2 => '#231b12', paper3 => '#1c160e', ink => '#f6eee3', denim => '#f0a560', denim2 => '#e08b42', camel => '#a3adeb', camelInk => '#b1baf0', band => '#2f2418' }],
  [dnn => 'wine + sage',
    { paper => '#f8f0ef', paper2 => '#efdfdf', paper3 => '#fdf8f8', ink => '#260f15', denim => '#7a2638', denim2 => '#9c3a4f', camel => '#5d7a52', camelInk => '#46613c', band => '#2b1016' },
    { paper => '#190e11', paper2 => '#25161a', paper3 => '#1e1115', ink => '#f6eaed', denim => '#e59aab', denim2 => '#d17c90', camel => '#a8c79a', camelInk => '#b5d2a8', band => '#331b21' }],
  [med => 'clinical teal + rose',
    { paper => '#edf5f5', paper2 => '#dbeaea', paper3 => '#f7fbfb', ink => '#0c2222', denim => '#16676a', denim2 => '#1f8a8a', camel => '#b0566e', camelInk => '#8e3d55', band => '#0c2a2b' },
    { paper => '#0b1717', paper2 => '#122323', paper3 => '#0e1c1c', ink => '#e7f4f3', denim => '#7fd0cc', denim2 => '#5fb8b4', camel => '#e79ab0', camelInk => '#eeaabd', band => '#153233' }],
);
# the hub keeps the linen and navy of core/style.css
my %HUB = (band => '#0c1c28', ink => '#f1eadf', camel => '#d2a57a');

sub rgb { my $h = shift; $h =~ s/^#//; map { hex } unpack '(A2)3', $h }
sub hexc { sprintf '#%02x%02x%02x', map { int($_ + 0.5) } @_ }
sub mix { my ($a, $b, $t) = @_; my @a = rgb($a); my @b = rgb($b); hexc(map { $t * $a[$_] + (1 - $t) * $b[$_] } 0 .. 2) }
sub rgba { my ($c, $o) = @_; sprintf 'rgba(%d, %d, %d, %s)', rgb($c), $o }
sub lum { map { my $c = $_ / 255; $c <= 0.03928 ? $c / 12.92 : (($c + 0.055) / 1.055)**2.4 } rgb(shift) }
sub L { my @c = lum(shift); 0.2126 * $c[0] + 0.7152 * $c[1] + 0.0722 * $c[2] }
sub cr { my ($a, $b) = map { L($_) } @_; ($a, $b) = ($b, $a) if $b > $a; ($a + 0.05) / ($b + 0.05) }

sub tokens {
  my ($p, $dark) = @_;
  my %t = (
    '--paper' => $p->{paper}, '--paper-2' => $p->{paper2}, '--paper-3' => $p->{paper3},
    '--ink' => $p->{ink}, '--ink-2' => mix($p->{ink}, $p->{paper}, 0.74), '--ink-3' => mix($p->{ink}, $p->{paper}, $dark ? 0.58 : 0.62),
    '--rule' => rgba($p->{ink}, $dark ? 0.13 : 0.14), '--rule-strong' => rgba($p->{ink}, $dark ? 0.3 : 0.32),
    '--denim' => $p->{denim}, '--denim-2' => $p->{denim2}, '--camel' => $p->{camel}, '--camel-ink' => $p->{camelInk},
    '--band' => $p->{band}, '--band-ink' => $p->{bandInk}, '--band-ink-2' => mix($p->{bandInk}, $p->{band}, 0.68),
    '--band-rule' => rgba($p->{bandInk}, $dark ? 0.16 : 0.18),
    '--plot-a' => rgba($p->{denim}, $dark ? 0.5 : 0.58), '--plot-b' => rgba($p->{camel}, $dark ? 0.85 : 0.9),
    '--plot-faint' => rgba($p->{ink}, $dark ? 0.12 : 0.16), '--plot-faint2' => rgba($p->{ink}, $dark ? 0.2 : 0.24),
    '--selection' => rgba($p->{denim2}, $dark ? 0.28 : 0.22),
  );
  unless ($dark) { $t{'--shadow'} = '0 18px 50px -24px ' . rgba($p->{ink}, 0.35); $t{'--scrim'} = rgba($p->{ink}, 0.38) }
  return \%t;
}
my @ORDER = qw(--paper --paper-2 --paper-3 --ink --ink-2 --ink-3 --rule --rule-strong --denim --denim-2 --camel --camel-ink
  --band --band-ink --band-ink-2 --band-rule --plot-a --plot-b --plot-faint --plot-faint2 --selection --shadow --scrim);
sub block { my ($sel, $t, $ind, $extra) = @_; my $s = "$ind$sel {\n"; $s .= "$ind  $_: $t->{$_};\n" for grep { exists $t->{$_} } @ORDER; $s .= "$ind  $extra\n" if $extra; "$s$ind}\n" }

my $css = <<'EOF';
/* 분야별 색 — tools/palette.pl이 만듭니다. 고치려면 그 파일의 표를 바꾸고 다시 실행하세요.
   글꼴·상자 모양·머리말은 모든 분야가 core/style.css의 것을 함께 쓰고, 분야마다 종이·잉크·강조색·보조색·띠만 다릅니다.
   분야 페이지는 <html data-field="…">, 허브의 분야 카드는 data-field로 이 색을 받습니다. */
EOF
my @report;
for my $f (@FIELDS) {
  my ($id, $name, $l, $d) = @$f;
  $l->{bandInk} = $d->{ink};
  $d->{bandInk} = $d->{ink};
  my ($tl, $td) = (tokens($l, 0), tokens($d, 1));
  $css .= "\n/* $id: $name */\n";
  $css .= block(qq{[data-field="$id"]}, $tl, '');
  $css .= "\@media (prefers-color-scheme: dark) {\n"
    . block(qq{:root:not([data-theme="light"])[data-field="$id"], :root:not([data-theme="light"]) [data-field="$id"]}, $td, '  ', 'color-scheme: dark;') . "}\n";
  $css .= block(qq{:root[data-theme="dark"][data-field="$id"], :root[data-theme="dark"] [data-field="$id"]}, $td, '', 'color-scheme: dark;');
  for ([light => $tl, $l, '#2c7a57', '#b03f3b'], [dark => $td, $d, '#6cc49a', '#ec8e86']) {
    my ($mode, $t, $p, $ok, $bad) = @$_;
    push @report, sprintf '%-6s %-5s ink %5.2f  ink2 %5.2f/%5.2f  ink3 %5.2f/%5.2f  denim %5.2f/%5.2f  camelInk %5.2f/%5.2f  camel %4.2f  band-ink-2 %5.2f  ok %4.2f bad %4.2f',
      $id, $mode, cr($t->{'--ink'}, $p->{paper}), cr($t->{'--ink-2'}, $p->{paper}), cr($t->{'--ink-2'}, $p->{paper2}),
      cr($t->{'--ink-3'}, $p->{paper}), cr($t->{'--ink-3'}, $p->{paper2}), cr($p->{denim}, $p->{paper}), cr($p->{denim}, $p->{paper2}),
      cr($p->{camelInk}, $p->{paper}), cr($p->{camelInk}, $p->{paper2}), cr($p->{camel}, $p->{paper}), cr($t->{'--band-ink-2'}, $p->{band}),
      cr($ok, $p->{paper}), cr($bad, $p->{paper});
  }
}
$css .= <<'EOF';

/* 기초 수학은 다른 분야가 가져다 쓰는 곳이라 ‘이 개념을 쓰는 곳’ 상자에 보조색 선을 둡니다 */
[data-field="base"] .usedby { border-left: 3px solid var(--camel); }
EOF

# ---------- icon: italic é, the body in the field's light accent, the acute in its second color ----------
# outlines of "é" from Bodoni Moda Italic (wght 800, opsz 28), font units, y up
my $E = 'M386 -20Q272 -20 196.5 23.5Q121 67 83 139.5Q45 212 45 300Q45 427 93 542Q141 657 225.5 747Q310 837 421 888.5Q532 940 658 940Q815 940 903 874Q991 808 991 713Q991 644 950 586.5Q909 529 829 487Q749 445 630 418Q511 391 353 383L353 395Q417 398 476 437Q535 476 583 534Q631 592 667.5 656Q704 720 723.5 777Q743 834 743 870Q743 893 734 908Q725 923 704 923Q664 923 621.5 880Q579 837 538 764.5Q497 692 460.5 604.5Q424 517 396 425.5Q368 334 352 252Q336 170 336 114Q336 50 363.5 27Q391 4 439 4Q507 4 580 34Q653 64 724 122.5Q795 181 858 267L871 259Q821 191 753 127Q685 63 595 21.5Q505 -20 386 -20Z';
my $ACUTE = 'M587 1103L579 1112L731 1368Q755 1413 791 1433Q827 1453 865.5 1453Q904 1453 936 1437.5Q968 1422 984 1398Q1011 1359 1006 1308Q1001 1257 965.5 1216Q930 1175 867 1165Z';
my ($minX, $maxX, $minY, $maxY) = (45, 1007, -20, 1453);
my $S = 52 / ($maxY - $minY);
my ($TX, $TY) = (32 - $S * ($minX + $maxX) / 2 - 0.5, 32 + $S * ($minY + $maxY) / 2);
sub fit {
  my $d = shift;
  $d =~ s{(-?[\d.]+)[ ,](-?[\d.]+)}{sprintf('%.2f %.2f', $S * $1 + $TX, -$S * $2 + $TY)}ge;
  $d =~ s/(\.\d)0(?!\d)/$1/g;
  $d =~ s/\.0(?!\d)//g;
  $d =~ s/ -/-/g;
  $d;
}
my ($ED, $AD) = (fit($E), fit($ACUTE));
sub icon {
  my ($bg, $fg, $ac, $square) = @_;
  my $r = $square ? '' : ' rx="14"';
  qq{<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64"$r fill="$bg"/><path fill="$fg" d="$ED"/><path fill="$ac" d="$AD"/></svg>\n};
}
my %ICONS = (hub => [$HUB{band}, $HUB{ink}, $HUB{camel}]);
$ICONS{ $_->[0] } = [ $_->[2]{band}, $_->[3]{denim}, $_->[3]{camel} ] for @FIELDS;

print "$_\n" for @report;
exit if $CHECK;
open my $fh, '>', 'core/fields.css' or die $!;
print $fh $css;
close $fh;
mkdir 'assets/icons';
for my $id (sort keys %ICONS) {
  open my $o, '>', "assets/icons/$id.svg" or die $!;
  print $o icon(@{ $ICONS{$id} }, 0);
  close $o;
}
print "wrote core/fields.css, assets/icons/*.svg (" . (keys %ICONS) . " icons)\n";

# PNG copies for browsers without SVG icons: <id>-32.png (rounded) and <id>-180.png (full square; iOS rounds it itself).
# headless Chrome draws each SVG on a canvas and prints the PNG as base64
my $CHROME = '/c/Program Files/Google/Chrome/Application/chrome.exe';
if (-x $CHROME) {
  require MIME::Base64;
  my @jobs;
  for my $id (sort keys %ICONS) {
    push @jobs, ["$id-32", 32, icon(@{ $ICONS{$id} }, 0)], ["$id-180", 180, icon(@{ $ICONS{$id} }, 1)];
  }
  my $js = join ',', map { sprintf '["%s",%d,"%s"]', $_->[0], $_->[1], MIME::Base64::encode_base64($_->[2], '') } @jobs;
  my $tmp = ($ENV{TEMP} || '/tmp') . "/equation-icons-$$";
  mkdir $tmp;
  open my $h, '>', "$tmp/r.html" or die $!;
  print $h qq{<!doctype html><meta charset="utf-8"><pre id="o"></pre><script>
(async () => { const out = [];
  for (const [n, s, b] of [$js]) {
    const im = new Image(); im.src = 'data:image/svg+xml;base64,' + b; await im.decode();
    const c = document.createElement('canvas'); c.width = c.height = s; c.getContext('2d').drawImage(im, 0, 0, s, s);
    out.push(n + ' ' + c.toDataURL('image/png').split(',')[1]); }
  document.getElementById('o').textContent = out.join('\\n'); })();
</script>};
  close $h;
  chomp(my $url = `cygpath -m "$tmp/r.html"`);
  my $dom = `"$CHROME" --headless --disable-gpu --user-data-dir="$tmp/prof" --virtual-time-budget=5000 --dump-dom "file:///$url" 2>/dev/null`;
  my $n = 0;
  while ($dom =~ /\b([a-z]+-\d+) ([A-Za-z0-9+\/=]{40,})/g) {
    open my $p, '>:raw', "assets/icons/$1.png" or die $!;
    print $p MIME::Base64::decode_base64($2);
    close $p;
    $n++;
  }
  system('rm', '-rf', $tmp);
  print "wrote $n PNG icons\n";
  warn "expected " . (2 * keys %ICONS) . " PNG icons\n" if $n != 2 * keys %ICONS;
}
