/* 추가 연습문제 — 05 로지스틱 회귀. 유도·증명형 중심으로 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 5,
    problems: [
      { sec: '5.1', type: 'open', lv: 2, proof: true, q: R`$\sigma(z)=1/(1+e^{-z})$에 대해 (i) $\sigma$가 $\operatorname{logit}(p)=\log\frac p{1-p}$의 역함수임을 보이고 (ii) $\sigma(-z)=1-\sigma(z)$, (iii) $\sigma'(z)=\sigma(z)(1-\sigma(z))$를 증명하세요.`,
        sol: R`
**(i)** $\operatorname{logit}(\sigma(z))=\log\frac{\sigma}{1-\sigma}$. $1-\sigma(z)=\frac{e^{-z}}{1+e^{-z}}$이므로 $\frac{\sigma}{1-\sigma}=\frac{1}{e^{-z}}=e^z$, 로그는 $z$. 반대로 $\sigma(\operatorname{logit}p)=\frac1{1+\frac{1-p}p}=p$.
**(ii)** $1-\sigma(z)=\frac{e^{-z}}{1+e^{-z}}$에서 분자·분모에 $e^z$를 곱하면 $\frac1{e^z+1}=\sigma(-z)$.
**(iii)** $\sigma(z)=(1+e^{-z})^{-1}$, $\sigma'(z)=-(1+e^{-z})^{-2}\cdot(-e^{-z})=\frac{e^{-z}}{(1+e^{-z})^2}=\frac1{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}}=\sigma(z)(1-\sigma(z))$.`,
        rubric: R`
- (i) 두 방향의 합성 — 3점
- (ii) — 3점
- (iii) 연쇄법칙과 인수분해 — 4점` },
      { sec: '5.3', type: 'open', lv: 3, proof: true, q: R`레이블을 $\tilde y_i\in\{-1,+1\}$로 쓰고 $P(\tilde y_i=+1\mid x_i)=\sigma(w^Tx_i)$라 하자. 음의 로그가능도가 $\sum_i\log\big(1+e^{-\tilde y_iw^Tx_i}\big)$임을 보이세요.`,
        sol: R`
$P(\tilde y=+1\mid x)=\sigma(w^Tx)$, $P(\tilde y=-1\mid x)=1-\sigma(w^Tx)=\sigma(-w^Tx)$. 두 경우 모두 $P(\tilde y\mid x)=\sigma(\tilde y\,w^Tx)$로 한 줄에 씁니다.
따라서 $-\log L=-\sum_i\log\sigma(\tilde y_iw^Tx_i)=\sum_i\log\big(1+e^{-\tilde y_iw^Tx_i}\big)$ ($-\log\sigma(u)=\log(1+e^{-u})$).`,
        rubric: R`
- $1-\sigma(z)=\sigma(-z)$ 사용 — 4점
- 한 줄 표기 $\sigma(\tilde yw^Tx)$ — 3점
- 로그 정리 — 3점` },
      { sec: '5.2', type: 'num', lv: 1, q: R`로지스틱 회귀에서 흡연 여부 특성의 가중치가 $w_j=0.7$이다. 다른 특성이 같을 때 흡연자의 오즈는 비흡연자의 몇 배인가? (소수 넷째 자리)`, ans: 'e^0.7', ansTex: R`e^{0.7}\approx2.0138`,
        sol: R`로그 오즈가 $0.7$ 늘므로 오즈는 $e^{0.7}\approx2.014$배(오즈비). 확률이 2배라는 뜻은 아닙니다.` },
      { sec: '5.4', type: 'num', lv: 2, q: R`$w=(0,0)$에서 자료 $((1,1),0)$, $((1,3),1)$, $((1,2),1)$ (첫 성분은 절편용 1), 학습률 $\alpha=0.2$로 경사하강법 한 걸음 뒤의 $w_2$는?`, ans: '0.4', ansTex: R`0.4`,
        sol: R`모든 $\sigma=\tfrac12$. 기울기 $=\tfrac12(1,1)-\tfrac12(1,3)-\tfrac12(1,2)=(-\tfrac12,-2)$. $w\leftarrow(0,0)-0.2(-0.5,-2)=(0.1,0.4)$.` },
      { sec: '5.4', type: 'open', lv: 2, proof: true, q: R`표본 하나의 손실 $l(w)=-[y\log p+(1-y)\log(1-p)]$, $p=\sigma(z)$, $z=w^Tx$를 $\frac{\partial l}{\partial p}\cdot\frac{\partial p}{\partial z}\cdot\nabla_wz$의 연쇄법칙으로 미분해 $\nabla_wl=(p-y)x$를 보이세요.`,
        sol: R`
$\frac{\partial l}{\partial p}=-\frac yp+\frac{1-y}{1-p}=\frac{-y(1-p)+(1-y)p}{p(1-p)}=\frac{p-y}{p(1-p)}$.
$\frac{\partial p}{\partial z}=\sigma'(z)=p(1-p)$, $\nabla_wz=x$.
곱하면 $\frac{p-y}{p(1-p)}\cdot p(1-p)\cdot x=(p-y)x$.`,
        rubric: R`
- $\partial l/\partial p$ 통분 — 4점
- $\sigma'=p(1-p)$ — 3점
- 약분과 결론 — 3점` },
      { sec: '5.5', type: 'open', lv: 3, proof: true, q: R`$X\in\mathbb R^{N\times d}$의 열이 일차독립이면 로지스틱 손실의 헤시안 $X^TSX$가 모든 $w$에서 양의 **정부호**임을 보이세요.`,
        sol: R`
$s_i=\sigma(z_i)(1-\sigma(z_i))$는 $\sigma(z_i)\in(0,1)$이라 항상 $s_i>0$입니다.
$v\ne0$이면 $v^TX^TSXv=\sum_is_i(x_i^Tv)^2\ge0$이고, 0이려면 모든 $i$에서 $x_i^Tv=0$, 즉 $Xv=0$. 열이 일차독립이면 $Xv=0\Rightarrow v=0$이므로 모순. 따라서 $v^T\nabla^2Jv>0$.`,
        rubric: R`
- $s_i>0$ — 3점
- 이차형식을 제곱의 가중합으로 — 3점
- 0이 되는 조건과 일차독립 — 4점` },
      { sec: '5.5', type: 'open', lv: 3, proof: true, q: R`자료가 선형 분리 가능하다고 하자: 어떤 $w_0$에 대해 $y_i=1$이면 $w_0^Tx_i>0$, $y_i=0$이면 $w_0^Tx_i<0$. 규제 없는 로지스틱 손실 $J(w)$가 최솟값을 갖지 않음을(하한 0에 도달하지 못함) 보이세요.`,
        sol: R`
$J(w)=\sum_i\ell_i$, 각 $\ell_i>0$이므로 $J>0$. $w=cw_0$ ($c>0$)로 두면 $y_i=1$인 표본의 손실 $\log(1+e^{-cw_0^Tx_i})\to0$ ($c\to\infty$), $y_i=0$인 표본의 손실 $\log(1+e^{cw_0^Tx_i})\to0$ (지수가 $-\infty$로). 따라서 $\inf J=0$.
그런데 어떤 유한한 $w$에서도 $J(w)>0$이므로 하한 0이 달성되지 않아 최소점이 없습니다. (경사하강법은 $\lVert w\rVert\to\infty$ 방향으로 계속 움직입니다.)`,
        rubric: R`
- $J>0$ — 2점
- $cw_0$를 따라 $J\to0$ — 5점
- 하한이 달성되지 않음 — 3점` },
      { sec: '5.5', type: 'open', lv: 3, proof: true, q: R`$J_\lambda(w)=J(w)+\frac\lambda2\lVert w\rVert^2$ ($\lambda>0$)의 헤시안이 $\succeq\lambda I$임을 보이고, 따라서 최소점이 유일하게 존재함을 논하세요.`,
        sol: R`
$\nabla^2J_\lambda=X^TSX+\lambda I$. $v^T\nabla^2J_\lambda v=\sum s_i(x_i^Tv)^2+\lambda\lVert v\rVert^2\ge\lambda\lVert v\rVert^2$이므로 $\nabla^2J_\lambda\succeq\lambda I$ (강볼록).
강볼록 함수는 $J_\lambda(w)\ge J_\lambda(0)+\nabla J_\lambda(0)^Tw+\frac\lambda2\lVert w\rVert^2$이라 $\lVert w\rVert\to\infty$이면 $J_\lambda\to\infty$: 최소점이 유계 영역 안에 있고(연속함수라 존재), 강볼록이라 두 최소점 사이의 중점이 더 작아져 유일합니다.`,
        rubric: R`
- 헤시안 계산 — 3점
- $\succeq\lambda I$ — 3점
- 존재(강제성)와 유일성 — 4점` },
      { sec: '5.3', type: 'mc', lv: 2, q: R`로지스틱 회귀에서 제곱오차 $(y-\sigma(w^Tx))^2$ 대신 교차 엔트로피를 쓰는 이유로 옳은 것은?`,
        choices: [R`교차 엔트로피가 항상 더 작은 값을 준다`, R`교차 엔트로피는 $w$에 대해 볼록이고, 자신 있게 틀린 표본에서도 기울기가 사라지지 않는다`, R`제곱오차는 미분할 수 없다`, R`제곱오차로는 확률을 출력할 수 없다`], ans: 1,
        sol: R`제곱오차의 기울기에는 $\sigma'(z)$가 곱해져 $\lvert z\rvert$가 크면 0에 가깝고, 손실도 볼록이 아닙니다. 교차 엔트로피는 $\sigma'$이 약분되어 기울기가 $(\sigma-y)x$.` },
      { sec: '5.2', type: 'num', lv: 1, q: R`$w=(w_0,w_1)=(-3,1)$ (절편, 공부 시간)일 때 공부 시간 4시간인 학생의 합격 확률은? (소수 넷째 자리)`, ans: '1/(1+e^(-1))', ansTex: R`\sigma(1)\approx0.7311`,
        sol: R`$z=-3+4=1$, $\sigma(1)=1/(1+e^{-1})\approx0.7311$.` },
    ],
  });
})();
