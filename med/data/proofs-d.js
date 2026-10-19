/* 증명 — 15 트랜스포머(교재 12장). 2026-10-19 추가, 같은 날 교재 연습문제 12.1–12.16과 대조해 보강.
   src가 있는 항목은 교재 연습문제의 풀이입니다(12.14의 의사코드는 단원 본문과 연습문제에 있음). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  { ch: 'ch15', id: 'attn-convex', title: '소프트맥스 어텐션은 입력의 볼록 결합이다', keys: ['어텐션 계수', '셀프 어텐션'], src: 'Bishop 연습문제 12.1·12.2',
    tags: 'attention softmax convex combination weighted average 어텐션 소프트맥스 볼록 결합 가중 평균',
    stmt: R`$a_{nm}=\exp(s_{nm})/\sum_{m'}\exp(s_{nm'})$로 정한 계수는 $a_{nm}>0$, $\sum_ma_{nm}=1$을 만족하고(연습문제 12.2), 따라서 $\mathbf y_n=\sum_ma_{nm}\mathbf x_m$은 입력들의 볼록 결합이다. 각 성분은 입력 성분의 최솟값과 최댓값 사이에 있다. 또 두 조건 $a_{nm}\ge0$, $\sum_ma_{nm}=1$만 만족하는 어떤 계수든 $a_{nm}\le1$이다(연습문제 12.1).`,
    body: R`
**두 조건.** 지수함수는 항상 양수이므로 분자와 분모가 양수이고 $a_{nm}>0$. 분모가 모든 분자의 합이므로
$$\sum_{m=1}^Na_{nm}=\frac{\sum_m\exp(s_{nm})}{\sum_{m'}\exp(s_{nm'})}=1.$$
**볼록 결합.** 음이 아닌 계수의 합이 1인 일차결합이 볼록 결합의 정의입니다. 성분 $i$마다
$$\min_mx_{mi}=\sum_ma_{nm}\min_{m'}x_{m'i}\le\sum_ma_{nm}x_{mi}=y_{ni}\le\sum_ma_{nm}\max_{m'}x_{m'i}=\max_mx_{mi}.$$
행렬로 쓰면 $\operatorname{Softmax}[\mathbf S]$의 행은 모두 확률 벡터(행 확률 행렬)이고 $\mathbf Y=\operatorname{Softmax}[\mathbf S]\mathbf X$입니다.

**$a_{nm}\le1$ (연습문제 12.1).** 직접 보이면, 음이 아닌 나머지 계수를 빼서 $a_{nk}=1-\sum_{m\ne k}a_{nm}\le1$입니다. 교재가 요구한 라그랑주 승수로는, $a_{nk}$를 두 조건 아래서 최대화합니다. $L=a_{nk}+\lambda\big(1-\sum_ma_{nm}\big)+\sum_m\mu_ma_{nm}$ ($\mu_m\ge0$, $\mu_ma_{nm}=0$)의 정류 조건은 $a_{nk}$에 대해 $1-\lambda+\mu_k=0$, $m\ne k$에 대해 $-\lambda+\mu_m=0$입니다. 따라서 $\lambda=\mu_m\ge0$이고 $\mu_k=\lambda-1\ge0$에서 $\lambda\ge1>0$이므로, 상보성 $\mu_ma_{nm}=0$에서 $a_{nm}=0$ ($m\ne k$)입니다. 남은 조건으로 최댓값은 $a_{nk}=1$이고, 목적함수와 제약이 모두 일차라 이 KKT 점이 실제 최댓값입니다.`,
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

  { ch: 'ch15', id: 'scaled-var', title: '점곱의 분산은 D_k이고 소프트맥스는 포화한다', keys: ['스케일드 점곱 어텐션'], src: 'Bishop 연습문제 12.4',
    tags: 'scaled dot product attention variance sqrt dk softmax saturation jacobian 스케일 점곱 분산 포화 야코비안',
    stmt: R`$\mathbf q,\mathbf k\in\mathbb R^{D_k}$의 성분이 모두 서로 독립이고 평균 0, 분산 1이면(예: 두 벡터가 $\N(\mathbf 0,\mathbf I)$에서 독립으로 뽑힘) $\E[\mathbf q^T\mathbf k]=0$, $\E[(\mathbf q^T\mathbf k)^2]=\operatorname{var}[\mathbf q^T\mathbf k]=D_k$이다. 소프트맥스 $p=\operatorname{softmax}(\mathbf z)$의 야코비안은 $\partial p_i/\partial z_j=p_i(\delta_{ij}-p_j)$이며, $p$가 원-핫에 가까우면 모든 원소가 0에 가깝다.`,
    body: R`
**평균.** 독립이므로 $\E[q_ik_i]=\E[q_i]\E[k_i]=0$, 합도 0.

**분산.** $\E[(q_ik_i)^2]=\E[q_i^2]\E[k_i^2]=1\cdot1=1$이고 평균이 0이라 $\operatorname{var}[q_ik_i]=1$. 서로 다른 $i,j$에 대해 $\operatorname{cov}[q_ik_i,q_jk_j]=\E[q_i]\E[k_i]\E[q_j]\E[k_j]=0$이므로
$$\operatorname{var}\Big[\sum_{i=1}^{D_k}q_ik_i\Big]=\sum_i\operatorname{var}[q_ik_i]=D_k.$$
따라서 $\mathbf q^T\mathbf k/\sqrt{D_k}$의 분산은 $D_k/D_k=1$입니다. 교재 연습문제 12.4처럼 직접 전개해도 같습니다: $\E[(\mathbf q^T\mathbf k)^2]=\sum_{i,j}\E[q_iq_j]\E[k_ik_j]$에서 $i\ne j$인 항은 $\E[q_i]\E[q_j]=0$이고 $i=j$인 항은 $1\cdot1$이라 합이 $D_k$입니다.

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

  { ch: 'ch15', id: 'perm-equiv', title: '셀프 어텐션의 순열 등변성', keys: ['순열 등변성'], src: 'Bishop 연습문제 12.7',
    tags: 'permutation equivariance self-attention position 순열 등변성 셀프 어텐션 위치',
    stmt: R`$\mathbf P$가 순열 행렬이면 $\operatorname{Attention}(\mathbf P\mathbf X)=\mathbf P\operatorname{Attention}(\mathbf X)$이고, 위치 부호화가 없으면 멀티헤드 어텐션도 $\mathbf Y(\mathbf P\mathbf X)=\mathbf P\mathbf Y(\mathbf X)$이다. 여기서 $\operatorname{Attention}(\mathbf X)=\operatorname{Softmax}[\mathbf X\mathbf W^{(q)}\mathbf W^{(k)T}\mathbf X^T/\sqrt{D_k}]\mathbf X\mathbf W^{(v)}$.`,
    body: R`
**투영.** $\mathbf Q'=\mathbf P\mathbf X\mathbf W^{(q)}=\mathbf P\mathbf Q$, 마찬가지로 $\mathbf K'=\mathbf P\mathbf K$, $\mathbf V'=\mathbf P\mathbf V$.

**점수.** $\mathbf S'=\mathbf Q'\mathbf K'^T/\sqrt{D_k}=\mathbf P\mathbf S\mathbf P^T$. 순열 $\pi$로 쓰면 $(\mathbf P\mathbf S\mathbf P^T)_{nm}=s_{\pi(n)\pi(m)}$: 행과 열을 같은 순열로 섞은 것입니다.

**소프트맥스.** 행마다의 소프트맥스는 (a) 행의 순서를 바꾸면 결과의 행 순서도 바뀌고 (b) 한 행 안의 원소 순서를 바꾸면 결과도 같은 순서로 바뀝니다(각 원소의 값과 분모가 그대로). 따라서 $\operatorname{Softmax}[\mathbf P\mathbf S\mathbf P^T]=\mathbf P\operatorname{Softmax}[\mathbf S]\mathbf P^T$.

**합치기.** $\mathbf P^T\mathbf P=\mathbf I$이므로
$$\operatorname{Attention}(\mathbf P\mathbf X)=\mathbf P\operatorname{Softmax}[\mathbf S]\mathbf P^T\mathbf P\mathbf V=\mathbf P\operatorname{Softmax}[\mathbf S]\mathbf V=\mathbf P\operatorname{Attention}(\mathbf X).$$
위치별 MLP와 층 정규화는 행마다 같은 함수를 적용하므로 $f(\mathbf P\mathbf X)=\mathbf Pf(\mathbf X)$이고, 잔차 덧셈도 그렇습니다. 등변인 함수의 합성은 등변이므로 트랜스포머 층 전체가 순열 등변입니다.

**멀티헤드 (연습문제 12.7).** 머리마다 위의 결과로 $\mathbf H_h(\mathbf P\mathbf X)=\mathbf P\mathbf H_h(\mathbf X)$입니다. 이어 붙이기는 행을 그대로 옆으로 붙이므로 $\operatorname{Concat}[\mathbf P\mathbf H_1,\dots,\mathbf P\mathbf H_H]=\mathbf P\operatorname{Concat}[\mathbf H_1,\dots,\mathbf H_H]$이고, 오른쪽에 $\mathbf W^{(o)}$를 곱해도 왼쪽의 $\mathbf P$는 그대로라 $\mathbf Y(\mathbf P\mathbf X)=\mathbf P\mathbf Y(\mathbf X)$입니다.`,
    note: R`그래서 위치 부호화 $\widetilde{\mathbf x}_n=\mathbf x_n+\mathbf r_n$이 없으면 문장의 단어 순서를 바꿔도 각 단어의 출력 표현이 그대로입니다. 인과 마스크는 위치에 의존하므로 GPT의 층은 엄밀히는 등변이 아니지만, 그것만으로는 절대 위치를 알기 어렵습니다.` },

  { ch: 'ch15', id: 'highdim-orth', title: '고차원의 무작위 벡터는 거의 직교한다', keys: ['위치 부호화의 덧셈'], src: 'Bishop 연습문제 12.8',
    tags: 'high dimension random vectors orthogonal positional encoding addition 고차원 무작위 직교 위치 부호화 덧셈',
    stmt: R`$\mathbf u,\mathbf v\in\mathbb R^D$의 성분이 모두 서로 독립이고 평균 0, 분산 $1/D$이면 $\E[\lVert\mathbf u\rVert^2]=1$, $\E[\mathbf u^T\mathbf v]=0$, $\operatorname{var}[\mathbf u^T\mathbf v]=1/D$이다. 또 단위벡터 $\mathbf a,\mathbf b$가 방향에 무관한(원점 대칭인) 분포에서 독립으로 뽑히면 사잇각의 코사인 $\mathbf a^T\mathbf b$는 평균 0, 분산 $1/D$이라, $D$가 크면 두 벡터는 거의 직교한다(연습문제 12.8).`,
    body: R`
$\E[\lVert\mathbf u\rVert^2]=\sum_i\E[u_i^2]=D\cdot\frac1D=1$. 독립이고 평균 0이므로 $\E[u_iv_i]=0$이라 $\E[\mathbf u^T\mathbf v]=0$.
$\operatorname{var}[u_iv_i]=\E[u_i^2]\E[v_i^2]=\frac1{D^2}$이고 서로 다른 $i$의 항은 상관이 없으므로 $\operatorname{var}[\mathbf u^T\mathbf v]=D\cdot\frac1{D^2}=\frac1D$.
두 벡터의 길이가 거의 1이므로 코사인 유사도도 평균 0, 표준편차 약 $1/\sqrt D$입니다. $D=512$이면 $0.044$로, 무관한 두 방향은 거의 직교합니다. 그래서 토큰 임베딩에 위치 벡터를 **더해도** 두 정보가 서로 거의 다른 방향을 차지해, 이후 층의 선형 투영이 둘을 어느 정도 따로 읽어 낼 수 있습니다.

**단위벡터 (연습문제 12.8).** 정규직교 기저 $\{\mathbf u_i\}$로 $\mathbf a=\sum_ia_i\mathbf u_i$, $\mathbf b=\sum_ib_i\mathbf u_i$라 쓰면 $\sum_ia_i^2=1$이고 $\cos\theta=\mathbf a^T\mathbf b=\sum_ia_ib_i$입니다. 분포가 방향에 무관하므로 한 좌표의 부호를 뒤집거나 좌표를 서로 바꾸어도 분포가 같습니다. 부호 뒤집기에서 $\E[a_i]=0$, $\E[a_ia_j]=0$ ($i\ne j$; $a_i$만 뒤집으면 $a_ia_j$의 부호가 바뀜)이고, 좌표 바꾸기에서 $\E[a_i^2]$가 모든 $i$에서 같으며 합이 $\E[\sum_ia_i^2]=1$이므로 $\E[a_i^2]=\frac1D$입니다. $\mathbf b$도 같습니다. 독립성으로
$$\E[\cos\theta]=\sum_i\E[a_i]\E[b_i]=0,\qquad \E[\cos^2\theta]=\sum_{i,j}\E[a_ia_j]\E[b_ib_j]=\sum_i\frac1D\cdot\frac1D=\frac1D.$$
체비셰프 부등식으로 $P(\lvert\cos\theta\rvert\ge\epsilon)\le\frac1{D\epsilon^2}$이라, $D$가 커지면 코사인의 크기는 0 근처에 몰립니다.`,
    note: R`분산 $\operatorname{var}[\lVert\mathbf u\rVert^2]=D\operatorname{var}[u_i^2]=D\cdot\frac2{D^2}=\frac2D$ (가우시안일 때)라 길이도 1 근처에 몰립니다. 이것이 “고차원에서는 무작위 벡터가 구면 위에 퍼지고 서로 거의 직교한다”는 측도 집중 현상입니다.` },

  { ch: 'ch15', id: 'pe-relative', title: '사인파 위치 부호화의 상대 위치 성질', keys: ['사인파 위치 부호화'], src: 'Bishop 연습문제 12.10',
    tags: 'sinusoidal positional encoding relative position rotation matrix 사인파 위치 부호화 상대 위치 회전 행렬',
    stmt: R`사인파 위치 부호화에서 $\mathbf r_{n+k}=\mathbf M_k\mathbf r_n$인 행렬 $\mathbf M_k$가 존재하고, $\mathbf M_k$는 $n$과 무관하며 $2\times2$ 회전 블록들의 블록 대각 행렬이다. 또 $\mathbf r_n^T\mathbf r_{n+k}$는 $k$에만 의존한다. 사인 성분만으로 부호화하면 이런 $\mathbf M_k$는 존재하지 않는다.`,
    body: R`
짝수 $i$와 $i+1$은 같은 각진동수 $\omega=L^{-i/D}$로 $(r_{ni},r_{n,i+1})=(\sin\omega n,\cos\omega n)$입니다. 덧셈정리
$$\sin(\omega n+\omega k)=\sin\omega n\cos\omega k+\cos\omega n\sin\omega k,\qquad \cos(\omega n+\omega k)=\cos\omega n\cos\omega k-\sin\omega n\sin\omega k$$
를 행렬로 쓰면
$$\begin{pmatrix}r_{n+k,i}\\r_{n+k,i+1}\end{pmatrix}=\underbrace{\begin{pmatrix}\cos\omega k&\sin\omega k\\-\sin\omega k&\cos\omega k\end{pmatrix}}_{\mathbf R(\omega k)}\begin{pmatrix}r_{ni}\\r_{n,i+1}\end{pmatrix}.$$
$\mathbf R(\omega k)$에는 $n$이 없습니다. 모든 쌍의 블록을 대각으로 모은 것이 $\mathbf M_k$입니다.

**내적.** 한 쌍의 기여는 $\sin\omega n\sin\omega(n+k)+\cos\omega n\cos\omega(n+k)=\cos\big(\omega(n+k)-\omega n\big)=\cos\omega k$. 따라서
$$\mathbf r_n^T\mathbf r_{n+k}=\sum_{\text{쌍}}\cos(\omega_jk)$$
는 $n$과 무관하게 거리 $k$로만 정해집니다.

**사인만 쓰면 안 된다.** 모든 성분이 $r_{ni}=\sin(\omega_in)$이라 하자. 그러면 $\mathbf r_0=\mathbf 0$이므로 어떤 행렬이든 $\mathbf M_k\mathbf r_0=\mathbf 0$입니다. 그런데 $\sin(\omega_ik)\ne0$인 성분이 하나라도 있으면(예: $\omega_0=L^0=1$이라 0이 아닌 정수 $k$에서 늘 $\sin k\ne0$) $\mathbf r_k\ne\mathbf 0$이므로 $\mathbf r_{0+k}=\mathbf M_k\mathbf r_0$이 불가능합니다. 덧셈정리 $\sin(A+B)=\sin A\cos B+\cos A\sin B$에 $\cos A$ 항이 있어서, 코사인 성분이 있어야 선형 관계가 닫힙니다.`,
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
$\E[(y-t)^2]=y^2-2y\E[t]+\E[t^2]$은 $y$에 대한 아래로 볼록한(볼록) 이차식이고, 미분하면 $2y-2\E[t]=0$에서 $y=\E[t]$가 유일한 최소점입니다. 값을 대입하면 최소값은 $\operatorname{var}[t]$입니다.
$t=0$ 또는 $1$이 각각 확률 $\tfrac12$이면 $\E[t]=\tfrac12$. 화소로 말하면 “검정 아니면 흰색”인 곳을 회색으로 칠하는 것이 제곱오차(가우시안 가능도)의 최적이고, 이것이 연속 회귀로 만든 영상이 흐린 이유입니다. 이산 분포 $p(t=0)=p(t=1)=\tfrac12$은 두 가능성을 모두 유지하며, 뽑은 표본은 늘 0이나 1입니다.`,
    note: R`같은 논리가 음성 합성(같은 문장을 여러 방식으로 말할 수 있음)에서 회귀 대신 이산 음성 토큰의 언어 모델링을 쓰는 이유입니다.` },

  { ch: 'ch15', id: 'nb-posterior', title: '나이브 베이즈 사후확률', keys: ['단어 주머니와 나이브 베이즈'],
    tags: 'naive bayes bag of words posterior conditional independence smoothing 나이브 베이즈 단어 주머니 사후확률 조건부 독립 평활화',
    stmt: R`단어들이 클래스가 주어졌을 때 조건부 독립이면 $p(\mathcal C_k\mid\mathbf x_{1:N})=\dfrac{p(\mathcal C_k)\prod_np(\mathbf x_n\mid\mathcal C_k)}{\sum_jp(\mathcal C_j)\prod_np(\mathbf x_n\mid\mathcal C_j)}$이다. 어떤 $p(\mathbf x_n\mid\mathcal C_k)=0$이면 그 클래스의 사후확률은 다른 단어의 증거와 무관하게 0이다.`,
    body: R`
베이즈 정리로 $p(\mathcal C_k\mid\mathbf x_{1:N})=p(\mathbf x_{1:N}\mid\mathcal C_k)p(\mathcal C_k)/p(\mathbf x_{1:N})$이고, 분모는 합의 규칙으로 $\sum_jp(\mathbf x_{1:N}\mid\mathcal C_j)p(\mathcal C_j)$입니다. 조건부 독립 가정으로 $p(\mathbf x_{1:N}\mid\mathcal C_k)=\prod_np(\mathbf x_n\mid\mathcal C_k)$를 대입하면 위 식입니다.
곱의 인수 하나가 0이면 분자가 0이므로 사후확률이 0입니다. 다른 단어들이 그 클래스를 아무리 강하게 지지해도 되살릴 수 없습니다. 라플라스 평활화 $p(w\mid\mathcal C_k)=\frac{n_{kw}+1}{n_k+K}$는 모든 단어에 양의 확률을 주어 이를 막습니다($n_{kw}$: 클래스 $k$에서 단어 $w$의 빈도, $n_k$: 클래스 $k$의 전체 단어 수, $K$: 어휘 크기).`,
    note: R`실제 계산은 아주 작은 확률의 곱이 언더플로하지 않도록 로그를 더합니다: $\ln p(\mathcal C_k)+\sum_n\ln p(\mathbf x_n\mid\mathcal C_k)$.` },

  { ch: 'ch15', id: 'orth-inputs', title: '직교 입력의 셀프 어텐션: 출력은 입력에 가깝지만 같지는 않다', keys: ['셀프 어텐션'], src: 'Bishop 연습문제 12.3',
    tags: 'self-attention orthogonal inputs identity textbook correction 셀프 어텐션 직교 입력 항등 교재 바로잡기',
    stmt: R`기본 셀프 어텐션 $\mathbf y_n=\sum_ma_{nm}\mathbf x_m$, $a_{nm}=\exp(\mathbf x_n^T\mathbf x_m)/\sum_{m'}\exp(\mathbf x_n^T\mathbf x_{m'})$에서 영벡터가 아닌 $N\ge2$개의 입력이 서로 직교하면
$$a_{nn}=\frac{e^{\lVert\mathbf x_n\rVert^2}}{e^{\lVert\mathbf x_n\rVert^2}+N-1},\qquad a_{nm}=\frac{1-a_{nn}}{N-1}\ (m\ne n)$$
이다. 따라서 교재의 진술 $\mathbf y_n=\mathbf x_n$은 정확히는 성립하지 않고, $\lVert\mathbf y_n-\mathbf x_n\rVert\le(1-a_{nn})\max_m\lVert\mathbf x_m-\mathbf x_n\rVert$이다. $N$과 다른 입력들을 고정하고 $\lVert\mathbf x_n\rVert\to\infty$이면 $\mathbf y_n-\mathbf x_n\to\mathbf 0$이고, $a_{nn}\approx1$이려면 $\lVert\mathbf x_n\rVert^2$이 $\ln(N-1)$보다 훨씬 커야 한다.`,
    body: R`
**계수.** 직교이므로 $\mathbf x_n^T\mathbf x_m=0$ ($m\ne n$)이고 $\mathbf x_n^T\mathbf x_n=\lVert\mathbf x_n\rVert^2$입니다. 분모는 $e^{\lVert\mathbf x_n\rVert^2}+(N-1)e^0$이므로 위의 $a_{nn}$이 나오고, 나머지 $N-1$개 계수는 모두 $\frac1{e^{\lVert\mathbf x_n\rVert^2}+N-1}=\frac{1-a_{nn}}{N-1}$로 같습니다. $N\ge2$이면 $a_{nn}<1$이라 $\mathbf y_n=a_{nn}\mathbf x_n+\frac{1-a_{nn}}{N-1}\sum_{m\ne n}\mathbf x_m$에는 다른 입력이 양의 비율로 섞입니다. $m\ne n$이면 $\mathbf y_n^T\mathbf x_m=a_{nm}\lVert\mathbf x_m\rVert^2>0$인데 $\mathbf x_n^T\mathbf x_m=0$이므로 $\mathbf y_n\ne\mathbf x_n$입니다.

**오차.** 계수의 합이 1이므로 $\mathbf y_n-\mathbf x_n=\sum_ma_{nm}(\mathbf x_m-\mathbf x_n)=\sum_{m\ne n}a_{nm}(\mathbf x_m-\mathbf x_n)$이고, 삼각부등식으로
$$\lVert\mathbf y_n-\mathbf x_n\rVert\le\sum_{m\ne n}a_{nm}\lVert\mathbf x_m-\mathbf x_n\rVert\le(1-a_{nn})\max_m\lVert\mathbf x_m-\mathbf x_n\rVert.$$
**극한.** $1-a_{nn}=\frac{N-1}{e^{\lVert\mathbf x_n\rVert^2}+N-1}=\frac1{1+e^{\lVert\mathbf x_n\rVert^2-\ln(N-1)}}$이므로 $a_{nn}\approx1$은 $\lVert\mathbf x_n\rVert^2\gg\ln(N-1)$일 때에만 성립합니다. $N$과 다른 입력들을 고정하고 $\lVert\mathbf x_n\rVert\to\infty$로 보내면 $1-a_{nn}\le(N-1)e^{-\lVert\mathbf x_n\rVert^2}$이고 $\max_m\lVert\mathbf x_m-\mathbf x_n\rVert\le\lVert\mathbf x_n\rVert+C$ ($C$: 다른 입력 크기의 최댓값)이므로, 오차의 상계 $(N-1)e^{-\lVert\mathbf x_n\rVert^2}(\lVert\mathbf x_n\rVert+C)$가 0으로 갑니다.`,
    note: R`예: $\mathbf x_1=(1,0)$, $\mathbf x_2=(0,1)$이면 $a_{11}=\frac e{e+1}=0.731$, $\mathbf y_1=(0.731,\ 0.269)$. 교재의 문장은 점수가 아주 클 때(하드 어텐션에 가까울 때)의 근사로 읽어야 합니다. 스케일드 어텐션에서는 지수가 $\lVert\mathbf x_n\rVert^2/\sqrt{D_k}$라 더 작아져 근사가 더 나빠집니다.` },

  { ch: 'ch15', id: 'mha-sum', title: '멀티헤드 어텐션은 머리별 기여의 합이다', keys: ['멀티헤드 어텐션'], src: 'Bishop 연습문제 12.5',
    tags: 'multi-head attention sum over heads output projection rank deficient 멀티헤드 어텐션 머리별 합 출력 투영 계수 부족',
    stmt: R`$\mathbf W^{(o)}\in\mathbb R^{HD_v\times D}$를 위에서부터 $D_v$행씩 나눈 블록을 $\mathbf W_h^{(o)}\in\mathbb R^{D_v\times D}$라 하고 $\mathbf A_h=\operatorname{Softmax}[\mathbf Q_h\mathbf K_h^T/\sqrt{D_k}]$ ($N\times N$)라 하면
$$\mathbf Y=\operatorname{Concat}[\mathbf H_1,\dots,\mathbf H_H]\mathbf W^{(o)}=\sum_{h=1}^H\mathbf A_h\mathbf X\mathbf W^{(h)},\qquad \mathbf W^{(h)}=\mathbf W_h^{(v)}\mathbf W_h^{(o)}$$
이다. $\mathbf W^{(h)}$는 $D\times D$이지만 $\operatorname{rank}\mathbf W^{(h)}\le D_v$이므로, $D_v<D$이면 이 자리를 아무 $D\times D$ 행렬로 바꾼 모델은 원래 모델과 같지 않다.`,
    body: R`
**블록 곱셈.** 이어 붙인 행렬 $[\mathbf H_1\ \cdots\ \mathbf H_H]$ ($N\times HD_v$)의 열을 $D_v$개씩, $\mathbf W^{(o)}$의 행을 같은 방식으로 나누면 행렬곱은 대응하는 블록 곱의 합입니다:
$$[\mathbf H_1\ \cdots\ \mathbf H_H]\begin{pmatrix}\mathbf W_1^{(o)}\\\vdots\\\mathbf W_H^{(o)}\end{pmatrix}=\sum_{h=1}^H\mathbf H_h\mathbf W_h^{(o)}.$$
성분으로 보면 $(i,j)$ 원소의 합 $\sum_{c=1}^{HD_v}$를 머리별 구간으로 나눈 것과 같습니다.

**머리 하나.** $\mathbf H_h=\operatorname{Attention}(\mathbf Q_h,\mathbf K_h,\mathbf V_h)=\mathbf A_h\mathbf V_h=\mathbf A_h\mathbf X\mathbf W_h^{(v)}$이므로 $\mathbf H_h\mathbf W_h^{(o)}=\mathbf A_h\mathbf X\mathbf W_h^{(v)}\mathbf W_h^{(o)}=\mathbf A_h\mathbf X\mathbf W^{(h)}$입니다.

**계수.** $\mathbf W_h^{(v)}$는 $D\times D_v$라 열이 $D_v$개뿐이고, $\mathbf W^{(h)}$의 각 열은 그 열들의 일차결합이므로 $\operatorname{rank}\mathbf W^{(h)}\le D_v$입니다. 일반적인 $D\times D$ 행렬은 계수가 $D$까지 가능하므로, $D_v=D/H<D$이면 $\mathbf W^{(h)}$를 자유로운 행렬로 바꾼 모델은 원래 모델이 나타낼 수 없는 함수까지 나타내며 모수도 $D^2$개로 늘어 같은 모델이 아닙니다.`,
    note: R`교재의 식 (12.42)는 $\mathbf H_h$로 쓰지만 여기서는 값까지 곱한 머리 출력(12.15)이 아니라 어텐션 가중치 행렬 $\mathbf A_h$를 뜻해야 크기가 맞습니다($\mathbf A_h\mathbf X\mathbf W^{(h)}$: $N\times N$, $N\times D$, $D\times D$). 합 꼴은 각 머리가 “자기 어텐션 무늬로 섞은 입력에 저계수 변환을 건 것”을 더한다는 해석을 줍니다.` },

  { ch: 'ch15', id: 'sa-sparse', title: '셀프 어텐션은 모수를 공유하는 희소한 큰 행렬이다', keys: ['트랜스포머 층의 계산량'], src: 'Bishop 연습문제 12.6',
    tags: 'self-attention fully connected sparse block matrix parameter sharing Kronecker 셀프 어텐션 완전연결 희소 블록 행렬 모수 공유 크로네커',
    stmt: R`토큰을 세로로 이어 붙인 $\mathbf x=(\mathbf x_1;\dots;\mathbf x_N)\in\mathbb R^{ND}$와 출력 $\mathbf y=(\mathbf y_1;\dots;\mathbf y_N)\in\mathbb R^{ND_v}$에 대해, 셀프 어텐션은 어텐션 가중치 $\mathbf A=[a_{nm}]$이 주어졌을 때
$$\mathbf y=\mathbf M\mathbf x,\qquad \mathbf M=(\mathbf A\otimes\mathbf I_{D_v})(\mathbf I_N\otimes\mathbf W^{(v)T})$$
로 쓰이고, $\mathbf M$의 블록 $(n,m)$은 $a_{nm}\mathbf W^{(v)T}$이다. 같은 크기의 완전연결층은 독립 모수가 $N^2DD_v=O(N^2D^2)$개지만, 셀프 어텐션의 학습 모수는 $\mathbf W^{(q)},\mathbf W^{(k)},\mathbf W^{(v)}$의 $D(2D_k+D_v)=O(D^2)$개뿐이다.`,
    body: R`
**블록 구조.** 열벡터로 쓰면 값은 $\mathbf v_m=\mathbf W^{(v)T}\mathbf x_m$이고 출력은 $\mathbf y_n=\sum_ma_{nm}\mathbf v_m=\sum_ma_{nm}\mathbf W^{(v)T}\mathbf x_m$입니다. 따라서 $\mathbf y$를 $\mathbf x$에 대한 행렬로 쓰면 $(n,m)$ 블록($D_v\times D$)이 $a_{nm}\mathbf W^{(v)T}$입니다. $N^2$개의 블록이 모두 **같은** 행렬 $\mathbf W^{(v)T}$에 비례하므로 이것이 모수 공유입니다.

**두 희소 행렬의 곱.** $\mathbf I_N\otimes\mathbf W^{(v)T}$는 대각 블록에만 $\mathbf W^{(v)T}$가 있고 나머지 $N^2-N$개 블록이 0인 블록 대각 행렬로, 토큰마다 값 투영을 합니다. $\mathbf A\otimes\mathbf I_{D_v}$는 블록 $(n,m)$이 $a_{nm}\mathbf I_{D_v}$인 행렬로, 각 블록 안에서 대각만 0이 아니며 토큰들을 섞습니다. 블록끼리 곱하면 $(n,m)$ 블록은 $\sum_la_{nl}\mathbf I\cdot\delta_{lm}\mathbf W^{(v)T}=a_{nm}\mathbf W^{(v)T}$로 $\mathbf M$과 같습니다(크로네커 곱의 성질 $(\mathbf A\otimes\mathbf B)(\mathbf C\otimes\mathbf D)=\mathbf A\mathbf C\otimes\mathbf B\mathbf D$).

**모수 세기.** 완전연결층은 $ND_v\times ND$ 행렬의 원소가 모두 자유로워 $N^2DD_v$개입니다. 셀프 어텐션에서는 $\mathbf W^{(v)T}$의 $DD_v$개가 모든 블록에 공유되고, 계수 $a_{nm}$은 학습되는 수가 아니라 $\mathbf W^{(q)},\mathbf W^{(k)}$ ($2DD_k$개)로 입력에서 계산됩니다. 합 $D(2D_k+D_v)$는 $N$과 무관합니다.`,
    note: R`$\mathbf A$가 입력에 의존하므로 셀프 어텐션 전체는 $\mathbf x$의 선형함수가 아니고, 위 식은 “가중치가 정해진 순간”의 모양입니다. 그림으로 그리면 $N\times N$ 격자의 칸마다 같은 무늬($\mathbf W^{(v)T}$)가 크기 $a_{nm}$만큼 칠해진 모양이고, 인과 마스크를 쓰면 위쪽 삼각형 블록이 모두 0이 됩니다.` },

  { ch: 'ch15', id: 'concat-pe', title: '이어 붙인 위치 부호화의 선형변환은 두 선형변환의 합이다', keys: ['위치 부호화의 덧셈'], src: 'Bishop 연습문제 12.9',
    tags: 'positional encoding concatenation addition linear transformation block matrix 위치 부호화 이어 붙이기 덧셈 선형변환 블록 행렬',
    stmt: R`토큰 $\mathbf x\in\mathbb R^D$와 위치 벡터 $\mathbf e\in\mathbb R^{D'}$를 이어 붙인 $\begin{pmatrix}\mathbf x\\\mathbf e\end{pmatrix}$에 임의의 행렬 $\mathbf W\in\mathbb R^{M\times(D+D')}$를 곱하면, $\mathbf W=[\mathbf W_x\ \ \mathbf W_e]$ ($\mathbf W_x\in\mathbb R^{M\times D}$, $\mathbf W_e\in\mathbb R^{M\times D'}$)로 나눌 때
$$\mathbf W\begin{pmatrix}\mathbf x\\\mathbf e\end{pmatrix}=\mathbf W_x\mathbf x+\mathbf W_e\mathbf e$$
이다. 곧 이어 붙인 뒤의 선형변환은 “변환된 토큰 + 변환된 위치 벡터”의 덧셈과 같다.`,
    body: R`
$i$번째 성분을 쓰면 $\Big(\mathbf W\begin{pmatrix}\mathbf x\\\mathbf e\end{pmatrix}\Big)_i=\sum_{j=1}^DW_{ij}x_j+\sum_{j=1}^{D'}W_{i,D+j}e_j$입니다. 첫 합은 $\mathbf W$의 앞 $D$열, 곧 $(\mathbf W_x\mathbf x)_i$이고 둘째 합은 뒤 $D'$열, 곧 $(\mathbf W_e\mathbf e)_i$입니다. 모든 $i$에서 성립하므로 벡터로 $\mathbf W_x\mathbf x+\mathbf W_e\mathbf e$입니다.
따라서 이어 붙인 입력에 쿼리·키·값 투영을 거는 것은 원래 차원의 토큰 투영에 $\mathbf r=\mathbf W_e\mathbf e$라는 위치 벡터를 **더한** 것과 같습니다. 차이는 위치 벡터가 투영마다 따로 학습된 $\mathbf W_e$를 거친다는 것뿐입니다.`,
    note: R`그래서 교재는 덧셈과 이어 붙이기가 비슷한 성질을 가진다고 말하고, 차원을 늘리지 않는 덧셈 $\widetilde{\mathbf x}_n=\mathbf x_n+\mathbf r_n$을 씁니다. 행벡터 관례($\mathbf X\mathbf W$)로 쓰면 $\mathbf W$를 위아래로 나눠 $\mathbf x^T\mathbf W_x+\mathbf e^T\mathbf W_e$가 됩니다.` },

  { ch: 'ch15', id: 'bow-mle', title: '단어 주머니의 최대가능도 해는 단어의 비율이다', keys: ['단어 주머니와 나이브 베이즈'], src: 'Bishop 연습문제 12.11',
    tags: 'bag of words maximum likelihood relative frequency Lagrange multiplier KL Gibbs inequality 단어 주머니 최대가능도 비율 라그랑주 승수',
    stmt: R`어휘 $\{1,\dots,K\}$, 모든 위치가 공유하는 확률표 $p(\mathbf x=k)=\mu_k$ ($\mu_k\ge0$, $\sum_k\mu_k=1$)의 단어 주머니 모델에서, 훈련 자료의 단어 $N$개 중 $k$번 단어가 $n_k$번 나왔다면 가능도를 최대로 하는 표는 $\mu_k=n_k/N$이다(유일).`,
    body: R`
**가능도.** 단어들이 독립이므로 $p(\mathcal D)=\prod_{\text{단어}}\mu_{k}=\prod_k\mu_k^{n_k}$, 로그가능도는 $\ell(\boldsymbol\mu)=\sum_kn_k\ln\mu_k$입니다($n_k=0$인 항은 0으로 둠).

**라그랑주 승수(후보 찾기).** $\sum_k\mu_k=1$ 아래서 $L=\sum_kn_k\ln\mu_k+\lambda(1-\sum_k\mu_k)$를 미분하면 $n_k/\mu_k-\lambda=0$, 곧 $\mu_k=n_k/\lambda$. 합이 1이 되려면 $\lambda=\sum_kn_k=N$이라 $\mu_k=n_k/N$입니다.

**전역 최대임을 확인.** $\hat\mu_k=n_k/N$이라 하면 임의의 $\boldsymbol\mu$에 대해
$$\ell(\boldsymbol\mu)-\ell(\hat{\boldsymbol\mu})=N\sum_k\hat\mu_k\ln\frac{\mu_k}{\hat\mu_k}=-N\,\KL(\hat{\boldsymbol\mu}\Vert\boldsymbol\mu)\le0$$
이고, KL 발산은 두 분포가 같을 때만 0이므로[[ch05:2.5b|KL 발산의 비음성.]] 최대점은 $\hat{\boldsymbol\mu}$ 하나뿐입니다($\hat\mu_k=0$인 항은 합에서 빠지고, 어떤 $\hat\mu_k>0$에서 $\mu_k=0$이면 왼쪽이 $-\infty$).`,
    note: R`훈련 자료에 없던 단어는 $\hat\mu_k=0$이 되어, 그 단어가 든 서열의 확률이 0이 됩니다. 나이브 베이즈에서 평활화가 필요한 바로 그 이유입니다. 나이브 베이즈의 클래스별 표 $p(\mathbf x\mid\mathcal C_k)$도 같은 논증으로 클래스 안의 단어 비율이 됩니다.` },

  { ch: 'ch15', id: 'table-growth', title: '자기회귀 확률표의 크기는 지수적으로 늘어난다', keys: ['자기회귀 분해와 n-그램'], src: 'Bishop 연습문제 12.12',
    tags: 'autoregressive model probability table exponential growth n-gram parameters 자기회귀 확률표 지수적 증가 모수',
    stmt: R`어휘 크기 $K\ge2$에서 $p(\mathbf x_n\mid\mathbf x_1,\dots,\mathbf x_{n-1})$을 일반적인 확률표로 두면 칸은 $K^n$개(독립 모수 $K^{n-1}(K-1)$개)이고, 길이 $N$의 서열 전체에 필요한 칸은 $\sum_{n=1}^NK^n=\frac{K(K^N-1)}{K-1}$로 $N$에 대해 지수적으로 늘어난다.`,
    body: R`
조건 $(\mathbf x_1,\dots,\mathbf x_{n-1})$은 각 자리가 $K$가지라 곱의 법칙으로 $K^{n-1}$가지이고, 조건마다 다음 단어 $K$가지의 확률이 필요하므로 칸은 $K^{n-1}\cdot K=K^n$개입니다. 조건마다 확률의 합이 1이라 마지막 하나는 정해지므로 독립 모수는 $K^{n-1}(K-1)$개입니다.
$n=1,\dots,N$의 표를 모두 더하면 등비급수 $\sum_{n=1}^NK^n=K\frac{K^N-1}{K-1}$이고, $K\ge2$이면 이 값은 $K^N$ 이상이라 $N$에 대해 지수적으로 커집니다.`,
    note: R`$K=10{,}000$이면 $n=3$의 표만 $10^{12}$칸입니다. 마르코프 가정으로 조건을 최근 $L$개로 자르면 표는 $K^{L+1}$칸으로 $n$과 무관해지지만 $L$에 대해서는 여전히 지수적입니다. 신경망은 표 대신 공유된 모수로 조건부 분포를 표현해 이 폭발을 피합니다.` },

  { ch: 'ch15', id: 'ngram-ratio', title: 'n-그램을 결합 빈도의 비로 계산하기', keys: ['자기회귀 분해와 n-그램'], src: 'Bishop 연습문제 12.13',
    tags: 'n-gram joint frequency ratio product rule counting final token omitted 엔그램 결합 빈도 비 곱의 규칙 마지막 토큰',
    stmt: R`서열들의 말뭉치에서 토큰 $L$개짜리 묶음의 상대 빈도를 $p_L$, $L-1$개짜리 묶음의 상대 빈도를 $p_{L-1}$이라 하자. 문맥 $\mathbf u=(\mathbf x_{n-L+1},\dots,\mathbf x_{n-1})$ 뒤에 $\mathbf w$가 오는 조건부 상대 빈도는
$$p(\mathbf w\mid\mathbf u)=\frac{p_L(\mathbf u,\mathbf w)}{p_{L-1}(\mathbf u)}$$
로 정확히 계산되며, 이를 위해서는 $p_{L-1}$을 셀 때 각 서열의 **마지막 토큰으로 끝나는** $(L-1)$-묶음을 빼야 한다. 빼지 않으면 일반적으로 $\sum_{\mathbf w}p(\mathbf w\mid\mathbf u)\ne1$이다.`,
    body: R`
**세기.** $c_L(\mathbf u,\mathbf w)$를 $L$-묶음 $(\mathbf u,\mathbf w)$가 나온 횟수, $c_{L-1}(\mathbf u)$를 $\mathbf u$가 나온 횟수, $e(\mathbf u)$를 $\mathbf u$가 서열의 끝에 와서 뒤에 토큰이 없는 횟수라 합시다. 조건부 상대 빈도의 정의는 “$\mathbf u$ 뒤에 토큰이 온 경우 중 그것이 $\mathbf w$인 비율”이므로
$$p(\mathbf w\mid\mathbf u)=\frac{c_L(\mathbf u,\mathbf w)}{\sum_{\mathbf w'}c_L(\mathbf u,\mathbf w')},\qquad \sum_{\mathbf w'}c_L(\mathbf u,\mathbf w')=c_{L-1}(\mathbf u)-e(\mathbf u).$$
둘째 식은 $\mathbf u$가 나온 자리 중 뒤에 토큰이 있는 자리만 $L$-묶음이 되기 때문입니다.

**정규화 상수.** 길이 $T_s$인 서열 $s$에는 $L$-묶음이 $T_s-L+1$개, $(L-1)$-묶음이 $T_s-L+2$개 있고, 마지막 $(L-1)$-묶음 하나를 빼면 $T_s-L+1$개로 같아집니다. 그 총수를 $Z=\sum_s(T_s-L+1)$이라 하면 $p_L=c_L/Z$, 마지막 것을 뺀 $p_{L-1}=(c_{L-1}-e)/Z$이므로
$$\frac{p_L(\mathbf u,\mathbf w)}{p_{L-1}(\mathbf u)}=\frac{c_L(\mathbf u,\mathbf w)}{c_{L-1}(\mathbf u)-e(\mathbf u)}=p(\mathbf w\mid\mathbf u)$$
이고 $\mathbf w$에 대해 더하면 1입니다.

**빼지 않으면.** 분모가 $c_{L-1}(\mathbf u)/Z'$ ($Z'=Z+$서열 수)이 되어 비의 합이 $\frac{Z'}{Z}\cdot\frac{c_{L-1}(\mathbf u)-e(\mathbf u)}{c_{L-1}(\mathbf u)}$이고, $e(\mathbf u)$와 서열 수의 비율이 맞아떨어지지 않는 한 1이 아닙니다. 예: 서열 “a b a b c”에서 $p(\text{b}\mid\text{a})$는 빼면 $\frac{2/4}{2/4}=1$, 빼지 않으면 $\frac{2/4}{2/5}=1.25>1$.

**편리한 이유.** 조건부 표를 문맥마다 따로 정규화해 저장하는 대신, 묶음의 횟수만 세어 두면 어떤 문맥의 조건부 확률이든 나눗셈 한 번으로 얻고, 같은 $p_{L-1}$ 표를 $(L-1)$-그램 모델에 그대로 쓸 수 있습니다. 새 자료가 오면 횟수만 더하면 됩니다.`,
    note: R`이 식의 $L$은 묶음의 토큰 수입니다. 단원 본문의 “최근 $L$개 단어에 조건”하는 $n$-그램과 비교하면 여기의 $L$이 하나 큽니다. 문맥이 한 번도 안 나왔으면 분모가 0이라 정의되지 않으므로 실제로는 평활화를 함께 씁니다.` },

  { ch: 'ch15', id: 'greedy-joint', title: '탐욕 탐색은 가장 그럴듯한 서열을 찾지 못할 수 있다', keys: ['온도 표본 추출'], src: 'Bishop 연습문제 12.15',
    tags: 'greedy search most probable sequence joint distribution beam search marginal conditional 탐욕 탐색 가장 그럴듯한 서열 결합분포 빔 탐색 주변분포 조건부',
    stmt: R`두 토큰 $y_1,y_2\in\{A,B\}$의 결합분포가 $p(A,A)=0.35$, $p(A,B)=0.25$, $p(B,A)=0$, $p(B,B)=0.4$이면, 주변분포는 $p(y_1=A)=0.6$, $p(y_1=B)=0.4$, 조건부분포는 $p(y_2\mid A)=(0.583,\ 0.417)$, $p(y_2\mid B)=(0,\ 1)$이다. $p(y_1)$을 먼저 최대화하고 그다음 $p(y_2\mid y_1)$을 최대화하면 서열 $(A,A)$, 확률 $0.35$를 얻어, 가장 그럴듯한 서열 $(B,B)$ (확률 $0.4$)와 다르다.`,
    body: R`
**주변분포.** 합의 규칙으로 $p(y_1=A)=p(A,A)+p(A,B)=0.6$, $p(y_1=B)=p(B,A)+p(B,B)=0.4$.

**조건부분포.** 곱의 규칙 $p(y_2\mid y_1)=p(y_1,y_2)/p(y_1)$로 $p(A\mid A)=\frac{0.35}{0.6}=0.583$, $p(B\mid A)=\frac{0.25}{0.6}=0.417$, $p(A\mid B)=0$, $p(B\mid B)=1$.

**탐욕.** $\arg\max p(y_1)=A$, 그다음 $\arg\max p(y_2\mid A)=A$. 서열 $(A,A)$의 확률은 $p(A)p(A\mid A)=0.6\times0.583=0.35$입니다.

**최적 서열.** 네 서열의 결합확률 중 가장 큰 것은 $p(B,B)=0.4$입니다. $0.35<0.4$이므로 탐욕 탐색은 최적이 아닙니다. 원인: 첫 단계에서 $A$가 더 그럴듯했던 것은 $A$ 뒤의 확률 $0.6$이 두 갈래($0.35$, $0.25$)로 나뉘어 있었기 때문이고, $B$ 뒤의 $0.4$는 한 서열에 몰려 있었습니다. 빔 너비 2인 빔 탐색은 $y_1=A,B$를 모두 남겨 $(B,B)$를 찾습니다.`,
    note: R`**교재 바로잡기.** 교재에 인쇄된 표는 네 값의 합이 $0.0+0.4+0.1+0.25=0.75$로 확률분포가 아니고, 본문이 말하는 “가장 그럴듯한 서열 $(B,B)$의 확률 0.4”와도 맞지 않습니다. 여기서는 본문의 설명($(B,B)=0.4$가 최대이고 탐욕이 다른 서열을 고름)이 성립하도록 한 칸을 고친 표를 썼습니다. 결론(탐욕 ≠ 최적, 빔 탐색의 필요)은 같습니다.` },

  { ch: 'ch15', id: 'bert-params', title: 'BERT-Large의 모수는 약 3억 4천만', keys: ['멀티헤드 어텐션'], src: 'Bishop 연습문제 12.16',
    tags: 'BERT large parameter count transformer layers embedding 12D^2 340 million 버트 모수 세기 트랜스포머 층 임베딩',
    stmt: R`최대 입력 512토큰, $D=1024$, 어휘 30,000, 트랜스포머 층 24개, 층마다 머리 16개($D_q=D_k=D_v=64$), 위치별 MLP가 은닉 4,096의 2층망인 BERT-Large의 모수는 약 $3.3\times10^8$, 곧 약 3억 4천만이다.`,
    body: R`
**멀티헤드 어텐션.** 머리마다 $\mathbf W_h^{(q)},\mathbf W_h^{(k)},\mathbf W_h^{(v)}$가 $1024\times64$이므로 $3\cdot1024\cdot64\cdot16=3\cdot1024^2$, 출력 투영 $\mathbf W^{(o)}$가 $(16\cdot64)\times1024=1024^2$. 합 $4D^2=4{,}194{,}304$, 편향 $4D=4{,}096$.

**MLP.** $1024\to4096\to1024$이므로 가중치 $2\cdot1024\cdot4096=8{,}388{,}608$, 편향 $4096+1024=5{,}120$.

**층 정규화.** 층마다 두 개, 각각 이득과 편향 $2D$: $4D=4{,}096$.

**층 하나와 24층.** $4{,}194{,}304+4{,}096+8{,}388{,}608+5{,}120+4{,}096=12{,}596{,}224$, 24층이면 $302{,}309{,}376$.

**임베딩.** 토큰 임베딩 $30{,}000\times1024=30{,}720{,}000$, 학습된 위치 임베딩 $512\times1024=524{,}288$.

**합.** $302{,}309{,}376+30{,}720{,}000+524{,}288=333{,}553{,}664\approx3.3\times10^8$. 원 논문이 “340M”으로 적은 크기와 일치합니다.`,
    note: R`실제 BERT에는 문장 구분 임베딩($2\times1024$), 임베딩 층 정규화($2D$), 분류용 풀러 층($D^2+D\approx105$만)이 더 있어 약 3억 3,500만입니다. 모수의 약 90%가 층마다의 $12D^2$ (어텐션 $4D^2$ + MLP $8D^2$)에서 나오므로, 크기를 어림할 때는 $12LD^2$+(어휘 × $D$)로 충분합니다.` },

  );
})();
