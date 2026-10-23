/* 실전 모의고사 V — 교재 12장 12.1절(15단원 12.1–12.1d: 어텐션, 셀프 어텐션, 멀티헤드, 트랜스포머 층, 위치 부호화). 2026-10-23 추가. 연습문제와 겹치지 않는 문항입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x5', roman: 'V', kind: '교재 12장 범위 I', title: '어텐션과 트랜스포머 층', scopeText: '15단원 12.1–12.1d',
    desc: '어텐션 계수의 두 조건과 소프트 어텐션의 기울기, 쿼리·키·값과 √Dₖ 스케일링, 멀티헤드 어텐션과 트랜스포머 층의 모수·계산량·층 정규화, 순열 등변성과 사인파 위치 부호화를 다룹니다. 작은 행렬로 어텐션을 끝까지 손으로 계산하는 문제와 증명 세 개를 넣었습니다.',
    minutes: 100, plot: 'posenc',
    problems: [
      { ch: 'ch15', type: 'mc', lv: 1, pts: 4, q: R`세 입력 토큰이 $\mathbf x_1=(0,0)$, $\mathbf x_2=(4,0)$, $\mathbf x_3=(0,4)$이다. 어텐션 출력 $\mathbf y_n=\sum_ma_{nm}\mathbf x_m$의 계수가 두 조건 $a_{nm}\ge0$, $\sum_ma_{nm}=1$을 만족할 때 나올 수 **있는** 출력은?`,
        choices: [R`$(3,\ 3)$`, R`$(-1,\ 2)$`, R`$(1,\ 2)$`, R`$(4,\ 4)$`], ans: 2,
        sol: R`
**핵심.** 두 조건을 만족하는 계수로 만든 가중합은 볼록 결합(convex combination)이므로, 출력은 세 입력을 꼭짓점으로 하는 삼각형 안(경계 포함)에만 놓입니다. 이 예에서는 계수를 직접 풀 수 있습니다.

1. $\mathbf x_1=\mathbf 0$이므로 $\mathbf y=a_2(4,0)+a_3(0,4)=(4a_2,\ 4a_3)$이고, 합 조건에서 $a_1=1-a_2-a_3$입니다.
2. 음이 아닌 조건은 $a_2\ge0$, $a_3\ge0$, $a_1\ge0$, 곧 $y_1\ge0$, $y_2\ge0$, $y_1+y_2\le4$입니다. 세 꼭짓점의 삼각형입니다.
3. $(1,2)$는 $a_2=0.25$, $a_3=0.5$, $a_1=0.25$로 셋 다 음이 아니고 합이 1입니다.

**답.** ③ $(1,\ 2)$

**보기 검토.** ① $(3,3)$은 $a_2=a_3=0.75$라 $a_1=-0.5<0$입니다. 합은 1이지만 음이 아닌 조건을 어깁니다. ② $(-1,2)$는 $a_2=-0.25<0$, 곧 입력을 "빼는" 출력이라 불가능합니다. ③ 정답. ④ $(4,4)$는 $a_2=a_3=1$, $a_1=-1$입니다. 두 입력을 동시에 100% 참고할 수는 없습니다.

**자주 하는 실수.** 합이 1인지만 확인하는 것(①은 $-0.5+0.75+0.75=1$). 두 조건을 함께 쓰면 $0\le a_{nm}\le1$이 따라 나오고, 출력의 각 성분은 입력 성분의 최솟값과 최댓값 사이에 있습니다.

관련: [[ch15:12.1|어텐션 계수]]` },
      { ch: 'ch15', type: 'num', lv: 2, pts: 5, q: R`판독 보조 시스템이 과거 증례 세 개를 소프트 어텐션으로 참고한다. 쿼리와 세 키의 유사도 점수가 $\mathbf s=(1,0,0)$, 증례의 값(위험도)이 $\mathbf v=(0.9,\ 0.2,\ 0.4)$이고 출력은 $o=\sum_mp_mv_m$, $\mathbf p=\operatorname{softmax}(\mathbf s)$이다. 기울기 $\partial o/\partial s_1$은? (소수 넷째 자리)`, ans: '1.2*e/(e+2)^2', ansTex: R`\tfrac{1.2e}{(e+2)^2}\approx0.1465`,
        sol: R`
**핵심.** 소프트맥스의 도함수 $\partial p_m/\partial s_j=p_m(\delta_{mj}-p_j)$를 쓰면 소프트 어텐션 출력의 기울기는
$$\frac{\partial o}{\partial s_j}=\sum_mv_m\,p_m(\delta_{mj}-p_j)=p_jv_j-p_j\sum_mp_mv_m=p_j(v_j-o)$$
입니다. 점수를 올린 항목의 값이 지금 출력보다 크면 출력이 커집니다.

1. 가중치: 분모 $e^1+e^0+e^0=e+2=4.718$이므로 $\mathbf p=\big(\tfrac e{e+2},\tfrac1{e+2},\tfrac1{e+2}\big)=(0.5761,\ 0.2119,\ 0.2119)$.
2. 출력: $o=0.5761\cdot0.9+0.2119\cdot(0.2+0.4)=0.5185+0.1272=0.6457$. 정확히는 $o=\frac{0.9e+0.6}{e+2}$.
3. 기울기: $p_1(v_1-o)=\frac e{e+2}\Big(0.9-\frac{0.9e+0.6}{e+2}\Big)=\frac e{e+2}\cdot\frac{1.2}{e+2}=\frac{1.2e}{(e+2)^2}=\frac{3.262}{22.26}=0.1465$.

**답.** $\partial o/\partial s_1=\frac{1.2e}{(e+2)^2}\approx0.1465$

**검산.** 같은 식으로 $\partial o/\partial s_2=0.2119(0.2-0.6457)=-0.0945$, $\partial o/\partial s_3=0.2119(0.4-0.6457)=-0.0521$이고 세 기울기의 합은 $0$입니다. 모든 점수에 같은 상수를 더해도 소프트맥스가 그대로이므로 합이 0이어야 맞습니다.

**해석.** 점수가 가장 큰 하나만 고르는 하드 어텐션이라면 출력은 1등이 바뀌기 전까지 $0.9$로 일정해 기울기가 0입니다. 소프트 어텐션은 0이 아닌 기울기를 주므로 점수를 만드는 모수를 경사하강법으로 학습할 수 있습니다.

관련: [[ch15:12.1|하드 어텐션과 소프트 어텐션]]` },
      { ch: 'ch15', type: 'mc', lv: 2, pts: 4, q: R`쿼리·키·값 모두에 하나의 투영 행렬 $\mathbf U$를 공유하면 점수 행렬 $\mathbf S=\mathbf X\mathbf U\mathbf U^T\mathbf X^T$는 대칭이다. 행마다 소프트맥스를 취한 $\mathbf A=\operatorname{Softmax}[\mathbf S]$에 대해 옳은 것은? ($Z_n=\sum_{m'}\exp(s_{nm'})$)`,
        choices: [R`$\mathbf S$가 대칭이므로 $\mathbf A$도 항상 대칭이다`, R`$a_{nm}Z_n=a_{mn}Z_m$이므로 $\mathbf A$는 모든 행의 $Z_n$이 같을 때에만 대칭이고, 일반적으로는 대칭이 아니다`, R`$\mathbf A$는 열의 합도 모두 1이다`, R`$\mathbf A$의 대각 원소 $a_{nn}$은 모두 같다`], ans: 1,
        sol: R`
**핵심.** 소프트맥스는 **행마다** 정규화하므로 $a_{nm}=e^{s_{nm}}/Z_n$입니다. 분자는 $s_{nm}=s_{mn}$이라 같아도 분모가 행마다 다릅니다.

1. $a_{nm}Z_n=e^{s_{nm}}=e^{s_{mn}}=a_{mn}Z_m$.
2. 따라서 $a_{nm}/a_{mn}=Z_m/Z_n$이고, $\mathbf A$가 대칭인 것은 모든 $Z_n$이 같은 것과 동치입니다(계수가 양수라 역도 성립).
3. 예: $\mathbf X\mathbf U=\mathbf X$, $\mathbf x_1=(1,0)$, $\mathbf x_2=(1,1)$이면 $\mathbf S=\begin{pmatrix}1&1\\1&2\end{pmatrix}$, $a_{12}=0.5$, $a_{21}=\frac1{1+e}=0.269$로 다릅니다(단원 예제 2).

**답.** ②

**보기 검토.** ① 행 정규화의 분모를 잊은 오류입니다. ② 정답. ③ 행의 합만 1이고, 열의 합(그 토큰이 모두에게서 받는 주목의 총량)은 1이 아닐 수 있습니다. 예에서 첫 열의 합은 $0.5+0.269=0.769$입니다. ④ $a_{nn}=e^{\lVert\mathbf U^T\mathbf x_n\rVert^2}/Z_n$은 토큰마다 다릅니다(예에서 $0.5$와 $0.731$).

**자주 하는 실수.** "계수가 비대칭이니 공유 투영도 괜찮다"고 결론 내리는 것. 비대칭은 정규화 상수에서만 오고, 관계의 방향("끌 → 도구"가 "도구 → 끌"보다 강함)을 담아야 할 **점수** 자체는 대칭으로 묶여 있습니다. 그래서 $\mathbf W^{(q)}$와 $\mathbf W^{(k)}$를 따로 둡니다.

관련: [[ch15:12.1b|쿼리·키·값 어텐션]]` },
      { ch: 'ch15', type: 'num', lv: 1, pts: 5, q: R`쿼리 $\mathbf q=(1,2,0,1)$과 키 $\mathbf k_1=(2,1,0,0)$, $\mathbf k_2=(0,0,3,1)$, $\mathbf k_3=(1,0,1,1)$ ($D_k=4$)로 스케일드 점곱 어텐션의 계수를 구할 때, $\mathbf k_1$에 대한 계수 $a_1$은? (소수 넷째 자리)`, ans: 'exp(2)/(exp(2)+exp(0.5)+exp(1))', ansTex: R`\tfrac{e^2}{e^2+e^{0.5}+e}\approx0.6285`,
        sol: R`
**핵심.** 점수는 $\mathbf q^T\mathbf k_m/\sqrt{D_k}$이고, 계수는 그 점수들의 소프트맥스입니다.

1. 내적: $\mathbf q^T\mathbf k_1=2+2+0+0=4$, $\mathbf q^T\mathbf k_2=0+0+0+1=1$, $\mathbf q^T\mathbf k_3=1+0+0+1=2$.
2. 스케일: $\sqrt{D_k}=2$로 나눠 점수 $(2,\ 0.5,\ 1)$.
3. 지수: $e^2=7.389$, $e^{0.5}=1.649$, $e^1=2.718$, 합 $11.76$.
4. $a_1=7.389/11.76=0.6285$. 나머지는 $a_2=0.1402$, $a_3=0.2312$입니다.

**답.** $a_1=\frac{e^2}{e^2+e^{0.5}+e}\approx0.6285$

**자주 하는 실수.** $\sqrt{D_k}$ 대신 $D_k$로 나눠 점수 $(1,\ 0.25,\ 0.5)$를 쓰면 $a_1=0.4810$, 나누지 않고 $(4,1,2)$를 쓰면 $a_1=0.8438$이 됩니다.

**검산.** 세 계수의 합이 $0.6285+0.1402+0.2312=1.000$이고, 계수의 순서($a_1>a_3>a_2$)가 내적의 순서와 같습니다.

관련: [[ch15:12.1b|스케일드 점곱 어텐션]]` },
      { ch: 'ch15', type: 'num', lv: 2, pts: 5, q: R`쿼리 성분은 서로 독립이고 평균 0, 분산 4이며, 키 성분은 서로 독립이고 평균 0, 분산 1이고, 쿼리와 키도 서로 독립이다. $D_k=16$일 때 스케일드 점수 $\mathbf q^T\mathbf k/\sqrt{D_k}$의 표준편차는? (정수)`, ans: '2', ansTex: R`\sqrt{16\cdot4\cdot1/16}=2`,
        sol: R`
**핵심.** 평균이 0이고 서로 상관없는 항들의 합의 분산은 각 항 분산의 합이고, 독립인 두 변수의 곱은 $\E[q_i^2k_i^2]=\E[q_i^2]\E[k_i^2]$입니다.

1. 한 항: $\E[q_ik_i]=\E[q_i]\E[k_i]=0$이고 $\operatorname{var}[q_ik_i]=\E[q_i^2k_i^2]=\E[q_i^2]\E[k_i^2]=4\cdot1=4$.
2. 합: 서로 다른 $i,j$에 대해 $\operatorname{cov}[q_ik_i,q_jk_j]=\E[q_i]\E[k_i]\E[q_j]\E[k_j]=0$이므로 $\operatorname{var}[\mathbf q^T\mathbf k]=16\cdot4=64$.
3. 스케일: $\operatorname{var}[\mathbf q^T\mathbf k/\sqrt{16}]=64/16=4$, 표준편차 $2$.

**답.** $2$

**해석.** 일반적으로 $\operatorname{var}[\mathbf q^T\mathbf k/\sqrt{D_k}]=\sigma_q^2\sigma_k^2$입니다. $\sqrt{D_k}$로 나누는 것은 분산이 $D_k$에 비례해 커지는 것만 없애고 성분의 크기는 보정하지 않으므로, "나누면 분산이 1"이라는 결론은 성분의 분산이 1이라는 가정 아래서만 맞습니다.

**자주 하는 실수.** 분산을 곱하지 않고 더해 $4+1=5$로 쓰는 것, 분산 $4$를 그대로 답해 표준편차와 혼동하는 것.

**검산.** $\sigma_q^2=\sigma_k^2=1$이면 $\operatorname{var}[\mathbf q^T\mathbf k]=D_k$, 나눈 점수의 분산 1로 단원의 결과와 같습니다.

관련: [[ch15:12.1b|스케일드 점곱 어텐션]]` },
      { ch: 'ch15', type: 'num', lv: 3, pts: 5, q: R`키가 두 개뿐이면 첫 키의 어텐션 계수는 $p_1=\sigma(\Delta)$ ($\Delta=z_1-z_2$: 두 점수의 차, $\sigma$: 로지스틱 시그모이드)이고 소프트맥스 야코비안의 대각 원소는 $p_1(1-p_1)$이다. $p_1(1-p_1)\le0.01$이 되는 가장 작은 $\Delta>0$은? (소수 셋째 자리)`, ans: 'ln((1+sqrt(0.96))/(1-sqrt(0.96)))', ansTex: R`\ln\tfrac{1+\sqrt{0.96}}{1-\sqrt{0.96}}\approx4.585`,
        sol: R`
**핵심.** 두 항목의 소프트맥스는 $p_1=\frac{e^{z_1}}{e^{z_1}+e^{z_2}}=\frac1{1+e^{-\Delta}}=\sigma(\Delta)$이고, $p_1(1-p_1)$은 $\Delta=0$에서 최대 $0.25$이며 $\lvert\Delta\rvert$가 커질수록 줄어듭니다. 경계 $p(1-p)=0.01$을 풀어 $\Delta$로 바꿉니다.

1. $p^2-p+0.01=0$의 두 근 가운데 $p>\tfrac12$인 것: $p=\frac{1+\sqrt{1-0.04}}2=\frac{1+\sqrt{0.96}}2=0.98990$.
2. 로짓으로 되돌리기: $\Delta=\ln\frac p{1-p}=\ln\frac{1+\sqrt{0.96}}{1-\sqrt{0.96}}=\ln\frac{1.97980}{0.02020}=\ln98.00=4.585$.
3. $\Delta>4.585$이면 $p_1>0.9899$이고 기울기 원소가 최댓값 $0.25$의 25분의 1인 $0.01$보다 작습니다.

**답.** $\Delta\approx4.585$

**해석.** $D_k=64$이고 $\mathbf q,\mathbf k_1,\mathbf k_2$의 성분이 서로 독립이고 평균 0, 분산 1이면 $\Delta=\mathbf q^T(\mathbf k_1-\mathbf k_2)$의 분산은 $D_k\cdot1\cdot2=128$($\mathbf k_1-\mathbf k_2$의 성분 분산이 2), 표준편차 $11.31$입니다. 경계 $4.585$는 표준편차의 $0.41$배에 불과해 포화가 흔합니다. $\sqrt{D_k}=8$로 나누면 표준편차가 $\sqrt2=1.414$로 줄어 경계가 표준편차의 $3.24$배가 되므로, 포화는 드문 일이 됩니다.

**검산.** $\sigma(4.585)=1/(1+e^{-4.585})=1/1.0102=0.9899$이고 $0.9899\cdot0.0101=0.0100$입니다.

관련: [[ch15:12.1b|스케일링과 소프트맥스 포화]]` },
      { ch: 'ch15', type: 'num', lv: 1, pts: 5, q: R`$D=512$, 머리 $H=8$이고 머리마다 쿼리·키 차원 $D_k=32$, 값 차원 $D_v=64$인 멀티헤드 어텐션의 모수(편향 제외)는? (정수)`, ans: '8*(2*512*32+512*64)+8*64*512', ansTex: R`786{,}432`,
        sol: R`
**핵심.** 머리마다 $\mathbf W_h^{(q)},\mathbf W_h^{(k)}\in\mathbb R^{D\times D_k}$, $\mathbf W_h^{(v)}\in\mathbb R^{D\times D_v}$이고, 출력 투영은 $\mathbf W^{(o)}\in\mathbb R^{HD_v\times D}$ 하나입니다. $4D^2$는 $D_k=D_v=D/H$일 때만의 결과입니다.

1. 머리 하나의 Q·K: $2\cdot512\cdot32=32{,}768$.
2. 머리 하나의 V: $512\cdot64=32{,}768$. 머리 하나에 $65{,}536$, 여덟 머리에 $524{,}288$.
3. 출력: 이어 붙인 행렬이 $N\times HD_v=N\times512$이므로 $\mathbf W^{(o)}$는 $512\times512=262{,}144$.
4. 합: $524{,}288+262{,}144=786{,}432$.

**답.** $786{,}432$ $(=3D^2)$

**자주 하는 실수.** 습관적으로 $4D^2=1{,}048{,}576$을 쓰는 것. 일반식은 $H\,D(2D_k+D_v)+HD_v\,D$이고, $\mathbf W^{(o)}$의 행 수는 $D$가 아니라 $HD_v$입니다(여기서는 우연히 둘 다 512).

**검산.** $D_k$를 64로 올리면 $8\cdot512\cdot192+512^2=1{,}048{,}576=4\cdot512^2$로 단원의 결과가 됩니다. 쿼리·키 차원을 절반으로 줄여 Q·K 모수 $262{,}144$개를 아낀 셈입니다.

관련: [[ch15:12.1c|멀티헤드 어텐션]]` },
      { ch: 'ch15', type: 'mc', lv: 2, pts: 4, q: R`$D=512$로 두고 $D_k=D_v=D/H$를 유지한 채 머리 수를 $H=1$에서 $H=8$로 늘릴 때 옳은 것은?`,
        choices: [R`멀티헤드 어텐션의 모수가 8배가 된다`, R`머리마다의 어텐션 행렬 $\mathbf A_h$가 $N\times(N/8)$로 작아진다`, R`각 머리의 출력이 64열이므로 층의 출력 $\mathbf Y$도 $N\times64$가 되어 잔차 연결을 붙일 수 없다`, R`모수 수는 그대로이고, 머리 하나가 유사도를 재는 행렬 $\mathbf W_h^{(q)}\mathbf W_h^{(k)T}$의 계수 상한이 512에서 64로 줄어드는 대신 서로 다른 유사도를 8가지 잰다`], ans: 3,
        sol: R`
**핵심.** 모수는 $H\cdot3D\cdot\frac DH+D^2=4D^2$로 $H$가 약분됩니다. 바뀌는 것은 머리마다 쿼리·키가 사는 부분공간의 차원 $D_k=D/H$입니다.

1. 모수: $H=1$이든 $8$이든 $4\cdot512^2=1{,}048{,}576$.
2. 머리 $h$의 점수는 $\mathbf x_n^T\mathbf W_h^{(q)}\mathbf W_h^{(k)T}\mathbf x_m$이고 $\mathbf W_h^{(q)}$가 $512\times D_k$라 이 $512\times512$ 행렬의 계수는 $D_k$ 이하입니다: $H=1$이면 512, $H=8$이면 64.
3. 크기: 각 $\mathbf A_h$는 여전히 $N\times N$, 이어 붙인 행렬은 $N\times HD_v=N\times512$, $\mathbf W^{(o)}$를 거친 $\mathbf Y$는 $N\times D$입니다.

**답.** ④

**보기 검토.** ① $H$가 약분되므로 모수는 같습니다(단원 예제 4). ② 어텐션 행렬은 쿼리 $N$개와 키 $N$개의 쌍이라 늘 $N\times N$이고, 줄어드는 것은 투영의 열 수 $D_k$입니다. ③ 머리 8개를 이어 붙이면 $8\cdot64=512$열이고 $\mathbf W^{(o)}$가 $D$차원으로 돌려보내므로 $\mathbf Y(\mathbf X)+\mathbf X$를 그대로 쓸 수 있습니다. ④ 정답. 점수 계산량도 $H\cdot N^2D_k=N^2D$로 같습니다.

관련: [[ch15:12.1c|멀티헤드 어텐션]]` },
      { ch: 'ch15', type: 'num', lv: 2, pts: 5, q: R`$D=256$인 트랜스포머 층 하나의 학습 모수를 **모두** 세면? 멀티헤드 어텐션은 $D_k=D_v=D/H$이고 Q·K·V·출력 투영에 모두 편향이 있으며, 위치별 MLP는 은닉 폭 $4D$인 2층(층마다 편향), 층 정규화 두 개는 각각 $\gamma_i,\beta_i$ ($i=1,\dots,D$)를 가진다. (정수)`, ans: '12*256^2+13*256', ansTex: R`12D^2+13D=789{,}760`,
        sol: R`
**핵심.** 가중치 $12D^2$(어텐션 $4D^2$ + MLP $8D^2$)에 편향과 층 정규화 모수를 더합니다. 층 정규화의 평균 $\mu_n$과 분산 $\sigma_n^2$는 입력에서 계산하는 값이라 모수가 아닙니다.

1. 어텐션: 가중치 $4D^2=262{,}144$. 편향은 Q·K·V가 머리마다 $D/H$개씩 $H$머리라 각각 $D$개, 셋이면 $3D$, 출력 투영 $D$를 더해 $4D=1{,}024$.
2. MLP: $\mathbf W_1\in\mathbb R^{D\times4D}$와 $\mathbf W_2\in\mathbb R^{4D\times D}$로 $8D^2=524{,}288$, 편향 $4D+D=5D=1{,}280$.
3. 층 정규화 2개: $2\cdot2D=4D=1{,}024$.
4. 합: $12D^2+13D=786{,}432+3{,}328=789{,}760$.

**답.** $789{,}760$

**해석.** 편향과 층 정규화 모수는 $3{,}328$개로 전체의 $0.42\%$라, 대략 셀 때는 $12D^2$로 충분합니다. 토큰 수 $N$은 어디에도 나오지 않습니다. 모든 토큰이 같은 투영과 같은 MLP를 공유하기 때문입니다.

**자주 하는 실수.** 층 정규화의 $\mu_n,\sigma_n^2$까지 모수로 세는 것, 출력 편향을 머리마다 따로 세는 것($\mathbf W^{(o)}$는 하나), MLP를 $D\to D$ 한 층으로 보아 $D^2$로 세는 것.

관련: [[ch15:12.1c|트랜스포머 층]] [[ch09:7.4c|층 정규화]]` },
      { ch: 'ch15', type: 'mc', lv: 1, pts: 4, q: R`트랜스포머 층의 층 정규화(layer normalization)가 평균과 분산을 계산하는 범위는?`,
        choices: [R`토큰 하나의 $D$개 특징 — 토큰(행)마다 따로`, R`미니배치에 든 여러 서열의 같은 특징 — 특징마다 따로`, R`한 서열의 $N$개 토큰의 같은 특징 — 특징(열)마다 따로`, R`행렬 $\mathbf X$의 $N\times D$개 원소 전체 — 평균과 분산 하나`], ans: 0,
        sol: R`
**핵심.** 층 정규화는 한 예제의 유닛들, 트랜스포머에서는 토큰 벡터 하나의 $D$개 성분으로 $\mu_n=\frac1D\sum_iz_{ni}$, $\sigma_n^2=\frac1D\sum_i(z_{ni}-\mu_n)^2$을 내고 $\hat z_{ni}=(z_{ni}-\mu_n)/\sqrt{\sigma_n^2+\delta}$를 $\gamma_i\hat z_{ni}+\beta_i$로 바꿉니다.

1. 다른 토큰이나 다른 표본에 의존하지 않으므로 배치 크기·서열 길이와 무관하고, 학습과 추론에서 같은 함수입니다.
2. 모든 행에 같은 함수를 적용하므로 위치별 MLP처럼 순열 등변성을 지킵니다.

**답.** ①

**보기 검토.** ① 정답. ② 배치 정규화입니다. 배치가 작거나 여러 GPU에 나눌 때 불안정해 트랜스포머에서는 층 정규화를 씁니다. ③ 한 서열의 토큰들에 걸쳐 정규화하면 각 토큰의 출력이 같은 서열의 다른 토큰들과 서열 길이에 따라 달라집니다. 토큰끼리 정보를 섞는 일은 어텐션이 맡습니다. ④ 행렬 전체의 통계 하나로는 토큰마다의 크기 차이를 정규화하지 못하고, 이것도 서열 전체에 의존합니다.

관련: [[ch09:7.4c|층 정규화]]` },
      { ch: 'ch15', type: 'num', lv: 2, pts: 5, q: R`사후 정규화 트랜스포머 층에서 한 토큰의 입력이 $\mathbf x_n=(1,2,0,3)$이고 멀티헤드 어텐션의 출력이 $\mathbf y_n=(1,0,2,5)$이다. $\mathbf z_n=\operatorname{LayerNorm}[\mathbf y_n+\mathbf x_n]$의 넷째 성분은? 층 정규화는 $\delta=0$이고 넷째 성분의 $\gamma_4=2$, $\beta_4=-1$이다. (소수 넷째 자리)`, ans: '2*sqrt(3)-1', ansTex: R`2\sqrt3-1\approx2.4641`,
        sol: R`
**핵심.** 사후 정규화(Post-Norm)는 잔차 합 $\mathbf y_n+\mathbf x_n$을 먼저 만들고, 그 토큰의 $D=4$개 성분으로 평균과 분산을 내어 정규화한 뒤 성분별 $\gamma_i,\beta_i$를 적용합니다.

1. 잔차 합: $\mathbf y_n+\mathbf x_n=(2,2,2,8)$.
2. 평균: $\mu=(2+2+2+8)/4=3.5$.
3. 분산($1/D$로 나눔): $\sigma^2=\frac{3\cdot(-1.5)^2+4.5^2}4=\frac{6.75+20.25}4=6.75$, $\sigma=2.598$.
4. 정규화: $\hat z_4=(8-3.5)/2.598=1.7321$. 정확히는 $4.5/\sqrt{6.75}=\sqrt3$.
5. 척도와 이동: $z_4=\gamma_4\hat z_4+\beta_4=2\sqrt3-1=2.4641$.

**답.** $2\sqrt3-1\approx2.4641$

**검산.** 정규화된 네 성분 $(-0.5774,-0.5774,-0.5774,1.7321)$은 합이 0이고 제곱의 평균이 $(3\cdot\tfrac13+3)/4=1$입니다.

**자주 하는 실수.** 분산을 $1/(D-1)$로 나누면 $\sigma^2=9$, $\hat z_4=1.5$, 답이 $2$가 됩니다. 층 정규화의 정의는 $1/D$입니다. 또 사전 정규화와 섞지 않아야 합니다. 사전 정규화라면 정규화가 어텐션의 **입력** $\mathbf x_n$에 걸리고 잔차 합 $\mathbf Y(\mathbf X')+\mathbf X$는 정규화하지 않습니다.

관련: [[ch15:12.1c|트랜스포머 층]] [[ch09:7.4c|층 정규화]]` },
      { ch: 'ch15', type: 'num', lv: 3, pts: 5, q: R`$D=768$, $D_k=D_v=D/H$이고 위치별 MLP의 은닉 폭이 $4D$인 트랜스포머 층에서 곱셈 수만 센다(소프트맥스·층 정규화·편향은 무시). 모든 머리의 점수 $\mathbf Q_h\mathbf K_h^T$와 가중합 $\mathbf A_h\mathbf V_h$에 드는 곱셈이, Q·K·V·출력 투영과 MLP에 드는 곱셈과 같아지는 서열 길이 $N$은? (정수)`, ans: '6*768', ansTex: R`N=6D=4608`,
        sol: R`
**핵심.** $N\times a$ 행렬과 $a\times b$ 행렬의 곱은 곱셈 $Nab$번입니다. 토큰 쌍마다 하는 계산은 $N^2$에, 토큰마다 하는 계산은 $N$에 비례합니다.

1. 점수: 머리마다 $\mathbf Q_h\mathbf K_h^T$가 $N\cdot D_k\cdot N$, 머리 $H$개면 $N^2HD_k=N^2D$.
2. 가중합: 머리마다 $\mathbf A_h\mathbf V_h$가 $N\cdot N\cdot D_v$, 합 $N^2D$. 어텐션 쪽 합계 $2N^2D$.
3. 투영: Q·K·V는 머리를 모두 합쳐 각각 $N\cdot D\cdot D$, 출력 $\mathbf W^{(o)}$도 $N\cdot D\cdot D$라 $4ND^2$.
4. MLP: $N\cdot D\cdot4D+N\cdot4D\cdot D=8ND^2$. 토큰마다의 계산 합계 $12ND^2$.
5. 같아지는 점: $2N^2D=12ND^2\iff N=6D=4608$.

**답.** $N=4608$

**해석.** $N<4608$이면 투영과 MLP가, $N>4608$이면 어텐션의 $N^2$ 항이 계산을 지배합니다. 단원의 비교($N^2D$ 대 $ND^2$, 경계 $N=D$)는 상수를 버린 것이고, 상수까지 세면 경계가 $6D$로 밀립니다. 그래도 $N$을 두 배로 늘리면 어텐션 몫은 네 배가 되므로, 수천 토큰의 진료 기록 전체처럼 긴 문맥에서는 결국 어텐션이 병목입니다.

**자주 하는 실수.** 머리 수 $H$를 한 번 더 곱해 점수를 $HN^2D$로 세는 것($D_k=D/H$라 $H$가 약분됩니다), 가중합 $\mathbf A_h\mathbf V_h$를 빠뜨려 $N=12D$를 얻는 것.

관련: [[ch15:12.1c|트랜스포머 층의 계산량]]` },
      { ch: 'ch15', type: 'num', lv: 2, pts: 5, q: R`사인파 위치 부호화의 첫 쌍 $(r_{n0},r_{n1})=(\sin n,\cos n)$ (각진동수 $L^0=1$)이 어떤 토큰에서 $(0.6570,\ 0.7539)$였다. 위치 $n$을 구하지 않고, 두 칸 뒤 토큰의 $r_{n+2,0}$을 구하면? (소수 넷째 자리)`, ans: '0.6570*cos(2)+0.7539*sin(2)', ansTex: R`0.6570\cos2+0.7539\sin2\approx0.4121`,
        sol: R`
**핵심.** 상대 위치의 선형변환: 각진동수 $\omega$인 쌍은
$$\begin{pmatrix}\sin\omega(n+k)\\\cos\omega(n+k)\end{pmatrix}=\begin{pmatrix}\cos\omega k&\sin\omega k\\-\sin\omega k&\cos\omega k\end{pmatrix}\begin{pmatrix}\sin\omega n\\\cos\omega n\end{pmatrix}$$
이고, 행렬은 오프셋 $k$에만 의존합니다.

1. $\omega=1$, $k=2$: $\cos2=-0.4161$, $\sin2=0.9093$.
2. 첫 행: $r_{n+2,0}=\cos2\cdot r_{n0}+\sin2\cdot r_{n1}=-0.4161\cdot0.6570+0.9093\cdot0.7539$.
3. $=-0.2734+0.6855=0.4121$.

**답.** $\approx0.4121$

**검산.** 주어진 값은 $n=7$의 $(\sin7,\cos7)$이고 $\sin9=0.4121$로 같습니다. 둘째 성분 $-\sin2\cdot0.6570+\cos2\cdot0.7539=-0.5974-0.3137=-0.9111=\cos9$도 맞고, 회전이라 $0.4121^2+0.9111^2=1.000$으로 길이가 보존됩니다.

**자주 하는 실수.** 회전의 부호를 바꿔 $\cos2\cdot0.6570-\sin2\cdot0.7539=-0.9589$를 얻는 것. 이것은 두 칸 **앞**($n-2$)의 값 $\sin5$입니다. 덧셈정리 $\sin(a+b)=\sin a\cos b+\cos a\sin b$로 부호를 확인하세요.

**해석.** 이 계산에는 $n$이 필요 없었습니다. "두 칸 뒤"라는 관계가 절대 위치와 무관한 고정 행렬 $\mathbf M_2$이므로, 선형 투영을 쓰는 어텐션이 상대 위치 관계를 쉽게 배울 수 있습니다.

관련: [[ch15:12.1d|상대 위치의 선형변환]]` },
      { ch: 'ch15', type: 'mc', lv: 2, pts: 4, q: R`최대 512토큰의 판독문으로 학습한 트랜스포머를 1,500토큰이 넘는 입원 경과 기록에도 쓰려 한다. 다음 위치 부호화 가운데 이 목적에 가장 알맞은 것은?`,
        choices: [R`위치 $1,\dots,512$마다 벡터를 하나씩 학습한 학습된 위치 부호화`, R`위치 번호 $n$을 모든 성분에 그대로 더하기`, R`사인파 위치 부호화 $r_{ni}=\sin(n/L^{i/D})$ ($i$ 짝수), $\cos(n/L^{(i-1)/D})$ ($i$ 홀수)`, R`위치를 그 기록의 길이 $N$으로 나눈 $n/N\in(0,1]$을 더하기`], ans: 2,
        sol: R`
**핵심.** 좋은 위치 부호화는 위치마다 **유일**하고, 값이 **유계**이며, 학습 때보다 긴 서열로 **일반화**되고, **상대 위치**를 보존해야 합니다. 학습보다 긴 기록을 다루려면 셋째 조건이 결정적입니다.

1. 사인파 부호화는 어떤 정수 $n$에도 식으로 정의되고 값이 $[-1,1]$에 있으며, $\mathbf r_{n+k}=\mathbf M_k\mathbf r_n$으로 상대 위치가 고정된 선형변환입니다. 네 조건을 모두 만족하는 것은 이것뿐입니다.

**답.** ③

**보기 검토.** ① 위치 513 이후의 벡터는 학습된 적이 없어 더 긴 서열로 일반화하지 못합니다. 입력 길이가 늘 같은 ViT에 알맞은 방식입니다. ② 값이 끝없이 커져 위치 1,500에서는 임베딩을 압도하고, 학습 때 본 적 없는 범위의 값이 들어옵니다. ③ 정답. ④ 유계이지만 같은 10번째 위치가 512토큰 기록에서는 $0.0195$, 1,500토큰 기록에서는 $0.0067$이 되어 위치마다 유일하지 않고, "몇 칸 떨어졌나"도 기록의 길이에 따라 달라집니다.

**자주 하는 실수.** ④를 "유계이니 괜찮다"고 고르는 것. 유계는 네 조건 가운데 하나일 뿐입니다.

관련: [[ch15:12.1d|위치 부호화]]` },
      { ch: 'ch15', type: 'open', lv: 3, pts: 10, q: R`세 토큰 $\mathbf x_1=(1,0)$, $\mathbf x_2=(0,1)$, $\mathbf x_3=(1,1)$을 행으로 쌓은 $\mathbf X$ ($N=3$, $D=2$)와
$$\mathbf W^{(q)}=\begin{pmatrix}1&1\\0&1\end{pmatrix},\quad \mathbf W^{(k)}=\begin{pmatrix}1&0\\1&1\end{pmatrix},\quad \mathbf W^{(v)}=\begin{pmatrix}1&0\\0&2\end{pmatrix}$$
으로 스케일드 점곱 셀프 어텐션($D_k=2$)을 계산하세요. (1) $\mathbf Q,\mathbf K,\mathbf V$를 구하세요. (2) 점수 행렬 $\mathbf S=\mathbf Q\mathbf K^T/\sqrt{D_k}$를 구하고 $s_{12}$와 $s_{21}$을 비교해, 그 차이가 어디서 오는지 설명하세요. (3) 어텐션 행렬의 첫 행 $(a_{11},a_{12},a_{13})$과 출력 $\mathbf y_1$을 소수 넷째 자리까지 구하세요. (4) $\sqrt{D_k}$로 나누지 않으면 첫 행이 어떻게 되는지 구하고 그 차이를 해석하세요.`,
        rubric: R`
- (1) $\mathbf Q,\mathbf K,\mathbf V$를 행마다 바르게 계산 — 2점
- (2) $\mathbf S$ 전체, $s_{12}=\sqrt2\ne s_{21}=0$, 원인이 $\mathbf W^{(q)}\mathbf W^{(k)T}$의 비대칭임 — 3점
- (3) 첫 행 $(0.1400,\ 0.2840,\ 0.5760)$과 $\mathbf y_1=(0.7160,\ 1.7199)$ — 3점
- (4) 나누지 않은 첫 행 $(0.0900,\ 0.2447,\ 0.6652)$와 포화로 이어지는 해석 — 2점`,
        sol: R`
**핵심.** Algorithm 12.1을 그대로 따릅니다: 투영 → 점수 → 행마다 소프트맥스 → 값의 가중합. 토큰이 행이므로 $\mathbf x_n\mathbf W^{(q)}$가 $\mathbf Q$의 $n$행입니다.

1. **투영.** $\mathbf x_1\mathbf W$는 $\mathbf W$의 첫 행, $\mathbf x_2\mathbf W$는 둘째 행, $\mathbf x_3\mathbf W$는 두 행의 합이므로
$$\mathbf Q=\begin{pmatrix}1&1\\0&1\\1&2\end{pmatrix},\qquad \mathbf K=\begin{pmatrix}1&0\\1&1\\2&1\end{pmatrix},\qquad \mathbf V=\begin{pmatrix}1&0\\0&2\\1&2\end{pmatrix}.$$
2. **점수.** $(\mathbf Q\mathbf K^T)_{nm}=\mathbf q_n^T\mathbf k_m$이므로
$$\mathbf Q\mathbf K^T=\begin{pmatrix}1&2&3\\0&1&1\\1&3&4\end{pmatrix},\qquad \mathbf S=\frac1{\sqrt2}\mathbf Q\mathbf K^T=\begin{pmatrix}0.7071&1.4142&2.1213\\0&0.7071&0.7071\\0.7071&2.1213&2.8284\end{pmatrix}.$$
$s_{12}=\sqrt2=1.414$이지만 $s_{21}=0$입니다. $\mathbf Q\mathbf K^T=\mathbf X\mathbf M\mathbf X^T$, $\mathbf M=\mathbf W^{(q)}\mathbf W^{(k)T}=\begin{pmatrix}1&2\\0&1\end{pmatrix}$이고 $\mathbf M$이 대칭이 아니므로 $\mathbf x_1^T\mathbf M\mathbf x_2=M_{12}=2$와 $\mathbf x_2^T\mathbf M\mathbf x_1=M_{21}=0$이 다릅니다. 토큰 1은 토큰 2를 찾지만 토큰 2는 토큰 1을 특별히 찾지 않는, 방향이 있는 관계입니다. 같은 투영 $\mathbf U$를 썼다면 $\mathbf M=\mathbf U\mathbf U^T$가 대칭이라 이런 차이가 생길 수 없습니다.
3. **첫 행의 소프트맥스와 출력.** $e^{0.7071}=2.0281$, $e^{1.4142}=4.1133$, $e^{2.1213}=8.3421$, 합 $14.4835$이므로
$$(a_{11},a_{12},a_{13})=(0.1400,\ 0.2840,\ 0.5760).$$
$\mathbf y_1=0.1400(1,0)+0.2840(0,2)+0.5760(1,2)=(0.7160,\ 1.7199)$. 계수가 음이 아니고 합이 1이므로 $\mathbf y_1$은 세 값 벡터의 볼록 결합입니다(첫 성분 $0\le0.716\le1$, 둘째 $0\le1.72\le2$).
4. **나누지 않으면.** 첫 행은 $\operatorname{softmax}(1,2,3)$: $e^1=2.7183$, $e^2=7.3891$, $e^3=20.0855$, 합 $30.1929$로 $(0.0900,\ 0.2447,\ 0.6652)$, 이때 $\mathbf y_1=(0.7553,\ 1.8199)$. 점수 차가 $\sqrt2$배 커져 가장 큰 계수가 $0.5760$에서 $0.6652$로 커지고 분포가 뾰족해집니다. 여기서는 $D_k=2$라 차이가 작지만 점수의 분산은 $D_k$에 비례하므로, 예컨대 $D_k=64$이면 표준편차가 8배가 되어 소프트맥스가 원-핫에 가까워지고 야코비안 $p_i(\delta_{ij}-p_j)$가 0에 가까워져 기울기가 사라집니다. $\sqrt{D_k}$로 나누면 이 영역을 피합니다.

**검산.** 나머지 행까지 계산하면
$$\mathbf A=\begin{pmatrix}0.1400&0.2840&0.5760\\0.1978&0.4011&0.4011\\0.0743&0.3057&0.6200\end{pmatrix}$$
로 행의 합이 모두 1이고, 열의 합 $(0.4121,\ 0.9908,\ 1.5971)$은 1이 아닙니다. 소프트맥스를 행마다 했기 때문입니다.

관련: [[ch15:12.1b|쿼리·키·값 어텐션]]` },
      { ch: 'ch15', type: 'open', lv: 3, pts: 8, q: R`멀티헤드 어텐션 $\mathbf Y=\operatorname{Concat}[\mathbf H_1,\dots,\mathbf H_H]\mathbf W^{(o)}$, $\mathbf H_h=\mathbf A_h\mathbf X\mathbf W_h^{(v)}$ ($\mathbf A_h=\operatorname{Softmax}[\mathbf Q_h\mathbf K_h^T/\sqrt{D_k}]$)에 대해 (1) $\mathbf W^{(o)}$를 위에서부터 $D_v$행씩 나눈 블록 $\mathbf W_h^{(o)}$로 $\mathbf Y=\sum_h\mathbf A_h\mathbf X\mathbf W_h^{(v)}\mathbf W_h^{(o)}$임을 보이고, (2) $\mathbf W_h^{(v)}\mathbf W_h^{(o)}$의 계수가 $D_v$ 이하임을 보이세요. (3) $D=512$, $H=8$, $D_k=D_v=64$일 때 원래 모델의 모수와, 각 $\mathbf W_h^{(v)}\mathbf W_h^{(o)}$를 자유로운 $D\times D$ 행렬로 바꾼 모델의 모수(Q·K 투영은 그대로, 편향 제외)를 비교하고, 두 모델이 같은지 판단하세요.`,
        rubric: R`
- (1) 열·행을 같은 자리에서 나눈 블록 곱셈으로 $\sum_h\mathbf H_h\mathbf W_h^{(o)}$를 얻고 $\mathbf H_h$를 대입 — 3점
- (2) 곱의 열이 $\mathbf W_h^{(v)}$의 열들의 일차결합이라 계수 $\le D_v$ — 2점
- (3) $1{,}048{,}576$ 대 $2{,}621{,}440$, 머리별 변환의 계수 제약이 사라져 같은 모델이 아님 — 3점`,
        sol: R`
**핵심.** 블록 행렬의 곱은 맞닿는 블록끼리 곱해 더한 것이고, 곱 $\mathbf B\mathbf C$의 각 열은 $\mathbf B$의 열들의 일차결합입니다.

1. **블록 곱셈.** $\mathbf H=[\mathbf H_1\ \cdots\ \mathbf H_H]$는 $N\times HD_v$이고, 열을 $D_v$개씩 끊으면 머리별 블록이 됩니다. $\mathbf W^{(o)}$ ($HD_v\times D$)의 행을 같은 자리에서 끊어 $\mathbf W_1^{(o)},\dots,\mathbf W_H^{(o)}$ (각 $D_v\times D$)라 하면, 원소로 $(\mathbf H\mathbf W^{(o)})_{ij}=\sum_{c=1}^{HD_v}H_{ic}W^{(o)}_{cj}$이고 합의 범위 $c$를 머리별 구간 $D_v$개씩으로 나누면
$$\mathbf Y=\sum_{h=1}^H\mathbf H_h\mathbf W_h^{(o)}=\sum_{h=1}^H\mathbf A_h\mathbf X\,\mathbf W_h^{(v)}\mathbf W_h^{(o)}.$$
크기는 $\mathbf A_h$가 $N\times N$, $\mathbf X$가 $N\times D$, $\mathbf W_h^{(v)}\mathbf W_h^{(o)}$가 $D\times D$로 맞습니다. 각 머리는 "자기 어텐션 무늬로 섞은 입력에 $D\times D$ 변환을 건 것"을 보탭니다.
2. **계수.** $\mathbf W^{(h)}=\mathbf W_h^{(v)}\mathbf W_h^{(o)}$의 $j$열은 $\mathbf W_h^{(v)}$에 $\mathbf W_h^{(o)}$의 $j$열을 곱한 것, 곧 $\mathbf W_h^{(v)}$의 열 $D_v$개의 일차결합입니다. 따라서 $\mathbf W^{(h)}$의 열공간은 $\mathbf W_h^{(v)}$의 열공간에 들어가고 $\operatorname{rank}\mathbf W^{(h)}\le D_v$입니다. $D_v=D/H<D$이면 부족 계수(rank-deficient)입니다.
3. **모수 비교.** 원래 모델은 $4D^2=4\cdot512^2=1{,}048{,}576$개입니다. 바꾼 모델은 Q·K가 머리마다 $2\cdot512\cdot64$, 여덟 머리 $2D^2=524{,}288$개이고 자유 행렬이 $H\cdot D^2=8\cdot262{,}144=2{,}097{,}152$개라 합 $2{,}621{,}440$개, 원래의 $2.5$배입니다. 원래 모델의 함수는 곱 $\mathbf W_h^{(v)}\mathbf W_h^{(o)}$를 계산해 넣으면 모두 바꾼 모델로 나타낼 수 있지만, 바꾼 모델에서는 머리 하나의 기여 $\mathbf A_h\mathbf X\mathbf W^{(h)}$가 계수 512까지의 변환을 쓸 수 있고 원래 모델에서는 64 이하로 묶입니다. 모수 수도 제약도 다르므로 두 모델은 같지 않고, 바꾼 쪽이 원래 모델을 포함하는 더 큰 모델입니다. 원래 식의 "중복"처럼 보이는 연이은 곱은 바로 이 계수 제약을 만드는 장치입니다.

**검산.** $H=1$, $D_v=D$이면 $\mathbf W^{(v)}\mathbf W^{(o)}$는 아무 $D\times D$ 행렬이나 될 수 있어(예: $\mathbf W^{(o)}=\mathbf I$) 두 모델이 같은 함수를 나타내고, 그때는 행렬 하나로 합쳐도 됩니다. 계수 제약은 $D_v<D$일 때만 생깁니다.

관련: [[ch15:12.1c|멀티헤드 어텐션의 머리별 합]]` },
      { ch: 'ch15', type: 'open', lv: 3, pts: 9, q: R`셀프 어텐션 $\operatorname{Attention}(\mathbf X)=\operatorname{Softmax}\big[\mathbf X\mathbf W^{(q)}\mathbf W^{(k)T}\mathbf X^T/\sqrt{D_k}\big]\mathbf X\mathbf W^{(v)}$와 $N\times N$ 순열 행렬 $\mathbf P$에 대해 (1) 행마다의 소프트맥스가 $\operatorname{Softmax}[\mathbf P\mathbf S\mathbf P^T]=\mathbf P\operatorname{Softmax}[\mathbf S]\mathbf P^T$를 만족함을 보이고, (2) $\operatorname{Attention}(\mathbf P\mathbf X)=\mathbf P\operatorname{Attention}(\mathbf X)$를 증명하세요. (3) 잔차 연결·층 정규화·위치별 MLP를 붙인 트랜스포머 층 전체도 순열 등변임을 보이고, 위치 부호화 없이 출력 토큰들의 평균을 문장 표현으로 쓰면 “The food was bad, not good at all.”과 “The food was good, not bad at all.”을 구별할 수 없음을 설명하세요. (4) 위치 부호화를 더한 입력 $\mathbf X+\mathbf R$에서는 이 등변성이 왜 깨지는지 쓰세요.`,
        rubric: R`
- (1) 순열 $\pi$로 $(\mathbf P\mathbf S\mathbf P^T)_{nm}=s_{\pi(n)\pi(m)}$, 한 행 안의 재배열이 분모를 바꾸지 않음 — 3점
- (2) $\mathbf Q,\mathbf K,\mathbf V$가 모두 $\mathbf P$배가 되고 $\mathbf P^T\mathbf P=\mathbf I$로 결론 — 2점
- (3) 행별 함수·잔차·합성의 등변성, 평균이 순열 불변이라 두 문장의 표현이 같음 — 2점
- (4) $\mathbf P\mathbf X+\mathbf R\ne\mathbf P(\mathbf X+\mathbf R)$: 위치 벡터는 토큰을 따라 움직이지 않음 — 2점`,
        sol: R`
**핵심.** 순열 행렬 $\mathbf P$는 $\mathbf P\mathbf X$의 $n$행이 $\mathbf X$의 $\pi(n)$행이 되도록 행을 섞고, $\mathbf P^T\mathbf P=\mathbf I$입니다. 오른쪽에 $\mathbf P^T$를 곱하면 같은 순열로 열을 섞습니다.

1. **소프트맥스.** $(\mathbf P\mathbf S\mathbf P^T)_{nm}=s_{\pi(n)\pi(m)}$이므로 그 소프트맥스의 $(n,m)$ 원소는
$$\frac{\exp(s_{\pi(n)\pi(m)})}{\sum_{m'}\exp(s_{\pi(n)\pi(m')})}=\frac{\exp(s_{\pi(n)\pi(m)})}{\sum_{l}\exp(s_{\pi(n)l})}=\big(\operatorname{Softmax}[\mathbf S]\big)_{\pi(n)\pi(m)}$$
입니다. 가운데 등호는 $m'$이 $1,\dots,N$을 돌 때 $l=\pi(m')$도 $1,\dots,N$을 한 번씩 돌기 때문입니다(한 행 안의 순서를 바꿔도 분모의 합은 같음). 오른쪽은 $(\mathbf P\operatorname{Softmax}[\mathbf S]\mathbf P^T)_{nm}$이므로 등식이 성립합니다.
2. **어텐션.** $\mathbf Q'=\mathbf P\mathbf X\mathbf W^{(q)}=\mathbf P\mathbf Q$, 마찬가지로 $\mathbf K'=\mathbf P\mathbf K$, $\mathbf V'=\mathbf P\mathbf V$이고 $\mathbf S'=\mathbf P\mathbf Q\mathbf K^T\mathbf P^T/\sqrt{D_k}=\mathbf P\mathbf S\mathbf P^T$입니다. (1)과 $\mathbf P^T\mathbf P=\mathbf I$로
$$\operatorname{Attention}(\mathbf P\mathbf X)=\mathbf P\operatorname{Softmax}[\mathbf S]\mathbf P^T\mathbf P\mathbf V=\mathbf P\operatorname{Softmax}[\mathbf S]\mathbf V=\mathbf P\operatorname{Attention}(\mathbf X).$$
3. **층 전체와 평균.** 층 정규화와 위치별 MLP는 모든 행에 같은 함수 $g$를 적용하므로, 행을 섞고 적용하나 적용하고 섞으나 같습니다: $g(\mathbf P\mathbf X)=\mathbf Pg(\mathbf X)$. 잔차 덧셈도 $\mathbf P\mathbf Y+\mathbf P\mathbf X=\mathbf P(\mathbf Y+\mathbf X)$입니다. 멀티헤드는 머리마다 등변이고, 이어 붙이기와 오른쪽의 $\mathbf W^{(o)}$는 행 순서를 건드리지 않습니다. 등변 함수의 합성은 등변이므로 층과, 층을 쌓은 망 전체가 $f(\mathbf P\mathbf X)=\mathbf Pf(\mathbf X)$입니다. 평균은 $\frac1N\mathbf 1^Tf(\mathbf P\mathbf X)=\frac1N\mathbf 1^T\mathbf Pf(\mathbf X)=\frac1N\mathbf 1^Tf(\mathbf X)$ ($\mathbf 1^T\mathbf P=\mathbf 1^T$)로 순서와 무관합니다. 두 문장은 같은 토큰을 bad와 good의 자리만 바꿔 담고 있으므로 문장 표현이 정확히 같아, 뜻이 반대인데도 구별할 수 없습니다.
4. **위치 부호화.** 위치 벡터 $\mathbf r_n$은 토큰이 아니라 **자리**에 붙어 있습니다. 토큰 순서를 바꾼 입력은 $\mathbf P\mathbf X+\mathbf R$이고, 원래 입력 전체를 섞은 것은 $\mathbf P(\mathbf X+\mathbf R)=\mathbf P\mathbf X+\mathbf P\mathbf R$입니다. 위치마다 $\mathbf r_n$이 다르면 $\mathbf P\mathbf R\ne\mathbf R$이라 두 입력이 다르고, $f(\mathbf P\mathbf X+\mathbf R)$를 $\mathbf Pf(\mathbf X+\mathbf R)$로 쓸 근거가 없습니다. "bad"가 앞자리에 있을 때와 뒷자리에 있을 때 서로 다른 입력 벡터가 되므로 순서가 표현에 들어갑니다.

관련: [[ch15:12.1d|순열 등변성]] [[ch11:9.1b|대칭, 불변성, 등변성]]` },
      { ch: 'ch15', type: 'open', lv: 2, pts: 8, q: R`차원 $D$ (짝수)의 사인파 위치 부호화에서 쌍 $j=0,\dots,D/2-1$은 각진동수 $\omega_j=L^{-2j/D}$로 $(r_{n,2j},r_{n,2j+1})=(\sin\omega_jn,\cos\omega_jn)$이다. (1) $\lVert\mathbf r_n\rVert^2$이 모든 위치에서 $D/2$임을 보이세요. (2) $\mathbf r_n^T\mathbf r_{n+k}=\sum_j\cos(\omega_jk)$임을 보이고, 이 값이 $n$과 무관하며 $k$와 $-k$에서 같음을 설명하세요. (3) $D=4$, $L=100$에서 $k=1,3,6$의 $\mathbf r_n^T\mathbf r_{n+k}$를 소수 넷째 자리까지 구하고, 결과가 거리에 대해 단조가 아닌 이유를 설명하세요.`,
        rubric: R`
- (1) 쌍마다 $\sin^2+\cos^2=1$, 쌍이 $D/2$개 — 2점
- (2) 덧셈정리로 쌍의 기여가 $\cos\omega_jk$, $n$과 무관, 코사인이 짝함수 — 3점
- (3) $1.5353$, $-0.0347$, $1.7855$와 빠른 쌍의 주기 $2\pi$로 비단조를 설명 — 3점`,
        sol: R`
**핵심.** 한 쌍 $(\sin\theta,\cos\theta)$는 단위원 위의 점이고, 두 점의 내적은 각의 차의 코사인입니다: $\sin a\sin b+\cos a\cos b=\cos(b-a)$.

1. **길이.** 쌍 $j$의 기여는 $\sin^2\omega_jn+\cos^2\omega_jn=1$이고 쌍이 $D/2$개이므로 $\lVert\mathbf r_n\rVert^2=D/2$입니다. 위치에 따라 크기가 변하지 않으므로, 정수 $n$을 그대로 더할 때와 달리 먼 위치의 토큰 임베딩만 크게 흔드는 일이 없습니다.
2. **내적.** 쌍 $j$의 기여는 $\sin(\omega_jn)\sin(\omega_j(n+k))+\cos(\omega_jn)\cos(\omega_j(n+k))=\cos\big(\omega_j(n+k)-\omega_jn\big)=\cos(\omega_jk)$이고, 쌍마다 더하면
$$\mathbf r_n^T\mathbf r_{n+k}=\sum_{j=0}^{D/2-1}\cos(\omega_jk)$$
로 $n$이 남지 않습니다. 상대 위치의 선형변환으로 보아도 같습니다. $\mathbf r_{n+k}=\mathbf M_k\mathbf r_n$이므로 $\mathbf r_n^T\mathbf M_k\mathbf r_n$에서 회전 블록 하나의 기여가 $\cos(\omega_jk)\big(\sin^2\omega_jn+\cos^2\omega_jn\big)=\cos(\omega_jk)$입니다(두 교차항 $\pm\sin(\omega_jk)\sin(\omega_jn)\cos(\omega_jn)$은 서로 지워짐). 코사인은 짝함수라 $k$와 $-k$에서 값이 같으므로, 내적만으로는 몇 칸 떨어졌는지는 알 수 있어도 앞인지 뒤인지는 알 수 없습니다. 방향은 $\mathbf M_k\ne\mathbf M_{-k}$인 회전 자체에 담겨 있습니다.
3. **수치.** $D=4$, $L=100$이면 $\omega_0=1$, $\omega_1=100^{-2/4}=0.1$이고 $\mathbf r_n^T\mathbf r_{n+k}=\cos k+\cos0.1k$입니다.
- $k=1$: $0.5403+0.9950=1.5353$
- $k=3$: $-0.9900+0.9553=-0.0347$
- $k=6$: $0.9602+0.8253=1.7855$

$k=0$이면 최댓값 $2=D/2$입니다. 6칸 떨어진 위치가 1칸 떨어진 위치보다 더 비슷하게 나오는 것은, 빠른 쌍($\omega_0=1$)의 주기가 $2\pi\approx6.28$이라 $k=6$에서 거의 한 바퀴 돌아 제자리에 오기 때문입니다. 느린 쌍($\omega_1=0.1$, 주기 $62.8$)은 $k$가 커질수록 꾸준히 줄어 이 겹침을 일부 구별해 줍니다. 이진수에서 높은 자리가 낮은 자리의 반복을 구별해 주는 것과 같은 구조이고, $D$가 크면 파장이 서로 다른 쌍이 많아 이런 우연한 겹침이 흩어지기 쉽습니다.

**검산.** $k=0$에서 (2)의 식은 $\sum_j\cos0=D/2$로 (1)과 일치합니다.

관련: [[ch15:12.1d|사인파 위치 부호화]]` },
    ],
  },
  );
})();
