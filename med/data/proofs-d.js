/* 증명 — 15 트랜스포머(교재 12장). 2026-10-19 추가. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  { ch: 'ch15', id: 'attn-convex', title: '소프트맥스 어텐션은 입력의 볼록 결합이다', keys: ['어텐션 계수', '셀프 어텐션'],
    tags: 'attention softmax convex combination weighted average 어텐션 소프트맥스 볼록 결합 가중 평균',
    stmt: R`$a_{nm}=\exp(s_{nm})/\sum_{m'}\exp(s_{nm'})$로 정한 계수는 $a_{nm}>0$, $\sum_ma_{nm}=1$을 만족하고, 따라서 $\mathbf y_n=\sum_ma_{nm}\mathbf x_m$은 입력들의 볼록 결합이다. 각 성분은 입력 성분의 최솟값과 최댓값 사이에 있다.`,
    body: R`
**두 조건.** 지수함수는 항상 양수이므로 분자와 분모가 양수이고 $a_{nm}>0$. 분모가 모든 분자의 합이므로
$$\sum_{m=1}^Na_{nm}=\frac{\sum_m\exp(s_{nm})}{\sum_{m'}\exp(s_{nm'})}=1.$$
**볼록 결합.** 음이 아닌 계수의 합이 1인 일차결합이 볼록 결합의 정의입니다. 성분 $i$마다
$$\min_mx_{mi}=\sum_ma_{nm}\min_{m'}x_{m'i}\le\sum_ma_{nm}x_{mi}=y_{ni}\le\sum_ma_{nm}\max_{m'}x_{m'i}=\max_mx_{mi}.$$
행렬로 쓰면 $\operatorname{Softmax}[\mathbf S]$의 행은 모두 확률 벡터(행 확률 행렬)이고 $\mathbf Y=\operatorname{Softmax}[\mathbf S]\mathbf X$입니다.`,
    note: R`소프트맥스는 행마다 정규화하므로 열의 합은 1이 아닐 수 있습니다. 한 입력 토큰이 많은 출력에서 참고될 수도, 거의 안 참고될 수도 있습니다.` },

  { ch: 'ch15', id: 'qkv-asym', title: '같은 투영의 유사도는 대칭, Q·K 투영은 비대칭', keys: ['쿼리·키·값 어텐션'],
    tags: 'query key value symmetric asymmetric projection 쿼리 키 값 대칭 비대칭 투영',
    stmt: R`$\mathbf X\mathbf U\mathbf U^T\mathbf X^T$는 항상 대칭이지만, $\mathbf W^{(q)}\ne\mathbf W^{(k)}$이면 $\mathbf Q\mathbf K^T=\mathbf X\mathbf W^{(q)}\mathbf W^{(k)T}\mathbf X^T$는 일반적으로 대칭이 아니다.`,
    body: R`
**대칭.** $(\mathbf A\mathbf B)^T=\mathbf B^T\mathbf A^T$를 반복하면
$$(\mathbf X\mathbf U\mathbf U^T\mathbf X^T)^T=(\mathbf X^T)^T(\mathbf U^T)^T\mathbf U^T\mathbf X^T=\mathbf X\mathbf U\mathbf U^T\mathbf X^T.$$
곧 점수 $s_{nm}=(\mathbf U^T\mathbf x_n)^T(\mathbf U^T\mathbf x_m)=s_{mn}$입니다.

**비대칭의 예.** $\mathbf X=\mathbf I_2$ (두 토큰 $\mathbf x_1=(1,0)$, $\mathbf x_2=(0,1)$), $\mathbf W^{(q)}=\begin{pmatrix}0&1\\0&0\end{pmatrix}$, $\mathbf W^{(k)}=\mathbf I$이면
$$\mathbf Q\mathbf K^T=\mathbf W^{(q)}=\begin{pmatrix}0&1\\0&0\end{pmatrix},$$
$s_{12}=1\ne0=s_{21}$. 토큰 1은 토큰 2를 강하게 보지만 토큰 2는 토큰 1을 특별히 보지 않습니다. “끌 → 도구”처럼 방향이 있는 관계를 표현할 수 있습니다.`,
    note: R`$\mathbf W^{(q)}\mathbf W^{(k)T}$는 $D\times D$이지만 계수가 $D_k$ 이하입니다. 머리 하나는 저계수 쌍선형 형식 $\mathbf x_n^T\mathbf M\mathbf x_m$으로 유사도를 잽니다.` },

  { ch: 'ch15', id: 'scaled-var', title: '점곱의 분산은 D_k이고 소프트맥스는 포화한다', keys: ['스케일드 점곱 어텐션'],
    tags: 'scaled dot product attention variance sqrt dk softmax saturation jacobian 스케일 점곱 분산 포화 야코비안',
    stmt: R`$\mathbf q,\mathbf k\in\mathbb R^{D_k}$의 성분이 모두 서로 독립이고 평균 0, 분산 1이면 $\E[\mathbf q^T\mathbf k]=0$, $\operatorname{var}[\mathbf q^T\mathbf k]=D_k$이다. 소프트맥스 $p=\operatorname{softmax}(\mathbf z)$의 야코비안은 $\partial p_i/\partial z_j=p_i(\delta_{ij}-p_j)$이며, $p$가 원-핫에 가까우면 모든 원소가 0에 가깝다.`,
    body: R`
**평균.** 독립이므로 $\E[q_ik_i]=\E[q_i]\E[k_i]=0$, 합도 0.

**분산.** $\E[(q_ik_i)^2]=\E[q_i^2]\E[k_i^2]=1\cdot1=1$이고 평균이 0이라 $\operatorname{var}[q_ik_i]=1$. 서로 다른 $i,j$에 대해 $\operatorname{cov}[q_ik_i,q_jk_j]=\E[q_i]\E[k_i]\E[q_j]\E[k_j]=0$이므로
$$\operatorname{var}\Big[\sum_{i=1}^{D_k}q_ik_i\Big]=\sum_i\operatorname{var}[q_ik_i]=D_k.$$
따라서 $\mathbf q^T\mathbf k/\sqrt{D_k}$의 분산은 $D_k/D_k=1$입니다.

**소프트맥스의 야코비안.** $p_i=e^{z_i}/S$, $S=\sum_je^{z_j}$. $i=j$이면 $\frac{\partial p_i}{\partial z_i}=\frac{e^{z_i}S-e^{z_i}e^{z_i}}{S^2}=p_i-p_i^2$, $i\ne j$이면 $\frac{\partial p_i}{\partial z_j}=-\frac{e^{z_i}e^{z_j}}{S^2}=-p_ip_j$. 합쳐서 $p_i(\delta_{ij}-p_j)$.

**포화.** 점수 차가 커서 $p_1\to1$, 나머지 $\to0$이면 대각 원소 $p_i(1-p_i)\to0$ (모든 $i$), 비대각 $-p_ip_j\to0$. 역전파되는 기울기 $\partial E/\partial\mathbf z=\mathbf J^T\partial E/\partial\mathbf p$가 0에 가까워져 학습이 멈춥니다. $\sqrt{D_k}$로 나누면 $D_k$가 커도 점수의 분산이 1로 유지되어 이 영역을 피합니다.` },

  { ch: 'ch15', id: 'mha-params', title: '멀티헤드 어텐션의 모수는 4D²', keys: ['멀티헤드 어텐션'],
    tags: 'multi-head attention parameter count heads 멀티헤드 어텐션 모수 머리',
    stmt: R`머리 $H$개, $D_k=D_v=D/H$이면 멀티헤드 어텐션의 가중치(편향 제외)는 머리 수와 무관하게 $4D^2$개이다.`,
    body: R`
머리 하나: $\mathbf W_h^{(q)},\mathbf W_h^{(k)}\in\mathbb R^{D\times D_k}$, $\mathbf W_h^{(v)}\in\mathbb R^{D\times D_v}$이므로 $2DD_k+DD_v=3D\cdot\frac DH$. 머리 $H$개면 $H\cdot\frac{3D^2}H=3D^2$.
출력 투영 $\mathbf W^{(o)}\in\mathbb R^{HD_v\times D}=\mathbb R^{D\times D}$: $D^2$.
합 $3D^2+D^2=4D^2$. $H$가 약분되어 사라지므로, 머리를 나누는 것은 모수 수가 아니라 **유사도를 재는 부분공간의 수**를 바꿉니다.`,
    note: R`위치별 MLP의 은닉 폭을 흔히 $4D$로 두면 MLP 모수는 $2\cdot4D^2=8D^2$이라, 트랜스포머 층 하나의 모수는 약 $12D^2$입니다.` },

  { ch: 'ch15', id: 'perm-equiv', title: '셀프 어텐션의 순열 등변성', keys: ['순열 등변성'],
    tags: 'permutation equivariance self-attention position 순열 등변성 셀프 어텐션 위치',
    stmt: R`$\mathbf P$가 순열 행렬이면 $\operatorname{Attention}(\mathbf P\mathbf X)=\mathbf P\operatorname{Attention}(\mathbf X)$이다. 여기서 $\operatorname{Attention}(\mathbf X)=\operatorname{Softmax}[\mathbf X\mathbf W^{(q)}\mathbf W^{(k)T}\mathbf X^T/\sqrt{D_k}]\mathbf X\mathbf W^{(v)}$.`,
    body: R`
**투영.** $\mathbf Q'=\mathbf P\mathbf X\mathbf W^{(q)}=\mathbf P\mathbf Q$, 마찬가지로 $\mathbf K'=\mathbf P\mathbf K$, $\mathbf V'=\mathbf P\mathbf V$.

**점수.** $\mathbf S'=\mathbf Q'\mathbf K'^T/\sqrt{D_k}=\mathbf P\mathbf S\mathbf P^T$. 순열 $\pi$로 쓰면 $(\mathbf P\mathbf S\mathbf P^T)_{nm}=s_{\pi(n)\pi(m)}$: 행과 열을 같은 순열로 섞은 것입니다.

**소프트맥스.** 행마다의 소프트맥스는 (a) 행의 순서를 바꾸면 결과의 행 순서도 바뀌고 (b) 한 행 안의 원소 순서를 바꾸면 결과도 같은 순서로 바뀝니다(각 원소의 값과 분모가 그대로). 따라서 $\operatorname{Softmax}[\mathbf P\mathbf S\mathbf P^T]=\mathbf P\operatorname{Softmax}[\mathbf S]\mathbf P^T$.

**합치기.** $\mathbf P^T\mathbf P=\mathbf I$이므로
$$\operatorname{Attention}(\mathbf P\mathbf X)=\mathbf P\operatorname{Softmax}[\mathbf S]\mathbf P^T\mathbf P\mathbf V=\mathbf P\operatorname{Softmax}[\mathbf S]\mathbf V=\mathbf P\operatorname{Attention}(\mathbf X).$$
위치별 MLP와 층 정규화는 행마다 같은 함수를 적용하므로 $f(\mathbf P\mathbf X)=\mathbf Pf(\mathbf X)$이고, 잔차 덧셈도 그렇습니다. 등변인 함수의 합성은 등변이므로 트랜스포머 층 전체가 순열 등변입니다.`,
    note: R`그래서 위치 부호화 $\widetilde{\mathbf x}_n=\mathbf x_n+\mathbf r_n$이 없으면 문장의 단어 순서를 바꿔도 각 단어의 출력 표현이 그대로입니다. 인과 마스크는 위치에 의존하므로 GPT의 층은 엄밀히는 등변이 아니지만, 그것만으로는 절대 위치를 알기 어렵습니다.` },

  { ch: 'ch15', id: 'highdim-orth', title: '고차원의 무작위 벡터는 거의 직교한다', keys: ['위치 부호화의 덧셈'],
    tags: 'high dimension random vectors orthogonal positional encoding addition 고차원 무작위 직교 위치 부호화 덧셈',
    stmt: R`$\mathbf u,\mathbf v\in\mathbb R^D$의 성분이 모두 서로 독립이고 평균 0, 분산 $1/D$이면 $\E[\lVert\mathbf u\rVert^2]=1$, $\E[\mathbf u^T\mathbf v]=0$, $\operatorname{var}[\mathbf u^T\mathbf v]=1/D$이다.`,
    body: R`
$\E[\lVert\mathbf u\rVert^2]=\sum_i\E[u_i^2]=D\cdot\frac1D=1$. 독립이고 평균 0이므로 $\E[u_iv_i]=0$이라 $\E[\mathbf u^T\mathbf v]=0$.
$\operatorname{var}[u_iv_i]=\E[u_i^2]\E[v_i^2]=\frac1{D^2}$이고 서로 다른 $i$의 항은 상관이 없으므로 $\operatorname{var}[\mathbf u^T\mathbf v]=D\cdot\frac1{D^2}=\frac1D$.
두 벡터의 길이가 거의 1이므로 코사인 유사도도 평균 0, 표준편차 약 $1/\sqrt D$입니다. $D=512$이면 $0.044$로, 무관한 두 방향은 거의 직교합니다. 그래서 토큰 임베딩에 위치 벡터를 **더해도** 두 정보가 서로 거의 다른 방향을 차지해, 이후 층의 선형 투영이 둘을 어느 정도 따로 읽어 낼 수 있습니다.`,
    note: R`분산 $\operatorname{var}[\lVert\mathbf u\rVert^2]=D\operatorname{var}[u_i^2]=D\cdot\frac2{D^2}=\frac2D$ (가우시안일 때)라 길이도 1 근처에 몰립니다. 이것이 “고차원에서는 무작위 벡터가 구면 위에 퍼지고 서로 거의 직교한다”는 측도 집중 현상입니다.` },

  { ch: 'ch15', id: 'pe-relative', title: '사인파 위치 부호화의 상대 위치 성질', keys: ['사인파 위치 부호화'],
    tags: 'sinusoidal positional encoding relative position rotation matrix 사인파 위치 부호화 상대 위치 회전 행렬',
    stmt: R`사인파 위치 부호화에서 $\mathbf r_{n+k}=\mathbf M_k\mathbf r_n$인 행렬 $\mathbf M_k$가 존재하고, $\mathbf M_k$는 $n$과 무관하며 $2\times2$ 회전 블록들의 블록 대각 행렬이다. 또 $\mathbf r_n^T\mathbf r_{n+k}$는 $k$에만 의존한다.`,
    body: R`
짝수 $i$와 $i+1$은 같은 각진동수 $\omega=L^{-i/D}$로 $(r_{ni},r_{n,i+1})=(\sin\omega n,\cos\omega n)$입니다. 덧셈정리
$$\sin(\omega n+\omega k)=\sin\omega n\cos\omega k+\cos\omega n\sin\omega k,\qquad \cos(\omega n+\omega k)=\cos\omega n\cos\omega k-\sin\omega n\sin\omega k$$
를 행렬로 쓰면
$$\begin{pmatrix}r_{n+k,i}\\r_{n+k,i+1}\end{pmatrix}=\underbrace{\begin{pmatrix}\cos\omega k&\sin\omega k\\-\sin\omega k&\cos\omega k\end{pmatrix}}_{\mathbf R(\omega k)}\begin{pmatrix}r_{ni}\\r_{n,i+1}\end{pmatrix}.$$
$\mathbf R(\omega k)$에는 $n$이 없습니다. 모든 쌍의 블록을 대각으로 모은 것이 $\mathbf M_k$입니다.

**내적.** 한 쌍의 기여는 $\sin\omega n\sin\omega(n+k)+\cos\omega n\cos\omega(n+k)=\cos\big(\omega(n+k)-\omega n\big)=\cos\omega k$. 따라서
$$\mathbf r_n^T\mathbf r_{n+k}=\sum_{\text{쌍}}\cos(\omega_jk)$$
는 $n$과 무관하게 거리 $k$로만 정해집니다.`,
    note: R`$\mathbf M_k$는 직교행렬(회전)이라 $\lVert\mathbf r_n\rVert^2=D/2$가 모든 위치에서 같습니다. 회전으로 상대 위치를 넣는 생각을 쿼리·키에 직접 쓴 것이 최근 LLM이 많이 쓰는 회전 위치 부호화(RoPE)입니다.` },

  { ch: 'ch15', id: 'causal-mask', title: '인과 마스크와 정보 누출이 없음', keys: ['인과 마스크'],
    tags: 'causal mask masked attention minus infinity leakage GPT 인과 마스크 마스크 어텐션 누출',
    stmt: R`점수에 $m>n$이면 $-\infty$를 더해 소프트맥스를 취하면 $a_{nm}=0$ ($m>n$)이고 행의 합은 1이다. 이런 마스크된 셀프 어텐션과 위치별 연산만 쌓은 망에서, 어느 층이든 위치 $n$의 출력은 입력 $\mathbf x_1,\dots,\mathbf x_n$에만 의존한다.`,
    body: R`
**한 층.** $m>n$이면 $\exp(s_{nm}-\infty)=0$이라 $a_{nm}=0$. 남은 항으로 나누므로
$$a_{nm}=\frac{\exp(s_{nm})}{\sum_{m'\le n}\exp(s_{nm'})}\ (m\le n),\qquad \sum_{m\le n}a_{nm}=1.$$
따라서 $\mathbf y_n=\sum_{m\le n}a_{nm}\mathbf v_m$이고, $s_{nm}$ ($m\le n$)도 $\mathbf x_n,\mathbf x_m$만으로 계산되므로 $\mathbf y_n$은 $\mathbf x_1,\dots,\mathbf x_n$의 함수입니다.

**층을 쌓아도.** 귀납법. 층 $\ell$의 출력 $\mathbf h_n^{(\ell)}$이 $\mathbf x_{1:n}$에만 의존한다고 하자. 층 $\ell+1$의 마스크된 어텐션은 위 논증에 따라 $\mathbf h_{1:n}^{(\ell)}$만 쓰고, 이들은 모두 $\mathbf x_{1:n}$의 함수입니다($m\le n$이면 $\mathbf x_{1:m}\subset\mathbf x_{1:n}$). 잔차 덧셈, 층 정규화, 위치별 MLP는 같은 위치 $n$만 쓰므로 성질을 유지합니다. 그러므로 마지막 층의 $\mathbf y_n$도 $\mathbf x_{1:n}$에만 의존하고, 다음 토큰 $\mathbf x_{n+1}$을 예측할 때 그 정답을 볼 수 없습니다.`,
    note: R`실제 구현은 $-\infty$ 대신 매우 큰 음수(예: $-10^9$)를 더합니다. 패딩 마스크도 같은 방식으로 ⟨pad⟩ 열의 점수에 $-\infty$를 더합니다.` },

  { ch: 'ch15', id: 'temp-limits', title: '온도의 두 극한: 탐욕 탐색과 균등분포', keys: ['온도 표본 추출'],
    tags: 'temperature sampling softmax limit greedy uniform 온도 표본 추출 극한 탐욕 균등',
    stmt: R`$y_i(T)=\exp(a_i/T)/\sum_j\exp(a_j/T)$에서 최댓값 $a_{i^*}$가 유일하면 $T\to0^+$일 때 $y\to\mathbf e_{i^*}$ (원-핫), $T\to\infty$일 때 $y_i\to1/K$이다.`,
    body: R`
분자·분모를 $\exp(a_{i^*}/T)$로 나누면
$$y_i(T)=\frac{\exp\big((a_i-a_{i^*})/T\big)}{1+\sum_{j\ne i^*}\exp\big((a_j-a_{i^*})/T\big)}.$$
**$T\to0^+$.** $j\ne i^*$이면 $a_j-a_{i^*}<0$이라 $(a_j-a_{i^*})/T\to-\infty$, 그 지수는 0. 분모 $\to1$이므로 $y_{i^*}\to1$, 나머지 $\to0$: 항상 최댓값을 고르는 탐욕 탐색입니다.
**$T\to\infty$.** 모든 지수의 인자가 0으로 가므로 각 항 $\to1$, $y_i\to1/K$: 로짓과 무관한 균등 추출입니다.
**순서 보존.** 모든 $T>0$에서 $a_i>a_j\iff y_i>y_j$이므로 온도는 순위를 바꾸지 않고 **뾰족한 정도**만 바꿉니다.`,
    note: R`$T=1$이 학습 때의 분포입니다. 엔트로피 $-\sum_iy_i\ln y_i$는 $T$에 대해 증가해 $0$에서 $\ln K$로 갑니다.` },

  { ch: 'ch15', id: 'bptt-grad', title: 'BPTT의 기울기는 야코비안의 곱이다', keys: ['BPTT의 기울기', '순환 신경망'],
    tags: 'backpropagation through time vanishing exploding gradient RNN jacobian 시간 역전파 기울기 소실 폭발 야코비안',
    stmt: R`$\mathbf z_n=\tanh(\mathbf W_{zz}\mathbf z_{n-1}+\mathbf W_{zx}\mathbf x_n+\mathbf b)$이면 $\frac{\partial\mathbf z_N}{\partial\mathbf z_0}=\prod_{n=N}^{1}\operatorname{diag}(1-\mathbf z_n^2)\mathbf W_{zz}$이고 $\big\lVert\frac{\partial\mathbf z_N}{\partial\mathbf z_0}\big\rVert\le\lVert\mathbf W_{zz}\rVert^N$이다.`,
    body: R`
**한 걸음.** $\mathbf a_n=\mathbf W_{zz}\mathbf z_{n-1}+\cdots$, $\mathbf z_n=\tanh(\mathbf a_n)$이므로 연쇄법칙으로
$$\frac{\partial\mathbf z_n}{\partial\mathbf z_{n-1}}=\frac{\partial\mathbf z_n}{\partial\mathbf a_n}\frac{\partial\mathbf a_n}{\partial\mathbf z_{n-1}}=\operatorname{diag}\big(\tanh'(\mathbf a_n)\big)\mathbf W_{zz}=\operatorname{diag}(1-\mathbf z_n^2)\mathbf W_{zz}.$$
**여러 걸음.** $\mathbf z_N$은 $\mathbf z_{N-1},\dots,\mathbf z_1$을 차례로 거쳐 $\mathbf z_0$에 의존하므로 연쇄법칙을 거듭 쓰면
$$\frac{\partial\mathbf z_N}{\partial\mathbf z_0}=\frac{\partial\mathbf z_N}{\partial\mathbf z_{N-1}}\cdots\frac{\partial\mathbf z_1}{\partial\mathbf z_0}.$$
**상계.** $0\le1-z^2\le1$이라 $\lVert\operatorname{diag}(1-\mathbf z_n^2)\rVert\le1$. 연산자 노름의 곱셈 부등식으로 $\big\lVert\frac{\partial\mathbf z_N}{\partial\mathbf z_0}\big\rVert\le\prod_n\lVert\mathbf W_{zz}\rVert=\lVert\mathbf W_{zz}\rVert^N$. 따라서 $\lVert\mathbf W_{zz}\rVert<1$이면 기울기는 $N$에 대해 지수적으로 **소실**합니다. 반대로 $\mathbf W_{zz}$의 고윳값이 1보다 크고 tanh가 포화하지 않는 영역에서는 곱이 지수적으로 커져 **폭발**할 수 있습니다.`,
    note: R`트랜스포머에서는 어떤 두 위치도 어텐션 한 번으로 이어지므로 이런 $N$겹의 곱이 생기지 않고, 층 방향의 깊이 문제는 잔차 연결이 덜어 줍니다.` },

  { ch: 'ch15', id: 'lora-rank', title: 'LoRA 갱신의 계수와 모수 수', keys: ['LoRA'],
    tags: 'LoRA low rank adaptation fine-tuning rank parameters LoRA 저계수 적응 미세 조정 계수 모수',
    stmt: R`$\mathbf A\in\mathbb R^{D\times R}$, $\mathbf B\in\mathbb R^{R\times D}$이면 $\operatorname{rank}(\mathbf A\mathbf B)\le R$이고, 갱신의 학습 모수는 $2DR$개로 전체 미세 조정의 $\frac{2R}D$배이다.`,
    body: R`
$\mathbf A\mathbf B$의 $j$번째 열은 $\mathbf A\mathbf b_j$ ($\mathbf b_j$: $\mathbf B$의 $j$번째 열)이므로 $\mathbf A$의 열 $R$개의 일차결합입니다. 따라서 $\mathbf A\mathbf B$의 열공간은 $\mathbf A$의 열공간에 포함되고 $\operatorname{rank}(\mathbf A\mathbf B)\le\operatorname{rank}(\mathbf A)\le R$.
모수: $\mathbf A$ $DR$개, $\mathbf B$ $RD$개, 합 $2DR$. 전체 행렬은 $D^2$이므로 비율 $\frac{2DR}{D^2}=\frac{2R}D$.
계산: $\mathbf X\widehat{\mathbf W}=\mathbf X\mathbf W_0+(\mathbf X\mathbf A)\mathbf B$를 이 순서로 계산하면 추가 비용은 $O(NDR)$로 $O(ND^2)$보다 작고, 학습 뒤에는 $\widehat{\mathbf W}$를 한 번 더해 두면 추가 비용이 0입니다.`,
    note: R`보통 한쪽을 0으로 초기화해 $\mathbf A\mathbf B=\mathbf 0$에서 시작하므로, 미세 조정은 정확히 사전 학습 모델에서 출발합니다.` },

  { ch: 'ch15', id: 'mse-mean', title: '제곱오차의 최적 예측은 평균이다(흐림의 원인)', keys: ['이산 표현이 필요한 이유'],
    tags: 'squared error mean blur discrete representation multimodal 제곱오차 평균 흐림 이산 다봉',
    stmt: R`목표 $t$가 확률변수일 때 $\E[(y-t)^2]$을 최소로 하는 상수 예측은 $y=\E[t]$이다. 특히 $t\in\{0,1\}$이 같은 확률이면 최적 예측은 어느 참값도 아닌 $\tfrac12$이다.`,
    body: R`
$\E[(y-t)^2]=y^2-2y\E[t]+\E[t^2]$은 $y$에 대한 위로 볼록한 이차식이고, 미분하면 $2y-2\E[t]=0$에서 $y=\E[t]$가 유일한 최소점입니다. 값을 대입하면 최소값은 $\operatorname{var}[t]$입니다.
$t=0$ 또는 $1$이 각각 확률 $\tfrac12$이면 $\E[t]=\tfrac12$. 화소로 말하면 “검정 아니면 흰색”인 곳을 회색으로 칠하는 것이 제곱오차(가우시안 가능도)의 최적이고, 이것이 연속 회귀로 만든 영상이 흐린 이유입니다. 이산 분포 $p(t=0)=p(t=1)=\tfrac12$은 두 가능성을 모두 유지하며, 뽑은 표본은 늘 0이나 1입니다.`,
    note: R`같은 논리가 음성 합성(같은 문장을 여러 방식으로 말할 수 있음)에서 회귀 대신 이산 음성 토큰의 언어 모델링을 쓰는 이유입니다.` },

  { ch: 'ch15', id: 'nb-posterior', title: '나이브 베이즈 사후확률', keys: ['단어 주머니와 나이브 베이즈'],
    tags: 'naive bayes bag of words posterior conditional independence smoothing 나이브 베이즈 단어 주머니 사후확률 조건부 독립 평활화',
    stmt: R`단어들이 클래스가 주어졌을 때 조건부 독립이면 $p(\mathcal C_k\mid\mathbf x_{1:N})=\dfrac{p(\mathcal C_k)\prod_np(\mathbf x_n\mid\mathcal C_k)}{\sum_jp(\mathcal C_j)\prod_np(\mathbf x_n\mid\mathcal C_j)}$이다. 어떤 $p(\mathbf x_n\mid\mathcal C_k)=0$이면 그 클래스의 사후확률은 다른 단어의 증거와 무관하게 0이다.`,
    body: R`
베이즈 정리로 $p(\mathcal C_k\mid\mathbf x_{1:N})=p(\mathbf x_{1:N}\mid\mathcal C_k)p(\mathcal C_k)/p(\mathbf x_{1:N})$이고, 분모는 합의 규칙으로 $\sum_jp(\mathbf x_{1:N}\mid\mathcal C_j)p(\mathcal C_j)$입니다. 조건부 독립 가정으로 $p(\mathbf x_{1:N}\mid\mathcal C_k)=\prod_np(\mathbf x_n\mid\mathcal C_k)$를 대입하면 위 식입니다.
곱의 인수 하나가 0이면 분자가 0이므로 사후확률이 0입니다. 다른 단어들이 그 클래스를 아무리 강하게 지지해도 되살릴 수 없습니다. 라플라스 평활화 $p(w\mid\mathcal C_k)=\frac{n_{kw}+1}{n_k+K}$는 모든 단어에 양의 확률을 주어 이를 막습니다($n_{kw}$: 클래스 $k$에서 단어 $w$의 빈도, $n_k$: 클래스 $k$의 전체 단어 수, $K$: 어휘 크기).`,
    note: R`실제 계산은 아주 작은 확률의 곱이 언더플로하지 않도록 로그를 더합니다: $\ln p(\mathcal C_k)+\sum_n\ln p(\mathbf x_n\mid\mathcal C_k)$.` },
  );
})();
