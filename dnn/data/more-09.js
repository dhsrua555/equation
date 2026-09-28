/* 추가 연습문제 — 09 역전파. 계산 그래프 손계산과 벡터·행렬 역전파 유도를 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 9,
    problems: [
      { sec: '9.4', type: 'num', lv: 2, q: R`$f(x,y,z)=xy+\max(x,z)$, $(x,y,z)=(3,-2,1)$에서 $\partial f/\partial x$는?`, ans: '-1', ansTex: R`-1`,
        sol: R`$x$는 곱셈 노드와 최댓값 노드 두 곳으로 흐릅니다(복사 → 더하기). 곱셈: 상대 입력 $y=-2$. 최댓값: $x=3>z=1$이라 $x$ 쪽으로 1. 합 $-2+1=-1$. ($\partial f/\partial z=0$.)` },
      { sec: '9.3', type: 'num', lv: 1, q: R`시그모이드 뉴런 $f=\sigma(w_0x_0+w_1x_1+w_2)$에서 $w=(1,-1,1)$, $x=(2,3)$일 때 $\partial f/\partial w_0$은?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$z=2-3+1=0$, $\sigma(0)=\tfrac12$, $\sigma'(0)=\tfrac14$. $\partial f/\partial w_0=\sigma'(z)x_0=\tfrac14\cdot2=0.5$.` },
      { sec: '9.6', type: 'num', lv: 3, q: R`$x=(2,-1)$, $W_1=\begin{pmatrix}1&1\\-1&2\end{pmatrix}$, $b_1=(0,1)$, ReLU, $W_2=(2\ \ {-1})$, $b_2=0.5$, 목표 $t=0$, 손실 $\frac12(y-t)^2$일 때 $\partial L/\partial(W_1)_{12}$ (1행 2열)은?`, ans: '-5', ansTex: R`-5`,
        sol: R`순전파: $a_1=(2-1,\ -2-2+1)=(1,-3)$, $h=(1,0)$, $y=2+0.5=2.5$. $\delta_2=2.5$. $W_2^T\delta_2=(5,-2.5)$, ReLU$'$$=(1,0)$ → $\delta_1=(5,0)$. $\partial L/\partial W_1=\delta_1x^T=\begin{pmatrix}10&-5\\0&0\end{pmatrix}$. (1,2) 성분은 $-5$.` },
      { sec: '9.5', type: 'open', lv: 3, proof: true, q: R`$z=Wx+b$ ($W\in\mathbb R^{M\times N}$), 상류 기울기 $\delta=\partial L/\partial z$일 때 $\frac{\partial L}{\partial x}=W^T\delta$, $\frac{\partial L}{\partial W}=\delta x^T$, $\frac{\partial L}{\partial b}=\delta$를 성분 계산으로 유도하세요.`,
        sol: R`
$z_i=\sum_jW_{ij}x_j+b_i$. $L$은 $z$를 통해서만 의존하므로 연쇄법칙 $\frac{\partial L}{\partial\theta}=\sum_i\frac{\partial L}{\partial z_i}\frac{\partial z_i}{\partial\theta}$.
- $\frac{\partial z_i}{\partial x_j}=W_{ij}$ → $\frac{\partial L}{\partial x_j}=\sum_i\delta_iW_{ij}=(W^T\delta)_j$.
- $\frac{\partial z_k}{\partial W_{ij}}=\delta_{ki}x_j$ (크로네커 델타) → $\frac{\partial L}{\partial W_{ij}}=\delta_ix_j=(\delta x^T)_{ij}$.
- $\frac{\partial z_k}{\partial b_i}=\delta_{ki}$ → $\frac{\partial L}{\partial b_i}=\delta_i$.`,
        rubric: R`
- 성분 표현과 다변수 연쇄법칙 — 3점
- $x$에 대한 기울기(합이 남는 이유) — 3점
- $W$에 대한 기울기(한 항만 남는 이유) — 3점
- 편향 — 1점` },
      { sec: '9.6', type: 'open', lv: 3, proof: true, q: R`MLP $a_\ell=W_\ell h_{\ell-1}+b_\ell$, $h_\ell=\sigma(a_\ell)$에서 $\delta_\ell=\partial L/\partial a_\ell$이 $\delta_\ell=\sigma'(a_\ell)\odot(W_{\ell+1}^T\delta_{\ell+1})$를 만족함을 유도하고, 출력이 소프트맥스 + 교차 엔트로피일 때 $\delta_L=p-y$임을 쓰세요.`,
        sol: R`
$a_{\ell+1}=W_{\ell+1}h_\ell+b_{\ell+1}$이고 $L$은 $h_\ell$에 $a_{\ell+1}$을 통해서만 의존하므로(행렬곱 규칙) $\frac{\partial L}{\partial h_\ell}=W_{\ell+1}^T\delta_{\ell+1}$.
$h_\ell=\sigma(a_\ell)$은 성분별이라 야코비안이 대각 $\diag(\sigma'(a_\ell))$: $\delta_\ell=\sigma'(a_\ell)\odot\frac{\partial L}{\partial h_\ell}$.
출력: $L=-\sum_ky_k\log p_k$, $p=\softmax(a_L)$이면 $\frac{\partial L}{\partial a_{L,m}}=-\sum_k\frac{y_k}{p_k}p_k(\delta_{km}-p_m)=p_m-y_m$ ($\sum y_k=1$).`,
        rubric: R`
- $h_\ell$에 대한 기울기 — 4점
- 성분별 활성화의 대각 야코비안 — 3점
- 소프트맥스 출력의 $\delta_L$ — 3점` },
      { sec: '9.1', type: 'num', lv: 2, q: R`$f(w)=w^3$의 $w=2$에서의 도함수를 중심차분 $\frac{f(w+h)-f(w-h)}{2h}$, $h=0.01$로 근사한 값은? (소수 넷째 자리)`, ans: '12.0001', ansTex: R`12.0001`,
        sol: R`$\frac{2.01^3-1.99^3}{0.02}=\frac{8.120601-7.880599}{0.02}=12.0001$. 참값 12와의 오차 $h^2=10^{-4}$ — 중심차분의 오차는 $O(h^2)$입니다. 기울기 검사에 씁니다.` },
      { sec: '9.2', type: 'mc', lv: 2, q: R`역전파를 하려면 순전파 때 각 노드의 입력값을 저장해 두어야 하는 이유는?`,
        choices: [R`출력 확률을 다시 계산하기 위해`, R`국소 기울기(예: 곱셈 게이트의 상대 입력, ReLU의 부호)가 순전파 값에 의존하기 때문`, R`학습률을 정하기 위해`, R`저장할 필요가 없다`], ans: 1,
        sol: R`예: $z=xy$의 국소 기울기는 $y$, $x$이고 $\sigma$의 국소 기울기는 $\sigma(a)(1-\sigma(a))$입니다. 그래서 역전파의 메모리 비용은 저장한 활성값의 크기입니다.` },
      { sec: '9.3', type: 'open', lv: 2, proof: true, q: R`$f=\tanh(w^Tx+b)$에 대해 $\nabla_wf$와 $\partial f/\partial b$를 계산 그래프(선형 → tanh)의 역전파로 유도하세요.`,
        sol: R`
$a=w^Tx+b$, $f=\tanh a$. 출력에서 $\partial f/\partial f=1$. tanh 노드의 국소 기울기 $1-\tanh^2a=1-f^2$ → $\partial f/\partial a=1-f^2$.
$a=\sum_jw_jx_j+b$: 곱셈 게이트로 $\partial a/\partial w_j=x_j$, 덧셈으로 $\partial a/\partial b=1$.
따라서 $\nabla_wf=(1-f^2)x$, $\partial f/\partial b=1-f^2$.`,
        rubric: R`
- 그래프와 순전파 — 2점
- tanh 국소 기울기 — 4점
- 가중치·편향 기울기 — 4점` },
      { sec: '9.4', type: 'num', lv: 1, q: R`$z=\max(x,y)$에서 $x=-1$, $y=-3$, 상류 기울기 $6$이면 $\partial L/\partial y$는?`, ans: '0', ansTex: R`0`,
        sol: R`큰 쪽은 $x=-1$이므로 기울기 6은 모두 $x$로, $y$는 0.` },
    ],
  });
})();
