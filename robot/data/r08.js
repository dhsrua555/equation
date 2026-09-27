/* 08 강체 운동의 지수 좌표와 렌치 — MR 3.3.3–3.4 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 8, part: 'B', title: '나사 운동의 지수 좌표와 렌치', en: 'Exponential Coordinates of Rigid Motion & Wrenches', ref: 'MR 3.3.3–3.4', plot: 'rbPitch',
    fig: R`피치가 다른 나사 운동의 궤적들. 피치 0은 원, 피치가 커질수록 축 방향으로 길게 늘어난다`,
    tagline: R`어떤 자세든 한 나사 축 둘레로 θ만큼 돌며 미끄러져 도달할 수 있습니다. 그 나사를 따라 가하는 힘과 모멘트는 렌치 하나로 묶입니다.`,
    summary: R`나사 축 $\mathcal S=(\omega,v)$를 따라 $\theta$만큼 움직이는 변환은 행렬 지수 $e^{[\mathcal S]\theta}$입니다. $\lVert\omega\rVert=1$이면 $e^{[\mathcal S]\theta}=\begin{bmatrix}e^{[\omega]\theta}&G(\theta)v\\0&1\end{bmatrix}$, $G(\theta)=I\theta+(1-\cos\theta)[\omega]+(\theta-\sin\theta)[\omega]^2$이고, 순수 병진이면 $\begin{bmatrix}I&v\theta\\0&1\end{bmatrix}$입니다. 여섯 수 $\mathcal S\theta$가 강체 자세의 **지수 좌표**이고, 거꾸로 $T$에서 행렬 로그로 되찾습니다. 힘 쪽의 짝은 **렌치** $\mathcal F=(m,f)$ — 힘 $f$와 그 힘이 원점에 대해 만드는 모멘트 $m=r\times f$를 묶은 것입니다. 트위스트와 렌치의 내적 $\mathcal V^T\mathcal F$는 동력이라 좌표계와 무관하고, 이로부터 렌치의 좌표 변환 $\mathcal F_b=[\mathrm{Ad}_{T_{sb}}]^T\mathcal F_s$가 나옵니다.`,
    goals: [
      R`나사 축의 행렬 지수를 계산해 강체 변환을 구할 수 있다`,
      R`순수 병진과 회전이 섞인 나사 운동의 변위를 구분할 수 있다`,
      R`동차 변환 행렬의 행렬 로그로 나사 축과 이동량을 구할 수 있다`,
      R`힘과 모멘트를 렌치로 묶고 다른 좌표계로 옮길 수 있다`,
      R`동력의 불변성에서 렌치의 변환 법칙을 유도할 수 있다`,
    ],
    secTitles: { '3.3.3a': '나사 운동의 행렬 지수', '3.3.3b': 'SE(3)의 행렬 로그', '3.4': '렌치' },
    sections: [
      { k: '3.3.3a', p: 103, title: '나사 운동의 행렬 지수', body: R`
강체 위의 점 $x$가 나사 축 $\mathcal S$를 따라 단위 속도로 움직이면 동차 좌표로 $\dot{\tilde x}=[\mathcal S]\tilde x$, 해는 $\tilde x(\theta)=e^{[\mathcal S]\theta}\tilde x(0)$입니다. $[\mathcal S]=\begin{bmatrix}[\omega]&v\\0&0\end{bmatrix}$의 거듭제곱을 계산해 급수를 모으면:

:::key 나사 운동의 행렬 지수
$\lVert\omega\rVert=1$일 때
$$e^{[\mathcal S]\theta}=\begin{bmatrix}e^{[\omega]\theta}&G(\theta)v\\0&1\end{bmatrix},\qquad G(\theta)=I\theta+(1-\cos\theta)[\omega]+(\theta-\sin\theta)[\omega]^2$$
$\omega=0$, $\lVert v\rVert=1$(순수 병진)이면 $e^{[\mathcal S]\theta}=\begin{bmatrix}I&v\theta\\0&1\end{bmatrix}$.
:::

:::ex 예제 1 — 한 점 둘레의 90° 회전
점 $q=(0,1,0)$을 지나는 $\hat z$ 방향 축(피치 0) 둘레로 90° 도는 변환은?
---
$v=-\hat z\times q=(1,0,0)$. $[\omega]v=\hat z\times v=(0,1,0)$, $[\omega]^2v=(-1,0,0)$.
$G(\tfrac\pi2)v=\tfrac\pi2(1,0,0)+(0,1,0)+(\tfrac\pi2-1)(-1,0,0)=(1,1,0)$.
$T=\begin{bmatrix}\mathrm{Rot}(\hat z,90°)&(1,1,0)^T\\0&1\end{bmatrix}$. 확인: $q\mapsto(-1,0,0)+(1,1,0)=q$ — 축 위의 점은 움직이지 않습니다.
:::

:::ex 예제 2 — 피치가 있는 나사
원점을 지나는 $\hat z$ 축, 피치 $h=0.1$ m/rad로 반 바퀴($\theta=\pi$) 돌면 원점은 어디로 가는가?
---
$v=h\hat z$. $[\omega]v=0$이므로 $G(\theta)v=\theta v=(0,0,0.1\pi)$. 원점은 축 위에 있어 돌지 않고 $0.314$ m 올라갑니다.
:::
` },
      { k: '3.3.3b', p: 106, title: 'SE(3)의 행렬 로그', body: R`
:::key 행렬 로그 (T에서 나사 운동으로)
$T=(R,p)$가 주어지면
- $R=I$: $\omega=0$, $v=p/\lVert p\rVert$, $\theta=\lVert p\rVert$.
- 그 밖: $[\omega]\theta=\log R$ (6단원), $v=G^{-1}(\theta)p$, $G^{-1}(\theta)=\dfrac1\theta I-\dfrac12[\omega]+\Big(\dfrac1\theta-\dfrac12\cot\dfrac\theta2\Big)[\omega]^2$.
결과 $\mathcal S\theta=(\omega\theta,v\theta)$가 $T$의 지수 좌표.
:::

모든 강체 변위는 어떤 나사 축 둘레의 하나의 나사 운동으로 이뤄질 수 있다는 **샬의 정리**가 이 계산의 기하학적 뜻입니다. 9단원의 정기구학은 관절마다 하나씩, 이런 나사 운동의 곱입니다.

:::ex 예제 3
예제 1의 $T$에서 나사를 되찾으세요.
---
$\log R$: $\operatorname{tr}R=1$ → $\theta=\pi/2$, $\omega=\hat z$. $G^{-1}$에서 $\cot(\pi/4)=1$: $G^{-1}=\tfrac2\pi I-\tfrac12[\hat z]+(\tfrac2\pi-\tfrac12)[\hat z]^2$.
$p=(1,1,0)$: $[\hat z]p=(-1,1,0)$, $[\hat z]^2p=(-1,-1,0)$.
$v=\tfrac2\pi(1,1,0)-\tfrac12(-1,1,0)+(\tfrac2\pi-\tfrac12)(-1,-1,0)=(1,0,0)$ ✓.
:::
` },
      { k: '3.4', p: 108, title: '렌치', body: R`
점 $r$에 힘 $f$가 작용하면 원점에 대한 모멘트는 $m=r\times f$. 둘을 묶어 여섯 성분의 **렌치**를 만듭니다. 트위스트가 각속도를 위에 두듯 렌치는 모멘트를 위에 둡니다.

:::key 렌치와 좌표 변환
$$\mathcal F_a=\begin{bmatrix}m_a\\f_a\end{bmatrix},\qquad m_a=r_a\times f_a;\qquad\mathcal F_b=[\mathrm{Ad}_{T_{ab}}]^T\mathcal F_a$$
동력(트위스트와 렌치의 내적) $P=\mathcal V_a^T\mathcal F_a=\mathcal V_b^T\mathcal F_b$는 좌표계와 무관하다.
:::

:::ex 예제 4 — 같은 힘을 세 좌표계에서
{s}에서 점 $(0.5,0,0)$에 힘 $f=(0,0,-10)$ N이 작용한다. (a) $\mathcal F_s$, (b) 그 점에 원점이 있고 방향이 같은 {b}에서의 $\mathcal F_b$는?
---
(a) $m_s=(0.5,0,0)\times(0,0,-10)=(0,5,0)$, $\mathcal F_s=((0,5,0),(0,0,-10))$.
(b) $R=I$, $p=(0.5,0,0)$: $[\mathrm{Ad}_{T_{sb}}]^T=\begin{bmatrix}I&-[p]\\0&I\end{bmatrix}$. $m_b=m_s-p\times f=0$, $f_b=f$. 힘이 {b} 원점을 지나므로 모멘트가 없습니다.
:::

:::tip 렌치의 나사
트위스트처럼 렌치도 한 직선(작용선)을 따른 힘과 그 직선 둘레의 모멘트로 쓸 수 있습니다: $\mathcal F=(r\times\hat f+h\hat f,\ \hat f)\lVert f\rVert$. 볼트를 조이는 렌치(공구)가 축 방향 힘과 축 둘레 모멘트를 함께 주는 것이 이름의 유래입니다.
:::
` },
    ],
    problems: [
      { sec: '3.3.3a', type: 'num', lv: 1, q: R`순수 병진 나사 $\mathcal S=(0,(0.6,0.8,0))$를 따라 $\theta=5$만큼 움직이면 원점은 어디로 가는가? $y$ 좌표는?`, ans: '4', ansTex: R`4`,
        sol: R`$v\theta=(3,4,0)$.` },
      { sec: '3.3.3a', type: 'num', lv: 2, q: R`점 $(0,1,0)$을 지나는 $\hat z$ 방향 축(피치 0) 둘레로 90° 도는 변환의 위치 부분의 $x$ 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$G(\pi/2)v=(1,1,0)$.` },
      { sec: '3.3.3a', type: 'num', lv: 2, q: R`원점을 지나는 $\hat z$ 축, 피치 0.1 m/rad로 $\theta=\pi$ 돌 때 원점의 $z$ 방향 이동(m)은?`, ans: '0.1*pi', ansTex: R`0.314`,
        sol: R`$h\theta$.` },
      { sec: '3.3.3a', type: 'mc', lv: 2, q: R`$e^{[\mathcal S]\theta}$의 위치 부분이 $v\theta$가 아니라 $G(\theta)v$인 이유는?`,
        choices: [R`계산 편의 때문`, R`회전하는 동안 $v$의 방향도 함께 돌아 병진이 누적되는 방식이 달라지기 때문`, R`피치가 0이기 때문`, R`$G$는 항상 $I\theta$와 같다`], ans: 1,
        sol: R`점의 속도는 매 순간 회전된 방향을 따르므로, 적분하면 $\sin$, $\cos$ 항이 섞입니다. $\omega=0$일 때만 $G=I\theta$.` },
      { sec: '3.3.3b', type: 'num', lv: 1, q: R`$T=(I,(0,3,4))$의 지수 좌표에서 $\theta$는?`, ans: '5', ansTex: R`5`,
        sol: R`$R=I$: $\theta=\lVert p\rVert=5$, $v=(0,0.6,0.8)$.` },
      { sec: '3.3.3b', type: 'num', lv: 2, q: R`$T=\big(\mathrm{Rot}(\hat z,90°),(1,1,0)\big)$의 지수 좌표에서 $\theta$ (rad)는?`, ans: 'pi/2', ansTex: R`\pi/2`,
        sol: R`회전 부분의 각이 곧 $\theta$(ω가 단위 벡터).` },
      { sec: '3.4', type: 'num', lv: 1, q: R`점 $(0.5,0,0)$에 작용하는 힘 $(0,0,-10)$ N의 원점에 대한 모멘트의 $y$ 성분(N·m)은?`, ans: '5', ansTex: R`5`,
        sol: R`$r\times f=(0,5,0)$.` },
      { sec: '3.4', type: 'num', lv: 2, q: R`같은 힘을 원점이 $(0,0,0.2)$에 있고 {s}와 방향이 같은 {c}에서 쓰면 모멘트의 $y$ 성분은?`, ans: '5', ansTex: R`5`,
        sol: R`$m_c=m_s-p\times f=(0,5,0)-(0,0,0.2)\times(0,0,-10)=(0,5,0)$ — 힘과 $p$가 나란해 변하지 않습니다.` },
      { sec: '3.4', type: 'num', lv: 2, q: R`트위스트 $((0,0,2),(1,0,0))$과 렌치 $((0,0,3),(4,0,0))$의 동력(W)은?`, ans: '10', ansTex: R`10`,
        sol: R`$\omega\cdot m+v\cdot f=6+4=10$.` },
      { sec: '3.4', type: 'mc', lv: 2, q: R`렌치를 {s}에서 {b}로 옮기는 식은?`,
        choices: [R`$\mathcal F_b=[\mathrm{Ad}_{T_{sb}}]\mathcal F_s$`, R`$\mathcal F_b=[\mathrm{Ad}_{T_{sb}}]^T\mathcal F_s$`, R`$\mathcal F_b=\mathcal F_s$`, R`$\mathcal F_b=[\mathrm{Ad}_{T_{bs}}]^T\mathcal F_s$`], ans: 1,
        sol: R`$\mathcal V_s^T\mathcal F_s=\mathcal V_b^T[\mathrm{Ad}_{T_{sb}}]^T\mathcal F_s=\mathcal V_b^T\mathcal F_b$.` },
      { sec: '3.4', type: 'num', lv: 2, q: R`{b}의 원점에서 힘 $(0,0,-10)$만 작용한다($m_b=0$). {b}의 원점이 {s}에서 $(0.5,0,0)$, 방향이 같을 때 $m_s$의 $y$ 성분은?`, ans: '5', ansTex: R`5`,
        sol: R`$\mathcal F_s=[\mathrm{Ad}_{T_{bs}}]^T\mathcal F_b$: $m_s=m_b+p\times f=(0,5,0)$.` },
      { sec: '3.4', type: 'open', lv: 2, proof: true, q: R`동력 $\mathcal V^T\mathcal F$가 좌표계에 무관하다는 사실과 $\mathcal V_a=[\mathrm{Ad}_{T_{ab}}]\mathcal V_b$에서 $\mathcal F_b=[\mathrm{Ad}_{T_{ab}}]^T\mathcal F_a$를 유도하고, $R=I$일 때 이것이 “모멘트를 옮길 때 $p\times f$를 뺀다”는 정역학 규칙과 같음을 보이세요.`,
        sol: R`
동력: $\mathcal V_b^T\mathcal F_b=\mathcal V_a^T\mathcal F_a=([\mathrm{Ad}_{T_{ab}}]\mathcal V_b)^T\mathcal F_a=\mathcal V_b^T[\mathrm{Ad}_{T_{ab}}]^T\mathcal F_a$.
모든 $\mathcal V_b$에 대해 성립하므로 $\mathcal F_b=[\mathrm{Ad}_{T_{ab}}]^T\mathcal F_a$.
$[\mathrm{Ad}_T]^T=\begin{bmatrix}R^T&R^T[p]^T\\0&R^T\end{bmatrix}=\begin{bmatrix}R^T&-R^T[p]\\0&R^T\end{bmatrix}$.
$R=I$: $m_b=m_a-[p]f_a=m_a-p\times f_a$, $f_b=f_a$. $p$는 {a}에서 본 {b} 원점 — 원점을 $p$로 옮기면 힘의 팔이 $r-p$가 되어 $(r-p)\times f=m_a-p\times f$입니다.`,
        rubric: R`
- 동력 불변으로 전치 수반 행렬 유도 — 5점
- 수반 행렬의 전치 계산 — 2점
- 정역학 규칙과의 대응 — 3점` },
    ],
  });
})();
