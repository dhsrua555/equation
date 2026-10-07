/* 과제 풀이 — 로봇공학입문 Problem Set #3 (교재 MR 3장 연습문제 3.1, 3.15, 3.16, 3.20, 3.36: 회전 행렬, 동차 변환, 오일러 각).
   조교 풀이 파일(ProblemSet_Solution_week3.pdf)은 첫 쪽 제목이 "Problem Set #4 solution"이지만 내용은 이 과제입니다. 문제는 교재 문장을 한국어로 옮겼고
   핵심 포인트·풀이·자주 하는 실수는 새로 썼습니다. 모든 행렬과 수치는 perl로 검산했고, 조교 풀이가 다루지 않은 소문항(3.1(h), 3.15(c), 3.16(h)–(j))도 풀었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.quizzes = EM.quizzes || [];
(function () {
  const R = String.raw;
  EM.quizzes.push({
    id: 'ps3', mark: 'P', title: 'Problem Set #3', short: 'PS3',
    meta: '로봇공학입문 · 회전 행렬, 동차 변환, 오일러 각(교재 3장, 부록 B) · 다섯 문제 · 중간고사 1 범위',
    intro: R`
셋째 과제는 교재 3장의 연습문제 다섯 개로, 중간고사 1의 “좌표계” 문제와 모양이 같습니다. 3.1과 3.16은 같은 두 좌표계 {a}, {b}를 회전 행렬과 동차 변환으로 각각 다루고, 3.15와 3.36은 세 각으로 된 방향 표현, 3.20은 움직이는 물체(자전거 바퀴)의 변환을 시간의 함수로 쓰는 문제입니다. 조교 풀이 파일의 첫 쪽 제목은 “Problem Set #4 solution”으로 적혀 있지만 이 과제의 풀이입니다.

필요한 규칙은 세 가지뿐입니다(6·7·8단원).
$$R_{ab}R_{bc}=R_{ac},\quad R_{ab}p_b=p_a,\quad R^{-1}=R^T;\qquad T^{-1}=\begin{bmatrix}R^T&-R^Tp\\0&1\end{bmatrix};\qquad\text{앞곱}=\text{고정 축},\ \text{뒷곱}=\text{물체 축}.$$

:::tip 답안 작성의 공통 원칙
1. **열을 먼저 적는다.** $R_{sa}$의 열은 {a}의 축을 {s}에서 쓴 것입니다. 문제에 축 방향이 주어지면 바로 열로 넣고, 셋째 축은 외적 $\hat z=\hat x\times\hat y$로 만듭니다.
2. **역행렬은 전치로.** “역행렬을 쓰지 말고”라는 요구는 $R^{-1}=R^T$, $T^{-1}$의 공식을 쓰라는 뜻입니다.
3. **해석을 문장으로.** $R_1=R_{sa}R$이 고정 축인지 물체 축인지, $Rp$가 점 옮기기인지 좌표 바꾸기인지를 꼭 문장으로 답합니다.
4. **그림과 대조한다.** 계산한 $R_{ab}$의 첫 열이 그림에서 {a}에서 본 $\hat x_b$와 같은지 확인하면 부호 실수를 잡을 수 있습니다.
:::
`,
    problems: [
      { id: 'p1', label: '문제 1', title: '두 좌표계의 회전 행렬과 세 가지 쓰임', where: '교재 연습문제 3.1 · 회전 행렬 · ★★', secs: ['ch06:3.2.1a', 'ch06:3.2.1b', 'ch05:3.2.2'],
        body: R`
:::def 문제
(교재 연습문제 3.1) 고정 좌표계 {s}의 좌표로, {a}는 $\hat x_a$가 $(0,0,1)$, $\hat y_a$가 $(-1,0,0)$ 방향이고, {b}는 $\hat x_b$가 $(1,0,0)$, $\hat y_b$가 $(0,0,-1)$ 방향이다.
(a) 세 좌표계를 보기 쉽게 다른 곳에 그려라. (b) $R_{sa}$, $R_{sb}$를 써라. (c) 역행렬을 쓰지 않고 $R_{sb}^{-1}$을 구하고 그림으로 확인하라. (d) 역행렬 없이 $R_{ab}$를 구하고 확인하라. (e) $R=R_{sb}$를 $\hat x$ 둘레 $-90°$ 회전으로 보고 $R_1=R_{sa}R$, $R_2=RR_{sa}$를 구하라. 각각은 $R_{sa}$를 고정 $\hat x_s$ 둘레로 돌린 것인가, 물체 $\hat x_a$ 둘레로 돌린 것인가? (f) $R_{sb}$로 $p_b=(1,2,3)$을 {s} 좌표로 바꿔라. (g) $p_s=(1,2,3)$에 대해 $p'=R_{sb}p_s$, $p''=R_{sb}^Tp_s$를 구하고, 각각이 좌표 바꾸기인지 점 옮기기인지 답하라. (h) 각속도가 {s}에서 $\omega_s=(3,2,1)$일 때 {a}에서의 표현 $\omega_a$는?
:::

:::fig fp3Frames
:::

:::key 핵심 포인트
- 셋째 축은 외적으로: $\hat z_a=\hat x_a\times\hat y_a=(0,-1,0)$, $\hat z_b=\hat x_b\times\hat y_b=(0,1,0)$.
- $R_{ab}=R_{as}R_{sb}=R_{sa}^TR_{sb}$ (아래첨자 지우기).
- 앞곱 $RR_{sa}$ = 고정 축, 뒷곱 $R_{sa}R$ = 물체 축.
- $R_{sb}p$: 점 $p$를 $\hat x_s$ 둘레로 $-90°$ 돌린 새 점(옮기기). $R_{sb}^Tp_s=R_{bs}p_s$: 같은 점의 {b} 좌표(좌표 바꾸기).
:::

:::ex 풀이
(b)–(h)를 차례로 계산합니다. (a)의 그림은 위에 있습니다.
---
**(b)** 열에 축을 넣고 셋째 축은 외적으로:
$$R_{sa}=\begin{bmatrix}0&-1&0\\0&0&-1\\1&0&0\end{bmatrix},\qquad R_{sb}=\begin{bmatrix}1&0&0\\0&0&1\\0&-1&0\end{bmatrix}.$$
**(c)** $R_{sb}^{-1}=R_{sb}^T=\begin{bmatrix}1&0&0\\0&0&-1\\0&1&0\end{bmatrix}$. 첫 열 $(1,0,0)$은 {b}에서 본 $\hat x_s$($=\hat x_b$와 같은 방향), 둘째 열 $(0,0,1)$은 {b}에서 본 $\hat y_s$ — 그림에서 $\hat y_s$는 {b}의 $\hat z_b$ 방향이므로 맞습니다.
**(d)** $R_{ab}=R_{sa}^TR_{sb}=\begin{bmatrix}0&0&1\\-1&0&0\\0&-1&0\end{bmatrix}\begin{bmatrix}1&0&0\\0&0&1\\0&-1&0\end{bmatrix}=\begin{bmatrix}0&-1&0\\-1&0&0\\0&0&-1\end{bmatrix}$. 첫 열: {a}에서 본 $\hat x_b=(1,0,0)_s$는 $-\hat y_a$ 방향 → $(0,-1,0)$ ✓.
**(e)** $R=\mathrm{Rot}(\hat x,-90°)=R_{sb}$ (확인: $\begin{bmatrix}1&0&0\\0&\cos(-90°)&-\sin(-90°)\\0&\sin(-90°)&\cos(-90°)\end{bmatrix}$).
$R_1=R_{sa}R=\begin{bmatrix}0&0&-1\\0&1&0\\1&0&0\end{bmatrix}$ — 뒷곱이므로 **물체 축 $\hat x_a$** 둘레 $-90°$. (첫 열 $\hat x_a=(0,0,1)$이 그대로입니다.)
$R_2=RR_{sa}=\begin{bmatrix}0&-1&0\\1&0&0\\0&0&1\end{bmatrix}$ — 앞곱이므로 **고정 축 $\hat x_s$** 둘레 $-90°$.
**(f)** $p_s=R_{sb}p_b=(1,\ 3,\ -2)$.
**(g)** $p'=R_{sb}p_s=(1,3,-2)$: 점 $p$를 $\hat x_s$ 둘레로 $-90°$ 돌린 **새 점**을 {s}로 적은 것(점 옮기기). $p''=R_{sb}^Tp_s=(1,-3,2)$: 같은 점을 **{b}의 좌표**로 적은 것(좌표 바꾸기, $p_b$).
**(h)** 벡터의 좌표 바꾸기이므로 $\omega_a=R_{as}\omega_s=R_{sa}^T\omega_s=(1,-3,-2)$. (조교 풀이에는 없는 소문항입니다.)
:::

:::warn 자주 하는 실수
- $\hat z$ 축의 부호: $\hat x\times\hat y$ 순서를 지키지 않으면 $\det R=-1$인 반사가 나옵니다. 마지막에 $\det R=1$을 확인하세요.
- (e)를 “$R$이 오른쪽에 있으니 고정 축”이라고 거꾸로 답하는 것. 6단원의 기억법: 새 회전이 {s}에 가까운 쪽(왼쪽)에 붙으면 {s}의 축입니다.
- (g)에서 두 결과를 모두 “좌표 바꾸기”라 하는 것. $R_{sb}$는 {b} 좌표를 {s} 좌표로 바꾸는 행렬이므로, {s} 좌표 $p_s$에 곱하는 것은 좌표 바꾸기가 아니라 회전입니다.
:::
` },
      { id: 'p2', label: '문제 2', title: '고정 축과 물체 축으로 이어 돌리기', where: '교재 연습문제 3.15 · 롤-피치-요 · ★★', secs: ['ch07:B.2', 'ch06:3.2.1b', 'ch08:3.3.1c'],
        body: R`
:::def 문제
(교재 연습문제 3.15) (a) 고정 좌표계 {0}과, 처음에 {0}과 겹쳐 있는 움직이는 좌표계 {1}이 있다. {1}을 차례로 1. {0}의 $\hat x$ 축 둘레로 $\alpha$ 돌려 {2}, 2. {0}의 $\hat y$ 축 둘레로 $\beta$ 돌려 {3}, 3. {0}의 $\hat z$ 축 둘레로 $\gamma$ 돌려 {4}로 만든다. 최종 방향 $R_{04}$는?
(b) 셋째 단계를 “{3}의 $\hat z$ 축 둘레로 $\gamma$ 돌린다”로 바꾸면 $R_{04}$는?
(c) $T_{ab}=\begin{bmatrix}\tfrac1{\sqrt2}&-\tfrac1{\sqrt2}&0&-1\\\tfrac1{\sqrt2}&\tfrac1{\sqrt2}&0&0\\0&0&1&1\\0&0&0&1\end{bmatrix}$, $T_{cb}=\begin{bmatrix}\tfrac1{\sqrt2}&0&\tfrac1{\sqrt2}&0\\0&1&0&1\\-\tfrac1{\sqrt2}&0&\tfrac1{\sqrt2}&0\\0&0&0&1\end{bmatrix}$일 때 $T_{ca}$를 구하라.
:::

:::key 핵심 포인트
- 고정 축({0}의 축) 둘레의 회전은 **왼쪽**에, 지금 움직이는 좌표계의 축 둘레의 회전은 **오른쪽**에 곱합니다.
- (a)는 7단원의 XYZ 롤-피치-요 그대로: $R_{04}=\mathrm{Rot}(\hat z,\gamma)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\alpha)$.
- (c)는 좌표계 사슬 $c\to b\leftarrow a$: $T_{ca}=T_{cb}T_{ba}=T_{cb}T_{ab}^{-1}$.
:::

:::ex 풀이
단계마다 어느 쪽에 곱하는지만 정하면 됩니다.
---
**(a)** $R_{01}=I$에서 시작해 모두 {0}의 축이므로 왼쪽에 쌓입니다: $R_{02}=\mathrm{Rot}(\hat x,\alpha)$, $R_{03}=\mathrm{Rot}(\hat y,\beta)R_{02}$, $R_{04}=\mathrm{Rot}(\hat z,\gamma)R_{03}$.
$$R_{04}=\mathrm{Rot}(\hat z,\gamma)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\alpha)=\begin{bmatrix}c_\gamma c_\beta&c_\gamma s_\beta s_\alpha-s_\gamma c_\alpha&c_\gamma s_\beta c_\alpha+s_\gamma s_\alpha\\s_\gamma c_\beta&s_\gamma s_\beta s_\alpha+c_\gamma c_\alpha&s_\gamma s_\beta c_\alpha-c_\gamma s_\alpha\\-s_\beta&c_\beta s_\alpha&c_\beta c_\alpha\end{bmatrix}.$$
**(b)** 처음 두 단계는 그대로 $R_{03}=\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\alpha)$이고, 셋째는 {3}의 축이므로 오른쪽에:
$$R_{04}=\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\alpha)\mathrm{Rot}(\hat z,\gamma)=\begin{bmatrix}c_\beta c_\gamma+s_\beta s_\alpha s_\gamma&-c_\beta s_\gamma+s_\beta s_\alpha c_\gamma&s_\beta c_\alpha\\c_\alpha s_\gamma&c_\alpha c_\gamma&-s_\alpha\\-s_\beta c_\gamma+c_\beta s_\alpha s_\gamma&s_\beta s_\gamma+c_\beta s_\alpha c_\gamma&c_\beta c_\alpha\end{bmatrix}.$$
(조교 풀이는 곱의 꼴까지 적었습니다. 위의 전개는 $\alpha=0.3,\ \beta=0.5,\ \gamma=0.7$ rad로 수치 검산했습니다.)
**(c)** (조교 풀이에 없는 소문항) $R_{ab}=\mathrm{Rot}(\hat z,45°)$, $p_{ab}=(-1,0,1)$이므로 $T_{ba}=(\mathrm{Rot}(\hat z,-45°),\ -R_{ab}^Tp_{ab})=(\mathrm{Rot}(\hat z,-45°),\ (\tfrac1{\sqrt2},-\tfrac1{\sqrt2},-1))$. $R_{cb}=\mathrm{Rot}(\hat y,45°)$, $p_{cb}=(0,1,0)$이므로
$$T_{ca}=T_{cb}T_{ba}=\begin{bmatrix}\tfrac12&\tfrac12&\tfrac1{\sqrt2}&\tfrac12-\tfrac1{\sqrt2}\\-\tfrac1{\sqrt2}&\tfrac1{\sqrt2}&0&1-\tfrac1{\sqrt2}\\-\tfrac12&-\tfrac12&\tfrac1{\sqrt2}&-\tfrac12-\tfrac1{\sqrt2}\\0&0&0&1\end{bmatrix}\approx\begin{bmatrix}0.5&0.5&0.707&-0.207\\-0.707&0.707&0&0.293\\-0.5&-0.5&0.707&-1.207\\0&0&0&1\end{bmatrix}.$$
:::

:::warn 자주 하는 실수
- (a)를 $\mathrm{Rot}(\hat x,\alpha)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat z,\gamma)$로 쓰는 것 — 고정 축 회전을 순서대로 오른쪽에 붙이면 물체 축 회전이 됩니다.
- (b)에서 셋째 회전만 바뀌었는데 앞의 두 인자의 순서까지 바꾸는 것.
- (c)에서 $T_{ab}^{-1}$의 위치를 $-p_{ab}$로 쓰는 것($-R^Tp$여야 함).
:::
` },
      { id: 'p3', label: '문제 3', title: '같은 두 좌표계를 동차 변환으로', where: '교재 연습문제 3.16 · 동차 변환과 트위스트 · ★★★', secs: ['ch08:3.3.1', 'ch08:3.3.1b', 'ch11:3.3.2a', 'ch12:3.3.3b'],
        body: R`
:::def 문제
(교재 연습문제 3.16) 문제 1의 두 좌표계에 원점을 더한다: {a}의 원점은 {s}에서 $(3,0,0)$, {b}의 원점은 $(0,2,0)$이다.
(a) {s}에 대한 {a}, {b}를 그려라. (b) $R_{sa},R_{sb},T_{sa},T_{sb}$를 써라. (c) 역행렬 없이 $T_{sb}^{-1}$을 구하라. (d) 역행렬 없이 $T_{ab}$를 구하라. (e) $T=T_{sb}$를 “$\hat x$ 둘레 $-90°$ 회전 + $\hat y$ 방향 2만큼 이동”으로 보고 $T_1=T_{sa}T$, $T_2=TT_{sa}$를 구하라. 각각은 고정 좌표계 기준인가, 물체 좌표계 기준인가? (f) $T_{sb}$로 $p_b=(1,2,3)$을 {s} 좌표로 바꿔라. (g) $p_s=(1,2,3)$에 대해 $p'=T_{sb}p_s$, $p''=T_{sb}^{-1}p_s$를 구하고 해석하라. (h) 트위스트가 {s}에서 $\mathcal V_s=(3,2,1,-1,-2,-3)$일 때 $\mathcal V_a$는? (i) $T_{sa}$의 행렬 로그 $[\mathcal S]\theta$를 구하고 나사 축 $\{q,\hat s,h\}$를 구하라. (j) 지수 좌표 $\mathcal S\theta=(0,1,2,3,0,0)$의 행렬 지수를 구하라.
:::

:::key 핵심 포인트
- (b)–(g)는 문제 1에 위치를 붙인 것: $T^{-1}=\begin{bmatrix}R^T&-R^Tp\\0&1\end{bmatrix}$, $T_{ab}=T_{sa}^{-1}T_{sb}$.
- (e) 앞곱 = 고정 기준(“$\hat x_s$ 둘레로 돌고 $\hat y_s$로 2”), 뒷곱 = 물체 기준(“$\hat x_a$ 둘레로 돌고 $\hat y_a$로 2”).
- (h)–(j)는 트위스트·나사 운동(11·12단원, **중간고사 2 범위**)입니다. 조교 풀이는 (a)–(g)만 다룹니다.
:::

:::ex 풀이
(b)–(g)는 중간고사 1, (h)–(j)는 중간고사 2 범위입니다.
---
**(b)** $T_{sa}=\begin{bmatrix}0&-1&0&3\\0&0&-1&0\\1&0&0&0\\0&0&0&1\end{bmatrix}$, $T_{sb}=\begin{bmatrix}1&0&0&0\\0&0&1&2\\0&-1&0&0\\0&0&0&1\end{bmatrix}$.
**(c)** $T_{sb}^{-1}=\begin{bmatrix}R_{sb}^T&-R_{sb}^Tp_{sb}\\0&1\end{bmatrix}=\begin{bmatrix}1&0&0&0\\0&0&-1&0\\0&1&0&-2\\0&0&0&1\end{bmatrix}$. {b}에서 본 {s}의 원점은 $(0,0,-2)$: {b}의 원점에서 $-\hat z_b$(={s}의 $-\hat y$) 방향으로 2.
**(d)** $T_{ab}=T_{sa}^{-1}T_{sb}$: 방향은 문제 1의 $R_{ab}$, 위치는 $R_{sa}^T(p_{sb}-p_{sa})=R_{sa}^T(-3,2,0)=(0,3,-2)$.
$$T_{ab}=\begin{bmatrix}0&-1&0&0\\-1&0&0&3\\0&0&-1&-2\\0&0&0&1\end{bmatrix}.$$
**(e)** $T_1=T_{sa}T=\begin{bmatrix}0&0&-1&1\\0&1&0&0\\1&0&0&0\\0&0&0&1\end{bmatrix}$ — 뒷곱, **물체 기준**: {a}를 자기 $\hat y_a$ 방향으로 2 옮기고($\hat y_a=(-1,0,0)$이라 원점이 $(1,0,0)$으로) 자기 $\hat x_a$ 둘레로 $-90°$.
$T_2=TT_{sa}=\begin{bmatrix}0&-1&0&3\\1&0&0&2\\0&0&1&0\\0&0&0&1\end{bmatrix}$ — 앞곱, **고정 기준**: $\hat x_s$ 둘레로 $-90°$ 돌린 뒤(원점 $(3,0,0)$은 $\hat x_s$ 축 위라 그대로) $\hat y_s$로 2 옮김.
**(f)** $p_s=R_{sb}p_b+p_{sb}=(1,3,-2)+(0,2,0)=(1,5,-2)$.
**(g)** $p'=T_{sb}p_s=(1,5,-2)$: 점을 옮긴 것(돌리고 $\hat y_s$로 2 이동). $p''=T_{sb}^{-1}p_s=(1,-3,0)$: 같은 점의 {b} 좌표(좌표 바꾸기).
**(h)** $\mathcal V_a=[\mathrm{Ad}_{T_{as}}]\mathcal V_s$, $T_{as}=T_{sa}^{-1}=(R_{sa}^T,\ (0,3,0))$. $\omega_a=R_{sa}^T(3,2,1)=(1,-3,-2)$, $v_a=R_{sa}^T(-1,-2,-3)+(0,3,0)\times\omega_a=(-3,1,2)+(-6,0,-3)=(-9,1,-1)$.
$$\mathcal V_a=(1,-3,-2,-9,1,-1).$$
**(i)** $\operatorname{tr}R_{sa}=0$ → $\theta=\tfrac{2\pi}3$, $\hat\omega=\tfrac1{\sqrt3}(1,-1,1)$. $v=G^{-1}(\theta)p$, $G^{-1}=\tfrac1\theta I-\tfrac12[\hat\omega]+\big(\tfrac1\theta-\tfrac12\cot\tfrac\theta2\big)[\hat\omega]^2$, $p=(3,0,0)$:
$$v=\Big(\tfrac3{2\pi}+\tfrac1{\sqrt3},\ -\tfrac3{2\pi}-\tfrac1{\sqrt3},\ \tfrac3{2\pi}-\tfrac2{\sqrt3}\Big)\approx(1.055,\ -1.055,\ -0.677).$$
나사 축: $\hat s=\hat\omega=\tfrac1{\sqrt3}(1,-1,1)$, 피치 $h=\hat\omega^Tv=\tfrac{3\sqrt3}{2\pi}\approx0.827$, 축 위의 점 $q=\hat\omega\times v=(1,1,0)$. 확인: $(1,1,0)$을 지나는 그 축 둘레로 $120°$ 돌고 축을 따라 $h\theta=\sqrt3$만큼 가면 {s}의 원점이 $(3,0,0)$에 옵니다.
**(j)** $\omega=(0,1,2)$, $v=(3,0,0)$ → $\theta=\lVert\omega\rVert=\sqrt5$, $\hat\omega=\tfrac1{\sqrt5}(0,1,2)$, $\hat v=\tfrac1{\sqrt5}(3,0,0)$. $\hat\omega\cdot\hat v=0$이라 피치 0인 순수 회전이고, 축은 $q=\hat\omega\times\hat v=(0,1.2,-0.6)$을 지납니다. $e^{[\mathcal S]\theta}=\begin{bmatrix}e^{[\hat\omega]\theta}&G(\theta)\hat v\\0&1\end{bmatrix}$:
$$\approx\begin{bmatrix}-0.617&-0.704&0.352&1.056\\0.704&-0.294&0.647&1.941\\-0.352&0.647&0.677&-0.970\\0&0&0&1\end{bmatrix}.$$
:::

:::warn 자주 하는 실수
- (d)에서 $p_{ab}=p_{sb}-p_{sa}$로 끝내는 것 — 그것은 {s}의 좌표입니다. {a}의 좌표로 다시 적어야 합니다($R_{sa}^T$를 곱함).
- (e)의 해석을 회전만 보고 하는 것. 이동도 같은 기준(고정 또는 물체)으로 일어납니다: $T_1$의 원점이 $(1,0,0)$이 되는 이유가 “$\hat y_a$ 방향 2”입니다.
- (h)에서 $\omega$만 바꾸고 $v$에 $[p]R\omega$ 항을 빠뜨리는 것.
:::
` },
      { id: 'p4', label: '문제 4', title: '하이휠 자전거의 앞바퀴 꼭대기', where: '교재 연습문제 3.20 · 그림 3.26 · ★★★', secs: ['ch08:3.3.1', 'ch08:3.3.1c'],
        body: R`
:::def 문제
(교재 연습문제 3.20) 그림 3.26의 하이휠 자전거는 앞바퀴의 지름이 뒷바퀴의 두 배다(뒷바퀴 반지름 $r$, 앞바퀴 $2r$, 두 바퀴 중심 사이 거리 $L$). {a}와 {b}는 각각 뒷바퀴와 앞바퀴의 중심에, {c}는 앞바퀴의 꼭대기에 붙어 있다. 자전거가 앞으로 나아갈 때 $T_{ac}$를 앞바퀴의 회전각 $\theta$의 함수로 구하라(그림의 순간에 $\theta=0$).
:::

:::fig fp3Bike
:::

:::key 핵심 포인트
- 미끄러지지 않고 구르면 이동 거리 = 반지름 × 회전각. 앞바퀴가 $\theta$ 돌면 자전거는 $2r\theta$ 나아가고, 뒷바퀴는 $2\theta$ 돕니다.
- {a}, {b}는 **바퀴와 함께 도는** 좌표계, {c}는 앞바퀴 테두리의 한 점에 붙어 함께 돕니다(조교 풀이의 해석).
- 기준 좌표계 {s}를 처음 순간의 {a}로 두고 $T_{sa}(\theta)$와 $T_{sc}(\theta)$를 따로 만든 뒤 $T_{ac}=T_{sa}^{-1}T_{sc}$.
:::

:::ex 풀이
그림의 {a}는 $\hat z_a$가 앞으로, $\hat y_a$가 위로, $\hat x_a$가 바퀴 축(왼쪽)입니다. 앞으로 구르는 바퀴는 바퀴 축 $+\hat x$ 둘레로 돕니다.
---
{s} = 처음의 {a}. 두 바퀴 중심의 높이 차는 $2r-r=r$, 앞뒤 거리는 $L$, {c}는 앞바퀴 꼭대기에서 바퀴 축 방향으로 $D$만큼 떨어진 곳($-\hat x_b$ 방향)입니다.
$$T_{sb}=\mathrm{Trans}(\hat z,L+2r\theta)\,\mathrm{Trans}(\hat y,r)\,\mathrm{Rot}(\hat x,\theta),\qquad T_{sc}=T_{sb}\,\mathrm{Trans}(\hat y,2r)\,\mathrm{Trans}(\hat x,-D)$$
$$T_{sc}=\begin{bmatrix}1&0&0&-D\\0&\cos\theta&-\sin\theta&r+2r\cos\theta\\0&\sin\theta&\cos\theta&L+2r\theta+2r\sin\theta\\0&0&0&1\end{bmatrix},\qquad T_{sa}=\begin{bmatrix}1&0&0&0\\0&\cos2\theta&-\sin2\theta&0\\0&\sin2\theta&\cos2\theta&2r\theta\\0&0&0&1\end{bmatrix}.$$
$T_{ac}=T_{sa}^{-1}T_{sc}$: 방향은 $\mathrm{Rot}(\hat x,-2\theta)\mathrm{Rot}(\hat x,\theta)=\mathrm{Rot}(\hat x,-\theta)$, 위치는 $\mathrm{Rot}(\hat x,-2\theta)\big(p_{sc}-p_{sa}\big)=\mathrm{Rot}(\hat x,-2\theta)(-D,\ r+2r\cos\theta,\ L+2r\sin\theta)$. 정리하면
$$T_{ac}=\begin{bmatrix}1&0&0&-D\\0&\cos\theta&\sin\theta&2r\cos\theta+r\cos2\theta+L\sin2\theta\\0&-\sin\theta&\cos\theta&L\cos2\theta-r\sin2\theta-2r\sin\theta\\0&0&0&1\end{bmatrix}.$$
진행 거리 $2r\theta$는 $p_{sc}-p_{sa}$에서 지워집니다 — 두 바퀴가 함께 움직이므로 상대 위치에는 남지 않고, 두 바퀴의 회전 빠르기 차(뒷바퀴 $2\theta$, 앞바퀴 $\theta$)만 남습니다. 검산: $\theta=0$이면 $T_{ac}=(I,(-D,\ 3r,\ L))$로 그림의 배치($2r+r$ 위, $L$ 앞)와 맞습니다. $r=1,\ L=3,\ D=0.5,\ \theta=0.4$에서 수치로도 확인했습니다.
:::

:::warn 자주 하는 실수
- 바퀴 회전 방향의 부호. $\hat y$가 위, $\hat z$가 앞이면 앞으로 구를 때 꼭대기 점이 앞으로 가야 하므로 $+\hat x$ 둘레의 양의 회전입니다. $\mathrm{Rot}(\hat x,\theta)\hat y=(0,\cos\theta,\sin\theta)$로 꼭대기가 $+\hat z$로 움직이는지 확인하세요.
- 뒷바퀴도 $\theta$만큼 돈다고 놓는 것 — 반지름이 반이므로 $2\theta$입니다.
- {c}를 “늘 꼭대기에 있는 점(바퀴와 함께 돌지 않음)”으로 해석할 수도 있습니다. 그러면 {c}의 방향은 $\theta$와 무관하고 위치의 $\cos\theta,\sin\theta$ 항이 사라집니다. 문제의 해석을 답안 첫 줄에 밝히세요.
:::
` },
      { id: 'p5', label: '문제 5', title: 'ZXZ 오일러 각 구하기', where: '교재 연습문제 3.36 · 부록 B · ★★', secs: ['ch07:B.1c', 'ch07:B.1b'],
        body: R`
:::def 문제
(교재 연습문제 3.36) 부록 B를 참고해 ZXZ 오일러 각에 관한 다음에 답하라.
(a) 회전 행렬에서 ZXZ 오일러 각을 구하는 절차를 유도하라.
(b) (a)를 써서 $R=\begin{bmatrix}-\tfrac1{\sqrt2}&\tfrac1{\sqrt2}&0\\-\tfrac12&-\tfrac12&\tfrac1{\sqrt2}\\\tfrac12&\tfrac12&\tfrac1{\sqrt2}\end{bmatrix}$의 ZXZ 오일러 각을 구하라.
:::

:::key 핵심 포인트
- $R=\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat x,\beta)\mathrm{Rot}(\hat z,\gamma)$의 셋째 열은 $(s_\alpha s_\beta,\,-c_\alpha s_\beta,\,c_\beta)$, 셋째 행은 $(s_\beta s_\gamma,\,s_\beta c_\gamma,\,c_\beta)$입니다. 가운데 회전만 담긴 $r_{33}=\cos\beta$에서 시작합니다.
- $\sin\beta$의 부호를 고르면 해가 둘, $\sin\beta=0$($\beta=0,\pi$)이면 짐벌 록.
:::

:::ex 풀이
곱을 전개하고 셋째 행·열에서 각을 읽습니다.
---
**(a)**
$$R=\begin{bmatrix}c_\alpha c_\gamma-s_\alpha c_\beta s_\gamma&-c_\alpha s_\gamma-s_\alpha c_\beta c_\gamma&s_\alpha s_\beta\\s_\alpha c_\gamma+c_\alpha c_\beta s_\gamma&-s_\alpha s_\gamma+c_\alpha c_\beta c_\gamma&-c_\alpha s_\beta\\s_\beta s_\gamma&s_\beta c_\gamma&c_\beta\end{bmatrix}$$
$r_{13}^2+r_{23}^2=s_\beta^2$이므로 $\sin\beta=\pm\sqrt{r_{13}^2+r_{23}^2}$.
- 경우 1 ($0\lt\beta\lt\pi$, $\sin\beta\gt0$): $\beta=\operatorname{atan2}(\sqrt{r_{13}^2+r_{23}^2},\,r_{33})$, $\alpha=\operatorname{atan2}(r_{13},-r_{23})$, $\gamma=\operatorname{atan2}(r_{31},r_{32})$.
- 경우 2 ($-\pi\lt\beta\lt0$): $\beta=\operatorname{atan2}(-\sqrt{r_{13}^2+r_{23}^2},\,r_{33})$, $\alpha=\operatorname{atan2}(-r_{13},r_{23})$, $\gamma=\operatorname{atan2}(-r_{31},-r_{32})$.
- $r_{33}=\pm1$($\sin\beta=0$): 첫째와 셋째 회전축이 같은 $\hat z$가 되어 $\alpha\pm\gamma$만 정해집니다(예: $\beta=0$이면 $R=\mathrm{Rot}(\hat z,\alpha+\gamma)$).
**(b)** $r_{33}=\tfrac1{\sqrt2}$, $\sqrt{r_{13}^2+r_{23}^2}=\tfrac1{\sqrt2}$.
- 경우 1: $\beta=\operatorname{atan2}(\tfrac1{\sqrt2},\tfrac1{\sqrt2})=\tfrac\pi4$, $\alpha=\operatorname{atan2}(0,-\tfrac1{\sqrt2})=\pi$, $\gamma=\operatorname{atan2}(\tfrac12,\tfrac12)=\tfrac\pi4$.
- 경우 2: $\beta=-\tfrac\pi4$, $\alpha=\operatorname{atan2}(0,\tfrac1{\sqrt2})=0$, $\gamma=\operatorname{atan2}(-\tfrac12,-\tfrac12)=-\tfrac{3\pi}4$.
두 해 모두 원래 행렬을 다시 만들어 냄을 수치로 확인했습니다.
:::

:::warn 자주 하는 실수
- ZYX의 공식(셋째 **행**의 $-\sin\beta$)을 그대로 쓰는 것. ZXZ에서는 $r_{33}=\cos\beta$이고 $\beta$의 범위가 $[0,\pi]$ 쪽입니다.
- $\alpha=\operatorname{atan2}(r_{13},r_{23})$로 부호를 빠뜨리는 것. 셋째 열의 둘째 성분이 $-\cos\alpha\sin\beta$이므로 $-r_{23}$입니다.
- 해가 둘이라는 것을 쓰지 않는 것. 문제가 범위를 정해 주지 않았다면 두 해를 모두 적습니다.
:::
` },
    ],
  });
})();
