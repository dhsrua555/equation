/* 추가 연습문제 — 11 가중치 초기화. 분산 보존 유도의 변형과 계산 문제를 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 11,
    problems: [
      { sec: '11.3', type: 'open', lv: 3, proof: true, q: R`Leaky ReLU $h=\max(\alpha z,z)$ ($0\le\alpha<1$), $z$가 0에 대해 대칭이고 $\E[z^2]=q$일 때 $\E[h^2]=\frac{1+\alpha^2}2q$임을 보이고, 2차 모멘트를 보존하는 가중치 분산 $\sigma^2$을 구하세요. ($\alpha=0$이면 He와 같아야 함)`,
        sol: R`
$z\ge0$이면 $h=z$, $z<0$이면 $h=\alpha z$. $\E[h^2]=\E[z^2\mathbb 1_{z\ge0}]+\alpha^2\E[z^2\mathbb 1_{z<0}]$.
대칭이면 $\E[z^2\mathbb 1_{z\ge0}]=\E[z^2\mathbb 1_{z<0}]=\frac q2$ ($P(z=0)$의 기여는 0). 따라서 $\E[h^2]=\frac{1+\alpha^2}2q$.
$q=D_{in}\sigma^2v$ (11.2절)이므로 보존 조건 $\frac{1+\alpha^2}2D_{in}\sigma^2v=v$에서 $\sigma^2=\frac2{(1+\alpha^2)D_{in}}$. $\alpha=0$이면 $2/D_{in}$ (He), $\alpha=1$ (선형)이면 $1/D_{in}$ (Xavier).`,
        rubric: R`
- 경우 나누기 — 3점
- 대칭성으로 절반씩 — 3점
- 보존 조건과 $\sigma^2$ — 3점
- 두 극한 확인 — 1점` },
      { sec: '11.2', type: 'open', lv: 3, proof: true, q: R`역전파 $g_i=\frac{\partial L}{\partial x_i}=\sum_{j=1}^{D_{out}}W_{ji}\delta_j$에서 $W_{ji}$가 i.i.d. 평균 0·분산 $\sigma^2$이고 $\delta_j$와 독립, $\delta_j$는 평균 0·분산 $u$일 때 $\Var(g_i)=D_{out}\sigma^2u$임을 보이고, 순방향·역방향 조건을 절충한 Glorot 초기화를 설명하세요.`,
        sol: R`
11.2절과 같은 계산: $\E g_i=\sum_j\E W_{ji}\E\delta_j=0$. $\E g_i^2=\sum_j\E W_{ji}^2\E\delta_j^2+\sum_{j\ne k}\E[W_{ji}]\E[W_{ki}\delta_j\delta_k]=D_{out}\sigma^2u$ (교차항은 $\E W_{ji}=0$으로 사라짐).
역방향 분산 보존($\Var g_i=u$)에는 $\sigma^2=1/D_{out}$, 순방향에는 $1/D_{in}$이 필요합니다. 폭이 다르면 둘 다 만족할 수 없어 $\sigma^2=\frac2{D_{in}+D_{out}}$ (두 값의 조화평균)으로 절충합니다.`,
        rubric: R`
- 평균 0 — 2점
- 2차 모멘트 전개와 교차항 소거 — 5점
- 두 조건과 절충식 — 3점` },
      { sec: '11.2', type: 'num', lv: 2, q: R`Glorot 균등 초기화 $U(-a,a)$에서 분산 $a^2/3$을 $\frac2{D_{in}+D_{out}}$에 맞출 때, $D_{in}=300$, $D_{out}=100$이면 $a$는? (소수 넷째 자리)`, ans: 'sqrt(6/400)', ansTex: R`\sqrt{6/400}\approx0.1225`,
        sol: R`$a^2/3=2/400\Rightarrow a^2=6/400=0.015$, $a\approx0.1225$.` },
      { sec: '11.3', type: 'num', lv: 1, q: R`$D_{in}=1024$일 때 He 초기화의 표준편차는? (소수 넷째 자리)`, ans: 'sqrt(2/1024)', ansTex: R`\approx0.0442`,
        sol: R`$\sqrt{2/1024}=\sqrt{1/512}\approx0.0442$.` },
      { sec: '11.2', type: 'num', lv: 1, q: R`$D_{in}=256$, $\Var(w_i)=1/128$, $\Var(x_i)=0.5$ (평균 0, 독립)일 때 $\Var(\sum_iw_ix_i)$는?`, ans: '1', ansTex: R`1`,
        sol: R`$256\times\frac1{128}\times0.5=1$. 분산이 $0.5\to1$로 2배가 됩니다(Xavier보다 2배 큰 분산).` },
      { sec: '11.3', type: 'num', lv: 1, q: R`$z\sim\N(0,9)$일 때 $\E[\max(0,z)]$는? (소수 넷째 자리)`, ans: '3/sqrt(2*pi)', ansTex: R`\tfrac3{\sqrt{2\pi}}\approx1.1968`,
        sol: R`$\sqrt{q/2\pi}=\sqrt{9/2\pi}=3/\sqrt{2\pi}\approx1.1968$.` },
      { sec: '11.3', type: 'num', lv: 2, q: R`ReLU 신경망에 Xavier($\sigma^2=1/D_{in}$)를 쓰면 10층을 지난 뒤 활성화의 2차 모멘트는 처음의 몇 배인가?`, ans: '1/1024', ansTex: R`2^{-10}`,
        sol: R`층마다 $\E[h^2]=\frac12D_{in}\sigma^2\E[x^2]=\frac12\E[x^2]$. 10층이면 $2^{-10}\approx0.001$배 — 신호가 사라집니다.` },
      { sec: '11.3', type: 'open', lv: 2, proof: true, q: R`$z$가 0에 대해 대칭인 연속 확률변수(밀도 $p(-t)=p(t)$)이면 정규분포가 아니어도 $\E[\max(0,z)^2]=\frac12\E[z^2]$임을 보이세요.`,
        sol: R`
$\E[\max(0,z)^2]=\int_0^\infty t^2p(t)\,dt$. $t\mapsto t^2p(t)$는 우함수이므로 $\int_0^\infty t^2p(t)dt=\frac12\int_{-\infty}^\infty t^2p(t)dt=\frac12\E[z^2]$.
(가중치 분포가 대칭이면 $z=\sum w_ix_i$도 대칭 — $w\to-w$로 바꿔도 분포가 같으므로 — 이라 He 유도에 정규 가정이 필요 없습니다.)`,
        rubric: R`
- 적분 표현 — 3점
- 우함수와 절반 — 5점
- 가중치 대칭과의 연결 — 2점` },
      { sec: '11.4', type: 'mc', lv: 1, q: R`활성화 함수에 맞는 초기화 짝으로 가장 알맞은 것은?`,
        choices: [R`tanh — He, ReLU — Xavier`, R`tanh — Xavier, ReLU — He`, R`둘 다 $0.01\times$randn`, R`둘 다 0으로 초기화`], ans: 1,
        sol: R`Xavier는 0 중심·거의 선형인 활성화(tanh)를, He는 절반을 잘라 2차 모멘트를 반으로 만드는 ReLU를 가정합니다.` },
    ],
  });
})();
