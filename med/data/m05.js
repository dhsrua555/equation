/* 05 밀도의 변환과 정보이론 — Bishop 2.4–2.5 (p.42–54), 강의 Ch02 s.27–39 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 5, part: 'B', title: '밀도의 변환과 정보이론', en: 'Transformation of Densities, Information Theory', ref: 'Bishop §2.4–2.5', plot: 'transform',
    fig: R`가우시안 p_x(굵은 선)를 로지스틱 사상(가는 곡선)으로 보내면 세로축의 밀도 p_y는 모양도 최빈값도 바뀜`,
    tagline: R`밀도는 대입만으로 바뀌지 않고 야코비안만큼 늘거나 줄어듭니다. KL은 음이 아니고, KL을 최소화하는 것이 곧 최대가능도입니다.`,
    summary: R`변수를 바꾸면 밀도는 확률이 보존되도록 야코비안의 절댓값(다변수면 행렬식)만큼 곱해져야 합니다. 그 결과 비선형 변환은 단순한 분포를 복잡하게 만들 수 있고, 함수의 최대점과 달리 **밀도의 최빈값은 변환을 그대로 따라가지 않습니다**(정규화 흐름의 원리). 정보이론에서는 정보량 $h(x)=-\log_2p(x)$, 엔트로피(평균 정보량), 미분 엔트로피와 최대 엔트로피 분포(가우시안), **KL 발산**과 그 비음성(옌센 부등식), **최대가능도 = KL 최소화**, 조건부 엔트로피와 상호정보량을 다룹니다.`,
    goals: [
      R`1변수·다변수 변수변환 공식 $p_y(y)=p_x(x)\lvert dx/dy\rvert$, $p_{\mathbf y}=p_{\mathbf x}\lvert\det J\rvert$를 쓰고 적용할 수 있다`,
      R`밀도의 최빈값이 변환을 따라가지 않는 이유를 설명할 수 있다`,
      R`정보량과 엔트로피를 계산하고 균등분포가 엔트로피 최대임을 설명할 수 있다`,
      R`가우시안의 미분 엔트로피와 최대 엔트로피 성질을 말할 수 있다`,
      R`KL 발산의 정의·비대칭성·비음성(옌센)과 MLE = KL 최소화를 보일 수 있다`,
      R`결합·조건부 엔트로피와 상호정보량의 관계를 벤 다이어그램으로 설명할 수 있다`,
    ],
    secTitles: { '2.4': '밀도의 변환', '2.5': '정보량·엔트로피', '2.5b': 'KL 발산', '2.5c': '상호정보량' },
    sections: [
      { k: '2.4', label: '2.4–2.4.1', p: '42', src: '슬라이드 28–31', title: '확률밀도의 변환', body: R`
보통 함수는 변수를 바꿀 때 대입만 하면 됩니다: $x=g(y)$이면 $\tilde f(y)=f(g(y))$. 그러나 **확률밀도는 단순 대입으로 변환되지 않습니다.** 대응하는 구간의 확률이 같아야 하므로 $p_x(x)\delta x\simeq p_y(y)\delta y$이고

:::key 확률밀도의 변수변환
$$p_y(y)=p_x(x)\left\lvert\frac{dx}{dy}\right\rvert=p_x(g(y))\,\lvert g'(y)\rvert$$
다변수: $\mathbf x=\mathbf g(\mathbf y)$이면 $p_{\mathbf y}(\mathbf y)=p_{\mathbf x}(\mathbf x)\,\lvert\det J\rvert$, $J_{ij}=\dfrac{\partial g_i}{\partial y_j}$ (야코비안 행렬).
:::

다변수 야코비안을 풀어 쓰면
$$\mathbf x=(x_1,\dots,x_D)^T,\quad \mathbf y=(y_1,\dots,y_D)^T,\quad \mathbf x=\mathbf g(\mathbf y)$$
$$\mathbf J=\begin{pmatrix}\dfrac{\partial g_1}{\partial y_1}&\cdots&\dfrac{\partial g_1}{\partial y_D}\\\vdots&\ddots&\vdots\\\dfrac{\partial g_D}{\partial y_1}&\cdots&\dfrac{\partial g_D}{\partial y_D}\end{pmatrix}.$$

:::ex 예제 1 — 균등분포에서 지수분포 만들기
$x\sim U(0,1)$일 때 $y=-\ln x$의 밀도는?
---
역변환 $x=g(y)=e^{-y}$ ($y\gt0$), $\lvert g'(y)\rvert=e^{-y}$. $p_x=1$이므로 $p_y(y)=1\cdot e^{-y}=e^{-y}$, 즉 $\lambda=1$인 지수분포. 컴퓨터가 균등 난수로 지수분포 난수를 만드는 방법이 이것입니다. 단순 대입만 하면 $p_x(g(y))=1$(상수)이라 적분이 발산해 밀도가 될 수 없습니다. 야코비안이 넓이를 맞춰 줍니다.
:::

야코비안 항은 변환이 공간을 **늘리거나 줄이는** 정도만큼 밀도를 조정해 전체 확률 질량을 보존합니다[[@em:ch06:7.7|행렬식은 선형변환이 부피를 몇 배로 바꾸는지를 나타냅니다.]][[@base:ch04:4.2|좌표변환의 야코비안: 극좌표의 넓이 요소 $r\,dr\,d\theta$.]].

**비선형 변환의 효과.**
- 단순한 분포를 훨씬 복잡한 분포로 바꿀 수 있습니다. 실제로 **어떤 밀도든** 0이 아닌 고정된 기준 밀도에 적절한 단조 비선형 변환을 가해 만들 수 있습니다.
- 그러나 밀도는 보통 함수와 다르게 행동합니다. 함수의 최대점은 변수를 바꿔도 대응점으로 옮겨가지만, **밀도의 최빈값은 일반적으로 그렇지 않습니다.** 야코비안 인수가 밀도 자체를 바꾸기 때문입니다(표지 그림: $p_x$의 최빈값을 $g^{-1}$로 옮긴 점과 $p_y$의 최빈값이 다름).
- 이 변수변환 공식은 **정규화 흐름**(normalizing flows) 같은 현대 생성모델의 핵심 도구입니다: 가우시안 같은 단순한 분포에 가역 비선형 변환을 여러 번 가해 표현력 있는 분포를 만듭니다.

슬라이드 예: $y_1=x_1+\tanh(5x_1)$, $y_2=x_2+\tanh(5x_2)+x_1^3/3$는 격자·가우시안 밀도·표본을 네 덩어리로 휘어진 분포로 바꿉니다.
:::fig transform
:::

:::fig flow2d
:::
` },
      { k: '2.5', label: '2.5.1–2.5.4', p: '46', src: '슬라이드 33–35', title: '정보량, 엔트로피, 미분 엔트로피', body: R`
**정보량**은 사건의 **놀라움의 정도**입니다. 드문 사건일수록 정보가 많고, 확실한 사건은 새 정보가 없습니다. 독립인 사건의 정보량은 더해져야 하므로 로그 꼴이 됩니다.

:::key 정보량과 엔트로피
$$h(x)=-\log_2p(x),\qquad \mathrm H[x]=-\sum_xp(x)\log_2p(x)\ (\text{섀넌 엔트로피, 비트})$$
연속 변수의 미분 엔트로피 $\mathrm H[x]=-\int p(x)\ln p(x)\,dx$ (내트). 가우시안이면 $\mathrm H[x]=\frac12\{1+\ln(2\pi\sigma^2)\}$.
:::

- **엔트로피**는 확률변수의 **평균 정보량**이며, 분포의 불확실성·예측 불가능성을 잽니다.
- 값이 $K$개이면 **균등분포의 엔트로피가 최대**($\log_2K$). 슬라이드 그림: 뾰족한 분포 $H=1.77$, 넓은 분포 $H=3.09$.
- 교재 예: 8가지 상태가 같은 확률이면 $H=3$비트(3비트 코드 필요). 확률 $(\frac12,\frac14,\frac18,\frac1{16},\frac1{64},\frac1{64},\frac1{64},\frac1{64})$이면 $H=2$비트이고, 자주 나오는 상태에 짧은 코드(0, 10, 110, 1110, 111100, …)를 주면 평균 코드 길이도 2비트입니다. 엔트로피는 전송에 필요한 비트 수의 하한입니다(섀넌의 무잡음 부호화 정리).
- 이후로는 자연로그를 써서 단위가 **내트**입니다(비트와 $\ln2$배 차이).

:::fig entropyhist
:::

**최대 엔트로피.** 평균과 분산이 고정되었을 때 미분 엔트로피를 최대로 하는 유일한 분포는 **가우시안**입니다. 평균과 분산만 알 때 가장 덜 정보적인(가장 편향 없는) 분포라는 뜻이며, 통계·머신러닝에서 가우시안을 널리 쓰는 근거가 됩니다. 가우시안의 엔트로피는 분산이 커질수록 커집니다(넓을수록 불확실).

:::warn 미분 엔트로피는 음수일 수 있다
이산 엔트로피는 $\ge0$이지만 미분 엔트로피는 아닙니다. $\sigma^2<\frac1{2\pi e}$이면 $\frac12\{1+\ln(2\pi\sigma^2)\}<0$.
:::

:::fig entcurves
:::
` },
      { k: '2.5b', label: '2.5.5', p: '51', src: '슬라이드 36–38', title: 'KL 발산', body: R`
머신러닝에서 참 자료분포 $p(\mathbf x)$는 모르므로 모델 분포 $q(\mathbf x)$로 근사합니다. **KL 발산**은 $q$가 $p$와 얼마나 다른지, 즉 $p$ 대신 $q$를 쓸 때 잃는 정보량을 잽니다(모델 품질의 정보이론적 척도).

:::key KL 발산
$$\begin{aligned}\KL(p\Vert q)&=-\int p(\mathbf x)\ln q(\mathbf x)\,d\mathbf x-\Big(-\int p(\mathbf x)\ln p(\mathbf x)\,d\mathbf x\Big)\\&=-\int p(\mathbf x)\ln\Big\{\frac{q(\mathbf x)}{p(\mathbf x)}\Big\}d\mathbf x\end{aligned}$$
$\KL(p\Vert q)\ge0$, 등호는 $p(\mathbf x)=q(\mathbf x)$일 때만. 대칭이 아니다: $\KL(p\Vert q)\not\equiv\KL(q\Vert p)$.
:::

:::thm 옌센 부등식
볼록함수 $f$에 대해 $f(\lambda a+(1-\lambda)b)\le\lambda f(a)+(1-\lambda)f(b)$ (현이 그래프 위에 있음).[[@base:ch05:5.2|젠센(옌센) 부등식의 증명.]] 일반화하면 $f\big(\sum_i\lambda_ix_i\big)\le\sum_i\lambda_if(x_i)$ ($\lambda_i\ge0$, $\sum\lambda_i=1$), 즉 $f(\E[x])\le\E[f(x)]$, 연속형으로 $f\big(\int\mathbf xp(\mathbf x)d\mathbf x\big)\le\int f(\mathbf x)p(\mathbf x)d\mathbf x$.
:::

:::fig jensen
:::

**비음성의 증명(슬라이드).** $-\ln x$는 볼록이므로 옌센 부등식에서
$$\begin{aligned}\KL(p\Vert q)&=-\int p(\mathbf x)\ln\Big\{\frac{q(\mathbf x)}{p(\mathbf x)}\Big\}d\mathbf x\\&\ge-\ln\int p(\mathbf x)\frac{q(\mathbf x)}{p(\mathbf x)}d\mathbf x=-\ln\int q(\mathbf x)\,d\mathbf x=0.\end{aligned}$$

:::key 최대가능도 = KL 최소화
모델 $q(\mathbf x\mid\boldsymbol\theta)$를 $p(\mathbf x)$에 가깝게 만들고 싶지만 $p$를 모르므로 기댓값을 표본평균으로 근사하면
$$\KL(p\Vert q)\simeq\frac1N\sum_{n=1}^N\big\{-\ln q(\mathbf x_n\mid\boldsymbol\theta)+\ln p(\mathbf x_n)\big\}.$$
둘째 항은 $\boldsymbol\theta$와 무관하므로 **KL 최소화 ⇔ 로그가능도 최대화**.
:::

:::fig klasym
:::

이것이 MLE가 머신러닝·확률 모델링에서 가장 기본적인 학습 원리인 이유입니다. 심층 신경망 과목의 Theorem 1과 같은 내용입니다[[@dnn:ch03:3.3|이산 버전의 증명과 등호 조건.]].
` },
      { k: '2.5c', label: '2.5.6–2.5.7', p: '53', src: '슬라이드 39', title: '조건부 엔트로피와 상호정보량', body: R`
:::key 결합·조건부 엔트로피와 상호정보량
$$\mathrm H[\mathbf x,\mathbf y]=\mathrm H[\mathbf y\mid\mathbf x]+\mathrm H[\mathbf x],\qquad \mathrm H[\mathbf y\mid\mathbf x]=-\iint p(\mathbf y,\mathbf x)\ln p(\mathbf y\mid\mathbf x)\,d\mathbf y\,d\mathbf x$$
$$\mathrm I[\mathbf x,\mathbf y]\equiv\KL\big(p(\mathbf x,\mathbf y)\Vert p(\mathbf x)p(\mathbf y)\big)=\mathrm H[\mathbf x]-\mathrm H[\mathbf x\mid\mathbf y]=\mathrm H[\mathbf y]-\mathrm H[\mathbf y\mid\mathbf x]$$
:::

- **결합 엔트로피**: 결합 체계 전체의 불확실성
- **조건부 엔트로피** $\mathrm H[\mathbf y\mid\mathbf x]$: $\mathbf x$를 관측한 뒤 $\mathbf y$에 남은 불확실성
- **상호정보량**: $\mathbf y$를 관측해 $\mathbf x$의 불확실성이 줄어드는 양. KL이므로 $\ge0$이고 독립일 때만 0.

:::fig venn
` },
    ],
    problems: [
      { sec: '2.4', type: 'mc', lv: 1, q: R`$x=g(y)$로 변수를 바꿀 때 밀도의 변환은?`,
        choices: [R`$p_y(y)=p_x(g(y))$`, R`$p_y(y)=p_x(g(y))\lvert g'(y)\rvert$`, R`$p_y(y)=p_x(g(y))/\lvert g'(y)\rvert$`, R`$p_y(y)=g(p_x(y))$`], ans: 1,
        sol: R`$p_x(x)\lvert dx\rvert=p_y(y)\lvert dy\rvert$에서 $p_y=p_x\lvert dx/dy\rvert=p_x(g(y))\lvert g'(y)\rvert$.` },
      { sec: '2.4', type: 'num', lv: 2, q: R`$x\sim\mathrm{Uniform}(0,1)$, $y=2x+3$일 때 $y$의 밀도값(구간 안)은?`, ans: '0.5', ansTex: R`\tfrac12`,
        sol: R`$x=(y-3)/2$, $\lvert dx/dy\rvert=\frac12$, $p_y=1\cdot\frac12$ on $(3,5)$.` },
      { sec: '2.4', type: 'num', lv: 2, q: R`$x\sim\mathrm{Uniform}(0,1)$, $y=x^2$일 때 $p_y(0.25)$는?`, ans: '1', ansTex: R`1`,
        sol: R`$x=\sqrt y$, $dx/dy=\frac1{2\sqrt y}$, $p_y(y)=\frac1{2\sqrt y}$ on $(0,1)$. $y=0.25$이면 $\frac1{2\cdot0.5}=1$.` },
      { sec: '2.4', type: 'num', lv: 2, q: R`2차원 선형변환 $\mathbf x=A\mathbf y$, $A=\begin{pmatrix}2&1\\0&3\end{pmatrix}$에서 $p_{\mathbf y}(\mathbf y)=c\cdot p_{\mathbf x}(A\mathbf y)$의 상수 $c$는?`, ans: '6', ansTex: R`\lvert\det A\rvert=6`,
        sol: R`야코비안 $J=A$, $\lvert\det A\rvert=6$.` },
      { sec: '2.4', type: 'mc', lv: 2, q: R`밀도의 최빈값이 변수변환을 따라 대응점으로 옮겨가지 않는 이유는?`,
        choices: [R`밀도가 음수일 수 있어서`, R`야코비안 인수 $\lvert dx/dy\rvert$가 위치마다 달라 밀도 자체의 모양을 바꾸기 때문`, R`적분이 1이 아니어서`, R`변환이 가역이 아니어서`], ans: 1,
        sol: R`보통 함수 $f(g(y))$는 최대점이 그대로 옮겨가지만 밀도에는 $\lvert g'(y)\rvert$가 곱해집니다.` },
      { sec: '2.5', type: 'num', lv: 1, q: R`확률 $\frac18$인 사건의 정보량은 몇 비트인가?`, ans: '3', ansTex: R`3`,
        sol: R`$-\log_2\frac18=3$.` },
      { sec: '2.5', type: 'num', lv: 2, q: R`확률 $(\frac12,\frac14,\frac18,\frac18)$인 분포의 엔트로피(비트)는?`, ans: '1.75', ansTex: R`1.75`,
        sol: R`$\frac12(1)+\frac14(2)+2\cdot\frac18(3)=0.5+0.5+0.75=1.75$.` },
      { sec: '2.5', type: 'num', lv: 2, q: R`교재 예의 분포 $(\frac12,\frac14,\frac18,\frac1{16},\frac1{64},\frac1{64},\frac1{64},\frac1{64})$에서 코드 0, 10, 110, 1110, 111100, 111101, 111110, 111111의 평균 길이는?`, ans: '2', ansTex: R`2`,
        sol: R`$\frac12(1)+\frac14(2)+\frac18(3)+\frac1{16}(4)+4\cdot\frac1{64}(6)=0.5+0.5+0.375+0.25+0.375=2$. 엔트로피와 같습니다.` },
      { sec: '2.5', type: 'num', lv: 2, q: R`$\N(0,\sigma^2)$의 미분 엔트로피가 0이 되는 $\sigma^2$은? (소수 넷째 자리)`, ans: '1/(2*pi*e)', ansTex: R`\tfrac1{2\pi e}\approx0.0585`,
        sol: R`$\frac12\{1+\ln(2\pi\sigma^2)\}=0\iff2\pi\sigma^2=e^{-1}$.` },
      { sec: '2.5', type: 'mc', lv: 1, q: R`평균과 분산이 고정된 연속분포 중 미분 엔트로피가 최대인 것은?`,
        choices: [R`균등분포`, R`라플라스 분포`, R`가우시안 분포`, R`지수분포`], ans: 2,
        sol: R`가우시안은 평균·분산만 알 때 가장 덜 정보적인 분포입니다.` },
      { sec: '2.5b', type: 'num', lv: 2, q: R`$p=(\frac12,\frac12)$, $q=(\frac14,\frac34)$일 때 $\KL(p\Vert q)$ (자연로그)는? (소수 넷째 자리)`, ans: '0.5*ln(2)+0.5*ln(2/3)', ansTex: R`\tfrac12\ln\tfrac43\approx0.1438`,
        sol: R`$\frac12\ln\frac{1/2}{1/4}+\frac12\ln\frac{1/2}{3/4}=\frac12\ln\frac43$.` },
      { sec: '2.5b', type: 'mc', lv: 2, q: R`KL 발산의 비음성 증명에서 옌센 부등식을 적용하는 볼록함수는?`,
        choices: [R`$\ln x$`, R`$-\ln x$`, R`$x^2$`, R`$e^{-x}$`], ans: 1,
        sol: R`$\E_p[-\ln(q/p)]\ge-\ln\E_p[q/p]=-\ln\int q=0$.` },
      { sec: '2.5b', type: 'mc', lv: 2, q: R`$\KL(p\Vert q)\simeq\frac1N\sum\{-\ln q(\mathbf x_n\mid\boldsymbol\theta)+\ln p(\mathbf x_n)\}$에서 KL 최소화가 MLE와 같아지는 이유는?`,
        choices: [R`둘째 항이 $\boldsymbol\theta$와 무관해서`, R`첫째 항이 상수라서`, R`$p=q$라서`, R`$N\to\infty$라서`], ans: 0,
        sol: R`$\boldsymbol\theta$에 대해 최소화하면 첫째 항, 즉 음의 로그가능도의 평균만 남습니다.` },
      { sec: '2.5c', type: 'num', lv: 2, q: R`$\mathrm H[x]=1.5$, $\mathrm H[x\mid y]=0.9$ (비트)이면 $\mathrm I[x,y]$는?`, ans: '0.6', ansTex: R`0.6`,
        sol: R`$\mathrm I=\mathrm H[x]-\mathrm H[x\mid y]=0.6$.` },
      { sec: '2.5c', type: 'num', lv: 2, q: R`$\mathrm H[x]=1$, $\mathrm H[y]=2$, $\mathrm H[x,y]=2.5$이면 $\mathrm H[y\mid x]$는?`, ans: '1.5', ansTex: R`1.5`,
        sol: R`$\mathrm H[x,y]=\mathrm H[y\mid x]+\mathrm H[x]$에서 $2.5-1=1.5$. (상호정보량은 $1+2-2.5=0.5$.)` },
      { sec: '2.5b', type: 'open', lv: 2, q: R`옌센 부등식을 이용해 $\KL(p\Vert q)\ge0$을 증명하고, 경험분포로 근사했을 때 KL 최소화가 최대가능도와 같음을 보이세요.`,
        sol: R`
$-\ln$은 볼록이므로 $\KL(p\Vert q)=\E_p\big[-\ln\frac{q}{p}\big]\ge-\ln\E_p\big[\frac qp\big]=-\ln\int q\,d\mathbf x=0$.
$p$를 경험분포 $\frac1N\sum\delta(\mathbf x-\mathbf x_n)$으로 바꾸면 $\KL\simeq\frac1N\sum_n\{-\ln q(\mathbf x_n\mid\boldsymbol\theta)+\ln p(\mathbf x_n)\}$. 둘째 항은 $\boldsymbol\theta$와 무관하므로 $\argmin_{\boldsymbol\theta}\KL=\argmax_{\boldsymbol\theta}\sum_n\ln q(\mathbf x_n\mid\boldsymbol\theta)$, 즉 MLE.` },
    ],
  });
})();
