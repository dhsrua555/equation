/* 13 경계층 — White 7.1–7.5 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 13, part: 'C', title: '경계층', en: 'Boundary Layers', ref: 'White 7.1–7.5', plot: 'flBL',
    fig: R`평판 위 경계층 두께. 층류 구간은 √x로, 천이 뒤 난류 구간은 더 빠르게 자란다`,
    tagline: R`레이놀즈 수가 크면 점성은 벽에 붙은 얇은 층에서만 일합니다. 그 층의 두께와 전단을 알면 마찰 항력이 나옵니다.`,
    summary: R`물체 주위의 외부 유동은 $Re$가 크면 두 영역으로 나뉩니다: 점성을 무시해도 되는 바깥 흐름과, 벽의 미끄러짐 없음 조건을 맞추느라 속도가 0에서 $U$까지 변하는 얇은 **경계층**. 경계층의 두께 $\delta$, 배제 두께 $\delta^*$, 운동량 두께 $\theta$로 층을 요약하고, 카르만의 **운동량 적분식** $\tau_w=\rho U^2\,d\theta/dx$(평판)로 근사 분포에서 두께와 전단을 구합니다. 프란틀의 **경계층 방정식**은 층 안에서 $\partial p/\partial y\approx0$ — 압력은 바깥 흐름이 정해 줍니다. 평판 층류의 정확해(블라시우스)는 $\delta/x=5.0/\sqrt{Re_x}$, $c_f=0.664/\sqrt{Re_x}$, $C_D=1.328/\sqrt{Re_L}$이고, $Re_x\approx5\times10^5$ 부근에서 천이한 난류는 $c_f\approx0.027/Re_x^{1/7}$입니다. 압력이 하류로 오르면(역압력 기울기) 벽 전단이 0이 되는 점에서 흐름이 **박리**되어 후류가 생깁니다.`,
    goals: [
      R`경계층의 개념과, 높은 레이놀즈 수에서 흐름을 두 영역으로 나누는 이유를 설명할 수 있다`,
      R`주어진 속도 분포에서 배제 두께와 운동량 두께를 계산할 수 있다`,
      R`운동량 적분식으로 근사 분포의 두께와 마찰 계수를 유도할 수 있다`,
      R`평판 층류·난류 경계층의 두께, 벽 전단, 마찰 항력을 계산할 수 있다`,
      R`압력 기울기가 경계층에 주는 영향과 박리의 조건을 설명할 수 있다`,
    ],
    secTitles: { '7.1': '외부 유동과 레이놀즈 수', '7.2': '운동량 적분식', '7.3': '경계층 방정식', '7.4': '평판 경계층', '7.5': '압력 기울기와 박리' },
    sections: [
      { k: '7.1', p: 457, title: '외부 유동과 레이놀즈 수', body: R`
길이 $L$인 물체를 지나는 흐름에서 $Re_L=UL/\nu$에 따라 모습이 크게 달라집니다.
- $Re\lesssim1$: 점성이 흐름 전체를 지배(스토크스 흐름). 물체 앞뒤가 거의 대칭.
- $Re\sim10$–$10^3$: 점성 영역이 두껍고, 뒤쪽에 박리와 후류가 생기기 시작.
- $Re\gtrsim10^3$: 점성 효과가 벽 근처의 얇은 층과 뒤쪽 후류에 갇힌다. 층 밖은 비점성 흐름(퍼텐셜 유동)으로 다룰 수 있다.

:::key 경계층 개념 (프란틀, 1904)
높은 $Re$에서 벽 근처의 얇은 층 두께 $\delta\ll L$ 안에서만 점성 응력이 관성과 같은 크기가 된다. 차수 비교로 $\delta/L\sim Re_L^{-1/2}$(층류).
:::

:::fig fBLplate
:::
` },
      { k: '7.2', p: 461, title: '두께들과 운동량 적분식', body: R`
:::key 경계층의 두께들
- $\delta$: 속도가 바깥 속도의 99%가 되는 높이.
- 배제 두께 $\delta^*=\displaystyle\int_0^\infty\Big(1-\frac uU\Big)dy$: 경계층 때문에 바깥 유선이 밀려난 거리(줄어든 유량을 두께로 환산).
- 운동량 두께 $\theta=\displaystyle\int_0^\infty\frac uU\Big(1-\frac uU\Big)dy$: 잃은 운동량 플럭스를 두께로 환산.
:::

평판(바깥 압력 일정) 앞에서 $x$까지의 경계층을 검사 체적으로 잡고 운동량 방정식을 쓰면, 판이 받는 마찰 항력은 잃은 운동량 플럭스와 같습니다: $D(x)=\rho U^2b\,\theta(x)$. 미분하면

:::key 카르만의 운동량 적분식 (평판)
$$\tau_w=\rho U^2\frac{d\theta}{dx}$$
속도 분포 모양을 가정하면 $\theta$와 $\tau_w$가 모두 $\delta$로 표현되어 $\delta(x)$의 미분 방정식이 된다.
:::

:::ex 예제 1 — 포물선 분포 가정
$u/U=2\eta-\eta^2$ ($\eta=y/\delta$)이면 $\delta(x)$와 $c_f$는?
---
$\theta=\delta\displaystyle\int_0^1(2\eta-\eta^2)(1-\eta)^2d\eta=\tfrac2{15}\delta$, $\tau_w=\mu\,\partial u/\partial y\rvert_0=2\mu U/\delta$.
$2\mu U/\delta=\rho U^2\tfrac2{15}d\delta/dx$ → $\delta\,d\delta=15\nu/U\,dx$ → $\delta=\sqrt{30\nu x/U}$, $\dfrac\delta x=\dfrac{5.48}{\sqrt{Re_x}}$.
$c_f=\dfrac{\tau_w}{\frac12\rho U^2}=\dfrac{0.730}{\sqrt{Re_x}}$. 정확해(블라시우스) 5.0과 0.664와 10% 이내입니다 — 모양을 대충 가정해도 적분량은 잘 맞습니다.
:::
` },
      { k: '7.3', p: 464, title: '경계층 방정식', body: R`
층 안에서 $y$ 방향 길이 척도 $\delta$가 $x$ 방향 $L$보다 훨씬 작다는 것을 써서 나비에-스토크스 식의 항 크기를 비교하면(2차원, 정상, 비압축성):

:::key 프란틀의 경계층 방정식
$$\frac{\partial u}{\partial x}+\frac{\partial v}{\partial y}=0,\qquad u\frac{\partial u}{\partial x}+v\frac{\partial u}{\partial y}=U\frac{dU}{dx}+\nu\frac{\partial^2u}{\partial y^2},\qquad\frac{\partial p}{\partial y}\approx0$$
압력은 층을 가로질러 변하지 않고, 바깥 비점성 흐름의 베르누이 식 $-\frac1\rho\frac{dp}{dx}=U\frac{dU}{dx}$로 정해진다.
:::

- $\partial^2u/\partial x^2$는 $\partial^2u/\partial y^2$보다 $(\delta/L)^2$배 작아 버린다.
- 식이 포물형이라 상류에서 하류로 행진하며 풀 수 있다.
- 평판($dU/dx=0$)에서는 $\eta=y\sqrt{U/(\nu x)}$로 바꾸면 상미분 방정식 $2f'''+ff''=0$(블라시우스)이 되고, 수치해에서 7.4의 계수들이 나온다.
` },
      { k: '7.4', p: 467, title: '평판 경계층: 층류와 난류', body: R`
:::key 평판 층류 (블라시우스)
$$\frac\delta x=\frac{5.0}{\sqrt{Re_x}},\quad\frac{\delta^*}x=\frac{1.721}{\sqrt{Re_x}},\quad\frac\theta x=\frac{0.664}{\sqrt{Re_x}},\quad c_f=\frac{0.664}{\sqrt{Re_x}},\quad C_D=\frac{1.328}{\sqrt{Re_L}}$$
:::

:::key 평판 난류 (1/7 제곱 분포 근사)
$$\frac\delta x\approx\frac{0.16}{Re_x^{1/7}},\qquad c_f\approx\frac{0.027}{Re_x^{1/7}},\qquad C_D\approx\frac{0.031}{Re_L^{1/7}}$$
천이는 매끈한 판에서 $Re_x\approx5\times10^5$ 부근(교란에 따라 $3\times10^5$–$3\times10^6$). 한 면의 마찰 항력 $D=C_D\cdot\tfrac12\rho U^2\cdot bL$.
:::

:::ex 예제 2 — 층류
공기($\nu=1.5\times10^{-5}$, $\rho=1.2$)가 5 m/s로 길이 1 m, 폭 1 m 판을 지난다. 끝의 두께와 한 면의 항력은?
---
$Re_L=3.33\times10^5$ → 층류. $\delta=5.0(1)/577=8.66$ mm.
$C_D=1.328/577=0.00230$, $D=0.00230(0.5)(1.2)(25)(1)=0.0345$ N.
:::

:::ex 예제 3 — 난류
물($\nu=10^{-6}$, $\rho=998$)이 2 m/s로 길이 3 m, 폭 1 m 판을 지난다(앞전부터 난류로 가정). 한 면의 항력과 끝의 두께는?
---
$Re_L=6\times10^6$, $Re_L^{1/7}=9.30$. $C_D=0.031/9.30=0.00334$, $D=0.00334(0.5)(998)(4)(3)=20.0$ N.
$\delta=0.16(3)/9.30=5.2$ cm.
:::

:::tip 층류와 난류의 비교
같은 $Re_x=10^6$에서 층류 $c_f=0.00066$, 난류 $c_f=0.0038$ — 난류가 여섯 배쯤 큽니다. 난류는 섞임이 활발해 벽 가까이까지 빠른 유체를 끌어오므로 벽의 속도 기울기가 가파릅니다.
:::
` },
      { k: '7.5', p: 476, title: '압력 기울기와 박리', body: R`
바깥 흐름이 가속하면($dU/dx>0$, $dp/dx<0$, **순압력 기울기**) 경계층은 얇고 안정합니다. 감속하면($dp/dx>0$, **역압력 기울기**) 벽 근처의 느린 유체가 압력에 밀려 더 느려집니다.

:::key 박리의 조건
벽($u=v=0$)에서 경계층 방정식은
$$\mu\frac{\partial^2u}{\partial y^2}\Big\rvert_w=\frac{dp}{dx}$$
역압력 기울기에서는 벽 근처 분포가 위로 휘고(변곡점이 생김), 벽 전단 $\tau_w=\mu\,\partial u/\partial y\rvert_w$가 줄어 0이 되는 점에서 흐름이 벽을 떠난다(**박리**). 그 뒤에는 역류와 후류.
:::

:::fig fSeparation
:::

박리는 뭉툭한 물체의 큰 압력 항력(14단원), 너무 급히 넓힌 디퓨저의 실속, 받음각이 큰 날개의 실속의 원인입니다. 난류 경계층은 바깥의 빠른 유체를 벽 쪽으로 섞어 넣어 역압력 기울기를 더 오래 견딥니다 — 박리가 늦어집니다.
` },
    ],
    problems: [
      { sec: '7.1', type: 'mc', lv: 1, q: R`높은 레이놀즈 수의 외부 유동에 대한 설명으로 옳은 것은?`,
        choices: [R`점성이 흐름 전체에서 중요하다`, R`점성 효과는 벽 근처의 얇은 경계층과 후류에 갇힌다`, R`점성을 완전히 무시해도 항력을 정확히 구할 수 있다`, R`경계층이 두꺼워진다`], ans: 1,
        sol: R`$\delta/L\sim Re^{-1/2}$로 얇아집니다. 점성을 완전히 빼면 항력이 0이 되는 모순(달랑베르의 역설)이 생깁니다.` },
      { sec: '7.2', type: 'num', lv: 2, q: R`속도 분포 $u/U=2\eta-\eta^2$ ($\eta=y/\delta$)의 운동량 두께 $\theta/\delta$는?`, ans: '2/15', ansTex: R`2/15`,
        sol: R`$\int_0^1(2\eta-\eta^2)(1-\eta)^2d\eta=1-\tfrac53+1-\tfrac15=\tfrac2{15}$.` },
      { sec: '7.2', type: 'num', lv: 2, q: R`속도 분포 $u/U=2\eta-\eta^2$의 배제 두께 $\delta^*/\delta$는?`, ans: '1/3', ansTex: R`1/3`,
        sol: R`$\int_0^1(1-2\eta+\eta^2)d\eta=1-1+\tfrac13$.` },
      { sec: '7.2', type: 'mc', lv: 2, q: R`배제 두께 $\delta^*$의 물리적 의미는?`,
        choices: [R`속도가 99%가 되는 높이`, R`경계층으로 줄어든 유량만큼 바깥 흐름이 벽에서 밀려난 거리`, R`잃은 운동에너지를 두께로 환산한 것`, R`난류가 시작되는 높이`], ans: 1,
        sol: R`$U\delta^*=\int(U-u)dy$ — 줄어든 유량을 균일 속도 $U$의 두께로 환산.` },
      { sec: '7.3', type: 'mc', lv: 2, q: R`경계층 방정식에서 $\partial p/\partial y\approx0$이 뜻하는 것은?`,
        choices: [R`경계층 안의 압력은 0이다`, R`층을 가로질러 압력이 변하지 않으므로 바깥 비점성 흐름이 압력을 정해 준다`, R`압력이 $x$에 무관하다`, R`점성이 압력을 정한다`], ans: 1,
        sol: R`그래서 바깥 흐름을 먼저 풀고, 그 압력을 경계층에 넣습니다.` },
      { sec: '7.4', type: 'num', lv: 1, q: R`공기($\nu=1.5\times10^{-5}$)가 5 m/s로 길이 1 m 판을 지날 때 끝의 경계층 두께(mm)는?`, ans: '5/sqrt(5/1.5e-5)*1000', ansTex: R`8.66`,
        sol: R`$\delta=5.0L/\sqrt{Re_L}=8.66$ mm.` },
      { sec: '7.4', type: 'num', lv: 2, q: R`위 판(폭 1 m)의 한 면이 받는 마찰 항력(N)은? ($\rho=1.2$)`, ans: '1.328/sqrt(5/1.5e-5)*0.5*1.2*25', ansTex: R`0.0345`,
        sol: R`$C_D=0.00230$, $D=C_D\tfrac12\rho U^2bL=0.0345$ N.` },
      { sec: '7.4', type: 'num', lv: 2, q: R`위 판의 $x=0.5$ m에서 벽 전단 응력(Pa)은?`, ans: '0.664/sqrt(5*0.5/1.5e-5)*0.5*1.2*25', ansTex: R`0.0244`,
        sol: R`$Re_x=1.67\times10^5$, $c_f=0.00163$, $\tau_w=c_f\cdot15=0.0244$ Pa.` },
      { sec: '7.4', type: 'num', lv: 1, q: R`공기($\nu=1.5\times10^{-5}$)가 10 m/s로 흐를 때 $Re_x=5\times10^5$이 되는 위치(m)는?`, ans: '5e5*1.5e-5/10', ansTex: R`0.75`,
        sol: R`$x=Re_x\nu/U=0.75$ m.` },
      { sec: '7.4', type: 'num', lv: 2, q: R`물($\nu=10^{-6}$, $\rho=998$)이 2 m/s로 길이 3 m, 폭 1 m 판을 지난다. 전체가 난류라 할 때 한 면의 항력(N)은?`, ans: '0.031/(6e6)^(1/7)*0.5*998*4*3', ansTex: R`20.0`,
        sol: R`$C_D=0.031/Re_L^{1/7}=0.00334$, $D=20.0$ N.` },
      { sec: '7.4', type: 'num', lv: 2, q: R`위 난류 경계층의 끝 두께(cm)는?`, ans: '0.16*3/(6e6)^(1/7)*100', ansTex: R`5.16`,
        sol: R`$\delta=0.16L/Re_L^{1/7}=0.0516$ m.` },
      { sec: '7.4', type: 'mc', lv: 2, q: R`평판 층류 경계층에서 국소 마찰 계수 $c_f$와 두께 $\delta$는 $x$에 대해 어떻게 변하는가?`,
        choices: [R`$c_f\propto x^{-1/2}$, $\delta\propto x^{1/2}$`, R`$c_f\propto x^{1/2}$, $\delta\propto x^{-1/2}$`, R`$c_f$ 일정, $\delta\propto x$`, R`$c_f\propto x^{-1/7}$, $\delta\propto x^{6/7}$`], ans: 0,
        sol: R`$c_f=0.664/\sqrt{Ux/\nu}$, $\delta=5.0\sqrt{\nu x/U}$. 네 번째는 난류입니다.` },
      { sec: '7.5', type: 'mc', lv: 2, q: R`경계층이 박리하는 조건으로 옳은 것은?`,
        choices: [R`순압력 기울기에서 벽 전단이 최대가 될 때`, R`역압력 기울기에서 벽 전단이 0이 될 때`, R`바깥 속도가 일정할 때`, R`층류가 난류로 천이할 때`], ans: 1,
        sol: R`$dp/dx>0$이 벽 근처 유체를 멈추게 하고, $\partial u/\partial y\rvert_w=0$인 점이 박리점입니다.` },
      { sec: '7.5', type: 'mc', lv: 2, q: R`같은 역압력 기울기에서 난류 경계층이 층류보다 늦게 박리하는 이유는?`,
        choices: [R`난류는 점성이 작다`, R`난류 섞임이 바깥의 운동량을 벽 근처로 옮겨 느린 유체에 힘을 보태기 때문`, R`난류는 압력을 느끼지 않는다`, R`난류 경계층이 더 얇기 때문`], ans: 1,
        sol: R`벽 근처 유체가 더 많은 운동량을 가져 압력 상승을 오래 견딥니다. 골프공 딤플의 원리입니다(14단원).` },
      { sec: '7.2', type: 'open', lv: 2, proof: true, q: R`평판 경계층의 속도 분포를 $u/U=2\eta-\eta^2$ ($\eta=y/\delta$)로 가정하고 운동량 적분식 $\tau_w=\rho U^2d\theta/dx$로 $\delta/x=5.48/\sqrt{Re_x}$, $c_f=0.730/\sqrt{Re_x}$, 길이 $L$ 판의 $C_D=1.46/\sqrt{Re_L}$을 유도하세요.`,
        sol: R`
