/* 13 커널 방법 — UML 16장, 강의 노트 “Supplementary Note on Kernel Method in Section 16”, “Regularization and Kernel Methods: DSML Ch.6 and Beyond” */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 13, part: 'B', title: '커널 방법', en: 'Kernel Methods', ref: 'UML 16장', plot: 'rbf',
    fig: R`표현자 정리: 훈련점에 놓인 가우시안 커널 봉우리 αᵢK(xᵢ, ·)(가는 선)와 그 합 f = Σ αᵢK(xᵢ, ·)(굵은 선, 폭 세 가지)`,
    tagline: R`특징을 명시적으로 만들지 않고 내적만 계산하면 됩니다. 최적해가 언제나 훈련점들의 결합이라는 사실이 그것을 허락합니다.`,
    summary: R`선형 분리가 안 되는 자료도 **특징 사상** $\psi:\cX\to\mathcal F$로 옮기면 분리될 수 있습니다. 문제는 특징 공간이 거대하거나 무한차원이라는 것인데, **표현자 정리**가 이를 해결합니다: 목적함수가 $\langle w,\psi(x_i)\rangle$들과 $\lVert w\rVert$의 증가함수에만 기대면, 최적해를 $w=\sum_i\alpha_i\psi(x_i)$에서 찾을 수 있습니다. 그러면 모든 계산이 **커널** $K(x,x')=\langle\psi(x),\psi(x')\rangle$과 그람 행렬 $G_{ij}=K(x_i,x_j)$만으로 됩니다 — **커널 트릭**. 대칭 함수 $K$가 어떤 특징 공간의 내적일 필요충분조건은 모든 그람 행렬이 양의 준정부호인 것이고(강의 노트는 충분조건을 재생 커널 힐베르트 공간 구성으로 증명), 다항식·가우시안 커널이 대표 예입니다. 커널 소프트 SVM은 계수 벡터만 갱신하는 SGD로 풀리며, 특징 공간에서 돌린 SGD와 **정확히 같은** 알고리즘입니다. 보충 노트는 커널 릿지 회귀와 가우시안 과정 회귀의 예측 평균이 같은 식이라는 연결까지 다룹니다.`,
    goals: [
      R`특징 사상으로 비선형 분리를 선형 분리로 바꾸는 예를 만들 수 있다`,
      R`표현자 정리를 직교 분해와 피타고라스로 증명할 수 있다`,
      R`$w=\sum\alpha_j\psi(x_j)$일 때 $\langle w,\psi(x_i)\rangle=(G\alpha)_i$, $\lVert w\rVert^2=\alpha^\top G\alpha$로 문제를 $\alpha$에 대한 것으로 바꿀 수 있다`,
      R`다항식·가우시안 커널이 어떤 특징의 내적인지 설명하고, 그람 행렬의 양의 준정부호성으로 커널을 판정할 수 있다`,
      R`커널 SVM의 SGD가 특징 공간 SGD와 같음을 귀납법으로 보일 수 있다`,
      R`커널 릿지 회귀의 해 $\alpha=(K+n\lambda I)^{-1}y$와 가우시안 과정 예측 평균의 관계를 설명할 수 있다`,
    ],
    secTitles: { '16.1': '특징 공간', '16.2': '표현자 정리', '16.2b': '커널의 예', '16.2c': '커널 판정', '16.3': '커널 SVM의 SGD', '16.4': '커널 릿지와 GP' },
    sections: [
      { k: '16.1', p: 215, title: '특징 공간으로 옮기기', body: R`
1차원에서 $\{-10,-9,\dots,9,10\}$ 중 $\lvert x\rvert>2$인 점만 $+1$이라 합시다. 어떤 임계값도 이 레이블을 만들 수 없지만, $\psi(x)=(x,x^2)$로 옮기면 $h(x)=\sign(\langle w,\psi(x)\rangle-b)$, $w=(0,1)$, $b=5$로 완벽히 분리됩니다.

일반적으로 $\cX$ 위에 **특징 사상** $\psi:\cX\to\mathcal F$(힐베르트 공간)를 정하고 $\{x\mapsto\sign(\langle w,\psi(x)\rangle)\}$을 배웁니다. 예를 들어 차수 $k$ 이하의 모든 단항식을 특징으로 쓰면 $\mathbb R^n$에서 다항식 분류기가 됩니다.

:::warn 두 가지 비용
1. **통계적**: 특징 공간의 차원(단항식이면 $\binom{n+k}k$ 정도)만큼 VC 차원이 커진다. → 마진·노름 기반 상한(15장)으로 해결: 차원 대신 $\lVert w\rVert$와 $\max\lVert\psi(x)\rVert$가 복잡도를 잰다.
2. **계산적**: $\psi(x)$를 저장·계산하는 것 자체가 불가능할 수 있다(무한차원). → 다음 절의 커널 트릭으로 해결.
:::
` },
      { k: '16.2', p: 217, src: '강의 노트 · 16장 보충', title: '표현자 정리와 커널 트릭', body: R`
:::key 표현자 정리
$f:\mathbb R^m\to\mathbb R$은 임의의 함수, $R:\mathbb R_+\to\mathbb R$은 단조증가 함수, $\psi:\cX\to\mathcal H$가 힐베르트 공간으로의 사상이라 하자. 문제
$$\min_{w\in\mathcal H}\ f\big(\langle w,\psi(x_1)\rangle,\dots,\langle w,\psi(x_m)\rangle\big)+R(\lVert w\rVert)$$
에는 $w=\sum_{i=1}^m\alpha_i\psi(x_i)$ 꼴의 최적해가 있다.
:::

:::hand 강의 노트 — 직교 성분은 손해만 본다
$V=\operatorname{span}\{\psi(x_1),\dots,\psi(x_m)\}$(유한차원이라 닫힌 부분공간). 임의의 $w$를 $w=w_\parallel+w_\perp$, $w_\parallel\in V$, $w_\perp\perp V$로 나누면
- $\langle w,\psi(x_i)\rangle=\langle w_\parallel,\psi(x_i)\rangle$ — 첫 항은 그대로,
- $\lVert w\rVert^2=\lVert w_\parallel\rVert^2+\lVert w_\perp\rVert^2\ge\lVert w_\parallel\rVert^2$이고 $R$이 단조증가라 $R(\lVert w\rVert)\ge R(\lVert w_\parallel\rVert)$.

그래서 $w_\parallel$의 목적값은 $w$의 것 이하입니다. 최적해 $w^\ast$가 있으면 $w^\ast_\parallel\in V$도 최적해입니다. **$R$의 단조성이 없으면 이 논증은 무너집니다.**
:::

**$\alpha$로 다시 쓰기.** $w=\sum_j\alpha_j\psi(x_j)$이면
$$\langle w,\psi(x_i)\rangle=\sum_j\alpha_jK(x_j,x_i)=(G\alpha)_i,\qquad\lVert w\rVert^2=\sum_{i,j}\alpha_i\alpha_jK(x_i,x_j)=\alpha^\top G\alpha,$$
$G_{ij}=K(x_i,x_j)$은 **그람 행렬**. 예컨대 소프트 SVM은
$$\min_{\alpha\in\mathbb R^m}\Big(\lambda\alpha^\top G\alpha+\frac1m\sum_i\max\{0,1-y_i(G\alpha)_i\}\Big)$$
가 되고, 새 점의 예측은 $\langle w,\psi(x)\rangle=\sum_j\alpha_jK(x_j,x)$. $\psi$는 한 번도 나타나지 않습니다 — **커널 트릭**.

:::note 심층 신경망 과목과 비교
같은 트릭을 릿지 회귀에서 “푸시스루 항등식”으로 유도했습니다[[@dnn:ch04:4.4|$(X^\top X+\lambda I)^{-1}X^\top=X^\top(XX^\top+\lambda I)^{-1}$로 $w$를 표본의 결합으로.]]. 표현자 정리는 이것이 릿지만의 우연이 아니라 “손실 + 단조 노름 규제” 전체의 성질임을 보여 줍니다.
:::
` },
      { k: '16.2b', p: 219, title: '다항식 커널과 가우시안 커널', body: R`
:::key 대표적인 커널
- **다항식 커널** $K(x,x')=(1+\langle x,x'\rangle)^k$: $\langle x,x'\rangle$을 전개하면 차수 $k$ 이하의 모든 단항식을 (양의 계수를 붙여) 특징으로 쓴 내적이다. 계산은 $O(n)$, 특징은 $\binom{n+k}k$개.
- **가우시안(RBF) 커널** $K(x,x')=\exp\!\Big(-\dfrac{\lVert x-x'\rVert^2}{2\sigma}\Big)$: 특징이 무한차원이다(1차원에서 $\psi(x)_n=\frac1{\sqrt{n!}}e^{-x^2/2}x^n$, $\sigma=1$).
:::

1차원 가우시안 커널의 특징 확인($\sigma=1$): $e^{-(x-x')^2/2}=e^{-x^2/2}e^{-x'^2/2}e^{xx'}$이고 $e^{xx'}=\sum_n\frac{(xx')^n}{n!}$이므로 $\sum_n\psi(x)_n\psi(x')_n$.

**$\sigma$의 의미.** 가우시안 커널에서 가까운 점은 $K\approx1$, 먼 점은 $K\approx0$ — $\sigma$가 “얼마나 가까워야 비슷하다고 볼지”의 척도입니다. 작으면 표지 그림의 뾰족한 봉우리(과적합 쪽), 크면 완만한 곡선(과소적합 쪽).

:::key 커널을 만드는 규칙
$K_1,K_2$가 커널이면 $aK_1$ ($a\ge0$), $K_1+K_2$, $K_1K_2$(곱), $K_1(\phi(x),\phi(x'))$, 그리고 계수가 음이 아닌 거듭제곱급수 $\sum_na_nK_1^n$도 커널이다.
:::

곱이 커널인 것은 두 양의 준정부호 행렬의 원소별 곱(아다마르 곱)이 양의 준정부호라는 슈어 곱 정리에서 옵니다(보충 노트). 이 규칙으로 $(1+\langle x,x'\rangle)^k$와 $e^{\langle x,x'\rangle/\sigma}$가 커널임이 바로 나오고, 가우시안 커널은 여기에 $e^{-\lVert x\rVert^2/2\sigma}e^{-\lVert x'\rVert^2/2\sigma}$(특징 하나짜리 커널)를 곱한 것입니다.
` },
      { k: '16.2c', p: 222, src: '강의 노트 · Lemma 16.2', title: '커널의 판정: 양의 준정부호 그람 행렬', body: R`
:::key 커널의 특징 (Lemma 16.2)
대칭 함수 $K:\cX\times\cX\to\mathbb R$이 어떤 힐베르트 공간의 내적 $K(x,x')=\langle\psi(x),\psi(x')\rangle$으로 쓰일 필요충분조건은, 모든 유한 점 집합 $x_1,\dots,x_m$에 대해 그람 행렬 $G_{ij}=K(x_i,x_j)$가 양의 준정부호인 것이다.
:::

**필요.** $c^\top Gc=\sum_{i,j}c_ic_j\langle\psi(x_i),\psi(x_j)\rangle=\big\lVert\sum_ic_i\psi(x_i)\big\rVert^2\ge0$.

:::hand 강의 노트 — 충분조건: 공간을 직접 만든다
1. 함수들의 유한 결합 $f=\sum_i\alpha_iK(\cdot,x_i)$의 공간 $F_0$를 만든다.
2. $\langle f,g\rangle_0=\sum_{i,j}\alpha_i\beta_jK(x_i,x_j')$ ($g=\sum_j\beta_jK(\cdot,x_j')$)로 쌍선형형식을 정의한다. 양의 준정부호 가정으로 $\langle f,f\rangle_0\ge0$.
3. $\langle f-g,f-g\rangle_0=0$인 것끼리 같게 보는 몫공간에서 내적이 되고, 완비화하면 힐베르트 공간 $\mathcal H$.
4. $\psi(x)=[K(\cdot,x)]$로 두면 $\langle\psi(x),\psi(x')\rangle=K(x,x')$.

이렇게 만든 공간은 **재생 성질** $f(x)=\langle f,K(\cdot,x)\rangle$을 가지는 재생 커널 힐베르트 공간(RKHS)이고, 이 구성을 무어–아론샤인 정리라 부릅니다.
:::

:::ex 예제 — 커널이 아닌 함수
$K(x,x')=\lVert x-x'\rVert^2$은 커널인가?
---
두 점 $x\ne x'$의 그람 행렬 $\begin{pmatrix}0&a\\a&0\end{pmatrix}$ ($a=\lVert x-x'\rVert^2>0$)는 $c=(1,-1)$에서 $c^\top Gc=-2a<0$. 양의 준정부호가 아니므로 커널이 아닙니다. (그래서 거리 자체가 아니라 $e^{-\text{거리}^2}$를 씁니다.)
:::
` },
      { k: '16.3', p: 222, src: '강의 노트 · 16장 보충', title: '커널 소프트 SVM을 SGD로', body: R`
15장의 소프트 SVM SGD는 $\theta^{(t)}$에 마진을 어긴 예제의 $y_i\psi(x_i)$를 더해 갑니다. 그러므로 $\theta^{(t)}$는 늘 $\operatorname{span}\{\psi(x_j)\}$에 있고, 계수 $\beta^{(t)}\in\mathbb R^m$으로 $\theta^{(t)}=\sum_j\beta^{(t)}_j\psi(x_j)$라 쓸 수 있습니다.

:::def 커널 소프트 SVM의 SGD
$\beta^{(1)}=0$. $t=1,\dots,T$: $\alpha^{(t)}=\frac1{\lambda t}\beta^{(t)}$; $i\sim U[m]$; $\beta^{(t+1)}=\beta^{(t)}$로 두되, $y_i\sum_j\alpha^{(t)}_jK(x_j,x_i)<1$이면 $\beta^{(t+1)}_i=\beta^{(t)}_i+y_i$. 출력 $\bar w=\sum_j\bar\alpha_j\psi(x_j)$, $\bar\alpha=\frac1T\sum_t\alpha^{(t)}$.
:::

:::key 커널 SGD와 특징 공간 SGD의 동치
위 알고리즘의 출력은 특징 공간에서 직접 돌린 소프트 SVM SGD의 출력과 같다. 모든 $t$에서 $\theta^{(t)}=\sum_j\beta^{(t)}_j\psi(x_j)$, $w^{(t)}=\sum_j\alpha^{(t)}_j\psi(x_j)$.
:::

귀납법: 성립한다고 하면 $y_i\langle w^{(t)},\psi(x_i)\rangle=y_i\sum_j\alpha_j^{(t)}K(x_j,x_i)$라 **마진 판정이 같고**, 갱신도 “$\theta$에 $y_i\psi(x_i)$를 더함” ⇔ “$\beta_i$에 $y_i$를 더함”으로 같습니다. 근사가 아니라 좌표만 바꾼 **같은** 알고리즘입니다.
` },
      { k: '16.4', p: 225, src: '강의 노트 · DSML 6장 보충', title: '커널 릿지 회귀와 가우시안 과정', body: R`
제곱 손실에 표현자 정리를 쓰면 **커널 릿지 회귀**가 됩니다. $f=\sum_j\alpha_jK(\cdot,x_j)$, $K$를 그람 행렬이라 하면
$$\min_\alpha\ \frac1n\lVert y-K\alpha\rVert^2+\lambda\,\alpha^\top K\alpha.$$

:::key 커널 릿지 회귀의 해
정류 조건은 $K\big((K+n\lambda I)\alpha-y\big)=0$이고, $\alpha=(K+n\lambda I)^{-1}y$가 해이다. 새 점의 예측은
$$\hat f(x)=k_x^\top(K+n\lambda I)^{-1}y,\qquad k_x=(K(x,x_1),\dots,K(x,x_n))^\top.$$
:::

$\nabla_\alpha=-\frac2nK(y-K\alpha)+2\lambda K\alpha=\frac2nK\big((K+n\lambda I)\alpha-y\big)$. $K$가 가역이면 해가 유일하고, 특이해도 위 $\alpha$가 해이며 예측값 $\hat f$는 해의 선택과 무관합니다.

**가우시안 과정 회귀.** $g\sim\mathcal{GP}(0,K)$, $y_i=g(x_i)+\varepsilon_i$, $\varepsilon_i\sim\N(0,\sigma^2)$이면 $(y,g(x))$가 결합 가우시안이고, 조건부 분포 공식으로

:::key 가우시안 과정의 예측 분포
$$g(x)\mid y\sim\N\big(\mu(x),s^2(x)\big),\qquad\mu(x)=k_x^\top(K+\sigma^2I)^{-1}y,\qquad s^2(x)=K(x,x)-k_x^\top(K+\sigma^2I)^{-1}k_x.$$
:::

예측 평균은 $n\lambda=\sigma^2$인 커널 릿지 회귀와 **같은 식**입니다. 가우시안 과정은 여기에 불확실성 $s^2(x)$을 더합니다 — 훈련점 근처에서는 작고 멀어질수록 사전분산 $K(x,x)$로 돌아갑니다.

:::note 규제의 세 얼굴
같은 $(K+c I)^{-1}$이 (1) 규제 계수, (2) 잡음 분산, (3) 사전분포의 정밀도로 세 번 나타납니다. 심층 신경망 과목의 “MAP = 릿지”와 같은 이야기의 무한차원판입니다[[@dnn:ch04:4.5|커널 릿지 회귀의 예측식.]].
:::
` },
    ],
    problems: [
      { sec: '16.1', type: 'mc', lv: 1, q: R`1차원 점 중 $\lvert x\rvert>2$인 것만 $+1$일 때, 선형 분리를 가능하게 하는 가장 간단한 특징 사상은?`,
        choices: [R`$\psi(x)=2x$`, R`$\psi(x)=(x,x^2)$`, R`$\psi(x)=x+1$`, R`$\psi(x)=\sign(x)$`], ans: 1,
        sol: R`$x^2>4$로 분리됩니다: $w=(0,1)$, 문턱 4와 9 사이(예: 5).` },
      { sec: '16.2', type: 'mc', lv: 2, q: R`표현자 정리의 가정에서 규제항 $R$에 필요한 성질은?`,
        choices: [R`볼록`, R`단조증가(비감소)`, R`미분가능`, R`유계`], ans: 1,
        sol: R`직교 성분을 버려도 노름이 줄기만 하므로 $R$이 비감소면 손해가 없습니다. 볼록성은 필요 없습니다.` },
      { sec: '16.2', type: 'num', lv: 2, q: R`그람 행렬 $G=\begin{pmatrix}2&1\\1&3\end{pmatrix}$, $\alpha=(1,-1)$일 때 $\lVert w\rVert^2=\alpha^\top G\alpha$는?`, ans: '3', ansTex: R`2-1-1+3=3`,
        sol: R`$\alpha^\top G\alpha=2-2\cdot1+3=3$.` },
      { sec: '16.2', type: 'num', lv: 2, q: R`같은 $G$와 $\alpha$에서 첫 훈련점의 예측값 $\langle w,\psi(x_1)\rangle=(G\alpha)_1$은?`, ans: '1', ansTex: R`2-1=1`,
        sol: R`$(G\alpha)_1=2\cdot1+1\cdot(-1)=1$.` },
      { sec: '16.2b', type: 'num', lv: 1, q: R`$x=(1,2)$, $x'=(2,0)$일 때 다항식 커널 $(1+\langle x,x'\rangle)^2$의 값은?`, ans: '9', ansTex: R`(1+2)^2=9`,
        sol: R`$\langle x,x'\rangle=2$, $(1+2)^2=9$.` },
      { sec: '16.2b', type: 'num', lv: 2, q: R`가우시안 커널 $\exp(-\lVert x-x'\rVert^2/(2\sigma))$에서 $\lVert x-x'\rVert=2$, $\sigma=1$일 때 값은? (소수 넷째 자리)`, ans: 'e^(-2)', ansTex: R`e^{-2}\approx0.1353`,
        sol: R`$e^{-4/2}=e^{-2}\approx0.1353$.` },
      { sec: '16.2c', type: 'mc', lv: 2, q: R`다음 중 커널이 **아닌** 것은?`,
        choices: [R`$K(x,x')=\langle x,x'\rangle^2$`, R`$K(x,x')=e^{\langle x,x'\rangle}$`, R`$K(x,x')=-\langle x,x'\rangle$`, R`$K(x,x')=3\langle x,x'\rangle+1$`], ans: 2,
        sol: R`$-\langle x,x'\rangle$의 그람 행렬 대각 원소 $-\lVert x\rVert^2<0$이라 양의 준정부호가 아닙니다. 나머지는 곱·지수·양수배·상수 더하기 규칙으로 커널입니다.` },
      { sec: '16.2c', type: 'mc', lv: 2, q: R`그람 행렬 $\begin{pmatrix}1&2\\2&1\end{pmatrix}$을 주는 대칭 함수에 대해 옳은 것은?`,
        choices: [R`커널이다`, R`행렬식이 $-3<0$이라 양의 준정부호가 아니므로 커널이 아니다`, R`대각이 양수이므로 커널이다`, R`판정할 수 없다`], ans: 1,
        sol: R`$c=(1,-1)$에서 $1-4+1=-2<0$. 고윳값 $3,-1$.` },
      { sec: '16.3', type: 'mc', lv: 2, q: R`커널 SVM의 SGD에서 마진 조건을 만족하지 않은 예제 $i$가 뽑히면 바뀌는 것은?`,
        choices: [R`모든 $\beta_j$`, R`$\beta_i$만 $y_i$만큼`, R`$\alpha$ 전체가 0으로`, R`커널 행렬`], ans: 1,
        sol: R`특징 공간에서 $y_i\psi(x_i)$를 더하는 것은 계수 $\beta_i$에 $y_i$를 더하는 것과 같습니다.` },
      { sec: '16.4', type: 'num', lv: 2, q: R`훈련점 하나 $x_1$, $K(x_1,x_1)=1$, $y_1=2$, $n\lambda=1$일 때 커널 릿지 해 $\alpha_1=(K+n\lambda I)^{-1}y$는?`, ans: '1', ansTex: R`2/(1+1)=1`,
        sol: R`$\alpha_1=2/2=1$. 새 점의 예측은 $K(x,x_1)\cdot1$ — 훈련점에서의 예측은 1로, 정답 2보다 0 쪽으로 줄었습니다.` },
      { sec: '16.4', type: 'num', lv: 3, q: R`위 설정을 가우시안 과정으로 보면($\sigma^2=1$) 훈련점 $x=x_1$에서의 예측 분산 $K(x,x)-k_x^\top(K+\sigma^2I)^{-1}k_x$는?`, ans: '0.5', ansTex: R`1-\tfrac12=\tfrac12`,
        sol: R`$1-1\cdot\frac12\cdot1=0.5$. 관측 하나로 사전분산 1이 절반으로 줄었습니다.` },
      { sec: '16.2', type: 'open', lv: 2, proof: true, q: R`표현자 정리를 증명하세요: $f$가 임의이고 $R$이 비감소이면 $\min_w f(\langle w,\psi(x_1)\rangle,\dots,\langle w,\psi(x_m)\rangle)+R(\lVert w\rVert)$에 $w=\sum\alpha_i\psi(x_i)$ 꼴의 최적해가 있다(최적해가 존재한다고 가정).`,
        sol: R`
$V=\operatorname{span}\{\psi(x_i)\}$는 유한차원이라 닫혀 있고, 최적해 $w^\ast$를 $w^\ast=u+v$, $u\in V$, $v\perp V$로 분해합니다(정사영).
$\langle w^\ast,\psi(x_i)\rangle=\langle u,\psi(x_i)\rangle+\langle v,\psi(x_i)\rangle=\langle u,\psi(x_i)\rangle$ ($\psi(x_i)\in V$, $v\perp V$). 따라서 $f$ 항이 같습니다.
$\lVert w^\ast\rVert^2=\lVert u\rVert^2+\lVert v\rVert^2\ge\lVert u\rVert^2$ (피타고라스), $R$ 비감소라 $R(\lVert u\rVert)\le R(\lVert w^\ast\rVert)$.
그러므로 $u$의 목적값 $\le$ $w^\ast$의 목적값 = 최솟값. $u$도 최적해이고 $u\in V$라 $u=\sum\alpha_i\psi(x_i)$.`,
        rubric: R`
- 직교 분해 — 2점
- 내적 항이 그대로임 — 3점
- 피타고라스와 단조성 — 3점
- 결론 — 2점` },
      { sec: '16.2c', type: 'open', lv: 2, proof: true, q: R`$K(x,x')=\langle\psi(x),\psi(x')\rangle$이면 모든 그람 행렬이 양의 준정부호임을 보이고, 두 커널의 합 $K_1+K_2$가 커널임을 그람 행렬로 증명하세요.`,
        sol: R`
$c^\top Gc=\sum_{i,j}c_ic_j\langle\psi(x_i),\psi(x_j)\rangle=\langle\sum_ic_i\psi(x_i),\sum_jc_j\psi(x_j)\rangle=\lVert\sum_ic_i\psi(x_i)\rVert^2\ge0$.
합: 같은 점들에서 $K_1+K_2$의 그람 행렬은 $G_1+G_2$이고 $c^\top(G_1+G_2)c=c^\top G_1c+c^\top G_2c\ge0$. 대칭이므로 판정 정리(Lemma 16.2)로 커널. (직접 구성: $\psi(x)=(\psi_1(x),\psi_2(x))$를 곱공간에 두면 내적이 $K_1+K_2$.)`,
        rubric: R`
- 이차형식을 노름 제곱으로 — 4점
- 합의 그람 행렬과 양의 준정부호성 — 4점
- 판정 정리 또는 직접 구성으로 결론 — 2점` },
    ],
  });
})();
