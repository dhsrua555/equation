/* 03 균등수렴으로 배우기 — UML 4장, 강의 노트 “A Proof of Agnostic PAC Learnability for Finite Hypothesis Classes” (Def 3.4, Cor 4.6) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 3, part: 'A', title: '균등수렴과 호프딩 부등식', en: 'Learning via Uniform Convergence', ref: 'UML 4장', plot: 'hoeffding',
    fig: R`표본 수 m이 2, 4, 8, …, 128일 때 호프딩 상한 2exp(−2mt²). 표본이 늘수록 꼬리가 빠르게 얇아집니다`,
    tagline: R`모든 가설에서 동시에 훈련 오차가 참 오차에 가까우면, 훈련 오차를 최소로 하는 것이 곧 참 오차를 최소로 하는 것이 됩니다.`,
    summary: R`불가지 설정에서 ERM이 성공하는 조건을 찾습니다. 표본 $S$가 **$\varepsilon$-대표**, 즉 모든 $h\in\cH$에서 $\lvert L_S(h)-L_\cD(h)\rvert\le\varepsilon$이면 ERM의 출력은 클래스 최선보다 $2\varepsilon$ 이상 나쁘지 않습니다. 이런 표본이 높은 확률로 나오는 성질이 **균등수렴**이고, 균등수렴하는 클래스는 ERM으로 불가지 PAC 학습가능합니다. 고정된 가설 하나의 경험적 위험은 **호프딩 부등식**으로 집중하고, 합집합 상한으로 유한 클래스 전체에 넓히면 $m\ge2\ln(2\lvert\cH\rvert/\delta)/\varepsilon^2$에서 불가지 PAC 보장이 나옵니다. 강의 노트는 이 증명을 가정 네 개(i.i.d., 가측성, 유계 손실, 동점 규칙)와 네 단계로 정리했습니다.`,
    goals: [
      R`$\varepsilon$-대표 표본과 균등수렴 성질을 정의하고, 불가지 PAC 정의와의 차이를 설명할 수 있다`,
      R`$\varepsilon/2$-대표 표본에서 ERM이 $\min L_\cD+\varepsilon$ 이내임을 세 줄의 부등식으로 보일 수 있다`,
      R`마르코프 부등식과 호프딩 보조정리로 호프딩 부등식을 증명할 수 있다`,
      R`유한 클래스의 균등수렴 표본 복잡도 $\lceil\ln(2\lvert\cH\rvert/\delta)/(2\varepsilon^2)\rceil$과 불가지 PAC 표본 복잡도를 유도할 수 있다`,
      R`이산화 기법으로 $d$개의 실수 모수를 가진 클래스의 표본 수를 어림할 수 있다`,
    ],
    secTitles: { '4.1': 'ε-대표 표본', '4.1b': '균등수렴', '4.2': '호프딩 부등식', '4.2b': '유한 클래스', '4.2c': '이산화 기법' },
    sections: [
      { k: '4.1', p: 54, title: 'ε-대표 표본과 ERM', body: R`
ERM은 $L_S$를 최소로 합니다. 이것이 $L_\cD$를 최소로 하는 것과 거의 같으려면, 모든 가설에서 두 위험이 가까워야 합니다.

:::def ε-대표 표본
영역 $\cZ$, 가설 클래스 $\cH$, 손실 $\ell$, 분포 $\cD$에 대해 표본 $S$가 **$\varepsilon$-대표**(ε-representative)라는 것은
$$\forall h\in\cH,\qquad\lvert L_S(h)-L_\cD(h)\rvert\le\varepsilon.$$
:::

:::key 대표 표본 보조정리
$S$가 $\tfrac\varepsilon2$-대표이면, $\ERM_\cH(S)$의 모든 출력 $h_S$는
$$L_\cD(h_S)\le\min_{h\in\cH}L_\cD(h)+\varepsilon.$$
:::

증명은 세 번의 비교입니다. 임의의 $h\in\cH$에 대해
$$L_\cD(h_S)\le L_S(h_S)+\tfrac\varepsilon2\le L_S(h)+\tfrac\varepsilon2\le L_\cD(h)+\tfrac\varepsilon2+\tfrac\varepsilon2.$$
첫째와 셋째는 대표성, 가운데는 ERM의 정의입니다. $h$가 임의이므로 최솟값에 대해서도 성립합니다.

:::tip 두 번 쓰이는 대표성
대표성은 **$h_S$에서 한 번**(참 위험을 경험적 위험으로 누르기), **비교 대상 $h$에서 한 번**(경험적 위험을 참 위험으로 되돌리기) 쓰입니다. 그래서 $\varepsilon/2$씩 두 번, 합이 $\varepsilon$입니다. $h_S$는 표본에 따라 고른 가설이므로 “고정된 가설 하나의 집중”으로는 첫 번째 비교를 할 수 없고, 모든 가설에서 동시에 성립하는 대표성이 필요합니다.
:::
` },
      { k: '4.1b', p: 55, title: '균등수렴 성질', body: R`
:::def 균등수렴
$\cH$가 (영역 $\cZ$와 손실 $\ell$에 대해) **균등수렴 성질**을 가진다는 것은 함수 $m^{\mathrm{UC}}_\cH:(0,1)^2\to\mathbb N$이 있어, 모든 $\varepsilon,\delta\in(0,1)$와 $\cZ$ 위의 모든 분포 $\cD$에 대해 $m\ge m^{\mathrm{UC}}_\cH(\varepsilon,\delta)$이면 확률 $1-\delta$ 이상으로 $S\sim\cD^m$이 $\varepsilon$-대표인 것이다.
:::

“균등”은 두 가지를 뜻합니다: 클래스의 **모든 가설에서 동시에**, 그리고 **모든 분포에 대해 같은 표본 수로**.

:::key 균등수렴이면 ERM으로 불가지 PAC 학습가능
$\cH$가 $m^{\mathrm{UC}}_\cH$로 균등수렴하면 $\cH$는 불가지 PAC 학습가능하고
$$m_\cH(\varepsilon,\delta)\le m^{\mathrm{UC}}_\cH(\varepsilon/2,\delta).$$
이때 $\ERM_\cH$가 성공하는 학습기이다.
:::

$m\ge m^{\mathrm{UC}}_\cH(\varepsilon/2,\delta)$이면 확률 $1-\delta$ 이상으로 표본이 $\varepsilon/2$-대표이고, 그 사건 위에서 대표 표본 보조정리가 성립하기 때문입니다.

:::note 해석학의 균등수렴과 이름만 같습니다
기초 수학의 균등수렴은 함수열 $f_n\to f$가 모든 $x$에서 같은 속도로 수렴하는 것입니다[[@base:ch05:5.3|$\sup_x\lvert f_n(x)-f(x)\rvert\to0$.]]. 학습 이론의 균등수렴도 “$\sup_{h\in\cH}\lvert L_S(h)-L_\cD(h)\rvert$가 작다”는 sup 조건이라 모양이 닮았지만, 여기서는 표본이 무작위라 **확률적으로** 작다는 명제입니다.
:::
` },
      { k: '4.2', p: 56, title: '측도 집중: 호프딩 부등식', body: R`
고정된 가설 $h$에 대해 $\theta_i=\ell(h,z_i)$로 두면 $L_S(h)=\frac1m\sum\theta_i$는 i.i.d. 확률변수의 평균이고 $\E[\theta_i]=L_\cD(h)$입니다. 큰 수의 법칙은 평균이 기댓값으로 간다고만 말하므로, 유한한 $m$에서의 **속도**가 필요합니다.

:::key 호프딩 부등식
$\theta_1,\dots,\theta_m$이 i.i.d.이고 $\E[\theta_i]=\mu$, $\Prob[a\le\theta_i\le b]=1$이면 모든 $\varepsilon>0$에 대해
$$\Prob\left[\left\lvert\frac1m\sum_{i=1}^m\theta_i-\mu\right\rvert>\varepsilon\right]\le2\exp\!\left(-\frac{2m\varepsilon^2}{(b-a)^2}\right).$$
:::

증명의 뼈대(교재 부록 B):
1. **마르코프 부등식** — $Z\ge0$이면 $\Prob[Z\ge a]\le\E[Z]/a$.
2. **체르노프 기법** — $\lambda>0$에 대해 $\Prob[\bar X\ge\varepsilon]=\Prob[e^{\lambda m\bar X}\ge e^{\lambda m\varepsilon}]\le e^{-\lambda m\varepsilon}\prod_i\E[e^{\lambda X_i}]$ (독립성으로 곱이 됨, $X_i=\theta_i-\mu$).
3. **호프딩 보조정리** — $\E X=0$, $X\in[a,b]$이면 $\E[e^{\lambda X}]\le e^{\lambda^2(b-a)^2/8}$.
4. 합치면 $e^{-\lambda m\varepsilon+m\lambda^2(b-a)^2/8}$, $\lambda=4\varepsilon/(b-a)^2$에서 최소 $e^{-2m\varepsilon^2/(b-a)^2}$. 반대쪽 꼬리도 같아서 2배.

:::ex 예제 1
손실이 $[0,1]$ 값이고 $m=500$, $\varepsilon=0.05$일 때 고정된 가설의 경험적 위험이 참 위험에서 $0.05$ 넘게 벗어날 확률의 상한은?
---
$2e^{-2\cdot500\cdot0.0025}=2e^{-2.5}\approx0.164$. 한 가설만 봐도 16% 정도는 벗어날 수 있다는 뜻이라, 가설이 많으면 합집합 상한으로 이 값이 곱해집니다.
:::
` },
      { k: '4.2b', p: 55, src: '강의 노트 · Def 3.4, Cor 4.6', title: '유한 클래스는 불가지 PAC 학습가능하다', body: R`
강의 노트는 먼저 가정을 명시합니다.

:::def 강의 노트의 가정
1. **i.i.d.**: $S=(z_1,\dots,z_m)\sim\cD^m$.
2. **가측성**: 각 $h$에 대해 $z\mapsto\ell(h,z)$가 가측이라 $L_\cD(h)$가 잘 정의된다.
3. **유계 손실**: 모든 $(h,z)$에서 $0\le\ell(h,z)\le1$.
4. **ERM과 동점 규칙**: $\hat h(S)\in\argmin_{h\in\cH}L_S(h)$, 동점은 고정된 열거 순서로 깬다.
:::

:::key 유한 클래스의 불가지 PAC 학습가능성
$\cH$가 유한하고 손실이 $[0,1]$ 값이면
$$m^{\mathrm{UC}}_\cH(\varepsilon,\delta)\le\left\lceil\frac{\ln(2\lvert\cH\rvert/\delta)}{2\varepsilon^2}\right\rceil,\qquad m_\cH(\varepsilon,\delta)\le m^{\mathrm{UC}}_\cH(\varepsilon/2,\delta)\le\left\lceil\frac{2\ln(2\lvert\cH\rvert/\delta)}{\varepsilon^2}\right\rceil.$$
:::

:::hand 강의 노트 — 네 단계
**1단계 (한 가설의 집중).** $X_i=\ell(h,z_i)\in[0,1]$에 호프딩: $\Prob(\lvert L_S(h)-L_\cD(h)\rvert\ge t)\le2e^{-2mt^2}$.

**2단계 (합집합 상한).** 사건 $\mathcal E_t=\{S:\sup_h\lvert L_S(h)-L_\cD(h)\rvert<t\}$의 여사건은 “어떤 $h$에서 벗어남”이므로 $\Prob(\mathcal E_t^c)\le\sum_h2e^{-2mt^2}=2\lvert\cH\rvert e^{-2mt^2}$.

**3단계 ($t=\varepsilon/2$에서 ERM).** $\mathcal E_{\varepsilon/2}$ 위에서 $h^\star\in\argmin L_\cD$에 대해 $L_\cD(\hat h)\le L_S(\hat h)+\tfrac\varepsilon2\le L_S(h^\star)+\tfrac\varepsilon2\le L_\cD(h^\star)+\varepsilon$. ($\cH$가 유한하므로 $h^\star$가 존재.)

**4단계.** $m\ge2\ln(2\lvert\cH\rvert/\delta)/\varepsilon^2$이면 $2\lvert\cH\rvert e^{-m\varepsilon^2/2}\le\delta$이므로 $\Prob(\mathcal E_{\varepsilon/2})\ge1-\delta$.
:::

:::warn 실현가능 설정과의 차이
실현가능: $m\sim\ln(\lvert\cH\rvert/\delta)/\varepsilon$. 불가지: $m\sim\ln(\lvert\cH\rvert/\delta)/\varepsilon^2$. 정확도를 10배 높이면 실현가능 설정은 표본 10배, 불가지 설정은 100배가 필요합니다. 잡음 속에서 평균을 정확히 재는 비용이 $1/\varepsilon^2$입니다.
:::
` },
      { k: '4.2c', p: 57, title: '이산화 기법: 실수 모수의 어림', body: R`
유한 클래스 정리는 무한 클래스에 바로 쓸 수 없습니다. 하지만 컴퓨터는 실수를 64비트 부동소수점으로 저장합니다. 실수 모수가 $d$개인 클래스는 실제로는 크기가 $2^{64d}$ 이하인 유한 클래스입니다.

:::key 이산화 기법의 표본 수
모수가 64비트 수 $d$개인 클래스는 손실이 $[0,1]$ 값일 때
$$m_\cH(\varepsilon,\delta)\le\frac{128d+2\ln(2/\delta)}{\varepsilon^2}.$$
:::

유한 클래스 식에 $\lvert\cH\rvert=2^{64d}$를 넣으면 $\frac{2\ln(2\cdot2^{64d}/\delta)}{\varepsilon^2}=\frac{2(64d\ln2+\ln(2/\delta))}{\varepsilon^2}$이고, $\ln2<1$이므로 위 상한이 됩니다.

:::ex 예제 2
모수 10개, $\varepsilon=0.1$, $\delta=0.01$이면?
---
$\frac{1280+2\ln200}{0.01}=\frac{1280+10.6}{0.01}\approx129{,}060$. 모수 개수에 **선형**으로 비례한다는 모양은 옳지만, 상한이 저장 방식(비트 수)에 기대는 것이 흠입니다. 이 흠을 없애는 것이 VC 차원(5단원)입니다.
:::
` },
    ],
    problems: [
      { sec: '4.1', type: 'mc', lv: 1, q: R`표본 $S$가 $\varepsilon$-대표라는 것의 정의는?`,
        choices: [R`$\lvert L_S(h_S)-L_\cD(h_S)\rvert\le\varepsilon$`, R`모든 $h\in\cH$에 대해 $\lvert L_S(h)-L_\cD(h)\rvert\le\varepsilon$`, R`$L_S(h_S)\le\varepsilon$`, R`$\E_S[L_S(h)]=L_\cD(h)$`], ans: 1,
        sol: R`클래스 전체에서 동시에 성립하는 조건입니다. ERM의 출력 하나에서만 가까운 것으로는 대표 표본 보조정리의 “비교 대상 $h$” 쪽을 쓸 수 없습니다.` },
      { sec: '4.1', type: 'num', lv: 2, q: R`$S$가 $0.03$-대표일 때, ERM 출력의 참 위험이 $\min_hL_\cD(h)$보다 최대 얼마까지 클 수 있다고 보장되나?`, ans: '0.06', ansTex: R`2\times0.03`,
        sol: R`$\varepsilon/2=0.03$이므로 $\varepsilon=0.06$. 대표성을 두 번(출력과 비교 대상) 쓰기 때문입니다.` },
      { sec: '4.1b', type: 'mc', lv: 2, q: R`균등수렴 성질과 불가지 PAC 학습가능성의 관계로 옳은 것은?`,
        choices: [R`균등수렴이면 ERM으로 불가지 PAC 학습가능하고 $m_\cH(\varepsilon,\delta)\le m^{\mathrm{UC}}_\cH(\varepsilon/2,\delta)$`, R`불가지 PAC이면 균등수렴은 성립할 수 없다`, R`균등수렴이면 $m_\cH(\varepsilon,\delta)\le m^{\mathrm{UC}}_\cH(2\varepsilon,\delta)$`, R`두 성질은 무관하다`], ans: 0,
        sol: R`$\varepsilon/2$-대표이면 ERM이 $\varepsilon$ 이내이므로 $\varepsilon/2$에서의 균등수렴 표본 수면 충분합니다. (이진 분류에서는 역도 성립한다는 것이 5단원의 기본 정리입니다.)` },
      { sec: '4.2', type: 'num', lv: 1, q: R`$[0,1]$ 값 i.i.d. 변수 $m=200$개의 평균이 기댓값에서 $0.1$ 넘게 벗어날 확률의 호프딩 상한은? (소수 넷째 자리)`, ans: '2*e^(-4)', ansTex: R`2e^{-4}\approx0.0366`,
        sol: R`$2\exp(-2\cdot200\cdot0.01)=2e^{-4}\approx0.0366$.` },
      { sec: '4.2', type: 'num', lv: 2, q: R`값이 $[-1,1]$인 i.i.d. 변수 $m=400$개에서 $\varepsilon=0.1$일 때 호프딩 상한은? (소수 넷째 자리)`, ans: '2*e^(-2)', ansTex: R`2e^{-2}\approx0.2707`,
        sol: R`$(b-a)^2=4$이므로 $2\exp(-2\cdot400\cdot0.01/4)=2e^{-2}\approx0.2707$. 구간 폭이 두 배면 지수가 1/4이 됩니다.` },
      { sec: '4.2', type: 'mc', lv: 2, q: R`호프딩 부등식의 증명에서 곱 $\prod_i\E[e^{\lambda X_i}]$가 나오는 이유는?`,
        choices: [R`마르코프 부등식`, R`$X_i$들의 독립성`, R`젠센 부등식`, R`$X_i$의 유계성`], ans: 1,
        sol: R`$\E[e^{\lambda\sum X_i}]=\E[\prod e^{\lambda X_i}]=\prod\E[e^{\lambda X_i}]$는 독립성에서 옵니다. 유계성은 각 인수를 누르는 호프딩 보조정리에 쓰입니다.` },
      { sec: '4.2b', type: 'num', lv: 2, q: R`$\lvert\cH\rvert=100$, 손실 $[0,1]$, $\varepsilon=0.1$, $\delta=0.05$일 때 불가지 PAC 상한 $\lceil2\ln(2\lvert\cH\rvert/\delta)/\varepsilon^2\rceil$은?`, ans: '1659', ansTex: R`\lceil200\ln4000\rceil=1659`,
        sol: R`$\ln(200/0.05)=\ln4000=8.294$. $2\times8.294/0.01=1658.8$이므로 1659.` },
      { sec: '4.2b', type: 'num', lv: 2, q: R`같은 $\lvert\cH\rvert$, $\delta$에서 균등수렴 표본 수 $\lceil\ln(2\lvert\cH\rvert/\delta)/(2\varepsilon^2)\rceil$을 $\varepsilon=0.05$로 구하면? ($\lvert\cH\rvert=100$, $\delta=0.05$)`, ans: '1659', ansTex: R`\lceil\ln4000/0.005\rceil=1659`,
        sol: R`$8.294/(2\cdot0.0025)=1658.8$. 앞 문제와 같은 값인 것은 우연이 아닙니다: $m_\cH(\varepsilon,\delta)\le m^{\mathrm{UC}}(\varepsilon/2,\delta)$이고 $\varepsilon/2=0.05$.` },
      { sec: '4.2b', type: 'mc', lv: 3, q: R`강의 노트의 3단계에서 $h^\star\in\argmin_{h\in\cH}L_\cD(h)$가 존재한다고 쓸 수 있는 이유는?`,
        choices: [R`손실이 유계이므로`, R`$\cH$가 유한하므로 최솟값이 달성된다`, R`표본이 대표이므로`, R`ERM의 동점 규칙 때문에`], ans: 1,
        sol: R`유한 집합 위의 함수는 최솟값을 가집니다. 무한 클래스라면 하한(inf)만 있을 수 있고, 그때는 $L_\cD(h)\le\inf+\eta$인 $h$로 같은 논증을 하고 $\eta\to0$으로 보냅니다.` },
      { sec: '4.2c', type: 'num', lv: 1, q: R`이산화 기법으로 모수 $d=5$, $\varepsilon=0.2$, $\delta=0.1$일 때 상한 $(128d+2\ln(2/\delta))/\varepsilon^2$은? (정수로)`, ans: '(640+2*ln(20))/0.04', ansTex: R`\approx16150`,
        sol: R`$2\ln20=5.99$. $(640+5.99)/0.04\approx16150$.` },
      { sec: '4.2', type: 'open', lv: 3, proof: true, q: R`호프딩 보조정리 “$\E X=0$, $a\le X\le b$이면 $\E[e^{\lambda X}]\le e^{\lambda^2(b-a)^2/8}$”를 가정하고, i.i.d. $\theta_i\in[a,b]$에 대한 호프딩 부등식을 증명하세요.`,
        sol: R`
$X_i=\theta_i-\mu$, $\bar X=\frac1m\sum X_i$. $X_i\in[a-\mu,b-\mu]$, 폭 $b-a$, $\E X_i=0$.
$\lambda>0$에 대해 $e^{\lambda m x}$는 증가함수이므로 마르코프 부등식으로
$$\Prob[\bar X\ge\varepsilon]=\Prob[e^{\lambda m\bar X}\ge e^{\lambda m\varepsilon}]\le e^{-\lambda m\varepsilon}\E\big[e^{\lambda\sum X_i}\big]=e^{-\lambda m\varepsilon}\prod_i\E[e^{\lambda X_i}]\le e^{-\lambda m\varepsilon+m\lambda^2(b-a)^2/8}.$$
지수 $-\lambda m\varepsilon+m\lambda^2(b-a)^2/8$를 $\lambda$로 최소화: $\lambda=4\varepsilon/(b-a)^2$에서 값 $-2m\varepsilon^2/(b-a)^2$.
$-X_i$에 같은 논증을 하면 $\Prob[\bar X\le-\varepsilon]$도 같은 상한. 합집합 상한으로 $\Prob[\lvert\bar X\rvert\ge\varepsilon]\le2e^{-2m\varepsilon^2/(b-a)^2}$ ($>\varepsilon$이면 더 작은 사건).`,
        rubric: R`
- 중심화와 마르코프 부등식 적용 — 3점
- 독립성으로 곱 분해 — 2점
- 호프딩 보조정리 대입과 $\lambda$ 최적화 — 3점
- 양쪽 꼬리와 인수 2 — 2점` },
      { sec: '4.2b', type: 'open', lv: 2, proof: true, q: R`유한 클래스 $\cH$와 $[0,1]$ 값 손실에서 $m\ge2\ln(2\lvert\cH\rvert/\delta)/\varepsilon^2$이면 확률 $1-\delta$ 이상으로 ERM 출력이 $L_\cD(\hat h)\le\min_hL_\cD(h)+\varepsilon$을 만족함을 증명하세요.`,
        sol: R`
(1) 고정된 $h$에 호프딩: $\Prob(\lvert L_S(h)-L_\cD(h)\rvert\ge t)\le2e^{-2mt^2}$.
(2) 합집합 상한: $\Prob(\exists h:\lvert L_S(h)-L_\cD(h)\rvert\ge t)\le2\lvert\cH\rvert e^{-2mt^2}$.
(3) $t=\varepsilon/2$: 실패 확률 $\le2\lvert\cH\rvert e^{-m\varepsilon^2/2}\le\delta$ ($m$ 조건과 동치).
(4) 좋은 사건 위에서 $h^\star\in\argmin L_\cD$ (유한이라 존재): $L_\cD(\hat h)\le L_S(\hat h)+\tfrac\varepsilon2\le L_S(h^\star)+\tfrac\varepsilon2\le L_\cD(h^\star)+\varepsilon$.`,
        rubric: R`
- 호프딩으로 한 가설의 집중 — 2점
- 합집합 상한 — 2점
- $t=\varepsilon/2$와 $m$ 조건 계산 — 3점
- 좋은 사건 위의 세 부등식 — 3점` },
    ],
  });
})();
