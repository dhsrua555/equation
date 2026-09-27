/* 실전 모의고사 — 연습문제와 겹치지 않는 별도 문항. 증명형 문항에는 채점 기준을 붙였습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x1', roman: 'I', kind: '중간고사 범위 (1)', title: '학습 이론의 기초', scopeText: '01–06 단원 · 교재 2–7장',
    desc: 'ERM과 PAC, 베이즈 최적, 균등수렴, 공짜 점심, VC 차원, SRM. 표본 복잡도 계산과 정리의 증명을 함께 봅니다.',
    minutes: 100, plot: 'vcgrowth',
    problems: [
      { ch: 'ch01', type: 'mc', lv: 1, pts: 6, q: R`실현가능성이 성립하고 학습기가 ERM일 때 **항상** 옳은 것은?`,
        choices: [R`확률 1로 $L_S(h_S)=0$`, R`$L_{\cD,f}(h_S)=0$`, R`ERM의 출력은 유일하다`, R`$\cH$가 유한해야 한다`], ans: 0,
        sol: R`실현하는 $h^\star$가 표본에서 오차 0이므로 ERM도 오차 0을 냅니다. 참 위험이 0이라는 보장은 없고, ERM의 출력은 동점일 수 있습니다.` },
      { ch: 'ch01', type: 'num', lv: 2, pts: 8, q: R`실현가능한 유한 클래스 $\lvert\cH\rvert=500$, $\varepsilon=0.02$, $\delta=0.02$에서 $\lceil\ln(\lvert\cH\rvert/\delta)/\varepsilon\rceil$은?`, ans: '507', ansTex: R`\lceil50\ln25000\rceil=507`,
        sol: R`$\ln25000=10.127$, $\div0.02=506.3$이므로 507.` },
      { ch: 'ch02', type: 'num', lv: 2, pts: 8, q: R`$x\in\{a,b,c\}$가 확률 $0.2,0.5,0.3$이고 $\eta(a)=0.1$, $\eta(b)=0.6$, $\eta(c)=0.45$일 때 베이즈 위험은?`, ans: '0.355', ansTex: R`0.02+0.2+0.135`,
        sol: R`$\E[\min\{\eta,1-\eta\}]=0.2(0.1)+0.5(0.4)+0.3(0.45)=0.02+0.20+0.135=0.355$.` },
      { ch: 'ch02', type: 'num', lv: 2, pts: 6, q: R`혼합 손실 $\alpha\lvert t-y\rvert+(1-\alpha)(t-y)^2$에서 $\alpha=0.2$, $\eta(x)=0.3$일 때 베이즈 최적 예측값은?`, ans: '0.25', ansTex: R`\tfrac{0.6-0.2}{1.6}`,
        sol: R`$\frac{2\eta-\alpha}{2(1-\alpha)}=\frac{0.4}{1.6}=0.25\in[0,1]$.` },
      { ch: 'ch03', type: 'num', lv: 2, pts: 8, q: R`$\lvert\cH\rvert=1024$, 손실 $[0,1]$, $\varepsilon=0.1$, $\delta=0.05$일 때 불가지 PAC 상한 $\lceil2\ln(2\lvert\cH\rvert/\delta)/\varepsilon^2\rceil$은?`, ans: '2125', ansTex: R`\lceil200\ln40960\rceil=2125`,
        sol: R`$\ln40960=10.620$, $\times200=2124.1$이므로 2125.` },
      { ch: 'ch04', type: 'mc', lv: 2, pts: 6, q: R`같은 가설 클래스에서 표본을 늘리면 일반적으로 줄어드는 것은?`,
        choices: [R`근사 오차`, R`추정 오차`, R`베이즈 위험`, R`근사 오차와 추정 오차 모두`], ans: 1,
        sol: R`근사 오차는 $\cH$만으로 정해지고 표본과 무관합니다. 베이즈 위험은 분포의 성질입니다.` },
      { ch: 'ch05', type: 'num', lv: 1, pts: 6, q: R`$\VC(\cH)=2$일 때 사우어 보조정리의 상한 $\tau_\cH(6)\le\sum_{i=0}^2\binom6i$은?`, ans: '22', ansTex: R`1+6+15`,
        sol: R`$1+6+15=22$. 모든 레이블링 $64$에 비해 작습니다.` },
      { ch: 'ch06', type: 'mc', lv: 2, pts: 6, q: R`PAC 학습가능하지 않지만 비균등 학습가능한 클래스는?`,
        choices: [R`$\mathbb R$ 위의 문턱 함수`, R`$\mathbb R$ 위의 모든 다항식 부호 분류기`, R`$\mathbb R$ 위의 모든 이진 함수`, R`크기 100인 유한 클래스`], ans: 1,
        sol: R`다항식 분류기 전체는 VC 무한이지만 차수별 클래스의 가산 합집합입니다. 모든 함수의 클래스는 비균등 학습도 불가능하고, 문턱·유한 클래스는 PAC 학습가능합니다.` },
      { ch: 'ch04', type: 'open', lv: 2, pts: 16, q: R`$\theta\in[0,1]$이고 $\E\theta\ge\mu$일 때 $a<\mu$에 대해 $\Prob[\theta>a]\ge\frac{\mu-a}{1-a}$임을 증명하세요. 이를 공짜 점심은 없다 정리의 어느 단계에서 어떤 값으로 쓰는지 설명하고, 그 결론을 쓰세요.`,
        sol: R`
$\theta\le a$인 사건에서 $\theta\le a$, 나머지에서 $\theta\le1$이므로 $\E\theta\le a\Prob[\theta\le a]+\Prob[\theta>a]=a+(1-a)\Prob[\theta>a]$. $\mu\le\E\theta$와 합쳐 $\Prob[\theta>a]\ge\frac{\mu-a}{1-a}$.
공짜 점심 정리: 평균·짝짓기 논법으로 어떤 $\cD_i$에서 $\E_S[L_{\cD_i}(A(S))]\ge\frac14$를 얻은 뒤, $\theta=L_{\cD_i}(A(S))$, $\mu=\frac14$, $a=\frac18$로 쓰면 $\Prob[\theta\ge\frac18]\ge\Prob[\theta>\frac18]\ge\frac{1/8}{7/8}=\frac17$.
결론: $m<\lvert\cX\rvert/2$이면 모든 학습기에 대해 오차 0인 $f$를 가진 분포가 있어 확률 $\frac17$ 이상으로 $L_\cD(A(S))\ge\frac18$.`,
        rubric: R`
- 두 사건으로 나눈 기댓값 상한 — 6점
- 부등식 정리 — 3점
- 정리 안에서의 위치($\mu=\frac14$, $a=\frac18$)와 $\frac17$ — 5점
- 정리의 결론 서술 — 2점` },
      { ch: 'ch05', type: 'open', lv: 3, pts: 16, q: R`$k\ge1$에 대해 $\mathbb R$ 위의 “구간 $k$개의 합집합” 분류기 $\{\one[x\in I_1\cup\dots\cup I_k]\}$ ($I_j$는 닫힌 구간, 비어 있어도 됨)의 VC 차원이 $2k$임을 증명하세요.`,
        sol: R`
$\ge2k$: 점 $c_1<\dots<c_{2k}$와 임의의 레이블링. 1로 표시된 점들은 연속한 덩어리(0으로 끊기지 않는 최대 구간)로 나뉩니다. 덩어리 사이에는 0이 적어도 하나 있으므로 덩어리 $q$개면 점이 $2q-1$개 이상 필요하고, $2q-1\le2k$에서 $q\le k$. 덩어리마다 그 점들만 덮는 구간(첫 점부터 끝 점까지)을 두고 남는 구간은 비워 두면 실현됩니다.
$\le2k$: 임의의 $2k+1$개 점 $c_1<\dots<c_{2k+1}$에 레이블 $(1,0,1,0,\dots,1)$ (홀수 번째 1, $k+1$개)을 주면, 구간 $k$개로 1인 점 $k+1$개를 덮어야 하므로 비둘기집 원리로 어떤 구간이 1인 점 두 개를 덮고, 그 구간은 사이의 0인 점도 덮습니다. 실현 불가 — $2k+1$개 점 집합은 분쇄되지 않습니다.`,
        rubric: R`
- 덩어리 개수 $\le k$ 논증 — 5점
- 덩어리마다 구간 배치 — 3점
- 번갈아 가는 레이블링 선택 — 4점
- 비둘기집 원리로 모순 — 4점` },
      { ch: 'ch06', type: 'open', lv: 3, pts: 14, q: R`$\cH=\bigcup_n\cH_n$, 각 $\cH_n$이 균등수렴하고 $w(n)=\frac6{\pi^2n^2}$일 때, SRM이 비균등 학습기이며 $m\ge m^{\mathrm{UC}}_{\cH_{n(h)}}(\frac\varepsilon2,w(n(h))\delta)$이면 확률 $1-\delta$ 이상으로 $L_\cD(A(S))\le L_\cD(h)+\varepsilon$임을 증명하세요. (SRM 동시 상한은 써도 됩니다.)`,
        sol: R`
$\varepsilon_n:=\varepsilon_n(m,w(n)\delta)$. 표본 수 조건과 $\varepsilon_n$의 정의(최소)로 $\varepsilon_{n(h)}\le\frac\varepsilon2$.
동시 상한의 사건 $E$ (확률 $\ge1-\delta$) 위에서: $L_\cD(A(S))\le L_S(A(S))+\varepsilon_{n(A(S))}$.
SRM의 정의: $L_S(A(S))+\varepsilon_{n(A(S))}\le L_S(h)+\varepsilon_{n(h)}$.
다시 $E$ 위에서 $h$에 대해: $L_S(h)\le L_\cD(h)+\varepsilon_{n(h)}$.
합치면 $L_\cD(A(S))\le L_\cD(h)+2\varepsilon_{n(h)}\le L_\cD(h)+\varepsilon$. $\sum w(n)=1$이라 동시 상한이 적용됩니다.`,
        rubric: R`
- $\varepsilon_{n(h)}\le\varepsilon/2$ 도출 — 3점
- 출력에 동시 상한 — 3점
- SRM 정의로 비교 — 4점
- 비교 대상에 동시 상한과 결론 — 4점` },
    ],
  },
  {
    id: 'x2', roman: 'II', kind: '중간고사 범위 (2)', title: '이론에서 알고리즘으로', scopeText: '07–13 단원 · 교재 9–10, 12–16장',
    desc: '퍼셉트론과 반공간, AdaBoost, 볼록·립시츠·매끄러움, 릿지와 안정성, SGD, SVM, 커널. 알고리즘의 보장을 식으로 유도합니다.',
    minutes: 100, plot: 'hinge',
    problems: [
      { ch: 'ch07', type: 'num', lv: 1, pts: 6, q: R`분리 가능한 자료에서 $R=5$, $B=0.4$이면 퍼셉트론 갱신 횟수의 상한은?`, ans: '4', ansTex: R`(5\cdot0.4)^2=4`,
        sol: R`$(RB)^2=2^2=4$.` },
      { ch: 'ch07', type: 'mc', lv: 1, pts: 6, q: R`$\mathbb R^3$의 비동차 반공간 클래스의 VC 차원은?`,
        choices: [R`3`, R`4`, R`5`, R`무한`], ans: 1,
        sol: R`$d+1=4$.` },
      { ch: 'ch08', type: 'num', lv: 2, pts: 8, q: R`AdaBoost에서 $\varepsilon_{t+1}=0.2$일 때 지수 손실의 비 $Z_{t+1}/Z_t$는?`, ans: '0.8', ansTex: R`2\sqrt{0.16}=0.8`,
        sol: R`$2\sqrt{0.2\cdot0.8}=2(0.4)=0.8$.` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 6, q: R`$\lVert x\rVert=2$일 때 로지스틱 손실 $w\mapsto\ln(1+e^{-y\langle w,x\rangle})$의 매끄러움 상수 $\frac14\lVert x\rVert^2$은?`, ans: '1', ansTex: R`\tfrac14\cdot4=1`,
        sol: R`$g(z)=\ln(1+e^{-z})$의 $g''=\sigma(1-\sigma)\le\frac14$, 선형 합성으로 $\frac14\lVert x\rVert^2=1$.` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 8, q: R`1차원 릿지 $\lambda\lVert w\rVert^2+\frac1{2m}\sum(wx_i-y_i)^2$, 자료 $(1,1),(1,2),(2,2)$, $\lambda=0.5$의 해 $w=\frac{b}{2\lambda m+A}$는? (소수 넷째 자리)`, ans: '7/9', ansTex: R`\tfrac{7}{3+6}`,
        sol: R`$A=1+1+4=6$, $b=1+2+4=7$, $2\lambda m=3$. $w=7/9\approx0.7778$.` },
      { ch: 'ch11', type: 'num', lv: 1, pts: 6, q: R`볼록-립시츠-유계 문제 $B=2$, $\rho=1$에서 SGD로 기대 초과 위험 $0.05$를 얻는 예제 수 $B^2\rho^2/\varepsilon^2$은?`, ans: '1600', ansTex: R`4/0.0025`,
        sol: R`$4/0.0025=1600$.` },
      { ch: 'ch12', type: 'mc', lv: 3, pts: 6, q: R`소프트 SVM 쌍대에서 $0<\alpha_i<\frac1m$인 예제의 마진 $y_i\langle w,x_i\rangle$은?`,
        choices: [R`1보다 크다`, R`정확히 1이다`, R`1보다 작다`, R`0이다`], ans: 1,
        sol: R`$\alpha_i<\frac1m$이면 $\mu_i=\frac1m-\alpha_i>0$이라 상보 여유성으로 $\xi_i=0$. $\alpha_i>0$이라 마진 제약이 등호: $y_i\langle w,x_i\rangle=1-\xi_i=1$.` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 8, q: R`그람 행렬 $K=\begin{pmatrix}1&0.5\\0.5&1\end{pmatrix}$, $y=(1,-1)$, $n\lambda=0.5$인 커널 릿지에서 첫 훈련점의 예측값 $(K\alpha)_1$은? ($\alpha=(K+n\lambda I)^{-1}y$)`, ans: '0.5', ansTex: R`\alpha=(1,-1),\ 1-0.5`,
        sol: R`$K+0.5I=\begin{pmatrix}1.5&0.5\\0.5&1.5\end{pmatrix}$, 역행렬 $\frac12\begin{pmatrix}1.5&-0.5\\-0.5&1.5\end{pmatrix}$. $\alpha=(1,-1)$. $(K\alpha)_1=1-0.5=0.5$.` },
      { ch: 'ch08', type: 'open', lv: 2, pts: 14, q: R`AdaBoost에서 $g(w)=e^{-w}(1-\varepsilon)+e^{w}\varepsilon$ ($0<\varepsilon<\frac12$)를 최소로 하는 $w$가 $\frac12\ln\frac{1-\varepsilon}\varepsilon$이고 최솟값이 $2\sqrt{\varepsilon(1-\varepsilon)}$임을 보이세요. 또 $g(w)$가 $Z_{t+1}/Z_t$와 같은 이유를 설명하세요.`,
        sol: R`
$g'(w)=-e^{-w}(1-\varepsilon)+e^w\varepsilon=0\iff e^{2w}=\frac{1-\varepsilon}\varepsilon\iff w=\frac12\ln\frac{1-\varepsilon}\varepsilon$ ($>0$). $g''=e^{-w}(1-\varepsilon)+e^w\varepsilon>0$이라 볼록, 유일한 최소.
대입: $e^{-w}(1-\varepsilon)=\sqrt{\frac\varepsilon{1-\varepsilon}}(1-\varepsilon)=\sqrt{\varepsilon(1-\varepsilon)}$, $e^w\varepsilon=\sqrt{\varepsilon(1-\varepsilon)}$. 합 $2\sqrt{\varepsilon(1-\varepsilon)}$.
이유: $D^{(t+1)}_i\propto e^{-y_if_t(x_i)}$이므로 $\frac{Z_{t+1}}{Z_t}=\sum_iD^{(t+1)}_ie^{-wy_ih_{t+1}(x_i)}$이고, 맞힌 예제 가중치 합 $1-\varepsilon$에 $e^{-w}$, 틀린 예제 $\varepsilon$에 $e^{w}$가 곱해집니다. 따라서 AdaBoost는 지수 손실을 탐욕적으로 가장 많이 줄이는 가중치를 고릅니다.`,
        rubric: R`
- 도함수와 정류점 — 4점
- 볼록성으로 최소 확인 — 2점
- 최솟값 계산 — 4점
- $Z_{t+1}/Z_t=g(w)$인 이유 — 4점` },
      { ch: 'ch10', type: 'open', lv: 2, pts: 16, q: R`$S\sim\cD^m$, $z'\sim\cD$ 독립, $i\sim U(m)$이면 모든 학습기에 대해 $\E_S[L_\cD(A(S))-L_S(A(S))]=\E[\ell(A(S^{(i)}),z_i)-\ell(A(S),z_i)]$임을 증명하세요 ($S^{(i)}$는 $z_i$를 $z'$로 바꾼 표본).`,
        sol: R`
참 위험: $\E_S[L_\cD(A(S))]=\E_{S,z'}[\ell(A(S),z')]$. $i$ 고정: $(z_1,..,z_i,..,z_m,z')$와 $(z_1,..,z',..,z_m,z_i)$는 i.i.d. 두 성분의 자리만 바꾼 것이라 같은 분포. 앞 튜플의 $\ell(A(S),z')$는 뒤 튜플에서 $\ell(A(S^{(i)}),z_i)$이므로 기댓값이 같음. $i$에 대해 평균해도 같음.
경험적 위험: $\E_S[L_S(A(S))]=\frac1m\sum_i\E[\ell(A(S),z_i)]=\E_{S,i}[\ell(A(S),z_i)]$, $z'$를 넣어도 불변.
빼면 결론.`,
        rubric: R`
- 참 위험을 새 예제의 손실로 — 3점
- 자리 바꿈의 분포 불변성 — 7점
- 경험적 위험의 $i$ 평균 표현 — 4점
- 결론 — 2점` },
      { ch: 'ch12', type: 'open', lv: 3, pts: 16, q: R`동차 소프트 SVM $\min_{w,\xi}\lambda\lVert w\rVert^2+\frac1m\sum\xi_i$ s.t. $y_i\langle w,x_i\rangle\ge1-\xi_i$, $\xi_i\ge0$이 $\min_w\lambda\lVert w\rVert^2+L^{\mathrm{hinge}}_S(w)$와 같음을 보이고, $\lVert x\rVert\le\rho$일 때 13장의 결과로 $\E_S[L^{0-1}_\cD(A(S))]\le L^{\mathrm{hinge}}_\cD(u)+\lambda\lVert u\rVert^2+\frac{2\rho^2}{\lambda m}$을 유도하세요.`,
        sol: R`
$w$ 고정: $\xi_i\ge\max\{0,1-y_i\langle w,x_i\rangle\}$이고 목적이 $\xi$에 증가이므로 최적 $\xi_i$는 그 최댓값 = 힌지 손실. 따라서 두 문제의 최적값과 최적 $w$가 같습니다.
힌지는 $w$에 볼록이고 $\lVert x\rVert$-립시츠($\le\rho$). 소프트 SVM은 이 손실의 RLM이므로 오라클 부등식: $\E_S[L^{\mathrm{hinge}}_\cD(A(S))]\le L^{\mathrm{hinge}}_\cD(u)+\lambda\lVert u\rVert^2+\frac{2\rho^2}{\lambda m}$ (적합 항 + 안정성 $\frac{2\rho^2}{\lambda m}$).
힌지 $\ge$ 0–1 손실이 점별로 성립하므로 $L^{0-1}_\cD\le L^{\mathrm{hinge}}_\cD$, 기댓값을 취해 결론.`,
        rubric: R`
- 여유 변수 소거로 동치 — 5점
- 볼록·립시츠 확인 — 3점
- 오라클 부등식 적용 — 5점
- 0–1 ≤ 힌지로 결론 — 3점` },
    ],
  },
  {
    id: 'x3', roman: 'III', kind: '기말고사 범위', title: '다중 클래스, 트리, 온라인, 군집, 차원 축소', scopeText: '14–18 단원 · 교재 17–18, 21–23장',
    desc: '켄달 타우와 다중 클래스, 정보 이득, 반감과 리틀스톤 차원, k-평균과 라플라시안, PCA와 압축 센싱.',
    minutes: 100, plot: 'pca',
    problems: [
      { ch: 'ch14', type: 'num', lv: 1, pts: 6, q: R`클래스 $k=8$개에서 모든 쌍 방식이 학습하는 이진 분류기 수는?`, ans: '28', ansTex: R`\binom82`,
        sol: R`$\binom82=28$.` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 8, q: R`참 관련도 $y=(1,2,3,4)$, 예측 $y'=(2,1,4,3)$일 때 켄달 타우 손실은?`, ans: '1/3', ansTex: R`\tfrac{2}{12}\cdot2=\tfrac13`,
        sol: R`뒤바뀐 쌍은 $(1,2)$와 $(3,4)$ 두 개. $\frac2{4\cdot3}\cdot2=\frac13$.` },
      { ch: 'ch15', type: 'num', lv: 2, pts: 8, q: R`양성 4·음성 4인 노드를 (양성 3, 음성 0)과 (양성 1, 음성 4)로 나눌 때의 정보 이득(비트)은? (소수 넷째 자리)`, ans: '1-(5/8)*(0.2*log(5)/log(2)+0.8*log(1.25)/log(2))', ansTex: R`1-\tfrac58H_b(0.2)\approx0.5488`,
        sol: R`전 $H=1$. 왼쪽 순수(0). 오른쪽 $H_b(0.2)=-0.2\log_20.2-0.8\log_20.8=0.4644+0.2575=0.7219$. 가중합 $\frac58\cdot0.7219=0.4512$. 이득 $\approx0.5488$.` },
      { ch: 'ch16', type: 'num', lv: 1, pts: 6, q: R`$\lvert\cH\rvert=2^{20}$인 실현가능 온라인 문제에서 반감 알고리즘의 실수 상한은?`, ans: '20', ansTex: R`20`,
        sol: R`$\log_22^{20}=20$.` },
      { ch: 'ch16', type: 'mc', lv: 2, pts: 6, q: R`어떤 가설 클래스의 $(\VC,\Ldim)$으로 **가능한** 것은?`,
        choices: [R`$(3,2)$`, R`$(5,4)$`, R`$(2,\infty)$`, R`$(4,3)$`], ans: 2,
        sol: R`항상 $\VC\le\Ldim$이라 나머지는 불가능. 예: $[0,1]$ 위의 구간 클래스는 VC 차원 2이고, 부분클래스 $\{\one[x\le a]\}$가 문턱 함수와 같아 리틀스톤 차원이 무한입니다.` },
      { ch: 'ch17', type: 'num', lv: 1, pts: 6, q: R`군집 $\{(0,0),(4,0),(2,6)\}$의 k-평균 비용은?`, ans: '32', ansTex: R`8+8+16`,
        sol: R`무게중심 $(2,2)$. 제곱 거리 $8,8,16$, 합 32.` },
      { ch: 'ch17', type: 'num', lv: 2, pts: 8, q: R`가중치 1인 삼각형 그래프(세 꼭짓점 모두 연결)에서 $v=(1,1,-2)$일 때 $v^\top Lv$는?`, ans: '18', ansTex: R`0+9+9`,
        sol: R`간선마다 $(v_r-v_s)^2$: $(1-1)^2+(1+2)^2+(1+2)^2=18$. $v\perp\mathbf1$이고 $L=3I-\mathbf1\mathbf1^\top$이라 $3\lVert v\rVert^2=18$로도 확인됩니다.` },
      { ch: 'ch18', type: 'num', lv: 1, pts: 6, q: R`$A=\sum x_ix_i^\top$의 고윳값이 $6,3,1$일 때 $n=1$ PCA의 최소 복원 오차는?`, ans: '4', ansTex: R`3+1`,
        sol: R`버린 고윳값의 합 $3+1=4$.` },
      { ch: 'ch16', type: 'open', lv: 2, pts: 14, q: R`(a) 어떤 온라인 알고리즘도 실현가능한 예제열에서 $\Ldim(\cH)$번 이상 틀리게 만들 수 있음을 보이고, (b) $\VC(\cH)\le\Ldim(\cH)$임을 증명하세요.`,
        sol: R`
(a) 깊이 $D=\Ldim(\cH)$의 분쇄된 트리를 잡습니다. 적은 뿌리의 점을 내고, 학습기의 예측과 반대 레이블을 준 뒤 그 레이블의 가지로 내려가 다음 점을 냅니다. $D$라운드 모두 틀리고, 따라간 경로 $(y_1,\dots,y_D)$는 분쇄되었으므로 그것을 실현하는 $h\in\cH$가 있어 예제열이 실현가능합니다.
(b) $\{x_1,\dots,x_d\}$가 분쇄되면 깊이 $t$의 모든 노드에 $x_t$를 둔 깊이 $d$ 트리를 만듭니다. 경로 $(y_1,\dots,y_d)$는 레이블링 “$x_t\mapsto y_t$”이고 분쇄로 실현됩니다. 따라서 $\Ldim\ge d$.`,
        rubric: R`
- 적의 전략과 매번 틀림 — 4점
- 실현가능성 확인 — 3점
- 층마다 같은 점을 둔 트리 구성 — 5점
- 결론 — 2점` },
      { ch: 'ch17', type: 'open', lv: 2, pts: 16, q: R`그래프 라플라시안 $L=D-W$에 대해 $v^\top Lv=\frac12\sum_{r,s}W_{rs}(v_r-v_s)^2$을 증명하고, 이를 이용해 고윳값 0의 중복도가 연결 성분의 수와 같음을 보이세요.`,
        sol: R`
$v^\top Lv=\sum_rd_rv_r^2-\sum_{r,s}W_{rs}v_rv_s$, $d_r=\sum_sW_{rs}$, 대칭이라 $\sum_rd_rv_r^2=\frac12\sum_{r,s}W_{rs}(v_r^2+v_s^2)$. 합치면 $\frac12\sum W_{rs}(v_r-v_s)^2\ge0$.
$L\succeq0$이라 $Lv=0\iff v^\top Lv=0\iff W_{rs}>0$인 쌍마다 $v_r=v_s\iff v$가 각 연결 성분에서 상수. 이런 $v$의 공간은 성분 지시 벡터들(서로소 지지집합이라 일차독립)이 생성하므로 차원 = 성분 수. 대칭행렬이라 고윳값 0의 중복도 = 영공간 차원.`,
        rubric: R`
- 이차형식 전개와 대칭 이용 — 6점
- $Lv=0\iff v^\top Lv=0$ — 3점
- 성분에서 상수 ⇔ 영공간 — 4점
- 차원과 중복도 — 3점` },
      { ch: 'ch18', type: 'open', lv: 3, pts: 16, q: R`(a) $n<d$인 $W\in\mathbb R^{n\times d}$로는 모든 $x\in\mathbb R^d$를 $y=Wx$에서 복원할 수 없음을 보이세요. (b) $W$가 $(\varepsilon,2s)$-RIP ($\varepsilon<1$)이면 $s$-희소 $x$는 $\argmin_{Wv=Wx}\lVert v\rVert_0$로 유일하게 복원됨을 증명하세요.`,
        sol: R`
(a) 계수-영공간 정리로 $\dim\ker W\ge d-n>0$이라 $z\ne0$, $Wz=0$이 있습니다. $x$와 $x+z$는 같은 측정 $y$를 주므로 어떤 복원 규칙도 둘 중 하나는 틀립니다.
(b) 최소점 $\tilde x$는 $\lVert\tilde x\rVert_0\le\lVert x\rVert_0\le s$. $\tilde x\ne x$면 $h=x-\tilde x\ne0$은 $2s$-희소이고 $Wh=0$. RIP: $\lvert\lVert Wh\rVert^2/\lVert h\rVert^2-1\rvert=1\le\varepsilon<1$ — 모순. 따라서 $\tilde x=x$.`,
        rubric: R`
- 영공간이 0이 아님 — 4점
- 구별 불가능성 — 2점
- 차이 벡터의 $2s$-희소성 — 5점
- RIP와의 모순 — 5점` },
    ],
  },
  );
})();
