/* 실전 모의고사 — 연습문제와 겹치지 않는 별도 문항. 증명형 문항에는 채점 기준을 붙였습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x1', roman: 'I', kind: '1–2주차 범위', title: '회귀, 확률, 정보이론, 커널', scopeText: '01–04 단원',
    desc: '정규방정식, MLE·MAP·베이즈 사후분포, KL과 상호정보량, 릿지와 커널 릿지. 필기 증명을 재현할 수 있는지 봅니다.',
    minutes: 90, plot: 'beta',
    problems: [
      { ch: 'ch01', type: 'mc', lv: 1, pts: 6, q: R`$f(\beta)=\lVert y-X\beta\rVert^2$의 기울기로 옳은 것은?`,
        choices: [R`$2X^T(y-X\beta)$`, R`$-2X^T(y-X\beta)$`, R`$-2(y-X\beta)^TX$`, R`$2XX^T\beta-2Xy$`], ans: 1,
        sol: R`$f=y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta$, $\nabla f=-2X^Ty+2X^TX\beta=-2X^T(y-X\beta)$. 기울기는 열벡터입니다.` },
      { ch: 'ch01', type: 'num', lv: 2, pts: 8, q: R`자료 $(x,y)=(1,1),(2,3),(3,2)$에 $y=\beta_0+\beta_1x$를 최소제곱으로 맞출 때 $\hat\beta_0$은?`, ans: '1', ansTex: R`1`,
        sol: R`$X^TX=\begin{pmatrix}3&6\\6&14\end{pmatrix}$, $X^Ty=(6,13)$. $\det=42-36=6$. $\hat\beta=\frac16(14\cdot6-6\cdot13,\ -6\cdot6+3\cdot13)=\frac16(6,3)=(1,0.5)$.` },
      { ch: 'ch02', type: 'num', lv: 2, pts: 8, q: R`어떤 질병의 유병률이 2%, 검사의 민감도 $P(+\mid D)=0.95$, 위양성률 $P(+\mid D^c)=0.05$이다. 양성일 때 질병일 확률은? (소수 셋째 자리)`, ans: '0.019/(0.019+0.049)', ansTex: R`\tfrac{0.019}{0.068}\approx0.279`,
        sol: R`$P(+)=0.95(0.02)+0.05(0.98)=0.019+0.049=0.068$. $P(D\mid+)=0.019/0.068\approx0.279$.` },
      { ch: 'ch02', type: 'mc', lv: 2, pts: 6, q: R`균등 사전분포에서 베르누이 자료 $n=6$, 성공 $S=6$일 때 옳은 것은?`,
        choices: [R`$\hat\theta_{\text{MLE}}=\hat\theta_{\text{MAP}}=1$이고 사후평균은 $7/8$`, R`$\hat\theta_{\text{MLE}}=1$, $\hat\theta_{\text{MAP}}=6/7$`, R`사후분포는 $\operatorname{Beta}(6,0)$`, R`사후평균은 1`], ans: 0,
        sol: R`사후분포 $\operatorname{Beta}(7,1)$, 밀도 $7\theta^6$은 $\theta=1$에서 최대라 MAP = MLE = 1. 사후평균 $\frac7{8}$. 균등 사전분포의 MAP은 MLE와 같습니다.` },
      { ch: 'ch03', type: 'num', lv: 2, pts: 8, q: R`$X$는 $\{1,2,3,4\}$에서 균등하고 $Y=X\bmod2$일 때 $I(X;Y)$(비트)는?`, ans: '1', ansTex: R`1`,
        sol: R`$Y$는 $X$의 함수라 $H(Y\mid X)=0$, $I=H(Y)-0=1$비트($Y$는 공정한 동전).` },
      { ch: 'ch03', type: 'mc', lv: 2, pts: 6, q: R`다음 중 **항상** 성립하는 것은?`,
        choices: [R`$\KL(p\Vert q)=\KL(q\Vert p)$`, R`$H_p(q)\ge H(p)$`, R`$H(X,Y)\ge H(X)+H(Y)$`, R`$I(X;Y)\le0$`], ans: 1,
        sol: R`$H_p(q)=H(p)+\KL(p\Vert q)\ge H(p)$. 나머지는 틀렸습니다($H(X,Y)=H(X)+H(Y)-I\le H(X)+H(Y)$).` },
      { ch: 'ch04', type: 'num', lv: 2, pts: 8, q: R`커널 $K(x,z)=x^Tz$ (선형), 자료 $x_1=1,\ y_1=2$, $x_2=2,\ y_2=2$ (1차원), $\lambda=1$일 때 $x=3$에서의 커널 릿지 예측값은?`, ans: '3', ansTex: R`3`,
        sol: R`$K=\begin{pmatrix}1&2\\2&4\end{pmatrix}$, $K+I=\begin{pmatrix}2&2\\2&5\end{pmatrix}$, $\det=6$. $\alpha^*=\frac16\begin{pmatrix}5&-2\\-2&2\end{pmatrix}\begin{pmatrix}2\\2\end{pmatrix}=\frac16\begin{pmatrix}6\\0\end{pmatrix}=\begin{pmatrix}1\\0\end{pmatrix}$. $K(3,X)=[3,\ 6]$이므로 $f^*(3)=3$.
검산(릿지 원문제): $\hat\beta=\frac{X^Ty}{\lambda+X^TX}=\frac{2+4}{1+5}=1$, $f(3)=3\hat\beta=3$. 선형 커널의 커널 릿지는 보통의 릿지와 같습니다.` },
      { ch: 'ch01', type: 'open', lv: 2, pts: 14, q: R`$\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$를 성분 계산으로 증명하고, 이를 이용해 정규방정식 $X^TX\hat\beta=X^Ty$를 유도하세요. $X^TX$가 가역일 조건도 쓰세요.`,
        rubric: R`
- $\partial_k\sum_{i,j}\beta_iA_{ij}\beta_j=(A\beta)_k+(A^T\beta)_k$ — 5점
- $f$ 전개와 스칼라 전치로 교차항 합치기 — 3점
- 기울기 0에서 정규방정식 — 3점
- 가역 조건: $X$의 열이 일차독립 ($Xv=0\Rightarrow v=0$) — 3점`,
        sol: R`
$\frac{\partial}{\partial\beta_k}\sum_{i,j}\beta_iA_{ij}\beta_j=\sum_jA_{kj}\beta_j+\sum_iA_{ik}\beta_i=(A\beta+A^T\beta)_k$.
$f=y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta$ ($y^TX\beta=\beta^TX^Ty$). $\nabla f=-2X^Ty+2X^TX\beta=0\Rightarrow X^TX\beta=X^Ty$.
$X^TXv=0\Rightarrow\lVert Xv\rVert^2=0\Rightarrow Xv=0$이므로, $X$의 열이 일차독립이면 $v=0$이고 $X^TX$가 가역, $\hat\beta=(X^TX)^{-1}X^Ty$.` },
      { ch: 'ch03', type: 'open', lv: 3, pts: 18, q: R`(1) 옌센 부등식을 이용해 $\KL(p\Vert q)\ge0$과 등호 조건을 증명하세요. (2) 이를 써서 $H_p(q)\ge H(p)$와 $I(X;Y)\ge0$을 보이세요.`,
        rubric: R`
- (1) 받침 $E$ 도입, $q=0$ 경우 — 2점
- (1) $-\log$의 볼록성과 옌센 적용 — 5점
- (1) $\sum_Eq\le1$ — 2점
- (1) 등호 조건 — 3점
- (2) $H_p(q)=H(p)+\KL$ 유도 — 3점
- (2) $I=\KL(p(x,y)\Vert p(x)p(y))\ge0$ — 3점`,
        sol: R`
(1) $E=\{p>0\}$. $\KL=\sum_Ep\,[-\log\frac qp]\ge-\log\sum_Ep\frac qp=-\log\sum_Eq\ge0$. 등호: $q/p$가 $E$에서 상수이고 $\sum_Eq=1$ ⇒ $q=p$.
(2) $\KL=\sum p\log p-\sum p\log q=-H(p)+H_p(q)\ge0$. $I(X;Y)$는 결합분포와 곱분포 사이의 KL이므로 $\ge0$.` },
      { ch: 'ch02', type: 'open', lv: 3, pts: 18, q: R`베르누이 자료 $S$번 성공, $n-S$번 실패에서 사전분포가 $\operatorname{Beta}(a,b)$이면 사후분포가 $\operatorname{Beta}(a+S,b+n-S)$임을 정규화 상수까지 보이고, MAP 추정량 $\frac{S+a-1}{n+a+b-2}$ ($a+S>1$, $b+n-S>1$)을 유도하세요. 마지막으로 MAP이 “자료 적합 손실 + 규제” 꼴임을 설명하세요.`,
        rubric: R`
- 가능도 × 사전분포의 꼴 — 4점
- 베타함수로 정규화 상수 계산 — 5점
- 로그 사후분포 미분으로 MAP — 5점
- $-\log p(x\mid\theta)-\log p(\theta)$ 해석 — 4점`,
        sol: R`
$p(D\mid\theta)p(\theta)=\frac{\theta^{a+S-1}(1-\theta)^{b+n-S-1}}{B(a,b)}$. 증거 $=\frac{B(a+S,b+n-S)}{B(a,b)}$. 나누면 $\frac{\theta^{a+S-1}(1-\theta)^{b+n-S-1}}{B(a+S,b+n-S)}=\operatorname{Beta}(a+S,b+n-S)$.
로그: $(a+S-1)\log\theta+(b+n-S-1)\log(1-\theta)$, 미분 0: $\frac{a+S-1}\theta=\frac{b+n-S-1}{1-\theta}$ ⇒ $\theta=\frac{a+S-1}{n+a+b-2}$ (이계도함수 음수라 최대).
$\hat\theta_{\text{MAP}}=\argmin[-\log p(D\mid\theta)-\log p(\theta)]$: 첫 항은 음의 로그가능도(자료 적합), 둘째 항 $-(a-1)\log\theta-(b-1)\log(1-\theta)$가 $\theta$를 사전분포의 최빈값 쪽으로 당기는 규제입니다.` },
    ],
  },
  {
    id: 'x2', roman: 'II', kind: '3주차 범위', title: '로지스틱, 소프트맥스, SVM, 신경망', scopeText: '05–08 단원',
    desc: '선형 분류기의 손실·기울기·볼록성, SVM의 마진과 쌍대 문제, 신경망의 구조. 3주차 필기 증명 위주입니다.',
    minutes: 90, plot: 'margin',
    problems: [
      { ch: 'ch05', type: 'num', lv: 1, pts: 6, q: R`$\sigma(z)=0.2$일 때 $\sigma'(z)$는?`, ans: '0.16', ansTex: R`0.16`,
        sol: R`$\sigma'=\sigma(1-\sigma)=0.2\times0.8=0.16$.` },
      { ch: 'ch05', type: 'mc', lv: 2, pts: 6, q: R`로지스틱 회귀 손실의 헤시안 $X^TSX$에 대해 옳지 **않은** 것은?`,
        choices: [R`양의 준정부호이다`, R`레이블 $y_i$에 의존하지 않는다`, R`$S$의 대각성분은 $\frac14$ 이하이다`, R`항상 가역이다`], ans: 3,
        sol: R`$X$의 열이 일차종속이면(예: 자료 수 < 차원) $X^TSX$는 특이합니다. 나머지는 참입니다.` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 8, q: R`로짓 $z=(2,1,0)$, 정답 클래스 3일 때 손실 $-\log p_3$ (자연로그, 소수 셋째 자리)은?`, ans: 'ln(e^2+e+1)', ansTex: R`\ln(e^2+e+1)\approx2.408`,
        sol: R`$p_3=\frac{1}{e^2+e+1}$, $-\log p_3=\ln(e^2+e+1)=\ln(11.107)\approx2.408$.` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 8, q: R`위 문항에서 $\partial J/\partial z_1$은? (소수 셋째 자리)`, ans: 'e^2/(e^2+e+1)', ansTex: R`p_1\approx0.665`,
        sol: R`$\partial J/\partial z_m=p_m-y_m$, $y_1=0$이므로 $p_1=e^2/11.107\approx0.665$.` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 8, q: R`하드 마진 SVM의 해가 $w=(1,1)$, $b=-3$일 때 점 $(1,1)$의 결정 평면까지 거리는?`, ans: 'sqrt(2)/2', ansTex: R`\tfrac{\sqrt2}2`,
        sol: R`$\lvert1+1-3\rvert/\sqrt2=1/\sqrt2$. 이 점은 $w^Tx+b=-1$ 위에 있으므로 음성 클래스의 서포트 벡터이고 마진 $1/\lVert w\rVert=1/\sqrt2$과 같습니다.` },
      { ch: 'ch07', type: 'mc', lv: 2, pts: 6, q: R`SVM 쌍대 문제에서 $\alpha_i>0$인 점들에 대해 옳은 것은?`,
        choices: [R`마진 밖에 있다`, R`$y_i(x_i^Tw+b)=1$을 만족하는 서포트 벡터이다`, R`잘못 분류된 점이다`, R`$w$에 기여하지 않는다`], ans: 1,
        sol: R`KKT 상보성 $\alpha_i(1-y_i(\cdot))=0$에서 $\alpha_i>0$이면 $y_i(\cdot)=1$.` },
      { ch: 'ch08', type: 'num', lv: 1, pts: 6, q: R`MLP $784\to256\to10$ (편향 포함)의 파라미터 수는?`, ans: '203530', ansTex: R`203{,}530`,
        sol: R`$785\cdot256+257\cdot10=200{,}960+2{,}570=203{,}530$.` },
      { ch: 'ch05', type: 'open', lv: 2, pts: 16, q: R`로지스틱 회귀의 음의 로그가능도를 $\sum_i\log(1+e^{-w^Tx_i})+\sum_i(1-y_i)w^Tx_i$로 정리하고, 기울기와 헤시안을 구한 뒤 손실이 볼록함을 증명하세요.`,
        rubric: R`
- 베르누이 가능도와 음의 로그 — 3점
- $-\log(1-\sigma)=z+\log(1+e^{-z})$로 정리 — 3점
- 기울기 $\sum(\sigma_i-y_i)x_i$ — 3점
- 헤시안 $\sum\sigma_i(1-\sigma_i)x_ix_i^T=X^TSX$ — 4점
- $v^TX^TSXv=\sum s_i(x_i^Tv)^2\ge0$과 볼록성 — 3점`,
        sol: R`
$-\log L=\sum[y_i\log(1+e^{-z_i})+(1-y_i)(z_i+\log(1+e^{-z_i}))]=\sum\log(1+e^{-z_i})+\sum(1-y_i)z_i$.
$\nabla=\sum[-(1-\sigma_i)+(1-y_i)]x_i=\sum(\sigma_i-y_i)x_i$. $\nabla^2=\sum\sigma_i'x_ix_i^T=X^TSX$, $s_i=\sigma_i(1-\sigma_i)>0$.
$v^T\nabla^2v=\sum s_i(x_i^Tv)^2\ge0$ ⇒ PSD ⇒ 볼록(정류점 = 전역 최소).` },
      { ch: 'ch07', type: 'open', lv: 3, pts: 20, q: R`(1) 점 $x$와 초평면 $w^Tz+b=0$ 사이의 거리를 유도하세요. (2) 마진의 스케일 불변성을 이용해 마진 최대화 문제를 $\min\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$로 바꾸세요. (3) 라그랑지안에서 쌍대 문제를 유도하세요.`,
        rubric: R`
- (1) $x_p=x-\alpha w$, $\alpha=\frac{w^Tx+b}{w^Tw}$, 거리 — 5점
- (2) 스케일 불변성과 $\min\lvert w^Tx_i+b\rvert=1$ 정규화 — 4점
- (2) 제약 동치와 목적함수 동치 — 3점
- (3) 정류 조건 두 개 — 4점
- (3) 대입해 쌍대 목적함수 — 4점`,
        sol: R`
(1) $w^T(x-\alpha w)+b=0$에서 $\alpha=\frac{w^Tx+b}{w^Tw}$, 거리 $\lvert\alpha\rvert\lVert w\rVert=\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert}$.
(2) $r(\beta w,\beta b)=r(w,b)$이므로 $\min_i\lvert w^Tx_i+b\rvert=1$로 두면 $r=1/\lVert w\rVert$; $y_i(\cdot)\ge0$과 $\min\lvert\cdot\rvert=1$은 $y_i(\cdot)\ge1$과 같은 최적해를 줍니다. $\max1/\lVert w\rVert\iff\min\frac12\lVert w\rVert^2$.
(3) $L_p=\frac12w^Tw+\sum\alpha_i(1-y_i(x_i^Tw+b))$. $\nabla_w=0\Rightarrow w=\sum\alpha_iy_ix_i$, $\partial_b=0\Rightarrow\sum\alpha_iy_i=0$. 대입: $\max_{\alpha\ge0}\sum\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$ s.t. $\sum\alpha_iy_i=0$.` },
      { ch: 'ch06', type: 'open', lv: 2, pts: 16, q: R`소프트맥스 $p_k=e^{z_k}/\sum_je^{z_j}$에 대해 $\partial p_k/\partial z_m$을 구하고, 원-핫 $y$에 대한 교차 엔트로피 $J=-\sum_ky_k\log p_k$의 가중치 기울기 $\partial J/\partial w_{mn}=(p_m-y_m)x_n$ ($z_k=w_k^Tx$)을 유도하세요. $C=2$이면 로지스틱 회귀와 같아짐도 보이세요.`,
        rubric: R`
- 몫의 미분으로 $p_k(\delta_{km}-p_m)$ — 5점
- $\partial J/\partial z_m=p_m-y_m$ (원-핫 조건 사용) — 5점
- 연쇄법칙으로 $w_{mn}$ — 3점
- $C=2$에서 $\sigma(z_1-z_2)$ — 3점`,
        sol: R`
$\partial p_k/\partial z_m=\delta_{km}p_k-p_kp_m$. $\partial J/\partial z_m=-\sum_ky_k(\delta_{km}-p_m)=p_m-y_m$. $\partial z_m/\partial w_{mn}=x_n$이므로 $\partial J/\partial w_{mn}=(p_m-y_m)x_n$.
$C=2$: $p_1=\frac1{1+e^{-(z_1-z_2)}}=\sigma((w_1-w_2)^Tx)$.` },
    ],
  },
  {
    id: 'x3', roman: 'III', kind: '중간고사형 · 1–4주차 종합', title: '유도와 증명 종합', scopeText: '01–13 단원',
    desc: '1–4주차 전 범위. 필기로 증명한 정리(정규방정식, KL, 푸시스루, SVM, Xavier/He, 하강 보조정리)를 처음부터 쓸 수 있는지 봅니다.',
    minutes: 120, plot: 'descent',
    problems: [
      { ch: 'ch04', type: 'mc', lv: 2, pts: 5, q: R`$\lambda>0$일 때 $(\lambda I+\varphi\varphi^T)^{-1}\varphi$와 같은 것은? ($\varphi\in\mathbb R^{d\times n}$)`,
        choices: [R`$\varphi(\lambda I+\varphi\varphi^T)^{-1}$`, R`$\varphi(\lambda I_n+\varphi^T\varphi)^{-1}$`, R`$(\lambda I+\varphi^T\varphi)^{-1}\varphi$`, R`$\varphi^T(\lambda I+\varphi\varphi^T)^{-1}$`], ans: 1,
        sol: R`푸시스루 항등식. 크기를 보면 $(\lambda I_n+\varphi^T\varphi)$는 $n\times n$이라 $\varphi$의 오른쪽에만 곱할 수 있습니다.` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 7, q: R`$f=\max(x,y)\cdot z$, $(x,y,z)=(2,5,-3)$에서 $\partial f/\partial y$는?`, ans: '-3', ansTex: R`-3`,
        sol: R`$m=\max(2,5)=5$ (y 선택), $\partial f/\partial m=z=-3$, 최댓값 게이트가 $y$로 전달: $-3$. $\partial f/\partial x=0$.` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 6, q: R`표본 기울기의 분산이 $\sigma^2=9$일 때, 미니배치 기울기의 표준편차를 $0.5$ 이하로 만드는 최소 배치 크기는 (i.i.d. 추출)?`, ans: '36', ansTex: R`36`,
        sol: R`$\sqrt{9/B}\le0.5\iff B\ge36$.` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 6, q: R`ReLU 층, $D_{in}=200$에서 He 초기화의 가중치 분산은?`, ans: '0.01', ansTex: R`0.01`,
        sol: R`$2/D_{in}=2/200=0.01$ (표준편차 $0.1$).` },
      { ch: 'ch12', type: 'mc', lv: 2, pts: 5, q: R`추론 모드 BN에 대해 옳은 것은?`,
        choices: [R`현재 배치의 평균과 분산을 쓴다`, R`학습 중 누적한 이동평균을 쓰며 채널별 아핀변환이 된다`, R`$\gamma,\beta$를 쓰지 않는다`, R`배치 크기가 1이면 사용할 수 없다`], ans: 1,
        sol: R`$y_j=a_jx_j+b_j$로 앞 층에 합칠 수 있습니다.` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 6, q: R`$f(x)=\frac12x^T\begin{pmatrix}4&0\\0&1\end{pmatrix}x$에 GD를 쓸 때, 하강 보조정리가 감소를 보장하는 학습률의 상한은?`, ans: '0.5', ansTex: R`2/\beta=0.5`,
        sol: R`$\beta=\lambda_{\max}=4$, $2/\beta=0.5$.` },
      { ch: 'ch13', type: 'num', lv: 3, pts: 7, q: R`위 함수에서 $x_0=(1,1)$, $\eta=0.25$로 GD 한 걸음 뒤 $f(x_1)$은?`, ans: '0.28125', ansTex: R`0.28125`,
        sol: R`$\nabla f=(4x_1,x_2)=(4,1)$, $x_1=(1-1,\ 1-0.25)=(0,0.75)$. $f=\frac12(0+0.5625)=0.28125$. 보조정리의 상한: $f(x_0)-(\eta-\frac{4\eta^2}2)\lVert\nabla f\rVert^2=2.5-(0.25-0.125)17=0.375\ge0.28125$ ✓.` },
      { ch: 'ch13', type: 'open', lv: 3, pts: 20, q: R`$\nabla f$가 $\beta$-립시츠인 $C^2$ 함수 $f$에 대해 (1) $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$을 보이고, (2) 보조함수 $g(t)=f(x+t(y-x))$와 적분형 테일러 공식으로 하강 보조정리를 증명한 뒤, (3) $x_{t+1}=x_t-\eta\nabla f(x_t)$가 $\eta<2/\beta$에서 $f$를 줄임을 보이세요.`,
        rubric: R`
- (1) 헤시안-벡터 곱의 극한 표현과 노름 상한 — 5점
- (2) $g'$, $g''$ 연쇄법칙 — 3점
- (2) $g(1)=g(0)+g'(0)+\int(1-s)g''$ (부분적분 근거) — 4점
- (2) 곡률 상한으로 $\frac\beta2\lVert y-x\rVert^2$ — 3점
- (3) 대입과 $(\eta-\frac{\beta\eta^2}2)>0$ 조건 — 5점`,
        sol: R`
(1) $\nabla^2f(x)v=\lim_{s\to0}\frac{\nabla f(x+sv)-\nabla f(x)}s$, 노름 $\le\beta\lVert v\rVert$. 코시-슈바르츠로 $v^T\nabla^2fv\le\beta\lVert v\rVert^2$.
(2) $g'(t)=\langle\nabla f(x+t(y-x)),y-x\rangle$, $g''(t)=(y-x)^T\nabla^2f(\cdot)(y-x)\le\beta\lVert y-x\rVert^2$. $g(1)=g(0)+\int_0^1g'=g(0)+g'(0)+\int_0^1(1-s)g''(s)ds\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$.
(3) $y=x_t-\eta\nabla f(x_t)$ 대입: $f(x_{t+1})\le f(x_t)-(\eta-\frac{\beta\eta^2}2)\lVert\nabla f(x_t)\rVert^2$, $0<\eta<2/\beta$이면 괄호가 양수.` },
      { ch: 'ch11', type: 'open', lv: 3, pts: 16, q: R`$z=\sum_{i=1}^{D_{in}}w_ix_i$ ($w_i$ 독립, 평균 0, 분산 $\sigma^2$, $x$와 독립)에서 $\E[z^2]=D_{in}\sigma^2\E[x^2]$을 보이고, (1) 입력이 평균 0인 tanh 층에서 Xavier 조건, (2) ReLU $h=\max(0,z)$ ($z\sim\N(0,q)$)에서 $\E[h^2]=q/2$를 적분으로 계산해 He 조건을 유도하세요.`,
        rubric: R`
- 제곱 전개와 교차항 소거 — 4점
- (1) $\sigma^2=1/D_{in}$ — 3점
- (2) $\E[h^2]=q/2$ (대칭 또는 부분적분) — 5점
- (2) 2차 모멘트 보존으로 $\sigma^2=2/D_{in}$ — 4점`,
        sol: R`
$\E z^2=\sum_i\E w_i^2\E x_i^2+\sum_{i\ne k}\E w_i\E[w_kx_ix_k]=D_{in}\sigma^2\E x^2$.
(1) $\E x=0$이면 $\E x^2=\Var x$, 보존 $\Var z=\Var x$ ⇒ $\sigma^2=1/D_{in}$.
(2) $\E h^2=\int_0^\infty z^2\phi(z)dz=\frac12\int_{\mathbb R}z^2\phi=q/2$. $\E h^2=\frac12D_{in}\sigma^2\E x^2=\E x^2$ ⇒ $\sigma^2=2/D_{in}$.` },
      { ch: 'ch04', type: 'open', lv: 3, pts: 12, q: R`커널 릿지 회귀에서 $\beta=\varphi(X)\alpha$로 치환해 목적함수를 $\alpha$로 쓰고 $\nabla_\alpha J=K((K+\lambda I)\alpha-y)$를 유도하세요. 이어서 $K(x,z)=(x^Tz)^2$, $x_1=(1,0),y_1=1$, $x_2=(0,2),y_2=2$, $\lambda=1$일 때 $x=(1,1)$의 예측값을 구하세요.`,
        rubric: R`
- 치환과 전개 — 4점
- 기울기와 $\alpha^*$ — 4점
- 수치 예: $K$, $\alpha^*$, $K(x,X)$, 예측 — 4점`,
        sol: R`
$J=\frac12\lVert y-K\alpha\rVert^2+\frac\lambda2\alpha^TK\alpha$, $\nabla_\alpha=-Ky+K^2\alpha+\lambda K\alpha=K((K+\lambda I)\alpha-y)$, $\alpha^*=(K+\lambda I)^{-1}y$.
수치: $K=\begin{pmatrix}1&0\\0&16\end{pmatrix}$ ($x_1^Tx_2=0$), $K+I=\diag(2,17)$, $\alpha^*=(\frac12,\frac2{17})$. $K(x,X)=[(1)^2,(2)^2]=[1,4]$. $f=\frac12+\frac8{17}=\frac{33}{34}\approx0.971$.` },
      { ch: 'ch03', type: 'open', lv: 2, pts: 10, q: R`연쇄법칙 $H(X,Y)=H(X)+H(Y\mid X)$를 증명하고, 상호정보량 $I(X;Y)=H(X)+H(Y)-H(X,Y)$를 유도하세요.`,
        rubric: R`
- $\log p(x,y)=\log p(y\mid x)+\log p(x)$와 기댓값 — 4점
- 주변화로 $H(X)$ 얻기 — 2점
- $I=H(Y)-H(Y\mid X)$에 연쇄법칙 대입 — 4점`,
        sol: R`
$H(X,Y)=-\E[\log p(Y\mid X)]-\E[\log p(X)]=H(Y\mid X)+H(X)$.
$I=H(Y)-H(Y\mid X)=H(Y)-(H(X,Y)-H(X))=H(X)+H(Y)-H(X,Y)$.` },
    ],
  },
  );
})();
