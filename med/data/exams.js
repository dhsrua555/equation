/* 실전 모의고사 — 연습문제와 겹치지 않는 별도 문항. 서술형에는 채점 기준을 붙였습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x1', roman: 'I', kind: '교재 1·2장 범위', title: '곡선 적합, 확률, 정보이론, 베이지안', scopeText: '01–06 단원',
    desc: '의료 데이터, 다항식 적합과 규제, 베이즈 정리와 선별검사, 가우시안 MLE와 편향, 밀도 변환, 엔트로피와 KL, MAP. 계산과 증명을 함께 봅니다.',
    minutes: 80, plot: 'roc',
    problems: [
      { ch: 'ch01', type: 'mc', lv: 1, pts: 4, q: R`다음 중 시간에 따른 **1차원 신호** 자료는?`,
        choices: [R`CT 영상`, R`심전도(ECG)`, R`전자의무기록(EMR)`, R`MRI 영상`], ans: 1,
        sol: R`ECG·EEG·EMG는 생체전기 신호(1D 시계열), CT·MRI는 2D/3D 영상, EMR은 기록(표·텍스트)입니다.` },
      { ch: 'ch02', type: 'mc', lv: 1, pts: 5, q: R`자료 $N=10$개에 $M=9$차 다항식을 제곱오차합으로 맞출 때 옳은 것은? (서로 다른 $x_n$)`,
        choices: [R`훈련 오차와 시험 오차가 모두 0이다`, R`훈련 오차는 0이 될 수 있지만 시험 오차는 커지기 쉽다(과적합)`, R`계수가 모두 작아진다`, R`$M$을 줄일수록 훈련 오차가 줄어든다`], ans: 1,
        sol: R`계수가 $M+1=10$개라 10개 점을 정확히 지날 수 있지만, 점 사이에서 크게 진동하며 계수의 크기도 커집니다.` },
      { ch: 'ch02', type: 'num', lv: 1, pts: 6, q: R`어떤 모델의 네 시험 자료 잔차 $y(x_n,\mathbf w^\star)-t_n$이 $1,-1,2,0$이다. $E_{\text{RMS}}$는? (소수 넷째 자리)`, ans: 'sqrt(1.5)', ansTex: R`\sqrt{1.5}\approx1.2247`,
        sol: R`$\sqrt{(1+1+4+0)/4}=\sqrt{1.5}$.` },
      { ch: 'ch03', type: 'num', lv: 2, pts: 8, q: R`유병률 5%인 질환에 민감도 0.8, 특이도 0.9인 검사를 했다. 양성일 때 질환일 확률은? (소수 넷째 자리)`, ans: '0.04/0.135', ansTex: R`\tfrac{0.04}{0.135}\approx0.2963`,
        sol: R`$p(T=1)=0.8(0.05)+0.1(0.95)=0.04+0.095=0.135$. $p(D=1\mid T=1)=0.04/0.135\approx0.2963$.` },
      { ch: 'ch03', type: 'num', lv: 3, pts: 6, q: R`위 환자에게 질환 여부가 주어졌을 때 첫 검사와 독립인 같은 검사를 한 번 더 했더니 또 양성이었다. 질환일 확률은? (소수 넷째 자리)`, ans: '0.032/0.0415', ansTex: R`\tfrac{0.032}{0.0415}\approx0.7711`,
        sol: R`첫 사후확률을 새 사전확률로 쓰거나, 한 번에 계산: $\frac{0.05\cdot0.8^2}{0.05\cdot0.8^2+0.95\cdot0.1^2}=\frac{0.032}{0.032+0.0095}\approx0.7711$.` },
      { ch: 'ch04', type: 'num', lv: 2, pts: 7, q: R`자료 $2,4,4,4,5,5,7,9$로 가우시안의 분산을 추정한다. **불편** 추정값 $\tilde\sigma^2$는? (소수 넷째 자리)`, ans: '32/7', ansTex: R`\tfrac{32}{7}\approx4.5714`,
        sol: R`$\mu_{\text{ML}}=5$, 편차 제곱합 $9+1+1+1+0+0+4+16=32$. $\sigma^2_{\text{ML}}=32/8=4$, 불편 추정 $32/7$.` },
      { ch: 'ch04', type: 'mc', lv: 1, pts: 5, q: R`가우시안 i.i.d. 표본 $N$개에서 $\E[\sigma^2_{\text{ML}}]$은?`,
        choices: [R`$\sigma^2$`, R`$\frac{N-1}N\sigma^2$`, R`$\frac N{N-1}\sigma^2$`, R`$\frac{\sigma^2}N$`], ans: 1,
        sol: R`표본평균 주위의 편차로 재기 때문에 체계적으로 작게 추정됩니다.` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 7, q: R`$x\sim U(0,1)$이고 $y=x^2$일 때 $y=0.25$에서의 밀도 $p_y(0.25)$는?`, ans: '1', ansTex: R`1`,
        sol: R`$x=g(y)=\sqrt y$, $g'(y)=\frac1{2\sqrt y}$. $p_y(y)=1\cdot\frac1{2\sqrt y}$, $p_y(0.25)=\frac1{2\cdot0.5}=1$.` },
      { ch: 'ch05', type: 'num', lv: 1, pts: 6, q: R`확률이 $\frac12,\frac14,\frac18,\frac18$인 네 상태의 엔트로피(비트)는?`, ans: '1.75', ansTex: R`1.75`,
        sol: R`$\frac12\cdot1+\frac14\cdot2+2\cdot\frac18\cdot3=0.5+0.5+0.75$.` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 7, q: R`$p=(\frac12,\frac12)$, $q=(\frac14,\frac34)$일 때 $\KL(p\Vert q)$ (내트)는? (소수 넷째 자리)`, ans: '0.5*ln(4/3)', ansTex: R`\tfrac12\ln\tfrac43\approx0.1438`,
        sol: R`$\frac12\ln\frac{1/2}{1/4}+\frac12\ln\frac{1/2}{3/4}=\frac12(\ln2+\ln\frac23)=\frac12\ln\frac43$.` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 6, q: R`잡음 분산 $\sigma^2=0.25$인 회귀에 사전분포 $w_i\sim\N(0,s^2)$, $s^2=0.5$를 두었다. MAP 추정과 같은 L2 규제 계수 $\lambda$ (오차 $\frac12\sum\{\cdot\}^2+\frac\lambda2\mathbf w^T\mathbf w$ 기준)는?`, ans: '0.5', ansTex: R`\lambda=\sigma^2/s^2=0.5`,
        sol: R`$\frac1{2\sigma^2}\sum\{\cdot\}^2+\frac1{2s^2}\mathbf w^T\mathbf w$에 $\sigma^2$를 곱하면 $\lambda=\sigma^2/s^2$.` },
      { ch: 'ch06', type: 'mc', lv: 2, pts: 5, q: R`베이지안 예측분포 $p(t\mid x,\mathcal D)$에 대한 설명으로 옳은 것은?`,
        choices: [R`$p(t\mid x,\mathbf w_{\text{MAP}})$와 항상 같다`, R`모든 $\mathbf w$의 예측을 사후확률로 가중 평균한 것이다`, R`사전분포만으로 계산한다`, R`자료가 많을수록 넓어진다`], ans: 1,
        sol: R`$\int p(t\mid x,\mathbf w)p(\mathbf w\mid\mathcal D)d\mathbf w$. 사후분포가 한 점에 몰릴 때만 플러그인 예측과 같습니다.` },
      { ch: 'ch04', type: 'open', lv: 2, pts: 12, q: R`$x_1,\dots,x_N\sim\N(\mu,\sigma^2)$ i.i.d.일 때 $\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2$를 증명하고, 불편 추정량을 쓰세요.`,
        rubric: R`
- $\E[x_nx_m]=\mu^2+I_{nm}\sigma^2$ — 3점
- $\E[\bar x^2]$, $\E[x_n\bar x]$ 계산 — 4점
- $\E[(x_n-\bar x)^2]=\frac{N-1}N\sigma^2$ 정리 — 3점
- 불편 추정량 $\frac1{N-1}\sum(x_n-\bar x)^2$ — 2점`,
        sol: R`
$\E[x_nx_m]=\mu^2+I_{nm}\sigma^2$. $\E[\bar x^2]=\frac1{N^2}(N^2\mu^2+N\sigma^2)=\mu^2+\frac{\sigma^2}N$, $\E[x_n\bar x]=\mu^2+\frac{\sigma^2}N$.
$\E[(x_n-\bar x)^2]=\mu^2+\sigma^2-2(\mu^2+\frac{\sigma^2}N)+\mu^2+\frac{\sigma^2}N=\frac{N-1}N\sigma^2$. 평균하면 $\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2$.
불편 추정량: $\tilde\sigma^2=\frac N{N-1}\sigma^2_{\text{ML}}=\frac1{N-1}\sum_n(x_n-\bar x)^2$.` },
      { ch: 'ch05', type: 'open', lv: 3, pts: 16, q: R`(1) 옌센 부등식으로 $\KL(p\Vert q)\ge0$과 등호 조건을 증명하세요. (2) 자료 $\mathbf x_n\sim p$로 모델 $q(\mathbf x\mid\boldsymbol\theta)$를 맞출 때 KL 최소화가 최대가능도와 같은 이유를 설명하세요.`,
        rubric: R`
- (1) $-\ln$의 볼록성과 옌센 적용 — 5점
- (1) $\int q=1$로 $\ge0$ 결론 — 2점
- (1) 등호: 순볼록 ⇒ $q/p$ 상수 ⇒ $q=p$ — 3점
- (2) $\KL=\E_p[-\ln q]-\mathrm H[p]$, 둘째 항은 $\boldsymbol\theta$와 무관 — 3점
- (2) 기댓값을 표본평균으로 근사 ⇒ 음의 로그가능도 — 3점`,
        sol: R`
(1) $\KL=\int p\{-\ln\frac qp\}\ge-\ln\int p\frac qp=-\ln\int_{p>0}q\ge-\ln1=0$. $-\ln$이 순볼록이므로 등호는 $q/p$가 상수 $c$이고 $q$의 질량이 $p>0$ 위에 있을 때만: $1=\int q=c$, 즉 $q=p$.
(2) $\KL(p\Vert q)=-\int p\ln q-\big(-\int p\ln p\big)$. 둘째 항(엔트로피)은 $\boldsymbol\theta$와 무관. 첫째 항 $\E_p[-\ln q(\mathbf x\mid\boldsymbol\theta)]\simeq-\frac1N\sum_n\ln q(\mathbf x_n\mid\boldsymbol\theta)$이므로 KL 최소화 ⇔ 로그가능도 최대화.` },
    ],
  },
  {
    id: 'x2', roman: 'II', kind: '교재 7·8·9장 범위', title: '경사하강법, 정규화, 역전파, 규제', scopeText: '08–12 단원',
    desc: '모멘텀과 Adam, 초기화, 배치·층 정규화, 역전파 손계산과 야코비안, 가중치 감쇠·라쏘·조기 종료, 앙상블과 드롭아웃.',
    minutes: 80, plot: 'momentum',
    problems: [
      { ch: 'ch08', type: 'num', lv: 1, pts: 6, q: R`모멘텀 $\mu=0.95$일 때 기울기가 거의 일정한 영역의 유효 학습률은 $\eta$의 몇 배인가?`, ans: '20', ansTex: R`20`,
        sol: R`$1/(1-0.95)=20$.` },
      { ch: 'ch08', type: 'num', lv: 2, pts: 7, q: R`Adam($\beta_1=0.9$, $\beta_2=0.99$, $\delta\approx0$, $\eta=0.001$)의 첫 단계에서 기울기가 $g=0.2$이다. 편향 보정 후의 가중치 변화량 $\Delta w$는? ($s^{(0)}=r^{(0)}=0$)`, ans: '-0.001', ansTex: R`-0.001`,
        sol: R`$s=0.1g$, $r=0.01g^2$ → $\hat s=g$, $\hat r=g^2$. $\Delta w=-\eta\,g/\lvert g\rvert=-0.001$. 보폭이 기울기 크기와 무관합니다.` },
      { ch: 'ch08', type: 'num', lv: 1, pts: 6, q: R`입력 유닛 512개인 ReLU 층의 He 초기화 표준편차는?`, ans: '0.0625', ansTex: R`\sqrt{2/512}=\tfrac1{16}`,
        sol: R`분산 $2/512=1/256$, 표준편차 $1/16$.` },
      { ch: 'ch08', type: 'mc', lv: 2, pts: 5, q: R`헤시안의 최대 고윳값이 4인 이차 오차에 고정 학습률 경사하강법을 쓸 때 수렴하는 학습률은?`,
        choices: [R`$\eta=0.4$`, R`$\eta=0.6$`, R`$\eta=1$`, R`$\eta=2$`], ans: 0,
        sol: R`수렴 조건 $0<\eta<2/\lambda_{\max}=0.5$.` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 7, q: R`미니배치($K=4$)의 사전활성이 $2,4,6,8$이고 $\gamma=0.5$, $\beta=-1$, $\delta=0$이다. $a=8$의 배치 정규화 출력은? (소수 넷째 자리)`, ans: '0.5*3/sqrt(5)-1', ansTex: R`\tfrac{1.5}{\sqrt5}-1\approx-0.3292`,
        sol: R`$\mu=5$, $\sigma^2=(9+1+1+9)/4=5$, $\hat a=3/\sqrt5$, $\tilde a=0.5\cdot3/\sqrt5-1\approx-0.3292$.` },
      { ch: 'ch09', type: 'mc', lv: 1, pts: 5, q: R`배치 크기 1로 학습해야 하는 상황에 알맞은 정규화와 그 이유는?`,
        choices: [R`배치 정규화 — 이동평균이 있어서`, R`층 정규화 — 한 예제 안의 유닛들로 통계를 구해서`, R`입력 정규화 — 은닉층도 처리해서`, R`어느 것도 쓸 수 없다`], ans: 1,
        sol: R`배치 크기 1이면 BN의 분산이 0이 되어 퇴화합니다.` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 8, q: R`입력·은닉·출력이 하나씩인 망(편향 없음): $x=1$, $w^{(1)}=1$, $z=\tanh a$, $y=w^{(2)}z$, $w^{(2)}=1$, $E=\frac12(y-t)^2$, $t=0$. $\partial E/\partial w^{(1)}$은? (소수 넷째 자리)`, ans: '(1-tanh(1)^2)*tanh(1)', ansTex: R`(1-\tanh^21)\tanh1\approx0.3199`,
        sol: R`$z=y=\tanh1$, $\delta_k=y-t=\tanh1$, $\delta_j=(1-z^2)\cdot1\cdot\delta_k$, $\partial E/\partial w^{(1)}=\delta_j\cdot x\approx0.4200\times0.7616\approx0.3199$.` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 6, q: R`소프트맥스 출력이 $\mathbf y=(0.5,0.3,0.2)$일 때 $\partial y_1/\partial a_2$는?`, ans: '-0.15', ansTex: R`-y_1y_2=-0.15`,
        sol: R`$\delta_{12}y_1-y_1y_2=-0.15$.` },
      { ch: 'ch10', type: 'mc', lv: 2, pts: 5, q: R`출력 $K$개, 입력 $D$개인 함수의 전체 야코비안을 자동 미분으로 구할 때 필요한 패스 수는?`,
        choices: [R`전진 모드 $K$번, 후진 모드 $D$번`, R`전진 모드 $D$번, 후진 모드 $K$번`, R`둘 다 1번`, R`둘 다 $KD$번`], ans: 1,
        sol: R`전진 모드는 입력 방향마다, 후진 모드는 출력마다 한 패스. 오차(스칼라)의 기울기는 후진 모드 한 번.` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 7, q: R`이차 오차의 한 고유방향 곡률이 $\lambda_j=2$일 때 가중치 감쇠 $\lambda=0.5$를 쓰면 그 방향 성분은 최소점 $w_j^\star$의 몇 배가 되는가?`, ans: '0.8', ansTex: R`\tfrac{2}{2.5}=0.8`,
        sol: R`$\lambda_j/(\lambda_j+\lambda)=2/2.5$.` },
      { ch: 'ch11', type: 'num', lv: 3, pts: 6, q: R`1차원 $\frac h2(w-w^\star)^2+\frac\lambda2\lvert w\rvert$에서 $h=2$, $w^\star=0.3$, $\lambda=1$이면 최소점 $\hat w$는?`, ans: '0.05', ansTex: R`0.05`,
        sol: R`임계값 $\frac\lambda{2h}=0.25<0.3$이므로 $\hat w=0.3-0.25=0.05$. ($w^\star=0.2$였다면 정확히 0)` },
      { ch: 'ch11', type: 'mc', lv: 2, pts: 5, q: R`학습률 $\rho$로 $\tau$번 갱신하고 조기 종료하는 것은 대략 어떤 가중치 감쇠 계수와 비슷한가?`,
        choices: [R`$\lambda\approx\rho\tau$`, R`$\lambda\approx(\rho\tau)^{-1}$`, R`$\lambda\approx\rho/\tau$`, R`$\lambda\approx\tau/\rho$`], ans: 1,
        sol: R`오래 학습할수록 유효 $\lambda$가 작아져 복잡도가 커집니다.` },
      { ch: 'ch12', type: 'num', lv: 1, pts: 6, q: R`오차가 평균 0이고 서로 무상관인 모델 4개의 평균 오차가 $E_{\text{AV}}=0.08$이다. 위원회 오차는?`, ans: '0.02', ansTex: R`0.02`,
        sol: R`$E_{\text{AV}}/M=0.08/4$.` },
      { ch: 'ch12', type: 'num', lv: 1, pts: 5, q: R`입력 노드를 $\rho=0.8$로 유지하며 드롭아웃 학습했다. 추론 시 전체 망을 쓸 때 입력 노드에서 나가는 가중치 $2.5$는 얼마로 바꾸는가?`, ans: '2', ansTex: R`2.5\times0.8=2`,
        sol: R`나가는 가중치에 $\rho$를 곱해 입력의 기댓값을 학습 때와 맞춥니다.` },
      { ch: 'ch10', type: 'open', lv: 3, pts: 16, q: R`(1) $a_j=\sum_iw_{ji}z_i$, $z_j=h(a_j)$, $\delta_j=\partial E_n/\partial a_j$일 때 $\partial E_n/\partial w_{ji}=\delta_jz_i$와 $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$를 유도하세요. (2) 소프트맥스 출력과 교차엔트로피 $E_n=-\sum_kt_k\ln y_k$ ($\sum_kt_k=1$)에서 $\delta_l=y_l-t_l$임을 보이세요.`,
        rubric: R`
- (1) $w_{ji}$는 $a_j$를 통해서만 영향 — 3점
- (1) 다음 층 $a_k$들에 대한 연쇄법칙 합 — 4점
- (1) $\partial a_k/\partial a_j=w_{kj}h'(a_j)$ — 2점
- (2) $\partial\ln y_k/\partial a_l=\delta_{kl}-y_l$ — 4점
- (2) $\sum_kt_k=1$ 사용해 정리 — 3점`,
        sol: R`
(1) $\frac{\partial E_n}{\partial w_{ji}}=\frac{\partial E_n}{\partial a_j}\frac{\partial a_j}{\partial w_{ji}}=\delta_jz_i$. $a_j$는 $z_j$를 거쳐 $j$가 연결된 $a_k$들로만 전달되므로 $\delta_j=\sum_k\delta_k\frac{\partial a_k}{\partial a_j}=\sum_k\delta_kw_{kj}h'(a_j)$.
(2) $\ln y_k=a_k-\ln\sum_me^{a_m}$이므로 $\frac{\partial\ln y_k}{\partial a_l}=\delta_{kl}-y_l$. $\delta_l=-\sum_kt_k(\delta_{kl}-y_l)=-t_l+y_l\sum_kt_k=y_l-t_l$.` },
    ],
  },
  {
    id: 'x3', roman: 'III', kind: '중간고사 종합', title: '종합 모의고사', scopeText: '01–06, 08–12 단원',
    desc: '확률과 정보이론부터 옵티마이저·정규화·역전파·규제까지. 실제 시험처럼 계산과 유도를 섞었습니다.',
    minutes: 100, plot: 'exam',
    problems: [
      { ch: 'ch03', type: 'num', lv: 2, pts: 7, q: R`유병률 0.1%인 희귀 질환에 민감도 99%, 위양성률 1%인 검사를 했다. 양성일 때 질환일 확률은? (소수 넷째 자리)`, ans: '0.00099/0.01098', ansTex: R`\tfrac{0.00099}{0.01098}\approx0.0902`,
        sol: R`$p(T=1)=0.99(0.001)+0.01(0.999)=0.00099+0.00999=0.01098$. $0.00099/0.01098\approx0.0902$ — 99% 정확한 검사라도 양성의 약 91%가 위양성입니다.` },
      { ch: 'ch04', type: 'num', lv: 1, pts: 6, q: R`자료 $1,2,6$에 가우시안을 최대가능도로 맞출 때 $\sigma^2_{\text{ML}}$은?`, ans: '14/3', ansTex: R`\tfrac{14}3`,
        sol: R`$\mu_{\text{ML}}=3$, $\sigma^2_{\text{ML}}=(4+1+9)/3=14/3$.` },
      { ch: 'ch05', type: 'mc', lv: 2, pts: 5, q: R`다음 중 **항상** 옳은 것은?`,
        choices: [R`$\KL(p\Vert q)=\KL(q\Vert p)$`, R`$\mathrm H[\mathbf x\mid\mathbf y]\le\mathrm H[\mathbf x]$`, R`미분 엔트로피는 항상 0 이상`, R`$\mathrm I[\mathbf x,\mathbf y]<0$일 수 있다`], ans: 1,
        sol: R`$\mathrm I=\mathrm H[\mathbf x]-\mathrm H[\mathbf x\mid\mathbf y]\ge0$. KL은 비대칭이고, 미분 엔트로피는 음수일 수 있습니다(좁은 가우시안).` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 6, q: R`$\N(0,4)$와 $\N(0,1)$의 미분 엔트로피 차이 $\mathrm H[\N(0,4)]-\mathrm H[\N(0,1)]$ (내트)는? (소수 넷째 자리)`, ans: 'ln(2)', ansTex: R`\tfrac12\ln4=\ln2\approx0.6931`,
        sol: R`$\mathrm H=\frac12\{1+\ln(2\pi\sigma^2)\}$이므로 차이는 $\frac12\ln\frac41=\ln2$.` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 6, q: R`성공 확률 $\mu$에 균등 사전분포를 두고 10번 중 7번 성공을 관측했다. 사후평균은? (소수 넷째 자리)`, ans: '2/3', ansTex: R`\tfrac{7+1}{10+2}=\tfrac23`,
        sol: R`사후 $\propto\mu^7(1-\mu)^3$, 사후평균 $\frac{m+1}{N+2}=\frac8{12}$. MLE는 $0.7$.` },
      { ch: 'ch02', type: 'mc', lv: 1, pts: 5, q: R`다항식 곡선 적합에서 규제 계수 $\lambda$를 매우 크게 하면?`,
        choices: [R`과적합이 심해진다`, R`계수가 0 쪽으로 눌려 과소적합(편향 증가)이 된다`, R`훈련 오차가 0이 된다`, R`아무 변화가 없다`], ans: 1,
        sol: R`벌점이 지배해 모델이 지나치게 단순해집니다. 적절한 $\lambda$는 검증 자료로 고릅니다.` },
      { ch: 'ch08', type: 'num', lv: 1, pts: 6, q: R`지수 스케줄 $\eta^{(\tau)}=\eta^{(0)}c^{\tau/s}$에서 $\eta^{(0)}=0.01$, $c=0.1$, $s=100$일 때 $\tau=200$의 학습률은?`, ans: '0.0001', ansTex: R`10^{-4}`,
        sol: R`$0.01\times0.1^2=10^{-4}$.` },
      { ch: 'ch08', type: 'mc', lv: 2, pts: 5, q: R`$E=\sum_nE_n$일 때 무작위 미니배치 $\mathcal B$ (크기 $B$)로 만든 $\frac NB\sum_{n\in\mathcal B}\nabla E_n$에 대해 옳은 것은?`,
        choices: [R`기댓값이 $\nabla E$이고 분산은 $B$가 클수록 작다`, R`항상 $\nabla E$와 같다`, R`기댓값이 $\nabla E/B$이다`, R`$B$와 무관한 분산을 가진다`], ans: 0,
        sol: R`각 점이 뽑힐 확률 $B/N$으로 불편 추정량. 분산은 대략 $1/B$에 비례합니다.` },
      { ch: 'ch09', type: 'mc', lv: 3, pts: 5, q: R`배치 정규화 바로 앞 선형층의 가중치 $\mathbf w_i$에 대해 옳은 것은? ($\delta\approx0$)`,
        choices: [R`$\mathbf w_i$를 2배 하면 출력도 2배`, R`앞 층 편향 $b_i$가 출력에 큰 영향을 준다`, R`손실의 기울기 $\nabla_{\mathbf w_i}L$은 $\mathbf w_i$에 수직이다`, R`$\gamma_i,\beta_i$가 없으면 학습이 더 쉽다`], ans: 2,
        sol: R`$L(c\mathbf w_i)=L(\mathbf w_i)$를 $c$로 미분하면 $\nabla L^T\mathbf w_i=0$. 편향은 평균을 빼면서 사라집니다.` },
      { ch: 'ch10', type: 'num', lv: 3, pts: 7, q: R`$f(x_1,x_2)=x_1x_2+\exp(x_1x_2)-\sin x_2$의 $(x_1,x_2)=(1,1)$에서 $\partial f/\partial x_2$는? (소수 넷째 자리)`, ans: '1+e-cos(1)', ansTex: R`1+e-\cos1\approx3.1780`,
        sol: R`후진 모드: $\bar v_3=1+e^{x_1x_2}$, $\bar v_2=\bar v_3x_1-\cos x_2=(1+e)-\cos1$.` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 6, q: R`$E(w)=w^3$의 $w=1$에서의 도함수를 중앙 차분 $\epsilon=0.1$로 근사한 값은?`, ans: '3.01', ansTex: R`3.01`,
        sol: R`$(1.1^3-0.9^3)/0.2=(1.331-0.729)/0.2=3.01$. 오차 $\frac{\epsilon^2}6E'''=\frac{0.01}6\cdot6=0.01$과 일치.` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 6, q: R`원점에서 시작해 학습률 $\rho=0.1$로 10번 갱신하고 멈췄다. 곡률 $\eta_j=0.1$인 방향 성분은 $w_j^\star$의 몇 배인가? (소수 넷째 자리)`, ans: '1-0.99^10', ansTex: R`1-0.99^{10}\approx0.0956`,
        sol: R`$1-(1-\rho\eta_j)^\tau=1-0.99^{10}$. $\lambda=(\rho\tau)^{-1}=1$인 가중치 감쇠의 $0.1/1.1\approx0.0909$와 비슷합니다.` },
      { ch: 'ch12', type: 'num', lv: 3, pts: 6, q: R`모델 5개의 오차가 각각 분산 1(평균 0)이고 서로 상관계수 0.5이다. 위원회 오차 $E_{\text{COM}}$은?`, ans: '0.6', ansTex: R`\tfrac15+\tfrac45(0.5)=0.6`,
        sol: R`$\frac1{M^2}(Mv+M(M-1)\rho v)=\frac vM+\frac{M-1}M\rho v=0.2+0.4$.` },
      { ch: 'ch12', type: 'mc', lv: 2, pts: 5, q: R`잔차 연결이 매우 깊은 망의 학습을 돕는 이유로 옳지 않은 것은?`,
        choices: [R`블록의 야코비안이 $\mathbf I+J_l$이라 항등 경로가 기울기를 직접 전달한다`, R`오차 곡면이 매끄러워진다`, R`얕은 경로와 깊은 경로의 앙상블처럼 작동한다`, R`파라미터 수를 크게 줄인다`], ans: 3,
        sol: R`잔차 연결은 파라미터를 거의 늘리지도 줄이지도 않습니다.` },
      { ch: 'ch11', type: 'open', lv: 3, pts: 10, q: R`이차 오차 $E=E_0+\frac12(\mathbf w-\mathbf w^\star)^T\mathbf H(\mathbf w-\mathbf w^\star)$에 $\frac\lambda2\mathbf w^T\mathbf w$를 더한 최소점이 헤시안 고유좌표에서 $\hat w_j=\frac{\lambda_j}{\lambda_j+\lambda}w_j^\star$임을 보이고, 곡률이 작은 방향이 더 많이 줄어드는 의미를 설명하세요.`,
        rubric: R`
- $(\mathbf H+\lambda\mathbf I)\hat{\mathbf w}=\mathbf H\mathbf w^\star$ — 3점
- 고유분해·사영으로 성분식 — 4점
- 해석(둔감한 방향 억제, 유효 파라미터 수) — 3점`,
        sol: R`
$\nabla\widetilde E=\mathbf H(\mathbf w-\mathbf w^\star)+\lambda\mathbf w=0$. $\mathbf H=\sum_j\lambda_j\mathbf u_j\mathbf u_j^T$에 $\mathbf u_j^T$를 곱하면 $(\lambda_j+\lambda)\hat w_j=\lambda_jw_j^\star$.
곡률이 작은 방향($\lambda_j\ll\lambda$)은 오차가 그 가중치에 둔감한 방향이라 거의 0으로, 곡률이 큰 방향은 거의 그대로 남습니다. 남는 방향의 수가 유효 파라미터 수입니다.` },
      { ch: 'ch12', type: 'open', lv: 2, pts: 9, q: R`$y_m=h+\epsilon_m$ ($m=1,\dots,M$)의 평균 $y_{\text{COM}}$에 대해 $E_{\text{COM}}\le E_{\text{AV}}$를 증명하세요.`,
        rubric: R`
- $E_{\text{COM}}$, $E_{\text{AV}}$를 $\epsilon_m$으로 표현 — 3점
- 점별로 $(\frac1M\sum\epsilon_m)^2\le\frac1M\sum\epsilon_m^2$ (볼록성·옌센 또는 코시-슈바르츠) — 4점
- 기댓값을 취해 결론 — 2점`,
        sol: R`
$y_{\text{COM}}-h=\frac1M\sum_m\epsilon_m$. $u^2$이 볼록이므로 옌센으로 각 $\mathbf x$에서 $\big(\frac1M\sum_m\epsilon_m\big)^2\le\frac1M\sum_m\epsilon_m^2$. 양변의 기댓값을 취하면 $E_{\text{COM}}\le\frac1M\sum_m\E[\epsilon_m^2]=E_{\text{AV}}$.` },
    ],
  },
  );
})();
