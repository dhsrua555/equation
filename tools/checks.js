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
  // ---- worked quiz solutions (data/quiz-*.js) ----
  (A.QUIZ || []).forEach((q) => {
    checkHTML(md(q.intro), `quiz ${q.id}`);
    q.problems.forEach((p) => {
      const w = `quiz ${q.id}-${p.id}`;
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
  });
  // ---- exams ----
  A.EXAMS.forEach((x) => {
    let pts = 0;
    x.problems.forEach((p) => {
      pts += p.pts || 0;
      if (!A.chById.get(p.ch)) fail(`${p.id} unknown ch ${p.ch}`);
      if (p.type === 'mc' && !(p.ans >= 0 && p.ans < p.choices.length)) fail(`${p.id} ans index`);
      if (p.type === 'num') { try { window.EMCalc.parse(p.ans); } catch (e) { fail(`${p.id} num ans parse ${p.ans}`); } }
      if (p.type === 'open' && !p.rubric) log(`note: exam open without rubric ${p.id}`);
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
  (A.QUIZ || []).forEach((q, i) => { if (!i) routes.push('quiz'); q.problems.forEach((p) => routes.push(`quiz-${q.id}-${p.id}`)); });
  routes.forEach((r) => {
    try {
      history.replaceState(null, '', '#' + r);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      const m = document.getElementById('main');
      if (!m || m.innerHTML.length < 200) fail(`route ${r} rendered almost nothing`);
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
  A.CH.forEach((c) => {
    idx.chapters[c.id] = c.title;
    idx.search.push({ t: 'u', ch: c.id, title: c.title, en: c.en || '' });
    c.sections.forEach((s) => {
      idx.secs[`${c.id}:${s.k}`] = s.title;
      idx.search.push({ t: 's', ch: c.id, k: s.k, title: s.title });
    });
    A.keyBlocks(c).forEach((kb) => idx.search.push({ t: 'k', ch: c.id, k: kb.k || '', title: strip(kb.title) }));
  });
  A.PROOFS.forEach((p) => idx.search.push({ t: 'p', ch: p.ch, pid: p.pid, title: strip(p.title), tags: strip(p.tags) }));
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
