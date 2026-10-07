/* 증명 — 15–16단원: 5주차 월요일(3)·6주차 수요일 슬라이드의 합성곱 신경망(출력 크기, 매개변수, 등변성, 작은 필터, 인셉션, 잔차 연결, 현저성 지도). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 15
  { ch: 'ch15', id: 'outsize', title: '합성곱 출력 크기 공식의 유도', keys: ['출력 크기 공식'],
    tags: 'convolution output size stride padding receptive 합성곱 출력 크기 보폭 패딩',
    stmt: R`길이 $N$인 입력에 패딩 $P$를 하고 크기 $K$인 필터를 보폭 $S$로 적용하면 출력 길이는 $\big\lfloor\frac{N-K+2P}{S}\big\rfloor+1$이고, 나누어떨어지면 $\frac{N-K+2P}{S}+1$이다. 보폭 1이고 $K$가 홀수이면 $P=\frac{K-1}2$일 때 출력 길이가 $N$이다.`,
    body: R`
패딩한 입력의 칸 번호를 $0,1,\dots,N+2P-1$이라 합니다. 필터의 첫 칸을 $s$번 칸에 놓으면 필터는 $s,s+1,\dots,s+K-1$번 칸을 씁니다. 보폭이 $S$이므로 놓는 자리는 $s=mS$ ($m=0,1,2,\dots$)입니다.
필터가 입력 안에 있으려면 $mS+K-1\le N+2P-1$, 곧 $m\le\frac{N+2P-K}{S}$입니다. 이를 만족하는 정수 $m$은 $0,1,\dots,\big\lfloor\frac{N+2P-K}{S}\big\rfloor$이므로 그 개수, 곧 출력 길이는
$$N'=\Big\lfloor\frac{N-K+2P}{S}\Big\rfloor+1$$
입니다. $S$가 $N-K+2P$를 나누면 내림이 필요 없습니다.
**크기 보존.** $S=1$이면 $N'=N-K+2P+1$이고, $N'=N\iff2P=K-1\iff P=\frac{K-1}2$. $K$가 홀수여야 $P$가 정수입니다.`,
    note: R`가로와 세로에 따로 적용하면 2차원 출력 $N'\times N'$이 되고, 출력 깊이는 필터 개수입니다. 풀링도 같은 공식을 따릅니다(보통 $P=0$).` },
  { ch: 'ch15', id: 'convparams', title: '합성곱층의 매개변수 수', keys: ['합성곱층의 크기와 매개변수'],
    tags: 'convolution parameters weight sharing filters depth bias 합성곱 매개변수 가중치 공유 필터',
    stmt: R`입력 $N\times N\times C_{\text{in}}$에 $K\times K$ 필터 $C_{\text{out}}$개(편향 포함)를 쓰는 합성곱층의 매개변수는 $K^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$개이고 $N$과 무관하다. 같은 입출력 크기의 완전연결층은 $N^2C_{\text{in}}\cdot N'^2C_{\text{out}}+N'^2C_{\text{out}}$개가 필요하다.`,
    body: R`
출력의 $c$번째 활성화 맵의 $(x,y)$ 성분은
$$G_c[x,y]=\sum_{i=0}^{K-1}\sum_{j=0}^{K-1}\sum_{d=1}^{C_{\text{in}}}w_c[i,j,d]\,F[x+i,\ y+j,\ d]+b_c$$
이고, 필터 $w_c$와 편향 $b_c$는 위치 $(x,y)$에 따라 달라지지 않습니다(가중치 공유). 따라서 활성화 맵 하나에 필요한 수는 $w_c$의 $K\cdot K\cdot C_{\text{in}}$개와 $b_c$ 하나이고, 맵이 $C_{\text{out}}$장이므로 모두 $C_{\text{out}}(K^2C_{\text{in}}+1)$개입니다. 이 식에 $N$이 없으므로 입력의 가로·세로와 무관합니다.
**완전연결과의 비교.** 출력의 $N'^2C_{\text{out}}$개 성분 각각이 입력의 $N^2C_{\text{in}}$개 성분 모두에 대해 자기만의 가중치를 가지면 $N^2C_{\text{in}}\cdot N'^2C_{\text{out}}$개, 편향이 $N'^2C_{\text{out}}$개입니다. 합성곱층은 (1) 각 출력이 $K\times K\times C_{\text{in}}$ 조각만 보고(국소 연결) (2) 모든 위치가 같은 가중치를 써서(공유) 이 수를 줄인 것입니다.`,
    note: R`슬라이드의 예: $5\times5\times3$ 필터 하나는 $75+1=76$개, 6개면 456개. 같은 출력 $28\times28\times6$을 $32\times32\times3$에서 완전연결로 만들면 가중치만 $3072\cdot4704\approx1.4\times10^7$개입니다.` },
  { ch: 'ch15', id: 'equivar', title: '합성곱의 이동 등변성', keys: ['이동 등변성과 불변성'],
    tags: 'translation equivariance invariance convolution shift pooling 이동 등변성 불변성 합성곱 평행이동',
    stmt: R`평행이동 $(g_{a,b}\cdot F)[x,y]=F[x-a,\ y-b]$와 합성곱 $f(F)[x,y]=\sum_{i,j}w[i,j]F[x+i,\ y+j]$ (무한히 넓은 이미지)에 대해 $f(g_{a,b}\cdot F)=g_{a,b}\cdot f(F)$이다. 또 $f$ 뒤에 전역 최대 풀링 $p(G)=\max_{x,y}G[x,y]$를 붙인 $p\circ f$는 이동 불변이다.`,
    body: R`
**등변.** 모든 $(x,y)$에 대해
$$f(g_{a,b}\cdot F)[x,y]=\sum_{i,j}w[i,j]\,(g_{a,b}\cdot F)[x+i,\ y+j]=\sum_{i,j}w[i,j]\,F[x+i-a,\ y+j-b]=f(F)[x-a,\ y-b]=\big(g_{a,b}\cdot f(F)\big)[x,y].$$
세 번째 등호는 $f(F)$의 정의에서 $(x,y)$ 자리에 $(x-a,y-b)$를 넣은 것이고, 이것이 가능한 이유는 $w[i,j]$가 위치와 무관하기 때문입니다(가중치 공유).
**불변.** 평행이동은 칸들을 옮길 뿐 값들의 집합을 바꾸지 않으므로 $\max_{x,y}(g\cdot G)[x,y]=\max_{x,y}G[x,y]$. 따라서 $p(f(g\cdot F))=p(g\cdot f(F))=p(f(F))$.
**공유가 없으면 깨짐.** 위치마다 다른 가중치 $w_{x,y}[i,j]$를 쓰면 셋째 등호 대신 $\sum_{i,j}w_{x,y}[i,j]F[x+i-a,y+j-b]$가 되고, 이는 일반적으로 $\sum_{i,j}w_{x-a,y-b}[i,j]F[x-a+i,y-b+j]=f(F)[x-a,y-b]$와 다릅니다.`,
    note: R`실제 이미지는 유한하므로 경계(제로 패딩) 근처에서는 등변성이 정확하지 않고, 보폭 $S>1$이면 $S$의 배수만큼 옮길 때만 성립합니다. 지역 최대 풀링은 창 안의 작은 이동에 대해서만 근사적으로 불변입니다.` },
  // ───── 16
  { ch: 'ch16', id: 'stack3', title: '3×3 합성곱을 쌓을 때의 수용 영역과 매개변수', keys: ['작은 필터 쌓기'],
    tags: 'receptive field VGG 3x3 stacking parameters 수용 영역 작은 필터 VGG',
    stmt: R`보폭 1인 $3\times3$ 합성곱 $n$층을 쌓으면 출력 한 칸의 수용 영역은 $(2n+1)\times(2n+1)$이다. 채널 수가 모두 $C$이면 가중치는 $9nC^2$개로, 같은 수용 영역의 $(2n+1)\times(2n+1)$ 합성곱 한 층의 $(2n+1)^2C^2$개보다 적다($n\ge2$).`,
    body: R`
**수용 영역.** 한 방향만 봅니다. $n$층 뒤 출력 한 칸이 보는 입력 칸 수를 $r_n$이라 합시다. $r_1=3$. $n$층의 출력 한 칸은 $(n-1)$층의 연속한 3칸을 보고, 그 3칸 각각은 입력의 연속한 $r_{n-1}$칸을 보는데, 이웃한 두 칸의 범위는 보폭 1이라 1칸씩 어긋납니다. 따라서 합친 범위는 $r_{n-1}+2$칸, 곧 $r_n=r_{n-1}+2=2n+1$입니다. 가로·세로 모두 같으므로 $(2n+1)\times(2n+1)$.
**매개변수.** 층마다 $3\cdot3\cdot C\cdot C=9C^2$이므로 $n$층에 $9nC^2$. 한 층으로 같은 수용 영역을 얻으면 $(2n+1)^2C^2$. $n\ge2$에서 $(2n+1)^2-9n=4n^2-5n+1=(4n-1)(n-1)>0$이므로 쌓는 쪽이 적습니다. $n=2$이면 $18C^2<25C^2$, $n=3$이면 $27C^2<49C^2$.`,
    note: R`층 사이에 ReLU가 들어가므로 쌓은 망은 큰 필터 한 층(선형 + ReLU 하나)보다 더 많은 비선형성을 가집니다. 이것이 VGG가 모든 층을 $3\times3$으로 통일한 이유입니다(슬라이드는 결론만 제시).` },
  { ch: 'ch16', id: 'inception', title: '인셉션 모듈의 매개변수 수', keys: ['인셉션 모듈의 크기와 매개변수'],
    tags: 'GoogLeNet inception module bottleneck 1x1 convolution parameters 인셉션 병목 1x1 합성곱',
    stmt: R`입력 $28\times28\times256$에 대해 (편향 제외) 단순 인셉션 모듈($1\times1$ 128, $3\times3$ 192, $5\times5$ 96, $3\times3$ 최대 풀링)의 가중치는 $1{,}089{,}536$개이고 출력은 $28\times28\times672$이다. $3\times3$·$5\times5$ 앞과 풀링 뒤에 $1\times1$ 합성곱(64)을 넣은 병목 모듈은 $346{,}112$개이고 출력은 $28\times28\times480$이다.`,
    body: R`
합성곱층의 가중치는 $K^2C_{\text{in}}C_{\text{out}}$이고 풀링은 0입니다. 모든 갈래는 보폭 1과 크기 보존 패딩을 써서 $28\times28$을 유지하므로 출력 채널은 갈래 출력 채널의 합입니다.
**단순.** $1\cdot256\cdot128+9\cdot256\cdot192+25\cdot256\cdot96=32{,}768+442{,}368+614{,}400=1{,}089{,}536$. 풀링 갈래는 입력 채널 256을 그대로 내므로 출력은 $128+192+96+256=672$채널.
**병목.** $3\times3$ 갈래: $1\cdot256\cdot64+9\cdot64\cdot192=16{,}384+110{,}592$. $5\times5$ 갈래: $16{,}384+25\cdot64\cdot96=16{,}384+153{,}600$. 풀링 갈래: $1\cdot256\cdot64=16{,}384$. $1\times1$ 갈래: $32{,}768$. 합 $346{,}112$, 출력 $128+192+96+64=480$채널.
비율은 $346{,}112/1{,}089{,}536\approx0.318$이고, 줄어든 대부분은 $5\times5$ 갈래($614{,}400\to169{,}984$)와 $3\times3$ 갈래($442{,}368\to126{,}976$)에서 옵니다. 비싼 공간 합성곱이 256채널 대신 64채널 위에서 계산되기 때문입니다.`,
    note: R`슬라이드 40은 병목 모듈을 “약 330k”로 적었는데, 이는 $1\times1\times256\times64$ 하나를 빼고 더한 $329{,}728$입니다. 여섯 합성곱을 모두 세면 $346{,}112$입니다.` },
  { ch: 'ch16', id: 'resgrad', title: '잔차 연결과 기울기 흐름', keys: ['잔차 연결'],
    tags: 'ResNet residual connection skip identity gradient vanishing Jacobian 잔차 연결 지름길 기울기 소실 야코비안',
    stmt: R`$\mathbf h^{(k+1)}=\mathbf h^{(k)}+F_k(\mathbf h^{(k)})$ ($k=l,\dots,L-1$)이면 $\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}\prod_{k=l}^{L-1}(I+A_k)$ ($A_k=\frac{\partial F_k}{\partial\mathbf h^{(k)}}$)이고, 곱을 전개하면 $\frac{\partial J}{\partial\mathbf h^{(L)}}$이 그대로 들어 있다. 단순 망 $\mathbf h^{(k+1)}=F_k(\mathbf h^{(k)})$에서 $\lVert A_k\rVert\le a<1$이면 $\big\lVert\frac{\partial J}{\partial\mathbf h^{(l)}}\big\rVert\le a^{L-l}\big\lVert\frac{\partial J}{\partial\mathbf h^{(L)}}\big\rVert$이다.`,
    body: R`
기울기를 행벡터로 씁니다. 연쇄법칙에서 $\frac{\partial J}{\partial\mathbf h^{(k)}}=\frac{\partial J}{\partial\mathbf h^{(k+1)}}\frac{\partial\mathbf h^{(k+1)}}{\partial\mathbf h^{(k)}}$입니다[[ch09:9.5|벡터 입출력과 야코비안.]].
**잔차.** $\frac{\partial\mathbf h^{(k+1)}}{\partial\mathbf h^{(k)}}=\frac{\partial\mathbf h^{(k)}}{\partial\mathbf h^{(k)}}+\frac{\partial F_k}{\partial\mathbf h^{(k)}}=I+A_k$. $k=L-1,L-2,\dots,l$ 순으로 대입하면
$$\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}(I+A_{L-1})(I+A_{L-2})\cdots(I+A_l).$$
곱을 전개하면 $I+\sum_kA_k+\sum_{j>k}A_jA_k+\cdots$의 꼴이므로 $\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}+\frac{\partial J}{\partial\mathbf h^{(L)}}\big(\sum_kA_k+\cdots\big)$. 첫 항은 아무 야코비안도 곱해지지 않은 위층의 기울기입니다.
**단순 망.** $\frac{\partial\mathbf h^{(k+1)}}{\partial\mathbf h^{(k)}}=A_k$이므로 $\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}A_{L-1}\cdots A_l$이고, 노름의 곱 부등식 $\lVert vA\rVert\le\lVert v\rVert\lVert A\rVert$을 되풀이하면 $\le a^{L-l}\big\lVert\frac{\partial J}{\partial\mathbf h^{(L)}}\big\rVert$. $L-l$이 크면 지수적으로 0에 가깝습니다.`,
    note: R`잔차망에서도 나머지 항들이 첫 항을 상쇄하는 특별한 경우가 이론적으로는 가능하지만, $F_k$의 가중치가 작게 초기화된 학습 초기에는 $A_k\approx0$이라 기울기가 거의 그대로 전달됩니다. 그래서 수백 층도 학습됩니다.` },
  { ch: 'ch16', id: 'saliency', title: '현저성 지도는 점수의 입력 기울기다', keys: ['현저성 지도'],
    tags: 'saliency map gradient input backpropagation Taylor class score 현저성 지도 입력 기울기 역전파',
    stmt: R`클래스 점수 $S_c(I)=[F^{(L)}\circ\cdots\circ F^{(1)}](I)_c$에 대해 $\frac{\partial S_c}{\partial I}=\big[\frac{\partial F^{(L)}}{\partial F^{(L-1)}}\cdots\frac{\partial F^{(1)}}{\partial I}\big]_c$ ($c$번째 행)이고, $I_0$ 근처에서 $S_c(I)=S_c(I_0)+w^T(I-I_0)+o(\lVert I-I_0\rVert)$, $w=\frac{\partial S_c}{\partial I}\big|_{I_0}$이다.`,
    body: R`
**연쇄법칙.** $F^{(1)}=F^{(1)}(I)$, $F^{(k)}=F^{(k)}(F^{(k-1)})$로 합성된 함수의 야코비안은 각 단계 야코비안의 곱입니다: $\frac{\partial F^{(L)}}{\partial I}=\frac{\partial F^{(L)}}{\partial F^{(L-1)}}\cdots\frac{\partial F^{(2)}}{\partial F^{(1)}}\frac{\partial F^{(1)}}{\partial I}$. $S_c$는 $F^{(L)}$의 $c$번째 성분이므로 이 행렬의 $c$번째 행이 $\frac{\partial S_c}{\partial I}$입니다. 계산은 역전파처럼 왼쪽에서부터 행벡터 $e_c^T$에 야코비안을 차례로 곱하므로 순전파 한 번, 역전파 한 번이면 됩니다.
**1차 근사.** $S_c$가 $I_0$에서 미분가능하면 미분의 정의에서 $S_c(I)=S_c(I_0)+\nabla S_c(I_0)^T(I-I_0)+o(\lVert I-I_0\rVert)$입니다[[ch13:13.1|1차 테일러 전개.]]. 화소 $p$만 $\delta$ 바꾸면 점수는 $w_p\delta+o(\delta)$ 바뀌므로 $|w_p|$가 그 화소에 대한 점수의 민감도입니다. 이 $|w|$를 이미지 모양으로 그린 것이 현저성 지도입니다.`,
    note: R`컬러 이미지에서는 화소마다 세 채널 중 $|w|$가 가장 큰 값을 쓰는 것이 Simonyan et al. (2014)의 방법입니다. ReLU망은 구간별 선형이라 $w$는 그 입력이 속한 선형 조각의 가중치이고, 선형 분류기 $S_c=w_c^TI+b_c$에서는 $w=w_c$입니다.` },
  );
})();
