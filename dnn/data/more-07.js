/* 추가 연습문제 — 07 서포트 벡터 머신. Problem Set 1 문제 3·4와 같은 유형을 중심으로 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 7,
    secTitles: { '7.6': '쌍대 문제 손풀이', '7.7': '최대-최소 부등식' },
    problems: [
      { sec: '7.6', type: 'open', lv: 3, proof: true, q: R`**(Problem Set 1 문제 3)** 2차원 자료 $x_1=(0,0)$, $y_1=-1$; $x_2=(2,2)$, $y_2=+1$.
1. 원문제 $\min_{w,b}\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$ ($i=1,2$)의 라그랑지안을 승수 $\alpha_1,\alpha_2\ge0$으로 쓰고, $w,b$에 대해 최소화해 $\alpha_1,\alpha_2$에 대한 쌍대 문제를 유도하시오. 최적 승수를 구하시오.
2. 최적 승수로 최적 $w,b$를 복원하시오.
3. 분리 초평면 $w^Tx+b=0$을 쓰고 마진을 구하시오.`,
        sol: R`
**1.** $L=\frac12\lVert w\rVert^2+\alpha_1(1+b)+\alpha_2(1-2w_1-2w_2-b)$.
$\nabla_wL=w-\alpha_2(2,2)=0\Rightarrow w=(2\alpha_2,2\alpha_2)$; $\partial_bL=\alpha_1-\alpha_2=0$.
대입: $g(\alpha)=\alpha_1+\alpha_2-4\alpha_2^2$. 쌍대 문제: $\max\ \alpha_1+\alpha_2-4\alpha_2^2$ s.t. $\alpha_1=\alpha_2$, $\alpha_i\ge0$.
$\alpha_1=\alpha_2=\alpha$: $2\alpha-4\alpha^2$ 최대 $\Rightarrow\alpha=\tfrac14$. $\alpha_1^*=\alpha_2^*=\tfrac14$.
**2.** $w^*=(\tfrac12,\tfrac12)$. $\alpha_2>0$이므로 $x_2$는 서포트 벡터: $w^Tx_2+b=1\Rightarrow2+b=1\Rightarrow b^*=-1$ ($x_1$에서도 $b=-1$ 확인).
**3.** $\tfrac12x_1+\tfrac12x_2-1=0$, 즉 $x_1+x_2=2$. 마진 $1/\lVert w^*\rVert=\sqrt2$ (두 마진 평면 사이 폭은 $2\sqrt2$). 확인: 원문제 값 $\tfrac14$ = 쌍대 값 $\tfrac14$.`,
        rubric: R`
- 라그랑지안 — 2점
- 정류 조건 두 개 — 2점
- 쌍대 함수와 제약 — 2점
- 최적 승수 — 1점
- $w,b$ 복원(서포트 벡터 사용 근거) — 2점
- 초평면과 마진 — 1점` },
      { sec: '7.7', type: 'open', lv: 3, proof: true, q: R`**(Problem Set 1 문제 4)** 공집합이 아닌 집합 $X,Y$와 $f:X\times Y\to\mathbb R$에 대해 최대-최소 부등식 $\max_{x\in X}\min_{y\in Y}f(x,y)\le\min_{y\in Y}\max_{x\in X}f(x,y)$를 증명하고, 등호가 성립하지 않는 반례를 제시하시오.`,
        sol: R`
**증명.** $g(x)=\min_yf(x,y)$, $h(y)=\max_xf(x,y)$. 임의의 $x'\in X$, $y'\in Y$에 대해
$$g(x')\le f(x',y')\le h(y').$$
모든 $y'$에 대해 $g(x')\le h(y')$이므로 $g(x')\le\min_{y'}h(y')$. 이제 모든 $x'$에 대해 성립하므로 $\max_{x'}g(x')\le\min_{y'}h(y')$. ∎ (최대·최소가 없으면 같은 논리로 $\sup\inf\le\inf\sup$.)
**반례.** $X=Y=\{0,1\}$, $f(x,y)=(x-y)^2$. $\min_yf(x,y)=0$ (각 $x$에서 $y=x$) → $\max_x\min_y=0$. $\max_xf(x,y)=1$ (각 $y$에서 $x\ne y$) → $\min_y\max_x=1$. $0<1$.`,
        rubric: R`
- 임의의 $x',y'$에서 $g(x')\le f(x',y')\le h(y')$ — 4점
- 두 단계의 최적화(순서와 근거) — 3점
- 반례와 두 값의 계산 — 3점` },
      { sec: '7.6', type: 'num', lv: 2, q: R`자료 $x_1=(1,0)$, $y_1=-1$; $x_2=(3,2)$, $y_2=+1$의 하드 마진 SVM에서 최적 승수 $\alpha_1=\alpha_2$의 값은?`, ans: '0.25', ansTex: R`\tfrac14`,
        sol: R`$\sum\alpha_iy_i=0\Rightarrow\alpha_1=\alpha_2=\alpha$, $w=\alpha(x_2-x_1)=\alpha(2,2)$. 쌍대 목적 $2\alpha-\frac12\alpha^2\lVert x_2-x_1\rVert^2=2\alpha-4\alpha^2$ (일반식 $\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j=\alpha^2\lVert x_2-x_1\rVert^2$). 최대 $\alpha=\tfrac14$.` },
      { sec: '7.6', type: 'num', lv: 2, q: R`위 문제에서 절편 $b$는?`, ans: '-1.5', ansTex: R`-\tfrac32`,
        sol: R`$w=\tfrac14(2,2)=(\tfrac12,\tfrac12)$. $x_2$에서 $w^Tx_2+b=\tfrac52+b=1\Rightarrow b=-\tfrac32$ ($x_1$에서 $\tfrac12+b=-1$ 확인). 초평면 $x_1+x_2=3$, 두 점의 중점 $(2,1)$을 지납니다.` },
      { sec: '7.6', type: 'num', lv: 1, q: R`하드 마진 SVM의 해가 $w=(\tfrac12,\tfrac12)$일 때 마진 $1/\lVert w\rVert$는? (소수 넷째 자리)`, ans: 'sqrt(2)', ansTex: R`\sqrt2\approx1.4142`,
        sol: R`$\lVert w\rVert=\sqrt{\tfrac14+\tfrac14}=\tfrac1{\sqrt2}$, 마진 $\sqrt2$.` },
      { sec: '7.4', type: 'open', lv: 2, proof: true, q: R`라그랑주 쌍대로 $\min_x(x-2)^2$ s.t. $x\le1$을 푸세요: 라그랑지안, 쌍대 함수 $g(\alpha)$, 최적 $\alpha$, 원래 해를 구하고 강한 쌍대성을 확인하세요.`,
        sol: R`
제약 $x-1\le0$. $L=(x-2)^2+\alpha(x-1)$, $\alpha\ge0$.
$\partial_xL=2(x-2)+\alpha=0\Rightarrow x=2-\frac\alpha2$. 대입: $g(\alpha)=\frac{\alpha^2}4+\alpha\big(1-\frac\alpha2\big)=\alpha-\frac{\alpha^2}4$.
$g'(\alpha)=1-\frac\alpha2=0\Rightarrow\alpha^*=2\ (\ge0)$, $g^*=1$. $x^*=2-1=1$, 원문제 값 $(1-2)^2=1=g^*$.
$\alpha^*>0$이고 $x^*=1$에서 제약이 등호 — 상보성 $\alpha^*(x^*-1)=0$과 일치.`,
        rubric: R`
- 라그랑지안(부호 주의) — 2점
- 쌍대 함수 — 3점
- 최적 승수와 해 — 3점
- 강한 쌍대성·상보성 확인 — 2점` },
      { sec: '7.5', type: 'open', lv: 3, proof: true, q: R`하드 마진 SVM에서 강한 쌍대성 $\frac12\lVert w^*\rVert^2=\max_{\alpha\ge0}\min_{w,b}L_p$가 성립하고 $(w^*,b^*,\alpha^*)$가 최적이라 할 때, KKT 상보성 $\alpha_i^*\big(1-y_i(w^{*T}x_i+b^*)\big)=0$ ($\forall i$)을 증명하세요.`,
        sol: R`
쌍대 최적값은 $g(\alpha^*)=\min_{w,b}L_p(w,b,\alpha^*)\le L_p(w^*,b^*,\alpha^*)=\frac12\lVert w^*\rVert^2+\sum_i\alpha_i^*\big(1-y_i(w^{*T}x_i+b^*)\big)$.
원문제 가능성에서 각 괄호 $\le0$, $\alpha_i^*\ge0$이므로 합은 $\le0$, 따라서 $L_p(w^*,b^*,\alpha^*)\le\frac12\lVert w^*\rVert^2$.
강한 쌍대성 $g(\alpha^*)=\frac12\lVert w^*\rVert^2$이므로 위 부등식들이 모두 등호: $\sum_i\alpha_i^*(1-y_i(\cdot))=0$. 각 항이 $\le0$인데 합이 0이므로 각 항이 0입니다.`,
        rubric: R`
- 쌍대 값 ≤ 라그랑지안 값 — 3점
- 각 항의 부호 — 3점
- 강한 쌍대성으로 등호, 각 항 0 — 4점` },
      { sec: '7.7', type: 'open', lv: 2, proof: true, q: R`$X=Y=\{-1,1\}$, $f(x,y)=xy$ (동전 맞히기, $x$가 최대화)에서 $\max_x\min_yf$와 $\min_y\max_xf$를 구하고, 안장점이 없음을 보이세요.`,
        sol: R`
$\min_yxy=-1$ ($y=-x$)이므로 $\max_x\min_y=-1$. $\max_xxy=1$ ($x=y$)이므로 $\min_y\max_x=1$. $-1<1$.
안장점 $(x^*,y^*)$이면 $f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$ ($\forall x,y$)인데, 그러면 $\max_xf(x,y^*)=f(x^*,y^*)=\min_yf(x^*,y)$에서 $1=f(x^*,y^*)=-1$ — 모순. (안장점이 있으면 두 값이 같아야 함.)`,
        rubric: R`
- 두 값 계산 — 5점
- 안장점이 있으면 등호가 됨을 이용한 모순 — 5점` },
      { sec: '7.7', type: 'open', lv: 3, proof: true, q: R`$(x^*,y^*)$가 $f$의 안장점, 즉 모든 $x\in X$, $y\in Y$에서 $f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$이면 $\max_x\min_yf=\min_y\max_xf=f(x^*,y^*)$임을 보이세요.`,
        sol: R`
왼쪽 부등식에서 $\max_xf(x,y^*)=f(x^*,y^*)$ (등호는 $x=x^*$), 오른쪽에서 $\min_yf(x^*,y)=f(x^*,y^*)$.
$\min_y\max_xf\le\max_xf(x,y^*)=f(x^*,y^*)=\min_yf(x^*,y)\le\max_x\min_yf$.
최대-최소 부등식 $\max_x\min_y\le\min_y\max_x$와 합치면 모두 등호.`,
        rubric: R`
- 안장점 조건에서 두 등식 — 4점
- 부등식 사슬 — 4점
- 최대-최소 부등식과 결합 — 2점` },
      { sec: '7.6', type: 'mc', lv: 2, q: R`하드 마진 SVM에서 옳은 것은?`,
        choices: [R`모든 훈련점의 $\alpha_i$가 양수이다`, R`마진 밖($y_i(w^Tx_i+b)>1$)의 점을 지워도 해가 변하지 않는다`, R`$b$는 쌍대 문제에서 직접 나온다`, R`쌍대 문제는 $w$에 대한 이차계획법이다`], ans: 1,
        sol: R`상보성에서 마진 밖의 점은 $\alpha_i=0$이라 $w=\sum\alpha_iy_ix_i$에 기여하지 않습니다. $b$는 서포트 벡터에서 따로 구하고, 쌍대 문제는 $\alpha$에 대한 QP입니다.` },
    ],
  });
})();