$\theta=\delta\int_0^1(2\eta-\eta^2)(1-\eta)^2d\eta=\delta\int_0^1(2\eta-5\eta^2+4\eta^3-\eta^4)d\eta=\tfrac2{15}\delta$.
$\tau_w=\mu\dfrac{\partial u}{\partial y}\Big\rvert_0=\mu\dfrac U\delta(2-2\eta)\rvert_0=\dfrac{2\mu U}\delta$.
대입: $\dfrac{2\mu U}\delta=\dfrac2{15}\rho U^2\dfrac{d\delta}{dx}$ → $\delta\,d\delta=\dfrac{15\nu}Udx$, $\delta(0)=0$ → $\delta^2=\dfrac{30\nu x}U$ → $\dfrac\delta x=\sqrt{\dfrac{30}{Re_x}}=\dfrac{5.48}{\sqrt{Re_x}}$.
$c_f=\dfrac{2\mu U/\delta}{\frac12\rho U^2}=\dfrac{4\nu}{U\delta}=\dfrac4{Re_x(\delta/x)}=\dfrac{0.730}{\sqrt{Re_x}}$.
$C_D=\dfrac1L\displaystyle\int_0^Lc_f\,dx=\dfrac{0.730}{L}\sqrt{\dfrac\nu U}\,2\sqrt L=\dfrac{1.46}{\sqrt{Re_L}}$ (또는 $C_D=2\theta(L)/L$).`,
        rubric: R`
- 운동량 두께 적분 — 3점
- 벽 전단 — 2점
- 미분 방정식과 $\delta(x)$ — 3점
- $c_f$와 $C_D$ — 2점` },
    ],
  });
})();
