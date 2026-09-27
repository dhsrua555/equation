/* 11 확률적 경사하강법 — UML 14장, 강의 노트 “Proof and Interpretation of Lemma 14.1”, “First-Order Characterization of Strong Convexity” (Claim 14.10), “Proof of Corollary 14.12”, “Proof for Section 14.5.3” */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 11, part: 'B', title: '확률적 경사하강법', en: 'Stochastic Gradient Descent', ref: 'UML 14장', plot: 'sgd',
    fig: R`길쭉한 등고선 위에서 흔들리며 내려가는 SGD 경로(가는 선)와, 반복값을 평균한 부드러운 경로(굵은 선)`,
    tagline: R`한 번에 예제 하나의 기울기만 보고 걸어도, 기댓값이 맞는 방향이면 평균적으로 최적점에 다가갑니다. 그리고 그것이 곧 학습입니다.`,
    summary: R`볼록 학습 문제를 푸는 알고리즘을 분석합니다. 경사하강법(GD)의 핵심은 **보조정리 14.1**: 갱신 $w^{(t+1)}=w^{(t)}-\eta v_t$에 대해 $\sum_t\langle w^{(t)}-w^\star,v_t\rangle\le\frac{\lVert w^\star\rVert^2}{2\eta}+\frac\eta2\sum_t\lVert v_t\rVert^2$ — 거리 제곱의 망원합입니다. 볼록성으로 이 합이 목적함수의 초과값을 누르므로, 볼록-$\rho$-립시츠 함수에서 평균 반복값은 $\frac{B\rho}{\sqrt T}$ 이내입니다. 미분 불가능한 점에서는 **부분기울기**를 쓰고, 기울기 대신 **기댓값이 부분기울기인 무작위 벡터**를 써도(SGD) 같은 상한이 기댓값으로 성립합니다. 새 예제 하나의 손실 부분기울기는 참 위험의 부분기울기의 불편 추정량이므로, **SGD는 참 위험 $L_\cD$를 직접 최소화**하고 $T\ge B^2\rho^2/\varepsilon^2$개의 예제로 학습에 성공합니다 — 규제와 같은 표본 복잡도입니다. 강볼록 함수에서는 $\eta_t=\frac1{\lambda t}$로 $O(\frac{\log T}{\lambda T})$를 얻습니다.`,
    goals: [
      R`GD 보조정리를 극화 항등식과 망원합으로 증명하고 최적의 $\eta$를 구할 수 있다`,
      R`부분기울기를 정의하고 $\lvert x\rvert$, 힌지 손실, 최댓값 함수의 부분기울기를 구할 수 있다`,
      R`$\rho$-립시츠 볼록함수의 부분기울기 노름이 $\rho$ 이하임을 보일 수 있다`,
      R`SGD 수렴 정리 $\E[f(\bar w)]-f(w^\star)\le\frac{B\rho}{\sqrt T}$를 조건부 기댓값으로 증명할 수 있다`,
      R`SGD가 참 위험을 직접 최소화하는 이유와 표본 복잡도 $B^2\rho^2/\varepsilon^2$을 설명할 수 있다`,
      R`강볼록성의 1차 조건과 $\eta_t=\frac1{\lambda t}$의 SGD 상한을 유도할 수 있다`,
    ],
    secTitles: { '14.1': '경사하강법', '14.2': '부분기울기', '14.3': 'SGD', '14.4': '변형', '14.4b': '강볼록', '14.5': '위험 최소화', '14.5b': '규제 최소화' },
    sections: [
      { k: '14.1', p: 185, src: '강의 노트 · Lemma 14.1', title: '경사하강법과 GD 보조정리', body: R`
GD: $w^{(1)}=0$, $w^{(t+1)}=w^{(t)}-\eta\nabla f(w^{(t)})$, 출력은 평균 $\bar w=\frac1T\sum_tw^{(t)}$.

:::key GD 보조정리
임의의 벡터열 $v_1,\dots,v_T$와 $w^{(1)}=0$, $w^{(t+1)}=w^{(t)}-\eta v_t$에 대해 모든 $w^\star$에서
$$\sum_{t=1}^T\langle w^{(t)}-w^\star,v_t\rangle\le\frac{\lVert w^\star\rVert^2}{2\eta}+\frac\eta2\sum_{t=1}^T\lVert v_t\rVert^2.$$
$\lVert w^\star\rVert\le B$, $\lVert v_t\rVert\le\rho$, $\eta=\frac B{\rho\sqrt T}$이면 $\frac1T\sum_t\langle w^{(t)}-w^\star,v_t\rangle\le\frac{B\rho}{\sqrt T}$.
:::

:::hand 강의 노트 — 거리 제곱의 망원합
$v_t=\frac1\eta(w^{(t)}-w^{(t+1)})$이고, $a=w^{(t)}-w^\star$, $b=w^{(t+1)}-w^\star$에 대해 $\langle a,a-b\rangle=\frac12(\lVert a\rVert^2-\lVert b\rVert^2+\lVert a-b\rVert^2)$ (극화 항등식). 따라서 **등식으로**
$$\langle w^{(t)}-w^\star,v_t\rangle=\frac1{2\eta}\Big(\lVert w^{(t)}-w^\star\rVert^2-\lVert w^{(t+1)}-w^\star\rVert^2\Big)+\frac\eta2\lVert v_t\rVert^2.$$
$t$에 대해 더하면 가운데 항들이 망원합으로 사라지고 $\frac1{2\eta}(\lVert w^{(1)}-w^\star\rVert^2-\lVert w^{(T+1)}-w^\star\rVert^2)$만 남습니다. 음수 항을 버리고 $w^{(1)}=0$을 쓰면 결론. $\eta$가 작으면 첫 항(출발점에서 먼 거리)이, 크면 둘째 항(큰 걸음의 누적)이 커지고, 두 항을 같게 하는 $\eta$에서 $\frac{B\rho}{\sqrt T}$가 나옵니다.
:::

**수렴.** $f$가 볼록이면 $f(w^{(t)})-f(w^\star)\le\langle w^{(t)}-w^\star,\nabla f(w^{(t)})\rangle$이고 젠센으로 $f(\bar w)\le\frac1T\sum f(w^{(t)})$. 따라서

:::key 볼록-립시츠 함수에서 GD의 수렴
$f$가 볼록이고 $\rho$-립시츠, $w^\star\in\argmin_{\lVert w\rVert\le B}f(w)$, $\eta=\sqrt{\frac{B^2}{\rho^2T}}$이면
$$f(\bar w)-f(w^\star)\le\frac{B\rho}{\sqrt T}.$$
정확도 $\varepsilon$에는 $T\ge B^2\rho^2/\varepsilon^2$번이면 충분하다.
:::
` },
      { k: '14.2', p: 188, title: '부분기울기', body: R`
힌지 손실이나 $\lvert x\rvert$는 꺾인 점에서 미분할 수 없습니다. 볼록함수에는 접선 대신 “그래프 아래를 지나는 직선”이 늘 있습니다.

:::def 부분기울기
$v$가 $f$의 $w$에서의 **부분기울기**(subgradient): 모든 $u$에서 $f(u)\ge f(w)+\langle u-w,v\rangle$. 그런 $v$ 전체를 $\partial f(w)$(부분미분)라 한다.
:::

- 열린 볼록 집합 위의 볼록함수는 모든 점에서 부분기울기를 가집니다. 미분가능하면 $\partial f(w)=\{\nabla f(w)\}$.
- $f(x)=\lvert x\rvert$: $x>0$이면 $\{1\}$, $x<0$이면 $\{-1\}$, $x=0$이면 $[-1,1]$.
- **최댓값 규칙**: $g(w)=\max_if_i(w)$이고 $j\in\argmax_if_i(w)$이면 $\partial f_j(w)\subseteq\partial g(w)$ — 지금 가장 큰 함수의 부분기울기를 쓰면 됩니다.
- **힌지 손실** $\max\{0,1-y\langle w,x\rangle\}$: $1-y\langle w,x\rangle>0$이면 $-yx$, $<0$이면 $0$, $=0$이면 둘 다(그 사이 선분 전체) 부분기울기.

:::key 립시츠 ⇔ 부분기울기 유계
볼록집합 $A$(열린) 위의 볼록함수 $f$가 $\rho$-립시츠일 필요충분조건은 모든 $w\in A$와 $v\in\partial f(w)$에서 $\lVert v\rVert\le\rho$인 것이다.
:::

(⇒) $v\ne0$이면 $u=w+\epsilon\frac v{\lVert v\rVert}$에서 $\epsilon\lVert v\rVert=\langle u-w,v\rangle\le f(u)-f(w)\le\rho\epsilon$. (⇐) $f(w)-f(u)\le\langle w-u,v\rangle\le\rho\lVert w-u\rVert$ ($v\in\partial f(w)$), 대칭으로 반대쪽.

**부분기울기 하강**은 GD의 $\nabla f$를 $v_t\in\partial f(w^{(t)})$로 바꾼 것이고, GD 보조정리와 부분기울기 부등식으로 같은 $\frac{B\rho}{\sqrt T}$ 상한이 성립합니다.
` },
      { k: '14.3', p: 191, title: '확률적 경사하강법', body: R`
:::def SGD
$w^{(1)}=0$. $t=1,\dots,T$: 무작위 벡터 $v_t$를 $\E[v_t\mid w^{(t)}]\in\partial f(w^{(t)})$가 되게 뽑고 $w^{(t+1)}=w^{(t)}-\eta v_t$. 출력 $\bar w=\frac1T\sum_tw^{(t)}$.
:::

한 걸음은 틀릴 수 있지만 **평균적으로는** 맞는 방향입니다.

:::key SGD의 수렴
$f$가 볼록, $w^\star\in\argmin_{\lVert w\rVert\le B}f(w)$, 모든 $t$에서 확률 1로 $\lVert v_t\rVert\le\rho$, $\eta=\sqrt{\frac{B^2}{\rho^2T}}$이면
$$\E[f(\bar w)]-f(w^\star)\le\frac{B\rho}{\sqrt T}.$$
:::

증명: 젠센과 볼록성으로 $\E[f(\bar w)]-f(w^\star)\le\frac1T\sum_t\E[f(w^{(t)})-f(w^\star)]\le\frac1T\sum_t\E\langle w^{(t)}-w^\star,\E[v_t\mid w^{(t)}]\rangle$. 탑 성질로 $\E\langle w^{(t)}-w^\star,\E[v_t\mid w^{(t)}]\rangle=\E\langle w^{(t)}-w^\star,v_t\rangle$ ($w^{(t)}$는 $v_1,\dots,v_{t-1}$로 정해짐). 이제 GD 보조정리를 **표본 경로마다** 쓰고 기댓값을 취하면 끝입니다.

:::note 심층 신경망 과목과의 차이
심층 신경망 과목은 미니배치 기울기가 전체 기울기의 불편 추정량이고 분산이 $1/B$로 준다는 것을 보았습니다[[@dnn:ch10:10.2|기댓값은 같고 분산은 다르다.]]. 이 장은 그 불편성만으로 볼록 문제의 **수렴 속도**를 보장합니다.
:::
` },
      { k: '14.4', p: 193, title: '변형: 사영, 가변 보폭, 평균', body: R`
**사영 단계.** $\cH$가 볼록 집합이면 $w^{(t+\frac12)}=w^{(t)}-\eta v_t$ 뒤에 $w^{(t+1)}=\Pi_\cH(w^{(t+\frac12)})=\argmin_{w\in\cH}\lVert w-w^{(t+\frac12)}\rVert$로 되돌립니다.

:::key 사영은 거리를 늘리지 않는다
$\cH$가 닫힌 볼록 집합이고 $v=\Pi_\cH(w)$이면 모든 $u\in\cH$에서 $\lVert w-u\rVert^2-\lVert v-u\rVert^2\ge\lVert w-v\rVert^2\ge0$.
:::

$v$는 볼록 함수 $\lVert x-w\rVert^2$의 $\cH$ 위 최소점이라 $\langle w-v,u-v\rangle\le0$ ($u\in\cH$). 그러면 $\lVert w-u\rVert^2=\lVert w-v\rVert^2+\lVert v-u\rVert^2+2\langle w-v,v-u\rangle\ge\lVert w-v\rVert^2+\lVert v-u\rVert^2$. 그래서 GD 보조정리의 “거리 제곱이 줄어드는” 논증이 사영 뒤에도 성립합니다.

**가변 보폭.** $T$를 미리 모를 때 $\eta_t=\frac B{\rho\sqrt t}$로 두면 상한이 $\frac{3B\rho}{\sqrt T}$ 정도로 상수만 나빠집니다.

**다른 평균.** 마지막 반복값, 뒤쪽 절반의 평균 등도 쓰입니다. 평균은 SGD의 흔들림을 줄입니다(표지 그림의 굵은 선).
` },
      { k: '14.4b', p: 195, src: '강의 노트 · Claim 14.10', title: '강볼록 함수에서의 SGD', body: R`
:::key 강볼록성의 1차 조건
$f$가 $\lambda$-강볼록이면 모든 $w,u$와 $v\in\partial f(w)$에서
$$\langle w-u,v\rangle\ge f(w)-f(u)+\frac\lambda2\lVert w-u\rVert^2,\qquad\text{즉}\qquad f(u)\ge f(w)+\langle v,u-w\rangle+\frac\lambda2\lVert u-w\rVert^2.$$
:::

:::hand 강의 노트 — 선분 위에서 극한
강볼록성을 $x=w$, $y=u$, $t\in(0,1]$에 쓰면 $f(w+t(u-w))\le(1-t)f(w)+tf(u)-\frac\lambda2t(1-t)\lVert u-w\rVert^2$. $f(w)$를 빼고 $t$로 나누면
$$\frac{f(w+t(u-w))-f(w)}t\le f(u)-f(w)-\frac\lambda2(1-t)\lVert u-w\rVert^2.$$
부분기울기 부등식으로 좌변 $\ge\langle v,u-w\rangle$. 합치고 $t\to0^+$.
:::

:::key 강볼록 함수에서 SGD
$f$가 $\lambda$-강볼록, $\E\lVert v_t\rVert^2\le\rho^2$, $\eta_t=\frac1{\lambda t}$ (사영 포함 가능)이면
$$\E[f(\bar w)]-f(w^\star)\le\frac{\rho^2}{2\lambda T}\big(1+\ln T\big).$$
:::

1차 조건 덕분에 매 단계 $-\frac\lambda2\lVert w^{(t)}-w^\star\rVert^2$이 추가로 생기고, $\eta_t=\frac1{\lambda t}$에서 거리 항들의 망원합이 $\sum_t\big[(t-1)a_t-ta_{t+1}\big]\frac\lambda2=-\frac{\lambda T}2a_{T+1}\le0$으로 정리됩니다. 남는 것은 $\sum_t\frac{\eta_t\rho^2}2=\frac{\rho^2}{2\lambda}\sum_t\frac1t\le\frac{\rho^2}{2\lambda}(1+\ln T)$. 속도가 $1/\sqrt T$에서 $\log T/T$로 빨라집니다.
` },
      { k: '14.5', p: 196, src: '강의 노트 · Corollary 14.12', title: 'SGD로 위험을 직접 최소화하기', body: R`
학습의 목표는 $L_\cD(w)=\E_{z\sim\cD}[\ell(w,z)]$의 최소화인데, $\cD$를 모르니 기울기를 계산할 수 없습니다. 그러나 **새 예제 하나의 손실의 부분기울기는 불편 추정량**입니다.

:::key SGD로 위험을 직접 최소화
$z\sim\cD$이고 $v\in\partial\ell(w,z)$이면 $\E_z[v]\in\partial L_\cD(w)$. 따라서 볼록-립시츠-유계($\rho,B$) 문제에서 예제를 하나씩 새로 뽑아 SGD를 $T\ge\frac{B^2\rho^2}{\varepsilon^2}$번($\eta=\sqrt{B^2/(\rho^2T)}$) 돌리면
$$\E[L_\cD(\bar w)]\le\min_{w\in\cH}L_\cD(w)+\varepsilon.$$
:::

불편성: $v\in\partial\ell(w,z)$이면 모든 $u$에서 $\ell(u,z)-\ell(w,z)\ge\langle u-w,v\rangle$. $z$에 대해 기댓값을 취하면 $L_\cD(u)-L_\cD(w)\ge\langle u-w,\E v\rangle$ — 정의 그대로 $\E v\in\partial L_\cD(w)$. 립시츠성으로 $\lVert v\rVert\le\rho$이므로 SGD 수렴 정리가 $f=L_\cD$에 적용됩니다.

:::warn 경험적 위험이 아니라 참 위험
예제를 **한 번씩만** 쓰면(한 에포크) 매 단계의 예제가 $w^{(t)}$와 독립이라 참 위험의 불편 추정량입니다. 같은 표본을 여러 번 돌리면 $L_S$를 최소화하는 것이 되고, 일반화는 따로(안정성으로) 보여야 합니다. 이 정리의 표본 수 $B^2\rho^2/\varepsilon^2$은 13장 RLM의 $8\rho^2B^2/\varepsilon^2$과 같은 차수입니다.
:::

**매끄러운 경우.** 손실이 볼록, 음이 아니고 $\beta$-매끄러우면 $\eta<\frac1\beta$에서 $\E[L_\cD(\bar w)]\le\frac1{1-\eta\beta}\big(L_\cD(w^\star)+\frac{\lVert w^\star\rVert^2}{2\eta T}\big)$ (정리 14.13). 자기 유계성 덕분에 $L_\cD(w^\star)$가 작으면 더 빠릅니다.
` },
      { k: '14.5b', p: 199, src: '강의 노트 · 14.5.3', title: 'SGD로 규제 손실 최소화하기', body: R`
RLM의 목적함수 $f(w)=\frac\lambda2\lVert w\rVert^2+L_S(w)$ (편의상 $\lambda$를 2로 나눔)는 $\lambda$-강볼록입니다. 표본에서 $z$를 균등하게 뽑아 $v_t\in\partial\ell(w^{(t)},z)$로 두면 $\E[\lambda w^{(t)}+v_t\mid w^{(t)}]\in\partial f(w^{(t)})$.

:::key SGD로 규제 손실 최소화
손실이 볼록이고 $\rho$-립시츠이면, $\eta_t=\frac1{\lambda t}$, $w^{(1)}=0$인 SGD는
$$w^{(t+1)}=-\frac1{\lambda t}\sum_{i=1}^tv_i,\qquad\lVert\lambda w^{(t)}+v_t\rVert\le2\rho,$$
이고 따라서 $\E[f(\bar w)]-f(w^\star)\le\frac{(2\rho)^2}{2\lambda T}(1+\ln T)=\frac{2\rho^2}{\lambda T}(1+\ln T)$.
:::

:::hand 강의 노트 — 반복값의 닫힌 꼴
$w^{(t+1)}=w^{(t)}-\frac1{\lambda t}(\lambda w^{(t)}+v_t)=\frac{t-1}tw^{(t)}-\frac1{\lambda t}v_t$. 귀납법: $w^{(t)}=-\frac1{\lambda(t-1)}\sum_{i<t}v_i$이면 $\frac{t-1}tw^{(t)}=-\frac1{\lambda t}\sum_{i<t}v_i$이고 여기에 $-\frac1{\lambda t}v_t$를 더해 결론. 그러므로 $\lambda w^{(t)}$는 $v_i$들의 평균의 음수이고 $\lVert\lambda w^{(t)}\rVert\le\rho$ (삼각부등식), $\lVert\lambda w^{(t)}+v_t\rVert\le2\rho$.
:::

:::note 교재의 상수
교재는 결론을 $\frac{4\rho^2}{\lambda T}(1+\log T)$로 적습니다. 강볼록 SGD 정리에 $\lVert v_t\rVert\le2\rho$를 그대로 넣으면 $\frac{(2\rho)^2}{2\lambda T}=\frac{2\rho^2}{\lambda T}$이므로 교재의 값은 인수 2만큼 느슨한(여전히 참인) 상한입니다.
:::
` },
    ],
    problems: [
      { sec: '14.1', type: 'num', lv: 1, q: R`$B=2$, $\rho=5$, $T=100$일 때 GD 보조정리의 최적 보폭 $\eta=B/(\rho\sqrt T)$은?`, ans: '0.04', ansTex: R`2/50=0.04`,
        sol: R`$2/(5\cdot10)=0.04$.` },
      { sec: '14.1', type: 'num', lv: 1, q: R`같은 조건에서 상한 $B\rho/\sqrt T$은?`, ans: '1', ansTex: R`10/10=1`,
        sol: R`$2\cdot5/10=1$.` },
      { sec: '14.1', type: 'num', lv: 2, q: R`$B=1$, $\rho=1$일 때 $f(\bar w)-f(w^\star)\le0.01$을 보장하는 반복 수 $T=B^2\rho^2/\varepsilon^2$은?`, ans: '10000', ansTex: R`10^4`,
        sol: R`$1/0.0001=10^4$. 정확도를 10배 높이려면 반복을 100배 늘려야 합니다.` },
      { sec: '14.2', type: 'mc', lv: 1, q: R`$f(x)=\lvert x\rvert$의 $x=0$에서의 부분미분 $\partial f(0)$은?`,
        choices: [R`$\{0\}$`, R`$[-1,1]$`, R`$\{-1,1\}$`, R`공집합`], ans: 1,
        sol: R`$\lvert u\rvert\ge0+vu$ ($\forall u$) $\iff\lvert v\rvert\le1$.` },
      { sec: '14.2', type: 'mc', lv: 2, q: R`힌지 손실 $\max\{0,1-y\langle w,x\rangle\}$에서 $y\langle w,x\rangle=0.5$일 때의 부분기울기는?`,
        choices: [R`$0$`, R`$-yx$`, R`$yx$`, R`$[-yx,0]$ 선분 전체`], ans: 1,
        sol: R`$1-0.5>0$이라 두 번째 항이 최댓값이고 그 기울기 $-yx$. 마진이 정확히 1일 때만 선분 전체입니다.` },
      { sec: '14.2', type: 'mc', lv: 2, q: R`볼록함수 $f$가 $3$-립시츠이면 모든 부분기울기 $v$에 대해 옳은 것은?`,
        choices: [R`$\lVert v\rVert=3$`, R`$\lVert v\rVert\le3$`, R`$\lVert v\rVert\ge3$`, R`$v$는 유일하다`], ans: 1,
        sol: R`립시츠 ⇔ 부분기울기 유계. $v\ne0$이면 방향 $v/\lVert v\rVert$로 조금 움직여 비교하면 $\lVert v\rVert\le\rho$.` },
      { sec: '14.3', type: 'mc', lv: 2, q: R`SGD 분석에서 $\E\langle w^{(t)}-w^\star,v_t\rangle=\E\langle w^{(t)}-w^\star,\E[v_t\mid w^{(t)}]\rangle$가 성립하는 근거는?`,
        choices: [R`$v_t$와 $w^{(t)}$가 독립이라서`, R`탑 성질 — $w^{(t)}$가 주어지면 $w^{(t)}-w^\star$는 상수이므로 조건부 기댓값 안으로 들어간다`, R`젠센 부등식`, R`$\lVert v_t\rVert\le\rho$`], ans: 1,
        sol: R`$v_t$와 $w^{(t)}$는 독립이 아닐 수 있습니다(같은 과거를 공유). 필요한 것은 조건부 기댓값의 성질뿐입니다.` },
      { sec: '14.4', type: 'mc', lv: 2, q: R`사영 SGD의 분석에서 사영 단계가 문제를 일으키지 않는 이유는?`,
        choices: [R`사영하면 보폭이 줄어서`, R`$\cH$의 모든 점 $u$에 대해 사영이 $u$까지의 거리를 늘리지 않으므로, 거리 제곱의 감소 논증이 그대로 성립해서`, R`$\cH$가 유계라서`, R`사영은 선형이라서`], ans: 1,
        sol: R`$\lVert\Pi(w)-w^\star\rVert\le\lVert w-w^\star\rVert$ ($w^\star\in\cH$)라 망원합의 부등호 방향이 유지됩니다.` },
      { sec: '14.4b', type: 'num', lv: 2, q: R`$\lambda=0.1$, $\rho=1$, $T=1000$일 때 강볼록 SGD 상한 $\frac{\rho^2}{2\lambda T}(1+\ln T)$은? (소수 넷째 자리)`, ans: '(1+ln(1000))/200', ansTex: R`\tfrac{1+\ln1000}{200}\approx0.0395`,
        sol: R`$1/(2\cdot0.1\cdot1000)=0.005$, $1+\ln1000=7.908$, 곱 $\approx0.0395$.` },
      { sec: '14.5', type: 'num', lv: 2, q: R`볼록-립시츠-유계 문제 $\rho=2$, $B=3$에서 SGD로 기대 초과 위험 $0.1$을 얻는 예제 수 $B^2\rho^2/\varepsilon^2$은?`, ans: '3600', ansTex: R`36/0.01=3600`,
        sol: R`$9\cdot4/0.01=3600$.` },
      { sec: '14.5', type: 'mc', lv: 3, q: R`SGD가 **참 위험** $L_\cD$를 최소화한다고 말하려면 어떤 조건이 필요한가?`,
        choices: [R`같은 표본을 여러 에포크 반복한다`, R`매 단계 새 예제를 $\cD$에서 독립으로 뽑는다(각 예제를 한 번씩만 쓴다)`, R`손실이 강볼록이다`, R`$\eta$를 0으로 보낸다`], ans: 1,
        sol: R`그래야 $\E[v_t\mid w^{(t)}]\in\partial L_\cD(w^{(t)})$입니다. 재사용하면 $L_S$의 부분기울기가 됩니다.` },
      { sec: '14.5b', type: 'mc', lv: 2, q: R`$\eta_t=\frac1{\lambda t}$, $w^{(1)}=0$인 RLM용 SGD에서 $w^{(t+1)}$은?`,
        choices: [R`$-\frac1\lambda v_t$`, R`$-\frac1{\lambda t}\sum_{i=1}^tv_i$`, R`$-\frac1{\lambda}\sum_{i=1}^tv_i$`, R`$\frac{t-1}tw^{(t)}$`], ans: 1,
        sol: R`갱신 $w^{(t+1)}=\frac{t-1}tw^{(t)}-\frac1{\lambda t}v_t$을 귀납적으로 풀면 $v_i$ 평균의 $-\frac1\lambda$배입니다.` },
      { sec: '14.1', type: 'open', lv: 2, proof: true, q: R`GD 보조정리를 증명하세요: $w^{(1)}=0$, $w^{(t+1)}=w^{(t)}-\eta v_t$이면 $\sum_{t=1}^T\langle w^{(t)}-w^\star,v_t\rangle\le\frac{\lVert w^\star\rVert^2}{2\eta}+\frac\eta2\sum_t\lVert v_t\rVert^2$.`,
        sol: R`
$\langle w^{(t)}-w^\star,v_t\rangle=\frac1\eta\langle w^{(t)}-w^\star,w^{(t)}-w^{(t+1)}\rangle$.
$a=w^{(t)}-w^\star$, $b=w^{(t+1)}-w^\star$라 하면 $a-b=w^{(t)}-w^{(t+1)}$이고 $2\langle a,a-b\rangle=\lVert a\rVert^2-\lVert b\rVert^2+\lVert a-b\rVert^2$.
따라서 $\langle w^{(t)}-w^\star,v_t\rangle=\frac1{2\eta}(\lVert a\rVert^2-\lVert b\rVert^2)+\frac1{2\eta}\eta^2\lVert v_t\rVert^2$.
합: 망원합으로 $\frac1{2\eta}(\lVert w^{(1)}-w^\star\rVert^2-\lVert w^{(T+1)}-w^\star\rVert^2)+\frac\eta2\sum\lVert v_t\rVert^2\le\frac{\lVert w^\star\rVert^2}{2\eta}+\frac\eta2\sum\lVert v_t\rVert^2$.`,
        rubric: R`
- $v_t$를 반복값 차이로 표현 — 2점
- 극화 항등식 — 3점
- 망원합과 음수 항 버리기, $w^{(1)}=0$ — 5점` },
      { sec: '14.4b', type: 'open', lv: 2, proof: true, q: R`$f$가 $\lambda$-강볼록이고 $v\in\partial f(w)$이면 $f(u)\ge f(w)+\langle v,u-w\rangle+\frac\lambda2\lVert u-w\rVert^2$임을 증명하세요.`,
        sol: R`
$t\in(0,1]$에서 강볼록성: $f(w+t(u-w))\le(1-t)f(w)+tf(u)-\frac\lambda2t(1-t)\lVert u-w\rVert^2$.
$f(w)$를 빼고 $t$로 나눔: $\frac{f(w+t(u-w))-f(w)}t\le f(u)-f(w)-\frac\lambda2(1-t)\lVert u-w\rVert^2$.
부분기울기: $f(w+t(u-w))\ge f(w)+t\langle v,u-w\rangle$, 즉 좌변 $\ge\langle v,u-w\rangle$.
따라서 $\langle v,u-w\rangle\le f(u)-f(w)-\frac\lambda2(1-t)\lVert u-w\rVert^2$. $t\to0^+$이면 결론.`,
        rubric: R`
- 강볼록성 정의 적용과 $t$로 나누기 — 4점
- 부분기울기 부등식으로 좌변 하한 — 4점
- 극한 — 2점` },
    ],
  });
})();
