/* 10 회전의 지수 좌표 — MR 3.2.3 (각속도 3.2.2는 5단원으로 옮김) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 10, part: 'B', title: '회전의 지수 좌표', en: 'Exponential Coordinates of Rotation', ref: 'MR 3.2.3', plot: 'rbExp',
    fig: R`한 축 둘레로 도는 여러 점이 그리는 원. 회전은 축 방향 단위 벡터와 각, 곧 벡터 하나로 적힌다`,
    tagline: R`회전을 축과 각, 곧 세 수 $\hat\omega\theta$로 적습니다. 행렬 지수로 회전 행렬을 만들고 행렬 로그로 되찾으며, 모든 회전은 반지름 $\pi$인 공 안의 한 점이 됩니다.`,
    summary: R`단위 축 $\hat\omega$ 둘레로 각 $\theta$만큼 도는 회전은, 5단원의 각속도로 쓰면 미분 방정식 $\dot p=[\hat\omega]p$를 $\theta$ 동안 푼 것이므로 **행렬 지수** $e^{[\hat\omega]\theta}$입니다. $[\hat\omega]^3=-[\hat\omega]$ 덕분에 급수가 닫힌 꼴 — **로드리게스 공식** $e^{[\hat\omega]\theta}=I+\sin\theta[\hat\omega]+(1-\cos\theta)[\hat\omega]^2$ — 이 됩니다. 세 수 $\hat\omega\theta\in\mathbb R^3$가 회전의 **지수 좌표**이고, 거꾸로 $R$에서 $\theta=\cos^{-1}\frac{\operatorname{tr}R-1}2$, $[\hat\omega]=\frac{R-R^T}{2\sin\theta}$로 되찾습니다(**행렬 로그**). $\theta\in[0,\pi]$로 정하면 모든 회전은 반지름 $\pi$인 공 안의 점 하나가 되고, 공 안쪽에서는 일대일이지만 겉면의 맞은편 두 점($\pm\hat\omega\pi$)은 같은 회전입니다.`,
    goals: [
      R`회전을 미분 방정식의 해로 보고 행렬 지수로 쓸 수 있다`,
      R`로드리게스 공식을 유도하고 축과 각에서 회전 행렬을 계산할 수 있다`,
      R`행렬 로그로 회전 행렬의 축과 각을 구하고 $\theta=0,\pi$인 경우를 처리할 수 있다`,
      R`$SO(3)$를 반지름 $\pi$인 공으로 그리고, 주어진 회전이 공의 어느 영역에 있는지 판정할 수 있다`,
      R`지수 좌표가 방향의 최소 표현임을 설명할 수 있다`,
    ],
    secTitles: { '3.2.3a': '행렬 지수와 로드리게스 공식', '3.2.3b': '행렬 로그', '3.2.3c': 'SO(3)를 공으로 보기' },
    sections: [
      { k: '3.2.3a', p: 79, title: '행렬 지수와 로드리게스 공식', body: R`
점 $p$가 단위 축 $\hat\omega$(원점을 지남) 둘레로 단위 각속도로 돌면(5단원의 $\dot p=\omega\times p$) $\dot p=\hat\omega\times p=[\hat\omega]p$. 이 선형 미분 방정식의 해는 $p(\theta)=e^{[\hat\omega]\theta}p(0)$ — 행렬 지수 $e^{A}=I+A+A^2/2!+\cdots$입니다.

$[\hat\omega]^2=\hat\omega\hat\omega^T-I$, $[\hat\omega]^3=-[\hat\omega]$이므로 거듭제곱이 $[\hat\omega]$와 $[\hat\omega]^2$ 둘로 되돌아옵니다. 급수를 모으면:

:::key 로드리게스 공식
$$\mathrm{Rot}(\hat\omega,\theta)=e^{[\hat\omega]\theta}=I+\sin\theta\,[\hat\omega]+(1-\cos\theta)[\hat\omega]^2\in SO(3)$$
$\hat\omega\theta\in\mathbb R^3$을 회전의 **지수 좌표**라 한다(방향의 명시적 표현, 세 수).
:::

### 그림으로 보는 로드리게스 공식
급수 없이 기하로도 같은 식이 나옵니다. 점 $p$를 축 방향 성분 $p_\parallel=\hat\omega(\hat\omega^Tp)$와 수직 성분 $p_\perp=p-p_\parallel$로 나누면, 회전은 $p_\parallel$을 그대로 두고 $p_\perp$만 축에 수직인 평면에서 $\theta$만큼 돌립니다. 그 평면의 두 직교 방향이 $p_\perp$와 $\hat\omega\times p$(길이가 같음)이므로
$$Rp=p_\parallel+\cos\theta\,p_\perp+\sin\theta\,(\hat\omega\times p).$$
$\hat\omega\times p=[\hat\omega]p$이고 $[\hat\omega]^2p=\hat\omega\times(\hat\omega\times p)=-p_\perp$이므로 $p_\perp=-[\hat\omega]^2p$, $p_\parallel=p+[\hat\omega]^2p$. 넣어 정리하면
$$Rp=\big(I+\sin\theta[\hat\omega]+(1-\cos\theta)[\hat\omega]^2\big)p$$
— 로드리게스 공식입니다.

:::fig rRodrigues
:::

:::sim rotation axis
축의 방위각·고도로 $\hat\omega$를, 막대로 $\theta$를 정하면 상자가 그만큼 돌고 아래에 로드리게스 공식으로 계산한 $R$이 나옵니다. 색 곡선은 세 물체 축의 끝이 지나온 원호로, 모두 축 $\hat\omega$에 수직인 평면 위에 있습니다.
:::

:::ex 예제 1
$\hat\omega=\tfrac1{\sqrt3}(1,1,1)$ 둘레로 $\theta=120°$ 돈 회전 행렬은?
---
$[\hat\omega]=\tfrac1{\sqrt3}\begin{bmatrix}0&-1&1\\1&0&-1\\-1&1&0\end{bmatrix}$, $[\hat\omega]^2=\tfrac13\mathbf 1\mathbf 1^T-I$. $\sin120°=\tfrac{\sqrt3}2$, $1-\cos120°=\tfrac32$.
$R=I+\tfrac12\begin{bmatrix}0&-1&1\\1&0&-1\\-1&1&0\end{bmatrix}+\begin{bmatrix}-1&\frac12&\frac12\\\frac12&-1&\frac12\\\frac12&\frac12&-1\end{bmatrix}=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$.
$\hat x\to\hat y\to\hat z\to\hat x$로 축을 돌려 세우는 회전 — 대각선 둘레 120°의 대칭과 맞습니다.
:::

:::tip 앞 단원과의 연결
$\mathrm{Rot}(\hat z,\theta)$에 $\hat\omega=\hat z$를 넣으면 로드리게스 공식이 6단원의 기본 회전 행렬을 그대로 줍니다. 로드리게스 공식은 임의의 축에 대한 일반화입니다.
:::
` },
      { k: '3.2.3b', p: 84, title: '행렬 로그: 회전 행렬에서 축과 각으로', body: R`
로드리게스 공식의 대각합과 반대칭 부분을 보면 거꾸로 풀 수 있습니다: $\operatorname{tr}R=1+2\cos\theta$, $R-R^T=2\sin\theta[\hat\omega]$.

:::idea 왜 대각합과 반대칭 부분인가
$[\hat\omega]$는 대각합이 0인 반대칭 행렬이고 $[\hat\omega]^2=\hat\omega\hat\omega^T-I$는 대칭 행렬(대각합 $1-3=-2$)입니다. 그래서 로드리게스 공식의 대각합에는 $I$와 $[\hat\omega]^2$만 남아 $3-2(1-\cos\theta)=1+2\cos\theta$가 되고, 반대칭 부분 $\frac12(R-R^T)$에는 $\sin\theta[\hat\omega]$만 남습니다. 각은 대각합에서, 축은 반대칭 부분에서 읽습니다.
:::

:::key 행렬 로그
$R\in SO(3)$에서 $\hat\omega\theta$를 구한다($\theta\in[0,\pi]$).
- $R=I$: $\theta=0$, 축은 정해지지 않는다.
- $\operatorname{tr}R=-1$: $\theta=\pi$, $\hat\omega$는 $R+I$의 0이 아닌 열을 정규화한 것(예: $\hat\omega=\frac1{\sqrt{2(1+r_{33})}}(r_{13},r_{23},1+r_{33})$). $\pm\hat\omega$ 둘 다 답.
- 그 밖: $\theta=\cos^{-1}\dfrac{\operatorname{tr}R-1}2\in(0,\pi)$, $[\hat\omega]=\dfrac{R-R^T}{2\sin\theta}$.
:::

:::ex 예제 2
$R=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$의 지수 좌표는?
---
$\operatorname{tr}R=0$ → $\cos\theta=-\tfrac12$, $\theta=120°$. $R-R^T=\begin{bmatrix}0&-1&1\\1&0&-1\\-1&1&0\end{bmatrix}$, $2\sin\theta=\sqrt3$ → $\hat\omega=\tfrac1{\sqrt3}(1,1,1)$. 예제 1로 돌아왔습니다.
:::

:::warn $\theta=\pi$ 근처
$\sin\theta\to0$이라 $(R-R^T)/(2\sin\theta)$가 0/0에 가까워집니다. 수치 계산에서는 $\operatorname{tr}R$이 $-1$에 가까우면 둘째 경우의 공식으로 바꿉니다. $\theta$와 $2\pi-\theta$($-\hat\omega$ 둘레)가 같은 회전이라 지수 좌표는 $\lVert\hat\omega\theta\rVert\le\pi$인 공으로 모든 회전을 덮고, 경계($\theta=\pi$)에서는 두 점이 같은 회전입니다.
:::
` },
      { k: '3.2.3c', p: 88, title: 'SO(3)를 공으로 보기', body: R`
행렬 로그로 얻은 지수 좌표 $r=\hat\omega\theta$에서 $\theta\in[0,\pi]$로 정하면, 모든 회전은 $\mathbb R^3$의 **반지름 $\pi$인 공** 안의 한 점이 됩니다. 점의 방향이 회전축, 원점에서의 거리가 회전각입니다.

:::key SO(3)의 지수 좌표 공
$$SO(3)\ \leftrightarrow\ \{r\in\mathbb R^3:\lVert r\rVert\le\pi\},\qquad r=\hat\omega\theta,\quad R=e^{[r]}$$
- 원점 $r=0$: 항등 회전 $I$.
- 안쪽 $\lVert r\rVert\lt\pi$: 회전과 점이 일대일.
- 겉면 $\lVert r\rVert=\pi$: $r$과 $-r$이 같은 회전(반 바퀴는 어느 쪽으로 돌아도 같다).
:::

:::fig rSO3Ball
:::

이 그림으로 문제를 풀 때의 순서는 늘 같습니다. (1) 행렬 로그로 $\theta$와 $\hat\omega$를 구한다. (2) $r=\hat\omega\theta$를 공 안에 찍는다. (3) $\theta=\pi$이면 맞은편 점 $-r$도 같은 회전이므로 둘 중 하나라도 영역 안에 있는지 본다.

:::ex 예제 3
반지름 $\pi$인 공에서 $x,y,z$가 모두 0 이상인 팔분 공간 영역을 생각하자. (a) $R=\begin{bmatrix}0&1&0\\0&0&1\\1&0&0\end{bmatrix}$, (b) $R=\mathrm{Rot}(\hat z,\pi)$는 이 영역에 들어가는가?
---
(a) $\operatorname{tr}R=0$ → $\theta=2\pi/3$. $R-R^T=\begin{bmatrix}0&1&-1\\-1&0&1\\1&-1&0\end{bmatrix}$, $2\sin\theta=\sqrt3$ → $\hat\omega=-\tfrac1{\sqrt3}(1,1,1)$. $r=-\tfrac{2\pi}{3\sqrt3}(1,1,1)$: 세 성분이 모두 음수이고 $\lVert r\rVert\lt\pi$라 맞은편 점을 볼 필요도 없으니 **들어가지 않습니다**. (예제 1의 회전의 역회전입니다.)
(b) $\theta=\pi$, 축 $\pm\hat z$ → $r=(0,0,\pi)$와 $(0,0,-\pi)$가 같은 회전. 앞의 점이 영역(의 경계)에 있으므로 **들어갑니다**. 겉면에서는 맞은편 점을 꼭 확인하세요.
:::

:::idea 한 바퀴 돌기는 공을 가로지르는 길
$\hat z$ 둘레로 0에서 $2\pi$까지 돌리면, 점은 원점에서 북극 $(0,0,\pi)$까지 올라갔다가 남극 $(0,0,-\pi)$로 “순간 이동”(같은 회전이므로)한 뒤 원점으로 돌아옵니다. 이 고리는 연속적으로 줄여 한 점으로 만들 수 없지만, 두 바퀴 돈 고리는 줄일 수 있습니다. 2단원에서 말한 $SO(3)$와 $S^2\times S^1$의 위상 차이가 바로 이것입니다.
:::

:::note 오일러 각과 비교
오일러 각(7단원)도 세 수지만 특정 자세(짐벌 록)에서 두 각이 섞여 한 가지 회전에 무수히 많은 각이 대응합니다. 지수 좌표는 공의 안쪽 어디서도 그런 일이 없고 겉면에서만 두 점이 겹칩니다. 그래도 세 수로 된 표현이 $SO(3)$ 전체를 특이점 없이 덮을 수는 없다는 사실은 변하지 않습니다.
:::
` },
    ],
    problems: [
      { sec: '3.2.3a', type: 'num', lv: 2, q: R`$\hat\omega=\tfrac1{\sqrt3}(1,1,1)$, $\theta=120°$인 회전 행렬의 (1, 3) 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$R=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$.` },
      { sec: '3.2.3a', type: 'num', lv: 2, q: R`$\hat\omega=(0,\tfrac1{\sqrt2},\tfrac1{\sqrt2})$, $\theta=90°$인 회전 행렬의 (2, 2) 성분은?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$R=I+[\hat\omega]+[\hat\omega]^2$. $([\hat\omega]^2)_{22}=\omega_2^2-1=-\tfrac12$, $[\hat\omega]_{22}=0$ → $1-\tfrac12=\tfrac12$.` },
      { sec: '3.2.3a', type: 'mc', lv: 2, q: R`단위 벡터 $\hat\omega$에 대해 $[\hat\omega]^5$는?`,
        choices: [R`$0$`, R`$[\hat\omega]$`, R`$-[\hat\omega]$`, R`$[\hat\omega]^2$`], ans: 1,
        sol: R`$[\hat\omega]^3=-[\hat\omega]$ → $[\hat\omega]^5=[\hat\omega]^3[\hat\omega]^2=-[\hat\omega]^3=[\hat\omega]$.` },
      { sec: '3.2.3b', type: 'num', lv: 1, q: R`회전 행렬의 대각합이 2다. 회전각(rad)은?`, ans: 'pi/3', ansTex: R`\pi/3`,
        sol: R`$1+2\cos\theta=2$ → $\theta=\pi/3$.` },
      { sec: '3.2.3b', type: 'num', lv: 2, q: R`$R=\mathrm{Rot}(\hat y,\pi/2)$에 행렬 로그를 적용해 얻는 $\hat\omega$의 $y$ 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$\operatorname{tr}R=1$ → $\theta=\pi/2$. $(R-R^T)/2$에서 $[\hat\omega]_{13}=\omega_2=1$.` },
      { sec: '3.2.3b', type: 'mc', lv: 2, q: R`대각합이 $-1$인 회전 행렬에 대해 옳은 것은?`,
        choices: [R`회전이 없다`, R`$\theta=\pi$이고, 축 $\hat\omega$와 $-\hat\omega$가 모두 같은 회전을 준다`, R`$\theta=\pi/2$`, R`행렬 로그가 없다`], ans: 1,
        sol: R`$\cos\theta=-1$. 반 바퀴는 어느 쪽으로 돌아도 같습니다.` },
      { sec: '3.2.3b', type: 'num', lv: 2, q: R`$R=\mathrm{Rot}(\hat z,300°)$에 행렬 로그를 적용하면 $\theta\in[0,\pi]$와 $\hat\omega$가 나온다. $\hat\omega$의 $z$ 성분은?`, ans: '-1', ansTex: R`-1`,
        sol: R`300° 반시계 = 60° 시계: $\theta=\pi/3$, $\hat\omega=-\hat z$.` },
      { sec: '3.2.3a', type: 'open', lv: 2, proof: true, q: R`단위 벡터 $\hat\omega$에 대해 $[\hat\omega]^3=-[\hat\omega]$임을 보이고, 이를 이용해 행렬 지수의 급수에서 로드리게스 공식 $e^{[\hat\omega]\theta}=I+\sin\theta[\hat\omega]+(1-\cos\theta)[\hat\omega]^2$을 유도하세요.`,
        sol: R`
$[\hat\omega]^2x=\hat\omega\times(\hat\omega\times x)=\hat\omega(\hat\omega\cdot x)-x(\hat\omega\cdot\hat\omega)=(\hat\omega\hat\omega^T-I)x$.
$[\hat\omega]^3=[\hat\omega](\hat\omega\hat\omega^T-I)=(\hat\omega\times\hat\omega)\hat\omega^T-[\hat\omega]=-[\hat\omega]$.
따라서 $[\hat\omega]^{2k+1}=(-1)^k[\hat\omega]$, $[\hat\omega]^{2k+2}=(-1)^k[\hat\omega]^2$ ($k\ge0$).
$e^{[\hat\omega]\theta}=I+\displaystyle\sum_{k\ge0}\frac{\theta^{2k+1}}{(2k+1)!}(-1)^k[\hat\omega]+\sum_{k\ge0}\frac{\theta^{2k+2}}{(2k+2)!}(-1)^k[\hat\omega]^2$.
첫 급수는 $\sin\theta$, 둘째 급수는 $\dfrac{\theta^2}{2!}-\dfrac{\theta^4}{4!}+\cdots=1-\cos\theta$.`,
        rubric: R`
- $[\hat\omega]^2=\hat\omega\hat\omega^T-I$ — 3점
- $[\hat\omega]^3=-[\hat\omega]$와 거듭제곱의 규칙 — 3점
- 급수를 사인과 코사인으로 묶음 — 4점` },
      { sec: '3.2.3c', type: 'num', lv: 1, q: R`대각합이 0인 회전 행렬을 지수 좌표의 공에 찍었을 때, 원점에서의 거리는?`, ans: '2*pi/3', ansTex: R`2\pi/3`,
        sol: R`거리 = 회전각 $\theta$, $1+2\cos\theta=0$ → $2\pi/3$.` },
      { sec: '3.2.3c', type: 'mc', lv: 1, q: R`지수 좌표의 공에서 같은 회전을 나타내는 서로 다른 두 점의 쌍은?`,
        choices: [R`$(0,0,1)$과 $(0,0,-1)$`, R`$(0,0,\pi)$와 $(0,0,-\pi)$`, R`$(0,0,0)$과 $(0,0,\pi)$`, R`$(1,0,0)$과 $(0,1,0)$`], ans: 1,
        sol: R`겉면($\lVert r\rVert=\pi$)의 맞은편 두 점만 같은 회전입니다. $\pm1$ rad는 서로 역회전입니다.` },
      { sec: '3.2.3c', type: 'mc', lv: 2, q: R`$R=\begin{bmatrix}0&0&-1\\-1&0&0\\0&1&0\end{bmatrix}$의 지수 좌표 $r$은 공의 어느 쪽에 있는가?`,
        choices: [R`$x\gt0,\ y\gt0,\ z\gt0$`, R`$x\gt0,\ y\lt0,\ z\lt0$`, R`$x\lt0,\ y\gt0,\ z\gt0$`, R`겉면 위(같은 점이 둘)`], ans: 1,
        sol: R`$\operatorname{tr}R=0$ → $\theta=2\pi/3$. $\omega_1=(r_{32}-r_{23})/\sqrt3=1/\sqrt3$, $\omega_2=(r_{13}-r_{31})/\sqrt3=-1/\sqrt3$, $\omega_3=(r_{21}-r_{12})/\sqrt3=-1/\sqrt3$. $r=\tfrac{2\pi}{3\sqrt3}(1,-1,-1)$, $\lVert r\rVert\lt\pi$.` },
    ],
  });
})();
