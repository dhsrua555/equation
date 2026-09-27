/* 16 온라인 학습 — UML 21장, 강의 노트 “Section 21.2: Online Classification in the Unrealizable Case” */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 16, part: 'C', title: '온라인 학습', en: 'Online Learning', ref: 'UML 21장', plot: 'wm',
    fig: R`가중 다수결에서 전문가들의 가중치 exp(−η·누적 실수): 실수가 적은 전문가(굵은 선)가 무게를 차지해 갑니다`,
    tagline: R`자료가 확률분포에서 오지 않고, 적이 골라 내민다고 해도 배울 수 있습니다. 목표가 “최선의 고정된 규칙보다 많이 뒤처지지 않기”이면.`,
    summary: R`통계적 가정 없이, 예제가 한 번에 하나씩 오고 예측한 뒤에 정답을 보는 **온라인** 설정입니다. 실현가능하면 목표는 **실수 횟수**를 유한하게 누르는 것이고, 유한 클래스는 **반감 알고리즘**으로 $\log_2\lvert\cH\rvert$번, 일반적으로는 **리틀스톤 차원**만큼 틀리는 **SOA**가 최적입니다(리틀스톤 차원은 VC 차원의 적응적 판본이라 VC 차원 이상). 실현가능하지 않으면 결정적 예측은 적이 늘 반대 답을 내밀어 선형 후회를 피할 수 없으므로(강의 노트의 커버형 불가능성), 확률 $p_t\in[0,1]$로 예측하고 **후회** — 최선의 고정 가설 대비 추가 손실 — 를 잽니다. **가중 다수결**은 실수한 전문가의 무게를 $e^{-\eta}$배로 줄여 후회 $\sqrt{2T\ln d}$를 보장하고, 무한 클래스도 “SOA를 몇 번 뒤집는” 유한 개의 전문가로 흉내 내 후회 $\sqrt{2T\,\Ldim(\cH)\ln(eT)}$를 얻습니다. 마지막으로 **온라인 볼록 최적화**의 경사하강 후회 $B\rho\sqrt T$와, 그 특수한 경우인 **온라인 퍼셉트론**의 실수 상한을 봅니다.`,
    goals: [
      R`실수 상한을 정의하고, 일관 알고리즘($\lvert\cH\rvert-1$)과 반감 알고리즘($\log_2\lvert\cH\rvert$)의 상한을 증명할 수 있다`,
      R`분쇄된 트리와 리틀스톤 차원을 정의하고, SOA가 $\Ldim(\cH)$번 이하로 틀림을 증명할 수 있다`,
      R`$\VC(\cH)\le\Ldim(\cH)\le\log_2\lvert\cH\rvert$를 보이고, 문턱 함수의 리틀스톤 차원이 무한임을 설명할 수 있다`,
      R`결정적 예측이 선형 후회를 피할 수 없음을 보이고, 확률 예측의 기대 손실 $\lvert p_t-y_t\rvert$를 설명할 수 있다`,
      R`가중 다수결의 후회 상한 $\sqrt{2T\ln d}$를 퍼텐셜 논법으로 증명할 수 있다`,
      R`온라인 경사하강의 후회 상한과 온라인 퍼셉트론의 실수 상한을 유도할 수 있다`,
    ],
    secTitles: { '21.1': '실수 상한', '21.1b': '리틀스톤 차원', '21.2': '후회', '21.2b': '가중 다수결', '21.2c': '무한 클래스', '21.3': '온라인 볼록 최적화', '21.4': '온라인 퍼셉트론' },
    sections: [
      { k: '21.1', p: 288, title: '실현가능한 경우: 실수 상한', body: R`
**규약.** 매 라운드 $t$: 학습기가 $x_t$를 받고 $p_t$를 예측, 참 레이블 $y_t$를 보고 갱신. 예제열은 **적이 고를 수 있습니다** — i.i.d. 가정이 없습니다. 실현가능하면 어떤 $h^\star\in\cH$가 모든 $y_t=h^\star(x_t)$.

:::def 실수 상한
$M_A(\cH)$: 모든 실현가능한 예제열에서 알고리즘 $A$가 틀리는 횟수의 최댓값. 유한이면 $\cH$는 **온라인 학습가능**하다.
:::

- **일관(Consistent)**: 지금까지의 예제와 맞는 가설들 $V_t$(버전 공간)에서 아무거나 골라 예측. 틀리면 그 가설이 $V_{t+1}$에서 빠지므로 $M\le\lvert\cH\rvert-1$.
- **반감(Halving)**: $V_t$의 **다수결**로 예측.

:::key 반감 알고리즘의 실수 상한
유한 $\cH$에서 반감 알고리즘은 $M_{\mathrm{Halving}}(\cH)\le\log_2\lvert\cH\rvert$.
:::

틀렸다는 것은 다수가 틀렸다는 것이므로 $\lvert V_{t+1}\rvert\le\frac12\lvert V_t\rvert$. $M$번 틀리면 $1\le\lvert V_{T+1}\rvert\le\lvert\cH\rvert2^{-M}$ (실현가능이라 $h^\star$가 남음).
` },
      { k: '21.1b', p: 290, title: '리틀스톤 차원과 SOA', body: R`
적은 학습기의 예측을 보고 다음 $x$를 고를 수 있으므로, 고정된 점 집합이 아니라 **적응적 트리**가 중요합니다.

:::def 분쇄된 트리와 리틀스톤 차원
깊이 $d$의 완전 이진 트리의 각 내부 노드에 점 $x_\sigma$($\sigma$는 뿌리에서의 경로)를 붙인다. 모든 경로 $y=(y_1,\dots,y_d)$에 대해 $h(x_{(y_1,\dots,y_{t-1})})=y_t$ ($t=1..d$)인 $h\in\cH$가 있으면 $\cH$가 이 트리를 **분쇄**한다. **리틀스톤 차원** $\Ldim(\cH)$: 분쇄되는 트리의 최대 깊이.
:::

적은 분쇄된 트리를 따라 “학습기의 예측과 반대인 가지”로 내려가면 깊이만큼 매번 틀리게 만들 수 있고, 그 경로를 실현하는 $h$가 있어 실현가능합니다. 그러므로 **어떤 알고리즘도 $M_A(\cH)\ge\Ldim(\cH)$**.

:::def 표준 최적 알고리즘 (SOA)
$V_1=\cH$. 라운드 $t$: $V_t^{(r)}=\{h\in V_t:h(x_t)=r\}$에 대해 $\hat y_t=\argmax_r\Ldim(V_t^{(r)})$로 예측(동점은 0). 정답을 보고 $V_{t+1}=V_t^{(y_t)}$.
:::

:::key SOA의 실수 상한
실현가능하면 SOA는 많아야 $\Ldim(\cH)$번 틀린다. 따라서 $M_{\mathrm{SOA}}(\cH)=\Ldim(\cH)$이고 SOA는 최적이다.
:::

틀릴 때마다 $\Ldim(V_t)$가 적어도 1 줄어듦을 보이면 됩니다. 틀렸는데 줄지 않았다면 두 가지 $V_t^{(0)},V_t^{(1)}$의 리틀스톤 차원이 모두 $\Ldim(V_t)=d$ (예측이 더 큰 쪽을 골랐는데 정답 쪽도 $d$). 그러면 $x_t$를 뿌리로 두 깊이-$d$ 트리를 붙여 $V_t$가 깊이 $d+1$ 트리를 분쇄 — 모순.

:::key VC 차원과 리틀스톤 차원
$\VC(\cH)\le\Ldim(\cH)\le\log_2\lvert\cH\rvert$. 부등식은 엄격할 수 있다: $[0,1]$ 위의 문턱 함수는 $\VC=1$이지만 $\Ldim=\infty$.
:::

문턱 함수: 적은 이분 탐색처럼 $x_1=\frac12$, 학습기가 예측하면 반대 레이블을 주고, 가능한 문턱 구간의 중점을 다음 점으로 냅니다. 구간이 반씩 줄 뿐 비어 있지 않아 영원히 실현가능 — 온라인으로는 **배울 수 없는** 클래스입니다(PAC로는 쉬움).
` },
      { k: '21.2', p: 294, src: '강의 노트 · 21.2 (1–3절)', title: '실현 불가능한 경우: 후회와 무작위화', body: R`
실현가능성을 버리면 실수를 유한하게 누를 수 없으므로, 최선의 고정 가설과 비교합니다.

:::def 후회
$$\mathrm{Regret}_A(h,T)=\sup_{(x_1,y_1),\dots,(x_T,y_T)}\Big[\sum_{t=1}^T\lvert p_t-y_t\rvert-\sum_{t=1}^T\lvert h(x_t)-y_t\rvert\Big],\qquad\mathrm{Regret}_A(\cH,T)=\sup_{h\in\cH}\mathrm{Regret}_A(h,T).$$
$\mathrm{Regret}=o(T)$이면 평균 초과 손실이 0으로 갑니다.
:::

$p_t\in[0,1]$은 “1을 낼 확률”이고, 실제로 $\hat y_t\sim\mathrm{Bernoulli}(p_t)$로 뽑으면 기대 0–1 손실이 정확히 $\lvert p_t-y_t\rvert$입니다(3단원의 확률적 예측기와 같은 계산).

:::key 결정적 예측의 한계
예측이 $\{0,1\}$로 결정적이면, $\cH=\{h\equiv0,h\equiv1\}$에서도 적응적인 적이 모든 알고리즘에 대해 후회 $\ge T/2$를 만든다.
:::

:::hand 강의 노트 — 커버형 논법
적은 학습기의 예측 $p_t$를 보고 $y_t=1-p_t$를 냅니다. 학습기는 $T$번 모두 틀립니다. 한편 레이블 중 0과 1 중 많은 쪽을 고르는 상수 가설은 $T/2$번 이하로 틀리므로, 후회 $\ge T-T/2$. **무작위화**하면 적은 동전의 결과가 아니라 확률 $p_t$만 볼 수 있어 이 논법이 막힙니다.
:::
` },
      { k: '21.2b', p: 295, src: '강의 노트 · 21.2 (4–5절)', title: '가중 다수결', body: R`
**전문가 조언 문제.** 전문가 $d$명, 매 라운드 학습기가 분포 $w^{(t)}\in\Delta_d$를 고르면 비용 벡터 $v_t\in[0,1]^d$가 공개되고 $\langle w^{(t)},v_t\rangle$를 냅니다. 최선의 전문가와 비교한 후회를 줄이는 것이 목표입니다.

:::def 가중 다수결 (Weighted-Majority)
$\eta=\sqrt{2\ln d/T}$, $\tilde w^{(1)}_i=1$. 매 라운드 $w^{(t)}=\tilde w^{(t)}/Z_t$ ($Z_t=\sum_i\tilde w^{(t)}_i$)를 쓰고, 비용을 본 뒤 $\tilde w^{(t+1)}_i=\tilde w^{(t)}_ie^{-\eta v_{t,i}}$.
:::

:::key 가중 다수결의 후회 상한
$\eta\in(0,1]$이면 $\displaystyle\sum_t\langle w^{(t)},v_t\rangle-\min_i\sum_tv_{t,i}\le\frac{\ln d}\eta+\frac{\eta T}2$. $T>2\ln d$에서 $\eta=\sqrt{2\ln d/T}$로 두면 $\le\sqrt{2T\ln d}$.
:::

:::hand 강의 노트 — 퍼텐셜 $\ln Z_t$
**위로:** $\frac{Z_{t+1}}{Z_t}=\sum_iw_i^{(t)}e^{-\eta v_{t,i}}$. $a\in[0,1]$에서 $e^{-a}\le1-a+\frac{a^2}2$이므로 $\le1-\eta\langle w^{(t)},v_t\rangle+\frac{\eta^2}2$, 그리고 $\ln(1-b)\le-b$로 $\ln\frac{Z_{t+1}}{Z_t}\le-\eta\langle w^{(t)},v_t\rangle+\frac{\eta^2}2$. 합하면 $\ln Z_{T+1}-\ln d\le-\eta\sum_t\langle w^{(t)},v_t\rangle+\frac{\eta^2T}2$.
**아래로:** $\ln Z_{T+1}=\ln\sum_ie^{-\eta\sum_tv_{t,i}}\ge-\eta\min_i\sum_tv_{t,i}$.
두 식을 합치고 $\eta$로 나누면 결론.
:::

**유한 클래스의 온라인 분류.** 가설마다 전문가 하나, $p_t=\sum_iw_i^{(t)}h_i(x_t)$, 비용 $v_{t,i}=\lvert h_i(x_t)-y_t\rvert$. $y_t\in\{0,1\}$이면 $h_i(x_t)-y_t$의 부호가 모두 같아 $\lvert p_t-y_t\rvert=\langle w^{(t)},v_t\rangle$이므로 후회 $\le\sqrt{2T\ln\lvert\cH\rvert}$.
` },
      { k: '21.2c', p: 297, src: '강의 노트 · 21.2 (6–10절)', title: '무한 클래스와 리틀스톤 차원', body: R`
$\cH$가 무한이면 가설마다 전문가를 둘 수 없습니다. 강의 노트(교재 정리 21.10의 증명)는 **SOA를 흉내 내다가 정해진 라운드에서만 뒤집는** 전문가를 만듭니다.

- 전문가 $E_{i_1,\dots,i_L}$ ($L\le D=\Ldim(\cH)$, $1\le i_1<\dots<i_L\le T$): SOA처럼 예측하되 라운드 $i_1,\dots,i_L$에서만 반대로 예측하고, 버전 공간은 **자기 예측**으로 갱신.
- **흉내 보조정리**: 임의의 $h\in\cH$와 입력열에 대해, $h$로 레이블한 실현가능 열에서 SOA가 틀린 라운드들(많아야 $D$개)을 뒤집기 라운드로 잡은 전문가는 매 라운드 $h(x_t)$를 예측한다(귀납법으로 두 버전 공간이 같게 유지됨).
- 전문가 수 $\sum_{L=0}^D\binom TL\le\big(\frac{eT}D\big)^D$, 그러므로 $\ln N\le D\ln(eT)$.

:::key 온라인 분류의 후회 상한
모든 $\cH$에 대해 예측이 $[0,1]$인 알고리즘이 있어, 모든 예제열과 모든 $h\in\cH$에서
$$\sum_t\lvert p_t-y_t\rvert-\sum_t\lvert h(x_t)-y_t\rvert\le\sqrt{2T\min\{\ln\lvert\cH\rvert,\ \Ldim(\cH)\ln(eT)\}}.$$
:::

**하한.** 강의 노트는 분쇄된 트리를 따라 단계마다 공정한 동전 레이블을 여러 번 주는 적으로, 어떤 알고리즘도 기대 후회 $\ge\frac1{48}\sqrt{\min\{D,T/2\}\,T}$임을 보였습니다. 따라서 $\sqrt{\Ldim\cdot T}$ 의존은 로그 인수를 빼면 피할 수 없고, **온라인 학습가능 ⇔ $\Ldim<\infty$**.

:::key 배증 기법
구간 길이 $m$을 알 때 후회가 $\alpha\sqrt m$ 이하인 알고리즘을 길이 $1,2,4,\dots$인 구간마다 다시 시작하면, $T$를 몰라도 후회가 $\frac{\sqrt2}{\sqrt2-1}\alpha\sqrt T$ 이하이다.
:::

마지막 구간 번호를 $K$라 하면 후회 $\le\alpha\sum_{j=0}^K2^{j/2}=\alpha\frac{2^{(K+1)/2}-1}{\sqrt2-1}$이고, $2^K\le T$이므로 $2^{(K+1)/2}\le\sqrt{2T}$.
` },
      { k: '21.3', p: 300, title: '온라인 볼록 최적화', body: R`
매 라운드 학습기가 $w^{(t)}\in\cH$를 고르면 볼록함수 $f_t$가 공개되고 손실 $f_t(w^{(t)})$를 냅니다. 후회는 $\sum_tf_t(w^{(t)})-\sum_tf_t(w^\star)$.

:::key 온라인 경사하강의 후회
$w^{(t+1)}=\Pi_\cH\big(w^{(t)}-\eta v_t\big)$, $v_t\in\partial f_t(w^{(t)})$, $w^{(1)}=0$이면 모든 $w^\star\in\cH$에서
$$\sum_{t=1}^T\big(f_t(w^{(t)})-f_t(w^\star)\big)\le\frac{\lVert w^\star\rVert^2}{2\eta}+\frac\eta2\sum_t\lVert v_t\rVert^2.$$
$f_t$가 $\rho$-립시츠, $\lVert w^\star\rVert\le B$, $\eta=\frac B{\rho\sqrt T}$이면 후회 $\le B\rho\sqrt T$.
:::

볼록성으로 $f_t(w^{(t)})-f_t(w^\star)\le\langle w^{(t)}-w^\star,v_t\rangle$이고, 우변의 합은 11단원의 GD 보조정리(사영 포함) 그대로입니다. **SGD의 분석과 같은 식** — 차이는 $f_t$가 적이 고른 함수라는 것뿐이고, 그래서 기댓값이 아니라 모든 열에 대해 성립합니다. 거꾸로 온라인 알고리즘을 i.i.d. 자료에 돌리면 SGD가 됩니다(온라인→배치 변환).
` },
      { k: '21.4', p: 301, title: '온라인 퍼셉트론', body: R`
퍼셉트론을 온라인으로 돌리면, 틀린 라운드에서만 $w\leftarrow w+y_tx_t$. 이것은 틀린 라운드의 대리 손실 $f_t(w)=[1-y_t\langle w,x_t\rangle]_+$ (틀리지 않은 라운드는 $f_t\equiv0$)에 대한 온라인 경사하강입니다.

:::key 온라인 퍼셉트론의 실수 상한
$R=\max_t\lVert x_t\rVert$, $\mathcal M$=퍼셉트론이 틀린 라운드, $f_t(w)=\one[t\in\mathcal M][1-y_t\langle w,x_t\rangle]_+$이면 모든 $w^\star$에 대해
$$\lvert\mathcal M\rvert\le\sum_tf_t(w^\star)+R\lVert w^\star\rVert\sqrt{\sum_tf_t(w^\star)}+R^2\lVert w^\star\rVert^2.$$
특히 $y_t\langle w^\star,x_t\rangle\ge1$ ($\forall t$)이면 $\lvert\mathcal M\rvert\le R^2\lVert w^\star\rVert^2$.
:::

분리 가능하면 9단원의 퍼셉트론 정리가 되고, 분리 불가능해도 “$w^\star$의 힌지 손실 합”만큼만 더 틀린다는 것이 이 정리의 새 내용입니다.
` },
    ],
    problems: [
      { sec: '21.1', type: 'num', lv: 1, q: R`$\lvert\cH\rvert=1024$인 실현가능 온라인 문제에서 반감 알고리즘의 실수 상한은?`, ans: '10', ansTex: R`\log_21024=10`,
        sol: R`$\log_21024=10$. 일관 알고리즘은 1023까지 틀릴 수 있습니다.` },
      { sec: '21.1', type: 'mc', lv: 2, q: R`반감 알고리즘이 틀렸을 때 버전 공간이 절반 이하로 줄어드는 이유는?`,
        choices: [R`무작위로 절반을 버리므로`, R`다수결이 틀렸다는 것은 다수의 가설이 틀렸다는 것이고, 틀린 가설은 모두 제거되므로`, R`정답이 반반이라서`, R`VC 차원이 1이라서`], ans: 1,
        sol: R`버전 공간에는 지금까지 맞은 가설만 남깁니다. 예측이 틀리면 그 예측을 한 가설(과반)이 모두 빠집니다.` },
      { sec: '21.1b', type: 'mc', lv: 2, q: R`$[0,1]$ 위의 문턱 함수 클래스에 대해 옳은 것은?`,
        choices: [R`$\VC=1$, $\Ldim=1$`, R`$\VC=1$, $\Ldim=\infty$ — PAC로는 배울 수 있지만 온라인으로는 배울 수 없다`, R`$\VC=\infty$`, R`$\Ldim=\log_2\lvert\cH\rvert$`], ans: 1,
        sol: R`적이 이분 탐색으로 매번 반대 레이블을 주면서도 실현가능성을 유지할 수 있습니다.` },
      { sec: '21.1b', type: 'num', lv: 2, q: R`$\lvert\cH\rvert=100$일 때 $\Ldim(\cH)$의 상한 $\lfloor\log_2100\rfloor$은?`, ans: '6', ansTex: R`6`,
        sol: R`깊이 $d$의 분쇄된 트리는 경로마다 다른 가설이 필요해 $2^d\le\lvert\cH\rvert$, $d\le6.64$.` },
      { sec: '21.1b', type: 'mc', lv: 3, q: R`SOA가 틀렸는데 $\Ldim(V_{t+1})=\Ldim(V_t)=d$라고 가정하면 어떤 모순이 생기나?`,
        choices: [R`$V_{t+1}$이 공집합이 된다`, R`두 가지 $V_t^{(0)},V_t^{(1)}$이 모두 깊이 $d$ 트리를 분쇄해, $x_t$를 뿌리로 붙이면 $V_t$가 깊이 $d+1$ 트리를 분쇄한다`, R`VC 차원이 무한이 된다`, R`실현가능성이 깨진다`], ans: 1,
        sol: R`SOA는 리틀스톤 차원이 큰 쪽을 예측했으니 정답 쪽도 $d$라면 두 쪽 다 $d$입니다.` },
      { sec: '21.2', type: 'mc', lv: 2, q: R`확률 예측 $p_t=0.3$, 정답 $y_t=1$일 때 기대 0–1 손실은?`,
        choices: [R`0.3`, R`0.7`, R`0.21`, R`1`], ans: 1,
        sol: R`$\lvert p_t-y_t\rvert=0.7$ — 1을 낼 확률이 0.3이라 틀릴 확률이 0.7.` },
      { sec: '21.2b', type: 'num', lv: 1, q: R`전문가 $d=16$명, $T=1000$일 때 가중 다수결의 후회 상한 $\sqrt{2T\ln d}$은? (소수 둘째 자리)`, ans: 'sqrt(2000*ln(16))', ansTex: R`\sqrt{2000\ln16}\approx74.46`,
        sol: R`$\ln16=2.7726$, $\sqrt{5545.2}\approx74.46$. 평균 초과 손실 $\approx0.074$.` },
      { sec: '21.2b', type: 'num', lv: 2, q: R`같은 설정의 학습률 $\eta=\sqrt{2\ln d/T}$는? (소수 넷째 자리)`, ans: 'sqrt(2*ln(16)/1000)', ansTex: R`\approx0.0745`,
        sol: R`$\sqrt{5.545/1000}\approx0.0745$. 한 번 틀린 전문가의 무게는 $e^{-0.0745}\approx0.928$배.` },
      { sec: '21.2c', type: 'num', lv: 2, q: R`$\Ldim(\cH)=3$, $T=100$일 때 흉내 전문가 수의 상한 $(eT/D)^D$의 자연로그 $D\ln(eT/D)$는? (소수 둘째 자리)`, ans: '3*ln(100*e/3)', ansTex: R`3\ln(90.6)\approx13.52`,
        sol: R`$eT/D=271.83/3=90.61$, $\ln90.61=4.506$, $\times3=13.52$. 상한 $D\ln(eT)=3\ln271.8=16.81$보다 조금 작습니다.` },
      { sec: '21.2c', type: 'num', lv: 2, q: R`구간 길이를 알면 후회 $\le\alpha\sqrt m$인 알고리즘에 배증 기법을 쓰면 후회 상수 $\frac{\sqrt2}{\sqrt2-1}$은? (소수 넷째 자리)`, ans: 'sqrt(2)/(sqrt(2)-1)', ansTex: R`\approx3.4142`,
        sol: R`$\frac{1.4142}{0.4142}\approx3.414$ — $T$를 모르는 대가가 상수 배일 뿐입니다.` },
      { sec: '21.3', type: 'num', lv: 1, q: R`$B=1$, $\rho=2$, $T=400$일 때 온라인 경사하강의 후회 상한 $B\rho\sqrt T$은?`, ans: '40', ansTex: R`2\cdot20=40`,
        sol: R`$1\cdot2\cdot20=40$. 평균 후회 $0.1$.` },
      { sec: '21.4', type: 'num', lv: 2, q: R`온라인 퍼셉트론에서 $R=2$, $\lVert w^\star\rVert=3$, $\sum_tf_t(w^\star)=4$이면 실수 상한은?`, ans: '52', ansTex: R`4+6\cdot2+36=52`,
        sol: R`$4+R\lVert w^\star\rVert\sqrt4+R^2\lVert w^\star\rVert^2=4+6\cdot2+36=52$.` },
      { sec: '21.1b', type: 'open', lv: 3, proof: true, q: R`실현가능한 예제열에서 SOA가 많아야 $\Ldim(\cH)$번 틀림을 증명하세요.`,
        sol: R`
$D_t=\Ldim(V_t)$. 실현가능하므로 $V_t\ne\emptyset$, $D_t\ge0$. 틀린 라운드마다 $D_{t+1}\le D_t-1$임을 보이면 충분($D_1=\Ldim(\cH)$).
틀렸다면 $V_{t+1}=V_t^{(y_t)}$이고 예측 $\hat y_t\ne y_t$는 $\Ldim(V_t^{(\hat y_t)})\ge\Ldim(V_t^{(y_t)})$을 만족. $\Ldim(V_{t+1})=D_t=d$라 가정하면 두 부분집합 모두 $\Ldim=d$ (부분집합이라 $d$ 초과 불가).
각각 깊이 $d$ 트리 $\mathcal T_0,\mathcal T_1$을 분쇄. $x_t$를 뿌리로, 0 가지에 $\mathcal T_0$, 1 가지에 $\mathcal T_1$을 붙인 깊이 $d+1$ 트리: 임의의 경로의 첫 비트 $r$에 대해 나머지 경로를 실현하는 $h\in V_t^{(r)}$는 $h(x_t)=r$도 만족. 따라서 $V_t$가 깊이 $d+1$ 트리를 분쇄 — $\Ldim(V_t)=d$에 모순.`,
        rubric: R`
- 퍼텐셜 $D_t$와 목표 설정 — 2점
- 예측 규칙에서 두 가지가 모두 $d$임을 도출 — 3점
- 뿌리 붙이기로 깊이 $d+1$ 분쇄 — 4점
- 결론 — 1점` },
      { sec: '21.2b', type: 'open', lv: 3, proof: true, q: R`가중 다수결($\eta\in(0,1]$, 비용 $v_t\in[0,1]^d$)의 후회가 $\frac{\ln d}\eta+\frac{\eta T}2$ 이하임을 증명하세요. ($a\in[0,1]$에서 $e^{-a}\le1-a+\frac{a^2}2$는 써도 됩니다.)`,
        sol: R`
$Z_t=\sum_i\tilde w^{(t)}_i$. $\frac{Z_{t+1}}{Z_t}=\sum_iw^{(t)}_ie^{-\eta v_{t,i}}\le\sum_iw^{(t)}_i(1-\eta v_{t,i}+\frac{\eta^2v_{t,i}^2}2)\le1-\eta\langle w^{(t)},v_t\rangle+\frac{\eta^2}2$ ($\eta v_{t,i}\in[0,1]$, $v_{t,i}^2\le1$).
$\ln(1-b)\le-b$: $\ln\frac{Z_{t+1}}{Z_t}\le-\eta\langle w^{(t)},v_t\rangle+\frac{\eta^2}2$. 합: $\ln Z_{T+1}-\ln d\le-\eta\sum_t\langle w^{(t)},v_t\rangle+\frac{\eta^2T}2$.
아래: $\ln Z_{T+1}=\ln\sum_ie^{-\eta\sum_tv_{t,i}}\ge\ln\max_ie^{-\eta\sum_tv_{t,i}}=-\eta\min_i\sum_tv_{t,i}$.
합치면 $-\eta\min_i\sum v_{t,i}-\ln d\le-\eta\sum\langle w^{(t)},v_t\rangle+\frac{\eta^2T}2$. $\eta$로 나누고 정리하면 결론.`,
        rubric: R`
- 비 $Z_{t+1}/Z_t$와 지수 부등식 — 3점
- 로그와 합 — 2점
- $\ln Z_{T+1}$의 하한 — 3점
- 정리 — 2점` },
    ],
  });
})();
