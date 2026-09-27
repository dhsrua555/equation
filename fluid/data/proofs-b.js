/* 유도 — Part B·C: 09 유동 함수·정확해 … 15 퍼텐셜 유동 */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 09
  { ch: 'ch09', id: 'psiFlow', title: '유동 함수의 차이는 두 유선 사이의 유량이다', keys: ['유동 함수'],
    tags: 'stream function continuity flow between streamlines 유동 함수 연속 유선 사이 유량',
    stmt: R`$u=\partial\psi/\partial y$, $v=-\partial\psi/\partial x$로 두면 2차원 비압축성 연속 방정식이 저절로 만족되고, $\psi$ 일정선은 유선이며, 두 점을 잇는 곡선을 지나는 단위 깊이당 유량은 $\psi_2-\psi_1$이다.`,
    body: R`
연속: $\dfrac{\partial u}{\partial x}+\dfrac{\partial v}{\partial y}=\dfrac{\partial^2\psi}{\partial x\partial y}-\dfrac{\partial^2\psi}{\partial y\partial x}=0$(혼합 편미분의 순서 교환).
유선: $d\psi=\dfrac{\partial\psi}{\partial x}dx+\dfrac{\partial\psi}{\partial y}dy=-v\,dx+u\,dy$. $d\psi=0\iff dy/dx=v/u$, 즉 유선의 방정식.
유량: 점 1에서 2로 가는 곡선의 요소 $d\mathbf s=(dx,dy)$에서, 진행 방향의 오른쪽을 향한 법선 성분을 곱한 넓이 요소는 $\mathbf n\,ds=(dy,-dx)$. 흐름 $dQ=\mathbf V\cdot\mathbf n\,ds=u\,dy-v\,dx=d\psi$. 적분하면 $Q=\psi_2-\psi_1$ — 곡선의 모양에 무관.`,
    note: R`유선 사이가 좁아지면 같은 $\Delta\psi$를 좁은 폭으로 나르므로 속도가 빠릅니다. 유선 그림에서 선 간격이 속력을 보여 주는 이유입니다.` },
  { ch: 'ch09', id: 'vortRot', title: '와도는 유체 요소 각속도의 두 배다', keys: ['와도'],
    tags: 'vorticity angular velocity element rotation 와도 각속도 요소 회전',
    stmt: R`$xy$ 평면에서 유체 요소의 서로 수직인 두 변이 도는 각속도의 평균은 $\tfrac12\big(\partial v/\partial x-\partial u/\partial y\big)=\tfrac12\omega_z$이다.`,
    body: R`
점 $O$에서 $x$ 방향으로 길이 $dx$인 변 $OA$: 끝 $A$의 $y$ 속도가 $O$보다 $\frac{\partial v}{\partial x}dx$ 크므로, $dt$ 뒤 반시계로 $d\alpha=\frac{\partial v}{\partial x}dt$만큼 돕니다.
$y$ 방향 변 $OB$: 끝 $B$의 $x$ 속도가 $\frac{\partial u}{\partial y}dy$ 크므로 시계로 돕니다 — 반시계 각 $d\beta=-\frac{\partial u}{\partial y}dt$.
요소의 회전 각속도는 두 변의 평균: $\dfrac12\Big(\dfrac{d\alpha}{dt}+\dfrac{d\beta}{dt}\Big)=\dfrac12\Big(\dfrac{\partial v}{\partial x}-\dfrac{\partial u}{\partial y}\Big)$. 두 변의 각의 차이(각이 찌그러지는 비율)는 전단 변형률 속도로, 회전과 따로 셉니다.`,
    note: R`강체 회전($u=-\Omega y$, $v=\Omega x$)에서 $\omega_z=2\Omega$가 되어 “와도 = 각속도의 두 배”가 확인됩니다.` },
  { ch: 'ch09', id: 'potentialBern', title: '비회전 흐름에서는 베르누이 식이 흐름 전체에서 성립한다', keys: ['퍼텐셜 유동'],
    tags: 'irrotational potential Laplace Bernoulli everywhere vector identity 퍼텐셜 라플라스 비회전 베르누이',
    stmt: R`비회전이면 $\mathbf V=\nabla\phi$, 비압축성이면 $\nabla^2\phi=0$(2차원에서 $\nabla^2\psi=0$)이다. 정상·비점성·비압축성·비회전이면 $p/\rho+V^2/2+gz$가 모든 점에서 같다.`,
    body: R`
$\nabla\times\mathbf V=\mathbf 0$이면 선적분 $\int\mathbf V\cdot d\mathbf r$이 경로에 무관(단순 연결 영역)하여 퍼텐셜 $\phi$가 있습니다. $\nabla\cdot\mathbf V=0$에 넣으면 $\nabla^2\phi=0$. 2차원: $\omega_z=\partial v/\partial x-\partial u/\partial y=-\nabla^2\psi=0$.
베르누이: 벡터 항등식 $(\mathbf V\cdot\nabla)\mathbf V=\nabla\big(\tfrac12V^2\big)-\mathbf V\times\boldsymbol\omega$. 정상 오일러 식 $\rho(\mathbf V\cdot\nabla)\mathbf V=-\nabla p-\rho g\nabla z$에 $\boldsymbol\omega=\mathbf 0$을 넣으면
$\nabla\Big(\dfrac p\rho+\dfrac{V^2}2+gz\Big)=\mathbf 0$ — 모든 방향으로 기울기가 0이므로 흐름 전체에서 상수.`,
    note: R`회전 흐름이면 $\mathbf V\times\boldsymbol\omega$ 항이 남아, 이 항에 수직인 방향(유선 방향)으로만 상수가 됩니다. 이것이 “유선을 따라”라는 조건의 출처입니다.` },
  { ch: 'ch09', id: 'parallelFlow', title: '평행 흐름에서 나비에-스토크스 식이 선형이 되는 이유', keys: ['평행 흐름의 나비에-스토크스 식'],
    tags: 'parallel flow fully developed separation constant pressure gradient 평행 흐름 완전 발달 압력 기울기 상수',
    stmt: R`$u=u(y)$, $v=w=0$이면 나비에-스토크스 식은 $\mu\,d^2u/dy^2=dp/dx$로 줄고 양변은 상수다.`,
    body: R`
연속: $\partial u/\partial x=0$ — $u=u(y)$와 모순 없음.
$x$ 운동량의 대류 항 $u\,\partial u/\partial x+v\,\partial u/\partial y=0+0=0$, 정상이라 $\partial u/\partial t=0$. 남는 것: $0=-\partial p/\partial x+\mu\,d^2u/dy^2$(중력은 $y$ 방향이면 $x$ 식에 없음).
$y$ 운동량: $0=-\partial p/\partial y-\rho g$ → $p=-\rho gy+f(x)$, 그러므로 $\partial p/\partial x=f'(x)$는 $y$에 무관.
식 $\mu u''(y)=f'(x)$에서 왼쪽은 $y$만, 오른쪽은 $x$만의 함수 → 둘 다 같은 상수.`,
    note: R`비선형 대류 항이 정확히 0이 되는 것이 핵심입니다. 입구 근처처럼 분포가 $x$에 따라 변하는 곳에서는 이 해가 성립하지 않습니다.` },
  { ch: 'ch09', id: 'couettePois', title: '쿠에트-푸아죄유 유동의 해와 유량', keys: ['쿠에트 유동과 푸아죄유 유동'],
    tags: 'Couette Poiseuille plates flow rate wall shear 쿠에트 푸아죄유 평판 유량 벽 전단',
    stmt: R`판 $y=0$(정지)과 $y=h$(속도 $U$) 사이에서 $u=\dfrac{Uy}h+\dfrac{-dp/dx}{2\mu}y(h-y)$이고 단위 폭 유량은 $q=\dfrac{Uh}2+\dfrac{-dp/dx}{12\mu}h^3$이다.`,
    body: R`
$\mu u''=dp/dx$(상수)를 두 번 적분: $u=\dfrac{1}{2\mu}\dfrac{dp}{dx}y^2+C_1y+C_2$.
$u(0)=0$ → $C_2=0$. $u(h)=U$ → $C_1=\dfrac Uh-\dfrac{h}{2\mu}\dfrac{dp}{dx}$.
정리: $u=\dfrac{Uy}h+\dfrac{1}{2\mu}\dfrac{dp}{dx}(y^2-hy)=\dfrac{Uy}h+\dfrac{-dp/dx}{2\mu}y(h-y)$.
$q=\displaystyle\int_0^hu\,dy=\dfrac{Uh}2+\dfrac{-dp/dx}{2\mu}\Big(\dfrac{h^3}2-\dfrac{h^3}3\Big)=\dfrac{Uh}2+\dfrac{-dp/dx}{12\mu}h^3$.
$U=0$이고 간격을 $2h$로 바꾸면(중심 기준 $y=\pm h$) 본문의 푸아죄유 식 $q=\dfrac{2h^3}{3\mu}(-dp/dx)$가 됩니다.`,
    note: R`압력이 하류로 오르면($dp/dx>0$) 포물선 항이 음수가 되어, $dp/dx>2\mu U/h^2$이면 아래 판 근처에서 역류가 생깁니다.` },
  { ch: 'ch09', id: 'cylinderCouette', title: '동심 원통 사이 흐름의 속도와 토크', keys: ['동심 원통 사이의 쿠에트 유동'],
    tags: 'concentric cylinders Couette viscometer torque rigid rotation free vortex 동심 원통 점도계 토크',
    stmt: R`$v_\theta=v_\theta(r)$만 있는 흐름에서 $v_\theta=Ar+B/r$이고, 안쪽 원통($r_i,\omega_i$), 바깥 원통 정지일 때 길이 $L$당 토크는 $T=\dfrac{4\pi\mu\omega_ir_i^2r_o^2L}{r_o^2-r_i^2}$이다.`,
    body: R`
$\theta$ 방향 나비에-스토크스 식(축대칭, $v_r=0$, $\partial p/\partial\theta=0$): $0=\mu\Big(\dfrac{d^2v_\theta}{dr^2}+\dfrac1r\dfrac{dv_\theta}{dr}-\dfrac{v_\theta}{r^2}\Big)=\mu\dfrac{d}{dr}\Big[\dfrac1r\dfrac{d(rv_\theta)}{dr}\Big]$.
적분: $\dfrac1r\dfrac{d(rv_\theta)}{dr}=2A$ → $rv_\theta=Ar^2+B$ → $v_\theta=Ar+B/r$.
조건 $v_\theta(r_i)=\omega_ir_i$, $v_\theta(r_o)=0$: $B=-Ar_o^2$, $A(r_i-r_o^2/r_i)=\omega_ir_i$ → $A=-\dfrac{\omega_ir_i^2}{r_o^2-r_i^2}$, $B=\dfrac{\omega_ir_i^2r_o^2}{r_o^2-r_i^2}$.
전단 $\tau_{r\theta}=\mu r\dfrac{d}{dr}\Big(\dfrac{v_\theta}r\Big)=\mu r\Big(-\dfrac{2B}{r^3}\Big)=-\dfrac{2\mu B}{r^2}$. 안쪽 원통 표면에서 크기 $2\mu B/r_i^2$, 넓이 $2\pi r_iL$, 팔 $r_i$: $T=\dfrac{2\mu B}{r_i^2}2\pi r_iL\,r_i=4\pi\mu BL$.`,
    note: R`$r_o-r_i=\delta\ll r_i$이면 $r_o^2-r_i^2\approx2r_i\delta$, $r_o^2\approx r_i^2$로 $T\approx\dfrac{2\pi\mu\omega_ir_i^3L}{\delta}$ — 1단원의 선형 분포 근사와 같습니다.` },
  // ───── 10
  { ch: 'ch10', id: 'piTheorem', title: 'Π 정리: 지수의 연립 방정식으로 보기', keys: ['Π 정리', '반복 변수법'],
    tags: 'Buckingham Pi theorem dimension matrix rank null space repeating variables 버킹엄 차원 행렬 계수 반복 변수',
    stmt: R`변수 $q_1,\dots,q_n$의 차원 행렬의 계수가 $j$이면, 서로 독립인 무차원 곱 $q_1^{a_1}\cdots q_n^{a_n}$은 정확히 $n-j$개이고, 반복 변수 $j$개와 나머지 하나씩을 묶어 모두 얻을 수 있다.`,
    body: R`
$q_k$의 차원을 $\mathrm M^{m_k}\mathrm L^{l_k}\mathrm T^{t_k}$라 하면 곱 $\prod q_k^{a_k}$의 차원 지수는 $\sum a_km_k$, $\sum a_kl_k$, $\sum a_kt_k$. 무차원이 될 조건은 차원 행렬 $D$(3×$n$)에 대해 $D\mathbf a=\mathbf 0$ — 동차 연립 방정식.
해 공간(영공간)의 차원은 $n-\operatorname{rank}D=n-j$(계수-영공간 정리). 기저 벡터 하나가 독립인 Π 그룹 하나입니다.
반복 변수법: 계수 $j$인 열 $j$개(반복 변수)를 고르면 그 부분 행렬은 가역입니다. 나머지 변수 $q_r$마다 $a_r=1$로 두면 반복 변수의 지수가 유일하게 정해져 Π가 하나씩, 모두 $n-j$개 — 서로 다른 $q_r$을 하나씩만 담으므로 독립입니다.
물리 법칙은 단위계에 무관해야 하므로, 관계식을 이 무차원 그룹들 사이의 관계로 쓸 수 있다는 것이 정리의 나머지 절반입니다.`,
    note: R`반복 변수가 “서로 무차원 그룹을 만들지 않아야 한다”는 조건이 곧 부분 행렬이 가역이라는 조건입니다. 계수 $j$가 기본 차원 수보다 작은 경우도 있으니(예: 모든 변수에 M과 T가 같은 비로만 나올 때) 개수를 셀 때 계수를 확인합니다.` },
  { ch: 'ch10', id: 'nondimNS', title: '나비에-스토크스 식의 무차원화', keys: ['무차원 나비에-스토크스 식'],
    tags: 'nondimensional Navier Stokes Reynolds number scaling 무차원 레이놀즈',
    stmt: R`$\mathbf x^*=\mathbf x/L$, $\mathbf V^*=\mathbf V/U$, $t^*=tU/L$, $p^*=(p+\rho gz)/(\rho U^2)$로 바꾸면 $\dfrac{D\mathbf V^*}{Dt^*}=-\nabla^*p^*+\dfrac1{Re}\nabla^{*2}\mathbf V^*$이다.`,
    body: R`
미분의 변환: $\nabla=\dfrac1L\nabla^*$, $\dfrac{\partial}{\partial t}=\dfrac UL\dfrac{\partial}{\partial t^*}$. 그러면
$\rho\dfrac{D\mathbf V}{Dt}=\dfrac{\rho U^2}L\dfrac{D\mathbf V^*}{Dt^*}$, $\nabla(p+\rho gz)=\dfrac{\rho U^2}L\nabla^*p^*$, $\mu\nabla^2\mathbf V=\dfrac{\mu U}{L^2}\nabla^{*2}\mathbf V^*$.
($\rho\mathbf g-\nabla p=-\nabla(p+\rho gz)$로 중력을 압력에 흡수.) 모든 항을 $\rho U^2/L$로 나누면 점성 항의 계수가 $\dfrac{\mu U/L^2}{\rho U^2/L}=\dfrac{\mu}{\rho UL}=\dfrac1{Re}$. 연속 방정식은 $\nabla^*\cdot\mathbf V^*=0$ 그대로.`,
    note: R`자유 표면이 있으면 경계 조건 $p=p_a$에 중력이 다시 나타나 $Fr$가 들어옵니다. 이것이 배 모형에서 $Re$와 $Fr$를 둘 다 맞춰야 하는 이유입니다.` },
  { ch: 'ch10', id: 'similarityForce', title: '역학적 상사에서 힘의 환산', keys: ['상사의 세 조건'],
    tags: 'dynamic similarity model prototype force scaling 상사 모형 실물 힘 환산',
    stmt: R`모형과 실물이 기하학적으로 닮고 모든 독립 Π 그룹이 같으면 $\dfrac{F_p}{F_m}=\dfrac{\rho_p}{\rho_m}\Big(\dfrac{V_p}{V_m}\Big)^2\Big(\dfrac{L_p}{L_m}\Big)^2$이다.`,
    body: R`
차원 해석으로 $\dfrac{F}{\rho V^2L^2}=g(\Pi_1,\Pi_2,\dots)$(기하 비율 포함). 모형과 실물에서 괄호 안이 모두 같으면 $g$의 값이 같으므로 $\dfrac{F_m}{\rho_mV_m^2L_m^2}=\dfrac{F_p}{\rho_pV_p^2L_p^2}$. 정리하면 결과.
운동학적 상사(유선이 닮음)는 이 조건의 결과로 따라옵니다: 무차원 해가 같으니 무차원 속도장도 같습니다.`,
    note: R`하나라도 Π가 다르면(배의 $Re$) $g$가 달라 환산에 오차가 생깁니다. 그 그룹에 대한 $g$의 의존성이 약한 영역(높은 $Re$)을 이용하거나, 그 효과를 따로 계산해 보정합니다.` },
  // ───── 11
  { ch: 'ch11', id: 'entranceScale', title: '층류 입구 길이가 레이놀즈 수에 비례하는 이유', keys: ['입구 길이', '관 유동의 영역'],
    tags: 'entrance length boundary layer growth scaling laminar Reynolds 입구 길이 경계층 크기',
    stmt: R`층류 입구 길이는 $L_e/D\sim Re$이다(실험 계수 0.06). 판정 기준 $Re\approx2300$은 경험값이다.`,
    body: R`
입구에서 벽 경계층은 $\delta\sim\sqrt{\nu x/V}$로 자랍니다(13단원 $\delta/x\sim Re_x^{-1/2}$). 경계층이 관 중심에서 만나는 곳 $\delta\sim D/2$에서 완전 발달:
$\dfrac{D}{2}\sim\sqrt{\dfrac{\nu L_e}V}$ → $L_e\sim\dfrac{VD^2}{4\nu}$ → $\dfrac{L_e}D\sim\dfrac{Re}4$.
크기 비교라 계수는 정확하지 않지만(실제 0.06) $Re$에 비례한다는 점은 맞습니다.
층류-난류 경계는 이렇게 유도되지 않습니다. 작은 교란이 커지는지 가라앉는지의 안정성 문제이고, 관에서는 선형 해석으로 설명되지 않아 실험값 2300을 씁니다.`,
    note: R`난류는 섞임이 경계층 성장을 빠르게 해 $L_e/D\approx4.4Re^{1/6}$로 훨씬 짧습니다. 이 식도 실험 상관식입니다.` },
  { ch: 'ch11', id: 'darcy', title: '수두 손실, 벽 전단, 다르시 마찰 계수', keys: ['수두 손실과 벽 전단', '다르시-바이스바흐 식'],
    tags: 'head loss wall shear Darcy Weisbach friction factor force balance 수두 손실 벽 전단 다르시',
    stmt: R`완전 발달 원관 유동에서 $h_f=\dfrac{4\tau_w}{\rho g}\dfrac LD$이고, $f=8\tau_w/(\rho V^2)$로 두면 $h_f=f\dfrac LD\dfrac{V^2}{2g}$이다.`,
    body: R`
관 속 길이 $L$ 물 기둥, 관 축이 수평과 각 $\phi$(위로 +)를 이룹니다. 완전 발달이라 입출구 운동량 플럭스가 같아 알짜 힘 0:
$(p_1-p_2)\pi R^2-\rho g\pi R^2L\sin\phi-\tau_w2\pi RL=0$. $L\sin\phi=z_2-z_1$이므로
$\dfrac{p_1-p_2}{\rho g}+(z_1-z_2)=\dfrac{2\tau_wL}{\rho gR}=\dfrac{4\tau_w}{\rho g}\dfrac LD$.
에너지 방정식(속도 수두 같음): 왼쪽이 $h_f$. $\tau_w=f\rho V^2/8$을 넣으면 $h_f=\dfrac{4}{\rho g}\dfrac{f\rho V^2}8\dfrac LD=f\dfrac LD\dfrac{V^2}{2g}$.`,
    note: R`이 관계는 층류·난류 모두에서 성립합니다. 흐름의 종류는 $\tau_w$(곧 $f$)를 정하는 데서만 달라집니다.` },
  { ch: 'ch11', id: 'hagen', title: '하겐-푸아죄유: 속도 분포에서 마찰 계수까지', keys: ['하겐-푸아죄유 유동'],
    tags: 'Hagen Poiseuille laminar pipe parabolic flow rate friction factor 하겐 푸아죄유 층류 포물선',
    stmt: R`층류 원관에서 $u=\dfrac{-dp/dx}{4\mu}(R^2-r^2)$, $Q=\dfrac{\pi R^4}{8\mu}\Big(-\dfrac{dp}{dx}\Big)$, $u_{\max}=2V$, $f=64/Re$, $h_f=\dfrac{32\mu LV}{\rho gD^2}$이다.`,
    body: R`
반지름 $r$ 물 기둥의 힘 평형(11단원 본문): $\tau=\dfrac r2\Big(-\dfrac{dp}{dx}\Big)$. 층류 $\tau=-\mu\,du/dr$:
$u=\dfrac{-dp/dx}{4\mu}(R^2-r^2)$($u(R)=0$). 중심 $u_{\max}=\dfrac{-dp/dx}{4\mu}R^2$.
$Q=\displaystyle\int_0^Ru\,2\pi r\,dr=\dfrac{\pi R^4}{8\mu}\Big(-\dfrac{dp}{dx}\Big)$, $V=\dfrac{Q}{\pi R^2}=\dfrac{R^2}{8\mu}\Big(-\dfrac{dp}{dx}\Big)=\dfrac{u_{\max}}2$.
$\tau_w=\dfrac R2\Big(-\dfrac{dp}{dx}\Big)=\dfrac{4\mu V}R=\dfrac{8\mu V}D$ → $f=\dfrac{8\tau_w}{\rho V^2}=\dfrac{64\mu}{\rho VD}=\dfrac{64}{Re}$.
$h_f=f\dfrac LD\dfrac{V^2}{2g}=\dfrac{64\mu}{\rho VD}\dfrac LD\dfrac{V^2}{2g}=\dfrac{32\mu LV}{\rho gD^2}$.`,
    note: R`기울어진 관이면 $-dp/dx$ 자리에 $-d(p+\rho gz)/dx$를 씁니다. 11단원 연습 문제와 같은 유도를 마찰 계수까지 이어 간 것입니다.` },
  { ch: 'ch11', id: 'reyStress', title: '평균을 취하면 레이놀즈 응력이 나타난다', keys: ['레이놀즈 응력'],
    tags: 'Reynolds averaging stress turbulent fluctuation 레이놀즈 평균 응력 난류 요동',
    stmt: R`$u=\bar u+u'$, $v=\bar v+v'$로 나누어 시간 평균하면 평균 운동 방정식에 $-\rho\overline{u'v'}$가 점성 응력과 더해진 응력으로 나타난다.`,
    body: R`
평균의 규칙: $\overline{u'}=0$, $\overline{\bar u\,u'}=\bar u\,\overline{u'}=0$, 그러나 $\overline{u'v'}$는 일반적으로 0이 아님.
연속 방정식이 평균에도 성립($\nabla\cdot\bar{\mathbf V}=0$, $\nabla\cdot\mathbf V'=0$)하므로 대류 항을 발산 꼴로 쓸 수 있습니다: $u\dfrac{\partial u}{\partial x}+v\dfrac{\partial u}{\partial y}=\dfrac{\partial(uu)}{\partial x}+\dfrac{\partial(uv)}{\partial y}$.
평균: $\overline{uv}=\bar u\bar v+\overline{u'v'}$. 요동 곱의 평균을 오른쪽으로 옮기면
$\rho\Big(\bar u\dfrac{\partial\bar u}{\partial x}+\bar v\dfrac{\partial\bar u}{\partial y}\Big)=-\dfrac{\partial\bar p}{\partial x}+\dfrac{\partial}{\partial y}\Big(\mu\dfrac{\partial\bar u}{\partial y}-\rho\overline{u'v'}\Big)+\cdots$
괄호가 전체 전단 응력 — 둘째 항이 레이놀즈 응력입니다.`,
    note: R`벽에서 빠른 유체가 아래로($v'<0$) 내려오면 $u'>0$이라 $\overline{u'v'}<0$ — 레이놀즈 응력은 양수로, 운동량을 벽 쪽으로 나릅니다. 이 새 미지수를 정하는 것이 난류 모델링의 문제(닫힘 문제)입니다.` },
  { ch: 'ch11', id: 'logLawOverlap', title: '겹침 영역 논법으로 얻는 로그 법칙', keys: ['벽 법칙'],
    tags: 'log law overlap inner outer variables friction velocity Karman constant 로그 법칙 겹침 마찰 속도',
    stmt: R`벽 근처에서 $\bar u/u^*=F(yu^*/\nu)$, 관 중심 쪽에서 $(U_c-\bar u)/u^*=G(y/R)$가 둘 다 성립하는 겹침 영역이 있으면, 그곳에서 $\bar u/u^*=\tfrac1\kappa\ln(yu^*/\nu)+B$이다.`,
    body: R`
두 식을 $y$로 미분합니다.
안쪽: $\dfrac{d\bar u}{dy}=u^*F'(y^+)\dfrac{u^*}\nu$. 바깥쪽: $\dfrac{d\bar u}{dy}=-\dfrac{u^*}RG'(\eta)$($\eta=y/R$).
양변에 $y/u^*$를 곱하면 $y^+F'(y^+)=-\eta G'(\eta)$. 왼쪽은 $y^+$만, 오른쪽은 $\eta$만의 함수인데, $y^+=\eta\,Ru^*/\nu$이고 $Ru^*/\nu$가 매우 커서 두 변수가 독립적으로 움직일 수 있으므로 둘 다 상수 $1/\kappa$.
$F'(y^+)=\dfrac{1}{\kappa y^+}$ → $F=\dfrac1\kappa\ln y^++B$.`,
    note: R`$\kappa\approx0.41$, $B\approx5.0$은 실험으로 정합니다. 같은 논법으로 바깥쪽에서는 $G=-\tfrac1\kappa\ln\eta+$상수(속도 결손 법칙)를 얻습니다.` },
  { ch: 'ch11', id: 'smoothPipeF', title: '로그 법칙을 적분해 얻는 매끈한 관의 마찰 계수', keys: ['콜브룩 식과 할란드 식'],
    tags: 'smooth pipe friction factor Prandtl log law integration Colebrook Haaland 매끈한 관 마찰 계수 프란틀 콜브룩',
    stmt: R`로그 법칙이 관 단면 전체에서 성립한다고 보면 $\dfrac1{\sqrt f}\approx1.99\log_{10}(Re\sqrt f)-1.02$이고, 실험으로 계수를 맞춘 프란틀 식은 $\dfrac1{\sqrt f}=2.0\log_{10}(Re\sqrt f)-0.8$이다.`,
    body: R`
$u(r)=u^*\Big[\dfrac1\kappa\ln\dfrac{(R-r)u^*}\nu+B\Big]$를 단면 평균:
$V=\dfrac{1}{\pi R^2}\displaystyle\int_0^Ru\,2\pi r\,dr=u^*\Big[\dfrac1\kappa\ln\dfrac{Ru^*}\nu+B-\dfrac{3}{2\kappa}\Big]$ ($\int_0^1\ln(1-s)\,2s\,ds=-3/2$).
$u^*/V=\sqrt{f/8}$(11단원 $f=8\tau_w/\rho V^2$), $\dfrac{Ru^*}\nu=\dfrac{Re}2\sqrt{\dfrac f8}$.
$\sqrt{\dfrac8f}=\dfrac1\kappa\ln\Big(\dfrac{Re\sqrt f}{2\sqrt8}\Big)+B-\dfrac3{2\kappa}$. $\sqrt8$로 나누고 $\kappa=0.41$, $B=5.0$:
$\dfrac1{\sqrt f}=\dfrac{2.3026}{0.41\sqrt8}\log_{10}(Re\sqrt f)+\dfrac{-\ln(2\sqrt8)/\kappa+B-1.5/\kappa}{\sqrt8}=1.99\log_{10}(Re\sqrt f)-1.02$.`,
    note: R`로그 법칙은 벽 바로 옆과 관 중심에서 정확하지 않아 상수가 조금 어긋납니다. 프란틀은 실험에 맞춰 −0.8로 고쳤고, 콜브룩은 거칠기 항 $\frac{\varepsilon/D}{3.7}$을 로그 안에 더해 매끈한 관과 완전히 거친 관을 잇는 보간식을 만들었습니다. 할란드 식은 콜브룩 식을 $f$에 대해 명시적으로 근사한 것입니다.` },
  // ───── 12
  { ch: 'ch12', id: 'fourTypes', title: '유량을 모를 때 콜브룩 식을 한 번에 푸는 법', keys: ['네 유형'],
    tags: 'pipe flow problem types flow rate unknown Re sqrt f Colebrook 관로 문제 유형 유량',
    stmt: R`$h_f,D,L$이 주어지면 $f\,Re^2=\dfrac{2gh_fD^3}{L\nu^2}$이 알려진 값이므로, 콜브룩 식의 $Re\sqrt f$ 자리에 그 제곱근을 넣으면 $f$가 바로 나온다.`,
    body: R`
다르시 식 $h_f=f\dfrac LD\dfrac{V^2}{2g}$에 $V=Re\,\nu/D$를 넣으면 $h_f=f\dfrac{L}{D}\dfrac{Re^2\nu^2}{2gD^2}$ → $f\,Re^2=\dfrac{2gh_fD^3}{L\nu^2}$(모두 알려짐).
콜브룩 식 $\dfrac1{\sqrt f}=-2\log_{10}\Big(\dfrac{\varepsilon/D}{3.7}+\dfrac{2.51}{Re\sqrt f}\Big)$의 오른쪽은 $Re\sqrt f=\sqrt{fRe^2}$만 담으므로 계산 가능 → $f$. 그 다음 $Re=\sqrt{fRe^2}/\sqrt f$, $V=Re\,\nu/D$.`,
    note: R`지름을 구하는 문제는 $D$가 $\varepsilon/D$와 $Re$에 모두 섞여 이 요령이 통하지 않습니다. 대신 $f$를 가정하고 몇 번 반복합니다.` },
  { ch: 'ch12', id: 'hydraulicD', title: '수력 지름이 나오는 이유', keys: ['수력 지름'],
    tags: 'hydraulic diameter noncircular duct force balance perimeter 수력 지름 비원형 덕트 둘레',
    stmt: R`단면적 $A$, 젖은 둘레 $P$인 덕트에서 평균 벽 전단 $\bar\tau_w$로 쓰면 $h_f=\dfrac{4\bar\tau_w}{\rho g}\dfrac L{D_h}$, $D_h=4A/P$이다.`,
    body: R`
완전 발달 흐름, 길이 $L$(수평): 압력 힘 $\Delta p\,A$와 벽 전단 $\bar\tau_wPL$이 평형 → $\Delta p=\bar\tau_w\dfrac{PL}A$.
$h_f=\dfrac{\Delta p}{\rho g}=\dfrac{\bar\tau_w}{\rho g}\dfrac{PL}A=\dfrac{4\bar\tau_w}{\rho g}\dfrac{L}{4A/P}$.
원관이면 $4A/P=4(\pi D^2/4)/(\pi D)=D$로 11단원 식과 같습니다. 그래서 $D$ 자리에 $D_h$를 넣으면 형태가 같아지고, 난류에서는 벽 근처 흐름이 모양에 둔감해 $f(Re_{D_h},\varepsilon/D_h)$도 원관 값에 가깝습니다.`,
    note: R`층류는 단면 전체의 속도 분포가 모양에 민감해 $fRe$가 모양마다 다르고(정사각형 약 57, 평판 틈 96), 좁은 모서리가 있는 단면은 난류에서도 오차가 커집니다.` },
  { ch: 'ch12', id: 'bordaCarnot', title: '급확대 손실과 출구 손실', keys: ['부차 손실', '급확대와 급축소'],
    tags: 'sudden expansion Borda Carnot minor loss exit loss momentum energy 급확대 보르다 카르노 부차 손실 출구',
    stmt: R`급확대의 손실은 $h_m=\dfrac{(V_1-V_2)^2}{2g}$, 즉 $K=(1-A_1/A_2)^2$이고, 저수조로 나가는 출구는 $A_2\to\infty$로 $K=1$이다.`,
    body: R`
검사 체적: 확대부 바로 뒤 단면(넓이 $A_2$, 분류 둘레의 정체된 모서리 압력 ≈ $p_1$)에서 흐름이 다시 고르게 된 단면 2까지. 짧아 벽 마찰 무시, 수평.
운동량: $(p_1-p_2)A_2=\rho Q(V_2-V_1)=\rho A_2V_2(V_2-V_1)$ → $\dfrac{p_1-p_2}{\rho g}=\dfrac{V_2^2-V_1V_2}g$.
에너지: $h_m=\dfrac{p_1-p_2}{\rho g}+\dfrac{V_1^2-V_2^2}{2g}=\dfrac{2V_2^2-2V_1V_2+V_1^2-V_2^2}{2g}=\dfrac{(V_1-V_2)^2}{2g}$.
$V_2=V_1A_1/A_2$로 $h_m=(1-A_1/A_2)^2\dfrac{V_1^2}{2g}$. $A_2\to\infty$: $V_2\to0$, $h_m=V_1^2/2g$.`,
    note: R`나머지 부차 손실 계수(굽이, 밸브, 입구)는 이렇게 유도되지 않아 실험값을 씁니다. 급축소는 축류 뒤 다시 넓어지는 부분이 사실상 급확대라, 같은 논리로 크기를 짐작할 수 있습니다.` },
  { ch: 'ch12', id: 'parallelSplit', title: '병렬 관의 유량 배분', keys: ['직렬과 병렬'],
    tags: 'parallel pipes series flow split equal head loss 병렬 직렬 유량 배분',
    stmt: R`같은 두 접점 사이 병렬 관은 손실이 같으므로 $Q_i=\dfrac\pi4D_i^2\sqrt{\dfrac{2gh_fD_i}{f_iL_i}}$, 즉 $Q_i\propto D_i^{5/2}(f_iL_i)^{-1/2}$로 나뉜다.`,
    body: R`
두 접점의 에너지 수두 $H_A$, $H_B$는 하나씩이므로 어느 가지를 따라가도 $H_A-H_B=h_{f,i}$(부차 손실 무시). 각 가지: $h_f=f_i\dfrac{L_i}{D_i}\dfrac{V_i^2}{2g}$ → $V_i=\sqrt{\dfrac{2gh_fD_i}{f_iL_i}}$, $Q_i=\dfrac\pi4D_i^2V_i$.
전체 유량 $Q=\sum Q_i=\sqrt{h_f}\sum_i\dfrac\pi4D_i^2\sqrt{\dfrac{2gD_i}{f_iL_i}}$ → $h_f$를 구하고 되돌려 넣습니다.
직렬은 같은 $Q$가 모든 관을 지나므로 $h=\sum_ih_{f,i}$ — 전기 저항의 직렬·병렬과 같은 구조(단, 손실이 $Q^2$에 비례).`,
    note: R`$f_i$가 $Re_i$에 따라 조금씩 달라 정확히 하려면 한두 번 반복합니다. 굵은 관은 $D^{5/2}$로 유리해 대부분의 유량을 가져갑니다.` },
  { ch: 'ch12', id: 'orificeMeter', title: '차압 유량계의 유량 식', keys: ['차압 유량계'],
    tags: 'orifice nozzle venturi discharge coefficient vena contracta 오리피스 노즐 벤투리 유량 계수 축류',
    stmt: R`목 넓이 $A_t$, 지름비 $\beta$인 차압 유량계에서 $Q=C_dA_t\sqrt{\dfrac{2\Delta p}{\rho(1-\beta^4)}}$이다.`,
    body: R`
이상 흐름(마찰 없음, 목에서 흐름이 목 넓이를 채움): 7단원 벤투리관 유도 그대로 $Q_{\text{이상}}=A_t\sqrt{\dfrac{2\Delta p}{\rho(1-\beta^4)}}$.
실제로는 (1) 마찰 손실이 있고 (2) 오리피스에서는 분류가 구멍 뒤에서 더 좁아져 실제 최소 단면이 $A_t$보다 작으며 (3) 압력 구멍 위치가 이상 위치와 다릅니다. 이 효과를 모두 묶어 실험으로 정한 $C_d=Q_{\text{실제}}/Q_{\text{이상}}$을 곱합니다.`,
    note: R`$C_d$는 $\beta$와 $Re$에 따라 조금 변합니다. 표준 규격(ISO 5167)이 모양과 압력 구멍 위치를 정해 두는 것은 같은 $C_d$를 재현하기 위해서입니다.` },
  // ───── 13
  { ch: 'ch13', id: 'blThin', title: '경계층 두께의 크기 추정', keys: ['경계층 개념 (프란틀, 1904)'],
    tags: 'boundary layer thickness order of magnitude scaling Reynolds 경계층 두께 크기 비교',
    stmt: R`경계층 안에서 관성과 점성이 같은 크기라는 조건에서 $\delta/L\sim Re_L^{-1/2}$이다.`,
    body: R`
층 안의 관성 $\sim\rho U^2/L$(흐름 방향 길이 $L$), 점성 $\sim\mu U/\delta^2$(벽에 수직한 방향의 기울기 척도가 $\delta$).
경계층은 점성이 관성과 경쟁하는 층이므로 $\rho U^2/L\sim\mu U/\delta^2$ → $\delta^2\sim\dfrac{\mu L}{\rho U}$ → $\dfrac\delta L\sim\sqrt{\dfrac{\nu}{UL}}=Re_L^{-1/2}$.
$Re_L=10^6$이면 $\delta/L\sim10^{-3}$ — 층이 매우 얇아 바깥은 비점성으로 봐도 됩니다.`,
    note: R`같은 논리로 흐름 방향 점성 항 $\mu U/L^2$은 $\mu U/\delta^2$보다 $(\delta/L)^2$배 작아 버릴 수 있습니다 — 경계층 방정식의 근거입니다.` },
  { ch: 'ch13', id: 'momIntegral', title: '평판의 항력은 잃은 운동량 플럭스다', keys: ['경계층의 두께들', '카르만의 운동량 적분식 (평판)'],
    tags: 'momentum integral displacement thickness momentum thickness flat plate drag 운동량 적분 배제 두께 운동량 두께',
    stmt: R`압력이 일정한 평판에서 앞전부터 $x$까지의 마찰 항력(폭 $b$)은 $D=\rho U^2b\theta$이고, 따라서 $\tau_w=\rho U^2\,d\theta/dx$이다.`,
    body: R`
검사 체적: 앞전 앞의 입구(높이 $h$, 속도 $U$ 균일), 위치 $x$의 출구(속도 $u(y)$, $0\le y\le\delta$), 판, 그리고 위쪽 유선(검사면을 유선으로 잡아 유량이 없음). 압력은 어디서나 같아 힘이 없습니다.
질량: $Uh=\int_0^\delta u\,dy$ ($h$는 출구 높이 $\delta$보다 조금 작음).
운동량($x$): 판이 유체에 주는 힘 $-D=\rho b\int_0^\delta u^2dy-\rho bU^2h$.
$U^2h=U\int u\,dy$를 넣으면 $D=\rho b\displaystyle\int_0^\delta u(U-u)dy=\rho bU^2\int_0^\delta\frac uU\Big(1-\frac uU\Big)dy=\rho U^2b\theta$.
$D(x)=\int_0^x\tau_wb\,dx$이므로 미분하면 $\tau_w=\rho U^2d\theta/dx$.
같은 질량식에서 $U(\delta-h)=\int(U-u)dy=U\delta^*$ — 위쪽 유선이 $\delta^*$만큼 밀려났다는 것이 배제 두께의 뜻입니다.`,
    note: R`압력 기울기가 있으면 $\dfrac{\tau_w}{\rho U^2}=\dfrac{d\theta}{dx}+(2\theta+\delta^*)\dfrac1U\dfrac{dU}{dx}$가 됩니다(일반 카르만 적분식).` },
  { ch: 'ch13', id: 'blEq', title: '프란틀 경계층 방정식의 차수 비교', keys: ['프란틀의 경계층 방정식'],
    tags: 'boundary layer equations order of magnitude pressure across layer 경계층 방정식 차수 비교',
    stmt: R`$\delta\ll L$이면 2차원 정상 나비에-스토크스 식에서 $\partial^2u/\partial x^2$를 버리고, $y$ 운동량은 $\partial p/\partial y\approx0$으로 줄어든다.`,
    body: R`
크기: $x\sim L$, $y\sim\delta$, $u\sim U$. 연속 $\partial u/\partial x+\partial v/\partial y=0$에서 $v\sim U\delta/L$(작음).
$x$ 운동량의 점성 항: $\partial^2u/\partial x^2\sim U/L^2$, $\partial^2u/\partial y^2\sim U/\delta^2$ → 앞의 것은 $(\delta/L)^2$배 작아 버림. 관성 $u\,\partial u/\partial x\sim v\,\partial u/\partial y\sim U^2/L$ 둘 다 남음.
$y$ 운동량의 모든 관성·점성 항은 $x$ 운동량의 대응 항보다 $\delta/L$배 작습니다. 그래서 $\partial p/\partial y\sim\rho U^2\delta/L^2$, 층을 가로지르는 압력 변화 $\Delta p\sim\rho U^2(\delta/L)^2$ — 무시할 만합니다.
층 안의 압력은 바깥 흐름의 압력이고, 바깥은 비점성이라 베르누이: $-\frac1\rho\frac{dp}{dx}=U\frac{dU}{dx}$.`,
    note: R`곡률이 큰 벽이나 박리점 근처에서는 가정이 깨져 경계층 방정식이 정확하지 않습니다.` },
  { ch: 'ch13', id: 'blasiusSim', title: '블라시우스 방정식과 층류 평판 계수', keys: ['평판 층류 (블라시우스)'],
    tags: 'Blasius similarity solution flat plate laminar skin friction 블라시우스 상사해 평판 층류 마찰',
    stmt: R`$\eta=y\sqrt{U/(\nu x)}$, $\psi=\sqrt{\nu Ux}\,f(\eta)$로 두면 평판 경계층 방정식은 $2f'''+ff''=0$이 되고, 수치해 $f''(0)=0.332$에서 $c_f=0.664/\sqrt{Re_x}$, $C_D=1.328/\sqrt{Re_L}$이다.`,
    body: R`
$u=\partial\psi/\partial y=Uf'(\eta)$, $v=-\partial\psi/\partial x=\tfrac12\sqrt{\nu U/x}\,(\eta f'-f)$.
$\partial\eta/\partial x=-\eta/(2x)$, $\partial\eta/\partial y=\sqrt{U/(\nu x)}$로 계산하면
$u\dfrac{\partial u}{\partial x}=-\dfrac{U^2}{2x}\eta f'f''$, $v\dfrac{\partial u}{\partial y}=\dfrac{U^2}{2x}(\eta f'-f)f''$, $\nu\dfrac{\partial^2u}{\partial y^2}=\dfrac{U^2}{x}f'''$.
$dU/dx=0$인 경계층 방정식: $-\dfrac{U^2}{2x}ff''=\dfrac{U^2}xf'''$ → $2f'''+ff''=0$, 조건 $f(0)=f'(0)=0$, $f'(\infty)=1$.
$\tau_w=\mu\dfrac{\partial u}{\partial y}\Big\rvert_0=\mu U\sqrt{\dfrac U{\nu x}}f''(0)$ → $c_f=\dfrac{\tau_w}{\frac12\rho U^2}=\dfrac{2f''(0)}{\sqrt{Re_x}}=\dfrac{0.664}{\sqrt{Re_x}}$.
$C_D=\dfrac1L\displaystyle\int_0^Lc_f\,dx=\dfrac{2(0.664)}{\sqrt{Re_L}}=\dfrac{1.328}{\sqrt{Re_L}}$.`,
    note: R`$f''(0)=0.332$와 $f'=0.99$가 되는 $\eta\approx5.0$은 수치 적분(사격법)으로 얻습니다. 속도 분포가 $\eta$ 하나로 모든 $x$에서 같은 모양 — 상사해입니다.` },
  { ch: 'ch13', id: 'turbPlate', title: '1/7 제곱 분포로 얻는 난류 평판 식', keys: ['평판 난류 (1/7 제곱 분포 근사)'],
    tags: 'turbulent flat plate one seventh power law momentum integral 난류 평판 1/7 제곱',
    stmt: R`$u/U=(y/\delta)^{1/7}$과 관 유동에서 가져온 $c_f\approx0.02Re_\delta^{-1/6}$를 운동량 적분식에 넣으면 $\delta/x\approx0.16Re_x^{-1/7}$, $c_f\approx0.027Re_x^{-1/7}$, $C_D\approx0.031Re_L^{-1/7}$이다.`,
    body: R`
$\theta=\delta\displaystyle\int_0^1\eta^{1/7}(1-\eta^{1/7})d\eta=\delta\Big(\frac78-\frac79\Big)=\frac7{72}\delta$.
운동량 적분식 $c_f=2\,d\theta/dx=\dfrac7{36}\dfrac{d\delta}{dx}$. 1/7 분포는 벽 기울기가 무한대라 $\tau_w$를 분포로 구할 수 없어 관 유동의 상관식 $c_f=0.02(\nu/U\delta)^{1/6}$을 빌립니다.
$\dfrac7{36}\dfrac{d\delta}{dx}=0.02\Big(\dfrac\nu U\Big)^{1/6}\delta^{-1/6}$ → $\dfrac67\delta^{7/6}=0.1029\Big(\dfrac\nu U\Big)^{1/6}x$ → $\dfrac\delta x=0.12^{6/7}Re_x^{-1/7}=0.16Re_x^{-1/7}$.
$c_f=0.02Re_\delta^{-1/6}=0.02(0.16)^{-1/6}Re_x^{-1/7}=0.027Re_x^{-1/7}$.
$C_D=\dfrac1L\displaystyle\int_0^Lc_f\,dx=\dfrac76c_f(L)=0.031Re_L^{-1/7}$.`,
    note: R`앞전부터 난류라고 가정한 식입니다. 앞부분이 층류면 그만큼 항력이 줄어, 천이 위치를 고려한 보정식(예: $C_D\approx0.031Re_L^{-1/7}-1440/Re_L$)을 씁니다.` },
  { ch: 'ch13', id: 'sepCond', title: '벽에서의 경계층 방정식과 박리', keys: ['박리의 조건'],
    tags: 'separation adverse pressure gradient wall curvature inflection 박리 역압력 기울기 변곡점',
    stmt: R`벽에서 $\mu\,\partial^2u/\partial y^2\rvert_w=dp/dx$이므로, $dp/dx>0$이면 벽 근처 분포가 위로 휘어 변곡점을 가지며, 벽 전단이 0이 되는 곳에서 박리한다.`,
    body: R`
벽($y=0$)에서 $u=v=0$이라 경계층 방정식의 왼쪽(관성)이 0: $0=-\dfrac{dp}{dx}+\mu\dfrac{\partial^2u}{\partial y^2}\Big\rvert_w$.
경계층 끝에서는 $u\to U$로 다가가며 $\partial^2u/\partial y^2\to0^-$(위로 볼록한 모양이 평평해짐).
$dp/dx<0$: 벽에서도 $\partial^2u/\partial y^2<0$ — 분포가 어디서나 볼록, 안정.
$dp/dx>0$: 벽에서 $\partial^2u/\partial y^2>0$인데 바깥에서는 음수 → 사이 어딘가에 0(변곡점). 압력이 계속 오르면 벽 근처 유체가 느려져 $\partial u/\partial y\rvert_w$가 줄고, 0이 되는 점 뒤에서는 음수(역류). 이 점이 박리점입니다.`,
    note: R`변곡점이 있는 분포는 불안정성 이론에서도 불안정해, 역압력 기울기는 천이도 앞당깁니다.` },
  // ───── 14
  { ch: 'ch14', id: 'stokesTerminal', title: '스토크스 항력의 크기와 종단 속도', keys: ['스토크스 흐름 ($Re<1$)', '종단 속도', '항력 계수'],
    tags: 'Stokes drag creeping flow terminal velocity dimensional analysis 스토크스 항력 종단 속도 차원',
    stmt: R`관성을 무시하면 구의 항력은 $F=C\mu UD$ 꼴이고(스토크스의 해 $C=3\pi$), 이때 $C_D=24/Re$, 종단 속도 $V_t=(\rho_s-\rho)gD^2/(18\mu)$이다.`,
    body: R`
관성을 버린 식 $\nabla p=\mu\nabla^2\mathbf V$에는 $\rho$가 없으므로 항력은 $\mu,U,D$만의 함수입니다. 힘(MLT⁻²)을 만드는 조합은 $\mu UD$ 하나 → $F=C\mu UD$. 상수 $C=3\pi$는 이 식을 구 둘레에서 풀어 얻습니다(스토크스, 1851).
$C_D=\dfrac{3\pi\mu UD}{\tfrac12\rho U^2\cdot\pi D^2/4}=\dfrac{24\mu}{\rho UD}=\dfrac{24}{Re}$.
종단: 무게 − 부력 = 항력, $(\rho_s-\rho)g\dfrac{\pi D^3}6=3\pi\mu V_tD$ → $V_t=\dfrac{(\rho_s-\rho)gD^2}{18\mu}$.
일반적인 $Re$에서는 $(\rho_s-\rho)g\mathcal V=C_D\tfrac12\rho V_t^2A$를 $C_D(Re)$와 함께 풉니다 — $C_D$가 $V_t$에 의존하므로 반복.`,
    note: R`$Re$가 1을 넘으면 관성이 항력을 늘려 $C_D>24/Re$가 됩니다(오센 보정 $C_D\approx\frac{24}{Re}(1+\frac3{16}Re)$). 계산 뒤 반드시 $Re$를 확인합니다.` },
  { ch: 'ch14', id: 'strouhalDA', title: '와류 방출 주파수의 차원 해석', keys: ['와류 방출'],
    tags: 'vortex shedding Strouhal dimensional analysis Karman street 와류 방출 스트로할',
    stmt: R`원기둥 뒤 와류 방출 주파수는 $fD/U=g(Re)$ 꼴이고, 넓은 $Re$ 범위에서 $g\approx0.2$로 거의 일정하다.`,
    body: R`
$f$가 $U,D,\rho,\mu$에 의존: $n=5$, $j=3$ → Π 둘: $St=fD/U$, $Re$. 따라서 $St=g(Re)$.
$g$의 값은 실험으로 정합니다. $10^2\lesssim Re\lesssim10^5$에서 약 0.2 — 와열의 간격이 지름의 약 5배이고 와류가 흐름 속도의 일정 비율로 떠내려간다는 관찰과 맞습니다.`,
    note: R`예: 지름 5 cm 굴뚝 모형에 바람 10 m/s면 40 Hz. 실제 굴뚝의 고유 진동수와 겹치지 않도록 나선형 띠(스트레이크)를 감아 와류를 흩트립니다.` },
  { ch: 'ch14', id: 'inducedDrag', title: '타원 양력 분포에서 얻는 유도 항력', keys: ['유한 날개와 유도 항력', '양력 계수와 실속'],
    tags: 'induced drag elliptic lift distribution downwash aspect ratio lifting line 유도 항력 타원 분포 내리흐름 가로세로비',
    stmt: R`폭 $b$, 평면 넓이 $A_p$인 날개의 순환이 타원 분포 $\Gamma(y)=\Gamma_0\sqrt{1-(2y/b)^2}$이면, 내리흐름이 균일한 $w=\Gamma_0/(2b)$이고 $C_{Di}=C_L^2/(\pi AR)$이다.`,
    body: R`
단면마다 쿠타-주콥스키(15단원) $dL=\rho U\Gamma(y)dy$ → $L=\rho U\Gamma_0\dfrac{\pi b}4$(반타원 넓이).
$C_L=\dfrac{L}{\frac12\rho U^2A_p}=\dfrac{\pi b\Gamma_0}{2UA_p}$ → $\Gamma_0=\dfrac{2UA_pC_L}{\pi b}$.
날개 끝에서 떨어져 나간 뒤따르는 와류들이 만드는 내리흐름은 (양력선 이론의 결과로) 타원 분포에서 폭 전체에 균일한 $w=\Gamma_0/(2b)$입니다.
유효 받음각이 $\alpha_i=w/U=\dfrac{A_pC_L}{\pi b^2}=\dfrac{C_L}{\pi AR}$만큼 줄어, 단면의 양력이 흐름에 대해 $\alpha_i$만큼 뒤로 기웁니다. 그 흐름 방향 성분이 유도 항력: $D_i\approx L\alpha_i$ → $C_{Di}=C_L\alpha_i=\dfrac{C_L^2}{\pi AR}$.`,
    note: R`내리흐름 $w=\Gamma_0/(2b)$는 비오-사바르 법칙을 뒤따르는 와류 판에 적분해 얻습니다(여기서는 결과를 인용). 타원 분포가 주어진 양력에서 유도 항력을 최소로 합니다. 실속은 이 이론 밖의 박리 현상으로, $C_L\approx2\pi\sin\alpha$의 직선에서 벗어나는 지점입니다.` },
  // ───── 15
  { ch: 'ch15', id: 'cpBernoulli', title: '퍼텐셜 유동의 압력 계수', keys: ['퍼텐셜 유동 문제'],
    tags: 'pressure coefficient potential flow Bernoulli everywhere 압력 계수 퍼텐셜 베르누이',
    stmt: R`비회전 퍼텐셜 유동에서 중력 효과를 빼면 $C_p=\dfrac{p-p_\infty}{\frac12\rho U^2}=1-\Big(\dfrac VU\Big)^2$이다.`,
    body: R`
비회전이라 베르누이 상수가 흐름 전체에서 같습니다(9단원). 먼 곳(자유 흐름)과 임의의 점을 같은 높이로 이으면 $p_\infty+\tfrac12\rho U^2=p+\tfrac12\rho V^2$. 정리하면 $p-p_\infty=\tfrac12\rho(U^2-V^2)$, $\tfrac12\rho U^2$로 나눠 결과.`,
    note: R`정체점에서 $C_p=1$이 최대이고, 속도가 자유 흐름보다 빠른 곳에서는 음수입니다. 압력은 속도의 제곱이라 중첩되지 않으므로, 합친 속도로 계산합니다.` },
  { ch: 'ch15', id: 'elemSolutions', title: '기본 흐름이 라플라스 방정식을 만족함과 원천·와류의 세기', keys: ['기본해 (극좌표)'],
    tags: 'elementary flows source vortex doublet Laplace polar circulation 기본해 원천 와류 이중극 순환',
    stmt: R`$\psi=m\theta$(원천), $\psi=-K\ln r$(와류), $\psi=-\lambda\sin\theta/r$(이중극)은 $\nabla^2\psi=0$을 만족하고, 원천의 유량은 $2\pi m$, 와류의 순환은 $2\pi K$이다.`,
    body: R`
극좌표 $\nabla^2\psi=\dfrac1r\dfrac{\partial}{\partial r}\Big(r\dfrac{\partial\psi}{\partial r}\Big)+\dfrac1{r^2}\dfrac{\partial^2\psi}{\partial\theta^2}$.
원천: 둘째 항 $\partial^2(m\theta)/\partial\theta^2=0$, 첫째 항 0. 와류: $r\,\partial\psi/\partial r=-K$ 상수 → 0. 이중극: $\psi=-\lambda r^{-1}\sin\theta$, $\frac1r\partial_r(r\cdot\lambda r^{-2}\sin\theta)=\frac1r(-\lambda r^{-2}\sin\theta)$, $\frac1{r^2}\partial_\theta^2\psi=\lambda r^{-3}\sin\theta$ → 합 0.
원천의 유량: $v_r=\frac1r\partial_\theta\psi=m/r$, 반지름 $r$ 원을 지나는 유량 $\int_0^{2\pi}(m/r)r\,d\theta=2\pi m$.
와류의 순환: $v_\theta=-\partial_r\psi=K/r$, $\Gamma=\oint v_\theta r\,d\theta=2\pi K$.`,
    note: R`원점에서는 속도가 무한대라 해가 성립하지 않습니다. 물체 안쪽에 두어 흐름 영역에서 빼는 것이 중첩법의 요령입니다.` },
  { ch: 'ch15', id: 'rankineHalf', title: '랭킨 반무한 물체의 정체점과 두께', keys: ['랭킨 반무한 물체'],
    tags: 'Rankine half body source uniform stream stagnation width 랭킨 반무한 물체 정체점 두께',
    stmt: R`$\psi=Ur\sin\theta+m\theta$에서 정체점은 $x=-m/U$, 표면은 $\psi=\pi m$, 하류 멀리 반폭은 $\pi m/U$이다.`,
    body: R`
$v_r=U\cos\theta+m/r$, $v_\theta=-U\sin\theta$. 정체점은 $v_\theta=0$($\theta=0$ 또는 $\pi$), $v_r=0$: $\theta=\pi$에서 $-U+m/r=0$ → $r=m/U$, 즉 $x=-m/U$.
정체점의 $\psi$: $Ur\sin\pi+m\pi=\pi m$. 이 유선이 원천에서 나온 유체와 바깥 흐름을 가르므로 물체의 표면입니다.
하류 멀리($\theta\to0$): $Uy+m\theta\to Uy=\pi m$ → $y=\pi m/U$. 원천이 내는 유량 $2\pi m$이 결국 속도 $U$로 폭 $2\pi m/U$를 채우며 흘러간다는 질량 보존과 일치합니다.`,
    note: R`표면 $r=m(\pi-\theta)/(U\sin\theta)$에서 속도가 가장 빠른 곳은 앞머리 근처로, 자유 흐름보다 약 26% 빠릅니다.` },
  { ch: 'ch15', id: 'cylinderFlow', title: '원기둥 주위 흐름: 균일 흐름 + 이중극', keys: ['원기둥 주위 흐름'],
    tags: 'cylinder doublet uniform stream surface velocity pressure coefficient 원기둥 이중극 표면 속도 압력 계수',
    stmt: R`$\psi=Ur\sin\theta-\lambda\sin\theta/r$에서 $\lambda=Ua^2$이면 $r=a$가 유선이고, 표면 속력 $2U\lvert\sin\theta\rvert$, $C_p=1-4\sin^2\theta$이다.`,
    body: R`
$\psi=\sin\theta\,(Ur-\lambda/r)$. $r=a$에서 $\psi=0$이 되게 하려면 $Ua=\lambda/a$ → $\lambda=Ua^2$.
$v_r=\dfrac1r\dfrac{\partial\psi}{\partial\theta}=U\cos\theta\Big(1-\dfrac{a^2}{r^2}\Big)$, $v_\theta=-\dfrac{\partial\psi}{\partial r}=-U\sin\theta\Big(1+\dfrac{a^2}{r^2}\Big)$.
$r=a$: $v_r=0$, $v_\theta=-2U\sin\theta$. $C_p=1-(V/U)^2=1-4\sin^2\theta$.
정체점 $\theta=0,\pi$; 최대 속도 $2U$와 최저 $C_p=-3$은 $\theta=\pm90°$.`,
    note: R`$C_p(\theta)=C_p(\pi-\theta)$(앞뒤 대칭), $C_p(\theta)=C_p(-\theta)$(위아래 대칭)이라 항력·양력이 모두 0 — 달랑베르의 역설. 15단원 연습 문제에서 적분으로 확인합니다.` },
  { ch: 'ch15', id: 'kuttaJoukowski', title: '순환이 있는 원기둥의 양력: 표면 압력 적분', keys: ['순환이 있는 원기둥과 쿠타-주콥스키 정리'],
    tags: 'Kutta Joukowski lift circulation cylinder surface pressure integration stagnation 쿠타 주콥스키 양력 순환',
    stmt: R`원기둥 흐름에 시계 방향 순환 $\Gamma$를 더하면 정체점은 $\sin\theta_s=-\Gamma/(4\pi Ua)$이고, 단위 길이당 항력 0, 양력 $L=\rho U\Gamma$(위)이다.`,
    body: R`
$\psi=U\sin\theta(r-a^2/r)+\dfrac\Gamma{2\pi}\ln\dfrac ra$ → 표면 $v_r=0$, $v_\theta=-2U\sin\theta-\dfrac{\Gamma}{2\pi a}$.
정체점 $v_\theta=0$: $\sin\theta_s=-\dfrac{\Gamma}{4\pi Ua}$.
$V^2=4U^2\sin^2\theta+\dfrac{2U\Gamma}{\pi a}\sin\theta+\dfrac{\Gamma^2}{4\pi^2a^2}$, $p=p_\infty+\tfrac12\rho(U^2-V^2)$.
표면 요소 $a\,d\theta$에서 압력은 안쪽으로: $L=-\displaystyle\int_0^{2\pi}p\sin\theta\,a\,d\theta$, $D=-\int_0^{2\pi}p\cos\theta\,a\,d\theta$.
$L$: 상수 항과 $\sin^2\theta\cdot\sin\theta$ 항은 적분 0. 남는 것 $-\displaystyle\int_0^{2\pi}\Big(-\frac\rho2\frac{2U\Gamma}{\pi a}\sin\theta\Big)\sin\theta\,a\,d\theta=\frac{\rho U\Gamma}\pi\int_0^{2\pi}\sin^2\theta\,d\theta=\rho U\Gamma$.
$D$: $\sin^2\theta\cos\theta$, $\sin\theta\cos\theta$, $\cos\theta$의 한 주기 적분은 모두 0.`,
    note: R`원기둥 대신 먼 원을 검사면으로 잡고 운동량 방정식을 쓰면 물체 모양과 무관하게 같은 $\rho U\Gamma$가 나옵니다 — 모든 2차원 물체에 성립하는 이유입니다.` },
  );
})();
