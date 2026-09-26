/* 추가 연습문제 — 07 고유값 문제 (Kreyszig 8.1–8.5). 같은 유형으로 새로 만든 문제입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 7,
    secTitles: { '8.1': '고유값·고유벡터', '8.2': '응용', '8.3': '대칭·직교 행렬', '8.4': '대각화·이차형식', '8.5': '복소 행렬' },
    secs: ['8.1', '8.1', '8.1', '8.3', '8.1', '8.4', '8.4', '8.4', '8.1', '8.4', '8.3'],
    problems: [
      { sec: '8.1', type: 'num', lv: 1, q: R`$\begin{pmatrix}3&0\\8&-1\end{pmatrix}$의 두 고유값의 곱은?`, ans: '-3', ansTex: R`-3`,
        sol: R`삼각행렬이므로 고유값은 대각성분 $3,-1$. 곱은 $\det A=-3$.` },
      { sec: '8.1', type: 'num', lv: 1, q: R`$\begin{pmatrix}2&3\\3&2\end{pmatrix}$의 작은 고유값은?`, ans: '-1', ansTex: R`-1`,
        sol: R`$(2-\lambda)^2-9=0$에서 $\lambda=5,-1$. 고유벡터는 각각 $(1,1)$, $(1,-1)$.` },
      { sec: '8.1', type: 'mc', lv: 1, q: R`$A=\begin{pmatrix}4&1\\2&3\end{pmatrix}$의 고유벡터는?`,
        choices: [R`$(1,-1)^T$`, R`$(1,-2)^T$`, R`$(2,1)^T$`, R`$(1,2)^T$`], ans: 1,
        sol: R`$A(1,-2)^T=(2,-4)^T=2(1,-2)^T$이므로 고유값 2의 고유벡터. 나머지는 $A\mathbf x$가 $\mathbf x$의 배수가 아닙니다. (다른 고유벡터는 $(1,1)^T$, 고유값 5)` },
      { sec: '8.1', type: 'num', lv: 2, q: R`$\begin{pmatrix}2&1&0\\1&2&0\\0&0&5\end{pmatrix}$의 가장 작은 고유값은?`, ans: '1', ansTex: R`1`,
        sol: R`블록 대각. $\begin{pmatrix}2&1\\1&2\end{pmatrix}$의 고유값 $1,3$과 $5$.` },
      { sec: '8.1', type: 'num', lv: 2, q: R`$A=\begin{pmatrix}3&1&0\\0&3&1\\0&0&3\end{pmatrix}$에서 고유값 3의 기하적 중복도(고유공간의 차원)는?`, ans: '1', ansTex: R`1`,
        sol: R`$A-3I=\begin{pmatrix}0&1&0\\0&0&1\\0&0&0\end{pmatrix}$의 계수가 2이므로 영공간의 차원은 1. 대수적 중복도는 3이라 대각화되지 않습니다.` },
      { sec: '8.1', type: 'num', lv: 3, q: R`$A=\begin{pmatrix}0&1&0\\0&0&1\\6&-11&6\end{pmatrix}$의 가장 큰 고유값은?`, ans: '3', ansTex: R`3`,
        sol: R`동반행렬이므로 특성방정식은 $\lambda^3-6\lambda^2+11\lambda-6=(\lambda-1)(\lambda-2)(\lambda-3)=0$. (합 $6=\tr A$로 검산)` },
      { sec: '8.1', type: 'open', lv: 2, q: R`$\begin{pmatrix}1&2\\2&4\end{pmatrix}$의 고유값과 고유벡터를 구하세요.`,
        sol: R`
$\lambda^2-5\lambda=0$에서 $\lambda=0,5$ (행렬식이 0이므로 0이 고유값).
$\lambda=0$: $x_1+2x_2=0$ → $(2,-1)^T$. $\lambda=5$: $-4x_1+2x_2=0$ → $(1,2)^T$. 두 벡터는 직교합니다(대칭행렬).` },
      { sec: '8.2', type: 'num', lv: 2, q: R`마르코프 행렬 $\begin{pmatrix}0.9&0.2\\0.1&0.8\end{pmatrix}$ (열의 합 1)의 정상상태 분포에서 첫째 상태의 비율은?`, ans: '2/3', ansTex: R`\tfrac23`,
        sol: R`$\lambda=1$: $-0.1x_1+0.2x_2=0$ → $(2,1)$. 합이 1이 되게 하면 $(\tfrac23,\tfrac13)$.` },
      { sec: '8.2', type: 'num', lv: 2, q: R`탄성막을 $\mathbf y=A\mathbf x$, $A=\begin{pmatrix}5&3\\3&5\end{pmatrix}$로 늘릴 때 주방향으로의 최대 늘림 배율은?`, ans: '8', ansTex: R`8`,
        sol: R`주방향은 고유벡터 방향이고 배율은 고유값입니다. $\lambda=8$ (방향 $(1,1)$), $\lambda=2$ (방향 $(1,-1)$).` },
      { sec: '8.2', type: 'num', lv: 3, q: R`개체군 모델 $\mathbf x_{k+1}=\begin{pmatrix}0&4\\0.5&0\end{pmatrix}\mathbf x_k$에서 장기적인 한 세대당 성장률(지배 고유값의 절댓값)은?`, ans: 'sqrt(2)', ansTex: R`\sqrt2\approx1.414`,
        sol: R`$\lambda^2-2=0$에서 $\lambda=\pm\sqrt2$. 개체 수는 두 세대마다 2배, 한 세대당 평균 $\sqrt2$배.` },
      { sec: '8.3', type: 'mc', lv: 1, q: R`다음 중 직교행렬은?`,
        choices: [R`$\begin{pmatrix}0&1\\1&0\end{pmatrix}$`, R`$\begin{pmatrix}1&1\\0&1\end{pmatrix}$`, R`$\begin{pmatrix}2&0\\0&\tfrac12\end{pmatrix}$`, R`$\begin{pmatrix}1&2\\2&1\end{pmatrix}$`], ans: 0,
        sol: R`①은 열이 정규직교($A^TA=I$)인 치환행렬. ③은 행렬식이 1이지만 길이를 바꾸므로 직교가 아닙니다.` },
      { sec: '8.3', type: 'num', lv: 2, q: R`60° 회전행렬 $\begin{pmatrix}\cos60^\circ&-\sin60^\circ\\\sin60^\circ&\cos60^\circ\end{pmatrix}$의 고유값의 실수부는?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`회전행렬의 고유값은 $e^{\pm i\theta}=\cos\theta\pm i\sin\theta$. 실수부는 $\cos60^\circ=\tfrac12$.` },
      { sec: '8.3', type: 'mc', lv: 2, q: R`$3\times3$ 실반대칭행렬 $A$의 행렬식은?`,
        choices: [R`항상 0`, R`항상 1`, R`항상 양수`, R`행렬에 따라 다르다`], ans: 0,
        sol: R`$\det A=\det A^T=\det(-A)=(-1)^3\det A=-\det A$이므로 $\det A=0$. (고유값 $0,\pm i\beta$로도 확인)` },
      { sec: '8.3', type: 'num', lv: 2, q: R`$\begin{pmatrix}0&2\\-2&0\end{pmatrix}$의 고유값의 절댓값은?`, ans: '2', ansTex: R`2`,
        sol: R`$\lambda^2+4=0$에서 $\lambda=\pm2i$ (반대칭이라 순허수). 절댓값 2.` },
      { sec: '8.3', type: 'num', lv: 3, q: R`$A=\tfrac13\begin{pmatrix}1&2&2\\2&1&-2\\2&-2&1\end{pmatrix}$일 때 $A^{-1}$의 (1,2) 성분은?`, ans: '2/3', ansTex: R`\tfrac23`,
        sol: R`행들이 정규직교이므로(예: $1\cdot2+2\cdot1+2\cdot(-2)=0$) $A$는 직교행렬이고 $A^{-1}=A^T$. $A$가 대칭이라 $A^{-1}=A$, (1,2) 성분 $\tfrac23$.` },
      { sec: '8.4', type: 'num', lv: 2, q: R`$A=\begin{pmatrix}2&1\\1&2\end{pmatrix}$일 때 $A^5$의 (1,1) 성분은?`, ans: '122', ansTex: R`122`,
        sol: R`고유값 $3$ ($(1,1)$), $1$ ($(1,-1)$)로 대각화하면 $(A^n)_{11}=\dfrac{3^n+1}2$. $n=5$이면 $\dfrac{244}2=122$.` },
      { sec: '8.4', type: 'mc', lv: 2, q: R`닮은 행렬 $B=P^{-1}AP$와 $A$가 항상 공유하는 것은?`,
        choices: [R`고유값`, R`고유벡터`, R`모든 성분`, R`열공간`], ans: 0,
        sol: R`특성다항식이 같으므로 고유값(따라서 대각합, 행렬식)이 같습니다. 고유벡터는 $P^{-1}\mathbf x$로 바뀝니다.` },
      { sec: '8.4', type: 'num', lv: 2, q: R`단위원 $x_1^2+x_2^2=1$ 위에서 $Q=2x_1^2+2x_1x_2+2x_2^2$의 최솟값은?`, ans: '1', ansTex: R`1`,
        sol: R`$Q=\mathbf x^T\begin{pmatrix}2&1\\1&2\end{pmatrix}\mathbf x$, 고유값 $3,1$. 주축 좌표에서 $Q=3y_1^2+y_2^2$이고 $y_1^2+y_2^2=1$이므로 최솟값은 가장 작은 고유값 1.` },
      { sec: '8.4', type: 'mc', lv: 2, q: R`양의 정부호 행렬은?`,
        choices: [R`$\begin{pmatrix}2&-1\\-1&2\end{pmatrix}$`, R`$\begin{pmatrix}1&2\\2&1\end{pmatrix}$`, R`$\begin{pmatrix}0&1\\1&0\end{pmatrix}$`, R`$\begin{pmatrix}1&0\\0&-1\end{pmatrix}$`], ans: 0,
        sol: R`①의 고유값은 $1,3$ (모두 양수). 판정식으로도 $a=2>0$, $ac-b^2=3>0$. ②는 $3,-1$, ③은 $\pm1$, ④는 $1,-1$.` },
      { sec: '8.4', type: 'num', lv: 3, q: R`$3x_1^2-2x_1x_2+3x_2^2=8$이 나타내는 타원의 긴반지름은?`, ans: '2', ansTex: R`2`,
        sol: R`$A=\begin{pmatrix}3&-1\\-1&3\end{pmatrix}$, 고유값 $2,4$. $2y_1^2+4y_2^2=8$, 즉 $\frac{y_1^2}{4}+\frac{y_2^2}{2}=1$. 반지름은 $2$와 $\sqrt2$.` },
      { sec: '8.4', type: 'open', lv: 3, q: R`$A=\begin{pmatrix}1&3\\0&2\end{pmatrix}$를 대각화하세요 ($X$, $D$, $X^{-1}$).`,
        sol: R`
삼각행렬이라 고유값 $1,2$. $\lambda=1$: $3x_2=0$ → $(1,0)^T$. $\lambda=2$: $-x_1+3x_2=0$ → $(3,1)^T$.
$$X=\begin{pmatrix}1&3\\0&1\end{pmatrix},\quad D=\begin{pmatrix}1&0\\0&2\end{pmatrix},\quad X^{-1}=\begin{pmatrix}1&-3\\0&1\end{pmatrix}$$
검산: $XDX^{-1}=\begin{pmatrix}1&6\\0&2\end{pmatrix}\begin{pmatrix}1&-3\\0&1\end{pmatrix}=\begin{pmatrix}1&3\\0&2\end{pmatrix}$ ✓` },
      { sec: '8.5', type: 'num', lv: 2, q: R`에르미트 행렬 $\begin{pmatrix}2&1-i\\1+i&3\end{pmatrix}$의 큰 고유값은?`, ans: '4', ansTex: R`4`,
        sol: R`$(2-\lambda)(3-\lambda)-(1-i)(1+i)=\lambda^2-5\lambda+4=0$에서 $\lambda=1,4$. 에르미트이므로 실수입니다.` },
      { sec: '8.5', type: 'mc', lv: 2, q: R`$A=\dfrac1{\sqrt2}\begin{pmatrix}1&i\\i&1\end{pmatrix}$는?`,
        choices: [R`유니터리 행렬`, R`에르미트 행렬`, R`반에르미트 행렬`, R`셋 다 아니다`], ans: 0,
        sol: R`$\bar A^T=\dfrac1{\sqrt2}\begin{pmatrix}1&-i\\-i&1\end{pmatrix}$이고 $A\bar A^T=\tfrac12\begin{pmatrix}2&0\\0&2\end{pmatrix}=I$. $\bar A^T\ne\pm A$이므로 에르미트·반에르미트는 아닙니다.` },
    ],
  });
})();
