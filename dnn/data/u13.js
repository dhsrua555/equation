/* 13 경사하강법의 수렴: 하강 보조정리 — 4주차 수요일 s.1–10, 4주차 수요일(2) 필기 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 13, part: 'D', title: '하강 보조정리와 경사하강법의 수렴', en: 'Descent Lemma & Convergence of Gradient Descent', ref: 'W4 수 · s.1–10 필기', plot: 'descent',
    fig: R`β-매끄러운 함수(굵은 선)는 각 점에서 만든 이차 상한(가는 포물선)들 아래에 있다`,
    tagline: R`$\nabla f$가 $\beta$-립시츠이면 $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$. 여기에 $y=x-\eta\nabla f$를 넣으면 $\eta<2/\beta$일 때 반드시 내려갑니다.`,
    summary: R`경사하강법 $x_{t+1}=x_t-\eta\nabla f(x_t)$를 1차 테일러 근사로 정당화하고(기울기의 반대 방향이 가장 가파른 하강 방향), 이를 엄밀하게 만드는 **하강 보조정리**(Lemma 3.1)를 증명합니다. 수업 필기에서는 보조함수 $g(t)=f(x+t(y-x))$, 연쇄법칙으로 $g''$ 구하기(①), 적분형 나머지를 가진 테일러 공식(②, D.I.Y.), 립시츠 기울기에서 $v^T\nabla^2fv\le\beta\lVert v\rVert^2$(③, “다음 시간”)의 세 단계로 증명했습니다. 이 단원은 세 단계를 모두 채우고, GD 한 걸음의 감소량 $(\eta-\frac{\beta\eta^2}2)\lVert\nabla f\rVert^2$과 확률적 경사하강 보조정리까지 다룹니다.`,
    goals: [
      R`1차 테일러 근사와 코시-슈바르츠 부등식으로 최급강하 방향이 $-\nabla f/\lVert\nabla f\rVert$임을 보일 수 있다`,
      R`$\beta$-매끄러움을 정의하고 $C^2$ 함수에서 $-\beta I\preceq\nabla^2f\preceq\beta I$와의 관계를 증명할 수 있다`,
      R`하강 보조정리를 $g(t)$, 연쇄법칙, 적분형 테일러 공식으로 증명할 수 있다`,
      R`GD 한 걸음의 감소 부등식과 수렴 조건 $\eta<2/\beta$를 유도할 수 있다`,
      R`확률적 경사하강 보조정리를 유도하고 분산 항의 역할과 합산 부등식을 설명할 수 있다`,
    ],
    secTitles: { '13.1': '테일러 직관', '13.2': 'β-매끄러움', '13.3': '하강 보조정리', '13.4': 'GD 감소 조건', '13.5': '딥러닝에서의 의미', '13.6': 'SGD 보조정리' },
    sections: [
      { k: '13.1', src: 'W4 수 · 슬라이드 2–4 필기', title: '경사하강법과 테일러 직관', body: R`
제약 없는 최적화 문제 $\min_{x\in\mathbb R^d}f(x)$, $f:\mathbb R^d\to\mathbb R$(목적함수)를 생각합니다. 경사하강법은 초기점 $x_0\in\mathbb R^d$에서 시작해 $t=0,1,2,\dots$에 대해
$$x_{t+1}=x_t-\eta\nabla f(x_t),\qquad \eta>0\ (\text{학습률, 보폭})$$
으로 갱신합니다.

**왜 이 방향인가.** $x_t$ 근처에서 1차 테일러 근사[[@base:ch04:4.3|다변수 테일러 전개와 헤시안.]]는
$$f(x_{t+1})\approx f(x_t)+\langle\nabla f(x_t),\,x_{t+1}-x_t\rangle.$$
갱신을 $x_{t+1}=x_t+\eta v$ ($\lVert v\rVert=1$, $\eta>0$ 작음)로 쓰면 $f(x_{t+1})\approx f(x_t)+\eta\langle\nabla f(x_t),v\rangle$. 필기처럼 $f(x_{t+1})\le f(x_t)$가 되게, 즉 $f(x_{t+1})$을 최대한 작게 하려면 내적 $\langle\nabla f(x_t),v\rangle$을 최대한 음수로 만들어야 합니다.

:::key 최급강하 방향
단위벡터 $v$ 중 $\langle\nabla f(x),v\rangle$을 최소로 하는 것은
$$v=-\frac{\nabla f(x)}{\lVert\nabla f(x)\rVert},\qquad \min_{\lVert v\rVert=1}\langle\nabla f(x),v\rangle=-\lVert\nabla f(x)\rVert.$$
:::

코시-슈바르츠 부등식 $\lvert\langle a,v\rangle\rvert\le\lVert a\rVert\lVert v\rVert$에서 $\langle\nabla f,v\rangle\ge-\lVert\nabla f\rVert$이고, 등호는 $v$가 $-\nabla f$와 같은 방향일 때입니다[[@em:ch08:9.7|방향도함수 $D_uf=u\cdot\nabla f$는 $u=\nabla f/\lVert\nabla f\rVert$에서 최대, 반대 방향에서 최소.]].

대입하면 $x_{t+1}=x_t-\eta\dfrac{\nabla f(x_t)}{\lVert\nabla f(x_t)\rVert}$. 정규화 인수를 학습률에 흡수해 $\eta'=\eta/\lVert\nabla f(x_t)\rVert$로 두면 표준 GD $x_{t+1}=x_t-\eta'\nabla f(x_t)$가 됩니다. 이 직관을 테일러 정리로 엄밀하게 만드는 것이 다음 절들입니다.

:::note 오일러 방법과의 관계
GD는 기울기 흐름 $\dot x=-\nabla f(x)$를 보폭 $\eta$로 푼 오일러 방법입니다[[@em:ch01:1.2|오일러 방법 $y_{n+1}=y_n+hf(x_n,y_n)$.]].
:::
` },
      { k: '13.2', src: 'W4 수 · 슬라이드 5, W4 수(2) 필기 ③', title: 'β-매끄러움', body: R`
:::def β-매끄러움 (L-smooth)
$f:\mathbb R^d\to\mathbb R$이 연속 미분가능하고 기울기가 $\beta$-립시츠 연속이면, 즉
$$\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert\qquad\forall x,y\in\mathbb R^d,$$
$f$를 **$\beta$-매끄럽다**고 합니다(슬라이드 8 이후에는 같은 상수를 $L$로 씁니다).
:::

기울기가 너무 빨리 변하지 않는다는 조건입니다. 곡률의 상한이라고 생각하면 됩니다.[[@base:ch05:5.1|립시츠 조건: 여기서는 함수가 아니라 기울기에 거는 조건.]]

:::key β-매끄러움과 헤시안
$f\in C^2$이면
$$\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert\ \ \forall x,y\iff -\beta I\preceq\nabla^2f(x)\preceq\beta I\ \ \forall x.$$
특히 모든 $v$에 대해 $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ (필기: 이것은 $\nabla^2f(x)\preceq\beta I$와 같은 말).
:::

(⇒)의 핵심: $\nabla^2f(x)v=\lim_{s\to0}\frac{\nabla f(x+sv)-\nabla f(x)}s$이고 분자의 노름이 $\beta s\lVert v\rVert$ 이하이므로 $\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert$. 코시-슈바르츠로 $\lvert v^T\nabla^2f(x)v\rvert\le\lVert v\rVert\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert^2$. 수업에서 “다음 시간”으로 미룬 부분이며, 증명 페이지에 양방향을 모두 적었습니다.

:::ex 예제 1 — 이차함수
$f(x)=\frac12x^TAx$ ($A$ 대칭)의 매끄러움 상수는?
---
$\nabla f=Ax$이므로 $\lVert\nabla f(x)-\nabla f(y)\rVert=\lVert A(x-y)\rVert\le\lVert A\rVert_2\lVert x-y\rVert$. 최소 상수는 $\beta=\lVert A\rVert_2=\max_i\lvert\lambda_i(A)\rvert$ (가장 큰 고윳값의 절댓값)[[@em:ch07:8.3|대칭행렬은 실수 고윳값과 직교 고유벡터를 가집니다.]]. 예: $A=\diag(1,10)$이면 $\beta=10$.
:::
` },
      { k: '13.3', src: 'W4 수 · 슬라이드 5, W4 수(2) 필기', title: '하강 보조정리와 증명', body: R`
:::key 하강 보조정리 (Lemma 3.1)
$f:\mathbb R^d\to\mathbb R$이 연속 미분가능하고 $\nabla f$가 $\beta$-립시츠이면
$$f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2\qquad\forall x,y.$$
:::

$f$는 각 점에서 만든 **이차 상한** 아래에 있습니다(표지 그림). 1차 근사의 오차가 $\frac\beta2\lVert y-x\rVert^2$을 넘지 않는다는 뜻입니다.

:::hand 수업 필기 — 증명 (f ∈ C²로 가정)
보조함수 $g(t)=f(x+t(y-x))$, $t\in\mathbb R$를 정의합니다.

**① 연쇄법칙.**
$$g'(t)=\langle\nabla f(x+t(y-x)),\,y-x\rangle,\qquad g''(t)=(y-x)^T\nabla^2f(x+t(y-x))(y-x).$$

**② 적분형 나머지를 가진 테일러 공식.**
$$g(1)=g(0)+g'(0)+\int_0^1(1-s)g''(s)\,ds.$$
$g(0)=f(x)$, $g(1)=f(x+y-x)=f(y)$, $g'(0)=\langle\nabla f(x),y-x\rangle$이므로
$$f(y)=f(x)+\langle\nabla f(x),y-x\rangle+\int_0^1(1-s)(y-x)^T\nabla^2f(x+s(y-x))(y-x)\,ds.\qquad(*)$$

**③ β-매끄러움.** 모든 $v$에 대해 $v^T\nabla^2fv\le\beta\lVert v\rVert^2$이므로
$$\int_0^1(1-s)(y-x)^T\nabla^2f(\cdot)(y-x)\,ds\le\int_0^1(1-s)\beta\lVert y-x\rVert^2ds=\beta\lVert y-x\rVert^2\int_0^1(1-s)\,ds=\frac\beta2\lVert y-x\rVert^2.$$
$(*)$에 넣으면 $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$. ∎
:::

**① 의 근거(필기).** $p=y-x\in\mathbb R^{n\times1}$ (열벡터), $z(t)=x+tp$, $z'(t)=p$. $g(t)=f(z(t))$이므로 $g'(t)=Df(z(t))\,z'(t)$이고 $Df(z)=\nabla f(z)^T\in\mathbb R^{1\times n}$ (행벡터). 따라서 $g'(t)=\nabla f(z(t))^Tp=p^T\nabla f(z(t))$ ($1\times n$ 곱하기 $n\times1$). 다시 미분하면 $\nabla f:\mathbb R^n\to\mathbb R^n$의 도함수가 헤시안 $D(\nabla f(z))=\nabla^2f(z)$이므로 $\frac d{dt}\nabla f(z(t))=\nabla^2f(z(t))z'(t)$ ($n\times n$ 곱하기 $n\times1$), 즉 $g''(t)=p^T\nabla^2f(z(t))p$ ($1\times1$).

**② 의 근거(필기 D.I.Y.).** 미적분학의 기본정리로 $g(1)=g(0)+\int_0^1g'(s)ds$. 부분적분에서 $u=g'(s)$, $dv=ds$로 두되 $v=-(1-s)$를 고르면
$$\int_0^1g'(s)ds=\big[-(1-s)g'(s)\big]_0^1+\int_0^1(1-s)g''(s)ds=g'(0)+\int_0^1(1-s)g''(s)ds.$$
(필기의 “$u=1-s$, $v'=g''(s)$”로 두어도 같은 식이 나옵니다.)

:::tip 헤시안 없이 증명하기
$f\in C^1$만 가정해도 됩니다: $f(y)-f(x)-\langle\nabla f(x),y-x\rangle=\int_0^1\langle\nabla f(x+t(y-x))-\nabla f(x),\,y-x\rangle dt\le\int_0^1\beta t\lVert y-x\rVert^2dt=\frac\beta2\lVert y-x\rVert^2$ (코시-슈바르츠와 립시츠 조건). 슬라이드의 정리는 이 가정($C^1$)으로 적혀 있습니다.
:::
` },
      { k: '13.4', src: 'W4 수 · 슬라이드 6 필기', title: '경사하강법 한 걸음의 감소량', body: R`
하강 보조정리에 GD 한 걸음 $y=x_{t+1}=x_t-\eta\nabla f(x_t)$, $x=x_t$를 넣습니다.
$$\begin{aligned}f(x_{t+1})&\le f(x_t)+\langle\nabla f(x_t),x_{t+1}-x_t\rangle+\frac\beta2\lVert x_{t+1}-x_t\rVert^2\\&=f(x_t)+\langle\nabla f(x_t),-\eta\nabla f(x_t)\rangle+\frac\beta2\lVert-\eta\nabla f(x_t)\rVert^2\\&=f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac{\beta\eta^2}2\lVert\nabla f(x_t)\rVert^2.\end{aligned}$$

:::key 경사하강법의 감소 조건
$$f(x_{t+1})\le f(x_t)-\Big(\eta-\frac{\beta\eta^2}2\Big)\lVert\nabla f(x_t)\rVert^2$$
$\eta-\frac{\beta\eta^2}2>0\iff0<\eta<\frac2\beta$이면 $f(x_{t+1})\le f(x_t)$ (기울기가 0이 아니면 순감소). 감소량은 $\eta=\frac1\beta$에서 최대 $\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2$.
:::

즉 **보폭이 충분히 작으면 GD는 매끄러운 함수의 값을 반드시 줄입니다.**

**수렴 속도(보충).** $\eta=1/\beta$로 두고 $t=0,\dots,T-1$에 대해 더하면 망원급수가 되어
$$\frac1{2\beta}\sum_{t=0}^{T-1}\lVert\nabla f(x_t)\rVert^2\le f(x_0)-f(x_T)\le f(x_0)-f^*,\qquad \min_{0\le t<T}\lVert\nabla f(x_t)\rVert^2\le\frac{2\beta\big(f(x_0)-f^*\big)}T.$$
볼록성 없이도 기울기가 $O(1/\sqrt T)$ 속도로 0에 다가갑니다(정류점으로 수렴; 전역 최소라는 보장은 없음).

:::ex 예제 2 — 이차함수에서의 한계
$f(x)=\frac\beta2x^2$ ($x\in\mathbb R$)에 GD를 쓰면 $x_{t+1}=(1-\eta\beta)x_t$. 언제 수렴하나?
---
$\lvert1-\eta\beta\rvert<1\iff0<\eta<2/\beta$. $\eta=2/\beta$이면 $x_{t+1}=-x_t$로 제자리에서 진동, 그보다 크면 발산합니다. 보조정리의 조건 $\eta<2/\beta$가 이 경우 **정확히** 최선입니다.
:::
` },
      { k: '13.5', src: 'W4 수 · 슬라이드 7', title: '딥러닝에서의 의미', body: R`
딥러닝의 손실에서는 “$\nabla f$가 $L$-립시츠”라는 조건이 **보통 성립하지 않습니다**(예: ReLU는 미분 불가능한 점이 있고, 가중치가 커지면 곡률도 커짐). 이런 수학적 분석의 목적은 **정성적 통찰**을 얻는 것이며, 이 수렴 증명은 GD와 SGD의 학습 동역학에 대한 직관을 주기 위한 것입니다.

딥러닝 시스템을 있는 그대로 엄밀히 분석하기 어렵기 때문에 보통
- 단순화된 설정을 **엄밀하게** 분석하거나,
- 전체 설정을 **발견적으로** 분석합니다.

어느 쪽이든 목표는 이론적 보장보다 정성적 통찰입니다. 예를 들어 “곡률($\beta$)이 크면 학습률을 작게 해야 한다”, “BN이 손실 곡면을 매끄럽게 하면 더 큰 학습률을 쓸 수 있다”[[ch12:12.5|BN의 대안 설명: 매끄러운 손실 곡면.]] 같은 결론입니다.
` },
      { k: '13.6', src: 'W4 수 · 슬라이드 8–10', title: '확률적 경사하강 보조정리', body: R`
SGD는 $x_{t+1}=x_t-\eta\tilde\nabla f(x_t)$, $\tilde\nabla f(x_t)$는 불편추정량 $\E_t[\tilde\nabla f(x_t)]=\nabla f(x_t)$입니다. 표기: $\E_t[\cdot]=\E[\cdot\mid x_t]$.

$L$-매끄러운 $f$의 이차 상한 $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac L2\lVert x-y\rVert_2^2$에 앞에서와 똑같이 $y=x_{t+1}$, $x=x_t$를 넣으면
$$f(x_{t+1})\le f(x_t)-\eta\langle\nabla f(x_t),\tilde\nabla f(x_t)\rangle+\frac L2\eta^2\lVert\tilde\nabla f(x_t)\rVert_2^2.$$
조건부 기댓값을 취하고 불편성을 쓰면 다음을 얻습니다.

:::key 확률적 경사하강 보조정리
$f$가 $L$-매끄럽고 $\eta>0$이 임의의 보폭이면 SGD의 연속한 두 반복점은
$$\E_t[f(x_{t+1})]\le f(x_t)-\eta\lVert\nabla f(x_t)\rVert_2^2+\frac L2\eta^2\,\E_t\big[\lVert\tilde\nabla f(x_t)\rVert_2^2\big].$$
$\E_t[\lVert\tilde\nabla f(x_t)\rVert^2]\le G$ ($\forall t$)이면
$$\lVert\nabla f(x_t)\rVert_2^2\le\frac1\eta\E_t\big[f(x_t)-f(x_{t+1})\big]+\frac L2\eta G,\qquad \sum_{t=0}^{T-1}\lVert\nabla f(x_t)\rVert_2^2\le\frac1\eta\Big(\sum_{t=0}^{T-1}\E_t\big[f(x_t)-f(x_{t+1})\big]\Big)+\frac L2\eta GT.$$
:::

- 슬라이드는 $\E_t\lVert\tilde\nabla f\rVert^2$을 “확률적 기울기의 분산”이라 부르지만, 정확히는 **2차 모멘트**입니다: $\E_t\lVert\tilde\nabla f\rVert^2=\lVert\nabla f\rVert^2+\E_t\lVert\tilde\nabla f-\nabla f\rVert^2$ (편향² + 분산). 대입하면 $\E_tf(x_{t+1})\le f(x_t)-\eta(1-\frac{L\eta}2)\lVert\nabla f\rVert^2+\frac{L\eta^2}2\Var_t$로, 분산이 0이면 GD의 결과와 같아집니다.
- 정확한 GD와 마찬가지로 $\eta$가 충분히 작으면 **기댓값으로** 감소가 보장되고, 그 문턱값은 추정량의 분산에 **반비례**합니다. 미니배치를 키우면 분산이 $\frac1B$로 줄어[[ch10:10.2|i.i.d. 미니배치 기울기의 분산은 $\Sigma/B$.]] 더 큰 학습률을 쓸 수 있습니다.
- 합산 부등식을 $T$로 나누면 평균 기울기 제곱이 $\frac{f(x_0)-f^*}{\eta T}+\frac L2\eta G$ 이하입니다. $\eta$가 고정이면 두 번째 항 때문에 0으로 가지 않고 **잡음 바닥**에 머뭅니다. $\eta\propto1/\sqrt T$로 두면 $O(1/\sqrt T)$로 줄어듭니다 — 학습률 감소 스케줄이 필요한 이론적 이유입니다.
` },
    ],
    problems: [
      { sec: '13.1', type: 'mc', lv: 1, q: R`$\nabla f(x)=(3,4)$일 때 $\langle\nabla f(x),v\rangle$을 최소로 하는 단위벡터 $v$는?`,
        choices: [R`$(0.6,0.8)$`, R`$(-0.6,-0.8)$`, R`$(0.8,-0.6)$`, R`$(-1,0)$`], ans: 1,
        sol: R`$-\nabla f/\lVert\nabla f\rVert=-(3,4)/5$. 최솟값은 $-5$. $(0.8,-0.6)$은 기울기와 직교해 1차 변화가 0입니다.` },
      { sec: '13.1', type: 'num', lv: 1, q: R`$f(x,y)=x^2+3y^2$, 점 $(1,1)$, $\eta=0.1$로 GD 한 걸음 뒤의 $y$좌표는?`, ans: '0.4', ansTex: R`0.4`,
        sol: R`$\nabla f=(2x,6y)=(2,6)$. $y\leftarrow1-0.1\times6=0.4$ ($x\leftarrow0.8$).` },
      { sec: '13.2', type: 'num', lv: 1, q: R`$f(x)=\frac12x^TAx$, $A=\begin{pmatrix}2&0\\0&8\end{pmatrix}$의 매끄러움 상수 $\beta$(최소값)는?`, ans: '8', ansTex: R`8`,
        sol: R`$\beta=\lVert A\rVert_2=\max\lvert\lambda_i\rvert=8$.` },
      { sec: '13.2', type: 'num', lv: 2, q: R`위 함수에 GD를 쓸 때 감소가 보장되는 학습률의 상한 $2/\beta$는?`, ans: '1/4', ansTex: R`\tfrac14`,
        sol: R`$2/8=0.25$. 곡률이 가장 큰 방향(고윳값 8)이 학습률을 제한합니다.` },
      { sec: '13.2', type: 'mc', lv: 2, q: R`$f\in C^2$에서 “$v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ ($\forall v$)”와 같은 말은?`,
        choices: [R`$\nabla^2f(x)\succeq\beta I$`, R`$\nabla^2f(x)\preceq\beta I$`, R`$\nabla^2f(x)=\beta I$`, R`$\det\nabla^2f(x)\le\beta$`], ans: 1,
        sol: R`$v^T(\beta I-\nabla^2f)v\ge0$, 즉 $\beta I-\nabla^2f\succeq0$ (필기의 note).` },
      { sec: '13.3', type: 'mc', lv: 2, q: R`하강 보조정리의 증명에서 $g(t)=f(x+t(y-x))$의 이계도함수는?`,
        choices: [R`$\nabla^2f(x+t(y-x))$`, R`$(y-x)^T\nabla^2f(x+t(y-x))(y-x)$`, R`$\lVert y-x\rVert^2$`, R`$\langle\nabla f(x),y-x\rangle$`], ans: 1,
        sol: R`$g'(t)=p^T\nabla f(z(t))$, $g''(t)=p^T\nabla^2f(z(t))p$, $p=y-x$. 스칼라($1\times1$)여야 합니다.` },
      { sec: '13.3', type: 'num', lv: 1, q: R`증명에 나오는 $\int_0^1(1-s)\,ds$의 값은?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`$[s-s^2/2]_0^1=\tfrac12$. 그래서 상수가 $\frac\beta2$입니다.` },
      { sec: '13.3', type: 'num', lv: 2, q: R`$\beta$-매끄러운 $f$에서 $f(x)=3$, $\nabla f(x)=(1,-2)$, $\beta=4$일 때 $y=x+(1,1)$에서 하강 보조정리가 주는 $f(y)$의 상한은?`, ans: '6', ansTex: R`6`,
        sol: R`$3+\langle(1,-2),(1,1)\rangle+\frac42\lVert(1,1)\rVert^2=3-1+2\cdot2=6$.` },
      { sec: '13.4', type: 'num', lv: 2, q: R`$\beta=10$, $\lVert\nabla f(x_t)\rVert^2=4$, $\eta=0.05$일 때 GD 한 걸음 후 감소량의 하한 $(\eta-\beta\eta^2/2)\lVert\nabla f\rVert^2$은?`, ans: '0.15', ansTex: R`0.15`,
        sol: R`$0.05-10(0.0025)/2=0.05-0.0125=0.0375$, $\times4=0.15$.` },
      { sec: '13.4', type: 'num', lv: 2, q: R`감소량 하한 $(\eta-\beta\eta^2/2)\lVert\nabla f\rVert^2$을 최대로 하는 $\eta$는 ($\beta=10$)?`, ans: '0.1', ansTex: R`1/\beta=0.1`,
        sol: R`$\frac d{d\eta}(\eta-\frac\beta2\eta^2)=1-\beta\eta=0$에서 $\eta=1/\beta$. 이때 감소량 $\frac1{2\beta}\lVert\nabla f\rVert^2$.` },
      { sec: '13.4', type: 'mc', lv: 2, q: R`$f(x)=\frac\beta2x^2$에 GD를 쓸 때 $\eta=2/\beta$이면?`,
        choices: [R`한 걸음에 최소점 도달`, R`$x_{t+1}=-x_t$로 진동, 수렴하지 않음`, R`발산`, R`$x_t$가 단조감소`], ans: 1,
        sol: R`$x_{t+1}=(1-\eta\beta)x_t=-x_t$. $\eta=1/\beta$이면 한 걸음에 0에 도달합니다.` },
      { sec: '13.4', type: 'num', lv: 3, q: R`$\beta=2$, $f(x_0)-f^*=10$일 때 $\eta=1/\beta$의 GD를 $T=100$번 돌리면 $\min_t\lVert\nabla f(x_t)\rVert^2$의 상한은?`, ans: '0.4', ansTex: R`0.4`,
        sol: R`$2\beta(f(x_0)-f^*)/T=2\cdot2\cdot10/100=0.4$.` },
      { sec: '13.6', type: 'mc', lv: 2, q: R`확률적 경사하강 보조정리를 유도할 때 $\E_t[\langle\nabla f(x_t),\tilde\nabla f(x_t)\rangle]=\lVert\nabla f(x_t)\rVert^2$이 되는 근거는?`,
        choices: [R`$\tilde\nabla f$가 결정적이라서`, R`$x_t$가 주어지면 $\nabla f(x_t)$는 상수이고 $\E_t\tilde\nabla f(x_t)=\nabla f(x_t)$ (불편성)`, R`$L$-매끄러움`, R`코시-슈바르츠`], ans: 1,
        sol: R`조건부 기댓값에서 상수를 밖으로 빼고 불편성을 씁니다.` },
      { sec: '13.6', type: 'mc', lv: 3, q: R`학습률 $\eta$를 고정한 SGD의 합산 부등식 $\frac1T\sum\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_0)-f^*}{\eta T}+\frac L2\eta G$가 말해 주는 것은?`,
        choices: [R`$T\to\infty$이면 평균 기울기 제곱이 0으로 간다`, R`$T\to\infty$여도 $\frac L2\eta G$라는 잡음 바닥이 남는다 — 학습률 감소가 필요`, R`$G$가 클수록 좋다`, R`$\eta$가 클수록 항상 좋다`], ans: 1,
        sol: R`두 번째 항은 $T$와 무관합니다. $\eta\propto1/\sqrt T$로 줄이면 두 항이 모두 $O(1/\sqrt T)$가 됩니다.` },
      { sec: '13.2', type: 'open', lv: 3, proof: true, q: R`$f\in C^2$일 때 $\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert$ ($\forall x,y$)이면 모든 $x,v$에 대해 $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$임을 증명하세요. (수업에서 “다음 시간”으로 미룬 ③)`,
        sol: R`
$x,v$를 고정하고 $s\ne0$에 대해 $\nabla f(x+sv)-\nabla f(x)$를 봅니다. $\nabla f$가 $C^1$이므로
$$\nabla^2f(x)v=\lim_{s\to0}\frac{\nabla f(x+sv)-\nabla f(x)}s.$$
립시츠 조건에서 $\Big\lVert\frac{\nabla f(x+sv)-\nabla f(x)}s\Big\rVert\le\frac{\beta\lVert sv\rVert}{\lvert s\rvert}=\beta\lVert v\rVert$. 노름은 연속이라 극한에서도 $\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert$.
코시-슈바르츠로 $v^T\nabla^2f(x)v\le\lVert v\rVert\,\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert^2$. (같은 방법으로 $\ge-\beta\lVert v\rVert^2$도 얻어 $-\beta I\preceq\nabla^2f\preceq\beta I$.)`,
        rubric: R`
- 헤시안-벡터 곱을 기울기의 차분 극한으로 표현 — 4점
- 립시츠 조건으로 노름 상한 — 3점
- 코시-슈바르츠로 이차형식 상한 — 3점` },
      { sec: '13.3', type: 'open', lv: 3, proof: true, q: R`하강 보조정리 $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$를 증명하세요. ($f\in C^2$, $\nabla^2f\preceq\beta I$ 가정 또는 $C^1$과 립시츠 조건만으로)`,
        sol: R`
**($C^2$ 증명, 필기)** $g(t)=f(x+t(y-x))$. 연쇄법칙으로 $g'(t)=\langle\nabla f(x+t(y-x)),y-x\rangle$, $g''(t)=(y-x)^T\nabla^2f(x+t(y-x))(y-x)$.
$g(1)=g(0)+\int_0^1g'(s)ds$에 부분적분($dv=ds$, $v=-(1-s)$)을 하면 $g(1)=g(0)+g'(0)+\int_0^1(1-s)g''(s)ds$.
$g''(s)\le\beta\lVert y-x\rVert^2$이고 $1-s\ge0$이므로 적분은 $\le\beta\lVert y-x\rVert^2\int_0^1(1-s)ds=\frac\beta2\lVert y-x\rVert^2$. $g(0)=f(x)$, $g(1)=f(y)$, $g'(0)=\langle\nabla f(x),y-x\rangle$를 넣으면 결과.

**($C^1$ 증명)** $f(y)-f(x)=\int_0^1\langle\nabla f(x+t(y-x)),y-x\rangle dt$에서 $\langle\nabla f(x),y-x\rangle$를 빼면
$$\int_0^1\langle\nabla f(x+t(y-x))-\nabla f(x),y-x\rangle dt\le\int_0^1\beta t\lVert y-x\rVert\cdot\lVert y-x\rVert dt=\frac\beta2\lVert y-x\rVert^2.$$`,
        rubric: R`
- 보조함수와 $g'$, $g''$ (또는 적분 표현) — 3점
- 적분형 테일러(부분적분) — 3점
- 곡률 상한과 $\int(1-s)=\frac12$ — 3점
- 결론 — 1점` },
      { sec: '13.6', type: 'open', lv: 3, proof: true, q: R`$f$가 $L$-매끄럽고 $x_{t+1}=x_t-\eta\tilde\nabla f(x_t)$, $\E_t[\tilde\nabla f(x_t)]=\nabla f(x_t)$일 때 확률적 경사하강 보조정리를 유도하고, $\E_t\lVert\tilde\nabla f\rVert^2\le G$이면 $\sum_{t=0}^{T-1}\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_0)-f^*}\eta+\frac L2\eta GT$임을 보이세요 ($f^*=\inf f$).`,
        sol: R`
하강 보조정리($y=x_{t+1}$, $x=x_t$): $f(x_{t+1})\le f(x_t)-\eta\langle\nabla f(x_t),\tilde\nabla f(x_t)\rangle+\frac L2\eta^2\lVert\tilde\nabla f(x_t)\rVert^2$.
$\E_t$를 취하면 $x_t$의 함수는 상수이고 $\E_t\langle\nabla f(x_t),\tilde\nabla f\rangle=\langle\nabla f(x_t),\E_t\tilde\nabla f\rangle=\lVert\nabla f(x_t)\rVert^2$:
$$\E_tf(x_{t+1})\le f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac L2\eta^2\E_t\lVert\tilde\nabla f\rVert^2\le f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac L2\eta^2G.$$
정리: $\lVert\nabla f(x_t)\rVert^2\le\frac1\eta\big(f(x_t)-\E_tf(x_{t+1})\big)+\frac L2\eta G$.
전체 기댓값을 취하고(탑 성질 $\E[\E_t[\cdot]]=\E[\cdot]$) $t=0..T-1$에 대해 더하면 망원급수:
$$\sum_t\E\lVert\nabla f(x_t)\rVert^2\le\frac1\eta\big(f(x_0)-\E f(x_T)\big)+\frac L2\eta GT\le\frac{f(x_0)-f^*}\eta+\frac L2\eta GT.$$`,
        rubric: R`
- 하강 보조정리 적용 — 2점
- 조건부 기댓값과 불편성 — 3점
- $G$ 상한과 재배열 — 2점
- 탑 성질과 망원급수 — 3점` },
    ],
  });
})();
