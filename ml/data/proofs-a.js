/* 증명 — Part A: 01 ERM, 02 PAC, 03 균등수렴, 04 공짜 점심, 05 VC 차원, 06 비균등 학습
   src가 있는 항목은 김경수 교수님의 증명 노트를 따라간 것입니다. 노트에서 생략된 단계를 채우고, 바로잡을 곳은 note에 적었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 01
  { ch: 'ch01', id: 'misleading', title: '실패 사건은 오도 표본의 합집합에 들어 있다', keys: ['오도 표본 포함 관계'], src: '강의 노트 · Eq. (2.7)',
    tags: 'misleading sample realizability consistent learner 오도 표본 실현가능성 일관 학습기 나쁜 가설',
    stmt: R`실현가능하고 학습기 $A$가 $\cH$에 대해 일관이면, $\varepsilon\in(0,1)$에 대해 $\{S|_x:L_{\cD,f}(h_S)>\varepsilon\}\subseteq M=\bigcup_{h\in\cH_B}\{S|_x:L_S(h)=0\}$. 따라서 $\cD^m(L_{\cD,f}(h_S)>\varepsilon)\le\cD^m(M)$.`,
    body: R`
**1. 실현가능성 ⇒ 오차 0인 가설이 표본 위에 있음.** $L_{\cD,f}(h^\star)=0$인 $h^\star\in\cH$를 잡으면 $N=\{x:h^\star(x)\ne f(x)\}$는 $\cD(N)=0$. 표본점이 하나라도 $N$에 떨어질 확률은 합집합 상한으로 $\le m\cD(N)=0$이므로, 확률 1로 모든 $i$에서 $h^\star(x_i)=f(x_i)=y_i$, 즉 $L_S(h^\star)=0$.

**2. 일관성 ⇒ 학습기도 오차 0.** $L_S=0$인 가설이 $\cH$에 있는 표본에서 일관 학습기는 $L_S(A(S))=0$을 냅니다. 1과 합치면 확률 1로 $L_S(h_S)=0$.

**3. 포함 관계.** $S|_x$에서 $L_{\cD,f}(h_S)>\varepsilon$이면 $h_S\in\cH_B$이고(정의), 2에 의해 $L_S(h_S)=0$. 그러므로 $h=h_S$가 “$L_S(h)=0$인 나쁜 가설”의 증인이 되어 $S|_x\in M$. (1에서 제외한 확률 0의 표본은 확률 계산에 영향을 주지 않습니다.)

**4. 합집합 표현.** $S|_x\in M\iff\exists h\in\cH_B:\ L_S(h)=0\iff S|_x\in\bigcup_{h\in\cH_B}\{S|_x:L_S(h)=0\}$. 존재 양화사가 합집합으로 바뀐 것입니다.

**5.** 포함 관계의 양변에 확률 $\cD^m$을 취하면(단조성) 결론.`,
    note: R`2단계가 없으면 결론이 거짓일 수 있습니다: 표본을 무시하고 오차가 큰 가설을 내는 학습기는 실현가능한 문제에서도 실패하고, 그 실패는 오도 표본과 무관합니다. 교재는 ERM을 가정하므로 일관성이 자동으로 따라옵니다.` },
  { ch: 'ch01', id: 'finiteReal', title: '유한 가설 클래스의 표본 복잡도 (실현가능)', keys: ['유한 가설 클래스의 표본 복잡도'],
    tags: 'finite hypothesis class realizable sample complexity union bound corollary 2.3 유한 클래스 합집합 상한',
    stmt: R`$\cH$가 유한하고 실현가능하면, $m\ge\ln(\lvert\cH\rvert/\delta)/\varepsilon$일 때 확률 $1-\delta$ 이상으로 모든 ERM 가설이 $L_{\cD,f}(h_S)\le\varepsilon$을 만족한다.`,
    body: R`
**1. 포함 관계와 합집합 상한.** 앞의 증명에서 $\cD^m(L_{\cD,f}(h_S)>\varepsilon)\le\cD^m\big(\bigcup_{h\in\cH_B}\{L_S(h)=0\}\big)\le\sum_{h\in\cH_B}\cD^m(\{L_S(h)=0\})$.

**2. 나쁜 가설 하나.** $h\in\cH_B$를 고정. $L_S(h)=0$은 “모든 $i$에서 $h(x_i)=f(x_i)$”이고 $x_i$들이 독립이므로
$$\cD^m(\{L_S(h)=0\})=\prod_{i=1}^m\cD(\{x:h(x)=f(x)\})=\big(1-L_{\cD,f}(h)\big)^m\le(1-\varepsilon)^m.$$

**3. 지수로.** $g(t)=e^{-t}-(1-t)$는 $g(0)=0$, $g'(t)=1-e^{-t}$가 $t>0$에서 양, $t<0$에서 음이라 $t=0$에서 최소. 그래서 $1-t\le e^{-t}$(모든 $t$). $t=\varepsilon$에서 $(1-\varepsilon)^m\le e^{-\varepsilon m}$.

**4. 합치기.** $\cD^m(L_{\cD,f}(h_S)>\varepsilon)\le\lvert\cH_B\rvert e^{-\varepsilon m}\le\lvert\cH\rvert e^{-\varepsilon m}$.

**5. 표본 수.** $\lvert\cH\rvert e^{-\varepsilon m}\le\delta\iff-\varepsilon m\le\ln(\delta/\lvert\cH\rvert)\iff m\ge\ln(\lvert\cH\rvert/\delta)/\varepsilon$. 이 조건에서 실패 확률이 $\delta$ 이하입니다.`,
    note: R`$\lvert\cH_B\rvert\le\lvert\cH\rvert$로 버린 부분이 이 상한의 여유입니다. 나쁜 가설이 적거나, 나쁜 가설들이 같은 표본에서 함께 드러나면(사건이 크게 겹치면) 실제 실패 확률은 훨씬 작습니다. VC 이론은 이 겹침을 활용합니다.` },
  // ───── 02
  { ch: 'ch02', id: 'finitePAC', title: '유한 클래스는 PAC 학습가능하다', keys: ['유한 클래스는 PAC 학습가능'],
    tags: 'PAC learnable finite class corollary 3.2 표본 복잡도 올림',
    stmt: R`유한 클래스는 PAC 학습가능하고 $m_\cH(\varepsilon,\delta)\le\lceil\ln(\lvert\cH\rvert/\delta)/\varepsilon\rceil$.`,
    body: R`
학습기를 $\ERM_\cH$로 두고 $m_\cH(\varepsilon,\delta):=\lceil\ln(\lvert\cH\rvert/\delta)/\varepsilon\rceil$로 정의합니다(자연수여야 하므로 올림). 임의의 $\varepsilon,\delta\in(0,1)$와 실현가능한 $(\cD,f)$에 대해 $m\ge m_\cH(\varepsilon,\delta)$이면 $m\ge\ln(\lvert\cH\rvert/\delta)/\varepsilon$이고, 유한 가설 클래스의 표본 복잡도 정리에 의해 확률 $1-\delta$ 이상으로 $L_{\cD,f}(h_S)\le\varepsilon$. 이는 PAC 정의의 조건 그대로입니다. 표본 복잡도는 이 성질을 만족하는 최소 함수이므로 위의 함수 이하입니다.`,
    note: R`정의의 양화사를 확인하세요: 정한 $m_\cH$는 $\cD,f$를 쓰지 않았고, 모든 실현가능한 $(\cD,f)$에서 같은 보장을 줍니다.` },
  { ch: 'ch02', id: 'bayes01', title: '0–1 손실에서 베이즈 분류기의 최적성', keys: ['베이즈 최적 분류기'], src: '강의 노트 · Exercise 3.7',
    tags: 'Bayes optimal classifier 0-1 loss conditional probability tower property 베이즈 분류기 조건부 위험',
    stmt: R`$\eta(x)=\Prob(Y=1\mid X=x)$, $f_\cD(x)=\one[\eta(x)\ge\tfrac12]$이면 모든 가측 분류기 $g:\cX\to\{0,1\}$에 대해 $L_\cD(f_\cD)\le L_\cD(g)$이고, $L_\cD(f_\cD)=\E\big[\min\{\eta(X),1-\eta(X)\}\big]$.`,
    body: R`
**1. 조건부 오차로 쓰기.** 탑 성질 $\E[Z]=\E[\E[Z\mid X]]$를 $Z=\one\{g(X)\ne Y\}$에 쓰면
$$L_\cD(g)=\E\big[\Prob(g(X)\ne Y\mid X)\big].$$

**2. 점마다 계산.** $X=x$를 고정하면 $g(x)$는 상수입니다.
- $g(x)=1$: 틀리는 것은 $Y=0$일 때이므로 $\Prob(g(X)\ne Y\mid X=x)=1-\eta(x)$.
- $g(x)=0$: 틀리는 것은 $Y=1$일 때이므로 $\eta(x)$.

그러므로 $\Prob(g(X)\ne Y\mid X=x)\in\{\eta(x),1-\eta(x)\}$이고 $\ge\min\{\eta(x),1-\eta(x)\}$.

**3. 베이즈 분류기는 작은 쪽을 고른다.** $\eta(x)\ge\tfrac12$이면 $f_\cD(x)=1$로 오차 $1-\eta(x)=\min$; $\eta(x)<\tfrac12$이면 $f_\cD(x)=0$으로 오차 $\eta(x)=\min$. 즉
$$\Prob(f_\cD(X)\ne Y\mid X=x)=\min\{\eta(x),1-\eta(x)\}\le\Prob(g(X)\ne Y\mid X=x)\qquad(\forall x).$$

**4. 기댓값.** 점별 부등식에 $X$에 대한 기댓값을 취하면(기댓값의 단조성) $L_\cD(f_\cD)=\E[\min\{\eta,1-\eta\}]\le L_\cD(g)$.`,
    note: R`$\eta(x)=\tfrac12$인 점에서는 0과 1이 똑같이 좋으므로, 동점 처리가 달라도 베이즈 위험은 같습니다. 이 최적성은 $\cD$를 알 때의 이야기이고, $\cD$를 모르는 학습기가 베이즈 위험에 다가가려면 사전 지식이 필요하다는 것이 공짜 점심은 없다 정리입니다.` },
  { ch: 'ch02', id: 'bayesProb', title: '확률적 예측기도 결정적 베이즈 규칙을 이기지 못한다', keys: ['확률적 예측기의 베이즈 최적성'], src: '강의 노트 · Exercise 3.8',
    tags: 'probabilistic predictor randomized absolute loss Bayes 확률적 예측기 절대 손실 무작위',
    stmt: R`예측기 $h:\cX\to[0,1]$와 손실 $\ell(h,(x,y))=\lvert h(x)-y\rvert$에 대해 $L(f^\ast)\le L(h)$, 여기서 $f^\ast(x)=\one[\eta(x)\ge\tfrac12]$. 최소 위험은 $\E[\min\{\eta(X),1-\eta(X)\}]$.`,
    body: R`
**0. 손실의 해석.** 예측기가 확률 $h(x)$로 1을 낸다면, $y=1$일 때 틀릴 확률은 $1-h(x)=\lvert h(x)-1\rvert$, $y=0$일 때는 $h(x)=\lvert h(x)-0\rvert$. 따라서 $\lvert h(x)-y\rvert$는 무작위 출력이 $y$와 다를 확률입니다.

**1. 점별 조건부 위험.** $x$를 고정하고 $t\in[0,1]$에 대해 $\phi_x(t):=\E[\lvert t-Y\rvert\mid X=x]$. $Y\in\{0,1\}$이므로
$$\phi_x(t)=\lvert t-1\rvert\eta(x)+\lvert t\rvert(1-\eta(x))=(1-t)\eta(x)+t(1-\eta(x))=\eta(x)+t\big(1-2\eta(x)\big).$$
($t\in[0,1]$에서 $\lvert t-1\rvert=1-t$, $\lvert t\rvert=t$.)

**2. 일차함수의 최소.** 기울기 $1-2\eta(x)$의 부호로 나눕니다.
- $\eta(x)>\tfrac12$: 기울기 음수, 최소는 $t=1$.
- $\eta(x)<\tfrac12$: 기울기 양수, 최소는 $t=0$.
- $\eta(x)=\tfrac12$: 상수, 모든 $t$가 최소.

어느 경우든 $t=f^\ast(x)$가 최소점이고 $\phi_x(f^\ast(x))=\min\{\phi_x(0),\phi_x(1)\}=\min\{\eta(x),1-\eta(x)\}$.

**3. 점별에서 전체로.** $t=h(x)$를 넣으면 $\E[\lvert f^\ast(X)-Y\rvert\mid X=x]=\phi_x(f^\ast(x))\le\phi_x(h(x))=\E[\lvert h(X)-Y\rvert\mid X=x]$. $X$에 대해 기댓값을 취하면 $L(f^\ast)\le L(h)$.`,
    note: R`결론의 요점: 손실이 $t$에 대해 **일차**이면 최적해는 구간 끝점에 있으므로 무작위화가 이득이 없습니다. 손실이 $t$에 대해 **강볼록**이면(제곱 손실) 내부의 $t=\eta(x)$가 최적입니다 — 다음 증명.` },
  { ch: 'ch02', id: 'hybrid', title: '혼합 L1–L2 손실의 베이즈 최적 예측기', keys: ['혼합 손실의 베이즈 최적 예측기'], src: '강의 노트 · Exercise 1 (Solution)',
    tags: 'hybrid loss squared absolute projection conditional mean Bayes 혼합 손실 제곱 손실 사영 조건부 평균',
    stmt: R`$\ell_\alpha(t,y)=\alpha\lvert t-y\rvert+(1-\alpha)(t-y)^2$에 대해 $\alpha\in[0,1)$이면 $h_\alpha(x)=\Pi_{[0,1]}\big(\frac{2\eta(x)-\alpha}{2(1-\alpha)}\big)$가, $\alpha=1$이면 $h_1(x)=\one[\eta(x)\ge\tfrac12]$가 베이즈 최적이다. 특히 $\alpha=0$이면 $h_0=\eta$.`,
    body: R`
**1. 조건부 위험.** $x$를 고정, $\eta=\eta(x)$, $t\in[0,1]$. $Y\in\{0,1\}$이므로
$$\phi(t)=\alpha\big[\eta\lvert t-1\rvert+(1-\eta)\lvert t\rvert\big]+(1-\alpha)\big[\eta(t-1)^2+(1-\eta)t^2\big].$$
$t\in[0,1]$이라 절댓값을 벗기면 첫 괄호 $=\eta(1-t)+(1-\eta)t=\eta+t(1-2\eta)$. 둘째 괄호 $=\eta(1-2t+t^2)+(1-\eta)t^2=\eta-2\eta t+t^2$. 합치면
$$\phi(t)=\alpha\eta+\alpha t(1-2\eta)+(1-\alpha)(\eta-2\eta t+t^2)=\eta+(\alpha-2\eta)t+(1-\alpha)t^2.$$
($t$의 계수: $\alpha-2\alpha\eta-2\eta+2\alpha\eta=\alpha-2\eta$.)

**2. $\alpha<1$: 볼록 이차식.** $\phi''=2(1-\alpha)>0$이므로 볼록이고 $\phi'(t)=\alpha-2\eta+2(1-\alpha)t=0$에서 꼭짓점 $t^\ast=\frac{2\eta-\alpha}{2(1-\alpha)}$.

**3. 구간 위의 최소.** 볼록 이차식은 꼭짓점 왼쪽에서 감소, 오른쪽에서 증가합니다. $t^\ast\in[0,1]$이면 최소점은 $t^\ast$; $t^\ast<0$이면 $\phi$가 $[0,1]$에서 증가해 최소점 0; $t^\ast>1$이면 감소해 최소점 1. 세 경우를 합치면 최소점은 $\Pi_{[0,1]}(t^\ast)$.

**4. 조각 형태.** $t^\ast\le0\iff2\eta\le\alpha\iff\eta\le\alpha/2$; $t^\ast\ge1\iff2\eta-\alpha\ge2-2\alpha\iff\eta\ge1-\alpha/2$.

**5. $\alpha=1$.** $\phi(t)=\eta+t(1-2\eta)$는 일차라 앞 증명처럼 $t=\one[\eta\ge\tfrac12]$가 최소($\eta=\tfrac12$이면 모든 $t$).

**6. $\alpha=0$.** $\phi(t)=t^2-2\eta t+\eta=(t-\eta)^2+\eta(1-\eta)$ — 완전제곱으로 최소점이 $t=\eta$임이 바로 보입니다.

**7. 베이즈 최적.** 모든 $x$에서 조건부 위험을 최소로 하므로, 임의의 $h$에 대해 $\E[\ell_\alpha(h_\alpha(X),Y)\mid X=x]\le\E[\ell_\alpha(h(X),Y)\mid X=x]$이고 기댓값을 취하면 $L(h_\alpha)\le L(h)$.`,
    note: R`$\alpha$가 0에서 1로 가면 “잘라 내는” 구간 $[0,\alpha/2]$, $[1-\alpha/2,1]$이 넓어져 $\alpha=1$에서 두 구간이 $\tfrac12$에서 만나고 문턱 규칙이 됩니다. 제곱 손실의 최적 예측이 조건부 평균이라는 사실은 회귀의 기본이고, 로지스틱 회귀가 $\eta$를 추정하는 이유이기도 합니다[[@dnn:ch05:5.3|로그 손실(교차 엔트로피)도 조건부 확률 $\eta$를 그대로 말하게 하는 손실입니다.]].` },
  // ───── 03
  { ch: 'ch03', id: 'repLemma', title: 'ε/2-대표 표본에서 ERM은 ε 안에 든다', keys: ['대표 표본 보조정리'],
    tags: 'epsilon representative sample ERM lemma 4.2 대표 표본',
    stmt: R`$S$가 $\tfrac\varepsilon2$-대표이면 모든 $h_S\in\ERM_\cH(S)$에 대해 $L_\cD(h_S)\le\min_{h\in\cH}L_\cD(h)+\varepsilon$.`,
    body: R`
임의의 $h\in\cH$를 고정합니다.

1. 대표성을 $h_S$에 적용: $L_\cD(h_S)\le L_S(h_S)+\tfrac\varepsilon2$.
2. ERM의 정의: $L_S(h_S)\le L_S(h)$.
3. 대표성을 $h$에 적용: $L_S(h)\le L_\cD(h)+\tfrac\varepsilon2$.

이어 붙이면 $L_\cD(h_S)\le L_\cD(h)+\varepsilon$. $h$가 임의이므로 우변의 하한(최솟값이 없으면 inf)을 취해도 성립합니다.`,
    note: R`1단계는 $h_S$가 표본에 따라 고른 가설이라 “고정된 가설의 집중”으로는 얻을 수 없고, 모든 가설에서 동시에 성립하는 대표성이 있어야 합니다. 3단계는 고정된 $h$ 하나에 대한 것이라 호프딩만으로도 됩니다 — 그래서 실제로는 한쪽 방향 대표성과 한 가설의 집중으로도 같은 결론이 나옵니다.` },
  { ch: 'ch03', id: 'ucToPAC', title: '균등수렴 ⇒ ERM이 불가지 PAC 학습기', keys: ['균등수렴이면 ERM으로 불가지 PAC 학습가능'],
    tags: 'uniform convergence agnostic PAC ERM corollary 4.4 균등수렴',
    stmt: R`$\cH$가 $m^{\mathrm{UC}}_\cH$로 균등수렴하면 $\cH$는 불가지 PAC 학습가능하고 $m_\cH(\varepsilon,\delta)\le m^{\mathrm{UC}}_\cH(\varepsilon/2,\delta)$이며, $\ERM_\cH$가 성공적인 학습기이다.`,
    body: R`
$\varepsilon,\delta\in(0,1)$와 분포 $\cD$를 임의로 잡고 $m\ge m^{\mathrm{UC}}_\cH(\varepsilon/2,\delta)$라 합시다. 균등수렴의 정의($\varepsilon/2$로 적용)에 의해 확률 $1-\delta$ 이상으로 $S$는 $\tfrac\varepsilon2$-대표입니다. 그 사건 위에서 대표 표본 보조정리로 $L_\cD(\ERM_\cH(S))\le\min_hL_\cD(h)+\varepsilon$. 따라서 확률 $1-\delta$ 이상으로 불가지 PAC 조건이 성립하고, $m^{\mathrm{UC}}_\cH(\varepsilon/2,\delta)$는 이 성질을 만족하는 표본 수 함수이므로 최소 함수 $m_\cH$는 그 이하입니다.`,
    note: R`$m^{\mathrm{UC}}$가 분포에 기대지 않으므로 얻은 $m_\cH$도 분포에 기대지 않습니다. 이 “분포 무관”이 PAC 정의의 요구 사항입니다.` },
  { ch: 'ch03', id: 'hoeffding', title: '호프딩 부등식', keys: ['호프딩 부등식'],
    tags: 'Hoeffding inequality lemma Markov Chernoff moment generating concentration 호프딩 마르코프 체르노프 적률생성함수 집중',
    stmt: R`$\theta_1,\dots,\theta_m$이 i.i.d., $\E\theta_i=\mu$, $a\le\theta_i\le b$이면 $\Prob\big[\lvert\frac1m\sum\theta_i-\mu\rvert>\varepsilon\big]\le2\exp\big(-2m\varepsilon^2/(b-a)^2\big)$.`,
    body: R`
**1. 마르코프 부등식.** $Z\ge0$, $a>0$이면 $Z\ge a\one[Z\ge a]$이므로 기댓값을 취해 $\E Z\ge a\Prob[Z\ge a]$.

**2. 호프딩 보조정리.** $\E X=0$, $a\le X\le b$이면 모든 $\lambda$에서 $\E[e^{\lambda X}]\le e^{\lambda^2(b-a)^2/8}$.

*증명.* $a<b$라 해도 됩니다($a=b$면 $X\equiv0$). $\E X=0$이므로 $a\le0\le b$. $x\mapsto e^{\lambda x}$가 볼록이므로 $x\in[a,b]$를 끝점의 볼록결합 $x=\frac{b-x}{b-a}a+\frac{x-a}{b-a}b$로 쓰면
$$e^{\lambda x}\le\frac{b-x}{b-a}e^{\lambda a}+\frac{x-a}{b-a}e^{\lambda b}.$$
기댓값($\E X=0$): $\E e^{\lambda X}\le\frac{b}{b-a}e^{\lambda a}-\frac{a}{b-a}e^{\lambda b}$. $p=\frac{-a}{b-a}\in[0,1]$, $h=\lambda(b-a)$로 두면 $\lambda a=-ph$이고 우변 $=(1-p)e^{-ph}+pe^{(1-p)h}=e^{L(h)}$, 여기서
$$L(h)=-ph+\ln(1-p+pe^h).$$
$L(0)=0$, $L'(h)=-p+\frac{pe^h}{1-p+pe^h}$라 $L'(0)=0$, 그리고 $q=\frac{pe^h}{1-p+pe^h}\in[0,1]$로 두면 $L''(h)=q(1-q)\le\tfrac14$. 테일러 정리(나머지항)로 어떤 $\xi$에서 $L(h)=\tfrac12L''(\xi)h^2\le\frac{h^2}8=\frac{\lambda^2(b-a)^2}8$.[[@base:ch01:1.3|$L(h)=L(0)+L'(0)h+\tfrac12L''(\xi)h^2$ — 라그랑주 나머지항.]]

**3. 체르노프 기법.** $X_i=\theta_i-\mu$(폭 $b-a$, 평균 0). $\lambda>0$에 대해
$$\Prob\Big[\tfrac1m\textstyle\sum X_i\ge\varepsilon\Big]=\Prob\big[e^{\lambda\sum X_i}\ge e^{\lambda m\varepsilon}\big]\le e^{-\lambda m\varepsilon}\E\big[e^{\lambda\sum X_i}\big]=e^{-\lambda m\varepsilon}\prod_{i=1}^m\E[e^{\lambda X_i}]$$
(마르코프, 그리고 독립성으로 곱). 보조정리로 $\le\exp\big(-\lambda m\varepsilon+m\lambda^2(b-a)^2/8\big)$.

**4. 최적의 $\lambda$.** 지수는 $\lambda$의 이차식이고 $\lambda=4\varepsilon/(b-a)^2$에서 최솟값 $-2m\varepsilon^2/(b-a)^2$.

**5. 양쪽.** $-X_i$에 같은 논증으로 $\Prob[\frac1m\sum X_i\le-\varepsilon]$도 같은 상한. 합집합 상한으로 인수 2. ($>\varepsilon$ 사건은 $\ge\varepsilon$ 사건에 포함됩니다.)`,
    note: R`분산을 쓰는 체비쇼프 부등식은 $\Prob\le\frac{\sigma^2}{m\varepsilon^2}$로 $1/m$ 속도에 그칩니다. 호프딩은 유계성을 이용해 **지수** 속도를 얻고, 이 덕분에 합집합 상한의 비용이 $\ln\lvert\cH\rvert$로 들어갑니다.` },
  { ch: 'ch03', id: 'finiteAgn', title: '유한 클래스의 불가지 PAC 학습가능성', keys: ['유한 클래스의 불가지 PAC 학습가능성'], src: '강의 노트 · Def 3.4, Cor 4.6',
    tags: 'finite class agnostic PAC Hoeffding union bound corollary 4.6 유한 클래스 불가지 균등수렴',
    stmt: R`$\cH$가 유한하고 $\ell\in[0,1]$이면 $m\ge\frac{2}{\varepsilon^2}\ln\frac{2\lvert\cH\rvert}\delta$일 때 모든 $\cD$에 대해 확률 $1-\delta$ 이상으로 $L_\cD(\hat h(S))\le\min_hL_\cD(h)+\varepsilon$. 또한 $m^{\mathrm{UC}}_\cH(\varepsilon,\delta)\le\lceil\ln(2\lvert\cH\rvert/\delta)/(2\varepsilon^2)\rceil$.`,
    body: R`
강의 노트의 가정: (1) $S\sim\cD^m$, (2) $z\mapsto\ell(h,z)$ 가측, (3) $0\le\ell\le1$, (4) ERM, 동점은 고정 순서로.

**1단계 — 한 가설.** $h$를 고정하고 $X_i=\ell(h,z_i)$. (1)로 i.i.d., (3)으로 $[0,1]$ 값, (2)로 $\E X_i=L_\cD(h)$가 잘 정의됨. $\frac1m\sum X_i=L_S(h)$이므로 호프딩으로
$$\Prob(\lvert L_S(h)-L_\cD(h)\rvert\ge t)\le2e^{-2mt^2}.$$

**2단계 — 클래스 전체.** $\mathcal E_t=\{S:\max_h\lvert L_S(h)-L_\cD(h)\rvert<t\}$. $\mathcal E_t^c=\bigcup_h\{\lvert L_S(h)-L_\cD(h)\rvert\ge t\}$이므로 합집합 상한으로 $\Prob(\mathcal E_t^c)\le2\lvert\cH\rvert e^{-2mt^2}$.

**균등수렴 표본 수.** $2\lvert\cH\rvert e^{-2m\varepsilon^2}\le\delta\iff m\ge\ln(2\lvert\cH\rvert/\delta)/(2\varepsilon^2)$이므로 이 $m$에서 확률 $1-\delta$ 이상으로 $S$는 $\varepsilon$-대표.

**3단계 — ERM.** $t=\varepsilon/2$. $\cH$가 유한이라 $h^\star\in\argmin_hL_\cD(h)$가 있습니다. $\mathcal E_{\varepsilon/2}$ 위에서
$$L_\cD(\hat h)\le L_S(\hat h)+\tfrac\varepsilon2\le L_S(h^\star)+\tfrac\varepsilon2\le L_\cD(h^\star)+\varepsilon.$$
(첫째·셋째는 $\mathcal E_{\varepsilon/2}$, 둘째는 (4).)

**4단계 — 확률.** $\Prob(\mathcal E^c_{\varepsilon/2})\le2\lvert\cH\rvert e^{-m\varepsilon^2/2}\le\delta\iff m\ge\frac2{\varepsilon^2}\ln\frac{2\lvert\cH\rvert}\delta$. $\cD$가 임의였으므로 모든 분포에서 성립하고, $m_\cH(\varepsilon,\delta)=\lceil\frac2{\varepsilon^2}\ln\frac{2\lvert\cH\rvert}\delta\rceil$로 불가지 PAC 학습가능합니다.`,
    note: R`2단계에서 노트는 $<t$(엄격)로 좋은 사건을 정의해 여사건이 호프딩의 $\ge t$ 사건과 정확히 맞게 했습니다. 이런 경계 처리는 결론에 영향이 없지만, 답안에서 부등호 방향을 일관되게 쓰는 습관이 중요합니다.` },
  { ch: 'ch03', id: 'discret', title: '이산화 기법의 표본 수', keys: ['이산화 기법의 표본 수'],
    tags: 'discretization trick 64 bit floating point parameters 이산화 부동소수점 모수',
    stmt: R`64비트 수 $d$개로 모수화된 클래스는 $\ell\in[0,1]$일 때 $m_\cH(\varepsilon,\delta)\le\frac{128d+2\ln(2/\delta)}{\varepsilon^2}$.`,
    body: R`
64비트로 표현할 수 있는 수는 $2^{64}$개 이하이므로 모수 $d$개의 조합은 $2^{64d}$개 이하, 즉 $\lvert\cH\rvert\le2^{64d}$. 유한 클래스의 불가지 PAC 상한에 넣으면
$$m_\cH(\varepsilon,\delta)\le\left\lceil\frac{2\ln(2\cdot2^{64d}/\delta)}{\varepsilon^2}\right\rceil=\left\lceil\frac{2\big(64d\ln2+\ln(2/\delta)\big)}{\varepsilon^2}\right\rceil.$$
$\ln2<1$이므로 $2\cdot64d\ln2<128d$. (올림을 흡수하려면 우변을 조금 키워 적으면 됩니다.)`,
    note: R`상한이 저장 방식(64비트)에 기대는 것은 이론적으로 불만족스럽습니다. VC 차원은 표현과 무관하게 같은 모양 $d/\varepsilon^2$을 줍니다.` },
  // ───── 04
  { ch: 'ch04', id: 'nfl', title: '공짜 점심은 없다 정리', keys: ['공짜 점심은 없다 정리'], src: '강의 노트 · Theorem 5.1',
    tags: 'no free lunch theorem 5.1 adversarial labeling pairing average 공짜 점심 짝짓기 평균 적대적',
    stmt: R`이진 분류 0–1 손실의 임의의 학습기 $A$와 $m<\lvert\cX\rvert/2$에 대해, $L_\cD(f)=0$인 $f$가 있고 $\Prob_{S\sim\cD^m}[L_\cD(A(S))\ge\tfrac18]\ge\tfrac17$인 분포 $\cD$가 있다.`,
    body: R`
**0. 세계들.** $\lvert C\rvert=2m$인 $C\subseteq\cX$를 잡고, $C$ 위의 레이블링 $f_1,\dots,f_T$ ($T=2^{2m}$)마다 $\cD_i$를 “$C$ 위 균등, $y=f_i(x)$”로 정합니다: $\cD_i(\{(x,y)\})=\frac1{2m}$ ($y=f_i(x)$), 아니면 0. $L_{\cD_i}(f_i)=0$.

**1. 목표.** $\max_i\E_{S\sim\cD_i^m}[L_{\cD_i}(A(S))]\ge\tfrac14$를 보인 뒤 7단계에서 확률로 바꿉니다.

**2. 표본 열거.** 입력 수열 $S_1,\dots,S_k\in C^m$ ($k=(2m)^m$)은 $\cD_i$ 아래 모두 확률 $1/k$. $S_j^i$를 $f_i$로 레이블한 표본이라 하면 $\E_{S\sim\cD_i^m}[L_{\cD_i}(A(S))]=\frac1k\sum_jL_{\cD_i}(A(S_j^i))$.

**3. 최대 ≥ 평균 ≥ 최소.**
$$\max_i\frac1k\sum_jL_{\cD_i}(A(S_j^i))\ge\frac1T\sum_i\frac1k\sum_j(\cdot)=\frac1k\sum_j\frac1T\sum_i(\cdot)\ge\min_j\frac1T\sum_iL_{\cD_i}(A(S_j^i)).$$
그래서 모든 $j$에서 $\frac1T\sum_iL_{\cD_i}(A(S_j^i))\ge\frac14$면 충분합니다.

**4. 보지 못한 점.** $S_j=(x_1,\dots,x_m)$에 없는 $C$의 점 $v_1,\dots,v_p$. 나타난 서로 다른 점은 $m$개 이하이므로 $p\ge m$. 임의의 $h:C\to\{0,1\}$에 대해
$$L_{\cD_i}(h)=\frac1{2m}\sum_{x\in C}\one[h(x)\ne f_i(x)]\ge\frac1{2m}\sum_{r=1}^p\one[h(v_r)\ne f_i(v_r)]\ge\frac1{2p}\sum_{r=1}^p\one[h(v_r)\ne f_i(v_r)].$$

**5. 평균.** $h=A(S_j^i)$를 넣고 $i$에 대해 평균, 합의 순서를 바꾸면
$$\frac1T\sum_iL_{\cD_i}(A(S_j^i))\ge\frac1{2p}\sum_{r=1}^p\frac1T\sum_i\one[A(S^i_j)(v_r)\ne f_i(v_r)].$$

**6. 짝짓기.** $r$ 고정. $f\mapsto f$의 $v_r$ 값만 뒤집은 레이블링은 짝 없는 원소가 없는 대합이므로 $T$개가 $T/2$쌍 $(f_i,f_{i'})$으로 나뉩니다. $v_r\notin S_j$이므로 $f_i,f_{i'}$로 레이블한 표본이 같고($S_j^i=S_j^{i'}$), 결정적 학습기의 출력 $h$도 같습니다. $f_i(v_r)\ne f_{i'}(v_r)$이므로 $h(v_r)$은 정확히 하나와 다릅니다: $\one[h(v_r)\ne f_i(v_r)]+\one[h(v_r)\ne f_{i'}(v_r)]=1$. 쌍을 모두 더하면 $\frac1T\sum_i\one[\cdot]=\frac12$. 5에 넣으면 $\ge\frac1{2p}\cdot p\cdot\frac12=\frac14$.

**7. 확률로.** 3에서 $\E_{S\sim\cD_i^m}[L_{\cD_i}(A(S))]\ge\tfrac14$인 $i$가 있습니다. $\theta=L_{\cD_i}(A(S))\in[0,1]$, $P=\Prob[\theta\ge\tfrac18]$라 하면
$$\tfrac14\le\E\theta\le\tfrac18(1-P)+1\cdot P=\tfrac18+\tfrac78P\ \Longrightarrow\ P\ge\tfrac17.$$
$\cD=\cD_i$, $f=f_i$로 두면 두 결론이 모두 성립합니다.`,
    note: R`무작위 학습기라면 6단계에서 “출력이 같다”가 “출력의 분포가 같다”로 바뀌고 같은 논증이 기댓값으로 성립합니다. 노트의 7단계는 귀류법으로 적었지만(“$P<\frac17$이면 $\E\theta<\frac14$”), 위처럼 직접 풀어도 같습니다.` },
  { ch: 'ch04', id: 'exp2prob', title: '[0,1] 값 확률변수: 기댓값 하한에서 확률 하한으로', keys: ['기댓값 하한에서 확률 하한으로'],
    tags: 'reverse Markov expectation probability bound lemma B.1 역마르코프',
    stmt: R`$\theta\in[0,1]$이고 $\E\theta\ge\mu$, $a<\mu$이면 $\Prob[\theta>a]\ge\frac{\mu-a}{1-a}$. 특히 $\mu=\tfrac14$, $a=\tfrac18$이면 $\Prob[\theta\ge\tfrac18]\ge\tfrac17$.`,
    body: R`
$\theta\le a$인 곳에서는 $\theta\le a$, 나머지에서는 $\theta\le1$이므로
$$\E\theta\le a\Prob[\theta\le a]+1\cdot\Prob[\theta>a]=a+(1-a)\Prob[\theta>a].$$
$\mu\le\E\theta$와 합치면 $\Prob[\theta>a]\ge\frac{\mu-a}{1-a}$. $\mu=\tfrac14$, $a=\tfrac18$이면 $\frac{1/8}{7/8}=\frac17$이고, $\Prob[\theta\ge\tfrac18]\ge\Prob[\theta>\tfrac18]$.`,
    note: R`$\theta$가 위로 유계일 때 쓰는 “뒤집은 마르코프 부등식”입니다. 마르코프는 $\Prob[\theta\ge a]\le\E\theta/a$로 위에서 누르고, 이것은 아래에서 받칩니다.` },
  { ch: 'ch04', id: 'allFunctions', title: '무한 정의역의 모든 함수 클래스는 PAC 학습가능하지 않다', keys: ['모든 함수의 클래스는 학습할 수 없다'],
    tags: 'corollary 5.2 all functions infinite domain not PAC learnable prior knowledge 사전 지식',
    stmt: R`$\cX$가 무한이고 $\cH=\{0,1\}^\cX$이면 $\cH$는 PAC 학습가능하지 않다.`,
    body: R`
PAC 학습가능하다고 가정하고 $A$, $m_\cH$를 잡습니다. $\varepsilon<\tfrac18$, $\delta<\tfrac17$을 고르고 $m=m_\cH(\varepsilon,\delta)$. 정의에 의해 $f\in\cH$로 실현가능한 모든 $\cD$에서 $\Prob[L_\cD(A(S))\le\varepsilon]\ge1-\delta$, 즉 $\Prob[L_\cD(A(S))>\varepsilon]\le\delta<\tfrac17$.

$\lvert\cX\rvert=\infty>2m$이므로 공짜 점심은 없다 정리가 $A$와 $m$에 적용되어, $L_\cD(f)=0$인 $f$와 $\Prob[L_\cD(A(S))\ge\tfrac18]\ge\tfrac17$인 $\cD$가 있습니다. $f$는 어떤 함수든 $\cH$에 속하므로 이 $\cD$는 실현가능합니다. 그러면 $\Prob[L_\cD(A(S))>\varepsilon]\ge\Prob[L_\cD(A(S))\ge\tfrac18]\ge\tfrac17$ — 모순.`,
    note: R`같은 논증이 “$\cH$가 임의로 큰 집합을 분쇄하면 학습 불가”로 곧장 일반화됩니다(5단원). 공짜 점심은 없다 정리가 실제로 쓴 것은 $\cH$가 $C$ 위의 모든 레이블링을 담는다는 것뿐입니다.` },
  // ───── 05
  { ch: 'ch05', id: 'threshold', title: '임계 함수 클래스는 PAC 학습가능하다', keys: ['임계 함수 클래스의 표본 복잡도'], src: '강의 노트 · Lemma 6.1',
    tags: 'threshold functions infinite class PAC ERM lemma 6.1 임계 함수 문턱',
    stmt: R`$\cH=\{\one[x<a]:a\in\mathbb R\}$는 실현가능 설정에서 ERM으로 PAC 학습가능하고 $m_\cH(\varepsilon,\delta)\le\lceil\ln(2/\delta)/\varepsilon\rceil$.`,
    body: R`
참 임계값 $a^\star$, 즉 $y=\one[x<a^\star]$. $\cD_x$는 $x$의 분포.

**1. 경계 근처 구간.** $a_0=\sup\{t\le a^\star:\Prob(t\le X<a^\star)\ge\varepsilon\}$ (없으면 $-\infty$)으로 잡으면 $\Prob(a_0\le X<a^\star)\ge\varepsilon$(질량이 있으면)이고 $(a_0,a^\star)$ 안의 어느 $t$도 $\Prob(t\le X<a^\star)<\varepsilon$. 오른쪽 $a_1$도 대칭으로 잡습니다. 분포가 연속이면 노트처럼 $\Prob(a_0<X<a^\star)=\Prob(a^\star\le X<a_1)=\varepsilon$.

**2. ERM의 모양.** $b_0=\max\{x_i:y_i=1\}$, $b_1=\min\{x_i:y_i=0\}$(없으면 $\mp\infty$). 오차 0을 내려면 $b_0<a_S\le b_1$.

**3. 좋은 경우.** 표본에 $[a_0,a^\star)$의 점과 $[a^\star,a_1]$의 점이 하나씩 있으면 $b_0\ge a_0$, $b_1\le a_1$이라 $a_S\in(a_0,a_1]$. $h_S$와 참 함수가 다른 곳은 $a_S$와 $a^\star$ 사이의 구간 하나이고, 1의 선택으로 그 확률은 $\le\varepsilon$ (구간이 $a_0$이나 $a_1$을 포함하지 않으므로).

**4. 나쁜 경우의 확률.** 대우: $L_\cD(h_S)>\varepsilon$이면 표본이 $[a_0,a^\star)$를 통째로 피했거나 $[a^\star,a_1]$을 피했습니다. 각 사건의 확률은 $(1-\varepsilon)^m\le e^{-\varepsilon m}$(각 점이 그 구간을 피할 확률 $\le1-\varepsilon$, 독립). 합집합 상한으로 $\Prob(L_\cD(h_S)>\varepsilon)\le2e^{-\varepsilon m}$. (한쪽 질량이 $\varepsilon$ 미만이라 끝을 $\mp\infty$로 둔 경우, 그쪽에서는 오차가 원래 $\varepsilon$ 미만이라 사건이 필요 없습니다.)

**5.** $2e^{-\varepsilon m}\le\delta\iff m\ge\ln(2/\delta)/\varepsilon$.`,
    note: R`노트는 연속분포를 가정하고 $\Prob=\varepsilon$인 $a_0,a_1$을 잡았습니다. 1단계의 sup 정의는 점질량이 있어도 통하도록 한 보완입니다. 결론의 핵심 — “실패하려면 질량 $\varepsilon$인 구간을 $m$번 모두 피해야 한다” — 은 그대로입니다.` },
  { ch: 'ch05', id: 'infVC', title: 'VC 차원이 무한이면 PAC 학습가능하지 않다', keys: ['VC 차원이 무한이면 PAC 학습 불가'],
    tags: 'infinite VC dimension not PAC learnable shatter no free lunch theorem 6.6 분쇄',
    stmt: R`$\cH$가 크기 $2m$인 집합 $C$를 분쇄하면, 임의의 학습기 $A$에 대해 $\cH$로 실현가능한 $\cD$가 있어 $\Prob_{S\sim\cD^m}[L_\cD(A(S))\ge\tfrac18]\ge\tfrac17$. 따라서 $\VC(\cH)=\infty$이면 $\cH$는 PAC 학습가능하지 않다.`,
    body: R`
공짜 점심은 없다 정리의 증명을 $C$ 위에서 그대로 따라가면, 쓰인 분포 $\cD_i$는 “$C$ 위 균등, 레이블 $f_i$”이고 결론은 어떤 $i$에서 $\Prob[L_{\cD_i}(A(S))\ge\tfrac18]\ge\tfrac17$입니다. $\cH$가 $C$를 분쇄하므로 $h|_C=f_i$인 $h\in\cH$가 있고, $\cD_i$는 $C$ 밖에 질량이 없으므로 $L_{\cD_i}(h)=0$ — 즉 $\cD_i$는 $\cH$로 **실현가능**합니다.

이제 $\VC(\cH)=\infty$이고 PAC 학습가능하다고 가정합니다. $\varepsilon<\tfrac18$, $\delta<\tfrac17$, $m=m_\cH(\varepsilon,\delta)$. $\cH$는 크기 $2m$인 집합을 분쇄하므로 위에서 실현가능한 $\cD$가 있어 $\Prob[L_\cD(A(S))>\varepsilon]\ge\tfrac17>\delta$ — PAC 보장과 모순.`,
    note: R`이것이 기본 정리의 “PAC ⇒ VC 유한” 고리입니다. 공짜 점심은 없다 정리의 조건 $m<\lvert\cX\rvert/2$가 “$2m$개 점을 분쇄”로 바뀐 것에 주목하세요 — 정의역의 크기가 아니라 **클래스가 표현할 수 있는 세계의 수**가 문제입니다.` },
  { ch: 'ch05', id: 'sauer', title: '사우어–셸라–펄스 보조정리', keys: ['사우어 보조정리'], src: '강의 노트 · Lemma 6.10',
    tags: 'Sauer Shelah Perles lemma growth function shattered subsets induction 사우어 성장 함수 분쇄 귀납법',
    stmt: R`모든 유한 $C$에 대해 $\lvert\cH_C\rvert\le\lvert\{B\subseteq C:\cH\text{가 }B\text{를 분쇄}\}\rvert$. 따라서 $\VC(\cH)\le d$이면 $\tau_\cH(m)\le\sum_{i=0}^d\binom mi$.`,
    body: R`
**귀결.** 부등식이 성립하면: $\VC\le d$이므로 분쇄되는 $B\subseteq C$는 $\lvert B\rvert\le d$이고, 크기 $i$인 부분집합은 $\binom mi$개라 $\lvert\cH_C\rvert\le\sum_{i\le d}\binom mi$. $\lvert C\rvert=m$인 $C$에 대해 최대를 취하면 $\tau_\cH(m)$의 상한입니다.

**귀납법 ($m=\lvert C\rvert$).** $m=0$: $\cH_\emptyset=\{()\}$라 좌변 1, 분쇄되는 부분집합은 $\emptyset$ 하나(관례)라 우변 1.

$m\ge1$: $C=\{c_1,\dots,c_m\}$, $C'=\{c_2,\dots,c_m\}$.
$$Y_0=\{(y_2,\dots,y_m):(0,y_2,\dots,y_m)\in\cH_C\ \text{또는}\ (1,y_2,\dots,y_m)\in\cH_C\},$$
$$Y_1=\{(y_2,\dots,y_m):(0,y_2,\dots,y_m)\in\cH_C\ \text{그리고}\ (1,y_2,\dots,y_m)\in\cH_C\}.$$

**(a) $\lvert\cH_C\rvert=\lvert Y_0\rvert+\lvert Y_1\rvert$.** $Y_0$의 각 패턴은 $\cH_C$에 1번 또는 2번 나타나고, 2번 나타나는 것이 정확히 $Y_1$입니다.

**(b) $\lvert Y_0\rvert$.** $Y_0=\cH_{C'}$(어떤 $h$의 $C'$ 위 값)이고 $\lvert C'\rvert=m-1$이므로 귀납 가정으로
$$\lvert Y_0\rvert\le\#\{B\subseteq C':\cH\text{가 분쇄}\}=\#\{B\subseteq C:c_1\notin B,\ \cH\text{가 분쇄}\}.$$

**(c) $\lvert Y_1\rvert$.** $\cH'=\{h\in\cH:\exists h'\in\cH,\ h'|_{C'}=h|_{C'},\ h'(c_1)\ne h(c_1)\}$. 그러면 $Y_1=\cH'_{C'}$: $Y_1$의 패턴은 $c_1$만 다른 두 가설로 실현되므로 그 가설들은 $\cH'$에 있고, 역으로 $h\in\cH'$와 짝 $h'$는 $c_1$에서 0과 1을 나눠 가져 $h|_{C'}\in Y_1$. $\cH'$에 귀납 가정을 쓰면 $\lvert Y_1\rvert\le\#\{B\subseteq C':\cH'\text{가 분쇄}\}$.

**(d) 정방향 함의.** $\cH'$가 $B\subseteq C'$를 분쇄하면 $\cH$는 $B\cup\{c_1\}$을 분쇄합니다. $B\cup\{c_1\}$ 위의 레이블링 $\sigma$가 주어지면, $\cH'$에서 $\sigma|_B$를 실현하는 $h$를 잡고 그 짝 $h'$를 봅니다. $h,h'$는 $B$에서 같고($B\subseteq C'$) $c_1$에서 다르므로 둘 중 하나가 $\sigma(c_1)$을 줍니다. 그러므로 $B\mapsto B\cup\{c_1\}$은 $\{B\subseteq C':\cH'\text{가 분쇄}\}$에서 $\{D\subseteq C:c_1\in D,\ \cH\text{가 분쇄}\}$로 가는 **단사**이고
$$\lvert Y_1\rvert\le\#\{D\subseteq C:c_1\in D,\ \cH\text{가 분쇄}\}.$$

**(e) 합치기.** (b)와 (d)의 두 집합은 $c_1$ 포함 여부로 나뉘는 서로소이고 합집합은 $\{B\subseteq C:\cH\text{가 분쇄}\}$. (a)에 넣으면 결론.`,
    note: R`강의 노트는 (d)를 “$\cH'$가 $B$를 분쇄 $\iff$ $\cH$가 $B\cup\{c_1\}$을 분쇄”라는 동치로 적고 역방향도 증명하려 했지만, **역방향은 거짓**입니다. 반례: $C=\{c_1,c_2\}$, $\cH=\{(0,0),(1,1)\}$. $\cH$는 $\{c_1\}$을 분쇄하지만 $c_2$에서 같고 $c_1$에서 다른 짝이 없어 $\cH'=\emptyset$이고, $\cH'$는 $\emptyset$도 분쇄하지 못합니다. 증명에 필요한 것은 부등식이므로 정방향(단사)만으로 충분하고, 결론은 그대로 옳습니다.` },
  { ch: 'ch05', id: 'binomBound', title: '이항계수 합의 상한 (em/d)^d', keys: ['사우어 보조정리'],
    tags: 'binomial sum bound em/d polynomial growth 이항계수 다항식 성장',
    stmt: R`$1\le d\le m$이면 $\sum_{i=0}^d\binom mi\le\left(\frac{em}d\right)^d$.`,
    body: R`
$i\le d\le m$이면 $\left(\frac md\right)^{d-i}\ge1$이므로
$$\sum_{i=0}^d\binom mi\le\sum_{i=0}^d\binom mi\left(\frac md\right)^{d-i}=\left(\frac md\right)^d\sum_{i=0}^d\binom mi\left(\frac dm\right)^i\le\left(\frac md\right)^d\sum_{i=0}^m\binom mi\left(\frac dm\right)^i.$$
이항정리로 마지막 합은 $\left(1+\frac dm\right)^m$이고, $1+t\le e^t$로 $\le e^d$. 따라서 $\le\left(\frac md\right)^de^d=\left(\frac{em}d\right)^d$.`,
    note: R`교재는 $m>d+1$일 때로 적었지만 위 증명은 $m\ge d$에서 성립합니다. 요점: VC 차원을 넘어가면 성장 함수가 $m^d$ 정도의 다항식이라 $\ln\tau_\cH(m)\approx d\ln m$ — 유한 클래스의 $\ln\lvert\cH\rvert$ 자리를 $d\ln m$이 차지합니다.` },
  { ch: 'ch05', id: 'fundamental', title: '학습의 기본 정리 (순환 증명의 뼈대)', keys: ['학습의 기본 정리'],
    tags: 'fundamental theorem of statistical learning equivalence uniform convergence PAC VC 기본 정리 동치',
    stmt: R`0–1 손실의 이진 분류에서 (1) 균등수렴 (2) ERM이 불가지 PAC 학습기 (3) 불가지 PAC 학습가능 (4) PAC 학습가능 (5) ERM이 PAC 학습기 (6) $\VC(\cH)<\infty$ 는 동치이다.`,
    body: R`
**1⇒2.** 균등수렴 ⇒ ERM이 불가지 PAC 학습기(3단원).
**2⇒3.** 정의.
**3⇒4.** 불가지 PAC 학습기는 실현가능한 분포에서 $\min_hL_\cD(h)=0$이므로 PAC 학습기.
**2⇒5.** 같은 이유로 ERM이 PAC 학습기.
**5⇒4.** 정의.
**4⇒6.** “VC 차원이 무한이면 PAC 학습 불가”의 대우.
**6⇒1.** $\VC(\cH)=d<\infty$이면 사우어 보조정리로 $\tau_\cH(2m)\le(2em/d)^d$ ($2m\ge d$). 성장 함수의 균등수렴 상한에 넣으면 확률 $1-\delta$ 이상으로
$$\sup_h\lvert L_\cD(h)-L_S(h)\rvert\le\frac{4+\sqrt{d\ln(2em/d)}}{\delta\sqrt{2m}}.$$
우변은 $m\to\infty$에서 0으로 가므로, 주어진 $\varepsilon,\delta$에 대해 우변 $\le\varepsilon$이 되는 $m^{\mathrm{UC}}(\varepsilon,\delta)$가 존재하고 이것은 $\cD$와 무관합니다 — 균등수렴.`,
    note: R`6⇒1에서 쓴 상한은 $1/\delta$ 의존이라 표본 수가 거칠지만 **존재**를 보이는 데는 충분합니다. 정량적 형태 $C(d+\ln(1/\delta))/\varepsilon^2$은 교재 28장의 정교한 논증에서 나옵니다.` },
  // ───── 06
  { ch: 'ch06', id: 'characterize', title: '비균등 학습가능성 ⇔ 불가지 PAC 클래스의 가산 합집합', keys: ['비균등 학습가능성의 특징'], src: '강의 노트 · Theorem 7.2–7.3',
    tags: 'nonuniform learnability characterization countable union theorem 7.2 7.3 비균등 가산 합집합',
    stmt: R`이진 분류의 $\cH$가 비균등 학습가능할 필요충분조건은 불가지 PAC 학습가능한 $\cH_n$들로 $\cH=\bigcup_{n\in\mathbb N}\cH_n$이라 쓸 수 있는 것이다.`,
    body: R`
**(⇐, 정리 7.3).** 각 $\cH_n$이 불가지 PAC 학습가능하면 기본 정리로 균등수렴합니다. 그러면 SRM이 비균등 학습기입니다(“SRM의 비균등 학습 보장”).

**(⇒).** $A$와 $m^{\mathrm{NUL}}$이 있다고 합시다. $\varepsilon_0=\tfrac1{10}$, $\delta_0=\tfrac18$로 두고
$$\cH_n:=\{h\in\cH:m^{\mathrm{NUL}}(\varepsilon_0,\delta_0,h)\le n\}.$$
*합집합.* 모든 $h$에서 $m^{\mathrm{NUL}}(\varepsilon_0,\delta_0,h)$는 자연수이므로 어떤 $n$에 대해 $h\in\cH_n$.

*각 $\cH_n$의 VC 차원이 유한.* 아니라면 $\cH_n$은 크기 $2n$인 집합 $C$를 분쇄합니다. “VC 차원이 무한이면 PAC 학습 불가”의 증명에서, 학습기 $A$와 표본 수 $n$에 대해 $\cH_n$으로 실현가능한 $\cD$(어떤 $h^\star\in\cH_n$에서 $L_\cD(h^\star)=0$)가 있어 $\Prob[L_\cD(A(S))\ge\tfrac18]\ge\tfrac17$. 한편 $h^\star\in\cH_n$이라 $n\ge m^{\mathrm{NUL}}(\varepsilon_0,\delta_0,h^\star)$이고, 비균등 보장으로 $\Prob[L_\cD(A(S))\le0+\tfrac1{10}]\ge\tfrac78$, 즉 $\Prob[L_\cD(A(S))>\tfrac1{10}]\le\tfrac18$. 그런데 $\{L\ge\tfrac18\}\subseteq\{L>\tfrac1{10}\}$이므로 $\tfrac17\le\tfrac18$ — 모순.

그러므로 $\VC(\cH_n)<\infty$이고 기본 정리로 $\cH_n$은 불가지 PAC 학습가능합니다.`,
    note: R`강의 노트와 교재는 $\varepsilon_0=\tfrac18$, $\delta_0=\tfrac17$로 $\cH_n$을 정의합니다. 그러면 공짜 점심의 “확률 $\ge\tfrac17$로 $L\ge\tfrac18$”과 보장 “확률 $\ge\tfrac67$로 $L\le\tfrac18$”이 $L=\tfrac18$에서 함께 성립할 수 있어 모순이 엄밀하지 않습니다. 위처럼 두 상수를 조금 작게 잡으면 틈이 닫힙니다.` },
  { ch: 'ch06', id: 'simul', title: 'SRM 동시 상한 (정리 7.4)', keys: ['SRM 동시 상한'], src: '강의 노트 · Theorem 7.4',
    tags: 'SRM simultaneous bound weight function union bound confidence budget theorem 7.4 동시 상한 가중치 신뢰도 예산',
    stmt: R`$\sum_nw(n)\le1$이고 각 $\cH_n$이 균등수렴하면, 모든 $\delta$, $\cD$, $m$에 대해 확률 $1-\delta$ 이상으로 모든 $n$과 $h\in\cH_n$에서 $\lvert L_\cD(h)-L_S(h)\rvert\le\varepsilon_n(m,w(n)\delta)$. 따라서 $L_\cD(h)\le L_S(h)+\min_{n:h\in\cH_n}\varepsilon_n(m,w(n)\delta)$.`,
    body: R`
**1. 한 클래스.** $\delta_n:=w(n)\delta$. $\varepsilon_n(m,\delta_n)=\min\{\varepsilon:m^{\mathrm{UC}}_{\cH_n}(\varepsilon,\delta_n)\le m\}$이므로 $m\ge m^{\mathrm{UC}}_{\cH_n}(\varepsilon_n(m,\delta_n),\delta_n)$. 균등수렴을 $(\varepsilon_n(m,\delta_n),\delta_n)$으로 적용하면
$$\Prob\big[E_n\big]\ge1-\delta_n,\qquad E_n:=\{S:\forall h\in\cH_n,\ \lvert L_\cD(h)-L_S(h)\rvert\le\varepsilon_n(m,\delta_n)\}.$$

**2. 모든 클래스.** $E=\bigcap_nE_n$. 가산 합집합 상한으로
$$\Prob(E^c)=\Prob\Big(\bigcup_nE_n^c\Big)\le\sum_n\Prob(E_n^c)\le\sum_nw(n)\delta\le\delta.$$

**3. 결론.** $E$ 위에서는 모든 $n$과 $h\in\cH_n$에서 부등식이 동시에 성립합니다. $h\in\cH$는 적어도 하나의 $\cH_n$에 속하고, 속하는 모든 $n$에서 $L_\cD(h)\le L_S(h)+\varepsilon_n(m,w(n)\delta)$이므로 그중 최솟값으로 바꿔도 됩니다.`,
    note: R`$\varepsilon_n$의 정의에서 min이 달성되지 않으면 inf로 쓰고 $\eta>0$만큼 여유를 둔 뒤 $\eta\to0$으로 보내면 됩니다. 노트도 이 점을 “harmless”로 넘깁니다. 핵심은 한 줄: **실패 확률 예산 $\delta$를 클래스마다 $w(n)\delta$씩 나눠 쓴다.**` },
  { ch: 'ch06', id: 'srmNUL', title: 'SRM은 비균등 학습기이다 (정리 7.5)', keys: ['SRM의 비균등 학습 보장'], src: '강의 노트 · Theorem 7.5',
    tags: 'structural risk minimization nonuniform learner rate theorem 7.5 구조적 위험 최소화 비균등',
    stmt: R`$w(n)=\frac6{\pi^2n^2}$이면 SRM은 $\cH=\bigcup_n\cH_n$의 비균등 학습기이고 $m^{\mathrm{NUL}}(\varepsilon,\delta,h)\le m^{\mathrm{UC}}_{\cH_{n(h)}}\big(\frac\varepsilon2,\frac{6\delta}{(\pi n(h))^2}\big)$.`,
    body: R`
$h\in\cH$, $\varepsilon,\delta$, $\cD$를 고정하고 $m\ge m^{\mathrm{UC}}_{\cH_{n(h)}}(\varepsilon/2,w(n(h))\delta)$라 합시다. 간단히 $\varepsilon_{n}:=\varepsilon_n(m,w(n)\delta)$.

**1. 비교 대상의 벌점.** $m\ge m^{\mathrm{UC}}_{\cH_{n(h)}}(\varepsilon/2,w(n(h))\delta)$이므로 $\varepsilon/2$는 $\varepsilon_{n(h)}$의 정의에 나오는 집합에 속하고, 최솟값인 $\varepsilon_{n(h)}\le\varepsilon/2$.

**2. 동시 상한의 사건 $E$** (확률 $\ge1-\delta$) 위에서, 출력 $A(S)$에 대해 $L_\cD(A(S))\le L_S(A(S))+\varepsilon_{n(A(S))}$.

**3. SRM의 정의.** $L_S(A(S))+\varepsilon_{n(A(S))}\le L_S(h)+\varepsilon_{n(h)}$.

**4. 비교 대상에 동시 상한을 다시.** $E$ 위에서 $h\in\cH_{n(h)}$이므로 $L_S(h)\le L_\cD(h)+\varepsilon_{n(h)}$.

**5. 합치기.** $L_\cD(A(S))\le L_\cD(h)+2\varepsilon_{n(h)}\le L_\cD(h)+\varepsilon$ ($E$ 위, 1 사용). $\Prob(E)\ge1-\delta$이므로 결론. $w(n(h))\delta=\frac{6\delta}{\pi^2n(h)^2}=\frac{6\delta}{(\pi n(h))^2}$.`,
    note: R`불가지 PAC의 “$\varepsilon/2$ 두 번”과 구조가 같습니다. 다른 점은 벌점이 클래스마다 달라, 출력 쪽 벌점 $\varepsilon_{n(A(S))}$은 SRM 정의로 **비교 대상 쪽 벌점으로 바뀌어** 사라진다는 것입니다. 그래서 표본 수가 $h$의 클래스 $n(h)$에만 기댑니다.` },
  { ch: 'ch06', id: 'polyVC', title: '다항식 부호 분류기의 VC 차원은 n+1', keys: ['다항식 분류기의 VC 차원'], src: '강의 노트 · 7장 예',
    tags: 'polynomial classifiers VC dimension interpolation intermediate value theorem roots 다항식 보간 중간값 정리 근',
    stmt: R`$\cH_n=\{\sign(p(x)):\deg p\le n\}$ ($\cX=\mathbb R$)이면 $\VC(\cH_n)=n+1$, $\VC(\bigcup_n\cH_n)=\infty$.`,
    body: R`
**하한.** $x_1<\dots<x_{n+1}$과 $y_i\in\{\pm1\}$. 라그랑주 보간 다항식 $p(x)=\sum_iy_i\prod_{j\ne i}\frac{x-x_j}{x_i-x_j}$는 차수 $\le n$이고 $p(x_i)=y_i$. $y_i\ne0$이라 $\sign(p(x_i))=y_i$. 모든 레이블링이 실현되므로 분쇄.

**상한.** $x_1<\dots<x_{n+2}$에 $y_i=(-1)^{i+1}$(번갈아)을 준다고 합시다. 실현하는 $p$가 있다면 $p(x_i)$와 $p(x_{i+1})$의 부호가 반대이고 둘 다 0이 아니므로(부호가 $\pm1$로 정해졌으니), 중간값 정리로 $z_i\in(x_i,x_{i+1})$에서 $p(z_i)=0$ ($i=1,\dots,n+1$). 구간들이 서로소라 $z_i$는 서로 다른 $n+1$개의 근. 차수 $\le n$인 **0이 아닌** 다항식은 근이 $n$개 이하이므로 $p\equiv0$. 그런데 $p\equiv0$이면 모든 $\sign(p(x_i))$가 같은 값(관례상 $+1$ 또는 0)이라 번갈아 가는 레이블을 줄 수 없습니다. 모순이므로 어떤 $n+2$개 점도 분쇄되지 않습니다.

**합집합.** 임의의 $m$에서 $\cH_{m-1}\subseteq\cH$가 $m$개 점을 분쇄하므로 $\VC(\cH)\ge m$. 따라서 $\infty$.`,
    note: R`결론: $\cH$는 PAC 학습가능하지 않지만(기본 정리), 각 $\cH_n$이 VC 유한이라 비균등 학습가능합니다. 상한 증명에서 “$p(x_i)\ne0$”이 쓰이는 곳을 놓치지 마세요 — 부호가 바뀌어도 한쪽이 0이면 열린 구간 안의 근이 보장되지 않습니다.` },
  { ch: 'ch06', id: 'countableSRM', title: '가산 클래스의 SRM 규칙 유도', keys: ['가산 클래스의 SRM 규칙'], src: '강의 노트 · 7.3',
    tags: 'countable class singleton Hoeffding SRM rule weight prior 가산 클래스 한원소 가중치',
    stmt: R`가산 $\cH$와 $\sum_hw(h)\le1$에 대해 확률 $1-\delta$ 이상으로 모든 $h$에서 $L_\cD(h)\le L_S(h)+\sqrt{\frac{-\ln w(h)+\ln(2/\delta)}{2m}}$.`,
    body: R`
**1. 한원소 클래스의 균등수렴.** $\{h\}$에서 균등수렴은 한 가설의 집중입니다. $Z_i=\one[h(x_i)\ne y_i]\in\{0,1\}$, $\E Z_i=L_\cD(h)$, 평균이 $L_S(h)$이므로 호프딩으로 $\Prob(\lvert L_S(h)-L_\cD(h)\rvert>\varepsilon)\le2e^{-2m\varepsilon^2}$. $2e^{-2m\varepsilon^2}\le\delta\iff m\ge\frac{\ln(2/\delta)}{2\varepsilon^2}$이므로 $m^{\mathrm{UC}}_{\{h\}}(\varepsilon,\delta)=\lceil\frac{\ln(2/\delta)}{2\varepsilon^2}\rceil$.

**2. 오차 반지름.** $\varepsilon_n(m,\delta)=\min\{\varepsilon:\frac{\ln(2/\delta)}{2\varepsilon^2}\le m\}=\sqrt{\frac{\ln(2/\delta)}{2m}}$ (올림은 무시).

**3. 가산 합집합.** $\cH=\{h_1,h_2,\dots\}$, $\cH_n=\{h_n\}$, $w(n):=w(h_n)$. SRM 동시 상한에 $\delta\to w(n)\delta$를 넣으면
$$\varepsilon_n(m,w(n)\delta)=\sqrt{\frac{\ln\frac2{w(n)\delta}}{2m}}=\sqrt{\frac{-\ln w(n)+\ln(2/\delta)}{2m}}.$$
동시 상한이 확률 $1-\delta$로 모든 $n$에서 성립하므로 결론이고, SRM 규칙은 $\argmin_h\big[L_S(h)+\sqrt{(-\ln w(h)+\ln(2/\delta))/(2m)}\big]$.`,
    note: R`$w(h)$는 가설에 대한 **사전 선호**처럼 작동합니다. 가중치가 크면 $-\ln w(h)$가 작아 벌점이 작습니다. 확률론의 사전분포와 모양이 같지만, 여기서는 믿음이 아니라 “신뢰도 예산의 배분”이라 틀려도 보장이 깨지지 않고 표본만 더 듭니다.` },
  { ch: 'ch06', id: 'kraft', title: '크래프트 부등식', keys: ['크래프트 부등식'], src: '강의 노트 · Lemma 7.6',
    tags: 'Kraft inequality prefix-free code coin tossing cylinder event 크래프트 접두사 없는 부호 동전',
    stmt: R`$S\subseteq\{0,1\}^\ast$가 접두사 없는 집합이면 $\sum_{\sigma\in S}2^{-\lvert\sigma\rvert}\le1$.`,
    body: R`
공정한 동전을 독립으로 무한히 던져 $\omega=(\omega_1,\omega_2,\dots)$를 얻는다고 합시다. 유한 문자열 $\sigma=(\sigma_1,\dots,\sigma_k)$마다 원기둥 사건
$$A_\sigma=\{\omega:\omega_1=\sigma_1,\dots,\omega_k=\sigma_k\}$$
을 정의하면 독립성으로 $\Prob(A_\sigma)=2^{-k}=2^{-\lvert\sigma\rvert}$.

$\sigma\ne\sigma'\in S$이고 $\omega\in A_\sigma\cap A_{\sigma'}$라면 $\omega$가 두 문자열로 모두 시작하므로 짧은 쪽이 긴 쪽의 접두사입니다(길이가 같으면 같은 문자열). 접두사 없음에 모순이므로 $A_\sigma$들은 서로소입니다. $S$는 가산이므로 가산 가법성으로
$$\sum_{\sigma\in S}2^{-\lvert\sigma\rvert}=\sum_{\sigma\in S}\Prob(A_\sigma)=\Prob\Big(\bigcup_{\sigma\in S}A_\sigma\Big)\le1.$$`,
    note: R`접두사 없음이 빠지면 원기둥이 겹쳐 합이 1을 넘을 수 있습니다. 예: $\{0,1,00\}$은 $\frac12+\frac12+\frac14>1$ ($A_{00}\subseteq A_0$). 접두사 없는 설명은 “끝이 어디인지 따로 표시하지 않아도 읽을 수 있는” 설명입니다.` },
  { ch: 'ch06', id: 'occam', title: '오컴 상한 (정리 7.7)', keys: ['오컴 상한'], src: '강의 노트 · Theorem 7.7',
    tags: 'Occam razor MDL minimum description length bound theorem 7.7 오컴의 면도날 최소 기술 길이',
    stmt: R`접두사 없는 설명 언어 $d:\cH\to\{0,1\}^\ast$에 대해, 확률 $1-\delta$ 이상으로 모든 $h$에서 $L_\cD(h)\le L_S(h)+\sqrt{\frac{\lvert h\rvert+\ln(2/\delta)}{2m}}$.`,
    body: R`
**1. 가중치.** $w(h)=2^{-\lvert h\rvert}$. $d(\cH)$가 접두사 없는 집합이므로 크래프트로 $\sum_hw(h)=\sum_h2^{-\lvert d(h)\rvert}\le1$. ($d$가 단사가 아니면 같은 설명을 가진 가설들은 같은 $h$로 보아도 되고, 합은 오히려 줄어듭니다.)

**2. 가산 클래스 상한.** $\cH$는 $\{0,1\}^\ast$로의 단사가 있어 가산이고, 가중 상한으로 확률 $1-\delta$ 이상 모든 $h$에서
$$L_\cD(h)\le L_S(h)+\sqrt{\frac{-\ln w(h)+\ln(2/\delta)}{2m}}.$$

**3. 대입.** $-\ln w(h)=\lvert h\rvert\ln2\le\lvert h\rvert$ ($\ln2\approx0.693<1$). 제곱근이 증가함수이므로 결론.`,
    note: R`같은 경험적 위험이면 설명이 짧은 가설의 참 위험 상한이 작습니다. 이것이 오컴의 면도날을 “짧은 설명이 옳을 가능성이 높다”가 아니라 “짧은 설명은 **과적합했을 가능성이 낮다**”로 읽는 학습 이론의 방식입니다. 언어를 바꾸면 길이도 바뀌므로, 무엇이 “단순한가”는 표본을 보기 전에 정한 언어(사전 지식)에 달려 있습니다.` },
  );
})();
