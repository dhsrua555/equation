/* 퀴즈풀이 — Quiz 1 (M1407.0012, 홍영준 교수, 2026년 9월 30일).
   문제는 원문을 우리말로 옮겼고, 풀이·핵심 포인트·자주 하는 실수는 새로 썼습니다. 탭은 core/app.js의 viewQuiz가 그립니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.quizzes = EM.quizzes || [];
(function () {
  const R = String.raw;
  EM.quizzes.push({
    id: 'q1', mark: 'Q', title: 'Quiz 1', short: 'Quiz 1',
    meta: 'M1407.0012 · 홍영준 교수 · 9월 30일 시행',
    intro: R`
두 문제 모두 **유도형**입니다. 문제 1은 Problem Set 1 문제 2(가우시안 평균의 MAP)를 **벡터·행렬로 일반화**한 것이고, 문제 2는 수업의 He 초기화 유도를 **Leaky ReLU로 일반화**한 것입니다.

:::tip 이 퀴즈에서 점수를 가르는 것
1. **상수항을 정확히 버린다.** $w$와 무관한 항($\log p(y)$, 정규화 상수)은 버려도 되지만, **무엇이 왜 $w$와 무관한지** 한 줄로 밝힙니다.
2. **양수를 곱해도 최소점은 그대로**라는 근거로 $\sigma^2$를 곱해 $\lambda$를 읽어 냅니다.
3. **역행렬이 존재하는 이유**($X^TX+\lambda I\succ0$)를 씁니다. $X^TX$는 가역이 아닐 수 있습니다.
4. 기댓값을 나눌 때 **어떤 독립성을 쓰는지**($w$와 $x$의 독립, $w_i$끼리의 독립) 밝힙니다. $x_i$끼리는 독립이라는 가정이 **없습니다**.
5. 대칭성을 쓸 때 **$z=0$인 경우**를 처리합니다.
:::
`,
    problems: [
      { id: 'p1', label: '문제 1', title: '가우시안 선형모델의 MAP = 릿지 회귀', where: '확률적 회귀와 규제', secs: ['ch01:1.3', 'ch02:2.6', 'ch04:4.1', 'ch04:4.3'],
        body: R`
:::def 문제
$X\in\mathbb R^{N\times d}$는 고정된 설계 행렬이다 ($N,d\ge1$). $y\in\mathbb R^N$, $w\in\mathbb R^d$에 대해 가우시안 모델
$$y\mid w\sim\N(Xw,\sigma^2I_N),\qquad w\sim\N(0,\tau^2I_d)$$
를 생각한다. $\sigma,\tau\gt0$은 알려진 상수이고, 모든 밀도는 고정된 $X$에 대한 조건부이다(표기에서는 생략).

**1.** 베이즈 규칙으로 $w$와 무관한 덧셈 상수를 제외하고 $-\log p(w\mid y)$를 구하시오. 최대 사후확률(MAP) 추정이
$$J_\lambda(w)=\frac12\lVert y-Xw\rVert_2^2+\frac\lambda2\lVert w\rVert_2^2$$
의 최소화와 동치임을 보이고 $\lambda$를 구하시오.

**2.** $J_\lambda$를 미분해 MAP 추정량의 닫힌 꼴을 유도하시오.
:::

:::key 핵심 포인트
- **사후 ∝ 가능도 × 사전.** $p(w\mid y)=\frac{p(y\mid w)p(w)}{p(y)}$이고 분모 $p(y)$는 $w$와 무관한 상수입니다.
- 다변량 가우시안 $\N(\mu,\sigma^2I_N)$의 밀도는 $(2\pi\sigma^2)^{-N/2}\exp\!\big(-\frac{\lVert y-\mu\rVert^2}{2\sigma^2}\big)$. 음의 로그를 취하면 **제곱오차 / $2\sigma^2$ + 상수**.
- 답은 $\boxed{\lambda=\sigma^2/\tau^2}$ — 잡음이 클수록, 사전분포가 좁을수록 규제가 강합니다. ($\sigma^2=1$이던 Problem Set 1의 $\lambda=1/\tau^2$이 이 식의 특수한 경우입니다.)
- 닫힌 꼴은 $\boxed{\hat w_{\text{MAP}}=(X^TX+\lambda I_d)^{-1}X^Ty}$. 역행렬의 존재는 $v^T(X^TX+\lambda I)v=\lVert Xv\rVert^2+\lambda\lVert v\rVert^2\gt0$ ($v\ne0$)로 보입니다.
- 검산: $\tau^2\to\infty$ ($\lambda\to0$)이면 최소제곱해(정규방정식), $\tau^2\to0$이면 $\hat w\to0$.
:::

:::ex 풀이
가능도와 사전분포의 음의 로그를 각각 쓰고 더하면 끝납니다. 직접 써 본 뒤 펼치세요.
---
**1. 음의 로그 사후분포.** 베이즈 규칙에서
$$p(w\mid y)=\frac{p(y\mid w)\,p(w)}{p(y)},\qquad -\log p(w\mid y)=-\log p(y\mid w)-\log p(w)+\log p(y).$$
$p(y)=\int p(y\mid w)p(w)\,dw$는 $w$에 대해 적분한 값이므로 $w$와 무관합니다. 두 밀도를 대입하면
$$-\log p(y\mid w)=\frac1{2\sigma^2}\lVert y-Xw\rVert_2^2+\frac N2\log(2\pi\sigma^2),\qquad -\log p(w)=\frac1{2\tau^2}\lVert w\rVert_2^2+\frac d2\log(2\pi\tau^2).$$
따라서 $w$와 무관한 상수 $C$를 모아
$$-\log p(w\mid y)=\frac1{2\sigma^2}\lVert y-Xw\rVert_2^2+\frac1{2\tau^2}\lVert w\rVert_2^2+C.$$
**MAP와 $J_\lambda$의 동치.** $\log$는 증가함수이므로 $\argmax_wp(w\mid y)=\argmin_w\{-\log p(w\mid y)\}$. 상수 $C$를 빼고 양수 $\sigma^2$를 곱해도 최소점은 바뀌지 않으므로
$$\hat w_{\text{MAP}}=\argmin_w\ \sigma^2\big(-\log p(w\mid y)-C\big)=\argmin_w\ \frac12\lVert y-Xw\rVert_2^2+\frac{\sigma^2}{2\tau^2}\lVert w\rVert_2^2=\argmin_wJ_\lambda(w),\qquad\lambda=\frac{\sigma^2}{\tau^2}.$$

**2. 닫힌 꼴.** 전개하면 $J_\lambda(w)=\frac12\big(y^Ty-2w^TX^Ty+w^TX^TXw\big)+\frac\lambda2w^Tw$. 벡터 미분 공식 $\nabla_w(w^Tm)=m$, $\nabla_w(w^TAw)=(A+A^T)w=2Aw$ (대칭 $A=X^TX$)로
$$\nabla_wJ_\lambda(w)=-X^Ty+X^TXw+\lambda w=-X^T(y-Xw)+\lambda w.$$
0으로 두면 $(X^TX+\lambda I_d)w=X^Ty$.
**가역성.** $v\ne0$이면 $v^T(X^TX+\lambda I_d)v=\lVert Xv\rVert_2^2+\lambda\lVert v\rVert_2^2\ge\lambda\lVert v\rVert_2^2\gt0$이므로 $X^TX+\lambda I_d\succ0$, 가역입니다. ($X$의 열이 일차종속이어도, $N\lt d$여도 성립합니다.)
**최소점임.** 헤시안 $\nabla^2J_\lambda=X^TX+\lambda I_d\succ0$이라 $J_\lambda$는 강볼록이고, 유일한 정류점이 유일한 최소점입니다:
$$\hat w_{\text{MAP}}=(X^TX+\lambda I_d)^{-1}X^Ty,\qquad\lambda=\frac{\sigma^2}{\tau^2}.\qquad\blacksquare$$

**검산 예.** $d=1$, $X=(1,1)^T$, $y=(1,3)^T$, $\sigma^2=\tau^2=1$이면 $\lambda=1$, $X^TX=2$, $X^Ty=4$이므로 $\hat w_{\text{MAP}}=\frac4{2+1}=\frac43$. 최소제곱해 $\frac42=2$보다 0 쪽으로 **수축**됩니다.

**덧붙임.** 사후분포 자체가 가우시안 $\N\big(\hat w_{\text{MAP}},\,\sigma^2(X^TX+\lambda I)^{-1}\big)$이라 MAP는 사후평균과도 같습니다. 또 $(X^TX+\lambda I_d)^{-1}X^T=X^T(XX^T+\lambda I_N)^{-1}$이므로 $\hat w=X^T(XX^T+\lambda I_N)^{-1}y$로도 쓸 수 있고, $N\lt d$일 때 더 작은 $N\times N$ 역행렬로 계산됩니다 — [[ch04:4.5|커널 릿지 회귀]]가 바로 이 꼴입니다.
:::

:::warn 자주 하는 실수
- $\lambda=1/\tau^2$ 또는 $\tau^2/\sigma^2$로 쓰는 것. $J_\lambda$의 첫 항 계수가 $\frac12$이 되도록 **$\sigma^2$를 곱한** 결과가 $\lambda=\sigma^2/\tau^2$입니다.
- $p(y)$를 그냥 지우고 이유를 쓰지 않는 것, 또는 정규화 상수 $(2\pi\sigma^2)^{-N/2}$를 $w$의 함수로 착각하는 것.
- $(X^TX)^{-1}$의 존재를 가정하는 것. 이 문제는 $N,d$에 아무 조건이 없으므로 $X^TX+\lambda I$의 양의 정부호성으로 가역성을 보여야 합니다.
- 기울기의 부호($-X^T(y-Xw)$)나 $\nabla(w^TAw)=2Aw$의 대칭 조건을 빠뜨리는 것.
:::
` },
      { id: 'p2', label: '문제 2', title: 'Leaky ReLU의 2차 모멘트 보존과 He 초기화', where: '활성화 함수와 가중치 초기화', secs: ['ch10:10.4', 'ch11:11.2', 'ch11:11.3'],
        body: R`
:::def 문제
$0\le\alpha\le1$에 대해
$$\phi_\alpha(z)=\begin{cases}z,&z\ge0,\\\alpha z,&z\lt0\end{cases}$$
로 정의한다. $n\ge1$이고 $x\in\mathbb R^n$은 모든 $i$에 대해 $\E[x_i^2]=q$ ($0\lt q\lt\infty$)인 확률벡터이다. 가중치 $w_1,\dots,w_n$은 독립이고 같은 분포 $\N(0,s^2)$ ($s^2\gt0$)를 따르며, 가중치 벡터 전체는 $x$와 독립이다.
$$z=\sum_{i=1}^nw_ix_i,\qquad h=\phi_\alpha(z).$$

**1.** $\E[z]=0$, $\E[z^2]=ns^2q$를 증명하시오.

**2.** $z$와 $-z$가 같은 분포를 가진다는 사실은 증명 없이 써도 된다. 이 대칭성을 써서 다음을 증명하시오.
$$\E[h^2]=\frac{1+\alpha^2}2\,\E[z^2].$$

**3.** 출력의 2차 모멘트가 입력의 좌표별 2차 모멘트와 같도록, 즉 $\E[h^2]=q$가 되도록 $s^2$를 정하시오. $\alpha=0$과 $\alpha=1$에서 값을 구하고, 각각에 해당하는 활성화 함수를 밝히시오.
:::

:::key 핵심 포인트
- **1번**은 $\E[w_iw_j]=s^2\delta_{ij}$ 하나로 교차항이 사라집니다. $x_i$끼리의 독립이나 $\E[x_i]=0$은 **필요 없습니다** — 가중치의 독립성과 평균 0이 일을 다 합니다.
- **2번**은 $h^2=z^2\mathbf 1\{z\ge0\}+\alpha^2z^2\mathbf 1\{z\lt0\}$로 쪼개고, 대칭성으로 두 반쪽의 기댓값이 **각각 $\frac12\E[z^2]$**임을 보입니다. 가우시안성은 쓰지 않습니다.
- **3번**의 답은 $\boxed{s^2=\dfrac2{(1+\alpha^2)\,n}}$. $\alpha=0$ (ReLU)이면 $2/n$ — **He(Kaiming) 초기화**, $\alpha=1$ (항등 함수, 즉 선형)이면 $1/n$ — **LeCun 초기화**(입출력 폭이 같을 때의 Xavier).
- 보존되는 것은 **분산이 아니라 2차 모멘트**입니다. ReLU 출력은 평균이 0이 아니므로 $\E[h^2]\ne\Var(h)$.
:::

:::ex 풀이
세 단계가 차례로 이어집니다. 직접 써 본 뒤 펼치세요.
---
**준비: 적분 가능성.** $\E[x_i^2]=q\lt\infty$이므로 코시-슈바르츠로 $\E|x_i|\le\sqrt q$, $\E|x_ix_j|\le\sqrt{\E x_i^2\,\E x_j^2}=q$. $w_i$도 가우시안이라 모든 모멘트가 유한합니다. 따라서 아래의 기댓값은 모두 유한하고, 독립인 두 확률변수의 곱의 기댓값은 기댓값의 곱입니다.

**1.** 기댓값의 선형성과 $w_i$, $x_i$의 독립성으로
$$\E[z]=\sum_{i=1}^n\E[w_ix_i]=\sum_{i=1}^n\E[w_i]\,\E[x_i]=\sum_{i=1}^n0\cdot\E[x_i]=0.$$
제곱을 전개하고, 가중치 벡터 $(w_1,\dots,w_n)$와 $x$가 독립이므로 $\E[w_iw_jx_ix_j]=\E[w_iw_j]\,\E[x_ix_j]$:
$$\E[z^2]=\sum_{i=1}^n\sum_{j=1}^n\E[w_iw_j]\,\E[x_ix_j].$$
$i\ne j$이면 $w_i,w_j$가 독립이라 $\E[w_iw_j]=\E[w_i]\E[w_j]=0$, $i=j$이면 $\E[w_i^2]=\Var(w_i)+(\E w_i)^2=s^2$. 즉 $\E[w_iw_j]=s^2\delta_{ij}$이므로
$$\E[z^2]=\sum_{i=1}^ns^2\,\E[x_i^2]=ns^2q.$$

**2.** $h^2$를 부호로 나눕니다. $z\ge0$이면 $h^2=z^2$, $z\lt0$이면 $h^2=\alpha^2z^2$이므로
$$h^2=z^2\mathbf 1\{z\ge0\}+\alpha^2z^2\mathbf 1\{z\lt0\},\qquad \E[h^2]=A+\alpha^2B,$$
$$A=\E\big[z^2\mathbf 1\{z\ge0\}\big],\qquad B=\E\big[z^2\mathbf 1\{z\lt0\}\big].$$
**$A=B$.** $z$와 $-z$가 같은 분포이므로 $g(t)=t^2\mathbf 1\{t\lt0\}$에 대해 $\E[g(z)]=\E[g(-z)]$:
$$B=\E\big[z^2\mathbf 1\{z\lt0\}\big]=\E\big[(-z)^2\mathbf 1\{-z\lt0\}\big]=\E\big[z^2\mathbf 1\{z\gt0\}\big].$$
$z=0$에서는 $z^2=0$이므로 $z^2\mathbf 1\{z\gt0\}=z^2\mathbf 1\{z\ge0\}$, 따라서 $B=A$.
**합.** 두 지시함수의 합은 1이므로 $A+B=\E[z^2]$. $A=B$와 합치면 $A=B=\frac12\E[z^2]$이고
$$\E[h^2]=\frac12\E[z^2]+\frac{\alpha^2}2\E[z^2]=\frac{1+\alpha^2}2\,\E[z^2].\qquad\blacksquare$$

**3.** 1, 2를 합치면 $\E[h^2]=\frac{1+\alpha^2}2\,ns^2q$. 이것이 $q$와 같으려면 ($q\gt0$으로 나누어)
$$\frac{(1+\alpha^2)\,n\,s^2}2=1\iff s^2=\frac2{(1+\alpha^2)\,n}.$$

| $\alpha$ | 활성화 함수 | $s^2$ | 이름 |
|---|---|---|---|
| $0$ | $\phi_0(z)=\max(0,z)$ — **ReLU** | $\dfrac2n$ | He(Kaiming) 초기화 |
| $1$ | $\phi_1(z)=z$ — **항등 함수**(선형, 활성화 없음) | $\dfrac1n$ | LeCun 초기화 · 입출력 폭이 같을 때 Xavier $\frac2{n_{in}+n_{out}}$ |
| $0\lt\alpha\lt1$ | **Leaky ReLU** (예: $\alpha=0.01$) | $\dfrac2{(1+\alpha^2)n}\approx\dfrac2n$ | Leaky ReLU용 He 초기화 |

**해석.** ReLU는 음수 쪽 절반을 잘라 2차 모멘트를 **반으로** 줄이므로, 가중치 분산을 두 배($2/n$)로 키워 보충합니다. 음수 쪽을 $\alpha$배로 남기면 잃는 양이 $\frac{1-\alpha^2}2$로 줄어 보충도 덜 합니다. 이 $s^2$로 층마다 2차 모멘트가 유지되므로, 깊은 망에서도 신호가 층을 지나며 지수적으로 폭발하거나 사라지지 않습니다.
:::

:::warn 자주 하는 실수
- $\E[z^2]$를 전개할 때 $x_i$끼리 독립이라고 가정하는 것. 교차항은 $\E[w_iw_j]=0$ 덕분에 사라집니다. $\E[x_ix_j]$는 0이 아니어도 됩니다.
- 2번에서 $\E[h^2]=\frac{1+\alpha^2}2\E[z^2]$를 “$\Var(h)$”로 쓰는 것. ReLU 출력의 평균은 양수이므로 분산과 2차 모멘트는 다릅니다.
- 대칭성에서 $\mathbf 1\{z\gt0\}$과 $\mathbf 1\{z\ge0\}$의 차이($z=0$)를 언급하지 않는 것. $z^2=0$이라 상관없다는 한 줄이면 됩니다.
- $\alpha=1$을 “Leaky ReLU”라고만 쓰는 것. $\phi_1$은 항등 함수, 즉 **선형 층**입니다.
:::
` },
    ],
  });
})();
