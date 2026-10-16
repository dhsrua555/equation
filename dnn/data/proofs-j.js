/* 판서에 없는 증명 — Part J: 14–16단원 (수업 판서에서 증명하지 않았지만 시험에 중요한 공식)
   뉴턴법과 대각 전처리, 최적 모멘텀의 √κ 속도, Adam 걸음의 크기, 교차상관과 뒤집기, 합성곱층의 역전파,
   풀링의 역전파, 합성곱층의 곱셈 수와 AlexNet, 드롭아웃의 기댓값, 깊은 망과 항등사상.
   src가 없으므로 증명 탭에 ‘판서에 없는 증명’으로 표시됩니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
EM.plans = EM.plans || {};
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 14
  { ch: 'ch14', id: 'newton', title: '뉴턴법과 대각 전처리',
    tags: 'Newton method one step quadratic diagonal preconditioning preconditioner condition number change of variables Hessian 뉴턴법 한 걸음 이차함수 대각 전처리 조건수 변수 변환 헤시안',
    stmt: R`$f(x)=\frac12x^THx-b^Tx$ ($H$ 대칭, $H\succ0$)이고 $x^*=H^{-1}b$라 하자. (i) $x^*$는 $f$의 유일한 최솟점이고, 어느 점 $x$에서든 뉴턴법 한 걸음 $x-H^{-1}\nabla f(x)$는 $x^*$이다. (ii) 대각 성분이 양수인 대각행렬 $D$로 전처리한 경사하강법 $x_{t+1}=x_t-\alpha D^{-1}\nabla f(x_t)$은 $e_t=D^{1/2}(x_t-x^*)$에 대해 $e_{t+1}=(I-\alpha\tilde H)e_t$, $\tilde H=D^{-1/2}HD^{-1/2}\succ0$를 만족한다. 따라서 수렴 조건과 최적 축소율은 $H$ 대신 $\tilde H$의 고윳값이 정한다: 모든 출발점에서 수렴 $\iff0<\alpha<2/\tilde\lambda_{\max}$, 최적 고정 $\alpha$에서 축소율 $\frac{\tilde\kappa-1}{\tilde\kappa+1}$ ($\tilde\kappa=\tilde\lambda_{\max}/\tilde\lambda_{\min}$). (iii) $H$가 대각이고 $D=H$이면 $\tilde H=I$ ($\tilde\kappa=1$)이고, $\alpha=1$에서 한 걸음에 $x^*$에 도달한다.`,
    body: R`
**1. 최솟점.** 벡터 미분 공식으로 $\nabla f(x)=Hx-b$이고, $b=Hx^*$이므로 $\nabla f(x)=H(x-x^*)$입니다. $H$가 대칭이라 $x^THx^*=x^Tb=b^Tx$이므로
$$\begin{aligned}&\tfrac12(x-x^*)^TH(x-x^*)\\&=\tfrac12x^THx-x^THx^*+\tfrac12x^{*T}Hx^*\\&=f(x)+\tfrac12x^{*T}Hx^*.\end{aligned}$$
$x=x^*$를 넣으면 $f(x^*)=-\frac12x^{*T}Hx^*$이므로 $f(x)-f(x^*)=\frac12(x-x^*)^TH(x-x^*)$이고, $H\succ0$이라 $x\ne x^*$이면 이 값이 양수입니다. 따라서 $x^*$가 유일한 최솟점입니다.

**2. 뉴턴 한 걸음.** 어느 $x$에서든 $x-H^{-1}\nabla f(x)=x-H^{-1}H(x-x^*)=x^*$입니다. 수업의 예 $f=\frac12x_1^2+\frac{100}2x_2^2$ ($H=\diag(1,100)$, $b=0$)에서는 $H^{-1}\nabla f=(x_1,\ x_2)$라 한 걸음에 원점으로 갑니다.

**3. 좌표 바꾸기.** $D=\diag(d_1,\dots,d_n)$ ($d_i>0$), $D^{1/2}=\diag(\sqrt{d_1},\dots,\sqrt{d_n})$라 합시다. 갱신식에서 $x^*$를 빼고 $\nabla f(x_t)=H(x_t-x^*)$를 쓰면
$$x_{t+1}-x^*=(I-\alpha D^{-1}H)(x_t-x^*).$$
왼쪽에서 $D^{1/2}$를 곱하고 $x_t-x^*=D^{-1/2}e_t$를 넣으면, $D^{1/2}D^{-1}=D^{-1/2}$이므로
$$e_{t+1}=e_t-\alpha D^{-1/2}HD^{-1/2}e_t=(I-\alpha\tilde H)e_t.$$

**4. 조건수 $\tilde\kappa$.** $\tilde H^T=D^{-1/2}H^TD^{-1/2}=\tilde H$ (대칭)이고, $v\ne0$이면 $D^{-1/2}v\ne0$이라 $v^T\tilde Hv=(D^{-1/2}v)^TH(D^{-1/2}v)>0$ (양의 정부호)입니다. 그러므로 $e_t$는 정확히 $\frac12e^T\tilde He$에 학습률 $\alpha$로 GD를 한 점열이고, 조건수와 경사하강법의 증명(고유방향마다 $(1-\alpha\tilde\lambda_i)$배)이 $H$ 대신 $\tilde H$로 그대로 성립합니다: 모든 출발점에서 $e_t\to0\iff0<\alpha<2/\tilde\lambda_{\max}$이고, 최적 고정 $\alpha=\frac2{\tilde\lambda_{\max}+\tilde\lambda_{\min}}$에서 축소율은 $\frac{\tilde\kappa-1}{\tilde\kappa+1}$입니다. $D^{-1/2}$가 가역이라 $x_t\to x^*\iff e_t\to0$이고, $\lVert x_t-x^*\rVert\le\lVert e_t\rVert/\sqrt{\min_id_i}$입니다.

**5. 완전한 대각 전처리.** $H=\diag(h_1,\dots,h_n)$이고 $D=H$이면 대각행렬끼리는 곱의 순서를 바꿀 수 있어 $\tilde H=H^{-1/2}HH^{-1/2}=I$, $\tilde\kappa=1$입니다. $\alpha=1$이면 $e_1=(I-I)e_0=0$, 곧 $x_1=x^*$이고, 이때의 갱신 $x-H^{-1}\nabla f(x)$는 2의 뉴턴 걸음 그 자체입니다. 수업의 예에서 $D=\diag(1,100)$으로 나누면 조건수가 $100$에서 $1$이 됩니다.`,
    note: R`$H$가 대각이 아니면 대각 전처리로 조건수를 다 없앨 수 없습니다. 예를 들어 $H=\begin{pmatrix}1&0.99\\0.99&1\end{pmatrix}$은 고윳값이 $0.01$, $1.99$ ($\kappa=199$)인데 $\diag(H)=I$라 $D=\diag(H)$로 나눠도 그대로입니다 — 좌표축과 비스듬한 골짜기는 좌표별 학습률로 펼 수 없습니다. 14.3–14.4절의 AdaGrad·RMSProp·Adam은 $D$를 헤시안 대신 기울기 크기의 통계로 만드는 대각 전처리입니다. 고정된 $D$에서 속도를 정하는 것이 $\kappa$가 아니라 $\tilde\kappa$라는 것이 이 증명의 요점입니다.` },
  { ch: 'ch14', id: 'hbrate', title: '최적 모멘텀의 수렴 속도: κ 대신 √κ',
    tags: 'heavy ball momentum Polyak convergence rate quadratic condition number characteristic equation complex roots acceleration sqrt kappa 모멘텀 폴리악 수렴 속도 이차함수 조건수 특성방정식 복소근 가속',
    stmt: R`$f(x)=\frac12x^THx$ ($H$ 대칭, 고윳값 $0<\lambda_{\min}\le\lambda_i\le\lambda_{\max}$, $\kappa=\lambda_{\max}/\lambda_{\min}>1$)에 모멘텀 $x_{t+1}=x_t-\alpha\nabla f(x_t)+\rho(x_t-x_{t-1})$ ($x_{-1}=x_0$)을 쓰고
$$\alpha=\frac4{(\sqrt{\lambda_{\max}}+\sqrt{\lambda_{\min}})^2},\quad\sqrt\rho=\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$$
로 고르면, 각 고유방향 성분은 $u_{t+1}=(1+\rho-\alpha\lambda_i)u_t-\rho u_{t-1}$을 따르고 그 특성방정식 $z^2-(1+\rho-\alpha\lambda_i)z+\rho=0$의 두 근의 절댓값이 모든 $i$에서 정확히 $\sqrt\rho$이다. 따라서 $x_0$와 $H$에만 의존하는 상수 $C$가 있어
$$\lVert x_t\rVert\le C(1+t)\Big(\frac{\sqrt\kappa-1}{\sqrt\kappa+1}\Big)^t.$$`,
    body: R`
**1. 고유방향으로 나누기.** $\nabla f(x)=Hx$이고, $H=Q\Lambda Q^T$ ($Q$ 직교)로 대각화해 $u_t=Q^Tx_t$라 두면 갱신식에 왼쪽에서 $Q^T$를 곱해 $u_{t+1}=u_t-\alpha\Lambda u_t+\rho(u_t-u_{t-1})$, 곧 성분마다
$$u_{t+1,i}=b_iu_{t,i}-\rho\,u_{t-1,i},\qquad b_i=1+\rho-\alpha\lambda_i$$
이고 $u_{-1,i}=u_{0,i}$입니다. 성분끼리 섞이지 않으므로 한 성분씩 보면 되고, $Q$가 직교라 $\lVert x_t\rVert=\lVert u_t\rVert$입니다. 아래에서는 $i$를 고정하고 첨자를 생략해 $u_{t+1}=bu_t-\rho u_{t-1}$로 씁니다.

**2. 특성근으로 풀기.** $z_1,z_2$를 $z^2-bz+\rho=0$의 두 근이라 하면 $z_1+z_2=b$, $z_1z_2=\rho$입니다. 근 $z$에 대해 수열 $z^t$는 점화식을 만족합니다: $z^{t+1}-bz^t+\rho z^{t-1}=z^{t-1}(z^2-bz+\rho)=0$. 중근 $z=\frac b2$이면($b=2z$, $\rho=z^2$) $tz^t$도 만족합니다:
$$\begin{aligned}&(t+1)z^{t+1}-2z\cdot tz^t+z^2(t-1)z^{t-1}\\&=z^{t+1}\big[(t+1)-2t+(t-1)\big]=0.\end{aligned}$$
점화식이 선형이므로 이들의 일차결합도 해입니다. 그래서 두 근이 다르면 $u_t=c_1z_1^t+c_2z_2^t$, 중근이면 $u_t=(c_1+c_2t)z^t$로 놓고 $u_0,u_1$에 맞춰 $c_1,c_2$를 정할 수 있습니다(다른 근: 연립방정식의 행렬식이 $z_2-z_1\ne0$; 중근: $c_1=u_0$, $c_2=u_1/z-u_0$, $z^2=\rho>0$이라 $z\ne0$). 점화식은 $u_0,u_1$에서 $u_2,u_3,\dots$를 하나로 정하므로 이 식이 모든 $t\ge0$에서 $u_t$입니다.

**3. 근의 크기.** $b^2<4\rho$이면 두 근은 켤레복소수(계수가 실수라 $z_2=\bar z_1$)이므로 $\lvert z_1\rvert^2=z_1\bar z_1=z_1z_2=\rho$이고, $b^2=4\rho$이면 중근의 크기가 $\lvert z\rvert=\frac{\lvert b\rvert}2=\sqrt\rho$입니다. 즉 $b^2\le4\rho$이면 두 근의 절댓값이 모두 $\sqrt\rho$이고, 2의 식에서
$$\lvert u_t\rvert\le(\lvert c_1\rvert+\lvert c_2\rvert)(1+t)\,\rho^{t/2}.$$
그리고 이 조건은 $\alpha\lambda$에 대한 조건으로 바뀝니다.
$$\begin{aligned}b^2\le4\rho&\iff\lvert1+\rho-\alpha\lambda\rvert\le2\sqrt\rho\\&\iff(1-\sqrt\rho)^2\le\alpha\lambda\le(1+\sqrt\rho)^2.\end{aligned}$$

**4. 주어진 $\alpha,\rho$에서 확인.** $s=\sqrt\rho=\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$ ($0<s<1$)이면 $1-s=\frac2{\sqrt\kappa+1}$, $1+s=\frac{2\sqrt\kappa}{\sqrt\kappa+1}$이고, $\sqrt\kappa+1=\frac{\sqrt{\lambda_{\max}}+\sqrt{\lambda_{\min}}}{\sqrt{\lambda_{\min}}}$이므로
$$(1-s)^2=\frac{4\lambda_{\min}}{(\sqrt{\lambda_{\max}}+\sqrt{\lambda_{\min}})^2}=\alpha\lambda_{\min},$$
$$(1+s)^2=\frac{4\kappa\lambda_{\min}}{(\sqrt{\lambda_{\max}}+\sqrt{\lambda_{\min}})^2}=\alpha\lambda_{\max}.$$
$\alpha>0$이고 $\lambda_{\min}\le\lambda_i\le\lambda_{\max}$이므로 모든 $i$에서 $(1-s)^2\le\alpha\lambda_i\le(1+s)^2$, 곧 3의 조건이 성립해 모든 고유방향의 두 근의 절댓값이 $s=\sqrt\rho$입니다.

**5. 결론.** 성분마다 $\lvert u_{t,i}\rvert\le C_i(1+t)s^t$ ($C_i=\lvert c_{1,i}\rvert+\lvert c_{2,i}\rvert$)이므로 $\lVert x_t\rVert=\lVert u_t\rVert\le\sum_i\lvert u_{t,i}\rvert\le C(1+t)s^t$, $C=\sum_iC_i$입니다. 인수 $1+t$는 지수보다 느리게 자라므로 걸음마다 오차가 대략 $s=\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$배가 되고, 경사하강법의 $\frac{\kappa-1}{\kappa+1}$에서 $\kappa$가 $\sqrt\kappa$로 바뀐 것입니다. $\kappa=100$이면 $s=\frac9{11}\approx0.818$ 대 $\frac{99}{101}\approx0.980$이고, 오차를 $1/e$로 줄이는 걸음 수 $1/\ln(1/s)$는 약 $5$ 대 $50$입니다.`,
    note: R`$(1+t)$ 인수는 4에서 등호가 되는 양 끝 고윳값($\lambda_{\min}$, $\lambda_{\max}$)의 중근에서만 생깁니다. $\kappa=1$이면 $\rho=0$, $\alpha=1/\lambda$로 GD 한 걸음에 끝나므로 제외했습니다. 이 $(\alpha,\rho)$보다 빠른 고정 선택이 없다는 사실(최적성)도 알려져 있지만 여기서는 증명하지 않습니다. 실전의 기본값 $\rho=0.9$는 이 최적값($\kappa=100$이면 $\rho=(9/11)^2\approx0.67$)과 다르며, 곡률을 모르는 상태에서 쓰는 경험적 선택입니다.` },
  { ch: 'ch14', id: 'adamscale', title: 'Adam 걸음의 크기: 척도 불변과 신호 대 잡음비', keys: ['Adam'],
    tags: 'Adam step size scale invariance signal to noise ratio bias corrected moments weighted average Cauchy Schwarz SGD 척도 불변 신호 대 잡음비 걸음 크기 가중평균 편향 보정 코시 슈바르츠',
    stmt: R`Adam (성분별 연산, $\epsilon=0$, 분모는 0이 아니라고 가정, $0<\beta_1,\beta_2<1$, $m_{1,0}=m_{2,0}=0$)
$$\begin{aligned}m_{1,t}&=\beta_1m_{1,t-1}+(1-\beta_1)g_t,\\m_{2,t}&=\beta_2m_{2,t-1}+(1-\beta_2)g_t\odot g_t,\end{aligned}$$
$\hat m_{k,t}=m_{k,t}/(1-\beta_k^t)$, $x_t=x_{t-1}-\alpha\hat m_{1,t}/\sqrt{\hat m_{2,t}}$에 대해 다음이 성립한다.
- (i) 기울기 $g_1,\dots,g_t$를 $Cg_1,\dots,Cg_t$ ($C=\diag(c_1,\dots,c_n)$, $c_j>0$)로 바꿔도 $t$번째 걸음은 같다. 특히 손실을 $cf$ ($c>0$)로 바꾸면 같은 출발점에서 궤적 $x_1,x_2,\dots$ 전체가 같다.
- (ii) $\hat m_{1,t}=\sum_{k=1}^ta_kg_k$, $\hat m_{2,t}=\sum_{k=1}^tb_k\,g_k\odot g_k$이고, 가중치 $a_k=\frac{(1-\beta_1)\beta_1^{t-k}}{1-\beta_1^t}$, $b_k=\frac{(1-\beta_2)\beta_2^{t-k}}{1-\beta_2^t}$는 양수이며 각각 합이 1이다(가중평균).
- (iii) $\beta_1=\beta_2$이면 모든 좌표에서 $\lvert x_{t,j}-x_{t-1,j}\rvert\le\alpha$이다.
- (iv) 한 좌표의 기울기가 모든 $k$에서 $\E g_k=\bar g$, $\Var g_k=s^2$이면 $\E\hat m_{1,t}=\bar g$, $\E\hat m_{2,t}=\bar g^2+s^2$이고, 따라서 $\dfrac{\lvert\E\hat m_{1,t}\rvert}{\sqrt{\E\hat m_{2,t}}}=\dfrac{\lvert\bar g\rvert}{\sqrt{\bar g^2+s^2}}\le1$이다.`,
    body: R`
**1. 가중평균 꼴 (ii).** 14.4절의 펼친 식(귀납법) $m_{1,t}=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$를 $1-\beta_1^t$로 나누면 $\hat m_{1,t}=\sum_ka_kg_k$입니다. $a_k>0$이고 등비급수 $1+\beta_1+\dots+\beta_1^{t-1}=\frac{1-\beta_1^t}{1-\beta_1}$로
$$\sum_{k=1}^ta_k=\frac{(1-\beta_1)}{1-\beta_1^t}\cdot\frac{1-\beta_1^t}{1-\beta_1}=1.$$
$\hat m_{2,t}$와 $b_k$도 $g_k\odot g_k$와 $\beta_2$로 같은 계산입니다. 편향 보정은 0에서 시작한 탓에 합이 $1-\beta^t$뿐인 가중치를 합이 1이 되도록 키우는 일입니다.

**2. 척도 불변 (i).** 좌표 $j$에서 $g_{k,j}\to c_jg_{k,j}$이면 (ii)에서 $\hat m_{1,t,j}\to c_j\hat m_{1,t,j}$, $\hat m_{2,t,j}\to c_j^2\hat m_{2,t,j}$이고, $c_j>0$이라 $\sqrt{c_j^2}=c_j$이므로
$$\frac{c_j\hat m_{1,t,j}}{\sqrt{c_j^2\hat m_{2,t,j}}}=\frac{\hat m_{1,t,j}}{\sqrt{\hat m_{2,t,j}}}$$
— 걸음이 같습니다. 손실을 $cf$로 바꾼 경우는 귀납법입니다: 출발점이 같고, $x_0,\dots,x_{t-1}$이 같다면 그 점들에서의 기울기는 $cg_1,\dots,cg_t$이므로 위 계산으로 $x_t$도 같습니다.

**3. 걸음의 상계 (iii).** $\beta_1=\beta_2$이면 $a_k=b_k$입니다. 한 좌표에서 코시-슈바르츠 부등식을 두 벡터 $(\sqrt{a_k})_k$와 $(\sqrt{a_k}\,g_k)_k$에 쓰면
$$\Big(\sum_ka_kg_k\Big)^2\le\Big(\sum_ka_k\Big)\Big(\sum_ka_kg_k^2\Big)=\sum_ka_kg_k^2,$$
곧 $\hat m_{1,t}^2\le\hat m_{2,t}$이므로 걸음 $\alpha\lvert\hat m_{1,t}\rvert/\sqrt{\hat m_{2,t}}\le\alpha$입니다. 등호는 두 벡터가 비례할 때, 곧 모든 $g_k$가 같을 때뿐입니다.

**4. 신호 대 잡음비 (iv).** 기댓값의 선형성과 (ii)에서 $\E\hat m_{1,t}=\sum_ka_k\bar g=\bar g$이고, $\E g_k^2=\Var g_k+(\E g_k)^2=s^2+\bar g^2$이므로 $\E\hat m_{2,t}=\sum_kb_k(\bar g^2+s^2)=\bar g^2+s^2$입니다. 비 $\frac{\lvert\bar g\rvert}{\sqrt{\bar g^2+s^2}}$는 분모가 분자 이상이라 1 이하이고, 잡음이 없으면($s=0$) 1, 잡음이 신호보다 훨씬 크면($s\gg\lvert\bar g\rvert$) 0에 가깝습니다. 그래서 $\hat m_1/\sqrt{\hat m_2}$를 기울기의 “평균 ÷ RMS”, 곧 신호 대 잡음비로 읽고, 걸음의 크기를 대략 $\alpha$ 이하로 봅니다.`,
    note: R`(iv)는 기댓값끼리의 비이지 비의 기댓값이 아닙니다. 기본값 $\beta_1=0.9\ne\beta_2=0.999$에서는 (iii)이 정확히 성립하지 않습니다. 같은 코시-슈바르츠로 걸음은 $\alpha\sqrt{\sum_ka_k^2/b_k}$ 이하인데, 이 상수는 $t=1$에서 1이지만 기울기가 걸음마다 $\beta_2/\beta_1\approx1.11$배씩 커지는 특별한 열에서는 $t\to\infty$일 때 $\sqrt{\frac{(1-\beta_1)^2}{(1-\beta_2)(1-\beta_1^2/\beta_2)}}\approx7.3$까지 갑니다. 그래서 ‘걸음 ≈ α’는 보통의 경우에 대한 어림입니다. 반면 SGD의 걸음 $\alpha g$는 손실을 $c$배 하면 $c$배가 되어(학습률을 바꾼 것과 같음) 척도에 민감합니다.` },
  // ───── 15
  { ch: 'ch15', id: 'flip', title: '교차상관과 뒤집은 합성곱은 표현력이 같다', keys: ['2차원 합성곱 (딥러닝의 규약)'],
    tags: 'cross-correlation convolution flip kernel flipped filter equivalence expressive power gradient descent permutation 교차상관 합성곱 필터 뒤집기 표현력 순열',
    stmt: R`$K\times K$ 필터 $w$와 그것을 뒤집은 $\tilde w[i,j]=w[K-1-i,\ K-1-j]$에 대해, 딥러닝의 합성곱(교차상관) $(w\star F)[x,y]=\sum_{i,j=0}^{K-1}w[i,j]F[x+i,\ y+j]$와 수학의 합성곱 $(w*F)[x,y]=\sum_{i,j=0}^{K-1}w[i,j]F[x-i,\ y-j]$는 모든 $F$, $x$, $y$에서
$$(w\star F)[x,y]=(\tilde w*F)[x+K-1,\ y+K-1]$$
을 만족한다. 뒤집기는 필터들 사이의 일대일 대응이므로 두 층이 나타내는 함수의 집합은 같고(출력 칸의 번호만 $K-1$ 밀림), 손실 $L(w)$와 $\tilde L(v)=L(\tilde v)$에 같은 학습률 $\eta$로 경사하강법을 하면 $v_0=\tilde w_0$일 때 모든 $t$에서 $v_t=\tilde w_t$이다.`,
    body: R`
**1. 지표 바꾸기.** $i'=K-1-i$, $j'=K-1-j$로 두면 $i$가 $0,\dots,K-1$을 돌 때 $i'$도 같은 범위를 돌므로
$$\begin{aligned}&(\tilde w*F)[x+K-1,\ y+K-1]\\&=\sum_{i,j}w[K-1-i,\ K-1-j]\\&\qquad\cdot F[x+K-1-i,\ y+K-1-j]\\&=\sum_{i',j'}w[i',j']\,F[x+i',\ y+j']=(w\star F)[x,y].\end{aligned}$$

**2. 같은 함수 집합.** 두 번 뒤집으면 제자리($\tilde{\tilde w}=w$)이므로 $w\mapsto\tilde w$는 일대일 대응입니다. 교차상관 층 $w$가 내는 값은 합성곱 층 $\tilde w$가 내는 값과 같고(1), 거꾸로 합성곱 층 $v$의 값은 교차상관 층 $\tilde v$의 값과 같습니다. 다른 것은 출력 칸에 붙인 번호뿐입니다.

**3. 학습도 대응한다.** 뒤집기는 $K^2$개 성분의 자리를 바꾸는 순열이므로 선형사상 $R$로 쓸 수 있고, 두 번 하면 제자리라 $R^T=R^{-1}=R$입니다. $\tilde L(v)=L(Rv)$의 기울기는 연쇄법칙으로 $\nabla\tilde L(v)=R^T\nabla L(Rv)=R\nabla L(Rv)$입니다. $v_t=Rw_t$이면 $Rv_t=RRw_t=w_t$이므로
$$v_{t+1}=Rw_t-\eta R\nabla L(w_t)=Rw_{t+1}.$$
$v_0=Rw_0$에서 시작하므로 귀납법으로 모든 $t$에서 $v_t=Rw_t=\tilde w_t$입니다. 학습된 필터가 뒤집혀 나올 뿐입니다.`,
    note: R`다채널 필터와 편향이 있어도 공간 지표 $(i,j)$만 뒤집으면 같은 논증이 됩니다. 그래서 딥러닝 라이브러리는 더 단순한 교차상관을 쓰고 이름만 합성곱이라 부릅니다. 역전파에서 입력의 기울기를 구할 때는 뒤집은 필터가 자연스럽게 나타납니다(합성곱층의 역전파 증명).` },
  { ch: 'ch15', id: 'convlinear', title: '합성곱층은 공유된 희소 행렬의 선형층이다 (역전파 공식)', keys: ['2차원 합성곱 (딥러닝의 규약)'],
    tags: 'convolution linear map sparse matrix Toeplitz weight sharing local connectivity backpropagation filter gradient input gradient chain rule 합성곱 선형층 희소 행렬 퇴플리츠 가중치 공유 국소 연결 역전파 필터 기울기 입력 기울기',
    stmt: R`한 채널, 보폭 1, 패딩 없음: 입력 $F\in\mathbb R^{N\times N}$, 필터 $w\in\mathbb R^{K\times K}$, 편향 $b$, $N'=N-K+1$이고
$$G[x,y]=\sum_{i,j=0}^{K-1}w[i,j]\,F[x+i,\ y+j]+b$$
($0\le x,y\le N'-1$)라 하자. (i) $F$, $G$를 벡터로 펴면 $G=W_{\text{conv}}F+b\mathbf 1$이고, $W_{\text{conv}}$의 $(x,y)$행 $(u,v)$열 성분은 $0\le u-x\le K-1$, $0\le v-y\le K-1$일 때 $w[u-x,\ v-y]$, 아니면 0이다. 각 행에서 0이 아닐 수 있는 자리는 $K^2$개뿐이고(국소 연결), 모든 행이 같은 $K^2$개의 수 $w[i,j]$로 채워진다(가중치 공유). (ii) 손실 $L$과 $\delta[x,y]=\partial L/\partial G[x,y]$에 대해 $\partial L/\partial b=\sum_{x,y}\delta[x,y]$이고
$$\frac{\partial L}{\partial w[i,j]}=\sum_{x,y}\delta[x,y]\,F[x+i,\ y+j],$$
$$\frac{\partial L}{\partial F[u,v]}=\sum_{i,j}w[i,j]\,\delta[u-i,\ v-j]$$
(범위 밖의 $\delta$는 0)이며, 마지막 식은 $W_{\text{conv}}^T\delta$의 $(u,v)$ 성분이다.`,
    body: R`
**1. 선형성과 행렬.** $(x,y)$를 고정하고 $u=x+i$, $v=y+j$로 바꾸면 $G[x,y]=\sum_{u,v}W_{(x,y),(u,v)}F[u,v]+b$입니다. 여기서 $W_{(x,y),(u,v)}$는 $(u,v)$가 $(x,y)$에서 시작하는 $K\times K$ 조각 안에 있으면 $w[u-x,\ v-y]$, 밖이면 0입니다. 이것이 행렬–벡터 곱의 $(x,y)$번째 성분이므로 $G=W_{\text{conv}}F+b\mathbf 1$입니다. 한 행에서 0이 아닐 수 있는 자리는 조각의 $K^2$칸뿐이고, 성분은 차이 $(u-x,\ v-y)$에만 의존하므로 모든 행이 같은 필터 값을 자리만 옮겨 담습니다. 1차원의 예($N=4$, $K=2$):
$$W_{\text{conv}}=\begin{pmatrix}w_0&w_1&0&0\\0&w_0&w_1&0\\0&0&w_0&w_1\end{pmatrix}$$
같은 크기의 완전연결층은 $N'^2N^2$개 성분이 모두 자유롭지만 여기서는 $K^2$개(와 편향)뿐입니다.

**2. 필터의 기울기.** $w[i,j]$는 모든 출력 $G[x,y]$에 쓰이고(공유) $\partial G[x,y]/\partial w[i,j]=F[x+i,\ y+j]$입니다. 다변수 연쇄법칙으로 $L$에 이르는 모든 경로를 더하면
$$\begin{aligned}\frac{\partial L}{\partial w[i,j]}&=\sum_{x,y}\frac{\partial L}{\partial G[x,y]}\frac{\partial G[x,y]}{\partial w[i,j]}\\&=\sum_{x,y}\delta[x,y]\,F[x+i,\ y+j].\end{aligned}$$
여러 곳에 쓰인 변수의 기울기는 더한다는 복사 게이트의 규칙과 같습니다. 오른쪽은 $F$ 위에 $\delta$를 필터처럼 대고 미끄러뜨린 교차상관이라 같은 합성곱 루틴으로 계산됩니다. 또 $\partial G[x,y]/\partial b=1$이므로 $\partial L/\partial b=\sum_{x,y}\delta[x,y]$입니다.

**3. 입력의 기울기.** $F[u,v]$는 $0\le u-x\le K-1$, $0\le v-y\le K-1$인 출력 $G[x,y]$에만 계수 $w[u-x,\ v-y]=W_{(x,y),(u,v)}$로 들어갑니다. 연쇄법칙으로
$$\begin{aligned}\frac{\partial L}{\partial F[u,v]}&=\sum_{x,y}W_{(x,y),(u,v)}\,\delta[x,y]\\&=(W_{\text{conv}}^T\delta)_{(u,v)},\end{aligned}$$
곧 행렬곱의 역전파 $z=Wx\Rightarrow\partial L/\partial x=W^T\partial L/\partial z$ 그대로입니다. $i=u-x$, $j=v-y$로 바꾸면 $\sum_{i,j}w[i,j]\,\delta[u-i,\ v-j]$이고(범위 밖의 $\delta$는 0으로 둠), 이는 0을 덧댄 $\delta$와 $w$의 수학적(뒤집는) 합성곱입니다.`,
    note: R`다채널($C_{\text{in}}\to C_{\text{out}}$)이면 출력 채널 $c$마다 필터 $w_c[i,j,d]$가 있어 $\partial L/\partial w_c[i,j,d]=\sum_{x,y}\delta_c[x,y]F[x+i,\ y+j,\ d]$이고, 입력의 기울기는 출력 채널에 대한 합 $\sum_c\sum_{i,j}w_c[i,j,d]\,\delta_c[u-i,\ v-j]$가 됩니다. 보폭이 $S$이면 $F[x+i]$ 자리에 $F[Sx+i]$를 쓰면 됩니다. 이 공식들이 15.3절 ‘더 깊이’에서 말한 “공유된 변수의 기울기는 더한다”의 정확한 내용입니다.` },
  { ch: 'ch15', id: 'poolgrad', title: '풀링층의 크기와 역전파', keys: ['풀링'],
    tags: 'max pooling average pooling backpropagation gradient routing overlapping pooling window stride output size no parameters global average pooling 최대 풀링 평균 풀링 역전파 기울기 겹치는 풀링 창 보폭 매개변수 전역 평균 풀링',
    stmt: R`한 채널 입력 $x\in\mathbb R^{N\times N}$에 $F\times F$ 창을 보폭 $S$로 쓰면 창은 $R_{m,n}=\{(mS+i,\ nS+j):0\le i,j\le F-1\}$ ($0\le m,n\le N'-1$, $N'=\lfloor\frac{N-F}S\rfloor+1$)이고, 최대 풀링은 $y_{m,n}=\max_{(p,q)\in R_{m,n}}x_{pq}$, 평균 풀링은 $y_{m,n}=\frac1{F^2}\sum_{(p,q)\in R_{m,n}}x_{pq}$이다. 상류 기울기 $\delta_{m,n}=\partial L/\partial y_{m,n}$에 대해
$$\text{평균}:\ \frac{\partial L}{\partial x_{pq}}=\frac1{F^2}\sum_{(m,n):\,(p,q)\in R_{m,n}}\delta_{m,n},$$
$$\text{최대}:\ \frac{\partial L}{\partial x_{pq}}=\sum_{(m,n):\,(p,q)=(p^*_{mn},q^*_{mn})}\delta_{m,n}$$
이다. 최대 풀링에서는 각 창의 최댓값 칸 $(p^*_{mn},q^*_{mn})$이 하나뿐이라고 가정한다. $S\ge F$ (창이 겹치지 않음)이면 각 합의 항은 많아야 하나이다. 풀링은 채널마다 따로 작용해 출력이 $N'\times N'\times C$이고 학습할 매개변수가 없다.`,
    body: R`
**1. 국소 기울기.** 평균 풀링은 $x$의 일차식이라 $\partial y_{m,n}/\partial x_{pq}$는 $(p,q)\in R_{m,n}$이면 $\frac1{F^2}$, 아니면 0입니다. 최대 풀링에서 최댓값 칸이 하나뿐이면 그 값은 창의 다른 값들보다 어떤 $\gamma>0$ 이상 큽니다. 모든 성분을 $\gamma/2$보다 적게 바꾸면 최댓값 칸은 그대로이므로 그 근방에서 $y_{m,n}=x_{p^*_{mn}q^*_{mn}}$이고, $\partial y_{m,n}/\partial x_{pq}$는 $(p,q)=(p^*_{mn},q^*_{mn})$이면 1, 아니면 0입니다(최댓값 게이트의 기울기와 같음).

**2. 연쇄법칙.** $x_{pq}$는 자신을 포함하는 모든 창의 출력에 영향을 주므로
$$\frac{\partial L}{\partial x_{pq}}=\sum_{m,n}\delta_{m,n}\frac{\partial y_{m,n}}{\partial x_{pq}}$$
이고, 1의 국소 기울기를 넣으면 명제의 두 식이 됩니다. 최대 풀링은 상류 기울기를 최댓값을 낸 칸으로만 보내고, 평균 풀링은 창의 $F^2$칸에 $\delta_{m,n}/F^2$씩 고루 나눕니다.

**3. 겹침.** $(p,q)$가 두 창 $R_{m,n}$, $R_{m',n'}$에 함께 들어 있으면 첫 좌표에서 $mS\le p\le mS+F-1$, $m'S\le p\le m'S+F-1$이므로 $\lvert m-m'\rvert S\le F-1$이고, 둘째 좌표도 같습니다. $S\ge F$이면 $\lvert m-m'\rvert\le\frac{F-1}S<1$이라 $m=m'$ ($n=n'$도 같음) — 창이 겹치지 않아 합의 항이 많아야 하나입니다. $S<F$이면 한 칸이 여러 창에 들어가 그 기울기를 모두 받습니다. AlexNet의 최대 풀링($F=3$, $S=2$)에서는 한 칸이 가로·세로로 각각 두 창, 모두 네 창까지 들어갈 수 있어, 겹친 두 창의 최댓값이 같은 칸이면 그 칸이 두 $\delta$를 더해 받습니다.

**4. 크기와 매개변수.** 창의 자리를 세는 것은 합성곱 출력 크기 공식의 유도와 같아($K=F$, $P=0$) 방향마다 $N'=\lfloor\frac{N-F}S\rfloor+1$개입니다. 출력의 식에는 입력 $x$와 정해 둔 함수(최댓값, 평균)만 있으므로 학습할 매개변수가 없고, 채널 $c$의 출력은 채널 $c$의 입력만으로 계산되어 채널 수 $C$가 그대로입니다. 전역 평균 풀링은 창이 맵 전체인 경우로 $H\times W\times C\to1\times1\times C$입니다.`,
    note: R`최댓값 칸이 여럿(동점)이면 최대 풀링은 그 점에서 미분가능하지 않고, 라이브러리는 그중 한 칸을 골라 기울기를 보냅니다. 15.5절 예제 1(창 $\{5,10,4,0\}$, $\delta=2$)의 $(0,2,0,0)$과 $(0.5,0.5,0.5,0.5)$는 위 공식에서 $S=F=2$ (겹침 없음)인 경우입니다.` },
  // ───── 16
  { ch: 'ch16', id: 'flops', title: '합성곱층의 곱셈 수와 AlexNet의 매개변수·계산량 분포', keys: ['AlexNet의 층별 크기'],
    tags: 'AlexNet parameters FLOPs multiplications computation cost convolution fully connected weight reuse 94 percent 매개변수 계산량 곱셈 수 합성곱 완전연결 가중치 재사용',
    stmt: R`(i) 출력이 $N'\times N'\times C_{\text{out}}$이고 필터가 $K\times K\times C_{\text{in}}$인 합성곱층을 정의대로 계산하면 곱셈이 $N'^2K^2C_{\text{in}}C_{\text{out}}$번, 곧 (가중치 수)$\times N'^2$번 필요하다. $d_{\text{in}}\to d_{\text{out}}$ 완전연결층은 $d_{\text{in}}d_{\text{out}}$번, 곧 (가중치 수)번이다. (ii) 모든 채널을 잇는 AlexNet(슬라이드의 구조)에서 매개변수는 합성곱 다섯 층이 $3{,}747{,}200$개, 완전연결 세 층이 $58{,}631{,}144$개로 약 $94.0\%$가 완전연결층에 있고, 곱셈은 합성곱층이 $1{,}076{,}634{,}144$번($\approx1.08\times10^9$), 완전연결층이 $58{,}621{,}952$번($\approx5.9\times10^7$)으로 약 $94.8\%$가 합성곱층에 있다.`,
    body: R`
**1. 합성곱층.** 출력 한 칸 $G_c[x,y]=\sum_{i,j,d}w_c[i,j,d]F[x+i,\ y+j,\ d]+b_c$는 $K\cdot K\cdot C_{\text{in}}$개의 곱을 더한 것이고 출력 칸은 $N'^2C_{\text{out}}$개이므로, 곱셈은 $N'^2\cdot K^2C_{\text{in}}\cdot C_{\text{out}}$번입니다. 가중치는 $K^2C_{\text{in}}C_{\text{out}}$개이므로 이는 (가중치 수)$\times N'^2$이고, 가중치 하나 $w_c[i,j,d]$가 맵 $c$의 $N'^2$개 위치에서 한 번씩 쓰인다는 뜻입니다.

**2. 완전연결층.** 출력 $d_{\text{out}}$개가 각각 $d_{\text{in}}$차원 내적이므로 곱셈은 $d_{\text{in}}d_{\text{out}}$번이고, 가중치마다 한 번씩만 쓰입니다.

**3. AlexNet의 매개변수.** 16.2절의 표(합성곱 $K^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$, 완전연결 $d_{\text{in}}d_{\text{out}}+d_{\text{out}}$)를 더하면

- 합성곱: $34{,}944+614{,}656+885{,}120+1{,}327{,}488+884{,}992=3{,}747{,}200$
- 완전연결: $37{,}752{,}832+16{,}781{,}312+4{,}097{,}000=58{,}631{,}144$

이고, 전체 $62{,}378{,}344$개 중 완전연결의 몫은 $58{,}631{,}144/62{,}378{,}344\approx0.940$입니다.

**4. AlexNet의 곱셈 수.** 1의 식 $N'^2\cdot K^2C_{\text{in}}\cdot C_{\text{out}}$으로

- Conv1: $55^2\cdot363\cdot96=105{,}415{,}200$
- Conv2: $27^2\cdot2400\cdot256=447{,}897{,}600$
- Conv3: $13^2\cdot2304\cdot384=149{,}520{,}384$
- Conv4: $13^2\cdot3456\cdot384=224{,}280{,}576$
- Conv5: $13^2\cdot3456\cdot256=149{,}520{,}384$

이고 합은 $1{,}076{,}634{,}144$번입니다. 완전연결은 2의 식으로 $9216\cdot4096+4096\cdot4096+4096\cdot1000=58{,}621{,}952$번이고, 합성곱의 몫은 $1{,}076{,}634{,}144/1{,}135{,}256{,}096\approx0.948$입니다.

**5. 왜 반대인가.** 1–2에서 곱셈 수 $=$ (가중치 수) $\times$ (그 가중치가 다시 쓰이는 횟수)이고, 그 횟수가 합성곱층은 출력 위치 수 $N'^2$ ($13^2=169$에서 $55^2=3025$까지), 완전연결층은 1입니다. 그래서 합성곱층은 매개변수가 적어도 계산이 많고, 완전연결층은 그 반대입니다.`,
    note: R`덧셈과 편향은 세지 않았습니다(곱셈마다 덧셈이 거의 하나씩 따라오므로 비율은 같습니다). 원 논문처럼 GPU 두 대로 나눠 Conv2·4·5가 입력 채널의 절반만 보면 그 층들의 가중치와 곱셈이 절반이 되지만 결론은 같습니다. 같은 셈으로 16.5절의 인셉션 모듈은 가중치가 $28^2=784$곳에서 쓰여, 단순 모듈은 $784\times1{,}089{,}536\approx8.5\times10^8$번, 병목 모듈은 $784\times346{,}112\approx2.7\times10^8$번 곱합니다.` },
  { ch: 'ch16', id: 'dropout', title: '드롭아웃의 기댓값 맞추기', keys: ['AlexNet의 설계 선택'],
    tags: 'dropout inverted dropout keep probability expectation test time scaling Bernoulli mask variance AlexNet 드롭아웃 역 드롭아웃 유지 확률 기댓값 시험 시 스케일링 베르누이 마스크 분산',
    stmt: R`한 층의 출력 $h\in\mathbb R^d$ (주어진 입력에서 고정)에 유지 확률 $p\in(0,1]$인 독립 베르누이 마스크 $m_i\in\{0,1\}$ ($P(m_i=1)=p$)를 쓴다.
- (i) 학습 때 $\tilde h=m\odot h$를 쓰면 $\E[\tilde h]=p\,h$이므로, 시험 때 $p\,h$를 쓰면 기댓값이 맞는다.
- (ii) 학습 때 $\tilde h=\frac1p\,m\odot h$ (역 드롭아웃)를 쓰면 $\E[\tilde h]=h$이므로, 시험 때 $h$를 그대로 쓴다.
- (iii) (ii)에서 다음 층 $a=W\tilde h+c$는 $\E[a]=Wh+c$ (시험 때의 값)이고 $\Var(a_k)=\frac{1-p}p\sum_iW_{ki}^2h_i^2$이다.`,
    body: R`
**1. 한 성분.** $\E[m_i]=1\cdot p+0\cdot(1-p)=p$이고 $h_i$는 상수이므로 $\E[m_ih_i]=p\,h_i$입니다. 성분마다 모으면 $\E[m\odot h]=p\,h$ (i). $\frac1p$를 곱하면 기댓값의 선형성으로 $\E[\tilde h]=h$ (ii).

**2. 다음 층의 평균.** 기댓값의 선형성으로 $\E[a]=W\E[\tilde h]+c=Wh+c$이고, 이는 시험 때 마스크 없이 계산하는 값과 같습니다.

**3. 다음 층의 분산.** $m_i^2=m_i$라 $\Var(m_i)=\E[m_i^2]-p^2=p(1-p)$이고 $\Var(\tilde h_i)=\frac{h_i^2}{p^2}p(1-p)=\frac{1-p}ph_i^2$입니다. 마스크가 독립이라 $\tilde h_i$들도 독립이고, 독립인 것들의 일차결합의 분산은 계수의 제곱을 곱해 더하므로 $\Var(a_k)=\sum_iW_{ki}^2\Var(\tilde h_i)=\frac{1-p}p\sum_iW_{ki}^2h_i^2$입니다.`,
    note: R`AlexNet의 “드롭아웃 0.5”는 버릴 확률이 0.5, 곧 $p=0.5$라 (i)의 방식이면 시험 때 출력에 0.5를 곱합니다. 기댓값이 정확히 맞는 것은 다음 층의 선형 부분까지입니다. 그 뒤의 비선형 함수 $\sigma$에 대해서는 일반적으로 $\E[\sigma(a)]\ne\sigma(\E a)$이므로(예: 볼록한 ReLU에서는 젠센 부등식으로 $\E[\ReLU(a)]\ge\ReLU(\E a)$) 시험 때의 스케일링은 근사입니다. 분산 $\frac{1-p}p\sum_iW_{ki}^2h_i^2$은 학습 때 섞이는 잡음의 크기로, $p$가 작을수록 커집니다.` },
  { ch: 'ch16', id: 'deepshallow', title: '깊은 망은 얕은 망만큼 훈련 데이터를 맞출 수 있다',
    tags: 'deeper network identity mapping identity layer residual block degradation optimization not overfitting ResNet plain network capacity function class training loss 깊은 망 항등사상 항등 층 잔차 블록 성능 저하 최적화 과적합 함수 집합 훈련 손실',
    stmt: R`훈련 손실을 $J(\theta)=\frac1n\sum_{i=1}^n\ell\big(f_\theta(x_i),y_i\big)$라 하자.
- (i) 망 A가 나타내는 모든 함수를 망 B도 나타낼 수 있으면 $\inf_{\theta_B}J_B\le\inf_{\theta_A}J_A$이다.
- (ii) ReLU 다음에 같은 폭의 층 $\ReLU(Wz+c)$를 끼우면 $W=I$, $c=0$에서 그 층은 항등사상이다. 합성곱층($C$채널, $K\times K$, $K$ 홀수, 보폭 1, 패딩 $\frac{K-1}2$)이면 필터를 $w_c[i,j,d]=1$ ($d=c$, $i=j=\frac{K-1}2$), 나머지 0, 편향 0으로 두면 그렇다.
- (iii) 잔차 블록 $h\mapsto h+F(h)$, $F(h)=W_2\ReLU(W_1h+b_1)+b_2$는 $W_2=0$, $b_2=0$이면 모든 $h$에서 항등사상이다.

따라서 얕은 망에 이런 층이나 블록을 더한 깊은 망은 훈련 손실의 하한이 얕은 망의 것 이하이고, 깊은 망의 훈련 오차가 더 높게 나왔다면 그것은 더 좋은 매개변수가 없어서가 아니라 학습(최적화)이 그것을 찾지 못한 것이다.`,
    body: R`
**1. 함수 집합의 포함 (i).** 아무 $\theta_A$를 잡으면 가정에서 $f_{\theta_B}=f_{\theta_A}$인 $\theta_B$가 있고, 손실은 함수의 값으로만 계산되므로 $J_B(\theta_B)=J_A(\theta_A)$입니다. 따라서 $\inf J_B\le J_A(\theta_A)$이고, 이것이 모든 $\theta_A$에서 성립하므로 오른쪽의 하한을 취하면 $\inf J_B\le\inf J_A$입니다.

**2. 완전연결 항등 층 (ii).** ReLU를 막 통과한 벡터 $z$는 모든 성분이 $z_k\ge0$입니다. 끼운 층을 $W=I$, $c=0$으로 두면 $\ReLU(Iz+0)_k=\max(0,z_k)=z_k$, 곧 그 층은 항등사상입니다. 얕은 망 $f=g\circ\phi_m\circ\cdots\circ\phi_1$ ($\phi_k$는 ReLU로 끝나는 층)의 $\phi_k$ 뒤에 이 층을 끼운 망은 모든 입력에서 $f$와 같은 값을 내고, 여러 층을 끼워도 마찬가지입니다.

**3. 합성곱 항등 층 (ii).** 보폭 1, 패딩 $P=\frac{K-1}2$이면 출력 크기 공식에서 가로·세로가 그대로입니다. 0을 $P$칸 덧댄 입력을 $\bar F$라 하면 주어진 필터로
$$\begin{aligned}G_c[x,y]&=\sum_{i,j,d}w_c[i,j,d]\,\bar F[x+i,\ y+j,\ d]\\&=\bar F[x+P,\ y+P,\ c]=F[x,y,c]\end{aligned}$$
입니다(덧댄 입력의 $(x+P,y+P)$칸이 원래의 $(x,y)$칸). ReLU 뒤의 입력이라 $F\ge0$이므로 다시 ReLU를 거쳐도 그대로입니다.

**4. 잔차 블록 (iii).** $W_2=0$, $b_2=0$이면 $W_1,b_1$이 무엇이든 $F(h)=0\cdot\ReLU(W_1h+b_1)+0=0$이라 $h+F(h)=h$입니다. 여기서는 $h$의 부호에 대한 조건도 필요 없습니다.

**5. 결론.** 2–4로 얕은 망이 나타내는 모든 함수를 깊은 망도 나타내므로, 1에서 깊은 망의 훈련 손실의 하한은 얕은 망의 것 이하입니다. 16.6절의 실험에서 56층 단순 망의 훈련 오차가 20층보다 높았던 것은, 더 낮은 훈련 오차를 내는 매개변수가 존재하는데도 학습이 그것을 찾지 못했다는 뜻입니다. 과적합이라면 훈련 오차는 낮고 테스트 오차만 높아야 합니다.`,
    note: R`표현력만 보면 단순 망도 항등사상을 나타낼 수 있지만(2–3), 그 매개변수는 $W=I$라는 특정한 점입니다. 작은 무작위 값으로 초기화한 망은 그 점에서 멀어 학습이 거기까지 가야 합니다. 잔차 블록에서는 항등사상이 $W_2=0$, 곧 작은 가중치 근처에 있어 “아무것도 하지 않는” 블록이 쉽게 얻어집니다(16.6절). ResNet은 더한 뒤에 ReLU를 한 번 더 쓰지만 $h\ge0$ (앞이 ReLU)이면 $\ReLU(h+0)=h$라 결론이 같습니다.` },
  );
  // 길잡이 (본문 600자 이상, plan-a.js와 같은 형식)
  Object.assign(EM.plans, {
    'ch14-newton': {
      easy: R`보일 것은 두 가지입니다. 이차함수에서는 뉴턴법이 한 걸음에 바닥에 닿는다는 것, 그리고 좌표마다 다른 학습률을 쓰는 경사하강법(대각 전처리)은 ‘좌표의 눈금을 바꾼 공간에서의 보통 경사하강법’이라는 것입니다. 요령은 기울기를 $\nabla f(x)=H(x-x^*)$, 곧 바닥에서 떨어진 정도로 쓰는 것입니다.

눈금을 $D^{1/2}$로 바꾸면 헤시안이 $\tilde H=D^{-1/2}HD^{-1/2}$로 바뀌므로, 조건수와 경사하강법의 결론이 $\kappa$ 대신 $\tilde\kappa$로 그대로 나옵니다. $D$가 곡률을 정확히 맞추면 $\tilde\kappa=1$이 되어 뉴턴법과 같아집니다.`,
      easyEn: R`Two things are shown. For a quadratic, Newton's method reaches the bottom in one step; and gradient descent with a different learning rate per coordinate (diagonal preconditioning) is “ordinary gradient descent in a space whose coordinate scales have been changed”. The trick is to write the gradient as $\nabla f(x)=H(x-x^*)$, that is, in terms of the distance from the bottom.

Rescaling the coordinates by $D^{1/2}$ changes the Hessian into $\tilde H=D^{-1/2}HD^{-1/2}$, so the conclusions about the condition number and gradient descent carry over with $\tilde\kappa$ in place of $\kappa$. If $D$ matches the curvature exactly, $\tilde\kappa=1$ and the method coincides with Newton's.`,
      nodes: [
        { id: 'min', at: '**1. 최솟점.**', t: R`유일한 최솟점`, en: R`The unique minimizer`,
          d: R`완전제곱으로 $f(x)-f(x^*)=\frac12(x-x^*)^TH(x-x^*)>0$을 보여 $x^*$가 유일한 바닥임을 확인합니다.`,
          dEn: R`Completing the square gives $f(x)-f(x^*)=\frac12(x-x^*)^TH(x-x^*)>0$, so $x^*$ is the only bottom.` },
        { id: 'newton', at: '**2. 뉴턴 한 걸음.**', t: R`뉴턴 한 걸음`, en: R`One Newton step`,
          d: R`$\nabla f=H(x-x^*)$에 $H^{-1}$을 곱해 빼면 어디서 출발하든 $x^*$에 떨어집니다.`,
          dEn: R`Multiplying $\nabla f=H(x-x^*)$ by $H^{-1}$ and subtracting lands on $x^*$ from any starting point.` },
        { id: 'scale', at: '**3. 좌표 바꾸기.**', t: R`눈금 바꾸기`, en: R`Rescale the coordinates`,
          d: R`오차를 $e_t=D^{1/2}(x_t-x^*)$로 재면 전처리한 GD가 $e_{t+1}=(I-\alpha\tilde H)e_t$, 곧 $\tilde H$에 대한 보통 GD가 됩니다.`,
          dEn: R`Measuring the error as $e_t=D^{1/2}(x_t-x^*)$ turns preconditioned GD into $e_{t+1}=(I-\alpha\tilde H)e_t$, ordinary GD for $\tilde H$.` },
        { id: 'kappa', at: '**4. 조건수', t: R`$\tilde\kappa$가 속도를 정함`, en: R`$\tilde\kappa$ sets the speed`,
          d: R`$\tilde H$가 대칭 양의 정부호임을 보이고, 조건수의 증명을 $\tilde H$에 그대로 적용합니다.`,
          dEn: R`Show that $\tilde H$ is symmetric positive definite and apply the condition-number proof to $\tilde H$ as it stands.` },
        { id: 'full', at: '**5. 완전한', t: R`완전한 전처리 = 뉴턴법`, en: R`Perfect preconditioning = Newton`,
          d: R`$H$가 대각이고 $D=H$이면 $\tilde H=I$라 $\alpha=1$로 한 걸음 — 뉴턴법과 같은 걸음입니다.`,
          dEn: R`If $H$ is diagonal and $D=H$, then $\tilde H=I$ and $\alpha=1$ finishes in one step, the same step as Newton's.` },
      ],
    },
    'ch14-hbrate': {
      easy: R`보일 것은 최적으로 고른 모멘텀이 모든 고유방향의 오차를 걸음마다 같은 비율 $\sqrt\rho=\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$로 줄인다는 것입니다. 경사하강법과 달리 모멘텀은 직전 두 점을 쓰므로 고유방향마다 2계 선형 점화식이 나오고, 이런 점화식은 특성방정식의 근 $z$로 만든 $z^t$ 꼴의 해로 풉니다.

열쇠는 근이 켤레복소수이면 크기가 두 근의 곱의 제곱근, 곧 정확히 $\sqrt\rho$라는 것입니다. 주어진 $\alpha$와 $\rho$는 가장 완만한 방향과 가장 가파른 방향이 경계(중근)에 놓이도록 맞춘 값이라, 그 사이의 모든 방향도 같은 크기의 근을 갖습니다.`,
      easyEn: R`We must show that optimally tuned momentum shrinks the error of every eigendirection by the same factor $\sqrt\rho=\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$ per step. Unlike gradient descent, momentum uses the two previous points, so each eigendirection gives a second-order linear recurrence, which is solved with sequences $z^t$ built from the roots $z$ of the characteristic equation.

The key is that complex conjugate roots have size equal to the square root of their product, exactly $\sqrt\rho$. The given $\alpha$ and $\rho$ are tuned so that the flattest and the steepest directions sit on the boundary (a double root), so every direction in between has roots of the same size.`,
      nodes: [
        { id: 'split', at: '**1. 고유방향으로', t: R`고유방향으로 나누기`, en: R`Split along eigendirections`,
          d: R`대각화로 $u_{t+1,i}=b_iu_{t,i}-\rho u_{t-1,i}$, 성분마다 따로인 2계 점화식을 얻습니다.`,
          dEn: R`Diagonalizing gives $u_{t+1,i}=b_iu_{t,i}-\rho u_{t-1,i}$, a separate second-order recurrence for each component.` },
        { id: 'solve', at: '**2. 특성근으로', t: R`특성근으로 풀기`, en: R`Solve with characteristic roots`,
          d: R`$z^t$ (중근이면 $tz^t$도)가 해이고, 초기값 두 개에 맞춘 일차결합이 유일한 해입니다.`,
          dEn: R`$z^t$ (and $tz^t$ for a double root) are solutions, and the combination fitted to the two initial values is the unique solution.` },
        { id: 'size', at: '**3. 근의 크기.**', t: R`근의 크기 $=\sqrt\rho$`, en: R`Root size $=\sqrt\rho$`,
          d: R`판별식이 0 이하이면 두 근의 크기가 $\sqrt\rho$이고, 그 조건은 $(1-\sqrt\rho)^2\le\alpha\lambda\le(1+\sqrt\rho)^2$입니다.`,
          dEn: R`If the discriminant is at most 0, both roots have size $\sqrt\rho$, and the condition reads $(1-\sqrt\rho)^2\le\alpha\lambda\le(1+\sqrt\rho)^2$.` },
        { id: 'check', at: '**4. 주어진', t: R`모든 방향에서 성립`, en: R`It holds in every direction`,
          d: R`주어진 $\alpha,\rho$에서 구간의 양 끝이 정확히 $\alpha\lambda_{\min}$, $\alpha\lambda_{\max}$라 모든 고윳값이 조건을 만족합니다.`,
          dEn: R`For the given $\alpha,\rho$ the ends of the interval are exactly $\alpha\lambda_{\min}$ and $\alpha\lambda_{\max}$, so every eigenvalue satisfies the condition.` },
        { id: 'concl', at: '**5. 결론.**', t: R`$\kappa$ 대신 $\sqrt\kappa$`, en: R`$\sqrt\kappa$ instead of $\kappa$`,
          d: R`성분별 상계를 모아 $\lVert x_t\rVert\le C(1+t)s^t$. $\kappa=100$이면 $1/e$로 줄이는 데 약 5걸음(GD는 약 50걸음)입니다.`,
          dEn: R`Collecting the bounds gives $\lVert x_t\rVert\le C(1+t)s^t$. For $\kappa=100$, shrinking by $1/e$ takes about 5 steps (GD: about 50).` },
      ],
    },
    'ch14-adamscale': {
      easy: R`Adam의 걸음이 왜 ‘대략 $\alpha$’인지를 네 조각으로 나눠 보입니다. 먼저 편향 보정된 두 모멘트가 과거 기울기의 **가중평균**(가중치의 합이 정확히 1)임을 확인합니다. 그러면 기울기의 단위를 바꿔도 분자와 분모가 같은 배수로 바뀌어 걸음이 그대로이고(척도 불변), 두 평균의 가중치가 같을 때는 코시-슈바르츠 부등식으로 ‘평균의 제곱 ≤ 제곱의 평균’이 되어 걸음이 $\alpha$를 넘지 못합니다.

마지막으로 기울기를 잡음 섞인 확률변수로 보면, 두 모멘트의 기댓값의 비가 ‘신호 ÷ (신호와 잡음을 합친 크기)’가 되어 1 이하임을 봅니다.`,
      easyEn: R`Why an Adam step is “about $\alpha$” is shown in four pieces. First, the two bias-corrected moments are **weighted averages** of past gradients (the weights sum to exactly 1). Then changing the unit of the gradient multiplies numerator and denominator by the same factor, so the step is unchanged (scale invariance); and when the two averages use the same weights, the Cauchy–Schwarz inequality gives “square of the mean ≤ mean of the square”, so the step cannot exceed $\alpha$.

Finally, viewing the gradient as a noisy random variable, the ratio of the expected moments is “signal ÷ (size of signal and noise together)”, which is at most 1.`,
      nodes: [
        { id: 'avg', at: '**1. 가중평균', t: R`가중평균 꼴`, en: R`Weighted-average form`,
          d: R`펼친 식을 $1-\beta^t$로 나누면 가중치의 합이 등비급수로 정확히 1입니다.`,
          dEn: R`Dividing the unrolled formula by $1-\beta^t$ makes the weights sum to exactly 1 by the geometric series.` },
        { id: 'scale', at: '**2. 척도 불변', t: R`척도 불변`, en: R`Scale invariance`,
          d: R`기울기를 $c_j$배 하면 분자는 $c_j$배, 분모는 $\sqrt{c_j^2}=c_j$배라 비가 같고, 손실 $cf$는 귀납법으로 궤적 전체가 같습니다.`,
          dEn: R`Scaling the gradient by $c_j$ scales the numerator by $c_j$ and the denominator by $\sqrt{c_j^2}=c_j$, so the ratio is unchanged; for the loss $cf$ induction gives the same whole trajectory.` },
        { id: 'bound', at: '**3. 걸음의 상계', t: R`$\beta_1=\beta_2$이면 $\le\alpha$`, en: R`$\le\alpha$ when $\beta_1=\beta_2$`,
          d: R`가중치가 같으면 코시-슈바르츠로 $\hat m_1^2\le\hat m_2$, 곧 걸음이 $\alpha$ 이하입니다.`,
          dEn: R`With equal weights, Cauchy–Schwarz gives $\hat m_1^2\le\hat m_2$, so the step is at most $\alpha$.` },
        { id: 'snr', at: '**4. 신호 대', t: R`신호 대 잡음비`, en: R`Signal-to-noise ratio`,
          d: R`기댓값은 $\bar g$와 $\bar g^2+s^2$이고, 그 비 $\lvert\bar g\rvert/\sqrt{\bar g^2+s^2}$는 1 이하입니다.`,
          dEn: R`The expectations are $\bar g$ and $\bar g^2+s^2$, and their ratio $\lvert\bar g\rvert/\sqrt{\bar g^2+s^2}$ is at most 1.` },
      ],
    },
    'ch15-flip': {
      easy: R`딥러닝의 ‘합성곱’은 필터를 뒤집지 않는 교차상관입니다. 보일 것은 이것이 아무 차이를 만들지 않는다는 것, 곧 필터를 뒤집어 두면 두 연산이 같은 값을 내고 학습도 같은 길을 따라간다는 것입니다.

요령은 합의 지표를 $i'=K-1-i$로 바꾸는 것뿐입니다. 뒤집기는 성분의 자리만 바꾸는 순열이라 되돌릴 수 있고 기울기와도 맞물리므로, 학습된 필터가 뒤집혀 나올 뿐입니다.`,
      easyEn: R`The “convolution” of deep learning is a cross-correlation that does not flip the filter. We show that this makes no difference: with the filter flipped, the two operations give the same values, and training follows the same path.

The only trick is to change the summation index to $i'=K-1-i$. Flipping just permutes the entries, so it can be undone and it commutes with taking gradients; the learned filter simply comes out flipped.`,
      nodes: [
        { id: 'idx', at: '**1. 지표', t: R`지표 바꾸기`, en: R`Change the index`,
          d: R`$i'=K-1-i$로 바꾸면 뒤집은 필터의 합성곱이 원래 필터의 교차상관과 같아집니다(출력 번호만 $K-1$ 밀림).`,
          dEn: R`With $i'=K-1-i$ the convolution with the flipped filter equals the cross-correlation with the original one (output numbers shifted by $K-1$).` },
        { id: 'same', at: '**2. 같은', t: R`같은 함수 집합`, en: R`The same set of functions`,
          d: R`두 번 뒤집으면 제자리라 뒤집기는 일대일 대응이고, 두 층이 나타내는 함수가 같습니다.`,
          dEn: R`Flipping twice is the identity, so flipping is a one-to-one correspondence and the two layers represent the same functions.` },
        { id: 'train', at: '**3. 학습도', t: R`학습도 대응`, en: R`Training corresponds`,
          d: R`뒤집기 순열 $R$은 $R^T=R^{-1}=R$이라 기울기와 맞물리고, 귀납법으로 $v_t=Rw_t$가 유지됩니다.`,
          dEn: R`The flip permutation $R$ has $R^T=R^{-1}=R$, so it commutes with gradients, and induction keeps $v_t=Rw_t$.` },
      ],
    },
    'ch15-convlinear': {
      easy: R`합성곱층을 ‘특별한 모양의 행렬을 곱하는 선형층’으로 다시 쓰고, 그 덕분에 역전파 공식이 9단원의 규칙에서 바로 나온다는 것을 보입니다. 행렬의 모양은 두 성질로 정해집니다. 출력 한 칸은 $K\times K$ 조각만 보므로 행마다 0이 아닌 자리가 $K^2$개(국소 연결)이고, 그 값은 어느 행이든 같은 필터 값(가중치 공유)입니다.

필터의 기울기는 ‘여러 곳에 쓰인 변수의 기울기는 더한다’로, 입력의 기울기는 ‘행렬곱의 역전파는 전치를 곱한다’로 얻고, 지표를 바꾸어 보면 둘 다 다시 합성곱 꼴이 됩니다.`,
      easyEn: R`We rewrite a convolution layer as “a linear layer that multiplies by a specially shaped matrix”, and then the backpropagation formulas follow directly from the rules of Unit 9. Two properties fix the shape of the matrix: one output cell looks only at a $K\times K$ patch, so each row has $K^2$ places that can be nonzero (local connectivity), and the values are the same filter values in every row (weight sharing).

The gradient of the filter comes from “the gradient of a variable used in several places is the sum”, and the gradient of the input from “backpropagation through a matrix product multiplies by the transpose”; after changing the index, both turn out to be convolutions again.`,
      nodes: [
        { id: 'mat', at: '**1. 선형성과', t: R`희소하고 공유된 행렬`, en: R`A sparse, shared matrix`,
          d: R`지표를 $u=x+i$로 바꿔 출력이 행렬–벡터 곱임을 보이고, 행마다 $K^2$칸에 같은 필터 값이 놓임을 확인합니다.`,
          dEn: R`Changing the index to $u=x+i$ shows the output is a matrix–vector product, with the same filter values in $K^2$ cells of each row.` },
        { id: 'wgrad', at: '**2. 필터의', t: R`필터의 기울기`, en: R`The filter gradient`,
          d: R`공유된 $w[i,j]$는 모든 출력에 쓰이므로 연쇄법칙의 항을 모두 더해 $\sum_{x,y}\delta[x,y]F[x+i,y+j]$를 얻습니다.`,
          dEn: R`The shared $w[i,j]$ is used in every output, so adding all chain-rule terms gives $\sum_{x,y}\delta[x,y]F[x+i,y+j]$.` },
        { id: 'xgrad', at: '**3. 입력의', t: R`입력의 기울기`, en: R`The input gradient`,
          d: R`입력의 기울기는 $W_{\text{conv}}^T\delta$이고, 지표를 바꾸면 뒤집은 필터와의 합성곱입니다.`,
          dEn: R`The input gradient is $W_{\text{conv}}^T\delta$; after changing the index it is a convolution with the flipped filter.` },
      ],
    },
    'ch15-poolgrad': {
      easy: R`풀링에는 학습할 매개변수가 없으므로, 역전파에서 할 일은 상류 기울기를 입력 칸들에 나눠 주는 것뿐입니다. 먼저 창 하나의 국소 기울기를 구하고(평균은 모두 $1/F^2$, 최대는 최댓값 칸만 1), 연쇄법칙으로 한 칸이 들어간 모든 창의 몫을 더합니다.

창이 겹치는지(보폭 $S$와 창 크기 $F$의 비교)가 한 칸이 몇 개의 몫을 받는지를 정합니다. 마지막으로 출력 크기와 ‘매개변수 없음’을 확인합니다.`,
      easyEn: R`Pooling has no learnable parameters, so all backpropagation has to do is distribute the upstream gradient over the input cells. First find the local gradient of one window (all $1/F^2$ for the average, 1 only at the maximizing cell for the maximum), then use the chain rule to add up the shares of all windows a cell belongs to.

Whether windows overlap (stride $S$ compared with window size $F$) decides how many shares a cell receives. Finally we confirm the output size and that there are no parameters.`,
      nodes: [
        { id: 'local', at: '**1. 국소', t: R`국소 기울기`, en: R`Local gradients`,
          d: R`평균 풀링은 일차식이라 $1/F^2$, 최대 풀링은 최댓값 칸이 하나뿐이면 근방에서 그 칸의 값과 같아 그 칸만 1입니다.`,
          dEn: R`Average pooling is linear, giving $1/F^2$; max pooling with a unique maximizer equals that cell's value nearby, so only that cell gets 1.` },
        { id: 'chain', at: '**2. 연쇄법칙.**', t: R`연쇄법칙으로 모으기`, en: R`Collect with the chain rule`,
          d: R`한 칸의 기울기는 그 칸을 포함하는 모든 창의 $\delta_{m,n}\,\partial y_{m,n}/\partial x_{pq}$의 합입니다.`,
          dEn: R`The gradient of a cell is the sum of $\delta_{m,n}\,\partial y_{m,n}/\partial x_{pq}$ over all windows containing it.` },
        { id: 'overlap', at: '**3. 겹침.**', t: R`창의 겹침`, en: R`Overlapping windows`,
          d: R`$S\ge F$이면 창이 겹치지 않아 항이 많아야 하나, $S<F$ (AlexNet)이면 여러 창의 기울기를 더해 받습니다.`,
          dEn: R`If $S\ge F$ the windows do not overlap and there is at most one term; if $S<F$ (AlexNet) a cell receives the sum over several windows.` },
        { id: 'size', at: '**4. 크기와', t: R`크기와 매개변수`, en: R`Size and parameters`,
          d: R`출력 크기는 합성곱과 같은 셈이고, 정해 둔 함수만 쓰므로 매개변수가 없으며 채널 수는 그대로입니다.`,
          dEn: R`The output size is the same count as for convolution; only fixed functions are used, so there are no parameters and the channel count is unchanged.` },
      ],
    },
    'ch16-flops': {
      easy: R`매개변수(메모리)와 계산량(곱셈 수)은 다른 것을 셉니다. 요령은 곱셈 수를 ‘가중치 수 × 그 가중치가 다시 쓰이는 횟수’로 쓰는 것입니다. 합성곱층의 가중치는 모든 출력 위치에서 다시 쓰이므로 $N'^2$번, 완전연결층의 가중치는 한 번씩만 쓰입니다.

이 원리를 AlexNet의 여덟 층에 적용해 실제로 세면, 매개변수의 94%는 완전연결층에, 곱셈의 약 95%는 합성곱층에 있다는 정반대의 분포가 나옵니다.`,
      easyEn: R`Parameters (memory) and computation (multiplications) count different things. The trick is to write the number of multiplications as “number of weights × number of times each weight is reused”. A convolution weight is reused at every output position, $N'^2$ times; a fully connected weight is used only once.

Applying this to the eight layers of AlexNet and counting gives opposite distributions: 94% of the parameters are in the fully connected layers, about 95% of the multiplications in the convolution layers.`,
      nodes: [
        { id: 'conv', at: '**1. 합성곱층.**', t: R`합성곱층의 곱셈 수`, en: R`Multiplications of a convolution layer`,
          d: R`출력 칸마다 $K^2C_{\text{in}}$번, 칸이 $N'^2C_{\text{out}}$개라 (가중치 수)$\times N'^2$입니다.`,
          dEn: R`$K^2C_{\text{in}}$ per output cell and $N'^2C_{\text{out}}$ cells give (number of weights)$\times N'^2$.` },
        { id: 'fc', at: '**2. 완전연결층.**', t: R`완전연결층의 곱셈 수`, en: R`Multiplications of a fully connected layer`,
          d: R`출력마다 $d_{\text{in}}$차원 내적이라 곱셈 수가 가중치 수와 같습니다.`,
          dEn: R`Each output is a $d_{\text{in}}$-dimensional inner product, so the multiplications equal the number of weights.` },
        { id: 'params', at: '**3. AlexNet의 매개변수.**', t: R`AlexNet의 매개변수`, en: R`AlexNet's parameters`,
          d: R`층별 매개변수를 더하면 완전연결 세 층이 전체의 약 94.0%입니다.`,
          dEn: R`Adding the layers' parameters, the three fully connected layers hold about 94.0% of the total.` },
        { id: 'mults', at: '**4. AlexNet의 곱셈', t: R`AlexNet의 곱셈 수`, en: R`AlexNet's multiplications`,
          d: R`같은 층들의 곱셈을 세면 합성곱 다섯 층이 약 94.8%입니다.`,
          dEn: R`Counting the multiplications of the same layers, the five convolution layers take about 94.8%.` },
        { id: 'why', at: '**5. 왜', t: R`왜 반대인가`, en: R`Why they are opposite`,
          d: R`재사용 횟수가 합성곱은 $N'^2$ (169–3025), 완전연결은 1이라 두 분포가 뒤집힙니다.`,
          dEn: R`The reuse count is $N'^2$ (169–3025) for convolution and 1 for fully connected layers, so the two distributions flip.` },
      ],
    },
    'ch16-deepshallow': {
      easy: R`슬라이드의 주장 ‘깊은 망은 적어도 얕은 망만큼 훈련 데이터를 맞출 수 있어야 한다’를 정확히 증명합니다. 요령은 얕은 망에 끼운 층들이 **아무것도 하지 않도록**(항등사상) 매개변수를 고를 수 있음을 보이는 것입니다. 그러면 얕은 망의 모든 함수가 깊은 망의 함수이기도 하므로, 훈련 손실을 작게 할 여지는 깊은 망 쪽이 더 큽니다.

항등사상은 단순 망에서는 $W=I$ (ReLU 뒤의 입력이 음이 아니라서 가능), 합성곱에서는 가운데만 1인 필터, 잔차 블록에서는 $W_2=0$으로 만듭니다. 그런데도 깊은 망의 훈련 오차가 더 높았다면 남는 설명은 최적화가 그 매개변수를 찾지 못했다는 것뿐입니다.`,
      easyEn: R`We prove exactly the slide's claim that “a deeper network should fit the training data at least as well as a shallower one”. The trick is to show that the inserted layers can be given parameters with which they **do nothing** (the identity map). Then every function of the shallow network is also a function of the deep one, so the deep network has at least as much room to make the training loss small.

The identity is made with $W=I$ in a plain network (possible because the input after a ReLU is nonnegative), with a filter that is 1 only at the center in a convolution layer, and with $W_2=0$ in a residual block. If the deeper network still had a higher training error, the only explanation left is that optimization failed to find those parameters.`,
      nodes: [
        { id: 'incl', at: '**1. 함수 집합', t: R`함수 집합이 크면 하한이 작다`, en: R`A larger function set, a lower infimum`,
          d: R`같은 함수를 내는 매개변수가 있으면 손실이 같으므로, 하한을 취해 $\inf J_B\le\inf J_A$.`,
          dEn: R`Parameters giving the same function give the same loss, so taking infima gives $\inf J_B\le\inf J_A$.` },
        { id: 'fc', at: '**2. 완전연결', t: R`완전연결 항등 층`, en: R`A fully connected identity layer`,
          d: R`ReLU 뒤의 입력은 음이 아니므로 $\ReLU(Iz)=z$입니다.`,
          dEn: R`The input after a ReLU is nonnegative, so $\ReLU(Iz)=z$.` },
        { id: 'conv', at: '**3. 합성곱', t: R`합성곱 항등 층`, en: R`A convolutional identity layer`,
          d: R`크기 보존 패딩과 가운데만 1인 필터로 각 채널을 그대로 복사합니다.`,
          dEn: R`Size-preserving padding and a filter that is 1 only at the center copy each channel unchanged.` },
        { id: 'res', at: '**4. 잔차 블록', t: R`잔차 블록: $F=0$`, en: R`Residual block: $F=0$`,
          d: R`$W_2=0$, $b_2=0$이면 어떤 입력에서도 $F(h)=0$이라 블록이 항등사상입니다.`,
          dEn: R`With $W_2=0$, $b_2=0$, $F(h)=0$ for every input, so the block is the identity.` },
        { id: 'concl', at: '**5. 결론.**', t: R`최적화의 문제`, en: R`An optimization problem`,
          d: R`깊은 망의 함수 집합이 얕은 망의 것을 포함하므로, 더 높은 훈련 오차는 최적화의 실패를 뜻합니다(과적합이면 훈련 오차가 낮아야 함).`,
          dEn: R`The deep network's function set contains the shallow one's, so a higher training error means failed optimization (overfitting would give a low training error).` },
      ],
    },
  });
})();
