/* 개념 정리 — 07 서포트 벡터 머신 (3주차 월요일 슬라이드 19–31, 필기, Problem Set 1 문제 3·4).
   초평면의 기하에서 시작해 라그랑주 쌍대까지, 그리고 Problem Set의 두 점 예제와 최대-최소 부등식을 끝까지 풉니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 7,
    summary: R`선형 분리 가능한 이진 자료 $y_i\in\{1,-1\}$에서 두 클래스 사이의 여유(마진)가 가장 큰 초평면을 찾습니다. 필기로 점과 초평면 사이의 거리 $\lvert w^Tx+b\rvert/\lVert w\rVert_2$를 유도하고, 마진의 스케일 불변성을 이용해 문제를 $\min\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$로 바꿨습니다. 제약을 벌점 $\max_{\alpha\ge0}\alpha_i(1-y_i(\cdot))$로 옮긴 min–max 문제와 약한 쌍대성을 거쳐 라그랑주 쌍대 문제(이차계획법)를 얻고, 서포트 벡터에서 절편 $b$를 구합니다. 마지막 두 절은 Problem Set 1의 문제 3(두 점 자료의 쌍대 문제를 끝까지 풀기)과 문제 4(최대-최소 부등식과 반례)입니다.`,
    goals: [
      R`초평면 $w^Tx+b=0$에서 $w$가 법선임을 보이고 분류 규칙과 “올바른 분류” 조건 $y_i(w^Tx_i+b)\ge0$을 쓸 수 있다`,
      R`점과 초평면 사이의 거리 $\lvert w^Tx+b\rvert/\lVert w\rVert_2$를 수선의 발로 유도할 수 있다`,
      R`마진의 스케일 불변성으로 마진 최대화를 $\min\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$로 바꿀 수 있다`,
      R`벌점 함수가 제약을 표현하는 원리와 약한 쌍대성 $\min\max\ge\max\min$을 증명할 수 있다`,
      R`라그랑지안의 정류 조건에서 $w=\sum\alpha_iy_ix_i$, $\sum\alpha_iy_i=0$과 쌍대 목적함수를 유도하고, 작은 자료에서 $\alpha$, $w$, $b$, 마진을 끝까지 계산할 수 있다`,
      R`KKT 상보성으로 서포트 벡터만 해에 기여하는 이유를 설명할 수 있다`,
      R`최대-최소 부등식을 임의의 함수에 대해 증명하고 등호가 깨지는 반례를 만들 수 있다`,
    ],
    sections: [
      { k: '7.1', src: 'W3 월 · 슬라이드 19–23', title: '초평면과 선형 분류', body: R`
:::idea 쉽게 말하면
평면 위의 빨간 점과 파란 점을 직선 하나로 가르고 싶습니다. 직선은 “방향”(법선 $w$)과 “위치”($b$)로 정해지고, 점이 직선의 어느 쪽에 있는지는 $w^Tx+b$의 **부호**로 압니다. 3차원이면 직선 대신 평면, 일반 차원에서는 **초평면**입니다.
:::

$\mathbb R^n$의 초평면을 $f(x)=x^Tw+b=\sum_ix_iw_i+b=0$으로 씁니다. 양변을 $\lVert w\rVert$로 나누면
$$\frac{x^Tw}{\lVert w\rVert}=P_w(x)=-\frac b{\lVert w\rVert}.$$
좌변은 $x$를 단위벡터 $w/\lVert w\rVert$ 방향으로 **사영한 길이**입니다(필기: “$x^T$를 $w/\lVert w\rVert$에 사영”)[[@em:ch08:9.2|벡터 $x$의 $u$ 방향 성분은 $x\cdot u/\lVert u\rVert$.]]. 평면 위의 모든 점이 같은 사영 길이 $-b/\lVert w\rVert$를 가지므로, $w$는 평면의 **법선**이고 원점에서 평면까지의 거리는 $\lvert b\rvert/\lVert w\rVert$입니다.

**$w$가 법선인 이유를 한 줄로.** 평면 위의 두 점 $x,x'$이면 $w^Tx+b=0=w^Tx'+b$에서 $w^T(x-x')=0$ — 평면 안의 모든 방향 $x-x'$과 $w$가 수직입니다.

**분류 규칙.** $y=\sign(f(x))\in\{1,-1\}$: $f(x)>0$이면 $y=1$ ($x\in P$), $f(x)<0$이면 $y=-1$ ($x\in N$).

학습 자료 $\{(x_k,y_k)\}_{k=1}^K$가 선형 분리 가능하다고 합시다. 예측 $\hat y=\sign(f(x))$와 정답의 네 경우(정답 양성·음성 × 맞춤·틀림)를 한 식으로 쓰면 모든 점을 올바르게 분류하는 조건은
$$y_i(x_i^Tw+b)\ge0\qquad\forall i.$$
(레이블을 $\pm1$로 쓰는 이유가 이것입니다: 맞으면 $y_i$와 $f(x_i)$의 부호가 같아 곱이 양수.) 이 조건을 만족하는 초평면은 무수히 많습니다. 그중 가장 좋은 것은?

:::ex 예제 1 — 부호로 분류하기
$w=(1,-1)$, $b=0.5$일 때 $x=(2,1)$, $x'=(0,3)$은 어느 쪽인가? 원점에서 평면까지 거리는?
---
$f(x)=2-1+0.5=1.5>0$이므로 $+1$, $f(x')=0-3+0.5=-2.5<0$이므로 $-1$. 원점까지 거리 $\lvert b\rvert/\lVert w\rVert=0.5/\sqrt2\approx0.354$.
:::
` },
      { k: '7.2', src: 'W3 월 필기', title: '점과 초평면 사이의 거리', body: R`
:::idea 쉽게 말하면
점에서 평면까지의 거리는 **수선**의 길이입니다. 수선은 평면의 법선 $w$ 방향이므로, “$x$에서 $w$ 방향으로 얼마나 가면 평면에 닿는가”를 계산하면 됩니다.
:::

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
:::

부호를 떼지 않은 $\frac{w^Tx+b}{\lVert w\rVert}$는 **부호 있는 거리**로, 양수이면 $w$가 가리키는 쪽입니다. 여기에 $y$를 곱한 $\frac{y(w^Tx+b)}{\lVert w\rVert}$는 “올바른 쪽으로 얼마나 떨어져 있는가”(기하 마진)입니다.

:::ex 예제 2 — 거리 계산
점 $(3,4)$와 초평면 $3x_1+4x_2-10=0$ 사이의 거리는?
---
$\frac{\lvert9+16-10\rvert}{\sqrt{9+16}}=\frac{15}5=3$. 수선의 발은 $x_p=x-\alpha w$, $\alpha=15/25=0.6$, $x_p=(3,4)-0.6(3,4)=(1.2,1.6)$. 확인: $3(1.2)+4(1.6)=10$ ✓.
:::

:::def 마진
자료 $D$에 대한 초평면 $H$의 마진은 가장 가까운 점까지의 거리입니다.
$$r(w,b)=\min_{x\in D}\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert_2}$$
:::
` },
      { k: '7.3', src: 'W3 월 · 슬라이드 24–27 필기', title: '마진 최대화와 하드 마진 SVM', body: R`
:::idea 쉽게 말하면
두 무리의 점 사이로 **가장 넓은 도로**를 내고, 도로의 한가운데 선을 결정 경계로 삼습니다. 도로가 넓을수록 새 점이 조금 흔들려도 올바른 쪽에 남을 가능성이 큽니다. 도로의 가장자리에 닿아 있는 점들이 도로를 “받치고(support)” 있어서 **서포트 벡터**라 부릅니다.
:::

가장 좋은 결정 평면 $H_0$는 **마진이 최대**인 평면이고, 두 클래스의 가장 가까운 점들 한가운데에 놓입니다. 그 가까운 점들을 지나며 $H_0$와 평행한 두 평면을 $H_+$, $H_-$라 합니다.

**스케일 불변성(필기).** $\beta>0$이면 $(\beta w,\beta b)$는 같은 평면을 나타내고 $r(\beta w,\beta b)=r(w,b)$. 따라서 $(w,b)$의 크기는 우리가 정할 수 있습니다. (분자·분모에 $\beta$가 한 번씩 곱해져 약분: $\frac{\lvert\beta w^Tx+\beta b\rvert}{\lVert\beta w\rVert}=\frac{\beta\lvert w^Tx+b\rvert}{\beta\lVert w\rVert}$.)

필기의 흐름:
$$\max_{w,b}r(w,b)=\max_{w,b}\frac1{\lVert w\rVert}\Big[\min_{x\in D}\lvert w^Tx+b\rvert\Big]\quad\text{s.t. }y_i(w^Tx_i+b)\ge0.$$
스케일을 골라 $\min_{x\in D}\lvert w^Tx+b\rvert=1$로 두면 목적함수는 $1/\lVert w\rVert$이고, 이를 최대화하는 것은 $w^Tw$를 최소화하는 것과 같습니다. 두 제약 “$y_i(w^Tx_i+b)\ge0$”과 “$\min_i\lvert w^Tx_i+b\rvert=1$”은 합쳐서 “$y_i(w^Tx_i+b)\ge1$”과 같습니다.

**마지막 동치의 이유.** (⇒) 올바르게 분류하면 $y_i(w^Tx_i+b)=\lvert w^Tx_i+b\rvert\ge\min_j\lvert w^Tx_j+b\rvert=1$. (⇐) $y_i(\cdot)\ge1$이면 올바른 분류이고 $\min_i\lvert\cdot\rvert\ge1$. 최소가 1보다 크면 $(w,b)$를 줄여(스케일) $\lVert w\rVert$를 더 작게 만들 수 있으므로 최적해에서는 최소가 정확히 1입니다.

:::key 하드 마진 SVM (원문제)
$$\min_{w,b}\ \frac12w^Tw=\frac12\lVert w\rVert^2$$
$$\text{s.t. }\ y_i(x_i^Tw+b)\ge1\ \ (\text{즉 }1-y_i(x_i^Tw+b)\le0),\ \ i=1,\dots,K$$
최적해에서 $H_\pm:\ x^Tw+b=\pm1$이고 마진은 $1/\lVert w\rVert$, 두 평면 사이의 폭은 $2/\lVert w\rVert$[[@ml:ch12:15.1b|마진이 크면 표본 복잡도가 차원 대신 (반지름/마진)²에 기댑니다.]].
:::

:::fig margin
:::

$P$의 점은 $x_i^Tw+b\ge1$, $N$의 점은 $x_i^Tw+b\le-1$을 만족하고, 등호가 성립하는(=$H_\pm$ 위의) 점들이 **서포트 벡터**입니다: $x_i^Tw+b=y_i$.

:::note 필기의 분모 표기
필기에서는 마진을 $\min\lvert w^Tx+b\rvert/w^Tw$로 적었는데, 거리 공식의 분모는 $\sqrt{w^Tw}=\lVert w\rVert_2$입니다. $t\mapsto t^2$이 $t\ge0$에서 증가함수라 “$1/\lVert w\rVert$ 최대화 ⇔ $\lVert w\rVert$ 최소화 ⇔ $w^Tw$ 최소화”이므로 결론은 같습니다. 제약의 동치성은 증명 페이지에 자세히 썼습니다.
:::

**$\frac12$과 제곱을 쓰는 이유.** $\lVert w\rVert$를 최소화하는 것과 $\frac12\lVert w\rVert^2$을 최소화하는 것은 같은 답을 주지만, 후자는 어디서나 미분 가능한 이차함수라 볼록 이차계획법이 되고 기울기가 깔끔하게 $w$가 됩니다.

### 더 깊이: 소프트 마진

자료가 완벽히 분리되지 않으면 제약을 만족하는 $w$가 없습니다. 여유 변수 $\xi_i\ge0$을 두어 $y_i(w^Tx_i+b)\ge1-\xi_i$로 완화하고 $\frac12\lVert w\rVert^2+C\sum\xi_i$를 최소화하는 것이 소프트 마진 SVM입니다. 최적의 $\xi_i=\max(0,1-y_i(w^Tx_i+b))$라 이것은 **힌지 손실** + $L_2$ 규제의 최소화와 같고, 로지스틱 회귀(로지스틱 손실 + 규제)와 나란히 놓고 비교할 수 있습니다[[@ml:ch12:15.2|소프트 SVM과 힌지 손실.]]. 쌍대 문제는 제약이 $0\le\alpha_i\le C$로 바뀌는 것만 다릅니다.
` },
      { k: '7.4', src: 'W3 월 · 슬라이드 27–30 필기', title: '라그랑주 승수와 쌍대 문제', body: R`
:::idea 쉽게 말하면
제약이 있는 최적화는 어렵습니다. 그래서 “제약을 어기면 벌금”을 목적함수에 붙여 제약 없는 문제로 바꿉니다. 벌금의 단가 $\alpha_i$(라그랑주 승수)를 **상대방**이 고른다고 생각하면, 우리는 $w,b$로 목적함수를 줄이려 하고 상대방은 $\alpha$로 키우려는 게임이 됩니다. 누가 먼저 수를 두느냐에 따라 원문제와 쌍대 문제가 되고, “먼저 두는 쪽이 불리하다”는 것이 약한 쌍대성입니다.
:::

**제약을 벌점으로.** 제약 있는 문제를 제약 없는 문제로 바꿉니다.
$$\min_{w,b}\ \frac12w^Tw+\sum_i\max_{\alpha_i\ge0}\alpha_i\big(1-y_i(x_i^Tw+b)\big)$$
(필기) 괄호 $1-y_i(\cdot)$가 $\le0$이면(제약 만족) $\alpha_i=0$에서 최대라 벌점 0, 괄호가 양수이면(위반) $\alpha_i\to\infty$로 벌점 $+\infty$. 따라서 이 문제는 원문제와 같습니다.

### 작은 예로 익히기

$\min x^2$ s.t. $x\ge1$ (답: $x=1$, 값 1)을 같은 방법으로 풀어 봅니다. 제약을 $1-x\le0$으로 쓰고 $L(x,\alpha)=x^2+\alpha(1-x)$, $\alpha\ge0$.
- **원문제** $\min_x\max_{\alpha\ge0}L$: $x<1$이면 $\max_\alpha=\infty$, $x\ge1$이면 $\max_\alpha=x^2$ ($\alpha=0$). 최소는 $x=1$에서 1.
- **쌍대 문제** $\max_{\alpha\ge0}\min_xL$: $x$에 대해 미분 $2x-\alpha=0$, $x=\alpha/2$. 대입하면 $g(\alpha)=\frac{\alpha^2}4+\alpha-\frac{\alpha^2}2=\alpha-\frac{\alpha^2}4$. $g'(\alpha)=1-\frac\alpha2=0$에서 $\alpha=2$, $g(2)=1$.
두 값이 같고(강한 쌍대성), 쌍대 해 $\alpha=2$에서 $x=\alpha/2=1$로 원래 답을 되찾습니다. $\alpha=2>0$은 제약이 “팽팽하다”($x=1$에서 등호)는 뜻입니다.

:::key SVM 쌍대 문제
라그랑지안 $L_p(w,b,\alpha)=\frac12w^Tw+\sum_i\alpha_i\big(1-y_i(x_i^Tw+b)\big)$, $\alpha_i\ge0$.
$$\min_{w,b}\max_{\alpha\ge0}L_p\ \ge\ \max_{\alpha\ge0}\min_{w,b}L_p\qquad(\text{약한 쌍대성})$$
$$\nabla_wL_p=0\Rightarrow w=\sum_i\alpha_iy_ix_i,\qquad \frac{\partial L_p}{\partial b}=0\Rightarrow\sum_i\alpha_iy_i=0$$
$$\text{쌍대 문제:}\ \ \max_\alpha\ \sum_i\alpha_i-\frac12\sum_i\sum_j\alpha_i\alpha_jy_iy_jx_i^Tx_j\quad\text{s.t. }\alpha_i\ge0,\ \sum_i\alpha_iy_i=0$$
:::

$\alpha_i$를 **라그랑주 승수**라 합니다. 원문제가 볼록(이차 목적함수, 아핀 제약)이고 해가 존재하므로 이 경우에는 등호(강한 쌍대성)가 성립해 쌍대 문제를 풀어도 됩니다. 쌍대 문제는 $\alpha$에 대한 **이차계획법**(QP)이고, 자료가 **내적 $x_i^Tx_j$로만** 들어간다는 것이 중요합니다. 내적을 커널 $K(x_i,x_j)$로 바꾸면 비선형 SVM이 됩니다[[ch04:4.4|커널 트릭: 내적만 있으면 특성사상 없이 계산.]].

**정류 조건의 계산.** $L_p$에서 $w$가 들어간 항은 $\frac12w^Tw-w^T\sum_i\alpha_iy_ix_i$이므로 $\nabla_wL_p=w-\sum_i\alpha_iy_ix_i$. $b$가 들어간 항은 $-b\sum_i\alpha_iy_i$이므로 $\partial L_p/\partial b=-\sum_i\alpha_iy_i$. $L_p$는 $b$에 대해 **선형**이라, $\sum\alpha_iy_i\ne0$이면 $b\to\pm\infty$로 $\min_b L_p=-\infty$가 됩니다. 그래서 $\sum\alpha_iy_i=0$은 쌍대 문제의 **제약**으로 들어갑니다.

**쌍대 목적함수의 유도.** $L_p=\frac12w^Tw+\sum_i\alpha_i-w^T\sum_i\alpha_iy_ix_i-b\sum_i\alpha_iy_i$에 두 정류 조건을 넣으면 $b$항은 0, $w^T\sum\alpha_iy_ix_i=w^Tw$이므로
$$L=\sum_i\alpha_i-\frac12w^Tw=\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j.$$
마지막 등호는 $w^Tw=\big(\sum_i\alpha_iy_ix_i\big)^T\big(\sum_j\alpha_jy_jx_j\big)$를 전개한 것입니다.

:::warn 약한 쌍대성의 방향
$\min$이 바깥에 있는 쪽($\min\max$)이 **크거나 같습니다**. 7.7절의 최대-최소 부등식 $\max_x\min_yf\le\min_y\max_xf$와 같은 부등식을, 변수 이름만 바꿔 쓴 것입니다(여기서는 최대화하는 변수가 $\alpha$). 헷갈리면 “나중에 두는 쪽이 유리하다”로 기억하세요.
:::

### 더 깊이: KKT 조건

볼록 문제에서 강한 쌍대성이 성립하면 최적해 $(w^*,b^*,\alpha^*)$는 다음 네 조건(KKT)을 모두 만족하고, 거꾸로 이 조건을 만족하면 최적해입니다.
- 정류성: $w^*=\sum\alpha_i^*y_ix_i$, $\sum\alpha_i^*y_i=0$
- 원문제 가능성: $y_i(w^{*T}x_i+b^*)\ge1$
- 쌍대 가능성: $\alpha_i^*\ge0$
- 상보성: $\alpha_i^*\big(1-y_i(w^{*T}x_i+b^*)\big)=0$

강한 쌍대성의 충분조건(슬레이터 조건)은 “모든 부등식을 엄격히 만족하는 점이 있을 것”인데, 선형 분리 가능하면 스케일을 키워 $y_i(w^Tx_i+b)>1$을 만들 수 있으므로 성립합니다[[@ml:ch12:15.4|라그랑주 쌍대성.]].
` },
      { k: '7.5', src: 'W3 월 · 슬라이드 31', title: 'b 구하기와 서포트 벡터', body: R`
:::idea 쉽게 말하면
쌍대 문제를 풀면 점마다 승수 $\alpha_i$가 나옵니다. 대부분의 점은 $\alpha_i=0$ — 도로에서 멀리 떨어져 있어 도로의 위치에 아무 영향이 없는 점들입니다. $\alpha_i>0$인 점, 즉 도로 가장자리에 닿은 서포트 벡터만으로 $w$가 결정되고, 그중 하나를 경계식에 넣으면 $b$가 나옵니다.
:::

쌍대 문제로 $\alpha$를 구하면 $w=\sum_i\alpha_iy_ix_i$. 절편은 서포트 벡터 하나에서 구합니다.

:::key SVM의 절편 b
서포트 벡터 $x_i$에서 $y_i(x_i^Tw+b)=1$. 양변에 $y_i$를 곱하면 $y_i^2=1$이므로
$$x_i^Tw+b=y_i\ \Longrightarrow\ b=y_i-x_i^Tw.$$
:::

**왜 서포트 벡터만 중요한가(KKT 상보성).** 최적해에서는 $\alpha_i\big(1-y_i(x_i^Tw+b)\big)=0$이 모든 $i$에 대해 성립합니다. 따라서 마진 밖에 있는 점($y_i(\cdot)>1$)은 $\alpha_i=0$이고, $w=\sum\alpha_iy_ix_i$에 기여하는 것은 $\alpha_i>0$인 점, 즉 $H_\pm$ 위의 서포트 벡터뿐입니다. 나머지 점을 지워도 해가 변하지 않습니다.

**상보성의 이유.** 강한 쌍대성에서 $\frac12\lVert w^*\rVert^2=L_p(w^*,b^*,\alpha^*)=\frac12\lVert w^*\rVert^2+\sum_i\alpha_i^*\big(1-y_i(\cdot)\big)$이므로 $\sum_i\alpha_i^*(1-y_i(\cdot))=0$. 각 항은 $\alpha_i^*\ge0$과 $1-y_i(\cdot)\le0$의 곱이라 $\le0$이고, 합이 0이면 **각 항이 0**입니다.

**예측.** $\hat y=\sign\big(\sum_i\alpha_iy_ix_i^Tx+b\big)$ — 이것도 내적으로만 쓰입니다. 수치 안정성을 위해 실제로는 모든 서포트 벡터에서 구한 $b$를 평균합니다.

:::ex 예제 3 — 1차원 두 점
$x_1=1$ ($y=+1$), $x_2=-1$ ($y=-1$)의 하드 마진 SVM은?
---
대칭이라 경계는 0, 즉 $b=0$. 두 점이 모두 서포트 벡터라 $w\cdot1+0=1$, $w=1$. 쌍대로 확인: $\alpha_1=\alpha_2=\alpha$ ($\sum\alpha_iy_i=0$), 목적함수 $2\alpha-\frac12\alpha^2(1+1+2)=2\alpha-2\alpha^2$ ($x_ix_jy_iy_j$가 모두 1), 최대 $\alpha=\frac12$. $w=\frac12(1)(1)+\frac12(-1)(-1)=1$. 마진 $1/\lvert w\rvert=1$ — 두 점 사이 거리 2의 절반입니다.
:::
` },
      { k: '7.6', src: 'Problem Set 1 · 문제 3', title: '작은 자료로 쌍대 문제 끝까지 풀기', body: R`
:::idea 쉽게 말하면
시험에서는 점 두세 개짜리 자료로 라그랑지안 → 정류 조건 → 쌍대 문제 → $\alpha$ → $w,b$ → 마진을 **처음부터 끝까지** 손으로 풀게 합니다. 순서만 익히면 계산은 짧습니다. 결과는 항상 그림으로 확인하세요: 두 점이면 답은 두 점을 잇는 선분의 **수직이등분선**입니다.
:::

### Problem Set 1 문제 3

2차원 자료 $x_1=(0,0)$, $y_1=-1$; $x_2=(2,2)$, $y_2=+1$. 원문제는
$$\min_{w,b}\ \frac12\lVert w\rVert^2\quad\text{s.t. }y_i(w^Tx_i+b)\ge1,\ i=1,2.$$

**1단계 — 라그랑지안.** 승수 $\alpha_1,\alpha_2\ge0$에 대해
$$\begin{aligned}L(w,b,\alpha)&=\frac12\lVert w\rVert^2+\alpha_1\big(1-y_1(w^Tx_1+b)\big)+\alpha_2\big(1-y_2(w^Tx_2+b)\big)\\&=\frac12\lVert w\rVert^2+\alpha_1(1+b)+\alpha_2\big(1-2w_1-2w_2-b\big).\end{aligned}$$
($x_1=0$이라 $w^Tx_1=0$, $y_1=-1$이라 $1-y_1b=1+b$.)

**2단계 — $w,b$에 대해 최소화.**
$$\nabla_wL=w-\alpha_2(2,2)^T=0\ \Rightarrow\ w=(2\alpha_2,\ 2\alpha_2),$$
$$\frac{\partial L}{\partial b}=\alpha_1-\alpha_2=0\ \Rightarrow\ \alpha_1=\alpha_2.$$
일반식 $w=\sum\alpha_iy_ix_i=\alpha_1(-1)(0,0)+\alpha_2(+1)(2,2)$, $\sum\alpha_iy_i=-\alpha_1+\alpha_2=0$과 같습니다.

**3단계 — 쌍대 함수.** 대입하면 ($\lVert w\rVert^2=8\alpha_2^2$, $2w_1+2w_2=8\alpha_2$, $b$항은 $\alpha_1b-\alpha_2b=0$)
$$g(\alpha_1,\alpha_2)=\frac12\cdot8\alpha_2^2+\alpha_1+\alpha_2-8\alpha_2^2=\alpha_1+\alpha_2-4\alpha_2^2.$$
일반식 $\sum\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$로도: $x_1$과의 내적이 모두 0이라 $x_2^Tx_2=8$ 항만 남아 $\alpha_1+\alpha_2-\frac12\cdot8\alpha_2^2$. 같습니다. 쌍대 문제는
$$\max_{\alpha_1,\alpha_2\ge0}\ \alpha_1+\alpha_2-4\alpha_2^2\quad\text{s.t. }\alpha_1=\alpha_2.$$

**4단계 — 최적 승수.** $\alpha_1=\alpha_2=\alpha$로 두면 $h(\alpha)=2\alpha-4\alpha^2$, $h'(\alpha)=2-8\alpha=0$에서 $\alpha=\tfrac14$ ($h''=-8<0$, 최대). 따라서
$$\alpha_1^*=\alpha_2^*=\frac14,\qquad g^*=\frac14.$$

**5단계 — $w,b$ 복원.** $w^*=2\alpha_2^*(1,1)=\big(\tfrac12,\tfrac12\big)$. 두 승수가 양수이므로 두 점 모두 서포트 벡터: $x_2$에서 $w^Tx_2+b=+1$, 즉 $\tfrac12\cdot2+\tfrac12\cdot2+b=1$이므로 $b^*=-1$. ($x_1$에서 확인: $0+b=-1=y_1$ ✓.)

**6단계 — 초평면과 마진.**
$$w^{*T}x+b^*=\tfrac12x_1+\tfrac12x_2-1=0\iff x_1+x_2=2.$$
마진(초평면에서 가장 가까운 점까지의 거리)은 $\frac1{\lVert w^*\rVert}=\frac1{\sqrt{1/4+1/4}}=\sqrt2$, 두 마진 평면 $x_1+x_2=0$과 $x_1+x_2=4$ 사이의 폭은 $\frac2{\lVert w^*\rVert}=2\sqrt2$ (두 점 사이 거리 $\sqrt8$와 같음).

**확인.** 원문제 값 $\frac12\lVert w^*\rVert^2=\frac14$ = 쌍대 값 $g^*=\frac14$ (강한 쌍대성). 기하로도: 두 점의 중점 $(1,1)$을 지나고 두 점을 잇는 방향 $(1,1)$에 수직인 직선이 $x_1+x_2=2$.

:::fig svm2pt
:::

:::ex 예제 4 — 서포트 벡터가 아닌 점 더하기
위 자료에 $x_3=(4,1)$, $y_3=+1$을 더하면 해가 바뀌는가? 쌍대 문제로 확인하세요.
---
$x_3$는 $w^{*T}x_3+b^*=2+0.5-1=1.5>1$이라 기존 해가 여전히 모든 제약을 만족합니다. 쌍대 문제로 보면 제약 $-\alpha_1+\alpha_2+\alpha_3=0$, 목적함수 $\alpha_1+\alpha_2+\alpha_3-\frac12\big(8\alpha_2^2+2\cdot10\alpha_2\alpha_3+17\alpha_3^2\big)$ ($x_2^Tx_3=10$, $x_3^Tx_3=17$). $\alpha_1=\alpha_2+\alpha_3$를 넣으면 $2\alpha_2+2\alpha_3-4\alpha_2^2-10\alpha_2\alpha_3-8.5\alpha_3^2$. $(\alpha_2,\alpha_3)=(\tfrac14,0)$에서 $\alpha_3$ 방향 미분이 $2-10\cdot\tfrac14=-0.5<0$이라 $\alpha_3$을 키우면 손해 → $\alpha_3^*=0$. 해는 그대로이고 상보성($x_3$은 마진 밖 → $\alpha_3=0$)과 일치합니다.
:::

:::tip 풀이 순서 체크리스트
(1) 제약을 $1-y_i(w^Tx_i+b)\le0$ 꼴로 (2) $L=\frac12\lVert w\rVert^2+\sum\alpha_i(1-y_i(\cdot))$ (3) $\nabla_w=0$, $\partial_b=0$ (4) 대입해 $\alpha$만의 함수 (5) 제약 $\sum\alpha_iy_i=0$, $\alpha\ge0$ 아래 최대화 (6) $w=\sum\alpha_iy_ix_i$ (7) $\alpha_i>0$인 점에서 $b=y_i-w^Tx_i$ (8) 마진 $1/\lVert w\rVert$ (폭을 물으면 $2/\lVert w\rVert$). 마지막에 원문제 값 = 쌍대 값인지 확인.
:::
` },
      { k: '7.7', src: 'Problem Set 1 · 문제 4', title: '최대-최소 부등식과 안장점', body: R`
:::idea 쉽게 말하면
두 사람이 게임을 합니다. 나는 행 $x$를 골라 점수 $f(x,y)$를 **크게**, 상대는 열 $y$를 골라 **작게** 하려 합니다. 내가 먼저 공개하고 고르면 상대가 내 선택을 보고 최악으로 대응하므로 나는 $\max_x\min_yf$를 얻고, 상대가 먼저 공개하면 내가 대응하므로 $\min_y\max_xf$를 얻습니다. **나중에 고르는 쪽이 정보가 많아 유리**하므로 $\max_x\min_yf\le\min_y\max_xf$. 이것이 최대-최소 부등식이고, SVM의 약한 쌍대성이 바로 이것입니다.
:::

:::key 최대-최소 부등식
공집합이 아닌 집합 $X,Y$와 함수 $f:X\times Y\to\mathbb R$에 대해 (최대·최소가 존재할 때)
$$\max_{x\in X}\min_{y\in Y}f(x,y)\ \le\ \min_{y\in Y}\max_{x\in X}f(x,y).$$
최대·최소가 존재하지 않으면 $\sup$, $\inf$로 바꿔 같은 부등식이 성립한다.
:::

### Problem Set 1 문제 4: 증명

$g(x)=\min_{y\in Y}f(x,y)$, $h(y)=\max_{x\in X}f(x,y)$로 둡니다. 임의의 $x'\in X$, $y'\in Y$를 고정하면
$$g(x')=\min_yf(x',y)\ \le\ f(x',y')\ \le\ \max_xf(x,y')=h(y').$$
(최솟값은 어떤 특정 값 이하, 최댓값은 어떤 특정 값 이상.) 즉 **모든** $x'$과 **모든** $y'$에 대해 $g(x')\le h(y')$.
- 좌변은 $y'$와 무관하므로, $y'$를 바꿔 가며 우변의 최솟값을 취해도 부등식이 유지됩니다: $g(x')\le\min_{y'}h(y')$.
- 이제 우변은 $x'$와 무관한 상수이므로, 좌변의 최댓값을 취해도 유지됩니다: $\max_{x'}g(x')\le\min_{y'}h(y')$.
이것이 $\max_x\min_yf\le\min_y\max_xf$입니다. ∎

**sup/inf 버전.** 같은 논리로 $\inf_yf(x',y)\le f(x',y')\le\sup_xf(x,y')$에서 $\sup_{x'}\inf_yf\le\inf_{y'}\sup_xf$. “$a\le b_y$가 모든 $y$에서 성립하면 $a\le\inf_yb_y$”(하한의 정의)와 “$a_x\le b$가 모든 $x$에서 성립하면 $\sup_xa_x\le b$”를 쓰면 됩니다.

### 등호가 성립하지 않는 반례

$X=Y=\{0,1\}$, $f(x,y)=1$ ($x\ne y$), $0$ ($x=y$) — 즉 $f(x,y)=(x-y)^2$. 표로 쓰면

| | $y=0$ | $y=1$ | $\min_y$ |
|---|---|---|---|
| $x=0$ | 0 | 1 | 0 |
| $x=1$ | 1 | 0 | 0 |
| $\max_x$ | 1 | 1 | |

- $\max_x\min_yf=\max(0,0)=0$ (어떤 $x$를 고르든 상대가 $y=x$로 맞춰 0을 만듦)
- $\min_y\max_xf=\min(1,1)=1$ (어떤 $y$를 고르든 내가 $x\ne y$로 1을 만듦)

$0<1$이므로 등호가 성립하지 않습니다. “동전 맞히기” 게임입니다.

:::ex 예제 5 — 연속인 반례와 등호인 예
(a) $X=Y=[0,1]$, $f(x,y)=(x-y)^2$ (b) $X=Y=[-1,1]$, $f(x,y)=x^2-y^2$에서 두 값을 비교하세요.
---
(a) $\min_y(x-y)^2=0$ ($y=x$)이므로 $\max_x\min_y=0$. $\max_x(x-y)^2=\max(y^2,(1-y)^2)$이고 이것의 $y$에 대한 최솟값은 $y=\tfrac12$에서 $\tfrac14$. $0<\tfrac14$ — 등호 실패.
(b) $\min_y(x^2-y^2)=x^2-1$, $\max_x=0$ ($x=\pm1$). $\max_x(x^2-y^2)=1-y^2$, $\min_y=0$ ($y=\pm1$). 둘 다 0 — 등호. $(x^*,y^*)=(1,1)$이 아래에서 정의하는 안장점이기 때문입니다: $f(x,1)=x^2-1\le0=f(1,1)\le1-y^2=f(1,y)$.
:::

### 등호의 조건: 안장점

$(x^*,y^*)$가 **안장점** — 모든 $x,y$에 대해 $f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$ — 이면 등호가 성립합니다.
$$\min_y\max_xf\le\max_xf(x,y^*)=f(x^*,y^*)=\min_yf(x^*,y)\le\max_x\min_yf,$$
최대-최소 부등식과 합치면 등호. 폰 노이만·시온의 최소최대 정리는 $X,Y$가 볼록 콤팩트 집합이고 $f$가 $x$에 대해 오목, $y$에 대해 볼록이면(연속성 등 조건 아래) 안장점이 있어 등호가 성립한다고 말합니다. 반례 (a)의 $(x-y)^2$는 $x$에 대해 볼록(오목이 아님)이라 조건이 깨집니다.

### SVM과의 연결

7.4절의 라그랑지안에서 **최대화**하는 변수가 $\alpha$, **최소화**하는 변수가 $(w,b)$입니다. 위 부등식에서 $x\to\alpha$, $y\to(w,b)$, $f\to L_p$로 바꾸면
$$\max_{\alpha\ge0}\min_{w,b}L_p\ \le\ \min_{w,b}\max_{\alpha\ge0}L_p,$$
즉 “쌍대 문제의 값 ≤ 원문제의 값”(약한 쌍대성)입니다. $L_p$는 $(w,b)$에 대해 볼록, $\alpha$에 대해 선형(오목)이라 안장점 조건이 성립해 등호(강한 쌍대성)가 되고, 그 안장점이 7.6절에서 구한 $(w^*,b^*,\alpha^*)$입니다.

:::warn 흔한 실수
증명에서 “$\min_yf(x,y)\le\max_xf(x,y)$이므로…”처럼 **같은** $(x,y)$ 하나만 비교하고 끝내면 틀립니다. 서로 다른 임의의 $x'$, $y'$에 대해 $g(x')\le f(x',y')\le h(y')$를 세운 뒤, 한쪽씩 최적화하는 두 단계를 반드시 써야 합니다.
:::
` },
    ],
  });
})();
