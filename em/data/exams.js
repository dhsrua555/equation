/* 실전 모의고사 — 연습문제와 겹치지 않는 별도 문항 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x1', roman: 'I', kind: '중간고사형 · 공학수학 1', title: '상미분방정식과 라플라스 변환', scopeText: '01–05 단원',
    desc: '1계 ODE부터 라플라스 변환까지. 풀이법을 판별하는 속도와 계산 정확도를 함께 봅니다.',
    minutes: 90, plot: 'damped',
    problems: [
      { ch: 'ch01', type: 'mc', lv: 1, pts: 8, q: R`$(x^2+y^2)\,dx+2xy\,dy=0$의 일반해는?`,
        choices: [R`$x^3+xy^2=c$`, R`$\tfrac{x^3}{3}+xy^2=c$`, R`$x^2y+\tfrac{y^3}{3}=c$`, R`$\tfrac{x^3}{3}-xy^2=c$`], ans: 1,
        sol: R`$M_y=2y=N_x$이므로 완전. $u=\int(x^2+y^2)dx=\tfrac{x^3}3+xy^2+k(y)$, $u_y=2xy+k'=2xy$에서 $k$는 상수. 해: $\tfrac{x^3}{3}+xy^2=c$.` },
      { ch: 'ch01', type: 'num', lv: 2, pts: 8, q: R`$y'-\dfrac{y}{x}=x^2\ (x>0),\ y(1)=1$일 때 $y(2)$는?`, ans: '5', ansTex: R`5`,
        sol: R`$h=-\ln x$, $e^{h}=1/x$. $y=x\big(\int x\,dx+c\big)=\tfrac{x^3}{2}+cx$. $y(1)=\tfrac12+c=1$에서 $c=\tfrac12$. $y(2)=4+1=5$.` },
      { ch: 'ch01', type: 'num', lv: 2, pts: 8, q: R`$y'=2y-y^2,\ y(0)=1$의 해에 대해 $\displaystyle\lim_{t\to\infty}y(t)$는?`, ans: '2', ansTex: R`2`,
        sol: R`로지스틱 방정식($A=2$, $B=1$). $u=1/y$로 풀면 $y=\dfrac{2}{1+e^{-2t}}$이므로 극한은 $A/B=2$.` },
      { ch: 'ch02', type: 'num', lv: 2, pts: 10, q: R`$y''+6y'+9y=0,\ y(0)=1,\ y'(0)=-1$일 때 $y(1)$은?`, ans: '3*e^(-3)', ansTex: R`3e^{-3}\approx0.149`,
        sol: R`중근 $\lambda=-3$. $y=(1+c_2x)e^{-3x}$, $y'(0)=c_2-3=-1$에서 $c_2=2$. $y=(1+2x)e^{-3x}$, $y(1)=3e^{-3}$.` },
      { ch: 'ch02', type: 'open', lv: 2, pts: 12, q: R`$y''-3y'+2y=2x+e^{3x}$의 일반해를 구하세요.`,
        rubric: R`
- 동차해 $c_1e^{x}+c_2e^{2x}$ — 3점
- 다항식 부분 특수해 $x+\tfrac32$ — 4점
- 지수 부분 특수해 $\tfrac12e^{3x}$ — 3점
- 일반해를 합쳐 정리 — 2점`,
        sol: R`
특성근 $1,2$이므로 $y_h=c_1e^{x}+c_2e^{2x}$.
$2x$에 대해 $y_p=Ax+B$: $-3A+2Ax+2B=2x$에서 $A=1$, $B=\tfrac32$.
$e^{3x}$에 대해 $y_p=Ce^{3x}$: $(9-9+2)C=1$에서 $C=\tfrac12$.
$$y=c_1e^{x}+c_2e^{2x}+x+\tfrac32+\tfrac12e^{3x}$$` },
      { ch: 'ch02', type: 'mc', lv: 2, pts: 8, q: R`$x^2y''+xy'+4y=0\ (x>0)$의 일반해는?`,
        choices: [R`$c_1x^2+c_2x^{-2}$`, R`$c_1\cos(2\ln x)+c_2\sin(2\ln x)$`, R`$c_1\cos2x+c_2\sin2x$`, R`$x\big(c_1\cos(2\ln x)+c_2\sin(2\ln x)\big)$`], ans: 1,
        sol: R`보조방정식 $m^2+(1-1)m+4=m^2+4=0$에서 $m=\pm2i$ ($\mu=0$, $\nu=2$).` },
      { ch: 'ch03', type: 'mc', lv: 2, pts: 8, q: R`$\mathbf y'=\begin{pmatrix}1&-5\\1&-3\end{pmatrix}\mathbf y$의 임계점 (0,0)은?`,
        choices: [R`안장점`, R`불안정한 나선점`, R`안정하고 끌어당기는 나선점`, R`중심`], ans: 2,
        sol: R`$p=-2$, $q=-3+5=2$, $\Delta=4-8<0$. $p<0$, $q>0$이고 복소 고유값($-1\pm i$)이므로 안정하고 끌어당기는 나선점.` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 10, q: R`$y'+y=u(t-1),\ y(0)=0$일 때 $y(2)$는?`, ans: '1-e^(-1)', ansTex: R`1-e^{-1}\approx0.632`,
        sol: R`$(s+1)Y=\dfrac{e^{-s}}{s}$, $Y=e^{-s}\Big(\dfrac1s-\dfrac1{s+1}\Big)$. $y=u(t-1)\big(1-e^{-(t-1)}\big)$, $y(2)=1-e^{-1}$.` },
      { ch: 'ch05', type: 'open', lv: 3, pts: 14, q: R`라플라스 변환으로 $y''+2y'+2y=\delta(t-\pi),\ y(0)=1,\ y'(0)=-1$을 푸세요.`,
        rubric: R`
- 도함수의 변환과 보조방정식 $(s^2+2s+2)Y=s+1+e^{-\pi s}$ — 4점
- 완전제곱과 $s$-이동으로 $e^{-t}\cos t$ — 4점
- $t$-이동으로 델타 항 처리 — 4점
- 최종 해를 구간별로 정리 — 2점`,
        sol: R`
$(s^2Y-s+1)+2(sY-1)+2Y=e^{-\pi s}$에서 $(s^2+2s+2)Y=s+1+e^{-\pi s}$.
$$Y=\frac{s+1}{(s+1)^2+1}+\frac{e^{-\pi s}}{(s+1)^2+1}$$
$$y=e^{-t}\cos t+u(t-\pi)\,e^{-(t-\pi)}\sin(t-\pi)=e^{-t}\cos t-u(t-\pi)\,e^{-(t-\pi)}\sin t$$` },
      { ch: 'ch04', type: 'num', lv: 3, pts: 14, q: R`$y''+xy'+y=0,\ y(0)=1,\ y'(0)=0$의 거듭제곱급수 해에서 $x^4$의 계수는?`, ans: '1/8', ansTex: R`\tfrac18`,
        sol: R`
$x^m$의 계수: $(m+2)(m+1)a_{m+2}+(m+1)a_m=0$, 즉 $a_{m+2}=-\dfrac{a_m}{m+2}$.
$a_0=1$에서 $a_2=-\tfrac12$, $a_4=\tfrac18$. (실제 해는 $e^{-x^2/2}$)` },
    ],
  },
  {
    id: 'x2', roman: 'II', kind: '기말고사형 · 공학수학 1·2', title: '선형대수와 벡터 해석', scopeText: '06–09 단원',
    desc: '행렬·고유값 계산과 벡터 미적분, 적분 정리를 함께 다룹니다.',
    minutes: 90, plot: 'grid',
    problems: [
      { ch: 'ch06', type: 'mc', lv: 1, pts: 8, q: R`$\operatorname{rank}\begin{pmatrix}1&2&1\\2&5&3\\1&3&2\end{pmatrix}$은?`,
        choices: [R`$1$`, R`$2$`, R`$3$`, R`$0$`], ans: 1,
        sol: R`$R_2-2R_1=(0,1,1)$, $R_3-R_1=(0,1,1)$. 두 행이 같으므로 사다리꼴에서 0이 아닌 행은 2개.` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 8, q: R`$\det\begin{pmatrix}1&2&0&0\\3&4&0&0\\0&0&2&1\\0&0&1&2\end{pmatrix}$은?`, ans: '-6', ansTex: R`-6`,
        sol: R`블록 대각이므로 $(4-6)(4-1)=-6$.` },
      { ch: 'ch06', type: 'mc', lv: 2, pts: 8, q: R`$\begin{pmatrix}1&k\\k&4\end{pmatrix}\mathbf x=\mathbf 0$이 자명하지 않은 해를 갖는 $k$는?`,
        choices: [R`$k=\pm1$`, R`$k=\pm2$`, R`$k=\pm4$`, R`$k=0$`], ans: 1,
        sol: R`$\det=4-k^2=0$일 때 계수가 2보다 작아져 자명하지 않은 해가 생깁니다. $k=\pm2$.` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 10, q: R`$A=\begin{pmatrix}2&2\\1&3\end{pmatrix}$일 때 $A^{-1}$의 두 고유값의 합은?`, ans: '5/4', ansTex: R`\tfrac54`,
        sol: R`$\lambda^2-5\lambda+4=0$에서 $A$의 고유값 $1,4$. $A^{-1}$의 고유값은 $1,\tfrac14$이므로 합은 $\tfrac54$.` },
      { ch: 'ch07', type: 'open', lv: 3, pts: 14, q: R`$A=\begin{pmatrix}4&-2\\1&1\end{pmatrix}$를 대각화하고 $A^n$을 구하세요.`,
        rubric: R`
- 고유값 $2,3$ — 4점
- 고유벡터 $(1,1)^T$, $(2,1)^T$ — 4점
- $X$, $D$, $X^{-1}$ 제시 — 3점
- $A^n=XD^nX^{-1}$ 계산 — 3점`,
        sol: R`
$\lambda^2-5\lambda+6=0$에서 $\lambda=2,3$. $\lambda=2$: $2x_1-2x_2=0$ → $(1,1)^T$. $\lambda=3$: $x_1-2x_2=0$ → $(2,1)^T$.
$$X=\begin{pmatrix}1&2\\1&1\end{pmatrix},\quad D=\begin{pmatrix}2&0\\0&3\end{pmatrix},\quad X^{-1}=\begin{pmatrix}-1&2\\1&-1\end{pmatrix}$$
$$A^n=XD^nX^{-1}=\begin{pmatrix}-2^n+2\cdot3^n&2^{n+1}-2\cdot3^n\\-2^n+3^n&2^{n+1}-3^n\end{pmatrix}$$
$n=1$을 넣으면 $A$가 나오는지 확인하세요.` },
      { ch: 'ch08', type: 'num', lv: 2, pts: 8, q: R`$f=e^x\cos y+z$의 점 $(0,0,1)$에서 $(3,4,0)$ 방향의 방향도함수는?`, ans: '3/5', ansTex: R`\tfrac35`,
        sol: R`$\nabla f=(e^x\cos y,\,-e^x\sin y,\,1)=(1,0,1)$. 단위벡터 $(\tfrac35,\tfrac45,0)$과 내적하면 $\tfrac35$.` },
      { ch: 'ch08', type: 'mc', lv: 1, pts: 8, q: R`$\mathbf F=(x^2,\ y^2,\ z^2)$에 대해 옳은 것은?`,
        choices: [R`$\operatorname{div}\mathbf F=0$, $\operatorname{curl}\mathbf F\ne\mathbf 0$`, R`$\operatorname{div}\mathbf F=2(x+y+z)$, $\operatorname{curl}\mathbf F=\mathbf 0$`, R`$\operatorname{div}\mathbf F=2(x+y+z)$, $\operatorname{curl}\mathbf F\ne\mathbf 0$`, R`$\operatorname{div}\mathbf F=x^2+y^2+z^2$, $\operatorname{curl}\mathbf F=\mathbf 0$`], ans: 1,
        sol: R`각 성분이 자기 변수만의 함수이므로 회전은 $\mathbf 0$ (퍼텐셜 $\tfrac13(x^3+y^3+z^3)$). 발산은 $2x+2y+2z$.` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 10, q: R`$\mathbf F=(3x^2,\ 2yz,\ y^2)$일 때 $(0,1,2)$에서 $(1,-1,7)$까지의 선적분 $\int_C\mathbf F\cdot d\mathbf r$은?`, ans: '6', ansTex: R`6`,
        sol: R`$\operatorname{curl}\mathbf F=\mathbf 0$이고 퍼텐셜 $f=x^3+y^2z$. $f(1,-1,7)-f(0,1,2)=8-2=6$.` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 12, q: R`$C$가 정사각형 $[0,2]\times[0,2]$의 경계(반시계)일 때 $\displaystyle\oint_C(-y^2\,dx+x^2\,dy)$는?`, ans: '16', ansTex: R`16`,
        sol: R`그린 정리: $\iint(2x+2y)\,dA$. $\int_0^2\!\!\int_0^2 2x\,dy\,dx=8$, $y$ 항도 8이므로 16.` },
      { ch: 'ch09', type: 'open', lv: 3, pts: 14, q: R`발산 정리로 $\mathbf F=(x^3,\ y^3,\ z^3)$이 구면 $x^2+y^2+z^2=a^2$을 바깥으로 통과하는 유량을 구하세요.`,
        rubric: R`
- $\operatorname{div}\mathbf F=3(x^2+y^2+z^2)$ — 4점
- 구면좌표로 적분 설정 $\int_0^a3r^2\cdot4\pi r^2dr$ — 5점
- 계산 결과 $\tfrac{12\pi a^5}{5}$ — 5점`,
        sol: R`
$\operatorname{div}\mathbf F=3x^2+3y^2+3z^2=3r^2$.
$$\iiint_T3r^2\,dV=\int_0^a3r^2\cdot4\pi r^2\,dr=12\pi\cdot\frac{a^5}{5}=\frac{12\pi a^5}{5}$$` },
    ],
  },
  {
    id: 'x3', roman: 'III', kind: '중간고사형 · 공학수학 2', title: '푸리에 해석과 편미분방정식', scopeText: '10–11 단원',
    desc: '푸리에 계수 계산과 변수분리 풀이. 서술형 배점이 큰 시험입니다.',
    minutes: 75, plot: 'fourier',
    problems: [
      { ch: 'ch10', type: 'mc', lv: 1, pts: 10, q: R`$f(x)=x\ (-\pi<x<\pi)$를 주기 $2\pi$로 확장한 푸리에 급수는?`,
        choices: [R`$2\displaystyle\sum_{n=1}^\infty\frac{(-1)^{n+1}}{n}\sin nx$`, R`$2\displaystyle\sum_{n=1}^\infty\frac{(-1)^{n}}{n}\sin nx$`, R`$\dfrac\pi2-\dfrac4\pi\displaystyle\sum_{m=1}^\infty\frac{\cos(2m-1)x}{(2m-1)^2}$`, R`$\dfrac4\pi\displaystyle\sum_{m=1}^\infty\frac{\sin(2m-1)x}{2m-1}$`], ans: 0,
        sol: R`기함수이므로 사인항만 있고 $b_n=\dfrac2\pi\int_0^\pi x\sin nx\,dx=\dfrac{2(-1)^{n+1}}{n}$. 첫 항이 $2\sin x$로 양수인지 확인하면 ①입니다.` },
      { ch: 'ch10', type: 'num', lv: 1, pts: 10, q: R`주기 2인 함수 $f(x)=x^2\ (-1<x<1)$의 푸리에 계수 $a_0$는? (Kreyszig 표기)`, ans: '1/3', ansTex: R`\tfrac13`,
        sol: R`$L=1$이므로 $a_0=\dfrac12\int_{-1}^1x^2dx=\dfrac12\cdot\dfrac23=\dfrac13$.` },
      { ch: 'ch10', type: 'mc', lv: 1, pts: 10, q: R`$(0,L)$에서 정의된 함수의 코사인 반구간 전개는 어떤 확장의 푸리에 급수인가?`,
        choices: [R`우함수 주기 확장`, R`기함수 주기 확장`, R`주기 $L$ 확장`, R`확장하지 않은 $(0,L)$의 급수`], ans: 0,
        sol: R`$(-L,0)$으로 우함수가 되게 확장하고 주기 $2L$로 반복하면 사인항이 사라져 코사인 급수가 됩니다.` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 12, q: R`$|x|=\dfrac\pi2-\dfrac4\pi\displaystyle\sum_{m=1}^\infty\frac{\cos(2m-1)x}{(2m-1)^2}\ (-\pi\le x\le\pi)$를 이용해 $\displaystyle\sum_{m=1}^\infty\frac{1}{(2m-1)^2}$을 구하세요.`, ans: 'pi^2/8', ansTex: R`\tfrac{\pi^2}{8}`,
        sol: R`$x=0$을 넣으면 $0=\dfrac\pi2-\dfrac4\pi\sum\dfrac{1}{(2m-1)^2}$이므로 $\sum\dfrac1{(2m-1)^2}=\dfrac{\pi^2}{8}$. ($|x|$는 연속이라 $x=0$에서 그대로 수렴)` },
      { ch: 'ch11', type: 'mc', lv: 1, pts: 10, q: R`$2u_{xx}+u_{xy}+u_{yy}=0$의 종류는?`,
        choices: [R`타원형`, R`포물형`, R`쌍곡형`, R`분류할 수 없다`], ans: 0,
        sol: R`$A=2$, $2B=1$에서 $B=\tfrac12$, $C=1$. $AC-B^2=2-\tfrac14>0$이므로 타원형.` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 14, q: R`$u_{tt}=u_{xx}$ ($0<x<1$, 양 끝 고정), $u(x,0)=0$, $u_t(x,0)=\sin\pi x$일 때 $u(\tfrac12,\ \tfrac12)$는?`, ans: '1/pi', ansTex: R`\tfrac1\pi\approx0.318`,
        sol: R`$B_n=0$, $\lambda_1=\pi$. $B_1^*=\dfrac{2}{\pi}\int_0^1\sin^2\pi x\,dx=\dfrac1\pi$, 나머지는 0. $u=\dfrac1\pi\sin\pi x\sin\pi t$이므로 $u(\tfrac12,\tfrac12)=\dfrac1\pi$.` },
      { ch: 'ch11', type: 'open', lv: 3, pts: 16, q: R`$u_t=u_{xx}$ ($0<x<\pi$), $u(0,t)=u(\pi,t)=0$, $u(x,0)=x(\pi-x)$를 푸세요.`,
        rubric: R`
- 변수분리로 고유함수 $\sin nx$와 시간 인자 $e^{-n^2t}$ — 4점
- $B_n=\dfrac2\pi\int_0^\pi x(\pi-x)\sin nx\,dx$ 계산 (부분적분) — 8점
- 짝수 항이 0임을 밝히고 최종 해 정리 — 4점`,
        sol: R`
$u=\sum B_n\sin nx\,e^{-n^2t}$. 부분적분하면
$$\int_0^\pi x(\pi-x)\sin nx\,dx=\frac{2\big(1-(-1)^n\big)}{n^3}$$
이므로 $B_n=\dfrac{8}{\pi n^3}$ ($n$ 홀수), 0 ($n$ 짝수).
$$u(x,t)=\frac8\pi\sum_{n\ \text{odd}}\frac{\sin nx}{n^3}e^{-n^2t}$$` },
      { ch: 'ch11', type: 'num', lv: 3, pts: 18, q: R`직사각형 $0<x<\pi,\ 0<y<1$에서 $\nabla^2u=0$, $u(x,1)=\sin x$, 나머지 세 변에서 $u=0$일 때 $u(\tfrac\pi2,\ \tfrac12)$는?`, ans: 'sinh(1/2)/sinh(1)', ansTex: R`\dfrac{\sinh\frac12}{\sinh1}\approx0.443`,
        sol: R`$a=\pi$이므로 해는 $\sum A_n^*\sin nx\sinh ny$. 윗변 조건이 $\sin x$ 하나이므로 $u=\dfrac{\sin x\sinh y}{\sinh1}$. $u(\tfrac\pi2,\tfrac12)=\dfrac{\sinh\frac12}{\sinh1}$.` },
    ],
  },
  {
    id: 'x4', roman: 'IV', kind: '기말고사형 · 공학수학 2', title: '복소해석', scopeText: '12–14 단원',
    desc: '해석함수, 코시 적분 공식, 유수 적분. 실적분 계산 두 문항이 핵심입니다.',
    minutes: 90, plot: 'conformal',
    problems: [
      { ch: 'ch12', type: 'mc', lv: 1, pts: 8, q: R`$\Arg\big(1-i\sqrt3\big)$은?`,
        choices: [R`$\pi/3$`, R`$-\pi/3$`, R`$5\pi/3$`, R`$-2\pi/3$`], ans: 1,
        sol: R`제4사분면, $\tan^{-1}(\sqrt3)=\pi/3$이므로 $-\pi/3$. ($5\pi/3$는 주편각 범위를 벗어남)` },
      { ch: 'ch12', type: 'num', lv: 1, pts: 8, q: R`$(1+i)^{10}$의 값은? (복소수로 입력)`, ans: '32i', ansTex: R`32i`,
        sol: R`$(1+i)^2=2i$이므로 $(1+i)^{10}=(2i)^5=32i^5=32i$.` },
      { ch: 'ch12', type: 'mc', lv: 2, pts: 8, q: R`다음 중 해석함수는?`,
        choices: [R`$x^2+y^2+2ixy$`, R`$x^2-y^2+2ixy$`, R`$x-iy$`, R`$e^{x}(\cos y-i\sin y)$`], ans: 1,
        sol: R`②는 $z^2$: $u_x=2x=v_y$, $u_y=-2y=-v_x$. ③은 $\bar z$, ④는 $e^{\bar z}$로 해석적이지 않습니다.` },
      { ch: 'ch12', type: 'num', lv: 2, pts: 10, q: R`$\Ln(-e)$의 값은? (복소수로 입력)`, ans: '1+pi*i', ansTex: R`1+\pi i`,
        sol: R`$|-e|=e$, $\Arg(-e)=\pi$이므로 $\Ln(-e)=\ln e+i\pi=1+\pi i$.` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 10, q: R`$\displaystyle\oint_{|z|=1}\frac{z^3+2z}{z-\tfrac12}\,dz$의 값은?`, ans: '9*pi*i/4', ansTex: R`\tfrac{9\pi i}{4}`,
        sol: R`$z_0=\tfrac12$는 원 안. $f(z)=z^3+2z$이므로 $2\pi i\,f(\tfrac12)=2\pi i\big(\tfrac18+1\big)=\tfrac{9\pi i}{4}$.` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 10, q: R`$\displaystyle\oint_{|z|=2}\frac{e^z}{(z-1)^2}\,dz$의 값은?`, ans: '2*pi*i*e', ansTex: R`2\pi ie`,
        sol: R`도함수 공식($n=1$): $2\pi i\,f'(1)=2\pi i\,e$.` },
      { ch: 'ch14', type: 'mc', lv: 2, pts: 8, q: R`$z\sin\dfrac1z$의 $z=0$은 어떤 특이점인가?`,
        choices: [R`제거가능 특이점`, R`1위 극`, R`2위 극`, R`진성 특이점`], ans: 3,
        sol: R`$z\sin\frac1z=1-\dfrac{1}{6z^2}+\dfrac{1}{120z^4}-\cdots$. 주요부가 끝없이 이어지므로 진성 특이점.` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 10, q: R`$\Res_{z=0}\dfrac{e^z-1}{z^4}$의 값은?`, ans: '1/6', ansTex: R`\tfrac16`,
        sol: R`$\dfrac{e^z-1}{z^4}=\dfrac1{z^3}+\dfrac{1}{2z^2}+\dfrac{1}{6z}+\cdots$에서 $b_1=\tfrac16$.` },
      { ch: 'ch14', type: 'open', lv: 3, pts: 14, q: R`유수 정리로 $\displaystyle\int_{-\infty}^{\infty}\frac{dx}{x^4+1}$을 구하세요.`,
        rubric: R`
- 위쪽 반평면의 극 $e^{i\pi/4}$, $e^{3i\pi/4}$ 찾기 — 4점
- 유수 $\dfrac{1}{4z_k^3}=-\dfrac{z_k}{4}$ 계산 — 6점
- $2\pi i\sum\Res$로 $\dfrac{\pi}{\sqrt2}$ — 4점`,
        sol: R`
$z^4=-1$의 근 중 위쪽 반평면에 있는 것은 $z_1=e^{i\pi/4}$, $z_2=e^{3i\pi/4}$.
단순극이므로 $\Res=\dfrac{1}{4z_k^3}=\dfrac{z_k}{4z_k^4}=-\dfrac{z_k}{4}$.
$$z_1+z_2=\frac{1+i}{\sqrt2}+\frac{-1+i}{\sqrt2}=i\sqrt2,\qquad \sum\Res=-\frac{i\sqrt2}{4}$$
$$\int_{-\infty}^\infty\frac{dx}{x^4+1}=2\pi i\cdot\Big(-\frac{i\sqrt2}{4}\Big)=\frac{\pi\sqrt2}{2}=\frac{\pi}{\sqrt2}$$` },
      { ch: 'ch14', type: 'num', lv: 3, pts: 14, q: R`$\displaystyle\int_{-\infty}^{\infty}\frac{\cos2x}{x^2+4}\,dx$의 값은?`, ans: 'pi*e^(-4)/2', ansTex: R`\tfrac\pi2e^{-4}\approx0.0288`,
        sol: R`$\dfrac{e^{2iz}}{z^2+4}$의 위쪽 극 $2i$에서 유수 $\dfrac{e^{-4}}{4i}$. $2\pi i\cdot\dfrac{e^{-4}}{4i}=\dfrac{\pi}{2}e^{-4}$.` },
    ],
  }
  );
})();
