/* 판서에 없는 증명 — Part H: 05–08 (로지스틱 회귀, 소프트맥스 회귀, SVM, 신경망의 기초)
   수업 판서에서 증명하지 않았지만 시험에 중요한 공식. src가 없으므로 증명 탭에 ‘판서에 없는 증명’으로 표시됩니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
EM.plans = EM.plans || {};
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 05
  { ch: 'ch05', id: 'gausslogit', title: '공분산이 같은 가우시안 클래스의 사후확률은 로지스틱', keys: ['로지스틱 회귀 모델'],
    tags: 'logistic regression posterior log odds linear Gaussian class conditional shared covariance LDA linear discriminant analysis generative discriminative Bayes 로지스틱 회귀 사후확률 로그 오즈 가우시안 공분산 선형판별분석 생성 모델 판별 모델 베이즈',
    stmt: R`이진 레이블 $y\in\{0,1\}$의 사전확률이 $P(y=1)=\pi\in(0,1)$이고, 각 클래스의 입력이 공분산이 같은 가우시안 $x\mid y=k\sim\N(\mu_k,\Sigma)$ ($k=0,1$, $\Sigma$는 양의 정부호 대칭행렬)를 따른다고 하자. 그러면 사후확률의 로그 오즈는 $x$의 일차식이고 로지스틱 회귀 모델의 꼴이 정확히 나온다.
$$\log\frac{P(y=1\mid x)}{P(y=0\mid x)}=w^Tx+b,$$
$$P(y=1\mid x)=\sigma(w^Tx+b),$$
$$w=\Sigma^{-1}(\mu_1-\mu_0),$$
$$\begin{aligned}b=&-\tfrac12\mu_1^T\Sigma^{-1}\mu_1+\tfrac12\mu_0^T\Sigma^{-1}\mu_0\\&+\log\tfrac{\pi}{1-\pi}.\end{aligned}$$`,
    body: R`
**1. 베이즈 정리.** $\N(\mu_k,\Sigma)$의 밀도를 $f_k$라 하면 베이즈 정리(2.2절)로
$$P(y=1\mid x)=\frac{\pi f_1(x)}{\pi f_1(x)+(1-\pi)f_0(x)}.$$
분자·분모를 $\pi f_1(x)>0$으로 나누고 $a(x)=\log\dfrac{\pi f_1(x)}{(1-\pi)f_0(x)}$로 두면 $P(y=1\mid x)=\dfrac1{1+e^{-a(x)}}=\sigma(a(x))$입니다. 또 $P(y=0\mid x)$는 분모가 같고 분자가 $(1-\pi)f_0(x)$이므로 두 사후확률의 비가 $\frac{\pi f_1(x)}{(1-\pi)f_0(x)}$, 즉 $a(x)$가 바로 사후 로그 오즈입니다(사후 오즈 = 사전 오즈 × 가능도비).

**2. 정규화 상수의 약분.** $d$차원 가우시안의 밀도는
$$f_k(x)=\frac{\exp\big(-\frac12Q_k(x)\big)}{(2\pi)^{d/2}(\det\Sigma)^{1/2}},$$
$$Q_k(x)=(x-\mu_k)^T\Sigma^{-1}(x-\mu_k)$$
입니다. 두 클래스가 같은 $\Sigma$를 쓰므로 분모가 같아 비에서 약분됩니다.
$$\log\frac{f_1(x)}{f_0(x)}=-\tfrac12Q_1(x)+\tfrac12Q_0(x).$$

**3. 이차항의 소거.** $\Sigma$가 대칭이면 $(\Sigma^{-1})^T=(\Sigma^T)^{-1}=\Sigma^{-1}$이라 $\Sigma^{-1}$도 대칭이고, $1\times1$ 행렬 $x^T\Sigma^{-1}\mu_k$는 자신의 전치 $\mu_k^T\Sigma^{-1}x$와 같습니다. 따라서
$$Q_k=x^T\Sigma^{-1}x-2\mu_k^T\Sigma^{-1}x+\mu_k^T\Sigma^{-1}\mu_k.$$
$-\frac12Q_1+\frac12Q_0$에서 $x^T\Sigma^{-1}x$의 계수는 $-\frac12+\frac12=0$이라 지워지고
$$\begin{aligned}-\tfrac12Q_1+\tfrac12Q_0=&\ (\mu_1-\mu_0)^T\Sigma^{-1}x\\&-\tfrac12\mu_1^T\Sigma^{-1}\mu_1+\tfrac12\mu_0^T\Sigma^{-1}\mu_0.\end{aligned}$$

**4. 결론.** $a(x)=\log\frac\pi{1-\pi}+\log\frac{f_1(x)}{f_0(x)}$에 3단계를 넣으면 $a(x)=w^Tx+b$입니다. 여기서 $w^T=(\mu_1-\mu_0)^T\Sigma^{-1}$을 전치하면(다시 $\Sigma^{-1}$의 대칭성) $w=\Sigma^{-1}(\mu_1-\mu_0)$이고, $b$는 남은 상수항들입니다. 1단계에 의해 $P(y=1\mid x)=\sigma(w^Tx+b)$. 절편을 $w_0=b$, $x_0=1$로 흡수하면 5.2절의 $\log\frac p{1-p}=w^Tx$ 그대로입니다.`,
    note: R`공분산이 다르면($\Sigma_0\ne\Sigma_1$) 3단계에서 $\frac12x^T(\Sigma_0^{-1}-\Sigma_1^{-1})x$가 지워지지 않고 남아(정규화 상수의 비는 상수항으로 남음) 로그 오즈가 $x$의 이차식, 결정 경계가 이차 곡면이 됩니다. 역은 성립하지 않습니다. 사후확률이 로지스틱 꼴이라고 클래스별 분포가 가우시안일 필요는 없으므로, 분포를 가정하지 않고 사후확률의 모양만 맞추는 로지스틱 회귀가 더 넓게 쓰입니다. 또 로그 오즈가 $w^Tx$이므로 $x_j$만 1 늘리면 오즈가 $e^{w_j}$배가 됩니다(오즈비).` },
  { ch: 'ch05', id: 'separable', title: '선형 분리 가능하면 최대가능도 해가 없고, 규제하면 해가 하나 있다',
    tags: 'logistic regression linearly separable maximum likelihood does not exist divergence infimum regularization weight decay L2 ridge strongly convex existence uniqueness coercive MAP 로지스틱 회귀 선형 분리 가능 최대가능도 해 없음 발산 하한 규제 강볼록 존재 유일성',
    stmt: R`$J(w)=\sum_{i=1}^N\big[\log(1+e^{-z_i})+(1-y_i)z_i\big]$ ($z_i=w^Tx_i$, $y_i\in\{0,1\}$)를 로지스틱 회귀의 음의 로그가능도라 하자.

(i) 자료가 선형 분리 가능하면, 즉 어떤 $\bar w$에 대해 $y_i=1$이면 $\bar w^Tx_i>0$, $y_i=0$이면 $\bar w^Tx_i<0$이면, $\inf_wJ(w)=0$이지만 모든 $w$에서 $J(w)>0$이다. 따라서 $J$는 최소점도, 기울기가 0인 점도 갖지 않는다.

(ii) $\lambda>0$이면 자료와 상관없이 $J_\lambda(w)=J(w)+\frac\lambda2\lVert w\rVert^2$는 최소점을 정확히 하나 갖는다.`,
    body: R`
**1. 표본 손실은 양수.** 표본 하나의 손실 $\ell_i=\log(1+e^{-z_i})+(1-y_i)z_i$는 $y_i=1$이면 $\log(1+e^{-z_i})$이고, $y_i=0$이면
$$\begin{aligned}\log(1+e^{-z_i})+z_i&=\log\big(e^{z_i}(1+e^{-z_i})\big)\\&=\log(1+e^{z_i})\end{aligned}$$
입니다. 레이블을 $t_i=2y_i-1\in\{1,-1\}$로 바꿔 쓰면 두 경우가 $\ell_i=\log(1+e^{-t_iz_i})$ 한 식이 됩니다. 로그 안이 1보다 크므로 $\ell_i>0$이고, 따라서 모든 $w$에서 $J(w)>0$입니다.

**2. 분리 방향으로 늘리기.** 분리 가능하다는 가정은 모든 $i$에서 $m_i=t_i\,\bar w^Tx_i>0$이라는 뜻입니다. $w=c\bar w$ ($c>0$)를 넣으면
$$J(c\bar w)=\sum_{i=1}^N\log\big(1+e^{-cm_i}\big).$$
$m_i>0$이라 각 항은 $c$에 대해 순감소하고 $c\to\infty$이면 $\log1=0$으로 갑니다. 따라서 $\inf_wJ\le\lim_{c\to\infty}J(c\bar w)=0$이고, 1단계의 $J>0$과 합치면 $\inf_wJ=0$입니다.

**3. 최소점과 정류점이 없음.** 최소점 $w^*$가 있다면 $J(w^*)=\inf J=0$이어야 하는데 1단계에서 $J(w^*)>0$이므로 모순입니다. 또 $J$는 볼록이므로(헤시안 $X^TSX\succeq0$, 5.5절) $\nabla J(w)=0$인 점은 전역 최소점이 됩니다. 최소점이 없으니 기울기가 0인 점도 없어, 경사하강법이 수렴할 정류점이 없습니다.

**4. 규제: 존재.** 이제 $\lambda>0$이고 자료는 아무것이나 됩니다. $J\ge0$이므로 $J_\lambda(w)\ge\frac\lambda2\lVert w\rVert^2$. $c_0=J_\lambda(0)=N\log2$로 두면 $\lVert w\rVert>\rho=\sqrt{2c_0/\lambda}$인 $w$에서는 $J_\lambda(w)>c_0$입니다. 닫힌 공 $\{\lVert w\rVert\le\rho\}$는 유계인 닫힌 집합이고 $J_\lambda$는 연속이므로 공 위에서 최솟값을 가지며(최대·최소 정리), 그 값은 $J_\lambda(0)=c_0$ 이하라 공 밖의 모든 값보다 작습니다. 따라서 전역 최소점이 존재합니다.

**5. 규제: 유일.** 노름의 제곱은 중점 항등식
$$\Big\lVert\frac{u+v}2\Big\rVert^2=\frac{\lVert u\rVert^2+\lVert v\rVert^2}2-\frac{\lVert u-v\rVert^2}4$$
를 만족하고(양변을 내적으로 전개), $J$는 볼록이라 $J(\frac{u+v}2)\le\frac{J(u)+J(v)}2$입니다. 두 식을 합치면
$$\begin{aligned}J_\lambda\Big(\frac{u+v}2\Big)\le&\ \frac{J_\lambda(u)+J_\lambda(v)}2\\&-\frac\lambda8\lVert u-v\rVert^2.\end{aligned}$$
서로 다른 두 최소점 $u\ne v$가 있어 $J_\lambda(u)=J_\lambda(v)=m$이라면 중점에서 $J_\lambda<m$이 되어 모순입니다. 따라서 최소점은 하나뿐입니다.`,
    note: R`5.5절의 1차원 예($x=-1$은 레이블 0, $x=+1$은 레이블 1, 모델 $\sigma(wx)$)에서는 $\bar w=1$이 분리 방향이고 $J(w)=2\log(1+e^{-w})$가 $w\to\infty$에서 0으로 내려가기만 합니다. 헤시안이 양의 정부호여도(5.5절) 최소점이 **있다면** 유일할 뿐 존재는 보장되지 않는다는 것이 (i)의 교훈입니다. 규제항 $\frac\lambda2\lVert w\rVert^2$은 사전분포 $w\sim\N(0,\frac1\lambda I)$의 MAP 추정과 같습니다(2.6절).` },

  // ───── 06
  { ch: 'ch06', id: 'lse', title: '로그-합-지수는 부드러운 최댓값이다', keys: ['소프트맥스의 성질'],
    tags: 'log-sum-exp LSE soft maximum softmax gradient temperature argmax one-hot uniform limit bounds 로그 합 지수 부드러운 최댓값 소프트맥스 기울기 온도 극한 원핫 균등분포',
    stmt: R`$z\in\mathbb R^C$ ($C\ge2$)에 대해 $\operatorname{LSE}(z)=\log\sum_{j=1}^Ce^{z_j}$, $M=\max_jz_j$, $A=\{k:z_k=M\}$, $p=\softmax(z)$라 하자.

(i) $M<\operatorname{LSE}(z)\le M+\log C$이고, 오른쪽 등호는 모든 $z_k$가 같을 때뿐이다.

(ii) $\dfrac{\partial\operatorname{LSE}}{\partial z_k}=p_k$, 즉 $\nabla\operatorname{LSE}(z)=\softmax(z)$.

(iii) 온도 $T>0$에 대해 $M<T\operatorname{LSE}(z/T)\le M+T\log C$이므로 $T\to0^+$이면 $T\operatorname{LSE}(z/T)\to M$.

(iv) $T\to0^+$이면 $\softmax(z/T)_k\to\frac1{\lvert A\rvert}$ ($k\in A$), $0$ ($k\notin A$)이다(최댓값이 하나뿐이면 argmax의 원-핫). $T\to\infty$이면 $\softmax(z/T)\to\frac1C\mathbf 1$ (균등분포).`,
    body: R`
**(i) 범위.** 모든 $j$에서 $z_j\le M$이므로 $e^{z_j}\le e^M$이고, $k\in A$이면 $e^{z_k}=e^M$입니다. 합하면
$$e^M<\sum_{j=1}^Ce^{z_j}\le Ce^M.$$
왼쪽이 엄격한 이유는 $C\ge2$라 $e^M$ 말고도 양수 항이 적어도 하나 더 있기 때문입니다. 오른쪽 등호는 모든 항이 $e^M$일 때, 즉 모든 $z_j=M$일 때뿐입니다. $\log$는 순증가이므로 각 변에 로그를 취하면 $M<\operatorname{LSE}(z)\le M+\log C$이고 등호 조건도 그대로 옮겨집니다.

**(ii) 기울기.** $Z=\sum_je^{z_j}$로 두면 $z_k$가 들어 있는 항은 $e^{z_k}$ 하나뿐이라 $\frac{\partial Z}{\partial z_k}=e^{z_k}$입니다. 연쇄법칙으로
$$\frac{\partial}{\partial z_k}\log Z=\frac1Z\frac{\partial Z}{\partial z_k}=\frac{e^{z_k}}{\sum_je^{z_j}}=p_k.$$

**(iii) 온도와 최댓값.** (i)을 벡터 $z/T$에 적용합니다. $T>0$이므로 $z/T$의 최댓값은 $M/T$이고
$$\frac MT<\operatorname{LSE}(z/T)\le\frac MT+\log C.$$
양변에 $T>0$을 곱해도 부등호 방향이 유지되어 $M<T\operatorname{LSE}(z/T)\le M+T\log C$. $T\to0^+$이면 오른쪽 끝이 $M$으로 가므로 조임 정리로 $T\operatorname{LSE}(z/T)\to M$입니다.

**(iv) 온도와 소프트맥스.** 분자·분모에 $e^{-M/T}$를 곱하면(평행이동 불변성)
$$\softmax(z/T)_k=\frac{e^{(z_k-M)/T}}{\sum_je^{(z_j-M)/T}}.$$
$k\in A$이면 분자는 $e^0=1$이고, $k\notin A$이면 $z_k-M<0$이라 $T\to0^+$에서 지수가 $-\infty$로 가서 분자가 0으로 갑니다. 그러므로 분모는 양수 $\lvert A\rvert$로 가고, 극한은 $k\in A$에서 $\frac1{\lvert A\rvert}$, 나머지에서 0입니다. $T\to\infty$이면 모든 $(z_j-M)/T\to0$이라 분자와 분모의 각 항이 1로 가서 극한은 $\frac1C$입니다.`,
    note: R`(ii)를 한 번 더 미분하면 $\nabla^2\operatorname{LSE}=\frac{\partial p}{\partial z}=\diag(p)-pp^T\succeq0$ (야코비안과 볼록성의 증명)이라 LSE는 볼록입니다. 정리하면 LSE는 $\max$를 $\log C$ 안쪽으로 근사하는 매끄러운 볼록함수이고, 그 기울기인 소프트맥스는 $\max$의 기울기(argmax의 원-핫)를 매끄럽게 만든 것입니다. 손실로 보면 $-\log p_c=\operatorname{LSE}(z)-z_c>M-z_c\ge0$이므로, 손실이 0에 가까우려면 정답 점수 $z_c$가 최댓값이면서 다른 점수보다 충분히 커야 합니다.` },
  { ch: 'ch06', id: 'regunique', title: '소프트맥스 회귀의 평평한 방향과 규제된 해의 유일성', keys: ['소프트맥스의 성질'],
    tags: 'softmax regression Hessian null space flat direction shift invariance non-unique minimizer regularization weight decay Frobenius identifiability sum to zero 소프트맥스 회귀 헤시안 영공간 평평한 방향 평행이동 불변 최소점 비유일 규제 유일성',
    stmt: R`(i) $p\in\mathbb R^C$의 성분이 모두 양수이고 $\sum_kp_k=1$이면 $H=\diag(p)-pp^T$에 대해
$$Hv=0\iff v^THv=0\iff v=c\mathbf 1\ \ (c\in\mathbb R).$$

(ii) 소프트맥스 회귀의 손실 $J(W)=-\sum_i\sum_ky_{ik}\log p_k(x_i,W)$ ($W\in\mathbb R^{C\times d}$의 $k$번째 행이 $w_k^T$)는 모든 $u\in\mathbb R^d$에 대해 $J(W+\mathbf 1u^T)=J(W)$이므로, 최소점이 있다면 유일하지 않다.

(iii) $\lambda>0$이면 $J_\lambda(W)=J(W)+\frac\lambda2\lVert W\rVert_F^2$ ($\lVert W\rVert_F^2=\sum_k\lVert w_k\rVert^2$)는 최소점 $W^*$를 정확히 하나 갖고, 그 최소점에서 $\sum_kw_k^*=0$이다.`,
    body: R`
**(i) 영공간.** $\bar v=p^Tv=\sum_jp_jv_j$로 두면 $(Hv)_k=p_kv_k-p_k\bar v=p_k(v_k-\bar v)$입니다. $p_k>0$이므로 $Hv=0$은 모든 $k$에서 $v_k=\bar v$, 즉 성분이 모두 같다는 것과 같습니다. 거꾸로 $v=c\mathbf 1$이면 $\bar v=c\sum_jp_j=c$라 $Hv=0$. 이차형식은
$$v^THv=\sum_kp_kv_k(v_k-\bar v)=\sum_kp_k(v_k-\bar v)^2$$
입니다(둘째 등호는 $\sum_kp_k\bar v(v_k-\bar v)=\bar v(\bar v-\bar v)=0$을 빼 준 것). 각 항이 $0$ 이상이고 $p_k>0$이므로 $v^THv=0$도 모든 $v_k=\bar v$와 같은 조건입니다.

**(ii) 한 방향의 불변성.** $W+\mathbf 1u^T$의 $k$번째 행은 $w_k+u$이므로 표본 $x_i$의 점수가 모두 $z_k\to z_k+u^Tx_i$로 같은 수만큼 움직입니다. 소프트맥스의 평행이동 불변성으로 모든 $p_k(x_i,\cdot)$가 그대로이고 $J(W+\mathbf 1u^T)=J(W)$. $W^*$가 최소점이면 $u\ne0$인 $W^*+\mathbf 1u^T$도 같은 값을 갖는 다른 최소점입니다. 점수 공간에서 이 이동은 $z\to z+(u^Tx_i)\mathbf 1$, 곧 (i)의 영공간 방향입니다.

**(iii-1) 존재.** $p_k\in(0,1)$이라 $-\log p_k>0$이므로 $J\ge0$이고 $J_\lambda(W)\ge\frac\lambda2\lVert W\rVert_F^2$. $W=0$이면 모든 확률이 $\frac1C$이라 $c_0=J_\lambda(0)=N\log C$입니다. $\lVert W\rVert_F>\sqrt{2c_0/\lambda}$인 곳에서는 $J_\lambda>c_0$이고, 닫힌 공 $\lVert W\rVert_F\le\sqrt{2c_0/\lambda}$ 위에서 연속함수 $J_\lambda$는 최솟값을 가지므로(최대·최소 정리) 그것이 전역 최소입니다.

**(iii-2) 유일.** $J$는 볼록이고(소프트맥스 교차 엔트로피의 볼록성), 프로베니우스 노름도 성분별로 전개하면 중점 항등식 $\lVert\frac{U+V}2\rVert_F^2=\frac{\lVert U\rVert_F^2+\lVert V\rVert_F^2}2-\frac{\lVert U-V\rVert_F^2}4$를 만족합니다. 따라서 $J_\lambda(\frac{U+V}2)\le\frac{J_\lambda(U)+J_\lambda(V)}2-\frac\lambda8\lVert U-V\rVert_F^2$이고, 서로 다른 두 최소점이 있으면 중점의 값이 최솟값보다 작아져 모순입니다.

**(iii-3) 행의 합이 0.** 최소점 $W^*$에서 $s=\sum_kw_k^*=W^{*T}\mathbf 1$로 두고 $\varphi(u)=J_\lambda(W^*+\mathbf 1u^T)$를 봅니다. (ii)에서 $J$ 부분은 변하지 않고
$$\begin{aligned}\lVert W^*+\mathbf 1u^T\rVert_F^2&=\sum_k\lVert w_k^*+u\rVert^2\\&=\lVert W^*\rVert_F^2+2u^Ts+C\lVert u\rVert^2\end{aligned}$$
이므로 $\varphi(u)-\varphi(0)=\lambda u^Ts+\frac{\lambda C}2\lVert u\rVert^2$입니다. $W^*$가 최소점이라 이 값은 모든 $u$에서 $0$ 이상이어야 합니다. $u=-ts$ ($t>0$)를 넣으면 $\lambda\lVert s\rVert^2\big(-t+\frac C2t^2\big)\ge0$인데, $0<t<\frac2C$이면 괄호가 음수이므로 $\lVert s\rVert^2=0$, 즉 $\sum_kw_k^*=0$입니다.`,
    note: R`(i)은 한 표본의 손실이 점수 공간에서 **정확히 한 방향** $\mathbf 1$로만 평평하다는 뜻이고(6.4절의 “평평한 방향이 정확히 하나”), (ii)는 그 방향이 가중치 공간에서 $W\to W+\mathbf 1u^T$로 나타난다는 뜻입니다. 규제는 이 모호함 가운데 클래스 가중치의 합이 0인 대표 하나를 고릅니다. 한 클래스의 가중치를 0으로 고정하는 것(6.4절)은 같은 모호함을 다른 대표로 없애는 방법입니다.` },

  // ───── 07
  { ch: 'ch07', id: 'hyperplane', title: '법선 벡터와 초평면의 두 쪽', keys: ['초평면과 선형 분류'],
    tags: 'hyperplane normal vector half space signed distance origin distance linear classifier sign rule correct classification 초평면 법선 벡터 반공간 부호 있는 거리 원점까지 거리 선형 분류 부호 올바른 분류',
    stmt: R`$w\in\mathbb R^n$, $w\ne0$, $f(x)=x^Tw+b$, $H=\{x:f(x)=0\}$, $u=w/\lVert w\rVert$라 하자.

(i) $H$ 위의 두 점 $x,x'$에 대해 $w^T(x-x')=0$이다($w$는 $H$의 법선). $H$의 모든 점은 $u$ 방향 사영 길이가 $x^Tu=-b/\lVert w\rVert$로 같고, 원점에서 가장 가까운 $H$의 점은 $x_0=-\frac b{\lVert w\rVert^2}w$, 그 거리는 $\frac{\lvert b\rvert}{\lVert w\rVert}$이다.

(ii) 모든 $x\in\mathbb R^n$은 $x=x_H+t\,u$ ($x_H\in H$, $t\in\mathbb R$)로 유일하게 쓰이고 $t=\frac{f(x)}{\lVert w\rVert}$이다. 따라서 $f(x)>0$인 점은 $H$에서 $w$가 가리키는 쪽, $f(x)<0$인 점은 그 반대쪽에 있다.

(iii) $y_i\in\{1,-1\}$이고 $f(x_i)\ne0$이면 $\sign(f(x_i))=y_i\iff y_if(x_i)>0$. 따라서 “모든 $i$에서 $y_if(x_i)\ge0$”은 틀린 쪽에 있는 점이 하나도 없다(경계 위는 허용)는 조건이다.`,
    body: R`
**(i) 법선과 원점까지의 거리.** $x,x'\in H$이면 $w^Tx+b=0=w^Tx'+b$에서 빼면 $w^T(x-x')=0$이므로, $H$ 안의 모든 방향 $x-x'$에 $w$가 수직입니다. 또 $x\in H$이면 $x^Tw=-b$이므로 $x^Tu=-b/\lVert w\rVert$로 일정합니다. $x_0=-\frac b{\lVert w\rVert^2}w$는 $f(x_0)=-\frac b{\lVert w\rVert^2}w^Tw+b=0$이라 $H$ 위에 있고 $\lVert x_0\rVert=\frac{\lvert b\rvert}{\lVert w\rVert}$입니다. 임의의 $x\in H$에 대해 $x_0^T(x-x_0)=-\frac b{\lVert w\rVert^2}w^T(x-x_0)=0$ (두 점이 모두 $H$ 위)이므로 피타고라스 정리로
$$\lVert x\rVert^2=\lVert x_0\rVert^2+\lVert x-x_0\rVert^2\ge\lVert x_0\rVert^2.$$

**(ii) 분해의 존재.** $t=\frac{f(x)}{\lVert w\rVert}$, $x_H=x-tu$로 두면 $w^Tu=\lVert w\rVert$이므로
$$f(x_H)=f(x)-t\,w^Tu=f(x)-f(x)=0,$$
즉 $x_H\in H$이고 $x=x_H+tu$입니다.

**(ii) 분해의 유일성.** 거꾸로 $x=x_H+tu$ ($x_H\in H$)라 하면 $f$를 취해 $f(x)=\big(w^Tx_H+b\big)+t\,w^Tu=0+t\lVert w\rVert$입니다. 따라서 $t=\frac{f(x)}{\lVert w\rVert}$로 정해지고 $x_H=x-tu$도 정해집니다.

**(ii) 두 쪽.** $t$는 $H$ 위의 점 $x_H$에서 $x$까지 단위 법선 $u$ 방향으로 잰 부호 있는 길이입니다. $\lVert w\rVert>0$이라 $t>0\iff f(x)>0$이므로 $f(x)>0$인 점들은 $H$에서 $w$ 방향으로 떨어진 쪽, $f(x)<0$인 점들은 반대쪽에 모입니다. $\lvert t\rvert=\frac{\lvert f(x)\rvert}{\lVert w\rVert}$는 점과 초평면 사이의 거리(7.2절)와 같습니다.

**(iii) 분류 조건.** $y_i\in\{1,-1\}$이고 $f(x_i)\ne0$이면, $y_if(x_i)>0$은 $y_i$와 $f(x_i)$의 부호가 같다는 것이고 이것이 곧 $\sign(f(x_i))=y_i$입니다. 맞으면 곱이 양수, 틀리면 음수이므로 모든 $i$에서 $y_if(x_i)\ge0$이면 틀린 쪽($y_if(x_i)<0$)에 있는 점이 없습니다.`,
    note: R`경계 위의 점($f(x_i)=0$)은 $\sign$이 정해지지 않아 맞았다고도 틀렸다고도 하기 어렵습니다. 하드 마진 SVM의 제약 $y_i(w^Tx_i+b)\ge1$은 이런 점을 없애고, (ii)의 $\lvert t\rvert=\lvert f(x_i)\rvert/\lVert w\rVert\ge1/\lVert w\rVert$로 모든 점을 경계에서 $1/\lVert w\rVert$ 이상 떨어뜨립니다. 로지스틱 회귀의 결정 경계 $w^Tx=0$과 확률 등고선(5.2절)도 같은 법선 $w$를 가진 초평면들입니다.` },
  { ch: 'ch07', id: 'softmargin', title: '소프트 마진 SVM은 힌지 손실 + L2 규제이고 쌍대 제약은 0 ≤ α ≤ C',
    tags: 'soft margin SVM slack variable hinge loss L2 regularization box constraint dual problem Lagrangian C parameter 소프트 마진 여유 변수 힌지 손실 규제 상자 제약 쌍대 문제 라그랑지안',
    stmt: R`$y_i\in\{1,-1\}$, $C>0$일 때 소프트 마진 SVM
$$\min_{w,b,\xi}\ \tfrac12\lVert w\rVert^2+C\sum_{i=1}^N\xi_i$$
$$\text{s.t. }y_i(w^Tx_i+b)\ge1-\xi_i,\ \ \xi_i\ge0$$
에 대해 다음이 성립한다.

(i) $(w,b)$를 고정하면 최적의 여유 변수는 $\xi_i=\max\big(0,1-y_i(w^Tx_i+b)\big)$ 하나뿐이다. 따라서 이 문제는 힌지 손실 + $L_2$ 규제
$$\begin{aligned}\min_{w,b}\ &\tfrac12\lVert w\rVert^2\\&+C\sum_i\max\big(0,1-y_i(w^Tx_i+b)\big)\end{aligned}$$
와 최솟값이 같고 최적 $(w,b)$도 같다.

(ii) 라그랑주 쌍대 문제는 하드 마진의 쌍대 문제에서 $\alpha_i\ge0$을 $0\le\alpha_i\le C$로 바꾼 것이다.
$$\max_\alpha\ \sum_i\alpha_i-\tfrac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$$
$$\text{s.t. }0\le\alpha_i\le C,\ \ \sum_i\alpha_iy_i=0$$`,
    body: R`
**1. 여유 변수의 소거.** $m_i=y_i(w^Tx_i+b)$로 두면 $\xi_i$에 걸린 제약은 $\xi_i\ge1-m_i$와 $\xi_i\ge0$, 합쳐서 $\xi_i\ge\max(0,1-m_i)$입니다. $(w,b)$를 고정하면 목적함수에서 $\xi$에 의존하는 부분은 $C\sum_i\xi_i$뿐이고 $C>0$이라 각 $\xi_i$에 대해 순증가이므로, 최소는 각 $\xi_i$를 하한까지 내린 $\xi_i=\max(0,1-m_i)$에서만 달성됩니다.

**2. 힌지 꼴.** 최소화를 두 단계로 나누면($\min_{w,b,\xi}=\min_{w,b}\min_\xi$) 1단계에서
$$\begin{aligned}\min_{w,b,\xi}(\cdots)=\min_{w,b}\Big[&\tfrac12\lVert w\rVert^2\\&+C\sum_i\max(0,1-m_i)\Big].\end{aligned}$$
$(w^*,b^*,\xi^*)$가 원문제의 최적해이면 1단계에 의해 $\xi^*$는 $(w^*,b^*)$에서의 힌지 값이고 $(w^*,b^*)$는 오른쪽의 최적해입니다. 거꾸로 오른쪽의 최적해에 1단계의 $\xi$를 붙이면 원문제의 최적해가 됩니다.

**3. 라그랑지안.** 제약을 $1-\xi_i-m_i\le0$, $-\xi_i\le0$으로 쓰고 승수 $\alpha_i\ge0$, $\mu_i\ge0$을 붙이면
$$\begin{aligned}L=&\ \tfrac12\lVert w\rVert^2+C\sum_i\xi_i-\sum_i\mu_i\xi_i\\&+\sum_i\alpha_i\big(1-\xi_i-y_i(w^Tx_i+b)\big).\end{aligned}$$
$\xi_i$가 들어간 항을 모으면 $(C-\alpha_i-\mu_i)\xi_i$이고 나머지는 하드 마진의 라그랑지안 $L_p(w,b,\alpha)$이므로
$$L=L_p(w,b,\alpha)+\sum_i(C-\alpha_i-\mu_i)\xi_i.$$

**4. 여유 변수에 대한 최소화.** $L$은 $\xi_i\in\mathbb R$에 대해 일차식이므로 계수 $C-\alpha_i-\mu_i\ne0$이면 $\xi_i\to\pm\infty$로 $\inf L=-\infty$입니다. 따라서 쌍대 함수가 유한하려면 모든 $i$에서 $\mu_i=C-\alpha_i$여야 하고, 이때 $\xi$ 항이 사라져 $\inf_{w,b,\xi}L=\inf_{w,b}L_p(w,b,\alpha)$입니다.

**5. 쌍대 문제.** $\inf_{w,b}L_p$는 하드 마진의 경우(SVM 쌍대 문제의 유도)와 똑같이 $\sum_i\alpha_iy_i=0$이면 $\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$, 아니면 $-\infty$입니다. 남은 조건은 $\alpha_i\ge0$과 $\mu_i=C-\alpha_i\ge0$, 곧 $0\le\alpha_i\le C$입니다. $\mu$는 $\alpha$로 정해지므로 지우면 위의 쌍대 문제가 됩니다.`,
    note: R`2단계의 목적함수를 $CN$으로 나누면 $\frac1N\sum_i\max(0,1-y_if(x_i))+\frac1{2CN}\lVert w\rVert^2$이므로 $C$가 클수록 규제가 약합니다($\lambda=\frac1{CN}$). 레이블이 $\pm1$인 로지스틱 회귀의 손실 $\log(1+e^{-y_if(x_i)})$과 나란히 놓으면, 두 방법은 “마진 $y_if(x_i)$에 대한 손실 + $L_2$ 규제”라는 같은 틀에서 손실의 모양만 다릅니다.` },
  { ch: 'ch07', id: 'kkt', title: 'KKT 조건은 SVM 최적성의 충분조건', keys: ['SVM 쌍대 문제'],
    tags: 'KKT Karush Kuhn Tucker conditions sufficient optimality SVM stationarity complementary slackness primal dual feasibility strong duality support vector 카루시 쿤 터커 KKT 조건 충분조건 최적성 정류성 상보성 강한 쌍대성 서포트 벡터',
    stmt: R`하드 마진 SVM에서 $(w^*,b^*)$와 $\alpha^*\in\mathbb R^N$이 다음 네 조건(KKT)을 만족한다고 하자.
- 정류성: $w^*=\sum_i\alpha_i^*y_ix_i$, $\sum_i\alpha_i^*y_i=0$
- 원문제 가능성: $y_i(w^{*T}x_i+b^*)\ge1$
- 쌍대 가능성: $\alpha_i^*\ge0$
- 상보성: $\alpha_i^*\big(1-y_i(w^{*T}x_i+b^*)\big)=0$

그러면 $(w^*,b^*)$는 원문제의 최적해, $\alpha^*$는 쌍대 문제의 최적해이고 두 최적값은 $\frac12\lVert w^*\rVert^2$로 같다. 또 원문제의 모든 최적해는 같은 $w^*$를 가진다.`,
    body: R`
$g_i(w,b)=1-y_i(w^Tx_i+b)$, $L_p(w,b,\alpha)=\frac12\lVert w\rVert^2+\sum_i\alpha_ig_i(w,b)$로 씁니다.

**1. 라그랑지안의 최소점.** $\alpha^*$를 고정하고 전개하면
$$\begin{aligned}L_p(w,b,\alpha^*)=&\ \tfrac12\lVert w\rVert^2-w^T\textstyle\sum_i\alpha_i^*y_ix_i\\&-b\textstyle\sum_i\alpha_i^*y_i+\sum_i\alpha_i^*.\end{aligned}$$
정류성을 넣으면 둘째 항은 $-w^Tw^*$, 셋째 항은 0이 되어 완전제곱으로
$$\begin{aligned}L_p(w,b,\alpha^*)=&\ \tfrac12\lVert w-w^*\rVert^2\\&-\tfrac12\lVert w^*\rVert^2+\textstyle\sum_i\alpha_i^*.\end{aligned}$$
따라서 모든 $(w,b)$에서 $L_p(w,b,\alpha^*)\ge L_p(w^*,b^*,\alpha^*)$이고, 등호는 $w=w^*$일 때뿐입니다($b$와는 무관).

**2. 그 최솟값.** 상보성으로 $\sum_i\alpha_i^*g_i(w^*,b^*)=0$이므로 $L_p(w^*,b^*,\alpha^*)=\frac12\lVert w^*\rVert^2$입니다.

**3. 원문제의 최적성.** 실현가능한 임의의 $(w,b)$, 즉 모든 $g_i(w,b)\le0$인 점에서는 $\alpha_i^*\ge0$이므로 $\sum_i\alpha_i^*g_i(w,b)\le0$이고
$$\begin{aligned}\tfrac12\lVert w\rVert^2&\ge L_p(w,b,\alpha^*)\\&\ge L_p(w^*,b^*,\alpha^*)=\tfrac12\lVert w^*\rVert^2\end{aligned}$$
입니다(둘째 줄은 1·2단계). $(w^*,b^*)$ 자신도 원문제 가능성에 의해 실현가능하므로 원문제의 최적해이고 최적값은 $\frac12\lVert w^*\rVert^2$입니다. 다른 최적해 $(w,b)$에서는 이 사슬이 모두 등호여야 하므로 1단계의 등호 조건에서 $w=w^*$.

**4. 쌍대 문제의 최적성.** 쌍대 함수 $D(\alpha)=\inf_{w,b}L_p(w,b,\alpha)$는 1·2단계에서 $D(\alpha^*)=\frac12\lVert w^*\rVert^2$입니다. 임의의 $\alpha\ge0$에 대해 하한의 정의와 $g_i(w^*,b^*)\le0$으로
$$\begin{aligned}D(\alpha)&\le L_p(w^*,b^*,\alpha)\\&=\tfrac12\lVert w^*\rVert^2+\textstyle\sum_i\alpha_ig_i(w^*,b^*)\le\tfrac12\lVert w^*\rVert^2.\end{aligned}$$
따라서 $\alpha^*$가 쌍대 문제의 최적해이고 두 최적값이 같습니다.`,
    note: R`Problem Set 1 문제 3의 자료에서 $w^*=(\frac12,\frac12)$, $b^*=-1$, $\alpha^*=(\frac14,\frac14)$은 네 조건을 모두 만족하므로(두 제약이 모두 등호) 이 정리만으로 최적임이 확인됩니다. 같은 자료에 $x_3=(4,1)$, $y_3=+1$을 더해도 $\alpha_3^*=0$으로 두면 조건이 그대로 성립합니다($y_3(w^{*T}x_3+b^*)=\frac32\ge1$). 이 정리는 강한 쌍대성을 따로 증명하지 않고도 찾은 후보가 정답임을 확인하는 도구입니다. 반대 방향(최적해가 있으면 KKT를 만족하는 $\alpha^*$가 존재)은 슬레이터 조건이 필요한 더 깊은 정리입니다.` },
  { ch: 'ch07', id: 'twopoint', title: '두 점 하드 마진 SVM의 해 (Problem Set 1 문제 3)', keys: ['두 점 SVM의 해 (Problem Set 1 문제 3)'],
    tags: 'SVM two points hard margin primal dual Lagrangian multipliers support vectors strong duality perpendicular bisector margin Problem Set 1 problem 3 두 점 하드 마진 원문제 쌍대 라그랑지안 승수 서포트 벡터 강한 쌍대성 수직이등분선 마진',
    stmt: R`$x_1=(0,0)$, $y_1=-1$; $x_2=(2,2)$, $y_2=+1$에 대한 하드 마진 SVM
$$\min_{w,b}\ \tfrac12\lVert w\rVert^2$$
$$\text{s.t. }y_i(w^Tx_i+b)\ge1\ \ (i=1,2)$$
의 해는 $w^*=(\frac12,\frac12)$, $b^*=-1$ 하나뿐이고 최솟값은 $\frac14$이다. 쌍대 문제의 해는 $\alpha_1^*=\alpha_2^*=\frac14$이고 쌍대 값 $g^*=\frac14$가 원문제의 값과 같으며 $w^*=\sum_i\alpha_i^*y_ix_i$이다. 분리 초평면은 (좌표로) $x_1+x_2=2$, 마진은 $\frac1{\lVert w^*\rVert}=\sqrt2$이다.`,
    body: R`
**1. 제약 풀어 쓰기.** $y_1(w^Tx_1+b)=-b$, $y_2(w^Tx_2+b)=2w_1+2w_2+b$이므로 제약은
$$-b\ge1,\qquad 2w_1+2w_2+b\ge1.$$

**2. 원문제의 하한.** 두 제약을 더하면 $2(w_1+w_2)\ge2$, 곧 $w_1+w_2\ge1$입니다. 한편 $(w_1-w_2)^2\ge0$을 전개해 정리하면 $2(w_1^2+w_2^2)\ge(w_1+w_2)^2$이므로
$$\tfrac12\lVert w\rVert^2\ge\tfrac14(w_1+w_2)^2\ge\tfrac14.$$
실현가능한 모든 $(w,b)$에서 목적함수는 $\frac14$ 이상입니다.

**3. 등호와 유일성.** $\frac12\lVert w\rVert^2=\frac14$이려면 두 부등호가 모두 등호여야 하므로 $w_1=w_2$이고 $w_1+w_2=1$, 즉 $w=(\frac12,\frac12)$입니다. 이때 둘째 제약은 $2+b\ge1$, 곧 $b\ge-1$이고 첫 제약은 $b\le-1$이므로 $b=-1$. 거꾸로 $(w^*,b^*)=((\frac12,\frac12),-1)$은 두 제약을 등호로 만족합니다($-b^*=1$, $1+1-1=1$). 따라서 이것이 유일한 최적해이고 최솟값은 $\frac14$입니다.

**4. 쌍대 함수.** $\alpha_1,\alpha_2\ge0$에 대해 라그랑지안은
$$\begin{aligned}L=&\ \tfrac12\lVert w\rVert^2+\alpha_1(1+b)\\&+\alpha_2(1-2w_1-2w_2-b).\end{aligned}$$
$b$의 계수는 $\alpha_1-\alpha_2$이므로 $\alpha_1\ne\alpha_2$이면 $b\to\pm\infty$로 $\inf_{w,b}L=-\infty$입니다. $\alpha_1=\alpha_2$이면 $b$항이 사라지고, $\mathbf 1=(1,1)$로 쓰면 $w$에 대한 부분은 완전제곱 $\frac12\lVert w\rVert^2-2\alpha_2(w_1+w_2)=\frac12\lVert w-2\alpha_2\mathbf 1\rVert^2-4\alpha_2^2$이라 $w=2\alpha_2\mathbf 1$에서 최소 $-4\alpha_2^2$입니다. 따라서
$$g(\alpha)=\alpha_1+\alpha_2-4\alpha_2^2\qquad(\alpha_1=\alpha_2).$$

**5. 쌍대 문제의 해.** $\alpha_1=\alpha_2=\alpha\ge0$이면 $g=2\alpha-4\alpha^2=\frac14-4(\alpha-\frac14)^2$이므로 최댓값은 $\alpha=\frac14$에서 $g^*=\frac14$입니다. 이때 $w=2\alpha_2^*\mathbf 1=(\frac12,\frac12)=w^*$이고, 이것은 $\sum_i\alpha_i^*y_ix_i=\frac14(-1)(0,0)+\frac14(+1)(2,2)$와 같습니다.

**6. 강한 쌍대성과 상보성.** 쌍대 값 $g^*=\frac14$가 3단계의 원문제 최솟값과 같습니다(약한 쌍대성 $g^*\le\frac14$가 등호). 두 승수가 양수이고 두 제약이 모두 등호이므로 상보성 $\alpha_i^*\big(1-y_i(w^{*T}x_i+b^*)\big)=0$도 성립하고, 두 점 모두 서포트 벡터입니다. $b^*$는 서포트 벡터 $x_2$에서 $b^*=y_2-w^{*T}x_2=1-2=-1$로도 얻습니다.

**7. 초평면과 마진.** $w^{*T}x+b^*=\frac12x_1+\frac12x_2-1=0\iff x_1+x_2=2$ (여기서 $x_1,x_2$는 좌표)입니다. $\lVert w^*\rVert=\frac1{\sqrt2}$이고 거리 공식으로 두 자료점까지의 거리는 각각 $\frac{\lvert-1\rvert}{\lVert w^*\rVert}=\frac{\lvert1\rvert}{\lVert w^*\rVert}=\sqrt2$이므로 마진은 $\sqrt2$, 두 마진 경계 $x_1+x_2=0$과 $x_1+x_2=4$ 사이의 폭은 $2\sqrt2$입니다.`,
    note: R`일반적으로 서로 다른 두 점 $x_-$ ($y=-1$), $x_+$ ($y=+1$)이면 같은 논증(두 제약을 빼면 $w^T(x_+-x_-)\ge2$, 그리고 코시-슈바르츠 부등식)으로 $w^*=\frac{2d}{\lVert d\rVert^2}$ ($d=x_+-x_-$), $b^*=-\frac12w^{*T}(x_++x_-)$, 마진 $\frac{\lVert d\rVert}2$를 얻고, 분리 초평면은 두 점의 수직이등분선입니다. 2단계처럼 원문제를 아래에서 직접 누르면 쌍대 이론 없이도 최적성과 유일성이 증명되므로, 퀴즈 풀이의 순서(쌍대 → 복원)를 보완하는 검산이 됩니다.` },

  // ───── 08
  { ch: 'ch08', id: 'embedding', title: '동심원 자료: 입력 공간에서는 분리 불가능, 들어 올리면 평면 하나로 분리', keys: ['은닉층은 학습된 비선형 임베딩'],
    tags: 'nonlinear embedding feature map lifting concentric circles linearly separable convex combination convex hull hidden layer representation XOR 비선형 임베딩 특성 사상 들어 올리기 동심원 선형 분리 볼록결합 볼록 껍질 은닉층 표현',
    stmt: R`$0<r_1<r_2$이고 양성 자료 $D_+\subset\{x\in\mathbb R^2:\lVert x\rVert\le r_1\}$, 음성 자료 $D_-\subset\{x:\lVert x\rVert\ge r_2\}$라 하자. “$f$가 두 자료를 나눈다”는 한 클래스의 모든 점에서 $f>0$, 다른 클래스의 모든 점에서 $f<0$이라는 뜻이다.

(i) $D_+$ 점들의 볼록결합과 $D_-$ 점들의 볼록결합이 같은 점이 되면(두 볼록 껍질이 만나면) 어떤 일차식 $f(x)=w^Tx+b$도 두 자료를 나누지 못한다. 예: 원점 $\in D_+$이고 $(\pm r_2,0),(0,\pm r_2)\in D_-$.

(ii) 특성 사상 $\varphi(x)=(x_1,x_2,x_1^2+x_2^2)$으로 옮긴 공간의 선형 분류기 $h\mapsto v^Th+c$, $v=(0,0,-1)$, $c=\frac{r_1^2+r_2^2}2$는 두 자료를 나눈다.

(iii) 이 분류기의 입력 공간 결정 경계 $\{x:v^T\varphi(x)+c=0\}$은 원 $\lVert x\rVert^2=\frac{r_1^2+r_2^2}2$이다.`,
    body: R`
**(i) 볼록결합은 일차식의 부호를 보존한다.** 같은 점 $x^\circ=\sum_j\lambda_jp_j=\sum_k\mu_kq_k$ ($p_j\in D_+$, $q_k\in D_-$, $\lambda_j,\mu_k\ge0$, $\sum_j\lambda_j=\sum_k\mu_k=1$)가 있다고 합시다. $\sum_j\lambda_j=1$이므로 $b=\sum_j\lambda_jb$로 쓸 수 있고
$$\begin{aligned}f(x^\circ)&=w^T\sum_j\lambda_jp_j+\sum_j\lambda_jb\\&=\sum_j\lambda_jf(p_j)\end{aligned}$$
입니다. 같은 계산으로 $f(x^\circ)=\sum_k\mu_kf(q_k)$. $f$가 $D_+$에서 양수, $D_-$에서 음수라면 계수가 $0$ 이상이고 합이 1(적어도 하나는 양수)이므로 첫 식에서 $f(x^\circ)>0$, 둘째 식에서 $f(x^\circ)<0$이 되어 모순입니다. 부호가 반대인 경우도 같습니다. 예에서는 원점 자신이 $D_+$의 볼록결합이고, $0=\frac14\big[(r_2,0)+(-r_2,0)+(0,r_2)+(0,-r_2)\big]$은 $D_-$의 볼록결합입니다.

**(ii) 들어 올린 공간의 평면.** $h=\varphi(x)$이면 $v^Th+c=-\lVert x\rVert^2+\frac{r_1^2+r_2^2}2$입니다. $x\in D_+$이면 $\lVert x\rVert^2\le r_1^2$이라
$$v^T\varphi(x)+c\ge\frac{r_2^2-r_1^2}2>0,$$
$x\in D_-$이면 $\lVert x\rVert^2\ge r_2^2$이라 $v^T\varphi(x)+c\le-\frac{r_2^2-r_1^2}2<0$입니다. 3차원 공간의 평면 $h_3=\frac{r_1^2+r_2^2}2$가 두 클래스를 나누고, $v$가 단위벡터라 두 클래스 모두 이 평면에서 $\frac{r_2^2-r_1^2}2$ 이상 떨어져 있습니다.

**(iii) 입력 공간으로 되돌리기.** $v^T\varphi(x)+c=0\iff\lVert x\rVert^2=\frac{r_1^2+r_2^2}2$, 즉 반지름 $\sqrt{(r_1^2+r_2^2)/2}$ ($r_1$과 $r_2$ 사이)의 원입니다. 출력층은 $h$에 대해 **선형**이지만 $\varphi$가 비선형이라 입력 공간의 결정 경계는 곡선이 됩니다.`,
    note: R`신경망에서는 $\varphi$ 자리에 은닉층 $h=\sigma(W_1x+b_1)$이 오고, 그 사상을 자료로부터 학습한다는 점만 다릅니다. XOR도 같습니다. 두 대각선의 중점이 같은 점 $(\frac12,\frac12)$이라 (i)에 의해 입력 공간에서는 나눌 수 없지만, 은닉 좌표 $(h_1,h_2)=(\max(0,s),\max(0,s-1))$, $s=x_1+x_2$로 옮기면 $(0,0)\mapsto(0,0)$, $(0,1),(1,0)\mapsto(1,0)$, $(1,1)\mapsto(2,1)$이고 $h_1-2h_2$의 값이 양성에서 1, 음성에서 0이라 직선 $h_1-2h_2=\frac12$가 두 클래스를 나눕니다(8.4절).` },
  { ch: 'ch08', id: 'relu1d', title: '은닉층 하나의 ReLU 신경망과 1차원 보편 근사', keys: ['활성화 함수와 2층 신경망'],
    tags: 'universal approximation theorem ReLU piecewise linear one hidden layer two layer network interpolation uniform continuity depth sawtooth kinks 보편 근사 정리 조각 선형 은닉층 2층 신경망 꺾은선 보간 균등 연속 깊이 톱니',
    stmt: R`$a<b$라 하자.

(i) $a=t_0<t_1<\cdots<t_m<t_{m+1}=b$이고 $g:[a,b]\to\mathbb R$가 연속이며 각 $[t_k,t_{k+1}]$에서 기울기 $s_k$인 일차함수이면, $[a,b]$에서
$$\begin{aligned}g(x)=&\ g(a)+s_0\ReLU(x-a)\\&+\sum_{k=1}^m(s_k-s_{k-1})\ReLU(x-t_k).\end{aligned}$$
즉 $g$는 은닉 유닛이 $m+1$개인 2층 ReLU 신경망 $W_2\max(0,W_1x+b_1)+b_2$로 정확히 표현된다.

(ii) (1차원 보편 근사) $g:[a,b]\to\mathbb R$가 연속이면 임의의 $\varepsilon>0$에 대해 은닉층이 하나인 ReLU 신경망 $F$가 있어 $\max_{x\in[a,b]}\lvert F(x)-g(x)\rvert\le\varepsilon$이다.`,
    body: R`
**1. 각 조각에서의 기울기.** (i)의 오른쪽을 $F(x)$라 합시다. $x\in[t_j,t_{j+1}]$ ($0\le j\le m$)이면 $x-a\ge0$이라 $\ReLU(x-a)=x-a$이고, $k\le j$이면 $x-t_k\ge0$이라 $\ReLU(x-t_k)=x-t_k$, $k>j$이면 $x-t_k\le0$이라 $\ReLU(x-t_k)=0$입니다. 따라서 이 구간에서
$$\begin{aligned}F(x)=&\ g(a)+s_0(x-a)\\&+\sum_{k=1}^j(s_k-s_{k-1})(x-t_k)\end{aligned}$$
는 일차함수이고, 기울기는 망원급수 $s_0+\sum_{k=1}^j(s_k-s_{k-1})=s_j$입니다.

**2. 같은 함수.** $F$는 연속이고(ReLU들의 일차결합) $F(a)=g(a)$입니다. $F(t_j)=g(t_j)$라 하면 $[t_j,t_{j+1}]$에서 $F$와 $g$는 같은 점 $(t_j,g(t_j))$를 지나고 기울기가 $s_j$로 같은 일차함수이므로 이 구간 전체에서 같고, 특히 $F(t_{j+1})=g(t_{j+1})$입니다. $j=0,1,\dots,m$에 대해 차례로 쓰면 $[a,b]$ 전체에서 $F=g$. 신경망으로는 $W_1$의 성분이 모두 1, 편향이 $-t_k$ ($t_0=a$)인 은닉 유닛 $h_k=\ReLU(x-t_k)$와 출력 가중치 $s_0,\ s_1-s_0,\dots,s_m-s_{m-1}$, 출력 편향 $g(a)$입니다.

**3. 균등 연속.** 이제 $g$가 연속이기만 하다고 합시다. 닫힌 유계 구간에서 연속인 함수는 균등 연속이므로, $\varepsilon>0$에 대해 $\delta>0$이 있어 $\lvert x-x'\rvert\le\delta$이면 $\lvert g(x)-g(x')\rvert\le\varepsilon$입니다. $(b-a)/n\le\delta$인 자연수 $n$을 잡고 등간격 점 $\tau_k=a+k\frac{b-a}n$ ($k=0,\dots,n$)을 둡니다.

**4. 꺾은선 보간.** $L$을 점 $(\tau_k,g(\tau_k))$들을 차례로 이은 꺾은선이라 합시다. $x\in[\tau_k,\tau_{k+1}]$이면 어떤 $\theta\in[0,1]$에 대해 $x=(1-\theta)\tau_k+\theta\tau_{k+1}$이고 $L(x)=(1-\theta)g(\tau_k)+\theta g(\tau_{k+1})$입니다. $g(x)=(1-\theta)g(x)+\theta g(x)$로 쓰고 삼각부등식을 쓰면
$$\begin{aligned}\lvert L(x)-g(x)\rvert\le&\ (1-\theta)\lvert g(\tau_k)-g(x)\rvert\\&+\theta\lvert g(\tau_{k+1})-g(x)\rvert\le\varepsilon\end{aligned}$$
입니다. 마지막 부등식은 $\lvert\tau_k-x\rvert,\ \lvert\tau_{k+1}-x\rvert\le\delta$와 3단계에서 옵니다.

**5. 결론.** $L$은 연속이고 각 $[\tau_k,\tau_{k+1}]$에서 일차함수이므로 1·2단계에 의해 은닉 유닛 $n$개의 ReLU 신경망 $F=L$로 정확히 쓸 수 있고, $\max_{[a,b]}\lvert F-g\rvert\le\varepsilon$입니다.`,
    note: R`일반적인 보편 근사 정리(여러 차원, 다항식이 아닌 임의의 활성화)는 훨씬 깊은 해석학이 필요하지만, 1차원 ReLU에서는 “꺾는 점 하나 = 유닛 하나”라는 위 계산이 전부입니다. 거꾸로 은닉 유닛 $v_j\ReLU(a_jx+c_j)$ 하나는 꺾이는 점이 많아야 하나($a_j\ne0$이면 $x=-c_j/a_j$)이므로, 유닛이 $m$개인 1층 신경망은 많아야 $m+1$개의 일차 조각을 가집니다. 8.5절의 톱니 함수를 $k$번 합성한 함수는 $[0,1]$에서 $2^k$개의 조각을 가지므로 1층으로 만들려면 유닛이 $2^k-1$개 이상 필요하지만, $k$층으로는 층마다 유닛 2개면 됩니다(깊이의 이득).` },
  );

  // ───── roadmaps
  Object.assign(EM.plans, {
    'ch05-gausslogit': {
      easy: R`보일 것은 클래스별 분포가 공분산이 같은 가우시안일 때 사후확률이 정확히 $\sigma(w^Tx+b)$ 꼴이라는 것입니다. 베이즈 정리로 사후확률을 쓰면 언제나 “사후 로그 오즈의 시그모이드”가 되므로, 남은 일은 그 로그 오즈가 $x$의 일차식임을 보이는 것뿐입니다.

핵심 요령은 가우시안 밀도의 로그가 $x$의 이차식이라는 점입니다. 두 클래스의 공분산이 같으면 이차항 $x^T\Sigma^{-1}x$와 정규화 상수가 두 로그에서 똑같아 차를 취할 때 지워지고, 일차항과 상수만 남습니다.`,
      easyEn: R`We must show that when the class conditionals are Gaussians with a common covariance, the posterior has exactly the form $\sigma(w^Tx+b)$. Writing the posterior with Bayes' rule always gives “the sigmoid of the posterior log odds”, so what remains is to show that this log odds is linear in $x$.

The key trick is that the log of a Gaussian density is quadratic in $x$. With equal covariances, the quadratic term $x^T\Sigma^{-1}x$ and the normalizing constant are the same in both logs and cancel in the difference, leaving only a linear term and a constant.`,
      nodes: [
        { id: 'bayes', at: '**1. 베이즈 정리.**', t: R`사후확률 = 로그 오즈의 시그모이드`, en: R`Posterior = sigmoid of log odds`,
          d: R`베이즈 정리로 쓴 사후확률을 $\pi f_1$로 나누면 $\sigma(a(x))$이고, $a(x)$가 사후 로그 오즈임을 확인합니다.`,
          dEn: R`Dividing the Bayes posterior by $\pi f_1$ gives $\sigma(a(x))$, and $a(x)$ is the posterior log odds.` },
        { id: 'const', at: '**2. 정규화 상수의 약분.**', t: R`정규화 상수가 약분됨`, en: R`Normalizing constants cancel`,
          d: R`공분산이 같으므로 두 밀도의 분모가 같아, 로그 가능도비는 지수 안의 이차형식 차 $-\frac12Q_1+\frac12Q_0$뿐입니다.`,
          dEn: R`With a common covariance the two denominators agree, so the log likelihood ratio is just $-\frac12Q_1+\frac12Q_0$.` },
        { id: 'quad', at: '**3. 이차항의 소거.**', t: R`이차항이 지워짐`, en: R`The quadratic term cancels`,
          d: R`$\Sigma^{-1}$의 대칭성으로 $Q_k$를 전개하면 $x^T\Sigma^{-1}x$의 계수가 $-\frac12+\frac12=0$이 되어 일차항과 상수만 남습니다.`,
          dEn: R`Expanding $Q_k$ with the symmetry of $\Sigma^{-1}$, the coefficient of $x^T\Sigma^{-1}x$ is $-\frac12+\frac12=0$; only linear and constant terms remain.` },
        { id: 'end', at: '**4. 결론.**', t: R`$w$와 $b$ 읽어 내기`, en: R`Read off $w$ and $b$`,
          d: R`일차항의 계수를 전치해 $w=\Sigma^{-1}(\mu_1-\mu_0)$, 나머지 상수가 $b$이며, 절편을 흡수하면 5.2절의 모델과 같습니다.`,
          dEn: R`Transposing the linear coefficient gives $w=\Sigma^{-1}(\mu_1-\mu_0)$, the rest is $b$, and absorbing the intercept gives the model of Section 5.2.` },
      ],
    },
    'ch05-separable': {
      easy: R`두 가지를 보입니다. 자료가 직선(초평면)으로 완벽히 나뉘면 손실을 얼마든지 0에 가깝게 만들 수 있지만 0이 되지는 않으므로 최소점이 없다는 것, 그리고 $\frac\lambda2\lVert w\rVert^2$을 더하면 최소점이 꼭 하나 생긴다는 것입니다.

앞부분의 요령은 분리 방향 $\bar w$를 점점 키우는 것입니다. 모든 표본의 마진이 양수라 손실이 0으로 줄어듭니다. 뒷부분은 규제항이 멀리 가는 것을 막아(존재) 손실을 엄격히 둥글게 만든다(유일)는 두 단계입니다.`,
      easyEn: R`Two things are shown. When the data are perfectly split by a hyperplane, the loss can be made as close to 0 as we like but never reaches 0, so there is no minimizer; and adding $\frac\lambda2\lVert w\rVert^2$ creates exactly one minimizer.

The trick for the first part is to scale up a separating direction $\bar w$: every sample has a positive margin, so the loss shrinks to 0. The second part has two steps: the penalty stops $w$ from running away (existence) and makes the loss strictly curved (uniqueness).`,
      nodes: [
        { id: 'pos', at: '**1. 표본 손실은 양수.**', g: R`(i) 분리 가능하면 최소점이 없다`, gEn: R`(i) Separable data: no minimizer`, t: R`손실은 항상 양수`, en: R`The loss is always positive`,
          d: R`레이블 $\pm1$로 쓰면 표본 손실은 $\log(1+e^{-t_iz_i})>0$이므로 어떤 $w$에서도 $J>0$입니다.`,
          dEn: R`With labels $\pm1$ each sample loss is $\log(1+e^{-t_iz_i})>0$, so $J>0$ for every $w$.` },
        { id: 'scale', at: '**2. 분리 방향으로 늘리기.**', t: R`분리 방향으로 키우면 0으로`, en: R`Scaling the separator drives it to 0`,
          d: R`모든 마진 $m_i>0$이라 $J(c\bar w)=\sum\log(1+e^{-cm_i})\to0$이므로 하한이 0입니다.`,
          dEn: R`All margins $m_i>0$, so $J(c\bar w)=\sum\log(1+e^{-cm_i})\to0$ and the infimum is 0.` },
        { id: 'none', at: '**3. 최소점과 정류점이 없음.**', t: R`하한이 달성되지 않음`, en: R`The infimum is not attained`,
          d: R`최솟값이 있다면 0이어야 하지만 $J>0$이라 모순이고, 볼록성 때문에 정류점도 있을 수 없습니다.`,
          dEn: R`A minimum would have to be 0, contradicting $J>0$; by convexity there is no stationary point either.` },
        { id: 'exist', at: '**4. 규제: 존재.**', g: R`(ii) 규제하면 해가 하나`, gEn: R`(ii) Regularized: exactly one solution`, t: R`규제가 멀리 가는 것을 막음`, en: R`The penalty keeps $w$ bounded`,
          d: R`$J_\lambda\ge\frac\lambda2\lVert w\rVert^2$이라 최소점 후보는 유계인 닫힌 공 안에 있고, 연속함수는 그 위에서 최솟값을 가집니다.`,
          dEn: R`Since $J_\lambda\ge\frac\lambda2\lVert w\rVert^2$, candidates lie in a closed bounded ball, where a continuous function attains its minimum.` },
        { id: 'uniq', at: '**5. 규제: 유일.**', t: R`중점이 더 낮음`, en: R`The midpoint is lower`,
          d: R`중점 항등식과 볼록성으로 $J_\lambda$의 중점 값이 평균보다 $\frac\lambda8\lVert u-v\rVert^2$ 이상 작으므로 두 최소점이 있을 수 없습니다.`,
          dEn: R`The midpoint identity and convexity put $J_\lambda$ at the midpoint at least $\frac\lambda8\lVert u-v\rVert^2$ below the average, so two minimizers cannot exist.` },
      ],
    },
    'ch06-lse': {
      easy: R`로그-합-지수 $\log\sum e^{z_j}$가 최댓값 $\max z_j$의 매끄러운 근사라는 것을 네 가지로 보입니다: 최댓값과 $\log C$ 이상 차이 나지 않고, 기울기가 소프트맥스이며, 온도를 낮추면 최댓값과 argmax로 수렴하고, 온도를 높이면 균등분포가 됩니다.

모든 것은 한 가지 관찰에서 나옵니다. 합 $\sum e^{z_j}$는 가장 큰 항 $e^M$ 이상, 그 $C$배 이하입니다. 온도 부분은 이 부등식을 $z/T$에 적용하거나, 분자·분모에서 $e^{M/T}$를 덜어 내 각 항의 지수 $(z_k-M)/T$의 부호를 보면 됩니다.`,
      easyEn: R`We show in four ways that log-sum-exp $\log\sum e^{z_j}$ is a smooth version of the maximum $\max z_j$: it is within $\log C$ of the maximum, its gradient is the softmax, lowering the temperature drives it to the maximum and the argmax, and raising the temperature gives the uniform distribution.

Everything comes from one observation: the sum $\sum e^{z_j}$ is at least its largest term $e^M$ and at most $C$ times it. The temperature parts apply this to $z/T$, or factor $e^{M/T}$ out of numerator and denominator and look at the sign of each exponent $(z_k-M)/T$.`,
      nodes: [
        { id: 'bound', at: '**(i) 범위.**', t: R`가장 큰 항으로 위아래 누르기`, en: R`Squeeze by the largest term`,
          d: R`$e^M<\sum e^{z_j}\le Ce^M$에 로그를 취하고, 등호 조건을 따집니다.`,
          dEn: R`Take logs of $e^M<\sum e^{z_j}\le Ce^M$ and track when equality holds.` },
        { id: 'grad', at: '**(ii) 기울기.**', t: R`기울기는 소프트맥스`, en: R`The gradient is the softmax`,
          d: R`$\log Z$를 연쇄법칙으로 미분하면 $e^{z_k}/Z=p_k$입니다.`,
          dEn: R`Differentiating $\log Z$ by the chain rule gives $e^{z_k}/Z=p_k$.` },
        { id: 'temp', at: '**(iii) 온도와 최댓값.**', t: R`낮은 온도에서 최댓값으로`, en: R`To the maximum at low temperature`,
          d: R`(i)을 $z/T$에 적용하고 $T$를 곱한 뒤 조임 정리를 씁니다.`,
          dEn: R`Apply (i) to $z/T$, multiply by $T$, and use the squeeze theorem.` },
        { id: 'arg', at: '**(iv) 온도와 소프트맥스.**', t: R`argmax와 균등분포`, en: R`Argmax and uniform`,
          d: R`$e^{M/T}$를 덜어 내면 최댓값 성분의 항은 1, 나머지는 $T\to0^+$에서 0, $T\to\infty$에서 1로 갑니다.`,
          dEn: R`After factoring out $e^{M/T}$, the maximal terms are 1 and the others go to 0 as $T\to0^+$ and to 1 as $T\to\infty$.` },
      ],
    },
    'ch06-regunique': {
      easy: R`소프트맥스 회귀의 손실은 볼록이지만, 모든 클래스의 점수를 똑같이 올리는 방향으로는 전혀 변하지 않습니다. 이 정리는 그 평평한 방향이 정확히 하나($\mathbf 1$)뿐이고, 그 때문에 규제 없이는 해가 유일할 수 없으며, $L_2$ 규제를 넣으면 해가 꼭 하나 생기고 그 해는 클래스 가중치의 합이 0인 것임을 보입니다.

영공간은 성분 $(Hv)_k=p_k(v_k-\bar v)$를 직접 계산하면 나옵니다. 규제된 해는 “멀리 가면 커진다(존재) + 엄격히 볼록(유일)”로 얻고, 마지막으로 평평한 방향을 따라 움직여 봐서 규제항만 바뀐다는 점을 이용해 합이 0임을 끌어냅니다.`,
      easyEn: R`The softmax regression loss is convex, but it does not change at all in the direction that raises every class score equally. This theorem shows that this flat direction ($\mathbf 1$) is the only one, that because of it the solution cannot be unique without regularization, and that with $L_2$ regularization there is exactly one solution, the one whose class weights sum to zero.

The null space comes from computing the entries $(Hv)_k=p_k(v_k-\bar v)$ directly. The regularized solution comes from “it grows far away (existence) + strictly convex (uniqueness)”, and finally moving along the flat direction, where only the penalty changes, forces the sum to be zero.`,
      nodes: [
        { id: 'null', at: '**(i) 영공간.**', t: R`평평한 방향은 $\mathbf 1$뿐`, en: R`The only flat direction is $\mathbf 1$`,
          d: R`$(Hv)_k=p_k(v_k-\bar v)$와 $v^THv=\sum p_k(v_k-\bar v)^2$에서 두 조건이 모두 “성분이 모두 같음”과 같습니다.`,
          dEn: R`From $(Hv)_k=p_k(v_k-\bar v)$ and $v^THv=\sum p_k(v_k-\bar v)^2$, both conditions mean “all entries are equal”.` },
        { id: 'shift', at: '**(ii) 한 방향의 불변성.**', t: R`가중치를 같이 옮겨도 손실이 같음`, en: R`Shifting all weights keeps the loss`,
          d: R`모든 행에 $u$를 더하면 점수가 같은 수만큼 움직여 확률이 그대로이므로 최소점이 유일할 수 없습니다.`,
          dEn: R`Adding $u$ to every row moves all scores by the same amount, so the probabilities stay and a minimizer cannot be unique.` },
        { id: 'exist', at: '**(iii-1) 존재.**', g: R`(iii) 규제된 문제`, gEn: R`(iii) The regularized problem`, t: R`존재`, en: R`Existence`,
          d: R`$J\ge0$이라 $J_\lambda\ge\frac\lambda2\lVert W\rVert_F^2$이고, 닫힌 공 위의 연속함수가 최솟값을 가집니다.`,
          dEn: R`$J\ge0$ gives $J_\lambda\ge\frac\lambda2\lVert W\rVert_F^2$, and a continuous function on a closed ball attains its minimum.` },
        { id: 'uniq', at: '**(iii-2) 유일.**', t: R`유일`, en: R`Uniqueness`,
          d: R`볼록성과 중점 항등식으로 두 최소점의 중점이 더 낮아져 모순입니다.`,
          dEn: R`Convexity and the midpoint identity make the midpoint of two minimizers lower, a contradiction.` },
        { id: 'sum', at: '**(iii-3) 행의 합이 0.**', t: R`규제가 고르는 대표`, en: R`The representative chosen by the penalty`,
          d: R`평평한 방향 $W^*+\mathbf 1u^T$로 움직이면 규제항만 $\lambda u^Ts+\frac{\lambda C}2\lVert u\rVert^2$만큼 바뀌므로, 최소점이려면 $s=0$이어야 합니다.`,
          dEn: R`Along the flat direction $W^*+\mathbf 1u^T$ only the penalty changes, by $\lambda u^Ts+\frac{\lambda C}2\lVert u\rVert^2$, so a minimizer needs $s=0$.` },
      ],
    },
    'ch07-hyperplane': {
      easy: R`초평면 $x^Tw+b=0$에 대한 세 가지 기본 사실을 보입니다: $w$는 평면에 수직이고(원점까지 거리 $\lvert b\rvert/\lVert w\rVert$), $f(x)=x^Tw+b$의 부호가 점이 평면의 어느 쪽에 있는지 알려 주며, 레이블 $\pm1$에서는 $y_if(x_i)>0$이 곧 “맞게 분류함”입니다.

요령은 모든 점을 “평면 위의 점 + 법선 방향으로 $t$만큼”으로 쪼개는 것입니다. $f$를 취하면 평면 위의 점에서는 0이 되므로 $f(x)=t\lVert w\rVert$, 즉 $f$의 부호가 $t$의 부호, 곧 어느 쪽인지를 정합니다.`,
      easyEn: R`Three basic facts about the hyperplane $x^Tw+b=0$ are shown: $w$ is perpendicular to it (and the origin is at distance $\lvert b\rvert/\lVert w\rVert$), the sign of $f(x)=x^Tw+b$ tells which side of the plane a point is on, and with labels $\pm1$, $y_if(x_i)>0$ means exactly “classified correctly”.

The trick is to split every point into “a point on the plane + $t$ along the normal”. Applying $f$ kills the point on the plane, so $f(x)=t\lVert w\rVert$: the sign of $f$ is the sign of $t$, which is the side.`,
      nodes: [
        { id: 'normal', at: '**(i) 법선과 원점까지의 거리.**', t: R`법선과 원점까지의 거리`, en: R`Normal and distance to the origin`,
          d: R`평면 위 두 점의 차에 $w$가 수직임을 보이고, $x_0\parallel w$가 원점에서 가장 가까운 점임을 피타고라스 정리로 확인합니다.`,
          dEn: R`Show $w$ is perpendicular to differences of points on the plane, and check with Pythagoras that $x_0\parallel w$ is the point nearest the origin.` },
        { id: 'exist', at: '**(ii) 분해의 존재.**', t: R`평면 위의 점 + 법선 방향`, en: R`Point on the plane + normal part`,
          d: R`$t=f(x)/\lVert w\rVert$만큼 법선 방향으로 되돌아가면 평면 위에 떨어집니다.`,
          dEn: R`Stepping back by $t=f(x)/\lVert w\rVert$ along the normal lands on the plane.` },
        { id: 'unique', at: '**(ii) 분해의 유일성.**', t: R`분해는 하나뿐`, en: R`The split is unique`,
          d: R`$f$를 취하면 $f(x)=t\lVert w\rVert$라 $t$와 $x_H$가 $x$로 정해집니다.`,
          dEn: R`Applying $f$ gives $f(x)=t\lVert w\rVert$, so $t$ and $x_H$ are fixed by $x$.` },
        { id: 'side', at: '**(ii) 두 쪽.**', t: R`부호 = 쪽`, en: R`Sign = side`,
          d: R`$t$의 부호가 $f(x)$의 부호와 같으므로 $f>0$인 점은 $w$ 쪽, $f<0$인 점은 반대쪽입니다.`,
          dEn: R`The sign of $t$ equals that of $f(x)$, so $f>0$ is the side $w$ points to and $f<0$ the other.` },
        { id: 'label', at: '**(iii) 분류 조건.**', t: R`$y_if(x_i)>0$ = 맞음`, en: R`$y_if(x_i)>0$ = correct`,
          d: R`부호가 같으면 곱이 양수이므로 “맞음”과 $y_if(x_i)>0$은 같은 말입니다.`,
          dEn: R`Equal signs make the product positive, so “correct” and $y_if(x_i)>0$ say the same thing.` },
      ],
    },
    'ch07-softmargin': {
      easy: R`소프트 마진 SVM이 두 얼굴을 가진다는 것을 보입니다. 하나는 “힌지 손실 + $L_2$ 규제”라는 손실 최소화이고, 다른 하나는 하드 마진과 거의 같은 쌍대 문제(승수에 상한 $C$가 붙음)입니다.

앞의 것은 여유 변수 $\xi_i$를 할 수 있는 만큼 작게 고르면 정확히 힌지 값이 된다는 관찰입니다. 뒤의 것은 라그랑지안이 $\xi_i$에 대해 일차식이라, 쌍대 함수가 $-\infty$가 되지 않으려면 $\xi_i$의 계수가 0이어야 한다는 데서 상한 $\alpha_i\le C$가 나옵니다.`,
      easyEn: R`We show that the soft margin SVM has two faces. One is loss minimization, “hinge loss + $L_2$ regularization”; the other is a dual problem almost identical to the hard margin one, with an upper bound $C$ on the multipliers.

The first comes from choosing each slack $\xi_i$ as small as allowed, which is exactly the hinge value. The second: the Lagrangian is linear in $\xi_i$, so for the dual function not to be $-\infty$ the coefficient of $\xi_i$ must vanish, and that gives the bound $\alpha_i\le C$.`,
      nodes: [
        { id: 'slack', at: '**1. 여유 변수의 소거.**', g: R`(i) 힌지 손실 + 규제`, gEn: R`(i) Hinge loss + regularization`, t: R`최적 여유 변수 = 힌지`, en: R`Optimal slack = hinge`,
          d: R`두 제약을 합치면 $\xi_i\ge\max(0,1-m_i)$이고, 목적함수가 $\xi_i$에 대해 증가하므로 하한에서 최소입니다.`,
          dEn: R`Combining the two constraints gives $\xi_i\ge\max(0,1-m_i)$, and the objective increases in $\xi_i$, so the minimum is at the bound.` },
        { id: 'hinge', at: '**2. 힌지 꼴.**', t: R`두 문제의 최적해가 같음`, en: R`Same optimal solutions`,
          d: R`$\xi$를 먼저 최소화하면 힌지 손실 문제가 되고, 최적해가 서로 옮겨 갑니다.`,
          dEn: R`Minimizing over $\xi$ first leaves the hinge loss problem, and optimal solutions carry over both ways.` },
        { id: 'lag', at: '**3. 라그랑지안.**', g: R`(ii) 쌍대 문제`, gEn: R`(ii) The dual problem`, t: R`라그랑지안 = 하드 마진 + $\xi$ 항`, en: R`Lagrangian = hard margin + $\xi$ terms`,
          d: R`승수 $\alpha,\mu$를 붙이고 $\xi_i$ 항을 모으면 $L=L_p+\sum(C-\alpha_i-\mu_i)\xi_i$입니다.`,
          dEn: R`Attach multipliers $\alpha,\mu$ and collect the $\xi_i$ terms: $L=L_p+\sum(C-\alpha_i-\mu_i)\xi_i$.` },
        { id: 'xi', at: '**4. 여유 변수에 대한 최소화.**', t: R`일차식이라 계수가 0이어야 함`, en: R`Linear, so the coefficient must vanish`,
          d: R`$\xi_i$의 계수가 0이 아니면 하한이 $-\infty$이므로 $\mu_i=C-\alpha_i$가 강제됩니다.`,
          dEn: R`A nonzero coefficient of $\xi_i$ sends the infimum to $-\infty$, which forces $\mu_i=C-\alpha_i$.` },
        { id: 'dual', at: '**5. 쌍대 문제.**', t: R`상한 $C$가 붙은 쌍대`, en: R`The dual with the bound $C$`,
          d: R`나머지는 하드 마진과 같고, $\mu_i\ge0$이 $\alpha_i\le C$가 됩니다.`,
          dEn: R`The rest is the hard margin computation, and $\mu_i\ge0$ becomes $\alpha_i\le C$.` },
      ],
    },
    'ch07-kkt': {
      easy: R`쌍대 문제를 풀어 얻은 후보 $(w^*,b^*,\alpha^*)$가 네 가지 KKT 조건을 만족하면, 그것이 정말 원문제와 쌍대 문제의 답이고 두 값이 같다는 것을 보입니다.

요령은 $\alpha^*$를 고정한 라그랑지안을 완전제곱 $\frac12\lVert w-w^*\rVert^2+\text{상수}$로 쓰는 것입니다. 그러면 $(w^*,b^*)$가 라그랑지안의 최소점이고, 상보성이 그 최솟값을 $\frac12\lVert w^*\rVert^2$로 만들며, 실현가능한 점에서는 벌점 항이 0 이하라서 원래 목적함수가 라그랑지안보다 크거나 같습니다.`,
      easyEn: R`We show that if a candidate $(w^*,b^*,\alpha^*)$, for instance one obtained by solving the dual, satisfies the four KKT conditions, then it really solves the primal and the dual problems, and the two values agree.

The trick is to write the Lagrangian with $\alpha^*$ fixed as a perfect square $\frac12\lVert w-w^*\rVert^2+\text{const}$. Then $(w^*,b^*)$ minimizes the Lagrangian, complementary slackness makes that minimum $\frac12\lVert w^*\rVert^2$, and at feasible points the penalty term is at most 0, so the true objective is at least the Lagrangian.`,
      nodes: [
        { id: 'square', at: '**1. 라그랑지안의 최소점.**', t: R`라그랑지안을 완전제곱으로`, en: R`Complete the square in the Lagrangian`,
          d: R`정류성을 넣으면 $L_p(w,b,\alpha^*)=\frac12\lVert w-w^*\rVert^2+\text{상수}$라 $w=w^*$에서 최소입니다.`,
          dEn: R`With stationarity, $L_p(w,b,\alpha^*)=\frac12\lVert w-w^*\rVert^2+\text{const}$, minimized at $w=w^*$.` },
        { id: 'value', at: '**2. 그 최솟값.**', t: R`상보성이 값을 정함`, en: R`Complementarity fixes the value`,
          d: R`상보성으로 벌점 항이 모두 0이라 최솟값은 $\frac12\lVert w^*\rVert^2$입니다.`,
          dEn: R`Complementary slackness kills every penalty term, so the minimum is $\frac12\lVert w^*\rVert^2$.` },
        { id: 'primal', at: '**3. 원문제의 최적성.**', t: R`원문제의 답`, en: R`Primal optimality`,
          d: R`실현가능한 점에서는 $\frac12\lVert w\rVert^2\ge L_p\ge\frac12\lVert w^*\rVert^2$이고, 등호 조건에서 $w$의 유일성도 나옵니다.`,
          dEn: R`At feasible points $\frac12\lVert w\rVert^2\ge L_p\ge\frac12\lVert w^*\rVert^2$, and the equality case gives uniqueness of $w$.` },
        { id: 'dual', at: '**4. 쌍대 문제의 최적성.**', t: R`쌍대 문제의 답`, en: R`Dual optimality`,
          d: R`모든 $\alpha\ge0$에서 $D(\alpha)\le L_p(w^*,b^*,\alpha)\le\frac12\lVert w^*\rVert^2=D(\alpha^*)$입니다.`,
          dEn: R`For every $\alpha\ge0$, $D(\alpha)\le L_p(w^*,b^*,\alpha)\le\frac12\lVert w^*\rVert^2=D(\alpha^*)$.` },
      ],
    },
    'ch07-twopoint': {
      easy: R`Problem Set 1 문제 3의 답 $w^*=(\frac12,\frac12)$, $b^*=-1$, $\alpha^*=(\frac14,\frac14)$, 마진 $\sqrt2$가 옳고, 원문제의 답이 이것 하나뿐임을 보입니다.

먼저 원문제를 직접 아래에서 누릅니다. 두 제약을 더하면 $w_1+w_2\ge1$이고, 그러면 $\lVert w\rVert^2$이 $\frac12$보다 작을 수 없으며 등호가 되는 점은 하나뿐입니다. 그다음 쌍대 문제를 풀어 같은 값 $\frac14$이 나오는 것을 확인하면 강한 쌍대성과 서포트 벡터까지 한꺼번에 확인됩니다.`,
      easyEn: R`We show that the answer to Problem Set 1, Problem 3, $w^*=(\frac12,\frac12)$, $b^*=-1$, $\alpha^*=(\frac14,\frac14)$, margin $\sqrt2$, is correct, and that the primal answer is the only one.

First bound the primal directly from below: adding the two constraints gives $w_1+w_2\ge1$, so $\lVert w\rVert^2$ cannot be below $\frac12$, with exactly one point attaining it. Then solving the dual and getting the same value $\frac14$ confirms strong duality and the support vectors at once.`,
      nodes: [
        { id: 'cons', at: '**1. 제약 풀어 쓰기.**', g: R`원문제를 직접 풀기`, gEn: R`Solve the primal directly`, t: R`제약 두 개`, en: R`The two constraints`,
          d: R`$x_1=0$이라 제약은 $-b\ge1$과 $2w_1+2w_2+b\ge1$입니다.`,
          dEn: R`Since $x_1=0$, the constraints are $-b\ge1$ and $2w_1+2w_2+b\ge1$.` },
        { id: 'lower', at: '**2. 원문제의 하한.**', t: R`아래에서 누르기`, en: R`Bound from below`,
          d: R`제약을 더해 $w_1+w_2\ge1$, $(w_1-w_2)^2\ge0$으로 $\frac12\lVert w\rVert^2\ge\frac14$.`,
          dEn: R`Adding the constraints gives $w_1+w_2\ge1$, and $(w_1-w_2)^2\ge0$ gives $\frac12\lVert w\rVert^2\ge\frac14$.` },
        { id: 'eq', at: '**3. 등호와 유일성.**', t: R`등호가 되는 점은 하나`, en: R`One point attains equality`,
          d: R`등호 조건에서 $w=(\frac12,\frac12)$, 두 제약에서 $b=-1$이 강제됩니다.`,
          dEn: R`The equality conditions force $w=(\frac12,\frac12)$, and the two constraints force $b=-1$.` },
        { id: 'dualfn', at: '**4. 쌍대 함수.**', g: R`쌍대 문제로 확인`, gEn: R`Confirm with the dual`, t: R`쌍대 함수`, en: R`Dual function`,
          d: R`$b$의 계수에서 $\alpha_1=\alpha_2$, $w$에 대한 완전제곱에서 $g=\alpha_1+\alpha_2-4\alpha_2^2$.`,
          dEn: R`The coefficient of $b$ forces $\alpha_1=\alpha_2$; completing the square in $w$ gives $g=\alpha_1+\alpha_2-4\alpha_2^2$.` },
        { id: 'dualsol', at: '**5. 쌍대 문제의 해.**', t: R`최적 승수`, en: R`Optimal multipliers`,
          d: R`$2\alpha-4\alpha^2=\frac14-4(\alpha-\frac14)^2$에서 $\alpha^*=\frac14$이고 $w$가 $w^*$로 복원됩니다.`,
          dEn: R`From $2\alpha-4\alpha^2=\frac14-4(\alpha-\frac14)^2$, $\alpha^*=\frac14$, and $w$ is recovered as $w^*$.` },
        { id: 'strong', at: '**6. 강한 쌍대성과 상보성.**', t: R`두 값이 같음`, en: R`The values agree`,
          d: R`쌍대 값과 원문제 값이 $\frac14$로 같고, 두 점 모두 서포트 벡터입니다.`,
          dEn: R`Dual and primal values are both $\frac14$, and both points are support vectors.` },
        { id: 'margin', at: '**7. 초평면과 마진.**', t: R`초평면과 마진`, en: R`Hyperplane and margin`,
          d: R`$x_1+x_2=2$, 마진 $1/\lVert w^*\rVert=\sqrt2$, 폭 $2\sqrt2$.`,
          dEn: R`$x_1+x_2=2$, margin $1/\lVert w^*\rVert=\sqrt2$, width $2\sqrt2$.` },
      ],
    },
    'ch08-embedding': {
      easy: R`원 안의 점과 바깥 고리의 점은 입력 공간에서 어떤 직선으로도 나눌 수 없지만, 셋째 좌표 $x_1^2+x_2^2$을 덧붙여 3차원으로 들어 올리면 평면 하나로 나뉜다는 것을 보입니다. 은닉층이 하는 일(선형 분리 가능한 공간으로의 임베딩)의 가장 작은 모형입니다.

불가능 쪽의 요령은 “일차식은 볼록결합을 보존한다”입니다. 두 클래스의 볼록결합이 같은 점에서 만나면, 그 점에서 일차식의 값이 동시에 양수이고 음수여야 합니다. 가능 쪽은 들어 올린 공간의 높이 $\lVert x\rVert^2$을 두 반지름의 제곱 사이에서 자르면 됩니다.`,
      easyEn: R`Points inside a circle and points on an outer ring cannot be split by any line in the input space, yet after lifting to three dimensions with the extra coordinate $x_1^2+x_2^2$ one plane splits them. This is the smallest model of what a hidden layer does (embedding into a linearly separable space).

The trick for impossibility is that “an affine function preserves convex combinations”: if convex combinations of the two classes meet at one point, the affine function would have to be both positive and negative there. For possibility, cut the lifted height $\lVert x\rVert^2$ between the two squared radii.`,
      nodes: [
        { id: 'conv', at: '**(i) 볼록결합은 일차식의 부호를 보존한다.**', t: R`입력 공간에서는 불가능`, en: R`Impossible in the input space`,
          d: R`만나는 점 $x^\circ$에서 $f(x^\circ)$가 $D_+$ 값들의 가중평균이자 $D_-$ 값들의 가중평균이라 부호가 모순됩니다.`,
          dEn: R`At the meeting point $x^\circ$, $f(x^\circ)$ is a weighted average of the $D_+$ values and of the $D_-$ values, so the signs contradict.` },
        { id: 'lift', at: '**(ii) 들어 올린 공간의 평면.**', t: R`들어 올리면 평면 하나로`, en: R`One plane after lifting`,
          d: R`$v^T\varphi(x)+c=-\lVert x\rVert^2+\frac{r_1^2+r_2^2}2$가 안쪽에서 양수, 바깥에서 음수입니다.`,
          dEn: R`$v^T\varphi(x)+c=-\lVert x\rVert^2+\frac{r_1^2+r_2^2}2$ is positive inside and negative outside.` },
        { id: 'back', at: '**(iii) 입력 공간으로 되돌리기.**', t: R`입력 공간에서는 원`, en: R`A circle in the input space`,
          d: R`들어 올린 공간의 평면을 되돌리면 두 반지름 사이의 원이 결정 경계가 됩니다.`,
          dEn: R`Pulled back, the plane in the lifted space becomes a circle between the two radii.` },
      ],
    },
    'ch08-relu1d': {
      easy: R`은닉층이 하나인 ReLU 신경망이 1차원에서 무엇을 할 수 있는지 보입니다. 꺾인 곳이 유한한 연속 꺾은선은 정확히 표현하고, 그 결과 닫힌 구간 위의 어떤 연속함수든 원하는 만큼 가깝게 근사합니다(1차원 보편 근사).

요령은 유닛 $\ReLU(x-t)$ 하나가 $t$에서 기울기를 “켜는” 스위치라는 것입니다. 꺾는 점마다 유닛 하나를 두고 출력 가중치를 기울기의 변화량으로 주면 꺾은선이 됩니다. 연속함수는 촘촘한 점들을 이은 꺾은선으로 근사하는데, 균등 연속성이 오차를 모든 구간에서 한꺼번에 $\varepsilon$ 아래로 묶어 줍니다.`,
      easyEn: R`We show what a ReLU network with one hidden layer can do in one dimension. It represents every continuous polyline with finitely many corners exactly, and as a result approximates any continuous function on a closed interval as closely as we like (one-dimensional universal approximation).

The trick is that one unit $\ReLU(x-t)$ is a switch that “turns on” slope at $t$. One unit per corner, with output weight equal to the change of slope, gives the polyline. A continuous function is approximated by the polyline through closely spaced points, and uniform continuity bounds the error below $\varepsilon$ on all pieces at once.`,
      nodes: [
        { id: 'slope', at: '**1. 각 조각에서의 기울기.**', g: R`(i) 꺾은선은 정확히 표현됨`, gEn: R`(i) Polylines are represented exactly`, t: R`조각마다 기울기 계산`, en: R`Slope on each piece`,
          d: R`$[t_j,t_{j+1}]$에서는 앞쪽 유닛만 켜져 있어 기울기가 망원급수로 $s_j$가 됩니다.`,
          dEn: R`On $[t_j,t_{j+1}]$ only the earlier units are on, and the slope telescopes to $s_j$.` },
        { id: 'same', at: '**2. 같은 함수.**', t: R`왼쪽 끝부터 차례로 일치`, en: R`Agreement piece by piece from the left`,
          d: R`시작값과 각 조각의 기울기가 같으므로 귀납적으로 모든 조각에서 $F=g$입니다.`,
          dEn: R`Same starting value and same slope on each piece give $F=g$ on every piece by induction.` },
        { id: 'unif', at: '**3. 균등 연속.**', g: R`(ii) 연속함수의 근사`, gEn: R`(ii) Approximating continuous functions`, t: R`간격 정하기`, en: R`Choose the spacing`,
          d: R`균등 연속성으로 간격 $\delta$ 안에서는 함숫값이 $\varepsilon$ 이상 변하지 않게 점을 촘촘히 둡니다.`,
          dEn: R`By uniform continuity, place points so densely that values change by at most $\varepsilon$ within spacing $\delta$.` },
        { id: 'interp', at: '**4. 꺾은선 보간.**', t: R`꺾은선의 오차`, en: R`Error of the polyline`,
          d: R`꺾은선의 값은 양 끝 값의 가중평균이라 삼각부등식으로 오차가 $\varepsilon$ 이하입니다.`,
          dEn: R`The polyline value is a weighted average of the endpoint values, so the triangle inequality bounds the error by $\varepsilon$.` },
        { id: 'end', at: '**5. 결론.**', t: R`꺾은선을 신경망으로`, en: R`Turn the polyline into a network`,
          d: R`그 꺾은선을 (i)로 유닛 $n$개의 신경망으로 바꾸면 근사가 끝납니다.`,
          dEn: R`Turning that polyline into an $n$-unit network by (i) finishes the approximation.` },
      ],
    },
  });
})();
