/* 07 선형 예측기 — UML 9장, 강의 노트 “A Least-Squares ERM Solution Using the Moore–Penrose Pseudoinverse” (9.2.1), Exercise 9.3·9.4 (퍼셉트론 상한의 등호) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 7, part: 'B', title: '선형 예측기: 반공간, 퍼셉트론, 최소제곱', en: 'Linear Predictors', ref: 'UML 9장', plot: 'halfspace',
    fig: R`두 점구름(채운 점과 빈 원)과, 퍼셉트론의 갱신마다 조금씩 돌아 분리 직선에 닿는 경계들`,
    tagline: R`선형 예측기는 가장 단순하면서 가장 많이 쓰이는 가설 클래스입니다. 분류·회귀·확률 예측이 모두 ⟨w, x⟩ 위에서 이루어집니다.`,
    summary: R`가설 클래스를 **아핀 함수** $x\mapsto\langle w,x\rangle+b$로 정하고, 그 위에 부호(분류), 항등(회귀), 시그모이드(확률)를 얹습니다. 실현가능한 **반공간** 분류의 ERM은 선형계획법으로 풀리고, **퍼셉트론**은 분리 가능한 자료에서 많아야 $(RB)^2$번 갱신한 뒤 멈춥니다 — 강의 노트는 이 상한에 등호가 성립하는 예를 두 가지로 만들었습니다. $\mathbb R^d$의 동차 반공간의 VC 차원은 $d$, 비동차는 $d+1$입니다. **최소제곱** 회귀의 ERM은 정규방정식 $Aw=b$이고, $A$가 특이해도 해가 항상 있으며 **무어–펜로즈 유사역행렬** $A^+b$가 그중 노름이 가장 작은 해입니다. **로지스틱 회귀**의 ERM은 최대가능도와 같고 볼록 문제입니다.`,
    goals: [
      R`비동차 반공간을 동차 반공간으로 바꾸고, 실현가능한 ERM을 선형계획법으로 쓸 수 있다`,
      R`퍼셉트론 수렴 정리 “갱신 횟수 $\le(RB)^2$”를 내적과 노름의 두 부등식으로 증명할 수 있다`,
      R`동차 반공간의 VC 차원이 $d$임을 일차종속 논법으로 증명할 수 있다`,
      R`최소제곱 ERM의 정규방정식이 항상 해를 가지며 $A^+b$가 최소 노름 해임을 증명할 수 있다`,
      R`로지스틱 손실이 음의 로그가능도이고 볼록임을 보일 수 있다`,
    ],
    secTitles: { '9.1': '반공간', '9.1b': '퍼셉트론', '9.1c': 'VC 차원', '9.2': '최소제곱', '9.2b': '다항 회귀', '9.3': '로지스틱 회귀' },
    sections: [
      { k: '9.1', p: 118, title: '반공간과 선형계획법', body: R`
:::def 아핀 함수와 반공간
$L_d=\{h_{w,b}(x)=\langle w,x\rangle+b:w\in\mathbb R^d,b\in\mathbb R\}$. 이진 분류의 **반공간** 클래스는
$$HS_d=\{x\mapsto\sign(\langle w,x\rangle+b)\}.$$
$b=0$이면 **동차**(homogeneous) 반공간이라 합니다.
:::

**동차로 바꾸기.** $w'=(b,w_1,\dots,w_d)$, $x'=(1,x_1,\dots,x_d)$로 두면 $\langle w,x\rangle+b=\langle w',x'\rangle$. 그래서 $\mathbb R^d$의 비동차 반공간은 $\mathbb R^{d+1}$의 동차 반공간과 같고, 대부분의 분석을 $b=0$으로 해도 됩니다.

**실현가능한 ERM = 선형계획법.** 분리하는 $w$를 찾는 것은 $y_i\langle w,x_i\rangle>0$ ($\forall i$)을 푸는 것입니다. 분리하는 $w^\ast$가 있으면 $\gamma=\min_iy_i\langle w^\ast,x_i\rangle>0$이고 $\bar w=w^\ast/\gamma$는 $y_i\langle\bar w,x_i\rangle\ge1$을 만족합니다. 그러므로
$$\text{찾기: }w\in\mathbb R^d\quad\text{조건: }y_i\langle w,x_i\rangle\ge1\ (i=1,\dots,m)$$
이라는 **선형 제약**의 실현가능성 문제(목적함수 0인 선형계획법)로 ERM을 다항 시간에 풉니다.

:::tip 엄격한 부등식을 ≥ 1로
LP는 $>0$ 같은 열린 제약을 다룰 수 없습니다. 척도 불변성($w$를 양수배해도 부호가 같음)으로 여유 1을 만든 것이 핵심입니다. SVM(15장)도 같은 정규화를 씁니다.
:::
` },
      { k: '9.1b', p: 120, src: '강의 노트 · Exercise 9.3, 9.4', title: '퍼셉트론', body: R`
:::def 퍼셉트론 (로젠블랫)
$w^{(1)}=0$에서 시작. $t=1,2,\dots$: $y_i\langle w^{(t)},x_i\rangle\le0$인 $i$가 있으면 $w^{(t+1)}=w^{(t)}+y_ix_i$, 없으면 $w^{(t)}$를 출력.
:::

틀린 점 $x_i$ 쪽으로 $w$를 당기는 것입니다: $y_i\langle w^{(t+1)},x_i\rangle=y_i\langle w^{(t)},x_i\rangle+\lVert x_i\rVert^2$로 그 점의 여유가 늘어납니다.

:::key 퍼셉트론 수렴 정리
자료가 분리 가능하다고 하고 $B=\min\{\lVert w\rVert:\forall i,\ y_i\langle w,x_i\rangle\ge1\}$, $R=\max_i\lVert x_i\rVert$라 하자. 퍼셉트론은 많아야 $(RB)^2$번 갱신한 뒤 멈추고, 그때 모든 $i$에서 $y_i\langle w,x_i\rangle>0$이다.
:::

증명의 두 줄: $w^\ast$를 $B$를 이루는 벡터라 하면 갱신마다 **(1)** $\langle w^\ast,w\rangle$은 $y_i\langle w^\ast,x_i\rangle\ge1$ 이상 늘고, **(2)** $\lVert w\rVert^2$은 $2y_i\langle w,x_i\rangle+\lVert x_i\rVert^2\le R^2$ 이하 늡니다. $T$번 뒤 코시–슈바르츠로 $T\le\langle w^\ast,w\rangle\le B\sqrt TR$.

:::hand 강의 노트 — 상한에 등호가 성립하는 예
**Exercise 9.3.** $d=m$, $x_i=e_i$(표준기저), $y_i=1$로 두면 $R=1$, $w^\ast=(1,\dots,1)$에서 $B=\sqrt m$(모든 좌표가 $\ge1$이어야 하므로 $\lVert w\rVert\ge\sqrt m$). 순서대로 돌리면 $i$번째 예제 직전의 $w=e_1+\dots+e_{i-1}$이 $e_i$와 직교해 여유 0 — 매번 갱신합니다. 정확히 $m=(RB)^2$번.

**Exercise 9.4 ($\mathbb R^3$에서).** $r_i=i(m-i)$로 두고 평면 벡터 $s_0=s_m=0$, $\lVert s_i\rVert=\sqrt{r_i}$, $\lVert s_i-s_{i-1}\rVert=\sqrt{m-1}$을 두 원의 교점으로 차례로 잡습니다. $u_i=s_i-s_{i-1}$, $x_i=(u_i,1)\in\mathbb R^3$, $y_i=1$. 그러면 $\lVert x_i\rVert^2=m$, $\sum u_i=0$이라 $B=1$ ($w=(0,0,1)$), $(RB)^2=m$. $2\langle s_{i-1},u_i\rangle=\lVert s_i\rVert^2-\lVert s_{i-1}\rVert^2-\lVert u_i\rVert^2=-2(i-1)$이라 $i$번째 여유가 $\langle s_{i-1},u_i\rangle+(i-1)=0$ — 역시 매번 갱신, 정확히 $m$번. 차원이 3으로 고정되어도 상한이 날카롭다는 뜻입니다.
:::
` },
      { k: '9.1c', p: 122, title: '반공간의 VC 차원', body: R`
:::key 반공간의 VC 차원
$\mathbb R^d$의 동차 반공간 클래스의 VC 차원은 $d$이고, 비동차 반공간 클래스의 VC 차원은 $d+1$이다.
:::

- **동차, $\ge d$**: 표준기저 $e_1,\dots,e_d$는 분쇄됩니다. 레이블 $y$가 주어지면 $w=(y_1,\dots,y_d)$로 $\langle w,e_i\rangle=y_i$.
- **동차, $\le d$**: $\mathbb R^d$의 $d+1$개 벡터는 일차종속이라 $\sum_ia_ix_i=0$(모두 0은 아님). $I=\{a_i>0\}$에 $+1$, $J=\{a_j<0\}$에 $-1$을 주는 레이블링을 실현하는 $w$가 있다면 $0<\sum_Ia_i\langle w,x_i\rangle=\sum_J\lvert a_j\rvert\langle w,x_j\rangle\le0$ — 모순.
- **비동차**: $\mathbb R^{d+1}$의 동차 반공간으로 바꾸면 $\le d+1$. $0,e_1,\dots,e_d$가 분쇄되므로 $\ge d+1$.

:::note 모수 개수와 일치
비동차 반공간은 모수가 $d+1$개($w$와 $b$)이고 VC 차원도 $d+1$입니다. 기본 정리에 넣으면 불가지 표본 복잡도가 $\Theta\big((d+\ln(1/\delta))/\varepsilon^2\big)$ — 이산화 기법의 직관이 여기서는 정확합니다.
:::
` },
      { k: '9.2', p: 124, src: '강의 노트 · 9.2.1', title: '선형 회귀와 최소제곱', body: R`
$\cY=\mathbb R$, 제곱 손실 $\ell(h,(x,y))=(h(x)-y)^2$, $h_w(x)=\langle w,x\rangle$.
$$L_S(w)=\frac1m\sum_{i=1}^m\big(\langle w,x_i\rangle-y_i\big)^2,\qquad A=\sum_ix_ix_i^\top,\quad b=\sum_iy_ix_i.$$
$\nabla L_S(w)=\frac2m(Aw-b)$이므로 최소점은 **정규방정식** $Aw=b$를 만족합니다. $A$가 가역이면 $w=A^{-1}b$. 문제는 $A$가 특이할 때($m<d$이거나 특징이 일차종속)입니다.

:::key 최소제곱 해와 유사역행렬
1. $L_S$는 볼록이고, $w$가 최소점 $\iff Aw=b$.
2. $b\in\operatorname{range}(A)$이므로 정규방정식은 **항상** 해가 있다.
3. 해 집합은 $A^+b+\operatorname{null}(A)$이고, $w^\ast=A^+b$는 그중 유클리드 노름이 가장 작은 **유일한** 해이다.

여기서 $A=VDV^\top$(고유분해)일 때 $A^+=VD^+V^\top$, $D^+$는 0이 아닌 고윳값만 역수로 바꾼 대각행렬.
:::

:::hand 강의 노트 — 핵심 두 단계
**$\operatorname{range}(A)=\operatorname{span}\{x_i\}$.** $Au=\sum_i(x_i^\top u)x_i$이므로 ⊆. 역으로 $z\in\operatorname{span}\{x_i\}$가 $\operatorname{range}(A)$에 직교하면 $z^\top Au=0$ ($\forall u$), 대칭이라 $Az=0$, $0=z^\top Az=\sum_i(z^\top x_i)^2$이라 $z\perp x_i$ ($\forall i$), 그런데 $z\in\operatorname{span}\{x_i\}$이므로 $z=0$. 따라서 $b=\sum y_ix_i\in\operatorname{range}(A)$.

**최소 노름.** $A^+b\in\operatorname{span}\{v_i:\lambda_i\ne0\}=\operatorname{null}(A)^\perp$. 임의의 해 $w=A^+b+z$ ($z\in\operatorname{null}(A)$)는 피타고라스로 $\lVert w\rVert^2=\lVert A^+b\rVert^2+\lVert z\rVert^2\ge\lVert A^+b\rVert^2$, 등호는 $z=0$일 때만.
:::

:::warn 노트의 강조점
“$A^+b$가 해이다”로 끝내면 부족합니다. 특이한 경우 해가 무수히 많으므로 **$A^+b$는 최소 노름 해**라서 표준적인 ERM 출력이 된다고 써야 정확합니다.
:::
` },
      { k: '9.2b', p: 125, title: '다항 회귀는 선형 회귀다', body: R`
1차원 입력에 차수 $n$ 다항식 $p(x)=\sum_{i=0}^na_ix^i$을 맞추는 것은 특징 사상 $\psi(x)=(1,x,x^2,\dots,x^n)$ 위의 선형 회귀입니다: $p(x)=\langle a,\psi(x)\rangle$. 따라서 최소제곱 해는 $\psi(x_i)$로 만든 행렬로 똑같이 구합니다.

:::ex 예제 — 직선 맞추기
자료 $(x,y)=(0,1),(1,2),(2,2)$에 $y=a_0+a_1x$를 맞추면?
---
$\psi(x)=(1,x)$. $A=\sum\psi\psi^\top=\begin{pmatrix}3&3\\3&5\end{pmatrix}$, $b=\sum y\psi=(5,6)$. $\det A=6$. $a=A^{-1}b=\frac16\begin{pmatrix}5&-3\\-3&3\end{pmatrix}\begin{pmatrix}5\\6\end{pmatrix}=\frac16\begin{pmatrix}7\\3\end{pmatrix}$. $y\approx1.167+0.5x$.
:::

:::note 심층 신경망 과목과의 연결
정규방정식의 유도와 정사영 해석은 심층 신경망 과목의 첫 단원과 같습니다[[@dnn:ch01:1.3|$X^\top X\beta=X^\top y$, 열이 일차독립이면 해가 하나.]]. 이 과목은 열이 일차종속인 경우까지 유사역행렬로 마무리한다는 점이 다릅니다.
:::
` },
      { k: '9.3', p: 126, title: '로지스틱 회귀', body: R`
확률을 예측하려면 $\langle w,x\rangle$를 $[0,1]$로 보내야 합니다. **시그모이드** $\phi(z)=\frac1{1+e^{-z}}$로 $h_w(x)=\phi(\langle w,x\rangle)$를 “$y=1$일 확률”로 씁니다. $y\in\{\pm1\}$로 두면 $\Prob(y\mid x)=\phi(y\langle w,x\rangle)$ ($1-\phi(z)=\phi(-z)$이므로).

:::key 로지스틱 손실 = 음의 로그가능도
$$\ell(h_w,(x,y))=\ln\big(1+e^{-y\langle w,x\rangle}\big),\qquad\argmin_wL_S(w)=\argmax_w\prod_{i=1}^m\phi\big(y_i\langle w,x_i\rangle\big).$$
$z\mapsto\ln(1+e^{-z})$는 볼록이므로 $L_S$는 $w$의 볼록함수이다.
:::

$-\ln\phi(y\langle w,x\rangle)=\ln(1+e^{-y\langle w,x\rangle})$이고 $\ln$은 증가함수라 곱의 최대화와 음의 로그 합의 최소화가 같습니다. 볼록성은 $g(z)=\ln(1+e^{-z})$의 $g''(z)=\phi(z)(1-\phi(z))\ge0$과 “볼록함수 ∘ 선형사상은 볼록”에서 옵니다.

:::note 표기의 차이
심층 신경망 과목은 $y\in\{0,1\}$로 같은 손실을 교차 엔트로피 $-[y\ln p+(1-y)\ln(1-p)]$로 썼습니다[[@dnn:ch05:5.3|$y\in\{0,1\}$ 표기의 음의 로그가능도.]]. $y\in\{\pm1\}$ 표기에서는 $\ln(1+e^{-y\langle w,x\rangle})$ 한 줄로 정리되고, 마진 $y\langle w,x\rangle$의 함수라는 점이 드러납니다. 이 “마진의 감소함수” 모양이 12장의 대리 손실, 15장의 힌지 손실로 이어집니다.
:::
` },
    ],
    problems: [
      { sec: '9.1', type: 'mc', lv: 1, q: R`$\mathbb R^d$의 비동차 반공간 $\sign(\langle w,x\rangle+b)$를 동차 반공간으로 바꾸는 방법은?`,
        choices: [R`$b$를 무시한다`, R`$x'=(1,x)$, $w'=(b,w)$로 차원을 하나 늘린다`, R`$x$를 정규화한다`, R`$w$를 단위벡터로 만든다`], ans: 1,
        sol: R`$\langle w',x'\rangle=b+\langle w,x\rangle$. $\mathbb R^{d+1}$의 동차 반공간이 됩니다.` },
      { sec: '9.1', type: 'mc', lv: 2, q: R`실현가능한 반공간 ERM을 선형계획법으로 쓸 때 조건 $y_i\langle w,x_i\rangle>0$을 $\ge1$로 바꿔도 되는 이유는?`,
        choices: [R`자료가 정규화되어 있어서`, R`분리하는 $w$를 양수배해도 분류가 같으므로 최소 여유가 1이 되게 척도를 맞출 수 있어서`, R`$\lVert x_i\rVert\le1$이므로`, R`LP는 등호만 다룰 수 있어서`], ans: 1,
        sol: R`$\gamma=\min_iy_i\langle w^\ast,x_i\rangle>0$이면 $w^\ast/\gamma$가 $\ge1$을 만족합니다.` },
      { sec: '9.1b', type: 'num', lv: 1, q: R`분리 가능한 자료에서 $R=\max\lVert x_i\rVert=3$, $B=2$이면 퍼셉트론 갱신 횟수의 상한은?`, ans: '36', ansTex: R`(RB)^2=36`,
        sol: R`$(3\cdot2)^2=36$.` },
      { sec: '9.1b', type: 'num', lv: 2, q: R`$w^{(t)}=(1,-2)$이고 틀린 예제 $x=(2,1)$, $y=+1$에서 갱신한 뒤 이 예제의 여유 $y\langle w^{(t+1)},x\rangle$은?`, ans: '5', ansTex: R`0+\lVert x\rVert^2=5`,
        sol: R`갱신 전 $\langle w,x\rangle=2-2=0$(여유 0이라 갱신). $w^{(t+1)}=(3,-1)$, $\langle w^{(t+1)},x\rangle=6-1=5=0+\lVert x\rVert^2$.` },
      { sec: '9.1b', type: 'mc', lv: 3, q: R`Exercise 9.3의 예($x_i=e_i$, $y_i=1$, $d=m$)에서 $B=\sqrt m$인 이유는?`,
        choices: [R`$w=(1,\dots,1)$만 조건을 만족하므로`, R`조건 $w_i\ge1$ ($\forall i$)에서 $\lVert w\rVert^2=\sum w_i^2\ge m$이고, $(1,\dots,1)$이 등호를 이루므로`, R`$R=1$이므로`, R`퍼셉트론이 $m$번 갱신하므로`], ans: 1,
        sol: R`$y_i\langle w,e_i\rangle=w_i\ge1$. 최소 노름은 모든 좌표가 1일 때 $\sqrt m$. 따라서 $(RB)^2=m$이고 퍼셉트론의 실제 갱신 수 $m$과 같습니다.` },
      { sec: '9.1c', type: 'num', lv: 1, q: R`$\mathbb R^5$의 비동차 반공간 클래스의 VC 차원은?`, ans: '6', ansTex: R`d+1=6`,
        sol: R`비동차는 $d+1$입니다.` },
      { sec: '9.1c', type: 'mc', lv: 2, q: R`$\mathbb R^2$의 원점을 지나는 직선(동차 반공간)이 분쇄할 수 **없는** 것은?`,
        choices: [R`$\{(1,0),(0,1)\}$`, R`$\{(1,0),(2,0)\}$`, R`$\{(1,1),(-1,1)\}$`, R`$\{(0,1),(1,-1)\}$`], ans: 1,
        sol: R`$(1,0)$과 $(2,0)$은 같은 방향이라 $\langle w,x\rangle$의 부호가 늘 같습니다. $(+,-)$ 레이블이 불가능합니다. 나머지는 일차독립이라 분쇄됩니다.` },
      { sec: '9.2', type: 'mc', lv: 2, q: R`$A=\sum x_ix_i^\top$가 특이할 때 정규방정식 $Aw=b$에 대해 옳은 것은?`,
        choices: [R`해가 없을 수 있다`, R`해가 항상 있고, $A^+b$는 해 중 노름이 가장 작은 유일한 해이다`, R`해가 유일하다`, R`$A^{-1}b$로 구한다`], ans: 1,
        sol: R`$b\in\operatorname{span}\{x_i\}=\operatorname{range}(A)$이므로 항상 해가 있고, 해 집합은 $A^+b+\operatorname{null}(A)$입니다.` },
      { sec: '9.2', type: 'num', lv: 2, q: R`1차원 동차 회귀 $h_w(x)=wx$에 자료 $(1,2),(2,3),(3,7)$을 맞춘 최소제곱 해 $w$는?`, ans: '29/14', ansTex: R`\tfrac{\sum x_iy_i}{\sum x_i^2}=\tfrac{29}{14}`,
        sol: R`$A=\sum x_i^2=1+4+9=14$, $b=\sum x_iy_i=2+6+21=29$. $w=29/14\approx2.071$.` },
      { sec: '9.2', type: 'num', lv: 3, q: R`$\mathbb R^2$에서 자료가 $x_1=(1,1)$, $y_1=2$ 하나뿐일 때 동차 최소제곱의 최소 노름 해의 첫 성분은?`, ans: '1', ansTex: R`w^\ast=(1,1)`,
        sol: R`$A=x_1x_1^\top=\begin{pmatrix}1&1\\1&1\end{pmatrix}$(특이), $b=(2,2)$. 해 집합은 $w_1+w_2=2$인 직선. 최소 노름은 원점에서 가장 가까운 점 $(1,1)$ — $\operatorname{span}\{x_1\}$ 안의 해입니다.` },
      { sec: '9.3', type: 'num', lv: 1, q: R`로지스틱 손실 $\ln(1+e^{-y\langle w,x\rangle})$에서 마진 $y\langle w,x\rangle=0$일 때 손실은? (소수 넷째 자리)`, ans: 'ln(2)', ansTex: R`\ln2\approx0.6931`,
        sol: R`$\ln(1+1)=\ln2$. 마진이 커지면 0으로, 음수로 커지면 $\approx-y\langle w,x\rangle$로 선형 증가합니다.` },
      { sec: '9.3', type: 'mc', lv: 2, q: R`로지스틱 회귀의 경험적 위험이 $w$에 대해 볼록인 이유로 옳은 것은?`,
        choices: [R`시그모이드가 볼록이라서`, R`$g(z)=\ln(1+e^{-z})$가 볼록($g''=\phi(1-\phi)\ge0$)이고, 볼록함수에 선형사상을 합성하면 볼록이므로`, R`손실이 유계라서`, R`자료가 분리 가능해서`], ans: 1,
        sol: R`시그모이드 자체는 볼록도 오목도 아닙니다. 볼록한 것은 $-\ln\phi$입니다.` },
      { sec: '9.1b', type: 'open', lv: 2, proof: true, q: R`퍼셉트론 수렴 정리를 증명하세요: 분리 가능한 자료에서 $B=\min\{\lVert w\rVert:y_i\langle w,x_i\rangle\ge1\ \forall i\}$, $R=\max\lVert x_i\rVert$이면 갱신 횟수는 $(RB)^2$ 이하이다.`,
        sol: R`
$w^\ast$를 최솟값 $B$를 이루는 벡터라 하자. $T$번 갱신한 뒤의 벡터 $w^{(T+1)}$에 대해
(1) 갱신 $w\leftarrow w+y_ix_i$마다 $\langle w^\ast,w\rangle$이 $y_i\langle w^\ast,x_i\rangle\ge1$만큼 늘므로 $\langle w^\ast,w^{(T+1)}\rangle\ge T$ ($w^{(1)}=0$).
(2) 갱신은 $y_i\langle w,x_i\rangle\le0$일 때만 일어나므로 $\lVert w+y_ix_i\rVert^2=\lVert w\rVert^2+2y_i\langle w,x_i\rangle+\lVert x_i\rVert^2\le\lVert w\rVert^2+R^2$. 따라서 $\lVert w^{(T+1)}\rVert\le\sqrt TR$.
코시–슈바르츠: $T\le\langle w^\ast,w^{(T+1)}\rangle\le\lVert w^\ast\rVert\lVert w^{(T+1)}\rVert\le B\sqrt TR$. 따라서 $\sqrt T\le RB$, $T\le(RB)^2$. 갱신이 멈추면 모든 $i$에서 $y_i\langle w,x_i\rangle>0$.`,
        rubric: R`
- 내적의 하한 $\ge T$ — 3점
- 노름 제곱의 상한 $\le TR^2$ (갱신 조건 사용) — 4점
- 코시–슈바르츠로 결론 — 3점` },
      { sec: '9.2', type: 'open', lv: 3, proof: true, q: R`$A=\sum_ix_ix_i^\top$, $b=\sum_iy_ix_i$일 때 (a) $b\in\operatorname{range}(A)$임을, (b) $Aw=b$의 해 중 $A^+b$가 노름이 가장 작은 유일한 해임을 증명하세요.`,
        sol: R`
(a) $Au=\sum(x_i^\top u)x_i$라 $\operatorname{range}(A)\subseteq V:=\operatorname{span}\{x_i\}$. $z\in V$가 $\operatorname{range}(A)$와 직교하면 $z^\top Az=0$이고 $z^\top Az=\sum(z^\top x_i)^2$이므로 $z\perp x_i$ 전부, $z\in V$와 합쳐 $z=0$. 유한차원에서 $V$ 안의 직교여공간이 0이므로 $\operatorname{range}(A)=V\ni b$.
(b) $A=VDV^\top$. $b\in\operatorname{range}(A)=\operatorname{span}\{v_i:\lambda_i\ne0\}$이므로 $AA^+b=VDD^+V^\top b=b$ — $A^+b$는 해. 해 집합은 $A^+b+\operatorname{null}(A)$. $A^+b\in\operatorname{span}\{v_i:\lambda_i\ne0\}=\operatorname{null}(A)^\perp$이므로 $w=A^+b+z$에서 $\lVert w\rVert^2=\lVert A^+b\rVert^2+\lVert z\rVert^2$, 최소는 $z=0$일 때뿐.`,
        rubric: R`
- range = span 증명 — 4점
- $A^+b$가 해임 ($DD^+$ 논증) — 3점
- 해 집합과 직교성, 피타고라스로 최소·유일 — 3점` },
    ],
  });
})();
