/* 개념 정리 — 05 라플라스 변환 (Kreyszig 10판 6장, §6.1–6.9). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 5,
    summary: R`라플라스 변환은 **미분방정식을 대수방정식으로** 바꿉니다. 초기조건이 처음부터 들어가므로 일반해를 거치지 않고 IVP의 답이 바로 나오고, 스위치를 켜고 끄는 입력(단위계단함수)과 순간 충격(디랙 델타)을 자연스럽게 다룹니다. 계산의 대부분은 **변환표, 두 이동정리, 부분분수**이고, 합성곱 정리로 적분방정식과 "입력 * 충격 응답"이라는 선형계의 구조를 봅니다.`,
    goals: [
      R`정의로 기본 변환을 구하고, 존재 조건을 말할 수 있다`,
      R`$s$-이동·$t$-이동 정리와 도함수·적분의 변환을 쓸 수 있다`,
      R`초기값 문제를 보조방정식 $Y(s)$로 풀 수 있다`,
      R`구간별 함수를 $u(t-a)$로 쓰고 변환·역변환할 수 있다`,
      R`델타 함수 입력의 응답을 구하고 부분분수를 능숙하게 할 수 있다`,
      R`합성곱 정리로 역변환과 적분방정식을 풀 수 있다`,
      R`변환의 미분·적분, 주기함수, 연립 ODE에 라플라스 변환을 쓸 수 있다`,
    ],
    sections: [
      { k: '6.1', p: '204', title: '라플라스 변환, 선형성, s-이동', body: R`
:::def 라플라스 변환
$$F(s)=\mathcal L(f)=\int_0^\infty e^{-st}f(t)\,dt$$
$f(t)$는 $t\ge0$에서 정의된 원함수, $F(s)$는 변환(상함수)입니다. 역변환은 $f=\mathcal L^{-1}(F)$.
:::

- **선형성**(교재 Theorem 1): $\mathcal L\{af+bg\}=a\mathcal L(f)+b\mathcal L(g)$. 예: $\cosh at=\frac12(e^{at}+e^{-at})$에서 $\mathcal L(\cosh at)=\frac12\big(\frac1{s-a}+\frac1{s+a}\big)=\frac s{s^2-a^2}$.
- **존재**(Theorem 3): $f$가 구간별 연속이고 **증가 제한** $|f(t)|\le Me^{kt}$를 만족하면 $s>k$에서 $\mathcal L(f)$가 존재합니다. 다항식, 지수, 삼각함수는 모두 만족하지만 $e^{t^2}$는 아닙니다.
- **유일성**: 연속함수의 역변환은 하나뿐이므로 표를 거꾸로 읽어도 됩니다.

:::key 기본 변환표
| $f(t)$ | $F(s)$ | $f(t)$ | $F(s)$ |
|---|---|---|---|
| $1$ | $\dfrac1s$ | $e^{at}$ | $\dfrac{1}{s-a}$ |
| $t^n$ | $\dfrac{n!}{s^{n+1}}$ | $t^a\ (a>0)$ | $\dfrac{\Gamma(a+1)}{s^{a+1}}$ |
| $\cos\omega t$ | $\dfrac{s}{s^2+\omega^2}$ | $\sin\omega t$ | $\dfrac{\omega}{s^2+\omega^2}$ |
| $\cosh at$ | $\dfrac{s}{s^2-a^2}$ | $\sinh at$ | $\dfrac{a}{s^2-a^2}$ |
:::

$t^a$의 변환에 감마 함수가 나옵니다[[ch04:5.4|감마 함수 $\Gamma(\nu+1)=\nu\Gamma(\nu)$.]]. $\cos$와 $\sin$은 $e^{i\omega t}$의 변환 $\frac1{s-i\omega}=\frac{s+i\omega}{s^2+\omega^2}$의 실수부·허수부로 한 번에 얻습니다.

:::key s-이동 (제1이동정리)
$$\mathcal L\{e^{at}f(t)\}=F(s-a),\qquad \mathcal L^{-1}\{F(s-a)\}=e^{at}f(t)$$
:::

$t$ 영역에서 $e^{at}$를 곱하면 $s$ 영역에서 $a$만큼 이동합니다. 감쇠진동 $e^{-\alpha t}\cos\omega t$가 이 정리의 대표 응용이고, 역변환할 때는 분모를 **완전제곱**해서 $(s+\alpha)^2+\omega^2$ 꼴로 만듭니다.

:::ex 예제
(a) $\mathcal L\{3-2e^{4t}+\sin2t\}$, (b) $\mathcal L\{e^{-2t}\cos3t\}$
---
(a) 선형성: $\dfrac3s-\dfrac2{s-4}+\dfrac2{s^2+4}$.
(b) $\mathcal L(\cos3t)=\frac s{s^2+9}$에서 $s\to s+2$: $\dfrac{s+2}{(s+2)^2+9}$.
:::

푸리에 변환은 $e^{-st}$ 대신 $e^{-iwx}$를 쓰고 $-\infty$부터 적분하는 형제 변환입니다[[ch10:11.9|푸리에 변환.]].
` },
      { k: '6.2', p: '211', title: '도함수와 적분의 변환, 초기값 문제', body: R`
부분적분 $\int_0^\infty e^{-st}f'\,dt=\big[e^{-st}f\big]_0^\infty+s\int_0^\infty e^{-st}f\,dt$에서 **미분이 $s$ 곱하기로** 바뀝니다(교재 Theorem 1–3).

:::key 도함수와 적분의 변환
$$\mathcal L(f')=sF-f(0),\qquad \mathcal L(f'')=s^2F-sf(0)-f'(0)$$
$$\mathcal L\Big\{\int_0^t f(\tau)\,d\tau\Big\}=\frac{F(s)}{s}$$
:::

**초기값 문제를 푸는 세 단계.**
1. 양변을 변환해 $Y(s)$에 대한 **보조방정식**을 세운다(초기조건이 자동으로 들어감).
2. $Y(s)$에 대해 풀고 부분분수로 분해한다.
3. 표를 거꾸로 읽어 $y(t)=\mathcal L^{-1}(Y)$를 얻는다.

$y''+ay'+by=r(t)$의 보조방정식은 $(s^2+as+b)Y=(s+a)y(0)+y'(0)+R(s)$이므로
$$Y=\big[(s+a)y(0)+y'(0)\big]Q(s)+R(s)Q(s),\qquad Q(s)=\frac1{s^2+as+b}\ (\text{전달함수})$$
$Q$의 분모는 특성다항식 그 자체입니다[[ch02:2.3|미분연산자 $P(D)$와 특성다항식.]]. 초기조건이 0이면 $Y=RQ$, 즉 출력 = 입력 × 전달함수.

:::ex 예제
$y''-3y'+2y=4$, $y(0)=1$, $y'(0)=0$
---
$(s^2Y-s)-3(sY-1)+2Y=\dfrac4s$에서 $(s-1)(s-2)Y=s-3+\dfrac4s=\dfrac{s^2-3s+4}{s}$.
가림법으로 부분분수: $Y=\dfrac2s-\dfrac2{s-1}+\dfrac1{s-2}$.
$$y=2-2e^t+e^{2t}$$
검산: $y(0)=1$, $y'(0)=-2+2=0$ ✓. 고전적 방법(동차해 + 미정계수법)과 같은 답이지만, 상수 두 개를 따로 구하는 단계가 없습니다[[ch02:2.7|미정계수법.]].
:::

:::tip 초기조건이 $t=0$이 아니면
$y(t_0)$, $y'(t_0)$가 주어지면 $t=\tilde t+t_0$로 바꿔 $\tilde t=0$에서 시작하는 문제로 푼 뒤 되돌립니다(이동된 데이터 문제).
:::

PDE도 한 변수에 대해 라플라스 변환하면 ODE가 됩니다[[ch11:12.12|라플라스 변환에 의한 PDE 풀이.]].
` },
      { k: '6.3', p: '217', title: '단위계단함수와 t-이동', body: R`
**단위계단함수**(헤비사이드 함수) $u(t-a)$는 $t<a$에서 0, $t>a$에서 1입니다. 스위치를 켜는 순간을 표현합니다. $u(t-a)-u(t-b)$는 $a<t<b$에서만 1인 사각 펄스입니다.

:::key t-이동 (제2이동정리)
$$\mathcal L\{f(t-a)u(t-a)\}=e^{-as}F(s),\qquad \mathcal L\{u(t-a)\}=\frac{e^{-as}}{s}$$
$$\text{다른 꼴: }\ \mathcal L\{g(t)u(t-a)\}=e^{-as}\,\mathcal L\{g(t+a)\}$$
:::

$f(t-a)u(t-a)$는 그래프 $f$를 오른쪽으로 $a$만큼 옮기고 그 앞부분을 0으로 만든 것입니다. **$s$ 영역에서 $e^{-as}$를 곱하는 것 = 시간 지연**입니다.

**구간별 함수 쓰기.** "새 식 − 옛 식"에 계단을 곱해 더합니다. $0<t<a$에서 $f_1$, $t>a$에서 $f_2$이면 $f=f_1+(f_2-f_1)u(t-a)$.

:::ex 예제 1
$f(t)=t\ (0<t<1)$, $f(t)=1\ (t>1)$의 라플라스 변환은?
---
$f=t+(1-t)u(t-1)=t-(t-1)u(t-1)$이므로 $F(s)=\dfrac1{s^2}-\dfrac{e^{-s}}{s^2}$.
:::

:::warn 흔한 실수
$\mathcal L\{t\,u(t-1)\}\ne e^{-s}/s^2$입니다. $t=(t-1)+1$로 고쳐야 $e^{-s}\big(\tfrac1{s^2}+\tfrac1s\big)$가 됩니다.
:::

:::ex 예제 2 (늦게 켜지는 입력)
$y'+2y=u(t-1)$, $y(0)=0$ (1초 뒤에 켜지는 RC 회로)
---
$(s+2)Y=\dfrac{e^{-s}}s$, $Y=e^{-s}\cdot\dfrac1{s(s+2)}=e^{-s}\cdot\dfrac12\Big(\dfrac1s-\dfrac1{s+2}\Big)$.
$e^{-s}$가 없는 부분의 역변환 $\frac12(1-e^{-2t})$에 $t\to t-1$과 $u(t-1)$을 적용합니다.
$$y=\tfrac12u(t-1)\big(1-e^{-2(t-1)}\big)$$
$t<1$에서는 0이고, 그 뒤 1/2로 다가갑니다. 회로 모델은 2장과 같습니다[[ch02:2.9|RLC 회로 모델.]].
:::
` },
      { k: '6.4', p: '225', title: '짧은 충격, 디랙 델타, 부분분수', body: R`
망치로 치는 것처럼 아주 짧은 시간에 큰 힘이 작용하는 입력은 넓이 1인 사각 펄스 $f_k=\frac1k[u(t-a)-u(t-a-k)]$의 $k\to0$ 극한으로 모델링합니다.

:::key 디랙 델타
$$\delta(t-a)=\lim_{k\to0}f_k,\qquad\int_0^\infty g(t)\,\delta(t-a)\,dt=g(a)\ (\text{거르기 성질}),\qquad\mathcal L\{\delta(t-a)\}=e^{-as}$$
:::

$\delta$는 보통의 함수가 아니라 적분 속에서만 뜻을 가지는 **일반화 함수**입니다. $\mathcal L(f_k)=\frac{e^{-as}(1-e^{-ks})}{ks}\to e^{-as}$ (로피탈). 계단함수의 "도함수"로 볼 수 있습니다.

초기조건이 0인 계에 $\delta(t)$를 넣으면 $Y=Q(s)$, 즉 전달함수의 역변환 $q(t)=\mathcal L^{-1}(Q)$가 **충격 응답**입니다. 다음 절에서 모든 입력의 응답이 이것으로 표현됩니다.

:::ex 예제 1 (진동하는 계를 치기)
$y''+4y=\delta(t-\pi)$, $y(0)=1$, $y'(0)=0$
---
$(s^2+4)Y=s+e^{-\pi s}$, $Y=\dfrac s{s^2+4}+e^{-\pi s}\dfrac1{s^2+4}$.
$$y=\cos2t+\tfrac12u(t-\pi)\sin2(t-\pi)=\cos2t+\tfrac12u(t-\pi)\sin2t$$
$t=\pi$에서 속도가 순간적으로 1 증가하고, 이후 진폭이 $\sqrt{1+\frac14}$로 커집니다. 치는 순간의 위상에 따라 진폭이 커지거나 줄어듭니다(공진과 관련[[ch02:2.8|강제진동과 공진.]]).
:::

**부분분수.** 역변환의 대부분은 유리함수 $F=\frac{P(s)}{Q(s)}$를 부분분수로 나누는 계산입니다.

:::key 부분분수 분해
- 단순 일차인수 $(s-a)$: $\dfrac{A}{s-a}$, 가림법 $A=\big[(s-a)F(s)\big]_{s=a}$ → $Ae^{at}$
- 반복 인수 $(s-a)^m$: $\dfrac{A_m}{(s-a)^m}+\cdots+\dfrac{A_1}{s-a}$, $A_{m-k}=\dfrac1{k!}\dfrac{d^k}{ds^k}\big[(s-a)^mF\big]_{s=a}$ → $\dfrac{t^{k-1}}{(k-1)!}e^{at}$
- 기약 이차인수: 완전제곱 $(s-\alpha)^2+\beta^2$로 고쳐 $e^{\alpha t}\cos\beta t$, $e^{\alpha t}\sin\beta t$
:::

:::ex 예제 2 (반복 인수)
$\mathcal L^{-1}\Big\{\dfrac{2s+1}{(s-1)^2(s+2)}\Big\}$
---
$s=-2$: $\frac{-3}{9}=-\frac13$. $(s-1)^2$의 계수: $A_2=\big[\frac{2s+1}{s+2}\big]_{s=1}=1$, $A_1=\frac{d}{ds}\big[\frac{2s+1}{s+2}\big]_{s=1}=\frac{3}{(s+2)^2}\Big|_{s=1}=\frac13$.
$$f=te^t+\tfrac13e^t-\tfrac13e^{-2t}$$
검산: $s=0$에서 원식 $\frac12$, 분해식 $1-\frac13-\frac16=\frac12$ ✓
:::

:::ex 예제 3 (복소 인수)
$\mathcal L^{-1}\Big\{\dfrac{s+3}{s^2+4s+13}\Big\}$
---
분모를 $(s+2)^2+9$로, 분자를 $(s+2)+1$로 고치면
$$\frac{s+2}{(s+2)^2+9}+\frac13\cdot\frac{3}{(s+2)^2+9}\;\Rightarrow\;e^{-2t}\Big(\cos3t+\tfrac13\sin3t\Big)$$
:::
` },
      { k: '6.5', p: '232', title: '합성곱과 적분방정식', body: R`
변환의 곱 $F(s)G(s)$의 역변환은 $fg$가 아닙니다. 그 답이 합성곱입니다.

:::key 합성곱 정리
$$(f*g)(t)=\int_0^t f(\tau)g(t-\tau)\,d\tau,\qquad \mathcal L(f*g)=F(s)G(s)$$
:::

- 교환·분배·결합법칙이 성립합니다. 그래서 적분이 쉬운 쪽을 $t-\tau$에 넣으세요.
- 그러나 보통 곱과 다른 점도 있습니다: $f*1\ne f$ (예: $t*1=\frac{t^2}2$), $f*f$가 음수일 수도 있습니다.

**응답 = 입력 * 충격 응답.** 초기조건이 0이면 $Y=RQ$이므로
$$y(t)=(r*q)(t)=\int_0^tr(\tau)\,q(t-\tau)\,d\tau$$
과거의 각 순간 $\tau$에 들어온 입력 $r(\tau)$가 경과 시간 $t-\tau$만큼의 충격 응답으로 퍼져 더해진다는 뜻입니다. 매개변수 변환법의 적분 공식과 같은 것입니다[[ch02:2.10|매개변수 변환법.]]. 푸리에 변환에도 같은 합성곱 정리가 있습니다[[ch10:11.9|푸리에 변환의 합성곱 정리.]].

:::ex 예제 1
$\mathcal L^{-1}\Big\{\dfrac{1}{s^2(s+1)}\Big\}$를 합성곱으로 구하세요.
---
$\frac1{s^2}\leftrightarrow t$, $\frac1{s+1}\leftrightarrow e^{-t}$.
$$t*e^{-t}=\int_0^t\tau e^{-(t-\tau)}d\tau=e^{-t}\big[(\tau-1)e^\tau\big]_0^t=t-1+e^{-t}$$
부분분수 $\frac1{s^2}-\frac1s+\frac1{s+1}$로도 같은 답입니다.
:::

**적분방정식.** $y(t)=f(t)+\int_0^t y(\tau)k(t-\tau)\,d\tau$ 꼴(볼테라 적분방정식)은 적분이 합성곱이므로 양변을 변환하면 $Y=F+YK$가 되어 대수적으로 풀립니다.

:::ex 예제 2
$y(t)=t-\displaystyle\int_0^t(t-\tau)\,y(\tau)\,d\tau$
---
적분은 $y*t$이므로 $Y=\dfrac1{s^2}-\dfrac{Y}{s^2}$. $Y\big(1+\frac1{s^2}\big)=\frac1{s^2}$, $Y=\dfrac1{s^2+1}$.
$$y=\sin t$$
미분해서 확인하면 $y''=-y$, $y(0)=0$, $y'(0)=1$과 같은 문제입니다.
:::
` },
      { k: '6.6', p: '238', title: '변환의 미분과 적분, 변수계수 ODE', body: R`
$F(s)=\int_0^\infty e^{-st}f\,dt$를 $s$로 미분하면 적분 안에 $-t$가 나옵니다. 반대로 $s$에 대해 적분하면 $\frac1t$이 나옵니다.

:::key 기타 성질
$$\mathcal L\{tf(t)\}=-F'(s),\qquad \mathcal L\Big\{\frac{f(t)}{t}\Big\}=\int_s^\infty F(\sigma)\,d\sigma$$
$$\text{주기 } p:\quad \mathcal L(f)=\frac{1}{1-e^{-ps}}\int_0^p e^{-st}f(t)\,dt$$
:::

:::ex 예제 1 (공진 항)
$\mathcal L\{t\sin\omega t\}$와 $\mathcal L\{t\cos\omega t\}$
---
$-\dfrac{d}{ds}\dfrac{\omega}{s^2+\omega^2}=\dfrac{2\omega s}{(s^2+\omega^2)^2}$, $-\dfrac{d}{ds}\dfrac{s}{s^2+\omega^2}=\dfrac{s^2-\omega^2}{(s^2+\omega^2)^2}$.
공진에서 나오는 $(s^2+\omega^2)^2$ 분모의 역변환이 이 둘의 조합입니다.
:::

:::ex 예제 2 (로그의 역변환)
$\mathcal L^{-1}\Big\{\ln\dfrac{s+1}{s-1}\Big\}$
---
$F'=\frac1{s+1}-\frac1{s-1}$이므로 $-tf=e^{-t}-e^t$.
$$f=\frac{e^t-e^{-t}}{t}=\frac{2\sinh t}{t}$$
미분하면 표에 있는 꼴이 되는 $F$는 이렇게 풉니다.
:::

:::ex 예제 3 (주기함수)
주기 1인 톱니파 $f(t)=t$ ($0<t<1$)
---
$\int_0^1te^{-st}dt=\frac{1-e^{-s}}{s^2}-\frac{e^{-s}}s$이므로
$$F=\frac1{1-e^{-s}}\Big(\frac{1-e^{-s}}{s^2}-\frac{e^{-s}}s\Big)=\frac1{s^2}-\frac{e^{-s}}{s(1-e^{-s})}$$
:::

**변수계수 ODE.** $\mathcal L(ty')=-\frac{d}{ds}(sY-y(0))$처럼 $t$가 곱해진 항은 $Y$의 **미분방정식**이 됩니다. 계수가 $t$의 1차식이면 $Y$에 대한 1계 ODE가 되어 풀 수 있고, 라게르 다항식이 이렇게 얻어집니다.
` },
      { k: '6.7', p: '242', title: '연립 ODE', body: R`
연립 ODE $\mathbf y'=A\mathbf y+\mathbf g$를 성분마다 변환하면 $Y_1,Y_2,\dots$에 대한 **연립 일차방정식**이 됩니다. 크래머 공식이나 소거법으로 풀고 역변환합니다[[ch03:4.6|고유값 방법으로 푸는 비동차 연립 ODE.]][[ch06:7.7|크래머 공식.]].
$$(sI-A)\mathbf Y=\mathbf y(0)+\mathbf G(s)$$
두 탱크 혼합, 회로망, 스프링으로 연결된 두 물체가 교재의 대표 예입니다.

:::ex 예제
$y_1'=-2y_1+y_2$, $y_2'=y_1-2y_2$, $y_1(0)=1$, $y_2(0)=0$
---
$(s+2)Y_1-Y_2=1$, $-Y_1+(s+2)Y_2=0$. 둘째 식에서 $Y_2=\frac{Y_1}{s+2}$, 첫째에 넣으면
$$Y_1=\frac{s+2}{(s+1)(s+3)}=\frac12\Big(\frac1{s+1}+\frac1{s+3}\Big),\qquad Y_2=\frac12\Big(\frac1{s+1}-\frac1{s+3}\Big)$$
$$y_1=\tfrac12(e^{-t}+e^{-3t}),\qquad y_2=\tfrac12(e^{-t}-e^{-3t})$$
고유값 $-1,-3$과 고유벡터 $(1,1)^T$, $(1,-1)^T$가 그대로 보입니다[[ch03:4.3|고유값 방법.]].
:::
` },
      { k: '6.8', label: '6.8–6.9', p: '248', title: '일반 공식과 변환표', body: R`
교재 6.8절의 일반 공식을 한 표로 모았습니다. 시험에서는 이 표와 6.1절의 기본 변환표만 있으면 거의 모든 문제가 풀립니다.

| 성질 | $f(t)$ | $F(s)$ |
|---|---|---|
| 정의 | $f(t)$ | $\int_0^\infty e^{-st}f\,dt$ |
| 선형성 | $af+bg$ | $aF+bG$ |
| $s$-이동 | $e^{at}f(t)$ | $F(s-a)$ |
| $t$-이동 | $f(t-a)u(t-a)$ | $e^{-as}F(s)$ |
| 미분 | $f'$ | $sF-f(0)$ |
| 2계 미분 | $f''$ | $s^2F-sf(0)-f'(0)$ |
| 적분 | $\int_0^tf\,d\tau$ | $F/s$ |
| 합성곱 | $f*g$ | $FG$ |
| $t$ 곱하기 | $tf$ | $-F'$ |
| $t$로 나누기 | $f/t$ | $\int_s^\infty F\,d\sigma$ |
| 델타 | $\delta(t-a)$ | $e^{-as}$ |
| 주기 $p$ | $f$ | $\frac{1}{1-e^{-ps}}\int_0^pe^{-st}f\,dt$ |

**자주 쓰는 역변환.**
- $\dfrac{1}{(s-a)^n}\leftrightarrow\dfrac{t^{n-1}}{(n-1)!}e^{at}$
- $\dfrac{1}{(s-a)(s-b)}\leftrightarrow\dfrac{e^{at}-e^{bt}}{a-b}$
- $\dfrac{1}{s(s^2+\omega^2)}\leftrightarrow\dfrac{1-\cos\omega t}{\omega^2}$ (적분 정리)
- $\dfrac{1}{(s^2+\omega^2)^2}\leftrightarrow\dfrac{\sin\omega t-\omega t\cos\omega t}{2\omega^3}$ (공진)

:::tip 시험 포인트
라플라스 문제는 거의 항상 부분분수에서 점수가 갈립니다. 분해한 뒤 $s=0$ 같은 값을 넣어 원래 식과 같은지 확인하는 30초가 가장 값진 검산입니다.
:::
` },
    ],
  });
})();
