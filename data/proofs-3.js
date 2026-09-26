/* 증명 — 06 행렬과 연립일차방정식, 07 고유값 문제 */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 06
  { ch: 'ch06', id: 'transpose', title: '곱의 전치와 곱의 역행렬', keys: ['곱과 전치'],
    tags: 'transpose inverse product 전치 역행렬 곱',
    stmt: R`$(AB)^T=B^TA^T$, $(AB)^{-1}=B^{-1}A^{-1}$.`,
    body: R`
성분으로 비교합니다.
$$\big((AB)^T\big)_{jk}=(AB)_{kj}=\sum_la_{kl}b_{lj}=\sum_l(B^T)_{jl}(A^T)_{lk}=(B^TA^T)_{jk}$$
역행렬은 곱해서 확인합니다.
$$(AB)(B^{-1}A^{-1})=A(BB^{-1})A^{-1}=AA^{-1}=I$$
반대 순서의 곱도 같은 방법으로 $I$이므로 $(AB)^{-1}=B^{-1}A^{-1}$. 양말을 신고 신발을 신었으면 신발부터 벗는 것과 같습니다.` },
  { ch: 'ch06', id: 'rowops', title: '기본 행 연산은 해를 바꾸지 않는다', keys: [],
    tags: 'gauss elimination elementary row operation 가우스 소거법 기본 행 연산 기본행렬',
    stmt: R`첨가행렬 $[A\ \ \mathbf b]$에 기본 행 연산을 적용해 얻은 연립방정식은 원래 연립방정식과 해가 같다.`,
    body: R`
각 기본 행 연산은 가역인 기본행렬 $E$를 왼쪽에 곱하는 것과 같습니다.
- 두 행 교환: 같은 교환을 한 번 더 하면 되돌아옵니다.
- 한 행에 $c\ne0$ 곱하기: $1/c$를 곱하면 되돌아옵니다.
- 한 행에 다른 행의 $k$배 더하기: $-k$배를 더하면 되돌아옵니다.

$E$가 가역이므로 $A\mathbf x=\mathbf b\iff EA\mathbf x=E\mathbf b$입니다. 여러 번 적용해도 마찬가지이므로 사다리꼴의 해가 원래 해입니다.` },
  { ch: 'ch06', id: 'ranknullity', title: '계수–퇴화차수 정리', keys: ['계수와 영공간'],
    tags: 'rank nullity theorem null space dimension 계수 퇴화차수 영공간 차원',
    stmt: R`행 연산은 계수를 바꾸지 않으며, $m\times n$ 행렬에서 $\operatorname{rank}A+\operatorname{nullity}A=n$이다.`,
    body: R`
**계수 보존.** $EA$의 행들은 $A$의 행들의 일차결합이고, $E$가 가역이라 그 반대도 성립합니다. 따라서 행공간이 같고 계수가 같습니다.

**차원 세기.** 사다리꼴에서 0이 아닌 행이 $r$개이면 피벗 변수가 $r$개, 자유변수가 $n-r$개입니다. 자유변수 하나만 1, 나머지 자유변수는 0으로 두고 피벗 변수를 역대입으로 정하면 $A\mathbf x=\mathbf 0$의 해가 하나씩, 모두 $n-r$개 생깁니다.
- 각 벡터는 자기 자유변수 자리에서만 1이므로 서로 독립입니다.
- 임의의 해는 자유변수 값만으로 정해지므로 이 벡터들의 일차결합입니다.

따라서 영공간의 차원은 $n-r$이고 $r+(n-r)=n$. 같은 논리로 피벗 열들이 열공간의 기저가 되어 행계수와 열계수가 같다는 것도 나옵니다.` },
  { ch: 'ch06', id: 'existence', title: '연립방정식 해의 존재와 유일성', keys: [R`해의 개수 판정 ($n$은 미지수의 개수, $\tilde A$는 첨가행렬)`],
    tags: 'fundamental theorem linear system consistent unique rank augmented 해의 존재 유일성 첨가행렬',
    stmt: R`$A\mathbf x=\mathbf b$는 $\operatorname{rank}A=\operatorname{rank}\tilde A$일 때만 해를 가지고, 그 값이 $n$이면 해가 유일하며, $r<n$이면 $n-r$개의 자유 매개변수를 가진다.`,
    body: R`
$\tilde A$를 사다리꼴로 만듭니다.

- $\operatorname{rank}\tilde A>\operatorname{rank}A$이면 어떤 행이 $[0\ \cdots\ 0\ |\ c]$, $c\ne0$ 꼴입니다. 즉 $0=c$라는 모순 식이므로 해가 없습니다.
- 계수가 같으면 모순 행이 없고, 역대입으로 피벗 변수를 자유변수로 나타낼 수 있어 해가 존재합니다. 자유변수 $n-r$개는 마음대로 고를 수 있으므로 $r=n$일 때만 해가 유일합니다.

다르게 보면, $A\mathbf x=\mathbf b$는 $\mathbf b$가 $A$의 열들의 일차결합이라는 뜻입니다. $\mathbf b$를 열로 덧붙여도 계수가 늘지 않는다는 것이 바로 그 조건입니다.` },
  { ch: 'ch06', id: 'detprops', title: '행렬식의 성질', keys: ['행렬식의 성질'],
    tags: 'determinant properties product transpose 행렬식 성질 곱 전치',
    sketch: R`행 교환·스칼라배·행 더하기에 대한 규칙(다중선형성과 교대성)에서 출발합니다.`,
    stmt: R`$\det(AB)=\det A\det B$, $\det A^T=\det A$, $\det(cA)=c^n\det A$, $\det A^{-1}=1/\det A$.`,
    body: R`
행렬식은 각 행에 대해 선형이고(다중선형), 두 행을 바꾸면 부호가 바뀝니다(교대성). 여기서 다음이 나옵니다.
- 두 행이 같으면 바꿔도 같은 행렬인데 부호가 바뀌므로 $\det=0$.
- 한 행에 다른 행의 배수를 더해도 선형성과 위 사실로 값이 그대로.

**$\det(cA)$.** $n$개의 행에 각각 $c$가 곱해지므로 $c^n\det A$.

**$\det A^T$.** 라이프니츠 공식 $\det A=\sum_\sigma\operatorname{sgn}\sigma\prod_ia_{i\sigma(i)}$에서 순열 $\sigma$와 $\sigma^{-1}$은 부호가 같으므로 행과 열의 역할을 바꿔도 합이 같습니다.

**$\det(AB)$.** $A$가 특이이면 $AB$도 특이라 양변이 0. 가역이면 $A=E_1E_2\cdots E_k$ (기본행렬의 곱)이고, 각 기본행렬에 대해 $\det(EB)=\det E\det B$가 위 규칙에서 바로 나옵니다. 차례로 적용하면 $\det(AB)=\det A\det B$.

**역행렬.** $\det A\det A^{-1}=\det I=1$.` },
  { ch: 'ch06', id: 'cramer', title: '수반행렬 공식과 크래머 공식', keys: ['행렬식의 성질', '2×2 역행렬과 수반행렬'],
    tags: 'adjugate cofactor cramer rule inverse 수반행렬 여인수 크래머 역행렬',
    stmt: R`$A\,\operatorname{adj}A=(\det A)I$. 따라서 $\det A\ne0$이면 $A^{-1}=\frac1{\det A}\operatorname{adj}A$이고, $A\mathbf x=\mathbf b$의 해는 $x_k=D_k/D$이다.`,
    body: R`
$(\operatorname{adj}A)_{lk}=C_{kl}$ (여인수의 전치)이므로
$$\big(A\,\operatorname{adj}A\big)_{jk}=\sum_la_{jl}C_{kl}$$
- $j=k$: $j$행에 대한 여인수 전개이므로 $\det A$.
- $j\ne k$: $k$행을 $j$행으로 바꾼 행렬의 $k$행 전개입니다. 그 행렬은 같은 행이 두 개라 행렬식이 0.

따라서 $A\,\operatorname{adj}A=(\det A)I$이고, $\det A$로 나누면 역행렬 공식입니다.

크래머 공식: $\mathbf x=A^{-1}\mathbf b=\frac1D\operatorname{adj}A\,\mathbf b$이므로 $x_k=\frac1D\sum_lC_{lk}b_l$. 이 합은 $A$의 $k$열을 $\mathbf b$로 바꾼 행렬을 $k$열로 전개한 것이므로 $D_k$입니다.

2×2이면 여인수가 $C_{11}=d$, $C_{12}=-c$, $C_{21}=-b$, $C_{22}=a$이므로 $\operatorname{adj}A=\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$.` },
  { ch: 'ch06', id: 'dimension-thm', title: '선형사상의 차원정리', keys: ['선형사상과 차원정리'],
    tags: 'dimension theorem rank nullity kernel image linear map 차원정리 커널 이미지 선형사상',
    stmt: R`유한차원 $V$에서 정의된 선형사상 $L:V\to W$에 대해 $\dim\ker L+\dim\operatorname{im}L=\dim V$.`,
    body: R`
$\ker L$의 기저 $\{u_1,\dots,u_k\}$를 $V$의 기저 $\{u_1,\dots,u_k,w_1,\dots,w_r\}$로 확장합니다($k+r=\dim V$). $\{L(w_1),\dots,L(w_r)\}$이 $\operatorname{im}L$의 기저임을 보이면 됩니다.

**생성.** $v=\sum a_iu_i+\sum b_jw_j$이면 $L(u_i)=0$이므로 $L(v)=\sum b_jL(w_j)$.

**일차독립.** $\sum b_jL(w_j)=0$이면 $L\big(\sum b_jw_j\big)=0$, 즉 $\sum b_jw_j\in\ker L$이므로 $\sum b_jw_j=\sum c_iu_i$. 전체가 $V$의 기저이므로 모든 $b_j=c_i=0$.

따라서 $\dim\operatorname{im}L=r=\dim V-k$. 행렬 $L_A$에 적용하면 $\operatorname{rank}A+\operatorname{nullity}A=n$입니다.` },
  { ch: 'ch06', id: 'cauchy-schwarz', title: '코시–슈바르츠 부등식, 삼각부등식, 평행사변형 등식', keys: ['노름과 기본 부등식'],
    tags: 'cauchy schwarz triangle inequality parallelogram law inner product norm 코시 슈바르츠 삼각부등식 평행사변형 내적 노름',
    stmt: R`내적공간에서 $|\langle u,v\rangle|\le\|u\|\|v\|$, $\|u+v\|\le\|u\|+\|v\|$, $\|u+v\|^2+\|u-v\|^2=2(\|u\|^2+\|v\|^2)$.`,
    body: R`
**코시–슈바르츠.** $v=0$이면 자명합니다. $v\ne0$이면 $w=u-\dfrac{\langle u,v\rangle}{\|v\|^2}v$는 $v$와 직교하므로(정사영의 나머지)
$$0\le\|w\|^2=\langle w,u\rangle=\|u\|^2-\frac{|\langle u,v\rangle|^2}{\|v\|^2}$$
정리하면 $|\langle u,v\rangle|^2\le\|u\|^2\|v\|^2$. 등호는 $w=0$, 즉 $u$와 $v$가 평행할 때입니다.

**삼각부등식.**
$$\|u+v\|^2=\|u\|^2+2\Re\langle u,v\rangle+\|v\|^2\le\|u\|^2+2\|u\|\|v\|+\|v\|^2=(\|u\|+\|v\|)^2$$

**평행사변형 등식.** $\|u\pm v\|^2=\|u\|^2\pm2\Re\langle u,v\rangle+\|v\|^2$을 더하면 교차항이 상쇄됩니다.` },
  { ch: 'ch06', id: 'projection', title: '정사영이 최선 근사인 이유', keys: ['정사영과 최선 근사'],
    tags: 'orthogonal projection best approximation pythagoras least squares 정사영 최선 근사 피타고라스 최소제곱',
    stmt: R`$\{v_1,\dots,v_m\}$이 부분공간 $W$의 정규직교기저이고 $w=\sum\langle v,v_i\rangle v_i$이면 $v-w\perp W$이고, 모든 $u\in W$에 대해 $\|v-w\|\le\|v-u\|$ (등호는 $u=w$일 때만).`,
    body: R`
**직교.** 각 $j$에 대해 $\langle v-w,v_j\rangle=\langle v,v_j\rangle-\sum_i\langle v,v_i\rangle\langle v_i,v_j\rangle=\langle v,v_j\rangle-\langle v,v_j\rangle=0$. $W$의 모든 벡터는 $v_j$의 일차결합이므로 $v-w\perp W$.

**최소성.** $u\in W$이면 $w-u\in W$이므로 $(v-w)\perp(w-u)$. 피타고라스 정리로
$$\|v-u\|^2=\|(v-w)+(w-u)\|^2=\|v-w\|^2+\|w-u\|^2\ge\|v-w\|^2$$
등호는 $\|w-u\|=0$일 때뿐이므로 가장 가까운 벡터는 유일합니다. 함수공간에서는 이것이 "제곱 오차 최소"이고, 삼각함수계에 적용하면 푸리에 부분합이 최선 근사라는 정리가 됩니다.` },
  { ch: 'ch06', id: 'bessel-ineq', title: '베셀 부등식', keys: ['정사영과 최선 근사'],
    tags: 'bessel inequality orthonormal parseval hilbert 베셀 부등식 정규직교 파세발 힐베르트',
    stmt: R`정규직교집합 $\{v_1,\dots,v_m\}$과 $v$에 대해 $\sum_{i=1}^m|\langle v,v_i\rangle|^2\le\|v\|^2$.`,
    body: R`
$w=\sum\langle v,v_i\rangle v_i$라 하면 정규직교성에서 $\|w\|^2=\sum|\langle v,v_i\rangle|^2$이고, 앞 정리에서 $v-w\perp w$이므로
$$\|v\|^2=\|v-w\|^2+\|w\|^2\ge\|w\|^2=\sum_{i=1}^m|\langle v,v_i\rangle|^2$$
$m$에 관계없이 성립하므로 무한 정규직교집합에서도 $\sum_{i=1}^\infty|\langle v,v_i\rangle|^2\le\|v\|^2$이고, 특히 $\langle v,v_i\rangle\to0$입니다. 기저가 완비이면 $\|v-w\|\to0$이 되어 등호(파세발 항등식)가 성립합니다.` },
  // ───── 07
  { ch: 'ch07', id: 'traceprod', title: '고유값의 합은 대각합, 곱은 행렬식', keys: ['고유값의 기본 성질'],
    tags: 'eigenvalue trace determinant characteristic polynomial 고유값 대각합 행렬식 특성다항식',
    stmt: R`$n\times n$ 행렬의 고유값(중복 포함, 복소수 포함) $\lambda_1,\dots,\lambda_n$에 대해 $\sum\lambda_j=\tr A$, $\prod\lambda_j=\det A$.`,
    body: R`
특성다항식은 $\det(A-\lambda I)=(-1)^n(\lambda-\lambda_1)\cdots(\lambda-\lambda_n)$로 인수분해됩니다.

**곱.** $\lambda=0$을 넣으면 $\det A=(-1)^n(-1)^n\lambda_1\cdots\lambda_n=\prod\lambda_j$.

**합.** $\lambda^{n-1}$의 계수를 비교합니다. 좌변의 행렬식 전개에서 $\lambda^{n-1}$이 나오는 것은 대각성분의 곱 $\prod(a_{jj}-\lambda)$뿐입니다(다른 항은 대각성분을 적어도 두 개 빠뜨려 $\lambda$의 차수가 $n-2$ 이하). 그 계수는 $(-1)^{n-1}\sum a_{jj}$. 우변에서는 $(-1)^n\cdot\big(-\sum\lambda_j\big)=(-1)^{n-1}\sum\lambda_j$. 따라서 $\sum\lambda_j=\tr A$.` },
  { ch: 'ch07', id: 'eigfunc', title: '$A^k$, $A^{-1}$, $A+cI$, $A^T$의 고유값', keys: ['고유값의 기본 성질'],
    tags: 'eigenvalue power inverse shift transpose 고유값 거듭제곱 역행렬 전치',
    stmt: R`$A\mathbf x=\lambda\mathbf x$이면 $A^k\mathbf x=\lambda^k\mathbf x$, $A^{-1}\mathbf x=\lambda^{-1}\mathbf x$, $(A+cI)\mathbf x=(\lambda+c)\mathbf x$이고, $A^T$는 $A$와 같은 고유값을 가진다.`,
    body: R`
$A^2\mathbf x=A(\lambda\mathbf x)=\lambda A\mathbf x=\lambda^2\mathbf x$이고, 귀납적으로 $A^k\mathbf x=\lambda^k\mathbf x$.

$A$가 가역이면 $\lambda\ne0$입니다($\lambda=0$이면 $A\mathbf x=\mathbf 0$, $\mathbf x\ne\mathbf 0$라 가역이 아님). $\mathbf x=A^{-1}(\lambda\mathbf x)$에서 $A^{-1}\mathbf x=\lambda^{-1}\mathbf x$.

$(A+cI)\mathbf x=\lambda\mathbf x+c\mathbf x$.

$\det(A^T-\lambda I)=\det\big((A-\lambda I)^T\big)=\det(A-\lambda I)$이므로 특성다항식이 같습니다. 고유벡터는 일반적으로 다릅니다.` },
  { ch: 'ch07', id: 'symmetric', title: '실대칭행렬의 고유값은 실수, 고유벡터는 직교', keys: ['특수 행렬과 고유값'],
    tags: 'symmetric hermitian real eigenvalue orthogonal eigenvector 대칭 에르미트 실수 고유값 직교',
    stmt: R`실대칭행렬(더 일반적으로 에르미트 행렬)의 고유값은 실수이고, 서로 다른 고유값의 고유벡터는 직교한다.`,
    body: R`
$A\mathbf x=\lambda\mathbf x$ ($\mathbf x$는 복소 벡터일 수 있음)라 하고 스칼라 $s=\bar{\mathbf x}^TA\mathbf x=\lambda\,\bar{\mathbf x}^T\mathbf x=\lambda|\mathbf x|^2$을 봅니다. $A$가 실수이고 대칭이면
$$\bar s=\mathbf x^TA\bar{\mathbf x}=\big(\mathbf x^TA\bar{\mathbf x}\big)^T=\bar{\mathbf x}^TA^T\mathbf x=\bar{\mathbf x}^TA\mathbf x=s$$
이므로 $s$는 실수이고 $\lambda=s/|\mathbf x|^2$도 실수입니다.

**직교성.** $A\mathbf x_1=\lambda_1\mathbf x_1$, $A\mathbf x_2=\lambda_2\mathbf x_2$이면
$$\lambda_1\mathbf x_2^T\mathbf x_1=\mathbf x_2^TA\mathbf x_1=(A^T\mathbf x_2)^T\mathbf x_1=(A\mathbf x_2)^T\mathbf x_1=\lambda_2\mathbf x_2^T\mathbf x_1$$
$(\lambda_1-\lambda_2)\,\mathbf x_2^T\mathbf x_1=0$이고 $\lambda_1\ne\lambda_2$이므로 $\mathbf x_1\perp\mathbf x_2$. 에르미트 행렬은 전치를 켤레전치로 바꾸면 같습니다.` },
  { ch: 'ch07', id: 'skeworth', title: '반대칭행렬과 직교행렬의 고유값', keys: ['특수 행렬과 고유값'],
    tags: 'skew-symmetric orthogonal unitary eigenvalue 반대칭 직교 유니터리 고유값 순허수',
    stmt: R`실반대칭행렬의 고유값은 순허수 또는 0이고, 직교행렬은 내적을 보존하며 고유값의 절댓값이 1, $\det A=\pm1$이다.`,
    body: R`
**반대칭.** 앞 증명의 $s=\bar{\mathbf x}^TA\mathbf x=\lambda|\mathbf x|^2$에 대해 $A^T=-A$이면 같은 계산으로 $\bar s=\bar{\mathbf x}^TA^T\mathbf x=-s$. 즉 $s$는 순허수(또는 0)이고 $\lambda$도 그렇습니다.

**직교.** $A^TA=I$이면 $(A\mathbf u)\cdot(A\mathbf v)=\mathbf u^TA^TA\mathbf v=\mathbf u\cdot\mathbf v$로 내적(따라서 길이와 각)을 보존합니다. $A\mathbf x=\lambda\mathbf x$이면
$$|\lambda|^2|\mathbf x|^2=\overline{(A\mathbf x)}^T(A\mathbf x)=\bar{\mathbf x}^TA^TA\mathbf x=|\mathbf x|^2$$
이므로 $|\lambda|=1$. 또 $(\det A)^2=\det(A^TA)=1$이므로 $\det A=\pm1$.` },
  { ch: 'ch07', id: 'diagonalize', title: '대각화 정리', keys: ['대각화'],
    tags: 'diagonalization similar matrix distinct eigenvalues independent 대각화 닮음 서로 다른 고유값 일차독립',
    stmt: R`독립인 고유벡터 $n$개를 열로 모은 $X$에 대해 $X^{-1}AX=D$이고 $A^k=XD^kX^{-1}$이다. 서로 다른 고유값의 고유벡터는 일차독립이다.`,
    body: R`
$AX=[A\mathbf x_1\ \cdots\ A\mathbf x_n]=[\lambda_1\mathbf x_1\ \cdots\ \lambda_n\mathbf x_n]=XD$이고, 열이 독립이므로 $X$는 가역입니다. 따라서 $X^{-1}AX=D$. 또
$$A^k=(XDX^{-1})(XDX^{-1})\cdots(XDX^{-1})=XD^kX^{-1}$$
(가운데의 $X^{-1}X$가 모두 지워짐).

**독립성.** 서로 다른 고유값의 고유벡터들 사이에 자명하지 않은 관계가 있다고 하고, 그중 항 수가 가장 적은 것을 $c_1\mathbf x_1+\cdots+c_m\mathbf x_m=\mathbf 0$ (모든 $c_i\ne0$)이라 합니다. $A-\lambda_mI$를 적용하면
$$\sum_{i<m}c_i(\lambda_i-\lambda_m)\mathbf x_i=\mathbf 0$$
계수 $c_i(\lambda_i-\lambda_m)\ne0$이므로 더 짧은 관계가 생겨 모순입니다.

닮은 행렬은 $\det(P^{-1}AP-\lambda I)=\det\big(P^{-1}(A-\lambda I)P\big)=\det(A-\lambda I)$이므로 고유값이 같습니다.` },
  { ch: 'ch07', id: 'principal', title: '주축 정리', keys: ['주축 변환'],
    tags: 'principal axes quadratic form conic positive definite 주축 이차형식 이차곡선 양의 정부호',
    sketch: R`고유값이 중복되어도 대칭행렬은 정규직교 고유벡터를 $n$개 가진다는 스펙트럼 정리는 증명 없이 씁니다.`,
    stmt: R`대칭행렬 $A$의 정규직교 고유벡터를 열로 가진 $Q$로 $\mathbf x=Q\mathbf y$라 두면 $\mathbf x^TA\mathbf x=\lambda_1y_1^2+\cdots+\lambda_ny_n^2$.`,
    body: R`
먼저 $ax_1^2+2bx_1x_2+cx_2^2=\mathbf x^T\begin{pmatrix}a&b\\b&c\end{pmatrix}\mathbf x$입니다. 비대각성분 $a_{12}+a_{21}=2b$가 교차항을 만들기 때문에 절반씩 나눠 넣습니다.

$Q$의 열이 정규직교이므로 $Q^TQ=I$, 즉 $Q^{-1}=Q^T$이고 $Q^TAQ=D$. 따라서
$$\mathbf x^TA\mathbf x=(Q\mathbf y)^TA(Q\mathbf y)=\mathbf y^T(Q^TAQ)\mathbf y=\mathbf y^TD\mathbf y=\sum\lambda_iy_i^2$$
$Q$는 회전(필요하면 한 열의 부호를 바꿔 $\det Q=1$)이라 곡선의 모양을 바꾸지 않으므로, 고유값의 부호가 이차곡선의 종류를 정합니다. 또 $\mathbf y\ne\mathbf 0$인 모든 $\mathbf y$에 대해 $\sum\lambda_iy_i^2>0$일 필요충분조건은 모든 $\lambda_i>0$ (양의 정부호)입니다.` },
  );
})();
