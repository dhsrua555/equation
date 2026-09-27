/* Part B — 선형대수 · 벡터 미적분 (Kreyszig Ch.7–10) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push(
  // ───────────────────────── 06
  {
    n: 6, part: 'B', title: '행렬과 연립일차방정식', en: 'Matrices, Linear Systems', ref: 'Kreyszig Ch.7', plot: 'grid',
    fig: R`행렬 $\left[\begin{smallmatrix}1&0.55\\0.25&0.9\end{smallmatrix}\right]$에 의한 격자의 변형`,
    tagline: R`가우스 소거법 하나로 계수, 해의 개수, 역행렬까지 모두 판단합니다.`,
    summary: R`행렬 연산, 가우스 소거법, 일차독립과 계수, 해의 존재·유일성, 행렬식과 크래머 공식, 역행렬을 다룹니다. 이후 고유값·연립 ODE의 바탕이 되는 단원입니다.`,
    goals: [
      R`행 연산으로 첨가행렬을 사다리꼴로 만들고 해를 구할 수 있다`,
      R`계수(rank)로 해가 없음/유일/무수히 많음을 판정할 수 있다`,
      R`행렬식의 성질과 크래머 공식을 쓸 수 있다`,
      R`2×2 공식과 가우스-조르단으로 역행렬을 구할 수 있다`,
    ],
    sections: [
      { title: '행렬과 벡터의 연산', body: R`
$m\times n$ 행렬의 곱 $AB$는 $A$의 열 수와 $B$의 행 수가 같을 때만 정의됩니다.

:::key 곱과 전치
$$c_{jk}=\sum_{l=1}^{n}a_{jl}b_{lk},\qquad (AB)^T=B^TA^T,\qquad (AB)^{-1}=B^{-1}A^{-1}$$
:::

- **대칭행렬** $A^T=A$, **반대칭행렬** $A^T=-A$. 모든 정사각행렬은 $A=\tfrac12(A+A^T)+\tfrac12(A-A^T)$로 둘의 합이 됩니다.
- 삼각행렬, 대각행렬, 단위행렬 $I$는 계산이 쉬운 특수한 경우입니다.

:::ex 예제 1
$A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$, $B=\begin{pmatrix}0&1\\1&0\end{pmatrix}$에 대해 $AB$와 $BA$를 비교하세요.
---
$$AB=\begin{pmatrix}2&1\\4&3\end{pmatrix},\qquad BA=\begin{pmatrix}3&4\\1&2\end{pmatrix}$$
오른쪽에 $B$를 곱하면 열이, 왼쪽에 곱하면 행이 바뀝니다. $AB\ne BA$입니다.
:::

:::warn 행렬 곱의 함정
$AB\ne BA$가 일반적이고, $AB=0$이어도 $A=0$ 또는 $B=0$이라는 보장이 없습니다. 그래서 $AB=AC$에서 $B=C$를 얻을 수 없습니다.
:::
` },
      { title: '가우스 소거법', body: R`
연립방정식 $A\mathbf x=\mathbf b$는 첨가행렬 $\tilde A=[A\ \ \mathbf b]$에 **기본 행 연산**을 적용해 풉니다.

- 두 행을 바꾼다
- 한 행에 0이 아닌 상수를 곱한다
- 한 행의 상수배를 다른 행에 더한다

행 연산은 해를 바꾸지 않습니다. 행사다리꼴(row echelon form)을 만든 뒤 아래에서부터 역대입합니다.

:::ex 예제 2
$2x+y-z=8,\ -3x-y+2z=-11,\ -2x+y+2z=-3$을 푸세요.
---
$$\left[\begin{array}{ccc|c}2&1&-1&8\\-3&-1&2&-11\\-2&1&2&-3\end{array}\right]\to\left[\begin{array}{ccc|c}2&1&-1&8\\0&\tfrac12&\tfrac12&1\\0&2&1&5\end{array}\right]\to\left[\begin{array}{ccc|c}2&1&-1&8\\0&\tfrac12&\tfrac12&1\\0&0&-1&1\end{array}\right]$$
역대입: $z=-1$, $\tfrac12y-\tfrac12=1$에서 $y=3$, $2x+3+1=8$에서 $x=2$.
:::
` },
      { title: '일차독립과 계수', body: R`
벡터 $\mathbf a_1,\dots,\mathbf a_m$이 **일차독립**이라는 것은 $c_1\mathbf a_1+\cdots+c_m\mathbf a_m=\mathbf 0$이 $c_1=\cdots=c_m=0$일 때만 성립한다는 뜻입니다.

행렬의 **계수(rank)**는 일차독립인 행의 최대 개수이며, 일차독립인 열의 최대 개수와 같습니다. 행 연산은 계수를 바꾸지 않으므로 사다리꼴에서 0이 아닌 행을 세면 됩니다.

:::key 계수와 영공간
$$\operatorname{rank}A=(\text{행사다리꼴에서 0이 아닌 행의 수}),\qquad \operatorname{rank}A+\operatorname{nullity}A=n$$
:::

- 성분이 $n$개인 벡터가 $n+1$개 이상이면 반드시 일차종속입니다.
- $n\times n$ 행렬에서 $\operatorname{rank}A=n\iff\det A\ne0$입니다.
- 영공간 $\{\mathbf x: A\mathbf x=\mathbf 0\}$의 차원(nullity)은 자유변수의 개수입니다.
` },
      { title: '해의 존재와 유일성', body: R`
:::key 해의 개수 판정 ($n$은 미지수의 개수, $\tilde A$는 첨가행렬)
| 조건 | 해 |
|---|---|
| $\operatorname{rank}A<\operatorname{rank}\tilde A$ | 없음 |
| $\operatorname{rank}A=\operatorname{rank}\tilde A=n$ | 유일 |
| $\operatorname{rank}A=\operatorname{rank}\tilde A=r<n$ | 무수히 많음 (자유변수 $n-r$개) |
:::

동차계 $A\mathbf x=\mathbf 0$은 항상 자명해 $\mathbf x=\mathbf 0$을 가지고, $\operatorname{rank}A<n$일 때만 자명하지 않은 해가 있습니다. 정사각행렬이면 이 조건은 $\det A=0$과 같습니다.

비동차계의 일반해는 “특수해 하나 + 동차계의 일반해”입니다. 사다리꼴에서 자유변수를 $t$ 등으로 두고 나머지를 $t$로 표현하세요.
` },
      { title: '행렬식과 크래머 공식', body: R`
행렬식은 한 행(또는 열)을 따라 여인수 전개합니다: $\det A=\sum_k(-1)^{j+k}a_{jk}M_{jk}$. 0이 많은 행을 고르면 계산이 짧아집니다.

:::key 행렬식의 성질
$$\det(AB)=\det A\,\det B,\qquad \det(A^T)=\det A,\qquad \det(cA)=c^n\det A,\qquad \det(A^{-1})=\frac1{\det A}$$
$$\text{크래머 공식: } x_k=\frac{D_k}{D},\qquad D_k:\ D\text{의 }k\text{열을 }\mathbf b\text{로 바꾼 행렬식}$$
:::

- 두 행을 바꾸면 부호가 바뀌고, 한 행에 $c$를 곱하면 $c$배가 되며, 한 행의 배수를 다른 행에 더하면 변하지 않습니다.
- 삼각행렬의 행렬식은 대각성분의 곱입니다.

:::ex 예제 3
$\det\begin{pmatrix}1&2&3\\4&5&6\\7&8&10\end{pmatrix}$을 구하세요.
---
첫 행으로 전개: $1(50-48)-2(40-42)+3(32-35)=2+4-9=-3$.
:::
` },
      { title: '역행렬', body: R`
$A^{-1}$이 존재할 필요충분조건은 $\det A\ne0$, 즉 $\operatorname{rank}A=n$입니다.

:::key 2×2 역행렬과 수반행렬
$$\begin{pmatrix}a&b\\c&d\end{pmatrix}^{-1}=\frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix},\qquad A^{-1}=\frac{1}{\det A}\operatorname{adj}A,\quad(\operatorname{adj}A)_{jk}=C_{kj}$$
:::

큰 행렬은 **가우스-조르단**으로 구합니다. $[A\ \ I]$에 행 연산을 적용해 왼쪽을 $I$로 만들면 오른쪽이 $A^{-1}$이 됩니다.

:::ex 예제 4
$A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$의 역행렬은?
---
$\det A=-2$이므로 $A^{-1}=-\tfrac12\begin{pmatrix}4&-2\\-3&1\end{pmatrix}=\begin{pmatrix}-2&1\\ \tfrac32&-\tfrac12\end{pmatrix}$.
:::

:::tip 시험 포인트
역행렬을 구했으면 $AA^{-1}=I$의 한 행만이라도 곱해 확인하세요. 3×3 수반행렬에서는 여인수의 부호 $(-1)^{j+k}$와 전치를 빠뜨리는 실수가 가장 흔합니다.
:::
` },
    ],
    problems: [
      { type: 'num', lv: 1, q: R`$\det\begin{pmatrix}2&1&0\\1&3&1\\0&1&2\end{pmatrix}$의 값은?`, ans: '8', ansTex: R`8`,
        sol: R`첫 행으로 전개: $2(6-1)-1(2-0)+0=10-2=8$.` },
      { type: 'mc', lv: 1, q: R`곱이 정의되는 두 행렬 $A,B$에 대해 $(AB)^T$와 항상 같은 것은?`,
        choices: [R`$A^TB^T$`, R`$B^TA^T$`, R`$BA$`, R`$(BA)^T$`], ans: 1,
        sol: R`$(AB)^T_{jk}=(AB)_{kj}=\sum_l a_{kl}b_{lj}=\sum_l (B^T)_{jl}(A^T)_{lk}$이므로 $(AB)^T=B^TA^T$. 순서가 뒤집힙니다.` },
      { type: 'num', lv: 2, q: R`$\operatorname{rank}\begin{pmatrix}1&2&3\\2&4&6\\1&0&1\end{pmatrix}$은?`, ans: '2', ansTex: R`2`,
        sol: R`둘째 행은 첫째 행의 2배이고, 첫째 행과 셋째 행은 비례하지 않으므로 계수는 2입니다.` },
      { type: 'mc', lv: 2, q: R`연립방정식 $x+y=1,\ 2x+ky=3$이 해를 갖지 않는 $k$는?`,
        choices: [R`$k=1$`, R`$k=2$`, R`$k=3$`, R`그런 $k$는 없다`], ans: 1,
        sol: R`$\det=k-2=0$일 때 $k=2$. 이때 $x+y=1$, $2x+2y=3$은 모순이므로($2\ne3$) 해가 없습니다. 다른 $k$에서는 유일한 해가 있습니다.` },
      { type: 'num', lv: 2, q: R`$A=\begin{pmatrix}2&1\\5&3\end{pmatrix}$일 때 $A^{-1}$의 (2,1) 성분은?`, ans: '-5', ansTex: R`-5`,
        sol: R`$\det A=6-5=1$이므로 $A^{-1}=\begin{pmatrix}3&-1\\-5&2\end{pmatrix}$. (2,1) 성분은 $-5$.` },
      { type: 'open', lv: 2, q: R`가우스 소거법으로 푸세요: $x+y+z=6,\ 2x-y+z=3,\ x+2y-z=2$.`,
        sol: R`
$$\left[\begin{array}{ccc|c}1&1&1&6\\2&-1&1&3\\1&2&-1&2\end{array}\right]\to\left[\begin{array}{ccc|c}1&1&1&6\\0&-3&-1&-9\\0&1&-2&-4\end{array}\right]\to\left[\begin{array}{ccc|c}1&1&1&6\\0&-3&-1&-9\\0&0&-\tfrac73&-7\end{array}\right]$$
$z=3$, $-3y-3=-9$에서 $y=2$, $x=6-2-3=1$. 해는 $(x,y,z)=(1,2,3)$.` },
      { type: 'num', lv: 2, q: R`크래머 공식으로 $2x+y=5,\ x+3y=10$을 풀 때 $y$의 값은?`, ans: '3', ansTex: R`3`,
        sol: R`$D=6-1=5$, $D_2=\begin{vmatrix}2&5\\1&10\end{vmatrix}=15$이므로 $y=15/5=3$. ($x=1$)` },
      { type: 'mc', lv: 2, q: R`$A$가 $4\times6$ 행렬이고 $\operatorname{rank}A=3$일 때 $A\mathbf x=\mathbf 0$의 해공간의 차원은?`,
        choices: [R`$1$`, R`$2$`, R`$3$`, R`$4$`], ans: 2,
        sol: R`미지수는 6개이므로 $\operatorname{nullity}A=6-3=3$.` },
      { type: 'num', lv: 3, q: R`세 벡터 $(1,2,1)$, $(2,1,-1)$, $(0,3,a)$가 일차종속이 되는 $a$의 값은?`, ans: '3', ansTex: R`3`,
        sol: R`
$$\det\begin{pmatrix}1&2&1\\2&1&-1\\0&3&a\end{pmatrix}=(a+3)-2(2a)+6=9-3a=0\;\Rightarrow\;a=3$$
실제로 $2(1,2,1)-(2,1,-1)=(0,3,3)$입니다.` },
      { type: 'num', lv: 3, q: R`$3\times3$ 행렬 $A$의 행렬식이 4일 때 $\det(2A^{-1})$은?`, ans: '2', ansTex: R`2`,
        sol: R`$\det(2A^{-1})=2^3\det(A^{-1})=8\cdot\tfrac14=2$.` },
      { type: 'open', lv: 3, q: R`$x_1+x_2+2x_3=4,\ 2x_1+3x_2+5x_3=9$의 일반해를 구하세요.`,
        sol: R`
$$\left[\begin{array}{ccc|c}1&1&2&4\\2&3&5&9\end{array}\right]\to\left[\begin{array}{ccc|c}1&1&2&4\\0&1&1&1\end{array}\right]$$
계수 2, 미지수 3이므로 자유변수 1개. $x_3=t$로 두면 $x_2=1-t$, $x_1=4-(1-t)-2t=3-t$.
$$\mathbf x=\begin{pmatrix}3\\1\\0\end{pmatrix}+t\begin{pmatrix}-1\\-1\\1\end{pmatrix}$$` },
    ],
  },
  // ───────────────────────── 07
  {
    n: 7, part: 'B', title: '고유값 문제', en: 'Matrix Eigenvalue Problems', ref: 'Kreyszig Ch.8', plot: 'eigen',
    fig: R`이차형식의 등위선과 두 주축`,
    tagline: R`행렬이 방향은 그대로 두고 길이만 바꾸는 벡터를 찾습니다. 대각화와 주축 변환의 출발점입니다.`,
    summary: R`특성방정식으로 고유값과 고유벡터를 구하고, 대칭·직교 행렬의 성질, 대각화, 이차형식의 주축 변환을 다룹니다.`,
    goals: [
      R`특성방정식을 세워 고유값과 고유공간을 구할 수 있다`,
      R`고유값의 합·곱과 $\tr A$, $\det A$의 관계로 검산할 수 있다`,
      R`대각화 가능 여부를 판단하고 $A^k=XD^kX^{-1}$을 쓸 수 있다`,
      R`이차형식을 주축으로 변환해 이차곡선을 판별할 수 있다`,
    ],
    sections: [
      { title: '고유값과 고유벡터', body: R`
$A\mathbf x=\lambda\mathbf x$ ($\mathbf x\ne\mathbf 0$)을 만족하는 $\lambda$가 고유값, $\mathbf x$가 고유벡터입니다. $(A-\lambda I)\mathbf x=\mathbf 0$이 자명하지 않은 해를 가져야 하므로 $\det(A-\lambda I)=0$입니다.

:::key 고유값의 기본 성질
$$\det(A-\lambda I)=0,\qquad \sum_j\lambda_j=\tr A,\qquad \prod_j\lambda_j=\det A$$
$$A^k\to\lambda^k,\qquad A^{-1}\to\frac1\lambda,\qquad A+cI\to\lambda+c,\qquad A^T\to\lambda$$
:::

- 삼각행렬의 고유값은 대각성분입니다.
- 고유값 $\lambda$가 특성방정식에서 $M$중근이면 대수적 중복도 $M$, 고유공간의 차원이 기하적 중복도 $m\le M$입니다.

:::ex 예제 1
$A=\begin{pmatrix}-5&2\\2&-2\end{pmatrix}$의 고유값과 고유벡터를 구하세요.
---
$\det(A-\lambda I)=\lambda^2+7\lambda+6=0$에서 $\lambda=-1,\,-6$.
$\lambda=-1$: $-4x_1+2x_2=0$ → $\mathbf x_1=(1,2)^T$. $\lambda=-6$: $x_1+2x_2=0$ → $\mathbf x_2=(2,-1)^T$.
검산: 합 $-7=\tr A$, 곱 $6=\det A$ ✓
:::
` },
      { title: '대칭·반대칭·직교 행렬', body: R`
:::key 특수 행렬과 고유값
| 행렬 | 정의 | 고유값 |
|---|---|---|
| 대칭 | $A^T=A$ | 모두 실수 |
| 반대칭 | $A^T=-A$ | 순허수 또는 0 |
| 직교 | $A^T=A^{-1}$ | 절댓값 1 |
| 에르미트 | $\bar A^T=A$ | 모두 실수 |
| 유니터리 | $\bar A^T=A^{-1}$ | 절댓값 1 |
:::

- 실대칭행렬에서 서로 다른 고유값의 고유벡터는 **직교**합니다.
- 직교행렬은 내적과 길이를 보존하고, 행(열)들이 정규직교이며, $\det A=\pm1$입니다.

예를 들어 회전행렬 $\begin{pmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{pmatrix}$는 직교행렬이고 고유값은 $e^{\pm i\theta}$입니다.
` },
      { title: '대각화', body: R`
$n\times n$ 행렬이 일차독립인 고유벡터를 $n$개 가지면, 고유벡터를 열로 모은 $X$로 대각화됩니다.

:::key 대각화
$$D=X^{-1}AX=\operatorname{diag}(\lambda_1,\dots,\lambda_n),\qquad A^k=XD^kX^{-1}$$
$$\text{실대칭행렬: } A=QDQ^T\quad(Q\text{의 열은 정규직교 고유벡터})$$
:::

고유값이 모두 다르면 항상 대각화됩니다. 닮은 행렬 $P^{-1}AP$는 $A$와 같은 고유값을 가집니다.

:::ex 예제 2
$A=\begin{pmatrix}4&1\\2&3\end{pmatrix}$을 대각화하세요.
---
$\lambda^2-7\lambda+10=0$에서 $\lambda=2,5$. 고유벡터 $(1,-2)^T$, $(1,1)^T$.
$$X=\begin{pmatrix}1&1\\-2&1\end{pmatrix},\quad X^{-1}=\frac13\begin{pmatrix}1&-1\\2&1\end{pmatrix},\quad X^{-1}AX=\begin{pmatrix}2&0\\0&5\end{pmatrix}$$
:::

:::warn 대각화 조건
고유값이 중복되면 고유벡터가 부족할 수 있습니다. $\begin{pmatrix}2&1\\0&2\end{pmatrix}$는 고유값 2가 이중근이지만 고유벡터가 $(1,0)^T$ 방향 하나뿐이라 대각화되지 않습니다.
:::
` },
      { title: '이차형식과 주축 변환', body: R`
이차형식 $Q=\mathbf x^TA\mathbf x$에서 $A$는 대칭으로 잡습니다. 대칭행렬의 정규직교 고유벡터로 좌표를 돌리면 교차항이 사라집니다.

:::key 주축 변환
$$ax_1^2+2bx_1x_2+cx_2^2=\mathbf x^T\begin{pmatrix}a&b\\b&c\end{pmatrix}\mathbf x=\lambda_1y_1^2+\lambda_2y_2^2,\qquad \mathbf x=X\mathbf y$$
$$\lambda_1\lambda_2>0:\ \text{타원},\qquad \lambda_1\lambda_2<0:\ \text{쌍곡선}$$
:::

:::ex 예제 3
$17x_1^2-30x_1x_2+17x_2^2=128$은 어떤 곡선인가?
---
$A=\begin{pmatrix}17&-15\\-15&17\end{pmatrix}$, 고유값 $2,32$. 주축 좌표에서 $2y_1^2+32y_2^2=128$, 즉
$$\frac{y_1^2}{64}+\frac{y_2^2}{4}=1$$
긴반지름 8, 짧은반지름 2인 타원이며, 긴축은 $(1,1)^T$ 방향입니다.
:::

:::warn 교차항의 절반
$3x_1^2+6x_1x_2+2x_2^2$의 행렬은 $\begin{pmatrix}3&3\\3&2\end{pmatrix}$입니다. 교차항 계수 6을 그대로 비대각성분에 넣지 마세요.
:::

모든 고유값이 양수이면 $Q$는 **양의 정부호**이고, 2×2에서는 $a>0$, $ac-b^2>0$과 같습니다.
` },
      { title: '계산 요령과 응용', body: R`
- 블록 대각행렬의 고유값은 각 블록의 고유값을 모은 것입니다.
- 3×3 특성다항식의 정수근은 $\det A$의 약수 중에서 먼저 찾아보세요.
- 연립 ODE $\mathbf y'=A\mathbf y$의 해는 고유값·고유벡터로 바로 씁니다(3단원).

:::ex 예제 4 (마르코프 과정)
열의 합이 1인 $A=\begin{pmatrix}0.8&0.1\\0.2&0.9\end{pmatrix}$의 정상상태 분포를 구하세요.
---
확률행렬은 항상 고유값 1을 가집니다(다른 고유값은 $\tr A-1=0.7$). $\lambda=1$: $-0.2x_1+0.1x_2=0$ → $(1,2)^T$. 합이 1이 되게 하면 $(\tfrac13,\tfrac23)^T$.
:::

:::tip 시험 포인트
특성다항식을 전개하기 전에 $\tr A$와 $\det A$를 적어 두면, 구한 고유값의 합과 곱으로 바로 검산할 수 있습니다.
:::
` },
    ],
    problems: [
      { type: 'mc', lv: 1, q: R`$A=\begin{pmatrix}1&4\\2&3\end{pmatrix}$의 고유값은?`,
        choices: [R`$1,\ 3$`, R`$-5,\ 1$`, R`$5,\ -1$`, R`$2,\ 2$`], ans: 2,
        sol: R`$\lambda^2-4\lambda+(3-8)=\lambda^2-4\lambda-5=(\lambda-5)(\lambda+1)$. 합 $4=\tr A$, 곱 $-5=\det A$ ✓` },
      { type: 'num', lv: 1, q: R`$A=\begin{pmatrix}3&1&2\\0&-1&4\\5&2&6\end{pmatrix}$의 세 고유값의 합은?`, ans: '8', ansTex: R`8`,
        sol: R`고유값의 합은 대각합 $\tr A=3-1+6=8$.` },
      { type: 'num', lv: 2, q: R`$A=\begin{pmatrix}2&5&1\\0&3&7\\0&0&-1\end{pmatrix}$일 때 $A^2$의 가장 큰 고유값은?`, ans: '9', ansTex: R`9`,
        sol: R`삼각행렬이므로 $A$의 고유값은 $2,3,-1$. $A^2$의 고유값은 $4,9,1$이므로 가장 큰 값은 9.` },
      { type: 'mc', lv: 2, q: R`실대칭행렬에 대한 설명으로 항상 옳은 것은?`,
        choices: [R`고유값이 순허수일 수 있다`, R`서로 다른 고유값에 대한 고유벡터는 서로 직교한다`, R`항상 역행렬을 가진다`, R`독립인 고유벡터가 $n$개보다 적을 수 있다`], ans: 1,
        sol: R`실대칭행렬의 고유값은 실수이고, 서로 다른 고유값의 고유벡터는 직교하며, 항상 직교대각화됩니다. 0을 고유값으로 가지면 역행렬이 없을 수 있습니다.` },
      { type: 'open', lv: 2, q: R`$A=\begin{pmatrix}2&0&0\\0&3&4\\0&4&-3\end{pmatrix}$의 고유값과 고유벡터를 구하세요.`,
        hint: R`블록 대각 구조입니다.`,
        sol: R`
첫 블록에서 $\lambda=2$, 고유벡터 $(1,0,0)^T$. 둘째 블록 $\begin{pmatrix}3&4\\4&-3\end{pmatrix}$의 특성방정식 $\lambda^2-25=0$에서 $\lambda=\pm5$.
$\lambda=5$: $-2x_2+4x_3=0$ → $(0,2,1)^T$. $\lambda=-5$: $8x_2+4x_3=0$ → $(0,1,-2)^T$.
대칭행렬이므로 세 고유벡터가 서로 직교함을 확인할 수 있습니다.` },
      { type: 'num', lv: 2, q: R`$A=\begin{pmatrix}1&2\\2&1\end{pmatrix}$일 때 $A^4$의 (1,1) 성분은?`, ans: '41', ansTex: R`41`,
        hint: R`고유값 $3,-1$로 대각화하거나 $A^2$을 두 번 곱하세요.`,
        sol: R`
$A^n=\dfrac{3^n}{2}\begin{pmatrix}1&1\\1&1\end{pmatrix}+\dfrac{(-1)^n}{2}\begin{pmatrix}1&-1\\-1&1\end{pmatrix}$이므로 (1,1) 성분은 $\dfrac{81+1}{2}=41$.
직접 계산: $A^2=\begin{pmatrix}5&4\\4&5\end{pmatrix}$, $A^4=\begin{pmatrix}41&40\\40&41\end{pmatrix}$.` },
      { type: 'mc', lv: 2, q: R`$x_1^2+6x_1x_2+x_2^2=8$이 나타내는 곡선은?`,
        choices: [R`타원`, R`쌍곡선`, R`포물선`, R`한 쌍의 직선`], ans: 1,
        sol: R`$A=\begin{pmatrix}1&3\\3&1\end{pmatrix}$의 고유값은 $4,-2$. 주축 좌표에서 $4y_1^2-2y_2^2=8$, 부호가 다르므로 쌍곡선입니다.` },
      { type: 'mc', lv: 3, q: R`다음 중 대각화할 수 없는 행렬은?`,
        choices: [R`$\begin{pmatrix}2&0\\0&2\end{pmatrix}$`, R`$\begin{pmatrix}1&2\\2&1\end{pmatrix}$`, R`$\begin{pmatrix}2&1\\0&2\end{pmatrix}$`, R`$\begin{pmatrix}1&1\\0&2\end{pmatrix}$`], ans: 2,
        sol: R`③은 고유값 2가 이중근인데 $A-2I=\begin{pmatrix}0&1\\0&0\end{pmatrix}$의 영공간이 1차원이라 고유벡터가 하나뿐입니다. ①은 이미 대각, ②는 대칭, ④는 고유값이 서로 다릅니다.` },
      { type: 'num', lv: 2, q: R`$3\times3$ 행렬 $A$의 고유값이 $1,2,3$일 때 $\det(A+I)$는?`, ans: '24', ansTex: R`24`,
        sol: R`$A+I$의 고유값은 $2,3,4$이므로 $\det(A+I)=24$.` },
      { type: 'open', lv: 3, q: R`$5x_1^2+8x_1x_2+5x_2^2=9$를 주축 변환하고 곡선의 모양(종류, 반지름, 방향)을 설명하세요.`,
        sol: R`
$A=\begin{pmatrix}5&4\\4&5\end{pmatrix}$, $\lambda^2-10\lambda+9=0$에서 $\lambda=1,9$.
$\lambda=1$의 고유벡터 $\tfrac1{\sqrt2}(1,-1)^T$, $\lambda=9$의 고유벡터 $\tfrac1{\sqrt2}(1,1)^T$.
$$y_1^2+9y_2^2=9\iff\frac{y_1^2}{9}+y_2^2=1$$
$(1,-1)$ 방향으로 반지름 3, $(1,1)$ 방향으로 반지름 1인 타원입니다.` },
      { type: 'mc', lv: 1, q: R`실수 반대칭행렬($A^T=-A$)의 고유값에 대해 옳은 것은?`,
        choices: [R`모두 양의 실수이다`, R`순허수이거나 0이다`, R`절댓값이 모두 1이다`, R`모두 실수이다`], ans: 1,
        sol: R`반대칭행렬의 고유값은 순허수 또는 0입니다. 예: $\begin{pmatrix}0&1\\-1&0\end{pmatrix}$의 고유값은 $\pm i$.` },
    ],
  },
  // ───────────────────────── 08
  {
    n: 8, part: 'B', title: '벡터 미분', en: 'Vector Differential Calculus', ref: 'Kreyszig Ch.9', plot: 'field',
    fig: R`$f=\sin x\cos y$의 기울기 벡터장`,
    tagline: R`기울기는 가장 가파른 방향, 발산은 샘의 세기, 회전은 소용돌이의 세기입니다.`,
    summary: R`내적과 외적, 공간곡선의 호의 길이와 곡률, 기울기와 방향도함수, 발산과 회전을 다룹니다. 다음 단원의 적분 정리들이 이 연산자들 위에 세워집니다.`,
    goals: [
      R`내적·외적·삼중곱으로 각, 넓이, 부피를 계산할 수 있다`,
      R`곡선의 호의 길이와 곡률을 구할 수 있다`,
      R`방향도함수, 최대 증가율, 접평면을 구할 수 있다`,
      R`발산과 회전을 계산하고 퍼텐셜을 찾을 수 있다`,
    ],
    sections: [
      { title: '내적과 외적', body: R`
:::key 내적·외적·삼중곱
$$\mathbf a\cdot\mathbf b=|\mathbf a||\mathbf b|\cos\gamma=a_1b_1+a_2b_2+a_3b_3$$
$$\mathbf a\times\mathbf b=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\end{vmatrix},\qquad |\mathbf a\times\mathbf b|=|\mathbf a||\mathbf b|\sin\gamma$$
$$(\mathbf a\ \mathbf b\ \mathbf c)=\mathbf a\cdot(\mathbf b\times\mathbf c)=\det\begin{pmatrix}a_1&a_2&a_3\\b_1&b_2&b_3\\c_1&c_2&c_3\end{pmatrix}$$
:::

- $\mathbf a\cdot\mathbf b=0$이면 직교, $\mathbf a$의 $\mathbf b$ 방향 성분은 $\mathbf a\cdot\mathbf b/|\mathbf b|$입니다.
- $|\mathbf a\times\mathbf b|$는 평행사변형의 넓이, 방향은 오른손 법칙. $\mathbf b\times\mathbf a=-\mathbf a\times\mathbf b$.
- 삼중곱의 절댓값은 평행육면체의 부피이고, 0이면 세 벡터가 한 평면 위에 있습니다.

:::ex 예제 1
$P(1,0,0)$, $Q(0,2,0)$, $R(0,0,3)$을 꼭짓점으로 하는 삼각형의 넓이는?
---
$\overrightarrow{PQ}=(-1,2,0)$, $\overrightarrow{PR}=(-1,0,3)$, $\overrightarrow{PQ}\times\overrightarrow{PR}=(6,3,2)$, 크기 7.
넓이는 평행사변형의 절반인 $\tfrac72$.
:::
` },
      { title: '벡터함수와 곡선', body: R`
공간곡선 $\mathbf r(t)=(x(t),y(t),z(t))$의 접선벡터는 $\mathbf r'(t)$, 속력은 $|\mathbf r'|$, 가속도는 $\mathbf r''$입니다.

:::key 곡선의 기본량
$$s=\int_a^b|\mathbf r'(t)|\,dt,\qquad \mathbf u=\frac{\mathbf r'}{|\mathbf r'|},\qquad \kappa=\frac{|\mathbf r'\times\mathbf r''|}{|\mathbf r'|^3}$$
:::

:::ex 예제 2
나선 $\mathbf r=(a\cos t,\,a\sin t,\,ct)$의 한 바퀴 길이와 곡률은?
---
$|\mathbf r'|=\sqrt{a^2+c^2}$이므로 한 바퀴($0\le t\le2\pi$)의 길이는 $2\pi\sqrt{a^2+c^2}$.
$|\mathbf r'\times\mathbf r''|=a\sqrt{a^2+c^2}$이므로 $\kappa=\dfrac{a}{a^2+c^2}$ (상수).
:::
` },
      { title: '기울기와 방향도함수', body: R`
스칼라 함수 $f$의 기울기 $\nabla f$는 $f$가 가장 빨리 증가하는 방향을 가리키고, 그 크기가 최대 증가율입니다.

:::key 기울기와 방향도함수
$$\nabla f=\Big(\frac{\partial f}{\partial x},\frac{\partial f}{\partial y},\frac{\partial f}{\partial z}\Big),\qquad D_{\mathbf b}f=\frac{\mathbf b\cdot\nabla f}{|\mathbf b|}$$
$$\max_{\mathbf b}D_{\mathbf b}f=|\nabla f|,\qquad \text{곡면 } f=c\text{의 법선벡터}=\nabla f$$
:::

곡면 $f(x,y,z)=c$ 위의 점 $P$에서의 접평면은 $\nabla f(P)\cdot(\mathbf x-\mathbf p)=0$입니다.

:::ex 예제 3
$f=2x^2+3y^2+z^2$의 $P(2,1,3)$에서 $\mathbf a=(1,0,-2)$ 방향의 방향도함수는?
---
$\nabla f=(4x,6y,2z)=(8,6,6)$. $|\mathbf a|=\sqrt5$이므로
$$D_{\mathbf a}f=\frac{8-12}{\sqrt5}=-\frac{4}{\sqrt5}\approx-1.789$$
:::

:::warn 단위벡터
방향벡터를 단위벡터로 만들지 않는 실수가 가장 많습니다. 반드시 $|\mathbf b|$로 나누세요.
:::
` },
      { title: '발산', body: R`
벡터장 $\mathbf v$의 발산은 한 점에서 단위 부피당 흘러나가는 양, 즉 샘의 세기입니다. 비압축성 유체의 속도장은 $\operatorname{div}\mathbf v=0$입니다.

$$\operatorname{div}\mathbf v=\nabla\cdot\mathbf v=\frac{\partial v_1}{\partial x}+\frac{\partial v_2}{\partial y}+\frac{\partial v_3}{\partial z}$$

예를 들어 $\mathbf v=(3xz,\,2xy,\,-yz^2)$이면 $\operatorname{div}\mathbf v=3z+2x-2yz$입니다. 기울기의 발산은 라플라시안 $\nabla^2f=f_{xx}+f_{yy}+f_{zz}$입니다.
` },
      { title: '회전', body: R`
회전은 벡터장이 한 점 주위를 얼마나 도는지를 나타냅니다. 각속도 $\boldsymbol\omega$로 도는 강체의 속도장 $\mathbf v=\boldsymbol\omega\times\mathbf r$은 $\operatorname{curl}\mathbf v=2\boldsymbol\omega$입니다.

:::key 발산과 회전
$$\operatorname{div}\mathbf v=\nabla\cdot\mathbf v,\qquad \operatorname{curl}\mathbf v=\nabla\times\mathbf v=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\ \partial_x&\partial_y&\partial_z\\ v_1&v_2&v_3\end{vmatrix}$$
$$\operatorname{curl}(\nabla f)=\mathbf 0,\qquad \operatorname{div}(\operatorname{curl}\mathbf v)=0$$
:::

$\operatorname{curl}\mathbf v=\mathbf 0$인 장을 **비회전장**이라고 합니다. 단순연결 영역에서는 비회전장이 곧 기울기장($\mathbf v=\nabla f$)입니다.
` },
      { title: '공식 모음과 퍼텐셜 찾기', body: R`
:::key 곱의 미분 공식
$$\nabla(fg)=f\nabla g+g\nabla f,\qquad \nabla\cdot(f\mathbf v)=f\,\nabla\cdot\mathbf v+\mathbf v\cdot\nabla f$$
$$\nabla\times(f\mathbf v)=\nabla f\times\mathbf v+f\,\nabla\times\mathbf v$$
:::

퍼텐셜 $f$ ($\nabla f=\mathbf F$)는 성분을 하나씩 적분해 찾습니다.

:::ex 예제 4
$\mathbf F=(yz,\,xz,\,xy)$의 퍼텐셜을 구하세요.
---
$f_x=yz$에서 $f=xyz+g(y,z)$. $f_y=xz+g_y=xz$이므로 $g_y=0$, $f_z=xy+g_z=xy$이므로 $g$는 상수.
$$f=xyz$$
:::
` },
    ],
    problems: [
      { type: 'num', lv: 1, q: R`$\mathbf a=(1,2,2)$와 $\mathbf b=(3,0,4)$가 이루는 각을 $\gamma$라 할 때 $\cos\gamma$는?`, ans: '11/15', ansTex: R`\tfrac{11}{15}`,
        sol: R`$\mathbf a\cdot\mathbf b=3+0+8=11$, $|\mathbf a|=3$, $|\mathbf b|=5$이므로 $\cos\gamma=\tfrac{11}{15}$.` },
      { type: 'mc', lv: 1, q: R`$(1,2,0)\times(0,1,3)$은?`,
        choices: [R`$(-6,3,-1)$`, R`$(6,3,1)$`, R`$(3,-6,1)$`, R`$(6,-3,1)$`], ans: 3,
        sol: R`$(a_2b_3-a_3b_2,\ a_3b_1-a_1b_3,\ a_1b_2-a_2b_1)=(6-0,\ 0-3,\ 1-0)=(6,-3,1)$.` },
      { type: 'num', lv: 2, q: R`세 벡터 $(2,0,0)$, $(1,3,0)$, $(1,1,4)$가 만드는 평행육면체의 부피는?`, ans: '24', ansTex: R`24`,
        sol: R`삼중곱 $\det\begin{pmatrix}2&0&0\\1&3&0\\1&1&4\end{pmatrix}=2\cdot3\cdot4=24$ (삼각행렬).` },
      { type: 'num', lv: 2, q: R`$f=x^2y+yz$의 점 $(1,1,2)$에서 $(2,1,2)$ 방향의 방향도함수는?`, ans: '3', ansTex: R`3`,
        sol: R`$\nabla f=(2xy,\ x^2+z,\ y)=(2,3,1)$. 단위벡터 $\tfrac13(2,1,2)$와 내적하면 $\tfrac13(4+3+2)=3$.` },
      { type: 'num', lv: 2, q: R`$f=xyz$가 점 $(1,2,3)$에서 증가하는 최대 변화율은?`, ans: '7', ansTex: R`7`,
        sol: R`$\nabla f=(yz,xz,xy)=(6,3,2)$, $|\nabla f|=\sqrt{36+9+4}=7$.` },
      { type: 'num', lv: 1, q: R`$\mathbf F=(x^2y,\ yz,\ xz^2)$의 점 $(1,1,1)$에서 발산은?`, ans: '5', ansTex: R`5`,
        sol: R`$\operatorname{div}\mathbf F=2xy+z+2xz=2+1+2=5$.` },
      { type: 'mc', lv: 2, q: R`$\mathbf v=(y,\,-x,\,0)$의 회전은?`,
        choices: [R`$(0,0,2)$`, R`$(0,0,-2)$`, R`$(0,0,0)$`, R`$(1,-1,0)$`], ans: 1,
        sol: R`세 번째 성분 $\partial v_2/\partial x-\partial v_1/\partial y=-1-1=-2$, 나머지는 0. 시계 방향 회전이므로 $z$성분이 음수입니다.` },
      { type: 'mc', lv: 2, q: R`충분히 매끄러운 $f$, $\mathbf F$에 대해 항상 0(또는 영벡터)인 것은?`,
        choices: [R`$\operatorname{curl}(\operatorname{curl}\mathbf F)$`, R`$\operatorname{div}(\nabla f)$`, R`$\nabla(\operatorname{div}\mathbf F)$`, R`$\operatorname{div}(\operatorname{curl}\mathbf F)$`], ans: 3,
        sol: R`$\operatorname{div}(\operatorname{curl}\mathbf F)=0$과 $\operatorname{curl}(\nabla f)=\mathbf 0$은 혼합편미분의 대칭성에서 나오는 항등식입니다. $\operatorname{div}(\nabla f)=\nabla^2f$는 일반적으로 0이 아닙니다.` },
      { type: 'open', lv: 2, q: R`구면 $x^2+y^2+z^2=9$ 위의 점 $(2,2,1)$에서의 접평면의 방정식을 구하세요.`,
        sol: R`$f=x^2+y^2+z^2$의 기울기 $\nabla f=(2x,2y,2z)=(4,4,2)$가 법선입니다. $4(x-2)+4(y-2)+2(z-1)=0$, 즉
$$2x+2y+z=9$$` },
      { type: 'num', lv: 3, q: R`나선 $\mathbf r(t)=(3\cos t,\ 3\sin t,\ 4t)$의 곡률은?`, ans: '3/25', ansTex: R`\tfrac{3}{25}`,
        sol: R`$|\mathbf r'|=\sqrt{9+16}=5$, $|\mathbf r'\times\mathbf r''|=|(12\sin t,\,-12\cos t,\,9)|=15$. $\kappa=15/125=3/25$. (공식 $a/(a^2+c^2)$와 일치)` },
      { type: 'open', lv: 3, q: R`$\mathbf F=(2xy+z^3,\ x^2,\ 3xz^2)$가 기울기장임을 보이고 퍼텐셜을 구하세요.`,
        sol: R`
$$\operatorname{curl}\mathbf F=\big(0-0,\ 3z^2-3z^2,\ 2x-2x\big)=\mathbf 0$$
$\mathbb R^3$은 단순연결이므로 기울기장입니다. $f_x=2xy+z^3$에서 $f=x^2y+xz^3+g(y,z)$. $f_y=x^2+g_y=x^2$, $f_z=3xz^2+g_z=3xz^2$이므로 $g$는 상수.
$$f=x^2y+xz^3$$` },
    ],
  },
  // ───────────────────────── 09
  {
    n: 9, part: 'B', title: '벡터 적분과 적분 정리', en: 'Vector Integral Calculus', ref: 'Kreyszig Ch.10', plot: 'flow',
    fig: R`샘과 흡입구 쌍의 유선과 등퍼텐셜선`,
    tagline: R`경계에서의 적분과 내부에서의 적분을 잇는 세 정리, 그린·발산·스토크스입니다.`,
    summary: R`선적분과 경로 독립, 이중적분과 그린 정리, 면적분, 발산 정리와 스토크스 정리를 다룹니다. 어떤 정리를 써야 계산이 가장 짧아지는지 고르는 것이 시험의 핵심입니다.`,
    goals: [
      R`매개변수화로 선적분과 면적분을 계산할 수 있다`,
      R`경로 독립을 판정하고 퍼텐셜로 선적분을 끝낼 수 있다`,
      R`그린·발산·스토크스 정리를 방향에 맞게 적용할 수 있다`,
      R`극좌표·구면좌표의 면적·부피 요소를 쓸 수 있다`,
    ],
    sections: [
      { title: '선적분', body: R`
곡선 $C:\mathbf r(t),\ a\le t\le b$를 따라 힘 $\mathbf F$가 한 일은 선적분으로 계산합니다.

:::key 선적분
$$\int_C\mathbf F\cdot d\mathbf r=\int_a^b\mathbf F(\mathbf r(t))\cdot\mathbf r'(t)\,dt,\qquad \int_C f\,ds=\int_a^b f(\mathbf r(t))\,|\mathbf r'(t)|\,dt$$
:::

곡선의 방향을 바꾸면 $\int\mathbf F\cdot d\mathbf r$의 부호가 바뀝니다. 호의 길이에 대한 적분 $\int f\,ds$는 방향과 무관합니다.

:::ex 예제 1
$\mathbf F=(z,x,y)$를 나선 $\mathbf r=(\cos t,\sin t,3t)$, $0\le t\le2\pi$를 따라 적분하세요.
---
$\mathbf F(\mathbf r)\cdot\mathbf r'=(3t)(-\sin t)+\cos t\cos t+\sin t\cdot3$.
$$\int_0^{2\pi}\big(-3t\sin t+\cos^2t+3\sin t\big)dt=6\pi+\pi+0=7\pi$$
:::
` },
      { title: '경로 독립과 퍼텐셜', body: R`
:::key 경로 독립
$$\mathbf F=\nabla f\ \Rightarrow\ \int_A^B\mathbf F\cdot d\mathbf r=f(B)-f(A)$$
$$\text{단순연결 영역에서}\quad \operatorname{curl}\mathbf F=\mathbf 0\iff\mathbf F=\nabla f\iff\oint_C\mathbf F\cdot d\mathbf r=0$$
:::

평면에서는 $\partial F_2/\partial x=\partial F_1/\partial y$가 조건입니다. 조건이 맞으면 퍼텐셜을 구해 끝점만 대입하세요. 경로를 매개변수화할 필요가 없습니다.

:::warn 단순연결 조건
$\mathbf F=\Big(\dfrac{-y}{x^2+y^2},\dfrac{x}{x^2+y^2}\Big)$는 원점 밖에서 회전이 0이지만 원점을 도는 원 위의 적분은 $2\pi$입니다. 원점에 구멍이 있어 영역이 단순연결이 아니기 때문입니다.
:::
` },
      { title: '이중적분과 그린 정리', body: R`
:::key 그린 정리
$$\iint_R\Big(\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}\Big)dx\,dy=\oint_C\big(F_1\,dx+F_2\,dy\big),\qquad A=\frac12\oint_C(x\,dy-y\,dx)$$
$$\text{극좌표: } dx\,dy=r\,dr\,d\theta,\qquad \text{일반 변환: } dx\,dy=\Big|\frac{\partial(x,y)}{\partial(u,v)}\Big|\,du\,dv$$
:::

$C$는 영역 $R$을 왼쪽에 두고 도는 방향(바깥 경계는 반시계 방향)입니다.

:::ex 예제 2
그린 정리로 타원 $x^2/a^2+y^2/b^2=1$의 넓이를 구하세요.
---
$\mathbf r=(a\cos t,\,b\sin t)$이면
$$A=\frac12\int_0^{2\pi}\big(a\cos t\cdot b\cos t-b\sin t\cdot(-a\sin t)\big)dt=\frac12\int_0^{2\pi}ab\,dt=\pi ab$$
:::
` },
      { title: '곡면과 면적분', body: R`
곡면 $S:\mathbf r(u,v)$의 법선벡터는 $\mathbf N=\mathbf r_u\times\mathbf r_v$입니다. 유량(flux)은 법선 방향으로 곡면을 통과하는 양입니다.

:::key 면적분
$$A=\iint_R|\mathbf N|\,du\,dv,\qquad \iint_S\mathbf F\cdot\mathbf n\,dA=\iint_R\mathbf F(\mathbf r(u,v))\cdot\mathbf N(u,v)\,du\,dv$$
$$z=f(x,y)\ (\text{위쪽}):\ \mathbf N=(-f_x,\,-f_y,\,1),\qquad \text{반지름 }a\text{인 구면}:\ dA=a^2\sin\phi\,d\phi\,d\theta$$
:::

:::ex 예제 3
$\mathbf F=(x,y,z)$가 반지름 $a$인 구면을 바깥으로 통과하는 유량은?
---
구면에서 $\mathbf n=\mathbf r/a$이므로 $\mathbf F\cdot\mathbf n=|\mathbf r|^2/a=a$. 넓이 $4\pi a^2$을 곱하면 $4\pi a^3$.
:::
` },
      { title: '발산 정리', body: R`
닫힌 곡면 $S$로 둘러싸인 영역 $T$에서, 내부의 샘을 모두 더한 것은 경계를 빠져나가는 총 유량과 같습니다.

:::key 발산 정리 (가우스)
$$\iiint_T\operatorname{div}\mathbf F\,dV=\oiint_S\mathbf F\cdot\mathbf n\,dA\qquad(\mathbf n:\ \text{바깥 방향 단위법선})$$
:::

앞 예제를 발산 정리로 풀면 $\operatorname{div}\mathbf F=3$이므로 $3\cdot\tfrac43\pi a^3=4\pi a^3$, 같은 답입니다.

닫히지 않은 곡면의 유량을 물을 때는 바닥면 같은 곡면을 더해 닫은 뒤 발산 정리를 쓰고, 더한 면의 유량을 빼는 방법이 자주 쓰입니다.
` },
      { title: '스토크스 정리', body: R`
:::key 스토크스 정리
$$\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA=\oint_C\mathbf F\cdot d\mathbf r$$
:::

방향은 오른손 법칙으로 맞춥니다. 엄지를 $\mathbf n$ 방향으로 두면 나머지 손가락이 $C$의 방향입니다. 그린 정리는 평면에서의 스토크스 정리입니다. 경계 $C$가 같다면 어떤 곡면을 골라도 결과가 같으므로 가장 간단한 곡면(보통 평평한 원판)을 고르세요.

:::ex 예제 4
$\mathbf F=(y,z,x)$, $S$: $z=1-x^2-y^2\ (z\ge0)$, 위쪽 법선. $\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA$는?
---
$\operatorname{curl}\mathbf F=(-1,-1,-1)$. 경계는 단위원(반시계). 같은 경계를 가진 원판 $z=0$으로 바꾸면 $\mathbf n=\mathbf k$이므로 $-1\times\pi=-\pi$.
직접 선적분: $\mathbf r=(\cos t,\sin t,0)$에서 $\mathbf F\cdot\mathbf r'=-\sin^2t$, 적분하면 $-\pi$ ✓
:::
` },
      { title: '어떤 정리를 쓸까', body: R`
| 주어진 것 | 쓸 도구 |
|---|---|
| 평면의 닫힌 곡선 위 선적분 | 그린 정리 |
| 닫힌 곡면을 지나는 유량 | 발산 정리 |
| 경계가 있는 곡면의 회전 유량, 공간의 닫힌 곡선 위 선적분 | 스토크스 정리 |
| $\operatorname{curl}\mathbf F=\mathbf 0$ (단순연결) | 퍼텐셜로 끝점 대입 |

:::tip 시험 포인트
방향(반시계/시계, 바깥/안쪽 법선)을 먼저 확정하고 계산을 시작하세요. 부호 하나로 답이 갈리는 문제가 가장 많습니다.
:::
` },
    ],
    problems: [
      { type: 'num', lv: 1, q: R`$\mathbf F=(2x,\ 3y^2)$일 때, $(0,0)$에서 $(1,2)$까지 가는 임의의 곡선 $C$에 대한 $\int_C\mathbf F\cdot d\mathbf r$은?`, ans: '9', ansTex: R`9`,
        sol: R`$\mathbf F=\nabla(x^2+y^3)$이므로 경로에 무관하고 $f(1,2)-f(0,0)=1+8=9$.` },
      { type: 'num', lv: 2, q: R`$C$가 원 $x^2+y^2=4$일 때 $\displaystyle\int_C(x^2+y^2)\,ds$는?`, ans: '16*pi', ansTex: R`16\pi`,
        sol: R`원 위에서 $x^2+y^2=4$이고 둘레는 $4\pi$이므로 $4\cdot4\pi=16\pi$.` },
      { type: 'num', lv: 2, q: R`$\mathbf F=(-y,\ x)$를 단위원을 따라 반시계 방향으로 한 바퀴 적분한 값은?`, ans: '2*pi', ansTex: R`2\pi`,
        sol: R`$\mathbf r=(\cos t,\sin t)$, $\mathbf F\cdot\mathbf r'=\sin^2t+\cos^2t=1$이므로 $2\pi$. (그린 정리로도 $\iint2\,dA=2\pi$)` },
      { type: 'num', lv: 2, q: R`그린 정리로 $\displaystyle\oint_C(-y^3\,dx+x^3\,dy)$를 구하세요. $C$는 단위원, 반시계 방향.`, ans: '3*pi/2', ansTex: R`\tfrac{3\pi}{2}`,
        sol: R`$\iint_R(3x^2+3y^2)\,dA=3\int_0^{2\pi}\!\!\int_0^1 r^2\cdot r\,dr\,d\theta=3\cdot2\pi\cdot\tfrac14=\tfrac{3\pi}{2}$.` },
      { type: 'mc', lv: 1, q: R`닫힌 곡면을 통과하는 유량을 부피적분으로 바꾸는 정리는?`,
        choices: [R`그린 정리`, R`스토크스 정리`, R`발산 정리`, R`경로 독립 정리`], ans: 2,
        sol: R`발산 정리 $\iiint_T\operatorname{div}\mathbf F\,dV=\oiint_S\mathbf F\cdot\mathbf n\,dA$입니다.` },
      { type: 'num', lv: 2, q: R`$\mathbf F=(x^2,\ y^2,\ z^2)$가 단위정육면체 $[0,1]^3$의 표면을 바깥으로 통과하는 유량은?`, ans: '3', ansTex: R`3`,
        sol: R`$\operatorname{div}\mathbf F=2x+2y+2z$. $\iiint_{[0,1]^3}2x\,dV=1$이고 $y,z$도 같으므로 합은 3.` },
      { type: 'num', lv: 2, q: R`$\mathbf F=(0,0,z)$가 위쪽 반구면 $x^2+y^2+z^2=1,\ z\ge0$을 바깥 방향으로 통과하는 유량은?`, ans: '2*pi/3', ansTex: R`\tfrac{2\pi}{3}`,
        hint: R`바닥 원판을 더해 닫으면 발산 정리를 쓸 수 있습니다.`,
        sol: R`
반구와 바닥 원판을 합친 닫힌 곡면에서 $\operatorname{div}\mathbf F=1$이므로 총 유량은 반구의 부피 $\tfrac{2\pi}{3}$. 바닥($z=0$)에서는 $\mathbf F=\mathbf 0$이라 유량이 0이므로 반구면의 유량은 $\tfrac{2\pi}3$.
직접 계산해도 $\int_0^{2\pi}\!\!\int_0^{\pi/2}\cos^2\phi\sin\phi\,d\phi\,d\theta=2\pi\cdot\tfrac13$ ✓` },
      { type: 'open', lv: 3, q: R`$\mathbf F=(-y,\ x,\ z)$, $S$: $z=1-x^2-y^2\ (z\ge0)$, 위쪽 법선일 때 $\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA$를 구하세요.`,
        sol: R`
$\operatorname{curl}\mathbf F=(0-0,\ 0-0,\ 1-(-1))=(0,0,2)$.
스토크스 정리로 경계인 단위원(위에서 볼 때 반시계)의 선적분과 같습니다. $\mathbf r=(\cos t,\sin t,0)$이면 $\mathbf F\cdot\mathbf r'=\sin^2t+\cos^2t=1$, 적분값 $2\pi$.
(같은 경계의 원판에서 $\iint(0,0,2)\cdot\mathbf k\,dA=2\pi$로도 확인됩니다.)` },
      { type: 'mc', lv: 2, q: R`$\mathbf F=(2xy,\ x^2+2yz,\ y^2)$일 때 $(0,0,0)$에서 $(1,1,1)$까지의 선적분 $\int_C\mathbf F\cdot d\mathbf r$은?`,
        choices: [R`$1$`, R`$2$`, R`$3$`, R`경로에 따라 다르다`], ans: 1,
        sol: R`$\operatorname{curl}\mathbf F=(2y-2y,\ 0,\ 2x-2x)=\mathbf 0$이고 퍼텐셜은 $f=x^2y+y^2z$. $f(1,1,1)-f(0,0,0)=2$.` },
      { type: 'num', lv: 3, q: R`그린 정리의 넓이 공식으로 아스트로이드 $x^{2/3}+y^{2/3}=1$이 둘러싼 넓이를 구하세요.`, ans: '3*pi/8', ansTex: R`\tfrac{3\pi}{8}`,
        hint: R`$\mathbf r=(\cos^3t,\ \sin^3t)$로 매개변수화하세요.`,
        sol: R`
$x\,dy-y\,dx=\big(\cos^3t\cdot3\sin^2t\cos t+\sin^3t\cdot3\cos^2t\sin t\big)dt=3\sin^2t\cos^2t\,dt$.
$$A=\frac32\int_0^{2\pi}\sin^2t\cos^2t\,dt=\frac32\cdot\frac{\pi}{4}=\frac{3\pi}{8}$$` },
      { type: 'mc', lv: 2, q: R`극좌표로 바꿀 때 넓이 요소는?`,
        choices: [R`$dx\,dy=dr\,d\theta$`, R`$dx\,dy=r\,dr\,d\theta$`, R`$dx\,dy=r^2\,dr\,d\theta$`, R`$dx\,dy=\tfrac1r\,dr\,d\theta$`], ans: 1,
        sol: R`야코비안 $\dfrac{\partial(x,y)}{\partial(r,\theta)}=\begin{vmatrix}\cos\theta&-r\sin\theta\\ \sin\theta&r\cos\theta\end{vmatrix}=r$.` },
    ],
  }
  );
})();
