/* Équation 허브: 분야 목록, 연결 지도, 전체 찾기, 분야별 진도. 데이터는 core/net.js · net-index.js · net-search.js */
(function () {
  'use strict';
  const NET = window.NET || { fields: [], groups: [], index: {}, links: [], search: {} };
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const FIELDS = NET.fields.filter((f) => f.live);
  const byId = Object.fromEntries(FIELDS.map((f) => [f.id, f]));
  const url = (f, route) => `${f.path}index.html${route ? `#${route}` : ''}`;

  // old deep links of the engineering-math site (#ch05-k6.2, #pf-…, #formulas …) now live in em/
  if (/^#(ch\d{2}|pf-|formulas|proofs|exams|review|exam-|result-)/.test(location.hash) && byId.em) {
    location.replace(url(byId.em) + location.hash);
    return;
  }

  // ---------- progress (each field keeps its own localStorage key; same origin, so the hub can read them) ----------
  function progressOf(f) {
    try {
      const d = JSON.parse(localStorage.getItem(f.key) || 'null');
      if (!d || !d.prog) return 0;
      return Object.keys(d.prog).filter((k) => d.prog[k].s === 'right' && /-p\d+$/.test(k)).length;
    } catch (e) { return 0; }
  }
  const counts = (f) => (NET.index[f.id] && NET.index[f.id].counts) || { units: 0, sections: 0, problems: 0, proofs: 0, exams: 0 };

  // ---------- header ----------
  const netName = (f) => (f.tiny && f.tiny !== f.short ? `<span class="nf-l">${esc(f.short)}</span><span class="nf-s">${esc(f.tiny)}</span>` : esc(f.short));
  function header() {
    const groups = NET.groups.map((g) => Object.assign({}, g, { fields: FIELDS.filter((f) => f.group === g.id) })).filter((g) => g.fields.length);
    const right = FIELDS.reduce((s, f) => s + progressOf(f), 0);
    const total = FIELDS.reduce((s, f) => s + counts(f).problems, 0);
    return `<div class="netbar"><div class="wrap netbar-row">
        <a class="net-home" aria-current="page">${esc(NET.mark)}</a>
        <nav class="net-fields" aria-label="분야">${groups.map((g) => `<span class="net-group">${g.fields.map((f) => `<a href="${esc(url(f))}">${netName(f)}</a>`).join('<i class="net-dot" aria-hidden="true">·</i>')}</span>`).join('')}</nav>
      </div></div>
      <div class="wrap header-row">
        <nav class="nav nav-left" aria-label="허브 메뉴">
          <a href="#fields" class="ko">분야</a>
          <a href="#map" class="ko hide-sm">연결 지도</a>
          <a href="#find" class="ko">찾기</a>
        </nav>
        <a class="wordmark" href="#top" aria-label="Équation 처음으로"><b>${esc(NET.mark)}</b><span>Notes de mathématiques</span></a>
        <nav class="nav nav-right" aria-label="진도"><span class="progress-pill" title="모든 분야의 연습문제 정답 수">정답 ${right}/${total}</span></nav>
      </div>`;
  }

  // ---------- hero ----------
  function hero() {
    const tot = FIELDS.reduce((a, f) => { const c = counts(f); a.u += c.units; a.p += c.problems; a.pf += c.proofs; return a; }, { u: 0, p: 0, pf: 0 });
    const nLinks = NET.links.length;
    return `<section class="hub-hero" id="top">
      <div class="wrap hub-hero-top">
        <div class="hub-hero-title">
          <span class="caps">Notes de mathématiques · 수학 노트</span>
          <h1><span class="num-display">Équation</span></h1>
        </div>
        <div class="hub-hero-copy">
          <p class="hub-lede">공학과 인공지능을 위한 수학 노트입니다. 분야마다 교재와 강의의 순서를 그대로 따라가고, 분야와 분야 사이는 <b>연결 주석</b>으로 이어집니다. 모르는 도구가 나오면 그 자리에서 기초 수학으로 건너갔다가 돌아오면 됩니다.</p>
          <dl class="hub-figures">
            <div><dt>분야</dt><dd>${FIELDS.length}</dd></div>
            <div><dt>단원</dt><dd>${tot.u}</dd></div>
            <div><dt>연습문제</dt><dd>${tot.p}</dd></div>
            <div><dt>증명</dt><dd>${tot.pf}</dd></div>
            <div><dt>분야 사이 연결</dt><dd>${nLinks}</dd></div>
          </dl>
        </div>
      </div>
      <div class="wrap">
        <figure class="hub-map" id="map" aria-label="분야 사이의 연결 지도">
          <div class="hub-map-scroll">${mapSVG()}</div>
          <figcaption>연결 지도 — 선 하나가 한 절에서 다른 분야의 절로 가는 연결 주석이고, 굵을수록 같은 단원 사이의 연결이 많습니다. 점에 마우스를 올리면 그 단원의 연결만 남고, 누르면 그 단원으로 갑니다.</figcaption>
        </figure>
      </div>
    </section>`;
  }

  // columns = groups of the network (fields of one group stack in one column), nodes = units, curves = cross-field links
  function mapSVG() {
    const W = 1180, H = 780, top = 72, bottom = 20, edge = 120;
    const groups = NET.groups.map((g) => ({ g, fields: FIELDS.filter((f) => f.group === g.id) })).filter((c) => c.fields.length);
    const cols = groups.map((c, i) => Object.assign(c, { x: groups.length === 1 ? W / 2 : edge + (i * (W - 2 * edge)) / (groups.length - 1), last: i === groups.length - 1 }));
    const pos = {};
    const subs = [];
    cols.forEach((c) => {
      const multi = c.fields.length > 1;
      // slots: a small header before each field when the column holds several, and a blank slot between fields
      const slots = [];
      c.fields.forEach((f, fi) => {
        if (multi) { if (fi) slots.push(null); slots.push({ head: f }); }
        Object.keys((NET.index[f.id] || {}).chapters || {}).sort().forEach((ch, j) => slots.push({ f, ch, n: j + 1 }));
      });
      const step = slots.length > 1 ? (H - top - bottom) / (slots.length - 1) : 0;
      slots.forEach((s, j) => {
        if (!s) return;
        const y = slots.length === 1 ? (top + H - bottom) / 2 : top + j * step;
        if (s.head) subs.push({ x: c.x, y, f: s.head, last: c.last });
        else pos[`${s.f.id}:${s.ch}`] = { x: c.x, y, f: s.f, ch: s.ch, n: s.n, title: NET.index[s.f.id].chapters[s.ch], last: c.last };
      });
    });
    const agg = new Map();
    NET.links.forEach((l) => {
      const a = `${l.from}:${l.fromCh}`, b = `${l.to}:${l.toCh}`;
      if (!pos[a] || !pos[b]) return;
      const k = `${a}>${b}`;
      agg.set(k, (agg.get(k) || 0) + 1);
    });
    const curves = [...agg.entries()].map(([k, n]) => {
      const [a, b] = k.split('>');
      const p = pos[a], q = pos[b];
      let d;
      if (Math.abs(q.x - p.x) < 1) {
        // two fields in the same column: an arc out to the free side
        const out = Math.min(40 + Math.abs(q.y - p.y) * 0.3, 110) * (p.last ? 1 : -1);
        d = `M${p.x},${p.y} C${p.x + out},${p.y} ${q.x + out},${q.y} ${q.x},${q.y}`;
      } else {
        const dx = (q.x - p.x) * 0.5;
        const far = Math.abs(q.x - p.x) > (W - 2 * edge) * 0.75; // skipping a column: pull the curve toward the middle band
        const bow = far ? (H / 2 - (p.y + q.y) / 2) * 0.6 : 0;
        d = `M${p.x},${p.y} C${p.x + dx},${p.y + bow} ${q.x - dx},${q.y + bow} ${q.x},${q.y}`;
      }
      return `<path class="lk f-${p.f.id}" data-a="${a}" data-b="${b}" stroke-width="${Math.min(0.9 + 0.55 * n, 3.4).toFixed(2)}" d="${d}"/>`;
    }).join('');
    const heads = cols.map((c) => {
      const one = c.fields.length === 1 ? c.fields[0] : null;
      const anchor = c.last ? 'end' : 'middle', hx = c.last ? c.x + 8 : c.x;
      return `<text class="colhead" x="${hx}" y="24" text-anchor="${anchor}">${esc(one ? one.mark : (c.g.fr || c.g.en).toUpperCase())}</text><text class="colsub" x="${hx}" y="44" text-anchor="${anchor}">${esc(one ? one.short : c.g.name)}</text>`;
    }).join('');
    const subheads = subs.map((s) => `<text class="colpart f-${s.f.id}" x="${s.last ? s.x + 8 : s.x - 8}" y="${s.y + 4}" text-anchor="${s.last ? 'end' : 'start'}">${esc(s.f.mark)} · ${esc(s.f.short)}</text>`).join('');
    const nodes = Object.keys(pos).map((k) => {
      const p = pos[k];
      const side = p.last ? 'end' : 'start';
      const tx = p.last ? p.x - 12 : p.x + 12;
      return `<a href="${esc(url(p.f, p.ch))}" class="nd-link" data-node="${k}"><title>${esc(p.f.short)} · ${pad(p.n)} ${esc(p.title)}</title>
        <circle class="nd f-${p.f.id}" cx="${p.x}" cy="${p.y}" r="5.5"/><text class="ndl" x="${tx}" y="${p.y + 4}" text-anchor="${side}"><tspan class="nn">${pad(p.n)}</tspan><tspan class="nt"> ${esc(p.title)}</tspan></text></a>`;
    }).join('');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="분야별 단원과 분야 사이 연결 주석의 지도">${heads}${subheads}<g class="lks">${curves}</g>${nodes}</svg>`;
  }

  // ---------- fields ----------
  function fieldsSection() {
    const all = NET.fields;
    return `<section class="hub-fields" id="fields"><div class="wrap">
      <div class="section-head"><div><span class="caps">Les domaines</span><h2>분야</h2></div>
        <p class="lede">분야마다 개념 정리, 연습문제, 증명, 모의고사가 따로 있고 진도도 따로 저장됩니다. 색이 다른 것은 서로 다른 노트라는 표시입니다.</p></div>
      ${NET.groups.map((g) => {
        const fs = all.filter((f) => f.group === g.id);
        if (!fs.length) return '';
        return `<div class="hub-group">
          <div class="hub-group-head"><span class="caps">${esc(g.en)}</span><h3>${esc(g.name)}</h3><p>${esc(g.desc)}</p></div>
          <div class="hub-cards">${fs.map(card).join('')}</div>
        </div>`;
      }).join('')}
    </div></section>`;
  }
  function card(f) {
    if (!f.live) {
      return `<div class="hub-card soon" data-field="${f.id}"><div class="hub-card-plate"></div><div class="hub-card-body">
        <b class="mark">${esc(f.mark)}</b><h4>${esc(f.name)}</h4><p>${esc(f.desc)}</p><span class="caps soon-tag">준비 중</span></div></div>`;
    }
    const c = counts(f), r = progressOf(f);
    const pct = c.problems ? Math.round((100 * r) / c.problems) : 0;
    return `<a class="hub-card" href="${esc(url(f))}" data-field="${f.id}">
      <div class="hub-card-plate"><canvas data-plot="${esc(f.plot)}" aria-hidden="true"></canvas></div>
      <div class="hub-card-body">
        <b class="mark">${esc(f.mark)}</b>
        <h4>${esc(f.name)}</h4>
        <p>${esc(f.desc)}</p>
        <ul class="hub-card-facts"><li><b>${c.units}</b>단원</li><li><b>${c.sections}</b>절</li><li><b>${c.problems}</b>문제</li><li><b>${c.proofs}</b>증명</li></ul>
        <div class="hub-meter" role="img" aria-label="연습문제 ${c.problems}개 중 ${r}개 정답"><i style="width:${pct}%"></i></div>
        <span class="hub-go">정답 ${r}/${c.problems} · 들어가기 →</span>
      </div>
    </a>`;
  }

  // ---------- foundations in use ----------
  function usedSection() {
    const base = byId.base;
    if (!base) return '';
    const ix = NET.index.base || { secs: {} };
    const uses = {};
    NET.links.filter((l) => l.to === 'base').forEach((l) => {
      const k = `${l.toCh}:${l.toK}`;
      (uses[k] = uses[k] || []).push(l);
    });
    const rows = Object.keys(ix.secs).map((k) => {
      const [ch, sk] = k.split(':');
      const list = uses[k] || [];
      const per = {};
      list.forEach((l) => { per[l.from] = (per[l.from] || 0) + 1; });
      return `<li><a href="${esc(url(base, `${ch}-k${sk}`))}"><span class="num-text">§${esc(sk)}</span><span class="t">${esc(ix.secs[k])}</span>
        <span class="u">${Object.keys(per).length ? Object.keys(per).map((id) => `${esc((byId[id] || { short: id }).short)} ${per[id]}`).join(' · ') : '<i>아직 연결 없음</i>'}</span></a></li>`;
    }).join('');
    return `<section class="hub-used" id="basics"><div class="wrap">
      <div class="section-head"><div><span class="caps">Fondements</span><h2>기초 개념이 쓰이는 곳</h2></div>
        <p class="lede">다른 분야가 설명 없이 가져다 쓰는 도구들입니다. 오른쪽 숫자는 그 개념으로 가는 연결 주석이 몇 개인지입니다. 절을 열면 끝에 ‘이 개념을 쓰는 곳’ 목록이 있습니다.</p></div>
      <ol class="used-list">${rows}</ol>
    </div></section>`;
  }

  // ---------- find across fields ----------
  const KIND = { u: '단원', s: '절', k: '핵심 공식', p: '증명' };
  const norm = (s) => String(s || '').toLowerCase().replace(/\\([a-z]+)/g, '$1').replace(/[\s{}$^_\\()[\],.·:;'"`~!?=+*/|<>–—-]/g, '');
  const ENTRIES = [];
  Object.keys(NET.search || {}).forEach((fid) => {
    const f = byId[fid];
    if (!f) return;
    const chs = (NET.index[fid] || {}).chapters || {};
    NET.search[fid].forEach((e) => ENTRIES.push(Object.assign({ fid, key: norm(`${e.title} ${e.en || ''} ${e.tags || ''} ${chs[e.ch] || ''}`) }, e)));
  });
  function findSection() {
    return `<section class="hub-find" id="find"><div class="wrap">
      <div class="section-head"><div><span class="caps">Chercher</span><h2>모든 분야에서 찾기</h2></div>
        <p class="lede">단원·절 제목, 핵심 공식 상자, 증명을 분야를 가리지 않고 찾습니다. 한글 이름과 영어 용어 모두 됩니다. 예: 테일러, 연쇄법칙, Jensen, 라플라스, 헤시안.</p></div>
      <div class="pf-search"><label class="sr-only" for="hub-q">찾을 개념</label>
        <input id="hub-q" type="search" autocomplete="off" spellcheck="false" placeholder="찾을 개념이나 정리 (예: 테일러, chain rule, 코시)">
        <span class="pf-count" id="hub-count">${ENTRIES.length}개 항목</span></div>
      <ol class="hub-results" id="hub-results"></ol>
    </div></section>`;
  }
  function renderResults(q) {
    const box = $('#hub-results'), cnt = $('#hub-count');
    const terms = norm(q) ? q.split(/\s+/).map(norm).filter(Boolean) : [];
    if (!terms.length) { box.innerHTML = ''; cnt.textContent = `${ENTRIES.length}개 항목`; return; }
    const hits = ENTRIES.filter((e) => terms.every((t) => e.key.includes(t)));
    const rank = { u: 0, s: 1, k: 2, p: 3 };
    hits.sort((a, b) => (rank[a.t] - rank[b.t]) || a.fid.localeCompare(b.fid));
    cnt.textContent = `${hits.length}개 찾음`;
    box.innerHTML = hits.slice(0, 40).map((e) => {
      const f = byId[e.fid];
      const route = e.t === 'p' ? `pf-${e.pid}` : e.k ? `${e.ch}-k${e.k}` : e.ch;
      const where = `${pad(e.ch.slice(2))} ${(NET.index[e.fid].chapters || {})[e.ch] || ''}${e.k && e.t !== 'u' ? ` · §${e.k}` : ''}`;
      return `<li><a href="${esc(url(f, route))}"><span class="kind" data-f="${e.fid}">${esc(f.short)} · ${KIND[e.t]}</span><b>${esc(e.title.replace(/\$/g, ''))}</b><small>${esc(where)}</small></a></li>`;
    }).join('') + (hits.length > 40 ? `<li class="more">그 밖에 ${hits.length - 40}개. 검색어를 더 적어 보세요.</li>` : '');
  }

  function footer() {
    return `<footer class="site-footer"><div class="wrap">
      <div class="footer-grid">
        <div><h5 class="caps">Équation</h5><p>공학수학(Kreyszig 10판), 심층 신경망의 수학적 기초 강의, 의료 인공지능 및 소프트웨어 시스템 강의(Bishop 교재), 그리고 이들이 전제로 쓰는 미적분·해석학을 정리한 시험 대비 노트입니다. 설명과 문제는 교재와 강의의 구성을 따라 새로 썼습니다.</p></div>
        <div><h5 class="caps">분야</h5>${FIELDS.map((f) => `<p><a href="${esc(url(f))}">${esc(f.name)}</a></p>`).join('')}</div>
        <div><h5 class="caps">기록</h5><p>풀이 기록과 점수는 분야별로 지금 쓰는 브라우저에만 저장됩니다. 지우려면 각 분야 아래쪽의 ‘기록 모두 지우기’를 쓰세요.</p></div>
      </div>
      <div class="footer-base caps"><span>Équation · Notes de mathématiques</span><span>${FIELDS.map((f) => esc(f.mark)).join(' · ')}</span></div>
    </div></footer>`;
  }

  // ---------- mount ----------
  document.documentElement.classList.add('has-net');
  document.body.dataset.view = 'hub';
  $('#site-header').innerHTML = header();
  $('#main').innerHTML = hero() + fieldsSection() + usedSection() + findSection() + footer();
  if (window.EMPlots) {
    window.EMPlots.mount($('#main'));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => window.EMPlots.redrawAll());
    if (window.matchMedia) {
      const mq = matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', () => window.EMPlots.redrawAll());
    }
  }
  const q = $('#hub-q');
  q.addEventListener('input', () => renderResults(q.value));

  // map: hovering or focusing a unit keeps only its links lit
  const map = $('#map svg');
  const light = (key) => {
    map.classList.toggle('focus', !!key);
    map.querySelectorAll('.lk').forEach((p) => p.classList.toggle('on', !!key && (p.dataset.a === key || p.dataset.b === key)));
    map.querySelectorAll('.nd-link').forEach((n) => n.classList.toggle('on', n.dataset.node === key));
  };
  map.querySelectorAll('.nd-link').forEach((n) => {
    n.addEventListener('mouseenter', () => light(n.dataset.node));
    n.addEventListener('focus', () => light(n.dataset.node));
    n.addEventListener('mouseleave', () => light(null));
    n.addEventListener('blur', () => light(null));
  });
  const onScroll = () => document.body.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
