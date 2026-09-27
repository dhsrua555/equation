/* Part C — 푸리에 해석 · 편미분방정식 (Kreyszig Ch.11–12) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push(
  // ───────────────────────── 10
  {
    n: 10, part: 'C', title: '푸리에 급수·적분·변환', en: 'Fourier Series, Integrals, Transforms', ref: 'Kreyszig Ch.11', plot: 'fourier',
    fig: R`사각파의 푸리에 부분합 ($N=1,\dots,29$)과 깁스 현상`,
    tagline: R`주기함수를 사인과 코사인으로 분해합니다. 편미분방정식을 푸는 열쇠이기도 합니다.`,
    summary: R`주기 $2L$ 함수의 푸리에 급수, 우함수·기함수와 반구간 전개, 복소 형식과 파세발 항등식, 비주기 함수를 위한 푸리에 적분과 푸리에 변환을 다룹니다.`,
    goals: [
      R`오일러 공식으로 푸리에 계수를 계산할 수 있다`,
      R`우함수·기함수를 이용해 계산을 절반으로 줄일 수 있다`,
      R`불연속점에서의 수렴값과 급수의 합을 구할 수 있다`,
      R`푸리에 적분과 변환의 정의와 주요 성질을 쓸 수 있다`,
    ],
    sections: [
      { title: '푸리에 급수', body: R`
주기 $2L$인 함수를 삼각함수계 $1,\cos\frac{n\pi x}{L},\sin\frac{n\pi x}{L}$로 전개합니다. 이 함수들은 한 주기에서 서로 직교하므로 계수를 적분 한 번으로 구할 수 있습니다.

:::key 푸리에 계수 (주기 2L)
$$f(x)=a_0+\sum_{n=1}^{\infty}\Big(a_n\cos\frac{n\pi x}{L}+b_n\sin\frac{n\pi x}{L}\Big)$$
$$a_0=\frac1{2L}\int_{-L}^{L}f\,dx,\qquad a_n=\frac1L\int_{-L}^{L}f\cos\frac{n\pi x}{L}\,dx,\qquad b_n=\frac1L\int_{-L}^{L}f\sin\frac{n\pi x}{L}\,dx$$
:::

**수렴 정리**: $f$가 구간별 연속이고 각 점에서 좌우 미분계수가 있으면, 급수는 연속점에서 $f(x)$로, 불연속점에서 좌우 극한의 평균 $\tfrac12\big[f(x^-)+f(x^+)\big]$로 수렴합니다.

:::ex 예제 1 (사각파)
$f(x)=-k\ (-\pi<x<0)$, $f(x)=k\ (0<x<\pi)$의 푸리에 급수는?
---
기함수이므로 $a_n=0$. $b_n=\dfrac2\pi\int_0^\pi k\sin nx\,dx=\dfrac{2k}{n\pi}(1-\cos n\pi)$, 홀수 $n$에서만 $\dfrac{4k}{n\pi}$.
$$f(x)=\frac{4k}{\pi}\Big(\sin x+\frac{\sin3x}{3}+\frac{\sin5x}{5}+\cdots\Big)$$
$x=\pi/2$를 넣으면 $\dfrac\pi4=1-\dfrac13+\dfrac15-\cdots$ (라이프니츠 급수).
:::

:::warn a₀의 정의
Kreyszig 표기에서 $a_0$는 $f$의 평균값 $\frac1{2L}\int f$입니다. $\frac{a_0}{2}$로 쓰는 교재도 있으니 계수 공식과 급수의 첫 항을 한 세트로 기억하세요.
:::
` },
      { title: '우함수·기함수와 반구간 전개', body: R`
:::key 우함수·기함수 급수
$$f\ \text{우함수}:\ f=a_0+\sum a_n\cos\frac{n\pi x}{L},\qquad a_0=\frac1L\int_0^Lf\,dx,\quad a_n=\frac2L\int_0^Lf\cos\frac{n\pi x}{L}\,dx$$
$$f\ \text{기함수}:\ f=\sum b_n\sin\frac{n\pi x}{L},\qquad b_n=\frac2L\int_0^Lf\sin\frac{n\pi x}{L}\,dx$$
:::

$(0,L)$에서만 정의된 함수는 두 가지로 주기 확장할 수 있습니다.

- **우함수 확장** → 코사인 반구간 전개
- **기함수 확장** → 사인 반구간 전개 (양 끝이 고정된 현이나 양 끝 온도가 0인 막대에 쓰임)

:::ex 예제 2
$f(x)=x^2\ (-\pi<x<\pi)$의 푸리에 급수를 구하고 $\sum1/n^2$을 계산하세요.
---
우함수이므로 $a_0=\dfrac1\pi\int_0^\pi x^2dx=\dfrac{\pi^2}3$, $a_n=\dfrac2\pi\int_0^\pi x^2\cos nx\,dx=\dfrac{4(-1)^n}{n^2}$.
$$x^2=\frac{\pi^2}{3}+4\sum_{n=1}^\infty\frac{(-1)^n}{n^2}\cos nx$$
$x=\pi$에서 $\pi^2=\dfrac{\pi^2}3+4\sum\dfrac1{n^2}$이므로 $\displaystyle\sum_{n=1}^\infty\frac1{n^2}=\frac{\pi^2}{6}$.
:::
` },
      { title: '복소 푸리에 급수와 파세발 항등식', body: R`
:::key 복소 형식과 파세발 항등식
$$f(x)=\sum_{n=-\infty}^{\infty}c_ne^{in\pi x/L},\qquad c_n=\frac1{2L}\int_{-L}^{L}f(x)e^{-in\pi x/L}dx$$
$$2a_0^2+\sum_{n=1}^\infty\big(a_n^2+b_n^2\big)=\frac1L\int_{-L}^{L}f(x)^2\,dx$$
:::

실수 계수와는 $c_0=a_0$, $c_n=\tfrac12(a_n-ib_n)$, $c_{-n}=\overline{c_n}$ 관계가 있습니다. 파세발 항등식은 계수의 제곱합으로 급수의 합을 계산할 때 씁니다.

:::ex 예제 3
$f(x)=x\ (-\pi<x<\pi)$의 계수는 $b_n=\dfrac{2(-1)^{n+1}}{n}$입니다. 파세발 항등식에서 무엇을 얻는가?
---
$\sum b_n^2=\sum\dfrac4{n^2}$, 우변은 $\dfrac1\pi\int_{-\pi}^{\pi}x^2dx=\dfrac{2\pi^2}{3}$. 따라서 $\sum\dfrac1{n^2}=\dfrac{\pi^2}6$ (예제 2와 같은 결과).
:::
` },
      { title: '강제진동과 푸리에 급수', body: R`
주기적인 외력 $r(t)$를 받는 진동계 $y''+cy'+ky=r(t)$는 외력을 푸리에 급수로 나눈 뒤 각 성분의 응답을 더해 풉니다(중첩 원리).

감쇠가 없는 $y''+\omega_0^2y=\sum b_n\sin nt$라면 정상상태 응답은
$$y_p=\sum_{n}\frac{b_n}{\omega_0^2-n^2}\sin nt$$
입니다. $n$이 $\omega_0$에 가까운 성분은 분모가 작아 크게 증폭됩니다. 외력의 기본진동수가 고유진동수와 달라도 고조파 하나가 공진을 일으킬 수 있다는 점이 핵심입니다.
` },
      { title: '푸리에 적분', body: R`
주기가 없는 함수는 $L\to\infty$로 보내 급수 대신 적분으로 표현합니다.

:::key 푸리에 적분
$$f(x)=\int_0^\infty\big[A(w)\cos wx+B(w)\sin wx\big]dw$$
$$A(w)=\frac1\pi\int_{-\infty}^{\infty}f(v)\cos wv\,dv,\qquad B(w)=\frac1\pi\int_{-\infty}^{\infty}f(v)\sin wv\,dv$$
:::

수렴값은 급수와 마찬가지로 불연속점에서 좌우 극한의 평균입니다.

:::ex 예제 4 (사각 펄스)
$f(x)=1\ (|x|<1)$, $0\ (|x|>1)$의 푸리에 적분은?
---
우함수이므로 $B=0$, $A(w)=\dfrac2\pi\int_0^1\cos wv\,dv=\dfrac{2\sin w}{\pi w}$.
$$f(x)=\frac2\pi\int_0^\infty\frac{\cos wx\,\sin w}{w}dw$$
$x=0$을 넣으면 디리클레 적분 $\displaystyle\int_0^\infty\frac{\sin w}{w}dw=\frac\pi2$를 얻습니다.
:::
` },
      { title: '푸리에 변환', body: R`
:::key 푸리에 변환 (Kreyszig 규약)
$$\hat f(w)=\frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}f(x)e^{-iwx}dx,\qquad f(x)=\frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}\hat f(w)e^{iwx}dw$$
$$\mathcal F\{f'\}=iw\,\mathcal F\{f\},\qquad \mathcal F\{f*g\}=\sqrt{2\pi}\,\mathcal F\{f\}\,\mathcal F\{g\},\qquad \mathcal F\{f(x-a)\}=e^{-iwa}\hat f(w)$$
$$\mathcal F\{e^{-ax^2}\}=\frac{1}{\sqrt{2a}}\,e^{-w^2/(4a)}\qquad(a>0)$$
:::

미분이 $iw$ 곱셈으로 바뀌므로, 무한 영역의 미분방정식은 변환하면 대수방정식이나 상미분방정식이 됩니다. 우함수에는 푸리에 코사인 변환, 기함수에는 사인 변환을 쓰면 계산이 간단해집니다.

:::tip 시험 포인트
교재마다 $\sqrt{2\pi}$의 위치와 지수의 부호가 다릅니다. 시험에서는 강의에서 쓴 규약을 따르고, 답에 상수 인자가 붙는지 반드시 확인하세요.
:::
` },
    ],
    problems: [
      { type: 'mc', lv: 1, q: R`$f(x)=x^2\ (-\pi<x<\pi)$를 주기 $2\pi$로 확장한 푸리에 급수의 모양은?`,
        choices: [R`사인항만 있다`, R`상수항과 코사인항만 있다`, R`코사인항만 있고 상수항은 0이다`, R`사인항과 코사인항이 모두 있다`], ans: 1,
        sol: R`우함수이므로 $b_n=0$입니다. 평균값 $a_0=\pi^2/3\ne0$이므로 상수항도 있습니다.` },
      { type: 'num', lv: 2, q: R`$f(x)=x\ (-\pi<x<\pi)$의 푸리에 계수 $b_3$은?`, ans: '2/3', ansTex: R`\tfrac23`,
        sol: R`$b_n=\dfrac2\pi\int_0^\pi x\sin nx\,dx=\dfrac2\pi\Big(-\dfrac{\pi\cos n\pi}{n}\Big)=\dfrac{2(-1)^{n+1}}{n}$. $n=3$이면 $\tfrac23$.` },
      { type: 'num', lv: 2, q: R`$f(x)=|x|\ (-\pi<x<\pi)$의 푸리에 계수 $a_0$는? (Kreyszig 표기)`, ans: 'pi/2', ansTex: R`\tfrac\pi2`,
        sol: R`$a_0=\dfrac1{2\pi}\int_{-\pi}^{\pi}|x|\,dx=\dfrac1{2\pi}\cdot\pi^2=\dfrac\pi2$. 평균값입니다.` },
      { type: 'mc', lv: 2, q: R`$x^2=\dfrac{\pi^2}{3}+4\displaystyle\sum_{n=1}^\infty\frac{(-1)^n}{n^2}\cos nx$에 $x=0$을 대입하면 $\displaystyle\sum_{n=1}^\infty\frac{(-1)^{n+1}}{n^2}$은?`,
        choices: [R`$\pi^2/6$`, R`$\pi^2/8$`, R`$\pi^2/12$`, R`$\pi/4$`], ans: 2,
        sol: R`$0=\dfrac{\pi^2}3+4\sum\dfrac{(-1)^n}{n^2}$이므로 $\sum\dfrac{(-1)^n}{n^2}=-\dfrac{\pi^2}{12}$, 부호를 바꾸면 $\dfrac{\pi^2}{12}$.` },
      { type: 'num', lv: 2, q: R`주기 2인 함수 $f(x)=0\ (-1<x<0)$, $f(x)=3\ (0<x<1)$의 푸리에 급수는 $x=0$에서 어떤 값으로 수렴하는가?`, ans: '3/2', ansTex: R`\tfrac32`,
        sol: R`불연속점에서는 좌우 극한의 평균 $\tfrac12(0+3)=\tfrac32$로 수렴합니다.` },
      { type: 'open', lv: 2, q: R`$f(x)=1\ (0<x<\pi)$의 사인 반구간 전개를 구하세요.`,
        sol: R`
기함수 확장(사각파)의 계수: $b_n=\dfrac2\pi\int_0^\pi\sin nx\,dx=\dfrac{2}{n\pi}(1-\cos n\pi)$. 홀수 $n$에서 $\dfrac{4}{n\pi}$, 짝수 $n$에서 0.
$$1=\frac4\pi\Big(\sin x+\frac{\sin3x}3+\frac{\sin5x}5+\cdots\Big)\qquad(0<x<\pi)$$` },
      { type: 'mc', lv: 3, q: R`$f(x)=\pm1$ 사각파($-\pi<x<0$에서 $-1$, $0<x<\pi$에서 $1$)의 계수 $b_n=\dfrac{4}{n\pi}\ (n\text{ 홀수})$에 파세발 항등식을 적용하면 $\displaystyle\sum_{m=1}^\infty\frac{1}{(2m-1)^2}$은?`,
        choices: [R`$\pi^2/6$`, R`$\pi^2/8$`, R`$\pi^2/12$`, R`$\pi^2/16$`], ans: 1,
        sol: R`$\sum b_n^2=\dfrac{16}{\pi^2}\sum\dfrac1{(2m-1)^2}$이고 우변은 $\dfrac1\pi\int_{-\pi}^{\pi}1\,dx=2$. 따라서 $\sum\dfrac1{(2m-1)^2}=\dfrac{\pi^2}{8}$.` },
      { type: 'num', lv: 3, q: R`$\displaystyle\int_0^\infty\frac{\sin w\cos wx}{w}\,dw$의 $x=1$에서의 값은?`, ans: 'pi/4', ansTex: R`\tfrac\pi4`,
        hint: R`사각 펄스의 푸리에 적분 표현을 떠올리세요.`,
        sol: R`
사각 펄스 $f=1\ (|x|<1)$의 푸리에 적분 $f(x)=\dfrac2\pi\int_0^\infty\dfrac{\cos wx\sin w}{w}dw$에서, 적분값은 $|x|<1$일 때 $\tfrac\pi2$, $|x|>1$일 때 0입니다. $x=1$은 불연속점이므로 평균 $\tfrac12\cdot\tfrac\pi2=\tfrac\pi4$.` },
      { type: 'mc', lv: 2, q: R`$\hat f=\mathcal F\{f\}$일 때 $\mathcal F\{f'\}$는? ($f\to0$ as $|x|\to\infty$)`,
        choices: [R`$iw\,\hat f(w)$`, R`$-iw\,\hat f(w)$`, R`$\hat f'(w)$`, R`$\hat f(w)/(iw)$`], ans: 0,
        sol: R`부분적분하면 경계항이 사라지고 $\dfrac1{\sqrt{2\pi}}\int f'e^{-iwx}dx=iw\cdot\dfrac1{\sqrt{2\pi}}\int fe^{-iwx}dx$.` },
      { type: 'open', lv: 3, q: R`$f(x)=e^{-|x|}$의 푸리에 변환을 구하세요 (Kreyszig 규약).`,
        sol: R`
$$\int_0^\infty e^{-x}e^{-iwx}dx=\frac{1}{1+iw},\qquad \int_{-\infty}^0e^{x}e^{-iwx}dx=\frac1{1-iw}$$
합은 $\dfrac{2}{1+w^2}$이므로
$$\hat f(w)=\frac{1}{\sqrt{2\pi}}\cdot\frac{2}{1+w^2}=\sqrt{\frac2\pi}\,\frac{1}{1+w^2}$$` },
      { type: 'num', lv: 1, q: R`$\cos2x+\sin3x$의 기본주기는?`, ans: '2*pi', ansTex: R`2\pi`,
        sol: R`$\cos2x$의 주기 $\pi$, $\sin3x$의 주기 $\tfrac{2\pi}3$. 두 주기의 최소공배수는 $2\pi$.` },
    ],
  },
  // ───────────────────────── 11
  {
    n: 11, part: 'C', title: '편미분방정식', en: 'Partial Differential Equations', ref: 'Kreyszig Ch.12', plot: 'modes',
    fig: R`열방정식: 가운데가 뜨거운 막대의 온도가 퍼지는 모습`,
    tagline: R`변수분리 → 고유함수 → 푸리에 계수. 파동·열·라플라스 방정식이 모두 같은 틀로 풀립니다.`,
    summary: R`2계 선형 PDE의 분류, 파동방정식(변수분리와 달랑베르 해), 열방정식(고정 온도·단열 경계), 라플라스 방정식의 디리클레 문제를 다룹니다. 앞 단원의 푸리에 급수가 그대로 쓰입니다.`,
    goals: [
      R`$AC-B^2$으로 PDE를 타원형·포물형·쌍곡형으로 분류할 수 있다`,
      R`변수분리로 고유함수와 고유값을 구할 수 있다`,
      R`초기조건에서 푸리에 계수를 구해 해를 완성할 수 있다`,
      R`달랑베르 해와 정상상태 해를 쓸 수 있다`,
    ],
    sections: [
      { title: '기본 개념과 분류', body: R`
대표적인 2계 선형 PDE는 파동방정식 $u_{tt}=c^2u_{xx}$, 열방정식 $u_t=c^2u_{xx}$, 라플라스 방정식 $\nabla^2u=0$입니다. 선형 동차 PDE에서는 해의 일차결합도 해입니다(중첩 원리).

:::key 2계 선형 PDE의 분류
$$Au_{xx}+2Bu_{xy}+Cu_{yy}=F(x,y,u,u_x,u_y)$$
| $AC-B^2$ | 종류 | 대표 예 |
|---|---|---|
| $>0$ | 타원형 | 라플라스 $u_{xx}+u_{yy}=0$ |
| $=0$ | 포물형 | 열 $u_t=c^2u_{xx}$ |
| $<0$ | 쌍곡형 | 파동 $u_{tt}=c^2u_{xx}$ |
:::

:::warn 2B
$u_{xy}$의 계수가 $2B$입니다. $u_{xx}+3u_{xy}+u_{yy}$라면 $B=\tfrac32$이고 $AC-B^2=1-\tfrac94<0$, 쌍곡형입니다.
:::
` },
      { title: '파동방정식과 변수분리', body: R`
양 끝이 고정된 길이 $L$의 현: $u_{tt}=c^2u_{xx}$ ($c^2=T/\rho$), $u(0,t)=u(L,t)=0$, $u(x,0)=f(x)$, $u_t(x,0)=g(x)$.

1. $u=F(x)G(t)$를 대입하면 $\dfrac{F''}{F}=\dfrac{G''}{c^2G}=-p^2$ (상수).
2. 경계조건에서 $F_n=\sin\dfrac{n\pi x}{L}$, $p=\dfrac{n\pi}{L}$.
3. $G_n=B_n\cos\lambda_nt+B_n^*\sin\lambda_nt$, $\lambda_n=\dfrac{cn\pi}{L}$.
4. 중첩하고 초기조건으로 계수를 정한다.

:::key 진동하는 현
$$u(x,t)=\sum_{n=1}^\infty\big(B_n\cos\lambda_nt+B_n^*\sin\lambda_nt\big)\sin\frac{n\pi x}{L},\qquad \lambda_n=\frac{cn\pi}{L}$$
$$B_n=\frac2L\int_0^Lf(x)\sin\frac{n\pi x}{L}dx,\qquad B_n^*=\frac{2}{cn\pi}\int_0^Lg(x)\sin\frac{n\pi x}{L}dx$$
:::

$n$번째 정규모드의 진동수는 $\dfrac{\lambda_n}{2\pi}=\dfrac{cn}{2L}$입니다. 기본진동수 $\dfrac{1}{2L}\sqrt{T/\rho}$는 장력의 제곱근에 비례합니다.

:::ex 예제 1
길이 $L$인 현의 가운데를 높이 $k$만큼 당겼다 놓았다(초기속도 0). $B_n$은?
---
$f$는 삼각형 모양입니다. 대칭성을 이용해 적분하면
$$B_n=\frac{8k}{n^2\pi^2}\sin\frac{n\pi}{2}$$
짝수 모드는 나타나지 않습니다. 가운데를 튕기면 가운데가 마디인 모드가 빠지기 때문입니다.
:::
` },
      { title: '달랑베르 해', body: R`
$v=x+ct$, $z=x-ct$로 바꾸면 파동방정식은 $u_{vz}=0$이 되어 $u=\phi(x+ct)+\psi(x-ct)$, 즉 왼쪽과 오른쪽으로 움직이는 두 파동의 합입니다.

:::key 달랑베르 해 (무한한 현)
$$u(x,t)=\frac12\big[f(x+ct)+f(x-ct)\big]+\frac1{2c}\int_{x-ct}^{x+ct}g(s)\,ds$$
:::

직선 $x\pm ct=$상수를 **특성선**이라고 합니다. 초기 변위는 반씩 나뉘어 속력 $c$로 양쪽으로 퍼집니다.
` },
      { title: '열방정식', body: R`
막대의 온도 $u(x,t)$는 $u_t=c^2u_{xx}$ ($c^2=K/\sigma\rho$)를 따릅니다. 변수분리에서 시간 인자는 진동 대신 지수적으로 감소합니다.

:::key 막대의 열전도 (양 끝 0°)
$$u(x,t)=\sum_{n=1}^\infty B_n\sin\frac{n\pi x}{L}\,e^{-\lambda_n^2t},\qquad \lambda_n=\frac{cn\pi}{L},\qquad B_n=\frac2L\int_0^Lf(x)\sin\frac{n\pi x}{L}dx$$
:::

- **단열된 끝** ($u_x=0$): 코사인 급수 $u=A_0+\sum A_n\cos\frac{n\pi x}{L}e^{-\lambda_n^2t}$. 시간이 지나면 초기 온도의 평균 $A_0$로 수렴합니다.
- **끝 온도가 0이 아닌 경우** $u(0,t)=T_1$, $u(L,t)=T_2$: 정상상태 $U(x)=T_1+(T_2-T_1)\dfrac{x}{L}$를 빼면 양 끝이 0인 문제가 됩니다.

:::tip 시험 포인트
시간 인자 $e^{-\lambda_n^2t}$는 $n^2$에 비례해 빨리 사라집니다. 오래 지난 뒤의 모양을 물으면 첫 항이나 정상상태만 남깁니다.
:::
` },
      { title: '라플라스 방정식', body: R`
라플라스 방정식은 정상상태 온도, 정전기 퍼텐셜, 비압축성 퍼텐셜 흐름을 기술합니다. 경계값이 주어진 문제를 디리클레 문제라고 합니다.

:::key 직사각형의 디리클레 문제
$0<x<a,\ 0<y<b$에서 윗변 $u(x,b)=f(x)$, 나머지 변은 0일 때
$$u(x,y)=\sum_{n=1}^\infty A_n^*\sin\frac{n\pi x}{a}\sinh\frac{n\pi y}{a},\qquad A_n^*=\frac{2}{a\sinh(n\pi b/a)}\int_0^af(x)\sin\frac{n\pi x}{a}dx$$
$$\text{극좌표: }\ \nabla^2u=u_{rr}+\frac1ru_r+\frac1{r^2}u_{\theta\theta}$$
:::

원형 막의 진동은 극좌표에서 베셀 방정식으로, 구 안의 퍼텐셜은 구면좌표에서 르장드르 방정식으로 이어집니다(4단원).

:::ex 예제 2
정사각형 $0<x<\pi,\ 0<y<\pi$에서 $u(x,\pi)=\sin x$, 나머지 경계는 0. $u$는?
---
$f=\sin x$가 이미 첫 고유함수이므로 $n=1$ 항만 남습니다.
$$u(x,y)=\frac{\sin x\,\sinh y}{\sinh\pi}$$
:::
` },
      { title: '무한 영역과 푸리에 적분', body: R`
무한히 긴 막대 $-\infty<x<\infty$에서는 고유값이 연속적으로 분포하므로 급수 대신 푸리에 적분을 씁니다. 결과는 초기 온도와 가우스 핵의 합성곱입니다.
$$u(x,t)=\frac{1}{2c\sqrt{\pi t}}\int_{-\infty}^{\infty}f(v)\,e^{-(x-v)^2/(4c^2t)}\,dv$$
뜨거운 점 하나에서 시작한 열은 시간이 지남에 따라 폭이 $\sqrt t$에 비례해 넓어지는 종 모양으로 퍼집니다.
` },
    ],
    problems: [
      { type: 'mc', lv: 1, q: R`$u_{xx}+4u_{xy}+4u_{yy}=0$의 종류는?`,
        choices: [R`타원형`, R`포물형`, R`쌍곡형`, R`분류할 수 없다`], ans: 1,
        sol: R`$A=1$, $2B=4$에서 $B=2$, $C=4$. $AC-B^2=4-4=0$이므로 포물형.` },
      { type: 'mc', lv: 1, q: R`양 끝이 고정된 현 $0<x<L$에서 변수분리로 얻는 공간 고유함수는?`,
        choices: [R`$\cos\dfrac{n\pi x}{L}$`, R`$\sin\dfrac{n\pi x}{L}$`, R`$e^{n\pi x/L}$`, R`$\sinh\dfrac{n\pi x}{L}$`], ans: 1,
        sol: R`$F''+p^2F=0$, $F(0)=F(L)=0$을 만족하는 자명하지 않은 해는 $\sin\dfrac{n\pi x}{L}$뿐입니다.` },
      { type: 'num', lv: 2, q: R`$u_{tt}=4u_{xx}$ ($0<x<\pi$, 양 끝 고정), $u(x,0)=\sin3x$, $u_t(x,0)=0$일 때 $u(\pi/6,\ \pi/6)$은?`, ans: '-1', ansTex: R`-1`,
        sol: R`$c=2$, $L=\pi$이므로 $\lambda_3=6$. $u=\sin3x\cos6t$. $u(\pi/6,\pi/6)=\sin\frac\pi2\cos\pi=-1$.` },
      { type: 'num', lv: 2, q: R`$u_t=u_{xx}$ ($0<x<\pi$, 양 끝 0°), $u(x,0)=5\sin2x$일 때 $u(\pi/4,\ \ln2)$는?`, ans: '5/16', ansTex: R`\tfrac{5}{16}`,
        sol: R`$u=5\sin2x\,e^{-4t}$. $u(\pi/4,\ln2)=5\cdot1\cdot e^{-4\ln2}=\tfrac{5}{16}$.` },
      { type: 'open', lv: 2, q: R`$u_t=u_{xx}$ ($0<x<\pi$), $u(0,t)=u(\pi,t)=0$, $u(x,0)=x$를 푸세요.`,
        sol: R`
$B_n=\dfrac2\pi\int_0^\pi x\sin nx\,dx=\dfrac{2(-1)^{n+1}}{n}$이고 $\lambda_n^2=n^2$.
$$u(x,t)=2\sum_{n=1}^\infty\frac{(-1)^{n+1}}{n}\sin nx\,e^{-n^2t}$$` },
      { type: 'num', lv: 2, q: R`무한한 현 $u_{tt}=4u_{xx}$, $u(x,0)=e^{-x^2}$, $u_t(x,0)=0$일 때 $u(1,\ \tfrac12)$은?`, ans: '(1+e^(-4))/2', ansTex: R`\tfrac12(1+e^{-4})\approx0.509`,
        sol: R`$c=2$, $ct=1$. 달랑베르 해 $u=\tfrac12[f(x+1)+f(x-1)]$에서 $u(1,\tfrac12)=\tfrac12\big(e^{-4}+e^{0}\big)$.` },
      { type: 'num', lv: 2, q: R`길이 10인 막대의 양 끝 온도를 $u(0)=20$, $u(10)=80$으로 유지할 때, 정상상태에서 가운데($x=5$)의 온도는?`, ans: '50', ansTex: R`50`,
        sol: R`정상상태는 $u_{xx}=0$이므로 일차함수 $U=20+6x$. $U(5)=50$.` },
      { type: 'mc', lv: 2, q: R`현의 장력을 4배로 하면 기본진동수는? (길이·선밀도는 그대로)`,
        choices: [R`변하지 않는다`, R`$\sqrt2$배가 된다`, R`2배가 된다`, R`4배가 된다`], ans: 2,
        sol: R`기본진동수 $\dfrac{c}{2L}=\dfrac1{2L}\sqrt{T/\rho}$는 $\sqrt T$에 비례하므로 2배입니다.` },
      { type: 'open', lv: 3, q: R`정사각형 $0<x<\pi,\ 0<y<\pi$에서 $\nabla^2u=0$, $u(x,\pi)=\sin2x$, 나머지 세 변에서 $u=0$일 때 $u$를 구하세요.`,
        sol: R`
$u=X(x)Y(y)$에서 $X=\sin nx$, $Y=\sinh ny$ (아랫변 $y=0$에서 0). 윗변 조건이 $\sin2x$ 하나이므로 $n=2$만 남습니다.
$$u(x,y)=\frac{\sin2x\,\sinh2y}{\sinh2\pi}$$` },
      { type: 'num', lv: 3, q: R`양 끝이 단열된 막대 $u_t=u_{xx}$ ($0<x<\pi$, $u_x=0$ at ends), $u(x,0)=x$일 때 $\displaystyle\lim_{t\to\infty}u(x,t)$는?`, ans: 'pi/2', ansTex: R`\tfrac\pi2`,
        sol: R`코사인 급수 해에서 $n\ge1$ 항은 모두 사라지고 $A_0=\dfrac1\pi\int_0^\pi x\,dx=\dfrac\pi2$만 남습니다. 열이 빠져나가지 않으므로 평균 온도로 고르게 됩니다.` },
    ],
  }
  );
})();
