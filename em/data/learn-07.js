/* 개념 정리 — 07 고유값 문제 (Kreyszig 10판 8장, §8.1–8.5). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 7,
    summary: R`$A\mathbf x=\lambda\mathbf x$, 행렬이 **방향은 그대로 두고 길이만 바꾸는** 벡터를 찾는 문제입니다. 연립 ODE, 진동, 마르코프 과정, 탄성 변형, 이차곡선 등 공학의 많은 문제가 이 한 식으로 귀결됩니다. 교재 8장은 고유값·고유벡터 구하기, 응용, 대칭·반대칭·직교 행렬, 대각화와 이차형식의 주축 변환, 복소 행렬(에르미트·유니터리)의 순서로 진행합니다.`,
    goals: [
      R`특성방정식을 세워 고유값과 고유공간을 구하고, 대수적·기하적 중복도를 구분할 수 있다`,
      R`고유값의 합·곱과 $\tr A$, $\det A$의 관계로 검산할 수 있다`,
      R`주방향, 마르코프 과정, 레슬리 인구 모델, 진동 문제를 고유값 문제로 세울 수 있다`,
      R`대칭·반대칭·직교 행렬의 고유값 성질을 증명하고 쓸 수 있다`,
      R`대각화 가능 여부를 판단하고 $A^k=XD^kX^{-1}$을 쓸 수 있다`,
      R`이차형식을 주축으로 변환해 이차곡선을 판별할 수 있다`,
      R`에르미트·유니터리 행렬의 고유값 성질을 설명할 수 있다`,
    ],
    sections: [
      { k: '8.1', p: '323', title: '고유값 문제: 고유값과 고유벡터 구하기', body: R`
행렬 문제 중 공학 응용에서 가장 중요한 것이 고유값 문제입니다. 영이 아닌 벡터에 정사각행렬을 곱해 봅시다.
$$\begin{bmatrix}4&1\\2&3\end{bmatrix}\begin{bmatrix}1\\0\end{bmatrix}=\begin{bmatrix}4\\2\end{bmatrix},\qquad\begin{bmatrix}4&1\\2&3\end{bmatrix}\begin{bmatrix}1\\1\end{bmatrix}=\begin{bmatrix}5\\5\end{bmatrix}=5\begin{bmatrix}1\\1\end{bmatrix}$$
첫 번째는 방향도 길이도 다른 새 벡터가 되는, 보통 일어나는 일이라 흥미롭지 않습니다. 두 번째는 곱한 결과가 **원래 벡터와 같은 방향**이고 5배일 뿐입니다. 이런 스칼라와 벡터를 체계적으로 찾는 것이 **행렬 고유값 문제**입니다.

:::def 고유값과 고유벡터
$n\times n$ 행렬 $A$에 대해
$$A\mathbf x=\lambda\mathbf x$$
가 $\mathbf x\ne\mathbf 0$인 해를 가지는 $\lambda$를 **고유값**(특성값), 그 해 $\mathbf x$를 $\lambda$에 대응하는 **고유벡터**라 합니다. 고유값 전체의 집합이 **스펙트럼**, 고유값의 절댓값 중 가장 큰 것이 **스펙트럼 반지름**입니다.
:::

기하적으로는 $A$를 곱하는 것이 스칼라 $\lambda$를 곱하는 것과 같은 효과를 내는 벡터, 곧 $A\mathbf x$가 $\mathbf x$와 같은 방향(또는 $\lambda<0$이면 반대 방향)인 벡터를 찾는 것입니다. $\mathbf x=\mathbf 0$은 모든 $\lambda$에 대해 $A\mathbf 0=\mathbf 0$이라 흥미가 없으므로 제외합니다. (“Eigen”은 독일어로 “고유한”이라는 뜻입니다.) 이것은 대수적 고유값 문제이고, 미분방정식의 고유값 문제(§11.5, 12장)와 구별합니다.

### 고유값과 고유벡터 구하기

$A\mathbf x=\lambda\mathbf x$를 $A\mathbf x-\lambda I\mathbf x=\mathbf 0$, 곧
$$(A-\lambda I)\mathbf x=\mathbf 0$$
로 쓰면 동차 연립방정식입니다. 크래머 정리에 의해 자명하지 않은 해(고유벡터)가 있을 필요충분조건은 계수 행렬식이 0인 것입니다[[ch06:7.5|동차 연립방정식의 자명하지 않은 해 ⟺ $\det=0$.]].
$$D(\lambda)=\det(A-\lambda I)=\begin{vmatrix}a_{11}-\lambda&a_{12}&\cdots&a_{1n}\\a_{21}&a_{22}-\lambda&\cdots&a_{2n}\\\vdots&&\ddots&\vdots\\a_{n1}&a_{n2}&\cdots&a_{nn}-\lambda\end{vmatrix}=0$$
$A-\lambda I$를 **특성행렬**, $D(\lambda)$를 **특성행렬식**(전개하면 $\lambda$의 $n$차 **특성다항식**), $D(\lambda)=0$을 **특성방정식**이라 합니다.

:::thm 고유값 (교재 §8.1 Theorem 1)
정사각행렬 $A$의 고유값은 특성방정식의 근입니다. 따라서 $n\times n$ 행렬은 적어도 하나, 많아야 $n$개의 서로 다른 고유값을 가집니다.
:::

$n$이 크면 근을 수치해법으로 구합니다. **고유값을 먼저** 구하고, 각 고유값을 $(A-\lambda I)\mathbf x=\mathbf 0$에 넣어 가우스 소거로 고유벡터를 구합니다.

:::key 고유값의 기본 성질
$$\det(A-\lambda I)=0,\qquad \sum_j\lambda_j=\tr A,\qquad \prod_j\lambda_j=\det A$$
$$A^k\to\lambda^k,\qquad A^{-1}\to\frac1\lambda,\qquad A+cI\to\lambda+c,\qquad A^T\to\lambda$$
:::

:::ex 예제 1 (모든 단계)
$A=\begin{pmatrix}4&-1\\2&1\end{pmatrix}$의 고유값과 고유벡터
---
**(a) 고유값.** 성분으로 쓰면 $(4-\lambda)x_1-x_2=0$, $2x_1+(1-\lambda)x_2=0$이고, 특성방정식은
$$\det(A-\lambda I)=\begin{vmatrix}4-\lambda&-1\\2&1-\lambda\end{vmatrix}=(4-\lambda)(1-\lambda)+2=\lambda^2-5\lambda+6=0$$
에서 $\lambda_1=2$, $\lambda_2=3$.

**(b1) $\lambda_1=2$의 고유벡터.** $2x_1-x_2=0$, $2x_1-x_2=0$ (두 식이 같음: 특성행렬이 특이하기 때문). $x_1=1$로 고르면 $\mathbf x_1=(1,2)^T$. 검산: $A\mathbf x_1=(4-2,\ 2+2)^T=(2,4)^T=2\mathbf x_1$ ✓.

**(b2) $\lambda_2=3$의 고유벡터.** $x_1-x_2=0$에서 $\mathbf x_2=(1,1)^T$.

검산: 합 $2+3=5=\tr A$, 곱 $6=\det A$ ✓. (이 합·곱 관계는 특성다항식 $\lambda^2-(\tr A)\lambda+\det A$의 근과 계수의 관계입니다.)
:::

:::thm 고유공간 (교재 §8.1 Theorem 2)
$\mathbf w$, $\mathbf x$가 같은 고유값 $\lambda$의 고유벡터이면 $\mathbf w+\mathbf x$ ($\ne\mathbf 0$)와 $k\mathbf x$ ($k\ne0$)도 고유벡터입니다. 따라서 한 고유값의 고유벡터들과 $\mathbf 0$은 벡터공간, 곧 $\lambda$의 **고유공간**을 이룹니다.
:::

$A(k\mathbf w+l\mathbf x)=kA\mathbf w+lA\mathbf x=\lambda(k\mathbf w+l\mathbf x)$이기 때문입니다. 고유공간은 $A-\lambda I$의 영공간입니다[[ch06:7.4|영공간과 계수.]]. 특히 고유벡터는 상수배를 빼고 정해지므로 **정규화**(길이 1로)할 수 있습니다: $(1,2)^T$의 길이는 $\sqrt5$이므로 $\big(\frac1{\sqrt5},\frac2{\sqrt5}\big)^T$.

### 중복 고유값과 결함

$\lambda$가 특성다항식의 $M_\lambda$중근이면 **대수적 중복도** $M_\lambda$, 대응하는 일차독립인 고유벡터의 수(고유공간의 차원)가 **기하적 중복도** $m_\lambda$입니다. 특성다항식의 차수가 $n$이므로 대수적 중복도의 합은 $n$이고, 일반적으로 $m_\lambda\le M_\lambda$입니다. 차이 $\Delta_\lambda=M_\lambda-m_\lambda$를 **결함**이라 합니다.

:::ex 예제 2 (중복 고유값, 결함 0)
$A=\begin{pmatrix}2&0&0\\0&3&1\\0&1&3\end{pmatrix}$의 고유값과 중복도
---
블록 대각이므로 $2$와 $\begin{pmatrix}3&1\\1&3\end{pmatrix}$의 고유값 $2,4$. 따라서 $\lambda=2$ ($M=2$), $\lambda=4$ ($M=1$).
$\lambda=2$: $A-2I=\begin{pmatrix}0&0&0\\0&1&1\\0&1&1\end{pmatrix}$은 계수 1이라 $x_2+x_3=0$만 남고, $x_1$, $x_3$을 자유롭게 골라 두 독립인 고유벡터 $(1,0,0)^T$, $(0,1,-1)^T$를 얻습니다($m=2$, 결함 0). 계수 1이면 영공간의 차원이 $n-1=2$라는 §7.5의 결과 그대로입니다.
$\lambda=4$: $(0,1,1)^T$.
:::

:::ex 예제 3 (양의 결함)
$A=\begin{pmatrix}0&1\\0&0\end{pmatrix}$과 $B=\begin{pmatrix}3&2\\0&3\end{pmatrix}$의 중복도
---
$\det(A-\lambda I)=\lambda^2=0$이므로 $\lambda=0$, $M_0=2$. 고유벡터는 $0x_1+x_2=0$, 곧 $x_2=0$에서 $(x_1,0)^T$ 꼴 하나뿐이라 $m_0=1$, 결함 1.
$B$도 $(3-\lambda)^2=0$에서 $M_3=2$이지만 $0x_1+2x_2=0$에서 고유벡터는 $(x_1,0)^T$ 방향 하나뿐이라 결함 1입니다. 이런 행렬은 대각화되지 않습니다(§8.4).
:::

:::ex 예제 4 (복소 고유값)
$A=\begin{pmatrix}1&-2\\1&3\end{pmatrix}$와 반대칭행렬 $\begin{pmatrix}0&1\\-1&0\end{pmatrix}$
---
실다항식은 복소근을 가질 수 있고(켤레쌍으로), 그러면 실행렬도 복소 고유값과 고유벡터를 가집니다.
첫째: $\lambda^2-4\lambda+5=0$, $\lambda=2\pm i$. $\lambda=2+i$: $(-1-i)x_1-2x_2=0$에서 $\mathbf x=(-1+i,\ 1)^T$ (확인: $(-1-i)(-1+i)=1+1=2$, $-2\cdot1=-2$ ✓). $2-i$의 고유벡터는 그 켤레입니다. 연립 ODE에서는 나선점이 됩니다[[ch03:4.3|복소 고유값과 나선점.]].
둘째: $\lambda^2+1=0$, $\lambda=\pm i$, 고유벡터 $(1,\pm i)^T$. 평면에서 $90^\circ$ 회전이라 실수 방향으로는 방향이 그대로인 벡터가 없는 것이 당연합니다.
:::

:::thm 전치행렬의 고유값 (교재 §8.1 Theorem 3)
$A^T$는 $A$와 같은 고유값을 가집니다.
:::

전치해도 행렬식의 값이 변하지 않으므로 $\det(A^T-\lambda I)=\det\big((A-\lambda I)^T\big)=\det(A-\lambda I)$입니다. (고유벡터는 일반적으로 다릅니다.)

**그 밖의 성질.** $A\mathbf x=\lambda\mathbf x$이면 $A^2\mathbf x=\lambda A\mathbf x=\lambda^2\mathbf x$, 일반적으로 $A^k\mathbf x=\lambda^k\mathbf x$입니다. $A$가 가역이면 $\mathbf x=\lambda A^{-1}\mathbf x$에서 $A^{-1}\mathbf x=\frac1\lambda\mathbf x$ (가역이면 $\lambda\ne0$). $(A+cI)\mathbf x=(\lambda+c)\mathbf x$. 삼각행렬의 고유값은 대각성분입니다($\det(A-\lambda I)$가 대각성분 $a_{jj}-\lambda$의 곱이므로).
` },
      { k: '8.2', p: '329', title: '고유값 문제의 응용', body: R`
행렬 고유값 문제의 넓은 응용 가운데 대표적인 것을 봅니다. 마지막 진동 예제는 4장(연립 ODE)과 연결되지만 여기서 독립적으로 다룹니다.

### ① 탄성 막의 늘임: 주방향

:::ex 예제 1 (막의 주방향)
$x_1x_2$ 평면에서 경계가 원 $x_1^2+x_2^2=1$인 탄성 막을 늘여 점 $P:(x_1,x_2)$가 점 $Q:(y_1,y_2)$로 옮겨 간다.
$$\mathbf y=A\mathbf x=\begin{bmatrix}3&1\\1&3\end{bmatrix}\mathbf x,\qquad y_1=3x_1+x_2,\ \ y_2=x_1+3x_2$$
$Q$의 위치벡터가 $P$의 위치벡터와 같은(또는 정반대) 방향이 되는 **주방향**을 구하고, 경계원이 어떤 모양이 되는지 말하세요.
---
**고유값 문제로.** 찾는 것은 $\mathbf y=\lambda\mathbf x$인 $\mathbf x$이고 $\mathbf y=A\mathbf x$이므로 $A\mathbf x=\lambda\mathbf x$입니다. 특성방정식 $(3-\lambda)^2-1=0$에서 $\lambda_1=4$, $\lambda_2=2$.

**주방향.** $\lambda=4$: $-x_1+x_2=0$에서 $(1,1)^T$. $\lambda=2$: $x_1+x_2=0$에서 $(1,-1)^T$. 이 두 방향(양의 $x_1$축과 $45^\circ$, $135^\circ$)이 주방향이고, 막은 그 방향으로 각각 4배, 2배 늘어납니다.

**변형된 경계.** 주방향을 새 직교좌표 $u_1u_2$의 축으로 잡고 경계점을 $u_1=\cos\phi$, $u_2=\sin\phi$로 쓰면, 늘인 뒤 $z_1=4\cos\phi$, $z_2=2\sin\phi$이고 $\cos^2\phi+\sin^2\phi=1$에서
$$\frac{z_1^2}{4^2}+\frac{z_2^2}{2^2}=1$$
곧 경계는 반축이 4와 2인 **타원**이 됩니다.
:::

:::fig f07membrane
:::

### ② 마르코프 과정의 극한 상태

§7.2의 마르코프 과정에서 “과정이 오래 진행되면 어떻게 되나?”를 물으면 고유값 문제가 됩니다. 극한 상태에서는 확률행렬 $A$를 곱해도 상태벡터가 그대로이므로 $A\mathbf x=\mathbf x$, 곧 **고유값 1의 고유벡터**입니다.

**왜 1이 고유값인가.** 확률행렬은 각 **열**의 합이 1이므로 $A^T$의 각 **행**의 합이 1이고, 따라서 $A^T(1,\dots,1)^T=(1,\dots,1)^T$입니다. $A^T$가 고유값 1을 가지므로 §8.1 Theorem 3에 의해 $A$도 고유값 1을 가집니다.

:::ex 예제 2 (통근 수단의 장기 비율)
§7.2 예제 4의 확률행렬 $A=\begin{bmatrix}0.80&0.20&0.10\\0.15&0.70&0.10\\0.05&0.10&0.80\end{bmatrix}$에서 장기적인 비율은?
---
$(A-I)\mathbf x=\mathbf 0$을 풉니다.
$$A-I=\begin{bmatrix}-0.2&0.2&0.1\\0.15&-0.3&0.1\\0.05&0.1&-0.2\end{bmatrix}$$
셋째 행에서 $x_1=-2x_2+4x_3$, 첫 행에 넣으면 $0.6x_2-0.7x_3=0$, 곧 $x_2=\frac76x_3$, 그러면 $x_1=\frac53x_3$. $x_3=6$으로 두면 $\mathbf x=(10,7,6)^T$ (둘째 행으로 검산: $1.5-2.1+0.6=0$ ✓). 합이 100%가 되게 나누면
$$\text{자동차}:\text{버스}:\text{걷기}=10:7:6\approx43.5\%:30.4\%:26.1\%$$
확률이 거의 그대로 유지된다면 장기적으로 이 비율에 다가갑니다. 반올림 오차를 피하려고 분수로 계산했습니다.
:::

:::ex 예제 3 (2×2 확률행렬)
열의 합이 1인 $A=\begin{pmatrix}0.8&0.1\\0.2&0.9\end{pmatrix}$의 정상상태 분포
---
확률행렬은 항상 고유값 1을 가집니다(다른 고유값은 $\tr A-1=0.7$). $\lambda=1$: $-0.2x_1+0.1x_2=0$ → $(1,2)^T$. 합이 1이 되게 하면 $(\tfrac13,\tfrac23)^T$. 다른 고유값 $0.7<1$의 성분은 $0.7^k$로 사라지므로 어떤 초기 분포에서도 이 상태로 수렴합니다.
:::

### ③ 레슬리 인구 모델

연령층별 개체 수를 다루는 모델입니다. 어떤 동물의 암컷이 최대 9살까지 산다고 하고 3년씩 세 연령층으로 나눕니다. **레슬리 행렬** $L=[l_{jk}]$에서 첫 행 $l_{1k}$는 $k$번째 연령층 암컷 한 마리가 그 기간에 낳는 평균 딸의 수, $l_{j,j-1}$은 $j-1$번째 층에서 살아남아 $j$번째 층으로 넘어가는 비율입니다. 3년 뒤의 개체 수는 $\mathbf x_{\text{new}}=L\mathbf x$입니다.

:::ex 예제 4 (레슬리 모델)
$$L=\begin{bmatrix}0&1.5&1\\0.5&0&0\\0&0.5&0\end{bmatrix}$$
(a) 처음에 각 층이 400마리이면 3년, 6년 뒤는? (b) 모든 층이 같은 비율로 변하는 분포와 그 비율은?
---
**(a)** $L(400,400,400)^T=(600+400,\ 200,\ 200)^T=(1000,200,200)^T$. 다시 곱하면 $(300+200,\ 500,\ 100)^T=(500,500,100)^T$. 층별 수가 크게 출렁입니다.

**(b)** “비례적 변화”는 $L\mathbf x=\lambda\mathbf x$인 분포이고 $\lambda$가 변화율($\lambda>1$이면 성장, $<1$이면 감소)입니다. 첫 열로 전개하면
$$\det(L-\lambda I)=-\lambda^3+0.5(1.5\lambda+0.5)=-(\lambda^3-0.75\lambda-0.25)=-(\lambda-1)\big(\lambda+\tfrac12\big)^2$$
양의 근은 $\lambda=1$입니다. $(L-I)\mathbf x=\mathbf 0$에서 $x_2=0.5x_1$, $x_3=0.5x_2$이므로 $\mathbf x=(4,2,1)^T$. 곧 개체 수가 4:2:1로 나뉘어 있으면 3년마다 그대로 유지되고, 이 모델의 개체군은 장기적으로 커지지도 줄지도 않습니다. 나머지 고유값 $-\frac12$ (절댓값 1보다 작음)에 해당하는 성분은 부호를 바꾸며 줄어들어, (a)의 출렁임도 결국 4:2:1 분포로 가라앉습니다.
:::

### ④ 진동계

여러 질량과 스프링으로 된 역학계도 고유값 문제로 다룹니다. 스프링으로 연결된 질량들은 $\mathbf y''=A\mathbf y$이고, 질량 하나일 때(§2.4)처럼 $\mathbf y=\mathbf xe^{\omega t}$를 시도하면 $\omega^2\mathbf xe^{\omega t}=A\mathbf xe^{\omega t}$, 곧 $A\mathbf x=\lambda\mathbf x$ ($\lambda=\omega^2$)입니다. 고유값이 음수 $\lambda=-\Omega^2$이면 $\omega=\pm i\Omega$가 되어 해는 $\cos\Omega t$, $\sin\Omega t$입니다. 곧 고유값에서 **고유진동수** $\Omega$가, 고유벡터에서 **진동 모드**(각 질량이 움직이는 비율)가 나옵니다.

:::ex 예제 5 (같은 질량 둘, 같은 스프링 셋)
$y_1''=-2y_1+y_2$, $y_2''=y_1-2y_2$의 일반해를 구하세요.
---
$A=\begin{pmatrix}-2&1\\1&-2\end{pmatrix}$의 고유값 $-1$ (고유벡터 $(1,1)^T$), $-3$ ($(1,-1)^T$). 따라서 $\omega^2=-1$에서 $\omega=\pm i$, $\omega^2=-3$에서 $\omega=\pm i\sqrt3$이고, 복소해 $\mathbf x_1e^{\pm it}$, $\mathbf x_2e^{\pm i\sqrt3t}$를 더하고 빼서 네 실수해 $\mathbf x_1\cos t$, $\mathbf x_1\sin t$, $\mathbf x_2\cos\sqrt3t$, $\mathbf x_2\sin\sqrt3t$를 얻습니다.
$$\mathbf y=\begin{pmatrix}1\\1\end{pmatrix}(a_1\cos t+b_1\sin t)+\begin{pmatrix}1\\-1\end{pmatrix}(a_2\cos\sqrt3t+b_2\sin\sqrt3t)$$
두 질량이 같은 방향으로 움직이는 모드는 진동수 1, 반대 방향 모드는 $\sqrt3$입니다(가운데 스프링이 늘었다 줄었다 해서 복원력이 더 큼). 네 상수는 두 질량의 초기 변위와 초기 속도로 정합니다. 감쇠를 무시했으므로 조화 진동입니다. 라플라스 변환으로 같은 문제를 푼 §6.7 예제 3과 비교해 보세요[[ch05:6.7|라플라스 변환으로 푼 두 질량 문제.]][[ch03:4.1|연립 ODE 모델.]].
:::

연속체(현, 막)에서는 행렬 대신 미분연산자의 고유값 문제가 되어 고유함수와 고유진동수가 나옵니다[[ch10:11.5|스투름-리우빌 문제: 미분방정식의 고유값 문제.]][[ch11:12.9|직사각형 막의 고유진동.]].
` },
      { k: '8.3', p: '334', title: '대칭·반대칭·직교 행렬', body: R`
놀라운 성질 때문에 응용에 자주 나오는 세 종류의 실정사각행렬을 봅니다.

:::def 세 가지 실행렬
**대칭** $A^T=A$ ($a_{kj}=a_{jk}$), **반대칭** $A^T=-A$ ($a_{kj}=-a_{jk}$), **직교** $A^T=A^{-1}$ (즉 $A^TA=I$).
:::

예를 들어
$$\begin{bmatrix}-3&1&5\\1&0&-2\\5&-2&4\end{bmatrix}\ (\text{대칭}),\qquad\begin{bmatrix}0&4&-7\\-4&0&3\\7&-3&0\end{bmatrix}\ (\text{반대칭}),\qquad\frac17\begin{bmatrix}2&3&6\\3&-6&2\\6&2&-3\end{bmatrix}\ (\text{직교})$$
반대칭행렬의 대각성분은 모두 0입니다($a_{jj}=-a_{jj}$). 모든 정사각행렬은 대칭 부분과 반대칭 부분의 합으로 유일하게 쓸 수 있습니다: $A=R+S$, $R=\frac12(A+A^T)$, $S=\frac12(A-A^T)$. 예: $\begin{pmatrix}1&4\\2&3\end{pmatrix}=\begin{pmatrix}1&3\\3&3\end{pmatrix}+\begin{pmatrix}0&1\\-1&0\end{pmatrix}$.

:::key 특수 행렬과 고유값
| 행렬 | 정의 | 고유값 |
|---|---|---|
| 대칭 | $A^T=A$ | 모두 실수 |
| 반대칭 | $A^T=-A$ | 순허수 또는 0 |
| 직교 | $A^T=A^{-1}$ | 절댓값 1 |
| 에르미트 | $\bar A^T=A$ | 모두 실수 |
| 유니터리 | $\bar A^T=A^{-1}$ | 절댓값 1 |
:::

(증명은 복소 행렬로 일반화해 §8.5에서 합니다.) 예를 들어 위의 반대칭행렬의 특성방정식은 $\lambda^3+(16+49+9)\lambda=\lambda(\lambda^2+74)=0$이라 고유값이 $0,\ \pm i\sqrt{74}$입니다. 반면 고유값이 실수라고 대칭인 것은 아닙니다: $\begin{pmatrix}3&4\\1&3\end{pmatrix}$은 고유값 $1,5$ (실수)이지만 대칭이 아닙니다. 정리는 “대칭이면 실수”이지 그 역이 아닙니다.

### 직교 변환과 직교행렬

$A$가 직교행렬이면 $\mathbf y=A\mathbf x$를 **직교 변환**이라 합니다. 평면에서 각 $\theta$만큼의 회전
$$\mathbf y=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}\mathbf x$$
가 대표적이고, 평면이나 공간의 모든 직교 변환은 회전(그리고 직선·평면에 대한 반사와의 조합)입니다.

:::thm 내적의 보존 (교재 §8.3 Theorem 2)
직교 변환은 $\mathbb R^n$의 내적 $\mathbf a\cdot\mathbf b=\mathbf a^T\mathbf b$를 보존합니다: $\mathbf u=A\mathbf a$, $\mathbf v=A\mathbf b$이면 $\mathbf u\cdot\mathbf v=\mathbf a\cdot\mathbf b$. 따라서 길이(노름) $\|\mathbf a\|=\sqrt{\mathbf a\cdot\mathbf a}$도 보존합니다.
:::

$(A\mathbf a)^T=\mathbf a^TA^T$이고 $A^TA=A^{-1}A=I$이므로 $\mathbf u\cdot\mathbf v=\mathbf a^TA^TA\mathbf b=\mathbf a^T\mathbf b$. $\mathbf b=\mathbf a$로 두면 길이가 보존됩니다. 거리와 각도를 바꾸지 않으므로 강체의 운동(회전)을 나타내기에 알맞습니다.

:::thm 행과 열의 정규직교성 (교재 §8.3 Theorem 3)
실정사각행렬이 직교행렬일 필요충분조건은 열벡터들이(그리고 행벡터들이) 정규직교계인 것, 곧 $\mathbf a_j\cdot\mathbf a_k=0$ ($j\ne k$), $=1$ ($j=k$)입니다[[ch06:7.9|내적공간과 정규직교.]].
:::

$A^TA$의 $(j,k)$ 성분은 $A$의 $j$번째 열과 $k$번째 열의 내적 $\mathbf a_j^T\mathbf a_k$입니다. 그래서 $A^TA=I$라는 것은 곧 열들이 정규직교라는 것입니다. 직교행렬의 역행렬 $A^T$도 직교행렬이고 그 열이 $A$의 행이므로 행들도 정규직교입니다. 위의 $\frac17\begin{bmatrix}2&3&6\\3&-6&2\\6&2&-3\end{bmatrix}$에서 각 열의 길이는 $\frac{\sqrt{4+9+36}}7=1$이고, 예를 들어 1열과 2열의 내적은 $\frac{6-18+12}{49}=0$입니다.

:::thm 직교행렬의 행렬식 (교재 §8.3 Theorem 4)
직교행렬의 행렬식은 $+1$ 또는 $-1$입니다.
:::

$1=\det I=\det(AA^{-1})=\det(AA^T)=\det A\det A^T=(\det A)^2$. $+1$이면 순수한 회전, $-1$이면 반사를 포함합니다.

:::thm 직교행렬의 고유값 (교재 §8.3 Theorem 5)
직교행렬의 고유값은 실수이거나 켤레 복소수 쌍이고, 절댓값이 1입니다. 곧 복소평면의 단위원 위에 있습니다[[ch12:13.2|극형식 $e^{i\theta}$와 단위원.]].
:::

:::ex 예제 1 (평면 회전)
회전행렬 $\begin{pmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{pmatrix}$의 고유값은?
---
$\lambda^2-2\cos\theta\,\lambda+1=0$에서 $\lambda=\cos\theta\pm i\sin\theta=e^{\pm i\theta}$. $\theta\ne0,\pi$이면 실수 고유벡터가 없습니다(모든 방향이 돌아가므로 당연).
:::

:::ex 예제 2 (3차원 직교행렬)
$A=\frac17\begin{bmatrix}2&3&6\\3&-6&2\\6&2&-3\end{bmatrix}$의 고유값과 기하적 의미는?
---
$A$는 직교이면서 대칭입니다. 그러면 $A^2=AA^T=I$이므로 고유값은 $\lambda^2=1$에서 $\pm1$뿐입니다. 합이 $\tr A=\frac{2-6-3}7=-1$이므로 고유값은 $1,-1,-1$이고, $\det A=1\cdot(-1)(-1)=+1$이라 회전입니다. $\lambda=1$의 고유벡터를 $(A-I)\mathbf x=\mathbf 0$에서 구하면 $(3,1,2)^T$ (확인: $\frac17(6+3+12,\ 9-6+4,\ 18+2-6)=(3,1,2)$ ✓). 따라서 $A$는 축 $(3,1,2)^T$에 대한 **$180^\circ$ 회전**입니다. 일반적으로 3차원 회전은 고유값 $1$ (회전축)과 $e^{\pm i\theta}$를 가지며, 여기서는 $\theta=\pi$라 $e^{\pm i\pi}=-1$입니다.
:::

실대칭행렬에서 서로 다른 고유값의 고유벡터는 **직교**합니다. 이것이 다음 절의 주축 정리와, 미분연산자에서의 고유함수 직교성의 행렬판입니다[[ch10:11.5|스투름-리우빌 고유함수의 직교성.]].
` },
      { k: '8.4', p: '339', title: '고유기저, 대각화, 이차형식', body: R`
지금까지 고유값의 성질을 보았고, 이제 고유벡터의 성질로 넘어갑니다. $n\times n$ 행렬의 고유벡터가 $\mathbb R^n$의 기저를 이룰 수도(이루지 않을 수도) 있습니다. 변환 $\mathbf y=A\mathbf x$를 생각할 때 **고유기저**가 있으면 큰 이점이 있습니다. 임의의 $\mathbf x$를 고유벡터의 일차결합 $\mathbf x=c_1\mathbf x_1+\cdots+c_n\mathbf x_n$으로 유일하게 쓸 수 있고, $A\mathbf x_j=\lambda_j\mathbf x_j$이므로
$$\mathbf y=A\mathbf x=c_1\lambda_1\mathbf x_1+\cdots+c_n\lambda_n\mathbf x_n$$
곧 **$A$의 복잡한 작용이 고유벡터 방향마다 스칼라 곱하기로 분해**되기 때문입니다.

:::thm 고유벡터의 기저 (교재 §8.4 Theorem 1)
$n\times n$ 행렬 $A$가 서로 다른 고유값 $n$개를 가지면, 대응하는 고유벡터들은 $\mathbb R^n$ (또는 $\mathbb C^n$)의 기저를 이룹니다.
:::

**증명.** 고유벡터들이 일차종속이라 가정하고 $\{\mathbf x_1,\dots,\mathbf x_r\}$이 독립인 최대 집합이라 합시다($r<n$). 그러면 모두 0은 아닌 $c_j$로 $c_1\mathbf x_1+\cdots+c_{r+1}\mathbf x_{r+1}=\mathbf 0$입니다. $A$를 곱하면 $c_1\lambda_1\mathbf x_1+\cdots+c_{r+1}\lambda_{r+1}\mathbf x_{r+1}=\mathbf 0$이고, 원래 식에 $\lambda_{r+1}$을 곱해 빼면
$$c_1(\lambda_1-\lambda_{r+1})\mathbf x_1+\cdots+c_r(\lambda_r-\lambda_{r+1})\mathbf x_r=\mathbf 0$$
$\mathbf x_1,\dots,\mathbf x_r$이 독립이므로 각 계수가 0이고, 고유값이 모두 다르므로 $c_1=\cdots=c_r=0$입니다. 그러면 $c_{r+1}\mathbf x_{r+1}=\mathbf 0$이고 $\mathbf x_{r+1}\ne\mathbf 0$이므로 $c_{r+1}=0$. 모든 $c_j$가 0이라 모순입니다.

고유값이 모두 다르지 않아도 고유기저가 있을 수 있고(§8.1 예제 2), 고유벡터가 부족해 없을 수도 있습니다(§8.1 예제 3의 $\begin{pmatrix}0&1\\0&0\end{pmatrix}$). 중요한 일반적인 경우가 다음입니다.

:::thm 대칭행렬 (교재 §8.4 Theorem 2)
대칭행렬은 $\mathbb R^n$의 **정규직교** 고유기저를 가집니다.
:::

예를 들어 $\begin{pmatrix}3&1\\1&3\end{pmatrix}$ (§8.2 예제 1)의 정규직교 고유기저는 $\frac1{\sqrt2}(1,1)^T$, $\frac1{\sqrt2}(1,-1)^T$입니다.

### 닮은 행렬과 대각화

$n\times n$ 행렬 $\hat A$가 어떤 가역 행렬 $P$에 대해
$$\hat A=P^{-1}AP$$
이면 $\hat A$를 $A$와 **닮은** 행렬이라 하고, 이 변환을 **닮음 변환**이라 합니다. 같은 선형변환을 다른 기저로 본 것입니다.

:::thm 닮은 행렬의 고유값과 고유벡터 (교재 §8.4 Theorem 3)
$\hat A$가 $A$와 닮았으면 $\hat A$는 $A$와 같은 고유값을 가지고, $\mathbf x$가 $A$의 고유벡터이면 $\mathbf y=P^{-1}\mathbf x$가 같은 고유값에 대한 $\hat A$의 고유벡터입니다.
:::

$A\mathbf x=\lambda\mathbf x$에 $P^{-1}$을 곱하고 $I=PP^{-1}$를 끼워 넣으면 $P^{-1}AI\mathbf x=(P^{-1}AP)(P^{-1}\mathbf x)=\hat A(P^{-1}\mathbf x)=\lambda P^{-1}\mathbf x$입니다. $P^{-1}\mathbf x\ne\mathbf 0$ (그렇지 않으면 $\mathbf x=PP^{-1}\mathbf x=\mathbf 0$).

:::key 대각화
$$D=X^{-1}AX=\operatorname{diag}(\lambda_1,\dots,\lambda_n),\qquad A^k=XD^kX^{-1}$$
$$\text{실대칭행렬: } A=QDQ^T\quad(Q\text{의 열은 정규직교 고유벡터})$$
:::

:::thm 대각화 (교재 §8.4 Theorem 4)
$n\times n$ 행렬 $A$가 고유기저를 가지면, 고유벡터를 열로 모은 행렬 $X$로 $D=X^{-1}AX$가 고유값을 대각성분으로 하는 대각행렬이 됩니다. 또 $D^m=X^{-1}A^mX$ ($m=2,3,\dots$)입니다.
:::

**증명.** $X=[\mathbf x_1\ \cdots\ \mathbf x_n]$은 열이 독립이라 계수 $n$이고 가역입니다. $AX$의 $k$번째 열은 $A\mathbf x_k=\lambda_k\mathbf x_k$이므로
$$AX=A[\mathbf x_1\ \cdots\ \mathbf x_n]=[\lambda_1\mathbf x_1\ \cdots\ \lambda_n\mathbf x_n]=XD$$
왼쪽에서 $X^{-1}$을 곱하면 $X^{-1}AX=D$. 또 $D^2=(X^{-1}AX)(X^{-1}AX)=X^{-1}A^2X$이고 같은 방식으로 계속됩니다. 이것으로 $A^k$, $e^{At}$ 같은 계산과 연립 ODE의 분리를 합니다[[ch03:4.6|대각화로 연립 ODE 분리하기.]].

:::ex 예제 1 (대각화와 거듭제곱)
$A=\begin{pmatrix}4&1\\2&3\end{pmatrix}$을 대각화하고 $A^k$를 구하세요.
---
$\lambda^2-7\lambda+10=0$에서 $\lambda=2,5$. 고유벡터 $(1,-2)^T$, $(1,1)^T$.
$$X=\begin{pmatrix}1&1\\-2&1\end{pmatrix},\quad X^{-1}=\frac13\begin{pmatrix}1&-1\\2&1\end{pmatrix},\quad X^{-1}AX=\begin{pmatrix}2&0\\0&5\end{pmatrix}$$
$A^k=XD^kX^{-1}$이므로
$$A^k=\frac13\begin{pmatrix}2^k+2\cdot5^k&-2^k+5^k\\-2\cdot2^k+2\cdot5^k&2\cdot2^k+5^k\end{pmatrix}$$
$k=1$을 넣으면 $\frac13\begin{pmatrix}12&3\\6&9\end{pmatrix}=A$ ✓. 큰 $k$에서는 $5^k$ 항이 지배하므로 $A^k\mathbf x$는 (대부분의 $\mathbf x$에 대해) 가장 큰 고유값의 고유벡터 $(1,1)^T$ 방향으로 정렬됩니다. 이것이 거듭제곱법(수치해석)의 원리입니다.
:::

:::warn 대각화 조건
고유값이 중복되면 고유벡터가 부족할 수 있습니다. $\begin{pmatrix}2&1\\0&2\end{pmatrix}$는 고유값 2가 이중근이지만 고유벡터가 $(1,0)^T$ 방향 하나뿐이라(결함 1) 대각화되지 않습니다.
:::

### 이차형식과 주축 변환

벡터 $\mathbf x$의 성분에 대한 **이차형식**은 $n^2$개 항의 합
$$Q=\mathbf x^TA\mathbf x=\sum_{j=1}^n\sum_{k=1}^na_{jk}x_jx_k$$
입니다($A$: 계수행렬). 비대각 항을 쌍으로 묶어 같은 두 항의 합으로 쓸 수 있으므로 **$A$는 항상 대칭으로 잡을 수 있습니다**: $c_{jk}=\frac12(a_{jk}+a_{kj})$. 예를 들어 $\mathbf x^T\begin{pmatrix}3&4\\6&2\end{pmatrix}\mathbf x=3x_1^2+10x_1x_2+2x_2^2$은 대칭행렬 $\begin{pmatrix}3&5\\5&2\end{pmatrix}$로도 같은 식이 됩니다. 이차형식은 이차곡선(타원 $\frac{x_1^2}{a^2}+\frac{x_2^2}{b^2}=1$ 등)과 이차곡면, 그리고 물리에서 나옵니다. 주축으로의 변환은 대각화와 관련된 중요한 실용 과제입니다.[[@base:ch04:4.3|헤시안: 함수의 2차 근사가 이차형식이고, 그 정부호성으로 극값을 판정한다.]]

**유도.** 대칭 $A$는 정규직교 고유기저를 가지므로 그것을 열로 한 $X$는 직교행렬이고 $X^{-1}=X^T$, $A=XDX^T$입니다. 대입하면 $Q=\mathbf x^TXDX^T\mathbf x$. 여기서 $X^T\mathbf x=\mathbf y$, 곧
$$\mathbf x=X\mathbf y$$
로 두면 $\mathbf x^TX=\mathbf y^T$이므로
$$Q=\mathbf y^TD\mathbf y=\lambda_1y_1^2+\lambda_2y_2^2+\cdots+\lambda_ny_n^2$$
교차항이 모두 사라졌습니다.

:::thm 주축 정리 (교재 §8.4 Theorem 5)
치환 $\mathbf x=X\mathbf y$는 이차형식 $Q=\mathbf x^TA\mathbf x$ ($A$ 대칭)를 **주축 형식**(표준형) $\lambda_1y_1^2+\cdots+\lambda_ny_n^2$으로 바꿉니다. $\lambda_j$는 $A$의 고유값이고, $X$는 대응하는 정규직교 고유벡터를 열로 한 직교행렬입니다.
:::

:::key 주축 변환
$$ax_1^2+2bx_1x_2+cx_2^2=\mathbf x^T\begin{pmatrix}a&b\\b&c\end{pmatrix}\mathbf x=\lambda_1y_1^2+\lambda_2y_2^2,\qquad \mathbf x=X\mathbf y$$
$$\lambda_1\lambda_2>0:\ \text{타원},\qquad \lambda_1\lambda_2<0:\ \text{쌍곡선}$$
:::

:::ex 예제 2 (타원)
$5x_1^2-4x_1x_2+8x_2^2=36$은 어떤 곡선이고, 주축은 어느 방향인가?
---
$A=\begin{pmatrix}5&-2\\-2&8\end{pmatrix}$, $\lambda^2-13\lambda+36=0$에서 $\lambda=4,9$. 주축 좌표에서 $4y_1^2+9y_2^2=36$, 즉
$$\frac{y_1^2}{9}+\frac{y_2^2}{4}=1$$
**주축의 방향.** $\lambda=4$: $x_1-2x_2=0$에서 정규화한 고유벡터 $\frac1{\sqrt5}(2,1)^T$. $\lambda=9$: $\frac1{\sqrt5}(1,-2)^T$. 따라서 $\mathbf x=X\mathbf y$, $X=\frac1{\sqrt5}\begin{pmatrix}2&1\\1&-2\end{pmatrix}$이고, 반지름 3인 축이 $(2,1)^T$ 방향, 반지름 2인 축이 $(1,-2)^T$ 방향인 타원입니다. 단원 표지 그림이 이런 등위선과 두 주축입니다.
:::

:::ex 예제 3 (쌍곡선)
$x_1^2+4x_1x_2+x_2^2=3$을 주축으로 변환하세요.
---
$A=\begin{pmatrix}1&2\\2&1\end{pmatrix}$, $(1-\lambda)^2-4=0$에서 $\lambda=3,-1$. 부호가 달라 $3y_1^2-y_2^2=3$, 곧
$$y_1^2-\frac{y_2^2}3=1$$
인 쌍곡선입니다. 고유벡터 $\frac1{\sqrt2}(1,1)^T$, $\frac1{\sqrt2}(1,-1)^T$이므로 $x_1=\frac{y_1+y_2}{\sqrt2}$, $x_2=\frac{y_1-y_2}{\sqrt2}$, 곧 좌표축을 $45^\circ$ 돌린 것입니다.
:::

:::fig f07conic
:::

:::warn 교차항의 절반
$3x_1^2+6x_1x_2+2x_2^2$의 행렬은 $\begin{pmatrix}3&3\\3&2\end{pmatrix}$입니다. 교차항 계수 6을 그대로 비대각성분에 넣지 마세요.
:::

모든 고유값이 양수이면 $Q$는 **양의 정부호**($\mathbf x\ne\mathbf 0$이면 $Q>0$)이고, 2×2에서는 $a>0$, $ac-b^2>0$과 같습니다. 일반적으로는 주 소행렬식들이 모두 양수인 것과 같습니다.
` },
      { k: '8.5', p: '346', title: '복소 행렬과 형식 (선택)', body: R`
§8.3의 세 종류의 행렬에는 복소 대응물이 있고, 양자역학 같은 응용에서 실용적으로 중요합니다. 주로 이들의 스펙트럼(고유값의 위치) 때문입니다. 둘째 주제는 §8.4의 이차형식을 복소수로 넓힌 것입니다[[ch12:13.1|켤레 복소수.]].

**표기.** $\bar A=[\bar a_{jk}]$는 각 성분 $a+ib$를 켤레 $a-ib$로 바꾼 것이고, $\bar A^T=[\bar a_{kj}]$는 **켤레전치**입니다($A^*$ 또는 $A^H$로도 씀). 예를 들어 $A=\begin{pmatrix}3+4i&1-i\\6&2-5i\end{pmatrix}$이면 $\bar A^T=\begin{pmatrix}3-4i&6\\1+i&2+5i\end{pmatrix}$.

:::def 에르미트·반에르미트·유니터리
**에르미트** $\bar A^T=A$ (실수이면 대칭), **반에르미트** $\bar A^T=-A$ (실수이면 반대칭), **유니터리** $\bar A^T=A^{-1}$ (실수이면 직교).
:::

정의에서 에르미트이면 $\bar a_{jj}=a_{jj}$라 대각성분이 실수이고, 반에르미트이면 $\bar a_{jj}=-a_{jj}$라 대각성분이 순허수 또는 0입니다. 실행렬이면 켤레가 자기 자신이므로 에르미트 = 대칭, 반에르미트 = 반대칭, 유니터리 = 직교가 되어, 이 세 종류가 §8.3의 일반화입니다. 예:
$$\begin{bmatrix}4&1-3i\\1+3i&7\end{bmatrix}\ (\text{에르미트}),\qquad\begin{bmatrix}3i&2+i\\-2+i&-i\end{bmatrix}\ (\text{반에르미트}),\qquad\begin{bmatrix}\frac12i&\frac{\sqrt3}2\\\frac{\sqrt3}2&\frac12i\end{bmatrix}\ (\text{유니터리})$$

### 고유값

:::thm 고유값의 위치 (교재 §8.5 Theorem 1)
(a) 에르미트 행렬(따라서 대칭행렬)의 고유값은 실수입니다. (b) 반에르미트 행렬(따라서 반대칭행렬)의 고유값은 순허수 또는 0입니다. (c) 유니터리 행렬(따라서 직교행렬)의 고유값은 절댓값이 1입니다.
:::

복소 $\lambda$ 평면에서 보면 에르미트의 고유값은 실축, 반에르미트는 허축, 유니터리는 단위원 위에 있습니다.

**증명.** $A\mathbf x=\lambda\mathbf x$에 왼쪽에서 $\bar{\mathbf x}^T$를 곱하면 $\bar{\mathbf x}^TA\mathbf x=\lambda\bar{\mathbf x}^T\mathbf x$입니다. $\bar{\mathbf x}^T\mathbf x=|x_1|^2+\cdots+|x_n|^2$은 양의 실수이므로
$$\lambda=\frac{\bar{\mathbf x}^TA\mathbf x}{\bar{\mathbf x}^T\mathbf x}$$
(a) 분자는 스칼라라 전치해도 같고, $\bar A^T=A$, 곧 $A^T=\bar A$이므로 $\bar{\mathbf x}^TA\mathbf x=(\bar{\mathbf x}^TA\mathbf x)^T=\mathbf x^TA^T\bar{\mathbf x}=\mathbf x^T\bar A\bar{\mathbf x}=\overline{\bar{\mathbf x}^TA\mathbf x}$. 자기 켤레와 같으므로 실수이고, 따라서 $\lambda$도 실수입니다.
(b) 같은 계산에서 $A^T=-\bar A$이므로 분자가 자기 켤레의 $-1$배, 곧 순허수 또는 0입니다.
(c) $A\mathbf x=\lambda\mathbf x$와 그 켤레전치 $\bar{\mathbf x}^T\bar A^T=\bar\lambda\bar{\mathbf x}^T$를 곱하면 $\bar{\mathbf x}^T\bar A^TA\mathbf x=\bar\lambda\lambda\bar{\mathbf x}^T\mathbf x$. 유니터리이면 $\bar A^TA=I$이므로 왼쪽은 $\bar{\mathbf x}^T\mathbf x$이고, 나누면 $|\lambda|^2=1$입니다. (이것으로 §8.3의 Theorem 1, 5도 증명됩니다.)

### 복소 내적과 유니터리 변환

복소 벡터공간 $\mathbb C^n$에서 내적은 **켤레를 붙여**
$$\mathbf a\cdot\mathbf b=\bar{\mathbf a}^T\mathbf b,\qquad\|\mathbf a\|=\sqrt{\bar{\mathbf a}^T\mathbf a}=\sqrt{|a_1|^2+\cdots+|a_n|^2}$$
로 정의합니다(켤레를 취하지 않으면 $\mathbf a\cdot\mathbf a$가 음수나 복소수가 될 수 있음). 길이는 실수입니다.

- **내적의 보존**(Theorem 2): 유니터리 변환 $\mathbf y=A\mathbf x$는 이 내적과 노름을 보존합니다. 증명은 §8.3 Theorem 2에 켤레만 붙이면 됩니다: $\overline{(A\mathbf a)}^TA\mathbf b=\bar{\mathbf a}^T\bar A^TA\mathbf b=\bar{\mathbf a}^T\mathbf b$.
- **유니터리계**: $\bar{\mathbf a}_j^T\mathbf a_k=0$ ($j\ne k$), $=1$ ($j=k$)인 복소 벡터들. 정사각행렬이 유니터리일 필요충분조건은 열(그리고 행)이 유니터리계인 것입니다(Theorem 3).
- **행렬식**(Theorem 4): $|\det A|=1$. $1=\det(A\bar A^T)=\det A\,\overline{\det A}=|\det A|^2$이기 때문입니다($\det A$는 복소수일 수 있음).
- **고유기저**(Theorem 5): 에르미트, 반에르미트, 유니터리 행렬은 $\mathbb C^n$의 유니터리계인 고유기저를 가집니다.

### 에르미트 형식

§8.4의 이차형식을 복소로 넓힌 $\bar{\mathbf x}^TA\mathbf x=\sum_j\sum_ka_{jk}\bar x_jx_k$에서 $A$가 에르미트이면 **에르미트 형식**, 반에르미트이면 **반에르미트 형식**입니다. 위 증명의 (a), (b)는 $\mathbf x$가 고유벡터라는 사실을 쓰지 않았으므로, **에르미트 형식의 값은 모든 $\mathbf x$에 대해 실수**이고 반에르미트 형식의 값은 순허수 또는 0입니다. 물리에서 이 형식이 중요한 이유입니다(측정값은 실수여야 함). $A$와 $\mathbf x$가 실수이면 이차형식이 됩니다.

:::ex 예제
(a) $A=\begin{pmatrix}2&1-i\\1+i&3\end{pmatrix}$의 고유값, (b) $U=\frac1{\sqrt2}\begin{pmatrix}1&i\\i&1\end{pmatrix}$이 유니터리임을 보이고 고유값을 구하세요, (c) $\mathbf x=(1,i)^T$에 대한 (a)의 에르미트 형식의 값은?
---
(a) 에르미트입니다. $\lambda^2-5\lambda+(6-|1-i|^2)=\lambda^2-5\lambda+4=0$, $\lambda=1,4$ (실수) ✓
(b) $\bar U^TU=\frac12\begin{pmatrix}1&-i\\-i&1\end{pmatrix}\begin{pmatrix}1&i\\i&1\end{pmatrix}=\frac12\begin{pmatrix}2&0\\0&2\end{pmatrix}=I$ ✓. $\big(\frac1{\sqrt2}-\lambda\big)^2=-\frac12$에서 $\lambda=\frac{1\pm i}{\sqrt2}$, 절댓값 1 ✓
(c) $A\mathbf x=(2+(1-i)i,\ (1+i)+3i)^T=(3+i,\ 1+4i)^T$이고 $\bar{\mathbf x}^T=(1,-i)$이므로
$$\bar{\mathbf x}^TA\mathbf x=(3+i)-i(1+4i)=3+i-i+4=7$$
실수입니다 ✓.
:::

:::tip 시험 포인트
특성다항식을 전개하기 전에 $\tr A$와 $\det A$를 적어 두면, 구한 고유값의 합과 곱으로 바로 검산할 수 있습니다. 행렬의 “종류”를 먼저 확인하면 고유값이 실수인지, 단위원 위에 있는지 미리 알 수 있습니다.
:::
` },
    ],
  });
})();
