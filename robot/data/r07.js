/* 07 오일러 각과 롤-피치-요 — MR 부록 B.1–B.2 · 강의 자료 Week 4(9월 30일: 오일러 각과 롤-피치-요) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 7, part: 'A', title: '오일러 각과 롤-피치-요', en: 'Euler Angles & Roll–Pitch–Yaw', ref: 'MR 부록 B.1–B.2', plot: 'rbGimbal',
    fig: R`세 짐벌 고리가 차례로 기울어지는 모습. 가운데 각이 90°가 되면 바깥 고리와 안쪽 고리의 축이 겹친다`,
    tagline: R`방향의 자유도는 3이므로 세 각이면 됩니다. 카메라 짐벌의 세 관절 각이 그대로 오일러 각이고, 같은 행렬을 고정 축으로 거꾸로 읽으면 롤-피치-요입니다. 단, 가운데 각이 ±90°인 자세에서 표현이 망가집니다.`,
    summary: R`세 회전 관절을 직교하게 이은 짐벌(관절 1: $\hat z$, 2: $\hat y$, 3: $\hat x$)의 관절 각 $(\alpha,\beta,\gamma)$가 **ZYX 오일러 각**입니다: $R=\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\gamma)$. 이것은 물체를 **물체 축**(움직이는 축) $\hat z_b\to\hat y_b\to\hat x_b$ 순서로 돌린 결과이고, 같은 곱을 오른쪽부터 읽으면 **고정 축** $\hat x\to\hat y\to\hat z$ 둘레의 회전, 곧 **XYZ 롤-피치-요**입니다. 역문제는 셋째 행에서 시작합니다: $\cos\beta\ne0$이면 $\beta=\operatorname{atan2}(-r_{31},\pm\sqrt{r_{11}^2+r_{21}^2})$, $\alpha=\operatorname{atan2}(r_{21},r_{11})$, $\gamma=\operatorname{atan2}(r_{32},r_{33})$ (부호를 고르면 해가 둘). $\beta=\pm90°$이면 1번과 3번 축이 겹쳐 $\alpha\mp\gamma$만 정해지는 **짐벌 록**(특이점)이 됩니다. 축 1 ⊥ 축 2, 축 2 ⊥ 축 3이기만 하면 ZYZ·ZXZ 같은 다른 순서도 오일러 각이 되며, 어느 것이든 특이점이 있습니다 — 세 수로 $SO(3)$ 전체를 특이점 없이 덮는 방법은 없습니다.`,
    goals: [
      R`짐벌의 관절 각으로 ZYX 오일러 각을 정의하고 회전 행렬 (B.1)을 쓸 수 있다`,
      R`회전 행렬에서 atan2로 오일러 각의 두 해를 구할 수 있다`,
      R`짐벌 록이 생기는 자세와 그때 정해지는 각의 조합을 설명할 수 있다`,
      R`앞곱·뒷곱 규칙으로 ZYX 오일러 각과 XYZ 롤-피치-요가 같은 행렬임을 보일 수 있다`,
      R`ZYZ, ZXZ 오일러 각의 공식을 유도하고 역문제를 풀 수 있다`,
    ],
    secTitles: { 'B.1a': 'ZYX 오일러 각', 'B.1b': '역문제와 짐벌 록', 'B.2': '롤-피치-요', 'B.1c': 'ZYZ·ZXZ' },
    sections: [
      { k: 'B.1a', p: 575, src: '강의 자료 · Week 4', title: 'ZYX 오일러 각과 카메라 짐벌', body: R`
회전 행렬은 9개의 수에 6개의 구속이 있어 자유도가 3입니다(6단원). 그렇다면 **세 개의 각**으로 모든 방향을 적을 수 있지 않을까요? 가장 구체적인 답이 카메라 짐벌입니다.

:::fig rGimbal
:::

짐벌은 회전 관절 세 개를 이은 손목입니다. 바닥에 고정된 {0}과 세 링크에 붙인 {1}, {2}, {3}이 영 자세에서 모두 겹치게 놓고, 관절 1은 $\hat z_0$ 둘레로 $\alpha$, 관절 2는 $\hat y_1$ 둘레로 $\beta$, 관절 3은 $\hat x_2$ 둘레로 $\gamma$만큼 돈다고 합시다. 각 관절은 바로 앞 좌표계에서 본 기본 회전이므로 $R_{01}=\mathrm{Rot}(\hat z,\alpha)$, $R_{12}=\mathrm{Rot}(\hat y,\beta)$, $R_{23}=\mathrm{Rot}(\hat x,\gamma)$이고, 아래첨자 지우기로 곱하면 카메라의 방향이 나옵니다.

:::key ZYX 오일러 각
$$R(\alpha,\beta,\gamma)=\mathrm{Rot}(\hat z,\alpha)\,\mathrm{Rot}(\hat y,\beta)\,\mathrm{Rot}(\hat x,\gamma)=\begin{bmatrix}c_\alpha c_\beta&c_\alpha s_\beta s_\gamma-s_\alpha c_\gamma&c_\alpha s_\beta c_\gamma+s_\alpha s_\gamma\\s_\alpha c_\beta&s_\alpha s_\beta s_\gamma+c_\alpha c_\gamma&s_\alpha s_\beta c_\gamma-c_\alpha s_\gamma\\-s_\beta&c_\beta s_\gamma&c_\beta c_\gamma\end{bmatrix}$$
($c_\alpha=\cos\alpha$, $s_\alpha=\sin\alpha$ …) 물체를 **물체 축** $\hat z_b$ → 새 $\hat y_b$ → 새 $\hat x_b$ 순서로 돌린 결과와 같다.
:::

:::idea 한눈에: 책 모서리로 따라 하기
책의 한 모서리를 {b}로 삼고 (1) 책 표지에 수직인 $\hat z_b$ 둘레로 $\alpha$, (2) 돌아간 책의 $\hat y_b$ 둘레로 $\beta$, (3) 다시 돌아간 책의 $\hat x_b$ 둘레로 $\gamma$를 돌려 보세요. 매번 **책에 붙은 축**으로 돌리므로 뒷곱이 쌓여 $R=I\cdot R_z(\alpha)R_y(\beta)R_x(\gamma)$가 됩니다. 순서를 바꾸면 다른 자세가 됩니다.
:::

:::ex 예제 1
$(\alpha,\beta,\gamma)=(90°,0,90°)$일 때 $R$과, 카메라의 $\hat x_3$ 축이 가리키는 방향은?
---
$c_\beta=1$, $s_\beta=0$이므로 (B.1)은 $\begin{bmatrix}c_\alpha&-s_\alpha c_\gamma&s_\alpha s_\gamma\\s_\alpha&c_\alpha c_\gamma&-c_\alpha s_\gamma\\0&s_\gamma&c_\gamma\end{bmatrix}=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$.
첫 열 $(0,1,0)$: 카메라의 $\hat x_3$은 $\hat y_0$ 방향. 10단원 예제 1에서 같은 행렬이 축 $\tfrac1{\sqrt3}(1,1,1)$ 둘레의 120° 회전으로 나옵니다 — 같은 방향을 오일러 각 셋으로도, 지수 좌표 셋으로도 적을 수 있습니다.
:::

:::ex 예제 2 — 카메라를 한 방향으로 겨누기
렌즈가 $\hat x_3$ 방향인 ZYX 짐벌로 방향 $d=(1,1,\sqrt2)$(정규화 전)을 겨누려면 $\alpha,\beta$를 얼마로 해야 하는가?
---
렌즈 방향은 $R$의 첫 열 $(c_\alpha c_\beta,\ s_\alpha c_\beta,\ -s_\beta)$이고, $\gamma$(렌즈 축 둘레 회전)와 무관합니다. $d/\lVert d\rVert=(\tfrac12,\tfrac12,\tfrac{\sqrt2}2)$와 같게 놓으면 $\sin\beta=-\tfrac{\sqrt2}2$, $\cos\beta\gt0$을 고르면 $\beta=-45°$, $\alpha=\operatorname{atan2}(\tfrac12,\tfrac12)=45°$.
일반적으로 $\alpha=\operatorname{atan2}(d_y,d_x)$(수평 방위), $\beta=\operatorname{atan2}(-d_z,\sqrt{d_x^2+d_y^2})$(내려 보는 각). $\hat y$ 둘레의 양의 회전은 $\hat x$를 아래로($-\hat z$) 기울이므로, 위를 보려면 $\beta\lt0$입니다.
:::

:::sim gimbal zyx
세 막대로 $\alpha,\beta,\gamma$를 바꾸면 짐벌의 세 고리와 카메라가 돌고, 아래에 (B.1)로 계산한 $R$이 나옵니다. $\beta$를 90°로 두고 $\alpha$와 $\gamma$를 움직여 보세요 — 다음 절의 짐벌 록입니다.
:::
` },
      { k: 'B.1b', p: 576, src: '강의 자료 · Week 4', title: '역문제: 회전 행렬에서 오일러 각으로, 그리고 짐벌 록', body: R`
정문제(각 → 행렬)는 언제나 됩니다. 거꾸로 임의의 $R\in SO(3)$에 대해 (B.1)을 만족하는 $(\alpha,\beta,\gamma)$가 있을까요? (B.1)에서 가장 단순한 것은 셋째 행과 첫째 열입니다.
$$r_{31}=-s_\beta,\quad r_{32}=c_\beta s_\gamma,\quad r_{33}=c_\beta c_\gamma,\qquad r_{11}=c_\alpha c_\beta,\quad r_{21}=s_\alpha c_\beta.$$
$r_{11}^2+r_{21}^2=c_\beta^2$이므로 $\cos\beta=\pm\sqrt{r_{11}^2+r_{21}^2}$, 그리고 $\cos\beta\ne0$이면 나머지 두 각은 $\cos\beta$로 나누어 읽습니다.

:::key ZYX 오일러 각 구하기 (atan2)
$r_{31}\ne\pm1$일 때 (MR 알고리즘 B.1.1)
$$\beta=\operatorname{atan2}\!\big(-r_{31},\ \sqrt{r_{11}^2+r_{21}^2}\big),\qquad\alpha=\operatorname{atan2}(r_{21},r_{11}),\qquad\gamma=\operatorname{atan2}(r_{32},r_{33})$$
이때 $\beta\in(-90°,90°)$. 제곱근에 음의 부호를 고르면 둘째 해 $(\alpha\pm180°,\ 180°-\beta,\ \gamma\pm180°)$가 나온다.
:::

:::warn tan⁻¹이 아니라 atan2
$\alpha=\tan^{-1}(r_{21}/r_{11})$로 쓰면 $(r_{21},r_{11})$과 $(-r_{21},-r_{11})$을 구별하지 못해 사분면을 잃습니다. $\operatorname{atan2}(y,x)$는 점 $(x,y)$의 각을 $(-\pi,\pi]$에서 돌려줍니다. 시험 답안에서도 atan2로 쓰고, 분모의 부호를 따진 근거를 적으세요.
:::

:::ex 예제 3
$R=\begin{bmatrix}0&-1&0\\\tfrac1{\sqrt2}&0&\tfrac1{\sqrt2}\\-\tfrac1{\sqrt2}&0&\tfrac1{\sqrt2}\end{bmatrix}$의 ZYX 오일러 각을 모두 구하라.
---
$r_{31}=-\tfrac1{\sqrt2}\ne\pm1$. $\sqrt{r_{11}^2+r_{21}^2}=\tfrac1{\sqrt2}$.
첫째 해: $\beta=\operatorname{atan2}(\tfrac1{\sqrt2},\tfrac1{\sqrt2})=45°$, $\alpha=\operatorname{atan2}(\tfrac1{\sqrt2},0)=90°$, $\gamma=\operatorname{atan2}(0,\tfrac1{\sqrt2})=0$.
둘째 해: $\cos\beta=-\tfrac1{\sqrt2}$ → $\beta=135°$, $\alpha=\operatorname{atan2}(-\tfrac1{\sqrt2},0)=-90°$, $\gamma=\operatorname{atan2}(0,-\tfrac1{\sqrt2})=180°$.
확인: $\mathrm{Rot}(\hat z,90°)\mathrm{Rot}(\hat y,45°)$와 $\mathrm{Rot}(\hat z,-90°)\mathrm{Rot}(\hat y,135°)\mathrm{Rot}(\hat x,180°)$는 같은 행렬입니다.
:::

### 짐벌 록
$r_{31}=\mp1$이면 $\cos\beta=0$, 곧 $\beta=\pm90°$이고 위의 나눗셈을 할 수 없습니다. $\beta=90°$를 (B.1)에 넣으면
$$R=\begin{bmatrix}0&\sin(\gamma-\alpha)&\cos(\gamma-\alpha)\\0&\cos(\gamma-\alpha)&-\sin(\gamma-\alpha)\\-1&0&0\end{bmatrix}$$
— $\alpha$와 $\gamma$가 차 $\gamma-\alpha$로만 나타납니다. 그림으로 보면 관절 2가 90° 돌아 관절 3의 축이 관절 1의 축과 **나란히 겹친** 자세라, 두 관절이 같은 축 둘레의 회전을 반대 방향으로 할 뿐입니다.

:::key 짐벌 록 (오일러 각의 특이점)
- $\beta=+90°$ ($r_{31}=-1$): $\gamma-\alpha$만 정해진다. 한 가지 해: $\alpha=0$, $\gamma=\operatorname{atan2}(r_{12},r_{22})$.
- $\beta=-90°$ ($r_{31}=+1$): $\gamma+\alpha$만 정해진다. 한 가지 해: $\alpha=0$, $\gamma=-\operatorname{atan2}(r_{12},r_{22})$.
- 해가 하나의 매개변수만큼 무수히 많다. 특이점은 $SO(3)$이 아니라 세 각이라는 **표현**의 성질이다.
:::

:::ex 예제 4
$R=\begin{bmatrix}0&\tfrac12&\tfrac{\sqrt3}2\\0&\tfrac{\sqrt3}2&-\tfrac12\\-1&0&0\end{bmatrix}$의 ZYX 오일러 각은?
---
$r_{31}=-1$ → $\beta=90°$, 짐벌 록. $\sin(\gamma-\alpha)=r_{12}=\tfrac12$, $\cos(\gamma-\alpha)=r_{22}=\tfrac{\sqrt3}2$ → $\gamma-\alpha=30°$. 예를 들어 $(0,90°,30°)$, $(30°,90°,60°)$, $(-45°,90°,-15°)$가 모두 답입니다.
:::

:::idea 짐벌은 모든 방향에 갈 수 있는가
역문제가 언제나 풀리므로(짐벌 록에서도 해가 있음) 관절 범위 제한만 없다면 세 관절 짐벌은 모든 방향을 만들 수 있습니다. 하지만 $\beta=\pm90°$ 근처에서는 작은 방향 변화에도 $\alpha,\gamma$가 크게 바뀌어야 하고, 그 자세에서는 한 방향으로 순간적으로 돌 수 없습니다(속도의 자유도가 하나 줄어듦). 15단원의 특이점과 같은 현상입니다.
:::
` },
      { k: 'B.2', p: 580, src: '강의 자료 · Week 4', title: '롤-피치-요: 같은 행렬을 고정 축으로 읽기', body: R`
6단원의 규칙을 떠올립시다: **앞에 곱하면 고정 축, 뒤에 곱하면 물체 축** 둘레의 회전입니다. 그러면 $R=\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\gamma)\cdot I$를 오른쪽부터, 고정 축으로 읽을 수도 있습니다: $I$에서 출발해 고정 $\hat x$ 둘레로 $\gamma$, 고정 $\hat y$ 둘레로 $\beta$, 고정 $\hat z$ 둘레로 $\alpha$.

:::key XYZ 롤-피치-요 = ZYX 오일러 각
$$\underbrace{\mathrm{Rot}(\hat z,\alpha)\,\mathrm{Rot}(\hat y,\beta)\,\mathrm{Rot}(\hat x,\gamma)}_{\text{고정 축: }\hat x\text{로 }\gamma\ \to\ \hat y\text{로 }\beta\ \to\ \hat z\text{로 }\alpha}\;=\;\underbrace{\mathrm{Rot}(\hat z,\alpha)\,\mathrm{Rot}(\hat y,\beta)\,\mathrm{Rot}(\hat x,\gamma)}_{\text{물체 축: }\hat z_b\text{로 }\alpha\ \to\ \hat y_b\text{로 }\beta\ \to\ \hat x_b\text{로 }\gamma}$$
$\gamma$: 롤(roll, $\hat x$ 둘레), $\beta$: 피치(pitch, $\hat y$ 둘레), $\alpha$: 요(yaw, $\hat z$ 둘레). **순서를 거꾸로 하고 고정 ↔ 물체를 바꾸면 같은 곱**이 된다.
:::

:::fig rRPY
:::

비행기에서는 보통 $\hat x$를 기수 방향, $\hat y$를 오른쪽 날개, $\hat z$를 아래(땅 쪽)로 잡고, 기체를 기수 축 둘레로 기울이는 것을 롤, 날개 축 둘레로 기수를 드는 것을 피치, 수직 축 둘레로 방향을 트는 것을 요라 부릅니다. 축을 어떻게 잡든 계산은 위의 곱 하나입니다.

:::ex 예제 5 — 고정 축과 물체 축의 차이
(a) 고정 $\hat x$ 둘레로 90°, 이어서 고정 $\hat y$ 둘레로 90° 돌린 결과와 (b) 물체 $\hat x_b$ 둘레로 90°, 이어서 (돌아간) 물체 $\hat y_b$ 둘레로 90° 돌린 결과를 구하라.
---
(a) 고정 축이므로 나중 회전을 왼쪽에: $R_a=\mathrm{Rot}(\hat y,90°)\mathrm{Rot}(\hat x,90°)=\begin{bmatrix}0&1&0\\0&0&-1\\-1&0&0\end{bmatrix}$.
(b) 물체 축이므로 오른쪽에: $R_b=\mathrm{Rot}(\hat x,90°)\mathrm{Rot}(\hat y,90°)=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$.
두 결과가 다릅니다. 그런데 (a)의 곱은 “물체 $\hat y_b$로 90° 다음 물체 $\hat x_b$로 90°”와 같습니다 — 순서를 거꾸로 하고 고정 ↔ 물체를 바꾼 것입니다.
:::

:::tip 시험에서 자주 나오는 꼴
“{0}의 $\hat x$ 축 둘레로 … 다음 {0}의 $\hat y$ 축 둘레로 … 다음 **{3}의** $\hat z$ 축 둘레로 …”처럼 고정 축과 물체 축이 섞이면, 각 단계마다 왼쪽(고정) 또는 오른쪽(물체)에 붙이면 됩니다: $R_{04}=\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\alpha)\cdot\mathrm{Rot}(\hat z,\gamma)$. 과제 풀이 탭의 Problem Set #3 둘째 문제(교재 연습문제 3.15)가 바로 이것입니다.
:::
` },
      { k: 'B.1c', p: 578, title: '다른 오일러 각: ZYZ와 ZXZ', body: R`
짐벌의 영 자세를 다르게 잡으면 다른 세 각이 나옵니다. 예를 들어 관절 3의 축을 $\hat z$와 나란하게 두면 **ZYZ 오일러 각**입니다. 중요한 것은 축의 순서가 아니라 직교 조건입니다.

:::key ZYZ·ZXZ 오일러 각
축 1 ⊥ 축 2, 축 2 ⊥ 축 3이면 $\mathrm{Rot}(\text{축 1},\alpha)\mathrm{Rot}(\text{축 2},\beta)\mathrm{Rot}(\text{축 3},\gamma)$는 $SO(3)$의 세 매개변수 표현이다(축 1과 3은 같아도 된다). $\alpha,\gamma$는 $2\pi$, $\beta$는 길이 $\pi$인 구간을 움직인다.
$$\text{ZYZ: }R=\begin{bmatrix}c_\alpha c_\beta c_\gamma-s_\alpha s_\gamma&-c_\alpha c_\beta s_\gamma-s_\alpha c_\gamma&c_\alpha s_\beta\\s_\alpha c_\beta c_\gamma+c_\alpha s_\gamma&-s_\alpha c_\beta s_\gamma+c_\alpha c_\gamma&s_\alpha s_\beta\\-s_\beta c_\gamma&s_\beta s_\gamma&c_\beta\end{bmatrix}$$
역문제($0\lt\beta\lt\pi$): $\beta=\operatorname{atan2}(\sqrt{r_{31}^2+r_{32}^2},\,r_{33})$, $\alpha=\operatorname{atan2}(r_{23},r_{13})$, $\gamma=\operatorname{atan2}(r_{32},-r_{31})$. 특이점은 $\beta=0,\pi$.
:::

ZYZ에서는 $r_{33}=\cos\beta$ 하나로 $\beta$가 정해지고, 셋째 열과 셋째 행이 각각 $\alpha$와 $\gamma$를 줍니다. 특이점은 $\sin\beta=0$, 곧 첫째 축과 셋째 축이 겹치는 $\beta=0$(또는 $\pi$)입니다 — 영 자세 자체가 특이점이라는 점이 ZYX와 다릅니다.

:::ex 예제 6
$R=\begin{bmatrix}0.625&-0.2165&0.75\\-0.2165&0.875&0.4330\\-0.75&-0.4330&0.5\end{bmatrix}$의 ZYZ 오일러 각($0\lt\beta\lt\pi$)은?
---
$r_{33}=0.5$, $\sqrt{r_{31}^2+r_{32}^2}=\sqrt{0.5625+0.1875}=0.866$ → $\beta=60°$.
$\alpha=\operatorname{atan2}(0.4330,0.75)=30°$, $\gamma=\operatorname{atan2}(-0.4330,0.75)=-30°$. 확인: $\mathrm{Rot}(\hat z,30°)\mathrm{Rot}(\hat y,60°)\mathrm{Rot}(\hat z,-30°)$이 위 행렬입니다.
:::

**ZXZ**는 가운데 축이 $\hat x$인 경우로, 셋째 열 $(s_\alpha s_\beta,\,-c_\alpha s_\beta,\,c_\beta)$와 셋째 행 $(s_\beta s_\gamma,\,s_\beta c_\gamma,\,c_\beta)$에서 $\beta=\operatorname{atan2}(\sqrt{r_{13}^2+r_{23}^2},r_{33})$, $\alpha=\operatorname{atan2}(r_{13},-r_{23})$, $\gamma=\operatorname{atan2}(r_{31},r_{32})$를 얻습니다. 유도는 과제 풀이 탭의 Problem Set #3 다섯째 문제(교재 연습문제 3.36)에 있습니다. 2025년 중간고사의 카메라 짐벌(관절 축이 $\hat z$, $\hat x$, $\hat z$)도 ZXZ입니다.

:::warn 세 수로는 특이점을 피할 수 없다
어떤 순서의 오일러 각이든, 롤-피치-요든, 지수 좌표(10단원)든 세 수로 $SO(3)$ 전체를 매끄럽게 덮을 수는 없습니다. $SO(3)$이 평평한 $\mathbb R^3$과 위상이 다르기 때문입니다(2단원). 그래서 계산에서는 회전 행렬(9개 수, 6개 구속)이나 단위 사원수(4개 수, 1개 구속)를 쓰고, 사람에게 보여 줄 때만 세 각으로 바꿉니다.
:::
` },
    ],
    problems: [
      { sec: 'B.1a', type: 'num', lv: 1, q: R`ZYX 오일러 각 $(\alpha,\beta,\gamma)=(30°,45°,60°)$일 때 회전 행렬의 (3, 1) 성분은?`, ans: '-sqrt(2)/2', ansTex: R`-0.707`,
        sol: R`셋째 행 첫 성분은 $-\sin\beta=-\sin45°$.` },
      { sec: 'B.1a', type: 'num', lv: 1, q: R`같은 각에서 (3, 3) 성분은?`, ans: 'cos(pi/4)*cos(pi/3)', ansTex: R`0.354`,
        sol: R`$\cos\beta\cos\gamma=\tfrac{\sqrt2}2\cdot\tfrac12$.` },
      { sec: 'B.1a', type: 'mc', lv: 1, q: R`ZYX 짐벌에서 셋째 관절 각 $\gamma$를 바꾸어도 변하지 않는 것은?`,
        choices: [R`$R$의 첫째 열(카메라의 $\hat x_3$ 방향)`, R`$R$의 둘째 열`, R`$R$의 셋째 열`, R`$R$의 셋째 행`], ans: 0,
        sol: R`$\mathrm{Rot}(\hat x,\gamma)$는 $\hat x$를 바꾸지 않으므로 첫 열 $R_zR_y\hat x$는 $\gamma$와 무관합니다. 렌즈를 $\hat x_3$으로 두면 $\gamma$는 렌즈 축 둘레의 회전입니다.` },
      { sec: 'B.1a', type: 'num', lv: 2, q: R`렌즈가 $\hat x_3$인 ZYX 짐벌로 방향 $(0,1,-1)$(정규화 전)을 겨눈다. $\cos\beta\gt0$인 해의 $\beta$(rad)는?`, ans: 'pi/4', ansTex: R`\pi/4`,
        sol: R`첫 열 $(c_\alpha c_\beta,s_\alpha c_\beta,-s_\beta)=\tfrac1{\sqrt2}(0,1,-1)$ → $\sin\beta=\tfrac1{\sqrt2}$, $\beta=\pi/4$(아래를 봄), $\alpha=\pi/2$.` },
      { sec: 'B.1b', type: 'num', lv: 2, q: R`예제 3의 $R$에서 $\beta\in(90°,270°)$인 둘째 해의 $\beta$(도)는?`, ans: '135', ansTex: R`135`,
        sol: R`$\cos\beta=-\tfrac1{\sqrt2}$, $\sin\beta=\tfrac1{\sqrt2}$ → $135°$.` },
      { sec: 'B.1b', type: 'num', lv: 2, q: R`$R=\begin{bmatrix}0.6124&0.2803&0.7392\\0.3536&0.7392&-0.5732\\-0.7071&0.6124&0.3536\end{bmatrix}$의 ZYX 오일러 각 중 $\cos\beta\gt0$인 해의 $\gamma$(도)는?`, ans: '60', ansTex: R`60`,
        sol: R`$\gamma=\operatorname{atan2}(r_{32},r_{33})=\operatorname{atan2}(0.6124,0.3536)=60°$. ($\beta=45°$, $\alpha=30°$)` },
      { sec: 'B.1b', type: 'mc', lv: 1, q: R`$\alpha=\tan^{-1}(r_{21}/r_{11})$ 대신 $\operatorname{atan2}(r_{21},r_{11})$를 쓰는 이유는?`,
        choices: [R`계산이 빨라서`, R`분자와 분모의 부호로 사분면을 구별하기 위해`, R`$r_{11}=0$이면 atan2도 정의되지 않으므로 같다`, R`라디안으로 답하기 위해`], ans: 1,
        sol: R`$(r_{21},r_{11})$과 $(-r_{21},-r_{11})$은 비가 같지만 각이 180° 다릅니다. atan2는 둘을 구별하고 $r_{11}=0$에서도 정의됩니다.` },
      { sec: 'B.1b', type: 'mc', lv: 1, q: R`ZYX 오일러 각에서 짐벌 록이 생기는 조건은?`,
        choices: [R`$\alpha=\pm90°$`, R`$\beta=\pm90°$`, R`$\gamma=\pm90°$`, R`$\alpha=\gamma$`], ans: 1,
        sol: R`$\cos\beta=0$이면 관절 3의 축이 관절 1의 축과 겹쳐 $\alpha$와 $\gamma$를 따로 정할 수 없습니다.` },
      { sec: 'B.1b', type: 'num', lv: 2, q: R`예제 4($\beta=90°$)의 회전에서 $\alpha=50°$로 고르면 $\gamma$(도)는?`, ans: '80', ansTex: R`80`,
        sol: R`$\gamma-\alpha=30°$만 정해지므로 $\gamma=80°$.` },
      { sec: 'B.2', type: 'mc', lv: 2, q: R`물체를 고정 $\hat x$ 둘레로 $\gamma$, 고정 $\hat y$ 둘레로 $\beta$, 고정 $\hat z$ 둘레로 $\alpha$ 차례로 돌렸다. 결과는?`,
        choices: [R`$\mathrm{Rot}(\hat x,\gamma)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat z,\alpha)$`, R`$\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\gamma)$`, R`$\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat x,\gamma)$`, R`순서와 무관하게 같다`], ans: 1,
        sol: R`고정 축 회전은 왼쪽에 쌓입니다: 마지막 $\mathrm{Rot}(\hat z,\alpha)$가 맨 왼쪽. ZYX 오일러 각과 같은 행렬입니다.`, quiz: 'ps3-p2' },
      { sec: 'B.2', type: 'num', lv: 2, q: R`고정 $\hat x$ 둘레로 90°, 이어서 물체 $\hat z_b$ 둘레로 90° 돌린 결과의 (3, 1) 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$R=\mathrm{Rot}(\hat x,90°)\mathrm{Rot}(\hat z,90°)=\begin{bmatrix}0&-1&0\\0&0&-1\\1&0&0\end{bmatrix}$ — 첫 회전 뒤의 물체 축 회전은 오른쪽에 붙습니다. 순서를 바꾼 $\mathrm{Rot}(\hat z,90°)\mathrm{Rot}(\hat x,90°)$에서는 (3, 1) 성분이 0입니다.` },
      { sec: 'B.1c', type: 'num', lv: 2, q: R`ZYZ 오일러 각에서 $r_{33}=0.5$이고 $0\lt\beta\lt\pi$이다. $\beta$(rad)는?`, ans: 'pi/3', ansTex: R`\pi/3`,
        sol: R`$r_{33}=\cos\beta$.` },
      { sec: 'B.1c', type: 'mc', lv: 2, q: R`다음 중 오일러 각(세 회전의 곱)으로 $SO(3)$ 전체를 나타낼 수 **없는** 축 순서는?`,
        choices: [R`ZYZ`, R`ZXZ`, R`XYX`, R`ZZX`], ans: 3,
        sol: R`축 1과 축 2가 같으면(ZZ) 두 회전이 합쳐져 사실상 매개변수가 둘뿐입니다. 축 1 ⊥ 축 2, 축 2 ⊥ 축 3이어야 합니다.` },
      { sec: 'B.1c', type: 'num', lv: 3, q: R`ZXZ 오일러 각 $R=\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat x,\beta)\mathrm{Rot}(\hat z,\gamma)$에서 $R=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$이고 $0\lt\beta\lt\pi$이다. $\alpha$(도)는?`, ans: '90', ansTex: R`90`,
        sol: R`$\beta=\operatorname{atan2}(\sqrt{1+0},0)=90°$, $\alpha=\operatorname{atan2}(r_{13},-r_{23})=\operatorname{atan2}(1,0)=90°$, $\gamma=\operatorname{atan2}(r_{31},r_{32})=\operatorname{atan2}(0,1)=0$.`, quiz: 'ps3-p5' },
      { sec: 'B.1b', type: 'open', lv: 2, proof: true, q: R`ZYX 오일러 각의 회전 행렬 (B.1)에서 출발해 (a) $r_{31}\ne\pm1$일 때 두 해의 공식을 유도하고, (b) $\beta=90°$이면 $\alpha$와 $\gamma$가 $\gamma-\alpha$로만 나타남을 보이고 그 기하학적 이유를 설명하세요.`,
        sol: R`
(a) 셋째 행 $(-s_\beta,c_\beta s_\gamma,c_\beta c_\gamma)$, 첫째 열 $(c_\alpha c_\beta,s_\alpha c_\beta,-s_\beta)$. $r_{11}^2+r_{21}^2=c_\beta^2$이므로 $c_\beta=\pm\sqrt{r_{11}^2+r_{21}^2}\ne0$. $\beta=\operatorname{atan2}(-r_{31},c_\beta)$. $c_\beta$로 나누면 $(\cos\alpha,\sin\alpha)\propto(r_{11},r_{21})/c_\beta$, $(\cos\gamma,\sin\gamma)\propto(r_{33},r_{32})/c_\beta$ → $c_\beta\gt0$이면 $\alpha=\operatorname{atan2}(r_{21},r_{11})$, $\gamma=\operatorname{atan2}(r_{32},r_{33})$; $c_\beta\lt0$이면 두 인자의 부호를 모두 바꿈.
(b) $s_\beta=1$, $c_\beta=0$을 넣으면 $r_{12}=c_\alpha s_\gamma-s_\alpha c_\gamma=\sin(\gamma-\alpha)$, $r_{22}=s_\alpha s_\gamma+c_\alpha c_\gamma=\cos(\gamma-\alpha)$, $r_{13}=\cos(\gamma-\alpha)$, $r_{23}=-\sin(\gamma-\alpha)$, 첫 열 $(0,0,-1)$. 관절 2가 90° 돌면 관절 3의 축 $\hat x_2$가 관절 1의 축 $\hat z_0$와 (반대 방향으로) 나란해져 두 관절이 같은 축 둘레를 돌기 때문입니다.`,
        rubric: R`
- 셋째 행·첫째 열로 $\cos\beta$의 두 부호 — 3점
- $\alpha,\gamma$를 atan2로, 부호 처리 — 3점
- $\beta=90°$의 행렬 계산 — 2점
- 축이 겹친다는 기하 설명 — 2점` },
    ],
  });
})();
