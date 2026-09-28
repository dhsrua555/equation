/* 추가 연습문제 — 03 정보이론. Problem Set 1 문제 1(젠센-섀넌 발산)과 같은 유형의 증명 문제를 중심으로 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 3,
    secTitles: { '3.6': 'JS 발산' },
    problems: [
      { sec: '3.6', type: 'open', lv: 3, proof: true, q: R`**(Problem Set 1 문제 1)** 같은 확률공간 위의 두 확률분포 $p,q$에 대해 젠센-섀넌 발산을 $D_{JS}(p\Vert q)=\frac12D_{KL}(p\Vert m)+\frac12D_{KL}(q\Vert m)$, $m=\frac12(p+q)$로 정의한다. 다음을 증명하시오.
(i) 비음성: $D_{JS}(p\Vert q)\ge0$.
(ii) 구별 불가능한 것의 동일성: $D_{JS}(p\Vert q)=0\iff p=q$.
(iii) 대칭성: $D_{JS}(p\Vert q)=D_{JS}(q\Vert p)$.`,
        sol: R`
**준비.** $m=\frac12(p+q)$는 음이 아니고 합(적분)이 1이므로 확률분포입니다. $p(x)>0$이면 $m(x)\ge\frac12p(x)>0$이라 $D_{KL}(p\Vert m)$은 잘 정의되고 유한합니다($q$도 같음). KL 발산의 비음성과 등호 조건(Theorem 1: $D_{KL}(a\Vert b)\ge0$, 등호 $\iff a=b$)을 씁니다.

**(i)** $D_{KL}(p\Vert m)\ge0$, $D_{KL}(q\Vert m)\ge0$이므로 $D_{JS}=\frac12(\text{음이 아닌 수})+\frac12(\text{음이 아닌 수})\ge0$.

**(ii)** ($\Leftarrow$) $p=q$이면 $m=p=q$이므로 두 KL이 모두 $D_{KL}(p\Vert p)=0$, 따라서 $D_{JS}=0$.
($\Rightarrow$) $D_{JS}=0$이면 음이 아닌 두 항의 합이 0이므로 $D_{KL}(p\Vert m)=0$이고 $D_{KL}(q\Vert m)=0$. Theorem 1의 등호 조건에서 $p=m$, $q=m$, 따라서 $p=q$.

**(iii)** $m$은 $p,q$에 대해 대칭($\frac12(p+q)=\frac12(q+p)$)이므로 $D_{JS}(q\Vert p)=\frac12D_{KL}(q\Vert m)+\frac12D_{KL}(p\Vert m)$이고, 덧셈의 교환법칙으로 $D_{JS}(p\Vert q)$와 같습니다.`,
        rubric: R`
- $m$이 확률분포이고 KL이 유한함을 확인 — 1점
- (i) KL 비음성 인용 — 2점
- (ii) 두 방향 모두, 특히 “음이 아닌 항의 합이 0이면 각각 0” — 3점
- (ii) Theorem 1의 등호 조건 사용 — 2점
- (iii) $m$의 대칭성 — 2점` },
      { sec: '3.6', type: 'num', lv: 1, q: R`$p=(1,0)$, $q=(0,1)$ (받침이 겹치지 않는 두 분포)일 때 $D_{JS}(p\Vert q)$를 자연로그로 구하세요. (KL은 두 방향 모두 무한대)`, ans: 'ln(2)', ansTex: R`\ln2\approx0.693`,
        sol: R`$m=(\tfrac12,\tfrac12)$. $D_{KL}(p\Vert m)=1\cdot\log\frac1{1/2}=\log2$, $D_{KL}(q\Vert m)=\log2$. 평균 $\log2$ — JS의 최댓값입니다.` },
      { sec: '3.6', type: 'num', lv: 2, q: R`$p=(\tfrac12,\tfrac12)$, $q=(1,0)$일 때 $D_{JS}(p\Vert q)$ (자연로그, 소수 넷째 자리)는?`, ans: '0.75*ln(4/3)', ansTex: R`\tfrac34\ln\tfrac43\approx0.2158`,
        sol: R`$m=(\tfrac34,\tfrac14)$. $D_{KL}(p\Vert m)=\tfrac12\ln\tfrac{1/2}{3/4}+\tfrac12\ln\tfrac{1/2}{1/4}=\tfrac12\ln\tfrac23+\tfrac12\ln2=\tfrac12\ln\tfrac43$. $D_{KL}(q\Vert m)=\ln\tfrac1{3/4}=\ln\tfrac43$. $D_{JS}=\tfrac12\big(\tfrac12+1\big)\ln\tfrac43=\tfrac34\ln\tfrac43\approx0.2158$. 이때 $D_{KL}(p\Vert q)=\infty$입니다.` },
      { sec: '3.6', type: 'open', lv: 3, proof: true, q: R`$D_{JS}(p\Vert q)\le\log2$임을 보이고, 등호가 성립할 필요충분조건이 “모든 $x$에서 $p(x)q(x)=0$”임을 보이세요.`,
        sol: R`
$p(x)>0$인 $x$에서 $m(x)=\frac{p(x)+q(x)}2\ge\frac{p(x)}2$이므로 $\log\frac{p(x)}{m(x)}\le\log2$이고, 등호는 $q(x)=0$일 때뿐입니다. 따라서
$$D_{KL}(p\Vert m)=\sum_{p(x)>0}p(x)\log\frac{p(x)}{m(x)}\le\log2\sum_{p(x)>0}p(x)=\log2,$$
등호 $\iff$ $p(x)>0$인 모든 $x$에서 $q(x)=0$. 같은 논리로 $D_{KL}(q\Vert m)\le\log2$, 등호 $\iff$ $q(x)>0$인 모든 $x$에서 $p(x)=0$. 평균하면 $D_{JS}\le\log2$이고, 등호는 두 조건이 모두 성립할 때, 즉 모든 $x$에서 $p(x)q(x)=0$일 때입니다(두 조건은 사실 같은 말).`,
        rubric: R`
- $p/m\le2$ 관찰과 등호 조건 — 4점
- 두 KL의 상한 — 3점
- 등호의 필요충분조건 — 3점` },
      { sec: '3.6', type: 'open', lv: 3, proof: true, q: R`$D_{JS}(p\Vert q)=H(m)-\frac12\big(H(p)+H(q)\big)$임을 보이고, 엔트로피의 오목성을 이용해 $D_{JS}\ge0$을 다시 증명하세요.`,
        sol: R`
$D_{KL}(p\Vert m)=\sum p\log p-\sum p\log m=-H(p)-\sum_xp(x)\log m(x)$, 마찬가지로 $q$. 평균하면
$$D_{JS}=-\frac{H(p)+H(q)}2-\sum_x\frac{p(x)+q(x)}2\log m(x)=-\frac{H(p)+H(q)}2-\sum_xm(x)\log m(x)=H(m)-\frac{H(p)+H(q)}2.$$
함수 $\phi(t)=-t\log t$는 $\phi''(t)=-1/t<0$이라 오목이므로 $\phi\big(\frac{a+b}2\big)\ge\frac{\phi(a)+\phi(b)}2$. $x$마다 $a=p(x)$, $b=q(x)$로 두고 더하면 $H(m)\ge\frac{H(p)+H(q)}2$, 즉 $D_{JS}\ge0$.`,
        rubric: R`
- 각 KL을 엔트로피와 교차항으로 분해 — 3점
- 교차항을 $H(m)$으로 합치기 — 3점
- $-t\log t$의 오목성과 성분별 부등식 — 4점` },
      { sec: '3.6', type: 'mc', lv: 2, q: R`JS 발산에 대해 **틀린** 것은?`,
        choices: [R`$D_{JS}(p\Vert q)=D_{JS}(q\Vert p)$`, R`$0\le D_{JS}\le\log2$`, R`$D_{JS}$ 자체가 삼각부등식을 만족하는 거리(metric)이다`, R`$p$와 $q$의 받침이 달라도 유한하다`], ans: 2,
        sol: R`삼각부등식을 만족하는 것은 $\sqrt{D_{JS}}$입니다. $D_{JS}$ 자체는 만족하지 않습니다(제곱거리가 삼각부등식을 깨는 것과 같은 이유).` },
      { sec: '3.6', type: 'open', lv: 3, proof: true, q: R`$Z\sim\operatorname{Bern}(\tfrac12)$이고 $Z=0$이면 $X\sim p$, $Z=1$이면 $X\sim q$일 때 $I(X;Z)=D_{JS}(p\Vert q)$임을 보이고, 이로부터 $D_{JS}\le\log2$를 얻으세요.`,
        sol: R`
$X$의 주변분포는 $P(X=x)=\frac12p(x)+\frac12q(x)=m(x)$.
$I(X;Z)=\sum_zP(Z=z)\,D_{KL}\big(P_{X\mid Z=z}\Vert P_X\big)$ (정의 $\sum_{x,z}p(x,z)\log\frac{p(x\mid z)}{p(x)}$를 $z$로 묶은 것)이므로
$$I(X;Z)=\frac12D_{KL}(p\Vert m)+\frac12D_{KL}(q\Vert m)=D_{JS}(p\Vert q).$$
$I(X;Z)=H(Z)-H(Z\mid X)\le H(Z)=\log2$ (조건부 엔트로피 $\ge0$). 따라서 $D_{JS}\le\log2$.`,
        rubric: R`
- $X$의 주변분포가 $m$ — 2점
- 상호정보량을 조건부 KL의 평균으로 쓰기 — 4점
- $H(Z)=\log2$와 상한 — 4점` },
      { sec: '3.1', type: 'num', lv: 1, q: R`분포 $(\tfrac12,\tfrac14,\tfrac18,\tfrac18)$의 엔트로피(비트)는?`, ans: '1.75', ansTex: R`1.75`,
        sol: R`$\tfrac12(1)+\tfrac14(2)+\tfrac18(3)+\tfrac18(3)=1.75$. 질문 “첫째냐?” → “둘째냐?” → “셋째냐?”의 평균 횟수와 같습니다.` },
      { sec: '3.1', type: 'open', lv: 2, proof: true, q: R`값이 $K$개인 이산 확률변수에 대해 $H(X)\le\log K$이고 등호는 균등분포일 때뿐임을 KL의 비음성으로 증명하세요.`,
        sol: R`
$u(x)=1/K$ (균등분포). $D_{KL}(p\Vert u)=\sum_xp(x)\log\frac{p(x)}{1/K}=\sum_xp(x)\log p(x)+\log K\sum_xp(x)=-H(X)+\log K$.
Theorem 1에서 $D_{KL}(p\Vert u)\ge0$이므로 $H(X)\le\log K$, 등호 $\iff p=u$.`,
        rubric: R`
- 균등분포와의 KL 전개 — 5점
- 비음성과 등호 조건 — 5점` },
      { sec: '3.5', type: 'open', lv: 2, proof: true, q: R`$p$가 고정일 때 $q$에 대한 교차 엔트로피 $H_p(q)$의 최솟값이 $H(p)$이고, 최소는 $q=p$에서만 달성됨을 보이세요.`,
        sol: R`
$H_p(q)=H(p)+D_{KL}(p\Vert q)$ (전개: $-\sum p\log q=-\sum p\log p+\sum p\log\frac pq$). $H(p)$는 $q$와 무관하고 $D_{KL}(p\Vert q)\ge0$, 등호 $\iff q=p$. 따라서 $\min_qH_p(q)=H(p)$, 최소점은 $q=p$뿐입니다. (분류 모델이 교차 엔트로피를 줄이면 예측분포가 참분포에 다가간다는 뜻입니다.)`,
        rubric: R`
- 분해 $H_p(q)=H(p)+\mathrm{KL}$ — 5점
- 비음성과 등호로 최솟값·최소점 — 5점` },
      { sec: '3.4', type: 'num', lv: 2, q: R`$p(0,0)=p(1,1)=0.4$, $p(0,1)=p(1,0)=0.1$일 때 $I(X;Y)$ (비트, 소수 넷째 자리)는?`, ans: '(0.8*ln(1.6)+0.2*ln(0.4))/ln(2)', ansTex: R`\approx0.2781`,
        sol: R`주변분포는 모두 $(\tfrac12,\tfrac12)$. $I=\sum p(x,y)\log_2\frac{p(x,y)}{1/4}=2(0.4)\log_21.6+2(0.1)\log_20.4\approx0.5425-0.2644=0.2781$.` },
      { sec: '3.4', type: 'open', lv: 2, proof: true, q: R`$H(X,Y)\le H(X)+H(Y)$이고 등호는 $X,Y$가 독립일 때뿐임을 보이세요.`,
        sol: R`
$H(X)+H(Y)-H(X,Y)=I(X;Y)=D_{KL}\big(p(x,y)\Vert p(x)p(y)\big)\ge0$ (Theorem 1), 등호 $\iff p(x,y)=p(x)p(y)$ 모든 $x,y$, 즉 독립.`,
        rubric: R`
- 상호정보량의 세 번째 표현 — 5점
- KL 비음성과 등호 조건(독립) — 5점` },
    ],
  });
})();
