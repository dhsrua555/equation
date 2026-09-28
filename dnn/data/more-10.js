/* 추가 연습문제 — 10 SGD·미니배치·활성화 함수. 불편성·분산 증명과 계산 문제를 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 10,
    problems: [
      { sec: '10.2', type: 'open', lv: 3, proof: true, q: R`스칼라 값 $x_1,\dots,x_N$ (평균 $\mu$, 분산 $\sigma^2=\frac1N\sum(x_i-\mu)^2$)에서 크기 $B$의 표본을 **비복원**으로 뽑을 때 표본평균의 분산이 $\frac{\sigma^2}B\cdot\frac{N-B}{N-1}$임을 보이세요.`,
        sol: R`
$X_b=x_{k_b}-\mu$ ($b=1,\dots,B$). 각 $X_b$의 주변분포는 균등이라 $\E X_b=0$, $\E X_b^2=\sigma^2$.
$b\ne c$이면 $(k_b,k_c)$는 서로 다른 순서쌍 위에서 균등하므로
$$\E[X_bX_c]=\frac1{N(N-1)}\sum_{i\ne j}(x_i-\mu)(x_j-\mu)=\frac{\big(\sum_i(x_i-\mu)\big)^2-\sum_i(x_i-\mu)^2}{N(N-1)}=\frac{0-N\sigma^2}{N(N-1)}=-\frac{\sigma^2}{N-1}.$$
$\Var\big(\sum_bX_b\big)=B\sigma^2+B(B-1)\Big(-\frac{\sigma^2}{N-1}\Big)=B\sigma^2\frac{N-B}{N-1}$. $B^2$으로 나누면 결과. ($B=N$이면 0 — 전체를 뽑으면 흔들림이 없음.)`,
        rubric: R`
- 각 자리의 주변분포가 균등 — 2점
- 서로 다른 두 자리의 공분산 $-\sigma^2/(N-1)$ — 5점
- 합의 분산과 정리 — 3점` },
      { sec: '10.1', type: 'open', lv: 2, proof: true, q: R`$f=\frac1N\sum_{i=1}^Nf_i$이고 미니배치 $K$를 크기 $B$의 모든 부분집합 중에서 균등하게 뽑을 때, $\E\big[\frac1B\sum_{k\in K}\nabla f_k\big]=\nabla f$임을 보이세요.`,
        sol: R`
$\frac1B\sum_{k\in K}\nabla f_k=\frac1B\sum_{i=1}^N\mathbb 1[i\in K]\nabla f_i$. 대칭성으로 각 $i$가 포함될 확률은 같고, $\sum_iP(i\in K)=\E\lvert K\rvert=B$이므로 $P(i\in K)=B/N$.
기댓값의 선형성: $\E\big[\frac1B\sum_i\mathbb 1[i\in K]\nabla f_i\big]=\frac1B\sum_i\frac BN\nabla f_i=\nabla f$.`,
        rubric: R`
- 지시함수로 쓰기 — 3점
- 포함 확률 $B/N$ — 4점
- 선형성으로 결론 — 3점` },
      { sec: '10.1', type: 'num', lv: 1, q: R`자료 $60000$개를 배치 크기 $256$으로 나누고 마지막 불완전 배치는 **버릴** 때 한 에폭의 갱신 횟수는?`, ans: '234', ansTex: R`234`,
        sol: R`$\lfloor60000/256\rfloor=\lfloor234.375\rfloor=234$. 버리지 않으면 235.` },
      { sec: '10.2', type: 'num', lv: 1, q: R`표본 하나의 스칼라 기울기 분산이 $9$일 때 i.i.d. 미니배치 $B=36$의 기울기 표준편차는?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$\sqrt{9/36}=0.5$.` },
      { sec: '10.4', type: 'num', lv: 1, q: R`$\sigma'(-2)$는? (소수 넷째 자리)`, ans: '(1/(1+e^2))*(1-1/(1+e^2))', ansTex: R`\approx0.1050`,
        sol: R`$\sigma(-2)\approx0.1192$, $\sigma'=0.1192\times0.8808\approx0.1050$. $\sigma'(-z)=\sigma'(z)$ (대칭)이라 $\sigma'(2)$와 같습니다.` },
      { sec: '10.4', type: 'num', lv: 2, q: R`시그모이드 층 5개를 지나는 역전파에서 도함수 인수만 모은 곱 $\prod\sigma'(a_\ell)$의 최댓값은?`, ans: '1/1024', ansTex: R`4^{-5}=\tfrac1{1024}`,
        sol: R`각 $\sigma'\le\frac14$이므로 곱은 $\le4^{-5}\approx0.00098$. 가중치가 이를 보상하지 않으면 앞쪽 층의 기울기가 사라집니다.` },
      { sec: '10.4', type: 'open', lv: 2, proof: true, q: R`(i) 산술-기하 평균 부등식으로 $\sigma'(z)=\sigma(z)(1-\sigma(z))\le\frac14$를 보이고 등호 조건을 쓰세요. (ii) $\tanh'(z)\le1$과 등호 조건은?`,
        sol: R`
**(i)** $s=\sigma(z)\in(0,1)$, $1-s>0$. $\sqrt{s(1-s)}\le\frac{s+(1-s)}2=\frac12$이므로 $s(1-s)\le\frac14$, 등호는 $s=1-s$, 즉 $\sigma(z)=\tfrac12$, $z=0$.
**(ii)** $\tanh'(z)=1-\tanh^2(z)\le1$, 등호는 $\tanh z=0$, 즉 $z=0$.`,
        rubric: R`
- (i) 부등식 적용 — 4점
- (i) 등호 조건 — 2점
- (ii) — 4점` },
      { sec: '10.4', type: 'open', lv: 3, proof: true, q: R`뉴런 $s=w_1x_1+w_2x_2+b$의 입력이 항상 양수($x_1,x_2>0$)이면 한 번의 경사하강법 갱신 $\Delta w=-\eta\nabla_wL$은 제1사분면 또는 제3사분면 방향뿐임을 보이고, 최적의 변화 방향이 $(1,-1)$일 때 어떤 일이 생기는지 설명하세요.`,
        sol: R`
$\nabla_wL=\frac{\partial L}{\partial s}(x_1,x_2)$. $x_1,x_2>0$이므로 두 성분의 부호가 모두 $\frac{\partial L}{\partial s}$의 부호와 같습니다. 따라서 $\Delta w$는 두 성분이 모두 양수(1사분면)이거나 모두 음수(3사분면)입니다(표본마다 $x$가 달라도 부호 관계는 같음).
$(1,-1)$ 방향(4사분면)으로 한 번에 갈 수 없으므로, 예컨대 $(+,+)$로 한 번, $(-,-)$로 한 번을 번갈아 “계단식 지그재그”로 움직여야 하고 수렴이 느려집니다. 입력의 평균을 0으로 맞추면(tanh, 정규화) 해결됩니다.`,
        rubric: R`
- 기울기의 부호 분석 — 5점
- 지그재그와 느린 수렴의 설명 — 3점
- 처방 — 2점` },
      { sec: '10.4', type: 'mc', lv: 2, q: R`학습 중 어떤 ReLU 뉴런의 편향이 $-50$이 되어 모든 훈련 입력에서 $w^Tx+b<0$이 되었다. 옳은 것은?`,
        choices: [R`다음 갱신에서 기울기가 커져 곧 회복된다`, R`출력과 기울기가 모두 0이라 그 뉴런의 가중치는 더 이상 갱신되지 않는다`, R`출력이 음수가 되어 다음 층에 음의 신호를 준다`, R`학습률과 무관하게 일어나지 않는다`], ans: 1,
        sol: R`“죽은 ReLU”입니다. ReLU$'=0$이라 역전파 신호가 그 뉴런에서 끊깁니다. Leaky ReLU, 작은 학습률, 양의 초기 편향이 처방입니다.` },
    ],
  });
})();
