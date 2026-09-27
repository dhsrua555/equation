/* 15 퍼텐셜 유동 — White 8.1–8.4 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 15, part: 'C', title: '퍼텐셜 유동', en: 'Potential Flow', ref: 'White 8.1–8.4', plot: 'flCylinder',
    fig: R`원기둥을 지나는 퍼텐셜 유동의 유선. 균일 흐름에 이중극을 더하면 반지름 a인 원이 유선이 된다`,
    tagline: R`라플라스 방정식은 선형이라 기본 흐름을 더해 물체를 만들 수 있습니다. 원기둥에 와류를 더하면 양력이 나옵니다.`,
    summary: R`비회전·비압축성 흐름은 속도 퍼텐셜과 유동 함수가 모두 **라플라스 방정식**을 만족하므로, 균일 흐름, 원천·흡입, 와류, 이중극 같은 기본해를 더해(**중첩**) 새 흐름을 만듭니다. 어떤 유선이든 벽으로 바꿔도 되므로, 닫힌 유선을 물체의 표면으로 읽습니다. 균일 흐름 + 원천은 **랭킨 반무한 물체**, 균일 흐름 + 이중극($\lambda=Ua^2$)은 **원기둥**이고, 원기둥 표면 속도는 $2U\sin\theta$, 압력 계수는 $C_p=1-4\sin^2\theta$입니다. 이 분포는 앞뒤 대칭이라 항력이 0 — **달랑베르의 역설**이며, 실제 항력은 경계층 박리(13·14단원)에서 옵니다. 원기둥에 순환 $\Gamma$의 와류를 더하면 정체점이 옮겨 가고 위아래 속도가 달라져 단위 길이당 **양력** $L=\rho U\Gamma$(쿠타-주콥스키)가 생깁니다. 모든 2차원 물체의 양력에 성립하는 결과입니다.`,
    goals: [
      R`균일 흐름, 원천, 와류, 이중극의 퍼텐셜과 유동 함수를 쓸 수 있다`,
      R`중첩으로 랭킨 반무한 물체를 만들고 정체점과 두께를 구할 수 있다`,
      R`원기둥 주위 퍼텐셜 유동의 표면 속도와 압력 계수를 구하고 달랑베르의 역설을 설명할 수 있다`,
      R`순환이 있는 원기둥의 정체점 위치와 양력을 구할 수 있다`,
      R`쿠타-주콥스키 정리의 뜻과 실제 흐름과의 관계를 설명할 수 있다`,
    ],
    secTitles: { '8.1': '퍼텐셜 유동의 틀', '8.2': '기본 평면 흐름', '8.3': '중첩과 반무한 물체', '8.4': '원기둥과 양력' },
    sections: [
      { k: '8.1', p: 529, title: '퍼텐셜 유동의 틀', body: R`
9단원에서 본 것처럼 비회전 흐름은 $\mathbf V=\nabla\phi$, 2차원 비압축성 흐름은 $u=\partial\psi/\partial y$, $v=-\partial\psi/\partial x$입니다. 둘 다 성립하면

:::key 퍼텐셜 유동 문제
$$\nabla^2\phi=0,\qquad\nabla^2\psi=0$$
경계 조건: 물체 표면이 유선($\psi=$ 일정, 즉 $\mathbf V\cdot\mathbf n=0$), 멀리서 균일 흐름. 속도를 구한 뒤 압력은 베르누이 식으로:
$$C_p=\frac{p-p_\infty}{\tfrac12\rho U^2}=1-\Big(\frac VU\Big)^2$$
:::

미끄러짐 없음 조건은 버립니다(방정식이 한 차수 낮아 조건을 모두 맞출 수 없음). 그래서 퍼텐셜 유동은 경계층 바깥, 박리 전의 흐름을 잘 나타내고, 벽 전단과 박리는 경계층 이론이 맡습니다.
` },
      { k: '8.2', p: 532, title: '기본 평면 흐름', body: R`
:::key 기본해 (극좌표)
| 흐름 | $\psi$ | $\phi$ | 속도 |
|---|---|---|---|
| 균일 흐름 ($x$ 방향) | $Ur\sin\theta$ | $Ur\cos\theta$ | $u=U$ |
| 원천 ($m>0$) / 흡입 ($m<0$) | $m\theta$ | $m\ln r$ | $v_r=m/r$ |
| 선 와류 (반시계 $K>0$) | $-K\ln r$ | $K\theta$ | $v_\theta=K/r$ |
| 이중극 | $-\lambda\sin\theta/r$ | $\lambda\cos\theta/r$ | $v_r=-\lambda\cos\theta/r^2$ |

원천의 단위 깊이당 유량은 $2\pi m$, 와류의 **순환** $\Gamma=\oint\mathbf V\cdot d\mathbf s=2\pi K$.
:::

이중극은 세기 $m$인 원천과 흡입을 거리 $2a$에 놓고 $2am=\lambda$를 유지하며 $a\to0$으로 보낸 극한입니다. 선 와류는 중심을 뺀 모든 곳에서 비회전이고, 순환은 중심을 감싸는 어떤 닫힌 곡선을 따라 재도 같습니다.

:::ex 예제 1
세기 $K=3$ m²/s인 선 와류에서 반지름 0.5 m의 속력과 순환은?
---
$v_\theta=K/r=6$ m/s. $\Gamma=2\pi K=18.8$ m²/s — 반지름에 무관합니다.
:::
` },
      { k: '8.3', p: 539, title: '중첩: 랭킨 반무한 물체', body: R`
균일 흐름 $U$에 원점의 원천 $m$을 더합니다.
$$\psi=Ur\sin\theta+m\theta,\qquad u=U+\frac mr\cos\theta,\quad v=\frac mr\sin\theta$$

:::key 랭킨 반무한 물체
정체점: 음의 $x$축에서 $U=m/r$ → $x_s=-m/U$. 정체점을 지나는 유선 $\psi=\pi m$이 물체의 표면이 된다: $r=\dfrac{m(\pi-\theta)}{U\sin\theta}$.
하류 멀리서 물체의 반폭 $\pi m/U$ (전체 두께 $2\pi m/U$) — 원천의 유량 $2\pi m$이 속도 $U$로 흘러갈 폭.
:::

같은 방법으로 원천과 흡입을 나란히 놓으면 닫힌 타원형 물체(랭킨 타원), 흡입에 와류를 더하면 욕조 배수구의 소용돌이(나선형 유선)가 됩니다.

:::ex 예제 2
$U=5$ m/s인 흐름에 $m=2$ m²/s 원천을 두었다. 정체점의 위치와 하류의 물체 두께는?
---
$x_s=-m/U=-0.4$ m. 두께 $2\pi m/U=2.51$ m. 물체 앞머리는 둥글고 하류로 갈수록 두께 2.51 m에 다가갑니다.
:::
` },
      { k: '8.4', p: 545, title: '원기둥 주위 흐름과 쿠타-주콥스키 양력', body: R`
균일 흐름에 원점의 이중극($\lambda=Ua^2$)을 더합니다.

:::key 원기둥 주위 흐름
$$\psi=U\sin\theta\Big(r-\frac{a^2}r\Big),\qquad v_r=U\cos\theta\Big(1-\frac{a^2}{r^2}\Big),\quad v_\theta=-U\sin\theta\Big(1+\frac{a^2}{r^2}\Big)$$
$r=a$에서 $v_r=0$이라 원이 유선. 표면 속력 $2U\lvert\sin\theta\rvert$(위아래 꼭대기에서 $2U$), 표면 압력 계수 $C_p=1-4\sin^2\theta$.
:::

:::fig fCylCp
:::

표면 압력이 앞뒤($\theta$와 $180°-\theta$), 위아래로 대칭이라 항력도 양력도 0입니다. 점성이 없는 이론이 “물체는 저항을 받지 않는다”고 말하는 이 모순이 **달랑베르의 역설**입니다. 해답은 13단원의 박리: 실제 뒤쪽 압력은 회복되지 않습니다.

순환 $\Gamma$(시계 방향)의 와류를 더하면
$$\psi=U\sin\theta\Big(r-\frac{a^2}r\Big)+\frac{\Gamma}{2\pi}\ln\frac ra$$
표면 속도 $v_\theta=-2U\sin\theta-\dfrac{\Gamma}{2\pi a}$ — 위쪽은 빨라지고 아래쪽은 느려집니다.

:::key 순환이 있는 원기둥과 쿠타-주콥스키 정리
정체점: $\sin\theta_s=-\dfrac{\Gamma}{4\pi Ua}$ ($\Gamma<4\pi Ua$이면 표면 위, 크면 표면을 떠나 아래쪽 흐름 속으로).
단위 길이당 양력
$$L=\rho U\Gamma$$
방향은 $\mathbf U$를 순환의 반대 방향으로 90° 돌린 쪽(시계 순환, 왼쪽에서 오는 흐름이면 위). 항력은 여전히 0. 이 결과는 원기둥뿐 아니라 **모든** 2차원 물체에 성립한다.
:::

:::fig fCylCirc
:::

날개 단면에서는 뒷전에서 흐름이 매끈하게 떠나도록 하는 순환이 저절로 정해지고(쿠타 조건), 그 값으로 $C_L\approx2\pi\sin\alpha$를 얻습니다(14단원). 도는 원기둥에서는 경계층이 순환을 만듭니다 — 로터로 추진하는 배(플레트너 로터)가 이 원리입니다.

:::ex 예제 3
반지름 1 m 원기둥에 공기($\rho=1.2$)가 10 m/s로 흐른다. (a) 순환이 없을 때 꼭대기의 속도와 압력(자유 흐름 기준), (b) 순환 $\Gamma=50$ m²/s일 때 단위 길이당 양력과 정체점 위치는?
---
(a) $V=2U=20$ m/s, $p-p_\infty=\tfrac12\rho(U^2-4U^2)=-1.5\rho U^2=-180$ Pa.
(b) $L=\rho U\Gamma=1.2(10)(50)=600$ N/m. $\sin\theta_s=-50/(4\pi\times10\times1)=-0.398$ → $\theta_s=203.4°$, $336.6°$(아래쪽 표면).
:::
` },
    ],
    problems: [
      { sec: '8.1', type: 'num', lv: 1, q: R`퍼텐셜 유동에서 국소 속도가 자유 흐름 속도의 1.5배인 점의 압력 계수는?`, ans: '1-2.25', ansTex: R`-1.25`,
        sol: R`$C_p=1-(V/U)^2=-1.25$.` },
      { sec: '8.1', type: 'mc', lv: 2, q: R`퍼텐셜 유동 해석에서 물체 표면의 경계 조건은?`,
        choices: [R`속도 0 (미끄러짐 없음)`, R`법선 속도 0 (표면이 유선)`, R`압력 0`, R`와도 0만 요구`], ans: 1,
        sol: R`라플라스 방정식은 한 가지 조건만 맞출 수 있어 미끄러짐을 허용합니다.` },
      { sec: '8.2', type: 'num', lv: 1, q: R`세기 $K=3$ m²/s인 선 와류에서 $r=0.5$ m의 속력(m/s)은?`, ans: '6', ansTex: R`6`,
        sol: R`$K/r=6$.` },
      { sec: '8.2', type: 'num', lv: 1, q: R`위 와류의 순환(m²/s)은?`, ans: '2*pi*3', ansTex: R`18.8`,
        sol: R`$2\pi K$. 중심을 감싸는 어떤 곡선에서도 같습니다.` },
      { sec: '8.2', type: 'num', lv: 2, q: R`단위 깊이당 유량 $2\pi$ m²/s를 내는 선 원천에서 $r=2$ m의 반지름 방향 속도(m/s)는?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$m=1$, $v_r=m/r=0.5$.` },
      { sec: '8.3', type: 'num', lv: 1, q: R`$U=5$ m/s 흐름에 $m=2$ m²/s 원천을 두었다. 정체점과 원천 사이 거리(m)는?`, ans: '0.4', ansTex: R`0.4`,
        sol: R`$m/U=0.4$ m(상류 쪽).` },
      { sec: '8.3', type: 'num', lv: 2, q: R`위 랭킨 반무한 물체의 하류 멀리에서의 전체 두께(m)는?`, ans: '2*pi*2/5', ansTex: R`2.51`,
        sol: R`$2\pi m/U=2.51$ m.` },
      { sec: '8.3', type: 'mc', lv: 2, q: R`퍼텐셜 유동에서 해를 더해 새로운 해를 만들 수 있는 이유는?`,
        choices: [R`베르누이 식이 선형이라서`, R`$\phi$와 $\psi$가 만족하는 라플라스 방정식이 선형이라서`, R`압력이 선형이라서`, R`유선이 곧아서`], ans: 1,
        sol: R`속도는 더해지지만 압력은 속도의 제곱이라 더해지지 않습니다. 압력은 합친 속도로 다시 계산합니다.` },
      { sec: '8.4', type: 'num', lv: 1, q: R`반지름 1 m 원기둥에 공기($\rho=1.2$)가 10 m/s로 흐른다(순환 없음). 꼭대기의 계기압(자유 흐름 기준, Pa)은?`, ans: '-1.5*1.2*100', ansTex: R`-180`,
        sol: R`$C_p=1-4=-3$, $p-p_\infty=-3(60)=-180$ Pa.` },
      { sec: '8.4', type: 'num', lv: 2, q: R`원기둥 표면에서 압력이 자유 흐름 압력과 같아지는 각 $\theta$ (0°–90°, 앞 정체점부터, 도)는?`, ans: '30', ansTex: R`30°`,
        sol: R`$1-4\sin^2\theta=0$ → $\sin\theta=1/2$.` },
      { sec: '8.4', type: 'num', lv: 2, q: R`위 원기둥(1 m, 10 m/s, $\rho=1.2$)에 순환 50 m²/s가 있을 때 단위 길이당 양력(N/m)은?`, ans: '600', ansTex: R`600`,
        sol: R`$\rho U\Gamma=600$ N/m.` },
      { sec: '8.4', type: 'num', lv: 3, q: R`반지름 $a$ 원기둥에서 두 정체점이 아래쪽 한 점(θ = 270°)에서 만나려면 순환이 $Ua$의 몇 배여야 하는가?`, ans: '4*pi', ansTex: R`4\pi`,
        sol: R`$\sin\theta_s=-\Gamma/(4\pi Ua)=-1$ → $\Gamma=4\pi Ua$.` },
      { sec: '8.4', type: 'mc', lv: 2, q: R`달랑베르의 역설이란?`,
        choices: [R`원기둥에 양력이 생긴다는 것`, R`비점성 퍼텐셜 이론에서 물체가 받는 항력이 0으로 나온다는 것`, R`경계층이 박리한다는 것`, R`압력이 음수가 된다는 것`], ans: 1,
        sol: R`앞뒤 대칭인 압력 분포 때문입니다. 실제 항력은 점성(마찰과 박리)에서 옵니다.` },
      { sec: '8.4', type: 'mc', lv: 2, q: R`쿠타-주콥스키 정리 $L=\rho U\Gamma$에 대해 옳은 것은?`,
        choices: [R`원기둥에만 성립한다`, R`임의의 2차원 물체의 단위 길이당 양력에 성립한다`, R`항력도 준다`, R`점성이 있어야 성립한다`], ans: 1,
        sol: R`물체를 감싸는 먼 곡선에서 운동량을 계산하면 모양과 무관하게 순환만 남습니다.` },
      { sec: '8.4', type: 'open', lv: 2, proof: true, q: R`$\psi=U\sin\theta\,(r-a^2/r)$에서 속도 성분을 구해 원 $r=a$가 유선임을 보이고, 표면 압력 계수 $C_p=1-4\sin^2\theta$를 유도한 뒤, 압력을 표면에서 적분하면 항력과 양력이 모두 0임을 보이세요.`,
        sol: R`
$v_r=\dfrac1r\dfrac{\partial\psi}{\partial\theta}=U\cos\theta\Big(1-\dfrac{a^2}{r^2}\Big)$, $v_\theta=-\dfrac{\partial\psi}{\partial r}=-U\sin\theta\Big(1+\dfrac{a^2}{r^2}\Big)$.
$r=a$: $v_r=0$ → 표면을 가로지르는 흐름이 없어 유선. $r\to\infty$: $v_r\to U\cos\theta$, $v_\theta\to-U\sin\theta$ → 균일 흐름.
표면 속력 $V=2U\lvert\sin\theta\rvert$, 베르누이: $C_p=1-V^2/U^2=1-4\sin^2\theta$.
단위 길이당 힘: 압력은 표면 안쪽으로, 넓이 요소 $a\,d\theta$, 바깥 법선 $(\cos\theta,\sin\theta)$.
$D=-\displaystyle\int_0^{2\pi}p\cos\theta\,a\,d\theta$, $L=-\displaystyle\int_0^{2\pi}p\sin\theta\,a\,d\theta$. $p=p_\infty+\tfrac12\rho U^2(1-4\sin^2\theta)$.
상수 항은 $\int\cos\theta=\int\sin\theta=0$. $\int_0^{2\pi}\sin^2\theta\cos\theta\,d\theta=0$, $\int_0^{2\pi}\sin^3\theta\,d\theta=0$ → $D=L=0$.`,
        rubric: R`
- 속도 성분 — 2점
- 표면이 유선, 먼 곳 균일 흐름 — 2점
- 압력 계수 — 3점
- 적분으로 힘 0 — 3점` },
    ],
  });
})();
