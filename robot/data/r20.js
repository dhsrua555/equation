/* 20 로봇 제어의 기초 — MR 11.1–11.4 · 기말고사 범위(예습) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 20, part: 'C', title: '로봇 제어의 기초', en: 'Robot Control Basics', ref: 'MR 11.1–11.4', plot: 'rbStep',
    fig: R`감쇠비만 바꾼 2차 오차 동역학의 응답들. 감쇠가 작을수록 크게 넘쳤다가 흔들리며 0으로 가라앉는다`,
    tagline: R`계획한 궤적을 실제로 따라가게 만드는 일입니다. 오차가 어떤 미분방정식을 따르게 할지 고르는 것이 제어 설계이고, 동역학 모델을 알면 그 방정식을 선형으로 만들 수 있습니다.`,
    summary: R`관절 오차 $\theta_e=\theta_d-\theta$가 따르는 미분방정식이 **오차 동역학**입니다. 특성 방정식의 근이 모두 왼쪽 반평면에 있으면 안정하고, 2차 표준형 $\ddot\theta_e+2\zeta\omega_n\dot\theta_e+\omega_n^2\theta_e=0$에서 **감쇠비** $\zeta$는 넘침을($e^{-\pi\zeta/\sqrt{1-\zeta^2}}$), $\zeta\omega_n$은 2% 정착 시간($\approx4/(\zeta\omega_n)$)을 정합니다. 속도를 직접 명령할 수 있으면 앞먹임 $\dot\theta_d$에 PI 되먹임을 더해 $\dot\theta=\dot\theta_d+K_p\theta_e+K_i\int\theta_e$로 제어합니다. 토크를 명령하는 관절에는 PID 제어 $\tau=K_p\theta_e+K_i\int\theta_e+K_d\dot\theta_e$를 쓰며, 중력이 있으면 PD만으로는 정상 상태 오차가 남아 적분 항이 필요하지만 $K_i$에는 안정성의 상한이 있습니다. 동역학 모델을 쓰는 **계산 토크 제어** $\tau=\tilde M(\theta)(\ddot\theta_d+K_p\theta_e+K_i\int\theta_e+K_d\dot\theta_e)+\tilde h(\theta,\dot\theta)$는 비선형 항을 지워 모든 관절의 오차 동역학을 같은 선형 방정식으로 만듭니다.`,
    goals: [
      R`오차 응답의 넘침, 정착 시간, 정상 상태 오차를 정의하고 특성 방정식으로 안정성을 판정할 수 있다`,
      R`2차 오차 동역학에서 감쇠비와 고유 진동수로 넘침과 정착 시간을 계산할 수 있다`,
      R`속도 입력의 P, PI, 앞먹임 제어의 오차 동역학을 유도할 수 있다`,
      R`토크 입력 관절의 PD·PID 제어에서 이득과 안정 조건, 중력에 의한 정상 상태 오차를 구할 수 있다`,
      R`계산 토크 제어가 선형 오차 동역학을 만드는 이유를 설명하고 토크를 계산할 수 있다`,
    ],
    secTitles: { '11.2': '오차 동역학', '11.3': '속도 입력의 운동 제어', '11.4a': '토크 입력의 PID 제어', '11.4b': '계산 토크 제어' },
    sections: [
      { k: '11.2', p: 404, title: '제어 개요와 오차 동역학', body: R`
제어기는 과제를 액추에이터의 힘과 토크로 바꿉니다. 정해진 운동을 만드는 **운동 제어**, 환경에 힘을 가하는 **힘 제어**, 둘을 방향별로 나누는 **혼성 제어**, 용수철·감쇠기처럼 반응하게 하는 **임피던스 제어**가 있는데, 한 방향에서 운동과 힘을 동시에 마음대로 정할 수는 없습니다. 이 단원은 운동 제어를 다룹니다. 엔코더로 관절각을 재고 초당 수백–수천 번 토크를 갱신하지만, 여기서는 연속 시간으로 보고 제어기가 토크를 직접 낸다고 봅니다.

관절 오차는 $\theta_e(t)=\theta_d(t)-\theta(t)$입니다. $\theta_e(0)=1$, 나머지 초기 미분은 0으로 두고 본 응답에서 세 가지를 봅니다: 끝내 남는 **정상 상태 오차** $e_{ss}$, 0을 지나 반대로 넘어가는 **넘침**, 그리고 $\lvert\theta_e-e_{ss}\rvert$가 처음 크기의 2% 안에 머물기 시작하는 **2% 정착 시간**.

:::key 오차 동역학과 안정성
$$\theta_e^{(p)}+a_{p-1}\theta_e^{(p-1)}+\cdots+a_1\dot\theta_e+a_0\theta_e=0\quad\longleftrightarrow\quad s^p+a_{p-1}s^{p-1}+\cdots+a_1s+a_0=0$$
모든 근의 실수부가 음수이면 **안정**($\theta_e\to0$). $p=1,2$이면 모든 계수가 양수인 것과 동치, $p=3$이면 계수가 모두 양수이고 $a_2a_1>a_0$.
:::

1차이면 $\dot\theta_e+\theta_e/\tau=0$의 해 $\theta_e=e^{-t/\tau}\theta_e(0)$로 넘침이 없고, 정착 시간은 $\tau\ln50\approx3.9\tau\approx4\tau$입니다($\tau$: 시간 상수).

:::key 2차 오차 동역학의 표준형
$$\ddot\theta_e+2\zeta\omega_n\dot\theta_e+\omega_n^2\theta_e=0,\qquad s_{1,2}=-\zeta\omega_n\pm\omega_n\sqrt{\zeta^2-1}$$
질량–용수철–감쇠기 $m\ddot e+b\dot e+ke=0$이면 $\omega_n=\sqrt{k/m}$, $\zeta=b/(2\sqrt{km})$. $\zeta>1$ 과감쇠(서로 다른 실근), $\zeta=1$ 임계 감쇠(중근 $-\omega_n$), $\zeta<1$ 부족 감쇠(켤레 복소근).
:::

:::key 부족 감쇠 응답의 지표
$$\omega_d=\omega_n\sqrt{1-\zeta^2},\qquad t_p=\frac{\pi}{\omega_d},\qquad \text{넘침}=e^{-\pi\zeta/\sqrt{1-\zeta^2}},\qquad t_s\approx\frac{4}{\zeta\omega_n}$$
응답은 $e^{-\zeta\omega_nt}$로 줄어드는 포락선 안에서 주파수 $\omega_d$로 흔들린다. 넘침은 $\zeta$만의 함수.
:::

| $\zeta$ | 0.1 | 0.3 | 0.5 | 0.7 | 0.8 | 1 |
|---|---|---|---|---|---|---|
| 넘침 | 72.9% | 37.2% | 16.3% | 4.6% | 1.5% | 0 |

:::idea 한눈에: 근의 위치가 응답을 정한다
근이 왼쪽으로 멀수록($\zeta\omega_n$이 클수록) 빨리 가라앉고, 실수축에서 위아래로 멀수록($\omega_d$가 클수록) 많이 흔들립니다. 빠르면서 넘치지 않는 임계 감쇠 $\zeta=1$이 설계의 기준점입니다.
:::

:::ex 예제 1
오차 동역학이 $\ddot\theta_e+4\dot\theta_e+16\theta_e=0$이다. $\zeta$, $\omega_n$, 넘침, 첫 극값 시각, 2% 정착 시간은?
---
$\omega_n^2=16$에서 $\omega_n=4$, $2\zeta\omega_n=4$에서 $\zeta=0.5$. $\omega_d=4\sqrt{0.75}\approx3.46$이므로 $t_p=\pi/\omega_d\approx0.91$ s, 넘침 $e^{-\pi(0.5)/0.866}\approx16.3\%$, $t_s\approx4/(0.5\cdot4)=2$ s.
:::
` },
      { k: '11.3', p: 413, title: '속도 입력의 운동 제어', body: R`
스테퍼 모터나 속도 모드의 증폭기처럼 관절 속도를 직접 명령할 수 있으면 제어 입력은 $\dot\theta$입니다. 가장 단순한 것은 궤적의 속도를 그대로 내보내는 **앞먹임**(feedforward) $\dot\theta=\dot\theta_d$인데, 센서를 보지 않으므로 오차가 쌓여도 고치지 못합니다.

**P 제어** $\dot\theta=K_p\theta_e$는 가상의 용수철처럼 오차에 비례해 되돌립니다. 목표가 고정이면($\dot\theta_d=0$) $\dot\theta_e+K_p\theta_e=0$ — 시간 상수 $1/K_p$, 정착 시간 $4/K_p$. 그러나 목표가 일정한 속도 $\dot\theta_d=c$로 움직이면 $\dot\theta_e+K_p\theta_e=c$가 되어 오차가 $c/K_p$로 수렴합니다. 관절은 늘 목표 뒤를 쫓아갑니다.

**PI 제어**는 오차의 적분을 더합니다. $\dot\theta=K_p\theta_e+K_i\int_0^t\theta_e\,dt$를 넣고 한 번 미분하면 $\ddot\theta_e+K_p\dot\theta_e+K_i\theta_e=0$, 곧 $\omega_n=\sqrt{K_i}$, $\zeta=K_p/(2\sqrt{K_i})$인 2차 오차 동역학입니다. 등속 목표에서도 정상 상태 오차가 0이 됩니다.

:::key 앞먹임과 PI 되먹임
$$\dot\theta(t)=\dot\theta_d(t)+K_p\theta_e(t)+K_i\int_0^t\theta_e(t)\,dt\quad\Longrightarrow\quad\dot\theta_e+K_p\theta_e+K_i\int_0^t\theta_e\,dt=0$$
앞먹임은 오차가 생기기 전에 움직이게 하고, 되먹임은 쌓인 오차를 없앤다. 목표 궤적이 어떻든 오차는 같은 방정식을 따른다. 관절이 $n$개이면 $K_p=k_pI$, $K_i=k_iI$.
:::

:::ex 예제 2 — 이득 고르기
$K_p=20$으로 고정한 PI 제어에서 $K_i$를 키워 간다. 임계 감쇠가 되는 $K_i$와 그때의 정착 시간은? $K_i=400$이면?
---
$\zeta=20/(2\sqrt{K_i})=1$에서 $K_i=K_p^2/4=100$, 중근 $s=-10$, $t_s\approx4/10=0.4$ s. $K_i=400$이면 $\omega_n=20$, $\zeta=0.5$로 넘침 16.3%가 생기지만 $\zeta\omega_n=K_p/2=10$은 그대로라 정착 시간은 여전히 약 0.4 s입니다. $K_i<100$이면 과감쇠가 되어 0에 가까운 느린 근이 응답을 늦춥니다.
:::

작업 공간에서도 같은 구조를 씁니다. 끝점 자세 $X$, 목표 $X_d$에 대해 오차는 뺄셈이 아니라 “단위 시간 동안 따라가면 $X$를 $X_d$로 옮기는 트위스트”입니다.

:::key 작업 공간 속도 제어
$$\mathcal V_b=[\mathrm{Ad}_{X^{-1}X_d}]\mathcal V_d+K_pX_e+K_i\int_0^tX_e\,dt,\qquad[X_e]=\log(X^{-1}X_d),\qquad\dot\theta=J_b^\dagger(\theta)\mathcal V_b$$
첫 항은 목표 좌표계의 앞먹임 트위스트를 지금 끝점 좌표계로 옮긴 것. 관절 속도는 14단원 야코비안의 의사 역행렬로 구한다(16단원 역기구학의 뉴턴–랩슨과 같은 구조).
:::
` },
      { k: '11.4a', p: 420, title: '토크 입력: 한 관절의 PD·PID 제어', body: R`
실제 로봇은 대부분 증폭기를 토크 모드로 써서 관절 토크를 명령합니다. 그래야 동역학 모델을 설계에 쓸 수 있습니다. 수평에서 잰 각 $\theta$로 도는 링크 하나(관성 $M$, 질량 $m$, 축에서 질량 중심까지 $r$, 점성 마찰 $b$)의 동역학은
$$\tau=M\ddot\theta+mgr\cos\theta+b\dot\theta=M\ddot\theta+h(\theta,\dot\theta).$$

:::key PID 제어
$$\tau=K_p\theta_e+K_i\int_0^t\theta_e(t)\,dt+K_d\dot\theta_e$$
$K_p$는 위치 오차를 줄이는 가상 용수철, $K_d$는 속도 오차를 줄이는 가상 감쇠기, $K_i$는 정상 상태 오차를 없앤다. $K_i=0$이면 PD 제어.
:::

중력이 없는 수평면($g=0$)에서 고정 목표로 PD 제어를 하면 $\dot\theta_e=-\dot\theta$, $\ddot\theta_e=-\ddot\theta$이므로

:::key PD 제어의 오차 동역학
$$M\ddot\theta_e+(b+K_d)\dot\theta_e+K_p\theta_e=0,\qquad\omega_n=\sqrt{\frac{K_p}{M}},\qquad\zeta=\frac{b+K_d}{2\sqrt{K_pM}}$$
안정 조건은 $K_p>0$, $b+K_d>0$. 보통 $K_p$를 실용 한계 안에서 크게 잡고 $\zeta=1$이 되게 $K_d$를 고른다.
:::

수직면에서는 중력이 끼어듭니다. 링크가 멈추면 $K_p\theta_e=mgr\cos\theta$ — 링크를 붙잡고 있을 토크를 내려면 오차가 남아 있어야 합니다. $K_p$를 키우면 오차가 줄지만 없어지지는 않습니다. 적분 항을 더하면 오차가 0이어도 쌓인 적분이 버티는 토크를 냅니다. 중력을 일정한 외란 $\tau_{\mathrm{dist}}$로 보고 미분하면

:::key PID 제어의 3차 오차 동역학
$$M\theta_e^{(3)}+(b+K_d)\ddot\theta_e+K_p\dot\theta_e+K_i\theta_e=0$$
$$\text{안정 조건:}\quad K_p>0,\quad K_d>-b,\quad 0<K_i<\frac{(b+K_d)K_p}{M}$$
$K_i$에는 하한(양수)과 **상한**이 함께 있다. $K_p$, $K_d$로 과도 응답을 먼저 잡고 $K_i$는 작게 더한다.
:::

:::ex 예제 3
$M=0.5\ \mathrm{kg\,m^2}$, $b=0.1\ \mathrm{N\,m\,s/rad}$인 관절에 $K_d=1.9$, $K_p=2$로 PD 제어를 한다. (a) $\zeta$, $\omega_n$, 정착 시간은? (b) $m=1$ kg, $r=0.1$ m, $g=9.81$인 수직면에서 $\theta_d=0$(수평)이면 멈춘 오차는? (c) PID로 바꿀 때 $K_i$의 범위는?
---
(a) $\omega_n=\sqrt{2/0.5}=2$, $\zeta=2/(2\sqrt{1})=1$ — 임계 감쇠, $t_s\approx4/2=2$ s.
(b) $2\theta_e=0.981\cos\theta_e$를 풀면 $\theta_e\approx0.443$ rad(약 25°). 링크가 아래로 처진 채 멈춥니다.
(c) $0<K_i<(2)(2)/0.5=8$.
:::

:::warn 적분 항의 대가
적분 항은 위상을 늦춰 넘침을 키우고, 이득이 크면 불안정해집니다. 액추에이터가 포화된 동안 적분이 계속 쌓이는 **적분기 와인드업**도 문제라 적분값에 상한을 둡니다. 실제로 많은 로봇이 $K_i=0$으로 둡니다.
:::
` },
      { k: '11.4b', p: 426, title: '모델 기반 제어: 앞먹임과 계산 토크', body: R`
되먹임은 오차가 생겨야 반응합니다. 동역학 모델 $\{\tilde M,\tilde h\}$가 있으면 궤적에 필요한 토크를 미리 계산할 수 있습니다. **앞먹임** $\tau=\tilde M(\theta_d)\ddot\theta_d+\tilde h(\theta_d,\dot\theta_d)$는 모델이 정확하고 초기 오차가 없으면 궤적을 완벽히 따라가지만, 모델 오차가 조금만 있어도 오차가 쌓입니다. 둘을 합치면 각자의 장점을 얻습니다.

:::key 계산 토크 제어
$$\tau=\tilde M(\theta)\Big(\ddot\theta_d+K_p\theta_e+K_i\int_0^t\theta_e\,dt+K_d\dot\theta_e\Big)+\tilde h(\theta,\dot\theta)$$
모델이 정확하면($\tilde M=M$, $\tilde h=h$) 모든 궤적에서
$$\ddot\theta_e+K_d\dot\theta_e+K_p\theta_e+K_i\int_0^t\theta_e\,dt=0$$
:::

괄호 안은 “원하는 가속도”입니다. $\ddot\theta_d$가 앞먹임, 나머지가 PID 되먹임이고, $\tilde h$는 중력·코리올리·마찰 같은 비선형 항을 지우며, $\tilde M$은 원하는 가속도를 토크로 바꿉니다. 비선형 로봇을 되먹임으로 선형 시스템처럼 보이게 하므로 **되먹임 선형화**, 역동역학을 계산하므로 **역동역학 제어**라고도 합니다. 이득은 관성과 무관하게 원하는 $\zeta$, $\omega_n$에서 바로 정해집니다: $K_i=0$이면 $K_d=2\zeta\omega_n$, $K_p=\omega_n^2$.

관절이 $n$개이면 $M(\theta)$는 17단원(라그랑주 동역학)의 $n\times n$ 질량 행렬, $h=c(\theta,\dot\theta)+g(\theta)+$마찰이고 이득은 $k_pI$, $k_dI$, $k_iI$입니다. 모델이 정확하면 관절마다 서로 독립인 같은 선형 오차 동역학이 됩니다. 질량 행렬이 거의 대각인 직교 로봇이나 감속비가 큰 로봇은 관절마다 따로 PID를 거는 **분산 제어**로도 충분하지만, 결합이 강하면 모든 관절의 상태를 함께 쓰는 **중앙 제어**가 필요합니다.

:::ex 예제 4 — 토크 계산
예제 3의 링크($M=0.5$, $m=1$, $r=0.1$, $b=0.1$, $g=9.81$)를 계산 토크로 제어한다. $\zeta=1$, $\omega_n=10$이 되게 $K_p$, $K_d$를 고르고($K_i=0$), $\theta=0$, $\dot\theta=0$, $\theta_d=0.1$, $\dot\theta_d=\ddot\theta_d=0$일 때 토크를 구하라.
---
$K_d=2\zeta\omega_n=20$, $K_p=\omega_n^2=100$. 원하는 가속도 $0+100(0.1)+20(0)=10$, $\tau=0.5(10)+(1)(9.81)(0.1)\cos0+0.1(0)=5+0.981=5.981\ \mathrm{N\,m}$. 이 순간 중력 보상이 0.981, 오차를 줄이는 몫이 5입니다. 정착 시간은 약 $4/10=0.4$ s.
:::

모델 전체를 서보 주기마다 계산하기 어렵다면, 목표가 고정일 때는 중력만 보상해도 됩니다.

:::key PD 제어와 중력 보상
$$\tau=K_p\theta_e+K_d\dot\theta_e+\tilde g(\theta)$$
중력 보상이 정확하고 $\dot\theta_d=0$이면 오차 에너지 $V=\tfrac12\theta_e^TK_p\theta_e+\tfrac12\dot\theta^TM(\theta)\dot\theta$가 $\dot V=-\dot\theta^TK_d\dot\theta\le0$으로 줄어, 어떤 초기 상태에서도 $\theta_d$에 멈춘다.
:::

:::note 작업 공간의 계산 토크
끝점 궤적 $(X_d,\mathcal V_d)$를 직접 따라가려면, 작업 공간 동역학으로 원하는 끝점 가속도를 렌치로 바꾸고 $\tau=J_b^T(\theta)\mathcal F_b$로 관절 토크를 얻습니다. 역기구학을 매번 풀지 않는 대신 특이점 근처에서는 조심해야 합니다.
:::
` },
    ],
    problems: [
      { sec: '11.2', type: 'num', lv: 1, q: R`감쇠비 $\zeta=0.5$인 2차 오차 동역학의 넘침은 몇 %인가?`, ans: '100*exp(-pi*0.5/sqrt(0.75))', ansTex: R`16.3`,
        sol: R`$e^{-\pi\zeta/\sqrt{1-\zeta^2}}=e^{-1.814}\approx0.163$.` },
      { sec: '11.2', type: 'num', lv: 1, q: R`$\zeta=0.5$, $\omega_n=4$ rad/s일 때 2% 정착 시간의 근사값(초)은?`, ans: '2', ansTex: R`2`,
        sol: R`$4/(\zeta\omega_n)=4/2$.` },
      { sec: '11.2', type: 'num', lv: 1, q: R`시간 상수 $\tau=0.2$ s인 1차 오차 동역학의 2% 정착 시간을 정확히 구하면(초)?`, ans: '0.2*ln(50)', ansTex: R`0.782`,
        sol: R`$e^{-t/\tau}=0.02$에서 $t=\tau\ln50\approx3.91\tau$.` },
      { sec: '11.2', type: 'num', lv: 2, q: R`$m=2$, $b=4$, $k=8$인 질량–용수철–감쇠기 $m\ddot e+b\dot e+ke=0$의 감쇠비는?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$\zeta=b/(2\sqrt{km})=4/(2\cdot4)$.` },
      { sec: '11.2', type: 'mc', lv: 2, q: R`특성 방정식이 $s^3+2s^2+3s+7=0$인 오차 동역학은?`,
        choices: [R`계수가 모두 양수이므로 안정`, R`$a_2a_1=6<a_0=7$이므로 불안정`, R`임계 감쇠`, R`1차 동역학과 같다`], ans: 1,
        sol: R`3차는 계수가 양수인 것만으로 부족하고 $a_2a_1>a_0$가 필요합니다.` },
      { sec: '11.3', type: 'num', lv: 1, q: R`속도 입력 P 제어 $\dot\theta=K_p\theta_e$($K_p=10$)로 등속 $\dot\theta_d=0.5$ rad/s인 목표를 따라간다. 정상 상태 오차(rad)는?`, ans: '0.05', ansTex: R`0.05`,
        sol: R`$\dot\theta_e+K_p\theta_e=c$에서 $e_{ss}=c/K_p$.` },
      { sec: '11.3', type: 'num', lv: 2, q: R`속도 입력 PI 제어에서 $K_p=20$일 때 임계 감쇠가 되는 $K_i$는?`, ans: '100', ansTex: R`100`,
        sol: R`$\zeta=K_p/(2\sqrt{K_i})=1$ → $K_i=K_p^2/4$.` },
      { sec: '11.3', type: 'num', lv: 2, q: R`같은 PI 제어에서 $K_p=20$, $K_i=400$이면 감쇠비는?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$\omega_n=20$, $\zeta=20/40$.` },
      { sec: '11.3', type: 'mc', lv: 1, q: R`되먹임 제어에 앞먹임 항 $\dot\theta_d$를 더하는 이유로 가장 알맞은 것은?`,
        choices: [R`센서가 필요 없어지므로`, R`오차가 생기기 전에 목표 속도로 움직이기 시작하게 하려고`, R`안정성을 해치지 않고 $K_p$를 무한히 키우려고`, R`적분기 와인드업을 막으려고`], ans: 1,
        sol: R`되먹임만으로는 오차가 생겨야 움직입니다. 앞먹임이 궤적의 속도를 미리 주고, 되먹임은 남은 오차만 고칩니다.` },
      { sec: '11.4a', type: 'num', lv: 1, q: R`$M=0.5$, $b=0.1$인 관절에 $K_p=2$, $K_d=1.9$로 PD 제어를 한다($g=0$). 고유 진동수 $\omega_n$은?`, ans: '2', ansTex: R`2`,
        sol: R`$\sqrt{K_p/M}=\sqrt4$. 감쇠비는 $(b+K_d)/(2\sqrt{K_pM})=1$.` },
      { sec: '11.4a', type: 'num', lv: 2, q: R`같은 관절을 PID로 제어할 때 안정을 유지하는 $K_i$의 상한은?`, ans: '8', ansTex: R`8`,
        sol: R`$(b+K_d)K_p/M=2\cdot2/0.5=8$.` },
      { sec: '11.4a', type: 'num', lv: 2, q: R`$m=1$ kg, $r=0.1$ m, $g=9.81$인 링크를 수직면에서 $\theta_d=0$(수평)에 PD 제어한다($K_p=20$). $\cos\theta\approx1$로 근사하면 멈춘 오차(rad)는?`, ans: '0.981/20', ansTex: R`0.049`,
        sol: R`$K_p\theta_e=mgr\cos\theta\approx0.981$. 정확히 풀면 $0.0490$으로 거의 같습니다.` },
      { sec: '11.4a', type: 'mc', lv: 2, q: R`중력이 있을 때 PD 제어로 정상 상태 오차가 남는 이유는?`,
        choices: [R`감쇠비가 1보다 작아서`, R`링크를 붙잡을 토크를 내려면 $K_p\theta_e\ne0$, 곧 오차가 있어야 해서`, R`$K_d$가 너무 커서`, R`앞먹임이 없어서 넘침이 생기므로`], ans: 1,
        sol: R`멈춘 상태에서 PD의 토크는 $K_p\theta_e$뿐입니다. 적분 항이나 중력 보상이 있으면 오차 없이 그 토크를 낼 수 있습니다.` },
      { sec: '11.4b', type: 'num', lv: 2, q: R`예제 4의 링크에서 $\theta=\pi/3$, $\dot\theta=1$, $\ddot\theta_d=2$, $\theta_e=0.1$, $\dot\theta_e=-0.5$일 때 계산 토크($K_p=100$, $K_d=20$, $K_i=0$)는?`, ans: '0.5*(2+10-10)+0.981*cos(pi/3)+0.1', ansTex: R`1.59`,
        sol: R`원하는 가속도 $2+100(0.1)+20(-0.5)=2$, $\tau=0.5(2)+0.981\cos60°+0.1(1)=1+0.4905+0.1\approx1.59$.` },
      { sec: '11.4b', type: 'open', lv: 2, proof: true, q: R`$n$관절 로봇 $\tau=M(\theta)\ddot\theta+h(\theta,\dot\theta)$에 정확한 모델로 계산 토크 제어($K_i=0$)를 걸 때 오차 동역학을 유도하고, 모든 관절이 $\zeta=1$, 정착 시간 $0.4$ s가 되도록 $k_p$, $k_d$를 고르세요.`,
        sol: R`
제어 법칙을 동역학에 넣으면 $M(\theta)\ddot\theta+h=M(\theta)(\ddot\theta_d+K_p\theta_e+K_d\dot\theta_e)+h$.
$h$가 지워지고, $M(\theta)$는 양의 정부호라 역행렬이 있으므로 $\ddot\theta=\ddot\theta_d+K_p\theta_e+K_d\dot\theta_e$, 곧 $\ddot\theta_e+K_d\dot\theta_e+K_p\theta_e=0$.
$K_p=k_pI$, $K_d=k_dI$이면 관절마다 독립인 $\ddot\theta_{e,i}+k_d\dot\theta_{e,i}+k_p\theta_{e,i}=0$.
$t_s\approx4/(\zeta\omega_n)=0.4$, $\zeta=1$ → $\omega_n=10$. $k_d=2\zeta\omega_n=20$, $k_p=\omega_n^2=100$.`,
        rubric: R`
- 제어 법칙 대입과 h의 상쇄 — 3점
- M의 가역성으로 선형 오차 동역학 도출 — 3점
- 관절별 분리 설명 — 1점
- 정착 시간에서 이득 계산 — 3점` },
    ],
  });
})();
