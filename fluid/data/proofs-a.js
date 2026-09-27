/* 유도 — Part A·B: 01 유체의 성질 … 08 미분 방정식 */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 01
  { ch: 'ch01', id: 'gasConst', title: '공기의 기체 상수와 비중량', keys: ['밀도와 관련 양'],
    tags: 'density specific weight ideal gas constant 밀도 비중량 비중 이상 기체',
    stmt: R`비중량은 $\gamma=\rho g$이고, 이상 기체의 $p=\rho RT$에서 $R=R_u/M$이다. 공기($M=28.97$ kg/kmol)는 $R=287$ J/(kg·K)이다.`,
    body: R`
부피 $\mathcal V$인 유체의 무게는 $mg=\rho\mathcal Vg$이므로 단위 부피당 무게는 $\gamma=\rho g$입니다. 비중은 같은 부피의 물(4°C, 1000 kg/m³)과의 질량 비 $SG=\rho/\rho_{\text{물}}$로 단위가 없습니다.

이상 기체의 몰 단위 식 $p\mathcal V=nR_uT$($R_u=8314$ J/(kmol·K))에서 $n=m/M$을 넣으면 $p=\dfrac{m}{\mathcal V}\dfrac{R_u}{M}T=\rho RT$, $R=\dfrac{R_u}{M}=\dfrac{8314}{28.97}=287$ J/(kg·K).
예: 101.35 kPa, 20°C 공기 $\rho=101\,350/(287\times293.15)=1.205$ kg/m³.`,
    note: R`온도는 반드시 절대 온도(K)로 넣습니다. 섭씨로 넣으면 밀도가 열 배 넘게 틀립니다.` },
  { ch: 'ch01', id: 'newtonVisc', title: '두 평판 사이에서 속도 분포가 직선인 이유', keys: ['뉴턴의 점성 법칙'],
    tags: 'Newton viscosity Couette linear profile shear 점성 쿠에트 전단',
    stmt: R`아래 판이 정지하고 위 판이 $V$로 움직이는 간격 $h$의 뉴턴 유체에서, 흐름이 정상이고 압력 기울기가 없으면 $u=Vy/h$이고 판을 끄는 힘은 $F=\mu AV/h$이다.`,
    body: R`
두께 $dy$인 유체 층 하나를 봅니다. 정상 흐름이고 층의 속도가 $x$로 변하지 않으므로 가속도가 0이고, 압력 기울기도 없으므로 위아래 면의 전단 응력만 남습니다: $\tau(y+dy)\,A-\tau(y)\,A=0$. 따라서 $\tau$는 $y$에 무관한 상수.
뉴턴 유체 $\tau=\mu\,du/dy$이므로 $du/dy=\tau/\mu$도 상수 → $u$는 $y$의 일차식. 미끄러짐 없음 $u(0)=0$, $u(h)=V$ → $u=Vy/h$.
그러면 $\tau=\mu V/h$, 판을 끄는 힘 $F=\tau A=\mu AV/h$.`,
    note: R`$\mu$의 단위는 $\tau/(du/dy)$ = Pa/(s⁻¹) = Pa·s = kg/(m·s)입니다. 점성 계수 측정 장치(회전 점도계)는 이 관계를 원통 사이에서 씁니다(9단원).` },
  { ch: 'ch01', id: 'reNum', title: '레이놀즈 수는 관성과 점성의 비다', keys: ['레이놀즈 수'],
    tags: 'Reynolds number inertia viscous ratio scaling 레이놀즈 관성 점성 크기 비교',
    stmt: R`길이 척도 $L$, 속도 척도 $V$인 흐름에서 단위 부피당 관성력과 점성력의 크기 비는 $\rho VL/\mu$이다.`,
    body: R`
관성: 유체 입자의 가속도 $\sim V\,\partial V/\partial x\sim V^2/L$ → 단위 부피당 관성력 $\sim\rho V^2/L$.
점성: 응력 $\tau\sim\mu V/L$이 거리 $L$에 걸쳐 변하므로 단위 부피당 알짜 점성력 $\sim\partial\tau/\partial y\sim\mu V/L^2$.
비: $\dfrac{\rho V^2/L}{\mu V/L^2}=\dfrac{\rho VL}\mu=Re$.`,
    note: R`“크기 비교”라 계수는 없습니다. 같은 $Re$라도 관이면 지름, 평판이면 앞전에서의 거리처럼 $L$을 무엇으로 잡는지 함께 말해야 수가 의미를 가집니다.` },
  { ch: 'ch01', id: 'surfTens', title: '물방울의 압력과 모세관 상승', keys: ['표면장력의 두 결과'],
    tags: 'surface tension droplet capillary rise Laplace pressure 표면장력 물방울 모세관',
    stmt: R`반지름 $R$ 물방울의 안팎 압력 차는 $2Y/R$이고, 반지름 $R$ 유리관 속 액체의 상승 높이는 $h=2Y\cos\theta/(\rho gR)$이다.`,
    body: R`
**물방울**: 절반으로 자른 반구를 자유물체로 봅니다. 자른 원판에 안팎 압력 차가 $\Delta p\,\pi R^2$으로 밀어내고, 둘레 $2\pi R$를 따라 표면장력 $Y$가 당깁니다: $\Delta p\,\pi R^2=2\pi RY$ → $\Delta p=2Y/R$.
**모세관**: 올라온 액체 기둥(반지름 $R$, 높이 $h$)을 자유물체로 봅니다. 관 벽과 만나는 둘레에서 표면장력이 벽 방향으로 접촉각 $\theta$만큼 기울어 당기므로 연직 성분 $2\pi RY\cos\theta$. 기둥 위아래는 모두 대기압(메니스커스 아래 곡면 효과는 표면장력 항에 포함). 무게 $\rho g\pi R^2h$와 평형: $h=\dfrac{2Y\cos\theta}{\rho gR}$.`,
    note: R`비누 거품은 막의 안팎 두 면이 있어 $\Delta p=4Y/R$입니다. $\theta>90°$(수은-유리)면 $\cos\theta<0$이라 오히려 내려갑니다.` },
  { ch: 'ch01', id: 'streamlineEq', title: '유선의 방정식과 한 예', keys: ['유선의 방정식'],
    tags: 'streamline tangent velocity field hyperbola 유선 접선 속도장',
    stmt: R`유선은 모든 점에서 속도에 접하는 곡선이므로 $\dfrac{dx}u=\dfrac{dy}v=\dfrac{dz}w$를 만족한다. 예를 들어 $u=Kx$, $v=-Ky$의 유선은 쌍곡선 $xy=$ 상수다.`,
    body: R`
유선 위의 작은 변위 $d\mathbf r=(dx,dy,dz)$가 $\mathbf V$와 평행하면 $d\mathbf r\times\mathbf V=\mathbf 0$:
$v\,dz-w\,dy=0,\ w\,dx-u\,dz=0,\ u\,dy-v\,dx=0$ → $\dfrac{dx}u=\dfrac{dy}v=\dfrac{dz}w$.
예: $\dfrac{dx}{Kx}=\dfrac{dy}{-Ky}$ → $\ln x=-\ln y+C$ → $xy=$ 상수.`,
    note: R`비정상 흐름에서 유선은 한 순간의 그림이고, 입자가 실제로 지나간 경로선과 다를 수 있습니다. 정상 흐름에서는 둘이 같습니다.` },
  // ───── 02
  { ch: 'ch02', id: 'pascal', title: '정지 유체에서 한 점의 압력은 방향에 무관하다', keys: ['파스칼의 원리 (한 점의 압력)'],
    tags: 'Pascal wedge element pressure isotropic 파스칼 쐐기 요소',
    stmt: R`정지 유체(또는 전단이 없는 유체)의 한 점에서 어느 방향의 면을 잡아도 압력은 같다.`,
    body: R`
단면이 직각삼각형인 쐐기 요소(폭 $b$, 밑변 $dx$, 높이 $dz$, 빗면 길이 $ds$, 빗면 기울기 $\theta$로 $dx=ds\cos\theta$, $dz=ds\sin\theta$)를 잡습니다. 전단이 없으므로 면마다 수직 압력만 작용합니다.
$x$: $p_x\,b\,dz-p_n\,b\,ds\sin\theta=0$ → $p_x=p_n$.
$z$: $p_z\,b\,dx-p_n\,b\,ds\cos\theta-\tfrac12\rho g\,b\,dx\,dz=0$ → $p_z-p_n=\tfrac12\rho g\,dz$.
요소를 한 점으로 줄이면($dz\to0$) $p_z=p_n$. 빗면의 방향 $\theta$가 임의이므로 모든 방향에서 같습니다.`,
    note: R`무게 항은 부피에 비례해 넓이에 비례하는 압력 힘보다 한 차수 빨리 사라집니다. 움직이는 유체도 점성 응력이 없으면(비점성) 같은 결론입니다.` },
  { ch: 'ch02', id: 'netForce', title: '압력의 알짜 힘은 압력의 기울기에서 나온다', keys: ['압력의 알짜힘과 정수압 평형'],
    tags: 'pressure gradient net force hydrostatic equilibrium 압력 기울기 정수압 평형',
    stmt: R`작은 요소에 작용하는 압력의 알짜 힘은 단위 부피당 $-\nabla p$이고, 정지 유체에서는 $\nabla p=\rho\mathbf g$이다.`,
    body: R`
크기 $dx\,dy\,dz$인 상자에서 $x$ 방향: 왼쪽 면에 $p\,dy\,dz$(오른쪽으로), 오른쪽 면에 $\big(p+\frac{\partial p}{\partial x}dx\big)dy\,dz$(왼쪽으로). 알짜 $-\frac{\partial p}{\partial x}dx\,dy\,dz$. 세 방향을 모으면 $-\nabla p\,d\mathcal V$.
정지 유체는 전단도 가속도도 없으므로 $-\nabla p+\rho\mathbf g=\mathbf 0$. $z$를 위로 잡으면 $\mathbf g=-g\mathbf k$ → $\partial p/\partial x=\partial p/\partial y=0$, $dp/dz=-\rho g$.`,
    note: R`압력 자체가 아니라 압력의 **변화**가 힘을 만듭니다. 균일한 압력은 알짜 힘이 없습니다 — 운동량 방정식에서 계기압을 써도 되는 이유(6단원).` },
  { ch: 'ch02', id: 'hydroLinear', title: '비압축성 정수압 분포와 수두', keys: ['비압축성 유체의 정수압 분포', '압력의 기준'],
    tags: 'hydrostatic linear depth head gauge absolute 정수압 깊이 수두 계기압 절대압',
    stmt: R`밀도가 일정하면 $p_2-p_1=-\gamma(z_2-z_1)$이다. 표준 대기압은 물기둥 10.34 m, 수은 기둥 760 mm와 같다.`,
    body: R`
$dp/dz=-\gamma$를 $\gamma$ 일정으로 적분: $p_2-p_1=-\gamma(z_2-z_1)$. 수면($p=p_a$)에서 깊이 $h$ 아래면 $p=p_a+\gamma h$. 대기압을 기준으로 잰 값 $\gamma h$가 계기압입니다.
압력을 같은 크기의 액체 기둥 높이로 쓰면 $h=p/\gamma$(수두).
물: $101\,350/9790=10.35$ m. 수은($\gamma=133\,100$ N/m³): $101\,350/133\,100=0.761$ m.`,
    note: R`물의 $\gamma$를 9790(20°C)로 쓰느냐 9807(4°C)로 쓰느냐에 따라 끝자리가 달라집니다. 교재 값 10.34 m는 9807 기준입니다.` },
  { ch: 'ch02', id: 'atmos', title: '등온 대기와 표준 대기의 압력', keys: ['등온 대기'],
    tags: 'isothermal atmosphere lapse rate exponential ideal gas 대기 온도 감률 지수',
    stmt: R`온도가 일정하면 $p=p_a e^{-gz/(RT)}$, 온도가 $T=T_0-Bz$로 줄면 $p=p_a(1-Bz/T_0)^{g/(RB)}$이다.`,
    body: R`
$dp/dz=-\rho g$에 $\rho=p/(RT)$를 넣으면 $\dfrac{dp}p=-\dfrac{g}{RT}dz$.
**등온**: $\ln\dfrac p{p_a}=-\dfrac{gz}{RT}$.
**선형 감률**: $\dfrac{dp}p=-\dfrac{g\,dz}{R(T_0-Bz)}$. $\int\dfrac{dz}{T_0-Bz}=-\dfrac1B\ln(T_0-Bz)$이므로 $\ln\dfrac p{p_a}=\dfrac g{RB}\ln\dfrac{T_0-Bz}{T_0}$ → $p=p_a\Big(1-\dfrac{Bz}{T_0}\Big)^{g/(RB)}$.
공기 $g/(RB)=9.81/(287\times0.0065)=5.26$.`,
    note: R`$B\to0$이면 $(1-Bz/T_0)^{g/(RB)}\to e^{-gz/(RT_0)}$로 등온 식이 됩니다(지수 극한 $(1-a/n)^n\to e^{-a}$).` },
  { ch: 'ch02', id: 'manoRule', title: '마노미터 규칙과 기압계', keys: ['마노미터 규칙', '기압계'],
    tags: 'manometer rule interface continuity barometer mercury 마노미터 경계면 기압계 수은',
    stmt: R`연결된 액체 관을 따라 아래로 $\Delta z$ 가면 $+\gamma\Delta z$, 위로 가면 $-\gamma\Delta z$를 더해 두 점의 압력을 잇는다. 위가 진공인 수은 기둥은 $p_a=\gamma_{\text{Hg}}h$를 준다.`,
    body: R`
한 가지 액체로 이어진 구간 안에서는 정수압 식 $p_2=p_1+\gamma(z_1-z_2)$가 성립합니다(경로가 굽어도 높이 차만 중요).
두 액체의 경계면에서 압력은 연속입니다(경계면에 두께가 없으니 힘의 평형). 따라서 구간마다 식을 쓰고 경계면에서 같은 압력으로 이어 붙이면 됩니다:
$p_1+\sum\gamma_i\Delta z_i^{\text{아래}}-\sum\gamma_j\Delta z_j^{\text{위}}=p_2$.
**기압계**: 수은 면(대기에 열림, $p_a$)에서 관 속 수은 꼭대기(진공, $p\approx0$)까지 위로 $h$: $p_a-\gamma_{\text{Hg}}h=0$.`,
    note: R`기체가 든 구간은 $\gamma$가 작아 보통 압력이 일정하다고 봅니다. 높이 차가 수십 m가 넘으면 기체의 정수압도 챙겨야 합니다.` },
  // ───── 03
  { ch: 'ch03', id: 'planeForce', title: '잠긴 평판의 합력은 도심의 압력 × 넓이', keys: ['평판의 합력'],
    tags: 'plane surface resultant centroid hydrostatic force 평판 합력 도심',
    stmt: R`수면과 각 $\theta$를 이루는 평판에서 경사 거리 $\xi$(수면선에서 판을 따라 잰 거리)의 압력은 $p_a+\gamma\xi\sin\theta$이고, 합력은 $F=p_{cg}A$이다.`,
    body: R`
$F=\int_A p\,dA=p_aA+\gamma\sin\theta\int_A\xi\,dA$.
도심의 정의 $\bar\xi=\frac1A\int\xi\,dA$로 $\int\xi\,dA=\bar\xi A$. 도심의 깊이 $h_{cg}=\bar\xi\sin\theta$이므로
$F=(p_a+\gamma h_{cg})A=p_{cg}A$.
압력이 판 위에서 $\xi$의 일차식이라 평균이 도심에서의 값과 같다는 것이 핵심입니다.`,
    note: R`판의 모양과 기울기가 도심의 깊이로만 들어갑니다. 반대편이 대기에 열려 있으면 $p_a$ 항은 양쪽에서 상쇄되어 계기압 $\gamma h_{cg}A$만 남습니다.` },
  { ch: 'ch03', id: 'centerP', title: '압력 중심의 위치', keys: ['압력 중심'],
    tags: 'center of pressure second moment product of inertia 압력 중심 단면 2차 모멘트',
    stmt: R`계기압에서 합력의 작용점은 도심에서 판을 따라 아래로 $y_{cp}=\dfrac{I_{xx}\sin\theta}{h_{cg}A}$, 옆으로 $x_{cp}=\dfrac{I_{xy}\sin\theta}{h_{cg}A}$ 떨어져 있다.`,
    body: R`
도심을 원점으로, 판을 따라 아래로 $y$, 수평으로 $x$를 잡습니다. 점 $(x,y)$의 깊이 $h_{cg}+y\sin\theta$, 계기압 $p=\gamma(h_{cg}+y\sin\theta)$.
$x$축에 대한 모멘트: $Fy_{cp}=\int yp\,dA=\gamma h_{cg}\int y\,dA+\gamma\sin\theta\int y^2dA=0+\gamma\sin\theta I_{xx}$.
$F=\gamma h_{cg}A$로 나누면 $y_{cp}=\dfrac{I_{xx}\sin\theta}{h_{cg}A}$. 같은 방법으로 $Fx_{cp}=\int xp\,dA=\gamma\sin\theta\int xy\,dA$ → $x_{cp}=\dfrac{I_{xy}\sin\theta}{h_{cg}A}$.`,
    note: R`$y_{cp}>0$: 압력 중심은 항상 도심보다 깊습니다. 깊이가 커지면($h_{cg}\to\infty$) 압력이 거의 균일해져 두 점이 가까워집니다. 절대압을 쓰면 $h_{cg}$ 대신 $p_{cg}/\gamma$가 들어갑니다.` },
  { ch: 'ch03', id: 'curvedF', title: '곡면에 작용하는 정수압의 수평·연직 성분', keys: ['곡면의 힘'],
    tags: 'curved surface horizontal vertical projection weight 곡면 수평 연직 투영 무게',
    stmt: R`곡면에 작용하는 힘의 수평 성분은 연직 투영면의 힘과 같고, 연직 성분은 곡면 위(또는 아래) 수면까지의 유체 무게와 같다.`,
    body: R`
곡면, 그 연직 투영면, 수평면(수면)으로 둘러싸인 유체 덩어리를 자유물체로 잡습니다. 유체는 정지해 있으니 평형입니다.
**수평**: 이 덩어리에 작용하는 수평 힘은 곡면이 미는 힘과 투영면 쪽의 압력 힘뿐(수평면은 수평 힘을 주지 않고, 무게는 연직). 따라서 곡면의 수평력 = 투영면의 힘(평판 공식), 작용선도 투영면의 압력 중심.
**연직**: 덩어리 위 수면의 압력(대기) + 덩어리 무게 = 곡면이 받치는 연직력. 계기압이면 $F_V=$ 덩어리의 무게, 작용선은 그 도심.
유체가 곡면 반대쪽에 있으면 같은 모양의 가상 유체를 생각합니다: 압력은 깊이만의 함수라 같은 크기의 힘이 방향만 반대로 작용합니다.`,
    note: R`수평·연직 성분은 각각 따로 작용선을 가집니다. 원호 수문처럼 곡면의 모든 압력이 한 점(원의 중심)을 지나면 합력도 그 점을 지납니다.` },
  { ch: 'ch03', id: 'layers', title: '층을 이룬 유체에서 평판의 힘', keys: ['층을 이룬 유체'],
    tags: 'layered fluids piecewise linear pressure 층 여러 유체 조각별 선형',
    stmt: R`밀도가 다른 층이 겹치면 압력 분포는 층마다 기울기가 다른 꺾은선이다. 판의 힘은 층마다 나눈 $F_i=p_{cg,i}A_i$의 합이다.`,
    body: R`
각 층 안에서는 밀도가 일정하므로 정수압 식이 선형으로 성립합니다. 층의 경계면에서 압력은 연속이고, 아래층의 압력은 위층들의 무게를 모두 포함합니다: 층 $i$ 윗면의 압력 $p_i=p_a+\sum_{j<i}\gamma_jt_j$($t_j$: 층 두께).
층 $i$ 안의 판 조각에서 압력은 여전히 깊이의 일차식이므로, 평판 공식을 그 조각에 그대로 적용: $F_i=p_{cg,i}A_i$(조각의 도심 압력 × 조각 넓이). 합력은 $\sum F_i$, 작용점은 조각별 압력 중심의 모멘트 합으로 정합니다.`,
    note: R`판 전체에 한 번에 $\gamma h_{cg}A$를 쓰면 틀립니다. 압력이 판 전체에서 한 직선이 아니기 때문입니다.` },
  // ───── 04
  { ch: 'ch04', id: 'archimedes', title: '아르키메데스의 원리: 바꿔치기 논법', keys: ['아르키메데스의 원리', '떠 있는 물체'],
    tags: 'Archimedes buoyancy replacement argument floating 부력 바꿔치기 떠 있는 물체',
    stmt: R`잠긴 물체가 받는 압력의 합력은 연직 위로 $\gamma\mathcal V_{\text{잠김}}$이고 잠긴 부피의 도심을 지난다. 떠 있으면 $\rho_{\text{물체}}/\rho_{\text{유체}}=\mathcal V_{\text{잠김}}/\mathcal V_{\text{전체}}$이다.`,
    body: R`
물체를 빼고 그 자리를 같은 모양의 주변 유체로 채웠다고 상상합니다. 주변 유체의 압력 분포는 경계의 모양만 보고 정해지므로 바뀌지 않습니다.
채운 유체는 정지해 있으니 평형: 경계의 압력 합력 + 자기 무게 = 0. 따라서 압력 합력은 크기 $\gamma\mathcal V$(유체 무게)로 위를 향하고, 모멘트도 평형이어야 하므로 무게의 작용선 — 채운 유체의 무게 중심 = 부피의 도심 — 을 지납니다.
같은 압력이 원래 물체에도 작용하므로 부력은 $F_B=\gamma\mathcal V_{\text{잠김}}$. 떠 있으면 $\rho_{\text{물체}}g\mathcal V_{\text{전체}}=\rho_{\text{유체}}g\mathcal V_{\text{잠김}}$.`,
    note: R`4단원 연습 문제의 연직 기둥 분할과 같은 결론을 계산 없이 얻습니다. 물체가 바닥에 밀착해 아래쪽에 유체가 없으면 바꿔치기가 성립하지 않아 부력이 달라집니다(바닥에 붙은 흡착판).` },
  { ch: 'ch04', id: 'metacentric', title: '메타센터 높이와 복원 모멘트', keys: ['메타센터 높이'],
    tags: 'metacenter stability waterplane small tilt 메타센터 안정성 수선면 기울기',
    stmt: R`떠 있는 물체가 작은 각 $\phi$만큼 기울면 부력 중심이 수평으로 $I_{\text{수선면}}\phi/\mathcal V$만큼 옮겨 가고, 복원 모멘트는 $W\,\overline{GM}\,\phi$($\overline{GM}=I/\mathcal V-\overline{GB}$)이다.`,
    body: R`
수선면(물체를 수면에서 자른 단면)에서 기울기 축으로부터의 거리를 $x$라 합니다. $\phi$만큼 기울면 한쪽에 쐐기가 새로 잠기고 반대쪽 쐐기가 떠오릅니다. 넓이 요소 $dA$ 위의 쐐기 높이는 $x\phi$라 부피 $x\phi\,dA$(떠오르는 쪽은 음).
잠긴 부피는 무게가 같아 변하지 않고($\int x\,dA=0$, 축이 수선면의 도심을 지남), 부피의 1차 모멘트는 $\int x\cdot x\phi\,dA=\phi I_{\text{수선면}}$만큼 변합니다. 따라서 부력 중심의 수평 이동 $\Delta x_B=\phi I/\mathcal V$.
새 부력의 작용선(연직)이 물체의 원래 중심선과 만나는 점이 $M$: $\overline{BM}\,\phi=\Delta x_B$ → $\overline{BM}=I/\mathcal V$.
무게는 $G$에서 아래로, 부력은 $M$을 지나 위로 → 우력의 팔 $\overline{GM}\sin\phi$, 복원 모멘트 $W\,\overline{GM}\,\phi$. $\overline{GM}>0$이면 되돌아옵니다.`,
    note: R`작은 각에서만 성립합니다. 큰 각에서는 수선면 모양이 변해 복원 모멘트를 직접 계산해야 합니다(선박의 복원력 곡선).` },
  { ch: 'ch04', id: 'rigidAccel', title: '강체 운동하는 유체의 압력 기울기와 수면 기울기', keys: ['강체 운동하는 유체의 압력'],
    tags: 'rigid body acceleration pressure gradient free surface slope 강체 운동 가속 수면 기울기',
    stmt: R`유체 전체가 가속도 $\mathbf a$로 강체처럼 움직이면 $\nabla p=\rho(\mathbf g-\mathbf a)$이고, 수평 $a_x$, 연직 $a_z$에서 수면은 $\tan\theta=a_x/(g+a_z)$로 기운다.`,
    body: R`
강체 운동에서는 유체 요소 사이에 상대 운동이 없어 변형률 속도가 0이고, 점성 응력도 0입니다. 요소의 운동 방정식: $-\nabla p\,d\mathcal V+\rho\mathbf g\,d\mathcal V=\rho\mathbf a\,d\mathcal V$ → $\nabla p=\rho(\mathbf g-\mathbf a)$.
$\mathbf g=(0,0,-g)$, $\mathbf a=(a_x,0,a_z)$: $\partial p/\partial x=-\rho a_x$, $\partial p/\partial z=-\rho(g+a_z)$.
등압면 위에서 $dp=\frac{\partial p}{\partial x}dx+\frac{\partial p}{\partial z}dz=0$ → $\dfrac{dz}{dx}=-\dfrac{a_x}{g+a_z}$. 수면(등압면)은 가속 방향 반대쪽이 높아지며 기울기 크기 $a_x/(g+a_z)$.`,
    note: R`등압면은 “유효 중력” $\mathbf g-\mathbf a$에 수직입니다. 엘리베이터가 $a_z=-g$로 떨어지면 $\nabla p=\mathbf 0$ — 무중량 상태.` },
  { ch: 'ch04', id: 'rigidRot', title: '강체 회전의 포물면 수면과 “절반씩” 규칙', keys: ['강체 회전의 압력과 자유 표면'],
    tags: 'rigid rotation paraboloid volume free surface 강체 회전 포물면 부피',
    stmt: R`각속도 $\Omega$로 도는 유체에서 $p=C-\gamma z+\tfrac12\rho\Omega^2r^2$, 수면은 $z=z_0+\Omega^2r^2/(2g)$이고, 반지름 $R$ 원통에서 중심은 정지 수면보다 $\Omega^2R^2/(4g)$ 내려가고 가장자리는 같은 만큼 올라간다.`,
    body: R`
가속도 $\mathbf a=-r\Omega^2\mathbf e_r$. $\nabla p=\rho(\mathbf g-\mathbf a)$: $\partial p/\partial r=\rho r\Omega^2$, $\partial p/\partial z=-\rho g$.
적분: $p=\tfrac12\rho\Omega^2r^2-\rho gz+C$. 수면 $p=p_a$: $z=z_0+\dfrac{\Omega^2r^2}{2g}$($z_0$: 중심의 수면 높이).
부피 보존: 정지 수면 높이를 $h_0$라 하면 $\int_0^R z(r)2\pi r\,dr=\pi R^2h_0$.
$\int_0^R\Big(z_0+\dfrac{\Omega^2r^2}{2g}\Big)2\pi r\,dr=\pi R^2z_0+\dfrac{\pi\Omega^2R^4}{4g}$ → $h_0=z_0+\dfrac{\Omega^2R^2}{4g}$.
중심은 $h_0$보다 $\Omega^2R^2/(4g)$ 낮고, 가장자리 $z(R)=z_0+\Omega^2R^2/(2g)$는 $h_0$보다 $\Omega^2R^2/(4g)$ 높습니다.`,
    note: R`포물면 아래 부피가 같은 높이 원기둥의 절반이라는 사실과 같은 계산입니다. 중심이 바닥에 닿으면 수면의 일부가 바닥으로 드러나 이 규칙이 깨집니다.` },
  // ───── 05
  { ch: 'ch05', id: 'fluxDef', title: '면을 지나는 유량을 적분으로 쓰는 이유', keys: ['체적 유량과 질량 유량'],
    tags: 'flux volume flow rate mass flow oblique prism 유량 플럭스 기울어진 기둥',
    stmt: R`넓이 요소 $dA$(단위 법선 $\mathbf n$)를 $dt$ 동안 지나는 유체의 부피는 $(\mathbf V\cdot\mathbf n)\,dA\,dt$이다.`,
    body: R`
$dt$ 동안 $dA$ 위의 입자들은 $\mathbf V\,dt$만큼 옮겨 가며, 지나간 유체는 밑면 $dA$, 옆 모서리 $\mathbf V\,dt$인 기울어진 기둥을 채웁니다. 기둥의 부피 = 밑넓이 × 높이이고, 높이는 모서리의 법선 성분 $\mathbf V\cdot\mathbf n\,dt$.
그래서 $dQ=(\mathbf V\cdot\mathbf n)dA$, 질량은 밀도를 곱해 $d\dot m=\rho(\mathbf V\cdot\mathbf n)dA$. 면 전체로 적분하면 $Q$, $\dot m$입니다.`,
    note: R`$\mathbf n$의 방향을 정해야 부호가 정해집니다. 검사면에서는 바깥 법선을 씁니다.` },
  { ch: 'ch05', id: 'rttProof', title: '레이놀즈 수송 정리', keys: ['레이놀즈 수송 정리 (고정 검사 체적)', '1차원 입출구'],
    tags: 'Reynolds transport theorem system control volume derivation 수송 정리 계 검사 체적',
    stmt: R`고정 검사 체적과 시각 $t$에 겹치는 계에 대해 $\dfrac{dB_{\text{계}}}{dt}=\dfrac{d}{dt}\displaystyle\int_{CV}\beta\rho\,d\mathcal V+\int_{CS}\beta\rho(\mathbf V\cdot\mathbf n)dA$이다.`,
    body: R`
$t$에 계 = 검사 체적. $t+dt$에 계는 $\mathbf V\,dt$만큼 옮겨 가, 검사면의 유출 부분($\mathbf V\cdot\mathbf n>0$)에서는 검사 체적 밖으로 기둥 $(\mathbf V\cdot\mathbf n)dA\,dt$만큼 나가고, 유입 부분($\mathbf V\cdot\mathbf n<0$)에서는 기둥 $\lvert\mathbf V\cdot\mathbf n\rvert dA\,dt$만큼의 검사 체적 공간을 비웁니다(그 자리는 계 밖의 새 유체가 채움).
$B_{\text{계}}(t+dt)=B_{CV}(t+dt)+\displaystyle\int_{\text{out}}\beta\rho(\mathbf V\cdot\mathbf n)dA\,dt-\int_{\text{in}}\beta\rho\lvert\mathbf V\cdot\mathbf n\rvert dA\,dt$.
유입에서 $-\lvert\mathbf V\cdot\mathbf n\rvert=\mathbf V\cdot\mathbf n$이므로 두 적분은 $\int_{CS}\beta\rho(\mathbf V\cdot\mathbf n)dA\,dt$ 하나로 합쳐집니다. $B_{\text{계}}(t)=B_{CV}(t)$를 빼고 $dt\to0$.
1차원 입출구: 단면에서 $\beta,\rho,V$가 고르고 $\mathbf V\parallel\mathbf n$이면 적분이 $\beta_i\rho_iV_iA_i=\beta_i\dot m_i$(유출 +, 유입 −)가 됩니다.`,
    note: R`검사 체적이 움직이면 기둥의 모서리가 유체와 면의 상대 변위 $\mathbf V_r\,dt$이므로 $\mathbf V$ 대신 $\mathbf V_r$을 씁니다.` },
  { ch: 'ch05', id: 'massCons', title: '질량 보존의 두 형태', keys: ['정상 흐름의 연속 방정식', '비정상 질량 수지'],
    tags: 'conservation of mass continuity steady unsteady tank 질량 보존 연속 정상 비정상 탱크',
    stmt: R`$\dfrac{dm_{CV}}{dt}=\sum\dot m_{\text{in}}-\sum\dot m_{\text{out}}$이고, 정상이면 $\sum\dot m_{\text{in}}=\sum\dot m_{\text{out}}$, 하나의 관에서 $\rho_1A_1V_1=\rho_2A_2V_2$이다.`,
    body: R`
수송 정리에 $B=m$, $\beta=1$: 계의 질량은 변하지 않으므로 $0=\dfrac{d}{dt}\displaystyle\int_{CV}\rho\,d\mathcal V+\sum_{\text{out}}\dot m_i-\sum_{\text{in}}\dot m_i$. 첫째 항이 $dm_{CV}/dt$입니다.
정상이면 $dm_{CV}/dt=0$. 입출구가 하나씩이면 $\rho_1V_1A_1=\rho_2V_2A_2$.
비압축성 유체가 단단한 검사 체적을 가득 채우면 $m_{CV}=\rho\mathcal V_{CV}$가 일정하므로, 비정상이어도 $\sum Q_{\text{in}}=\sum Q_{\text{out}}$입니다.`,
    note: R`탱크의 수위처럼 검사 체적 안 액체 부피가 변하면 $dm_{CV}/dt=\rho A_t\,dh/dt$가 살아 있습니다.` },
  // ───── 06
  { ch: 'ch06', id: 'momCV', title: '검사 체적의 운동량 방정식과 계기압', keys: ['검사 체적의 운동량 방정식'],
    tags: 'linear momentum control volume gauge pressure closed surface 운동량 검사 체적 계기압',
    stmt: R`$\sum\mathbf F=\dfrac{d}{dt}\displaystyle\int_{CV}\mathbf V\rho\,d\mathcal V+\int_{CS}\mathbf V\rho(\mathbf V_r\cdot\mathbf n)dA$이고, 압력 힘을 계산할 때 모든 곳에서 같은 상수 $p_a$를 빼도 된다.`,
    body: R`
뉴턴의 제2법칙 $\sum\mathbf F=d(m\mathbf V)_{\text{계}}/dt$에 수송 정리($\beta=\mathbf V$)를 쓰면 곧바로 첫 식입니다(운동량은 관성틀의 속도 $\mathbf V$로, 면을 지나는 유량은 상대 속도 $\mathbf V_r$로).
압력 힘은 $-\oint_{CS}p\,\mathbf n\,dA$. 상수 $p_a$에 대해 발산 정리로 $\oint p_a\mathbf n\,dA=\int_{CV}\nabla p_a\,d\mathcal V=\mathbf 0$. 따라서 $-\oint p\,\mathbf n\,dA=-\oint(p-p_a)\mathbf n\,dA$ — 계기압으로 계산해도 같습니다.`,
    note: R`검사면 전체에서 같은 $p_a$를 빼야 합니다. 반은 절대압, 반은 계기압으로 쓰면 틀립니다. 검사면이 자른 고체의 반력도 $\sum\mathbf F$에 들어갑니다.` },
  { ch: 'ch06', id: 'betaGe1', title: '운동량 플럭스 보정 계수는 1 이상이다', keys: ['운동량 플럭스 보정 계수'],
    tags: 'momentum flux correction factor Cauchy Schwarz laminar 4/3 보정 계수',
    stmt: R`$\beta=\dfrac1A\displaystyle\int_A\Big(\frac u{V}\Big)^2dA\ge1$ ($V$: 평균 속도)이고, 층류 관 유동에서 $\beta=4/3$이다.`,
    body: R`
$w=u/V$라 두면 평균 $\bar w=\frac1A\int w\,dA=1$. $\frac1A\int(w-1)^2dA\ge0$을 전개하면 $\frac1A\int w^2dA-2+1\ge0$ → $\beta\ge1$. 등호는 $u$가 단면에서 균일할 때.
층류: $u=2V(1-r^2/R^2)$, $s=r^2/R^2$로 $dA=2\pi r\,dr=\pi R^2ds$:
$\beta=\displaystyle\int_0^14(1-s)^2ds=\frac43$.`,
    note: R`$\beta$는 “속도의 제곱 평균 ÷ 평균의 제곱”, 즉 1 + 분산의 비입니다. 난류는 분포가 평평해 1.02 안팎이라 보통 1로 둡니다.` },
  { ch: 'ch06', id: 'vanes', title: '고정 날개와 움직이는 날개의 힘과 최대 동력', keys: ['고정 날개', '움직이는 날개'],
    tags: 'vane jet deflection moving vane Pelton optimum power 날개 분류 펠턴 최대 동력',
    stmt: R`고정 날개가 분류를 $\theta$만큼 꺾으면 받침의 힘은 $F_x=-\dot mV(1-\cos\theta)$, $F_y=\dot mV\sin\theta$이다. 날개가 $U$로 물러나면 $F_x$ 크기 $\rho A(V-U)^2(1-\cos\theta)$, 날개 하나의 동력은 $U=V/3$, 날개가 줄지은 바퀴는 $U=V/2$에서 최대다.`,
    body: R`
대기 중 분류는 압력이 0(계기압), 마찰 무시 → 날개를 따라 상대 속력 불변(베르누이).
**고정**: 들어올 때 $(V,0)$, 나갈 때 $(V\cos\theta,V\sin\theta)$. $\sum\mathbf F=\dot m(\mathbf V_{\text{out}}-\mathbf V_{\text{in}})$ → 위 식.
**움직이는 날개 하나**: 날개와 함께 등속으로 움직이는 관성틀에서 흐름은 정상, 상대 속도 $V-U$. 날개에 닿는 질량 유량은 상대 유량 $\rho A(V-U)$(분류 끝이 날개를 따라잡는 비율). 같은 계산으로 $\lvert F_x\rvert=\rho A(V-U)^2(1-\cos\theta)$.
동력 $P=\lvert F_x\rvert U\propto U(V-U)^2$, $\dfrac{dP}{dU}\propto(V-U)(V-3U)=0$ → $U=V/3$.
**바퀴**: 버킷이 차례로 들어와 분류 전체 $\rho AV$를 받으므로 $P=\rho AVU(V-U)(1-\cos\theta)$ → $U=V/2$, $\theta=180°$에서 $P=\tfrac12\rho AV^3=\tfrac12\dot mV^2$(분류의 운동에너지 전부).`,
    note: R`하나의 날개는 달아나면서 받는 물의 양이 줄어 최적 속도가 더 낮습니다. 바퀴는 물을 잃지 않으므로 효율 100%가 이론상 가능합니다.` },
  { ch: 'ch06', id: 'rocketThrust', title: '로켓 추력 식', keys: ['로켓 추력'],
    tags: 'rocket thrust accelerating control volume exit pressure 로켓 추력 가속 검사 체적 출구 압력',
    stmt: R`로켓과 함께 움직이는 검사 체적에서 $m\dfrac{dV}{dt}=\dot mV_e+(p_e-p_a)A_e-mg-D$이다.`,
    body: R`
로켓에 붙은 좌표계는 가속도 $dV/dt$로 가속하므로, 운동량 방정식에 가상 힘 $-\int\mathbf a_{\text{rel}}\rho\,d\mathcal V=-m\frac{dV}{dt}$를 더합니다. 안의 상대 흐름이 거의 정상이라 $\frac{d}{dt}\int\mathbf V_r\rho\,d\mathcal V\approx0$.
운동량 유출: 출구에서 상대 속도 $-V_e$(뒤로) → $\dot m(-V_e)$.
외력(진행 방향 +): 무게 $-mg$, 항력 $-D$, 압력. 검사면 전체에 $p_a$가 작용하되 출구에서만 $p_e$이므로, 계기압으로 $-\oint(p-p_a)\mathbf n\,dA=-(p_e-p_a)A_e\mathbf n_e$. 출구의 바깥 법선이 뒤를 향하므로 이 힘은 앞으로 $(p_e-p_a)A_e$.
$-mg-D+(p_e-p_a)A_e-m\dfrac{dV}{dt}=-\dot mV_e$ → 위 식.`,
    note: R`동역학 9단원에서 계를 두 시각에 잡아 얻은 로켓 방정식과 같습니다. 출구 압력 항은 노즐이 “덜 팽창”했을 때 추가로 생기는 추력입니다.` },
  // ───── 07
  { ch: 'ch07', id: 'bernoulliProof', title: '베르누이 식: 에너지 방정식에서 얻기', keys: ['베르누이 식'],
    tags: 'Bernoulli energy equation frictionless streamtube 베르누이 에너지 마찰 없음 유관',
    stmt: R`정상·비압축성·마찰 없는 흐름의 유관에서 $\dfrac p\rho+\dfrac{V^2}2+gz$는 일정하다.`,
    body: R`
가는 유관(단면 1에서 2까지)을 검사 체적으로 잡고 정상 흐름 에너지 방정식을 씁니다(축 일, 열 전달 없음):
$\dot m\Big(\hat u_2+\dfrac{p_2}\rho+\dfrac{V_2^2}2+gz_2\Big)-\dot m\Big(\hat u_1+\dfrac{p_1}\rho+\dfrac{V_1^2}2+gz_1\Big)=\dot Q-\dot W_v$.
마찰이 없으면 점성 일이 없고, 역학적 에너지가 내부 에너지로 바뀌지 않으므로(단열에서 $\hat u_2-\hat u_1-q=0$) 남는 것은
$\dfrac{p_1}\rho+\dfrac{V_1^2}2+gz_1=\dfrac{p_2}\rho+\dfrac{V_2^2}2+gz_2$.
유관을 한 유선으로 좁히면 유선을 따라 일정.`,
    note: R`7단원 연습 문제는 같은 식을 뉴턴의 법칙으로 얻었습니다. 에너지 쪽에서 보면 마찰 손실 $h_f$가 바로 $(\hat u_2-\hat u_1-q)/g$ — 되돌릴 수 없게 열로 바뀐 몫입니다.` },
  { ch: 'ch07', id: 'pitotVenturi', title: '피토관과 벤투리관의 공식', keys: ['정체압과 피토관', '벤투리관'],
    tags: 'pitot static stagnation venturi throat flow rate 피토관 정체압 벤투리 목 유량',
    stmt: R`피토-정압관에서 $V=\sqrt{2(p_0-p)/\rho}$, 벤투리관에서 $Q=A_2\sqrt{\dfrac{2(p_1-p_2)}{\rho(1-\beta^4)}}$이다.`,
    body: R`
**피토관**: 앞쪽 구멍으로 들어오는 유선은 구멍에서 멈춥니다($V=0$). 같은 높이의 자유 흐름 점과 베르누이: $p+\tfrac12\rho V^2=p_0$. 옆 구멍은 유선이 관 표면과 나란한 곳에 있어 법선 방향 압력 기울기가 없으므로(곡률 0) 자유 흐름의 정압 $p$를 잽니다. → $V=\sqrt{2(p_0-p)/\rho}$.
**벤투리관**: 1(넓은 곳)과 2(목) 사이 같은 높이의 베르누이 $p_1-p_2=\tfrac12\rho(V_2^2-V_1^2)$, 연속 $V_1=V_2A_2/A_1=\beta^2V_2$.
$p_1-p_2=\tfrac12\rho V_2^2(1-\beta^4)$ → $V_2=\sqrt{\dfrac{2(p_1-p_2)}{\rho(1-\beta^4)}}$, $Q=A_2V_2$.`,
    note: R`실제 계기에는 손실과 축류 때문에 유량 계수 $C_d$(벤투리 0.98 안팎)를 곱합니다(12단원).` },
  { ch: 'ch07', id: 'torricelliProof', title: '토리첼리 유출 속도와 탱크 크기 보정', keys: ['토리첼리 유출'],
    tags: 'Torricelli efflux tank orifice correction 토리첼리 유출 구멍 탱크',
    stmt: R`수면 넓이 $A_t$인 탱크의 깊이 $h$에서 넓이 $A_j$인 분류가 나오면 $V_j=\sqrt{\dfrac{2gh}{1-(A_j/A_t)^2}}$이고, $A_j\ll A_t$면 $\sqrt{2gh}$이다.`,
    body: R`
수면(1)과 분류(2)를 잇는 유선에 베르누이(두 곳 모두 대기압, 준정상 가정): $\dfrac{V_1^2}{2g}+h=\dfrac{V_2^2}{2g}$.
연속 $V_1A_t=V_2A_j$ → $V_1=V_2A_j/A_t$.
$\dfrac{V_2^2}{2g}\Big[1-\Big(\dfrac{A_j}{A_t}\Big)^2\Big]=h$ → 위 식.`,
    note: R`분류 넓이는 구멍 넓이보다 작습니다(축류). 수위가 변하는 탱크의 배수 시간은 이 속도를 5단원의 비정상 질량 수지에 넣어 구합니다: $Q\propto\sqrt h$.` },
  { ch: 'ch07', id: 'eglHgl', title: '에너지선과 수력 기울기선의 성질', keys: ['에너지선과 수력 기울기선'],
    tags: 'energy grade line hydraulic grade line negative gauge pressure EGL HGL 에너지선 수력 기울기선',
    stmt: R`EGL은 손실만큼 하류로 내려가고 펌프에서 올라가며, HGL − 관 높이 = 계기 압력 수두다. HGL이 관 아래로 가면 계기압이 음수다.`,
    body: R`
정상 에너지 방정식(수두 형태) $H_1+h_p=H_2+h_t+h_f$에서 $H=p/\gamma+V^2/2g+z$가 EGL의 높이입니다. 펌프·터빈이 없으면 $H_2=H_1-h_f\le H_1$: 손실이 있는 한 하류로 내려갑니다. 곧은 관의 $h_f=f(L/D)V^2/2g$는 길이에 비례하므로 EGL은 일정한 기울기의 직선.
HGL $=H-V^2/2g=p/\gamma+z$ → $\text{HGL}-z=p/\gamma$. HGL이 관 중심($z$)보다 낮으면 $p<0$(계기압).
지름이 일정하면 $V$가 같아 두 선이 평행하고, 지름이 줄어 $V$가 커지면 HGL이 EGL에서 더 멀어집니다.`,
    note: R`사이펀의 꼭대기처럼 HGL이 관 아래로 내려가는 곳은 공기가 새어 들거나 증기압에 이르러 흐름이 끊어질 위험이 있는 곳입니다.` },
  { ch: 'ch07', id: 'angMomEuler', title: '각운동량 방정식과 오일러 터보기계 식', keys: ['각운동량 방정식'],
    tags: 'angular momentum torque Euler turbomachine sprinkler 각운동량 토크 오일러 스프링클러',
    stmt: R`정상 흐름에서 $\sum\mathbf M_O=\sum_{\text{out}}(\mathbf r\times\mathbf V)\dot m-\sum_{\text{in}}(\mathbf r\times\mathbf V)\dot m$이고, 축 대칭 회전 기계의 축 토크는 $T=\dot m(r_2V_{t2}-r_1V_{t1})$이다.`,
    body: R`
수송 정리에 $B=\mathbf H_O=\int\mathbf r\times\mathbf V\,dm$, $\beta=\mathbf r\times\mathbf V$, 계에 대해 $\sum\mathbf M_O=d\mathbf H_O/dt$. 정상이면 검사 체적 안의 항이 사라져 첫 식.
축($z$) 방향 성분: $(\mathbf r\times\mathbf V)_z=rV_t$(반지름 방향 성분은 축 모멘트 없음, 축 방향 성분은 $\mathbf r$의 반지름 방향과의 외적이 축에 수직). 입구(반지름 $r_1$)와 출구($r_2$)가 원주 전체에서 대칭이면 $T=\dot m(r_2V_{t2}-r_1V_{t1})$.
축 동력 $P=T\omega$. 날개의 속도 $U=r\omega$로 $P=\dot m(U_2V_{t2}-U_1V_{t1})$ — 펌프가 유체에 주는 단위 질량당 일.`,
    note: R`$\mathbf V$는 관성틀의 절대 속도입니다. 스프링클러처럼 팔 위의 노즐에서 잰 상대 속도가 주어지면 팔의 속도 $R\omega$를 빼서 절대 접선 속도를 만듭니다.` },
  { ch: 'ch07', id: 'energyHead', title: '정상 흐름 에너지 방정식의 수두 형태', keys: ['정상 흐름 에너지 방정식 (수두 형태)'],
    tags: 'energy equation head pump turbine friction loss flow work 에너지 방정식 수두 펌프 터빈 손실',
    stmt: R`입출구가 하나인 정상 흐름에서 $\Big(\dfrac p\gamma+\alpha\dfrac{V^2}{2g}+z\Big)_1+h_p=\Big(\dfrac p\gamma+\alpha\dfrac{V^2}{2g}+z\Big)_2+h_t+h_f$이다.`,
    body: R`
제1법칙과 수송 정리($\beta=e=\hat u+V^2/2+gz$): $\dot Q-\dot W=\dfrac{d}{dt}\displaystyle\int e\rho\,d\mathcal V+\int e\rho(\mathbf V\cdot\mathbf n)dA$.
일을 나눔: 축 일 $\dot W_s$, 입출구 압력이 하는 일 $\oint p(\mathbf V\cdot\mathbf n)dA$(흐름 일), 벽의 점성 일(벽에서 속도 0이라 0). 흐름 일을 오른쪽으로 옮기면 $e+p/\rho$.
정상, 1차원(운동에너지는 $\alpha V^2/2$로 보정): $\dot Q-\dot W_s=\dot m\Big[\Big(\hat u+\dfrac p\rho+\alpha\dfrac{V^2}2+gz\Big)_2-(\ )_1\Big]$.
$\dot mg$로 나누고 $\dot W_s/(\dot mg)=h_t-h_p$, $h_f=\dfrac{\hat u_2-\hat u_1-\dot Q/\dot m}{g}$로 두면 위 식.`,
    note: R`$h_f\ge0$은 제2법칙의 요구입니다. 비압축성 유체에서 마찰은 내부 에너지를 올리거나 열로 빠져나갈 뿐 압력·속도·높이로 되돌아오지 않습니다.` },
  // ───── 08
  { ch: 'ch08', id: 'materialD', title: '물질 도함수: 입자를 따라가는 변화율', keys: ['물질 도함수와 가속도'],
    tags: 'material derivative convective local acceleration chain rule 물질 도함수 대류 국소 가속도',
    stmt: R`속도장 $\mathbf V(x,y,z,t)$ 속 입자의 가속도는 $\dfrac{\partial\mathbf V}{\partial t}+u\dfrac{\partial\mathbf V}{\partial x}+v\dfrac{\partial\mathbf V}{\partial y}+w\dfrac{\partial\mathbf V}{\partial z}$이다.`,
    body: R`
입자의 위치를 $x(t),y(t),z(t)$라 하면 입자의 속도는 $\mathbf V(x(t),y(t),z(t),t)$. 연쇄 법칙:
$\dfrac{d\mathbf V}{dt}=\dfrac{\partial\mathbf V}{\partial t}+\dfrac{\partial\mathbf V}{\partial x}\dfrac{dx}{dt}+\dfrac{\partial\mathbf V}{\partial y}\dfrac{dy}{dt}+\dfrac{\partial\mathbf V}{\partial z}\dfrac{dz}{dt}$.
입자이므로 $dx/dt=u$, $dy/dt=v$, $dz/dt=w$. 대입하면 결과이고, 이를 $D\mathbf V/Dt=\partial\mathbf V/\partial t+(\mathbf V\cdot\nabla)\mathbf V$로 씁니다.`,
    note: R`“고정된 점에서 본 변화”($\partial/\partial t$)와 “입자를 따라가며 본 변화”($D/Dt$)의 차이가 대류 항입니다. 강물이 일정하게 흘러도 좁은 곳을 지나는 나뭇잎은 빨라집니다.` },
  { ch: 'ch08', id: 'contDiv', title: '연속 방정식: 발산 정리로 얻기', keys: ['연속 방정식'],
    tags: 'continuity divergence theorem arbitrary volume incompressible 연속 방정식 발산 정리 비압축성',
    stmt: R`질량 보존이 모든 고정 영역에서 성립하면 점마다 $\partial\rho/\partial t+\nabla\cdot(\rho\mathbf V)=0$이다.`,
    body: R`
임의의 고정 검사 체적에서 $\dfrac{d}{dt}\displaystyle\int_{CV}\rho\,d\mathcal V+\oint_{CS}\rho\mathbf V\cdot\mathbf n\,dA=0$.
발산 정리 $\oint\rho\mathbf V\cdot\mathbf n\,dA=\int\nabla\cdot(\rho\mathbf V)d\mathcal V$, 고정 영역이라 미분을 안으로: $\displaystyle\int_{CV}\Big[\frac{\partial\rho}{\partial t}+\nabla\cdot(\rho\mathbf V)\Big]d\mathcal V=0$.
피적분 함수가 연속이고 어떤 영역에서도 적분이 0이면, 어느 점에서 양수라면 그 주변 작은 영역의 적분이 양수가 되어 모순 → 피적분 함수는 어디서나 0.
전개하면 $\dfrac{D\rho}{Dt}+\rho\nabla\cdot\mathbf V=0$ — 비압축성($D\rho/Dt=0$)이면 $\nabla\cdot\mathbf V=0$.`,
    note: R`8단원 연습 문제의 상자 유도와 같은 결과입니다. 원통 좌표 식은 같은 적분을 원통 요소에서 하거나 발산 연산자를 원통 좌표로 바꿔 얻습니다.` },
  { ch: 'ch08', id: 'eulerEq', title: '오일러 식', keys: ['오일러 식 (비점성)'],
    tags: 'Euler equation inviscid momentum element 오일러 비점성 운동량',
    stmt: R`점성 응력이 없으면 유체 요소의 운동 방정식은 $\rho\,D\mathbf V/Dt=\rho\mathbf g-\nabla p$이다.`,
    body: R`
요소 $d\mathcal V$의 질량 $\rho\,d\mathcal V$, 가속도 $D\mathbf V/Dt$(물질 도함수).
힘: 체적력 $\rho\mathbf g\,d\mathcal V$, 표면력은 압력뿐이고 그 알짜는 $-\nabla p\,d\mathcal V$(2단원). 뉴턴의 제2법칙에서 $d\mathcal V$를 나누면 결과.`,
    note: R`정지 유체($\mathbf V=\mathbf 0$)면 정수압 식, 강체 운동이면 4단원의 식으로 돌아갑니다. 유선을 따라 적분하면 베르누이 식입니다.` },
  { ch: 'ch08', id: 'nsDerive', title: '나비에-스토크스 식의 점성 항', keys: ['나비에-스토크스 식 (비압축성, μ 일정)'],
    tags: 'Navier Stokes viscous term Newtonian constitutive divergence free 나비에 스토크스 점성 항 구성 관계',
    stmt: R`뉴턴 유체 $\tau_{ij}=-p\delta_{ij}+\mu\Big(\dfrac{\partial u_i}{\partial x_j}+\dfrac{\partial u_j}{\partial x_i}\Big)$를 코시 운동 방정식에 넣으면, 비압축성·$\mu$ 일정에서 $\rho\,D\mathbf V/Dt=\rho\mathbf g-\nabla p+\mu\nabla^2\mathbf V$이다.`,
    body: R`
코시 방정식의 $i$ 성분: $\rho\dfrac{Du_i}{Dt}=\rho g_i+\dfrac{\partial\tau_{ij}}{\partial x_j}$(반복 첨자 합).
$\dfrac{\partial\tau_{ij}}{\partial x_j}=-\dfrac{\partial p}{\partial x_i}+\mu\dfrac{\partial^2u_i}{\partial x_j\partial x_j}+\mu\dfrac{\partial}{\partial x_i}\Big(\dfrac{\partial u_j}{\partial x_j}\Big)$.
마지막 괄호는 $\nabla\cdot\mathbf V=0$(비압축성)이라 사라지고, 가운데 항이 $\mu\nabla^2u_i$.`,
    note: R`$\mu$가 온도에 따라 변하면 $\mu$를 미분 밖으로 꺼낼 수 없고, 압축성이면 부피 변형 항 $\lambda\nabla\cdot\mathbf V$가 남습니다.` },
  { ch: 'ch08', id: 'dissip', title: '점성 소산은 음수가 될 수 없다', keys: ['에너지 방정식 (비압축성 근사)'],
    tags: 'viscous dissipation positive strain rate energy equation 점성 소산 변형률 속도',
    stmt: R`비압축성 뉴턴 유체에서 점성 응력이 단위 부피당 하는 일 중 열로 바뀌는 몫은 $\Phi=2\mu e_{ij}e_{ij}\ge0$이다 ($e_{ij}=\frac12(\partial u_i/\partial x_j+\partial u_j/\partial x_i)$).`,
    body: R`
점성 응력 $\tau'_{ij}=2\mu e_{ij}$가 단위 부피당 하는 일률은 $\dfrac{\partial}{\partial x_j}(u_i\tau'_{ij})=u_i\dfrac{\partial\tau'_{ij}}{\partial x_j}+\tau'_{ij}\dfrac{\partial u_i}{\partial x_j}$.
첫 항은 운동 방정식의 점성 힘이 한 일로 운동에너지를 바꿉니다. 둘째 항이 변형에 쓰인 일:
$\tau'_{ij}\dfrac{\partial u_i}{\partial x_j}=2\mu e_{ij}(e_{ij}+\omega_{ij})=2\mu e_{ij}e_{ij}$ — 대칭 $e_{ij}$와 반대칭 회전 텐서 $\omega_{ij}$의 곱의 합은 0이기 때문.
$e_{ij}e_{ij}$는 제곱의 합이므로 $\Phi\ge0$, 등호는 변형이 없을 때(강체 운동)뿐. 이 몫이 내부 에너지 식에 $+\Phi$로 들어갑니다.`,
    note: R`2차원에서 $\Phi=\mu\big[2(\partial u/\partial x)^2+2(\partial v/\partial y)^2+(\partial u/\partial y+\partial v/\partial x)^2\big]$ — 본문 식과 같습니다. 쿠에트 유동이면 $\Phi=\mu(V/h)^2$.` },
  { ch: 'ch08', id: 'kinematicBC', title: '자유 표면의 운동학적 조건', keys: ['대표적인 경계 조건'],
    tags: 'free surface kinematic boundary condition material surface no slip 자유 표면 운동학 조건 경계 조건',
    stmt: R`자유 표면이 $z=\eta(x,y,t)$이면 표면에서 $w=\dfrac{\partial\eta}{\partial t}+u\dfrac{\partial\eta}{\partial x}+v\dfrac{\partial\eta}{\partial y}$이다.`,
    body: R`
표면을 $F(x,y,z,t)=z-\eta(x,y,t)=0$으로 씁니다. 표면 위의 입자는 표면을 떠나지 않으므로(표면을 가로지르는 흐름이 없음), 입자를 따라가며 본 $F$는 계속 0: $DF/Dt=0$.
$\dfrac{DF}{Dt}=\dfrac{\partial F}{\partial t}+u\dfrac{\partial F}{\partial x}+v\dfrac{\partial F}{\partial y}+w\dfrac{\partial F}{\partial z}=-\dfrac{\partial\eta}{\partial t}-u\dfrac{\partial\eta}{\partial x}-v\dfrac{\partial\eta}{\partial y}+w=0$.`,
    note: R`고체 벽의 미끄러짐 없음 조건은 “벽에서 유체 속도 = 벽 속도”라 더 강합니다. 자유 표면은 운동학 조건 하나와 역학 조건(압력, 전단)이 함께 필요합니다 — 표면 모양 $\eta$ 자체가 미지수이기 때문입니다.` },
  );
})();
