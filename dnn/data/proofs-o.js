/* 증명 — 21단원: 10주차 월요일 슬라이드 35–80(캡셔닝의 어텐션, 스케일 점곱, 셀프 어텐션의 순열 등변성과 비용, 위치 부호화, 마스크, 멀티헤드와 인코더 블록, 층 정규화).
   슬라이드에는 결과나 그림만 있어 모두 ‘판서에 없는 증명’(src 없음)입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 21
  { ch: 'ch21', id: 'condist', title: '이미지 조건화의 의존 거리: 첫 단어 대 지름길', keys: ['이미지 조건화의 세 방식'],
    tags: 'image captioning conditioning shortcut dependency distance Jacobian RNN first word 캡셔닝 조건화 지름길 의존 거리 야코비안',
    stmt: R`바닐라 RNN $\mathbf h_t=\tanh(W_h\mathbf h_{t-1}+W_x\mathbf y_t+\mathbf b)$에서 이미지 특성 $\mathbf v$를 첫 입력으로만 넣는 경우($\mathbf h_0=\tanh(W_v\mathbf v+\mathbf b)$) $\big\lVert\frac{\partial\mathbf h_t}{\partial\mathbf v}\big\rVert\le\lVert W_h\rVert^t\lVert W_v\rVert$이다. 매 걸음 $W_z\mathbf v$를 더하는 지름길에서는 $\frac{\partial\mathbf h_t}{\partial\mathbf v}$가 $t$에 무관하게 크기 $\le\lVert W_z\rVert$인 직접 항 $D_tW_z$를 가진다.`,
    body: R`
**준비.** $D_s=\diag(1-\mathbf h_s^2)$로 두면 $0<1-h_{s,j}^2\le1$이라 $\lVert D_s\rVert\le1$이고, $\mathbf h_s=\tanh(W_h\mathbf h_{s-1}+\cdots)$의 연쇄법칙으로 $\partial\mathbf h_s/\partial\mathbf h_{s-1}=D_sW_h$입니다[[ch19:19.6|야코비안의 곱과 기울기 소실.]].

**첫 단어 방식.** $\mathbf v$는 $\mathbf h_0$를 통해서만 들어갑니다. $\partial\mathbf h_0/\partial\mathbf v=D_0W_v$이고, 연쇄법칙으로
$$\frac{\partial\mathbf h_t}{\partial\mathbf v}=D_tW_h\,D_{t-1}W_h\cdots D_1W_h\,D_0W_v$$
입니다. 노름의 곱 부등식 $\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert$과 $\lVert D_s\rVert\le1$로 $\le\lVert W_h\rVert^t\lVert W_v\rVert$. $\lVert W_h\rVert<1$이면 $t$가 커질수록 지수적으로 줄어 이미지의 영향이 사라집니다.

**지름길 방식.** $\mathbf h_t=\tanh(W_h\mathbf h_{t-1}+W_x\mathbf y_t+W_z\mathbf v+\mathbf b)$에서 $\mathbf v$는 모든 걸음에 직접 들어갑니다. $\mathbf h_t$를 $\mathbf v$에 대해 직접 미분하면(이전 상태를 고정) $D_tW_z$이고 $\lVert D_tW_z\rVert\le\lVert W_z\rVert$이며 $t$에 의존하지 않습니다. 총 미분은 이 항에 첫 단어 방식과 같은 먼 경로들($\mathbf h_{t-1}$ 등을 거치는 항)을 더한 것입니다.`,
    note: R`슬라이드 41의 ‘의존 거리 $1$’은 이 직접 항입니다. 다만 학습된 $W_z$가 작으면 모델이 이미지를 무시할 수 있다는 단점이 그대로 남고, 어텐션(21.2)은 $\mathbf v$ 대신 단어마다 새로 만든 요약 $\mathbf z^{(t)}$를 넣어 이를 보완합니다.` },
  { ch: 'ch21', id: 'softgrad', title: '소프트 어텐션의 볼록 결합, 기댓값, 점수에 대한 기울기', keys: ['소프트 어텐션 캡셔닝'],
    tags: 'soft attention convex combination hard attention expectation softmax Jacobian gradient scores 소프트 어텐션 볼록 결합 하드 어텐션 기댓값 소프트맥스 야코비안',
    stmt: R`$\alpha=\mathrm{softmax}(e)$, $\mathbf z=\sum_i\alpha_i\mathbf x_i$일 때 (1) $\lVert\mathbf z\rVert\le\max_i\lVert\mathbf x_i\rVert$, (2) $s\sim\mathrm{Categorical}(\alpha)$이면 $\mathbb E[\mathbf x_s]=\mathbf z$, (3) $\dfrac{\partial\alpha_i}{\partial e_m}=\alpha_i(\delta_{im}-\alpha_m)$이고 $\dfrac{\partial\mathbf z}{\partial e_m}=\alpha_m(\mathbf x_m-\mathbf z)$이다.`,
    body: R`
**(1) 볼록 결합.** $\alpha_i>0$이고 $\sum_i\alpha_i=1$이므로 삼각 부등식으로 $\lVert\mathbf z\rVert\le\sum_i\alpha_i\lVert\mathbf x_i\rVert\le\max_i\lVert\mathbf x_i\rVert\sum_i\alpha_i=\max_i\lVert\mathbf x_i\rVert$입니다. 곧 $\mathbf z$는 $\mathbf x_i$들의 볼록 껍질 안에 있습니다.

**(2) 하드 어텐션의 기댓값.** $P(s=i)=\alpha_i$이므로 $\mathbb E[\mathbf x_s]=\sum_iP(s=i)\mathbf x_i=\sum_i\alpha_i\mathbf x_i=\mathbf z$입니다. 소프트 어텐션은 하드 어텐션 선택의 평균입니다.

**(3) 점수의 기울기.** $\alpha_i=e^{e_i}/Z$, $Z=\sum_je^{e_j}$에서 $\partial Z/\partial e_m=e^{e_m}$이므로
$$\frac{\partial\alpha_i}{\partial e_m}=\frac{\delta_{im}e^{e_i}}{Z}-\frac{e^{e_i}e^{e_m}}{Z^2}=\alpha_i(\delta_{im}-\alpha_m).$$
따라서
$$\frac{\partial\mathbf z}{\partial e_m}=\sum_i\frac{\partial\alpha_i}{\partial e_m}\mathbf x_i=\alpha_m\mathbf x_m-\alpha_m\sum_i\alpha_i\mathbf x_i=\alpha_m(\mathbf x_m-\mathbf z).$$`,
    note: R`점수 $e_m$을 올리면 $\mathbf z$가 현재 평균에서 $\mathbf x_m$으로 향하는 방향으로 움직이고, 그 속도는 현재의 가중치 $\alpha_m$에 비례합니다. $\alpha_m\approx0$인 칸은 점수가 바뀌어도 거의 반응하지 않습니다. 하드 어텐션은 $s$를 뽑는 연산이 미분되지 않아 이런 기울기를 쓸 수 없습니다.` },
  { ch: 'ch21', id: 'scaling', title: R`$\sqrt D$로 나누는 이유: 점곱의 분산과 소프트맥스 포화`, keys: ['스케일 점곱 어텐션'],
    tags: 'scaled dot product attention variance sqrt D softmax saturation vanishing gradient Jacobian 스케일 점곱 분산 소프트맥스 포화 기울기 소실',
    stmt: R`$\mathbf q,\mathbf k\in\mathbb R^D$의 성분이 모두 독립이고 평균 $0$, 분산 $1$이면 $\mathbb E[\mathbf q\cdot\mathbf k]=0$, $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$, $\mathrm{Var}(\mathbf q\cdot\mathbf k/\sqrt D)=1$이다. 또 $\mathbf a=\mathrm{softmax}(\mathbf e)$의 야코비안은 $\partial a_i/\partial e_m=a_i(\delta_{im}-a_m)$이고, $\max_ia_i\ge1-\varepsilon$이면 모든 성분의 절댓값이 $\varepsilon$ 이하이다.`,
    body: R`
**평균.** $q_l$과 $k_l$이 독립이므로 $\mathbb E[q_lk_l]=\mathbb E[q_l]\,\mathbb E[k_l]=0$이고 $\mathbb E[\mathbf q\cdot\mathbf k]=0$입니다.

**분산.** 평균이 $0$이라 $\mathrm{Var}(q_lk_l)=\mathbb E[q_l^2k_l^2]=\mathbb E[q_l^2]\mathbb E[k_l^2]=1\cdot1=1$입니다. 서로 다른 $l$의 항 $q_lk_l$은 독립이므로 분산이 더해져 $\mathrm{Var}(\mathbf q\cdot\mathbf k)=\sum_{l=1}^D1=D$입니다. 상수 $1/\sqrt D$를 곱하면 분산은 $1/D$배가 되어 $\mathrm{Var}(\mathbf q\cdot\mathbf k/\sqrt D)=1$.

**소프트맥스의 야코비안.** $a_i=e^{e_i}/Z$, $Z=\sum_je^{e_j}$에서 $\frac{\partial a_i}{\partial e_m}=\frac{\delta_{im}e^{e_i}}{Z}-\frac{e^{e_i}e^{e_m}}{Z^2}=a_i(\delta_{im}-a_m)$입니다[[ch06:6.3|소프트맥스의 기울기.]].

**포화.** $a_{i^*}\ge1-\varepsilon$인 $i^*$를 잡으면 나머지 성분의 합은 $\le\varepsilon$입니다. 대각 성분 $a_i(1-a_i)$는 $i=i^*$일 때 $\le1-a_{i^*}\le\varepsilon$이고 $i\ne i^*$일 때 $\le a_i\le\varepsilon$입니다. 비대각 성분의 크기 $a_ia_m$ ($i\ne m$)은 둘 중 적어도 하나가 $i^*$가 아니라서 $\le\varepsilon$입니다. 따라서 포화한 소프트맥스에서는 모든 기울기가 $\varepsilon$ 이하입니다.

**결론.** 점곱의 분산이 $D$이면 점수의 표준편차가 $\sqrt D$로 커져 점수 사이의 차이가 크고, 소프트맥스가 포화해 위의 기울기가 거의 $0$입니다. $\sqrt D$로 나누면 분산이 $D$와 무관한 $1$입니다.`,
    note: R`$\mathbf q,\mathbf k$의 성분이 독립이고 평균 $0$, 분산 $1$이라는 가정은 초기화 직후의 대략적인 값입니다. 학습이 진행되면 성립하지 않지만 $\sqrt D$로 나누는 것이 점수의 크기를 $D$와 무관하게 맞추는 출발점이 됩니다.` },
  { ch: 'ch21', id: 'shapecost', title: '셀프 어텐션의 모양, 매개변수, 계산량', keys: ['셀프 어텐션의 모양과 비용'],
    tags: 'self-attention shape parameters cost O(N^2 d) memory multiplications complexity 셀프 어텐션 모양 매개변수 계산량 메모리',
    stmt: R`$X\in\mathbb R^{N\times D}$, $W_q,W_k\in\mathbb R^{D\times D_k}$, $W_v\in\mathbb R^{D\times D_v}$인 셀프 어텐션 $Y=\mathrm{softmax}(QK^T/\sqrt{D_k})V$에서 $Y\in\mathbb R^{N\times D_v}$, 매개변수는 $D(2D_k+D_v)$이고 곱셈 수는 $ND(2D_k+D_v)+N^2(D_k+D_v)$, 어텐션 행렬의 메모리는 $N^2$이다. $D_k=D_v=d$이면 어텐션 부분이 $O(N^2d)$이다.`,
    body: R`
**모양.** $Q=XW_q$, $K=XW_k\in\mathbb R^{N\times D_k}$, $V=XW_v\in\mathbb R^{N\times D_v}$입니다. $QK^T\in\mathbb R^{N\times N}$이고 행마다의 소프트맥스는 모양을 바꾸지 않으므로 $A\in\mathbb R^{N\times N}$, $Y=AV\in\mathbb R^{N\times D_v}$.

**매개변수.** 세 투영 행렬이 $DD_k+DD_k+DD_v=D(2D_k+D_v)$개입니다(편향 없이). 시퀀스 길이 $N$에는 의존하지 않습니다.

**곱셈 수.** 투영은 $N\times D$와 $D\times D_\bullet$의 곱이라 $ND(2D_k+D_v)$번, $QK^T$는 $N^2$개의 원소를 길이 $D_k$ 점곱으로 구하므로 $N^2D_k$번, $AV$는 $N\times N$과 $N\times D_v$의 곱이라 $N^2D_v$번이고 소프트맥스는 $O(N^2)$입니다. 합이 $ND(2D_k+D_v)+N^2(D_k+D_v)+O(N^2)$.

**메모리와 지배항.** $A$의 $N^2$개 원소를 저장합니다. $D_k=D_v=d$이면 어텐션 부분은 $2N^2d$, 투영은 $3NDd$입니다. $N\gg D$이면 $N^2d$가, $N\ll D$이면 $NDd$가 지배합니다.`,
    note: R`길이 $N$에 이차인 계산량과 메모리가 긴 문서를 다룰 때의 병목입니다. RNN은 $O(Nd^2)$이지만 $N$걸음을 순차로 계산해야 합니다.` },
  { ch: 'ch21', id: 'permequiv', title: '셀프 어텐션의 순열 등변성', keys: ['셀프 어텐션의 순열 등변성'],
    tags: 'self-attention permutation equivariance permutation matrix softmax Attn(PX)=P Attn(X) cross-attention invariance 셀프 어텐션 순열 등변 순열행렬 교차 어텐션 불변',
    stmt: R`$\mathrm{Attn}(X)=\mathrm{softmax}\big(XW_q(XW_k)^T/\sqrt{D_k}\big)XW_v$(소프트맥스는 행마다)와 임의의 순열행렬 $P$에 대해 $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$이다. 또 질의를 고정하고 키·값 행들을 같은 순열로 섞으면 교차 어텐션의 출력은 변하지 않는다.`,
    body: R`
**치환.** $Q=XW_q$, $K=XW_k$, $V=XW_v$로 두면 $PX$에서는 $Q'=PQ$, $K'=PK$, $V'=PV$이고, 순열행렬은 $P^TP=I$를 만족합니다.

**점수.** $E'=\dfrac{Q'K'^T}{\sqrt{D_k}}=\dfrac{PQK^TP^T}{\sqrt{D_k}}=PEP^T$.

**소프트맥스.** 행마다의 소프트맥스 $\sigma$는 한 행 안에서 성분을 순열해도 값이 따라서 순열되므로 $\sigma(EP^T)=\sigma(E)P^T$이고, 행들을 서로 바꾸는 $P$는 행 단위의 연산과 교환되어 $\sigma(PF)=P\sigma(F)$입니다. 따라서 $A'=\sigma(PEP^T)=P\,\sigma(E)\,P^T=PAP^T$.

**출력.** $Y'=A'V'=PAP^T\,PV=PA(P^TP)V=PAV=PY$. ∎

**교차 어텐션.** 질의 $Q$를 고정하고 $K'=PK$, $V'=PV$로 두면 $E'=QK^TP^T/\sqrt{D_k}=EP^T$, $A'=AP^T$, $Y'=AP^TPV=AV=Y$. 키·값 쌍의 순서에는 불변이고 질의의 순서에는 등변입니다.`,
    note: R`등변이라 ‘누가 앞이고 누가 뒤인가’를 구별하지 못합니다. 순서가 의미를 가지는 자료에는 위치 부호화(21.6절)로 순서를 알려야 합니다.` },
  { ch: 'ch21', id: 'posrot', title: '사인 위치 부호화의 상대 위치와 회전행렬', keys: ['사인 위치 부호화'],
    tags: 'sinusoidal positional encoding rotation matrix relative position dot product concatenate add 사인 위치 부호화 회전행렬 상대 위치 내적',
    stmt: R`$\mathbf p(t)=(\sin\omega_kt,\cos\omega_kt)_{k=1}^{d/2}$이면 (1) $\mathbf p(t+\Delta)=R(\Delta)\mathbf p(t)$인 직교행렬 $R(\Delta)$가 $t$와 무관하게 있고, (2) $\mathbf p(t)\cdot\mathbf p(t+\Delta)=\sum_k\cos(\omega_k\Delta)$이며, (3) $[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$이다.`,
    body: R`
**(1) 회전.** 덧셈 공식 $\sin(a+b)=\sin a\cos b+\cos a\sin b$, $\cos(a+b)=\cos a\cos b-\sin a\sin b$로 한 쌍에 대해
$$\begin{pmatrix}\sin\omega(t+\Delta)\\\cos\omega(t+\Delta)\end{pmatrix}=\begin{pmatrix}\cos\omega\Delta&\sin\omega\Delta\\-\sin\omega\Delta&\cos\omega\Delta\end{pmatrix}\begin{pmatrix}\sin\omega t\\\cos\omega t\end{pmatrix}.$$
$R(\Delta)$는 각도 $\omega_k\Delta$의 $2\times2$ 회전을 $k=1,\dots,d/2$에 대해 블록 대각에 놓은 행렬이고 $t$가 들어 있지 않습니다. 각 블록이 회전이라 $R^TR=I$입니다.

**(2) 내적.** 한 쌍에서 $\sin\omega t\sin\omega(t+\Delta)+\cos\omega t\cos\omega(t+\Delta)=\cos(\omega(t+\Delta)-\omega t)=\cos\omega\Delta$입니다(코사인의 차 공식). 모든 쌍을 더하면 $\sum_k\cos(\omega_k\Delta)$이고 이는 $t$가 아니라 거리 $\Delta$에만 의존합니다.

**(3) 이어 붙이기와 더하기.** $W$를 위아래 두 블록 $W_1,W_2$로 나누면 $[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$입니다. 이어 붙인 뒤의 선형 변환은 위치 부호를 $W_2$로 선형 변환해 더하는 것과 같아, 슬라이드 69(이어 붙이기)와 77(더하기)은 표현력이 같습니다.`,
    note: R`$R(\Delta)$가 $t$에 무관해서, 모델이 위치 $t$에서 $t+\Delta$로의 이동을 항상 같은 선형 사상으로 읽을 수 있습니다. 또 $\mathbf p(t)\cdot\mathbf p(t)=d/2$로 모든 위치의 크기가 같습니다.` },
  { ch: 'ch21', id: 'maskrows', title: '마스크 어텐션: 미래의 가중치는 0, 행의 합은 1, 출력은 과거에만 의존', keys: ['마스크 셀프 어텐션'],
    tags: 'masked self-attention causal mask minus infinity softmax row sum lower triangular dependence future 마스크 셀프 어텐션 인과 마스크 소프트맥스 행의 합 아래삼각행렬',
    stmt: R`$A=\mathrm{softmax}(S+M)$ (행마다), $M_{ji}=0$ ($i\le j$), $-\infty$ ($i>j$)이면 (1) $i>j$일 때 $A_{ji}=0$, (2) 각 행의 합이 $1$, (3) $\mathbf y_j=\sum_iA_{ji}\mathbf v_i$는 $\mathbf x_1,\dots,\mathbf x_j$에만 의존한다.`,
    body: R`
행 $j$의 소프트맥스는 $A_{ji}=\dfrac{\exp(S_{ji}+M_{ji})}{\sum_l\exp(S_{jl}+M_{jl})}$입니다.

**(1) 미래는 0.** $i>j$이면 $M_{ji}=-\infty$이고 $e^{-\infty}=0$이므로 분자가 $0$, 곧 $A_{ji}=0$입니다. 따라서 $A$는 아래삼각행렬입니다.

**(2) 행의 합.** 분모는 $i\le j$인 항만 남아 $Z_j=\sum_{l\le j}e^{S_{jl}}$입니다. $l=j$인 항이 유한하고 양수라 $0<Z_j<\infty$이므로 분모가 잘 정의되고, $\sum_iA_{ji}=\sum_{i\le j}e^{S_{ji}}/Z_j=1$입니다. 대각을 허용하는 것이 분모가 $0$이 되는 일을 막습니다.

**(3) 과거에만 의존.** (1)에 의해 $\mathbf y_j=\sum_{i\le j}A_{ji}\mathbf v_i$이고, $A_{ji}$ ($i\le j$)는 $S_{ji}=\mathbf q_j\cdot\mathbf k_i/\sqrt{D_k}$ ($i\le j$)로만 정해집니다. $\mathbf q_j$는 $\mathbf x_j$의, $\mathbf k_i,\mathbf v_i$는 $\mathbf x_i$의 함수이므로 $\mathbf y_j$는 $\mathbf x_1,\dots,\mathbf x_j$의 함수입니다. 미래의 $\mathbf x_m$ ($m>j$)을 바꿔도 $\mathbf y_j$는 변하지 않습니다.`,
    note: R`이 성질 덕분에 정답 문장 전체를 한 번에 넣고 모든 칸의 다음 단어 예측 손실을 병렬로 계산할 수 있습니다(교사 강요). 추론에서는 한 칸씩 생성해도 같은 값이 나옵니다.` },
  { ch: 'ch21', id: 'mhaparams', title: '멀티헤드 어텐션의 매개변수와 계산량', keys: ['멀티헤드 어텐션'],
    tags: 'multi-head attention parameters 4D^2 computation heads concat output projection 멀티헤드 어텐션 매개변수 계산량 헤드',
    stmt: R`$\mathrm{MHA}(X)=[\mathrm{head}_1,\dots,\mathrm{head}_h]W_o$, $D_k=D_v=D/h$이면 매개변수는 $4D^2$(편향 없이), 헤드마다의 곱셈 $2N^2D/h$의 합 $2N^2D$는 $h$와 무관하며 어텐션 행렬은 $h$개로 총 $hN^2$이다.`,
    body: R`
**매개변수.** 헤드 하나는 $W_q^a,W_k^a,W_v^a\in\mathbb R^{D\times D/h}$로 $3D\cdot D/h$개이고, $h$개를 합하면 $3D^2$입니다. Concat의 크기는 $N\times hD_v=N\times D$이므로 $W_o\in\mathbb R^{D\times D}$가 $D^2$개. 합은 $4D^2$.

**계산량.** 헤드 하나의 $QK^T$와 $AV$는 각각 $N^2\cdot D/h$번의 곱셈이라 $2N^2D/h$이고, $h$개를 합하면 $2N^2D$로 $h$와 무관합니다. 투영의 곱셈 $3ND^2$와 $W_o$의 $ND^2$도 $h$와 무관합니다.

**어텐션 행렬.** 헤드마다 $N\times N$ 행렬이 하나이므로 $hN^2$개를 저장합니다.

**단일 헤드와의 비교.** $h=1$이면 $D_k=D_v=D$로 매개변수도 $4D^2$, 곱셈도 같습니다. 멀티헤드는 같은 비용으로 서로 다른 부분공간에서 $h$개의 소프트맥스 패턴을 동시에 배웁니다.`,
    note: R`$D_k=D/h$로 두는 것이 비용을 같게 하는 선택입니다. 헤드마다 $D_k$를 $D$로 두면 매개변수와 계산량이 $h$배가 됩니다.` },
  { ch: 'ch21', id: 'encblock', title: '인코더 블록의 매개변수와 순열 등변성', keys: ['인코더 블록'],
    tags: 'transformer encoder block parameters 12d^2 feed forward layer norm residual permutation equivariance positional encoding 트랜스포머 인코더 블록 매개변수 잔차 층 정규화 순열 등변',
    stmt: R`인코더 블록 $T$의 매개변수는 편향·정규화를 빼고 $4d^2+2d\,d_{ff}$($d_{ff}=4d$이면 $12d^2$)이다. 위치 부호화가 없으면 $T(PX)=P\,T(X)$이고 $N$개를 쌓은 인코더도 순열 등변이다.`,
    body: R`
**매개변수.** 멀티헤드 어텐션이 $4d^2$입니다(21.7절의 증명). FF는 $W_1\in\mathbb R^{d_{ff}\times d}$와 $W_2\in\mathbb R^{d\times d_{ff}}$로 $2d\,d_{ff}$입니다. LayerNorm의 $\gamma,\beta$와 편향은 $O(d+d_{ff})$로 작아서 뺍니다. $d_{ff}=4d$이면 $4d^2+8d^2=12d^2$.

**어텐션 부분의 등변.** 헤드마다 $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$이고, Concat과 $W_o$는 모든 행에 같은 선형 변환이라 행의 순열과 교환되므로 $\mathrm{MHA}(PX)=P\,\mathrm{MHA}(X)$입니다.

**잔차, LN, FF.** $PX+\mathrm{MHA}(PX)=P\big(X+\mathrm{MHA}(X)\big)$입니다. LN과 FF는 토큰(행)마다 같은 함수를 적용하므로 $\mathrm{LN}(PZ)=P\,\mathrm{LN}(Z)$, $\mathrm{FF}(PZ)=P\,\mathrm{FF}(Z)$이고 두 번째 잔차와 LN도 같은 이유로 교환됩니다. 따라서 $T(PX)=P\,T(X)$.

**쌓기.** 등변 함수의 합성은 등변이므로 $T_N\circ\cdots\circ T_1(PX)=P\,T_N\circ\cdots\circ T_1(X)$입니다.`,
    note: R`입력에 위치 부호 $\mathbf p_j$를 더하면 $X+\mathbf p$는 $P$에 대해 등변이 아니어서 토큰의 순서가 출력에 반영됩니다. 이것이 위치 부호화가 필요한 이유입니다.` },
  { ch: 'ch21', id: 'lnprop', title: '층 정규화의 평균·분산, 이동·스케일 불변', keys: ['층 정규화'],
    tags: 'layer normalization mean variance shift scale invariance batch independence batch normalization 층 정규화 평균 분산 이동 불변 스케일 불변 배치 정규화',
    stmt: R`$\varepsilon=0$, $\boldsymbol\gamma=\mathbf 1$, $\boldsymbol\beta=\mathbf 0$인 $\mathrm{LN}(\mathbf h)=(\mathbf h-\mu\mathbf 1)/\sigma$에 대해 (1) 출력의 평균이 $0$, 분산이 $1$이고 $\lVert\mathrm{LN}(\mathbf h)\rVert^2=d$, (2) $a>0$, $b\in\mathbb R$에 대해 $\mathrm{LN}(a\mathbf h+b\mathbf 1)=\mathrm{LN}(\mathbf h)$이다.`,
    body: R`
**(1) 평균과 분산.** $\mathbf y=(\mathbf h-\mu\mathbf 1)/\sigma$로 두면 평균은 $\frac1d\sum_jy_j=\frac1\sigma\big(\frac1d\sum_jh_j-\mu\big)=0$입니다. 분산은 평균이 $0$이므로 $\frac1d\sum_jy_j^2=\frac1{\sigma^2}\cdot\frac1d\sum_j(h_j-\mu)^2=\frac{\sigma^2}{\sigma^2}=1$이고, 그래서 $\lVert\mathbf y\rVert^2=\sum_jy_j^2=d$입니다.

**(2) 이동과 스케일 불변.** $\mathbf h'=a\mathbf h+b\mathbf 1$이면 $\mu'=a\mu+b$이고 $h_j'-\mu'=a(h_j-\mu)$이므로 $\sigma'^2=a^2\sigma^2$, $a>0$이라 $\sigma'=a\sigma$입니다. 따라서
$$\mathrm{LN}(\mathbf h')=\frac{a(\mathbf h-\mu\mathbf 1)}{a\sigma}=\mathrm{LN}(\mathbf h).$$
$a<0$이면 $\sigma'=|a|\sigma$라 부호가 뒤집혀 $-\mathrm{LN}(\mathbf h)$.

**배치와의 관계.** $\mu,\sigma$를 한 토큰의 $d$개 성분으로만 계산하므로 같은 배치의 다른 샘플이 쓰이지 않습니다. BN은 채널마다 배치의 모든 샘플에서 통계를 구해 배치 크기에 의존하고, 추론 때는 학습 중의 이동 평균으로 대신해야 합니다[[ch12:12.3|BN은 미니배치 통계를 쓴다.]].`,
    note: R`$\varepsilon>0$이면 성질이 근사적으로만 성립하고(분산이 $\varepsilon$만큼 커짐), $\boldsymbol\gamma,\boldsymbol\beta$로 평균과 분산을 학습 가능하게 되돌립니다.` },
  );
})();
