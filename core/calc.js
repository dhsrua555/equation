/* Tiny complex-number expression evaluator used to grade short-answer problems.
   Accepts: 3/2, 2*pi, 2pi, e^2, sqrt(5), ln(2), 1-e^(-1), (-2+2i)/3, 8*pi*i/3, π, √3 … */
(function () {
  const C = (re, im = 0) => ({ re, im });
  const add = (a, b) => C(a.re + b.re, a.im + b.im);
  const sub = (a, b) => C(a.re - b.re, a.im - b.im);
  const mul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const div = (a, b) => {
    const d = b.re * b.re + b.im * b.im;
    if (d === 0) throw new Error('0으로 나눌 수 없습니다');
    return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
  };
  const abs = (a) => Math.hypot(a.re, a.im);
  const exp = (a) => { const m = Math.exp(a.re); return C(m * Math.cos(a.im), m * Math.sin(a.im)); };
  const ln = (a) => {
    if (a.re === 0 && a.im === 0) throw new Error('ln 0은 정의되지 않습니다');
    return C(Math.log(abs(a)), Math.atan2(a.im, a.re));
  };
  const pow = (a, b) => {
    if (b.im === 0 && Number.isInteger(b.re) && Math.abs(b.re) <= 64) {
      let r = C(1), base = a, n = Math.abs(b.re);
      while (n) { if (n & 1) r = mul(r, base); base = mul(base, base); n >>= 1; }
      return b.re < 0 ? div(C(1), r) : r;
    }
    if (a.re === 0 && a.im === 0) return C(0);
    if (a.im === 0 && b.im === 0 && a.re > 0) return C(Math.pow(a.re, b.re));
    return exp(mul(b, ln(a)));
  };
  const I = C(0, 1);
  const sin = (a) => div(sub(exp(mul(I, a)), exp(mul(C(0, -1), a))), C(0, 2));
  const cos = (a) => div(add(exp(mul(I, a)), exp(mul(C(0, -1), a))), C(2));
  const sinh = (a) => div(sub(exp(a), exp(C(-a.re, -a.im))), C(2));
  const cosh = (a) => div(add(exp(a), exp(C(-a.re, -a.im))), C(2));
  const FN = {
    sqrt: (a) => (a.im === 0 && a.re >= 0 ? C(Math.sqrt(a.re)) : exp(mul(C(0.5), ln(a)))),
    exp, ln, log: ln, sin, cos, tan: (a) => div(sin(a), cos(a)),
    sinh, cosh, tanh: (a) => div(sinh(a), cosh(a)), abs: (a) => C(abs(a)),
    arctan: (a) => C(Math.atan(a.re)),
    // real-valued inverse trig and base-10 log for the mechanics fields
    atan: (a) => C(Math.atan(a.re)), arcsin: (a) => C(Math.asin(a.re)), asin: (a) => C(Math.asin(a.re)),
    arccos: (a) => C(Math.acos(a.re)), acos: (a) => C(Math.acos(a.re)), log10: (a) => C(Math.log10(abs(a))),
  };
  const CONST = { pi: C(Math.PI), e: C(Math.E), i: I };
  const NAMES = ['arctan', 'arcsin', 'arccos', 'atan', 'asin', 'acos', 'log10', 'sqrt', 'sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan', 'exp', 'abs', 'log', 'ln', 'pi', 'e', 'i'];

  function tokenize(src) {
    const s = src
      .replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/[×·]/g, '*').replace(/÷/g, '/')
      .replace(/−/g, '-').replace(/\s+/g, '').toLowerCase();
    const out = [];
    let k = 0;
    while (k < s.length) {
      const ch = s[k];
      if (/[0-9.]/.test(ch)) {
        const m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/.exec(s.slice(k));
        // treat "2e" as 2·e unless followed by digits (scientific notation)
        out.push({ t: 'num', v: parseFloat(m[0]) });
        k += m[0].length;
      } else if (/[a-z]/.test(ch)) {
        const name = NAMES.find((n) => s.startsWith(n, k));
        if (!name) throw new Error(`'${s.slice(k, k + 4)}'를 이해할 수 없습니다`);
        out.push(FN[name] ? { t: 'fn', v: name } : { t: 'const', v: name });
        k += name.length;
      } else if ('+-*/^()'.includes(ch)) {
        out.push({ t: 'op', v: ch });
        k++;
      } else {
        throw new Error(`'${ch}' 기호는 쓸 수 없습니다`);
      }
    }
    return out;
  }

  function parse(src) {
    const tk = tokenize(src);
    if (!tk.length) throw new Error('답을 입력하세요');
    let p = 0;
    const peek = () => tk[p];
    const isOp = (v) => peek() && peek().t === 'op' && peek().v === v;
    const startsFactor = () => {
      const t = peek();
      return t && (t.t === 'num' || t.t === 'const' || t.t === 'fn' || (t.t === 'op' && t.v === '('));
    };
    function expr() {
      let v = term();
      while (isOp('+') || isOp('-')) { const o = tk[p++].v; const r = term(); v = o === '+' ? add(v, r) : sub(v, r); }
      return v;
    }
    function term() {
      let v = unary();
      for (;;) {
        if (isOp('*')) { p++; v = mul(v, unary()); }
        else if (isOp('/')) { p++; v = div(v, unary()); }
        else if (startsFactor()) v = mul(v, power()); // implicit multiplication: 2pi, 3(1+i)
        else break;
      }
      return v;
    }
    function unary() {
      if (isOp('-')) { p++; const v = unary(); return C(-v.re, -v.im); }
      if (isOp('+')) { p++; return unary(); }
      return power();
    }
    function power() {
      const b = atom();
      if (isOp('^')) { p++; return pow(b, unary()); }
      return b;
    }
    function atom() {
      const t = tk[p++];
      if (!t) throw new Error('식이 끝나지 않았습니다');
      if (t.t === 'num') return C(t.v);
      if (t.t === 'const') return CONST[t.v];
      if (t.t === 'fn') {
        // allow sqrt3, sin x without parentheses for a single atom
        const arg = isOp('(') ? atom() : power();
        return FN[t.v](arg);
      }
      if (t.t === 'op' && t.v === '(') {
        const v = expr();
        if (!isOp(')')) throw new Error('괄호가 닫히지 않았습니다');
        p++;
        return v;
      }
      throw new Error(`'${t.v}' 위치가 올바르지 않습니다`);
    }
    const v = expr();
    if (p < tk.length) throw new Error('식을 끝까지 읽지 못했습니다');
    if (!isFinite(v.re) || !isFinite(v.im)) throw new Error('값이 유한하지 않습니다');
    return v;
  }

  function fmt(v) {
    const r = (x) => {
      if (Math.abs(x) < 1e-12) return '0';
      const s = Math.abs(x) >= 1e5 || Math.abs(x) < 1e-4 ? x.toExponential(4) : (+x.toPrecision(6)).toString();
      return s;
    };
    if (Math.abs(v.im) < 1e-12) return r(v.re);
    if (Math.abs(v.re) < 1e-12) return `${r(v.im)}i`;
    return `${r(v.re)} ${v.im < 0 ? '−' : '+'} ${r(Math.abs(v.im))}i`;
  }

  function same(a, b, rel = 5e-3) {
    const d = abs(sub(a, b));
    return d <= 1e-9 || d <= rel * Math.max(abs(b), 1e-9);
  }

  window.EMCalc = { parse, fmt, same };
})();
