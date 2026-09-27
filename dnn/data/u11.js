/* 11 가중치 초기화 — 4주차 월요일(2) s.16–26 필기, 4주차 수요일(1) 필기(He 초기화 유도) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 11, part: 'C', title: '가중치 초기화', en: 'Weight Initialization', ref: 'W4 월(2) · s.16–26, W4 수 필기', plot: 'init',
    fig: R`여섯 개 tanh 층을 지나는 활성화 분포. 너무 작은 초기화는 0으로 무너지고(가는 선), Xavier는 퍼짐을 유지(굵은 선)`,
    tagline: R`$\Var(\sum_iw_ix_i)=D_{in}\sigma^2v$. 분산을 층마다 보존하려면 tanh에는 $\sigma^2=1/D_{in}$, ReLU에는 절반이 잘리므로 $2/D_{in}$.`,
    summary: R`가중치를 너무 작게 초기화하면 깊은 층의 활성화가 0으로 줄어 학습이 멈추고, 너무 크게 하면 tanh가 포화되어 기울기가 0이 됩니다. 수업 필기에서는 $y=\sum_{i=1}^{D_{in}}w_ix_i$의 분산을 계산해 **Xavier 초기화** $\sigma^2=1/D_{in}$을 유도했고, ReLU에서는 이 방법이 다시 무너지는 것을 본 뒤 4주차 수요일에 정규분포 가정과 두 개의 적분(D.I.Y.)으로 **He 초기화** $\sigma^2=2/D_{in}$을 유도했습니다. 이 단원에서는 두 적분까지 모두 계산합니다.`,
    goals: [
      R`너무 작은/큰 초기화가 각각 어떤 식으로 학습을 멈추게 하는지 기울기 식으로 설명할 수 있다`,
      R`독립성·평균 0 가정에서 $\Var(y)=D_{in}\sigma^2v$를 유도하고 Xavier 초기화를 얻을 수 있다`,
      R`$z\sim\N(0,q)$일 때 $\E[\max(0,z)]=\sqrt{q/2\pi}$, $\E[\max(0,z)^2]=q/2$를 적분으로 계산할 수 있다`,
      R`2차 모멘트 보존 조건에서 He 초기화 $\sigma=\sqrt{2/D_{in}}$을 유도할 수 있다`,
      R`모든 가중치를 같은 값으로 초기화하면 안 되는 이유(대칭 깨기)를 증명할 수 있다`,
    ],
    secTitles: { '11.1': '작은/큰 초기화', '11.2': 'Xavier', '11.3': 'He', '11.4': '대칭 깨기' },
    sections: [
      { k: '11.1', src: 'W4 월(2) · 슬라이드 16–21', title: '너무 작거나 너무 큰 초기화', body: R`
실험: 은닉 4096개짜리 6층 신경망, 입력 $x$=randn(16, 4096), 활성화 tanh.

**너무 작게** ($W=0.01\times$randn): 층별 활성화의 표준편차가 $0.49,\,0.29,\,0.18,\,0.11,\,0.07,\,0.05$로 줄어 **위쪽 층의 활성화가 거의 0**입니다. 가중치 기울기는
$$\frac{\partial L}{\partial W}=\frac{\partial L}{\partial h}\,z^T$$
이고 입력 활성화 $z\approx0$이므로 $\frac{\partial L}{\partial W}\approx0$ → **학습 없음**.

**너무 크게** ($W=0.05\times$randn): 표준편차가 $0.87,\,0.85,\dots$로 유지되지만 활성화가 $\pm1$에 몰려 **tanh가 포화**됩니다. 역방향 기울기
$$\frac{\partial L}{\partial z}=\frac{\partial L}{\partial h}\frac{\partial h}{\partial z}=\big(\sigma'(\cdot)\,W^T\big)\frac{\partial L}{\partial h}$$
에서 $\sigma'\approx0$이므로 → **학습 없음**.

**Xavier** ($W=$randn$/\sqrt{D_{in}}$): 표준편차 $0.63,\,0.49,\,0.41,\,0.36,\,0.32,\,0.30$으로 모든 층에서 적당히 퍼져 있습니다.
` },
      { k: '11.2', src: 'W4 월(2) · 슬라이드 22–23 필기', title: 'Xavier(Glorot) 초기화', body: R`
:::key Xavier 초기화
$y=\sum_{i=1}^{D_{in}}w_ix_i$, 가정: $w_i$ i.i.d.·$x_i$ i.i.d., $w$와 $x$는 독립, $\E[w_i]=0$, $\Var(w_i)=\sigma^2$, $\E[x_i]=0$, $\Var(x_i)=v$. 그러면
$$\Var(y)=D_{in}\,\sigma^2\,v.$$
$\Var(y)=\Var(x_i)=v$를 요구하면 $\sigma^2=\dfrac1{D_{in}}$, 즉 $W=\text{randn}(D_{in},D_{out})/\sqrt{D_{in}}$.
:::

:::hand 수업 필기 — 분산 계산
$\Var(y)=\E[y^2]-(\E[y])^2$, $\E[y]=\sum_i\E[w_i]\E[x_i]=0$.
$$\E[y^2]=\E\Big[\Big(\sum_iw_ix_i\Big)^2\Big]=\sum_i\E[w_i^2x_i^2]+\sum_{i\ne k}\E[w_iw_kx_ix_k]$$
$$=\sum_i\E[w_i^2]\E[x_i^2]+\sum_{i\ne k}\underbrace{\E[w_i]}_{0}\E[w_k]\E[x_ix_k]=\sum_{i=1}^{D_{in}}\sigma^2\,\E[x_i^2].$$
$\E[x_i^2]=\Var(x_i)=v$ ($\E x_i=0$)이므로 $\Var(y)=D_{in}\sigma^2v$. $\Var(y)=v$로 두면 $D_{in}\sigma^2v=v\Rightarrow\sigma^2=1/D_{in}$.
:::

- 원래 Glorot & Bengio(2010)는 역방향에서도 분산을 보존하려고($\sigma^2=1/D_{out}$) 두 조건의 절충 $\sigma^2=\dfrac2{D_{in}+D_{out}}$을 제안했습니다. 의료 인공지능 과목(Bishop)의 표가 이 식입니다[[@med:ch07:7.2b|Xavier $2/(n_{in}+n_{out})$, He $2/n_{in}$.]].
- 이 유도는 입력이 **평균 0**이라는 가정을 씁니다. tanh처럼 0 중심인 활성화에는 맞지만 ReLU에는 맞지 않습니다.
` },
      { k: '11.3', src: 'W4 월(2) · 슬라이드 24–25, W4 수(1) 필기', title: 'ReLU와 He(Kaiming) 초기화', body: R`
ReLU 신경망에 Xavier를 쓰면 층을 지날수록 활성화가 다시 0으로 무너집니다(슬라이드: 평균·표준편차가 $0.39/0.58$에서 $0.07/0.10$까지). ReLU가 음수 절반을 0으로 잘라 **2차 모멘트가 매 층 절반**이 되기 때문입니다.

:::key He 초기화
$z=\sum_{i=1}^{D_{in}}w_ix_i$, $\E[w_i]=0$, $\Var(w_i)=\sigma^2$, $h=\max(0,z)$, $z\sim\N(0,q)$로 근사하면
$$\E[h]=\sqrt{\frac q{2\pi}},\qquad \E[h^2]=\frac q2,\qquad q=\Var(z)=D_{in}\sigma^2v.$$
2차 모멘트를 층마다 보존하려면 $\E[h^2]=\E[x^2]=v$, 즉 $\tfrac12D_{in}\sigma^2v=v$:
$$\sigma^2=\frac2{D_{in}},\qquad \sigma=\sqrt{\frac2{D_{in}}}.$$
:::

:::hand 수업 필기 — He 초기화 유도
$\Var(z)=\sum_{i}\Var(w_ix_i)$ (독립). $\Var(x_iw_i)=\E[(w_ix_i)^2]-(\E[w_ix_i])^2$이고 $\E[w_ix_i]=\E[w_i]\E[x_i]=0$, $\E[(w_ix_i)^2]=\E[w_i^2]\E[x_i^2]=\sigma^2v$. 따라서 $\Var(z)=D_{in}\sigma^2v=:q$.
$h=\varphi(z)=\max(0,z)$, $z\sim\N(0,q)$로 두면
$$\E[h]=\int_0^\infty z\frac1{\sqrt{2\pi q}}e^{-z^2/2q}dz=\frac{\sqrt q}{\sqrt{2\pi}},\qquad \E[h^2]=\int_0^\infty z^2\frac1{\sqrt{2\pi q}}e^{-z^2/2q}dz=\frac12q\quad(\text{D.I.Y.})$$
신호 전파에서는 2차 모멘트 $v=\E[x_i^2]$를 추적합니다. ReLU 전 $\E[z^2]=D_{in}\sigma^2v$, ReLU 후 $\E[h^2]=\frac12\E[z^2]=\frac12D_{in}\sigma^2v$. 보존 조건 $\E[h^2]=\E[x^2]=v$에서 $\frac12D_{in}\sigma^2=1$, $\sigma^2=2/D_{in}$.
:::

**D.I.Y. 적분.** 치환 $u=z^2/2q$ ($du=z\,dz/q$)로
$$\int_0^\infty z\,e^{-z^2/2q}dz=q\int_0^\infty e^{-u}du=q\ \Rightarrow\ \E[h]=\frac{q}{\sqrt{2\pi q}}=\sqrt{\frac q{2\pi}}.$$
$\E[h^2]$은 대칭성으로 바로 나옵니다: $z^2e^{-z^2/2q}$는 우함수이므로 $\int_0^\infty=\frac12\int_{-\infty}^\infty$, 즉 $\E[h^2]=\frac12\E[z^2]=\frac q2$. (부분적분으로도: $\int_0^\infty z\cdot ze^{-z^2/2q}dz=\big[-qze^{-z^2/2q}\big]_0^\infty+q\int_0^\infty e^{-z^2/2q}dz=q\cdot\frac{\sqrt{2\pi q}}2$.)

:::note 가정을 정확히 하면
ReLU 층의 입력 $x_i=h\ge0$은 평균이 0이 아니므로 “$\Var(x_i)=v$” 대신 필기처럼 **2차 모멘트** $v=\E[x_i^2]$로 써야 합니다. 이때도 $\E[w_i]=0$과 독립성만 있으면 $\E[z]=0$, $\E[z^2]=D_{in}\sigma^2\E[x^2]$가 성립합니다. 또 $\E[h^2]=\frac12\E[z^2]$에는 정규분포가 필요 없고 $z$가 0에 대해 **대칭**이기만 하면 됩니다($w_i$의 분포가 대칭이면 자동). 정규분포 가정은 $\E[h]$ 값을 구할 때만 씁니다.
:::

슬라이드 결과: std $=\sqrt{2/D_{in}}$이면 모든 층의 평균 $\approx0.55$, 표준편차 $\approx0.81$로 “딱 좋게” 유지됩니다. (He et al., ICCV 2015)
` },
      { k: '11.4', src: 'W4 월(2) · 슬라이드 26, 보충', title: '대칭 깨기와 초기화 연구', body: R`
가중치를 **모두 같은 값**(예: 0)으로 두면 안 됩니다. 같은 층의 뉴런들이 같은 입력을 받으면 출력이 같고, 역전파로 받는 기울기도 같아 갱신 후에도 계속 같습니다. 뉴런을 여러 개 둔 의미가 사라지므로 **무작위** 초기화로 대칭을 깨야 합니다.

:::key 대칭 깨기
한 은닉층의 두 뉴런 $j,k$의 들어오는 가중치와 나가는 가중치가 처음에 같으면, (미니배치) 경사하강법의 모든 단계 후에도 같다.
:::

초기화 연구(슬라이드 26): Glorot & Bengio(2010), He et al.(2015), Saxe et al.(2013, 깊은 선형망의 정확한 동역학), Sussillo & Abbott(2014, 랜덤 워크 초기화). 배치 정규화(12단원)를 쓰면 초기화에 덜 민감해집니다.
` },
    ],
    problems: [
      { sec: '11.2', type: 'num', lv: 1, q: R`$D_{in}=4096$일 때 Xavier 초기화의 가중치 표준편차는?`, ans: '1/64', ansTex: R`\tfrac1{64}\approx0.0156`,
        sol: R`$1/\sqrt{4096}=1/64$.` },
      { sec: '11.3', type: 'num', lv: 1, q: R`$D_{in}=512$일 때 He 초기화의 가중치 표준편차는?`, ans: '1/16', ansTex: R`\sqrt{2/512}=\tfrac1{16}`,
        sol: R`$\sqrt{2/512}=\sqrt{1/256}=1/16$.` },
      { sec: '11.2', type: 'num', lv: 2, q: R`$D_{in}=100$, $\Var(w_i)=0.02$, $\Var(x_i)=1$ (모두 평균 0, 독립)일 때 $\Var(\sum_iw_ix_i)$는?`, ans: '2', ansTex: R`2`,
        sol: R`$D_{in}\sigma^2v=100\times0.02\times1=2$. 층마다 분산이 2배가 되어 폭발합니다(Xavier는 $0.01$).` },
      { sec: '11.1', type: 'mc', lv: 1, q: R`tanh 신경망을 $0.01\times$randn으로 초기화했을 때 학습이 안 되는 직접적 이유는?`,
        choices: [R`tanh가 포화되어서`, R`위층 활성화가 0에 가까워 $\partial L/\partial W=\frac{\partial L}{\partial h}z^T\approx0$이라서`, R`손실이 발산해서`, R`편향이 없어서`], ans: 1,
        sol: R`가중치 기울기에 입력 활성화 $z$가 곱해집니다. 포화는 너무 큰 초기화의 문제입니다.` },
      { sec: '11.1', type: 'mc', lv: 1, q: R`tanh 신경망을 너무 크게 초기화했을 때의 문제는?`,
        choices: [R`활성화가 $\pm1$에 몰려 $\tanh'\approx0$, 기울기 소실`, R`활성화가 0으로 무너짐`, R`기울기가 항상 1`, R`Xavier와 같아짐`], ans: 0,
        sol: R`$\partial L/\partial z=(\sigma'(\cdot)W^T)\partial L/\partial h$에서 $\sigma'\approx0$.` },
      { sec: '11.3', type: 'num', lv: 2, q: R`$z\sim\N(0,4)$일 때 $\E[\max(0,z)]$는?`, ans: 'sqrt(4/(2*pi))', ansTex: R`\sqrt{2/\pi}\approx0.798`,
        sol: R`$\sqrt{q/2\pi}=\sqrt{4/2\pi}=\sqrt{2/\pi}$.` },
      { sec: '11.3', type: 'num', lv: 2, q: R`$z\sim\N(0,4)$일 때 $\Var(\max(0,z))$는? (소수 셋째 자리)`, ans: '2-2/pi', ansTex: R`2-\tfrac2\pi\approx1.363`,
        sol: R`$\E[h^2]=q/2=2$, $(\E h)^2=q/2\pi=2/\pi$. 분산 $2-2/\pi\approx1.363$.` },
      { sec: '11.3', type: 'mc', lv: 2, q: R`He 초기화 유도에서 $\E[h^2]=\frac12\E[z^2]$가 성립하기 위해 꼭 필요한 조건은?`,
        choices: [R`$z$가 정규분포`, R`$z$의 분포가 0에 대해 대칭`, R`$x_i$의 평균이 0`, R`$D_{in}$이 짝수`], ans: 1,
        sol: R`$\E[z^2\mathbb 1\{z>0\}]=\E[z^2\mathbb 1\{z<0\}]$이면 각각이 $\frac12\E[z^2]$. 정규분포는 $\E[h]$를 구할 때 씁니다.` },
      { sec: '11.3', type: 'num', lv: 2, q: R`ReLU 신경망에 Xavier($\sigma^2=1/D_{in}$)를 쓰면 한 층을 지날 때 활성화의 2차 모멘트는 몇 배가 되는가?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`$\E[h^2]=\frac12D_{in}\sigma^2v=\frac12v$. 10층이면 $2^{-10}$배로 무너집니다.` },
      { sec: '11.2', type: 'num', lv: 2, q: R`Glorot의 절충식 $\sigma^2=2/(D_{in}+D_{out})$에서 $D_{in}=300$, $D_{out}=100$이면 $\sigma^2$은?`, ans: '1/200', ansTex: R`0.005`,
        sol: R`$2/400=0.005$. 순방향 조건 $1/300$과 역방향 조건 $1/100$의 조화평균입니다.` },
      { sec: '11.4', type: 'mc', lv: 2, q: R`모든 가중치를 0으로 초기화한 은닉층의 뉴런들에 대해 옳은 것은?`,
        choices: [R`학습이 진행되며 자연히 달라진다`, R`모두 같은 기울기를 받아 영원히 같은 함수를 계산한다`, R`He 초기화와 같다`, R`기울기가 폭발한다`], ans: 1,
        sol: R`대칭이 깨지지 않습니다. 무작위 초기화가 필요한 이유입니다.` },
      { sec: '11.2', type: 'open', lv: 2, proof: true, q: R`$y=\sum_{i=1}^{D_{in}}w_ix_i$에서 $w_i,x_i$가 모두 독립이고 $\E w_i=\E x_i=0$, $\Var w_i=\sigma^2$, $\Var x_i=v$일 때 $\Var(y)=D_{in}\sigma^2v$임을 보이고, Xavier 초기화를 유도하세요.`,
        sol: R`
$\E y=\sum\E w_i\E x_i=0$이므로 $\Var y=\E y^2$.
$\E y^2=\sum_i\E[w_i^2x_i^2]+\sum_{i\ne k}\E[w_iw_kx_ix_k]$. 독립성으로 $\E[w_i^2x_i^2]=\E w_i^2\E x_i^2=\sigma^2v$, 교차항은 $\E w_i\E w_k\E[x_ix_k]=0$.
따라서 $\Var y=D_{in}\sigma^2v$. 층을 지나도 분산이 유지되려면 $D_{in}\sigma^2v=v$, 즉 $\sigma^2=1/D_{in}$.`,
        rubric: R`
- 평균 0 — 2점
- 제곱의 전개와 독립성 — 5점
- 보존 조건과 결론 — 3점` },
      { sec: '11.3', type: 'open', lv: 3, proof: true, q: R`$z\sim\N(0,q)$, $h=\max(0,z)$일 때 $\E[h]=\sqrt{q/2\pi}$와 $\E[h^2]=q/2$를 적분으로 계산하고(수업의 D.I.Y.), 이를 써서 He 초기화 $\sigma^2=2/D_{in}$을 유도하세요.`,
        sol: R`
**$\E h$.** $\E h=\int_0^\infty\frac{z}{\sqrt{2\pi q}}e^{-z^2/2q}dz$. $u=z^2/2q$로 치환하면 $z\,dz=q\,du$: $=\frac{q}{\sqrt{2\pi q}}\int_0^\infty e^{-u}du=\sqrt{\frac q{2\pi}}$.
**$\E h^2$.** 피적분함수 $z^2e^{-z^2/2q}$가 우함수이므로 $\int_0^\infty=\frac12\int_{-\infty}^\infty$, $\E h^2=\frac12\E z^2=\frac q2$.
**유도.** $z=\sum w_ix_i$, $\E w_i=0$, 독립이면 $\E z^2=D_{in}\sigma^2\E x^2$. ReLU 후 $\E h^2=\frac12D_{in}\sigma^2\E x^2$. 2차 모멘트 보존 $\E h^2=\E x^2$에서 $\sigma^2=2/D_{in}$.`,
        rubric: R`
- $\E h$ 치환 적분 — 3점
- $\E h^2$ (대칭 또는 부분적분) — 3점
- 2차 모멘트 전파와 He 조건 — 4점` },
    ],
  });
})();
