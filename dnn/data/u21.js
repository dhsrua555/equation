/* 21 어텐션과 트랜스포머 — 10주차 월요일 슬라이드 35–80 (Attention and Transformers). 35–57은 캡셔닝에서 어텐션으로, 60–80은 일반 어텐션 층과 트랜스포머 인코더 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 21, part: 'H', title: '어텐션과 트랜스포머', en: 'Attention & Transformers', ref: 'W10 월 · 슬라이드 35–80', plot: 'attn',
    fig: R`키 16개의 소프트맥스 가중치를 큰 순서로 늘어놓은 모양: 점수를 √D로 나누지 않으면(가는 선, 차원 D = 4, 16, 64, 256) D가 클수록 한 키에 몰리고, 나누면(굵은 선) 퍼진 채로 남는다`,
    tagline: R`어텐션은 ‘질의 하나가 입력 전체를 훑어 필요한 만큼 섞어 오는’ 연산입니다. 캡셔닝에서 그림의 어느 부분을 볼지 고르던 것이 점수 $q\cdot k/\sqrt D$의 소프트맥스로 일반화되고, 키·값·질의, 위치 부호화, 마스크, 멀티헤드, 잔차와 층 정규화를 쌓으면 트랜스포머 인코더가 됩니다.`,
    summary: R`20단원의 캡셔닝은 이미지 특성을 LSTM의 시작에 한 번만 넣어서 문장이 길어질수록 그림을 잊었습니다. 이를 매 걸음의 **지름길**로, 다시 **소프트 어텐션**으로 고칩니다. 14×14 특성 지도의 위치마다 점수 $e_{i,j}=f_{att}(\mathbf x_{i,j},\mathbf h_{t-1})$를 소프트맥스해 합이 1인 가중치 $\alpha$를 만들고 $\mathbf z=\sum\alpha\mathbf x$로 요약합니다. 채널 어텐션(SENet)은 합이 1일 필요 없는 채널별 가중치입니다. 귀납 편향의 관점에서 CNN은 2차원 격자와 이동 불변성, RNN은 1차원 사슬을 가정하는데, 하나의 모델이 여러 자료를 다루려면 이런 가정을 줄여야 하고 어텐션이 그 답입니다. 일반 어텐션 층은 $e_i=\mathbf h\cdot\mathbf x_i/\sqrt D$, $\mathbf a=\mathrm{softmax}(\mathbf e)$, $\mathbf c=\sum a_i\mathbf x_i$이며, $\sqrt D$로 나누는 것은 분산 $D$인 점수가 소프트맥스를 포화시키는 것을 막기 위해서입니다. 입력에서 키·값·질의를 만들면 **셀프 어텐션** $\mathrm{softmax}(QK^T/\sqrt{D_k})V$로, 순열 등변이어서 순서를 모르므로 **위치 부호화**(사인·코사인)를 더하고, 언어 모델에서는 미래를 $-\infty$로 가리는 **마스크**를 씁니다. 여러 헤드를 병렬로 돌리는 **멀티헤드**, 그리고 잔차 연결과 **층 정규화**, 위치별 FF를 묶은 **인코더 블록**을 $N$번 쌓은 것이 트랜스포머 인코더입니다.`,
    goals: [
      R`캡셔닝의 이미지 조건화 세 방식(첫 단어, 지름길, 어텐션)을 비교하고, 첫 단어 방식에서 이미지의 영향이 약해지는 이유를 기울기의 곱으로 설명할 수 있다`,
      R`소프트 어텐션 $\mathbf z^{(t)}=\sum_{i,j}\alpha^{(t)}_{i,j}\mathbf x_{i,j}$를 계산하고, $\partial\mathbf z/\partial e_m=\alpha_m(\mathbf x_m-\mathbf z)$를 유도하며, 하드 어텐션의 기댓값이 소프트 어텐션임을 보일 수 있다`,
      R`채널 어텐션(SENet)의 계산과 매개변수 수를 쓰고, 공간 어텐션과 합이 1이어야 하는지 여부로 구별하며, 귀납 편향의 뜻을 CNN과 RNN으로 설명할 수 있다`,
      R`일반 어텐션 층의 식을 쓰고, $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$를 유도하며 $\sqrt D$로 나누는 이유와 소프트맥스 포화에서 기울기가 사라지는 것을 보일 수 있다`,
      R`키·값·질의, 교차와 셀프 어텐션의 모양을 계산하고, 셀프 어텐션의 순열 등변성 $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$와 비용 $O(N^2d)$를 증명할 수 있다`,
      R`사인 위치 부호화가 상대 위치의 회전행렬 $PE(t+\Delta)=R(\Delta)PE(t)$를 만족함을 보이고, 마스크 어텐션에서 미래의 가중치가 $0$이고 각 행의 합이 $1$임을 증명할 수 있다`,
      R`멀티헤드의 매개변수 $4D^2$와 비용을 유도하고, 인코더 블록의 식과 형상, 매개변수 수 $12d^2$를 계산하며, 층 정규화의 성질을 BN과 비교할 수 있다`,
    ],
    secTitles: { '21.1': '이미지 조건화', '21.2': '공간 어텐션', '21.3': '채널·귀납 편향', '21.4': '스케일 점곱', '21.5': '셀프·교차', '21.6': '위치·마스크', '21.7': '멀티헤드·인코더', '21.8': '층 정규화·비용' },
    sections: [
      { k: '21.1', src: 'W10 월 · 슬라이드 35–41', title: '이미지 조건화: 처음 한 번에서 매 걸음으로', body: R`
:::idea 쉽게 말하면
캡셔닝 모델이 그림을 본 것은 문장을 쓰기 시작하는 순간 한 번뿐이라면, 문장이 길어질수록 그림의 기억은 흐려집니다. 그러면 모델은 그림을 보지 않고 앞 단어만으로 그럴듯한 문장을 지어 버립니다(“A man …” 다음에 늘 “is standing”). 그림을 단어마다 다시 보여 주면 이 문제가 줄고, 어텐션은 한 걸음 더 나아가 ‘그림의 어느 부분을 볼지’까지 정해 줍니다.
:::

**나이브한 캡셔닝** (슬라이드 35–39). 구조는 20단원과 같습니다[[ch20:20.5|CNN 인코더 + RNN 디코더의 캡셔닝.]]. 이미지 $\mathbf x$를 사전 학습된 CNN $g_\phi$에 넣어 분류층 직전의 특성 벡터를 꺼냅니다(슬라이드 35의 VGG16에서는 FC 층의 $1\times1\times4096$, 이어지는 그림에서는 $1\times1\times2048$). 이 벡터를 Linear 층으로 LSTM의 입력 크기에 맞춘 뒤 ‘첫 단어’로 LSTM에 먹이고, 이어서 $\langle\mathrm{sos}\rangle$, Man, … 을 넣어 단어를 한 칸씩 냅니다. 학습은 (이미지, 문장) 쌍으로 하고 칸마다 교차 엔트로피를 더합니다(슬라이드 39): $\sum_{t=1}^T\mathcal L(\hat{\mathbf y}_t,\mathbf y_t)$. 문장 생성의 학습과 같습니다[[ch20:20.4|칸마다의 교차 엔트로피와 교사 강요.]].

**실용적인 문제** (슬라이드 40). 슬라이드는 “$\langle\mathrm{sos}\rangle$ A Man ?” 다음 단어를 맞혀 보라고 묻습니다. RNN이 충분히 강하면 이미지 없이 앞 단어만으로도 그럴듯한 문장을 만들 수 있고, 특히 앞 단어가 다음 단어에 더 직접적인 영향을 줍니다(**의존 거리**가 짧기 때문). 캡셔닝이 이미지의 내용에 조건화되려면 이미지에 대한 조건화를 **강화**해야 합니다.

**지름길(shortcut)** (슬라이드 41). 이미지 특성을 첫 입력 한 번이 아니라 **매 걸음**의 입력에 연결합니다. 장점은 이미지에서 각 칸까지의 의존 거리가 $1$로 줄어드는 것이고, 단점은 모델이 여전히 이미지 조건을 무시할 수 있다는 것입니다.

:::key 이미지 조건화의 세 방식
이미지 특성 $\mathbf v=W_vg_\phi(\mathbf x)$, 단어 임베딩 $W_{emb}\mathbf y_t$일 때
$$\text{첫 단어:}\ \ \mathbf h_{-1}\!\leftarrow\!\mathrm{LSTM}(\mathbf 0,\mathbf v),\ \ \mathbf h_t=\mathrm{LSTM}(\mathbf h_{t-1},W_{emb}\mathbf y_t)$$
$$\text{지름길:}\ \ \mathbf h_t=\mathrm{LSTM}(\mathbf h_{t-1},W_{emb}\mathbf y_t,\ \mathbf v)$$
$$\text{어텐션:}\ \ \mathbf h_t=\mathrm{LSTM}(\mathbf h_{t-1},W_{emb}\mathbf y_t,\ \mathbf z^{(t)}),\quad\mathbf z^{(t)}=\text{걸음마다 다른 이미지 요약 (21.2)}$$
:::

세 번째는 $\mathbf v$ 자리에 걸음마다 새로 만든 요약 $\mathbf z^{(t)}$를 넣는 것입니다. ‘지금 쓰려는 단어와 관련된 부분’을 요약해 주므로, 지름길이 가진 의존 거리 $1$에 더해 무엇을 볼지도 고릅니다.

:::ex 예제 1 — 조건화 층의 크기
특성 벡터가 $2048$차원이고 LSTM의 입력(임베딩) 크기가 $512$일 때, 특성을 LSTM에 맞추는 Linear 층(편향 포함)의 매개변수는?
---
$2048\cdot512+512=1{,}048{,}576+512=1{,}049{,}088$개. 이 층은 이미지 한 장에 한 번만 쓰이는 대신 첫 단어 방식에서는 그 출력이 이후 모든 칸으로 흘러야 합니다.
:::

### 더 깊이

**‘의존 거리’의 정량.** 첫 단어 방식에서 걸음 $t$의 은닉 상태가 이미지 특성에 의존하는 경로는 하나뿐이고, 기울기는 $t$개의 야코비안 곱을 지납니다. 바닐라 RNN이면 노름이 $\lVert W_h\rVert^t$ 이하로 제한됩니다[[ch19:19.6|기울기 소실.]]. 지름길 방식에서는 $\mathbf v$가 걸음 $t$의 입력에 직접 들어가므로 길이 $1$의 경로가 따로 생깁니다. 이 비교는 이 단원의 연습문제에서 유도합니다.
` },
      { k: '21.2', src: 'W10 월 · 슬라이드 42–53', title: '공간 소프트 어텐션과 하드 어텐션', body: R`
:::idea 쉽게 말하면
“A bird flying over a body of water.”에서 bird를 쓸 때는 새가 있는 곳을, water를 쓸 때는 물 쪽을 보면 됩니다. 어텐션은 그림을 $14\times14$ 칸으로 나누고 칸마다 **음이 아닌 가중치**를 주되 모두 더하면 $1$이 되게 합니다. 이 가중치로 칸의 특성을 섞은 평균이 ‘이 단어를 쓸 때 본 그림’이고, 단어마다 가중치가 새로 계산됩니다.
:::

**소프트 어텐션이란** (슬라이드 42). 어텐션이 없는 경우(No attention)는 모든 칸에 같은 가중치를 주는 균일 어텐션과 같고, 소프트 어텐션은 단어의 예측을 이미지의 **일부분**에 조건화합니다.

**어텐션의 정의** (슬라이드 43–46). 캡셔닝에서는 CNN의 conv5 출력 $\mathbf x\in\mathbb R^{14\times14\times512}$를 씁니다. 위치가 $14\cdot14=196$개이고 위치마다 $C=512$차원 벡터 $\mathbf x_{i,j}$가 있습니다. 단어 $t$를 쓸 때의 어텐션 $\alpha^{(t)}\in\mathbb R^{W\times H}$는 특성 지도와 같은 공간 크기의 **양수 행렬**이고 $\sum_{i,j}\alpha^{(t)}_{i,j}=1$입니다. 이것으로 이미지 특성을 하나의 벡터로 요약합니다.
$$\mathbf z^{(t)}=\sum_{i,j}\alpha^{(t)}_{i,j}\,\mathbf x_{i,j}\in\mathbb R^C$$
슬라이드 45–46이 남긴 두 질문은 ‘어텐션을 어떻게 계산하는가’와 ‘이를 단어 예측에 어떻게 쓰는가’입니다.

**계산** (슬라이드 47–49). LSTM의 직전 은닉 상태 $\mathbf h_{t-1}$이 ‘지금 무엇이 필요한지’를 나타냅니다. 어텐션 모듈 $f_{att}$가 특성 $\mathbf x$와 $\mathbf h_{t-1}$을 받아 위치마다 **점수** $e^{(t)}_{i,j}$를 내고, 모든 위치에 걸친 소프트맥스로 가중치를 만듭니다.
$$e^{(t)}_{i,j}=f_{att}(\mathbf x_{i,j},\mathbf h_{t-1}),\qquad\alpha^{(t)}_{i,j}=\frac{\exp(e^{(t)}_{i,j})}{\sum_{i',j'}\exp(e^{(t)}_{i',j'})}$$

**사용** (슬라이드 50–51). 요약 $\mathbf z^{(t)}$를 LSTM의 추가 입력으로 넣고(Modified LSTM), 출력 단계에서도 더합니다.

:::key 소프트 어텐션 캡셔닝
$$e^{(t)}_{i,j}=f_{att}(\mathbf x_{i,j},\mathbf h_{t-1}),\quad\alpha^{(t)}=\mathrm{softmax}(e^{(t)}),\quad\mathbf z^{(t)}=\sum_{i,j}\alpha^{(t)}_{i,j}\mathbf x_{i,j}$$
$$\mathbf h^{(t)}=\mathrm{LSTM}\big(\mathbf h_{t-1},\,W_{emb}\mathbf y_t,\,\mathbf z^{(t)}\big),\qquad\hat{\mathbf y}_{t+1}=\mathrm{softmax}\big(W^o(W_{emb}\mathbf y_t+W^h\mathbf h_t+W^z\mathbf z_t)\big)$$
$\alpha_{i,j}>0$, $\sum\alpha=1$이므로 $\mathbf z$는 특성 벡터들의 **볼록 결합**이다.
:::

슬라이드는 $f_{att}$의 내부를 정하지 않습니다. 흔한 예(슬라이드 밖)는 작은 MLP $e_{i,j}=\mathbf w^T\tanh(W_x\mathbf x_{i,j}+W_h\mathbf h_{t-1})$이고, 21.4절의 점곱이 또 하나의 선택입니다. 출력 식은 슬라이드에 $\exp(\cdots)$로만 적혀 있는데 정규화 상수를 생략한 소프트맥스로 읽습니다.

**하드 어텐션** (슬라이드 53). 소프트 어텐션은 모든 칸을 가중 평균하지만, **하드 어텐션**은 한 칸만 고릅니다. $s_t\sim\mathrm{Categorical}(\alpha^{(t)})$를 뽑아 $\mathbf z^{(t)}=\mathbf x_{s_t}$로 두면 그림이 하나의 점으로 나타납니다(슬라이드의 아래쪽 줄). 소프트는 이 선택의 **기댓값** $\mathbb E[\mathbf x_{s_t}]=\sum\alpha\mathbf x$이고 평범한 역전파로 학습되는 반면, 하드는 칸을 뽑는 연산이 미분되지 않아 다른 학습 기법이 필요합니다(슬라이드 범위 밖).

:::ex 예제 2 — 세 칸의 가중 평균
세 칸의 특성이 $\mathbf x_1=(1,0)$, $\mathbf x_2=(0,1)$, $\mathbf x_3=(1,1)$이고 점수가 $e=(0,\ln3,0)$일 때 $\alpha$와 $\mathbf z$는?
---
$e^e=(1,3,1)$, 합 $5$이므로 $\alpha=(\frac15,\frac35,\frac15)$. $\mathbf z=\frac15(1,0)+\frac35(0,1)+\frac15(1,1)=(\frac25,\frac45)$. 점수가 가장 큰 칸 $\mathbf x_2$ 쪽으로 치우친 평균입니다.
:::

:::warn 이 단원에서의 ‘어텐션’의 두 뜻
캡셔닝의 어텐션은 질의가 $\mathbf h_{t-1}$ 하나이고 입력이 $14\times14$ 특성인 **한 가지 경우**입니다. 21.4절의 일반 어텐션 층은 점수 함수 $f_{att}$를 점곱으로 바꾸고 질의를 여러 개 두는 것으로, 이 경우는 질의 $M=1$, 키와 값이 모두 특성 $\mathbf x$인 교차 어텐션입니다.
:::
` },
      { k: '21.3', src: 'W10 월 · 슬라이드 54–61', title: '채널 어텐션과 귀납 편향', body: R`
:::idea 쉽게 말하면
소프트 어텐션은 ‘어느 위치’를 볼지 골랐습니다. 채널 어텐션은 ‘어느 필터의 반응’을 키울지 고릅니다. 전역 풀링으로 채널마다 숫자 하나로 요약하고, 이를 작은 신경망에 넣어 채널별 가중치를 얻어 원래 특성 지도에 곱합니다. 이때 가중치는 위치 어텐션처럼 합이 $1$일 필요가 없고, 각 채널의 볼륨 손잡이처럼 독립입니다.
:::

**채널 어텐션: SENet** (슬라이드 54). Squeeze-and-Excitation Net은 특성 지도 $U\in\mathbb R^{H\times W\times C}$를 세 단계로 다시 가중합니다. 슬라이드의 메모는 ‘전역 풀링으로 채널별 가중치를 구하고 원래 차원에 곱한다’이고, 그림 옆에 “여기서는 attention 합이 $1$이 아니어도 된다”고 적혀 있습니다.

:::key 스퀴즈-익사이트 블록
$$s_c=\frac1{HW}\sum_{i,j}U_{i,j,c},\qquad\mathbf w=\sigma\big(W_2\,\mathrm{ReLU}(W_1\mathbf s)\big),\qquad\tilde U_{:,:,c}=w_c\,U_{:,:,c}$$
$W_1\in\mathbb R^{(C/r)\times C}$, $W_2\in\mathbb R^{C\times(C/r)}$ ($r$: 축소 비). 매개변수는 편향 없이 $2C^2/r$. 가중치 $w_c\in(0,1)$는 채널마다 독립이다.
:::

세 단계는 squeeze(전역 평균 풀링으로 $H\times W\times C\to C$), excitation(병목 MLP와 시그모이드, $C\to C/r\to C$), scale(채널별 곱)입니다. 축소 비 $r$와 식은 SENet 논문의 것입니다. 슬라이드 아래쪽의 ANTBlock(모바일 네트워크)은 같은 생각을 잔차 블록 안에 넣은 예입니다.

| | 공간 소프트 어텐션 | 채널 어텐션 (SENet) |
|---|---|---|
| 가중치의 모양 | $H\times W$ (위치마다) | $C$ (채널마다) |
| 정규화 | 소프트맥스, 합이 $1$ | 시그모이드, 독립 |
| 하는 일 | 위치를 섞어 **요약** ($\mathbf z$) | 특성 지도를 **재가중** (같은 크기) |

**귀납 편향** (슬라이드 55–61). 지금까지 배운 망은 MLP(선형층 + 비선형), CNN(합성곱 + 풀링 + 비선형 + MLP), RNN(순환용 MLP + 게이트)이고, 이제 **어텐션과 트랜스포머**(점곱 어텐션 + MLP)가 더해집니다(슬라이드 55). 슬라이드 56은 “왜 자료와 과제마다 모델이 다를까? 조합을 바꾸면 어떻게 될까(순열 위의 CNN, 이미지 위의 RNN, 벡터·이미지 위의 MLP)”를 묻습니다. 답은 **귀납 편향**입니다.

:::key 귀납 편향
**귀납 편향**(inductive bias)이란 학습자가 **보지 못한 입력**에 대해 출력을 예측할 때 쓰는 **가정들의 집합**이다(슬라이드 57).
- CNN: 자료의 **2차원 격자 구조**와 **이동 불변성**(국소성에 의존)[[ch15:15.6|합성곱의 이동 등변성.]].
- RNN: 자료의 **1차원 사슬 구조**를 이용한다(슬라이드의 문장은 여기서 잘려 있다)[[ch19:19.2|같은 가중치를 시간에 공유하는 순환.]].
:::

이런 가정은 효율적인 모델을 설계하는 데 유용하지만, 문제는 가정이 **다른 자료 형태에 일반화되지 않는다**는 것입니다(슬라이드 60). 마지막 슬라이드 61은 이미지·점군·소리·언어를 하나의 신경망에 넣어 물체·움직임·의미·깊이를 내는 **범용 모델**을 목표로 하며 “이를 위한 가장 중요한 요구는?”이라고 묻고 답은 적지 않습니다. 이어지는 슬라이드의 흐름이 주는 답은 ‘자료의 형태를 가정하지 않는 연산’, 곧 입력을 **벡터의 모음**으로만 보고 점수로 서로 섞는 어텐션입니다[[@med:ch11:9.1|귀납적 편향과 불변성.]].

:::ex 예제 3 — SE 블록의 크기
$C=64$, 축소 비 $r=16$인 SE 블록의 매개변수는(편향 없이)? 전역 풀링 뒤 벡터의 길이는?
---
$W_1$은 $4\times64=256$, $W_2$는 $64\times4=256$개로 합 $512=2C^2/r$. 전역 풀링 뒤는 채널 수와 같은 $64$입니다. 합성곱 하나가 $64\cdot64\cdot9\approx37\text{k}$개를 가지는 것과 비교하면 아주 작은 부담입니다.
:::
` },
      { k: '21.4', src: 'W10 월 · 슬라이드 62–66', title: '일반 어텐션 층과 스케일 점곱', body: R`
:::idea 쉽게 말하면
어텐션은 ‘질의 하나로 입력 목록을 훑어 관련된 만큼 가져오는 가중 평균’입니다. 질의와 각 입력이 얼마나 닮았는지(점수)를 소프트맥스로 가중치로 바꾸고, 그 가중치로 입력을 섞습니다. 점수로는 점곱 $\mathbf h\cdot\mathbf x_i$를 쓰는데, 벡터가 길수록 점곱이 커져 소프트맥스가 한 곳에 몰리므로 $\sqrt D$로 나눠 줍니다.
:::

**일반 어텐션 층** (슬라이드 64). 입력 벡터 $\mathbf x$(모양 $N\times D$)와 질의 $\mathbf h$(모양 $D$)를 받아 세 단계를 거칩니다. **정렬**: $e_i=f_{att}(\mathbf h,\mathbf x_i)$. **어텐션**: $\mathbf a=\mathrm{softmax}(\mathbf e)$. **출력**: $\mathbf c=\sum_ia_i\mathbf x_i$(맥락 벡터, 모양 $D$). 슬라이드는 이 연산이 **순열 불변**(permutation invariant)임을 강조합니다. 입력의 순서를 신경 쓰지 않아서, 특성 지도의 $H\times W$를 $N=HW$개의 벡터로 펴서 넣어도 됩니다. 21.2절의 캡셔닝 어텐션이 바로 이 층입니다.

**스케일 점곱** (슬라이드 65). 점수 함수를 크기를 맞춘 점곱으로 바꿉니다.

:::key 스케일 점곱 어텐션
$$e_i=\frac{\mathbf h\cdot\mathbf x_i}{\sqrt D},\qquad\mathbf a=\mathrm{softmax}(\mathbf e),\qquad\mathbf c=\sum_{i=1}^Na_i\mathbf x_i$$
질의가 $M$개이면(슬라이드 66, $Q\in\mathbb R^{M\times D}$) $e_{i,j}=\mathbf q_j\cdot\mathbf x_i/\sqrt D$이고, 질의마다 입력 방향으로 소프트맥스해 $\mathbf y_j=\sum_ia_{i,j}\mathbf x_i$:
$$E=\frac{QX^T}{\sqrt D}\in\mathbb R^{M\times N},\qquad A=\mathrm{softmax}_{\text{행}}(E),\qquad Y=AX\in\mathbb R^{M\times D}$$
행 $j$가 질의 $j$이고 슬라이드의 $e_{i,j}$가 $E_{ji}$이다. $\mathbf q\cdot\mathbf k$의 성분이 독립이고 평균 $0$, 분산 $1$이면 $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$.
:::

**왜 $\sqrt D$인가** (슬라이드 65의 설명). (1) 차원이 클수록 점곱의 합에 더해지는 항이 많아서 로짓의 **분산이 커집니다**. (2) 크기가 큰 벡터는 훨씬 큰 로짓을 만듭니다. (3) 그러면 소프트맥스 뒤의 분포가 엔트로피가 낮아져 한 곳에 몰리고 나머지에 거의 가중치를 주지 않습니다. (4) 그 결과 기울기가 사라집니다. 그래서 $\sqrt D$로 나눠 큰 벡터의 효과를 줄입니다. 분산이 정확히 $D$라는 것은 이 단원의 증명에 있고, 소프트맥스가 포화되면 기울기가 $0$으로 간다는 것도 거기서 보입니다.

:::fig attnflow
:::

:::warn 표기가 섞여 있다
같은 뜻의 스케일 인수가 슬라이드마다 다르게 적혀 있습니다. 슬라이드 62는 $\sqrt{d_k}$, 63은 $\sqrt d$, 65–67은 $\sqrt D$입니다. 모두 **질의와 키의 차원**을 가리킵니다. 이 단원은 질의·키·입력이 모두 $D$차원일 때 $D$로, 투영한 뒤의 차원이 달라질 때 $D_k$로 씁니다.
:::

:::ex 예제 4 — 스케일의 효과
$D=64$이고 성분이 독립인 $\mathbf q,\mathbf k$(평균 $0$, 분산 $1$)일 때 $\mathbf q\cdot\mathbf k$의 표준편차는? 두 키의 점수 차가 $\sqrt D$로 나누기 전에 $8$이었다면 나눈 뒤 두 키의 가중치는?
---
분산이 $D=64$이므로 표준편차는 $8$이고, $\sqrt D=8$로 나누면 분산이 $1$이 됩니다. 점수 차 $8\to1$이면 큰 쪽의 가중치가 $\frac1{1+e^{-1}}\approx0.73$, 작은 쪽이 $0.27$입니다. 나누지 않으면 $\frac1{1+e^{-8}}\approx0.9997$로 거의 한 키만 남습니다.
:::

### 더 깊이

**온도로 읽기.** $\mathrm{softmax}(\mathbf e/\sqrt D)$는 온도 $T=\sqrt D$의 소프트맥스입니다. 단원 표지의 곡선이 이것입니다: 같은 점수에 $\sqrt D$배를 곱한 소프트맥스(가는 선)는 $D$가 클수록 한 키에 몰리고, 원래 척도(굵은 선)는 퍼져 있습니다.

**순열 불변.** 일반 어텐션 층의 출력은 입력 순서를 바꿔도 변하지 않습니다. 순서를 바꾸면 $\sum_ia_i\mathbf x_i$의 항들이 같은 쌍 $(a_i,\mathbf x_i)$로 이동할 뿐이고 합은 순서에 무관하기 때문입니다. 질의가 여러 개인 층에서는 출력의 순서가 질의를 따라 움직이는 **등변**이 됩니다(21.5절).
` },
      { k: '21.5', src: 'W10 월 · 슬라이드 63·67–68', title: '키·값·질의, 교차 어텐션과 셀프 어텐션', body: R`
:::idea 쉽게 말하면
일반 어텐션 층은 입력 $\mathbf x_i$를 점수 계산과 섞는 내용에 **같은 벡터**로 씁니다(슬라이드 67). 도서관에 비유하면 ‘검색어와 맞는지 보는 색인’과 ‘실제로 가져올 내용’을 다르게 두는 편이 낫습니다. 입력에 서로 다른 선형층을 달아 **키** $\mathbf k=\mathbf xW_k$(색인)와 **값** $\mathbf v=\mathbf xW_v$(내용)를 만들고, 질의는 찾는 말입니다. 질의도 같은 입력에서 만들면 입력이 서로를 찾아보는 **셀프 어텐션**입니다.
:::

**교차 어텐션** (슬라이드 67). 입력 $\mathbf x$(모양 $N\times D$)에서 키 $\mathbf k=\mathbf xW_k$($D_k$차원)와 값 $\mathbf v=\mathbf xW_v$($D_v$차원)를 만들고, 질의 $\mathbf q$(모양 $M\times D_k$)는 **밖에서** 옵니다. 정렬 $e_{i,j}=\mathbf q_j\cdot\mathbf k_i/\sqrt D$, 어텐션 $\mathbf a=\mathrm{softmax}(\mathbf e)$, 출력 $\mathbf y_j=\sum_ia_{i,j}\mathbf v_i$(모양 $D_v$)입니다. 키·값의 선형층 덕분에 입출력 차원이 달라질 수 있고, 슬라이드의 설명대로 점수와 섞는 단계에 서로 다른 FC 층을 달아 **표현력을 더합니다**. 캡셔닝이나 번역의 디코더가 인코더 출력을 보는 것이 이것입니다[[ch20:20.5|인코더-디코더의 병목을 푸는 것.]].

**셀프 어텐션** (슬라이드 63·68). 질의도 같은 입력에서 만듭니다: $\mathbf q=\mathbf xW_q$.
$$\mathrm{Attn}(\mathbf xW_q,\mathbf xW_k,\mathbf xW_v)=\mathrm{softmax}\Big(\frac{\mathbf xW_q(\mathbf xW_k)^T}{\sqrt{d}}\Big)\mathbf xW_v,\qquad\mathbf x\in\mathbb R^{n\times d},\ A\in\mathbb R^{n\times n}$$
출력은 입력의 **맥락 부호화**(contextual encoding)이고, 한 층에서 수용 영역이 입력 **전체**입니다. 슬라이드 68의 결론은 이 층이 **순열 등변**(permutation equivariant)이라는 것입니다.

:::key 셀프 어텐션의 모양과 비용
$X\in\mathbb R^{N\times D}$, $W_q,W_k\in\mathbb R^{D\times D_k}$, $W_v\in\mathbb R^{D\times D_v}$:
$$Q=XW_q,\ K=XW_k,\ V=XW_v,\qquad A=\mathrm{softmax}\Big(\frac{QK^T}{\sqrt{D_k}}\Big)\in\mathbb R^{N\times N},\qquad Y=AV\in\mathbb R^{N\times D_v}$$
매개변수 $D(2D_k+D_v)$(편향 없이). 곱셈 수 $ND(2D_k+D_v)+N^2(D_k+D_v)$이고 $A$의 메모리는 $N^2$이다. $D_k=D_v=d$이면 계산량은 $O(N^2d+Nd^2)$, 곧 어텐션 부분은 $O(N^2d)$.
:::

:::fig attnshape
:::

:::key 셀프 어텐션의 순열 등변성
$P$가 순열행렬이면 $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$이다. 곧 입력의 순서를 바꾸면 출력이 같은 순서로 바뀔 뿐이다. 따라서 위치 정보가 없으면 ‘A가 B를 본다’와 ‘B가 A를 본다’를 구별하지 못한다(21.6절).
:::

**캡셔닝과의 관계.** 21.2절의 어텐션은 $M=1$(질의 $\mathbf h_{t-1}$)이고 키와 값이 모두 특성 지도 $\mathbf x$인 교차 어텐션이며, 점수 함수만 MLP였던 것입니다[[@med:ch15:12.1b|셀프 어텐션과 QKV.]].

:::ex 예제 5 — 모양과 매개변수 세기
$N=10$, $D=512$, $D_k=D_v=64$인 셀프 어텐션 층(편향 없이)에서 $Q,K,V,A,Y$의 모양과 매개변수 수는?
---
$Q,K\in\mathbb R^{10\times64}$, $V\in\mathbb R^{10\times64}$, $A\in\mathbb R^{10\times10}$, $Y\in\mathbb R^{10\times64}$. 매개변수는 $W_q,W_k,W_v$가 각각 $512\cdot64=32{,}768$개로 합 $98{,}304$. $QK^T$의 곱셈은 $N^2D_k=100\cdot64=6{,}400$번입니다.
:::

:::ex 예제 6 — 한 질의가 가져오는 것
키가 $\mathbf k_1=(1,0)$, $\mathbf k_2=(0,1)$이고 값이 $v_1=2$, $v_2=6$일 때(스칼라), 질의 $\mathbf q=\sqrt2\,(\ln3,0)$의 출력은? ($D_k=2$)
---
점수 $e_i=\mathbf q\cdot\mathbf k_i/\sqrt2$는 $(\ln3,0)$이므로 $\mathbf a=(\frac34,\frac14)$이고 $y=\frac34\cdot2+\frac14\cdot6=3$. 질의가 키 1과 닮아서 값 1 쪽에 치우친 평균입니다.
:::
` },
      { k: '21.6', src: 'W10 월 · 슬라이드 69–70', title: '위치 부호화와 마스크', body: R`
:::idea 쉽게 말하면
셀프 어텐션은 입력의 순서를 바꿔도 같은 결과를 섞어 줄 뿐이라, 이대로는 “개가 사람을 문다”와 “사람이 개를 문다”를 구별하지 못합니다. 그래서 각 입력에 ‘몇 번째인가’를 알리는 벡터를 더합니다. 또 문장을 쓰는 모델은 아직 쓰지 않은 단어를 볼 수 없으므로, 점수표에서 미래 칸을 $-\infty$로 가려 소프트맥스 뒤에 $0$이 되게 합니다.
:::

**위치 부호화** (슬라이드 69). 입력 벡터 $\mathbf x_j$마다 특별한 위치 부호 $\mathbf p_j$를 붙입니다: $\mathbf p_j=pos(j)$, 곧 위치 $j$를 $d$차원 벡터로 바꾸는 함수 $pos:\mathbb N\to\mathbb R^d$입니다. 두 가지 선택이 있습니다. ① **학습 표**: 위치 $t\in[0,T]$마다 학습하는 벡터를 두는 것($T\times d$개의 매개변수, 훈련 때 못 본 길이는 표현하지 못합니다). ② **고정 함수**: 원하는 성질을 갖게 설계합니다. 슬라이드의 고정 함수는 사인·코사인입니다.

:::key 사인 위치 부호화
$$\mathbf p(t)=\big(\sin\omega_1t,\ \cos\omega_1t,\ \sin\omega_2t,\ \cos\omega_2t,\ \dots,\ \sin\omega_{d/2}t,\ \cos\omega_{d/2}t\big)^T\in\mathbb R^d,\qquad\omega_k=\frac1{10000^{2k/d}}$$
슬라이드 77의 식 $PE_{(pos,2i)}=\sin(pos/10000^{2i/d_{model}})$, $PE_{(pos,2i+1)}=\cos(\cdot)$과 같다(쌍의 번호가 $i=0$부터). 상대 위치 $\Delta$는 회전행렬로 나타난다: $\mathbf p(t+\Delta)=R(\Delta)\,\mathbf p(t)$.
:::

**직관** (슬라이드 69의 이진수 표). $0$부터 $15$까지의 이진수를 쓰면 맨 오른쪽 비트는 매번 뒤집히고, 왼쪽으로 갈수록 두 배씩 천천히 뒤집힙니다. 사인·코사인 쌍은 이 비트를 연속으로 만든 것입니다. 번호 $k$가 클수록 $\omega_k$가 작아(주파수가 낮아) 느리게 변하고, 모든 쌍을 합친 벡터가 위치를 구별합니다. 파장은 $2\pi/\omega_k=2\pi\cdot10000^{2k/d}$로 기하급수로 늘어납니다.

**더하기와 이어 붙이기.** 슬라이드 69는 $\mathbf p_j$를 $\mathbf x_j$에 **이어 붙인다**(concatenate)고 쓰고, 슬라이드 77은 입력 임베딩에 **더하는** ⊕로 그립니다. 두 방식은 사실 같습니다. 다음 선형층이 $[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$이므로, 이어 붙인 뒤의 선형 변환은 ‘위치 부호를 선형으로 바꿔서 더한 것’과 같기 때문입니다.

**마스크 셀프 어텐션** (슬라이드 70). 언어 모델은 앞의 단어만 보고 다음 단어를 예측해야 합니다[[ch20:20.4|교사 강요: 정답 문장 전체를 한꺼번에 넣어 학습.]]. 정답 문장을 통째로 넣어도 미래를 보지 못하도록 **미래의 정렬 점수를 $-\infty$로 직접 정합니다**. 슬라이드의 식은 키 번호 $i$, 질의 번호 $j$로
$$e_{i,j}=\begin{cases}\dfrac{\mathbf q_j\cdot\mathbf k_i}{\sqrt D},&i\le j\\[4pt]-\infty,&i>j\end{cases}$$
이고, $e^{-\infty}=0$이라 소프트맥스 뒤 가중치가 $0$이 됩니다.

:::key 마스크 셀프 어텐션
$$A=\mathrm{softmax}\Big(\frac{QK^T}{\sqrt{D_k}}+M\Big),\qquad M_{ji}=\begin{cases}0,&i\le j\\-\infty,&i>j\end{cases}$$
행 $j$(질의 $j$)는 $i\le j$인 키만 보고, $i>j$의 가중치는 $0$이며 각 행의 합은 $1$이다. 출력 $\mathbf y_j$는 $\mathbf x_1,\dots,\mathbf x_j$에만 의존한다.
:::

:::fig maskmat
:::

:::warn 구현에서의 −∞
실제로는 $-\infty$ 대신 아주 큰 음수(예: $-10^9$)를 더하는 일이 많습니다. 어떤 행이 모두 $-\infty$이면 $0/0$이 되어 값이 정해지지 않는데, 위의 마스크는 대각($i=j$)을 허용해서 이를 피합니다. 첫 질의($j=1$)는 자기 자신만 보므로 그 행은 $(1,0,\dots,0)$입니다.
:::

:::ex 예제 7 — 사인 부호의 한 쌍
$d=4$일 때 $\omega_1,\omega_2$는? 한 쌍 $(\sin\omega t,\cos\omega t)$가 $\omega=\pi/2$이면 $t=0,1,2,3$에서 어떤 값을 도는가?
---
$\omega_1=10000^{-2/4}=\frac1{100}$, $\omega_2=10000^{-4/4}=\frac1{10000}$이고, 둘 다 $k$가 클수록 느립니다. $\omega=\pi/2$이면 $(\sin,\cos)$가 $(0,1),(1,0),(0,-1),(-1,0)$으로 4칸마다 한 바퀴를 돌며, 연속된 $\Delta$칸 이동은 각도 $\omega\Delta$만큼의 회전입니다.
:::

:::ex 예제 8 — 마스크 행렬의 크기
$N=4$인 마스크 셀프 어텐션에서 $A$의 $0$이 아닌 원소는 몇 개이고 각 행의 합은?
---
행 $j$에 $j$개의 원소가 남으므로 $1+2+3+4=\frac{4\cdot5}2=10$개이고 각 행의 합은 $1$입니다. 아래삼각행렬입니다.
:::
` },
      { k: '21.7', src: 'W10 월 · 슬라이드 71–77', title: '멀티헤드 어텐션과 인코더 블록', body: R`
:::idea 쉽게 말하면
한 번의 어텐션은 ‘하나의 기준’으로만 입력을 섞습니다. 문장에서 한 단어는 문법상 짝, 의미상 짝, 바로 옆 단어를 동시에 보고 싶을 수 있습니다. **멀티헤드**는 어텐션을 $h$개 병렬로 돌려 각자 다른 기준(다른 $W_q,W_k,W_v$)으로 섞은 결과를 이어 붙입니다. 이 멀티헤드 어텐션에 잔차 연결, 층 정규화, 위치별 FF를 붙여 한 장의 **블록**으로 만들고 $N$장을 쌓은 것이 트랜스포머 인코더입니다.
:::

**멀티헤드 어텐션** (슬라이드 71). 슬라이드의 그림(Vaswani 외의 논문)은 왼쪽의 스케일 점곱 어텐션(MatMul → Scale → Mask(선택) → SoftMax → MatMul)과, 오른쪽에서 이를 $h$개 쌓은 멀티헤드를 보여 줍니다. 입력 V, K, Q가 각각 헤드마다의 Linear 층을 지나 어텐션을 하고, 헤드의 출력을 Concat해 마지막 Linear에 넣습니다.

:::key 멀티헤드 어텐션
$$\mathrm{head}_a=\mathrm{Attn}(XW_q^a,XW_k^a,XW_v^a),\qquad\mathrm{MHA}(X)=\big[\mathrm{head}_1,\dots,\mathrm{head}_h\big]W_o,\qquad W_o\in\mathbb R^{hD_v\times D}$$
$D_k=D_v=D/h$로 두면 매개변수는 $h\cdot3D\cdot\frac Dh+D^2=4D^2$(편향 없이), 계산량은 헤드 하나가 $N^2D/h$이므로 전체 $O(N^2D)$로 헤드가 하나일 때와 같다.
:::

**인코더 블록** (슬라이드 72–77). 슬라이드는 인코더만 쓰는 트랜스포머를 한 줄씩 쌓아 설명합니다.
- 입력은 토큰화되어 $\mathbf x\in\mathbb R^{n\times d}$입니다(72). 각 토큰은 연속 임베딩으로 부호화됩니다: $\mathbf h_i=\mathrm{FF}(\mathbf x_i)$(73).
- 멀티헤드 어텐션과 스킵 연결로 **맥락 부호화**를 합니다: $\mathbf h_i=\mathrm{LayerNorm}(\mathbf h_i+\mathrm{Attn}(\mathbf h_i,\mathbf h,\mathbf h))$(74). 여기서 $\mathrm{Attn}(\mathbf q,K,V)$는 질의 $\mathbf h_i$가 키와 값 $\mathbf h$ 전체를 보는 셀프 어텐션입니다.
- 스킵 연결이 있는 추가 부호화: $\mathbf h_i=\mathrm{LayerNorm}(\mathbf h_i+\mathrm{FF}(\mathbf h_i))$(75).
- 출력은 다음 블록의 입력으로 되풀이해 쓰입니다. 블록을 $N\times$ 쌓습니다(76).
- 토큰을 부호화할 때 **위치** 임베딩을 더합니다(77): 주기 함수(사인·코사인) 또는 학습.

:::key 인코더 블록
$$\mathbf h_i\leftarrow\mathrm{LayerNorm}\big(\mathbf h_i+\mathrm{MHA}(\mathbf h)_i\big),\qquad\mathbf h_i\leftarrow\mathrm{LayerNorm}\big(\mathbf h_i+\mathrm{FF}(\mathbf h_i)\big)$$
FF는 토큰마다 같은 2층 MLP $\mathrm{FF}(\mathbf h)=W_2\,\mathrm{ReLU}(W_1\mathbf h+\mathbf b_1)+\mathbf b_2$, $W_1\in\mathbb R^{d_{ff}\times d}$. 입력은 $\mathbf x+\mathbf p$, $N$개 블록을 쌓는다. 블록 하나의 매개변수는 $4d^2+2d\,d_{ff}$(편향·정규화 제외), $d_{ff}=4d$이면 $12d^2$.
:::

:::fig encblock
:::

슬라이드에서 $\mathrm{FF}$가 두 곳에 나옵니다. 73의 $\mathrm{FF}(\mathbf x_i)$는 입력을 임베딩하는 층(그림의 Input Embedding)이고, 75의 $\mathrm{FF}(\mathbf h_i)$는 블록 안의 위치별 MLP입니다. 둘은 같은 기호를 쓰지만 다른 층입니다. 블록의 입출력 모양은 $n\times d$로 같아서 $N$장을 그대로 쌓을 수 있고, 잔차 연결이 있어 기울기가 쉽게 흐릅니다[[ch16:16.6|잔차 연결의 기울기.]]. $d_{ff}=4d$는 원논문의 선택이고 슬라이드에는 없습니다[[@med:ch15:12.1c|멀티헤드와 트랜스포머 층.]].

:::ex 예제 9 — 멀티헤드의 매개변수
$D=512$, 헤드 $h=8$, $D_k=D_v=64$일 때 멀티헤드 어텐션의 매개변수는(편향 없이)? 한 블록($d_{ff}=2048$)은?
---
헤드 하나에 $W_q,W_k,W_v$가 각각 $512\cdot64$개이므로 $3\cdot32{,}768=98{,}304$, 헤드 8개로 $786{,}432$, $W_o\in\mathbb R^{512\times512}$가 $262{,}144$로 합 $1{,}048{,}576=4\cdot512^2$. FF는 $2\cdot512\cdot2048=2{,}097{,}152$이므로 블록 하나는 $3{,}145{,}728=12\cdot512^2$입니다.
:::

:::ex 예제 10 — 형상 추적
$n=10$, $d=64$, 헤드 $h=4$인 한 블록에서 각 단계의 모양은?
---
입력 $10\times64$. 헤드마다 $Q,K,V\in\mathbb R^{10\times16}$, $A\in\mathbb R^{10\times10}$(헤드 4개), 헤드 출력 $10\times16$. Concat하면 $10\times64$이고 $W_o$를 곱해도 $10\times64$. 잔차와 LN 뒤 $10\times64$, FF는 $64\to256\to64$, 잔차와 LN 뒤 $10\times64$입니다. 블록을 지나도 모양이 같습니다.
:::
` },
      { k: '21.8', src: 'W10 월 · 슬라이드 78–80', title: '층 정규화와 어텐션의 비용', body: R`
:::idea 쉽게 말하면
배치 정규화는 ‘같은 채널을 가진 샘플들’에서 평균과 분산을 구해 맞춥니다. 그런데 문장은 길이가 제각각이고 배치 크기가 $1$인 추론도 많습니다. **층 정규화**는 한 샘플, 한 토큰의 특성 벡터 안에서 평균과 분산을 구해 맞추므로 배치와 무관합니다. 트랜스포머 블록의 ‘Add & Norm’이 이것입니다.
:::

**BN과 LN** (슬라이드 79). 슬라이드는 $N\times C\times(H,W\text{ 또는 Seq\_len})$ 모양의 상자에서 어느 칸을 묶어 정규화하는지를 그림으로 보여 줍니다. **BN**은 채널 하나를 골라 그 채널의 모든 샘플과 위치($N,H,W$)를 모읍니다. **CNN의 LN**은 샘플 하나의 모든 채널과 위치($C,H,W$)를 모읍니다. **트랜스포머의 LN**은 샘플과 토큰 하나를 골라 그 토큰의 특성 벡터($C$)만 모읍니다[[ch12:12.3|BN은 미니배치에서 평균과 분산을 구한다.]].

:::key 층 정규화
토큰 하나의 특성 $\mathbf h\in\mathbb R^d$에 대해
$$\mu=\frac1d\sum_{j=1}^dh_j,\qquad\sigma^2=\frac1d\sum_{j=1}^d(h_j-\mu)^2,\qquad\mathrm{LN}(\mathbf h)=\boldsymbol\gamma\odot\frac{\mathbf h-\mu\mathbf 1}{\sqrt{\sigma^2+\varepsilon}}+\boldsymbol\beta$$
$\boldsymbol\gamma,\boldsymbol\beta\in\mathbb R^d$는 학습한다. $\varepsilon=0$, $\boldsymbol\gamma=\mathbf 1$, $\boldsymbol\beta=\mathbf 0$이면 출력의 평균은 $0$, 분산은 $1$이고, $a>0$, $b\in\mathbb R$에 대해 $\mathrm{LN}(a\mathbf h+b\mathbf 1)=\mathrm{LN}(\mathbf h)$.
:::

| | BN | LN (트랜스포머) |
|---|---|---|
| 통계를 모으는 축 | 채널마다 $(N,H,W)$ | 토큰마다 $C$ |
| 배치 크기에 | 의존한다 | 의존하지 않는다 |
| 학습과 추론 | 다르다(이동 평균을 씀) | 같다 |
| 가변 길이 문장 | 어색하다 | 자연스럽다 |

BN은 추론 때 학습 중에 모은 이동 평균 통계로 바꿔 써야 하지만[[ch12:12.4|BN 추론 시의 통계.]], LN은 토큰 하나만 있으면 학습 때와 같은 식으로 계산합니다.

:::warn 슬라이드 78은 비어 있다
슬라이드 78 “Linearization of TF”는 제목만 있고 내용이 없습니다. 이 노트는 그 부분을 다루지 않습니다. 아래의 비용 비교는 슬라이드가 아니라 Vaswani 외의 논문에서 가져온 것입니다.
:::

:::ex 예제 11 — 층 정규화 계산
$\mathbf h=(2,4,4,6)$을 $\varepsilon=0$, $\boldsymbol\gamma=\mathbf 1$, $\boldsymbol\beta=\mathbf 0$인 LN에 통과시키면?
---
$\mu=4$, 편차 $(-2,0,0,2)$, $\sigma^2=\frac{4+0+0+4}4=2$이므로 $\mathrm{LN}(\mathbf h)=\frac1{\sqrt2}(-2,0,0,2)=(-\sqrt2,0,0,\sqrt2)$. 평균 $0$이고 분산 $\frac{2+0+0+2}4=1$입니다.
:::

### 더 깊이

**한 층의 비용 비교**(논문의 표, 슬라이드 밖). 길이 $N$, 차원 $d$일 때

| 층 | 층당 계산량 | 순차 연산 | 두 토큰 사이 최대 경로 |
|---|---|---|---|
| 셀프 어텐션 | $O(N^2d)$ | $O(1)$ | $O(1)$ |
| 순환(RNN) | $O(Nd^2)$ | $O(N)$ | $O(N)$ |

어텐션은 $N$이 $d$보다 크면 비싸지만, 모든 토큰 쌍이 한 걸음에 연결되고 한 층의 계산이 병렬로 됩니다. RNN은 거리가 먼 두 토큰의 정보가 $N$걸음을 지나야 하고 그동안 기울기가 곱해져 사라지기 쉽습니다[[ch19:19.6|기울기 소실.]]. 순서가 필요하면 위치 부호화(21.6절)를 더합니다.
` },
    ],
    problems: [
      { sec: '21.1', type: 'mc', lv: 1, q: R`슬라이드 40의 ‘실용적인 문제’로 옳은 것은?`,
        choices: [R`이미지 특성이 너무 작아서 LSTM에 들어가지 않는다`, R`RNN이 강하면 이미지를 쓰지 않고 앞 단어만으로 문장을 만들 수 있고, 앞 단어의 영향이 더 직접적이다`, R`교차 엔트로피의 기울기가 $0$이 된다`, R`추론 때 문장이 끝나지 않는다`], ans: 1,
        sol: R`슬라이드 40: 앞 단어가 다음 단어에 더 직접적인 영향(짧은 의존 거리)을 주므로 이미지 조건화가 약해집니다. 그래서 이미지에 대한 조건화를 강화해야 합니다.` },
      { sec: '21.1', type: 'num', lv: 1, q: R`$2048$차원 이미지 특성을 $512$차원 LSTM 입력에 맞추는 Linear 층(편향 포함)의 매개변수 수는?`, ans: '1049088', ansTex: R`2048\cdot512+512=1049088`,
        sol: R`$2048\cdot512=1{,}048{,}576$개의 가중치와 $512$개의 편향으로 $1{,}049{,}088$개입니다.` },
      { sec: '21.1', type: 'open', lv: 3, proof: true, q: R`바닐라 RNN $\mathbf h_t=\tanh(W_h\mathbf h_{t-1}+W_x\mathbf y_t+\mathbf b)$를 디코더로 쓰는 캡셔닝에서, 이미지 특성 $\mathbf v$를 (가) 첫 입력으로만 넣는 경우($\mathbf h_0=\tanh(W_v\mathbf v+\mathbf b)$)와 (나) 매 걸음의 입력에 $W_z\mathbf v$로 더하는 지름길 경우를 비교한다. (1) (가)에서 $\lVert\partial\mathbf h_t/\partial\mathbf v\rVert\le\lVert W_h\rVert^t\lVert W_v\rVert$임을 보이시오. (2) (나)에서 $\partial\mathbf h_t/\partial\mathbf v$에 크기가 $\lVert W_z\rVert$ 이하인 길이 $1$의 직접 항이 있음을 보이시오. (3) 슬라이드 41의 ‘의존 거리 $1$’이 이것임을 설명하시오.`,
        sol: R`$D_s=\diag(1-\mathbf h_s^2)$로 두면 $\lVert D_s\rVert\le1$이고 $\partial\mathbf h_s/\partial\mathbf h_{s-1}=D_sW_h$입니다.
**(1)** (가)에서 $\mathbf v$는 $\mathbf h_0$를 통해서만 들어가고 $\partial\mathbf h_0/\partial\mathbf v=D_0W_v$. 연쇄법칙으로 $\frac{\partial\mathbf h_t}{\partial\mathbf v}=D_tW_h\cdots D_1W_h\,D_0W_v$이고 노름의 곱 부등식으로 $\le\lVert W_h\rVert^t\lVert W_v\rVert$입니다. $\lVert W_h\rVert<1$이면 $t$가 커질수록 지수적으로 줄어 이미지의 영향이 사라집니다.
**(2)** (나)에서 $\mathbf h_t=\tanh(W_h\mathbf h_{t-1}+W_x\mathbf y_t+W_z\mathbf v+\mathbf b)$이므로 $\mathbf v$는 모든 걸음에서 직접 들어가고, 걸음 $t$의 직접 항은 $\partial\mathbf h_t/\partial\mathbf v\supset D_tW_z$로 노름이 $\le\lVert W_z\rVert$이며 $t$에 의존하지 않습니다. 총 미분은 이 항에 (가)와 같은 먼 경로들을 더한 것입니다.
**(3)** 이미지에서 걸음 $t$의 출력까지 야코비안 곱이 하나뿐인 경로, 곧 의존 거리 $1$이 있어서 기울기가 시간이 지나도 사라지지 않습니다. 다만 학습된 $W_z$가 작으면 모델이 이미지를 무시할 수 있다는 것이 슬라이드의 단점입니다.`,
        rubric: R`- 야코비안 $D_sW_h$와 $\lVert D_s\rVert\le1$ — 2점
- (1) 연쇄법칙과 노름 부등식으로 $\lVert W_h\rVert^t\lVert W_v\rVert$ — 3점
- (2) 직접 항 $D_tW_z$와 $t$에 무관한 상계 — 3점
- (3) 의존 거리 $1$의 해석과 한계 — 2점` },
      { sec: '21.2', type: 'mc', lv: 1, q: R`conv5 특성 $\mathbf x\in\mathbb R^{14\times14\times512}$에 소프트 어텐션 $\alpha\in\mathbb R^{14\times14}$을 적용한 요약 $\mathbf z=\sum_{i,j}\alpha_{i,j}\mathbf x_{i,j}$의 모양은?`,
        choices: [R`$14\times14$`, R`$196$차원 벡터`, R`$512$차원 벡터`, R`$14\times14\times512$`], ans: 2,
        sol: R`위치 $196$곳의 $512$차원 벡터를 가중 평균하므로 $\mathbf z\in\mathbb R^{C}=\mathbb R^{512}$입니다. 위치 차원이 합쳐져 사라집니다.` },
      { sec: '21.2', type: 'num', lv: 2, q: R`세 칸의 특성이 $\mathbf x_1=(1,0)$, $\mathbf x_2=(0,1)$, $\mathbf x_3=(1,1)$이고 점수가 $e=(0,\ln3,0)$일 때 소프트 어텐션 요약 $\mathbf z$의 두 성분의 합은?`, ans: '6/5', ansTex: R`\tfrac25+\tfrac45=\tfrac65`,
        sol: R`$\alpha=(\frac15,\frac35,\frac15)$, $\mathbf z=(\frac25,\frac45)$이므로 합은 $\frac65$.` },
      { sec: '21.2', type: 'mc', lv: 2, q: R`소프트 어텐션과 하드 어텐션의 비교로 옳은 것은?`,
        choices: [R`소프트는 가중 평균이라 평범한 역전파로 학습되고, 하드는 칸을 뽑는 연산 때문에 다른 학습 기법이 필요하다`, R`소프트는 한 칸만 고르고 하드는 모든 칸을 평균한다`, R`하드 어텐션의 가중치는 합이 $1$이 아니다`, R`둘의 요약 벡터는 늘 같다`], ans: 0,
        sol: R`소프트: $\mathbf z=\sum\alpha\mathbf x$로 미분 가능. 하드: $s\sim\alpha$로 한 칸을 뽑아 $\mathbf z=\mathbf x_s$, 뽑기는 미분되지 않습니다. 소프트는 하드의 기댓값입니다.` },
      { sec: '21.2', type: 'open', lv: 3, proof: true, q: R`소프트 어텐션 $\mathbf z=\sum_{i}\alpha_i\mathbf x_i$, $\alpha=\mathrm{softmax}(e)$ (위치를 한 줄로 나열)에서 (1) $\alpha_i>0$, $\sum\alpha_i=1$이므로 $\lVert\mathbf z\rVert\le\max_i\lVert\mathbf x_i\rVert$임을 보이시오. (2) $s\sim\mathrm{Categorical}(\alpha)$로 뽑은 하드 어텐션의 $\mathbb E[\mathbf x_s]=\mathbf z$임을 보이시오. (3) $\dfrac{\partial\alpha_i}{\partial e_m}=\alpha_i(\delta_{im}-\alpha_m)$를 이용해 $\dfrac{\partial\mathbf z}{\partial e_m}=\alpha_m(\mathbf x_m-\mathbf z)$임을 보이고 뜻을 설명하시오.`,
        sol: R`**(1)** 삼각 부등식과 $\alpha_i>0$: $\lVert\mathbf z\rVert\le\sum_i\alpha_i\lVert\mathbf x_i\rVert\le\max_i\lVert\mathbf x_i\rVert\sum_i\alpha_i=\max_i\lVert\mathbf x_i\rVert$. $\mathbf z$는 $\mathbf x_i$들의 볼록 결합입니다.
**(2)** $P(s=i)=\alpha_i$이므로 $\mathbb E[\mathbf x_s]=\sum_iP(s=i)\mathbf x_i=\sum_i\alpha_i\mathbf x_i=\mathbf z$.
**(3)** 소프트맥스 미분: $\alpha_i=e^{e_i}/\sum_je^{e_j}$에서 $\partial\alpha_i/\partial e_m=\alpha_i\delta_{im}-\alpha_i\alpha_m$. 따라서 $\frac{\partial\mathbf z}{\partial e_m}=\sum_i\frac{\partial\alpha_i}{\partial e_m}\mathbf x_i=\alpha_m\mathbf x_m-\alpha_m\sum_i\alpha_i\mathbf x_i=\alpha_m(\mathbf x_m-\mathbf z)$.
뜻: 점수 $e_m$을 올리면 $\mathbf z$가 $\mathbf x_m$ 쪽(현재 평균에서 $\mathbf x_m$으로 향하는 방향)으로 움직이고, 그 크기는 현재의 가중치 $\alpha_m$에 비례합니다. $\alpha_m\approx0$인 칸은 점수가 바뀌어도 거의 반응하지 않습니다.`,
        rubric: R`- (1) 삼각 부등식과 볼록 결합 — 2점
- (2) 기댓값 계산 — 2점
- (3) 소프트맥스의 야코비안 항과 정리 — 4점
- (3) 해석 — 2점` },
      { sec: '21.3', type: 'mc', lv: 1, q: R`슬라이드 54의 메모에 따르면 채널 어텐션(SENet)의 가중치는?`,
        choices: [R`소프트맥스로 만들어 합이 반드시 $1$이다`, R`위치마다 하나씩이다`, R`학습되지 않는다`, R`합이 $1$이 아니어도 된다(채널마다 독립인 시그모이드 값)`], ans: 3,
        sol: R`“여기서는 attention 합이 1이 아니어도 된다”. 채널마다 $\sigma$로 $(0,1)$의 가중치를 만들어 특성 지도를 재가중하는 것이므로 합을 $1$로 맞출 필요가 없습니다.` },
      { sec: '21.3', type: 'num', lv: 2, q: R`$C=256$, 축소 비 $r=16$인 스퀴즈-익사이트 블록의 매개변수 수(편향 없이)는?`, ans: '8192', ansTex: R`2\cdot256^2/16=8192`,
        sol: R`$W_1\in\mathbb R^{16\times256}$이 $4096$개, $W_2\in\mathbb R^{256\times16}$이 $4096$개로 합 $8192=2C^2/r$.` },
      { sec: '21.3', type: 'mc', lv: 1, q: R`귀납 편향에 대한 설명으로 옳은 것은?`,
        choices: [R`CNN은 자료의 1차원 사슬 구조를, RNN은 2차원 격자와 이동 불변성을 가정한다`, R`CNN은 2차원 격자 구조와 이동 불변성을, RNN은 1차원 사슬 구조를 이용한다`, R`귀납 편향은 학습 데이터에 포함된 잡음이다`, R`귀납 편향이 클수록 모든 자료 형태에 잘 일반화된다`], ans: 1,
        sol: R`슬라이드 60: Convolution은 2D 격자 구조와 이동 불변성을, RNN은 1D 사슬 구조를 이용합니다. 이런 가정은 효율적인 모델에 유용하지만 다른 자료 형태에는 일반화되지 않습니다.` },
      { sec: '21.3', type: 'open', lv: 2, q: R`귀납 편향을 정의하고, CNN과 RNN이 각각 어떤 가정을 하는지 쓰시오. 그 가정이 한 모델을 여러 자료(이미지, 점군, 소리, 언어)에 쓰는 데 왜 걸림돌인지, 그리고 어텐션이 어떤 점에서 이 요구에 맞는지 설명하시오.`,
        sol: R`**정의**: 학습자가 보지 못한 입력에 대한 출력을 예측하는 데 쓰는 가정들의 집합입니다. **CNN**은 2차원 격자 구조와 이동 불변성(국소성)을, **RNN**은 1차원 사슬 구조를 가정합니다.
이 가정은 해당 자료에서는 매개변수를 줄이고 효율적인 모델을 주지만, 점군이나 그래프처럼 격자·사슬이 아닌 자료에는 맞지 않아 다른 자료 형태에 일반화되지 않습니다(슬라이드 60). 그래서 자료마다 다른 모델을 씁니다.
어텐션은 입력을 위치와 형태를 가정하지 않는 **벡터의 모음**으로만 보고 점수로 서로를 섞으므로(순열 불변·등변), 어떤 자료든 토큰으로 바꿔 넣을 수 있습니다. 필요한 구조(순서 등)는 위치 부호화로 필요할 때만 알려 줍니다.`,
        rubric: R`- 귀납 편향의 정의 — 1점
- CNN과 RNN의 가정 — 1점
- 일반화 문제 — 1점
- 어텐션이 맞는 이유(벡터의 모음, 위치는 선택) — 1점` },
      { sec: '21.4', type: 'mc', lv: 2, q: R`슬라이드 64의 일반 어텐션 층(질의 $\mathbf h\in\mathbb R^D$, 입력 $\mathbf x\in\mathbb R^{N\times D}$)에서 출력 $\mathbf c=\sum_ia_i\mathbf x_i$에 대해 옳은 것은?`,
        choices: [R`$\mathbf c\in\mathbb R^N$이고 입력 순서에 민감하다`, R`$\mathbf c\in\mathbb R^{N\times D}$이다`, R`$\mathbf c$는 $\mathbf x_1$에만 의존한다`, R`$\mathbf c\in\mathbb R^D$이고 입력의 순서를 바꿔도 변하지 않는다(순열 불변)`], ans: 3,
        sol: R`$\mathbf c$는 $D$차원 벡터(맥락 벡터)입니다. 순서를 바꾸면 $\sum_i a_i\mathbf x_i$의 항이 쌍 $(a_i,\mathbf x_i)$ 단위로 이동할 뿐이라 합이 같습니다.` },
      { sec: '21.4', type: 'num', lv: 1, q: R`성분이 독립이고 평균 $0$, 분산 $1$인 $\mathbf q,\mathbf k\in\mathbb R^{256}$에서 $\mathrm{Var}(\mathbf q\cdot\mathbf k)$는?`, ans: '256', ansTex: R`D=256`,
        sol: R`$\mathrm{Var}(\mathbf q\cdot\mathbf k)=D=256$. $\sqrt D=16$으로 나누면 분산이 $1$이 됩니다.` },
      { sec: '21.4', type: 'num', lv: 2, q: R`$D=64$에서 두 키의 점수 차가 $\sqrt D$로 나누기 전에 $8$이었다. 나눈 뒤 점수가 큰 쪽 키의 소프트맥스 가중치는? (식으로 입력해도 됩니다)`, ans: '1/(1+e^(-1))', ansTex: R`\frac1{1+e^{-1}}\approx0.731`,
        sol: R`나눈 뒤 점수 차는 $8/\sqrt{64}=1$. 두 키의 소프트맥스에서 큰 쪽은 $\frac{e^{1}}{e^1+1}=\frac1{1+e^{-1}}\approx0.731$입니다(나누기 전에는 $\frac1{1+e^{-8}}\approx0.9997$).` },
      { sec: '21.4', type: 'open', lv: 3, proof: true, quiz: true, q: R`(1) $\mathbf q,\mathbf k\in\mathbb R^D$의 성분 $q_l,k_l$이 모두 독립이고 평균 $0$, 분산 $1$일 때 $\mathbb E[\mathbf q\cdot\mathbf k]=0$, $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$임을 보이고, $\mathbf q\cdot\mathbf k/\sqrt D$의 분산을 구하시오. (2) 소프트맥스 $\mathbf a=\mathrm{softmax}(\mathbf e)$의 야코비안이 $\partial a_i/\partial e_m=a_i(\delta_{im}-a_m)$임을 보이고, $\max_ia_i\ge1-\varepsilon$이면 야코비안의 모든 성분의 절댓값이 $\varepsilon$ 이하임을 보이시오. (3) 이를 이용해 $\sqrt D$로 나누는 이유를 설명하시오.`,
        sol: R`**(1)** $\mathbb E[q_lk_l]=\mathbb E[q_l]\mathbb E[k_l]=0$이므로 $\mathbb E[\mathbf q\cdot\mathbf k]=0$. $q_lk_l$의 분산은 $\mathbb E[q_l^2k_l^2]-0=\mathbb E[q_l^2]\mathbb E[k_l^2]=1$. 서로 다른 $l$의 항은 독립이므로 분산이 더해져 $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$. 상수 $1/\sqrt D$를 곱하면 분산이 $1/D$배가 되어 $\mathrm{Var}(\mathbf q\cdot\mathbf k/\sqrt D)=1$.
**(2)** $a_i=e^{e_i}/Z$, $Z=\sum_je^{e_j}$에서 $\partial a_i/\partial e_m=\delta_{im}a_i-e^{e_i}e^{e_m}/Z^2=a_i(\delta_{im}-a_m)$. $a_{i^*}\ge1-\varepsilon$인 $i^*$를 잡으면 나머지의 합은 $\le\varepsilon$입니다. 대각 성분 $a_i(1-a_i)$는 $i=i^*$일 때 $\le1-a_{i^*}\le\varepsilon$, $i\ne i^*$일 때 $\le a_i\le\varepsilon$. 비대각 성분 $a_ia_m$ ($i\ne m$)은 둘 중 하나가 $i^*$가 아니므로 $\le a_{\text{그 하나}}\le\varepsilon$입니다.
**(3)** 점곱의 분산이 $D$이면 로짓의 표준편차가 $\sqrt D$로 자라 점수 차가 커지고, 소프트맥스가 포화해 $\max a_i\to1$이면 (2)에 의해 기울기가 모두 $0$에 가까워 학습이 멈춥니다. $\sqrt D$로 나누면 분산이 $D$와 무관한 $1$이라 포화를 피합니다.`,
        rubric: R`- (1) 기댓값 $0$과 곱의 분산 $1$, 독립 합으로 $D$ — 3점
- (1) 스케일 뒤 분산 $1$ — 1점
- (2) 소프트맥스 야코비안 — 2점
- (2) 포화일 때 모든 성분이 $\varepsilon$ 이하 — 3점
- (3) 결론 — 1점` },
      { sec: '21.5', type: 'mc', lv: 2, q: R`교차 어텐션과 셀프 어텐션의 차이는?`,
        choices: [R`질의가 교차에서는 다른 입력(예: 디코더)에서, 셀프에서는 같은 입력에서 온다`, R`교차 어텐션에는 소프트맥스가 없다`, R`셀프 어텐션은 키와 값을 만들지 않는다`, R`교차 어텐션의 출력 길이는 늘 $N$이다`], ans: 0,
        sol: R`슬라이드 67: 질의 $\mathbf q$(모양 $M\times D_k$)가 밖에서 오고 출력은 질의 수 $M$개의 $D_v$차원 벡터입니다. 슬라이드 68의 셀프 어텐션은 $\mathbf q=\mathbf xW_q$로 질의도 같은 입력에서 만들어 $M=N$입니다.` },
      { sec: '21.5', type: 'num', lv: 2, q: R`$D=512$, $D_k=D_v=64$인 셀프 어텐션 한 헤드의 매개변수 수(편향 없이)는?`, ans: '98304', ansTex: R`3\cdot512\cdot64=98304`,
        sol: R`$W_q,W_k,W_v$가 각각 $512\cdot64=32{,}768$개이므로 $D(2D_k+D_v)=512\cdot192=98{,}304$.` },
      { sec: '21.5', type: 'open', lv: 3, proof: true, quiz: true, q: R`셀프 어텐션 $\mathrm{Attn}(X)=\mathrm{softmax}\big(XW_q(XW_k)^T/\sqrt{D_k}\big)XW_v$($\mathrm{softmax}$는 행마다)가 임의의 순열행렬 $P$에 대해 $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$를 만족함을 증명하시오. 이어서 교차 어텐션에서 키·값 입력의 행들을 같은 순열로 섞으면 출력이 변하지 않음도 보이시오.`,
        sol: R`$P^TP=I$, $Q=XW_q$, $K=XW_k$, $V=XW_v$로 두면 $PX$에서는 $Q'=PQ$, $K'=PK$, $V'=PV$입니다.
**점수.** $E'=Q'K'^T/\sqrt{D_k}=PQK^TP^T/\sqrt{D_k}=PEP^T$.
**소프트맥스.** 행마다의 소프트맥스 $\sigma$는 각 행의 성분을 순열해도 그대로 순열되므로 $\sigma(EP^T)=\sigma(E)P^T$이고, 행들의 순서를 바꾸는 $P$는 행 단위 연산과 교환되어 $\sigma(PE')=P\sigma(E')$입니다. 따라서 $A'=\sigma(PEP^T)=P\,\sigma(E)\,P^T=PAP^T$.
**출력.** $Y'=A'V'=PAP^T\,PV=PA(P^TP)V=PAV=PY$. ∎
**교차 어텐션.** 질의 $Q$는 고정하고 키·값 행들을 $K'=PK$, $V'=PV$로 섞으면 $E'=QK^TP^T/\sqrt{D_k}=EP^T$, $A'=AP^T$, $Y'=AP^TPV=AV=Y$. 곧 키·값 쌍의 순서에는 불변이고(21.4절의 순열 불변), 질의의 순서에는 등변입니다.`,
        rubric: R`- $Q',K',V'$와 점수 $PEP^T$ — 3점
- 소프트맥스가 순열과 교환됨 — 3점
- $P^TP=I$로 출력 $PY$ — 2점
- 교차 어텐션의 불변 — 2점` },
      { sec: '21.5', type: 'open', lv: 2, proof: true, q: R`$X\in\mathbb R^{N\times D}$, $D_k=D_v=d$인 셀프 어텐션 한 층의 곱셈 횟수를 $Q,K,V$ 투영, $QK^T$, $AV$ 각각에 대해 구하고, 전체가 $O(N^2d+NDd)$이며 어텐션 행렬의 메모리가 $N^2$임을 보이시오. $D=d$이고 $N\gg d$, $N\ll d$일 때 각각 어느 항이 지배하는가?`,
        sol: R`투영 $XW_q,XW_k,XW_v$: 각 $N\times D$와 $D\times d$의 곱이므로 $3NDd$번. $QK^T$: $N\times d$와 $d\times N$이므로 $N^2d$번. 소프트맥스: $N^2$개 원소에 대한 상수 연산이라 $O(N^2)$. $AV$: $N\times N$과 $N\times d$이므로 $N^2d$번. 합은 $3NDd+2N^2d+O(N^2)=O(N^2d+NDd)$입니다. $A$는 $N\times N$이라 $N^2$개의 값을 저장합니다.
$D=d$이면 $O(N^2d+Nd^2)$이고, $N\gg d$이면 $N^2d$(어텐션 행렬)가 지배해 길이에 이차로 비싸지고, $N\ll d$이면 $Nd^2$(투영)가 지배합니다.`,
        rubric: R`- 투영 $3NDd$ — 2점
- $QK^T$와 $AV$ 각각 $N^2d$ — 3점
- 합과 메모리 $N^2$ — 2점
- 두 영역의 지배항 — 1점` },
      { sec: '21.6', type: 'mc', lv: 1, q: R`셀프 어텐션에 위치 부호화가 필요한 이유는?`,
        choices: [R`소프트맥스가 순서를 지우기 때문이다`, R`키의 차원이 작아서이다`, R`층이 순열 등변이어서 입력의 순서 정보를 스스로 알 수 없기 때문이다`, R`학습률을 줄이기 위해서이다`], ans: 2,
        sol: R`$\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$이므로 순서를 바꿔도 같은 값을 순서대로 낼 뿐이라 순서를 알 수 없습니다. 위치 부호 $\mathbf p_j$를 입력에 더하거나 이어 붙여 순서를 알립니다.` },
      { sec: '21.6', type: 'num', lv: 1, q: R`사인 위치 부호화 $\omega_k=1/10000^{2k/d}$에서 $d=4$일 때 $\omega_1$은?`, ans: '1/100', ansTex: R`10000^{-1/2}=\frac1{100}`,
        sol: R`$2k/d=2/4=\frac12$이므로 $\omega_1=10000^{-1/2}=\frac1{100}$.` },
      { sec: '21.6', type: 'open', lv: 3, proof: true, quiz: true, q: R`사인 위치 부호화 $\mathbf p(t)=(\sin\omega_kt,\cos\omega_kt)_{k=1}^{d/2}$에 대해 (1) 임의의 $\Delta$에 대해 $\mathbf p(t+\Delta)=R(\Delta)\mathbf p(t)$인 행렬 $R(\Delta)$($t$에 무관)를 구하고 직교행렬임을 보이시오. (2) $\mathbf p(t)\cdot\mathbf p(t+\Delta)=\sum_k\cos(\omega_k\Delta)$로 $\Delta$에만 의존함을 보이시오. (3) $[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$로 슬라이드 69(이어 붙이기)와 77(더하기)의 관계를 설명하시오.`,
        sol: R`**(1)** 덧셈 공식으로 $\sin\omega(t+\Delta)=\sin\omega t\cos\omega\Delta+\cos\omega t\sin\omega\Delta$, $\cos\omega(t+\Delta)=-\sin\omega t\sin\omega\Delta+\cos\omega t\cos\omega\Delta$. 쌍 $(\sin\omega t,\cos\omega t)^T$에 대해
$$\begin{pmatrix}\sin\omega(t+\Delta)\\\cos\omega(t+\Delta)\end{pmatrix}=\begin{pmatrix}\cos\omega\Delta&\sin\omega\Delta\\-\sin\omega\Delta&\cos\omega\Delta\end{pmatrix}\begin{pmatrix}\sin\omega t\\\cos\omega t\end{pmatrix}.$$
$R(\Delta)$는 이 $2\times2$ 회전을 $k=1,\dots,d/2$에 대해 각도 $\omega_k\Delta$로 블록 대각에 놓은 행렬이며 $t$가 없습니다. 각 블록이 회전이라 $R^TR=I$, 직교입니다.
**(2)** 쌍마다 $\sin\omega t\sin\omega(t+\Delta)+\cos\omega t\cos\omega(t+\Delta)=\cos(\omega\Delta)$(코사인의 차 공식). 모든 쌍을 합해 $\sum_k\cos(\omega_k\Delta)$로 $t$를 쓰지 않습니다.
**(3)** $[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$($W$를 위아래 두 블록 $W_1,W_2$로 나눔). 이어 붙인 뒤의 선형 변환은 ‘$\mathbf p$를 $W_2$로 선형 변환해 $\mathbf xW_1$에 더한 것’과 같습니다. 그래서 이어 붙이기와 더하기는 표현력이 같습니다(더하면 입력 차원이 늘지 않을 뿐).
결론: 상대 위치 $\Delta$의 효과가 $t$에 무관한 선형 사상이어서 모델이 상대 거리를 배우기 쉽고, 위치 간 내적이 거리만의 함수입니다.`,
        rubric: R`- (1) 덧셈 공식과 $R(\Delta)$ — 3점
- (1) 직교성 — 1점
- (2) 쌍별 내적의 코사인 — 3점
- (3) 이어 붙이기 = 더하기 — 2점
- 해석 — 1점` },
      { sec: '21.6', type: 'open', lv: 3, proof: true, quiz: true, q: R`마스크 셀프 어텐션 $A=\mathrm{softmax}(S+M)$ ($S=QK^T/\sqrt{D_k}$, $M_{ji}=0$ ($i\le j$), $-\infty$ ($i>j$), 행마다 소프트맥스)에 대해 (1) $i>j$이면 $A_{ji}=0$이고 (2) 각 행의 합이 $1$이며 (3) 출력 $\mathbf y_j=\sum_iA_{ji}\mathbf v_i$가 $\mathbf x_1,\dots,\mathbf x_j$에만 의존함을 보이시오. 이것이 언어 모델의 병렬 학습에 왜 필요한지 설명하시오.`,
        sol: R`행 $j$의 소프트맥스는 $A_{ji}=\dfrac{\exp(S_{ji}+M_{ji})}{\sum_{l}\exp(S_{jl}+M_{jl})}$.
**(1)** $i>j$이면 $M_{ji}=-\infty$이고 $e^{-\infty}=0$이므로 분자가 $0$, 곧 $A_{ji}=0$.
**(2)** 분모는 $i\le j$인 항만 남아 $Z_j=\sum_{l\le j}e^{S_{jl}}$입니다. $l=j$인 항이 유한하고 양수라 $0<Z_j<\infty$이므로 분모가 잘 정의되고, $\sum_iA_{ji}=\sum_{i\le j}e^{S_{ji}}/Z_j=1$.
**(3)** (1)에 의해 $\mathbf y_j=\sum_{i\le j}A_{ji}\mathbf v_i$이고 $A_{ji}$ ($i\le j$)는 $S_{ji}=\mathbf q_j\cdot\mathbf k_i/\sqrt{D_k}$ ($i\le j$)로만 정해집니다. $\mathbf q_j,\mathbf k_i,\mathbf v_i$는 각각 $\mathbf x_j,\mathbf x_i,\mathbf x_i$의 함수이므로 $\mathbf y_j$는 $\mathbf x_1,\dots,\mathbf x_j$만의 함수입니다. 미래 $\mathbf x_m$ ($m>j$)를 바꿔도 $\mathbf y_j$는 변하지 않습니다.
필요성: 정답 문장 전체를 한꺼번에 넣고 모든 칸의 다음 단어 예측 손실을 동시에 계산하려면(교사 강요), 칸 $j$의 출력이 정답의 미래를 보면 안 됩니다. 마스크가 이를 보장해 $T$개의 칸을 병렬로 학습할 수 있습니다.`,
        rubric: R`- (1) $e^{-\infty}=0$ — 2점
- (2) 분모의 유한성(대각 허용)과 합 $1$ — 3점
- (3) $\mathbf y_j$의 의존 범위 — 3점
- 병렬 학습의 필요성 — 2점` },
      { sec: '21.7', type: 'num', lv: 2, q: R`$D=512$, 헤드 $h=8$, $D_k=D_v=64$인 멀티헤드 어텐션의 매개변수 수(편향 없이, $W_o$ 포함)는?`, ans: '1048576', ansTex: R`4\cdot512^2=1048576`,
        sol: R`헤드마다 $3\cdot512\cdot64=98{,}304$, 8개로 $786{,}432$. $W_o\in\mathbb R^{512\times512}$는 $262{,}144$. 합 $1{,}048{,}576=4D^2$.` },
      { sec: '21.7', type: 'open', lv: 3, proof: true, q: R`멀티헤드 어텐션에서 $D_k=D_v=D/h$로 둘 때 (1) 매개변수가 $4D^2$(편향 없이)임을 보이고, (2) 계산량이 헤드 수 $h$와 무관하게 $O(N^2D)$임을, (3) 어텐션 행렬의 총 크기는 $hN^2$로 헤드 수에 비례함을 보이시오. 헤드가 하나인($h=1$, $D_k=D_v=D$) 경우와 비교해 멀티헤드가 얻는 것은 무엇인가?`,
        sol: R`**(1)** 헤드 하나는 $W_q^a,W_k^a\in\mathbb R^{D\times D/h}$, $W_v^a\in\mathbb R^{D\times D/h}$로 $3D\cdot D/h$개이고, $h$개를 합하면 $3D^2$. 출력 사영 $W_o\in\mathbb R^{hD_v\times D}=\mathbb R^{D\times D}$가 $D^2$. 합 $4D^2$.
**(2)** 헤드 하나의 $QK^T$와 $AV$는 각각 $N^2\cdot D/h$번이라 $2N^2D/h$. $h$개를 합하면 $2N^2D$로 $h$와 무관합니다(투영은 $3ND^2$, $W_o$는 $ND^2$로 역시 $h$와 무관).
**(3)** 헤드마다 $N\times N$ 행렬이 하나씩이라 $hN^2$.
**비교**: $h=1$일 때도 매개변수 $4D^2$, 계산량 $O(N^2D)$로 같지만 어텐션 패턴이 하나뿐입니다. 멀티헤드는 같은 비용으로 서로 다른 $h$개의 소프트맥스 패턴(서로 다른 부분공간에서의 유사도)을 동시에 배웁니다.`,
        rubric: R`- (1) 헤드당 $3D^2/h$와 $W_o$ — 3점
- (2) 헤드당 $2N^2D/h$와 합 — 3점
- (3) 행렬 크기 $hN^2$ — 1점
- 비교의 해석 — 1점` },
      { sec: '21.7', type: 'num', lv: 2, q: R`$d=512$, $d_{ff}=2048$인 인코더 블록 하나의 매개변수 수(편향과 LayerNorm 제외)는?`, ans: '3145728', ansTex: R`4\cdot512^2+2\cdot512\cdot2048=3145728`,
        sol: R`멀티헤드 어텐션 $4d^2=1{,}048{,}576$, FF $2d\,d_{ff}=2{,}097{,}152$. 합 $3{,}145{,}728=12d^2$.` },
      { sec: '21.7', type: 'mc', lv: 1, q: R`슬라이드 74–75의 인코더 블록에서 한 블록이 하는 계산의 순서는?`,
        choices: [R`FF $\to$ LayerNorm $\to$ 어텐션 $\to$ LayerNorm`, R`LayerNorm만 두 번`, R`어텐션 + 잔차 $\to$ LayerNorm $\to$ FF + 잔차 $\to$ LayerNorm`, R`어텐션만 한 번`], ans: 2,
        sol: R`$\mathbf h\leftarrow\mathrm{LayerNorm}(\mathbf h+\mathrm{Attn}(\mathbf h,\mathbf h,\mathbf h))$ 다음 $\mathbf h\leftarrow\mathrm{LayerNorm}(\mathbf h+\mathrm{FF}(\mathbf h))$. 각 하위 층마다 스킵 연결을 더한 뒤 정규화합니다.` },
      { sec: '21.7', type: 'open', lv: 2, q: R`$n=10$, $d=64$, 헤드 $h=4$, $d_{ff}=256$인 인코더 블록 하나에서 입력부터 출력까지 각 단계의 텐서 모양을 쓰고, 블록의 매개변수(편향·LN 제외)를 세시오.`,
        sol: R`입력 $10\times64$. 헤드마다 $Q,K,V\in\mathbb R^{10\times16}$, $A\in\mathbb R^{10\times10}$, 헤드 출력 $10\times16$. Concat $10\times64$, $W_o$ 뒤 $10\times64$. 잔차와 LN 뒤 $10\times64$. FF: $10\times64\to10\times256\to10\times64$. 잔차와 LN 뒤 $10\times64$(블록의 출력, 입력과 같은 모양).
매개변수: 어텐션 $4d^2=4\cdot4096=16{,}384$, FF $2\cdot64\cdot256=32{,}768$. 합 $49{,}152=12d^2$.`,
        rubric: R`- 헤드별 $Q,K,V,A$의 모양 — 2점
- Concat과 $W_o$, FF의 모양 — 1점
- 매개변수 $16{,}384+32{,}768$ — 1점` },
      { sec: '21.7', type: 'open', lv: 3, proof: true, q: R`위치 부호화가 없는 인코더 블록 $T(X)$(멀티헤드 셀프 어텐션 + 잔차 + LN, 토큰별 FF + 잔차 + LN)가 순열 등변, 곧 $T(PX)=P\,T(X)$임을 보이고, $N$개를 쌓은 인코더도 등변임을 설명하시오. 이것이 위치 부호화가 필요한 이유임을 한 문장으로 쓰시오.`,
        sol: R`**어텐션 부분.** 멀티헤드는 헤드마다 셀프 어텐션이 등변이고($\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$), Concat과 $W_o$는 행마다 같은 선형 변환이라 행의 순열과 교환됩니다. 곧 $\mathrm{MHA}(PX)=P\,\mathrm{MHA}(X)$.
**잔차와 LN.** $PX+\mathrm{MHA}(PX)=P(X+\mathrm{MHA}(X))$이고, LN은 행(토큰)마다 같은 함수를 적용하므로 $\mathrm{LN}(PZ)=P\,\mathrm{LN}(Z)$.
**FF.** 토큰마다 같은 MLP이므로 $\mathrm{FF}(PZ)=P\,\mathrm{FF}(Z)$이고 잔차와 LN도 같은 이유로 교환됩니다. 따라서 $T(PX)=P\,T(X)$.
**쌓기.** 등변인 함수의 합성은 등변: $T_N\circ\cdots\circ T_1(PX)=P\,T_N\circ\cdots\circ T_1(X)$.
결론: 위치 정보를 주지 않으면 인코더가 토큰의 순서를 구별할 수 없으므로 순서가 의미를 갖는 자료에서는 위치 부호를 입력에 넣어야 합니다.`,
        rubric: R`- 어텐션과 Concat, $W_o$의 등변 — 3점
- 잔차와 LN, FF가 행마다 같은 함수임 — 3점
- 합성의 등변 — 2점
- 위치 부호화의 필요성 — 2점` },
      { sec: '21.8', type: 'mc', lv: 1, q: R`트랜스포머의 LayerNorm(슬라이드 79)이 평균과 분산을 모으는 범위는?`,
        choices: [R`샘플과 토큰 하나를 고른 그 토큰의 특성 벡터 $C$`, R`같은 채널을 가진 배치 전체의 샘플과 위치`, R`한 샘플의 모든 토큰과 채널`, R`학습 데이터 전체`], ans: 0,
        sol: R`트랜스포머의 LN은 샘플과 토큰 하나마다 특성 차원 $C$에서 평균과 분산을 구합니다. 그래서 배치 크기, 문장 길이와 무관하며 학습과 추론이 같습니다. 첫째 보기는 BN입니다.` },
      { sec: '21.8', type: 'num', lv: 2, q: R`$\mathbf h=(2,4,4,6)$에 $\varepsilon=0$, $\boldsymbol\gamma=\mathbf 1$, $\boldsymbol\beta=\mathbf 0$인 LayerNorm을 적용한 결과의 첫 성분은? (식으로 입력해도 됩니다)`, ans: '-sqrt(2)', ansTex: R`-\sqrt2`,
        sol: R`$\mu=4$, $\sigma^2=\frac{4+0+0+4}4=2$이므로 첫 성분은 $\frac{2-4}{\sqrt2}=-\sqrt2$.` },
      { sec: '21.8', type: 'open', lv: 3, proof: true, q: R`$\varepsilon=0$, $\boldsymbol\gamma=\mathbf 1$, $\boldsymbol\beta=\mathbf 0$인 층 정규화 $\mathrm{LN}(\mathbf h)=(\mathbf h-\mu\mathbf 1)/\sigma$에 대해 (1) 출력의 평균이 $0$, 분산이 $1$이고 $\lVert\mathrm{LN}(\mathbf h)\rVert^2=d$임을 보이시오. (2) $a>0$, $b\in\mathbb R$에 대해 $\mathrm{LN}(a\mathbf h+b\mathbf 1)=\mathrm{LN}(\mathbf h)$임을 보이시오. (3) BN과 달리 LN이 배치 크기에 의존하지 않는 이유를 쓰시오.`,
        sol: R`**(1)** $\mathbf y=(\mathbf h-\mu\mathbf 1)/\sigma$이면 평균은 $\frac1d\sum_j(h_j-\mu)/\sigma=(\mu-\mu)/\sigma=0$. 분산은 $\frac1d\sum_jy_j^2=\frac1{\sigma^2}\cdot\frac1d\sum_j(h_j-\mu)^2=1$이고 $\lVert\mathbf y\rVert^2=\sum_jy_j^2=d$.
**(2)** $\mathbf h'=a\mathbf h+b\mathbf 1$이면 $\mu'=a\mu+b$, $h'_j-\mu'=a(h_j-\mu)$, $\sigma'^2=a^2\sigma^2$이고 $a>0$이라 $\sigma'=a\sigma$. 따라서 $\mathrm{LN}(\mathbf h')=a(\mathbf h-\mu\mathbf 1)/(a\sigma)=\mathrm{LN}(\mathbf h)$. ($a<0$이면 부호가 뒤집혀 $-\mathrm{LN}(\mathbf h)$.)
**(3)** $\mu,\sigma$를 토큰 하나의 $d$개 성분만으로 계산하므로 같은 배치의 다른 샘플이 쓰이지 않습니다. BN은 채널마다 배치의 모든 샘플에서 평균·분산을 구하므로 배치 크기에 따라 통계가 달라지고 추론 때는 이동 평균이 필요합니다.`,
        rubric: R`- (1) 평균 $0$, 분산 $1$, 노름 $\sqrt d$ — 3점
- (2) 이동·스케일 불변 — 4점
- (3) 배치 비의존의 이유 — 3점` },
    ],
  });
})();
