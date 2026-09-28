/* 추가 연습문제 — 12 학습률 스케줄과 배치 정규화. 계산과 짧은 증명을 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 12,
    problems: [
      { sec: '12.2', type: 'num', lv: 1, q: R`코사인 스케줄 $\alpha_t=\frac12\alpha_0(1+\cos\frac{t\pi}T)$에서 $\alpha_0=0.3$, $t=T/3$일 때 $\alpha_t$는?`, ans: '0.225', ansTex: R`0.225`,
        sol: R`$\cos\frac\pi3=\frac12$이므로 $0.15(1.5)=0.225$.` },
      { sec: '12.2', type: 'num', lv: 1, q: R`처음 5000번 반복 동안 0에서 $\alpha_0=0.1$까지 선형으로 올리는 워밍업에서 1200번째 반복의 학습률은?`, ans: '0.024', ansTex: R`0.024`,
        sol: R`$0.1\times1200/5000=0.024$.` },
      { sec: '12.3', type: 'num', lv: 2, q: R`한 특성의 미니배치 값이 $(2,4,4,6)$, $\varepsilon=0$, $\gamma=3$, $\beta=-1$일 때 값 $6$의 BN 출력은? (소수 넷째 자리)`, ans: '3*2/sqrt(2)-1', ansTex: R`3\sqrt2-1\approx3.2426`,
        sol: R`$\mu=4$, $\sigma^2=\frac{4+0+0+4}4=2$. $\hat x=\frac{6-4}{\sqrt2}=\sqrt2$. $y=3\sqrt2-1\approx3.2426$.` },
      { sec: '12.4', type: 'num', lv: 2, q: R`이동분산 $(\sigma^2)^{\text{run}}\leftarrow0.9(\sigma^2)^{\text{run}}+0.1\sigma^2_{\text{batch}}$, 초깃값 1, 배치 분산이 차례로 $5$, $3$이면 두 번 갱신한 뒤의 값은?`, ans: '1.56', ansTex: R`1.56`,
        sol: R`첫 갱신 $0.9(1)+0.1(5)=1.4$, 둘째 갱신 $0.9(1.4)+0.1(3)=1.26+0.3=1.56$.` },
      { sec: '12.3', type: 'open', lv: 2, proof: true, q: R`$\varepsilon=0$일 때 BN 출력 $y_{ij}=\gamma_j\hat x_{ij}+\beta_j$의 배치 평균이 $\beta_j$, 배치 표준편차가 $\lvert\gamma_j\rvert$임을 보이세요.`,
        sol: R`
$\hat x_{ij}=(x_{ij}-\mu_j)/\sigma_j$. 배치 평균: $\frac1N\sum_i\hat x_{ij}=\frac1{\sigma_j}\big(\frac1N\sum_ix_{ij}-\mu_j\big)=0$. 배치 분산: $\frac1N\sum_i\hat x_{ij}^2=\frac1{\sigma_j^2}\cdot\frac1N\sum_i(x_{ij}-\mu_j)^2=\frac{\sigma_j^2}{\sigma_j^2}=1$.
$y=\gamma\hat x+\beta$는 아핀변환이므로 평균 $\gamma\cdot0+\beta=\beta$, 분산 $\gamma^2\cdot1$, 표준편차 $\lvert\gamma\rvert$.`,
        rubric: R`
- $\hat x$의 평균 0 — 3점
- $\hat x$의 분산 1 — 4점
- 아핀변환의 평균·분산 — 3점` },
      { sec: '12.4', type: 'open', lv: 2, proof: true, q: R`BN 앞 층에 편향이 있어도 학습 시 BN 출력에는 영향이 없음을, 즉 모든 표본에 같은 $c_j$를 더한 $x_{ij}+c_j$의 BN 출력이 $x_{ij}$의 BN 출력과 같음을 보이세요.`,
        sol: R`
$x'_{ij}=x_{ij}+c_j$이면 $\mu'_j=\mu_j+c_j$, $x'_{ij}-\mu'_j=x_{ij}-\mu_j$, 따라서 $\sigma'^2_j=\sigma_j^2$. $\hat x'_{ij}=\hat x_{ij}$, 출력도 같습니다. 그래서 BN 앞 층의 편향은 쓸모가 없고 $\beta$가 그 역할을 대신합니다.`,
        rubric: R`
- 평균이 $c_j$만큼 이동 — 4점
- 편차와 분산 불변 — 4점
- 결론과 의미 — 2점` },
      { sec: '12.5', type: 'open', lv: 3, proof: true, q: R`BN 바로 앞의 가중치 행렬을 $W\to\alpha W$ ($\alpha>0$)로 바꾸면 ($\varepsilon=0$) (i) 출력이 같고 (ii) $\alpha W$에서의 기울기가 $W$에서의 기울기의 $\frac1\alpha$배임을 보이세요. 이것이 학습률에 대해 뜻하는 바는?`,
        sol: R`
**(i)** 특성 $j$마다 입력이 $\alpha x_{ij}$가 되면 평균 $\alpha\mu_j$, 표준편차 $\alpha\sigma_j$ ($\alpha>0$). $\frac{\alpha x_{ij}-\alpha\mu_j}{\alpha\sigma_j}=\hat x_{ij}$ — 같은 출력.
**(ii)** 손실을 가중치의 함수로 보면 (i)에서 $L(\alpha V)=L(V)$가 모든 $V$에서 성립합니다. $V$에 대해 미분하면 $\alpha\nabla L(\alpha V)=\nabla L(V)$, 즉 $\nabla L(\alpha W)=\frac1\alpha\nabla L(W)$.
**의미.** 가중치가 커지면 기울기가 작아지고 가중치 대비 상대적 갱신 크기는 $\frac1{\alpha^2}$배 — 유효 학습률이 자동으로 줄어 발산하기 어렵습니다. 그래서 BN을 쓰면 큰 학습률을 쓸 수 있습니다.`,
        rubric: R`
- (i) 평균·표준편차의 스케일 — 3점
- (ii) 항등식 미분으로 기울기 스케일 — 4점
- 유효 학습률의 의미 — 3점` },
      { sec: '12.4', type: 'mc', lv: 1, q: R`BN을 넣는 위치로 슬라이드가 제시한 것은?`,
        choices: [R`활성화 함수 다음, 다음 FC층 앞`, R`FC(또는 합성곱)층 다음, 비선형 활성화 앞`, R`손실함수 다음`, R`입력층에만`], ans: 1,
        sol: R`FC → BN → tanh → FC → BN → tanh ….` },
      { sec: '12.1', type: 'num', lv: 2, q: R`$f(x)=\frac52x^2$ ($\beta=5$)에서 GD $x\leftarrow x-\eta f'(x)$가 수렴하는 학습률의 상한은?`, ans: '0.4', ansTex: R`2/\beta=0.4`,
        sol: R`$x_{t+1}=(1-5\eta)x_t$, $\lvert1-5\eta\rvert<1\iff0<\eta<0.4$. 한 걸음에 도착하는 값은 $\eta=0.2$.` },
    ],
  });
})();
