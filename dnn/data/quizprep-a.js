/* 퀴즈 대비 연습문제 (1) — 01–07단원. Problem Set 1과 같은 모양(정의 → 유도·증명 → 작은 계산 → 해석)으로 새로 만든 문제입니다.
   quiz: 'ps1-pN'은 Problem Set 1의 문제 N과 같은 유형, quiz: true는 그 밖의 단원을 같은 형식으로 낸 것입니다.
   manifest의 맨 끝에 두어 기존 문제 번호(저장된 풀이 기록)가 바뀌지 않게 합니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;

  EM.more.push({ n: 1, problems: [
    { sec: '1.3', type: 'open', lv: 3, proof: true, quiz: true, q: R`가중치 $c_i\gt0$을 둔 가중 최소제곱 $J(\beta)=\sum_{i=1}^nc_i(y_i-x_i^T\beta)^2=(y-X\beta)^TC(y-X\beta)$, $C=\diag(c_1,\dots,c_n)$을 생각하자. $X\in\mathbb R^{n\times p}$의 열은 일차독립이다.
1. $\nabla_\beta J$를 구하고 정규방정식 $X^TCX\beta=X^TCy$를 유도하시오.
2. $X^TCX$가 양의 정부호임을 보이고, 정규방정식의 해가 $J$의 유일한 최소점임을 보이시오.
3. 자료 $(x,y)=(0,1),(1,2),(2,3)$에 절편 없는 모델 $y=\beta x$를 가중치 $c=(1,1,2)$로 맞출 때 $\hat\beta$를 구하고, 가중치가 모두 1일 때와 비교하시오.
4. 잡음이 $\varepsilon_i\sim\N(0,\sigma_i^2)$ (독립, $\sigma_i^2$은 앎)인 모델 $y_i=x_i^T\beta+\varepsilon_i$의 MLE가 $c_i=1/\sigma_i^2$인 가중 최소제곱의 해임을 보이시오.`,
      hint: R`$C$가 대칭이므로 $\nabla_\beta(\beta^TA\beta)=2A\beta$ ($A=X^TCX$)를 쓸 수 있습니다.`,
      sol: R`
**1.** $C$가 대칭이므로 $J=y^TCy-2\beta^TX^TCy+\beta^TX^TCX\beta$. 벡터 미분 공식 $\nabla(b^T\beta)=b$, $\nabla(\beta^TA\beta)=2A\beta$ (대칭 $A$)로
$$\nabla_\beta J=-2X^TCy+2X^TCX\beta=0\ \Longrightarrow\ X^TCX\beta=X^TCy.$$
**2.** $v\ne0$이면 $v^TX^TCXv=(Xv)^TC(Xv)=\sum_ic_i(Xv)_i^2\ge0$이고, 모든 $c_i\gt0$이라 등호는 $Xv=0$일 때뿐인데 열이 일차독립이므로 $Xv\ne0$. 따라서 $X^TCX\succ0$ (가역). 헤시안 $2X^TCX\succ0$이라 $J$는 강볼록이고, 유일한 정류점 $\hat\beta=(X^TCX)^{-1}X^TCy$가 유일한 최소점입니다.
**3.** $X^TCX=\sum c_ix_i^2=0+1+2\cdot4=9$, $X^TCy=\sum c_ix_iy_i=0+2+2\cdot2\cdot3=14$이므로 $\hat\beta=\frac{14}9\approx1.556$. 가중치가 모두 1이면 $\frac{\sum x_iy_i}{\sum x_i^2}=\frac85=1.6$. 가중치 2를 받은 점 $(2,3)$ (기울기 1.5 쪽)으로 끌려갑니다. $x=0$인 점은 절편 없는 기울기에 영향이 없습니다.
**4.** 로그가능도 $\ell(\beta)=\sum_i\Big[-\frac12\log(2\pi\sigma_i^2)-\frac{(y_i-x_i^T\beta)^2}{2\sigma_i^2}\Big]$. 첫 항은 $\beta$와 무관하므로 $\argmax\ell=\argmin\sum_i\frac1{\sigma_i^2}(y_i-x_i^T\beta)^2$ — $c_i=1/\sigma_i^2$인 가중 최소제곱입니다. 잡음이 큰(믿기 어려운) 점일수록 가중치가 작습니다.`,
      rubric: R`
- 기울기와 정규방정식(대칭성 사용 명시) — 3점
- 양의 정부호: $c_i\gt0$과 열의 일차독립을 모두 사용 — 2점, 유일한 최소점 결론 — 1점
- 수치 계산과 비교 — 2점
- MLE와의 동치 — 2점` },
  ] });

  EM.more.push({ n: 2, problems: [
    { sec: '2.6', type: 'open', lv: 3, proof: true, quiz: 'ps1-p2', q: R`$X_1,\dots,X_n$이 독립이고 $X_i\sim\operatorname{Poi}(\lambda)$, 즉 $P(X_i=k\mid\lambda)=e^{-\lambda}\lambda^k/k!$ ($\lambda\gt0$)이다. 사전분포는 감마분포 $p(\lambda)\propto\lambda^{\alpha-1}e^{-\beta\lambda}$ ($\alpha\ge1$, $\beta\gt0$)이고 $S=\sum_iX_i$, $S+\alpha-1\gt0$이라 하자.
1. 사후분포가 $\lambda^{S+\alpha-1}e^{-(n+\beta)\lambda}$에 비례함을 보이고, MAP 추정량 $\hat\lambda_{\text{MAP}}=\dfrac{S+\alpha-1}{n+\beta}$를 유도하시오. (최대임을 확인할 것)
2. $\hat\lambda_{\text{MAP}}$을 MLE $\bar X=S/n$과 사전분포의 최빈값 $(\alpha-1)/\beta$의 가중평균으로 쓰고, 가중치의 뜻을 설명하시오.
3. $\lambda$를 고정하고 $X$의 표본분포에 대해 $\hat\lambda_{\text{MAP}}$의 편향, 분산, MSE를 구하시오. ($\E X_i=\Var X_i=\lambda$)`,
      sol: R`
**1.** 베이즈 정리로 $p(\lambda\mid X)\propto p(X\mid\lambda)p(\lambda)$. 독립이므로 가능도는 곱:
$$p(X\mid\lambda)=\prod_{i=1}^n\frac{e^{-\lambda}\lambda^{X_i}}{X_i!}=\frac{e^{-n\lambda}\lambda^{S}}{\prod_iX_i!}.$$
$\prod_iX_i!$는 $\lambda$와 무관하므로 버리면 $p(\lambda\mid X)\propto\lambda^{S+\alpha-1}e^{-(n+\beta)\lambda}$. 로그를 취하면 $\ell(\lambda)=(S+\alpha-1)\log\lambda-(n+\beta)\lambda+C$,
$$\ell'(\lambda)=\frac{S+\alpha-1}\lambda-(n+\beta)=0\ \Rightarrow\ \hat\lambda=\frac{S+\alpha-1}{n+\beta},\qquad \ell''(\lambda)=-\frac{S+\alpha-1}{\lambda^2}\lt0.$$
$\ell$이 오목이라 이 정류점이 최대점이고, $\log$가 증가함수라 사후분포의 최대점과 같습니다.
**2.** $\hat\lambda=\dfrac n{n+\beta}\cdot\dfrac Sn+\dfrac\beta{n+\beta}\cdot\dfrac{\alpha-1}\beta$. 두 가중치의 합은 1이고, $\beta$는 “미리 본 관측 개수”처럼 행동합니다(그 가상 관측들의 합이 $\alpha-1$). $n\to\infty$이면 MLE 쪽 가중치가 1로 가서 자료가 사전 믿음을 이깁니다.
**3.** 독립인 합이므로 $\E S=n\lambda$, $\Var S=n\lambda$.
$$\text{편향}=\frac{n\lambda+\alpha-1}{n+\beta}-\lambda=\frac{\alpha-1-\beta\lambda}{n+\beta},\qquad\text{분산}=\frac{n\lambda}{(n+\beta)^2},$$
$$\mathrm{MSE}=\frac{(\alpha-1-\beta\lambda)^2+n\lambda}{(n+\beta)^2}.$$
검산: 참값이 사전 최빈값 $\lambda=(\alpha-1)/\beta$이면 편향이 0이고, MLE의 MSE $\lambda/n$보다 분산 $\frac{n\lambda}{(n+\beta)^2}$이 작습니다.`,
      rubric: R`
- 베이즈 정리 + 독립 → 가능도의 곱, $\lambda$와 무관한 상수 제거 — 2점
- 도함수 = 0과 2계 도함수로 최대 확인 — 2점
- 가중평균 표현과 해석 — 2점
- 편향·분산·MSE — 4점` },
    { sec: '2.8', type: 'open', lv: 3, proof: true, quiz: 'ps1-p2', q: R`Problem Set 1 문제 2를 일반화한다. $X_1,\dots,X_n$ 독립, $X_i\sim\N(\theta,\sigma^2)$ ($\sigma^2$은 앎), 사전분포 $\theta\sim\N(\mu_0,\tau^2)$.
1. $\hat\theta_{\text{MAP}}=\argmin_\theta\Big[\sum_i(X_i-\theta)^2+\frac{\sigma^2}{\tau^2}(\theta-\mu_0)^2\Big]$임을 보이고, $\hat\theta_{\text{MAP}}=a\bar X+(1-a)\mu_0$, $a=\dfrac{n\tau^2}{n\tau^2+\sigma^2}$를 구하시오.
2. $\theta$를 고정하고 편향, 분산, MSE를 구하시오.
3. $\mathrm{MSE}(\hat\theta_{\text{MAP}})\lt\mathrm{MSE}(\bar X)$일 필요충분조건이 $(\theta-\mu_0)^2\lt2\tau^2+\dfrac{\sigma^2}n$임을 보이시오. $\mu_0=0$, $\sigma^2=1$이면 Problem Set 1의 무엇과 같은가?`,
      sol: R`
**1.** $\log p(\theta\mid X)=-\frac1{2\sigma^2}\sum_i(X_i-\theta)^2-\frac1{2\tau^2}(\theta-\mu_0)^2+C$. 양수 $2\sigma^2$을 곱하고 부호를 바꾸면 최대화가 괄호 안의 최소화가 됩니다. $\lambda=\sigma^2/\tau^2$로 두면
$$-2\sum_i(X_i-\theta)+2\lambda(\theta-\mu_0)=0\ \Rightarrow\ \hat\theta=\frac{n\bar X+\lambda\mu_0}{n+\lambda},$$
2계 도함수 $2(n+\lambda)\gt0$이라 최소점. $a=\frac n{n+\lambda}=\frac{n\tau^2}{n\tau^2+\sigma^2}$, $1-a=\frac\lambda{n+\lambda}$.
**2.** $\E\bar X=\theta$, $\Var\bar X=\sigma^2/n$이고 $\mu_0$은 상수이므로
$$\text{편향}=a\theta+(1-a)\mu_0-\theta=(1-a)(\mu_0-\theta),\qquad\text{분산}=\frac{a^2\sigma^2}n,$$
$$\mathrm{MSE}=(1-a)^2(\theta-\mu_0)^2+\frac{a^2\sigma^2}n.$$
**3.** $\mathrm{MSE}(\bar X)=\sigma^2/n$. 부등식 $(1-a)^2(\theta-\mu_0)^2\lt(1-a^2)\frac{\sigma^2}n$의 양변을 양수 $1-a$로 나누면(동치)
$$(\theta-\mu_0)^2\lt\frac{1+a}{1-a}\cdot\frac{\sigma^2}n=\frac{2n\tau^2+\sigma^2}{\sigma^2}\cdot\frac{\sigma^2}n=2\tau^2+\frac{\sigma^2}n.$$
$\mu_0=0$, $\sigma^2=1$이면 $\theta^2\lt2\tau^2+\frac1n$ — Problem Set 1 풀이의 “MAP이 MLE보다 나을 조건”입니다. 참값이 사전분포의 중심 $\mu_0$ 근처일수록 수축이 이득입니다.`,
      rubric: R`
- 로그 사후분포와 양의 상수배로 argmin 변환 — 2점
- 정류점, 2계 조건, $a$ — 2점
- 편향(상수 $\mu_0$ 처리)·분산·MSE — 3점
- 필요충분조건: 양수로 나누는 동치 변형 명시 — 3점` },
    { sec: '2.6', type: 'open', lv: 3, proof: true, quiz: 'ps1-p2', q: R`$X_1,\dots,X_n$ 독립, $X_i\sim\operatorname{Bern}(\theta)$, 사전분포 $\operatorname{Beta}(2,2)$ (즉 $p(\theta)\propto\theta(1-\theta)$), $S=\sum_iX_i$.
1. $\hat\theta_{\text{MAP}}=\dfrac{S+1}{n+2}$를 유도하시오.
2. $\theta$를 고정하고 편향, 분산, MSE를 구하시오.
3. $\theta=\frac12$이면 모든 $n\ge1$에서 MAP의 MSE가 MLE $S/n$의 MSE보다 작음을 보이시오. $\theta=1$이면 어느 쪽이 작은가? 이유를 한 문장으로 쓰시오.`,
      sol: R`
**1.** $p(\theta\mid X)\propto\theta^S(1-\theta)^{n-S}\cdot\theta(1-\theta)=\theta^{S+1}(1-\theta)^{n-S+1}$. 로그의 도함수
$$\frac{S+1}\theta-\frac{n-S+1}{1-\theta}=0\ \Rightarrow\ (S+1)(1-\theta)=(n-S+1)\theta\ \Rightarrow\ \theta=\frac{S+1}{n+2}.$$
2계 도함수 $-\frac{S+1}{\theta^2}-\frac{n-S+1}{(1-\theta)^2}\lt0$ (두 계수 모두 $\ge1$)이라 최대점입니다.
**2.** $\E S=n\theta$, $\Var S=n\theta(1-\theta)$이므로
$$\text{편향}=\frac{n\theta+1}{n+2}-\theta=\frac{1-2\theta}{n+2},\qquad\text{분산}=\frac{n\theta(1-\theta)}{(n+2)^2},$$
$$\mathrm{MSE}=\frac{(1-2\theta)^2+n\theta(1-\theta)}{(n+2)^2}.$$
**3.** $\theta=\frac12$: $\mathrm{MSE}_{\text{MAP}}=\frac{n/4}{(n+2)^2}$, $\mathrm{MSE}_{\text{MLE}}=\frac{\theta(1-\theta)}n=\frac1{4n}$. $\frac n{(n+2)^2}\lt\frac1n\iff n^2\lt(n+2)^2$은 항상 참. $\theta=1$: MLE는 늘 정확히 1이라 MSE 0이고, MAP은 $\frac1{(n+2)^2}\gt0$ — MLE가 낫습니다. 사전분포가 추정값을 $\frac12$ 쪽으로 당기므로, 참값이 끝에 있으면 그 당김이 순수한 손해(편향)가 됩니다.`,
      rubric: R`
- 사후분포 전개와 MAP 유도(최대 확인 포함) — 3점
- 편향·분산·MSE — 4점
- 두 경우의 비교와 이유 — 3점` },
    { sec: '2.8', type: 'open', lv: 3, proof: true, quiz: 'ps1-p2', q: R`입력 $x$를 고정하고 새 관측 $Y=f(x)+\varepsilon$, $\E\varepsilon=0$, $\Var\varepsilon=\sigma^2$이라 하자. 예측기 $\hat f(x)$는 훈련 자료 $D$의 함수이고 $\varepsilon$은 $D$와 독립이다.
1. $\E_{D,\varepsilon}\big[(Y-\hat f(x))^2\big]=\sigma^2+\big(\E_D\hat f(x)-f(x)\big)^2+\Var_D\big(\hat f(x)\big)$를 증명하시오.
2. 세 항의 이름과 뜻을 쓰고, 어떤 예측기를 써도 줄일 수 없는 항은 무엇인지 쓰시오.
3. Problem Set 1 문제 2의 설정에서 새 관측 $Y\sim\N(\theta,1)$ (자료와 독립)을 $\hat\theta_{\text{MAP}}$으로 예측할 때 기대 제곱 예측오차를 구하시오.`,
      sol: R`
**1.** $Y-\hat f=\varepsilon+(f-\hat f)$이므로 $(Y-\hat f)^2=\varepsilon^2+2\varepsilon(f-\hat f)+(f-\hat f)^2$. 기댓값을 취하면
- $\E\varepsilon^2=\Var\varepsilon=\sigma^2$ ($\E\varepsilon=0$).
- $\hat f$는 $D$만의 함수이고 $\varepsilon$은 $D$와 독립이므로 $\E[\varepsilon(f-\hat f)]=\E\varepsilon\cdot\E(f-\hat f)=0$.
- $\E_D(\hat f-f)^2=(\E\hat f-f)^2+\Var\hat f$: Problem Set 1 문제 2-3의 편향-분산 분해를 $\hat\theta=\hat f$, $\theta=f$로 쓴 것입니다($\mu=\E\hat f$를 더하고 빼서 전개, 교차항은 $\E[\hat f-\mu]=0$과 $\mu-f$가 상수라서 0).
세 결과를 더하면 식이 나옵니다. $\blacksquare$
**2.** $\sigma^2$: 줄일 수 없는 잡음(어떤 예측기로도 못 줄임). 둘째 항: 편향², 모델이 평균적으로 빗나가는 정도. 셋째 항: 분산, 훈련 자료가 바뀔 때 예측이 흔들리는 정도.
**3.** $\sigma^2=1$이고 둘째·셋째 항의 합이 $\hat\theta_{\text{MAP}}$의 MSE이므로
$$1+\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}.$$`,
      rubric: R`
- 오차를 $\varepsilon+(f-\hat f)$로 나누어 전개 — 1점
- 교차항이 0인 이유(독립성과 $\E\varepsilon=0$) — 2점
- 편향-분산 분해 적용(교차항 처리 포함) — 2점
- 항의 해석 — 2점
- 수치 표현 — 3점` },
    { sec: '2.5', type: 'open', lv: 2, proof: true, quiz: 'ps1-p2', q: R`$X_i\mid\theta\sim\N(\theta,1)$ (독립), 사전분포 $\theta\sim\N(0,\tau^2)$.
1. 관측 하나 $x_1$을 본 뒤의 사후분포가 $\N(m_1,v_1)$, $\dfrac1{v_1}=1+\dfrac1{\tau^2}$, $m_1=v_1x_1$임을 제곱 완성으로 보이시오.
2. 이 사후분포를 새 사전분포로 삼아 $x_2$로 한 번 더 갱신하면 $\N(m_2,v_2)$, $\dfrac1{v_2}=2+\dfrac1{\tau^2}$, $m_2=v_2(x_1+x_2)$임을 보이시오.
3. 두 관측을 한꺼번에 쓴 사후분포(Problem Set 1 문제 2의 $n=2$: 평균 $a\bar X$, 분산 $\frac1{n+1/\tau^2}$)와 같음을 확인하고, 왜 같아야 하는지 가능도의 곱으로 설명하시오.`,
      sol: R`
**1.** $\log p(\theta\mid x_1)=-\frac12(x_1-\theta)^2-\frac{\theta^2}{2\tau^2}+C=-\frac12\Big[\frac1{v_1}\theta^2-2x_1\theta\Big]+C'$. 괄호를 제곱 완성하면 $\frac1{v_1}(\theta-v_1x_1)^2-v_1x_1^2$이므로
$$\log p(\theta\mid x_1)=-\frac{(\theta-v_1x_1)^2}{2v_1}+C''$$
— 평균 $m_1=v_1x_1$, 분산 $v_1$인 정규분포의 로그밀도(상수 차이)입니다.
**2.** $\log p(\theta\mid x_1,x_2)=-\frac{(\theta-m_1)^2}{2v_1}-\frac{(x_2-\theta)^2}2+C$. $\theta^2$의 계수 $-\frac12\big(\frac1{v_1}+1\big)$에서 $\frac1{v_2}=\frac1{v_1}+1=2+\frac1{\tau^2}$ (정밀도가 더해짐). $\theta$의 계수 $\frac{m_1}{v_1}+x_2=x_1+x_2$에서 $m_2=v_2(x_1+x_2)$.
**3.** $n=2$: $a\bar X=\frac{2\tau^2}{2\tau^2+1}\cdot\frac{x_1+x_2}2=\frac{\tau^2(x_1+x_2)}{2\tau^2+1}$이고 $v_2=\frac1{2+1/\tau^2}=\frac{\tau^2}{2\tau^2+1}$이므로 $m_2=v_2(x_1+x_2)$와 같고 분산도 같습니다. 이유: $\theta$가 주어지면 $x_1,x_2$가 독립이라
$$p(\theta\mid x_1,x_2)\propto p(x_2\mid\theta)\,\big[p(x_1\mid\theta)\,p(\theta)\big]\propto p(x_2\mid\theta)\,p(\theta\mid x_1).$$
가능도가 곱이라 순서대로 곱하든 한꺼번에 곱하든 결과가 같습니다(2.5절의 베타 순차 갱신과 같은 원리).`,
      rubric: R`
- 제곱 완성으로 평균·분산 읽기 — 3점
- 순차 갱신의 정밀도·평균 — 3점
- 일괄 사후분포와의 일치 확인 — 2점, 가능도 곱으로 이유 설명 — 2점` },
  ] });

  EM.more.push({ n: 3, problems: [
    { sec: '3.3', type: 'open', lv: 3, proof: true, quiz: 'ps1-p1', q: R`모든 $x$에서 $p(x)\gt0$, $q(x)\gt0$인 두 이산분포에 대해 제프리스 발산 $J(p,q)=D_{KL}(p\Vert q)+D_{KL}(q\Vert p)$를 정의한다.
1. $J(p,q)=\sum_x\big(p(x)-q(x)\big)\log\dfrac{p(x)}{q(x)}$임을 보이시오.
2. (i) $J\ge0$, (ii) $J=0\iff p=q$, (iii) $J(p,q)=J(q,p)$를 KL의 성질로 증명하시오.
3. 1의 식에서 **각 항**이 음이 아님을 직접 보여, (i)과 (ii)를 KL의 성질 없이 다시 증명하시오.
4. 받침이 다르면 어떻게 되는지 $p=(1,0)$, $q=(\frac12,\frac12)$로 보이고, 같은 쌍의 젠센-섀넌 발산 값과 비교하시오.`,
      sol: R`
**1.** $D_{KL}(q\Vert p)=\sum_xq\log\frac qp=-\sum_xq\log\frac pq$이므로 $J=\sum_xp\log\frac pq-\sum_xq\log\frac pq=\sum_x(p-q)\log\frac pq$.
**2.** (i) 깁스 부등식으로 두 KL이 모두 $\ge0$. (ii) ($\Leftarrow$) $p=q$면 두 KL이 0. ($\Rightarrow$) 음이 아닌 두 수의 합이 0이면 각각 0이고, $D_{KL}(p\Vert q)=0$의 등호 조건에서 $p=q$. (iii) 정의가 두 KL의 합이라 순서를 바꿔도 같습니다.
**3.** $\log$가 증가함수이므로 $p(x)\gt q(x)$이면 $p-q\gt0$, $\log\frac pq\gt0$; $p(x)\lt q(x)$이면 둘 다 음수; 같으면 0. 어느 경우든 각 항 $(p-q)\log\frac pq\ge0$이고, 0인 것은 $p(x)=q(x)$일 때뿐입니다. 따라서 $J\ge0$이고, $J=0$이면 모든 항이 0이라 모든 $x$에서 $p(x)=q(x)$.
**4.** $D_{KL}(p\Vert q)=1\cdot\log\frac1{1/2}=\log2$이지만 $D_{KL}(q\Vert p)$에는 $\frac12\log\frac{1/2}0=\infty$가 있어 $J=\infty$. 반면 $m=(\frac34,\frac14)$로
$$D_{JS}=\tfrac12\log\tfrac43+\tfrac12\cdot\tfrac12\Big(\log\tfrac23+\log2\Big)=\tfrac34\log\tfrac43\approx0.2158\ (\le\log2).$$
JS는 평균 분포 $m$과 비교해 분모가 0이 되지 않으므로 받침이 달라도 유한합니다(Problem Set 1 문제 1의 준비 2).`,
      rubric: R`
- 식 변형 — 2점
- 세 성질(등호 조건 인용) — 3점
- 항별 부호 논증 — 3점
- 받침이 다른 예와 JS 값 — 2점` },
    { sec: '3.6', type: 'open', lv: 3, proof: true, quiz: 'ps1-p1', q: R`$\pi\in(0,1)$에 대해 $m_\pi=\pi p+(1-\pi)q$, $D_\pi(p,q)=\pi D_{KL}(p\Vert m_\pi)+(1-\pi)D_{KL}(q\Vert m_\pi)$로 정의한다($\pi=\frac12$이면 JS 발산).
1. $m_\pi$가 확률분포이고 $D_\pi$가 유한함을 보이시오.
2. $D_\pi\ge0$이고 $D_\pi(p,q)=0\iff p=q$임을 증명하시오.
3. $D_\pi(p,q)=D_{1-\pi}(q,p)$를 보이고, $\pi\ne\frac12$이면 일반적으로 $D_\pi(p,q)\ne D_\pi(q,p)$임을 $p=(1,0)$, $q=(\frac12,\frac12)$, $\pi=\frac14$로 보이시오.
4. $D_\pi(p,q)\le h(\pi):=-\pi\log\pi-(1-\pi)\log(1-\pi)$를 증명하시오.`,
      sol: R`
**1.** $m_\pi\ge0$이고 $\sum_xm_\pi=\pi+(1-\pi)=1$. $p(x)\gt0$이면 $m_\pi(x)\ge\pi p(x)\gt0$이라 $\frac{p(x)}{m_\pi(x)}\le\frac1\pi$, 따라서 $D_{KL}(p\Vert m_\pi)\le\log\frac1\pi\lt\infty$. 같은 방법으로 $D_{KL}(q\Vert m_\pi)\le\log\frac1{1-\pi}$.
**2.** 두 KL이 $\ge0$이고 가중치가 양수라 $D_\pi\ge0$. $D_\pi=0$이면 양의 가중치를 곱한 음이 아닌 두 항이 모두 0이라 $p=m_\pi$, $q=m_\pi$ (깁스 부등식의 등호 조건), 따라서 $p=q$. 역으로 $p=q$면 $m_\pi=p$라 0.
**3.** $D_{1-\pi}(q,p)$의 평균 분포는 $(1-\pi)q+\pi p=m_\pi$로 같고, 두 항 $(1-\pi)D_{KL}(q\Vert m_\pi)+\pi D_{KL}(p\Vert m_\pi)$도 같습니다.
예: $m=\frac14p+\frac34q=(\frac58,\frac38)$이면 $D_{1/4}(p,q)=\frac14\log\frac85+\frac34\cdot\frac12\log\frac{16}{15}\approx0.1417$. 반대로 $m'=\frac14q+\frac34p=(\frac78,\frac18)$이면 $D_{1/4}(q,p)=\frac14\cdot\frac12\log\frac{16}7+\frac34\log\frac87\approx0.2035$. 다릅니다.
**4.** 1의 두 부등식을 가중합하면
$$D_\pi\le\pi\log\frac1\pi+(1-\pi)\log\frac1{1-\pi}=h(\pi).$$
$\pi=\frac12$이면 $h=\log2$ — JS 발산의 상계입니다.`,
      rubric: R`
- 확률분포와 유한성($m_\pi\ge\pi p$) — 2점
- 비음성과 동일성(두 방향) — 3점
- 대칭 관계와 반례 계산 — 2점
- 상계 — 3점` },
    { sec: '3.3', type: 'open', lv: 3, proof: true, quiz: 'ps1-p1', q: R`정규분포 사이의 KL 발산.
1. $D_{KL}\big(\N(\mu_1,\sigma^2)\,\Vert\,\N(\mu_2,\sigma^2)\big)=\dfrac{(\mu_1-\mu_2)^2}{2\sigma^2}$를 유도하시오.
2. 1의 경우 KL이 대칭임을 확인하시오.
3. $D_{KL}\big(\N(0,1)\,\Vert\,\N(0,s^2)\big)=\frac12\Big(\frac1{s^2}-1+\log s^2\Big)$를 유도하고, $\log t\le t-1$ (등호 $\iff t=1$)을 써서 이것이 $\ge0$이며 $s^2=1$일 때만 0임을 보이시오.
4. $s^2=4$일 때 3의 값과 반대 방향 $D_{KL}\big(\N(0,4)\Vert\N(0,1)\big)$을 계산해 KL이 일반적으로 대칭이 아님을 보이시오.`,
      sol: R`
**1.** 정규화 상수가 같아 약분되므로
$$\log\frac{p(x)}{q(x)}=\frac{(x-\mu_2)^2-(x-\mu_1)^2}{2\sigma^2}=\frac{(\mu_1-\mu_2)(2x-\mu_1-\mu_2)}{2\sigma^2}.$$
$x\sim p$에서 $\E x=\mu_1$이므로 기댓값은 $\frac{(\mu_1-\mu_2)(\mu_1-\mu_2)}{2\sigma^2}$.
**2.** $(\mu_1-\mu_2)^2=(\mu_2-\mu_1)^2$이라 방향을 바꿔도 같습니다(분산이 같을 때만의 특수한 성질).
**3.** $\log p-\log q=-\frac{x^2}2+\frac{x^2}{2s^2}+\frac12\log s^2$ ($\log\sqrt{2\pi}$는 약분). $\E_px^2=1$이므로 $D_{KL}=\frac12\big(\frac1{s^2}-1+\log s^2\big)$. $t=1/s^2$로 두면 $\frac12(t-1-\log t)\ge0$이고 등호는 $t=1$, 즉 $s^2=1$일 때뿐.
**4.** $s^2=4$: $\frac12(\frac14-1+\log4)\approx0.3181$. 반대 방향은 같은 계산으로 $\frac12(4-1+\log\frac14)\approx0.8069$. 서로 다르므로 KL은 대칭이 아닙니다.`,
      rubric: R`
- 평균만 다른 경우의 유도 — 4점
- 대칭 확인 — 1점
- 분산만 다른 경우의 유도와 비음성·등호 — 3점
- 두 방향 수치 비교 — 2점` },
    { sec: '3.4', type: 'open', lv: 3, proof: true, quiz: 'ps1-p1', q: R`이산 확률변수 $X,Y$의 결합분포 $p(x,y)$와 주변분포 $p(x),p(y)$.
1. $I(X;Y)=H(X)-H(X\mid Y)$가 $D_{KL}\big(p(x,y)\,\Vert\,p(x)p(y)\big)$와 같음을 보이시오.
2. $I(X;Y)\ge0$이고 등호가 $X,Y$가 독립일 때뿐임을 보이고, 이로부터 $H(X\mid Y)\le H(X)$를 결론지으시오.
3. $p(0,0)=\frac12$, $p(0,1)=\frac14$, $p(1,0)=0$, $p(1,1)=\frac14$일 때 $I(X;Y)$를 비트로 구하시오.`,
      sol: R`
**1.** 합은 $p(x,y)\gt0$인 칸에서만 취합니다(그런 칸에서는 $p(x)p(y)\gt0$). $p(x)=\sum_yp(x,y)$를 쓰면
$$H(X)-H(X\mid Y)=-\sum_{x,y}p(x,y)\log p(x)+\sum_{x,y}p(x,y)\log p(x\mid y)=\sum_{x,y}p(x,y)\log\frac{p(x,y)}{p(x)p(y)},$$
($p(x\mid y)=p(x,y)/p(y)$) — 결합분포에서 곱분포로의 KL입니다.
**2.** 깁스 부등식으로 $\ge0$, 등호는 두 분포가 같을 때, 즉 모든 $(x,y)$에서 $p(x,y)=p(x)p(y)$ (독립)일 때뿐. 따라서 $H(X\mid Y)=H(X)-I(X;Y)\le H(X)$: 조건을 알면 불확실성은 줄거나 같습니다.
**3.** $p_X=(\frac34,\frac14)$, $p_Y=(\frac12,\frac12)$.
$$I=\tfrac12\log_2\tfrac{1/2}{3/8}+\tfrac14\log_2\tfrac{1/4}{3/8}+\tfrac14\log_2\tfrac{1/4}{1/8}\approx0.2075-0.1462+0.25=0.3113\text{ 비트}.$$
검산: $H(Y)=1$, $H(Y\mid X)=\frac34h_2(\frac23)\approx0.6887$이라 $I=1-0.6887=0.3113$.`,
      rubric: R`
- KL 꼴로의 변형(합의 범위 주의) — 4점
- 비음성·등호·조건부 엔트로피 결론 — 3점
- 수치 계산 — 3점` },
  ] });

  EM.more.push({ n: 4, problems: [
    { sec: '4.3', type: 'open', lv: 3, proof: true, quiz: 'ps1-p2', q: R`라플라스분포 $p(u)=\frac1{2b}e^{-\lvert u\rvert/b}$ ($b\gt0$)가 만드는 $L_1$.
1. $y_i=x_i^T\beta+\varepsilon_i$에서 $\varepsilon_i$가 독립이고 위 라플라스분포를 따르면 $\beta$의 MLE가 $\sum_i\lvert y_i-x_i^T\beta\rvert$의 최소점임을 보이시오.
2. 잡음은 $\N(0,\sigma^2)$이고 사전분포가 성분마다 독립인 라플라스 $p(\beta_j)=\frac1{2b}e^{-\lvert\beta_j\rvert/b}$이면 MAP이 라쏘 $\argmin_\beta\lVert y-X\beta\rVert^2+\lambda\lVert\beta\rVert_1$의 해임을 보이고 $\lambda$를 구하시오.
3. 절편만 있는 모델($x_i=1$)에서 1의 MLE가 표본 중앙값임을 자료 $y=(1,2,10)$으로 보이고, 가우시안 잡음의 MLE(표본평균)와 비교해 이상치의 영향을 설명하시오.`,
      sol: R`
**1.** 독립이므로 로그가능도는 $\sum_i\big[-\log(2b)-\lvert y_i-x_i^T\beta\rvert/b\big]$. 첫 항과 양수 $1/b$은 최소점을 바꾸지 않으므로 $\hat\beta_{\text{MLE}}=\argmin\sum_i\lvert y_i-x_i^T\beta\rvert$.
**2.** $\log p(\beta\mid y)=-\frac1{2\sigma^2}\lVert y-X\beta\rVert^2-\frac1b\sum_j\lvert\beta_j\rvert+C$. 양수 $2\sigma^2$을 곱하고 부호를 바꾸면
$$\hat\beta_{\text{MAP}}=\argmin_\beta\ \lVert y-X\beta\rVert^2+\frac{2\sigma^2}b\lVert\beta\rVert_1,\qquad\lambda=\frac{2\sigma^2}b.$$
사전분포가 좁을수록($b$ 작음) 규제가 셉니다.
**3.** $g(\beta)=\lvert1-\beta\rvert+\lvert2-\beta\rvert+\lvert10-\beta\rvert$는 조각별 선형이고 기울기는 ($\beta$보다 작은 점의 수) $-$ (큰 점의 수): $\beta\lt1$에서 $-3$, $1\lt\beta\lt2$에서 $-1$, $2\lt\beta\lt10$에서 $+1$, $\beta\gt10$에서 $+3$. 기울기가 음에서 양으로 바뀌는 $\beta=2$ (중앙값)가 최소점, $g(2)=9$. 표본평균은 $13/3\approx4.33$으로 이상치 10에 끌려가지만 중앙값은 10이 100이 되어도 그대로입니다 — $L_1$ 손실은 이상치에 강합니다.`,
      rubric: R`
- 라플라스 가능도 → $L_1$ 손실 — 3점
- MAP = 라쏘와 $\lambda$ — 4점
- 중앙값 논증과 이상치 비교 — 3점` },
    { sec: '4.3', type: 'open', lv: 3, proof: true, quiz: 'ps1-p2', q: R`$y=X\beta+\varepsilon$, $\varepsilon\sim\N(0,\sigma^2I_n)$, $X^TX=I_p$ (열이 정규직교)이다.
1. 릿지 해 $\hat\beta_\lambda=\argmin_\beta\lVert y-X\beta\rVert^2+\lambda\lVert\beta\rVert^2$가 $\hat\beta_\lambda=\frac1{1+\lambda}X^Ty=\frac1{1+\lambda}\hat\beta_{\text{OLS}}$임을 보이시오.
2. $\hat\beta_{\text{OLS}}=X^Ty\sim\N(\beta,\sigma^2I_p)$임을 보이고, 릿지의 성분 $j$마다 편향, 분산, MSE를 구하시오.
3. $\lambda\gt0$일 때 $\mathrm{MSE}(\hat\beta_{\lambda,j})\lt\mathrm{MSE}(\hat\beta_{\text{OLS},j})\iff\beta_j^2\lt\sigma^2\big(1+\frac2\lambda\big)$임을 보이고, Problem Set 1 문제 2의 조건 $\theta^2\lt2\tau^2+\frac1n$과 어떻게 대응하는지 설명하시오.`,
      sol: R`
**1.** 기울기 $-2X^T(y-X\beta)+2\lambda\beta=0$에서 $(X^TX+\lambda I)\beta=X^Ty$, 즉 $(1+\lambda)\beta=X^Ty$. 헤시안 $2(1+\lambda)I\succ0$이라 최소점.
**2.** $X^Ty=X^TX\beta+X^T\varepsilon=\beta+X^T\varepsilon$. $X^T\varepsilon$은 가우시안의 선형변환이라 가우시안이고 평균 0, 공분산 $X^T(\sigma^2I)X=\sigma^2I$. 따라서 $\hat\beta_{\text{OLS}}\sim\N(\beta,\sigma^2I)$. 릿지의 성분 $j$:
$$\text{편향}=\frac{\beta_j}{1+\lambda}-\beta_j=-\frac{\lambda\beta_j}{1+\lambda},\quad\text{분산}=\frac{\sigma^2}{(1+\lambda)^2},\quad\mathrm{MSE}=\frac{\lambda^2\beta_j^2+\sigma^2}{(1+\lambda)^2}.$$
**3.** OLS의 MSE는 $\sigma^2$ (편향 0). $\lambda^2\beta_j^2+\sigma^2\lt\sigma^2(1+\lambda)^2\iff\lambda^2\beta_j^2\lt2\lambda\sigma^2+\lambda^2\sigma^2\iff\beta_j^2\lt\sigma^2(1+\frac2\lambda)$ (마지막은 양수 $\lambda^2$로 나눔).
대응: PS1에서 $\bar X\sim\N(\theta,\frac1n)$이고 $\hat\theta=\frac1{1+1/(n\tau^2)}\bar X$. 여기서 $\sigma^2\leftrightarrow\frac1n$, $\lambda\leftrightarrow\frac1{n\tau^2}$로 바꾸면 $\sigma^2(1+\frac2\lambda)=\frac1n+2\tau^2$ — 같은 조건입니다. 릿지는 각 좌표마다 PS1의 수축을 하는 셈입니다.`,
      rubric: R`
- 릿지 해 — 2점
- OLS 분포(평균·공분산) — 2점, 편향·분산·MSE — 2점
- 필요충분조건 — 2점, PS1과의 대응 — 2점` },
  ] });

  EM.more.push({ n: 5, problems: [
    { sec: '5.5', type: 'open', lv: 3, proof: true, quiz: 'ps1-p2', q: R`로지스틱 회귀 $P(y_i=1\mid x_i,w)=\sigma(w^Tx_i)$ ($y_i\in\{0,1\}$, 표본은 독립)에 사전분포 $w\sim\N(0,\tau^2I)$를 둔다.
1. MAP 추정이 $\argmin_w\ F(w)$, $F(w)=J(w)+\frac1{2\tau^2}\lVert w\rVert^2$, $J(w)=-\sum_i\big[y_i\log\sigma(w^Tx_i)+(1-y_i)\log(1-\sigma(w^Tx_i))\big]$임을 보이시오.
2. $\sigma'=\sigma(1-\sigma)$를 써서 $\nabla F$와 헤시안 $\nabla^2F$를 구하시오.
3. $\nabla^2F\succeq\frac1{\tau^2}I$를 보이고, 최소점이 존재하고 유일함을 설명하시오. 자료가 선형 분리 가능할 때 MLE와 MAP은 어떻게 다른가?`,
      sol: R`
**1.** 사후분포 $\propto\prod_i\sigma(w^Tx_i)^{y_i}(1-\sigma(w^Tx_i))^{1-y_i}\cdot\exp\big(-\frac{\lVert w\rVert^2}{2\tau^2}\big)$ (정규화 상수는 $w$와 무관). 음의 로그를 취하면 $F(w)+C$이고, $\log$가 증가함수라 사후분포의 최대점 = $F$의 최소점.
**2.** 표본 하나에서 $p=\sigma(z)$, $z=w^Tx$이면 $\frac{\partial l}{\partial z}=-\big[y(1-p)-(1-y)p\big]=p-y$. 따라서
$$\nabla F=\sum_i(p_i-y_i)x_i+\frac w{\tau^2}=X^T(p-y)+\frac w{\tau^2},$$
$$\nabla^2F=\sum_ip_i(1-p_i)x_ix_i^T+\frac1{\tau^2}I=X^TSX+\frac1{\tau^2}I,\quad S=\diag\big(p_i(1-p_i)\big).$$
**3.** $v^TX^TSXv=\sum_ip_i(1-p_i)(x_i^Tv)^2\ge0$이므로 $\nabla^2F\succeq\frac1{\tau^2}I\succ0$ — $F$는 강볼록이라 최소점은 많아야 하나. $J\ge0$이라 $F(w)\ge\frac{\lVert w\rVert^2}{2\tau^2}\to\infty$ ($\lVert w\rVert\to\infty$)이고 $F$가 연속이므로 최소점이 존재합니다. 분리 가능한 자료에서는 분리 방향으로 $w$를 키우면 $J\to0$이라 MLE가 존재하지 않지만(가중치 발산), MAP은 벌점 $\frac{\lVert w\rVert^2}{2\tau^2}$이 커져서 유한한 해에 멈춥니다.`,
      rubric: R`
- MAP → 음의 로그가능도 + $L_2$ 벌점 — 3점
- 기울기와 헤시안 — 4점
- 강볼록성, 존재·유일성, 분리 가능한 경우의 차이 — 3점` },
  ] });

  EM.more.push({ n: 6, problems: [
    { sec: '6.4', type: 'open', lv: 3, proof: true, quiz: true, q: R`소프트맥스 회귀 $p_{ik}=\softmax(Wx_i)_k$ ($W$의 $k$번째 행을 $w_k^T$), 손실 $J(W)=-\sum_i\sum_ky_{ik}\log p_{ik}$ ($y_i$는 원-핫).
1. 모든 행에 같은 벡터 $c$를 더해도($w_k\to w_k+c$) 확률이 변하지 않음을 보이시오. 이로부터 $J$의 최소점이 (있다면) 유일하지 않음을 결론지으시오.
2. $\nabla_{w_k}J=\sum_i(p_{ik}-y_{ik})x_i$를 이용해 $\sum_k\nabla_{w_k}J=0$임을 보이시오.
3. $J_\lambda(W)=J(W)+\frac\lambda2\sum_k\lVert w_k\rVert^2$ ($\lambda\gt0$)의 모든 정류점에서 $\sum_kw_k=0$임을 보이시오. 규제가 1의 자유도를 어떻게 없애는지 설명하시오.`,
      sol: R`
**1.** 로짓이 $z_k=w_k^Tx\to z_k+c^Tx$로 모두 같은 수 $s=c^Tx$만큼 움직이므로
$$\frac{e^{z_k+s}}{\sum_je^{z_j+s}}=\frac{e^se^{z_k}}{e^s\sum_je^{z_j}}=\frac{e^{z_k}}{\sum_je^{z_j}}.$$
따라서 $J(W+\mathbf 1c^T)=J(W)$이고, $W^*$가 최소점이면 모든 $c$에 대해 $W^*+\mathbf 1c^T$도 최소점입니다.
**2.** 각 $i$에서 $\sum_k(p_{ik}-y_{ik})=1-1=0$이므로 $\sum_k\nabla_{w_k}J=\sum_i\Big[\sum_k(p_{ik}-y_{ik})\Big]x_i=0$.
**3.** 정류점에서 모든 $k$에 대해 $\nabla_{w_k}J_\lambda=\nabla_{w_k}J+\lambda w_k=0$. $k$에 대해 더하면 2에서 $0+\lambda\sum_kw_k=0$, $\lambda\gt0$이라 $\sum_kw_k=0$. $W+\mathbf 1c^T$ 가운데 벌점 $\sum_k\lVert w_k+c\rVert^2$을 최소로 하는 $c=-\frac1C\sum_kw_k$ 하나만 남아(행의 합이 0), 1의 모호함이 사라집니다.`,
      rubric: R`
- 불변성과 비유일성 — 3점
- 기울기 합이 0 — 3점
- 규제된 정류점의 조건과 해석 — 4점` },
  ] });

  EM.more.push({ n: 7, problems: [
    { sec: '7.6', type: 'open', lv: 3, proof: true, quiz: 'ps1-p3', q: R`Problem Set 1 문제 3을 일반화한다. 서로 다른 두 점 $x_-$ ($y=-1$), $x_+$ ($y=+1$)에 하드 마진 SVM을 쓰고 $d=x_+-x_-$라 하자.
1. 라그랑지안에서 $w,b$를 소거해 쌍대 문제를 유도하고, 최적 승수가 $\alpha_+=\alpha_-=\dfrac2{\lVert d\rVert^2}$임을 보이시오.
2. $w^*=\dfrac{2d}{\lVert d\rVert^2}$, $b^*=-\dfrac12(w^*)^T(x_++x_-)$을 보이시오.
3. 마진 $1/\lVert w^*\rVert=\lVert d\rVert/2$와, 분리 초평면이 두 점의 수직이등분선임을 보이시오. 강한 쌍대성도 확인하시오.
4. $x_-=(0,0)$, $x_+=(2,2)$를 넣어 Problem Set 1의 답과 맞는지 확인하시오.`,
      sol: R`
**1.** $L=\frac12\lVert w\rVert^2+\alpha_-\big(1+w^Tx_-+b\big)+\alpha_+\big(1-w^Tx_+-b\big)$, $\alpha_\pm\ge0$. 정류 조건: $\nabla_wL=0\Rightarrow w=\alpha_+x_+-\alpha_-x_-$, $\partial_bL=\alpha_--\alpha_+=0$. $\alpha_+=\alpha_-=\alpha$이면 $w=\alpha d$이고
$$g(\alpha)=2\alpha-\frac12\alpha^2\lVert d\rVert^2\quad(\alpha\ge0).$$
$g'(\alpha)=2-\alpha\lVert d\rVert^2=0\Rightarrow\alpha=\frac2{\lVert d\rVert^2}\ (\gt0)$, $g''=-\lVert d\rVert^2\lt0$이라 최대.
**2.** $w^*=\alpha d=\frac{2d}{\lVert d\rVert^2}$. 두 점 모두 $\alpha\gt0$이라 상보성에서 $w^Tx_++b=1$, $w^Tx_-+b=-1$. 더하면 $b^*=-\frac12(w^*)^T(x_++x_-)$. (빼면 $w^Td=2$ — 실제로 $\frac{2\lVert d\rVert^2}{\lVert d\rVert^2}=2$로 맞습니다.)
**3.** $\lVert w^*\rVert=\frac2{\lVert d\rVert}$이라 마진 $\frac{\lVert d\rVert}2$ (두 점 거리의 절반). 중점 $c=\frac{x_++x_-}2$에서 $(w^*)^Tc+b^*=0$이라 초평면이 중점을 지나고, 법선 $w^*$가 $d$와 평행이라 수직이등분선입니다. 원문제 값 $\frac12\lVert w^*\rVert^2=\frac2{\lVert d\rVert^2}=g(\alpha^*)$.
**4.** $d=(2,2)$, $\lVert d\rVert^2=8$: $\alpha=\frac14$, $w^*=(\frac12,\frac12)$, $b^*=-\frac12\cdot\frac12(2+2)=-1$, 마진 $\sqrt2$ — Problem Set 1의 답과 같습니다.`,
      rubric: R`
- 라그랑지안과 두 정류 조건 — 2점, 쌍대 함수와 최적 승수(최대 확인) — 2점
- $w^*$, $b^*$ (상보성 사용 명시) — 3점
- 마진, 수직이등분선, 강한 쌍대성 — 2점
- 대입 확인 — 1점` },
    { sec: '7.5', type: 'open', lv: 3, proof: true, quiz: 'ps1-p3', q: R`자료 $x_1=(0,0)$, $y_1=-1$; $x_2=(2,2)$, $y_2=+1$; $x_3=(4,1)$, $y_3=+1$에 하드 마진 SVM을 쓴다.
1. 이 문제의 KKT 조건(원 실현가능성, 쌍대 실현가능성, 정류 조건 두 개, 상보성)을 모두 쓰시오.
2. 후보 $w=(\frac12,\frac12)$, $b=-1$, $\alpha=(\frac14,\frac14,0)$이 KKT 조건을 모두 만족함을 확인하시오.
3. KKT 조건을 만족하는 점이 최적임을 직접 증명하시오: 임의의 실현가능한 $(w',b')$에 대해 $\frac12\lVert w'\rVert^2\ge\frac12\lVert w\rVert^2$. (힌트: $\frac12\lVert w'\rVert^2\ge\frac12\lVert w\rVert^2+w^T(w'-w)$)
4. $x_3$을 자료에서 빼도 해가 바뀌지 않는 이유를 설명하시오.`,
      sol: R`
**1.** 원 실현가능성 $y_i(w^Tx_i+b)\ge1$; 쌍대 실현가능성 $\alpha_i\ge0$; 정류 $w=\sum_i\alpha_iy_ix_i$, $\sum_i\alpha_iy_i=0$; 상보성 $\alpha_i\big[y_i(w^Tx_i+b)-1\big]=0$ ($i=1,2,3$).
**2.** 마진값: $x_1$: $-(0-1)=1$, $x_2$: $1+1-1=1$, $x_3$: $2+\frac12-1=\frac32\ge1$ — 실현가능. $\alpha\ge0$. $\sum\alpha_iy_i=-\frac14+\frac14+0=0$, $\sum\alpha_iy_ix_i=\frac14(2,2)=(\frac12,\frac12)=w$. 상보성: $x_1,x_2$는 마진값 1이라 성립, $x_3$은 마진값 $\frac32$이지만 $\alpha_3=0$이라 성립.
**3.** $\frac12\lVert\cdot\rVert^2$은 볼록이라 $\frac12\lVert w'\rVert^2\ge\frac12\lVert w\rVert^2+w^T(w'-w)$ (전개하면 $\frac12\lVert w'-w\rVert^2\ge0$). 정류 조건과 $\sum\alpha_iy_i=0$ (그래서 $b'-b$ 항을 더해도 됨)으로
$$w^T(w'-w)=\sum_i\alpha_iy_i\big[(w'^Tx_i+b')-(w^Tx_i+b)\big]=\sum_i\alpha_i\big[y_i(w'^Tx_i+b')-1\big]-\sum_i\alpha_i\big[y_i(w^Tx_i+b)-1\big].$$
첫 합은 $\alpha_i\ge0$과 $(w',b')$의 실현가능성으로 $\ge0$, 둘째 합은 상보성으로 0. 따라서 $\frac12\lVert w'\rVert^2\ge\frac12\lVert w\rVert^2$. $\blacksquare$
**4.** $\alpha_3=0$이라 정류 조건에 $x_3$이 기여하지 않습니다. $x_3$을 빼도 같은 $(w,b,\alpha_1,\alpha_2)$가 두 점 문제의 KKT 조건을 만족하므로 3에 의해 여전히 최적입니다. 해는 서포트 벡터($\alpha_i\gt0$)로만 정해집니다.`,
      rubric: R`
- KKT 조건 다섯 가지 — 2점
- 후보 확인(특히 $x_3$의 상보성) — 3점
- 충분성 증명(볼록 부등식, $\sum\alpha_iy_i=0$ 사용, 두 합의 부호) — 3점
- 서포트 벡터 해석 — 2점` },
    { sec: '7.4', type: 'open', lv: 2, proof: true, quiz: 'ps1-p3', q: R`$\min_{x\in\mathbb R^2}\ x_1^2+x_2^2$ s.t. $x_1+x_2\ge2$.
1. 라그랑지안을 쓰고 쌍대 함수 $g(\alpha)$ ($\alpha\ge0$)를 구하시오.
2. 쌍대 문제를 풀어 $\alpha^*$와 쌍대 값 $d^*$을 구하시오.
3. 원문제의 해 $x^*$를 복원하고 $p^*=d^*$ (강한 쌍대성)와 상보성을 확인하시오.
4. 제약을 $x_1+x_2\ge-2$로 바꾸면 $\alpha^*$, $x^*$가 어떻게 되는지 쌍대 문제로 구하고, 상보성으로 설명하시오.`,
      sol: R`
**1.** 제약을 $2-x_1-x_2\le0$으로 쓰고 $L=x_1^2+x_2^2+\alpha(2-x_1-x_2)$. $x$에 대해 볼록 이차식이라 정류점 $2x_i-\alpha=0$, $x_i=\frac\alpha2$가 최소점. 대입하면
$$g(\alpha)=\frac{\alpha^2}2+\alpha(2-\alpha)=2\alpha-\frac{\alpha^2}2.$$
**2.** $g'(\alpha)=2-\alpha=0\Rightarrow\alpha^*=2\ (\ge0)$, $g''=-1\lt0$. $d^*=4-2=2$.
**3.** $x^*=(\frac{\alpha^*}2,\frac{\alpha^*}2)=(1,1)$, $p^*=1+1=2=d^*$. 제약이 등호로 성립($1+1=2$)하고 $\alpha^*\gt0$ — 상보성 $\alpha^*(2-x_1-x_2)=0$ 성립.
**4.** $L=x_1^2+x_2^2+\alpha(-2-x_1-x_2)$, 같은 계산으로 $g(\alpha)=-2\alpha-\frac{\alpha^2}2$. $\alpha\ge0$에서 $g'=-2-\alpha\lt0$이라 최대는 $\alpha^*=0$, $d^*=0$. $x^*=(0,0)$, $p^*=0$. 제약 없는 최소점 $(0,0)$이 이미 $0\ge-2$를 만족해 제약이 느슨하므로 상보성에 따라 승수가 0입니다.`,
      rubric: R`
- 부호를 맞춘 라그랑지안과 쌍대 함수 — 3점
- 쌍대 문제 풀이 — 2점
- 원 해 복원, 강한 쌍대성, 상보성 — 3점
- 느슨한 제약의 경우 — 2점` },
    { sec: '7.7', type: 'open', lv: 3, proof: true, quiz: 'ps1-p4', q: R`최대-최소 부등식 $\max_x\min_yf\le\min_y\max_xf$ ($x$가 최대화, $y$가 최소화)의 등호 여부.
1. $X=Y=[0,1]$, $f(x,y)=(x-y)^2$에서 $\max_x\min_yf$와 $\min_y\max_xf$를 구하시오.
2. $X=Y=[-1,1]$, $f(x,y)=xy$에서 두 값을 구하고 안장점을 찾으시오.
3. 안장점 $(x^*,y^*)$ — 모든 $x,y$에서 $f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$ — 이 있으면 등호가 성립함을 보이고, 1의 $f$에는 안장점이 없음을 증명하시오.`,
      sol: R`
**1.** $x$를 고정하면 $\min_y(x-y)^2=0$ ($y=x$)이므로 $\max_x\min_yf=0$. $y$를 고정하면 $x\mapsto(x-y)^2$이 볼록이라 최대는 끝점에서: $\max_xf=\max\{y^2,(1-y)^2\}$. 이것을 $y$에 대해 최소화하면 $y=\frac12$에서 $\frac14$. $0\lt\frac14$ — 등호가 아닙니다.
**2.** $\min_yxy=-\lvert x\rvert$ ($y=-\operatorname{sign}x$), $\max_x(-\lvert x\rvert)=0$. $\max_xxy=\lvert y\rvert$, $\min_y\lvert y\rvert=0$. 두 값이 0으로 같고, $(0,0)$에서 $f(x,0)=0\le0\le f(0,y)=0$이라 안장점입니다.
**3.** 안장점이 있으면 $\min_y\max_xf\le\max_xf(x,y^*)=f(x^*,y^*)=\min_yf(x^*,y)\le\max_x\min_yf$. 반대 부등식은 최대-최소 부등식이므로 등호.
1에서 안장점 $(x^*,y^*)$가 있다고 하자. 오른쪽 부등식에서 $f(x^*,y^*)=\min_yf(x^*,y)=0$, 즉 $y^*=x^*$. 왼쪽 부등식에서 모든 $x\in[0,1]$에 대해 $(x-x^*)^2\le0$이어야 하는데 $x\ne x^*$를 고르면 모순. 따라서 안장점이 없고, 이것이 1에서 등호가 깨진 이유입니다.`,
      rubric: R`
- 1의 두 값(끝점 최대 논증 포함) — 3점
- 2의 두 값과 안장점 확인 — 3점
- 안장점 ⇒ 등호 — 2점, 1에 안장점이 없음 — 2점` },
    { sec: '7.7', type: 'open', lv: 3, proof: true, quiz: 'ps1-p4', q: R`원문제 $p^*=\inf_xf(x)$ s.t. $g_i(x)\le0$ ($i=1,\dots,m$), 라그랑지안 $L(x,\alpha)=f(x)+\sum_i\alpha_ig_i(x)$, 쌍대 함수 $d(\alpha)=\inf_xL(x,\alpha)$.
1. $\sup_{\alpha\ge0}L(x,\alpha)$가 $x$가 실현가능하면 $f(x)$, 아니면 $+\infty$임을 보이고, $p^*=\inf_x\sup_{\alpha\ge0}L(x,\alpha)$를 결론지으시오.
2. 실현가능한 모든 $x$와 모든 $\alpha\ge0$에 대해 $d(\alpha)\le f(x)$를 보이고, 약한 쌍대성 $d^*=\sup_{\alpha\ge0}d(\alpha)\le p^*$를 결론지으시오.
3. 2가 Problem Set 1 문제 4의 최대-최소 부등식의 특별한 경우임을 설명하시오.
4. 원문제가 볼록이 아니어도 $d(\alpha)$는 항상 오목함수임을 보이시오.`,
      sol: R`
**1.** 실현가능하면 모든 $g_i(x)\le0$이라 $\alpha\ge0$에서 $\sum\alpha_ig_i(x)\le0$, 최대는 $\alpha=0$에서 $f(x)$. 실현불가능하면 어떤 $g_j(x)\gt0$이라 $\alpha_j\to\infty$로 $L\to\infty$. 따라서 $\inf_x\sup_\alpha L$은 실현가능한 $x$에서의 $\inf f=p^*$.
**2.** $d(\alpha)=\inf_{x'}L(x',\alpha)\le L(x,\alpha)=f(x)+\sum_i\alpha_ig_i(x)\le f(x)$. 이 부등식이 모든 $\alpha\ge0$과 모든 실현가능한 $x$에서 성립하므로, 왼쪽의 상한과 오른쪽의 하한을 취해 $d^*\le p^*$.
**3.** 최대화 변수 $\alpha\in\{\alpha\ge0\}$, 최소화 변수 $x$, 함수 $F(\alpha,x)=L(x,\alpha)$에 최대-최소 부등식을 쓰면 $\sup_\alpha\inf_xL\le\inf_x\sup_\alpha L$, 즉 $d^*\le p^*$ (1 사용). SVM에서 $d^*=p^*$ (강한 쌍대성)가 되는 것은 볼록성과 슬레이터 조건 덕분입니다.
**4.** $x$를 고정하면 $\alpha\mapsto L(x,\alpha)$는 아핀함수. $t\in[0,1]$에서
$$d(t\alpha+(1-t)\beta)=\inf_x\big[tL(x,\alpha)+(1-t)L(x,\beta)\big]\ge t\inf_xL(x,\alpha)+(1-t)\inf_xL(x,\beta).$$
아핀함수들의 하한(inf)은 오목합니다.`,
      rubric: R`
- 내부 sup의 두 경우 — 3점
- 약한 쌍대성(부등식의 순서 명시) — 3점
- 최대-최소 부등식과의 연결 — 2점
- 쌍대 함수의 오목성 — 2점` },
    { sec: '7.2', type: 'open', lv: 2, proof: true, quiz: true, q: R`초평면 $H=\{x:w^Tx+b=0\}$ ($w\ne0$)과 점 $x_0$.
1. $\min_x\frac12\lVert x-x_0\rVert^2$ s.t. $w^Tx+b=0$의 라그랑지안을 쓰고, 정류 조건으로 최근접점 $x^*=x_0-\dfrac{w^Tx_0+b}{\lVert w\rVert^2}w$를 구하시오.
2. 점과 초평면 사이의 거리가 $\dfrac{\lvert w^Tx_0+b\rvert}{\lVert w\rVert}$임을 보이시오.
3. SVM 제약 $y_i(w^Tx_i+b)\ge1$ ($y_i\in\{\pm1\}$)이 성립하면 모든 자료점과 초평면의 거리가 $\ge\frac1{\lVert w\rVert}$임을 보이시오. 등호가 되는 점은 무엇인가?
4. $w=(3,4)$, $b=-5$, $x_0=(2,1)$일 때 거리와 $x^*$를 구하시오.`,
      sol: R`
**1.** 등식 제약이라 승수 $\mu$의 부호는 자유: $L=\frac12\lVert x-x_0\rVert^2+\mu(w^Tx+b)$. $\nabla_xL=x-x_0+\mu w=0\Rightarrow x=x_0-\mu w$. 제약에 넣으면 $w^Tx_0-\mu\lVert w\rVert^2+b=0$, $\mu=\frac{w^Tx_0+b}{\lVert w\rVert^2}$. 목적함수가 강볼록이고 실현가능 집합이 아핀이라 이 정류점이 유일한 최소점입니다.
**2.** $\lVert x_0-x^*\rVert=\lvert\mu\rvert\lVert w\rVert=\frac{\lvert w^Tx_0+b\rvert}{\lVert w\rVert}$.
**3.** $y_i(w^Tx_i+b)\ge1\gt0$이고 $\lvert y_i\rvert=1$이라 $\lvert w^Tx_i+b\rvert=y_i(w^Tx_i+b)\ge1$. 2에서 거리 $\ge\frac1{\lVert w\rVert}$. 등호는 $y_i(w^Tx_i+b)=1$인 점, 즉 마진 경계 위의 점(서포트 벡터 후보)입니다.
**4.** $w^Tx_0+b=6+4-5=5$, $\lVert w\rVert=5$라 거리 1. $\mu=\frac5{25}=\frac15$, $x^*=(2,1)-\frac15(3,4)=(1.4,\ 0.2)$. 확인: $3(1.4)+4(0.2)-5=0$.`,
      rubric: R`
- 라그랑지안과 최근접점 — 4점
- 거리 공식 — 2점
- 마진 하한과 등호 — 2점
- 수치 — 2점` },
  ] });
})();
