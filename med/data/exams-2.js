/* 실전 모의고사 IV — 교재 6장(07단원)과 10장(13–14단원). 2026-09-29 추가. 연습문제와 겹치지 않는 문항입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x4', roman: 'IV', kind: '교재 6·10장 범위', title: '심층 신경망과 합성곱 신경망', scopeText: '07, 13–14 단원',
    desc: '다층 신경망의 모수·활성화·오차함수와 대조 학습, 합성곱의 계산·크기·모수, 수용 영역, IoU·FGSM·전치 합성곱·스타일 행렬. 계산과 유도를 섞었습니다.',
    minutes: 90, plot: 'gabor',
    problems: [
      { ch: 'ch07', type: 'num', lv: 1, pts: 6, q: R`입력 20개, 은닉 유닛 50개, 출력 5개인 2층 신경망(편향 포함)의 모수 개수는?`, ans: '1305', ansTex: R`21\cdot50+51\cdot5=1305`,
        sol: R`$(D+1)M+(M+1)K=21\cdot50+51\cdot5=1050+255=1305$.` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 5, q: R`은닉 활성화가 항등함수인 2층망($D=10$, $M=3$, $K=10$)이 나타내는 선형사상 $\mathbf W^{(2)}\mathbf W^{(1)}$의 계수(rank)의 최댓값은?`, ans: '3', ansTex: R`3`,
        sol: R`$\operatorname{rank}(\mathbf W^{(2)}\mathbf W^{(1)})\le\min(D,M,K)=3$. 은닉층이 병목입니다.` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 6, q: R`기준과 양성 예의 유사도가 $0.9$, 음성 예 네 개와의 유사도가 모두 $0.1$일 때 InfoNCE 손실은? (소수 넷째 자리)`, ans: '-ln(exp(0.9)/(exp(0.9)+4*exp(0.1)))', ansTex: R`\approx1.0287`,
        sol: R`$-\ln\frac{e^{0.9}}{e^{0.9}+4e^{0.1}}=-\ln\frac{2.4596}{2.4596+4.4207}\approx1.0287$.` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 6, q: R`로짓 $\mathbf a=(1,0,-1)$에 소프트맥스를 쓰고 정답이 첫째 클래스일 때 $\partial E/\partial a_1$ ($E=-\sum_kt_k\ln y_k$)은? (소수 넷째 자리)`, ans: 'exp(1)/(exp(1)+1+exp(-1))-1', ansTex: R`y_1-1\approx-0.3348`,
        sol: R`$y_1=\frac{e}{e+1+e^{-1}}\approx0.6652$, $\partial E/\partial a_1=y_1-t_1\approx-0.3348$.` },
      { ch: 'ch07', type: 'mc', lv: 1, pts: 5, q: R`흉부 X선 한 장에서 “결절”, “기흉”, “심비대”를 **각각 있는지** 판단하는 망의 출력층과 오차함수로 알맞은 것은?`,
        choices: [R`소프트맥스 3개 + 다중 클래스 교차 엔트로피`, R`시그모이드 3개 + 이진 교차 엔트로피의 합`, R`선형 출력 3개 + 제곱오차`, R`tanh 출력 3개 + 제곱오차`], ans: 1,
        sol: R`세 소견은 동시에 있을 수 있어 서로 배타적이지 않으므로 레이블마다 독립인 이진 분류입니다: $E=-\sum_k\{t_k\ln y_k+(1-t_k)\ln(1-y_k)\}$.` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 5, q: R`목표가 2개($K=2$)인 회귀에서 세 표본의 잔차 벡터가 $(0.2,-0.1)$, $(0.3,0)$, $(-0.2,0.4)$이다. 잡음 분산의 최대가능도 추정값은? (소수 넷째 자리)`, ans: '0.34/6', ansTex: R`\tfrac{0.34}{6}\approx0.0567`,
        sol: R`$\sum_n\lVert\cdot\rVert^2=0.05+0.09+0.20=0.34$, $\sigma^{2\star}=\frac1{NK}\sum=\frac{0.34}{6}\approx0.0567$.` },
      { ch: 'ch13', type: 'num', lv: 1, pts: 6, q: R`$128\times128$ 영상에 $7\times7$ 필터를 패딩 3, 보폭 2로 적용한 출력의 한 변은?`, ans: '64', ansTex: R`\lfloor127/2\rfloor+1=64`,
        sol: R`$\lfloor(128+6-7)/2\rfloor+1=63+1=64$.` },
      { ch: 'ch13', type: 'num', lv: 1, pts: 6, q: R`256채널 입력에 $3\times3$ 필터 512개를 쓰는 합성곱층의 모수(편향 포함)는?`, ans: '(9*256+1)*512', ansTex: R`1{,}180{,}160`,
        sol: R`$(M^2C_{\text{IN}}+1)C_{\text{OUT}}=2305\cdot512=1{,}180{,}160$.` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 6, q: R`$I=\begin{pmatrix}1&2&0\\0&1&3\\2&1&1\end{pmatrix}$, $K=\begin{pmatrix}1&-1\\0&2\end{pmatrix}$일 때 $C=I*K$ (딥러닝의 정의)의 $C(0,1)$ (첫 행 둘째 열)은?`, ans: '8', ansTex: R`2-0+0+6=8`,
        sol: R`패치 $\begin{pmatrix}2&0\\1&3\end{pmatrix}$: $2\cdot1+0\cdot(-1)+1\cdot0+3\cdot2=8$.` },
      { ch: 'ch13', type: 'num', lv: 1, pts: 5, q: R`보폭 1인 $3\times3$ 합성곱층 5개를 쌓으면 맨 위 유닛의 수용 영역 한 변은?`, ans: '11', ansTex: R`5\cdot2+1=11`,
        sol: R`$L(M-1)+1=11$.` },
      { ch: 'ch13', type: 'mc', lv: 1, pts: 5, q: R`1×1 합성곱의 주된 용도는?`,
        choices: [R`공간 해상도를 절반으로 줄이기`, R`공간 크기는 유지한 채 채널 수를 바꾸기(줄이기)`, R`모서리 검출`, R`평행이동 불변성 만들기`], ans: 1,
        sol: R`한 화소 위치의 채널 벡터에 같은 선형변환을 적용합니다. 풀링·보폭 합성곱이 공간을 줄인다면 1×1은 깊이를 줄여 계산을 아낍니다.` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 6, q: R`정답 상자 $[0,3]\times[0,3]$, 예측 상자 $[1,4]\times[1,4]$의 IoU는? (소수 넷째 자리)`, ans: '4/14', ansTex: R`\tfrac4{14}\approx0.2857`,
        sol: R`교집합 $[1,3]\times[1,3]$의 넓이 4, 합집합 $9+9-4=14$.` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 5, q: R`로지스틱 회귀 $\sigma(\mathbf w^T\mathbf x)$, $\mathbf w=(3,-2,1,0.5)$에 $\epsilon=0.05$의 FGSM을 적용하면(참 레이블 1) 사전활성 $\mathbf w^T\mathbf x$는 얼마나 줄어드는가?`, ans: '0.325', ansTex: R`\epsilon\lVert\mathbf w\rVert_1=0.325`,
        sol: R`$\nabla_{\mathbf x}E=-(1-\sigma)\mathbf w$라 섭동은 $-\epsilon\operatorname{sign}(\mathbf w)$, 사전활성 변화는 $-\epsilon\sum\lvert w_i\rvert=-0.05\cdot6.5=-0.325$.` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 6, q: R`필터 $(2,1,-1)$, 입력 $(z_1,z_2)=(1,3)$, 출력 보폭 2(겹치면 더함)인 1차원 전치 합성곱 결과 $\mathbf A^T\mathbf z$의 셋째 원소는?`, ans: '5', ansTex: R`w_3z_1+w_1z_2=-1+6=5`,
        sol: R`$(w_1z_1,w_2z_1,w_3z_1+w_1z_2,w_2z_2,w_3z_2,0)=(2,1,5,3,-3,0)$.` },
      { ch: 'ch14', type: 'num', lv: 1, pts: 5, q: R`한 층의 위치가 3곳이고 채널 1의 값이 $(1,2,0)$, 채널 2의 값이 $(0,1,1)$일 때 스타일 행렬의 $F_{12}$는?`, ans: '2', ansTex: R`0+2+0=2`,
        sol: R`같은 위치끼리 곱해 더합니다: $1\cdot0+2\cdot1+0\cdot1=2$.` },
      { ch: 'ch07', type: 'open', lv: 3, pts: 9, q: R`소프트맥스 $y_k=e^{a_k}/\sum_je^{a_j}$와 1-of-$K$ 목표 $\mathbf t$에 대해 (1) 범주 분포의 음의 로그가능도가 $E=-\sum_kt_k\ln y_k$임을 쓰고, (2) $\partial E/\partial a_k=y_k-t_k$를 유도하고, (3) 모든 $a_k$에 같은 상수를 더해도 $E$가 변하지 않음을 보이세요.`,
        rubric: R`
- 범주 분포 $\prod_ky_k^{t_k}$에서 음의 로그 — 2점
- $\partial\ln y_j/\partial a_k=\delta_{jk}-y_k$ — 3점
- $\sum_jt_j=1$을 써서 $y_k-t_k$ — 2점
- 상수 이동 불변 — 2점`,
        sol: R`
(1) $p(\mathbf t\mid\mathbf x)=\prod_ky_k^{t_k}$ → $-\ln p=-\sum_kt_k\ln y_k$.
(2) $\ln y_j=a_j-\ln\sum_le^{a_l}$이므로 $\partial\ln y_j/\partial a_k=\delta_{jk}-y_k$, 따라서 $\frac{\partial E}{\partial a_k}=-\sum_jt_j(\delta_{jk}-y_k)=-t_k+y_k\sum_jt_j=y_k-t_k$.
(3) $\frac{e^{a_k+c}}{\sum_je^{a_j+c}}=\frac{e^{a_k}}{\sum_je^{a_j}}$이라 $y_k$가 같고 $E$도 같습니다.` },
      { ch: 'ch14', type: 'open', lv: 3, pts: 8, q: R`마지막 합성곱층(채널 $k$, 유닛 수 $M$) 뒤에 전역 평균 풀링과 선형층만 있어 $a^{(c)}=\sum_kw_k^c\frac1M\sum_{i,j}a_{ij}^{(k)}+b^c$일 때, Grad-CAM의 $\alpha_k$와 $\mathbf L$을 구하고 $\sum_{i,j}L_{ij}$가 무엇과 같은지 설명하세요.`,
        rubric: R`
- $\partial a^{(c)}/\partial a_{ij}^{(k)}=w_k^c/M$ — 3점
- $\alpha_k=w_k^c/M$, $\mathbf L=\frac1M\sum_kw_k^c\mathbf A^{(k)}$ — 3점
- $\sum L_{ij}=a^{(c)}-b^c$ — 2점`,
        sol: R`
$a^{(c)}$가 $a_{ij}^{(k)}$에 대해 선형이라 $\frac{\partial a^{(c)}}{\partial a_{ij}^{(k)}}=\frac{w_k^c}M$(위치와 무관). $\alpha_k=\frac1M\sum_{i,j}\frac{w_k^c}M=\frac{w_k^c}M$, $\mathbf L=\sum_k\alpha_k\mathbf A^{(k)}=\frac1M\sum_kw_k^c\mathbf A^{(k)}$ — 클래스 가중치로 특징 맵을 섞은 CAM과 같습니다.
$\sum_{i,j}L_{ij}=\sum_kw_k^c\frac1M\sum_{i,j}a_{ij}^{(k)}=a^{(c)}-b^c$: 열지도의 합이 편향을 뺀 클래스 점수이고, 각 위치가 점수에 얼마나 기여했는지로 나눠 준 것입니다.` },
    ],
  },
  );
})();
