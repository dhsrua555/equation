/* 05 움직이는 좌표계와 각속도 — MR 3.2.2 · 강의 자료 Week 4(9월 28일: 각속도, 움직이는 좌표계로 본 속도와 가속도) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 5, part: 'A', title: '움직이는 좌표계와 각속도', en: 'Moving Frames & Angular Velocity', ref: 'MR 3.2.2 · 강의 Week 4', plot: 'rbMoving',
    fig: R`돌아가는 원판 위에서 바깥으로 기어가는 벌레가 고정 좌표계에 남기는 나선 궤적. 원판 위에서는 직선이지만 밖에서 보면 휘어 나간다`,
    tagline: R`물체에 붙은 좌표계는 함께 움직이므로 그 축의 방향도 시간에 따라 바뀝니다. 축의 미분 $\dot{\hat x}_b=\omega\times\hat x_b$ 하나에서 속도의 세 항과 가속도의 다섯 항이 모두 나옵니다.`,
    summary: R`물체가 순간적으로 단위 축 $\hat w$ 둘레로 $\dot\theta$의 빠르기로 돌 때 **각속도**는 $\omega=\hat w\dot\theta$입니다. 물체에 붙은 좌표계 {b}의 단위 축은 길이가 변하지 않고 방향만 바뀌므로 $\dot{\hat x}_b=\omega\times\hat x_b$ (나머지 두 축도 같음)이고, 세 축을 모으면 $\dot R=[\omega_s]R$ — $[\omega]$는 $[\omega]x=\omega\times x$인 반대칭 행렬입니다. 움직이는 {b}에서 좌표 $(x,y,z)$로 적힌 점은 $p=o_b+x\hat x_b+y\hat y_b+z\hat z_b$이므로, 미분하면 **속도** $v_p=v_o+v_{\text{rel}}+\omega\times r$ ({b} 원점의 속도 + {b} 안에서 본 속도 + {b}의 회전이 실어 나르는 속도), 한 번 더 미분하면 **가속도** $a_p=a_o+a_{\text{rel}}+2\omega\times v_{\text{rel}}+\dot\omega\times r+\omega\times(\omega\times r)$ — 코리올리 항, 접선 항, 구심 항이 축의 미분에서 나옵니다. 좌표계를 이어 붙이면 각속도는 더해집니다: $\omega_{sc}=\omega_{sb}+\omega_{bc}$(같은 좌표계에서 적을 때).`,
    goals: [
      R`각속도 벡터의 방향과 크기의 뜻을 설명하고, 물체 축의 미분이 $\omega\times\hat x_b$임을 보일 수 있다`,
      R`반대칭 행렬을 쓰고 $\dot RR^{-1}$, $R^{-1}\dot R$에서 고정·물체 좌표계의 각속도를 구할 수 있다`,
      R`움직이는 좌표계로 점의 속도를 세 항으로 나누어 계산할 수 있다`,
      R`가속도의 다섯 항(상대, 코리올리, 접선, 구심, 원점)을 유도하고 방향을 그릴 수 있다`,
      R`이어진 관절의 각속도를 더해 링크의 각속도를 구할 수 있다(스탠퍼드 팔)`,
    ],
    secTitles: { '3.2.2': '각속도', 'W4.1': '움직이는 좌표계의 속도', 'W4.2': '가속도와 코리올리 항' },
    sections: [
      { k: '3.2.2', p: 76, src: '강의 자료 · Week 4', title: '각속도', body: R`
:::fig rAngVel
:::

물체를 아주 짧은 시간 $\Delta t$ 동안 보면, 처음 자세에서 나중 자세로 가는 변화는 원점을 지나는 어떤 단위 축 $\hat w$ 둘레의 작은 회전 $\Delta\theta$입니다. $\Delta t\to0$으로 보내면 $\hat w$는 **순간 회전축**, $\Delta\theta/\Delta t\to\dot\theta$는 회전의 빠르기가 됩니다. 둘을 곱한 벡터 $\omega=\hat w\dot\theta$가 **각속도**입니다 — 방향은 오른손 법칙으로 본 회전축, 길이는 초당 라디안.

물체에 붙은 단위 축 $\hat x_b$는 길이가 1로 고정되어 있으므로 끝점이 $\omega$ 축 둘레의 원 위를 돕니다. 원의 반지름은 $\sin\angle(\omega,\hat x_b)$, 각속도는 $\lVert\omega\rVert$, 움직이는 방향은 $\omega$와 $\hat x_b$ 모두에 수직 — 정확히 외적입니다.

:::key 물체 축의 미분
$$\dot{\hat x}_b=\omega\times\hat x_b,\qquad\dot{\hat y}_b=\omega\times\hat y_b,\qquad\dot{\hat z}_b=\omega\times\hat z_b$$
움직이는 좌표계를 쓰는 모든 계산(속도, 가속도, 야코비안)이 이 규칙 하나에서 나온다.
:::

세 축을 모으면 $\dot R=[\omega\times\hat x_b\ \ \omega\times\hat y_b\ \ \omega\times\hat z_b]$. 외적을 행렬 곱으로 쓰기 위해 반대칭 행렬을 씁니다.

:::key 반대칭 행렬
$$[x]=\begin{bmatrix}0&-x_3&x_2\\x_3&0&-x_1\\-x_2&x_1&0\end{bmatrix},\qquad[x]y=x\times y,\qquad[x]^T=-[x]$$
회전 행렬에 대해 $R[\omega]R^T=[R\omega]$.
:::

:::key 고정·물체 좌표계의 각속도
$$\dot RR^{-1}=[\omega_s],\qquad R^{-1}\dot R=[\omega_b],\qquad\omega_s=R\,\omega_b$$
$\omega_s$와 $\omega_b$는 같은 각속도를 {s}와 {b}의 좌표로 쓴 것이다. $\omega_b$는 움직이는 {b}의 “그 순간” 축에 대한 성분.
:::

:::note 강의에서는
9월 28일 강의는 위의 직관(축의 끝이 원을 그린다)까지를 다루고, $\dot RR^{-1}$로 각속도를 행렬에서 꺼내는 형식적인 증명은 10월 말(속도 기구학, 중간고사 2 범위)에 다시 합니다. 이 절에서는 둘을 함께 정리해 둡니다.
:::

:::ex 예제 1
$R(t)=\mathrm{Rot}(\hat z,t)\,\mathrm{Rot}(\hat x,2t)$이다. $\omega_s$와 $\omega_b$는?
---
$R=R_zR_x$에서 $\dot R=\dot R_zR_x+R_z\dot R_x$, $\dot R_z=[\hat z]R_z$, $\dot R_x=R_x[2\hat x]$(한 축 둘레 회전은 앞뒤 어느 쪽에 써도 같음).
$\dot RR^T=[\hat z]+R_z[2\hat x]R_z^T=[\hat z+2R_z\hat x]$ → $\omega_s=(2\cos t,\ 2\sin t,\ 1)$.
$R^T\dot R=R_x^T[\hat z]R_x+[2\hat x]=[R_x^T\hat z+2\hat x]$ → $\omega_b=(2,\ \sin2t,\ \cos2t)$.
크기는 둘 다 $\sqrt5$ — 좌표만 다를 뿐 같은 벡터입니다.
:::

예제 1의 $\omega_s=\hat z+2R_z\hat x$는 “바깥 관절의 각속도 + 안쪽 관절이 실어 나른 둘째 관절의 각속도”입니다. 일반적으로 좌표계를 이어 붙이면 각속도가 더해집니다.

:::key 각속도의 덧셈
$$R_{sc}=R_{sb}R_{bc}\ \Rightarrow\ \omega_{sc}=\omega_{sb}+R_{sb}\,\omega_{bc}\quad(\text{모두 \{s\} 좌표})$$
{c}의 각속도 = {b}가 도는 각속도 + {b} 안에서 {c}가 도는 각속도. 각속도는 벡터처럼 더해지지만 회전각(유한 회전)은 더해지지 않는다.
:::
` },
      { k: 'W4.1', label: '강의 4.1', src: '강의 자료 · Week 4', title: '움직이는 좌표계의 속도', body: R`
점 $p(t)$를 고정 좌표계 {s}에서 미분하는 것은 쉽습니다. {s}의 축은 시간에 따라 변하지 않으므로 좌표만 미분하면 됩니다. 하지만 원판, 링크, 손처럼 **움직이는 물체 위의 좌표**로 점을 적으면 이야기가 달라집니다.

:::fig rMovingFrame
:::

물체에 {b}를 붙이고, {b}의 원점 $o_b$를 {s}에서 본 위치를 $o_b(t)$, 점 $p$를 {b}에서 잰 좌표를 $(x,y,z)$라 하면
$$p=o_b+x\,\hat x_b+y\,\hat y_b+z\,\hat z_b.$$
미분하면 항이 셋으로 나뉩니다.
$$\dot p=\underbrace{\dot o_b}_{\{b\}\text{ 원점의 속도}}+\underbrace{\dot x\,\hat x_b+\dot y\,\hat y_b+\dot z\,\hat z_b}_{\{b\}\text{ 안에서 본 속도 }v_{\text{rel}}}+\underbrace{x\,\dot{\hat x}_b+y\,\dot{\hat y}_b+z\,\dot{\hat z}_b}_{\text{축이 돌아서 생기는 항}}$$
셋째 묶음에 축의 미분 규칙을 넣으면 $\omega\times(x\hat x_b+y\hat y_b+z\hat z_b)=\omega\times r$, $r=p-o_b$입니다.

:::key 움직이는 좌표계의 속도
$$v_p=v_o+v_{\text{rel}}+\omega\times r,\qquad r=p-o_b$$
$v_o$: {b} 원점의 속도, $v_{\text{rel}}=\dot x\hat x_b+\dot y\hat y_b+\dot z\hat z_b$: {b}에 탄 관찰자가 보는 속도, $\omega\times r$: 점이 {b}에 붙어 있기만 해도 {b}의 회전 때문에 생기는 속도.
:::

:::idea 한눈에: 회전 목마 위의 걸음
돌아가는 회전 목마 위에서 걷는 사람의 땅에 대한 속도는 “걸음(상대 속도) + 그 자리 바닥이 움직이는 속도”입니다. 바닥의 속도가 $\omega\times r$이고, 그것은 사람이 가만히 서 있어도 남습니다. 고정 좌표계만 쓰는 계산과 비교해 새로 생기는 것은 이 항 하나뿐입니다.
:::

:::ex 예제 2 — 돌아가는 원판 위를 기어가는 벌레
원판이 $\hat z_b$(축) 둘레로 $\Omega=\dot\theta$로 돌고, {b}는 원판 중심에 붙어 함께 돈다. 벌레는 $\hat y_b$ 방향 반지름을 따라 중심에서 $s(t)$인 곳을 기어간다. 벌레의 속도는? $\Omega=2$ rad/s, $\dot s=0.1$ m/s, $s=0.3$ m일 때 속력은?
---
$o_b$는 고정이라 $v_o=0$. $r=s\hat y_b$, $v_{\text{rel}}=\dot s\hat y_b$, $\omega=\Omega\hat z_b$.
$\omega\times r=\Omega s\,(\hat z_b\times\hat y_b)=-\Omega s\,\hat x_b$.
$$v=\dot s\,\hat y_b-\Omega s\,\hat x_b$$
반지름 방향으로 기는 속도 $\dot s$와, 원판이 그 자리에서 휩쓸고 가는 속도 $\Omega s$(원의 접선, $-\hat x_b$ 방향)의 합입니다. 수치로는 $v=0.1\hat y_b-0.6\hat x_b$, 속력 $\sqrt{0.01+0.36}\approx0.608$ m/s.
:::

:::fig rBugDisk
:::

### 스탠퍼드 팔: 관절 속도를 더해 각속도 얻기
기둥이 $\hat z_s$ 둘레로 $\theta_1$, 어깨가 팔 방향에 수직인 축 $\hat x_b$ 둘레로 $\theta_2$만큼 돌고, 손이 팔을 따라 $\hat y_b$ 방향으로 $s$만큼 미끄러지는 RRP 팔(MR 그림 6.6의 스탠퍼드형)을 생각합니다. 어깨에 팔과 함께 도는 {b}를 붙이면, {b}는 기둥과 함께 $\hat z_s$ 둘레로 돌면서 어깨 축 $\hat x_b$ 둘레로도 도므로
$$\omega=\dot\theta_1\hat z_s+\dot\theta_2\hat x_b$$
— 각속도의 덧셈 그대로입니다. 어깨 중심이 고정이면 손끝($r=s\hat y_b$)의 속도는
$$v=\dot s\,\hat y_b+\omega\times s\hat y_b=\dot s\,\hat y_b+\dot\theta_1 s\,(\hat z_s\times\hat y_b)+\dot\theta_2 s\,\hat z_b.$$
팔이 수평이고 $\theta_1=0$이면($\hat x_b=\hat x_s$, $\hat y_b=\hat y_s$, $\hat z_b=\hat z_s$) $v=\dot s\,\hat y_s-\dot\theta_1s\,\hat x_s+\dot\theta_2s\,\hat z_s$: 뻗기, 옆으로 쓸기, 들어 올리기가 서로 수직인 세 성분으로 나옵니다. 이것이 14단원 야코비안의 첫 모습입니다.

:::warn 상대 속도는 {b}의 축으로 적는다
$v_{\text{rel}}$은 “{b}에 탄 관찰자가 본 좌표의 변화율”이라 {b}의 축 방향으로 적습니다. 마지막에 {s}의 성분이 필요하면 $R_{sb}$를 곱해 바꿉니다. 같은 식 안에서 {s}의 성분과 {b}의 성분을 섞어 더하지 마세요.
:::
` },
      { k: 'W4.2', label: '강의 4.2', src: '강의 자료 · Week 4', title: '가속도와 코리올리 항', body: R`
속도 $v_p=v_o+v_{\text{rel}}+\omega\times r$을 한 번 더 미분합니다. 새로 할 일은 하나뿐 — **{b}의 축으로 적힌 벡터를 미분할 때마다 축의 미분 규칙을 쓴다**는 것입니다.
- $\dfrac{d}{dt}v_{\text{rel}}=(\ddot x\hat x_b+\ddot y\hat y_b+\ddot z\hat z_b)+\omega\times v_{\text{rel}}=a_{\text{rel}}+\omega\times v_{\text{rel}}$
- $\dfrac{d}{dt}(\omega\times r)=\dot\omega\times r+\omega\times\dot r=\dot\omega\times r+\omega\times(v_{\text{rel}}+\omega\times r)$

($r$도 {b}의 좌표로 적혀 있으므로 $\dot r=v_{\text{rel}}+\omega\times r$.) 모으면 $\omega\times v_{\text{rel}}$이 두 번 나옵니다.

:::key 움직이는 좌표계의 가속도
$$a_p=a_o+a_{\text{rel}}+2\,\omega\times v_{\text{rel}}+\dot\omega\times r+\omega\times(\omega\times r)$$
| 항 | 이름 | 뜻 |
|---|---|---|
| $a_o$ | 원점 가속도 | {b} 원점이 빨라지거나 휜다 |
| $a_{\text{rel}}$ | 상대 가속도 | {b} 안에서 본 가속도 |
| $2\omega\times v_{\text{rel}}$ | 코리올리 | {b} 안에서 움직이면서 {b}가 도는 효과(두 번 나와 2배) |
| $\dot\omega\times r$ | 접선 | 회전이 빨라진다 |
| $\omega\times(\omega\times r)$ | 구심 | 늘 회전축을 향한다, 크기 $\lVert\omega\rVert^2\times$(축까지 거리) |
:::

:::ex 예제 3 — 벌레의 가속도
예제 2의 벌레가 일정한 빠르기로 기고($s=vt$, $\ddot s=0$) 원판도 일정하게 돈다($\dot\Omega=0$). 남는 항과 방향은? $\Omega=2$ rad/s, $v=0.1$ m/s, $t=3$ s일 때 가속도의 크기는?
---
$a_o=0$, $a_{\text{rel}}=\ddot s\hat y_b=0$, 접선 $\dot\omega\times r=0$.
코리올리: $2\Omega\hat z_b\times v\hat y_b=-2\Omega v\,\hat x_b$ — 원판이 도는 방향(앞쪽)을 향합니다. 바깥으로 갈수록 바닥이 더 빨리 움직이므로, 벌레는 그만큼 앞으로 떠밀려야 반지름을 따라 곧게 갈 수 있습니다.
구심: $\Omega\hat z_b\times(-\Omega s\hat x_b)=-\Omega^2s\,\hat y_b$ — 중심을 향합니다.
수치: $s=0.3$, 코리올리 $0.4$, 구심 $1.2$ (m/s²) → $\lVert a\rVert=\sqrt{0.16+1.44}\approx1.26$ m/s².
원판이 빨라지면($\dot\Omega\ne0$) 접선 항 $-\dot\Omega s\,\hat x_b$가 더해지고, 벌레가 빨라지면 $\ddot s\,\hat y_b$가 더해집니다.
:::

:::sim bugdisk
돌림 빠르기 $\Omega$와 기는 빠르기 $v$를 바꾸며 벌레의 궤적을 보세요. 원판 위에서는 곧은 반지름이지만 고정 좌표계에서는 나선(아르키메데스 나선)이 됩니다. 화살표는 가속도의 네 항(상대, 코리올리, 접선, 구심)입니다.
:::

:::idea 코리올리 항은 왜 2배인가
$\omega\times v_{\text{rel}}$은 두 곳에서 나옵니다. (1) 상대 속도 벡터 자체가 {b}의 축으로 적혀 있어 축이 돌면 방향이 바뀌고, (2) 점이 {b} 안에서 움직이면 회전이 실어 나르는 속도 $\omega\times r$의 $r$이 바뀝니다. 두 효과가 같은 크기로 겹쳐서 $2\omega\times v_{\text{rel}}$입니다.
:::

:::note 동역학과의 연결
같은 식이 동역학의 “회전 좌표계에 대한 운동”(코리올리 가속도) 단원에 그대로 나옵니다. 로봇에서는 17단원의 동역학에서 관절 속도의 곱 $\dot\theta_i\dot\theta_j$ 항(코리올리·원심력 항)이 같은 원리로 생깁니다.
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
      { sec: '3.2.2', type: 'mc', lv: 1, q: R`물체가 각속도 $\omega$로 돌 때 물체 축 $\hat x_b$의 시간 미분은?`,
        choices: [R`$0$ (단위 벡터라서)`, R`$\omega\times\hat x_b$`, R`$\hat x_b\times\omega$`, R`$\lVert\omega\rVert\hat x_b$`], ans: 1,
        sol: R`길이는 그대로이고 끝점이 $\omega$ 축 둘레의 원을 돌므로 $\omega\times\hat x_b$. 길이가 일정하다는 것은 미분이 $\hat x_b$에 수직이라는 뜻이지 0이라는 뜻이 아닙니다.` },
      { sec: '3.2.2', type: 'num', lv: 2, q: R`기둥이 $\hat z_s$ 둘레로 1 rad/s로 돌고, 기둥 위의 팔이 팔과 함께 도는 수평축 $\hat x_b$ 둘레로 2 rad/s로 든다. 팔의 각속도 크기는? (두 축은 수직)`, ans: 'sqrt(5)', ansTex: R`\sqrt5`,
        sol: R`각속도의 덧셈: $\omega=1\cdot\hat z_s+2\hat x_b$, 두 축이 수직이므로 $\sqrt{1+4}=\sqrt5$.` },
      { sec: 'W4.1', type: 'num', lv: 1, q: R`원판이 2 rad/s로 돌고, 원판 위 중심에서 0.3 m인 곳에 벌레가 가만히 있다. 벌레의 속력(m/s)은?`, ans: '0.6', ansTex: R`0.6`,
        sol: R`$v_{\text{rel}}=0$, $\lVert\omega\times r\rVert=\Omega s=0.6$.` },
      { sec: 'W4.1', type: 'num', lv: 2, q: R`예제 2의 벌레가 $\Omega=2$ rad/s, $\dot s=0.1$ m/s, $s=0.3$ m일 때 속력(m/s)은?`, ans: 'sqrt(0.37)', ansTex: R`0.608`,
        sol: R`$v=0.1\hat y_b-0.6\hat x_b$, $\sqrt{0.01+0.36}$.` },
      { sec: 'W4.1', type: 'num', lv: 2, q: R`스탠퍼드형 RRP 팔이 $\theta_1=\theta_2=0$(팔 수평)에서 $\dot\theta_1=0.5$, $\dot\theta_2=0.2$ rad/s, 팔 길이 $s=1.2$ m, $\dot s=0.3$ m/s이다. 손끝의 속력(m/s)은?`, ans: 'sqrt(0.5076)', ansTex: R`0.712`,
        sol: R`$v=\dot s\hat y_s-\dot\theta_1s\hat x_s+\dot\theta_2s\hat z_s=(−0.6,\ 0.3,\ 0.24)$, 크기 $\sqrt{0.36+0.09+0.0576}\approx0.712$.` },
      { sec: 'W4.2', type: 'num', lv: 1, q: R`3 rad/s로 일정하게 도는 원판의 반지름 0.5 m 지점에 고정된 점의 가속도 크기(m/s²)는?`, ans: '4.5', ansTex: R`4.5`,
        sol: R`구심 항만 남습니다: $\Omega^2r=9\times0.5$.` },
      { sec: 'W4.2', type: 'num', lv: 2, q: R`예제 3의 벌레($\Omega=2$, $v=0.1$, $t=3$ s)의 가속도 크기(m/s²)는?`, ans: 'sqrt(1.6)', ansTex: R`1.26`,
        sol: R`코리올리 $2\Omega v=0.4$, 구심 $\Omega^2s=4\times0.3=1.2$, 서로 수직 → $\sqrt{0.16+1.44}$.` },
      { sec: 'W4.2', type: 'num', lv: 2, q: R`회전 목마가 $\Omega=2$ rad/s, $\dot\Omega=1$ rad/s²으로 빨라지고 있다. 축에서 2 m인 곳에 서 있는 사람의 가속도 크기(m/s²)는?`, ans: 'sqrt(68)', ansTex: R`8.25`,
        sol: R`접선 $\dot\Omega r=2$, 구심 $\Omega^2r=8$, 수직 → $\sqrt{4+64}$.` },
      { sec: 'W4.2', type: 'mc', lv: 1, q: R`점이 움직이는 좌표계 {b}에 고정되어 있으면($v_{\text{rel}}=a_{\text{rel}}=0$) 사라지는 항은?`,
        choices: [R`구심 항`, R`접선 항`, R`코리올리 항`, R`원점 가속도`], ans: 2,
        sol: R`코리올리 항 $2\omega\times v_{\text{rel}}$은 상대 속도가 있어야 생깁니다.` },
      { sec: 'W4.2', type: 'mc', lv: 2, q: R`반시계로 도는 원판 위에서 벌레가 반지름을 따라 바깥으로 일정하게 긴다. 코리올리 항 $2\omega\times v_{\text{rel}}$의 방향은?`,
        choices: [R`중심을 향한다`, R`바깥을 향한다`, R`원판이 도는 방향(앞쪽)`, R`원판이 도는 반대 방향`], ans: 2,
        sol: R`$\hat z\times\hat y=-\hat x$, 그 자리의 바닥이 움직이는 방향과 같습니다. 바깥일수록 바닥이 빠르므로 벌레를 앞으로 밀어야 곧게 갈 수 있습니다.` },
      { sec: 'W4.2', type: 'open', lv: 2, proof: true, q: R`움직이는 좌표계 {b}(원점 $o_b$, 각속도 $\omega$)에서 좌표 $(x,y,z)$로 적힌 점의 가속도가 $a_p=a_o+a_{\text{rel}}+2\omega\times v_{\text{rel}}+\dot\omega\times r+\omega\times(\omega\times r)$임을 유도하세요. 코리올리 항의 2가 어디서 오는지 밝히세요.`,
        sol: R`
$p=o_b+x\hat x_b+y\hat y_b+z\hat z_b$, $r=x\hat x_b+y\hat y_b+z\hat z_b$. 축의 미분 $\dot{\hat x}_b=\omega\times\hat x_b$ 등을 쓰면, {b}의 축으로 적힌 벡터 $u=u_1\hat x_b+u_2\hat y_b+u_3\hat z_b$에 대해 $\dot u=(\dot u_1\hat x_b+\dot u_2\hat y_b+\dot u_3\hat z_b)+\omega\times u$.
속도: $u=r$에 적용 → $\dot p=v_o+v_{\text{rel}}+\omega\times r$.
가속도: $\dfrac{d}{dt}v_{\text{rel}}=a_{\text{rel}}+\omega\times v_{\text{rel}}$, $\dfrac{d}{dt}(\omega\times r)=\dot\omega\times r+\omega\times\dot r=\dot\omega\times r+\omega\times(v_{\text{rel}}+\omega\times r)$.
더하면 $a_p=a_o+a_{\text{rel}}+2\omega\times v_{\text{rel}}+\dot\omega\times r+\omega\times(\omega\times r)$. $\omega\times v_{\text{rel}}$은 상대 속도 벡터의 회전과 $\omega\times r$의 $r$ 변화에서 한 번씩 나와 2배가 됩니다.`,
        rubric: R`
- 위치를 원점 + {b}의 축으로 적음 — 2점
- 축의 미분 규칙을 써서 속도의 세 항 — 3점
- 가속도의 다섯 항 — 3점
- 2배의 출처 설명 — 2점` },
    ],
  });
})();
