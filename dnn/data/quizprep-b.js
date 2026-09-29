/* 퀴즈 대비 연습문제 (2) — 08–14단원. Problem Set 1과 같은 모양(정의 → 유도·증명 → 작은 계산 → 해석)으로 신경망 단원을 낸 문제입니다.
   manifest의 맨 끝에 두어 기존 문제 번호(저장된 풀이 기록)가 바뀌지 않게 합니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;

  EM.more.push({ n: 8, problems: [
    { sec: '8.4', type: 'open', lv: 2, proof: true, quiz: true, q: R`XOR: $(0,0)\mapsto0$, $(0,1)\mapsto1$, $(1,0)\mapsto1$, $(1,1)\mapsto0$.
1. 어떤 $w\in\mathbb R^2$, $b\in\mathbb R$로도 “$w^Tx+b\gt0\iff$ 출력이 1”이 네 점에서 모두 성립할 수 없음을 증명하시오.
2. ReLU 은닉 유닛 $h_1=\max(0,x_1+x_2)$, $h_2=\max(0,x_1+x_2-1)$과 출력 $o=h_1-2h_2$가 네 점에서 XOR 값을 정확히 냄을 확인하시오.
3. 은닉층이 만든 점 $(h_1,h_2)$의 공간에서 두 클래스가 선형 분리 가능함을 분리 직선을 하나 제시해 보이시오. “층을 쌓는 이유”와 연결해 설명하시오.`,
      sol: R`
**1.** 그런 $w,b$가 있다고 하자. 출력 1인 두 점에서 $w_2+b\gt0$, $w_1+b\gt0$; 더하면 $w_1+w_2+2b\gt0$. 출력 0인 두 점에서 $b\le0$, $w_1+w_2+b\le0$; 더하면 $w_1+w_2+2b\le0$. 모순. $\blacksquare$
**2.** $(0,0)$: $h=(0,0)$, $o=0$. $(0,1)$과 $(1,0)$: $h_1=1$, $h_2=\max(0,0)=0$, $o=1$. $(1,1)$: $h_1=2$, $h_2=1$, $o=2-2=0$.
**3.** 네 점의 상: $(0,0)\mapsto(0,0)$, $(0,1),(1,0)\mapsto(1,0)$, $(1,1)\mapsto(2,1)$. 직선 $h_1-2h_2-\frac12=0$에 대해 $(1,0)$은 $\frac12\gt0$, $(0,0)$과 $(2,1)$은 $-\frac12\lt0$ — 분리됩니다. 원래 공간에서 선형 분리가 불가능한 자료도 비선형 은닉층이 만든 새 좌표(임베딩)에서는 분리 가능해지고, 마지막 층의 선형 분류기가 그 일을 합니다.`,
      rubric: R`
- 모순 증명(부등식 네 개와 더하기) — 4점
- 네 점 확인 — 3점
- 임베딩 공간의 분리 직선과 해석 — 3점` },
  ] });

  EM.more.push({ n: 9, problems: [
    { sec: '9.6', type: 'open', lv: 3, proof: true, quiz: true, q: R`2층 신경망 $a=W_1x+b_1$, $h=\ReLU(a)$, $z=W_2h+b_2$, $p=\softmax(z)$, $L=-\sum_ky_k\log p_k$ ($y$는 원-핫).
1. $\delta_2:=\partial L/\partial z=p-y$임을 보이시오.
2. 연쇄법칙으로 $\dfrac{\partial L}{\partial W_2}=\delta_2h^T$, $\dfrac{\partial L}{\partial b_2}=\delta_2$, $\delta_1:=\dfrac{\partial L}{\partial a}=(W_2^T\delta_2)\odot\mathbb 1[a\gt0]$, $\dfrac{\partial L}{\partial W_1}=\delta_1x^T$를 유도하시오.
3. $x=(1,2)$, $W_1=\begin{pmatrix}1&-1\\0&1\end{pmatrix}$, $b_1=0$, $W_2=I$, $b_2=0$, 정답 클래스 1 ($y=(1,0)$)일 때 $p$, $L$, $\partial L/\partial W_1$을 구하시오. (소수 넷째 자리)`,
      sol: R`
**1.** $\sum_ky_k=1$이므로 $L=-\sum_ky_kz_k+\log\sum_je^{z_j}$. $\frac{\partial L}{\partial z_k}=-y_k+\frac{e^{z_k}}{\sum_je^{z_j}}=p_k-y_k$.
**2.** $z_k=\sum_j(W_2)_{kj}h_j+(b_2)_k$이므로 $\frac{\partial L}{\partial(W_2)_{kj}}=\delta_{2,k}h_j$ (행렬로 $\delta_2h^T$), $\frac{\partial L}{\partial(b_2)_k}=\delta_{2,k}$. $h_j$는 모든 $z_k$에 들어가므로 $\frac{\partial L}{\partial h_j}=\sum_k\delta_{2,k}(W_2)_{kj}=(W_2^T\delta_2)_j$. $h_j=\max(0,a_j)$의 도함수는 $\mathbb 1[a_j\gt0]$ ($a_j=0$에서는 관례로 0)이라 $\delta_1=(W_2^T\delta_2)\odot\mathbb 1[a\gt0]$. 마지막으로 $a_j=\sum_i(W_1)_{ji}x_i+(b_1)_j$에서 $\frac{\partial L}{\partial(W_1)_{ji}}=\delta_{1,j}x_i$.
**3.** $a=(1-2,\ 2)=(-1,2)$, $h=(0,2)$, $z=(0,2)$.
$$p=\Big(\frac1{1+e^2},\frac{e^2}{1+e^2}\Big)\approx(0.1192,\ 0.8808),\qquad L=\log(1+e^2)\approx2.1269.$$
$\delta_2=p-y\approx(-0.8808,\ 0.8808)$, $W_2^T\delta_2=\delta_2$, 마스크 $\mathbb 1[a\gt0]=(0,1)$이라 $\delta_1\approx(0,\ 0.8808)$.
$$\frac{\partial L}{\partial W_1}=\delta_1x^T\approx\begin{pmatrix}0&0\\0.8808&1.7616\end{pmatrix}.$$
첫 은닉 유닛은 꺼져 있어($a_1\lt0$) 그 행으로 기울기가 흐르지 않습니다.`,
      rubric: R`
- $\delta_2=p-y$ — 2점
- 네 기울기의 유도(ReLU 도함수 명시) — 4점
- 순전파 값 — 2점, 역전파 값 — 2점` },
  ] });

  EM.more.push({ n: 10, problems: [
    { sec: '10.2', type: 'open', lv: 2, proof: true, quiz: true, q: R`자료 $(x_i,y_i)=(1,1),(2,3),(3,2)$와 $f(\beta)=\frac13\sum_{i=1}^3\frac12(\beta x_i-y_i)^2$ ($\beta\in\mathbb R$).
1. 표본 하나를 균등하게 뽑아 쓰는 확률적 기울기 $g=(\beta x_I-y_I)x_I$ ($I$는 $\{1,2,3\}$에서 균등)가 $\E g=f'(\beta)$를 만족함을 보이시오.
2. $\beta=1$에서 $\Var(g)$를 구하시오.
3. 복원추출로 독립하게 뽑은 크기 $B$의 미니배치 평균 기울기 $\bar g_B$의 분산이 $\Var(g)/B$임을 증명하시오. $\beta=1$에서 표준편차를 $0.5$ 이하로 만들려면 $B$가 얼마 이상이어야 하는가?`,
      sol: R`
**1.** $\E g=\frac13\sum_i(\beta x_i-y_i)x_i$이고 $f'(\beta)=\frac13\sum_i(\beta x_i-y_i)x_i$. 같습니다(불편 추정량).
**2.** $\beta=1$: $g_1=(1-1)\cdot1=0$, $g_2=(2-3)\cdot2=-2$, $g_3=(3-2)\cdot3=3$. $\E g=\frac13$, $\E g^2=\frac{0+4+9}3=\frac{13}3$, $\Var g=\frac{13}3-\frac19=\frac{38}9\approx4.222$.
**3.** $\bar g_B=\frac1B\sum_{b=1}^Bg^{(b)}$, $g^{(b)}$는 i.i.d. 독립이라 공분산이 0이고
$$\Var\bar g_B=\frac1{B^2}\sum_b\Var g^{(b)}=\frac{B\Var g}{B^2}=\frac{\Var g}B.$$
표준편차 $\sqrt{38/(9B)}\le0.5\iff B\ge\frac{38}{9\cdot0.25}\approx16.9$, 따라서 $B\ge17$.`,
      rubric: R`
- 불편성 — 3점
- 분산 계산 — 3점
- $1/B$ 증명(독립성 사용 명시) — 3점, 배치 크기 — 1점` },
  ] });

  EM.more.push({ n: 11, problems: [
    { sec: '11.3', type: 'open', lv: 3, proof: true, quiz: true, q: R`층 $z_j=\sum_{i=1}^{D}W_{ji}h_i$에서 $W_{ji}$는 i.i.d., 평균 0, 분산 $s^2$, 0에 대해 대칭인 분포이고 $h$와 독립이다. $h_i$는 i.i.d.이고 $\E[h_i^2]=q$ (평균은 0이 아니어도 된다).
1. $\E z_j=0$이고 $\E[z_j^2]=Ds^2q$임을 증명하시오. 교차항이 사라지는 데 쓴 가정을 모두 밝히시오.
2. $z$가 0에 대해 대칭인 연속 확률변수이면 $\E[\ReLU(z)^2]=\frac12\E[z^2]$임을 보이시오. 1의 $z_j$가 대칭인 이유도 쓰시오.
3. ReLU 층을 쌓을 때 $q_\ell=\E[(z^{(\ell)})^2]$이 층마다 보존되려면 $s^2=\frac2D$ (He 초기화)여야 함을 보이시오. $s^2=\frac1D$ (Xavier)를 쓰면 10층 뒤 $q$는 처음의 몇 배인가?`,
      sol: R`
**1.** $\E z_j=\sum_i\E W_{ji}\E h_i=0$ ($W$와 $h$ 독립, $\E W=0$). 제곱을 전개하면
$$\E z_j^2=\sum_i\sum_k\E[W_{ji}W_{jk}]\,\E[h_ih_k].$$
$i\ne k$이면 $W_{ji},W_{jk}$가 독립이고 평균 0이라 $\E[W_{ji}W_{jk}]=0$ — $h_ih_k$의 평균이 0이 아니어도 교차항이 사라집니다. $i=k$이면 $s^2q$. 따라서 $Ds^2q$. 쓴 가정: $W$와 $h$의 독립, $W$ 성분끼리의 독립, $\E W=0$.
**2.** 밀도가 $p(-t)=p(t)$이면 $\E[z^2\mathbb 1\{z\gt0\}]=\E[z^2\mathbb 1\{z\lt0\}]$이고 $P(z=0)=0$이라 둘의 합이 $\E z^2$. $\ReLU(z)^2=z^2\mathbb 1\{z\gt0\}$이므로 $\frac12\E z^2$. 1의 $z_j$는 $W$를 $-W$로 바꿔도 분포가 같고($W$의 분포가 대칭, $h$와 독립) 그때 $z_j\to-z_j$이므로 대칭입니다.
**3.** $h^{(\ell-1)}=\ReLU(z^{(\ell-1)})$이면 2에서 $\E[(h^{(\ell-1)})^2]=\frac12q_{\ell-1}$, 1에서 $q_\ell=Ds^2\cdot\frac12q_{\ell-1}$. $q_\ell=q_{\ell-1}$이려면 $s^2=\frac2D$. Xavier $s^2=\frac1D$이면 $q_\ell=\frac12q_{\ell-1}$, 10층 뒤 $2^{-10}\approx0.00098$배 — 신호가 사라집니다.`,
      rubric: R`
- 평균과 2차 모멘트(교차항 논증과 가정) — 4점
- 대칭성과 ReLU 절반 — 3점
- He 조건과 Xavier 비교 — 3점` },
  ] });

  EM.more.push({ n: 12, problems: [
    { sec: '12.3', type: 'open', lv: 3, proof: true, quiz: true, q: R`한 특성의 미니배치 $x_1,\dots,x_B$에 대해 $\mu=\frac1B\sum_ix_i$, $\sigma^2=\frac1B\sum_i(x_i-\mu)^2$, $s=\sqrt{\sigma^2+\varepsilon}$, $\hat x_i=(x_i-\mu)/s$, $y_i=\gamma\hat x_i+\beta$. 상류 기울기를 $g_i:=\partial L/\partial\hat x_i=\gamma\,\partial L/\partial y_i$로 둔다.
1. $\dfrac{\partial\hat x_i}{\partial x_k}=\dfrac1s\Big(\mathbb 1[i=k]-\dfrac1B-\dfrac{\hat x_i\hat x_k}B\Big)$임을 보이시오.
2. $\dfrac{\partial L}{\partial x_k}=\dfrac1{Bs}\Big(Bg_k-\sum_ig_i-\hat x_k\sum_ig_i\hat x_i\Big)$를 유도하시오.
3. $\sum_k\partial L/\partial x_k=0$을 보이고, $\varepsilon=0$이면 $\sum_k\hat x_k\,\partial L/\partial x_k=0$도 성립함을 보이시오. 이것이 BN의 어떤 불변성과 관계있는지 설명하시오.
4. $B=3$, $x=(0,1,2)$, $\varepsilon=0$, $\gamma=1$, $\partial L/\partial y=(1,0,0)$일 때 $\partial L/\partial x$를 구하시오.`,
      sol: R`
**1.** $\frac{\partial\mu}{\partial x_k}=\frac1B$. $\sum_i(x_i-\mu)=0$을 쓰면 $\frac{\partial\sigma^2}{\partial x_k}=\frac2B\sum_i(x_i-\mu)\big(\mathbb 1[i=k]-\frac1B\big)=\frac2B(x_k-\mu)$, 그래서 $\frac{\partial s}{\partial x_k}=\frac1{2s}\cdot\frac2B(x_k-\mu)=\frac{\hat x_k}B$. 몫의 미분으로
$$\frac{\partial\hat x_i}{\partial x_k}=\frac{\mathbb 1[i=k]-\frac1B}s-\frac{x_i-\mu}{s^2}\cdot\frac{\hat x_k}B=\frac1s\Big(\mathbb 1[i=k]-\frac1B-\frac{\hat x_i\hat x_k}B\Big).$$
**2.** $\frac{\partial L}{\partial x_k}=\sum_ig_i\frac{\partial\hat x_i}{\partial x_k}=\frac1s\Big(g_k-\frac1B\sum_ig_i-\frac{\hat x_k}B\sum_ig_i\hat x_i\Big)$ — 식과 같습니다.
**3.** $\sum_k\hat x_k=0$이므로 $\sum_k\frac{\partial L}{\partial x_k}=\frac1{Bs}\big(B\sum g-B\sum g-0\big)=0$. 또 $\varepsilon=0$이면 $\sum_k\hat x_k^2=B\sigma^2/s^2=B$이므로
$$\sum_k\hat x_k\frac{\partial L}{\partial x_k}=\frac1{Bs}\Big(B\sum_kg_k\hat x_k-0-B\sum_ig_i\hat x_i\Big)=0.$$
BN 출력은 배치 전체를 같은 값만큼 옮기거나($x\to x+c\mathbf 1$) 평균 둘레로 늘려도($x-\mu\to\kappa(x-\mu)$) 변하지 않으므로, 입력 기울기는 그 두 방향($\mathbf 1$과 $\hat x$)의 성분이 0입니다.
**4.** $\mu=1$, $\sigma^2=\frac23$, $s=\sqrt{2/3}$, $\hat x=(-\sqrt{3/2},0,\sqrt{3/2})\approx(-1.2247,0,1.2247)$. $g=(1,0,0)$, $\sum g=1$, $\sum g\hat x=-\sqrt{3/2}$. $Bs=3\sqrt{2/3}=\sqrt6$.
$$\frac{\partial L}{\partial x}=\frac1{\sqrt6}\big(3-1-\tfrac32,\ 0-1-0,\ 0-1+\tfrac32\big)=\Big(\frac1{2\sqrt6},-\frac1{\sqrt6},\frac1{2\sqrt6}\Big)\approx(0.2041,\ -0.4082,\ 0.2041).$$
합이 0이고 $\hat x$와의 내적도 0입니다(3 확인). 참고: $B=2$이면 $\hat x$가 늘 $(\mp1,\pm1)$이라 BN 출력이 입력에 무관해지고 기울기가 0입니다.`,
      rubric: R`
- $\mu,\sigma^2,s$의 도함수와 야코비안 — 4점
- 입력 기울기 공식 — 2점
- 두 합이 0임과 불변성 해석 — 2점
- 수치 — 2점` },
  ] });

  EM.more.push({ n: 13, problems: [
    { sec: '13.3', type: 'open', lv: 3, proof: true, quiz: true, q: R`$f(x)=\frac12x^TAx-c^Tx$, $A$는 대칭이고 고윳값이 모두 $[0,\beta]$ 안에 있다 ($\beta\gt0$).
1. 모든 $x,y$에서 $f(y)=f(x)+\nabla f(x)^T(y-x)+\frac12(y-x)^TA(y-x)$임을 보이고, 이로부터 하강 보조정리 $f(y)\le f(x)+\nabla f(x)^T(y-x)+\frac\beta2\lVert y-x\rVert^2$를 증명하시오.
2. 경사하강 $x^+=x-\eta\nabla f(x)$에 대해 $f(x^+)\le f(x)-\eta\big(1-\frac{\beta\eta}2\big)\lVert\nabla f(x)\rVert^2$을 보이고, 이 보장을 가장 크게 하는 $\eta$와 그때의 감소량을 구하시오.
3. $A=\diag(1,4)$, $c=0$, $x=(2,1)$, $\eta=\frac14$일 때 $f(x)$, $f(x^+)$를 계산해 2의 부등식을 확인하시오.`,
      sol: R`
**1.** $\nabla f(x)=Ax-c$. $A$가 대칭이라 $\frac12(y-x)^TA(y-x)=\frac12y^TAy-x^TAy+\frac12x^TAx$이고 $\nabla f(x)^T(y-x)=x^TAy-x^TAx-c^T(y-x)$. 더하면 $\frac12y^TAy-\frac12x^TAx-c^T(y-x)=f(y)-f(x)$ — 이차함수는 2차 테일러 전개가 정확합니다.
$A=Q\Lambda Q^T$ (직교대각화)로 $v^TAv=\sum_i\lambda_i(Q^Tv)_i^2\le\beta\sum_i(Q^Tv)_i^2=\beta\lVert v\rVert^2$. $v=y-x$에 쓰면 하강 보조정리.
**2.** $y=x^+$, $y-x=-\eta\nabla f$를 넣으면 $f(x^+)\le f(x)-\eta\lVert\nabla f\rVert^2+\frac\beta2\eta^2\lVert\nabla f\rVert^2$. $\eta-\frac\beta2\eta^2$은 $\eta=\frac1\beta$에서 최대 $\frac1{2\beta}$이므로 감소량은 적어도 $\frac1{2\beta}\lVert\nabla f(x)\rVert^2$.
**3.** $f(x)=\frac12(1\cdot4+4\cdot1)=4$, $\nabla f=Ax=(2,4)$, $x^+=(2,1)-\frac14(2,4)=(1.5,\ 0)$, $f(x^+)=\frac12(2.25)=1.125$. $\beta=4$, $\eta=\frac14=\frac1\beta$라 보장은 $f(x^+)\le4-\frac18\cdot20=1.5$. 실제 $1.125\le1.5$ ✓.`,
      rubric: R`
- 이차함수의 정확한 전개 — 2점, 고윳값 상한으로 보조정리 — 2점
- GD 한 걸음 부등식과 최적 보폭 — 3점
- 수치 확인 — 3점` },
  ] });

  EM.more.push({ n: 14, problems: [
    { sec: '14.4', type: 'open', lv: 3, proof: true, quiz: true, q: R`Adam (성분별 연산): $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$, $v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2$, $m_0=v_0=0$, $\hat m_t=\frac{m_t}{1-\beta_1^t}$, $\hat v_t=\frac{v_t}{1-\beta_2^t}$, $x_t=x_{t-1}-\alpha\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}$.
1. $\epsilon=0$이면 첫걸음이 $g_1$의 0이 아닌 성분마다 $x_1-x_0=-\alpha\operatorname{sign}(g_1)$임을 보이시오.
2. $\epsilon=0$일 때 손실 $f$를 $cf$ ($c\gt0$)로 바꿔도 같은 출발점에서 Adam의 궤적 $x_1,x_2,\dots$가 변하지 않음을 귀납법으로 증명하시오. (분모가 0이 아니라고 가정) SGD는 어떻게 되는가?
3. $f(x)=\frac12(x_1^2+100x_2^2)$, $x_0=(1,1)$에서 SGD ($\alpha=0.01$)와 Adam ($\alpha=0.01$, $\epsilon=0$)의 첫걸음 $x_1$을 각각 구하고, 차이를 조건수와 연결해 설명하시오.`,
      sol: R`
**1.** $m_1=(1-\beta_1)g_1$, $v_1=(1-\beta_2)g_1^2$이므로 $\hat m_1=g_1$, $\hat v_1=g_1^2$. 성분마다 $\frac{\hat m_1}{\sqrt{\hat v_1}}=\frac{g_1}{\lvert g_1\rvert}=\operatorname{sign}(g_1)$.
**2.** 주장: 모든 $t$에서 궤적이 같고, 바뀐 손실의 모멘트는 $m_t^{(c)}=cm_t$, $v_t^{(c)}=c^2v_t$. $t=0$에서는 출발점이 같고 모멘트가 모두 0. $t-1$까지 성립한다고 하면 $x_{t-1}$이 같으므로 새 기울기는 $cg_t$이고
$$m_t^{(c)}=\beta_1cm_{t-1}+(1-\beta_1)cg_t=cm_t,\qquad v_t^{(c)}=c^2v_t.$$
편향 보정은 같은 상수로 나누므로 $\frac{\hat m_t^{(c)}}{\sqrt{\hat v_t^{(c)}}}=\frac{c\hat m_t}{c\sqrt{\hat v_t}}=\frac{\hat m_t}{\sqrt{\hat v_t}}$ ($c\gt0$), 따라서 $x_t$도 같습니다. $\blacksquare$ SGD는 걸음이 $c\alpha g_t$가 되어 학습률을 $c$배 한 것과 같습니다 — 손실의 크기에 민감합니다.
**3.** $\nabla f(x_0)=(1,100)$. SGD: $x_1=(1,1)-0.01(1,100)=(0.99,\ 0)$. Adam: $x_1=(1,1)-0.01(1,1)=(0.99,\ 0.99)$. 헤시안 $\diag(1,100)$의 조건수가 100이라 SGD는 가파른 방향(둘째 성분)으로 100배 큰 걸음을 가고, $\alpha\gt0.02$면 그 방향에서 발산합니다. Adam은 성분별로 기울기 크기를 나눠 두 방향 모두 약 $\alpha$만큼 움직입니다 — 적응형 학습률이 나쁜 조건수를 완화하는 이유입니다.`,
      rubric: R`
- 첫걸음의 부호 형태 — 3점
- 귀납법(가정, 모멘트의 $c$배, 비의 불변) — 4점, SGD 비교 — 1점
- 두 첫걸음과 조건수 해석 — 2점` },
  ] });
})();
