/* 개념 정리 — 03 연립 ODE와 상평면 (Kreyszig 10판 4장, §4.0–4.6). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 3,
    summary: R`미지함수가 여러 개인 **연립 ODE** $\mathbf y'=A\mathbf y+\mathbf g$를 다룹니다. 풀이는 행렬의 **고유값 문제**로 바뀌고, 해를 $(y_1,y_2)$ 평면의 궤적으로 그리는 **상평면 방법**으로 임계점의 종류와 안정성을 식을 풀지 않고도 판정합니다. 비선형계는 임계점 근처에서 선형화해 같은 방법을 씁니다. 교재 4장의 구성을 따릅니다.`,
    goals: [
      R`$n$계 ODE를 1계 연립 ODE로 바꾸고, 혼합·회로 문제를 연립 ODE로 세울 수 있다`,
      R`연립 ODE의 기저, 론스키안, 기본행렬을 설명할 수 있다`,
      R`실수·복소수·중복 고유값의 경우 일반해를 쓰고 상평면 그림을 해석할 수 있다`,
      R`$p=\tr A$, $q=\det A$로 임계점의 종류와 안정성을 판정할 수 있다`,
      R`비선형계의 임계점을 찾아 야코비 행렬로 선형화하고, 진자·포식자-피식자·판 데르 폴 모델을 해석할 수 있다`,
      R`비동차 연립 ODE의 특수해를 미정계수법·매개변수 변환법으로 구할 수 있다`,
    ],
    sections: [
      { k: '4.1', p: '130', title: '연립 ODE 모델과 행렬 표기', body: R`
여러 미지함수가 서로 얽힌 방정식은 벡터 $\mathbf y=(y_1,\dots,y_n)^T$로 묶어 $\mathbf y'=A\mathbf y+\mathbf g(t)$로 씁니다. 교재는 이 장 앞(4.0절)에서 필요한 행렬 계산(곱, 행렬식, 역행렬, 고유값)을 짧게 복습합니다. 자세한 내용은 선형대수 단원에 있습니다[[ch06:7.2|행렬의 곱.]][[ch07:8.1|고유값과 고유벡터 구하기.]].

### 4.0 복습: 이 장에 필요한 행렬 계산

- **행렬-벡터 곱**: $A\mathbf x$의 $j$번째 성분은 $\sum_ma_{jm}x_m$ (행과 열을 곱해 더함). 행렬곱은 일반적으로 교환법칙이 성립하지 않습니다.
- **미분**: 행렬이나 벡터의 도함수는 성분마다 미분한 것입니다. 그래서 두 방정식 $y_1'=a_{11}y_1+a_{12}y_2$, $y_2'=a_{21}y_1+a_{22}y_2$는 한 벡터 방정식 $\mathbf y'=A\mathbf y$와 같습니다.
- **2×2 역행렬**: $\det A=a_{11}a_{22}-a_{12}a_{21}\ne0$이면 $A^{-1}=\dfrac1{\det A}\begin{bmatrix}a_{22}&-a_{12}\\-a_{21}&a_{11}\end{bmatrix}$.
- **고유값 문제**: $A\mathbf x=\lambda\mathbf x$, $\mathbf x\ne\mathbf 0$. $(A-\lambda I)\mathbf x=\mathbf 0$이 자명하지 않은 해를 가지려면 $\det(A-\lambda I)=0$이어야 하고, 2×2이면
$$\det(A-\lambda I)=\lambda^2-(a_{11}+a_{22})\lambda+\det A=0$$
입니다(**특성방정식**). 근이 고유값이고, 각 고유값을 $(A-\lambda I)\mathbf x=\mathbf 0$에 넣으면 고유벡터가 나옵니다. $\mathbf x$가 고유벡터이면 $k\mathbf x$ ($k\ne0$)도 고유벡터입니다.

### 연립 ODE가 나오는 곳

한 탱크 혼합 문제가 ODE 하나였듯, 탱크 두 개면 1계 ODE 두 개의 연립이 됩니다. 문제의 “크기”가 커지면 모델의 방정식 수도 같이 늘어나는 것은 모델링이 잘 되었다는 표시입니다.

:::ex 예제 1 (두 탱크 혼합)
각 200 L인 탱크 T1, T2가 있다. 처음에 T1은 순수한 물이고 T2에는 비료 60 kg이 녹아 있다. 두 탱크 사이로 물을 10 L/min씩 순환시키며 잘 저어 균일하게 유지할 때, T1의 비료가 T2의 절반이 되려면 얼마나 순환시켜야 하는가?
---
**1단계: 모델.** 각 탱크의 변화율 = 유입 − 유출. T1에는 T2의 물 10 L(비료 $10\cdot\frac{y_2}{200}$)가 들어오고 자기 물 10 L(비료 $10\cdot\frac{y_1}{200}$)가 나갑니다. T2는 반대입니다.
$$y_1'=-0.05y_1+0.05y_2,\qquad y_2'=0.05y_1-0.05y_2,\qquad\text{곧}\quad\mathbf y'=\begin{pmatrix}-0.05&0.05\\0.05&-0.05\end{pmatrix}\mathbf y$$
**2단계: 일반해.** ODE 하나일 때처럼 지수함수 $\mathbf y=\mathbf xe^{\lambda t}$를 시도하면 $\lambda\mathbf xe^{\lambda t}=A\mathbf xe^{\lambda t}$, 곧 $A\mathbf x=\lambda\mathbf x$가 되어 고유값 문제가 됩니다. 특성방정식 $(\lambda+0.05)^2-0.05^2=\lambda(\lambda+0.1)=0$에서 $\lambda_1=0$, $\lambda_2=-0.1$ (고유값이 0인 것은 괜찮습니다. 0이면 안 되는 것은 고유벡터입니다). 고유벡터는 $\mathbf x^{(1)}=(1,1)^T$, $\mathbf x^{(2)}=(1,-1)^T$이고, 중첩 원리로
$$\mathbf y=c_1\begin{pmatrix}1\\1\end{pmatrix}+c_2\begin{pmatrix}1\\-1\end{pmatrix}e^{-0.1t}$$
**3단계: 초기조건.** $y_1(0)=c_1+c_2=0$, $y_2(0)=c_1-c_2=60$에서 $c_1=30$, $c_2=-30$.
$$y_1=30-30e^{-0.1t},\qquad y_2=30+30e^{-0.1t}$$
T1은 지수적으로 늘고 T2는 줄어 둘 다 30 kg에 다가갑니다. 두 곡선이 30을 기준으로 대칭인 것은 전체 양 $y_1+y_2=60$이 보존되기 때문입니다. 고유벡터 $(1,1)^T$가 “두 탱크 농도가 같아진 평형”, $(1,-1)^T$가 “차이가 $e^{-0.1t}$로 사라짐”을 뜻합니다.

**4단계: 답.** T1이 T2의 절반이면 T1은 전체의 $\frac13$, 곧 20 kg입니다. $30-30e^{-0.1t}=20$에서 $e^{-0.1t}=\frac13$, $t=10\ln3\approx11.0$ min.
:::

:::ex 예제 2 (전기 회로망)
그림 없이 설명하면: 왼쪽 고리에는 전지 $E=12$ V, 인덕터 $L=1$ H, 두 고리가 공유하는 저항 $R_1=6\ \Omega$이 있고, 오른쪽 고리에는 $R_1$, 저항 $R_2=12\ \Omega$, 콘덴서 $C=\frac1{18}$ F가 있다. $t=0$에 스위치를 닫을 때 모든 전류와 전하는 0이다. 고리 전류 $I_1(t)$, $I_2(t)$를 구하세요.
---
**1단계: 모델.** 공유 저항에는 두 고리 전류가 반대 방향으로 흐르므로 전압 강하가 $R_1(I_1-I_2)$입니다. 왼쪽 고리에 키르히호프 전압 법칙을 쓰면
$$I_1'+6(I_1-I_2)=12\quad\Longrightarrow\quad I_1'=-6I_1+6I_2+12$$
오른쪽 고리는 전지가 없으므로 전압 강하의 합이 0입니다.
$$12I_2+6(I_2-I_1)+18\int I_2\,dt=0$$
18로 나누고 미분하면 $I_2'-\frac13I_1'+I_2=0$입니다. 풀이를 간단히 하려고 $I_1'$에 첫 식을 넣으면
$$I_2'=\tfrac13(-6I_1+6I_2+12)-I_2=-2I_1+I_2+4$$
행렬로 쓰면($I$는 단위행렬과 헷갈리므로 $\mathbf J$로)
$$\mathbf J'=A\mathbf J+\mathbf g,\qquad A=\begin{pmatrix}-6&6\\-2&1\end{pmatrix},\quad\mathbf g=\begin{pmatrix}12\\4\end{pmatrix}$$
**2단계: 동차해.** $\det(A-\lambda I)=\lambda^2+5\lambda+6=(\lambda+2)(\lambda+3)$. $\lambda_1=-2$: $\begin{pmatrix}-4&6\\-2&3\end{pmatrix}\mathbf x=\mathbf 0$에서 $\mathbf x^{(1)}=(3,2)^T$. $\lambda_2=-3$: $\mathbf x^{(2)}=(2,1)^T$.

**3단계: 특수해.** $\mathbf g$가 상수이므로 상수 벡터 $\mathbf J_p=\mathbf a$를 시도합니다. $\mathbf J_p'=\mathbf 0$이므로 $A\mathbf a+\mathbf g=\mathbf 0$: $-6a_1+6a_2+12=0$, $-2a_1+a_2+4=0$에서 $a_1=2$, $a_2=0$. 콘덴서가 직류를 막으니 오래 지나면 오른쪽 전류는 0, 왼쪽은 $E/R_1=2$ A라는 물리적 예상과 맞습니다.

**4단계: 초기조건.** $\mathbf J=c_1(3,2)^Te^{-2t}+c_2(2,1)^Te^{-3t}+(2,0)^T$에서 $3c_1+2c_2+2=0$, $2c_1+c_2=0$. 따라서 $c_1=2$, $c_2=-4$.
$$I_1=6e^{-2t}-8e^{-3t}+2,\qquad I_2=4e^{-2t}-4e^{-3t}$$
$I_1$은 $t=\ln2$에서 최대 2.5 A까지 올랐다가 2 A로 내려갑니다.

**상평면.** 두 전류를 따로 그리는 대신, $t$를 매개변수로 점 $(I_1(t),I_2(t))$가 그리는 곡선 하나로 볼 수도 있습니다. 이 평면을 **상평면**, 곡선을 **궤적**이라 하고, $t$가 커지는 방향을 화살표로 표시합니다. 이 관점이 해 하나가 아니라 해 전체의 모양을 보여 주므로 훨씬 중요합니다(§4.3).
:::

:::fig f03net
:::

### n계 ODE를 1계 연립으로

:::key n계 ODE → 1계 연립
$$y_1=y,\quad y_2=y',\quad\dots,\quad y_n=y^{(n-1)}$$
$$y_1'=y_2,\ \dots,\ y_{n-1}'=y_n,\ y_n'=F(t,y_1,\dots,y_n)$$
:::

$y^{(n)}=F(t,y,y',\dots,y^{(n-1)})$에서 처음 $n-1$개의 식은 정의를 미분한 것이고, 마지막 식은 $y_n'=y^{(n)}$에 원래 방정식을 쓴 것입니다(교재 Theorem 1). 그래서 **모든 $n$계 ODE는 1계 연립 ODE**가 됩니다. 실용적으로는 단일 ODE를 연립 ODE의 방법(수치해법 포함)으로 풀 수 있고, 이론적으로는 고계 ODE의 이론을 1계 연립의 이론에 포함시킬 수 있습니다.

:::ex 예제 3 (질량-스프링계)
$my''+cy'+ky=0$을 연립 ODE로 쓰고, $m=1$, $c=3$, $k=2$일 때 풀어 보세요.
---
$y_1=y$, $y_2=y'$로 두면 $y_1'=y_2$, $y_2'=-\frac kmy_1-\frac cmy_2$, 곧
$$\mathbf y'=\begin{pmatrix}0&1\\-k/m&-c/m\end{pmatrix}\mathbf y,\qquad\det(A-\lambda I)=\lambda^2+\frac cm\lambda+\frac km$$
특성방정식은 §2.4와 같습니다[[ch02:2.4|질량-스프링계의 자유진동.]]. 수치를 넣으면 $\lambda^2+3\lambda+2=(\lambda+1)(\lambda+2)$. 고유벡터는 첫 행 $-\lambda x_1+x_2=0$에서 $\lambda=-1$이면 $(1,-1)^T$, $\lambda=-2$이면 $(1,-2)^T$.
$$\mathbf y=c_1\begin{pmatrix}1\\-1\end{pmatrix}e^{-t}+c_2\begin{pmatrix}1\\-2\end{pmatrix}e^{-2t}$$
첫 성분 $y=c_1e^{-t}+c_2e^{-2t}$가 익숙한 해이고, 둘째 성분 $-c_1e^{-t}-2c_2e^{-2t}$는 그 도함수입니다.
:::
` },
      { k: '4.2', p: '137', title: '연립 ODE의 기본 이론', body: R`
앞 절의 연립 ODE는 더 일반적인
$$y_1'=f_1(t,y_1,\dots,y_n),\quad\dots,\quad y_n'=f_n(t,y_1,\dots,y_n),\qquad\text{곧}\quad\mathbf y'=\mathbf f(t,\mathbf y)$$
의 특수한 경우입니다. $n=1$이면 1장의 $y'=f(t,y)$입니다. 구간 $a<t<b$에서의 **해**는 이 식을 만족하는 미분 가능한 함수 $n$개(해 벡터 $\mathbf y=\mathbf h(t)$)이고, **초기값 문제**는 $n$개의 초기조건 $\mathbf y(t_0)=\mathbf K$를 더한 것입니다.

:::thm 존재·유일성 (교재 §4.2 Theorem 1, 2)
$f_1,\dots,f_n$과 편도함수 $\partial f_i/\partial y_j$가 점 $(t_0,K_1,\dots,K_n)$을 포함하는 영역에서 연속이면, 초기값 문제는 어떤 구간 $|t-t_0|<\alpha$에서 유일한 해를 가집니다. **선형계** $\mathbf y'=A(t)\mathbf y+\mathbf g(t)$는 $a_{jk}(t)$, $g_j(t)$가 연속인 열린 구간 **전체**에서 유일한 해를 가집니다.
:::

1장의 정리를 확장한 것입니다[[ch01:1.7|1계 ODE의 존재·유일성.]]. 선형계에서는 $\partial f_j/\partial y_k=a_{jk}(t)$라서 조건이 자동으로 간단해집니다. $\mathbf g\equiv\mathbf 0$이면 **동차**, 아니면 **비동차**입니다. 앞 절의 예제 1, 3은 동차, 예제 2는 비동차입니다.

:::thm 중첩 원리 (교재 §4.2 Theorem 3)
$\mathbf y^{(1)}$, $\mathbf y^{(2)}$가 동차 선형계 $\mathbf y'=A\mathbf y$의 해이면 일차결합 $c_1\mathbf y^{(1)}+c_2\mathbf y^{(2)}$도 해입니다.
:::

증명: $(c_1\mathbf y^{(1)}+c_2\mathbf y^{(2)})'=c_1A\mathbf y^{(1)}+c_2A\mathbf y^{(2)}=A(c_1\mathbf y^{(1)}+c_2\mathbf y^{(2)})$.

### 기저, 일반해, 론스키안

선형계의 이론은 §2.6, 2.7의 단일 선형 ODE의 이론과 아주 비슷합니다.

- **기저**(기본계): 구간 $J$에서 일차독립인 해 $n$개 $\mathbf y^{(1)},\dots,\mathbf y^{(n)}$.
- **일반해**: $\mathbf y=c_1\mathbf y^{(1)}+\cdots+c_n\mathbf y^{(n)}$. $a_{jk}(t)$가 $J$에서 연속이면 기저가 존재하고, 일반해는 **모든** 해를 포함합니다.

:::def 기본행렬과 론스키안
해 벡터들을 열로 세운 행렬 $Y=[\mathbf y^{(1)}\ \cdots\ \mathbf y^{(n)}]$를 **기본행렬**, 그 행렬식 $W=\det Y$를 **론스키안**이라 합니다. 해들이 기저 $\iff$ 어떤 한 점에서 $W\ne0$ ($W$는 항상 0이거나 항상 0이 아님).
:::

기본행렬과 상수 벡터 $\mathbf c=(c_1,\dots,c_n)^T$로 일반해를 짧게 $\mathbf y=Y\mathbf c$로 씁니다. 초기조건 $\mathbf y(t_0)=\mathbf K$는 연립일차방정식 $Y(t_0)\mathbf c=\mathbf K$이고, $W(t_0)\ne0$이므로 유일한 해를 가집니다.

**2계 ODE와의 관계.** $y$, $z$가 2계 동차 선형 ODE의 해이면 그 론스키안은 $\begin{vmatrix}y&z\\y'&z'\end{vmatrix}$이었습니다. ODE를 연립으로 바꾸려고 $y_1=y$, $y_2=y'$로 두면(z도 같게) 해 벡터는 $(y,y')^T$, $(z,z')^T$이고 그 론스키안은 표기만 다를 뿐 같은 행렬식입니다[[ch02:2.6|2계 ODE의 론스키안.]].

:::ex 예제
$\mathbf y^{(1)}=(1,1)^Te^{-t}$, $\mathbf y^{(2)}=(1,-2)^Te^{-4t}$는 기저인가?
---
$$W=\begin{vmatrix}e^{-t}&e^{-4t}\\e^{-t}&-2e^{-4t}\end{vmatrix}=-2e^{-5t}-e^{-5t}=-3e^{-5t}\ne0$$
따라서 기저입니다(다음 절 예제 1의 해). $W$가 어느 $t$에서도 0이 아니라는 것도 정리와 일치합니다.
:::
` },
      { k: '4.3', p: '140', title: '상수계수 연립 ODE와 상평면', body: R`
이제 $A$가 상수인 동차 선형계 $\mathbf y'=A\mathbf y$를 풉니다. 단일 ODE $y'=ky$의 해가 $Ce^{kt}$였으므로
$$\mathbf y=\mathbf xe^{\lambda t}$$
를 시도합니다. 대입하면 $\mathbf y'=\lambda\mathbf xe^{\lambda t}=A\mathbf xe^{\lambda t}$이고 $e^{\lambda t}$로 나누면 $A\mathbf x=\lambda\mathbf x$, 곧 **고유값 문제**입니다[[ch07:8.1|특성방정식 $\det(A-\lambda I)=0$.]]. 따라서 $\mathbf 0$이 아닌 해는 $\lambda$가 $A$의 고유값, $\mathbf x$가 대응하는 고유벡터일 때 이 꼴입니다.

:::key 고유값 방법
$$\mathbf y=c_1\mathbf x^{(1)}e^{\lambda_1t}+\cdots+c_n\mathbf x^{(n)}e^{\lambda_nt}\qquad(\text{독립인 고유벡터가 } n\text{개일 때})$$
$$\text{중복 고유값(고유벡터 1개): }\ \mathbf y^{(2)}=\mathbf x\,te^{\lambda t}+\mathbf u\,e^{\lambda t},\qquad (A-\lambda I)\mathbf u=\mathbf x$$
:::

**왜 일반해인가(교재 Theorem 1).** 고유벡터 $\mathbf x^{(1)},\dots,\mathbf x^{(n)}$이 일차독립이면 해 $\mathbf x^{(j)}e^{\lambda_jt}$들의 론스키안은
$$W=e^{(\lambda_1+\cdots+\lambda_n)t}\det\big[\mathbf x^{(1)}\ \cdots\ \mathbf x^{(n)}\big]$$
입니다(각 열에서 지수함수를 꺼냄). 지수함수는 0이 아니고, 행렬식은 열이 독립인 고유벡터들이라 0이 아니므로 $W\ne0$, 곧 기저입니다. 이 가정은 $A$가 **대칭**($a_{kj}=a_{jk}$)이거나 **반대칭**($a_{kj}=-a_{jk}$)이거나 고유값이 모두 다를 때 성립하고, 응용의 대부분이 그렇습니다[[ch07:8.4|고유기저와 대각화.]].

### 상평면에 해 그리기

이제 $n=2$인 경우에 집중합니다.
$$y_1'=a_{11}y_1+a_{12}y_2,\qquad y_2'=a_{21}y_1+a_{22}y_2$$
해 $\mathbf y(t)=(y_1(t),y_2(t))^T$를 $t$축 위의 곡선 두 개로 그릴 수도 있지만, $t$를 매개변수로 하는 $y_1y_2$ 평면의 곡선 **하나**로 그릴 수도 있습니다. 이 곡선이 **궤적**(궤도, 경로), 평면이 **상평면**, 궤적들을 가득 채운 그림이 **상 초상**(phase portrait)입니다. (이름은 위치 $y$와 운동량 $mv$로 운동을 그리는 물리에서 왔습니다.) 상 초상은 방정식을 풀지 않고도 해 전체의 정성적인 모습을 보여 주는 방법으로, 푸앵카레가 만들었습니다. 1계 ODE의 방향장에 해당합니다[[ch01:1.2|방향장.]].

### 임계점

두 식을 나누면 $t$가 사라지고
$$\frac{dy_2}{dy_1}=\frac{y_2'}{y_1'}=\frac{a_{21}y_1+a_{22}y_2}{a_{11}y_1+a_{12}y_2}$$
입니다. 이 식은 점 $P:(y_1,y_2)$마다 그 점을 지나는 궤적의 접선 방향을 하나씩 정해 주는데, 원점에서만 $\frac00$이 되어 방향이 정해지지 않습니다. 이런 점을 **임계점**이라 합니다. $\det A\ne0$이면 임계점은 원점 하나입니다. 임계점 근처에서 궤적이 어떤 모양인지에 따라 다섯 가지(퇴화 마디점을 따로 세면 여섯 가지) 종류가 있습니다.

:::fig f03types
:::

:::ex 예제 1 (비고유 마디점)
$\mathbf y'=\begin{pmatrix}-2&1\\2&-3\end{pmatrix}\mathbf y$의 일반해와 임계점의 종류는?
---
$\det(A-\lambda I)=(\lambda+2)(\lambda+3)-2=\lambda^2+5\lambda+4=(\lambda+1)(\lambda+4)$, $\lambda=-1,-4$.
$\lambda=-1$: $\begin{pmatrix}-1&1\\2&-2\end{pmatrix}\mathbf x=\mathbf 0$에서 $\mathbf x=(1,1)^T$. $\lambda=-4$: $\begin{pmatrix}2&1\\2&1\end{pmatrix}\mathbf x=\mathbf 0$에서 $\mathbf x=(1,-2)^T$.
$$\mathbf y=c_1\begin{pmatrix}1\\1\end{pmatrix}e^{-t}+c_2\begin{pmatrix}1\\-2\end{pmatrix}e^{-4t}$$
모든 궤적이 원점으로 들어갑니다. $e^{-4t}$가 $e^{-t}$보다 빨리 사라지므로 두 직선 궤적($c_1=0$)을 빼면 모든 궤적이 결국 $(1,1)^T$ 방향에 접하며 들어갑니다. 이렇게 **두 궤적을 빼고 모든 궤적이 같은 극한 접선 방향**을 가지는 임계점을 **비고유 마디점**이라 합니다. 예외인 두 궤적의 방향은 $\pm(1,-2)^T$입니다.
:::

:::ex 예제 2 (고유 마디점)
$y_1'=-y_1$, $y_2'=-y_2$
---
$A=-I$이므로 특성방정식 $(\lambda+1)^2=0$, 모든 $\mathbf x\ne\mathbf 0$이 고유벡터입니다. $(1,0)^T$, $(0,1)^T$를 고르면 $y_1=c_1e^{-t}$, $y_2=c_2e^{-t}$, 곧 $c_1y_2=c_2y_1$: 원점을 지나는 모든 직선입니다. **모든 궤적이 정해진 극한 방향을 가지고, 어떤 방향 $\mathbf d$로 들어가는 궤적도 있는** 이런 점을 **고유 마디점**이라 합니다.
:::

:::ex 예제 3 (안장점)
$y_1'=y_1$, $y_2'=-y_2$
---
고유값 $1$ (고유벡터 $(1,0)^T$)과 $-1$ ($(0,1)^T$). $y_1=c_1e^{t}$, $y_2=c_2e^{-t}$이므로 $y_1y_2=c_1c_2$ (상수): 쌍곡선족과 두 좌표축입니다. **들어오는 궤적 둘, 나가는 궤적 둘이 있고 나머지는 모두 비켜 가는** 이런 점을 **안장점**이라 합니다.
:::

:::ex 예제 4 (중심)
$y_1'=y_2$, $y_2'=-9y_1$
---
$\lambda^2+9=0$, $\lambda=\pm3i$. 복소 고유벡터로 풀어도 되지만 요령이 있습니다. 첫 식의 좌변과 둘째 식의 우변의 곱은 둘째 식의 좌변과 첫 식의 우변의 곱과 같아야 합니다: $-9y_1y_1'=y_2y_2'$. 적분하면
$$\tfrac92y_1^2+\tfrac12y_2^2=\text{상수}$$
로 원점을 둘러싼 타원족입니다. **무한히 많은 닫힌 궤적으로 둘러싸인** 이런 점을 **중심**이라 합니다. 해가 주기적인 경우입니다.
:::

:::ex 예제 5 (나선점)
$\mathbf y'=\begin{pmatrix}-1&1\\-1&-1\end{pmatrix}\mathbf y$
---
$\lambda^2+2\lambda+2=0$, $\lambda=-1\pm i$. $\lambda=-1+i$이면 첫 행 $(-1-\lambda)x_1+x_2=-ix_1+x_2=0$에서 고유벡터 $(1,i)^T$. $\mathbf xe^{\lambda t}=e^{-t}(1,i)^T(\cos t+i\sin t)$의 실수부와 허수부를 취하면 실수 일반해
$$\mathbf y=e^{-t}\Big[c_1\begin{pmatrix}\cos t\\-\sin t\end{pmatrix}+c_2\begin{pmatrix}\sin t\\\cos t\end{pmatrix}\Big]$$
**지름길**: 첫 식에 $y_1$, 둘째 식에 $y_2$를 곱해 더하면 $y_1y_1'+y_2y_2'=-(y_1^2+y_2^2)$. 극좌표 $r^2=y_1^2+y_2^2$에서 $rr'=y_1y_1'+y_2y_2'$이므로 $rr'=-r^2$, 곧 $r'=-r$, $r=ce^{-t}$입니다. 각도는 일정한 속도로 돌므로 궤적은 원점으로 감겨 들어가는 나선입니다. **궤적이 나선을 그리며 다가가거나(또는 멀어지는)** 이런 점을 **나선점**이라 합니다.
:::

### 고유벡터 기저가 없을 때: 퇴화 마디점

$A$가 대칭이거나 반대칭이면 이런 일은 없고, 다른 많은 경우에도 없습니다. 예제로 방법을 설명합니다.

:::ex 예제 6 (중복 고유값)
$\mathbf y'=\begin{pmatrix}1&1\\-1&3\end{pmatrix}\mathbf y$
---
$\lambda^2-4\lambda+4=0$, $\lambda=2$ (중근). $A-2I=\begin{pmatrix}-1&1\\-1&1\end{pmatrix}$이므로 고유벡터는 $\mathbf x=(1,1)^T$와 그 배수뿐입니다. 두 번째 해를 찾으려고
$$\mathbf y^{(2)}=\mathbf x\,te^{\lambda t}+\mathbf u\,e^{\lambda t}$$
를 넣습니다. ($\mathbf xte^{\lambda t}$ 항만으로는 부족합니다. §2.2의 중근과 다른 점입니다.) 좌변은 $\mathbf xe^{\lambda t}+\lambda\mathbf xte^{\lambda t}+\lambda\mathbf ue^{\lambda t}$, 우변은 $A\mathbf xte^{\lambda t}+A\mathbf ue^{\lambda t}$이고 $A\mathbf x=\lambda\mathbf x$이므로 $te^{\lambda t}$ 항이 상쇄되고
$$\mathbf x+\lambda\mathbf u=A\mathbf u,\qquad\text{곧}\quad(A-\lambda I)\mathbf u=\mathbf x$$
여기서는 $-u_1+u_2=1$이므로 $\mathbf x$와 독립인 $\mathbf u=(0,1)^T$를 고릅니다.
$$\mathbf y=c_1\begin{pmatrix}1\\1\end{pmatrix}e^{2t}+c_2\Big[\begin{pmatrix}1\\1\end{pmatrix}te^{2t}+\begin{pmatrix}0\\1\end{pmatrix}e^{2t}\Big]$$
이런 임계점을 **퇴화 마디점**이라 합니다(여기서는 $\lambda>0$이라 불안정). 3×3 이상에서 삼중 고유값에 고유벡터가 하나뿐이면 세 번째 해를 $\mathbf y^{(3)}=\frac12\mathbf xt^2e^{\lambda t}+\mathbf ute^{\lambda t}+\mathbf ve^{\lambda t}$, $(A-\lambda I)\mathbf v=\mathbf u$로 얻습니다.
:::

- **복소 고유값** $\lambda=\alpha\pm i\beta$: $\mathbf xe^{\lambda t}$의 실수부와 허수부가 두 개의 실수해입니다(예제 5).
- **초기조건**은 $\mathbf y(0)=c_1\mathbf x^{(1)}+\cdots$ 연립일차방정식을 풀어 맞춥니다.
- 상평면 방법은 방정식을 풀기 불편하거나 불가능할 때 특히 쓸모 있습니다(§4.5).
` },
      { k: '4.4', p: '148', title: '임계점의 판정과 안정성', body: R`
앞 절에서 본 것을 정리하면, $\mathbf y'=A\mathbf y$의 해는 $\mathbf xe^{\lambda t}$ 꼴이고 상 초상의 모양은 **임계점의 종류**로 대부분 결정됩니다. 이 절의 새로운 내용은 그 종류가 고유값과 어떻게 연결되는지입니다. 고유값은 특성방정식
$$\det(A-\lambda I)=\lambda^2-(a_{11}+a_{22})\lambda+\det A=0$$
의 근입니다. 이 2차방정식을 $\lambda^2-p\lambda+q=0$으로 쓰면
$$p=a_{11}+a_{22}=\tr A,\qquad q=\det A,\qquad\Delta=p^2-4q$$
이고, 근은 $\lambda_{1,2}=\frac12(p\pm\sqrt\Delta)$입니다. 인수분해 $\lambda^2-p\lambda+q=(\lambda-\lambda_1)(\lambda-\lambda_2)$와 비교하면
$$p=\lambda_1+\lambda_2,\qquad q=\lambda_1\lambda_2,\qquad\Delta=(\lambda_1-\lambda_2)^2$$
곧 $p$는 고유값의 합, $q$는 곱입니다. 그래서 고유값을 구하지 않고 $p,q,\Delta$만으로 판정할 수 있습니다.

:::key 임계점의 종류
| 종류 | 조건 | 고유값 |
|---|---|---|
| 마디점 (node) | $q>0,\ \Delta\ge0$ | 부호가 같은 실근 |
| 안장점 (saddle) | $q<0$ | 부호가 다른 실근 |
| 중심 (center) | $p=0,\ q>0$ | 순허수 |
| 나선점 (spiral) | $p\ne0,\ \Delta<0$ | 실수부가 0이 아닌 복소근 |

| 안정성 | 조건 |
|---|---|
| 안정하고 끌어당김 | $p<0,\ q>0$ |
| 안정 | $p\le0,\ q>0$ |
| 불안정 | $p>0$ 또는 $q<0$ |
:::

### 안정성

안정성은 공학의 기본 개념입니다. 물리에서 안정이란 대략, 어떤 순간 계에 작은 교란이 생겨도 이후의 행동이 조금만 바뀐다는 뜻입니다. 임계점에 대해서는 다음과 같이 정의합니다(랴푸노프의 의미).

:::def 안정, 불안정, 안정하고 끌어당김
- 임계점 $P_0$이 **안정**하다: 대략 말해, 어떤 순간 $P_0$에 가까운 궤적은 이후 계속 가깝게 머문다. 정확히는 $P_0$ 중심의 임의의 반지름 $\epsilon>0$인 원판 $D_\epsilon$에 대해, 반지름 $\delta>0$인 원판 $D_\delta$가 있어서 $D_\delta$ 안의 점($t=t_1$)을 지나는 모든 궤적이 $t\ge t_1$에서 $D_\epsilon$ 안에 있다.
- **불안정**: 안정하지 않다.
- **안정하고 끌어당김**(점근 안정): 안정하고, $D_\delta$ 안의 점을 지나는 모든 궤적이 $t\to\infty$에서 $P_0$으로 간다.
:::

:::fig pq
:::

**판정 기준이 나오는 이유.**
- $q=\lambda_1\lambda_2>0$이면 두 고유값이 모두 양수이거나 모두 음수이거나 켤레 복소수입니다. 여기에 $p=\lambda_1+\lambda_2<0$이면 둘 다 음수이거나 실수부가 음수이므로 모든 해가 0으로 가고, 안정하고 끌어당깁니다.
- $\Delta<0$이면 $\lambda=\alpha\pm i\beta$이고 $p=2\alpha$입니다. $p<0$이면 안정하고 끌어당기는 나선점, $p>0$이면 불안정한 나선점입니다.
- $p=0$이면 $\lambda_2=-\lambda_1$, $q=-\lambda_1^2$입니다. $q>0$이면 $\lambda_1^2<0$이라 순허수이고, 해가 주기적이어서 궤적이 닫힌 곡선: 중심입니다.
- $q<0$이면 부호가 다른 두 실근이라 안장점이고, 양의 고유값 방향으로 궤적이 멀어지므로 불안정합니다.

그래서 안정성 도표에서 “안정하고 끌어당김”은 $pq$ 평면의 제2사분면($q$축 제외)이고, 양의 $q$축(중심)은 안정하지만 끌어당기지 않습니다.

- 중심은 안정하지만 끌어당기지 않습니다. 가까운 궤적이 가까이 돌 뿐 다가오지는 않기 때문입니다.
- 마디점은 다시 **비고유 마디점**(고유 방향이 둘), **고유 마디점**(모든 방향으로 직선 진입, $A=kI$), **퇴화 마디점**(고유벡터 하나)으로 나뉩니다.

:::ex 예제 1 (표 적용)
§4.3 예제 1의 $A=\begin{pmatrix}-2&1\\2&-3\end{pmatrix}$와 $\mathbf y'=\begin{pmatrix}2&-5\\1&-2\end{pmatrix}\mathbf y$의 임계점을 판정하세요.
---
첫 행렬: $p=-5$, $q=6-2=4$, $\Delta=25-16=9>0$ → 마디점, 그리고 $p<0$, $q>0$이므로 **안정하고 끌어당김**.
둘째 행렬: $p=0$, $q=-4+5=1>0$ → **중심**(안정, 끌어당기지 않음). 고유값 $\pm i$, 궤적은 원점을 도는 타원입니다.
:::

:::ex 예제 2 (질량-스프링계의 자유운동)
$my''+cy'+ky=0$의 임계점은 어떤 종류인가?
---
$y_1=y$, $y_2=y'$로 두면 $A=\begin{pmatrix}0&1\\-k/m&-c/m\end{pmatrix}$이므로 $p=-\frac cm$, $q=\frac km>0$, $\Delta=\frac{c^2}{m^2}-\frac{4k}m$.
- 감쇠 없음 ($c=0$): $p=0$, $q>0$ → **중심**.
- 부족감쇠 ($c^2<4mk$): $p<0$, $\Delta<0$ → **안정하고 끌어당기는 나선점**.
- 임계감쇠 ($c^2=4mk$): $p<0$, $\Delta=0$ → **안정하고 끌어당기는 마디점**(퇴화).
- 과감쇠 ($c^2>4mk$): $p<0$, $\Delta>0$ → **안정하고 끌어당기는 마디점**.

마지막 세 경우를 가르는 것은 판별식 $\Delta$입니다. §2.4의 세 가지 운동이 상평면에서 이렇게 보입니다[[ch02:2.4|감쇠의 세 경우.]].
:::

:::tip 시험 포인트
고유값을 끝까지 구하지 않아도 됩니다. $\tr A$와 $\det A$를 적고 표에 대입하면 종류와 안정성을 한 줄로 답할 수 있습니다. 2계 ODE $y''+ay'+by=0$을 연립으로 바꾸면 $p=-a$, $q=b$입니다.
:::
` },
      { k: '4.5', p: '152', title: '비선형계의 정성적 방법', body: R`
**정성적 방법**은 방정식을 실제로 풀지 않고 해에 대한 정성적 정보를 얻는 방법입니다. 해석적으로 풀기 어렵거나 불가능한 비선형계에 특히 쓸모 있습니다. 이 절에서는 상평면 방법을 **자율** 비선형계
$$y_1'=f_1(y_1,y_2),\qquad y_2'=f_2(y_1,y_2)$$
로 넓힙니다(자율: $t$가 식에 직접 나타나지 않음). 수치해법은 한 번에 근사해 하나만 주지만, 이 방법은 해의 족 전체를 보여 줍니다. 필요한 개념은 앞 절과 같습니다: 상평면, 궤적, 상 초상, 그리고 **임계점**($f_1=f_2=0$인 점).

비선형계는 임계점이 여러 개일 수 있으므로 하나씩 조사합니다. 임계점 $P_0:(a,b)$가 원점이 아니면 평행이동 $\tilde y_1=y_1-a$, $\tilde y_2=y_2-b$로 원점으로 옮깁니다. 또 $P_0$이 **고립**되어 있다고(그 근처에 다른 임계점이 없다고) 가정합니다. 임계점이 유한 개이면 자동으로 그렇습니다.

### 선형화

$P_0$이 원점이고 임계점이므로 $f_1(0,0)=f_2(0,0)=0$, 곧 상수항이 없습니다. 테일러 전개로
$$\mathbf y'=A\mathbf y+\mathbf h(\mathbf y),\qquad A=J=\Big[\frac{\partial f_i}{\partial y_j}\Big]_{P_0}\quad(\text{야코비 행렬})$$
로 쓰고 고차항 $\mathbf h$를 버리면 **선형화한 계** $\mathbf y'=A\mathbf y$를 얻습니다. 자율계이므로 $A$는 상수입니다.

:::thm 선형화 (교재 Theorem 1)
$f_1,f_2$가 임계점 근처에서 연속인 편도함수를 가지고 $\det J\ne0$이면, 비선형계의 임계점은 선형화한 계와 **같은 종류, 같은 안정성**을 가집니다. 예외: $J$가 **중근** 또는 **순허수** 고유값을 가지면 원래 계는 같은 종류이거나 나선점일 수 있습니다.
:::

즉 **중심만은 믿을 수 없습니다.** 선형화가 중심이면 비선형 항 때문에 안정 나선점이나 불안정 나선점으로 바뀔 수 있으므로, 에너지 보존 같은 추가 논리가 필요합니다.

:::ex 예제 1 (감쇠 없는 진자)
길이 $L$인 가벼운 막대 끝에 질량 $m$인 추가 달린 진자의 임계점의 위치와 종류를 구하세요(막대의 질량과 공기 저항 무시).
---
**1단계: 모델.** 평형 위치에서 반시계 방향으로 잰 각을 $\theta$라 하면, 추의 무게 $mg$가 원호의 접선 방향으로 복원력 $-mg\sin\theta$를 줍니다. 원호를 따른 가속도는 $L\theta''$이므로 뉴턴 법칙에서 $mL\theta''+mg\sin\theta=0$, 곧
$$\theta''+k\sin\theta=0,\qquad k=\frac gL>0$$
$\theta$가 작으면 $\sin\theta\approx\theta$로 근사해 조화 진동을 얻지만, 임의의 $\theta$에 대한 정확한 해는 초등함수가 아닙니다.

**2단계: 임계점 $(0,0),(\pm2\pi,0),\dots$.** $\theta=y_1$, $\theta'=y_2$로 두면
$$y_1'=y_2,\qquad y_2'=-k\sin y_1$$
두 식의 우변이 0이 되려면 $y_2=0$, $\sin y_1=0$이므로 임계점은 $(n\pi,0)$, $n=0,\pm1,\pm2,\dots$로 무한히 많습니다. $(0,0)$에서는 $\sin y_1=y_1-\frac16y_1^3+\cdots\approx y_1$이므로 선형화하면
$$\mathbf y'=\begin{pmatrix}0&1\\-k&0\end{pmatrix}\mathbf y,\qquad p=0,\ q=k>0$$
이라 **중심**입니다. $\sin$의 주기성 때문에 $(2n\pi,0)$은 모두 중심입니다. (정리의 예외에 해당하지만, 아래 에너지 보존으로 비선형계도 실제로 중심임을 확인합니다.)

**3단계: 임계점 $(\pm\pi,0),(\pm3\pi,0),\dots$.** $\theta-\pi=y_1$로 두면 $\sin\theta=\sin(y_1+\pi)=-\sin y_1\approx-y_1$이므로 선형화는
$$\mathbf y'=\begin{pmatrix}0&1\\k&0\end{pmatrix}\mathbf y,\qquad p=0,\ q=-k<0$$
이라 **안장점**(불안정)입니다. 추가 거꾸로 서 있는 평형이 불안정하다는 직관과 맞습니다.
:::

:::ex 예제 2 (감쇠 있는 진자)
각속도에 비례하는 감쇠를 더한 $\theta''+c\theta'+k\sin\theta=0$ ($c>0$)은 어떻게 달라지는가?
---
$y_1'=y_2$, $y_2'=-k\sin y_1-cy_2$. 임계점의 위치는 그대로입니다.
- $(0,0)$에서의 선형화는 $\begin{pmatrix}0&1\\-k&-c\end{pmatrix}$로 §4.4 예제 2의 질량-스프링계와 같습니다(물리적 의미만 다름). 감쇠가 작으면 $p=-c<0$, $\Delta=c^2-4k<0$이라 **안정하고 끌어당기는 나선점**입니다.
- $(\pi,0)$에서는 $\begin{pmatrix}0&1\\k&-c\end{pmatrix}$, $q=-k<0$이라 여전히 **안장점**입니다.

감쇠는 에너지 손실이므로, 감쇠 없는 경우의 닫힌 궤적 대신 궤적들이 $(0,0),(\pm2\pi,0),\dots$ 중 하나로 나선을 그리며 빨려 들어갑니다. 처음에 계속 돌던(물결 모양 궤적) 운동도 결국 한 점 주위의 흔들림으로 바뀝니다.
:::

:::fig f03pend
:::

### 로트카-볼테라 포식자-피식자 모델

:::ex 예제 3 (토끼와 여우)
여우가 토끼를 잡아먹는 두 종의 개체수 모델을 세우고 임계점을 분석하세요.
---
**1단계: 모델.** 가정은 세 가지입니다.
1. 토끼는 먹이가 무한하므로 여우가 없으면 지수적으로 늘어난다: $y_1'=ay_1$.
2. 실제로는 여우에게 잡혀 줄어드는데, 그 비율은 만남의 횟수 $y_1y_2$에 비례한다: $y_1'=ay_1-by_1y_2$ ($a,b>0$).
3. 토끼가 없으면 여우는 지수적으로 줄지만($y_2'=-ly_2$), 만남에 비례해 늘어난다: $y_2'=ky_1y_2-ly_2$ ($k,l>0$).

$$y_1'=ay_1-by_1y_2,\qquad y_2'=ky_1y_2-ly_2$$
**2단계: 임계점 $(0,0)$.** $y_1(a-by_2)=0$, $y_2(ky_1-l)=0$에서 임계점은 $(0,0)$과 $\big(\frac lk,\frac ab\big)$. 원점에서 비선형 항을 버리면 $\mathbf y'=\begin{pmatrix}a&0\\0&-l\end{pmatrix}\mathbf y$, 고유값 $a>0$, $-l<0$로 부호가 반대이므로 **안장점**입니다.

**3단계: 임계점 $\big(\frac lk,\frac ab\big)$.** $y_1=\tilde y_1+\frac lk$, $y_2=\tilde y_2+\frac ab$로 옮기면
$$\tilde y_1'=\Big(\tilde y_1+\frac lk\Big)(-b\tilde y_2),\qquad\tilde y_2'=\Big(\tilde y_2+\frac ab\Big)(k\tilde y_1)$$
곱 $\tilde y_1\tilde y_2$ 항을 버리면 $\tilde y_1'=-\frac{lb}k\tilde y_2$, $\tilde y_2'=\frac{ak}b\tilde y_1$. 중심의 요령대로 (첫 식 좌변)×(둘째 식 우변) = (첫 식 우변)×(둘째 식 좌변)에서 $\frac{ak}b\tilde y_1\tilde y_1'=-\frac{lb}k\tilde y_2\tilde y_2'$, 적분하면
$$\frac{ak}{b}\tilde y_1^2+\frac{lb}{k}\tilde y_2^2=\text{상수}$$
인 타원족이라 선형화는 **중심**입니다. 정리의 예외 경우이지만, 복잡한 분석으로 비선형계도 실제로 중심(타원은 아닌 닫힌 궤적)임을 보일 수 있습니다.

**해석.** 두 종은 평형점 주위를 주기적으로 오르내립니다. 궤적을 반시계 방향으로 따라가면, 토끼가 최대인 오른쪽 꼭짓점에서 여우가 급격히 늘기 시작해 위쪽 꼭짓점에서 최대가 되고, 그동안 토끼는 급격히 줄어 왼쪽 꼭짓점에서 최소가 됩니다. 허드슨만 근처의 스라소니와 눈신토끼에서 약 10년 주기의 이런 변동이 관찰되었습니다.
:::

:::fig f03lv
:::

### 상평면에서 1계 방정식으로 바꾸기

2계 자율 ODE $F(y,y',y'')=0$은 $y=y_1$을 독립변수로 삼으면 1계로 바뀝니다. $y'=y_2$로 두고 연쇄법칙을 쓰면
$$y''=\frac{dy_2}{dt}=\frac{dy_2}{dy_1}\frac{dy_1}{dt}=\frac{dy_2}{dy_1}y_2$$
이므로 방정식은 $F\big(y_1,y_2,\frac{dy_2}{dy_1}y_2\big)=0$이 되고, 풀리거나 방향장으로 다룰 수 있습니다.

:::ex 예제 4 (진자의 에너지)
감쇠 없는 진자 $\theta''+k\sin\theta=0$을 이 방법으로 분석하세요.
---
$\theta=y_1$, $\theta'=y_2$이면 $\frac{dy_2}{dy_1}y_2=-k\sin y_1$. 변수분리하면 $y_2\,dy_2=-k\sin y_1\,dy_1$, 적분하면
$$\tfrac12y_2^2-k\cos y_1=C$$
$mL^2$을 곱하면 $\frac12m(Ly_2)^2-mL^2k\cos y_1=mL^2C$입니다. $Ly_2$는 추의 속도이므로 첫 항은 운동에너지, 둘째 항은 위치에너지이고, $mL^2C$는 **총에너지**로 감쇠가 없으니 보존됩니다.

운동의 종류는 에너지, 곧 $C$로 정해집니다.
- 가장 작은 $C=-k$: $y_2=0$, $\cos y_1=1$이므로 진자가 정지.
- 진자가 방향을 바꾸려면 $y_2=0$인 점이 있어야 하고, 그때 $k\cos y_1+C=0$입니다. $-k<C<k$이면 $|\theta|<\pi$인 어떤 각에서 방향을 바꾸므로 **앞뒤로 흔들리고**, 이것이 닫힌 궤적입니다.
- $C>k$이면 $y_2=0$이 불가능하므로 진자가 **계속 돕니다**(물결 모양 궤적).
- $C=k$는 둘을 가르는 **분리 궤적**으로, 안장점 $(\pm\pi,0)$들을 잇습니다.
:::

### 자기 지속 진동: 판 데르 폴 방정식

작은 진동에는 에너지가 공급되고 큰 진동에서는 에너지가 빠져나가는 물리계가 있습니다. 그러면 계는 주기적인 행동에 다가갈 것이고, 상평면에서 궤적들이 모여드는 닫힌 곡선, 곧 **극한 순환**으로 나타납니다. 이런 진동을 묘사하는 유명한 방정식이 진공관 회로 연구에서 나온 **판 데르 폴 방정식**
$$y''-\mu(1-y^2)y'+y=0\qquad(\mu>0)$$
입니다. $\mu=0$이면 조화 진동입니다. 감쇠 항의 계수 $-\mu(1-y^2)$는 $y^2<1$ (작은 진동)이면 음수(에너지 공급), $y^2>1$이면 양수(에너지 손실)입니다. $\mu$가 작으면 극한 순환은 거의 원이고, $\mu$가 크면 모양이 달라지고 궤적이 더 빨리 다가갑니다.

위의 방법으로 $\frac{dy_2}{dy_1}y_2-\mu(1-y_1^2)y_2+y_1=0$이고, **등경사선**($\frac{dy_2}{dy_1}=K$)은 $y_2=\dfrac{y_1}{\mu(1-y_1^2)-K}$입니다. 이것으로 방향장을 그리면 극한 순환이 보입니다. 극한 순환은 중심을 둘러싼 닫힌 궤적과 개념이 다릅니다. 중심의 닫힌 궤적은 다른 궤적이 다가오지 않지만, 극한 순환은 안팎의 궤적이 **다가옵니다**. 선형계에는 없는 현상입니다.

:::fig f03vdp
:::

:::ex 예제 5 (이중 우물)
$y_1'=y_2$, $y_2'=y_1-y_1^3$의 임계점을 분류하세요.
---
$y_2=0$, $y_1(1-y_1^2)=0$에서 임계점 $(0,0)$, $(\pm1,0)$.
$$J=\begin{pmatrix}0&1\\1-3y_1^2&0\end{pmatrix}$$
$(0,0)$: $q=-1<0$ → **안장점**(불안정). $(\pm1,0)$: $J=\begin{pmatrix}0&1\\-2&0\end{pmatrix}$, $p=0$, $q=2$ → 선형화는 중심.
위의 방법으로 $\frac{dy_2}{dy_1}=\frac{y_1-y_1^3}{y_2}$를 변수분리하면 에너지 $E=\frac12y_2^2-\frac12y_1^2+\frac14y_1^4$가 보존되어 궤적이 $E=$상수인 닫힌 곡선이므로 실제로도 중심입니다[[ch01:1.3|변수분리형 ODE.]]. 두 우물 바닥에서 흔들리는 입자, 좌굴된 보의 진동 모델입니다.
:::
` },
      { k: '4.6', p: '160', title: '비동차 선형 연립 ODE', body: R`
이 장의 마지막 절은 $\mathbf g(t)\not\equiv\mathbf 0$인
$$\mathbf y'=A\mathbf y+\mathbf g$$
입니다. $\mathbf g(t)$와 $A(t)$의 성분이 구간 $J$에서 연속이라 가정합니다. 동차계 $\mathbf y'=A\mathbf y$의 일반해 $\mathbf y^{(h)}$와 비동차계의 특수해(임의상수 없는 해) $\mathbf y^{(p)}$로
$$\mathbf y=\mathbf y^{(h)}+\mathbf y^{(p)}$$
를 만들면 $J$에서의 모든 해를 포함하므로 **일반해**입니다(§4.2 Theorem 2에서 나옴). 2계 ODE의 $y_h+y_p$와 같은 구조입니다[[ch02:2.7|비동차 ODE의 해 구조와 미정계수법.]]. 할 일은 특수해를 구하는 것이고, 방법은 세 가지입니다.

- **미정계수법**: $A$가 상수이고 $\mathbf g$의 성분이 상수, 거듭제곱, 지수함수, 코사인·사인일 때 $\mathbf g$와 비슷한 꼴로 $\mathbf y^{(p)}$를 가정합니다. 예를 들어 $\mathbf g$가 $t$의 2차식이면 $\mathbf y^{(p)}=\mathbf u+\mathbf vt+\mathbf wt^2$. $\mathbf g=\mathbf ue^{kt}$이고 $k$가 고유값이 아니면 $\mathbf y^{(p)}=\mathbf ve^{kt}$로 두고 $(kI-A)\mathbf v=\mathbf u$를 풉니다. $k$가 고유값이면 **수정 규칙**: $\mathbf y^{(p)}=\mathbf a\,te^{kt}+\mathbf b\,e^{kt}$ (스칼라 ODE와 달리 $\mathbf be^{kt}$ 항도 필요).
- **매개변수 변환법**: 기본행렬 $Y$로 $\mathbf y^{(p)}=Y(t)\displaystyle\int Y^{-1}(t)\,\mathbf g(t)\,dt$. $A(t)$가 변수이고 $\mathbf g$가 일반 연속함수여도 적용됩니다.
- **대각화**: $A=XDX^{-1}$이면 $\mathbf y=X\mathbf z$로 두어 $\mathbf z'=D\mathbf z+X^{-1}\mathbf g$, 서로 분리된 1계 방정식들로 만듭니다[[ch07:8.4|대각화 $X^{-1}AX=D$.]].

:::ex 예제 1 (기본 규칙)
$\mathbf y'=\begin{pmatrix}-2&1\\2&-3\end{pmatrix}\mathbf y+\begin{pmatrix}1\\0\end{pmatrix}e^{t}$의 특수해
---
$k=1$은 고유값($-1,-4$)이 아니므로 $\mathbf y^{(p)}=\mathbf ve^{t}$. 대입하면 $\mathbf ve^t=A\mathbf ve^t+(1,0)^Te^t$, 곧 $(I-A)\mathbf v=(1,0)^T$:
$$\begin{pmatrix}3&-1\\-2&4\end{pmatrix}\mathbf v=\begin{pmatrix}1\\0\end{pmatrix}\;\Rightarrow\;\mathbf v=\frac1{10}\begin{pmatrix}4&1\\2&3\end{pmatrix}\begin{pmatrix}1\\0\end{pmatrix}=\frac1{5}\begin{pmatrix}2\\1\end{pmatrix}$$
:::

:::ex 예제 2 (수정 규칙)
같은 $A$에 $\mathbf g=(0,3)^Te^{-t}$
---
$-1$이 고유값이므로 $\mathbf y^{(p)}=\mathbf ate^{-t}+\mathbf be^{-t}$. ($\mathbf ate^{-t}$만으로는 부족합니다. 해 보세요.) 대입하면
$$\mathbf ae^{-t}-\mathbf ate^{-t}-\mathbf be^{-t}=A\mathbf ate^{-t}+A\mathbf be^{-t}+\begin{pmatrix}0\\3\end{pmatrix}e^{-t}$$
$te^{-t}$와 $e^{-t}$의 계수를 비교하면
$$(A+I)\mathbf a=\mathbf 0,\qquad (A+I)\mathbf b=\mathbf a-\begin{pmatrix}0\\3\end{pmatrix}$$
첫 식에서 $\mathbf a$는 $\lambda=-1$의 고유벡터, $\mathbf a=k(1,1)^T$. 두 번째 식의 우변 $(k,k-3)^T$가 $A+I=\begin{pmatrix}-1&1\\2&-2\end{pmatrix}$의 열공간(= $(1,-2)^T$의 배수)에 있어야 풀리므로 $k-3=-2k$, $k=1$. 그러면 $-b_1+b_2=1$이고, 한 가지로 $\mathbf b=(0,1)^T$ (다른 선택은 동차해만큼 차이남).
$$\mathbf y^{(p)}=\begin{pmatrix}1\\1\end{pmatrix}te^{-t}+\begin{pmatrix}0\\1\end{pmatrix}e^{-t}$$
:::

### 매개변수 변환법

§2.10과 같은 아이디어입니다. 동차계의 일반해 $\mathbf y^{(h)}=Y(t)\mathbf c$에서 상수 벡터 $\mathbf c$를 변수 벡터 $\mathbf u(t)$로 바꾸어 $\mathbf y^{(p)}=Y(t)\mathbf u(t)$로 둡니다. 대입하면
$$Y'\mathbf u+Y\mathbf u'=AY\mathbf u+\mathbf g$$
$Y$의 열이 동차해라서 $Y'=AY$이므로 $Y'\mathbf u$와 $AY\mathbf u$가 상쇄되고 $Y\mathbf u'=\mathbf g$만 남습니다. $\det Y=W\ne0$ (기저)이므로 $Y^{-1}$가 존재하고
$$\mathbf u'=Y^{-1}\mathbf g,\qquad\mathbf y^{(p)}=Y\int Y^{-1}\mathbf g\,dt$$

:::ex 예제 3 (예제 2를 매개변수 변환법으로)
예제 2의 계를 매개변수 변환법으로 푸세요.
---
**기본행렬.** 동차해 $(1,1)^Te^{-t}$, $(1,-2)^Te^{-4t}$로
$$Y=\begin{pmatrix}e^{-t}&e^{-4t}\\e^{-t}&-2e^{-4t}\end{pmatrix},\qquad\det Y=-3e^{-5t},\qquad Y^{-1}=\frac1{-3e^{-5t}}\begin{pmatrix}-2e^{-4t}&-e^{-4t}\\-e^{-t}&e^{-t}\end{pmatrix}=\frac13\begin{pmatrix}2e^{t}&e^{t}\\e^{4t}&-e^{4t}\end{pmatrix}$$
**적분.** $\mathbf u'=Y^{-1}\mathbf g=\frac13\begin{pmatrix}e^{t}\cdot3e^{-t}\\-e^{4t}\cdot3e^{-t}\end{pmatrix}=\begin{pmatrix}1\\-e^{3t}\end{pmatrix}$이고, 성분마다 적분하면 $\mathbf u=\big(t,\ -\frac13e^{3t}\big)^T$.

**특수해.**
$$Y\mathbf u=t\begin{pmatrix}1\\1\end{pmatrix}e^{-t}-\frac13e^{3t}\begin{pmatrix}1\\-2\end{pmatrix}e^{-4t}=\begin{pmatrix}1\\1\end{pmatrix}te^{-t}+\begin{pmatrix}-1/3\\2/3\end{pmatrix}e^{-t}$$
예제 2의 답과 비교하면 $e^{-t}$ 항의 차이가 $(-\frac13,-\frac13)^T=-\frac13(1,1)^T$로 동차해이므로, 일반해에 흡수되어 같은 답입니다.
:::

라플라스 변환을 쓰면 연립 ODE도 연립 **일차**방정식으로 바뀝니다[[ch05:6.7|라플라스 변환으로 연립 ODE 풀기.]].
` },
    ],
  });
})();
