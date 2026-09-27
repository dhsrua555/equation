/* 06 소프트맥스 회귀 — 3주차 월요일 s.14–17 (필기) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 6, part: 'B', title: '소프트맥스 회귀', en: 'Softmax (Multinomial Logistic) Regression', ref: 'W3 월 · s.14–17', plot: 'softmax',
    fig: R`세 클래스의 소프트맥스 확률을 한 직선을 따라 그린 곡선. 온도가 낮을수록 경계가 날카로워짐`,
    tagline: R`클래스마다 가중치 $w_k$를 두고 $e^{w_k^Tx}$를 정규화합니다. 기울기는 로지스틱과 같은 “(정답 − 예측) × 입력”.`,
    summary: R`클래스가 $C>2$개일 때 로지스틱 회귀를 일반화한 것이 소프트맥스 회귀입니다. $p_k=e^{w_k^Tx}/\sum_je^{w_j^Tx}$로 확률을 만들고, 원-핫 레이블로 가능도를 쓰면 손실은 교차 엔트로피 $-\sum_i\sum_ky_{ik}\log p_k$가 됩니다. 수업 필기의 붓꽃(iris) 예제로 확률을 계산했고, 슬라이드에서 소프트맥스의 편미분 $\partial p_k/\partial w_{mn}=(\delta_{mk}p_k-p_kp_m)x_n$과 손실 기울기 $-\sum_i(y_{im}-p_m)x_{in}$을 유도했습니다.`,
    goals: [
      R`소프트맥스 확률을 계산하고 $C=2$이면 로지스틱 회귀가 됨을 보일 수 있다`,
      R`원-핫 레이블로 가능도 $\prod_i\prod_kp_k^{y_{ik}}$를 쓰고 교차 엔트로피 손실을 유도할 수 있다`,
      R`소프트맥스의 야코비안 $\partial p_k/\partial z_m=p_k(\delta_{km}-p_m)$을 증명할 수 있다`,
      R`손실의 기울기 $\partial J/\partial w_{mn}=-\sum_i(y_{im}-p_m(x_i))x_{in}$을 유도할 수 있다`,
      R`수치 안정화(최댓값 빼기)와 모수의 비유일성을 설명할 수 있다`,
    ],
    secTitles: { '6.1': '모델', '6.2': '가능도·손실', '6.3': '기울기', '6.4': '성질·수치' },
    sections: [
      { k: '6.1', src: 'W3 월 · 슬라이드 14–15', title: '다중 클래스 모델', body: R`
클래스가 $C$개이면 클래스마다 가중치 벡터 $w_k$를 두고 $W=\begin{pmatrix}w_1^T\\\vdots\\w_C^T\end{pmatrix}\in\mathbb R^{C\times d}$로 모읍니다.

:::key 소프트맥스 함수
$$p_k=P(y=k\mid x,W)=\frac{e^{w_k^Tx}}{\sum_{j=1}^Ce^{w_j^Tx}},\qquad z_k=w_k^Tx,\quad \softmax(z)_k=\frac{e^{z_k}}{\sum_je^{z_j}}$$
모든 $p_k>0$, $\sum_kp_k=1$. 모든 $z_k$에 같은 상수를 더해도 결과가 같다.
:::

실수 벡터를 확률질량함수로 바꾸는 함수입니다. 슬라이드 예: $z=(-1,3)$이면 $e^z\approx(0.3679,\,20.0855)$, 정규화하면 $(0.01799,\,0.98201)$.

**$C=2$이면 로지스틱.** $p_1=\dfrac{e^{z_1}}{e^{z_1}+e^{z_2}}=\dfrac1{1+e^{-(z_1-z_2)}}=\sigma\big((w_1-w_2)^Tx\big)$. 두 가중치의 **차**만 의미가 있으므로 $w=w_1-w_2$ 하나로 줄어듭니다.
` },
      { k: '6.2', src: 'W3 월 · 슬라이드 15–16 필기', title: '가능도와 교차 엔트로피', body: R`
레이블을 **원-핫**으로 씁니다: $y_{ik}=1$ ($y_i=k$), 아니면 0. 그러면 한 표본의 확률은 $p(y_i\mid x_i,W)=\prod_{k=1}^Cp(y_i=k\mid x_i,W)^{y_{ik}}$ (정답 클래스의 확률 하나만 남음)이고

:::key 소프트맥스 교차 엔트로피 손실
$$L(W)=\prod_{i=1}^N\prod_{k=1}^Cp(y_i=k\mid x_i,W)^{y_{ik}},\qquad J(W)=-\log L=-\sum_{i=1}^N\sum_{k=1}^Cy_{ik}\log p(y_i=k\mid x_i,W)$$
:::

$J$는 표본마다 원-핫 분포와 예측 분포의 교차 엔트로피를 더한 것입니다[[ch03:3.5|원-핫 $p$이면 $H_p(q)=-\log q(\text{정답})$.]]. 이를 경사하강법으로 최소화합니다.

:::ex 예제 1 — 붓꽃 예제 (수업 필기)
$C=3$, $x=(5.1,3.5,1.4,0.2)\in\mathbb R^4$, $W\in\mathbb R^{3\times4}$의 행이 $w_1=(0.1,0.2,0.3,0.4)$, $w_2=(-0.3,0.1,0.5,0.2)$, $w_3=(0.2,-0.4,0.1,0.3)$이고 정답은 클래스 1, 즉 $y=(1,0,0)$. 각 클래스 확률과 이 표본의 손실을 구하세요.
---
$z_1=0.51+0.70+0.42+0.08=1.71$, $z_2=-1.53+0.35+0.70+0.04=-0.44$, $z_3=1.02-1.40+0.14+0.06=-0.18$.
$e^{z}\approx(5.529,\ 0.644,\ 0.835)$, 합 $\approx7.008$.
$$p\approx(0.789,\ 0.092,\ 0.119)$$
원-핫이므로 $\prod_kp_k^{y_k}=p_1\approx0.789$, 손실 $-\log p_1\approx0.237$.
:::
` },
      { k: '6.3', src: 'W3 월 · 슬라이드 17', title: '기울기', body: R`
$w_{mn}$은 클래스 $m$의 가중치 벡터의 $n$번째 성분입니다. $z_k=w_k^Tx$이므로 $\partial z_k/\partial w_{mn}=\delta_{km}x_n$.

:::key 소프트맥스 손실의 기울기
$$\frac{\partial p_k}{\partial z_m}=p_k(\delta_{km}-p_m),\qquad \frac{\partial p_k(x_i,W)}{\partial w_{mn}}=\big(\delta_{mk}p_k-p_kp_m\big)x_{in}$$
$$\frac{\partial J}{\partial w_{mn}}=-\sum_{i=1}^N\sum_{k=1}^Cy_{ik}\frac1{p_k}\frac{\partial p_k}{\partial w_{mn}}=-\sum_{i=1}^N\big(y_{im}-p_m(x_i,W)\big)x_{in}$$
행렬로: $\nabla_WJ=\sum_i(p(x_i)-y_i)\,x_i^T$ ($C\times d$).
:::

**유도.** 몫의 미분: $p_k=e^{z_k}/Z$, $Z=\sum_je^{z_j}$, $\partial Z/\partial z_m=e^{z_m}$.
$$\frac{\partial p_k}{\partial z_m}=\frac{\delta_{km}e^{z_k}Z-e^{z_k}e^{z_m}}{Z^2}=\delta_{km}p_k-p_kp_m.$$
연쇄법칙으로 $\partial p_k/\partial w_{mn}=\sum_l\frac{\partial p_k}{\partial z_l}\frac{\partial z_l}{\partial w_{mn}}=(\delta_{km}p_k-p_kp_m)x_n$. 손실에 넣으면
$$\frac{\partial J}{\partial w_{mn}}=-\sum_i\sum_ky_{ik}(\delta_{km}-p_m)x_{in}=-\sum_i\Big(y_{im}-p_m\sum_ky_{ik}\Big)x_{in}=-\sum_i(y_{im}-p_m)x_{in},$$
마지막 등호는 원-핫이라 $\sum_ky_{ik}=1$이기 때문입니다.

:::tip 한 문장으로
로지스틱·소프트맥스 모두 $\nabla=\sum_i(\text{예측 확률}-\text{원-핫 정답})\otimes\text{입력}$. 역전파에서 “소프트맥스 + 교차 엔트로피” 층의 상류 기울기가 $p-y$인 이유입니다.
:::
` },
      { k: '6.4', src: 'W3 월 · 슬라이드 14–17 보충', title: '성질과 수치 계산', body: R`
- **평행이동 불변.** $w_k\to w_k+c$ (모든 $k$에 같은 $c$)이면 $e^{w_k^Tx}$가 모두 $e^{c^Tx}$배가 되어 $p_k$가 그대로입니다. 따라서 규제가 없으면 최소점이 유일하지 않습니다(한 클래스의 가중치를 0으로 고정해도 됨).
- **수치 안정화.** $e^{z_k}$가 넘치지 않도록 $m=\max_jz_j$를 빼고 계산합니다: $\softmax(z)=\softmax(z-m\mathbf 1)$.
- **볼록성.** 한 표본 손실의 $z$에 대한 헤시안은 $\diag(p)-pp^T$이고, $v^T(\diag(p)-pp^T)v=\sum_kp_kv_k^2-\big(\sum_kp_kv_k\big)^2=\Var_p(v)\ge0$이라 양의 준정부호입니다. $z$가 $W$의 선형함수이므로 $J$는 $W$에 대해 볼록합니다.
- **온도.** $\softmax(z/T)$에서 $T\to0$이면 최댓값 클래스에 확률이 몰리고(argmax), $T\to\infty$이면 균등분포에 가까워집니다(표지 그림).
` },
    ],
    problems: [
      { sec: '6.1', type: 'num', lv: 1, q: R`$z=(-1,3)$의 소프트맥스에서 둘째 성분은? (소수 넷째 자리)`, ans: 'e^3/(e^(-1)+e^3)', ansTex: R`\approx0.9820`,
        sol: R`$\frac{e^3}{e^{-1}+e^3}=\frac1{1+e^{-4}}\approx0.98201$.` },
      { sec: '6.1', type: 'num', lv: 1, q: R`$z=(0,0,\ln2)$의 소프트맥스에서 셋째 성분은?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`$e^z=(1,1,2)$, 합 4. 셋째 성분 $2/4=\tfrac12$.` },
      { sec: '6.1', type: 'mc', lv: 2, q: R`$C=2$일 때 소프트맥스 회귀의 $p_1$은?`,
        choices: [R`$\sigma(w_1^Tx)$`, R`$\sigma((w_1-w_2)^Tx)$`, R`$\sigma(w_1^Tx)\sigma(w_2^Tx)$`, R`$\frac12(\sigma(w_1^Tx)+\sigma(w_2^Tx))$`], ans: 1,
        sol: R`분자·분모를 $e^{z_1}$로 나누면 $p_1=1/(1+e^{-(z_1-z_2)})$.` },
      { sec: '6.1', type: 'mc', lv: 2, q: R`모든 로짓 $z_k$에 5를 더하면 소프트맥스 출력은?`,
        choices: [R`모두 5배`, R`변하지 않는다`, R`균등분포가 된다`, R`최댓값만 커진다`], ans: 1,
        sol: R`분자와 분모 모두 $e^5$배가 되어 약분됩니다. 그래서 수치 계산 때 최댓값을 빼도 됩니다.` },
      { sec: '6.2', type: 'num', lv: 2, q: R`붓꽃 예제에서 $z=(1.71,-0.44,-0.18)$일 때 $p_3$은? (소수 셋째 자리)`, ans: 'e^(-0.18)/(e^(1.71)+e^(-0.44)+e^(-0.18))', ansTex: R`\approx0.119`,
        sol: R`$e^{-0.18}\approx0.835$, 합 $\approx5.529+0.644+0.835=7.008$, $p_3\approx0.119$.` },
      { sec: '6.2', type: 'num', lv: 2, q: R`붓꽃 예제에서 정답이 클래스 2였다면 이 표본의 손실 $-\log p_2$는? (소수 둘째 자리)`, ans: '-ln(e^(-0.44)/(e^(1.71)+e^(-0.44)+e^(-0.18)))', ansTex: R`\approx2.39`,
        sol: R`$p_2\approx0.644/7.008\approx0.0919$, $-\ln0.0919\approx2.39$. 확신을 가지고 틀리면 손실이 큽니다.` },
      { sec: '6.2', type: 'mc', lv: 1, q: R`원-핫 레이블 $y_i=(0,0,1,0)$일 때 $\prod_kp_k^{y_{ik}}$는?`,
        choices: [R`$p_1p_2p_3p_4$`, R`$p_3$`, R`$1-p_3$`, R`$\sum_kp_k$`], ans: 1,
        sol: R`$y_{ik}=0$인 인수는 $p_k^0=1$이라 정답 클래스의 확률만 남습니다.` },
      { sec: '6.3', type: 'mc', lv: 2, q: R`$\partial p_k/\partial z_m$ ($k\ne m$)은?`,
        choices: [R`$p_k(1-p_k)$`, R`$-p_kp_m$`, R`$p_kp_m$`, R`0`], ans: 1,
        sol: R`$p_k(\delta_{km}-p_m)$에서 $k\ne m$이면 $-p_kp_m$. 다른 클래스의 로짓이 커지면 내 확률은 줄어듭니다.` },
      { sec: '6.3', type: 'num', lv: 2, q: R`표본 하나에서 $p=(0.7,0.2,0.1)$, 정답 $y=(0,1,0)$, 입력 $x=(1,3)$일 때 $\partial J/\partial w_{21}$ ($m=2$, $n=1$)은?`, ans: '-0.8', ansTex: R`-0.8`,
        sol: R`$-(y_2-p_2)x_1=-(1-0.2)(1)=-0.8$. 정답 클래스의 가중치는 $-\nabla$ 방향, 즉 입력 쪽으로 커집니다.` },
      { sec: '6.3', type: 'num', lv: 2, q: R`같은 표본에서 $\partial J/\partial w_{12}$ ($m=1$, $n=2$)은?`, ans: '2.1', ansTex: R`2.1`,
        sol: R`$-(y_1-p_1)x_2=-(0-0.7)(3)=2.1$. 오답 클래스 1의 가중치는 줄어듭니다.` },
      { sec: '6.4', type: 'mc', lv: 3, q: R`규제 없는 소프트맥스 회귀의 최소점이 유일하지 않은 이유는?`,
        choices: [R`손실이 볼록이 아니라서`, R`모든 $w_k$에 같은 벡터를 더해도 확률이 변하지 않아서`, R`원-핫 레이블 때문에`, R`학습률 때문에`], ans: 1,
        sol: R`$w_k\to w_k+c$이면 모든 로짓에 $c^Tx$가 더해져 출력이 같습니다. 손실은 볼록이지만 순볼록이 아닙니다.` },
      { sec: '6.4', type: 'num', lv: 2, q: R`로짓 $z=(1000,1001)$의 소프트맥스 첫째 성분을 안정적으로 계산하면?`, ans: '1/(1+e)', ansTex: R`\tfrac1{1+e}\approx0.269`,
        sol: R`최댓값 1001을 빼면 $(-1,0)$, $\frac{e^{-1}}{e^{-1}+1}=\frac1{1+e}$. 그대로 계산하면 $e^{1000}$이 넘칩니다.` },
      { sec: '6.3', type: 'open', lv: 2, proof: true, q: R`소프트맥스 $p_k=e^{z_k}/\sum_je^{z_j}$에 대해 $\partial p_k/\partial z_m=p_k(\delta_{km}-p_m)$을 증명하고, 이를 써서 $J=-\sum_ky_k\log p_k$ (원-핫 $y$)의 기울기가 $\partial J/\partial z_m=p_m-y_m$임을 보이세요.`,
        sol: R`
$Z=\sum_je^{z_j}$. 몫의 미분법으로
$$\frac{\partial p_k}{\partial z_m}=\frac{(\partial e^{z_k}/\partial z_m)Z-e^{z_k}(\partial Z/\partial z_m)}{Z^2}=\frac{\delta_{km}e^{z_k}Z-e^{z_k}e^{z_m}}{Z^2}=\delta_{km}p_k-p_kp_m.$$
그러면
$$\frac{\partial J}{\partial z_m}=-\sum_ky_k\frac1{p_k}\frac{\partial p_k}{\partial z_m}=-\sum_ky_k(\delta_{km}-p_m)=-y_m+p_m\sum_ky_k=p_m-y_m.$$
($\sum_ky_k=1$.) $z_m=w_m^Tx$이므로 $\partial J/\partial w_{mn}=(p_m-y_m)x_n$.`,
        rubric: R`
- 몫의 미분과 $\delta_{km}$ 처리 — 4점
- 로그 미분과 합 정리 — 4점
- 원-핫 조건 사용 — 2점` },
    ],
  });
})();
