/* 07 최적화와 변분법 — Lagrangian Dynamics 자료 6.1, 수업 필기 4월 1일·6일 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 7, part: 'B', title: '최적화와 변분법: 오일러-라그랑주 방정식', en: 'Optimization & Calculus of Variations', ref: 'Lagrangian 자료 6.1 · 필기 4/1, 4/6', plot: 'dyVariation',
    fig: R`양 끝을 고정한 최적 경로와 그 주위의 변분 경로들`,
    tagline: R`함수의 최솟값에서는 기울기가 0입니다. 곡선 전체를 변수로 하는 적분의 최솟값에서는 “기울기가 0”이 미분방정식, 곧 오일러-라그랑주 방정식이 됩니다.`,
    summary: R`수업은 라그랑주 역학의 준비로 최적화를 복습합니다. $f:\mathbb R^n\to\mathbb R$의 극소점(또는 극대·안장점)에서는 **일차 필요조건** $\nabla f(x^\star)=0$이 성립하고, 헤시안이 양의 정부호면 극소임이 보장됩니다(**이차 충분조건**). 등식 제약 $g(x)=0$이 있으면 **라그랑주 승수** $\lambda$로 $\partial f/\partial x+\lambda^T\partial g/\partial x=0$을 씁니다. **변분법**은 변수가 곡선 $q(t)$인 문제 $\min\int_{t_0}^{t_f}L(q,\dot q,t)\,dt$입니다. 최적 곡선 주위의 비교 곡선 $q^\star+\varepsilon\eta$($\eta$는 양 끝에서 0)로 $\varepsilon$에 대한 도함수를 0으로 두고 부분적분하면 **오일러-라그랑주 방정식** $\dfrac{d}{dt}\dfrac{\partial L}{\partial\dot q}-\dfrac{\partial L}{\partial q}=0$이 나옵니다. $q$가 벡터면 성분마다 한 식씩, 끝점이 자유로우면 경계 조건 $\partial L/\partial\dot q=0$이 추가됩니다.`,
    goals: [
      R`기울기와 헤시안으로 다변수 함수의 임계점을 찾고 극소를 판정할 수 있다`,
      R`라그랑주 승수로 등식 제약 최적화 문제를 풀 수 있다`,
      R`변분 $q^\star+\varepsilon\eta$와 부분적분으로 오일러-라그랑주 방정식을 유도할 수 있다`,
      R`주어진 범함수의 오일러-라그랑주 방정식을 세우고 경계 조건으로 풀 수 있다`,
      R`벡터 경로와 자유 끝점에 대한 확장을 적용할 수 있다`,
    ],
    secTitles: { '6.1a': '함수의 최소화', '6.1b': '제약과 라그랑주 승수', '6.1c': '오일러-라그랑주 방정식', '6.1d': '다변수·자유 끝점' },
    sections: [
      { k: '6.1a', src: '수업 필기 · 4월 1일, 6일 · Lagrangian 자료 6.1.1', title: '함수의 최소화: 일차·이차 조건', body: R`
:::key 일차 필요조건
$x^\star$가 미분가능한 $f:\mathbb R^n\to\mathbb R$의 극소점(극대점, 안장점)이면
$$\nabla f(x^\star)=\Big(\frac{\partial f}{\partial x}\Big)^T=\begin{pmatrix}\partial f/\partial x_1\\\vdots\\\partial f/\partial x_n\end{pmatrix}=0.$$
기울기는 열벡터, $\partial f/\partial x$는 행벡터로 쓴다.
:::

필요조건일 뿐입니다: $\nabla f=0$인 점(임계점)은 극소·극대·안장점 중 무엇이든 될 수 있습니다(필기의 말안장 그림).

:::key 이차 충분조건
$\nabla f(x^\star)=0$이고 헤시안 $H=\big[\partial^2f/\partial x_i\partial x_j\big]$가 **양의 정부호**($H\succ0$)이면 $x^\star$는 극소점이다. $2\times2$에서는 $H_{11}>0$이고 $\det H>0$이면 양의 정부호다[[@base:ch04:4.3|다변수 테일러 전개. 임계점 근처에서 $f\approx f(x^\star)+\tfrac12\Delta x^TH\Delta x$입니다.]].
:::

:::ex 예제 1
$f(x)=x_1^2+x_1x_2+x_2^2-3x_1$의 임계점과 종류는?
---
$\nabla f=(2x_1+x_2-3,\ x_1+2x_2)=0$ → $x_1=2$, $x_2=-1$.
$H=\begin{pmatrix}2&1\\1&2\end{pmatrix}$, $H_{11}=2>0$, $\det H=3>0$ → 극소. 값 $f=4-2+1-6=-3$.
:::

:::note 벡터 함수의 미분 (야코비안)
$g:\mathbb R^n\to\mathbb R^m$이면 $\partial g/\partial x$는 $i$행이 $\partial g_i/\partial x$인 $m\times n$ 행렬입니다[[@base:ch04:4.2|야코비 행렬. 각 성분 함수의 기울기를 행으로 쌓은 것입니다.]]. 다음 절의 제약 조건에서 씁니다.
:::
` },
      { k: '6.1b', src: 'Lagrangian 자료 6.1.1', title: '등식 제약과 라그랑주 승수', body: R`
:::key 라그랑주 승수
$g(x^\star)=0$($g:\mathbb R^n\to\mathbb R^m$, $m\le n$)을 만족하면서 $f$를 최소로 하는 $x^\star$에서는 어떤 $\lambda\in\mathbb R^m$이 있어
$$\frac{\partial f}{\partial x}(x^\star)+\lambda^T\frac{\partial g}{\partial x}(x^\star)=0.$$
$H(x,\lambda)=f+\lambda^Tg$로 두면 $\partial H/\partial x=0$, $\partial H/\partial\lambda=g=0$ — 제약 없는 문제처럼 풀린다.
:::

기하학적 뜻: 제약면 위에서 움직일 수 있는 방향(제약의 접평면)으로는 $f$가 변하지 않아야 하므로 $\nabla f$가 제약면의 법선들($\nabla g_i$)의 일차결합입니다[[@dnn:ch07:7.4|SVM의 라그랑주 승수와 쌍대 문제. 부등식 제약으로 확장한 것이 KKT 조건입니다.]].

:::ex 예제 2 — 직선 위의 가장 가까운 점
직선 $x_1+2x_2=5$ 위에서 원점에 가장 가까운 점은?
---
$H=\tfrac12(x_1^2+x_2^2)+\lambda(x_1+2x_2-5)$. $x_1+\lambda=0$, $x_2+2\lambda=0$, $x_1+2x_2=5$.
$x=-\lambda(1,2)$를 넣으면 $-5\lambda=5$, $\lambda=-1$, $x^\star=(1,2)$. 거리 $\sqrt5$.
:::

:::note 최소 제곱과 최소 노름
$\min\tfrac12\lVert Ax-b\rVert^2$은 $A^TAx=A^Tb$(방정식이 변수보다 많을 때), $\min\tfrac12\lVert x\rVert^2$ s.t. $Ax=b$는 $x=A^T(AA^T)^{-1}b$(변수가 방정식보다 많을 때)로 풀립니다. 둘째가 라그랑주 승수의 전형적인 예입니다.
:::
` },
      { k: '6.1c', src: '수업 필기 · 4월 1일 · Lagrangian 자료 6.1.2', title: '변분법과 오일러-라그랑주 방정식', body: R`
이제 변수가 곡선입니다. 시간 $t_0$에서 $t_f$까지의 곡선 $q(t)$(양 끝 값 고정)에 대해
$$J[q]=\int_{t_0}^{t_f}L\big(q(t),\dot q(t),t\big)\,dt$$
를 최소로 하는 $q^\star(t)$를 찾습니다. 수업은 이것을 “전체 라그랑지안을 극값으로 만드는 곡선”이라 불렀습니다.

:::fig dVariation
:::

**비교 곡선.** $q(t)=q^\star(t)+\varepsilon\eta(t)$, $\eta$는 임의의 매끄러운 곡선이고 $\eta(t_0)=\eta(t_f)=0$(끝점 고정). 그러면 $J$는 스칼라 $\varepsilon$의 함수 $g(\varepsilon)$가 되고, $\varepsilon=0$에서 최소이므로 $g'(0)=0$.

**미분.** 연쇄법칙으로 $\partial q/\partial\varepsilon=\eta$, $\partial\dot q/\partial\varepsilon=\dot\eta$:
$$g'(0)=\int_{t_0}^{t_f}\Big(\frac{\partial L}{\partial q}\eta+\frac{\partial L}{\partial\dot q}\dot\eta\Big)dt.$$

**부분적분.** $\int\frac{\partial L}{\partial\dot q}\dot\eta\,dt=\Big[\frac{\partial L}{\partial\dot q}\eta\Big]_{t_0}^{t_f}-\int\frac{d}{dt}\frac{\partial L}{\partial\dot q}\eta\,dt$이고 경계항은 $\eta$가 양 끝에서 0이라 사라집니다.

:::key 오일러-라그랑주 방정식
$$\int_{t_0}^{t_f}\Big(\frac{\partial L}{\partial q}-\frac{d}{dt}\frac{\partial L}{\partial\dot q}\Big)\eta\,dt=0\ \ (\text{모든 }\eta)\quad\Longrightarrow\quad\frac{d}{dt}\frac{\partial L}{\partial\dot q}-\frac{\partial L}{\partial q}=0$$
마지막 단계는 “모든 연속함수 $\eta$와의 적분이 0이면 그 함수는 0”이라는 변분법의 기본 보조정리다.
:::

:::ex 예제 3
$\int_0^1(\dot x^2+x^2)\,dt$를 $x(0)=0$, $x(1)=1$로 최소화하는 곡선은?
---
$L=\dot x^2+x^2$: $\partial L/\partial\dot x=2\dot x$, $\partial L/\partial x=2x$. E-L: $2\ddot x-2x=0$, $\ddot x=x$.
$x=A\sinh t+B\cosh t$, $x(0)=0$ → $B=0$, $x(1)=1$ → $A=1/\sinh1$. $x^\star(t)=\sinh t/\sinh1$.
:::

:::ex 예제 4 — 두 점 사이의 가장 짧은 곡선
평면의 곡선 $y(x)$의 길이 $\int\sqrt{1+y'^2}\,dx$를 최소로 하면?
---
$L$이 $y$에 무관하므로 E-L은 $\frac{d}{dx}\frac{y'}{\sqrt{1+y'^2}}=0$ → $y'$ 일정 → 직선.
:::

:::warn 필요조건일 뿐
E-L 방정식은 일차 필요조건입니다. 해가 최소인지는 따로 확인해야 하고(이차 변분), 미분 불가능한 곡선이 더 작은 값을 줄 수도 있습니다. 교재의 예: $\int_0^2x^2(1-\dot x)^2dt$, $x(0)=0$, $x(2)=1$은 꺾인 곡선 $x=\max(0,t-1)$이 적분값 0(최소)을 주지만 이 곡선은 $t=1$에서 미분이 안 됩니다.
:::
` },
      { k: '6.1d', src: 'Lagrangian 자료 6.1.2 (Multidimensional Case) · 필기 4월 1일', title: '벡터 경로와 자유 끝점', body: R`
:::key 벡터 경로의 오일러-라그랑주 방정식
$q=(q_1,\dots,q_n)$이면 성분마다 독립인 변분 $\eta_i$를 줄 수 있으므로
$$\frac{d}{dt}\frac{\partial L}{\partial\dot q_i}-\frac{\partial L}{\partial q_i}=0,\qquad i=1,\dots,n\quad(n\text{개의 식})$$
:::

:::key 자유 끝점의 경계 조건
$q(t_f)$가 정해지지 않았으면 $\eta(t_f)$가 0일 필요가 없어 부분적분의 경계항이 남는다. 그 항도 0이어야 하므로
$$\frac{\partial L}{\partial\dot q}\Big|_{t=t_f}=0.$$
:::

:::ex 예제 5
$\int_0^{1}(\dot x^2+2x)\,dt$, $x(0)=0$, $x(1)$ 자유일 때 최소 곡선은?
---
E-L: $\frac{d}{dt}(2\dot x)-2=0$ → $\ddot x=1$, $x=\tfrac12t^2+At$.
자유 끝: $\partial L/\partial\dot x=2\dot x(1)=0$ → $1+A=0$, $A=-1$. $x^\star=\tfrac12t^2-t$, $x(1)=-\tfrac12$.
:::
` },
    ],
    problems: [
      { sec: '6.1a', type: 'num', lv: 1, q: R`$f=x_1^2+x_1x_2+\tfrac12x_2^2-x_1-x_2$의 임계점에서 $x_2$의 값은?`, ans: '1', ansTex: R`1`,
        sol: R`$\nabla f=(2x_1+x_2-1,\ x_1+x_2-1)=0$ → $x_1=0$, $x_2=1$. 헤시안 $\begin{pmatrix}2&1\\1&1\end{pmatrix}$은 $2>0$, $\det=1>0$이라 극소(필기의 예).` },
      { sec: '6.1a', type: 'mc', lv: 1, q: R`$\nabla f(x^\star)=0$에 대한 설명으로 옳은 것은?`,
        choices: [R`$x^\star$는 반드시 최소점이다`, R`$x^\star$가 극소·극대·안장점이면 성립하는 필요조건이다`, R`헤시안이 양의 정부호임을 뜻한다`, R`$f$가 볼록함을 뜻한다`], ans: 1,
        sol: R`일차 필요조건입니다. 종류는 헤시안(이차 조건)으로 판정합니다.` },
      { sec: '6.1a', type: 'mc', lv: 2, q: R`$f=x_1^2-x_2^2$의 원점은?`,
        choices: [R`극소점`, R`극대점`, R`안장점`, R`임계점이 아니다`], ans: 2,
        sol: R`$\nabla f=(2x_1,-2x_2)=0$이지만 $H=\mathrm{diag}(2,-2)$는 부정부호 — 안장점입니다.` },
      { sec: '6.1b', type: 'num', lv: 2, q: R`직선 $x_1+2x_2=5$ 위에서 원점에 가장 가까운 점까지의 거리는?`, ans: 'sqrt(5)', ansTex: R`\sqrt5`,
        sol: R`라그랑주 승수로 $x^\star=(1,2)$, 거리 $\sqrt5$.` },
      { sec: '6.1b', type: 'num', lv: 2, q: R`$x_1x_2=4$ ($x_1,x_2>0$)에서 $x_1+x_2$의 최솟값은?`, ans: '4', ansTex: R`4`,
        sol: R`$H=x_1+x_2+\lambda(x_1x_2-4)$: $1+\lambda x_2=0$, $1+\lambda x_1=0$ → $x_1=x_2=2$, 합 4.` },
      { sec: '6.1c', type: 'mc', lv: 1, q: R`오일러-라그랑주 유도에서 부분적분의 경계항이 사라지는 이유는?`,
        choices: [R`$L$이 $t$에 무관하므로`, R`변분 $\eta$가 양 끝에서 0이므로`, R`$\partial L/\partial\dot q=0$이므로`, R`$\varepsilon=0$이므로`], ans: 1,
        sol: R`끝점이 고정이라 비교 곡선도 같은 끝점을 지나야 하므로 $\eta(t_0)=\eta(t_f)=0$입니다.` },
      { sec: '6.1c', type: 'num', lv: 2, q: R`$\int_0^1(\dot x^2+x^2)dt$, $x(0)=0$, $x(1)=1$의 최소 곡선에서 $x(0.5)$는?`, ans: 'sinh(0.5)/sinh(1)', ansTex: R`0.443`,
        sol: R`$x^\star=\sinh t/\sinh1$, $x(0.5)=0.5211/1.1752=0.443$.` },
      { sec: '6.1c', type: 'num', lv: 2, q: R`$\int_0^{\pi/2}(\dot x^2-x^2)dt$, $x(0)=0$, $x(\pi/2)=2$의 오일러-라그랑주 해에서 $x(\pi/6)$는?`, ans: '1', ansTex: R`1`,
        sol: R`E-L: $2\ddot x+2x=0$ → $x=A\sin t+B\cos t$. $B=0$, $A=2$. $x(\pi/6)=2\sin(\pi/6)=1$.` },
      { sec: '6.1c', type: 'mc', lv: 2, q: R`$L=\sqrt{1+\dot y^2}$ (곡선의 길이)의 오일러-라그랑주 해는?`,
        choices: [R`원`, R`직선`, R`포물선`, R`사이클로이드`], ans: 1,
        sol: R`$L$이 $y$에 무관해 $\partial L/\partial\dot y=\dot y/\sqrt{1+\dot y^2}$가 일정 → 기울기 일정.` },
      { sec: '6.1d', type: 'num', lv: 2, q: R`$\int_0^1(\dot x^2+2x)dt$, $x(0)=0$, $x(1)$ 자유일 때 최적 곡선의 $x(1)$은?`, ans: '-0.5', ansTex: R`-\tfrac12`,
        sol: R`$\ddot x=1$, $x=\tfrac12t^2+At$, 자유 끝 조건 $\dot x(1)=0$ → $A=-1$. $x(1)=-\tfrac12$.` },
      { sec: '6.1d', type: 'num', lv: 3, q: R`$\int_0^2(\dot x^2+x\dot x+x^2)dt$, $x(0)=1$, $x(2)$ 자유일 때 오일러-라그랑주 방정식은 $\ddot x=x$이다. 자유 끝 조건 $\partial L/\partial\dot x=2\dot x+x=0$ ($t=2$)을 만족하는 해의 $x(2)$는? (소수 셋째 자리)`, ans: '2/(2*cosh(2)+sinh(2))', ansTex: R`\tfrac{2}{2\cosh2+\sinh2}\approx0.179`,
        sol: R`$\partial L/\partial x=\dot x+2x$, $\frac{d}{dt}(2\dot x+x)=2\ddot x+\dot x$ → E-L: $2\ddot x+\dot x-\dot x-2x=0$, $\ddot x=x$. $x(0)=1$이므로 $x=\cosh t+A\sinh t$.
$t=2$: $2(\sinh2+A\cosh2)+\cosh2+A\sinh2=0$ → $A=-\dfrac{2\sinh2+\cosh2}{2\cosh2+\sinh2}=-0.988$.
$x(2)=\cosh2+A\sinh2=\dfrac{2\cosh^22-2\sinh^22}{2\cosh2+\sinh2}=\dfrac{2}{2\cosh2+\sinh2}=0.179$ ($\cosh^2-\sinh^2=1$).` },
      { sec: '6.1c', type: 'open', lv: 2, proof: true, q: R`양 끝이 고정된 곡선 $q(t)$에 대해 $\int_{t_0}^{t_f}L(q,\dot q,t)dt$가 $q^\star$에서 극값이면 오일러-라그랑주 방정식이 성립함을 변분과 부분적분으로 증명하세요.`,
        sol: R`
$\eta$를 $\eta(t_0)=\eta(t_f)=0$인 임의의 매끄러운 함수, $g(\varepsilon)=\int L(q^\star+\varepsilon\eta,\dot q^\star+\varepsilon\dot\eta,t)dt$. $\varepsilon=0$에서 극값이므로 $g'(0)=0$.
$g'(0)=\int\big(L_q\eta+L_{\dot q}\dot\eta\big)dt$ (연쇄법칙, $L$의 편미분은 $q^\star$에서).
둘째 항 부분적분: $\big[L_{\dot q}\eta\big]_{t_0}^{t_f}-\int\frac{d}{dt}L_{\dot q}\,\eta\,dt$, 경계항은 $\eta$의 끝값이 0이라 0.
$0=\int\big(L_q-\frac{d}{dt}L_{\dot q}\big)\eta\,dt$가 모든 $\eta$에 대해 성립. 괄호 안 연속함수 $h$가 어떤 점에서 0이 아니면 그 근처에서만 양인 $\eta$(끝점에서 0)를 골라 적분이 양이 되어 모순 → $h\equiv0$: $\frac{d}{dt}L_{\dot q}-L_q=0$.`,
        rubric: R`
- 비교 곡선과 $g'(0)=0$ — 2점
- 연쇄법칙 — 2점
- 부분적분과 경계항 소멸 — 3점
- 기본 보조정리 논증 — 3점` },
    ],
  });
})();
