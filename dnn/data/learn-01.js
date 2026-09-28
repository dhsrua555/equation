/* 개념 정리 — 01 선형회귀와 정규방정식 (1주차 수요일 슬라이드 3–12, 슬라이드 6 필기).
   처음 배우는 사람이 읽을 수 있게 직관부터 시작하고, 유도는 한 줄도 건너뛰지 않으며, 끝에 전공자용 보충을 붙였습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 1,
    tagline: R`제곱오차합 $\lVert y-X\beta\rVert^2$을 벡터로 미분해 0으로 두면 정규방정식이 나옵니다. 이 과목의 모든 유도가 이 계산에서 시작합니다.`,
    summary: R`자료 $(x_i,y_i)$를 가장 잘 설명하는 직선(일반적으로는 선형모델 $y=X\beta+\varepsilon$)을 찾는 문제입니다. “가장 잘”을 **제곱오차합을 최소로**라는 뜻으로 정하면, 문제는 $\beta$에 대한 함수 $f(\beta)=\lVert y-X\beta\rVert^2$의 최소화가 됩니다. 수업에서는 필기로 두 벡터 미분 공식 $\nabla_\beta(\beta^Tm)=m$, $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$를 증명하고, 이를 써서 정규방정식 $X^TX\beta=X^Ty$를 유도했습니다. 같은 목적함수를 경사하강법으로 푸는 방법과 그 단점(한 걸음에 전체 자료를 훑어야 함)도 다룹니다. 이 단원의 계산(전개 → 스칼라 전치 → 미분 → 0으로 두기)은 로지스틱 회귀, 릿지, 커널, 신경망까지 그대로 반복됩니다.`,
    goals: [
      R`선형회귀 모델을 행렬 꼴 $y=X\beta+\varepsilon$으로 쓰고 $X$의 크기와 첫 열의 의미를 말할 수 있다`,
      R`$\nabla_\beta(\beta^Tm)=m$, $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$를 성분 계산으로 증명할 수 있다`,
      R`$f(\beta)=\lVert y-X\beta\rVert^2$을 전개·미분해 정규방정식과 $\hat\beta=(X^TX)^{-1}X^Ty$를 유도할 수 있다`,
      R`$X^TX$가 가역일 조건과, 해가 최솟값인 이유(헤시안 $2X^TX\succeq0$)를 설명할 수 있다`,
      R`경사하강법 갱신식 $\beta_l\leftarrow\beta_l-\alpha\,\partial f/\partial\beta_l$을 성분으로 쓰고 단점을 말할 수 있다`,
      R`잔차가 $X$의 열공간과 직교한다는 기하학적 의미와, 학습률이 너무 크면 발산하는 이유를 설명할 수 있다`,
    ],
    sections: [
      { k: '1.1', src: 'W1 수 · 슬라이드 3–5', title: '선형회귀 모델과 제곱오차합', body: R`
:::idea 쉽게 말하면
키로 몸무게를 예측하고 싶다고 합시다. 사람 몇 명의 (키, 몸무게)를 점으로 찍으면 대략 오른쪽 위로 올라가는 띠가 보입니다. 이 띠를 **직선 하나**로 요약하는 것이 선형회귀입니다. 직선 $\hat y=\beta_0+\beta_1x$에서 $\beta_1$은 “키가 1 늘 때 몸무게가 평균적으로 얼마나 느는가”(기울기), $\beta_0$은 출발 높이(절편)입니다.
직선은 모든 점을 지날 수 없으니 점마다 **어긋남**(잔차) $y_i-\hat y_i$가 생깁니다. 어긋남을 모두 모아 하나의 점수로 만들고, 그 점수가 가장 작은 직선을 “가장 좋은 직선”이라고 **정의**합니다.
:::

### 모델: 설명변수가 여러 개일 때

자료가 $n$개, 설명변수가 $k$개 있다고 합시다. $i$번째 자료는 $(x_{i1},\dots,x_{ik},\,y_i)$이고 보통 $n>k$입니다. 선형회귀 모델은
$$y_i=\beta_0+\sum_{j=1}^{k}x_{ij}\beta_j+\varepsilon_i,\qquad i=1,\dots,n$$
입니다. $\varepsilon_i$는 모델이 설명하지 못하는 오차(측정 잡음, 빠진 변수 등)입니다. “선형”은 $x$가 아니라 **계수 $\beta$에 대해 선형**이라는 뜻입니다. 그래서 $x_{i2}=x_{i1}^2$처럼 변수를 가공해 넣어도 여전히 선형회귀입니다[[ch04:4.2|다항회귀도 설계행렬의 열을 $1,x,x^2,\dots$로 둔 선형회귀입니다.]].

### 행렬로 한 줄에 쓰기

$n$개의 식을 따로 쓰는 대신 벡터와 행렬로 모읍니다[[@em:ch06:7.2|행렬곱 $AB$의 $(i,j)$ 성분은 $A$의 $i$행과 $B$의 $j$열의 내적입니다.]].
$$y=\begin{pmatrix}y_1\\\vdots\\y_n\end{pmatrix},\quad X=\begin{pmatrix}1&x_{11}&\cdots&x_{1k}\\\vdots&\vdots&&\vdots\\1&x_{n1}&\cdots&x_{nk}\end{pmatrix},\quad \beta=\begin{pmatrix}\beta_0\\\vdots\\\beta_k\end{pmatrix},\quad y=X\beta+\varepsilon$$
$X\beta$의 $i$번째 성분은 $X$의 $i$행과 $\beta$의 내적 $1\cdot\beta_0+x_{i1}\beta_1+\dots+x_{ik}\beta_k$이므로 위의 $n$개 식과 정확히 같습니다. $X$를 **설계행렬**이라 하고 크기는 $n\times(k+1)$입니다. **첫 열이 모두 1**인 것은 절편 $\beta_0$을 곱하기 위해서입니다(“항상 1인 가짜 변수” $x_{i0}=1$).

:::ex 예제 1 — 설계행렬 만들기
세 사람의 (공부 시간 $x_1$, 수면 시간 $x_2$, 점수 $y$)가 $(2,7,70)$, $(4,6,80)$, $(5,8,92)$이다. $y=X\beta+\varepsilon$의 $X$, $y$를 쓰고, $\beta=(40,5,3)^T$일 때 예측값과 오차를 구하세요.
---
$$X=\begin{pmatrix}1&2&7\\1&4&6\\1&5&8\end{pmatrix}\ (3\times3),\qquad y=\begin{pmatrix}70\\80\\92\end{pmatrix}.$$
$X\beta=(40+10+21,\ 40+20+18,\ 40+25+24)^T=(71,78,89)^T$. 오차 $\varepsilon=y-X\beta=(-1,2,3)^T$, 제곱오차합 $1+4+9=14$.
:::

### 점수 매기기: 제곱오차합

:::def 최소제곱 목적함수
오차의 제곱합을 $\beta$의 함수로 봅니다.
$$\begin{aligned}f(\beta)&:=\sum_{i=1}^n\varepsilon_i^2=\sum_{i=1}^n\Big(y_i-\beta_0-\sum_{j=1}^kx_{ij}\beta_j\Big)^2\\&=\lVert y-X\beta\rVert^2=(y-X\beta)^T(y-X\beta)\end{aligned}$$
$f$를 최소로 하는 $\hat\beta$를 **최소제곱추정량**(LSE)이라 합니다.
:::

마지막 등호는 벡터 $v$의 길이의 제곱이 $\lVert v\rVert^2=v_1^2+\dots+v_n^2=v^Tv$라는 사실입니다($v^T$는 $v$를 눕힌 행벡터).

**왜 하필 제곱인가.** 세 가지 이유가 있습니다.
- (a) 잔차를 그냥 더하면 $+3$과 $-3$이 상쇄됩니다. 부호를 없애야 합니다.
- (b) 절댓값 $\lvert\varepsilon_i\rvert$도 부호를 없애지만 0에서 미분이 안 됩니다. 제곱은 어디서나 미분 가능해서 “미분해서 0” 방법이 통하고, 답이 식 하나로 나옵니다.
- (c) 오차가 정규분포를 따른다고 가정하면 제곱오차합 최소화가 **최대가능도 추정**과 정확히 같아집니다[[ch04:4.1|잡음이 $\mathcal N(0,\sigma^2)$이면 로그가능도가 $-\frac1{2\sigma^2}\lVert y-X\beta\rVert^2+$상수입니다.]]. 제곱은 임의의 선택이 아니라 확률 모델에서 나오는 선택입니다.

대신 제곱은 큰 오차를 크게 벌주므로 이상치(outlier) 하나에 직선이 끌려갈 수 있습니다.

:::fig lsqfit
:::

:::tip 크기부터 확인하기
유도 문제에서는 각 항의 크기를 먼저 적어 두면 전치를 어디에 붙일지 헷갈리지 않습니다. $y:n\times1$, $X:n\times(k+1)$, $\beta:(k+1)\times1$이므로 $X^Ty$와 $X^TX\beta$는 $(k+1)\times1$, $X^TX$는 $(k+1)\times(k+1)$입니다. 곱 $AB$는 $A$의 열 수와 $B$의 행 수가 같을 때만 정의되고, 결과의 크기는 (A의 행)×(B의 열)입니다.
:::

### 더 깊이: 평균·분산 언어로 보기

$f(\beta)/n$을 **평균제곱오차**(MSE)라 합니다. 상수배는 최솟점을 바꾸지 않으므로 SSE를 최소화하든 MSE를 최소화하든 같은 $\hat\beta$가 나옵니다. 머신러닝에서는 표본 수와 상관없이 비교하기 위해 MSE를 더 자주 씁니다. 또 절편이 있는 모델에서는 최적의 $\hat\beta_0$이 항상 $\bar y-\sum_j\hat\beta_j\bar x_j$가 되어(1.3절 끝), 직선이 **무게중심** $(\bar x,\bar y)$를 반드시 지납니다.
` },
      { k: '1.2', src: 'W1 수 · 슬라이드 6 필기', title: '벡터 미분의 두 공식', body: R`
:::idea 쉽게 말하면
변수가 하나일 때 최솟점은 “도함수 = 0”인 곳입니다. 변수가 $\beta_0,\beta_1,\dots$ 여러 개면 각 변수 방향의 도함수(편도함수)를 **모두** 0으로 만들어야 합니다. 편도함수를 세로로 쌓은 벡터를 **기울기(gradient)** $\nabla_\beta g$라 하고, 조건은 한 줄 $\nabla_\beta g=0$이 됩니다.
한 변수에서 $\frac{d}{dx}(mx)=m$, $\frac{d}{dx}(ax^2)=2ax$였습니다. 벡터에서도 거의 같은 모양의 공식이 성립하고, 그 두 공식이 정규방정식 유도의 전부입니다.
:::

스칼라 함수 $g(\beta)$ ($\beta\in\mathbb R^p$)의 기울기는
$$\nabla_\beta g=\Big(\frac{\partial g}{\partial\beta_1},\ \dots,\ \frac{\partial g}{\partial\beta_p}\Big)^T$$
입니다[[@em:ch08:9.7|기울기는 편도함수를 모은 벡터이고, 함수가 가장 빠르게 증가하는 방향을 가리킵니다.]]. 편도함수 $\partial g/\partial\beta_l$은 “다른 변수는 상수로 두고 $\beta_l$로만 미분한 것”입니다[[@base:ch04:4.1|편미분과 선형 근사.]].

:::key 행렬 미분 공식
$$\nabla_\beta\big(\beta^Tm\big)=\nabla_\beta\big(m^T\beta\big)=m,\qquad \nabla_\beta\big(\beta^TA\beta\big)=(A+A^T)\beta$$
$A$가 대칭이면 $\nabla_\beta(\beta^TA\beta)=2A\beta$.
:::

### 증명 (수업 필기)

:::hand 수업 필기 — 성분으로 보이기
(a) $\beta^Tm=\beta_1m_1+\beta_2m_2+\beta_3m_3$ 이므로 $\partial/\partial\beta_l$ 하면 $m_l$만 남습니다. 모으면 $\nabla_\beta(\beta^Tm)=m$.

(b) $\beta^TA\beta=\sum_{i,j}\beta_iA_{ij}\beta_j$를 $\beta_k$로 미분하면 $\beta_k$가 들어 있는 항은 두 종류입니다.
- (i) $i=k$인 항: $\sum_jA_{kj}\beta_j=(A\beta)_k$
- (ii) $j=k$인 항: $\sum_i\beta_iA_{ik}=(A^T\beta)_k$

$i=j=k$인 항 $A_{kk}\beta_k^2$은 두 곳에 한 번씩 들어가고, 그 미분 $2A_{kk}\beta_k$도 두 합에 반씩 나뉘어 정확히 맞습니다. 따라서 $\dfrac{\partial}{\partial\beta_k}\beta^TA\beta=(A\beta)_k+(A^T\beta)_k$, 즉 $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$.
:::

(b)가 헷갈리면 곱의 미분법으로 보면 됩니다. $\beta^TA\beta$에는 $\beta$가 두 번 나옵니다. 앞의 $\beta$만 변수로 보면 $\beta^T(A\beta)$, 즉 $m=A\beta$인 (a)형이라 $A\beta$. 뒤의 $\beta$만 변수로 보면 $(\beta^TA)\beta=(A^T\beta)^T\beta$, 즉 $m=A^T\beta$인 (a)형이라 $A^T\beta$. 둘을 더하면 $(A+A^T)\beta$ — 한 변수의 $(uv)'=u'v+uv'$와 똑같은 구조입니다.

:::ex 예제 2 — 2차원에서 직접 확인
$A=\begin{pmatrix}1&2\\0&3\end{pmatrix}$, $\beta=(\beta_1,\beta_2)^T$일 때 $\beta^TA\beta$를 전개해 기울기를 구하고 공식과 비교하세요.
---
$\beta^TA\beta=\beta_1^2+2\beta_1\beta_2+3\beta_2^2$ ($A_{21}=0$이라 $\beta_2\beta_1$ 항이 없음).
편미분: $\partial/\partial\beta_1=2\beta_1+2\beta_2$, $\partial/\partial\beta_2=2\beta_1+6\beta_2$.
공식: $A+A^T=\begin{pmatrix}2&2\\2&6\end{pmatrix}$, $(A+A^T)\beta=(2\beta_1+2\beta_2,\ 2\beta_1+6\beta_2)^T$. 일치합니다.
:::

:::warn 비대칭 행렬에 2Aβ를 쓰지 마세요
$A=\begin{pmatrix}0&1\\0&0\end{pmatrix}$이면 $\beta^TA\beta=\beta_1\beta_2$이고 기울기는 $(\beta_2,\beta_1)^T=(A+A^T)\beta$입니다. $2A\beta=(2\beta_2,0)^T$는 틀립니다. 다만 $\beta^TA\beta=\beta^T\tfrac{A+A^T}{2}\beta$이므로 항상 대칭 부분만 남긴다고 생각해도 됩니다.
:::

### 자주 쓰는 따름 공식

두 기본 공식을 조합하면 이 과목에서 계속 쓰는 공식이 나옵니다.
- $\nabla_\beta\lVert\beta\rVert^2=\nabla_\beta(\beta^TI\beta)=2\beta$ (릿지 규제항의 기울기[[ch04:4.3|릿지의 $\lambda\lVert\beta\rVert^2$을 미분하면 $2\lambda\beta$.]])
- $\nabla_\beta\lVert A\beta-b\rVert^2=2A^T(A\beta-b)$ ($A$가 정사각이 아니어도 성립)
- $\nabla_\beta\,(c^T\beta+d)=c$ (상수 $d$는 사라짐)

두 번째는 전개 $\lVert A\beta-b\rVert^2=\beta^TA^TA\beta-2b^TA\beta+b^Tb$에 두 공식을 쓰면 $2A^TA\beta-2A^Tb$입니다.

### 더 깊이: 기울기 = 1차 근사의 계수

$g(\beta+h)=g(\beta)+\nabla g(\beta)^Th+o(\lVert h\rVert)$를 만족하는 벡터가 기울기입니다. 예컨대 $g=\beta^TA\beta$이면
$$g(\beta+h)=\beta^TA\beta+\beta^TAh+h^TA\beta+h^TAh=g(\beta)+\big((A+A^T)\beta\big)^Th+O(\lVert h\rVert^2)$$
이므로 성분 계산 없이 $(A+A^T)\beta$가 나옵니다. 신경망의 역전파에서 행렬 변수의 기울기를 구할 때 이 “1차 항 읽어 내기” 방법이 가장 빠릅니다[[ch09:9.5|벡터 입출력에서는 야코비안이 같은 역할을 합니다.]]. 기울기를 열벡터로 쓰는지 행벡터로 쓰는지(분모/분자 레이아웃)는 책마다 다르니, 이 과목처럼 **열벡터**로 통일하세요.
` },
      { k: '1.3', src: 'W1 수 · 슬라이드 6 필기', title: '정규방정식과 최소제곱해', body: R`
:::idea 쉽게 말하면
제곱오차합 $f(\beta)$는 $\beta$에 대한 “그릇 모양”(아래로 볼록한 이차함수) 곡면입니다. 그릇의 바닥에서는 모든 방향의 기울기가 0입니다. 그래서 $\nabla f=0$을 풀면 바닥, 즉 가장 좋은 직선이 나옵니다. 이 방정식을 **정규방정식**이라 부릅니다.
:::

### 유도: 전개 → 합치기 → 미분 → 0

**1단계 (전개).** $f(\beta)=(y-X\beta)^T(y-X\beta)$를 분배법칙으로 펼칩니다. $(X\beta)^T=\beta^TX^T$ (곱의 전치는 순서가 뒤집힘)이므로
$$f(\beta)=y^Ty-y^TX\beta-\beta^TX^Ty+\beta^TX^TX\beta.$$

**2단계 (스칼라 전치로 합치기).** $y^TX\beta$는 $(1\times n)(n\times p)(p\times1)=1\times1$, 즉 **숫자 하나**입니다. 숫자는 전치해도 같으므로 $y^TX\beta=(y^TX\beta)^T=\beta^TX^Ty$. 따라서
$$f(\beta)=y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta.$$

**3단계 (미분).** 1.2절의 공식에서 $m=X^Ty$, $A=X^TX$로 둡니다. $A^T=(X^TX)^T=X^TX=A$ (대칭)이므로 $(A+A^T)\beta=2X^TX\beta$. 첫 항 $y^Ty$는 $\beta$와 무관한 상수라 기울기가 0입니다.
$$\nabla_\beta f=-2X^Ty+2X^TX\beta.$$

**4단계 (0으로 두기).**

:::key 정규방정식
$$\nabla_\beta f(\beta)=-2X^T(y-X\beta)=0\iff X^TX\beta=X^Ty$$
$X^TX$가 가역이면 $\hat\beta=(X^TX)^{-1}X^Ty$.
:::

### 두 가지 확인: 해가 있는가, 최소인가

**언제 가역인가.** $X^TX$가 가역 $\iff$ $X$의 열들이 일차독립($\operatorname{rank}X=k+1$)입니다. $X^TXv=0$이면 $v^TX^TXv=\lVert Xv\rVert^2=0$에서 $Xv=0$이기 때문입니다[[@em:ch06:7.4|계수와 일차독립. 열이 일차독립이면 $Xv=0$의 해는 $v=0$뿐입니다.]]. 즉 열이 일차독립이면 $v=0$뿐이라 $X^TX$의 영공간이 $\{0\}$, 곧 가역입니다. 반대로 열이 종속이면 $Xv=0$인 $v\ne0$이 있어 $X^TXv=0$이므로 가역이 아닙니다. 자료 수가 변수 수보다 적으면($n<k+1$) 이 조건이 깨집니다. 같은 변수를 단위만 바꿔 두 번 넣어도(예: cm와 m) 열이 비례해 깨집니다.

**왜 최솟값인가.** 헤시안(이계도함수를 모은 행렬)이 $\nabla^2f=2X^TX$이고, 모든 $v$에 대해 $v^T(2X^TX)v=2\lVert Xv\rVert^2\ge0$이므로 $f$는 볼록합니다[[@base:ch04:4.3|헤시안이 양의 준정부호이면 볼록, 임계점이 최소.]]. 볼록함수에서 기울기가 0인 점은 전역 최솟점입니다. 열이 일차독립이면 $2X^TX\succ0$이라 최솟점이 하나뿐입니다.

### 기하학적 의미: 정사영

정규방정식은 $X^T(y-X\hat\beta)=0$, 즉 잔차 $r=y-\hat y$가 $X$의 **모든 열과 직교**한다는 뜻입니다. $X\beta$로 만들 수 있는 벡터 전체(열공간)는 $\mathbb R^n$ 속의 평면이고, $y$는 보통 그 평면 밖에 있습니다. 평면 위에서 $y$에 가장 가까운 점은 $y$에서 평면으로 **수선을 내린 발**입니다[[@em:ch06:7.9c|내적공간에서 부분공간으로의 정사영이 최선 근사입니다.]]. 그 발이 $\hat y=X\hat\beta=X(X^TX)^{-1}X^Ty$이고, $H=X(X^TX)^{-1}X^T$를 **모자 행렬**이라 부릅니다($H^T=H$, $H^2=H$ — 이미 평면 위에 있는 점은 다시 사영해도 그대로).

미적분 없이도 최소임을 보일 수 있습니다. 아무 $\beta$에 대해 $y-X\beta=(y-X\hat\beta)+X(\hat\beta-\beta)$이고 두 항이 직교하므로(첫 항은 열공간과 직교, 둘째 항은 열공간 안) 피타고라스 정리로
$$\lVert y-X\beta\rVert^2=\lVert y-X\hat\beta\rVert^2+\lVert X(\hat\beta-\beta)\rVert^2\ge\lVert y-X\hat\beta\rVert^2.$$

### 예제

:::ex 예제 3 — 네 점에 직선 맞추기
$(x,y)=(0,1),(1,2),(2,2),(3,4)$에 $y=\beta_0+\beta_1x$를 맞추세요.
---
$X^TX=\begin{pmatrix}n&\sum x\\\sum x&\sum x^2\end{pmatrix}=\begin{pmatrix}4&6\\6&14\end{pmatrix}$, $X^Ty=\begin{pmatrix}\sum y\\\sum xy\end{pmatrix}=\begin{pmatrix}9\\18\end{pmatrix}$.
$\det=56-36=20$ 이므로
$$\hat\beta=\frac1{20}\begin{pmatrix}14&-6\\-6&4\end{pmatrix}\begin{pmatrix}9\\18\end{pmatrix}=\frac1{20}\begin{pmatrix}18\\18\end{pmatrix}=\begin{pmatrix}0.9\\0.9\end{pmatrix}.$$
잔차는 $0.1,\,0.2,\,-0.7,\,0.4$이고 합이 0, $x$와의 곱의 합도 $0+0.2-1.4+1.2=0$이라 정규방정식을 만족합니다. 최소 제곱오차합은 $0.70$.
:::

단순회귀($k=1$)에서는 정규방정식을 손으로 풀어 외우기 쉬운 공식을 얻습니다. 첫 식 $n\beta_0+\beta_1\sum x_i=\sum y_i$를 $n$으로 나누면 $\hat\beta_0=\bar y-\hat\beta_1\bar x$ (직선이 무게중심을 지남). 둘째 식에 넣어 정리하면
$$\hat\beta_1=\frac{\sum_i(x_i-\bar x)(y_i-\bar y)}{\sum_i(x_i-\bar x)^2}=\frac{S_{xy}}{S_{xx}}.$$
예제 3에서 $\bar x=1.5$, $\bar y=2.25$, $S_{xx}=2.25+0.25+0.25+2.25=5$, $S_{xy}=4.5$이므로 $\hat\beta_1=0.9$, $\hat\beta_0=2.25-1.35=0.9$. 같은 답입니다.

:::ex 예제 4 — 절편 없는 직선
$x=(1,2,3)$, $y=(2,4,5)$에 $y=\beta x$를 맞추세요.
---
$X=(1,2,3)^T$ 한 열뿐이므로 $X^TX=1+4+9=14$, $X^Ty=2+8+15=25$, $\hat\beta=25/14\approx1.786$. 절편이 없으면 잔차의 합은 0이 아닐 수 있습니다($2-1.786+4-3.571+5-5.357=0.286$). 잔차가 직교하는 대상은 **$X$의 열**뿐이고, 1로 된 열이 없으니 합이 0일 이유가 없습니다.
:::

:::warn 역행렬 공식을 외우기 전에
시험에서 “유도하라”는 문제는 $\hat\beta=(X^TX)^{-1}X^Ty$만 쓰면 점수가 거의 없습니다. 전개 → 스칼라 전치로 두 항 합치기 → 두 미분 공식 → 0으로 두기 → 가역 조건, 순서대로 쓰세요.
:::

### 더 깊이: 실제 계산과 가역이 아닐 때

- 컴퓨터는 $(X^TX)^{-1}$을 직접 만들지 않습니다. $X^TX$의 조건수는 $X$의 조건수의 **제곱**이라 수치 오차가 커지기 때문입니다. 보통 $X=QR$ 분해 후 $R\beta=Q^Ty$를 풀거나 특잇값 분해를 씁니다.
- $X^TX$가 가역이 아니면 정규방정식의 해가 무수히 많습니다(모두 같은 $\hat y$를 줌). 그중 $\lVert\beta\rVert$가 가장 작은 해가 무어-펜로즈 유사역행렬 $X^+y$입니다. 또 다른 처방이 $X^TX+\lambda I$ ($\lambda>0$)로 바꾸는 **릿지**이며, 이 행렬은 언제나 양의 정부호라 가역입니다[[ch04:4.3|릿지 해 $(X^TX+\lambda I)^{-1}X^Ty$.]].
- 계산량은 $X^TX$를 만드는 데 $O(nk^2)$, 푸는 데 $O(k^3)$입니다. 변수가 수백만 개인 신경망에서는 불가능한 양이라 경사하강법을 씁니다.
` },
      { k: '1.4', src: 'W1 수 · 슬라이드 7–10', title: '머신러닝 관점: 가장 좋은 직선', body: R`
:::idea 쉽게 말하면
머신러닝은 “규칙을 사람이 써 주지 않고, 자료를 보고 **점수가 가장 좋은** 규칙을 고르게 하는 것”입니다. 그러려면 세 가지를 정해야 합니다: (1) 후보 규칙의 모양(여기서는 직선), (2) 점수 매기는 법(제곱오차합), (3) 점수를 가장 좋게 만드는 방법(정규방정식 또는 경사하강법).
:::

머신러닝에서는 “자료를 가장 잘 설명하는 직선”을 목적함수의 최소화로 정의합니다. 슬라이드의 예시는 다음과 같습니다.

- 모든 $x$에서 평균값을 내는 **수평선**(기준선)의 제곱오차합은 $24.62$
- 이 직선을 조금 **회전**하면 제곱오차합이 $16.5$로 줄어듦
- 회전 각도에 따라 제곱오차합을 그리면 **처음에는 줄다가 다시 늘어나는** 모양 → 그 최저점이 최적의 직선

즉 목적함수는 제곱오차합(SSE)이고, 1.3절의 정규방정식은 이 최저점을 한 번에 계산하는 방법, 1.5절의 경사하강법은 최저점을 향해 조금씩 내려가는 방법입니다. SSE가 “한 번 줄었다가 늘어나는” 그릇 모양인 것은 $f$가 볼록이기 때문입니다.

:::fig sseslope
:::

### 용어 정리

| 용어 | 이 단원에서 | 일반적으로 |
|---|---|---|
| 모델(가설) | $\hat y=X\beta$ | 입력을 출력으로 보내는 함수 $f(x;\theta)$ |
| 파라미터 | $\beta$ | 자료로 배우는 값 $\theta$ (신경망의 가중치) |
| 손실(목적함수) | $\lVert y-X\beta\rVert^2$ | 예측이 얼마나 틀렸는지의 점수 |
| 학습(훈련) | 정규방정식 또는 경사하강법 | 손실을 최소화하는 과정 |
| 기준선 | 평균 $\bar y$로 예측 | 아무것도 배우지 않은 예측기 |

### 기준선과 결정계수

기준선(수평선 $\hat y=\bar y$)의 제곱오차합 $S_{yy}=\sum(y_i-\bar y)^2$을 **총제곱합**이라 합니다. 모델이 이것을 얼마나 줄였는지의 비율
$$R^2=1-\frac{\mathrm{SSE}}{S_{yy}}$$
를 **결정계수**라 부릅니다. 예제 3(1.3절)에서는 $S_{yy}=4.75$, $\mathrm{SSE}=0.70$이라 $R^2\approx0.853$ — 직선이 $y$의 흩어짐의 약 85%를 설명합니다. 슬라이드 자료로는 $1-16.5/24.62\approx0.33$은 “회전 중간”의 값이고, 최적 직선에서는 더 커집니다.

:::warn 훈련 오차가 작다고 좋은 모델은 아니다
직선 대신 매우 구불구불한 곡선을 쓰면 SSE를 0까지 줄일 수 있습니다. 하지만 새 자료에서는 엉망이 됩니다(과적합). 이 문제는 4단원의 다항회귀·규제에서 다룹니다[[ch04:4.2|점 10개에 9차 다항식을 맞추면 훈련 오차는 0이지만 예측은 나빠집니다.]].
:::
` },
      { k: '1.5', src: 'W1 수 · 슬라이드 11–12', title: '경사하강법으로 풀기', body: R`
:::idea 쉽게 말하면
짙은 안개 속 산에서 가장 낮은 곳으로 가려면? 발밑의 경사를 느끼고 **가장 가파르게 내려가는 쪽으로 한 걸음** 옮기고, 다시 경사를 느끼고, 또 한 걸음… 이것이 경사하강법입니다. 한 걸음의 크기가 **학습률** $\alpha$입니다. 너무 작으면 한참 걸리고, 너무 크면 골짜기를 건너뛰어 반대편 벽으로 튀어 오릅니다.
:::

역행렬을 구하지 않고도 $f$의 최솟점에 다가갈 수 있습니다. 현재 위치에서 기울기의 반대 방향으로 조금씩 움직입니다[[ch13:13.1|왜 기울기의 반대 방향이 가장 빨리 내려가는 방향인지는 13단원에서 테일러 전개로 보입니다.]].

### 편도함수 계산

$x_{i0}=1$로 두면 $f(\beta)=\sum_i\big(y_i-\sum_{j=0}^k\beta_jx_{ij}\big)^2$. 연쇄법칙으로 $\beta_l$에 대해 미분하면, 괄호 안을 $\beta_l$로 미분한 값이 $-x_{il}$이므로
$$\begin{aligned}\frac{\partial f}{\partial\beta_l}&=\sum_{i=1}^n2\Big(y_i-\sum_j\beta_jx_{ij}\Big)\cdot(-x_{il})\\&=-2\sum_{i=1}^n\Big(y_i-\big(\beta_0+\sum_{j=1}^k\beta_jx_{ij}\big)\Big)x_{il},\qquad 0\le l\le k.\end{aligned}$$
벡터로 모으면 $\nabla f=-2X^T(y-X\beta)$ — 1.3절과 같은 식입니다.

:::key 경사하강법 갱신식 (선형회귀)
$$\beta_l\leftarrow\beta_l-\alpha\frac{\partial f}{\partial\beta_l}=\beta_l+2\alpha\sum_{i=1}^n\big(y_i-\hat y_i\big)x_{il}\qquad(0\le l\le k)$$
슬라이드에서는 상수 2를 학습률 $\alpha$에 흡수해 $\beta_l\leftarrow\beta_l+\alpha\sum_i(y_i-\hat y_i)x_{il}$로 씁니다. 모든 $l$을 **동시에** 갱신하고 수렴할 때까지 반복합니다.
:::

갱신식은 읽기 쉽습니다. 예측이 모자라면($y_i-\hat y_i>0$) 그 자료의 $x_{il}$ 방향으로 $\beta_l$을 키우고, 넘치면 줄입니다. 오차가 큰 자료일수록 더 세게 끌어당깁니다.

- **장점**: 가장 가파르게 감소하는 방향으로 움직이는 자연스러운 방법입니다. 역행렬이 필요 없고, 모델이 선형이 아니어도(신경망) 그대로 쓸 수 있습니다.
- **단점**: 한 걸음을 떼기 전에 **훈련 자료 전체**를 훑어 합 $\sum_{i=1}^n$을 계산해야 합니다. 자료가 많으면 느립니다 → 10단원의 확률적(미니배치) 경사하강법[[ch10:10.1|전체 배치 대신 일부 자료로 기울기를 추정합니다.]].

### 예제

:::ex 예제 5 — 한 걸음 계산
예제 3의 자료에서 $\beta=(0,0)$, $\alpha=0.01$로 슬라이드 규칙 $\beta_l\leftarrow\beta_l+\alpha\sum_i(y_i-\hat y_i)x_{il}$을 한 번 적용하세요.
---
$\hat y_i=0$이므로 $\beta_0\leftarrow0.01\sum y_i=0.09$, $\beta_1\leftarrow0.01\sum x_iy_i=0.18$. 두 성분을 **이전 값으로** 동시에 계산해야 합니다.
:::

:::ex 예제 6 — 두 걸음째와 손실의 변화
예제 5에 이어 한 번 더 갱신하고, 제곱오차합이 어떻게 변하는지 보세요.
---
$\beta=(0.09,0.18)$에서 예측 $\hat y=(0.09,0.27,0.45,0.63)$, 잔차 $r=(0.91,1.73,1.55,3.37)$.
$\sum r_i=7.56$, $\sum r_ix_i=0+1.73+3.10+10.11=14.94$이므로 $\beta\leftarrow(0.09+0.0756,\ 0.18+0.1494)=(0.1656,\ 0.3294)$.
제곱오차합은 $25\to17.58\to12.44$로 줄어듭니다(세 번째 걸음 뒤 $8.89$). 이렇게 계속하면 $(0.9,0.9)$로 다가갑니다.
:::

### 학습률의 한계

손실이 이차함수이므로 경사하강법의 거동을 정확히 계산할 수 있습니다. 슬라이드 규칙은 $\beta\leftarrow\beta+\alpha X^T(y-X\beta)$이고, 최솟점 $\hat\beta$에서 $X^Ty=X^TX\hat\beta$이므로 오차 $e=\beta-\hat\beta$는
$$e\leftarrow(I-\alpha X^TX)\,e$$
로 변합니다. $X^TX$의 고윳값을 $\lambda_1\ge\dots\ge\lambda_p>0$이라 하면 고유벡터 방향마다 $e$가 $(1-\alpha\lambda_i)$배씩 됩니다[[@em:ch07:8.4|대칭행렬은 직교 고유벡터로 대각화됩니다.]]. 따라서
$$\text{수렴}\iff\lvert1-\alpha\lambda_i\rvert<1\ \ \forall i\iff0<\alpha<\frac2{\lambda_{\max}(X^TX)}.$$
예제 3에서 $X^TX=\begin{pmatrix}4&6\\6&14\end{pmatrix}$의 고윳값은 $9\pm\sqrt{61}\approx16.81,\ 1.19$라서 한계는 $2/16.81\approx0.119$입니다. $\alpha=0.12$로 200번 돌리면 $\beta\approx(-14.6,-32.1)$로 발산합니다.

:::fig gdpath
:::

그림처럼 두 고윳값의 비(**조건수** $\lambda_{\max}/\lambda_{\min}\approx14$)가 크면 등고선이 길쭉해져 경사하강법이 느려집니다. 가장 느린 방향은 매 걸음 $1-\alpha\lambda_{\min}$배밖에 줄지 않기 때문입니다. 입력을 평균 0, 분산 1로 맞추는 **표준화**가 도움이 되는 이유이고[[ch12:12.3|배치 정규화는 이 표준화를 층마다 합니다.]], 5주차의 모멘텀·Adam이 해결하려는 문제입니다[[ch14:14.1|나쁜 조건수: 한 방향은 가파르고 다른 방향은 완만한 손실.]].

:::tip 동시 갱신
$\beta_0$을 먼저 바꾼 뒤 그 값으로 $\beta_1$의 잔차를 계산하면 경사하강법이 아닙니다(좌표 하강에 가까워집니다). 코드로는 기울기 벡터를 먼저 다 계산하고 한 번에 빼세요.
:::
` },
    ],
  });
})();
