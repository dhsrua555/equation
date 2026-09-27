/* 기초 수학 03 — 수열과 급수: 등비급수, 수렴 판정, 수렴반지름, 테일러 급수와 오일러 공식 */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 3, part: 'B', title: '수열과 급수', en: 'Sequences & Series', ref: '미적분학 II', plot: 'partial',
    fig: R`$1/(1+x^2)$과 거듭제곱급수의 부분합: $\lvert x\rvert<1$ 밖에서 갈라진다`,
    tagline: R`무한히 더한 값이 언제 유한한지, 함수를 무한 다항식으로 쓸 수 있는 범위가 어디까지인지.`,
    summary: R`급수해법, 푸리에 급수, 로랑 급수, 그리고 오차 누적의 증명은 모두 “무한히 더해도 되는가”라는 질문에서 출발합니다. **등비급수**라는 가장 중요한 예에서 시작해 **비율·근 판정법**, 거듭제곱급수의 **수렴반지름**, 그리고 함수를 급수로 쓰는 **테일러 급수**와 그 부산물인 **오일러 공식**까지 정리합니다.`,
    goals: [
      R`등비급수의 합과 수렴 조건을 쓰고 다른 급수를 등비급수와 비교할 수 있다`,
      R`비율 판정법, 근 판정법, 교대급수 판정법 중 알맞은 것을 골라 쓸 수 있다`,
      R`거듭제곱급수의 수렴반지름과 수렴구간(양 끝 포함 여부)을 구할 수 있다`,
      R`기본 매클로린 급수를 조합해 새 급수를 만들고 오일러 공식을 유도할 수 있다`,
    ],
    sections: [
      { k: '3.1', src: '미적분학 II · 수열과 급수', title: '수열의 극한과 등비급수', body: R`
급수 $\sum_{k=0}^\infty a_k$의 값은 **부분합** $S_n=a_0+a_1+\cdots+a_n$의 극한으로 정의합니다. 부분합이 유한한 값으로 가면 수렴, 아니면 발산입니다.

자주 쓰는 수열의 극한은 외워 두면 편합니다. $\lvert r\rvert<1$이면 $r^n\to0$, $a>1$이면 $n^k/a^n\to0$(지수가 거듭제곱을 이긴다), $a^n/n!\to0$(계승이 지수를 이긴다), $n^{1/n}\to1$, $\big(1+\frac1n\big)^n\to e$. 또 **위로 유계인 증가수열은 수렴**합니다(단조수렴정리).

:::key 등비급수
$$1+r+r^2+\cdots+r^{n-1}=\frac{1-r^n}{1-r}\quad(r\ne1),\qquad \sum_{k=0}^\infty r^k=\frac{1}{1-r}\quad(\lvert r\rvert<1)$$
$\lvert r\rvert\ge1$이면 발산합니다.
:::

유한합 공식은 $S_n-rS_n=1-r^n$에서 바로 나옵니다. 이 공식 하나가 여러 증명에서 반복해서 쓰입니다: 오일러 방법의 오차가 걸음마다 $(1+hL)$배로 불어날 때의 총합, 주기함수의 라플라스 변환에 나오는 $\frac{1}{1-e^{-ps}}$, 모멘텀 방법의 가중치 $\beta^k$의 합 $\frac1{1-\beta}$가 모두 등비급수입니다.

:::thm $n$번째 항 판정
$\sum a_k$가 수렴하면 $a_k\to0$입니다. 거꾸로는 성립하지 않습니다: 조화급수 $\sum\frac1k$는 $\frac1k\to0$인데도 발산합니다.
:::

:::ex 예제 1 (망원급수)
$\displaystyle\sum_{k=1}^\infty\frac{1}{k(k+1)}$을 구하세요.
---
$\dfrac1{k(k+1)}=\dfrac1k-\dfrac1{k+1}$이므로 부분합은 $1-\dfrac1{n+1}$로 이웃한 항이 서로 지워지고, 극한은 $1$입니다.
:::

:::ex 예제 2 (순환소수)
$0.\dot{3}\dot{6}=0.363636\ldots$을 분수로 쓰세요.
---
$0.36\,(1+0.01+0.01^2+\cdots)=\dfrac{0.36}{1-0.01}=\dfrac{36}{99}=\dfrac4{11}$.
:::
` },
      { k: '3.2', src: '미적분학 II · 수렴 판정', title: '수렴 판정법', body: R`
합을 직접 구할 수 없을 때도 수렴 여부는 판정할 수 있습니다. 대부분은 **등비급수와 비교**하는 발상입니다.

**비교 판정.** $0\le a_k\le b_k$이고 $\sum b_k$가 수렴하면 $\sum a_k$도 수렴합니다. 극한 비교 판정: $a_k/b_k\to c$ $(0<c<\infty)$이면 둘은 함께 수렴하거나 함께 발산합니다.

**$p$-급수.** $\sum\frac1{k^p}$는 $p>1$일 때만 수렴합니다. 적분 판정 $\int_1^\infty x^{-p}dx$와 같은 경계입니다[[ch02:2.3|이상적분: p-적분의 수렴 경계.]].

:::key 비율 판정법과 근 판정법
$$L=\lim_{k\to\infty}\left\lvert\frac{a_{k+1}}{a_k}\right\rvert\quad\text{또는}\quad L=\lim_{k\to\infty}\lvert a_k\rvert^{1/k}$$
$L<1$이면 $\sum a_k$는 절대수렴, $L>1$이면 발산, $L=1$이면 이 판정으로는 알 수 없습니다.
:::

$L<1$은 “결국에는 비가 $L$보다 조금 큰 등비급수보다 작다”는 뜻이라 수렴합니다. $L=1$인 대표적인 예가 $\sum\frac1k$(발산)와 $\sum\frac1{k^2}$(수렴)이라 판정이 불가능합니다.

**교대급수 판정.** $b_k$가 감소하며 0으로 가면 $\sum(-1)^kb_k$는 수렴하고, $n$항까지의 부분합의 오차는 첫 번째로 버린 항 $b_{n+1}$보다 작습니다.

**절대수렴과 조건수렴.** $\sum\lvert a_k\rvert$가 수렴하면 $\sum a_k$도 수렴합니다(절대수렴). $\sum\frac{(-1)^{k+1}}{k}=\ln2$처럼 절댓값을 붙이면 발산하는데 원래 급수는 수렴하는 경우를 조건수렴이라 합니다. 조건수렴하는 급수는 항의 순서를 바꾸면 합이 달라질 수 있습니다.

| 급수의 모양 | 먼저 써 볼 판정 |
|---|---|
| $k!$, $a^k$, $k^k$이 들어 있음 | 비율 판정 |
| 항 전체가 $k$제곱 꼴 $(\ldots)^k$ | 근 판정 |
| 유리함수 꼴 $\frac{\text{다항식}}{\text{다항식}}$ | $p$-급수와 극한 비교 |
| 부호가 번갈아 바뀜 | 교대급수 판정, 그다음 절대수렴 여부 |

:::ex 예제 1
$\displaystyle\sum_{k=1}^\infty\frac{k}{2^k}$와 $\displaystyle\sum_{k=1}^\infty\frac{k!}{k^k}$의 수렴을 판정하세요.
---
첫째: $\dfrac{a_{k+1}}{a_k}=\dfrac{k+1}{2k}\to\dfrac12<1$이므로 수렴합니다(합은 2).
둘째: $\dfrac{a_{k+1}}{a_k}=\dfrac{(k+1)!}{(k+1)^{k+1}}\cdot\dfrac{k^k}{k!}=\Big(\dfrac{k}{k+1}\Big)^k\to\dfrac1e<1$이므로 수렴합니다.
:::

:::warn 비율이 1로 가면 결론이 없다
$\sum\frac1{k^2}$도 $\sum\frac1k$도 비율은 1로 갑니다. 이때는 비교 판정이나 적분 판정으로 넘어가야 합니다. “비율이 1보다 작다”가 아니라 “비율의 **극한**이 1보다 작다”여야 한다는 점도 주의하세요. $\frac{k}{k+1}<1$이지만 극한은 1입니다.
:::
` },
      { k: '3.3', src: '미적분학 II · 거듭제곱급수', title: '거듭제곱급수와 수렴반지름', body: R`
**거듭제곱급수** $\sum_{k=0}^\infty a_k(x-x_0)^k$는 $x$에 대한 무한 다항식입니다. 수렴하는 $x$의 집합은 항상 $x_0$을 중심으로 한 구간이고, 그 반지름을 **수렴반지름** $R$이라 합니다.

:::key 수렴반지름
$$R=\lim_{k\to\infty}\left\lvert\frac{a_k}{a_{k+1}}\right\rvert\quad\text{(극한이 있을 때)},\qquad \frac1R=\limsup_{k\to\infty}\lvert a_k\rvert^{1/k}$$
$\lvert x-x_0\rvert<R$에서 절대수렴하고 $\lvert x-x_0\rvert>R$에서 발산합니다. 양 끝 $\lvert x-x_0\rvert=R$은 따로 확인해야 합니다.
:::

첫 공식은 비율 판정[[ch03:3.2|비율 판정법: 이웃한 항의 비의 극한이 1보다 작으면 수렴.]]을 $a_k(x-x_0)^k$에 쓴 것입니다. $R=\infty$이면 모든 $x$에서, $R=0$이면 $x_0$에서만 수렴합니다.

**수렴 구간 안에서는 다항식처럼 다룬다.** $\lvert x-x_0\rvert<R$에서 항별로 미분하고 적분해도 되고, 새 급수의 수렴반지름도 같습니다. 그래서 이미 아는 급수 하나로 많은 급수를 만들 수 있습니다.
$$\frac1{1-x}=\sum_{k=0}^\infty x^k\ \Rightarrow\ \frac1{(1-x)^2}=\sum_{k=1}^\infty kx^{k-1},\quad -\ln(1-x)=\sum_{k=1}^\infty\frac{x^k}{k}\qquad(\lvert x\rvert<1)$$
$x$ 대신 $-x^2$을 넣으면 $\dfrac1{1+x^2}=\sum(-1)^kx^{2k}$이고, 적분하면 $\arctan x=\sum\dfrac{(-1)^kx^{2k+1}}{2k+1}$입니다.

:::ex 예제 1 (양 끝 확인)
$\displaystyle\sum_{k=1}^\infty\frac{(x-2)^k}{k\,3^k}$의 수렴 구간은?
---
$\left\lvert\dfrac{a_k}{a_{k+1}}\right\rvert=\dfrac{(k+1)3^{k+1}}{k\,3^k}\to3$이므로 $R=3$, 중심 2. $x=5$이면 $\sum\frac1k$로 발산하고, $x=-1$이면 $\sum\frac{(-1)^k}{k}$로 수렴합니다. 수렴 구간은 $[-1,5)$입니다.
:::

:::idea 실수에서 매끄러운데 반지름이 1인 이유
$\frac1{1+x^2}$은 모든 실수에서 매끄러운데도 0 중심 급수의 수렴반지름은 1입니다. 복소평면에서 $x=\pm i$가 분모를 0으로 만들기 때문입니다. 수렴반지름은 **복소평면에서 가장 가까운 특이점까지의 거리**라는 사실은 복소해석의 테일러 급수에서 증명됩니다. 급수해법에서 해의 수렴반지름을 계수의 특이점으로 가늠하는 것도 같은 원리입니다.
:::
` },
      { k: '3.4', src: '미적분학 II · 테일러 급수', title: '테일러 급수와 오일러 공식', body: R`
테일러 다항식[[ch01:1.3|나머지항이 있는 테일러 정리: 근사 다항식과 오차의 정확한 식.]]의 차수를 끝없이 늘린 것이 **테일러 급수**입니다. 급수가 $f$로 수렴하는지는 나머지항이 0으로 가는지로 결정됩니다.

:::key 기본 매클로린 급수
$$e^x=\sum_{k=0}^\infty\frac{x^k}{k!},\qquad \sin x=\sum_{k=0}^\infty\frac{(-1)^kx^{2k+1}}{(2k+1)!},\qquad \cos x=\sum_{k=0}^\infty\frac{(-1)^kx^{2k}}{(2k)!}\qquad(\text{모든 }x)$$
$$\frac1{1-x}=\sum_{k=0}^\infty x^k,\qquad \ln(1+x)=\sum_{k=1}^\infty\frac{(-1)^{k+1}x^k}{k},\qquad (1+x)^\alpha=\sum_{k=0}^\infty\binom{\alpha}{k}x^k\qquad(\lvert x\rvert<1)$$
:::

$e^x$의 급수가 모든 $x$에서 $e^x$로 수렴하는 이유: 나머지항이 $\lvert R_n\rvert\le e^{\lvert x\rvert}\dfrac{\lvert x\rvert^{n+1}}{(n+1)!}$이고, 계승이 지수를 이기므로 0으로 갑니다.

:::warn 테일러 급수가 수렴해도 원래 함수와 다를 수 있다
$f(x)=e^{-1/x^2}$ ($f(0)=0$)은 0에서 모든 도함수가 0이라 테일러 급수가 0인데, $x\ne0$에서 $f(x)>0$입니다. 무한히 미분가능한 것만으로는 부족하고, 급수로 나타나는 함수(해석함수)여야 합니다.
:::

**오일러 공식.** $e^x$의 급수에 $x=i\theta$를 넣고 $i^2=-1$을 쓰면 짝수 차 항과 홀수 차 항이 각각 $\cos$와 $\sin$의 급수가 됩니다.

:::key 오일러 공식
$$e^{i\theta}=\cos\theta+i\sin\theta,\qquad \cos\theta=\frac{e^{i\theta}+e^{-i\theta}}{2},\qquad \sin\theta=\frac{e^{i\theta}-e^{-i\theta}}{2i}$$
:::

$\theta=\pi$를 넣으면 $e^{i\pi}=-1$이고, $\big(e^{i\theta}\big)^n=e^{in\theta}$에서 드무아브르 공식 $(\cos\theta+i\sin\theta)^n=\cos n\theta+i\sin n\theta$가 나옵니다. 상수계수 미분방정식의 복소 특성근, 푸리에 급수의 복소 형식, 교류 회로의 페이저가 모두 이 공식 위에 서 있습니다.

:::ex 예제 1 (급수로 적분하기)
$\displaystyle\int_0^1e^{-x^2}dx$를 오차 $0.001$ 이내로 어림하세요.
---
$e^{-x^2}=1-x^2+\dfrac{x^4}{2}-\dfrac{x^6}{6}+\dfrac{x^8}{24}-\cdots$를 항별로 적분하면
$$1-\frac13+\frac1{10}-\frac1{42}+\frac1{216}-\cdots$$
교대급수이므로 $\frac1{42}$까지 더한 $0.7429$의 오차는 다음 항 $\frac1{216}\approx0.0046$보다 작고, 한 항 더 더한 $0.7475$의 오차는 $\frac1{1320}\approx0.0008$보다 작습니다. 참값은 $0.7468\ldots$입니다.
:::

:::ex 예제 2 (급수의 곱)
$e^x\sin x$의 매클로린 급수를 $x^3$항까지 구하세요.
---
$\big(1+x+\tfrac{x^2}2+\tfrac{x^3}6\big)\big(x-\tfrac{x^3}6\big)=x+x^2+\big(\tfrac12-\tfrac16\big)x^3+\cdots=x+x^2+\tfrac13x^3+\cdots$
:::
` },
    ],
    problems: [
      { sec: '3.1', type: 'num', lv: 1, q: R`$\displaystyle\sum_{k=1}^\infty\Big(\frac23\Big)^k$의 값은?`, ans: '2', ansTex: R`2`,
        sol: R`첫째항 $\tfrac23$, 공비 $\tfrac23$: $\dfrac{2/3}{1-2/3}=2$.` },
      { sec: '3.1', type: 'num', lv: 2, q: R`$\beta=0.9$일 때 $\displaystyle\sum_{k=0}^\infty\beta^k$의 값은? (모멘텀 방법에서 과거 기울기에 곱해지는 가중치의 합)`, ans: '10', ansTex: R`10`,
        sol: R`$\dfrac1{1-0.9}=10$. 그래서 $\beta=0.9$인 모멘텀은 기울기를 대략 10걸음치 누적한 효과를 냅니다.` },
      { sec: '3.2', type: 'mc', lv: 1, q: R`비율 판정법으로 수렴 여부를 **판정할 수 없는** 급수는?`,
        choices: [R`$\sum\frac{3^k}{k!}$`, R`$\sum\frac{k^2}{2^k}$`, R`$\sum\frac1{k^3}$`, R`$\sum\frac{k!}{2^k}$`], ans: 2,
        sol: R`$\sum\frac1{k^3}$은 비의 극한이 $1$이라 판정이 불가능합니다($p$-급수로 보면 수렴). 첫째와 둘째는 비의 극한이 $0$, $\tfrac12$로 수렴, 넷째는 $\infty$로 발산입니다.` },
      { sec: '3.2', type: 'mc', lv: 2, q: R`$\displaystyle\sum_{k=1}^\infty\frac{(-1)^k}{\sqrt k}$에 대한 설명으로 옳은 것은?`,
        choices: [R`절대수렴한다`, R`조건수렴한다`, R`발산한다`, R`비율 판정으로 수렴이 보장된다`], ans: 1,
        sol: R`$\frac1{\sqrt k}$은 감소하며 0으로 가므로 교대급수 판정으로 수렴합니다. 그러나 $\sum\frac1{\sqrt k}$는 $p=\tfrac12\le1$이라 발산하므로 조건수렴입니다.` },
      { sec: '3.3', type: 'num', lv: 2, q: R`$\displaystyle\sum_{k=0}^\infty\frac{k^2}{4^k}x^k$의 수렴반지름은?`, ans: '4', ansTex: R`4`,
        sol: R`$\left\lvert\dfrac{a_k}{a_{k+1}}\right\rvert=\dfrac{k^2}{(k+1)^2}\cdot4\to4$.` },
      { sec: '3.3', type: 'num', lv: 2, q: R`$\displaystyle\sum_{k=1}^\infty\frac{k}{2^{k}}$의 값은? ($\sum kx^{k-1}=\frac1{(1-x)^2}$을 이용)`, ans: '2', ansTex: R`2`,
        sol: R`$\sum kx^k=\dfrac{x}{(1-x)^2}$에 $x=\tfrac12$: $\dfrac{1/2}{1/4}=2$.` },
      { sec: '3.4', type: 'num', lv: 1, q: R`$e^{-x^2}$의 매클로린 급수에서 $x^6$의 계수는?`, ans: '-1/6', ansTex: R`-\tfrac16`,
        sol: R`$e^u=\sum\frac{u^k}{k!}$에 $u=-x^2$: $x^6$항은 $\dfrac{(-x^2)^3}{3!}=-\dfrac{x^6}{6}$.` },
      { sec: '3.4', type: 'mc', lv: 2, q: R`$e^{i\pi/2}$의 값은?`,
        choices: [R`$i$`, R`$-1$`, R`$1$`, R`$-i$`], ans: 0,
        sol: R`$\cos\frac\pi2+i\sin\frac\pi2=0+i\cdot1=i$.` },
      { sec: '3.4', type: 'open', lv: 3, q: R`$\cos^2\theta=\dfrac{1+\cos2\theta}{2}$를 오일러 공식으로 유도하세요.`,
        sol: R`$\cos\theta=\frac{e^{i\theta}+e^{-i\theta}}2$이므로 $\cos^2\theta=\dfrac{e^{2i\theta}+2+e^{-2i\theta}}{4}=\dfrac{2+2\cos2\theta}{4}=\dfrac{1+\cos2\theta}2$. 삼각함수 공식을 외우지 않고 지수법칙만으로 얻을 수 있다는 것이 요점입니다.` },
    ],
  });
})();
