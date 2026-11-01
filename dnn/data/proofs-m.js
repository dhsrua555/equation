/* 증명 — 19단원: 9주차 수요일 슬라이드 1–17과 슬라이드 9 뒤 필기의 순환 신경망(두 단계 RNN의 기울기, 여러 단계 역전파, BPTT 점화식,
   기울기 소실·폭발의 조건, 잘라내기, 잘린 BPTT). src가 있는 것은 수업 필기로 푼 증명이고, 나머지는 판서에 없는 증명입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  { ch: 'ch19', id: 'twostep', title: '두 단계 RNN의 기울기', keys: ['두 단계 RNN의 기울기'], src: '강의 필기 · W9 수',
    tags: 'RNN BPTT two-step gradient tanh chain rule Quiz 2 순환 신경망 두 단계 기울기 연쇄법칙 경로',
    stmt: R`$h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$ ($t=1,2$), $L=\sum_{t=1}^2\frac12(Y_t-Z_t)^2$이면 $\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t$, $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$이고
$$\frac{\partial L}{\partial W}=(Y_1-Z_1)V(1-h_1^2)h_0+(Y_2-Z_2)V(1-h_2^2)h_1+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0.$$
$\partial L/\partial U$, $\partial L/\partial b$는 각 항의 마지막 인수 $h_{s-1}$을 $X_s$, $1$로 바꾼 것이다.`,
    body: R`
**순전파와 경로.** $a_t=Wh_{t-1}+UX_t+b$, $h_t=\tanh a_t$, $Y_t=Vh_t+c$. $V$와 $c$는 $Y_t$에만 들어가므로 $L_t$마다 경로가 하나입니다. $W$, $U$, $b$는 $a_1$과 $a_2$ 두 곳에 들어가고 $h_1$이 다시 $a_2$에 들어가므로, $L_1$로 가는 경로 하나($a_1\to h_1\to L_1$)와 $L_2$로 가는 경로 둘($a_2\to h_2\to L_2$, $a_1\to h_1\to h_2\to L_2$)이 있습니다.

**국소 미분.** $\tanh'(a)=\sech^2a=1-\tanh^2a$이므로 $\frac{\partial h_t}{\partial a_t}=1-h_t^2$. $h_{t-1}$을 고정하면 $\frac{\partial a_t}{\partial W}=h_{t-1}$, $\frac{\partial a_t}{\partial U}=X_t$, $\frac{\partial a_t}{\partial b}=1$이고, 시간을 가로지르는 미분은 $\frac{\partial h_2}{\partial h_1}=(1-h_2^2)\frac{\partial a_2}{\partial h_1}=(1-h_2^2)W$. 출력 쪽은 $\frac{\partial L_t}{\partial Y_t}=Y_t-Z_t$, $\frac{\partial Y_t}{\partial h_t}=V$이므로 $\frac{\partial L_t}{\partial h_t}=(Y_t-Z_t)V$.

**V와 c.** $\frac{\partial Y_t}{\partial V}=h_t$, $\frac{\partial Y_t}{\partial c}=1$이므로 $\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t$, $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$.

**W.** 세 경로의 곱을 더하면
$$\frac{\partial L}{\partial W}=\frac{\partial L_1}{\partial h_1}\frac{\partial h_1}{\partial W}+\frac{\partial L_2}{\partial h_2}\frac{\partial h_2}{\partial W}+\frac{\partial L_2}{\partial h_2}\frac{\partial h_2}{\partial h_1}\frac{\partial h_1}{\partial W}$$
이고, 국소 미분을 넣으면 명제의 세 항이 나옵니다. 둘째 항의 $\frac{\partial h_2}{\partial W}=(1-h_2^2)h_1$은 $h_1$을 고정한 직접 미분이고, 셋째 항이 $h_1$을 거치는 간접 경로입니다.

**U와 b.** 경로는 같고 마지막 인수만 $\frac{\partial h_s}{\partial U}=(1-h_s^2)X_s$, $\frac{\partial h_s}{\partial b}=1-h_s^2$로 바뀝니다. 곧 $\partial L/\partial W$의 각 항에서 $h_{s-1}$ 자리에 $X_s$, $1$을 넣은 것입니다.

**δ로 묶기.** $\delta_2=(Y_2-Z_2)V(1-h_2^2)$, $\delta_1=[(Y_1-Z_1)V+\delta_2W](1-h_1^2)$이면 $\delta_1h_0$이 첫째·셋째 항, $\delta_2h_1$이 둘째 항이므로 $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1$이고, 같은 방식으로 $\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2$, $\frac{\partial L}{\partial b}=\delta_1+\delta_2$.`,
    note: R`필기의 셋째 항 $(1-h_0^2)$는 $(1-h_2^2)$의 잘못입니다. $h_0=0$이면 $\partial L/\partial W$의 첫째·셋째 항이 사라지지만, $\partial L/\partial U$와 $\partial L/\partial b$는 세 항이 모두 남습니다.` },
  { ch: 'ch19', id: 'bptt', title: '시간 역전파의 점화식', keys: ['시간 역전파 (BPTT)'],
    tags: 'BPTT backpropagation through time recursion delta vector RNN 시간 역전파 점화식 델타 야코비안 전치',
    stmt: R`$h_t=\tanh(Wh_{t-1}+Ux_t+b)$, $Y_t=Vh_t+c$, $L=\sum_{t=1}^T\frac12\lVert Y_t-Z_t\rVert^2$에서 $\mathbf g_t=\partial L/\partial h_t$, $\boldsymbol\delta_t=\partial L/\partial a_t$ (열벡터)는
$$\mathbf g_t=V^T(Y_t-Z_t)+W^T\boldsymbol\delta_{t+1},\qquad\boldsymbol\delta_t=\diag(1-h_t^2)\mathbf g_t,\qquad\boldsymbol\delta_{T+1}=\mathbf 0$$
을 만족하고, $\frac{\partial L}{\partial W}=\sum_t\boldsymbol\delta_th_{t-1}^T$, $\frac{\partial L}{\partial U}=\sum_t\boldsymbol\delta_tx_t^T$, $\frac{\partial L}{\partial b}=\sum_t\boldsymbol\delta_t$, $\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t^T$, $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$이다.`,
    body: R`
**$h_t$의 두 영향.** $h_t$는 (1) $Y_t$를 통해 $L_t$에, (2) $a_{t+1}=Wh_t+Ux_{t+1}+b$를 통해 $h_{t+1}$ 이후의 모든 손실에 닿고, 다른 길은 없습니다. 열벡터 기울기의 연쇄법칙은 야코비안의 전치를 곱하는 것이므로
$$\mathbf g_t=\Big(\frac{\partial Y_t}{\partial h_t}\Big)^T\frac{\partial L_t}{\partial Y_t}+\Big(\frac{\partial a_{t+1}}{\partial h_t}\Big)^T\frac{\partial L}{\partial a_{t+1}}=V^T(Y_t-Z_t)+W^T\boldsymbol\delta_{t+1}.$$

**$a_t$로 내리기.** $h_t=\tanh(a_t)$는 성분별이라 $\frac{\partial h_t}{\partial a_t}=\diag(1-h_t^2)$이고, $a_t$는 $h_t$를 통해서만 손실에 닿으므로 $\boldsymbol\delta_t=\diag(1-h_t^2)\mathbf g_t$. 마지막 시점 $T$에는 뒤가 없으므로 $\boldsymbol\delta_{T+1}=\mathbf 0$으로 두면 $t=T$에서도 같은 식이 맞습니다. $t=T,T-1,\dots,1$ 순서로 계산하면 필요한 $\boldsymbol\delta_{t+1}$이 늘 먼저 준비되어 있습니다.

**공유된 매개변수.** 시점 $t$에서 쓰인 $W$의 복사본 $W^{(t)}$는 $a_t$에만 들어가고 $a_{t,i}=\sum_jW^{(t)}_{ij}h_{t-1,j}+\cdots$이므로 $\frac{\partial L}{\partial W^{(t)}_{ij}}=\delta_{t,i}h_{t-1,j}$, 곧 $\boldsymbol\delta_th_{t-1}^T$. 공유된 $W$의 기울기는 복사본들의 기울기의 합이므로 $\frac{\partial L}{\partial W}=\sum_t\boldsymbol\delta_th_{t-1}^T$. $U$와 $b$도 같은 방식으로 $\sum_t\boldsymbol\delta_tx_t^T$, $\sum_t\boldsymbol\delta_t$.

**V와 c.** $V$, $c$는 $Y_t$에만 들어가므로 $\frac{\partial L}{\partial V}=\sum_t\frac{\partial L_t}{\partial Y_t}h_t^T=\sum_t(Y_t-Z_t)h_t^T$, $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$.`,
    note: R`$T=2$, 스칼라이면 $\delta_2=(1-h_2^2)V(Y_2-Z_2)$, $\delta_1=(1-h_1^2)[V(Y_1-Z_1)+W\delta_2]$이고 $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1$이 필기의 세 항을 그대로 줍니다.` },
  { ch: 'ch19', id: 'multicell', title: '여러 단계 RNN의 역전파 공식', keys: ['여러 단계 RNN의 역전파'], src: '강의 필기 · W9 수',
    tags: 'RNN multi-cell backpropagation Jacobian product induction recurrent parameters 여러 단계 역전파 야코비안 곱 귀납법',
    stmt: R`$h_0=0$, $h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)$ ($\ell=1,\dots,L$), $f_\theta(X)=Ah_L+b$이면 (기울기는 행벡터)
$$\frac{\partial\mathcal L}{\partial\tilde\theta}=\sum_{\ell=1}^L\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell),\qquad\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell},\qquad\frac{\partial\mathcal L}{\partial h_L}=\frac{\partial\mathcal L}{\partial f}A.$$`,
    body: R`
**바깥 층.** $f_\theta(X)=Ah_L+b$이고 $\mathcal L$은 $f$를 통해서만 $\theta$에 의존하므로 $\frac{\partial\mathcal L}{\partial\theta}=\frac{\partial\mathcal L}{\partial f}\frac{\partial f}{\partial\theta}$. $\frac{\partial f}{\partial b}=1$, $\frac{\partial f}{\partial A}=h_L$ ($A$와 같은 모양이면 $h_L^T$), $\frac{\partial f}{\partial h_L}=A$이고, $\tilde\theta$는 $h_L$을 통해서만 들어가므로 $\frac{\partial f}{\partial\tilde\theta}=A\frac{dh_L}{d\tilde\theta}$.

**펼치기 (귀납법).** $\frac{dh_L}{d\tilde\theta}=\sum_{\ell=1}^L\frac{\partial h_L}{\partial h_\ell}\frac{\partial q}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$ ($\frac{\partial h_L}{\partial h_L}=I$)를 $L$에 대한 귀납법으로 보입니다. $L=1$이면 $h_0=0$이 $\tilde\theta$와 무관하므로 $\frac{dh_1}{d\tilde\theta}=\frac{\partial q}{\partial\tilde\theta}(h_0,u_1)$. $L-1$에서 성립하면, $h_L=q_{\tilde\theta}(h_{L-1},u_L)$에서 $\tilde\theta$가 직접, 그리고 $h_{L-1}$을 통해 들어가므로
$$\frac{dh_L}{d\tilde\theta}=\frac{\partial q}{\partial\tilde\theta}(h_{L-1},u_L)+\frac{\partial h_L}{\partial h_{L-1}}\frac{dh_{L-1}}{d\tilde\theta},$$
여기에 귀납 가정을 넣고 $\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_\ell}=\frac{\partial h_L}{\partial h_\ell}$을 쓰면 $\ell=1,\dots,L-1$의 항이 되고, 첫 항이 $\ell=L$의 항입니다.

**합치기.** 위 두 결과로 $\frac{\partial\mathcal L}{\partial\tilde\theta}=\frac{\partial\mathcal L}{\partial f}A\sum_\ell\frac{\partial h_L}{\partial h_\ell}\frac{\partial q}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$. $h_\ell$은 $h_{\ell+1},\dots,h_L$을 차례로 거쳐서만 손실에 닿으므로 연쇄법칙으로 $\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial f}A\frac{\partial h_L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell}$이고, 이를 넣으면 명제의 식입니다.

**점화식.** $q(h,u)=\phi(Wh+Uu+c)$이면 $\frac{\partial h_{\ell+1}}{\partial h_\ell}=\diag(\phi'(a_{\ell+1}))W$이므로 $\delta_\ell=\frac{\partial\mathcal L}{\partial h_\ell}$은 $\delta_L=\frac{\partial\mathcal L}{\partial f}A$, $\delta_\ell=\delta_{\ell+1}\diag(\phi'(a_{\ell+1}))W$로 한 번에 거꾸로 계산됩니다.`,
    note: R`업로드된 슬라이드에는 11–12가 빠져 있어, 펼치는 계산(귀납 단계)은 이 증명이 채운 것입니다. 슬라이드 13의 $\frac{\partial h_\ell}{\partial\tilde\theta}$는 직접 미분 $\frac{\partial q}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$로 읽어야 경로를 두 번 세지 않습니다.` },
  { ch: 'ch19', id: 'jacprod', title: '야코비안 곱의 상한과 기울기 소실·폭발의 조건', keys: ['기울기 소실·폭발의 조건'],
    tags: 'vanishing exploding gradient Jacobian product spectral norm bound RNN 기울기 소실 폭발 야코비안 노름 상한',
    stmt: R`$h_{k+1}=\phi(Wh_k+Uu_{k+1}+c)$, $\gamma=\sup_z\lvert\phi'(z)\rvert$이면 $\big\lVert\frac{\partial h_{k+1}}{\partial h_k}\big\rVert_2\le\gamma\lVert W\rVert_2$이고 $\big\lVert\frac{\partial\mathcal L}{\partial h_\ell}\big\rVert\le(\gamma\lVert W\rVert_2)^{L-\ell}\big\lVert\frac{\partial\mathcal L}{\partial h_L}\big\rVert$이다. 따라서 $\gamma\lVert W\rVert_2<1$은 기울기 소실의 충분조건이고, $\gamma\lVert W\rVert_2>1$은 기울기 폭발의 필요조건이다.`,
    body: R`
**한 걸음의 야코비안.** $a_{k+1}=Wh_k+Uu_{k+1}+c$이고 $\phi$는 성분별이므로 $\frac{\partial h_{k+1}}{\partial h_k}=\diag(\phi'(a_{k+1}))\,W$.

**대각행렬의 노름.** $D=\diag(d_1,\dots,d_n)$이면 $\lVert Dx\rVert^2=\sum_id_i^2x_i^2\le\max_id_i^2\lVert x\rVert^2$이고 등호는 가장 큰 $\lvert d_i\rvert$의 좌표축에서 이루어지므로 $\lVert D\rVert_2=\max_i\lvert d_i\rvert$. 여기서 $\lvert\phi'(a_{k+1,i})\rvert\le\gamma$이므로 $\lVert\diag(\phi'(a_{k+1}))\rVert_2\le\gamma$.

**곱 부등식.** 연산자 노름은 $\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert$를 만족하므로 $\big\lVert\frac{\partial h_{k+1}}{\partial h_k}\big\rVert_2\le\gamma\lVert W\rVert_2$. 행벡터 $\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell}$에 이를 $L-\ell$번 쓰면 ($\lVert xM\rVert\le\lVert x\rVert\lVert M\rVert_2$)
$$\Big\lVert\frac{\partial\mathcal L}{\partial h_\ell}\Big\rVert\le\big(\gamma\lVert W\rVert_2\big)^{L-\ell}\Big\lVert\frac{\partial\mathcal L}{\partial h_L}\Big\rVert.$$

**두 조건.** $\gamma\lVert W\rVert_2=\rho<1$이면 우변이 $\rho^{L-\ell}\to0$ ($L-\ell\to\infty$)이므로 소실은 피할 수 없습니다(충분조건). 대우를 취하면, 먼 시점의 기울기가 커지려면 $\rho>1$이어야 합니다(필요조건). 충분조건은 아닙니다: $\rho>1$이어도 활성값이 포화하면 $\phi'(a)\approx0$이 되어 곱이 작아질 수 있습니다.

**스칼라 예.** $h_{k+1}=\tanh(wh_k+\cdots)$에서 활성값이 작아 $\tanh'\approx1$이면 곱은 $\approx w^{L-\ell}$로, $\lvert w\rvert<1$이면 소실하고 $\lvert w\rvert>1$이면 폭발합니다($0.9^{100}\approx2.7\times10^{-5}$, $1.1^{100}\approx1.4\times10^4$).`,
    note: R`Pascanu, Mikolov, Bengio (2013)가 정리한 조건과 같습니다. $W$의 가장 큰 특잇값이 $1/\gamma$보다 작으면 소실은 확실하고, 폭발하려면 $1/\gamma$보다 커야 합니다.` },
  { ch: 'ch19', id: 'clip', title: '기울기 잘라내기의 성질', keys: ['기울기 잘라내기'],
    tags: 'gradient clipping norm threshold direction min max slide correction 기울기 잘라내기 문턱 방향 노름',
    stmt: R`$\mathbf g\ne\mathbf 0$, $v>0$에 대해 $\mathrm{clip}(\mathbf g)=\min\big(1,\frac{v}{\lVert\mathbf g\rVert}\big)\mathbf g$는 $\lVert\mathbf g\rVert\le v$이면 $\mathbf g$, 아니면 $\frac{v}{\lVert\mathbf g\rVert}\mathbf g$이고, $\mathbf g$와 방향이 같으며 $\lVert\mathrm{clip}(\mathbf g)\rVert=\min(\lVert\mathbf g\rVert,v)$이다.`,
    body: R`
**경우 나눔.** $\lVert\mathbf g\rVert\le v\iff\frac{v}{\lVert\mathbf g\rVert}\ge1$이므로 이때 $\min=1$이고 $\mathrm{clip}(\mathbf g)=\mathbf g$. 아니면 $\frac{v}{\lVert\mathbf g\rVert}<1$이 최솟값이라 $\mathrm{clip}(\mathbf g)=\frac{v}{\lVert\mathbf g\rVert}\mathbf g$.

**방향과 크기.** $s=\min\big(1,\frac{v}{\lVert\mathbf g\rVert}\big)>0$이므로 $\mathrm{clip}(\mathbf g)=s\mathbf g$는 $\mathbf g$의 양수배이고, $\lVert s\mathbf g\rVert=\min(\lVert\mathbf g\rVert,v)$.

**max로 쓰면.** $\max\big(1,\frac{v}{\lVert\mathbf g\rVert}\big)\mathbf g$는 $\lVert\mathbf g\rVert\le v$일 때 크기가 정확히 $v$로 **커지고**, 그 밖에는 $\mathbf g$ 그대로라 큰 기울기를 줄이지 못합니다. 슬라이드 15의 경우 나눔과 맞는 것은 $\min$입니다.`,
    note: R`잘라낸 걸음 $\eta\,\mathrm{clip}(\mathbf g)$의 크기는 $\eta v$ 이하이므로, 잘라내기는 그 걸음에서만 학습률을 $\eta\frac{v}{\lVert\mathbf g\rVert}$로 줄이는 것과 같습니다.` },
  { ch: 'ch19', id: 'truncated', title: '잘린 BPTT가 버리는 항', keys: ['잘린 BPTT'],
    tags: 'truncated BPTT chunk window dropped paths bias 잘린 시간 역전파 덩어리 경로',
    stmt: R`덩어리의 첫 상태 $h_{t_0}$을 상수로 두고 그 덩어리의 손실 $\sum_{t>t_0}L_t$을 역전파하면, 경로 전개 $\sum_t\sum_{s\le t}(\cdots)$에서 $s>t_0$인 항, 곧 $h_{t_0}$을 지나지 않는 경로의 항만 남는다.`,
    body: R`
**경로 전개.** 19.4의 일반식처럼 $\frac{\partial L_t}{\partial W}=\sum_{s=1}^t\frac{\partial L_t}{\partial h_t}\frac{\partial h_t}{\partial h_s}\frac{\partial h_s}{\partial W}\Big|_{\text{직접}}$이고, $s$번째 항은 $W$가 $a_s$에서 쓰인 뒤 $h_s\to\cdots\to h_t$를 지나는 경로입니다.

**상수로 두기.** $h_{t_0}$을 상수로 다루면 $\frac{dh_{t_0}}{dW}=0$으로 놓은 것이므로, $s\le t_0$인 경로($h_{t_0}$에 이르기 전에 $W$가 쓰인 경로)는 모두 0이 되고 $s>t_0$인 항만 남습니다. 덩어리 밖의 손실 $L_t$ ($t\le t_0$)는 이 덩어리에서 다루지 않습니다.`,
    note: R`버린 항은 $\frac{\partial h_t}{\partial h_s}$에 야코비안이 $t-s\ge t-t_0$번 곱해진 먼 경로라, 19.6의 소실 때문에 대개 작습니다. 그래서 잘린 기울기는 편향이 있지만 실제로 잘 작동하고, 대가는 덩어리보다 긴 의존성을 기울기로 배우지 못한다는 것입니다.` },
  );
})();
