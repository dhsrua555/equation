/* 증명 — Part B (1): 07 선형 예측기, 08 부스팅, 09 볼록 학습, 10 규제와 안정성
   src가 있는 항목은 김경수 교수님의 증명 노트를 따라간 것입니다. 노트에서 생략된 단계를 채우고, 바로잡을 곳은 note에 적었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 07
  { ch: 'ch07', id: 'perceptron', title: '퍼셉트론 수렴 정리', keys: ['퍼셉트론 수렴 정리'],
    tags: 'perceptron convergence theorem 9.1 mistake bound margin Cauchy-Schwarz 퍼셉트론 수렴 실수 상한',
    stmt: R`분리 가능한 자료에서 $B=\min\{\lVert w\rVert:y_i\langle w,x_i\rangle\ge1\ \forall i\}$, $R=\max_i\lVert x_i\rVert$이면 퍼셉트론은 많아야 $(RB)^2$번 갱신하고 멈추며, 멈출 때 모든 $i$에서 $y_i\langle w,x_i\rangle>0$.`,
    body: R`
$w^\ast$를 최솟값 $B$를 이루는 벡터라 합시다($\{w:y_i\langle w,x_i\rangle\ge1\}$은 닫힌 볼록 집합이라 노름 최소점이 존재). 갱신이 $T$번 일어났고, $t$번째 갱신은 예제 $i_t$에서 일어났다고 합시다.

**1. 정렬은 선형으로 자란다.** $\langle w^\ast,w^{(t+1)}\rangle-\langle w^\ast,w^{(t)}\rangle=y_{i_t}\langle w^\ast,x_{i_t}\rangle\ge1$. $w^{(1)}=0$에서 더하면 $\langle w^\ast,w^{(T+1)}\rangle\ge T$.

**2. 노름은 제곱근으로 자란다.** 갱신 조건 $y_{i_t}\langle w^{(t)},x_{i_t}\rangle\le0$을 쓰면
$$\lVert w^{(t+1)}\rVert^2=\lVert w^{(t)}\rVert^2+2y_{i_t}\langle w^{(t)},x_{i_t}\rangle+\lVert x_{i_t}\rVert^2\le\lVert w^{(t)}\rVert^2+R^2,$$
따라서 $\lVert w^{(T+1)}\rVert^2\le TR^2$.

**3. 코시–슈바르츠.** $T\le\langle w^\ast,w^{(T+1)}\rangle\le\lVert w^\ast\rVert\lVert w^{(T+1)}\rVert\le B\sqrt TR$이므로 $\sqrt T\le RB$, 즉 $T\le(RB)^2$.

**4. 멈춤.** 갱신이 유한 번이므로 어느 순간 갱신할 예제가 없고, 그것이 곧 모든 $i$에서 $y_i\langle w,x_i\rangle>0$이라는 뜻입니다.`,
    note: R`상한은 차원과 무관하고 $(R/\gamma)^2$ ($\gamma=1/B$는 정규화된 최대 마진)에만 기댑니다. 15장 하드 SVM의 표본 복잡도에 같은 양이 다시 나옵니다.` },
  { ch: 'ch07', id: 'perceptronTight', title: '퍼셉트론 상한의 등호: 표준기저 예', keys: ['퍼셉트론 수렴 정리'], src: '강의 노트 · Exercise 9.3',
    tags: 'perceptron tightness standard basis exercise 9.3 lower bound 퍼셉트론 등호 표준기저',
    stmt: R`모든 $m$에 대해 $d=m$, $x_i=e_i$, $y_i=1$로 두면 $R=1$, $B=\sqrt m$이고 퍼셉트론(순서대로)은 정확히 $m=(RB)^2$번 갱신한다.`,
    body: R`
**$R$과 $B$.** $\lVert e_i\rVert=1$이라 $R=1$. 제약 $y_i\langle w,e_i\rangle=w_i\ge1$ ($\forall i$) 아래에서 $\lVert w\rVert^2=\sum_iw_i^2\ge m$이고 $w=(1,\dots,1)$이 등호를 이루므로 $B=\sqrt m$. 따라서 $(RB)^2=m$.

**갱신 횟수 (귀납법).** 주장: $i$번째 예제 직전에 $w=\sum_{j<i}e_j$. $i=1$이면 $w=0$(빈 합). 성립한다고 하면 $y_i\langle w,e_i\rangle=\sum_{j<i}\langle e_j,e_i\rangle=0\le0$이라 갱신하고, $w\leftarrow w+e_i=\sum_{j\le i}e_j$. 따라서 $m$개 예제 모두에서 갱신합니다.

**수렴.** $m$번 뒤 $w=(1,\dots,1)$이고 모든 $i$에서 $\langle w,e_i\rangle=1>0$이므로 더 갱신하지 않습니다. 정확히 $m$번.`,
    note: R`차원이 $m$으로 커지는 예입니다. 다음 증명은 차원을 3으로 고정하고도 같은 등호를 만듭니다.` },
  { ch: 'ch07', id: 'perceptronTight3', title: '퍼셉트론 상한의 등호: ℝ³의 예', keys: ['퍼셉트론 수렴 정리'], src: '강의 노트 · Exercise 9.4',
    tags: 'perceptron tight example R3 exercise 9.4 circles construction 퍼셉트론 3차원 원 교점',
    stmt: R`모든 $m$에 대해 $\mathbb R^3$의 예제열 $(x_i,y_i)$가 있어 $(RB)^2=m$이고 퍼셉트론이 정확히 $m$번 갱신한다.`,
    body: R`
**1. 평면의 보조 점열.** $r_i=i(m-i)$ ($0\le i\le m$). $s_0=0$에서 시작해 $\lVert s_i\rVert=\sqrt{r_i}$, $\lVert s_i-s_{i-1}\rVert=\sqrt{m-1}$인 $s_i\in\mathbb R^2$를 차례로 잡습니다. 반지름 $\sqrt{r_i}$인 원(중심 0)과 반지름 $\sqrt{m-1}$인 원(중심 $s_{i-1}$)이 만나려면 $\lvert\sqrt{r_i}-\sqrt{r_{i-1}}\rvert\le\sqrt{m-1}\le\sqrt{r_i}+\sqrt{r_{i-1}}$이면 됩니다.
- 왼쪽: $\lvert\sqrt a-\sqrt b\rvert\le\sqrt{\lvert a-b\rvert}$이고 $\lvert r_i-r_{i-1}\rvert=\lvert m-2i+1\rvert\le m-1$.
- 오른쪽: $i=1$이나 $i=m$이면 합이 정확히 $\sqrt{m-1}$; $2\le i\le m-1$이면 $r_i=i(m-i)\ge m-1$이라 $\sqrt{r_i}\ge\sqrt{m-1}$.
$r_m=0$이므로 $s_m=0$.

**2. 예제.** $u_i=s_i-s_{i-1}$, $x_i=(u_i,1)\in\mathbb R^3$, $y_i=1$. $\lVert x_i\rVert^2=(m-1)+1=m$이라 $R=\sqrt m$.

**3. $B=1$.** $w=(0,0,1)$은 $y_i\langle w,x_i\rangle=1$을 만족해 $B\le1$. 역으로 $(p,c)$가 모든 $i$에서 $\langle p,u_i\rangle+c\ge1$이면 더해서 $\langle p,\sum u_i\rangle+mc\ge m$, 그런데 $\sum_iu_i=s_m-s_0=0$이라 $c\ge1$, $\lVert(p,c)\rVert\ge1$. 따라서 $B=1$, $(RB)^2=m$.

**4. 매번 갱신.** $i$번째 예제 직전 $w=\sum_{j<i}x_j=(s_{i-1},i-1)$이라 하면(귀납) 여유는 $\langle s_{i-1},u_i\rangle+(i-1)$. $\lVert s_i\rVert^2=\lVert s_{i-1}\rVert^2+2\langle s_{i-1},u_i\rangle+\lVert u_i\rVert^2$에서
$$2\langle s_{i-1},u_i\rangle=i(m-i)-(i-1)(m-i+1)-(m-1)=-2(i-1).$$
그러므로 여유 $=0\le0$ — 갱신하고 $w=(s_i,i)$. $m$번 모두 갱신하고, 정리 상한이 $m$이므로 정확히 $m$번.`,
    note: R`노트가 강조하듯 이 예에서는 증명의 세 부등식(정렬 $\ge1$씩, 노름 $\le R^2$씩, 코시–슈바르츠)이 모두 등호입니다: 매 갱신의 여유가 0, $\lVert x_i\rVert^2=R^2$, 끝에서 $w=(0,0,m)=mw^\ast$로 $w^\ast$와 평행.` },
  { ch: 'ch07', id: 'vcHalfspace', title: '반공간의 VC 차원', keys: ['반공간의 VC 차원'],
    tags: 'VC dimension halfspaces homogeneous linear dependence Radon 반공간 동차 일차종속',
    stmt: R`$\mathbb R^d$의 동차 반공간 $\{x\mapsto\sign\langle w,x\rangle\}$의 VC 차원은 $d$, 비동차 반공간은 $d+1$이다.`,
    body: R`
부호 관례: $\langle w,x\rangle>0$이면 $+1$, 그 밖($\le0$)은 $-1$. (반대 관례에서도 같은 논증이 됩니다.)

**동차, $\ge d$.** $e_1,\dots,e_d$와 레이블 $y\in\{\pm1\}^d$에 대해 $w=y$로 두면 $\langle w,e_i\rangle=y_i$라 $\sign=y_i$.

**동차, $\le d$.** $x_1,\dots,x_{d+1}\in\mathbb R^d$는 일차종속이라 모두 0은 아닌 $a_i$로 $\sum_ia_ix_i=0$. $I=\{i:a_i>0\}$, $J=\{j:a_j<0\}$. $I\ne\emptyset$이라 해도 됩니다(아니면 $a$를 $-a$로). $I$에 $+1$, 나머지에 $-1$을 주는 레이블링을 실현하는 $w$가 있다고 하면
$$0<\sum_{i\in I}a_i\langle w,x_i\rangle=\Big\langle w,\sum_{i\in I}a_ix_i\Big\rangle=\Big\langle w,\sum_{j\in J}\lvert a_j\rvert x_j\Big\rangle=\sum_{j\in J}\lvert a_j\rvert\langle w,x_j\rangle\le0.$$
($J=\emptyset$이면 가운데가 $\langle w,0\rangle=0$.) 모순이므로 어떤 $d+1$개 점도 분쇄되지 않습니다.

**비동차.** $x\mapsto(1,x)$, $(b,w)$로 $\mathbb R^{d+1}$의 동차 반공간이 되므로 $\le d+1$. $\ge d+1$: $0,e_1,\dots,e_d$에 레이블 $y_0,y_1,\dots,y_d$를 주려면 $b=y_0/2$, $w_i=y_i-y_0/2$로 두면 $\langle w,0\rangle+b=y_0/2$, $\langle w,e_i\rangle+b=y_i$ — 부호가 맞습니다.`,
    note: R`기본 정리에 넣으면 반공간의 불가지 표본 복잡도는 $\Theta((d+\ln(1/\delta))/\varepsilon^2)$입니다. 차원에 비례한다는 이 결론을 마진 가정으로 뛰어넘는 것이 15장입니다.` },
  { ch: 'ch07', id: 'pinv', title: '최소제곱 ERM과 유사역행렬: 최소 노름 해', keys: ['최소제곱 해와 유사역행렬'], src: '강의 노트 · 9.2.1',
    tags: 'least squares normal equation Moore-Penrose pseudoinverse minimum norm solution range null space 최소제곱 유사역행렬 최소 노름',
    stmt: R`$L_S(w)=\frac1m\sum_i(\langle w,x_i\rangle-y_i)^2$, $A=\sum x_ix_i^\top$, $b=\sum y_ix_i$이면 (1) $w$가 최소점 $\iff Aw=b$, (2) $b\in\operatorname{range}(A)$, (3) 최소점 집합 $=A^+b+\operatorname{null}(A)$, (4) $A^+b$는 노름이 가장 작은 유일한 최소점.`,
    body: R`
**1. 이차식과 정규방정식.** $L_S(w)=\frac1m\big(w^\top Aw-2b^\top w+\sum y_i^2\big)$. $A$는 대칭이고 $u^\top Au=\sum(u^\top x_i)^2\ge0$이라 $L_S$는 볼록. $\nabla L_S=\frac2m(Aw-b)$이고 미분가능한 볼록함수에서 최소 $\iff\nabla=0$ — (1).

**2. $\operatorname{range}(A)=\operatorname{span}\{x_1,\dots,x_m\}=:V$.** $Au=\sum_i(x_i^\top u)x_i\in V$라 ⊆. $z\in V$가 $\operatorname{range}(A)$에 직교하면 모든 $u$에서 $z^\top Au=0$, 대칭이라 $(Az)^\top u=0$ — $Az=0$. 그러면 $0=z^\top Az=\sum(z^\top x_i)^2$라 $z\perp x_i$ 전부, 즉 $z\perp V$. $z\in V$이므로 $z=0$. 유한차원에서 $V$ 안의 직교여공간이 0이므로 $\operatorname{range}(A)=V$. $b=\sum y_ix_i\in V$ — (2).

**3. $A^+b$는 해.** $A=VDV^\top$, $A^+=VD^+V^\top$. $b\in\operatorname{range}(A)=\operatorname{span}\{v_i:\lambda_i\ne0\}$이므로 $V^\top b$는 $\lambda_i=0$인 좌표가 0. $DD^+$는 $\lambda_i\ne0$ 자리에 1, 나머지 0인 대각행렬이라 $AA^+b=VDD^+V^\top b=b$.

**4. 해 집합.** $Aw=b$이면 $A(w-A^+b)=0$이므로 $w\in A^+b+\operatorname{null}(A)$, 역도 성립 — (3).

**5. 최소 노름.** $A^+b=VD^+V^\top b\in\operatorname{span}\{v_i:\lambda_i\ne0\}$이고 $\operatorname{null}(A)=\operatorname{span}\{v_i:\lambda_i=0\}$이라 서로 직교. 해 $w=A^+b+z$에 대해 $\lVert w\rVert^2=\lVert A^+b\rVert^2+\lVert z\rVert^2\ge\lVert A^+b\rVert^2$, 등호는 $z=0$뿐 — (4).`,
    note: R`노트의 교정 요지: “$A^+b$가 해다”만으로는 부족하고, **최소 노름 해**라서 특이한 경우의 표준 ERM 출력이 된다고 말해야 합니다. 또 $\operatorname{range}(A)=\operatorname{span}\{x_i\}$라는 사실은 해가 훈련점들의 결합이라는 뜻이기도 해서, 16장의 표현자 정리의 가장 단순한 예입니다.` },
  { ch: 'ch07', id: 'logistic', title: '로지스틱 손실은 음의 로그가능도이고 볼록이다', keys: ['로지스틱 손실 = 음의 로그가능도'],
    tags: 'logistic regression maximum likelihood convex sigmoid log loss 로지스틱 최대가능도 볼록',
    stmt: R`$\Prob(y\mid x;w)=\phi(y\langle w,x\rangle)$ ($y\in\{\pm1\}$, $\phi(z)=\frac1{1+e^{-z}}$)이면 로지스틱 손실의 ERM은 최대가능도 추정과 같고, $L_S(w)$는 볼록이다.`,
    body: R`
**모형의 일관성.** 분자·분모에 $e^{-z}$를 곱하면 $\phi(-z)=\frac1{1+e^{z}}=\frac{e^{-z}}{e^{-z}+1}=1-\phi(z)$. 그래서 $\Prob(1\mid x)+\Prob(-1\mid x)=\phi(z)+\phi(-z)=1$ ($z=\langle w,x\rangle$).

**MLE = ERM.** 독립 표본의 가능도는 $\prod_i\phi(y_i\langle w,x_i\rangle)$. $\ln$은 증가함수이므로 최대화는 $-\sum\ln\phi(y_i\langle w,x_i\rangle)=\sum\ln(1+e^{-y_i\langle w,x_i\rangle})$의 최소화와 같고, $\frac1m$을 곱하면 $L_S$입니다.

**볼록성.** $g(z)=\ln(1+e^{-z})$에서 $g'(z)=-\frac{e^{-z}}{1+e^{-z}}=-(1-\phi(z))$, $g''(z)=\phi'(z)=\phi(z)(1-\phi(z))\ge0$. 1변수 함수는 $g''\ge0$이면 볼록. $w\mapsto y\langle w,x\rangle$은 선형이고, 볼록함수와 아핀 사상의 합성은 볼록: $g(y\langle\alpha w+(1-\alpha)u,x\rangle)=g(\alpha a+(1-\alpha)b)\le\alpha g(a)+(1-\alpha)g(b)$. 볼록함수의 합도 볼록이므로 $L_S$ 볼록.`,
    note: R`$g'$의 절댓값이 1 미만이라 로지스틱 손실은 $\lVert x\rVert$-립시츠이고, $g''\le\frac14$라 $\frac14\lVert x\rVert^2$-매끄럽습니다. 12–14장의 두 부류(립시츠·매끄러움)에 모두 속하는 손실입니다.` },
  // ───── 08
  { ch: 'ch08', id: 'stumps', title: '세 조각 분류기에 대한 결정 그루터기의 약한 학습', keys: ['결정 그루터기는 세 조각 분류기의 약한 학습기'], src: '강의 노트 · Example 10.1',
    tags: 'weak learner decision stumps three piece classifier example 10.1 gamma 1/12 약한 학습기 결정 그루터기',
    stmt: R`실현가능할 때 $\inf_{g\in B}L_{\cD,f}(g)=\min\{p_1,p_2,p_3\}\le\frac13$이고, $\ERM_B$는 세 조각 분류기 클래스의 $\frac1{12}$-약한 학습기이다.`,
    body: R`
$b=+1$이라 두고($b=-1$은 모든 그루터기의 부호를 뒤집으면 대칭) $I_1=(-\infty,\theta_1)$, $I_2=[\theta_1,\theta_2]$, $I_3=(\theta_2,\infty)$, $f=+1$ on $I_1\cup I_3$, $-1$ on $I_2$.

**위로.** 세 그루터기: $g_0\equiv+1$은 $I_2$만 틀려 $p_2$. 문턱 $\theta_1$에서 왼쪽 $+1$·오른쪽 $-1$인 $g_1$은 $I_3$만 틀려 $p_3$. 문턱 $\theta_2$에서 왼쪽 $-1$·오른쪽 $+1$인 $g_2$는 $I_1$만 틀려 $p_1$. 따라서 $\inf\le\min\{p_1,p_2,p_3\}$.

**아래로.** 그루터기 $g$의 부호는 문턱에서 한 번 바뀝니다(상수이면 문턱이 $\pm\infty$에 있다고 봄).
- 문턱이 $I_1$ 쪽: $g$는 $I_2\cup I_3$에서 상수인데 $f$는 $I_2$와 $I_3$에서 다르므로 둘 중 하나를 통째로 틀림: $\ge\min\{p_2,p_3\}$.
- 문턱이 $I_2$ 안: $g$는 $I_1$과 $I_3$에서 다른 값인데 $f$는 같으므로 하나를 통째로 틀림: $\ge\min\{p_1,p_3\}$.
- 문턱이 $I_3$ 쪽: 대칭으로 $\ge\min\{p_1,p_2\}$.
(문턱이 구간 경계에 걸쳐도 그 점의 질량은 어느 한 구간에 속하므로 논증이 같습니다.)

**약한 학습.** $p_1+p_2+p_3=1$이라 $\min\le\frac13=\frac12-\frac16$. $B$의 VC 차원이 유한(2)이므로 균등수렴으로 충분한 표본에서 ERM의 오차는 확률 $1-\delta$ 이상 $\inf+\frac1{12}\le\frac12-\frac16+\frac1{12}=\frac12-\frac1{12}$. 즉 $\gamma=\frac1{12}$.`,
    note: R`$p_1=p_2=p_3=\frac13$이면 모든 그루터기의 오차가 $\frac13$ 이상이라 상한이 정확합니다. 세 조각 분류기 자체의 VC 차원은 3이지만, 그보다 단순한 그루터기가 “조금 나은” 추측을 늘 제공하고, AdaBoost가 그것들을 모아 세 조각 분류기를 재구성합니다.` },
  { ch: 'ch08', id: 'adaboost', title: 'AdaBoost의 훈련 오차 상한', keys: ['AdaBoost 훈련 오차 정리'], src: '강의 노트 · Theorem 10.2',
    tags: 'AdaBoost training error exponential loss weak learning theorem 10.2 normalization telescoping 지수 손실 망원곱',
    stmt: R`모든 라운드에서 $\varepsilon_t\le\frac12-\gamma$이면 $L_S(h_S)\le e^{-2\gamma^2T}$.`,
    body: R`
$f_t=\sum_{p\le t}w_ph_p$ ($f_0\equiv0$), $h_S=\sign(f_T)$, $Z_t=\frac1m\sum_ie^{-y_if_t(x_i)}$ ($Z_0=1$).

**1. $L_S(h_S)\le Z_T$.** $a\le0$이면 $e^{-a}\ge1$이므로 $\one[\sign(f)\ne y]\le\one[yf\le0]\le e^{-yf}$. 평균하면 된다.

**2. $D^{(t+1)}_i=\dfrac{e^{-y_if_t(x_i)}}{\sum_je^{-y_jf_t(x_j)}}$ (귀납).** $t=0$: 양변 $\frac1m$. $t\to t+1$: 갱신식에 가정을 넣으면
$$D^{(t+2)}_i=\frac{D^{(t+1)}_ie^{-w_{t+1}y_ih_{t+1}(x_i)}}{\sum_kD^{(t+1)}_ke^{-w_{t+1}y_kh_{t+1}(x_k)}}=\frac{e^{-y_if_t(x_i)}e^{-w_{t+1}y_ih_{t+1}(x_i)}}{\sum_ke^{-y_kf_t(x_k)}e^{-w_{t+1}y_kh_{t+1}(x_k)}}$$
(공통 분모 $\sum_je^{-y_jf_t(x_j)}$ 약분), 그리고 $f_{t+1}=f_t+w_{t+1}h_{t+1}$.

**3. 비의 계산.**
$$\frac{Z_{t+1}}{Z_t}=\frac{\sum_ie^{-y_if_t(x_i)}e^{-w_{t+1}y_ih_{t+1}(x_i)}}{\sum_je^{-y_jf_t(x_j)}}=\sum_iD^{(t+1)}_ie^{-w_{t+1}y_ih_{t+1}(x_i)}.$$
맞힌 예제($y_ih=1$)의 가중치 합은 $1-\varepsilon_{t+1}$, 틀린 예제는 $\varepsilon_{t+1}$이므로 $=e^{-w}(1-\varepsilon)+e^{w}\varepsilon$. $w=\frac12\ln\frac{1-\varepsilon}\varepsilon$에서 $e^w=\sqrt{\frac{1-\varepsilon}\varepsilon}$이라
$$\frac{Z_{t+1}}{Z_t}=\sqrt{\tfrac\varepsilon{1-\varepsilon}}(1-\varepsilon)+\sqrt{\tfrac{1-\varepsilon}\varepsilon}\,\varepsilon=2\sqrt{\varepsilon_{t+1}(1-\varepsilon_{t+1})}.$$

**4. 약한 학습 가정.** $a\mapsto a(1-a)$는 $[0,\frac12]$에서 증가($1-2a\ge0$)이므로 $\varepsilon\le\frac12-\gamma$에서 $\varepsilon(1-\varepsilon)\le(\frac12-\gamma)(\frac12+\gamma)=\frac14-\gamma^2$. 따라서 비 $\le\sqrt{1-4\gamma^2}$. $1-u\le e^{-u}$ ($u=4\gamma^2$)에 제곱근을 씌우면 $\le e^{-2\gamma^2}$.

**5. 망원곱.** $Z_T=Z_0\prod_{t=0}^{T-1}\frac{Z_{t+1}}{Z_t}\le e^{-2\gamma^2T}$, 1과 합쳐 결론.`,
    note: R`2단계가 AdaBoost의 핵심 구조입니다: 다음 라운드의 분포는 **현재까지의 지수 손실에 비례**하므로, 마진 $y_if_t(x_i)$가 작은(특히 음수인) 예제가 큰 무게를 받습니다. 그리고 $w_t$는 3단계의 비를 최소로 하는 값입니다.` },
  { ch: 'ch08', id: 'lbtVC', title: '기초 가설 선형 결합의 VC 차원', keys: ['선형 결합 클래스의 VC 차원'],
    tags: 'VC dimension linear combinations base hypotheses boosting lemma 10.3 Sauer 선형 결합 부스팅',
    stmt: R`$d=\VC(B)\ge3$, $T\ge3$이면 $\VC(L(B,T))\le T(d+1)\big(3\log_2(T(d+1))+2\big)$.`,
    body: R`
$C=\{x_1,\dots,x_m\}$이 $L(B,T)$에 분쇄된다고 합시다. $L(B,T)$의 레이블링은 (i) $h_1,\dots,h_T\in B$를 고르고 (ii) 벡터 $(h_1(x),\dots,h_T(x))\in\{\pm1\}^T$ 위의 동차 반공간 $\sign\langle w,\cdot\rangle$를 적용해 얻습니다.

(i) $C$ 위에서 $B$가 만드는 레이블링은 사우어로 많아야 $(em/d)^d$가지($m\ge d$), $T$개를 고르는 방법은 $(em/d)^{dT}$ 이하.
(ii) 각 선택마다 $C$의 $m$개 점은 $\mathbb R^T$의 점 $m$개가 되고, 동차 반공간(VC 차원 $T$)이 만드는 레이블링은 사우어로 $(em/T)^T$ 이하.

따라서 $2^m\le(em/d)^{dT}(em/T)^T\le m^{(d+1)T}$ ($d,T\ge3$이면 $e/d<1$, $e/T<1$). 양변에 $\log_2$를 취하면 $a=(d+1)T$에 대해 $m\le a\log_2m$. 이런 $m$은 $O(a\log a)$를 넘을 수 없고(“$x$가 $a\log x$보다 빨리 자란다”), 교재 부록 A의 보조정리로 상수까지 계산하면 $m\le T(d+1)\big(3\log_2(T(d+1))+2\big)$.`,
    note: R`정확한 상수보다 모양 $\tilde O(Td)$가 중요합니다. 라운드 수 $T$가 복잡도를 선형으로 키우므로, AdaBoost의 참 오차는 “훈련 오차 $e^{-2\gamma^2T}$ + 추정 오차 $\tilde O(\sqrt{Td/m})$”의 균형으로 정해집니다.` },
  // ───── 09
  { ch: 'ch09', id: 'convexFirst', title: '미분가능한 볼록함수의 1차 조건', keys: ['볼록함수의 1차 조건'],
    tags: 'convex function first order condition tangent global minimum 볼록 1차 조건 접선 전역 최소',
    stmt: R`미분가능한 $f$가 볼록 $\iff$ 모든 $w,u$에서 $f(u)\ge f(w)+\langle\nabla f(w),u-w\rangle$. 따라서 볼록함수에서 $\nabla f(w)=0$이면 $w$는 전역 최소점이다.`,
    body: R`
**(⇒)** $\alpha\in(0,1)$에서 볼록성 $f(w+\alpha(u-w))\le(1-\alpha)f(w)+\alpha f(u)$를 정리하면
$$\frac{f(w+\alpha(u-w))-f(w)}\alpha\le f(u)-f(w).$$
$\alpha\to0^+$이면 좌변은 방향미분 $\langle\nabla f(w),u-w\rangle$.

**(⇐)** $z=\alpha u+(1-\alpha)w$에 1차 조건을 두 번 씁니다: $f(u)\ge f(z)+\langle\nabla f(z),u-z\rangle$, $f(w)\ge f(z)+\langle\nabla f(z),w-z\rangle$. 각각 $\alpha$, $1-\alpha$를 곱해 더하면 $\alpha(u-z)+(1-\alpha)(w-z)=0$이라 $\alpha f(u)+(1-\alpha)f(w)\ge f(z)$.

**국소 = 전역.** $\nabla f(w)=0$이면 1차 조건이 $f(u)\ge f(w)$ ($\forall u$). 또 미분불가능해도, 볼록함수의 국소 최소점 $w$에서 $f(u)<f(w)$인 $u$가 있으면 선분 위의 점 $w+\alpha(u-w)$에서 $f\le(1-\alpha)f(w)+\alpha f(u)<f(w)$ — $\alpha$가 작아도 성립해 국소 최소에 모순.`,
    note: R`볼록함수는 모든 접평면 위에 있고, 볼록 집합 위 볼록함수의 국소 최소는 전역 최소입니다. 그래서 볼록 학습 문제의 ERM은 “아무 국소 해법”으로도 전역 해를 찾습니다.` },
  { ch: 'ch09', id: 'lipComp', title: '립시츠 함수의 합성', keys: ['합성의 립시츠 상수'],
    tags: 'Lipschitz composition linear predictor Cauchy-Schwarz 립시츠 합성',
    stmt: R`$g_1$이 $\rho_1$-립시츠, $g_2$가 $\rho_2$-립시츠이면 $g_1\circ g_2$는 $\rho_1\rho_2$-립시츠. 특히 $g$가 $\rho$-립시츠이면 $w\mapsto g(\langle w,x\rangle+b)$는 $\rho\lVert x\rVert$-립시츠.`,
    body: R`
$\lVert g_1(g_2(u))-g_1(g_2(v))\rVert\le\rho_1\lVert g_2(u)-g_2(v)\rVert\le\rho_1\rho_2\lVert u-v\rVert$.

선형 경우: $h(w)=\langle w,x\rangle+b$는 $\lvert h(u)-h(v)\rvert=\lvert\langle u-v,x\rangle\rvert\le\lVert x\rVert\lVert u-v\rVert$ (코시–슈바르츠)로 $\lVert x\rVert$-립시츠. 합성 규칙으로 $\rho\lVert x\rVert$.`,
    note: R`예: 힌지 $\max\{0,1-z\}$와 절대 손실 $\lvert z\rvert$은 1-립시츠라 선형 예측기와 합성하면 $\lVert x\rVert$-립시츠. 제곱 손실은 립시츠가 아니어서 유계 영역에서만 립시츠입니다.` },
  { ch: 'ch09', id: 'smoothUpper', title: '매끄러움의 이차 상한 (12.5)', keys: ['매끄러움의 이차 상한'], src: '강의 노트 · Eq. (12.5)',
    tags: 'smoothness quadratic upper bound gradient Lipschitz fundamental theorem of calculus 매끄러움 이차 상한 적분',
    stmt: R`$f$가 미분가능하고 $\nabla f$가 $\beta$-립시츠이면 $f(v)\le f(w)+\langle\nabla f(w),v-w\rangle+\frac\beta2\lVert v-w\rVert^2$.`,
    body: R`
$\gamma(t)=w+t(v-w)$, $\phi(t)=f(\gamma(t))$ ($t\in[0,1]$). 연쇄법칙으로 $\phi'(t)=\langle\nabla f(\gamma(t)),\gamma'(t)\rangle=\langle\nabla f(\gamma(t)),v-w\rangle$[[@base:ch04:4.2|다변수 연쇄법칙.]].

미적분의 기본정리: $f(v)-f(w)=\phi(1)-\phi(0)=\int_0^1\langle\nabla f(\gamma(t)),v-w\rangle dt$.

$\nabla f(w)$를 빼고 더하면
$$f(v)-f(w)=\langle\nabla f(w),v-w\rangle+\int_0^1\langle\nabla f(\gamma(t))-\nabla f(w),v-w\rangle dt.$$
코시–슈바르츠와 립시츠성: $\langle\nabla f(\gamma(t))-\nabla f(w),v-w\rangle\le\lVert\nabla f(\gamma(t))-\nabla f(w)\rVert\lVert v-w\rVert\le\beta\lVert t(v-w)\rVert\lVert v-w\rVert=\beta t\lVert v-w\rVert^2$.
$\int_0^1\beta t\,dt\lVert v-w\rVert^2=\frac\beta2\lVert v-w\rVert^2$.`,
    note: R`기울기가 $\beta$-립시츠이면 함수는 1차 근사에서 곡률 $\beta$의 포물선 이상으로 벗어나지 못합니다. $f$가 두 번 미분가능하면 $\lVert\nabla^2f\rVert_{\mathrm{op}}\le\beta$와 같은 조건입니다.` },
  { ch: 'ch09', id: 'selfBounded', title: '음이 아닌 매끄러운 함수의 자기 유계성', keys: ['자기 유계성'],
    tags: 'self-bounded smooth nonnegative gradient norm 2 beta f 자기 유계',
    stmt: R`$f\ge0$이고 $\beta$-매끄러우면 $\lVert\nabla f(w)\rVert^2\le2\beta f(w)$.`,
    body: R`
이차 상한에 $v=w-\frac1\beta\nabla f(w)$를 넣습니다:
$$f(v)\le f(w)-\frac1\beta\lVert\nabla f(w)\rVert^2+\frac\beta2\cdot\frac1{\beta^2}\lVert\nabla f(w)\rVert^2=f(w)-\frac1{2\beta}\lVert\nabla f(w)\rVert^2.$$
$f(v)\ge0$이므로 $\frac1{2\beta}\lVert\nabla f(w)\rVert^2\le f(w)-f(v)\le f(w)$.`,
    note: R`$v$는 보폭 $\frac1\beta$의 경사하강 한 걸음입니다. “한 걸음에 적어도 $\frac1{2\beta}\lVert\nabla f\rVert^2$만큼 내려가는데 0 아래로는 못 가니, 기울기가 클 수 없다”는 논리입니다.` },
  { ch: 'ch09', id: 'smoothComp', title: '선형 합성의 매끄러움 (Claim 12.9)', keys: ['선형 합성의 매끄러움'], src: '강의 노트 · Claim 12.9',
    tags: 'smoothness composition linear predictor claim 12.9 chain rule Hessian 매끄러움 합성',
    stmt: R`$g:\mathbb R\to\mathbb R$이 미분가능하고 $\beta$-매끄러우면 $f(w)=g(\langle w,x\rangle+b)$는 $\beta\lVert x\rVert^2$-매끄럽다.`,
    body: R`
**기울기.** $h(w)=\langle w,x\rangle+b$는 $Dh(w)[u]=\langle u,x\rangle$. 연쇄법칙으로 $Df(w)[u]=g'(h(w))\langle u,x\rangle=\langle g'(h(w))x,u\rangle$이므로 (리스 표현) $\nabla f(w)=g'(\langle w,x\rangle+b)\,x$.

**립시츠성.**
$$\lVert\nabla f(v)-\nabla f(w)\rVert=\lvert g'(\langle v,x\rangle+b)-g'(\langle w,x\rangle+b)\rvert\,\lVert x\rVert\le\beta\lvert\langle v-w,x\rangle\rvert\,\lVert x\rVert\le\beta\lVert x\rVert^2\lVert v-w\rVert.$$
($g'$가 $\beta$-립시츠, $b$ 상쇄, 코시–슈바르츠.)`,
    note: R`$g$가 두 번 미분가능하면 $\nabla^2f(w)=g''(\cdot)xx^\top$이고 $\lVert xx^\top\rVert_{\mathrm{op}}=\lVert x\rVert^2$이라 같은 결론이 헤시안으로도 나옵니다(노트의 Remark). 예: 로지스틱($g''\le\frac14$) → $\frac14\lVert x\rVert^2$, 제곱 손실($g''=2$) → $2\lVert x\rVert^2$.` },
  { ch: 'ch09', id: 'hingeUpper', title: '힌지 손실은 0–1 손실의 볼록 상한이다', keys: ['힌지 손실은 0–1 손실의 볼록 상한'],
    tags: 'hinge loss surrogate convex upper bound 0-1 loss 힌지 대리 손실',
    stmt: R`$\max\{0,1-y\langle w,x\rangle\}\ge\one[y\langle w,x\rangle\le0]$이고, 힌지 손실은 $w$의 볼록함수이며 $\lVert x\rVert$-립시츠이다.`,
    body: R`
**상한.** $z=y\langle w,x\rangle$. $z\le0$이면 $1-z\ge1$이라 힌지 $\ge1=$ 0–1 손실. $z>0$이면 0–1 손실이 0이고 힌지 $\ge0$.

**볼록.** $w\mapsto0$과 $w\mapsto1-y\langle w,x\rangle$은 아핀(볼록)이고, 볼록함수들의 점별 최댓값은 볼록: $\max\{f_1,f_2\}(\alpha u+(1-\alpha)v)\le\max_i[\alpha f_i(u)+(1-\alpha)f_i(v)]\le\alpha\max f_i(u)+(1-\alpha)\max f_i(v)$.

**립시츠.** $z\mapsto\max\{0,1-z\}$는 1-립시츠(기울기 0 또는 $-1$인 조각선형), 선형 합성으로 $\lVert x\rVert$-립시츠.`,
    note: R`0–1 손실 $\one[z\le0]$은 $z=0$에서 계단이라 볼록이 아닙니다. 힌지는 그 계단을 위에서 감싸는 가장 “빠듯한” 볼록 조각선형 함수 중 하나이고, $z\ge1$에서 정확히 0이라 마진 개념이 자연스럽게 들어옵니다.` },
  // ───── 10
  { ch: 'ch10', id: 'ridge', title: '릿지 회귀의 정규방정식과 유일한 해', keys: ['릿지 회귀의 닫힌 해'], src: '강의 노트 · 13.1.1',
    tags: 'ridge regression normal equation positive definite unique minimizer strictly convex 릿지 정규방정식 양의 정부호',
    stmt: R`$J(w)=\lambda\lVert w\rVert^2+\frac1m\sum_i\frac12(\langle w,x_i\rangle-y_i)^2$ ($\lambda>0$)의 최소점은 $(2\lambda mI+A)w=b$의 유일한 해 $w=(2\lambda mI+A)^{-1}b$이다.`,
    body: R`
**1. 기울기.** $\nabla\lambda w^\top w=2\lambda w$. $\ell_i(w)=\frac12(x_i^\top w-y_i)^2$은 아핀 함수의 제곱이라 연쇄법칙으로 $\nabla\ell_i=(x_i^\top w-y_i)x_i$. $\sum_i(x_i^\top w-y_i)x_i=\big(\sum x_ix_i^\top\big)w-\sum y_ix_i=Aw-b$. 따라서 $\nabla J=2\lambda w+\frac1m(Aw-b)$.

**2. 정류점.** $\nabla J=0\iff2\lambda mw+Aw=b\iff(2\lambda mI+A)w=b$.

**3. $A\succeq0$.** 대칭이고 $v^\top Av=\sum_i(x_i^\top v)^2\ge0$.

**4. $2\lambda mI+A\succ0$.** $v\ne0$이면 $v^\top(2\lambda mI+A)v=2\lambda m\lVert v\rVert^2+v^\top Av>0$. 양의 정부호 대칭행렬은 가역.

**5. 전역 최소.** 헤시안 $\nabla^2J=2\lambda I+\frac1mA\succ0$(모든 $w$에서)이라 $J$는 강볼록. 강볼록 함수는 최소점이 많아야 하나이고, 기울기가 0인 점은 (1차 조건으로) 전역 최소점. 2와 4로 그런 점이 정확히 하나 $w=(2\lambda mI+A)^{-1}b$.`,
    note: R`규제가 없으면($\lambda=0$) $A$가 특이할 때 해가 무수히 많았습니다(9단원). 릿지는 $m<d$여도 해가 유일합니다. 규제항을 $\frac\lambda2\lVert w\rVert^2$이나 손실을 $\frac1m\sum(\cdot)^2$(½ 없이)로 쓰는 교재도 많아, 정규방정식의 상수($2\lambda m$ 대 $\lambda m$ 등)는 정의에 맞춰 확인해야 합니다.` },
  { ch: 'ch10', id: 'stabGap', title: '기대 일반화 간격 = 한 점 바꾸기 안정성 (정리 13.2)', keys: ['안정성 = 일반화 간격'], src: '강의 노트 · Theorem 13.2',
    tags: 'stability generalization gap replace one theorem 13.2 exchangeability swap 안정성 일반화 간격 한 점 바꾸기',
    stmt: R`$S\sim\cD^m$, $z'\sim\cD$ 독립, $i\sim U(m)$이면 모든 $A$에 대해 $\E_S[L_\cD(A(S))-L_S(A(S))]=\E[\ell(A(S^{(i)}),z_i)-\ell(A(S),z_i)]$.`,
    body: R`
**1. 참 위험.** $L_\cD(A(S))=\E_{z'}[\ell(A(S),z')]$ ($z'$는 $S$와 독립이라 조건부로 봐도 같음). 그러므로 $\E_S[L_\cD(A(S))]=\E_{S,z'}[\ell(A(S),z')]$.

$i$를 고정합니다. 함수 $\Phi(u_1,\dots,u_m,u)=\ell(A(u_1,\dots,u_m),u)$를 쓰면
$$\ell(A(S),z')=\Phi(z_1,..,z_i,..,z_m,z'),\qquad\ell(A(S^{(i)}),z_i)=\Phi(z_1,..,z',..,z_m,z_i).$$
$(z_1,\dots,z_m,z')$은 i.i.d. $m+1$개이고, $z_i$와 $z'$의 자리를 바꾼 튜플도 같은 분포를 가집니다. 같은 분포의 확률변수에 같은 함수를 씌우면 기댓값이 같으므로 $\E[\ell(A(S),z')]=\E[\ell(A(S^{(i)}),z_i)]$. 모든 $i$에서 성립하므로 $i\sim U(m)$에 대해 평균해도 같습니다.

**2. 경험적 위험.** $\E_S[L_S(A(S))]=\frac1m\sum_i\E_S[\ell(A(S),z_i)]=\E_{S,i}[\ell(A(S),z_i)]$. 이 양은 $z'$와 무관하므로 $\E_{S,z',i}$로 써도 같습니다.

**3.** 1에서 2를 빼면 정리.`,
    note: R`어떤 가정(볼록성, 유계성)도 쓰지 않은 **항등식**입니다. 필요한 것은 i.i.d.뿐입니다. 이 등식 덕분에 “안정하다”를 보이는 것만으로 기대 일반화 간격이 제어됩니다.` },
  { ch: 'ch10', id: 'strongProps', title: '강볼록 함수의 세 성질 (Lemma 13.5)', keys: ['강볼록 함수의 성질'],
    tags: 'strong convexity lemma 13.5 Tikhonov quadratic growth minimizer 강볼록 이차 증가',
    stmt: R`(1) $\lambda\lVert w\rVert^2$은 $2\lambda$-강볼록. (2) $\lambda$-강볼록 + 볼록 = $\lambda$-강볼록. (3) $f$가 $\lambda$-강볼록이고 $u$가 최소점이면 $f(w)-f(u)\ge\frac\lambda2\lVert w-u\rVert^2$.`,
    body: R`
**(1)** 유클리드 공간의 항등식
$$\alpha\lVert w\rVert^2+(1-\alpha)\lVert u\rVert^2-\lVert\alpha w+(1-\alpha)u\rVert^2=\alpha(1-\alpha)\lVert w-u\rVert^2$$
(전개하면 $\alpha(1-\alpha)(\lVert w\rVert^2+\lVert u\rVert^2-2\langle w,u\rangle)$)에 $\lambda$를 곱하면 $\lambda\lVert\cdot\rVert^2$이 정의를 **등호로** 만족하고, 계수가 $\frac{2\lambda}2\alpha(1-\alpha)$이므로 $2\lambda$-강볼록.

**(2)** 두 부등식(강볼록의 정의와 볼록의 정의)을 더하면 됩니다.

**(3)** 정의에서 $\alpha\in(0,1)$로 $f(u+\alpha(w-u))\le\alpha f(w)+(1-\alpha)f(u)-\frac\lambda2\alpha(1-\alpha)\lVert w-u\rVert^2$. 정리하고 $\alpha$로 나누면
$$\frac{f(u+\alpha(w-u))-f(u)}\alpha\le f(w)-f(u)-\frac\lambda2(1-\alpha)\lVert w-u\rVert^2.$$
$u$가 최소점이라 좌변 $\ge0$. $\alpha\to0^+$이면 $0\le f(w)-f(u)-\frac\lambda2\lVert w-u\rVert^2$.`,
    note: R`(3)이 안정성 분석의 엔진입니다: 강볼록 목적함수는 최소점에서 멀어지면 적어도 이차로 커지므로, 목적함수가 조금만 바뀌면(표본 한 점) 최소점도 조금만 움직입니다.` },
  { ch: 'ch10', id: 'stabIneq', title: '티호노프 규제 RLM의 안정성 부등식 (13.7)', keys: ['티호노프 규제의 안정성 부등식'],
    tags: 'RLM stability inequality Tikhonov strong convexity replace one 규제 안정성 부등식',
    stmt: R`손실이 볼록이면 $u=A(S)$, $v=A(S^{(i)})$에 대해 $\lambda\lVert v-u\rVert^2\le\frac{\ell(v,z_i)-\ell(u,z_i)}m+\frac{\ell(u,z')-\ell(v,z')}m$.`,
    body: R`
$f_S(w)=L_S(w)+\lambda\lVert w\rVert^2$은 (1)(2)로 $2\lambda$-강볼록이고 $u$가 최소점이므로 (3)으로 $f_S(v)-f_S(u)\ge\lambda\lVert v-u\rVert^2$.

$S$와 $S^{(i)}$는 $i$번째 원소만 다르므로 모든 $w$에서 $L_S(w)=L_{S^{(i)}}(w)+\frac{\ell(w,z_i)-\ell(w,z')}m$, 즉 $f_S=f_{S^{(i)}}+\frac{\ell(\cdot,z_i)-\ell(\cdot,z')}m$. 따라서
$$f_S(v)-f_S(u)=\big[f_{S^{(i)}}(v)-f_{S^{(i)}}(u)\big]+\frac{\ell(v,z_i)-\ell(u,z_i)}m+\frac{\ell(u,z')-\ell(v,z')}m.$$
$v$는 $f_{S^{(i)}}$의 최소점이므로 대괄호 $\le0$. 두 식을 합치면 결론.`,
    note: R`규제항 $\lambda\lVert w\rVert^2$과 공통 원소 $m-1$개의 손실은 차이에서 정확히 상쇄되고, 서로 다른 한 점의 손실만 남습니다. 그래서 “한 점 **바꾸기**”가 분석에 자연스럽습니다.` },
  { ch: 'ch10', id: 'stabLip', title: '립시츠 손실에서 RLM의 안정성 (따름정리 13.6)', keys: ['립시츠 손실에서 RLM의 안정성'],
    tags: 'Lipschitz loss RLM stability corollary 13.6 2 rho^2 over lambda m 립시츠 안정성',
    stmt: R`손실이 볼록이고 $\rho$-립시츠이면 $\ell(A(S^{(i)}),z_i)-\ell(A(S),z_i)\le\frac{2\rho^2}{\lambda m}$ (모든 $S,z',i$). 따라서 $\E[L_\cD(A(S))-L_S(A(S))]\le\frac{2\rho^2}{\lambda m}$.`,
    body: R`
안정성 부등식의 우변에서 $\ell(v,z_i)-\ell(u,z_i)\le\rho\lVert v-u\rVert$, $\ell(u,z')-\ell(v,z')\le\rho\lVert v-u\rVert$이므로
$$\lambda\lVert v-u\rVert^2\le\frac{2\rho\lVert v-u\rVert}m.$$
$v=u$이면 결론이 자명하고, 아니면 나눠서 $\lVert v-u\rVert\le\frac{2\rho}{\lambda m}$. 다시 립시츠로 $\ell(v,z_i)-\ell(u,z_i)\le\rho\lVert v-u\rVert\le\frac{2\rho^2}{\lambda m}$. 점별 상한이므로 기댓값에서도 성립하고, 정리 13.2로 일반화 간격의 상한이 됩니다.`,
    note: R`상한이 $\frac1{\lambda m}$에 비례합니다: 규제가 셀수록, 표본이 많을수록 안정합니다. 다음 절에서 이 항을 규제의 대가 $\lambda\lVert w^\star\rVert^2$와 맞바꿉니다.` },
  { ch: 'ch10', id: 'stabSmooth', title: '매끄럽고 음이 아닌 손실에서 RLM의 안정성 (따름정리 13.7)', keys: ['매끄러운 손실에서 RLM의 안정성'], src: '강의 노트 · Corollary 13.7 (바로잡음)',
    tags: 'smooth nonnegative loss RLM stability corollary 13.7 self-bounded 48 beta 매끄러운 손실 안정성 자기 유계',
    stmt: R`손실이 볼록, 음이 아니고 $\beta$-매끄러우며 $\lambda\ge\frac{2\beta}m$이면 $\E[\ell(A(S^{(i)}),z_i)-\ell(A(S),z_i)]\le\frac{24\beta}{\lambda m}\E[L_S(A(S))]\le\frac{48\beta}{\lambda m}\E[L_S(A(S))]$.`,
    body: R`
$u=A(S)$, $v=A(S^{(i)})$, $D=\lVert v-u\rVert$, $a=\sqrt{\ell(u,z_i)}$, $b=\sqrt{\ell(v,z')}$.

**1. 한 점 손실 차이의 상한.** 이차 상한과 코시–슈바르츠, 자기 유계성 $\lVert\nabla\ell\rVert\le\sqrt{2\beta\ell}$로
$$\ell(v,z_i)-\ell(u,z_i)\le\lVert\nabla\ell(u,z_i)\rVert D+\tfrac\beta2D^2\le\sqrt{2\beta}\,aD+\tfrac\beta2D^2,$$
$$\ell(u,z')-\ell(v,z')\le\sqrt{2\beta}\,bD+\tfrac\beta2D^2.$$

**2. 거리.** 안정성 부등식에 넣으면 $\lambda D^2\le\frac1m\big[\sqrt{2\beta}(a+b)D+\beta D^2\big]$. $\lambda\ge\frac{2\beta}m$이라 $\lambda-\frac\beta m\ge\frac\lambda2$, 따라서 $\frac\lambda2D^2\le\frac{\sqrt{2\beta}}m(a+b)D$, 즉 $D\le\frac{2\sqrt{2\beta}}{\lambda m}(a+b)$.

**3. 다시 대입.**
$$\ell(v,z_i)-\ell(u,z_i)\le\sqrt{2\beta}\,a\cdot\frac{2\sqrt{2\beta}(a+b)}{\lambda m}+\frac\beta2\cdot\frac{8\beta(a+b)^2}{\lambda^2m^2}=\frac{4\beta a(a+b)}{\lambda m}+\frac{4\beta^2(a+b)^2}{\lambda^2m^2}.$$
$\frac\beta{\lambda m}\le\frac12$이라 둘째 항 $\le\frac{2\beta(a+b)^2}{\lambda m}$, 첫째 항 $\le\frac{4\beta(a+b)^2}{\lambda m}$. 합 $\le\frac{6\beta}{\lambda m}(a+b)^2\le\frac{12\beta}{\lambda m}(a^2+b^2)$.

**4. 기댓값.** $\E[a^2]=\E_{S,i}[\ell(A(S),z_i)]=\E[L_S(A(S))]$. 또 $(S^{(i)},z')$와 $(S,z_i)$는 같은 분포(두 i.i.d. 변수의 자리 바꿈)라 $\E[b^2]=\E[\ell(A(S^{(i)}),z')]=\E[\ell(A(S),z_i)]=\E[L_S(A(S))]$. 따라서 $\le\frac{24\beta}{\lambda m}\E[L_S(A(S))]$.`,
    note: R`강의 노트는 한 점을 **뺀** 표본 $S\setminus\{z_i\}$로 1차 최적 조건을 두 번 써서 같은 결론을 내려 했지만, $\nabla L_S(w)=\frac1m\nabla\ell(w,z_i)+\frac{m-1}m\nabla L_{S\setminus\{z_i\}}(w)$를 대입하는 곳에서 $-\frac1m\nabla L_{S\setminus\{z_i\}}(w_i)$ 항이 빠졌습니다. 교재처럼 한 점을 **바꾸는** 표본과 강볼록성의 성질 (3)을 쓰면 위처럼 깔끔하고, 상수도 교재의 48보다 좋은 24가 나옵니다. 노트의 중간 결과(상수 6)는 빠진 항을 고려하지 않은 계산이라 그대로 인용하지 않는 것이 안전합니다.` },
  { ch: 'ch10', id: 'oracle', title: '립시츠 손실의 오라클 부등식과 표본 복잡도 (따름정리 13.8–13.9)', keys: ['립시츠 손실의 오라클 부등식'],
    tags: 'oracle inequality fitting stability tradeoff convex Lipschitz bounded corollary 13.8 13.9 8 rho^2 B^2 오라클 부등식 적합 안정성 균형',
    stmt: R`손실이 볼록이고 $\rho$-립시츠이면 모든 $w^\star$에서 $\E[L_\cD(A(S))]\le L_\cD(w^\star)+\lambda\lVert w^\star\rVert^2+\frac{2\rho^2}{\lambda m}$. 볼록-립시츠-유계($\rho,B$)이면 $\lambda=\sqrt{2\rho^2/(B^2m)}$에서 $\E[L_\cD(A(S))]\le\min_{\cH}L_\cD+\rho B\sqrt{8/m}$.`,
    body: R`
**분해.** $\E[L_\cD(A(S))]=\E[L_S(A(S))]+\E[L_\cD(A(S))-L_S(A(S))]$.

**안정성 항.** 정리 13.2와 립시츠 안정성으로 $\le\frac{2\rho^2}{\lambda m}$.

**적합 항.** $A(S)$가 $L_S+\lambda\lVert\cdot\rVert^2$의 최소점이므로 $L_S(A(S))\le L_S(A(S))+\lambda\lVert A(S)\rVert^2\le L_S(w^\star)+\lambda\lVert w^\star\rVert^2$. $w^\star$는 $S$와 무관한 고정 벡터라 $\E_S[L_S(w^\star)]=L_\cD(w^\star)$.

**최적화.** $w^\star\in\argmin_{\cH}L_\cD$, $\lVert w^\star\rVert\le B$면 우변 $\le\min L_\cD+\lambda B^2+\frac{2\rho^2}{\lambda m}$. 산술–기하 평균으로 $\lambda B^2+\frac{2\rho^2}{\lambda m}\ge2\sqrt{\frac{2\rho^2B^2}m}$이고 등호는 $\lambda B^2=\frac{2\rho^2}{\lambda m}$, 즉 $\lambda=\sqrt{\frac{2\rho^2}{B^2m}}$일 때. 값은 $2\rho B\sqrt{2/m}=\rho B\sqrt{8/m}$. $\le\varepsilon\iff m\ge\frac{8\rho^2B^2}{\varepsilon^2}$.`,
    note: R`“오라클”이라는 이름은 좋은 $w^\star$와 그 노름을 **안다면** 그만큼 잘할 수 있다는 뜻입니다. 실제로는 $\lVert w^\star\rVert$를 모르므로 $\lambda$를 검증 집합으로 고릅니다(11장).` },
  { ch: 'ch10', id: 'smoothLearn', title: '볼록-매끄러움-유계 문제의 학습가능성 (따름정리 13.11의 수정판)', keys: ['볼록-매끄러움-유계 문제의 학습가능성'], src: '강의 노트 · Corollary 13.11 변형',
    tags: 'convex smooth bounded learnability corollary 13.10 13.11 288 constant correction 매끄러움 유계 학습가능성 상수 수정',
    stmt: R`볼록-매끄러움-유계($\beta,B$), $0\in\cH$, $\ell(0,z)\le1$. $\varepsilon\in(0,1)$, $\lambda=\frac\varepsilon{3B^2}$, $m\ge\frac{288\beta B^2}{\varepsilon^2}$이면 $\E[L_\cD(A(S))]\le\min_{\cH}L_\cD+\varepsilon$.`,
    body: R`
**1. 따름정리 13.10.** $\lambda\ge\frac{2\beta}m$이면 매끄러운 안정성으로 $\E[L_\cD(A(S))]\le(1+\frac{48\beta}{\lambda m})\E[L_S(A(S))]\le(1+\frac{48\beta}{\lambda m})(L_\cD(w)+\lambda\lVert w\rVert^2)$ ($\forall w$). 조건 확인: $\frac{2\beta}m\le\frac{2\beta\varepsilon^2}{288\beta B^2}=\frac{\varepsilon^2}{144B^2}\le\frac\varepsilon{3B^2}=\lambda$.

**2. 비교 대상.** $w^\star\in\argmin_{\cH}L_\cD$, $L^\star=L_\cD(w^\star)$. 유계라 $\lambda\lVert w^\star\rVert^2\le\lambda B^2=\frac\varepsilon3$. 또 $L^\star\le L_\cD(0)\le1$.

**3. 계수.** $\frac{48\beta}{\lambda m}=\frac{144\beta B^2}{\varepsilon m}\le\frac{144\beta B^2}{\varepsilon}\cdot\frac{\varepsilon^2}{288\beta B^2}=\frac\varepsilon2$.

**4. 합치기.**
$$\E[L_\cD(A(S))]\le\Big(1+\frac\varepsilon2\Big)\Big(L^\star+\frac\varepsilon3\Big)=L^\star+\frac\varepsilon3+\frac\varepsilon2L^\star+\frac{\varepsilon^2}6\le L^\star+\frac\varepsilon3+\frac\varepsilon2+\frac\varepsilon6=L^\star+\varepsilon$$
($L^\star\le1$, $\varepsilon^2\le\varepsilon$).`,
    note: R`교재의 $m\ge150\beta B^2/\varepsilon^2$로는 3단계가 $\frac{48\beta}{\lambda m}\le0.96\varepsilon$에 그치고, $(1+0.96\varepsilon)(L^\star+\frac\varepsilon3)=L^\star+\frac\varepsilon3+0.96\varepsilon L^\star+0.32\varepsilon^2$은 $L^\star=1$ 근처에서 $L^\star+\varepsilon$을 넘습니다. 강의 노트가 상수를 288로 고친 이유입니다. (24를 쓰는 개선된 안정성 상수를 쓰면 144로도 됩니다.)` },
  { ch: 'ch10', id: 'generalNorm', title: '일반 노름에서의 RLM 안정성 (연습문제 13.4)', keys: ['일반 노름에서의 RLM 안정성'], src: '강의 노트 · Exercise 13.4',
    tags: 'general norm dual norm strong convexity Holder RLM stability exercise 13.4 일반 노름 쌍대 노름 횔더',
    stmt: R`각 $\ell(\cdot,z)$가 볼록이고 노름 $\lVert\cdot\rVert$에 대해 $\rho$-립시츠, $R$이 같은 노름에 대해 $2\lambda$-강볼록이면 $\lvert\ell(A(S),z)-\ell(A(S^{(i)}),z)\rvert\le\frac{\rho^2}{\lambda m}$이고, $\E[L_\cD(A(S))]\le L_\cD(w)+R(w)+\frac{2\rho^2}{\lambda m}$ ($\forall w$).`,
    body: R`
**0. 일반 노름에서도 성립하는 강볼록 성질.** 강볼록 + 볼록 = 강볼록(정의를 더함). 또 $\mu$-강볼록 $f$의 최소점 $w_\ast$에서 $f(u)-f(w_\ast)\ge\frac\mu2\lVert u-w_\ast\rVert^2$: 정의에서 $f(w_\ast+t(u-w_\ast))-f(w_\ast)\le t[f(u)-f(w_\ast)]-\frac\mu2t(1-t)\lVert u-w_\ast\rVert^2$, 좌변 $\ge0$, $t$로 나누고 $t\to0^+$. 유클리드 항등식은 어디에도 쓰지 않습니다.

**1. 두 목적함수.** $F_S=L_S+R$, $F_{S^{(i)}}=L_{S^{(i)}}+R$는 모두 $2\lambda$-강볼록. $w=A(S)$, $v=A(S^{(i)})$에 0을 각각 쓰면
$$F_S(v)-F_S(w)\ge\lambda\lVert v-w\rVert^2,\qquad F_{S^{(i)}}(w)-F_{S^{(i)}}(v)\ge\lambda\lVert w-v\rVert^2.$$

**2. 더하기.** 규제 $R$이 상쇄되고, $L_S-L_{S^{(i)}}=\frac{\ell(\cdot,z_i)-\ell(\cdot,z')}m$이라
$$2\lambda\lVert w-v\rVert^2\le\frac{[\ell(v,z_i)-\ell(w,z_i)]+[\ell(w,z')-\ell(v,z')]}m\le\frac{2\rho\lVert w-v\rVert}m.$$
따라서 $\lVert w-v\rVert\le\frac\rho{\lambda m}$.

**3. 손실 안정성.** 모든 $z$에서 $\lvert\ell(w,z)-\ell(v,z)\rvert\le\rho\lVert w-v\rVert\le\frac{\rho^2}{\lambda m}$.

**4. 오라클 부등식.** 적합 항 $\E[L_S(A(S))]\le L_\cD(w)+R(w)$ (최소성, $R\ge0$ 가정)과 정리 13.2의 안정성 항 $\le\frac{\rho^2}{\lambda m}\le\frac{2\rho^2}{\lambda m}$을 더하면 결론.`,
    note: R`유클리드 증명(한쪽 강볼록성만 사용)보다 두 목적함수를 **모두** 쓰면 거리 상한이 $\frac{2\rho}{\lambda m}$에서 $\frac\rho{\lambda m}$으로 반이 됩니다. 립시츠성을 부분기울기로 쓰고 싶다면 “$\rho$-립시츠 ⇔ 모든 부분기울기의 쌍대 노름 $\le\rho$”(노트의 Lemma 3)와 횔더 부등식 $\lvert\langle g,u\rangle\rvert\le\lVert g\rVert_\ast\lVert u\rVert$를 씁니다.` },
  );
})();
