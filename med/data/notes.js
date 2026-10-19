/* 요약 노트 — 의료 인공지능 전 범위(01–15단원)를 단원마다 한 쪽으로 줄인 시험 직전 노트.
   core/app.js의 요약 노트 페이지(#notes)가 그립니다. 세트 = 파트, 항목 = 단원. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.notes = EM.notes || [];
(function () {
  const R = String.raw;
  EM.notes.push(
    { id: 'all', mark: '0', title: '전 범위의 큰 그림', short: '큰 그림', meta: '교재 1·2·6·7·8·9·10·12장 · 15단원을 잇는 줄기',
      intro: R`
:::tip 이 노트를 쓰는 법
1. 단원마다 **한 문단 요약 → 핵심 공식 표 → 꼭 알아둘 것 → 자주 틀리는 것** 순서입니다. 공식은 표로만 보고, 유도가 기억나지 않으면 제목 아래 “개념 정리로” 링크를 따라가세요.
2. 표의 공식을 가리고 왼쪽 칸(개념)만 보고 식을 써 보는 것이 가장 빠른 점검입니다.
3. 단원 사이를 잇는 관계는 바로 아래 “다섯 파트를 잇는 한 줄기”에 모았습니다. 서술형은 대개 이 연결에서 나옵니다.
:::
`,
      problems: [
        { id: 'flow', label: '0', title: '다섯 파트를 잇는 한 줄기', where: '01–15단원', secs: [],
          body: R`
:::idea 한 문단 요약
의료 자료(01)를 모델 $y(\mathbf x,\mathbf w)$로 맞추면 오차함수와 과적합 문제가 생깁니다(02). 확률은 그 오차함수가 어디서 오는지 알려 줍니다. 가능도를 최대화하면 제곱오차·교차 엔트로피가, 사전분포를 더하면 규제가 나옵니다(03–06). 신경망은 이 확률 모델을 유연한 함수로 만든 것이고(07), 경사하강법·정규화·역전파로 학습하며(08–10), 규제·잔차·드롭아웃으로 일반화합니다(11–12). 마지막으로 자료의 구조를 모델에 넣습니다. 격자 자료에는 국소성과 이동 등변성을 넣은 CNN(13–14), 집합·서열 자료에는 입력마다 가중치를 계산하는 트랜스포머(15)입니다.
:::

### 단원을 가로지르는 관계

| 관계 | 핵심 | 단원 |
|---|---|---|
| 최소제곱 = 가우시안 최대가능도 | $-\ln p(\mathbf t\mid\mathbf w)=\frac1{2\sigma^2}\sum_n\{y(\mathbf x_n,\mathbf w)-t_n\}^2+$상수 | 02·04·07 |
| 최대가능도 = KL 최소화 | $\KL(p\Vert q_{\boldsymbol\theta})\simeq-\frac1N\sum_n\ln q(\mathbf x_n\mid\boldsymbol\theta)+$상수 | 05 |
| MAP = L2 규제 = 가중치 감쇠 | 사전 $\N(0,s^2)$ → $\frac\lambda2\lVert\mathbf w\rVert^2$, $\lambda=\sigma^2/s^2$ | 06·02·11 |
| 출력 활성화와 오차함수의 짝 | 선형+제곱, 시그모이드+BCE, 소프트맥스+CE → $\partial E_n/\partial a_k=y_k-t_k$ | 07·10 |
| 소프트맥스 | 다중 분류의 출력, 어텐션 가중치, 온도 표본 추출 | 07·15 |
| 정규화(normalization) | 입력·배치·층 정규화, 트랜스포머는 층 정규화 | 09·15 |
| 지름길 | 잔차 연결(9.5), U-net의 건너뛰는 연결, 트랜스포머의 add & norm | 12·14·15 |
| 귀납적 편향 | CNN: 국소성·등변성·풀링의 불변성 / ViT: 약함 → 자료가 더 필요 | 11·13·15 |
| 입력에 대한 미분 | 역전파를 가중치 대신 **입력**까지: Grad-CAM, FGSM, DeepDream, 스타일 전이 | 10·14 |
| 이산 vs 연속 출력 | 회귀는 평균을 내 흐려짐 → 분류·이산 토큰(VQ) | 07·15 |

### 숫자로 기억할 것

| 값 | 뜻 |
|---|---|
| $\sigma'(a)\le\frac14$ | 시그모이드를 많이 쌓으면 기울기 소실 |
| $2/n_{\text{in}}$, $2/(n_{\text{in}}+n_{\text{out}})$ | He, Xavier 초기화의 분산 |
| $\eta<2/\lambda_{\max}$ | 경사하강법이 발산하지 않을 조건 |
| $\eta/(1-\mu)$ | 모멘텀의 유효 학습률($\mu=0.9$면 10배) |
| $E_{\text{COM}}=\frac1ME_{\text{AV}}$ | 오차가 무상관인 위원회 |
| $(M^2C+1)C_{\text{OUT}}$ | 합성곱층의 모수(영상 크기와 무관) |
| $L(M-1)+1$ | $M\times M$ 합성곱 $L$층의 수용 영역 |
| IoU $>0.5$ | 맞은 검출의 흔한 기준 |
| $\sqrt{D_k}$, $4D^2$, $2DR$ | 어텐션 스케일, 멀티헤드 모수, LoRA 모수 |
` },
      ] },

    { id: 'A', mark: 'A', title: '도입', short: 'A', meta: '의료 데이터와 곡선 적합(교재 1장)',
      problems: [
        { id: 'u01', label: '01', title: '의료 데이터와 의료 인공지능', where: '도입 강의', secs: ['ch01:0.1'],
          body: R`
:::idea 한 문단 요약
의학은 자료 과학입니다. 생체신호는 시계열, 영상은 2D·3D 격자, 검사·EMR은 표와 텍스트이고, 자료의 모양이 쓸 모델을 정합니다. PACS로 쌓인 디지털 영상이 의료 AI의 재료이며, AI는 진단 보조·저선량 영상 복원 등으로 의사를 돕되 규제(EU AI법의 고위험 등급)와 환각 같은 한계가 있습니다.
:::

| 개념 | 식·내용 |
|---|---|
| 자료의 모양 | 생체신호 $\mathbb R^T$, 영상 $\mathbb R^{H\times W}$ 또는 $\mathbb R^{D\times H\times W}$, 4D $\mathbb R^{T\times D\times H\times W}$ |
| 연평균 성장률 | $V_n=V_0(1+r)^n$ (시장 2023년 약 158억 → 2030년 약 1,817억 달러, 약 42%) |
| 저선량과 잡음 | 포아송 계수 $\lambda$의 $\text{SNR}=\sqrt\lambda$; 선량 $1/10$ → SNR $\times1/\sqrt{10}\approx0.32$ |
| PACS | 영상의 획득 → 저장 → 조회, 원격판독 |
| EU AI법 | 수용 불가(금지) / 고위험(사람의 감독 의무, 의료 포함) |

- 저선량·저조영 영상을 AI로 복원하면 방사선량과 조영제를 줄여 환자의 위험을 낮춥니다.
- 파운데이션 모델·LLM의 과제는 환각, 도입의 기준은 비용 대비 효과입니다.
` },
        { id: 'u02', label: '02', title: '곡선 적합으로 보는 머신러닝', where: 'Bishop §1.2', secs: ['ch02:1.2a'],
          body: R`
:::idea 한 문단 요약
다항식 $y(x,\mathbf w)$를 자료에 맞추는 장난감 문제 하나에 머신러닝의 기본이 다 들어 있습니다: 모델, 오차함수, 최소화, 과적합, 규제, 검증 자료로 고르는 모델 선택.
:::

| 개념 | 식 |
|---|---|
| 다항식 모델 | $y(x,\mathbf w)=\sum_{j=0}^Mw_jx^j$ (모수에 대해 선형) |
| 제곱오차합 | $E(\mathbf w)=\frac12\sum_{n=1}^N\{y(x_n,\mathbf w)-t_n\}^2$ |
| RMS 오차 | $E_{\text{RMS}}=\sqrt{\frac1N\sum_n\{y(x_n,\mathbf w^\star)-t_n\}^2}$ |
| L2 규제 | $\tilde E(\mathbf w)=E(\mathbf w)+\frac\lambda2\lVert\mathbf w\rVert^2$ |

- 차수 $M$이 크면 훈련오차는 0에 가까워져도 시험오차가 커집니다(과적합, 계수가 매우 커짐).
- 자료를 늘리거나 규제 $\lambda$를 키우면 과적합이 줄어듭니다. $\lambda$·$M$은 **검증 자료**로 고르고, 자료가 적으면 교차검증을 씁니다.
- $N$으로 나누는 RMS는 크기가 다른 자료를 비교하게 하고, 제곱근은 목표값과 단위를 맞춥니다.
` },
      ] },

    { id: 'B', mark: 'B', title: '확률', short: 'B', meta: '교재 2장 · 03–06단원',
      problems: [
        { id: 'u03', label: '03', title: '확률의 규칙과 베이즈 정리', where: 'Bishop §2.1', secs: ['ch03:2.0'],
          body: R`
:::idea 한 문단 요약
확률의 모든 계산은 합의 규칙과 곱의 규칙 두 개로 됩니다. 둘을 합치면 베이즈 정리이고, 의료 선별검사에서는 유병률(사전확률)이 낮으면 양성이어도 실제 환자일 확률이 낮다는 결론이 나옵니다.
:::

| 개념 | 식 |
|---|---|
| 합의 규칙 | $p(X)=\sum_Yp(X,Y)$ |
| 곱의 규칙 | $p(X,Y)=p(Y\mid X)p(X)$, 독립이면 $p(X,Y)=p(X)p(Y)$ |
| 베이즈 정리 | $p(Y\mid X)=\dfrac{p(X\mid Y)p(Y)}{p(X)}$, $p(X)=\sum_Yp(X\mid Y)p(Y)$ |

- 사후확률 $p(Y\mid X)$, 가능도 $p(X\mid Y)$, 사전확률 $p(Y)$, 증거 $p(X)$(정규화 항).
- 선별검사 예(유병률 1%, 민감도 90%, 위양성 3%): $p(\text{암}\mid\text{양성})=\frac{90}{90+297}\approx0.23$.
- 불확실성은 인식적(자료 부족, 자료로 줄어듦)과 우연적(본질적 잡음, 더 나은 관측이 필요)으로 나뉩니다. 빈도주의는 장기 상대빈도, 베이지안은 믿음의 정도.

:::warn 자주 틀리는 것
$p(\text{양성}\mid\text{암})$(민감도)과 $p(\text{암}\mid\text{양성})$를 혼동하는 것. 둘을 잇는 것이 사전확률입니다.
:::
` },
        { id: 'u04', label: '04', title: '확률밀도와 가우시안 분포', where: 'Bishop §2.2–2.3', secs: ['ch04:2.2'],
          body: R`
:::idea 한 문단 요약
연속 변수는 밀도로 다루고, 가장 중요한 밀도는 가우시안입니다. 가우시안 자료의 최대가능도 해는 표본평균과 표본분산이며, 분산은 $N$으로 나눠 작게 추정하는 편향이 있습니다. 회귀에 가우시안 잡음을 두면 최대가능도가 곧 최소제곱입니다.
:::

| 개념 | 식 |
|---|---|
| 밀도와 CDF | $p(x\in(a,b))=\int_a^bp(x)dx$, $P'(x)=p(x)$ |
| 기댓값·분산 | $\Var[x]=\E[x^2]-\E[x]^2$, $\Cov[x,y]=\E[xy]-\E[x]\E[y]$ |
| 가우시안 | $\N(x\mid\mu,\sigma^2)=\frac1{(2\pi\sigma^2)^{1/2}}\exp\{-\frac1{2\sigma^2}(x-\mu)^2\}$, $\E[x^2]=\mu^2+\sigma^2$ |
| 최대가능도 | $\mu_{\text{ML}}=\frac1N\sum x_n$, $\sigma^2_{\text{ML}}=\frac1N\sum(x_n-\mu_{\text{ML}})^2$ |
| 편향 | $\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2$ → 불편 $\tilde\sigma^2=\frac1{N-1}\sum(x_n-\mu_{\text{ML}})^2$ |
| 선형회귀 | $\ln p(\mathbf t\mid\mathbf w,\sigma^2)=-\frac1{2\sigma^2}\sum\{y(x_n,\mathbf w)-t_n\}^2-\frac N2\ln\sigma^2-\frac N2\ln2\pi$ |

- 밀도의 값은 1을 넘을 수 있습니다(확률은 넓이).
- 편향은 평균을 자료로 추정해 자유도 하나를 쓰기 때문입니다. 참 평균을 알면 $N$으로 나눠도 불편입니다.
- 회귀에서 $\mathbf w$의 MLE ⇔ 제곱오차 최소화, 잡음 분산의 MLE = 평균제곱잔차.
` },
        { id: 'u05', label: '05', title: '밀도의 변환과 정보이론', where: 'Bishop §2.4–2.5', secs: ['ch05:2.4'],
          body: R`
:::idea 한 문단 요약
변수를 바꾸면 밀도는 야코비안만큼 늘거나 줄어듭니다. 정보량은 놀라움 $-\log p$, 엔트로피는 그 평균, KL 발산은 다른 분포를 썼을 때의 손해입니다. 최대가능도는 자료 분포와 모델의 KL을 줄이는 것과 같습니다.
:::

| 개념 | 식 |
|---|---|
| 밀도의 변환 | $p_y(y)=p_x(g(y))\lvert g'(y)\rvert$, 다변수는 $\lvert\det J\rvert$ |
| 엔트로피 | $\mathrm H[x]=-\sum_xp(x)\log_2p(x)$ (비트), 미분 엔트로피 $-\int p\ln p\,dx$ |
| 가우시안의 엔트로피 | $\frac12\{1+\ln(2\pi\sigma^2)\}$ |
| KL 발산 | $\KL(p\Vert q)=-\int p\ln\frac qp\,d\mathbf x\ge0$ (등호는 $p=q$), 비대칭 |
| MLE = KL 최소화 | $\KL(p\Vert q)\simeq\frac1N\sum_n\{-\ln q(\mathbf x_n\mid\boldsymbol\theta)+\ln p(\mathbf x_n)\}$ |
| 결합·조건부·상호정보 | $\mathrm H[\mathbf x,\mathbf y]=\mathrm H[\mathbf y\mid\mathbf x]+\mathrm H[\mathbf x]$, $\mathrm I[\mathbf x,\mathbf y]=\KL(p(\mathbf x,\mathbf y)\Vert p(\mathbf x)p(\mathbf y))$ |

- 밀도의 최빈값은 비선형 변환에서 옮겨집니다(확률 질량과 달리).
- 이산 분포의 엔트로피는 균등분포에서 최대 $\log K$, 연속에서 분산이 정해지면 가우시안이 최대.
- $\mathrm I[\mathbf x,\mathbf y]=\mathrm H[\mathbf x]-\mathrm H[\mathbf x\mid\mathbf y]\ge0$, 독립일 때만 0.

:::warn 자주 틀리는 것
변수변환에서 $\lvert dx/dy\rvert$를 빠뜨리는 것, KL을 거리처럼 대칭으로 쓰는 것.
:::
` },
        { id: 'u06', label: '06', title: '베이지안 확률과 규제', where: 'Bishop §2.6', secs: ['ch06:2.6'],
          body: R`
:::idea 한 문단 요약
모수도 확률변수로 보면, 자료를 보기 전의 믿음(사전분포)을 자료로 갱신해 사후분포를 얻습니다. 사후분포의 최댓값(MAP)은 “자료 적합 + 규제”의 최소화이고, 가우시안 사전분포는 L2 규제입니다. 완전 베이지안은 하나의 값 대신 모든 모수로 평균해 예측합니다.
:::

| 개념 | 식 |
|---|---|
| 사후분포 | $p(\mathbf w\mid\mathcal D)=\dfrac{p(\mathcal D\mid\mathbf w)p(\mathbf w)}{p(\mathcal D)}\propto$ 가능도 × 사전 |
| MAP | $-\ln p(\mathbf w\mid\mathcal D)=-\ln p(\mathcal D\mid\mathbf w)-\ln p(\mathbf w)+\ln p(\mathcal D)$ |
| 가우시안 사전 → L2 | $p(\mathbf w\mid s)=\prod_i\N(w_i\mid0,s^2)$ → $\frac\lambda2\lVert\mathbf w\rVert^2$, $\lambda=\sigma^2/s^2$ |
| 예측분포 | $p(t\mid x,\mathcal D)=\int p(t\mid x,\mathbf w)p(\mathbf w\mid\mathcal D)\,d\mathbf w$ |

- MLE는 추정값 하나를 내고, 다른 훈련 자료면 다른 값이 나온다는 불확실성을 담지 못합니다.
- 자료가 많아지면 사후분포가 좁아지고 사전분포의 영향이 줄어듭니다.
- 사전분포가 넓을수록($s$가 클수록) 규제 $\lambda$가 작아집니다.
` },
      ] },

    { id: 'C', mark: 'C', title: '신경망과 학습', short: 'C', meta: '교재 6–9장 · 07–12단원',
      problems: [
        { id: 'u07', label: '07', title: '심층 신경망', where: 'Bishop §6.2–6.4', secs: ['ch07:6.2'],
          body: R`
:::idea 한 문단 요약
신경망은 선형변환과 비선형 활성화를 번갈아 쌓은 함수이고, 은닉 유닛이 충분하면 어떤 연속함수든 근사합니다. 깊게 쌓으면 계층적·분산 표현을 배우고, 그 표현을 다른 과제로 옮겨 쓸 수 있습니다(전이 학습). 과제에 맞는 출력 활성화와 오차함수의 짝을 고르면 출력의 기울기가 항상 $y-t$입니다.
:::

| 개념 | 식 |
|---|---|
| 2층 신경망 | $a_j=\sum_iw_{ji}^{(1)}x_i+w_{j0}^{(1)}$, $z_j=h(a_j)$, $y_k=f\big(\sum_jw_{kj}^{(2)}z_j+w_{k0}^{(2)}\big)$ |
| 활성화 | $\sigma(a)=\frac1{1+e^{-a}}$, $\tanh$, ReLU $\max(0,a)$, softplus $\ln(1+e^a)$, leaky ReLU $\max(0,a)+\alpha\min(0,a)$ |
| 깊은 망 | $\mathbf z^{(l)}=h^{(l)}(\mathbf W^{(l)}\mathbf z^{(l-1)})$ |
| 오토인코더 | $\hat{\mathbf x}=g(f(\mathbf x))$, $E=\lVert\mathbf x-\hat{\mathbf x}\rVert^2$ (병목) |
| InfoNCE·CLIP | 양성 쌍의 유사도를 키우고 음성 쌍을 밀어내는 소프트맥스 꼴 손실 |
| 회귀 | 선형 출력 + 제곱오차 (가우시안 가능도) |
| 이진 분류 | 시그모이드 + $E=-\sum\{t_n\ln y_n+(1-t_n)\ln(1-y_n)\}$ |
| 다중 분류 | 소프트맥스 $y_k=\frac{e^{a_k}}{\sum_je^{a_j}}$ + $E=-\sum_n\sum_kt_{kn}\ln y_k$ |
| 공통 기울기 | $\partial E_n/\partial a_k=y_k-t_k$ |

- 활성화가 선형이면 층을 쌓아도 선형 모델 하나입니다.
- 보편 근사 정리는 **존재**만 말하고, 학습 가능성이나 필요한 유닛 수는 말하지 않습니다.
- 전이 학습: 대상 자료가 적으면 마지막 층만, 많으면 여러 층을 작은 학습률로 다시 학습.
` },
        { id: 'u08', label: '08', title: '경사하강법과 옵티마이저', where: 'Bishop §7.1–7.3', secs: ['ch08:7.1'],
          body: R`
:::idea 한 문단 요약
오차 곡면을 $-\nabla E$ 방향으로 내려갑니다. 미니배치로 기울기를 싸게 추정하고, 초기화로 신호 크기를 맞추며, 학습률은 곡률이 정한 한계 안에서 고르고, 모멘텀으로 관성을, AdaGrad·RMSProp·Adam으로 모수마다 다른 학습률을 줍니다.
:::

| 개념 | 식 |
|---|---|
| 최소점 근처 | $E(\mathbf w)\simeq E(\mathbf w^\star)+\frac12(\mathbf w-\mathbf w^\star)^T\mathbf H(\mathbf w-\mathbf w^\star)$ |
| 배치·SGD | $\mathbf w\leftarrow\mathbf w-\eta\nabla E$, $\mathbf w\leftarrow\mathbf w-\eta\nabla E_n$ (미니배치는 $B$개 평균) |
| 초기화 | He $2/n_{\text{in}}$ (ReLU), Xavier $2/(n_{\text{in}}+n_{\text{out}})$ (tanh·시그모이드) |
| 학습률 | 고유방향마다 $(1-\eta\lambda_i)$배 → $\eta<2/\lambda_{\max}$; 속도는 $\lambda_{\min}$, 조건수 $\lambda_{\max}/\lambda_{\min}$ |
| 모멘텀 | $\Delta\mathbf w^{(\tau-1)}=-\eta\nabla E+\mu\Delta\mathbf w^{(\tau-2)}$, 유효 학습률 $\eta/(1-\mu)$ |
| 스케줄 | 선형, 거듭제곱 $\eta^{(0)}(1+\tau/s)^c$, 지수 $\eta^{(0)}c^{\tau/s}$ |
| AdaGrad | $r_i\leftarrow r_i+g_i^2$, $w_i\leftarrow w_i-\frac\eta{\sqrt{r_i}+\delta}g_i$ |
| RMSProp | $r_i\leftarrow\beta r_i+(1-\beta)g_i^2$ |
| Adam | $s_i\leftarrow\beta_1s_i+(1-\beta_1)g_i$, $r_i\leftarrow\beta_2r_i+(1-\beta_2)g_i^2$, $\hat s_i=\frac{s_i}{1-\beta_1^\tau}$, $\hat r_i=\frac{r_i}{1-\beta_2^\tau}$, $w_i\leftarrow w_i-\eta\frac{\hat s_i}{\sqrt{\hat r_i}+\delta}$ |

- 가중치를 모두 같은 값으로 초기화하면 대칭이 깨지지 않아 은닉 유닛이 같은 것만 배웁니다.
- SGD의 잡음은 계산을 아끼고 나쁜 정류점에서 빠져나오게 돕습니다.
- AdaGrad는 $r_i$가 계속 커져 학습이 멈출 수 있어 RMSProp이 이동평균으로 바꿉니다. Adam의 편향 보정은 0에서 시작한 이동평균을 초기에 키워 줍니다.
` },
        { id: 'u09', label: '09', title: '정규화(Normalization)', where: 'Bishop §7.4', secs: ['ch09:7.4'],
          body: R`
:::idea 한 문단 요약
입력이나 은닉 활성의 척도가 제각각이면 오차 곡면이 길쭉해져 학습이 느립니다. 평균 0, 분산 1로 맞추되, 입력 정규화는 훈련 전에 한 번, 배치 정규화는 미니배치의 유닛마다, 층 정규화는 예제마다 층 전체로 계산합니다.
:::

| 방법 | 평균·분산을 내는 범위 | 추론 시 |
|---|---|---|
| 입력 정규화 | 훈련 자료 전체, 입력 $i$마다 | 훈련 자료의 $\mu_i,\sigma_i$ 그대로 |
| 배치 정규화 | 미니배치 $K$개, 유닛 $i$마다 | 학습 중 이동평균 $\bar\mu_i,\bar\sigma_i$ |
| 층 정규화 | 예제 $n$마다, 층의 유닛 $M$개 | 학습과 같은 함수 |

$$\hat a_{ni}=\frac{a_{ni}-\mu}{\sqrt{\sigma^2+\delta}},\qquad \tilde a_{ni}=\gamma_i\hat a_{ni}+\beta_i\quad(\gamma_i,\beta_i\text{는 학습})$$

- $\gamma,\beta$가 있어 정규화가 표현력을 빼앗지 않습니다(원래 분포를 되찾을 수 있음).
- 배치 정규화는 배치가 작거나 서열 길이가 제각각이면 불안정해, 트랜스포머는 층 정규화를 씁니다.

:::warn 자주 틀리는 것
검증·시험 자료에 그 자료의 평균·분산을 새로 쓰는 것. 항상 **훈련** 통계량(배치 정규화는 이동평균)을 씁니다.
:::
` },
        { id: 'u10', label: '10', title: '역전파', where: 'Bishop §8.1–8.2', secs: ['ch10:8.1'],
          body: R`
:::idea 한 문단 요약
가중치 기울기 = (출력 쪽에서 온 오차 신호 $\delta$) × (입력 쪽 활성 $z$). 출력에서 $\delta$를 시작해 연쇄법칙으로 거꾸로 전하면, 순전파 한 번 정도의 비용으로 모든 기울기를 얻습니다. 같은 생각을 일반화한 것이 후진 모드 자동 미분입니다.
:::

| 개념 | 식 |
|---|---|
| 기울기 | $\dfrac{\partial E_n}{\partial w_{ji}}=\delta_jz_i$, $\delta_j\equiv\dfrac{\partial E_n}{\partial a_j}$ |
| 출력 유닛 | $\delta_k=y_k-t_k$ (짝을 맞춘 출력과 오차) |
| 은닉 유닛 | $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$ |
| tanh 2층망 | $\delta_j=(1-z_j^2)\sum_kw_{kj}^{(2)}\delta_k$ |
| 야코비안 | $J_{ki}=\partial y_k/\partial x_i=\sum_jw_{ji}\,\partial y_k/\partial a_j$ |
| 헤시안 외적 근사 | $\mathbf H\simeq\sum_n\nabla a_n\nabla a_n^T$ (잔차가 작을 때) |
| 자동 미분 | 전진 모드: 입력 하나당 한 패스 / 후진 모드: 출력 하나당 한 패스 |

- 수치 미분(중앙 차분 $O(\epsilon^2)$)은 역전파 구현을 검증하는 데 씁니다.
- 출력은 하나(손실)이고 입력(모수)은 많으므로 학습에는 후진 모드가 유리합니다.
` },
        { id: 'u11', label: '11', title: '규제 I: 귀납적 편향, 가중치 감쇠, 학습 곡선', where: 'Bishop §9.1–9.3', secs: ['ch11:9.1'],
          body: R`
:::idea 한 문단 요약
보지 못한 입력에 답하려면 가정(귀납적 편향)이 필요합니다. 대칭을 아는 경우에는 불변성·등변성을 넣고, 모르면 가중치를 작게 두는 가중치 감쇠를 씁니다. 조기 종료도 가중치 감쇠와 비슷하게 작동하며, 아주 큰 모델에서는 이중 하강이 나타납니다.
:::

| 개념 | 식 |
|---|---|
| 편향-분산 | $\E[(y-\hat y)^2]=\text{편향}^2+\text{분산}+\text{잡음}$ |
| 등변성·불변성 | $S(T(I))=T(S(I))$, $C(T(I))=C(I)$ |
| 가중치 감쇠 | $\widetilde E=E+\frac\lambda2\mathbf w^T\mathbf w$ → $\mathbf w\leftarrow(1-\eta\lambda)\mathbf w-\eta\nabla E$ |
| 일반화된 감쇠 | $\Omega=\frac\lambda2\sum_j\lvert w_j\rvert^q$ ($q=2$ 감쇠, $q=1$ 라쏘: 희소) |
| 조기 종료 | $w_j^{(\tau)}=\{1-(1-\rho\eta_j)^\tau\}w_j^\star$, $(\rho\tau)^{-1}\sim\lambda$ |

- 공짜 점심은 없다 정리: 모든 문제에 좋은 학습자는 없으므로 문제에 맞는 편향이 필요합니다.
- 대칭을 넣는 네 방법: 전처리, 규제, 자료 증강, 구조(CNN).
- 일관된 규제는 층마다 따로, **편향은 빼고** 규제합니다.
- 이중 하강: 모델 크기(또는 학습 시간)가 보간 한계를 넘으면 시험오차가 다시 내려갑니다.
` },
        { id: 'u12', label: '12', title: '규제 II: 파라미터 공유, 잔차 연결, 모델 평균', where: 'Bishop §9.4–9.6', secs: ['ch12:9.4'],
          body: R`
:::idea 한 문단 요약
모수를 묶으면(공유) 자유도가 줄고, 블록마다 입력을 다시 더하면(잔차) 아주 깊은 망도 학습되며, 여러 모델을 평균하면(앙상블·드롭아웃) 오차가 줄어듭니다.
:::

| 개념 | 식 |
|---|---|
| 소프트 가중치 공유 | $\Omega(\mathbf w)=-\sum_i\ln\sum_j\pi_j\N(w_i\mid\mu_j,\sigma_j^2)$ |
| 잔차 연결 | $\mathbf z_l=F_l(\mathbf z_{l-1})+\mathbf z_{l-1}$ (차원이 다르면 $\mathbf W\mathbf z_{l-1}$) |
| 위원회 | $E_{\text{COM}}=\frac1ME_{\text{AV}}$ (무상관), 항상 $E_{\text{COM}}\le E_{\text{AV}}$ |
| 드롭아웃(학습) | 노드마다 마스크 $R_i\in\{0,1\}$, 확률 $\rho$로 유지 (은닉 0.5, 입력 0.8) |
| 드롭아웃(추론) | 몬테카를로 평균, 또는 전체 망에서 나가는 가중치에 $\rho$를 곱함 |

- 잔차 블록은 항등 사상에서 필요한 **변화량**만 배우고, 기울기가 지름길로 흘러 소실이 줄어듭니다.
- 배깅은 부트스트랩 자료로 따로 학습해 평균, 부스팅은 앞 모델이 틀린 예에 가중치를 주며 순차 학습.
- 드롭아웃은 모수를 공유하는 $2^M$개 부분망의 앙상블로 볼 수 있습니다.
` },
      ] },

    { id: 'D', mark: 'D', title: '합성곱 신경망', short: 'D', meta: '교재 10장 · 13–14단원',
      problems: [
        { id: 'u13', label: '13', title: '합성곱 신경망', where: 'Bishop §10.1–10.2', secs: ['ch13:10.1'],
          body: R`
:::idea 한 문단 요약
영상은 가까운 화소끼리 관련이 깊고, 같은 특징이 어디에나 나타납니다. 이 두 사전 지식을 희소 연결과 가중치 공유로 구조에 넣은 것이 합성곱이고, 풀링으로 작은 이동에 불변이 되며, 층을 쌓아 단순한 특징에서 복잡한 특징으로 올라갑니다.
:::

| 개념 | 식 |
|---|---|
| 특징 검출기 | $z=\ReLU(\mathbf w^T\mathbf x+w_0)$ |
| 합성곱(딥러닝) | $C(j,k)=\sum_l\sum_mI(j+l,k+m)K(l,m)$ (엄밀히는 교차상관) |
| 출력 크기 | $\big\lfloor\frac{J+2P-M}S\big\rfloor+1$; 같은 크기는 $P=(M-1)/2$ |
| 합성곱층 모수 | $(M^2C+1)C_{\text{OUT}}$ (영상 크기와 무관) |
| 수용 영역 | $L(M-1)+1$ ($3\times3$ 두 층 = $5\times5$) |
| 풀링 | 최대·평균, 학습할 모수 없음, 채널마다 따로 |

- CNN의 네 원리: 계층, 국소성, 등변성(합성곱), 불변성(풀링).
- $1\times1$ 합성곱은 공간은 그대로 두고 채널 수만 바꿉니다(병목).
- 대표 구조: LeNet(손글씨) → AlexNet(ReLU, 드롭아웃, GPU) → VGG-16(작은 $3\times3$을 깊게, 모수 약 1억 3,800만).

:::warn 자주 틀리는 것
다채널 필터의 깊이를 빠뜨리는 것($M\times M$이 아니라 $M\times M\times C$), 편향(채널마다 1개)을 빠뜨리는 것.
:::
` },
        { id: 'u14', label: '14', title: 'CNN의 해석과 활용: 검출, 분할, 스타일 전이', where: 'Bishop §10.3–10.6', secs: ['ch14:10.3'],
          body: R`
:::idea 한 문단 요약
학습된 CNN의 첫 층은 가보르 필터를 닮고, 깊은 층은 물체의 부분을 봅니다. 출력이나 오차를 **입력 영상 쪽으로** 미분하면 어디를 보는지(Grad-CAM), 어떻게 속일지(FGSM), 무엇을 그리는지(DeepDream, 스타일 전이)를 알 수 있습니다. 분류를 넘어 검출은 상자 좌표를 회귀하고, 분할은 화소마다 분류합니다.
:::

| 개념 | 식 |
|---|---|
| 가보르 필터 | $G=A\exp(-\alpha\tilde x^2-\beta\tilde y^2)\sin(\omega\tilde x+\phi)$ |
| Grad-CAM | $\alpha_k=\frac1{M_k}\sum_{i,j}\frac{\partial a^{(c)}}{\partial a_{ij}^{(k)}}$, $\mathbf L=\sum_k\alpha_k\mathbf A^{(k)}$ |
| FGSM | $\mathbf x'=\mathbf x+\epsilon\operatorname{sign}(\nabla_{\mathbf x}E(\mathbf x,t))$ |
| DeepDream | $F(\mathbf I)=\sum_{i,j,k}a_{ijk}(\mathbf I)^2$ 를 영상에 대해 키움 |
| 경계 상자 | $\mathbf b=(b_x,b_y,b_W,b_H)$; 소프트맥스 $C$개 + 선형 4개 |
| IoU | $\frac{\lvert A\cap B\rvert}{\lvert A\rvert+\lvert B\rvert-\lvert A\cap B\rvert}$, 보통 $>0.5$면 맞음 |
| 비최대 억제 | 문턱 아래 버림 → 최고 상자 확정 → IoU 큰 상자 버림 → 반복 |
| 의미 분할 | 출력 $H\times W\times C$, $E=-\sum_{i,j}\log p_{ij,c_{ij}}$ |
| 전치 합성곱 | 다운샘플 행렬 $\mathbf A$의 전치 $\mathbf A^T$ (역행렬 아님) |
| 스타일 전이 | $E=E_{\text{content}}+E_{\text{style}}$, 스타일 행렬 $F_{kk'}=\sum_{i,j}a_{ijk}a_{ijk'}$ |

- 학습은 모수를 바꿔 오차를 줄이고, FGSM은 모수를 고정한 채 **영상**을 바꿔 오차를 키웁니다.
- 슬라이딩 윈도는 합성곱으로 한 번에 계산하면 겹치는 계산을 공유합니다. Faster R-CNN은 영역 제안까지 망이 배웁니다.
- U-net은 인코더의 고해상도 특징을 디코더에 **이어 붙여**(건너뛰는 연결) 세부를 되살립니다.
` },
      ] },

    { id: 'E', mark: 'E', title: '트랜스포머', short: 'E', meta: '교재 12장 · 15단원',
      problems: [
        { id: 'u15', label: '15', title: '트랜스포머', where: 'Bishop §12.1–12.4', secs: ['ch15:12.1'],
          body: R`
:::idea 한 문단 요약
트랜스포머는 토큰 행렬 $\mathbf X\in\mathbb R^{N\times D}$를 같은 크기로 바꾸는 층을 쌓은 것이고, 그 핵심은 **입력마다 다시 계산되는 가중 평균**(어텐션)입니다. 셀프 어텐션은 순서를 모르므로 위치 부호화를 더하고, 학습 시에는 인과 마스크로 미래를 가립니다. 토큰화만 바꾸면 언어(GPT·BERT), 영상(ViT·VQ), 음성(VALL-E), 멀티모달에 같은 구조를 씁니다.
:::

| 개념 | 식 | 기억할 점 |
|---|---|---|
| 어텐션 계수 | $\mathbf y_n=\sum_ma_{nm}\mathbf x_m$, $a_{nm}\ge0$, $\sum_ma_{nm}=1$ | 가중 평균, 입력마다 계산 |
| 셀프 어텐션 | $\mathbf Y=\operatorname{Softmax}[\mathbf X\mathbf X^T]\mathbf X$ | 모수 없음, 소프트맥스는 **행마다** |
| Q·K·V | $\mathbf Q=\mathbf X\mathbf W^{(q)}$, $\mathbf K=\mathbf X\mathbf W^{(k)}$, $\mathbf V=\mathbf X\mathbf W^{(v)}$ | 따로 투영해야 비대칭 관계 |
| 스케일드 어텐션 | $\operatorname{Softmax}[\mathbf Q\mathbf K^T/\sqrt{D_k}]\mathbf V$ | $\operatorname{var}[\mathbf q^T\mathbf k]=D_k$ → 포화 방지 |
| 멀티헤드 | $\operatorname{Concat}[\mathbf H_1,\dots,\mathbf H_H]\mathbf W^{(o)}$ | 모수 $4D^2$, $H$와 무관 |
| 머리별 합 | $\mathbf Y=\sum_h\mathbf A_h\mathbf X\mathbf W_h^{(v)}\mathbf W_h^{(o)}$, $\mathbf A_h=\operatorname{Softmax}[\mathbf Q_h\mathbf K_h^T/\sqrt{D_k}]$ | $\mathbf W_h^{(v)}\mathbf W_h^{(o)}$의 계수 $\le D_v$ |
| 트랜스포머 층 | $\mathbf Z=\operatorname{LN}[\mathbf Y(\mathbf X)+\mathbf X]$, $\widetilde{\mathbf X}=\operatorname{LN}[\operatorname{MLP}[\mathbf Z]+\mathbf Z]$ | 잔차 + 층 정규화 + 위치별 MLP |
| 층당 모수 | 어텐션 $4D^2$ + MLP($4D$ 은닉) $8D^2=12D^2$ | BERT-Large $\approx12\cdot24\cdot1024^2+$임베딩 $\approx3.4$억 |
| 계산량 | 어텐션 $O(N^2D)$, MLP $O(ND^2)$, 모수 $O(D^2)$ | 비율 $N/D$ |
| 위치 부호화 | $\widetilde{\mathbf x}_n=\mathbf x_n+\mathbf r_n$, $r_{ni}=\sin(n/L^{i/D})$ (짝수 $i$), $\cos(n/L^{(i-1)/D})$ (홀수 $i$) | 더한다, $\mathbf r_{n+k}=\mathbf M_k\mathbf r_n$ |
| 학습된 위치 부호화 | 위치마다 벡터를 학습 | 긴 서열로 일반화 못 함 → 길이 고정(ViT)에 적합 |
| 임베딩 | $\mathbf v_n=\mathbf E\mathbf x_n$, $\mathbf E\in\mathbb R^{D\times K}$ | 원-핫과의 곱 = 열 하나 |
| 나이브 베이즈 | $p(\mathcal C_k\mid\mathbf x_{1:N})\propto p(\mathcal C_k)\prod_np(\mathbf x_n\mid\mathcal C_k)$ | 영확률 → 평활화 |
| 단어 주머니 MLE | $\mu_k=n_k/N$ | 단어의 비율(KL ≥ 0으로 증명) |
| 자기회귀 | $p(\mathbf x_{1:N})=\prod_np(\mathbf x_n\mid\mathbf x_{1:n-1})$ | 정확한 분해, $n$-그램은 근사($K^{L+1}$칸) |
| $n$-그램 계산 | $p(\mathbf w\mid\mathbf u)=p_L(\mathbf u,\mathbf w)/p_{L-1}(\mathbf u)$ | 분모는 서열의 마지막 묶음을 빼고 센다 |
| RNN·BPTT | $\mathbf z_n=f(\mathbf x_n,\mathbf z_{n-1};\mathbf w)$, $\frac{\partial\mathbf z_N}{\partial\mathbf z_0}=\prod_n\frac{\partial\mathbf z_n}{\partial\mathbf z_{n-1}}$ | 소실·폭발, 병목 |
| GPT 출력 | $\mathbf Y=\operatorname{Softmax}(\widetilde{\mathbf X}\mathbf W^{(p)})$, $\mathbf W^{(p)}\in\mathbb R^{D\times K}$ | 다음 토큰 교차 엔트로피 |
| 인과 마스크 | $a_{nm}=0$ ($m>n$), 점수에 $-\infty$ | 행의 합은 여전히 1 |
| 온도 | $y_i=\exp(a_i/T)/\sum_j\exp(a_j/T)$ | $T\to0$ 탐욕, $T\to\infty$ 균등 |
| 탐욕·빔 | 탐욕 $O(KN)$, 빔은 가설 $B$개 → 후보 $B^2$ → $B$개, $O(BKN)$ | 탐욕 ≠ 최적 서열($K^N$개), 빔은 길이로 정규화 |
| top-$K$·top-$p$ | 상위 $K$개 / 누적확률 $p$까지 남겨 재정규화 | 그대로 뽑기는 긴 꼬리 때문에 엉뚱함 |
| 교차 어텐션 | $\mathbf Q$는 디코더, $\mathbf K,\mathbf V$는 인코더 $\mathbf Z$ | 행렬 $N'\times N$ |
| BERT 미세 조정 | ⟨class⟩ 출력에 $D\times K$ + 소프트맥스 ($K=2$면 $D\times1$ + 시그모이드) | 모든 모수를 함께 학습, 토큰 분류는 나머지 출력에 공유 LSM |
| LoRA | $\widehat{\mathbf W}=\mathbf W_0+\mathbf A\mathbf B$, $\mathbf A\in\mathbb R^{D\times R}$, $\mathbf B\in\mathbb R^{R\times D}$ | 모수 $2DR$ (전체 $D^2$) |
| ViT | $N=HW/P^2$, 패치 길이 $P^2C$ | $224^2$, $P=16$ → 196토큰 |
| 벡터 양자화 | $\mathbf x_n\to\arg\min_{\mathbf c_k}\lVert\mathbf x_n-\mathbf c_k\rVert^2$ | 토큰당 $\log_2K$비트 |
| 직통 기울기 | 순전파 $\mathbf q=\mathbf c_{k^*}$, 역전파 $\partial E/\partial\mathbf x\approx\partial E/\partial\mathbf q$ | VQ의 $\arg\min$은 미분 불가 |

| 구조 | 대표 | 마스크 | 학습 |
|---|---|---|---|
| 인코더 | BERT | 없음(양방향) | 마스크 언어 모델링(15%) |
| 디코더 | GPT | 인과 마스크 | 다음 토큰 예측 |
| 인코더–디코더 | 번역기 | 디코더 셀프 어텐션만 인과 | 짝지은 서열 |

- RNN은 정보가 은닉 상태를 차례로 거치고(경로 $N$, 병렬화 불가), 트랜스포머는 어텐션 한 번으로 잇습니다(경로 1, 대신 $O(N^2)$).
- ViT는 CNN보다 귀납적 편향이 약해 자료가 더 필요하지만, 자료가 아주 많으면 더 유연합니다.
- 생성 전략: 탐욕(결정적), 빔(유망한 서열 유지), top-$p$(누적확률 $p$까지), 온도. 탐욕·빔은 다양성이 낮습니다.
- LLM: 자기 지도 사전 학습 → 미세 조정(파운데이션 모델), LoRA, 프롬프트·문맥 내 학습, RLHF.
- 어텐션 출력은 값 벡터들의 일차결합이라 (투영된) 입력이 펼치는 부분공간을 못 벗어납니다 → 층마다 위치별 MLP가 필요합니다.
- GPT 생성 때는 인과 마스크 덕분에 앞 토큰의 표현이 바뀌지 않아 계산(키·값)을 재사용합니다. 학습은 사람이 쓴 서열, 생성은 자기 서열이라 길어질수록 분포가 어긋날 수 있습니다.
- BERT는 가려진 위치만 오차에 들어가 디코더보다 학습 효율이 낮고 생성을 못 합니다(15% 중 80% ⟨mask⟩, 10% 무작위, 10% 그대로).
- LoRA는 보통 어텐션 가중치에만 붙이고 MLP는 얼려 둡니다(내재 차원이 낮다는 관찰). 학습 모수를 많게는 약 1만분의 1로 줄입니다.
- ViT의 2차원 편향은 패치 자르기뿐. CNN으로 토큰화하면(ResNet18) 화소보다 64배 적은 토큰. 음성은 멜 스펙트로그램을 패치로 잘라 같은 인코더에 넣습니다.
- 텍스트 → 영상은 출력이 영상 토큰인 번역(인코더–디코더, Parti), 양방향 멀티모달은 언어 사전 + 영상 코드북을 이은 사전 하나(CM3Leon).

:::warn 자주 틀리는 것
- 나누는 값은 $D_k$가 아니라 $\sqrt{D_k}$. 마스크는 가중치에 0을 곱하는 것이 아니라 소프트맥스 **전** 점수에 $-\infty$를 더하는 것.
- 위치 부호화는 이어 붙이지 않고 **더한다**. BERT에는 인과 마스크가 없다. 교차 어텐션의 쿼리는 디코더에서 온다.
- 연속 회귀는 여러 답의 평균을 내서 흐려진다 → 영상·음성 생성은 VQ로 이산 토큰을 만든다.
- 교재의 “직교 입력이면 $\mathbf y_n=\mathbf x_n$”은 근사다: $a_{nn}=\frac{e^{\lVert\mathbf x_n\rVert^2}}{e^{\lVert\mathbf x_n\rVert^2}+N-1}<1$. 교재 연습문제 12.15의 표도 합이 0.75인 인쇄 오류가 있다(단원 예제 12의 고친 표로 연습).
- 사인만 쓰는 위치 부호화로는 상대 위치의 선형 관계가 안 된다($\mathbf r_0=\mathbf 0$). 코사인이 함께 있어야 회전 행렬이 나온다.
:::
` },
      ] },
  );
})();
