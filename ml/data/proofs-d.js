/* 증명 — Part C: 14 다중 클래스·순위, 15 결정 트리, 16 온라인 학습, 17 군집화, 18 차원 축소
   src가 있는 항목은 김경수 교수님의 증명 노트를 따라간 것입니다. 노트에서 생략된 단계를 채우고, 바로잡을 곳은 note에 적었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 14
  { ch: 'ch14', id: 'gHinge', title: '일반화 힌지 손실: 상한, 볼록, 립시츠', keys: ['일반화 힌지 손실의 성질'], src: '강의 노트 · Corollary 17.1 (Lemma A, B)',
    tags: 'generalized hinge loss multiclass upper bound convex Lipschitz Lemma A B 일반화 힌지 손실 다중 클래스',
    stmt: R`$\ell(w,(x,y))=\max_{y'}[\Delta(y',y)+\langle w,\Psi(x,y')-\Psi(x,y)\rangle]$에 대해 (1) $\Delta(h_w(x),y)\le\ell(w,(x,y))$, (2) $w\mapsto\ell$은 볼록, (3) $\lVert\Psi\rVert\le\rho/2$이면 $\rho$-립시츠.`,
    body: R`
**(1)** $h_w(x)\in\argmax_{y'}\langle w,\Psi(x,y')\rangle$이므로 $\langle w,\Psi(x,h_w(x))-\Psi(x,y)\rangle\ge0$. 그러므로
$$\Delta(h_w(x),y)\le\Delta(h_w(x),y)+\langle w,\Psi(x,h_w(x))-\Psi(x,y)\rangle\le\max_{y'}\big[\Delta(y',y)+\langle w,\Psi(x,y')-\Psi(x,y)\rangle\big].$$
(마지막은 $y'=h_w(x)$가 최댓값의 후보 중 하나이기 때문.)

**(2)** $f_{y'}(w)=\Delta(y',y)+\langle w,\Psi(x,y')-\Psi(x,y)\rangle$는 $w$의 아핀 함수이고, 유한 개 볼록함수의 점별 최댓값은 볼록.

**(3)** $\lvert f_{y'}(w)-f_{y'}(u)\rvert=\lvert\langle w-u,\Psi(x,y')-\Psi(x,y)\rangle\rvert\le\lVert w-u\rVert(\lVert\Psi(x,y')\rVert+\lVert\Psi(x,y)\rVert)\le\rho\lVert w-u\rVert$. 그리고 $\lvert\max_af_a(w)-\max_af_a(u)\rvert\le\max_a\lvert f_a(w)-f_a(u)\rvert$ (최댓값을 이루는 $a$에서 비교)이므로 $\ell$도 $\rho$-립시츠.`,
    note: R`$\Delta(y,y)=0$이라 $y'=y$ 항이 0이므로 $\ell\ge0$입니다. 정답의 점수가 모든 오답보다 $\Delta$ 이상 높으면(“$\Delta$-마진”) 손실이 0이 됩니다.` },
  { ch: 'ch14', id: 'msvm', title: '다중 클래스 SVM의 일반화 상한 (따름정리 17.1)', keys: ['다중 클래스 SVM의 일반화 상한'], src: '강의 노트 · Corollary 17.1',
    tags: 'multiclass SVM corollary 17.1 generalization bound RLM oracle inequality 다중 클래스 SVM 일반화',
    stmt: R`$\lVert\Psi(x,y)\rVert\le\rho/2$, $\lambda=\sqrt{2\rho^2/(B^2m)}$이면 $\E_S[L^\Delta_\cD(h_{w_S})]\le\E_S[L^{\mathrm{g-hinge}}_\cD(w_S)]\le\min_{\lVert u\rVert\le B}L^{\mathrm{g-hinge}}_\cD(u)+\sqrt{8\rho^2B^2/m}$.`,
    body: R`
**첫 부등식.** 성질 (1)을 $(x,y)\sim\cD$에 대해 기댓값: $L^\Delta_\cD(h_w)\le L^{\mathrm{g-hinge}}_\cD(w)$ (모든 $w$). $w=w_S$로 두고 $S$에 대해 기댓값.

**둘째 부등식.** 다중 클래스 SVM은 손실 $\ell^{\mathrm{g-hinge}}$와 규제 $\lambda\lVert w\rVert^2$의 RLM이고, 성질 (2)(3)으로 손실이 볼록·$\rho$-립시츠. 13장 오라클 부등식: 모든 $u$에서
$$\E_S[L^{\mathrm{g-hinge}}_\cD(w_S)]\le L^{\mathrm{g-hinge}}_\cD(u)+\lambda\lVert u\rVert^2+\frac{2\rho^2}{\lambda m}.$$
$\lVert u\rVert\le B$이면 $\lambda\lVert u\rVert^2\le\lambda B^2$. $\lambda=\sqrt{2\rho^2/(B^2m)}=\frac{\rho}B\sqrt{2/m}$에서 $\lambda B^2=\rho B\sqrt{2/m}$, $\frac{2\rho^2}{\lambda m}=\frac{2\rho^2B}{\rho\sqrt{2m}}=\rho B\sqrt{2/m}$. 합 $2\rho B\sqrt{2/m}=\sqrt{8\rho^2B^2/m}$. $\lVert u\rVert\le B$에 대해 최소를 취하면 결론.`,
    note: R`상한에 클래스 수 $k$와 특징 차원 $d$가 없습니다. 다중 벡터 구성에서 $\lVert\Psi(x,y)\rVert=\lVert x\rVert$이므로 $\lVert x\rVert\le\rho/2$이면 되고, $B$는 $[w_1;\dots;w_k]$ 전체의 노름입니다.` },
  { ch: 'ch14', id: 'viterbi', title: '사슬 구조 출력의 argmax: 동적 계획법', keys: ['구조적 출력의 argmax'],
    tags: 'structured output prediction dynamic programming Viterbi chain decomposition 구조적 출력 동적 계획법 비터비',
    stmt: R`$\langle w,\Psi(x,y)\rangle=\sum_t a_t(y_t)+\sum_{t\ge2}b(y_{t-1},y_t)$ ($a_t(s)=\langle w,\phi_1(x_t,s)\rangle$, $b(s',s)=\langle w,\phi_2(s',s)\rangle$)이면 $V_1(s)=a_1(s)$, $V_t(s)=a_t(s)+\max_{s'}[V_{t-1}(s')+b(s',s)]$에 대해 $\max_y\langle w,\Psi(x,y)\rangle=\max_sV_r(s)$.`,
    body: R`
**주장.** $V_t(s)=\max\{\text{점수}_t(y_{1:t}):y_{1:t}\in\Sigma^t,\ y_t=s\}$, 여기서 $\text{점수}_t(y_{1:t})=\sum_{\tau\le t}a_\tau(y_\tau)+\sum_{2\le\tau\le t}b(y_{\tau-1},y_\tau)$.

**귀납법.** $t=1$은 정의. $t-1$에서 성립한다고 하면, $y_t=s$인 접두사는 $y_{t-1}=s'$인 길이 $t-1$ 접두사에 $s$를 붙인 것이고
$$\text{점수}_t(y_{1:t})=\text{점수}_{t-1}(y_{1:t-1})+b(s',s)+a_t(s).$$
$s'$를 고정하면 첫 항의 최대는 $V_{t-1}(s')$ (귀납 가정), 그다음 $s'$에 대해 최대. 이것이 점화식입니다.

**결론.** 전체 점수 $=\text{점수}_r$이고 $\max_y=\max_s V_r(s)$. 각 $V_t(s)$를 이룬 $s'$를 기록해 두면 뒤에서부터 argmax를 복원합니다. 계산량: $t$마다 $\lvert\Sigma\rvert^2$개의 $(s',s)$ 조합 — $O(r\lvert\Sigma\rvert^2)$.`,
    note: R`핵심은 점수가 **이웃한 두 위치**까지만 얽힌다는 분해 가능성입니다. 세 위치 이상이 얽히면 상태를 쌍 $(y_{t-1},y_t)$로 늘려 같은 방법을 쓰고 비용은 $\lvert\Sigma\rvert^3$으로 늘어납니다.` },
  { ch: 'ch14', id: 'kendallSurrogate', title: '켄달 타우 손실의 볼록 대리 손실', keys: ['순위 손실과 대리 손실'],
    tags: 'Kendall tau ranking loss convex surrogate logistic pairwise 켄달 타우 순위 대리 손실',
    stmt: R`$y_i\ne y_j$인 쌍에서 $\one[\sign(y'_i-y'_j)\ne\sign(y_i-y_j)]\le\log_2\big(1+e^{-\sign(y_i-y_j)(y'_i-y'_j)}\big)$이고, $y'=h_w(\bar x)$ (선형)이면 우변은 $w$의 볼록함수이다.`,
    body: R`
$z=\sign(y_i-y_j)(y'_i-y'_j)$라 두면 (타이 $y'_i=y'_j$는 틀린 것으로 셈) 좌변은 $\one[z\le0]$.

**상한.** $g(z)=\log_2(1+e^{-z})$는 감소함수이고 $g(0)=\log_22=1$. $z\le0$이면 $g(z)\ge1=\one[z\le0]$; $z>0$이면 $g(z)>0=\one[z\le0]$.

**볼록.** $\log(1+e^{-z})$는 $z$의 볼록함수(이계도함수 $\sigma(z)(1-\sigma(z))\ge0$)이고, $\log_2$는 양수배일 뿐. $y'_i-y'_j=\langle w,x_i-x_j\rangle$은 $w$에 선형이므로 합성도 볼록. 쌍에 대한 합과 양수배도 볼록.`,
    note: R`자연로그로 $\ln(1+e^{-z})$를 쓰면 $z=0$에서 $\ln2<1$이라 상한이 되지 않습니다. 밑을 2로 쓰거나 $\frac1{\ln2}$를 곱해야 합니다. 동률 $y_i=y_j$인 쌍은 켄달 타우에서 보통 제외합니다.` },
  // ───── 15
  { ch: 'ch15', id: 'leafConst', title: '잎의 최적 상수와 위험의 잎별 분해', keys: ['잎의 최적 상수 예측'], src: '강의 노트 · 18장, 보충 Thm 3.1–3.4',
    tags: 'decision tree leaf constant mean majority vote risk decomposition 잎 평균 다수결 분해',
    stmt: R`트리 $T$의 잎 $\ell$에 도착한 표본을 $S_\ell$이라 하면 $L_S(f_T)=\sum_\ell\frac{\lvert S_\ell\rvert}{\lvert S\rvert}L_{S_\ell}(c_\ell)$. 각 잎의 최적 상수는 제곱 손실에서 평균 $\bar y_{S_\ell}$, 0–1 손실에서 다수결이다.`,
    body: R`
**분해.** 잎들은 정의역의 분할이라 각 예제는 정확히 한 잎에 속합니다. 따라서 $\sum_i\mathrm{loss}(y_i,f_T(x_i))=\sum_\ell\sum_{i\in S_\ell}\mathrm{loss}(y_i,c_\ell)$. $\lvert S\rvert$로 나누면 식이 됩니다. 잎의 상수는 서로 독립적으로 최적화할 수 있습니다.

**제곱 손실.** $\sum_{i\in S_\ell}(y_i-c)^2=\sum_i(y_i-\bar y)^2+\lvert S_\ell\rvert(\bar y-c)^2$ (교차항 $2(\bar y-c)\sum(y_i-\bar y)=0$). 최소는 $c=\bar y$에서 유일.

**0–1 손실.** $p$=잎의 양성 비율. 상수 1은 음성을 모두 틀려 $1-p$, 상수 0은 $p$. 최소 $\min\{p,1-p\}$는 다수결이 이룹니다.`,
    note: R`분해 덕분에 트리 학습은 “구조(분할) 고르기”와 “잎 값 고르기”로 나뉘고, 뒤의 것은 닫힌 해가 있습니다. 어려운 것은 앞의 것입니다.` },
  { ch: 'ch15', id: 'treeMDL', title: '결정 트리의 MDL 상한', keys: ['결정 트리의 MDL 상한'],
    tags: 'decision tree MDL description length prefix free Occam bound 결정 트리 설명 길이 접두사 없는',
    stmt: R`$\cX=\{0,1\}^d$, 노드 $n$개인 트리를 $(n+1)\log_2(d+3)$비트로 적는 접두사 없는 코드가 있고, 따라서 확률 $1-\delta$ 이상으로 모든 트리 $h$에서 $L_\cD(h)\le L_S(h)+\sqrt{\frac{(n+1)\log_2(d+3)+\ln(2/\delta)}{2m}}$.`,
    body: R`
**코드.** 노드를 전위 순회 순서로 적고 마지막에 “끝” 블록을 붙입니다. 블록은 {내부 노드 $\one[x_i=1]$ ($d$가지), 잎 0, 잎 1, 끝} 중 하나라 $d+3$가지, 블록당 $\log_2(d+3)$비트(정수로 올림해도 논증은 같음). 노드 $n$개면 블록 $n+1$개.

**복호 가능.** 모든 내부 노드가 자식 둘을 가지므로 전위 순서열에서 트리 구조가 유일하게 복원됩니다(재귀적으로: 내부 노드를 읽으면 왼쪽 부분트리, 오른쪽 부분트리를 차례로 읽음).

**접두사 없음.** 코드어는 “끝” 블록을 정확히 하나, 맨 마지막에 가집니다. $c_1$이 $c_2$의 접두사라면 $c_1$의 마지막 블록(끝)이 $c_2$의 같은 위치에 있고, $c_2$의 끝 블록은 맨 마지막뿐이므로 두 코드어의 길이가 같아 $c_1=c_2$.

**상한.** 7장 오컴 상한 $L_\cD(h)\le L_S(h)+\sqrt{(\lvert h\rvert+\ln(2/\delta))/(2m)}$에 $\lvert h\rvert=(n+1)\log_2(d+3)$을 넣습니다.`,
    note: R`크기 제한 없는 트리 클래스는 VC 차원이 $2^d$라 균일한 상한이 쓸모없지만, MDL은 작은 트리에 작은 벌점을 주어 **트리마다 다른** 상한을 줍니다. 비균등 학습(7장)의 전형적인 쓰임입니다.` },
  { ch: 'ch15', id: 'infoGainMI', title: '정보 이득은 경험적 상호정보량이다', keys: ['정보 이득 = 경험적 상호정보량'], src: '강의 노트 · 보충 Thm 5.1',
    tags: 'information gain mutual information entropy conditional ID3 Gibbs 정보 이득 상호정보량 조건부 엔트로피',
    stmt: R`표본 $S$의 경험분포에서 $\mathrm{Gain}_{\mathrm{entropy}}(S,i)=H(Y)-H(Y\mid X_i)=I(X_i;Y)\ge0$.`,
    body: R`
경험분포에서 $a=\Prob[Y=1]$, $q_v=\Prob[X_i=v]$, $a_v=\Prob[Y=1\mid X_i=v]$ ($v\in\{0,1\}$), $H_b(t)=-t\log t-(1-t)\log(1-t)$.

**식별.** $H(Y)=H_b(a)$. 조건부 엔트로피의 정의 $H(Y\mid X_i)=\sum_v\Prob[X_i=v]H(Y\mid X_i=v)=\sum_vq_vH_b(a_v)$. 이득의 정의 $H_b(a)-\sum_vq_vH_b(a_v)$와 같으므로 $\mathrm{Gain}=H(Y)-H(Y\mid X_i)=I(X_i;Y)$.

**비음성.** $I(X;Y)=\sum_{x,y}p(x,y)\log\frac{p(x,y)}{p(x)p(y)}=\KL(p_{XY}\Vert p_Xp_Y)\ge0$ (깁스 부등식, 젠센으로 증명). 등호 $\iff$ 경험분포에서 $X_i$와 $Y$ 독립 $\iff$ $a_0=a_1=a$.`,
    note: R`이득이 0인 분할은 자식들의 양성 비율이 부모와 똑같은 분할뿐입니다. XOR 예가 바로 그 경우입니다. 엔트로피가 엄격히 오목이라, 비율이 조금이라도 달라지면 이득이 양수가 됩니다.` },
  { ch: 'ch15', id: 'giniDisagree', title: '지니 불순도는 불일치 확률이다', keys: ['지니 불순도 = 불일치 확률'], src: '강의 노트 · 보충 Thm 4.2',
    tags: 'Gini impurity disagreement probability multiclass 지니 불순도 불일치 확률',
    stmt: R`노드의 클래스 비율이 $p_1,\dots,p_K$일 때, 레이블 두 개를 독립으로 뽑아 서로 다를 확률은 $1-\sum_kp_k^2$이고, $K=2$이면 $2p(1-p)$.`,
    body: R`
두 레이블 $Y,Y'$가 독립이고 같은 분포 $(p_k)$를 따르면 $\Prob(Y=Y')=\sum_k\Prob(Y=k)\Prob(Y'=k)=\sum_kp_k^2$. 따라서 $\Prob(Y\ne Y')=1-\sum_kp_k^2$.

$K=2$, $p_1=p$, $p_2=1-p$: $1-p^2-(1-p)^2=1-p^2-1+2p-p^2=2p-2p^2=2p(1-p)$.

순수한 노드(어떤 $p_k=1$)에서만 0이고, 균등할 때 최대 $1-\frac1K$입니다.`,
    note: R`또 다른 해석: 노드의 레이블 분포를 따라 **무작위로 예측**하는 분류기의 오분류율이 지니 불순도입니다. 다수결 분류기의 오분류율 $1-\max_kp_k$보다 항상 크거나 같습니다.` },
  { ch: 'ch15', id: 'xorGain', title: 'XOR: 한 단계 이득이 0인 유용한 특징', keys: ['탐욕적 분할의 한계'], src: '강의 노트 · 보충 Example 5.2',
    tags: 'XOR greedy split zero information gain interaction decision tree limitation 탐욕 XOR 상호작용',
    stmt: R`$(x_1,x_2)$가 $\{0,1\}^2$에서 균등하고 $y=x_1\oplus x_2$이면, $x_1$과 $x_2$ 각각의 한 단계 이득은 (어떤 불순도 $C$로도) 0이지만, 깊이 2의 트리는 오차 0이다.`,
    body: R`
$\Prob[y=1]=\frac12$ (네 조합 중 $(0,1),(1,0)$). $x_1=0$이면 $y=x_2$라 $\Prob[y=1\mid x_1=0]=\frac12$; $x_1=1$이면 $y=1-x_2$라 역시 $\frac12$. 따라서
$$\mathrm{Gain}(S,1)=C(\tfrac12)-\big(\tfrac12C(\tfrac12)+\tfrac12C(\tfrac12)\big)=0.$$
$x_2$도 대칭. 한편 뿌리에서 $x_1$, 두 자식에서 $x_2$로 나누면 네 잎이 각각 한 조합이라 순수 — 오차 0.`,
    note: R`탐욕적 ID3는 동점일 때 아무 특징이나 고르므로 이 경우에도 결국 맞는 트리에 도달할 수는 있지만, 무관한 특징이 섞여 있으면 이득 0인 $x_1,x_2$ 대신 우연히 이득이 조금 있는 잡음 특징을 고를 수 있습니다. 상호작용만으로 설명되는 구조는 한 단계 앞만 보는 탐욕법의 사각지대입니다.` },
  { ch: 'ch15', id: 'sweep', title: '정렬-훑기로 최선의 문턱 찾기', keys: ['문턱 분할의 정렬-훑기'], src: '강의 노트 · 보충 Thm 5.3',
    tags: 'threshold split sorting sweep running time real valued features 문턱 정렬 훑기 계산량',
    stmt: R`특징 $d$개, 예제 $m$개에서 각 특징의 최선의 문턱 분할(이득 최대)을 모두 $O(dm\log m)$에 찾을 수 있다.`,
    body: R`
**후보가 유한.** 특징 $i$의 값들을 $z_1\le\dots\le z_m$로 정렬하면, $\theta$가 $(z_j,z_{j+1})$ 안 어디에 있든 $\one[x_i<\theta]$는 같은 분할을 만듭니다. 서로 다른 분할은 많아야 $m+1$개(중점들과 양 끝).

**훑기.** 문턱을 왼쪽에서 오른쪽으로 옮기면 한 번에 한 예제가 왼쪽 자식으로 넘어갑니다. 왼쪽·오른쪽의 (예제 수, 양성 수)를 들고 다니면 넘어갈 때마다 $O(1)$에 갱신되고, 이득은 이 네 수의 함수라 $O(1)$에 계산됩니다. 값이 같은 예제들은 한꺼번에 넘깁니다.

**합계.** 특징마다 정렬 $O(m\log m)$ + 훑기 $O(m)$. $d$개 특징이면 $O(dm\log m)$.`,
    note: R`트리를 키우는 동안 자식 노드에서도 부모의 정렬 순서를 물려받으면(안정 분할) 정렬을 다시 하지 않아도 됩니다. 결정 트리가 대용량 자료에서도 빠른 이유입니다.` },
  { ch: 'ch15', id: 'crossEnt', title: '베르누이 교차 엔트로피 = 로지스틱 손실', keys: ['교차 엔트로피 = 로지스틱 손실'], src: '강의 노트 · 11.5 보충',
    tags: 'cross entropy logistic loss Bernoulli likelihood label conversion margin boosting 교차 엔트로피 로지스틱 손실',
    stmt: R`$p=\frac1{1+e^{-2f}}$, $\tilde y\in\{0,1\}$, $y=2\tilde y-1$이면 $-\tilde y\log p-(1-\tilde y)\log(1-p)=\log(1+e^{-2yf})$.`,
    body: R`
**베르누이 가능도.** $\Prob(\tilde Y=\tilde y)=p^{\tilde y}(1-p)^{1-\tilde y}$이고 음의 로그를 취하면 로그 법칙 $\log(ab)=\log a+\log b$, $\log a^b=b\log a$로 교차 엔트로피가 됩니다.

**$y=+1$.** $\tilde y=1$: $-\log p=-\log\frac1{1+e^{-2f}}=\log(1+e^{-2f})=\log(1+e^{-2yf})$.

**$y=-1$.** $\tilde y=0$: $1-p=\frac{e^{-2f}}{1+e^{-2f}}$이므로
$$-\log(1-p)=-\big(\log e^{-2f}-\log(1+e^{-2f})\big)=2f+\log(1+e^{-2f})=\log\big(e^{2f}+1\big)=\log(1+e^{-2yf}).$$
($a+\log(1+e^{-a})=\log(e^a+1)$을 $a=2f$로.)`,
    note: R`손실이 마진 $yf$에만 기대는 것이 핵심입니다. 인수 2는 $f=\frac12\log\frac p{1-p}$ — 지수 손실 $e^{-yf}$의 모집단 최소점과 같은 척도 — 로 맞춘 관례이고, $p=\sigma(f)$로 두면 7단원의 $\log(1+e^{-yf})$가 됩니다.` },
  // ───── 16
  { ch: 'ch16', id: 'halving', title: '반감 알고리즘의 실수 상한', keys: ['반감 알고리즘의 실수 상한'],
    tags: 'halving algorithm mistake bound log2 H version space online 반감 알고리즘 실수 상한 버전 공간',
    stmt: R`실현가능한 온라인 문제에서 유한 $\cH$에 대한 반감 알고리즘의 실수는 $\log_2\lvert\cH\rvert$ 이하이다.`,
    body: R`
$V_1=\cH$, $V_{t+1}=\{h\in V_t:h(x_t)=y_t\}$. 예측은 $V_t$의 다수결.

실현가능하므로 $h^\star\in V_t$ (모든 $t$), 즉 $\lvert V_t\rvert\ge1$.

라운드 $t$에서 틀렸다면 다수결 레이블 $\hat y_t\ne y_t$이고, $\hat y_t$를 예측한 가설이 $V_t$의 절반 이상. 이들은 모두 $V_{t+1}$에서 빠지므로 $\lvert V_{t+1}\rvert\le\frac12\lvert V_t\rvert$. 맞힌 라운드에서도 $\lvert V_{t+1}\rvert\le\lvert V_t\rvert$.

$M$번 틀리면 $1\le\lvert V_{T+1}\rvert\le2^{-M}\lvert\cH\rvert$, 따라서 $M\le\log_2\lvert\cH\rvert$.`,
    note: R`계산은 비쌀 수 있지만(버전 공간 전체의 투표) 실수 상한은 유한 클래스에서 최적에 가깝습니다. 무한 클래스로 넓힌 것이 SOA이고, 반감은 “가장 큰 쪽”을 크기로 재는 SOA의 특수한 경우입니다.` },
  { ch: 'ch16', id: 'soa', title: 'SOA는 리틀스톤 차원만큼만 틀린다', keys: ['SOA의 실수 상한'], src: '강의 노트 · Lemma 6.5',
    tags: 'standard optimal algorithm SOA Littlestone dimension mistake bound shattered tree 리틀스톤 차원 SOA',
    stmt: R`실현가능하면 SOA의 실수는 $\Ldim(\cH)$ 이하이고, 어떤 알고리즘도 $\Ldim(\cH)$보다 적게 틀리도록 보장할 수 없다.`,
    body: R`
**상한.** $D_t=\Ldim(V_t)$ ($\Ldim(\emptyset)=-1$). 실현가능이라 $V_t\ne\emptyset$, $D_t\ge0$. 틀릴 때마다 $D_{t+1}\le D_t-1$임을 보이면 됩니다.

틀렸다면 $V_{t+1}=V_t^{(y_t)}$, 그리고 SOA는 $\Ldim(V_t^{(\hat y_t)})\ge\Ldim(V_t^{(y_t)})$인 $\hat y_t\ne y_t$를 골랐습니다. $\Ldim(V_{t+1})=D_t=:d$라면 $V_t^{(0)},V_t^{(1)}\subseteq V_t$라 둘 다 $\Ldim=d$이고, 각각 깊이 $d$ 트리 $\mathcal T_0,\mathcal T_1$을 분쇄합니다. 뿌리에 $x_t$, 0 가지에 $\mathcal T_0$, 1 가지에 $\mathcal T_1$을 붙인 깊이 $d+1$ 트리를 보면, 경로 $(r,y_2,\dots,y_{d+1})$에 대해 $\mathcal T_r$의 경로 $(y_2,\dots)$를 실현하는 $h\in V_t^{(r)}$는 $h(x_t)=r$도 만족하므로 $V_t$가 이 트리를 분쇄 — $\Ldim(V_t)=d$에 모순.

**하한.** 깊이 $D=\Ldim(\cH)$의 분쇄된 트리에서, 적은 뿌리의 점을 내고 학습기의 예측과 반대 레이블을 주며 그 가지로 내려갑니다. $D$라운드 모두 틀리고, 따라간 경로를 실현하는 $h\in\cH$가 있으므로 예제열은 실현가능합니다. (무작위 학습기라도 적이 레이블을 무작위로 주면 기대 실수 $D/2$.)`,
    note: R`SOA는 “어느 쪽 답이 와도 남은 적의 힘(리틀스톤 차원)이 작도록” 예측합니다. 반감 알고리즘이 버전 공간의 **크기**를 반으로 줄인다면, SOA는 **리틀스톤 차원**을 하나씩 줄입니다.` },
  { ch: 'ch16', id: 'vcLdim', title: 'VC 차원 ≤ 리틀스톤 차원 ≤ log₂|H|', keys: ['VC 차원과 리틀스톤 차원'],
    tags: 'VC dimension Littlestone dimension comparison thresholds infinite online not learnable VC 리틀스톤 비교 문턱',
    stmt: R`$\VC(\cH)\le\Ldim(\cH)\le\log_2\lvert\cH\rvert$이고, $[0,1]$ 위의 문턱 함수는 $\VC=1$, $\Ldim=\infty$이다.`,
    body: R`
**$\VC\le\Ldim$.** $\{x_1,\dots,x_d\}$가 분쇄되면, 깊이 $t$의 모든 노드에 $x_t$를 붙인 깊이 $d$ 트리를 만듭니다. 경로 $(y_1,\dots,y_d)$는 “$x_t$에 $y_t$”라는 레이블링이고, 분쇄되었으므로 그것을 실현하는 $h$가 있습니다.

**$\Ldim\le\log_2\lvert\cH\rvert$.** 깊이 $d$ 트리가 분쇄되면 $2^d$개 경로마다 실현하는 가설이 있고, 서로 다른 두 경로는 처음 갈라지는 노드의 점에서 다른 값을 요구하므로 가설도 다릅니다. $2^d\le\lvert\cH\rvert$.

**문턱 함수.** $\cH=\{x\mapsto\one[x<a]:a\in[0,1]\}$. VC 차원 1 (5단원). 임의의 깊이 $d$에 대해, 구간 $(l,r)=(0,1)$에서 시작해 노드에 중점 $\frac{l+r}2$를 두고, 레이블 1 가지로는 $(\frac{l+r}2,r)$ (문턱이 점의 오른쪽), 0 가지로는 $(l,\frac{l+r}2)$로 구간을 넘기는 이분 트리를 만듭니다. 어떤 경로든 끝 구간이 비어 있지 않아 그 안의 $a$가 경로의 모든 레이블을 실현하므로 분쇄 — $\Ldim=\infty$.`,
    note: R`PAC 학습(통계적)은 쉬운데 온라인 학습(적대적)은 불가능한 클래스가 있다는 뜻입니다. 적응적인 적이 무작위 표본보다 훨씬 강합니다.` },
  { ch: 'ch16', id: 'coverImpossible', title: '결정적 예측은 선형 후회를 피할 수 없다', keys: ['결정적 예측의 한계'], src: '강의 노트 · Proposition 3.1',
    tags: 'Cover impossibility deterministic online prediction linear regret adversary randomization 커버 결정적 예측 후회',
    stmt: R`예측이 $\{0,1\}$로 결정적이면, $\cH=\{h\equiv0,h\equiv1\}$에 대해서도 모든 알고리즘에 후회 $\ge T/2$인 적응적 예제열이 있다.`,
    body: R`
적은 매 라운드 학습기의 (결정적) 예측 $p_t\in\{0,1\}$을 계산할 수 있으므로 $y_t=1-p_t$로 레이블을 줍니다. 학습기의 누적 손실은 $\sum_t\lvert p_t-y_t\rvert=T$.

한편 $y_1,\dots,y_T$ 중 0이 $T/2$개 이상이면 $h\equiv0$의 실수는 1의 개수 $\le T/2$, 아니면 $h\equiv1$의 실수 $\le T/2$. 따라서 $\min_{h\in\cH}\sum_t\lvert h(x_t)-y_t\rvert\le T/2$이고 후회 $\ge T-T/2=T/2$.`,
    note: R`무작위화가 이 논법을 막는 이유: 적은 $p_t$(확률)는 알아도 실제 동전의 결과는 모르므로 “늘 반대 레이블”을 줄 수 없습니다. 후회의 정의도 기대 손실 $\lvert p_t-y_t\rvert$로 바뀝니다.` },
  { ch: 'ch16', id: 'wm', title: '가중 다수결의 후회 상한', keys: ['가중 다수결의 후회 상한'], src: '강의 노트 · Theorem 4.5',
    tags: 'weighted majority multiplicative weights regret bound experts potential sqrt 2 T log d 가중 다수결 후회 퍼텐셜',
    stmt: R`비용 $v_t\in[0,1]^d$, $\eta\in(0,1]$에서 $\sum_t\langle w^{(t)},v_t\rangle-\min_i\sum_tv_{t,i}\le\frac{\ln d}\eta+\frac{\eta T}2$. $T>2\ln d$, $\eta=\sqrt{2\ln d/T}$이면 $\le\sqrt{2T\ln d}$.`,
    body: R`
**보조 부등식.** $a\ge0$에서 $e^{-a}\le1-a+\frac{a^2}2$ ($g(a)=1-a+\frac{a^2}2-e^{-a}$는 $g(0)=0$, $g'(a)=-1+a+e^{-a}\ge0$). 그리고 $b<1$에서 $\ln(1-b)\le-b$.

**위로.** $\frac{Z_{t+1}}{Z_t}=\sum_iw^{(t)}_ie^{-\eta v_{t,i}}\le\sum_iw^{(t)}_i\big(1-\eta v_{t,i}+\frac{\eta^2v_{t,i}^2}2\big)\le1-\eta\langle w^{(t)},v_t\rangle+\frac{\eta^2}2=:1-b_t$ ($v_{t,i}^2\le1$). $b_t<1$이라 $\ln\frac{Z_{t+1}}{Z_t}\le-b_t$. 합: $\ln Z_{T+1}-\ln Z_1\le-\eta\sum_t\langle w^{(t)},v_t\rangle+\frac{\eta^2T}2$, $Z_1=d$.

**아래로.** $\tilde w^{(T+1)}_i=e^{-\eta\sum_tv_{t,i}}$이므로 $\ln Z_{T+1}\ge\ln\max_ie^{-\eta\sum_tv_{t,i}}=-\eta\min_i\sum_tv_{t,i}$.

**합치기.** $-\eta\min_i\sum_tv_{t,i}-\ln d\le-\eta\sum_t\langle w^{(t)},v_t\rangle+\frac{\eta^2T}2$. $\eta>0$으로 나누고 이항. $\eta=\sqrt{2\ln d/T}$에서 두 항이 모두 $\sqrt{T\ln d/2}$, 합 $\sqrt{2T\ln d}$. ($T\le2\ln d$이면 후회 $\le T\le\sqrt{2T\ln d}$로 자명.)`,
    note: R`퍼텐셜 $\ln Z_t$는 “전문가 가중치의 부드러운 최댓값”입니다. 학습기가 비용을 낼 때마다 퍼텐셜이 그만큼 줄고($\ln Z$ 감소 ≥ 학습기 비용), 최선의 전문가 하나만으로도 퍼텐셜이 $-\eta\cdot$(그의 비용) 아래로 내려가지 않습니다. 이 “곱셈 가중치” 논법은 부스팅, 게임 이론, 선형계획 근사 알고리즘에도 반복해 나옵니다.` },
  { ch: 'ch16', id: 'onlineClass', title: '온라인 분류의 후회 상한 (정리 21.10)', keys: ['온라인 분류의 후회 상한'], src: '강의 노트 · Lemma 7.3, 7.4, Theorem 8.1',
    tags: 'online classification unrealizable regret Littlestone dimension experts SOA flips binomial counting theorem 21.10 무한 클래스 전문가',
    stmt: R`모든 $\cH$에 대해 $[0,1]$ 예측의 알고리즘이 있어 모든 예제열·모든 $h$에서 $\sum_t\lvert p_t-y_t\rvert-\sum_t\lvert h(x_t)-y_t\rvert\le\sqrt{2T\min\{\ln\lvert\cH\rvert,\Ldim(\cH)\ln(eT)\}}$.`,
    body: R`
**유한 클래스.** 가설마다 전문가, $p_t=\sum_iw_i^{(t)}h_i(x_t)$, 비용 $v_{t,i}=\lvert h_i(x_t)-y_t\rvert$. $y_t\in\{0,1\}$이면 $h_i(x_t)-y_t$가 모두 같은 부호라 $\lvert p_t-y_t\rvert=\lvert\sum_iw_i(h_i(x_t)-y_t)\rvert=\sum_iw_i\lvert h_i(x_t)-y_t\rvert=\langle w^{(t)},v_t\rangle$. 가중 다수결로 후회 $\le\sqrt{2T\ln\lvert\cH\rvert}$.

**리틀스톤 차원 $D<\infty$.** 전문가 $E_{i_1..i_L}$ ($0\le L\le D$): SOA를 **자기 예측으로** 갱신하며 흉내 내되 라운드 $i_1,\dots,i_L$에서만 뒤집음.
- *흉내.* 입력열 $x_{1:T}$와 $h$를 고정. $h$로 레이블한 실현가능 열에서 SOA가 틀린 라운드(많아야 $D$개)를 뒤집기 라운드로 둔 전문가를 보면, 귀납법으로 매 라운드 두 버전 공간이 같고, 뒤집지 않는 라운드는 SOA가 맞았으니 $h(x_t)$, 뒤집는 라운드는 SOA가 틀렸으니 반대로 해서 $h(x_t)$를 예측. 갱신도 같은 레이블 $h(x_t)$로 하므로 버전 공간이 계속 같습니다.
- *개수.* $N=\sum_{L\le D}\binom TL\le(eT/D)^D$, $\ln N\le D\ln(eT)$ ($D\ge1$; $D=0$이면 $N=1$).

이 $N$명에 가중 다수결: 후회(최선의 전문가 대비) $\le\sqrt{2T\ln N}$. 모든 $h$에 대해 $h$를 흉내 내는 전문가가 있으므로 최선의 전문가 손실 $\le$ $h$의 손실. 두 구성 중 좋은 쪽을 쓰면 결론.`,
    note: R`전문가는 참 레이블을 보지 않고 자기 예측으로 버전 공간을 갱신한다는 점이 핵심입니다(노트의 Remark 7.2). 그래야 “$h$의 세계”를 그대로 재현할 수 있습니다. 전문가가 $T$에 기대므로 $T$를 미리 알아야 하고, 모르면 배증 기법을 씁니다.` },
  { ch: 'ch16', id: 'doubling', title: '배증 기법', keys: ['배증 기법'], src: '강의 노트 · Proposition 10.2',
    tags: 'doubling trick unknown horizon regret epochs geometric sum 배증 기법 시간 지평',
    stmt: R`길이 $m$을 알 때 후회 $\le\alpha\sqrt m$인 알고리즘을 길이 $2^0,2^1,2^2,\dots$ 구간마다 새로 시작하면 처음 $T$라운드의 후회는 $\frac{\sqrt2}{\sqrt2-1}\alpha\sqrt T$ 이하이다.`,
    body: R`
구간 $j$의 길이 $2^j$, 마지막 구간 번호를 $K$(마지막은 잘릴 수 있음)라 하면 전체 후회는 구간별 후회의 합 이하(각 구간의 최선 가설과 비교한 합 ≥ 전체 최선과 비교한 값):
$$\le\sum_{j=0}^K\alpha\sqrt{2^j}=\alpha\sum_{j=0}^K2^{j/2}=\alpha\frac{2^{(K+1)/2}-1}{\sqrt2-1}\le\alpha\frac{2^{(K+1)/2}}{\sqrt2-1}.$$
구간 $K$가 시작되었으므로 $T\ge2^0+\dots+2^{K-1}+1=2^K$, 즉 $2^{(K+1)/2}\le\sqrt{2T}$. 대입하면 $\le\frac{\sqrt2}{\sqrt2-1}\alpha\sqrt T$.`,
    note: R`“구간마다 최선”의 합은 “전체 최선”보다 작거나 같으므로(구간마다 다른 가설을 고를 수 있음) 구간별 후회의 합이 전체 후회의 상한이 됩니다. 대가는 상수 $\approx3.41$배뿐입니다.` },
  { ch: 'ch16', id: 'ogd', title: '온라인 경사하강의 후회 (정리 21.15)', keys: ['온라인 경사하강의 후회'],
    tags: 'online gradient descent regret convex Lipschitz projection theorem 21.15 온라인 경사하강 후회',
    stmt: R`$w^{(t+1)}=\Pi_\cH(w^{(t)}-\eta v_t)$, $v_t\in\partial f_t(w^{(t)})$, $w^{(1)}=0$이면 모든 $w^\star\in\cH$에서 $\sum_t(f_t(w^{(t)})-f_t(w^\star))\le\frac{\lVert w^\star\rVert^2}{2\eta}+\frac\eta2\sum_t\lVert v_t\rVert^2$.`,
    body: R`
**볼록성.** $f_t(w^{(t)})-f_t(w^\star)\le\langle w^{(t)}-w^\star,v_t\rangle$.

**한 걸음.** $w^{(t+\frac12)}=w^{(t)}-\eta v_t$. 사영은 $\cH$의 점까지의 거리를 늘리지 않으므로 $\lVert w^{(t+1)}-w^\star\rVert^2\le\lVert w^{(t+\frac12)}-w^\star\rVert^2=\lVert w^{(t)}-w^\star\rVert^2-2\eta\langle w^{(t)}-w^\star,v_t\rangle+\eta^2\lVert v_t\rVert^2$. 정리하면
$$\langle w^{(t)}-w^\star,v_t\rangle\le\frac{\lVert w^{(t)}-w^\star\rVert^2-\lVert w^{(t+1)}-w^\star\rVert^2}{2\eta}+\frac\eta2\lVert v_t\rVert^2.$$

**망원합.** $t=1..T$ 합에서 거리 항은 $\le\frac{\lVert w^{(1)}-w^\star\rVert^2}{2\eta}=\frac{\lVert w^\star\rVert^2}{2\eta}$. $\rho$-립시츠면 $\lVert v_t\rVert\le\rho$, $\lVert w^\star\rVert\le B$, $\eta=\frac B{\rho\sqrt T}$로 $B\rho\sqrt T$.`,
    note: R`기댓값도 확률도 없는 **결정적** 부등식입니다. 그래서 적이 $f_t$를 어떻게 고르든 성립하고, i.i.d. 자료에 적용하면 SGD의 상한이 따라 나옵니다.` },
  { ch: 'ch16', id: 'onlinePerceptron', title: '온라인 퍼셉트론의 실수 상한 (정리 21.16)', keys: ['온라인 퍼셉트론의 실수 상한'],
    tags: 'online perceptron mistake bound hinge loss nonseparable OGD scale invariance theorem 21.16 퍼셉트론 힌지 분리 불가능',
    stmt: R`$\lvert\mathcal M\rvert\le\sum_tf_t(w^\star)+R\lVert w^\star\rVert\sqrt{\sum_tf_t(w^\star)}+R^2\lVert w^\star\rVert^2$, $f_t(w)=\one[t\in\mathcal M][1-y_t\langle w,x_t\rangle]_+$.`,
    body: R`
**OGD로 보기.** 틀린 라운드에서 $f_t$의 부분기울기는 $v_t=-y_tx_t$ (틀렸으니 $y_t\langle w^{(t)},x_t\rangle\le0<1$이라 힌지의 기울어진 쪽), 맞은 라운드는 $f_t\equiv0$이라 $v_t=0$. 보폭 $\eta$의 OGD는 $w\leftarrow w+\eta y_tx_t$ (틀린 라운드만). $w^{(1)}=0$이면 보폭 $\eta$의 반복값은 보폭 1(퍼셉트론)의 $\eta$배라 **예측이 같습니다** — 그래서 분석에서 $\eta$를 자유롭게 고를 수 있습니다.

**후회 부등식.** 틀린 라운드에서 $f_t(w^{(t)})=1-y_t\langle w^{(t)},x_t\rangle\ge1$이므로
$$\lvert\mathcal M\rvert\le\sum_tf_t(w^{(t)})\le\sum_tf_t(w^\star)+\frac{\lVert w^\star\rVert^2}{2\eta}+\frac\eta2\lvert\mathcal M\rvert R^2.$$

**$\eta$ 선택.** $\eta=\frac{\lVert w^\star\rVert}{R\sqrt{\lvert\mathcal M\rvert}}$이면 뒤 두 항이 합쳐 $R\lVert w^\star\rVert\sqrt{\lvert\mathcal M\rvert}$. $F=\sum_tf_t(w^\star)$, $c=R\lVert w^\star\rVert$, $u=\sqrt{\lvert\mathcal M\rvert}$로 쓰면 $u^2\le cu+F$.

**이차부등식 풀기.** 근의 공식으로 $u\le\frac{c+\sqrt{c^2+4F}}2\le\frac{c+(c+2\sqrt F)}2=c+\sqrt F$ ($\sqrt{c^2+4F}\le c+2\sqrt F$). 다시 넣으면 $u^2\le cu+F\le c(c+\sqrt F)+F=F+c\sqrt F+c^2$.`,
    note: R`분리 가능($y_t\langle w^\star,x_t\rangle\ge1$)이면 $F=0$이라 9단원의 $(R\lVert w^\star\rVert)^2$. 분리 불가능해도 퍼셉트론은 “최선의 분리기가 치르는 힌지 손실” 근처만큼만 더 틀립니다.` },
  // ───── 17
  { ch: 'ch17', id: 'kruskal', title: '단일 연결 군집화 = 크러스컬 알고리즘', keys: ['단일 연결 = 크러스컬 최소 신장 트리'], src: '강의 노트 · Theorem 2.6',
    tags: 'single linkage Kruskal minimum spanning tree cut property clustering 단일 연결 크러스컬 최소 신장 트리',
    stmt: R`단일 연결의 합병 순서는 크러스컬 알고리즘이 간선을 채택하는 순서와 같고, $k$-군집 멈춤의 결과는 최소 신장 트리에서 가장 무거운 간선 $k-1$개를 지운 연결 성분이다.`,
    body: R`
(동점이 없다고 가정. 있으면 같은 동점 규칙을 쓰면 됨.)

**귀납 주장.** 단일 연결의 매 단계 군집들 = 크러스컬 숲의 연결 성분.

처음엔 둘 다 단원소. 성립한다고 합시다. 단일 연결은 $D(A,B)=\min_{x\in A,y\in B}d(x,y)$가 가장 작은 두 군집을 합치므로, 서로 다른 성분을 잇는 간선 중 **가장 가벼운 간선** $e$로 합칩니다. 크러스컬은 간선을 가벼운 순서로 보면서 같은 성분 안의 간선은 버리므로, 지금까지 본 간선은 모두 성분 안에 있고(채택되었거나 버려짐), 다음에 채택하는 간선은 성분을 잇는 간선 중 가장 가벼운 것 — 같은 $e$입니다. 합친 뒤 성분도 같습니다.

**최소 신장 트리.** 크러스컬이 만드는 트리가 최소 신장 트리임은 절단 성질(어떤 절단을 가로지르는 가장 가벼운 간선은 최소 신장 트리에 속함)에서 나옵니다: 채택되는 $e$는 “$e$가 잇는 한 성분 대 나머지” 절단을 가로지르는 가장 가벼운 간선입니다.

**$k$-군집 멈춤.** $m-k$번 합병 = 크러스컬이 처음 채택한 $m-k$개 간선. 크러스컬은 무게 순으로 채택하므로, 남은 $k-1$개(채택하지 않은 트리 간선)는 트리에서 가장 무거운 $k-1$개입니다.`,
    note: R`단일 연결의 약점(사슬 효과)도 최소 신장 트리로 설명됩니다: 두 덩어리 사이에 가벼운 간선 몇 개로 이어진 “다리”가 있으면, 트리의 무거운 간선은 덩어리 **안쪽**에 있을 수 있어 엉뚱한 곳이 잘립니다.` },
  { ch: 'ch17', id: 'centroidId', title: '무게중심 항등식', keys: ['무게중심 항등식'], src: '강의 노트 · Lemma 4.1',
    tags: 'centroid identity k-means mean minimizes squared distance 무게중심 항등식 k-평균',
    stmt: R`$\sum_{x\in C}\lVert x-\mu\rVert^2=\sum_{x\in C}\lVert x-\bar x_C\rVert^2+\lvert C\rvert\lVert\bar x_C-\mu\rVert^2$. 따라서 $\bar x_C$가 유일한 최소점이다.`,
    body: R`
$x-\mu=(x-\bar x_C)+(\bar x_C-\mu)$이므로
$$\lVert x-\mu\rVert^2=\lVert x-\bar x_C\rVert^2+2\langle x-\bar x_C,\bar x_C-\mu\rangle+\lVert\bar x_C-\mu\rVert^2.$$
$x\in C$에 대해 합하면 교차항 $2\big\langle\sum_{x\in C}(x-\bar x_C),\bar x_C-\mu\big\rangle$에서 $\sum_{x\in C}x=\lvert C\rvert\bar x_C$라 $\sum(x-\bar x_C)=0$. 나머지 두 항이 식입니다. 둘째 항은 $\mu=\bar x_C$일 때만 0.`,
    note: R`분산의 “평행이동 공식” $\E\lVert X-\mu\rVert^2=\Var+\lVert\E X-\mu\rVert^2$과 같은 식입니다. 결정 트리의 회귀 잎이 평균을 예측하는 이유와도 같습니다.` },
  { ch: 'ch17', id: 'lloyd', title: '로이드 알고리즘: 단조 감소와 유한 수렴', keys: ['로이드 알고리즘의 단조 감소'], src: '강의 노트 · Theorem 4.3, 4.5',
    tags: 'Lloyd algorithm k-means monotone decrease finite convergence block coordinate descent 로이드 단조 감소 유한 수렴 블록 좌표',
    stmt: R`$\Phi(C,\mu)=\sum_i\sum_{x\in C_i}\lVert x-\mu_i\rVert^2$에 대해 배정 단계와 갱신 단계는 $\Phi$를 늘리지 않고, 동점 규칙을 고정하면 로이드 알고리즘은 유한 번 안에 멈춘다.`,
    body: R`
**배정.** $\mu$ 고정. $\Phi=\sum_x\lVert x-\mu_{i(x)}\rVert^2$이고 각 항은 $x$를 가장 가까운 중심에 배정할 때 최소. 따라서 새 배정 $C'$에서 $\Phi(C',\mu)\le\Phi(C,\mu)$.

**갱신.** $C'$ 고정. 군집별로 무게중심 항등식에 의해 $\mu_i=\bar x_{C'_i}$가 최소. $\Phi(C',\mu')\le\Phi(C',\mu)$.

**유한 수렴.** 한 번의 반복(배정+갱신) 뒤 분할이 바뀌지 않으면 중심도 같아 고정점. 분할이 바뀌면, 동점 규칙(“현재 군집이 최근접 중 하나면 유지” 같은)을 쓰면 배정 단계에서 바뀐 점마다 거리가 **엄격히** 줄어 $\Phi$가 엄격히 감소합니다. 각 분할 $C$에 대응하는 갱신 후 비용 $\Phi(C,\bar x_C)$는 분할의 함수이고 엄격히 감소하므로 같은 분할을 다시 방문하지 않습니다. 분할은 유한 개($\le k^m$)이므로 유한 번에 멈춥니다.`,
    note: R`수렴은 **어떤** 고정점으로의 수렴일 뿐입니다. 다음 증명처럼 고정점은 전역 최적보다 임의로 나쁠 수 있고, 강의 노트의 1차원 예처럼 국소 최소가 아닌 점에서 멈출 수도 있습니다.` },
  { ch: 'ch17', id: 'lloydBad', title: '로이드 고정점은 임의로 나쁠 수 있다', keys: ['로이드 고정점은 임의로 나쁠 수 있다'], src: '강의 노트 · Theorem 5.4',
    tags: 'Lloyd bad fixed point rectangle arbitrarily suboptimal k-means initialization 로이드 나쁜 고정점 직사각형',
    stmt: R`모든 $t>1$에 대해, 로이드 알고리즘이 비용이 전역 최적의 $t$배 이상인 고정점에서 멈추는 자료와 초기화가 있다.`,
    body: R`
$k=2$, $\cX=\{(-a,-b),(-a,b),(a,-b),(a,b)\}$ ($a,b>0$).

**좌우 분할은 고정점.** $C_1=\{(-a,\pm b)\}$, $C_2=\{(a,\pm b)\}$의 무게중심 $\mu_1=(-a,0)$, $\mu_2=(a,0)$. 두 중심의 수직이등분선은 $x=0$이라 왼쪽 두 점은 $\mu_1$, 오른쪽 두 점은 $\mu_2$에 배정 — 분할이 그대로, 고정점. 비용 $4b^2$ (각 점이 중심에서 세로로 $b$).

**위아래 분할.** $\{(\pm a,b)\},\{(\pm a,-b)\}$의 중심 $(0,\pm b)$, 비용 $4a^2$. 그러므로 $\mathrm{OPT}\le4a^2$.

**비.** $\frac{4b^2}{\mathrm{OPT}}\ge\frac{b^2}{a^2}$. $b/a\ge\sqrt t$로 잡고 중심을 $(\pm a,0)$에서 시작하면 즉시 멈춰 비가 $t$ 이상.`,
    note: R`초기화가 결과를 좌우합니다. 실무의 처방: 무작위로 여러 번 시작해 가장 좋은 결과를 쓰거나, 서로 멀리 떨어진 초기 중심을 고르는 k-means++ (기대 비용이 $O(\log k)$배 이내라는 보장이 있음).` },
  { ch: 'ch17', id: 'laplacian', title: '그래프 라플라시안의 이차형식과 연결 성분', keys: ['그래프 라플라시안의 이차형식'], src: '강의 노트 · Lemma 6.3, Theorem 6.16',
    tags: 'graph Laplacian quadratic form positive semidefinite null space connected components spectral clustering 라플라시안 연결 성분',
    stmt: R`$L=D-W$에 대해 $v^\top Lv=\frac12\sum_{r,s}W_{rs}(v_r-v_s)^2$. 따라서 $L\succeq0$이고 $\ker L$은 연결 성분들의 지시 벡터가 생성하며, 고윳값 0의 중복도는 성분 개수와 같다.`,
    body: R`
**이차형식.** $v^\top Lv=\sum_rd_rv_r^2-\sum_{r,s}W_{rs}v_rv_s$. $d_r=\sum_sW_{rs}$이고 $W$가 대칭이라 $\sum_rd_rv_r^2=\frac12\sum_{r,s}W_{rs}(v_r^2+v_s^2)$. 따라서
$$v^\top Lv=\frac12\sum_{r,s}W_{rs}(v_r^2+v_s^2-2v_rv_s)=\frac12\sum_{r,s}W_{rs}(v_r-v_s)^2\ge0.$$

**영공간.** $L\succeq0$이면 $Lv=0\iff v^\top Lv=0$ (한쪽은 자명, 반대는 $L=M^\top M$ 꼴로 쓰면 $\lVert Mv\rVert^2=0$). $v^\top Lv=0\iff W_{rs}>0$인 모든 쌍에서 $v_r=v_s\iff v$가 각 연결 성분 위에서 상수. 그런 벡터 공간은 성분 지시 벡터 $\one_{A_1},\dots,\one_{A_c}$가 생성하고(지지집합이 서로소라 일차독립), 차원이 $c$. 대칭행렬이라 고윳값 0의 (대수적) 중복도 = 영공간 차원 = $c$.`,
    note: R`$v^\top Lv$는 “간선으로 이어진 점들의 값 차이의 가중 제곱합” — 그래프 위의 매끄러움입니다. 스펙트럼 군집화는 매끄럽고(작은 $v^\top Lv$) 서로 직교하는 벡터들로 점을 표현합니다.` },
  { ch: 'ch17', id: 'ratioCut', title: 'RatioCut = tr(HᵀLH) (Lemma 22.3)', keys: ['RatioCut의 대각합 표현'], src: '강의 노트 · Theorem 6.5',
    tags: 'RatioCut trace indicator matrix orthonormal columns spectral relaxation Rayleigh-Ritz 대각합 완화',
    stmt: R`$H_{ij}=\one[i\in C_j]/\sqrt{\lvert C_j\rvert}$이면 $H^\top H=I$이고 $\mathrm{RatioCut}(C_1,\dots,C_k)=\operatorname{tr}(H^\top LH)$.`,
    body: R`
**정규직교.** $h_j$($H$의 $j$열)는 $C_j$ 위에서 $\frac1{\sqrt{\lvert C_j\rvert}}$, 밖에서 0. $\lVert h_j\rVert^2=\lvert C_j\rvert\cdot\frac1{\lvert C_j\rvert}=1$, $j\ne j'$이면 지지집합이 서로소라 내적 0.

**한 열.** 이차형식 공식으로 $h_j^\top Lh_j=\frac12\sum_{r,s}W_{rs}(h_{j,r}-h_{j,s})^2$. 두 점이 모두 $C_j$ 안이거나 모두 밖이면 0. 한 점만 안이면 $(h_{j,r}-h_{j,s})^2=\frac1{\lvert C_j\rvert}$. 순서쌍 $(r,s)$와 $(s,r)$가 모두 세어지므로 $\frac12\cdot2\sum_{r\in C_j,s\notin C_j}W_{rs}\frac1{\lvert C_j\rvert}=\frac{\mathrm{cut}(C_j,\bar C_j)}{\lvert C_j\rvert}$.

**대각합.** $\operatorname{tr}(H^\top LH)=\sum_jh_j^\top Lh_j=\sum_j\frac{\mathrm{cut}(C_j,\bar C_j)}{\lvert C_j\rvert}=\mathrm{RatioCut}$.

**완화.** 이산 구조를 버리고 $H^\top H=I$만 요구하면, 대칭행렬 $L$에 대해 $\min_{H^\top H=I}\operatorname{tr}(H^\top LH)$는 가장 작은 고윳값 $k$개의 합이고 해당 고유벡터들이 이룹니다(PCA 정리와 같은 논증의 최소판).`,
    note: R`완화 해는 근사 보장이 없습니다(노트의 Remark 6.29). 완화된 $U$의 행을 다시 이산 분할로 바꾸는 단계가 k-평균이고, 이상적인 끊긴 그래프에서는 정확하며, 약하게 이어진 경우는 고윳값 간격이 클수록 안정합니다.` },
  { ch: 'ch17', id: 'kleinberg', title: '클라인버그의 불가능성 정리 (정리 22.4)', keys: ['클라인버그의 불가능성 정리'],
    tags: 'Kleinberg impossibility clustering axioms scale invariance richness consistency theorem 22.4 클라인버그 불가능성 공리',
    stmt: R`척도 불변성, 풍부성, 일관성을 모두 만족하는 군집화 함수는 없다.`,
    body: R`
$F$가 셋을 만족한다고 하고 $\lvert\cX\rvert\ge3$인 $\cX$를 잡습니다.

**1. 풍부성.** $F(\cX,d_1)=\{\{x\}:x\in\cX\}$ (모든 점이 따로)인 $d_1$과, $F(\cX,d_2)\ne F(\cX,d_1)$인 $d_2$가 있습니다.

**2. 척도.** 서로 다른 점 사이 거리는 양수이므로 $\alpha=\max_{x\ne y}d_1(x,y)\big/\min_{x\ne y}d_2(x,y)$로 두면 $d_3:=\alpha d_2$는 모든 쌍에서 $d_3\ge d_1$. 척도 불변성: $F(\cX,d_3)=F(\cX,d_2)$.

**3. 일관성.** $F(\cX,d_1)$에서는 모든 쌍이 서로 다른 군집입니다. $d_3$는 군집 사이 거리를 모두 늘렸고(같은 군집 안의 쌍은 없음) 일관성 조건을 만족하므로 $F(\cX,d_3)=F(\cX,d_1)$.

2와 3에서 $F(\cX,d_2)=F(\cX,d_1)$ — 1의 선택에 모순.`,
    note: R`세 공리 중 둘은 함께 만족시킬 수 있습니다. 풍부성을 “$k$개로의 모든 분할”로 약화하면 k-평균·단일 연결($k$-군집 멈춤) 등이 세 성질을 모두 가집니다. “이상적 군집화는 없다 — 무엇을 포기할지 고르는 것”이 교훈입니다.` },
  // ───── 18
  { ch: 'ch18', id: 'pca', title: 'PCA의 해는 최대 고유벡터들이다 (Lemma 23.1, 정리 23.2)', keys: ['PCA의 해'], src: '강의 노트 · 23장 3절',
    tags: 'PCA principal component analysis eigenvectors trace maximization orthonormal projection Lemma 23.1 theorem 23.2 주성분 분석 고유벡터 대각합',
    stmt: R`$\min_{W,U}\sum_i\lVert x_i-UWx_i\rVert^2$의 해는 $A=\sum x_ix_i^\top$의 최대 고윳값 $n$개의 정규직교 고유벡터를 열로 둔 $U$와 $W=U^\top$이다.`,
    body: R`
**1. 정규직교 $U$, $W=U^\top$으로 충분.** 임의의 $(W,U)$에서 $\mathrm{range}(UW)$는 차원 $\le n$. 이를 담는 $n$차원 부분공간의 정규직교 기저 $V\in\mathbb R^{d\times n}$을 잡으면 $UWx\in\mathrm{span}(V)$이고, $\mathrm{span}(V)$에서 $x$에 가장 가까운 점은 정사영 $VV^\top x$라 $\lVert x-VV^\top x\rVert\le\lVert x-UWx\rVert$. 따라서 $(V^\top,V)$가 적어도 같은 비용.

**2. 대각합.** $U^\top U=I$면 $\lVert x-UU^\top x\rVert^2=\lVert x\rVert^2-2x^\top UU^\top x+x^\top UU^\top UU^\top x=\lVert x\rVert^2-\operatorname{tr}(U^\top xx^\top U)$. 합하면 $\sum\lVert x_i\rVert^2-\operatorname{tr}(U^\top AU)$ — 대각합 최대화 문제.

**3. 고윳값 논증.** $A=VDV^\top$ ($\lambda_1\ge\dots\ge\lambda_d\ge0$), $B=V^\top U$. $B^\top B=I_n$. $\operatorname{tr}(U^\top AU)=\operatorname{tr}(B^\top DB)=\sum_j\lambda_j\beta_j$, $\beta_j=\sum_iB_{ji}^2$.
- $\sum_j\beta_j=\lVert B\rVert_F^2=\operatorname{tr}(B^\top B)=n$.
- $B$의 열을 $\mathbb R^d$의 정규직교 기저로 넓힌 직교행렬 $\tilde B$의 각 행은 단위벡터이므로 $\beta_j\le1$.

$0\le\beta_j\le1$, $\sum\beta_j=n$일 때 $\sum_j\lambda_j\beta_j\le\sum_{j\le n}\lambda_j$ (큰 $\lambda$부터 1씩 채우는 것이 최대; 교환 논법). $U=[u_1,\dots,u_n]$이면 $B$가 표준기저 앞 $n$개라 $\beta=(1,\dots,1,0,\dots)$로 등호.`,
    note: R`최소 복원 오차는 $\sum_{j>n}\lambda_j$입니다. 강의 노트는 같은 결론을 레일리 몫($n=1$)과 에카르트–영 정리(SVD)로도 보였습니다. 자료를 중심화하지 않으면 첫 주성분이 평균 방향으로 끌려가므로 보통 평균을 먼저 뺍니다.` },
  { ch: 'ch18', id: 'gramPCA', title: 'd ≫ m일 때 그람 행렬로 PCA 계산', keys: ['d가 m보다 클 때의 PCA'],
    tags: 'PCA Gram matrix XX^T eigenvector kernel PCA large dimension 그람 행렬 커널 PCA',
    stmt: R`$B=XX^\top$에서 $Bv=\lambda v$, $\lambda>0$, $v\ne0$이면 $u=X^\top v/\lVert X^\top v\rVert$는 $A=X^\top X$의 고윳값 $\lambda$ 단위 고유벡터이다.`,
    body: R`
$A(X^\top v)=X^\top(XX^\top v)=X^\top(\lambda v)=\lambda X^\top v$.
$X^\top v\ne0$: $\lVert X^\top v\rVert^2=v^\top XX^\top v=v^\top Bv=\lambda\lVert v\rVert^2>0$.
따라서 $X^\top v$는 $A$의 고윳값 $\lambda$ 고유벡터이고, 정규화하면 $u$. ($v$가 단위벡터면 $\lVert X^\top v\rVert=\sqrt\lambda$.)

$A$와 $B$의 0이 아닌 고윳값은 중복도까지 같으므로(SVD $X=U\Sigma V^\top$에서 둘 다 $\Sigma^2$), $B$의 최대 고유벡터 $n$개로 $A$의 최대 고유벡터 $n$개를 모두 얻습니다.`,
    note: R`$B_{ij}=\langle x_i,x_j\rangle$ — 내적만 쓰므로 커널로 바꾸면 커널 PCA입니다. 새 점의 성분 좌표도 $\langle u,x\rangle=\frac1{\sqrt\lambda}\sum_iv_i\langle x_i,x\rangle$로 내적만 씁니다.` },
  { ch: 'ch18', id: 'chiSquare', title: '카이제곱 집중과 한 벡터의 노름 보존', keys: ['카이제곱 집중'], src: '강의 노트 · Lemma 4.1–4.2',
    tags: 'chi-square concentration Chernoff moment generating function random projection Gaussian 카이제곱 집중 체르노프 적률생성함수',
    stmt: R`$Z\sim\chi^2_n$, $0<\varepsilon\le1$이면 $\Prob(Z\ge(1+\varepsilon)n)\le e^{-n\varepsilon^2/8}$, $\Prob(Z\le(1-\varepsilon)n)\le e^{-n\varepsilon^2/4}$. $W$ 원소 i.i.d. $\N(0,\frac1n)$이면 고정 $x\ne0$에 대해 $\Prob(\lvert\lVert Wx\rVert^2/\lVert x\rVert^2-1\rvert>\varepsilon)\le2e^{-n\varepsilon^2/8}$.`,
    body: R`
**적률생성함수.** $X\sim\N(0,1)$, $t<\frac12$: $\E e^{tX^2}=\int\frac1{\sqrt{2\pi}}e^{-(1-2t)x^2/2}dx=(1-2t)^{-1/2}$. 독립 합이라 $\E e^{tZ}=(1-2t)^{-n/2}$.

**위 꼬리.** 마르코프: $\Prob(Z\ge(1+\varepsilon)n)\le e^{-t(1+\varepsilon)n}(1-2t)^{-n/2}$. $t=\frac\varepsilon{2(1+\varepsilon)}$이면 $1-2t=\frac1{1+\varepsilon}$이라 $=\exp\big(-\frac n2(\varepsilon-\ln(1+\varepsilon))\big)$. $g(\varepsilon)=\varepsilon-\ln(1+\varepsilon)-\frac{\varepsilon^2}4$는 $g(0)=0$, $g'(\varepsilon)=\frac{\varepsilon(1-\varepsilon)}{2(1+\varepsilon)}\ge0$ ($0\le\varepsilon\le1$)이라 $\ge0$. 따라서 $\le e^{-n\varepsilon^2/8}$.

**아래 꼬리.** $\Prob(Z\le(1-\varepsilon)n)\le e^{t(1-\varepsilon)n}\E e^{-tZ}=e^{t(1-\varepsilon)n}(1+2t)^{-n/2}$. $t=\frac\varepsilon{2(1-\varepsilon)}$ ($\varepsilon<1$; $\varepsilon=1$이면 확률 0)에서 $=\exp\big(\frac n2(\varepsilon+\ln(1-\varepsilon))\big)$, 그리고 $\ln(1-\varepsilon)\le-\varepsilon-\frac{\varepsilon^2}2$이라 $\le e^{-n\varepsilon^2/4}$.

**한 벡터.** $Wx$의 좌표 $\langle w_i,x\rangle$는 독립이고 $\N(0,\lVert x\rVert^2/n)$이므로 $\frac{n\lVert Wx\rVert^2}{\lVert x\rVert^2}\sim\chi^2_n$. 두 꼬리를 더하면 $\le e^{-n\varepsilon^2/8}+e^{-n\varepsilon^2/4}\le2e^{-n\varepsilon^2/8}$.`,
    note: R`교재 부록 보조정리 B.12는 위 꼬리를 $\varepsilon\in(0,3)$에서 $e^{-\varepsilon^2n/6}$으로 적었지만, 증명의 “$(1-2\lambda)^{-k/2}\le e^{\lambda k}$”는 $1-a\le e^{-a}$에서 오히려 $\ge$가 나오는 방향이라 성립하지 않습니다. 참 지수 $\frac n2(\varepsilon-\ln(1+\varepsilon))$은 $\varepsilon\gtrsim0.8$에서 $\frac{\varepsilon^2n}6$보다 작아(대편차 이론으로 이 지수는 정확함) 교재의 상한은 큰 $\varepsilon$에서 거짓입니다. 강의 노트의 $0<\varepsilon\le1$, 상수 8 판본이 올바릅니다.` },
  { ch: 'ch18', id: 'jl', title: '존슨–린덴스트라우스 보조정리', keys: ['존슨–린덴스트라우스 보조정리'], src: '강의 노트 · Theorem 4.3, Corollary 4.4–4.5',
    tags: 'Johnson-Lindenstrauss lemma random projection union bound distance preservation inner products 존슨 린덴스트라우스 랜덤 사영',
    stmt: R`유한 $Q\subset\mathbb R^d$, $0<\varepsilon\le1$, $\delta\in(0,1)$, $n\ge8\ln(2\lvert Q\rvert/\delta)/\varepsilon^2$이면 확률 $1-\delta$ 이상으로 모든 $x\in Q$에서 $(1-\varepsilon)\lVert x\rVert^2\le\lVert Wx\rVert^2\le(1+\varepsilon)\lVert x\rVert^2$.`,
    body: R`
**합집합 상한.** 각 $x\in Q$의 실패 확률 $\le2e^{-n\varepsilon^2/8}$ (카이제곱 집중). 어떤 $x$라도 실패할 확률 $\le2\lvert Q\rvert e^{-n\varepsilon^2/8}$. $n\ge\frac{8\ln(2\lvert Q\rvert/\delta)}{\varepsilon^2}\iff2\lvert Q\rvert e^{-n\varepsilon^2/8}\le\delta$.

**거리 보존.** 점 $x_1,\dots,x_m$에 대해 $Q=\{x_i-x_j\}$ (크기 $\le m^2$)에 적용하면, $W$가 선형이라 $\lVert Wx_i-Wx_j\rVert^2=\lVert W(x_i-x_j)\rVert^2$이 모든 쌍에서 $1\pm\varepsilon$배. 필요한 차원 $\frac{8\ln(2m^2/\delta)}{\varepsilon^2}$.

**내적 보존.** $\lVert u\rVert,\lVert v\rVert\le1$이고 $u\pm v$의 제곱 노름이 가산 오차 $\le\varepsilon'$로 보존되면 극화 항등식 $\langle a,b\rangle=\frac14(\lVert a+b\rVert^2-\lVert a-b\rVert^2)$로 $\lvert\langle Wu,Wv\rangle-\langle u,v\rangle\rvert\le\frac14(\varepsilon'+\varepsilon')=\frac{\varepsilon'}2$. ($\lVert u\pm v\rVert^2\le4$이라 곱셈 오차 $\varepsilon$는 가산 오차 $4\varepsilon$ 이하이므로 $\le2\varepsilon$.)`,
    note: R`차원 $n$이 원래 차원 $d$와 무관하고 점의 개수에 **로그**로만 기댑니다. 그래서 고차원 자료의 최근접 이웃 탐색, 커널 근사, 압축 센싱(RIP의 증명)에 두루 쓰입니다.` },
  { ch: 'ch18', id: 'l0Recovery', title: 'RIP 행렬에서 ℓ0 최소화의 정확한 복원 (정리 23.6)', keys: ['RIP 행렬의 ℓ0 복원'], src: '강의 노트 · Theorem 5.4',
    tags: 'compressed sensing RIP restricted isometry l0 minimization exact recovery sparse theorem 23.6 압축 센싱 희소 복원',
    stmt: R`$\varepsilon<1$, $W$가 $(\varepsilon,2s)$-RIP, $\lVert x\rVert_0\le s$, $y=Wx$이면 $\argmin_{v:Wv=y}\lVert v\rVert_0=\{x\}$.`,
    body: R`
$\tilde x$를 최소점이라 하면 $x$도 제약을 만족하므로 $\lVert\tilde x\rVert_0\le\lVert x\rVert_0\le s$. $\tilde x\ne x$라 가정하면 $h=x-\tilde x\ne0$의 지지집합은 두 지지집합의 합집합이라 $\lVert h\rVert_0\le2s$. $Wh=y-y=0$이므로
$$\left\lvert\frac{\lVert Wh\rVert^2}{\lVert h\rVert^2}-1\right\rvert=1>\varepsilon,$$
$(\varepsilon,2s)$-RIP에 모순. 그러므로 최소점은 $x$ 하나.`,
    note: R`$2s$가 필요한 이유: 두 $s$-희소 후보의 **차이**가 $2s$-희소이기 때문입니다. RIP가 없으면($n<d$) 영공간에 희소 벡터가 있을 수 있어 복원이 불가능합니다.` },
  { ch: 'ch18', id: 'l1Recovery', title: 'ℓ1 최소화의 안정적 복원 (정리 23.7–23.8)', keys: ['ℓ1 최소화의 안정적 복원'], src: '강의 노트 · Theorem 5.6',
    tags: 'basis pursuit l1 minimization stable recovery RIP cone constraint block decomposition approximate orthogonality theorem 23.8 기저 추구 안정적 복원',
    stmt: R`$\varepsilon<\frac1{1+\sqrt2}$, $W$가 $(\varepsilon,2s)$-RIP, $y=Wx$, $x^\star\in\argmin_{Wv=y}\lVert v\rVert_1$이면 $\lVert x^\star-x\rVert_2\le2\frac{1+\rho}{1-\rho}s^{-1/2}\lVert x-x_s\rVert_1$, $\rho=\frac{\sqrt2\varepsilon}{1-\varepsilon}$.`,
    body: R`
$h=x^\star-x$ ($Wh=0$), $e=\lVert x-x_s\rVert_1$, $T_0$=$x_s$의 지지집합. $T_0^c$를 $\lvert h\rvert$의 크기 순으로 $s$개씩 블록 $T_1,T_2,\dots$, $T_{01}=T_0\cup T_1$.

**0. 근사 직교성.** 지지집합이 서로소이고 합이 $2s$ 이하인 $a,b$ (단위벡터)에서 $\lVert a\pm b\rVert^2=2$이라 RIP로 $2(1-\varepsilon)\le\lVert W(a\pm b)\rVert^2\le2(1+\varepsilon)$, 극화로 $\lvert\langle Wa,Wb\rangle\rvert\le\varepsilon$. 척도를 되돌리면 $\lvert\langle Wa,Wb\rangle\rvert\le\varepsilon\lVert a\rVert\lVert b\rVert$.

**1. 꼬리.** $j\ge2$면 $h_{T_j}$의 모든 성분이 $h_{T_{j-1}}$의 평균 크기 이하라 $\lVert h_{T_j}\rVert_2\le\sqrt s\lVert h_{T_j}\rVert_\infty\le s^{-1/2}\lVert h_{T_{j-1}}\rVert_1$. 합: $\sum_{j\ge2}\lVert h_{T_j}\rVert_2\le s^{-1/2}\lVert h_{T_0^c}\rVert_1$.

**2. 원뿔 조건.** $\lVert x\rVert_1\ge\lVert x+h\rVert_1\ge\lVert x_{T_0}\rVert_1-\lVert h_{T_0}\rVert_1+\lVert h_{T_0^c}\rVert_1-\lVert x_{T_0^c}\rVert_1$이므로 $\lVert h_{T_0^c}\rVert_1\le\lVert h_{T_0}\rVert_1+2e$.

**3. RIP.** $Wh_{T_{01}}=-\sum_{j\ge2}Wh_{T_j}$이라
$$(1-\varepsilon)\lVert h_{T_{01}}\rVert^2\le\lVert Wh_{T_{01}}\rVert^2=-\sum_{j\ge2}\big(\langle Wh_{T_0},Wh_{T_j}\rangle+\langle Wh_{T_1},Wh_{T_j}\rangle\big)\le\varepsilon(\lVert h_{T_0}\rVert+\lVert h_{T_1}\rVert)\sum_{j\ge2}\lVert h_{T_j}\rVert.$$
$\lVert h_{T_0}\rVert+\lVert h_{T_1}\rVert\le\sqrt2\lVert h_{T_{01}}\rVert$이므로 $\lVert h_{T_{01}}\rVert\le\rho\sum_{j\ge2}\lVert h_{T_j}\rVert\le\rho s^{-1/2}\lVert h_{T_0^c}\rVert_1$.

**4. 정리.** 2와 $\lVert h_{T_0}\rVert_1\le\sqrt s\lVert h_{T_{01}}\rVert$로 $\lVert h_{T_{01}}\rVert\le\rho\lVert h_{T_{01}}\rVert+2\rho s^{-1/2}e$, $\rho<1$이라 $\lVert h_{T_{01}}\rVert\le\frac{2\rho}{1-\rho}s^{-1/2}e$.

**5. 전체.** $\lVert h\rVert\le\lVert h_{T_{01}}\rVert+\sum_{j\ge2}\lVert h_{T_j}\rVert\le\lVert h_{T_{01}}\rVert+s^{-1/2}(\sqrt s\lVert h_{T_{01}}\rVert+2e)=2\lVert h_{T_{01}}\rVert+2s^{-1/2}e\le\big(\frac{4\rho}{1-\rho}+2\big)s^{-1/2}e=2\frac{1+\rho}{1-\rho}s^{-1/2}e$.`,
    note: R`$x$가 $s$-희소이면 $e=0$이라 $x^\star=x$ — 볼록 문제(선형계획)가 조합 문제($\ell_0$)와 같은 답을 줍니다(정리 23.7). $\rho<1\iff\varepsilon<\frac1{1+\sqrt2}\approx0.414$가 조건의 출처입니다.` },
  );
})();
