/* 추가 연습문제 — 06 소프트맥스 회귀. 유도·증명형 중심으로 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 6,
    problems: [
      { sec: '6.3', type: 'open', lv: 3, proof: true, q: R`한 표본의 손실 $\ell(z)=-\sum_{k=1}^Cy_k\log p_k$, $p=\softmax(z)$, $y$는 원-핫일 때 (i) 야코비안 $\frac{\partial p}{\partial z}=\diag(p)-pp^T$를 보이고 (ii) $\nabla_z\ell=p-y$를 두 가지 방법(야코비안 사용, 로그-합-지수 꼴 사용)으로 유도하세요.`,
        sol: R`
**(i)** $p_k=e^{z_k}/Z$. $\frac{\partial p_k}{\partial z_m}=\frac{\delta_{km}e^{z_k}Z-e^{z_k}e^{z_m}}{Z^2}=\delta_{km}p_k-p_kp_m$. 행렬로 $\diag(p)-pp^T$ (대칭).
**(ii-a)** $\frac{\partial\ell}{\partial p_k}=-\frac{y_k}{p_k}$. $\frac{\partial\ell}{\partial z_m}=\sum_k\frac{\partial\ell}{\partial p_k}\frac{\partial p_k}{\partial z_m}=-\sum_k\frac{y_k}{p_k}(\delta_{km}p_k-p_kp_m)=-y_m+p_m\sum_ky_k=p_m-y_m$.
**(ii-b)** 정답을 $c$라 하면 $\ell=-z_c+\log\sum_je^{z_j}$. $\frac{\partial\ell}{\partial z_m}=-\delta_{mc}+\frac{e^{z_m}}{\sum_je^{z_j}}=p_m-y_m$.`,
        rubric: R`
- 몫의 미분으로 야코비안 — 3점
- 연쇄법칙과 $\sum y_k=1$ — 4점
- 로그-합-지수 꼴의 미분 — 3점` },
      { sec: '6.1', type: 'open', lv: 2, proof: true, q: R`$C=2$인 소프트맥스 회귀가 $w=w_1-w_2$인 로지스틱 회귀와 같음을 보이고, 따라서 $(w_1,w_2)$ 중 하나를 0으로 고정해도 표현력이 줄지 않음을 설명하세요.`,
        sol: R`
$p_1=\frac{e^{w_1^Tx}}{e^{w_1^Tx}+e^{w_2^Tx}}$. 분자·분모를 $e^{w_1^Tx}$로 나누면 $\frac1{1+e^{-(w_1-w_2)^Tx}}=\sigma\big((w_1-w_2)^Tx\big)$, $p_2=1-p_1$.
확률은 $w_1-w_2$에만 의존하므로 $(w_1,w_2)$와 $(w_1-w_2,0)$은 같은 모델입니다. 따라서 $w_2=0$으로 고정해도 모든 모델을 표현할 수 있습니다(일반적으로 $C$개 중 하나를 0으로 고정 가능).`,
        rubric: R`
- 약분으로 시그모이드 꼴 — 5점
- 차에만 의존 → 한 벡터 고정 가능 — 5점` },
      { sec: '6.4', type: 'open', lv: 3, proof: true, q: R`$H=\diag(p)-pp^T$ ($p_k>0$, $\sum p_k=1$)에 대해 (i) $v^THv=\sum_kp_kv_k^2-(\sum_kp_kv_k)^2\ge0$을 보이고 (ii) $Hv=0\iff v=c\mathbf 1$임을 보이세요. 이것이 소프트맥스 회귀의 최소점에 대해 뜻하는 바는?`,
        sol: R`
**(i)** $v^T\diag(p)v=\sum p_kv_k^2$, $v^Tpp^Tv=(p^Tv)^2$. 확률 $p_k$로 값 $v_k$를 갖는 확률변수 $V$의 $\Var(V)=\E V^2-(\E V)^2\ge0$.
**(ii)** $(Hv)_k=p_kv_k-p_k(p^Tv)=p_k(v_k-p^Tv)$. $p_k>0$이므로 $Hv=0\iff v_k=p^Tv$ (모든 $k$ 같은 값) $\iff v=c\mathbf 1$. (역으로 $v=c\mathbf1$이면 $p^Tv=c$.)
**의미.** 손실은 볼록이지만, 모든 클래스의 점수에 같은 값을 더하는 방향(가중치로는 $w_k\to w_k+c$)으로 곡률이 0이라 최소점이 선 전체로 퍼져 있습니다. 규제 $\frac\lambda2\lVert W\rVert^2$이 이 방향을 막아 유일한 해를 고릅니다.`,
        rubric: R`
- (i) 분산으로 해석 — 4점
- (ii) 영공간 계산 — 4점
- 최소점의 비유일성과 규제 — 2점` },
      { sec: '6.4', type: 'open', lv: 2, proof: true, q: R`$z\in\mathbb R^C$에 대해 $\max_kz_k\le\log\sum_ke^{z_k}\le\max_kz_k+\log C$를 증명하세요.`,
        sol: R`
$M=\max_kz_k$. 모든 $k$에서 $e^{z_k}\le e^M$이고 한 항은 $e^M$이므로 $e^M\le\sum_ke^{z_k}\le Ce^M$. 로그(증가함수)를 취하면 $M\le\log\sum e^{z_k}\le M+\log C$.`,
        rubric: R`
- 합의 하한·상한 — 6점
- 로그를 취하기 — 4점` },
      { sec: '6.1', type: 'num', lv: 1, q: R`$z=(\ln1,\ln2,\ln3,\ln4)$의 소프트맥스에서 셋째 성분은?`, ans: '0.3', ansTex: R`0.3`,
        sol: R`$e^z=(1,2,3,4)$, 합 10. $p_3=3/10$.` },
      { sec: '6.2', type: 'num', lv: 2, q: R`붓꽃 예제($p\approx(0.789,0.092,0.119)$)에서 정답이 클래스 3이었다면 손실 $-\log p_3$은? (소수 둘째 자리)`, ans: '-ln(e^(-0.18)/(e^(1.71)+e^(-0.44)+e^(-0.18)))', ansTex: R`\approx2.13`,
        sol: R`$-\log p_3=-z_3+\log\sum e^{z_j}=0.18+1.947\approx2.13$.` },
      { sec: '6.3', type: 'num', lv: 2, q: R`$W=0$ ($3\times2$), 입력 $x=(1,2)$, 정답 클래스 1 ($y=(1,0,0)$), 학습률 $0.3$으로 경사하강법 한 걸음 뒤 $w_{12}$ (클래스 1 가중치의 둘째 성분)은?`, ans: '0.4', ansTex: R`0.4`,
        sol: R`$W=0$이면 $p=(\tfrac13,\tfrac13,\tfrac13)$, $p-y=(-\tfrac23,\tfrac13,\tfrac13)$. $\nabla_W=(p-y)x^T$, 첫 행 $=(-\tfrac23,-\tfrac43)$. $w_1\leftarrow0-0.3(-\tfrac23,-\tfrac43)=(0.2,0.4)$.` },
      { sec: '6.4', type: 'mc', lv: 1, q: R`$\softmax(z/T)$에서 온도 $T\to0^+$일 때의 극한은? ($z$의 최댓값은 하나)`,
        choices: [R`균등분포`, R`최댓값 성분만 1인 원-핫(argmax)`, R`$z$를 정규화한 벡터`, R`모든 성분이 0`], ans: 1,
        sol: R`$e^{(z_k-z_{\max})/T}$는 $k$가 최댓값이면 1, 아니면 지수가 $-\infty$로 가서 0.` },
      { sec: '6.3', type: 'num', lv: 2, q: R`$p=(0.1,0.6,0.3)$, 정답 클래스 3, 입력 $x=(2,-1)$일 때 $\partial\ell/\partial w_{32}$는?`, ans: '0.7', ansTex: R`0.7`,
        sol: R`$(p_3-y_3)x_2=(0.3-1)(-1)=0.7$.` },
      { sec: '6.4', type: 'open', lv: 3, proof: true, q: R`소프트맥스 회귀의 손실 $J(W)$가 $W$에 대해 볼록임을 보이세요. (힌트: 볼록함수와 선형사상의 합성은 볼록)`,
        sol: R`
표본 $i$의 손실은 $\ell_i(W)=g(Wx_i)$, $g(z)=-z_{y_i}+\log\sum_je^{z_j}$.
$g$의 헤시안은 $\diag(p)-pp^T\succeq0$ (분산 해석)이므로 $g$는 볼록. $-z_{y_i}$는 선형이라 볼록성에 영향 없음.
$z=Wx_i$는 $W$의 선형함수이므로 임의의 $W,W'$, $\lambda\in[0,1]$에 대해 $\ell_i(\lambda W+(1-\lambda)W')=g(\lambda Wx_i+(1-\lambda)W'x_i)\le\lambda g(Wx_i)+(1-\lambda)g(W'x_i)$. 따라서 각 $\ell_i$가 볼록이고, 볼록함수의 합 $J$도 볼록.`,
        rubric: R`
- $g$의 헤시안 PSD — 4점
- 선형사상과의 합성이 볼록 — 4점
- 합의 볼록성 — 2점` },
    ],
  });
})();
