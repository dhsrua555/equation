/* 19 순환 신경망과 시간 역전파 — 9주차 수요일 슬라이드 1–17 (Recurrent Neural Networks and Applications)와 슬라이드 9 뒤의 필기.
   업로드된 PDF에는 슬라이드 11–12가 없습니다. 필기는 두 단계 RNN의 기울기 유도 옆에 “Quiz 2 (11/04)”라고 적어 두었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 19, part: 'G', title: '순환 신경망과 시간 역전파', en: 'Recurrent Networks & BPTT', ref: 'W9 수 · 슬라이드 1–17', plot: 'rnngrad',
    fig: R`야코비안 인수의 곱 $\gamma^k$의 로그: 걸음 수 $k$가 늘수록 $\gamma>1$인 곡선은 위로 폭발하고 $\gamma<1$인 곡선은 아래로 소실하며, 점선은 기울기 잘라내기의 문턱이다`,
    tagline: R`같은 함수와 같은 매개변수를 시점마다 되풀이하는 RNN은 은닉 상태 $h_t$로 지나온 순서를 기억합니다. 펼치면 아주 깊은 망이 되어, 역전파는 시간을 거슬러 올라가며 야코비안을 곱하고 — 그 곱이 기울기를 폭발시키거나 소실시킵니다.`,
    summary: R`문장·음성·동영상처럼 길이가 제각각이고 순서가 중요한 자료를 다루는 **순환 신경망**(RNN)을 봅니다. 입출력의 모양에 따른 다섯 구조(one to one, one to many, many to one, 두 가지 many to many)에서 출발해, **바닐라 RNN** $h_t=\sigma(Uh_{t-1}+Wx_t+b)$를 시간 방향으로 펼치면 모든 시점이 같은 가중치를 쓰는 긴 계산 그래프가 됨을 봅니다. 학습은 이 그래프 위의 역전파, 곧 **시간 역전파**(BPTT)이고, 긴 순서열에서는 최근 몇 걸음만 역전파하는 **잘린 BPTT**를 씁니다. 수업 필기를 따라 **두 단계 스칼라 RNN의 기울기** $\partial L/\partial V,\partial L/\partial c,\partial L/\partial W,\partial L/\partial U,\partial L/\partial b$를 경로마다 연쇄법칙으로 유도하고(Quiz 2 범위로 표시된 부분), 이를 여러 단계로 넓혀 $\partial\mathcal L/\partial h_\ell$이 야코비안 $\partial h_{k+1}/\partial h_k$의 곱이라는 **역방향 점화식**을 얻습니다. 마지막으로 그 곱 때문에 생기는 **기울기 폭발**(잘라내기로 해결)과 **기울기 소실**(LSTM으로 이어짐)을 다룹니다.`,
    goals: [
      R`RNN이 필요한 이유(가변 길이 순차 데이터)와 입출력 구조 다섯 가지를 예와 함께 말할 수 있다`,
      R`바닐라 RNN의 순전파를 쓰고, 펼친 그래프와 매개변수 공유의 의미, 매개변수 수가 길이와 무관함을 설명할 수 있다`,
      R`시간 역전파(BPTT)와 잘린 BPTT가 무엇을 계산하고 무엇을 버리는지 설명할 수 있다`,
      R`두 단계 스칼라 RNN에서 $\partial L/\partial V$, $\partial L/\partial c$, $\partial L/\partial W$, $\partial L/\partial U$, $\partial L/\partial b$를 경로별 연쇄법칙으로 유도하고, $h_0=0$일 때 사라지는 항을 짚을 수 있다`,
      R`여러 단계 RNN에서 $\partial\mathcal L/\partial\tilde\theta=\sum_\ell\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial q}{\partial\tilde\theta}$와 역방향 점화식 $\delta_\ell=\delta_{\ell+1}\diag(\phi'(a_{\ell+1}))W$를 유도할 수 있다`,
      R`야코비안 곱의 상한 $(\gamma\lVert W\rVert_2)^{L-\ell}$으로 기울기 소실·폭발의 조건을 설명할 수 있다`,
      R`기울기 잘라내기 $g\leftarrow\min(1,v/\lVert g\rVert)g$의 성질을 보이고, 기울기 소실이 왜 더 큰 문제인지 설명할 수 있다`,
    ],
    secTitles: { '19.1': '왜 RNN인가', '19.2': '바닐라 RNN', '19.3': 'BPTT', '19.4': '두 단계 기울기', '19.5': '여러 단계 역전파', '19.6': '폭발·소실' },
    sections: [
      { k: '19.1', src: 'W9 수 · 슬라이드 2–3 필기', title: '왜 RNN인가: 순차 데이터와 다섯 가지 구조', body: R`
:::idea 쉽게 말하면
지금까지의 망(MLP·CNN)은 크기가 정해진 입력 하나를 받아 출력 하나를 냅니다. 그런데 문장, 음성, 동영상, 주가처럼 **길이가 제각각이고 순서가 중요한** 자료가 많습니다. 순환 신경망(RNN)은 원소를 하나씩 읽으며 지금까지 본 것을 **은닉 상태**에 요약해 두고, 그 상태와 다음 원소로 상태를 새로 고칩니다.
:::

**순차 데이터.** 슬라이드 3의 한 줄 요약은 “RNN은 **순차(또는 가변 길이) 데이터**를 처리하거나 생성하기 위한 망”입니다. 입력과 출력 가운데 어느 쪽이 순서열인지에 따라 다섯 구조로 나눕니다(슬라이드의 빨간 칸이 입력, 초록 칸이 은닉 상태, 파란 칸이 출력).

| 구조 | 입력 → 출력 | 예 (슬라이드 3) |
|---|---|---|
| one to one | 벡터 하나 → 벡터 하나 | 보통의 신경망(FFN, 순환 없음) |
| one to many | 하나 → 순서열 | 이미지 → 동영상, 이미지 → 설명문(캡션) |
| many to one | 순서열 → 하나 | 동영상 분류, 행동 인식 |
| many to many (지연형) | 순서열을 다 읽은 뒤 → 순서열 | 번역(영어 → 한국어), 동영상 → 설명문 |
| many to many (동기형) | 시점마다 입력 하나 → 출력 하나 | 동영상 분할, 동영상 편집, 동영상 스타일 변환 |

:::key RNN의 입출력 구조
RNN은 순서열 $x_1,\dots,x_T$를 한 원소씩 읽으며 시점마다 은닉 상태 $h_t$를 갱신한다. 출력을 언제 내느냐에 따라 one to many, many to one, many to many(입력을 다 읽은 뒤 내는 지연형, 시점마다 내는 동기형)로 나뉘고, one to one은 순환이 없는 보통의 신경망이다.
:::

**필기의 시점 표시** (슬라이드 2). many to one에는 입력 칸 아래에 $t=1,2,3$을 적고 출력은 $t=3$에만 있습니다. 지연형 many to many에는 입력에 $t=1,2,3$, 출력에 $t=4,5,6$을 적었습니다. 번역에서 문장을 끝까지 읽어야 첫 단어를 정할 수 있는 것과 같습니다.

**왜 MLP로는 안 되는가.** MLP의 입력 크기는 고정되어 있어 길이가 다른 문장을 그대로 넣을 수 없고, 가장 긴 길이에 맞춰 0을 채우면 매개변수가 길이에 비례해 늘어납니다. 더 큰 문제는 위치마다 다른 가중치를 쓰므로 3번째 자리에서 배운 패턴(예: “not good”)을 10번째 자리에서 다시 배워야 한다는 점입니다. RNN은 **모든 시점에 같은 가중치**를 써서 두 문제를 함께 풉니다(19.2).

### 더 깊이

합성곱층이 공간의 모든 위치에 같은 필터를 쓰듯[[ch15:15.6|합성곱층의 가중치 공유와 이동 등변성.]], RNN은 시간의 모든 시점에 같은 갱신 규칙을 씁니다. 차이는 합성곱의 출력이 근처 몇 칸만 보는 반면, RNN의 $h_t$는 원리적으로 $x_1,\dots,x_t$ **전부**에 의존한다는 점입니다. 이 무제한의 기억이 장점이자, 19.6에서 볼 기울기 문제의 원인입니다.
` },
      { k: '19.2', src: 'W9 수 · 슬라이드 4–7 필기', title: '바닐라 RNN과 펼친 그래프', body: R`
:::idea 쉽게 말하면
RNN은 자기 자신으로 돌아오는 고리가 달린 망입니다. 고리를 시간 방향으로 펼치면 같은 칸이 시점마다 복사된 긴 사슬이 되고, 모든 칸이 **같은 가중치**를 씁니다. 그래서 사슬이 아무리 길어도 매개변수의 수는 그대로입니다.
:::

**내부 상태** (슬라이드 4). 핵심 아이디어: RNN은 순서열을 처리하면서 갱신되는 **내부 상태**(internal state)를 가집니다. 그림의 RNN 칸에서 자기 자신으로 돌아오는 화살표가 그 상태입니다.

**펼친 RNN** (슬라이드 5). 시점마다 입력 $x_t$를 받아 상태를 고치고 출력 $y_t$를 냅니다. 필기는 이를 $h_t=f(h_{t-1},x_t)$, $y_t=g(h_t)$로 적었습니다. $h_2$는 $x_2$와 $h_1$로 정해지고, $h_1$에는 $x_1$의 정보가 들어 있습니다.

:::key 바닐라 RNN
$$\mathbf h_t=\sigma(\mathbf U\mathbf h_{t-1}+\mathbf W\mathbf x_t+\mathbf b),\qquad\hat{\mathbf y}_t=\mathbf W^{out}\mathbf h_t,\qquad\mathbf h_0=\mathbf 0\qquad(t\ge1)$$
$\mathbf U$는 은닉 → 은닉(순환), $\mathbf W$는 입력 → 은닉, $\mathbf W^{out}$은 은닉 → 출력 가중치이다(슬라이드 6의 표기). **모든 시점에서 같은 함수와 같은 매개변수**를 쓴다.
:::

:::fig rnnunroll
:::

:::hand 수업 필기 — 처음 두 시점 (슬라이드 6)
$t=1$, 입력 $\mathbf x_1$: $\mathbf h_1=\sigma(\mathbf W\mathbf x_1+\mathbf b)\ \to\ \hat{\mathbf y}_1=\mathbf W^{out}\mathbf h_1$. ($\mathbf h_0=\mathbf 0$이라 $\mathbf U\mathbf h_0$ 항이 없습니다.)

$t=2$, 입력 $\mathbf x_2$: $\mathbf h_2=\sigma(\mathbf U\mathbf h_1+\mathbf W\mathbf x_2+\mathbf b)\ \to\ \hat{\mathbf y}_2=\mathbf W^{out}\mathbf h_2$.

필기는 $\mathbf W$, $\mathbf b$, $\mathbf W^{out}$에 동그라미를 쳐서 두 시점이 **같은** 행렬을 쓴다는 점을 강조했습니다. 시점마다 $\mathbf W_1,\mathbf W_2,\dots$를 따로 두지 않습니다(슬라이드: “the same function and the same set of parameters are used at every time step”).
:::

**일반형** (슬라이드 7). 새 상태 = (매개변수 $W$를 가진 어떤 함수)(옛 상태, 이 시점의 입력), 출력 = (매개변수 $W_{hy}$를 가진 다른 함수)(새 상태):
$$h_t=f_W(h_{t-1},x_t),\qquad y_t=f_{W_{hy}}(h_t).$$
바닐라 RNN은 $f_W(h,x)=\sigma(Uh+Wx+b)$를 고른 것이고, 20단원의 LSTM은 $f_W$를 게이트가 달린 더 복잡한 함수로 고른 것입니다.

:::warn 가중치 이름이 슬라이드마다 다르다
슬라이드 6은 $\mathbf h_t=\sigma(\mathbf U\mathbf h_{t-1}+\mathbf W\mathbf x_t+\mathbf b)$로 **$\mathbf U$가 순환, $\mathbf W$가 입력** 가중치인데, 슬라이드 9 뒤의 필기(19.4)는 $h_t=\tanh(Wh_{t-1}+Ux_t+b)$로 **$W$가 순환, $U$가 입력**입니다. 여러 단계 필기(19.5)는 은닉 편향을 $c$, 출력 편향을 $b$로 쓰고, LSTM 슬라이드 18은 $W$를 네 게이트를 쌓은 행렬로 씁니다. 답안의 첫 줄에 순전파 식을 적어 **자기 표기**를 밝히세요. 이 단원은 19.1–19.3에서 슬라이드 6의 표기를, 19.4부터는 필기의 표기를 따릅니다.
:::

**매개변수 수.** 입력 $m$차원, 은닉 $n$차원, 출력 $p$차원이면 $\mathbf U\in\mathbb R^{n\times n}$, $\mathbf W\in\mathbb R^{n\times m}$, $\mathbf b\in\mathbb R^n$, $\mathbf W^{out}\in\mathbb R^{p\times n}$이므로 모두 $n^2+nm+n+pn$개이고, 순서열 길이 $T$와 무관합니다.

:::ex 예제 1 — 순전파 세 걸음
스칼라 RNN $h_t=\ReLU(0.5h_{t-1}+x_t)$, $\hat y_t=2h_t$, $h_0=0$ (슬라이드 6의 표기로 $U=0.5$, $W=1$, $b=0$, $W^{out}=2$)에 $x=(2,1,0.5)$를 넣으면 $\hat y$는?
---
$h_1=\ReLU(0+2)=2$, $h_2=\ReLU(1+1)=2$, $h_3=\ReLU(1+0.5)=1.5$이므로 $\hat y=(4,4,3)$. 모든 단계에서 ReLU가 켜져 있으면 $h_3=0.25x_1+0.5x_2+x_3$입니다. 과거 입력의 영향이 시점마다 $U=0.5$배씩 줄어드는 것이 보이는데, 이것이 19.6의 기울기 소실과 같은 현상입니다.
:::

### 더 깊이

바닐라 RNN은 은닉 활성화로 보통 $\tanh$를 씁니다. 출력이 $(-1,1)$로 유계라 상태가 시점마다 폭주하지 않고, 0 근처에서 기울기가 1이라 초기 학습이 수월하기 때문입니다. 대신 $\lvert a\rvert$가 크면 포화해 $\tanh'(a)=1-\tanh^2a\approx0$이 되는데, 이 인수가 역전파의 곱에 그대로 들어갑니다(19.4, 19.6).
` },
      { k: '19.3', src: 'W9 수 · 슬라이드 8–9', title: '시간 역전파와 잘린 BPTT', body: R`
:::idea 쉽게 말하면
펼친 RNN은 그냥 아주 긴 계산 그래프입니다. 그래서 학습도 보통의 역전파 그대로입니다. 순서열 전체를 앞으로 계산해 손실을 구하고, 그다음 순서열 전체를 거꾸로 거슬러 기울기를 구합니다. 이를 **시간 역전파**(backpropagation through time, BPTT)라 합니다.
:::

**계산 그래프와 역전파** (슬라이드 8). 시점마다의 손실이 하나의 손실 $L=\sum_tL_t$로 모이고, “순서열 전체를 앞으로 지나며 손실을 계산한 뒤, 순서열 전체를 거꾸로 지나며 기울기를 계산합니다.” 매개변수는 모든 시점이 공유하므로, 계산 그래프에서 한 변수가 여러 노드에 쓰일 때처럼 각 시점에서 온 기울기를 **더합니다**[[ch09:9.4|복사 게이트(기울기 덧셈기): 여러 곳에 쓰인 변수의 기울기는 각 사용처에서 온 기울기의 합입니다.]].

:::key 시간 역전파의 두 원리
(1) 펼친 그래프의 손실은 $L=\sum_{t=1}^TL_t$이다. (2) 모든 시점이 같은 매개변수 $\theta$를 쓰므로, 시점 $t$에서 쓰인 복사본을 $\theta^{(t)}$라 할 때 $\frac{\partial L}{\partial\theta}=\sum_{t=1}^T\frac{\partial L}{\partial\theta^{(t)}}$이다.
:::

**메모리와 시간.** 역전파에는 순전파의 모든 $h_t$가 필요하므로 메모리가 $T$에 비례하고, 매개변수를 한 번 고치려면 순서열 전체(책 한 권일 수도 있습니다)를 앞뒤로 한 번씩 지나야 합니다.

**잘린 BPTT** (슬라이드 9). “은닉 상태는 시간을 따라 계속 앞으로 넘기되, 역전파는 **더 적은 수의 걸음**에 대해서만 한다.” 순서열을 $k$걸음짜리 덩어리로 나누고, 덩어리마다 (1) 앞 덩어리의 마지막 상태를 받아 순전파하고 (2) 그 덩어리의 손실만으로 역전파해 (3) 매개변수를 고친 뒤 (4) 마지막 상태를 다음 덩어리로 넘깁니다.

:::fig tbptt
:::

:::key 잘린 BPTT
은닉 상태는 순서열 처음부터 계속 앞으로 넘기되, 역전파는 최근 $k$걸음의 덩어리 안에서만 한다. 덩어리의 첫 상태 $h_{t_0}$은 앞에서 넘겨받은 **상수**로 다루므로 $\partial h_{t_0}/\partial\theta$를 0으로 보는 것이고, $h_{t_0}$을 거쳐 더 앞의 시점으로 가는 기울기 경로가 모두 잘린다.
:::

덩어리의 첫 상태 $h_{t_0}$은 0이 아닙니다. 그래서 19.4의 기울기에서 $h_0\ne0$인 경우의 항들이 잘린 BPTT에서는 실제로 살아남습니다.

:::ex 예제 2 — 갱신 횟수와 메모리
길이 $T=1000$인 순서열을 $k=100$걸음씩 잘린 BPTT로 학습하면 매개변수 갱신은 몇 번이고, 역전파 한 번에 저장할 은닉 상태는 몇 개인가?
---
덩어리가 $1000/100=10$개이므로 10번 갱신합니다(전체 BPTT는 1번). 한 번에 저장할 은닉 상태는 $100$개(와 넘겨받은 첫 상태)입니다. 대가로, 100걸음보다 먼 의존성은 기울기로 배울 수 없습니다.
:::
` },
      { k: '19.4', src: 'W9 수 · 슬라이드 9 뒤 필기', title: '두 단계 RNN의 기울기', body: R`
:::idea 쉽게 말하면
RNN의 역전파가 MLP보다 까다로운 이유는 매개변수가 **여러 시점에서 동시에** 쓰이기 때문입니다. $W$를 조금 바꾸면 $h_1$이 바뀌고, $h_2$는 직접($W$를 다시 쓰므로) **그리고** 바뀐 $h_1$을 통해 간접적으로도 바뀝니다. 매개변수가 손실에 닿는 경로를 빠짐없이 찾아 경로마다 연쇄법칙의 곱을 쓰고 더하면 됩니다. 시점 둘에서 손으로 해 보면 일반식이 보입니다.
:::

**설정** (필기). 이제부터는 필기의 표기를 따릅니다.
$$h_t=\tanh(Wh_{t-1}+UX_t+b),\qquad Y_t=Vh_t+c,\qquad\theta=(W,U,V,b,c).$$
셀 $T$개짜리 RNN의 입력은 $(X_1,\dots,X_T)$, 출력은 $(Y_1,\dots,Y_T)$, 목표는 $(Z_1,\dots,Z_T)$이고 손실은 $L=\sum_{t=1}^TL_t$, 예를 들어 $L_t=\E[\lvert Y_t-Z_t\rvert^2]$입니다(필기는 “or …”로 다른 손실도 된다고 적었습니다). $\nabla_\theta L$은 시점마다의 역전파와 시간을 가로지르는 역전파가 합성된 것이라 MLP보다 복잡합니다. 그래서 두 시점 $T=2$, 모든 변수가 1차원 연속 변수인 경우부터 봅니다.

:::fig rnn2step
:::

:::hand 수업 필기 — 순전파와 국소 미분
순전파:
$$\begin{aligned}a_1&=Wh_0+UX_1+b,&h_1&=\tanh a_1,&Y_1&=Vh_1+c,\\a_2&=Wh_1+UX_2+b,&h_2&=\tanh a_2,&Y_2&=Vh_2+c.\end{aligned}$$

$L_t=\frac12(Y_t-Z_t)^2$로 두면 $L=L_1+L_2=\frac12\lvert Y_1-Z_1\rvert^2+\frac12\lvert Y_2-Z_2\rvert^2=\frac12\lVert Y-Z\rVert^2$이고, 구할 것은 $\nabla_\theta L=\big(\frac{\partial L}{\partial W},\frac{\partial L}{\partial V},\frac{\partial L}{\partial U},\frac{\partial L}{\partial b},\frac{\partial L}{\partial c}\big)$입니다.

연쇄법칙과 $\frac{d}{da}\tanh a=\sech^2a=1-\tanh^2a$로
$$\frac{\partial h_1}{\partial W}=\frac{\partial}{\partial W}\tanh a_1=\sech^2a_1\,\frac{\partial a_1}{\partial W}=(1-\tanh^2a_1)h_0=(1-h_1^2)h_0.$$

같은 방식으로
$$\frac{\partial h_2}{\partial W}=(1-h_2^2)h_1,\qquad\frac{\partial h_1}{\partial b}=1-h_1^2,\qquad\frac{\partial h_2}{\partial b}=1-h_2^2,$$
$$\frac{\partial h_1}{\partial U}=(1-h_1^2)X_1,\qquad\frac{\partial h_2}{\partial U}=(1-h_2^2)X_2.$$

$L_1$은 $h_1$에 $Y_1$을 통해서만 의존하므로
$$\frac{\partial L_1}{\partial h_1}=\frac{\partial L_1}{\partial Y_1}\frac{\partial Y_1}{\partial h_1}=(Y_1-Z_1)V,\qquad\frac{\partial L_2}{\partial h_2}=(Y_2-Z_2)V.$$

시간을 가로지르는 미분:
$$\frac{\partial h_2}{\partial h_1}=\frac{\partial}{\partial h_1}\tanh a_2=\sech^2a_2\,\frac{\partial a_2}{\partial h_1}=(1-\tanh^2a_2)W=(1-h_2^2)W.$$
:::

**편미분의 뜻.** 위의 $\frac{\partial h_2}{\partial W}=(1-h_2^2)h_1$은 $a_2=Wh_1+UX_2+b$에서 **$h_1$을 고정하고** $W$로만 미분한 값(직접 경로)입니다. $h_1$도 $W$에 의존하므로 $W$에 대한 전미분은 $\frac{dh_2}{dW}=\frac{\partial h_2}{\partial W}+\frac{\partial h_2}{\partial h_1}\frac{dh_1}{dW}$이고, 아래 $\partial L/\partial W$의 셋째 항이 바로 이 간접 경로입니다.

:::hand 수업 필기 — 매개변수별 기울기
**V.** $L_t$는 $V$에 $Y_t$를 통해서만 의존하므로
$$\frac{\partial L}{\partial V}=\frac{\partial L_1}{\partial Y_1}\frac{\partial Y_1}{\partial V}+\frac{\partial L_2}{\partial Y_2}\frac{\partial Y_2}{\partial V}=(Y_1-Z_1)h_1+(Y_2-Z_2)h_2=\sum_{t=1}^2(Y_t-Z_t)h_t.$$

**c** (필기 D.I.Y.). $\frac{\partial Y_t}{\partial c}=1$이므로 $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$.

**W.** $W$는 세 경로로 $L$에 닿습니다: $L_1\leftarrow h_1\leftarrow W$, $L_2\leftarrow h_2\leftarrow W$ (직접), $L_2\leftarrow h_2\leftarrow h_1\leftarrow W$.
$$\begin{aligned}\frac{\partial L}{\partial W}&=\frac{\partial L_1}{\partial W}+\frac{\partial L_2}{\partial W}=\frac{\partial L_1}{\partial h_1}\frac{\partial h_1}{\partial W}+\frac{\partial L_2}{\partial h_2}\frac{\partial h_2}{\partial W}+\frac{\partial L_2}{\partial h_2}\frac{\partial h_2}{\partial h_1}\frac{\partial h_1}{\partial W}\\&=(Y_1-Z_1)V(1-h_1^2)h_0+(Y_2-Z_2)V(1-h_2^2)h_1\\&\quad+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0.\end{aligned}$$

**U** (필기 D.I.Y.). 같은 세 경로에서 마지막 인수만 $\frac{\partial h_t}{\partial U}=(1-h_t^2)X_t$로 바뀝니다.
$$\begin{aligned}\frac{\partial L}{\partial U}&=(Y_1-Z_1)V(1-h_1^2)X_1+(Y_2-Z_2)V(1-h_2^2)X_2\\&\quad+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)X_1.\end{aligned}$$

**b** (필기 D.I.Y.). $\frac{\partial h_t}{\partial b}=1-h_t^2$이므로
$$\begin{aligned}\frac{\partial L}{\partial b}&=(Y_1-Z_1)V(1-h_1^2)+(Y_2-Z_2)V(1-h_2^2)\\&\quad+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2).\end{aligned}$$
:::

:::warn 필기의 셋째 항
필기의 $\partial L/\partial W$ 셋째 항은 $(Y_2-Z_2)V(1-h_0^2)W(1-h_1^2)h_0$로 적혀 있지만, 가운데 인수는 $\frac{\partial h_2}{\partial h_1}=(1-h_2^2)W$에서 온 것이므로 $(1-h_2^2)$가 맞습니다. 또 $h_0=0$(보통의 초기 상태)이면 $h_0$가 붙은 첫째·셋째 항이 사라져 $\frac{\partial L}{\partial W}=(Y_2-Z_2)V(1-h_2^2)h_1$만 남습니다. 첫 걸음에서 $W$는 0에 곱해지므로 $W$를 바꿔도 $h_1$이 변하지 않기 때문입니다. $U$와 $b$의 기울기에는 $h_0$가 곱해지지 않으므로 세 항이 모두 남습니다.
:::

**δ로 묶기.** 세 항짜리 식을 한 번에 계산하는 방법이 있습니다. $\delta_t:=\frac{\partial L}{\partial a_t}$ ($a_t$를 통한 모든 경로를 합친 전미분)라 하면
$$\delta_2=(Y_2-Z_2)V(1-h_2^2),\qquad\delta_1=\big[(Y_1-Z_1)V+\delta_2W\big](1-h_1^2),$$
$$\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1,\qquad\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2,\qquad\frac{\partial L}{\partial b}=\delta_1+\delta_2.$$
$\delta_1h_0$을 전개하면 첫째·셋째 항, $\delta_2h_1$이 둘째 항입니다. 매개변수마다 “$\delta_t$ × ($a_t$ 안에서 그 매개변수에 곱해진 것)”을 시점에 대해 더하면 됩니다. 19.5가 이를 일반화합니다.

:::key 두 단계 RNN의 기울기
$h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$, $L=\sum_{t=1}^2\frac12(Y_t-Z_t)^2$이면
$$\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t,\qquad\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t),$$
$$\begin{aligned}\frac{\partial L}{\partial W}=\ &(Y_1-Z_1)V(1-h_1^2)h_0+(Y_2-Z_2)V(1-h_2^2)h_1\\&+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0\end{aligned}$$
(경로 $L_1\leftarrow h_1\leftarrow W$, $L_2\leftarrow h_2\leftarrow W$, $L_2\leftarrow h_2\leftarrow h_1\leftarrow W$). $\partial L/\partial U$, $\partial L/\partial b$는 각 항의 마지막 인수 $h_{s-1}$을 $X_s$, $1$로 바꾼 것이다. 묶으면 $\frac{\partial L}{\partial W}=\sum_t\delta_th_{t-1}$, $\frac{\partial L}{\partial U}=\sum_t\delta_tX_t$, $\frac{\partial L}{\partial b}=\sum_t\delta_t$.
:::

:::ex 예제 3 — 수치로 끝까지
$W=0.5$, $U=1$, $V=2$, $b=c=0$, $h_0=0$, $X=(1,-1)$, $Z=(1,0)$일 때 순전파와 다섯 기울기를 모두 구하라.
---
**순전파.** $a_1=1$, $h_1=\tanh1\approx0.7616$, $Y_1\approx1.5232$. $a_2=0.5\cdot0.7616-1\approx-0.6192$, $h_2\approx-0.5506$, $Y_2\approx-1.1011$. 오차 $Y_1-Z_1\approx0.5232$, $Y_2-Z_2\approx-1.1011$, 손실 $L\approx0.7431$.

**국소 인수.** $1-h_1^2\approx0.4200$, $1-h_2^2\approx0.6969$.

**δ.** $\delta_2=(-1.1011)(2)(0.6969)\approx-1.5347$, $\delta_1=(0.5232\cdot2-1.5347\cdot0.5)(0.4200)=(1.0464-0.7674)(0.4200)\approx0.1172$.

**기울기.** $\frac{\partial L}{\partial V}=0.5232\cdot0.7616+(-1.1011)(-0.5506)\approx0.3985+0.6063=1.0047$, $\frac{\partial L}{\partial c}\approx0.5232-1.1011=-0.5780$. $h_0=0$이라 $\frac{\partial L}{\partial W}=\delta_2h_1\approx-1.5347\cdot0.7616\approx-1.1688$ (둘째 항만). $\frac{\partial L}{\partial U}=\delta_1\cdot1+\delta_2\cdot(-1)\approx0.1172+1.5347=1.6519$이고, 세 항으로는 $0.4395+1.5347-0.3223$입니다. $\frac{\partial L}{\partial b}=\delta_1+\delta_2\approx-1.4175$ ($=0.4395-1.5347-0.3223$). 중심 차분 $\frac{L(\theta+\epsilon)-L(\theta-\epsilon)}{2\epsilon}$으로 확인하면 다섯 값이 모두 소수 여섯째 자리까지 일치합니다.
:::

:::tip Quiz 2 (11/04)
필기는 이 유도의 $\partial L_1/\partial h_1$ 옆에 빨간 상자로 “Quiz 2 (11/04)”라고 적어 두었습니다. 답안 점검표:
1. 순전파 식(어느 것이 순환 가중치인지 밝히는 자기 표기)과 $a_t$, $h_t$, $Y_t$, $L_t$를 먼저 적는다.
2. 구하는 매개변수가 $L$에 닿는 **경로를 모두** 나열한다. $V$, $c$는 시점마다 하나씩이고, $W$, $U$, $b$는 $T(T+1)/2$개($T=2$이면 셋)이다.
3. 경로마다 연쇄법칙의 곱을 쓰고 더한다.
4. $\tanh'(a)=\sech^2a=1-\tanh^2a=1-h^2$으로 정리한다.
5. $h_0=0$이면 사라지는 항을 표시하고, 가능하면 $\delta_t$로 묶어 검산한다.
:::

### 더 깊이

시점이 $T$개이면 $W$는 $L_t$에 $h_s$ ($s\le t$)를 거치는 경로마다 닿으므로 항이 $\sum_{t=1}^Tt=T(T+1)/2$개입니다.
$$\frac{\partial L}{\partial W}=\sum_{t=1}^T(Y_t-Z_t)V\sum_{s=1}^t\Big(\prod_{k=s+1}^t(1-h_k^2)W\Big)(1-h_s^2)h_{s-1}.$$
$t-s$가 큰 항, 곧 먼 과거로 가는 경로에는 $(1-h_k^2)W$가 $t-s$번 곱해집니다. 이 곱이 19.6의 주인공입니다.
` },
      { k: '19.5', src: 'W9 수 · 슬라이드 9 뒤 필기, 슬라이드 10, 13', title: '여러 단계 RNN의 역전파', body: R`
:::idea 쉽게 말하면
시점이 많아도 할 일은 같습니다. 출력에서 출발해 은닉 상태를 한 칸씩 거슬러 내려가며 “이 상태가 손실에 주는 영향” $\partial\mathcal L/\partial h_\ell$을 고치고(야코비안 하나씩 곱하기), 시점마다 매개변수가 직접 쓰인 몫을 더합니다. 19.4의 세 항짜리 식은 이 절차를 두 걸음에서 펼쳐 쓴 것입니다.
:::

**여러 셀의 경우** (필기, 슬라이드 10). 입력 $X$를 순서열 $\tau(X)=(u_1,\dots,u_L)$로 바꾸고
$$h_0=0,\qquad h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)\quad(\ell=1,\dots,L),\qquad f_\theta(X)=Ah_L+b,$$
$q_{\tilde\theta}:\mathbb R^n\times\mathbb R^m\to\mathbb R^n$, 예를 들어 $q(h,u)=\phi(Wh+Uu+c)$로 둡니다. $\theta=(A,b,\tilde\theta)$, $A\in\mathbb R^{1\times n}$, $b\in\mathbb R$, $\tilde\theta\in\mathbb R^p$이고 $f_\theta(X)\in\mathbb R$입니다. 출력이 마지막에 하나뿐인 many to one 모형입니다.

**바깥 매개변수** (슬라이드 10). 손실 $\mathcal L(f_\theta(X),Y)$에 연쇄법칙을 쓰면
$$\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial\theta}=\Big(\frac{\partial\mathcal L}{\partial f}(f_\theta(X),Y)\Big)\frac{\partial f_\theta(X)}{\partial\theta},\qquad\frac{\partial f_\theta(X)}{\partial A}=h_L,\quad\frac{\partial f_\theta(X)}{\partial b}=1,\quad\frac{\partial f_\theta(X)}{\partial\tilde\theta}=A\frac{\partial h_L}{\partial\tilde\theta}.$$
($\partial f/\partial A=h_L$을 $A$와 같은 모양 $1\times n$으로 놓으면 $h_L^T$입니다.)

**순환 매개변수** (슬라이드 13, 필기). $\tilde\theta$는 모든 $q$ 적용에서 쓰이므로, 필기는 슬라이드 13의 빈칸을 합으로 채웠습니다.
$$\frac{\partial f_\theta(X)}{\partial\tilde\theta}=\sum_{\ell=1}^L\frac{\partial f}{\partial h_\ell}\frac{\partial h_\ell}{\partial\tilde\theta},\qquad\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial\tilde\theta}=\sum_{\ell=1}^L\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial h_\ell}{\partial\tilde\theta}.$$
여기서 $\frac{\partial h_\ell}{\partial\tilde\theta}$는 $h_{\ell-1}$을 고정한 **직접** 미분 $\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$이고, 슬라이드 14의 첫 식이 이렇게 씁니다. 반면 $\frac{\partial\mathcal L}{\partial h_\ell}$은 $h_\ell$에서 손실까지 가는 모든 경로를 합친 값입니다.

:::key 여러 단계 RNN의 역전파
$h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)$, $f_\theta(X)=Ah_L+b$이면 (기울기는 행벡터)
$$\frac{\partial\mathcal L}{\partial\tilde\theta}=\sum_{\ell=1}^L\frac{\partial\mathcal L}{\partial h_\ell}\,\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell),\qquad\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_{L-2}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell},$$
$\frac{\partial\mathcal L}{\partial h_L}=\frac{\partial\mathcal L}{\partial f}A$, $\frac{\partial\mathcal L}{\partial A}=\frac{\partial\mathcal L}{\partial f}h_L^T$, $\frac{\partial\mathcal L}{\partial b}=\frac{\partial\mathcal L}{\partial f}$.
:::

:::warn 슬라이드 11–12
업로드된 PDF에는 슬라이드 10 다음이 13이라 11–12가 빠져 있습니다. 슬라이드 13의 제목 “Translate calculation to ∂L/∂θ̃”로 보아, 빠진 쪽은 $\partial h_L/\partial\tilde\theta$를 시점별로 펼치는 계산으로 보입니다. 아래의 역방향 점화식이 그 내용을 채웁니다. 또 이 필기는 은닉 편향을 $c$, 출력 편향을 $b$로 써서 19.4와 거꾸로입니다.
:::

**역방향 점화식.** $q(h,u)=\phi(Wh+Uu+c)$, $a_\ell=Wh_{\ell-1}+Uu_\ell+c$, 행벡터 $\delta_\ell:=\frac{\partial\mathcal L}{\partial h_\ell}$로 두면 $\frac{\partial h_{\ell+1}}{\partial h_\ell}=\diag(\phi'(a_{\ell+1}))W$이므로[[ch09:9.5|벡터 입출력의 야코비안과 행벡터 기울기의 곱.]]
$$\delta_L=\frac{\partial\mathcal L}{\partial f}A,\qquad\delta_\ell=\delta_{\ell+1}\diag(\phi'(a_{\ell+1}))\,W\quad(\ell=L-1,\dots,1),$$
$$\frac{\partial\mathcal L}{\partial W}=\sum_{\ell=1}^L\big(\phi'(a_\ell)\odot\delta_\ell^T\big)h_{\ell-1}^T,\qquad\frac{\partial\mathcal L}{\partial U}=\sum_{\ell=1}^L\big(\phi'(a_\ell)\odot\delta_\ell^T\big)u_\ell^T,\qquad\frac{\partial\mathcal L}{\partial c}=\sum_{\ell=1}^L\phi'(a_\ell)\odot\delta_\ell^T.$$
순전파에서 $h_\ell$과 $a_\ell$을 저장해 두면, 역전파는 $\delta$를 한 번 거꾸로 계산하는 것으로 끝나 비용이 순전파와 같은 $O(L)$입니다.

**출력이 시점마다 있을 때.** 19.4처럼 손실이 $L=\sum_tL_t$이면 $h_t$는 $L_t$에 직접, 그리고 $h_{t+1}$을 통해 뒤의 모든 손실에 닿습니다. 따라서 $\mathbf g_t:=\partial L/\partial h_t$ (열벡터로 씀)에 직접 몫이 더해집니다.

:::key 시간 역전파 (BPTT)
$h_t=\tanh(Wh_{t-1}+Ux_t+b)$, $Y_t=Vh_t+c$, $L=\sum_{t=1}^T\frac12\lVert Y_t-Z_t\rVert^2$이면 (열벡터 기울기, $h_t^2$은 성분별)
$$\mathbf g_t=V^T(Y_t-Z_t)+W^T\boldsymbol\delta_{t+1},\qquad\boldsymbol\delta_t=\diag(1-h_t^2)\,\mathbf g_t,\qquad\boldsymbol\delta_{T+1}=\mathbf 0,$$
$$\frac{\partial L}{\partial W}=\sum_t\boldsymbol\delta_th_{t-1}^T,\quad\frac{\partial L}{\partial U}=\sum_t\boldsymbol\delta_tx_t^T,\quad\frac{\partial L}{\partial b}=\sum_t\boldsymbol\delta_t,\quad\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t^T,\quad\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t).$$
:::

**$T=2$에서 19.4로.** 스칼라이면 $\delta_3=0$에서 $g_2=V(Y_2-Z_2)$, $\delta_2=(1-h_2^2)V(Y_2-Z_2)$이고 $g_1=V(Y_1-Z_1)+W\delta_2$, $\delta_1=(1-h_1^2)g_1$입니다. 따라서 $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1$이 필기의 세 항을 그대로 줍니다. 출력이 끝에만 있는 슬라이드의 모형이라면 $L_1$이 없어 $\delta_1=(1-h_1^2)W\delta_2$이고, 둘째·셋째 항만 남습니다.

:::ex 예제 4 — 출력이 끝에만 있을 때
스칼라 $h_\ell=\tanh(Wh_{\ell-1}+Uu_\ell+c)$, $\ell=1,2$, $f=Ah_2+b$, $\mathcal L=\frac12(f-y)^2$에서 $\partial\mathcal L/\partial W$를 써라.
---
$\delta_2=(f-y)A$, $\delta_1=\delta_2(1-h_2^2)W$이므로
$$\frac{\partial\mathcal L}{\partial W}=\delta_2(1-h_2^2)h_1+\delta_1(1-h_1^2)h_0=(f-y)A(1-h_2^2)h_1+(f-y)A(1-h_2^2)W(1-h_1^2)h_0.$$
경로는 둘뿐이고($L_1$이 없음), $h_0=0$이면 첫 항만 남습니다.
:::

### 더 깊이

BPTT는 기울기를 시간 $O(T)$, 메모리 $O(T)$로 구합니다. 반대로 $\partial h_t/\partial\theta$를 순전파와 함께 앞으로 들고 가는 방법(실시간 순환 학습, RTRL)은 메모리가 $T$와 무관해 끝없는 순서열에서도 쓸 수 있지만, $W\in\mathbb R^{n\times n}$이면 $\partial h_t/\partial W$가 $n\times n^2$ 크기라 걸음마다 $O(n^4)$이 들어 실제로는 잘린 BPTT를 씁니다.
` },
      { k: '19.6', src: 'W9 수 · 슬라이드 14–17 필기', title: '기울기 폭발·소실과 기울기 잘라내기', body: R`
:::idea 쉽게 말하면
19.5의 식에서 먼 과거의 기울기는 야코비안을 수십·수백 번 곱한 값입니다. 1보다 조금 큰 수를 100번 곱하면 엄청나게 커지고($1.1^{100}\approx13{,}781$), 조금 작은 수를 100번 곱하면 거의 0이 됩니다($0.9^{100}\approx0.00003$). 앞의 것이 **기울기 폭발**, 뒤의 것이 **기울기 소실**입니다.
:::

**RNN은 아주 깊은 망이다** (슬라이드 14).
$$\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial\tilde\theta}=\sum_{\ell=1}^L\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial h_\ell}\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell),\qquad\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial h_\ell}=\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_{L-2}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell}.$$
순서열 길이가 수백·수천인 경우가 흔하므로(필기: $L=100,1000$), 먼 시점의 $\partial\mathcal L/\partial h_\ell$은 수백·수천 개의 곱입니다. 많은 수를 곱하는 것은 불안정합니다.
- 대부분이 1보다 크면 곱은 $\infty$로 갑니다(**기울기 폭발**, 기울기 잘라내기로 고칠 수 있음).
- 대부분이 1보다 작으면 곱은 0으로 갑니다(**기울기 소실**, 더 큰 문제). 모두 1에 가까울 때만 곱이 적당한 크기로 남습니다.

:::key 기울기 소실·폭발의 조건
$\gamma=\sup_z\lvert\phi'(z)\rvert$ ($\tanh$이면 $\gamma=1$)라 하면 $\big\lVert\frac{\partial h_{k+1}}{\partial h_k}\big\rVert_2=\lVert\diag(\phi'(a_{k+1}))W\rVert_2\le\gamma\lVert W\rVert_2$이고
$$\Big\lVert\frac{\partial\mathcal L}{\partial h_\ell}\Big\rVert\le\big(\gamma\lVert W\rVert_2\big)^{L-\ell}\Big\lVert\frac{\partial\mathcal L}{\partial h_L}\Big\rVert.$$
따라서 $\gamma\lVert W\rVert_2<1$이면 먼 시점의 기울기는 지수적으로 **소실**한다. 기울기가 **폭발**하려면 $\gamma\lVert W\rVert_2>1$이어야 한다(필요조건).
:::

스칼라이고 활성값이 작아 $\tanh'\approx1$이면 인수는 $\approx w$이고 곱은 $w^{L-\ell}$입니다. 표지 그림이 $\gamma^k$의 로그를 그린 것으로, $\gamma$가 1에서 조금만 벗어나도 직선이 위아래로 크게 벌어집니다. 깊은 MLP에서 초기화가 너무 작거나 크면 생기는 일과 같은 현상이 시간 방향으로 일어나는 것입니다[[ch11:11.1|너무 작거나 너무 큰 초기화: 층을 지날수록 활성값과 기울기가 사라지거나 커집니다.]].

**기울기 폭발과 잘라내기** (슬라이드 15).
- 기울기의 크기가 매우 클 때 기울기 폭발이 일어납니다.
- 기울기가 폭발한다는 것은 출력이 어떤 방향의 작은 매개변수 변화에 매우 민감하다는 뜻입니다. 이런 기울기는 쓸 수 없어 망의 구조를 바꿔야 할 때도 있습니다.
- 그러나 기울기의 **방향**은 괜찮은 경우가 있고, 그때는 기울기를 잘라낸 값으로 최적화하면 됩니다.

:::key 기울기 잘라내기
문턱 $v>0$ (스칼라)에 대해
$$\mathbf g\leftarrow\min\Big(1,\frac{v}{\lVert\mathbf g\rVert}\Big)\mathbf g=\begin{cases}\mathbf g&\lVert\mathbf g\rVert\le v\\\dfrac{v}{\lVert\mathbf g\rVert}\mathbf g&\text{그 밖}\end{cases}$$
방향은 그대로이고 크기는 $\min(\lVert\mathbf g\rVert,v)$가 된다.
:::

:::warn 슬라이드 15의 max
슬라이드는 $g\leftarrow\max\big(1,\frac{v}{\lVert g\rVert}\big)g$로 적었지만, $\lVert g\rVert\le v$이면 $\frac{v}{\lVert g\rVert}\ge1$이라 max는 작은 기울기를 오히려 **키웁니다**. 같은 슬라이드의 경우 나눔($\lVert g\rVert\le v$이면 $g$, 아니면 $\frac{v}{\lVert g\rVert}g$)과 맞는 식은 $\min$입니다. 또 슬라이드 14에는 $\infty$ 자리에 LaTeX 명령어가 그대로 찍혀 있습니다.
:::

슬라이드 15의 그림은 손실 $J(w,b)$에 가파른 **절벽**이 있는 경우입니다. 잘라내지 않으면 절벽에서 거대한 기울기를 받아 한 걸음에 그래프 밖으로 튕겨 나가고, 잘라내면 같은 방향으로 작게 움직여 골짜기 근처에 머뭅니다.

:::ex 예제 5 — 잘라내기 계산
$\mathbf g=(3,4)$, $v=2$이면 잘라낸 기울기는? $v=10$이면?
---
$\lVert\mathbf g\rVert=5>2$이므로 $\frac25(3,4)=(1.2,1.6)$이고 크기는 2입니다. $v=10$이면 $5\le10$이라 그대로 $(3,4)$. 슬라이드의 max를 쓰면 $v=10$에서 $\max(1,2)\mathbf g=(6,8)$로 오히려 커집니다.
:::

**기울기 소실** (슬라이드 16). 직관적으로 기울기 소실은 기울기 신호가 앞쪽 층(먼 과거의 시점)에 닿지 않는 것입니다. RNN에서 $\partial\mathcal L/\partial h_L$은 작지 않아도
$$\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_{L-2}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell}$$
은 작을 수 있습니다. 이는 $h_\ell$을 바꿔도 $\mathcal L$이 거의 변하지 않는다는 뜻이고, $\frac{\partial\mathcal L}{\partial u_\ell}=\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial h_\ell}{\partial u_\ell}$이므로 $u_\ell$의 (작은) 변화도 $\mathcal L$에 영향을 주지 못합니다. RNN이 $u_\ell$의 정보를 쓰지 않는다, 곧 $L$ 시점에서 $u_\ell$을 **기억하지 못한다**고 이해할 수 있습니다(큰 변화는 영향을 줄 수 있으니 엄밀한 논리는 아닙니다). 어쨌든 먼 시점 $L$에서 오는 기울기 신호가 사라져, 모형은 시점 $\ell$에서 무엇을 보존해야 하는지 배울 수 없습니다.

:::ex 예제 6 — 100걸음의 배율
스칼라 $\tanh$ RNN에서 활성값이 작아 $1-h_k^2\approx1$이라 하자. $W=0.9$와 $W=1.1$일 때 100걸음 떨어진 시점으로 가는 기울기의 배율은?
---
$\prod_{k}(1-h_k^2)W\approx W^{100}$: $0.9^{100}\approx2.66\times10^{-5}$ (소실), $1.1^{100}\approx1.38\times10^{4}$ (폭발). 실제 $\tanh$ RNN에서는 $h$가 커지면 $1-h^2$이 작아져 곱이 다시 줄어들기도 하지만, 그러면 포화 때문에 소실이 생깁니다.
:::

**왜 소실이 더 큰 문제인가.** 폭발은 $\lVert\mathbf g\rVert$를 보면 바로 알 수 있고 잘라내기로 다룰 수 있습니다. 소실은 조용합니다. 전체 기울기 $\sum_\ell$은 가까운 시점의 항이 지배하므로 전체를 키워도 먼 시점의 항은 상대적으로 묻혀 있고, 모형은 짧은 의존성만 배웁니다.

**더 나은 기울기 흐름** (슬라이드 17). 슬라이드 17은 제목 “기울기가 더 잘 흐르게 하기”만 있고 바로 LSTM(슬라이드 18)으로 넘어갑니다. LSTM은 곱해지는 야코비안이 $\diag(f_t)$인 셀 상태의 길을 따로 두어, 망이 $f_t\approx1$을 배우면 기울기가 거의 줄지 않고 지나가게 합니다[[ch20:20.2|LSTM의 기울기 흐름: 셀 상태를 따라 곱해지는 야코비안은 망각 게이트 diag(f_t)입니다.]]. ResNet의 잔차 연결이 야코비안을 $I+\partial F/\partial h$로 만든 것과 같은 발상입니다[[ch16:16.6|잔차 연결의 야코비안 I + ∂F/∂h.]].

### 더 깊이

슬라이드의 잘라내기는 기울기 벡터 전체의 노름을 보는 **노름 잘라내기**입니다. 성분마다 $[-v,v]$로 자르는 **값 잘라내기**도 있지만, 성분별로 다르게 줄어들어 방향이 바뀝니다. 노름 잘라내기는 방향을 지키며 한 걸음의 크기만 $\eta v$ 이하로 묶는 것이라, 학습률을 그 걸음에서만 줄이는 것과 같습니다.
` },
    ],
    problems: [
      { sec: '19.1', type: 'mc', lv: 1, q: R`동영상을 보고 그 안의 행동(예: 달리기, 점프)을 하나의 범주로 분류하는 과제에 맞는 RNN 구조는?`,
        choices: [R`one to many`, R`many to one`, R`지연형 many to many`, R`동기형 many to many`], ans: 1,
        sol: R`프레임의 순서열을 읽고 마지막에 범주 하나를 내므로 many to one입니다(슬라이드 3의 동영상 분류·행동 인식).` },
      { sec: '19.1', type: 'mc', lv: 1, q: R`영어 문장을 한국어 문장으로 번역하는 과제에 가장 맞는 구조는?`,
        choices: [R`one to one`, R`one to many`, R`입력을 다 읽은 뒤 출력하는 지연형 many to many`, R`시점마다 입력 하나에 출력 하나를 내는 동기형 many to many`], ans: 2,
        sol: R`두 언어의 어순과 길이가 다르므로 문장을 끝까지 읽은 뒤에 출력을 시작합니다. 필기의 $t=1,2,3$ 입력, $t=4,5,6$ 출력이 이 구조입니다.` },
      { sec: '19.1', type: 'mc', lv: 1, q: R`이미지 한 장을 받아 설명 문장(캡션)을 만드는 과제의 구조는?`,
        choices: [R`one to many`, R`many to one`, R`동기형 many to many`, R`one to one`], ans: 0,
        sol: R`입력은 이미지 하나, 출력은 단어의 순서열이므로 one to many입니다(슬라이드 3의 Img2Cap).` },
      { sec: '19.2', type: 'mc', lv: 1, q: R`슬라이드 6의 바닐라 RNN에 대한 설명으로 옳은 것은?`,
        choices: [R`시점마다 다른 가중치 $\mathbf W_t$를 쓴다`, R`모든 시점에서 같은 함수와 같은 매개변수 $\mathbf U,\mathbf W,\mathbf b,\mathbf W^{out}$을 쓴다`, R`은닉 상태 없이 입력에서 바로 출력을 낸다`, R`초기 상태 $\mathbf h_0$은 학습 데이터의 평균이다`], ans: 1,
        sol: R`슬라이드 6: “the same function and the same set of parameters are used at every time step.” $\mathbf h_0=\mathbf 0$입니다.` },
      { sec: '19.2', type: 'num', lv: 2, q: R`입력 10차원, 은닉 20차원, 출력 5차원인 바닐라 RNN $\mathbf h_t=\sigma(\mathbf U\mathbf h_{t-1}+\mathbf W\mathbf x_t+\mathbf b)$, $\hat{\mathbf y}_t=\mathbf W^{out}\mathbf h_t$의 매개변수는 모두 몇 개인가? 길이 50인 순서열에 쓰면 몇 개가 되는가?`, ans: '720', ansTex: R`400+200+20+100=720`,
        sol: R`$\mathbf U$: $20\cdot20=400$, $\mathbf W$: $20\cdot10=200$, $\mathbf b$: 20, $\mathbf W^{out}$: $5\cdot20=100$. 합 720개이고, 매개변수를 공유하므로 길이 50에서도 720개입니다.` },
      { sec: '19.2', type: 'num', lv: 1, q: R`스칼라 RNN $h_t=\ReLU(0.5h_{t-1}+x_t)$, $\hat y_t=2h_t$, $h_0=0$에 $x=(2,1,0.5)$를 넣을 때 $\hat y_3$은?`, ans: '3', ansTex: R`3`,
        sol: R`$h_1=2$, $h_2=\ReLU(1+1)=2$, $h_3=\ReLU(1+0.5)=1.5$, $\hat y_3=3$.` },
      { sec: '19.2', type: 'open', lv: 2, q: R`RNN이 모든 시점에서 같은 매개변수를 쓰는 것(매개변수 공유)의 장점 세 가지를 쓰세요.`,
        sol: R`(1) 매개변수 수가 순서열 길이와 무관해 길이가 제각각인 입력을 같은 모형으로 처리할 수 있습니다. (2) 한 시점에서 배운 패턴을 다른 시점에서도 그대로 쓰므로(시간 방향의 일반화) 데이터 효율이 좋습니다. (3) 학습 때 보지 못한 길이의 순서열에도 적용할 수 있습니다. 대가로 기울기가 같은 $W$의 거듭제곱 꼴 곱이 되어 폭발·소실이 생깁니다.`,
        rubric: R`- 길이와 무관한 매개변수 수 — 1점
- 시점 사이의 패턴 공유 — 1점
- 다른 길이로의 적용(또는 대가의 언급) — 1점` },
      { sec: '19.3', type: 'mc', lv: 1, q: R`잘린 BPTT에 대한 설명으로 옳은 것은?`,
        choices: [R`은닉 상태를 $k$걸음마다 0으로 되돌린다`, R`은닉 상태는 계속 앞으로 넘기되 역전파는 최근 $k$걸음 안에서만 한다`, R`순서열의 앞부분 $k$걸음만 학습에 쓴다`, R`$k$걸음마다 기울기를 잘라내기한다`], ans: 1,
        sol: R`슬라이드 9: “Carry hidden states forward in time forever, but only backpropagate for some smaller number of steps.” 덩어리의 첫 상태는 0이 아니라 앞에서 넘겨받은 값입니다.` },
      { sec: '19.3', type: 'mc', lv: 2, q: R`길이 $T$인 순서열에 전체 BPTT를 쓸 때 메모리가 $T$에 비례하는 이유는?`,
        choices: [R`매개변수가 시점마다 복사되어 저장되기 때문`, R`역전파에서 국소 미분 $1-h_t^2$ 등을 계산하려면 순전파의 모든 은닉 상태 $h_t$가 필요하기 때문`, R`손실 $L_t$를 시점마다 따로 최소화하기 때문`, R`기울기 잘라내기를 시점마다 하기 때문`], ans: 1,
        sol: R`매개변수는 공유되어 한 벌뿐입니다. 역전파의 국소 기울기가 $h_t$, $a_t$에 의존하므로 순전파의 중간값을 모두 저장해야 합니다.` },
      { sec: '19.4', type: 'num', lv: 2, quiz: true, q: R`필기의 두 단계 RNN $h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$, $L=\sum_{t=1}^2\frac12(Y_t-Z_t)^2$에서 $V=2$, $c=0$, $W=0.5$, $X=(1,2)$, $Z=(0,0)$이고, 순전파 결과가 $h_0=0$, $h_1=0.5$, $h_2=-0.5$였다. $\partial L/\partial V$는?`, ans: '1', ansTex: R`1`,
        sol: R`$Y_1=1$, $Y_2=-1$. $\frac{\partial L}{\partial V}=(Y_1-Z_1)h_1+(Y_2-Z_2)h_2=1\cdot0.5+(-1)(-0.5)=1$.` },
      { sec: '19.4', type: 'num', lv: 2, quiz: true, q: R`앞 문제와 같은 값($V=2$, $W=0.5$, $h_0=0$, $h_1=0.5$, $h_2=-0.5$, $Y=(1,-1)$, $Z=(0,0)$)에서 $\partial L/\partial W$는?`, ans: '-0.75', ansTex: R`-\tfrac34`,
        sol: R`$1-h_1^2=1-h_2^2=0.75$. $h_0=0$이라 첫째·셋째 항이 사라지고 $\frac{\partial L}{\partial W}=(Y_2-Z_2)V(1-h_2^2)h_1=(-1)(2)(0.75)(0.5)=-0.75$.` },
      { sec: '19.4', type: 'num', lv: 2, quiz: true, q: R`같은 값에서 $X=(1,2)$일 때 $\partial L/\partial U$는?`, ans: '-2.0625', ansTex: R`-\tfrac{33}{16}`,
        sol: R`$\delta_2=(Y_2-Z_2)V(1-h_2^2)=-1.5$, $\delta_1=[(Y_1-Z_1)V+\delta_2W](1-h_1^2)=(2-0.75)(0.75)=0.9375$. $\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2=0.9375-3=-2.0625$. 세 항으로는 $1.5-3-0.5625$입니다.` },
      { sec: '19.4', type: 'num', lv: 2, quiz: true, q: R`같은 값에서 $\partial L/\partial b$는?`, ans: '-0.5625', ansTex: R`-\tfrac9{16}`,
        sol: R`$\frac{\partial L}{\partial b}=\delta_1+\delta_2=0.9375-1.5=-0.5625$. 세 항으로는 $(Y_1-Z_1)V(1-h_1^2)=1.5$, $(Y_2-Z_2)V(1-h_2^2)=-1.5$, $(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)=-0.5625$.` },
      { sec: '19.4', type: 'mc', lv: 2, q: R`필기의 $\partial L/\partial W$ 셋째 항 $\frac{\partial L_2}{\partial h_2}\frac{\partial h_2}{\partial h_1}\frac{\partial h_1}{\partial W}$을 옳게 쓴 것은?`,
        choices: [R`$(Y_2-Z_2)V(1-h_0^2)W(1-h_1^2)h_0$`, R`$(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0$`, R`$(Y_2-Z_2)V(1-h_2^2)(1-h_1^2)h_1$`, R`$(Y_1-Z_1)V(1-h_1^2)W(1-h_2^2)h_0$`], ans: 1,
        sol: R`$\frac{\partial L_2}{\partial h_2}=(Y_2-Z_2)V$, $\frac{\partial h_2}{\partial h_1}=(1-h_2^2)W$, $\frac{\partial h_1}{\partial W}=(1-h_1^2)h_0$. 필기의 $(1-h_0^2)$는 $(1-h_2^2)$의 잘못입니다.` },
      { sec: '19.4', type: 'open', lv: 3, proof: true, quiz: true, q: R`스칼라 RNN $h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$ ($t=1,2$), $L=L_1+L_2$, $L_t=\frac12(Y_t-Z_t)^2$에 대해 다음을 유도하세요.
1. 순전파를 $a_t$, $h_t$, $Y_t$로 쓰고, $\frac{\partial h_1}{\partial W}$, $\frac{\partial h_2}{\partial W}$ ($h_1$ 고정), $\frac{\partial h_2}{\partial h_1}$, $\frac{\partial L_t}{\partial h_t}$를 구하시오.
2. $\frac{\partial L}{\partial V}$와 $\frac{\partial L}{\partial c}$를 구하시오.
3. $W$가 $L$에 닿는 경로를 모두 쓰고 $\frac{\partial L}{\partial W}$를 구하시오.`,
        hint: R`$\frac{d}{da}\tanh a=1-\tanh^2a$. $W$는 $a_1$과 $a_2$ 두 곳에서 쓰이고, $h_1$은 $a_2$에도 들어갑니다.`,
        sol: R`
**1.** $a_1=Wh_0+UX_1+b$, $h_1=\tanh a_1$, $Y_1=Vh_1+c$, $a_2=Wh_1+UX_2+b$, $h_2=\tanh a_2$, $Y_2=Vh_2+c$. 연쇄법칙으로 $\frac{\partial h_1}{\partial W}=(1-h_1^2)h_0$, $\frac{\partial h_2}{\partial W}=(1-h_2^2)h_1$, $\frac{\partial h_2}{\partial h_1}=(1-h_2^2)W$, $\frac{\partial L_t}{\partial h_t}=(Y_t-Z_t)V$.

**2.** $L_t$는 $V$, $c$에 $Y_t$를 통해서만 의존하므로 $\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t$, $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$.

**3.** 경로: $W\to h_1\to L_1$, $W\to h_2\to L_2$, $W\to h_1\to h_2\to L_2$. 따라서
$$\frac{\partial L}{\partial W}=(Y_1-Z_1)V(1-h_1^2)h_0+(Y_2-Z_2)V(1-h_2^2)h_1+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0.$$`,
        rubric: R`
- 순전파와 네 국소 미분($\tanh'=1-h^2$ 사용) — 3점
- $\partial L/\partial V$, $\partial L/\partial c$ — 2점
- 세 경로를 모두 찾음 — 2점
- $\partial L/\partial W$의 세 항이 정확함(셋째 항의 $(1-h_2^2)W$) — 3점` },
      { sec: '19.4', type: 'open', lv: 3, proof: true, quiz: true, q: R`같은 두 단계 RNN에서 필기가 “D.I.Y.”로 남긴 $\frac{\partial L}{\partial U}$와 $\frac{\partial L}{\partial b}$를 경로별로 유도하고, $\delta_2=(Y_2-Z_2)V(1-h_2^2)$, $\delta_1=[(Y_1-Z_1)V+\delta_2W](1-h_1^2)$로 쓰면 $\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2$, $\frac{\partial L}{\partial b}=\delta_1+\delta_2$임을 보이세요.`,
        sol: R`
**경로.** $U$와 $b$도 $W$처럼 $a_1$, $a_2$ 두 곳에 들어가므로 경로는 $\to h_1\to L_1$, $\to h_2\to L_2$, $\to h_1\to h_2\to L_2$ 셋입니다. 국소 미분은 $\frac{\partial h_t}{\partial U}=(1-h_t^2)X_t$, $\frac{\partial h_t}{\partial b}=1-h_t^2$ ($h_{t-1}$ 고정).

**U.** $\frac{\partial L}{\partial U}=(Y_1-Z_1)V(1-h_1^2)X_1+(Y_2-Z_2)V(1-h_2^2)X_2+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)X_1$.

**b.** $\frac{\partial L}{\partial b}=(Y_1-Z_1)V(1-h_1^2)+(Y_2-Z_2)V(1-h_2^2)+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)$.

**δ로 묶기.** $\delta_1X_1=(Y_1-Z_1)V(1-h_1^2)X_1+\delta_2W(1-h_1^2)X_1$은 첫째·셋째 항이고 $\delta_2X_2$는 둘째 항이므로 합이 $\frac{\partial L}{\partial U}$입니다. $X_t$를 1로 바꾸면 $\frac{\partial L}{\partial b}=\delta_1+\delta_2$.`,
        rubric: R`
- 세 경로와 국소 미분 — 2점
- $\partial L/\partial U$ 세 항 — 3점
- $\partial L/\partial b$ 세 항 — 2점
- δ 꼴과 같음을 전개로 확인 — 3점` },
      { sec: '19.4', type: 'open', lv: 3, quiz: true, q: R`두 단계 RNN에서 초기 상태가 $h_0\ne0$이라 하자(잘린 BPTT의 덩어리처럼).
1. $h_0=0$일 때 $\partial L/\partial W$에서 사라지는 항은 무엇이고, 왜 사라지는가?
2. $V=2$, $W=0.5$, $h_0=1$, $h_1=0.5$, $h_2=-0.5$, $Y=(1,-1)$, $Z=(0,0)$일 때 $\partial L/\partial W$를 구하시오.`,
        sol: R`
**1.** $h_0$이 곱해진 첫째 항 $(Y_1-Z_1)V(1-h_1^2)h_0$과 셋째 항 $(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0$입니다. $\frac{\partial h_1}{\partial W}=(1-h_1^2)h_0=0$, 곧 첫 걸음에서 $W$는 $h_0=0$에 곱해지므로 $W$를 바꿔도 $h_1$이 변하지 않습니다.

**2.** $1-h_1^2=1-h_2^2=0.75$, $\delta_2=(-1)(2)(0.75)=-1.5$, $\delta_1=(1\cdot2-1.5\cdot0.5)(0.75)=0.9375$. $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1=0.9375-0.75=0.1875$. 세 항으로는 $1.5-0.75-0.5625$입니다($h_0=0$이면 $-0.75$).`,
        rubric: R`
- 사라지는 두 항과 이유($\partial h_1/\partial W=(1-h_1^2)h_0$) — 2점
- δ 또는 세 항으로 정확한 계산 0.1875 — 3점` },
      { sec: '19.4', type: 'open', lv: 3, proof: true, quiz: true, q: R`세 단계 스칼라 RNN ($t=1,2,3$, 같은 모형과 $L=\sum_{t=1}^3\frac12(Y_t-Z_t)^2$)에서 $\partial L/\partial W$를 경로별 항으로 모두 쓰고, $\delta_3=(Y_3-Z_3)V(1-h_3^2)$, $\delta_t=[(Y_t-Z_t)V+\delta_{t+1}W](1-h_t^2)$ ($t=2,1$)이면 $\frac{\partial L}{\partial W}=\sum_{t=1}^3\delta_th_{t-1}$임을 보이세요. 항은 몇 개인가?`,
        sol: R`
**경로.** $L_t$에는 $W$가 $a_s$ ($s\le t$)에서 들어가 $h_s\to h_{s+1}\to\cdots\to h_t\to L_t$로 닿습니다. 경로 하나의 기여는 $(Y_t-Z_t)V\big[\prod_{k=s+1}^t(1-h_k^2)W\big](1-h_s^2)h_{s-1}$.

**여섯 항.** $e_t=Y_t-Z_t$, $d_t=1-h_t^2$로 쓰면
$$\begin{aligned}\frac{\partial L}{\partial W}=\ &e_1Vd_1h_0+e_2Vd_2h_1+e_2Vd_2Wd_1h_0\\&+e_3Vd_3h_2+e_3Vd_3Wd_2h_1+e_3Vd_3Wd_2Wd_1h_0.\end{aligned}$$
$1+2+3=6$개입니다.

**δ로 묶기.** $\delta_3=e_3Vd_3$, $\delta_2=(e_2V+\delta_3W)d_2=e_2Vd_2+e_3Vd_3Wd_2$, $\delta_1=(e_1V+\delta_2W)d_1=e_1Vd_1+e_2Vd_2Wd_1+e_3Vd_3Wd_2Wd_1$. 그러면 $\delta_3h_2$가 넷째 항, $\delta_2h_1$이 둘째·다섯째 항, $\delta_1h_0$이 첫째·셋째·여섯째 항이므로 합이 위 식과 같습니다.`,
        rubric: R`
- 경로의 일반 꼴 — 2점
- 여섯 항이 모두 정확함 — 4점
- δ 점화식 전개로 같음을 보임 — 3점
- 항의 개수 $T(T+1)/2=6$ — 1점` },
      { sec: '19.4', type: 'open', lv: 2, quiz: true, q: R`두 단계 RNN에서 출력이 마지막 시점에만 있어 $L=\frac12(Y_2-Z_2)^2$이라 하자(many to one). $\partial L/\partial W$와 $\partial L/\partial U$를 쓰고, $h_0=0$일 때 각각 몇 항이 남는지 답하세요.`,
        sol: R`$L_1$이 없으므로 경로는 $W\to h_2\to L$ (직접)과 $W\to h_1\to h_2\to L$ 둘입니다.
$$\frac{\partial L}{\partial W}=(Y_2-Z_2)V(1-h_2^2)h_1+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0,$$
$$\frac{\partial L}{\partial U}=(Y_2-Z_2)V(1-h_2^2)X_2+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)X_1.$$
$h_0=0$이면 $\partial L/\partial W$는 첫 항 하나, $\partial L/\partial U$는 두 항 모두 남습니다.`,
        rubric: R`
- 두 경로 — 1점
- $\partial L/\partial W$, $\partial L/\partial U$ 식 — 3점
- $h_0=0$일 때 남는 항 — 1점` },
      { sec: '19.5', type: 'open', lv: 3, proof: true, quiz: true, q: R`벡터 RNN $h_t=\tanh(Wh_{t-1}+Ux_t+b)$ ($h_t\in\mathbb R^n$), $Y_t=Vh_t+c$, $L=\sum_{t=1}^T\frac12\lVert Y_t-Z_t\rVert^2$에서 $\mathbf g_t=\partial L/\partial h_t$ (열벡터)가
$$\mathbf g_t=V^T(Y_t-Z_t)+W^T\diag(1-h_{t+1}^2)\,\mathbf g_{t+1},\qquad\mathbf g_{T+1}=\mathbf 0$$
을 만족함을 보이고, $\boldsymbol\delta_t=\diag(1-h_t^2)\mathbf g_t$로 $\frac{\partial L}{\partial W}=\sum_t\boldsymbol\delta_th_{t-1}^T$임을 보이세요.`,
        sol: R`
**$h_t$가 닿는 곳.** $h_t$는 $Y_t$를 통해 $L_t$에, $a_{t+1}=Wh_t+Ux_{t+1}+b$를 통해 $h_{t+1}$ 이후의 모든 손실에 닿습니다. 연쇄법칙(야코비안의 전치를 곱함)으로
$$\mathbf g_t=\Big(\frac{\partial Y_t}{\partial h_t}\Big)^T(Y_t-Z_t)+\Big(\frac{\partial h_{t+1}}{\partial h_t}\Big)^T\mathbf g_{t+1}=V^T(Y_t-Z_t)+\big(\diag(1-h_{t+1}^2)W\big)^T\mathbf g_{t+1}.$$
대각행렬은 대칭이므로 둘째 항은 $W^T\diag(1-h_{t+1}^2)\mathbf g_{t+1}=W^T\boldsymbol\delta_{t+1}$. 마지막 시점에는 뒤가 없으므로 $\mathbf g_{T+1}=\mathbf 0$.

**W.** $W$는 시점마다 $a_t$에 직접 들어가고, $\frac{\partial L}{\partial a_t}=\diag(1-h_t^2)\mathbf g_t=\boldsymbol\delta_t$입니다. $a_{t,i}=\sum_jW_{ij}h_{t-1,j}+\cdots$이므로 시점 $t$의 몫은 $\frac{\partial L}{\partial a_{t,i}}h_{t-1,j}$이고, 공유된 $W$의 기울기는 시점에 대한 합 $\frac{\partial L}{\partial W_{ij}}=\sum_t\delta_{t,i}h_{t-1,j}$, 곧 $\sum_t\boldsymbol\delta_th_{t-1}^T$입니다.`,
        rubric: R`
- $h_t$의 두 영향 경로 — 2점
- 야코비안 $\diag(1-h_{t+1}^2)W$와 전치 — 3점
- 종료 조건 — 1점
- $\partial L/\partial a_t=\boldsymbol\delta_t$와 시점 합으로 $\sum\boldsymbol\delta_th_{t-1}^T$ — 4점` },
      { sec: '19.5', type: 'mc', lv: 2, q: R`여러 단계 모형 $h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)$, $f_\theta(X)=Ah_L+b$에서 슬라이드 13의 $\frac{\partial\mathcal L}{\partial\tilde\theta}=\sum_\ell\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial h_\ell}{\partial\tilde\theta}$에 들어가는 $\frac{\partial h_\ell}{\partial\tilde\theta}$의 뜻은?`,
        choices: [R`$h_\ell$의 $\tilde\theta$에 대한 전미분(앞 시점을 거치는 경로 포함)`, R`$h_{\ell-1}$을 고정한 직접 미분 $\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$`, R`$\frac{\partial h_L}{\partial h_\ell}$`, R`$A$의 $\ell$번째 성분`], ans: 1,
        sol: R`앞 시점을 거치는 간접 경로는 $\frac{\partial\mathcal L}{\partial h_\ell}$ 쪽(야코비안의 곱)에 이미 들어 있으므로, 여기서는 시점 $\ell$에서 $\tilde\theta$가 직접 쓰인 몫만 셉니다. 전미분을 쓰면 경로를 두 번 세게 됩니다.` },
      { sec: '19.5', type: 'open', lv: 3, proof: true, q: R`$h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)$에서 $\frac{dh_L}{d\tilde\theta}=\sum_{\ell=1}^L\frac{\partial h_L}{\partial h_\ell}\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$ (단 $\frac{\partial h_L}{\partial h_\ell}=\frac{\partial h_L}{\partial h_{L-1}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell}$, $\frac{\partial h_L}{\partial h_L}=I$)를 $L$에 대한 귀납법으로 증명하세요.`,
        sol: R`
**$L=1$.** $h_0$은 $\tilde\theta$와 무관하므로 $\frac{dh_1}{d\tilde\theta}=\frac{\partial q}{\partial\tilde\theta}(h_0,u_1)$이고 이는 우변($\ell=1$, 곱은 $I$)과 같습니다.

**귀납 단계.** $h_L=q_{\tilde\theta}(h_{L-1},u_L)$에서 $\tilde\theta$는 직접, 그리고 $h_{L-1}$을 통해 들어가므로 다변수 연쇄법칙으로
$$\frac{dh_L}{d\tilde\theta}=\frac{\partial q}{\partial\tilde\theta}(h_{L-1},u_L)+\frac{\partial h_L}{\partial h_{L-1}}\frac{dh_{L-1}}{d\tilde\theta}.$$
귀납 가정 $\frac{dh_{L-1}}{d\tilde\theta}=\sum_{\ell=1}^{L-1}\frac{\partial h_{L-1}}{\partial h_\ell}\frac{\partial q}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$을 넣고 $\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_\ell}=\frac{\partial h_L}{\partial h_\ell}$을 쓰면 $\ell=1,\dots,L-1$의 항이 되고, 첫 항이 $\ell=L$의 항입니다.`,
        rubric: R`
- 기저 — 2점
- 직접·간접 두 경로의 연쇄법칙 — 4점
- 귀납 가정 대입과 야코비안 곱의 합침 — 4점` },
      { sec: '19.6', type: 'num', lv: 1, q: R`스칼라 RNN에서 시점마다 곱해지는 인수가 $0.9$로 일정하다면, 50걸음 떨어진 시점의 기울기는 원래의 몇 배인가? (소수로)`, ans: '0.9^50', ansTex: R`0.9^{50}\approx0.00515`,
        sol: R`$0.9^{50}=e^{50\ln0.9}\approx e^{-5.27}\approx0.00515$. 100걸음이면 $0.9^{100}\approx2.66\times10^{-5}$입니다.` },
      { sec: '19.6', type: 'num', lv: 2, q: R`기울기 $\mathbf g=(3,4)$에 문턱 $v=2$로 노름 잘라내기 $\mathbf g\leftarrow\min(1,v/\lVert\mathbf g\rVert)\mathbf g$를 하면 첫 성분은?`, ans: '6/5', ansTex: R`1.2`,
        sol: R`$\lVert\mathbf g\rVert=5>2$이므로 $\frac25(3,4)=(1.2,1.6)$. 방향은 같고 크기는 2입니다.` },
      { sec: '19.6', type: 'mc', lv: 2, q: R`슬라이드 15의 식 $g\leftarrow\max\big(1,\frac{v}{\lVert g\rVert}\big)g$의 문제는?`,
        choices: [R`문제없다`, R`$\lVert g\rVert\le v$일 때 $g$를 $\frac{v}{\lVert g\rVert}\ge1$배로 키우므로, 같은 슬라이드의 경우 나눔과 맞으려면 $\min$이어야 한다`, R`방향을 바꾼다`, R`$v$가 음수여야 한다`], ans: 1,
        sol: R`경우 나눔($\lVert g\rVert\le v$이면 $g$, 아니면 $\frac v{\lVert g\rVert}g$)은 $\min\big(1,\frac{v}{\lVert g\rVert}\big)g$입니다.` },
      { sec: '19.6', type: 'mc', lv: 1, q: R`바닐라 RNN의 기울기 **소실**을 완화하려고 고안된 구조는?`,
        choices: [R`기울기 잘라내기`, R`게이트로 셀 상태를 따로 흘리는 LSTM`, R`학습률을 키우기`, R`은닉 상태를 0으로 초기화하기`], ans: 1,
        sol: R`잘라내기는 폭발을 다룹니다. 슬라이드 17–22는 기울기 흐름을 돕는 구조로 LSTM을 소개합니다. 셀 상태를 따라 곱해지는 야코비안이 $\diag(f_t)$라 $f_t\approx1$이면 기울기가 거의 그대로 지나갑니다.` },
      { sec: '19.6', type: 'open', lv: 3, proof: true, quiz: true, q: R`$h_{k+1}=\phi(Wh_k+Uu_{k+1}+c)$이고 $\gamma=\sup\lvert\phi'\rvert$일 때
$$\Big\lVert\frac{\partial\mathcal L}{\partial h_\ell}\Big\rVert\le\big(\gamma\lVert W\rVert_2\big)^{L-\ell}\Big\lVert\frac{\partial\mathcal L}{\partial h_L}\Big\rVert$$
임을 보이고, 이로부터 기울기가 소실되는 충분조건과 폭발하기 위한 필요조건을 쓰세요. $\phi=\tanh$, $W=0.5I$이면 20걸음 뒤의 기울기는 많아야 몇 배인가?`,
        sol: R`
**한 걸음.** $\frac{\partial h_{k+1}}{\partial h_k}=\diag(\phi'(a_{k+1}))W$. 대각행렬의 2-노름은 대각 성분 절댓값의 최대이므로 $\lVert\diag(\phi'(a_{k+1}))\rVert_2\le\gamma$이고, 노름의 곱 부등식으로 $\big\lVert\frac{\partial h_{k+1}}{\partial h_k}\big\rVert_2\le\gamma\lVert W\rVert_2$.

**곱.** $\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\prod_{k=\ell}^{L-1}\frac{\partial h_{k+1}}{\partial h_k}$에 곱 부등식을 $L-\ell$번 쓰면 결론이 나옵니다.

**조건.** $\gamma\lVert W\rVert_2<1$이면 우변이 지수적으로 0으로 가므로 소실의 충분조건입니다. 대우로, 폭발하려면(곱이 커지려면) $\gamma\lVert W\rVert_2>1$이 필요합니다(충분하지는 않음).

**예.** $\gamma=1$, $\lVert0.5I\rVert_2=0.5$이므로 $0.5^{20}\approx9.5\times10^{-7}$배 이하입니다.`,
        rubric: R`
- 한 걸음 야코비안과 $\gamma\lVert W\rVert_2$ 상한 — 3점
- 곱의 상한 — 2점
- 충분조건·필요조건을 바르게 구분 — 3점
- 수치 $0.5^{20}$ — 2점` },
      { sec: '19.6', type: 'open', lv: 2, proof: true, quiz: true, q: R`노름 잘라내기 $\mathrm{clip}(\mathbf g)=\min\big(1,\frac{v}{\lVert\mathbf g\rVert}\big)\mathbf g$ ($\mathbf g\ne\mathbf 0$, $v>0$)가 방향을 보존하고 $\lVert\mathrm{clip}(\mathbf g)\rVert=\min(\lVert\mathbf g\rVert,v)$임을 보이세요. 성분마다 $[-v,v]$로 자르는 값 잘라내기는 왜 방향을 바꿀 수 있는지 예를 드세요.`,
        sol: R`
**방향.** $s=\min(1,v/\lVert\mathbf g\rVert)>0$이므로 $\mathrm{clip}(\mathbf g)=s\mathbf g$는 $\mathbf g$의 양수배, 곧 같은 방향입니다.

**크기.** $\lVert s\mathbf g\rVert=s\lVert\mathbf g\rVert=\min(\lVert\mathbf g\rVert,v)$.

**값 잘라내기.** $\mathbf g=(10,1)$, $v=2$이면 값 잘라내기는 $(2,1)$로 방향이 $(10,1)$과 다릅니다. 노름 잘라내기는 $\frac{2}{\sqrt{101}}(10,1)\approx(1.99,0.20)$.`,
        rubric: R`
- 양수배이므로 방향 보존 — 2점
- 크기 계산 — 2점
- 값 잘라내기의 반례 — 1점` },
    ],
  });
})();
