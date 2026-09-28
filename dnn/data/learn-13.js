/* 개념 정리 — 13 하강 보조정리와 경사하강법의 수렴 (4주차 수요일 슬라이드 1–10, 4주차 수요일(2) 필기, 5주차 월요일(1) 필기).
   5주차 월요일 필기의 두 가지(β-매끄러움 ⇒ 헤시안의 한계 증명, 가변 보폭 SGD의 O(1/√T) 수렴)를 더했습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 13,
    tagline: R`$\nabla f$가 $\beta$-립시츠이면 $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$. 여기에 $y=x-\eta\nabla f$를 넣으면 $\eta<2/\beta$일 때 반드시 내려갑니다.`,
    summary: R`경사하강법 $x_{t+1}=x_t-\eta\nabla f(x_t)$를 1차 테일러 근사로 정당화하고(기울기의 반대 방향이 가장 가파른 하강 방향), 이를 엄밀하게 만드는 **하강 보조정리**(Lemma 3.1)를 증명합니다. 4주차 수요일 필기에서는 보조함수 $g(t)=f(x+t(y-x))$, 연쇄법칙으로 $g''$ 구하기(①), 적분형 나머지를 가진 테일러 공식(②), 그리고 $\beta$-매끄러움에서 오는 헤시안의 상한(③)을 썼고, **5주차 월요일 필기**에서 ③ — $\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert\Rightarrow-\beta I\preceq\nabla^2f\preceq\beta I$ — 을 적분 표현으로 증명했습니다. 보조정리에 GD 한 걸음을 넣으면 감소 조건 $\eta<2/\beta$가 나오고, 확률적 기울기로 바꾸면 **확률적 경사하강 보조정리**가 됩니다. 5주차 필기는 여기에 탑 성질과 망원급수를 더해 가변 보폭 SGD가 $\min_t\E\lVert\nabla f(x_t)\rVert^2=O(1/\sqrt T)$로 수렴함을 보였습니다.`,
    goals: [
      R`1차 테일러 근사와 코시-슈바르츠 부등식으로 최급강하 방향이 $-\nabla f/\lVert\nabla f\rVert$임을 보일 수 있다`,
      R`$\beta$-매끄러움을 정의하고 $C^2$ 함수에서 $-\beta I\preceq\nabla^2f\preceq\beta I$와의 관계를 (5주차 필기의 적분 표현으로) 증명할 수 있다`,
      R`하강 보조정리를 $g(t)$, 연쇄법칙, 적분형 테일러 공식으로 증명할 수 있다`,
      R`GD 한 걸음의 감소 부등식과 수렴 조건 $\eta<2/\beta$를 유도할 수 있다`,
      R`확률적 경사하강 보조정리를 유도하고, 탑 성질과 망원급수로 $\min_t\E\lVert\nabla f\rVert^2\le\frac{f(x_0)-f^*+\frac{LG}2\sum\eta_t^2}{\sum\eta_t}$를 보일 수 있다`,
      R`고정 보폭에서 $\eta\propto1/\sqrt T$로 두어 $O(1/\sqrt T)$를 얻고, 이 분석이 딥러닝에 주는 의미와 한계를 말할 수 있다`,
    ],
    sections: [
      { k: '13.1', src: 'W4 수 · 슬라이드 2–4 필기, W5 월 · 슬라이드 2–4', title: '경사하강법과 테일러 직관', body: R`
:::idea 쉽게 말하면
눈을 가리고 언덕을 내려간다면, 발밑의 경사를 느껴 **가장 가파르게 내려가는 쪽**으로 한 걸음 옮길 것입니다. 수학적으로 “발밑의 경사”는 기울기 $\nabla f$이고, 가장 가파른 내리막은 그 정반대 방향입니다. 이 절은 그 직관을 1차 테일러 근사와 코시-슈바르츠 부등식으로 확인합니다.
:::

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

:::ex 예제 1 — 가장 가파른 방향
$f(x,y)=x^2+3y^2$, 점 $(1,1)$에서 가장 가파른 하강 방향(단위벡터)과, 그 방향으로 $0.1$만큼 갔을 때의 1차 근사 감소량은?
---
$\nabla f=(2x,6y)=(2,6)$, $\lVert\nabla f\rVert=\sqrt{40}\approx6.32$. 방향 $v=-(2,6)/\sqrt{40}\approx(-0.316,-0.949)$. 1차 근사 감소량 $\eta\lVert\nabla f\rVert=0.1\times6.32=0.632$. 실제 값: $f(1,1)=4$, $f(1-0.0316,\ 1-0.0949)\approx0.9377+2.4580=3.396$, 감소 $0.604$ — 1차 근사와 거의 같고, 차이는 곡률(이차 항) 때문입니다.
:::

:::note 오일러 방법과의 관계
GD는 기울기 흐름 $\dot x=-\nabla f(x)$를 보폭 $\eta$로 푼 오일러 방법입니다[[@em:ch01:1.2|오일러 방법 $y_{n+1}=y_n+hf(x_n,y_n)$.]].
:::
` },
      { k: '13.2', src: 'W4 수 · 슬라이드 5, W4 수(2) 필기 ③, W5 월(1) 필기', title: 'β-매끄러움', body: R`
:::idea 쉽게 말하면
“매끄럽다”는 것은 기울기가 **갑자기 바뀌지 않는다**는 뜻입니다. 거리 $\lVert x-y\rVert$만큼 움직이면 기울기는 최대 $\beta\lVert x-y\rVert$만큼만 바뀝니다. 한 변수라면 “이계도함수(곡률)의 절댓값이 $\beta$ 이하”와 같은 말이고, 곡률에 상한이 있으면 한 걸음을 얼마나 크게 디뎌도 안전한지 계산할 수 있습니다.
:::

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

기호 $A\preceq B$는 $B-A$가 양의 준정부호, 즉 모든 $v$에서 $v^TAv\le v^TBv$라는 뜻입니다. 따라서 $\nabla^2f(x)\preceq\beta I\iff v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ ($\forall v$).

### 5주차 필기: (⇒)의 증명

4주차에 “다음 시간”으로 미뤘던 ③을 5주차 월요일에 적분 표현으로 증명했습니다.

:::hand 수업 필기 — 적분 표현으로 헤시안의 한계 보이기
**(★) 기울기의 차를 적분으로.** $\phi(t):=\nabla f(x+t(y-x))$, $t\in[0,1]$로 두면 $\phi(0)=\nabla f(x)$, $\phi(1)=\nabla f(y)$이고 연쇄법칙으로
$$\phi'(t)=\nabla^2f(x+t(y-x))\,(y-x)\qquad(d\times d\ \text{행렬}\times d\times1).$$
미적분의 기본정리(성분별로)에서
$$\begin{aligned}\nabla f(y)-\nabla f(x)&=\phi(1)-\phi(0)=\int_0^1\phi'(t)\,dt\\&=\Big(\int_0^1\nabla^2f(x+t(y-x))\,dt\Big)(y-x).\end{aligned}$$

**내적 취하기.** 양변에 $(y-x)$와 내적을 취하면
$$\langle\nabla f(y)-\nabla f(x),\,y-x\rangle=(y-x)^T\Big(\int_0^1\nabla^2f(x+t(y-x))\,dt\Big)(y-x).$$
좌변은 코시-슈바르츠와 립시츠 조건으로 $\le\lVert\nabla f(y)-\nabla f(x)\rVert\,\lVert y-x\rVert\le\beta\lVert y-x\rVert^2$.

**$y=x+hv$로 두기.** 임의의 $v\in\mathbb R^d$와 작은 $h>0$에 대해 $y-x=hv$이므로
$$h^2\,v^T\Big(\int_0^1\nabla^2f(x+thv)\,dt\Big)v\le\beta h^2\lVert v\rVert^2.$$
$h^2$으로 나누면 $v^T\big(\int_0^1\nabla^2f(x+thv)dt\big)v\le\beta\lVert v\rVert^2$.

**$h\to0$.** $f\in C^2$라 $\nabla^2f$가 연속이므로 $\int_0^1\nabla^2f(x+thv)dt\to\nabla^2f(x)$. 따라서 $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$, 즉 $\nabla^2f(x)\preceq\beta I$.

**마찬가지로(D.I.Y.)** 코시-슈바르츠의 다른 쪽 $\langle\nabla f(y)-\nabla f(x),y-x\rangle\ge-\lVert\nabla f(y)-\nabla f(x)\rVert\lVert y-x\rVert\ge-\beta\lVert y-x\rVert^2$에서 $-\beta I\preceq\nabla^2f(x)$.
:::

**극한의 근거를 조금 더.** $\big\lvert v^T\big(\int_0^1\nabla^2f(x+thv)dt-\nabla^2f(x)\big)v\big\rvert\le\lVert v\rVert^2\sup_{t\in[0,1]}\lVert\nabla^2f(x+thv)-\nabla^2f(x)\rVert$이고, 연속성 때문에 $h\to0$이면 오른쪽이 0으로 갑니다.

**(⇐)의 증명.** 같은 표현 (★)에서 $\lVert\nabla f(y)-\nabla f(x)\rVert\le\int_0^1\lVert\nabla^2f(x+t(y-x))\rVert_2\,dt\,\lVert y-x\rVert$. 대칭행렬이 $-\beta I\preceq H\preceq\beta I$이면 모든 고윳값이 $[-\beta,\beta]$에 있어 $\lVert H\rVert_2=\max\lvert\lambda_i\rvert\le\beta$. 따라서 $\lVert\nabla f(y)-\nabla f(x)\rVert\le\beta\lVert y-x\rVert$.

4주차 필기의 다른 증명(헤시안-벡터 곱을 기울기의 차분 극한으로 쓰기)도 증명 페이지에 있습니다: $\nabla^2f(x)v=\lim_{s\to0}\frac{\nabla f(x+sv)-\nabla f(x)}s$이고 분자의 노름이 $\beta s\lVert v\rVert$ 이하이므로 $\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert$, 코시-슈바르츠로 $\lvert v^T\nabla^2f(x)v\rvert\le\beta\lVert v\rVert^2$.

:::ex 예제 2 — 이차함수
$f(x)=\frac12x^TAx$ ($A$ 대칭)의 매끄러움 상수는?
---
$\nabla f=Ax$이므로 $\lVert\nabla f(x)-\nabla f(y)\rVert=\lVert A(x-y)\rVert\le\lVert A\rVert_2\lVert x-y\rVert$. 최소 상수는 $\beta=\lVert A\rVert_2=\max_i\lvert\lambda_i(A)\rvert$ (가장 큰 고윳값의 절댓값)[[@em:ch07:8.3|대칭행렬은 실수 고윳값과 직교 고유벡터를 가집니다.]]. 예: $A=\diag(1,10)$이면 $\beta=10$.
:::

:::ex 예제 3 — 매끄럽지 않은 함수들
$f(x)=\lvert x\rvert$와 $f(x)=x^4$ ($x\in\mathbb R$)는 $\beta$-매끄러운가?
---
$\lvert x\rvert$: 0에서 미분 불가능(기울기가 $-1$에서 $+1$로 점프)이라 아닙니다. $x^4$: $f''=12x^2$가 유계가 아니므로 $\mathbb R$ 전체에서는 어떤 $\beta$로도 매끄럽지 않지만, $\lvert x\rvert\le R$로 제한하면 $\beta=12R^2$. 딥러닝의 손실이 “전역적으로 매끄럽지 않은” 전형적인 이유(ReLU의 꺾임, 가중치가 커질수록 커지는 곡률)가 이 두 예에 들어 있습니다.
:::
` },
      { k: '13.3', src: 'W4 수 · 슬라이드 5, W4 수(2) 필기, W5 월 · 슬라이드 5', title: '하강 보조정리와 증명', body: R`
:::idea 쉽게 말하면
곡률이 최대 $\beta$라는 것을 알면, 지금 위치에서 “접선 + $\frac\beta2(\text{거리})^2$” 모양의 포물선을 그렸을 때 함수가 **그 포물선 아래**에 있다는 것이 보장됩니다. 포물선은 손으로 최소화할 수 있으니, 포물선이 내려가는 만큼 함수도 적어도 그만큼 내려갑니다.
:::

:::key 하강 보조정리 (Lemma 3.1)
$f:\mathbb R^d\to\mathbb R$이 연속 미분가능하고 $\nabla f$가 $\beta$-립시츠이면
$$f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2\qquad\forall x,y.$$
:::

$f$는 각 점에서 만든 **이차 상한** 아래에 있습니다(아래 그림)[[@ml:ch09:12.1c|같은 부등식을 적분으로 증명하고, 음이 아닌 함수의 자기 유계성 ‖∇f‖² ≤ 2βf를 끌어냅니다.]]. 1차 근사의 오차가 $\frac\beta2\lVert y-x\rVert^2$을 넘지 않는다는 뜻입니다.

:::fig quadub
:::

:::hand 수업 필기 — 증명 (f ∈ C²로 가정)
보조함수 $g(t)=f(x+t(y-x))$, $t\in\mathbb R$를 정의합니다.

**① 연쇄법칙.**
$$g'(t)=\langle\nabla f(x+t(y-x)),\,y-x\rangle,$$
$$g''(t)=(y-x)^T\nabla^2f(x+t(y-x))(y-x).$$

**② 적분형 나머지를 가진 테일러 공식.**
$$g(1)=g(0)+g'(0)+\int_0^1(1-s)g''(s)\,ds.$$
$g(0)=f(x)$, $g(1)=f(x+y-x)=f(y)$, $g'(0)=\langle\nabla f(x),y-x\rangle$이므로
$$\begin{aligned}f(y)=f(x)&+\langle\nabla f(x),y-x\rangle\\&+\int_0^1(1-s)(y-x)^T\nabla^2f(x+s(y-x))(y-x)\,ds.\qquad(*)\end{aligned}$$

**③ β-매끄러움.** 모든 $v$에 대해 $v^T\nabla^2fv\le\beta\lVert v\rVert^2$이므로
$$\begin{aligned}&\int_0^1(1-s)(y-x)^T\nabla^2f(\cdot)(y-x)\,ds\\&\qquad\le\int_0^1(1-s)\beta\lVert y-x\rVert^2ds=\beta\lVert y-x\rVert^2\int_0^1(1-s)\,ds=\frac\beta2\lVert y-x\rVert^2.\end{aligned}$$
$(*)$에 넣으면 $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$. ∎
:::

**① 의 근거(필기).** $p=y-x\in\mathbb R^{n\times1}$ (열벡터), $z(t)=x+tp$, $z'(t)=p$. $g(t)=f(z(t))$이므로 $g'(t)=Df(z(t))\,z'(t)$이고 $Df(z)=\nabla f(z)^T\in\mathbb R^{1\times n}$ (행벡터). 따라서 $g'(t)=\nabla f(z(t))^Tp=p^T\nabla f(z(t))$ ($1\times n$ 곱하기 $n\times1$). 다시 미분하면 $\nabla f:\mathbb R^n\to\mathbb R^n$의 도함수가 헤시안 $D(\nabla f(z))=\nabla^2f(z)$ ($n\times n$)이므로 $\frac d{dt}\nabla f(z(t))=\nabla^2f(z(t))z'(t)$, 곧 $g''(t)=p^T\nabla^2f(z(t))p$ — $1\times1$ 스칼라입니다.

**② 의 근거(필기 D.I.Y.).** 미적분학의 기본정리로 $g(1)=g(0)+\int_0^1g'(s)ds$. 부분적분에서 $u=g'(s)$, $dv=ds$로 두되 $v=-(1-s)$를 고르면
$$\int_0^1g'(s)ds=\big[-(1-s)g'(s)\big]_0^1+\int_0^1(1-s)g''(s)ds=g'(0)+\int_0^1(1-s)g''(s)ds.$$
(필기의 “$u=1-s$, $v'=g''(s)$”로 두어도 같은 식이 나옵니다.)[[@base:ch02:2.2|부분적분.]]

**③ 에서 $1-s\ge0$이 중요한 이유.** 부등식 $g''(s)\le\beta\lVert y-x\rVert^2$의 양변에 **음이 아닌** $1-s$를 곱해야 부등호 방향이 유지되고, 그다음 적분해도 유지됩니다.

:::tip 헤시안 없이 증명하기
$f\in C^1$만 가정해도 됩니다: $f(y)-f(x)-\langle\nabla f(x),y-x\rangle=\int_0^1\langle\nabla f(x+t(y-x))-\nabla f(x),\,y-x\rangle dt\le\int_0^1\beta t\lVert y-x\rVert^2dt=\frac\beta2\lVert y-x\rVert^2$ (코시-슈바르츠와 립시츠 조건). 슬라이드의 정리는 이 가정($C^1$)으로 적혀 있습니다.
:::

:::ex 예제 4 — 상한 계산
$\beta=4$, $f(x)=3$, $\nabla f(x)=(1,-2)$일 때 $y=x+(1,1)$에서 $f(y)$의 상한과, $y=x-\frac14\nabla f(x)$에서의 상한은?
---
$y-x=(1,1)$: $3+(1-2)+\frac42\cdot2=6$. $y-x=-\frac14(1,-2)$: $3-\frac14\lVert\nabla f\rVert^2+\frac42\cdot\frac1{16}\lVert\nabla f\rVert^2=3-\frac54+\frac58=2.375$. 기울기 반대 방향으로 $\frac1\beta$만큼 가면 상한이 $f(x)-\frac1{2\beta}\lVert\nabla f\rVert^2=3-\frac58$로 내려갑니다.
:::
` },
      { k: '13.4', src: 'W4 수 · 슬라이드 6 필기, W5 월 · 슬라이드 6', title: '경사하강법 한 걸음의 감소량', body: R`
:::idea 쉽게 말하면
하강 보조정리의 포물선에 “실제로 가는 걸음” $-\eta\nabla f$를 넣어 보면, 한 걸음에 적어도 $(\eta-\frac\beta2\eta^2)\lVert\nabla f\rVert^2$만큼 내려간다는 보장이 나옵니다. 괄호가 양수이려면 $\eta<2/\beta$. 걸음이 곡률에 비해 너무 크지만 않으면 **반드시** 내려갑니다.
:::

하강 보조정리에 GD 한 걸음 $y=x_{t+1}=x_t-\eta\nabla f(x_t)$, $x=x_t$를 넣습니다.
$$\begin{aligned}f(x_{t+1})&\le f(x_t)+\langle\nabla f(x_t),x_{t+1}-x_t\rangle+\frac\beta2\lVert x_{t+1}-x_t\rVert^2\\&=f(x_t)+\langle\nabla f(x_t),-\eta\nabla f(x_t)\rangle+\frac\beta2\lVert-\eta\nabla f(x_t)\rVert^2\\&=f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac{\beta\eta^2}2\lVert\nabla f(x_t)\rVert^2.\end{aligned}$$

:::key 경사하강법의 감소 조건
$$f(x_{t+1})\le f(x_t)-\Big(\eta-\frac{\beta\eta^2}2\Big)\lVert\nabla f(x_t)\rVert^2$$
$\eta-\frac{\beta\eta^2}2>0\iff0<\eta<\frac2\beta$이면 $f(x_{t+1})\le f(x_t)$ (기울기가 0이 아니면 순감소). 감소량은 $\eta=\frac1\beta$에서 최대 $\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2$.
:::

즉 **보폭이 충분히 작으면 GD는 매끄러운 함수의 값을 반드시 줄입니다.**

**수렴 속도(보충).** $\eta=1/\beta$로 두고 $t=0,\dots,T-1$에 대해 더하면 망원급수가 되어
$$\frac1{2\beta}\sum_{t=0}^{T-1}\lVert\nabla f(x_t)\rVert^2\le f(x_0)-f(x_T)\le f(x_0)-f^*,$$
$$\min_{0\le t<T}\lVert\nabla f(x_t)\rVert^2\le\frac{2\beta\big(f(x_0)-f^*\big)}T.$$
볼록성 없이도 기울기가 $O(1/\sqrt T)$ 속도로 0에 다가갑니다(정류점으로 수렴; 전역 최소라는 보장은 없음).

**망원급수의 뜻.** $\sum_{t=0}^{T-1}\big(f(x_t)-f(x_{t+1})\big)=f(x_0)-f(x_1)+f(x_1)-f(x_2)+\cdots=f(x_0)-f(x_T)$ — 가운데 항이 모두 지워집니다. 그리고 $f^*=\inf f$이면 $f(x_T)\ge f^*$.

:::ex 예제 5 — 이차함수에서의 한계
$f(x)=\frac\beta2x^2$ ($x\in\mathbb R$)에 GD를 쓰면 $x_{t+1}=(1-\eta\beta)x_t$. 언제 수렴하나?
---
$\lvert1-\eta\beta\rvert<1\iff0<\eta<2/\beta$. $\eta=2/\beta$이면 $x_{t+1}=-x_t$로 제자리에서 진동, 그보다 크면 발산합니다. 보조정리의 조건 $\eta<2/\beta$가 이 경우 **정확히** 최선입니다.
:::

### 볼록이면 더 강한 결론 (5주차 필기의 언급)

5주차 필기는 “$f(x_{t+1})-f(x^*)$, $x_{t+1}\to x^*$는 **볼록 최적화**의 주제”라며 Bubeck의 교재(Convex Optimization: Algorithms and Complexity)를 소개했습니다. 요지만 적으면: $f$가 볼록이고 $\beta$-매끄러우면 $\eta=1/\beta$의 GD가
$$f(x_T)-f(x^*)\le\frac{\beta\lVert x_0-x^*\rVert^2}{2T},$$
즉 함수값 자체가 $O(1/T)$로 최솟값에 다가가고, 강볼록($\nabla^2f\succeq\mu I$)이면 $\big(1-\frac\mu\beta\big)^T$처럼 **기하급수적으로** 수렴합니다. 여기서 $\beta/\mu$가 조건수이고, 조건수가 크면 느려진다는 것이 14단원 모멘텀·Adam의 출발점입니다[[ch14:14.1|조건수가 큰 이차함수에서 GD는 좁은 방향으로 진동하고 넓은 방향으로 느리게 갑니다.]].
` },
      { k: '13.5', src: 'W4 수 · 슬라이드 7, W5 월 · 슬라이드 7', title: '딥러닝에서의 의미', body: R`
:::idea 쉽게 말하면
이 증명들은 “곡률이 어디서나 $\beta$ 이하”라는 가정에 기대는데, 실제 신경망의 손실은 그 가정을 만족하지 않습니다. 그래도 이런 분석은 “곡률이 크면 학습률을 줄여야 한다”, “잡음이 크면 학습률을 줄여야 한다” 같은 **감각**을 줍니다. 이론은 보장서가 아니라 나침반입니다.
:::

딥러닝의 손실에서는 “$\nabla f$가 $L$-립시츠”라는 조건이 **보통 성립하지 않습니다**(예: ReLU는 미분 불가능한 점이 있고, 가중치가 커지면 곡률도 커짐). 이런 수학적 분석의 목적은 **정성적 통찰**을 얻는 것이며, 이 수렴 증명은 GD와 SGD의 학습 동역학에 대한 직관을 주기 위한 것입니다.

딥러닝 시스템을 있는 그대로 엄밀히 분석하기 어렵기 때문에 보통
- 단순화된 설정을 **엄밀하게** 분석하거나,
- 전체 설정을 **발견적으로** 분석합니다.

어느 쪽이든 목표는 이론적 보장보다 정성적 통찰입니다. 예를 들어 “곡률($\beta$)이 크면 학습률을 작게 해야 한다”, “BN이 손실 곡면을 매끄럽게 하면 더 큰 학습률을 쓸 수 있다”[[ch12:12.5|BN의 대안 설명: 매끄러운 손실 곡면.]] 같은 결론입니다.

### 더 깊이: 안정성의 가장자리

최근 연구는 GD로 신경망을 학습하면 헤시안의 가장 큰 고윳값(국소 $\beta$)이 학습 중 **스스로 $2/\eta$ 근처까지 올라가 머무는** 현상(안정성의 가장자리)을 관찰했습니다. 13.4절의 조건 $\eta<2/\beta$가 “지켜지는” 것이 아니라 경계에서 줄타기를 하며 손실이 단조롭지 않게 내려갑니다. 단순화된 이론이 틀린 것이 아니라, 이론이 가리키는 경계가 실제 학습에서 중요한 역할을 한다는 예입니다.
` },
      { k: '13.6', src: 'W4 수 · 슬라이드 8–10, W5 월(1) · 슬라이드 8–11 필기', title: '확률적 경사하강 보조정리', body: R`
:::idea 쉽게 말하면
SGD는 정확한 기울기 대신 “평균적으로 맞는” 잡음 섞인 기울기로 걷습니다. 그래서 한 걸음의 감소 보장에 **잡음 항** $\frac L2\eta^2\E\lVert\tilde\nabla f\rVert^2$이 더해집니다. 걸음을 줄이면 잡음 항은 $\eta^2$으로 빨리 줄고 진전은 $\eta$로 천천히 줄어서, 적당히 작은 학습률에서는 평균적으로 내려갑니다. 많이 걸을수록($T$가 클수록) 학습률을 $1/\sqrt T$로 줄이면 기울기가 0으로 수렴합니다.
:::

SGD는 $x_{t+1}=x_t-\eta\tilde\nabla f(x_t)$, $\tilde\nabla f(x_t)$는 불편추정량 $\E_t[\tilde\nabla f(x_t)]=\nabla f(x_t)$입니다. 표기: $\E_t[\cdot]=\E[\cdot\mid x_t]$.

$L$-매끄러운 $f$의 이차 상한 $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac L2\lVert x-y\rVert_2^2$에 앞에서와 똑같이 $y=x_{t+1}$, $x=x_t$를 넣으면
$$f(x_{t+1})\le f(x_t)-\eta\langle\nabla f(x_t),\tilde\nabla f(x_t)\rangle+\frac L2\eta^2\lVert\tilde\nabla f(x_t)\rVert_2^2.$$
조건부 기댓값을 취하고 불편성을 쓰면 다음을 얻습니다.

:::key 확률적 경사하강 보조정리
$f$가 $L$-매끄럽고 $\eta>0$이 임의의 보폭이면 SGD의 연속한 두 반복점은
$$\E_t[f(x_{t+1})]\le f(x_t)-\eta\lVert\nabla f(x_t)\rVert_2^2+\frac L2\eta^2\,\E_t\big[\lVert\tilde\nabla f(x_t)\rVert_2^2\big].$$
$\E_t[\lVert\tilde\nabla f(x_t)\rVert^2]\le G$ ($\forall t$)이면
$$\lVert\nabla f(x_t)\rVert_2^2\le\frac1\eta\E_t\big[f(x_t)-f(x_{t+1})\big]+\frac L2\eta G,$$
$$\sum_{t=0}^{T-1}\lVert\nabla f(x_t)\rVert_2^2\le\frac1\eta\Big(\sum_{t=0}^{T-1}\E_t\big[f(x_t)-f(x_{t+1})\big]\Big)+\frac L2\eta GT.$$
:::

- 슬라이드는 $\E_t\lVert\tilde\nabla f\rVert^2$을 “확률적 기울기의 분산”이라 부르지만, 정확히는 **2차 모멘트**입니다: $\E_t\lVert\tilde\nabla f\rVert^2=\lVert\nabla f\rVert^2+\E_t\lVert\tilde\nabla f-\nabla f\rVert^2$ (편향² + 분산). 대입하면 $\E_tf(x_{t+1})\le f(x_t)-\eta(1-\frac{L\eta}2)\lVert\nabla f\rVert^2+\frac{L\eta^2}2\Var_t$로, 분산이 0이면 13.4절의 GD 부등식으로 돌아옵니다.
- 정확한 GD와 마찬가지로 $\eta$가 충분히 작으면 **기댓값으로** 감소가 보장되고, 그 문턱값은 추정량의 분산에 **반비례**합니다. 미니배치를 키우면 분산이 $\frac1B$로 줄어[[ch10:10.2|i.i.d. 미니배치 기울기의 분산은 $\Sigma/B$.]] 더 큰 학습률을 쓸 수 있습니다.
- 합산 부등식을 $T$로 나누면 평균 기울기 제곱이 $\frac{f(x_0)-f^*}{\eta T}+\frac L2\eta G$ 이하입니다. $\eta$가 고정이면 두 번째 항 때문에 0으로 가지 않고 **잡음 바닥**에 머뭅니다. $\eta\propto1/\sqrt T$로 두면 $O(1/\sqrt T)$로 줄어듭니다 — 학습률 감소 스케줄이 필요한 이론적 이유입니다.

### 5주차 필기: 가변 보폭 SGD의 수렴 증명

5주차 월요일에는 유한합 문제에서 보폭 $\eta_t$가 바뀌는 경우를 처음부터 끝까지 증명했습니다.

:::hand 수업 필기 — 설정과 세 가정
$\min_{x\in\mathbb R^d}f(x)$, $f(x)=\frac1n\sum_{i=1}^nf_i(x)$. SGD는 $x_{t+1}=x_t-\eta_tg_t$, $g_t:=\nabla f_{i_t}(x_t)$, $i_t\sim\mathrm{Unif}\{1,\dots,n\}$.
① $L$-매끄러움: $f(x)\le f(y)+\langle\nabla f(y),x-y\rangle+\frac L2\lVert x-y\rVert^2$
② 불편성: $\E[g_t\mid x_t]=\nabla f(x_t)$
③ 2차 모멘트의 균등 상한: $\E[\lVert g_t\rVert^2\mid x_t]\le G$ (이차 항을 누르는 상한)
:::

:::hand 수업 필기 — 한 걸음 (식 4)
①에 $y=x_t$, $x=x_{t+1}=x_t-\eta_tg_t$를 넣으면
$$\begin{aligned}f(x_{t+1})&\le f(x_t)+\langle\nabla f(x_t),-\eta_tg_t\rangle+\frac L2\lVert\eta_tg_t\rVert^2\\&=f(x_t)-\eta_t\langle\nabla f(x_t),g_t\rangle+\frac{L\eta_t^2}2\lVert g_t\rVert^2.\end{aligned}$$
$\E_t=\E[\cdot\mid x_t]$를 취하면 ②로 $\E_t\langle\nabla f(x_t),g_t\rangle=\lVert\nabla f(x_t)\rVert^2$이므로
$$\E_t[f(x_{t+1})]\le f(x_t)-\eta_t\lVert\nabla f(x_t)\rVert^2+\frac{L\eta_t^2}2\E_t\big[\lVert g_t\rVert^2\big].\qquad(4)$$
:::

:::hand 수업 필기 — 탑 성질과 망원급수 (식 5, 6)
③을 (4)에 쓰고 전체 기댓값을 취합니다. **탑 성질**: $\E_t[\cdot]=\E[\cdot\mid x_t]$이면 $\E\big[\E_t[Z]\big]=\E[Z]$. 따라서
$$\E[f(x_{t+1})]\le\E[f(x_t)]-\eta_t\E\lVert\nabla f(x_t)\rVert^2+\frac{L\eta_t^2}2G,$$
정리하면 $\eta_t\E\lVert\nabla f(x_t)\rVert^2\le\E[f(x_t)]-\E[f(x_{t+1})]+\frac L2\eta_t^2G$. $t=1,\dots,T$에 대해 더하면 오른쪽이 망원급수가 되어
$$\begin{aligned}\sum_{t=1}^T\eta_t\E\lVert\nabla f(x_t)\rVert^2&\le f(x_1)-\E[f(x_{T+1})]+\frac L2G\sum_{t=1}^T\eta_t^2\\&\le f(x_1)-f_*+\frac L2G\sum_{t=1}^T\eta_t^2.\qquad(6)\end{aligned}$$
($f_*$는 최솟값, $\E f(x_{T+1})\ge f_*$.)
:::

:::key 가변 보폭 SGD의 수렴
위 세 가정 아래
$$\min_{1\le t\le T}\E\lVert\nabla f(x_t)\rVert^2\ \le\ \frac{f(x_1)-f_*}{\sum_{t=1}^T\eta_t}+\frac{LG}2\cdot\frac{\sum_{t=1}^T\eta_t^2}{\sum_{t=1}^T\eta_t}.$$
$\eta_t=\eta$ (고정)이면 $\le\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$이고, $\eta=c/\sqrt T$로 두면 $O(1/\sqrt T)$.
:::

**(6)에서 결론으로.** 가중평균은 최솟값 이상이므로 $\sum_t\eta_t\E\lVert\nabla f(x_t)\rVert^2\ge\big(\min_t\E\lVert\nabla f(x_t)\rVert^2\big)\sum_t\eta_t$ (필기: “Note that”). (6)의 양변을 $\sum\eta_t>0$으로 나누면 위의 식. 고정 보폭이면 $\sum\eta_t=T\eta$, $\sum\eta_t^2=T\eta^2$이라 $\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$ — 필기의 “$\lesssim\frac1{\eta T}+\eta$”. 두 항의 크기를 맞추면 $\eta\sim1/\sqrt T$이고 결과가 $\lesssim\frac1{\sqrt T}$입니다.

**슬라이드 10–11의 버전.** 같은 내용을 $t=0,\dots,T-1$, 고정 $\eta$로 쓰면 $\frac1T\sum_{t=0}^{T-1}\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_0)-f_*}{\eta T}+\frac L2\eta G$이고, $\eta\approx\frac1{\sqrt T}$로 고르면 $T$번 안에 적어도 한 번 $\E\lVert\nabla f(x_t)\rVert^2\approx\frac1{\sqrt T}$ — 추정량의 (유계인) 분산과 **상관없이** 기울기 노름이 수렴합니다.

:::fig sgdbound
:::

:::ex 예제 6 — 수치로 보장 계산
$f(x_1)-f_*=10$, $L=1$, $G=4$, $T=10000$일 때 고정 보폭 $\eta=0.01$과 $\eta=0.1$의 보장, 그리고 최적의 고정 보폭은?
---
보장 $=\frac{10}{\eta\cdot10^4}+2\eta$. $\eta=0.01$: $0.1+0.02=0.12$. $\eta=0.1$: $0.01+0.2=0.21$. 최적은 $\eta^*=\sqrt{\frac{10}{2\cdot10^4}}\approx0.0224$, 보장 $2\sqrt{\frac{10\cdot2}{10^4}}\approx0.089$. $T$를 100배 늘리면 보장은 10배($\sqrt{100}$) 줄어듭니다.
:::

:::warn 무엇이 수렴하는가
이 결과는 **기울기 노름**이 작아지는 반복점이 있다는 것(정류점 근처)이지, 전역 최소에 간다는 것이 아닙니다. 또 “마지막 반복점”이 아니라 “$T$개 중 가장 좋은 것”(또는 무작위로 고른 하나)에 대한 보장입니다. 볼록이면 함수값 자체의 수렴을 보일 수 있습니다(13.4절 끝).
:::
` },
    ],
  });
})();
