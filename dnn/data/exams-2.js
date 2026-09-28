/* 실전 모의고사 추가 — IV: Problem Set 1과 같은 유형의 증명 모의고사, V: 5주차(최적화) 범위. 연습문제와 겹치지 않는 새 문항입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x4', roman: 'IV', kind: 'Problem Set 1 유형 · 증명', title: '발산, MAP, SVM 쌍대, 최대-최소', scopeText: '02·03·07 단원',
    desc: 'Problem Set 1의 네 문제(JS 발산, 가우시안 MAP과 편향-분산, 두 점 SVM의 쌍대, 최대-최소 부등식)와 같은 유형을 조건만 바꿔 냈습니다. 풀이 과정 전체를 채점합니다.',
    minutes: 100, plot: 'entropy',
    problems: [
      { ch: 'ch03', type: 'open', lv: 3, pts: 22, q: R`$\lambda\in(0,1)$과 두 확률분포 $p,q$에 대해 **비대칭 JS 발산**을 $D_\lambda(p\Vert q)=\lambda\KL(p\Vert m_\lambda)+(1-\lambda)\KL(q\Vert m_\lambda)$, $m_\lambda=\lambda p+(1-\lambda)q$로 정의한다. 다음을 증명하시오.
(i) $D_\lambda(p\Vert q)\ge0$ (ii) $D_\lambda(p\Vert q)=0\iff p=q$ (iii) $D_\lambda(p\Vert q)=D_{1-\lambda}(q\Vert p)$ (iv) $D_\lambda(p\Vert q)\le-\lambda\log\lambda-(1-\lambda)\log(1-\lambda)$.`,
        rubric: R`
- $m_\lambda$가 확률분포이고 KL이 유한함($m_\lambda\ge\lambda p$) — 2점
- (i) KL 비음성과 양의 가중치 — 4점
- (ii) 두 방향, “음이 아닌 두 항의 합이 0 ⇒ 각각 0”, Theorem 1의 등호 — 6점
- (iii) $m_{1-\lambda}(q,p)=m_\lambda(p,q)$와 가중치 교환 — 4점
- (iv) $p/m_\lambda\le1/\lambda$, $q/m_\lambda\le1/(1-\lambda)$로 상한 — 6점`,
        sol: R`
$m_\lambda\ge0$, 합 $\lambda+(1-\lambda)=1$. $p(x)>0$이면 $m_\lambda(x)\ge\lambda p(x)>0$이라 $\KL(p\Vert m_\lambda)<\infty$ ($q$도 같음).
**(i)** 두 KL이 $\ge0$이고 가중치 $\lambda,1-\lambda>0$이므로 합 $\ge0$.
**(ii)** $p=q\Rightarrow m_\lambda=p\Rightarrow$ 두 KL이 0. 역으로 $D_\lambda=0$이면 양의 가중치를 곱한 음이 아닌 두 항의 합이 0이라 $\KL(p\Vert m_\lambda)=\KL(q\Vert m_\lambda)=0$, 등호 조건으로 $p=m_\lambda=q$.
**(iii)** $D_{1-\lambda}(q\Vert p)=(1-\lambda)\KL(q\Vert m')+\lambda\KL(p\Vert m')$, $m'=(1-\lambda)q+\lambda p=m_\lambda$. 두 항이 $D_\lambda(p\Vert q)$의 두 항과 같습니다.
**(iv)** $p>0$에서 $\frac p{m_\lambda}\le\frac1\lambda$이므로 $\KL(p\Vert m_\lambda)\le\log\frac1\lambda$; 마찬가지로 $\KL(q\Vert m_\lambda)\le\log\frac1{1-\lambda}$. 가중합 $\le\lambda\log\frac1\lambda+(1-\lambda)\log\frac1{1-\lambda}$ (이진 엔트로피). $\lambda=\tfrac12$이면 $\log2$ — 보통의 JS.` },
      { ch: 'ch03', type: 'num', lv: 2, pts: 8, q: R`$p=(\tfrac12,\tfrac12,0)$, $q=(0,\tfrac12,\tfrac12)$일 때 $D_{JS}(p\Vert q)$를 자연로그로 구하시오. (소수 넷째 자리)`, ans: '0.5*ln(2)', ansTex: R`\tfrac12\ln2\approx0.3466`,
        sol: R`$m=(\tfrac14,\tfrac12,\tfrac14)$. $\KL(p\Vert m)=\tfrac12\ln\tfrac{1/2}{1/4}+\tfrac12\ln1=\tfrac12\ln2$, $\KL(q\Vert m)=\tfrac12\ln2$. 평균 $\tfrac12\ln2$. (한 칸만 겹치므로 최댓값 $\ln2$의 절반.)` },
      { ch: 'ch02', type: 'open', lv: 3, pts: 22, q: R`$X_1,\dots,X_n\overset{iid}{\sim}\N(\theta,\sigma^2)$ ($\sigma^2$ 알려짐), 사전분포 $\theta\sim\N(\mu_0,\tau^2)$.
1. MAP 추정량이 $\argmin_\theta\frac1{\sigma^2}\sum(X_i-\theta)^2+\frac1{\tau^2}(\theta-\mu_0)^2$의 해임을 보이고, $\hat\theta_{\text{MAP}}=a\bar X+(1-a)\mu_0$, $a=\frac{n\tau^2}{n\tau^2+\sigma^2}$임을 유도하시오.
2. $\hat\theta_{\text{MAP}}$의 편향, 분산, MSE를 구하시오(편향-분산 분해를 증명 없이 써도 됨).
3. $\sigma^2=4$, $n=16$, $\tau^2=1$, $\mu_0=2$, $\bar X=5$일 때 $\hat\theta_{\text{MAP}}$과, 참값이 $\theta=3$일 때의 MSE를 MLE($\bar X$)의 MSE와 비교하시오.`,
        rubric: R`
- 로그 사후분포와 목적함수 — 4점
- 미분·해와 $a$ — 5점
- 편향 $(1-a)(\mu_0-\theta)$, 분산 $a^2\sigma^2/n$ — 5점
- MSE — 3점
- 수치: $4.4$, MSE $0.2$ 대 $0.25$ — 5점`,
        sol: R`
**1.** $\log p(\theta\mid X)=-\frac1{2\sigma^2}\sum(X_i-\theta)^2-\frac1{2\tau^2}(\theta-\mu_0)^2+C$; $-2$배하면 주어진 목적함수. 미분: $-\frac2{\sigma^2}\sum(X_i-\theta)+\frac2{\tau^2}(\theta-\mu_0)=0\Rightarrow\theta\big(\frac n{\sigma^2}+\frac1{\tau^2}\big)=\frac{n\bar X}{\sigma^2}+\frac{\mu_0}{\tau^2}$. 분자·분모에 $\sigma^2\tau^2$를 곱하면 $\theta=\frac{n\tau^2\bar X+\sigma^2\mu_0}{n\tau^2+\sigma^2}=a\bar X+(1-a)\mu_0$. (이차함수, 이계도함수 양수 → 최소.)
**2.** $\E\hat\theta=a\theta+(1-a)\mu_0$ → 편향 $(1-a)(\mu_0-\theta)$. $\Var\hat\theta=a^2\Var\bar X=a^2\sigma^2/n$. MSE $=(1-a)^2(\mu_0-\theta)^2+a^2\sigma^2/n$.
**3.** $a=\frac{16}{16+4}=0.8$, $\hat\theta=0.8(5)+0.2(2)=4.4$. $\theta=3$: 편향$^2=(0.2)^2(2-3)^2=0.04$, 분산 $0.64\cdot4/16=0.16$, MSE $0.20$ < MLE의 $\sigma^2/n=0.25$.` },
      { ch: 'ch07', type: 'open', lv: 3, pts: 26, q: R`자료 $x_1=(0,0)$, $y_1=-1$; $x_2=(2,0)$, $y_2=+1$; $x_3=(0,2)$, $y_3=+1$.
1. 원문제 $\min\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$의 라그랑지안을 쓰고 $w,b$에 대해 최소화해 쌍대 문제를 유도하시오.
2. 쌍대 문제를 풀어 $\alpha_1,\alpha_2,\alpha_3$을 구하시오.
3. $w,b$, 분리 초평면, 마진을 구하고 원문제 값과 쌍대 값이 같은지 확인하시오.`,
        rubric: R`
- 라그랑지안 — 3점
- 정류 조건 $w=\sum\alpha_iy_ix_i$, $\sum\alpha_iy_i=0$ — 5점
- 쌍대 목적함수(내적 계산) — 5점
- 최적 승수(제약 대입과 최대화) — 6점
- $w,b$ (서포트 벡터 근거) — 4점
- 초평면·마진·강한 쌍대성 확인 — 3점`,
        sol: R`
**1.** $L=\frac12\lVert w\rVert^2+\sum_i\alpha_i(1-y_i(w^Tx_i+b))$. $\nabla_w=0$: $w=\sum\alpha_iy_ix_i=\alpha_2(2,0)+\alpha_3(0,2)=(2\alpha_2,2\alpha_3)$ ($x_1=0$). $\partial_b=0$: $-\alpha_1+\alpha_2+\alpha_3=0$.
내적: $x_1$과의 내적은 0, $x_2^Tx_2=x_3^Tx_3=4$, $x_2^Tx_3=0$. 쌍대: $\max\ \alpha_1+\alpha_2+\alpha_3-\frac12(4\alpha_2^2+4\alpha_3^2)$ s.t. $\alpha_1=\alpha_2+\alpha_3$, $\alpha\ge0$.
**2.** 대입: $2\alpha_2+2\alpha_3-2\alpha_2^2-2\alpha_3^2$. 각 변수 독립으로 $2-4\alpha_j=0\Rightarrow\alpha_2=\alpha_3=\tfrac12$, $\alpha_1=1$.
**3.** $w=(1,1)$. 서포트 벡터 $x_1$: $0+b=-1\Rightarrow b=-1$ ($x_2$: $2-1=1$ ✓, $x_3$: $2-1=1$ ✓). 초평면 $x_1+x_2=1$. 마진 $1/\lVert w\rVert=1/\sqrt2$ (원점에서 직선까지 거리). 원문제 값 $\frac12\lVert w\rVert^2=1$, 쌍대 값 $1+\tfrac12+\tfrac12-\frac12(1+1)=1$ ✓.` },
      { ch: 'ch07', type: 'open', lv: 3, pts: 22, q: R`(1) 공집합이 아닌 $X,Y$와 $f:X\times Y\to\mathbb R$에 대해 $\sup_{x}\inf_{y}f(x,y)\le\inf_y\sup_xf(x,y)$를 증명하시오(최대·최소의 존재를 가정하지 말 것). (2) $X=Y=[-1,1]$, $f(x,y)=xy$에서 두 값을 구하고 등호가 성립함을 안장점으로 설명하시오. (3) $X=Y=\{-1,1\}$, $f(x,y)=xy$에서는 등호가 깨짐을 보이시오.`,
        rubric: R`
- (1) $\inf_yf(x',y)\le f(x',y')\le\sup_xf(x,y')$ — 4점
- (1) 하한·상한의 정의로 두 단계 — 5점
- (2) 두 값 0과 안장점 $(0,0)$ 확인 — 7점
- (3) $-1<1$ — 6점`,
        sol: R`
**(1)** 임의의 $x',y'$: $\inf_yf(x',y)\le f(x',y')\le\sup_xf(x,y')$. 왼쪽 $a(x')$는 모든 $y'$에 대해 $\le b(y')$이므로 $a(x')\le\inf_{y'}b(y')$ (하한은 가장 큰 아래 경계). 이것이 모든 $x'$에서 성립하므로 $\sup_{x'}a(x')\le\inf_{y'}b(y')$ (상한은 가장 작은 위 경계).
**(2)** $\inf_yxy=-\lvert x\rvert$ ($y=-\operatorname{sign}x$), $\sup_x(-\lvert x\rvert)=0$. $\sup_xxy=\lvert y\rvert$, $\inf_y\lvert y\rvert=0$. 둘 다 0. $(x^*,y^*)=(0,0)$: $f(x,0)=0\le f(0,0)=0\le f(0,y)=0$ — 안장점이므로 등호.
**(3)** $\min_yxy=-1$ (모든 $x$) → $\max_x\min_y=-1$. $\max_xxy=1$ (모든 $y$) → $\min_y\max_x=1$. $-1<1$. 연속 구간을 이산 두 점으로 바꾸면 안장점 $(0,0)$이 사라져 등호가 깨집니다.` },
    ],
  },
  {
    id: 'x5', roman: 'V', kind: '5주차 범위 · 최적화', title: '하강 보조정리, SGD, 모멘텀, Adam', scopeText: '13–14 단원',
    desc: '5주차 월요일의 두 강의(최적화 이론과 실전 최적화) 범위입니다. 매끄러움과 헤시안, SGD의 수렴 보장, 조건수, 모멘텀·네스테로프·AdaGrad·RMSProp·Adam의 계산과 증명.',
    minutes: 90, plot: 'momentum',
    problems: [
      { ch: 'ch13', type: 'mc', lv: 1, pts: 5, q: R`$f\in C^2$에서 “$\nabla f$가 $\beta$-립시츠”와 동치인 것은?`,
        choices: [R`$\nabla^2f\succeq\beta I$`, R`$-\beta I\preceq\nabla^2f(x)\preceq\beta I$ ($\forall x$)`, R`$\lVert\nabla f\rVert\le\beta$`, R`$f$가 볼록`], ans: 1,
        sol: R`5주차 필기: 적분 표현과 코시-슈바르츠로 (⇒), 연산자 노름으로 (⇐).` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 7, q: R`$\beta=4$, $f(x)=5$, $\nabla f(x)=(2,0,-1)$일 때 GD 한 걸음 $\eta=0.25$ 뒤 $f(x_{t+1})$의 상한은?`, ans: '4.375', ansTex: R`4.375`,
        sol: R`$f-(\eta-\frac\beta2\eta^2)\lVert\nabla f\rVert^2=5-(0.25-0.125)\cdot5=5-0.625=4.375$.` },
      { ch: 'ch13', type: 'open', lv: 3, pts: 20, q: R`$f=\frac1n\sum f_i$가 $L$-매끄럽고 하한 $f_*$, SGD $x_{t+1}=x_t-\eta g_t$ (고정 보폭), $\E[g_t\mid x_t]=\nabla f(x_t)$, $\E[\lVert g_t\rVert^2\mid x_t]\le G$일 때 $\frac1T\sum_{t=1}^T\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$를 증명하고, 이 상한을 최소로 하는 $\eta$와 그때의 값을 구하시오.`,
        rubric: R`
- 하강 보조정리 적용 — 3점
- 불편성·2차 모멘트로 조건부 기댓값 — 4점
- 탑 성질과 망원급수 — 5점
- $T$로 나누기 — 2점
- 최적 $\eta$와 값 — 6점`,
        sol: R`
$f(x_{t+1})\le f(x_t)-\eta\langle\nabla f(x_t),g_t\rangle+\frac{L\eta^2}2\lVert g_t\rVert^2$. $\E_t$: $\E_tf(x_{t+1})\le f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac{L\eta^2}2G$. 전체 기댓값(탑 성질), 재배열, $t=1..T$ 합: $\eta\sum\E\lVert\nabla f\rVert^2\le f(x_1)-\E f(x_{T+1})+\frac{L\eta^2}2GT\le f(x_1)-f_*+\frac{L\eta^2GT}2$. $\eta T$로 나누면 결과.
$\phi(\eta)=\frac A{\eta T}+B\eta$ ($A=f(x_1)-f_*$, $B=LG/2$): $\eta^*=\sqrt{\frac A{BT}}=\sqrt{\frac{2(f(x_1)-f_*)}{LGT}}$, 최솟값 $2\sqrt{\frac{AB}T}=\sqrt{\frac{2(f(x_1)-f_*)LG}T}=O(1/\sqrt T)$.` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 7, q: R`$f(x_1,x_2)=\frac12(4x_1^2+x_2^2)$에 GD를 쓸 때 수렴하는 학습률의 상한은?`, ans: '0.5', ansTex: R`2/\lambda_{\max}=0.5`,
        sol: R`헤시안 $\diag(4,1)$, $\lambda_{\max}=4$, 상한 $2/4=0.5$. 조건수 4.` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 7, q: R`$f(x)=x^2$ ($f'=2x$), $x_t=1$, $v_t=-0.5$, $\rho=0.9$, $\alpha=0.1$일 때 네스테로프 모멘텀의 $x_{t+1}$은?`, ans: '0.44', ansTex: R`0.44`,
        sol: R`앞 지점 $y=1+0.9(-0.5)=0.55$. $x_{t+1}=y-\alpha f'(y)=0.55-0.1(1.1)=0.44$. (모멘텀이었다면 $0.55-0.1f'(1)=0.35$.)` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 7, q: R`AdaGrad ($\alpha=0.1$, $\varepsilon$ 무시)에서 한 좌표의 기울기가 차례로 $3$, $4$일 때 **둘째** 걸음의 크기는?`, ans: '0.08', ansTex: R`0.08`,
        sol: R`$A_2=9+16=25$, 걸음 $0.1\cdot4/\sqrt{25}=0.08$. (첫걸음은 $0.1\cdot3/3=0.1$.)` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 7, q: R`Adam ($\beta_1=0.9$, $\beta_2=0.999$)에서 $t=2$일 때 1차 모멘트의 편향 보정 분모 $1-\beta_1^2$는?`, ans: '0.19', ansTex: R`0.19`,
        sol: R`$1-0.81=0.19$. $m_2=0.09g_1+0.1g_2$라 기울기가 같으면 $0.19g$이고, 0.19로 나누면 $g$.` },
      { ch: 'ch14', type: 'open', lv: 3, pts: 20, q: R`(1) 모멘텀 $v_{t+1}=\rho v_t-\alpha g_t$, $v_0=0$에서 $v_t=-\alpha\sum_{k=0}^{t-1}\rho^{t-1-k}g_k$를 증명하시오. (2) Adam의 $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$, $m_0=0$에서 $\E g_k=\bar g$이면 $\E m_t=(1-\beta_1^t)\bar g$임을 증명하고, 편향 보정이 없을 때 Adam의 첫걸음이 $\frac{1-\beta_1}{\sqrt{1-\beta_2}}\alpha$ 크기임을 보이시오.`,
        rubric: R`
- (1) 귀납법 — 6점
- (2) 펼친 식 — 4점
- (2) 등비급수로 기댓값 — 5점
- (2) 보정 없는 첫걸음 — 5점`,
        sol: R`
**(1)** $v_1=-\alpha g_0$. 가정 아래 $v_{t+1}=\rho v_t-\alpha g_t=-\alpha\big(\sum_{k=0}^{t-1}\rho^{t-k}g_k+g_t\big)=-\alpha\sum_{k=0}^t\rho^{t-k}g_k$.
**(2)** 같은 귀납법으로 $m_t=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$. $\E m_t=(1-\beta_1)\bar g\frac{1-\beta_1^t}{1-\beta_1}=(1-\beta_1^t)\bar g$.
첫걸음(보정 없음): $m_1=(1-\beta_1)g_1$, $m_2=(1-\beta_2)g_1^2$, 걸음 $\alpha\frac{(1-\beta_1)g_1}{\sqrt{1-\beta_2}\lvert g_1\rvert}$, 크기 $\frac{1-\beta_1}{\sqrt{1-\beta_2}}\alpha$ (기본값 $\approx3.16\alpha$). 보정하면 $\alpha$.` },
      { ch: 'ch14', type: 'mc', lv: 1, pts: 5, q: R`RMSProp이 AdaGrad를 개선한 핵심은?`,
        choices: [R`모멘텀을 더했다`, R`제곱 기울기를 모두 더하는 대신 지수이동평균을 써서 유효 학습률이 0으로 줄지 않게 했다`, R`학습률을 없앴다`, R`헤시안을 계산한다`], ans: 1,
        sol: R`AdaGrad의 누적합은 계속 커져 걸음이 $\alpha/\sqrt t$로 줄지만, RMSProp은 오래된 기울기를 잊습니다.` },
      { ch: 'ch14', type: 'num', lv: 3, pts: 15, q: R`$f=\frac12x_1^2+50x_2^2$, $x_0=(-5,-1)$, 모멘텀 $\alpha=0.019$, $\rho=0.8$, $v_0=0$일 때 두 걸음 뒤 $x_2$의 **첫째** 좌표는? (소수 넷째 자리)`, ans: '-4.7358', ansTex: R`\approx-4.7358`,
        sol: R`$g_0=(-5,-100)$, $v_1=(0.095,1.9)$, $x_1=(-4.905,0.9)$. $g_1=(-4.905,90)$, $v_2=0.8(0.095,1.9)-0.019(-4.905,90)=(0.169195,-0.19)$, $x_2=(-4.735805,\ 0.71)$.` },
    ],
  },
  );
})();
