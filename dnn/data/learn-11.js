/* 개념 정리 — 11 가중치 초기화 (4주차 월요일(2) 슬라이드 16–26 필기, 4주차 수요일(1) 필기: He 초기화 유도).
   “신호의 크기를 층마다 보존하라”는 한 원칙으로 Xavier와 He를 모두 유도합니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 11,
    summary: R`학습은 가중치의 초깃값에서 출발합니다. 너무 작게 잡으면 층을 지날수록 신호가 0으로 줄어 기울기가 사라지고, 너무 크게 잡으면 tanh가 포화해 역시 기울기가 사라집니다. 해결책은 **층마다 신호의 크기(분산 또는 2차 모멘트)가 보존되도록** 가중치의 분산을 고르는 것입니다. 독립·평균 0 가정에서 $\Var(\sum w_ix_i)=D_{in}\sigma^2v$이므로 $\sigma^2=1/D_{in}$ (Xavier). ReLU는 음수 절반을 잘라 2차 모멘트를 절반으로 만들므로 $\sigma^2=2/D_{in}$ (He). 수업에서는 $\E[\max(0,z)]$와 $\E[\max(0,z)^2]$을 적분으로 구해 He 초기화를 유도했습니다. 마지막으로 모든 가중치를 같게 두면 안 되는 이유(대칭 깨기)를 봅니다.`,
    goals: [
      R`너무 작은·너무 큰 초기화에서 학습이 멈추는 이유를 순방향 활성화와 역방향 기울기로 설명할 수 있다`,
      R`독립·평균 0 가정에서 $\Var(\sum w_ix_i)=D_{in}\sigma^2v$를 유도하고 Xavier 초기화를 얻을 수 있다`,
      R`$z\sim\N(0,q)$일 때 $\E[\max(0,z)]=\sqrt{q/2\pi}$, $\E[\max(0,z)^2]=q/2$를 적분으로 계산할 수 있다`,
      R`2차 모멘트 보존 조건에서 He 초기화 $\sigma^2=2/D_{in}$을 유도하고 가정을 정확히 말할 수 있다`,
      R`역방향 분산 보존과 Glorot의 절충식 $2/(D_{in}+D_{out})$을 설명할 수 있다`,
      R`같은 값으로 초기화하면 뉴런들이 영원히 같아지는 이유(대칭)를 증명할 수 있다`,
    ],
    sections: [
      { k: '11.1', src: 'W4 월(2) · 슬라이드 16–21', title: '너무 작거나 너무 큰 초기화', body: R`
:::idea 쉽게 말하면
귓속말 전달 놀이를 생각하세요. 사람마다 목소리를 조금씩 **줄여서** 전하면 열 번째 사람에게는 아무것도 안 들리고(신호 소멸), 조금씩 **키워서** 전하면 고함이 되어 뜻을 알 수 없습니다(포화). 층마다 신호가 가중치와 곱해지므로 가중치의 크기가 이 “음량 조절”이고, 잘 고르면 몇 층을 지나도 같은 음량을 유지합니다.
:::

실험: 은닉 4096개짜리 6층 신경망, 입력 $x$=randn(16, 4096), 활성화 tanh.

**너무 작게** ($W=0.01\times$randn): 층별 활성화의 표준편차가 $0.49,\,0.29,\,0.18,\,0.11,\,0.07,\,0.05$로 줄어 **위쪽 층의 활성화가 거의 0**입니다. 가중치 기울기는
$$\frac{\partial L}{\partial W}=\frac{\partial L}{\partial h}\,z^T$$
이고 입력 활성화 $z\approx0$이므로 $\frac{\partial L}{\partial W}\approx0$ → **학습 없음**.

**너무 크게** ($W=0.05\times$randn): 표준편차가 $0.87,\,0.85,\dots$로 유지되지만 활성화가 $\pm1$에 몰려 **tanh가 포화**됩니다. 역방향 기울기
$$\frac{\partial L}{\partial z}=\frac{\partial L}{\partial h}\frac{\partial h}{\partial z}=\big(\sigma'(\cdot)\,W^T\big)\frac{\partial L}{\partial h}$$
에서 $\sigma'\approx0$이므로 → **학습 없음**.

**Xavier** ($W=$randn$/\sqrt{D_{in}}$): 표준편차 $0.63,\,0.49,\,0.41,\,0.36,\,0.32,\,0.30$으로 모든 층에서 적당히 퍼져 있습니다.

:::fig initstd
:::

**왜 0.01이면 줄고 0.05면 포화하나.** 한 뉴런의 입력 합 $\sum_{i=1}^{4096}w_ix_i$의 표준편차는 대략 $\sqrt{4096}\times(\text{가중치 표준편차})\times(\text{입력 크기})=64\times0.01\times(\cdot)=0.64\times(\cdot)$입니다. 매 층 약 0.64배(tanh가 조금 더 줄임)로 줄어듭니다. $0.05$이면 $64\times0.05=3.2$배로 커져, 입력 합이 $\pm3$ 근처가 되고 $\tanh$가 $\pm1$에 달라붙습니다. Xavier는 $1/\sqrt{4096}=1/64$이라 정확히 1배 — 다음 절이 이 계산을 정확히 합니다.

:::warn 두 가지 “학습 없음”은 원인이 다르다
작은 초기화는 **순방향 신호**($z$)가 0이 되어 가중치 기울기 $\delta z^T$가 0, 큰 초기화는 **역방향 신호**에서 $\sigma'$가 0이 되어 기울기가 끊깁니다. 두 식($\partial L/\partial W=\delta z^T$, $\delta_\ell=\sigma'\odot W^T\delta_{\ell+1}$)을 구별해서 쓰세요.
:::
` },
      { k: '11.2', src: 'W4 월(2) · 슬라이드 22–23 필기', title: 'Xavier(Glorot) 초기화', body: R`
:::idea 쉽게 말하면
뉴런 하나는 입력 $D_{in}$개에 가중치를 곱해 더합니다. 서로 독립인 무작위 값 $D_{in}$개를 더하면 분산이 $D_{in}$배가 되므로, 가중치의 분산을 $1/D_{in}$로 두면 정확히 상쇄되어 출력의 분산이 입력과 같아집니다.
:::

:::key Xavier 초기화
$y=\sum_{i=1}^{D_{in}}w_ix_i$, 가정: $w_i$ i.i.d.·$x_i$ i.i.d., $w$와 $x$는 독립, $\E[w_i]=0$, $\Var(w_i)=\sigma^2$, $\E[x_i]=0$, $\Var(x_i)=v$. 그러면
$$\Var(y)=D_{in}\,\sigma^2\,v.$$
$\Var(y)=\Var(x_i)=v$를 요구하면 $\sigma^2=\dfrac1{D_{in}}$, 즉 $W=\text{randn}(D_{in},D_{out})/\sqrt{D_{in}}$.
:::

:::hand 수업 필기 — 분산 계산
$\Var(y)=\E[y^2]-(\E[y])^2$, $\E[y]=\sum_i\E[w_i]\E[x_i]=0$.
$$\E[y^2]=\E\Big[\Big(\sum_iw_ix_i\Big)^2\Big]=\sum_i\E[w_i^2x_i^2]+\sum_{i\ne k}\E[w_iw_kx_ix_k]$$
$$=\sum_i\E[w_i^2]\E[x_i^2]+\sum_{i\ne k}\underbrace{\E[w_i]}_{0}\E[w_k]\E[x_ix_k]=\sum_{i=1}^{D_{in}}\sigma^2\,\E[x_i^2].$$
$\E[x_i^2]=\Var(x_i)=v$ ($\E x_i=0$)이므로 $\Var(y)=D_{in}\sigma^2v$. $\Var(y)=v$로 두면 $D_{in}\sigma^2v=v\Rightarrow\sigma^2=1/D_{in}$.
:::

**각 등호의 근거.** (1) 제곱을 전개하면 같은 첨자 항 $w_i^2x_i^2$과 다른 첨자 항 $w_iw_kx_ix_k$가 나옵니다. (2) $w$와 $x$가 독립이라 $\E[w_i^2x_i^2]=\E[w_i^2]\E[x_i^2]$. (3) $i\ne k$이면 $w_i$가 나머지와 독립이라 $\E[w_i]=0$을 뽑아낼 수 있어 교차항이 모두 0. (4) $\E[w_i^2]=\Var(w_i)+(\E w_i)^2=\sigma^2$.

:::ex 예제 1 — 숫자로
$D_{in}=100$, $\Var(w_i)=0.02$, $\Var(x_i)=1$이면 $\Var(y)=100\times0.02\times1=2$ — 한 층 지날 때마다 분산이 2배. 6층이면 $2^6=64$배. Xavier라면 $\Var(w_i)=0.01$, 표준편차 $0.1$.
:::

- 원래 Glorot & Bengio(2010)는 역방향에서도 분산을 보존하려고($\sigma^2=1/D_{out}$) 두 조건의 절충 $\sigma^2=\dfrac2{D_{in}+D_{out}}$을 제안했습니다. 의료 인공지능 과목(Bishop)의 표가 이 식입니다[[@med:ch07:7.2b|Xavier $2/(n_{in}+n_{out})$, He $2/n_{in}$.]].
- 이 유도는 입력이 **평균 0**이라는 가정을 씁니다. tanh처럼 0 중심인 활성화에는 맞지만 ReLU에는 맞지 않습니다.

**역방향 조건의 유도.** 역전파에서 $\frac{\partial L}{\partial x_i}=\sum_{j=1}^{D_{out}}W_{ji}\delta_j$ (9.5절의 $W^T\delta$)이므로 같은 계산으로 $\Var\big(\frac{\partial L}{\partial x_i}\big)=D_{out}\sigma^2\Var(\delta_j)$. 기울기의 분산을 보존하려면 $\sigma^2=1/D_{out}$. 입력·출력 폭이 다르면 두 조건을 동시에 만족할 수 없어 조화평균 $\frac2{D_{in}+D_{out}}$으로 절충합니다. 균등분포 $U(-a,a)$ (분산 $a^2/3$)로 뽑으면 $a=\sqrt{6/(D_{in}+D_{out})}$.

### 더 깊이: 선형 근사가 맞는 이유

tanh는 0 근처에서 $\tanh z\approx z$라 입력 분산이 적당하면 층을 “거의 선형”으로 볼 수 있고, 위 계산이 활성화까지 포함해 근사적으로 성립합니다. 그래도 tanh는 $\lvert z\rvert$가 크면 $\lvert z\rvert$보다 작은 값을 내므로 Xavier에서도 층마다 조금씩 줄어듭니다(슬라이드의 $0.63\to0.30$). 입력 폭 $D_{in}$만 쓰는 $1/D_{in}$을 LeCun 초기화라고도 부릅니다.
` },
      { k: '11.3', src: 'W4 월(2) · 슬라이드 24–25, W4 수(1) 필기', title: 'ReLU와 He(Kaiming) 초기화', body: R`
:::idea 쉽게 말하면
ReLU는 음수를 0으로 버립니다. 입력 합이 0을 중심으로 대칭이면 **절반**이 버려지므로, 신호의 에너지(2차 모멘트)가 매 층 절반이 됩니다. 그래서 가중치 분산을 Xavier의 **2배**로 키워 미리 보상합니다.
:::

ReLU 신경망에 Xavier를 쓰면 층을 지날수록 활성화가 다시 0으로 무너집니다(슬라이드: 평균·표준편차가 $0.39/0.58$에서 $0.07/0.10$까지). ReLU가 음수 절반을 0으로 잘라 **2차 모멘트가 매 층 절반**이 되기 때문입니다. (Xavier는 0 중심 활성화를 가정했는데 ReLU는 0 중심이 아닙니다.)

:::key He 초기화
$z=\sum_{i=1}^{D_{in}}w_ix_i$, $\E[w_i]=0$, $\Var(w_i)=\sigma^2$, $h=\max(0,z)$, $z\sim\N(0,q)$로 근사하면
$$\E[h]=\sqrt{\frac q{2\pi}},\qquad \E[h^2]=\frac q2,\qquad q=\Var(z)=D_{in}\sigma^2v.$$
2차 모멘트를 층마다 보존하려면 $\E[h^2]=\E[x^2]=v$, 즉 $\tfrac12D_{in}\sigma^2v=v$:
$$\sigma^2=\frac2{D_{in}},\qquad \sigma=\sqrt{\frac2{D_{in}}}.$$
:::

:::hand 수업 필기 — He 초기화 유도
$\Var(z)=\sum_{i}\Var(w_ix_i)$ (독립). $\Var(x_iw_i)=\E[(w_ix_i)^2]-(\E[w_ix_i])^2$이고 $\E[w_ix_i]=\E[w_i]\E[x_i]=0$, $\E[(w_ix_i)^2]=\E[w_i^2]\E[x_i^2]=\sigma^2v$. 따라서 $\Var(z)=D_{in}\sigma^2v=:q$.
$h=\varphi(z)=\max(0,z)$, $z\sim\N(0,q)$로 두면
$$\E[h]=\int_0^\infty z\frac1{\sqrt{2\pi q}}e^{-z^2/2q}dz=\frac{\sqrt q}{\sqrt{2\pi}},$$
$$\E[h^2]=\int_0^\infty z^2\frac1{\sqrt{2\pi q}}e^{-z^2/2q}dz=\frac12q\quad(\text{D.I.Y.})$$
신호 전파에서는 2차 모멘트 $v=\E[x_i^2]$를 추적합니다. ReLU 전 $\E[z^2]=D_{in}\sigma^2v$, ReLU 후 $\E[h^2]=\frac12\E[z^2]=\frac12D_{in}\sigma^2v$. 보존 조건 $\E[h^2]=\E[x^2]=v$에서 $\frac12D_{in}\sigma^2=1$, $\sigma^2=2/D_{in}$.
:::

**D.I.Y. 적분.** 치환 $u=z^2/2q$ ($du=z\,dz/q$)로
$$\int_0^\infty z\,e^{-z^2/2q}dz=q\int_0^\infty e^{-u}du=q\ \Rightarrow\ \E[h]=\frac{q}{\sqrt{2\pi q}}=\sqrt{\frac q{2\pi}}.$$
$\E[h^2]$은 대칭성으로 바로 나옵니다: $z^2e^{-z^2/2q}$는 우함수이므로 $\int_0^\infty=\frac12\int_{-\infty}^\infty$, 즉 $\E[h^2]=\frac12\E[z^2]=\frac q2$. (부분적분으로도: $\int_0^\infty z\cdot ze^{-z^2/2q}dz=\big[-qze^{-z^2/2q}\big]_0^\infty+q\int_0^\infty e^{-z^2/2q}dz=q\cdot\frac{\sqrt{2\pi q}}2$.)

:::note 가정을 정확히 하면
ReLU 층의 입력 $x_i=h\ge0$은 평균이 0이 아니므로 “$\Var(x_i)=v$” 대신 필기처럼 **2차 모멘트** $v=\E[x_i^2]$로 써야 합니다. 이때도 $\E[w_i]=0$과 독립성만 있으면 $\E[z]=0$, $\E[z^2]=D_{in}\sigma^2\E[x^2]$가 성립합니다. 또 $\E[h^2]=\frac12\E[z^2]$에는 정규분포가 필요 없고 $z$가 0에 대해 **대칭**이기만 하면 됩니다($w_i$의 분포가 대칭이면 자동). 정규분포 가정은 $\E[h]$ 값을 구할 때만 씁니다.
:::

슬라이드 결과: std $=\sqrt{2/D_{in}}$이면 모든 층의 평균 $\approx0.55$, 표준편차 $\approx0.81$로 “딱 좋게” 유지됩니다. (He et al., ICCV 2015)

:::ex 예제 2 — 숫자로 확인
$z\sim\N(0,4)$ ($q=4$)일 때 $h=\max(0,z)$의 평균, 2차 모멘트, 분산은?
---
$\E h=\sqrt{4/2\pi}=\frac2{\sqrt{2\pi}}\approx0.798$, $\E h^2=4/2=2$, $\Var h=2-0.798^2\approx1.363$. $\E h^2=2$는 $\E z^2=4$의 정확히 절반입니다.
:::

**평균이 0이 아닌 것의 의미.** ReLU 출력은 평균이 $\sqrt{q/2\pi}>0$입니다(슬라이드 실험에서 층별 평균 $\approx0.55$). 그래서 “분산”이 아니라 “2차 모멘트 $=$ 분산 $+$ 평균²”을 보존하는 것이 맞는 목표이고, 다음 층의 $z$는 가중치 평균이 0이라 다시 평균 0이 됩니다.
` },
      { k: '11.4', src: 'W4 월(2) · 슬라이드 26, 보충', title: '대칭 깨기와 초기화 연구', body: R`
:::idea 쉽게 말하면
쌍둥이에게 똑같은 교육을 똑같이 시키면 계속 똑같은 사람이 됩니다. 같은 층의 뉴런들이 처음에 똑같으면 같은 입력에서 같은 출력, 같은 기울기, 같은 갱신을 받아 **영원히 똑같습니다**. 뉴런을 100개 둬도 사실상 1개인 셈이라, 처음에 무작위로 다르게 만들어 “대칭을 깨야” 합니다.
:::

가중치를 **모두 같은 값**(예: 0)으로 두면 안 됩니다. 같은 층의 뉴런들이 같은 입력을 받으면 출력이 같고, 역전파로 받는 기울기도 같아 갱신 후에도 계속 같습니다. 뉴런을 여러 개 둔 의미가 사라지므로 **무작위** 초기화로 대칭을 깨야 합니다.

:::key 대칭 깨기
한 은닉층의 두 뉴런 $j,k$의 들어오는 가중치와 나가는 가중치가 처음에 같으면, (미니배치) 경사하강법의 모든 단계 후에도 같다.
:::

**증명의 핵심(귀납법).** 어떤 단계에서 들어오는 가중치 $W_{j,:}=W_{k,:}$, 편향 $b_j=b_k$, 나가는 가중치 $W'_{:,j}=W'_{:,k}$라 합시다. 그러면 모든 입력에서 $a_j=a_k$, $h_j=h_k$. 역전파에서 $\frac{\partial L}{\partial h_j}=\sum_mW'_{mj}\delta'_m=\frac{\partial L}{\partial h_k}$이고 $\delta_j=\sigma'(a_j)\frac{\partial L}{\partial h_j}=\delta_k$. 가중치 기울기 $\frac{\partial L}{\partial W_{j,:}}=\delta_jx^T=\frac{\partial L}{\partial W_{k,:}}$, 나가는 쪽 $\frac{\partial L}{\partial W'_{mj}}=\delta'_mh_j=\frac{\partial L}{\partial W'_{mk}}$. 같은 기울기로 같은 양만큼 갱신되므로 다음 단계에서도 같습니다.

:::ex 예제 3 — 모두 0으로 초기화하면
은닉층 ReLU, 모든 가중치와 편향을 0으로 두면 첫 갱신에서 무슨 일이 생기나?
---
모든 은닉 출력이 $\max(0,0)=0$이고 ReLU$'(0)=0$(관례)이라 은닉층의 $\delta$가 0, 은닉층 가중치의 기울기가 0입니다. 출력층 가중치의 기울기도 $\delta'h^T=0$ ($h=0$). 출력층 편향만 움직이고 나머지는 영원히 0 — 학습이 되지 않습니다. 0이 아닌 **같은** 값으로 두면 움직이긴 하지만 모든 은닉 뉴런이 똑같이 움직입니다.
:::

초기화 연구(슬라이드 26): Glorot & Bengio(2010), He et al.(2015), Saxe et al.(2013, 깊은 선형망의 정확한 동역학), Sussillo & Abbott(2014, 랜덤 워크 초기화). 배치 정규화(12단원)를 쓰면 초기화에 덜 민감해집니다.

### 더 깊이: 편향과 출력층

편향은 대칭 깨기와 무관하므로 보통 0으로 둡니다(가중치가 이미 무작위). 죽은 ReLU를 줄이려고 작은 양수(예: 0.01)를 쓰기도 합니다. 분류 출력층의 편향을 클래스 비율의 로그 오즈로 두면(예: 양성 1%이면 $\log(0.01/0.99)$) 첫 걸음부터 합리적인 확률을 내어 초기 손실이 크게 튀는 것을 막습니다. Saxe 등은 **직교 행렬**로 초기화하면 깊은 선형 신경망에서 모든 방향의 신호가 크기를 정확히 보존해(특잇값이 모두 1) 학습 시간이 깊이에 거의 무관해짐을 보였습니다.
` },
    ],
  });
})();
