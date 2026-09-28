/* 개념 정리 — 03 정보이론 (1주차 수요일 슬라이드 35–44, 2주차 월·수요일 필기, Problem Set 1 문제 1).
   직관(놀라움, 스무고개)에서 시작해 젠센 부등식으로 모든 부등식을 증명하고, JS 발산을 끝까지 다룹니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 3,
    summary: R`불확실성과 정보의 양을 재는 도구입니다. 드문 사건일수록 큰 **정보량** $-\log p$에서 출발해, 그 평균인 **엔트로피**, 두 분포의 차이를 재는 **KL 발산**, 두 확률변수가 공유하는 정보인 **상호정보량**, 분류 손실의 정체인 **교차 엔트로피**를 정의합니다. 모든 부등식(KL ≥ 0, $H(X\mid Y)\le H(X)$, $H_p(q)\ge H(p)$)은 하나의 도구 — 젠센 부등식 — 에서 나옵니다. 마지막 절은 Problem Set 1의 문제 1인 **젠센-섀넌(JS) 발산**의 세 성질(비음성, 구별 불가능한 것의 동일성, 대칭성)을 증명하고, 유계성과 상호정보량 해석까지 다룹니다.`,
    goals: [
      R`정보량이 로그인 이유(단조감소 + 독립이면 가법)를 설명하고 엔트로피를 계산할 수 있다`,
      R`조건부·결합 엔트로피를 정의하고 연쇄법칙 $H(X,Y)=H(X)+H(Y\mid X)$를 증명할 수 있다`,
      R`젠센 부등식으로 $\KL(p\Vert q)\ge0$과 등호 조건을 증명할 수 있다`,
      R`상호정보량의 세 표현을 유도하고 “조건을 걸면 엔트로피가 줄어든다”를 보일 수 있다`,
      R`교차 엔트로피 = 엔트로피 + KL을 보이고, 분류 손실과의 관계를 설명할 수 있다`,
      R`JS 발산의 비음성·동일성·대칭성과 $D_{JS}\le\log2$를 증명할 수 있다`,
    ],
    sections: [
      { k: '3.1', src: 'W1 수 · 슬라이드 35–36, W2 월 필기', title: '정보량과 엔트로피', body: R`
:::idea 쉽게 말하면
“내일 해가 뜬다”는 소식은 아무 정보가 없고, “내일 폭설이 온다(한여름에)”는 엄청난 정보입니다. 정보의 양은 **놀라움**이고, 놀라움은 드문 일일수록 큽니다. 또 스무고개로 생각할 수도 있습니다: 1부터 8 중 하나를 맞히려면 “예/아니오” 질문이 $\log_28=3$번 필요합니다. 엔트로피는 “답을 알아내는 데 평균적으로 필요한 예/아니오 질문 수”입니다.
:::

확률이 $p(x)$인 사건의 **정보량**(놀라움)을 $h(x)=-\log p(x)$로 정의합니다. 이 정의는 두 가지 요구에서 나옵니다.

- $p(x)$에 대해 **단조감소**: 드문 사건일수록 정보가 많습니다. 확실한 사건($p=1$)은 정보량 0.
- 독립이면 **가법적**: $h_{X,Y}(x,y)=h_X(x)+h_Y(y)$.

:::hand 수업 필기 — 가법성
$X,Y$가 독립이면 $p_{X,Y}(x,y)=p_X(x)p_Y(y)$이므로
$$\begin{aligned}h_X(x)+h_Y(y)&=-\log p_X(x)-\log p_Y(y)=-\log\big(p_X(x)p_Y(y)\big)\\&=-\log p_{X,Y}(x,y)=h_{X,Y}(x,y).\end{aligned}$$
곱을 합으로 바꾸는 함수가 로그라서 정보량에 로그가 들어갑니다.
:::

실제로 “연속이고 $h(pq)=h(p)+h(q)$인 함수”는 $h(p)=-c\log p$ ($c>0$) 꼴뿐이라는 것이 알려져 있습니다(코시 함수방정식). 상수 $c$는 로그의 밑을 정하는 것과 같습니다.

:::key 엔트로피
$$H(X)=-\E\big[\log p(X)\big]=\E\Big[\log\frac1{p(X)}\Big]=-\sum_xp(x)\log p(x)$$
$0\le p\le1$이므로 $H(X)\ge0$이고, 어떤 $x$에서 $p(x)=1$이면 $H(X)=0$입니다. 값이 $K$개인 확률변수는 $H(X)\le\log K$이고 등호는 균등분포일 때입니다.
:::

로그의 밑이 2이면 단위는 비트, $e$이면 내트입니다. 공정한 동전은 $H=\log_22=1$비트, 앞면 확률 $0.9$인 동전은 $H=-0.9\log_20.9-0.1\log_20.1\approx0.469$비트로 덜 불확실합니다. $0\log0=0$으로 약속합니다($\lim_{t\to0^+}t\log t=0$).

:::fig binent
:::

:::ex 예제 1 — 세 가지 분포
(a) 공정한 주사위 (b) $P(A)=\tfrac12$, $P(B)=\tfrac14$, $P(C)=\tfrac14$ (c) $P(A)=1$의 엔트로피(비트)는?
---
(a) $\log_26\approx2.585$비트. (b) $\tfrac12\cdot1+\tfrac14\cdot2+\tfrac14\cdot2=1.5$비트 — “A냐?” 한 번에 절반은 끝나고, 아니면 “B냐?”를 한 번 더 물어 평균 1.5번. (c) 0비트.
:::

**$H\le\log K$의 증명.** $u$를 $K$개 값 위의 균등분포라 하면 3.3절의 KL 비음성에서
$$0\le\KL(p\Vert u)=\sum_xp(x)\log\frac{p(x)}{1/K}=\log K-H(X).$$
등호는 $p=u$일 때뿐입니다. 즉 **균등분포가 가장 불확실합니다**.

### 더 깊이: 압축과 연속 분포

섀넌의 원천 부호화 정리에 따르면 분포 $p$에서 나오는 기호들을 평균 $H(p)$비트보다 짧게 무손실 압축할 수는 없고, $H(p)$에 원하는 만큼 가깝게 압축할 수는 있습니다. 엔트로피는 “정보의 크기”를 비트로 잰 것이라는 해석의 근거입니다. 연속 분포에서는 $-\int f\log f$ (**미분 엔트로피**)를 쓰는데, 음수가 될 수 있고 좌표를 바꾸면 값이 변하는 등 이산 엔트로피와 성질이 다릅니다. 예: $\N(\mu,\sigma^2)$의 미분 엔트로피는 $\frac12\log(2\pi e\sigma^2)$이라 $\sigma$가 작으면 음수입니다[[@med:ch05:2.5|정보량, 엔트로피, 미분 엔트로피.]].
` },
      { k: '3.2', src: 'W1 수 · 슬라이드 37, W2 월 필기', title: '조건부 엔트로피, 결합 엔트로피, 연쇄법칙', body: R`
:::idea 쉽게 말하면
두 확률변수 $X,Y$를 함께 알아내려면 먼저 $X$를 알아내고(평균 $H(X)$개의 질문), 그 뒤 $X$를 아는 상태에서 $Y$를 알아내면 됩니다(평균 $H(Y\mid X)$개의 질문). 그래서 $H(X,Y)=H(X)+H(Y\mid X)$ — 질문 수를 더하는 것입니다.
:::

:::def 조건부 엔트로피와 결합 엔트로피
$$H(Y\mid X)=-\E_{X,Y}\big[\log p(Y\mid X)\big]=-\sum_{x,y}p(x,y)\log p(y\mid x)$$
$$H(X,Y)=-\E\big[\log p(X,Y)\big]=-\sum_{x,y}p(x,y)\log p(x,y)$$
:::

$H(Y\mid X)$는 “$X$를 알고 난 뒤 $Y$에 남은 불확실성”의 평균입니다. $H(Y\mid X)=\sum_xp(x)H(Y\mid X=x)$로도 쓸 수 있습니다. (증명: $p(x,y)=p(x)p(y\mid x)$로 쓰고 $x$마다 묶으면 $-\sum_xp(x)\sum_yp(y\mid x)\log p(y\mid x)$.)

:::key 엔트로피 연쇄법칙
$$H(X,Y)=H(X)+H(Y\mid X)=H(Y)+H(X\mid Y)$$
:::

:::hand 수업 필기 — 연쇄법칙
$p(X,Y)=p(Y\mid X)p(X)$이므로
$$\begin{aligned}H(X,Y)&=-\E\big[\log p(Y\mid X)p(X)\big]\\&=-\E_{X,Y}\big[\log p(Y\mid X)\big]-\E_{X,Y}\big[\log p(X)\big]=H(Y\mid X)+H(X).\end{aligned}$$
마지막 항은 $X$만의 함수의 기댓값이라 $-\E_X[\log p(X)]=H(X)$입니다.
:::

:::ex 예제 2 — 표로 계산하기
결합분포 $p(0,0)=\tfrac12$, $p(0,1)=\tfrac14$, $p(1,0)=0$, $p(1,1)=\tfrac14$ (앞 좌표가 $X$). $H(X,Y)$, $H(X)$, $H(Y\mid X)$를 비트로 구하고 연쇄법칙을 확인하세요.
---
$H(X,Y)=\tfrac12\cdot1+\tfrac14\cdot2+\tfrac14\cdot2=1.5$ (확률 0인 칸은 0).
주변분포 $P(X=0)=\tfrac34$, $P(X=1)=\tfrac14$이므로 $H(X)=-\tfrac34\log_2\tfrac34-\tfrac14\log_2\tfrac14\approx0.811$.
$X=0$이면 $Y$의 조건부분포는 $(\tfrac23,\tfrac13)$, 엔트로피 $\approx0.918$; $X=1$이면 $Y=1$ 확정, 엔트로피 0. 따라서 $H(Y\mid X)=\tfrac34(0.918)+\tfrac14(0)\approx0.689$.
확인: $0.811+0.689=1.5=H(X,Y)$.
:::

일반화하면 $H(X_1,\dots,X_n)=\sum_{i=1}^nH(X_i\mid X_1,\dots,X_{i-1})$입니다. 언어 모델이 문장의 확률을 “앞 단어들이 주어졌을 때 다음 단어의 확률”의 곱으로 쓰는 것과 같은 구조입니다.

:::warn 조건부 엔트로피는 “특정 값”이 아니라 평균
$H(Y\mid X=x)$는 특정 $x$에서 커질 수도 있습니다(오히려 $H(Y)$보다 클 수도). 항상 줄어드는 것은 **평균** $H(Y\mid X)$입니다(3.4절).
:::
` },
      { k: '3.3', src: 'W1 수 · 슬라이드 38–40, W2 월 필기', title: 'KL 발산과 Theorem 1', body: R`
:::idea 쉽게 말하면
진짜 분포가 $p$인데 우리가 $q$라고 믿고 압축 부호를 설계하면, 평균적으로 부호가 길어집니다. **얼마나 더 길어지는지**가 KL 발산입니다. $q=p$이면 손해가 0이고, 다르면 항상 손해(양수)입니다 — 이것이 이 절의 Theorem 1입니다.
:::

:::def KL 발산 (상대 엔트로피)
$$\KL(p\Vert q)=D_{\mathrm{KL}}(p\Vert q)=\E_p\Big[\log\frac{p(X)}{q(X)}\Big]=\sum_xp(x)\log\frac{p(x)}{q(x)}$$
약속: $0\log\frac00=0$, $0\log\frac0a=0$, $b\log\frac b0=\infty$ ($b>0$). 연속분포는 합 대신 적분.
:::

KL은 “진짜 분포 $p$ 대신 $q$를 썼을 때의 손해”를 재지만 **거리가 아닙니다**. 대칭이 아니고 삼각부등식도 성립하지 않습니다.

:::ex 예제 3 — 두 베르누이 분포 (수업 필기)
$p(1)=r,\ p(0)=1-r$, $q(1)=s,\ q(0)=1-s$일 때 $\KL(p\Vert q)$와 $\KL(q\Vert p)$를 쓰고, $r=\tfrac12$, $s=\tfrac14$에서 비교하세요(자연로그).
---
$$\KL(p\Vert q)=r\log\frac rs+(1-r)\log\frac{1-r}{1-s},$$
$$\KL(q\Vert p)=s\log\frac sr+(1-s)\log\frac{1-s}{1-r}$$
$r=\tfrac12,s=\tfrac14$: $\KL(p\Vert q)=\tfrac12\log2+\tfrac12\log\tfrac23\approx0.1438$, $\KL(q\Vert p)=\tfrac14\log\tfrac12+\tfrac34\log\tfrac32\approx0.1308$. 서로 다릅니다.
:::

### 도구: 젠센 부등식

**볼록함수**는 그래프 위의 두 점을 이은 현(선분)이 그래프보다 위에 있는 함수입니다: $\varphi(\lambda a+(1-\lambda)b)\le\lambda\varphi(a)+(1-\lambda)\varphi(b)$ ($0\le\lambda\le1$). $\varphi''\ge0$이면 볼록입니다(예: $x^2$, $e^x$, $-\log x$). 확률 $\lambda,1-\lambda$로 $a,b$를 갖는 확률변수 $X$로 읽으면 이 부등식이 곧 $\varphi(\E X)\le\E\varphi(X)$입니다.

:::thm 젠센 부등식
$\varphi$가 볼록함수이면 $\varphi(\E[X])\le\E[\varphi(X)]$.[[@base:ch05:5.2|젠센 부등식의 증명: 유한 가중합의 귀납법.]] $\varphi$가 오목이면(예: $\log$) 부등호가 반대입니다: $\E[\log X]\le\log\E[X]$.
:::

:::fig jensen
:::

**등호 조건.** $\varphi$가 **순볼록**(현이 양 끝점 말고는 그래프보다 엄격히 위: $\varphi''>0$이면 성립)이면 등호는 $X$가 확률 1로 상수일 때뿐입니다.

### Theorem 1

:::key KL 발산의 비음성 (Theorem 1)
$$\KL(p\Vert q)\ge0,\qquad \text{등호}\iff p(x)=q(x)\ \ \text{모든 }x$$
:::

:::hand 수업 필기 — Theorem 1의 증명
$E=\{x:p(x)>0\}$로 두면 $p(x)=0$인 항은 0이므로
$$\begin{aligned}\KL(p\Vert q)&=\sum_{x\in E}p(x)\log\frac{p(x)}{q(x)}=\sum_{x\in E}p(x)\Big[-\log\frac{q(x)}{p(x)}\Big]\\&\ge-\log\Big(\sum_{x\in E}p(x)\frac{q(x)}{p(x)}\Big)=-\log\sum_{x\in E}q(x)\ \ge\ 0.\end{aligned}$$
첫 부등식은 $-\log$가 볼록이라 젠센, 마지막은 $\sum_{x\in E}q(x)\le1$. 등호는 $q(x)/p(x)=c$가 $E$에서 상수이고 $\sum_{E}q=1$일 때이며, $1=\sum_xq(x)=c\sum_xp(x)=c$에서 $q=p$.
:::

빠진 세부 사항을 채우면:
- 어떤 $x\in E$에서 $q(x)=0$이면 그 항이 $+\infty$라 $\KL=\infty\ge0$ (자명). 이하 $E$에서 $q>0$이라 합니다.
- 젠센은 확률변수 $Z=q(X)/p(X)$ ($X\sim p$, $E$ 위에서)에 쓴 것입니다: $\E[-\log Z]\ge-\log\E Z$, $\E Z=\sum_Eq$.
- 등호에는 두 부등식이 **모두** 등호여야 합니다. 첫째는 $-\log$가 순볼록이라 $Z$가 상수 $c$일 때만, 둘째는 $\sum_Eq=1$일 때만. 둘을 합치면 $c=1$, 즉 $E$에서 $q=p$이고, $E$ 밖에서는 $\sum_Eq=1$이라 $q=0=p$.

### 더 깊이: 두 방향의 KL

학습에서 $\KL(p\Vert q_\theta)$ (자료 $p$ 기준, “전방 KL”)를 줄이면 $p$가 양수인 곳에서 $q$가 0이 되지 않도록 강하게 벌을 받아 $q$가 $p$의 모든 봉우리를 **덮으려** 합니다(평균 찾기). 반대로 $\KL(q_\theta\Vert p)$ (“역방향 KL”, 변분 추론)를 줄이면 $q$가 $p$가 0인 곳에 질량을 두지 못해 봉우리 **하나에 달라붙습니다**(최빈값 찾기). 대칭이 아니라는 것은 결함이 아니라 쓰임새의 차이입니다. 대칭인 대안이 3.6절의 JS 발산입니다.
` },
      { k: '3.4', src: 'W1 수 · 슬라이드 41–43, W2 수 필기', title: '상호정보량', body: R`
:::idea 쉽게 말하면
$X$를 알면 $Y$에 대한 불확실성이 얼마나 줄어드나? 그 **줄어든 양**이 상호정보량입니다. 날씨($X$)를 알면 우산을 챙길지($Y$)에 대한 불확실성이 크게 줄고, 주사위 결과는 우산과 무관하니 전혀 줄지 않습니다(상호정보량 0).
:::

:::def 상호정보량
$$I(X;Y)=\KL\big(p(x,y)\,\Vert\,p(x)p(y)\big)=\E_{p(x,y)}\Big[\log\frac{p(X,Y)}{p(X)p(Y)}\Big]$$
:::

결합분포가 “독립이라고 가정한 분포” $p(x)p(y)$와 얼마나 다른지를 잽니다. Theorem 1에서 $I(X;Y)\ge0$이고 등호는 $X,Y$가 독립일 때뿐입니다.

:::key 상호정보량
$$\begin{aligned}I(X;Y)&=H(X)-H(X\mid Y)=H(Y)-H(Y\mid X)\\&=H(X)+H(Y)-H(X,Y)\end{aligned}$$
:::

:::hand 수업 필기 — 유도
$p(x,y)=p_{Y\mid X}(y\mid x)p_X(x)$이므로
$$I(X;Y)=\sum_{x,y}p(x,y)\log\frac{p(y\mid x)}{p(y)}=\E_{X,Y}\big[\log p(Y\mid X)-\log p(Y)\big].$$
$H(Y)=-\E_Y[\log p(Y)]$, $H(Y\mid X)=-\E_{X,Y}[\log p(Y\mid X)]$이므로 $I(X;Y)=-H(Y\mid X)+H(Y)$. 같은 방법으로 $I(X;Y)=H(X)-H(X\mid Y)$.
:::

세 번째 표현은 연쇄법칙 $H(Y\mid X)=H(X,Y)-H(X)$를 첫 표현에 넣은 것입니다.

:::fig venn
:::

**결론.** $I\ge0$이므로 $H(X\mid Y)\le H(X)$: 평균적으로 **조건을 걸면 엔트로피가 줄어듭니다**(늘지 않습니다).

:::ex 예제 4 — 3.2절 표의 상호정보량
예제 2의 분포에서 $I(X;Y)$를 비트로 구하세요.
---
$P(Y=0)=\tfrac12$, $P(Y=1)=\tfrac12$이라 $H(Y)=1$. $I=H(X)+H(Y)-H(X,Y)\approx0.811+1-1.5=0.311$비트. 또는 $H(Y)-H(Y\mid X)=1-0.689=0.311$. $X$를 알면 $Y$에 대한 1비트의 불확실성 중 약 0.31비트가 해소됩니다.
:::

### 더 깊이: 조건부 기댓값으로 쓰기

$I(X;Y)=\sum_xp(x)\,\KL\big(p(y\mid x)\,\Vert\,p(y)\big)$로도 쓸 수 있습니다(정의에서 $p(x,y)=p(x)p(y\mid x)$). “$X$가 $x$로 밝혀졌을 때 $Y$의 분포가 원래 분포에서 얼마나 달라지는가”의 평균입니다. 결정 트리의 **정보 이득**이 바로 이 양이고[[@ml:ch15:18.2b|정보 이득은 상호정보량.]], 3.6절에서 JS 발산을 상호정보량으로 읽을 때도 이 표현을 씁니다.
` },
      { k: '3.5', src: 'W1 수 · 슬라이드 44, W2 수 필기', title: '교차 엔트로피', body: R`
:::idea 쉽게 말하면
진짜 분포 $p$에서 나오는 결과를, 모델 $q$가 매긴 놀라움 $-\log q(x)$로 평균 낸 것이 교차 엔트로피입니다. 모델이 정답에 높은 확률을 줄수록 놀라움이 작아 교차 엔트로피가 작습니다. 분류 문제의 손실함수가 바로 이것입니다.
:::

:::def 교차 엔트로피
$$H_p(q)=-\E_p\big[\log q(X)\big]=-\sum_xp(x)\log q(x)$$
:::

:::key 교차 엔트로피
$$H_p(q)=H(p)+\KL(p\Vert q)\ \ge\ H(p)$$
:::

:::hand 수업 필기 — 유도
$$\begin{aligned}\KL(p\Vert q)=\sum_{x\in E}p\log\frac pq&=-\sum_{x\in E}p(x)\log q(x)-\sum_{x\in E}p(x)\log\frac1{p(x)}\\&=H_p(q)-H(p)\ \ge0.\end{aligned}$$
따라서 $H_p(q)\ge H(p)$ (깁스 부등식).
:::

**학습에서의 의미.** 자료 분포 $p$는 고정이므로 모델 $q$에 대해 교차 엔트로피를 최소로 하는 것은 $\KL(p\Vert q)$를 최소로 하는 것과 같습니다. 원-핫 레이블 $p=(0,\dots,1,\dots,0)$이면 $H(p)=0$이라 $H_p(q)=-\log q(\text{정답})$, 즉 로지스틱·소프트맥스 회귀의 음의 로그가능도와 정확히 같습니다[[ch06:6.2|소프트맥스 회귀의 손실 $-\sum_i\sum_ky_{ik}\log p_k$는 교차 엔트로피의 합입니다.]]. 의료 인공지능 과목에서도 “MLE = KL 최소화”로 같은 관계를 다룹니다[[@med:ch05:2.5b|KL을 표본평균으로 근사하면 음의 로그가능도만 남습니다.]].

:::ex 예제 5 — 분류 손실 계산
정답이 둘째 클래스(원-핫 $p=(0,1,0)$)이고 모델이 $q=(0.2,0.5,0.3)$을 냈다. 교차 엔트로피는? 모델이 $q=(0.05,0.9,0.05)$로 좋아지면?
---
$H_p(q)=-\log0.5\approx0.693$. 좋아진 모델은 $-\log0.9\approx0.105$. 정답 확률이 1에 가까울수록 손실이 0에 가깝고, 정답에 확률 0.01을 주면 $-\log0.01\approx4.6$으로 크게 벌받습니다.
:::

### 더 깊이: 자료 전체에서

훈련 자료 $\{(x_i,y_i)\}$의 경험분포를 $\hat p$라 하면 평균 교차 엔트로피 손실 $-\frac1N\sum_i\log q_\theta(y_i\mid x_i)$는 $H_{\hat p}(q_\theta)$입니다. 따라서 “교차 엔트로피 최소화 = 음의 로그가능도 최소화 = MLE = $\KL(\hat p\Vert q_\theta)$ 최소화”가 모두 같은 말입니다. 레이블 평활화(정답에 $1-\varepsilon$, 나머지에 $\varepsilon/(K-1)$)를 쓰면 $H(p)>0$이 되어 모델이 확률 1을 내는 과신을 막습니다.
` },
      { k: '3.6', src: 'Problem Set 1 · 문제 1', title: '젠센-섀넌 발산', body: R`
:::idea 쉽게 말하면
KL은 대칭이 아니고, $q$가 0인 곳에서 무한대가 되는 불편함이 있습니다. 해결책: 두 분포를 **반반 섞은 평균 분포** $m$을 만들고, $p$와 $q$가 각각 $m$에서 얼마나 떨어졌는지를 KL로 재서 평균 냅니다. 이렇게 하면 순서를 바꿔도 같고(대칭), 언제나 유한하며, 두 분포가 같을 때만 0입니다.
:::

:::def 젠센-섀넌 발산
같은 확률공간 위의 두 확률분포 $p,q$에 대해
$$D_{JS}(p\Vert q)=\frac12\KL(p\Vert m)+\frac12\KL(q\Vert m),\qquad m=\frac12(p+q).$$
:::

$m$은 확률분포입니다: 음이 아니고 $\sum_xm(x)=\frac12(1+1)=1$. 또 $p(x)>0$이면 $m(x)\ge\frac12p(x)>0$이라 **KL의 분모가 0이 되는 일이 없습니다**.

### Problem Set 1 문제 1: 세 가지 성질

:::key JS 발산의 성질
(i) 비음성 $D_{JS}(p\Vert q)\ge0$ (ii) 구별 불가능한 것의 동일성 $D_{JS}(p\Vert q)=0\iff p=q$ (iii) 대칭성 $D_{JS}(p\Vert q)=D_{JS}(q\Vert p)$. 또한 (iv) $D_{JS}(p\Vert q)\le\log2$.
:::

**(i) 비음성.** Theorem 1(3.3절)에서 $\KL(p\Vert m)\ge0$, $\KL(q\Vert m)\ge0$. 음이 아닌 두 수에 $\frac12$을 곱해 더했으므로 $D_{JS}\ge0$.

**(ii) 동일성.** ($\Leftarrow$) $p=q$이면 $m=\frac12(p+p)=p$이므로 $\KL(p\Vert m)=\KL(p\Vert p)=0$, 마찬가지로 $\KL(q\Vert m)=0$. 따라서 $D_{JS}=0$.
($\Rightarrow$) $D_{JS}=0$이면 음이 아닌 두 항의 합이 0이므로 **둘 다** 0입니다: $\KL(p\Vert m)=0$, $\KL(q\Vert m)=0$. Theorem 1의 등호 조건에서 $p=m$이고 $q=m$. 따라서 $p=q$.

**(iii) 대칭성.** $m=\frac12(p+q)=\frac12(q+p)$는 $p,q$의 순서와 무관합니다. 그러므로
$$D_{JS}(q\Vert p)=\frac12\KL(q\Vert m)+\frac12\KL(p\Vert m)=D_{JS}(p\Vert q)$$
(덧셈의 교환법칙으로 두 항의 순서만 바뀜).

**(iv) 유계.** $m(x)\ge\frac12p(x)$이므로 $p(x)>0$인 곳에서 $\frac{p(x)}{m(x)}\le2$, 따라서 $\KL(p\Vert m)=\sum_{p>0}p\log\frac pm\le\sum p\log2=\log2$. $q$도 같으므로 $D_{JS}\le\frac12\log2+\frac12\log2=\log2$. 등호는 $p$와 $q$의 받침이 겹치지 않을 때($p(x)q(x)=0$ 모든 $x$)입니다: 그때 $p>0$인 곳에서 $m=p/2$라 정확히 $\log2$.

:::warn 증명에서 자주 빠뜨리는 것
(ii)의 ($\Rightarrow$)에서 “합이 0이면 각각 0”은 **각 항이 음이 아니기 때문**입니다. 이 한 줄과, Theorem 1의 **등호 조건**을 명시적으로 인용해야 만점입니다. 또 $m$이 확률분포이고 $p\ll m$ (KL이 유한)임을 짚어 주면 좋습니다. 연속분포이면 합을 적분으로 바꾸고 “모든 $x$”를 “거의 모든 $x$”로 읽습니다.
:::

### 계산 예와 엔트로피 표현

두 KL을 풀어 쓰면 $\KL(p\Vert m)=-H(p)-\sum_xp(x)\log m(x)$이므로
$$\begin{aligned}D_{JS}(p\Vert q)&=-\frac{H(p)+H(q)}2-\sum_x\frac{p(x)+q(x)}2\log m(x)\\&=H(m)-\frac{H(p)+H(q)}2.\end{aligned}$$
“섞은 분포의 엔트로피 − 엔트로피의 평균”입니다. 엔트로피가 오목함수라서 이 값이 음이 아니라는 것이 (i)의 또 다른 증명입니다.

:::ex 예제 6 — 두 베르누이 분포
$p=\operatorname{Bern}(\tfrac12)$, $q=\operatorname{Bern}(\tfrac14)$ (예제 3과 같은 분포)의 $D_{JS}$를 자연로그로 구하세요.
---
$m=\operatorname{Bern}(\tfrac38)$. $\KL(p\Vert m)=\tfrac12\log\tfrac{1/2}{3/8}+\tfrac12\log\tfrac{1/2}{5/8}=\tfrac12\log\tfrac43+\tfrac12\log\tfrac45\approx0.0323$,
$\KL(q\Vert m)=\tfrac14\log\tfrac{1/4}{3/8}+\tfrac34\log\tfrac{3/4}{5/8}=\tfrac14\log\tfrac23+\tfrac34\log\tfrac65\approx0.0354$.
$D_{JS}\approx\tfrac12(0.0323+0.0354)\approx0.0338$. 엔트로피 표현으로도 $H(m)-\frac{H(p)+H(q)}2\approx0.6616-\frac{0.6931+0.5623}2\approx0.0338$. $\KL(p\Vert q)\approx0.144$, $\KL(q\Vert p)\approx0.131$과 달리 순서를 바꿔도 같습니다.
:::

:::fig jskl
:::

### 더 깊이: 상호정보량 해석과 GAN

공정한 동전 $Z$를 던져 $Z=0$이면 $X\sim p$, $Z=1$이면 $X\sim q$에서 뽑는다고 합시다. 그러면 $X$의 주변분포는 $m$이고, 3.4절의 표현 $I(X;Z)=\sum_zp(z)\KL(p(x\mid z)\Vert p(x))$에서
$$I(X;Z)=\frac12\KL(p\Vert m)+\frac12\KL(q\Vert m)=D_{JS}(p\Vert q).$$
즉 JS 발산은 “표본 하나를 보고 그것이 $p$에서 왔는지 $q$에서 왔는지를 얼마나 알 수 있는가”입니다. $0\le I(X;Z)\le H(Z)=\log2$이므로 (i)과 (iv)가 한 번에 나옵니다. 생성적 적대 신경망(GAN)에서 판별기가 최적일 때 생성기의 목적함수가 $2D_{JS}(p_{\text{data}}\Vert p_G)-\log4$가 되는 것이 바로 이 해석입니다. 또 $\sqrt{D_{JS}}$는 삼각부등식까지 만족하는 진짜 거리(metric)입니다.
` },
    ],
  });
})();
