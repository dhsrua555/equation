/* 추가 연습문제 — 02 확률, 가능도, 베이즈 추론. Problem Set 1 문제 2와 같은 유형(유도·증명·편향-분산 계산)을 중심으로 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 2,
    secTitles: { '2.8': '가우시안 MAP·편향-분산' },
    problems: [
      { sec: '2.8', type: 'open', lv: 3, proof: true, q: R`**(Problem Set 1 문제 2)** $X_1,\dots,X_n$이 독립이고 $X_i\sim\N(\theta,1)$ (분산 1은 알고 $\theta$는 모름), 사전분포는 $\theta\sim\N(0,\tau^2)$이다. 기댓값은 $\theta$가 주어졌을 때 $(X_1,\dots,X_n)$의 표본분포에 대해 취한다.
1. $\theta$의 MAP 추정량을 유도하고, 그것이 릿지 문제 $\hat\theta_{\text{MAP}}=\argmin_\theta\sum_{i=1}^n(X_i-\theta)^2+\lambda\theta^2$, $\lambda=1/\tau^2$의 해와 같음을 보이시오.
2. $\hat\theta_{\text{MAP}}=a\bar X$로 쓰고 수축 계수 $a$를 $n,\tau^2$의 함수로 구하시오.
3. 임의의 추정량 $\hat\theta$에 대해 $\E(\hat\theta-\theta)^2=(\E\hat\theta-\theta)^2+\Var(\hat\theta)$를 증명하고, $\hat\theta_{\text{MAP}}$의 편향, 분산, MSE를 구하시오.`,
        sol: R`
**1.** 사후분포 $\propto\prod_i\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}\cdot\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}$. 로그를 취하면
$$\log p(\theta\mid X)=-\frac12\sum_i(X_i-\theta)^2-\frac{\theta^2}{2\tau^2}+C.$$
$\log$는 증가함수, $C$는 $\theta$와 무관하므로 $\argmax\log p(\theta\mid X)=\argmin\big[\sum(X_i-\theta)^2+\theta^2/\tau^2\big]$ ($-2$를 곱함). 이것이 $\lambda=1/\tau^2$인 릿지 문제입니다.
**2.** $g(\theta)=\sum(X_i-\theta)^2+\lambda\theta^2$, $g'(\theta)=-2\sum X_i+2(n+\lambda)\theta$, $g''=2(n+\lambda)>0$. $g'=0$에서 $\hat\theta=\frac{n\bar X}{n+\lambda}$, 따라서 $a=\frac n{n+1/\tau^2}=\frac{n\tau^2}{n\tau^2+1}$.
**3.** $b=\E\hat\theta-\theta$ (상수). $\E(\hat\theta-\theta)^2=\E\big[(\hat\theta-\E\hat\theta)+b\big]^2=\E(\hat\theta-\E\hat\theta)^2+2b\,\E(\hat\theta-\E\hat\theta)+b^2=\Var(\hat\theta)+b^2$ (가운데 항은 0).
$\E\bar X=\theta$, $\Var\bar X=1/n$이므로 편향 $=(a-1)\theta=-\frac{\theta}{n\tau^2+1}$, 분산 $=\frac{a^2}n=\frac{n\tau^4}{(n\tau^2+1)^2}$, $\mathrm{MSE}=\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}$.`,
        rubric: R`
- 로그 사후분포 전개와 상수 제거 — 2점
- 릿지 꼴과 $\lambda=1/\tau^2$ — 2점
- 미분·볼록성 확인·수축 계수 — 2점
- 분해 증명(교차항이 0인 이유 명시) — 2점
- 편향·분산·MSE 계산 — 2점` },
      { sec: '2.8', type: 'num', lv: 1, q: R`위 설정에서 $n=9$, $\tau^2=1/3$, $\bar X=2$일 때 $\hat\theta_{\text{MAP}}$은?`, ans: '1.5', ansTex: R`1.5`,
        sol: R`$a=\frac{9(1/3)}{9(1/3)+1}=\frac34$, $\hat\theta=\frac34\cdot2=1.5$.` },
      { sec: '2.8', type: 'num', lv: 2, q: R`같은 설정($n=9$, $\tau^2=1/3$)에서 참값이 $\theta=1$일 때 $\hat\theta_{\text{MAP}}$의 MSE는?`, ans: '0.125', ansTex: R`\tfrac18`,
        sol: R`$\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}=\frac{1+9/9}{16}=\frac18$. MLE의 MSE는 $1/9\approx0.111$이라 여기서는 MLE가 낫습니다($\theta^2=1>2\tau^2+1/n\approx0.778$).` },
      { sec: '2.8', type: 'open', lv: 3, proof: true, q: R`위 설정에서 $\mathrm{MSE}(\hat\theta_{\text{MAP}})<\mathrm{MSE}(\bar X)$일 필요충분조건이 $\theta^2<2\tau^2+\frac1n$임을 보이세요.`,
        sol: R`
$\mathrm{MSE}(\bar X)=1/n$ (편향 0, 분산 $1/n$). 따라서
$$\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}<\frac1n\iff n\theta^2+n^2\tau^4<(n\tau^2+1)^2=n^2\tau^4+2n\tau^2+1\iff n\theta^2<2n\tau^2+1\iff\theta^2<2\tau^2+\frac1n.$$
(분모가 양수라 곱해도 부등호 방향이 유지됨.) 사전분포가 참값 근처에 무게를 두고 있을수록($\theta^2$이 $\tau^2$에 비해 작을수록) 수축이 이득입니다.`,
        rubric: R`
- 두 MSE의 식 — 3점
- 분모 정리와 전개 — 4점
- 결론과 해석 — 3점` },
      { sec: '2.8', type: 'open', lv: 3, proof: true, q: R`위 설정에서 사후분포 $p(\theta\mid X)$가 가우시안 $\N\big(a\bar X,\ \frac1{n+1/\tau^2}\big)$임을 완전제곱으로 보이고, 이 경우 MAP과 사후평균이 같은 이유를 말하세요.`,
        sol: R`
지수부는 $-\frac12\big[\sum(X_i-\theta)^2+\theta^2/\tau^2\big]=-\frac12\big[(n+\tfrac1{\tau^2})\theta^2-2n\bar X\theta\big]+C$.
$P=n+1/\tau^2$로 두고 완전제곱하면 $-\frac P2\big(\theta-\frac{n\bar X}P\big)^2+C'$. 따라서 $p(\theta\mid X)\propto\exp\big(-\frac{(\theta-m)^2}{2/P}\big)$, $m=\frac{n\bar X}{n+1/\tau^2}=a\bar X$, 분산 $1/P$ — 가우시안입니다(정규화 상수는 $\theta$와 무관하므로 모양만으로 분포가 결정됨).
가우시안은 평균에 대해 대칭인 단봉 분포라 최빈값(MAP) = 평균 = 중앙값입니다.`,
        rubric: R`
- 지수부를 $\theta$의 이차식으로 정리 — 4점
- 완전제곱과 평균·분산 식별 — 4점
- MAP = 사후평균의 이유 — 2점` },
      { sec: '2.8', type: 'num', lv: 2, q: R`$X_i\sim\N(\theta,\sigma^2)$ ($\sigma^2=4$), 사전분포 $\theta\sim\N(\mu_0,\tau^2)$ ($\mu_0=1$, $\tau^2=1$), $n=4$, $\bar X=3$일 때 $\hat\theta_{\text{MAP}}=\dfrac{n\bar X/\sigma^2+\mu_0/\tau^2}{n/\sigma^2+1/\tau^2}$의 값은?`, ans: '2', ansTex: R`2`,
        sol: R`$\frac{4(3)/4+1}{4/4+1}=\frac{3+1}{2}=2$. 사후평균은 “자료 평균”과 “사전 평균”을 각각의 정밀도($n/\sigma^2=1$, $1/\tau^2=1$)로 가중평균한 값입니다.` },
      { sec: '2.8', type: 'mc', lv: 1, q: R`수축 계수 $a=\frac{n\tau^2}{n\tau^2+1}$에 대해 옳은 것은?`,
        choices: [R`$n\to\infty$이면 $a\to0$`, R`$\tau^2\to\infty$이면 MAP이 MLE와 같아진다`, R`$\tau^2$가 작을수록 MAP의 분산이 커진다`, R`MAP은 불편추정량이다`], ans: 1,
        sol: R`$\tau^2\to\infty$ (사전 믿음이 없음)이면 $a\to1$. $n\to\infty$여도 $a\to1$. 분산 $a^2/n$은 $\tau^2$가 작을수록($a$가 작을수록) 작아지고, $\theta\ne0$이면 편향 $-(1-a)\theta\ne0$.` },
      { sec: '2.4', type: 'open', lv: 3, proof: true, q: R`$X_i\sim\N(\mu,\sigma^2)$ i.i.d.일 때 MLE $\hat\sigma^2=\frac1n\sum(X_i-\bar X)^2$가 $\E[\hat\sigma^2]=\frac{n-1}n\sigma^2$을 만족함을 보이세요.`,
        sol: R`
$\sum(X_i-\bar X)^2=\sum X_i^2-n\bar X^2$ (전개하고 $\sum X_i=n\bar X$ 사용). 기댓값:
$\E X_i^2=\Var X_i+(\E X_i)^2=\sigma^2+\mu^2$, $\E\bar X^2=\Var\bar X+\mu^2=\frac{\sigma^2}n+\mu^2$.
$$\E\sum(X_i-\bar X)^2=n(\sigma^2+\mu^2)-n\Big(\frac{\sigma^2}n+\mu^2\Big)=(n-1)\sigma^2.$$
$n$으로 나누면 $\E\hat\sigma^2=\frac{n-1}n\sigma^2$. 편향은 $-\sigma^2/n$이고, $n-1$로 나누면 불편추정량이 됩니다. (평균을 자료로 추정하면서 자유도가 하나 줄어든 것.)`,
        rubric: R`
- 제곱합의 항등식 — 3점
- $\E X_i^2$, $\E\bar X^2$ — 4점
- 결론 — 3점` },
      { sec: '2.5', type: 'num', lv: 2, q: R`사전분포 $\operatorname{Beta}(4,6)$에서 동전 20번 중 앞면 15번을 관측했다. 사후평균은?`, ans: '19/30', ansTex: R`\tfrac{19}{30}\approx0.633`,
        sol: R`사후분포 $\operatorname{Beta}(4+15,\ 6+5)=\operatorname{Beta}(19,11)$. 평균 $\frac{19}{30}$. MAP은 $\frac{18}{28}\approx0.643$, MLE는 $0.75$ — 사전평균 $0.4$ 쪽으로 당겨졌습니다.` },
      { sec: '2.7', type: 'num', lv: 3, q: R`$\theta_1\sim\operatorname{Beta}(4,2)$, $\theta_2\sim\operatorname{Beta}(2,1)$ (밀도 $2t$, 누적분포 $t^2$)이 독립일 때 $P(\theta_1>\theta_2)$는?`, ans: '10/21', ansTex: R`\tfrac{10}{21}\approx0.476`,
        sol: R`$P(\theta_2<\theta_1\mid\theta_1)=\theta_1^2$이므로 $P=\E[\theta_1^2]=\frac{4}{6}\cdot\frac{5}{7}=\frac{20}{42}=\frac{10}{21}$.` },
      { sec: '2.3', type: 'num', lv: 1, q: R`$X_1,\dots,X_{25}$가 i.i.d.이고 $\Var X_i=4$일 때 표본평균의 표준편차는?`, ans: '0.4', ansTex: R`0.4`,
        sol: R`$\Var\bar X=4/25$, 표준편차 $2/5=0.4$.` },
      { sec: '2.2', type: 'open', lv: 2, proof: true, q: R`곱셈 규칙과 공리만 써서 전확률 법칙 $P(F)=\sum_iP(E_i)P(F\mid E_i)$과 베이즈 정리를 증명하세요. ($\{E_i\}$는 $\Omega$의 분할, $P(E_i)>0$)`,
        sol: R`
분할이므로 $F=F\cap\Omega=F\cap\bigcup_iE_i=\bigcup_i(F\cap E_i)$이고, $E_i$들이 서로소라 $F\cap E_i$도 서로소입니다. 공리 3: $P(F)=\sum_iP(F\cap E_i)$. 조건부 확률의 정의에서 $P(F\cap E_i)=P(E_i)P(F\mid E_i)$ (곱셈 규칙). 대입하면 전확률 법칙.
베이즈: $P(E_i\mid F)=\frac{P(E_i\cap F)}{P(F)}=\frac{P(F\mid E_i)P(E_i)}{\sum_jP(F\mid E_j)P(E_j)}$ ($P(F)>0$ 가정).`,
        rubric: R`
- $F$를 서로소 조각으로 분해 — 4점
- 공리 3과 곱셈 규칙 — 3점
- 베이즈 정리 — 3점` },
    ],
  });
})();
