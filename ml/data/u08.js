/* 08 부스팅 — UML 10장, 강의 노트 “Weak Learnability of 3-Piece Classifiers Using Decision Stumps” (Example 10.1), “Proof of the Training Error Bound for AdaBoost” (Theorem 10.2) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 8, part: 'B', title: '부스팅: 약한 학습기를 모아 강하게', en: 'Boosting', ref: 'UML 10장', plot: 'boost',
    fig: R`약한 학습기의 이점 γ가 0.05에서 0.33일 때 AdaBoost 훈련 오차의 상한 exp(−2γ²T)와, 실제 훈련 오차처럼 흩어진 점들`,
    tagline: R`동전 던지기보다 조금만 나은 규칙들도, 틀린 예제에 무게를 옮겨 가며 모으면 훈련 오차가 지수적으로 줄어듭니다.`,
    summary: R`PAC 학습은 임의의 $\varepsilon$을 요구하지만, 실제로는 “무작위 추측보다 $\gamma$만큼 나은” **약한 학습기**를 만들기가 훨씬 쉽습니다. **부스팅**은 약한 학습기를 여러 번 불러 가중 다수결을 만드는 방법입니다. 결정 그루터기(한 좌표의 임계값 규칙)의 ERM은 정렬 한 번이면 효율적으로 풀리고, 강의 노트의 예에서는 “세 조각 분류기” 클래스에 대해 오차 $\le1/3$을 보장해 $\frac1{12}$-약한 학습기가 됩니다. **AdaBoost**는 틀린 예제의 가중치를 $e^{w_t}$배로 키우며, 매 라운드 가중 오차가 $\tfrac12-\gamma$ 이하이면 훈련 오차가 $e^{-2\gamma^2T}$ 이하가 됩니다. 증명은 0–1 손실을 지수 손실로 누르고, 정규화 상수의 비가 정확히 $2\sqrt{\varepsilon_t(1-\varepsilon_t)}$임을 보이는 것입니다. 출력 클래스의 VC 차원은 대략 $T\cdot\VC(B)$에 비례해 $T$가 편향-복잡도 균형을 조절합니다.`,
    goals: [
      R`$\gamma$-약한 학습가능성을 정의하고 PAC 학습가능성과의 차이를 설명할 수 있다`,
      R`세 조각 분류기에 대해 결정 그루터기의 최소 오차가 $\min\{p_1,p_2,p_3\}\le\tfrac13$임을 보일 수 있다`,
      R`AdaBoost의 가중치 $w_t=\tfrac12\ln\frac{1-\varepsilon_t}{\varepsilon_t}$와 분포 갱신을 쓰고 한 라운드를 손으로 계산할 수 있다`,
      R`AdaBoost 훈련 오차 정리 $L_S(h_S)\le e^{-2\gamma^2T}$를 지수 손실과 정규화 상수의 망원곱으로 증명할 수 있다`,
      R`$L(B,T)$의 VC 차원 상한과 $T$가 조절하는 편향-복잡도 균형을 설명할 수 있다`,
    ],
    secTitles: { '10.1': '약한 학습', '10.1b': '결정 그루터기', '10.2': 'AdaBoost', '10.2b': '훈련 오차', '10.3': '선형 결합' },
    sections: [
      { k: '10.1', p: 131, src: '강의 노트 · Example 10.1', title: '약한 학습가능성', body: R`
:::def γ-약한 학습가능성
학습기 $A$가 $\cH$의 **$\gamma$-약한 학습기**라는 것은 $m_\cH:(0,1)\to\mathbb N$이 있어, 모든 $\delta$, 모든 $\cD$, 모든 $f$에 대해 실현가능하면 $m\ge m_\cH(\delta)$개 표본으로 확률 $1-\delta$ 이상 $L_{\cD,f}(A(S))\le\tfrac12-\gamma$인 것이다.
:::

PAC와 비교하면 정확도가 $\varepsilon$ 대신 **고정된** $\tfrac12-\gamma$입니다. 무작위로 찍으면 $\tfrac12$이니, “찍기보다 $\gamma$만큼 낫기만 하면 된다”는 요구입니다. 놀랍게도 약한 학습가능성과 PAC 학습가능성은 **통계적으로** 같습니다(기본 정리: 둘 다 VC 차원이 유한할 때). 차이는 **계산**에 있습니다: 약한 학습기는 대개 훨씬 쉽게 효율적으로 만들 수 있고, 부스팅이 그것을 강한 학습기로 바꿉니다.

:::key 결정 그루터기는 세 조각 분류기의 약한 학습기
$\cH=\{h_{\theta_1,\theta_2,b}\}$: $x<\theta_1$ 또는 $x>\theta_2$이면 $b$, 사이에서는 $-b$ ($\cX=\mathbb R$). $B=\{x\mapsto\sign(x-\theta)\cdot b\}$(결정 그루터기). 실현가능하면
$$\inf_{g\in B}L_{\cD,f}(g)=\min\{p_1,p_2,p_3\}\le\tfrac13,\qquad p_1=\cD(-\infty,\theta_1),\ p_2=\cD[\theta_1,\theta_2],\ p_3=\cD(\theta_2,\infty).$$
따라서 $\ERM_B$는 $\cH$의 $\tfrac1{12}$-약한 학습기이다.
:::

:::hand 강의 노트 — 위아래로 누르기
$b=+1$이라 하고 구간을 $I_1,I_2,I_3$로 부릅니다. **위로:** 상수 $+1$ 그루터기는 $I_2$만 틀려 $p_2$, 문턱 $\theta_1$에서 $+\to-$인 그루터기는 $I_3$만 틀려 $p_3$, 문턱 $\theta_2$에서 $-\to+$는 $I_1$만 틀려 $p_1$. **아래로:** 그루터기는 부호가 한 번만 바뀝니다. 문턱이 $I_1$에 있으면 $I_2\cup I_3$에 한 가지 값을 주는데 $f$는 둘에서 다르므로 하나를 통째로 틀림($\ge\min\{p_2,p_3\}$). $I_2$에 있으면 $I_1$과 $I_3$에 다른 값을 주는데 $f$는 같으므로 하나를 통째로 틀림. $I_3$도 대칭. $p_1+p_2+p_3=1$이라 최소는 $\le\tfrac13=\tfrac12-\tfrac16$; 추정 오차를 $\tfrac1{12}$ 이하로 두면 $\tfrac12-\tfrac1{12}$가 보장됩니다.
:::
` },
      { k: '10.1b', p: 133, title: '결정 그루터기의 ERM', body: R`
$\cX=\mathbb R^d$에서 결정 그루터기는 $h_{j,\theta,b}(x)=b\cdot\sign(\theta-x_j)$ — 좌표 $j$ 하나를 문턱 $\theta$와 비교합니다. 부스팅에서는 표본에 **분포** $D=(D_1,\dots,D_m)$이 붙어 있으므로 가중 오차
$$L_D(h)=\sum_{i=1}^mD_i\one[h(x_i)\ne y_i]$$
를 최소로 해야 합니다.

**효율적 구현.** 좌표 $j$를 고정하면 $x_{1,j}\le\dots\le x_{m,j}$로 정렬했을 때 서로 다른 행동을 하는 문턱은 이웃한 값의 중점 $m+1$개뿐입니다. 문턱을 한 칸 옮길 때 오차는 한 예제의 기여만 바뀌므로 누적합으로 $O(m)$에 모두 계산됩니다. 좌표 $d$개면 정렬 후 $O(dm)$.

:::tip b = ±1의 역할
$b$를 뒤집으면 가중 오차가 $1-L_D$가 됩니다. 그래서 오차가 $\tfrac12$보다 큰 그루터기는 뒤집으면 $\tfrac12$보다 작아집니다 — “찍기보다 나쁜” 규칙도 약한 학습기의 재료가 됩니다.
:::
` },
      { k: '10.2', p: 134, title: 'AdaBoost', body: R`
:::def AdaBoost
입력: 표본 $S$, 약한 학습기 WL, 라운드 수 $T$. $D^{(1)}=(\frac1m,\dots,\frac1m)$.

$t=1,\dots,T$:
1. $h_t=\mathrm{WL}(D^{(t)},S)$
2. $\varepsilon_t=\sum_iD^{(t)}_i\one[y_i\ne h_t(x_i)]$
3. $w_t=\frac12\ln\!\Big(\frac1{\varepsilon_t}-1\Big)$
4. $D^{(t+1)}_i=\dfrac{D^{(t)}_i\exp(-w_ty_ih_t(x_i))}{\sum_jD^{(t)}_j\exp(-w_ty_jh_t(x_j))}$

출력: $h_S(x)=\sign\Big(\sum_{t=1}^Tw_th_t(x)\Big)$.
:::

- $\varepsilon_t<\tfrac12$이면 $w_t>0$이고, 오차가 작을수록 투표 가중치가 큽니다.
- 맞힌 예제는 $e^{-w_t}$배, 틀린 예제는 $e^{w_t}$배. 갱신 후에는 **$h_t$의 가중 오차가 정확히 $\tfrac12$**가 되어, 다음 약한 학습기는 $h_t$와 다른 것을 배워야 합니다.

:::ex 예제 — 한 라운드
$m=5$, 균등 분포에서 $h_1$이 한 예제만 틀렸다. $\varepsilon_1,w_1$과 갱신 후 틀린 예제의 가중치는?
---
$\varepsilon_1=0.2$, $w_1=\frac12\ln4=\ln2\approx0.693$. 틀린 예제 $0.2\cdot e^{w_1}=0.4$, 맞힌 예제 각각 $0.2\cdot e^{-w_1}=0.1$. 합 $0.4+4(0.1)=0.8$로 나누면 틀린 예제 $0.5$, 맞힌 예제 각각 $0.125$. 틀린 예제의 무게가 $\tfrac12$이 되었습니다.
:::
` },
      { k: '10.2b', p: 135, src: '강의 노트 · Theorem 10.2', title: 'AdaBoost의 훈련 오차', body: R`
:::key AdaBoost 훈련 오차 정리
모든 라운드에서 $\varepsilon_t\le\tfrac12-\gamma$이면
$$L_S(h_S)=\frac1m\sum_{i=1}^m\one[h_S(x_i)\ne y_i]\le\exp(-2\gamma^2T).$$
:::

:::hand 강의 노트 — 네 단계
$f_t=\sum_{p\le t}w_ph_p$ ($f_0=0$), $Z_t=\frac1m\sum_ie^{-y_if_t(x_i)}$ ($Z_0=1$).

**1. 지수 손실이 0–1 손실을 누른다.** $\one[\sign(f)\ne y]=\one[yf\le0]\le e^{-yf}$이므로 $L_S(h_S)\le Z_T$.

**2. 분포는 지수 손실의 정규화다.** 귀납법으로 $D^{(t+1)}_i=\dfrac{e^{-y_if_t(x_i)}}{\sum_je^{-y_jf_t(x_j)}}$ — 갱신식의 곱이 누적되고 분모가 약분됩니다.

**3. 비가 정확히 계산된다.** 2를 쓰면
$$\frac{Z_{t+1}}{Z_t}=\sum_iD^{(t+1)}_ie^{-w_{t+1}y_ih_{t+1}(x_i)}=e^{-w_{t+1}}(1-\varepsilon_{t+1})+e^{w_{t+1}}\varepsilon_{t+1}=2\sqrt{\varepsilon_{t+1}(1-\varepsilon_{t+1})}.$$
($e^{w}=\sqrt{(1-\varepsilon)/\varepsilon}$을 넣으면 두 항이 모두 $\sqrt{\varepsilon(1-\varepsilon)}$.)

**4. 약한 학습 가정.** $a(1-a)$는 $[0,\tfrac12]$에서 증가하므로 $\varepsilon\le\tfrac12-\gamma$이면 $2\sqrt{\varepsilon(1-\varepsilon)}\le\sqrt{1-4\gamma^2}\le e^{-2\gamma^2}$ ($1-u\le e^{-u}$). 망원곱으로 $Z_T=\prod_t\frac{Z_t}{Z_{t-1}}\le e^{-2\gamma^2T}$.
:::

:::note 가중치 w_t는 어디서 왔나
3단계의 $g(w)=e^{-w}(1-\varepsilon)+e^{w}\varepsilon$를 $w$로 최소화하면 $g'(w)=0\iff e^{2w}=\frac{1-\varepsilon}\varepsilon$, 즉 $w=\frac12\ln\frac{1-\varepsilon}\varepsilon$. AdaBoost는 매 라운드 **지수 손실을 탐욕적으로 가장 많이 줄이는** 가중치를 고릅니다.
:::

:::warn 훈련 오차일 뿐
정리는 $L_S$에 대한 것입니다. $T$가 커지면 출력 클래스가 풍부해져 과적합할 수 있고, 참 오차는 다음 절의 VC 분석으로 따로 다뤄야 합니다.
:::
` },
      { k: '10.3', p: 137, title: '기초 가설의 선형 결합', body: R`
AdaBoost의 출력은 다음 클래스에 속합니다.
$$L(B,T)=\Big\{x\mapsto\sign\Big(\sum_{t=1}^Tw_th_t(x)\Big):w\in\mathbb R^T,\ h_t\in B\Big\}.$$

:::key 선형 결합 클래스의 VC 차원
$T\ge3$, $\VC(B)\ge3$이면
$$\VC\big(L(B,T)\big)\le T\big(\VC(B)+1\big)\Big(3\log\big(T(\VC(B)+1)\big)+2\Big).$$
:::

증명 요지: $L(B,T)$가 분쇄하는 $m$점 위에서 $B$는 사우어로 $(em/d)^d$가지 행동만 하고, $T$개를 고르는 방법은 $(em/d)^{dT}$ 이하, 각 선택 위의 반공간은 $(em/T)^T$가지. 합해 $2^m$ 미만이 되는 $m$을 찾으면 됩니다.

즉 VC 차원은 대략 $\tilde O(T\cdot\VC(B))$입니다. $T$가 크면 근사 오차↓(표현력↑), 추정 오차↑. **$T$ 하나로 편향-복잡도 균형을 조절**할 수 있다는 것이 부스팅의 실용적 장점입니다.

:::note 얼굴 검출
Viola–Jones는 직사각형 영역의 밝기 차이를 재는 수많은 특징 위의 결정 그루터기를 기초 가설로 AdaBoost를 돌려, 실시간 얼굴 검출을 처음 실용화했습니다(교재 10.4). 약한 학습기가 싸기 때문에 가능한 일입니다.
:::

:::note 의료 인공지능 과목과의 연결
배깅이 여러 모델을 **독립적으로** 학습해 평균한다면, 부스팅은 앞 모델의 실수에 무게를 두어 **순차적으로** 학습합니다[[@med:ch11:9.6|앙상블, 배깅, 부스팅의 비교.]].
:::
` },
    ],
    problems: [
      { sec: '10.1', type: 'mc', lv: 1, q: R`$\gamma$-약한 학습기가 보장하는 오차는?`,
        choices: [R`임의의 $\varepsilon$ 이하`, R`$\tfrac12-\gamma$ 이하 (확률 $1-\delta$)`, R`$\gamma$ 이하`, R`$\tfrac12$ 이상`], ans: 1,
        sol: R`정확도는 고정된 $\tfrac12-\gamma$이고 신뢰도 $\delta$만 임의입니다.` },
      { sec: '10.1', type: 'num', lv: 2, q: R`세 조각 분류기에서 $p_1=0.5$, $p_2=0.2$, $p_3=0.3$일 때 결정 그루터기의 최소 오차는?`, ans: '0.2', ansTex: R`\min\{p_1,p_2,p_3\}=0.2`,
        sol: R`상수 그루터기가 가운데 구간만 틀려 $p_2=0.2$. 어떤 그루터기도 이보다 나을 수 없습니다.` },
      { sec: '10.1b', type: 'mc', lv: 2, q: R`가중 오차가 $0.7$인 결정 그루터기 $h$에 대해 옳은 것은?`,
        choices: [R`쓸모없다`, R`$-h$(부호를 뒤집은 그루터기)의 가중 오차는 $0.3$이다`, R`AdaBoost의 가중치가 0이다`, R`$\gamma=0.2$인 약한 학습기다`], ans: 1,
        sol: R`$b$를 뒤집으면 오차가 $1-0.7=0.3$. 그루터기 클래스는 부호 뒤집기에 닫혀 있어 ERM은 늘 $\le\tfrac12$을 찾습니다.` },
      { sec: '10.2', type: 'num', lv: 1, q: R`$\varepsilon_t=0.1$일 때 AdaBoost의 가중치 $w_t=\tfrac12\ln(1/\varepsilon_t-1)$은? (소수 넷째 자리)`, ans: '0.5*ln(9)', ansTex: R`\tfrac12\ln9=\ln3\approx1.0986`,
        sol: R`$\tfrac12\ln9=\ln3\approx1.0986$.` },
      { sec: '10.2', type: 'num', lv: 2, q: R`$\varepsilon_t=0.25$인 라운드에서 틀린 예제들의 가중치 합은 갱신 후 얼마가 되나?`, ans: '0.5', ansTex: R`\tfrac12`,
        sol: R`틀린 쪽 $\varepsilon e^{w}=\sqrt{\varepsilon(1-\varepsilon)}$, 맞힌 쪽 $(1-\varepsilon)e^{-w}=\sqrt{\varepsilon(1-\varepsilon)}$로 같아 정규화하면 각각 $\tfrac12$. 언제나 그렇습니다.` },
      { sec: '10.2', type: 'mc', lv: 2, q: R`AdaBoost에서 $\varepsilon_t>\tfrac12$인 가설이 나오면 $w_t$는?`,
        choices: [R`양수`, R`음수 — 사실상 $-h_t$를 양의 가중치로 쓰는 셈`, R`0`, R`정의되지 않는다`], ans: 1,
        sol: R`$1/\varepsilon_t-1<1$이라 로그가 음수. $w_th_t=\lvert w_t\rvert(-h_t)$이고 $-h_t$의 오차는 $1-\varepsilon_t<\tfrac12$입니다.` },
      { sec: '10.2b', type: 'num', lv: 2, q: R`$\varepsilon_{t+1}=0.3$일 때 $Z_{t+1}/Z_t=2\sqrt{\varepsilon(1-\varepsilon)}$은? (소수 넷째 자리)`, ans: '2*sqrt(0.21)', ansTex: R`2\sqrt{0.21}\approx0.9165`,
        sol: R`$2\sqrt{0.3\cdot0.7}=2\sqrt{0.21}\approx0.9165$. 라운드마다 지수 손실이 약 8% 줄어듭니다.` },
      { sec: '10.2b', type: 'num', lv: 2, q: R`$\gamma=0.1$일 때 훈련 오차 상한 $e^{-2\gamma^2T}$이 $0.01$ 이하가 되는 최소 $T$는?`, ans: '231', ansTex: R`\lceil\ln100/0.02\rceil=231`,
        sol: R`$e^{-0.02T}\le0.01\iff T\ge\ln100/0.02=230.3$. 따라서 231.` },
      { sec: '10.2b', type: 'mc', lv: 3, q: R`훈련 표본이 $m$개일 때, 상한 $e^{-2\gamma^2T}<\frac1m$이 되면 무엇을 알 수 있나?`,
        choices: [R`참 오차가 0이다`, R`훈련 오차가 $\frac1m$의 배수이므로 정확히 0이다`, R`과적합이 없다`, R`$\gamma$가 커진다`], ans: 1,
        sol: R`$L_S$는 $0,\frac1m,\frac2m,\dots$ 중 하나이므로 $\frac1m$ 미만이면 0입니다. $T>\frac{\ln m}{2\gamma^2}$이면 훈련 자료를 완벽히 맞힙니다. 참 오차는 별개입니다.` },
      { sec: '10.3', type: 'mc', lv: 2, q: R`AdaBoost의 라운드 수 $T$를 늘릴 때 일반적으로 일어나는 일은?`,
        choices: [R`근사 오차↑, 추정 오차↓`, R`근사 오차↓, 추정 오차↑ ($\VC(L(B,T))$가 대략 $T\cdot\VC(B)$로 커짐)`, R`둘 다 감소`, R`VC 차원이 줄어든다`], ans: 1,
        sol: R`$T$는 출력 클래스의 복잡도를 조절하는 손잡이입니다.` },
      { sec: '10.1', type: 'open', lv: 2, proof: true, q: R`세 조각 분류기 클래스에서 실현가능할 때 모든 결정 그루터기 $g$에 대해 $L_{\cD,f}(g)\ge\min\{p_1,p_2,p_3\}$임을 증명하고, 이 최소가 실제로 달성됨을 보이세요.`,
        sol: R`
$f=+1$ on $I_1\cup I_3$, $-1$ on $I_2$ ($b=+1$로 가정).
하한: 그루터기 $g$는 부호가 한 번 바뀝니다(상수면 바뀌지 않음). 문턱이 $I_1$(또는 왼쪽 밖)에 있으면 $g$는 $I_2\cup I_3$에서 상수 — $f$는 $I_2$와 $I_3$에서 다르므로 둘 중 하나 전체를 틀려 $\ge\min\{p_2,p_3\}$. 문턱이 $I_2$에 있으면 $g$는 $I_1$과 $I_3$에서 반대 부호인데 $f$는 같으므로 $\ge\min\{p_1,p_3\}$. $I_3$은 대칭으로 $\ge\min\{p_1,p_2\}$. 어느 경우든 $\ge\min\{p_1,p_2,p_3\}$.
달성: $g\equiv+1$은 $I_2$만 틀려 $p_2$; 문턱 $\theta_1$에서 $+\to-$는 $I_3$만 틀려 $p_3$; 문턱 $\theta_2$에서 $-\to+$는 $I_1$만 틀려 $p_1$.`,
        rubric: R`
- 그루터기가 부호를 한 번만 바꾼다는 관찰 — 2점
- 문턱 위치 세 경우의 하한 — 5점
- 세 그루터기로 달성 — 3점` },
      { sec: '10.2b', type: 'open', lv: 3, proof: true, q: R`AdaBoost에서 $Z_t=\frac1m\sum_ie^{-y_if_t(x_i)}$라 할 때 $\frac{Z_{t+1}}{Z_t}=2\sqrt{\varepsilon_{t+1}(1-\varepsilon_{t+1})}$임을 보이고, 이를 이용해 $L_S(h_S)\le e^{-2\gamma^2T}$를 증명하세요. ($D^{(t+1)}_i\propto e^{-y_if_t(x_i)}$는 써도 됩니다.)`,
        sol: R`
$f_{t+1}=f_t+w_{t+1}h_{t+1}$이므로 $\frac{Z_{t+1}}{Z_t}=\frac{\sum_ie^{-y_if_t(x_i)}e^{-w_{t+1}y_ih_{t+1}(x_i)}}{\sum_je^{-y_jf_t(x_j)}}=\sum_iD^{(t+1)}_ie^{-w_{t+1}y_ih_{t+1}(x_i)}$.
맞힌 예제 $y_ih=1$, 틀린 예제 $-1$로 나누면 $=e^{-w}(1-\varepsilon)+e^{w}\varepsilon$. $e^w=\sqrt{(1-\varepsilon)/\varepsilon}$ 대입: $\sqrt{\varepsilon(1-\varepsilon)}+\sqrt{\varepsilon(1-\varepsilon)}$.
$a(1-a)$는 $[0,\frac12]$에서 증가, $\varepsilon\le\frac12-\gamma$이므로 $\le2\sqrt{(\frac12-\gamma)(\frac12+\gamma)}=\sqrt{1-4\gamma^2}\le\sqrt{e^{-4\gamma^2}}=e^{-2\gamma^2}$.
$Z_T=Z_0\prod_{t}\frac{Z_{t+1}}{Z_t}\le e^{-2\gamma^2T}$ ($Z_0=1$). 마지막으로 $\one[h_S(x_i)\ne y_i]\le e^{-y_if_T(x_i)}$이므로 $L_S(h_S)\le Z_T$.`,
        rubric: R`
- 비를 $D^{(t+1)}$의 가중합으로 — 3점
- 맞힘/틀림 분리와 $2\sqrt{\varepsilon(1-\varepsilon)}$ — 3점
- 단조성과 $1-u\le e^{-u}$ — 2점
- 망원곱과 0–1 ≤ 지수 손실 — 2점` },
    ],
  });
})();
