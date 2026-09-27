/* 유도 — Part A·B 앞부분: 01 정역학 … 08 굽힘 응력
   src가 있는 항목은 오정훈 교수님의 강의 슬라이드 흐름을 따른 것입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 01
  { ch: 'ch01', id: 'eqPoint', title: '합력이 0이면 모멘트 평형은 기준점에 무관하다', keys: ['강체의 평형 조건'], src: '강의 슬라이드 · Lecture 0 C',
    tags: 'equilibrium moment reference point 평형 모멘트 기준점 독립 식',
    stmt: R`힘 $\mathbf F_i$(작용점 $\mathbf r_i$)의 합이 $\mathbf 0$이면 임의의 두 점 $A,B$에 대해 $\sum\mathbf M_A=\sum\mathbf M_B$이다. 따라서 평면 강체의 독립 평형 식은 세 개다.`,
    body: R`
$\sum\mathbf M_B=\sum_i(\mathbf r_i-\mathbf r_B)\times\mathbf F_i=\sum_i(\mathbf r_i-\mathbf r_A)\times\mathbf F_i+(\mathbf r_A-\mathbf r_B)\times\sum_i\mathbf F_i=\sum\mathbf M_A+\mathbf r_{A/B}\times\sum\mathbf F.$
$\sum\mathbf F=\mathbf 0$이면 마지막 항이 사라집니다.

평면에서 $\sum F_x=\sum F_y=0$과 한 점의 $\sum M_A=0$이 성립하면 모든 점의 모멘트 식이 따라 나오므로, 다른 점에 대한 모멘트 식은 새 정보를 주지 않습니다. 대신 “$\sum M_A=\sum M_B=\sum M_C=0$($A,B,C$가 한 직선 위에 있지 않음)”의 세 식도 세 평형 식과 동치인 선택지입니다.`,
    note: R`예외: 모든 힘이 한 점을 지나면(질점) 모멘트 식이 자동으로 0이라 독립 식은 둘입니다. 1단원의 “회전 가능한 물체” 논의가 이 경우입니다.` },
  { ch: 'ch01', id: 'couple', title: '우력의 모멘트는 기준점에 무관하다', keys: ['우력의 모멘트'],
    tags: 'couple moment free vector 우력 자유 벡터',
    stmt: R`$\mathbf F$와 $-\mathbf F$가 각각 $\mathbf r_1$, $\mathbf r_2$에 작용하면 어느 점 $O$에 대해서도 모멘트는 $(\mathbf r_1-\mathbf r_2)\times\mathbf F$이고 크기는 $Fd$($d$: 작용선 사이 거리)다.`,
    body: R`
$\mathbf M_O=(\mathbf r_1-\mathbf r_O)\times\mathbf F+(\mathbf r_2-\mathbf r_O)\times(-\mathbf F)=(\mathbf r_1-\mathbf r_2)\times\mathbf F$ — $\mathbf r_O$가 지워집니다.
$\lvert(\mathbf r_1-\mathbf r_2)\times\mathbf F\rvert=\lVert\mathbf r_1-\mathbf r_2\rVert F\sin\phi$이고 $\lVert\mathbf r_1-\mathbf r_2\rVert\sin\phi$는 두 작용선 사이의 수직 거리 $d$입니다.`,
    note: R`우력은 어디에 그려도 같은 효과를 내는 **자유 벡터**입니다. 그래서 굽힘 모멘트 선도에서 우력은 작용점이 아니라 모멘트의 계단으로만 나타납니다(7단원).` },
  { ch: 'ch01', id: 'twoForce', title: '2력 부재의 힘은 부재 축을 따른다', keys: ['2력 부재의 힘'],
    tags: 'two-force member truss axial 2력 부재 트러스 축력',
    stmt: R`두 점 $A,B$에서만 힘을 받는 물체가 평형이면 $\mathbf F_B=-\mathbf F_A$이고 두 힘은 직선 $AB$ 위에 있다.`,
    body: R`
힘의 평형 $\mathbf F_A+\mathbf F_B=\mathbf 0$. $A$에 대한 모멘트 평형 $\mathbf r_{B/A}\times\mathbf F_B=\mathbf 0$이므로 $\mathbf F_B\parallel\mathbf r_{B/A}$. 따라서 두 힘은 $AB$ 방향이고 크기가 같으며 방향이 반대입니다(인장 또는 압축).`,
    note: R`부재가 곧을 필요는 없습니다. 굽은 2력 부재도 힘은 두 끝점을 잇는 직선을 따르고, 부재 안에는 굽힘 모멘트가 생깁니다.` },
  // ───── 02
  { ch: 'ch02', id: 'centric', title: '고른 응력의 합력은 도심을 지난다', keys: ['평균 수직 응력'], src: '강의 슬라이드 · Lecture 1 A',
    tags: 'centric loading centroid uniform stress 중심 하중 도심 균일 응력',
    stmt: R`단면 위의 수직 응력이 균일($\sigma$)하면 합력 $P=\sigma A$의 작용선은 단면의 도심을 지난다. 거꾸로, 균일 분포가 되려면 하중이 도심을 지나야 한다.`,
    body: R`
합력: $P=\int_A\sigma\,dA=\sigma A$. 도심을 원점으로 잡은 모멘트: $M_y=\int_Az\sigma\,dA=\sigma\int_Az\,dA=0$, $M_z=-\int_Ay\sigma\,dA=0$($\int ydA=\int zdA=0$이 도심의 정의).
따라서 균일 응력은 도심에 작용하는 힘 하나와 같습니다. 하중이 도심에서 벗어나면 모멘트가 남으므로 응력은 균일할 수 없고, 8단원의 편심 하중처럼 $P/A$에 굽힘 응력이 더해집니다.`,
    note: R`$\sigma=P/A$가 “평균”인 이유: 어떤 분포든 $\int\sigma dA=P$이므로 단면 평균은 늘 $P/A$입니다. 분포가 **고르다**는 것은 도심 하중과 생브낭 원리(하중점에서 떨어진 단면)가 추가로 필요합니다.` },
  { ch: 'ch02', id: 'doubleShear', title: '이중 전단 핀의 전단력은 하중의 절반', keys: ['평균 전단 응력'],
    tags: 'double shear pin bolt 이중 전단 핀 볼트',
    stmt: R`가운데 판이 하중 $P$를 받고 양쪽 판이 핀으로 잡으면 핀의 두 전단면이 각각 $V=P/2$를 받고 $\tau_{\text{ave}}=P/(2A)$이다.`,
    body: R`
핀을 두 전단면에서 잘라 가운데 토막의 자유물체도를 그립니다. 가운데 판이 핀을 $P$로 밀고, 두 절단면에서 전단력 $V_1,V_2$가 반대로 받습니다: $V_1+V_2=P$.
배치가 대칭이면 $V_1=V_2=P/2$. 한 면의 평균 전단 응력은 $V/A=P/(2A)$.`,
    note: R`대칭이 아니면(양쪽 판의 강성이 다르면) 두 면의 몫이 달라질 수 있지만, 설계에서는 보통 대칭으로 봅니다.` },
  { ch: 'ch02', id: 'shearSym', title: '전단 응력의 대칭 τxy = τyx', keys: ['전단 응력의 대칭'], src: '강의 슬라이드 · Lecture 1 B',
    tags: 'symmetry of shear stress moment equilibrium element 전단 응력 대칭 요소 모멘트 평형 텐서',
    stmt: R`한 점의 응력 성분은 $\tau_{xy}=\tau_{yx}$, $\tau_{yz}=\tau_{zy}$, $\tau_{zx}=\tau_{xz}$를 만족한다.`,
    body: R`
변 $\Delta x,\Delta y,\Delta z$인 요소의 $z$축(중심)에 대한 모멘트를 봅니다.
- 수직 응력의 힘은 마주 보는 면에서 같은 작용선(중심을 지남) → 모멘트 0.
- $x$면의 전단력 $\tau_{xy}\Delta y\Delta z$ 두 개는 팔 $\Delta x$의 우력: $\tau_{xy}\Delta y\Delta z\Delta x$.
- $y$면의 전단력 $\tau_{yx}\Delta x\Delta z$ 두 개는 팔 $\Delta y$의 반대 우력: $-\tau_{yx}\Delta x\Delta z\Delta y$.
합이 0(정적) 또는 $I\alpha$(동적)입니다. 요소의 회전 관성은 $\rho\Delta x\Delta y\Delta z(\Delta x^2+\Delta y^2)/12$라 $\Delta^5$ 차수, 우력은 $\Delta^3$ 차수이므로 $\Delta\to0$에서 $\tau_{xy}-\tau_{yx}=0$.
다른 두 쌍도 같은 방법(각각 $x$축, $y$축에 대한 모멘트)으로 얻습니다.`,
    note: R`이 성질 덕분에 응력 행렬이 대칭이고 독립 성분이 여섯 개입니다. 9단원의 보 전단 응력(수평면의 전단 = 단면의 전단)과 6단원의 전단 흐름이 모두 이 대칭에 기댑니다.` },
  { ch: 'ch02', id: 'oblique', title: '축하중 봉의 경사면 응력', keys: ['경사면의 수직 응력과 전단 응력'], src: '강의 슬라이드 · Lecture 1 C',
    tags: 'oblique plane axial loading maximum shear 45 degrees 경사면 축하중 최대 전단',
    stmt: R`단면적 $A_0$인 봉이 축하중 $P$를 받을 때, 법선이 축과 $\theta$인 면에서 $\sigma_\theta=\sigma_0\cos^2\theta$, $\tau_\theta=\sigma_0\sin\theta\cos\theta$ ($\sigma_0=P/A_0$). 최대 전단은 $\theta=45°$에서 $\sigma_0/2$.`,
    body: R`
경사면으로 자른 한쪽 조각의 평형에서 경사면의 합력은 축 방향 $P$입니다. 법선 성분 $F=P\cos\theta$, 면 방향 성분 $V=P\sin\theta$.
경사면의 넓이: 단면 $A_0$를 법선이 $\theta$ 기운 면에 비스듬히 투영하면 $A_\theta=A_0/\cos\theta$.
$\sigma_\theta=F/A_\theta=\sigma_0\cos^2\theta$, $\tau_\theta=V/A_\theta=\sigma_0\sin\theta\cos\theta=\tfrac{\sigma_0}2\sin2\theta$.
$\tau_\theta$는 $2\theta=90°$에서 최대이고 그 면의 수직 응력도 $\sigma_0\cos^245°=\sigma_0/2$입니다.`,
    note: R`12단원의 변환 공식에서 $\sigma_y=\tau_{xy}=0$으로 둔 경우와 같습니다. 모어 원으로 보면 원점과 $\sigma_0$을 지름으로 하는 원입니다.` },
  { ch: 'ch02', id: 'fsMin', title: '여러 부재가 있을 때 허용 하중은 최솟값', keys: ['안전 계수'], src: '강의 슬라이드 · Lecture 1 C (Example 2)',
    tags: 'factor of safety allowable load design governing member 안전 계수 허용 하중 설계',
    stmt: R`하중 $P$에 비례하는 응력 $\sigma_i=c_iP$를 받는 부재들이 각각 허용 응력 $\sigma_{\text{all},i}$를 가지면, 구조의 허용 하중은 $P_{\text{all}}=\min_i\sigma_{\text{all},i}/c_i$이다.`,
    body: R`
모든 부재가 안전하려면 모든 $i$에서 $c_iP\le\sigma_{\text{all},i}$, 곧 $P\le\sigma_{\text{all},i}/c_i$. 모든 부등식을 동시에 만족하는 $P$의 최댓값은 우변들의 최솟값입니다. 그 최솟값을 주는 부재가 설계를 **지배**합니다.`,
    note: R`응력이 하중에 비례한다는 것(선형)이 전제입니다. 좌굴처럼 비선형인 파손은 안전 계수를 하중에 적용해야 합니다(15단원).` },
  // ───── 03
  { ch: 'ch03', id: 'strainDisp', title: '변형률-변위 관계의 유도', keys: ['변형률-변위 관계', '수직 변형률', '전단 변형률'], src: '강의 슬라이드 · Lecture 2 A',
    tags: 'strain displacement small deformation Taylor 변형률 변위 미소 변형 테일러',
    stmt: R`매끄러운 변위장 $(u,v)$와 작은 변위 기울기에서 $\varepsilon_x=\partial u/\partial x$, $\varepsilon_y=\partial v/\partial y$, $\gamma_{xy}=\partial u/\partial y+\partial v/\partial x$.`,
    body: R`
$A=(x,y)$에서 $B=(x+dx,y)$, $D=(x,y+dy)$로 가는 미소 선분을 봅니다. 1차 테일러 전개로 변형 후 벡터는
$$\overrightarrow{A'B'}=\big((1+u_x)dx,\ v_xdx\big),\qquad\overrightarrow{A'D'}=\big(u_ydy,\ (1+v_y)dy\big).$$
**수직 변형률**: $\lvert A'B'\rvert=dx\sqrt{1+2u_x+u_x^2+v_x^2}=dx(1+u_x+O(\text{2차}))$이므로 $\varepsilon_x=u_x$. 같은 방법으로 $\varepsilon_y=v_y$.
**전단 변형률**: $A'B'$가 $x$축과 이루는 각 $\alpha=\arctan\frac{v_x}{1+u_x}\approx v_x$, $A'D'$가 $y$축과 이루는 각 $\beta\approx u_y$. 원래 직각이던 각이 $\tfrac\pi2-\alpha-\beta$가 되므로 $\gamma_{xy}=u_y+v_x$.
2차 항을 버린 것이 **미소 변형** 가정입니다($\lvert u_x\rvert,\lvert v_x\rvert,\dots\ll1$).`,
    note: R`강체 회전 $u=-\omega y$, $v=\omega x$를 넣으면 세 변형률이 모두 0 — 이 식이 순수 회전을 변형으로 잘못 세지 않는다는 확인입니다(단, 작은 $\omega$에서만. 큰 회전에는 비선형 변형률 측도가 필요합니다).` },
  { ch: 'ch03', id: 'tensorStrain', title: '방향 변형률과 텐서 전단 변형률', keys: ['텐서 변형률과 공학 변형률'], src: '강의 슬라이드 · Lecture 2 A',
    tags: 'tensor strain engineering shear strain directional strain 텐서 변형률 공학 전단 변형률',
    stmt: R`단위 방향 $\mathbf n=(\cos\theta,\sin\theta)$로 놓인 미소 선분의 수직 변형률은 $\varepsilon_n=\mathbf n^T[\varepsilon]\mathbf n=\varepsilon_x\cos^2\theta+\varepsilon_y\sin^2\theta+\gamma_{xy}\sin\theta\cos\theta$이고, 여기서 $[\varepsilon]$의 비대각 성분은 $\gamma_{xy}/2$이다.`,
    body: R`
길이 $ds$, 방향 $\mathbf n$인 선분의 끝의 상대 변위는 $d\mathbf u=(\nabla\mathbf u)\mathbf n\,ds$(1차). 늘어난 길이는 그 $\mathbf n$ 방향 성분 $\mathbf n^T(\nabla\mathbf u)\mathbf n\,ds$이므로
$$\varepsilon_n=\mathbf n^T(\nabla\mathbf u)\mathbf n=\mathbf n^T\tfrac12(\nabla\mathbf u+\nabla\mathbf u^T)\mathbf n$$
(이차형식에서는 반대칭 부분이 기여하지 않음: $\mathbf n^TW\mathbf n=0$). 대칭 부분이 $[\varepsilon]=\begin{pmatrix}u_x&\tfrac12(u_y+v_x)\\\tfrac12(u_y+v_x)&v_y\end{pmatrix}$, 비대각이 $\gamma_{xy}/2$.
전개하면 $\varepsilon_n=u_x\cos^2\theta+v_y\sin^2\theta+2\cdot\tfrac{\gamma_{xy}}2\sin\theta\cos\theta$.`,
    note: R`좌표를 $Q$로 돌리면 $[\varepsilon']=Q^T[\varepsilon]Q$ — 응력 행렬과 똑같은 규칙입니다. 비대각에 $\gamma$를 그대로 넣은 행렬은 이 규칙을 따르지 않습니다. 12단원 로제트 식의 출발점이 바로 이 결과입니다.` },
  // ───── 04
  { ch: 'ch04', id: 'trueStress', title: '진응력과 진변형률', keys: ['진응력과 진변형률'], src: '강의 슬라이드 · Lecture 3 A',
    tags: 'true stress true strain engineering stress volume constancy necking 진응력 진변형률 공칭 부피 불변',
    stmt: R`소성 변형에서 부피가 일정하면 $\sigma_t=\sigma(1+\varepsilon)$, $\varepsilon_t=\ln(1+\varepsilon)$.`,
    body: R`
진변형률은 매 순간 길이에 대한 늘어남의 합: $\varepsilon_t=\int_{L_0}^LdL/L=\ln(L/L_0)=\ln(1+\varepsilon)$.
$AL=A_0L_0$이면 $A=A_0/(1+\varepsilon)$, 따라서 $\sigma_t=P/A=(P/A_0)(1+\varepsilon)=\sigma(1+\varepsilon)$.
작은 $\varepsilon$에서 $\ln(1+\varepsilon)=\varepsilon-\varepsilon^2/2+\cdots\approx\varepsilon$이라 탄성 범위에서는 두 척도가 같습니다.`,
    note: R`넥킹 이후에는 변형이 국부에 몰려 표점 거리 평균 $\varepsilon$로 넥킹부 단면을 알 수 없으므로, 진응력은 넥킹부 단면을 직접 재서 구합니다.` },
  { ch: 'ch04', id: 'unload', title: '하중 제거 후의 영구 변형', keys: ['하중 제거 경로'], src: '강의 슬라이드 · Lecture 3 A',
    tags: 'unloading permanent set elastic recovery strain hardening 하중 제거 영구 변형 탄성 회복 변형 경화',
    stmt: R`항복 후의 점 $(\varepsilon_1,\sigma_1)$에서 하중을 빼면 기울기 $E$로 내려와 영구 변형률 $\varepsilon_1-\sigma_1/E$가 남는다.`,
    body: R`
금속의 소성 변형은 결정의 미끄럼(전위 이동)이고, 하중을 빼는 동안에는 새 미끄럼이 일어나지 않습니다. 그래서 되돌아오는 부분은 원자 간 결합의 탄성 변형뿐이고 그 강성은 처음과 같은 $E$입니다. 응력이 $\sigma_1$에서 0으로 줄 때 회복되는 변형률은 $\sigma_1/E$이므로 남는 변형은 $\varepsilon_1-\sigma_1/E$.
다시 하중을 걸면 같은 직선을 올라가 $\sigma_1$에서야 다시 미끄럼이 시작되므로 항복 응력이 $\sigma_1$로 높아진 것처럼 보입니다(변형 경화).`,
    note: R`반대 방향(압축)으로 다시 하중을 걸면 항복 응력이 오히려 낮아지는 바우싱거 효과가 있어, 위 설명은 같은 방향의 재하중에 한정됩니다.` },
  { ch: 'ch04', id: 'poissonVol', title: '단축 인장의 부피 변화', keys: ['포아송 비'], src: '강의 슬라이드 · Lecture 3 B',
    tags: 'Poisson ratio volume change incompressible 포아송 비 부피 변화 비압축',
    stmt: R`단축 인장 $\sigma_x$에서 부피 변화율은 $\Delta V/V=\varepsilon_x(1-2\nu)$이다. 부피가 줄지 않으려면 $\nu\le1/2$.`,
    body: R`
$\varepsilon_y=\varepsilon_z=-\nu\varepsilon_x$. 한 변이 1인 정육면체는 $(1+\varepsilon_x)(1-\nu\varepsilon_x)^2=1+\varepsilon_x(1-2\nu)+O(\varepsilon_x^2)$가 됩니다. 인장($\varepsilon_x>0$)에서 부피가 줄어드는 재료는 없으므로 $1-2\nu\ge0$.`,
    note: R`14단원의 체적 탄성 계수 $k=E/3(1-2\nu)$로 같은 결론이 더 일반적으로 나옵니다.` },
  { ch: 'ch04', id: 'GEshort', title: 'G = E/2(1+ν) (요약)', keys: ['전단 탄성 계수와 E, ν의 관계'],
    tags: 'shear modulus Young modulus Poisson relation 전단 탄성 계수 영률',
    stmt: R`등방성 선형 탄성 재료에서 $G=E/[2(1+\nu)]$.`,
    body: R`
순수 전단 $\tau$는 45° 방향의 인장 $\tau$·압축 $-\tau$와 같은 상태입니다. 45° 방향 변형률을 두 방법으로 쓰면 주축의 훅 법칙으로 $(1+\nu)\tau/E$, 원래 축의 전단 변형률로 $\gamma/2=\tau/(2G)$. 같다고 두면 결론. 자세한 과정은 14단원의 유도를 보세요.`,
    note: R`$\nu$가 $0$에서 $1/2$ 사이이므로 $G$는 $E/3$에서 $E/2$ 사이입니다.` },
  // ───── 05
  { ch: 'ch05', id: 'axialDef', title: '축하중 부재의 늘어남', keys: ['축하중 부재의 늘어남'], src: '강의 슬라이드 · Lecture 4 A',
    tags: 'axial deformation PL/AE integral varying area 늘어남 축하중 적분',
    stmt: R`축력 $P(x)$, 단면 $A(x)$, 탄성 계수 $E$인 봉의 늘어남은 $\delta=\int_0^LP(x)/(A(x)E)\,dx$. 일정하면 $PL/(AE)$.`,
    body: R`
위치 $x$의 단면 응력 $\sigma=P(x)/A(x)$(중심 하중, 고른 분포), 훅의 법칙 $\varepsilon=\sigma/E$, 변형률의 정의 $\varepsilon=du/dx$. 따라서 $du/dx=P/(AE)$이고 양끝의 변위 차 $\delta=u(L)-u(0)=\int_0^LP/(AE)\,dx$.
구간별로 일정하면 적분이 합 $\sum P_iL_i/(A_iE_i)$이 됩니다. 힘 → 응력 → 변형률 → 변위의 네 고리를 그대로 이은 것입니다.`,
    note: R`단면이 **천천히** 변할 때만 고른 응력이 좋은 근사입니다. 계단처럼 급변하는 곳 근처는 응력 집중이 있지만 전체 늘어남에는 영향이 작습니다.` },
  { ch: 'ch05', id: 'fixedBar', title: '양끝 고정 봉의 반력', keys: ['부정정 문제의 세 가지 식'], src: '강의 슬라이드 · Lecture 4 B',
    tags: 'statically indeterminate compatibility fixed ends reaction 부정정 적합 조건 양끝 고정',
    stmt: R`양끝이 고정된 균일 봉의 $A$에서 $a$, $B$에서 $b$인 점에 축력 $P$가 $B$ 쪽으로 걸리면 $R_A=Pb/L$, $R_B=Pa/L$.`,
    body: R`
**평형**: $R_A+R_B=P$ (미지수 2, 식 1).
**적합**: 양끝이 고정이므로 전체 늘어남은 0. $AC$ 구간은 인장 $R_A$(늘어남 $R_Aa/AE$), $CB$ 구간은 압축 $R_B$(줄어듦 $R_Bb/AE$)이라 $R_Aa-R_Bb=0$.
**연립**: $R_A=R_Bb/a$를 평형에 넣으면 $R_B(a+b)/a=P$, $R_B=Pa/L$, $R_A=Pb/L$.`,
    note: R`가까운 벽이 더 많이 받는 것은 짧은 구간이 더 뻣뻣하기($AE/a$) 때문입니다. 6단원의 양끝 고정 축도 같은 식입니다.` },
  { ch: 'ch05', id: 'thermal', title: '구속된 봉의 열응력', keys: ['열변형률과 구속된 봉의 열응력'], src: '강의 슬라이드 · Lecture 4 C',
    tags: 'thermal stress thermal strain restrained bar superposition 열응력 열변형률 구속',
    stmt: R`양끝이 고정된 균일 봉의 온도가 $\Delta T$ 변하면 $\sigma=-E\alpha\Delta T$.`,
    body: R`
한쪽 지점을 떼면 봉은 응력 없이 $\delta_T=\alpha\Delta TL$ 늘어납니다. 지점의 반력 $R$(압축)을 다시 걸면 $\delta_R=-RL/(AE)$. 원래 지점이 움직이지 않으므로 $\delta_T+\delta_R=0$, $R=EA\alpha\Delta T$, $\sigma=-R/A=-E\alpha\Delta T$.
같은 결과를 변형률로 쓰면: 전체 변형률 $\varepsilon=\sigma/E+\alpha\Delta T$가 0이어야 하므로 $\sigma=-E\alpha\Delta T$.`,
    note: R`틈 $g$가 있으면 적합 조건이 $\delta_T+\delta_R=g$($\delta_T>g$일 때)로 바뀝니다.` },
  // ───── 06
  { ch: 'ch06', id: 'torsionKin', title: '원형 축 비틀림의 변형률', keys: ['비틀림의 전단 변형률'], src: '강의 슬라이드 · Lecture 5 A, B',
    tags: 'torsion kinematics plane sections symmetry shear strain 비틀림 평면 단면 대칭 전단 변형률',
    stmt: R`원형 축의 단면이 강체처럼 돌고 반지름이 곧게 남으면, 길이 $L$에서 끝이 $\phi$ 돌 때 반지름 $\rho$의 전단 변형률은 $\gamma=\rho\phi/L$.`,
    body: R`
**가정의 근거(대칭).** 원형 축은 축에 대한 회전 대칭이 있고, 축에 수직인 직선을 중심으로 180° 뒤집어도 같은 문제(양끝 토크가 바뀌어도 같은 크기)입니다. 단면이 한쪽으로 불룩해진다면 뒤집은 모양과 원래 모양이 달라 모순이고, 반지름이 한쪽으로 휜다면 역시 모순입니다.
**기하.** 표면(반지름 $\rho$)의 축방향 선분 $AB$는 비틀린 뒤 $AB'$가 됩니다. 호 $BB'$의 길이를 옆면에서 보면 $L\gamma$(작은 각), 끝단에서 보면 $\rho\phi$. 같으므로 $\gamma=\rho\phi/L$.`,
    note: R`정사각형 단면은 90° 회전 대칭만 있어 단면이 뒤틀립니다(warping). 그래서 비원형 축에는 이 단원의 공식을 쓰지 않습니다.` },
  { ch: 'ch06', id: 'torsionFormula', title: '비틀림 공식과 비틀림 각', keys: ['비틀림 공식', '비틀림 각'], src: '강의 슬라이드 · Lecture 5 B',
    tags: 'torsion formula angle of twist polar moment of inertia 비틀림 공식 비틀림 각 극관성 모멘트',
    stmt: R`탄성 범위에서 $\tau=T\rho/J$, $\phi=TL/(JG)$. $J=\pi c^4/2$(속찬), $\tfrac\pi2(c_2^4-c_1^4)$(속 빈).`,
    body: R`
$\gamma=\rho\phi/L$과 $\tau=G\gamma$에서 $\tau=G\rho\phi/L$. 단면 위 응력의 모멘트 합이 토크:
$$T=\int_A\rho\tau\,dA=\frac{G\phi}{L}\int_A\rho^2dA=\frac{G\phi}{L}J.$$
따라서 $\phi=TL/(JG)$, 다시 넣어 $\tau=T\rho/J$.
$J$: 두께 $d\rho$의 고리 넓이 $2\pi\rho\,d\rho$로 $\int_0^c\rho^2\,2\pi\rho\,d\rho=\pi c^4/2$. 속 빈 축은 $c_1$부터 적분.`,
    note: R`$\tau_{\max}=Tc/J=2T/(\pi c^3)$(속찬). 비틀림 강성 $JG/L$은 축방향 강성 $AE/L$의 짝입니다.` },
  { ch: 'ch06', id: 'power', title: '회전축의 동력 P = Tω', keys: ['동력과 토크'], src: '강의 슬라이드 · Lecture 5 B',
    tags: 'power torque angular velocity transmission shaft 동력 토크 각속도 전동축',
    stmt: R`토크 $T$로 각속도 $\omega$로 도는 축이 전달하는 동력은 $P=T\omega=2\pi fT$.`,
    body: R`
토크 $T$가 미소 각 $d\theta$만큼 돌리며 하는 일은 $dW=T\,d\theta$(원주에 걸린 힘 $F=T/r$이 호 $r\,d\theta$를 움직임). 동력은 $P=dW/dt=T\,d\theta/dt=T\omega$. $\omega=2\pi f$.`,
    note: R`단위: $T$[N·m] × $\omega$[rad/s] = W. rpm이면 $\omega=2\pi n/60$을 먼저 계산합니다.` },
  { ch: 'ch06', id: 'bredt', title: '얇은 폐단면의 전단 흐름 (브레트 공식)', keys: ['전단 흐름과 브레트 공식'], src: '강의 슬라이드 · Lecture 5 D',
    tags: 'thin-walled closed section shear flow Bredt 얇은 폐단면 전단 흐름 브레트',
    stmt: R`얇은 폐단면에서 $q=\tau t$는 벽을 따라 일정하고 $T=2qA$($A$: 중심선이 둘러싼 넓이). 비틀림 각은 $\phi=\frac{TL}{4A^2G}\oint\frac{ds}t$.`,
    body: R`
**$q$ 일정.** 벽에서 축방향 길이 $\Delta x$, 벽을 따라 두 점 $a,b$ 사이 조각의 축방향 평형: 두 가로 절단면의 전단 응력(대칭으로 축방향 성분)이 $\tau_at_a\Delta x=\tau_bt_b\Delta x$. 벽 안팎 면은 자유 표면이라 축방향 힘이 없습니다.
**토크.** 중심선 요소 $ds$의 힘 $q\,ds$가 점 $O$에 대해 $q\,p\,ds$($p$: 작용선까지 거리)의 모멘트. $p\,ds$는 $O$와 $ds$가 만드는 삼각형 넓이의 두 배이므로 $T=q\oint p\,ds=2qA$.
**각.** 변형 에너지 $\tfrac12T\phi=\int\frac{\tau^2}{2G}dV=\oint\frac{q^2}{2Gt^2}t\,ds\,L=\frac{q^2L}{2G}\oint\frac{ds}t$에 $q=T/(2A)$를 넣으면 결과.`,
    note: R`원형 관이면 $A=\pi r_m^2$, $\tau=T/(2\pi r_m^2t)$로, 두께가 얇을 때 비틀림 공식과 같아집니다.` },
  // ───── 07
  { ch: 'ch07', id: 'distRes', title: '분포하중을 합력으로 바꾸기', keys: ['분포하중의 합력'], src: '강의 슬라이드 · Lecture 6 B',
    tags: 'distributed load resultant centroid area 분포하중 합력 도심 넓이',
    stmt: R`분포하중 $w(x)$는 평형 계산에서 크기 $W=\int w\,dx$, 작용점 $\bar x=\int xw\,dx/W$인 집중하중과 같다.`,
    body: R`
두 하중계가 같은 합력과 같은 모멘트(어느 한 점에 대해)를 주면 강체 평형에서 구별되지 않습니다.
합력: 미소 하중 $w\,dx$의 합 $W=\int w\,dx$(하중 선도의 넓이).
원점에 대한 모멘트: $\int xw\,dx$. 한 점 $\bar x$에 $W$를 두어 같은 모멘트가 되려면 $W\bar x=\int xw\,dx$ — 하중 선도의 도심.
균일: $\bar x$는 가운데. 삼각형(0에서 $w_0$): $W=w_0L/2$, $\bar x=\tfrac1W\int_0^Lx\cdot w_0x/L\,dx=2L/3$(큰 쪽에서 $L/3$).`,
    note: R`“강체 평형에서 같다”가 핵심입니다. 보 안의 $V$, $M$ 분포나 처짐은 원래 분포하중으로 계산해야 합니다.` },
  { ch: 'ch07', id: 'dVdM', title: '하중-전단력-모멘트의 미분 관계', keys: ['하중-전단력-모멘트 관계'], src: '강의 슬라이드 · Lecture 6 C',
    tags: 'shear force bending moment distributed load differential relation 전단력 굽힘 모멘트 미분 관계',
    stmt: R`분포하중 $w$(아래 양)가 걸린 구간에서 $dV/dx=-w$, $dM/dx=V$.`,
    body: R`
길이 $\Delta x$ 요소: 왼쪽 면 $V$(위), $M$(시계), 오른쪽 면 $V+\Delta V$(아래), $M+\Delta M$(반시계), 하중 $w\Delta x$(아래, 가운데).
**수직 평형**: $V-(V+\Delta V)-w\Delta x=0\Rightarrow\Delta V/\Delta x=-w$.
**오른쪽 면에 대한 모멘트**(반시계 +): $(M+\Delta M)-M-V\Delta x+w\Delta x\cdot\tfrac{\Delta x}2=0\Rightarrow\Delta M/\Delta x=V-\tfrac w2\Delta x$.
$\Delta x\to0$이면 두 관계. 적분하면 $V_D-V_C=-\int_C^Dw\,dx$, $M_D-M_C=\int_C^DV\,dx$.`,
    note: R`$w$가 요소 안에서 변해도 합력은 $\bar w\Delta x$, 팔은 $O(\Delta x)$라 결론은 같습니다.` },
  { ch: 'ch07', id: 'jumps', title: '집중하중과 우력이 만드는 계단', keys: ['집중하중과 우력에서의 불연속'], src: '강의 슬라이드 · Lecture 6 C',
    tags: 'concentrated load couple jump discontinuity shear moment diagram 집중하중 우력 불연속 계단',
    stmt: R`아래로 향하는 집중하중 $P$에서 $V$는 $P$만큼 줄고, 시계 방향 우력 $M_0$에서 $M$은 $M_0$만큼 늘어난다.`,
    body: R`
하중점 $x_0$를 좁게 감싸는 요소 $[x_0^-,x_0^+]$(길이 $\to0$)의 평형.
수직: $V(x_0^-)-V(x_0^+)-P=0\Rightarrow V(x_0^+)=V(x_0^-)-P$.
모멘트(반시계 +, 우력은 시계라 $-M_0$): $M(x_0^+)-M(x_0^-)-M_0+(\text{팔}\to0\text{인 항})=0\Rightarrow M(x_0^+)=M(x_0^-)+M_0$.
집중하중은 모멘트에 계단을 만들지 않고(팔이 0), 우력은 전단력에 계단을 만들지 않습니다(합력이 0).`,
    note: R`특이 함수로 보면 $w$에 $P\langle x-x_0\rangle^{-1}$(델타)가 들어가 적분한 $V$에 계단 $\langle x-x_0\rangle^0$이 생기는 것과 같습니다.` },
  { ch: 'ch07', id: 'singular', title: '특이 함수의 적분 규칙', keys: ['특이 함수의 적분'], src: '강의 슬라이드 · Lecture 6 D',
    tags: 'singularity function Macaulay bracket integration Dirac delta 특이 함수 매콜리 괄호 적분 디랙 델타',
    stmt: R`$n\ge0$이면 $\int_{-\infty}^x\langle t-a\rangle^ndt=\dfrac{\langle x-a\rangle^{n+1}}{n+1}$. $\langle x-a\rangle^{-1}$의 적분은 $\langle x-a\rangle^0$, $\langle x-a\rangle^{-2}$의 적분은 $\langle x-a\rangle^{-1}$.`,
    body: R`
$x<a$이면 적분 구간 전체에서 함수가 0이라 적분도 0 $=\langle x-a\rangle^{n+1}/(n+1)$.
$x\ge a$이면 $\int_a^x(t-a)^ndt=(x-a)^{n+1}/(n+1)$.
$n=-1$은 $x=a$의 단위 충격(넓이 1)이므로 적분은 $x<a$에서 0, $x>a$에서 1 — 단위 계단 $\langle x-a\rangle^0$. $n=-2$(이중극)는 적분이 델타가 되도록 정의한 것입니다.`,
    note: R`적분 상수를 $-\infty$(보의 왼쪽 끝 바깥)부터 적분한 값으로 두면, 왼쪽 끝의 반력만 항으로 넣고 나머지 상수는 경계 조건으로 정하면 됩니다.` },
  // ───── 08
  { ch: 'ch08', id: 'bendStrain', title: '순수 굽힘의 선형 변형률', keys: ['굽힘의 변형률'], src: '강의 슬라이드 · Lecture 7 A',
    tags: 'pure bending plane sections neutral surface curvature strain 순수 굽힘 평면 단면 중립면 곡률',
    stmt: R`순수 굽힘에서 평면 단면이 평면으로 남으면 $\varepsilon_x=-y/\rho$($y$: 중립면에서의 거리, 위가 양).`,
    body: R`
$M$이 일정하면 모든 단면이 같은 상태이므로 보는 원호로 휩니다(대칭에서, 단면이 평면이고 휜 축에 수직). 곡률 중심에서 보면 두 단면 사이의 각이 $\theta$일 때 중립면(길이 불변)의 길이 $\rho\theta$, 중립면에서 $y$ 위(곡률 중심 쪽) 섬유의 길이 $(\rho-y)\theta$.
$\varepsilon_x=\dfrac{(\rho-y)\theta-\rho\theta}{\rho\theta}=-\dfrac y\rho$.`,
    note: R`중립면의 **위치**는 이 단계에서 정해지지 않습니다. 다음 유도에서 축력이 0이라는 조건이 그것을 도심으로 정합니다.` },
  { ch: 'ch08', id: 'flexure', title: '굽힘 공식과 곡률', keys: ['굽힘 공식과 곡률'], src: '강의 슬라이드 · Lecture 7 A',
    tags: 'flexure formula neutral axis centroid moment of inertia curvature 굽힘 공식 중립축 도심 단면 2차 모멘트 곡률',
    stmt: R`선형 탄성 순수 굽힘에서 중립축은 도심을 지나고 $1/\rho=M/(EI)$, $\sigma_x=-My/I$.`,
    body: R`
$\sigma_x=E\varepsilon_x=-Ey/\rho$.
축력 0: $\int\sigma_xdA=-\tfrac E\rho\int y\,dA=0\Rightarrow\int y\,dA=0$ — $y$의 원점(중립축)이 도심.
모멘트: 단면의 합모멘트 $\int(-y)\sigma_xdA=\tfrac E\rho\int y^2dA=\tfrac{EI}\rho=M$.
따라서 $1/\rho=M/(EI)$, $\sigma_x=-Ey/\rho=-My/I$. 최대 크기는 $Mc/I=M/S$.`,
    note: R`$\int yz\,dA=0$(주축)이라야 $z$축 모멘트가 $y$축 방향 굽힘만 만듭니다. 대칭 단면은 자동으로 주축입니다. 그렇지 않으면 비대칭 굽힘(같은 단원)이 됩니다.` },
  { ch: 'ch08', id: 'parallelAxis', title: '단면 2차 모멘트와 평행축 정리', keys: ['기본 단면의 2차 모멘트와 평행축 정리'], src: '강의 슬라이드 · Lecture 7 A (Useful Formula)',
    tags: 'second moment of area parallel axis theorem rectangle circle 단면 2차 모멘트 평행축 정리 직사각형 원',
    stmt: R`$I_{\text{직사각형}}=bh^3/12$, $I_{\text{원}}=\pi c^4/4$, 그리고 도심에서 $d$ 떨어진 평행축에 대해 $I=\bar I+Ad^2$.`,
    body: R`
직사각형: $\int_{-h/2}^{h/2}y^2\,b\,dy=b\,[y^3/3]_{-h/2}^{h/2}=bh^3/12$.
원: 극관성 모멘트 $J=\int\rho^2dA=\pi c^4/2$(6단원)이고 $\rho^2=y^2+z^2$, 대칭으로 $I_y=I_z$이므로 $I=J/2=\pi c^4/4$.
평행축: $y=\bar y'+d$로 쓰면 $\int y^2dA=\int\bar y'^2dA+2d\int\bar y'dA+d^2A=\bar I+0+Ad^2$(도심에서 1차 모멘트가 0).`,
    note: R`$Ad^2$ 항이 늘 양이라 도심축에 대한 $I$가 모든 평행축 중 최소입니다. 동역학의 질량 관성 모멘트 평행축 정리와 증명이 같습니다.` },
  { ch: 'ch08', id: 'transformed', title: '합성 보의 환산 단면', keys: ['환산 단면법'],
    tags: 'composite beam transformed section modular ratio 합성 보 환산 단면 탄성 계수비',
    stmt: R`두 재료($E_1$, $E_2=nE_1$)로 된 보에서 재료 2의 폭을 $n$배로 한 환산 단면의 도심이 중립축이고, $\sigma_1=-My/I_T$, $\sigma_2=-nMy/I_T$.`,
    body: R`
평면 단면 가정은 재료와 무관하므로 $\varepsilon_x=-y/\rho$가 단면 전체에서 성립합니다. 응력은 재료마다 $\sigma_1=-E_1y/\rho$, $\sigma_2=-nE_1y/\rho$.
축력 0: $\int_{A_1}y\,dA+n\int_{A_2}y\,dA=0$ — 재료 2의 넓이를 $n$배(폭 방향)로 늘린 단면의 1차 모멘트가 0, 곧 환산 단면의 도심.
모멘트: $M=\tfrac{E_1}\rho\big(\int_{A_1}y^2dA+n\int_{A_2}y^2dA\big)=\tfrac{E_1I_T}\rho$. 따라서 $\sigma_1=-My/I_T$, $\sigma_2=n\sigma_1$(같은 $y$).`,
    note: R`폭만 바꾸고 높이는 그대로 두어야 각 부분의 $y$가 유지됩니다.` },
  { ch: 'ch08', id: 'eccentric', title: '편심 하중과 단면 핵', keys: ['편심 축하중'],
    tags: 'eccentric axial load kern superposition 편심 하중 단면 핵 중첩',
    stmt: R`도심에서 $e$ 떨어진 압축 $P$는 $\sigma=-P/A\mp Pec/I$를 만들고, 직사각형(높이 $h$)에서 인장이 생기지 않을 조건은 $e\le h/6$.`,
    body: R`
$P$를 도심으로 옮기면 $P$와 우력 $Pe$(1단원). 두 효과를 중첩: $\sigma=-\dfrac PA-\dfrac{Pe\,y}{I}$ (하중 쪽 $y>0$).
하중 반대편 끝($y=-h/2$)에서 $\sigma=-\tfrac PA+\tfrac{Pe(h/2)}{bh^3/12}=\tfrac PA\big(-1+\tfrac{6e}h\big)$. 인장이 없으려면 $6e/h\le1$.`,
    note: R`2축 편심이면 직사각형 단면의 핵은 대각선이 $h/3$, $b/3$인 마름모입니다. 석조 기둥 설계의 고전 규칙입니다.` },
  { ch: 'ch08', id: 'unsym', title: '비대칭 굽힘의 중립축', keys: ['비대칭 굽힘'],
    tags: 'unsymmetric bending neutral axis angle principal axes 비대칭 굽힘 중립축 주축',
    stmt: R`주축 $y,z$에 대해 모멘트 벡터가 $z$축과 $\theta$이면 $\sigma_x=-M_zy/I_z+M_yz/I_y$이고 중립축은 $z$축과 $\tan\phi=(I_z/I_y)\tan\theta$인 각을 이룬다.`,
    body: R`
$M_z=M\cos\theta$, $M_y=M\sin\theta$로 나누면 각각이 대칭 굽힘이라 응력을 더합니다.
중립축: $\sigma_x=0\iff\dfrac{M\cos\theta}{I_z}y=\dfrac{M\sin\theta}{I_y}z\iff\dfrac yz=\dfrac{I_z}{I_y}\tan\theta$. 이 직선이 $z$축과 이루는 각 $\phi$에서 $\tan\phi=y/z$.`,
    note: R`$I_z>I_y$(세로로 긴 단면)이면 $\phi>\theta$ — 중립축이 약축 쪽으로 더 기웁니다. 최대 응력은 중립축에서 가장 먼 모서리입니다.` },
  );
})();
