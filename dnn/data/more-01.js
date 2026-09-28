/* 추가 연습문제 — 01 선형회귀와 정규방정식. Problem Set처럼 “유도하고 증명하라”는 문항을 중심으로 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 1,
    problems: [
      { sec: '1.1', type: 'mc', lv: 1, q: R`다음 중 (계수 $\beta$에 대해) **선형회귀 모델이 아닌** 것은?`,
        choices: [R`$y=\beta_0+\beta_1x+\beta_2x^2+\varepsilon$`, R`$y=\beta_0+\beta_1\sin x+\beta_2\log x+\varepsilon$`, R`$y=\beta_0+\beta_1e^{\beta_2x}+\varepsilon$`, R`$y=\beta_1x_1+\beta_2x_1x_2+\varepsilon$`], ans: 2,
        sol: R`“선형”은 $\beta$에 대해 선형이라는 뜻입니다. $x^2$, $\sin x$, $x_1x_2$는 설계행렬의 열로 넣으면 되지만 $e^{\beta_2x}$는 $\beta_2$가 지수에 들어가 $\beta$에 대해 비선형입니다.` },
      { sec: '1.2', type: 'num', lv: 1, q: R`$g(\beta)=\beta^TA\beta+c^T\beta$, $A=\begin{pmatrix}2&1\\3&4\end{pmatrix}$, $c=(1,-1)^T$일 때 $\beta=(1,2)^T$에서 $\partial g/\partial\beta_2$는?`, ans: '19', ansTex: R`19`,
        sol: R`$\nabla g=(A+A^T)\beta+c$. $A+A^T=\begin{pmatrix}4&4\\4&8\end{pmatrix}$, $(A+A^T)\beta=(12,20)^T$, 더하면 $(13,19)^T$. 둘째 성분은 19.` },
      { sec: '1.3', type: 'num', lv: 1, q: R`자료 $(1,2),(2,3),(3,5),(4,6)$에 $y=\beta_0+\beta_1x$를 최소제곱으로 맞출 때 $\hat\beta_1$은?`, ans: '1.4', ansTex: R`1.4`,
        sol: R`$\bar x=2.5$, $\bar y=4$. $S_{xx}=2.25+0.25+0.25+2.25=5$, $S_{xy}=(-1.5)(-2)+(-0.5)(-1)+(0.5)(1)+(1.5)(2)=7$. $\hat\beta_1=7/5=1.4$, $\hat\beta_0=4-1.4(2.5)=0.5$.` },
      { sec: '1.4', type: 'num', lv: 2, q: R`위 자료에서 결정계수 $R^2=1-\mathrm{SSE}/S_{yy}$는?`, ans: '0.98', ansTex: R`0.98`,
        sol: R`예측 $0.5+1.4x=(1.9,3.3,4.7,6.1)$, 잔차 $(0.1,-0.3,0.3,-0.1)$, $\mathrm{SSE}=0.2$. $S_{yy}=4+1+1+4=10$. $R^2=1-0.02=0.98$.` },
      { sec: '1.5', type: 'num', lv: 2, q: R`위 자료에서 슬라이드 규칙 $\beta\leftarrow\beta+\alpha X^T(y-X\beta)$가 수렴하는 학습률의 상한 $2/\lambda_{\max}(X^TX)$는? (소수 넷째 자리)`, ans: '2/(17+sqrt(269))', ansTex: R`\tfrac{2}{17+\sqrt{269}}\approx0.0599`,
        sol: R`$X^TX=\begin{pmatrix}4&10\\10&30\end{pmatrix}$, 대각합 34, 행렬식 20. 고윳값 $17\pm\sqrt{289-20}=17\pm\sqrt{269}$, 최댓값 $\approx33.40$. 상한 $2/33.40\approx0.0599$.` },
      { sec: '1.3', type: 'mc', lv: 2, q: R`키를 cm로 잰 열과 m로 잰 열을 둘 다 설계행렬에 넣었다. 옳은 것은?`,
        choices: [R`$X^TX$가 가역이고 해가 하나다`, R`$X^TX$가 가역이 아니고, 정규방정식의 해가 무수히 많지만 예측값 $\hat y$는 모두 같다`, R`정규방정식의 해가 없다`, R`제곱오차합이 0이 된다`], ans: 1,
        sol: R`두 열이 비례(100배)하므로 일차종속, $X^TX$는 특이행렬입니다. 정규방정식은 항상 해가 있고(열공간으로의 정사영은 존재), 해가 무수히 많지만 $X\beta$는 모두 같은 정사영 $\hat y$입니다.` },
      { sec: '1.2', type: 'open', lv: 2, proof: true, q: R`$A\in\mathbb R^{m\times p}$, $b\in\mathbb R^m$일 때 $\nabla_\beta\lVert A\beta-b\rVert^2=2A^T(A\beta-b)$임을 (i) 전개와 두 미분 공식으로, (ii) 성분 계산으로 각각 보이세요.`,
        sol: R`
**(i)** $\lVert A\beta-b\rVert^2=(A\beta-b)^T(A\beta-b)=\beta^TA^TA\beta-\beta^TA^Tb-b^TA\beta+b^Tb$. $b^TA\beta$는 스칼라라 $\beta^TA^Tb$와 같으므로 $=\beta^T(A^TA)\beta-2\beta^T(A^Tb)+b^Tb$.
$A^TA$는 대칭이므로 $\nabla(\beta^TA^TA\beta)=2A^TA\beta$, $\nabla(\beta^TA^Tb)=A^Tb$. 합하면 $2A^TA\beta-2A^Tb=2A^T(A\beta-b)$.

**(ii)** $r=A\beta-b$, $r_i=\sum_jA_{ij}\beta_j-b_i$. $\lVert r\rVert^2=\sum_ir_i^2$이므로
$$\frac{\partial}{\partial\beta_l}\sum_ir_i^2=\sum_i2r_i\frac{\partial r_i}{\partial\beta_l}=2\sum_ir_iA_{il}=2(A^Tr)_l.$$
모으면 $2A^Tr=2A^T(A\beta-b)$.`,
        rubric: R`
- 전개와 스칼라 전치로 교차항 합치기 — 3점
- 두 공식 적용 ($A^TA$의 대칭성 언급) — 3점
- 성분 계산에서 연쇄법칙과 $(A^Tr)_l$ 인식 — 4점` },
      { sec: '1.3', type: 'open', lv: 3, proof: true, q: R`$X\in\mathbb R^{n\times p}$의 열이 일차독립일 때 (i) $X^TX$가 양의 정부호임을 보이고, (ii) 그로부터 $X^TX$가 가역이며 (iii) $f(\beta)=\lVert y-X\beta\rVert^2$의 최솟점이 유일함을 보이세요.`,
        sol: R`
**(i)** 임의의 $v\ne0$에 대해 $v^TX^TXv=(Xv)^T(Xv)=\lVert Xv\rVert^2\ge0$. 열이 일차독립이면 $Xv=\sum_jv_jX_{:,j}=0$은 $v=0$일 때뿐이므로 $v\ne0$이면 $\lVert Xv\rVert^2>0$. 따라서 $X^TX\succ0$.

**(ii)** $X^TXv=0$이면 $v^TX^TXv=0$이고 (i)에서 $v=0$. 영공간이 자명하므로 정사각행렬 $X^TX$는 가역.

**(iii)** 헤시안 $\nabla^2f=2X^TX\succ0$이므로 $f$는 강볼록입니다. 구체적으로 1.3절의 분해 $f(\beta)=f(\hat\beta)+(\beta-\hat\beta)^TX^TX(\beta-\hat\beta)$에서 $\beta\ne\hat\beta$이면 둘째 항이 양수라 $f(\beta)>f(\hat\beta)$. 최솟점은 $\hat\beta=(X^TX)^{-1}X^Ty$ 하나뿐입니다.

(분해의 근거: $y-X\beta=(y-X\hat\beta)+X(\hat\beta-\beta)$이고 정규방정식 $X^T(y-X\hat\beta)=0$ 때문에 교차항이 사라짐.)`,
        rubric: R`
- $v^TX^TXv=\lVert Xv\rVert^2$ — 2점
- 일차독립에서 $Xv=0\Rightarrow v=0$ — 3점
- 가역성 — 2점
- 유일성(강볼록 또는 분해식) — 3점` },
      { sec: '1.3', type: 'open', lv: 3, proof: true, q: R`단순회귀 $y_i=\beta_0+\beta_1x_i+\varepsilon_i$의 정규방정식을 성분으로 쓰고, 그로부터 $\hat\beta_1=S_{xy}/S_{xx}$, $\hat\beta_0=\bar y-\hat\beta_1\bar x$를 유도하세요. ($S_{xy}=\sum(x_i-\bar x)(y_i-\bar y)$, $S_{xx}=\sum(x_i-\bar x)^2>0$)`,
        sol: R`
$X^TX=\begin{pmatrix}n&\sum x_i\\\sum x_i&\sum x_i^2\end{pmatrix}$, $X^Ty=\begin{pmatrix}\sum y_i\\\sum x_iy_i\end{pmatrix}$이므로 정규방정식은
$$n\beta_0+\beta_1\sum x_i=\sum y_i,\qquad \beta_0\sum x_i+\beta_1\sum x_i^2=\sum x_iy_i.$$
첫 식을 $n$으로 나누면 $\beta_0=\bar y-\beta_1\bar x$. 둘째 식에 넣으면
$$(\bar y-\beta_1\bar x)n\bar x+\beta_1\sum x_i^2=\sum x_iy_i\iff\beta_1\Big(\sum x_i^2-n\bar x^2\Big)=\sum x_iy_i-n\bar x\bar y.$$
$\sum x_i^2-n\bar x^2=\sum(x_i-\bar x)^2=S_{xx}$, $\sum x_iy_i-n\bar x\bar y=\sum(x_i-\bar x)(y_i-\bar y)=S_{xy}$이므로 $\hat\beta_1=S_{xy}/S_{xx}$. ($S_{xx}>0$은 $x_i$가 모두 같지 않다는 것, 즉 $X$의 두 열이 독립이라는 조건입니다.)`,
        rubric: R`
- 정규방정식의 성분 표현 — 3점
- 첫 식에서 $\beta_0$ 소거 — 2점
- 편차 곱의 합으로 정리하는 두 항등식 — 4점
- $S_{xx}>0$의 의미 — 1점` },
      { sec: '1.3', type: 'open', lv: 2, proof: true, q: R`설계행렬에 모두 1인 열이 있을 때 최소제곱 잔차 $r=y-X\hat\beta$가 (i) $\sum_ir_i=0$, (ii) $\sum_ir_i\hat y_i=0$을 만족함을 보이세요.`,
        sol: R`
정규방정식 $X^T(y-X\hat\beta)=X^Tr=0$은 $X$의 **모든 열**과 $r$의 내적이 0이라는 뜻입니다.
**(i)** 1로 된 열 $\mathbf 1$에 대해 $\mathbf 1^Tr=\sum r_i=0$.
**(ii)** $\hat y=X\hat\beta$는 열들의 일차결합이므로 $\hat y^Tr=\hat\beta^TX^Tr=\hat\beta^T0=0$.
(따라서 $\sum y_i=\sum\hat y_i$이고, $y=\hat y+r$은 직교 분해라 $\lVert y\rVert^2=\lVert\hat y\rVert^2+\lVert r\rVert^2$.)`,
        rubric: R`
- 정규방정식을 “열과의 직교”로 해석 — 4점
- (i) — 3점
- (ii) — 3점` },
      { sec: '1.5', type: 'open', lv: 3, proof: true, q: R`슬라이드 규칙 $\beta_{t+1}=\beta_t+\alpha X^T(y-X\beta_t)$에 대해 $e_t=\beta_t-\hat\beta$가 $e_{t+1}=(I-\alpha X^TX)e_t$를 만족함을 보이고, $X^TX\succ0$일 때 모든 초기값에서 수렴할 필요충분조건이 $0<\alpha<2/\lambda_{\max}(X^TX)$임을 증명하세요.`,
        sol: R`
정규방정식 $X^Ty=X^TX\hat\beta$를 쓰면 $X^T(y-X\beta_t)=X^TX\hat\beta-X^TX\beta_t=-X^TXe_t$. 양변에서 $\hat\beta$를 빼면 $e_{t+1}=e_t-\alpha X^TXe_t=(I-\alpha X^TX)e_t$, 따라서 $e_t=(I-\alpha X^TX)^te_0$.
$X^TX=Q\Lambda Q^T$ (직교 $Q$, $\Lambda=\operatorname{diag}(\lambda_i)$, $\lambda_i>0$)로 대각화하고 $u_t=Q^Te_t$로 두면 $u_{t,i}=(1-\alpha\lambda_i)^tu_{0,i}$. 모든 $u_0$에서 $u_t\to0$일 필요충분조건은 모든 $i$에서 $\lvert1-\alpha\lambda_i\rvert<1$, 즉 $0<\alpha\lambda_i<2$. 가장 센 조건은 $\lambda_{\max}$에서 나오므로 $0<\alpha<2/\lambda_{\max}$. ($\alpha=2/\lambda_{\max}$이면 그 방향 성분이 $(-1)^t$로 진동해 수렴하지 않습니다.)`,
        rubric: R`
- 정규방정식으로 오차 점화식 유도 — 3점
- 고유분해로 성분별 분리 — 3점
- $\lvert1-\alpha\lambda_i\rvert<1$에서 조건 도출(필요·충분 모두) — 4점` },
    ],
  });
})();
