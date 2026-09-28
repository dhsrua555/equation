/* 추가 연습문제 — 13 하강 보조정리와 경사하강법의 수렴. 5주차 월요일 필기의 두 증명과 같은 유형을 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 13,
    problems: [
      { sec: '13.2', type: 'open', lv: 3, proof: true, q: R`$f\in C^2$이고 $\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert$ ($\forall x,y$)일 때, 적분 표현 $\nabla f(y)-\nabla f(x)=\big(\int_0^1\nabla^2f(x+t(y-x))dt\big)(y-x)$을 써서 $-\beta I\preceq\nabla^2f(x)\preceq\beta I$ ($\forall x$)를 증명하세요. (5주차 필기)`,
        sol: R`
**적분 표현.** $\phi(t)=\nabla f(x+t(y-x))$이면 $\phi'(t)=\nabla^2f(x+t(y-x))(y-x)$ (연쇄법칙). 미적분의 기본정리로 $\nabla f(y)-\nabla f(x)=\int_0^1\phi'(t)dt=\big(\int_0^1\nabla^2f(x+t(y-x))dt\big)(y-x)$.
**내적.** $(y-x)$와 내적하면 $\langle\nabla f(y)-\nabla f(x),y-x\rangle=(y-x)^TH(x,y)(y-x)$, $H(x,y)=\int_0^1\nabla^2f(x+t(y-x))dt$. 코시-슈바르츠와 립시츠 조건으로 좌변은 $[-\beta\lVert y-x\rVert^2,\ \beta\lVert y-x\rVert^2]$ 안에 있습니다.
**$y=x+hv$.** $h^2v^TH(x,x+hv)v\in[-\beta h^2\lVert v\rVert^2,\ \beta h^2\lVert v\rVert^2]$. $h^2$으로 나누고 $h\to0$: $\nabla^2f$가 연속이라 $H(x,x+hv)\to\nabla^2f(x)$. 따라서 $-\beta\lVert v\rVert^2\le v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ ($\forall v$), 즉 $-\beta I\preceq\nabla^2f(x)\preceq\beta I$.`,
        rubric: R`
- 적분 표현(연쇄법칙 + 기본정리) — 3점
- 내적과 코시-슈바르츠·립시츠로 양쪽 한계 — 3점
- $y=x+hv$, $h^2$으로 나누기 — 2점
- 연속성으로 극한 — 2점` },
      { sec: '13.2', type: 'open', lv: 3, proof: true, q: R`역으로, $f\in C^2$이고 모든 $x$에서 $-\beta I\preceq\nabla^2f(x)\preceq\beta I$이면 $\nabla f$가 $\beta$-립시츠임을 보이세요.`,
        sol: R`
적분 표현에서 $\lVert\nabla f(y)-\nabla f(x)\rVert=\Big\lVert\int_0^1\nabla^2f(z_t)(y-x)dt\Big\rVert\le\int_0^1\lVert\nabla^2f(z_t)\rVert_2dt\ \lVert y-x\rVert$ ($z_t=x+t(y-x)$).
대칭행렬 $H$가 $-\beta I\preceq H\preceq\beta I$이면 모든 고윳값 $\lambda_i\in[-\beta,\beta]$이고, 대칭행렬의 연산자 노름은 $\lVert H\rVert_2=\max_i\lvert\lambda_i\rvert\le\beta$. 따라서 $\lVert\nabla f(y)-\nabla f(x)\rVert\le\beta\lVert y-x\rVert$.`,
        rubric: R`
- 적분 표현과 노름 부등식 — 4점
- 고윳값 범위 → 연산자 노름 $\le\beta$ — 4점
- 결론 — 2점` },
      { sec: '13.6', type: 'open', lv: 3, proof: true, q: R`$f=\frac1n\sum f_i$가 $L$-매끄럽고, $x_{t+1}=x_t-\eta_tg_t$, $\E[g_t\mid x_t]=\nabla f(x_t)$, $\E[\lVert g_t\rVert^2\mid x_t]\le G$일 때
$$\min_{1\le t\le T}\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_1)-f_*+\frac{LG}2\sum_{t=1}^T\eta_t^2}{\sum_{t=1}^T\eta_t}$$
을 증명하세요. (5주차 필기) 고정 보폭 $\eta$에서 $\eta\propto1/\sqrt T$로 두면 어떤 속도가 나오는가?`,
        sol: R`
**한 걸음.** $L$-매끄러움에 $x=x_{t+1}$, $y=x_t$: $f(x_{t+1})\le f(x_t)-\eta_t\langle\nabla f(x_t),g_t\rangle+\frac{L\eta_t^2}2\lVert g_t\rVert^2$.
**조건부 기댓값.** $\E_t\langle\nabla f(x_t),g_t\rangle=\langle\nabla f(x_t),\E_tg_t\rangle=\lVert\nabla f(x_t)\rVert^2$ (불편성), $\E_t\lVert g_t\rVert^2\le G$. 따라서 $\E_tf(x_{t+1})\le f(x_t)-\eta_t\lVert\nabla f(x_t)\rVert^2+\frac{L\eta_t^2}2G$.
**탑 성질.** 전체 기댓값: $\E f(x_{t+1})\le\E f(x_t)-\eta_t\E\lVert\nabla f(x_t)\rVert^2+\frac L2\eta_t^2G$. 재배열해 $t=1..T$로 더하면 망원급수:
$$\sum_t\eta_t\E\lVert\nabla f(x_t)\rVert^2\le f(x_1)-\E f(x_{T+1})+\frac{LG}2\sum\eta_t^2\le f(x_1)-f_*+\frac{LG}2\sum\eta_t^2.$$
**최솟값.** 왼쪽 $\ge(\min_t\E\lVert\nabla f(x_t)\rVert^2)\sum_t\eta_t$. 나누면 결과.
**고정 보폭.** $\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$. $\eta=c/\sqrt T$이면 $\big(\frac{f(x_1)-f_*}c+\frac{LGc}2\big)\frac1{\sqrt T}=O(1/\sqrt T)$.`,
        rubric: R`
- 매끄러움 부등식 적용 — 2점
- 불편성과 $G$로 조건부 기댓값 — 2점
- 탑 성질 — 2점
- 망원급수와 $f_*$ — 2점
- 최솟값 논법과 $O(1/\sqrt T)$ — 2점` },
      { sec: '13.6', type: 'open', lv: 2, proof: true, q: R`$A,B,T>0$일 때 $\phi(\eta)=\frac A{\eta T}+B\eta$ ($\eta>0$)의 최솟값이 $2\sqrt{AB/T}$이고 최소점이 $\eta^*=\sqrt{A/(BT)}$임을 보이세요.`,
        sol: R`
$\phi'(\eta)=-\frac A{\eta^2T}+B=0\iff\eta^2=\frac A{BT}$. $\phi''(\eta)=\frac{2A}{\eta^3T}>0$이라 최소. $\phi(\eta^*)=\frac A{T}\sqrt{\frac{BT}A}+B\sqrt{\frac A{BT}}=\sqrt{\frac{AB}T}+\sqrt{\frac{AB}T}=2\sqrt{\frac{AB}T}$.
(산술-기하 평균으로도: $\frac A{\eta T}+B\eta\ge2\sqrt{\frac{AB}T}$, 등호는 두 항이 같을 때.)`,
        rubric: R`
- 도함수와 정류점 — 4점
- 최소 확인 — 2점
- 최솟값 계산 — 4점` },
      { sec: '13.6', type: 'num', lv: 2, q: R`고정 보폭 SGD의 보장 $\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$에서 $f(x_1)-f_*=8$, $L=2$, $G=1$, $T=200$일 때 보장을 최소로 하는 $\eta$는?`, ans: '0.2', ansTex: R`0.2`,
        sol: R`$A=8$, $B=LG/2=1$. $\eta^*=\sqrt{A/(BT)}=\sqrt{8/200}=0.2$, 이때 보장은 $2\sqrt{AB/T}=2\sqrt{0.04}=0.4$.` },
      { sec: '13.6', type: 'open', lv: 2, proof: true, q: R`$\E_t[g]=\nabla f(x_t)$일 때 $\E_t\lVert g\rVert^2=\lVert\nabla f(x_t)\rVert^2+\E_t\lVert g-\nabla f(x_t)\rVert^2$임을 보이고, 슬라이드의 “분산”이 정확히는 무엇인지 설명하세요.`,
        sol: R`
$g=\nabla f+(g-\nabla f)$로 쓰면 $\lVert g\rVert^2=\lVert\nabla f\rVert^2+2\langle\nabla f,g-\nabla f\rangle+\lVert g-\nabla f\rVert^2$. $x_t$가 주어지면 $\nabla f(x_t)$는 상수이고 $\E_t[g-\nabla f]=0$이라 가운데 항의 기댓값은 0. 따라서 결과.
$\E_t\lVert g\rVert^2$는 **2차 모멘트**(= 편향² $\lVert\nabla f\rVert^2$ + 분산 $\E_t\lVert g-\nabla f\rVert^2$)입니다. 기울기가 0에 가까워질수록 분산 쪽이 주가 됩니다.`,
        rubric: R`
- 분해와 전개 — 4점
- 교차항이 0인 이유 — 4점
- 해석 — 2점` },
      { sec: '13.4', type: 'num', lv: 1, q: R`$\beta=8$일 때 GD 한 걸음의 감소량 하한 $(\eta-\frac\beta2\eta^2)\lVert\nabla f\rVert^2$을 최대로 하는 학습률은?`, ans: '0.125', ansTex: R`1/8`,
        sol: R`$\eta=1/\beta=0.125$. 이때 감소량은 $\frac1{16}\lVert\nabla f\rVert^2$.` },
      { sec: '13.6', type: 'mc', lv: 1, q: R`5주차 필기에서 쓴 탑 성질(tower property)은?`,
        choices: [R`$\E[XY]=\E X\E Y$`, R`$\E\big[\E[Z\mid x_t]\big]=\E[Z]$`, R`$\E[Z\mid x_t]=Z$`, R`$\Var(\E[Z\mid x_t])=\Var Z$`], ans: 1,
        sol: R`조건부 기댓값을 다시 평균하면 원래 기댓값입니다. 한 걸음 부등식(조건부)을 전체 기댓값으로 바꿀 때 씁니다.` },
      { sec: '13.4', type: 'open', lv: 2, proof: true, q: R`$\beta$-매끄러운 $f$ (하한 $f^*$)에 $\eta=1/\beta$의 GD를 $T$번 쓰면 $\min_{0\le t<T}\lVert\nabla f(x_t)\rVert^2\le\frac{2\beta(f(x_0)-f^*)}T$임을 보이세요.`,
        sol: R`
감소 조건에서 $\eta=1/\beta$이면 $f(x_{t+1})\le f(x_t)-\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2$. 즉 $\lVert\nabla f(x_t)\rVert^2\le2\beta\big(f(x_t)-f(x_{t+1})\big)$.
$t=0..T-1$로 더하면 망원급수: $\sum\lVert\nabla f(x_t)\rVert^2\le2\beta(f(x_0)-f(x_T))\le2\beta(f(x_0)-f^*)$. 최솟값 $\le$ 평균이므로 $\min_t\lVert\nabla f(x_t)\rVert^2\le\frac{2\beta(f(x_0)-f^*)}T$.`,
        rubric: R`
- 한 걸음 부등식 — 3점
- 망원급수와 하한 — 4점
- 최솟값 ≤ 평균 — 3점` },
    ],
  });
})();
