/* 09 유동 함수, 와도, 퍼텐셜, 정확해 — White 4.7–4.10 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 9, part: 'B', title: '유동 함수, 와도, 퍼텐셜, 정확해', en: 'Stream Function, Vorticity, Potential & Exact Solutions', ref: 'White 4.7–4.10', plot: 'flStream',
    fig: R`균일 흐름에 원천을 더한 반무한 물체 주위의 유선. 굵은 선이 물체의 경계가 된다`,
    tagline: R`2차원 비압축성 흐름은 함수 하나로 그릴 수 있고, 회전이 없으면 라플라스 방정식 하나로 풀 수 있습니다. 점성이 이기는 좁은 틈에서는 나비에-스토크스 식이 손으로 풀립니다.`,
    summary: R`2차원 비압축성 흐름은 **유동 함수** $\psi$로 $u=\partial\psi/\partial y$, $v=-\partial\psi/\partial x$라 쓰면 연속 방정식이 저절로 만족되고, $\psi$가 일정한 선이 유선, 두 유선의 $\psi$ 차이가 그 사이의 유량입니다. 유체 요소의 회전은 **와도** $\boldsymbol\omega=\nabla\times\mathbf V$(각속도의 두 배)로 잽니다. 와도가 0인 비회전 흐름은 **속도 퍼텐셜** $\mathbf V=\nabla\phi$를 갖고, 비압축성이면 $\nabla^2\phi=0$, 2차원에서는 $\nabla^2\psi=0$ — 선형이라 해를 더할 수 있고, 베르누이 식이 흐름 전체에서 성립합니다. 한편 대류 항이 사라지는 평행 흐름에서는 나비에-스토크스 식이 $\mu\,d^2u/dy^2=dp/dx$로 줄어 정확해를 얻습니다: 쿠에트 유동(직선), 평판 사이의 푸아죄유 유동(포물선), 도는 두 원통 사이의 흐름 $v_\theta=Ar+B/r$.`,
    goals: [
      R`유동 함수에서 속도를 구하고, 두 유선 사이의 유량을 계산할 수 있다`,
      R`와도를 계산해 흐름이 회전인지 판정할 수 있다`,
      R`속도 퍼텐셜과 라플라스 방정식, 비회전 흐름의 베르누이 식을 설명할 수 있다`,
      R`나비에-스토크스 식에서 쿠에트·푸아죄유 유동의 속도 분포와 유량, 벽 전단을 유도할 수 있다`,
      R`도는 동심 원통 사이 흐름의 속도와 토크를 구할 수 있다`,
    ],
    secTitles: { '4.7': '유동 함수', '4.8': '와도', '4.9': '비회전 흐름과 퍼텐셜', '4.10a': '평판 사이의 정확해', '4.10b': '동심 원통 사이 흐름' },
    sections: [
      { k: '4.7', p: 253, title: '유동 함수', body: R`
2차원 비압축성 연속 방정식 $\partial u/\partial x+\partial v/\partial y=0$은 혼합 편미분이 같다는 사실로 자동으로 만족시킬 수 있습니다.

:::key 유동 함수
$$u=\frac{\partial\psi}{\partial y},\qquad v=-\frac{\partial\psi}{\partial x}\qquad\Big(\text{극좌표: }v_r=\frac1r\frac{\partial\psi}{\partial\theta},\ v_\theta=-\frac{\partial\psi}{\partial r}\Big)$$
- $\psi=$ 일정인 선이 유선이다: $d\psi=-v\,dx+u\,dy=0\iff dy/dx=v/u$.
- 두 유선 사이를 지나는 단위 깊이당 유량은 $\psi_2-\psi_1$.
:::

:::fig fStreamFn
:::

:::ex 예제 1 — 정체점 유동
$u=2x$, $v=-2y$의 유동 함수와 유선, 그리고 점 (1, 1)과 (2, 2)를 지나는 두 유선 사이의 유량은?
---
$\partial\psi/\partial y=2x$ → $\psi=2xy+f(x)$, $-\partial\psi/\partial x=-2y-f'(x)=-2y$ → $f=$ 상수. $\psi=2xy$.
유선은 쌍곡선 $xy=$ 일정 — 벽($y=0$)을 향해 오다가 옆으로 꺾이는 흐름입니다. 유량 $\psi(2,2)-\psi(1,1)=8-2=6$ m²/s(단위 깊이당).
:::

:::tip 흐르는 방향
$u=\partial\psi/\partial y$이므로 흐름 방향을 바라볼 때 $\psi$가 큰 쪽이 왼쪽에 있습니다. 부호로 방향을 확인하는 빠른 방법입니다.
:::
` },
      { k: '4.8', p: 261, title: '와도와 비회전 흐름', body: R`
유체 요소의 서로 수직인 두 변이 도는 각속도의 평균이 요소의 회전 각속도입니다. $xy$ 평면에서 $x$ 방향 변은 $\partial v/\partial x$로, $y$ 방향 변은 $-\partial u/\partial y$로 돕니다.

:::key 와도
$$\boldsymbol\omega=\nabla\times\mathbf V=2\times(\text{요소의 각속도}),\qquad\omega_z=\frac{\partial v}{\partial x}-\frac{\partial u}{\partial y}$$
극좌표: $\omega_z=\dfrac1r\dfrac{d(rv_\theta)}{dr}-\dfrac1r\dfrac{\partial v_r}{\partial\theta}$. $\boldsymbol\omega=\mathbf 0$이면 **비회전** 흐름.
:::

| 흐름 | 속도 | 와도 |
|---|---|---|
| 강체 회전 | $v_\theta=\Omega r$ | $2\Omega$ (회전) |
| 자유 와류 | $v_\theta=K/r$ | 0 (원점 제외, 비회전) |
| 쿠에트 유동 | $u=Uy/h$ | $-U/h$ (유선이 곧아도 회전) |

유선이 원이어도 비회전일 수 있고(자유 와류: 요소가 원을 돌면서 자기 방향은 유지), 유선이 곧아도 회전일 수 있습니다(쿠에트: 위아래 속도 차이로 요소가 굴러감). 회전 여부는 유선의 모양이 아니라 요소 자체의 회전입니다.

:::note 와도는 어디서 생기나
점성이 없는 흐름에서는 정지 상태에서 출발한 흐름이 계속 비회전으로 남습니다(켈빈의 순환 정리). 와도는 벽의 미끄러짐 없음 조건과 점성이 만들어 경계층을 통해 흐름 속으로 퍼집니다. 그래서 물체에서 먼 곳은 비회전으로 보고, 벽 근처만 따로 다룹니다.
:::
` },
      { k: '4.9', p: 263, title: '비회전 흐름과 속도 퍼텐셜', body: R`
$\nabla\times\mathbf V=\mathbf 0$이면(단순 연결된 영역에서) 스칼라 함수 $\phi$가 있어 $\mathbf V=\nabla\phi$입니다.

:::key 퍼텐셜 유동
$$\mathbf V=\nabla\phi,\qquad\text{비압축성: }\nabla\cdot\mathbf V=\nabla^2\phi=0$$
2차원에서는 $\omega_z=-\nabla^2\psi$이므로 비회전이면 $\nabla^2\psi=0$도 성립. $\phi$ 일정선과 $\psi$ 일정선은 서로 수직이다.
비회전, 정상, 비점성, 비압축성 흐름에서 베르누이 식 $p/\rho+V^2/2+gz$는 **유선에 관계없이 흐름 전체에서** 일정하다.
:::

| 기본 흐름 | $\psi$ | $\phi$ | 속도 |
|---|---|---|---|
| 균일 흐름 | $Uy$ | $Ux$ | $u=U$ |
| 선 원천 (세기 $m$) | $m\theta$ | $m\ln r$ | $v_r=m/r$ |
| 선 와류 (세기 $K$) | $-K\ln r$ | $K\theta$ | $v_\theta=K/r$ |

라플라스 방정식은 선형이라 해들을 더해도 해입니다. 이 성질로 물체 주위 흐름을 조립하는 것이 15단원입니다.

:::ex 예제 2 — 와류의 압력
세기 $K=2$ m²/s인 공기($\rho=1.2$)의 자유 와류에서, 멀리 있는 압력보다 $r=0.5$ m에서 얼마나 낮은가?
---
비회전이라 베르누이가 전체에서 성립: $p_\infty-p=\tfrac12\rho v_\theta^2=\dfrac{\rho K^2}{2r^2}=\dfrac{1.2(4)}{2(0.25)}=9.6$ Pa. 중심에 가까울수록 압력이 급히 떨어집니다(회오리의 가운데).
:::
` },
      { k: '4.10a', p: 268, title: '평판 사이의 정확해: 쿠에트와 푸아죄유', body: R`
무한히 넓은 두 평판 사이의 정상 흐름에서 $u=u(y)$, $v=w=0$이라 하면 연속 방정식이 만족되고 대류 항 $u\,\partial u/\partial x$가 0이 됩니다. $y$ 방향 운동량에서 압력은 $y$에 대해 정수압, $x$ 방향에서

:::key 평행 흐름의 나비에-스토크스 식
$$\mu\frac{d^2u}{dy^2}=\frac{dp}{dx}=\text{일정}$$
(왼쪽은 $y$만의, 오른쪽은 $x$만의 함수이므로 둘 다 상수.)
:::

:::key 쿠에트 유동과 푸아죄유 유동
- 쿠에트(아래 판 정지, 위 판 $U$, $dp/dx=0$): $u=Uy/h$.
- 평판 사이 푸아죄유($y=\pm h$, 두 판 정지): $u=\dfrac{-dp/dx}{2\mu}(h^2-y^2)$, $u_{\max}=\dfrac{-dp/dx\,h^2}{2\mu}$, $V_{\text{평균}}=\tfrac23u_{\max}$,
단위 폭 유량 $q=\dfrac{2h^3}{3\mu}\Big(-\dfrac{dp}{dx}\Big)$, 벽 전단 $\tau_w=h\Big(-\dfrac{dp}{dx}\Big)$.
:::

:::fig fPlates
:::

:::ex 예제 3
간격 1 cm($h=0.5$ cm)인 평판 사이로 기름($\mu=0.4$ Pa·s, $\rho=900$)이 $dp/dx=-2000$ Pa/m로 흐른다. 최대 속도, 단위 폭 유량, 벽 전단은?
---
$u_{\max}=2000(0.005)^2/(2\times0.4)=0.0625$ m/s. $q=\tfrac23(0.0625)(0.01)=4.17\times10^{-4}$ m²/s. $\tau_w=0.005(2000)=10$ Pa.
레이놀즈 수 $\rho V(2h)/\mu=900(0.0417)(0.01)/0.4\approx0.9$ — 층류 가정이 맞습니다.
:::
` },
      { k: '4.10b', p: 275, title: '도는 동심 원통 사이의 흐름', body: R`
길고 동심인 두 원통 사이에서 $v_\theta=v_\theta(r)$, $v_r=v_z=0$을 가정하면 $\theta$ 방향 나비에-스토크스 식이 $\dfrac{d}{dr}\Big[\dfrac1r\dfrac{d(rv_\theta)}{dr}\Big]=0$으로 줄어듭니다.

:::key 동심 원통 사이의 쿠에트 유동
$$v_\theta=Ar+\frac Br$$
안쪽 원통($r_i$)이 $\omega_i$로 돌고 바깥쪽($r_o$)이 정지하면 $A=-\dfrac{\omega_ir_i^2}{r_o^2-r_i^2}$, $B=\dfrac{\omega_ir_i^2r_o^2}{r_o^2-r_i^2}$.
전단 $\tau_{r\theta}=\mu r\dfrac{d}{dr}\Big(\dfrac{v_\theta}r\Big)=-\dfrac{2\mu B}{r^2}$, 안쪽 원통의 길이 $L$당 토크 $T=\dfrac{4\pi\mu\omega_ir_i^2r_o^2}{r_o^2-r_i^2}L$.
:::

$Ar$은 강체 회전, $B/r$은 자유 와류 — 두 기본 흐름의 합입니다. 틈 $r_o-r_i$가 반지름보다 훨씬 작으면 토크가 1단원의 선형 근사 $\mu(\omega_ir_i/\text{틈})(2\pi r_iL)r_i$로 돌아갑니다. 이 흐름은 회전 점도계의 원리이고, 안쪽 원통이 충분히 빨리 돌면 테일러 와류라는 도넛 모양 2차 흐름으로 불안정해집니다.

:::ex 예제 4 — 회전 점도계
$r_i=5$ cm, $r_o=6$ cm, 길이 20 cm인 점도계의 안쪽 원통이 10 rad/s로 돌고, 기름의 $\mu=0.3$ Pa·s다. 토크는?
---
$T=\dfrac{4\pi(0.3)(10)(0.05)^2(0.06)^2}{0.06^2-0.05^2}(0.2)=\dfrac{3.39\times10^{-4}}{0.0011}(0.2)=0.0617$ N·m.
선형 근사는 0.0471 N·m — 틈이 반지름의 20%라 차이가 큽니다.
:::
` },
    ],
    problems: [
      { sec: '4.7', type: 'num', lv: 1, q: R`유동 함수 $\psi=2xy$ (m²/s)인 흐름에서 점 (1, 1)과 (2, 2)를 지나는 두 유선 사이의 단위 깊이당 유량(m²/s)은?`, ans: '6', ansTex: R`6`,
        sol: R`$8-2=6$.` },
      { sec: '4.7', type: 'num', lv: 2, q: R`$\psi=3x^2y-y^3$인 흐름에서 점 (1, 1)의 속력은?`, ans: '6', ansTex: R`6`,
        sol: R`$u=\partial\psi/\partial y=3x^2-3y^2=0$, $v=-\partial\psi/\partial x=-6xy=-6$. 속력 6.` },
      { sec: '4.7', type: 'mc', lv: 1, q: R`$x$ 방향 균일 흐름 $u=U$, $v=0$의 유동 함수는?`,
        choices: [R`$Ux$`, R`$Uy$`, R`$-Uy$`, R`$U(x+y)$`], ans: 1,
        sol: R`$\partial\psi/\partial y=U$, $\partial\psi/\partial x=0$.` },
      { sec: '4.8', type: 'num', lv: 1, q: R`각속도 5 rad/s로 강체처럼 도는 유체의 와도(s⁻¹)는?`, ans: '10', ansTex: R`10`,
        sol: R`$\omega=2\Omega=10$.` },
      { sec: '4.8', type: 'num', lv: 2, q: R`간격 1 cm, 위 판 속도 2 m/s인 쿠에트 유동의 와도 크기(s⁻¹)는?`, ans: '200', ansTex: R`200`,
        sol: R`$\omega_z=-\partial u/\partial y=-U/h=-200$. 유선이 곧아도 회전 흐름입니다.` },
      { sec: '4.8', type: 'mc', lv: 2, q: R`자유 와류 $v_\theta=K/r$에 대해 옳은 것은?`,
        choices: [R`유선이 원이므로 회전 흐름이다`, R`원점을 제외하면 와도가 0인 비회전 흐름이다`, R`강체 회전과 같다`, R`압력이 반지름에 무관하다`], ans: 1,
        sol: R`$\frac1r\frac{d(rv_\theta)}{dr}=\frac1r\frac{dK}{dr}=0$.` },
      { sec: '4.9', type: 'mc', lv: 2, q: R`베르누이 식을 서로 다른 유선 위의 두 점 사이에 써도 되는 조건은?`,
        choices: [R`층류일 때`, R`흐름이 비회전일 때 (정상, 비점성, 비압축성과 함께)`, R`압력이 일정할 때`, R`유선이 평행할 때만`], ans: 1,
        sol: R`비회전이면 유선 방향뿐 아니라 모든 방향으로 베르누이 상수가 같습니다.` },
      { sec: '4.9', type: 'num', lv: 2, q: R`세기 $K=2$ m²/s인 공기($\rho=1.2$) 자유 와류에서 $r=0.5$ m의 압력은 먼 곳보다 몇 Pa 낮은가?`, ans: '1.2*4/(2*0.25)', ansTex: R`9.6`,
        sol: R`$\rho K^2/(2r^2)=9.6$ Pa.` },
      { sec: '4.9', type: 'mc', lv: 2, q: R`다음 중 2차원 비압축성 퍼텐셜 유동의 속도 퍼텐셜이 될 수 있는 것은?`,
        choices: [R`$x^2+y^2$`, R`$x^2-y^2$`, R`$x^2y$`, R`$e^x+e^y$`], ans: 1,
        sol: R`$\nabla^2(x^2-y^2)=2-2=0$. 나머지는 라플라스 방정식을 만족하지 않습니다.` },
      { sec: '4.10a', type: 'num', lv: 2, q: R`간격 1 cm 평판 사이로 기름($\mu=0.4$ Pa·s)이 $dp/dx=-2000$ Pa/m로 흐른다. 최대 속도(m/s)는?`, ans: '2000*0.005^2/(2*0.4)', ansTex: R`0.0625`,
        sol: R`$u_{\max}=(-dp/dx)h^2/(2\mu)=0.0625$ m/s.` },
      { sec: '4.10a', type: 'num', lv: 2, q: R`같은 흐름의 단위 폭 유량(L/s per m)은?`, ans: '2/3*0.0625*0.01*1000', ansTex: R`0.417`,
        sol: R`$q=\tfrac23u_{\max}(2h)=4.17\times10^{-4}$ m²/s.` },
      { sec: '4.10a', type: 'num', lv: 2, q: R`같은 흐름의 벽 전단 응력(Pa)은?`, ans: '10', ansTex: R`10`,
        sol: R`$\tau_w=h(-dp/dx)=0.005(2000)=10$ Pa. 위아래 두 벽의 전단 $2\tau_w$가 압력 차 $2h\,\Delta p/L$와 평형을 이룹니다.` },
      { sec: '4.10a', type: 'num', lv: 3, q: R`아래 판 정지, 위 판(간격 $h=1$ cm)이 1 m/s로 움직이는 평판 사이의 기름($\mu=0.1$ Pa·s)의 알짜 유량이 0이 되려면 $dp/dx$ (Pa/m)가 얼마여야 하는가?`, ans: '6000', ansTex: R`6000`,
        sol: R`$u=Uy/h+\dfrac{-dp/dx}{2\mu}y(h-y)$, $q=\dfrac{Uh}2+\dfrac{-dp/dx}{12\mu}h^3=0$ → $dp/dx=6\mu U/h^2=6000$ Pa/m(하류로 갈수록 압력 증가). 저널 베어링과 밀봉에서 생기는 상황입니다.` },
      { sec: '4.10b', type: 'num', lv: 3, q: R`$r_i=5$ cm, $r_o=6$ cm, 길이 20 cm인 회전 점도계의 안쪽 원통이 10 rad/s로 돈다. $\mu=0.3$ Pa·s일 때 토크(N·m)는?`, ans: '4*pi*0.3*10*0.05^2*0.06^2/(0.06^2-0.05^2)*0.2', ansTex: R`0.0617`,
        sol: R`$T=4\pi\mu\omega_ir_i^2r_o^2L/(r_o^2-r_i^2)=0.0617$ N·m.` },
      { sec: '4.10a', type: 'open', lv: 2, proof: true, q: R`두 정지 평판 $y=\pm h$ 사이의 정상, 완전 발달 층류에 대해 나비에-스토크스 식에서 속도 분포 $u=\dfrac{-dp/dx}{2\mu}(h^2-y^2)$를 유도하고, 평균 속도가 최대 속도의 2/3임을 보이세요.`,
        sol: R`
가정 $u=u(y)$, $v=w=0$. 연속: $\partial u/\partial x=0$ ✓.
$y$ 운동량: $0=-\partial p/\partial y-\rho g$(연직이면) → $p$의 $y$ 변화는 정수압뿐이고 $\partial p/\partial x$는 $y$에 무관.
$x$ 운동량: 정상이고 $u\,\partial u/\partial x=0$, $v=0$이므로 가속도 0. $0=-\dfrac{dp}{dx}+\mu\dfrac{d^2u}{dy^2}$.
왼쪽은 $x$만, $\mu u''$는 $y$만의 함수 → 둘 다 상수. 두 번 적분: $u=\dfrac{1}{2\mu}\dfrac{dp}{dx}y^2+C_1y+C_2$.
미끄러짐 없음 $u(\pm h)=0$ → $C_1=0$, $C_2=-\dfrac{1}{2\mu}\dfrac{dp}{dx}h^2$ → $u=\dfrac{-dp/dx}{2\mu}(h^2-y^2)$.
평균: $\dfrac1{2h}\displaystyle\int_{-h}^hu\,dy=\dfrac{-dp/dx}{2\mu}\Big(h^2-\dfrac{h^2}3\Big)=\dfrac23u_{\max}$.`,
        rubric: R`
- 가정과 연속 방정식 — 2점
- 식을 $\mu u''=dp/dx$로 줄이고 상수임을 설명 — 3점
- 적분과 경계 조건 — 3점
- 평균 속도 — 2점` },
    ],
  });
})();
