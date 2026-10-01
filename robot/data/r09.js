/* 09 지수곱 정기구학 — MR 4.1 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 9, part: 'C', title: '지수곱 정기구학', en: 'Forward Kinematics: Product of Exponentials', ref: 'MR 4.1', plot: 'rbWorkspace',
    fig: R`평면 2R 팔 끝점이 관절각 격자에 따라 찍히는 점들. 곧게 편 바깥 경계와 접힌 안쪽 경계 사이를 채운다`,
    tagline: R`영 자세에서 관절마다 나사 축 하나만 적어 두면 됩니다. 관절각이 주어지면 그 나사 운동을 차례로 곱해 끝점의 자세가 나옵니다.`,
    summary: R`**정기구학**은 관절각 $\theta$에서 끝점 좌표계의 자세 $T(\theta)\in SE(3)$를 구하는 일입니다. 지수곱(PoE) 방법은 링크마다 좌표계를 붙이는 대신 두 가지만 씁니다: 모든 관절각이 0인 **영 자세**에서의 끝점 자세 $M$, 그리고 영 자세에서 {s}로 쓴 관절의 **나사 축** $\mathcal S_i$(회전 관절은 $(\omega_i,-\omega_i\times q_i)$, 병진 관절은 $(0,v_i)$). 그러면 $T(\theta)=e^{[\mathcal S_1]\theta_1}e^{[\mathcal S_2]\theta_2}\cdots e^{[\mathcal S_n]\theta_n}M$ — 끝 관절부터 차례로 움직였다고 생각하면, 앞 관절이 뒤쪽 축을 옮기지 않은 상태에서 각 나사 운동을 적용할 수 있기 때문입니다. 나사 축을 끝점 좌표계 {b}로 쓰면 $T(\theta)=Me^{[\mathcal B_1]\theta_1}\cdots e^{[\mathcal B_n]\theta_n}$, $\mathcal B_i=[\mathrm{Ad}_{M^{-1}}]\mathcal S_i$입니다.`,
    goals: [
      R`영 자세, 끝점 자세 $M$, 관절의 나사 축을 정할 수 있다`,
      R`회전·병진 관절의 나사 축을 공간 좌표계에서 쓸 수 있다`,
      R`공간 형태의 지수곱 공식으로 정기구학을 계산할 수 있다`,
      R`물체 형태의 지수곱 공식과 두 형태의 관계를 설명할 수 있다`,
      R`지수곱 공식이 성립하는 이유를 설명할 수 있다`,
    ],
    secTitles: { '4.1.1': '공간 형태의 지수곱', '4.1.2': '예제', '4.1.3': '물체 형태의 지수곱' },
    sections: [
      { k: '4.1.1', p: 141, title: '공간 형태의 지수곱 공식', body: R`
:::key 지수곱 공식 (공간 형태)
1. 고정 좌표계 {s}와 끝점 좌표계 {b}를 정하고, 모든 관절각이 0인 영 자세에서 $M=T_{sb}(0)$을 구한다.
2. 영 자세에서 관절 $i$의 나사 축 $\mathcal S_i=(\omega_i,v_i)$를 {s}로 쓴다.
 회전 관절: $\omega_i$ = 단위 회전축, $v_i=-\omega_i\times q_i$ ($q_i$: 축 위의 아무 점). 병진 관절: $\omega_i=0$, $v_i$ = 단위 이동 방향.
3. $$T(\theta)=e^{[\mathcal S_1]\theta_1}e^{[\mathcal S_2]\theta_2}\cdots e^{[\mathcal S_n]\theta_n}M$$
:::

곱의 순서가 중요합니다. 바닥 쪽 관절이 왼쪽입니다. 끝 관절 $n$만 $\theta_n$만큼 움직이면 끝점은 $e^{[\mathcal S_n]\theta_n}M$. 이어서 관절 $n-1$을 움직이면 관절 $n-1$보다 바깥 부분 전체(관절 $n$의 축 포함)가 강체처럼 $e^{[\mathcal S_{n-1}]\theta_{n-1}}$만큼 움직입니다. 관절 $n-1$의 축은 관절 $n$의 운동에 영향받지 않으므로 영 자세의 $\mathcal S_{n-1}$을 그대로 씁니다. 바닥까지 반복하면 공식이 됩니다.

:::fig rPoeStack
:::

:::warn 영 자세의 축으로 적는다
$\mathcal S_i$는 **영 자세에서의** 축입니다. 실제로 팔이 움직인 뒤의 축 위치를 넣으면 앞 관절의 운동을 두 번 세게 됩니다.
:::

:::sim poe ur5
교재 예제 4.5의 UR5 산업용 팔입니다. 관절 막대를 움직이면 팔과 $T(\theta)$가 함께 바뀌고, 흐린 팔이 영 자세입니다. ‘끝 관절부터 쌓기’를 켜고 $k$를 0, 1, 2, …로 올리면 위 그림처럼 끝 관절부터 하나씩 돌린 중간 단계가 보입니다. 아래의 나사 축 $\mathcal S_i$는 관절을 아무리 돌려도 바뀌지 않습니다 — 언제나 영 자세에서 적은 값입니다.
:::
` },
      { k: '4.1.2', p: 143, title: '예제: 평면 3R 팔과 RP 팔', body: R`
:::fig rThreeR
:::

:::ex 예제 1 — 평면 3R 팔
링크 길이 $L_1,L_2,L_3$인 평면 3R 팔의 정기구학을 지수곱으로 쓰세요.
---
{s}는 관절 1에, {b}는 팔 끝에, 영 자세는 팔을 $\hat x_s$ 방향으로 편 자세. $M=\begin{bmatrix}I&(L_1+L_2+L_3,0,0)^T\\0&1\end{bmatrix}$.
모든 축 $\omega_i=\hat z$, $q_1=0$, $q_2=(L_1,0,0)$, $q_3=(L_1+L_2,0,0)$. $v_i=-\hat z\times q_i=(0,-q_{i,x},0)$:
$\mathcal S_1=(0,0,1,0,0,0)$, $\mathcal S_2=(0,0,1,0,-L_1,0)$, $\mathcal S_3=(0,0,1,0,-(L_1+L_2),0)$.
$T=e^{[\mathcal S_1]\theta_1}e^{[\mathcal S_2]\theta_2}e^{[\mathcal S_3]\theta_3}M$를 계산하면 끝점은
$x=L_1c_1+L_2c_{12}+L_3c_{123}$, $y=L_1s_1+L_2s_{12}+L_3s_{123}$, 방향각 $\theta_1+\theta_2+\theta_3$ — 기하로 얻는 결과와 같습니다.
:::

:::sim poe planar
예제 1의 평면 3R 팔($L_1=1$, $L_2=0.8$, $L_3=0.5$)입니다. 아래 행렬의 위치 부분이 $x=L_1c_1+L_2c_{12}+L_3c_{123}$, $y=L_1s_1+L_2s_{12}+L_3s_{123}$과 같은지, 회전 부분의 각이 $\theta_1+\theta_2+\theta_3$인지 확인해 보세요.
:::

:::ex 예제 2 — RP 팔
바닥이 $\hat z$ 둘레로 돌고($\theta_1$), 그 위의 팔이 자기 방향으로 늘어나는($\theta_2$) 평면 팔. 영 자세에서 끝점은 $(L_0,0,0)$.
---
$\mathcal S_1=(0,0,1,0,0,0)$, 병진 관절은 영 자세에서 $\hat x$ 방향: $\mathcal S_2=(0,0,0,1,0,0)$.
$e^{[\mathcal S_2]\theta_2}M$은 끝점을 $(L_0+\theta_2,0,0)$으로, $e^{[\mathcal S_1]\theta_1}$이 그것을 돌려 끝점 $\big((L_0+\theta_2)\cos\theta_1,(L_0+\theta_2)\sin\theta_1,0\big)$ — 극좌표 그대로입니다.
:::
` },
      { k: '4.1.3', p: 148, title: '물체 형태의 지수곱 공식', body: R`
$e^{[\mathcal S]\theta}M=Me^{[M^{-1}\mathcal SM]\theta}$ (행렬 지수는 닮음 변환과 바꿔 쓸 수 있음)를 되풀이해 $M$을 맨 앞으로 옮깁니다.

:::key 지수곱 공식 (물체 형태)
$$T(\theta)=Me^{[\mathcal B_1]\theta_1}e^{[\mathcal B_2]\theta_2}\cdots e^{[\mathcal B_n]\theta_n},\qquad\mathcal B_i=[\mathrm{Ad}_{M^{-1}}]\mathcal S_i$$
$\mathcal B_i$는 영 자세에서 관절 $i$의 나사 축을 **끝점 좌표계 {b}**로 쓴 것.
:::

:::ex 예제 3
예제 1의 3R 팔의 $\mathcal B_i$는?
---
{b}에서 관절들은 $(-L_3,0,0)$, $(-(L_2+L_3),0,0)$, $(-(L_1+L_2+L_3),0,0)$에 있고 축은 $\hat z_b$. $v=-\hat z\times q=(0,-q_x,0)$:
$\mathcal B_3=(0,0,1,0,L_3,0)$, $\mathcal B_2=(0,0,1,0,L_2+L_3,0)$, $\mathcal B_1=(0,0,1,0,L_1+L_2+L_3,0)$.
:::

두 형태는 같은 $T(\theta)$를 줍니다. 공간 형태는 바닥에서 본 축, 물체 형태는 손끝에서 본 축을 씁니다. 10단원의 공간·물체 야코비안이 각각 여기서 나옵니다.
` },
    ],
    problems: [
      { sec: '4.1.2', type: 'num', lv: 1, q: R`$L_1=L_2=L_3=1$인 평면 3R 팔이 $\theta=(\pi/2,0,0)$일 때 끝점의 $y$ 좌표는?`, ans: '3', ansTex: R`3`,
        sol: R`팔 전체가 $\hat y$ 방향으로 섭니다.` },
      { sec: '4.1.2', type: 'num', lv: 2, q: R`같은 팔이 $\theta=(0,\pi/2,0)$일 때 끝점의 $y$ 좌표는?`, ans: '2', ansTex: R`2`,
        sol: R`$x=L_1=1$, $y=L_2+L_3=2$.` },
      { sec: '4.1.2', type: 'num', lv: 2, q: R`같은 팔이 $\theta=(\pi/2,-\pi/2,0)$일 때 끝점의 $x$ 좌표는?`, ans: '2', ansTex: R`2`,
        sol: R`$c_1+c_{12}+c_{123}=0+1+1=2$ ($y=1$).` },
      { sec: '4.1.1', type: 'num', lv: 1, q: R`$L_1=0.5$인 평면 3R 팔의 $\mathcal S_2=(\omega,v)$에서 $v$의 $y$ 성분은?`, ans: '-0.5', ansTex: R`-0.5`,
        sol: R`$-\hat z\times(0.5,0,0)=(0,-0.5,0)$.` },
      { sec: '4.1.1', type: 'mc', lv: 1, q: R`병진 관절의 나사 축은?`,
        choices: [R`$(\hat s,-\hat s\times q)$`, R`$(0,\hat v)$ — 회전 부분 0, 단위 이동 방향`, R`$(\hat v,0)$`, R`$(\hat s,h\hat s)$`], ans: 1,
        sol: R`피치가 무한대인 나사입니다.` },
      { sec: '4.1.1', type: 'mc', lv: 2, q: R`공간 형태 지수곱 공식에서 $\mathcal S_i$를 쓸 때 옳은 것은?`,
        choices: [R`현재 자세에서의 관절 축을 쓴다`, R`영 자세에서의 관절 축을 {s}로 쓴다`, R`{b}에서 쓴다`, R`관절 순서와 무관하게 곱한다`], ans: 1,
        sol: R`끝 관절부터 움직였다고 보면 앞 관절의 축은 항상 영 자세 그대로입니다.` },
      { sec: '4.1.3', type: 'num', lv: 1, q: R`$L_1=L_2=L_3=1$인 평면 3R 팔의 물체 나사 축 $\mathcal B_1$에서 $v$의 $y$ 성분은?`, ans: '3', ansTex: R`3`,
        sol: R`$\mathcal B_1=(0,0,1,0,L_1+L_2+L_3,0)$.` },
      { sec: '4.1.3', type: 'mc', lv: 2, q: R`물체 형태의 나사 축 $\mathcal B_i$와 공간 형태의 $\mathcal S_i$의 관계는?`,
        choices: [R`$\mathcal B_i=\mathcal S_i$`, R`$\mathcal B_i=[\mathrm{Ad}_{M^{-1}}]\mathcal S_i$`, R`$\mathcal B_i=[\mathrm{Ad}_M]\mathcal S_i$`, R`$\mathcal B_i=-\mathcal S_i$`], ans: 1,
        sol: R`같은 축을 {b}(영 자세)로 옮겨 쓴 것 — $T_{bs}=M^{-1}$의 수반 행렬.` },
      { sec: '4.1.2', type: 'num', lv: 2, q: R`예제 2의 RP 팔($L_0=0.5$)이 $\theta_1=\pi/2$, $\theta_2=0.3$일 때 끝점의 $y$ 좌표는?`, ans: '0.8', ansTex: R`0.8`,
        sol: R`$(L_0+\theta_2)\sin\theta_1=0.8$.` },
      { sec: '4.1.1', type: 'num', lv: 1, q: R`6R 직렬 팔의 지수곱 공식에는 나사 축이 몇 개 필요한가?`, ans: '6', ansTex: R`6`,
        sol: R`관절마다 하나, 그리고 $M$.` },
      { sec: '4.1.2', type: 'num', lv: 3, q: R`$L_1=L_2=1$, $L_3=0.5$인 평면 3R 팔이 $\theta=(\pi/6,\pi/3,\pi/2)$일 때 끝점의 $x$ 좌표는?`, ans: 'cos(pi/6)+cos(pi/2)+0.5*cos(pi)', ansTex: R`0.366`,
        sol: R`$c_1+c_{12}+0.5c_{123}=0.866+0+0.5(-1)=0.366$.` },
      { sec: '4.1.1', type: 'open', lv: 2, proof: true, q: R`2관절 직렬 팔에 대해 공간 형태 지수곱 공식 $T(\theta)=e^{[\mathcal S_1]\theta_1}e^{[\mathcal S_2]\theta_2}M$을 유도하세요. 관절을 움직이는 순서를 어떻게 잡아야 하며, 왜 두 축 모두 영 자세의 축을 써도 되는지 설명하세요.`,
        sol: R`
영 자세에서 끝점은 $M$.
① 관절 2만 $\theta_2$만큼 움직인다: 관절 2 바깥쪽(링크 2와 끝점)이 축 $\mathcal S_2$ 둘레의 나사 운동을 해서 끝점은 $e^{[\mathcal S_2]\theta_2}M$. 이 동작은 관절 1의 축을 옮기지 않습니다(관절 1은 관절 2보다 바닥 쪽).
② 이어서 관절 1을 $\theta_1$만큼 움직인다: 관절 1 바깥쪽 전체(관절 2의 축과 이미 움직인 링크 2 포함)가 축 $\mathcal S_1$ 둘레로 강체처럼 움직입니다. 관절 1의 축은 여전히 영 자세 그대로이므로 $e^{[\mathcal S_1]\theta_1}$을 왼쪽에 곱합니다: $T=e^{[\mathcal S_1]\theta_1}e^{[\mathcal S_2]\theta_2}M$.
최종 자세는 관절을 어떤 순서로 움직였든 같으므로(자세는 관절각만의 함수) 이 순서로 계산해도 됩니다. 반대 순서(관절 1 먼저)로 하면 관절 2의 축이 이미 옮겨져 있어 $\mathcal S_2$를 새로 계산해야 합니다.`,
        rubric: R`
- 끝 관절부터 움직이는 순서 — 3점
- 각 단계의 변환과 왼쪽 곱 — 4점
- 영 자세 축을 쓸 수 있는 이유(순서 무관성 포함) — 3점` },
    ],
  });
})();
