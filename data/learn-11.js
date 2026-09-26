/* 개념 정리 — 11 편미분방정식 (Kreyszig 10판 12장, §12.1–12.12). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 11,
    summary: R`교재 12장은 파동·열·라플라스 방정식을 **모델링(방정식 세우기)**과 **풀이(변수분리 + 푸리에 급수·적분)**로 나누어 다룹니다. 1차원 현과 막대에서 시작해 직사각형·원형 막, 원기둥·구 좌표의 퍼텐셜까지 같은 틀이 반복됩니다. 11장의 푸리에 해석이 그대로 도구가 됩니다.`,
    goals: [
      R`$AC-B^2$로 2계 선형 PDE를 분류하고 특성선을 구할 수 있다`,
      R`현의 파동방정식과 막대의 열방정식을 물리 법칙에서 유도할 수 있다`,
      R`변수분리 → 고유함수 → 푸리에 계수의 세 단계로 경계값 문제를 풀 수 있다`,
      R`달랑베르 해, 무한 막대의 가우스 핵, 라플라스 변환 풀이를 쓸 수 있다`,
      R`직사각형·원형 막과 구 안의 퍼텐셜에서 이중 푸리에 급수·푸리에–베셀·르장드르 전개를 쓸 수 있다`,
    ],
    sections: [
      { k: '12.1', p: '540', title: 'PDE의 기본 개념', body: R`
편미분방정식(PDE)은 여러 변수의 함수와 그 편도함수 사이의 관계입니다. 시간과 공간에 따라 변하는 양(변위, 온도, 전위)은 대부분 PDE로 기술됩니다.

- **계**: 가장 높은 편도함수의 차수. 공학에서 중요한 것은 대부분 2계입니다.
- **선형**: 미지함수 $u$와 그 편도함수에 대해 1차. **동차**: $u$를 포함하지 않는 항이 없음.

:::key 대표적인 2계 PDE
$$u_{tt}=c^2u_{xx}\ (\text{1차원 파동}),\qquad u_t=c^2u_{xx}\ (\text{1차원 열}),\qquad u_{xx}+u_{yy}=0\ (\text{2차원 라플라스})$$
$$u_{xx}+u_{yy}=f(x,y)\ (\text{푸아송}),\qquad u_{tt}=c^2(u_{xx}+u_{yy})\ (\text{2차원 파동}),\qquad \nabla^2u=0\ (\text{3차원 라플라스})$$
:::

:::thm 중첩 원리 (교재 Theorem 1)
$u_1,u_2$가 어떤 영역에서 선형 동차 PDE의 해이면 $c_1u_1+c_2u_2$도 그 영역에서 해입니다.
:::

ODE의 일반해는 임의상수를 포함하지만 PDE의 일반해는 **임의함수**를 포함합니다. 예를 들어 $u_{xy}=0$의 해는 $u=f(x)+g(y)$입니다. 그래서 PDE는 일반해보다 **경계조건·초기조건을 만족하는 해**를 직접 찾는 방식으로 풉니다.

:::ex 예제
$u=f(x-ct)$가 파동방정식을 만족함을 보이고 그 의미를 설명하세요.
---
연쇄법칙으로 $u_{tt}=c^2f''$, $u_{xx}=f''$이므로 $u_{tt}=c^2u_{xx}$. $f$의 모양이 시간 $t$ 동안 $ct$만큼 오른쪽으로 옮겨가므로, 모양을 유지한 채 속력 $c$로 진행하는 파동입니다(§12.4의 달랑베르 해).
:::
` },
      { k: '12.2', p: '543', title: '모델링: 진동하는 현과 파동방정식', body: R`
**가정.** 현의 선밀도 $\rho$는 일정, 완전히 유연하고 장력 $T$가 커서 중력은 무시, 변위와 기울기가 작아 각 점이 수직으로만 움직입니다.

**유도.** 길이 $\Delta x$인 작은 조각의 양 끝에서 장력의 수평 성분은 같고(수평으로 움직이지 않으므로) 이를 $T$라 합니다. 수직 성분의 차가 조각을 가속시키므로
$$T\big(\tan\beta-\tan\alpha\big)=\rho\,\Delta x\,u_{tt}$$
기울기 $\tan\beta=u_x(x+\Delta x)$, $\tan\alpha=u_x(x)$를 넣고 $\Delta x$로 나누어 $\Delta x\to0$이면
$$u_{tt}=c^2u_{xx},\qquad c^2=\frac{T}{\rho}$$

$c$는 파동의 속력입니다. 장력을 키우거나 현을 가볍게 하면 빨라지고, 음이 높아집니다(§12.3).

:::tip 모델링 포인트
시험에서 유도를 물으면 "장력의 수평 성분 일정 → 수직 성분의 차 = 질량 × 가속도 → 극한" 세 줄을 쓰면 됩니다.
:::
` },
      { k: '12.3', p: '545', title: '변수분리와 푸리에 급수 풀이', body: R`
양 끝이 고정된 길이 $L$의 현: $u_{tt}=c^2u_{xx}$, 경계조건 $u(0,t)=u(L,t)=0$, 초기조건 $u(x,0)=f(x)$, $u_t(x,0)=g(x)$.

**1단계 — 변수분리.** $u=F(x)G(t)$를 넣으면 $\frac{F''}{F}=\frac{\ddot G}{c^2G}$. 좌변은 $x$만, 우변은 $t$만의 함수이므로 공통 상수 $k$입니다.

**2단계 — 경계조건을 만족하는 $F$.** $F''=kF$, $F(0)=F(L)=0$. $k\ge0$이면 $F\equiv0$뿐이고, $k=-p^2$일 때 $F=\sin px$, $pL=n\pi$. 이것은 스투름–리우빌 고유값 문제입니다[[ch10:11.5|$y''+\lambda y=0$, $y(0)=y(L)=0$의 고유함수 $\sin\frac{n\pi x}L$.]].

**3단계 — 초기조건을 푸리에 급수로.** 각 $n$에 대해 $u_n=(B_n\cos\lambda_nt+B_n^*\sin\lambda_nt)\sin\frac{n\pi x}L$ (고유함수·**정규모드**), $\lambda_n=\frac{cn\pi}{L}$ (고유값). 중첩하고 초기조건을 맞추면 계수는 사인 반구간 전개입니다[[ch10:11.2|사인 반구간 전개 $b_n=\frac2L\int_0^Lf\sin\frac{n\pi x}Ldx$.]].

:::key 진동하는 현
$$u(x,t)=\sum_{n=1}^\infty\big(B_n\cos\lambda_nt+B_n^*\sin\lambda_nt\big)\sin\frac{n\pi x}{L},\qquad \lambda_n=\frac{cn\pi}{L}$$
$$B_n=\frac2L\int_0^Lf(x)\sin\frac{n\pi x}{L}dx,\qquad B_n^*=\frac{2}{cn\pi}\int_0^Lg(x)\sin\frac{n\pi x}{L}dx$$
:::

$n$번째 모드의 진동수는 $\frac{\lambda_n}{2\pi}=\frac{cn}{2L}$ Hz이고, 기본진동수의 정수배라서 현의 소리는 "조화롭게" 들립니다. $n$번째 모드는 양 끝 외에 $n-1$개의 마디(정지한 점)를 가집니다.

:::ex 예제 (항등식으로 계수 없이 풀기)
$L=1$, $c=2$, $u(x,0)=\sin^3\pi x$, $u_t(x,0)=0$을 푸세요.
---
적분 대신 항등식 $\sin^3\theta=\frac34\sin\theta-\frac14\sin3\theta$를 쓰면 초기 변위가 이미 사인 급수입니다: $B_1=\frac34$, $B_3=-\frac14$, 나머지 0. $\lambda_n=2n\pi$이므로
$$u=\tfrac34\sin\pi x\cos2\pi t-\tfrac14\sin3\pi x\cos6\pi t$$
:::

:::warn 초기속도 계수
$B_n^*$에는 $\lambda_n$으로 나눈 인자 $\frac{L}{cn\pi}$가 붙습니다. $u_t$를 미분하면 $\lambda_n$이 튀어나오기 때문입니다. 이것을 빠뜨리는 실수가 가장 흔합니다.
:::
` },
      { k: '12.4', p: '553', title: '달랑베르 해, 특성선, PDE의 분류', body: R`
무한히 긴 현에서는 경계조건이 없어 급수 대신 다른 방법이 필요합니다. 새 변수 $v=x+ct$, $w=x-ct$를 쓰면 파동방정식은 $u_{vw}=0$이 되어 바로 적분됩니다.

:::key 달랑베르 해 (무한한 현)
$$u(x,t)=\frac12\big[f(x+ct)+f(x-ct)\big]+\frac1{2c}\int_{x-ct}^{x+ct}g(s)\,ds$$
:::

초기 변위는 반씩 나뉘어 왼쪽과 오른쪽으로 속력 $c$로 진행합니다. 점 $(x,t)$의 값은 초기선 위의 구간 $[x-ct,\ x+ct]$(의존 영역)에만 의존합니다. 직선 $x\pm ct=$상수가 **특성선**입니다.

:::ex 예제
$f(x)=\dfrac1{1+x^2}$, $g=0$일 때 $u$와 $t=2/c$일 때의 모양은?
---
$u=\frac12\Big[\frac1{1+(x+ct)^2}+\frac1{1+(x-ct)^2}\Big]$. $t=2/c$이면 높이가 절반인 두 봉우리가 $x=\pm2$에 있습니다.
:::

**분류와 표준형.** 일반적인 2계 선형 PDE에서 $u_{xy}$ 항 계수의 부호를 판별식처럼 쓰면 성질이 세 부류로 나뉩니다. 특성방정식 $Ay'^2-2By'+C=0$ ($y'=dy/dx$)의 실근 개수가 특성선 족의 개수입니다.

:::key 2계 선형 PDE의 분류
$$Au_{xx}+2Bu_{xy}+Cu_{yy}=F(x,y,u,u_x,u_y)$$
| $AC-B^2$ | 종류 | 특성선 | 표준형 | 예 |
|---|---|---|---|---|
| $<0$ | 쌍곡형 | 실수 두 족 | $u_{vw}=F^*$ | 파동 |
| $=0$ | 포물형 | 실수 한 족 | $u_{ww}=F^*$ | 열 |
| $>0$ | 타원형 | 복소수 | $u_{vv}+u_{ww}=F^*$ | 라플라스 |
:::

계수가 변수이면 종류가 영역마다 다를 수 있습니다(트리코미 방정식 $yu_{xx}+u_{yy}=0$은 $y>0$에서 타원형, $y<0$에서 쌍곡형).

:::warn 2B
$u_{xy}$의 계수가 $2B$입니다. $u_{xx}+3u_{xy}+u_{yy}$이면 $B=\tfrac32$.
:::
` },
      { k: '12.5', p: '557', title: '모델링: 공간에서의 열 흐름과 열방정식', body: R`
**가정.** 비열 $\sigma$, 밀도 $\rho$, 열전도율 $K$가 일정하고 내부에 열원이 없습니다. 열은 온도가 높은 곳에서 낮은 곳으로 흐르며 속도는 온도 기울기에 비례합니다(푸리에 법칙): $\mathbf v=-K\nabla u$.

**유도.** 물체 안의 임의의 영역 $T$와 그 경계 $S$를 생각합니다. $T$에서 빠져나가는 열량은
$$\oiint_S\mathbf v\cdot\mathbf n\,dA=-K\iiint_T\nabla^2u\,dV$$
(발산 정리와 $\operatorname{div}\nabla u=\nabla^2u$)[[ch09:10.7|발산 정리 $\iiint\operatorname{div}\mathbf F\,dV=\oiint\mathbf F\cdot\mathbf n\,dA$.]][[ch08:9.8|$\operatorname{div}(\nabla f)=\nabla^2f$ (라플라시안).]]. 이것은 내부 열량 $\iiint\sigma\rho u\,dV$의 감소율과 같아야 하므로
$$\iiint_T\Big(\sigma\rho\,u_t-K\nabla^2u\Big)dV=0$$
영역 $T$가 임의이므로 피적분함수가 0입니다:
$$u_t=c^2\nabla^2u,\qquad c^2=\frac{K}{\sigma\rho}\ (\text{열확산율})$$

시간에 따라 변하지 않는 정상상태이면 $u_t=0$이라 **라플라스 방정식** $\nabla^2u=0$이 됩니다.
` },
      { k: '12.6', p: '558', title: '열방정식의 푸리에 급수 풀이, 정상상태 2차원 문제', body: R`
양 끝이 0°로 유지되는 길이 $L$의 막대: $u_t=c^2u_{xx}$, $u(0,t)=u(L,t)=0$, $u(x,0)=f(x)$. 변수분리는 현과 같고, 시간 부분만 $\dot G=-c^2p^2G$라 진동 대신 **지수 감소**합니다.

:::key 막대의 열전도 (양 끝 0°)
$$u(x,t)=\sum_{n=1}^\infty B_n\sin\frac{n\pi x}{L}\,e^{-\lambda_n^2t},\qquad \lambda_n=\frac{cn\pi}{L},\qquad B_n=\frac2L\int_0^Lf(x)\sin\frac{n\pi x}{L}dx$$
:::

감소율 $\lambda_n^2$이 $n^2$에 비례하므로 높은 모드는 빨리 사라지고, 시간이 조금 지나면 첫 항 $B_1\sin\frac{\pi x}Le^{-\lambda_1^2t}$ 모양만 남습니다.

:::ex 예제 1
$L=\pi$, $c^2=1$, $f(x)=50\sin x+20\sin3x$일 때 가운데($x=\pi/2$) 온도가 10°가 되는 시각은?
---
$u=50e^{-t}\sin x+20e^{-9t}\sin3x$. $x=\frac\pi2$에서 $\sin\frac{3\pi}2=-1$이므로 $u=50e^{-t}-20e^{-9t}$. 두 번째 항은 금방 작아지므로 근사적으로 $50e^{-t}=10$, $t\approx\ln5\approx1.61$ (그때 $20e^{-9t}\approx10^{-5}$라 무시해도 됨).
:::

**다른 경계조건.**
- **양 끝 단열** ($u_x=0$): 코사인 급수 $u=A_0+\sum A_n\cos\frac{n\pi x}Le^{-\lambda_n^2t}$. 열이 빠져나가지 않으므로 평균 온도 $A_0$로 수렴합니다[[ch10:11.2|코사인 반구간 전개.]].
- **끝 온도가 0이 아님** $u(0)=T_1$, $u(L)=T_2$: 정상상태 $U(x)=T_1+(T_2-T_1)\frac xL$를 빼면 양 끝 0인 문제가 됩니다.

**정상상태 2차원 문제(디리클레 문제).** 얇은 판의 정상상태 온도는 $u_{xx}+u_{yy}=0$이고 경계에서 $u$가 주어집니다. 한 변에만 값이 있는 경우를 풀고 네 변을 중첩합니다.

:::key 직사각형의 디리클레 문제
$0<x<a$, $0<y<b$에서 윗변 $u(x,b)=f(x)$, 나머지 변 0이면
$$u(x,y)=\sum_{n=1}^\infty A_n^*\sin\frac{n\pi x}{a}\sinh\frac{n\pi y}{a},\qquad A_n^*=\frac{2}{a\sinh(n\pi b/a)}\int_0^af(x)\sin\frac{n\pi x}{a}dx$$
$$\text{극좌표: }\ \nabla^2u=u_{rr}+\frac1ru_r+\frac1{r^2}u_{\theta\theta}$$
:::

:::ex 예제 2
정사각형 $0<x,y<1$에서 아랫변 $u(x,0)=\sin\pi x$, 나머지 변 0인 정상 온도는?
---
윗변 대신 아랫변에 값이 있으므로 $\sinh n\pi y$ 대신 $\sinh n\pi(1-y)$를 씁니다(아랫변에서 최대, 윗변에서 0).
$$u=\frac{\sin\pi x\,\sinh\pi(1-y)}{\sinh\pi}$$
:::

:::tip 시험 포인트
라플라스 방정식의 해는 영역 내부에서 최댓값·최솟값을 갖지 않습니다(최대 원리). 답이 경계값 범위를 벗어나면 틀린 것입니다[[ch12:13.4|해석함수의 실수부·허수부는 조화함수입니다.]].
:::
` },
      { k: '12.7', p: '568', title: '매우 긴 막대: 푸리에 적분과 변환 풀이', body: R`
막대가 양쪽으로 무한히 길면 경계조건이 없고 고유값이 연속적으로 분포합니다. 그래서 급수 대신 **푸리에 적분**을 씁니다.

$u=F(x)G(t)$에서 $F=A\cos px+B\sin px$ (모든 $p\ge0$), $G=e^{-c^2p^2t}$. 이들을 $p$에 대해 적분(연속적인 중첩)하고 초기조건을 맞추면 $A(p)$, $B(p)$는 $f$의 푸리에 적분 계수입니다[[ch10:11.7|푸리에 적분 $f=\int_0^\infty(A\cos px+B\sin px)\,dp$.]]. 적분 순서를 바꾸고 가우스 적분을 계산하면 다음 공식을 얻습니다.

:::key 무한 막대의 열방정식
$$u(x,t)=\frac1{2c\sqrt{\pi t}}\int_{-\infty}^{\infty}f(v)\,\exp\Big(-\frac{(x-v)^2}{4c^2t}\Big)dv$$
:::

초기 온도와 **가우스 핵**의 합성곱입니다. 같은 결과를 푸리에 변환으로 더 빨리 얻을 수 있습니다: $x$에 대해 변환하면 $\hat u_t=-c^2w^2\hat u$, 즉 $\hat u=\hat f\,e^{-c^2w^2t}$이고, 곱의 역변환은 합성곱입니다[[ch10:11.9|푸리에 변환의 미분·합성곱 성질과 가우스 함수의 변환.]].

:::ex 예제
$f(x)=e^{-x^2}$이면 $u(x,t)$는?
---
가우스 함수끼리의 합성곱은 가우스 함수이므로
$$u=\frac1{\sqrt{1+4c^2t}}\exp\Big(-\frac{x^2}{1+4c^2t}\Big)$$
최고 온도는 $1/\sqrt{1+4c^2t}$로 줄고 폭은 $\sqrt{1+4c^2t}$에 비례해 넓어집니다. 총열량 $\int u\,dx=\sqrt\pi$는 보존됩니다.
:::

**반무한 막대** ($x\ge0$, $u(0,t)=0$)는 푸리에 **사인 변환**으로 풉니다. 사인 변환의 도함수 공식이 경계값 $u(0,t)$를 끌어들이기 때문입니다[[ch10:11.8|$\mathcal F_s\{f''\}=-w^2\hat f_s+\sqrt{2/\pi}\,wf(0)$.]].
` },
      { k: '12.8', p: '575', title: '모델링: 막과 2차원 파동방정식', body: R`
북의 가죽처럼 얇고 균일한 막이 경계에 고정되어 있고, 단위 길이당 장력 $T$가 모든 방향으로 같다고 가정합니다. 작은 사각형 조각에 작용하는 장력의 수직 성분을 $x$ 방향과 $y$ 방향에서 각각 현처럼 계산해 더하면
$$u_{tt}=c^2\big(u_{xx}+u_{yy}\big)=c^2\nabla^2u,\qquad c^2=\frac T\rho$$
를 얻습니다($\rho$는 단위 넓이당 질량). 1차원 현의 식이 자연스럽게 2차원으로 확장된 모양입니다.
` },
      { k: '12.9', p: '577', title: '직사각형 막과 이중 푸리에 급수', body: R`
$0\le x\le a$, $0\le y\le b$인 막, 경계에서 $u=0$. 먼저 $u=F(x,y)G(t)$로 시간을 분리하면 $\ddot G+\nu^2G=0$과 **헬름홀츠 방정식** $F_{xx}+F_{yy}+\nu^2F=0$ ($\nu=\lambda/c$)이 나오고, 다시 $F=H(x)Q(y)$로 분리합니다.

:::key 직사각형 막의 고유진동
$$u_{mn}=\big(B_{mn}\cos\lambda_{mn}t+B_{mn}^*\sin\lambda_{mn}t\big)\sin\frac{m\pi x}{a}\sin\frac{n\pi y}{b},\qquad \lambda_{mn}=c\pi\sqrt{\frac{m^2}{a^2}+\frac{n^2}{b^2}}$$
$$B_{mn}=\frac{4}{ab}\int_0^b\!\!\int_0^af(x,y)\sin\frac{m\pi x}{a}\sin\frac{n\pi y}{b}\,dx\,dy\qquad(\text{이중 푸리에 급수})$$
:::

- 진동수가 기본진동수의 정수배가 아니므로 막의 소리는 현처럼 조화롭지 않습니다.
- 정사각형($a=b$)에서는 $(m,n)$과 $(n,m)$이 같은 진동수를 가지므로 둘의 일차결합도 같은 진동수의 모드입니다(**축퇴**). 그래서 마디선이 대각선 등 여러 모양으로 나타날 수 있습니다.

:::ex 예제
$a=b=1$, $c=1$인 막의 가장 낮은 세 진동수 $\lambda_{mn}/(2\pi)$는?
---
$\lambda_{mn}=\pi\sqrt{m^2+n^2}$. $(1,1)$: $\frac{\sqrt2}2\approx0.707$, $(1,2),(2,1)$: $\frac{\sqrt5}2\approx1.118$ (축퇴), $(2,2)$: $\sqrt2\approx1.414$.
:::
` },
      { k: '12.10', p: '585', title: '극좌표 라플라시안, 원형 막, 푸리에–베셀 급수', body: R`
원형 영역에서는 극좌표가 자연스럽습니다. 연쇄법칙으로 라플라시안을 바꾸면
$$\nabla^2u=u_{rr}+\frac1ru_r+\frac1{r^2}u_{\theta\theta}$$
입니다(증명은 증명 탭).

**반지름 $R$인 원형 막의 반지름 대칭 진동.** $u=u(r,t)$이면 $u_{tt}=c^2\big(u_{rr}+\frac1ru_r\big)$. $u=W(r)G(t)$로 분리하면
$$W''+\frac1rW'+k^2W=0\qquad(k=\nu/c)$$
$s=kr$로 두면 차수 0인 베셀 방정식이고, $r=0$에서 유계인 해는 $J_0(kr)$입니다[[ch04:5.4|베셀 함수 $J_0$과 원점에서 발산하는 $Y_0$.]]. 경계조건 $W(R)=0$에서 $kR$이 $J_0$의 영점 $\alpha_m$ ($\alpha_1\approx2.405$, $\alpha_2\approx5.520$, $\alpha_3\approx8.654$)이어야 합니다.

:::key 원형 막
$$u_m=\big(A_m\cos\lambda_mt+B_m\sin\lambda_mt\big)J_0\Big(\frac{\alpha_m}{R}r\Big),\qquad \lambda_m=\frac{c\,\alpha_m}{R}$$
$$A_m=\frac{2}{R^2J_1^2(\alpha_m)}\int_0^Rr\,f(r)\,J_0\Big(\frac{\alpha_m}Rr\Big)dr\qquad(\text{푸리에–베셀 계수})$$
:::

계수 공식에 가중함수 $r$이 들어가는 것은 $J_0(k_mr)$들이 가중함수 $r$에 대해 직교하기 때문입니다[[ch10:11.6|푸리에–베셀 급수와 가중 직교성.]]. 진동수의 비 $\alpha_2/\alpha_1\approx2.30$은 정수가 아니므로 북소리도 조화롭지 않습니다. $m$번째 모드는 $m-1$개의 원형 마디선을 가집니다.
` },
      { k: '12.11', p: '593', title: '원기둥·구 좌표의 라플라스 방정식과 퍼텐셜', body: R`
중력·정전기·정상 온도의 퍼텐셜은 $\nabla^2u=0$을 만족합니다. 경계의 모양에 맞는 좌표를 고르는 것이 핵심입니다.

- **원기둥좌표** $(r,\theta,z)$: $\nabla^2u=u_{rr}+\frac1ru_r+\frac1{r^2}u_{\theta\theta}+u_{zz}$ → 베셀 함수.
- **구좌표** $(r,\theta,\phi)$ ($\phi$는 $z$축과의 각): 축대칭($\theta$와 무관)이면
$$\nabla^2u=\frac1{r^2}\Big[(r^2u_r)_r+\frac{1}{\sin\phi}(\sin\phi\,u_\phi)_\phi\Big]$$

**구 안의 퍼텐셜.** 반지름 $R$인 구의 표면에서 $u(R,\phi)=f(\phi)$가 주어지면, $u=G(r)H(\phi)$로 분리해 $G=r^n$ (안쪽) 또는 $r^{-n-1}$ (바깥쪽), $H=P_n(\cos\phi)$를 얻습니다. $w=\cos\phi$로 바꾸면 $H$의 방정식이 르장드르 방정식이 되기 때문입니다[[ch04:5.2|르장드르 방정식과 $P_n$.]].

:::key 구의 디리클레 문제 (축대칭)
$$u=\sum_{n=0}^\infty A_n\Big(\frac rR\Big)^nP_n(\cos\phi)\ (r<R),\qquad A_n=\frac{2n+1}{2}\int_0^\pi f(\phi)P_n(\cos\phi)\sin\phi\,d\phi$$
바깥쪽($r>R$)은 $\big(\frac Rr\big)^{n+1}$을 씁니다.
:::

:::ex 예제
구면에서 $f(\phi)=\cos^2\phi$일 때 구 안의 퍼텐셜은?
---
$w=\cos\phi$로 쓰면 $w^2=\tfrac13P_0(w)+\tfrac23P_2(w)$이므로 적분 없이
$$u=\frac13+\frac23\Big(\frac rR\Big)^2P_2(\cos\phi)=\frac13+\frac13\Big(\frac rR\Big)^2\big(3\cos^2\phi-1\big)$$
중심($r=0$)의 값 $\frac13$은 구면 위의 평균값과 같습니다(조화함수의 평균값 성질)[[ch16:18.6|조화함수의 평균값 정리와 최대 원리.]].
:::
` },
      { k: '12.12', p: '600', title: '라플라스 변환에 의한 PDE 풀이', body: R`
시간 $t$가 $0$부터 시작하는 문제는 $t$에 대해 라플라스 변환하면 PDE가 $x$에 대한 ODE로 바뀝니다[[ch05:6.2|도함수의 라플라스 변환 $\mathcal L(f'')=s^2F-sf(0)-f'(0)$.]].

:::ex 예제 (반무한 현의 끝을 흔들기)
반무한 현 $x\ge0$이 처음에 정지해 있고($w(x,0)=w_t(x,0)=0$), 끝을 $w(0,t)=f(t)$로 움직이며, $w$는 유계입니다. $w_{tt}=c^2w_{xx}$를 푸세요.
---
$W(x,s)=\mathcal L\{w\}$라 하면 초기조건이 0이므로 $s^2W=c^2W_{xx}$. 일반해 $W=A(s)e^{sx/c}+B(s)e^{-sx/c}$에서 유계이려면 $A=0$, 끝 조건에서 $B=F(s)$.
$$W=F(s)e^{-sx/c}\ \Longrightarrow\ w(x,t)=f\Big(t-\frac xc\Big)\,u\Big(t-\frac xc\Big)$$
끝의 움직임이 지연 시간 $x/c$ 뒤에 그대로 전달됩니다. $t$-이동 정리가 물리적 지연을 그대로 표현합니다[[ch05:6.3|$t$-이동: $\mathcal L\{f(t-a)u(t-a)\}=e^{-as}F(s)$.]].
:::
` },
    ],
  });
})();
