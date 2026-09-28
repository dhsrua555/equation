/* 개념 정리 — 11 편미분방정식 (Kreyszig 10판 12장, §12.1–12.12). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 11,
    summary: R`교재 12장은 파동·열·라플라스 방정식을 **모델링(방정식 세우기)**과 **풀이(변수분리 + 푸리에 급수·적분)**로 나누어 다룹니다. 1차원 현과 막대에서 시작해 직사각형·원형 막, 원기둥·구 좌표의 퍼텐셜까지 같은 틀이 반복됩니다. 11장의 푸리에 해석이 그대로 도구가 됩니다.`,
    goals: [
      R`$AC-B^2$으로 2계 선형 PDE를 분류하고 특성선을 구할 수 있다`,
      R`현의 파동방정식과 막대의 열방정식을 물리 법칙에서 유도할 수 있다`,
      R`변수분리 → 고유함수 → 푸리에 계수의 세 단계로 경계값 문제를 풀 수 있다`,
      R`달랑베르 해, 무한 막대의 가우스 핵, 라플라스 변환 풀이를 쓸 수 있다`,
      R`직사각형·원형 막과 구 안의 퍼텐셜에서 이중 푸리에 급수·푸리에-베셀·르장드르 전개를 쓸 수 있다`,
    ],
    sections: [
      { k: '12.1', p: '540', title: 'PDE의 기본 개념', body: R`
**편미분방정식**(PDE)은 둘 이상의 변수(흔히 시간 $t$와 공간 변수들)에 의존하는 미지함수 $u$의 편도함수를 하나 이상 포함하는 방정식입니다. 변위, 온도, 전위처럼 시간과 공간에 따라 변하는 양은 대부분 PDE로 기술됩니다. 가장 높은 편도함수의 차수가 PDE의 **계**이고, ODE처럼 응용에서는 2계가 가장 중요합니다.

**선형과 동차.** $u$와 그 편도함수에 대해 1차이면 **선형**, 아니면 비선형입니다. 선형 PDE의 모든 항이 $u$나 그 편도함수를 포함하면 **동차**, 그렇지 않은 항이 있으면 비동차입니다.

:::key 대표적인 2계 PDE
$$u_{tt}=c^2u_{xx}\ (\text{1차원 파동}),\qquad u_t=c^2u_{xx}\ (\text{1차원 열}),\qquad u_{xx}+u_{yy}=0\ (\text{2차원 라플라스})$$
$$u_{xx}+u_{yy}=f(x,y)\ (\text{푸아송}),\qquad u_{tt}=c^2(u_{xx}+u_{yy})\ (\text{2차원 파동}),\qquad \nabla^2u=0\ (\text{3차원 라플라스})$$
:::

여기서 $c>0$는 상수, $t$는 시간, $x,y,z$는 직교좌표이고 “차원”은 방정식에 나오는 공간 좌표의 개수입니다. 모두 선형이고, 푸아송 방정식($f\not\equiv0$)만 비동차입니다.

**해.** 영역 $R$에서의 해는 PDE에 나오는 모든 편도함수를 가지고 $R$ 전체에서 PDE를 만족하는 함수입니다(경계에서는 연속, 내부에서 PDE를 만족하는 것으로 충분할 때가 많음). PDE의 해는 대개 **엄청나게 많습니다**. 예를 들어
$$u=x^2-y^2,\qquad u=e^y\sin x,\qquad u=\cos x\sinh y,\qquad u=\arctan\frac yx$$
는 서로 전혀 다르지만 모두 2차원 라플라스 방정식의 해입니다. 물리 문제에 대응하는 유일한 해는 **추가 조건**으로 골라냅니다: 영역의 경계에서 $u$의 값을 주는 **경계조건**, 시간이 변수일 때 $t=0$에서 $u$ (또는 $u_t$)를 주는 **초기조건**입니다.

:::thm 중첩 원리 (교재 Theorem 1)
$u_1,u_2$가 어떤 영역에서 선형 동차 PDE의 해이면 $c_1u_1+c_2u_2$도 그 영역에서 해입니다.
:::

편도함수가 선형 연산이므로 $L[c_1u_1+c_2u_2]=c_1L[u_1]+c_2L[u_2]=0$입니다(2계 ODE의 중첩 원리와 같은 증명). 이 원리 덕분에 간단한 해들을 더해 조건을 맞추는 이 장의 방법이 가능합니다.

### ODE처럼 풀리는 PDE

한 변수에 대한 도함수만 있으면 다른 변수는 매개변수처럼 다룹니다. 이때 ODE의 **임의상수가 다른 변수의 임의함수**가 됩니다.

:::ex 예제 1 (ODE처럼 풀기)
(a) $u_{yy}+4u=0$, (b) $u_{xt}+u_x=0$의 해 $u(x,y)$, $u(x,t)$를 구하세요.
---
(a) $x$에 대한 도함수가 없으므로 $y''+4y=0$처럼 풀되 상수를 $x$의 함수로: $u=A(x)\cos2y+B(x)\sin2y$.
(b) $p=u_x$로 두면 $p_t=-p$이므로 $p=c(x)e^{-t}$. $x$로 적분하면 $u=f(x)e^{-t}+g(t)$ ($f=\int c\,dx$). $f$, $g$는 임의의 함수입니다. 미분해서 확인해 보세요.
:::

ODE의 일반해는 임의**상수**를 포함하지만 PDE의 일반해는 임의**함수**를 포함합니다. 예를 들어 $u_{xy}=0$의 해는 $u=f(x)+g(y)$입니다. 그래서 PDE는 일반해를 먼저 구하기보다 **경계조건·초기조건을 만족하는 해**를 직접 찾는 방식으로 풉니다.

:::ex 예제 2 (진행파)
$u=f(x-ct)$가 파동방정식을 만족함을 보이고 그 의미를 설명하세요.
---
연쇄법칙으로 $u_{tt}=c^2f''$, $u_{xx}=f''$이므로 $u_{tt}=c^2u_{xx}$. $f$의 모양이 시간 $t$ 동안 $ct$만큼 오른쪽으로 옮겨가므로, 모양을 유지한 채 속력 $c$로 진행하는 파동입니다(§12.4의 달랑베르 해).
:::
` },
      { k: '12.2', p: '543', title: '모델링: 진동하는 현과 파동방정식', body: R`
첫 번째 중요한 PDE를 바이올린 줄 같은 탄성 현의 작은 가로 진동에서 유도합니다. 이 세밀한 모델링 과정은 막(§12.8) 등 다른 현상에도 그대로 쓰이므로 주의 깊게 볼 만합니다.

현을 $x$축을 따라 길이 $L$로 당겨 양 끝 $x=0$, $x=L$에 고정하고, 변형시킨 뒤 $t=0$에 놓아 진동하게 합니다. 구할 것은 각 점 $x$, 각 시각 $t$에서의 변위 $u(x,t)$입니다.

**물리적 가정.**
1. 단위 길이당 질량 $\rho$가 일정하고(균질한 현), 완전히 탄성적이며 굽힘에 저항하지 않습니다.
2. 양 끝을 고정하기 전 당긴 장력이 매우 커서 중력(현을 아래로 조금 끌어당김)은 무시합니다.
3. 현은 수직 평면에서 작은 가로 운동을 합니다. 각 점은 정확히 수직으로만 움직이고, 변위와 기울기의 절댓값은 늘 작습니다.

**힘으로부터 PDE 유도.** 길이 $\Delta x$인 작은 조각(끝점 $P$, $Q$)에 작용하는 힘을 봅니다. 현이 굽힘에 저항하지 않으므로 장력은 각 점에서 곡선에 접합니다. $P$, $Q$에서의 장력을 $T_1$, $T_2$라 합니다.

:::fig f11string
:::

- **수평 방향.** 점들이 수직으로만 움직이므로 수평 방향으로는 운동이 없고, 장력의 수평 성분이 같아야 합니다:
$$T_1\cos\alpha=T_2\cos\beta=T\ (\text{상수})$$
- **수직 방향.** 두 힘의 수직 성분은 $-T_1\sin\alpha$ ($P$에서는 아래쪽)와 $T_2\sin\beta$입니다. 뉴턴 제2법칙으로 합력은 조각의 질량 $\rho\Delta x$ × 가속도 $u_{tt}$ ($x$와 $x+\Delta x$ 사이의 어떤 점에서)와 같습니다:
$$T_2\sin\beta-T_1\sin\alpha=\rho\,\Delta x\,\frac{\partial^2u}{\partial t^2}$$
- **나누기.** 왼쪽 두 항을 각각 $T_2\cos\beta$와 $T_1\cos\alpha$ (둘 다 $T$)로 나누면
$$\tan\beta-\tan\alpha=\frac{\rho\,\Delta x}{T}\frac{\partial^2u}{\partial t^2}$$
- **기울기.** $\tan\alpha=u_x(x,t)$, $\tan\beta=u_x(x+\Delta x,t)$ ($u$가 $t$에도 의존하므로 편도함수)를 넣고 $\Delta x$로 나눈 뒤 $\Delta x\to0$이면 왼쪽은 $u_{xx}$가 됩니다:
$$u_{tt}=c^2u_{xx},\qquad c^2=\frac{T}{\rho}$$

이것이 **1차원 파동방정식**입니다. 동차 2계 선형 PDE이고, 물리 상수 $T/\rho$를 $c^2$으로 쓴 것은 양수라는 점을 강조하기 위해서입니다(해의 모양에 결정적). $c$는 파동의 속력입니다. 장력을 키우거나 현을 가볍게 하면 빨라지고, 음이 높아집니다(§12.3).

:::tip 모델링 포인트
시험에서 유도를 물으면 “장력의 수평 성분 일정 → 수직 성분의 차 = 질량 × 가속도 → 극한” 세 줄을 쓰면 됩니다.
:::
` },
      { k: '12.3', p: '545', title: '변수분리와 푸리에 급수 풀이', body: R`
진동하는 현의 모델은 파동방정식
$$u_{tt}=c^2u_{xx}$$
에 두 가지 추가 조건을 더한 것입니다. 양 끝이 고정되어 있으므로 **경계조건** $u(0,t)=0$, $u(L,t)=0$ (모든 $t\ge0$), 그리고 운동은 처음 모양 $f(x)$와 처음 속도 $g(x)$에 따라 다르므로 **초기조건** $u(x,0)=f(x)$, $u_t(x,0)=g(x)$ ($0\le x\le L$). 이 문제를 세 단계로 풉니다.

### 1단계: 변수분리로 ODE 두 개 얻기

**변수분리법**(곱의 방법)은 한 변수씩의 함수의 곱 $u(x,t)=F(x)G(t)$ 꼴의 해를 찾습니다. 미분하면 $u_{tt}=F\ddot G$, $u_{xx}=F''G$ (점은 $t$, 프라임은 $x$에 대한 도함수)이므로 파동방정식은 $F\ddot G=c^2F''G$, $c^2FG$로 나누면
$$\frac{\ddot G}{c^2G}=\frac{F''}{F}$$
왼쪽은 $t$만, 오른쪽은 $x$만의 함수입니다. 둘이 변하는 함수라면 $t$를 바꿀 때 한쪽만 변하고 다른 쪽은 그대로일 테니, **양변은 상수** $k$여야 합니다. 분모를 곱하면
$$F''-kF=0,\qquad\ddot G-c^2kG=0$$

### 2단계: 경계조건을 만족하는 해

$u(0,t)=F(0)G(t)=0$, $u(L,t)=F(L)G(t)=0$이고 $G\equiv0$이면 $u\equiv0$이라 의미가 없으므로 $F(0)=0$, $F(L)=0$이어야 합니다.

**$k$는 음수여야 한다.** $k=0$이면 $F=ax+b$이고 두 조건에서 $a=b=0$. $k=\mu^2>0$이면 $F=Ae^{\mu x}+Be^{-\mu x}$이고 $F(0)=A+B=0$, $F(L)=A(e^{\mu L}-e^{-\mu L})=0$에서 $A=B=0$. 둘 다 $F\equiv0$뿐입니다. 따라서 $k=-p^2$이고 $F''+p^2F=0$, $F=A\cos px+B\sin px$. $F(0)=A=0$이고 $F(L)=B\sin pL=0$에서 $B\ne0$이므로 $\sin pL=0$, 곧
$$pL=n\pi,\qquad F_n(x)=\sin\frac{n\pi x}L\qquad(n=1,2,\dots)$$
(음의 $n$은 부호만 다른 같은 해입니다.) 이것은 스투름-리우빌 고유값 문제입니다[[ch10:11.5|$y''+\lambda y=0$, $y(0)=y(L)=0$의 고유함수 $\sin\frac{n\pi x}L$.]].

$k=-(n\pi/L)^2$을 $G$의 식에 넣으면 $\ddot G+\lambda_n^2G=0$, $\lambda_n=\frac{cn\pi}L$이고 $G_n=B_n\cos\lambda_nt+B_n^*\sin\lambda_nt$. 따라서
$$u_n(x,t)=\big(B_n\cos\lambda_nt+B_n^*\sin\lambda_nt\big)\sin\frac{n\pi x}L\qquad(n=1,2,\dots)$$
는 파동방정식과 경계조건을 모두 만족합니다. 이것이 현의 **고유함수**이고 $\lambda_n=cn\pi/L$이 **고유값**, $\{\lambda_1,\lambda_2,\dots\}$가 **스펙트럼**입니다.

**고유함수의 의미.** 각 $u_n$은 진동수 $\frac{\lambda_n}{2\pi}=\frac{cn}{2L}$ (단위 시간당 횟수)인 조화운동이고 $n$번째 **정규 모드**라 합니다. $n=1$이 **기본 모드**, 나머지는 **배음**(음악에서 옥타브, 옥타브+5도, …)입니다. $\sin\frac{n\pi x}L$은 $x=\frac Ln,\frac{2L}n,\dots,\frac{n-1}nL$에서 0이므로 $n$번째 모드는 양 끝 외에 $n-1$개의 **마디**(움직이지 않는 점)를 가집니다. 어느 순간에도 현은 사인파 모양이고, 2번째 모드에서는 왼쪽 절반이 내려갈 때 오른쪽 절반이 올라갑니다.

:::fig f11modes
:::

**조율.** 진동수 $\frac{cn}{2L}=\frac n{2L}\sqrt{T/\rho}$는 장력의 제곱근에 비례하므로 장력을 조여 음을 높입니다. 장력을 무한히 키울 수는 없으니 높은 음에는 짧고 가벼운 현을 씁니다. 바이올린이 콘트라베이스보다 작은 이유입니다.

:::ex 예제 1 (기타 줄의 음)
길이 $L=0.65$ m, 선밀도 $\rho=0.5$ g/m인 줄을 장력 $T=70$ N으로 당겼다. 기본진동수는? 장력을 4배로 하면?
---
$c=\sqrt{T/\rho}=\sqrt{70/0.0005}=\sqrt{140000}\approx374.2$ m/s. 기본진동수 $\frac c{2L}=\frac{374.2}{1.3}\approx288$ Hz, 배음은 576, 864, … Hz. 장력을 4배로 하면 $c$가 2배가 되어 한 옥타브 높은 576 Hz입니다.
:::

### 3단계: 전체 문제의 해 — 푸리에 급수

하나의 $u_n$은 대개 초기조건을 만족하지 못합니다. 그러나 파동방정식이 선형 동차이므로 중첩 원리에 의해 합도 해이고, 급수
$$u(x,t)=\sum_{n=1}^\infty\big(B_n\cos\lambda_nt+B_n^*\sin\lambda_nt\big)\sin\frac{n\pi x}L$$
를 생각합니다.

**처음 변위.** $t=0$을 넣으면 $u(x,0)=\sum B_n\sin\frac{n\pi x}L=f(x)$, 곧 $B_n$은 $f$의 **푸리에 사인 급수**의 계수입니다[[ch10:11.2|사인 반구간 전개 $b_n=\frac2L\int_0^Lf\sin\frac{n\pi x}Ldx$.]].
**처음 속도.** $t$로 미분해 $t=0$을 넣으면 $u_t(x,0)=\sum B_n^*\lambda_n\sin\frac{n\pi x}L=g(x)$이므로 $B_n^*\lambda_n$이 $g$의 사인 계수이고, $\lambda_n=cn\pi/L$로 나누면 다음 공식입니다.

:::key 진동하는 현
$$u(x,t)=\sum_{n=1}^\infty\big(B_n\cos\lambda_nt+B_n^*\sin\lambda_nt\big)\sin\frac{n\pi x}{L},\qquad \lambda_n=\frac{cn\pi}{L}$$
$$B_n=\frac2L\int_0^Lf(x)\sin\frac{n\pi x}{L}dx,\qquad B_n^*=\frac{2}{cn\pi}\int_0^Lg(x)\sin\frac{n\pi x}{L}dx$$
:::

이 급수와, 그것을 $x$와 $t$로 두 번씩 항별 미분한 급수가 수렴해 연속인 $u_{xx}$, $u_{tt}$를 주면 이것이 해입니다.

:::warn 초기속도 계수
$B_n^*$에는 $\lambda_n$으로 나눈 인자 $\frac{L}{cn\pi}$가 붙습니다. $u_t$를 미분하면 $\lambda_n$이 튀어나오기 때문입니다. 이것을 빠뜨리는 실수가 가장 흔합니다.
:::

### 해의 확인과 물리적 해석

$g\equiv0$이면 $B_n^*=0$이고 $u=\sum B_n\cos\lambda_nt\sin\frac{n\pi x}L$. 곱을 합으로 바꾸는 공식 $\cos\frac{cn\pi t}L\sin\frac{n\pi x}L=\frac12\Big[\sin\frac{n\pi}L(x-ct)+\sin\frac{n\pi}L(x+ct)\Big]$을 쓰면 두 급수는 $f$의 사인 급수에서 $x$ 대신 $x\mp ct$를 넣은 것이므로
$$u(x,t)=\frac12\big[f^*(x-ct)+f^*(x+ct)\big]$$
입니다. $f^*$는 $f$를 주기 $2L$인 **홀함수로 확장**한 것입니다. $f$가 $[0,L]$에서 연속이고 양 끝에서 0이면 $u$는 모든 $x$, $t$에서 연속이고, $f$가 두 번 미분가능하고 양 끝의 한쪽 2계 도함수가 0이면 이 식을 미분해 파동방정식을 만족함을 확인할 수 있습니다. $f'$, $f''$가 조각마다 연속일 뿐이면 유한 개의 점에서 $u_{xx}$ 등이 존재하지 않지만 나머지에서는 방정식을 만족하므로 **일반화된 해**로 봅니다(삼각형 초기 변위가 그 예).

**해석.** $f^*(x-ct)$의 그래프는 $f^*$의 그래프를 $ct$만큼 오른쪽으로 옮긴 것, 곧 오른쪽으로 진행하는 파동이고 $f^*(x+ct)$는 왼쪽으로 진행하는 파동입니다. 현의 운동은 **반대로 가는 두 파동의 겹침**입니다.

:::ex 예제 2 (한쪽을 퉁긴 현)
높이 $h$로 $x=L/3$에서 퉁긴 현($f$는 $(0,0)$, $(L/3,h)$, $(L,0)$을 잇는 꺾은선, $g=0$)의 해는?
---
꼭짓점이 $x=a$인 꺾은선의 사인 계수는 (부분적분 두 번)
$$B_n=\frac{2hL^2}{n^2\pi^2a(L-a)}\sin\frac{n\pi a}L$$
이고 $a=L/3$이면 $a(L-a)=\frac29L^2$이라 $B_n=\frac{9h}{n^2\pi^2}\sin\frac{n\pi}3$. 따라서
$$u=\frac{9h}{\pi^2}\sum_{n=1}^\infty\frac{\sin(n\pi/3)}{n^2}\cos\frac{cn\pi t}L\sin\frac{n\pi x}L\approx h\Big(0.790\cos\frac{c\pi t}L\sin\frac{\pi x}L+0.197\cos\frac{2c\pi t}L\sin\frac{2\pi x}L-0.049\cos\frac{4c\pi t}L\sin\frac{4\pi x}L+\cdots\Big)$$
$n=3,6,9,\dots$에서 $\sin\frac{n\pi}3=0$이므로 **3배음 계열이 전혀 없습니다**. 3번째 모드의 마디인 $L/3$을 퉁겼기 때문이고, 악기 연주자가 퉁기는 위치로 음색을 바꾸는 원리입니다. 계수가 $1/n^2$로 줄어 기본 모드가 지배합니다.
:::

:::fig f11pluck
:::

:::ex 예제 3 (항등식으로 계수 없이 풀기)
$L=1$, $c=2$, $u(x,0)=\sin^3\pi x$, $u_t(x,0)=0$을 푸세요.
---
적분 대신 항등식 $\sin^3\theta=\frac34\sin\theta-\frac14\sin3\theta$를 쓰면 초기 변위가 이미 사인 급수입니다: $B_1=\frac34$, $B_3=-\frac14$, 나머지 0. $\lambda_n=2n\pi$이므로
$$u=\tfrac34\sin\pi x\cos2\pi t-\tfrac14\sin3\pi x\cos6\pi t$$
:::

:::ex 예제 4 (두드린 현: 처음 속도만 있음)
$f=0$, $g(x)=v_0\sin\frac{\pi x}L$ (처음 모양은 평평하고 속도만 줌)이면?
---
$B_n=0$. $g$가 이미 사인 급수의 첫 항이므로 $B_1^*\lambda_1=v_0$, 나머지 0. $\lambda_1=\frac{c\pi}L$로 나누면 $B_1^*=\frac{v_0L}{c\pi}$이고
$$u=\frac{v_0L}{c\pi}\sin\frac{\pi x}L\sin\frac{c\pi t}L$$
진폭이 처음 속도 $v_0$에 비례하고 진동수에 반비례합니다(빠르게 진동하는 줄은 같은 속도로 쳐도 덜 벌어짐).
:::
` },
      { k: '12.4', p: '553', title: '달랑베르 해, 특성선, PDE의 분류', body: R`
§12.3 끝에서 현의 해가 $\frac12[f^*(x-ct)+f^*(x+ct)]$로 쓰였습니다. 이 꼴을 파동방정식에서 직접 얻는 방법이 **달랑베르 해법**이고, 경계가 없는 **무한히 긴 현**에 특히 알맞습니다.

### 파동방정식의 일반해

새 독립변수
$$v=x+ct,\qquad w=x-ct$$
를 도입하면 $u$는 $v$, $w$의 함수가 됩니다. 연쇄법칙으로 $u_x=u_v+u_w$이고
$$u_{xx}=u_{vv}+2u_{vw}+u_{ww}$$
같은 방법으로 $u_t=c(u_v-u_w)$, $u_{tt}=c^2(u_{vv}-2u_{vw}+u_{ww})$. 파동방정식 $u_{tt}=c^2u_{xx}$에 넣으면 $u_{vv}$, $u_{ww}$가 지워지고
$$u_{vw}=0$$
만 남습니다. $w$로 적분하면 $u_v=h(v)$, $v$로 적분하면 $u=\int h\,dv+\psi(w)$. 곧
$$u(x,t)=\phi(x+ct)+\psi(x-ct)$$
($\phi$, $\psi$는 임의의 함수)가 파동방정식의 일반해입니다. 왼쪽과 오른쪽으로 진행하는 두 파동의 합이라는 뜻입니다.

### 초기조건 맞추기: 달랑베르 공식

무한한 현에서 $u(x,0)=f(x)$, $u_t(x,0)=g(x)$이면
$$\phi(x)+\psi(x)=f(x),\qquad c\phi'(x)-c\psi'(x)=g(x)$$
둘째 식을 적분하면 $\phi(x)-\psi(x)=\frac1c\int_{x_0}^xg(s)\,ds+k$. 첫째 식과 더하고 빼서 $\phi$, $\psi$를 구하고 $x$ 대신 $x\pm ct$를 넣으면($k$는 지워짐) 다음 공식을 얻습니다.

:::key 달랑베르 해 (무한한 현)
$$u(x,t)=\frac12\big[f(x+ct)+f(x-ct)\big]+\frac1{2c}\int_{x-ct}^{x+ct}g(s)\,ds$$
:::

초기 변위는 반씩 나뉘어 왼쪽과 오른쪽으로 속력 $c$로 진행합니다. 점 $(x,t)$의 값은 초기선 위의 구간 $[x-ct,\ x+ct]$(**의존 구간**)의 값에만 의존합니다. 직선 $x\pm ct=$상수를 **특성선**이라 하며, 정보가 이 선을 따라 전파됩니다.

:::fig f11char
:::

:::ex 예제 1 (처음 변위만)
$f(x)=\dfrac1{1+x^2}$, $g=0$일 때 $u$와 $t=2/c$일 때의 모양은?
---
$u=\frac12\Big[\frac1{1+(x+ct)^2}+\frac1{1+(x-ct)^2}\Big]$. $t=2/c$이면 높이가 절반인 두 봉우리가 $x=\pm2$에 있습니다.
:::

:::ex 예제 2 (처음 속도만)
$f=0$, $g(x)=\cos x$이면?
---
$u=\frac1{2c}\int_{x-ct}^{x+ct}\cos s\,ds=\frac1{2c}\big[\sin(x+ct)-\sin(x-ct)\big]=\frac1c\cos x\sin ct$. 검산: $u(x,0)=0$, $u_t=\cos x\cos ct$이므로 $u_t(x,0)=\cos x$ ✓. 두 진행파의 합이 제자리에서 진동하는 **정상파**가 되었습니다.
:::

### 2계 선형 PDE의 분류

달랑베르 해법의 핵심은 PDE를 단순한 **표준형**으로 바꾸는 변수를 찾는 것이었습니다. 일반적인 2계 PDE
$$Au_{xx}+2Bu_{xy}+Cu_{yy}=F(x,y,u,u_x,u_y)$$
($A,B,C$는 $x,y$의 함수일 수 있음)에서 새 변수 $v=\Phi(x,y)$, $w=\Psi(x,y)$를 **특성방정식**
$$Ay'^2-2By'+C=0\qquad\Big(y'=\frac{dy}{dx}\Big)$$
의 해 곡선 $\Phi(x,y)=$상수, $\Psi(x,y)=$상수(**특성선**)로 잡으면 표준형이 나옵니다. $y'$에 대한 이차방정식의 판별식이 $4(B^2-AC)$이므로 종류는 $AC-B^2$의 부호로 결정됩니다.

:::key 2계 선형 PDE의 분류
$$Au_{xx}+2Bu_{xy}+Cu_{yy}=F(x,y,u,u_x,u_y)$$
| $AC-B^2$ | 종류 | 특성선 | 표준형 | 예 |
|---|---|---|---|---|
| $<0$ | 쌍곡형 | 실수 두 족 | $u_{vw}=F^*$ | 파동 |
| $=0$ | 포물형 | 실수 한 족 | $u_{ww}=F^*$ | 열 |
| $>0$ | 타원형 | 복소수 | $u_{vv}+u_{ww}=F^*$ | 라플라스 |
:::

- **쌍곡형**: 실수인 두 특성선 족 $v=\Phi$, $w=\Psi$를 새 변수로.
- **포물형**: 특성선이 한 족뿐이므로 $w=\Psi$로 쓰고, $v$는 $\Psi$와 독립인 아무 함수(예: $v=x$).
- **타원형**: 특성선이 복소수 $\Phi=\bar\Psi$이므로 실수부와 허수부 $v=\frac12(\Phi+\Psi)$, $w=\frac1{2i}(\Phi-\Psi)$를 씁니다.

파동방정식 $u_{tt}=c^2u_{xx}$ ($y=t$로 보면 $A=c^2$, $B=0$, $C=-1$, $AC-B^2=-c^2<0$)은 쌍곡형이고 특성선은 $x\pm ct=$상수로, 위의 달랑베르 변수 그대로입니다. 열방정식 $u_t=c^2u_{xx}$는 $u_{yy}$ 항이 없어 $AC-B^2=0$ (포물형), 라플라스 방정식은 $A=C=1$, $B=0$ (타원형)입니다.

:::ex 예제 3 (쌍곡형 표준형)
$u_{xx}+4u_{xy}+3u_{yy}=0$을 분류하고 일반해를 구하세요.
---
$A=1$, $2B=4$ ($B=2$), $C=3$: $AC-B^2=3-4=-1<0$, 쌍곡형. 특성방정식 $y'^2-4y'+3=0$에서 $y'=1$, $3$이므로 특성선은 $y-x=$상수, $y-3x=$상수.
$v=y-x$, $w=y-3x$로 두면 $u_x=-u_v-3u_w$, $u_y=u_v+u_w$이고 계산하면 $u_{xx}+4u_{xy}+3u_{yy}=-4u_{vw}$. 따라서 $u_{vw}=0$,
$$u=\phi(y-x)+\psi(y-3x)$$
검산: $u=\phi(y-x)$이면 $u_{xx}=\phi''$, $u_{xy}=-\phi''$, $u_{yy}=\phi''$이고 $1-4+3=0$ ✓.
:::

:::ex 예제 4 (포물형)
$u_{xx}+2u_{xy}+u_{yy}=0$의 일반해는?
---
$A=B=C=1$, $AC-B^2=0$ (포물형). $y'^2-2y'+1=0$에서 $y'=1$ (중근), 특성선 $y-x=$상수. $w=y-x$, $v=x$로 두면 표준형 $u_{vv}=0$이 되어 $u=v\,f_1(w)+f_2(w)$, 곧
$$u=x\,f_1(y-x)+f_2(y-x)$$
:::

계수가 변수이면 종류가 영역마다 다를 수 있습니다(트리코미 방정식 $yu_{xx}+u_{yy}=0$은 $y>0$에서 타원형, $y<0$에서 쌍곡형). 초음속과 아음속이 섞인 유동의 모델입니다.

:::warn 2B
$u_{xy}$의 계수가 $2B$입니다. $u_{xx}+3u_{xy}+u_{yy}$이면 $B=\tfrac32$.
:::
` },
      { k: '12.5', p: '557', title: '모델링: 공간에서의 열 흐름과 열방정식', body: R`
파동방정식 다음의 “큰” PDE는 공간의 물체 안 온도 $u$를 지배하는 **열방정식**입니다.

**물리적 가정.**
1. 물체 재료의 비열 $\sigma$와 밀도 $\rho$가 일정하고, 물체 안에서 열이 생기거나 사라지지 않습니다.
2. 실험에 따르면 열은 온도가 내려가는 방향으로 흐르고, 흐름의 빠르기는 온도의 기울기에 비례합니다(**푸리에 법칙**): $\mathbf v=-K\operatorname{grad}u$. $u(x,y,z,t)$는 점 $(x,y,z)$, 시각 $t$에서의 온도입니다.
3. 열전도율 $K$가 일정합니다(균질한 재료, 극단적이지 않은 온도).

**유도.** 물체 안의 영역 $T$ (경계 곡면 $S$, 바깥 단위법선 $\mathbf n$)를 잡습니다. $\mathbf v\cdot\mathbf n$은 $\mathbf v$의 바깥 법선 성분이므로 $S$의 작은 조각(넓이 $\Delta A$)에서 $\mathbf v\cdot\mathbf n\,\Delta A$는 단위 시간에 그 조각으로 나가는(음이면 들어오는) 열량이고, $T$에서 빠져나가는 총 열량은 면적분 $\iint_S\mathbf v\cdot\mathbf n\,dA$입니다. 발산 정리와 $\operatorname{div}(\operatorname{grad}u)=\nabla^2u$로 부피 적분으로 바꾸면
$$\oiint_S\mathbf v\cdot\mathbf n\,dA=-K\iiint_T\nabla^2u\,dV$$
[[ch09:10.7|발산 정리 $\iiint\operatorname{div}\mathbf F\,dV=\oiint\mathbf F\cdot\mathbf n\,dA$.]][[ch08:9.8|$\operatorname{div}(\nabla f)=\nabla^2f$ (라플라시안).]]. 한편 $T$ 안의 총 열량은 $H=\iiint_T\sigma\rho u\,dV$이므로 그 감소율은 $-\frac{\partial H}{\partial t}=-\iiint_T\sigma\rho u_t\,dV$. 열이 생기거나 사라지지 않으므로 둘이 같아야 하고, $\sigma\rho$로 나누면
$$\iiint_T\Big(u_t-c^2\nabla^2u\Big)dV=0$$
이것이 물체 안의 **모든** 영역 $T$에서 성립하므로 (피적분함수가 연속이면) 피적분함수가 모든 곳에서 0입니다:
$$u_t=c^2\nabla^2u,\qquad c^2=\frac{K}{\sigma\rho}\ (\text{열확산율})$$

$K$는 열전도율, $\sigma$는 비열, $\rho$는 밀도입니다. 한 물질이 다른 물질 속으로 퍼지는 확산 과정도 같은 방정식이라 **확산방정식**이라고도 합니다. 옆면이 단열된 가는 막대처럼 열이 한 방향으로만 흐르면 $\nabla^2u=u_{xx}$가 되어 1차원 열방정식 $u_t=c^2u_{xx}$를 얻습니다.

시간에 따라 변하지 않는 정상상태이면 $u_t=0$이라 **라플라스 방정식** $\nabla^2u=0$이 됩니다.

:::note 파동방정식과의 차이
열방정식은 $u_{tt}$ 대신 $u_t$가 있을 뿐이지만, 해의 성질은 전혀 다릅니다. 파동은 진동하며 모양을 유지해 전파되고, 열은 진동 없이 지수적으로 고르게 퍼집니다(다음 절).
:::
` },
      { k: '12.6', p: '558', title: '열방정식의 푸리에 급수 풀이, 정상상태 2차원 문제', body: R`
옆면이 완전히 단열되어 열이 $x$ 방향으로만 흐르는, 단면이 일정한 가는 금속 막대(또는 철사)의 온도를 봅니다. 1차원 열방정식
$$u_t=c^2u_{xx}$$
과 양 끝을 0°로 유지하는 경계조건 $u(0,t)=u(L,t)=0$, 처음 온도 $u(x,0)=f(x)$ (당연히 $f(0)=f(L)=0$)를 풉니다. 파동방정식과 달리 **초기조건은 하나**면 충분합니다. 방법은 §12.3과 평행하므로 단계마다 비교해 보면 좋습니다.

**1단계.** $u=F(x)G(t)$를 넣으면 $F\dot G=c^2F''G$, 곧 $\frac{\dot G}{c^2G}=\frac{F''}F=k$. 현과 같은 논리로 $k\ge0$이면 $u\equiv0$뿐이므로 $k=-p^2$:
$$F''+p^2F=0,\qquad\dot G+c^2p^2G=0$$
**2단계.** $F$와 경계조건은 현과 **글자 그대로 같아서** $F_n=\sin\frac{n\pi x}L$, $p=\frac{n\pi}L$. 달라지는 것은 $G$입니다: $\dot G+\lambda_n^2G=0$ ($\lambda_n=\frac{cn\pi}L$)의 일반해는 $G_n=B_ne^{-\lambda_n^2t}$. 따라서 고유함수는
$$u_n=B_n\sin\frac{n\pi x}Le^{-\lambda_n^2t}$$
**3단계.** 급수 $u=\sum u_n$에서 $t=0$을 넣으면 $\sum B_n\sin\frac{n\pi x}L=f(x)$이므로 $B_n$은 $f$의 사인 계수입니다.

:::key 막대의 열전도 (양 끝 0°)
$$u(x,t)=\sum_{n=1}^\infty B_n\sin\frac{n\pi x}{L}\,e^{-\lambda_n^2t},\qquad \lambda_n=\frac{cn\pi}{L},\qquad B_n=\frac2L\int_0^Lf(x)\sin\frac{n\pi x}{L}dx$$
:::

$f$가 조각마다 연속이고 내부의 모든 점에서 한쪽 도함수를 가지면 이것이 해입니다(증명에는 균등수렴이 필요). **지수 인자 때문에 모든 항이 $t\to\infty$에서 0으로 가고**, 감소율 $\lambda_n^2$이 $n^2$에 비례하므로 높은 모드는 빨리 사라져, 시간이 조금 지나면 첫 항 $B_1\sin\frac{\pi x}Le^{-\lambda_1^2t}$ 모양만 남습니다.

:::ex 예제 1 (사인 모양의 처음 온도)
열확산율 $c^2=0.5$ cm²/s, 길이 40 cm인 막대의 처음 온도가 $60\sin\frac{\pi x}{40}$ °C이고 양 끝은 0°C이다. 최고 온도가 30°C가 되는 데 걸리는 시간은? 처음 온도가 $60\sin\frac{2\pi x}{40}$이면?
---
처음 온도가 이미 사인 급수의 한 항이므로 $B_1=60$, 나머지 0. $\lambda_1^2=\frac{c^2\pi^2}{L^2}=\frac{0.5\cdot9.8696}{1600}\approx0.003084$ s⁻¹이므로
$$u=60\sin\frac{\pi x}{40}e^{-0.003084t}$$
$e^{-0.003084t}=\frac12$에서 $t=\frac{\ln2}{0.003084}\approx225$ s (약 3.7분).
$n=2$이면 $\lambda_2^2=4\lambda_1^2$이라 **4배 빨리** 식어 약 56 s입니다. 짧은 파장의 온도 요철일수록 가까운 곳으로 열이 빠져나가기 때문입니다.
:::

:::ex 예제 2 (두 모드)
$L=\pi$, $c^2=1$, $f(x)=50\sin x+20\sin3x$일 때 가운데($x=\pi/2$) 온도가 10°가 되는 시각은?
---
$u=50e^{-t}\sin x+20e^{-9t}\sin3x$. $x=\frac\pi2$에서 $\sin\frac{3\pi}2=-1$이므로 $u=50e^{-t}-20e^{-9t}$. 두 번째 항은 금방 작아지므로 근사적으로 $50e^{-t}=10$, $t\approx\ln5\approx1.61$ (그때 $20e^{-9t}\approx10^{-5}$라 무시해도 됨).
:::

:::ex 예제 3 (포물선 모양의 처음 온도)
$L=\pi$, $c=1$, $f(x)=x(\pi-x)$이면?
---
부분적분 두 번으로 $B_n=\frac2\pi\int_0^\pi x(\pi-x)\sin nx\,dx=\frac{4(1-(-1)^n)}{\pi n^3}$, 곧 홀수 $n$에서 $\frac8{\pi n^3}$, 짝수에서 0.
$$u=\frac8\pi\Big(\sin x\,e^{-t}+\frac{\sin3x}{27}e^{-9t}+\frac{\sin5x}{125}e^{-25t}+\cdots\Big)$$
처음부터 $\frac8\pi\sin x\approx2.55\sin x$가 $f$ (최댓값 $\pi^2/4\approx2.47$)와 거의 같고, 다음 항은 $1/27$배에 $e^{-9t}$로 빨리 사라집니다. 아래 그림 (a).
:::

### 다른 경계조건

:::ex 예제 4 (양 끝을 단열: 고유값 0)
양 끝을 단열하면(열이 드나들지 않음) 경계조건은 무엇이고 해는?
---
열 흐름은 온도 기울기에 비례하므로 끝에서 흐름이 없다는 것은 $u_x(0,t)=u_x(L,t)=0$. $F=A\cos px+B\sin px$에서 $F'(0)=Bp=0$, $F'(L)=-Ap\sin pL=0$이므로 $p=\frac{n\pi}L$ ($n=0,1,2,\dots$), $F_n=\cos\frac{n\pi x}L$. 이번에는 **$n=0$ (고유값 $\lambda_0=0$, 고유함수 상수)**도 허용됩니다. 분리 상수가 0일 수도, 0이 고유값일 수도 있다는 점이 흥미롭습니다. 해는 **코사인 급수**
$$u=\sum_{n=0}^\infty A_n\cos\frac{n\pi x}Le^{-\lambda_n^2t},\qquad A_0=\frac1L\int_0^Lf\,dx,\quad A_n=\frac2L\int_0^Lf\cos\frac{n\pi x}Ldx$$
[[ch10:11.2|코사인 반구간 전개.]]. $t\to\infty$에서 **평균 온도 $A_0$**로 수렴합니다. 열이 빠져나가지 못하니 당연합니다. 예제 3의 $f=x(\pi-x)$라면 $A_0=\frac{\pi^2}6$, $A_n=-\frac4{n^2}$ (짝수 $n$), 0 (홀수 $n$)이므로
$$u=\frac{\pi^2}6-\sum_{k=1}^\infty\frac{\cos2kx}{k^2}e^{-4k^2t}$$
($t=0$, $x=0$에서 $\frac{\pi^2}6-\sum\frac1{k^2}=0$ ✓).
:::

:::fig f11heat
:::

:::ex 예제 5 (끝 온도가 0이 아닐 때)
$L=\pi$, $c=1$인 막대의 처음 온도가 균일하게 20°이고, $t>0$에서 왼쪽 끝은 20°, 오른쪽 끝은 80°로 유지한다. 온도는?
---
먼저 시간에 무관한 **정상상태** $U(x)$를 구합니다: $U''=0$, $U(0)=20$, $U(\pi)=80$에서 $U=20+\frac{60x}\pi$. $v=u-U$로 두면 $v$는 열방정식과 **양 끝 0**인 조건을 만족하고 처음 값은 $v(x,0)=20-U=-\frac{60x}\pi$. 그 사인 계수는 $B_n=\frac2\pi\int_0^\pi\big(-\frac{60x}\pi\big)\sin nx\,dx=\frac{120}\pi\cdot\frac{(-1)^n}n$이므로
$$u=20+\frac{60x}\pi+\frac{120}\pi\sum_{n=1}^\infty\frac{(-1)^n}n\sin nx\,e^{-n^2t}$$
$t\to\infty$에서 직선 분포 $U(x)$로 갑니다.
:::

### 정상상태 2차원 문제: 라플라스 방정식

2차원 열방정식 $u_t=c^2(u_{xx}+u_{yy})$의 정상(시간 무관) 문제는 $u_t=0$이므로 **라플라스 방정식** $\nabla^2u=u_{xx}+u_{yy}=0$입니다. 평면 영역 $R$과 그 경계 곡선 $C$ 위의 조건으로 이루어진 **경계값 문제**는 세 종류입니다.
- **제1 경계값 문제(디리클레 문제)**: $C$ 위에서 $u$가 주어짐.
- **제2 경계값 문제(노이만 문제)**: $C$ 위에서 법선 도함수 $u_n=\frac{\partial u}{\partial n}$이 주어짐.
- **제3 경계값 문제(혼합, 로빈 문제)**: $C$의 일부에서 $u$, 나머지에서 $u_n$이 주어짐.

**직사각형의 디리클레 문제.** 직사각형 $0<x<a$, $0<y<b$에서 윗변에 $u(x,b)=f(x)$, 나머지 세 변에서 0이라 합니다. $u=F(x)G(y)$를 $u_{xx}=-u_{yy}$에 넣고 음의 상수로 두면 $F''+kF=0$, $G''-kG=0$. 왼쪽·오른쪽 변의 조건 $F(0)=F(a)=0$에서 $k=\big(\frac{n\pi}a\big)^2$, $F_n=\sin\frac{n\pi x}a$. 그러면 $G''-\big(\frac{n\pi}a\big)^2G=0$의 해는 $G=A_ne^{n\pi y/a}+B_ne^{-n\pi y/a}$이고 아랫변 조건 $G(0)=0$에서 $B_n=-A_n$, 곧 $G_n=2A_n\sinh\frac{n\pi y}a$. 마지막으로 윗변에서 $\sum\big(A_n^*\sinh\frac{n\pi b}a\big)\sin\frac{n\pi x}a=f(x)$이므로 괄호 안이 $f$의 사인 계수입니다.

:::key 직사각형의 디리클레 문제
$0<x<a$, $0<y<b$에서 윗변 $u(x,b)=f(x)$, 나머지 변 0이면
$$u(x,y)=\sum_{n=1}^\infty A_n^*\sin\frac{n\pi x}{a}\sinh\frac{n\pi y}{a},\qquad A_n^*=\frac{2}{a\sinh(n\pi b/a)}\int_0^af(x)\sin\frac{n\pi x}{a}dx$$
$$\text{극좌표: }\ \nabla^2u=u_{rr}+\frac1ru_r+\frac1{r^2}u_{\theta\theta}$$
:::

네 변 모두에 값이 있으면 한 변씩 값이 있는 네 문제를 풀어 **중첩**합니다.

:::ex 예제 6 (윗변만 100°)
직사각형 $0<x<2$, $0<y<1$의 윗변을 100°, 나머지를 0°로 유지할 때 중심 $(1,\frac12)$의 정상 온도는?
---
$a=2$, $f=100$: $\int_0^2100\sin\frac{n\pi x}2dx=\frac{200}{n\pi}(1-(-1)^n)$이므로 $A_n^*=\frac{400}{n\pi\sinh(n\pi/2)}$ (홀수 $n$), 짝수에서 0.
$$u\big(1,\tfrac12\big)=\sum_{n\text{ 홀수}}\frac{400}{n\pi\sinh(n\pi/2)}\sin\frac{n\pi}2\sinh\frac{n\pi}4\approx44.5^\circ$$
(첫 항만으로 약 48.1, 둘째 항 약 $-4.0$, 셋째 항 약 $+0.5$로 급수가 빨리 수렴). 경계값 0과 100 사이이고, 넓은 윗변 쪽이 뜨거우니 산술평균 25보다 높습니다.
:::

:::ex 예제 7 (아랫변에 값)
정사각형 $0<x,y<1$에서 아랫변 $u(x,0)=\sin\pi x$, 나머지 변 0인 정상 온도는?
---
윗변 대신 아랫변에 값이 있으므로 $\sinh n\pi y$ 대신 $\sinh n\pi(1-y)$를 씁니다(아랫변에서 최대, 윗변에서 0).
$$u=\frac{\sin\pi x\,\sinh\pi(1-y)}{\sinh\pi}$$
:::

**방법의 통일성.** 라플라스 방정식은 전하가 없는 영역의 **정전기 퍼텐셜**도 지배하므로, 위의 해는 윗변을 퍼텐셜 $f(x)$로, 나머지를 접지한 직사각형의 퍼텐셜이기도 합니다. 정상상태의 2차원 파동방정식도 라플라스 방정식이 되므로, 세 변이 평면에 고정되고 네 번째 변이 $f(x)$만큼 들린 고무막의 모양이기도 합니다. 전혀 다른 물리계가 같은 수학 모델을 가진다는 것은 수학의 통일하는 힘을 보여 줍니다.

:::tip 시험 포인트
라플라스 방정식의 해는 영역 내부에서 최댓값·최솟값을 갖지 않습니다(최대 원리). 답이 경계값 범위를 벗어나면 틀린 것입니다[[ch12:13.4|해석함수의 실수부·허수부는 조화함수입니다.]].
:::
` },
      { k: '12.7', p: '568', title: '매우 긴 막대: 푸리에 적분과 변환 풀이', body: R`
앞 절의 논의를 **무한히 긴 막대**(수백 m 길이의 전선 같은 아주 긴 막대의 좋은 모델)로 넓힙니다. 이때는 푸리에 급수 대신 **푸리에 적분**이 쓰입니다. 양쪽으로 무한한, 옆면이 단열된 막대에서 경계조건은 없고 초기조건 $u(x,0)=f(x)$ ($-\infty<x<\infty$)만 있습니다.

### 푸리에 적분으로

$u=F(x)G(t)$를 넣으면 앞 절처럼 $F''+p^2F=0$, $\dot G+c^2p^2G=0$이고 해는
$$u(x,t;p)=(A\cos px+B\sin px)\,e^{-c^2p^2t}$$
(분리 상수가 양수이면 시간에 따라 지수적으로 커지는 해가 되어 물리적 의미가 없으므로 음수 $-p^2$). 경계조건이 없으니 $p$가 이산적인 값으로 제한되지 않습니다. $p$를 한 수의 배수로 잡는 급수는 주기함수가 되지만 $f$는 주기적이라고 가정하지 않았으므로, $A=A(p)$, $B=B(p)$로 보고 **$p$에 대해 적분**(연속적인 중첩)합니다:
$$u(x,t)=\int_0^\infty\big[A(p)\cos px+B(p)\sin px\big]e^{-c^2p^2t}\,dp$$
$t=0$에서 이것이 $f$가 되어야 하므로 $A(p)=\frac1\pi\int_{-\infty}^\infty f(v)\cos pv\,dv$, $B(p)=\frac1\pi\int f(v)\sin pv\,dv$는 $f$의 푸리에 적분 계수입니다[[ch10:11.7|푸리에 적분 $f=\int_0^\infty(A\cos px+B\sin px)\,dp$.]]. 대입해 $\cos p(x-v)$로 묶고 적분 순서를 바꾸면
$$u(x,t)=\frac1\pi\int_{-\infty}^\infty f(v)\Big[\int_0^\infty e^{-c^2p^2t}\cos(px-pv)\,dp\Big]dv$$
안쪽 적분은 공식 $\int_0^\infty e^{-s^2}\cos2bs\,ds=\frac{\sqrt\pi}2e^{-b^2}$에서 $s=cp\sqrt t$, $b=\frac{x-v}{2c\sqrt t}$로 두면 $\frac{\sqrt\pi}{2c\sqrt t}\exp\big(-\frac{(x-v)^2}{4c^2t}\big)$입니다. 따라서:

:::key 무한 막대의 열방정식
$$u(x,t)=\frac1{2c\sqrt{\pi t}}\int_{-\infty}^{\infty}f(v)\,\exp\Big(-\frac{(x-v)^2}{4c^2t}\Big)dv$$
:::

$z=\frac{v-x}{2c\sqrt t}$로 바꾸면 $u=\frac1{\sqrt\pi}\int_{-\infty}^\infty f(x+2cz\sqrt t)\,e^{-z^2}dz$로도 쓸 수 있습니다. $f$가 유계이고 유한 구간마다 적분가능하면 이것이 해입니다. 초기 온도와 **가우스 핵**의 합성곱이고, 가우스 핵의 폭 $\sim2c\sqrt t$가 열이 퍼지는 거리입니다(시간의 제곱근에 비례).

:::ex 예제 1 (가우스 모양의 처음 온도)
$f(x)=e^{-x^2}$이면 $u(x,t)$는?
---
가우스 함수끼리의 합성곱은 가우스 함수이므로
$$u=\frac1{\sqrt{1+4c^2t}}\exp\Big(-\frac{x^2}{1+4c^2t}\Big)$$
최고 온도는 $1/\sqrt{1+4c^2t}$로 줄고 폭은 $\sqrt{1+4c^2t}$에 비례해 넓어집니다. 총열량 $\int u\,dx=\sqrt\pi$는 보존됩니다.
:::

:::ex 예제 2 (온도가 다른 두 막대를 맞붙이기: 오차함수)
$x>0$ 부분은 $U_0$, $x<0$ 부분은 0°인 두 막대를 $t=0$에 맞붙였다. 온도는?
---
공식에서 $f(v)=U_0$ ($v>0$), 0 ($v<0$)이므로 $z=\frac{v-x}{2c\sqrt t}$로 바꾸면 적분 구간이 $z>-\frac x{2c\sqrt t}$가 되어
$$u=\frac{U_0}{\sqrt\pi}\int_{-x/(2c\sqrt t)}^\infty e^{-z^2}dz=\frac{U_0}2\Big[1+\operatorname{erf}\frac x{2c\sqrt t}\Big],\qquad\operatorname{erf}w=\frac2{\sqrt\pi}\int_0^we^{-z^2}dz$$
적분은 초등함수가 아니지만 표로 정리된 **오차함수**로 쓸 수 있습니다. 이음매 $x=0$의 온도는 $t>0$이면 줄곧 $U_0/2$이고, 온도 변화가 거리 $\sim2c\sqrt t$까지 퍼집니다. (양쪽 끝이 유한한 막대라도 짧은 시간 동안은 이 해가 좋은 근사입니다.)
:::

:::fig f11gauss
:::

### 푸리에 변환으로

같은 결과를 푸리에 변환으로 더 빨리 얻을 수 있습니다. 푸리에 변환은 전체 축의 문제에, 코사인·사인 변환은 양의 반축 문제에 씁니다[[ch10:11.9|푸리에 변환의 미분·합성곱 성질과 가우스 함수의 변환.]].
- **변환.** $x$에 대해 변환하면 $\mathcal F(u_{xx})=-w^2\hat u$이고, 미분과 적분의 순서를 바꿀 수 있다면 $\mathcal F(u_t)=\frac{\partial\hat u}{\partial t}$이므로 $\frac{\partial\hat u}{\partial t}=-c^2w^2\hat u$. $w$에 대한 도함수가 없으니 $t$에 대한 1계 ODE입니다.
- **풀기.** $\hat u(w,t)=C(w)e^{-c^2w^2t}$이고 초기조건에서 $C(w)=\hat f(w)$, 곧 $\hat u=\hat f\,e^{-c^2w^2t}$.
- **역변환.** $\hat u$는 두 변환의 곱이므로 역변환은 **합성곱** $f*g$이고, $\hat g\propto e^{-c^2w^2t}$의 역변환은 가우스 함수 $e^{-x^2/(4c^2t)}$입니다(가우스 함수의 변환은 가우스 함수). 계수를 맞추면 위의 공식과 똑같습니다.

**반무한 막대** ($x\ge0$, $u(0,t)=0$)는 푸리에 **사인 변환**으로 풉니다. 사인 변환의 도함수 공식이 경계값 $u(0,t)$를 끌어들이기 때문입니다[[ch10:11.8|$\mathcal F_s\{f''\}=-w^2\hat f_s+\sqrt{2/\pi}\,wf(0)$.]]. $u(0,t)=0$이면 그 항이 사라져 $\hat u_s=\hat f_se^{-c^2w^2t}$이고, 역사인 변환으로
$$u(x,t)=\frac2\pi\int_0^\infty\!\!\int_0^\infty f(p)\sin wp\,e^{-c^2w^2t}\sin wx\,dp\,dw$$
예를 들어 처음 온도가 균일한 $U_0$이고 끝을 0°로 식히면, $f$를 음의 쪽으로 홀함수 확장($-U_0$)해 무한 막대 공식을 쓴 것과 같아 $u=U_0\operatorname{erf}\frac x{2c\sqrt t}$입니다(예제 2의 해에서 $U_0$를 $2U_0$로, 0을 $-U_0$로 바꾼 셈).
` },
      { k: '12.8', p: '575', title: '모델링: 막과 2차원 파동방정식', body: R`
진동하는 현의 2차원판은 북 가죽처럼 당겨서 가장자리를 고정한 **탄성 막**의 운동입니다. 모델링은 §12.2와 거의 같습니다.

**물리적 가정.**
1. 단위 넓이당 질량 $\rho$가 일정하고(균질한 막), 완전히 유연해 굽힘에 저항하지 않습니다.
2. 막을 당겨 $xy$평면에서 경계 전체를 고정합니다. 당겨서 생긴 **단위 길이당 장력** $T$는 모든 점, 모든 방향에서 같고 운동 중에 변하지 않습니다.
3. 운동 중의 변위 $u(x,y,t)$는 막의 크기에 비해 작고, 모든 기울기가 작습니다.

**힘.** 변이 $\Delta x$, $\Delta y$인 작은 조각을 봅니다(변위와 기울기가 작으므로 변의 길이는 거의 $\Delta x$, $\Delta y$). 장력은 단위 길이당 힘이므로 변에 작용하는 힘은 약 $T\Delta x$, $T\Delta y$이고, 막이 유연하므로 막에 접합니다.
- **수평 성분**은 힘에 기울기의 코사인(거의 1)을 곱한 것이라 마주 보는 변에서 거의 같고, 따라서 수평 방향의 운동은 무시할 수 있습니다. 막의 운동은 **가로 운동**으로 볼 수 있습니다.
- **수직 성분.** 오른쪽·왼쪽 변에서는 $T\Delta y\sin\beta$와 $-T\Delta y\sin\alpha$ ($\alpha,\beta$: 변 가운데에서의 기울기 각)이고, 각이 작으니 사인을 탄젠트로 바꾸면 합력은
$$T\Delta y\,(\tan\beta-\tan\alpha)=T\Delta y\,\big[u_x(x+\Delta x,y_1)-u_x(x,y_2)\big]$$
($y_1,y_2$는 $y$와 $y+\Delta y$ 사이의 값). 같은 방법으로 위·아래 변의 합력은 $T\Delta x\,\big[u_y(x_1,y+\Delta y)-u_y(x_2,y)\big]$.

**뉴턴 제2법칙.** 두 합력의 합이 조각의 질량 $\rho\Delta x\Delta y$ × 가속도 $u_{tt}$와 같으므로, $\rho\Delta x\Delta y$로 나누면
$$u_{tt}=\frac T\rho\Big[\frac{u_x(x+\Delta x,y_1)-u_x(x,y_2)}{\Delta x}+\frac{u_y(x_1,y+\Delta y)-u_y(x_2,y)}{\Delta y}\Big]$$
$\Delta x,\Delta y\to0$이면
$$u_{tt}=c^2\big(u_{xx}+u_{yy}\big)=c^2\nabla^2u,\qquad c^2=\frac T\rho$$
를 얻습니다. 이것이 **2차원 파동방정식**이고, 1차원 현의 식이 자연스럽게 2차원으로 확장된 모양입니다.
` },
      { k: '12.9', p: '577', title: '직사각형 막과 이중 푸리에 급수', body: R`
가장자리가 고정된 직사각형 막 $R: 0\le x\le a$, $0\le y\le b$의 모델은
$$u_{tt}=c^2(u_{xx}+u_{yy}),\qquad u=0\ (\text{경계}),\qquad u(x,y,0)=f(x,y),\quad u_t(x,y,0)=g(x,y)$$
입니다. 현의 문제와 아주 비슷하게 세 단계로 풉니다.

### 1단계: 두 번의 변수분리

먼저 $u=F(x,y)G(t)$를 넣고 $c^2FG$로 나누면 $\frac{\ddot G}{c^2G}=\frac1F(F_{xx}+F_{yy})$. 양변은 상수이고, 경계조건을 만족하는 0이 아닌 해가 있으려면 음수 $-\nu^2$이어야 합니다:
$$\ddot G+\lambda^2G=0\ \ (\lambda=c\nu),\qquad F_{xx}+F_{yy}+\nu^2F=0$$
둘째 식이 **2차원 헬름홀츠 방정식**입니다. 다시 $F=H(x)Q(y)$로 분리하면 $\frac{H''}H=-\frac1Q(Q''+\nu^2Q)=-k^2$에서
$$H''+k^2H=0,\qquad Q''+p^2Q=0,\qquad p^2=\nu^2-k^2$$

### 2단계: 경계조건 — 고유함수와 고유값

$F=HQ$가 네 변에서 0이어야 하므로 $H(0)=H(a)=0$, $Q(0)=Q(b)=0$. 현과 똑같이 $k=\frac{m\pi}a$, $p=\frac{n\pi}b$이고
$$F_{mn}=\sin\frac{m\pi x}a\sin\frac{n\pi y}b\qquad(m,n=1,2,\dots)$$
$\lambda=c\sqrt{k^2+p^2}$이므로 고유값과 고유함수는 다음과 같습니다.

:::key 직사각형 막의 고유진동
$$u_{mn}=\big(B_{mn}\cos\lambda_{mn}t+B_{mn}^*\sin\lambda_{mn}t\big)\sin\frac{m\pi x}{a}\sin\frac{n\pi y}{b},\qquad \lambda_{mn}=c\pi\sqrt{\frac{m^2}{a^2}+\frac{n^2}{b^2}}$$
$$B_{mn}=\frac{4}{ab}\int_0^b\!\!\int_0^af(x,y)\sin\frac{m\pi x}{a}\sin\frac{n\pi y}{b}\,dx\,dy\qquad(\text{이중 푸리에 급수})$$
:::

$u_{mn}$의 진동수는 $\lambda_{mn}/2\pi$입니다.
- 진동수가 기본진동수의 정수배가 아니므로 막의 소리는 현처럼 조화롭지 않습니다.
- **마디선**(움직이지 않는 곡선): $u_{mn}$은 $x=\frac am,\dots$와 $y=\frac bn,\dots$에 직선 마디선을 가집니다.
- 정사각형($a=b$)에서는 $(m,n)$과 $(n,m)$이 같은 진동수를 가지므로 둘의 일차결합도 같은 진동수의 모드입니다(**축퇴**). 그래서 마디선이 대각선 등 여러 모양으로 나타날 수 있습니다.

:::ex 예제 1 (정사각형 막의 진동수와 마디선)
$a=b=1$, $c=1$인 막의 가장 낮은 세 진동수 $\lambda_{mn}/(2\pi)$는? $u_{12}$와 $u_{21}$을 섞은 모드의 마디선은?
---
$\lambda_{mn}=\pi\sqrt{m^2+n^2}$. $(1,1)$: $\frac{\sqrt2}2\approx0.707$, $(1,2),(2,1)$: $\frac{\sqrt5}2\approx1.118$ (축퇴), $(2,2)$: $\sqrt2\approx1.414$.
$F_{12}=\sin\pi x\sin2\pi y$의 마디선은 $y=\frac12$, $F_{21}$은 $x=\frac12$입니다. 같은 진동수이므로 $\cos\sqrt5\pi t\,(F_{12}+BF_{21})$도 모드이고, $\sin2\theta=2\sin\theta\cos\theta$로
$$F_{12}+BF_{21}=2\sin\pi x\sin\pi y\,(\cos\pi y+B\cos\pi x)$$
막 내부에서 $\sin\pi x\sin\pi y\ne0$이므로 마디선은 $\cos\pi y+B\cos\pi x=0$. $B=1$이면 $y=1-x$ (반대각선), $B=-1$이면 $y=x$ (대각선), 다른 $B$에서는 곡선이 됩니다.
**더 많은 축퇴.** $m^2+n^2$을 두 제곱수의 합으로 여러 방법으로 쓸 수 있으면 더 많은 모드가 같은 진동수를 가집니다: $50=1^2+7^2=5^2+5^2$이므로 $F_{17}$, $F_{71}$, $F_{55}$가 모두 $\lambda=\pi\sqrt{50}$입니다.
:::

:::fig f11membrane
:::

### 3단계: 이중 푸리에 급수

초기조건을 맞추려고 이중급수 $u=\sum_m\sum_nu_{mn}$을 생각합니다. $t=0$에서
$$f(x,y)=\sum_{m=1}^\infty\sum_{n=1}^\infty B_{mn}\sin\frac{m\pi x}a\sin\frac{n\pi y}b$$
이것이 $f$의 **이중 푸리에 급수**입니다($f$, $f_x$, $f_y$, $f_{xy}$가 연속이면 충분). 계수는 두 번의 사인 급수로 구합니다: $K_m(y)=\sum_nB_{mn}\sin\frac{n\pi y}b$로 두면 $f=\sum_mK_m(y)\sin\frac{m\pi x}a$는 $y$를 고정한 $x$의 사인 급수이므로 $K_m(y)=\frac2a\int_0^af(x,y)\sin\frac{m\pi x}adx$, 그리고 $K_m(y)$의 사인 계수가 $B_{mn}=\frac2b\int_0^bK_m(y)\sin\frac{n\pi y}bdy$. 합치면 위의 **일반화된 오일러 공식** $B_{mn}=\frac4{ab}\iint f\sin\sin$입니다. 같은 방법으로 $B_{mn}^*=\frac4{ab\lambda_{mn}}\int_0^b\!\int_0^ag\sin\frac{m\pi x}a\sin\frac{n\pi y}bdx\,dy$.

:::ex 예제 2 (정사각형 막의 진동)
$a=b=1$, $c=1$, 처음 속도 0, 처음 변위 $f(x,y)=16x(1-x)y(1-y)$ (가운데 높이 1)인 막의 운동은?
---
$f$가 $x$의 함수와 $y$의 함수의 곱이므로 이중적분이 두 단일적분의 곱이 됩니다. $\int_0^1x(1-x)\sin m\pi x\,dx=\frac{2(1-(-1)^m)}{m^3\pi^3}$ (홀수 $m$에서 $\frac4{m^3\pi^3}$)이므로
$$B_{mn}=4\cdot16\cdot\frac4{m^3\pi^3}\cdot\frac4{n^3\pi^3}=\frac{1024}{\pi^6m^3n^3}\approx\frac{1.065}{m^3n^3}\qquad(m,n\text{ 홀수})$$
$B_{mn}^*=0$. 따라서
$$u=1.065\Big[\cos\sqrt2\pi t\,\sin\pi x\sin\pi y+\frac{\cos\sqrt{10}\pi t}{27}\big(\sin3\pi x\sin\pi y+\sin\pi x\sin3\pi y\big)+\cdots\Big]$$
첫 항이 처음 모양과 거의 같고(마디선 없음) 압도적으로 큽니다. 다음 항들은 $1/27$ 이하이고 $x=\frac13,\frac23$ 등의 마디선을 가집니다.
:::
` },
      { k: '12.10', p: '585', title: '극좌표 라플라시안, 원형 막, 푸리에-베셀 급수', body: R`
PDE의 경계값 문제에서는 **경계의 식이 가장 간단해지는 좌표**를 고르는 것이 일반 원칙입니다. 원형 막(북 가죽)을 다루기 위해 파동방정식의 라플라시안을 극좌표 $x=r\cos\theta$, $y=r\sin\theta$로 바꿉니다.

### 극좌표 라플라시안의 유도

연쇄법칙으로 $u_x=u_rr_x+u_\theta\theta_x$. 한 번 더 $x$로 미분하고 곱의 미분과 연쇄법칙을 다시 쓰면
$$u_{xx}=(u_{rr}r_x+u_{r\theta}\theta_x)r_x+u_rr_{xx}+(u_{\theta r}r_x+u_{\theta\theta}\theta_x)\theta_x+u_\theta\theta_{xx}$$
$r=\sqrt{x^2+y^2}$, $\theta=\arctan\frac yx$을 미분하면
$$r_x=\frac xr,\qquad\theta_x=-\frac y{r^2},\qquad r_{xx}=\frac{y^2}{r^3},\qquad\theta_{xx}=\frac{2xy}{r^4}$$
이것들을 넣고($u_{r\theta}=u_{\theta r}$)
$$u_{xx}=\frac{x^2}{r^2}u_{rr}-\frac{2xy}{r^3}u_{r\theta}+\frac{y^2}{r^4}u_{\theta\theta}+\frac{y^2}{r^3}u_r+\frac{2xy}{r^4}u_\theta$$
같은 방법으로 $u_{yy}=\frac{y^2}{r^2}u_{rr}+\frac{2xy}{r^3}u_{r\theta}+\frac{x^2}{r^4}u_{\theta\theta}+\frac{x^2}{r^3}u_r-\frac{2xy}{r^4}u_\theta$. 더하면 혼합항이 지워지고 $x^2+y^2=r^2$이므로
$$\nabla^2u=u_{rr}+\frac1ru_r+\frac1{r^2}u_{\theta\theta}$$

### 원형 막의 반지름 대칭 진동

원형 막은 북, 펌프, 마이크, 스피커 등에 쓰입니다. 평평하고 탄성적이며 굽힘에 저항하지 않는 원형 막의 진동은 $u_{tt}=c^2\big(u_{rr}+\frac1ru_r+\frac1{r^2}u_{\theta\theta}\big)$입니다. 반지름 $R$인 막에서 **반지름 대칭**($\theta$와 무관)인 해를 구합니다: $u_{\theta\theta}=0$이고
$$u_{tt}=c^2\Big(u_{rr}+\frac1ru_r\Big),\qquad u(R,t)=0,\qquad u(r,0)=f(r),\quad u_t(r,0)=g(r)$$

**1단계: 베셀 방정식.** $u=W(r)G(t)$로 분리하면 $\frac{\ddot G}{c^2G}=\frac1W\big(W''+\frac1rW'\big)=-k^2$ (0이 아닌 해가 경계조건을 만족하려면 음수)이므로
$$\ddot G+\lambda^2G=0\ (\lambda=ck),\qquad W''+\frac1rW'+k^2W=0$$
$s=kr$로 두면 $\frac{dW}{dr}=k\frac{dW}{ds}$, $\frac{d^2W}{dr^2}=k^2\frac{d^2W}{ds^2}$이고 $k^2$으로 나누면 $\frac{d^2W}{ds^2}+\frac1s\frac{dW}{ds}+W=0$, 곧 **차수 0인 베셀 방정식**입니다[[ch04:5.4|베셀 함수 $J_0$과 원점에서 발산하는 $Y_0$.]].
**2단계: 경계조건.** 해는 $J_0(s)$와 $Y_0(s)$인데 $Y_0$은 $s=0$에서 무한대라 막의 변위가 유한해야 하는 조건에 맞지 않으므로 $W=J_0(kr)$. 경계에서 $J_0(kR)=0$이어야 하고, $J_0$은 양의 영점을 무한히 많이 가집니다:
$$\alpha_1\approx2.4048,\quad\alpha_2\approx5.5201,\quad\alpha_3\approx8.6537,\quad\alpha_4\approx11.7915,\ \dots$$
(간격이 약간 불규칙). 따라서 $k_m=\frac{\alpha_m}R$, $W_m=J_0\big(\frac{\alpha_m}Rr\big)$이고 $\lambda_m=ck_m=\frac{c\alpha_m}R$.

:::key 원형 막
$$u_m=\big(A_m\cos\lambda_mt+B_m\sin\lambda_mt\big)J_0\Big(\frac{\alpha_m}{R}r\Big),\qquad \lambda_m=\frac{c\,\alpha_m}{R}$$
$$A_m=\frac{2}{R^2J_1^2(\alpha_m)}\int_0^Rr\,f(r)\,J_0\Big(\frac{\alpha_m}Rr\Big)dr\qquad(\text{푸리에-베셀 계수})$$
:::

$u_m$이 $m$번째 **정규 모드**이고 진동수는 $\lambda_m/2\pi$입니다. $J_0$의 영점은 사인함수의 영점과 달리 고르게 놓이지 않으므로 **북소리는 바이올린과 전혀 다릅니다**. $m=1$에서는 막 전체가 함께 오르내리고, $m=2$에서는 $J_0(\alpha_2r/R)=0$인 $r=\frac{\alpha_1}{\alpha_2}R\approx0.436R$가 원형 마디선이 되어 안쪽과 바깥쪽이 반대로 움직입니다. 일반적으로 $m$번째 모드는 $m-1$개의 원형 마디선을 가집니다.

:::fig f11drum
:::

**3단계: 푸리에-베셀 급수.** 급수 $u=\sum_m\big(A_m\cos\lambda_mt+B_m\sin\lambda_mt\big)J_0\big(\frac{\alpha_m}Rr\big)$에서 $t=0$이면 $\sum A_mJ_0\big(\frac{\alpha_m}Rr\big)=f(r)$이므로 $A_m$은 $f$의 **푸리에-베셀 급수**의 계수입니다($f$가 $0\le r\le R$에서 미분가능하면 충분). 계수 공식에 가중함수 $r$이 들어가는 것은 $J_0(k_mr)$들이 가중함수 $r$에 대해 직교하기 때문입니다[[ch10:11.6|푸리에-베셀 급수와 가중 직교성.]]. $B_m$은 처음 속도 $g$에서 같은 방법으로 구합니다(끝에 $\lambda_m$으로 나눔). 계수는 보통 수치적분이나 베셀 함수의 항등식으로 계산합니다.

:::ex 예제 1 (북의 음)
반지름 $R=0.3$ m인 북 가죽의 장력이 $T=2000$ N/m, 면밀도 $\rho=0.25$ kg/m²이다. 반지름 대칭 모드의 처음 세 진동수는?
---
$c=\sqrt{T/\rho}=\sqrt{8000}\approx89.4$ m/s, 진동수 $\frac{\lambda_m}{2\pi}=\frac{c\alpha_m}{2\pi R}$:
$$114.1\text{ Hz},\qquad261.9\text{ Hz},\qquad410.6\text{ Hz}$$
비율 $1:2.295:3.599$는 정수가 아니므로(현이라면 $1:2:3$) 음높이가 또렷하지 않은 북 특유의 소리가 납니다.
:::

:::ex 예제 2 (한 모드만 들뜨게 하기)
처음 변위 0, 처음 속도 $g(r)=v_0J_0\big(\frac{\alpha_1}Rr\big)$이면?
---
$A_m=0$이고 $g$가 이미 첫 고유함수이므로 $B_1\lambda_1=v_0$, 나머지 0:
$$u=\frac{v_0R}{c\alpha_1}J_0\Big(\frac{\alpha_1}Rr\Big)\sin\frac{c\alpha_1t}R$$
현의 예제 4와 같은 구조입니다. 처음 조건이 고유함수 하나와 같으면 적분 없이 그 모드만 나타납니다.
:::

$\theta$에도 의존하는 모드는 $u=J_n(k r)\cos n\theta$ 꼴이 되어 지름 방향 마디선도 생깁니다(차수 $n$인 베셀 함수).
` },
      { k: '12.11', p: '593', title: '원기둥·구 좌표의 라플라스 방정식과 퍼텐셜', body: R`
물리와 공학에서 가장 중요한 PDE 가운데 하나가 3차원 라플라스 방정식
$$\nabla^2u=u_{xx}+u_{yy}+u_{zz}=0$$
입니다. 해의 이론을 **퍼텐셜 이론**, 연속인 2계 편도함수를 가진 해를 **조화함수**라 합니다. 중력, 정전기(§9.7 Theorem 3), 정상 열 흐름(§12.5), 유체 흐름(§18.4)에 나옵니다. 점 $(X,Y,Z)$의 질량 하나가 만드는 중력 퍼텐셜 $u=\frac cr$ ($r$: 거리)은 라플라스 방정식을 만족하고, 밀도 $\rho(X,Y,Z)$로 영역 $T$에 퍼진 질량의 퍼텐셜 $u=k\iiint_T\frac{\rho}r\,dX\,dY\,dZ$도 질량이 없는 점에서 만족합니다($\nabla^2\frac1r=0$이고 $\rho$는 $x,y,z$의 함수가 아니므로).

실제 문제는 경계 곡면 $S$를 가진 영역 $T$에서의 경계값 문제이고, 2차원처럼 **디리클레 문제**($S$에서 $u$), **노이만 문제**($S$에서 $u_n$), **혼합(로빈) 문제**가 있습니다. 첫 단계는 $S$가 간단한 식이 되는 좌표를 고르는 것입니다.

- **원기둥좌표** $x=r\cos\theta$, $y=r\sin\theta$, $z=z$: 극좌표 식에 $u_{zz}$를 더하면
$$\nabla^2u=u_{rr}+\frac1ru_r+\frac1{r^2}u_{\theta\theta}+u_{zz}$$
→ 베셀 함수.
- **구좌표** $x=r\cos\theta\sin\phi$, $y=r\sin\theta\sin\phi$, $z=r\cos\phi$ ($\phi$는 양의 $z$축과의 각): 연쇄법칙으로
$$\nabla^2u=\frac1{r^2}\Big[\frac{\partial}{\partial r}\Big(r^2\frac{\partial u}{\partial r}\Big)+\frac1{\sin\phi}\frac{\partial}{\partial\phi}\Big(\sin\phi\frac{\partial u}{\partial\phi}\Big)+\frac1{\sin^2\phi}\frac{\partial^2u}{\partial\theta^2}\Big]$$
(교재에 따라 $\theta$와 $\phi$를 바꿔 쓰기도 하니 주의).

### 구의 디리클레 문제 (축대칭)

반지름 $R$인 구면 $S$의 퍼텐셜(또는 온도)이 $u(R,\phi)=f(\phi)$로 주어지고 $\theta$와 무관하면 해도 $\theta$와 무관하므로
$$\frac{\partial}{\partial r}\Big(r^2\frac{\partial u}{\partial r}\Big)+\frac1{\sin\phi}\frac{\partial}{\partial\phi}\Big(\sin\phi\frac{\partial u}{\partial\phi}\Big)=0$$
(바깥 문제에서는 무한대에서 $u\to0$도 요구). $u=G(r)H(\phi)$를 넣고 $GH$로 나누면 양변이 상수 $k$이고, $k=n(n+1)$로 두면
- $r^2G''+2rG'-n(n+1)G=0$: **오일러-코시 방정식**. $G=r^a$를 넣으면 $a(a-1)+2a-n(n+1)=0$, $a=n$ 또는 $-n-1$이므로 $G_n=r^n$, $G_n^*=r^{-n-1}$.
- $\frac1{\sin\phi}\frac d{d\phi}\big(\sin\phi\frac{dH}{d\phi}\big)+n(n+1)H=0$: $w=\cos\phi$로 바꾸면 $\frac d{d\phi}=-\sin\phi\frac d{dw}$이고 $\frac d{dw}\big[(1-w^2)\frac{dH}{dw}\big]+n(n+1)H=0$, 곧 **르장드르 방정식**이므로 $H=P_n(\cos\phi)$[[ch04:5.2|르장드르 방정식과 $P_n$.]].

**안쪽 문제.** $r^n$은 원점에서 유계이므로 $u=\sum A_nr^nP_n(\cos\phi)$를 쓰고, $r=R$에서 $f(\phi)$가 되도록 하면 $A_nR^n$이 $f$의 **푸리에-르장드르 계수**입니다($dw=-\sin\phi\,d\phi$로 바꿈).
**바깥 문제.** $r^n$은 무한대에서 0이 되지 않으므로 $r^{-n-1}$을 씁니다(반대로 이것은 원점에서 발산해 안쪽에 쓸 수 없음).

:::key 구의 디리클레 문제 (축대칭)
$$u=\sum_{n=0}^\infty A_n\Big(\frac rR\Big)^nP_n(\cos\phi)\ (r<R),\qquad A_n=\frac{2n+1}{2}\int_0^\pi f(\phi)P_n(\cos\phi)\sin\phi\,d\phi$$
바깥쪽($r>R$)은 $\big(\frac Rr\big)^{n+1}$을 씁니다.
:::

$f$와 $f'$이 조각마다 연속이면 이 급수를 항별 미분할 수 있어 해가 됩니다.

:::ex 예제 1 (반구마다 반대 전위)
반지름 1인 금속 구가 적도의 얇은 절연 띠로 나뉘어, 위 반구는 $+V_0$, 아래 반구는 $-V_0$로 유지된다. 구 안팎의 전위는?
---
$w=\cos\phi$로 쓰면 $f=V_0$ ($w>0$), $-V_0$ ($w<0$)인 홀함수이므로 짝수 $n$의 계수는 0이고, 홀수 $n$에서 $A_n=\frac{2n+1}2\int_{-1}^1fP_n\,dw=(2n+1)V_0\int_0^1P_n\,dw$.
$\int_0^1P_1dw=\frac12$, $\int_0^1P_3dw=\int_0^1\frac{5w^3-3w}2dw=-\frac18$, $\int_0^1P_5dw=\frac1{16}$이므로 $A_1=\frac32V_0$, $A_3=-\frac78V_0$, $A_5=\frac{11}{16}V_0$.
$$u_{\text{안}}=V_0\Big[\frac32rP_1(\cos\phi)-\frac78r^3P_3(\cos\phi)+\frac{11}{16}r^5P_5(\cos\phi)-\cdots\Big]$$
$$u_{\text{밖}}=V_0\Big[\frac3{2r^2}P_1(\cos\phi)-\frac7{8r^4}P_3(\cos\phi)+\cdots\Big]$$
전체 전하가 0이라 바깥에 $\frac1r$ 항(점전하)이 없고, 멀리서는 $\frac{\cos\phi}{r^2}$, 곧 **쌍극자**의 퍼텐셜처럼 보입니다. 안쪽 중심 근처는 $u\approx\frac32V_0z$로 거의 균일한 전기장입니다.
:::

:::ex 예제 2 (적분 없이: 다항식 경계값)
구면에서 $f(\phi)=\cos^2\phi$일 때 구 안의 퍼텐셜은?
---
$w=\cos\phi$로 쓰면 $w^2=\tfrac13P_0(w)+\tfrac23P_2(w)$이므로 적분 없이
$$u=\frac13+\frac23\Big(\frac rR\Big)^2P_2(\cos\phi)=\frac13+\frac13\Big(\frac rR\Big)^2\big(3\cos^2\phi-1\big)$$
중심($r=0$)의 값 $\frac13$은 구면 위의 평균값과 같습니다(조화함수의 평균값 성질)[[ch16:18.6|조화함수의 평균값 정리와 최대 원리.]].
:::

같은 방법으로 $f=\cos\phi$이면 안쪽 $u=\frac rR\cos\phi=\frac zR$, 바깥쪽 $u=\frac{R^2\cos\phi}{r^2}$입니다. 경계값이 $\cos\phi$의 다항식이면 르장드르 다항식으로 다시 써서 적분을 피하세요.
` },
      { k: '12.12', p: '600', title: '라플라스 변환에 의한 PDE 풀이', body: R`
라플라스 변환은 PDE에도 쓸 수 있고, 특히 한 독립변수가 양의 반축($t\ge0$ 등)에 걸쳐 있을 때 좋습니다. 두 변수의 PDE에서 절차는 6장과 비슷합니다.
1. 한 변수(보통 $t$)에 대해 라플라스 변환합니다. 다른 변수에 대한 도함수는 변환식 안으로 그대로 들어가므로 **미지함수의 변환에 대한 ODE**가 됩니다. 주어진 경계·초기조건도 여기에 들어갑니다[[ch05:6.2|도함수의 라플라스 변환 $\mathcal L(f'')=s^2F-sf(0)-f'(0)$.]].
2. 그 ODE를 풀어 미지함수의 변환을 얻습니다.
3. 역변환해 원래 문제의 해를 얻습니다.

방정식의 계수가 $t$에 의존하지 않으면 라플라스 변환이 문제를 크게 단순화합니다.

:::ex 예제 1 (반무한 현의 끝을 흔들기)
반무한 현 $x\ge0$이 처음에 정지해 있고($w(x,0)=w_t(x,0)=0$), 끝을 $w(0,t)=f(t)$로 움직이며, $w$는 유계입니다. $w_{tt}=c^2w_{xx}$를 푸세요.
---
**변환.** $W(x,s)=\mathcal L\{w\}$라 하면 $\mathcal L\{w_{tt}\}=s^2W-sw(x,0)-w_t(x,0)=s^2W$ (초기조건이 0). 적분과 $x$에 대한 미분의 순서를 바꿀 수 있다면 $\mathcal L\{w_{xx}\}=W_{xx}$이므로
$$s^2W=c^2W_{xx},\qquad W_{xx}-\frac{s^2}{c^2}W=0$$
$x$에 대한 도함수만 있으니 $x$의 ODE로 볼 수 있고, 일반해는 $W=A(s)e^{sx/c}+B(s)e^{-sx/c}$.
**조건.** $x\to\infty$에서 $w$가 유계(현의 먼 끝이 고정)이려면 $W$도 그래야 하는데, $s>0$에서 $e^{sx/c}$는 커지므로 $A=0$. 끝 조건에서 $W(0,s)=F(s)=\mathcal L\{f\}$이므로 $B=F$.
$$W=F(s)e^{-sx/c}\ \Longrightarrow\ w(x,t)=f\Big(t-\frac xc\Big)\,u\Big(t-\frac xc\Big)$$
끝의 움직임이 지연 시간 $x/c$ 뒤에 그대로 전달됩니다. $t$-이동 정리가 물리적 지연을 그대로 표현합니다[[ch05:6.3|$t$-이동: $\mathcal L\{f(t-a)u(t-a)\}=e^{-as}F(s)$.]].
예를 들어 끝을 반 주기의 사인 모양 $f(t)=\sin t$ ($0<t<\pi$), 0 (그 밖)으로 한 번 들었다 놓으면, 점 $x$는 $t=x/c$까지 가만히 있다가 $\frac xc<t<\frac xc+\pi$ 동안 $\sin(t-\frac xc)$만큼 들렸다 내려갑니다. 모양을 유지한 채 속력 $c$로 오른쪽으로 가는 하나의 봉우리이고, 형식적으로 구한 이 해가 모든 조건을 만족하는지는 대입해 확인합니다.
:::

:::ex 예제 2 (반무한 막대의 끝을 가열)
처음 0°인 반무한 막대 $x\ge0$의 끝을 $t>0$에서 $U_0$로 유지한다($u_t=c^2u_{xx}$, $u$ 유계). 온도는?
---
$t$에 대해 변환하면 초기값이 0이므로 $sU=c^2U_{xx}$, 유계인 해는 $U=B(s)e^{-x\sqrt s/c}$, 끝 조건 $U(0,s)=\frac{U_0}s$에서
$$U(x,s)=\frac{U_0}se^{-x\sqrt s/c}$$
변환표의 $\mathcal L^{-1}\big\{\frac1se^{-a\sqrt s}\big\}=\operatorname{erfc}\frac a{2\sqrt t}$ ($\operatorname{erfc}=1-\operatorname{erf}$)를 쓰면
$$u(x,t)=U_0\operatorname{erfc}\frac x{2c\sqrt t}$$
§12.7의 오차함수 해와 같은 꼴이며, 열이 들어가는 깊이가 $\sqrt t$에 비례합니다.
:::
` },
    ],
  });
})();
