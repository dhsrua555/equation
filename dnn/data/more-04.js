/* 추가 연습문제 — 04 확률적 회귀, 규제, 커널. 유도·증명형과 손계산형을 섞어 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 4,
    problems: [
      { sec: '4.3', type: 'open', lv: 3, proof: true, q: R`잡음 $\varepsilon\sim\N(0,\sigma^2I)$인 선형모델 $y=X\beta+\varepsilon$에 사전분포 $\beta\sim\N(0,\tau^2I)$를 둘 때, $\beta$의 MAP 추정량이 $\lambda=\sigma^2/\tau^2$인 릿지 해 $(\lambda I+X^TX)^{-1}X^Ty$임을 유도하세요. 해가 유일한 이유도 쓰세요.`,
        sol: R`
$\log p(\beta\mid y)=\log p(y\mid\beta)+\log p(\beta)+C=-\frac1{2\sigma^2}\lVert y-X\beta\rVert^2-\frac1{2\tau^2}\lVert\beta\rVert^2+C'$.
$\sigma^2>0$을 곱하고 부호를 바꾸면 MAP $=\argmin_\beta\ \frac12\lVert y-X\beta\rVert^2+\frac\lambda2\lVert\beta\rVert^2$, $\lambda=\sigma^2/\tau^2$.
기울기 $X^TX\beta-X^Ty+\lambda\beta=0$에서 $(\lambda I+X^TX)\beta=X^Ty$.
$v\ne0$이면 $v^T(\lambda I+X^TX)v=\lambda\lVert v\rVert^2+\lVert Xv\rVert^2>0$이므로 양의 정부호, 따라서 가역이고 헤시안이 양의 정부호라 목적함수는 강볼록 — 기울기 0인 점이 유일한 최솟점입니다.`,
        rubric: R`
- 로그 사후분포와 상수 제거 — 3점
- 릿지 꼴과 $\lambda=\sigma^2/\tau^2$ — 2점
- 기울기와 해 — 2점
- 양의 정부호·유일성 — 3점` },
      { sec: '4.3', type: 'open', lv: 3, proof: true, q: R`$z\in\mathbb R$, $\lambda>0$일 때 $\min_\beta\ g(\beta)=\frac12(\beta-z)^2+\lambda\lvert\beta\rvert$의 해가 $\hat\beta=\operatorname{sign}(z)\max(\lvert z\rvert-\lambda,0)$ (연성 임계값)임을 보이세요.`,
        sol: R`
$g$는 볼록(볼록함수의 합). 경우를 나눕니다.
- $\beta>0$: $g'=\beta-z+\lambda=0\Rightarrow\beta=z-\lambda$. 이 점이 $\beta>0$이려면 $z>\lambda$.
- $\beta<0$: $g'=\beta-z-\lambda=0\Rightarrow\beta=z+\lambda$, $\beta<0$이려면 $z<-\lambda$.
- $\lvert z\rvert\le\lambda$: $\beta>0$에서 $g'=\beta-z+\lambda>0$ (증가), $\beta<0$에서 $g'=\beta-z-\lambda<0$ (감소)이므로 최소는 $\beta=0$.
세 경우를 합치면 $\hat\beta=\operatorname{sign}(z)\max(\lvert z\rvert-\lambda,0)$. (부분미분으로는 $0\in\beta-z+\lambda\,\partial\lvert\beta\rvert$, $\partial\lvert0\rvert=[-1,1]$.)`,
        rubric: R`
- 볼록성 — 1점
- $\beta>0$, $\beta<0$의 정류점과 조건 — 5점
- $\lvert z\rvert\le\lambda$에서 0이 최소인 이유 — 4점` },
      { sec: '4.3', type: 'num', lv: 1, q: R`위 문제에서 $z=3$, $\lambda=1$이면 $\hat\beta$는? (같은 조건의 릿지 $\frac12(\beta-z)^2+\frac\lambda2\beta^2$의 해는 $z/(1+\lambda)=1.5$)`, ans: '2', ansTex: R`2`,
        sol: R`$\lvert z\rvert=3>\lambda=1$이므로 $\hat\beta=3-1=2$. $z=0.5$였다면 정확히 0이 됩니다(릿지는 $0.25$).` },
      { sec: '4.3', type: 'mc', lv: 2, q: R`릿지의 $\lambda$를 키울 때 일반적으로 일어나는 일은?`,
        choices: [R`편향↓, 분산↑`, R`편향↑, 분산↓`, R`편향·분산 모두↓`, R`훈련오차↓`], ans: 1,
        sol: R`계수를 0 쪽으로 누르므로 평균 예측이 참값에서 벗어나고(편향↑), 자료에 따른 흔들림은 줄어듭니다(분산↓). 훈련오차는 늘어납니다.` },
      { sec: '4.1', type: 'open', lv: 2, proof: true, q: R`가우시안 잡음 선형모델의 로그가능도 $\ell(\beta,\sigma^2)=-\frac n2\log(2\pi\sigma^2)-\frac1{2\sigma^2}\lVert y-X\beta\rVert^2$에서 $\sigma^2$의 MLE가 $\hat\sigma^2=\frac1n\lVert y-X\hat\beta\rVert^2$임을 보이세요.`,
        sol: R`
$\beta$에 대한 최대화는 $\sigma^2$와 무관하게 $\hat\beta=$ 최소제곱해. 이를 넣은 $h(s)=-\frac n2\log(2\pi s)-\frac{f}{2s}$ ($s=\sigma^2$, $f=\lVert y-X\hat\beta\rVert^2$)를 최대화합니다.
$h'(s)=-\frac n{2s}+\frac f{2s^2}=0\iff s=f/n$. $s<f/n$이면 $h'>0$, $s>f/n$이면 $h'<0$이라 최대. 따라서 $\hat\sigma^2=f/n$.`,
        rubric: R`
- $\beta$를 먼저 최적화할 수 있는 이유 — 3점
- $\sigma^2$에 대한 미분 — 4점
- 최대임을 확인 — 3점` },
      { sec: '4.5', type: 'num', lv: 2, q: R`1차원 선형 커널 $K(x,z)=xz$, 자료 $x=(1,2)$, $y=(1,3)$, $\lambda=1$로 커널 릿지를 할 때 $x=3$에서의 예측값은?`, ans: '3.5', ansTex: R`\tfrac72`,
        sol: R`$K=\begin{pmatrix}1&2\\2&4\end{pmatrix}$, $\lambda I+K=\begin{pmatrix}2&2\\2&5\end{pmatrix}$, $\det=6$. $\alpha^*=\frac16\begin{pmatrix}5&-2\\-2&2\end{pmatrix}\begin{pmatrix}1\\3\end{pmatrix}=\frac16(-1,4)$. $K(3,X)=[3,6]$, $f=\frac{-3+24}6=3.5$.
확인(원시형): $\beta=(\lambda+\sum x^2)^{-1}\sum xy=\frac{7}{6}$, $3\beta=3.5$.` },
      { sec: '4.6', type: 'num', lv: 3, q: R`1차원 가우시안 커널($\sigma=1$), 자료 $x=(0,1)$, $y=(0,1)$, $\lambda=0.5$로 커널 릿지를 할 때 $x=0.5$에서의 예측값은? (소수 넷째 자리)`, ans: '0.41893', ansTex: R`\approx0.4189`,
        sol: R`$K=\begin{pmatrix}1&e^{-1/2}\\e^{-1/2}&1\end{pmatrix}$, $e^{-1/2}\approx0.6065$. $\lambda I+K$의 행렬식 $1.5^2-0.3679=1.8821$. $\alpha^*=\frac1{1.8821}(-0.6065,\ 1.5)\approx(-0.3223,\ 0.7970)$. $K(0.5,X)=[e^{-1/8},e^{-1/8}]\approx[0.8825,0.8825]$. $f\approx0.8825(0.4747)\approx0.4189$.` },
      { sec: '4.5', type: 'open', lv: 3, proof: true, q: R`$A$가 $d\times n$ 행렬이고 $\lambda>0$일 때 (i) $\lambda I_d+AA^T$와 $\lambda I_n+A^TA$가 가역임을 보이고 (ii) $(\lambda I_d+AA^T)^{-1}A=A(\lambda I_n+A^TA)^{-1}$을 증명하세요.`,
        sol: R`
**(i)** $v\ne0$이면 $v^T(\lambda I+AA^T)v=\lambda\lVert v\rVert^2+\lVert A^Tv\rVert^2>0$ — 양의 정부호라 가역. $\lambda I+A^TA$도 같습니다($\lVert Av\rVert^2$).
**(ii)** $(\lambda I_d+AA^T)A=\lambda A+AA^TA=A(\lambda I_n+A^TA)$. 왼쪽에서 $(\lambda I_d+AA^T)^{-1}$, 오른쪽에서 $(\lambda I_n+A^TA)^{-1}$을 곱하면 $A(\lambda I_n+A^TA)^{-1}=(\lambda I_d+AA^T)^{-1}A$.`,
        rubric: R`
- (i) 두 행렬의 양의 정부호성 — 4점
- (ii) 교환 관계 $(\lambda I+AA^T)A=A(\lambda I+A^TA)$ — 3점
- 양쪽에 역행렬을 곱하는 순서 — 3점` },
      { sec: '4.6', type: 'open', lv: 2, proof: true, q: R`$x,z\in\mathbb R^2$일 때 $K(x,z)=(x^Tz+1)^2=\varphi(x)^T\varphi(z)$가 되는 특성사상 $\varphi:\mathbb R^2\to\mathbb R^6$을 구하고 전개로 확인하세요.`,
        sol: R`
$(x_1z_1+x_2z_2+1)^2=x_1^2z_1^2+x_2^2z_2^2+1+2x_1x_2z_1z_2+2x_1z_1+2x_2z_2$.
$\varphi(x)=(x_1^2,\ x_2^2,\ \sqrt2x_1x_2,\ \sqrt2x_1,\ \sqrt2x_2,\ 1)$로 두면 $\varphi(x)^T\varphi(z)$가 위의 여섯 항과 정확히 같습니다.`,
        rubric: R`
- 전개 — 4점
- 계수 $\sqrt2$를 가진 특성사상 — 4점
- 확인 — 2점` },
      { sec: '4.6', type: 'open', lv: 3, proof: true, q: R`$K_1,K_2$가 커널(모든 유한 자료에서 그람 행렬이 대칭 양의 준정부호)이면 $K_1+K_2$와 $cK_1$ ($c>0$)도 커널임을 보이세요. 또 $K(x,z)=x^Tz-1$은 커널이 아님을 반례로 보이세요.`,
        sol: R`
자료 $x_1,\dots,x_n$과 $v\in\mathbb R^n$에 대해 그람 행렬 $G_1,G_2$가 양의 준정부호이면 $v^T(G_1+G_2)v=v^TG_1v+v^TG_2v\ge0$, $v^T(cG_1)v=c\,v^TG_1v\ge0$. 대칭성도 유지되므로 커널입니다.
$K(x,z)=x^Tz-1$에서 자료 한 점 $x=0$이면 그람 행렬 $[K(0,0)]=[-1]$이 음수라 양의 준정부호가 아닙니다. (커널이면 $K(x,x)=\lVert\varphi(x)\rVert^2\ge0$이어야 함.)`,
        rubric: R`
- 그람 행렬의 합·상수배 — 6점
- 반례와 $K(x,x)\ge0$의 필요성 — 4점` },
    ],
  });
})();
