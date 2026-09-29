/* 10 SGD·미니배치·활성화 함수 — 4주차 월요일(2) s.1–15 필기 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 10, part: 'C', title: 'SGD, 미니배치, 활성화 함수', en: 'Stochastic Gradients & Activations', ref: 'W4 월(2) · s.1–15', plot: 'sgd',
    fig: R`타원 등고선 위의 경사하강 경로(매끈한 굵은 선)와 확률적 경사하강 경로(흔들리는 선)`,
    tagline: R`미니배치 기울기의 기댓값은 전체 기울기와 같고 분산은 1/B로 줄어듭니다. 활성화 함수는 포화와 0 중심 여부로 고릅니다.`,
    summary: R`전체 자료로 기울기를 계산하는 배치 경사하강법, 표본 하나를 쓰는 확률적 경사하강법(SGD), 그 사이의 미니배치 SGD를 비교합니다. 미니배치 기울기는 **불편추정량**이라 기댓값이 같고, 배치 크기 $B$가 클수록 분산이 줄어듭니다. 이어서 시그모이드·tanh·ReLU의 장단점(포화로 인한 기울기 소실, 출력이 0 중심이 아닐 때 가중치 기울기의 부호가 모두 같아지는 문제, 죽은 ReLU)을 수식으로 확인합니다.`,
    goals: [
      R`배치·확률적·미니배치 기울기의 식과 장단점, 에폭당 갱신 횟수를 말할 수 있다`,
      R`무작위 표본의 기울기가 전체 기울기의 불편추정량임을 증명할 수 있다`,
      R`i.i.d. 미니배치 기울기의 공분산이 $\frac1B$배로 줄어듦을 보일 수 있다`,
      R`시그모이드의 포화와 $\sigma'\le\frac14$, tanh와의 관계를 설명할 수 있다`,
      R`입력이 모두 양수이면 한 뉴런의 가중치 기울기 부호가 모두 같아짐을 보일 수 있다`,
    ],
    secTitles: { '10.1': '세 가지 기울기', '10.2': '기댓값과 분산', '10.3': '미니배치 SGD', '10.4': '활성화 함수' },
    sections: [
      { k: '10.1', src: 'W4 월(2) · 슬라이드 2–5 필기', title: '전체 배치, 확률적, 미니배치 기울기', body: R`
손실이 자료점마다의 손실의 평균 $f(x)=\frac1N\sum_{i=1}^Nf_i(x)$, $f_i(x)=L(\hat y_i,y_i)$라 합시다.

:::key 미니배치 기울기의 비편향성
- **전체(배치) 기울기**: $\nabla f=\frac1N\sum_{i=1}^N\nabla f_i$ — 정확하지만 한 걸음이 매우 비쌈
- **확률적 기울기**: $i\sim\mathrm{Uniform}\{1,\dots,N\}$, $\tilde f=f_i$, $\nabla\tilde f=\nabla f_i$ — 한 걸음이 매우 빠르지만 분산이 커서 경로가 불안정
- **미니배치 기울기**: $K\subset\{1,\dots,N\}$, $\nabla\tilde f=\frac1{\lvert K\rvert}\sum_{k\in K}\nabla f_k$ — 전체보다 훨씬 빠르고 표본 하나보다 안정적

무작위로 고르면 $\E[\nabla f_i(x)]=\nabla f(x)$, $\E[\nabla\tilde f(x)]=\nabla f(x)$ (불편).
:::

증명은 한 줄입니다: $i$가 균등하면 $\E[\nabla f_i]=\sum_{i=1}^N\frac1N\nabla f_i=\nabla f$. 대부분의 딥러닝은 미니배치 SGD를 씁니다.

**에폭.** 훈련 자료 전체를 한 번 훑는 것이 한 에폭입니다. 필기의 예: 자료 1000개를 크기 100의 미니배치로 나누면 한 에폭에 **10번** 갱신합니다(배치 GD는 1번, 표본 하나 SGD는 1000번).
` },
      { k: '10.2', src: 'W4 월(2) · 슬라이드 6', title: '기댓값은 같고 분산은 다르다', body: R`
세 방법의 기울기는 기댓값이 모두 전체 기울기와 같습니다. 차이는 **분산**입니다. 등고선 그림에서 배치 GD는 매끈하게, 미니배치는 약간 지그재그로, SGD는 심하게 흔들리며 최소점으로 갑니다. SGD 학습 곡선은 들쭉날쭉합니다.

:::key 미니배치 기울기의 분산
$g_i=\nabla f_i(x)$, $\Sigma=\frac1N\sum_i(g_i-\nabla f)(g_i-\nabla f)^T$ (표본 하나 기울기의 공분산). 미니배치의 첨자 $k_1,\dots,k_B$를 **복원추출**(i.i.d. 균등)하면
$$\Cov\Big(\frac1B\sum_{b=1}^Bg_{k_b}\Big)=\frac1B\Sigma,\qquad \E\Big\lVert\frac1B\sum_bg_{k_b}-\nabla f\Big\rVert^2=\frac{\tr\Sigma}B.$$
비복원추출이면 $\frac{N-B}{N-1}\cdot\frac{\Sigma}B$ ($B=N$이면 0).
:::

즉 배치를 4배 키우면 기울기 잡음의 표준편차가 절반이 됩니다. 불편성만으로도 볼록 문제의 수렴 속도가 보장됩니다[[@ml:ch11:14.3|SGD 수렴 정리: E[f(w̄)] − f(w*) ≤ Bρ/√T.]]. 한편 계산량은 $B$에 비례하므로, 같은 계산량이라면 작은 배치로 여러 번 가는 쪽이 유리한 경우가 많습니다. 13단원의 **SGD 하강 보조정리**에서 이 분산 항이 수렴 속도를 제한하는 모습을 봅니다[[ch13:13.6|$\E_t[f(x_{t+1})]\le f(x_t)-\eta\lVert\nabla f\rVert^2+\frac L2\eta^2\E_t\lVert\tilde\nabla f\rVert^2$.]].
` },
      { k: '10.3', src: 'W4 월(2) · 슬라이드 7', title: '미니배치 SGD 알고리즘', body: R`
반복:
1. 자료에서 미니배치를 뽑는다 (배치 크기는?)
2. 순방향으로 그래프(신경망)를 통과시켜 손실을 얻는다
3. 역전파로 기울기를 계산한다[[ch09:9.2|계산 그래프와 연쇄법칙.]]
4. 기울기로 파라미터를 갱신한다

실제로는 에폭마다 자료를 **섞은 뒤** 순서대로 잘라 쓰는 경우가 많습니다(비복원추출). 의료 인공지능 과목의 Algorithm 7.2가 이 방식입니다[[@med:ch08:7.2|미니배치 SGD: $n>N$이면 섞고 처음부터.]].
` },
      { k: '10.4', src: 'W4 월(2) · 슬라이드 8–15 필기', title: '활성화 함수 다시 보기', body: R`
:::key 활성화 함수의 도함수
$$\sigma'(z)=\sigma(z)(1-\sigma(z))\in\big(0,\tfrac14\big],\qquad \tanh'(z)=1-\tanh^2(z)\in(0,1],\qquad \ReLU'(z)=\begin{cases}1&z>0\\0&z<0\end{cases}$$
$\tanh(z)=2\sigma(2z)-1$.
:::

**시그모이드** $g(z)=\frac1{1+e^{-z}}$
- 장점: 출력이 $[0,1]$로 제한됨
- 단점 1: **포화된 뉴런에서 기울기가 0**. $\lvert z\rvert$가 크면 $\sigma'(z)\approx0$이라 역전파 신호가 사라집니다.
- 단점 2: **출력이 0 중심이 아님**(항상 양수). 다음 층의 가중치 기울기 $\frac{\partial L}{\partial W}=\frac{\partial L}{\partial h}\,z^T$에서 입력 $z$가 모두 양수이면, 한 뉴런에 들어오는 가중치들의 기울기 부호가 모두 같아집니다. 그래서 가중치가 “모두 양의 방향” 또는 “모두 음의 방향”으로만 움직여 지그재그 경로가 생깁니다.

:::key 시그모이드 출력은 0 중심이 아니다
뉴런 $s=\sum_iw_ix_i+b$에서 모든 $x_i>0$이면 $\frac{\partial L}{\partial w_i}=\frac{\partial L}{\partial s}x_i$의 부호는 $i$에 관계없이 $\frac{\partial L}{\partial s}$의 부호와 같다.
:::

**tanh**: 출력 $[-1,1]$, **0 중심(대칭)**. 그러나 여전히 포화 구간에서 기울기가 0.

**ReLU** $g(z)=\max(0,z)$
- 장점: 양수 구간에서 포화가 없고 계산이 쉬움
- 단점: 출력이 0 중심이 아님, **음수 입력에서 기울기 0** — 한 번 모든 입력에서 음수가 되면 다시 살아나지 못하는 “죽은 ReLU”

**기타**: Leaky ReLU $\max(0.01x,x)$(음수 구간에도 작은 기울기), ELU $x\ (x>0)$, $\alpha(e^x-1)\ (x\le0)$(음수 쪽이 매끈하게 포화, 평균이 0에 가까움).
` },
    ],
    problems: [
      { sec: '10.1', type: 'num', lv: 1, q: R`훈련 자료 1000개를 배치 크기 100으로 나눌 때 한 에폭의 갱신 횟수는?`, ans: '10', ansTex: R`10`,
        sol: R`$1000/100=10$. 배치 GD는 1번, 표본 하나 SGD는 1000번.` },
      { sec: '10.1', type: 'num', lv: 1, q: R`자료 $N=50000$, 배치 $B=128$(마지막 불완전 배치 포함)일 때 한 에폭의 갱신 횟수는?`, ans: '391', ansTex: R`\lceil 50000/128\rceil=391`,
        sol: R`$50000/128=390.6$이므로 391번(마지막 배치는 80개).` },
      { sec: '10.1', type: 'mc', lv: 1, q: R`전체 배치 경사하강법의 특징으로 옳은 것은?`,
        choices: [R`기울기가 부정확하지만 빠르다`, R`기울기는 정확하지만 한 걸음이 비싸다`, R`분산이 가장 크다`, R`에폭 개념이 없다`], ans: 1,
        sol: R`$\frac1N\sum\nabla f_i$를 매번 계산해야 합니다.` },
      { sec: '10.2', type: 'mc', lv: 2, q: R`균등하게 뽑은 표본의 기울기 $\nabla f_i$에 대해 옳은 것은?`,
        choices: [R`$\E[\nabla f_i]=N\nabla f$`, R`$\E[\nabla f_i]=\nabla f$`, R`$\nabla f_i=\nabla f$ 항상`, R`분산이 0`], ans: 1,
        sol: R`$\sum_i\frac1N\nabla f_i=\nabla f$ (불편). 개별 값은 다르고 분산이 있습니다.` },
      { sec: '10.2', type: 'num', lv: 2, q: R`표본 하나 기울기의 분산(스칼라)이 $\sigma^2=16$이다. i.i.d. 미니배치 $B=64$의 기울기 표준편차는?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`분산 $16/64=0.25$, 표준편차 $0.5$.` },
      { sec: '10.2', type: 'num', lv: 3, q: R`스칼라 기울기 $g_i\in\{1,3,5,7\}$ ($N=4$)에서 크기 2의 미니배치를 **비복원**으로 뽑을 때 미니배치 평균의 분산은?`, ans: '5/3', ansTex: R`\tfrac53`,
        sol: R`$\sigma^2=\frac14\sum(g_i-4)^2=\frac{9+1+1+9}4=5$. 비복원: $\frac{N-B}{N-1}\frac{\sigma^2}B=\frac23\cdot\frac52=\frac53$. (6개 쌍의 평균 $2,3,4,4,5,6$의 분산으로 확인: 평균 4, 제곱편차 합 $4+1+0+0+1+4=10$, $10/6=5/3$.)` },
      { sec: '10.4', type: 'num', lv: 1, q: R`$z=4$에서 $\sigma'(z)$는? (소수 넷째 자리)`, ans: 'e^(-4)/(1+e^(-4))^2', ansTex: R`\approx0.0177`,
        sol: R`$\sigma(4)\approx0.9820$, $\sigma'=0.9820\times0.0180\approx0.0177$. 포화 구간이라 기울기가 작습니다.` },
      { sec: '10.4', type: 'num', lv: 2, q: R`$\tanh'(0)$은?`, ans: '1', ansTex: R`1`,
        sol: R`$1-\tanh^2(0)=1$. 시그모이드의 최대 기울기 $\frac14$의 4배입니다($\tanh(z)=2\sigma(2z)-1$이라 $\tanh'(z)=4\sigma'(2z)$).` },
      { sec: '10.4', type: 'mc', lv: 2, q: R`시그모이드 출력이 0 중심이 아니어서 생기는 문제는?`,
        choices: [R`출력이 1을 넘는다`, R`다음 층 한 뉴런의 가중치 기울기가 모두 같은 부호가 되어 지그재그로 갱신된다`, R`역전파가 불가능하다`, R`손실이 음수가 된다`], ans: 1,
        sol: R`$\partial L/\partial w_i=\delta\,x_i$, $x_i>0$이면 부호가 $\delta$와 같습니다. 최적 방향이 일부는 +, 일부는 −이면 한 번에 갈 수 없습니다.` },
      { sec: '10.4', type: 'mc', lv: 2, q: R`ReLU의 단점으로 슬라이드가 든 것은?`,
        choices: [R`양수 구간 포화`, R`음수 입력에서 기울기 0과 0 중심이 아닌 출력`, R`계산이 비쌈`, R`출력이 유계`], ans: 1,
        sol: R`양수 구간은 포화가 없고 계산이 쉬운 것이 장점입니다.` },
      { sec: '10.4', type: 'mc', lv: 1, q: R`출력이 0 중심(대칭)이면서 포화 문제는 남아 있는 활성화 함수는?`,
        choices: [R`시그모이드`, R`tanh`, R`ReLU`, R`Leaky ReLU`], ans: 1,
        sol: R`tanh의 치역은 $[-1,1]$이고 원점 대칭입니다. 포화 구간 기울기는 여전히 0에 가깝습니다.` },
      { sec: '10.2', type: 'open', lv: 2, proof: true, q: R`$f=\frac1N\sum_if_i$에서 첨자 $k_1,\dots,k_B$를 $\{1,\dots,N\}$에서 독립·균등하게 뽑을 때, 미니배치 기울기 $\hat g=\frac1B\sum_b\nabla f_{k_b}$가 불편이고 $\E\lVert\hat g-\nabla f\rVert^2=\frac1B\cdot\frac1N\sum_i\lVert\nabla f_i-\nabla f\rVert^2$임을 보이세요.`,
        sol: R`
**불편.** $\E[\nabla f_{k_b}]=\sum_i\frac1N\nabla f_i=\nabla f$이므로 선형성으로 $\E\hat g=\nabla f$.
**분산.** $e_b=\nabla f_{k_b}-\nabla f$는 서로 독립이고 $\E e_b=0$, $\E\lVert e_b\rVert^2=\frac1N\sum_i\lVert\nabla f_i-\nabla f\rVert^2=:s^2$.
$$\E\Big\lVert\frac1B\sum_be_b\Big\rVert^2=\frac1{B^2}\Big(\sum_b\E\lVert e_b\rVert^2+\sum_{b\ne c}\E[e_b]^T\E[e_c]\Big)=\frac1{B^2}\cdot Bs^2=\frac{s^2}B.$$
교차항은 독립성과 $\E e_b=0$으로 0입니다.`,
        rubric: R`
- 불편성 — 3점
- 오차 분해와 독립성 — 3점
- 교차항 소거와 $s^2/B$ — 4점` },
      { sec: '10.4', type: 'open', lv: 2, proof: true, q: R`(1) $\sigma'(z)\le\frac14$임을 보이고 (2) $\tanh(z)=2\sigma(2z)-1$과 $\tanh'(z)=1-\tanh^2(z)$를 증명하세요.`,
        sol: R`
(1) $s=\sigma(z)\in(0,1)$이면 $\sigma'=s(1-s)=\frac14-(s-\frac12)^2\le\frac14$, 등호 $z=0$.
(2) $2\sigma(2z)-1=\frac2{1+e^{-2z}}-1=\frac{1-e^{-2z}}{1+e^{-2z}}=\frac{e^z-e^{-z}}{e^z+e^{-z}}=\tanh z$.
$\tanh'(z)=\frac{(e^z+e^{-z})^2-(e^z-e^{-z})^2}{(e^z+e^{-z})^2}=1-\tanh^2z$. (또는 $4\sigma'(2z)=4\sigma(2z)(1-\sigma(2z))$에 $\sigma(2z)=\frac{1+\tanh z}2$를 넣어도 됨.)`,
        rubric: R`
- (1) 완전제곱 — 3점
- (2) 항등식 — 3점
- (2) 도함수 — 4점` },
    ],
  });
})();
