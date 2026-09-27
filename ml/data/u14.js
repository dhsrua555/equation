/* 14 다중 클래스, 순위, 구조적 예측 — UML 17장, 강의 노트 “Proof of Corollary 17.1: Multiclass SVM and Generalized Hinge Loss” */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 14, part: 'C', title: '다중 클래스, 순위, 구조적 예측', en: 'Multiclass, Ranking, and Complex Prediction', ref: 'UML 17장', plot: 'multiclass',
    fig: R`클래스마다의 점수 ⟨w, Ψ(x, y)⟩(가는 직선들)와 그 위 껍질 max_y(굵은 선): 가장 높은 점수의 클래스를 예측합니다`,
    tagline: R`레이블이 둘보다 많거나 순서·구조를 가지면, “가장 점수가 높은 답”을 고르는 하나의 선형 모형과 그에 맞는 힌지 손실로 통일할 수 있습니다.`,
    summary: R`이진 분류를 넘어 레이블이 $k$개인 **다중 클래스**, 레이블이 문자열·수열인 **구조적 출력**, 문서 목록을 정렬하는 **순위** 문제를 다룹니다. 가장 쉬운 방법은 이진 분류로 **환원**하는 것(일대다, 모든 쌍)이지만, 이진 학습기가 최종 목적을 모르기 때문에 근사 오차가 0인 문제에서도 실패할 수 있습니다. 대신 클래스별 특징 $\Psi(x,y)$를 두고 $h_w(x)=\argmax_y\langle w,\Psi(x,y)\rangle$를 직접 학습합니다. 틀린 대가를 **과제 손실** $\Delta(y',y)$로 일반화하고, 볼록 대리 손실인 **일반화 힌지 손실** $\max_{y'}[\Delta(y',y)+\langle w,\Psi(x,y')-\Psi(x,y)\rangle]$를 쓰면 **다중 클래스 SVM**이 되며, 이 손실이 $\Delta$를 위에서 누르고 볼록·립시츠라 13장의 오라클 부등식으로 기대 과제 위험이 $\min_{\lVert u\rVert\le B}L^{\mathrm{g-hinge}}(u)+\sqrt{8\rho^2B^2/m}$ 이하입니다(강의 노트의 따름정리 17.1). 구조적 출력에서는 argmax를 동적 계획법으로, 순위에서는 켄달 타우·NDCG 같은 손실과 그 볼록 대리 손실을, 이분 순위에서는 정밀도·재현율·F 점수 같은 다변량 측도를 다룹니다.`,
    goals: [
      R`일대다·모든 쌍 환원을 설명하고, 근사 오차가 0인데도 일대다가 실패하는 예를 만들 수 있다`,
      R`다중 벡터 구성 $\Psi(x,y)$로 선형 다중 클래스 예측기를 쓸 수 있다`,
      R`일반화 힌지 손실이 과제 손실을 위에서 누르고, 볼록이며 립시츠임을 증명할 수 있다`,
      R`다중 클래스 SVM의 일반화 상한(따름정리 17.1)을 13장의 결과로 유도할 수 있다`,
      R`구조적 출력의 argmax를 동적 계획법으로 계산하는 원리를 설명할 수 있다`,
      R`켄달 타우, NDCG, 정밀도·재현율·F 점수, precision@k를 계산할 수 있다`,
    ],
    secTitles: { '17.1': '환원', '17.2': '선형 예측기', '17.2b': '일반화 힌지', '17.2c': '다중 클래스 SVM', '17.3': '구조적 출력', '17.4': '순위', '17.5': '이분 순위' },
    sections: [
      { k: '17.1', p: 227, title: '이진 분류로의 환원: 일대다와 모든 쌍', body: R`
$\cY=\{1,\dots,k\}$.

- **일대다**(One-versus-All): 클래스 $i$마다 “$i$ 대 나머지” 이진 분류기 $h_i$를 학습하고 $h(x)=\argmax_ih_i(x)$. 반공간이면 $\sign$ 대신 실수값 $\langle w_i,x\rangle$을 신뢰도로 씁니다.
- **모든 쌍**(All-Pairs): $i<j$인 쌍마다 $i$와 $j$의 예제만으로 $h_{i,j}$를 학습하고, 가장 많이 “이긴” 클래스를 예측합니다. 분류기가 $\binom k2$개입니다.

:::warn 환원의 대가
이진 학습기는 자기 출력이 다중 클래스 예측에 쓰인다는 것을 모릅니다. 예: 평면 위에서 세 클래스가 한 줄로 놓인 세 원판(확률 40%, 20%, 40%)이면, “가운데 클래스 대 나머지”를 가르는 **최선의 반공간은 전부 음성**이라 일대다는 가운데 클래스를 모두 틀릴 수 있습니다. 그런데 $h(x)=\argmax_i\langle w_i,x\rangle$ 꼴의 예측기 중에는 세 클래스를 완벽히 가르는 것이 있습니다(가운데 클래스에 “가운데 방향” $w_2$를 주면 됨). **근사 오차는 0인데 환원이 그것을 찾지 못합니다.**
:::
` },
      { k: '17.2', p: 230, title: '선형 다중 클래스 예측기', body: R`
클래스에 따라 달라지는 특징 사상 $\Psi:\cX\times\cY\to\mathbb R^d$를 두고
$$h_w(x)=\argmax_{y\in\cY}\langle w,\Psi(x,y)\rangle.$$
$\langle w,\Psi(x,y)\rangle$은 “$x$에 레이블 $y$가 얼마나 어울리는가”의 점수입니다.

:::def 다중 벡터 구성
$x\in\mathbb R^n$, $\cY=[k]$이면 $\Psi(x,y)\in\mathbb R^{nk}$는 $y$번째 블록에 $x$, 나머지 블록에 0을 둔 벡터:
$$\Psi(x,y)=[\underbrace{0,\dots,0}_{(y-1)n},\underbrace{x_1,\dots,x_n}_{n},\underbrace{0,\dots,0}_{(k-y)n}].$$
그러면 $w=[w_1;\dots;w_k]$에 대해 $\langle w,\Psi(x,y)\rangle=\langle w_y,x\rangle$ — 클래스마다 가중치 벡터가 하나씩인 익숙한 모형입니다.
:::

**비용 민감 분류.** 모든 실수가 같은 대가가 아닐 수 있습니다(개를 고양이로 착각하는 것보다 트럭으로 착각하는 것이 나쁨). **과제 손실** $\Delta:\cY\times\cY\to\mathbb R_+$, $\Delta(y,y)=0$으로 위험을 $L^\Delta_\cD(h)=\E[\Delta(h(x),y)]$로 둡니다. 0–1 손실은 $\Delta(y',y)=\one[y'\ne y]$.

**ERM.** 실현가능하면 “$\forall i,\ \forall y\ne y_i:\langle w,\Psi(x_i,y_i)-\Psi(x_i,y)\rangle>0$”이 선형 부등식들이라 선형계획법으로 풀립니다. 실현가능하지 않으면 ERM은 계산적으로 어렵고, 볼록 대리 손실이 필요합니다.

:::note 심층 신경망 과목과의 연결
다중 벡터 구성의 점수 $\langle w_y,x\rangle$에 소프트맥스를 씌우고 교차 엔트로피로 학습한 것이 소프트맥스 회귀입니다[[@dnn:ch06:6.1|클래스마다 가중치 벡터 하나.]]. 이 장은 로그 손실 대신 힌지형 손실을 씁니다.
:::
` },
      { k: '17.2b', p: 233, src: '강의 노트 · Corollary 17.1 (Lemma A, B)', title: '일반화 힌지 손실', body: R`
:::key 일반화 힌지 손실의 성질
$$\ell^{\mathrm{g-hinge}}(w,(x,y))=\max_{y'\in\cY}\Big[\Delta(y',y)+\big\langle w,\Psi(x,y')-\Psi(x,y)\big\rangle\Big].$$
1. **상한**: $\Delta(h_w(x),y)\le\ell^{\mathrm{g-hinge}}(w,(x,y))$.
2. **볼록**: $w$의 볼록함수이다.
3. **립시츠**: $\lVert\Psi(x,y)\rVert\le\rho/2$ ($\forall x,y$)이면 $\rho$-립시츠이다.
:::

:::hand 강의 노트 — 세 성질
**1.** $h_w(x)$는 점수의 argmax라 $\langle w,\Psi(x,h_w(x))-\Psi(x,y)\rangle\ge0$. 그러므로 $\Delta(h_w(x),y)\le\Delta(h_w(x),y)+\langle w,\Psi(x,h_w(x))-\Psi(x,y)\rangle$이고, 우변은 $y'=h_w(x)$일 때의 항이라 최댓값 이하입니다.

**2.** $f_{y'}(w)=\Delta(y',y)+\langle w,\Psi(x,y')-\Psi(x,y)\rangle$는 $w$의 아핀 함수. 볼록함수들의 최댓값은 볼록.

**3.** $\lvert f_{y'}(w)-f_{y'}(u)\rvert\le\lVert w-u\rVert\lVert\Psi(x,y')-\Psi(x,y)\rVert\le\rho\lVert w-u\rVert$ (삼각부등식으로 $\le\frac\rho2+\frac\rho2$). 공통 립시츠 상수를 가진 함수들의 최댓값도 같은 상수로 립시츠.
:::

$k=2$, $\Psi(x,y)=\frac{yx}2$, $\Delta$=0–1 손실이면 $\ell^{\mathrm{g-hinge}}=\max\{0,1-y\langle w,x\rangle\}$ — 이진 힌지 손실로 돌아갑니다.
` },
      { k: '17.2c', p: 234, src: '강의 노트 · Corollary 17.1', title: '다중 클래스 SVM과 SGD', body: R`
:::def 다중 클래스 SVM
$$w_S\in\argmin_w\Big(\lambda\lVert w\rVert^2+\frac1m\sum_{i=1}^m\max_{y'\in\cY}\big[\Delta(y',y_i)+\langle w,\Psi(x_i,y')-\Psi(x_i,y_i)\rangle\big]\Big),\qquad\text{출력 }h_{w_S}.$$
:::

:::key 다중 클래스 SVM의 일반화 상한
$\lVert\Psi(x,y)\rVert\le\rho/2$, $B>0$, $\lambda=\sqrt{\frac{2\rho^2}{B^2m}}$이면
$$\E_S\big[L^\Delta_\cD(h_{w_S})\big]\le\E_S\big[L^{\mathrm{g-hinge}}_\cD(w_S)\big]\le\min_{\lVert u\rVert\le B}L^{\mathrm{g-hinge}}_\cD(u)+\sqrt{\frac{8\rho^2B^2}m}.$$
:::

첫 부등식은 상한 성질의 기댓값, 둘째는 “볼록·$\rho$-립시츠 손실의 RLM”이라 13장 오라클 부등식 $L(u)+\lambda\lVert u\rVert^2+\frac{2\rho^2}{\lambda m}$에 $\lVert u\rVert\le B$와 이 $\lambda$를 넣은 것입니다: $\lambda B^2=\frac{2\rho^2}{\lambda m}=\rho B\sqrt{2/m}$, 합 $\sqrt{8\rho^2B^2/m}$. **클래스 수나 차원이 아니라** 특징 노름 $\rho$와 비교 대상 노름 $B$만 들어갑니다.

**SGD.** 일반화 힌지 손실의 부분기울기는 최댓값을 이루는 $\hat y=\argmax_{y'}[\Delta(y',y)+\langle w,\Psi(x,y')-\Psi(x,y)\rangle]$에서
$$v=\Psi(x,\hat y)-\Psi(x,y).$$
즉 “가장 위반이 큰 오답 쪽으로 밀어내고 정답 쪽으로 당기는” 갱신이며, 14장의 SGD 보장($\E[L^{\mathrm{g-hinge}}_\cD(\bar w)]\le\min_{\lVert u\rVert\le B}L^{\mathrm{g-hinge}}_\cD(u)+\sqrt{\rho^2B^2/T}$)이 그대로 적용됩니다.
` },
      { k: '17.3', p: 236, title: '구조적 출력 예측', body: R`
**필기 인식** 예: 입력 $x$는 $r$개 문자 이미지의 열, 출력 $y\in\Sigma^r$는 단어. $\lvert\cY\rvert=\lvert\Sigma\rvert^r$이라 모든 $y$를 나열해 argmax를 구할 수 없습니다.

특징을 **국소적**으로 설계하면 됩니다:
$$\Psi(x,y)=\sum_{t=1}^r\phi_1(x_t,y_t)+\sum_{t=2}^r\phi_2(y_{t-1},y_t)$$
(각 위치의 “이미지–문자” 특징 + 이웃 문자 쌍의 특징). 그러면 점수가 사슬 모양으로 분해되어

:::key 구조적 출력의 argmax
$V_t(s)=$ “길이 $t$까지의 접두사 중 $y_t=s$로 끝나는 것의 최대 점수”라 하면
$$V_1(s)=\langle w,\phi_1(x_1,s)\rangle,\qquad V_t(s)=\langle w,\phi_1(x_t,s)\rangle+\max_{s'\in\Sigma}\big[V_{t-1}(s')+\langle w,\phi_2(s',s)\rangle\big],$$
$\max_y\langle w,\Psi(x,y)\rangle=\max_sV_r(s)$이고 되짚기로 argmax를 복원한다. 계산량 $O(r\lvert\Sigma\rvert^2)$.
:::

이것이 은닉 마르코프 모형의 비터비 알고리즘과 같은 동적 계획법입니다. SGD의 부분기울기에 필요한 “손실을 더한 argmax”도 $\Delta$가 위치별로 분해되면(예: 틀린 글자 수) 같은 방식으로 계산됩니다.
` },
      { k: '17.4', p: 238, title: '순위', body: R`
질의 하나에 문서 $r$개 $\bar x=(x_1,\dots,x_r)$가 주어지고, 레이블 $y\in\mathbb R^r$는 관련도입니다. 예측도 점수 벡터 $y'\in\mathbb R^r$이고 순서만 의미가 있습니다.

:::key 순위 손실과 대리 손실
- **켄달 타우 손실**: 순서가 뒤바뀐 쌍의 비율
$$\Delta(y',y)=\frac2{r(r-1)}\sum_{i<j}\one\big[\sign(y'_i-y'_j)\ne\sign(y_i-y_j)\big].$$
- **NDCG**: 상위 위치에 관련도 높은 문서가 올수록 큰 점수. $\mathrm{DCG}=\sum_{p}\frac{\text{위치 }p\text{ 문서의 관련도}}{\log_2(p+1)}$ (보통 상위 $k$개까지), $\mathrm{NDCG}=\mathrm{DCG}/\mathrm{DCG}_{\text{이상적}}$, 손실은 $1-\mathrm{NDCG}$.
- **선형 순위 예측기** $h_w(\bar x)=(\langle w,x_1\rangle,\dots,\langle w,x_r\rangle)$에서 켄달 타우의 볼록 대리 손실: $\one[z\le0]\le\log_2(1+e^{-z})$를 쌍마다 써서
$$\frac2{r(r-1)}\sum_{i<j}\log_2\!\Big(1+e^{-\sign(y_i-y_j)\langle w,x_i-x_j\rangle}\Big).$$
:::

켄달 타우는 모든 쌍을 똑같이 세지만, 검색에서는 **위쪽**의 순서가 훨씬 중요합니다. NDCG의 $\log_2(p+1)$ 할인이 그것을 반영합니다.

:::ex 예제 — 켄달 타우
참 관련도 $y=(3,2,1)$, 예측 $y'=(2,3,1)$. 켄달 타우 손실은?
---
쌍 $(1,2)$: 참 $3>2$, 예측 $2<3$ — 뒤바뀜. $(1,3)$: $3>1$, $2>1$ — 같음. $(2,3)$: $2>1$, $3>1$ — 같음. 뒤바뀐 쌍 1개, 전체 3쌍이라 $\frac2{3\cdot2}\cdot1=\frac13$.
:::
` },
      { k: '17.5', p: 243, title: '이분 순위와 다변량 성능 측도', body: R`
레이블이 $\pm1$(관련/무관)뿐인 순위를 **이분 순위**라 합니다(예: 사기 탐지, 희귀 질환 선별). 양성이 드물면 정확도는 무의미하므로(모두 음성이라 해도 99%) 다음 측도를 씁니다. 문턱 $\theta$ 이상을 양성으로 예측할 때 $a$=참 양성, $b$=거짓 양성, $c$=거짓 음성:

:::key 다변량 성능 측도
$$\text{정밀도}=\frac a{a+b},\qquad\text{재현율}=\frac a{a+c},\qquad F_\beta=\frac{(1+\beta^2)\,a}{(1+\beta^2)\,a+\beta^2c+b}.$$
$F_1$은 정밀도와 재현율의 조화평균. **precision@k**, **recall@k**는 점수 상위 $k$개를 양성으로 예측했을 때의 값.
:::

이 측도들은 **표본 전체**에 대해 정의되어 예제별 손실의 평균으로 쓸 수 없습니다(다변량). 교재는 $\bar x=(x_1,\dots,x_r)$ 전체를 하나의 입력으로, 레이블 벡터 $y\in\{\pm1\}^r$를 하나의 출력으로 보는 구조적 예측으로 바꾸고, 가능한 예측 $y'$을 “점수 상위 몇 개를 양성으로 할지”로 제한합니다. 그러면 일반화 힌지형 손실의 argmax가 **점수 정렬 후 문턱 $r+1$가지를 훑는 것**으로 $O(r\log r)$에 계산되어 SGD로 학습할 수 있습니다.

:::ex 예제 — F₁
양성 10개 중 점수 상위 8개를 양성으로 예측했더니 그중 6개가 진짜 양성이었다. 정밀도, 재현율, $F_1$은?
---
$a=6$, $b=2$, $c=4$. 정밀도 $6/8=0.75$, 재현율 $6/10=0.6$, $F_1=\frac{2\cdot6}{2\cdot6+4+2}=\frac{12}{18}\approx0.667$ (조화평균 $\frac{2\cdot0.75\cdot0.6}{1.35}$과 같음).
:::
` },
    ],
    problems: [
      { sec: '17.1', type: 'num', lv: 1, q: R`클래스가 $k=6$개일 때 모든 쌍 방식이 학습하는 이진 분류기의 수는?`, ans: '15', ansTex: R`\binom62=15`,
        sol: R`$\binom62=15$. 일대다는 6개.` },
      { sec: '17.1', type: 'mc', lv: 2, q: R`일대다 환원이 근사 오차 0인 문제에서도 실패할 수 있는 이유는?`,
        choices: [R`이진 학습기가 너무 복잡해서`, R`각 이진 학습기가 “$i$ 대 나머지”의 이진 오차만 최소로 하고, 그 출력이 argmax에 쓰인다는 것을 모르기 때문`, R`클래스 수가 많아서`, R`표본이 부족해서`], ans: 1,
        sol: R`가운데 클래스처럼 “나머지”에 둘러싸인 클래스는 이진 문제에서 전부 음성이 최선일 수 있습니다.` },
      { sec: '17.2', type: 'num', lv: 1, q: R`다중 벡터 구성에서 $x\in\mathbb R^{50}$, 클래스 $k=10$이면 $w$의 차원은?`, ans: '500', ansTex: R`nk=500`,
        sol: R`블록 $k$개 × $n$차원 $=500$.` },
      { sec: '17.2', type: 'num', lv: 2, q: R`$w_1=(1,0)$, $w_2=(0,1)$, $w_3=(-1,-1)$ (다중 벡터 구성)일 때 $x=(2,3)$의 예측 클래스는?`, ans: '2', ansTex: R`\argmax\{2,3,-5\}=2`,
        sol: R`점수 $\langle w_1,x\rangle=2$, $\langle w_2,x\rangle=3$, $\langle w_3,x\rangle=-5$. 최대는 클래스 2.` },
      { sec: '17.2b', type: 'num', lv: 2, q: R`위 문제에서 정답이 $y=1$이고 $\Delta$=0–1 손실일 때 일반화 힌지 손실 $\max_{y'}[\Delta(y',1)+\langle w,\Psi(x,y')-\Psi(x,1)\rangle]$은?`, ans: '2', ansTex: R`\max\{0,\ 1+1,\ 1-7\}=2`,
        sol: R`$y'=1$: $0+0=0$. $y'=2$: $1+(3-2)=2$. $y'=3$: $1+(-5-2)=-6$. 최대 2. 과제 손실 $\Delta(h_w(x),1)=\Delta(2,1)=1\le2$.` },
      { sec: '17.2b', type: 'mc', lv: 2, q: R`$\lVert\Psi(x,y)\rVert\le\rho/2$일 때 일반화 힌지 손실이 $\rho$-립시츠인 이유는?`,
        choices: [R`$\Delta$가 유계라서`, R`각 항 $\langle w,\Psi(x,y')-\Psi(x,y)\rangle$의 기울기 노름이 $\lVert\Psi(x,y')-\Psi(x,y)\rVert\le\rho$이고, 최댓값은 공통 립시츠 상수를 보존하므로`, R`볼록이라서`, R`클래스가 유한해서`], ans: 1,
        sol: R`삼각부등식 $\frac\rho2+\frac\rho2=\rho$. $\Delta$는 $w$와 무관한 상수라 립시츠 상수에 영향이 없습니다.` },
      { sec: '17.2c', type: 'num', lv: 2, q: R`$\rho=2$, $B=5$, $m=10000$일 때 다중 클래스 SVM 상한의 복잡도 항 $\sqrt{8\rho^2B^2/m}$은? (소수 넷째 자리)`, ans: 'sqrt(800/10000)', ansTex: R`\sqrt{0.08}\approx0.2828`,
        sol: R`$8\cdot4\cdot25=800$, $\sqrt{800/10^4}=\sqrt{0.08}\approx0.2828$.` },
      { sec: '17.3', type: 'num', lv: 2, q: R`알파벳 $\lvert\Sigma\rvert=26$, 길이 $r=10$인 단어의 argmax를 동적 계획법으로 구할 때 필요한 “이전 문자 × 현재 문자” 조합 계산 횟수 $r\lvert\Sigma\rvert^2$은?`, ans: '6760', ansTex: R`10\cdot676`,
        sol: R`$10\times26^2=6760$. 전부 나열하면 $26^{10}\approx1.4\times10^{14}$가지입니다.` },
      { sec: '17.4', type: 'num', lv: 2, q: R`참 관련도 $y=(4,3,2,1)$, 예측 점수 $y'=(1,2,3,4)$(완전히 거꾸로)일 때 켄달 타우 손실은?`, ans: '1', ansTex: R`1`,
        sol: R`모든 6쌍이 뒤바뀌므로 $\frac2{4\cdot3}\cdot6=1$. 최대 손실입니다.` },
      { sec: '17.4', type: 'num', lv: 3, q: R`관련도 $(3,0,2)$인 문서들을 예측 순위 1, 2, 3위로 보여 줄 때 $\mathrm{DCG}=\sum_p\mathrm{rel}_p/\log_2(p+1)$은? (소수 넷째 자리)`, ans: '3+0+2/2', ansTex: R`3+0+\tfrac22=4`,
        sol: R`$\frac3{\log_22}+\frac0{\log_23}+\frac2{\log_24}=3+0+1=4$. 이상적 순서 $(3,2,0)$의 DCG는 $3+\frac2{\log_23}\approx4.262$이라 NDCG $\approx0.939$.` },
      { sec: '17.5', type: 'num', lv: 1, q: R`참 양성 12, 거짓 양성 4, 거짓 음성 8일 때 $F_1$은? (소수 넷째 자리)`, ans: '24/36', ansTex: R`\tfrac{24}{24+8+4}=\tfrac23`,
        sol: R`$F_1=\frac{2a}{2a+b+c}=\frac{24}{36}\approx0.6667$. 정밀도 0.75, 재현율 0.6.` },
      { sec: '17.5', type: 'mc', lv: 2, q: R`양성이 1%뿐인 자료에서 모두 음성이라 예측하는 분류기에 대해 옳은 것은?`,
        choices: [R`정확도 99%이므로 좋은 분류기다`, R`재현율 0, $F_1$ 0 — 다변량 측도로 보면 쓸모없다`, R`정밀도가 1이다`, R`켄달 타우 손실이 0이다`], ans: 1,
        sol: R`참 양성이 0이라 재현율 0, 정밀도는 정의되지 않고(0/0), $F_1=0$입니다.` },
      { sec: '17.2b', type: 'open', lv: 2, proof: true, q: R`일반화 힌지 손실 $\ell(w,(x,y))=\max_{y'}[\Delta(y',y)+\langle w,\Psi(x,y')-\Psi(x,y)\rangle]$이 (1) $\Delta(h_w(x),y)$의 상한이고 (2) $w$의 볼록함수이며 (3) $\lVert\Psi\rVert\le\rho/2$이면 $\rho$-립시츠임을 증명하세요.`,
        sol: R`
(1) $h_w(x)\in\argmax_{y'}\langle w,\Psi(x,y')\rangle$이므로 $\langle w,\Psi(x,h_w(x))-\Psi(x,y)\rangle\ge0$. 따라서 $\Delta(h_w(x),y)\le\Delta(h_w(x),y)+\langle w,\Psi(x,h_w(x))-\Psi(x,y)\rangle\le\max_{y'}[\cdots]$.
(2) $f_{y'}(w)=\Delta(y',y)+\langle w,\Psi(x,y')-\Psi(x,y)\rangle$는 아핀. 점별 최댓값은 볼록.
(3) $\lvert f_{y'}(w)-f_{y'}(u)\rvert=\lvert\langle w-u,\Psi(x,y')-\Psi(x,y)\rangle\rvert\le\lVert w-u\rVert(\frac\rho2+\frac\rho2)$. $\lvert\max_{y'}f_{y'}(w)-\max_{y'}f_{y'}(u)\rvert\le\max_{y'}\lvert f_{y'}(w)-f_{y'}(u)\rvert\le\rho\lVert w-u\rVert$.`,
        rubric: R`
- argmax 성질로 상한 — 4점
- 아핀 함수의 최댓값으로 볼록 — 2점
- 각 항의 립시츠성과 최댓값의 립시츠 보존 — 4점` },
      { sec: '17.2c', type: 'open', lv: 2, proof: true, q: R`$\lVert\Psi(x,y)\rVert\le\rho/2$, $\lambda=\sqrt{2\rho^2/(B^2m)}$인 다중 클래스 SVM에 대해 $\E_S[L^\Delta_\cD(h_{w_S})]\le\min_{\lVert u\rVert\le B}L^{\mathrm{g-hinge}}_\cD(u)+\sqrt{8\rho^2B^2/m}$을 유도하세요. (RLM의 오라클 부등식은 써도 됩니다.)`,
        sol: R`
상한 성질의 기댓값: $L^\Delta_\cD(h_w)\le L^{\mathrm{g-hinge}}_\cD(w)$ (모든 $w$), 따라서 $\E_S[L^\Delta_\cD(h_{w_S})]\le\E_S[L^{\mathrm{g-hinge}}_\cD(w_S)]$.
다중 클래스 SVM은 볼록·$\rho$-립시츠 손실의 RLM이므로 모든 $u$에서 $\E_S[L^{\mathrm{g-hinge}}_\cD(w_S)]\le L^{\mathrm{g-hinge}}_\cD(u)+\lambda\lVert u\rVert^2+\frac{2\rho^2}{\lambda m}$.
$\lVert u\rVert\le B$면 $\le L(u)+\lambda B^2+\frac{2\rho^2}{\lambda m}$. $\lambda=\sqrt{2\rho^2/(B^2m)}$에서 $\lambda B^2=\rho B\sqrt{2/m}=\frac{2\rho^2}{\lambda m}$, 합 $2\rho B\sqrt{2/m}=\sqrt{8\rho^2B^2/m}$. $\lVert u\rVert\le B$에 대해 최소를 취하면 결론.`,
        rubric: R`
- 상한 성질로 첫 부등식 — 3점
- 볼록·립시츠 RLM으로 오라클 부등식 적용 — 3점
- $\lambda$ 대입 계산 — 4점` },
    ],
  });
})();
