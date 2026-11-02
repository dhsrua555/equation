/* Quiz 2 대비 모의고사 A·B·C — 8주차 수요일–9주차 수요일(17–20단원)과 실습 코드(15.7절). 연습문제와 겹치지 않는 별도 문항이고,
   서술형에는 채점 기준을 붙였습니다. manifest에서 exams.js 앞에 두어 모의고사 페이지에서 Quiz 2 묶음이 먼저 보이게 합니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  const G = 'Quiz 2 대비 · 8주차 수–9주차 수';
  EM.exams.push(
  {
    id: 'q2a', roman: 'A', group: G,
    groupDesc: '17–20단원(보편 근사 정리, 바론 정리와 일반화, RNN과 시간 역전파, LSTM과 응용) 범위입니다. 9주차 수요일 필기에 ‘Quiz 2 (11/04)’ 표시가 있던 두 단계 RNN의 기울기는 A에, 근사·일반화의 필기 증명은 B에, 전 범위의 짧은 문항과 유도는 C에 모았습니다.',
    kind: 'Quiz 2 실전형 · RNN', title: 'RNN의 기울기와 LSTM', scopeText: '19–20 단원',
    desc: '필기에 Quiz 2 표시가 있던 두 단계 RNN의 기울기를 처음부터 쓰고, 벡터 BPTT의 소실·폭발, 기울기 잘라내기, LSTM 셀 경로를 증명합니다.',
    minutes: 50, plot: 'rnngrad',
    problems: [
      { ch: 'ch19', type: 'open', lv: 3, pts: 40, q: R`스칼라 RNN $h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$ ($t=1,2$)와 손실 $L=L_1+L_2$, $L_t=\frac12(Y_t-Z_t)^2$을 생각하자. 초기 상태 $h_0$은 주어진 상수이고 $0$이 아닐 수 있다.
1. 순전파를 $a_t$, $h_t$, $Y_t$로 쓰고, 국소 미분 $\partial h_t/\partial a_t$와 $\partial h_2/\partial h_1$을 $h_t$로 나타내시오.
2. $\partial L/\partial V$와 $\partial L/\partial c$를 구하시오.
3. $W$에서 $L$로 가는 경로를 모두 적고 $\partial L/\partial W$를 구하시오.
4. $\partial L/\partial U$와 $\partial L/\partial b$를 구하시오.
5. $h_0=0$이면 3의 어느 항이 사라지는지 쓰시오.`,
        sol: R`
**1.** $a_t=Wh_{t-1}+UX_t+b$, $h_t=\tanh a_t$, $Y_t=Vh_t+c$. $\frac{\partial h_t}{\partial a_t}=1-\tanh^2a_t=1-h_t^2$이고 $\frac{\partial h_2}{\partial h_1}=(1-h_2^2)W$.
**2.** $L_t$는 $Y_t$를 통해서만 $V$, $c$에 의존하므로 $\frac{\partial L}{\partial V}=\sum_{t=1}^2(Y_t-Z_t)h_t$, $\frac{\partial L}{\partial c}=\sum_{t=1}^2(Y_t-Z_t)$.
**3.** 경로는 ① $W\to a_1\to h_1\to Y_1\to L_1$, ② $W\to a_2\to h_2\to Y_2\to L_2$, ③ $W\to a_1\to h_1\to a_2\to h_2\to Y_2\to L_2$의 셋입니다. 경로마다 연쇄법칙의 곱을 더하면
$$\frac{\partial L}{\partial W}=(Y_1-Z_1)V(1-h_1^2)h_0+(Y_2-Z_2)V(1-h_2^2)h_1+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0.$$
**4.** 각 항의 마지막 인수 $\partial a_s/\partial W=h_{s-1}$을 $\partial a_s/\partial U=X_s$, $\partial a_s/\partial b=1$로 바꾸면
$$\frac{\partial L}{\partial U}=(Y_1-Z_1)V(1-h_1^2)X_1+(Y_2-Z_2)V(1-h_2^2)X_2+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)X_1,$$
$$\frac{\partial L}{\partial b}=(Y_1-Z_1)V(1-h_1^2)+(Y_2-Z_2)V(1-h_2^2)+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2).$$
$\delta_2=(Y_2-Z_2)V(1-h_2^2)$, $\delta_1=\big[(Y_1-Z_1)V+\delta_2W\big](1-h_1^2)$로 묶으면 $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1$, $\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2$, $\frac{\partial L}{\partial b}=\delta_1+\delta_2$입니다.
**5.** $h_0$이 곱해진 첫째·셋째 항이 사라져 $\frac{\partial L}{\partial W}=(Y_2-Z_2)V(1-h_2^2)h_1$만 남습니다. $\partial L/\partial U$와 $\partial L/\partial b$의 세 항은 그대로 남습니다.`,
        rubric: R`
- 1. 순전파, $\tanh'=1-h^2$, $\partial h_2/\partial h_1=(1-h_2^2)W$ — 6점
- 2. $V$와 $c$의 기울기 — 6점
- 3. 세 경로를 빠짐없이 적고 경로마다 연쇄법칙의 곱 — 14점
- 4. $U$와 $b$의 기울기(각각 세 항) — 10점
- 5. $h_0=0$일 때 남는 항 — 4점` },
      { ch: 'ch19', type: 'num', lv: 2, pts: 10, q: R`1번의 RNN에서 $W=1$, $U=\frac12$, $V=1$, $b=c=0$, $h_0=0$, $X=(2,0)$, $Z=(0,0)$일 때 $\partial L/\partial W$는? (소수 셋째 자리까지, 식으로 입력해도 됩니다)`, ans: 'tanh(tanh(1))*(1-tanh(tanh(1))^2)*tanh(1)', ansTex: R`\tanh(h_1)\big(1-\tanh^2h_1\big)h_1\approx0.287`,
        sol: R`$a_1=1$, $h_1=\tanh1\approx0.7616$, $a_2=h_1$, $h_2=\tanh(0.7616)\approx0.6420$, $Y_t=h_t$. $h_0=0$이라 둘째 항만 남습니다: $(Y_2-Z_2)V(1-h_2^2)h_1=0.6420\cdot0.5878\cdot0.7616\approx0.287$.` },
      { ch: 'ch19', type: 'num', lv: 2, pts: 10, q: R`같은 설정에서 $\partial L/\partial U$는? (소수 셋째 자리까지, 식으로 입력해도 됩니다)`, ans: '2*(1-tanh(1)^2)*(tanh(1)+tanh(tanh(1))*(1-tanh(tanh(1))^2))', ansTex: R`2(1-h_1^2)\big[h_1+h_2(1-h_2^2)\big]\approx0.957`,
        sol: R`$X_2=0$이라 둘째 항이 사라지고 $(Y_1-Z_1)V(1-h_1^2)X_1+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)X_1=2(1-h_1^2)\big[h_1+h_2(1-h_2^2)\big]=2(0.4200)(0.7616+0.3774)\approx0.957$. 중심 차분으로도 같은 값이 나옵니다.` },
      { ch: 'ch19', type: 'open', lv: 3, pts: 25, q: R`$\mathbf h_t=\tanh(W\mathbf h_{t-1}+U\mathbf x_t+\mathbf b)\in\mathbb R^n$ ($t=1,\dots,T$)이고 손실 $L$이 $\mathbf h_T$에만 의존한다.
1. $\frac{\partial\mathbf h_t}{\partial\mathbf h_{t-1}}=\diag(\mathbf 1-\mathbf h_t^{\odot2})\,W$임을 보이고, 행벡터 기울기로 $\frac{\partial L}{\partial\mathbf h_t}$를 야코비안의 곱으로 쓰시오(곱의 순서에 주의).
2. $\Big\lVert\frac{\partial L}{\partial\mathbf h_t}\Big\rVert\le\Big\lVert\frac{\partial L}{\partial\mathbf h_T}\Big\rVert\,\lVert W\rVert_2^{\,T-t}$를 보이고, $\lVert W\rVert_2<1$일 때 무슨 일이 생기는지 쓰시오.
3. 임계값 $v$의 기울기 잘라내기 $\mathbf g\leftarrow\min\big(1,\frac v{\lVert\mathbf g\rVert}\big)\mathbf g$ 뒤의 노름이 $\min(\lVert\mathbf g\rVert,v)$이고 방향이 바뀌지 않음을 보이시오. 이것이 기울기 소실은 해결하지 못하는 이유도 쓰시오.`,
        sol: R`
**1.** $\mathbf a_t=W\mathbf h_{t-1}+U\mathbf x_t+\mathbf b$, $\mathbf h_t=\tanh(\mathbf a_t)$ (성분별)이므로 $\frac{\partial\mathbf h_t}{\partial\mathbf a_t}=\diag(1-h_{t,i}^2)$, $\frac{\partial\mathbf a_t}{\partial\mathbf h_{t-1}}=W$이고 곱하면 $\diag(\mathbf 1-\mathbf h_t^{\odot2})W$. $L$은 $\mathbf h_T$에만 의존하고 $\mathbf h_T$는 $\mathbf h_{T-1},\dots$을 차례로 거쳐서만 $\mathbf h_t$에 의존하므로
$$\frac{\partial L}{\partial\mathbf h_t}=\frac{\partial L}{\partial\mathbf h_T}\,\frac{\partial\mathbf h_T}{\partial\mathbf h_{T-1}}\cdots\frac{\partial\mathbf h_{t+1}}{\partial\mathbf h_t},$$
곧 왼쪽부터 $k=T,T-1,\dots,t+1$의 $\diag(\mathbf 1-\mathbf h_k^{\odot2})W$를 곱합니다.
**2.** $|1-h^2|\le1$이므로 $\lVert\diag(\mathbf 1-\mathbf h_k^{\odot2})\rVert_2\le1$이고, 연산자 노름의 곱 부등식으로 각 인수의 노름은 $\lVert W\rVert_2$ 이하입니다. 따라서 $\big\lVert\frac{\partial L}{\partial\mathbf h_t}\big\rVert\le\big\lVert\frac{\partial L}{\partial\mathbf h_T}\big\rVert\lVert W\rVert_2^{T-t}$. $\lVert W\rVert_2<1$이면 $T-t$가 커질수록 지수적으로 $0$에 가까워져(기울기 소실), 먼 과거의 입력 $\mathbf x_t$가 손실에 주는 영향을 학습하지 못합니다.
**3.** $\lVert\mathbf g\rVert\le v$이면 계수가 1이라 그대로이고, $\lVert\mathbf g\rVert>v$이면 계수 $v/\lVert\mathbf g\rVert$를 곱해 노름이 $v$가 됩니다. 두 경우 모두 노름은 $\min(\lVert\mathbf g\rVert,v)$이고, 양수를 곱했을 뿐이라 방향 $\mathbf g/\lVert\mathbf g\rVert$는 같습니다. 잘라내기는 크기를 위에서 막을 뿐 작은 기울기를 키우지 않으므로 소실에는 소용이 없습니다(슬라이드 15의 max는 min이어야 합니다). 소실은 LSTM 같은 구조로 다룹니다.`,
        rubric: R`
- 1. 한 단계 야코비안과 곱의 순서 — 8점
- 2. $\lVert\diag\rVert\le1$, 노름의 곱 부등식, 소실의 해석 — 9점
- 3. 두 경우의 노름과 방향 보존, 소실에 소용없는 이유 — 8점` },
      { ch: 'ch20', type: 'open', lv: 2, pts: 15, q: R`LSTM의 셀 상태 $\mathbf c_t=\mathbf f_t\odot\mathbf c_{t-1}+\mathbf i_t\odot\mathbf g_t$에 대해 답하시오.
1. 게이트 $\mathbf f_t$, $\mathbf i_t$, $\mathbf g_t$를 고정한 셀 경로의 미분 $\frac{\partial\mathbf c_t}{\partial\mathbf c_{t-1}}$과, 이것을 $k$걸음 곱한 $\frac{\partial\mathbf c_t}{\partial\mathbf c_{t-k}}$를 쓰시오.
2. 망각 게이트가 모든 성분에서 줄곧 $0.95$이면 50걸음 뒤 셀 경로의 배율은 얼마인가? 한 걸음 인수가 $0.7$인 바닐라 RNN 경로와 비교하시오.
3. 이것이 기울기 소실이 ‘없음’을 보장하지는 않는 이유를 한 가지 쓰시오.`,
        sol: R`
**1.** 성분별 곱이므로 $\frac{\partial\mathbf c_t}{\partial\mathbf c_{t-1}}=\diag(\mathbf f_t)$이고, 곱하면 $\frac{\partial\mathbf c_t}{\partial\mathbf c_{t-k}}=\diag\big(\mathbf f_t\odot\mathbf f_{t-1}\odot\cdots\odot\mathbf f_{t-k+1}\big)$. 바닐라 RNN과 달리 행렬 $W$가 곱해지지 않습니다.
**2.** $0.95^{50}\approx0.077$, $0.7^{50}\approx1.8\times10^{-8}$. 셀 경로가 수백만 배 많은 기울기를 보존합니다.
**3.** 예를 들어 망각 게이트가 작게 학습되면 $\prod\mathbf f$도 지수적으로 줄어듭니다. 또는 게이트와 후보 $\mathbf g_t$가 $\mathbf h_{t-1}=\mathbf o_{t-1}\odot\tanh(\mathbf c_{t-1})$을 통해 $\mathbf c_{t-1}$에 의존하므로, 전체 야코비안에는 셀 경로 말고도 항이 더 있습니다. 둘 중 하나면 충분합니다.`,
        rubric: R`
- 1. $\diag(\mathbf f_t)$와 $k$걸음의 곱 — 6점
- 2. 두 배율의 계산과 비교 — 5점
- 3. 보장이 아닌 이유 — 4점` },
    ],
  },
  {
    id: 'q2b', roman: 'B', group: G,
    kind: 'Quiz 2 실전형 · 근사와 일반화', title: 'Cybenko, Maurey, 라데마허', scopeText: '17–18 단원',
    desc: '보편 근사 정리의 귀류법 증명, Maurey 보조정리의 확률적 증명, 바론 정리의 뉴런 수, 선형 함수족의 라데마허 복잡도를 봅니다.',
    minutes: 50, plot: 'barron',
    problems: [
      { ch: 'ch17', type: 'open', lv: 3, pts: 30, q: R`$I_n=[0,1]^n$이고 $\sigma$는 연속인 판별 함수라 하자. 다음 사실은 써도 좋다.
**(보조정리 4)** $U$가 $C(I_n)$의 선형 부분공간이고 $\overline U\ne C(I_n)$이면, 모든 $h\in U$에서 $\int_{I_n}h\,d\mu=0$인 부호 측도 $\mu\in M(I_n)$, $\mu\ne0$이 있다.
1. ‘$\sigma$가 판별 함수’의 정의를 쓰시오.
2. $U=\big\{\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)\big\}$가 $C(I_n)$의 선형 부분공간임을 보이시오.
3. 귀류법으로 $U$가 $C(I_n)$에서 조밀함을 증명하시오.
4. 이 정리가 은닉층 하나짜리 신경망에 대해 말하는 것과 말하지 않는 것을 하나씩 쓰시오.`,
        sol: R`
**1.** $\mu\in M(I_n)$이 모든 $w\in\mathbb R^n$, $\theta\in\mathbb R$에서 $\int_{I_n}\sigma(w^Tx+\theta)\,d\mu(x)=0$을 만족하면 $\mu=0$일 때, $\sigma$를 판별 함수라 한다.
**2.** $\sigma$가 연속이므로 $x\mapsto\sigma(w^Tx+\theta)$는 $C(I_n)$의 원소입니다. 두 유한합의 합은 항을 이어 붙인 유한합이고, 실수배는 $\alpha_j$에 곱한 유한합이라 다시 $U$에 있습니다. $0$도 $\alpha_1=0$으로 들어 있습니다.
**3.** $\overline U\ne C(I_n)$이라 가정합니다(조밀하지 않음 = 닫힘이 전체가 아님). 보조정리 4로 $\mu\ne0$이 있어 모든 $h\in U$에서 $\int h\,d\mu=0$입니다. 특히 $N=1$, $\alpha_1=1$인 $h(x)=\sigma(w^Tx+\theta)$도 $U$에 있으므로 모든 $w,\theta$에서 $\int\sigma(w^Tx+\theta)\,d\mu=0$. $\sigma$가 판별 함수이므로 $\mu=0$이 되어 모순입니다. 따라서 $\overline U=C(I_n)$, 곧 모든 $f\in C(I_n)$과 $\varepsilon>0$에 대해 $\sup_{x\in I_n}|G(x)-f(x)|<\varepsilon$인 $G\in U$가 있습니다.
**4.** 말하는 것: 연속함수는 은닉층 하나의 망으로 균등하게 원하는 만큼 근사할 수 있다(존재). 말하지 않는 것: 필요한 뉴런 수 $N$, 그 가중치를 경사하강법으로 찾을 수 있는지, 유한한 자료에서 일반화되는지 가운데 하나.`,
        rubric: R`
- 1. 판별 함수의 정의 — 5점
- 2. 선형 부분공간 — 5점
- 3. 닫힘을 부정하는 가정, 보조정리 4, $N=1$인 원소에 적용, 판별성으로 모순 — 14점
- 4. 말하는 것과 말하지 않는 것 — 6점` },
      { ch: 'ch18', type: 'open', lv: 3, pts: 30, q: R`힐베르트 공간 $H$의 부분집합 $G$의 모든 원소가 $\lVert g\rVert\le B$를 만족하고, $f=\sum_{j=1}^m\alpha_jh_j$ ($h_j\in G$, $\alpha_j\ge0$, $\sum_j\alpha_j=1$)이다.
1. $X_1,\dots,X_N$을 $P[X_i=h_j]=\alpha_j$인 독립 확률변수라 할 때 $\E X_i=f$임을 보이시오.
2. $\E\Big\lVert f-\frac1N\sum_{i=1}^NX_i\Big\rVert^2=\frac1N\big(\E\lVert X_1\rVert^2-\lVert f\rVert^2\big)$임을 보이시오. 교차항이 왜 사라지는지 쓸 것.
3. $\big\lVert f-\frac1N\sum_ig_i\big\rVert^2\le\frac{B^2}N$인 $g_1,\dots,g_N\in G$가 존재함을 보이시오.`,
        sol: R`
**1.** $\E X_i=\sum_jP[X_i=h_j]\,h_j=\sum_j\alpha_jh_j=f$.
**2.** $f=\frac1N\sum_if$이므로 $f-\frac1N\sum_iX_i=\frac1N\sum_i(f-X_i)$. $\lVert\sum_iv_i\rVert^2=\sum_i\lVert v_i\rVert^2+\sum_{i\ne j}\langle v_i,v_j\rangle$로 전개합니다. $i\ne j$이면 $X_i$와 $X_j$가 독립이라 $\E\langle f-X_i,f-X_j\rangle=\langle f,f\rangle-\langle f,\E X_j\rangle-\langle\E X_i,f\rangle+\langle\E X_i,\E X_j\rangle=0$. 남는 것은 $\frac1{N^2}\cdot N\,\E\lVert f-X_1\rVert^2$이고, $\E\lVert f-X_1\rVert^2=\lVert f\rVert^2-2\langle f,\E X_1\rangle+\E\lVert X_1\rVert^2=\E\lVert X_1\rVert^2-\lVert f\rVert^2$.
**3.** $\E\lVert X_1\rVert^2\le B^2$이므로 기댓값은 $\frac{B^2-\lVert f\rVert^2}N\le\frac{B^2}N$ 이하입니다. 확률변수의 기댓값이 어떤 값 이하이면 그 값 이하인 실현이 적어도 하나 있으므로(확률적 방법), 그 실현 $g_i=X_i(\omega)\in G$들이 원하는 원소입니다.`,
        rubric: R`
- 1. 기댓값 계산 — 4점
- 2. $\frac1N\sum(f-X_i)$로 쓰기, 독립성으로 교차항 소거, 남은 항 정리 — 16점
- 3. $B^2$ 상한과 확률적 방법 — 10점` },
      { ch: 'ch18', type: 'num', lv: 2, pts: 10, q: R`바론 정리(평균 제곱 오차 $\frac1{|B_1^d|}\int_{B_1^d}|f-\Phi_N|^2\le\frac cN$, $c>4C^2$)에서 $C=3$인 함수를 평균 제곱 오차 $0.05$ 이하로 근사하도록 정리가 보장하는 가장 작은 뉴런 수 $N$은?`, ans: '721', ansTex: R`721`,
        sol: R`$4C^2=36$이므로 $c>36$이어야 하고 $\frac cN\le0.05\iff N\ge20c$. $c$를 36보다 아주 조금 크게($36<c\le36.05$) 잡으면 $N=721$로 충분하고, $N=720$은 $c\le36$을 요구해 보장되지 않습니다. 이 수는 입력 차원 $d$와 무관합니다.` },
      { ch: 'ch18', type: 'open', lv: 2, pts: 15, q: R`$\lVert x_i\rVert\le1$ ($i=1,\dots,n$)인 점들과 함수족 $\mathcal F_Q=\{x\mapsto\langle w,x\rangle:\lVert w\rVert\le Q\}$에 대해, 경험적 라데마허 복잡도 $\widehat{\operatorname{Rad}}_n(\mathcal F_Q)=\E_\xi\sup_{f\in\mathcal F_Q}\frac1n\sum_i\xi_if(x_i)$가 $\frac Q{\sqrt n}$ 이하임을 보이시오. ($\xi_i$는 독립인 라데마허 변수)`,
        sol: R`코시-슈바르츠로 $\sup_{\lVert w\rVert\le Q}\frac1n\big\langle w,\sum_i\xi_ix_i\big\rangle=\frac Qn\big\lVert\sum_i\xi_ix_i\big\rVert$ ($w$를 $\sum_i\xi_ix_i$ 방향으로 잡을 때 등호). $\sqrt{\cdot}$가 오목하므로 젠센 부등식으로 $\E\big\lVert\sum_i\xi_ix_i\big\rVert\le\sqrt{\E\big\lVert\sum_i\xi_ix_i\big\rVert^2}$. 전개하면 $i\ne j$에서 $\E\xi_i\xi_j=0$이고 $\xi_i^2=1$이라 $\E\big\lVert\sum_i\xi_ix_i\big\rVert^2=\sum_i\lVert x_i\rVert^2\le n$. 따라서 $\widehat{\operatorname{Rad}}_n(\mathcal F_Q)\le\frac Qn\sqrt n=\frac Q{\sqrt n}$.`,
        rubric: R`
- 상한을 노름으로 바꾸기(코시-슈바르츠) — 5점
- 젠센 부등식 — 4점
- 교차항 소거와 $\sum_i\lVert x_i\rVert^2\le n$ — 6점` },
      { ch: 'ch17', type: 'mc', lv: 1, pts: 5, q: R`은닉 뉴런 수를 늘려 가설 집합 $\mathcal F$를 키우면 일반적으로 어떤 오차가 줄어드는가?`,
        choices: [R`근사 오차`, R`일반화 오차`, R`최적화 오차`, R`세 오차 모두`], ans: 0,
        sol: R`가설 집합이 커지면 $\inf_{f\in\mathcal F}R(f)$가 줄어 근사 오차가 줄지만, 고를 수 있는 함수가 많아져 일반화 오차는 오히려 커질 수 있고, 최적화가 쉬워진다는 보장도 없습니다. 보편 근사 정리는 근사 오차에 관한 정리입니다.` },
      { ch: 'ch17', type: 'mc', lv: 1, pts: 5, q: R`다음 가운데 $[0,1]$ 위에서 판별 함수가 **아닌** 것은?`,
        choices: [R`로지스틱 함수 $\frac1{1+e^{-t}}$`, R`헤비사이드 계단 함수`, R`항등 함수 $\sigma(t)=t$`, R`$\frac{1+\tanh t}2$`], ans: 2,
        sol: R`항등 함수면 $\int(wx+\theta)\,d\mu=w\int x\,d\mu+\theta\,\mu([0,1])$로 질량과 1차 모멘트만 봅니다. 둘이 모두 $0$인 $\mu=\delta_0-2\delta_{1/2}+\delta_1\ne0$에서 모든 $w,\theta$에 대해 $0$이므로 판별 함수가 아닙니다. 나머지는 (유계 가측) 시그모이드라 판별적입니다.` },
      { ch: 'ch18', type: 'mc', lv: 2, pts: 5, q: R`값이 $[0,1]$인 함수족에서 확률 $1-\delta$ 이상으로 $\sup_f|\hat R_n(f)-R(f)|\le2\operatorname{Rad}_n(\mathcal F)+\sqrt{\frac{\log(2/\delta)}{2n}}$이고 $\operatorname{Rad}_n\le Q/\sqrt n$이다. 표본 수를 4배로 늘리면 우변은 대략 어떻게 되는가?`,
        choices: [R`약 절반`, R`약 4분의 1`, R`약 16분의 1`, R`그대로`], ans: 0,
        sol: R`두 항 모두 $1/\sqrt n$에 비례하므로 $n\to4n$이면 $\frac1{\sqrt{4n}}=\frac12\cdot\frac1{\sqrt n}$, 곧 약 절반입니다. 오차를 절반으로 줄이려면 자료가 네 배 필요합니다.` },
    ],
  },
  {
    id: 'q2c', roman: 'C', group: G,
    kind: 'Quiz 2 종합 점검', title: '전 범위 짧은 문항과 유도', scopeText: '15.7·17–20 단원',
    desc: 'RNN의 구조와 매개변수, 잘라내기, 언어 모델의 교차 엔트로피, Maurey, 조밀성, PyTorch의 크기를 짧게 확인하고, δ 점화식과 위험 분해를 유도합니다.',
    minutes: 60, plot: 'lstm',
    problems: [
      { ch: 'ch19', type: 'mc', lv: 1, pts: 6, q: R`영어 문장을 한국어로 번역하는 RNN의 입출력 구조는?`,
        choices: [R`one to one`, R`one to many`, R`many to one`, R`입력을 다 읽은 뒤 출력하는 many to many`], ans: 3,
        sol: R`입력 문장을 끝까지 읽은 뒤 출력 문장을 내는 many to many(인코더–디코더)입니다. 영상 분류는 many to one, 이미지 캡셔닝은 one to many입니다.` },
      { ch: 'ch19', type: 'num', lv: 1, pts: 8, q: R`바닐라 RNN $\mathbf h_t=\tanh(U\mathbf h_{t-1}+W\mathbf x_t+\mathbf b)$, $\hat{\mathbf y}_t=W^{\text{out}}\mathbf h_t$에서 $\mathbf x_t\in\mathbb R^{10}$, $\mathbf h_t\in\mathbb R^{20}$, $\hat{\mathbf y}_t\in\mathbb R^5$이면 매개변수는 모두 몇 개인가? (출력에는 편향이 없다)`, ans: '720', ansTex: R`400+200+20+100=720`,
        sol: R`$U$: $20\cdot20=400$, $W$: $20\cdot10=200$, $\mathbf b$: $20$, $W^{\text{out}}$: $5\cdot20=100$. 합 $720$. 매개변수를 모든 시간 단계가 공유하므로 수열의 길이와 무관합니다.` },
      { ch: 'ch20', type: 'num', lv: 1, pts: 8, q: R`입력 크기 $d=50$, 은닉 크기 $h=100$인 LSTM 한 층의 매개변수 수(편향 포함)는?`, ans: '60400', ansTex: R`4\cdot100\cdot150+400=60400`,
        sol: R`게이트 네 개가 각각 $h\times(h+d)$ 가중치와 $h$ 편향을 가지므로 $4h(h+d)+4h=4\cdot100\cdot150+400=60{,}400$.` },
      { ch: 'ch19', type: 'num', lv: 1, pts: 8, q: R`기울기 $\mathbf g=(6,8)$을 임계값 $v=5$로 잘라내면 첫째 성분은?`, ans: '3', ansTex: R`3`,
        sol: R`$\lVert\mathbf g\rVert=10>5$이므로 $\frac5{10}\mathbf g=(3,4)$. 노름은 $5$, 방향은 그대로입니다.` },
      { ch: 'ch19', type: 'mc', lv: 2, pts: 6, q: R`잘린 BPTT(truncated BPTT)의 설명으로 옳은 것은?`,
        choices: [R`은닉 상태를 일정 걸음마다 $\mathbf 0$으로 되돌린다`, R`순전파는 은닉 상태를 계속 이어 가지만, 역전파는 최근 몇 걸음에서만 한다`, R`순전파와 역전파 모두 처음 몇 걸음만 한다`, R`기울기의 크기를 임계값으로 자른다`], ans: 1,
        sol: R`슬라이드 9: 은닉 상태는 시간을 따라 계속 넘기되, 역전파는 더 짧은 구간에서만 합니다. 기울기의 크기를 자르는 것은 기울기 잘라내기(clipping)로 다른 기법입니다.` },
      { ch: 'ch20', type: 'num', lv: 2, pts: 8, q: R`어휘가 4개인 언어 모델의 한 칸에서 로짓이 $(2,0,0,0)$이고 정답이 첫 번째 토큰이다. 교차 엔트로피 손실은? (식으로 입력해도 됩니다)`, ans: 'ln(1+3/e^2)', ansTex: R`\ln(1+3e^{-2})\approx0.341`,
        sol: R`$p_1=\frac{e^2}{e^2+3}$, 손실 $-\ln p_1=\ln\frac{e^2+3}{e^2}=\ln(1+3e^{-2})\approx0.341$.` },
      { ch: 'ch18', type: 'num', lv: 2, pts: 8, q: R`$H=\mathbb R^3$, $G=\{\mathbf e_1,\mathbf e_2,\mathbf e_3\}$, $f^*=(\frac13,\frac13,\frac13)$이고 $X_1,\dots,X_6$이 $G$에서 각각 확률 $\frac13$로 독립으로 뽑힐 때 $\E\big\lVert f^*-\frac16\sum_iX_i\big\rVert^2$은?`, ans: '1/9', ansTex: R`\frac19`,
        sol: R`Maurey 보조정리의 등식으로 $\frac1N\big(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2\big)=\frac16\big(1-\frac13\big)=\frac19$.` },
      { ch: 'ch17', type: 'mc', lv: 1, pts: 6, q: R`집합 $D\subseteq C(K)$가 최대 노름에서 조밀하다는 뜻은?`,
        choices: [R`모든 $f\in C(K)$와 $\varepsilon>0$에 대해 $\sup_{x\in K}|f(x)-g(x)|<\varepsilon$인 $g\in D$가 있다`, R`모든 $f\in C(K)$와 $\varepsilon>0$에 대해 $\int_K|f-g|^2<\varepsilon$인 $g\in D$가 있다`, R`$D=C(K)$이다`, R`$D$가 유한 차원이다`], ans: 0,
        sol: R`최대 노름 $\lVert f-g\rVert_\infty=\sup_K|f-g|$로 잰 가까움입니다. 둘째 보기는 $L^2$에서의 조밀성으로 더 약한 조건이고, 조밀해도 $D=C(K)$일 필요는 없습니다(예: 다항식 전체).` },
      { ch: 'ch15', type: 'num', lv: 1, pts: 8, q: R`입력 $1\times3\times32\times32$에 $\texttt{Conv2d(3, 16, 5, padding=2)}$, ReLU, $\texttt{MaxPool2d(2)}$를 차례로 적용한 뒤 $\texttt{view(1, -1)}$로 펴면 길이는?`, ans: '4096', ansTex: R`16\cdot16\cdot16=4096`,
        sol: R`합성곱: $\frac{32-5+4}{1}+1=32$, 채널 16. 풀링: $\frac{32-2}{2}+1=16$. 펴면 $16\cdot16\cdot16=4096$.` },
      { ch: 'ch19', type: 'open', lv: 3, pts: 18, q: R`A의 두 단계 스칼라 RNN ($h_t=\tanh a_t$, $a_t=Wh_{t-1}+UX_t+b$, $Y_t=Vh_t+c$, $L=\sum_t\frac12(Y_t-Z_t)^2$)에서 $\delta_t=\frac{\partial L}{\partial a_t}$로 두자.
1. $\delta_2$와 $\delta_1$을 구하시오.
2. $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1$, $\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2$, $\frac{\partial L}{\partial b}=\delta_1+\delta_2$임을 보이시오.
3. $T$단계로 일반화한 역방향 점화식과 세 기울기를 쓰시오.`,
        sol: R`
**1.** $a_2$는 $h_2$를 거쳐 $L_2$에만 영향을 주므로 $\delta_2=(Y_2-Z_2)V(1-h_2^2)$. $a_1$은 $h_1$을 거쳐 $L_1$과 $a_2$ 두 곳에 영향을 주므로 $\frac{\partial L}{\partial h_1}=(Y_1-Z_1)V+\delta_2W$이고 $\delta_1=\big[(Y_1-Z_1)V+\delta_2W\big](1-h_1^2)$.
**2.** $W$는 $a_1$과 $a_2$에 직접 들어가므로 $\frac{\partial L}{\partial W}=\delta_1\frac{\partial a_1}{\partial W}+\delta_2\frac{\partial a_2}{\partial W}=\delta_1h_0+\delta_2h_1$. 여기서 $\partial a_t/\partial W=h_{t-1}$은 $h_{t-1}$을 상수로 본 직접 미분이고, $W$가 $h_1$을 바꾸는 간접 효과는 이미 $\delta_1$ 안의 $\delta_2W$에 들어 있어 두 번 세지 않습니다. 같은 방식으로 $\partial a_t/\partial U=X_t$, $\partial a_t/\partial b=1$. 전개하면 A의 세 항 식과 같습니다.
**3.** $\delta_T=(Y_T-Z_T)V(1-h_T^2)$, $\delta_t=\big[(Y_t-Z_t)V+\delta_{t+1}W\big](1-h_t^2)$ ($t=T-1,\dots,1$)이고
$$\frac{\partial L}{\partial W}=\sum_{t=1}^T\delta_th_{t-1},\qquad\frac{\partial L}{\partial U}=\sum_{t=1}^T\delta_tX_t,\qquad\frac{\partial L}{\partial b}=\sum_{t=1}^T\delta_t.$$`,
        rubric: R`
- 1. $\delta_2$와 두 경로를 합친 $\delta_1$ — 7점
- 2. 직접 미분과 간접 효과의 구분 — 6점
- 3. 일반 점화식과 세 기울기 — 5점` },
      { ch: 'ch18', type: 'open', lv: 2, pts: 16, q: R`1. 모집단 위험 $R(f)$와 경험적 위험 $\hat R_n(f)$를 정의하시오.
2. $\hat f=\argmin_{f\in\mathcal F}\hat R_n(f)$, $f_{\mathcal F}=\argmin_{f\in\mathcal F}R(f)$일 때 $R(\hat f)-R(f_{\mathcal F})\le2\sup_{f\in\mathcal F}|\hat R_n(f)-R(f)|$임을 보이시오.
3. 이 결과와 라데마허 복잡도가 함께 말하는 것을 한두 문장으로 쓰시오.`,
        sol: R`
**1.** $R(f)=\E_{(X,Y)\sim P}\big[\ell(Y,f(X))\big]$, $\hat R_n(f)=\frac1n\sum_{i=1}^n\ell(Y_i,f(X_i))$.
**2.** $R(\hat f)-R(f_{\mathcal F})=\big[R(\hat f)-\hat R_n(\hat f)\big]+\big[\hat R_n(\hat f)-\hat R_n(f_{\mathcal F})\big]+\big[\hat R_n(f_{\mathcal F})-R(f_{\mathcal F})\big]$. 가운데 항은 $\hat f$가 경험적 위험의 최소점이라 $0$ 이하이고, 양 끝 항은 각각 $\sup_{f\in\mathcal F}|\hat R_n(f)-R(f)|$ 이하입니다.
**3.** 손실의 값이 $[0,1]$이면 $\sup$ 항은 높은 확률로 $2\operatorname{Rad}_n+\sqrt{\log(2/\delta)/(2n)}$ 이하이므로, 함수족의 복잡도가 $\operatorname{Rad}_n\le Q/\sqrt n$처럼 작으면 경험적 위험 최소화의 결과가 $O(1/\sqrt n)$ 속도로 가설 집합 안의 최선에 다가갑니다.`,
        rubric: R`
- 1. 두 위험의 정의 — 4점
- 2. 세 항 분해와 가운데 항의 부호 — 8점
- 3. 라데마허 한계와 $1/\sqrt n$의 해석 — 4점` },
    ],
  }
  );
})();
