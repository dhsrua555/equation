/* 14 궤적 생성 — MR 9.1–9.3 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 14, part: 'C', title: '궤적 생성', en: 'Trajectory Generation', ref: 'MR 9.1–9.3', plot: 'rbScaling',
    fig: R`여러 시간 스케일링 s(t): 3차, 5차 다항식과 사다리꼴 속도가 0에서 1까지 가는 모습`,
    tagline: R`어디를 지날지(경로)와 언제 지날지(시간 스케일링)를 나눠 정합니다. 둘을 합치면 모터에 줄 시간의 함수가 됩니다.`,
    summary: R`**궤적**은 시간의 함수 $\theta(t)$이고, **경로** $\theta(s)$ ($s\in[0,1]$)와 **시간 스케일링** $s(t)$ ($t\in[0,T]$)의 합성으로 나눠 설계합니다. 속도와 가속도는 연쇄 법칙으로 $\dot\theta=\frac{d\theta}{ds}\dot s$, $\ddot\theta=\frac{d\theta}{ds}\ddot s+\frac{d^2\theta}{ds^2}\dot s^2$. 가장 단순한 경로는 관절 공간의 직선 $\theta_{\text{start}}+s(\theta_{\text{end}}-\theta_{\text{start}})$이고, 작업 공간에서 곧게 가려면 $X(s)=X_{\text{start}}\exp\big(\log(X_{\text{start}}^{-1}X_{\text{end}})s\big)$처럼 나사 운동을 따라갑니다. 시간 스케일링은 양 끝에서 멈추게 하는 **3차 다항식** $s=3(t/T)^2-2(t/T)^3$, 가속도까지 0으로 부드럽게 하는 **5차 다항식**, 등가속-등속-등감속의 **사다리꼴**이 흔합니다. 경유점을 지나야 하면 구간마다 끝의 위치와 속도를 맞춘 3차 다항식을 잇습니다.`,
    goals: [
      R`경로와 시간 스케일링을 구분하고 합성된 궤적의 속도·가속도를 쓸 수 있다`,
      R`관절 공간과 작업 공간의 직선 경로를 만들 수 있다`,
      R`3차·5차 다항식 시간 스케일링의 계수와 최대 속도·가속도를 구할 수 있다`,
      R`사다리꼴 속도 프로파일의 총 시간을 구할 수 있다`,
      R`경유점을 지나는 3차 다항식 구간의 계수를 구할 수 있다`,
    ],
    secTitles: { '9.1': '경로와 시간 스케일링', '9.2a': '직선 경로', '9.2b': '시간 스케일링', '9.3': '경유점 궤적' },
    sections: [
      { k: '9.1', p: 325, title: '경로와 시간 스케일링', body: R`
:::key 궤적 = 경로 ∘ 시간 스케일링
$$\theta(t)=\theta\big(s(t)\big),\qquad\dot\theta=\frac{d\theta}{ds}\dot s,\qquad\ddot\theta=\frac{d\theta}{ds}\ddot s+\frac{d^2\theta}{ds^2}\dot s^2$$
경로 $\theta(s)$는 기하(어디를 지나는가), 시간 스케일링 $s(t)$는 빠르기(언제 지나는가)를 정한다. $s(0)=0$, $s(T)=1$.
:::

둘을 나누면 같은 경로를 느리게도 빠르게도 지날 수 있어, 모터의 속도·토크 한계를 시간 스케일링만 바꿔 맞출 수 있습니다. 가속도 식의 둘째 항은 경로가 휘어 있으면 속도만으로도 가속이 생긴다는 뜻입니다(원운동의 구심 가속도와 같은 이유).
` },
      { k: '9.2a', p: 326, title: '직선 경로: 관절 공간과 작업 공간', body: R`
:::key 직선 경로
- 관절 공간: $\theta(s)=\theta_{\text{start}}+s(\theta_{\text{end}}-\theta_{\text{start}})$. 관절 제한이 볼록(상자)이면 경로 전체가 제한 안에 있다. 끝점은 일반적으로 곧게 가지 않는다.
- 작업 공간(위치만): $x(s)=x_{\text{start}}+s(x_{\text{end}}-x_{\text{start}})$. 관절각은 역기구학으로 매 순간 구한다.
- 작업 공간(자세 전체): $X(s)=X_{\text{start}}\exp\big(\log(X_{\text{start}}^{-1}X_{\text{end}})\,s\big)$ — 한 나사 축을 따라 일정하게 돌며 미끄러진다. 원점은 곧게 가지 않을 수 있어, 위치는 직선, 방향은 $R_{\text{start}}\exp(\log(R_{\text{start}}^TR_{\text{end}})s)$로 따로 보간하기도 한다.
:::

:::warn 작업 공간 직선의 함정
작업 공간에서 두 점을 잇는 직선이 특이점을 지나거나 작업 공간 밖으로 나가면, 역기구학이 실패하거나 관절 속도가 폭발합니다. 관절 공간 직선은 그런 문제가 없지만 끝점의 길을 예측하기 어렵습니다.
:::
` },
      { k: '9.2b', p: 328, title: '시간 스케일링: 다항식과 사다리꼴', body: R`
:::key 3차·5차 다항식 시간 스케일링
양 끝에서 속도 0($\dot s(0)=\dot s(T)=0$)인 3차: $s(t)=3\big(\tfrac tT\big)^2-2\big(\tfrac tT\big)^3$, 최대 $\dot s=\dfrac3{2T}$ ($t=T/2$), 최대 $\lvert\ddot s\rvert=\dfrac6{T^2}$ (양 끝).
가속도도 0인 5차: $s(t)=10\big(\tfrac tT\big)^3-15\big(\tfrac tT\big)^4+6\big(\tfrac tT\big)^5$, 최대 $\dot s=\dfrac{15}{8T}$, 최대 $\lvert\ddot s\rvert=\dfrac{10}{\sqrt3T^2}$.
:::

:::fig rScaling
:::

:::key 사다리꼴 속도 프로파일
가속도 $a$로 속도 $v$까지 올렸다가 등속, 같은 $a$로 감속. $v^2/a\le1$이면
$$T=\frac{a+v^2}{va}$$
($v^2/a>1$이면 등속 구간 없이 가속-감속만: 최대 속도 $\sqrt a$, $T=2/\sqrt a$.)
:::

:::ex 예제 1
관절 하나를 3차 스케일링으로 2 rad 움직인다. 관절 최대 속도가 1 rad/s이면 가장 짧은 시간은?
---
$\dot\theta=2\dot s$, 최대 $2\cdot\tfrac3{2T}=\tfrac3T\le1$ → $T\ge3$ s. 이때 양 끝의 가속도는 $2\cdot6/9=1.33$ rad/s².
:::
` },
      { k: '9.3', p: 334, title: '경유점을 지나는 3차 다항식 궤적', body: R`
여러 경유점 $\beta_0,\beta_1,\dots$을 시각 $T_0,T_1,\dots$에 지나야 하면, 구간마다 3차 다항식을 쓰고 경유점에서 위치와 속도 $\dot\beta_j$를 맞춰 잇습니다(가속도는 끊길 수 있음).

:::key 경유점 사이의 3차 다항식
구간 $j$ ($\Delta T=T_{j+1}-T_j$, 구간 시작부터 잰 시간 $\Delta t$): $\beta(\Delta t)=a_0+a_1\Delta t+a_2\Delta t^2+a_3\Delta t^3$,
$$a_0=\beta_j,\quad a_1=\dot\beta_j,\quad a_2=\frac{3\beta_{j+1}-3\beta_j-2\dot\beta_j\Delta T-\dot\beta_{j+1}\Delta T}{\Delta T^2},\quad a_3=\frac{2\beta_j+(\dot\beta_j+\dot\beta_{j+1})\Delta T-2\beta_{j+1}}{\Delta T^3}$$
:::

:::ex 예제 2
$\beta_0=0$ (속도 0)에서 1초 뒤 $\beta_1=1$을 속도 1로 지나야 한다. 구간의 계수는?
---
$a_0=0$, $a_1=0$, $a_2=(3-0-0-1)/1=2$, $a_3=(0+1-2)/1=-1$. $\beta(t)=2t^2-t^3$: $\beta(1)=1$, $\dot\beta(1)=4-3=1$ ✓.
:::

경유점의 속도를 어떻게 고를지가 궤적의 모양을 정합니다. 흔한 선택은 이웃 두 구간 기울기의 평균(부호가 바뀌면 0)입니다.
` },
    ],
    problems: [
      { sec: '9.2b', type: 'num', lv: 1, q: R`$T=2$ s인 3차 시간 스케일링의 최대 $\dot s$ (1/s)는?`, ans: '0.75', ansTex: R`0.75`,
        sol: R`$3/(2T)$.` },
      { sec: '9.2b', type: 'num', lv: 1, q: R`3차 시간 스케일링에서 $s(T/2)$는?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$3/4-2/8=1/2$ — 대칭이라 절반 시간에 절반.` },
      { sec: '9.2b', type: 'num', lv: 2, q: R`관절 하나를 3차 스케일링으로 $T=2$ s 동안 2 rad 움직인다. 관절의 최대 속도(rad/s)는?`, ans: '1.5', ansTex: R`1.5`,
        sol: R`$2\times3/(2\cdot2)=1.5$.` },
      { sec: '9.2b', type: 'num', lv: 2, q: R`2 rad를 3차 스케일링으로 움직이는데 관절 최대 속도가 1 rad/s이다. 가장 짧은 시간(s)은?`, ans: '3', ansTex: R`3`,
        sol: R`$2\cdot3/(2T)\le1$.` },
      { sec: '9.2b', type: 'num', lv: 2, q: R`$T=1$ s인 5차 시간 스케일링의 최대 $\lvert\ddot s\rvert$는?`, ans: '10/sqrt(3)', ansTex: R`5.77`,
        sol: R`$\ddot s=60\tau-180\tau^2+120\tau^3$의 최대는 $\tau=\tfrac12\mp\tfrac{\sqrt3}6$에서 $10/\sqrt3$.` },
      { sec: '9.2b', type: 'num', lv: 2, q: R`사다리꼴 스케일링에서 $v=1.25$, $a=5$일 때 총 시간 $T$는?`, ans: '(5+1.25^2)/(1.25*5)', ansTex: R`1.05`,
        sol: R`$v^2/a=0.3125\le1$ → $T=(a+v^2)/(va)=1.05$.` },
      { sec: '9.2b', type: 'mc', lv: 2, q: R`3차 대신 5차 다항식 스케일링을 쓰는 주된 이유는?`,
        choices: [R`더 빨리 도착한다`, R`양 끝의 가속도도 0이라 출발·정지 때 가속도가 튀지 않는다`, R`최대 속도가 작다`, R`계산이 간단하다`], ans: 1,
        sol: R`3차는 양 끝에서 가속도가 $6/T^2$로 계단처럼 튑니다. 대신 5차는 최대 속도가 더 큽니다.` },
      { sec: '9.1', type: 'mc', lv: 2, q: R`궤적 $\theta(s(t))$의 가속도 $\ddot\theta$에 대해 옳은 것은?`,
        choices: [R`$\frac{d\theta}{ds}\ddot s$뿐이다`, R`$\frac{d\theta}{ds}\ddot s+\frac{d^2\theta}{ds^2}\dot s^2$ — 휘어진 경로에서는 속도만으로도 가속이 생긴다`, R`항상 0이다`, R`$\ddot s$에 무관하다`], ans: 1,
        sol: R`연쇄 법칙을 두 번 적용한 결과입니다.` },
      { sec: '9.2a', type: 'mc', lv: 2, q: R`두 자세 $X_{\text{start}}$, $X_{\text{end}}\in SE(3)$ 사이를 한 나사 운동으로 일정하게 잇는 경로는?`,
        choices: [R`$X_{\text{start}}+s(X_{\text{end}}-X_{\text{start}})$`, R`$X_{\text{start}}\exp\big(\log(X_{\text{start}}^{-1}X_{\text{end}})s\big)$`, R`$\exp(sX_{\text{end}})$`, R`관절각의 선형 보간`], ans: 1,
        sol: R`행렬을 선형 보간하면 중간이 $SE(3)$에 속하지 않습니다.` },
      { sec: '9.3', type: 'num', lv: 2, q: R`$\beta_0=0$에서 1초 뒤 $\beta_1=1$에 도착하며 양 끝 속도가 0이다. 3차 다항식의 $a_3$은?`, ans: '-2', ansTex: R`-2`,
        sol: R`$a_2=3$, $a_3=-2$ — 3차 시간 스케일링과 같습니다.` },
      { sec: '9.3', type: 'num', lv: 2, q: R`$\beta_0=0$ (속도 0)에서 1초 뒤 $\beta_1=1$을 속도 1로 지난다. $a_2$는?`, ans: '2', ansTex: R`2`,
        sol: R`$(3-0-0-1)/1=2$.` },
      { sec: '9.2b', type: 'open', lv: 2, proof: true, q: R`조건 $s(0)=0$, $s(T)=1$, $\dot s(0)=\dot s(T)=0$을 만족하는 3차 다항식 $s(t)$를 구하고, 최대 속도 $3/(2T)$와 최대 가속도 $6/T^2$를 보이세요.`,
        sol: R`
$s=a_0+a_1t+a_2t^2+a_3t^3$. $s(0)=0$ → $a_0=0$, $\dot s(0)=0$ → $a_1=0$.
$s(T)=a_2T^2+a_3T^3=1$, $\dot s(T)=2a_2T+3a_3T^2=0$ → $a_2=\dfrac3{T^2}$, $a_3=-\dfrac2{T^3}$.
$\dot s=\dfrac{6t}{T^2}-\dfrac{6t^2}{T^3}$은 $\ddot s=\dfrac6{T^2}-\dfrac{12t}{T^3}=0$인 $t=T/2$에서 최대 $\dfrac3T-\dfrac3{2T}=\dfrac3{2T}$.
$\ddot s$는 $t$의 일차식이라 양 끝에서 절댓값이 최대: $\ddot s(0)=6/T^2$, $\ddot s(T)=-6/T^2$.`,
        rubric: R`
- 경계 조건으로 계수 — 4점
- 최대 속도 — 3점
- 최대 가속도 — 3점` },
    ],
  });
})();
