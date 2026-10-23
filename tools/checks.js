/* 헤드리스 Chrome으로 tools/test.html을 열어 --dump-dom 결과의 RESULT 줄을 봅니다.
   KaTeX 오류, 남은 $ 기호, 정답 형식, 증명↔공식 상자 연결, 연결 주석 대상, 모든 라우트를 확인합니다. */
(function () {
  const out = [];
  let bad = 0;
  const log = (s) => out.push(s);
  const fail = (s) => { bad++; log('FAIL ' + s); };
  const A = window.__APP;
  const box = document.createElement('div');
  box.style.cssText = 'position:absolute;left:-99999px;top:0;width:900px';
  document.body.appendChild(box);

  function checkHTML(html, where) {
    box.innerHTML = html;
    const errs = box.querySelectorAll('.katex-error');
    errs.forEach((e) => fail(`katex ${where}: ${(e.getAttribute('title') || e.textContent).slice(0, 160)}`));
    // an unknown command rendered as literal red text (e.g. a middle dot inside a text block)
    box.querySelectorAll('.katex-html').forEach((k) => { if (k.textContent.includes('\\')) fail(`katex literal backslash ${where}: ${k.textContent.slice(0, 80)}`); });
    // an unknown command rendered as literal red text (e.g. a middle dot inside a text block)
    box.querySelectorAll(".katex-html").forEach((k) => { if (k.textContent.includes("\\")) fail(`katex literal backslash ${where}: ${k.textContent.slice(0, 80)}`); });
    // a TeX command without its backslash (a plain JS string or template ate it: `\mathbf` → `mathbf`) renders as italic letters
    box.querySelectorAll('annotation').forEach((a) => {
      const m = /(^|[^\\A-Za-z{])(mathbf|mathrm|lVert|rVert|lvert|rvert|partial|alpha|theta|lambda|sigma|cdot|frac|sqrt|times)(?![A-Za-z])/.exec(a.textContent);
      if (m) fail(`TeX command lost its backslash ${where}: ${a.textContent.slice(0, 80)}`);
    });
    // leftover $ outside code/inputs means a math delimiter was not paired
    box.querySelectorAll('code, textarea, input, script, .katex-mathml').forEach((n) => n.remove());
    const txt = box.textContent;
    if (/\$/.test(txt)) fail(`leftover $ ${where}: ${txt.match(/.{0,40}\$.{0,40}/)[0]}`);
    if (/\bundefined\b|\bNaN\b/.test(txt)) fail(`undefined/NaN text ${where}`);
    // a leftover [[ outside rendered math means a cross-reference was not replaced (matrices like [[ω] v] are fine)
    box.querySelectorAll('.katex').forEach((n) => n.remove());
    const prose = box.textContent;
    if (/\[\[/.test(prose)) fail(`unresolved xref ${where}: ${prose.match(/.{0,30}\[\[.{0,40}/)[0]}`);
  }
  const md = (s) => A.md(String(s || ''));
  const il = (s) => A.inline(String(s || ''));

  // ---- content scan ----
  let nSec = 0, nProb = 0, nKey = 0;
  const allSecKeys = new Set();
  A.CH.forEach((c) => {
    checkHTML(il(c.tagline) + il(c.summary) + (c.goals || []).map(il).join(''), `${c.id} head`);
    const ks = new Set();
    c.sections.forEach((s) => {
      nSec++;
      if (!s.k) fail(`${c.id} section without k: ${s.title}`);
      if (ks.has(s.k)) fail(`${c.id} duplicate k ${s.k}`); ks.add(s.k); allSecKeys.add(`${c.id}:${s.k}`);
      if (/\$/.test(s.title)) fail(`${c.id} §${s.k} title has $`);
      if (/\$\{/.test(s.body)) fail(`${c.id} §${s.k} has template \${`);
      checkHTML(md(s.body), `${c.id} §${s.k}`);
    });
    A.keyBlocks(c).forEach((kb) => {
      nKey++;
      const pf = (A.proofsByKey.get(kb.title.trim()) || []).filter((p) => p.ch === c.id);
      if (!pf.length) log(`note: key without proof ${c.id} "${kb.title}"`);
    });
    c.problems.forEach((p) => {
      nProb++;
      const w = `${p.id}`;
      if (!['mc', 'num', 'open'].includes(p.type)) fail(`${w} bad type`);
      if (![1, 2, 3].includes(p.lv)) fail(`${w} bad lv`);
      if (p.sec && !c.sections.some((s) => s.k === p.sec)) fail(`${w} sec ${p.sec} not in ${c.id}`);
      if (!p.sol) fail(`${w} no sol`);
      if (p.type === 'mc') {
        if (!Array.isArray(p.choices) || p.choices.length < 2) fail(`${w} no choices`);
        else if (!(p.ans >= 0 && p.ans < p.choices.length)) fail(`${w} ans index`);
        if (new Set(p.choices).size !== p.choices.length) fail(`${w} duplicate choices`);
      }
      if (p.type === 'num') {
        try { window.EMCalc.parse(p.ans); } catch (e) { fail(`${w} num ans parse: ${p.ans} (${e.message})`); }
        if (p.ansTex) checkHTML(il('$' + p.ansTex + '$'), `${w} ansTex`);
      }
      if (typeof p.quiz === 'string' && !(A.QZP && A.QZP.has(p.quiz))) fail(`${w} quiz names a missing quiz problem ${p.quiz}`);
      if (p.quiz && p.type === 'open' && !p.rubric) log(`note: quiz-style problem without rubric ${w}`);
      checkHTML(md(p.q) + (p.choices || []).map(il).join('') + md(p.sol) + il(p.hint) + md(p.rubric), w);
    });
  });
  // ---- proofs ----
  const pids = new Set();
  A.PROOFS.forEach((p) => {
    if (pids.has(p.pid)) fail(`duplicate proof id ${p.pid}`); pids.add(p.pid);
    if (!p.stmt || !p.body) fail(`proof ${p.pid} missing stmt/body`);
    checkHTML(il(p.title) + md(p.stmt) + md(p.body) + md(p.note), `proof ${p.pid}`);
    (p.keys || []).forEach((k) => {
      const c = A.chById.get(p.ch);
      if (!A.keyBlocks(c).some((kb) => kb.title.trim() === k) && !c.sections.some((s) => new RegExp(':::thm\\s*' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$', 'm').test(s.body))) fail(`proof ${p.pid} key "${k}" matches no key/thm box in ${p.ch}`);
    });
  });
  (window.EM.proofs || []).forEach((p) => { if (!A.chById.get(p.ch)) fail(`proof ${p.id} has unknown ch ${p.ch}`); });
  // ---- worked solutions (data/quiz-*.js, data/hard-*.js): every page of A.BOOKS ----
  const BOOKS = A.BOOKS || [{ key: 'quiz', sets: A.QUIZ || [] }];
  BOOKS.forEach((b) => b.sets.forEach((q) => {
    checkHTML(md(q.intro), `${b.key} ${q.id}`);
    q.problems.forEach((p) => {
      const w = `${b.key} ${q.id}-${p.id}`;
      if (/\$/.test(p.title)) fail(`${w} title has $`);
      if (/\$\{/.test(p.body)) fail(`${w} has template \${`);
      checkHTML(md(p.body), w);
      (p.secs || []).forEach((s) => { if (!allSecKeys.has(s)) fail(`${w} secs names a missing section ${s}`); });
      String(p.body).replace(/\[\[(@\w+:)?(ch\d{2}):([\w.]+)\|/g, (_, site, ch, k) => {
        if (site) { if (!A.xrefTarget(ch, k, site.slice(1, -1))) fail(`${w} xref target missing ${site}${ch}:${k}`); }
        else if (!allSecKeys.has(`${ch}:${k}`)) fail(`${w} xref section missing ${ch}:${k}`);
        return '';
      });
    });
  }));
  // ---- bilingual fields: English must mirror the Korean original piece by piece, and contain no Korean ----
  if (A.BI) {
    const cov = {};
    const tally = (k, ok) => { cov[k] = cov[k] || [0, 0]; cov[k][1]++; if (ok) cov[k][0]++; };
    const split = (s) => String(s || '').split(/\n\s*---\s*\n/);
    const shapeDiff = (en, ko, path) => {
      const a = A.scanSegs(en), b = A.scanSegs(ko);
      const sig = (L) => L.map((x) => (x.kind === 'blk' ? `:${x.type}` : x.kind)).join(' ');
      if (a.length !== b.length) return `${path}: ${a.length} vs ${b.length} pieces [${sig(a)}] / [${sig(b)}]`;
      for (let k = 0; k < a.length; k++) {
        const at = `${path} #${k + 1}`;
        if (a[k].kind !== b[k].kind) return `${at}: ${a[k].kind} vs ${b[k].kind}`;
        if (a[k].kind !== 'blk') continue;
        if (a[k].type !== b[k].type) return `${at}: :::${a[k].type} vs :::${b[k].type}`;
        if (a[k].type === 'fig') { if (a[k].title.trim() !== b[k].title.trim()) return `${at}: fig ${a[k].title} vs ${b[k].title}`; continue; }
        if (a[k].type === 'ex') {
          const pa = split(a[k].inner), pb = split(b[k].inner);
          if ((pa.length > 1) !== (pb.length > 1)) return `${at}: example with/without solution`;
          const d = shapeDiff(pa[0], pb[0], `${at} ex`) || shapeDiff(pa.slice(1).join('\n'), pb.slice(1).join('\n'), `${at} ex-sol`);
          if (d) return d;
        } else {
          const d = shapeDiff(a[k].inner, b[k].inner, `${at} :::${a[k].type}`);
          if (d) return d;
        }
      }
      return '';
    };
    const HANGUL = /[가-힣]/;
    const pair = (en, ko, where, isMd) => {
      if (!ko) return;
      if (en == null || en === '') { fail(`${where} English missing`); return; }
      if (HANGUL.test(en)) fail(`${where} English text contains Korean: ${String(en).match(/.{0,30}[가-힣].{0,30}/)[0]}`);
      if (isMd) { const d = shapeDiff(en, ko, where); if (d) fail(`bilingual shape ${d}`); checkHTML(md(en), `${where} (en)`); }
      else checkHTML(il(en), `${where} (en)`);
    };
    A.CH.forEach((c) => {
      const e = c.enData;
      tally('units', !!e);
      if (!e) return;
      pair(e.summary, c.summary, `${c.id} summary`);
      pair(e.tagline, c.tagline, `${c.id} tagline`);
      pair(e.fig, c.fig, `${c.id} plate caption`);
      if (!e.title || HANGUL.test(e.title)) fail(`${c.id} English title missing or Korean`);
      if ((e.goals || []).length !== (c.goals || []).length) fail(`${c.id} goals: ${(e.goals || []).length} English vs ${(c.goals || []).length}`);
      (e.goals || []).forEach((g, k) => pair(g, c.goals[k], `${c.id} goal ${k + 1}`));
      c.sections.forEach((s) => {
        tally('sections', !!s.enData);
        if (!s.enData) return;
        if (!s.enData.title || HANGUL.test(s.enData.title)) fail(`${c.id} §${s.k} English title missing or Korean`);
        pair(s.enData.body, s.body, `${c.id} §${s.k}`, true);
      });
      c.problems.forEach((p) => {
        tally('problems', !!p.enData);
        if (!p.enData) return;
        const pe = p.enData;
        ['q', 'sol', 'rubric'].forEach((f) => pair(pe[f], p[f], `${p.id} ${f}`, true));
        pair(pe.hint, p.hint, `${p.id} hint`);
        if (p.choices) {
          if (!pe.choices || pe.choices.length !== p.choices.length) fail(`${p.id} choices: English ${pe.choices ? pe.choices.length : 0} vs ${p.choices.length}`);
          else pe.choices.forEach((ch, k) => pair(ch, p.choices[k], `${p.id} choice ${k + 1}`));
        }
      });
      if (e.probs && e.probs.length !== c.problems.length) fail(`${c.id} English problems ${e.probs.length} vs ${c.problems.length}`);
    });
    A.PROOFS.forEach((p) => {
      tally('proofs', !!p.enData);
      if (!p.enData) return;
      if (!p.enData.title || HANGUL.test(p.enData.title)) fail(`proof ${p.pid} English title missing or Korean`);
      ['stmt', 'body', 'note'].forEach((f) => pair(p.enData[f], p[f], `proof ${p.pid} ${f}`, true));
    });
    A.EXAMS.forEach((x) => {
      x.problems.forEach((p) => {
        tally('exam problems', !!p.enData);
        if (!p.enData) return;
        const pe = p.enData;
        ['q', 'sol', 'rubric'].forEach((f) => pair(pe[f], p[f], `${p.id} ${f}`, true));
        if (p.choices) {
          if (!pe.choices || pe.choices.length !== p.choices.length) fail(`${p.id} choices: English ${pe.choices ? pe.choices.length : 0} vs ${p.choices.length}`);
          else pe.choices.forEach((ch, k) => pair(ch, p.choices[k], `${p.id} choice ${k + 1}`));
        }
      });
    });
    (A.QUIZ || []).forEach((q) => {
      if (q.enData) pair(q.enData.intro, q.intro, `quiz ${q.id} intro`, true);
      q.problems.forEach((p) => { tally('quiz problems', !!p.enData); if (p.enData) pair(p.enData.body, p.body, `quiz ${q.id}-${p.id}`, true); });
    });
    const figNames = new Set();
    A.CH.forEach((c) => c.sections.forEach((s) => String(s.body).replace(/^\s*:::fig\s+(\S+)/gm, (_, n) => { figNames.add(n); return ''; })));
    figNames.forEach((n) => { tally('figure captions', !!(A.EN.fig || {})[n]); const cap = (A.EN.fig || {})[n]; if (cap && HANGUL.test(cap)) fail(`figure ${n} English caption contains Korean`); });
    log('en coverage ' + Object.entries(cov).map(([k, [a, b]]) => `${k} ${a}/${b}`).join(', '));
  }
  // ---- exams ----
  A.EXAMS.forEach((x) => {
    let pts = 0;
    x.problems.forEach((p) => {
      pts += p.pts || 0;
      if (!A.chById.get(p.ch)) fail(`${p.id} unknown ch ${p.ch}`);
      if (p.type === 'mc' && !(p.ans >= 0 && p.ans < p.choices.length)) fail(`${p.id} ans index`);
      if (p.type === 'num') { try { window.EMCalc.parse(p.ans); } catch (e) { fail(`${p.id} num ans parse ${p.ans}`); } }
      if (p.type === 'open' && !p.rubric) log(`note: exam open without rubric ${p.id}`);
      // med sets its mock-exam questions in English (the solutions and rubrics stay Korean)
      if (A.FIELD === 'med' && /[가-힣]/.test([p.q, ...(p.choices || [])].join('\n'))) fail(`${p.id} question or choices must be in English`);
      checkHTML(md(p.q) + (p.choices || []).map(il).join('') + md(p.sol) + md(p.rubric) + (p.ansTex ? il('$' + p.ansTex + '$') : ''), p.id);
    });
    if (pts !== 100) fail(`exam ${x.id} points sum ${pts}`);
  });
  // ---- xrefs ----
  A.XLINKS.forEach((l) => {
    const tg = A.xrefTarget(l.to, l.toK, l.site);
    const sis = l.site ? A.SISTERS[l.site] : null;
    if (!tg && l.site && !A.SISTERS[l.site]) log(`note: link to a site outside the network is hidden: @${l.site}:${l.to}:${l.toK}`);
    else if (!tg) fail(`xref target missing ${l.from}§${l.fromK} → ${l.site ? '@' + l.site + ':' : ''}${l.to}:${l.toK}`);
    else if (!l.site && l.toK && !allSecKeys.has(`${l.to}:${l.toK}`)) fail(`xref section missing ${l.to}:${l.toK}`);
    // inside the network the index knows every section, so a miss is a broken link; outside it is only a missing label
    else if (sis && sis.net && !(sis.chapters || {})[l.to]) fail(`network xref to unknown unit @${l.site}:${l.to}`);
    else if (sis && sis.net && l.toK && !(sis.secs || {})[`${l.to}:${l.toK}`]) fail(`network xref to unknown section @${l.site}:${l.to}:${l.toK}`);
    else if (sis && !sis.net && l.toK && !(sis.secs || {})[`${l.to}:${l.toK}`]) log(`note: sister section title missing @${l.site}:${l.to}:${l.toK}`);
  });

  // ---- routes ----
  const routes = ['home', 'formulas', 'proofs', 'exams', 'review'];
  A.CH.forEach((c) => { routes.push(c.id, `${c.id}-practice`, `${c.id}-formulas`, `${c.id}-proofs`); c.sections.forEach((s) => routes.push(`${c.id}-k${s.k}`)); });
  A.PROOFS.forEach((p) => routes.push(`pf-${p.pid}`));
  BOOKS.forEach((b) => { routes.push(b.key); b.sets.forEach((q) => q.problems.forEach((p) => routes.push(`${b.key}-${q.id}-${p.id}`))); });
  // simulations: every ":::sim name" must name a registered simulation, and the lab page lists them all
  const SIMREG = A.SIMREG || {};
  const simUse = (src, where) => String(src || '').replace(/^\s*:::sim\s+(\S+)/gm, (_, n) => { if (!SIMREG[n]) fail(`${where} names a missing simulation ${n}`); return ''; });
  A.CH.forEach((c) => c.sections.forEach((s) => simUse(s.body, `${c.id} §${s.k}`)));
  BOOKS.forEach((b) => b.sets.forEach((q) => { simUse(q.intro, `${b.key} ${q.id}`); q.problems.forEach((p) => simUse(p.body, `${b.key} ${q.id}-${p.id}`)); }));
  if ((A.SIMS || []).length) { routes.push('lab'); A.SIMS.forEach((s) => { routes.push(`lab-${s.id}`); if (s.ch && !A.chById.get(s.ch)) fail(`simulation ${s.id} names unknown unit ${s.ch}`); if (s.ch && s.k && !A.chById.get(s.ch).sections.some((x) => x.k === s.k)) fail(`simulation ${s.id} names unknown section ${s.k}`); }); }
  // figures: every ":::fig name" anywhere in the content must name a registered figure
  const FIGREG = window.SITE_FIGS || {};
  const figUse = (src, where) => String(src || '').replace(/^\s*:::fig\s+(\S+)/gm, (_, n) => { if (!FIGREG[n]) fail(`${where} names a missing figure ${n}`); return ''; });
  // the picture catalogue (atlas): each entry's figure, simulation and `where` places exist, and every [[atlas:id]] names an entry
  const atlUse = (src, where) => String(src || '').replace(/\[\[atlas:([\w-]+)/g, (_, id) => { if (!A.atlById || !A.atlById.get(id)) fail(`${where} links a missing atlas entry ${id}`); return ''; });
  // a ":::fig" box draws only the figure, so anything before its closing ":::" would vanish from the page
  const figClosed = (src, where) => {
    const L = String(src || '').split('\n');
    L.forEach((l, i) => {
      if (!/^\s*:::fig\b/.test(l)) return;
      let j = i + 1;
      while (j < L.length && !L[j].trim()) j++;
      if (j < L.length && L[j].trim() !== ':::') fail(`${where}: "${l.trim()}" is not closed by ":::" on the next line, so the text after it is hidden`);
    });
  };
  const scan = (src, where) => { figUse(src, where); atlUse(src, where); figClosed(src, where); };
  A.CH.forEach((c) => { c.sections.forEach((s) => scan(s.body, `${c.id} §${s.k}`)); c.problems.forEach((p) => scan([p.q, p.sol].join('\n'), p.id)); });
  BOOKS.forEach((b) => b.sets.forEach((q) => { scan(q.intro, `${b.key} ${q.id}`); q.problems.forEach((p) => scan(p.body, `${b.key} ${q.id}-${p.id}`)); }));
  A.EXAMS.forEach((x) => x.problems.forEach((p) => scan([p.q, p.sol].join('\n'), p.id)));
  if (A.ATLAS) {
    routes.push('atlas');
    const seen = new Set();
    A.ATL.forEach((it) => {
      if (seen.has(it.id)) fail(`atlas id ${it.id} repeated`); seen.add(it.id);
      routes.push(`atlas-${it.id}`);
      if (!FIGREG[it.fig]) fail(`atlas ${it.id} names a missing figure ${it.fig}`);
      if (it.sim && !SIMREG[it.sim]) fail(`atlas ${it.id} names a missing simulation ${it.sim}`);
      (it.where || []).forEach((w) => { if (!A.atlasWhere(w)) fail(`atlas ${it.id}: place ${w} does not resolve`); });
      const k = it.count;
      if (k && [k.m, k.N, k.J, k.f].some((v) => typeof v !== 'number')) fail(`atlas ${it.id} count needs m, N, J, f`);
      scan(it.body, `atlas ${it.id}`);
      checkHTML(md(it.body), `atlas ${it.id}`);
    });
  }
  // ---- logic maps (EM.maps) and proof roadmaps (EM.plans) ----
  // once a field has maps, every unit needs one (and every proof of 600+ characters a roadmap), so new units get them too
  const LM_ROLES = ['q', 'def', 'idea', 'tool', 'step', 'res', 'check', 'ex', 'app', 'alt', 'lim', 'fix', 'view'];
  const HAN = /[가-힣]/;
  const lmCheck = (m, where, place) => {
    if (!Array.isArray(m.nodes) || m.nodes.length < 2 || m.nodes.length > 12) { fail(`${where}: needs 2–12 nodes`); return; }
    A.lmPrep(m);
    const txt = (ko, en, w, isMd) => {
      if (!ko) { fail(`${where} ${w}: Korean text missing`); return; }
      checkHTML(isMd ? md(ko) : il(ko), `${where} ${w}`);
      if (!A.BI) return;
      if (!en) { fail(`${where} ${w}: English missing`); return; }
      if (HAN.test(en)) fail(`${where} ${w}: English contains Korean: ${String(en).match(/.{0,30}[가-힣].{0,30}/)[0]}`);
      if (isMd) {
        const a = A.scanSegs(en), b = A.scanSegs(ko);
        if (a.length !== b.length || a.some((x, k) => x.kind !== b[k].kind)) fail(`${where} ${w}: English has ${a.length} pieces, Korean ${b.length}`);
      }
      checkHTML(isMd ? md(en) : il(en), `${where} ${w} (en)`);
    };
    txt(m.easy, m.easyEn, 'easy summary', true);
    const ids = new Set();
    m.nodes.forEach((nd) => {
      const w = `node ${nd.id}`;
      if (!nd.id || ids.has(nd.id)) fail(`${where}: node id missing or repeated (${nd.id})`);
      ids.add(nd.id);
      if (nd.role && !LM_ROLES.includes(nd.role)) fail(`${where} ${w}: unknown role ${nd.role}`);
      txt(nd.t, nd.en, `${w} title`);
      txt(nd.d, nd.dEn, `${w} text`);
      if (nd.g) txt(nd.g, nd.gEn, `${w} group`);
      place(nd, w);
    });
    if (m.rows) {
      const seen = new Map();
      m.rows.forEach((row, r) => {
        if (!Array.isArray(row) || !row.length || row.length > 3) fail(`${where}: row ${r + 1} must have 1–3 places`);
        (row || []).forEach((id) => {
          if (id == null) return;
          if (!m.byId.get(id)) fail(`${where}: row ${r + 1} names unknown node ${id}`);
          else if (seen.has(id)) fail(`${where}: node ${id} sits in two rows`);
          seen.set(id, r);
        });
      });
      m.nodes.forEach((nd) => { if (!seen.has(nd.id)) fail(`${where}: node ${nd.id} sits in no row`); });
      (m.edges || []).forEach(([a, b, ko, en]) => {
        const na = m.byId.get(a), nb = m.byId.get(b);
        if (!na || !nb) { fail(`${where}: edge ${a}→${b} names an unknown node`); return; }
        if (nb.row !== na.row + 1) fail(`${where}: edge ${a}→${b} must run to the next row (rows ${na.row + 1}→${nb.row + 1})`);
        if (ko) txt(ko, en, `edge ${a}→${b}`);
      });
    } else if (m.edges) fail(`${where}: edges without rows`);
  };
  if (A.MAPS && A.MAPS.size) {
    A.CH.forEach((c) => { if (!A.MAPS.get(c.n)) fail(`${c.id} has no logic map: every unit needs a plain-words summary and a map (EM.maps)`); });
    A.MAPS.forEach((m, n) => {
      const c = A.CH.find((x) => x.n === n);
      if (!c) { fail(`logic map for unknown unit ${n}`); return; }
      let last = [-1, -1];
      lmCheck(m, `${c.id} map`, (nd, w) => {
        const si = c.sections.findIndex((x) => x.k === nd.k);
        if (si < 0) { fail(`${c.id} map ${w}: section ${nd.k} is not in the unit`); return; }
        let gi = -1;
        if (nd.at) {
          const hits = A.scanSegs(c.sections[si].body).map((g, i) => (A.lmAt(g, nd.at) ? i : -1)).filter((i) => i >= 0);
          if (hits.length !== 1) fail(`${c.id} map ${w}: at "${nd.at}" opens ${hits.length} pieces of §${nd.k} (needs exactly 1)`);
          gi = hits[0] ?? -1;
        }
        // the numbers follow the reading order, so the track can mark everything before the current step as passed
        if (si < last[0] || (si === last[0] && gi <= last[1] && !(gi === -1 && last[1] === -1))) fail(`${c.id} map ${w}: out of reading order`);
        last = [si, gi];
      });
      c.sections.forEach((s) => { if (!m.nodes.some((nd) => nd.k === s.k)) fail(`${c.id} map: section ${s.k} belongs to no node`); });
    });
  }
  const PLANS = A.PLANS || {};
  Object.keys(PLANS).forEach((pid) => {
    const p = A.PROOFS.find((x) => x.pid === pid);
    if (!p) { fail(`roadmap for unknown proof ${pid}`); return; }
    const segs = A.scanSegs(p.body);
    let last = -1;
    lmCheck(PLANS[pid], `proof ${pid} roadmap`, (nd, w) => {
      if (!nd.at) { fail(`proof ${pid} roadmap ${w}: at missing`); return; }
      const hits = segs.map((g, i) => (A.lmAt(g, nd.at) ? i : -1)).filter((i) => i >= 0);
      if (hits.length !== 1) { fail(`proof ${pid} roadmap ${w}: at "${nd.at}" opens ${hits.length} pieces of the body (needs exactly 1)`); return; }
      if (hits[0] <= last) fail(`proof ${pid} roadmap ${w}: out of order`);
      last = hits[0];
    });
  });
  if (Object.keys(PLANS).length) A.PROOFS.forEach((p) => { if (String(p.body).length >= 600 && !PLANS[p.pid]) fail(`long proof ${p.pid} (${String(p.body).length} chars) has no roadmap (EM.plans)`); });
  routes.forEach((r) => {
    try {
      history.replaceState(null, '', '#' + r);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      const m = document.getElementById('main');
      if (!m || m.innerHTML.length < 200) fail(`route ${r} rendered almost nothing`);
      const km = /^(ch\d{2})-k([\w.]+)$/.exec(r);
      if (km && !document.getElementById(`sec-${km[2]}`)) fail(`route ${r} opened without its section`);
      const lm = /^lab-([\w-]+)$/.exec(r);
      if (lm && !document.getElementById(`lb-${lm[1]}`)) fail(`route ${r} opened without its simulation`);
      const am = /^atlas-([\w-]+)$/.exec(r);
      if (am && !document.getElementById(`at-${am[1]}`)) fail(`route ${r} opened without its atlas entry`);
      // every map node and roadmap step has its signpost on the page (an English body whose pieces differ from the Korean drops them)
      const cu = /^ch\d{2}$/.test(r) && A.chById.get(r);
      const um = cu && A.MAPS && A.MAPS.get(cu.n);
      if (um) {
        if (!document.getElementById('sec-map')) fail(`route ${r} has no map section`);
        um.nodes.forEach((nd) => { if (!document.getElementById(`lm-${r}-${nd.id}`)) fail(`route ${r}: no signpost for map node ${nd.id}`); });
      }
      const pp = /^pf-(.+)$/.exec(r);
      if (pp && PLANS[pp[1]]) PLANS[pp[1]].nodes.forEach((nd) => { if (!document.getElementById(`lm-pf-${nd.id}`)) fail(`route ${r}: no signpost for roadmap step ${nd.id}`); });
      if (A.mountSims) A.mountSims(m, true); // simulations start lazily on the page; here every one mounts so its errors surface
      m.querySelectorAll('.katex-error').forEach((e) => fail(`route ${r} katex: ${(e.getAttribute('title') || '').slice(0, 120)}`));
      const clone = m.cloneNode(true); clone.querySelectorAll('code, textarea, input, script, .katex-mathml').forEach((n) => n.remove());
      if (/\$/.test(clone.textContent)) fail(`route ${r} leftover $: ${clone.textContent.match(/.{0,40}\$.{0,40}/)[0]}`);
      if (/\bundefined\b/.test(clone.textContent)) fail(`route ${r} shows undefined`);
    } catch (e) { fail(`route ${r} threw ${e.message}`); }
  });
  history.replaceState(null, '', '#home');

  (window.__errors || []).forEach((e) => fail(e));
  const nOpen = A.CH.reduce((s, c) => s + c.problems.filter((p) => p.type === 'open').length, 0);
  const nHand = A.PROOFS.filter((p) => p.src).length;
  log(`units=${A.CH.length} sections=${nSec} keys=${nKey} problems=${nProb} (open ${nOpen}) proofs=${A.PROOFS.length} (필기 ${nHand}) exams=${A.EXAMS.length} xrefs=${A.XLINKS.length} routes=${routes.length}`);
  log('RESULT ' + (bad ? 'FAIL ' + bad : 'OK'));
  box.remove();
  const pre = document.createElement('pre'); pre.id = '__out'; pre.textContent = out.join('\n');
  document.body.appendChild(pre);

  // ---- index for the network (read by tools/netindex.sh) ----
  const strip = (s) => String(s || '').trim();
  const idx = {
    chapters: {}, secs: {},
    counts: { units: A.CH.length, sections: nSec, problems: nProb, proofs: A.PROOFS.length, exams: A.EXAMS.length },
    search: [],
  };
  // a bilingual field (English on its pages) still enters the network with its Korean titles; the English goes to `en` for search
  A.CH.forEach((c) => {
    idx.chapters[c.id] = c.titleKo || c.title;
    idx.search.push({ t: 'u', ch: c.id, title: c.titleKo || c.title, en: c.titleKo ? c.title : c.en || '' });
    c.sections.forEach((s) => {
      idx.secs[`${c.id}:${s.k}`] = s.titleKo || s.title;
      idx.search.push(Object.assign({ t: 's', ch: c.id, k: s.k, title: s.titleKo || s.title }, s.titleKo ? { en: s.title } : {}));
    });
    A.keyBlocks(c).forEach((kb) => idx.search.push({ t: 'k', ch: c.id, k: kb.k || '', title: strip(kb.title) }));
  });
  A.PROOFS.forEach((p) => idx.search.push(Object.assign({ t: 'p', ch: p.ch, pid: p.pid, title: strip(p.titleKo || p.title), tags: strip(p.tags) }, p.titleKo ? { en: strip(p.title) } : {})));
  (A.ATL || []).forEach((it) => idx.search.push({ t: 'a', ch: '', id: it.id, title: strip(it.name), en: strip(it.en), tags: strip(it.tags), lab: strip(A.ATLAS.label) }));
  const links = A.XLINKS.filter((l) => l.site).map((l) => ({ from: A.FIELD, fromCh: l.from, fromK: l.fromK, to: l.site, toCh: l.to, toK: l.toK }));
  // printed as JS statements so tools/netindex.sh only has to concatenate them
  const F = JSON.stringify(A.FIELD);
  const search = idx.search; delete idx.search;
  const ipre = document.createElement('pre'); ipre.id = '__index';
  ipre.textContent = `NET.index[${F}] = ${JSON.stringify(idx)};\nNET.links.push(...${JSON.stringify(links)});`;
  document.body.appendChild(ipre);
  const spre = document.createElement('pre'); spre.id = '__search';
  spre.textContent = `NET.search[${F}] = ${JSON.stringify(search)};`;
  document.body.appendChild(spre);
})();
