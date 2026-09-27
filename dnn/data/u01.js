/* 01 선형회귀와 정규방정식 — 1주차 수요일 슬라이드 3–12 (s.6 필기) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 1, part: 'A', title: '선형회귀와 정규방정식', en: 'Linear Regression & Normal Equations', ref: 'W1 수 · s.3–12', plot: 'lsq',
    fig: R`자료점과 무게중심을 지나며 회전하는 직선들. 굵은 선이 제곱오차합을 최소로 하는 직선`,
    tagline: R`제곱오차합 $\lVert y-X\beta\rVert^2$을 벡터로 미분해 0으로 두면 정규방정식이 나옵니다. 이 과목의 모든 유도가 이 계산에서 시작합니다.`,
    summary: R`자료 $(x_i,y_i)$를 설명하는 선형모델 $y=X\beta+\varepsilon$의 계수를 제곱오차합 최소화로 구합니다. 수업에서는 필기로 두 벡터 미분 공식 $\nabla_\beta(\beta^Tm)=m$, $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$를 증명하고, 이를 써서 정규방정식 $X^TX\beta=X^Ty$를 유도했습니다. 같은 목적함수를 경사하강법으로 푸는 방법과 그 단점(한 걸음에 전체 자료를 훑어야 함)도 다룹니다.`,
    goals: [
      R`선형회귀 모델을 행렬 꼴 $y=X\beta+\varepsilon$으로 쓰고 $X$의 크기와 첫 열의 의미를 말할 수 있다`,
      R`$\nabla_\beta(\beta^Tm)=m$, $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$를 성분 계산으로 증명할 수 있다`,
      R`$f(\beta)=\lVert y-X\beta\rVert^2$을 전개·미분해 정규방정식과 $\hat\beta=(X^TX)^{-1}X^Ty$를 유도할 수 있다`,
      R`$X^TX$가 가역일 조건과, 해가 최솟값인 이유(헤시안 $2X^TX\succeq0$)를 설명할 수 있다`,
      R`경사하강법 갱신식 $\beta_l\leftarrow\beta_l-\alpha\,\partial f/\partial\beta_l$을 성분으로 쓰고 단점을 말할 수 있다`,
    ],
    secTitles: { '1.1': '모델과 최소제곱', '1.2': '벡터 미분 공식', '1.3': '정규방정식', '1.4': 'SSE 관점', '1.5': '경사하강법' },
    sections: [
      { k: '1.1', src: 'W1 수 · 슬라이드 3–5', title: '선형회귀 모델과 제곱오차합', body: R`
자료가 $n$개, 설명변수가 $k$개 있다고 합시다. $i$번째 자료는 $(x_{i1},\dots,x_{ik},\,y_i)$이고 보통 $n>k$입니다. 선형회귀 모델은
$$y_i=\beta_0+\sum_{j=1}^{k}x_{ij}\beta_j+\varepsilon_i,\qquad i=1,\dots,n$$
입니다. $\varepsilon_i$는 모델이 설명하지 못하는 오차입니다.

행렬로 모으면 $y=X\beta+\varepsilon$ 입니다.
$$y=\begin{pmatrix}y_1\\\vdots\\y_n\end{pmatrix},\quad X=\begin{pmatrix}1&x_{11}&\cdots&x_{1k}\\\vdots&\vdots&&\vdots\\1&x_{n1}&\cdots&x_{nk}\end{pmatrix},\quad \beta=\begin{pmatrix}\beta_0\\\vdots\\\beta_k\end{pmatrix}$$
$X$는 $n\times(k+1)$ 행렬이고, **첫 열이 모두 1**인 것은 절편 $\beta_0$를 곱하기 위해서입니다.

:::def 최소제곱 목적함수
오차의 제곱합을 $\beta$의 함수로 봅니다.
$$f(\beta):=\sum_{i=1}^n\varepsilon_i^2=\sum_{i=1}^n\Big(y_i-\beta_0-\sum_{j=1}^kx_{ij}\beta_j\Big)^2=\lVert y-X\beta\rVert^2=(y-X\beta)^T(y-X\beta)$$
$f$를 최소로 하는 $\hat\beta$를 **최소제곱추정량**(LSE)이라 합니다.
:::

:::tip 크기부터 확인하기
유도 문제에서는 각 항의 크기를 먼저 적어 두면 전치를 어디에 붙일지 헷갈리지 않습니다. $y:n\times1$, $X:n\times(k+1)$, $\beta:(k+1)\times1$이므로 $X^Ty$와 $X^TX\beta$는 $(k+1)\times1$, $X^TX$는 $(k+1)\times(k+1)$입니다.
:::
` },
      { k: '1.2', src: 'W1 수 · 슬라이드 6 필기', title: '벡터 미분의 두 공식', body: R`
스칼라 함수 $g(\beta)$의 기울기 $\nabla_\beta g$는 편도함수를 세로로 쌓은 벡터 $\big(\partial g/\partial\beta_1,\dots,\partial g/\partial\beta_p\big)^T$입니다[[@em:ch08:9.7|기울기는 편도함수를 모은 벡터이고, 함수가 가장 빠르게 증가하는 방향을 가리킵니다.]]. 정규방정식 유도에는 다음 두 공식만 있으면 됩니다.

:::key 행렬 미분 공식
$$\nabla_\beta\big(\beta^Tm\big)=\nabla_\beta\big(m^T\beta\big)=m,\qquad \nabla_\beta\big(\beta^TA\beta\big)=(A+A^T)\beta$$
$A$가 대칭이면 $\nabla_\beta(\beta^TA\beta)=2A\beta$.
:::

:::hand 수업 필기 — 성분으로 보이기
(a) $\beta^Tm=\beta_1m_1+\beta_2m_2+\beta_3m_3$ 이므로 $\partial/\partial\beta_l$ 하면 $m_l$만 남습니다. 모으면 $\nabla_\beta(\beta^Tm)=m$.

(b) $\beta^TA\beta=\sum_{i,j}\beta_iA_{ij}\beta_j$를 $\beta_k$로 미분하면 $\beta_k$가 들어 있는 항은 두 종류입니다.
- (i) $i=k$인 항: $\sum_jA_{kj}\beta_j=(A\beta)_k$
- (ii) $j=k$인 항: $\sum_i\beta_iA_{ik}=(A^T\beta)_k$

$i=j=k$인 항 $A_{kk}\beta_k^2$은 두 곳에 한 번씩 들어가고, 그 미분 $2A_{kk}\beta_k$도 두 합에 반씩 나뉘어 정확히 맞습니다. 따라서 $\dfrac{\partial}{\partial\beta_k}\beta^TA\beta=(A\beta)_k+(A^T\beta)_k$, 즉 $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$.
:::

:::warn 비대칭 행렬에 2Aβ를 쓰지 마세요
$A=\begin{pmatrix}0&1\\0&0\end{pmatrix}$이면 $\beta^TA\beta=\beta_1\beta_2$이고 기울기는 $(\beta_2,\beta_1)^T=(A+A^T)\beta$입니다. $2A\beta=(2\beta_2,0)^T$는 틀립니다. 다만 $\beta^TA\beta=\beta^T\tfrac{A+A^T}{2}\beta$이므로 항상 대칭 부분만 남긴다고 생각해도 됩니다.
:::
` },
      { k: '1.3', src: 'W1 수 · 슬라이드 6 필기', title: '정규방정식과 최소제곱해', body: R`
$f(\beta)=(y-X\beta)^T(y-X\beta)$를 전개합니다. $y^TX\beta$는 $1\times1$ 스칼라이므로 전치해도 같아 $y^TX\beta=\beta^TX^Ty$입니다.
$$f(\beta)=y^Ty-\beta^TX^Ty-y^TX\beta+\beta^TX^TX\beta=y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta$$
1.2절의 두 공식에서 $m=X^Ty$, $A=X^TX$(대칭)로 두면
$$\nabla_\beta f=-2X^Ty+2X^TX\beta.$$

:::key 정규방정식
$$\nabla_\beta f(\beta)=-2X^T(y-X\beta)=0\iff X^TX\beta=X^Ty$$
$X^TX$가 가역이면 $\hat\beta=(X^TX)^{-1}X^Ty$.
:::

**언제 가역인가.** $X^TX$가 가역 $\iff$ $X$의 열들이 일차독립($\operatorname{rank}X=k+1$)입니다. $X^TXv=0$이면 $v^TX^TXv=\lVert Xv\rVert^2=0$에서 $Xv=0$이기 때문입니다[[@em:ch06:7.4|계수와 일차독립. 열이 일차독립이면 $Xv=0$의 해는 $v=0$뿐입니다.]]. 자료 수가 변수 수보다 적으면($n<k+1$) 이 조건이 깨집니다.

**왜 최솟값인가.** 헤시안이 $\nabla^2f=2X^TX$이고, 모든 $v$에 대해 $v^T(2X^TX)v=2\lVert Xv\rVert^2\ge0$이므로 $f$는 볼록합니다. 볼록함수에서 기울기가 0인 점은 전역 최솟점입니다. 열이 일차독립이면 $2X^TX\succ0$이라 최솟점이 하나뿐입니다.

**기하학적 의미.** 정규방정식은 $X^T(y-X\hat\beta)=0$, 즉 잔차 $y-\hat y$가 $X$의 모든 열과 직교한다는 뜻입니다. $\hat y=X\hat\beta=X(X^TX)^{-1}X^Ty$는 $y$를 $X$의 열공간에 **정사영**한 것이고, $H=X(X^TX)^{-1}X^T$를 모자 행렬이라 부릅니다($H^T=H$, $H^2=H$).

:::ex 예제 1 — 네 점에 직선 맞추기
$(x,y)=(0,1),(1,2),(2,2),(3,4)$에 $y=\beta_0+\beta_1x$를 맞추세요.
---
$X^TX=\begin{pmatrix}n&\sum x\\\sum x&\sum x^2\end{pmatrix}=\begin{pmatrix}4&6\\6&14\end{pmatrix}$, $X^Ty=\begin{pmatrix}\sum y\\\sum xy\end{pmatrix}=\begin{pmatrix}9\\18\end{pmatrix}$.
$\det=56-36=20$ 이므로
$$\hat\beta=\frac1{20}\begin{pmatrix}14&-6\\-6&4\end{pmatrix}\begin{pmatrix}9\\18\end{pmatrix}=\frac1{20}\begin{pmatrix}18\\18\end{pmatrix}=\begin{pmatrix}0.9\\0.9\end{pmatrix}.$$
잔차는 $0.1,\,0.2,\,-0.7,\,0.4$이고 합이 0, $x$와의 곱의 합도 $0+0.2-1.4+1.2=0$이라 정규방정식을 만족합니다. 최소 제곱오차합은 $0.70$.
:::

:::warn 역행렬 공식을 외우기 전에
시험에서 “유도하라”는 문제는 $\hat\beta=(X^TX)^{-1}X^Ty$만 쓰면 점수가 거의 없습니다. 전개 → 스칼라 전치로 두 항 합치기 → 두 미분 공식 → 0으로 두기 → 가역 조건, 순서대로 쓰세요.
:::
` },
      { k: '1.4', src: 'W1 수 · 슬라이드 7–10', title: '머신러닝 관점: 가장 좋은 직선', body: R`
머신러닝에서는 “자료를 가장 잘 설명하는 직선”을 목적함수의 최소화로 정의합니다. 슬라이드의 예시는 다음과 같습니다.

- 모든 $x$에서 평균값을 내는 **수평선**(기준선)의 제곱오차합은 $24.62$
- 이 직선을 조금 **회전**하면 제곱오차합이 $16.5$로 줄어듦
- 회전 각도에 따라 제곱오차합을 그리면 **처음에는 줄다가 다시 늘어나는** 모양 → 그 최저점이 최적의 직선

즉 목적함수는 제곱오차합(SSE)이고, 1.3절의 정규방정식은 이 최저점을 한 번에 계산하는 방법, 1.5절의 경사하강법은 최저점을 향해 조금씩 내려가는 방법입니다. SSE가 “한 번 줄었다가 늘어나는” 그릇 모양인 것은 $f$가 볼록이기 때문입니다.
` },
      { k: '1.5', src: 'W1 수 · 슬라이드 11–12', title: '경사하강법으로 풀기', body: R`
역행렬을 구하지 않고도 $f$의 최솟점에 다가갈 수 있습니다. 현재 위치에서 기울기의 반대 방향으로 조금씩 움직입니다[[ch13:13.1|왜 기울기의 반대 방향이 가장 빨리 내려가는 방향인지는 13단원에서 테일러 전개로 보입니다.]].

$x_{i0}=1$로 두면 편도함수는
$$\frac{\partial f}{\partial\beta_l}=-2\sum_{i=1}^n\Big(y_i-\big(\beta_0+\sum_{j=1}^k\beta_jx_{ij}\big)\Big)x_{il},\qquad 0\le l\le k.$$

:::key 경사하강법 갱신식 (선형회귀)
$$\beta_l\leftarrow\beta_l-\alpha\frac{\partial f}{\partial\beta_l}=\beta_l+2\alpha\sum_{i=1}^n\big(y_i-\hat y_i\big)x_{il}\qquad(0\le l\le k)$$
슬라이드에서는 상수 2를 학습률 $\alpha$에 흡수해 $\beta_l\leftarrow\beta_l+\alpha\sum_i(y_i-\hat y_i)x_{il}$로 씁니다. 모든 $l$을 **동시에** 갱신하고 수렴할 때까지 반복합니다.
:::

- **장점**: 가장 가파르게 감소하는 방향으로 움직이는 자연스러운 방법입니다.
- **단점**: 한 걸음을 떼기 전에 **훈련 자료 전체**를 훑어 합 $\sum_{i=1}^n$을 계산해야 합니다. 자료가 많으면 느립니다 → 10단원의 확률적(미니배치) 경사하강법[[ch10:10.1|전체 배치 대신 일부 자료로 기울기를 추정합니다.]].

:::ex 예제 2 — 한 걸음 계산
예제 1의 자료에서 $\beta=(0,0)$, $\alpha=0.01$로 슬라이드 규칙 $\beta_l\leftarrow\beta_l+\alpha\sum_i(y_i-\hat y_i)x_{il}$을 한 번 적용하세요.
---
$\hat y_i=0$이므로 $\beta_0\leftarrow0.01\sum y_i=0.09$, $\beta_1\leftarrow0.01\sum x_iy_i=0.18$. 두 성분을 **이전 값으로** 동시에 계산해야 합니다.
:::

:::tip 동시 갱신
$\beta_0$을 먼저 바꾼 뒤 그 값으로 $\beta_1$의 잔차를 계산하면 경사하강법이 아닙니다(좌표 하강에 가까워집니다). 코드로는 기울기 벡터를 먼저 다 계산하고 한 번에 빼세요.
:::
` },
    ],
    problems: [
      { sec: '1.1', type: 'mc', lv: 1, q: R`자료 $n=50$개, 설명변수 $k=3$개인 선형회귀에서 설계행렬 $X$의 크기는?`,
        choices: [R`$50\times3$`, R`$50\times4$`, R`$3\times50$`, R`$4\times4$`], ans: 1,
        sol: R`절편 $\beta_0$를 위한 1의 열이 추가되므로 $n\times(k+1)=50\times4$. $X^TX$가 $4\times4$입니다.` },
      { sec: '1.2', type: 'mc', lv: 1, q: R`$A=\begin{pmatrix}1&2\\0&3\end{pmatrix}$일 때 $\nabla_\beta(\beta^TA\beta)$는?`,
        choices: [R`$2A\beta$`, R`$\begin{pmatrix}2&2\\2&6\end{pmatrix}\beta$`, R`$\begin{pmatrix}1&2\\0&3\end{pmatrix}\beta$`, R`$\begin{pmatrix}2&4\\0&6\end{pmatrix}\beta$`], ans: 1,
        sol: R`$(A+A^T)\beta=\begin{pmatrix}2&2\\2&6\end{pmatrix}\beta$. 직접 확인: $\beta^TA\beta=\beta_1^2+2\beta_1\beta_2+3\beta_2^2$, 기울기 $(2\beta_1+2\beta_2,\ 2\beta_1+6\beta_2)$. $A$가 대칭이 아니므로 $2A\beta$는 틀립니다.` },
      { sec: '1.2', type: 'num', lv: 1, q: R`$g(\beta)=\beta^Tm$, $m=(3,-1,2)^T$일 때 $\partial g/\partial\beta_3$은?`, ans: '2', ansTex: R`2`,
        sol: R`$\nabla_\beta(\beta^Tm)=m$이므로 셋째 성분 $m_3=2$.` },
      { sec: '1.2', type: 'num', lv: 2, q: R`$A=\begin{pmatrix}2&1\\3&4\end{pmatrix}$, $\beta=(1,2)^T$일 때 $\nabla_\beta(\beta^TA\beta)$의 둘째 성분은?`, ans: '20', ansTex: R`20`,
        sol: R`$A+A^T=\begin{pmatrix}4&4\\4&8\end{pmatrix}$, $(A+A^T)\beta=(4+8,\ 4+16)^T=(12,20)^T$. 둘째 성분 20.` },
      { sec: '1.3', type: 'num', lv: 2, q: R`자료 $(x,y)=(0,1),(1,2),(2,2),(3,4)$에 $y=\beta_0+\beta_1x$를 최소제곱으로 맞출 때 $\hat\beta_1$은?`, ans: '0.9', ansTex: R`0.9`,
        sol: R`$X^TX=\begin{pmatrix}4&6\\6&14\end{pmatrix}$, $X^Ty=(9,18)^T$, $\hat\beta=\tfrac1{20}(14\cdot9-6\cdot18,\ -6\cdot9+4\cdot18)=(0.9,0.9)$.` },
      { sec: '1.3', type: 'num', lv: 2, q: R`위 문제의 최소제곱해에서 제곱오차합 $f(\hat\beta)$는?`, ans: '0.7', ansTex: R`0.70`,
        sol: R`예측값 $0.9,1.8,2.7,3.6$, 잔차 $0.1,0.2,-0.7,0.4$. 제곱합 $0.01+0.04+0.49+0.16=0.70$.` },
      { sec: '1.3', type: 'num', lv: 2, q: R`$x=(1,2,3)$, $y=(2,4,5)$에 원점을 지나는 직선 $y=\beta x$(절편 없음)를 최소제곱으로 맞출 때 $\hat\beta$는?`, ans: '25/14', ansTex: R`\tfrac{25}{14}\approx1.786`,
        sol: R`$X$는 열 하나 $(1,2,3)^T$. $\hat\beta=\dfrac{X^Ty}{X^TX}=\dfrac{2+8+15}{1+4+9}=\dfrac{25}{14}$.` },
      { sec: '1.3', type: 'mc', lv: 2, q: R`$X^TX$가 가역이 **아닌** 경우는?`,
        choices: [R`자료 수가 설명변수 수보다 훨씬 많을 때`, R`어떤 설명변수가 다른 두 설명변수의 합과 항상 같을 때`, R`$y$에 잡음이 클 때`, R`모든 설명변수의 평균이 0일 때`], ans: 1,
        sol: R`$x_3=x_1+x_2$이면 $X$의 열이 일차종속이라 $Xv=0$인 $v\ne0$($v=(0,1,1,-1)^T$ 꼴)이 있고 $X^TXv=0$. $y$의 잡음이나 평균은 가역성과 무관합니다.` },
      { sec: '1.3', type: 'mc', lv: 2, q: R`최소제곱해 $\hat\beta$에서 잔차 $r=y-X\hat\beta$에 대해 항상 성립하는 것은?`,
        choices: [R`$r=0$`, R`$X^Tr=0$`, R`$Xr=0$`, R`$r^Ty=0$`], ans: 1,
        sol: R`정규방정식 $X^T(y-X\hat\beta)=0$ 그 자체입니다. 절편이 있으면 $X$의 첫 열이 1이므로 특히 잔차의 합이 0입니다.` },
      { sec: '1.3', type: 'num', lv: 2, q: R`$f(\beta)=\lVert y-X\beta\rVert^2$의 헤시안 $\nabla^2f$에서, 자료 $x=(0,1,2,3)$(절편 포함 단순회귀)일 때 $(1,2)$ 성분은?`, ans: '12', ansTex: R`12`,
        sol: R`$\nabla^2f=2X^TX=2\begin{pmatrix}4&6\\6&14\end{pmatrix}$. $(1,2)$ 성분은 $2\sum x_i=12$.` },
      { sec: '1.5', type: 'num', lv: 1, q: R`예제 1의 자료에서 $\beta=(0,0)$, $\alpha=0.01$로 슬라이드 규칙 $\beta_l\leftarrow\beta_l+\alpha\sum_i(y_i-\hat y_i)x_{il}$을 한 번 적용한 뒤의 $\beta_1$은?`, ans: '0.18', ansTex: R`0.18`,
        sol: R`$\hat y_i=0$이므로 $\beta_1=0.01\sum x_iy_i=0.01\times18=0.18$.` },
      { sec: '1.5', type: 'mc', lv: 1, q: R`슬라이드에서 지적한 (전체 배치) 경사하강법의 단점은?`,
        choices: [R`기울기의 반대 방향으로 움직이지 않는다`, R`한 걸음마다 훈련 자료 전체를 훑어야 한다`, R`볼록함수에서도 발산한다`, R`학습률이 필요 없다`], ans: 1,
        sol: R`갱신식에 $\sum_{i=1}^n$이 있어 한 번 움직이려면 $n$개 자료 전부로 합을 계산해야 합니다. 이 문제를 줄이려고 확률적·미니배치 경사하강법을 씁니다.` },
      { sec: '1.2', type: 'open', lv: 2, proof: true, q: R`임의의 정사각행렬 $A$에 대해 $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$임을 성분 계산으로 증명하세요.`,
        sol: R`
$\beta^TA\beta=\sum_i\sum_j\beta_iA_{ij}\beta_j$. 이를 $\beta_k$로 편미분합니다. 곱의 미분법에서 $\partial\beta_i/\partial\beta_k=\delta_{ik}$이므로
$$\frac{\partial}{\partial\beta_k}\sum_{i,j}\beta_iA_{ij}\beta_j=\sum_{i,j}\big(\delta_{ik}A_{ij}\beta_j+\beta_iA_{ij}\delta_{jk}\big)=\sum_jA_{kj}\beta_j+\sum_iA_{ik}\beta_i.$$
첫 합은 $(A\beta)_k$, 둘째 합은 $(A^T\beta)_k$입니다. 모든 $k$에 대해 성립하므로 $\nabla_\beta(\beta^TA\beta)=A\beta+A^T\beta=(A+A^T)\beta$. $A$가 대칭이면 $2A\beta$.` },
      { sec: '1.3', type: 'open', lv: 2, proof: true, q: R`$f(\beta)=(y-X\beta)^T(y-X\beta)$를 최소로 하는 $\beta$가 정규방정식 $X^TX\beta=X^Ty$를 만족함을 유도하고, $X$의 열이 일차독립일 때 해가 유일한 최솟점임을 보이세요.`,
        sol: R`
**전개.** $f=y^Ty-\beta^TX^Ty-y^TX\beta+\beta^TX^TX\beta$. $y^TX\beta$는 스칼라라 $y^TX\beta=(y^TX\beta)^T=\beta^TX^Ty$이므로 $f=y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta$.

**미분.** $\nabla(\beta^Tm)=m$ ($m=X^Ty$), $\nabla(\beta^TA\beta)=(A+A^T)\beta=2X^TX\beta$ ($A=X^TX$ 대칭). 따라서 $\nabla f=-2X^Ty+2X^TX\beta$. 0으로 두면 $X^TX\beta=X^Ty$.

**최솟점.** $\nabla^2f=2X^TX$이고 $v^T(2X^TX)v=2\lVert Xv\rVert^2\ge0$이므로 $f$는 볼록, 정류점은 전역 최솟점입니다. 열이 일차독립이면 $v\ne0\Rightarrow Xv\ne0$이라 $2X^TX\succ0$(양의 정부호)이고 가역이므로 $\hat\beta=(X^TX)^{-1}X^Ty$가 유일한 최솟점입니다.`,
        rubric: R`
- 전개와 스칼라 전치로 교차항 합치기 — 3점
- 두 벡터 미분 공식 적용, 기울기 식 — 3점
- 정규방정식 — 1점
- 헤시안의 양의 (준)정부호로 최솟점·유일성 — 3점` },
      { sec: '1.3', type: 'open', lv: 3, proof: true, q: R`$X$의 열이 일차독립일 때 $H=X(X^TX)^{-1}X^T$가 대칭이고 멱등($H^2=H$)임을 보이고, 잔차 $y-Hy$가 $X$의 열공간과 직교함을 보이세요.`,
        sol: R`
**대칭.** $(X^TX)^{-1}$은 대칭행렬의 역행렬이라 대칭입니다. $H^T=\big(X^T\big)^T\big((X^TX)^{-1}\big)^TX^T=X(X^TX)^{-1}X^T=H$.

**멱등.** $H^2=X(X^TX)^{-1}\underbrace{X^TX(X^TX)^{-1}}_{I}X^T=H$.

**직교.** $X^T(y-Hy)=X^Ty-X^TX(X^TX)^{-1}X^Ty=0$. 열공간의 임의의 벡터 $Xv$와의 내적은 $v^TX^T(y-Hy)=0$입니다. 따라서 $Hy=X\hat\beta$는 $y$의 열공간 위로의 정사영입니다.` },
    ],
  });
})();
