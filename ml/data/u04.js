/* 04 공짜 점심은 없다와 편향-복잡도 균형 — UML 5장, 강의 노트 “A Proof of Theorem 5.1 (No-Free-Lunch)” */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 4, part: 'A', title: '공짜 점심은 없다: 편향과 복잡도의 균형', en: 'The Bias-Complexity Tradeoff', ref: 'UML 5장', plot: 'tradeoff',
    fig: R`가설 클래스가 풍부해질수록 줄어드는 근사 오차(굵은 선 하나)와, 표본 수에 따라 달리 커지는 추정 오차, 그리고 둘의 합`,
    tagline: R`어떤 학습기도 모든 문제에서 이길 수는 없습니다. 보지 못한 점의 레이블은 세상이 마음대로 정할 수 있기 때문입니다.`,
    summary: R`어떤 가정도 없이 모든 문제를 푸는 “만능 학습기”가 있을까요? **공짜 점심은 없다(No-Free-Lunch) 정리**는 없다고 답합니다. 표본 수 $m$이 정의역 크기의 절반보다 작으면, 어떤 학습기 $A$에 대해서도 오차 0인 함수가 있는 분포 $\cD$가 있어 확률 $1/7$ 이상으로 $L_\cD(A(S))\ge1/8$입니다. 증명은 $2m$개의 점 위의 모든 레이블링을 평균하고, 표본에 나오지 않은 점마다 레이블을 뒤집은 “짝”을 만들어 학습기가 둘 중 하나는 반드시 틀리게 하는 것입니다. 그래서 무한 정의역 위의 모든 함수 클래스는 PAC 학습가능하지 않고, **사전 지식**(가설 클래스의 선택)이 필요합니다. 그 선택의 대가를 **근사 오차**와 **추정 오차**로 나누면 편향-복잡도 균형이 됩니다.`,
    goals: [
      R`공짜 점심은 없다 정리를 조건($m<\lvert\cX\rvert/2$)과 결론(1/8, 1/7)까지 정확히 쓸 수 있다`,
      R`최댓값 ≥ 평균 ≥ 최솟값 논법과 “보지 못한 점의 짝짓기”로 기대 오차 1/4 하한을 증명할 수 있다`,
      R`$[0,1]$ 값 확률변수의 기댓값 하한을 확률 하한으로 바꾸는 계산(1/4 ⇒ 1/7)을 할 수 있다`,
      R`무한 정의역의 모든 함수 클래스가 PAC 학습가능하지 않음을 유도할 수 있다`,
      R`$L_\cD(h_S)=\varepsilon_{\mathrm{app}}+\varepsilon_{\mathrm{est}}$ 분해로 클래스 선택의 균형을 설명할 수 있다`,
    ],
    secTitles: { '5.1': '정리의 진술', '5.1b': '증명', '5.1c': '사전 지식', '5.2': '오차 분해' },
    sections: [
      { k: '5.1', p: 61, title: '공짜 점심은 없다 정리', body: R`
:::key 공짜 점심은 없다 정리
$A$를 정의역 $\cX$ 위 이진 분류(0–1 손실)의 임의의 학습 알고리즘, $m<\lvert\cX\rvert/2$를 표본 수라 하자. 그러면 $\cX\times\{0,1\}$ 위의 분포 $\cD$가 있어서
1. $L_\cD(f)=0$인 함수 $f:\cX\to\{0,1\}$가 있고,
2. 확률 $1/7$ 이상으로($S\sim\cD^m$에 대해) $L_\cD(A(S))\ge1/8$.
:::

양화사의 순서를 보세요. **학습기를 먼저 고르면, 그 학습기를 골탕 먹이는 분포가 따라 나옵니다.** 분포 쪽은 완벽하게 실현가능한데도 그렇습니다. 즉 “모든 문제에서 잘하는 학습기”는 없고, 어떤 학습기가 잘하는 문제가 있으면 못하는 문제도 있습니다.

:::hand 강의 노트 — 핵심 한 줄
학습기가 레이블을 한 번도 보지 못한 점이 있으면, 그 점의 레이블은 세상이 적대적으로 정할 수 있다. 이것이 정리의 전부입니다.
:::
` },
      { k: '5.1b', p: 62, src: '강의 노트 · Theorem 5.1', title: '증명: 평균하고, 짝짓기', body: R`
$m<\lvert\cX\rvert/2$이므로 크기 $2m$인 부분집합 $C\subseteq\cX$를 잡습니다. $C$ 위의 레이블링은 $T=2^{2m}$개 $f_1,\dots,f_T$이고, 각각에 대해 $\cD_i$를 “$C$ 위 균등, 레이블은 $f_i$”로 정합니다. 모두 $L_{\cD_i}(f_i)=0$입니다.

**목표.** $\displaystyle\max_{i\in[T]}\E_{S\sim\cD_i^m}\big[L_{\cD_i}(A(S))\big]\ge\frac14.$

**1. 표본을 열거.** 입력 수열 $S_j=(x_1,\dots,x_m)\in C^m$은 $k=(2m)^m$개이고 모두 같은 확률입니다. $S_j^i$를 $f_i$로 레이블한 표본이라 하면 $\E_{S\sim\cD_i^m}[L_{\cD_i}(A(S))]=\frac1k\sum_jL_{\cD_i}(A(S_j^i))$.

**2. 최댓값 ≥ 평균 ≥ 최솟값.**
$$\max_i\frac1k\sum_jL_{\cD_i}(A(S^i_j))\ge\frac1T\sum_i\frac1k\sum_jL_{\cD_i}(A(S^i_j))=\frac1k\sum_j\frac1T\sum_iL_{\cD_i}(A(S^i_j))\ge\min_j\frac1T\sum_iL_{\cD_i}(A(S^i_j)).$$
그러니 **고정된 입력 수열 $S_j$마다** $\frac1T\sum_iL_{\cD_i}(A(S^i_j))\ge\frac14$를 보이면 됩니다.

**3. 보지 못한 점.** $S_j$에 나오지 않는 $C$의 점을 $v_1,\dots,v_p$라 하면 $p\ge m$. $\cD_i$가 $2m$점 위 균등이므로 어떤 $h$에 대해서도
$$L_{\cD_i}(h)=\frac1{2m}\sum_{x\in C}\one[h(x)\ne f_i(x)]\ge\frac1{2m}\sum_{r=1}^p\one[h(v_r)\ne f_i(v_r)]\ge\frac1{2p}\sum_{r=1}^p\one[h(v_r)\ne f_i(v_r)].$$

**4. 짝짓기.** $r$을 고정하고, $v_r$에서만 다르고 나머지는 같은 레이블링끼리 $T/2$개의 짝 $(f_i,f_{i'})$을 만듭니다. $v_r$은 표본에 없으므로 $S_j^i=S_j^{i'}$이고 $A$의 출력 $h$가 같습니다. $h(v_r)$은 $f_i(v_r)$, $f_{i'}(v_r)$ 중 **정확히 하나**와 다르므로 짝마다 오답 표시의 합은 1. 따라서 $\frac1T\sum_i\one[A(S^i_j)(v_r)\ne f_i(v_r)]=\frac12$.

**5. 합치기.** $\frac1T\sum_iL_{\cD_i}(A(S_j^i))\ge\frac1{2p}\sum_{r=1}^p\frac12=\frac14$.

:::key 기댓값 하한에서 확률 하한으로
$\theta\in[0,1]$이고 $\E[\theta]\ge\tfrac14$이면 $\Prob[\theta\ge\tfrac18]\ge\tfrac17$.
:::

$P=\Prob[\theta\ge\tfrac18]$이라 하면 $\theta<\tfrac18$인 부분은 $\tfrac18$ 미만, 나머지는 1 이하이므로 $\E[\theta]<(1-P)\cdot\tfrac18+P\cdot1$. $\tfrac14\le\tfrac18+\tfrac78P$에서 $P\ge\tfrac17$. 목표를 이루는 $i$로 $\cD=\cD_i$, $f=f_i$를 잡으면 정리가 끝납니다.
` },
      { k: '5.1c', p: 63, title: '사전 지식이 필요하다', body: R`
:::key 모든 함수의 클래스는 학습할 수 없다
$\cX$가 무한 집합이고 $\cH$가 $\cX$에서 $\{0,1\}$로 가는 **모든 함수**의 클래스이면 $\cH$는 PAC 학습가능하지 않다.
:::

PAC 학습가능하다고 하고 $\varepsilon<\tfrac18$, $\delta<\tfrac17$을 잡으면, 어떤 유한한 $m$이 $m_\cH(\varepsilon,\delta)$라는 것입니다. 그러나 $\lvert\cX\rvert=\infty>2m$이라 공짜 점심은 없다 정리가 적용되고, 실현가능한 분포($f\in\cH$)에서 확률 $1/7>\delta$로 오차 $1/8>\varepsilon$을 내는 분포가 있어 모순입니다.

:::note 사전 지식을 넣는 두 방법
1. **가설 클래스를 제한**: “참 함수는 $\cH$ 안에 있다”(또는 가깝다)고 믿는 것. 이 과목의 주된 방법입니다.
2. **분포에 가정을 둠**: 예컨대 $\cD$가 특정 모수족에 속한다. 통계학의 모수적 방법이 여기에 해당합니다.

어느 쪽이든 “세상이 이런 모양일 것”이라는 믿음이 틀리면 대가를 치릅니다. 그 대가가 다음 절의 근사 오차입니다.
:::
` },
      { k: '5.2', p: 64, title: '오차 분해: 근사 오차와 추정 오차', body: R`
ERM이 고른 $h_S\in\cH$의 참 위험을 두 부분으로 나눕니다.

:::key 오차 분해
$$L_\cD(h_S)=\varepsilon_{\mathrm{app}}+\varepsilon_{\mathrm{est}},\qquad\varepsilon_{\mathrm{app}}=\min_{h\in\cH}L_\cD(h),\qquad\varepsilon_{\mathrm{est}}=L_\cD(h_S)-\varepsilon_{\mathrm{app}}.$$
:::

- **근사 오차**(approximation error): 클래스 안의 최선이 얼마나 나쁜가. 표본과 무관하고 $\cH$의 선택(귀납적 편향)만으로 정해집니다. 실현가능하면 0. 베이즈 위험보다 작아질 수는 없습니다.
- **추정 오차**(estimation error): 표본이 유한해서 최선을 놓친 만큼. $\cH$가 풍부할수록 커지고(유한 클래스에서 $\ln\lvert\cH\rvert$에 비례), 표본이 많을수록 작아집니다.

:::tip 균형
$\cH$를 키우면 $\varepsilon_{\mathrm{app}}\downarrow$, $\varepsilon_{\mathrm{est}}\uparrow$(과적합). 줄이면 반대(과소적합). 표지 그림의 U자 곡선이 이 합이고, 바닥의 위치는 표본 수에 따라 오른쪽으로 옮겨 갑니다. 이 선택을 자료로 하는 방법이 6단원의 구조적 위험 최소화입니다.
:::

:::ex 예제 — 분해 읽기
어떤 문제의 베이즈 위험이 0.05, 클래스 최선이 0.12, ERM 출력의 참 위험이 0.20이다. 근사 오차와 추정 오차는?
---
$\varepsilon_{\mathrm{app}}=0.12$ (이 중 0.05는 어떤 클래스로도 없앨 수 없는 잡음, 0.07은 클래스가 좁아서 생긴 몫), $\varepsilon_{\mathrm{est}}=0.20-0.12=0.08$.
:::
` },
    ],
    problems: [
      { sec: '5.1', type: 'mc', lv: 1, q: R`공짜 점심은 없다 정리의 결론에서 “확률 $1/7$ 이상으로 $L_\cD(A(S))\ge1/8$”을 만족시키는 분포 $\cD$는 무엇에 따라 정해지나?`,
        choices: [R`표본 $S$`, R`학습 알고리즘 $A$(와 $m$)`, R`정확도 $\varepsilon$`, R`어떤 학습기에도 통하는 하나의 분포`], ans: 1,
        sol: R`“모든 $A$에 대해 $\cD$가 있다” — 분포는 학습기에 맞춰 고릅니다. 모든 학습기를 한꺼번에 골탕 먹이는 분포 하나가 있다는 말이 아닙니다.` },
      { sec: '5.1b', type: 'num', lv: 1, q: R`$m=3$일 때 증명에서 쓰는 집합 $C$ 위의 레이블링 개수 $T$는?`, ans: '64', ansTex: R`2^{6}=64`,
        sol: R`$\lvert C\rvert=2m=6$이므로 $T=2^6=64$.` },
      { sec: '5.1b', type: 'num', lv: 2, q: R`$m=3$일 때 가능한 입력 수열 $S_j\in C^m$의 개수 $k$는?`, ans: '216', ansTex: R`6^3=216`,
        sol: R`$k=(2m)^m=6^3=216$.` },
      { sec: '5.1b', type: 'mc', lv: 2, q: R`짝짓기 단계에서 $A(S_j^i)=A(S_j^{i'})$가 되는 이유는?`,
        choices: [R`$A$가 ERM이므로`, R`$f_i$와 $f_{i'}$는 $v_r$에서만 다르고 $v_r$은 표본에 나오지 않아 두 표본이 똑같으므로`, R`$\cD_i=\cD_{i'}$이므로`, R`$p\ge m$이므로`], ans: 1,
        sol: R`학습기의 입력이 같으면 출력도 같습니다(결정적 학습기). 두 세계는 표본에서 구별되지 않으므로 $v_r$에서 둘 중 하나는 반드시 틀립니다.` },
      { sec: '5.1b', type: 'mc', lv: 2, q: R`3단계에서 $\frac1{2m}\ge\frac1{2p}$를 쓸 수 있는 근거는?`,
        choices: [R`$p\le m$`, R`$p\ge m$ (표본에 $m$개 이하의 서로 다른 점만 나오므로)`, R`$p=2m$`, R`$T\ge k$`], ans: 1,
        sol: R`수열 길이가 $m$이라 나타나는 서로 다른 점은 $m$개 이하, 따라서 보지 못한 점 $p\ge2m-m=m$. 그래서 $\frac1{2m}\ge\frac1{2p}$입니다.` },
      { sec: '5.1b', type: 'num', lv: 2, q: R`$\theta\in[0,1]$, $\E[\theta]\ge0.3$일 때 같은 논법으로 얻는 $\Prob[\theta\ge0.1]$의 하한은? (분수로)`, ans: '2/9', ansTex: R`\tfrac29`,
        sol: R`$\E\theta<(1-P)0.1+P\cdot1=0.1+0.9P$. $0.3\le0.1+0.9P$에서 $P\ge2/9$.` },
      { sec: '5.1c', type: 'mc', lv: 2, q: R`다음 중 공짜 점심은 없다 정리로부터 **따르지 않는** 것은?`,
        choices: [R`무한 정의역 위 모든 이진 함수의 클래스는 PAC 학습가능하지 않다`, R`어떤 학습기가 잘하는 문제가 있으면 못하는 문제도 있다`, R`유한 정의역 $\lvert\cX\rvert=10$ 위의 모든 함수의 클래스는 PAC 학습가능하지 않다`, R`학습에는 사전 지식이 필요하다`], ans: 2,
        sol: R`유한 정의역에서는 모든 함수의 클래스도 크기 $2^{10}$인 유한 클래스라 PAC 학습가능합니다(표본 수는 $m\ge\lvert\cX\rvert/2$ 정도 필요). 정리는 $m<\lvert\cX\rvert/2$일 때만 적용됩니다.` },
      { sec: '5.2', type: 'mc', lv: 1, q: R`가설 클래스를 더 풍부하게 바꿨을 때 일반적으로 일어나는 일은?`,
        choices: [R`근사 오차 증가, 추정 오차 감소`, R`근사 오차 감소, 추정 오차 증가`, R`둘 다 감소`, R`둘 다 증가`], ans: 1,
        sol: R`클래스가 넓으면 최선이 더 좋아지지만(근사 오차↓), 같은 표본으로 그 최선을 찾기 어려워집니다(추정 오차↑).` },
      { sec: '5.2', type: 'num', lv: 1, q: R`클래스 최선의 위험이 0.18, ERM 출력의 위험이 0.25일 때 추정 오차는?`, ans: '0.07', ansTex: R`0.07`,
        sol: R`$\varepsilon_{\mathrm{est}}=0.25-0.18=0.07$.` },
      { sec: '5.2', type: 'mc', lv: 2, q: R`실현가능성 가정이 성립할 때 옳은 것은?`,
        choices: [R`$\varepsilon_{\mathrm{est}}=0$`, R`$\varepsilon_{\mathrm{app}}=0$`, R`$L_\cD(h_S)=0$`, R`베이즈 위험이 양수이다`], ans: 1,
        sol: R`클래스 안에 오차 0인 가설이 있으므로 근사 오차가 0이고, 남는 것은 추정 오차뿐입니다. 이것이 1단원의 분석 대상이었습니다.` },
      { sec: '5.1b', type: 'open', lv: 3, proof: true, q: R`공짜 점심은 없다 정리의 증명에서, 고정된 입력 수열 $S_j$에 대해 $\frac1T\sum_{i=1}^TL_{\cD_i}(A(S_j^i))\ge\frac14$임을 보이세요. 보지 못한 점의 수와 짝짓기 논증을 모두 쓰세요.`,
        sol: R`
보지 못한 점 $v_1,\dots,v_p$, $p\ge m$. 균등분포이므로 $L_{\cD_i}(h)\ge\frac1{2m}\sum_{r\le p}\one[h(v_r)\ne f_i(v_r)]\ge\frac1{2p}\sum_{r\le p}\one[h(v_r)\ne f_i(v_r)]$.
$h=A(S^i_j)$로 두고 $i$에 대해 평균: $\frac1T\sum_iL_{\cD_i}(A(S^i_j))\ge\frac1{2p}\sum_r\frac1T\sum_i\one[A(S^i_j)(v_r)\ne f_i(v_r)]$.
$r$ 고정: 레이블링을 $v_r$에서만 다른 짝 $(f_i,f_{i'})$으로 나눔($T/2$쌍). $v_r\notin S_j$이므로 $S_j^i=S_j^{i'}$, 출력 $h$ 동일. $f_i(v_r)\ne f_{i'}(v_r)$이라 $\one[h(v_r)\ne f_i(v_r)]+\one[h(v_r)\ne f_{i'}(v_r)]=1$. 합하면 $\frac1T\sum_i\one[\cdot]=\frac12$.
따라서 $\ge\frac1{2p}\cdot p\cdot\frac12=\frac14$.`,
        rubric: R`
- $p\ge m$과 보지 못한 점으로의 하한 — 3점
- $i$에 대한 평균과 합의 순서 교환 — 2점
- 짝짓기(표본 동일 ⇒ 출력 동일, 정확히 하나 틀림) — 4점
- $\frac14$ 결론 — 1점` },
      { sec: '5.1c', type: 'open', lv: 2, proof: true, q: R`무한 정의역 $\cX$ 위의 모든 함수 $\cX\to\{0,1\}$로 이루어진 클래스가 PAC 학습가능하지 않음을 공짜 점심은 없다 정리로 증명하세요.`,
        sol: R`
귀류법. PAC 학습가능하다면 $m_\cH$와 $A$가 있어 모든 실현가능한 $(\cD,f)$에서 $m\ge m_\cH(\varepsilon,\delta)$이면 $\Prob[L_\cD(A(S))\le\varepsilon]\ge1-\delta$.
$\varepsilon<1/8$, $\delta<1/7$로 잡고 $m=m_\cH(\varepsilon,\delta)$. $\cX$가 무한이라 $m<\lvert\cX\rvert/2$이므로 정리가 적용되어, $L_\cD(f)=0$인 $f$(이는 $\cH$에 속하므로 실현가능)와 $\Prob[L_\cD(A(S))\ge1/8]\ge1/7$인 $\cD$가 있습니다.
그러면 $\Prob[L_\cD(A(S))>\varepsilon]\ge\Prob[L_\cD(A(S))\ge1/8]\ge1/7>\delta$로 PAC 보장과 모순.`,
        rubric: R`
- 귀류 가정과 $\varepsilon<1/8$, $\delta<1/7$ 선택 — 3점
- $m<\lvert\cX\rvert/2$로 정리 적용, 실현가능성 확인 — 4점
- 모순 도출 — 3점` },
    ],
  });
})();
