/* 05 로지스틱 회귀 — 3주차 월요일 s.3–13 (필기) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 5, part: 'B', title: '로지스틱 회귀', en: 'Logistic Regression', ref: 'W3 월 · s.3–13', plot: 'sigmoid',
    fig: R`기울기가 다른 시그모이드 σ(kx)들. 굵은 선이 k = 1`,
    tagline: R`로그 오즈를 선형으로 두면 $p=\sigma(w^Tx)$. 손실의 헤시안이 $X^TSX\succeq0$이라 국소 최소가 곧 전역 최소입니다.`,
    summary: R`확률 $p$를 오즈 $p/(1-p)$, 로짓 $\log\frac p{1-p}$로 바꾸면 값의 범위가 실수 전체가 되어 선형식 $w^Tx$로 모델링할 수 있습니다. 그 역함수가 시그모이드이고, 로지스틱 회귀는 $P(y=1\mid x)=\sigma(w^Tx)$입니다. 베르누이 가능도의 음의 로그를 필기로 $\sum\log(1+e^{-w^Tx_i})+\sum(1-y_i)w^Tx_i$까지 정리하고, 기울기 $\sum(\sigma(w^Tx_i)-y_i)x_i$와 헤시안 $X^TSX$를 구해 손실이 볼록함을 증명했습니다.`,
    goals: [
      R`오즈·로짓·시그모이드의 관계를 쓰고 $\sigma'=\sigma(1-\sigma)$를 증명할 수 있다`,
      R`$w^Tx=0$이 결정 경계인 이유와 확률 등고선이 초평면임을 설명할 수 있다`,
      R`베르누이 가능도에서 교차 엔트로피 손실을 유도하고 필기처럼 간단히 정리할 수 있다`,
      R`손실의 기울기 $\sum_i(\sigma(w^Tx_i)-y_i)x_i$를 유도할 수 있다`,
      R`헤시안 $X^TSX$가 양의 준정부호임을 보이고 볼록성의 의미를 말할 수 있다`,
    ],
    secTitles: { '5.1': '오즈·로짓·시그모이드', '5.2': '모델과 결정 경계', '5.3': '가능도와 손실', '5.4': '기울기', '5.5': '볼록성' },
    sections: [
      { k: '5.1', src: 'W3 월 · 슬라이드 3–4', title: '오즈, 로짓, 시그모이드', body: R`
$N$번 시행 중 사건이 $n$번 일어나면 확률은 $p=n/N$, **오즈**는 $o=\dfrac{n}{N-n}$입니다. 두 양은 서로 바꿀 수 있습니다.
$$o=\frac p{1-p},\qquad p=\frac o{1+o}$$
확률은 $[0,1]$, 오즈는 $[0,\infty)$에 있으므로 로그를 한 번 더 씌우면 실수 전체가 됩니다.

:::def 로짓과 로지스틱(시그모이드) 함수
$$\operatorname{logit}(p)=\log\frac p{1-p}:\ (0,1)\to(-\infty,\infty),\qquad \sigma(z)=\frac1{1+e^{-z}}:\ (-\infty,\infty)\to(0,1)$$
둘은 서로의 역함수입니다.
:::

:::key 시그모이드의 성질
$$\sigma(z)=\frac{e^z}{1+e^z},\qquad \sigma(-z)=1-\sigma(z),\qquad \sigma'(z)=\sigma(z)\big(1-\sigma(z)\big)$$
:::

$z=\operatorname{logit}(p)$를 $p$에 대해 풀면 $e^z=\frac p{1-p}$, $p=\frac{e^z}{1+e^z}=\frac1{1+e^{-z}}=\sigma(z)$. 도함수는 $\sigma'(z)=\frac{e^{-z}}{(1+e^{-z})^2}=\frac1{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}}=\sigma(z)(1-\sigma(z))$이고 최댓값은 $z=0$에서 $\tfrac14$입니다. 이 사실은 역전파(9단원)와 활성화 함수의 포화(10단원)에서 다시 씁니다.
` },
      { k: '5.2', src: 'W3 월 · 슬라이드 5–8, 13', title: '모델: 로그 오즈를 선형으로', body: R`
로지스틱 회귀는 이진 종속변수를 모델링합니다. 레이블 1의 **로그 오즈를 선형식**으로 둡니다(필기: “$P(y=1\mid x)$를 로그 오즈에서 선형화”).
$$\log\frac{p}{1-p}=w^Tx,\qquad x=(1,x_1,\dots,x_n),\ w=(w_0,w_1,\dots,w_n)$$
$$\Longrightarrow\ p=P(y=1\mid x,w)=\frac1{1+e^{-w^Tx}}=\sigma(w^Tx)$$

**결정 경계.** 초평면 $w^Tx=w_0+\sum_iw_ix_i=0$이 두 레이블을 나눕니다. $w^Tx_i>0$이면 $p>\tfrac12$이라 $y_i=1$, $w^Tx_i<0$이면 $y_i=0$으로 분류합니다.

**확률 등고선.** $\sigma$는 순증가이므로 $\{x:\sigma(w^Tx)=c\}=\{x:w^Tx=\operatorname{logit}(c)\}$, 즉 확률이 같은 점들은 결정 경계와 **평행한 초평면** 위에 있습니다. 슬라이드의 2차원 그림에서 등고선 $0.334,\ 0.5,\ 0.666$이 모두 평행한 직선인 이유입니다. 파란 등고선 아래의 점은 확률이 $0.666$보다 커서 1로 분류됩니다.

:::tip 시그모이드의 쓸모
로지스틱 함수는 매끄럽고 비감소이며 값이 $(0,1)$이라 **확률을 부여**하는 데 알맞습니다. 모수는 최대가능도로 학습합니다.
:::
` },
      { k: '5.3', src: 'W3 월 · 슬라이드 9–11 필기', title: '가능도와 교차 엔트로피 손실', body: R`
자료 $D=\{(x_i,y_i)\}_{i=1}^N$, $y_i\in\{0,1\}$. 각 레이블은 베르누이 분포를 따르므로
$$p(y_i\mid x_i,w)=P(y_i=1\mid x_i,w)^{y_i}\big(1-P(y_i=1\mid x_i,w)\big)^{1-y_i},\qquad L(w)=\prod_{i=1}^Np(y_i\mid x_i,w).$$
$p_i=\sigma(w^Tx_i)$로 쓰면(필기)
$$w^*=\argmax_w\log L=\argmin_w\Big\{-\sum_{i=1}^N\big[y_i\log p_i+(1-y_i)\log(1-p_i)\big]\Big\}.$$
중괄호 안이 **이진 교차 엔트로피** 손실입니다[[ch03:3.5|레이블 분포 $(y_i,1-y_i)$와 예측 분포 $(p_i,1-p_i)$의 교차 엔트로피.]].

:::key 로지스틱 회귀의 음의 로그가능도
$$-\log L(w)=\sum_{i=1}^N\log\big(1+e^{-w^Tx_i}\big)+\sum_{i=1}^N(1-y_i)\,w^Tx_i$$
:::

:::hand 수업 필기 — 정리 과정
$P(y_i=1)=\dfrac1{1+e^{-w^Tx_i}}$, $P(y_i=0)=\dfrac{e^{-w^Tx_i}}{1+e^{-w^Tx_i}}$이므로
$$-\log P(y_i=1)=\log(1+e^{-w^Tx_i}),\qquad -\log P(y_i=0)=w^Tx_i+\log(1+e^{-w^Tx_i}).$$
$$-\log L=\sum_iy_i\log(1+e^{-w^Tx_i})+\sum_i(1-y_i)w^Tx_i+\sum_i(1-y_i)\log(1+e^{-w^Tx_i})$$
첫 합과 셋째 합을 합치면 $y_i+(1-y_i)=1$이라 위의 결과가 됩니다.
:::
` },
      { k: '5.4', src: 'W3 월 · 슬라이드 12, 필기', title: '기울기와 경사하강법', body: R`
:::key 로지스틱 손실의 기울기
$$\nabla_w\big(-\log L\big)=-\sum_{i=1}^N\frac{e^{-w^Tx_i}}{1+e^{-w^Tx_i}}x_i+\sum_{i=1}^N(1-y_i)x_i=\sum_{i=1}^N\big(\sigma(w^Tx_i)-y_i\big)x_i$$
경사하강법: $w\leftarrow w-\alpha\sum_i\big(\sigma(w^Tx_i)-y_i\big)x_i$.
:::

첫 등호는 $\nabla_w\log(1+e^{-w^Tx})=\dfrac{-e^{-w^Tx}}{1+e^{-w^Tx}}x$에서 옵니다. 둘째 등호는 $1-\dfrac{e^{-z}}{1+e^{-z}}=\dfrac1{1+e^{-z}}=\sigma(z)$이므로 $-(1-\sigma(z_i))+(1-y_i)=\sigma(z_i)-y_i$.

필기에서는 표본 하나의 손실 $l_i(w)=-[y_i\log p_i+(1-y_i)\log(1-p_i)]$를 연쇄법칙으로 미분해 같은 결과 $\nabla_wl_i=(\sigma(z_i)-y_i)x_i$를 얻었습니다($z_i=w^Tx_i$). **(예측 − 정답) × 입력**이라는 모양은 선형회귀의 기울기 $-(y_i-\hat y_i)x_i$와 똑같고, 소프트맥스 회귀에서도 반복됩니다.

:::warn 닫힌 해가 없습니다
선형회귀와 달리 $\sum(\sigma(w^Tx_i)-y_i)x_i=0$은 $w$에 대한 비선형 방정식이라 정규방정식 같은 공식이 없습니다. 경사하강법(또는 뉴턴법)으로 풉니다.
:::
` },
      { k: '5.5', src: 'W3 월 필기', title: '볼록성: 헤시안이 양의 준정부호', body: R`
:::key 로지스틱 손실의 헤시안
$$J(w)=-\sum_i\big[y_i\log p_i+(1-y_i)\log(1-p_i)\big],\qquad \nabla^2J=\sum_{i=1}^N\sigma(z_i)\big(1-\sigma(z_i)\big)x_ix_i^T=X^TSX\succeq0$$
$X=\begin{pmatrix}x_1^T\\\vdots\\x_N^T\end{pmatrix}\in\mathbb R^{N\times d}$, $S=\diag\big(\sigma(z_1)(1-\sigma(z_1)),\dots,\sigma(z_N)(1-\sigma(z_N))\big)$.
:::

:::hand 수업 필기 — 볼록성 증명
$\nabla_wl_i=(\sigma(z_i)-y_i)x_i$를 한 번 더 미분합니다. $y_i,x_i$는 상수이고 $\nabla_w\sigma(z_i)=\sigma'(z_i)x_i$이므로
$$\nabla^2l_i=\nabla_w\big[(\sigma(z_i)-y_i)x_i\big]=\sigma'(z_i)\,x_ix_i^T\quad(d\times d),\qquad \sigma'=\sigma(1-\sigma).$$
합하면 $\nabla^2J=\sum_i\sigma(z_i)(1-\sigma(z_i))x_ix_i^T=X^TSX$. 임의의 $v\in\mathbb R^d$에 대해
$$v^T\nabla^2Jv=v^TX^TSXv=(Xv)^TS(Xv)=\sum_{i=1}^Ns_i(x_i^Tv)^2\ge0,\qquad s_i\in\big(0,\tfrac14\big].$$
헤시안이 양의 준정부호이므로 $J$는 볼록합니다(여러 개의 골짜기가 있는 W자가 아니라 하나의 그릇 U자).[[@base:ch04:4.3|헤시안과 볼록성, 극값 판정.]]
:::

**의미.** 볼록함수에서는 기울기가 0인 점이 전역 최소점이므로, 경사하강법이 국소 최소에 갇히지 않습니다[[@em:ch07:8.4|이차형식 $v^TAv\ge0$과 고윳값이 모두 $\ge0$인 것은 같은 조건입니다.]].

:::warn 선형 분리 가능한 자료
자료가 초평면으로 완벽히 나뉘면 그 방향으로 $\lVert w\rVert\to\infty$일 때 가능도가 1로 올라가므로 **유한한 최대가능도 해가 없습니다**(손실이 0에 다가가기만 함). 실제로는 규제 $\frac\lambda2\lVert w\rVert^2$을 더하거나 조기 종료로 막습니다. 규제를 더하면 헤시안이 $X^TSX+\lambda I\succ0$이 되어 해가 유일해집니다.
:::
` },
    ],
    problems: [
      { sec: '5.1', type: 'num', lv: 1, q: R`확률 $p=0.8$인 사건의 오즈는?`, ans: '4', ansTex: R`4`,
        sol: R`$o=p/(1-p)=0.8/0.2=4$. 거꾸로 $p=o/(1+o)=4/5$.` },
      { sec: '5.1', type: 'num', lv: 1, q: R`$\sigma(z)=0.75$가 되는 $z$는?`, ans: 'ln(3)', ansTex: R`\ln3\approx1.099`,
        sol: R`$z=\operatorname{logit}(0.75)=\ln\frac{0.75}{0.25}=\ln3$.` },
      { sec: '5.1', type: 'num', lv: 1, q: R`$\sigma'(0)$의 값은?`, ans: '1/4', ansTex: R`\tfrac14`,
        sol: R`$\sigma(0)=\tfrac12$이므로 $\sigma'(0)=\tfrac12\cdot\tfrac12=\tfrac14$. 이것이 $\sigma'$의 최댓값입니다.` },
      { sec: '5.1', type: 'mc', lv: 2, q: R`$\sigma(-z)$와 같은 것은?`,
        choices: [R`$-\sigma(z)$`, R`$1-\sigma(z)$`, R`$1/\sigma(z)$`, R`$\sigma(z)$`], ans: 1,
        sol: R`$\sigma(-z)=\frac1{1+e^z}=\frac{e^{-z}}{e^{-z}+1}=1-\frac1{1+e^{-z}}$.` },
      { sec: '5.2', type: 'mc', lv: 1, q: R`로지스틱 회귀에서 $P(y=1\mid x)=0.9$인 점들의 집합은?`,
        choices: [R`결정 경계 $w^Tx=0$`, R`결정 경계와 평행한 초평면 $w^Tx=\ln9$`, R`원`, R`$w$와 평행한 직선`], ans: 1,
        sol: R`$\sigma(w^Tx)=0.9\iff w^Tx=\operatorname{logit}(0.9)=\ln9$. 등고선은 모두 평행한 초평면입니다.` },
      { sec: '5.2', type: 'num', lv: 2, q: R`$w=(w_0,w_1,w_2)=(-1,2,1)$일 때 $x=(1,0.5,1)$ (첫 성분은 절편용 1)에서 $P(y=1\mid x)$는?`, ans: '1/(1+e^(-1))', ansTex: R`\sigma(1)\approx0.731`,
        sol: R`$w^Tx=-1+1+1=1$이므로 $\sigma(1)=1/(1+e^{-1})\approx0.731$.` },
      { sec: '5.3', type: 'num', lv: 2, q: R`$y_1=1$, $w^Tx_1=0$인 표본 하나의 교차 엔트로피 손실 $-[y\log p+(1-y)\log(1-p)]$은?`, ans: 'ln(2)', ansTex: R`\ln2`,
        sol: R`$p=\sigma(0)=\tfrac12$, 손실 $-\log\tfrac12=\ln2$. 필기 식으로도 $\log(1+e^0)+0=\ln2$.` },
      { sec: '5.3', type: 'num', lv: 2, q: R`$y=0$, $z=w^Tx=2$인 표본의 손실을 필기 식 $\log(1+e^{-z})+(1-y)z$로 계산하세요.`, ans: 'ln(1+e^(-2))+2', ansTex: R`2+\ln(1+e^{-2})\approx2.127`,
        sol: R`$\log(1+e^{-2})+2\approx0.127+2=2.127$. 직접 계산: $-\log(1-\sigma(2))=-\log\frac{e^{-2}}{1+e^{-2}}=2+\log(1+e^{-2})$. 틀리게 확신할수록 손실이 큽니다.` },
      { sec: '5.4', type: 'mc', lv: 2, q: R`표본 하나의 손실 기울기 $\nabla_wl_i$는?`,
        choices: [R`$(y_i-\sigma(w^Tx_i))x_i$`, R`$(\sigma(w^Tx_i)-y_i)x_i$`, R`$\sigma'(w^Tx_i)x_i$`, R`$(\sigma(w^Tx_i)-y_i)$`], ans: 1,
        sol: R`(예측 − 정답) × 입력. 경사하강법에서는 이것을 빼므로 $w\leftarrow w+\alpha(y_i-\sigma_i)x_i$.` },
      { sec: '5.4', type: 'num', lv: 2, q: R`$w=0$에서 자료 $(x_1,y_1)=((1,2),1)$, $(x_2,y_2)=((1,-1),0)$일 때 기울기 $\sum_i(\sigma(w^Tx_i)-y_i)x_i$의 둘째 성분은?`, ans: '-1.5', ansTex: R`-1.5`,
        sol: R`$w=0$이면 $\sigma=\tfrac12$. $(\tfrac12-1)(1,2)+(\tfrac12-0)(1,-1)=(-\tfrac12,-1)+(\tfrac12,-\tfrac12)=(0,-1.5)$.` },
      { sec: '5.4', type: 'num', lv: 2, q: R`위 문제에서 학습률 $\alpha=0.1$로 경사하강법 한 걸음 뒤의 $w_2$는?`, ans: '0.15', ansTex: R`0.15`,
        sol: R`$w\leftarrow0-0.1\cdot(0,-1.5)=(0,0.15)$.` },
      { sec: '5.5', type: 'mc', lv: 2, q: R`로지스틱 손실의 헤시안 $X^TSX$가 양의 준정부호인 핵심 이유는?`,
        choices: [R`$X$가 정사각행렬이라서`, R`$S$의 대각성분 $\sigma(z_i)(1-\sigma(z_i))$가 모두 음이 아니라서`, R`$y_i\in\{0,1\}$라서`, R`학습률이 작아서`], ans: 1,
        sol: R`$v^TX^TSXv=\sum_is_i(x_i^Tv)^2\ge0$. 레이블 $y_i$는 헤시안에 나타나지도 않습니다.` },
      { sec: '5.5', type: 'num', lv: 3, q: R`$w=0$, 입력 $x_1=(1,0)$, $x_2=(1,1)$일 때 헤시안 $X^TSX$의 $(1,1)$ 성분은?`, ans: '0.5', ansTex: R`\tfrac12`,
        sol: R`$w=0$이면 모든 $s_i=\tfrac14$. $X^TSX=\tfrac14X^TX=\tfrac14\begin{pmatrix}2&1\\1&1\end{pmatrix}$, $(1,1)$ 성분 $\tfrac12$.` },
      { sec: '5.5', type: 'mc', lv: 3, q: R`훈련 자료가 어떤 초평면으로 완벽히 분리될 때 규제 없는 로지스틱 회귀에 일어나는 일은?`,
        choices: [R`유일한 유한 해에 수렴한다`, R`손실이 0에 다가가지만 $\lVert w\rVert\to\infty$로 발산하고 유한한 최소점이 없다`, R`손실이 증가한다`, R`헤시안이 음의 정부호가 된다`], ans: 1,
        sol: R`분리하는 $w$를 $c$배 하면 모든 표본의 확률이 정답 쪽으로 1에 다가가 손실이 계속 줄어듭니다. 최솟값(0)이 달성되지 않습니다. $L_2$ 규제나 조기 종료로 해결합니다.` },
      { sec: '5.3', type: 'open', lv: 2, proof: true, q: R`$y_i\in\{0,1\}$, $P(y_i=1\mid x_i)=\sigma(w^Tx_i)$일 때 음의 로그가능도가 $\sum_i\log(1+e^{-w^Tx_i})+\sum_i(1-y_i)w^Tx_i$임을 보이고, 그 기울기가 $\sum_i(\sigma(w^Tx_i)-y_i)x_i$임을 유도하세요.`,
        sol: R`
$z_i=w^Tx_i$. $-\log\sigma(z)=\log(1+e^{-z})$, $-\log(1-\sigma(z))=-\log\frac{e^{-z}}{1+e^{-z}}=z+\log(1+e^{-z})$.
$$-\log L=\sum_i\big[y_i\log(1+e^{-z_i})+(1-y_i)\big(z_i+\log(1+e^{-z_i})\big)\big]=\sum_i\log(1+e^{-z_i})+\sum_i(1-y_i)z_i.$$
기울기: $\nabla_wz_i=x_i$, $\frac{d}{dz}\log(1+e^{-z})=\frac{-e^{-z}}{1+e^{-z}}=-(1-\sigma(z))$이므로
$$\nabla_w(-\log L)=\sum_i\big[-(1-\sigma(z_i))+(1-y_i)\big]x_i=\sum_i(\sigma(z_i)-y_i)x_i.$$`,
        rubric: R`
- 베르누이 가능도와 $-\log$ — 2점
- $-\log(1-\sigma)$ 변형과 합치기 — 4점
- 기울기 계산 — 4점` },
      { sec: '5.5', type: 'open', lv: 2, proof: true, q: R`로지스틱 회귀의 교차 엔트로피 손실 $J(w)$의 헤시안을 구하고, $J$가 볼록함을 증명하세요.`,
        sol: R`
$\nabla J=\sum_i(\sigma(z_i)-y_i)x_i$, $z_i=w^Tx_i$. 연쇄법칙으로 $\frac{\partial}{\partial w_k}\sigma(z_i)=\sigma'(z_i)x_{ik}$이므로
$$\frac{\partial^2J}{\partial w_k\partial w_l}=\sum_i\sigma'(z_i)x_{ik}x_{il},\qquad \nabla^2J=\sum_i\sigma(z_i)(1-\sigma(z_i))x_ix_i^T=X^TSX.$$
$s_i=\sigma(z_i)(1-\sigma(z_i))\in(0,\tfrac14]$. 임의의 $v$에 대해 $v^T\nabla^2Jv=\sum_is_i(x_i^Tv)^2\ge0$이므로 $\nabla^2J\succeq0$.
$C^2$ 함수의 헤시안이 모든 점에서 양의 준정부호이면 볼록입니다: 적분형 테일러 전개 $J(u)=J(w)+\nabla J(w)^T(u-w)+\int_0^1(1-t)(u-w)^T\nabla^2J(w+t(u-w))(u-w)\,dt\ge J(w)+\nabla J(w)^T(u-w)$ (1차 볼록 조건).`,
        rubric: R`
- 이계도함수 계산과 $X^TSX$ 꼴 — 4점
- $s_i\ge0$과 이차형식 $\ge0$ — 4점
- 헤시안 PSD ⇒ 볼록(근거 제시) — 2점` },
    ],
  });
})();
