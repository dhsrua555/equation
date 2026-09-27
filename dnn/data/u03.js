/* 03 정보이론 — 1주차 수요일 s.35–44, 2주차 월·수요일 필기 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 3, part: 'A', title: '엔트로피와 KL 발산', en: 'Entropy, KL Divergence, Mutual Information', ref: 'W1 수 · s.35–44, W2 월·수 필기', plot: 'entropy',
    fig: R`이진 엔트로피 H(p)(굵은 선)와 여러 q에 대한 KL(p‖q)`,
    tagline: R`$\KL(p\Vert q)\ge0$ 하나로 교차 엔트로피 $\ge$ 엔트로피, 상호정보량 $\ge0$, “조건을 걸면 엔트로피가 줄어든다”가 모두 나옵니다.`,
    summary: R`정보량 $h(x)=-\log p(x)$와 그 기댓값인 엔트로피에서 출발해 조건부·결합 엔트로피와 연쇄법칙, KL 발산, 상호정보량, 교차 엔트로피를 정의합니다. 핵심 정리는 **Theorem 1: $\KL(p\Vert q)\ge0$, 등호는 $p=q$일 때만**이고, 수업에서는 옌센 부등식으로 필기 증명했습니다. 이어서 $I(X;Y)=H(Y)-H(Y\mid X)$와 $H_p(q)=H(p)+\KL(p\Vert q)$를 필기로 유도했습니다. 교차 엔트로피는 5–6단원의 분류 손실 그 자체입니다.`,
    goals: [
      R`정보량의 성질(감소, 독립 사건에서 가법성)을 보이고 엔트로피를 기댓값으로 쓸 수 있다`,
      R`연쇄법칙 $H(X,Y)=H(X)+H(Y\mid X)$를 로그의 성질로 증명할 수 있다`,
      R`KL 발산이 대칭이 아님을 예로 보이고, 옌센 부등식으로 $\KL\ge0$과 등호 조건을 증명할 수 있다`,
      R`$I(X;Y)=\KL(p(x,y)\Vert p(x)p(y))=H(X)-H(X\mid Y)$를 유도하고 벤 다이어그램으로 설명할 수 있다`,
      R`$H_p(q)=H(p)+\KL(p\Vert q)\ge H(p)$를 보이고 분류 손실과 연결할 수 있다`,
    ],
    secTitles: { '3.1': '엔트로피', '3.2': '연쇄법칙', '3.3': 'KL 발산', '3.4': '상호정보량', '3.5': '교차 엔트로피' },
    sections: [
      { k: '3.1', src: 'W1 수 · 슬라이드 35–36, W2 월 필기', title: '정보량과 엔트로피', body: R`
확률이 $p(x)$인 사건의 **정보량**(놀라움)을 $h(x)=-\log p(x)$로 정의합니다. 이 정의는 두 가지 요구에서 나옵니다.

- $p(x)$에 대해 **단조감소**: 드문 사건일수록 정보가 많습니다. 확실한 사건($p=1$)은 정보량 0.
- 독립이면 **가법적**: $h_{X,Y}(x,y)=h_X(x)+h_Y(y)$.

:::hand 수업 필기 — 가법성
$X,Y$가 독립이면 $p_{X,Y}(x,y)=p_X(x)p_Y(y)$이므로
$$h_X(x)+h_Y(y)=-\log p_X(x)-\log p_Y(y)=-\log\big(p_X(x)p_Y(y)\big)=-\log p_{X,Y}(x,y)=h_{X,Y}(x,y).$$
곱을 합으로 바꾸는 함수가 로그라서 정보량에 로그가 들어갑니다.
:::

:::key 엔트로피
$$H(X)=-\E\big[\log p(X)\big]=\E\Big[\log\frac1{p(X)}\Big]=-\sum_xp(x)\log p(x)$$
$0\le p\le1$이므로 $H(X)\ge0$이고, 어떤 $x$에서 $p(x)=1$이면 $H(X)=0$입니다. 값이 $K$개인 확률변수는 $H(X)\le\log K$이고 등호는 균등분포일 때입니다.
:::

로그의 밑이 2이면 단위는 비트, $e$이면 내트입니다. 공정한 동전은 $H=\log_22=1$비트, 앞면 확률 $0.9$인 동전은 $H=-0.9\log_20.9-0.1\log_20.1\approx0.469$비트로 덜 불확실합니다. $0\log0=0$으로 약속합니다($\lim_{t\to0^+}t\log t=0$).
` },
      { k: '3.2', src: 'W1 수 · 슬라이드 37, W2 월 필기', title: '조건부 엔트로피, 결합 엔트로피, 연쇄법칙', body: R`
:::def 조건부 엔트로피와 결합 엔트로피
$$H(Y\mid X)=-\E_{X,Y}\big[\log p(Y\mid X)\big]=-\sum_{x,y}p(x,y)\log p(y\mid x)$$
$$H(X,Y)=-\E\big[\log p(X,Y)\big]=-\sum_{x,y}p(x,y)\log p(x,y)$$
:::

$H(Y\mid X)$는 “$X$를 알고 난 뒤 $Y$에 남은 불확실성”의 평균입니다. $H(Y\mid X)=\sum_xp(x)H(Y\mid X=x)$로도 쓸 수 있습니다.

:::key 엔트로피 연쇄법칙
$$H(X,Y)=H(X)+H(Y\mid X)=H(Y)+H(X\mid Y)$$
:::

:::hand 수업 필기 — 연쇄법칙
$p(X,Y)=p(Y\mid X)p(X)$이므로
$$H(X,Y)=-\E\big[\log p(Y\mid X)p(X)\big]=-\E_{X,Y}\big[\log p(Y\mid X)\big]-\E_{X,Y}\big[\log p(X)\big]=H(Y\mid X)+H(X).$$
마지막 항은 $X$만의 함수의 기댓값이라 $-\E_X[\log p(X)]=H(X)$입니다.
:::
` },
      { k: '3.3', src: 'W1 수 · 슬라이드 38–40, W2 월 필기', title: 'KL 발산과 Theorem 1', body: R`
:::def KL 발산 (상대 엔트로피)
$$\KL(p\Vert q)=D_{\mathrm{KL}}(p\Vert q)=\E_p\Big[\log\frac{p(X)}{q(X)}\Big]=\sum_xp(x)\log\frac{p(x)}{q(x)}$$
약속: $0\log\frac00=0$, $0\log\frac0a=0$, $b\log\frac b0=\infty$ ($b>0$). 연속분포는 합 대신 적분.
:::

KL은 “진짜 분포 $p$ 대신 $q$를 썼을 때의 손해”를 재지만 **거리가 아닙니다**. 대칭이 아니고 삼각부등식도 성립하지 않습니다.

:::ex 예제 1 — 두 베르누이 분포 (수업 필기)
$p(1)=r,\ p(0)=1-r$, $q(1)=s,\ q(0)=1-s$일 때 $\KL(p\Vert q)$와 $\KL(q\Vert p)$를 쓰고, $r=\tfrac12$, $s=\tfrac14$에서 비교하세요(자연로그).
---
$$\KL(p\Vert q)=r\log\frac rs+(1-r)\log\frac{1-r}{1-s},\qquad \KL(q\Vert p)=s\log\frac sr+(1-s)\log\frac{1-s}{1-r}$$
$r=\tfrac12,s=\tfrac14$: $\KL(p\Vert q)=\tfrac12\log2+\tfrac12\log\tfrac23\approx0.1438$, $\KL(q\Vert p)=\tfrac14\log\tfrac12+\tfrac34\log\tfrac32\approx0.1308$. 서로 다릅니다.
:::

:::thm 젠센 부등식
$\varphi$가 볼록함수이면 $\varphi(\E[X])\le\E[\varphi(X)]$.[[@base:ch05:5.2|젠센 부등식의 증명: 유한 가중합의 귀납법.]] $\varphi$가 오목이면(예: $\log$) 부등호가 반대입니다: $\E[\log X]\le\log\E[X]$.
:::

:::key KL 발산의 비음성 (Theorem 1)
$$\KL(p\Vert q)\ge0,\qquad \text{등호}\iff p(x)=q(x)\ \ \text{모든 }x$$
:::

:::hand 수업 필기 — Theorem 1의 증명
$E=\{x:p(x)>0\}$로 두면 $p(x)=0$인 항은 0이므로
$$\begin{aligned}\KL(p\Vert q)&=\sum_{x\in E}p(x)\log\frac{p(x)}{q(x)}=\sum_{x\in E}p(x)\Big[-\log\frac{q(x)}{p(x)}\Big]\\&\ge-\log\Big(\sum_{x\in E}p(x)\frac{q(x)}{p(x)}\Big)=-\log\sum_{x\in E}q(x)\ \ge\ 0.\end{aligned}$$
첫 부등식은 $-\log$가 볼록이라 젠센, 마지막은 $\sum_{x\in E}q(x)\le1$. 등호는 $q(x)/p(x)=c$가 $E$에서 상수이고 $\sum_{E}q=1$일 때이며, $1=\sum_xq(x)=c\sum_xp(x)=c$에서 $q=p$.
:::

빠진 세부 사항(어떤 $q(x)=0$, $x\in E$이면 KL이 $\infty$라 자명함, 등호에서 $-\log$가 **순**볼록이어야 하는 이유)은 증명 페이지에 정리했습니다.
` },
      { k: '3.4', src: 'W1 수 · 슬라이드 41–43, W2 수 필기', title: '상호정보량', body: R`
:::def 상호정보량
$$I(X;Y)=\KL\big(p(x,y)\,\Vert\,p(x)p(y)\big)=\E_{p(x,y)}\Big[\log\frac{p(X,Y)}{p(X)p(Y)}\Big]$$
:::

결합분포가 “독립이라고 가정한 분포” $p(x)p(y)$와 얼마나 다른지를 잽니다. Theorem 1에서 $I(X;Y)\ge0$이고 등호는 $X,Y$가 독립일 때뿐입니다.

:::key 상호정보량
$$I(X;Y)=H(X)-H(X\mid Y)=H(Y)-H(Y\mid X)=H(X)+H(Y)-H(X,Y)$$
:::

:::hand 수업 필기 — 유도
$p(x,y)=p_{Y\mid X}(y\mid x)p_X(x)$이므로
$$I(X;Y)=\sum_{x,y}p(x,y)\log\frac{p(y\mid x)}{p(y)}=\E_{X,Y}\big[\log p(Y\mid X)-\log p(Y)\big].$$
$H(Y)=-\E_Y[\log p(Y)]$, $H(Y\mid X)=-\E_{X,Y}[\log p(Y\mid X)]$이므로 $I(X;Y)=-H(Y\mid X)+H(Y)$. 같은 방법으로 $I(X;Y)=H(X)-H(X\mid Y)$.
:::

:::fig venn

**결론.** $I\ge0$이므로 $H(X\mid Y)\le H(X)$: 평균적으로 **조건을 걸면 엔트로피가 줄어듭니다**(늘지 않습니다).
` },
      { k: '3.5', src: 'W1 수 · 슬라이드 44, W2 수 필기', title: '교차 엔트로피', body: R`
:::def 교차 엔트로피
$$H_p(q)=-\E_p\big[\log q(X)\big]=-\sum_xp(x)\log q(x)$$
:::

:::key 교차 엔트로피
$$H_p(q)=H(p)+\KL(p\Vert q)\ \ge\ H(p)$$
:::

:::hand 수업 필기 — 유도
$$\KL(p\Vert q)=\sum_{x\in E}p\log\frac pq=-\sum_{x\in E}p(x)\log q(x)-\sum_{x\in E}p(x)\log\frac1{p(x)}=H_p(q)-H(p)\ \ge0.$$
따라서 $H_p(q)\ge H(p)$ (깁스 부등식).
:::

**학습에서의 의미.** 자료 분포 $p$는 고정이므로 모델 $q$에 대해 교차 엔트로피를 최소로 하는 것은 $\KL(p\Vert q)$를 최소로 하는 것과 같습니다. 원-핫 레이블 $p=(0,\dots,1,\dots,0)$이면 $H(p)=0$이라 $H_p(q)=-\log q(\text{정답})$, 즉 로지스틱·소프트맥스 회귀의 음의 로그가능도와 정확히 같습니다[[ch06:6.2|소프트맥스 회귀의 손실 $-\sum_i\sum_ky_{ik}\log p_k$는 교차 엔트로피의 합입니다.]]. 의료 인공지능 과목에서도 “MLE = KL 최소화”로 같은 관계를 다룹니다[[@med:ch05:2.5b|KL을 표본평균으로 근사하면 음의 로그가능도만 남습니다.]].
` },
    ],
    problems: [
      { sec: '3.1', type: 'num', lv: 1, q: R`공정한 주사위(눈 6개)의 엔트로피를 비트 단위로 구하세요.`, ans: 'ln(6)/ln(2)', ansTex: R`\log_26\approx2.585`,
        sol: R`균등분포이므로 $H=\log_26\approx2.585$비트.` },
      { sec: '3.1', type: 'num', lv: 1, q: R`앞면 확률 $0.9$인 동전의 엔트로피(비트)는? (소수 셋째 자리)`, ans: '-(0.9*ln(0.9)+0.1*ln(0.1))/ln(2)', ansTex: R`\approx0.469`,
        sol: R`$-0.9\log_20.9-0.1\log_20.1=0.9(0.152)+0.1(3.322)\approx0.137+0.332=0.469$.` },
      { sec: '3.1', type: 'mc', lv: 1, q: R`정보량을 $h(x)=-\log p(x)$로 정의하는 이유로 **맞지 않는** 것은?`,
        choices: [R`드문 사건일수록 정보량이 커야 한다`, R`독립 사건의 정보량은 더해져야 한다`, R`확실한 사건의 정보량은 0이어야 한다`, R`정보량은 확률에 대해 볼록해야 KL이 거리가 된다`], ans: 3,
        sol: R`앞의 셋이 $-\log$를 정하는 성질입니다. KL은 어떤 경우에도 거리(대칭·삼각부등식)가 아닙니다.` },
      { sec: '3.2', type: 'num', lv: 2, q: R`$p(x,y)$가 $p(0,0)=\tfrac12$, $p(0,1)=\tfrac14$, $p(1,0)=0$, $p(1,1)=\tfrac14$일 때 $H(X,Y)$(비트)는?`, ans: '1.5', ansTex: R`1.5`,
        sol: R`$-\tfrac12\log_2\tfrac12-2\cdot\tfrac14\log_2\tfrac14=\tfrac12+1=1.5$비트.` },
      { sec: '3.2', type: 'num', lv: 2, q: R`위 분포에서 주변분포 $X$의 엔트로피 $H(X)$(비트, 소수 셋째 자리)는?`, ans: '-(0.75*ln(0.75)+0.25*ln(0.25))/ln(2)', ansTex: R`\approx0.811`,
        sol: R`$p_X(0)=\tfrac12+\tfrac14=\tfrac34$, $p_X(1)=0+\tfrac14=\tfrac14$. $H(X)=-\tfrac34\log_2\tfrac34-\tfrac14\log_2\tfrac14\approx0.311+0.5=0.811$.` },
      { sec: '3.3', type: 'num', lv: 2, q: R`$p=\operatorname{Bern}(\tfrac12)$, $q=\operatorname{Bern}(\tfrac14)$일 때 $\KL(p\Vert q)$ (자연로그, 소수 넷째 자리)는?`, ans: '0.5*ln(2)+0.5*ln(2/3)', ansTex: R`\tfrac12\ln\tfrac43\approx0.1438`,
        sol: R`$\tfrac12\ln\frac{1/2}{1/4}+\tfrac12\ln\frac{1/2}{3/4}=\tfrac12\ln2+\tfrac12\ln\tfrac23=\tfrac12\ln\tfrac43\approx0.1438$.` },
      { sec: '3.3', type: 'num', lv: 2, q: R`같은 두 분포에서 $\KL(q\Vert p)$ (자연로그)는?`, ans: '0.25*ln(0.5)+0.75*ln(1.5)', ansTex: R`\approx0.1308`,
        sol: R`$\tfrac14\ln\frac{1/4}{1/2}+\tfrac34\ln\frac{3/4}{1/2}=-\tfrac14\ln2+\tfrac34\ln\tfrac32\approx-0.1733+0.3041=0.1308$. $\KL(p\Vert q)$와 다릅니다.` },
      { sec: '3.3', type: 'mc', lv: 2, q: R`Theorem 1의 증명에서 옌센 부등식을 적용하는 함수와 그 성질은?`,
        choices: [R`$\log$, 볼록`, R`$-\log$, 볼록`, R`$x^2$, 볼록`, R`$e^x$, 오목`], ans: 1,
        sol: R`$\sum p(x)\big[-\log\frac{q}{p}\big]\ge-\log\sum p\frac qp$. $-\log$가 (순)볼록이라 $\E[\varphi(Z)]\ge\varphi(\E Z)$.` },
      { sec: '3.3', type: 'mc', lv: 2, q: R`$p$의 받침(support) 안에서 $q(x)=0$인 점이 있으면 $\KL(p\Vert q)$는?`,
        choices: [R`0`, R`음수`, R`$+\infty$`, R`정의되지 않아 계산할 수 없다`], ans: 2,
        sol: R`$b\log\frac b0=\infty$ ($b>0$) 약속에 따라 $+\infty$. 모델이 실제로 일어나는 사건에 확률 0을 주면 무한대의 벌점을 받습니다.` },
      { sec: '3.4', type: 'num', lv: 2, q: R`$X$와 $Y$가 독립일 때 $I(X;Y)$는?`, ans: '0', ansTex: R`0`,
        sol: R`$p(x,y)=p(x)p(y)$이면 $\log\frac{p(x,y)}{p(x)p(y)}=0$. Theorem 1의 등호 조건과 같습니다.` },
      { sec: '3.4', type: 'num', lv: 3, q: R`3.2절 문제의 분포에서 $H(Y\mid X)$(비트, 소수 셋째 자리)를 입력하세요. ($p(0,0)=\tfrac12,\ p(0,1)=\tfrac14,\ p(1,0)=0,\ p(1,1)=\tfrac14$)`, ans: '0.75*(-(2/3)*ln(2/3)-(1/3)*ln(1/3))/ln(2)', ansTex: R`\approx0.689`,
        sol: R`$X=0$($\tfrac34$)일 때 $Y\mid X=0\sim(\tfrac23,\tfrac13)$, 엔트로피 $\approx0.918$. $X=1$일 때 $Y=1$ 확정. $H(Y\mid X)=\tfrac34\times0.918\approx0.689$. 연쇄법칙으로 확인: $H(X,Y)-H(X)=1.5-0.811=0.689$.` },
      { sec: '3.4', type: 'mc', lv: 2, q: R`항상 성립하는 부등식은?`,
        choices: [R`$H(X\mid Y)\ge H(X)$`, R`$H(X\mid Y)\le H(X)$`, R`$I(X;Y)\le0$`, R`$H(X,Y)\le H(X\mid Y)$`], ans: 1,
        sol: R`$I(X;Y)=H(X)-H(X\mid Y)\ge0$. 조건을 걸면 (평균적으로) 엔트로피가 줄어듭니다.` },
      { sec: '3.5', type: 'num', lv: 2, q: R`원-핫 레이블 $p=(0,1,0)$, 모델 예측 $q=(0.2,0.5,0.3)$일 때 교차 엔트로피 $H_p(q)$ (자연로그)는?`, ans: 'ln(2)', ansTex: R`\ln2\approx0.693`,
        sol: R`$H_p(q)=-\sum p_k\log q_k=-\log0.5=\ln2$. 원-핫이면 정답 클래스의 $-\log$ 확률만 남습니다.` },
      { sec: '3.5', type: 'mc', lv: 2, q: R`고정된 $p$에 대해 $q$를 바꿔 $H_p(q)$를 최소로 하는 것은 무엇을 최소로 하는 것과 같은가?`,
        choices: [R`$H(q)$`, R`$\KL(q\Vert p)$`, R`$\KL(p\Vert q)$`, R`$I(p;q)$`], ans: 2,
        sol: R`$H_p(q)=H(p)+\KL(p\Vert q)$이고 $H(p)$는 $q$와 무관합니다. 최솟값은 $q=p$에서 $H(p)$.` },
      { sec: '3.3', type: 'open', lv: 2, proof: true, q: R`이산분포 $p,q$에 대해 $\KL(p\Vert q)\ge0$이고 등호는 $p=q$일 때뿐임을 증명하세요(Theorem 1).`,
        sol: R`
$E=\{x:p(x)>0\}$. $x\in E$에서 $q(x)=0$이면 $\KL=\infty\ge0$이므로 $q>0$ on $E$라 합시다.
$\KL(p\Vert q)=\sum_{x\in E}p(x)\big[-\log\frac{q(x)}{p(x)}\big]$. $-\log$는 순볼록이고 $\{p(x)\}_{x\in E}$는 확률분포이므로 옌센에서
$$\KL(p\Vert q)\ge-\log\sum_{x\in E}p(x)\frac{q(x)}{p(x)}=-\log\sum_{x\in E}q(x)\ge-\log1=0.$$
**등호.** 둘째 부등식의 등호는 $\sum_Eq=1$, 첫째 부등식의 등호는 (순볼록이므로) $q(x)/p(x)$가 $E$에서 상수 $c$일 때입니다. 그러면 $1=\sum_Eq=c\sum_Ep=c$이므로 $E$에서 $q=p$, $E$ 밖에서는 $q=1-\sum_Eq=0$ 합이라 $q=0=p$. 역으로 $p=q$이면 모든 항이 $\log1=0$.`,
        rubric: R`
- $E$ 도입과 $q=0$ 경우 처리 — 2점
- 옌센 적용(함수와 가중치 명시) — 4점
- $\sum_Eq\le1$로 0 이상 — 2점
- 등호 조건 — 2점` },
      { sec: '3.4', type: 'open', lv: 2, proof: true, q: R`$I(X;Y)=\KL(p(x,y)\Vert p(x)p(y))$로 정의할 때 $I(X;Y)=H(Y)-H(Y\mid X)$임을 보이고, 이로부터 $H(Y\mid X)\le H(Y)$를 결론 내리세요.`,
        sol: R`
$p(x,y)=p(y\mid x)p(x)$이므로 $\frac{p(x,y)}{p(x)p(y)}=\frac{p(y\mid x)}{p(y)}$.
$$I(X;Y)=\sum_{x,y}p(x,y)\log p(y\mid x)-\sum_{x,y}p(x,y)\log p(y).$$
첫 합은 $-H(Y\mid X)$. 둘째 합은 $\sum_y\big(\sum_xp(x,y)\big)\log p(y)=\sum_yp(y)\log p(y)=-H(Y)$. 따라서 $I=-H(Y\mid X)+H(Y)$.
$I$는 KL이므로 Theorem 1에서 $I\ge0$, 즉 $H(Y\mid X)\le H(Y)$.`,
        rubric: R`
- 비율을 조건부확률로 바꾸기 — 3점
- 주변화로 $-H(Y)$ 얻기 — 3점
- 결론과 Theorem 1 인용 — 4점` },
    ],
  });
})();
