/* 증명 — 22단원: 10주차 수요일 필기(소프트맥스 어텐션을 유사도로 쓰기, 선형 어텐션과 비용), 11주차 월요일 필기(행렬 곱과 셀프 어텐션의 비용, 윈도우 어텐션).
   필기에서 유도한 것은 src를 달았고, 계수, 정규화의 묶음, ViT의 모양, GELU의 성질은 슬라이드에 결과만 있어 ‘판서에 없는 증명’(src 없음)입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 22
  { ch: 'ch22', id: 'simrewrite', title: '소프트맥스 어텐션은 유사도로 가중한 볼록 결합이다', keys: ['유사도로 쓴 소프트맥스 어텐션'], src: '강의 필기 · W10 수',
    tags: 'softmax attention similarity weighted average convex combination rewrite kernel 소프트맥스 어텐션 유사도 가중 평균 볼록 결합',
    stmt: R`$\hat{\mathbf v}_i=\sum_{j=1}^N\mathrm{softmax}_j(\mathbf q_i^T\mathbf k_j/\sqrt D)\,\mathbf v_j$이고 $\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$이면 $\hat{\mathbf v}_i=\dfrac{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j}{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)}$이다. 또 양의 함수 $\mathrm{sim}$이면 무엇이든 이 식의 $\hat{\mathbf v}_i$는 $\mathbf v_j$들의 볼록 결합이고 $\lVert\hat{\mathbf v}_i\rVert\le\max_j\lVert\mathbf v_j\rVert$이다.`,
    body: R`
**소프트맥스를 쓰기.** 점수를 $s_{ij}=\mathbf q_i^T\mathbf k_j/\sqrt D$로 두면 소프트맥스의 정의로
$$\alpha_{ij}=\frac{e^{s_{ij}}}{\sum_{l=1}^Ne^{s_{il}}}=\frac{\mathrm{sim}(\mathbf q_i,\mathbf k_j)}{\sum_{l=1}^N\mathrm{sim}(\mathbf q_i,\mathbf k_l)}$$
입니다. $e^{s_{ij}}=\exp(\mathbf q_i^T\mathbf k_j/\sqrt D)=\mathrm{sim}(\mathbf q_i,\mathbf k_j)$이기 때문입니다.

**분모 꺼내기.** 분모 $Z_i=\sum_l\mathrm{sim}(\mathbf q_i,\mathbf k_l)$은 질의 $i$에만 의존하고 합의 첨자 $j$와 무관합니다. 따라서
$$\hat{\mathbf v}_i=\sum_j\alpha_{ij}\mathbf v_j=\frac1{Z_i}\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j=\frac{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j}{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)}.$$

**볼록 결합.** 이제 $\mathrm{sim}$이 임의의 양의 함수라고 하고 $w_j=\mathrm{sim}(\mathbf q_i,\mathbf k_j)/Z_i$로 두면 $w_j>0$, $\sum_jw_j=Z_i/Z_i=1$이므로 $\hat{\mathbf v}_i=\sum_jw_j\mathbf v_j$는 볼록 결합입니다. 삼각 부등식으로
$$\lVert\hat{\mathbf v}_i\rVert\le\sum_jw_j\lVert\mathbf v_j\rVert\le\Big(\max_j\lVert\mathbf v_j\rVert\Big)\sum_jw_j=\max_j\lVert\mathbf v_j\rVert.$$`,
    note: R`이 식에서 소프트맥스 어텐션의 특별한 점은 $\mathrm{sim}$이 지수 함수라는 것 하나뿐입니다. 출력이 값들의 볼록 껍질 안에 머문다는 성질은 양의 유사도라면 무엇이든 유지되므로, 다음 증명에서 $\mathrm{sim}$을 커널로 바꿔도 이 성질은 그대로입니다.` },
  { ch: 'ch22', id: 'linattn', title: '선형 어텐션의 재배열과 비용 O(N)', keys: ['선형 어텐션'], src: '강의 필기 · W10 수',
    tags: 'linear attention kernel feature map ELU associativity cost O(N) S Z Katharopoulos 선형 어텐션 커널 특성 사상 결합법칙 비용',
    stmt: R`$\phi:\mathbb R^D\to\mathbb R^r$의 성분이 양수이고 $\mathrm{sim}(\mathbf q,\mathbf k)=\phi(\mathbf q)^T\phi(\mathbf k)$이면, $S=\sum_j\phi(\mathbf k_j)\mathbf v_j^T\in\mathbb R^{r\times d_v}$, $Z=\sum_j\phi(\mathbf k_j)\in\mathbb R^r$에 대해 $\tilde{\mathbf v}_i=\dfrac{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j}{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)}=\dfrac{S^T\phi(\mathbf q_i)}{\phi(\mathbf q_i)^TZ}$이고, 모든 $i$의 출력을 $O(Nrd_v)$ 시간, $N\times N$ 행렬 없이 구할 수 있다. $\phi(x)=\mathrm{ELU}(x)+1$은 성분이 양수인 사상이다.`,
    body: R`
**준비.** $\phi(x)=\mathrm{ELU}(x)+1$을 성분마다 적용하면 $x\ge0$에서 $x+1\ge1$, $x<0$에서 $e^x>0$이므로 모든 성분이 양수입니다. 그러면 $\mathrm{sim}(\mathbf q,\mathbf k)=\phi(\mathbf q)^T\phi(\mathbf k)=\sum_l\phi(\mathbf q)_l\phi(\mathbf k)_l>0$이라 가중치가 양수입니다.

**분자.** 출력을 행벡터로 쓰면, $\phi(\mathbf q_i)^T\phi(\mathbf k_j)$가 스칼라이고 행렬 곱이 결합법칙을 따르므로
$$\sum_j\big(\phi(\mathbf q_i)^T\phi(\mathbf k_j)\big)\mathbf v_j^T=\sum_j\phi(\mathbf q_i)^T\big(\phi(\mathbf k_j)\mathbf v_j^T\big)=\phi(\mathbf q_i)^T\sum_j\phi(\mathbf k_j)\mathbf v_j^T=\phi(\mathbf q_i)^TS.$$
마지막 등호는 $\phi(\mathbf q_i)^T$가 $j$와 무관해 합 밖으로 나오기 때문입니다.

**분모.** 같은 방식으로 $\sum_j\phi(\mathbf q_i)^T\phi(\mathbf k_j)=\phi(\mathbf q_i)^T\sum_j\phi(\mathbf k_j)=\phi(\mathbf q_i)^TZ$입니다. 둘을 나누고 전치하면 $\tilde{\mathbf v}_i=S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$.

**비용.** $S$는 $r\times d_v$ 외적 $\phi(\mathbf k_j)\mathbf v_j^T$ ($rd_v$번의 곱셈) $N$개의 합이라 $Nrd_v$번, $Z$는 $Nr$번의 덧셈입니다. 질의마다 $S^T\phi(\mathbf q_i)$는 $rd_v$번, $\phi(\mathbf q_i)^TZ$는 $r$번이므로 $N$개의 질의에 $N(rd_v+r)$번입니다. 합은 $O(Nrd_v)$이고, 저장하는 중간 결과는 $S$와 $Z$($rd_v+r$개)뿐입니다. 소프트맥스 어텐션은 $\exp$가 성분마다 작용해 $\exp(QK^T)$를 이렇게 나눌 수 없으므로 $QK^T$를 먼저 만들어야 하고, 그 비용이 $N^2D$, $N^2d_v$입니다.`,
    note: R`핵심은 행렬 곱의 결합법칙 $(\phi(Q)\phi(K)^T)V=\phi(Q)(\phi(K)^TV)$입니다. 왼쪽 순서는 $N\times N$을 거치고 오른쪽 순서는 $r\times d_v$를 거칩니다. 소프트맥스는 $\exp$가 이 분해를 막기 때문에 왼쪽 순서밖에 쓸 수 없습니다.` },
  { ch: 'ch22', id: 'lowrank', title: '선형 어텐션 행렬의 계수는 r 이하다', keys: ['선형 어텐션'],
    tags: 'linear attention low rank matrix rank feature dimension softmax full rank 선형 어텐션 낮은 계수 계수 특성 차원',
    stmt: R`선형 어텐션의 어텐션 행렬 $\tilde A_{ij}=\phi(\mathbf q_i)^T\phi(\mathbf k_j)/\phi(\mathbf q_i)^TZ$는 $\tilde A=D^{-1}\phi(Q)\phi(K)^T$ ($D=\diag(\phi(Q)Z)$)로 쓸 수 있고 $\mathrm{rank}\,\tilde A\le r$이다. 반면 소프트맥스 어텐션의 행렬은 계수가 $N$일 수 있다.`,
    body: R`
**행렬로 쓰기.** $\phi(Q)\in\mathbb R^{N\times r}$를 $i$번째 행이 $\phi(\mathbf q_i)^T$인 행렬, $\phi(K)$도 같게 두면 $(\phi(Q)\phi(K)^T)_{ij}=\phi(\mathbf q_i)^T\phi(\mathbf k_j)$입니다. 행 $i$의 합은 $\phi(\mathbf q_i)^TZ>0$이므로 $D=\diag(\phi(\mathbf q_1)^TZ,\dots,\phi(\mathbf q_N)^TZ)$는 가역이고 $\tilde A=D^{-1}\phi(Q)\phi(K)^T$입니다.

**계수의 상한.** 곱의 계수는 각 인수의 계수를 넘지 않습니다. $\phi(K)^T$는 $r$행이므로 $\mathrm{rank}\,\phi(K)^T\le r$이고, 따라서 $\mathrm{rank}(\phi(Q)\phi(K)^T)\le r$. 가역 행렬 $D^{-1}$을 곱해도 계수는 그대로이므로 $\mathrm{rank}\,\tilde A\le r$입니다.

**소프트맥스와의 비교.** 소프트맥스의 $A=D_s^{-1}\exp(QK^T/\sqrt D)$에서 $\exp$는 성분마다 작용하므로 $QK^T$의 계수가 $D$ 이하여도 $\exp(QK^T/\sqrt D)$의 계수는 제한되지 않습니다. 예를 들어 $D=1$, $q_i=k_i=t\,i$ ($i=1,\dots,N$)이면 $\exp(q_ik_j)=e^{t^2ij}=x_i^{\,j}$ ($x_i=e^{t^2i}$, 서로 다름)가 방데르몽드 행렬이라 계수가 $N$입니다. 계수 $1$인 $QK^T$가 계수 $N$인 어텐션 행렬을 만든 것입니다.`,
    note: R`필기의 $\hat V=AV\approx(\mathbf a\mathbf b^T)V$가 이 계수 제한을 뜻합니다. $r<N$이면 선형 어텐션은 소프트맥스 어텐션이 만들 수 있는 모든 패턴(예: 날카로운 대각 행렬)을 흉내 낼 수는 없습니다. 속도와 표현력을 바꾼 것입니다.` },
  { ch: 'ch22', id: 'normgroup', title: '세 정규화의 묶음: 평균 0·분산 1과 배치 의존성', keys: ['정규화 통계를 모으는 묶음'],
    tags: 'batch normalization layer normalization group statistics mean variance batch dependence transformer CNN 배치 정규화 층 정규화 묶음 평균 분산 배치 의존',
    stmt: R`정규화가 묶음 $G=\{x_1,\dots,x_n\}$의 $\mu=\frac1n\sum x_k$, $\sigma^2=\frac1n\sum(x_k-\mu)^2>0$으로 $y_k=(x_k-\mu)/\sigma$를 만들면 ($\varepsilon=0$, $\gamma=1$, $\beta=0$) 묶음 안에서 $y$의 평균은 $0$, 분산은 $1$이다. BN의 묶음(채널 하나의 모든 샘플과 위치)은 여러 샘플에 걸쳐 있어 한 샘플의 출력이 다른 샘플에 의존하고, LN의 묶음(샘플 하나 또는 토큰 하나)은 그렇지 않다. 특징이 두 개인 토큰 $(u,v)$, $u\ne v$의 트랜스포머 LN은 $\pm(1,-1)$이다.`,
    body: R`
**평균과 분산.** $\frac1n\sum_ky_k=\frac1\sigma\big(\frac1n\sum_kx_k-\mu\big)=0$이고, $\frac1n\sum_ky_k^2=\frac1{\sigma^2}\cdot\frac1n\sum_k(x_k-\mu)^2=\frac{\sigma^2}{\sigma^2}=1$입니다. 묶음을 어떻게 고르든 성립하므로 BN, CNN의 LN, 트랜스포머의 LN 모두 자기 묶음 안에서 평균 $0$, 분산 $1$입니다.

**배치 의존성.** BN에서 샘플 $b$, 채널 $c$의 값 $x_{b,c,h,w}$는 묶음 $\{x_{b',c,h',w'}\}$의 $\mu_c$, $\sigma_c$로 정규화되고, 이 묶음에는 다른 샘플 $b'\ne b$의 값이 들어 있습니다. 그러므로 $x_{b',c,h',w'}$ 하나를 바꾸면 $\mu_c$가 바뀌어 샘플 $b$의 출력도 바뀝니다(분산이 $0$이 아닌 한). LN의 묶음은 $\{x_{b,c',h',w'}\}$ (CNN) 또는 $\{x_{b,c',h,w}\}_{c'}$ (토큰 하나)로 첨자 $b$가 고정되어 있어 다른 샘플이 들어가지 않습니다.

**두 특징의 토큰.** $(u,v)$의 $\mu=\frac{u+v}2$이고 편차는 $\frac{u-v}2$, $\frac{v-u}2$, $\sigma^2=\frac{(u-v)^2}4$, $\sigma=\frac{\lvert u-v\rvert}2$입니다. 따라서 결과는 $\big(\frac{u-v}{\lvert u-v\rvert},\frac{v-u}{\lvert u-v\rvert}\big)$, 곧 $u<v$이면 $(-1,1)$, $u>v$이면 $(1,-1)$입니다. 필기의 토큰 $(1,5)$가 $(-1,1)$이 된 것이 이 경우입니다.`,
    note: R`특징이 두 개뿐이면 LN은 두 값의 대소만 남기고 크기 정보를 모두 지웁니다. 실제 트랜스포머는 특징이 수백 개라 이런 일은 없지만, 정규화가 ‘묶음 안의 상대적인 위치’만 남긴다는 점은 같습니다. 그래서 학습되는 $\gamma$, $\beta$로 크기를 되살릴 여지를 둡니다.` },
  { ch: 'ch22', id: 'vitshape', title: 'ViT의 토큰 수, 매개변수, 층마다의 모양', keys: ['비전 트랜스포머의 식'],
    tags: 'vision transformer ViT patch embedding class token position embedding shape parameters permutation 비전 트랜스포머 패치 임베딩 클래스 토큰 위치 임베딩 모양 매개변수',
    stmt: R`$H\times W\times C$ 이미지, 패치 크기 $P$ ($P\mid H$, $P\mid W$), 차원 $D$인 ViT에서 토큰은 $N+1$개($N=HW/P^2$)이고 $\mathbf z_0\in\mathbb R^{(N+1)\times D}$, $E$는 $P^2CD$개, $E_{pos}$는 $(N+1)D$개의 매개변수를 가진다. 식 (2)–(3)은 모양을 유지해 모든 $\mathbf z_\ell\in\mathbb R^{(N+1)\times D}$이다. 위치 임베딩이 없으면 패치를 섞어도 $\mathbf y=\mathrm{LN}(\mathbf z_L^0)$가 변하지 않는다.`,
    body: R`
**토큰과 식 (1).** 높이 방향으로 $H/P$개, 너비 방향으로 $W/P$개의 패치가 있어 $N=HW/P^2$입니다. 패치 하나는 $P\times P\times C$이므로 펼치면 $\mathbf x_p^i\in\mathbb R^{1\times P^2C}$이고, $E\in\mathbb R^{(P^2C)\times D}$를 곱하면 $1\times D$입니다. 맨 앞의 $\mathbf x_{class}\in\mathbb R^{1\times D}$와 함께 세로로 쌓으면 $(N+1)\times D$이고, 같은 모양의 $E_{pos}$를 더해 $\mathbf z_0\in\mathbb R^{(N+1)\times D}$입니다. 매개변수는 $E$가 $P^2CD$개, $E_{pos}$가 $(N+1)D$개, 클래스 토큰이 $D$개입니다.

**식 (2)–(3)이 모양을 지킨다.** $\mathbf z_{\ell-1}\in\mathbb R^{(N+1)\times D}$라 하자. LN은 행(토큰)마다 정규화하므로 모양을 유지하고, MSA는 토큰마다 $D$차원을 내므로 $\mathrm{MSA}(\mathrm{LN}(\mathbf z_{\ell-1}))\in\mathbb R^{(N+1)\times D}$입니다. 모양이 같아 잔차의 덧셈이 정의되고 $\mathbf z'_\ell\in\mathbb R^{(N+1)\times D}$. MLP도 토큰마다 $D\to D$이므로 같은 논리로 $\mathbf z_\ell\in\mathbb R^{(N+1)\times D}$입니다. $\mathbf z_0$에서 시작하는 귀납으로 모든 층이 같은 모양입니다.

**위치 임베딩이 없으면.** 클래스 토큰을 고정하고 패치들만 섞는 순열행렬을 $\Pi$라 하자($\Pi$의 첫 행과 첫 열은 $\mathbf e_1$). LN과 MLP는 행마다 같은 함수를 적용하므로 $\Pi$와 교환하고, 셀프 어텐션은 순열 등변이므로 $\mathrm{MSA}(\Pi\mathbf z)=\Pi\,\mathrm{MSA}(\mathbf z)$입니다[[ch21:21.5|셀프 어텐션의 순열 등변성.]]. 잔차의 덧셈도 교환하므로 입력 $\Pi\mathbf z_0$에서 $\mathbf z_L$은 $\Pi\mathbf z_L$이 되고, 그 첫 행 $\mathbf z_L^0$은 $\Pi$가 첫 행을 고정하므로 변하지 않습니다.`,
    note: R`$E_{pos}$를 더하면 패치를 섞어도 위치 임베딩은 섞이지 않으므로 새 입력이 $\Pi\mathbf z_0$ 꼴이 아니게 되어 이 논증이 깨지고, 모델은 패치의 배치를 구별할 수 있습니다. 매개변수 수에서 $E$는 이미지 크기와 무관하지만 $E_{pos}$는 $N$에 비례하므로, 해상도를 바꾸어 미세 조정할 때 $E_{pos}$만 보간하면 됩니다.` },
  { ch: 'ch22', id: 'gelu', title: 'GELU의 도함수, 대칭 관계, 극한, 음의 골', keys: ['GELU'],
    tags: 'GELU Gaussian error linear unit derivative Phi normal CDF tail bound minimum activation 가우시안 오차 선형 단위 도함수 정규 누적분포 활성화',
    stmt: R`$\mathrm{GELU}(x)=x\Phi(x)$에 대해 (1) $\mathrm{GELU}'(x)=\Phi(x)+x\varphi(x)$, $\mathrm{GELU}'(0)=\frac12$, (2) $\mathrm{GELU}(x)-\mathrm{GELU}(-x)=x$, (3) $x\to\infty$에서 $\mathrm{GELU}(x)-x\to0$, $x\to-\infty$에서 $\mathrm{GELU}(x)\to0$, (4) $(-1,-\frac12)$에 극솟값이 있다.`,
    body: R`
**(1) 도함수.** $\Phi'(x)=\varphi(x)=\frac1{\sqrt{2\pi}}e^{-x^2/2}$이므로 곱의 미분으로 $\mathrm{GELU}'(x)=\Phi(x)+x\varphi(x)$. $x=0$에서 $\Phi(0)=\frac12$입니다.

**(2) 대칭 관계.** 표준 정규분포는 $0$에 대해 대칭이라 $\Phi(-x)=P(X\le-x)=P(X\ge x)=1-\Phi(x)$입니다. 따라서 $\mathrm{GELU}(-x)=-x\Phi(-x)=-x+x\Phi(x)=-x+\mathrm{GELU}(x)$.

**(3) 극한.** $x>0$에서 꼬리 부등식 $1-\Phi(x)=\int_x^\infty\varphi(t)\,dt\le\int_x^\infty\frac tx\varphi(t)\,dt=\frac{\varphi(x)}x$ ($t\ge x$에서 $t/x\ge1$, $t\varphi(t)$의 원시함수가 $-\varphi(t)$)를 씁니다. 그러면 $\lvert\mathrm{GELU}(x)-x\rvert=x(1-\Phi(x))\le\varphi(x)\to0$. $x\to-\infty$에서는 $\lvert x\Phi(x)\rvert=\lvert x\rvert\big(1-\Phi(\lvert x\rvert)\big)\le\varphi(x)\to0$.

**(4) 음의 골.** $\Phi(-1)\approx0.1587$, $\varphi(1)\approx0.2420$으로 $\mathrm{GELU}'(-1)=\Phi(-1)-\varphi(-1)\approx-0.0833<0$이고, $\Phi(-\frac12)\approx0.3085$, $\varphi(\frac12)\approx0.3521$로 $\mathrm{GELU}'(-\frac12)\approx0.3085-0.1760=0.1325>0$입니다. $\mathrm{GELU}'$는 연속이므로 중간값 정리로 사이에 $0$이 되는 점이 있고, 부호가 $-$에서 $+$로 바뀌므로 그 점은 극솟값입니다. 수치로 풀면 $x\approx-0.752$, $\mathrm{GELU}\approx-0.170$입니다.`,
    note: R`(2)는 GELU가 ‘ReLU에 매끄러운 보정을 한 것’임을 보여 줍니다. ReLU도 $\mathrm{ReLU}(x)-\mathrm{ReLU}(-x)=x$를 만족하고, GELU는 이 관계를 지키면서 꺾인 점을 없앴습니다. 대가로 음수 쪽에서 단조성을 잃어 작은 골이 생깁니다.` },
  { ch: 'ch22', id: 'matcost', title: '행렬 곱의 비용과 셀프 어텐션 한 층의 비용', keys: ['셀프 어텐션의 비용'], src: '강의 필기 · W11 월',
    tags: 'matrix multiplication cost O(mnk) self-attention complexity 4NC^2 2N^2C projections multi-head 행렬 곱 비용 셀프 어텐션 계산량 투영 멀티헤드',
    stmt: R`$A\in\mathbb R^{m\times k}$, $B\in\mathbb R^{k\times n}$의 곱은 곱셈 $mnk$번, 덧셈 $mn(k-1)$번이다. 토큰 $N$개, 차원 $C$인 셀프 어텐션 한 층($Q$, $K$, $V$, 출력 투영이 모두 $C\times C$)의 곱셈 수는 $4NC^2+2N^2C$이고, 헤드를 $h$개로 나눠도 같다.`,
    body: R`
**행렬 곱.** $Y=AB$의 성분 $Y_{ij}=\sum_{l=1}^kA_{il}B_{lj}$는 곱 $A_{il}B_{lj}$ $k$개를 더한 것이라 곱셈 $k$번, 덧셈 $k-1$번입니다. $(i,j)$는 $m\cdot n$개이므로 곱셈 $mnk$번, 덧셈 $mn(k-1)$번, 곧 $O(mnk)$입니다.

**투영.** $X\in\mathbb R^{N\times C}$, $W_Q\in\mathbb R^{C\times C}$이면 $Q=XW_Q$는 $m=N$, $k=C$, $n=C$라 $NC^2$번입니다. $K$, $V$도 같아 $3NC^2$, 헤드를 이어 붙인 출력에 곱하는 $W_O$도 $NC^2$라 투영은 모두 $4NC^2$입니다.

**어텐션.** $QK^T$는 $(N\times C)(C\times N)$이라 $m=N$, $k=C$, $n=N$으로 $N^2C$번입니다. $A=\mathrm{softmax}(QK^T/\sqrt C)$는 성분마다의 연산이라 $O(N^2)$이고, $AV$는 $(N\times N)(N\times C)$라 $m=N$, $k=N$, $n=C$로 $N^2C$번입니다. 모두 더하면 $4NC^2+2N^2C$에 $O(N^2)$이 붙는데, $C\ge1$이면 $O(N^2)\le O(N^2C)$라 차수에 영향이 없습니다.

**헤드로 나누기.** $h$개의 헤드가 각각 $C/h$차원을 쓰면 헤드마다 $Q_hK_h^T$가 $(N\times\frac Ch)(\frac Ch\times N)$로 $N^2C/h$, $A_hV_h$가 $(N\times N)(N\times\frac Ch)$로 $N^2C/h$입니다. $h$개를 더하면 $2N^2C$로 그대로이고, 투영은 $C\times C$ 행렬의 열을 헤드별로 나눈 것이라 $4NC^2$ 그대로입니다.`,
    note: R`두 항의 비는 $\frac{2N^2C}{4NC^2}=\frac N{2C}$이므로 토큰 수가 특징 차원의 두 배를 넘으면 어텐션이 비용을 지배합니다. 문장(수백 토큰, $C$는 수백)에서는 두 항이 비슷하지만, $56\times56$ 이미지 격자($N=3136$, $C=96$)에서는 어텐션 항이 약 $16$배 큽니다. 다음 증명의 윈도우 어텐션이 이 항을 줄입니다.` },
  { ch: 'ch22', id: 'wmsa', title: '윈도우 어텐션의 비용 4NC²+2NM²C', keys: ['윈도우 어텐션의 비용'], src: '강의 필기 · W11 월',
    tags: 'Swin transformer window attention W-MSA cost linear complexity windows M 2NM^2C 스윈 트랜스포머 윈도우 어텐션 창 비용 선형',
    stmt: R`토큰 $N=hw$개, 차원 $C$인 특성 지도를 $M\times M$ 창으로 나눠($M\mid h$, $M\mid w$) 창 안에서만 셀프 어텐션하면 곱셈 수는 $4NC^2+2NM^2C$이다. $M$, $C$를 고정하면 $O(N)$이고, 전역 어텐션과 어텐션 항의 비는 $N/M^2$이다.`,
    body: R`
**창의 수.** 높이 방향으로 $h/M$개, 너비 방향으로 $w/M$개의 창이 있어 모두 $\frac hM\cdot\frac wM=\frac N{M^2}$개이고, 창마다 토큰이 $M^2$개입니다.

**창 하나의 어텐션.** 창 안의 토큰 행렬은 $M^2\times C$이므로 $Q_wK_w^T$는 $(M^2\times C)(C\times M^2)$로 $(M^2)^2C=M^4C$번, $A_wV_w$는 $(M^2\times M^2)(M^2\times C)$로 $M^4C$번입니다. 창 하나에 $2M^4C$번입니다.

**모두 더하기.** 창이 $N/M^2$개이므로 어텐션은 $\frac N{M^2}\cdot2M^4C=2NM^2C$번입니다. 투영 $W_Q,W_K,W_V,W_O$는 토큰마다 같은 행렬을 곱하므로 창으로 나눠도 $4NC^2$ 그대로입니다. 합은 $4NC^2+2NM^2C=N(4C^2+2M^2C)$이고, 괄호가 $N$과 무관하므로 $M$, $C$를 고정하면 $O(N)$입니다.

**비율.** 전역 어텐션의 어텐션 항은 $2N^2C$이므로 $\frac{2N^2C}{2NM^2C}=\frac N{M^2}$입니다. 필기의 $h=w=56$, $M=7$에서는 $N=3136$, 창 $64$개로 이 비가 $64$이고, $C=96$이면 전역 $2{,}003{,}828{,}736$번이 윈도우 $145{,}108{,}992$번으로 줄어 약 $13.8$배 작아집니다.`,
    note: R`대가는 창 사이에 정보가 오가지 않는다는 것입니다. Swin은 층을 번갈아 창을 $\lfloor M/2\rfloor$만큼 옮겨(shifted window) 이웃 창을 섞고, 그래도 각 층의 비용은 같은 $4NC^2+2NM^2C$입니다(슬라이드 28–29, 심화).` },
  );
})();
