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
      R`주방향, 마르코프 과정, 진동 문제를 고유값 문제로 세울 수 있다`,
      R`대칭·반대칭·직교 행렬의 고유값 성질을 쓸 수 있다`,
      R`대각화 가능 여부를 판단하고 $A^k=XD^kX^{-1}$을 쓸 수 있다`,
      R`이차형식을 주축으로 변환해 이차곡선을 판별할 수 있다`,
      R`에르미트·유니터리 행렬의 고유값 성질을 설명할 수 있다`,
    ],
    sections: [
      { k: '8.1', p: '323', title: '고유값 문제: 고유값과 고유벡터 구하기', body: R`
$A\mathbf x=\lambda\mathbf x$ ($\mathbf x\ne\mathbf 0$)을 만족하는 수 $\lambda$가 **고유값**, 벡터 $\mathbf x$가 **고유벡터**입니다. $\mathbf x=\mathbf 0$은 항상 성립하므로 제외합니다. 고유값의 집합을 **스펙트럼**, 절댓값이 가장 큰 고유값의 크기를 **스펙트럼 반지름**이라 합니다.

$(A-\lambda I)\mathbf x=\mathbf 0$이 자명하지 않은 해를 가지려면 계수행렬이 특이해야 하므로[[ch06:7.5|동차 연립방정식의 자명하지 않은 해 ⟺ $\det=0$.]]
$$D(\lambda)=\det(A-\lambda I)=0\qquad(\text{특성방정식})$$
$D(\lambda)$는 $\lambda$의 $n$차 다항식(**특성다항식**)이므로 고유값은 적어도 하나, 많아야 $n$개입니다(교재 Theorem 1).

:::key 고유값의 기본 성질
$$\det(A-\lambda I)=0,\qquad \sum_j\lambda_j=\tr A,\qquad \prod_j\lambda_j=\det A$$
$$A^k\to\lambda^k,\qquad A^{-1}\to\frac1\lambda,\qquad A+cI\to\lambda+c,\qquad A^T\to\lambda$$
:::

- 한 고유값의 고유벡터들과 $\mathbf 0$은 벡터공간(**고유공간**)을 이룹니다(Theorem 2). 고유공간은 $A-\lambda I$의 영공간입니다[[ch06:7.4|영공간과 계수.]].
- $\lambda$가 특성다항식의 $M$중근이면 **대수적 중복도** $M$, 고유공간의 차원이 **기하적 중복도** $m$이고 $1\le m\le M$. 차이 $M-m$을 **결함**(defect)이라 합니다.
- 삼각행렬의 고유값은 대각성분입니다.
- 실행렬도 복소 고유값을 가질 수 있고, 그때는 켤레쌍 $\lambda,\bar\lambda$로 나타납니다. $A^T$는 $A$와 같은 고유값을 가집니다(Theorem 3).

:::ex 예제 1
$A=\begin{pmatrix}4&-1\\2&1\end{pmatrix}$의 고유값과 고유벡터
---
$\det(A-\lambda I)=(4-\lambda)(1-\lambda)+2=\lambda^2-5\lambda+6=0$에서 $\lambda=2,\,3$.
$\lambda=2$: $2x_1-x_2=0$ → $\mathbf x_1=(1,2)^T$. $\lambda=3$: $x_1-x_2=0$ → $\mathbf x_2=(1,1)^T$.
검산: 합 $5=\tr A$, 곱 $6=\det A$ ✓
:::

:::ex 예제 2 (중복 고유값)
$A=\begin{pmatrix}2&0&0\\0&3&1\\0&1&3\end{pmatrix}$의 고유값과 중복도
---
블록 대각이므로 $2$와 $\begin{pmatrix}3&1\\1&3\end{pmatrix}$의 고유값 $2,4$. 따라서 $\lambda=2$ ($M=2$), $\lambda=4$ ($M=1$).
$\lambda=2$: $A-2I=\begin{pmatrix}0&0&0\\0&1&1\\0&1&1\end{pmatrix}$, $x_2+x_3=0$만 남으므로 고유공간은 $(1,0,0)^T$, $(0,1,-1)^T$가 생성하는 2차원($m=2$, 결함 0).
$\lambda=4$: $(0,1,1)^T$.
:::

:::ex 예제 3 (복소 고유값)
$A=\begin{pmatrix}1&-2\\1&3\end{pmatrix}$
---
$\lambda^2-4\lambda+5=0$, $\lambda=2\pm i$. $\lambda=2+i$: $x_1+(1-i)x_2=0$에서 $\mathbf x=(-1+i,\ 1)^T$. $2-i$의 고유벡터는 그 켤레입니다. 연립 ODE에서는 나선점이 됩니다[[ch03:4.3|복소 고유값과 나선점.]].
:::
` },
      { k: '8.2', p: '329', title: '고유값 문제의 응용', body: R`
교재는 네 가지 응용을 소개합니다.

**① 탄성 막의 늘임(주방향).** 변형 $\mathbf y=A\mathbf x$에서 $\mathbf y$가 $\mathbf x$와 같은(또는 반대) 방향인 **주방향**은 고유벡터이고, 그 방향의 늘임 비율이 고유값입니다.

:::ex 예제 1
원 $x_1^2+x_2^2=1$인 막을 $\mathbf y=\begin{pmatrix}3&1\\1&3\end{pmatrix}\mathbf x$로 늘이면?
---
고유값 $4$ (고유벡터 $(1,1)^T$), $2$ ($(1,-1)^T$). 주방향은 두 대각선이고, 원은 $(1,1)$ 방향 반지름 4, $(1,-1)$ 방향 반지름 2인 타원이 됩니다. 주축 좌표 $z_1,z_2$에서 $\frac{z_1^2}{16}+\frac{z_2^2}{4}=1$.
:::

**② 마르코프 과정.** 상태 확률 벡터가 $\mathbf x_{k+1}=A\mathbf x_k$로 변하고 $A$의 각 열의 합이 1(확률행렬)이면, 장기적으로 $A\mathbf x=\mathbf x$인 **고유값 1의 고유벡터**(정상상태)로 수렴합니다.

:::ex 예제 2
열의 합이 1인 $A=\begin{pmatrix}0.8&0.1\\0.2&0.9\end{pmatrix}$의 정상상태 분포
---
확률행렬은 항상 고유값 1을 가집니다(다른 고유값은 $\tr A-1=0.7$). $\lambda=1$: $-0.2x_1+0.1x_2=0$ → $(1,2)^T$. 합이 1이 되게 하면 $(\tfrac13,\tfrac23)^T$.
:::

**③ 레슬리 인구 모델.** 연령층별 개체수 벡터가 $\mathbf x_{k+1}=L\mathbf x_k$ ($L$: 출생률·생존율 행렬)로 변할 때, $L$의 양의 고유값이 장기 성장률, 그 고유벡터가 안정된 연령 분포입니다.

**④ 진동계.** 스프링으로 연결된 질량들은 $\mathbf y''=A\mathbf y$이고, $\mathbf y=\mathbf x\cos\omega t$를 넣으면 $A\mathbf x=-\omega^2\mathbf x$. 고유값 $\lambda=-\omega^2$에서 **고유진동수**가, 고유벡터에서 **진동 모드**가 나옵니다.

:::ex 예제 3
$y_1''=-2y_1+y_2$, $y_2''=y_1-2y_2$ (같은 질량 둘, 같은 스프링 셋)
---
$A=\begin{pmatrix}-2&1\\1&-2\end{pmatrix}$의 고유값 $-1$ ($(1,1)^T$), $-3$ ($(1,-1)^T$).
같은 방향으로 움직이는 모드는 $\omega=1$, 반대 방향 모드는 $\omega=\sqrt3$. 일반해 $\mathbf y=(1,1)^T(a_1\cos t+b_1\sin t)+(1,-1)^T(a_2\cos\sqrt3t+b_2\sin\sqrt3t)$[[ch03:4.1|연립 ODE 모델.]].
:::

연속체(현, 막)에서는 행렬 대신 미분연산자의 고유값 문제가 되어 고유함수와 고유진동수가 나옵니다[[ch10:11.5|스투름-리우빌 문제: 미분방정식의 고유값 문제.]][[ch11:12.9|직사각형 막의 고유진동.]].
` },
      { k: '8.3', p: '334', title: '대칭·반대칭·직교 행렬', body: R`
:::def 세 가지 실행렬
**대칭** $A^T=A$, **반대칭** $A^T=-A$, **직교** $A^T=A^{-1}$ (즉 $A^TA=I$).
:::

모든 정사각행렬은 대칭 부분과 반대칭 부분의 합으로 유일하게 쓸 수 있습니다: $A=R+S$, $R=\frac12(A+A^T)$, $S=\frac12(A-A^T)$. 예: $\begin{pmatrix}1&4\\2&3\end{pmatrix}=\begin{pmatrix}1&3\\3&3\end{pmatrix}+\begin{pmatrix}0&1\\-1&0\end{pmatrix}$.

:::key 특수 행렬과 고유값
| 행렬 | 정의 | 고유값 |
|---|---|---|
| 대칭 | $A^T=A$ | 모두 실수 |
| 반대칭 | $A^T=-A$ | 순허수 또는 0 |
| 직교 | $A^T=A^{-1}$ | 절댓값 1 |
| 에르미트 | $\bar A^T=A$ | 모두 실수 |
| 유니터리 | $\bar A^T=A^{-1}$ | 절댓값 1 |
:::

**직교 변환의 성질.**
- **내적과 길이를 보존**합니다(Theorem 2): $(A\mathbf a)\cdot(A\mathbf b)=\mathbf a^TA^TA\mathbf b=\mathbf a\cdot\mathbf b$. 그래서 회전과 반사만이 직교 변환입니다.
- 행벡터들과 열벡터들이 각각 **정규직교계**입니다(Theorem 3)[[ch06:7.9|내적공간과 정규직교.]].
- $\det A=\pm1$ (Theorem 4): $1=\det(A^TA)=(\det A)^2$. $+1$이면 회전, $-1$이면 반사를 포함합니다.
- 고유값은 실수이거나 켤레 복소수 쌍이고 절댓값이 1입니다(Theorem 5), 즉 복소평면의 단위원 위에 있습니다[[ch12:13.2|극형식 $e^{i\theta}$와 단위원.]].

:::ex 예제
회전행렬 $\begin{pmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{pmatrix}$의 고유값은?
---
$\lambda^2-2\cos\theta\,\lambda+1=0$에서 $\lambda=\cos\theta\pm i\sin\theta=e^{\pm i\theta}$. $\theta\ne0,\pi$이면 실수 고유벡터가 없습니다(모든 방향이 돌아가므로 당연). 3차원 회전은 고유값 $1$ (회전축)과 $e^{\pm i\theta}$를 가집니다.
:::

실대칭행렬에서 서로 다른 고유값의 고유벡터는 **직교**합니다. 이것이 다음 절의 주축 정리와, 미분연산자에서의 고유함수 직교성의 행렬판입니다[[ch10:11.5|스투름-리우빌 고유함수의 직교성.]].
` },
      { k: '8.4', p: '339', title: '고유기저, 대각화, 이차형식', body: R`
**고유기저.** $\mathbb R^n$의 기저를 고유벡터로 잡을 수 있으면 $A$의 작용이 좌표마다 곱하기로 분리됩니다.
- 고유값이 모두 서로 다르면 고유벡터들이 일차독립이라 고유기저가 있습니다(교재 Theorem 1).
- **대칭행렬은 항상 정규직교 고유기저**를 가집니다(Theorem 2).

**닮음.** $\hat A=P^{-1}AP$를 $A$와 닮은 행렬이라 하고, 둘은 같은 고유값을 가지며 $\mathbf x$가 $A$의 고유벡터이면 $P^{-1}\mathbf x$가 $\hat A$의 고유벡터입니다(Theorem 3). 같은 선형변환을 다른 기저로 본 것입니다.

:::key 대각화
$$D=X^{-1}AX=\operatorname{diag}(\lambda_1,\dots,\lambda_n),\qquad A^k=XD^kX^{-1}$$
$$\text{실대칭행렬: } A=QDQ^T\quad(Q\text{의 열은 정규직교 고유벡터})$$
:::

고유벡터를 열로 모은 $X$로 대각화됩니다(Theorem 4). $A^k$, $e^{At}$ 같은 계산과 연립 ODE의 분리에 씁니다[[ch03:4.6|대각화로 연립 ODE 분리하기.]].

:::ex 예제 1
$A=\begin{pmatrix}4&1\\2&3\end{pmatrix}$을 대각화하세요.
---
$\lambda^2-7\lambda+10=0$에서 $\lambda=2,5$. 고유벡터 $(1,-2)^T$, $(1,1)^T$.
$$X=\begin{pmatrix}1&1\\-2&1\end{pmatrix},\quad X^{-1}=\frac13\begin{pmatrix}1&-1\\2&1\end{pmatrix},\quad X^{-1}AX=\begin{pmatrix}2&0\\0&5\end{pmatrix}$$
:::

:::warn 대각화 조건
고유값이 중복되면 고유벡터가 부족할 수 있습니다. $\begin{pmatrix}2&1\\0&2\end{pmatrix}$는 고유값 2가 이중근이지만 고유벡터가 $(1,0)^T$ 방향 하나뿐이라(결함 1) 대각화되지 않습니다.
:::

**이차형식.** $Q=\mathbf x^TA\mathbf x=\sum_j\sum_ka_{jk}x_jx_k$. 계수행렬은 항상 **대칭**으로 잡습니다(교차항 계수를 반으로 나눠 양쪽에). 대칭행렬의 정규직교 고유벡터로 좌표를 돌리면 교차항이 사라집니다(Theorem 5, 주축 정리).[[@base:ch04:4.3|헤시안: 함수의 2차 근사가 이차형식이고, 그 정부호성으로 극값을 판정한다.]]

:::key 주축 변환
$$ax_1^2+2bx_1x_2+cx_2^2=\mathbf x^T\begin{pmatrix}a&b\\b&c\end{pmatrix}\mathbf x=\lambda_1y_1^2+\lambda_2y_2^2,\qquad \mathbf x=X\mathbf y$$
$$\lambda_1\lambda_2>0:\ \text{타원},\qquad \lambda_1\lambda_2<0:\ \text{쌍곡선}$$
:::

:::ex 예제 2
$5x_1^2-4x_1x_2+8x_2^2=36$은 어떤 곡선인가?
---
$A=\begin{pmatrix}5&-2\\-2&8\end{pmatrix}$, $\lambda^2-13\lambda+36=0$에서 $\lambda=4,9$. 주축 좌표에서 $4y_1^2+9y_2^2=36$, 즉
$$\frac{y_1^2}{9}+\frac{y_2^2}{4}=1$$
반지름 3 ($\lambda=4$의 고유벡터 $(2,1)^T$ 방향), 반지름 2 ($(1,-2)^T$ 방향)인 타원입니다. 단원 표지 그림이 이런 등위선과 두 주축입니다.
:::

:::warn 교차항의 절반
$3x_1^2+6x_1x_2+2x_2^2$의 행렬은 $\begin{pmatrix}3&3\\3&2\end{pmatrix}$입니다. 교차항 계수 6을 그대로 비대각성분에 넣지 마세요.
:::

모든 고유값이 양수이면 $Q$는 **양의 정부호**($\mathbf x\ne\mathbf 0$이면 $Q>0$)이고, 2×2에서는 $a>0$, $ac-b^2>0$과 같습니다. 일반적으로는 주 소행렬식들이 모두 양수인 것과 같습니다.
` },
      { k: '8.5', p: '346', title: '복소 행렬과 형식 (선택)', body: R`
양자역학이나 복소 진동 해석에서는 성분이 복소수인 행렬이 필요합니다. 켤레전치 $\bar A^T$ ($A^*$ 또는 $A^H$로도 씀)가 전치의 역할을 합니다[[ch12:13.1|켤레 복소수.]].

:::def 에르미트·반에르미트·유니터리
**에르미트** $\bar A^T=A$ (실수이면 대칭), **반에르미트** $\bar A^T=-A$ (실수이면 반대칭), **유니터리** $\bar A^T=A^{-1}$ (실수이면 직교).
:::

- **고유값**(교재 Theorem 1): 에르미트는 실수, 반에르미트는 순허수 또는 0, 유니터리는 절댓값 1. 실행렬의 세 경우(8.3절)를 포함하는 일반화입니다.
- **복소 내적**은 $\mathbf a\cdot\mathbf b=\bar{\mathbf a}^T\mathbf b$로 정의합니다(켤레를 취하지 않으면 $\mathbf a\cdot\mathbf a$가 음수나 복소수가 될 수 있음). 유니터리 변환은 이 내적을 보존하고(Theorem 2), $|\det A|=1$ (Theorem 4).
- 에르미트, 반에르미트, 유니터리 행렬은 모두 유니터리 고유기저를 가집니다(Theorem 5).
- **에르미트 형식** $\bar{\mathbf x}^TA\mathbf x$ ($A$ 에르미트)는 항상 실수입니다. 에르미트 행렬의 고유값이 실수인 이유이기도 합니다.

:::ex 예제
(a) $A=\begin{pmatrix}2&1-i\\1+i&3\end{pmatrix}$의 고유값, (b) $U=\frac1{\sqrt2}\begin{pmatrix}1&i\\i&1\end{pmatrix}$이 유니터리임을 보이고 고유값을 구하세요.
---
(a) 에르미트입니다. $\lambda^2-5\lambda+(6-|1-i|^2)=\lambda^2-5\lambda+4=0$, $\lambda=1,4$ (실수) ✓
(b) $\bar U^TU=\frac12\begin{pmatrix}1&-i\\-i&1\end{pmatrix}\begin{pmatrix}1&i\\i&1\end{pmatrix}=\frac12\begin{pmatrix}2&0\\0&2\end{pmatrix}=I$ ✓. $\big(\frac1{\sqrt2}-\lambda\big)^2=-\frac12$에서 $\lambda=\frac{1\pm i}{\sqrt2}$, 절댓값 1 ✓
:::

:::tip 시험 포인트
특성다항식을 전개하기 전에 $\tr A$와 $\det A$를 적어 두면, 구한 고유값의 합과 곱으로 바로 검산할 수 있습니다. 행렬의 “종류”를 먼저 확인하면 고유값이 실수인지, 단위원 위에 있는지 미리 알 수 있습니다.
:::
` },
    ],
  });
})();
