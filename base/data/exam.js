/* 기초 수학 — 점검 시험 (연습문제와 겹치지 않는 문항) */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
(function () {
  const R = String.raw;
  EM.exams.push({
    id: 'b1', roman: 'I', kind: '점검 시험 · 기초 수학', title: '다른 분야를 시작하기 전에', scopeText: '01–05 단원',
    desc: 'O 기호와 테일러 전개, 적분의 도구, 급수의 수렴, 헤시안, 립시츠 조건을 한 번씩 묻습니다.',
    minutes: 40, plot: 'exam',
    problems: [
      { ch: 'ch01', type: 'mc', lv: 1, pts: 10, q: R`$h\to0$일 때 $O(h^3)$인 것은?`,
        choices: [R`$\sin h-h$`, R`$\cos h-1$`, R`$e^h-1$`, R`$\ln(1+h)$`], ans: 0,
        sol: R`$\sin h-h=-\tfrac16h^3+\cdots$. 나머지는 차례로 $O(h^2)$, $O(h)$, $O(h)$이고 더 높은 차수는 아닙니다.` },
      { ch: 'ch01', type: 'num', lv: 1, pts: 10, q: R`$\displaystyle\lim_{x\to0}\frac{1-\cos x}{x^2}$의 값은?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`$1-\cos x=\tfrac{x^2}2-\tfrac{x^4}{24}+\cdots$이므로 $\tfrac12$.` },
      { ch: 'ch02', type: 'num', lv: 2, pts: 10, q: R`$\displaystyle\int_0^\infty xe^{-3x}\,dx$의 값은?`, ans: '1/9', ansTex: R`\tfrac19`,
        sol: R`$\int_0^\infty t^ne^{-st}dt=\dfrac{n!}{s^{n+1}}$에 $n=1$, $s=3$: $\tfrac19$.` },
      { ch: 'ch02', type: 'open', lv: 2, pts: 15, q: R`$y(t)=\displaystyle\int_0^t(t-\tau)\,r(\tau)\,d\tau$가 $y''=r(t)$, $y(0)=y'(0)=0$을 만족함을 보이세요.`,
        sol: R`라이프니츠 규칙으로 $y'=(t-t)r(t)+\int_0^tr(\tau)\,d\tau=\int_0^tr(\tau)\,d\tau$, 기본정리로 $y''=r(t)$. $t=0$이면 두 적분의 구간 길이가 0이라 $y(0)=y'(0)=0$입니다.`,
        rubric: R`- 라이프니츠 규칙으로 $y'$을 구하고 경계항 $(t-t)r(t)=0$을 확인 (7점)
- 기본정리로 $y''=r$ (5점)
- 초기조건 확인 (3점)` },
      { ch: 'ch03', type: 'num', lv: 2, pts: 10, q: R`$\displaystyle\sum_{k=1}^\infty\frac{(2x)^k}{k}$의 수렴반지름은?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`$a_k=\dfrac{2^k}{k}$, $\left\lvert\dfrac{a_k}{a_{k+1}}\right\rvert=\dfrac{k+1}{2k}\to\dfrac12$.` },
      { ch: 'ch03', type: 'mc', lv: 2, pts: 15, q: R`$\displaystyle\sum_{k=1}^\infty\frac{(-1)^{k+1}}{k^p}$가 **절대수렴**하는 $p$의 범위는?`,
        choices: [R`$p>1$`, R`$p>0$`, R`$p\ge1$`, R`모든 실수 $p$`], ans: 0,
        sol: R`절댓값을 붙이면 $p$-급수 $\sum\frac1{k^p}$이고 $p>1$일 때만 수렴합니다. $0<p\le1$이면 교대급수 판정으로 수렴은 하지만 조건수렴입니다.` },
      { ch: 'ch04', type: 'num', lv: 2, pts: 15, q: R`$f(x,y)=x^2+y^2-2x+4y$의 최솟값은?`, ans: '-5', ansTex: R`-5`,
        sol: R`$\nabla f=(2x-2,\ 2y+4)=\mathbf 0$에서 $(1,-2)$. 헤시안 $2I$가 양의 정부호이므로 최솟점이고 $f(1,-2)=1+4-2-8=-5$. 완전제곱으로 $f=(x-1)^2+(y+2)^2-5$로도 확인됩니다.` },
      { ch: 'ch05', type: 'open', lv: 3, pts: 15, q: R`$g(x)=\tfrac12\cos x$가 $[0,1]$에서 유일한 고정점을 가지고, $x_{n+1}=g(x_n)$이 어느 $x_0\in[0,1]$에서 시작해도 수렴함을 보이세요.`,
        sol: R`$[0,1]$에서 $\tfrac12\cos x\in\big[\tfrac12\cos1,\tfrac12\big]\subset[0,1]$이므로 $g$는 구간을 자기 안으로 보냅니다. $\lvert g'(x)\rvert=\tfrac12\lvert\sin x\rvert\le\tfrac12$이므로 평균값 정리로 립시츠 상수 $L=\tfrac12<1$입니다. 축소 사상 정리에 의해 고정점이 유일하고 반복은 수렴하며, 오차는 한 걸음마다 절반 이하로 줄어듭니다.`,
        rubric: R`- $g([0,1])\subset[0,1]$ 확인 (5점)
- 도함수 상한과 평균값 정리로 립시츠 상수 $L<1$ (6점)
- 축소 사상 정리로 유일성과 수렴 결론 (4점)` },
    ],
  });
})();
