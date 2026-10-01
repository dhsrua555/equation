/* Équation — 수학 노트 네트워크의 분야별 스터디 앱 (vanilla JS, hash routing, localStorage progress).
   분야마다 다른 이름·파트·문구는 <분야>/site.js의 window.SITE에, 분야 목록과 교차 색인은 core/net.js·net-index.js의 window.NET에 둡니다. */
(function () {
  'use strict';
  const EM = window.EM || { chapters: [], exams: [] };
  const SITE = window.SITE || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PARTS = SITE.parts || {};
  const TYPE = { mc: '객관식', num: '단답형', open: '서술형' };
  const LV = ['', '기초', '표준', '심화'];
  const MACROS = Object.assign({
    '\\Res': '\\operatorname*{Res}', '\\Arg': '\\operatorname{Arg}', '\\Ln': '\\operatorname{Ln}',
    '\\curl': '\\operatorname{curl}', '\\dv': '\\operatorname{div}', '\\grad': '\\operatorname{grad}', '\\Lap': '\\mathcal{L}',
    '\\Re': '\\operatorname{Re}', '\\Im': '\\operatorname{Im}', '\\rank': '\\operatorname{rank}',
    '\\tr': '\\operatorname{tr}', '\\sech': '\\operatorname{sech}',
    '\\E': '\\mathbb{E}', '\\R': '\\mathbb{R}', '\\N': '\\mathcal{N}', '\\KL': '\\operatorname{KL}',
    '\\Var': '\\operatorname{Var}', '\\Cov': '\\operatorname{Cov}', '\\diag': '\\operatorname{diag}',
    '\\sign': '\\operatorname{sign}', '\\argmax': '\\operatorname*{arg\\,max}', '\\argmin': '\\operatorname*{arg\\,min}',
    '\\softmax': '\\operatorname{softmax}', '\\ReLU': '\\operatorname{ReLU}', '\\Beta': '\\operatorname{Beta}',
  }, SITE.macros || {});
  const T = (k, fallback) => (SITE.text && SITE.text[k] != null ? SITE.text[k] : fallback);

  // ---------- data index ----------
  // detailed, detailed learning content (data/learn-*.js) replaces the short chapter text
  (EM.learn || []).forEach((l) => {
    const c = EM.chapters.find((x) => x.n === l.n);
    if (!c) return;
    ['sections', 'summary', 'goals', 'tagline'].forEach((k) => { if (l[k]) c[k] = l[k]; });
  });
  // extra problem sets (data/more-*.js) are appended after the original ones so stored progress ids stay valid
  (EM.more || []).forEach((m) => {
    const c = EM.chapters.find((x) => x.n === m.n);
    if (!c) return;
    if (m.secs) c.problems.forEach((p, k) => { if (!p.sec && m.secs[k]) p.sec = m.secs[k]; });
    c.secTitles = Object.assign(c.secTitles || {}, m.secTitles || {});
    c.problems.push(...(m.problems || []));
  });
  const CH = EM.chapters.slice().sort((a, b) => a.n - b.n);
  const chById = new Map();
  const PBY = new Map();
  CH.forEach((c) => {
    c.id = 'ch' + pad(c.n);
    chById.set(c.id, c);
    c.problems.forEach((p, k) => {
      p.ch = c.id; p.no = k + 1; p.src = 'practice';
      p.id = `${c.id}-p${pad(k + 1)}`;
      PBY.set(p.id, p);
    });
  });
  const EXAMS = EM.exams || [];
  // worked quiz / problem-set solutions (data/quiz-*.js): a separate "퀴즈풀이" page
  const QUIZ = EM.quizzes || [];
  const QUIZ_LABEL = (SITE.text && SITE.text.quizNav) || '퀴즈풀이';
  const QUIZ_MORE = (SITE.text && SITE.text.quizMore) || '퀴즈 대비 연습문제';
  // extra header links a field asks for, e.g. the unit its lecture slides live in: SITE.nav = [{ label, route, title }]
  const NAV_X = SITE.nav || [];
  // quiz problems ↔ units: a quiz problem lists its sections in secs: ['ch02:2.6', …];
  // a practice problem of the same kind carries quiz: '<set>-<problem>' (or true for quiz-style in general)
  const QZP = new Map();
  QUIZ.forEach((q) => q.problems.forEach((p) => QZP.set(`${q.id}-${p.id}`, { q, p })));
  // worked-solution pages in the same layout: 퀴즈풀이 and, when a field has data/hard-*.js (EM.hard), 고난이도.
  // each page has its own route (#quiz, #hard), problem routes (#hard-<set>-<problem>) and anchor prefix
  const TX = SITE.text || {};
  const BOOKS = [
    { key: 'quiz', pre: 'qz', sets: QUIZ, label: QUIZ_LABEL, caps: 'Worked problems', h1: 'Corrigés', lede: 'quizLede',
      ledeDef: '수업에서 받은 문제를 풀이와 함께 정리했습니다. 문제마다 먼저 핵심 포인트를 읽고 직접 풀어 본 뒤 풀이를 펼쳐 비교하세요.', intro: '답안 작성 원칙', practice: true },
    { key: 'hard', pre: 'hd', sets: EM.hard || [], label: TX.hardNav || '고난이도', caps: 'Challenge problems', h1: 'Défis', lede: 'hardLede',
      ledeDef: '교재 연습문제 가운데 어려운 문제를 골라 풀이와 함께 정리했습니다.', intro: '이 장을 푸는 법', practice: false },
  ].filter((b) => b.sets.length);
  const BOOK = new Map(BOOKS.map((b) => [b.key, b]));
  const bookOf = (r) => BOOK.get(String(r).split('-')[0]);
  // every worked problem, for the links under a section title
  const WORKED = [];
  BOOKS.forEach((b) => b.sets.forEach((q) => q.problems.forEach((p) => WORKED.push({ id: `${q.id}-${p.id}`, b, q, p }))));
  // interactive simulations: <field>/sims.js registers them in window.SITE_SIMS (drawn with core/simkit.js).
  // Content embeds one as ":::sim name [preset]"; the #lab page gathers them all
  const SIMREG = window.SITE_SIMS || {};
  const SIMS = Object.keys(SIMREG).filter((k) => SIMREG[k] && SIMREG[k].title && SIMREG[k].mount).map((k) => Object.assign({ id: k }, SIMREG[k]));
  const LAB_LABEL = TX.labNav || '시뮬레이션';
  EXAMS.forEach((x) => {
    x.problems.forEach((p, k) => {
      p.no = k + 1; p.src = x.id;
      p.id = `${x.id}-q${pad(k + 1)}`;
      PBY.set(p.id, p);
    });
  });
  const examById = new Map(EXAMS.map((x) => [x.id, x]));
  // proofs: searchable, linked from the key-formula boxes they prove
  const PROOFS = (EM.proofs || []).filter((p) => chById.has(p.ch));
  PROOFS.forEach((p) => { p.pid = `${p.ch}-${p.id}`; });
  PROOFS.sort((a, b) => a.ch.localeCompare(b.ch));
  const proofById = new Map(PROOFS.map((p) => [p.pid, p]));
  const proofsByKey = new Map();
  PROOFS.forEach((p) => (p.keys || []).forEach((k) => {
    if (!proofsByKey.has(k)) proofsByKey.set(k, []);
    proofsByKey.get(k).push(p);
  }));
  // ---------- bilingual fields (SITE.bilingual): English text first, the original Korean as a translation toggle ----------
  // English lives in data/en-*.js as EM.en = { ch: {n: {title, tagline, summary, goals, fig, secs: {k: {title, body}}, probs: [...]}},
  // pf: {pid: {...}}, ex: {examId: {..., probs: [...]}}, qz: {setId: {..., probs: {pid: {...}}}}, fig: {name: caption} }.
  // Each English body mirrors the Korean one paragraph by paragraph (tools/checks.js verifies the shapes match).
  const EN = window.EM && EM.en ? EM.en : null;
  const BI = !!(SITE.bilingual && EN);
  if (BI) {
    Object.values(PARTS).forEach((p) => {
      if (p.en) { p.nameKo = p.name; p.name = p.en; p.en = p.nameKo; }
      if (p.descEn) { p.descKo = p.desc; p.desc = p.descEn; }
    });
    CH.forEach((c) => {
      const e = (EN.ch || {})[c.n];
      if (!e) return;
      c.enData = e;
      // “W3 월 · s.3–13, W4 수 필기” → “W3 Mon · s.3–13, W4 Wed notes”
      if (c.ref) { c.refKo = c.ref; c.ref = c.ref.replace(/월/g, 'Mon').replace(/수/g, 'Wed').replace(/필기/g, 'notes'); }
      if (e.title) { const ko = c.title; c.title = e.title; c.en = ko; c.titleKo = ko; }
      if (e.secTitles) { c.secTitlesKo = c.secTitles; c.secTitles = Object.assign({}, c.secTitles, e.secTitles); }
      c.sections.forEach((s) => {
        const se = (e.secs || {})[s.k];
        if (!se) return;
        s.enData = se;
        if (se.title) { s.titleKo = s.title; s.title = se.title; }
      });
      c.problems.forEach((p, k) => { const pe = (e.probs || [])[k]; if (pe) p.enData = pe; });
    });
    PROOFS.forEach((p) => {
      const pe = (EN.pf || {})[p.pid];
      if (!pe) return;
      p.enData = pe;
      if (pe.title) { p.titleKo = p.title; p.title = pe.title; }
      // the “lecture notes · W1 수 s.6” chip, in English like the section sources
      if (p.src) { p.srcKo = p.src; p.src = p.src.replace('강의 필기', 'Lecture notes').replace(/월/g, 'Mon').replace(/수/g, 'Wed'); }
    });
    EXAMS.forEach((x) => {
      const xe = (EN.ex || {})[x.id];
      if (!xe) return;
      x.enData = xe;
      ['title', 'kind', 'desc', 'scopeText'].forEach((f) => { if (xe[f]) { x[f + 'Ko'] = x[f]; x[f] = xe[f]; } });
      x.problems.forEach((p, k) => { const pe = (xe.probs || [])[k]; if (pe) p.enData = pe; });
    });
    QUIZ.forEach((q) => {
      const qe = (EN.qz || {})[q.id];
      if (!qe) return;
      q.enData = qe;
      ['title', 'meta'].forEach((f) => { if (qe[f]) { q[f + 'Ko'] = q[f]; q[f] = qe[f]; } });
      q.problems.forEach((p) => {
        const pe = (qe.probs || {})[p.id];
        if (!pe) return;
        p.enData = pe;
        ['title', 'where', 'label'].forEach((f) => { if (pe[f]) { p[f + 'Ko'] = p[f]; p[f] = pe[f]; } });
      });
    });
  }
  // cross-references between chapters: [[ch05:6.2|note text]] inside content.
  // [[@base:ch01:1.3|note]] points to another field of the Équation network (window.NET), or to a sister site in SITE.sisters.
  const XREF_RE = /\[\[(@[a-z]+:)?(ch\d{2})(?::(\d+\.\d+[a-z]?))?\|([\s\S]+?)\]\]/g;
  const XLINKS = [];
  CH.forEach((c) => c.sections.forEach((s) => {
    String(s.body).replace(XREF_RE, (_, site, ch, k) => { XLINKS.push({ from: c.id, fromK: s.k || '', to: ch, toK: k || '', site: site ? site.slice(1, -1) : '' }); return ''; });
  }));
  // ---------- network: the other fields of Équation ----------
  const NET = window.NET || null;
  const FIELD = SITE.field || '';
  const ROOT = window.NET_ROOT != null ? window.NET_ROOT : '../';
  // the hub is the folder above; a file:// page needs the file name itself
  const NET_HOME = window.NET_HOME || (location.protocol === 'file:' ? `${ROOT}index.html` : ROOT);
  const netFields = NET ? NET.fields.filter((f) => f.live) : [];
  const fieldUrl = (f) => `${ROOT}${f.path}index.html`;
  // sister sites outside the network keep opening in a new tab; fields inside it open in place
  const SISTERS = Object.assign({}, SITE.sisters || {}, Object.fromEntries(netFields.filter((f) => f.id !== FIELD).map((f) => {
    const ix = (NET.index || {})[f.id] || {};
    return [f.id, { name: f.name, mark: f.en, url: fieldUrl(f), desc: f.desc, chapters: ix.chapters || {}, secs: ix.secs || {}, net: true }];
  })));
  // links from other fields into this one (collected by tools/netindex.sh), for "이 단원을 이어받는 내용"
  const NET_IN = NET && NET.links ? NET.links.filter((l) => l.to === FIELD && l.from !== FIELD) : [];
  const normText = (s) => String(s || '').toLowerCase()
    .replace(/\\([a-z]+)/g, '$1')
    .replace(/[\s{}$^_\\()[\],.·:;'"`~!?=+*/|<>–—-]/g, '');
  const PRACTICE_TOTAL = CH.reduce((s, c) => s + c.problems.length, 0);

  // ---------- storage ----------
  const KEY = SITE.key || 'study-v1';
  let S = { prog: {}, hist: [], live: null, prefs: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      S = { prog: d.prog || {}, hist: d.hist || [], live: d.live || null, prefs: d.prefs || {} };
    }
  } catch (e) { /* storage unavailable: run without persistence */ }
  let saveTimer = null;
  function save(now) {
    const run = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
    clearTimeout(saveTimer);
    if (now) run(); else saveTimer = setTimeout(run, 250);
  }
  function setProg(pid, s) {
    const prev = S.prog[pid];
    S.prog[pid] = { s, n: (prev ? prev.n : 0) + 1, t: Date.now() };
    save();
  }

  // ---------- math + markdown ----------
  const texCache = new Map();
  function tex(t, display) {
    const key = (display ? 'D' : 'I') + t;
    if (texCache.has(key)) return texCache.get(key);
    let html;
    if (window.katex) {
      try {
        html = window.katex.renderToString(t, { displayMode: !!display, throwOnError: false, strict: 'ignore', macros: Object.assign({}, MACROS) });
      } catch (e) { html = `<code>${esc(t)}</code>`; }
    } else {
      html = `<code>${esc(t)}</code>`;
    }
    texCache.set(key, html);
    return html;
  }
  function inline(s) {
    if (!s) return '';
    const math = [];
    let t = String(s)
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => { math.push([m, true]); return `\u0000${math.length - 1}\u0000`; })
      .replace(/\$([^$]+?)\$/g, (_, m) => { math.push([m, false]); return `\u0000${math.length - 1}\u0000`; });
    const restore = (x) => x
      .replace(/\u0001(\d+)\u0001([^\u0002]*)\u0002/g, (_, k, tail) => glueTail(tex(math[k][0], math[k][1]), tail, math[k][1]))
      .replace(/\u0000(\d+)\u0000/g, (_, k) => tex(math[k][0], math[k][1]));
    t = esc(t)
      .replace(/\u0000(\d+)\u0000([^\s\u0000[\]*<]+)/g, '\u0001$1\u0001$2\u0002')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(XREF_RE, (_, site, ch, k, text) => xref(ch, k, restore(text), site ? site.slice(1, -1) : ''));
    return restore(t);
  }
  // put the text right after an inline formula (…$x$로) inside its last box so the line can't break between them;
  // the box is aria-hidden, so screen readers get a hidden copy
  function glueTail(html, tail, display) {
    const i = html.lastIndexOf('</span></span></span>');
    if (display || i < 0 || !html.startsWith('<span class="katex">')) return html + tail;
    return `${html.slice(0, i)}<span class="kp">${tail}</span>${html.slice(i)}<span class="sr-only">${tail}</span>`;
  }
  // footnote-style link to another chapter; collected per section while NOTES is active
  let NOTES = null;
  let NOTEKEY = '';
  function xrefTarget(ch, k, site) {
    if (site) {
      const s = SISTERS[site];
      if (!s) return null;
      const c = (s.chapters || {})[ch];
      const secTitle = k && s.secs ? s.secs[`${ch}:${k}`] : '';
      return {
        ext: true,
        href: `${s.url || ''}#${k ? `${ch}-k${k}` : ch}`,
        route: `${site}:${ch}${k ? `:${k}` : ''}`,
        label: `${s.name} · ${ch.slice(2)} ${c || ''}${k ? ` · §${k}${secTitle ? ` ${secTitle}` : ''}` : ''}`,
        site: s,
      };
    }
    const c = chById.get(ch);
    if (!c) return null;
    const sec = k ? c.sections.find((s) => s.k === k) : null;
    return {
      route: sec ? `${ch}-k${k}` : ch,
      label: `${pad(c.n)} ${c.title}${sec ? ` · §${sec.label || k} ${sec.title}` : ''}`,
    };
  }
  const extAttrs = (tg) => (tg.site && tg.site.net ? `href="${esc(tg.href)}"` : `href="${esc(tg.href)}" target="_blank" rel="noopener"`);
  function xref(ch, k, textHtml, site) {
    if (KO_MODE) return ''; // the English text above carries the note
    const tg = xrefTarget(ch, k, site);
    if (!tg) return site ? '' : textHtml; // a sister outside the network that is not linked: drop the note
    if (NOTES) {
      const n = NOTES.push({ route: tg.route, label: tg.label, text: textHtml, tg });
      return `<sup class="fn${tg.ext ? ' ext' : ''}" id="fnref-${NOTEKEY}-${n}"><a href="#${tg.ext ? '' : tg.route}" data-act="scroll" data-target="fn-${NOTEKEY}-${n}" aria-label="연결 주석 ${n}: ${esc(tg.label)}">${tg.ext ? '↗' : '※'}${n}</a></sup>`;
    }
    if (tg.ext) return `<a class="xref ext" ${extAttrs(tg)} title="${esc(tg.label)}">↗ ${esc(tg.label)}</a>`;
    return `<a class="xref" href="#${tg.route}" data-route="${tg.route}" title="${esc(tg.label)}">→ ${esc(tg.label)}</a>`;
  }
  const noteLink = (n) => (n.tg && n.tg.ext
    ? `<a class="ext" ${extAttrs(n.tg)}>${esc(n.label)} ↗</a>`
    : `<a href="#${n.route}" data-route="${n.route}">${esc(n.label)} →</a>`);
  function sectionHTML(c, sec, idx) {
    NOTES = [];
    NOTEKEY = `${c.id}-${idx}`;
    const body = mdOf(sec, 'body');
    const notes = NOTES;
    const key = NOTEKEY;
    NOTES = null;
    const num = sec.label ? (/^\d/.test(sec.label) ? `§${sec.label}` : sec.label) : sec.k ? `§${sec.k}` : `${c.n}.${idx}`;
    const where = SITE.secSource ? SITE.secSource(sec, c) : (sec.p ? `p.${sec.p}` : '');
    const worked = WORKED.filter((x) => (x.p.secs || []).includes(`${c.id}:${sec.k}`));
    return `<section class="sec" id="sec-${sec.k || idx}">
      <div class="sec-title"><span>${num}</span><h2>${esc(sec.title)}${koT(sec.titleKo)}</h2></div>
      ${where ? `<p class="sec-page caps">${esc(where)}</p>` : ''}
      ${worked.length ? `<p class="sec-quiz">${worked.map((x) => `<a href="#${x.b.key}-${x.id}" data-route="${x.b.key}-${x.id}">${esc(x.b.label)} · ${esc(x.q.short || x.q.title)} ${esc(x.p.label || x.p.id)} ${esc(x.p.title)} →</a>`).join('')}</p>` : ''}
      ${body}
      ${notes.length ? `<aside class="xnotes" aria-label="다른 단원과의 연결"><span class="caps">연결 주석</span><ol>${notes.map((n, i) => `
        <li id="fn-${key}-${i + 1}"><button class="fn-back" data-act="scroll" data-target="fnref-${key}-${i + 1}" aria-label="본문으로 돌아가기">${n.tg && n.tg.ext ? '↗' : '※'}${i + 1}</button>
          <div>${noteLink(n)}<span class="fn-t">${n.text}</span></div></li>`).join('')}</ol></aside>` : ''}
      ${usedBy(c, sec)}
    </section>`;
  }
  // where other fields of the network lean on this section
  function usedBy(c, sec) {
    const seen = new Map();
    NET_IN.filter((l) => l.toCh === c.id && l.toK === sec.k).forEach((l) => {
      const tg = xrefTarget(l.fromCh, l.fromK, l.from);
      if (tg) seen.set(tg.route, tg);
    });
    if (!seen.size) return '';
    return `<aside class="usedby" aria-label="이 개념을 쓰는 곳"><span class="caps">이 개념을 쓰는 곳</span><ul>${[...seen.values()]
      .sort((a, b) => a.route.localeCompare(b.route))
      .map((tg) => `<li><a class="ext" ${extAttrs(tg)}>${esc(tg.label)}</a></li>`).join('')}</ul></aside>`;
  }
  function connectionMap(c) {
    const out = new Map();
    const inc = new Map();
    const ext = new Map();
    XLINKS.forEach((l) => {
      if (l.from === c.id && l.site) {
        const tg = xrefTarget(l.to, l.toK, l.site);
        if (tg) ext.set(tg.route, tg);
        return;
      }
      if (l.from === c.id && l.to !== c.id) {
        const tg = xrefTarget(l.to, l.toK);
        if (tg) out.set(tg.route, tg.label);
      }
      if (l.to === c.id && l.from !== c.id && !l.site) {
        const tg = xrefTarget(l.from, l.fromK);
        if (tg) inc.set(tg.route, tg.label);
      }
    });
    const back = new Map();
    NET_IN.filter((l) => l.toCh === c.id).forEach((l) => {
      const tg = xrefTarget(l.fromCh, l.fromK, l.from);
      if (tg) back.set(tg.route, tg);
    });
    if (!out.size && !inc.size && !ext.size && !back.size) return '';
    const list = (m) => [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([r, lb]) => `<li><a href="#${r}" data-route="${r}">${esc(lb)}</a></li>`).join('');
    const elist = (m) => [...m.values()].sort((a, b) => a.route.localeCompare(b.route)).map((tg) => `<li><a class="ext" ${extAttrs(tg)}>${esc(tg.label)} ↗</a></li>`).join('');
    return `<section class="sec connmap" id="sec-links">
      <div class="sec-title"><span>↔</span><h2>다른 단원과의 연결</h2></div>
      <div class="connmap-grid">
        ${out.size ? `<div><span class="caps">이 단원이 가져다 쓰는 내용</span><ul>${list(out)}</ul></div>` : ''}
        ${inc.size ? `<div><span class="caps">이 단원을 이어받는 내용</span><ul>${list(inc)}</ul></div>` : ''}
        ${ext.size ? `<div class="connmap-ext"><span class="caps">다른 분야에서 가져다 쓰는 내용</span><ul>${elist(ext)}</ul></div>` : ''}
        ${back.size ? `<div class="connmap-ext"><span class="caps">다른 분야에서 이 단원을 쓰는 곳</span><ul>${elist(back)}</ul></div>` : ''}
      </div>
    </section>`;
  }
  function dedent(src) {
    const lines = String(src).replace(/\r/g, '').split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length));
    return lines.map((l) => l.slice(isFinite(ind) ? ind : 0));
  }
  const BLOCK_LABEL = {
    key: ['Key', 'blk-key'], thm: ['Theorem', 'blk-thm'], ex: ['Example', 'blk-ex'],
    tip: ['Exam tip', 'blk-tip'], warn: ['Pitfall', 'blk-warn'], note: ['Note', 'blk-thm'],
    def: ['Definition', 'blk-def'], idea: ['Idea', 'blk-idea'],
    hand: ['Lecture note', 'blk-hand'], pf: ['Proof', 'blk-pf'],
  };
  function isBlockStart(l) {
    const t = l.trim();
    return t.startsWith(':::') || t.startsWith('### ') || t.startsWith('$$') || t.startsWith('|') || /^[-•]\s+/.test(t) || /^\d+[.)]\s+/.test(t);
  }
  function md(src) {
    if (!src) return '';
    return mdCore(dedent(src));
  }
  // the top-level pieces md() draws one after another: heading, ::: box, display math, table, list, paragraph.
  // The bilingual renderer pairs an English body with its Korean original piece by piece.
  function scanSegs(src) {
    const L = dedent(src || '');
    const out = [];
    let i = 0;
    while (i < L.length) {
      const t = L[i].trim();
      if (!t) { i++; continue; }
      const s = i;
      if (t.startsWith('### ')) { i++; out.push({ kind: 'h3', text: t.slice(4).trim(), lines: L.slice(s, i) }); continue; }
      const m = /^:::(\w+)\s*(.*)$/.exec(t);
      if (m) {
        const inner = [];
        let depth = 0;
        i++;
        while (i < L.length) {
          const tt = L[i].trim();
          if (/^:::\w/.test(tt)) depth++;
          else if (tt === ':::') { if (depth === 0) break; depth--; }
          inner.push(L[i]);
          i++;
        }
        i++;
        out.push({ kind: 'blk', type: m[1], title: m[2], inner: inner.join('\n'), lines: L.slice(s, Math.min(i, L.length)) });
        continue;
      }
      let kind;
      if (t.startsWith('$$')) {
        kind = 'math';
        const buf = t.slice(2);
        i++;
        if (!(buf.trim().length >= 2 && buf.trim().endsWith('$$'))) {
          while (i < L.length && !L[i].trim().endsWith('$$')) i++;
          if (i < L.length) i++;
        }
      } else if (t.startsWith('|')) {
        kind = 'table';
        while (i < L.length && L[i].trim().startsWith('|')) i++;
      } else if (/^[-•]\s+/.test(t) || /^\d+[.)]\s+/.test(t)) {
        const isUl = /^[-•]\s+/.test(t);
        const re = isUl ? /^[-•]\s+/ : /^\d+[.)]\s+/;
        kind = isUl ? 'ul' : 'ol';
        while (i < L.length && re.test(L[i].trim())) {
          i++;
          while (i < L.length && L[i].trim() && /^\s{2,}/.test(L[i]) && !isBlockStart(L[i])) i++;
        }
      } else {
        kind = 'p';
        i++;
        while (i < L.length && L[i].trim() && !isBlockStart(L[i])) i++;
      }
      out.push({ kind, lines: L.slice(s, i) });
    }
    return out;
  }
  function mdCore(L) {
    let out = '';
    let i = 0;
    while (i < L.length) {
      const line = L[i];
      const t = line.trim();
      if (!t) { i++; continue; }
      if (t.startsWith('### ')) { out += `<h3 class="sub">${inline(t.slice(4).trim())}</h3>`; i++; continue; }
      let m = /^:::(\w+)\s*(.*)$/.exec(t);
      if (m) {
        const inner = [];
        let depth = 0;
        i++;
        while (i < L.length) {
          const tt = L[i].trim();
          if (/^:::\w/.test(tt)) depth++;
          else if (tt === ':::') { if (depth === 0) break; depth--; }
          inner.push(L[i]);
          i++;
        }
        i++;
        out += container(m[1], m[2], inner.join('\n'));
        continue;
      }
      if (t.startsWith('$$')) {
        let buf = t.slice(2);
        if (buf.trim().length >= 2 && buf.trim().endsWith('$$')) {
          buf = buf.trim().slice(0, -2);
          i++;
        } else {
          i++;
          while (i < L.length && !L[i].trim().endsWith('$$')) { buf += '\n' + L[i]; i++; }
          if (i < L.length) { buf += '\n' + L[i].trim().slice(0, -2); i++; }
        }
        out += `<div class="mathblock">${tex(buf, true)}</div>`;
        continue;
      }
      if (t.startsWith('|')) {
        const rows = [];
        while (i < L.length && L[i].trim().startsWith('|')) { rows.push(L[i].trim()); i++; }
        const cells = (r) => r.replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim());
        let head = null;
        let body = rows;
        if (rows.length > 1 && /^\|?\s*:?-{2,}/.test(rows[1])) { head = cells(rows[0]); body = rows.slice(2); }
        out += '<div class="tbl-wrap"><table class="tbl">' +
          (head ? `<thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead>` : '') +
          `<tbody>${body.map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
        continue;
      }
      if (/^[-•]\s+/.test(t)) {
        const items = [];
        while (i < L.length && /^[-•]\s+/.test(L[i].trim())) {
          let item = L[i].trim().replace(/^[-•]\s+/, '');
          i++;
          while (i < L.length && L[i].trim() && /^\s{2,}/.test(L[i]) && !isBlockStart(L[i])) { item += ' ' + L[i].trim(); i++; }
          items.push(item);
        }
        out += `<ul>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>`;
        continue;
      }
      if (/^\d+[.)]\s+/.test(t)) {
        const items = [];
        while (i < L.length && /^\d+[.)]\s+/.test(L[i].trim())) {
          let item = L[i].trim().replace(/^\d+[.)]\s+/, '');
          i++;
          while (i < L.length && L[i].trim() && /^\s{2,}/.test(L[i]) && !isBlockStart(L[i])) { item += ' ' + L[i].trim(); i++; }
          items.push(item);
        }
        out += `<ol>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ol>`;
        continue;
      }
      const buf = [t];
      i++;
      while (i < L.length && L[i].trim() && !isBlockStart(L[i])) { buf.push(L[i].trim()); i++; }
      // a line opening with "(a) ", "(ii) ", "**(b1)**" … starts a new line inside the paragraph
      const segs = [[]];
      buf.forEach((s, k) => { if (k && /^(\*\*)?\((?:[a-h]\d?|[ivx]{1,4}|\d{1,2})\)/.test(s)) segs.push([]); segs[segs.length - 1].push(s); });
      out += `<p>${segs.map((g) => inline(g.join(' '))).join('<br>')}</p>`;
    }
    return out;
  }
  // built-in SVG figures referenced from content as ":::fig name" (assets/figs.js fills window.SITE_FIGS)
  const FIGS = window.SITE_FIGS || {};
  let CUR_CH = null; // chapter whose content is being rendered, so key titles only match that chapter's proofs
  function proofLinks(title, ch) {
    const scope = ch || CUR_CH;
    const list = (proofsByKey.get(String(title || '').trim()) || []).filter((p) => !scope || p.ch === scope);
    if (!list || !list.length) return '';
    return `<div class="pf-links"><span class="caps">Proof</span>${list.map((p) =>
      `<a href="#pf-${p.pid}" data-route="pf-${p.pid}">${inline(p.title)}</a>`).join('')}</div>`;
  }
  function simFig(spec, cap, tries) {
    const [name, ...rest] = String(spec || '').trim().split(/\s+/);
    const s = SIMREG[name];
    if (!s || !s.mount) return '';
    return `<figure class="sim" data-sim="${esc(name)}" data-arg="${esc(rest.join(' '))}">
      <div class="sim-head"><span class="caps">Simulation</span><b>${esc(s.title)}</b>${route.startsWith('lab') ? '' : `<a href="#lab-${esc(name)}" data-route="lab-${esc(name)}">${esc(LAB_LABEL)} 모아 보기 →</a>`}</div>
      <div class="sim-stage"><p class="sim-wait">시뮬레이션을 준비하는 중…</p></div>
      ${cap && String(cap).trim() ? `<figcaption>${md(cap)}</figcaption>` : ''}
      ${tries && tries.length ? `<div class="sim-try"><span class="caps">해 볼 것</span><ol>${tries.map((t) => `<li>${inline(t)}</li>`).join('')}</ol></div>` : ''}</figure>`;
  }
  // build every simulation placeholder under root (once per element)
  function mountSims(root) {
    (root || main).querySelectorAll('figure.sim[data-sim]:not([data-on])').forEach((f) => {
      f.setAttribute('data-on', '');
      const s = SIMREG[f.dataset.sim];
      const stage = f.querySelector('.sim-stage');
      if (!s || !stage) return;
      stage.innerHTML = '';
      try { s.mount(stage, f.dataset.arg || ''); } catch (e) {
        stage.innerHTML = '<p class="sim-wait">시뮬레이션을 열지 못했습니다.</p>';
        if (window.__errors) window.__errors.push(`sim ${f.dataset.sim}: ${e.message}`); else console.error(e);
      }
    });
  }
  function container(type, title, inner) {
    if (type === 'sim') return simFig(title, inner);
    if (type === 'fig') {
      const fn = FIGS[title.trim()];
      const capEn = BI && EN.fig ? EN.fig[title.trim()] : '';
      let h = fn ? fn() : '';
      if (h && BI && EN.figText) { // labels drawn inside the figure
        const tr = (t) => { const s = t.trim(); const e = EN.figText[s]; return e ? t.replace(s, e) : t; };
        const at = h.indexOf('<figcaption>');
        const g = at < 0 ? h : h.slice(0, at);
        h = g.replace(/>([^<>]+)</g, (m, t) => `>${tr(t)}<`).replace(/(aria-label|title)="([^"]+)"/g, (m, a, t) => `${a}="${tr(t)}"`) + (at < 0 ? '' : h.slice(at));
      }
      return fn ? h.replace(/<figcaption>([\s\S]*?)<\/figcaption>/, (_, t) => `<figcaption>${capEn
        ? koPair(`<span>${inline(capEn)}</span>`, `<span>${koSide(() => inline(t))}</span>`) : inline(t)}</figcaption>`) : '';
    }
    const [label, cls] = BLOCK_LABEL[type] || ['Note', 'blk-thm'];
    const head = `<div class="blk-label">${label}${title ? `<em>${inline(title)}</em>` : ''}</div>`;
    if (type === 'key' || type === 'thm') return `<div class="blk ${cls}">${head}${md(inner)}${proofLinks(title)}</div>`;
    if (type === 'ex') {
      const parts = inner.split(/\n\s*---\s*\n/);
      const q = parts[0];
      const a = parts.slice(1).join('\n');
      return `<div class="blk ${cls}">${head}${md(q)}${a ? `<details class="sol"><summary>풀이 보기</summary><div>${md(a)}</div></details>` : ''}</div>`;
    }
    if (type === 'pf') return `<div class="blk ${cls}">${head}${md(inner)}<p class="qed" aria-label="증명 끝">∎</p></div>`;
    return `<div class="blk ${cls}">${head}${md(inner)}</div>`;
  }
  // key-formula blocks per chapter, for the formula sheet
  function keyBlocks(c) {
    if (c._keys) return c._keys;
    const found = [];
    c.sections.forEach((s, si) => {
      const L = dedent(s.body);
      for (let i = 0; i < L.length; i++) {
        const m = /^:::key\s*(.*)$/.exec(L[i].trim());
        if (!m) continue;
        const inner = [];
        let depth = 0;
        i++;
        while (i < L.length) {
          const tt = L[i].trim();
          if (/^:::\w/.test(tt)) depth++;
          else if (tt === ':::') { if (depth === 0) break; depth--; }
          inner.push(L[i]);
          i++;
        }
        found.push({ title: m[1] || s.titleKo || s.title, k: s.k || "", body: inner.join('\n'), sec: `${s.k ? `§${s.k}` : `${c.n}.${si + 1}`} ${s.title}` });
      }
    });
    c._keys = found;
    return found;
  }

  // ---------- bilingual rendering ----------
  // the page switch: every Korean translation open at once (remembered per browser)
  function applyKoAll() {
    const on = !!S.prefs.koAll;
    document.body.classList.toggle('ko-on', on);
    const b = document.getElementById('ko-all');
    if (b) { b.setAttribute('aria-pressed', String(on)); b.querySelector('span').textContent = on ? '한국어 번역 모두 숨기기' : '한국어 번역 모두 보기'; }
  }
  let KO_MODE = false; // rendering the Korean side: cross-reference notes are left to the English text
  const KO_BTN = '<button class="ko-btn" type="button" data-act="ko" aria-expanded="false" aria-label="한국어 번역 보기" title="한국어 번역">KO</button>';
  const koT = (t) => (t ? `<span class="ko-t" lang="ko">${inline(t)}</span>` : '');
  function koSide(fn) {
    const n = NOTES, k = KO_MODE;
    NOTES = null; KO_MODE = true;
    try { return fn(); } finally { NOTES = n; KO_MODE = k; }
  }
  // an English piece with its Korean original under a KO button (chips: false → shown only by a card-level or page-level switch)
  function koPair(enHtml, koHtml, opt) {
    const chip = !opt || opt.chips !== false;
    return `<div class="bi${chip ? '' : ' nochip'}">${enHtml}${chip ? KO_BTN : ''}<div class="ko-body" lang="ko">${koHtml}</div></div>`;
  }
  // site-level prose from site.js (SITE.text): SITE.textEn holds the English, and the Korean original sits behind the same KO toggle
  const TE = (k) => (BI && SITE.textEn && SITE.textEn[k] != null ? SITE.textEn[k] : null);
  function proseP(k, fallback, cls, fn) {
    const f = fn || ((s) => s);
    const p = (s) => `<p${cls ? ` class="${cls}"` : ''}>${f(s)}</p>`;
    const en = TE(k);
    return en == null ? p(T(k, fallback)) : koPair(p(en), p(T(k, fallback)));
  }
  const proseH = (k, fallback) => (TE(k) == null ? T(k, fallback) : `${TE(k)}${koT(T(k, fallback))}`);
  const segShape = (A, B) => A.length === B.length && A.every((a, k) => a.kind === B[k].kind && (a.kind !== 'blk' || a.type === B[k].type));
  function bimd(en, ko, opt) {
    if (!BI || !en) return md(ko || en);
    if (!ko) return md(en);
    const A = scanSegs(en), B = scanSegs(ko);
    if (!segShape(A, B)) return md(en) + koPair('', koSide(() => md(ko)), opt);
    return A.map((a, k) => biSeg(a, B[k], opt)).join('');
  }
  function biSeg(a, b, opt) {
    if (a.kind === 'blk') return biContainer(a, b, opt);
    if (a.lines.join('\n') === b.lines.join('\n')) return mdCore(a.lines);
    if (a.kind === 'h3') return `<h3 class="sub">${inline(a.text)}${koT(b.text)}</h3>`;
    return koPair(mdCore(a.lines), koSide(() => mdCore(b.lines)), opt);
  }
  function biContainer(a, b, opt) {
    const type = a.type;
    if (type === 'fig') return container('fig', a.title, a.inner);
    if (type === 'sim') return container('sim', a.title, a.inner);
    const [label, cls] = BLOCK_LABEL[type] || ['Note', 'blk-thm'];
    const tko = b.title && b.title !== a.title ? b.title : '';
    const head = `<div class="blk-label">${label}${a.title ? `<em>${inline(a.title)}${koT(tko)}</em>` : ''}</div>`;
    if (type === 'key' || type === 'thm') return `<div class="blk ${cls}">${head}${bimd(a.inner, b.inner, opt)}${proofLinks(b.title || a.title)}</div>`;
    if (type === 'ex') {
      const pa = a.inner.split(/\n\s*---\s*\n/), pb = b.inner.split(/\n\s*---\s*\n/);
      const ans = pa.slice(1).join('\n'), ansKo = pb.slice(1).join('\n');
      return `<div class="blk ${cls}">${head}${bimd(pa[0], pb[0], opt)}${ans ? `<details class="sol"><summary>풀이 보기</summary><div>${bimd(ans, ansKo, opt)}</div></details>` : ''}</div>`;
    }
    if (type === 'pf') return `<div class="blk ${cls}">${head}${bimd(a.inner, b.inner, opt)}<p class="qed" aria-label="증명 끝">∎</p></div>`;
    return `<div class="blk ${cls}">${head}${bimd(a.inner, b.inner, opt)}</div>`;
  }
  // a markdown field of an object that may carry English in obj.enData
  const mdOf = (o, f, opt) => (BI && o && o.enData && o.enData[f] ? bimd(o.enData[f], o[f], opt) : md(o ? o[f] : ''));
  // a one-line field: English, with the Korean shown by the page or card switch
  const ilOf = (o, f) => (BI && o && o.enData && o.enData[f] ? `${inline(o.enData[f])}${koT(o[f])}` : inline(o ? o[f] : ''));
  // a paragraph field (chapter summary): English paragraph with its own KO button
  const paraOf = (o, f) => (BI && o && o.enData && o.enData[f] ? koPair(`<p>${inline(o.enData[f])}</p>`, `<p>${inline(o[f])}</p>`) : `<p>${inline(o[f])}</p>`);
  const choiceOf = (p, k) => (BI && p.enData && p.enData.choices ? `${inline(p.enData.choices[k])}${koT(p.choices[k])}` : inline(p.choices[k]));
  function goalsOf(c) {
    const list = (g) => `<ul class="goals">${g.map((x) => `<li><span>${inline(x)}</span></li>`).join('')}</ul>`;
    return BI && c.enData && c.enData.goals ? koPair(list(c.enData.goals), list(c.goals)) : list(c.goals);
  }
  // one KO switch for a whole problem card (its statement, choices and hint)
  const koCard = (p) => (BI && p.enData ? '<button class="ko-btn ko-card" type="button" data-act="ko-card" aria-pressed="false" aria-label="이 문제의 한국어 번역 보기" title="한국어 번역">KO</button>' : '');
  // English key boxes of a chapter paired with the Korean ones of the same section (formula sheet)
  function keyItems(c) {
    if (c._keyItems) return c._keyItems;
    const ko = keyBlocks(c);
    if (!BI || !c.enData) { c._keyItems = ko.map((k) => Object.assign({ koTitle: k.title }, k)); return c._keyItems; }
    const bySec = (list) => { const m = new Map(); list.forEach((k) => { if (!m.has(k.k)) m.set(k.k, []); m.get(k.k).push(k); }); return m; };
    const enKeys = keyBlocks({ sections: c.sections.map((s) => Object.assign({}, s, { body: s.enData ? s.enData.body : s.body, titleKo: undefined })), n: c.n });
    const E = bySec(enKeys);
    const seen = new Map();
    c._keyItems = ko.map((k) => {
      const j = seen.get(k.k) || 0;
      seen.set(k.k, j + 1);
      const s = c.sections.find((x) => x.k === k.k);
      const e = s && s.enData ? (E.get(k.k) || [])[j] : null;
      return e ? { title: e.title, koTitle: k.title, body: e.body, koBody: k.body, k: k.k, sec: k.sec } : Object.assign({ koTitle: k.title }, k);
    });
    return c._keyItems;
  }

  // ---------- progress helpers ----------
  function chStats(c) {
    let right = 0, wrong = 0, partial = 0;
    c.problems.forEach((p) => {
      const r = S.prog[p.id];
      if (!r) return;
      if (r.s === 'right') right++; else if (r.s === 'partial') partial++; else wrong++;
    });
    const total = c.problems.length;
    return { right, wrong, partial, tried: right + wrong + partial, total, pct: total ? Math.round((right / total) * 100) : 0 };
  }
  function overall() {
    let right = 0, tried = 0, score = 0;
    CH.forEach((c) => {
      const s = chStats(c);
      right += s.right; tried += s.tried; score += s.right + 0.5 * s.partial;
    });
    const wrongList = [...PBY.keys()].filter((id) => S.prog[id] && S.prog[id].s !== 'right');
    const done = S.hist.filter((h) => h.items);
    const best = done.length ? Math.max(...done.map((h) => scoreOf(h).pct)) : null;
    return {
      right, tried, pct: PRACTICE_TOTAL ? Math.round((right / PRACTICE_TOTAL) * 100) : 0,
      acc: tried ? Math.round((score / tried) * 100) : null, wrong: wrongList.length, exams: done.length, best,
    };
  }
  function scoreOf(h) {
    const max = h.items.reduce((s, it) => s + it.pts, 0);
    const got = h.items.reduce((s, it) => s + (it.got || 0), 0);
    const pending = h.items.filter((it) => it.got === null).length;
    return { max, got: Math.round(got * 10) / 10, pending, pct: max ? Math.round((got / max) * 100) : 0 };
  }

  // ---------- answer checking ----------
  function checkNum(p, resp) {
    if (resp == null || String(resp).trim() === '') return { ok: false, empty: true };
    try {
      const v = window.EMCalc.parse(resp);
      const a = window.EMCalc.parse(p.ans);
      return { ok: window.EMCalc.same(v, a, p.tol), v, a };
    } catch (e) {
      return { ok: false, err: e.message };
    }
  }

  // ---------- small UI helpers ----------
  const main = $('#main');
  function toast(msg) {
    const root = $('#toast-root');
    root.innerHTML = `<div class="toast" role="status">${esc(msg)}</div>`;
    clearTimeout(toast.t);
    toast.t = setTimeout(() => { const t = root.firstChild; if (!t || reduced) { root.innerHTML = ''; return; } t.classList.add('out'); setTimeout(() => t.remove(), 260); }, 2600);
  }
  let modalOk = null;
  function modal({ title, body, ok = '확인', cancel = '취소', onOk }) {
    modalOk = onOk;
    $('#modal-root').innerHTML = `
      <div class="modal-back" data-act="modal-cancel">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-stop>
          <h3 id="modal-title">${esc(title)}</h3>
          <p>${body}</p>
          <div class="btn-row">
            <button class="btn" data-act="modal-ok" id="modal-ok">${esc(ok)}</button>
            ${cancel ? `<button class="btn ghost" data-act="modal-cancel">${esc(cancel)}</button>` : ''}
          </div>
        </div>
      </div>`;
    const b = $('#modal-ok');
    if (b) b.focus();
  }
  function closeModal() {
    const back = $('#modal-root .modal-back');
    modalOk = null;
    if (!back || reduced) { $('#modal-root').innerHTML = ''; return; }
    back.classList.add('closing');
    back.removeAttribute('data-act');
    setTimeout(() => back.remove(), 170);
  }
  const svgArrow = (dir) => `<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3"><path d="${dir === 'l' ? 'M11 3 5 9l6 6' : 'M7 3l6 6-6 6'}"/></svg>`;
  function fmtTime(sec) {
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }
  function fmtDate(t) {
    const d = new Date(t);
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  const uid = () => Math.random().toString(36).slice(2, 9);
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // ---------- header / drawer ----------
  // thin strip on top of every field page: the hub and the fields of the network
  function netBar() {
    if (!NET) return '';
    const groups = (NET.groups || []).map((g) => Object.assign({}, g, { fields: netFields.filter((f) => f.group === g.id) })).filter((g) => g.fields.length);
    const me = netFields.find((f) => f.id === FIELD);
    const link = (f, inner) => (f.id === FIELD ? `<a aria-current="page">${inner}</a>` : `<a href="${esc(fieldUrl(f))}">${inner}</a>`);
    // narrow screens: the list folds into a menu grouped like the hub
    const menu = `<details class="net-menu"><summary><span>${esc(me ? me.short : '분야')}</span><i aria-hidden="true">▾</i></summary>
      <div class="net-pop">${groups.map((g) => `<div class="net-pop-g"><b>${esc(g.name)}</b>${g.fields.map((f) => link(f, esc(f.short))).join('')}</div>`).join('')}</div></details>`;
    return `<div class="netbar"><div class="wrap netbar-row">
      <a class="net-home" href="${esc(NET_HOME)}" title="Équation 전체 분야">${esc(NET.mark || 'ÉQUATION')}</a>
      <nav class="net-fields" aria-label="분야">${groups.map((g) => `<span class="net-group">${g.fields.map((f) => link(f, netName(f))).join('<i class="net-dot" aria-hidden="true">·</i>')}</span>`).join('')}</nav>
      ${menu}
    </div></div>`;
  }
  const netName = (f) => (f.tiny && f.tiny !== f.short ? `<span class="nf-l">${esc(f.short)}</span><span class="nf-s">${esc(f.tiny)}</span>` : esc(f.short));
  // the centre of the header names this field inside Équation; the only wordmark is ÉQUATION in the bar above
  const ME = netFields.find((f) => f.id === FIELD);
  const HEAD = ME ? { t: ME.short, s: ME.en } : { t: SITE.wordmark || SITE.name || '', s: SITE.sub || '' };
  function renderHeader() {
    document.documentElement.classList.toggle('has-net', !!NET);
    $('#site-header').innerHTML = `${netBar()}
      <div class="wrap header-row">
        <nav class="nav nav-left${3 + NAV_X.length + BOOKS.length + (SIMS.length ? 1 : 0) > 5 ? ' many' : ''}" aria-label="주 메뉴">
          <button class="menu-btn" data-act="menu" aria-label="메뉴 열기"><i></i><i></i><i></i></button>
          <a href="#home" class="ko" data-act="to-catalogue">단원</a>
          <a href="#formulas" class="ko" data-route="formulas">공식집</a>
          <a href="#proofs" class="ko" data-route="proofs">증명</a>
          ${NAV_X.map((n) => `<a href="#${n.route}" class="ko" data-route="${n.route}"${n.title ? ` title="${esc(n.title)}"` : ''}>${esc(n.label)}</a>`).join('')}
          ${BOOKS.map((b) => `<a href="#${b.key}" class="ko" data-route="${b.key}">${esc(b.label)}</a>`).join('')}
          ${SIMS.length ? `<a href="#lab" class="ko" data-route="lab">${esc(LAB_LABEL)}</a>` : ''}
        </nav>
        <a class="wordmark" href="#home" data-route="home" aria-label="${esc(HEAD.t)} 처음으로"><b>${esc(HEAD.t)}</b><span>${esc(HEAD.s)}</span></a>
        <nav class="nav nav-right" aria-label="학습 도구">
          <a href="#exams" class="ko hide-sm" data-route="exams">모의고사</a>
          <a href="#review" class="ko hide-sm" data-route="review">오답노트</a>
          <a href="#home" class="progress-pill" id="pill" data-route="home"></a>
        </nav>
      </div>`;
  }
  function updateHeader() {
    const pill = $('#pill');
    if (!pill) return;
    if (S.live) {
      const left = S.live.minutes * 60 - (Date.now() - S.live.start) / 1000;
      pill.textContent = `시험 중 ${fmtTime(left)}`;
      pill.dataset.route = 'exam-live';
      pill.setAttribute('href', '#exam-live');
      pill.setAttribute('data-timer', '');
    } else {
      const o = overall();
      pill.textContent = `정답 ${o.right}/${PRACTICE_TOTAL}`;
      pill.dataset.route = 'review';
      pill.setAttribute('href', '#review');
      pill.removeAttribute('data-timer');
      pill.title = '연습문제 정답 수 · 오답노트로 이동';
    }
    $$('.nav a[data-route]').forEach((a) => {
      const r = a.dataset.route;
      if (route === r || (r === 'exams' && route.startsWith('result-')) || (r === 'proofs' && route.startsWith('pf-')) || ((BOOK.has(r) || r === 'lab') && route.startsWith(`${r}-`)) || (/^ch\d{2}$/.test(r) && route.startsWith(`${r}-`))) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  function closeDrawer() {
    const d = $('#drawer-root .drawer');
    if (!d || reduced) { $('#drawer-root').innerHTML = ''; return; }
    d.classList.add('closing');
    setTimeout(() => { if (d.isConnected) $('#drawer-root').innerHTML = ''; }, 200);
  }
  function openDrawer() {
    $('#drawer-root').innerHTML = `
      <div class="drawer">
        <nav class="drawer-panel" aria-label="전체 메뉴">
          <button class="linkbtn" data-act="menu-close">닫기</button>
          <h4 class="caps">바로가기</h4>
          <a href="#home" data-route="home">홈</a>
          <a href="#formulas" data-route="formulas">공식집</a>
          <a href="#proofs" data-route="proofs">증명 찾기</a>
          ${NAV_X.map((n) => `<a href="#${n.route}" data-route="${n.route}">${esc(n.label)}</a>`).join('')}
          ${BOOKS.map((b) => `<a href="#${b.key}" data-route="${b.key}">${esc(b.label)}</a>`).join('')}
          ${SIMS.length ? `<a href="#lab" data-route="lab">${esc(LAB_LABEL)}</a>` : ''}
          <a href="#exams" data-route="exams">실전 모의고사</a>
          <a href="#review" data-route="review">오답노트</a>
          ${Object.keys(PARTS).map((k) => `
            <h4 class="caps">Part ${k} · ${PARTS[k].name}</h4>
            ${CH.filter((c) => c.part === k).map((c) => `<a href="#${c.id}" data-route="${c.id}"><span>${pad(c.n)}</span>${esc(c.title)}</a>`).join('')}
          `).join('')}
          ${NET ? `<h4 class="caps">Équation · 분야</h4><a href="${esc(NET_HOME)}"><span>◇</span>전체 분야</a>` : ''}
          ${sisterList().length ? `${NET ? '' : '<h4 class="caps">Collection · 자매 사이트</h4>'}${sisterList().map((s) => `<a class="ext" href="${esc(s.url)}"${s.net ? '' : ' target="_blank" rel="noopener"'}><span>${s.net ? '→' : '↗'}</span>${esc(s.name)}</a>`).join('')}` : ''}
        </nav>
        <button class="drawer-scrim" data-act="menu-close" aria-label="메뉴 닫기"></button>
      </div>`;
  }
  function sisterList() { return Object.keys(SISTERS).map((k) => SISTERS[k]).filter((s) => s && s.url); }
  function sistersBlock() {
    const list = sisterList();
    if (!list.length) return '';
    return `<div class="sisters" aria-label="${NET ? 'Équation의 다른 분야' : '자매 사이트'}">
      <span class="caps">${NET ? `Équation · <a href="${esc(NET_HOME)}">전체 분야 보기</a>` : 'Collection'}</span>
      <div class="sister-row">${list.map((s) => `<a class="sister" href="${esc(s.url)}"${s.net ? '' : ' target="_blank" rel="noopener"'}>
        <b>${esc(s.mark || s.name)}</b><em>${esc(s.name)}</em><span>${esc(s.desc || '')}</span></a>`).join('')}</div>
    </div>`;
  }
  function footer() {
    return `
    <footer class="site-footer">
      <div class="wrap">
        ${sistersBlock()}
        <div class="footer-grid">
          <div>
            <h5 class="caps">${esc(SITE.name || '')}</h5>
            ${BI && SITE.aboutEn ? koPair(`<p>${SITE.aboutEn}</p>`, `<p>${SITE.about || ''}</p>`) : `<p>${SITE.about || ''}</p>`}
          </div>
          <div>
            <h5 class="caps">단답형 입력</h5>
            ${T('inputHelp', '<p>분수 <code>3/2</code>, 원주율 <code>pi</code>, 자연상수 <code>e</code>, 제곱근 <code>sqrt(3)</code>, 로그 <code>ln(2)</code>, 지수 <code>e^(-1)</code>를 쓸 수 있습니다.</p>')}
          </div>
          <div>
            <h5 class="caps">기록</h5>
            <p>풀이 기록과 모의고사 점수는 지금 쓰는 브라우저에만 저장됩니다.</p>
            <p><button class="linkbtn" data-act="reset-all">기록 모두 지우기</button></p>
          </div>
        </div>
        <div class="footer-base caps">
          <span>${esc(SITE.name || '')}</span>
          <span>${CH.length} ${T('unitsWord', 'units')} · ${PRACTICE_TOTAL} exercises · ${PROOFS.length} proofs · ${EXAMS.length} mock exams</span>
        </div>
      </div>
    </footer>`;
  }

  // ---------- problem card ----------
  const ui = new Map();
  const uiOf = (pid) => { if (!ui.has(pid)) ui.set(pid, {}); return ui.get(pid); };
  const CIRC = ['①', '②', '③', '④', '⑤'];

  function statusChip(pid) {
    const r = S.prog[pid];
    if (!r) return '';
    const map = { right: ['st-right', '정답'], wrong: ['st-wrong', '오답'], partial: ['st-partial', '부분 정답'] };
    const [cls, txt] = map[r.s] || map.wrong;
    return `<span class="chip ${cls}">${txt}</span>`;
  }
  function sourceLabel(p) {
    if (p.src === 'practice') { const c = chById.get(p.ch); return `${pad(c.n)} ${c.title}`; }
    const x = examById.get(p.src);
    return x ? `모의고사 ${x.roman} · ${pad(p.no)}번` : '';
  }
  function solutionHTML(p) {
    return `<div class="solution"><div class="blk-label">Solution<em>풀이</em></div>${mdOf(p, 'sol')}</div>`;
  }
  function answerTex(p) {
    if (p.type === 'mc') return `${CIRC[p.ans]} ${choiceOf(p, p.ans)}`;
    if (p.type === 'num') return p.ansTex ? tex(p.ansTex, false) : `<code>${esc(p.ans)}</code>`;
    return '';
  }

  // “퀴즈형” chip on a practice problem: links to the quiz problem it imitates
  function quizChip(p) {
    if (!p.quiz) return '';
    const x = typeof p.quiz === 'string' && QZP.get(p.quiz);
    return x ? `<a class="chip quizc" href="#quiz-${p.quiz}" data-route="quiz-${p.quiz}" title="${esc(x.p.title)}">퀴즈형 · ${esc(x.q.short || x.q.title)} ${esc(x.p.label || x.p.id)} →</a>`
      : `<span class="chip quizc">퀴즈형</span>`;
  }
  // practice problems of one quiz problem's kind, grouped by unit (or every quiz-style problem when id is empty)
  function quizPractice(id) {
    return CH.map((c) => ({ c, n: c.problems.filter((p) => (id ? p.quiz === id : p.quiz)).length })).filter((x) => x.n);
  }
  const quizPracticeLink = (c, n, label) => `<a class="pf-chip" href="#${c.id}-practice" data-act="quiz-practice" data-ch="${c.id}">${label || `${pad(c.n)}단원`} · ${n}문제 →</a>`;
  function probHTML(p, o) {
    const ctx = o.ctx;
    if (ctx === 'exam') return examProbHTML(p, o);
    if (ctx === 'result') return resultProbHTML(p, o);
    const u = uiOf(p.id);
    const no = o.label || pad(p.no);
    const SC = (chById.get(p.ch) || {}).secChip || T('secChip', '§'); // a unit outside the textbook (e.g. lecture slides) names its own source
    const tags = `<div class="prob-tags"><span class="chip">${TYPE[p.type]}</span><span class="chip lv">${LV[p.lv]}</span>${p.sec ? (chById.get(p.ch) && chById.get(p.ch).sections.some((s) => s.k === p.sec)
      ? `<a class="chip sec" href="#${p.ch}-k${p.sec}" data-route="${p.ch}-k${p.sec}" title="이 절의 개념 정리로 이동">${SC}${esc(p.sec)} →</a>`
      : `<span class="chip sec">${SC}${esc(p.sec)}</span>`) : ''}${p.proof ? `<span class="chip pfc">증명형</span>` : ''}${quizChip(p)}${o.source ? `<span class="chip">${esc(sourceLabel(p))}</span>` : ''}${statusChip(p.id)}${koCard(p)}</div>`;
    let body = '';
    if (p.type === 'mc') {
      body = `<div class="choices" role="group" aria-label="보기">${p.choices.map((c, k) => {
        let cls = '';
        if (u.done) { if (k === p.ans) cls = 'is-right'; else if (k === u.pick) cls = 'is-wrong'; }
        return `<button class="choice ${cls}" data-act="mc-pick" data-pid="${p.id}" data-i="${k}" aria-pressed="${u.pick === k}" ${u.done ? 'disabled' : ''}><span class="letter">${k + 1}</span><span class="ctext">${choiceOf(p, k)}</span></button>`;
      }).join('')}</div>`;
    } else if (p.type === 'num') {
      body = `<div class="answer-row">
          <label class="sr-only" for="in-${p.id}">답 입력</label>
          <input id="in-${p.id}" data-pid="${p.id}" data-role="num" autocomplete="off" spellcheck="false" inputmode="text"
            placeholder="답 입력 (예: 3/2, 2*pi, e^2)" value="${esc(u.input || '')}" ${u.done ? 'readonly' : ''}>
          ${u.done ? '' : `<button class="btn" data-act="check" data-pid="${p.id}">채점</button>`}
        </div>
        <div class="preview" id="pv-${p.id}" aria-live="polite">${u.done ? '' : previewText(p, u.input)}</div>`;
    } else {
      body = `<label class="sr-only" for="ta-${p.id}">풀이 메모</label>
        <textarea class="scratch" id="ta-${p.id}" data-pid="${p.id}" data-role="scratch" placeholder="풀이 과정이나 최종 답을 적어 두세요 (선택). 종이에 풀어도 됩니다.">${esc(u.input || '')}</textarea>`;
    }
    let actions = '';
    if (!u.done) {
      actions = `<div class="btn-row">
        ${p.type === 'mc' ? `<button class="btn" data-act="check" data-pid="${p.id}">정답 확인</button>` : ''}
        ${p.type === 'open' ? `<button class="btn" data-act="reveal" data-pid="${p.id}">모범 풀이 보기</button>` : ''}
        ${p.hint ? `<button class="linkbtn" data-act="hint" data-pid="${p.id}" aria-expanded="${!!u.hint}">${u.hint ? '힌트 닫기' : '힌트'}</button>` : ''}
      </div>`;
    }
    const hint = !u.done && u.hint ? `<p class="hint"><b>힌트</b> ${ilOf(p, 'hint')}</p>` : '';
    let fb = '';
    if (u.done) {
      if (p.type === 'mc') {
        fb = u.ok
          ? `<div class="feedback ok"><b>정답입니다.</b></div>`
          : `<div class="feedback bad"><b>오답입니다.</b><span>정답은 ${answerTex(p)}</span></div>`;
      } else if (p.type === 'num') {
        const mine = u.v ? window.EMCalc.fmt(u.v) : '';
        fb = u.ok
          ? `<div class="feedback ok"><b>정답입니다.</b><span>입력한 값 ${esc(mine)} · 정답 ${answerTex(p)}</span></div>`
          : `<div class="feedback bad"><b>오답입니다.</b><span>입력한 값 ${esc(mine)} · 정답 ${answerTex(p)}${p.ans ? ` (≈ ${esc(window.EMCalc.fmt(window.EMCalc.parse(p.ans)))})` : ''}</span></div>`;
      } else {
        const r = S.prog[p.id];
        const s = u.self || (r && r.s);
        fb = `<div class="selfgrade" role="group" aria-label="자가 채점"><span>모범 풀이와 비교해 스스로 채점하세요</span>
          ${[['right', '맞았어요'], ['partial', '일부 맞았어요'], ['wrong', '틀렸어요']].map(([k, t]) => `<button data-act="self" data-pid="${p.id}" data-s="${k}" aria-pressed="${s === k && !!u.self}">${t}</button>`).join('')}
        </div>`;
      }
      fb += solutionHTML(p) + `<div class="btn-row"><button class="linkbtn" data-act="retry" data-pid="${p.id}">다시 풀기</button></div>`;
    }
    return `<article class="prob" id="p-${p.id}" data-pid="${p.id}">
      <div class="prob-no">${no}<small>${o.sub || LV[p.lv]}</small></div>
      <div class="prob-main">${tags}<div class="prob-q">${mdOf(p, 'q', { chips: false })}</div>${body}${actions}${hint}${fb}</div>
    </article>`;
  }
  function previewText(p, v) {
    if (!v || !String(v).trim()) return '';
    try { return `= ${window.EMCalc.fmt(window.EMCalc.parse(v))}`; } catch (e) { return ''; }
  }
  function rerenderCard(pid, o) {
    const el = document.getElementById('p-' + pid);
    if (!el) return;
    const p = PBY.get(pid);
    const opts = o || JSON.parse(el.dataset.opts || '{}');
    const tmp = document.createElement('div');
    tmp.innerHTML = probHTML(p, Object.assign({ ctx: 'practice' }, opts));
    const next = tmp.firstElementChild;
    next.dataset.opts = el.dataset.opts || '{}';
    const wasDone = !!el.querySelector('.feedback, .solution');
    el.replaceWith(next);
    // the verdict arrives with a small motion: a nod for right, a shake for wrong, a fade for an opened solution
    const u = ui.get(pid);
    if (!reduced && u && u.done && !wasDone) {
      const fb = next.querySelector('.feedback, .solution');
      if (fb) fb.classList.add('reveal');
      if (p.type !== 'open' && u.ok != null) next.classList.add(u.ok ? 'pop-ok' : 'pop-bad');
    }
    updateTally();
    updateHeader();
  }
  function withOpts(html, o) {
    // stash render options on the card so re-rendering keeps its label
    return html.replace('<article class="prob"', `<article data-opts='${esc(JSON.stringify(o))}' class="prob"`);
  }

  // exam-mode card: capture answers only
  function examProbHTML(p, o) {
    const L = S.live;
    const a = L.answers[p.id];
    let body = '';
    if (p.type === 'mc') {
      body = `<div class="choices" role="group" aria-label="보기">${p.choices.map((c, k) =>
        `<button class="choice" data-act="ex-pick" data-pid="${p.id}" data-i="${k}" aria-pressed="${a === k}"><span class="letter">${k + 1}</span><span class="ctext">${choiceOf(p, k)}</span></button>`).join('')}</div>`;
    } else if (p.type === 'num') {
      body = `<div class="answer-row"><label class="sr-only" for="ex-${p.id}">답 입력</label>
        <input id="ex-${p.id}" data-pid="${p.id}" data-role="ex-num" autocomplete="off" spellcheck="false" placeholder="답 입력 (예: 3/2, 2*pi, e^2)" value="${esc(a ?? '')}"></div>
        <div class="preview" id="pv-${p.id}">${previewText(p, a)}</div>`;
    } else {
      body = `<label class="sr-only" for="ex-${p.id}">풀이</label><textarea class="scratch" id="ex-${p.id}" data-pid="${p.id}" data-role="ex-open" placeholder="풀이와 답을 적으세요. 제출 후 모범 풀이와 비교해 직접 채점합니다.">${esc(a ?? '')}</textarea>`;
    }
    return `<article class="prob" id="q-${o.k + 1}" data-pid="${p.id}">
      <div class="prob-no">${o.k + 1}<small class="pts">${L.pts[p.id]}점</small></div>
      <div class="prob-main"><div class="prob-tags"><span class="chip">${TYPE[p.type]}</span><span class="chip">${esc(chById.get(p.ch) ? chById.get(p.ch).title : '')}</span>${koCard(p)}</div>
      <div class="prob-q">${mdOf(p, 'q', { chips: false })}</div>${body}</div>
    </article>`;
  }

  // result-mode card
  function resultProbHTML(p, o) {
    const it = o.item;
    const h = o.h;
    let body = '';
    let verdict = '';
    if (p.type === 'mc') {
      body = `<div class="choices">${p.choices.map((c, k) => {
        let cls = '';
        if (k === p.ans) cls = 'is-right'; else if (k === it.resp) cls = 'is-wrong';
        return `<button class="choice ${cls}" disabled aria-pressed="${it.resp === k}"><span class="letter">${k + 1}</span><span class="ctext">${choiceOf(p, k)}</span></button>`;
      }).join('')}</div>`;
      verdict = it.resp == null ? `<div class="feedback bad"><b>미응답</b><span>정답 ${answerTex(p)}</span></div>`
        : it.got ? `<div class="feedback ok"><b>정답</b></div>` : `<div class="feedback bad"><b>오답</b><span>정답 ${answerTex(p)}</span></div>`;
    } else if (p.type === 'num') {
      const r = checkNum(p, it.resp);
      const mine = it.resp == null || it.resp === '' ? '미응답' : `${esc(it.resp)}${r.v ? ` (= ${esc(window.EMCalc.fmt(r.v))})` : ''}`;
      verdict = `<div class="feedback ${it.got ? 'ok' : 'bad'}"><b>${it.got ? '정답' : '오답'}</b><span>내 답 ${mine} · 정답 ${answerTex(p)}</span></div>`;
    } else {
      const f = it.got === null ? null : it.got / it.pts;
      body = it.resp ? `<div class="solution" style="background:var(--paper-3);border:1px solid var(--rule)"><div class="blk-label">My answer<em>내 풀이</em></div><p style="white-space:pre-wrap">${esc(it.resp)}</p></div>` : `<p class="muted">작성한 풀이가 없습니다. 종이에 푼 풀이와 비교해 채점하세요.</p>`;
      verdict = `<div class="selfgrade" role="group" aria-label="서술형 자가 채점"><span>${f === null ? '채점 대기 —' : '채점 완료 —'} 모범 풀이와 채점 기준을 보고 점수를 고르세요</span>
        ${[[0, '0점'], [0.5, `부분 ${it.pts / 2}점`], [1, `만점 ${it.pts}점`]].map(([v, t]) => `<button data-act="res-grade" data-hid="${h.hid}" data-pid="${p.id}" data-f="${v}" aria-pressed="${f === v}">${t}</button>`).join('')}
      </div>`;
    }
    const rubric = p.rubric ? `<div class="blk blk-thm"><div class="blk-label">Rubric<em>채점 기준</em></div>${mdOf(p, 'rubric')}</div>` : '';
    const got = it.got === null ? '—' : it.got;
    return `<article class="prob" id="r-${p.id}">
      <div class="prob-no">${o.k + 1}<small class="pts">${got} / ${it.pts}점</small></div>
      <div class="prob-main"><div class="prob-tags"><span class="chip">${TYPE[p.type]}</span><span class="chip">${esc(chById.get(p.ch) ? chById.get(p.ch).title : '')}</span>${koCard(p)}</div>
      <div class="prob-q">${mdOf(p, 'q', { chips: false })}</div>${body}${verdict}
      <details class="sol" ${p.type === 'open' || !it.got ? 'open' : ''}><summary>풀이 보기</summary><div>${solutionHTML(p)}${rubric}</div></details></div>
    </article>`;
  }

  // ---------- views ----------
  let heroIdx = Math.max(0, CH.findIndex((c) => c.id === S.prefs.lastCh));
  function heroSlide(c) {
    return `
      <span class="caps hero-eyebrow">Part ${c.part} — ${esc(PARTS[c.part].name)}</span>
      <div class="hero-num num-display" aria-hidden="true">${pad(c.n)}</div>
      <div class="hero-en">${esc(c.en)}</div>
      <h1 class="hero-ko">${esc(c.title)}</h1>
      <p class="hero-sum">${ilOf(c, 'tagline')}</p>
      <div class="hero-actions">
        <a class="link-u ko" href="#${c.id}" data-route="${c.id}">개념 정리 보기</a>
        <a class="link-u ko" href="#${c.id}-practice" data-route="${c.id}-practice">연습문제 ${c.problems.length}</a>
      </div>`;
  }
  function viewHome() {
    const c = CH[heroIdx];
    const o = overall();
    const firstOfPart = {};
    CH.forEach((x, k) => { if (!(x.part in firstOfPart)) firstOfPart[x.part] = k; });
    return `
    <section class="hero" id="hero" aria-roledescription="carousel" aria-label="단원 둘러보기">
      <canvas data-plot="${c.plot}" aria-hidden="true"></canvas>
      <div class="hero-inner" id="hero-inner">${heroSlide(c)}</div>
      <button class="hero-arrow prev" data-act="hero-prev" aria-label="이전 단원">${svgArrow('l')}</button>
      <button class="hero-arrow next" data-act="hero-next" aria-label="다음 단원">${svgArrow('r')}</button>
      <div class="timeline"><div class="timeline-track">
        ${CH.map((x, k) => `<button class="tl-item" data-act="hero-to" data-i="${k}" aria-current="${k === heroIdx}" aria-label="${x.n}단원 ${esc(x.title)}">${firstOfPart[x.part] === k ? `<span class="tl-part">Part ${x.part}</span>` : ''}<span class="tl-n">${pad(x.n)}</span></button>`).join('')}
      </div></div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head"><div><span class="caps">How to study</span><h2>${proseH('howTitle', '읽고, 풀고, 시험처럼 점검하기')}</h2></div>
          ${proseP('howLede', '한 단원은 개념 정리 → 연습문제 → 모의고사 순서로 공부하도록 짜여 있습니다. 틀린 문제는 오답노트에 자동으로 모입니다.', 'lede')}</div>
        <div class="modes">
          <div class="mode"><div class="step"><b>1</b><span class="caps">Learn</span></div><h3>개념 정리</h3>
            ${proseP('howLearn', `정의와 풀이법을 시험에 나오는 형태로 정리했습니다. 핵심 공식 상자마다 증명이 연결되어 있고, 증명 ${PROOFS.length}개는 따로 검색할 수 있습니다.`, '', (s) => s.replace('{proofs}', PROOFS.length))}
            <div class="btn-row" style="gap:22px"><a class="link-u ko" href="#${CH[0].id}" data-route="${CH[0].id}">1단원부터 읽기</a><a class="link-u ko" href="#proofs" data-route="proofs">증명 찾기</a></div></div>
          <div class="mode"><div class="step"><b>2</b><span class="caps">Practice</span></div><h3>연습문제</h3>
            ${proseP('howPractice', '객관식·단답형은 바로 채점되고, 서술형은 모범 풀이와 비교해 스스로 채점합니다.')}
            <a class="link-u ko" href="#${CH[0].id}-practice" data-route="${CH[0].id}-practice">연습문제 풀기</a></div>
          <div class="mode"><div class="step"><b>3</b><span class="caps">Examine</span></div><h3>실전 모의고사</h3>
            ${proseP('howExam', `시간 제한이 있는 모의고사 {exams}회와, 고른 단원에서 문제를 뽑아 만드는 맞춤 모의고사로 실전 감각을 점검합니다.`, '', (s) => s.replace('{exams}', EXAMS.length))}
            <a class="link-u ko" href="#exams" data-route="exams">모의고사 보기</a></div>
        </div>
      </div>
    </section>

    <section class="section tight">
      <div class="wrap">
        <div class="stats" aria-label="나의 학습 현황">
          <div class="stat"><span class="caps">Solved</span><b>${o.right}<span style="font-size:.45em;color:var(--ink-3)"> / ${PRACTICE_TOTAL}</span></b><small>연습문제 정답</small></div>
          <div class="stat"><span class="caps">Accuracy</span><b>${o.acc === null ? '—' : o.acc + '%'}</b><small>${o.tried ? `${o.tried}문제 시도` : '아직 푼 문제가 없습니다'}</small></div>
          <div class="stat"><span class="caps">Mock exams</span><b>${o.exams}</b><small>${o.best === null ? '응시 기록 없음' : `최고 ${o.best}점`}</small></div>
          <div class="stat"><span class="caps">Review</span><b>${o.wrong}</b><small><a href="#review" data-route="review">오답노트 열기</a></small></div>
        </div>
      </div>
    </section>

    <section class="section" id="catalogue">
      <div class="wrap">
        <div class="section-head"><div><span class="caps">${T('unitsCaps', 'The units')}</span><h2>${CH.length}개 단원</h2></div>
          ${proseP('catLede', '그림은 각 단원을 대표하는 곡선입니다.', 'lede')}</div>
        ${Object.keys(PARTS).map((k) => `
          <div class="part-block">
            <div class="part-head"><span class="part-letter">${k}</span><h3>${esc(PARTS[k].name)}${PARTS[k].nameKo ? koT(PARTS[k].nameKo) : ''}</h3>${PARTS[k].descKo ? koPair(`<p>${esc(PARTS[k].desc)}</p>`, `<p>${esc(PARTS[k].descKo)}</p>`) : `<p>${esc(PARTS[k].desc)}</p>`}</div>
            <div class="tiles">${CH.filter((x) => x.part === k).map(tileHTML).join('')}</div>
          </div>`).join('')}
      </div>
    </section>

    <section class="band section">
      <div class="wrap">
        <div class="section-head"><div><span class="caps">Mock examinations</span><h2>실전 모의고사</h2></div>
          ${proseP('examLede', '시험 범위에 맞춘 시간 제한 시험입니다. 제출하면 자동 채점과 단원별 분석을 보여줍니다.', 'lede')}</div>
        <div class="exam-rows">
          ${EXAMS.map((x) => `<button class="exam-row" data-act="exam-start" data-exam="${x.id}">
              <span class="roman">${x.roman}</span>
              <span class="exam-row-text"><span class="t">${esc(x.title)}</span><small>${esc(x.scopeText)}</small></span>
              <span class="meta">${x.minutes} min · ${x.problems.length} Q${bestOf(x.id) !== null ? ` · best ${bestOf(x.id)}` : ''}</span>
              <span class="go" aria-hidden="true">→</span>
            </button>`).join('')}
        </div>
        <div class="btn-row" style="margin-top:32px"><a class="btn" href="#exams" data-route="exams">맞춤 모의고사 만들기</a></div>
      </div>
    </section>
    ${footer()}`;
  }
  function tileHTML(c) {
    const s = chStats(c);
    return `<a class="tile" href="#${c.id}" data-route="${c.id}">
      <div class="tile-img"><canvas data-plot="${c.plot}" aria-hidden="true"></canvas>
        <span class="tile-tag caps">${esc(c.ref)}</span>
        ${s.pct === 100 ? '<span class="tile-done">Complete</span>' : ''}
        <span class="tile-num">${pad(c.n)}</span></div>
      <div class="tile-meta">
        <span class="caps">${esc(c.en)}</span>
        <h4>${esc(c.title)}</h4>
        <div class="row"><span>개념 ${c.sections.length} · 문제 ${c.problems.length}</span><span class="tabular">${s.right}/${s.total}</span></div>
        <div class="bar" aria-hidden="true"><i style="width:${s.pct}%"></i></div>
      </div>
    </a>`;
  }
  function bestOf(examId) {
    const list = S.hist.filter((h) => h.exam === examId);
    return list.length ? Math.max(...list.map((h) => scoreOf(h).got)) : null;
  }

  let filters = Object.assign({ lv: 'all', type: 'all', st: 'all', sec: 'all', kind: 'all' }, S.prefs.filters || {});
  function viewChapter(c, tab) {
    CUR_CH = c.id;
    S.prefs.lastCh = c.id;
    save();
    const s = chStats(c);
    const i = CH.indexOf(c);
    const prev = CH[i - 1], next = CH[i + 1];
    let body = '';
    if (tab === 'learn') {
      body = `<div class="ch-body">
        <nav class="toc" aria-label="단원 목차"><span class="caps">Contents</span>
          ${c.sections.map((sec, k) => `<a href="#${sec.k ? `${c.id}-k${sec.k}` : c.id}" data-act="scroll" data-target="sec-${sec.k || k + 1}"><span>${sec.label ? `${/^\d/.test(sec.label) ? '§' : ''}${sec.label.split("–")[0]}` : sec.k ? `§${sec.k}` : `${c.n}.${k + 1}`}</span>${esc(sec.title)}</a>`).join('')}
          ${XLINKS.some((l) => (l.from === c.id) !== (l.to === c.id)) ? `<a href="#${c.id}" data-act="scroll" data-target="sec-links"><span>↔</span>다른 단원과의 연결</a>` : ''}
        </nav>
        <article class="prose">
          ${c.sections.map((sec, k) => sectionHTML(c, sec, k + 1)).join('')}
          ${connectionMap(c)}
          <div class="sec"><div class="btn-row"><a class="btn" href="#${c.id}-practice" data-route="${c.id}-practice">연습문제 ${c.problems.length}개 풀기</a><a class="btn ghost" href="#${c.id}-formulas" data-route="${c.id}-formulas">핵심 공식만 보기</a></div></div>
        </article>
      </div>`;
    } else if (tab === 'practice') {
      body = practiceBody(c);
    } else if (tab === 'formulas') {
      const keys = keyItems(c);
      body = `<div class="section tight" style="padding-top:40px"><div class="sheet">${keys.map((k) => `
        <div class="sheet-item"><span class="caps">${esc(k.sec)}</span><h4>${inline(k.title)}${k.koTitle !== k.title ? koT(k.koTitle) : ''}</h4><div class="body">${k.koBody ? bimd(k.body, k.koBody) : md(k.body)}</div>${proofLinks(k.koTitle, c.id)}</div>`).join('')}</div></div>`;
    } else if (tab === 'proofs') {
      const list = PROOFS.filter((p) => p.ch === c.id);
      body = `<div class="section tight" style="padding-top:40px">
        <p class="lede" style="margin-bottom:24px">이 단원의 공식과 정리 ${list.length}개의 증명입니다. 다른 단원까지 검색하려면 <a href="#proofs" data-route="proofs">증명 찾기</a>를 쓰세요.</p>
        <div class="pf-list">${list.map(proofCard).join('')}</div></div>`;
    }
    return `
    <section class="ch-hero">
      <div class="ch-plate"><canvas data-plot="${c.plot}" aria-hidden="true"></canvas><span class="plate-num" aria-hidden="true">${pad(c.n)}</span><span class="plate-cap caps">Fig. ${ilOf(c, 'fig')}</span></div>
      <div class="ch-intro">
        <span class="caps">${T('unitCaps', 'Unit')} ${pad(c.n)} · Part ${c.part} ${esc(PARTS[c.part].name)}</span>
        <h1>${esc(c.title)}</h1>
        <span class="en${c.titleKo ? ' ko-sub' : ''}"${c.titleKo ? ' lang="ko"' : ''}>${esc(c.en)}</span>
        ${paraOf(c, 'summary')}
        ${goalsOf(c)}
        <div class="ch-meta"><span>${c.refLabel || T('refLabel', '교재')} <b>${esc(c.ref)}</b></span><span>개념 <b>${c.sections.length}</b></span><span>연습문제 <b>${c.problems.length}</b></span><span>정답 <b class="tabular" data-ch-right>${s.right}/${s.total}</b></span></div>
      </div>
    </section>
    <div class="tabs-bar" id="tabs"><div class="wrap"><div class="tabs" role="tablist" aria-label="단원 보기 방식">
      <a class="tab" role="tab" href="#${c.id}" data-route="${c.id}" data-keep aria-selected="${tab === 'learn'}">개념 정리</a>
      <a class="tab" role="tab" href="#${c.id}-practice" data-route="${c.id}-practice" data-keep aria-selected="${tab === 'practice'}">연습문제<sup>${c.problems.length}</sup></a>
      <a class="tab" role="tab" href="#${c.id}-formulas" data-route="${c.id}-formulas" data-keep aria-selected="${tab === 'formulas'}">핵심 공식</a>
      <a class="tab" role="tab" href="#${c.id}-proofs" data-route="${c.id}-proofs" data-keep aria-selected="${tab === 'proofs'}">증명<sup>${PROOFS.filter((p) => p.ch === c.id).length}</sup></a>
    </div></div></div>
    <div class="wrap">${body}</div>
    <nav class="ch-next" aria-label="단원 이동">
      ${prev ? `<a href="#${prev.id}" data-route="${prev.id}"><span class="caps">← 이전 단원</span><b>${pad(prev.n)}</b><span>${esc(prev.title)}</span></a>` : '<span></span>'}
      ${next ? `<a href="#${next.id}" data-route="${next.id}"><span class="caps">다음 단원 →</span><b>${pad(next.n)}</b><span>${esc(next.title)}</span></a>` : `<a href="#exams" data-route="exams"><span class="caps">마지막 단원 →</span><b>Exam</b><span>실전 모의고사로 점검하기</span></a>`}
    </nav>
    ${footer()}`;
  }
  const secSort = (a, b) => { const [a1, a2] = a.split('.').map(Number); const [b1, b2] = b.split('.').map(Number); return a1 - b1 || a2 - b2; };
  function chapterSecs(c) {
    return [...new Set(c.problems.map((p) => p.sec).filter(Boolean))].sort(secSort);
  }
  function filtered(list, secs) {
    const sec = secs && secs.includes(filters.sec) ? filters.sec : 'all';
    const quizOnly = filters.kind === 'quiz' && list.some((p) => p.quiz);
    return list.filter((p) => {
      if (sec !== 'all' && p.sec !== sec) return false;
      if (quizOnly && !p.quiz) return false;
      if (filters.lv !== 'all' && String(p.lv) !== filters.lv) return false;
      if (filters.type !== 'all' && p.type !== filters.type) return false;
      const r = S.prog[p.id];
      if (filters.st === 'todo' && r) return false;
      if (filters.st === 'wrong' && !(r && r.s !== 'right')) return false;
      return true;
    });
  }
  function seg(key, opts) {
    return `<div class="seg" role="group">${opts.map(([v, t]) => `<button data-act="filter" data-k="${key}" data-v="${v}" aria-pressed="${filters[key] === v}">${t}</button>`).join('')}</div>`;
  }
  function tallyText(c) {
    const s = chStats(c);
    return `<b>${s.total}</b>문제 중 정답 <b>${s.right}</b> · 오답 <b>${s.wrong}</b>${s.partial ? ` · 부분 <b>${s.partial}</b>` : ''} · 남은 문제 <b>${s.total - s.tried}</b>`;
  }
  function practiceBody(c) {
    // “퀴즈형만” belongs to the unit where it was turned on; another unit starts with every problem
    if (filters.kind === 'quiz' && filters.kindCh !== c.id) { filters.kind = 'all'; S.prefs.filters = filters; save(); }
    const secs = chapterSecs(c);
    const curSec = secs.includes(filters.sec) ? filters.sec : 'all';
    const list = filtered(c.problems, secs);
    const pool = filtered(c.problems, []); // every filter except the section one: what the section chips count
    const active = [filters.lv !== 'all' && `난이도 ${LV[+filters.lv]}`, filters.type !== 'all' && TYPE[filters.type],
      filters.st !== 'all' && (filters.st === 'todo' ? '안 푼 문제' : '틀린 문제'), filters.kind === 'quiz' && c.problems.some((p) => p.quiz) && '퀴즈형만',
      curSec !== 'all' && `§${curSec}`].filter(Boolean);
    const titles = c.secTitles || {};
    return `
      <div class="practice-head">
        <div style="display:grid;gap:6px"><span class="caps" style="color:var(--camel-ink)">Exercises</span>
          <p class="tally" data-tally="${c.id}">${tallyText(c)}</p></div>
        <div class="filters">
          ${seg('lv', [['all', '전체'], ['1', '기초'], ['2', '표준'], ['3', '심화']])}
          ${seg('type', [['all', '모든 유형'], ['mc', '객관식'], ['num', '단답형'], ['open', '서술형']])}
          ${seg('st', [['all', '전체'], ['todo', '안 푼 문제'], ['wrong', '틀린 문제']])}
          ${c.problems.some((p) => p.quiz) ? seg('kind', [['all', '모든 문제'], ['quiz', `퀴즈형 ${c.problems.filter((p) => p.quiz).length}`]]) : ''}
        </div>
      </div>
      ${secs.length ? `<div class="sec-filter" role="group" aria-label="절로 거르기">
        <span class="caps">${c.secFilter || T('secFilter', '절')}</span>
        <button class="pf-chip" data-act="filter" data-k="sec" data-v="all" aria-pressed="${curSec === 'all'}">전체 ${pool.length}</button>
        ${secs.map((s) => `<button class="pf-chip" data-act="filter" data-k="sec" data-v="${s}" aria-pressed="${curSec === s}">${s}${titles[s] ? ` ${esc(titles[s])}` : ''} <span class="n">${pool.filter((p) => p.sec === s).length}</span></button>`).join('')}
      </div>` : ''}
      <div class="problems">
        ${list.length ? list.map((p) => withOpts(probHTML(p, { ctx: 'practice' }), {})).join('')
          : `<div class="empty"><b>Voilà</b><p>조건에 맞는 문제가 없습니다.${active.length ? ` 지금 켜진 필터: <strong style="font-weight:600;color:var(--ink)">${active.map(esc).join(' · ')}</strong>` : ''}</p>
            <div class="btn-row" style="justify-content:center"><button class="btn" data-act="filter-reset">필터 모두 풀고 ${c.problems.length}문제 보기</button></div></div>`}
      </div>`;
  }
  function updateTally() {
    $$('[data-tally]').forEach((el) => { const c = chById.get(el.dataset.tally); if (c) el.innerHTML = tallyText(c); });
    $$('[data-ch-right]').forEach((el) => { const c = chById.get(route.slice(0, 4)); if (c) { const s = chStats(c); el.textContent = `${s.right}/${s.total}`; } });
  }

  // ---------- proofs ----------
  function proofSearchText(p) {
    const c = chById.get(p.ch);
    return normText([p.title, p.tags, p.stmt, p.src || '', (p.keys || []).join(' '), c.title, c.en, `${c.n}단원`].join(' '));
  }
  function proofCard(p) {
    const c = chById.get(p.ch);
    return `<a class="pf-item" href="#pf-${p.pid}" data-route="pf-${p.pid}" data-pf-ch="${p.ch}" data-pf-hand="${p.src ? 1 : 0}" data-pf-text="${esc(proofSearchText(p))}">
      <span class="pf-ch"><b>${pad(c.n)}</b>${esc(c.title)}${p.src ? `<span class="chip hand">${esc(p.src)}</span>` : ''}</span>
      <span class="pf-title">${inline(p.title)}${p.sketch ? ' <span class="chip">개요</span>' : ''}</span>
      <span class="pf-stmt">${md(BI && p.enData && p.enData.stmt ? p.enData.stmt : p.stmt)}</span>
    </a>`;
  }
  let pfFilter = { q: S.prefs.pfq || '', ch: 'all' };
  function viewProofs() {
    return `
    <div class="wrap">
      <header class="page-head"><span class="caps">Proofs</span><h1>Démonstrations<span class="ko">증명 찾기</span></h1>
        ${proseP('proofLede', `단원에 나오는 공식과 정리 ${PROOFS.length}개의 증명을 모았습니다. 공식 이름, 사람 이름, 영어 용어로 검색할 수 있습니다.`, 'lede', (s) => s.replace('{proofs}', PROOFS.length))}
        <div class="pf-search">
          <label class="sr-only" for="pf-q">증명 검색</label>
          <input id="pf-q" type="search" autocomplete="off" spellcheck="false" placeholder="${esc(T('proofPlaceholder', '찾을 공식이나 정리'))}" value="${esc(pfFilter.q)}">
          <span class="pf-count" id="pf-count" aria-live="polite"></span>
        </div>
        <div class="jump" role="group" aria-label="단원으로 거르기">
          ${PROOFS.some((p) => p.src) ? `<button class="pf-chip hand-chip" data-act="pf-hand" aria-pressed="${!!pfFilter.hand}">${esc(T('handChip', '강의 필기'))} ${PROOFS.filter((p) => p.src).length}</button>` : ''}
          <button class="pf-chip" data-act="pf-ch" data-ch="all" aria-pressed="${pfFilter.ch === 'all'}">전체</button>
          ${CH.map((c) => `<button class="pf-chip" data-act="pf-ch" data-ch="${c.id}" aria-pressed="${pfFilter.ch === c.id}">${pad(c.n)} ${esc(c.title)}</button>`).join('')}
        </div>
      </header>
      <section class="section tight">
        <div class="pf-list" id="pf-list">${PROOFS.map(proofCard).join('')}</div>
        <div class="empty" id="pf-empty" hidden><b>Rien</b><p>찾는 증명이 없습니다. 다른 이름이나 영어 용어로 검색해 보세요.</p></div>
      </section>
    </div>
    ${footer()}`;
  }
  function filterProofs() {
    const list = $('#pf-list');
    if (!list) return;
    const terms = pfFilter.q.split(/\s+/).map(normText).filter(Boolean);
    let shown = 0;
    $$('.pf-item', list).forEach((el) => {
      const ok = (pfFilter.ch === 'all' || el.dataset.pfCh === pfFilter.ch) && (!pfFilter.hand || el.dataset.pfHand === '1') && terms.every((t) => el.dataset.pfText.includes(t));
      el.hidden = !ok;
      if (ok) shown++;
    });
    $('#pf-count').textContent = `${shown}개`;
    $('#pf-empty').hidden = shown > 0;
  }
  function viewProof(p) {
    const c = chById.get(p.ch);
    const same = PROOFS.filter((x) => x.ch === p.ch);
    const i = same.indexOf(p);
    const prev = same[i - 1], next = same[i + 1];
    return `
    <div class="wrap">
      <nav class="pf-crumb caps" aria-label="위치"><a href="#proofs" data-route="proofs">증명 찾기</a><span>/</span><a href="#${c.id}-proofs" data-route="${c.id}-proofs">${pad(c.n)} ${esc(c.title)}</a></nav>
      <article class="pf-page">
        <header class="pf-head">
          <span class="num-display pf-num">${pad(c.n)}.${i + 1}</span>
          <h1>${inline(p.title)}${koT(p.titleKo)}</h1>
          ${p.src ? `<p class="pf-src"><span class="chip hand">${esc(p.src)}</span>${p.srcNote ? `<span>${inline(p.srcNote)}</span>` : ''}</p>` : ''}
        </header>
        <div class="blk blk-key"><div class="blk-label">Statement<em>명제</em></div>${mdOf(p, 'stmt')}</div>
        <div class="prose pf-body">
          <div class="blk-label pf-label">Proof<em>증명</em></div>
          ${p.sketch ? `<p class="pf-sketch">${inline(p.sketch === true ? '엄밀한 증명은 길어 핵심 아이디어만 보입니다.' : p.sketch)}</p>` : ''}
          ${mdOf(p, 'body')}
          <p class="qed" aria-label="증명 끝">∎</p>
        </div>
        ${p.note ? `<div class="blk blk-note"><div class="blk-label">Remark<em>덧붙임</em></div>${mdOf(p, 'note')}</div>` : ''}
        ${(p.keys || []).length ? `<p class="pf-rel">관련 공식: ${p.keys.map((k) => `<a href="#${c.id}-formulas" data-route="${c.id}-formulas">${inline(k)}</a>`).join(' · ')}</p>` : ''}
      </article>
    </div>
    <nav class="ch-next" aria-label="증명 이동">
      ${prev ? `<a href="#pf-${prev.pid}" data-route="pf-${prev.pid}"><span class="caps">← 이전 증명</span><span>${inline(prev.title)}</span></a>` : `<a href="#${c.id}" data-route="${c.id}"><span class="caps">← 단원으로</span><span>${esc(c.title)} 개념 정리</span></a>`}
      ${next ? `<a href="#pf-${next.pid}" data-route="pf-${next.pid}"><span class="caps">다음 증명 →</span><span>${inline(next.title)}</span></a>` : `<a href="#proofs" data-route="proofs"><span class="caps">증명 찾기 →</span><span>다른 증명 검색하기</span></a>`}
    </nav>
    ${footer()}`;
  }

  // ---------- quiz solutions ----------
  // the unit sections a quiz problem draws on (p.secs = ['ch02:2.6', …])
  function quizUnits(p) {
    const links = (p.secs || []).map((s) => {
      const [ch, k] = s.split(':');
      const tg = xrefTarget(ch, k);
      if (!tg) return '';
      const c = chById.get(ch), sec = c.sections.find((x) => x.k === k);
      const num = sec && sec.label && !/^\d/.test(sec.label) ? sec.label : `§${k}`;
      return `<a class="pf-chip" href="#${tg.route}" data-route="${tg.route}" title="${esc(tg.label)}">${pad(c.n)} · ${esc(num)} ${esc(sec ? sec.title : '')}</a>`;
    }).filter(Boolean);
    return links.length ? `<nav class="quiz-links" aria-label="이 문제의 개념이 있는 단원"><span class="caps">개념 정리로</span>${links.join('')}</nav>` : '';
  }
  // practice problems of the same kind, after the worked solution
  function quizMore(id) {
    const list = quizPractice(id);
    return list.length ? `<nav class="quiz-links quiz-links-more" aria-label="같은 유형 연습문제"><span class="caps">같은 유형 더 풀기</span>${list.map(({ c, n }) => quizPracticeLink(c, n, `${pad(c.n)} ${c.title}`)).join('')}</nav>` : '';
  }
  // one worked-solution page (퀴즈풀이 or 고난이도): sets → problems, with a table of contents on the side
  function viewBook(b) {
    const Q = b.sets, K = b.key, P = b.pre;
    const many = Q.reduce((s, q) => s + q.problems.length, 0) > 16; // a long page jumps by set, not by problem
    const more = b.practice ? quizPractice('') : [];
    return `
    <div class="wrap">
      <header class="page-head"><span class="caps">${esc(b.caps)}</span><h1>${esc(b.h1)}<span class="ko">${esc(b.label)}</span></h1>
        ${proseP(b.lede, b.ledeDef, 'lede', inline)}
        <nav class="jump" aria-label="문제로 이동">${many
          ? Q.map((q) => `<a href="#${K}" data-act="scroll" data-target="${P}-${q.id}">${esc(q.title)} · ${q.problems.length}문제</a>`).join('')
          : Q.map((q) => q.problems.map((p) => `<a href="#${K}-${q.id}-${p.id}" data-act="scroll" data-target="${P}-${q.id}-${p.id}">${esc(q.short || q.title)} · ${esc(p.label || p.id)}</a>`).join('')).join('')}</nav>
      </header>
      <div class="ch-body quiz-body">
        <nav class="toc" aria-label="문제 목차">
          ${Q.map((q) => `<span class="caps">${esc(q.title)}</span>
            ${q.intro ? `<a href="#${K}" data-act="scroll" data-target="${P}-${q.id}-intro"><span>—</span>${esc(q.introLabel || b.intro)}</a>` : ''}
            ${q.problems.map((p) => `<a href="#${K}-${q.id}-${p.id}" data-act="scroll" data-target="${P}-${q.id}-${p.id}"><span>${esc(p.label || p.id)}</span>${esc(p.title)}</a>`).join('')}`).join('')}
          ${more.length ? `<a href="#${K}" data-act="scroll" data-target="${P}-more"><span>→</span>${esc(QUIZ_MORE)}</a>` : ''}
        </nav>
        <div class="quiz-main">
        ${Q.map((q) => `
          <div class="quiz-set" id="${P}-${q.id}">
            <div class="part-head"><span class="part-letter">${esc(q.mark || 'Q')}</span><h3>${esc(q.title)}</h3><p>${esc(q.meta || '')}</p></div>
            <article class="prose">
              ${q.intro ? `<section class="sec quiz-intro" id="${P}-${q.id}-intro">${mdOf(q, 'intro')}</section>` : ''}
              ${q.problems.map((p) => `
                <section class="sec quiz-p" id="${P}-${q.id}-${p.id}">
                  <div class="sec-title"><span>${esc(p.label || p.id)}</span><h2>${esc(p.title)}${koT(p.titleKo)}</h2></div>
                  ${p.where ? `<p class="sec-page caps">${esc(p.where)}</p>` : ''}
                  ${quizUnits(p)}
                  ${mdOf(p, 'body')}
                  ${b.practice ? quizMore(`${q.id}-${p.id}`) : ''}
                </section>`).join('')}
            </article>
          </div>`).join('')}
          ${more.length ? `<article class="prose"><section class="sec quiz-more" id="${P}-more">
            <div class="sec-title"><span>→</span><h2>${esc(QUIZ_MORE)}</h2></div>
            <p>위 문제들과 같은 모양(정의 → 유도·증명 → 작은 계산 → 해석)의 문제를 단원마다 더 만들어 두었습니다. 누르면 그 단원의 연습문제가 <b>퀴즈형</b>만 걸러진 채로 열립니다. 서술형이라 풀이를 펼친 뒤 채점 기준으로 스스로 채점하세요.</p>
            <nav class="quiz-links" aria-label="${esc(QUIZ_MORE)}">${more.map(({ c, n }) => quizPracticeLink(c, n, `${pad(c.n)} ${c.title}`)).join('')}</nav>
          </section></article>` : ''}
        </div>
      </div>
    </div>
    ${footer()}`;
  }

  // every simulation on one page, each with what to try and a link back to its section
  function viewLab() {
    return `
    <div class="wrap">
      <header class="page-head"><span class="caps">Interactive simulations</span><h1>Laboratoire<span class="ko">${esc(LAB_LABEL)}</span></h1>
        ${proseP('labLede', '직접 끌고 돌려 보며 이해하는 시뮬레이션을 모았습니다. 각 시뮬레이션은 관련 단원의 절에도 들어 있습니다.', 'lede', inline)}
        <nav class="jump" aria-label="시뮬레이션으로 이동">${SIMS.map((s) => `<a href="#lab-${s.id}" data-act="scroll" data-target="lb-${s.id}">${esc(s.title)}</a>`).join('')}</nav>
      </header>
      <div class="ch-body quiz-body lab-body">
        <nav class="toc" aria-label="시뮬레이션 목차">
          <span class="caps">${esc(LAB_LABEL)}</span>
          ${SIMS.map((s, i) => `<a href="#lab-${s.id}" data-act="scroll" data-target="lb-${s.id}"><span>${pad(i + 1)}</span>${esc(s.title)}</a>`).join('')}
        </nav>
        <div class="quiz-main"><article class="prose">
        ${SIMS.map((s, i) => {
          const c = s.ch ? chById.get(s.ch) : null;
          const sec = c && s.k ? c.sections.find((x) => x.k === s.k) : null;
          const to = c ? `${c.id}${sec ? `-k${s.k}` : ''}` : '';
          return `<section class="sec lab-sec" id="lb-${s.id}">
            <div class="sec-title"><span>${pad(i + 1)}</span><h2>${esc(s.title)}</h2></div>
            ${c ? `<p class="sec-page caps"><a href="#${to}" data-route="${to}">${pad(c.n)} ${esc(c.title)}${sec ? ` · §${esc(s.k)} ${esc(sec.title)}` : ''} →</a></p>` : ''}
            ${s.desc ? md(s.desc) : ''}
            ${simFig(`${s.id}${s.labArg ? ` ${s.labArg}` : ''}`, '', s.tries)}
          </section>`;
        }).join('')}
        </article></div>
      </div>
    </div>
    ${footer()}`;
  }

  function viewFormulas() {
    return `
    <div class="wrap">
      <header class="page-head"><span class="caps">Formula sheet</span><h1>Formulaire<span class="ko">핵심 공식집</span></h1>
        <p class="lede">모든 단원의 ‘Key’ 상자를 한곳에 모았습니다. 시험 직전에 훑어보기 좋게 단원 순서대로 정리했습니다.</p>
        <nav class="jump" aria-label="단원으로 이동">${CH.map((c) => `<a href="#formulas" data-act="scroll" data-target="f-${c.id}">${pad(c.n)} ${esc(c.title)}</a>`).join('')}</nav>
      </header>
      <div class="section tight">
        ${Object.keys(PARTS).map((k) => `
          <div class="sheet-part">
            <div class="part-head"><span class="part-letter">${k}</span><h3>${esc(PARTS[k].name)}</h3><p>${esc(PARTS[k].en)}</p></div>
            ${CH.filter((c) => c.part === k).map((c) => `
              <div id="f-${c.id}" style="margin-bottom:44px">
                <h3 style="font-family:var(--f-serif);font-size:1.2rem;margin-bottom:16px"><span class="num-text" style="margin-right:12px">${pad(c.n)}</span><a href="#${c.id}" data-route="${c.id}" style="text-decoration:none">${esc(c.title)}</a></h3>
                <div class="sheet">${keyItems(c).map((b) => `<div class="sheet-item"><span class="caps">${esc(b.sec)}</span><h4>${inline(b.title)}${b.koTitle !== b.title ? koT(b.koTitle) : ''}</h4><div class="body">${b.koBody ? bimd(b.body, b.koBody) : md(b.body)}</div>${proofLinks(b.koTitle, c.id)}</div>`).join('')}</div>
              </div>`).join('')}
          </div>`).join('')}
      </div>
    </div>
    ${footer()}`;
  }

  let builder = Object.assign({ chs: CH.filter((c) => c.part === 'A').map((c) => c.id), count: 10, minutes: 0, types: ['mc', 'num', 'open'], fresh: true }, S.prefs.builder || {});
  function viewExams() {
    const L = S.live;
    return `
    <div class="wrap">
      <header class="page-head"><span class="caps">Mock examinations</span><h1>Examens<span class="ko">실전 모의고사</span></h1>
        ${proseP('examsPageLede', '시험 범위에 맞춘 모의고사 {exams}회와 맞춤 모의고사가 있습니다. 시작하면 타이머가 돌아가고, 시간이 끝나면 자동으로 제출됩니다. 서술형은 제출 뒤 모범 풀이와 채점 기준을 보고 직접 채점합니다.', 'lede', (s) => s.replace('{exams}', EXAMS.length))}
        ${L ? `<div class="resume"><div><span class="caps" style="color:var(--camel-ink)">In progress</span><p><b>${esc(L.title)}</b> · 남은 시간 <span data-timer-inline>${fmtTime(L.minutes * 60 - (Date.now() - L.start) / 1000)}</span> · ${Object.keys(L.answers).filter((k) => L.answers[k] !== '' && L.answers[k] != null).length}/${L.pids.length}문항 답함</p></div>
          <div class="btn-row"><a class="btn" href="#exam-live" data-route="exam-live">이어서 풀기</a><button class="linkbtn" data-act="exam-abandon">응시 취소</button></div></div>` : ''}
      </header>
      <section class="section tight">
        <div class="exam-cards">
          ${EXAMS.map((x) => {
            const b = bestOf(x.id);
            const n = S.hist.filter((h) => h.exam === x.id).length;
            return `<div class="exam-card">
              <div class="exam-cover"><canvas data-plot="${x.plot}" aria-hidden="true"></canvas><b>${x.roman}</b></div>
              <div class="exam-info">
                <span class="caps" style="color:var(--camel-ink)">${esc(x.kind)}</span>
                <h3>${esc(x.title)}${x.titleKo ? koT(x.titleKo) : ''}</h3>
                ${x.descKo ? koPair(`<p>${esc(x.desc)}</p>`, `<p>${esc(x.descKo)}</p>`) : `<p>${esc(x.desc)}</p>`}
                <div class="exam-facts"><span>시간 <b>${x.minutes}분</b></span><span>문항 <b>${x.problems.length}</b></span><span>범위 <b>${esc(x.scopeText)}</b></span>${n ? `<span>응시 <b>${n}회</b> · 최고 <b>${b}점</b></span>` : ''}</div>
                <div class="btn-row"><button class="btn sm" data-act="exam-start" data-exam="${x.id}">시작하기</button></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </section>
      <section class="section" id="builder">
        <div class="section-head"><div><span class="caps">Build your own</span><h2>맞춤 모의고사</h2></div>
          <p class="lede">고른 단원의 연습문제에서 문항을 뽑아 시험지를 만듭니다. 단원이 고르게 섞이도록 뽑고, ‘새 문제 우선’을 켜면 아직 풀지 않은 문제부터 고릅니다.</p></div>
        <form class="builder" id="builder-form" novalidate>
          <fieldset><legend class="caps">범위</legend>
            <div class="chk-group">
              ${Object.keys(PARTS).map((k) => `<div class="chk-part"><span>Part ${k} · ${esc(PARTS[k].name)} <button type="button" class="linkbtn" data-act="b-part" data-part="${k}">전체 선택</button></span>
                ${CH.filter((c) => c.part === k).map((c) => `<span class="chk"><input type="checkbox" id="b-${c.id}" name="chs" value="${c.id}" ${builder.chs.includes(c.id) ? 'checked' : ''}><label for="b-${c.id}"><b>${pad(c.n)}</b>${esc(c.title)}</label></span>`).join('')}
              </div>`).join('')}
            </div>
          </fieldset>
          <div class="builder-side">
            <div class="field"><label class="caps" for="b-count">문항 수</label>
              <div class="seg" role="group" id="b-count">${[5, 8, 10, 15, 20].map((n) => `<button type="button" data-act="b-count" data-v="${n}" aria-pressed="${builder.count === n}">${n}</button>`).join('')}</div></div>
            <div class="field"><label class="caps" for="b-min">제한 시간</label>
              <div class="seg" role="group" id="b-min">${[[0, '자동'], [30, '30분'], [60, '60분'], [90, '90분'], [120, '120분']].map(([v, t]) => `<button type="button" data-act="b-min" data-v="${v}" aria-pressed="${builder.minutes === v}">${t}</button>`).join('')}</div>
              <small class="muted">자동: 객관식 5분 · 단답형 7분 · 서술형 12분 기준</small></div>
            <div class="field"><span class="caps">유형</span>
              <div class="chk-part">${[['mc', '객관식'], ['num', '단답형'], ['open', '서술형']].map(([v, t]) => `<span class="chk"><input type="checkbox" id="bt-${v}" name="types" value="${v}" ${builder.types.includes(v) ? 'checked' : ''}><label for="bt-${v}">${t}</label></span>`).join('')}</div></div>
            <div class="field"><span class="chk"><input type="checkbox" id="b-fresh" name="fresh" ${builder.fresh ? 'checked' : ''}><label for="b-fresh">새 문제 우선</label></span></div>
            <p class="muted" id="b-summary">${builderSummary()}</p>
            <div class="btn-row"><button type="button" class="btn" data-act="exam-build">시험지 만들기</button></div>
          </div>
        </form>
      </section>
      <section class="section">
        <div class="section-head"><div><span class="caps">History</span><h2>응시 기록</h2></div></div>
        ${S.hist.length ? `<div class="tbl-wrap"><table class="hist"><thead><tr><th>날짜</th><th>시험</th><th>점수</th><th>소요 시간</th><th></th></tr></thead><tbody>
          ${S.hist.map((h) => { const sc = scoreOf(h); return `<tr><td>${fmtDate(h.date)}</td><td>${esc(h.title)}</td><td class="score">${sc.got}<small class="muted" style="font-size:.6em"> / ${sc.max}</small>${sc.pending ? ' <span class="chip st-partial" style="font-family:var(--f-body)">채점 대기</span>' : ''}</td><td>${fmtTime(h.dur)}</td><td><a href="#result-${h.hid}" data-route="result-${h.hid}" class="linkbtn">결과 보기</a></td></tr>`; }).join('')}
        </tbody></table></div>` : `<div class="empty"><b>Bientôt</b><p>아직 응시 기록이 없습니다. 위에서 모의고사를 시작해 보세요.</p></div>`}
      </section>
    </div>
    ${footer()}`;
  }
  function builderPool() {
    return CH.filter((c) => builder.chs.includes(c.id)).flatMap((c) => c.problems).filter((p) => builder.types.includes(p.type));
  }
  function autoMinutes(list) {
    return Math.max(10, Math.ceil(list.reduce((s, p) => s + (p.type === 'mc' ? 5 : p.type === 'num' ? 7 : 12), 0) / 5) * 5);
  }
  function builderSummary() {
    const pool = builderPool();
    const n = Math.min(builder.count, pool.length);
    if (!pool.length) return '단원과 유형을 하나 이상 고르세요.';
    return `선택한 범위에 ${pool.length}문제가 있습니다. ${n}문항${builder.minutes ? ` · ${builder.minutes}분` : ' · 시간은 문항 구성에 맞춰 자동 설정'}.`;
  }
  function readBuilderForm() {
    const f = $('#builder-form');
    if (!f) return;
    builder.chs = $$('input[name="chs"]:checked', f).map((x) => x.value);
    builder.types = $$('input[name="types"]:checked', f).map((x) => x.value);
    builder.fresh = $('#b-fresh', f).checked;
    S.prefs.builder = builder;
    save();
    const sum = $('#b-summary');
    if (sum) sum.textContent = builderSummary();
  }

  function startExam(examId, custom) {
    let live;
    if (custom) {
      live = custom;
    } else {
      const x = examById.get(examId);
      const pts = {};
      x.problems.forEach((p) => { pts[p.id] = p.pts; });
      live = { id: x.id, title: `모의고사 ${x.roman} · ${x.title}`, pids: x.problems.map((p) => p.id), pts, answers: {}, start: Date.now(), minutes: x.minutes };
    }
    S.live = live;
    save(true);
    go('exam-live');
  }
  function buildCustom(pids, title) {
    let list;
    if (pids) {
      list = pids.map((id) => PBY.get(id)).filter(Boolean);
    } else {
      let pool = shuffle(builderPool());
      if (!pool.length) { toast('단원과 유형을 하나 이상 고르세요'); return null; }
      if (builder.fresh) pool = pool.map((p, k) => [p, k]).sort((a, b) => ((S.prog[a[0].id] ? 1 : 0) - (S.prog[b[0].id] ? 1 : 0)) || a[1] - b[1]).map((x) => x[0]);
      const byCh = new Map();
      pool.forEach((p) => { if (!byCh.has(p.ch)) byCh.set(p.ch, []); byCh.get(p.ch).push(p); });
      const lanes = [...byCh.values()];
      list = [];
      while (list.length < builder.count && lanes.some((l) => l.length)) {
        lanes.forEach((l) => { if (l.length && list.length < builder.count) list.push(l.shift()); });
      }
      list.sort((a, b) => a.ch.localeCompare(b.ch) || a.lv - b.lv);
    }
    const n = list.length;
    const pts = {};
    const base = Math.floor(100 / n);
    const rest = 100 - base * n;
    list.forEach((p, k) => { pts[p.id] = base + (k >= n - rest ? 1 : 0); });
    const minutes = pids ? autoMinutes(list) : builder.minutes || autoMinutes(list);
    return { id: 'custom', title: title || '맞춤 모의고사', pids: list.map((p) => p.id), pts, answers: {}, start: Date.now(), minutes, custom: true };
  }

  function viewExamLive() {
    const L = S.live;
    const left = L.minutes * 60 - (Date.now() - L.start) / 1000;
    const answered = (pid) => L.answers[pid] !== undefined && L.answers[pid] !== '' && L.answers[pid] !== null;
    return `
    <div class="exam-bar"><div class="wrap row">
      <div><span class="caps">Mock exam · ${L.pids.length}문항 · ${L.minutes}분</span><h1>${esc(L.title)}</h1></div>
      <div class="btn-row" style="gap:18px">
        <span class="timer ${left < 300 ? 'warn' : ''}" data-timer-big aria-label="남은 시간">${fmtTime(left)}</span>
        <button class="btn sm" data-act="exam-submit">제출하기</button>
        <a class="linkbtn" href="#exams" data-route="exams">나가기</a>
      </div>
    </div></div>
    <div class="wrap exam-layout">
      <aside class="qnav" aria-label="문항 이동">
        <span class="caps">Questions</span>
        <div class="qnav-grid">${L.pids.map((pid, k) => `<a href="#exam-live" data-act="scroll" data-target="q-${k + 1}" class="${answered(pid) ? 'done' : ''}" data-qnav="${pid}">${k + 1}</a>`).join('')}</div>
        <small data-answered>${L.pids.filter(answered).length}/${L.pids.length}문항 답함</small>
        <small>나가도 타이머는 계속 흐릅니다. 시간이 끝나면 자동으로 제출됩니다.</small>
      </aside>
      <div class="paper">${L.pids.map((pid, k) => probHTML(PBY.get(pid), { ctx: 'exam', k })).join('')}
        <div class="btn-row" style="padding-block:36px"><button class="btn" data-act="exam-submit">답안 제출하기</button></div>
      </div>
    </div>`;
  }
  function refreshAnswered() {
    const L = S.live;
    if (!L) return;
    const answered = (pid) => L.answers[pid] !== undefined && L.answers[pid] !== '' && L.answers[pid] !== null;
    $$('[data-qnav]').forEach((a) => a.classList.toggle('done', answered(a.dataset.qnav)));
    const el = $('[data-answered]');
    if (el) el.textContent = `${L.pids.filter(answered).length}/${L.pids.length}문항 답함`;
  }
  function submitExam(auto) {
    const L = S.live;
    if (!L) return;
    const items = L.pids.map((pid) => {
      const p = PBY.get(pid);
      const resp = L.answers[pid];
      const pts = L.pts[pid];
      let got = 0;
      if (p.type === 'mc') got = resp === p.ans ? pts : 0;
      else if (p.type === 'num') got = checkNum(p, resp).ok ? pts : 0;
      else got = null;
      return { pid, pts, got, resp: resp === undefined ? null : resp };
    });
    const rec = { hid: uid(), exam: L.id, title: L.title, date: Date.now(), dur: Math.min((Date.now() - L.start) / 1000, L.minutes * 60), minutes: L.minutes, items };
    S.hist.unshift(rec);
    S.live = null;
    items.forEach((it) => { if (it.got !== null) setProg(it.pid, it.got === it.pts ? 'right' : 'wrong'); });
    save(true);
    closeModal();
    go('result-' + rec.hid);
    if (auto) toast('시간이 끝나 답안을 자동으로 제출했습니다');
  }

  function viewResult(hid) {
    const h = S.hist.find((x) => x.hid === hid);
    if (!h) return `<div class="wrap"><div class="empty"><b>Hélas</b><p>이 결과를 찾을 수 없습니다. 기록이 지워졌을 수 있습니다.</p><a class="btn" href="#exams" data-route="exams">모의고사 목록</a></div></div>`;
    const sc = scoreOf(h);
    const byCh = new Map();
    h.items.forEach((it) => {
      const p = PBY.get(it.pid);
      if (!p) return;
      if (!byCh.has(p.ch)) byCh.set(p.ch, { got: 0, max: 0 });
      const b = byCh.get(p.ch);
      b.max += it.pts; b.got += it.got || 0;
    });
    const wrongIds = h.items.filter((it) => it.got !== null && it.got < it.pts).map((it) => it.pid);
    return `
    <div class="wrap">
      <section class="result-hero">
        <div class="score-big">${sc.got}<small>/ ${sc.max}</small></div>
        <div class="result-meta">
          <span class="caps" style="color:var(--camel-ink)">Result · ${fmtDate(h.date)}</span>
          <h2>${esc(h.title)}</h2>
          <p class="muted">소요 시간 ${fmtTime(h.dur)} / ${h.minutes}분 · 정답 ${h.items.filter((it) => it.got === it.pts).length}/${h.items.length}문항</p>
          ${sc.pending ? `<p class="pending-note">서술형 ${sc.pending}문항이 채점을 기다립니다. 아래에서 모범 풀이와 채점 기준을 보고 점수를 고르면 총점이 확정됩니다.</p>` : ''}
          <div class="btn-row">${wrongIds.length ? `<a class="btn sm" href="#review" data-route="review">오답노트에서 다시 풀기</a>` : ''}<a class="btn sm ghost" href="#exams" data-route="exams">모의고사 목록</a></div>
        </div>
      </section>
      <section class="section tight">
        <div class="section-head"><div><span class="caps">By chapter</span><h2>단원별 득점</h2></div></div>
        <div class="breakdown">
          ${[...byCh.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([cid, b]) => {
            const c = chById.get(cid);
            const pct = b.max ? Math.round((b.got / b.max) * 100) : 0;
            return `<div class="bd-row"><span>${pad(c.n)} ${esc(c.title)}</span><div class="bar"><i style="width:${pct}%;background:${pct >= 70 ? 'var(--ok)' : pct >= 40 ? 'var(--mid)' : 'var(--bad)'}"></i></div><span class="v">${Math.round(b.got * 10) / 10}/${b.max}</span></div>`;
          }).join('')}
        </div>
      </section>
      <section class="section" style="padding-top:20px">
        <div class="section-head"><div><span class="caps">Review</span><h2>문항별 풀이</h2></div></div>
        <div class="paper">${h.items.map((it, k) => PBY.get(it.pid) ? probHTML(PBY.get(it.pid), { ctx: 'result', item: it, h, k }) : '').join('')}</div>
      </section>
    </div>
    ${footer()}`;
  }

  function viewReview() {
    const ids = [...PBY.keys()].filter((id) => S.prog[id] && S.prog[id].s !== 'right');
    const groups = new Map();
    ids.forEach((id) => {
      const p = PBY.get(id);
      if (!groups.has(p.ch)) groups.set(p.ch, []);
      groups.get(p.ch).push(p);
    });
    const order = [...groups.keys()].sort();
    return `
    <div class="wrap">
      <header class="page-head"><span class="caps">Review notebook</span><h1>Carnet<span class="ko">오답노트</span></h1>
        <p class="lede">틀렸거나 일부만 맞힌 문제가 단원별로 모입니다. 다시 풀어 맞히면 목록에서 빠집니다.</p>
        ${ids.length >= 3 ? `<div class="btn-row"><button class="btn" data-act="exam-wrong">오답 ${Math.min(ids.length, 20)}문항으로 모의고사 보기</button></div>` : ''}
      </header>
      ${ids.length ? order.map((cid) => {
        const c = chById.get(cid);
        return `<section class="section tight">
          <div class="part-head"><span class="part-letter">${pad(c.n)}</span><h3>${esc(c.title)}</h3><p>${groups.get(cid).length}문항</p></div>
          <div class="problems">${groups.get(cid).map((p) => {
            const o = { label: p.src === 'practice' ? pad(p.no) : examById.get(p.src).roman, sub: p.src === 'practice' ? '연습문제' : `모의고사 ${pad(p.no)}번`, source: false };
            return withOpts(probHTML(p, Object.assign({ ctx: 'practice' }, o)), o);
          }).join('')}</div>
        </section>`;
      }).join('') : `<div class="empty"><b>Parfait</b><p>오답노트가 비어 있습니다. 연습문제나 모의고사에서 틀린 문제가 여기에 모입니다.</p><a class="btn" href="#${S.prefs.lastCh || CH[0].id}-practice" data-route="${S.prefs.lastCh || CH[0].id}-practice">연습문제 풀기</a></div>`}
    </div>
    ${footer()}`;
  }

  // ---------- hero carousel ----------
  let heroTimer = null;
  let heroHold = false;
  function stopHero() { clearInterval(heroTimer); heroTimer = null; }
  function startHero() {
    stopHero();
    const hero = $('#hero');
    if (!hero) return;
    hero.addEventListener('mouseenter', () => { heroHold = true; });
    hero.addEventListener('mouseleave', () => { heroHold = false; });
    hero.addEventListener('focusin', () => { heroHold = true; });
    hero.addEventListener('focusout', () => { heroHold = false; });
    if (reduced) return;
    heroTimer = setInterval(() => { if (!heroHold && !document.hidden) setHero(heroIdx + 1); }, 7000);
  }
  function setHero(i) {
    heroIdx = (i + CH.length) % CH.length;
    const c = CH[heroIdx];
    const inner = $('#hero-inner');
    const cv = $('#hero canvas');
    if (!inner || !cv) return;
    const swap = () => {
      inner.innerHTML = heroSlide(c);
      cv.dataset.plot = c.plot;
      window.EMPlots.mount($('#hero'));
      inner.style.opacity = 1; cv.style.opacity = 1;
    };
    $$('.tl-item').forEach((b, k) => b.setAttribute('aria-current', String(k === heroIdx)));
    if (reduced) { swap(); return; }
    inner.style.opacity = 0; cv.style.opacity = 0;
    setTimeout(swap, 220);
  }

  // ---------- router ----------
  let route = '';
  function parseHash() {
    let h = '';
    try { h = decodeURIComponent(location.hash.slice(1)); } catch (e) {}
    return h || 'home';
  }
  // a click on a link cross-fades the old page into the new one (View Transitions where the browser has them);
  // history and hash changes render at once and only fade the new page in
  function go(to, opts) {
    if (to !== route) {
      try { history.pushState(null, '', '#' + to); } catch (e) { /* sandboxed: keep in-page state only */ }
    }
    const o = opts || {};
    if (o.vt && !reduced && document.startViewTransition && !document.hidden) {
      try { document.startViewTransition(() => render(to, Object.assign({}, o, { fade: false }))); return; } catch (e) { /* fall through */ }
    }
    render(to, o);
  }
  function render(to, opts) {
    const prevRoute = route;
    route = to;
    CUR_CH = null;
    stopHero();
    let m;
    let view = 'page';
    let html = '';
    if (to === 'home') { view = 'home'; html = viewHome(); }
    else if ((m = /^(ch\d{2})(?:-(practice|formulas|proofs))?$/.exec(to)) && chById.get(m[1])) { view = 'chapter'; html = viewChapter(chById.get(m[1]), m[2] || 'learn'); }
    else if ((m = /^(ch\d{2})-k([\w.]+)$/.exec(to)) && chById.get(m[1])) { view = 'chapter'; html = viewChapter(chById.get(m[1]), 'learn'); opts = Object.assign({}, opts, { anchor: `sec-${m[2]}` }); }
    else if (to === 'formulas') html = viewFormulas();
    else if (to === 'proofs') html = viewProofs();
    else if ((m = /^pf-(ch\d{2}-[\w-]+)$/.exec(to)) && proofById.get(m[1])) html = viewProof(proofById.get(m[1]));
    else if (to === 'exams') html = viewExams();
    else if (to === 'exam-live' && S.live) { view = 'exam-live'; html = viewExamLive(); }
    else if (to === 'exam-live') { route = 'exams'; html = viewExams(); }
    else if ((m = /^result-([a-z0-9]+)$/.exec(to))) html = viewResult(m[1]);
    else if (to === 'review') html = viewReview();
    else if (to === 'lab' && SIMS.length) html = viewLab();
    else if ((m = /^lab-([\w-]+)$/.exec(to)) && SIMREG[m[1]]) { html = viewLab(); opts = Object.assign({}, opts, { anchor: `lb-${m[1]}` }); }
    else if (BOOK.has(to)) html = viewBook(BOOK.get(to));
    else if ((m = /^([a-z]+)-([\w-]+)$/.exec(to)) && BOOK.has(m[1])) { const b = BOOK.get(m[1]); html = viewBook(b); opts = Object.assign({}, opts, { anchor: `${b.pre}-${m[2]}` }); }
    else { route = 'home'; view = 'home'; html = viewHome(); }
    document.body.dataset.view = view;
    if (BI && !document.getElementById('ko-all')) {
      document.body.insertAdjacentHTML('beforeend', '<button id="ko-all" class="ko-all" type="button" data-act="ko-all" aria-pressed="false"><b>KO</b><span>한국어 번역 모두 보기</span></button>');
      applyKoAll();
    }
    main.innerHTML = html;
    const samePage0 = prevRoute.slice(0, 4) === route.slice(0, 4) && view === 'chapter';
    if (opts.fade !== false && !reduced && prevRoute && prevRoute !== route) {
      // a new page rises in; a tab switch inside the same unit only fades its body
      main.classList.remove('enter', 'enter-soft');
      void main.offsetWidth;
      main.classList.add(samePage0 ? 'enter-soft' : 'enter');
    }
    const drawer = $('#drawer-root .drawer');
    if (drawer && !reduced && opts.fade !== false) { drawer.classList.add('closing'); setTimeout(() => { if (drawer.isConnected) $('#drawer-root').innerHTML = ''; }, 200); } else $('#drawer-root').innerHTML = '';
    updateHeader();
    window.EMPlots.mount(main);
    mountSims(main);
    if (view === 'home') startHero();
    if (view === 'chapter' || bookOf(route) || route.startsWith('lab')) watchToc();
    if (route === 'proofs') filterProofs();
    const title = { home: '', formulas: '공식집', proofs: '증명 찾기', exams: '모의고사', review: '오답노트', 'exam-live': '시험 중', lab: LAB_LABEL };
    BOOKS.forEach((b) => { title[b.key] = b.label; });
    const ch = chById.get(route.slice(0, 4));
    const pf = route.startsWith('pf-') && proofById.get(route.slice(3));
    const DT = SITE.title || SITE.name || '';
    const tk = bookOf(route) ? bookOf(route).key : route.startsWith('lab-') ? 'lab' : route;
    document.title = pf ? `${pf.title.replace(/\$/g, '')} · 증명` : view === 'chapter' && ch ? `${ch.title} · ${DT}` : title[tk] ? `${title[tk]} · ${DT}` : DT;
    const samePage = prevRoute.slice(0, 4) === route.slice(0, 4) && view === 'chapter';
    if (opts.keepScroll != null) window.scrollTo(0, opts.keepScroll);
    else if (opts.anchor && document.getElementById(opts.anchor)) {
      document.getElementById(opts.anchor).scrollIntoView();
    } else if (samePage) {
      const tabs = $('#tabs');
      if (tabs) {
        const y = tabs.getBoundingClientRect().top + window.scrollY - (document.querySelector('.site-header').offsetHeight);
        if (window.scrollY > y) window.scrollTo(0, y);
      }
    } else if (opts.anchor) {
      const el = document.getElementById(opts.anchor);
      if (el) el.scrollIntoView();
    } else window.scrollTo(0, 0);
    onScroll();
  }

  let tocObs = null;
  function watchToc() {
    if (tocObs) tocObs.disconnect();
    const links = $$('.toc a');
    if (!links.length || !('IntersectionObserver' in window)) return;
    tocObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('active', a.dataset.target === e.target.id));
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.sec[id]').forEach((s) => tocObs.observe(s));
  }

  // ---------- events ----------
  function onScroll() { document.body.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('details.net-menu[open]').forEach((d) => { if (!d.contains(e.target)) d.removeAttribute('open'); });
    const a = e.target.closest('a[data-route]');
    if (a && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      go(a.dataset.route, { vt: true });
      return;
    }
    const t = e.target.closest('[data-act]');
    if (!t) return;
    if (t.classList.contains('modal-back') && e.target.closest('[data-stop]')) return;
    const act = t.dataset.act;
    const pid = t.dataset.pid;
    const p = pid ? PBY.get(pid) : null;
    switch (act) {
      case 'scroll': {
        e.preventDefault();
        const el = document.getElementById(t.dataset.target);
        if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        break;
      }
      case 'to-catalogue':
        e.preventDefault();
        if (route !== 'home') go('home', { anchor: 'catalogue' });
        else { const el = $('#catalogue'); if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
        break;
      case 'pf-ch':
        pfFilter.ch = t.dataset.ch;
        $$('[data-act="pf-ch"]').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
        filterProofs();
        break;
      case 'pf-hand':
        pfFilter.hand = !pfFilter.hand;
        t.setAttribute('aria-pressed', String(pfFilter.hand));
        filterProofs();
        break;
      case 'menu': openDrawer(); break;
      case 'menu-close': closeDrawer(); break;
      case 'hero-prev': setHero(heroIdx - 1); break;
      case 'hero-next': setHero(heroIdx + 1); break;
      case 'hero-to': setHero(+t.dataset.i); break;
      case 'mc-pick': {
        const u = uiOf(pid);
        if (u.done) break;
        u.pick = +t.dataset.i;
        $$(`#p-${pid} .choice`).forEach((b, k) => b.setAttribute('aria-pressed', String(k === u.pick)));
        break;
      }
      case 'check': {
        const u = uiOf(pid);
        if (p.type === 'mc') {
          if (u.pick == null) { toast('보기를 먼저 고르세요'); break; }
          u.done = true; u.ok = u.pick === p.ans;
        } else {
          const inp = document.getElementById('in-' + pid);
          const v = inp ? inp.value : '';
          const r = checkNum(p, v);
          if (r.empty) { toast('답을 입력하세요'); inp && inp.focus(); break; }
          if (r.err) { toast(r.err); inp && inp.focus(); break; }
          u.input = v; u.done = true; u.ok = r.ok; u.v = r.v;
        }
        setProg(pid, u.ok ? 'right' : 'wrong');
        rerenderCard(pid);
        break;
      }
      case 'reveal': {
        const u = uiOf(pid);
        const ta = document.getElementById('ta-' + pid);
        if (ta) u.input = ta.value;
        u.done = true;
        rerenderCard(pid);
        break;
      }
      case 'self': {
        const u = uiOf(pid);
        u.self = t.dataset.s;
        setProg(pid, u.self);
        rerenderCard(pid);
        break;
      }
      case 'retry': ui.delete(pid); rerenderCard(pid); break;
      case 'hint': { const u = uiOf(pid); u.hint = !u.hint; rerenderCard(pid); break; }
      case 'ko': { // one paragraph's Korean original
        const b = t.closest('.bi');
        if (b) t.setAttribute('aria-expanded', String(b.classList.toggle('open')));
        break;
      }
      case 'ko-card': { // a whole problem card
        const card = t.closest('.prob');
        if (card) t.setAttribute('aria-pressed', String(card.classList.toggle('ko-on')));
        break;
      }
      case 'ko-all': S.prefs.koAll = !S.prefs.koAll; save(); applyKoAll(); break;
      case 'filter-reset':
        filters = Object.assign(filters, { lv: 'all', type: 'all', st: 'all', sec: 'all', kind: 'all' });
        S.prefs.filters = filters;
        save();
        render(route, { keepScroll: window.scrollY });
        break;
      case 'filter': {
        filters[t.dataset.k] = t.dataset.v;
        if (t.dataset.k === 'kind') filters.kindCh = route.slice(0, 4);
        S.prefs.filters = filters;
        save();
        render(route, { keepScroll: window.scrollY });
        break;
      }
      case 'quiz-practice': { // from the quiz page: open a unit's practice showing only quiz-style problems
        e.preventDefault();
        filters = Object.assign(filters, { lv: 'all', type: 'all', st: 'all', sec: 'all', kind: 'quiz', kindCh: t.dataset.ch });
        S.prefs.filters = filters;
        save();
        go(`${t.dataset.ch}-practice`);
        break;
      }
      case 'exam-start': {
        const x = examById.get(t.dataset.exam);
        const begin = () => { closeModal(); startExam(x.id); };
        if (S.live) {
          modal({ title: '진행 중인 시험이 있습니다', body: `<b>${esc(S.live.title)}</b>을(를) 풀고 있습니다. 새 시험을 시작하면 진행 중인 답안은 사라집니다.`, ok: '새로 시작', onOk: begin });
        } else {
          modal({ title: `모의고사 ${x.roman} 시작`, body: `${esc(x.title)} · ${x.problems.length}문항 · <b>${x.minutes}분</b>. 시작하면 타이머가 돌아가고, 시간이 끝나면 자동으로 제출됩니다.`, ok: '시작하기', onOk: begin });
        }
        break;
      }
      case 'exam-build': {
        readBuilderForm();
        const live = buildCustom();
        if (!live) break;
        const begin = () => { closeModal(); live.start = Date.now(); startExam(null, live); };
        modal({ title: '맞춤 모의고사 시작', body: `${live.pids.length}문항 · <b>${live.minutes}분</b>. ${S.live ? '진행 중인 시험은 사라집니다. ' : ''}시작할까요?`, ok: '시작하기', onOk: begin });
        break;
      }
      case 'exam-wrong': {
        const ids = [...PBY.keys()].filter((id) => S.prog[id] && S.prog[id].s !== 'right');
        const live = buildCustom(shuffle(ids).slice(0, 20), '오답 모의고사');
        const begin = () => { closeModal(); live.start = Date.now(); startExam(null, live); };
        modal({ title: '오답 모의고사', body: `오답노트에서 ${live.pids.length}문항 · <b>${live.minutes}분</b>. 시작할까요?`, ok: '시작하기', onOk: begin });
        break;
      }
      case 'b-count': builder.count = +t.dataset.v; $$('[data-act="b-count"]').forEach((b) => b.setAttribute('aria-pressed', String(b === t))); readBuilderForm(); break;
      case 'b-min': builder.minutes = +t.dataset.v; $$('[data-act="b-min"]').forEach((b) => b.setAttribute('aria-pressed', String(b === t))); readBuilderForm(); break;
      case 'b-part': {
        const boxes = $$(`input[name="chs"]`).filter((x) => chById.get(x.value).part === t.dataset.part);
        const all = boxes.every((x) => x.checked);
        boxes.forEach((x) => { x.checked = !all; });
        readBuilderForm();
        break;
      }
      case 'ex-pick': {
        const L = S.live;
        if (!L) break;
        const k = +t.dataset.i;
        L.answers[pid] = L.answers[pid] === k ? null : k;
        $$(`[data-pid="${pid}"].choice`).forEach((b, j) => b.setAttribute('aria-pressed', String(L.answers[pid] === j)));
        save();
        refreshAnswered();
        break;
      }
      case 'exam-submit': {
        const L = S.live;
        if (!L) break;
        const empty = L.pids.filter((id) => L.answers[id] === undefined || L.answers[id] === '' || L.answers[id] === null).length;
        modal({ title: '답안을 제출할까요?', body: empty ? `아직 답하지 않은 문항이 <b>${empty}개</b> 있습니다. 제출하면 수정할 수 없습니다.` : '모든 문항에 답했습니다. 제출하면 수정할 수 없습니다.', ok: '제출하기', onOk: () => submitExam(false) });
        break;
      }
      case 'exam-abandon':
        modal({ title: '응시를 취소할까요?', body: '진행 중인 답안이 모두 사라지고 기록에 남지 않습니다.', ok: '응시 취소', onOk: () => { S.live = null; save(true); closeModal(); render('exams'); } });
        break;
      case 'res-grade': {
        const h = S.hist.find((x) => x.hid === t.dataset.hid);
        if (!h) break;
        const it = h.items.find((x) => x.pid === pid);
        const f = +t.dataset.f;
        it.got = Math.round(it.pts * f * 10) / 10;
        setProg(pid, f === 1 ? 'right' : f === 0 ? 'wrong' : 'partial');
        save(true);
        render(route, { keepScroll: window.scrollY });
        break;
      }
      case 'reset-all':
        modal({ title: '기록을 모두 지울까요?', body: '연습문제 풀이, 오답노트, 모의고사 기록이 이 브라우저에서 모두 지워집니다. 되돌릴 수 없습니다.', ok: '모두 지우기', onOk: () => { S = { prog: {}, hist: [], live: null, prefs: {} }; ui.clear(); save(true); closeModal(); toast('기록을 지웠습니다'); render(route); } });
        break;
      case 'modal-ok': if (modalOk) modalOk(); else closeModal(); break;
      case 'modal-cancel':
        if (e.target.closest('[data-stop]') && !e.target.closest('button')) break;
        closeModal();
        break;
      default: break;
    }
  });

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.id === 'pf-q') {
      pfFilter.q = el.value;
      S.prefs.pfq = el.value;
      save();
      filterProofs();
      return;
    }
    const role = el.dataset && el.dataset.role;
    if (!role) return;
    const pid = el.dataset.pid;
    const p = PBY.get(pid);
    if (role === 'num' || role === 'scratch') {
      uiOf(pid).input = el.value;
      if (role === 'num') {
        const pv = document.getElementById('pv-' + pid);
        if (pv) pv.textContent = previewText(p, el.value);
      }
    } else if ((role === 'ex-num' || role === 'ex-open') && S.live) {
      S.live.answers[pid] = el.value;
      save();
      refreshAnswered();
      if (role === 'ex-num') {
        const pv = document.getElementById('pv-' + pid);
        if (pv) pv.textContent = previewText(p, el.value);
      }
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.closest('#builder-form')) readBuilderForm();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeDrawer(); }
    if (e.key === 'Enter' && e.target.dataset && e.target.dataset.role === 'num') {
      e.preventDefault();
      const b = $(`#p-${e.target.dataset.pid} [data-act="check"]`);
      if (b) b.click();
    }
    if (e.key === 'Enter' && e.target.dataset && e.target.dataset.role === 'ex-num') e.preventDefault();
    if (document.body.dataset.view === 'home' && !e.target.closest('input,textarea')) {
      if (e.key === 'ArrowRight' && e.target.closest('#hero')) setHero(heroIdx + 1);
      if (e.key === 'ArrowLeft' && e.target.closest('#hero')) setHero(heroIdx - 1);
    }
  });

  // one ticker drives every exam clock
  setInterval(() => {
    if (!S.live) return;
    const left = S.live.minutes * 60 - (Date.now() - S.live.start) / 1000;
    if (left <= 0) { submitExam(true); return; }
    const big = $('[data-timer-big]');
    if (big) { big.textContent = fmtTime(left); big.classList.toggle('warn', left < 300); }
    const inl = $('[data-timer-inline]');
    if (inl) inl.textContent = fmtTime(left);
    const pill = $('#pill[data-timer]');
    if (pill) pill.textContent = `시험 중 ${fmtTime(left)}`;
  }, 1000);

  // theme changes → redraw plots with new tokens
  if (window.matchMedia) {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', () => window.EMPlots.redrawAll());
  }
  new MutationObserver(() => window.EMPlots.redrawAll()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('popstate', () => { const h = parseHash(); if (h !== route) render(h, {}); });
  window.addEventListener('hashchange', () => { const h = parseHash(); if (h !== route) render(h, {}); });

  // Korean words inside tracked uppercase labels look letter-spaced with the Latin tracking;
  // wrap each Hangul run in .ko-caps so the stylesheet can give it normal spacing
  const CAPS_SEL = '.caps, .blk-label, details.sol > summary, .tile-done, .prob-no small, .pts';
  const HANGUL = /[ㄱ-ㆎ가-힣]/;
  const HANGUL_RUN = /[ㄱ-ㆎ가-힣](?:[ㄱ-ㆎ가-힣\s·]*[ㄱ-ㆎ가-힣])?/g;
  function tuneCaps(node) {
    const els = [];
    const up = node.closest && node.closest(CAPS_SEL);
    if (up) els.push(up);
    else if (node.querySelectorAll) els.push(...node.querySelectorAll(CAPS_SEL));
    els.forEach((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const texts = [];
      while (walker.nextNode()) {
        const t = walker.currentNode;
        if (HANGUL.test(t.nodeValue) && !t.parentElement.closest('.ko-caps, .katex, em')) texts.push(t);
      }
      texts.forEach((t) => {
        const s = t.nodeValue;
        const frag = document.createDocumentFragment();
        let last = 0;
        s.replace(HANGUL_RUN, (m, i) => {
          if (i > last) frag.append(s.slice(last, i));
          const span = document.createElement('span');
          span.className = 'ko-caps';
          span.textContent = m;
          frag.append(span);
          last = i + m.length;
          return m;
        });
        if (last < s.length) frag.append(s.slice(last));
        t.replaceWith(frag);
      });
    });
  }
  new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => {
    if (n.nodeType === 1) tuneCaps(n);
    else if (n.nodeType === 3 && n.parentElement) tuneCaps(n.parentElement);
  }))).observe(document.body, { childList: true, subtree: true });

  // read-only handle for tools/test.html
  window.__APP = { md, inline, keyBlocks, xrefTarget, CH, PROOFS, EXAMS, PBY, XLINKS, proofsByKey, chById, SISTERS, NET_IN, FIELD, QUIZ, QZP, BOOKS, SIMS, SIMREG, BI, EN, scanSegs, bimd };

  renderHeader();
  if (S.live && S.live.minutes * 60 - (Date.now() - S.live.start) / 1000 <= 0) { route = 'exams'; submitExam(true); }
  else render(parseHash(), {});
  let userScrolled = false;
  ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { userScrolled = true; }, { passive: true, once: true }));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
    window.EMPlots.redrawAll();
    // web fonts change the line breaks above a deep-linked section; land on it again unless the reader has moved
    const m = /-k([\d.]+[a-z]?)$/.exec(route);
    const el = m && document.getElementById('sec-' + m[1]);
    if (el && !userScrolled) el.scrollIntoView();
  });
})();
