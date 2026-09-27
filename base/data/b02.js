/* 기초 수학 02 — 적분의 도구: 기본정리와 적분 기호 속 미분, 치환·부분적분, 이상적분 */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 2, part: 'A', title: '적분의 도구', en: 'Tools of Integration', ref: '미적분학 I–II', plot: 'riemann',
    fig: R`$y=e^{-x^2}$ 아래 넓이와 폭이 줄어드는 리만 합`,
    tagline: R`변환과 급수의 계수는 전부 적분입니다. 적분을 미분하고, 바꾸고, 무한까지 늘리는 법을 정리합니다.`,
    summary: R`라플라스 변환, 푸리에 계수, 합성곱, 기댓값은 모두 적분으로 정의됩니다. 이 단원은 그 계산과 논증에 반복해서 나오는 세 가지를 다룹니다. **미적분의 기본정리**와 적분 기호 안에서 미분하기, **치환적분과 부분적분**(특히 $e^{ax}\cos bx$ 꼴), 그리고 구간이 무한하거나 피적분함수가 발산하는 **이상적분**의 수렴입니다.`,
    goals: [
      R`적분 구간이나 피적분함수에 변수가 들어 있는 적분을 미분할 수 있다`,
      R`부분적분을 반복하거나 되돌아오는 꼴로 $\int e^{ax}\cos bx\,dx$를 구할 수 있다`,
      R`$p$-적분과 비교 판정으로 이상적분의 수렴을 판정할 수 있다`,
      R`가우스 적분 $\int_{-\infty}^{\infty}e^{-x^2}dx=\sqrt\pi$를 유도할 수 있다`,
    ],
    sections: [
      { k: '2.1', src: '미적분학 I · 적분', title: '미적분의 기본정리와 적분 기호 속 미분', body: R`
적분과 미분이 서로의 역연산이라는 정리입니다. 두 부분으로 나눠 씁니다.

:::key 미적분의 기본정리
$f$가 구간에서 연속이면
1. $F(x)=\displaystyle\int_a^x f(t)\,dt$는 미분가능하고 $F'(x)=f(x)$
2. $G'=f$인 아무 원시함수 $G$에 대해 $\displaystyle\int_a^b f(t)\,dt=G(b)-G(a)$
:::

적분 구간 끝에 함수가 들어 있으면 연쇄법칙을 함께 씁니다.
$$\frac{d}{dx}\int_{u(x)}^{v(x)}f(t)\,dt=f\big(v(x)\big)\,v'(x)-f\big(u(x)\big)\,u'(x)$$

피적분함수에도 $x$가 들어 있으면 적분 기호 **안에서** 미분할 수 있습니다. 합성곱과 매개변수 변환법의 해를 검산할 때 바로 이 규칙을 씁니다.

:::key 적분 기호 속 미분 (라이프니츠 규칙)
$g$와 $\partial g/\partial x$가 연속이면
$$\frac{d}{dx}\int_a^{x}g(x,t)\,dt=g(x,x)+\int_a^{x}\frac{\partial g}{\partial x}(x,t)\,dt$$
구간이 고정되어 있으면 첫 항이 없어 $\dfrac{d}{dx}\displaystyle\int_a^b g(x,t)\,dt=\int_a^b\frac{\partial g}{\partial x}\,dt$입니다.
:::

:::ex 예제 1 (합성곱 꼴의 해)
$y(t)=\displaystyle\int_0^t\sin(t-\tau)\,r(\tau)\,d\tau$가 $y''+y=r(t)$, $y(0)=y'(0)=0$을 만족함을 보이세요.
---
라이프니츠 규칙으로 $y'=\sin0\cdot r(t)+\displaystyle\int_0^t\cos(t-\tau)r(\tau)\,d\tau=\int_0^t\cos(t-\tau)r(\tau)\,d\tau$. 한 번 더 미분하면
$$y''=\cos0\cdot r(t)-\int_0^t\sin(t-\tau)r(\tau)\,d\tau=r(t)-y$$
$t=0$에서 두 적분은 모두 0입니다. 라플라스 변환의 합성곱 정리가 주는 해와 같은 식입니다.
:::

:::ex 예제 2 (매개변수로 미분하기)
$I(a)=\displaystyle\int_0^1\frac{t^a-1}{\ln t}\,dt$ $(a>-1)$를 구하세요.
---
$\dfrac{\partial}{\partial a}\dfrac{t^a-1}{\ln t}=\dfrac{t^a\ln t}{\ln t}=t^a$이므로 $I'(a)=\displaystyle\int_0^1t^a\,dt=\frac1{a+1}$. $I(0)=0$이므로 $I(a)=\ln(a+1)$입니다. 직접 원시함수를 찾기 어려운 적분을 매개변수에 대한 미분방정식으로 바꾼 것입니다.
:::
` },
      { k: '2.2', src: '미적분학 I · 적분법', title: '치환적분과 부분적분', body: R`
미분의 연쇄법칙과 곱의 법칙을 적분 쪽에서 본 두 공식입니다.

:::key 치환적분과 부분적분
$$\int f\big(g(x)\big)g'(x)\,dx=\int f(u)\,du\qquad(u=g(x))$$
$$\int_a^b u\,v'\,dx=\Big[u\,v\Big]_a^b-\int_a^b u'\,v\,dx$$
정적분에서 치환할 때는 적분 구간도 $u$의 값으로 바꿉니다.
:::

**부분적분의 선택.** 미분하면 단순해지는 쪽($x^n$, $\ln x$)을 $u$, 적분하기 쉬운 쪽($e^{ax}$, $\sin$, $\cos$)을 $v'$로 둡니다. 다항식 × 지수함수는 다항식이 사라질 때까지 반복하면 되므로 표로 정리하면 빠릅니다(표 적분법).

:::ex 예제 1 (반복 부분적분)
$s>0$일 때 $\displaystyle\int_0^\infty t^2e^{-st}\,dt$를 구하세요.
---
$u=t^2$, $v'=e^{-st}$로 두 번 부분적분합니다. 경계항은 $t=0$에서 0, $t\to\infty$에서 지수함수가 이겨 0입니다.
$$\int_0^\infty t^2e^{-st}dt=\frac2s\int_0^\infty te^{-st}dt=\frac2s\cdot\frac1s\int_0^\infty e^{-st}dt=\frac{2}{s^3}$$
일반적으로 $\int_0^\infty t^ne^{-st}dt=\dfrac{n!}{s^{n+1}}$이고, 이것이 $t^n$의 라플라스 변환입니다.
:::

**되돌아오는 부분적분.** 두 번 부분적분했더니 처음 적분이 다시 나오면, 방정식으로 풀어 버립니다.

:::ex 예제 2 ($e^{ax}\cos bx$)
$I=\displaystyle\int e^{ax}\cos bx\,dx$를 구하세요.
---
두 번 부분적분하면 $I=\dfrac{e^{ax}\sin bx}{b}+\dfrac{a\,e^{ax}\cos bx}{b^2}-\dfrac{a^2}{b^2}I$입니다. $I$를 한쪽으로 모으면
$$\int e^{ax}\cos bx\,dx=\frac{e^{ax}\big(a\cos bx+b\sin bx\big)}{a^2+b^2}+C$$
오일러 공식[[ch03:3.4|오일러 공식: 복소지수로 삼각함수를 한꺼번에 다루기.]]을 쓰면 더 짧습니다: $\int e^{(a+ib)x}dx=\dfrac{e^{(a+ib)x}}{a+ib}$의 실수부가 위 식입니다.
:::

:::warn 경계항과 적분 구간
정적분의 부분적분에서 $\big[uv\big]_a^b$를 빠뜨리거나, 치환한 뒤 적분 구간을 그대로 두는 실수가 가장 많습니다. 무한 구간이면 경계항이 실제로 0으로 가는지 확인하세요.
:::
` },
      { k: '2.3', src: '미적분학 II · 이상적분', title: '이상적분', body: R`
구간이 무한하거나 피적분함수가 구간 안에서 발산하면 적분을 극한으로 정의합니다.
$$\int_a^\infty f(x)\,dx=\lim_{R\to\infty}\int_a^R f(x)\,dx,\qquad \int_0^1\frac{dx}{x^p}=\lim_{\varepsilon\to0^+}\int_\varepsilon^1\frac{dx}{x^p}$$
극한이 유한하면 **수렴**, 아니면 **발산**한다고 합니다.

:::key 이상적분의 수렴
- $\displaystyle\int_1^\infty\frac{dx}{x^p}$는 $p>1$일 때만 수렴하고, $\displaystyle\int_0^1\frac{dx}{x^p}$는 $p<1$일 때만 수렴합니다.
- **비교 판정**: $0\le f\le g$이고 $\int g$가 수렴하면 $\int f$도 수렴합니다. $\int\lvert f\rvert$가 수렴하면 $\int f$도 수렴합니다(절대수렴).
- **지수가 다항식을 이긴다**: $s>0$이면 $\displaystyle\int_0^\infty t^ne^{-st}dt$는 모든 $n$에 대해 수렴합니다.
:::

라플라스 변환이 존재하는 조건 “$\lvert f(t)\rvert\le Me^{kt}$이면 $s>k$에서 변환이 있다”는 비교 판정 그대로입니다: $\lvert f(t)e^{-st}\rvert\le Me^{-(s-k)t}$이고 오른쪽의 적분은 수렴합니다. 감마함수 $\Gamma(x)=\int_0^\infty t^{x-1}e^{-t}dt$도 $x>0$에서 같은 이유로 수렴하고, 부분적분으로 $\Gamma(x+1)=x\Gamma(x)$, $\Gamma(n+1)=n!$입니다.

:::key 가우스 적분
$$\int_{-\infty}^{\infty}e^{-x^2}dx=\sqrt\pi$$
원시함수를 초등함수로 쓸 수 없지만, 제곱해서 극좌표로 바꾸면 계산됩니다. 정규분포의 정규화 상수 $\frac{1}{\sqrt{2\pi}}$가 여기서 나옵니다.
:::

:::ex 예제 1 (가우스 적분)
$I=\displaystyle\int_{-\infty}^\infty e^{-x^2}dx$를 구하세요.
---
$$I^2=\int_{-\infty}^\infty\int_{-\infty}^\infty e^{-(x^2+y^2)}\,dx\,dy=\int_0^{2\pi}\int_0^\infty e^{-r^2}\,r\,dr\,d\theta=2\pi\cdot\frac12=\pi$$
극좌표에서 넓이 요소가 $r\,dr\,d\theta$가 되는 이유는 야코비안입니다[[ch04:4.2|연쇄법칙과 야코비 행렬: 좌표를 바꿀 때 넓이가 늘어나는 비율.]]. $I>0$이므로 $I=\sqrt\pi$, 반쪽 $\int_0^\infty e^{-x^2}dx=\frac{\sqrt\pi}{2}$입니다.
:::

:::warn 특이점을 지나는 적분
$\displaystyle\int_{-1}^1\frac{dx}{x^2}$에 원시함수 $-\frac1x$를 그대로 넣으면 $-2$가 나오지만, 양수를 적분했는데 음수가 나온 것부터 이상합니다. $x=0$에서 발산하므로 $\int_0^1$과 $\int_{-1}^0$을 따로 극한으로 봐야 하고, 둘 다 발산합니다.
:::
` },
    ],
    problems: [
      { sec: '2.1', type: 'num', lv: 1, q: R`$F(x)=\displaystyle\int_0^{x^2}e^{-t}\,dt$일 때 $F'(1)$은?`, ans: '2/e', ansTex: R`\tfrac2e`,
        sol: R`$F'(x)=e^{-x^2}\cdot2x$이므로 $F'(1)=2e^{-1}$.` },
      { sec: '2.1', type: 'mc', lv: 2, q: R`$y(t)=\displaystyle\int_0^t e^{-(t-\tau)}r(\tau)\,d\tau$가 만족하는 미분방정식은?`,
        choices: [R`$y'+y=r$`, R`$y'-y=r$`, R`$y'+y=0$`, R`$y''+y=r$`], ans: 0,
        sol: R`라이프니츠 규칙으로 $y'=e^0r(t)+\int_0^t\big(-e^{-(t-\tau)}\big)r(\tau)d\tau=r-y$. 곧 $y'+y=r$, $y(0)=0$입니다.` },
      { sec: '2.2', type: 'num', lv: 1, q: R`$\displaystyle\int_0^1 xe^{x}\,dx$의 값은?`, ans: '1', ansTex: R`1`,
        sol: R`$u=x$, $v'=e^x$: $\big[xe^x\big]_0^1-\int_0^1e^xdx=e-(e-1)=1$.` },
      { sec: '2.2', type: 'num', lv: 2, q: R`$\displaystyle\int_0^\infty e^{-x}\sin x\,dx$의 값은?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`$\int e^{ax}\sin bx\,dx=\dfrac{e^{ax}(a\sin bx-b\cos bx)}{a^2+b^2}$에 $a=-1$, $b=1$을 넣으면 $\Big[\dfrac{e^{-x}(-\sin x-\cos x)}{2}\Big]_0^\infty=0-\big(-\tfrac12\big)=\tfrac12$.` },
      { sec: '2.3', type: 'mc', lv: 1, q: R`다음 중 수렴하는 이상적분은?`,
        choices: [R`$\int_1^\infty\frac{dx}{\sqrt x}$`, R`$\int_0^1\frac{dx}{x}$`, R`$\int_1^\infty\frac{dx}{x^{3/2}}$`, R`$\int_0^1\frac{dx}{x^{2}}$`], ans: 2,
        sol: R`$\int_1^\infty x^{-p}$는 $p>1$일 때 수렴하므로 $p=\tfrac32$인 셋째만 수렴합니다. $\int_0^1x^{-p}$는 $p<1$이어야 하는데 둘째($p=1$), 넷째($p=2$)는 발산합니다.` },
      { sec: '2.3', type: 'num', lv: 2, q: R`$\displaystyle\int_0^\infty x^3e^{-2x}\,dx$의 값은?`, ans: '3/8', ansTex: R`\tfrac38`,
        sol: R`$\int_0^\infty t^ne^{-st}dt=\dfrac{n!}{s^{n+1}}$에 $n=3$, $s=2$: $\dfrac{6}{16}=\dfrac38$.` },
      { sec: '2.3', type: 'num', lv: 3, q: R`$\displaystyle\int_{-\infty}^\infty e^{-x^2/2}\,dx$의 값은?`, ans: 'sqrt(2*pi)', ansTex: R`\sqrt{2\pi}`,
        sol: R`$x=\sqrt2\,u$로 치환하면 $dx=\sqrt2\,du$이고 $\int e^{-u^2}\sqrt2\,du=\sqrt2\sqrt\pi=\sqrt{2\pi}$. 표준정규분포의 밀도가 $\frac1{\sqrt{2\pi}}e^{-x^2/2}$인 이유입니다.` },
    ],
  });
})();
