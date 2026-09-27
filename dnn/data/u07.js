/* 07 서포트 벡터 머신 — 3주차 월요일 s.19–31 (필기) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 7, part: 'B', title: '서포트 벡터 머신', en: 'Support Vector Machines', ref: 'W3 월 · s.19–31', plot: 'margin',
    fig: R`최대 마진 초평면(굵은 선), 두 마진 경계(점선), 동그라미 친 서포트 벡터`,
    tagline: R`마진은 스케일에 불변이므로 $\min\lvert w^Tx+b\rvert=1$로 고정하면 “마진 최대화”가 “$\frac12\lVert w\rVert^2$ 최소화”가 됩니다.`,
    summary: R`선형 분리 가능한 이진 자료 $y_i\in\{1,-1\}$에서 두 클래스 사이의 여유(마진)가 가장 큰 초평면을 찾습니다. 필기로 점과 초평면 사이의 거리 $\lvert w^Tx+b\rvert/\lVert w\rVert_2$를 유도하고, 마진의 스케일 불변성을 이용해 문제를 $\min\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$로 바꿨습니다. 제약을 벌점 $\max_{\alpha\ge0}\alpha_i(1-y_i(\cdot))$로 옮긴 min–max 문제와 약한 쌍대성을 거쳐 라그랑주 쌍대 문제(이차계획법)를 얻고, 서포트 벡터에서 절편 $b$를 구합니다.`,
    goals: [
      R`초평면의 법선과 원점에서의 거리 $\lvert b\rvert/\lVert w\rVert$를 설명할 수 있다`,
      R`점과 초평면 사이의 거리 공식을 $x_p=x-\alpha w$로 유도할 수 있다`,
      R`마진의 스케일 불변성을 이용해 하드 마진 SVM 원문제를 유도할 수 있다`,
      R`벌점 함수가 제약을 표현하는 원리와 약한 쌍대성 $\min\max\ge\max\min$을 증명할 수 있다`,
      R`라그랑지안의 정류 조건에서 쌍대 문제와 $w=\sum\alpha_iy_ix_i$, $b=y_i-x_i^Tw$를 유도할 수 있다`,
    ],
    secTitles: { '7.1': '초평면과 분류', '7.2': '점-평면 거리', '7.3': '마진과 원문제', '7.4': '라그랑주 쌍대', '7.5': 'b와 서포트 벡터' },
    sections: [
      { k: '7.1', src: 'W3 월 · 슬라이드 19–23', title: '초평면과 선형 분류', body: R`
$\mathbb R^n$의 초평면을 $f(x)=x^Tw+b=\sum_ix_iw_i+b=0$으로 씁니다. 양변을 $\lVert w\rVert$로 나누면
$$\frac{x^Tw}{\lVert w\rVert}=P_w(x)=-\frac b{\lVert w\rVert}.$$
좌변은 $x$를 단위벡터 $w/\lVert w\rVert$ 방향으로 **사영한 길이**입니다(필기: “$x^T$를 $w/\lVert w\rVert$에 사영”)[[@em:ch08:9.2|벡터 $x$의 $u$ 방향 성분은 $x\cdot u/\lVert u\rVert$.]]. 평면 위의 모든 점이 같은 사영 길이 $-b/\lVert w\rVert$를 가지므로, $w$는 평면의 **법선**이고 원점에서 평면까지의 거리는 $\lvert b\rvert/\lVert w\rVert$입니다.

**분류 규칙.** $y=\sign(f(x))\in\{1,-1\}$: $f(x)>0$이면 $y=1$ ($x\in P$), $f(x)<0$이면 $y=-1$ ($x\in N$).

학습 자료 $\{(x_k,y_k)\}_{k=1}^K$가 선형 분리 가능하다고 합시다. 예측 $\hat y=\sign(f(x))$와 정답의 네 경우(정답 양성·음성 × 맞춤·틀림)를 한 식으로 쓰면 모든 점을 올바르게 분류하는 조건은
$$y_i(x_i^Tw+b)\ge0\qquad\forall i.$$
이 조건을 만족하는 초평면은 무수히 많습니다. 그중 가장 좋은 것은?
` },
      { k: '7.2', src: 'W3 월 필기', title: '점과 초평면 사이의 거리', body: R`
:::key 점과 초평면 사이의 거리
초평면 $H_{w,b}=\{x:w^Tx+b=0\}$와 점 $x$ 사이의 거리는
$$\mathrm{dist}(x,H)=\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert_2}.$$
:::

:::hand 수업 필기 — 유도
$x$에서 평면에 내린 수선의 발을 $x_p$, $d=x-x_p$라 하면 $x_p=x-d$가 평면 위에 있으므로 $w^T(x-d)+b=0$. $d$는 법선 $w$와 평행하므로 $d=\alpha w$ ($\alpha$는 스칼라). 대입하면
$$w^T(x-\alpha w)+b=0\ \Rightarrow\ \alpha=\frac{w^Tx+b}{w^Tw}.$$
$$\lVert d\rVert_2=\sqrt{d^Td}=\sqrt{\alpha^2w^Tw}=\lvert\alpha\rvert\sqrt{w^Tw}=\frac{\lvert w^Tx+b\rvert}{\sqrt{w^Tw}}=\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert_2}.$$
:::

:::fig distance

:::def 마진
자료 $D$에 대한 초평면 $H$의 마진은 가장 가까운 점까지의 거리입니다.
$$r(w,b)=\min_{x\in D}\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert_2}$$
:::
` },
      { k: '7.3', src: 'W3 월 · 슬라이드 24–27 필기', title: '마진 최대화와 하드 마진 SVM', body: R`
가장 좋은 결정 평면 $H_0$는 **마진이 최대**인 평면이고, 두 클래스의 가장 가까운 점들 한가운데에 놓입니다. 그 가까운 점들을 지나며 $H_0$와 평행한 두 평면을 $H_+$, $H_-$라 합니다.

**스케일 불변성(필기).** $\beta>0$이면 $(\beta w,\beta b)$는 같은 평면을 나타내고 $r(\beta w,\beta b)=r(w,b)$. 따라서 $(w,b)$의 크기는 우리가 정할 수 있습니다.

필기의 흐름:
$$\max_{w,b}r(w,b)=\max_{w,b}\frac1{\lVert w\rVert}\Big[\min_{x\in D}\lvert w^Tx+b\rvert\Big]\quad\text{s.t. }y_i(w^Tx_i+b)\ge0.$$
스케일을 골라 $\min_{x\in D}\lvert w^Tx+b\rvert=1$로 두면 목적함수는 $1/\lVert w\rVert$이고, 이를 최대화하는 것은 $w^Tw$를 최소화하는 것과 같습니다. 두 제약 “$y_i(w^Tx_i+b)\ge0$”과 “$\min_i\lvert w^Tx_i+b\rvert=1$”은 합쳐서 “$y_i(w^Tx_i+b)\ge1$”과 같습니다.

:::key 하드 마진 SVM (원문제)
$$\min_{w,b}\ \frac12w^Tw=\frac12\lVert w\rVert^2\qquad\text{s.t. }\ y_i(x_i^Tw+b)\ge1\ \ (\text{즉 }1-y_i(x_i^Tw+b)\le0),\ \ i=1,\dots,K$$
최적해에서 $H_\pm:\ x^Tw+b=\pm1$이고 마진은 $1/\lVert w\rVert$, 두 평면 사이의 폭은 $2/\lVert w\rVert$[[@ml:ch12:15.1b|마진이 크면 표본 복잡도가 차원 대신 (반지름/마진)²에 기댑니다.]].
:::

:::fig margin

$P$의 점은 $x_i^Tw+b\ge1$, $N$의 점은 $x_i^Tw+b\le-1$을 만족하고, 등호가 성립하는(=$H_\pm$ 위의) 점들이 **서포트 벡터**입니다: $x_i^Tw+b=y_i$.

:::note 필기의 분모 표기
필기에서는 마진을 $\min\lvert w^Tx+b\rvert/w^Tw$로 적었는데, 거리 공식의 분모는 $\sqrt{w^Tw}=\lVert w\rVert_2$입니다. $t\mapsto t^2$이 $t\ge0$에서 증가함수라 “$1/\lVert w\rVert$ 최대화 ⇔ $\lVert w\rVert$ 최소화 ⇔ $w^Tw$ 최소화”이므로 결론은 같습니다. 제약의 동치성은 증명 페이지에 자세히 썼습니다.
:::
` },
      { k: '7.4', src: 'W3 월 · 슬라이드 27–30 필기', title: '라그랑주 승수와 쌍대 문제', body: R`
**제약을 벌점으로.** 제약 있는 문제를 제약 없는 문제로 바꿉니다.
$$\min_{w,b}\ \frac12w^Tw+\sum_i\max_{\alpha_i\ge0}\alpha_i\big(1-y_i(x_i^Tw+b)\big)$$
(필기) 괄호 $1-y_i(\cdot)$가 $\le0$이면(제약 만족) $\alpha_i=0$에서 최대라 벌점 0, 괄호가 양수이면(위반) $\alpha_i\to\infty$로 벌점 $+\infty$. 따라서 이 문제는 원문제와 같습니다.

:::key SVM 쌍대 문제
라그랑지안 $L_p(w,b,\alpha)=\frac12w^Tw+\sum_i\alpha_i\big(1-y_i(x_i^Tw+b)\big)$, $\alpha_i\ge0$.
$$\min_{w,b}\max_{\alpha\ge0}L_p\ \ge\ \max_{\alpha\ge0}\min_{w,b}L_p\qquad(\text{약한 쌍대성})$$
$$\nabla_wL_p=0\Rightarrow w=\sum_i\alpha_iy_ix_i,\qquad \frac{\partial L_p}{\partial b}=0\Rightarrow\sum_i\alpha_iy_i=0$$
$$\text{쌍대 문제:}\ \ \max_\alpha\ \sum_i\alpha_i-\frac12\sum_i\sum_j\alpha_i\alpha_jy_iy_jx_i^Tx_j\quad\text{s.t. }\alpha_i\ge0,\ \sum_i\alpha_iy_i=0$$
:::

$\alpha_i$를 **라그랑주 승수**라 합니다. 원문제가 볼록(이차 목적함수, 아핀 제약)이고 해가 존재하므로 이 경우에는 등호(강한 쌍대성)가 성립해 쌍대 문제를 풀어도 됩니다. 쌍대 문제는 $\alpha$에 대한 **이차계획법**(QP)이고, 자료가 **내적 $x_i^Tx_j$로만** 들어간다는 것이 중요합니다. 내적을 커널 $K(x_i,x_j)$로 바꾸면 비선형 SVM이 됩니다[[ch04:4.4|커널 트릭: 내적만 있으면 특성사상 없이 계산.]].

**쌍대 목적함수의 유도.** $L_p=\frac12w^Tw+\sum_i\alpha_i-w^T\sum_i\alpha_iy_ix_i-b\sum_i\alpha_iy_i$에 두 정류 조건을 넣으면 $b$항은 0, $w^T\sum\alpha_iy_ix_i=w^Tw$이므로
$$L=\sum_i\alpha_i-\frac12w^Tw=\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j.$$
` },
      { k: '7.5', src: 'W3 월 · 슬라이드 31', title: 'b 구하기와 서포트 벡터', body: R`
쌍대 문제로 $\alpha$를 구하면 $w=\sum_i\alpha_iy_ix_i$. 절편은 서포트 벡터 하나에서 구합니다.

:::key SVM의 절편 b
서포트 벡터 $x_i$에서 $y_i(x_i^Tw+b)=1$. 양변에 $y_i$를 곱하면 $y_i^2=1$이므로
$$x_i^Tw+b=y_i\ \Longrightarrow\ b=y_i-x_i^Tw.$$
:::

**왜 서포트 벡터만 중요한가(KKT 상보성).** 최적해에서는 $\alpha_i\big(1-y_i(x_i^Tw+b)\big)=0$이 모든 $i$에 대해 성립합니다. 따라서 마진 밖에 있는 점($y_i(\cdot)>1$)은 $\alpha_i=0$이고, $w=\sum\alpha_iy_ix_i$에 기여하는 것은 $\alpha_i>0$인 점, 즉 $H_\pm$ 위의 서포트 벡터뿐입니다. 나머지 점을 지워도 해가 변하지 않습니다.

**예측.** $\hat y=\sign\big(\sum_i\alpha_iy_ix_i^Tx+b\big)$ — 이것도 내적으로만 쓰입니다. 수치 안정성을 위해 실제로는 모든 서포트 벡터에서 구한 $b$를 평균합니다.
` },
    ],
    problems: [
      { sec: '7.1', type: 'num', lv: 1, q: R`초평면 $3x_1+4x_2-10=0$과 원점 사이의 거리는?`, ans: '2', ansTex: R`2`,
        sol: R`$\lvert b\rvert/\lVert w\rVert=10/5=2$.` },
      { sec: '7.2', type: 'num', lv: 1, q: R`점 $(3,4)$와 초평면 $3x_1+4x_2-10=0$ 사이의 거리는?`, ans: '3', ansTex: R`3`,
        sol: R`$\lvert9+16-10\rvert/5=15/5=3$.` },
      { sec: '7.2', type: 'num', lv: 2, q: R`필기의 유도에서 $w=(1,2)$, $b=-1$, $x=(2,2)$이면 $\alpha=\frac{w^Tx+b}{w^Tw}$는?`, ans: '1', ansTex: R`1`,
        sol: R`$w^Tx+b=2+4-1=5$, $w^Tw=5$, $\alpha=1$. 수선의 발 $x_p=x-\alpha w=(1,0)$, 확인: $1+0-1=0$. 거리 $\lVert w\rVert=\sqrt5$.` },
      { sec: '7.3', type: 'mc', lv: 1, q: R`$r(\beta w,\beta b)=r(w,b)$ ($\beta>0$)가 SVM 유도에서 하는 역할은?`,
        choices: [R`해가 유일함을 보장한다`, R`$\min_i\lvert w^Tx_i+b\rvert=1$로 스케일을 고정할 수 있게 한다`, R`커널을 쓸 수 있게 한다`, R`$b=0$으로 둘 수 있게 한다`], ans: 1,
        sol: R`같은 평면을 나타내는 $(w,b)$가 무수히 많으므로 하나를 대표로 고릅니다. 그러면 마진이 $1/\lVert w\rVert$가 됩니다.` },
      { sec: '7.3', type: 'num', lv: 2, q: R`하드 마진 SVM의 해가 $w=(3,4)$일 때 두 마진 평면 $H_+$와 $H_-$ 사이의 거리는?`, ans: '2/5', ansTex: R`\tfrac25`,
        sol: R`$H_\pm:w^Tx+b=\pm1$ 사이의 거리는 $2/\lVert w\rVert=2/5$. 결정 평면에서 각각 $1/5$.` },
      { sec: '7.3', type: 'mc', lv: 2, q: R`하드 마진 SVM의 제약 $y_i(x_i^Tw+b)\ge1$이 성립하지 않는 경우는?`,
        choices: [R`양성 점이 $H_+$ 위에 있을 때`, R`양성 점이 $H_0$와 $H_+$ 사이에 있을 때`, R`음성 점이 $H_-$ 아래에 있을 때`, R`음성 점이 $H_-$ 위에 있을 때`], ans: 1,
        sol: R`양성 점이 두 평면 사이에 있으면 $0<x^Tw+b<1$. 하드 마진은 마진 안에 점을 허용하지 않습니다(소프트 마진은 허용).` },
      { sec: '7.4', type: 'mc', lv: 2, q: R`$\max_{\alpha\ge0}\alpha(1-t)$의 값은?`,
        choices: [R`항상 0`, R`$t\ge1$이면 0, $t<1$이면 $+\infty$`, R`$t\ge1$이면 $+\infty$, $t<1$이면 0`, R`$1-t$`], ans: 1,
        sol: R`$1-t\le0$이면 $\alpha=0$에서 최대 0. $1-t>0$이면 $\alpha\to\infty$로 무한대. 제약 $t=y_i(\cdot)\ge1$을 벌점으로 표현합니다.` },
      { sec: '7.4', type: 'mc', lv: 2, q: R`라그랑지안을 $b$로 미분해 0으로 두면 얻는 조건은?`,
        choices: [R`$w=\sum\alpha_iy_ix_i$`, R`$\sum_i\alpha_iy_i=0$`, R`$\sum_i\alpha_i=1$`, R`$b=0$`], ans: 1,
        sol: R`$\partial L_p/\partial b=-\sum\alpha_iy_i=0$. 쌍대 문제의 등식 제약이 됩니다.` },
      { sec: '7.4', type: 'mc', lv: 2, q: R`SVM 쌍대 문제에서 자료가 들어가는 방식은?`,
        choices: [R`$x_i$ 자체`, R`내적 $x_i^Tx_j$로만`, R`노름 $\lVert x_i\rVert$로만`, R`$x_i$의 평균으로만`], ans: 1,
        sol: R`$\sum\alpha_i-\frac12\sum\alpha_i\alpha_jy_iy_jx_i^Tx_j$. 그래서 커널 트릭을 쓸 수 있습니다.` },
      { sec: '7.5', type: 'num', lv: 2, q: R`$w=(1,-1)$이고 서포트 벡터 $x=(3,1)$, $y=1$일 때 $b$는?`, ans: '-1', ansTex: R`-1`,
        sol: R`$b=y-x^Tw=1-(3-1)=-1$. 확인: $x^Tw+b=2-1=1$.` },
      { sec: '7.5', type: 'num', lv: 3, q: R`1차원 자료 $x_1=1\,(y=+1)$, $x_2=-1\,(y=-1)$의 하드 마진 SVM에서 $w$는? (쌍대 문제 또는 기하로 풀기)`, ans: '1', ansTex: R`1`,
        sol: R`대칭이라 $b=0$, 제약 $w\ge1$, $\frac12w^2$ 최소 → $w=1$. 쌍대: $\alpha_1=\alpha_2=\alpha$ (합 조건), 목적 $2\alpha-\frac12\alpha^2(1\cdot1+1\cdot1+2\cdot1)=2\alpha-2\alpha^2$, 최대 $\alpha=\tfrac12$, $w=\tfrac12(1)(1)+\tfrac12(-1)(-1)=1$. 마진 $1/\lVert w\rVert=1$ (두 점 사이 거리 2의 절반).` },
      { sec: '7.5', type: 'mc', lv: 2, q: R`KKT 상보성 $\alpha_i(1-y_i(x_i^Tw+b))=0$에서 마진 밖에 있는 점($y_i(\cdot)>1$)의 $\alpha_i$는?`,
        choices: [R`양수`, R`0`, R`음수`, R`1`], ans: 1,
        sol: R`괄호가 음수이므로 곱이 0이려면 $\alpha_i=0$. 해 $w=\sum\alpha_iy_ix_i$는 서포트 벡터만으로 정해집니다.` },
      { sec: '7.2', type: 'open', lv: 2, proof: true, q: R`점 $x$와 초평면 $\{z:w^Tz+b=0\}$ 사이의 거리가 $\lvert w^Tx+b\rvert/\lVert w\rVert_2$임을, 수선의 발 $x_p=x-d$와 $d=\alpha w$를 써서 증명하세요.`,
        sol: R`
$d$는 법선 방향이므로 $d=\alpha w$. $x_p=x-\alpha w$가 평면 위에 있으려면 $w^T(x-\alpha w)+b=0$, 즉 $\alpha=\frac{w^Tx+b}{w^Tw}$.
$\lVert d\rVert=\lvert\alpha\rvert\lVert w\rVert=\frac{\lvert w^Tx+b\rvert}{w^Tw}\sqrt{w^Tw}=\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert}$.
이것이 최소 거리임: 평면 위의 임의의 $z$에 대해 $x-z=(x-x_p)+(x_p-z)$이고 $x_p-z$는 평면에 평행(즉 $w^T(x_p-z)=0$)이라 $x-x_p\perp x_p-z$. 피타고라스로 $\lVert x-z\rVert^2=\lVert d\rVert^2+\lVert x_p-z\rVert^2\ge\lVert d\rVert^2$.`,
        rubric: R`
- $d=\alpha w$ 설정과 $\alpha$ 계산 — 4점
- 노름 계산 — 3점
- 최소 거리임을 확인 — 3점` },
      { sec: '7.3', type: 'open', lv: 3, proof: true, q: R`선형 분리 가능한 자료에서 “마진 $r(w,b)$ 최대화 (s.t. $y_i(w^Tx_i+b)\ge0$)” 문제가 “$\min\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$”과 같은 초평면을 줌을 보이세요.`,
        sol: R`
**스케일 불변.** $\beta>0$에 대해 $r(\beta w,\beta b)=\min\frac{\beta\lvert w^Tx+b\rvert}{\beta\lVert w\rVert}=r(w,b)$이고 분류 제약도 그대로입니다. 분리 가능하면 모든 점에서 $w^Tx_i+b\ne0$인 해가 있으므로 $\min_i\lvert w^Tx_i+b\rvert=1$이 되게 스케일을 고정할 수 있고, 그러면 $r=1/\lVert w\rVert$.

**제약의 동치.** (⇒) $y_i(w^Tx_i+b)\ge0$, $\lvert y_i\rvert=1$이면 $y_i(w^Tx_i+b)=\lvert w^Tx_i+b\rvert\ge\min_j\lvert w^Tx_j+b\rvert=1$. (⇐) $y_i(w^Tx_i+b)\ge1$을 만족하는 $(w,b)$ 중 $\frac12\lVert w\rVert^2$을 최소로 하는 해에서는 $m=\min_iy_i(w^Tx_i+b)=1$입니다. $m>1$이면 $(w/m,b/m)$도 제약을 만족하면서 $\lVert w\rVert$가 더 작아 모순이기 때문입니다.

**목적의 동치.** $\max1/\lVert w\rVert\iff\min\lVert w\rVert\iff\min\frac12\lVert w\rVert^2$ (양수에서 $t\mapsto t^2/2$는 증가). 따라서 두 문제의 최적 초평면이 같습니다.`,
        rubric: R`
- 스케일 불변성과 정규화 $\min\lvert\cdot\rvert=1$ — 3점
- 두 제약의 동치(양방향) — 4점
- 목적함수의 동치 — 3점` },
      { sec: '7.4', type: 'open', lv: 3, proof: true, q: R`임의의 함수 $L(u,v)$에 대해 약한 쌍대성 $\min_u\max_vL(u,v)\ge\max_v\min_uL(u,v)$를 증명하고, SVM 라그랑지안에서 쌍대 목적함수 $\sum\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$를 유도하세요.`,
        sol: R`
**약한 쌍대성.** 임의의 $u',v'$에 대해 $\min_uL(u,v')\le L(u',v')\le\max_vL(u',v)$. 좌변은 $u'$와 무관하므로 우변을 $u'$에 대해 최소화해도 부등식이 유지됩니다: $\min_uL(u,v')\le\min_{u'}\max_vL(u',v)$. 이제 좌변을 $v'$에 대해 최대화하면 결과.

**쌍대 목적.** $L_p=\frac12w^Tw+\sum_i\alpha_i-w^T\sum_i\alpha_iy_ix_i-b\sum_i\alpha_iy_i$. $w$에 대해 볼록 이차식이라 $\nabla_w=w-\sum\alpha_iy_ix_i=0$에서 최소, $b$에 대해서는 선형이라 $\sum\alpha_iy_i\ne0$이면 $\min_b=-\infty$이므로 쌍대에서는 $\sum\alpha_iy_i=0$만 의미가 있습니다. 대입하면
$$\min_{w,b}L_p=\tfrac12w^Tw+\sum\alpha_i-w^Tw=\sum_i\alpha_i-\tfrac12\Big\lVert\sum_i\alpha_iy_ix_i\Big\rVert^2=\sum_i\alpha_i-\tfrac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j.$$`,
        rubric: R`
- 약한 쌍대성의 두 단계 부등식 — 4점
- 정류 조건 두 개 — 3점
- 대입과 정리 — 3점` },
    ],
  });
})();
