/* 증명 — 07 심층 신경망(교재 6장), 13–14 합성곱 신경망(교재 10장). 2026-09-29 추가.
   src가 있는 항목은 Bishop 교재의 연습문제에 해당하는 유도입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 07 심층 신경망
  { ch: 'ch07', id: 'act-derivs', title: '활성화 함수의 도함수와 tanh–시그모이드 관계', keys: ['활성화 함수'], src: 'Bishop 연습문제 6.4·6.7',
    tags: 'sigmoid tanh softplus derivative activation 시그모이드 tanh softplus 도함수 활성화',
    stmt: R`$\sigma'(a)=\sigma(a)\{1-\sigma(a)\}$, $\tanh'(a)=1-\tanh^2a$, $\frac d{da}\ln(1+e^a)=\sigma(a)$이고 $\tanh a=2\sigma(2a)-1$이다. 따라서 tanh 은닉 유닛을 쓴 2층망은 가중치·편향을 바꾼 시그모이드 은닉 유닛의 2층망과 같은 함수를 나타낸다.`,
    body: R`
**도함수.** $\sigma(a)=(1+e^{-a})^{-1}$을 미분하면
$$\sigma'(a)=\frac{e^{-a}}{(1+e^{-a})^2}=\frac1{1+e^{-a}}\cdot\frac{e^{-a}}{1+e^{-a}}=\sigma(a)\{1-\sigma(a)\}.$$
$\tanh a=\frac{e^a-e^{-a}}{e^a+e^{-a}}$은 몫의 미분으로
$$\tanh'(a)=\frac{(e^a+e^{-a})^2-(e^a-e^{-a})^2}{(e^a+e^{-a})^2}=1-\tanh^2a.$$
softplus: $\frac d{da}\ln(1+e^a)=\frac{e^a}{1+e^a}=\frac1{1+e^{-a}}=\sigma(a)$. 또 $\ln(1+e^a)-a=\ln(1+e^{-a})\to0$ ($a\to\infty$)이라 큰 $a$에서 $h(a)\simeq a$입니다.

**tanh = 늘이고 옮긴 시그모이드.**
$$2\sigma(2a)-1=\frac{2}{1+e^{-2a}}-1=\frac{1-e^{-2a}}{1+e^{-2a}}=\frac{e^a-e^{-a}}{e^a+e^{-a}}=\tanh a.$$

**망의 동등성.** tanh망 $y_k=\sum_jw_{kj}\tanh\big(\sum_iw_{ji}x_i+w_{j0}\big)+w_{k0}$에서 $\tanh u=2\sigma(2u)-1$을 대입하면
$$y_k=\sum_j2w_{kj}\,\sigma\Big(\sum_i2w_{ji}x_i+2w_{j0}\Big)+\Big(w_{k0}-\sum_jw_{kj}\Big).$$
즉 첫 층 가중치·편향을 2배, 둘째 층 가중치를 2배, 출력 편향을 $w_{k0}-\sum_jw_{kj}$로 바꾼 시그모이드망과 같은 함수입니다.`,
    note: R`표현력은 같지만 학습은 같지 않습니다. 가중치의 척도가 달라지므로 초기화 규칙을 활성화 함수에 맞춰 바꿔야 합니다(8단원). $\sigma'$의 최댓값은 $\frac14$이라 시그모이드망은 층마다 기울기가 적어도 4배 줄 수 있습니다.` },
  { ch: 'ch07', id: 'linear-hidden', title: '선형 은닉 유닛만 쓰면 선형 모델이다', keys: ['2층 신경망'],
    tags: 'linear activation composition rank bottleneck PCA 선형 활성화 합성 계수 병목 주성분',
    stmt: R`은닉 활성화가 항등함수인 2층망 $\mathbf y=\mathbf W^{(2)}\mathbf W^{(1)}\mathbf x$ ($\mathbf W^{(1)}\in\mathbb R^{M\times D}$, $\mathbf W^{(2)}\in\mathbb R^{K\times M}$)는 선형변환 $\mathbf A\mathbf x$이고 $\operatorname{rank}\mathbf A\le\min(D,M,K)$이다.`,
    body: R`
행렬곱의 결합법칙으로 $\mathbf W^{(2)}(\mathbf W^{(1)}\mathbf x)=(\mathbf W^{(2)}\mathbf W^{(1)})\mathbf x=\mathbf A\mathbf x$입니다. 편향이 있어도 $\mathbf W^{(2)}(\mathbf W^{(1)}\mathbf x+\mathbf b^{(1)})+\mathbf b^{(2)}=\mathbf A\mathbf x+\mathbf c$로 아핀 변환입니다.

계수: $\mathbf A\mathbf x=\mathbf W^{(2)}(\mathbf W^{(1)}\mathbf x)$이므로 $\mathbf A$의 치역은 $\mathbf W^{(2)}$의 치역에 포함되어 $\operatorname{rank}\mathbf A\le\operatorname{rank}\mathbf W^{(2)}\le\min(K,M)$. 또 $\mathbf W^{(1)}\mathbf x=\mathbf 0$이면 $\mathbf A\mathbf x=\mathbf 0$이라 영공간이 커지므로 $\operatorname{rank}\mathbf A\le\operatorname{rank}\mathbf W^{(1)}\le\min(M,D)$.

따라서 은닉 유닛을 아무리 여러 층 쌓아도 선형 은닉 유닛만으로는 선형 모델을 넘지 못하고, $M\lt\min(D,K)$이면 오히려 계수가 제한된 **병목**이 됩니다(모수 $M(D+K)$개 대 $DK$개).`,
    note: R`이런 선형 병목망을 입력 = 목표로 학습하면 주성분분석과 같은 부분공간을 찾습니다. 비선형 활성화가 있어야 신경망이 선형 모델을 넘어섭니다.` },
  { ch: 'ch07', id: 'weight-symmetry', title: '가중치 공간의 대칭 $M!\,2^M$', keys: ['2층 신경망'],
    tags: 'weight space symmetry sign flip permutation tanh 가중치 공간 대칭 부호 순열',
    stmt: R`tanh 은닉 유닛 $M$개인 완전연결 2층망에서, 같은 입출력 함수를 내는 가중치 벡터가 (우연한 경우를 빼면) $M!\,2^M$개씩 있다.`,
    body: R`
**부호 뒤집기.** 은닉 유닛 $j$로 들어오는 가중치와 편향의 부호를 모두 바꾸면 $a_j\to-a_j$, $\tanh$가 홀함수라 $z_j\to-z_j$. 이어서 $j$에서 나가는 가중치 $w_{kj}$의 부호도 모두 바꾸면 $w_{kj}z_j$가 그대로라 출력이 같습니다. 유닛마다 뒤집을지 말지 독립적으로 고를 수 있으므로 $2^M$가지.

**자리 바꾸기.** 은닉 유닛 $j$와 $j'$의 들어오는·나가는 가중치(와 편향)를 통째로 맞바꾸면 합 $\sum_jw_{kj}z_j$의 항 순서만 바뀌어 출력이 같습니다. 유닛 $M$개를 늘어놓는 순서는 $M!$가지.

두 변환은 서로 독립적으로 합성되므로 한 가중치 벡터와 같은 함수를 내는 벡터가 $M!\cdot2^M$개입니다(특정 가중치 값에서 생기는 우연한 대칭은 제외).`,
    note: R`층이 여럿이면 은닉층마다의 인수를 곱합니다. 학습은 이 중 하나만 찾으면 되므로 실제로는 문제가 되지 않지만, 베이지안 방법으로 망의 크기를 비교할 때는 이 대칭을 고려합니다.` },
  { ch: 'ch07', id: 'univ-relu', title: '1차원 보편 근사: ReLU로 만드는 꺾은선', keys: ['보편 근사'],
    tags: 'universal approximation ReLU piecewise linear uniform continuity 보편 근사 꺾은선 균등 연속',
    stmt: R`$f$가 $[a,b]$에서 연속이면 임의의 $\varepsilon\gt0$에 대해 ReLU 은닉 유닛을 가진 2층망 $g(x)=c+\sum_{j=0}^{m-1}v_j\ReLU(x-x_j)$가 존재해 $\max_{x\in[a,b]}\lvert f(x)-g(x)\rvert\le\varepsilon$이다.`,
    body: R`
**1. 꺾은선으로 근사.** $f$는 닫힌 구간에서 연속이라 **균등 연속**입니다: $\lvert x-x'\rvert\le\delta\Rightarrow\lvert f(x)-f(x')\rvert\le\varepsilon$인 $\delta$가 있습니다. 구간을 $a=x_0\lt x_1\lt\cdots\lt x_m=b$로 폭 $\le\delta$씩 나누고, 점 $(x_j,f(x_j))$를 잇는 꺾은선을 $g$라 합시다. $x\in[x_j,x_{j+1}]$이면 $g(x)$는 $f(x_j)$와 $f(x_{j+1})$ 사이의 값이고 두 값 모두 $f(x)$와 $\varepsilon$ 이내이므로 $\lvert f(x)-g(x)\rvert\le\varepsilon$.

**2. 꺾은선 = ReLU의 합.** 조각 $j$의 기울기를 $s_j=\frac{f(x_{j+1})-f(x_j)}{x_{j+1}-x_j}$라 하면
$$g(x)=f(x_0)+s_0\ReLU(x-x_0)+\sum_{j=1}^{m-1}(s_j-s_{j-1})\ReLU(x-x_j)\qquad(x\in[a,b]).$$
실제로 $x\in[x_j,x_{j+1}]$에서 켜진 ReLU는 $x_0,\dots,x_j$이고, 기울기의 합이 $s_0+\sum_{i=1}^j(s_i-s_{i-1})=s_j$, $x=x_0$에서 값이 $f(x_0)$이며 연속이므로 꺾은선과 일치합니다. 이는 은닉 유닛 $m$개(첫 층 가중치 1, 편향 $-x_j$)와 선형 출력(가중치 $v_j$, 편향 $c=f(x_0)$)인 2층망입니다.`,
    note: R`시그모이드도 $\sigma(s(x-c))$에서 $s\to\infty$이면 계단이 되어, 계단 두 개의 차로 막대를 만들고 막대들의 합으로 같은 논증을 할 수 있습니다. 필요한 유닛 수는 $f$의 균등 연속 정도($\delta$)에 따라 정해지며, $D$차원에서는 칸의 수가 $\delta^{-D}$로 늘어 지수적으로 많아질 수 있습니다.` },
  { ch: 'ch07', id: 'depth-sawtooth', title: '깊이는 선형 조각을 지수적으로 늘린다', keys: ['깊은 신경망'],
    tags: 'depth expressivity sawtooth tent map ReLU linear regions Montufar 깊이 표현력 톱니 선형 영역',
    stmt: R`$g(x)=2\ReLU(x)-4\ReLU(x-\tfrac12)$를 $L$번 합성한 $g^{(L)}$는 $[0,1]$에서 선형 조각 $2^L$개인 톱니 함수이다(은닉 유닛 $2L$개). 반면 입력 하나, ReLU 은닉 유닛 $m$개인 2층망은 선형 조각이 많아야 $m+1$개이므로, 같은 함수를 은닉층 하나로 나타내려면 $2^L-1$개 이상의 유닛이 필요하다.`,
    body: R`
**삼각형 함수.** $x\in[0,\tfrac12]$이면 $g(x)=2x$, $x\in[\tfrac12,1]$이면 $2x-4(x-\tfrac12)=2-2x$. 그래서 $g$는 $[0,1]$을 $[0,1]$로 보내며 올라갈 때 한 번, 내려갈 때 한 번 전체를 덮습니다.

**귀납.** $g^{(L)}$이 $[0,1]$을 $2^L$개 구간으로 나누고, 각 구간에서 $[0,1]$ 위로 단조 일차함수라고 합시다($L=1$이면 성립). $g^{(L+1)}=g\circ g^{(L)}$에서, 한 구간 안의 $x$가 움직이면 $g^{(L)}(x)$가 $[0,1]$을 한 번 훑으므로 $g$를 거치면 $\tfrac12$를 지날 때 한 번 꺾여 조각 두 개가 됩니다. 따라서 조각 수가 $2\cdot2^L=2^{L+1}$.

**얕은 망의 한계.** $\sum_{j=1}^mv_j\ReLU(w_jx+b_j)+c$에서 각 항은 $x=-b_j/w_j$에서만 꺾이므로 꺾인 점이 많아야 $m$개, 조각은 많아야 $m+1$개입니다. $2^L$개 조각에는 $m\ge2^L-1$이 필요합니다.`,
    note: R`$L=10$이면 깊은 망은 은닉 유닛 20개, 얕은 망은 1,023개 이상. 교재가 인용한 Montúfar 외(2014)의 결과(선형 영역 수가 깊이에 지수적, 너비에 다항식적)의 가장 간단한 예입니다.` },
  { ch: 'ch07', id: 'reg-nll', title: '회귀의 음의 로그가능도와 잡음 분산', keys: ['회귀의 오차함수'], src: 'Bishop 연습문제 6.8·6.9·6.10',
    tags: 'regression Gaussian likelihood sum of squares noise variance multiple targets 회귀 가우시안 가능도 제곱오차 잡음 분산',
    stmt: R`$p(\mathbf t\mid\mathbf x,\mathbf w)=\N(\mathbf t\mid\mathbf y(\mathbf x,\mathbf w),\sigma^2\mathbf I)$ ($\mathbf t\in\mathbb R^K$)이고 자료가 i.i.d.이면 음의 로그가능도의 $\mathbf w$에 대한 최소화는 $\frac12\sum_n\lVert\mathbf y(\mathbf x_n,\mathbf w)-\mathbf t_n\rVert^2$의 최소화와 같고, $\sigma^2$의 최대가능도 해는 $\frac1{NK}\sum_n\lVert\mathbf y(\mathbf x_n,\mathbf w^\star)-\mathbf t_n\rVert^2$이다.`,
    body: R`
$K$차원 등방 가우시안의 밀도는 $(2\pi\sigma^2)^{-K/2}\exp\{-\frac1{2\sigma^2}\lVert\mathbf t-\mathbf y\rVert^2\}$이므로
$$-\ln p(\mathbf T\mid\mathbf X,\mathbf w,\sigma^2)=\frac1{2\sigma^2}\sum_{n=1}^N\lVert\mathbf y_n-\mathbf t_n\rVert^2+\frac{NK}2\ln\sigma^2+\frac{NK}2\ln(2\pi).$$
$\sigma^2\gt0$을 고정하면 $\mathbf w$가 들어간 항은 첫 항뿐이고 양의 상수배이므로 최소점이 제곱오차합의 최소점과 같습니다. $\mathbf w=\mathbf w^\star$에서 $\beta=1/\sigma^2$로 두고 $\frac\beta2S-\frac{NK}2\ln\beta$ ($S=\sum_n\lVert\mathbf y_n^\star-\mathbf t_n\rVert^2$)를 미분하면 $\frac S2-\frac{NK}{2\beta}=0$, 즉 $\sigma^{2\star}=\frac S{NK}$. 둘째 도함수 $\frac{NK}{2\beta^2}\gt0$이라 최소입니다. $K=1$이면 $\sigma^{2\star}=\frac1N\sum_n(y_n^\star-t_n)^2$.`,
    note: R`$\mathbf w^\star$는 망의 비선형성 때문에 볼록이 아닌 최적화의 결과라 전역 최대가능도 해라는 보장은 없고, $\sigma^{2\star}$는 $\mathbf w^\star$를 찾은 뒤 한 번 계산합니다. 목표들이 서로 독립이라는 가정을 빼면 공분산 행렬까지 추정하는 조금 더 복잡한 문제가 됩니다.` },
  { ch: 'ch07', id: 'bce-grad', title: '교차 엔트로피 오차와 기울기 y − t', keys: ['이진 분류의 교차 엔트로피'], src: 'Bishop 연습문제 6.14',
    tags: 'cross entropy Bernoulli sigmoid gradient y minus t binary classification 교차 엔트로피 베르누이 시그모이드 기울기',
    stmt: R`$y=\sigma(a)$, $p(t\mid\mathbf x,\mathbf w)=y^t(1-y)^{1-t}$ ($t\in\{0,1\}$)이면 음의 로그가능도는 $E=-\sum_n\{t_n\ln y_n+(1-t_n)\ln(1-y_n)\}$이고 $\partial E_n/\partial a_n=y_n-t_n$이다. 독립인 $K$개 레이블이면 $E=-\sum_n\sum_k\{t_{nk}\ln y_{nk}+(1-t_{nk})\ln(1-y_{nk})\}$이고 $\partial E_n/\partial a_{nk}=y_{nk}-t_{nk}$이다.`,
    body: R`
독립인 관측의 가능도는 곱 $\prod_ny_n^{t_n}(1-y_n)^{1-t_n}$이고, 음의 로그를 취하면 $E$가 됩니다. 한 항 $E_n=-t\ln y-(1-t)\ln(1-y)$를 연쇄법칙과 $\frac{dy}{da}=y(1-y)$로 미분하면
$$\frac{\partial E_n}{\partial a}=\Big(-\frac ty+\frac{1-t}{1-y}\Big)y(1-y)=-t(1-y)+(1-t)y=y-t.$$
$K$개 레이블이 입력이 주어졌을 때 독립이면 조건부 분포가 $\prod_ky_k^{t_k}(1-y_k)^{1-t_k}$로 곱해지므로 오차는 레이블마다의 교차 엔트로피의 합이고, $a_k$는 $y_k$에만 들어 있어 같은 계산으로 $\partial E_n/\partial a_k=y_k-t_k$.`,
    note: R`같은 시그모이드 출력에 제곱오차를 쓰면 $\partial E/\partial a=(y-t)y(1-y)$로 확신에 찬 오답에서 기울기가 사라집니다. 교차 엔트로피가 분류에서 학습이 빠르고 일반화도 좋은 이유입니다(Simard 외 2003).` },
  { ch: 'ch07', id: 'softmax-ce', title: '소프트맥스 교차 엔트로피의 기울기', keys: ['다중 클래스 교차 엔트로피', '출력 활성화와 오차함수의 짝'], src: 'Bishop 연습문제 6.13·6.15',
    tags: 'softmax cross entropy gradient canonical link multiclass 소프트맥스 교차 엔트로피 기울기 정준 연결 다중 클래스',
    stmt: R`$y_k=\frac{e^{a_k}}{\sum_je^{a_j}}$, 1-of-$K$ 목표 $\mathbf t$에 대해 $E_n=-\sum_kt_k\ln y_k$이면 $\frac{\partial E_n}{\partial a_k}=y_k-t_k$이다. 또 모든 $a_k$에 같은 상수를 더해도 $y_k$는 변하지 않는다.`,
    body: R`
**가능도.** 범주 분포 $p(\mathbf t\mid\mathbf x)=\prod_ky_k^{t_k}$의 음의 로그가 $E_n=-\sum_kt_k\ln y_k$입니다.

**소프트맥스의 도함수.** $\ln y_j=a_j-\ln\sum_le^{a_l}$이므로 $\frac{\partial\ln y_j}{\partial a_k}=\delta_{jk}-\frac{e^{a_k}}{\sum_le^{a_l}}=\delta_{jk}-y_k$.

**기울기.**
$$\frac{\partial E_n}{\partial a_k}=-\sum_jt_j\frac{\partial\ln y_j}{\partial a_k}=-\sum_jt_j(\delta_{jk}-y_k)=-t_k+y_k\sum_jt_j=y_k-t_k\qquad\Big(\sum_jt_j=1\Big).$$

**상수 이동.** $\frac{e^{a_k+c}}{\sum_je^{a_j+c}}=\frac{e^ce^{a_k}}{e^c\sum_je^{a_j}}=y_k$. 그래서 가중치 공간에 오차가 변하지 않는 방향이 생기며, 규제항을 더하면 이 퇴화가 사라집니다.`,
    note: R`회귀(선형 출력+제곱오차), 독립 이진 분류(시그모이드+교차 엔트로피), 다중 분류(소프트맥스+다중 교차 엔트로피) 모두에서 $\partial E_n/\partial a_k=y_k-t_k$. 출력 분포가 지수족이고 활성화가 정준 연결의 역함수일 때의 공통 성질이며, 역전파의 출발점 $\delta_k$가 과제와 무관하게 같은 이유입니다(10단원).` },
  { ch: 'ch07', id: 'infonce-grad', title: 'InfoNCE는 양성 쌍을 맞히는 소프트맥스 분류이다', keys: ['InfoNCE 손실', 'CLIP 손실'],
    tags: 'InfoNCE contrastive loss softmax gradient negatives collapse 대조 학습 InfoNCE 소프트맥스 음성 쌍 붕괴',
    stmt: R`유사도를 $s^+=\mathbf f(\mathbf x)^T\mathbf f(\mathbf x^+)$, $s_n=\mathbf f(\mathbf x)^T\mathbf f(\mathbf x_n^-)$라 하고 $p^+=\frac{e^{s^+}}{e^{s^+}+\sum_ne^{s_n}}$, $p_n=\frac{e^{s_n}}{e^{s^+}+\sum_me^{s_m}}$이라 하면 InfoNCE $E=-\ln p^+$에 대해 $\frac{\partial E}{\partial s^+}=p^+-1\le0$, $\frac{\partial E}{\partial s_n}=p_n\ge0$이다. 음성 예가 없으면 $E\equiv0$이다.`,
    body: R`
$E=-s^++\ln\big(e^{s^+}+\sum_ne^{s_n}\big)$이므로
$$\frac{\partial E}{\partial s^+}=-1+\frac{e^{s^+}}{e^{s^+}+\sum_ne^{s_n}}=p^+-1,\qquad \frac{\partial E}{\partial s_n}=\frac{e^{s_n}}{e^{s^+}+\sum_me^{s_m}}=p_n.$$
경사하강은 $s^+$를 **키우고**(기울기가 음수) 각 $s_n$을 **줄입니다**(기울기가 양수). 이것은 정답 클래스의 로짓이 $s^+$, 오답 클래스들의 로짓이 $s_n$인 $(N+1)$-클래스 소프트맥스 교차 엔트로피와 똑같은 식입니다.

음성 항이 없으면 $p^+=\frac{e^{s^+}}{e^{s^+}}=1$이라 $E=0$이 상수입니다. 이때 “양성 쌍을 가깝게”만 요구하는 손실을 쓰면 모든 입력을 한 점으로 보내는 표현이 최적이 되어 버립니다(붕괴). 음성 쌍이 표현을 서로 밀어내 퍼지게 합니다.`,
    note: R`$\lVert\mathbf f\rVert=1$로 정규화하므로 $s\in[-1,1]$(코사인 유사도)입니다. 실제로는 온도 $T$로 나눈 $s/T$를 쓰는 경우가 많습니다. CLIP 손실은 영상→캡션, 캡션→영상 두 방향의 InfoNCE를 평균한 것입니다.` },
  // ───── 13 합성곱 신경망
  { ch: 'ch13', id: 'feature-detector', title: '반응이 가장 큰 패치는 커널과 같은 방향', keys: ['특징 검출기'], src: 'Bishop 연습문제 10.1',
    tags: 'feature detector kernel Lagrange multiplier Cauchy-Schwarz receptive field 특징 검출기 커널 라그랑주 코시-슈바르츠',
    stmt: R`$\mathbf w$를 고정하고 $\lVert\mathbf x\rVert^2=c$ ($c\gt0$) 제약 아래 $\mathbf w^T\mathbf x$를 최대로 하는 $\mathbf x$는 $\mathbf x=\alpha\mathbf w$ ($\alpha=\sqrt c/\lVert\mathbf w\rVert\gt0$)이다.`,
    body: R`
**라그랑주 승수.** $L(\mathbf x,\lambda)=\mathbf w^T\mathbf x-\frac\lambda2(\lVert\mathbf x\rVert^2-c)$의 정류점은 $\nabla_{\mathbf x}L=\mathbf w-\lambda\mathbf x=\mathbf 0$, 즉 $\mathbf x=\mathbf w/\lambda$. 제약에서 $\lambda=\pm\lVert\mathbf w\rVert/\sqrt c$이고, $\mathbf w^T\mathbf x=\lVert\mathbf w\rVert^2/\lambda$가 최대가 되는 것은 $\lambda\gt0$ 쪽입니다.

**코시-슈바르츠로 확인.** $\mathbf w^T\mathbf x\le\lVert\mathbf w\rVert\lVert\mathbf x\rVert=\lVert\mathbf w\rVert\sqrt c$이고 등호는 $\mathbf x$가 $\mathbf w$의 양수배일 때만 성립하므로 최댓값이 $\lVert\mathbf w\rVert\sqrt c$이고 최대점은 유일합니다.`,
    note: R`유닛 $z=\ReLU(\mathbf w^T\mathbf x+w_0)$는 밝기 배율을 빼면 **커널과 닮은** 패치에서 가장 크게 반응하고, $\mathbf w^T\mathbf x\gt-w_0$일 때만 켜지므로 “커널과 충분히 닮은 패턴을 찾았다”는 검출기입니다.` },
  { ch: 'ch13', id: 'conv-matrix', title: '합성곱층은 희소하고 가중치를 공유하는 완전연결층', keys: ['합성곱(딥러닝의 정의)'], src: 'Bishop 연습문제 10.2',
    tags: 'convolution matrix sparse shared weights Toeplitz fully connected 합성곱 행렬 희소 공유 퇴플리츠',
    stmt: R`입력 $(x_1,\dots,x_5)$에 폭 3인 필터 $(w_1,w_2,w_3)$를 보폭 1로 적용한 1차원 합성곱(편향 제외)은 $\mathbf z=\mathbf W\mathbf x$,
$$\mathbf W=\begin{pmatrix}w_1&w_2&w_3&0&0\\0&w_1&w_2&w_3&0\\0&0&w_1&w_2&w_3\end{pmatrix}$$
인 완전연결층과 같다.`,
    body: R`
정의 $z_j=\sum_{l=1}^3x_{j+l-1}w_l$ ($j=1,2,3$)을 풀어 쓰면 $z_1=w_1x_1+w_2x_2+w_3x_3$, $z_2=w_1x_2+w_2x_3+w_3x_4$, $z_3=w_1x_3+w_2x_4+w_3x_5$. 각 행에서 $x_i$의 계수를 적으면 위 행렬입니다.

- **희소성**: 15개 원소 중 9개만 0이 아니고, 나머지 연결은 없습니다.
- **공유**: 0이 아닌 원소는 $w_1,w_2,w_3$ 세 값의 반복입니다(각 대각선이 상수인 퇴플리츠 행렬).
- 완전연결층은 15개의 독립 모수가 필요하지만 합성곱층은 3개입니다.`,
    note: R`2차원에서도 영상을 벡터로 펼치면 합성곱은 이런 구조의 행렬곱입니다. 이 행렬의 전치가 전치 합성곱(14단원)입니다.` },
  { ch: 'ch13', id: 'conv-equivariance', title: '합성곱은 평행이동에 등변이다', keys: ['합성곱(딥러닝의 정의)'],
    tags: 'translation equivariance convolution shift operator 평행이동 등변성 합성곱 이동',
    stmt: R`$(T_{p,q}I)(j,k)=I(j-p,k-q)$를 영상을 $(p,q)$만큼 옮기는 연산이라 하면(격자 밖은 무시), $C=I*K$에 대해 $(T_{p,q}I)*K=T_{p,q}(I*K)$이다. 원소마다 적용하는 활성화 함수 $h$에 대해서도 $h(T_{p,q}C)=T_{p,q}h(C)$이다.`,
    body: R`
정의대로 계산하면
$$\big((T_{p,q}I)*K\big)(j,k)=\sum_{l,m}(T_{p,q}I)(j+l,k+m)K(l,m)=\sum_{l,m}I(j-p+l,\,k-q+m)K(l,m)=(I*K)(j-p,k-q),$$
마지막 식이 $T_{p,q}(I*K)$의 $(j,k)$ 원소입니다. 활성화는 위치마다 같은 함수를 적용하므로 $h$를 먼저 하든 옮기기를 먼저 하든 같습니다.

따라서 합성곱 → 활성화를 여러 층 쌓아도 전체가 평행이동에 등변입니다. 모든 위치에서 **같은** $K$를 쓴다(가중치 공유)는 것이 핵심이며, 위치마다 다른 가중치를 쓰면 성립하지 않습니다.`,
    note: R`보폭 $S\gt1$이나 풀링이 끼면 $S$의 배수만큼의 이동에 대해서만 정확히 등변이고, 그 밖의 작은 이동에는 근사적으로 불변이 됩니다. 영상의 가장자리(패딩)에서도 정확한 등식이 깨집니다.` },
  { ch: 'ch13', id: 'conv-flip', title: '합성곱과 교차상관: 합의 범위와 뒤집기', keys: ['합성곱(딥러닝의 정의)'], src: 'Bishop 연습문제 10.4·10.5',
    tags: 'convolution cross-correlation flip kernel limits continuous discrete 합성곱 교차상관 뒤집기 연속 이산',
    stmt: R`$J\times K$ 영상 $I$와 $L\times M$ 필터 $K$에 대해 교차상관 $C(j,k)=\sum_{l=0}^{L-1}\sum_{m=0}^{M-1}I(j+l,k+m)K(l,m)$ ($0\le j\le J-L$, $0\le k\le K-M$)이고, 합성곱 $C(j,k)=\sum_{l,m}I(j-l,k-m)K(l,m)$는 필터를 뒤집은 $\tilde K(l,m)=K(L-1-l,M-1-m)$와의 교차상관과 같다(첨자 이동 제외).`,
    body: R`
**범위.** 필터 첨자를 $l=0,\dots,L-1$, $m=0,\dots,M-1$로 두면 $I(j+l,k+m)$이 영상 안에 있으려면 $j+L-1\le J-1$, 즉 $0\le j\le J-L$ (출력 $J-L+1$개). 합성곱 $\sum_{l,m}I(j-l,k-m)K(l,m)$에서는 $L-1\le j\le J-1$.

**뒤집기.** 합성곱에서 $l'=L-1-l$, $m'=M-1-m$으로 바꾸면
$$\sum_{l',m'}I(j-L+1+l',\,k-M+1+m')\,K(L-1-l',M-1-m')=\sum_{l',m'}I(j'+l',k'+m')\tilde K(l',m'),$$
($j'=j-L+1$, $k'=k-M+1$). 즉 뒤집은 필터와의 교차상관입니다.

**연속형과의 관계.** $F(x)=\int G(y)k(x-y)\,dy$를 폭 $\Delta$인 점 $y_i=i\Delta$로 근사하면 $F(x_j)\approx\sum_iG(y_i)k(x_j-y_i)\Delta$로, $k$를 $K$로 보면 이산 합성곱입니다. 필터가 유한한 폭이면 합이 유한합니다.`,
    note: R`필터는 학습되므로 망이 뒤집힌 필터를 배우면 되고, 그래서 딥러닝은 계산이 단순한 교차상관을 “합성곱”이라 부릅니다.` },
  { ch: 'ch13', id: 'conv-example', title: '4×4 입력과 2×2 필터의 합성곱 계산', keys: ['합성곱(딥러닝의 정의)'], src: 'Bishop 연습문제 10.3',
    tags: 'convolution worked example 4x4 2x2 합성곱 계산 예제',
    stmt: R`$$I=\begin{pmatrix}2&5&-3&0\\0&6&0&-4\\-1&-3&0&2\\5&0&0&3\end{pmatrix},\quad K=\begin{pmatrix}-2&0\\4&6\end{pmatrix}\ \Longrightarrow\ I*K=\begin{pmatrix}32&14&-18\\-22&-24&12\\22&6&18\end{pmatrix}.$$`,
    body: R`
출력은 $(4-2+1)\times(4-2+1)=3\times3$. $C(j,k)=-2I(j,k)+0\cdot I(j,k+1)+4I(j+1,k)+6I(j+1,k+1)$이므로
- 첫 행: $-4+0+36=32$, $-10+24+0=14$, $6+0-24=-18$
- 둘째 행: $0-4-18=-22$, $-12-12+0=-24$, $0+0+12=12$
- 셋째 행: $2+20+0=22$, $6+0+0=6$, $0+0+18=18$

(각 항은 차례로 $-2I(j,k)$, $4I(j+1,k)$, $6I(j+1,k+1)$; $K(0,1)=0$이라 $I(j,k+1)$ 항은 빠짐.)`,
    note: R`수학적 합성곱(필터를 뒤집음)으로 계산하면 $\tilde K=\begin{pmatrix}6&4\\0&-2\end{pmatrix}$와의 교차상관이라 다른 결과가 나옵니다. 시험에서는 어느 정의를 쓰는지 확인하세요. 딥러닝 교재·강의의 정의는 교차상관입니다.` },
  { ch: 'ch13', id: 'fmap-size', title: '패딩·보폭이 있을 때 특징 맵의 크기', keys: ['특징 맵의 크기'], src: 'Bishop 연습문제 10.6·10.7',
    tags: 'output size padding stride same valid convolution floor 출력 크기 패딩 보폭 같은 합성곱 유효 합성곱',
    stmt: R`한 변이 $J$인 영상을 $P$만큼 0 패딩하고 $M\times M$ 커널을 보폭 $S$로 적용하면 출력 한 변은 $\lfloor\frac{J+2P-M}S\rfloor+1$이다. $S=1$, $M$ 홀수일 때 $P=\frac{M-1}2$이면 출력이 입력과 같은 크기(같은 합성곱)이다.`,
    body: R`
패딩 후 길이는 $J+2P$이고 위치를 $0,\dots,J+2P-1$로 번호 매깁니다. $t$번째 창($t=0,1,\dots$)은 $tS$에서 시작해 $tS+M-1$에서 끝나므로, 영상 안에 들어가려면 $tS+M-1\le J+2P-1\iff t\le\frac{J+2P-M}S$. 조건을 만족하는 정수 $t\ge0$의 개수가 $\lfloor\frac{J+2P-M}S\rfloor+1$입니다. 가로도 같습니다.

$S=1$이면 $J+2P-M+1$이고, 이것이 $J$와 같으려면 $2P=M-1$, 즉 $P=\frac{M-1}2$. $M$이 홀수여야 정수입니다. $P=0$이면 유효 합성곱으로 $J-M+1$.`,
    note: R`예: VGG의 $3\times3$, $P=1$, $S=1$은 크기를 유지하고, $2\times2$ 최대 풀링 $S=2$는 $\lfloor(J-2)/2\rfloor+1=J/2$로 절반을 만듭니다. 나눗셈이 딱 떨어지지 않으면 마지막 창이 삐져나가 버려집니다(내림).` },
  { ch: 'ch13', id: 'conv-params', title: '합성곱층의 모수와 VGG-16의 1억 3,800만', keys: ['다채널 합성곱층'], src: 'Bishop 연습문제 10.8',
    tags: 'parameters count convolutional layer VGG-16 138 million 모수 개수 합성곱층 VGG',
    stmt: R`입력 채널 $C_{\text{IN}}$, 출력 채널 $C_{\text{OUT}}$, $M\times M$ 커널인 합성곱층의 독립 모수는 $(M^2C_{\text{IN}}+1)C_{\text{OUT}}$개이고, VGG-16 전체는 $138{,}357{,}544$개이다.`,
    body: R`
출력 채널 하나는 $M\times M\times C_{\text{IN}}$ 필터(가중치 $M^2C_{\text{IN}}$개)와 편향 1개를 가지며 모든 위치에서 공유되므로, 출력 채널 $C_{\text{OUT}}$개면 $(M^2C_{\text{IN}}+1)C_{\text{OUT}}$개. 영상 크기와 무관합니다.

VGG-16의 합성곱층($M=3$): $3\to64$: 1,792 / $64\to64$: 36,928 / $64\to128$: 73,856 / $128\to128$: 147,584 / $128\to256$: 295,168 / $256\to256$ 두 개: 590,080씩 / $256\to512$: 1,180,160 / $512\to512$ 다섯 개: 2,359,808씩. 합 14,714,688.
완전연결층: $(25{,}088+1)\cdot4{,}096=102{,}764{,}544$, $(4{,}096+1)\cdot4{,}096=16{,}781{,}312$, $(4{,}096+1)\cdot1{,}000=4{,}097{,}000$. 합 123,642,856.
전체 $14{,}714{,}688+123{,}642{,}856=138{,}357{,}544$.`,
    note: R`모수의 74%가 첫 완전연결층에 있습니다. 반면 연결(곱셈) 수는 해상도가 큰 앞쪽 합성곱층이 가장 많습니다: 첫 합성곱층만 $224^2\cdot64\cdot27\approx8.7\times10^7$번의 곱셈.` },
  { ch: 'ch13', id: 'separable', title: '분리 가능한 커널은 1차원 합성곱 두 번', keys: ['합성곱(딥러닝의 정의)'], src: 'Bishop 연습문제 10.9',
    tags: 'separable kernel two 1D convolutions efficiency Sobel 분리 가능 커널 1차원 합성곱 효율',
    stmt: R`$K(l,m)=F(l)G(m)$이면 $C(j,k)=\sum_lF(l)\,D(j+l,k)$, $D(j,k)=\sum_mG(m)I(j,k+m)$이다. $M\times M$ 커널일 때 출력 한 점당 곱셈이 $M^2$번에서 $2M$번으로 준다.`,
    body: R`
$$C(j,k)=\sum_l\sum_mI(j+l,k+m)F(l)G(m)=\sum_lF(l)\underbrace{\sum_mG(m)I(j+l,k+m)}_{D(j+l,k)}.$$
먼저 각 행을 $G$로 가로 합성곱해 $D$를 만들고(점당 $M$번), 그 결과를 $F$로 세로 합성곱합니다(점당 $M$번). $D$의 각 값은 여러 출력에서 재사용되므로 전체 곱셈이 약 $2M$번/점입니다.`,
    note: R`예: 소벨 필터 $\begin{pmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{pmatrix}=\begin{pmatrix}1\\2\\1\end{pmatrix}(-1\ 0\ 1)$. $M=7$이면 49번 대 14번. 모든 커널이 분리 가능하지는 않습니다(계수 1인 행렬만).` },
  { ch: 'ch13', id: 'receptive', title: '유효 수용 영역 L(M − 1) + 1', keys: ['유효 수용 영역'],
    tags: 'receptive field depth stacking 3x3 filters VGG 수용 영역 깊이',
    stmt: R`보폭 1, 크기 $M$인 합성곱층을 $L$개 쌓으면 맨 위 유닛이 의존하는 입력은 한 변이 $L(M-1)+1$인 영역이다. 같은 수용 영역을 한 층 $\big(L(M-1)+1\big)^2C^2$개 가중치 대신 $LM^2C^2$개로 얻는다.`,
    body: R`
귀납법. $L=1$이면 $M=1\cdot(M-1)+1$. 층 $L$의 유닛이 입력 쪽 한 변 $r_L$에 의존한다고 합시다. 층 $L+1$의 유닛은 층 $L$에서 연속한 $M$개 유닛을 보고, 이웃한 두 유닛의 수용 영역은 보폭 1이라 입력에서 한 칸씩 어긋나 있으므로 합집합의 한 변은 $r_L+(M-1)$. 따라서 $r_{L+1}=r_L+M-1$, $r_L=L(M-1)+1$.

모수: 채널이 모두 $C$이면 한 층은 $M^2C^2$개(편향 제외), $L$층은 $LM^2C^2$개. $M=3$, $L=3$이면 수용 영역 7 — $7\times7$ 한 층은 $49C^2$, $3\times3$ 세 층은 $27C^2$.`,
    note: R`작은 필터를 쌓으면 모수가 적을 뿐 아니라 층 사이에 비선형성이 들어가 표현력도 커집니다. 큰 필터가 작은 필터들의 합성으로 표현된다는 귀납적 편향을 주는 셈입니다(VGG의 설계 원칙). 풀링·보폭이 끼면 수용 영역이 더 빨리 커집니다.` },
  { ch: 'ch13', id: 'maxpool-inv', title: '최대 풀링의 국소 불변성과 채널 수 보존', keys: ['풀링'],
    tags: 'max pooling local translation invariance downsampling channels 최대 풀링 국소 평행이동 불변 다운샘플링',
    stmt: R`겹치지 않는 $s\times s$ 블록의 최대 풀링 $P$에 대해, 각 블록의 최댓값이 **같은 블록 안에서만** 움직이는 변화(값의 집합은 그대로)에는 $P$의 출력이 변하지 않는다. 채널마다 따로 적용하므로 $H\times W\times C$ 입력은 $\frac Hs\times\frac Ws\times C$가 된다.`,
    body: R`
블록 $B$의 출력은 $\max_{(i,j)\in B}a_{ij}$이고, 최댓값은 블록 안 원소들의 **집합**에만 의존하며 위치에는 의존하지 않습니다. 따라서 블록 안에서 원소들이 자리를 바꾸는(예: 한 칸 이동이 블록 경계를 넘지 않는) 변화에는 출력이 같습니다. 이동이 블록 경계를 넘으면 원소가 이웃 블록으로 넘어가 값이 바뀔 수 있으므로 불변성은 **국소적**입니다.

크기: 한 변에서 블록 수가 $\lfloor\frac{H-s}s\rfloor+1=\frac Hs$ ($s\mid H$). 채널마다 같은 연산을 따로 하므로 채널 수 $C$는 그대로이고 학습할 모수는 없습니다. 예: $64\times64\times8$, $2\times2$, 보폭 2 → $32\times32\times8$.`,
    note: R`여러 채널에 걸쳐 최대를 취하면(같은 특징을 다른 방향으로 검출하는 채널들) 근사적인 회전 불변성도 얻습니다. 평균 풀링도 블록 안의 순열에는 불변입니다.` },
  // ───── 14 CNN의 해석과 활용
  { ch: 'ch14', id: 'gradcam-cam', title: 'Grad-CAM은 전역 평균 풀링 모델에서 CAM과 같다', keys: ['Grad-CAM'],
    tags: 'Grad-CAM CAM global average pooling saliency gradient 돌출 맵 전역 평균 풀링',
    stmt: R`마지막 합성곱층 뒤에 전역 평균 풀링과 선형층만 있어 $a^{(c)}=\sum_kw_k^{c}\,\frac1{M_k}\sum_{i,j}a_{ij}^{(k)}+b^c$이면 Grad-CAM의 가중치는 $\alpha_k=w_k^c/M_k$이고 $\mathbf L=\sum_k\frac{w_k^c}{M_k}\mathbf A^{(k)}$는 클래스 활성 맵(CAM)과 상수배만 다르다.`,
    body: R`
$a^{(c)}$는 $a_{ij}^{(k)}$에 대해 선형이므로 $\frac{\partial a^{(c)}}{\partial a_{ij}^{(k)}}=\frac{w_k^c}{M_k}$로 위치와 무관합니다. 채널 안에서 평균내면
$$\alpha_k=\frac1{M_k}\sum_{i,j}\frac{w_k^c}{M_k}=\frac{w_k^c}{M_k}.$$
모든 채널의 크기가 같으면($M_k=M$) $\mathbf L=\frac1M\sum_kw_k^c\mathbf A^{(k)}$이고, 이는 “클래스 $c$의 가중치로 특징 맵을 섞은” CAM입니다. 또 $\sum_{i,j}L_{ij}=\sum_kw_k^c\bar a^{(k)}=a^{(c)}-b^c$라, 열지도의 합이 곧 클래스 점수(편향 제외)입니다.`,
    note: R`일반적인 망(뒤에 완전연결층 여러 개)에서는 기울기가 위치마다 달라 평균 $\alpha_k$가 근사가 됩니다. 그래서 Grad-CAM은 구조를 바꾸지 않고 어떤 CNN에도 쓸 수 있는 CAM의 일반화입니다. 원 논문은 음수 기여를 지우려고 $\ReLU(\mathbf L)$을 씁니다.` },
  { ch: 'ch14', id: 'fgsm-opt', title: 'FGSM은 최대노름 제약 아래 1차 근사 오차를 최대로 키운다', keys: ['FGSM'],
    tags: 'FGSM adversarial attack sign gradient max norm linear approximation 적대적 공격 부호 기울기 최대노름',
    stmt: R`$\lVert\boldsymbol\delta\rVert_\infty\le\epsilon$인 섭동 중 1차 근사 $E(\mathbf x+\boldsymbol\delta,t)\approx E(\mathbf x,t)+\boldsymbol\delta^T\nabla_{\mathbf x}E$를 최대로 하는 것은 $\boldsymbol\delta=\epsilon\operatorname{sign}(\nabla_{\mathbf x}E)$이고, 그때 증가량은 $\epsilon\lVert\nabla_{\mathbf x}E\rVert_1$이다.`,
    body: R`
$\boldsymbol\delta^T\mathbf g=\sum_i\delta_ig_i$ ($\mathbf g=\nabla_{\mathbf x}E$)는 성분마다 따로 최대화할 수 있고, $\lvert\delta_i\rvert\le\epsilon$에서 $\delta_ig_i\le\epsilon\lvert g_i\rvert$, 등호는 $\delta_i=\epsilon\operatorname{sign}(g_i)$ ($g_i\ne0$). 합하면 최댓값 $\epsilon\sum_i\lvert g_i\rvert=\epsilon\lVert\mathbf g\rVert_1$.

**차원이 크면 위험한 이유.** 모든 $\lvert g_i\rvert\approx\gamma$라면 증가량이 $\epsilon\gamma D$로 차원 $D$에 비례합니다. 화소마다 사람이 못 느낄 만큼 작은 $\epsilon$이라도 수백만 화소에서 쌓이면 결정을 뒤집을 만큼 커집니다. 선형 모델 $a=\mathbf w^T\mathbf x$에서도 $a$가 $\epsilon\lVert\mathbf w\rVert_1$만큼 바뀌므로, 이 취약성은 과적합이 아니라 고차원의 선형성에서 옵니다.`,
    note: R`기울기는 역전파로 구하며, 학습과 달리 가중치는 고정하고 **입력**에 대해 미분합니다. 한 망에 맞춘 적대적 영상이 다른 망도 속이는 전이 현상도 같은 설명으로 이해됩니다.` },
  { ch: 'ch14', id: 'deepdream-grad', title: 'DeepDream 갱신은 F(I) = Σa²의 경사 상승이다', keys: ['DeepDream'], src: 'Bishop 연습문제 10.10',
    tags: 'DeepDream backpropagation delta pre-activation gradient ascent image 역전파 경사 상승 영상',
    stmt: R`선택한 층의 사전활성 $a_{ijk}(\mathbf I)$에 대해 $F(\mathbf I)=\sum_{i,j,k}a_{ijk}(\mathbf I)^2$이면, 그 층의 역전파 변수를 $\delta_{ijk}=a_{ijk}$로 두고 입력까지 역전파해 얻은 벡터는 $\frac12\nabla_{\mathbf I}F$이다.`,
    body: R`
연쇄법칙으로
$$\frac{\partial F}{\partial I_p}=\sum_{i,j,k}\frac{\partial F}{\partial a_{ijk}}\frac{\partial a_{ijk}}{\partial I_p}=\sum_{i,j,k}2a_{ijk}\frac{\partial a_{ijk}}{\partial I_p}.$$
역전파는 층의 변수 $\delta_{ijk}=\partial(\cdot)/\partial a_{ijk}$가 주어지면 $\sum_{ijk}\delta_{ijk}\,\partial a_{ijk}/\partial I_p$를 입력의 모든 $p$에 대해 한 번에 계산하는 알고리즘입니다(10단원). $\delta_{ijk}=a_{ijk}$로 두면 결과는 $\sum a_{ijk}\partial a_{ijk}/\partial I_p=\frac12\partial F/\partial I_p$. 그 방향으로 영상을 조금 바꾸는 것($\mathbf I\leftarrow\mathbf I+\eta\nabla_{\mathbf I}F$)이 $F$를 키우는 경사 상승입니다.`,
    note: R`가중치는 고정하고 화소만 바꿉니다. 매끄러운 영상을 얻으려고 공간 평활화와 화소 자르기를 규제로 섞습니다. 목표 함수만 바꾸면(클래스 점수, 오차) 활성 최대화·적대적 공격과 같은 틀입니다.` },
  { ch: 'ch14', id: 'iou-props', title: 'IoU의 성질: 0과 1 사이, 척도 불변', keys: ['IoU'],
    tags: 'IoU intersection over union bounds scale invariance Jaccard 교집합 합집합 척도 불변 자카드',
    stmt: R`두 상자 $A$, $B$(넓이가 양수)에 대해 $\text{IoU}=\frac{\lvert A\cap B\rvert}{\lvert A\cup B\rvert}\in[0,1]$이고, $\text{IoU}=1\iff A=B$, $\text{IoU}=0\iff$ 두 상자의 겹침의 넓이가 0이다. 두 상자를 같은 배율로 늘이거나 함께 옮겨도 IoU는 변하지 않는다.`,
    body: R`
$A\cap B\subseteq A\cup B$이므로 $0\le\lvert A\cap B\rvert\le\lvert A\cup B\rvert$, 따라서 $0\le\text{IoU}\le1$. 등호 $\text{IoU}=1$이면 $\lvert A\cup B\setminus A\cap B\rvert=0$이라 (닫힌 직사각형이므로) $A=B$. $\text{IoU}=0\iff\lvert A\cap B\rvert=0$.

좌표를 $\mathbf x\mapsto s\mathbf x+\mathbf c$ ($s\gt0$)로 바꾸면 모든 넓이가 $s^2$배가 되고 평행이동은 넓이를 바꾸지 않으므로 비가 그대로입니다. 반면 “겹친 넓이”만 쓰면 $s^2$배로 바뀌어 물체 크기에 의존합니다.`,
    note: R`예측이 정답 안에 완전히 들어가면 교집합 = 예측이라 “겹침/예측 넓이”는 1이지만, IoU $=\lvert B\rvert/\lvert A\rvert$로 정답의 놓친 부분만큼 작아집니다. 겹침이 없으면 IoU가 0으로 평평해 기울기가 없으므로 손실보다는 평가 지표로 씁니다.` },
  { ch: 'ch14', id: 'objectness', title: '배경 클래스와 물체 유무 확률의 관계', keys: ['경계 상자'], src: 'Bishop 연습문제 10.11',
    tags: 'object detection background class objectness probability product rule 물체 검출 배경 클래스 곱의 규칙',
    stmt: R`$(C+1)$-클래스 출력 $p_0$(배경), $p_1,\dots,p_C$와, 물체 유무 확률 $\pi$ 및 물체일 때의 클래스 확률 $q_1,\dots,q_C$ ($\sum q_k=1$) 사이에는 $p_0=1-\pi$, $p_k=\pi q_k$, 거꾸로 $\pi=\sum_{k\ge1}p_k$, $q_k=p_k/(1-p_0)$의 관계가 있다.`,
    body: R`
사건 “클래스 $k$의 물체가 있다”는 “물체가 있다”와 “그 물체가 $k$이다”의 결합이므로 곱의 규칙으로 $p_k=p(\text{물체})\,p(k\mid\text{물체})=\pi q_k$. 배경은 물체가 없는 사건이라 $p_0=1-\pi$. 합이 $1-\pi+\pi\sum_kq_k=1$로 맞습니다. 거꾸로 합의 규칙으로 $\pi=\sum_{k\ge1}p_k=1-p_0$, $q_k=p_k/\pi$.`,
    note: R`두 표현은 같은 분포를 다르게 매개화한 것입니다. 이진 “물체다움” 출력을 따로 두면 문턱을 하나로 정해 후보를 거르기 쉽습니다(영역 제안망의 방식).` },
  { ch: 'ch14', id: 'slide-cost', title: '합성곱 슬라이딩 윈도의 계산 절약', keys: [], src: 'Bishop 연습문제 10.12',
    tags: 'sliding window computational cost fully convolutional efficiency 슬라이딩 윈도 계산량 완전 합성곱',
    stmt: R`$6\times6$ 입력, $3\times3$ 합성곱(보폭 1), $2\times2$ 최대 풀링(보폭 2), 완전연결 출력 1개인 망의 순전파 곱셈은 148번이다. 같은 망을 $8\times8$ 영상에 합성곱 형태로 한 번 적용하면 340번이고, $6\times6$ 창을 보폭 1로 9번 따로 적용하면 1,332번이다(약 3.9배).`,
    body: R`
(편향, 활성화, 풀링의 비교 연산은 세지 않음.) 작은 망: 합성곱 출력 $4\times4=16$개에 9번씩 $144$, 풀링 출력 $2\times2$, 완전연결 4번. 합 148.
큰 영상: 합성곱 출력 $6\times6=36$개에 9번씩 $324$, 풀링 $3\times3$, 완전연결을 $2\times2$ 합성곱으로 보면 출력 $2\times2$개에 4번씩 16. 합 340.
보폭 1인 창은 $(8-6+1)^2=9$개이므로 따로 돌리면 $9\times148=1{,}332$, 비율 $1332/340\approx3.92$. 겹치는 창들이 합성곱 출력의 대부분을 공유하기 때문입니다.`,
    note: R`합성곱 형태의 출력 $2\times2$개는 풀링 보폭 때문에 2화소 간격의 창 4개에 해당합니다. 1화소 간격의 창까지 원하면 풀링 보폭을 조정해야 합니다. 이 효율 덕분에 검출·분할을 한 번의 순전파로 합니다.` },
  { ch: 'ch14', id: 'tconv-transpose', title: '전치 합성곱은 합성곱 행렬의 전치이다', keys: ['전치 합성곱'], src: 'Bishop 연습문제 10.13',
    tags: 'transpose convolution fractionally strided upsampling matrix transpose 전치 합성곱 업샘플링 행렬',
    stmt: R`패딩한 입력 $\mathbf v=(0,x_1,x_2,x_3,x_4,0)$에 필터 $(w_1,w_2,w_3)$를 보폭 2로 적용하면 $\mathbf y=\mathbf A\mathbf v$, $\mathbf A=\begin{pmatrix}w_1&w_2&w_3&0&0&0\\0&0&w_1&w_2&w_3&0\end{pmatrix}$. 같은 필터로 $(z_1,z_2)$를 출력 보폭 2로 업샘플링하고 겹치는 값을 더하면 결과는 $\mathbf A^T\mathbf z$이다.`,
    body: R`
**다운샘플링.** 보폭 2이므로 창의 시작 위치가 1과 3(1부터 셈): $y_1=w_1v_1+w_2v_2+w_3v_3$, $y_2=w_1v_3+w_2v_4+w_3v_5$ ($v_6$은 창이 넘쳐 쓰이지 않음). 계수를 행으로 적으면 $\mathbf A$입니다.

**업샘플링.** 입력 $z_1$은 출력 위치 1–3에 $(w_1z_1,w_2z_1,w_3z_1)$을, $z_2$는 출력에서 두 칸 뒤인 위치 3–5에 $(w_1z_2,w_2z_2,w_3z_2)$를 뿌립니다. 위치 3에서 겹치므로 더하면
$$(w_1z_1,\ w_2z_1,\ w_3z_1+w_1z_2,\ w_2z_2,\ w_3z_2,\ 0)^T.$$
$\mathbf A^T\mathbf z$를 계산하면 $\mathbf A^T$의 $i$행은 $\mathbf A$의 $i$열이므로 $(w_1z_1,\,w_2z_1,\,w_3z_1+w_1z_2,\,w_2z_2,\,w_3z_2,\,0)$으로 정확히 같습니다.`,
    note: R`$\mathbf A$는 $2\times6$이라 역행렬이 없고 $\mathbf A^T$는 모양만 되돌릴 뿐 값을 되돌리지 않습니다. 그래서 “디컨볼루션”(역연산)이라는 이름은 피하는 것이 좋습니다. 필터 값은 업샘플링용으로 따로 학습합니다.` },
  { ch: 'ch14', id: 'gram-props', title: '스타일 행렬은 대칭·양의 준정부호이고 위치에 무관하다', keys: ['스타일 전이의 오차함수'],
    tags: 'style matrix Gram matrix symmetric positive semidefinite position invariance style transfer 스타일 행렬 그람 행렬 대칭 양의 준정부호',
    stmt: R`층의 특징을 $\mathbf A\in\mathbb R^{IJ\times K}$(행: 위치 $(i,j)$, 열: 채널 $k$)로 모으면 스타일 행렬은 $\mathbf F=\mathbf A^T\mathbf A$이고, 대칭·양의 준정부호이며 위치(행)의 순서를 바꿔도 변하지 않는다.`,
    body: R`
$(\mathbf A^T\mathbf A)_{kk'}=\sum_{(i,j)}a_{ijk}a_{ijk'}=F_{kk'}$. 대칭은 $F_{kk'}=F_{k'k}$에서 바로 나오고, 임의의 $\mathbf u\in\mathbb R^K$에 대해 $\mathbf u^T\mathbf F\mathbf u=\lVert\mathbf A\mathbf u\rVert^2\ge0$이라 양의 준정부호입니다. 위치의 순서를 바꾸는 것은 $\mathbf A\to\mathbf P\mathbf A$ ($\mathbf P$: 순열 행렬, $\mathbf P^T\mathbf P=\mathbf I$)이고 $(\mathbf P\mathbf A)^T\mathbf P\mathbf A=\mathbf A^T\mathbf A$입니다.

따라서 스타일 오차는 특징들이 **어디서** 나타나는지는 보지 않고 **어떤 특징이 함께** 나타나는지만 비교합니다. 내용 오차 $\sum_{ijk}\{a_{ijk}(\mathbf G)-a_{ijk}(\mathbf C)\}^2=\lVert\mathbf A(\mathbf G)-\mathbf A(\mathbf C)\rVert_F^2$는 위치별로 비교하므로 순서가 중요합니다.`,
    note: R`정규화 계수 $\frac1{(2IJK)^2}$은 층마다 크기가 다른 특징 맵의 기여를 비슷한 척도로 맞춥니다. 여러 층의 $E^{(l)}_{\text{style}}$을 $\lambda_l$로 가중해 더합니다.` },
  );
})();
