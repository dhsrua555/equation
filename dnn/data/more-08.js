/* 추가 연습문제 — 08 신경망의 기초. 순방향 계산·파라미터 세기·표현력 증명을 새로 만들었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 8,
    problems: [
      { sec: '8.6', type: 'num', lv: 1, q: R`MNIST용 MLP $784\to256\to128\to10$ (모든 층에 편향)의 파라미터 수는?`, ans: '235146', ansTex: R`235{,}146`,
        sol: R`$(784+1)256+(256+1)128+(128+1)10=200{,}960+32{,}896+1{,}290=235{,}146$.` },
      { sec: '8.3', type: 'num', lv: 2, q: R`$x=(1,-1)$, $W_1=\begin{pmatrix}2&1\\-1&3\end{pmatrix}$, $b_1=(1,2)$, ReLU, $W_2=(1\ \ 2)$, $b_2=-0.5$일 때 출력 $W_2h+b_2$는?`, ans: '1.5', ansTex: R`1.5`,
        sol: R`$W_1x+b_1=(2-1+1,\ -1-3+2)=(2,-2)$, ReLU로 $h=(2,0)$. $W_2h+b_2=2+0-0.5=1.5$.` },
      { sec: '8.3', type: 'open', lv: 2, proof: true, q: R`$\tanh(x)=2\sigma(2x)-1$을 보이고, 이를 써서 $\tanh'(x)=1-\tanh^2(x)$를 유도하세요.`,
        sol: R`
$2\sigma(2x)-1=\frac{2}{1+e^{-2x}}-1=\frac{1-e^{-2x}}{1+e^{-2x}}$. 분자·분모에 $e^x$를 곱하면 $\frac{e^x-e^{-x}}{e^x+e^{-x}}=\tanh x$.
미분: $\tanh'(x)=4\sigma'(2x)=4\sigma(2x)(1-\sigma(2x))$. $\sigma(2x)=\frac{1+t}2$ ($t=\tanh x$)이므로 $4\cdot\frac{1+t}2\cdot\frac{1-t}2=1-t^2$.`,
        rubric: R`
- 항등식 — 5점
- 연쇄법칙과 $\sigma'$ — 3점
- $1-\tanh^2$로 정리 — 2점` },
      { sec: '8.3', type: 'open', lv: 2, proof: true, q: R`Maxout 유닛 $\max(w_1^Tx+b_1,\ w_2^Tx+b_2)$가 ReLU $\max(0,w^Tx+b)$와 Leaky ReLU $\max(0.1(w^Tx+b),\ w^Tx+b)$를 특수한 경우로 포함함을 보이세요.`,
        sol: R`
ReLU: $w_1=w$, $b_1=b$, $w_2=0$, $b_2=0$으로 두면 $\max(w^Tx+b,0)$.
Leaky ReLU: $w_1=w$, $b_1=b$, $w_2=0.1w$, $b_2=0.1b$로 두면 $\max(w^Tx+b,\ 0.1(w^Tx+b))$.
Maxout은 두(또는 여러) 선형함수의 최댓값이라 볼록 조각 선형 함수를 만들고, 기울기가 어느 한쪽에서 0이 되지 않게 학습할 수 있습니다.`,
        rubric: R`
- ReLU의 대입 — 5점
- Leaky ReLU의 대입 — 5점` },
      { sec: '8.4', type: 'open', lv: 2, proof: true, q: R`ReLU만 써서 (i) $\lvert x\rvert$ ($x\in\mathbb R$) (ii) $\max(x_1,x_2)$를 정확히 계산하는 은닉층 하나짜리 신경망을 쓰고 확인하세요.`,
        sol: R`
**(i)** $\lvert x\rvert=\max(0,x)+\max(0,-x)$: 은닉 유닛 두 개(가중치 $1$, $-1$), 출력 가중치 $(1,1)$. $x\ge0$이면 $x+0$, $x<0$이면 $0+(-x)$.
**(ii)** $\max(x_1,x_2)=x_2+\max(0,x_1-x_2)$. 출력층이 선형이므로 $x_2=\max(0,x_2)-\max(0,-x_2)$로 써서 은닉 유닛 3개: $h=(\max(0,x_1-x_2),\max(0,x_2),\max(0,-x_2))$, 출력 $h_1+h_2-h_3$. $x_1\ge x_2$이면 $x_1-x_2+x_2=x_1$, 아니면 $0+x_2=x_2$.`,
        rubric: R`
- (i) 신경망과 확인 — 4점
- (ii) 항등식 $\max(a,b)=b+\max(0,a-b)$ — 3점
- (ii) ReLU만으로 선형항 표현 — 3점` },
      { sec: '8.4', type: 'mc', lv: 1, q: R`단층 퍼셉트론 $\operatorname{step}(w_1x_1+w_2x_2+b)$로 **계산할 수 없는** 불 함수는? (입력 $x_i\in\{0,1\}$)`,
        choices: [R`AND`, R`OR`, R`NAND`, R`XOR`], ans: 3,
        sol: R`AND는 $w=(1,1)$, $b=-1.5$, OR는 $b=-0.5$, NAND는 $w=(-1,-1)$, $b=1.5$로 됩니다. XOR는 선형 분리 불가능합니다.` },
      { sec: '8.4', type: 'num', lv: 1, q: R`퍼셉트론 $w=(1,1)$, $b=-1.5$에 입력 $(1,1)$을 넣은 선형 출력 $w^Tx+b$는?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$1+1-1.5=0.5>0$이라 1. 다른 입력 $(0,0),(0,1),(1,0)$은 $-1.5,-0.5,-0.5<0$ — AND를 계산합니다.` },
      { sec: '8.2', type: 'open', lv: 3, proof: true, q: R`활성화 없는 신경망 $f(x)=W_3W_2W_1x$에서 $W_1\in\mathbb R^{2\times100}$, $W_2\in\mathbb R^{100\times2}$, $W_3\in\mathbb R^{100\times100}$일 때 $f$를 한 행렬 $W$로 쓰면 $\operatorname{rank}W\le2$임을 보이고, 이것이 뜻하는 바를 쓰세요.`,
        sol: R`
$W=W_3W_2W_1\in\mathbb R^{100\times100}$. 곱의 계수는 각 인수의 계수 이하이므로 $\operatorname{rank}W\le\operatorname{rank}W_1\le2$ ($W_1$은 행이 2개).
(근거: $Wx=W_3W_2(W_1x)$에서 $W_1x$가 2차원 부분공간에 있으므로 $W$의 열공간(치역)은 2차원 부분공간의 선형상, 차원 $\le2$.)
뜻: 입력 100차원을 2차원으로 눌렀다가 다시 펼친 것이라, 출력은 100차원 공간의 평면(2차원) 안에만 있습니다. 활성화 없이 층을 쌓으면 표현력이 늘기는커녕 좁은 층(병목)에 의해 제한됩니다.`,
        rubric: R`
- 곱의 계수 부등식 — 5점
- 치역의 차원으로 설명 — 3점
- 의미 — 2점` },
      { sec: '8.5', type: 'open', lv: 3, proof: true, q: R`$g(x)=2\max(0,x)-4\max(0,x-\tfrac12)$ ($x\in[0,1]$)가 “텐트 함수”($x\le\tfrac12$이면 $2x$, 아니면 $2-2x$)임을 보이고, $g\circ g$가 $[0,1]$에서 꼭대기가 두 개인 톱니임을 보이세요.`,
        sol: R`
$x\le\tfrac12$: 둘째 항이 0이라 $g=2x$. $x>\tfrac12$: $2x-4(x-\tfrac12)=2-2x$. 따라서 $g([0,1])=[0,1]$이고 $g(\tfrac12)=1$.
$g\circ g$: $x\in[0,\tfrac14]$이면 $g(x)=2x\le\tfrac12$라 $g(g(x))=4x$; $x\in[\tfrac14,\tfrac12]$이면 $g(x)\in[\tfrac12,1]$이라 $2-4x$; $x\in[\tfrac12,\tfrac34]$이면 $g(x)=2-2x\in[\tfrac12,1]$이라 $2-2(2-2x)=4x-2$; $x\in[\tfrac34,1]$이면 $g(x)\le\tfrac12$라 $4-4x$. 꼭대기 $x=\tfrac14,\tfrac34$ (값 1), 골짜기 $x=0,\tfrac12,1$ (값 0) — 톱니 2개. $k$번 합성하면 $2^{k-1}$개로, 층당 ReLU 2개짜리 깊은 신경망이 기하급수적으로 많은 꺾임을 만듭니다.`,
        rubric: R`
- 텐트 함수 확인 — 3점
- 네 구간으로 나눈 $g\circ g$ — 5점
- 깊이의 의미 — 2점` },
      { sec: '8.1', type: 'num', lv: 1, q: R`$64\times64$ 컬러(RGB) 이미지를 펼친 벡터의 차원은?`, ans: '12288', ansTex: R`12{,}288`,
        sol: R`$64\times64\times3=12{,}288$.` },
    ],
  });
})();
