/* 22 선형 어텐션과 비전 트랜스포머 — 10주차 수요일 슬라이드 12–29와 필기(Linearization of TF, LayerNorm, ViT, GELU, Swin), 11주차 월요일 필기(행렬 곱과 어텐션의 비용, W-MSA) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 22, part: 'H', title: '선형 어텐션과 비전 트랜스포머', en: 'Linear Attention & Vision Transformers', ref: 'W10 수 · 슬라이드 12–29 · W11 월 필기', plot: 'attncost',
    fig: R`채널 C = 96일 때 토큰 수 N에 따른 한 층의 곱셈 수: 전역 셀프 어텐션 4NC² + 2N²C(굵은 선)는 N²으로 휘어 오르고, 창 크기 M = 4, 7, 14의 윈도우 어텐션 4NC² + 2NM²C(가는 선)는 직선으로 남는다`,
    tagline: R`셀프 어텐션의 비용 $O(N^2)$를 줄이는 두 길과, 트랜스포머를 이미지에 옮기는 법을 다룹니다. 유사도를 특성 사상의 내적으로 바꾸면 계산 순서를 바꿔 $O(N)$이 되고(선형 어텐션), 이미지를 패치 토큰으로 자르면 ViT가 되며, 창 안에서만 어텐션하면 Swin의 $4NC^2+2NM^2C$가 됩니다.`,
    summary: R`10주차 수요일은 21단원 끝의 비용 문제에서 출발합니다. 소프트맥스 어텐션을 유사도 $\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$의 가중 평균으로 다시 쓰고, $\mathrm{sim}$을 커널 $\phi(\mathbf q)^T\phi(\mathbf k)$ ($\phi=\mathrm{ELU}+1$)로 바꾸면 $S=\sum_j\phi(\mathbf k_j)\mathbf v_j^T$, $Z=\sum_j\phi(\mathbf k_j)$를 한 번만 만들어 $\tilde{\mathbf v}_i=S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$로 계산하는 **선형 어텐션**이 됩니다. 이어서 정규화의 묶음을 비교합니다. BN은 채널마다 배치와 위치 전체, CNN의 LN은 샘플 하나 전체, 트랜스포머의 LN은 토큰 하나의 특징에서 평균과 분산을 구합니다. **비전 트랜스포머**(ViT)는 이미지를 $P\times P$ 패치로 잘라 선형 사상 $E$로 토큰을 만들고, 클래스 토큰과 위치 임베딩을 붙여 Pre-LN 인코더에 넣은 뒤 클래스 토큰의 출력으로 분류합니다. MLP의 활성화는 $\mathrm{GELU}(x)=x\Phi(x)$이고, ViT는 CNN보다 귀납 편향이 약해 작은 자료에서는 뒤지지만 큰 자료에서는 앞섭니다. 11주차 월요일에는 행렬 곱의 비용 $O(mnk)$로 셀프 어텐션 한 층의 비용 $4NC^2+2N^2C$를 세고, Swin의 **윈도우 어텐션**이 $M\times M$ 창 안에서만 어텐션해 $4NC^2+2NM^2C$, 곧 $N$에 선형인 비용을 얻는 것을 보였습니다.`,
    goals: [
      R`소프트맥스 어텐션을 유사도 $\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$의 가중 평균으로 다시 쓰고, 출력이 값들의 볼록 결합임을 보일 수 있다`,
      R`커널 $\phi(\mathbf q)^T\phi(\mathbf k)$로 바꾼 선형 어텐션 $\tilde{\mathbf v}_i=S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$를 유도하고, $S$, $Z$로 출력을 계산하며 비용 $O(Nrd_v)$와 어텐션 행렬의 계수가 $r$ 이하임을 보일 수 있다`,
      R`BN, CNN의 LN, 트랜스포머의 LN이 평균과 분산을 모으는 묶음을 구별하고, 주어진 텐서에서 세 정규화를 직접 계산할 수 있다`,
      R`ViT의 식 (1)–(4)를 쓰고, 토큰 수, $E$와 $E_{pos}$의 매개변수 수, 각 층의 모양을 계산하며, 고해상도 미세 조정에서 위치 임베딩을 보간하는 이유를 설명할 수 있다`,
      R`$\mathrm{GELU}(x)=x\Phi(x)$의 값과 도함수를 계산하고, ViT와 CNN의 귀납 편향의 차이와 자료 크기에 따른 성능 차이를 설명할 수 있다`,
      R`행렬 곱의 비용 $O(mnk)$로 셀프 어텐션 한 층의 비용 $4NC^2+2N^2C$를 유도하고, 어느 항이 언제 지배하는지 판단할 수 있다`,
      R`윈도우 어텐션의 비용 $4NC^2+2NM^2C$를 유도하고, $56\times56$, $M=7$의 예에서 창의 수와 줄어드는 비율을 계산할 수 있다`,
    ],
    secTitles: { '22.1': '유사도로 쓰기', '22.2': '선형 어텐션', '22.3': 'LN 대 BN', '22.4': 'ViT', '22.5': 'GELU·ViT 대 CNN', '22.6': '어텐션의 비용', '22.7': '윈도우 어텐션' },
    sections: [
      { k: '22.1', src: 'W10 수 · 슬라이드 12 · 필기', title: '소프트맥스 어텐션을 유사도의 가중 평균으로', body: R`
:::idea 쉽게 말하면
셀프 어텐션의 출력은 값 $\mathbf v_j$들의 가중 평균이고, 가중치는 질의 $\mathbf q_i$와 키 $\mathbf k_j$가 얼마나 닮았는지를 나타냅니다. 소프트맥스를 풀어 쓰면 이 ‘닮음’이 $\exp(\mathbf q_i^T\mathbf k_j/\sqrt D)$라는 함수 하나로 드러납니다. 이 함수만 바꾸면 어텐션의 계산 비용을 바꿀 수 있다는 것이 이 단원의 출발점입니다.
:::

**출발점** (슬라이드 12 “Linearization of TF”). 21단원 끝에서 셀프 어텐션 한 층의 계산이 $O(N^2d)$이고 어텐션 행렬을 저장하는 데 $N^2$의 메모리가 든다는 것을 보았습니다[[ch21:21.5|셀프 어텐션의 모양과 비용.]]. 슬라이드 12는 제목만 있고, 수업에서는 이 비용을 줄이는 방법(Katharopoulos 외, ICML 2020)을 판서로 설명했습니다.

:::hand 수업 필기 — 셀프 어텐션의 두 병목
입력 $X\in\mathbb R^{N\times D_x}$에서 $Q=XW_Q^T$, $K=XW_K^T$, $V=XW_V^T$를 만듭니다. 여기서 $W_Q,W_K\in\mathbb R^{D\times D_x}$, $W_V\in\mathbb R^{D_v\times D_x}$입니다.

행 하나씩 쓰면 $\hat{\mathbf v}_i=\sum_{j=1}^N\mathrm{softmax}_j\big(\mathbf q_i^T\mathbf k_j/\sqrt D\big)\,\mathbf v_j$이고, 행렬로 모으면 $\hat V=\mathrm{softmax}(QK^T/\sqrt D)\,V$입니다.

병목은 둘입니다. $A=\mathrm{softmax}(QK^T/\sqrt D)\in\mathbb R^{N\times N}$을 저장하는 데 $O(N^2)$의 메모리가, $AV$를 계산하는 데 $O(N^2)$의 시간이 듭니다(필기는 ‘ICML’에 상자를 쳐서 출처를 표시했습니다).
:::

**소프트맥스를 풀어 쓰기.** 점수 $s_{ij}=\mathbf q_i^T\mathbf k_j/\sqrt D$의 소프트맥스 가중치는 $\alpha_{ij}=e^{s_{ij}}/\sum_le^{s_{il}}$입니다. 분모는 합의 첨자 $j$에 의존하지 않으므로 합 밖으로 꺼낼 수 있습니다.

:::key 유사도로 쓴 소프트맥스 어텐션
$\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$로 두면
$$\hat{\mathbf v}_i=\frac{\sum_{j=1}^N\mathrm{sim}(\mathbf q_i,\mathbf k_j)\,\mathbf v_j}{\sum_{j=1}^N\mathrm{sim}(\mathbf q_i,\mathbf k_j)}.$$
$\mathrm{sim}>0$이면 가중치가 양수이고 합이 $1$이므로 $\hat{\mathbf v}_i$는 $\mathbf v_j$들의 볼록 결합이다. 소프트맥스 어텐션은 $\mathrm{sim}$을 지수 함수로 고른 경우다.
:::

이렇게 쓰면 어텐션에 필요한 것이 분명해집니다. 음이 아닌 유사도 하나만 있으면 되고, 지수 함수는 여러 선택 중 하나일 뿐입니다. 다음 절에서 이 선택을 바꿔 계산 순서를 뒤집습니다.

:::ex 예제 1 — 유사도로 계산하기
$D=1$, 질의 $q=\ln3$, 키 $k_1=0$, $k_2=1$, 값 $v_1=4$, $v_2=8$일 때 $\hat v$는?
---
$\mathrm{sim}(q,k_1)=e^0=1$, $\mathrm{sim}(q,k_2)=e^{\ln3}=3$이므로 $\hat v=\frac{1\cdot4+3\cdot8}{1+3}=\frac{28}4=7$. 소프트맥스 가중치 $(\frac14,\frac34)$로 계산한 값과 같습니다.
:::
` },
      { k: '22.2', src: 'W10 수 · 슬라이드 12 · 필기', title: '커널 특성 사상과 선형 어텐션', body: R`
:::idea 쉽게 말하면
행렬 곱 $(QK^T)V$를 $Q(K^TV)$로 묶는 순서만 바꿔도 $N\times N$ 행렬이 사라집니다. 문제는 소프트맥스의 지수 함수가 이 재배열을 막는다는 것입니다. 유사도를 특성 사상의 내적 $\phi(\mathbf q)^T\phi(\mathbf k)$로 바꾸면 재배열이 가능해지고, 모든 질의가 함께 쓰는 요약 $S$와 $Z$를 한 번만 만들면 됩니다.
:::

**커널로 바꾸기** (필기). 유사도를 커널 $k(\mathbf q,\mathbf k)=\phi(\mathbf q)^T\phi(\mathbf k)$, $\phi:\mathbb R^D\to\mathbb R^r$로 바꿉니다. 가중치가 양수여야 하므로 $\phi$의 성분이 늘 양수가 되게 고릅니다. 필기는 성분마다 다음 함수를 썼습니다(이때 $r=D$).
$$\phi(\mathbf x)_l=\mathrm{ELU}(x_l)+1=\begin{cases}x_l+1,&x_l\ge0\\e^{x_l},&x_l<0\end{cases}$$

:::warn 필기의 ELU 표기
필기는 이 함수를 ‘ELU’라고 적었지만 적힌 식은 $\mathrm{ELU}(x)+1$입니다. ELU 자체는 $x<0$에서 $e^x-1$로 음수가 되어 유사도로 쓰기에 맞지 않고, $1$을 더해야 모든 값이 양수가 됩니다. 원 논문(Katharopoulos 외, 2020)도 $\mathrm{elu}(x)+1$을 씁니다.
:::

**순서 바꾸기.** 분자와 분모에서 $\phi(\mathbf q_i)^T$는 $j$에 의존하지 않으므로 합 밖으로 나옵니다(출력을 행벡터로 썼습니다).
$$\tilde{\mathbf v}_i^T=\frac{\sum_j\phi(\mathbf q_i)^T\phi(\mathbf k_j)\,\mathbf v_j^T}{\sum_j\phi(\mathbf q_i)^T\phi(\mathbf k_j)}=\frac{\phi(\mathbf q_i)^T\sum_j\phi(\mathbf k_j)\mathbf v_j^T}{\phi(\mathbf q_i)^T\sum_j\phi(\mathbf k_j)}$$

:::key 선형 어텐션
$S=\sum_{j=1}^N\phi(\mathbf k_j)\mathbf v_j^T\in\mathbb R^{r\times d_v}$, $Z=\sum_{j=1}^N\phi(\mathbf k_j)\in\mathbb R^r$로 두면
$$\tilde{\mathbf v}_i=\frac{S^T\phi(\mathbf q_i)}{\phi(\mathbf q_i)^TZ}.$$
$S$와 $Z$를 만드는 데 $O(Nrd_v)$, 모든 질의의 출력에 $O(Nrd_v)$가 들어 전체 시간이 $N$에 선형이고, $N\times N$ 행렬을 저장하지 않는다.
:::

:::fig linattn
:::

:::hand 수업 필기 — 비용 세기
$S$: 항 $\phi(\mathbf k_j)\mathbf v_j^T$ 하나가 곱셈 $rd_v$번이고 $N$개를 더하므로 $O(Nrd_v)$. $Z$: $O(Nr)$.

출력: 질의마다 $S^T\phi(\mathbf q_i)$가 $O(rd_v)$, $\phi(\mathbf q_i)^TZ$가 $O(r)$이므로 $N$개에 $O(Nrd_v+Nr)$.

모두 더하면 $r$, $d_v$를 고정할 때 $O(N)$입니다. 필기는 끝에 $\hat V=AV\approx(\mathbf a\mathbf b^T)V$라고 적어, 이 방법이 어텐션 행렬을 계수가 낮은 행렬로 근사하는 것임을 짚었습니다.
:::

**계수가 낮다는 뜻.** 정규화 전의 유사도 행렬은 $\phi(Q)\phi(K)^T$ ($\phi(Q),\phi(K)\in\mathbb R^{N\times r}$)이므로 계수가 $r$ 이하이고, 행마다 양수로 나누는 정규화는 계수를 늘리지 않습니다. 소프트맥스 어텐션의 $\exp(QK^T/\sqrt D)$는 성분마다 지수를 취하므로 이런 제한이 없어 계수가 $N$까지 될 수 있습니다. 선형 어텐션은 속도를 얻는 대신 나타낼 수 있는 어텐션 패턴을 좁힌 것입니다.

:::ex 예제 2 — S와 Z로 계산하기
$\phi(\mathbf k_1)=(1,0)$, $\phi(\mathbf k_2)=(1,1)$, 값 $v_1=2$, $v_2=4$ ($d_v=1$), $\phi(\mathbf q)=(1,2)$일 때 선형 어텐션의 출력은?
---
$S=\phi(\mathbf k_1)v_1+\phi(\mathbf k_2)v_2=(2,0)+(4,4)=(6,4)$, $Z=(1,0)+(1,1)=(2,1)$. 분자 $\phi(\mathbf q)^TS=6+8=14$, 분모 $\phi(\mathbf q)^TZ=2+2=4$이므로 $\tilde v=3.5$. 확인: 유사도가 $1$, $3$이라 $\frac{1\cdot2+3\cdot4}{4}=3.5$입니다.
:::

:::ex 예제 3 — 얼마나 빨라지나
$N=4096$, $d_v=r=64$일 때 소프트맥스 어텐션의 $AV$와 선형 어텐션의 $S$를 만드는 곱셈 수를 비교하면?
---
$AV$는 $N^2d_v=4096^2\cdot64\approx1.07\times10^9$번, $S$는 $Nrd_v=4096\cdot64\cdot64\approx1.68\times10^7$번으로 비율이 $N/r=64$입니다. $QK^T$도 $N^2D$번이라 같은 비율로 줄어들고, 어텐션 행렬 $4096^2\approx1.7\times10^7$칸의 메모리가 사라집니다.
:::

### 더 깊이

**마스크가 있으면 RNN이 된다**(슬라이드 밖, 원 논문). 언어 모델처럼 $j\le i$만 보아야 하면 $S_i=\sum_{j\le i}\phi(\mathbf k_j)\mathbf v_j^T$, $Z_i=\sum_{j\le i}\phi(\mathbf k_j)$를 쓰는데, 이는 $S_i=S_{i-1}+\phi(\mathbf k_i)\mathbf v_i^T$, $Z_i=Z_{i-1}+\phi(\mathbf k_i)$로 한 칸씩 갱신됩니다. 상태 $(S_i,Z_i)$를 들고 가는 RNN과 같아서 생성할 때 토큰 하나에 $O(rd_v)$만 듭니다. 원 논문의 제목 “Transformers are RNNs”가 이것입니다[[ch21:21.6|마스크 셀프 어텐션.]].
` },
      { k: '22.3', src: 'W10 수 · 슬라이드 13 · 필기', title: '층 정규화와 배치 정규화: 세 가지 묶음', body: R`
:::idea 쉽게 말하면
정규화는 ‘어떤 숫자들을 한 묶음으로 보고 평균 $0$, 분산 $1$로 맞출까’의 문제입니다. BN은 같은 채널을 배치 전체에서 모으고, CNN의 LN은 이미지 한 장을 통째로, 트랜스포머의 LN은 토큰 하나의 특징만 모읍니다. 묶음이 다르면 같은 숫자도 다르게 정규화됩니다.
:::

**슬라이드 13.** 정규화의 식은 21단원과 같습니다[[ch21:21.8|층 정규화의 식과 BN과의 비교.]]. 묶음의 평균 $\mu$와 분산 $\sigma^2$로 $(x-\mu)/\sqrt{\sigma^2+\varepsilon}$을 만들고 학습되는 $\gamma$, $\beta$로 다시 조절합니다. 다른 것은 평균과 분산을 모으는 범위입니다. 입력을 $B\times C\times H\times W$ 텐서(배치, 채널, 높이, 너비)로 보면 다음과 같습니다.

:::key 정규화 통계를 모으는 묶음
| | 통계를 모으는 칸 | 묶음 하나의 크기 | 묶음의 수 |
|---|---|---|---|
| BN (CNN) | 채널 하나의 모든 샘플과 위치 | $BHW$ | $C$ |
| LN (CNN) | 샘플 하나의 모든 채널과 위치 | $CHW$ | $B$ |
| LN (트랜스포머) | 토큰 하나의 모든 특징 성분 | $C$ | 토큰 수 |

묶음마다 $\mu$, $\sigma^2$를 구해 $(x-\mu)/\sqrt{\sigma^2+\varepsilon}$으로 바꾸고, 채널(특징)마다 $\gamma$, $\beta$로 다시 조절한다. LN의 통계는 다른 샘플을 쓰지 않으므로 배치 크기에 의존하지 않는다.
:::

:::fig normgroups
:::

:::hand 수업 필기 — B = 2, C = 2, H = 1, W = 2의 예
두 샘플의 값이 다음과 같습니다(채널마다 위치 두 개).

| | 채널 1 | 채널 2 |
|---|---|---|
| $x^{(1)}$ | $1,\ 3$ | $5,\ 7$ |
| $x^{(2)}$ | $9,\ 11$ | $13,\ 15$ |

① CNN의 BN(같은 채널에 있는 여러 샘플과 공간 위치): 채널 1의 묶음은 $\{1,3,9,11\}$이라 $\mu_1=6$, $\sigma_1^2=\frac{25+9+9+25}4=17$. 채널 2는 $\{5,7,13,15\}$로 $\mu_2=10$, $\sigma_2^2=17$. 값 $1$은 $(1-6)/\sqrt{17}\approx-1.21$이 됩니다.

② CNN의 LN(이미지 한 장의 모든 채널과 공간 위치): 이미지 1의 묶음은 $\{1,3,5,7\}$이라 $\mu=4$, $\sigma^2=\frac{9+1+1+9}4=5$. 이미지 2는 $\{9,11,13,15\}$로 $\mu=12$, $\sigma^2=5$. 값 $1$은 $(1-4)/\sqrt5\approx-1.34$.

③ 트랜스포머의 LN(토큰 하나의 모든 특징 성분): 위치를 토큰으로 보면 이미지 1의 토큰은 $(1,5)$와 $(3,7)$입니다. 토큰 $(1,5)$는 $\mu=3$, $\sigma^2=4$이므로 $(-1,1)$이 됩니다.
:::

**무엇이 다른가.** BN에서 샘플 1의 값 $1$이 어떻게 정규화되는지는 샘플 2의 값 $9,11$에 따라 달라집니다. 곧 BN의 출력은 배치에 함께 들어온 다른 샘플에 의존하고, 그래서 추론 때는 학습 중에 모은 이동 평균을 써야 합니다[[ch12:12.4|BN 추론 시의 통계.]]. 두 LN은 샘플 하나만 보므로 학습과 추론이 같은 식입니다. 트랜스포머의 LN은 묶음이 더 작아서 문장 길이가 달라도 토큰마다 독립으로 계산됩니다.

:::ex 예제 4 — 같은 값 15의 세 가지 정규화
위 텐서에서 $x^{(2)}$의 채널 2, 위치 2의 값 $15$를 세 방식으로 정규화하면?
---
BN: 채널 2의 $\mu_2=10$, $\sigma_2^2=17$이므로 $(15-10)/\sqrt{17}=5/\sqrt{17}\approx1.21$. CNN의 LN: 이미지 2의 $\mu=12$, $\sigma^2=5$이므로 $3/\sqrt5\approx1.34$. 트랜스포머의 LN: 토큰 $(11,15)$의 $\mu=13$, $\sigma^2=4$이므로 $(15-13)/2=1$. 같은 값이 세 가지 다른 값이 됩니다.
:::
` },
      { k: '22.4', src: 'W10 수 · 슬라이드 14–22', title: '비전 트랜스포머', body: R`
:::idea 쉽게 말하면
트랜스포머는 토큰의 목록이면 무엇이든 받습니다. ViT는 이미지를 $16\times16$ 조각(패치)으로 잘라 조각 하나를 단어 하나처럼 다룹니다. 조각을 펼쳐 선형 사상으로 벡터를 만들고, 위치 정보를 더하고, 분류용 토큰 하나를 맨 앞에 붙여 인코더에 넣은 뒤 그 토큰의 출력으로 분류합니다.
:::

**왜 트랜스포머인가** (슬라이드 14). 트랜스포머는 자료와 계산을 늘릴수록 성능이 꾸준히 오르는 모습을 보였고, 격자나 사슬 같은 강한 가정이 없어 같은 구조를 여러 종류의 자료에 쓸 수 있습니다[[ch21:21.3|귀납 편향과 범용 모델.]]. 슬라이드 15–21은 이를 이미지에 옮긴 ViT(Dosovitskiy 외, 2021)를 단계별로 보입니다.

**패치 임베딩** (슬라이드 15–19). 이미지 $\mathbf x\in\mathbb R^{H\times W\times C}$를 $P\times P$ 패치 $N=HW/P^2$개로 자르고 각 패치를 길이 $P^2C$의 벡터 $\mathbf x_p^i$로 펼칩니다. 여기에 행렬 $E\in\mathbb R^{(P^2C)\times D}$를 곱해 $D$차원 토큰을 만듭니다. 펼친 패치 대신 CNN 특성 지도의 위치를 토큰으로 쓰는 하이브리드도 있습니다.

**클래스 토큰과 위치 임베딩** (슬라이드 20–21). 맨 앞에 학습되는 벡터 $\mathbf x_{class}$ 하나(전역 토큰)를 붙이고, 위치 임베딩 $E_{pos}\in\mathbb R^{(N+1)\times D}$를 더합니다. 위치 임베딩은 학습하거나 2차원 주기 함수로 고정할 수 있습니다. 셀프 어텐션은 순서를 모르므로[[ch21:21.6|위치 부호화가 필요한 이유.]] 이것이 없으면 패치를 뒤섞어도 클래스 토큰의 출력이 같습니다.

:::key 비전 트랜스포머의 식
$$\mathbf z_0=[\mathbf x_{class};\ \mathbf x_p^1E;\ \mathbf x_p^2E;\ \cdots;\ \mathbf x_p^NE]+E_{pos}\qquad(1)$$
$$\mathbf z'_\ell=\mathrm{MSA}(\mathrm{LN}(\mathbf z_{\ell-1}))+\mathbf z_{\ell-1},\qquad\ell=1,\dots,L\qquad(2)$$
$$\mathbf z_\ell=\mathrm{MLP}(\mathrm{LN}(\mathbf z'_\ell))+\mathbf z'_\ell,\qquad\ell=1,\dots,L\qquad(3)$$
$$\mathbf y=\mathrm{LN}(\mathbf z_L^0)\qquad(4)$$
$E\in\mathbb R^{(P^2C)\times D}$, $E_{pos}\in\mathbb R^{(N+1)\times D}$. MSA는 멀티헤드 셀프 어텐션, MLP는 GELU를 쓴 두 층 신경망이고, $\mathbf z_L^0$은 마지막 층 출력의 첫 행(클래스 토큰)이다.
:::

:::fig vitpipe
:::

**21단원 인코더와의 차이** (슬라이드 22). 21단원의 인코더 블록은 하위 층 뒤에 LN을 두었지만($\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{Attn})$)[[ch21:21.7|트랜스포머 인코더 블록.]], ViT는 모든 블록 앞에 LN을 두고 블록 뒤에 잔차를 더합니다. 그래서 잔차 경로 $\mathbf z_{\ell-1}\to\mathbf z_\ell$에는 정규화가 끼지 않고 입력이 그대로 위층까지 전달됩니다. 분류 헤드는 $\mathbf y$ 하나에만 붙고, 나머지 $N$개 토큰의 출력은 쓰지 않습니다.

:::ex 예제 5 — 토큰 수와 매개변수
$224\times224\times3$ 이미지를 $P=16$, $D=768$인 ViT에 넣을 때 토큰 수, $E$와 $E_{pos}$의 매개변수 수는?
---
패치가 $N=224^2/16^2=14\cdot14=196$개이고 클래스 토큰을 더해 $197$개입니다. 펼친 패치의 길이는 $16\cdot16\cdot3=768$이므로 $E$는 $768\times768=589{,}824$개, $E_{pos}$는 $197\times768=151{,}296$개, 클래스 토큰은 $768$개입니다. 식 (2)–(3)은 모양을 바꾸지 않아 모든 $\mathbf z_\ell$이 $197\times768$입니다.
:::
` },
      { k: '22.5', src: 'W10 수 · 슬라이드 23–26', title: 'GELU와 ViT 대 CNN', body: R`
:::idea 쉽게 말하면
ReLU는 음수를 칼같이 $0$으로 자르지만, GELU는 입력 $x$를 ‘표준 정규분포에서 $x$ 이하가 나올 확률’ $\Phi(x)$만큼만 통과시킵니다. 큰 값은 거의 그대로, 작은 값은 거의 $0$이고, 그 사이는 부드럽게 이어집니다.
:::

:::key GELU
$$\mathrm{GELU}(x)=x\,\Phi(x),\qquad\Phi(x)=P(X\le x),\quad X\sim\N(0,1)$$
흔히 쓰는 근사는 $0.5x\big(1+\tanh\big[\sqrt{2/\pi}\,(x+0.044715x^3)\big]\big)$이다. 도함수는 $\mathrm{GELU}'(x)=\Phi(x)+x\varphi(x)$ ($\varphi$는 표준 정규 밀도)이고 $\mathrm{GELU}'(0)=\tfrac12$이다.
:::

:::fig gelu
:::

**성질** (슬라이드 23, 필기). $\mathrm{GELU}(1)=\Phi(1)\approx0.841$, $\mathrm{GELU}(-1)=-\Phi(-1)\approx-0.159$입니다. $\Phi(-x)=1-\Phi(x)$이므로 $\mathrm{GELU}(x)-\mathrm{GELU}(-x)=x$가 늘 성립합니다. ReLU와 달리 모든 점에서 미분 가능하고, 음수 쪽에서 단조가 아니어서 $x\approx-0.75$에서 최솟값 약 $-0.17$을 가집니다(필기가 동그라미 친 골). ViT의 MLP는 이 활성화를 씁니다.

**ViT 대 CNN** (슬라이드 24).

| | CNN | ViT |
|---|---|---|
| 한 층이 보는 범위 | 국소적(커널 크기) | 전역적(모든 패치) |
| 이동 등변성 | 합성곱이 보장한다 | 구조로 보장되지 않는다(슬라이드는 ‘X?’) |
| 위치 정보 | 격자 구조에 들어 있다 | 위치 임베딩으로 배운다 |
| 고해상도로 미세 조정 | 그대로 적용 | 위치 임베딩을 2차원으로 보간 |

패치 임베딩은 패치 안에서만 국소적이고, 셀프 어텐션은 처음부터 모든 패치를 봅니다. 이미지에 대한 가정(귀납 편향)이 그만큼 약합니다. 고해상도로 미세 조정할 때는 $P$를 그대로 두므로 패치 수가 늘고, 원래 격자에서 배운 $E_{pos}$를 새 격자로 2차원 보간하며, 헤드를 새 과제에 맞게 바꿉니다.

**실험** (슬라이드 26). ImageNet처럼 비교적 작은 자료로 사전 학습하면 ViT가 CNN 기반의 BiT보다 낮고, JFT-300M처럼 큰 자료로 사전 학습하면 ViT가 앞섭니다. 가정이 약한 모델은 그 가정을 자료에서 배워야 하므로 자료가 많을 때 유리합니다.

:::ex 예제 6 — 고해상도 미세 조정의 격자
$224\times224$에서 $P=16$으로 사전 학습한 ViT를 $384\times384$에서 미세 조정하면 패치 격자와 위치 임베딩은 어떻게 되는가?
---
격자가 $14\times14=196$개에서 $24\times24=576$개로 늘어납니다. 학습된 $E_{pos}$는 $196$개 패치의 것(과 클래스 토큰의 것)뿐이므로, 패치 부분을 $14\times14$ 격자로 놓고 $24\times24$로 2차원 보간해 새 $E_{pos}\in\mathbb R^{577\times D}$를 만듭니다. 클래스 토큰의 위치 임베딩은 그대로 씁니다.
:::
` },
      { k: '22.6', src: 'W11 월 · 필기', title: '행렬 곱과 셀프 어텐션의 비용', body: R`
:::idea 쉽게 말하면
어텐션의 비용은 결국 행렬 곱을 몇 번 하느냐입니다. $m\times k$ 행렬과 $k\times n$ 행렬을 곱하면 결과의 $mn$칸 각각에 곱셈이 $k$번 들므로 모두 $mnk$번입니다. 이 규칙 하나로 셀프 어텐션 한 층의 비용을 셀 수 있습니다.
:::

:::hand 수업 필기 — 행렬 곱의 비용 (Tip)
$A\in\mathbb R^{m\times k}$, $B\in\mathbb R^{k\times n}$이면 $Y=AB$의 성분은 $Y_{ij}=\sum_{l=1}^kA_{il}B_{lj}$입니다. 성분 하나에 곱셈 $k$번, 덧셈 $k-1$번이 들고 성분이 $mn$개이므로 비용은 $O(mnk)$입니다.
:::

**모양 정하기** (필기). 특성 지도 $X\in\mathbb R^{h\times w\times C}$는 위치 $(r,c)$마다 벡터 $\mathbf x_{r,c}\in\mathbb R^C$를 가집니다($h$, $w$는 공간 크기, $C$는 특징 차원). 위치를 한 줄로 늘어놓으면 토큰 $N=hw$개의 행렬 $X\in\mathbb R^{N\times C}$입니다. 투영은 $Q=XW_Q$, $K=XW_K$, $V=XW_V$이고 $W_Q,W_K,W_V\in\mathbb R^{C\times C}$입니다.

:::key 셀프 어텐션의 비용
| 계산 | 모양 | 곱셈 수 |
|---|---|---|
| $Q$, $K$, $V$ 투영 | $(N\times C)(C\times C)$ 세 번 | $3NC^2$ |
| $QK^T$ | $(N\times C)(C\times N)$ | $N^2C$ |
| $AV$ | $(N\times N)(N\times C)$ | $N^2C$ |
| 출력 투영 | $(N\times C)(C\times C)$ | $NC^2$ |

$$\Omega(\mathrm{MSA})=4NC^2+2N^2C=4hwC^2+2(hw)^2C$$
앞 항은 $O(NC^2)$, 뒤 항은 $O(N^2C)$이고 $N>2C$이면 뒤 항이 더 크다. 소프트맥스와 $\sqrt C$로 나누기는 $O(N^2)$이라 뺀다.
:::

**네 번째 투영.** 필기는 $Q$, $K$, $V$의 $3NC^2$를 적었고, Swin 논문의 식 $4hwC^2$에는 헤드들을 이어 붙인 뒤 곱하는 출력 투영 $W_O\in\mathbb R^{C\times C}$의 $NC^2$가 더해져 있습니다. 헤드를 $h$개로 나눠도 헤드마다 $QK^T$가 $N^2(C/h)$이므로 합은 $N^2C$로 같습니다[[ch21:21.7|멀티헤드 어텐션의 매개변수와 비용.]].

:::ex 예제 7 — Swin 첫 단계의 크기
$h=w=56$, $C=96$일 때 전역 셀프 어텐션 한 층의 두 항은?
---
$N=56^2=3136$. $4NC^2=4\cdot3136\cdot9216=115{,}605{,}504$, $2N^2C=2\cdot3136^2\cdot96=1{,}888{,}223{,}232$로 합이 약 $2.0\times10^9$입니다. $N=3136$이 $2C=192$보다 훨씬 커서 어텐션 항이 전체의 약 $94\%$를 차지합니다. 어텐션 행렬만도 헤드 하나에 $3136^2\approx9.8\times10^6$칸입니다.
:::
` },
      { k: '22.7', src: 'W10 수 · 슬라이드 27–29 · W11 월 필기', title: '윈도우 어텐션(Swin)의 비용', body: R`
:::idea 쉽게 말하면
모든 토큰이 모든 토큰을 보는 대신 이미지를 $M\times M$ 창으로 나눠 창 안에서만 어텐션하면, 토큰 하나가 보는 상대가 $N$개에서 $M^2$개로 줄어듭니다. 창 크기를 고정하면 비용이 토큰 수에 비례하는 선형이 됩니다.
:::

**Swin 트랜스포머** (슬라이드 27). 특성 지도의 크기를 단계마다 줄이는 계층 구조입니다. $56\times56\times96\to28\times28\times192\to14\times14\times384\to7\times7\times768$로 단계마다 토큰 수가 $\frac14$, 채널이 $2$배가 되어 CNN의 특성 피라미드와 같은 모양이 됩니다. 각 단계 안에서는 전역 어텐션 대신 윈도우 어텐션(W-MSA)을 씁니다.

:::key 윈도우 어텐션의 비용
창 크기 $M\times M$, 창 하나의 토큰 $M^2$개, 창의 수 $N/M^2$일 때
$$\Omega(\mathrm{W\text{-}MSA})=4NC^2+2NM^2C=4hwC^2+2M^2hwC$$
투영 $4NC^2$는 그대로이고, 어텐션은 창마다 $2(M^2)^2C=2M^4C$에 창의 수 $N/M^2$를 곱한 $2NM^2C$이다. $M$과 $C$를 고정하면 $O(N)$이다.
:::

:::fig wmsa
:::

:::hand 수업 필기 — 56×56, M = 7의 경우
$h=w=56$이면 $N=3136$이고, 창이 $7\times7$이면 창 하나에 토큰 $49$개, 창은 $3136/49=64$개입니다.

전역 어텐션의 점수 행렬은 $3136^2=9{,}834{,}496$칸, 윈도우 어텐션은 $64\cdot49^2=153{,}664$칸으로 $N/M^2=64$배 작습니다. $M$과 $C$를 고정하면 전역은 $O(N^2)$, 윈도우는 $O(N)$입니다.
:::

**창 사이의 연결** (슬라이드 28–29, 심화). 창 안에서만 어텐션하면 창 경계를 넘는 정보가 오가지 않습니다. Swin은 층을 번갈아 창의 분할을 $(\lfloor M/2\rfloor,\lfloor M/2\rfloor)$만큼 옮긴 창(shifted window)을 써서 이웃 창이 섞이게 하고, 단계 사이에서는 이웃한 $2\times2$ 토큰을 이어 붙여($4C$) 선형 사상으로 $2C$로 줄이는 패치 병합(풀링과 비슷한 역할)으로 해상도를 낮춥니다. 수업에서 심화로 표시한 내용이라 연습문제는 두지 않았습니다.

:::ex 예제 8 — 전체 비용의 비교
$h=w=56$, $C=96$, $M=7$일 때 W-MSA 한 층의 비용과 전역 MSA와의 비율은?
---
$4NC^2=115{,}605{,}504$, $2NM^2C=2\cdot3136\cdot49\cdot96=29{,}503{,}488$로 합이 $145{,}108{,}992$입니다. 전역 MSA의 $2{,}003{,}828{,}736$보다 약 $13.8$배 작습니다. 어텐션 항만 보면 $2N^2C/(2NM^2C)=N/M^2=64$배 줄었고, 이제는 투영 항이 더 큽니다.
:::
` },
    ],
    problems: [
      { sec: '22.1', type: 'mc', lv: 1, q: R`$\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$로 쓴 소프트맥스 어텐션의 출력 $\hat{\mathbf v}_i$는?`,
        choices: [R`$\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j$`, R`$\dfrac{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j}{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)}$`, R`$\dfrac{\sum_j\mathrm{sim}(\mathbf q_j,\mathbf k_i)\mathbf v_i}{\sum_j\mathrm{sim}(\mathbf q_j,\mathbf k_i)}$`, R`$\max_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j$`], ans: 1,
        sol: R`소프트맥스 가중치 $\alpha_{ij}=e^{s_{ij}}/\sum_le^{s_{il}}$의 분모는 $j$와 무관하므로 합 밖으로 나와, 유사도로 가중한 합을 유사도의 합으로 나눈 꼴이 됩니다. 정규화가 없으면(첫째) 가중치의 합이 $1$이 아닙니다.` },
      { sec: '22.1', type: 'num', lv: 2, q: R`두 키의 점수가 $\mathbf q^T\mathbf k_1/\sqrt D=0$, $\mathbf q^T\mathbf k_2/\sqrt D=\ln4$이고 값이 $v_1=10$, $v_2=5$일 때 소프트맥스 어텐션의 출력은?`, ans: '6', ansTex: R`\frac{1\cdot10+4\cdot5}{1+4}=6`,
        sol: R`유사도가 $e^0=1$, $e^{\ln4}=4$이므로 $\hat v=\frac{10+20}{5}=6$.` },
      { sec: '22.1', type: 'open', lv: 3, proof: true, quiz: true, q: R`셀프 어텐션 $\hat{\mathbf v}_i=\sum_j\alpha_{ij}\mathbf v_j$, $\alpha_{ij}=\mathrm{softmax}_j(\mathbf q_i^T\mathbf k_j/\sqrt D)$에 대해 (1) $\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$로 $\hat{\mathbf v}_i=\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j/\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)$임을 보이시오. (2) 임의의 양의 함수 $\mathrm{sim}$에 대해 이 식의 $\hat{\mathbf v}_i$가 $\mathbf v_j$들의 볼록 결합이고 $\lVert\hat{\mathbf v}_i\rVert\le\max_j\lVert\mathbf v_j\rVert$임을 보이시오. (3) 행렬 $A=\mathrm{softmax}(QK^T/\sqrt D)$를 저장하고 $AV$를 계산하는 비용을 $N$으로 쓰시오.`,
        sol: R`**(1)** $s_{ij}=\mathbf q_i^T\mathbf k_j/\sqrt D$로 두면 $\alpha_{ij}=e^{s_{ij}}/\sum_le^{s_{il}}=\mathrm{sim}(\mathbf q_i,\mathbf k_j)/\sum_l\mathrm{sim}(\mathbf q_i,\mathbf k_l)$. 분모는 $j$에 의존하지 않으므로 $\hat{\mathbf v}_i=\sum_j\alpha_{ij}\mathbf v_j=\frac{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j}{\sum_l\mathrm{sim}(\mathbf q_i,\mathbf k_l)}$.
**(2)** $w_j=\mathrm{sim}(\mathbf q_i,\mathbf k_j)/\sum_l\mathrm{sim}(\mathbf q_i,\mathbf k_l)$로 두면 $w_j>0$, $\sum_jw_j=1$이므로 $\hat{\mathbf v}_i=\sum_jw_j\mathbf v_j$는 볼록 결합입니다. 삼각 부등식으로 $\lVert\hat{\mathbf v}_i\rVert\le\sum_jw_j\lVert\mathbf v_j\rVert\le\max_j\lVert\mathbf v_j\rVert$.
**(3)** $A$는 $N\times N$이라 메모리가 $O(N^2)$, $AV$는 $(N\times N)(N\times D_v)$라 곱셈 $N^2D_v$번, 곧 $O(N^2)$ 시간입니다.`,
        rubric: R`- (1) 분모가 $j$와 무관함을 밝히고 식을 정리 — 4점
- (2) 가중치가 양수이고 합이 $1$임, 삼각 부등식 — 4점
- (3) 메모리 $O(N^2)$와 시간 $O(N^2)$ — 2점` },
      { sec: '22.2', type: 'mc', lv: 1, q: R`선형 어텐션에서 특성 사상으로 $\phi(x)=\mathrm{ELU}(x)+1$을 쓰는 이유로 가장 알맞은 것은?`,
        choices: [R`$\phi$의 값이 늘 양수여서 유사도 $\phi(\mathbf q)^T\phi(\mathbf k)$가 양수가 되기 때문`, R`$\phi$가 지수 함수와 정확히 같은 커널을 만들기 때문`, R`$\phi$가 출력의 차원을 $N$으로 늘리기 때문`, R`$\phi$가 미분 불가능해 학습이 안정되기 때문`], ans: 0,
        sol: R`$x\ge0$이면 $x+1\ge1$, $x<0$이면 $e^x>0$이라 모든 성분이 양수이고, 따라서 가중치가 양수로 유지됩니다. 지수 커널과 같지는 않고(근사가 아니라 다른 유사도), 차원은 $r$입니다.` },
      { sec: '22.2', type: 'num', lv: 2, q: R`$\phi(\mathbf k_1)=(2,0)$, $\phi(\mathbf k_2)=(1,1)$, $\phi(\mathbf k_3)=(0,1)$, 값 $v=(1,3,5)$ ($d_v=1$), $\phi(\mathbf q)=(1,1)$일 때 선형 어텐션의 출력은?`, ans: '13/5', ansTex: R`\frac{13}{5}`,
        sol: R`$S=(2,0)\cdot1+(1,1)\cdot3+(0,1)\cdot5=(5,8)$, $Z=(3,2)$. 분자 $\phi(\mathbf q)^TS=13$, 분모 $\phi(\mathbf q)^TZ=5$이므로 $13/5=2.6$. 유사도 $2,2,1$로 직접 계산해도 $\frac{2+6+5}{5}$입니다.` },
      { sec: '22.2', type: 'num', lv: 1, q: R`$\phi(x)=\mathrm{ELU}(x)+1$을 $x=(-1,0,2)$에 성분마다 적용한 결과의 성분 합은? (식으로 입력해도 됩니다)`, ans: '4+e^(-1)', ansTex: R`e^{-1}+1+3\approx4.368`,
        sol: R`$\phi(-1)=e^{-1}\approx0.368$, $\phi(0)=0+1=1$, $\phi(2)=3$이므로 합은 $4+e^{-1}\approx4.368$.` },
      { sec: '22.2', type: 'num', lv: 2, q: R`$N=4096$, $r=d_v=64$일 때 소프트맥스 어텐션의 $AV$ 곱셈 수 $N^2d_v$는 선형 어텐션에서 $S$를 만드는 곱셈 수 $Nrd_v$의 몇 배인가?`, ans: '64', ansTex: R`N/r=64`,
        sol: R`$\frac{N^2d_v}{Nrd_v}=\frac Nr=\frac{4096}{64}=64$배입니다. $N$이 커질수록 비율도 커집니다.` },
      { sec: '22.2', type: 'open', lv: 3, proof: true, quiz: true, q: R`유사도를 $\mathrm{sim}(\mathbf q,\mathbf k)=\phi(\mathbf q)^T\phi(\mathbf k)$ ($\phi:\mathbb R^D\to\mathbb R^r$, 성분이 양수)로 바꾼 어텐션 $\tilde{\mathbf v}_i=\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j/\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)$에 대해 (1) $S=\sum_j\phi(\mathbf k_j)\mathbf v_j^T$, $Z=\sum_j\phi(\mathbf k_j)$로 $\tilde{\mathbf v}_i=S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$임을 보이시오. (2) 모든 $i$의 출력을 구하는 비용이 $O(Nrd_v)$이고 $N\times N$ 행렬이 필요 없음을 보이시오. (3) 정규화 전의 유사도 행렬의 계수가 $r$ 이하임을 보이시오.`,
        sol: R`**(1)** 분자를 행벡터로 쓰면 $\sum_j\phi(\mathbf q_i)^T\phi(\mathbf k_j)\mathbf v_j^T=\phi(\mathbf q_i)^T\sum_j\phi(\mathbf k_j)\mathbf v_j^T=\phi(\mathbf q_i)^TS$ (스칼라 $\phi(\mathbf q_i)^T\phi(\mathbf k_j)$의 결합법칙과 $\phi(\mathbf q_i)$가 $j$와 무관함). 분모도 같은 방식으로 $\phi(\mathbf q_i)^TZ$. 전치하면 $\tilde{\mathbf v}_i=S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$.
**(2)** $S$는 $r\times d_v$ 외적 $N$개의 합이라 $Nrd_v$번, $Z$는 $Nr$번. 질의마다 $S^T\phi(\mathbf q_i)$가 $rd_v$번, $\phi(\mathbf q_i)^TZ$가 $r$번이라 $N$개에 $N(rd_v+r)$번. 합이 $O(Nrd_v)$이고 저장하는 것은 $S$, $Z$뿐($O(rd_v)$)입니다.
**(3)** 유사도 행렬은 $\phi(Q)\phi(K)^T$이고 $\phi(Q),\phi(K)\in\mathbb R^{N\times r}$이므로 $\mathrm{rank}\le\min(\mathrm{rank}\,\phi(Q),\mathrm{rank}\,\phi(K))\le r$.`,
        rubric: R`- (1) $\phi(\mathbf q_i)$를 합 밖으로 꺼내 $S$, $Z$로 쓰기 — 4점
- (2) $S$, $Z$, 출력 각각의 곱셈 수와 $O(N)$ 결론 — 4점
- (3) 곱의 계수 부등식 — 2점` },
      { sec: '22.2', type: 'open', lv: 3, proof: true, q: R`언어 모델처럼 질의 $i$가 $j\le i$인 키만 보는 선형 어텐션 $\tilde{\mathbf v}_i=\sum_{j\le i}\phi(\mathbf q_i)^T\phi(\mathbf k_j)\mathbf v_j/\sum_{j\le i}\phi(\mathbf q_i)^T\phi(\mathbf k_j)$에서 (1) $S_i=S_{i-1}+\phi(\mathbf k_i)\mathbf v_i^T$, $Z_i=Z_{i-1}+\phi(\mathbf k_i)$ ($S_0=0$, $Z_0=\mathbf 0$)로 $\tilde{\mathbf v}_i=S_i^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ_i$임을 보이시오. (2) 토큰을 하나씩 생성할 때 한 걸음의 비용이 $i$와 무관함을 보이고, 소프트맥스 어텐션의 한 걸음 비용과 비교하시오.`,
        sol: R`**(1)** 귀납으로 $S_i=\sum_{j\le i}\phi(\mathbf k_j)\mathbf v_j^T$, $Z_i=\sum_{j\le i}\phi(\mathbf k_j)$이고, 22.2절과 같이 $\phi(\mathbf q_i)^T$를 합 밖으로 꺼내면 식이 나옵니다.
**(2)** 걸음 $i$에서 $S_i$ 갱신이 $rd_v$번, $Z_i$ 갱신이 $r$번, 출력이 $rd_v+r$번이라 $O(rd_v)$로 $i$와 무관합니다. 소프트맥스 어텐션은 새 질의가 지금까지의 키 $i$개와 모두 점수를 계산해야 하므로 한 걸음이 $O(iD)$이고 키와 값을 모두 저장해야 합니다. 선형 어텐션은 상태 $(S_i,Z_i)$만 들고 가는 RNN과 같습니다.` },
      { sec: '22.3', type: 'mc', lv: 1, q: R`트랜스포머의 LayerNorm이 평균과 분산을 구하는 묶음은?`,
        choices: [R`같은 특징 성분을 배치의 모든 토큰에서 모은 것`, R`토큰 하나의 모든 특징 성분`, R`문장 하나의 모든 토큰과 특징`, R`배치 전체의 모든 값`], ans: 1,
        sol: R`트랜스포머의 LN은 토큰 하나의 $C$(또는 $d$)개 특징에서 $\mu$, $\sigma^2$를 구합니다(필기의 ③). 첫째는 BN에 해당합니다.` },
      { sec: '22.3', type: 'num', lv: 2, q: R`필기의 텐서($x^{(1)}$: 채널 1 $\{1,3\}$, 채널 2 $\{5,7\}$, $x^{(2)}$: 채널 1 $\{9,11\}$, 채널 2 $\{13,15\}$)에 BN을 적용할 때($\varepsilon=0$, $\gamma=1$, $\beta=0$) 값 $11$은 얼마가 되는가? (식으로 입력해도 됩니다)`, ans: '5/sqrt(17)', ansTex: R`\frac{11-6}{\sqrt{17}}\approx1.213`,
        sol: R`$11$은 채널 1에 있으므로 $\mu_1=6$, $\sigma_1^2=17$로 $(11-6)/\sqrt{17}=5/\sqrt{17}\approx1.213$.` },
      { sec: '22.3', type: 'num', lv: 2, q: R`같은 텐서에 CNN 방식의 LN(샘플 하나의 모든 채널과 위치)을 적용할 때 값 $9$는 얼마가 되는가? (식으로 입력해도 됩니다)`, ans: '-3/sqrt(5)', ansTex: R`\frac{9-12}{\sqrt5}\approx-1.342`,
        sol: R`$9$는 이미지 2에 있고 묶음 $\{9,11,13,15\}$의 $\mu=12$, $\sigma^2=\frac{9+1+1+9}4=5$이므로 $-3/\sqrt5\approx-1.342$.` },
      { sec: '22.3', type: 'num', lv: 2, q: R`특징이 세 개인 토큰 $\mathbf h=(1,2,6)$에 트랜스포머의 LN을 적용할 때($\varepsilon=0$, $\gamma=1$, $\beta=0$) 첫 성분은? (식으로 입력해도 됩니다)`, ans: '-2/sqrt(14/3)', ansTex: R`-2\big/\sqrt{14/3}\approx-0.926`,
        sol: R`$\mu=3$, 편차 $(-2,-1,3)$, $\sigma^2=\frac{4+1+9}3=\frac{14}3$이므로 첫 성분은 $-2/\sqrt{14/3}\approx-0.926$.` },
      { sec: '22.3', type: 'open', lv: 3, proof: true, quiz: true, q: R`$B=2$, $C=2$, $H=1$, $W=2$ 텐서 $x^{(1)}$: 채널 1 $(a,b)$, 채널 2 $(c,d)$, $x^{(2)}$: 채널 1 $(e,f)$, 채널 2 $(g,h)$를 생각하자($\varepsilon=0$, $\gamma=1$, $\beta=0$). (1) BN, CNN의 LN, 트랜스포머의 LN이 각각 어떤 칸을 한 묶음으로 쓰는지 적고, 묶음마다 정규화된 값의 평균이 $0$, 분산이 $1$임을 보이시오. (2) 트랜스포머의 LN에서 특징이 두 개인 토큰 $(u,v)$ ($u\ne v$)는 늘 $(-1,1)$ 또는 $(1,-1)$이 됨을 보이시오. (3) BN에서 $x^{(1)}$의 정규화된 값이 $x^{(2)}$의 값에 의존함을 보이고, LN은 그렇지 않음을 설명하시오.`,
        sol: R`**(1)** BN: 채널마다 $\{a,b,e,f\}$와 $\{c,d,g,h\}$. CNN의 LN: 샘플마다 $\{a,b,c,d\}$와 $\{e,f,g,h\}$. 트랜스포머의 LN: 토큰(위치)마다 $(a,c)$, $(b,d)$, $(e,g)$, $(f,h)$. 묶음 $\{x_1,\dots,x_n\}$의 $\mu$, $\sigma^2$로 $y_k=(x_k-\mu)/\sigma$이면 $\frac1n\sum y_k=\frac{1}{\sigma}(\frac1n\sum x_k-\mu)=0$, $\frac1n\sum y_k^2=\frac{1}{\sigma^2}\cdot\frac1n\sum(x_k-\mu)^2=1$.
**(2)** $\mu=\frac{u+v}2$, 편차 $\pm\frac{u-v}2$, $\sigma^2=\frac{(u-v)^2}4$, $\sigma=\frac{\lvert u-v\rvert}2$이므로 $\big(\frac{u-v}{\lvert u-v\rvert},\frac{v-u}{\lvert u-v\rvert}\big)=\pm(1,-1)$.
**(3)** BN에서 $a$의 정규화 값은 $(a-\mu_1)/\sigma_1$이고 $\mu_1=\frac{a+b+e+f}4$가 $e$, $f$를 포함하므로 $x^{(2)}$를 바꾸면 값이 달라집니다. LN의 묶음은 샘플 하나(또는 토큰 하나) 안에만 있으므로 다른 샘플과 무관합니다.`,
        rubric: R`- (1) 세 묶음을 옳게 적기 — 3점, 평균 $0$·분산 $1$ 증명 — 2점
- (2) $\mu$, $\sigma$ 계산과 결론 — 2점
- (3) BN의 배치 의존과 LN의 독립성 — 3점` },
      { sec: '22.4', type: 'mc', lv: 1, q: R`ViT의 식 (4) $\mathbf y=\mathrm{LN}(\mathbf z_L^0)$에서 분류에 쓰는 것은?`,
        choices: [R`모든 패치 토큰 출력의 평균`, R`마지막 패치 토큰의 출력`, R`마지막 층에서 클래스 토큰 자리의 출력`, R`첫 층의 클래스 토큰`], ans: 2,
        sol: R`위 첨자 $0$은 첫 행, 곧 맨 앞에 붙인 클래스 토큰 자리이고 아래 첨자 $L$은 마지막 층입니다. 이 하나에 LN을 하고 헤드를 붙입니다.` },
      { sec: '22.4', type: 'num', lv: 1, q: R`$224\times224$ 이미지를 $P=16$인 ViT에 넣을 때 인코더에 들어가는 토큰 수(클래스 토큰 포함)는?`, ans: '197', ansTex: R`14^2+1=197`,
        sol: R`$224/16=14$이므로 패치 $196$개에 클래스 토큰 $1$개를 더해 $197$개입니다.` },
      { sec: '22.4', type: 'num', lv: 2, q: R`$P=16$, $C=3$, $D=768$일 때 패치 임베딩 행렬 $E$의 매개변수 수는(편향 없이)?`, ans: '589824', ansTex: R`(16^2\cdot3)\cdot768=589824`,
        sol: R`펼친 패치의 길이가 $P^2C=768$이므로 $E\in\mathbb R^{768\times768}$, $589{,}824$개입니다. 이 수는 이미지 크기와 무관합니다.` },
      { sec: '22.4', type: 'num', lv: 2, q: R`$384\times384$ 이미지, $P=16$, $D=768$일 때 위치 임베딩 $E_{pos}$의 매개변수 수는?`, ans: '443136', ansTex: R`(24^2+1)\cdot768=443136`,
        sol: R`패치가 $24^2=576$개, 클래스 토큰을 더해 $577$행이므로 $577\cdot768=443{,}136$개입니다.` },
      { sec: '22.4', type: 'open', lv: 3, proof: true, quiz: true, q: R`$H\times W\times C$ 이미지, 패치 크기 $P$ ($P$가 $H$, $W$를 나눔), 차원 $D$, 층 수 $L$인 ViT에서 (1) 식 (1)의 $\mathbf z_0$의 모양과 $E$, $E_{pos}$의 매개변수 수를 구하시오. (2) 식 (2)–(3)이 모양을 바꾸지 않아 모든 $\mathbf z_\ell$이 같은 모양임을 보이시오(MSA와 MLP는 토큰마다 $D$차원을 내놓는다). (3) 위치 임베딩이 없으면 패치의 순서를 바꿔도 $\mathbf y$가 변하지 않음을 설명하시오.`,
        sol: R`**(1)** 패치 $N=HW/P^2$개를 펼친 $\mathbf x_p^i\in\mathbb R^{1\times P^2C}$에 $E\in\mathbb R^{(P^2C)\times D}$를 곱하면 $1\times D$이고, 클래스 토큰을 붙여 $\mathbf z_0\in\mathbb R^{(N+1)\times D}$. $E$는 $P^2CD$개, $E_{pos}$는 $(N+1)D$개입니다.
**(2)** LN은 토큰마다 정규화해 모양을 유지하고, MSA와 MLP의 출력도 $(N+1)\times D$이므로 잔차의 덧셈이 정의되며 $\mathbf z'_\ell,\mathbf z_\ell\in\mathbb R^{(N+1)\times D}$입니다. 귀납으로 모든 층이 같습니다.
**(3)** 셀프 어텐션, LN, MLP는 토큰의 순서를 바꾸면 출력도 같은 순서로 바뀌는 순열 등변 연산입니다. 클래스 토큰을 고정하고 패치들만 섞는 순열 $P$에 대해 $\mathbf z_L$도 같은 순열로 섞이고, 첫 행인 $\mathbf z_L^0$은 변하지 않습니다. 따라서 $E_{pos}$ 없이는 패치의 배치를 구별할 수 없습니다.`,
        rubric: R`- (1) $N=HW/P^2$, $\mathbf z_0$의 모양, 두 매개변수 수 — 4점
- (2) 각 연산이 모양을 유지함과 귀납 — 3점
- (3) 순열 등변성과 클래스 토큰의 불변 — 3점` },
      { sec: '22.5', type: 'mc', lv: 1, q: R`$\mathrm{GELU}(x)=x\Phi(x)$에 대한 설명으로 옳은 것은?`,
        choices: [R`$x<0$에서 늘 $0$이다`, R`단조 증가 함수이다`, R`모든 점에서 미분 가능하고, 음수 쪽에 작은 음의 골이 있다`, R`$\mathrm{GELU}'(0)=1$이다`], ans: 2,
        sol: R`$\Phi$가 매끄러워 GELU도 매끄럽고, $x\approx-0.75$에서 최솟값 약 $-0.17$을 가지므로 단조가 아닙니다. $\mathrm{GELU}'(0)=\Phi(0)=\frac12$입니다.` },
      { sec: '22.5', type: 'num', lv: 2, q: R`$\Phi(1)\approx0.8413$일 때 $\mathrm{GELU}(-1)$은?`, ans: '-0.1587', ansTex: R`-\Phi(-1)=-(1-\Phi(1))\approx-0.1587`,
        sol: R`$\mathrm{GELU}(-1)=-1\cdot\Phi(-1)=-(1-0.8413)=-0.1587$.` },
      { sec: '22.5', type: 'num', lv: 2, q: R`$\mathrm{GELU}'(0)$은?`, ans: '1/2', ansTex: R`\Phi(0)+0\cdot\varphi(0)=\tfrac12`,
        sol: R`$\mathrm{GELU}'(x)=\Phi(x)+x\varphi(x)$이므로 $x=0$에서 $\Phi(0)=\frac12$.` },
      { sec: '22.5', type: 'mc', lv: 1, q: R`슬라이드 24–26의 ViT 대 CNN 비교로 옳은 것은?`,
        choices: [R`ViT는 이동 등변성이 구조로 보장되어 작은 자료에서도 CNN보다 낫다`, R`ViT는 귀납 편향이 약해 작은 자료에서는 BiT보다 낮고, JFT-300M 같은 큰 자료에서는 앞선다`, R`ViT는 고해상도 미세 조정에서 위치 임베딩을 다시 처음부터 학습해야 한다`, R`CNN의 한 층은 이미지 전체를 본다`], ans: 1,
        sol: R`ViT는 국소성·이동 등변성 같은 가정이 약해서 그만큼을 자료에서 배워야 합니다. 고해상도에서는 위치 임베딩을 2차원 보간하고, CNN의 한 층은 커널 크기만큼만 봅니다.` },
      { sec: '22.5', type: 'open', lv: 3, proof: true, q: R`$\mathrm{GELU}(x)=x\Phi(x)$에 대해 (1) $\mathrm{GELU}'(x)=\Phi(x)+x\varphi(x)$를 보이시오. (2) $\mathrm{GELU}(x)-\mathrm{GELU}(-x)=x$임을 보이시오. (3) $x\to\infty$에서 $\mathrm{GELU}(x)-x\to0$, $x\to-\infty$에서 $\mathrm{GELU}(x)\to0$임을 보이시오. (4) $\mathrm{GELU}'(-1)<0<\mathrm{GELU}'(-\tfrac12)$를 확인해 $(-1,-\tfrac12)$에 극솟값이 있음을 보이시오($\Phi(-1)\approx0.1587$, $\varphi(1)\approx0.2420$, $\Phi(-\tfrac12)\approx0.3085$, $\varphi(\tfrac12)\approx0.3521$).`,
        sol: R`**(1)** 곱의 미분과 $\Phi'=\varphi$로 $\Phi(x)+x\varphi(x)$.
**(2)** $\Phi(-x)=1-\Phi(x)$이므로 $\mathrm{GELU}(-x)=-x(1-\Phi(x))=-x+\mathrm{GELU}(x)$.
**(3)** $x\to\infty$: $\mathrm{GELU}(x)-x=-x(1-\Phi(x))$이고 꼬리 부등식 $1-\Phi(x)\le\varphi(x)/x$ ($x>0$)로 $\lvert\cdot\rvert\le\varphi(x)\to0$. $x\to-\infty$: $\lvert x\Phi(x)\rvert=\lvert x\rvert\Phi(-\lvert x\rvert)\le\varphi(x)\to0$.
**(4)** $\mathrm{GELU}'(-1)=0.1587-0.2420=-0.0833<0$, $\mathrm{GELU}'(-\frac12)=0.3085-0.5\cdot0.3521=0.1325>0$. 도함수가 연속이므로 사이에 $0$이 되는 점이 있고 부호가 $-$에서 $+$로 바뀌므로 극솟값입니다(수치로는 $x\approx-0.752$, 값 $\approx-0.170$).` },
      { sec: '22.6', type: 'num', lv: 1, q: R`$3\times4$ 행렬과 $4\times5$ 행렬을 곱할 때 필요한 곱셈 수는?`, ans: '60', ansTex: R`mnk=3\cdot5\cdot4=60`,
        sol: R`결과가 $3\times5=15$칸이고 칸마다 곱셈 $4$번이므로 $60$번입니다(덧셈은 칸마다 $3$번, 모두 $45$번).` },
      { sec: '22.6', type: 'num', lv: 2, q: R`$N=3136$, $C=96$일 때 전역 셀프 어텐션 한 층의 곱셈 수 $4NC^2+2N^2C$는? (식으로 입력해도 됩니다)`, ans: '4*3136*96^2+2*3136^2*96', ansTex: R`115605504+1888223232=2003828736`,
        sol: R`$4NC^2=115{,}605{,}504$, $2N^2C=1{,}888{,}223{,}232$이므로 합은 $2{,}003{,}828{,}736\approx2.0\times10^9$입니다.` },
      { sec: '22.6', type: 'num', lv: 2, q: R`$C=96$일 때 셀프 어텐션의 두 항 $4NC^2$와 $2N^2C$가 같아지는 토큰 수 $N$은?`, ans: '192', ansTex: R`N=2C=192`,
        sol: R`$2N^2C=4NC^2\iff N=2C=192$. 토큰이 이보다 많으면 어텐션 항이, 적으면 투영 항이 더 큽니다.` },
      { sec: '22.6', type: 'open', lv: 3, proof: true, quiz: true, q: R`토큰 $N$개, 차원 $C$인 셀프 어텐션 한 층($Q=XW_Q$, $K=XW_K$, $V=XW_V$, $\mathrm{softmax}(QK^T/\sqrt C)V$, 출력 투영 $W_O$, 모든 $W\in\mathbb R^{C\times C}$)에 대해 (1) $A\in\mathbb R^{m\times k}$, $B\in\mathbb R^{k\times n}$의 곱이 곱셈 $mnk$번임을 보이시오. (2) 이를 이용해 한 층의 곱셈 수가 $4NC^2+2N^2C$임을 보이시오(소프트맥스와 나눗셈은 무시). (3) 헤드를 $h$개로 나눠($C/h$차원씩) 계산해도 이 수가 같음을 보이시오.`,
        sol: R`**(1)** $Y_{ij}=\sum_{l=1}^kA_{il}B_{lj}$는 곱셈 $k$번이고 $(i,j)$가 $mn$개이므로 $mnk$번.
**(2)** $Q$, $K$, $V$는 각각 $(N\times C)(C\times C)$라 $NC^2$씩, 합 $3NC^2$. $QK^T$는 $(N\times C)(C\times N)$라 $N^2C$. $AV$는 $(N\times N)(N\times C)$라 $N^2C$. 출력 투영 $NC^2$. 모두 더해 $4NC^2+2N^2C$.
**(3)** 헤드마다 $Q_hK_h^T$가 $(N\times\frac Ch)(\frac Ch\times N)$라 $N^2C/h$, $A_hV_h$도 $N^2C/h$이고, $h$개를 더하면 $2N^2C$. 투영은 $C\times C$ 행렬을 헤드별 열로 나눈 것뿐이라 $4NC^2$ 그대로입니다.`,
        rubric: R`- (1) 칸 수 $mn$과 칸마다 $k$번 — 2점
- (2) 네 투영과 두 어텐션 곱의 모양과 곱셈 수 — 6점
- (3) 헤드별 합이 같음 — 2점` },
      { sec: '22.7', type: 'num', lv: 1, q: R`$h=w=56$의 특성 지도를 $7\times7$ 창으로 나누면 창의 수는?`, ans: '64', ansTex: R`3136/49=64`,
        sol: R`$N=3136$, 창 하나에 $49$개이므로 $3136/49=64$개($8\times8$)입니다.` },
      { sec: '22.7', type: 'num', lv: 2, q: R`$N=3136$, $M=7$, $C=96$일 때 윈도우 어텐션의 어텐션 항 $2NM^2C$는?`, ans: '29503488', ansTex: R`2\cdot3136\cdot49\cdot96=29503488`,
        sol: R`$2\cdot3136\cdot49\cdot96=29{,}503{,}488$. 전역 어텐션의 $2N^2C=1{,}888{,}223{,}232$보다 $64$배 작습니다.` },
      { sec: '22.7', type: 'num', lv: 2, q: R`Swin의 둘째 단계($28\times28$, $C=192$, $M=7$)에서 W-MSA 한 층의 곱셈 수 $4NC^2+2NM^2C$는? (식으로 입력해도 됩니다)`, ans: '4*784*192^2+2*784*49*192', ansTex: R`115605504+14751744=130357248`,
        sol: R`$N=784$. $4NC^2=4\cdot784\cdot36864=115{,}605{,}504$로 첫 단계와 같고(토큰이 $\frac14$, $C^2$이 $4$배), $2NM^2C=14{,}751{,}744$. 합은 $130{,}357{,}248$입니다.` },
      { sec: '22.7', type: 'open', lv: 3, proof: true, quiz: true, q: R`토큰 $N=hw$개, 차원 $C$인 특성 지도를 $M\times M$ 창으로 나누고($M$이 $h$, $w$를 나눔) 창 안에서만 셀프 어텐션하는 W-MSA에 대해 (1) 창의 수와 창 하나의 어텐션 곱셈 수를 구해 어텐션 항이 $2NM^2C$임을 보이시오. (2) 투영까지 포함한 비용 $4NC^2+2NM^2C$가 $M$, $C$를 고정할 때 $O(N)$임을 보이고, 전역 어텐션과의 어텐션 항의 비율이 $N/M^2$임을 보이시오. (3) $h=w=56$, $M=7$, $C=96$에서 두 비용을 계산하시오.`,
        sol: R`**(1)** 창은 $\frac hM\cdot\frac wM=N/M^2$개이고 창 하나에 토큰 $M^2$개. 창 안의 $QK^T$는 $(M^2\times C)(C\times M^2)$라 $M^4C$, $AV$도 $M^4C$로 창마다 $2M^4C$. 곱하면 $\frac N{M^2}\cdot2M^4C=2NM^2C$.
**(2)** 투영은 토큰마다 같으므로 $4NC^2$. 합 $4NC^2+2NM^2C=N(4C^2+2M^2C)$이고 괄호가 $N$과 무관하므로 $O(N)$. 비율은 $\frac{2N^2C}{2NM^2C}=\frac N{M^2}$.
**(3)** $N=3136$: 전역 $4NC^2+2N^2C=115{,}605{,}504+1{,}888{,}223{,}232=2{,}003{,}828{,}736$, 윈도우 $115{,}605{,}504+29{,}503{,}488=145{,}108{,}992$. 어텐션 항의 비율은 $64$, 전체 비율은 약 $13.8$입니다.`,
        rubric: R`- (1) 창의 수와 창마다 $2M^4C$, 곱 $2NM^2C$ — 4점
- (2) $O(N)$ 논증과 비율 $N/M^2$ — 3점
- (3) 수치 계산 — 3점` },
    ],
  });
})();
