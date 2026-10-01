/* 06 각속도와 회전의 지수 좌표 — MR 3.2.2–3.2.3 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 6, part: 'B', title: '각속도와 지수 좌표', en: 'Angular Velocity & Exponential Coordinates', ref: 'MR 3.2.2–3.2.3', plot: 'rbExp',
    fig: R`한 축 둘레로 도는 여러 점이 그리는 원. 회전은 축 방향 단위 벡터와 각, 곧 벡터 하나로 적힌다`,
    tagline: R`회전 행렬의 시간 미분은 반대칭 행렬 하나로 요약되고, 그것을 거꾸로 적분하면 행렬 지수가 됩니다. 방향을 벡터 셋으로 적는 가장 자연스러운 방법입니다.`,
    summary: R`회전 행렬 $R(t)$의 미분은 항상 $\dot R=[\omega_s]R$ 꼴입니다. 여기서 $[\omega]$는 $[\omega]x=\omega\times x$인 $3\times3$ **반대칭 행렬**이고, $\omega_s$는 고정 좌표계에서 잰 **각속도**, $\omega_b=R^T\omega_s$는 물체 좌표계에서 잰 각속도입니다($\dot RR^{-1}=[\omega_s]$, $R^{-1}\dot R=[\omega_b]$). 단위 축 $\hat\omega$ 둘레로 각 $\theta$만큼 도는 회전은 미분 방정식 $\dot p=[\hat\omega]p$의 해로 **행렬 지수** $e^{[\hat\omega]\theta}$이고, $[\hat\omega]^3=-[\hat\omega]$ 덕분에 급수가 닫힌 꼴 — **로드리게스 공식** $e^{[\hat\omega]\theta}=I+\sin\theta[\hat\omega]+(1-\cos\theta)[\hat\omega]^2$ — 이 됩니다. 세 수 $\hat\omega\theta\in\mathbb R^3$가 회전의 **지수 좌표**이고, 거꾸로 $R$에서 $\theta=\cos^{-1}\frac{\operatorname{tr}R-1}2$, $[\hat\omega]=\frac{R-R^T}{2\sin\theta}$로 되찾습니다(**행렬 로그**).`,
    goals: [
      R`벡터의 반대칭 행렬을 쓰고 $[\omega]x=\omega\times x$를 확인할 수 있다`,
      R`$\dot RR^{-1}$과 $R^{-1}\dot R$에서 고정·물체 좌표계의 각속도를 구할 수 있다`,
      R`로드리게스 공식을 유도하고 회전 행렬을 계산할 수 있다`,
      R`행렬 로그로 회전 행렬의 축과 각을 구하고 특수한 경우를 처리할 수 있다`,
      R`지수 좌표가 방향의 최소 표현임을 설명할 수 있다`,
    ],
    secTitles: { '3.2.2': '각속도', '3.2.3a': '행렬 지수와 로드리게스 공식', '3.2.3b': '행렬 로그' },
    sections: [
      { k: '3.2.2', p: 76, title: '각속도', body: R`
:::fig rAngVel
:::

물체가 순간적으로 단위 축 $\hat w$ 둘레로 $\dot\theta$의 비율로 돈다면 각속도는 $\omega=\hat w\dot\theta$입니다. 물체 축 $\hat x_b$의 끝은 $\dot{\hat x}_b=\omega\times\hat x_b$로 움직이고, 세 축을 모으면 $\dot R=[\omega\times\hat x_b\ \ \omega\times\hat y_b\ \ \omega\times\hat z_b]$.

:::key 반대칭 행렬
$$[x]=\begin{bmatrix}0&-x_3&x_2\\x_3&0&-x_1\\-x_2&x_1&0\end{bmatrix},\qquad[x]y=x\times y,\qquad[x]^T=-[x]$$
회전 행렬에 대해 $R[\omega]R^T=[R\omega]$.
:::

:::key 고정·물체 좌표계의 각속도
$$\dot RR^{-1}=[\omega_s],\qquad R^{-1}\dot R=[\omega_b],\qquad\omega_s=R\,\omega_b$$
$\omega_s$와 $\omega_b$는 같은 각속도를 {s}와 {b}의 좌표로 쓴 것이다. $\omega_b$는 움직이는 {b}의 “그 순간” 축에 대한 성분.
:::

:::ex 예제 1
$R(t)=\mathrm{Rot}(\hat z,t)\,\mathrm{Rot}(\hat x,2t)$이다. $\omega_s$와 $\omega_b$는?
---
$R=R_zR_x$에서 $\dot R=\dot R_zR_x+R_z\dot R_x$, $\dot R_z=[\hat z]R_z$, $\dot R_x=R_x[2\hat x]$(한 축 둘레 회전은 앞뒤 어느 쪽에 써도 같음).
$\dot RR^T=[\hat z]+R_z[2\hat x]R_z^T=[\hat z+2R_z\hat x]$ → $\omega_s=(2\cos t,\ 2\sin t,\ 1)$.
$R^T\dot R=R_x^T[\hat z]R_x+[2\hat x]=[R_x^T\hat z+2\hat x]$ → $\omega_b=(2,\ \sin2t,\ \cos2t)$.
크기는 둘 다 $\sqrt5$ — 좌표만 다를 뿐 같은 벡터입니다.
:::
` },
      { k: '3.2.3a', p: 79, title: '행렬 지수와 로드리게스 공식', body: R`
점 $p$가 단위 축 $\hat\omega$(원점을 지남) 둘레로 단위 각속도로 돌면 $\dot p=\hat\omega\times p=[\hat\omega]p$. 이 선형 미분 방정식의 해는 $p(\theta)=e^{[\hat\omega]\theta}p(0)$ — 행렬 지수 $e^{A}=I+A+A^2/2!+\cdots$입니다.

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

:::ex 예제 2
$\hat\omega=\tfrac1{\sqrt3}(1,1,1)$ 둘레로 $\theta=120°$ 돈 회전 행렬은?
---
$[\hat\omega]=\tfrac1{\sqrt3}\begin{bmatrix}0&-1&1\\1&0&-1\\-1&1&0\end{bmatrix}$, $[\hat\omega]^2=\tfrac13\mathbf 1\mathbf 1^T-I$. $\sin120°=\tfrac{\sqrt3}2$, $1-\cos120°=\tfrac32$.
$R=I+\tfrac12\begin{bmatrix}0&-1&1\\1&0&-1\\-1&1&0\end{bmatrix}+\begin{bmatrix}-1&\frac12&\frac12\\\frac12&-1&\frac12\\\frac12&\frac12&-1\end{bmatrix}=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$.
$\hat x\to\hat y\to\hat z\to\hat x$로 축을 돌려 세우는 회전 — 대각선 둘레 120°의 대칭과 맞습니다.
:::

:::tip 앞 단원과의 연결
$\mathrm{Rot}(\hat z,\theta)$에 $\hat\omega=\hat z$를 넣으면 로드리게스 공식이 5단원의 기본 회전 행렬을 그대로 줍니다. 로드리게스 공식은 임의의 축에 대한 일반화입니다.
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

:::ex 예제 3
$R=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$의 지수 좌표는?
---
$\operatorname{tr}R=0$ → $\cos\theta=-\tfrac12$, $\theta=120°$. $R-R^T=\begin{bmatrix}0&-1&1\\1&0&-1\\-1&1&0\end{bmatrix}$, $2\sin\theta=\sqrt3$ → $\hat\omega=\tfrac1{\sqrt3}(1,1,1)$. 예제 2로 돌아왔습니다.
:::

:::warn $\theta=\pi$ 근처
$\sin\theta\to0$이라 $(R-R^T)/(2\sin\theta)$가 0/0에 가까워집니다. 수치 계산에서는 $\operatorname{tr}R$이 $-1$에 가까우면 둘째 경우의 공식으로 바꿉니다. $\theta$와 $2\pi-\theta$($-\hat\omega$ 둘레)가 같은 회전이라 지수 좌표는 $\lVert\hat\omega\theta\rVert\le\pi$인 공으로 모든 회전을 덮고, 경계($\theta=\pi$)에서는 두 점이 같은 회전입니다.
:::
` },
    ],
    problems: [
      { sec: '3.2.2', type: 'num', lv: 1, q: R`$\omega=(1,2,3)$의 반대칭 행렬 $[\omega]$의 (1, 2) 성분은?`, ans: '-3', ansTex: R`-3`,
        sol: R`$[\omega]_{12}=-\omega_3$.` },
      { sec: '3.2.2', type: 'num', lv: 1, q: R`$R(t)=\mathrm{Rot}(\hat z,3t)$일 때 $\omega_s$의 $z$ 성분은?`, ans: '3', ansTex: R`3`,
        sol: R`$\dot RR^T=3[\hat z]$.` },
      { sec: '3.2.2', type: 'num', lv: 2, q: R`$R(t)=\mathrm{Rot}(\hat z,t)\mathrm{Rot}(\hat x,2t)$의 각속도 크기는?`, ans: 'sqrt(5)', ansTex: R`\sqrt5`,
        sol: R`$\omega_s=(2\cos t,2\sin t,1)$, 크기 $\sqrt5$.` },
      { sec: '3.2.2', type: 'num', lv: 2, q: R`같은 $R(t)$에서 $t=\pi/4$일 때 $\omega_b$의 $y$ 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$\omega_b=(2,\sin2t,\cos2t)$ → $\sin(\pi/2)=1$.` },
      { sec: '3.2.2', type: 'mc', lv: 1, q: R`고정 좌표계와 물체 좌표계의 각속도 사이의 관계는?`,
        choices: [R`$\omega_s=\omega_b$`, R`$\omega_s=R\omega_b$`, R`$\omega_b=R\omega_s$`, R`$\omega_s=-\omega_b$`], ans: 1,
        sol: R`같은 벡터를 {b} 좌표에서 {s} 좌표로 바꾸는 것: $\omega_s=R_{sb}\omega_b$.` },
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
    ],
  });
})();
