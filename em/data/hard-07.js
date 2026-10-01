/* 고난이도 문제 풀이 — Kreyszig 10판 8장(07단원) 연습문제 가운데 어려운 문제.
   문제는 교재 문제를 한국어로 옮겼고(번호는 교재 그대로), 핵심 포인트·풀이·함정은 새로 썼습니다.
   고유값·고유벡터는 perl(특성다항식 + 근 찾기)로 검산했습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.hard = EM.hard || [];
(function () {
  const R = String.raw;
  EM.hard.push({
    id: 'k8', mark: '8', title: '8장 · 고유값 문제', short: '8장',
    meta: 'Kreyszig 10판 8장 연습문제 · 10문제',
    intro: R`
8장에서 어려운 것은 큰 행렬의 고유값을 **손으로 찾는 요령**과, “고유값이 이러이러하다”를 **증명**하는 문제입니다.

:::tip 8장 어려운 문제의 도구
1. **검산 두 개**: 고유값의 합 = 대각합($\operatorname{tr}A$), 고유값의 곱 = $\det A$. 특성다항식을 구한 뒤 반드시 확인합니다.
2. **눈으로 찾는 고유값**: 모든 행의 합이 $s$로 같으면 $(1,\dots,1)^{\mathsf T}$이 고유값 $s$의 고유벡터, 블록 삼각행렬이면 대각 블록의 고유값을 모으면 됩니다.
3. **유리근 정리**: 정수 계수 특성다항식 $\lambda^n+\cdots+c_0$의 정수근은 $c_0$의 약수 중에 있습니다.
4. **고유값의 대수적 중복도 ≥ 기하적 중복도**: 중근이 나오면 고유공간의 차원을 꼭 따로 셉니다(결손, defect).
:::
`,
    problems: [
      { id: 'p1', label: '8.1 #16', title: '4×4 행렬의 고유값과 고유벡터 (결손이 있는 경우)', where: '교재 8.1 #16 · 고유값·고유벡터 · ★★★', secs: ['ch07:8.1'],
        body: R`
:::def 문제
(교재 8.1절 연습문제 16) 고유값과 고유벡터를 구하시오.
$$A=\begin{pmatrix}-3&0&4&2\\0&1&-2&4\\2&4&-1&-2\\0&2&-2&3\end{pmatrix}$$
:::

:::key 핵심 포인트
- 같은 절의 15번과 달리 인수가 주어지지 않았습니다. 먼저 **눈으로 고유값 하나**: 모든 행의 합이 $-3+0+4+2=3$, $0+1-2+4=3$, $2+4-1-2=3$, $0+2-2+3=3$으로 같으므로 $A\mathbf 1=3\mathbf 1$.
- 특성다항식은 제 1열(0이 두 개)로 전개: $\det(A-\lambda I)=\lambda^4-22\lambda^2+24\lambda+45$.
- 검산: $\lambda^3$의 계수가 0 ↔ $\operatorname{tr}A=-3+1-1+3=0$, 상수항 $45=\det A$.
- 유리근 $\lambda=3,-1$을 찾으면 $(\lambda-3)^2(\lambda+1)(\lambda+5)$. **$\lambda=3$은 중근인데 고유벡터는 하나뿐**(결손 1) → 고유기저가 없어 대각화할 수 없습니다.
:::

:::ex 풀이
특성다항식 → 인수분해 → 고유공간 순서로 풉니다.
---
**특성다항식.** $A-\lambda I$를 제 1열로 전개한다. 제 1열의 0이 아닌 성분은 $(1,1)$의 $-3-\lambda$와 $(3,1)$의 $2$뿐이므로
$$\det(A-\lambda I)=(-3-\lambda)\begin{vmatrix}1-\lambda&-2&4\\4&-1-\lambda&-2\\2&-2&3-\lambda\end{vmatrix}+2\begin{vmatrix}0&4&2\\1-\lambda&-2&4\\2&-2&3-\lambda\end{vmatrix}.$$
첫 3×3 행렬식은 $(1-\lambda)(\lambda^2-2\lambda-7)+2(16-4\lambda)+4(2\lambda-6)=-\lambda^3+3\lambda^2+5\lambda+1$, 둘째는 $-4(\lambda^2-4\lambda-5)+2(2+2\lambda)=-4\lambda^2+20\lambda+24$. 따라서
$$\det(A-\lambda I)=(-3-\lambda)(-\lambda^3+3\lambda^2+5\lambda+1)+2(-4\lambda^2+20\lambda+24)$$
$$=\lambda^4-22\lambda^2+24\lambda+45.$$
**인수분해.** 행의 합에서 $\lambda=3$이 근이고, $45$의 약수를 대입하면 $\lambda=-1$도 근이다($1-22-24+45=0$). 나누면
$$\lambda^4-22\lambda^2+24\lambda+45=(\lambda-3)(\lambda+1)(\lambda^2+2\lambda-15)=(\lambda-3)^2(\lambda+1)(\lambda+5).$$
고유값: $\lambda=3$ (대수적 중복도 2), $-1$, $-5$. (합 $3+3-1-5=0=\operatorname{tr}A$ ✓, 곱 $45=\det A$ ✓.)

**고유벡터.**
- $\lambda=3$: $A-3I=\begin{pmatrix}-6&0&4&2\\0&-2&-2&4\\2&4&-4&-2\\0&2&-2&0\end{pmatrix}$. 제 4행에서 $x_2=x_3$, 제 2행에서 $x_4=x_2$, 제 1행에서 $x_1=x_2$ (제 3행은 자동). 해공간은 $\operatorname{span}\{(1,1,1,1)\}$ — **1차원**.
- $\lambda=-1$: $A+I$에서 $x_2=x_3-2x_4$, $x_1=2x_3+x_4$, $x_3=x_4$ → $\mathbf x=(3,-1,1,1)$.
- $\lambda=-5$: $A+5I$에서 $x_1=-2x_3-x_4$, $x_2=x_3-4x_4$, $x_3=5x_4$ → $\mathbf x=(-11,1,5,1)$.

**결손.** $\lambda=3$의 대수적 중복도는 2, 기하적 중복도(고유공간의 차원)는 1이므로 결손(defect)은 1이다. 독립인 고유벡터가 $1+1+1=3$개뿐이라 $\mathbb R^4$의 고유기저가 없고, $A$는 대각화할 수 없다.

**검산.** $A(3,-1,1,1)^{\mathsf T}=(-9+4+2,\ -1-2+4,\ 6-4-1-2,\ -2-2+3)=(-3,1,-1,-1)=-1\cdot(3,-1,1,1)$ ✓. $A(-11,1,5,1)^{\mathsf T}=(55,-5,-25,-5)=-5\cdot(-11,1,5,1)$ ✓.
:::

:::warn 함정
- 4×4 특성다항식을 아무 행으로나 전개해 계산량을 늘리는 것. 0이 가장 많은 행·열을 고르세요.
- 중근 $\lambda=3$에서 “고유벡터가 두 개”라고 쓰는 것. 중복도 2는 고유벡터 2개를 **보장하지 않습니다**. 계수를 직접 세야 합니다.
- 특성다항식을 구한 뒤 대각합·행렬식 검산을 생략하는 것. 이 문제에서 $\lambda^3$항이 없는 것은 $\operatorname{tr}A=0$과 맞아야 합니다.
:::
` },
      { id: 'p2', label: '8.1 #23', title: '복소 고유값은 켤레 쌍, 역행렬의 고유값은 역수', where: '교재 8.1 #23, #24 · 고유값의 일반 성질 · ★★', secs: ['ch07:8.1'],
        body: R`
:::def 문제
(교재 8.1절 연습문제 23, 24)
(23) 실수 행렬의 고유값은 실수이거나, 복소수이면 켤레 쌍으로 나타남을 보이시오.
(24) $A^{-1}$이 존재할 필요충분조건은 고유값 $\lambda_1,\dots,\lambda_n$이 모두 0이 아닌 것이고, 그때 $A^{-1}$의 고유값은 $1/\lambda_1,\dots,1/\lambda_n$임을 보이시오.
:::

:::key 핵심 포인트
- (23) 특성다항식 $p(\lambda)=\det(A-\lambda I)$의 **계수가 실수**이므로 $p(\overline\lambda)=\overline{p(\lambda)}$. 근의 켤레도 근입니다. 고유벡터도 켤레: $A\overline{\mathbf x}=\overline{A\mathbf x}=\overline\lambda\,\overline{\mathbf x}$.
- (24) $\det A=p(0)=\lambda_1\lambda_2\cdots\lambda_n$ (중복도 포함). 그래서 “가역 $\iff\det A\ne0\iff$ 0이 고유값이 아님”.
- 역수 관계는 $A\mathbf x=\lambda\mathbf x$의 양변에 $A^{-1}$을 곱하고 $\lambda$로 나누면 바로 나오지만, “**모든** 고유값이 그 역수들뿐”까지 보이려면 특성다항식을 비교합니다.
:::

:::ex 풀이
(23)은 켤레를 취하고, (24)는 $\lambda=0$을 대입하는 것과 특성다항식의 변형입니다.
---
**(23)** $A$가 실수 $n\times n$이면 $p(\lambda)=\det(A-\lambda I)=\sum_kc_k\lambda^k$의 계수 $c_k$는 실수다. $p(\lambda_0)=0$이면
$$p(\overline{\lambda_0})=\sum_kc_k\overline{\lambda_0}^{\,k}=\overline{\sum_kc_k\lambda_0^k}=\overline{p(\lambda_0)}=0$$
이므로 $\overline{\lambda_0}$도 고유값이다. $\lambda_0$이 실수가 아니면 $\lambda_0\ne\overline{\lambda_0}$이라 둘이 쌍을 이룬다. 또 $A\mathbf x=\lambda_0\mathbf x$의 켤레를 취하면 $A$가 실수라 $A\overline{\mathbf x}=\overline{\lambda_0}\,\overline{\mathbf x}$, 곧 고유벡터도 켤레 쌍이다. (예: $\begin{pmatrix}a&b\\-b&a\end{pmatrix}$의 고유값 $a\pm ib$, 고유벡터 $(1,\pm i)^{\mathsf T}$.) $\blacksquare$

**(24)** 대수학의 기본정리로 $p(\lambda)=(\lambda_1-\lambda)(\lambda_2-\lambda)\cdots(\lambda_n-\lambda)$이므로 $\lambda=0$을 넣으면 $\det A=\lambda_1\lambda_2\cdots\lambda_n$. 따라서
$$A^{-1}\text{ 존재}\iff\det A\ne0\iff\text{모든 }\lambda_j\ne0.$$
이제 $A$가 가역이고 $\mu\ne0$이라 하자. $A^{-1}-\mu I=-\mu A^{-1}\big(A-\tfrac1\mu I\big)$이므로
$$\det(A^{-1}-\mu I)=(-\mu)^n\det(A^{-1})\det\Big(A-\frac1\mu I\Big).$$
$\det A^{-1}\ne0$이므로 $\mu$가 $A^{-1}$의 고유값 $\iff\frac1\mu$가 $A$의 고유값. ($\mu=0$은 $A^{-1}$이 가역이라 고유값이 아니다.) 곧 $A^{-1}$의 고유값은 정확히 $\frac1{\lambda_1},\dots,\frac1{\lambda_n}$이고, 고유벡터는 같다: $A\mathbf x=\lambda\mathbf x\Rightarrow\mathbf x=\lambda A^{-1}\mathbf x\Rightarrow A^{-1}\mathbf x=\frac1\lambda\mathbf x$. $\blacksquare$

**예.** $A=\begin{pmatrix}2&1\\1&2\end{pmatrix}$ (고유값 1, 3), $A^{-1}=\frac13\begin{pmatrix}2&-1\\-1&2\end{pmatrix}$ (고유값 $1$, $\frac13$) ✓.
:::

:::warn 함정
- (23)을 “실수 행렬이니 고유값도 실수”로 잘못 기억하는 것. 회전행렬 $\begin{pmatrix}0&-1\\1&0\end{pmatrix}$의 고유값은 $\pm i$입니다. 실수인 것은 **대칭**행렬의 고유값입니다.
- (24)에서 고유벡터 논법만 쓰는 것. 그것은 “$\frac1\lambda$가 고유값”만 보이고 “다른 고유값이 없다”는 보이지 않습니다.
- 복소 행렬에도 (23)을 적용하는 것. 계수가 복소수면 켤레 쌍이 아닐 수 있습니다(예: $\operatorname{diag}(i,2)$).
:::
` },
      { id: 'p3', label: '8.2 #16', title: '대각합 = 고유값의 합, 스펙트럼 사상 정리', where: '교재 8.2 #16–19, 8.4 #6 · 고유값의 일반 성질 · ★★★', secs: ['ch07:8.2', 'ch07:8.4'],
        body: R`
:::def 문제
(교재 8.2절 연습문제 16–19, 8.4절 연습문제 6(b)) $A$를 고유값 $\lambda_1,\dots,\lambda_n$(중복 허용)을 갖는 $n\times n$ 행렬이라 하자.
(16) 대각합 $\operatorname{tr}A=a_{11}+\cdots+a_{nn}$은 고유값의 합과 같다.
(19) **스펙트럼 사상 정리.** 다항식 $p(t)=k_mt^m+\cdots+k_1t+k_0$에 대해 $p(A)=k_mA^m+\cdots+k_1A+k_0I$의 고유값은 $p(\lambda_1),\dots,p(\lambda_n)$이고 고유벡터는 $A$와 같다. (17번 $A-kI$, 18번 $kA$, $A^m$은 그 특수한 경우)
(8.4 #6(b)) $\operatorname{tr}AB=\operatorname{tr}BA$를 보이고, 닮은 행렬의 대각합이 같음을 보이시오.
:::

:::key 핵심 포인트
- (16) 특성다항식의 **$\lambda^{n-1}$ 계수**를 두 가지로 계산해 비교합니다. 행렬식의 전개에서 $\lambda^{n-1}$은 대각성분의 곱 $\prod(a_{jj}-\lambda)$에서만 나옵니다.
- (19) 고유벡터 쪽은 쉽습니다: $A\mathbf x=\lambda\mathbf x\Rightarrow A^k\mathbf x=\lambda^k\mathbf x\Rightarrow p(A)\mathbf x=p(\lambda)\mathbf x$. “**그것들뿐**”을 보이려면 $p(t)-\mu$를 인수분해합니다.
- (6b) $\operatorname{tr}AB=\sum_i\sum_la_{il}b_{li}$은 $A$와 $B$에 대해 대칭인 식. 그러면 $\operatorname{tr}(P^{-1}AP)=\operatorname{tr}(APP^{-1})=\operatorname{tr}A$.
:::

:::ex 풀이
세 주장을 차례로 증명하고 작은 예로 확인합니다.
---
**(16)** $\det(A-\lambda I)=\sum_\sigma\operatorname{sgn}\sigma\prod_j(A-\lambda I)_{j\sigma(j)}$에서 항등치환이 아닌 $\sigma$는 적어도 두 개의 $j$에서 $\sigma(j)\ne j$이므로 그 항에는 $\lambda$가 많아야 $n-2$번 곱해진다. 따라서 $\lambda^n$, $\lambda^{n-1}$항은 $\prod_j(a_{jj}-\lambda)$에서만 나오고
$$\det(A-\lambda I)=(-1)^n\lambda^n+(-1)^{n-1}(a_{11}+\cdots+a_{nn})\lambda^{n-1}+\cdots.$$
한편 $\det(A-\lambda I)=\prod_j(\lambda_j-\lambda)=(-1)^n\lambda^n+(-1)^{n-1}(\lambda_1+\cdots+\lambda_n)\lambda^{n-1}+\cdots$. 계수를 비교하면 $\operatorname{tr}A=\lambda_1+\cdots+\lambda_n$. $\blacksquare$

**(19)** ① $A\mathbf x=\lambda\mathbf x$이면 귀납적으로 $A^k\mathbf x=\lambda^k\mathbf x$이고 일차결합을 취하면 $p(A)\mathbf x=p(\lambda)\mathbf x$. 곧 $p(\lambda_j)$는 $p(A)$의 고유값이고 고유벡터는 그대로다.
② 거꾸로 $\mu$가 $p(A)$의 고유값이라 하자($m\ge1$, $k_m\ne0$). $p(t)-\mu=k_m(t-r_1)\cdots(t-r_m)$으로 인수분해하면 같은 인수분해가 행렬에도 성립해(거듭제곱끼리는 교환 가능)
$$p(A)-\mu I=k_m(A-r_1I)\cdots(A-r_mI),$$
$$0=\det(p(A)-\mu I)=k_m^n\prod_i\det(A-r_iI).$$
따라서 어떤 $r_i$가 $A$의 고유값 $\lambda_j$이고, $p(\lambda_j)=p(r_i)=\mu$. 곧 $p(A)$의 고유값은 $p(\lambda_j)$ 꼴뿐이다. (중복도까지 같다는 것은 $A$를 삼각행렬로 닮게 만들면 보인다.) $\blacksquare$
17번은 $p(t)=t-k$, 18번은 $p(t)=kt$와 $p(t)=t^m$.

**(6b)** $(AB)_{ii}=\sum_la_{il}b_{li}$이므로
$$\operatorname{tr}AB=\sum_{i}\sum_{l}a_{il}b_{li}=\sum_l\sum_ib_{li}a_{il}=\sum_l(BA)_{ll}=\operatorname{tr}BA.$$
$\hat A=P^{-1}AP$이면 $\operatorname{tr}\hat A=\operatorname{tr}\big(P^{-1}(AP)\big)=\operatorname{tr}\big((AP)P^{-1}\big)=\operatorname{tr}A$. $\blacksquare$

**예.** $A=\begin{pmatrix}2&1\\1&2\end{pmatrix}$의 고유값은 1, 3 ($\operatorname{tr}=4$ ✓). $p(t)=t^2+1$이면 $p(A)=A^2+I=\begin{pmatrix}6&4\\4&6\end{pmatrix}$, 고유값 $6\pm4=10,2$이고 $p(3)=10$, $p(1)=2$ ✓. $p(t)=t^2-4t+3=(t-1)(t-3)$이면 $p(1)=p(3)=0$이라 $p(A)$의 고유값은 모두 0인데, 실제로 $p(A)=0$이다(케일리-해밀턴 정리의 한 예).
:::

:::warn 함정
- (16)을 “닮은 대각행렬의 대각합”으로 증명하는 것. 대각화할 수 없는 행렬(예: 8.1 #16)도 있으니 특성다항식으로 보여야 합니다.
- (19)에서 고유벡터 논법(①)만 쓰는 것. “다른 고유값은 없다”(②)가 빠집니다.
- $\operatorname{tr}ABC=\operatorname{tr}BAC$처럼 아무 순서로나 바꾸는 것. 허용되는 것은 **순환** 이동($\operatorname{tr}ABC=\operatorname{tr}BCA=\operatorname{tr}CAB$)뿐입니다.
:::
` },
      { id: 'p4', label: '8.2 #20', title: '페론 정리: 레슬리 행렬은 양의 고유값을 갖는다', where: '교재 8.2 #20 · 고유값의 응용 · ★★★', secs: ['ch07:8.2'],
        body: R`
:::def 문제
(교재 8.2절 연습문제 20) $l_{12},l_{13},l_{21},l_{32}\gt0$인 레슬리 행렬
$$L=\begin{pmatrix}0&l_{12}&l_{13}\\l_{21}&0&0\\0&l_{32}&0\end{pmatrix}$$
은 양의 고유값을 가짐을 보이시오. (페론-프로베니우스 정리의 특수한 경우)
:::

:::key 핵심 포인트
- 특성방정식을 직접 구하면 $\lambda^3-l_{12}l_{21}\lambda-l_{13}l_{21}l_{32}=0$.
- $f(\lambda)=\lambda^3-a\lambda-b$ ($a,b\gt0$)에서 $f(0)=-b\lt0$, $\lambda\to\infty$이면 $f\to\infty$ → **중간값 정리**로 양의 근이 있습니다.
- 데카르트의 부호 규칙(부호 변화 1번)으로 양의 근은 **정확히 하나**이고, 그 고유벡터 $(\lambda^2,\ l_{21}\lambda,\ l_{21}l_{32})^{\mathsf T}$는 성분이 모두 양수 — 인구 비율로 해석할 수 있는 “성장률”입니다.
:::

:::ex 풀이
특성다항식, 중간값 정리, 고유벡터 순서로 풉니다.
---
**특성방정식.** 제 1행으로 전개하면
$$\det(L-\lambda I)=\begin{vmatrix}-\lambda&l_{12}&l_{13}\\l_{21}&-\lambda&0\\0&l_{32}&-\lambda\end{vmatrix}=-\lambda\cdot\lambda^2-l_{12}(-l_{21}\lambda)+l_{13}\,l_{21}l_{32}$$
$$=-\lambda^3+l_{12}l_{21}\lambda+l_{13}l_{21}l_{32}.$$
$a=l_{12}l_{21}\gt0$, $b=l_{13}l_{21}l_{32}\gt0$이라 하면 고유값은 $f(\lambda)=\lambda^3-a\lambda-b=0$의 근이다.

**양의 근의 존재.** $f$는 연속이고 $f(0)=-b\lt0$, $f(\lambda)\ge\lambda^3-a\lambda-b\to\infty$ ($\lambda\to\infty$)이므로 중간값 정리에 의해 $f(\lambda_+)=0$인 $\lambda_+\gt0$이 있다. $\blacksquare$

**유일성.** $f$의 계수의 부호는 $+,-,-$로 한 번 바뀌므로 양의 근은 정확히 하나다(데카르트 규칙). 미분으로도: $\lambda\gt0$에서 $f'(\lambda)=3\lambda^2-a$이므로 $f$는 $(0,\sqrt{a/3})$에서 감소, 그 뒤 증가한다. $f(0)\lt0$이므로 감소 구간에서는 음수로 머물고, 증가 구간에서 0을 한 번만 지난다.

**양의 고유벡터.** $L\mathbf x=\lambda_+\mathbf x$의 제 2, 3식은 $l_{21}x_1=\lambda_+x_2$, $l_{32}x_2=\lambda_+x_3$이므로 $x_1=\lambda_+^2$로 두면
$$\mathbf x=\big(\lambda_+^2,\ l_{21}\lambda_+,\ l_{21}l_{32}\big)^{\mathsf T}$$
이고 성분이 모두 양수다. (제 1식은 $l_{12}x_2+l_{13}x_3=\lambda_+x_1$, 곧 $f(\lambda_+)=0$과 같다.)

**예 (교재 8.2 예제 3).** $l_{12}=2.3$, $l_{13}=0.4$, $l_{21}=0.6$, $l_{32}=0.3$이면 $f(\lambda)=\lambda^3-1.38\lambda-0.072$이고 $f(1.2)=1.728-1.656-0.072=0$. 성장률 1.2, 곧 한 주기마다 인구가 20% 늘고, 나이별 비율은 $\mathbf x=(1.44,\ 0.72,\ 0.18)\propto(8,4,1)$로 수렴한다.
:::

:::warn 함정
- 특성방정식을 3×3 사루스 규칙으로 구하다 부호를 틀리는 것. 0이 많은 행으로 전개하세요.
- “3차방정식은 실근이 하나 있다”만 쓰는 것. 그 실근이 **양수**라는 것이 핵심이고, 그것은 $f(0)\lt0$에서 나옵니다.
- 양의 고유값을 찾고 고유벡터의 부호를 확인하지 않는 것. 인구 모형에서는 고유벡터가 음이 아닌 비율이어야 의미가 있습니다.
:::
` },
      { id: 'p5', label: '8.2 #13', title: '레온티예프 투입-산출 모형: 균형 가격 구하기', where: '교재 8.2 #13, #14 · 고유값의 응용 · ★★', secs: ['ch07:8.2'],
        body: R`
:::def 문제
(교재 8.2절 연습문제 13, 14) 세 산업이 서로의 산출물을 소비 행렬
$$A=\begin{pmatrix}0.1&0.5&0\\0.8&0&0.4\\0.1&0.5&0.6\end{pmatrix}$$
에 따라 쓴다고 하자. $a_{jk}$는 산업 $k$의 산출 중 산업 $j$가 소비하는 비율이고, $p_j$는 산업 $j$가 전체 산출에 매기는 가격이다.
(13) 각 산업의 총지출이 총수입과 같아지는 가격은 $A\mathbf p=\mathbf p$를 만족함을 보이고, 성분이 음이 아닌 해 $\mathbf p$를 구하시오.
(14) 이런 소비 행렬은 열의 합이 1이어야 하고, 항상 고유값 1을 가짐을 보이시오.
:::

:::key 핵심 포인트
- 산업 $j$의 지출은 $\sum_ka_{jk}p_k$(산업 $k$의 산출 중 자기 몫 × 그 가격), 수입은 $p_j$ → $A\mathbf p=\mathbf p$. 곧 **고유값 1의 고유벡터**.
- (14) 산업 $k$의 산출은 남김없이 누군가가 소비하므로 $\sum_ja_{jk}=1$(열의 합이 1). 그러면 $A^{\mathsf T}\mathbf 1=\mathbf 1$이고, $A$와 $A^{\mathsf T}$는 특성다항식이 같으므로 $A$도 고유값 1.
- 풀이는 $(A-I)\mathbf p=\mathbf0$을 소거로. 답은 상수배 자유 → 한 성분을 정해 정규화.
:::

:::ex 풀이
모형을 식으로 옮긴 뒤 연립방정식을 풉니다.
---
**(13) 식 세우기.** 산업 $j$는 산업 $k$의 산출 중 비율 $a_{jk}$를 사고, 그 값은 $a_{jk}p_k$다. 따라서 지출 $=\sum_ka_{jk}p_k=(A\mathbf p)_j$, 수입 $=p_j$이고 균형 조건은 $A\mathbf p=\mathbf p$, 곧 $(A-I)\mathbf p=\mathbf 0$.
$$A-I=\begin{pmatrix}-0.9&0.5&0\\0.8&-1&0.4\\0.1&0.5&-0.4\end{pmatrix}$$
제 1행에서 $p_2=1.8p_1$. 제 3행에서 $0.1p_1+0.9p_1-0.4p_3=0$, 곧 $p_3=2.5p_1$. 제 2행은 $0.8p_1-1.8p_1+1.0p_1=0$으로 자동 성립(행들이 종속이라 해가 있다). 따라서
$$\mathbf p=t\,(1,\ 1.8,\ 2.5)^{\mathsf T}=\frac t{10}(10,\ 18,\ 25)^{\mathsf T}\qquad(t\gt0)$$
이고 모든 성분이 양수다. 예를 들어 $\mathbf p=(10,18,25)$.

**검산.** $A\mathbf p=(1+9+0,\ 8+0+10,\ 1+9+15)=(10,18,25)$ ✓.

**(14)** 산업 $k$의 산출은 세 산업이 모두 나누어 쓰므로 $a_{1k}+a_{2k}+a_{3k}=1$(이 행렬의 열의 합: $0.1+0.8+0.1$, $0.5+0+0.5$, $0+0.4+0.6$ 모두 1 ✓). 일반적으로 열의 합이 모두 1이면 $\mathbf 1=(1,\dots,1)^{\mathsf T}$에 대해 $A^{\mathsf T}\mathbf 1=\mathbf 1$, 곧 1은 $A^{\mathsf T}$의 고유값이다. $\det(A^{\mathsf T}-\lambda I)=\det\big((A-\lambda I)^{\mathsf T}\big)=\det(A-\lambda I)$이므로 1은 $A$의 고유값이기도 하다. $\blacksquare$

**참고.** 이 행렬의 고유값은 $1$, $0.3623$, $-0.6623$으로 1이 가장 큽니다(합 $0.7=\operatorname{tr}A$ ✓). 성분이 음이 아니고 열의 합이 1인 행렬(확률 행렬)은 절댓값이 1보다 큰 고유값을 갖지 않습니다.
:::

:::warn 함정
- $A$를 전치해 $A^{\mathsf T}\mathbf p=\mathbf p$로 세우는 것. $a_{jk}$의 뜻(“산업 $j$가 산업 $k$에게서”)을 문장으로 확인하세요.
- (14)에서 “$A\mathbf 1=\mathbf 1$”이라고 쓰는 것. 그것은 **행**의 합이 1일 때입니다. 열의 합이 1이면 $A^{\mathsf T}\mathbf 1=\mathbf 1$.
- 답을 $\mathbf p=(1,1.8,2.5)$ 하나로만 쓰고 상수배 자유를 언급하지 않는 것. 가격은 비율만 정해집니다.
:::
` },
      { id: 'p6', label: '8.3 #7', title: '3×3 반대칭행렬: 고유값 0, ±25i와 홀수 차원의 특이성', where: '교재 8.3 #7, #18, #19 · 반대칭·직교 행렬 · ★★★', secs: ['ch07:8.3', 'ch07:8.1'],
        body: R`
:::def 문제
(교재 8.3절 연습문제 7, 18, 19)
(7) 다음 행렬이 대칭·반대칭·직교 중 무엇인지 판정하고 스펙트럼(고유값)을 구하시오.
$$A=\begin{pmatrix}0&9&-12\\-9&0&20\\12&-20&0\end{pmatrix}$$
(18) $n$이 홀수인 정칙(가역) $n\times n$ 반대칭행렬이 존재하는가?
(19) 반대칭이면서 직교인 $3\times3$ 행렬이 존재하는가?
:::

:::key 핵심 포인트
- 3×3 반대칭행렬은 벡터 $\boldsymbol\omega$와의 **외적** $A\mathbf x=\boldsymbol\omega\times\mathbf x$로 쓸 수 있습니다. 여기서 $\boldsymbol\omega=-(20,12,9)$, $\lvert\boldsymbol\omega\rvert=\sqrt{400+144+81}=25$.
- 특성다항식 $-\lambda\big(\lambda^2+(9^2+12^2+20^2)\big)=-\lambda(\lambda^2+625)$ → $\lambda=0,\pm25i$. 반대칭 실행렬의 고유값은 0 또는 순허수(교재 8.3 Theorem 1).
- (18) $\det A=\det A^{\mathsf T}=\det(-A)=(-1)^n\det A$ → $n$이 홀수면 $\det A=0$. **없다.**
- (19) 직교행렬은 $\det=\pm1\ne0$인데 (18)에 의해 3×3 반대칭은 특이 → **없다.** ($n=2$에서는 $\begin{pmatrix}0&1\\-1&0\end{pmatrix}$이 둘 다)
:::

:::ex 풀이
(7)을 계산하고 (18), (19)를 행렬식으로 증명합니다.
---
**(7) 종류.** $A^{\mathsf T}=-A$이므로 반대칭이다. 대칭이 아니고, 행벡터의 길이가 $\sqrt{81+144}=15\ne1$이라 직교도 아니다.

**고유값.** $a=9$, $b=-12$, $c=20$이라 쓰면 $A=\begin{pmatrix}0&a&b\\-a&0&c\\-b&-c&0\end{pmatrix}$이고
$$\det(A-\lambda I)=-\lambda(\lambda^2+c^2)-a(a\lambda+bc)+b(ac-b\lambda)$$
$$=-\lambda^3-(a^2+b^2+c^2)\lambda=-\lambda(\lambda^2+625).$$
따라서 스펙트럼은 $\{0,\ 25i,\ -25i\}$. (합 $0=\operatorname{tr}A$ ✓, 곱 $0=\det A$ ✓.)

**고유벡터.**
- $\lambda=0$: $A\mathbf x=\mathbf 0$의 해는 $\mathbf x=(20,12,9)$ (제 1행 $108-108=0$, 제 2행 $-180+180=0$, 제 3행 $240-240=0$ ✓). 이것이 회전축이다.
- $\lambda=25i$: $A-25iI$의 첫 두 행 $(-25i,9,-12)$, $(-9,-25i,20)$에 모두 “수직”(켤레 없는 곱이 0)인 벡터는 두 행의 외적이다.
$$(-25i,9,-12)\times(-9,-25i,20)=(180-300i,\ 108+500i,\ -544)$$
$$\parallel\ (45-75i,\ 27+125i,\ -136).$$
- $\lambda=-25i$: 켤레 $(45+75i,\ 27-125i,\ -136)$.

**해석.** 고유벡터의 실수부 $(45,27,-136)$과 허수부 $(-75,125,0)$은 모두 축 $(20,12,9)$에 수직이다. $\dot{\mathbf x}=A\mathbf x$의 해는 축 둘레를 각속도 25로 도는 회전이다.

**(18)** 반대칭이면 $A^{\mathsf T}=-A$이고 $\det A^{\mathsf T}=\det A$, $\det(-A)=(-1)^n\det A$이므로
$$\det A=(-1)^n\det A.$$
$n$이 홀수면 $\det A=-\det A$, 곧 $\det A=0$. 따라서 홀수 차원의 반대칭행렬은 모두 특이하고, **정칙인 것은 없다.** $\blacksquare$

**(19)** 직교행렬 $Q$는 $Q^{\mathsf T}Q=I$에서 $(\det Q)^2=1$, 곧 $\det Q=\pm1$. 3×3 반대칭행렬은 (18)에 의해 $\det=0$이므로 직교일 수 없다. **존재하지 않는다.** $\blacksquare$
:::

:::warn 함정
- 반대칭행렬의 고유값을 실수로 구하려다 “고유값이 0 하나뿐”이라고 쓰는 것. $\lambda^2+625=0$의 근 $\pm25i$도 고유값입니다(복소 고유값).
- 복소 고유벡터를 구할 때 켤레를 취한 내적을 쓰는 것. $(A-\lambda I)\mathbf x=\mathbf 0$은 각 행과 $\mathbf x$의 **켤레 없는** 곱이 0이라는 뜻입니다.
- (18)을 $n=3$ 예 하나로 끝내는 것. $\det A=(-1)^n\det A$ 한 줄이 모든 홀수 $n$을 처리합니다.
:::
` },
      { id: 'p7', label: '8.3 #20', title: '대각행렬이 아닌 대칭 직교 3×3 행렬', where: '교재 8.3 #20 · 대칭·직교 행렬 · ★★', secs: ['ch07:8.3', 'ch07:8.4'],
        body: R`
:::def 문제
(교재 8.3절 연습문제 20) 대각행렬이 아니면서 대칭이고 직교인 $3\times3$ 행렬이 존재하는가?
:::

:::key 핵심 포인트
- 대칭이고 직교이면 $A^2=A^{\mathsf T}A=I$. 곧 **자기 자신이 역행렬**인 행렬, 고유값은 $\pm1$뿐.
- 대칭행렬은 직교 대각화되므로 $A=Q\operatorname{diag}(\pm1,\pm1,\pm1)Q^{\mathsf T}$ — 어떤 부분공간에 대한 **거울 반사**입니다. 고유벡터가 좌표축과 다르면 대각행렬이 아닙니다.
- 구체적인 예: 하우스홀더 반사 $H=I-2\mathbf u\mathbf u^{\mathsf T}$ ($\lvert\mathbf u\rvert=1$), 또는 두 좌표를 맞바꾸는 치환행렬.
:::

:::ex 풀이
예를 만들고, 그런 행렬이 모두 어떤 꼴인지까지 정리합니다.
---
**답: 존재한다.**

**예 1 (치환).** $x_1$과 $x_3$을 맞바꾸는 행렬
$$A=\begin{pmatrix}0&0&1\\0&1&0\\1&0&0\end{pmatrix}$$
은 $A^{\mathsf T}=A$이고 열들이 정규직교라 직교행렬이다. 대각행렬이 아니다. 평면 $x_1=x_3$에 대한 반사다.

**예 2 (하우스홀더 반사).** 단위벡터 $\mathbf u$에 대해 $H=I-2\mathbf u\mathbf u^{\mathsf T}$이면
- 대칭: $(\mathbf u\mathbf u^{\mathsf T})^{\mathsf T}=\mathbf u\mathbf u^{\mathsf T}$.
- 직교: $H^{\mathsf T}H=H^2=I-4\mathbf u\mathbf u^{\mathsf T}+4\mathbf u(\mathbf u^{\mathsf T}\mathbf u)\mathbf u^{\mathsf T}=I$ ($\mathbf u^{\mathsf T}\mathbf u=1$).

$\mathbf u=\frac1{\sqrt3}(1,1,1)$이면 $\mathbf u\mathbf u^{\mathsf T}=\frac13J$이고
$$H=I-\frac23J=\frac13\begin{pmatrix}1&-2&-2\\-2&1&-2\\-2&-2&1\end{pmatrix}.$$
(검산: 행의 길이 $\frac19(1+4+4)=1$, 서로 다른 두 행의 곱 $\frac19(-2-2+4)=0$ ✓.) 이것은 $\mathbf u$에 수직인 평면에 대한 거울 반사다: $H\mathbf u=-\mathbf u$, $\mathbf u\perp\mathbf v$이면 $H\mathbf v=\mathbf v$.

**모든 해의 꼴.** $A$가 대칭이고 직교이면 $A^2=A^{\mathsf T}A=I$이므로 고유값 $\lambda$는 $\lambda^2=1$, 곧 $\pm1$. 대칭행렬은 정규직교 고유기저를 가지므로(교재 8.4 Theorem 2) $A=Q\,\operatorname{diag}(\pm1,\pm1,\pm1)\,Q^{\mathsf T}$ ($Q$ 직교). 거꾸로 이 꼴은 모두 대칭이고 직교다. 고유값이 모두 $+1$이면 $A=I$, 모두 $-1$이면 $A=-I$로 대각이고, $+1$과 $-1$이 섞여 있고 고유벡터가 좌표축 방향이 아니면 대각이 아니다.
:::

:::warn 함정
- “대칭이고 직교면 $A=A^{-1}$이니 $A=\pm I$뿐”이라고 결론 내는 것. $A^2=I$를 만족하는 행렬은 반사가 모두 해당합니다.
- 회전행렬을 예로 드는 것. 회전($\det=+1$, 각도 $\ne0,\pi$)은 대칭이 아닙니다. 반사나 180° 회전이어야 $A^2=I$.
- 예를 들고 직교성 검산(열의 정규직교)을 생략하는 것.
:::
` },
      { id: 'p8', label: '8.4 #14', title: '3×3 행렬의 대각화: 고유기저와 X⁻¹AX', where: '교재 8.4 #14 · 대각화 · ★★', secs: ['ch07:8.4'],
        body: R`
:::def 문제
(교재 8.4절 연습문제 14) 고유기저를 구하고 대각화하시오. ($\lambda_1=-2$가 주어짐)
$$A=\begin{pmatrix}-5&-6&6\\-9&-8&12\\-12&-12&16\end{pmatrix}$$
:::

:::key 핵심 포인트
- 특성다항식 $\det(A-\lambda I)=-(\lambda^3-3\lambda^2-6\lambda+8)$. $\lambda=-2$로 나누면 $\lambda^2-5\lambda+4=(\lambda-1)(\lambda-4)$.
- 고유값이 서로 다른 세 개이므로 고유벡터 셋이 자동으로 독립(교재 8.4 Theorem 1) → 고유기저 존재.
- $X=[\mathbf x_1\ \mathbf x_2\ \mathbf x_3]$로 두면 $X^{-1}AX=\operatorname{diag}(-2,1,4)$. $X^{-1}$을 실제로 구해 곱해 보는 것이 최고의 검산입니다.
:::

:::ex 풀이
고유값 → 고유벡터 → $X$, $X^{-1}$ → 대각화 확인.
---
**고유값.** $\operatorname{tr}A=3$, $\det A=-8$이고 특성다항식은 $-(\lambda^3-3\lambda^2-6\lambda+8)=-(\lambda+2)(\lambda^2-5\lambda+4)=-(\lambda+2)(\lambda-1)(\lambda-4)$. 고유값 $-2,1,4$ (합 3 ✓, 곱 $-8$ ✓).

**고유벡터.**
- $\lambda=-2$: $A+2I=\begin{pmatrix}-3&-6&6\\-9&-6&12\\-12&-12&18\end{pmatrix}$. 첫 두 행을 $-3$으로 나누면 $x_1+2x_2-2x_3=0$, $3x_1+2x_2-4x_3=0$이고 빼면 $x_1=x_3$, $x_2=\frac{x_1}2$ → $\mathbf x_1=(2,1,2)$.
- $\lambda=1$: $A-I$의 제 1행에서 $x_1+x_2-x_3=0$, 제 2행 $-9(x_1+x_2)+12x_3=3x_3=0$ → $x_3=0$, $\mathbf x_2=(1,-1,0)$.
- $\lambda=4$: $A-4I$의 제 3행에서 $x_1+x_2-x_3=0$, 제 1행에서 $3x_1+2(x_2-x_3)=x_1=0$ → $\mathbf x_3=(0,1,1)$.

**대각화.**
$$X=\begin{pmatrix}2&1&0\\1&-1&1\\2&0&1\end{pmatrix},\qquad\det X=-1,\qquad X^{-1}=\begin{pmatrix}1&1&-1\\-1&-2&2\\-2&-2&3\end{pmatrix}.$$
$AX=[-2\mathbf x_1\ \ \mathbf x_2\ \ 4\mathbf x_3]=\begin{pmatrix}-4&1&0\\-2&-1&4\\-4&0&4\end{pmatrix}$이고
$$X^{-1}AX=\begin{pmatrix}1&1&-1\\-1&-2&2\\-2&-2&3\end{pmatrix}\begin{pmatrix}-4&1&0\\-2&-1&4\\-4&0&4\end{pmatrix}=\begin{pmatrix}-2&0&0\\0&1&0\\0&0&4\end{pmatrix}.$$
(예: (1,1) 성분 $-4-2+4=-2$, (2,2) 성분 $-1+2+0=1$, (3,3) 성분 $0-8+12=4$, (1,2) 성분 $1-1+0=0$ ✓.)
:::

:::warn 함정
- $X$의 열 순서와 $D$의 대각 순서를 다르게 쓰는 것. $X$의 제 $k$열이 $\lambda_k$의 고유벡터여야 $D=\operatorname{diag}(\lambda_1,\lambda_2,\lambda_3)$.
- $X^{-1}AX$ 대신 $XAX^{-1}$을 계산하는 것. 고유벡터를 **열**로 둔 $X$에서는 $X^{-1}AX$가 대각입니다.
- 주어진 $\lambda_1=-2$를 쓰지 않고 3차방정식을 처음부터 푸는 것. 조립제법으로 한 번 나누면 2차식이 됩니다.
:::
` },
      { id: 'p9', label: '8.4 #23', title: '이차형식의 주축 변환과 정부호 판정', where: '교재 8.4 #22–25 · 이차형식 · ★★★', secs: ['ch07:8.4'],
        body: R`
:::def 문제
(교재 8.4절 연습문제 23–25)
(23) $-11x_1^2+84x_1x_2+24x_2^2=156$은 어떤 원뿔곡선인가? 주축으로 변환하고 $\mathbf x$를 새 좌표 $\mathbf y$로 나타내시오.
(24) 대칭행렬 $A$의 이차형식 $Q(\mathbf x)=\mathbf x^{\mathsf T}A\mathbf x$가 양의 정부호·음의 정부호·부정부호일 필요충분조건은 $A$의 고유값이 각각 모두 양수·모두 음수·양수와 음수를 모두 가지는 것임을 보이시오.
(25) 주소행렬식이 모두 양수이면 양의 정부호라는 판정법으로, 22번 $4x_1^2+12x_1x_2+13x_2^2=16$의 형식은 양의 정부호이고 23번은 부정부호임을 보이시오.
:::

:::key 핵심 포인트
- 형식의 행렬은 **대칭**으로: $84x_1x_2$는 $a_{12}=a_{21}=42$로 나눕니다. $A=\begin{pmatrix}-11&42\\42&24\end{pmatrix}$.
- 고유값 $\lambda^2-13\lambda-2028=0$ → $52,\ -39$ (곱 $\det A=-2028\lt0$이라 부호가 반대 → 쌍곡선).
- 주축 정리: 정규직교 고유벡터를 열로 한 $X$로 $\mathbf x=X\mathbf y$이면 $Q=\lambda_1y_1^2+\lambda_2y_2^2$. (24)는 이 식 하나로 증명됩니다.
- (25) 2×2에서는 완전제곱으로 판정법을 직접 증명할 수 있습니다.
:::

:::ex 풀이
(23)을 풀고, 그 과정의 식으로 (24), (25)를 증명합니다.
---
**(23)** $A=\begin{pmatrix}-11&42\\42&24\end{pmatrix}$의 특성방정식은 $\lambda^2-13\lambda+(-264-1764)=\lambda^2-13\lambda-2028=0$이고
$$\lambda=\frac{13\pm\sqrt{169+8112}}2=\frac{13\pm91}2=52,\ -39.$$
고유벡터: $\lambda=52$이면 $-63x_1+42x_2=0$에서 $(2,3)$, $\lambda=-39$이면 $28x_1+42x_2=0$에서 $(-3,2)$. 정규화하여
$$X=\frac1{\sqrt{13}}\begin{pmatrix}2&-3\\3&2\end{pmatrix},\qquad\mathbf x=X\mathbf y:\quad x_1=\frac{2y_1-3y_2}{\sqrt{13}},\quad x_2=\frac{3y_1+2y_2}{\sqrt{13}}.$$
그러면 $Q=52y_1^2-39y_2^2=156$, 곧
$$\frac{y_1^2}{3}-\frac{y_2^2}{4}=1$$
로 **쌍곡선**이다. $X$는 각 $\arctan\frac32\approx56.3^\circ$의 회전이고, 꼭짓점은 $y_1$축 위 $y_1=\pm\sqrt3$.

**(24)** 대칭행렬은 직교행렬 $X$로 $X^{\mathsf T}AX=D=\operatorname{diag}(\lambda_1,\dots,\lambda_n)$이 된다. $\mathbf x=X\mathbf y$로 두면 $X$가 가역이므로 $\mathbf x\ne\mathbf 0\iff\mathbf y\ne\mathbf 0$이고
$$Q(\mathbf x)=\mathbf y^{\mathsf T}X^{\mathsf T}AX\mathbf y=\lambda_1y_1^2+\cdots+\lambda_ny_n^2.$$
- 모든 $\lambda_j\gt0$이면 $\mathbf y\ne\mathbf0$일 때 $Q\gt0$. 거꾸로 어떤 $\lambda_k\le0$이면 $\mathbf y=\mathbf e_k$에서 $Q=\lambda_k\le0$이라 양의 정부호가 아니다.
- 음의 정부호도 같은 방식.
- 양·음 고유값 $\lambda_k\gt0\gt\lambda_l$이 있으면 $\mathbf y=\mathbf e_k$, $\mathbf e_l$에서 $Q$가 양수와 음수를 모두 가진다. 거꾸로 $Q$가 양수와 음수를 모두 가지면 위 식에서 양의 $\lambda$와 음의 $\lambda$가 모두 있어야 한다. $\blacksquare$

**(25)** 2×2에서 $a_{11}\ne0$이면 완전제곱으로
$$Q=a_{11}x_1^2+2a_{12}x_1x_2+a_{22}x_2^2=a_{11}\Big(x_1+\frac{a_{12}}{a_{11}}x_2\Big)^2+\frac{\det A}{a_{11}}x_2^2.$$
$a_{11}\gt0$, $\det A\gt0$이면 두 항이 모두 음이 아니고 동시에 0이려면 $x_2=0$, $x_1=0$이므로 양의 정부호다.
- 22번: $A=\begin{pmatrix}4&6\\6&13\end{pmatrix}$, $a_{11}=4\gt0$, $\det A=52-36=16\gt0$ → **양의 정부호**(타원; 고유값 1, 16이라 $\frac{y_1^2}{16}+y_2^2=1$).
- 23번: $a_{11}=-11\lt0$이라 양의 정부호가 아니고, $\det A=\lambda_1\lambda_2=-2028\lt0$이라 고유값의 부호가 반대 → **부정부호**.
:::

:::warn 함정
- 교차항을 $a_{12}=84$로 두는 것. 대칭행렬에서는 $2a_{12}x_1x_2=84x_1x_2$라 $a_{12}=42$입니다.
- 고유벡터를 정규화하지 않은 $X$로 변환해 계수가 $13$배로 커지는 것. 주축 변환은 **직교**행렬이어야 합니다.
- (25)에서 $a_{11}\lt0$만 보고 “음의 정부호”라고 하는 것. 음의 정부호는 주소행렬식의 부호가 $-,+,-,\dots$로 번갈아야 합니다. 여기서는 $\det A\lt0$이라 부정부호.
:::

:::fig fhdhyper
:::
` },
      { id: 'p10', label: '8.5 #19', title: '정규행렬: 에르미트·반에르미트 분해와 정규성 판정', where: '교재 8.5 #15, #18, #19, #20 · 복소 행렬 · ★★★', secs: ['ch07:8.5'],
        body: R`
:::def 문제
(교재 8.5절 연습문제 15, 18–20) $A^*=\overline A^{\mathsf T}$로 쓴다.
(15) 모든 정사각행렬은 에르미트 행렬과 반에르미트 행렬의 합으로 쓸 수 있음을 보이시오.
(18) $AA^*=A^*A$인 행렬을 **정규행렬**이라 한다. 에르미트·반에르미트·유니터리 행렬은 정규임을 보이시오.
(19) $A$가 정규일 필요충분조건은 (15)의 에르미트 부분과 반에르미트 부분이 교환 가능한 것임을 보이시오.
(20) 정규가 아닌 간단한 행렬, 그리고 정규이지만 에르미트·반에르미트·유니터리 어느 것도 아닌 행렬을 찾으시오.
:::

:::key 핵심 포인트
- (15) $H=\frac12(A+A^*)$, $S=\frac12(A-A^*)$. 수의 “실수부 + 허수부”와 같은 분해입니다.
- (18) $A^*$가 $A$, $-A$, $A^{-1}$ 중 하나이면 당연히 $A$와 교환됩니다.
- (19) $A=H+S$, $A^*=H-S$를 곱하면 $AA^*-A^*A=2(SH-HS)$.
- (20) 정규가 아닌 예는 $\begin{pmatrix}0&1\\0&0\end{pmatrix}$. 정규이지만 세 종류가 아닌 예는 $\operatorname{diag}(1,2i)$ 또는 $\begin{pmatrix}1&-1\\1&1\end{pmatrix}$ ($\sqrt2$배 회전).
:::

:::ex 풀이
분해를 만들고, 곱을 전개해 판정법을 얻습니다.
---
**(15)** $H=\frac12(A+A^*)$, $S=\frac12(A-A^*)$로 두면 $(A^*)^*=A$이므로 $H^*=\frac12(A^*+A)=H$ (에르미트), $S^*=\frac12(A^*-A)=-S$ (반에르미트)이고 $H+S=A$. 이 분해는 유일하다: $A=H'+S'$이면 $A^*=H'-S'$이라 $H'=\frac12(A+A^*)=H$. $\blacksquare$
예: $\begin{pmatrix}1&2\\0&i\end{pmatrix}=\begin{pmatrix}1&1\\1&0\end{pmatrix}+\begin{pmatrix}0&1\\-1&i\end{pmatrix}$.

**(18)** 에르미트: $AA^*=AA=A^*A$. 반에르미트: $AA^*=-A^2=A^*A$. 유니터리: $AA^*=I=A^*A$. $\blacksquare$

**(19)** $A=H+S$이면 $A^*=H^*+S^*=H-S$이므로
$$AA^*=(H+S)(H-S)=H^2-HS+SH-S^2,$$
$$A^*A=(H-S)(H+S)=H^2+HS-SH-S^2,$$
$$AA^*-A^*A=2(SH-HS).$$
따라서 $AA^*=A^*A\iff HS=SH$. $\blacksquare$

**(20)** ① $N=\begin{pmatrix}0&1\\0&0\end{pmatrix}$: $NN^*=\begin{pmatrix}1&0\\0&0\end{pmatrix}\ne\begin{pmatrix}0&0\\0&1\end{pmatrix}=N^*N$. 정규가 아니다. ((19)로 보면 $H=\frac12\begin{pmatrix}0&1\\1&0\end{pmatrix}$, $S=\frac12\begin{pmatrix}0&1\\-1&0\end{pmatrix}$가 교환되지 않는다.)
② $D=\operatorname{diag}(1,2i)$: 대각행렬끼리는 교환되므로 $DD^*=D^*D$ (정규). $D^*=\operatorname{diag}(1,-2i)\ne D$ (에르미트 아님), $\ne-D$ (반에르미트 아님), $DD^*=\operatorname{diag}(1,4)\ne I$ (유니터리 아님).
③ 실수 예: $M=\begin{pmatrix}1&-1\\1&1\end{pmatrix}$은 $MM^{\mathsf T}=2I=M^{\mathsf T}M$ (정규)이지만 대칭·반대칭·직교가 아니다($\sqrt2$배 늘린 45° 회전).

**왜 정규행렬이 중요한가.** 정규행렬은 정확히 **유니터리 행렬로 대각화되는** 행렬입니다(스펙트럼 정리). 에르미트·반에르미트·유니터리는 그 대표적인 예일 뿐입니다.
:::

:::warn 함정
- $A^*$를 전치만 하고 켤레를 빠뜨리는 것. 실수 행렬이 아니면 $A^*=\overline A^{\mathsf T}$입니다.
- (19)에서 $(H+S)(H-S)=H^2-S^2$로 쓰는 것. 행렬은 교환되지 않으므로 $-HS+SH$가 남고, 바로 그 항이 답입니다.
- (20)에서 대각행렬은 “에르미트”라고 생각하는 것. 대각성분이 실수일 때만 에르미트입니다.
:::
` },
    ],
  });
})();
