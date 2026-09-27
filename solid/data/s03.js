/* 03 변형률 — B&J 2.1, 2.7, 강의 슬라이드 Lecture 2 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 3, part: 'A', title: '변형률: 늘어남과 비틀림의 비율', en: 'Strain', ref: 'B&J 2.1, 2.7 · Lecture 2', plot: 'slShear',
    fig: R`단순 전단으로 비틀리는 정사각형들. 직각이 줄어든 만큼이 전단 변형률`,
    tagline: R`변위는 물체 전체가 얼마나 움직였는가이고, 변형률은 한 점 근처가 얼마나 찌그러졌는가입니다. 재료는 변위가 아니라 변형률에 반응합니다.`,
    summary: R`**수직 변형률**은 길이의 변화율 $\varepsilon=\delta/L$, 한 점에서는 $\varepsilon_x=\partial u/\partial x$입니다. **전단 변형률** $\gamma_{xy}$는 원래 직각이던 두 선분 사이 각의 감소량(라디안)이고, 변위장으로 $\gamma_{xy}=\partial u/\partial y+\partial v/\partial x$입니다. 이 값을 **공학 전단 변형률**이라 하고, 그 절반 $\varepsilon_{xy}=\gamma_{xy}/2$를 **텐서 전단 변형률**이라 합니다. 텐서 성분으로 모은 변형률 행렬만이 응력과 같은 변환 법칙을 따르므로, 좌표를 돌릴 때(12단원)는 반드시 $\gamma/2$를 씁니다. 변형률은 모두 작다고 보는 **미소 변형** 가정 아래의 식입니다.`,
    goals: [
      R`평균 수직 변형률과 한 점의 수직 변형률 $\partial u/\partial x$를 구분하고 계산할 수 있다`,
      R`직각의 변화로 전단 변형률을 정의하고 평행사변형 변형에서 값을 구할 수 있다`,
      R`변위장 $(u,v)$에서 $\varepsilon_x,\varepsilon_y,\gamma_{xy}$를 유도할 수 있다`,
      R`공학 전단 변형률과 텐서 전단 변형률의 관계 $\varepsilon_{xy}=\gamma_{xy}/2$와 그 이유를 설명할 수 있다`,
      R`강체 막대에 연결된 줄처럼 기하 관계로 변형률을 구할 수 있다`,
    ],
    secTitles: { '2.1a': '수직 변형률', '2.7': '전단 변형률', '2.1b': '변위장에서 변형률로', '2.1c': '텐서와 공학 변형률' },
    sections: [
      { k: '2.1a', p: 58, src: '강의 슬라이드 · Lecture 2 A', title: '수직 변형률', body: R`
길이 $L$인 봉이 $\delta$만큼 늘어났다면, 같은 재료·같은 응력의 봉이라도 길이가 두 배면 늘어남도 두 배입니다. 길이에 무관한 비율을 봐야 재료의 상태를 비교할 수 있습니다.

:::key 수직 변형률
$$\varepsilon=\frac{\delta}{L}\quad(\text{평균}),\qquad \varepsilon_x=\lim_{\Delta x\to0}\frac{\Delta\delta}{\Delta x}=\frac{du}{dx}\quad(\text{한 점})$$
$u(x)$는 원래 위치 $x$에 있던 점의 축방향 변위입니다. 늘어나면 양, 줄어들면 음이고 단위가 없습니다. $10^{-6}$을 **마이크로스트레인**(με)이라 부릅니다.
:::

단면이 일정하고 하중이 일정한 봉에서는 $u$가 $x$에 대해 선형이라 두 정의가 같습니다. 단면이 변하거나 자중처럼 축력이 위치마다 다르면 $\varepsilon_x$가 위치마다 다르고, 전체 늘어남은 $\delta=\int_0^L\varepsilon_x\,dx$로 모읍니다(5단원).

:::ex 예제 1 — 강체 막대와 두 줄
길이 3 m인 강체 막대 $ABC$가 왼쪽 끝 $A$에서 핀으로 지지되고, $A$에서 1.2 m인 $B$와 3 m인 $C$에 길이 2 m인 수직 줄이 달려 있다. 하중을 걸었더니 $C$가 6 mm 내려갔다. 두 줄의 변형률은?
---
막대는 강체이므로 $A$를 중심으로 작은 각 $\phi$만큼 돕니다. 처짐은 $A$에서의 거리에 비례: $\delta_B=6\times1.2/3=2.4$ mm.
$\varepsilon_B=2.4/2000=1.2\times10^{-3}$, $\varepsilon_C=6/2000=3.0\times10^{-3}$.
강체의 회전이 변형률에 **기하학적 관계**(적합 조건)를 줍니다. 5단원 부정정 문제의 핵심 재료입니다.
:::
` },
      { k: '2.7', p: 99, src: '강의 슬라이드 · Lecture 2 A', title: '전단 변형률', body: R`
수직 응력은 길이를 바꾸고, 전단 응력은 **모양**을 바꿉니다. 정사각형이 평행사변형이 되며 모서리의 직각이 줄어듭니다.

:::key 전단 변형률
원래 직각을 이루던 두 선분 사이 각이 $\tfrac\pi2-\gamma$가 되었을 때 $\gamma$(라디안)가 **전단 변형률**이다. 각이 줄면 양이다. 선형 탄성 범위에서
$$\tau=G\gamma$$
이고 $G$는 전단 탄성 계수이다(4단원).
:::

:::ex 예제 2 — 고무 패드
높이 50 mm인 고무 패드의 윗면이 아랫면에 대해 수평으로 1.5 mm 밀렸다. 전단 변형률은? $G=0.9$ MPa이면 평균 전단 응력은?
---
작은 각이라 $\gamma\approx\tan\gamma=1.5/50=0.030$ rad. $\tau=G\gamma=0.9\times0.030=0.027$ MPa $=27$ kPa.
:::

:::warn 작은 각 근사
$\gamma\approx\tan\gamma\approx\sin\gamma$는 $\gamma$가 작을 때만 맞습니다. 고체역학의 선형 이론은 변형률이 $10^{-3}$ 정도라는 **미소 변형** 가정 위에 서 있고, 고무처럼 큰 변형은 비선형 이론이 필요합니다.
:::
` },
      { k: '2.1b', p: 99, src: '강의 슬라이드 · Lecture 2 A (Mathematical Approach)', title: '변위장에서 변형률로', body: R`
물체의 각 점 $(x,y)$가 $(x+u,\ y+v)$로 옮겨 간다고 합니다. $u(x,y)$, $v(x,y)$를 **변위장**이라 합니다. 한 점 $A$에서 시작하는 작은 두 선분 $AB$($x$ 방향, 길이 $dx$)와 $AD$($y$ 방향, 길이 $dy$)가 어떻게 변하는지 보면 변형률이 나옵니다.

:::fig sStrainEl
:::

$B$의 변위는 $A$보다 $\big(\tfrac{\partial u}{\partial x}dx,\ \tfrac{\partial v}{\partial x}dx\big)$만큼 더 큽니다(1차 테일러 근사[[@base:ch04:4.1|선형 근사. 매끄러운 함수는 가까운 점에서 편미분으로 만든 일차식과 거의 같습니다.]]). 그래서 $A'B'$의 길이는 $dx\big(1+\tfrac{\partial u}{\partial x}\big)$에 2차 미소량을 더한 것이고, $x$축과 이루는 각은 $\alpha\approx\tfrac{\partial v}{\partial x}$입니다. $AD$도 같은 방식으로 봅니다.

:::key 변형률-변위 관계
$$\varepsilon_x=\frac{\partial u}{\partial x},\qquad\varepsilon_y=\frac{\partial v}{\partial y},\qquad\gamma_{xy}=\frac{\partial u}{\partial y}+\frac{\partial v}{\partial x}$$
(미소 변형: 모든 변위 기울기가 1보다 훨씬 작다.)
:::

:::ex 예제 3 — 선형 변위장
$u=0.002x+0.001y$, $v=0.003x-0.001y$일 때 변형률 성분은?
---
$\varepsilon_x=0.002$, $\varepsilon_y=-0.001$, $\gamma_{xy}=0.001+0.003=0.004$. 선형 변위장은 모든 점에서 같은 변형률을 줍니다(**균일 변형**).
:::

:::note 강체 회전은 변형률을 만들지 않는다
$u=-\omega y$, $v=\omega x$(작은 각 $\omega$의 강체 회전)이면 $\varepsilon_x=\varepsilon_y=0$이고 $\gamma_{xy}=-\omega+\omega=0$입니다. 변위 기울기 중 **대칭 부분**만 변형률이고, 반대칭 부분 $\tfrac12(\partial v/\partial x-\partial u/\partial y)$은 회전입니다. 그래서 변위가 커도 변형률은 0일 수 있습니다.
:::
` },
      { k: '2.1c', p: 99, src: '강의 슬라이드 · Lecture 2 A', title: '텐서 변형률과 공학 변형률', body: R`
강의는 두 종류의 전단 변형률을 나란히 적습니다.

:::key 텐서 변형률과 공학 변형률
$$\varepsilon_{xy}=\frac12\gamma_{xy}=\frac12\Big(\frac{\partial u}{\partial y}+\frac{\partial v}{\partial x}\Big),\qquad [\varepsilon]=\begin{pmatrix}\varepsilon_x&\tfrac12\gamma_{xy}&\tfrac12\gamma_{xz}\\\tfrac12\gamma_{xy}&\varepsilon_y&\tfrac12\gamma_{yz}\\\tfrac12\gamma_{xz}&\tfrac12\gamma_{yz}&\varepsilon_z\end{pmatrix}$$
$\gamma_{xy}$(직각의 변화)를 **공학 전단 변형률**, $\varepsilon_{xy}$를 **텐서 전단 변형률**이라 한다.
:::

왜 절반인가? 행렬 $[\varepsilon]$은 변위 기울기 행렬 $\nabla\mathbf u$의 대칭 부분 $\tfrac12(\nabla\mathbf u+\nabla\mathbf u^T)$이고, 이 행렬만이 좌표를 돌릴 때 응력 행렬과 똑같은 규칙으로 바뀝니다. 공학 변형률 $\gamma$를 그대로 행렬에 넣으면 이 규칙이 깨집니다. 12단원의 변형률 변환 공식과 모어 원에서 “$\tau$ 자리에 $\gamma/2$”가 들어가는 이유가 이것입니다.

:::ex 예제 4 — 대각선의 늘어남
한 변이 100 mm인 정사각형 판이 순수 전단 $\gamma=0.002$를 받아 평행사변형이 되었다(두 방향 수직 변형률은 0). 늘어나는 대각선의 변형률은?
---
늘어나는 대각선 방향(45°)의 수직 변형률은 $\varepsilon_{45°}=\tfrac12(\varepsilon_x+\varepsilon_y)+\tfrac12\gamma_{xy}=\gamma/2=0.001$. 대각선 길이 $141.4$ mm가 $0.141$ mm 늘어납니다.
직접 확인: 윗변이 $\gamma\times100=0.2$ mm 밀리면 대각선 끝이 $0.2$ mm 옮겨 가고, 그 대각선 방향 성분이 $0.2\cos45°=0.141$ mm입니다.
:::

:::tip 시험에서 헷갈리지 않으려면
문제에 $\gamma$가 주어졌는지 $\varepsilon_{xy}$가 주어졌는지 먼저 확인합니다. 스트레인 게이지와 교재 공식은 대부분 공학 전단 변형률 $\gamma_{xy}$를 씁니다.
:::
` },
    ],
    problems: [
      { sec: '2.1a', type: 'num', lv: 1, q: R`길이 2.5 m인 강선이 1.5 mm 늘어났다. 평균 변형률을 마이크로스트레인(με) 단위로 구하면?`, ans: '600', ansTex: R`600\ \mu\varepsilon`,
        sol: R`$\varepsilon=1.5/2500=6\times10^{-4}=600$ με.` },
      { sec: '2.1a', type: 'num', lv: 2, q: R`예제 1과 같은 강체 막대에서 $B$가 $A$로부터 1.5 m, $C$가 2.5 m, 두 줄의 길이가 모두 1.8 m이고 $C$가 4.5 mm 내려갔다. 줄 $B$의 변형률은?`, ans: '4.5*1.5/2.5/1800', ansTex: R`1.5\times10^{-3}`,
        sol: R`$\delta_B=4.5\times1.5/2.5=2.7$ mm, $\varepsilon_B=2.7/1800=1.5\times10^{-3}$.` },
      { sec: '2.1a', type: 'mc', lv: 2, q: R`길이 $L$인 봉의 축방향 변위가 $u(x)=cx^2$이다. 옳은 것은?`,
        choices: [R`변형률은 어디서나 $cL$이다`, R`변형률 $\varepsilon_x=2cx$는 위치마다 다르고, 전체 늘어남은 $cL^2$이다`, R`전체 늘어남은 $2cL^2$이다`, R`변위가 0인 $x=0$에서는 변형률도 0이므로 봉은 늘어나지 않는다`], ans: 1,
        sol: R`$\varepsilon_x=du/dx=2cx$. $\delta=u(L)-u(0)=cL^2=\int_0^L2cx\,dx$. $x=0$에서 변위와 변형률이 0인 것은 그 점의 성질일 뿐입니다.` },
      { sec: '2.7', type: 'num', lv: 1, q: R`높이 40 mm인 고무 블록의 윗면이 1.2 mm 수평으로 밀렸다. 전단 변형률(rad)은?`, ans: '0.03', ansTex: R`0.030\ \text{rad}`,
        sol: R`$\gamma\approx1.2/40=0.030$ rad.` },
      { sec: '2.7', type: 'num', lv: 2, q: R`앞 문제의 블록($G=1.2$ MPa)의 윗면이 60 mm × 80 mm이다. 윗면에 가한 수평력(N)은?`, ans: '1.2e6*0.03*0.06*0.08', ansTex: R`172.8\ \text{N}`,
        sol: R`$\tau=G\gamma=1.2\times0.03=0.036$ MPa. $V=\tau A=0.036\times10^6\times0.0048=172.8$ N.` },
      { sec: '2.1b', type: 'num', lv: 1, q: R`$u=0.004x-0.002y$, $v=0.001x+0.003y$일 때 공학 전단 변형률 $\gamma_{xy}$는?`, ans: '-0.001', ansTex: R`-0.001`,
        sol: R`$\gamma_{xy}=\partial u/\partial y+\partial v/\partial x=-0.002+0.001=-0.001$. 음수이므로 직각이 벌어집니다.` },
      { sec: '2.1b', type: 'num', lv: 1, q: R`앞 문제의 변위장에서 $\varepsilon_y$는?`, ans: '0.003', ansTex: R`0.003`,
        sol: R`$\varepsilon_y=\partial v/\partial y=0.003$.` },
      { sec: '2.1b', type: 'mc', lv: 2, q: R`변위장 $u=-0.01y$, $v=0.01x$에 대한 설명으로 옳은 것은?`,
        choices: [R`$\gamma_{xy}=0.02$인 순수 전단이다`, R`작은 강체 회전이며 모든 변형률이 0이다`, R`$\varepsilon_x=\varepsilon_y=0.01$인 등방 팽창이다`, R`미소 변형 가정이 깨졌다`], ans: 1,
        sol: R`$\varepsilon_x=\varepsilon_y=0$, $\gamma_{xy}=-0.01+0.01=0$. 반대칭 부분 $\tfrac12(0.01+0.01)=0.01$ rad의 회전만 있습니다.` },
      { sec: '2.1b', type: 'num', lv: 2, q: R`한 변이 200 mm인 정사각형 판 $OABC$($O$ 원점, $A=(200,0)$, $C=(0,200)$)가 변형되어 $O$는 제자리, $A$는 $(200.3,\ 0.2)$, $C$는 $(0.4,\ 199.9)$로 옮겨 갔다(단위 mm). 균일 변형이라 할 때 $\gamma_{xy}$는?`, ans: '(0.2+0.4)/200', ansTex: R`0.003`,
        sol: R`$\partial v/\partial x=0.2/200=0.001$, $\partial u/\partial y=0.4/200=0.002$. $\gamma_{xy}=0.003$. 참고로 $\varepsilon_x=0.3/200=0.0015$, $\varepsilon_y=-0.1/200=-0.0005$.` },
      { sec: '2.1c', type: 'num', lv: 1, q: R`공학 전단 변형률이 $\gamma_{xy}=800\ \mu\varepsilon$일 때 텐서 전단 변형률 $\varepsilon_{xy}$(με)는?`, ans: '400', ansTex: R`400\ \mu\varepsilon`,
        sol: R`$\varepsilon_{xy}=\gamma_{xy}/2=400$ με.` },
      { sec: '2.1c', type: 'num', lv: 2, q: R`한 변이 100 mm인 정사각형 판이 순수 전단 $\gamma=0.003$을 받는다. 늘어나는 대각선의 늘어난 길이(mm)는?`, ans: '0.0015*100*sqrt(2)', ansTex: R`0.212\ \text{mm}`,
        sol: R`$\varepsilon_{45°}=\gamma/2=0.0015$. 대각선 $100\sqrt2=141.4$ mm에 곱하면 $0.212$ mm.` },
      { sec: '2.1c', type: 'mc', lv: 2, q: R`변형률을 행렬로 모아 좌표 변환할 때 전단 성분 자리에 $\gamma_{xy}/2$를 넣는 이유는?`,
        choices: [R`단위를 맞추기 위해`, R`텐서 성분 $\varepsilon_{xy}=\gamma_{xy}/2$로 만든 대칭 행렬만이 응력과 같은 변환 법칙을 따르기 때문`, R`전단 변형률은 항상 수직 변형률의 절반이라서`, R`스트레인 게이지가 절반만 읽기 때문`], ans: 1,
        sol: R`$[\varepsilon]=\tfrac12(\nabla\mathbf u+\nabla\mathbf u^T)$가 2계 텐서입니다. 그래서 변형률 모어 원의 세로축은 $\gamma/2$입니다.` },
      { sec: '2.1b', type: 'open', lv: 2, proof: true, q: R`변위장 $u(x,y)$, $v(x,y)$가 매끄럽고 변위 기울기가 작을 때, 점 $A$에서 $x,y$ 방향으로 뻗은 미소 선분의 변화로 $\varepsilon_x=\partial u/\partial x$, $\varepsilon_y=\partial v/\partial y$, $\gamma_{xy}=\partial u/\partial y+\partial v/\partial x$를 유도하세요.`,
        sol: R`
$A=(x,y)$, $B=(x+dx,y)$, $D=(x,y+dy)$. 1차 테일러 전개로 $B$의 변위는 $(u+u_xdx,\ v+v_xdx)$, $D$의 변위는 $(u+u_ydy,\ v+v_ydy)$.
변형 후 $\overrightarrow{A'B'}=(dx(1+u_x),\ v_xdx)$. 길이 $=dx\sqrt{(1+u_x)^2+v_x^2}\approx dx(1+u_x)$(2차 항 무시). 따라서 $\varepsilon_x=(|A'B'|-dx)/dx=u_x$. 같은 방법으로 $\overrightarrow{A'D'}=(u_ydy,\ dy(1+v_y))$에서 $\varepsilon_y=v_y$.
$A'B'$가 $x$축과 이루는 각 $\alpha\approx v_x/(1+u_x)\approx v_x$, $A'D'$가 $y$축과 이루는 각 $\beta\approx u_y$. 두 선분 사이의 각은 $\tfrac\pi2-\alpha-\beta$이므로 $\gamma_{xy}=\alpha+\beta=u_y+v_x$.`,
        rubric: R`
- 테일러 전개로 끝점의 변위 — 3점
- 길이 변화에서 수직 변형률(2차 항 무시 명시) — 3점
- 두 각 $\alpha,\beta$와 전단 변형률 — 4점` },
    ],
  });
})();
