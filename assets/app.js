/* Équation — 공학수학 스터디 앱 (vanilla JS, hash routing, localStorage progress) */
(function () {
  'use strict';
  const EM = window.EM || { chapters: [], exams: [] };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PARTS = {
    A: { name: '상미분방정식', en: 'Ordinary Differential Equations', desc: '1계부터 연립 ODE, 급수해, 라플라스 변환까지. 공학수학 1의 중심입니다.' },
    B: { name: '선형대수 · 벡터 미적분', en: 'Linear Algebra & Vector Calculus', desc: '행렬과 고유값, 그리고 기울기·발산·회전과 적분 정리.' },
    C: { name: '푸리에 해석 · 편미분방정식', en: 'Fourier Analysis & PDEs', desc: '주기함수의 분해와 파동·열·라플라스 방정식.' },
    D: { name: '복소해석', en: 'Complex Analysis', desc: '해석함수, 코시 적분, 로랑 급수와 유수 정리.' },
  };
  const TYPE = { mc: '객관식', num: '단답형', open: '서술형' };
  const LV = ['', '기초', '표준', '심화'];
  const MACROS = {
    '\\Re': '\\operatorname{Re}', '\\Im': '\\operatorname{Im}', '\\Res': '\\operatorname*{Res}',
    '\\Arg': '\\operatorname{Arg}', '\\Ln': '\\operatorname{Ln}', '\\rank': '\\operatorname{rank}',
    '\\tr': '\\operatorname{tr}', '\\curl': '\\operatorname{curl}', '\\dv': '\\operatorname{div}',
    '\\grad': '\\operatorname{grad}', '\\Lap': '\\mathcal{L}', '\\sech': '\\operatorname{sech}',
  };

  // ---------- data index ----------
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
  const normText = (s) => String(s || '').toLowerCase()
    .replace(/\\([a-z]+)/g, '$1')
    .replace(/[\s{}$^_\\()[\],.·:;'"`~!?=+*/|<>–—-]/g, '');
  const PRACTICE_TOTAL = CH.reduce((s, c) => s + c.problems.length, 0);

  // ---------- storage ----------
  const KEY = 'equation-em-v1';
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
    t = esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return t.replace(/\u0000(\d+)\u0000/g, (_, k) => tex(math[k][0], math[k][1]));
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
  };
  function isBlockStart(l) {
    const t = l.trim();
    return t.startsWith(':::') || t.startsWith('$$') || t.startsWith('|') || /^[-•]\s+/.test(t) || /^\d+[.)]\s+/.test(t);
  }
  function md(src) {
    if (!src) return '';
    const L = dedent(src);
    let out = '';
    let i = 0;
    while (i < L.length) {
      const line = L[i];
      const t = line.trim();
      if (!t) { i++; continue; }
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
      out += `<p>${inline(buf.join(' '))}</p>`;
    }
    return out;
  }
  // built-in figures referenced from content as ":::fig name"
  const FIGS = {
    pq() {
      const X = (p) => 280 + 60 * p;
      const Y = (q) => 200 - 40 * q;
      let d = '';
      for (let p = -4; p <= 4.001; p += 0.25) d += `${d ? 'L' : 'M'}${X(p).toFixed(1)},${Y((p * p) / 4).toFixed(1)}`;
      return `<figure class="fig"><svg viewBox="0 0 560 290" role="img" aria-label="trace-determinant 평면에서 임계점의 분류">
        <rect class="rg" x="40" y="${Y(0)}" width="490" height="${Y(-1.6) - Y(0)}"/>
        <line class="ax" x1="40" y1="${Y(0)}" x2="530" y2="${Y(0)}"/><line class="ax" x1="${X(0)}" y1="14" x2="${X(0)}" y2="270"/>
        <path class="cv" d="${d}"/>
        <line class="cv2" x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="22"/>
        <text x="524" y="${Y(0) - 8}" text-anchor="end">p = tr A</text>
        <text x="${X(0) + 8}" y="24">q = det A</text>
        <text class="em" x="${X(-1.3)}" y="${Y(2.7)}" text-anchor="middle">안정 나선점</text>
        <text class="em" x="${X(1.3)}" y="${Y(2.7)}" text-anchor="middle">불안정 나선점</text>
        <text class="em" x="${X(-3.1)}" y="${Y(0.9)}" text-anchor="middle">안정 마디점</text>
        <text class="em" x="${X(3.1)}" y="${Y(0.9)}" text-anchor="middle">불안정 마디점</text>
        <text class="em" x="${X(0) + 8}" y="${Y(3.6)}">중심 (p = 0)</text>
        <text class="em" x="${X(0)}" y="${Y(-0.9)}" text-anchor="middle">안장점 (q &lt; 0)</text>
        <text x="${X(3.3)}" y="${Y(3.3)}" text-anchor="end">Δ = p² − 4q = 0</text>
      </svg><figcaption>고유값의 합 p와 곱 q만으로 원점의 종류가 결정됩니다. 포물선 위쪽은 복소 고유값(나선), 아래쪽은 실수 고유값(마디)입니다.</figcaption></figure>`;
    },
  };
  function proofLinks(title) {
    const list = proofsByKey.get(String(title || '').trim());
    if (!list || !list.length) return '';
    return `<div class="pf-links"><span class="caps">Proof</span>${list.map((p) =>
      `<a href="#pf-${p.pid}" data-route="pf-${p.pid}">${inline(p.title)}</a>`).join('')}</div>`;
  }
  function container(type, title, inner) {
    if (type === 'fig') return FIGS[title.trim()] ? FIGS[title.trim()]() : '';
    const [label, cls] = BLOCK_LABEL[type] || ['Note', 'blk-thm'];
    const head = `<div class="blk-label">${label}${title ? `<em>${inline(title)}</em>` : ''}</div>`;
    if (type === 'key' || type === 'thm') return `<div class="blk ${cls}">${head}${md(inner)}${proofLinks(title)}</div>`;
    if (type === 'ex') {
      const parts = inner.split(/\n\s*---\s*\n/);
      const q = parts[0];
      const a = parts.slice(1).join('\n');
      return `<div class="blk ${cls}">${head}${md(q)}${a ? `<details class="sol"><summary>풀이 보기</summary><div>${md(a)}</div></details>` : ''}</div>`;
    }
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
        found.push({ title: m[1] || s.title, body: inner.join('\n'), sec: `${c.n}.${si + 1} ${s.title}` });
      }
    });
    c._keys = found;
    return found;
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
    toast.t = setTimeout(() => { root.innerHTML = ''; }, 2600);
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
  function closeModal() { $('#modal-root').innerHTML = ''; modalOk = null; }
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
  function renderHeader() {
    $('#site-header').innerHTML = `
      <div class="wrap header-row">
        <nav class="nav nav-left" aria-label="주 메뉴">
          <button class="menu-btn" data-act="menu" aria-label="메뉴 열기"><i></i><i></i><i></i></button>
          <a href="#home" class="ko" data-act="to-catalogue">단원</a>
          <a href="#formulas" class="ko" data-route="formulas">공식집</a>
          <a href="#proofs" class="ko" data-route="proofs">증명</a>
        </nav>
        <a class="wordmark" href="#home" data-route="home" aria-label="Équation 홈"><b>ÉQUATION</b><span>Engineering Mathematics</span></a>
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
      if (route === r || (r === 'exams' && route.startsWith('result-')) || (r === 'proofs' && route.startsWith('pf-'))) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
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
          <a href="#exams" data-route="exams">실전 모의고사</a>
          <a href="#review" data-route="review">오답노트</a>
          ${Object.keys(PARTS).map((k) => `
            <h4 class="caps">Part ${k} · ${PARTS[k].name}</h4>
            ${CH.filter((c) => c.part === k).map((c) => `<a href="#${c.id}" data-route="${c.id}"><span>${pad(c.n)}</span>${esc(c.title)}</a>`).join('')}
          `).join('')}
        </nav>
        <button class="drawer-scrim" data-act="menu-close" aria-label="메뉴 닫기"></button>
      </div>`;
  }
  function footer() {
    return `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <h5 class="caps">Équation</h5>
            <p>Kreyszig, <em>Advanced Engineering Mathematics</em> (10판)의 장 구성을 따라 정리한 공학수학 시험 대비 노트입니다. 각 단원의 ‘Kreyszig Ch.’ 표기가 교재의 장 번호입니다.</p>
          </div>
          <div>
            <h5 class="caps">단답형 입력</h5>
            <p>분수 <code>3/2</code>, 원주율 <code>pi</code>, 자연상수 <code>e</code>, 제곱근 <code>sqrt(3)</code>, 허수 <code>i</code>를 쓸 수 있습니다.</p>
            <p>예: <code>2*pi*i</code>, <code>1-e^(-1)</code>, <code>(-2+2i)/3</code></p>
          </div>
          <div>
            <h5 class="caps">기록</h5>
            <p>풀이 기록과 모의고사 점수는 지금 쓰는 브라우저에만 저장됩니다.</p>
            <p><button class="linkbtn" data-act="reset-all">기록 모두 지우기</button></p>
          </div>
        </div>
        <div class="footer-base caps">
          <span>Équation · 공학수학</span>
          <span>${CH.length} chapters · ${PRACTICE_TOTAL} exercises · ${PROOFS.length} proofs · ${EXAMS.length} mock exams</span>
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
    return `<div class="solution"><div class="blk-label">Solution<em>풀이</em></div>${md(p.sol)}</div>`;
  }
  function answerTex(p) {
    if (p.type === 'mc') return `${CIRC[p.ans]} ${inline(p.choices[p.ans])}`;
    if (p.type === 'num') return p.ansTex ? tex(p.ansTex, false) : `<code>${esc(p.ans)}</code>`;
    return '';
  }

  function probHTML(p, o) {
    const ctx = o.ctx;
    if (ctx === 'exam') return examProbHTML(p, o);
    if (ctx === 'result') return resultProbHTML(p, o);
    const u = uiOf(p.id);
    const no = o.label || pad(p.no);
    const tags = `<div class="prob-tags"><span class="chip">${TYPE[p.type]}</span><span class="chip lv">${LV[p.lv]}</span>${o.source ? `<span class="chip">${esc(sourceLabel(p))}</span>` : ''}${statusChip(p.id)}</div>`;
    let body = '';
    if (p.type === 'mc') {
      body = `<div class="choices" role="group" aria-label="보기">${p.choices.map((c, k) => {
        let cls = '';
        if (u.done) { if (k === p.ans) cls = 'is-right'; else if (k === u.pick) cls = 'is-wrong'; }
        return `<button class="choice ${cls}" data-act="mc-pick" data-pid="${p.id}" data-i="${k}" aria-pressed="${u.pick === k}" ${u.done ? 'disabled' : ''}><span class="letter">${k + 1}</span><span class="ctext">${inline(c)}</span></button>`;
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
    const hint = !u.done && u.hint ? `<p class="hint"><b>힌트</b> ${inline(p.hint)}</p>` : '';
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
      <div class="prob-main">${tags}<div class="prob-q">${md(p.q)}</div>${body}${actions}${hint}${fb}</div>
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
    el.replaceWith(next);
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
        `<button class="choice" data-act="ex-pick" data-pid="${p.id}" data-i="${k}" aria-pressed="${a === k}"><span class="letter">${k + 1}</span><span class="ctext">${inline(c)}</span></button>`).join('')}</div>`;
    } else if (p.type === 'num') {
      body = `<div class="answer-row"><label class="sr-only" for="ex-${p.id}">답 입력</label>
        <input id="ex-${p.id}" data-pid="${p.id}" data-role="ex-num" autocomplete="off" spellcheck="false" placeholder="답 입력 (예: 3/2, 2*pi, e^2)" value="${esc(a ?? '')}"></div>
        <div class="preview" id="pv-${p.id}">${previewText(p, a)}</div>`;
    } else {
      body = `<label class="sr-only" for="ex-${p.id}">풀이</label><textarea class="scratch" id="ex-${p.id}" data-pid="${p.id}" data-role="ex-open" placeholder="풀이와 답을 적으세요. 제출 후 모범 풀이와 비교해 직접 채점합니다.">${esc(a ?? '')}</textarea>`;
    }
    return `<article class="prob" id="q-${o.k + 1}" data-pid="${p.id}">
      <div class="prob-no">${o.k + 1}<small class="pts">${L.pts[p.id]}점</small></div>
      <div class="prob-main"><div class="prob-tags"><span class="chip">${TYPE[p.type]}</span><span class="chip">${esc(chById.get(p.ch) ? chById.get(p.ch).title : '')}</span></div>
      <div class="prob-q">${md(p.q)}</div>${body}</div>
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
        return `<button class="choice ${cls}" disabled aria-pressed="${it.resp === k}"><span class="letter">${k + 1}</span><span class="ctext">${inline(c)}</span></button>`;
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
    const rubric = p.rubric ? `<div class="blk blk-thm"><div class="blk-label">Rubric<em>채점 기준</em></div>${md(p.rubric)}</div>` : '';
    const got = it.got === null ? '—' : it.got;
    return `<article class="prob" id="r-${p.id}">
      <div class="prob-no">${o.k + 1}<small class="pts">${got} / ${it.pts}점</small></div>
      <div class="prob-main"><div class="prob-tags"><span class="chip">${TYPE[p.type]}</span><span class="chip">${esc(chById.get(p.ch) ? chById.get(p.ch).title : '')}</span></div>
      <div class="prob-q">${md(p.q)}</div>${body}${verdict}
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
      <p class="hero-sum">${inline(c.tagline)}</p>
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
        <div class="section-head"><div><span class="caps">How to study</span><h2>읽고, 풀고, 시험처럼 점검하기</h2></div>
          <p class="lede">한 단원은 개념 정리 → 연습문제 → 모의고사 순서로 공부하도록 짜여 있습니다. 틀린 문제는 오답노트에 자동으로 모입니다.</p></div>
        <div class="modes">
          <div class="mode"><div class="step"><b>1</b><span class="caps">Learn</span></div><h3>개념 정리</h3>
            <p>정의와 풀이법을 시험에 나오는 형태로 정리했습니다. 핵심 공식 상자마다 증명이 연결되어 있고, 증명 ${PROOFS.length}개는 따로 검색할 수 있습니다.</p>
            <div class="btn-row" style="gap:22px"><a class="link-u ko" href="#${CH[0].id}" data-route="${CH[0].id}">1단원부터 읽기</a><a class="link-u ko" href="#proofs" data-route="proofs">증명 찾기</a></div></div>
          <div class="mode"><div class="step"><b>2</b><span class="caps">Practice</span></div><h3>연습문제</h3>
            <p>객관식·단답형은 바로 채점되고, 서술형은 모범 풀이와 비교해 스스로 채점합니다. 단답형은 <code>3/2</code>, <code>2*pi</code>, <code>1+2i</code>처럼 식으로 입력합니다.</p>
            <a class="link-u ko" href="#${CH[0].id}-practice" data-route="${CH[0].id}-practice">연습문제 풀기</a></div>
          <div class="mode"><div class="step"><b>3</b><span class="caps">Examine</span></div><h3>실전 모의고사</h3>
            <p>시간 제한이 있는 모의고사 ${EXAMS.length}회와, 고른 단원에서 문제를 뽑아 만드는 맞춤 모의고사로 실전 감각을 점검합니다.</p>
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
        <div class="section-head"><div><span class="caps">The chapters</span><h2>${CH.length}개 단원</h2></div>
          <p class="lede">그림은 각 단원을 대표하는 곡선입니다. 방향장, 감쇠진동, 상평면, 베셀 함수, 계단 응답 등 단원에서 직접 다루는 함수를 그렸습니다.</p></div>
        ${Object.keys(PARTS).map((k) => `
          <div class="part-block">
            <div class="part-head"><span class="part-letter">${k}</span><h3>${esc(PARTS[k].name)}</h3><p>${esc(PARTS[k].desc)}</p></div>
            <div class="tiles">${CH.filter((x) => x.part === k).map(tileHTML).join('')}</div>
          </div>`).join('')}
      </div>
    </section>

    <section class="band section">
      <div class="wrap">
        <div class="section-head"><div><span class="caps">Mock examinations</span><h2>실전 모의고사</h2></div>
          <p class="lede">중간·기말고사 범위에 맞춘 시간 제한 시험입니다. 제출하면 자동 채점과 단원별 분석을 보여줍니다.</p></div>
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

  let filters = Object.assign({ lv: 'all', type: 'all', st: 'all' }, S.prefs.filters || {});
  function viewChapter(c, tab) {
    S.prefs.lastCh = c.id;
    save();
    const s = chStats(c);
    const i = CH.indexOf(c);
    const prev = CH[i - 1], next = CH[i + 1];
    let body = '';
    if (tab === 'learn') {
      body = `<div class="ch-body">
        <nav class="toc" aria-label="단원 목차"><span class="caps">Contents</span>
          ${c.sections.map((sec, k) => `<a href="#${c.id}" data-act="scroll" data-target="sec-${k + 1}"><span>${c.n}.${k + 1}</span>${esc(sec.title)}</a>`).join('')}
        </nav>
        <article class="prose">
          ${c.sections.map((sec, k) => `<section class="sec" id="sec-${k + 1}"><div class="sec-title"><span>${c.n}.${k + 1}</span><h2>${esc(sec.title)}</h2></div>${md(sec.body)}</section>`).join('')}
          <div class="sec"><div class="btn-row"><a class="btn" href="#${c.id}-practice" data-route="${c.id}-practice">연습문제 ${c.problems.length}개 풀기</a><a class="btn ghost" href="#${c.id}-formulas" data-route="${c.id}-formulas">핵심 공식만 보기</a></div></div>
        </article>
      </div>`;
    } else if (tab === 'practice') {
      body = practiceBody(c);
    } else if (tab === 'formulas') {
      const keys = keyBlocks(c);
      body = `<div class="section tight" style="padding-top:40px"><div class="sheet">${keys.map((k) => `
        <div class="sheet-item"><span class="caps">${esc(k.sec)}</span><h4>${inline(k.title)}</h4><div class="body">${md(k.body)}</div>${proofLinks(k.title)}</div>`).join('')}</div></div>`;
    } else if (tab === 'proofs') {
      const list = PROOFS.filter((p) => p.ch === c.id);
      body = `<div class="section tight" style="padding-top:40px">
        <p class="lede" style="margin-bottom:24px">이 단원의 공식과 정리 ${list.length}개의 증명입니다. 다른 단원까지 검색하려면 <a href="#proofs" data-route="proofs">증명 찾기</a>를 쓰세요.</p>
        <div class="pf-list">${list.map(proofCard).join('')}</div></div>`;
    }
    return `
    <section class="ch-hero">
      <div class="ch-plate"><canvas data-plot="${c.plot}" aria-hidden="true"></canvas><span class="plate-num" aria-hidden="true">${pad(c.n)}</span><span class="plate-cap caps">Fig. ${esc(c.fig)}</span></div>
      <div class="ch-intro">
        <span class="caps">Chapter ${pad(c.n)} · Part ${c.part} ${esc(PARTS[c.part].name)}</span>
        <h1>${esc(c.title)}</h1>
        <span class="en">${esc(c.en)}</span>
        <p>${inline(c.summary)}</p>
        <ul class="goals">${c.goals.map((g) => `<li><span>${inline(g)}</span></li>`).join('')}</ul>
        <div class="ch-meta"><span>교재 <b>${esc(c.ref)}</b></span><span>개념 <b>${c.sections.length}</b></span><span>연습문제 <b>${c.problems.length}</b></span><span>정답 <b class="tabular" data-ch-right>${s.right}/${s.total}</b></span></div>
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
  function filtered(list) {
    return list.filter((p) => {
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
    const list = filtered(c.problems);
    return `
      <div class="practice-head">
        <div style="display:grid;gap:6px"><span class="caps" style="color:var(--camel-ink)">Exercises</span>
          <p class="tally" data-tally="${c.id}">${tallyText(c)}</p></div>
        <div class="filters">
          ${seg('lv', [['all', '전체'], ['1', '기초'], ['2', '표준'], ['3', '심화']])}
          ${seg('type', [['all', '모든 유형'], ['mc', '객관식'], ['num', '단답형'], ['open', '서술형']])}
          ${seg('st', [['all', '전체'], ['todo', '안 푼 문제'], ['wrong', '틀린 문제']])}
        </div>
      </div>
      <div class="problems">
        ${list.length ? list.map((p) => withOpts(probHTML(p, { ctx: 'practice' }), {})).join('')
          : `<div class="empty"><b>Voilà</b><p>조건에 맞는 문제가 없습니다. 필터를 바꿔 보세요.</p></div>`}
      </div>`;
  }
  function updateTally() {
    $$('[data-tally]').forEach((el) => { const c = chById.get(el.dataset.tally); if (c) el.innerHTML = tallyText(c); });
    $$('[data-ch-right]').forEach((el) => { const c = chById.get(route.slice(0, 4)); if (c) { const s = chStats(c); el.textContent = `${s.right}/${s.total}`; } });
  }

  // ---------- proofs ----------
  function proofSearchText(p) {
    const c = chById.get(p.ch);
    return normText([p.title, p.tags, p.stmt, (p.keys || []).join(' '), c.title, c.en, `${c.n}단원`].join(' '));
  }
  function proofCard(p) {
    const c = chById.get(p.ch);
    return `<a class="pf-item" href="#pf-${p.pid}" data-route="pf-${p.pid}" data-pf-ch="${p.ch}" data-pf-text="${esc(proofSearchText(p))}">
      <span class="pf-ch"><b>${pad(c.n)}</b>${esc(c.title)}</span>
      <span class="pf-title">${inline(p.title)}${p.sketch ? ' <span class="chip">개요</span>' : ''}</span>
      <span class="pf-stmt">${md(p.stmt)}</span>
    </a>`;
  }
  let pfFilter = { q: S.prefs.pfq || '', ch: 'all' };
  function viewProofs() {
    return `
    <div class="wrap">
      <header class="page-head"><span class="caps">Proofs</span><h1>Démonstrations<span class="ko">증명 찾기</span></h1>
        <p class="lede">단원에 나오는 공식과 정리 ${PROOFS.length}개의 증명을 모았습니다. 공식 이름, 사람 이름, 영어 용어로 검색할 수 있습니다. 예: 라플라스 합성곱, 코시, Green, 파세발, 고유값.</p>
        <div class="pf-search">
          <label class="sr-only" for="pf-q">증명 검색</label>
          <input id="pf-q" type="search" autocomplete="off" spellcheck="false" placeholder="찾을 공식이나 정리 (예: 매개변수 변환법, residue)" value="${esc(pfFilter.q)}">
          <span class="pf-count" id="pf-count" aria-live="polite"></span>
        </div>
        <div class="jump" role="group" aria-label="단원으로 거르기">
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
      const ok = (pfFilter.ch === 'all' || el.dataset.pfCh === pfFilter.ch) && terms.every((t) => el.dataset.pfText.includes(t));
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
          <h1>${inline(p.title)}</h1>
        </header>
        <div class="blk blk-key"><div class="blk-label">Statement<em>명제</em></div>${md(p.stmt)}</div>
        <div class="prose pf-body">
          <div class="blk-label pf-label">Proof<em>증명</em></div>
          ${p.sketch ? `<p class="pf-sketch">${inline(p.sketch === true ? '엄밀한 증명은 길어 핵심 아이디어만 보입니다.' : p.sketch)}</p>` : ''}
          ${md(p.body)}
          <p class="qed" aria-label="증명 끝">∎</p>
        </div>
        ${(p.keys || []).length ? `<p class="pf-rel">관련 공식: ${p.keys.map((k) => `<a href="#${c.id}-formulas" data-route="${c.id}-formulas">${inline(k)}</a>`).join(' · ')}</p>` : ''}
      </article>
    </div>
    <nav class="ch-next" aria-label="증명 이동">
      ${prev ? `<a href="#pf-${prev.pid}" data-route="pf-${prev.pid}"><span class="caps">← 이전 증명</span><span>${inline(prev.title)}</span></a>` : `<a href="#${c.id}" data-route="${c.id}"><span class="caps">← 단원으로</span><span>${esc(c.title)} 개념 정리</span></a>`}
      ${next ? `<a href="#pf-${next.pid}" data-route="pf-${next.pid}"><span class="caps">다음 증명 →</span><span>${inline(next.title)}</span></a>` : `<a href="#proofs" data-route="proofs"><span class="caps">증명 찾기 →</span><span>다른 증명 검색하기</span></a>`}
    </nav>
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
                <h3 style="font-family:var(--f-serif);font-size:1.2rem;margin-bottom:16px"><span class="num-display" style="margin-right:12px">${pad(c.n)}</span><a href="#${c.id}" data-route="${c.id}" style="text-decoration:none">${esc(c.title)}</a></h3>
                <div class="sheet">${keyBlocks(c).map((b) => `<div class="sheet-item"><span class="caps">${esc(b.sec)}</span><h4>${inline(b.title)}</h4><div class="body">${md(b.body)}</div>${proofLinks(b.title)}</div>`).join('')}</div>
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
        <p class="lede">시험 범위에 맞춘 모의고사 ${EXAMS.length}회와 맞춤 모의고사가 있습니다. 시작하면 타이머가 돌아가고, 시간이 끝나면 자동으로 제출됩니다. 서술형은 제출 뒤 모범 풀이와 채점 기준을 보고 직접 채점합니다.</p>
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
                <h3>${esc(x.title)}</h3>
                <p>${esc(x.desc)}</p>
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
  function go(to, opts) {
    if (to !== route) {
      try { history.pushState(null, '', '#' + to); } catch (e) { /* sandboxed: keep in-page state only */ }
    }
    render(to, opts || {});
  }
  function render(to, opts) {
    const prevRoute = route;
    route = to;
    stopHero();
    let m;
    let view = 'page';
    let html = '';
    if (to === 'home') { view = 'home'; html = viewHome(); }
    else if ((m = /^(ch\d{2})(?:-(practice|formulas|proofs))?$/.exec(to)) && chById.get(m[1])) { view = 'chapter'; html = viewChapter(chById.get(m[1]), m[2] || 'learn'); }
    else if (to === 'formulas') html = viewFormulas();
    else if (to === 'proofs') html = viewProofs();
    else if ((m = /^pf-(ch\d{2}-[\w-]+)$/.exec(to)) && proofById.get(m[1])) html = viewProof(proofById.get(m[1]));
    else if (to === 'exams') html = viewExams();
    else if (to === 'exam-live' && S.live) { view = 'exam-live'; html = viewExamLive(); }
    else if (to === 'exam-live') { route = 'exams'; html = viewExams(); }
    else if ((m = /^result-([a-z0-9]+)$/.exec(to))) html = viewResult(m[1]);
    else if (to === 'review') html = viewReview();
    else { route = 'home'; view = 'home'; html = viewHome(); }
    document.body.dataset.view = view;
    main.innerHTML = html;
    $('#drawer-root').innerHTML = '';
    updateHeader();
    window.EMPlots.mount(main);
    if (view === 'home') startHero();
    if (view === 'chapter') watchToc();
    if (route === 'proofs') filterProofs();
    const title = { home: '', formulas: '공식집', proofs: '증명 찾기', exams: '모의고사', review: '오답노트', 'exam-live': '시험 중' };
    const ch = chById.get(route.slice(0, 4));
    const pf = route.startsWith('pf-') && proofById.get(route.slice(3));
    document.title = pf ? `${pf.title.replace(/\$/g, '')} · 증명` : view === 'chapter' && ch ? `${ch.title} · Équation 공학수학` : title[route] ? `${title[route]} · Équation 공학수학` : 'Équation 공학수학';
    const samePage = prevRoute.slice(0, 4) === route.slice(0, 4) && view === 'chapter';
    if (opts.keepScroll != null) window.scrollTo(0, opts.keepScroll);
    else if (samePage) {
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
    const a = e.target.closest('a[data-route]');
    if (a && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      go(a.dataset.route);
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
      case 'menu': openDrawer(); break;
      case 'menu-close': $('#drawer-root').innerHTML = ''; break;
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
      case 'filter': {
        filters[t.dataset.k] = t.dataset.v;
        S.prefs.filters = filters;
        save();
        render(route, { keepScroll: window.scrollY });
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
    if (e.key === 'Escape') { closeModal(); $('#drawer-root').innerHTML = ''; }
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

  renderHeader();
  if (S.live && S.live.minutes * 60 - (Date.now() - S.live.start) / 1000 <= 0) { route = 'exams'; submitExam(true); }
  else render(parseHash(), {});
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => window.EMPlots.redrawAll());
})();
