/* 유도 — Part A·B: 01 자유도 … 07 트위스트 */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 01
  { ch: 'ch01', id: 'dofCount', title: '공간 강체의 자유도가 6인 이유', keys: ['자유도 세기'], src: '강의 자료 · Week 2',
    tags: 'degrees of freedom rigid body points constraints 자유도 강체 점 구속',
    stmt: R`한 직선 위에 있지 않은 세 점 A, B, C로 공간 강체의 형상을 정할 수 있고, 그 자유도는 6이다.`,
    body: R`
**점과 구속을 세기**: 세 점의 좌표 9개에 거리 구속 $d_{AB},d_{BC},d_{CA}$가 3개. 세 거리는 서로 독립(각각 다른 쌍의 점만 담음)이므로 $9-3=6$.
**차례로 놓기**: A는 공간 어디든 — 3. B는 A에서 거리 $d_{AB}$인 구면 위 — 2. C는 A와 B에서 거리가 정해진 두 구면의 교선, 즉 AB 축 둘레의 원 위 — 1. 합 $3+2+1=6$.
세 점이 정해지면 나머지 점 D는 세 거리 $d_{AD},d_{BD},d_{CD}$로 두 후보(평면 ABC에 대한 거울상) 중 하나로 정해지고, 연속적으로 움직이는 강체에서는 뒤집힐 수 없으므로 하나로 정해집니다. 그래서 세 점이면 충분합니다.`,
    note: R`평면 강체는 같은 셈으로 $2+1=3$입니다. 세 점이 한 직선 위에 있으면 그 직선 둘레의 회전을 정하지 못합니다.` },
  { ch: 'ch01', id: 'grubler', title: '그뤼블러 공식의 유도', keys: ['그뤼블러 공식'], src: '강의 자료 · Week 2',
    tags: 'Gruebler Grubler formula mobility joints links constraints 그뤼블러 이동도 관절 링크',
    stmt: R`링크 $N$개(바닥 포함), 관절 $J$개인 기구에서 관절 $i$가 $f_i$개의 자유도를 허용하고 모든 구속이 독립이면 $\text{dof}=m(N-1-J)+\sum f_i$이다.`,
    body: R`
바닥을 뺀 $N-1$개 링크가 서로 이어져 있지 않다면 각각 $m$개(평면 3, 공간 6)의 자유도를 가집니다: 합 $m(N-1)$.
관절 $i$는 이웃한 두 링크의 상대 운동 $m$개 중 $f_i$개만 허용하므로 구속 $c_i=m-f_i$개를 줍니다.
구속이 모두 독립이면 $\text{dof}=m(N-1)-\sum_{i=1}^J(m-f_i)=m(N-1)-mJ+\sum f_i=m(N-1-J)+\sum f_i$.`,
    note: R`직렬 사슬은 $N=J+1$이라 $\sum f_i$. 구속이 겹치면 실제 자유도가 더 크므로 공식은 하한입니다(연습 문제).` },
  { ch: 'ch01', id: 'grublerFail', title: '구면 기구를 평면 공식으로 세는 이유', keys: ['그뤼블러 공식이 틀리는 경우'], src: '강의 자료 · Week 3-1',
    tags: 'spherical four bar linkage Gruebler exceptions redundant constraints 구면 기구 예외',
    stmt: R`모든 회전축이 한 점 O에서 만나는 기구는 $m=3$으로 센다. 구면 4절 링크의 자유도는 1이다.`,
    body: R`
모든 관절축이 O를 지나면, 바닥에서 출발해 관절을 하나씩 지날 때마다 링크의 운동은 O를 지나는 축 둘레의 회전들의 합성 — 결국 O를 고정한 회전입니다. 그래서 모든 링크의 형상은 $SO(3)$(차원 3) 안에 있고, 링크 하나의 자유도는 6이 아니라 3입니다.
O를 지나는 회전 관절은 두 링크의 상대 회전(3차원) 중 한 축 둘레만 허용해 구속 $3-1=2$개를 줍니다. 따라서 공식의 $m$ 자리에 3을 넣어야 하고, 구면 4절 링크는 $3(4-1-4)+4=1$.
공간 공식 $6(\cdot)$을 쓰면 링크마다 “이미 성립하는” 구속(O가 고정됨)을 관절에서 또 세어 구속 수를 부풀립니다.`,
    note: R`같은 논리로, 모든 운동이 서로 나란한 평면에 갇힌 평면 기구도 공간에서 움직이지만 $m=3$으로 셉니다.` },
  // ───── 02
  { ch: 'ch02', id: 'torusNotSphere', title: '토러스와 구면이 다른 공간인 이유', keys: ['C-공간의 위상'], src: '강의 자료 · Week 3-1',
    tags: 'torus sphere topology loops product space 토러스 구면 위상 고리 곱공간',
    stmt: R`2R 팔의 C-공간 $S^1\times S^1=T^2$는 구면 $S^2$와 위상적으로 같지 않다.`,
    body: R`
위상이 같다면 한 공간의 연속적인 성질이 그대로 옮겨집니다. 그런 성질 하나: “모든 닫힌 고리를 공간 안에서 연속적으로 줄여 한 점으로 만들 수 있다.”
구면에서는 참입니다: 어떤 고리든 고리가 지나지 않는 점이 있으면(고리가 구면 전체를 덮지 않으면) 그 점을 뺀 구면은 평면과 같아 고리를 줄일 수 있습니다(구면을 덮는 괴상한 고리도 조금 밀어 한 점을 비우게 할 수 있음).
토러스에서는 거짓입니다: $\theta_1$만 0에서 $2\pi$까지 도는 고리 $(\theta_1,0)$을 생각하면, 연속 변형 동안 “$\theta_1$이 몇 바퀴 도는가”(정수)가 변할 수 없는데 한 점으로 줄이면 0바퀴가 되어야 합니다.
따라서 둘은 다릅니다. 곱공간 $S^1\times S^1$은 각 관절이 독립적으로 원 위를 돈다는 사실을 그대로 적은 것입니다.`,
    note: R`감긴 횟수(정수)가 연속 변형에서 변하지 않는다는 것은 각의 연속 함수를 $\mathbb R$로 “풀어” 생각하면 보입니다: 풀린 각의 끝점 차이는 $2\pi\times$정수이고, 연속적으로 변하는 정수는 상수입니다.` },
  { ch: 'ch02', id: 'noGlobalChart', title: '구면 전체를 특이점 없는 좌표 두 개로 덮을 수 없다', keys: ['명시적 표현과 암시적 표현'],
    tags: 'chart singularity sphere invariance of domain explicit parametrization 좌표 특이점 구면',
    stmt: R`구면 $S^2$에서 평면 $\mathbb R^2$로 가는 연속 단사 함수는 없다. 따라서 위도·경도처럼 좌표 두 개로 구면 전체를 나타내면 어딘가에서 불연속이거나 한 점에 여러 좌표가 대응하는 특이점이 생긴다.`,
    body: R`
연속 단사 $\phi:S^2\to\mathbb R^2$가 있다고 합시다.
(1) $S^2$는 유계 닫힌 집합(콤팩트)이고 연속 함수는 콤팩트성을 보존하므로 $\phi(S^2)$는 $\mathbb R^2$의 유계 닫힌 집합.
(2) 구면의 각 점 근처는 평면의 열린 원판과 같고, 차원이 같은 공간 사이의 연속 단사 함수는 열린 집합을 열린 집합으로 보냅니다(영역 불변 정리). 그러므로 $\phi(S^2)$는 $\mathbb R^2$에서 열린 집합.
(3) $\mathbb R^2$는 연결되어 있어 공집합도 전체도 아닌 집합이 열려 있으면서 닫혀 있을 수 없습니다. $\phi(S^2)$는 비어 있지 않고 유계라 전체가 아니므로 모순.
따라서 구면에는 전역 좌표 두 개가 없고, 위도·경도의 극점 문제는 피할 수 없는 것입니다.`,
    note: R`같은 이유로 $SO(3)$(3차원, 콤팩트)도 세 수의 좌표(오일러 각, 지수 좌표)로 특이점 없이 덮을 수 없습니다. 회전 행렬(암시적 표현)이나 단위 사원수를 쓰는 이유입니다.` },
  { ch: 'ch02', id: 'pfaffExact', title: '속도 구속이 홀로노믹인지 판정하기', keys: ['홀로노믹 구속과 비홀로노믹 구속'],
    tags: 'Pfaffian constraint integrable holonomic nonholonomic exact differential 파프 구속 적분 가능',
    stmt: R`두 변수의 속도 구속 $a(x,y)\dot x+b(x,y)\dot y=0$은 적분 인자 $\lambda$가 있어 $\lambda a\,dx+\lambda b\,dy$가 완전 미분이면 홀로노믹이다. 변수가 셋 이상이면 적분되지 않는 경우가 있고, 그때 비홀로노믹이다.`,
    body: R`
구속이 $g(x,y)=c$에서 왔다면 $\dot g=g_x\dot x+g_y\dot y=0$이므로 $(a,b)$는 $(g_x,g_y)$에 비례해야 합니다: $\lambda a=g_x$, $\lambda b=g_y$. 혼합 미분이 같아야 하므로 $\partial(\lambda a)/\partial y=\partial(\lambda b)/\partial x$.
예: $\dot y-x\dot x=0$ ($a=-x$, $b=1$)은 $\lambda=1$로 $\partial(-x)/\partial y=0=\partial(1)/\partial x$ — 완전 미분이고 $g=y-x^2/2$.
두 변수에서는 한 구속이 국소적으로 늘 적분 인자를 가집니다(구속을 만족하는 방향이 한 줄뿐이라 그 방향을 따라가는 곡선들이 곧 $g=c$). 네 변수의 구르는 동전처럼 허용된 방향이 둘 이상이면, 두 허용 방향을 번갈아 따라가는 동작이 새 방향을 만들어낼 수 있고(2단원 연습 문제의 평행 주차), 그러면 어떤 $g$도 운동을 가두지 못합니다.`,
    note: R`일반적인 판정은 프로베니우스 정리(허용된 속도 방향들의 리 괄호가 그 방향들 안에 머무는가)입니다. 이 책의 범위에서는 “닿을 수 있는 형상의 차원”으로 판정해도 충분합니다.` },
  { ch: 'ch02', id: 'annulus2R', title: '2R 팔의 작업 공간이 고리인 이유', keys: ['태스크 공간과 작업 공간'],
    tags: 'workspace 2R arm annulus law of cosines 작업 공간 고리 코사인 법칙',
    stmt: R`관절 제한이 없는 평면 2R 팔의 끝점이 닿는 점의 집합은 $\lvert L_1-L_2\rvert\le\sqrt{x^2+y^2}\le L_1+L_2$인 고리다.`,
    body: R`
끝점까지의 거리 $d$: $d^2=(L_1c_1+L_2c_{12})^2+(L_1s_1+L_2s_{12})^2=L_1^2+L_2^2+2L_1L_2\cos\theta_2$.
$\cos\theta_2\in[-1,1]$이므로 $d\in[\lvert L_1-L_2\rvert,L_1+L_2]$. 그 사이의 모든 $d$는 $\theta_2$를 연속적으로 바꿔 얻고, 거리가 정해진 뒤 $\theta_1$을 돌리면 그 원 위의 모든 방향에 닿습니다. 따라서 고리 전체.`,
    note: R`$L_1=L_2$면 안쪽 반지름이 0이라 원판 전체입니다. 관절 제한이 있으면 고리의 일부만 남습니다.` },
  // ───── 03
  { ch: 'ch03', id: 'contactEq', title: '접촉력의 정적 평형을 행렬로 쓰기', keys: ['정적 평형과 Ax = b'], src: '강의 자료 · Week 3-1',
    tags: 'static equilibrium contact wrench matrix nonnegative 정적 평형 접촉 렌치',
    stmt: R`마찰 없는 접촉력 $f_i=x_i\hat n_i$ ($x_i\ge0$)와 외부 렌치의 평형은 $Ax=b$, $A=[a_1\cdots a_n]$, $a_i=(\hat n_i,r_i\times\hat n_i)$, $b=-(f_{\text{ext}},m_{\text{ext}})$로 쓸 수 있다.`,
    body: R`
강체의 평형: 힘의 합 0, 원점에 대한 모멘트의 합 0.
$f_{\text{ext}}+\sum x_i\hat n_i=0$, $m_{\text{ext}}+\sum r_i\times(x_i\hat n_i)=0$.
둘째 식에서 $x_i$는 스칼라라 밖으로 나옵니다: $\sum x_i(r_i\times\hat n_i)$. 두 식을 쌓으면 $\sum x_i\begin{bmatrix}\hat n_i\\r_i\times\hat n_i\end{bmatrix}=-\begin{bmatrix}f_{\text{ext}}\\m_{\text{ext}}\end{bmatrix}$ — $Ax=b$.
$x_i\ge0$은 접촉이 밀기만 한다는 조건입니다.`,
    note: R`렌치를 $(m,f)$ 순서로 쓰는 교재의 관례(8단원)와 순서가 바뀌어도 판정에는 영향이 없습니다. 행의 순서를 바꾸는 것은 가역 행 연산입니다.` },
  { ch: 'ch03', id: 'posSpanLemma', title: '양의 생성, 볼록 껍질, 양의 영공간 벡터', keys: ['볼록 껍질과 양의 생성', '힘 닫힘 판정 (마찰 없는 점 접촉)'], src: '강의 자료 · Week 3-1',
    tags: 'positive span convex hull interior null vector force closure test 양의 생성 볼록 껍질 영공간',
    stmt: R`$A=[a_1\cdots a_m]\in\mathbb R^{n\times m}$에 대해 다음은 동치다. (i) $\mathrm{pos}\{a_i\}=\mathbb R^n$. (ii) $\operatorname{rank}A=n$이고 모든 성분이 양수인 $k$로 $Ak=0$. (iii) 원점이 $\mathrm{conv}\{a_i\}$의 내부에 있다. 따라서 $m\ge n+1$이어야 한다.`,
    body: R`
(ii)⇒(i): 임의의 $b$에 계수 조건으로 $Ax_p=b$. $x=x_p+tk$는 $t$가 크면 $x\ge0$, $Ax=b$.
(i)⇒(ii): 열이 $\mathbb R^n$을 생성하니 계수 $n$. $-A\mathbf 1=Ay$ ($y\ge0$) → $k=y+\mathbf 1>0$, $Ak=0$.
(iii)⇒(i): 원점 둘레 반지름 $\epsilon$의 공이 껍질 안이면 $b\ne0$에 대해 $\epsilon b/\lVert b\rVert=\sum\lambda_ia_i$ ($\lambda\ge0$) → $b=\sum(\lVert b\rVert\lambda_i/\epsilon)a_i$.
(ii)⇒(iii): $k$를 합이 1이 되게 나누면 $0=\sum\bar k_ia_i$ — 원점이 껍질 안(볼록 결합)에 있습니다. (i)에서 $\pm e_j$마다 $\pm e_j=\sum\kappa_ia_i$ ($\kappa\ge0$), 그 계수 합의 최댓값을 $c$라 하면 $\pm e_j/c=\sum(\kappa_i/c)a_i+(1-\sum\kappa_i/c)\cdot0$은 볼록 결합이므로 껍질에 속합니다. 꼭짓점 $\pm e_j/c$인 정팔면체(교차 다면체)가 껍질 안에 있고, 그 안에 반지름 $1/(c\sqrt n)$인 공이 들어갑니다.
개수: $m=n$이면 계수 $n$에서 $Ak=0$의 해는 0뿐이라 (ii)가 불가능.`,
    note: R`강의의 판정 2단계(“볼록 껍질이 원점의 열린 공을 품는가”)를 계산으로 바꾼 것이 (ii)입니다. 가우스-조던 소거로 $[I\mid a]$ 꼴을 만들면 $k=(-a,1)$이므로 $a$의 모든 성분이 음수인지만 보면 됩니다.` },
  // ───── 04
  { ch: 'ch04', id: 'coneAngle', title: '마찰 원뿔의 반각과 볼록성', keys: ['마찰 원뿔', '공간의 점 접촉과 소프트 핑거'], src: '강의 자료 · Week 3-2',
    tags: 'Coulomb friction cone half angle convex edges soft finger 쿨롱 마찰 원뿔 반각 볼록',
    stmt: R`쿨롱 조건 $\lvert f_t\rvert\le\mu f_n$을 만족하는 힘의 집합은 반각 $\alpha=\tan^{-1}\mu$인 볼록 원뿔이고, 평면에서는 두 모서리 벡터의 양의 결합과 같다.`,
    body: R`
힘과 법선 사이의 각 $\beta$: $\tan\beta=\lvert f_t\rvert/f_n$. 조건은 $\tan\beta\le\mu$, 즉 $\beta\le\tan^{-1}\mu$.
볼록성(공간): $f,g$가 조건을 만족하면 $\lambda f+(1-\lambda)g$의 접선 성분 크기는 삼각 부등식으로 $\le\lambda\lvert f_t\rvert+(1-\lambda)\lvert g_t\rvert\le\mu(\lambda f_n+(1-\lambda)g_n)$. 양수배에도 닫혀 있으니 볼록 원뿔.
평면: 원뿔은 두 모서리 $\hat e_1=\hat n+\mu\hat t$, $\hat e_2=\hat n-\mu\hat t$ 사이의 각. 원뿔 안의 $f=f_n\hat n+f_t\hat t$ ($\lvert f_t\rvert\le\mu f_n$)는 $x_1=\tfrac12(f_n+f_t/\mu)\ge0$, $x_2=\tfrac12(f_n-f_t/\mu)\ge0$으로 $f=x_1\hat e_1+x_2\hat e_2$.
소프트 핑거는 여기에 비틀림 모멘트 조건 $\lvert\tau\rvert\le\gamma f_z$를 더한 것으로, $(f,\tau)$의 집합도 같은 논리로 볼록 원뿔입니다.`,
    note: R`볼록 원뿔이라 “모서리의 양의 결합”으로 바꿀 수 있고, 그래서 마찰 없는 경우의 판정법(3단원)을 그대로 씁니다. 공간 원뿔은 모서리가 무한해 다각뿔로 근사합니다.` },
  { ch: 'ch04', id: 'nguyenProof', title: '응우옌 정리의 증명', keys: ['응우옌 정리'], src: '강의 자료 · Week 3-2',
    tags: 'Nguyen theorem two contacts line of sight friction cone force closure 응우옌 두 접촉',
    stmt: R`평면의 두 마찰 점 접촉 $p_1\ne p_2$ (반각 $0<\alpha<90°$)는 선분 $p_1p_2$가 두 원뿔의 내부에 있을 때, 그리고 그때에만 힘 닫힘이다.`,
    body: R`
렌치 열은 모서리 네 개: $p_1$의 $\hat e_1,\hat e_2$, $p_2$의 $\hat e_3,\hat e_4$.
(필요) 힘 닫힘이면 양수 $k$로 $Ak=0$(3단원). $f_1=k_1\hat e_1+k_2\hat e_2$는 원뿔 1의 내부, $f_2$는 원뿔 2의 내부이고 $f_1+f_2=0$, $(p_2-p_1)\times f_2=0$. 따라서 $f_2\parallel p_1-p_2$, $f_1\parallel p_2-p_1$ — 원뿔은 물체 안쪽을 향하므로 $f_1$은 $p_1$에서 $p_2$ 쪽. 선분 방향이 두 원뿔의 내부에 있습니다.
(충분) 선분 방향 $d$가 원뿔 1의 내부면 $d=k_1\hat e_1+k_2\hat e_2$ ($k_1,k_2>0$), $-d$가 원뿔 2의 내부면 $-d=k_3\hat e_3+k_4\hat e_4$. 같은 직선 위의 상쇄하는 두 힘이라 렌치 0 → 양수 $k$로 $Ak=0$.
계수 3: 평면 렌치의 계수가 2 이하라면 모든 작용선이 한 점을 지나거나 모두 평행. 작용선은 $p_1$을 지나는 서로 다른 두 직선과 $p_2$를 지나는 두 직선이라 둘 다 불가능.`,
    note: R`MR은 “두 접촉이 원뿔 안에서 서로를 볼 수 있으면 힘 닫힘”(충분 조건)을 모멘트 표지법으로 보입니다. 위의 필요 조건 논증을 더하면 두 접촉에 대해서는 동치가 됩니다.` },
  { ch: 'ch04', id: 'spatialContacts', title: '공간 물체에 마찰 점 접촉 두 개로는 부족한 이유', keys: ['공간 물체에 필요한 접촉 수'], src: '강의 자료 · Week 3-2',
    tags: 'spatial grasp two contacts axis moment three contacts collinear 공간 파지 두 접촉 세 접촉',
    stmt: R`마찰 점 접촉 두 개, 또는 한 직선 위의 세 개로는 공간 물체를 힘 닫힘으로 잡을 수 없다. 한 직선에 있지 않은 세 개는 가능하다.`,
    body: R`
접촉점들이 방향 $\hat\ell$인 한 직선 $\ell$ 위에 있다고 합시다. 원점을 $\ell$ 위에 잡으면 접촉점은 $r_i=s_i\hat\ell$. 접촉력 $f_i$가 $\ell$ 둘레로 만드는 모멘트는 스칼라 삼중곱으로 $\hat\ell\cdot(r_i\times f_i)=s_i\,\hat\ell\cdot(\hat\ell\times f_i)=0$ — 어떤 접촉력도 $\ell$ 둘레의 모멘트를 만들지 못합니다.
따라서 모든 접촉 렌치가 “$\ell$ 둘레 모멘트 = 0”인 초평면 안에 있어 계수가 6이 될 수 없고, $\ell$ 둘레의 외부 모멘트를 버티지 못합니다. 두 접촉은 항상 한 직선 위에 있으므로 부족합니다.
세 접촉이 한 직선에 있지 않으면 이 장애물이 사라지고, MR 정리 12.8은 각 원뿔이 접촉 평면 $S$를 평면 원뿔로 자르고 그 평면 파지가 힘 닫힘일 때(그리고 그때에만) 공간 힘 닫힘임을 보입니다.`,
    note: R`소프트 핑거는 법선 둘레의 비틀림 모멘트를 낼 수 있어, 두 접촉을 잇는 선이 두 법선과 나란하면 그 축 둘레 모멘트를 버틸 수 있습니다.` },
  { ch: 'ch04', id: 'qualityMeasure', title: '파지의 질이 양수이면 힘 닫힘이다', keys: ['파지의 질'], src: '강의 자료 · Week 3-2',
    tags: 'grasp quality largest ball convex hull force closure 파지의 질 가장 큰 공',
    stmt: R`$Q$를 원점 중심으로 $\mathrm{conv}\{a_i\}$ 안에 들어가는 가장 큰 공의 반지름이라 하면 $Q>0\iff$ 힘 닫힘이다. 접촉력의 계수 합을 1로 묶으면 크기 $Q$ 이하의 모든 외부 렌치를 버틸 수 있다.`,
    body: R`
$Q>0$이면 원점이 껍질의 내부 — 3단원의 동치 (iii)⇒(i)로 힘 닫힘. 역으로 힘 닫힘이면 (i)⇒(iii)으로 내부에 공이 있어 $Q>0$.
뜻: 외부 렌치 $w$ ($\lVert w\rVert\le Q$)를 버티려면 $-w=\sum\lambda_ia_i$가 필요한데, $-w$가 반지름 $Q$의 공 안에 있으므로 $\lambda_i\ge0$, $\sum\lambda_i=1$인 볼록 결합이 존재합니다. 즉 “접촉력 크기의 합 1”로 모든 방향의 크기 $Q$ 렌치를 버팁니다.`,
    note: R`렌치의 모멘트(N·m)와 힘(N)은 단위가 달라, 공의 “반지름”은 길이 척도를 정해야 의미가 있습니다. 보통 물체의 크기로 모멘트를 나눕니다.` },
  // ───── 05
  { ch: 'ch05', id: 'planarTransform', title: '평면에서 좌표 바꾸기', keys: ['평면의 자세와 변환'],
    tags: 'planar rigid body frame transformation rotation translation 평면 좌표 변환',
    stmt: R`{b}의 원점이 {s}에서 $p$, 방향각이 $\theta$이면 {b}에서 $r_b$인 점은 {s}에서 $r_s=P(\theta)r_b+p$이다.`,
    body: R`
점의 위치 벡터 $=$ {b} 원점까지 $+$ {b} 원점에서 점까지. 뒤의 벡터는 {b}의 축으로 $r_{b,x}\hat x_b+r_{b,y}\hat y_b$.
{s} 좌표로 $\hat x_b=(\cos\theta,\sin\theta)$, $\hat y_b=(-\sin\theta,\cos\theta)$이므로 $r_{b,x}\hat x_b+r_{b,y}\hat y_b=[\hat x_b\ \hat y_b]r_b=Pr_b$.
따라서 $r_s=p+Pr_b$. 동차 좌표로 $(r_s,1)=T(r_b,1)$.`,
    note: R`$P$의 열이 {b}의 축이라는 것이 모든 회전 행렬 공식의 출발점입니다.` },
  { ch: 'ch05', id: 'so3Props', title: '회전 행렬이 직교하고 행렬식이 1인 이유', keys: ['특수 직교군 SO(3)'],
    tags: 'SO(3) orthogonal determinant right handed group 직교 행렬 행렬식 군',
    stmt: R`물체 좌표계의 단위 축을 열로 하는 행렬 $R$은 $R^TR=I$, $\det R=1$을 만족하고, 이런 행렬 전체는 곱에 대해 군을 이룬다.`,
    body: R`
$R^TR$의 $(i,j)$ 성분은 $i$번째 열과 $j$번째 열의 내적 — 단위 벡터이고 서로 수직이므로 $\delta_{ij}$.
$\det R=\hat x_b\cdot(\hat y_b\times\hat z_b)$이고 오른손 좌표계라 $\hat y_b\times\hat z_b=\hat x_b$ → $1$.
군: $(R_1R_2)^T(R_1R_2)=I$, $\det(R_1R_2)=1$(닫힘), $R^{-1}=R^T$도 같은 조건(역원), $I$(항등원), 행렬 곱의 결합법칙.`,
    note: R`5단원 연습 문제에서 내적 보존과 $\det=-1$을 빼는 이유까지 다룹니다.` },
  { ch: 'ch05', id: 'basicRot', title: '좌표축 둘레 기본 회전 행렬 읽기', keys: ['좌표축 둘레의 기본 회전'],
    tags: 'elementary rotation Rot x y z columns 기본 회전 좌표축',
    stmt: R`$\mathrm{Rot}(\hat z,\theta)$의 열은 $\hat z$ 둘레로 $\theta$ 돌린 $\hat x,\hat y,\hat z$이다. $\hat x$, $\hat y$ 둘레도 같다.`,
    body: R`
$\hat z$ 둘레로 $\theta$ 돌리면 $\hat x\mapsto(\cos\theta,\sin\theta,0)$, $\hat y\mapsto(-\sin\theta,\cos\theta,0)$, $\hat z\mapsto\hat z$ — 세 열.
$\hat x$ 둘레: $\hat y\mapsto(0,\cos\theta,\sin\theta)$, $\hat z\mapsto(0,-\sin\theta,\cos\theta)$.
$\hat y$ 둘레: 오른손 규칙으로 $\hat z$가 $\hat x$ 쪽으로 돈다: $\hat z\mapsto(\sin\theta,0,\cos\theta)$, $\hat x\mapsto(\cos\theta,0,-\sin\theta)$. 그래서 $\mathrm{Rot}(\hat y,\theta)$에서만 $\sin\theta$의 부호 위치가 다른 두 행렬과 반대로 보입니다.`,
    note: R`순환 순서 $x\to y\to z\to x$에서 $y$ 둘레 회전은 $(z,x)$ 평면의 회전이라 행렬에서 $(1,3)$ 성분이 $+\sin\theta$입니다.` },
  { ch: 'ch05', id: 'prePost', title: '아래첨자 지우기와 앞곱·뒷곱', keys: ['아래첨자 지우기 규칙', '앞곱과 뒷곱'],
    tags: 'subscript cancellation premultiply postmultiply fixed frame body frame 앞곱 뒷곱',
    stmt: R`$R_{ab}R_{bc}=R_{ac}$. 또 $\mathrm{Rot}(\hat\omega,\theta)R_{sb}$는 {s}에서 읽은 축 $\hat\omega$ 둘레의 회전, $R_{sb}\mathrm{Rot}(\hat\omega,\theta)$는 {b}에서 읽은 축 둘레의 회전이다.`,
    body: R`
$R_{bc}$의 열은 {c}의 축을 {b} 좌표로 쓴 것. $R_{ab}$는 {b} 좌표를 {a} 좌표로 바꾸므로 $R_{ab}R_{bc}$의 열은 {c}의 축을 {a} 좌표로 쓴 것 $=R_{ac}$.
앞곱: $R_{sb}$의 각 열(축 벡터, {s} 좌표)에 {s} 좌표로 쓴 회전을 적용 — {s}에서 읽은 축 $\hat\omega$ 둘레로 {b}의 세 축을 돌린 것.
뒷곱: 항등식 $R\,\mathrm{Rot}(\hat\omega,\theta)R^T=\mathrm{Rot}(R\hat\omega,\theta)$(6단원 $R[\omega]R^T=[R\omega]$와 로드리게스 공식)로
$R_{sb}\mathrm{Rot}(\hat\omega,\theta)=\mathrm{Rot}(R_{sb}\hat\omega,\theta)R_{sb}$. 즉 {s}에서 본 축 $R_{sb}\hat\omega$ — {b} 좌표로 $\hat\omega$인 축 — 둘레의 회전입니다.`,
    note: R`여러 번 돌릴 때 “고정 축 기준이면 왼쪽에 쌓고, 물체 축 기준이면 오른쪽에 쌓는다”고 기억하면 됩니다.` },
  // ───── 06
  { ch: 'ch06', id: 'skewConj', title: '반대칭 행렬의 켤레 항등식', keys: ['반대칭 행렬'],
    tags: 'skew symmetric matrix cross product rotation conjugation 반대칭 외적',
    stmt: R`$[x]y=x\times y$이고, $R\in SO(3)$에 대해 $R[\omega]R^T=[R\omega]$이다.`,
    body: R`
첫째는 성분 비교: $[x]y=(-x_3y_2+x_2y_3,\ x_3y_1-x_1y_3,\ -x_2y_1+x_1y_2)=x\times y$.
둘째: 회전은 외적을 보존합니다: $R(a\times b)=(Ra)\times(Rb)$ (길이·각·방향(오른손)을 보존하므로). 임의의 $y$에 대해
$R[\omega]R^Ty=R(\omega\times R^Ty)=(R\omega)\times(RR^Ty)=(R\omega)\times y=[R\omega]y$.`,
    note: R`이 항등식으로 $\omega_s=R\omega_b$와 뒷곱 규칙(5단원)이 모두 한 줄로 나옵니다.` },
  { ch: 'ch06', id: 'angVelSkew', title: '회전 행렬의 미분은 반대칭 행렬을 만든다', keys: ['고정·물체 좌표계의 각속도'],
    tags: 'angular velocity derivative rotation matrix skew symmetric space body 각속도 미분',
    stmt: R`$R(t)\in SO(3)$이면 $\dot RR^T$와 $R^T\dot R$은 반대칭이고, $\dot RR^T=[\omega_s]$, $R^T\dot R=[\omega_b]$로 정의한 두 각속도는 $\omega_s=R\omega_b$이다.`,
    body: R`
$RR^T=I$를 미분: $\dot RR^T+R\dot R^T=0$ → $\dot RR^T=-(\dot RR^T)^T$ — 반대칭. 같은 방법으로 $R^TR=I$에서 $R^T\dot R$도 반대칭.
$[\omega_b]=R^T\dot R=R^T(\dot RR^T)R=R^T[\omega_s]R=[R^T\omega_s]$ (켤레 항등식) → $\omega_b=R^T\omega_s$.
뜻: 각 열 $\hat x_b$의 속도 $\dot{\hat x}_b=[\omega_s]\hat x_b=\omega_s\times\hat x_b$ — 순간 축 $\omega_s$ 둘레의 회전.`,
    note: R`$\omega_s$와 $\omega_b$는 같은 물리적 각속도를 {s}와 {b}에서 쓴 것이지, 서로 다른 두 회전이 아닙니다.` },
  { ch: 'ch06', id: 'rodriguesProof', title: '로드리게스 공식', keys: ['로드리게스 공식'],
    tags: 'Rodrigues formula matrix exponential series 로드리게스 행렬 지수 급수',
    stmt: R`단위 벡터 $\hat\omega$에 대해 $e^{[\hat\omega]\theta}=I+\sin\theta[\hat\omega]+(1-\cos\theta)[\hat\omega]^2$이다.`,
    body: R`
$[\hat\omega]^2=\hat\omega\hat\omega^T-I$(외적 두 번), $[\hat\omega]^3=-[\hat\omega]$.
급수 $e^{[\hat\omega]\theta}=\sum\frac{\theta^n}{n!}[\hat\omega]^n$에서 홀수 거듭제곱은 $\pm[\hat\omega]$, 짝수는 $\pm[\hat\omega]^2$:
$=I+\Big(\theta-\frac{\theta^3}{3!}+\cdots\Big)[\hat\omega]+\Big(\frac{\theta^2}{2!}-\frac{\theta^4}{4!}+\cdots\Big)[\hat\omega]^2=I+\sin\theta[\hat\omega]+(1-\cos\theta)[\hat\omega]^2$.
결과가 회전인지 확인: $\hat\omega$는 고정되고($[\hat\omega]\hat\omega=0$), $\hat\omega$에 수직인 벡터는 그 평면에서 $\theta$만큼 돕니다.`,
    note: R`기하로도 보입니다: $p$를 축 성분 $\hat\omega\hat\omega^Tp$와 수직 성분으로 나누면 수직 성분만 $\cos\theta$, $\sin\theta$로 섞이며 돕니다.` },
  { ch: 'ch06', id: 'logDerive', title: '행렬 로그 공식', keys: ['행렬 로그'],
    tags: 'matrix logarithm trace axis angle rotation 행렬 로그 대각합',
    stmt: R`$R=e^{[\hat\omega]\theta}$이면 $\operatorname{tr}R=1+2\cos\theta$, $R-R^T=2\sin\theta[\hat\omega]$이다. 따라서 $\theta\in(0,\pi)$에서 $\theta=\cos^{-1}\frac{\operatorname{tr}R-1}2$, $[\hat\omega]=\frac{R-R^T}{2\sin\theta}$.`,
    body: R`
로드리게스 공식의 대각합: $\operatorname{tr}I=3$, $\operatorname{tr}[\hat\omega]=0$, $\operatorname{tr}[\hat\omega]^2=\operatorname{tr}(\hat\omega\hat\omega^T)-3=1-3=-2$.
$\operatorname{tr}R=3+(1-\cos\theta)(-2)=1+2\cos\theta$.
전치: $[\hat\omega]^T=-[\hat\omega]$, $([\hat\omega]^2)^T=[\hat\omega]^2$이므로 $R-R^T=2\sin\theta[\hat\omega]$.
$\theta=\pi$면 $\sin\theta=0$이라 둘째 식을 쓸 수 없고 $R=I+2[\hat\omega]^2=2\hat\omega\hat\omega^T-I$에서 $\hat\omega\hat\omega^T=(R+I)/2$ — 0이 아닌 열을 정규화합니다.`,
    note: R`$\theta=\pi$일 때 $(R+I)/2=\hat\omega\hat\omega^T$의 셋째 열은 $\omega_3\hat\omega$ → $\hat\omega=(r_{13},r_{23},1+r_{33})/\sqrt{2(1+r_{33})}$ ($r_{33}\ne-1$일 때).` },
  // ───── 07
  { ch: 'ch07', id: 'se3Inv', title: '동차 변환 행렬의 역행렬', keys: ['특수 유클리드 군 SE(3)'],
    tags: 'SE(3) homogeneous transformation inverse group 동차 변환 역행렬',
    stmt: R`$T=\begin{bmatrix}R&p\\0&1\end{bmatrix}$의 역행렬은 $\begin{bmatrix}R^T&-R^Tp\\0&1\end{bmatrix}$이고, $SE(3)$는 곱에 닫힌 군이다.`,
    body: R`
곱: $\begin{bmatrix}R^T&-R^Tp\\0&1\end{bmatrix}\begin{bmatrix}R&p\\0&1\end{bmatrix}=\begin{bmatrix}R^TR&R^Tp-R^Tp\\0&1\end{bmatrix}=I$.
닫힘: $T_1T_2=\begin{bmatrix}R_1R_2&R_1p_2+p_1\\0&1\end{bmatrix}$, $R_1R_2\in SO(3)$.
뜻: $T^{-1}$은 {b}에서 본 {s}. {s} 원점은 {b} 원점에서 $-p$만큼, 그것을 {b}의 축으로 읽으면 $-R^Tp$.`,
    note: R`$T_1T_2$의 위치 부분 $R_1p_2+p_1$은 “$p_2$를 $T_1$의 방향으로 돌린 뒤 $p_1$만큼 더한다”는 좌표 바꾸기 그대로입니다.` },
  { ch: 'ch07', id: 'twistAdjoint', title: '두 트위스트와 수반 행렬', keys: ['물체 트위스트와 공간 트위스트', '수반 행렬'],
    tags: 'body twist spatial twist adjoint map velocity 트위스트 수반 행렬',
    stmt: R`$T^{-1}\dot T=[\mathcal V_b]$, $\dot TT^{-1}=[\mathcal V_s]$에서 $\mathcal V_s=[\mathrm{Ad}_T]\mathcal V_b$, $[\mathrm{Ad}_T]=\begin{bmatrix}R&0\\{}[p]R&R\end{bmatrix}$이다.`,
    body: R`
$T^{-1}\dot T=\begin{bmatrix}R^T\dot R&R^T\dot p\\0&0\end{bmatrix}$ → $\omega_b$($R^T\dot R=[\omega_b]$), $v_b=R^T\dot p$.
$\dot TT^{-1}=\begin{bmatrix}\dot RR^T&\dot p-\dot RR^Tp\\0&0\end{bmatrix}$ → $\omega_s$, $v_s=\dot p-\omega_s\times p$.
$\omega_s=R\omega_b$. $v_s=Rv_b-(R\omega_b)\times p=Rv_b+p\times(R\omega_b)=Rv_b+[p]R\omega_b$.
또 $[\mathcal V_s]=\dot TT^{-1}=T(T^{-1}\dot T)T^{-1}=T[\mathcal V_b]T^{-1}$ — 행렬 형태의 수반 변환.`,
    note: R`$v_s=\dot p+\omega_s\times(0-p)$: {b} 원점의 속도에 “{b} 원점에서 {s} 원점까지”의 회전 기여를 더한 것 — 물체를 넓혀 {s} 원점에 겹친 점의 속도입니다.` },
  { ch: 'ch07', id: 'screwAxisPoint', title: '트위스트에서 나사 축의 점과 피치 찾기', keys: ['나사 축과 피치'],
    tags: 'screw axis pitch twist Chasles point on axis 나사 축 피치 샬',
    stmt: R`$\mathcal S=(\hat s,-\hat s\times q+h\hat s)$이면 축 위의 점은 축 방향으로만 $h\dot\theta$로 움직인다. 거꾸로 $\omega\ne0$인 트위스트 $(\omega,v)$의 축은 점 $q=\dfrac{\omega\times v}{\lVert\omega\rVert^2}$를 지나고 피치는 $h=\dfrac{\omega\cdot v}{\lVert\omega\rVert^2}$이다.`,
    body: R`
점 $r$의 속도(공간 트위스트로)는 $v+\omega\times r$. $\mathcal V=\mathcal S\dot\theta$, $r=q+t\hat s$:
$(-\hat s\times q+h\hat s)\dot\theta+\hat s\dot\theta\times(q+t\hat s)=h\hat s\dot\theta$ — 축 방향 병진만 남습니다.
거꾸로: $v=-\omega\times q+h\omega$에서 $\omega\cdot v=h\lVert\omega\rVert^2$ → $h$. $q$를 축에 수직인 점($\omega\cdot q=0$)으로 고르면 $\omega\times v=-\omega\times(\omega\times q)=-(\omega(\omega\cdot q)-q\lVert\omega\rVert^2)=q\lVert\omega\rVert^2$ → $q$.`,
    note: R`모든 강체 속도가 이렇게 한 나사로 쓰인다는 것이 샬의 정리입니다. $\omega=0$이면 축이 무한히 멀리 있는 순수 병진입니다.` },
  );
})();
