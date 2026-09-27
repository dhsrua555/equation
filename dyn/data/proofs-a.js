/* 유도 — 01 벡터·직선 운동 … 08 라그랑주 역학
   src가 있는 항목은 수업 필기(차은혁 교수, 2026-1)와 Lagrangian Dynamics 수업 자료를 따른 것입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 01
  { ch: 'ch01', id: 'proj', title: '평면으로의 사영', keys: ['평면으로의 사영'], src: '수업 필기 · 3월 4일',
    tags: 'projection plane normal vector dot product 사영 평면 법선 내적',
    stmt: R`법선 $\mathbf n$인 평면에 대해 $\mathbf P_{\text{normal}}=\frac{\mathbf P\cdot\mathbf n}{\mathbf n\cdot\mathbf n}\mathbf n$, $\mathbf P_{\text{proj}}=\mathbf P-\mathbf P_{\text{normal}}$이고 $\mathbf P_{\text{proj}}\perp\mathbf n$이다.`,
    body: R`
$\mathbf P_{\text{normal}}=c\,\mathbf n$으로 두고 나머지 $\mathbf P-c\mathbf n$이 $\mathbf n$에 수직이 되게 $c$를 정합니다: $(\mathbf P-c\mathbf n)\cdot\mathbf n=0\iff c=\dfrac{\mathbf P\cdot\mathbf n}{\mathbf n\cdot\mathbf n}$.
그러면 $\mathbf P=\mathbf P_{\text{normal}}+\mathbf P_{\text{proj}}$로 법선 성분과 평면 안 성분이 유일하게 나뉩니다. $\mathbf n$이 단위벡터면 $c=\mathbf P\cdot\mathbf n$.`,
    note: R`$\mathbf n\cdot\mathbf n$으로 나누는 것을 빠뜨리면 $\mathbf n$의 길이에 따라 답이 달라지는데, 사영은 평면에만 의존해야 하므로 틀린 답입니다.` },
  { ch: 'ch01', id: 'vel', title: '속도와 가속도의 정의', keys: ['속도와 가속도'], src: '수업 필기 · 3월 4일',
    tags: 'velocity acceleration derivative average instantaneous 속도 가속도 평균 순간',
    stmt: R`$v=\lim_{\Delta t\to0}\Delta x/\Delta t=dx/dt$, $a=dv/dt$. $x=t^2$이면 $v=2t$, $a=2$.`,
    body: R`
$\dfrac{x(t+\Delta t)-x(t)}{\Delta t}=\dfrac{(t+\Delta t)^2-t^2}{\Delta t}=2t+\Delta t\to2t$. 같은 방법으로 $\dfrac{2(t+\Delta t)-2t}{\Delta t}=2$.`,
    note: R`속력은 $\lvert v\rvert$, 이동 거리는 $\int\lvert v\rvert dt$입니다.` },
  { ch: 'ch01', id: 'accForms', title: '가속도가 위치의 함수일 때: v dv = a dx', keys: ['가속도의 세 가지 형태'],
    tags: 'acceleration function of position chain rule v dv a dx 가속도 위치 연쇄법칙',
    stmt: R`$a=f(x)$이면 $\tfrac12v^2-\tfrac12v_0^2=\int_{x_0}^xf(s)ds$, $a=f(v)$이면 $t=\int dv/f(v)$, $x=\int v\,dv/f(v)$.`,
    body: R`
운동 방향이 바뀌지 않는 구간에서 $v$를 $x$의 함수로 보면 $a=\dfrac{dv}{dt}=\dfrac{dv}{dx}\dfrac{dx}{dt}=v\dfrac{dv}{dx}$. 변수분리로 $v\,dv=f(x)dx$, 적분하면 첫 식.
$a=f(v)$: $dv/dt=f(v)$에서 $dt=dv/f(v)$, 그리고 $v\,dv/dx=f(v)$에서 $dx=v\,dv/f(v)$.`,
    note: R`방향이 바뀌는 점($v=0$)에서는 $v$가 $x$의 함수가 아니므로 구간을 나눕니다.` },
  { ch: 'ch01', id: 'constAcc', title: '등가속도 운동의 세 공식', keys: ['등가속도 운동의 세 공식'],
    tags: 'constant acceleration kinematic equations 등가속도 공식',
    stmt: R`$a$가 일정하면 $v=v_0+at$, $x=x_0+v_0t+\tfrac12at^2$, $v^2=v_0^2+2a(x-x_0)$.`,
    body: R`
$dv/dt=a$ 적분: $v=v_0+at$. $dx/dt=v_0+at$ 적분: $x=x_0+v_0t+\tfrac12at^2$. 셋째는 $v\,dv=a\,dx$를 적분하거나, 첫 식에서 $t=(v-v_0)/a$를 둘째 식에 넣어 정리합니다.`,
    note: R`가속도가 일정하지 않으면(스프링, 저항) 이 공식을 쓰면 안 됩니다.` },
  { ch: 'ch01', id: 'relMotion', title: '상대 운동의 속도·가속도', keys: ['상대 운동 (병진하는 기준틀)'], src: '수업 필기 · 3월 9일',
    tags: 'relative motion translating frame velocity acceleration 상대 운동 병진 틀',
    stmt: R`$\mathbf r_B=\mathbf r_A+\mathbf r_{B/A}$에서 $\mathbf v_B=\mathbf v_A+\mathbf v_{B/A}$, $\mathbf a_B=\mathbf a_A+\mathbf a_{B/A}$ (기준틀이 회전하지 않을 때).`,
    body: R`
위치 식을 시간으로 미분합니다. 병진만 하는 기준틀에서는 $\mathbf r_{B/A}$를 고정된 $\mathbf i,\mathbf j$로 쓰므로 그 성분의 도함수가 곧 $\mathbf v_{B/A}$입니다. 한 번 더 미분하면 가속도.`,
    note: R`기준틀이 **돌면** 단위벡터도 돌아 추가 항이 생깁니다(10단원의 코리올리).` },
  { ch: 'ch01', id: 'dependent', title: '줄로 이어진 블록의 종속 운동', keys: ['종속 운동'], src: '수업 필기 · 3월 9일',
    tags: 'dependent motion pulley constraint rope length 종속 운동 도르래 구속',
    stmt: R`줄의 길이가 일정해 $\sum c_ix_i=$ 일정이면 $\sum c_iv_i=0$, $\sum c_ia_i=0$.`,
    body: R`
늘지 않는 줄의 길이는 각 직선 가닥의 길이(좌표의 일차 결합)와 도르래에 감긴 일정한 길이의 합입니다. 합이 상수이므로 시간 미분은 0.`,
    note: R`도르래가 여럿이면 줄마다 구속식을 하나씩 씁니다. 자유도 = 좌표 수 − 구속 수.` },
  // ───── 02
  { ch: 'ch02', id: 'vecDiff', title: '벡터 함수의 곱 규칙', keys: ['벡터 미분의 규칙'], src: '수업 필기 · 3월 9일',
    tags: 'vector derivative product rule dot cross 벡터 미분 곱 규칙',
    stmt: R`$\frac{d}{dt}(\mathbf P\cdot\mathbf Q)=\dot{\mathbf P}\cdot\mathbf Q+\mathbf P\cdot\dot{\mathbf Q}$, $\frac{d}{dt}(\mathbf P\times\mathbf Q)=\dot{\mathbf P}\times\mathbf Q+\mathbf P\times\dot{\mathbf Q}$.`,
    body: R`
$\mathbf P(t+\Delta t)\times\mathbf Q(t+\Delta t)-\mathbf P\times\mathbf Q=(\Delta\mathbf P)\times\mathbf Q+\mathbf P\times\Delta\mathbf Q+\Delta\mathbf P\times\Delta\mathbf Q$. $\Delta t$로 나누고 극한을 취하면 마지막 항은 0으로 갑니다. 내적도 같습니다(성분으로 써도 스칼라 곱 규칙의 합).`,
    note: R`외적은 교환법칙이 없으므로 순서를 지켜야 합니다.` },
  { ch: 'ch02', id: 'tangent', title: '속도는 경로의 접선이다', keys: ['속도는 경로에 접한다'], src: '수업 필기 · 3월 9일',
    tags: 'velocity tangent path secant 속도 접선 할선',
    stmt: R`질점의 속도 $\mathbf v=d\mathbf r/dt$는 경로의 접선 방향이다.`,
    body: R`
$\Delta\mathbf r=\mathbf r(t+\Delta t)-\mathbf r(t)$는 경로 위 두 점을 잇는 할선 벡터. $\Delta t\to0$이면 할선의 방향은 접선 방향으로 수렴하고, $\Delta\mathbf r/\Delta t$는 그 방향을 유지한 채 $\mathbf v$로 수렴합니다.`,
    note: R`반대로 가속도는 접선일 필요가 없습니다(등속 원운동의 구심 가속도).` },
  { ch: 'ch02', id: 'cart', title: '직교 좌표의 속도와 가속도', keys: ['직교 성분'],
    tags: 'rectangular components projectile 직교 성분 포물체',
    stmt: R`$\mathbf v=\dot x\mathbf i+\dot y\mathbf j+\dot z\mathbf k$, $\mathbf a=\ddot x\mathbf i+\ddot y\mathbf j+\ddot z\mathbf k$.`,
    body: R`
고정된 단위벡터는 $d\mathbf i/dt=\mathbf 0$이므로 곱 규칙에서 성분의 도함수만 남습니다. 포물체는 $\ddot x=0$, $\ddot y=-g$를 따로 적분합니다.`,
    note: R`최고점의 곡률 반지름은 $\rho=v^2/a_n=(v_0\cos\alpha)^2/g$.` },
  { ch: 'ch02', id: 'etDot', title: '접선 단위벡터의 변화율', keys: ['접선 단위벡터의 변화율', '접선-법선 가속도'], src: '수업 필기 · 3월 11일',
    tags: 'tangential normal unit vector curvature radius de_t/dt 접선 법선 곡률',
    stmt: R`$d\mathbf e_t/dt=(v/\rho)\mathbf e_n$, $d\mathbf e_n/dt=-(v/\rho)\mathbf e_t$, 따라서 $\mathbf a=\dot v\mathbf e_t+(v^2/\rho)\mathbf e_n$.`,
    body: R`
$\mathbf e_t$가 방향각 $\theta$로 정해지면 $\dfrac{d\mathbf e_t}{dt}=\dfrac{d\mathbf e_t}{d\theta}\dfrac{d\theta}{ds}\dfrac{ds}{dt}$.
$\lvert d\mathbf e_t/d\theta\rvert$: 두 단위벡터 사이 각이 $\Delta\theta$면 차의 길이는 $2\sin(\Delta\theta/2)$, $\Delta\theta$로 나눈 극한이 1. 방향은 두 벡터의 이등분선에 수직 → 극한에서 $\mathbf e_t$에 수직이고 휘는 쪽, 곧 $\mathbf e_n$.
$d\theta/ds=1/\rho$(곡률), $ds/dt=v$. 따라서 $d\mathbf e_t/dt=(v/\rho)\mathbf e_n$. $\mathbf e_n$도 같은 각으로 돌고 $\mathbf e_t$를 90° 돌린 것이므로 $d\mathbf e_n/dt=-(v/\rho)\mathbf e_t$.
$\mathbf a=\frac{d}{dt}(v\mathbf e_t)=\dot v\mathbf e_t+v\frac{v}{\rho}\mathbf e_n$.`,
    note: R`필기의 부호 논의: $\mathbf e_n$을 “곡률 중심 쪽”으로 정의하면 휘는 방향과 무관하게 $+$입니다. $\mathbf e_n$을 $\mathbf e_t$의 반시계 90° 회전으로 고정 정의하면 시계 방향으로 휘는 구간에서 $-$가 됩니다.` },
  { ch: 'ch02', id: 'polar', title: '극좌표의 속도와 가속도', keys: ['극좌표 단위벡터의 도함수', '극좌표의 속도와 가속도'], src: '수업 필기 · 3월 11일',
    tags: 'polar coordinates radial transverse velocity acceleration Coriolis term 극좌표 반지름 방향 가로 방향',
    stmt: R`$\dot{\mathbf e}_r=\dot\theta\mathbf e_\theta$, $\dot{\mathbf e}_\theta=-\dot\theta\mathbf e_r$, $\mathbf v=\dot r\mathbf e_r+r\dot\theta\mathbf e_\theta$, $\mathbf a=(\ddot r-r\dot\theta^2)\mathbf e_r+(r\ddot\theta+2\dot r\dot\theta)\mathbf e_\theta$.`,
    body: R`
$\mathbf e_r=(\cos\theta,\sin\theta)$, $\mathbf e_\theta=(-\sin\theta,\cos\theta)$를 미분하면 단위벡터의 도함수.
$\mathbf v=\frac{d}{dt}(r\mathbf e_r)=\dot r\mathbf e_r+r\dot\theta\mathbf e_\theta$.
$\mathbf a=\ddot r\mathbf e_r+\dot r\dot\theta\mathbf e_\theta+\dot r\dot\theta\mathbf e_\theta+r\ddot\theta\mathbf e_\theta-r\dot\theta^2\mathbf e_r$.`,
    note: R`$2\dot r\dot\theta$는 10단원의 코리올리 가속도와 같은 항입니다.` },
  // ───── 03
  { ch: 'ch03', id: 'newton2', title: '선운동량과 뉴턴 제2법칙', keys: ['뉴턴 제2법칙'], src: '수업 필기 · 3월 16일',
    tags: 'Newton second law linear momentum conservation 뉴턴 제2법칙 선운동량 보존',
    stmt: R`$\sum\mathbf F=d(m\mathbf v)/dt$. 질량이 일정하면 $m\mathbf a$, 알짜힘이 0이면 $m\mathbf v$ 일정.`,
    body: R`
뉴턴 제2법칙의 원래 형태가 선운동량의 변화율입니다. $m$ 일정이면 곱 규칙에서 $\dot m\mathbf v=\mathbf 0$. $\sum\mathbf F=\mathbf 0$이면 $d\mathbf L/dt=\mathbf 0$.`,
    note: R`$\mathbf a$는 관성틀에서 잰 가속도여야 합니다. 질량이 변하는 계는 9단원에서 계를 다시 잡아 다룹니다.` },
  { ch: 'ch03', id: 'fbd', title: '비스듬한 줄로 끄는 상자의 장력과 최적 각', keys: ['풀이 순서'], src: '수업 필기 · 3월 16일',
    tags: 'free body diagram tension friction optimal angle 자유물체도 장력 마찰 최적 각',
    stmt: R`$T=\dfrac{m(a+\mu g)}{\cos\theta+\mu\sin\theta}$이고 최소는 $\tan\theta=\mu$에서 $m(a+\mu g)/\sqrt{1+\mu^2}$.`,
    body: R`
$y$: $N=mg-T\sin\theta$. $x$: $T\cos\theta-\mu N=ma$. 대입해 정리하면 $T$.
$h(\theta)=\cos\theta+\mu\sin\theta=\sqrt{1+\mu^2}\cos(\theta-\phi)$, $\tan\phi=\mu$. 최대가 $\sqrt{1+\mu^2}$($\theta=\phi$)이므로 최소 장력.`,
    note: R`$T\sin\theta>mg$면 상자가 들려 $N<0$ — 식의 가정($N\ge0$)을 확인하세요.` },
  { ch: 'ch03', id: 'friction', title: '정지 마찰의 판정', keys: ['마찰력의 두 영역'], src: '수업 필기 · 3월 16일 (보충)',
    tags: 'static friction kinetic friction incline impending motion 정지 마찰 운동 마찰 경사면',
    stmt: R`경사각 $\theta$인 면 위 블록이 정지해 있을 조건은 $\tan\theta\le\mu_s$이고, 미끄러지는 블록의 가속도는 $g(\sin\theta-\mu_k\cos\theta)$이다.`,
    body: R`
정지: $f=mg\sin\theta$, $N=mg\cos\theta$. 정지 마찰은 $f\le\mu_sN$까지만 낼 수 있으므로 $\tan\theta\le\mu_s$.
미끄러짐: $f=\mu_kN$(위로) → $ma=mg\sin\theta-\mu_kmg\cos\theta$.`,
    note: R`필기의 “$\mu=\tan\theta$”는 (1) 미끄러지기 직전의 $\mu_s$, 또는 (2) 등속으로 미끄러지는 $\mu_k$일 때만 등호입니다. 정지해 있다는 것만으로는 부등식입니다.` },
  { ch: 'ch03', id: 'bank', title: '경사진 곡선 도로의 속력', keys: ['접선-법선과 극좌표의 운동 방정식'], src: '수업 필기 · 3월 18일',
    tags: 'banked curve normal acceleration design speed friction 경사 곡선 설계 속력',
    stmt: R`마찰 없이 도는 설계 속력은 $v=\sqrt{g\rho\tan\theta}$, 마찰 $\mu_s$가 있으면 최대 $v=\sqrt{g\rho\frac{\tan\theta+\mu_s}{1-\mu_s\tan\theta}}$.`,
    body: R`
법선(곡선 중심, 수평) 방향: $N\sin\theta+f\cos\theta=mv^2/\rho$. 연직: $N\cos\theta-f\sin\theta=mg$.
$f=0$: 나누면 $\tan\theta=v^2/(g\rho)$.
최대 속력: 바깥으로 미끄러지려 하므로 $f=\mu_sN$(아래 방향). 두 식을 나누면 $\dfrac{v^2}{g\rho}=\dfrac{\sin\theta+\mu_s\cos\theta}{\cos\theta-\mu_s\sin\theta}$.`,
    note: R`최소 속력은 마찰 방향이 반대라 $\mu_s$의 부호만 바뀝니다.` },
  // ───── 04
  { ch: 'ch04', id: 'Hdot', title: '각운동량의 변화율은 토크', keys: ['각운동량과 토크'], src: '수업 필기 · 3월 18일',
    tags: 'angular momentum torque moment H dot 각운동량 토크 모멘트',
    stmt: R`$\mathbf H_O=\mathbf r\times m\mathbf v$이면 $\dot{\mathbf H}_O=\mathbf r\times\sum\mathbf F$. 극좌표로 $H_O=mr^2\dot\theta$.`,
    body: R`
$\dot{\mathbf H}_O=\dot{\mathbf r}\times m\mathbf v+\mathbf r\times m\dot{\mathbf v}=\mathbf v\times m\mathbf v+\mathbf r\times\sum\mathbf F$, 첫 항은 평행 벡터의 외적이라 0.
극좌표: $\mathbf r\times m\mathbf v=r\mathbf e_r\times m(\dot r\mathbf e_r+r\dot\theta\mathbf e_\theta)=mr^2\dot\theta(\mathbf e_r\times\mathbf e_\theta)=mr^2\dot\theta\mathbf k$.`,
    note: R`$O$는 고정점이어야 합니다. 움직이는 점에 대해서는 추가 항이 생깁니다.` },
  { ch: 'ch04', id: 'kepler2', title: '중심력과 면적 속도 (케플러 제2법칙)', keys: ['중심력 운동의 각운동량 보존'], src: '수업 필기 · 3월 18일',
    tags: 'central force areal velocity Kepler second law 중심력 면적 속도 케플러',
    stmt: R`중심력 운동에서 $r^2\dot\theta=h$(일정)이고 $dA/dt=\tfrac12h$.`,
    body: R`
$\mathbf F\parallel\mathbf r$ → $\mathbf r\times\mathbf F=\mathbf 0$ → $\mathbf H_O$ 일정 → $mr^2\dot\theta$ 일정.
또는 $\sum F_\theta=0=m(r\ddot\theta+2\dot r\dot\theta)=\tfrac mr\tfrac d{dt}(r^2\dot\theta)$.
면적: $\Delta A=\tfrac12r^2\Delta\theta+o(\Delta\theta)$ → $dA/dt=\tfrac12r^2\dot\theta$.`,
    note: R`힘의 크기 법칙과 무관합니다. $1/r^2$일 때만 궤도가 원뿔곡선(제1법칙)이 됩니다.` },
  { ch: 'ch04', id: 'circOrbit', title: '원 궤도의 속력과 주기', keys: ['원 궤도', '만유인력'], src: '수업 필기 · 3월 18일',
    tags: 'circular orbit speed period Kepler third law gravitation 원 궤도 주기 만유인력',
    stmt: R`$v=\sqrt{GM/r}$, $\tau=2\pi\sqrt{r^3/GM}$, 지표에서 $GM=gR^2$.`,
    body: R`
$r$ 일정: $\sum F_r=-GMm/r^2=m(\ddot r-r\dot\theta^2)=-mv^2/r$ → $v^2=GM/r$. $\tau=2\pi r/v$.
지표: 무게 $mg=GMm/R^2$ → $GM=gR^2$.`,
    note: R`주기의 제곱이 반지름의 세제곱에 비례 — 원 궤도에서의 케플러 제3법칙입니다.` },
  { ch: 'ch04', id: 'apsides', title: '근점과 원점의 속력', keys: ['근점과 원점의 속력'],
    tags: 'perigee apogee orbit angular momentum energy 근점 원점 궤도',
    stmt: R`$r_Av_A=r_Bv_B$, 그리고 $v_A^2=\dfrac{2GMr_B}{r_A(r_A+r_B)}$.`,
    body: R`
근점·원점에서 $\dot r=0$이라 속도가 반지름에 수직: $H=mrv$ 보존.
에너지: $\tfrac12v_A^2-\tfrac{GM}{r_A}=\tfrac12v_B^2-\tfrac{GM}{r_B}$. $v_B=v_Ar_A/r_B$를 넣으면 $\tfrac12v_A^2\tfrac{r_B^2-r_A^2}{r_B^2}=GM\tfrac{r_B-r_A}{r_Ar_B}$ → 결론.`,
    note: R`$r_A=r_B$이면 원 궤도의 $\sqrt{GM/r}$로 돌아갑니다.` },
  // ───── 05
  { ch: 'ch05', id: 'workEnergy', title: '일-운동에너지 정리', keys: ['일-운동에너지 정리', '일'], src: '수업 필기 · 3월 23일',
    tags: 'work kinetic energy theorem 일 운동에너지 정리',
    stmt: R`$\int_1^2\sum\mathbf F\cdot d\mathbf r=\tfrac12mv_2^2-\tfrac12mv_1^2$.`,
    body: R`
$\sum\mathbf F\cdot\mathbf v=m\dot{\mathbf v}\cdot\mathbf v=\frac{d}{dt}(\tfrac12m\mathbf v\cdot\mathbf v)$. 양변에 $dt$를 곱하고 $\mathbf v\,dt=d\mathbf r$로 바꿔 경로를 따라 적분합니다.`,
    note: R`$U$는 모든 힘의 일입니다. 속도에 수직인 힘(수직항력, 원운동의 장력)은 기여하지 않습니다.` },
  { ch: 'ch05', id: 'commonWork', title: '중력·스프링·마찰의 일', keys: ['자주 쓰는 일'],
    tags: 'work of gravity spring friction path length 중력 스프링 마찰 일',
    stmt: R`$U_g=-mg\Delta y$, $U_s=-\tfrac12k(x_2^2-x_1^2)$, $U_f=-f\cdot(\text{경로 길이})$.`,
    body: R`
중력: $\mathbf F=-mg\mathbf j$, $\int\mathbf F\cdot d\mathbf r=-mg\int dy$(수평 성분은 기여 없음).
스프링: $\int_{x_1}^{x_2}-kx\,dx$.
마찰: 크기 일정, 방향은 늘 변위의 반대 → $\mathbf f\cdot d\mathbf r=-f\,ds$.`,
    note: R`앞 둘은 끝점만의 함수(보존력), 마찰은 경로에 의존(비보존력)입니다.` },
  { ch: 'ch05', id: 'potential', title: '퍼텐셜 에너지와 F = −∇V', keys: ['퍼텐셜 에너지'], src: '수업 필기 · 3월 23일',
    tags: 'potential energy gradient conservative force gravitational -GMm/r 퍼텐셜 기울기 보존력',
    stmt: R`보존력은 $\mathbf F=-\nabla V$이고, 만유인력의 퍼텐셜은 $V=-GMm/r$이다.`,
    body: R`
보존력은 $dU=\mathbf F\cdot d\mathbf r=-dV$. $dV=\nabla V\cdot d\mathbf r$이므로 모든 $d\mathbf r$에 대해 $(\mathbf F+\nabla V)\cdot d\mathbf r=0$ → $\mathbf F=-\nabla V$.
만유인력: $\mathbf F\cdot d\mathbf r=-\tfrac{GMm}{r^2}dr$ → $V=-\tfrac{GMm}{r}$(무한히 먼 곳이 0).`,
    note: R`지표 근처에서 $V\approx$ 상수 $+mgy$.` },
  { ch: 'ch05', id: 'energyEq', title: '비보존력을 포함한 에너지 식', keys: ['에너지 식', '일률'], src: '수업 필기 · 3월 23일',
    tags: 'conservation of mechanical energy nonconservative work 역학적 에너지 보존 비보존력',
    stmt: R`$T_1+V_1+U^{\text{nc}}_{1\to2}=T_2+V_2$.`,
    body: R`
일-에너지 정리의 $U$를 보존력 몫 $V_1-V_2$와 나머지 $U^{\text{nc}}$로 나누면 $T_2-T_1=V_1-V_2+U^{\text{nc}}$. 일률은 $P=dU/dt=\mathbf F\cdot\mathbf v$.`,
    note: R`$U^{\text{nc}}=0$이면 $T+V$ 보존.` },
  // ───── 06
  { ch: 'ch06', id: 'impulse', title: '충격량-운동량 원리', keys: ['충격량-운동량 원리', '충격 운동'], src: '수업 필기 · 3월 25일',
    tags: 'impulse momentum principle impulsive force nonimpulsive 충격량 운동량 충격력',
    stmt: R`$m\mathbf v_1+\int_{t_1}^{t_2}\sum\mathbf F\,dt=m\mathbf v_2$. 충돌에서는 유한한 힘의 충격량을 무시한다.`,
    body: R`
$\sum\mathbf F=d(m\mathbf v)/dt$를 적분. 유한한 힘 $\lvert\mathbf F\rvert\le F_{\max}$의 충격량은 $\le F_{\max}\Delta t\to0$이라, $\Delta t\to0$에서는 크기가 $1/\Delta t$로 커지는 충격력만 남습니다.`,
    note: R`일-에너지(거리로 적분, 스칼라)와 짝입니다.` },
  { ch: 'ch06', id: 'restitution', title: '반발 계수와 충돌 후 속도', keys: ['반발 계수', '충돌 후 속도와 에너지 손실'], src: '수업 필기 · 3월 25일',
    tags: 'coefficient of restitution direct central impact energy loss 반발 계수 정면 충돌 에너지 손실',
    stmt: R`$v_A'=\frac{m_Av_A+m_Bv_B-m_Be(v_A-v_B)}{m_A+m_B}$, $v_B'=\frac{m_Av_A+m_Bv_B+m_Ae(v_A-v_B)}{m_A+m_B}$, $\Delta T=\tfrac12\frac{m_Am_B}{m_A+m_B}(1-e^2)(v_A-v_B)^2$.`,
    body: R`
운동량 $m_Av_A+m_Bv_B=m_Av_A'+m_Bv_B'$와 $v_B'-v_A'=e(v_A-v_B)$를 연립하면 두 속도.
에너지: 질량 중심 속도 $\bar v$는 보존되고 $T=\tfrac12M\bar v^2+\tfrac12\mu u^2$($\mu=\frac{m_Am_B}{M}$, $u=v_A-v_B$). 충돌 후 $u'=-eu$이므로 $\Delta T=\tfrac12\mu(1-e^2)u^2$.
$e=1$: 필기처럼 $v_A+v_A'=v_B+v_B'$와 운동량 식을 곱해 $T=T'$를 직접 보일 수도 있습니다.`,
    note: R`$e=0$이면 두 물체가 붙어 $\bar v$로 움직이고 상대 운동의 에너지를 모두 잃습니다.` },
  { ch: 'ch06', id: 'oblique', title: '비스듬한 충돌', keys: ['비스듬한 충돌의 네 식'], src: '수업 필기 · 3월 25일',
    tags: 'oblique central impact line of impact tangential velocity 비스듬한 충돌 충돌선 접선',
    stmt: R`마찰 없는 비스듬한 충돌: 접선 속도는 각자 보존, 충돌선 방향은 운동량 보존과 반발 계수.`,
    body: R`
충격력은 매끄러운 접촉면의 공통 법선(충돌선) 방향뿐입니다. 접선 방향 충격량이 0이라 각 물체의 접선 운동량이 따로 보존. 충돌선 방향은 1차원 정면 충돌과 같은 두 식입니다.`,
    note: R`마찰이 있으면 접선 충격량이 생기고 공이 회전을 얻습니다(필기의 고무공).` },
  { ch: 'ch06', id: 'ballistic', title: '탄동 진자', keys: ['단계별 원리'],
    tags: 'ballistic pendulum stages momentum then energy 탄동 진자 단계',
    stmt: R`총알(질량 $m$)이 매달린 블록($M$)에 박혀 높이 $h$ 올라가면 총알 속력은 $v=\frac{m+M}{m}\sqrt{2gh}$.`,
    body: R`
충돌(짧음, 완전 소성): 수평 운동량 보존 $mv=(m+M)V$.
충돌 뒤(흔들림): 장력은 일을 하지 않아 에너지 보존 $\tfrac12(m+M)V^2=(m+M)gh$.
두 식에서 $v$.`,
    note: R`충돌 단계에 에너지 보존을 쓰면 틀립니다(운동에너지의 대부분이 열로).` },
  // ───── 07
  { ch: 'ch07', id: 'focn', title: '극값의 일차 필요조건', keys: ['일차 필요조건'], src: '수업 필기 · 4월 1일, 6일 · Lagrangian 자료 명제 6.2',
    tags: 'first-order necessary condition gradient critical point 일차 필요조건 기울기 임계점',
    stmt: R`$x^\star$가 미분가능한 $f$의 극소(극대)점이면 $\nabla f(x^\star)=0$.`,
    body: R`
임의의 방향 $\mathbf d$에 대해 $g(t)=f(x^\star+t\mathbf d)$는 $t=0$에서 극소. 일변수 결과로 $g'(0)=\nabla f(x^\star)\cdot\mathbf d=0$. 모든 $\mathbf d$에 대해 0이면 $\nabla f(x^\star)=0$.`,
    note: R`역은 성립하지 않습니다(안장점).` },
  { ch: 'ch07', id: 'sosc', title: '이차 충분조건', keys: ['이차 충분조건'], src: '수업 필기 · 4월 6일',
    tags: 'second-order sufficient condition Hessian positive definite 이차 충분조건 헤시안 양의 정부호',
    stmt: R`$\nabla f(x^\star)=0$이고 헤시안 $H(x^\star)\succ0$이면 $x^\star$는 극소점이다.`,
    body: R`
테일러 전개: $f(x^\star+\mathbf h)=f(x^\star)+0+\tfrac12\mathbf h^TH\mathbf h+o(\lVert\mathbf h\rVert^2)$. $H\succ0$이면 $\mathbf h^TH\mathbf h\ge\lambda_{\min}\lVert\mathbf h\rVert^2$($\lambda_{\min}>0$)이라 충분히 작은 $\mathbf h\ne0$에서 우변이 $f(x^\star)$보다 큽니다.`,
    note: R`$2\times2$에서 양의 정부호 판정: $H_{11}>0$, $\det H>0$(필기).` },
  { ch: 'ch07', id: 'lagMult', title: '라그랑주 승수 조건', keys: ['라그랑주 승수'], src: 'Lagrangian 자료 명제 6.4',
    tags: 'Lagrange multiplier equality constraint gradient 라그랑주 승수 등식 제약',
    stmt: R`$g(x^\star)=0$ 위에서 $f$의 극소점 $x^\star$(제약의 야코비가 최대 계수)에서는 $\nabla f+(\partial g/\partial x)^T\lambda=0$인 $\lambda$가 있다.`,
    body: R`
제약면 위의 곡선 $x(t)$($x(0)=x^\star$)는 $g(x(t))=0$이라 $\frac{\partial g}{\partial x}\dot x(0)=0$ — 접벡터는 $\frac{\partial g}{\partial x}$의 영공간.
$f(x(t))$가 $t=0$에서 극소이므로 $\nabla f\cdot\dot x(0)=0$ — $\nabla f$는 모든 접벡터에 수직, 곧 영공간의 직교여공간 = $\frac{\partial g}{\partial x}$의 행공간에 있습니다. 따라서 $\nabla f=-\big(\frac{\partial g}{\partial x}\big)^T\lambda$.`,
    note: R`“영공간의 직교여공간 = 행공간”은 선형대수의 기본 정리입니다. 야코비의 계수 조건이 없으면 승수가 없을 수도 있습니다.` },
  { ch: 'ch07', id: 'eulerLagrange', title: '오일러-라그랑주 방정식', keys: ['오일러-라그랑주 방정식'], src: '수업 필기 · 4월 1일 · Lagrangian 자료 6.1.2',
    tags: 'Euler-Lagrange equation calculus of variations integration by parts fundamental lemma 오일러-라그랑주 변분법 부분적분',
    stmt: R`양 끝이 고정된 $\int_{t_0}^{t_f}L(q,\dot q,t)dt$의 극값 경로는 $\frac{d}{dt}\frac{\partial L}{\partial\dot q}-\frac{\partial L}{\partial q}=0$을 만족한다.`,
    body: R`
$q=q^\star+\varepsilon\eta$, $\eta(t_0)=\eta(t_f)=0$. $g(\varepsilon)=\int L\,dt$가 $\varepsilon=0$에서 극값 → $g'(0)=0$.
$g'(0)=\int(L_q\eta+L_{\dot q}\dot\eta)dt$. 부분적분 $\int L_{\dot q}\dot\eta\,dt=[L_{\dot q}\eta]-\int\frac{d}{dt}L_{\dot q}\,\eta\,dt$, 경계항 0.
$\int\big(L_q-\frac{d}{dt}L_{\dot q}\big)\eta\,dt=0$ ($\forall\eta$). 변분법의 기본 보조정리(연속함수 $h$가 모든 $\eta$와 적분 0이면 $h\equiv0$)로 결론.`,
    note: R`기본 보조정리: $h(t_1)>0$이면 연속성으로 $t_1$ 근처 구간에서 $h>0$, 그 구간에서만 양인 매끄러운 $\eta$를 고르면 적분이 양 — 모순.` },
  { ch: 'ch07', id: 'freeEnd', title: '자유 끝점의 경계 조건', keys: ['자유 끝점의 경계 조건', '벡터 경로의 오일러-라그랑주 방정식'],
    tags: 'free end point natural boundary condition vector Euler-Lagrange 자유 끝점 경계 조건',
    stmt: R`$q(t_f)$가 자유이면 E-L 방정식과 함께 $\partial L/\partial\dot q\,\big|_{t_f}=0$. $q$가 벡터면 성분마다 E-L 식.`,
    body: R`
$\eta(t_f)$가 0일 필요가 없으면 부분적분 뒤 $g'(0)=L_{\dot q}(t_f)\eta(t_f)+\int(L_q-\tfrac d{dt}L_{\dot q})\eta\,dt$. 먼저 $\eta(t_f)=0$인 변분으로 E-L을 얻고, 그러면 적분이 0이라 남은 $L_{\dot q}(t_f)\eta(t_f)=0$이 모든 $\eta(t_f)$에 대해 성립해야 합니다.
벡터: 한 성분만 변분 $\eta_i$를 주고 나머지는 0으로 두면 성분마다 같은 논증.`,
    note: R`자연 경계 조건이라 부릅니다.` },
  // ───── 08
  { ch: 'ch08', id: 'lagrangeEq', title: '라그랑주 방정식과 뉴턴 법칙', keys: ['라그랑주 방정식 (보존력만 있을 때)'], src: '수업 필기 · 4월 1일 · Lagrangian 자료 6.2',
    tags: 'Lagrange equation L = T - V Newton equivalence particle 라그랑주 방정식 뉴턴',
    stmt: R`질점($x\in\mathbb R^n$)에 대해 $L=\tfrac12m\dot x^T\dot x-V(x)$의 E-L 방정식은 $m\ddot x=-\nabla V$이다.`,
    body: R`
$\partial L/\partial\dot x=m\dot x$, $\frac{d}{dt}=m\ddot x$. $\partial L/\partial x=-\partial V/\partial x$. E-L: $m\ddot x+\nabla V=0$, 곧 $m\ddot x=-\nabla V=\mathbf F$(보존력).
일반화 좌표로 바꿔도 E-L 방정식의 꼴은 유지됩니다(좌표 변환에 대해 작용 적분의 값이 같으므로).`,
    note: R`스프링-질량: $V=\tfrac12kx^2$ → $m\ddot x=-kx$. 진자: $L=\tfrac12ml^2\dot\theta^2+mgl\cos\theta$ → $ml^2\ddot\theta+mgl\sin\theta=0$.` },
  { ch: 'ch08', id: 'genForce', title: '일반화 힘', keys: ['확장된 라그랑주 방정식'], src: '수업 필기 · 4월 6일 · Lagrangian 자료 (6.50)',
    tags: 'generalized force nonconservative virtual work torque 일반화 힘 비보존력 가상 일',
    stmt: R`$V$에 넣지 않은 힘 $\mathbf F_k$는 $Q_i=\sum_k\mathbf F_k\cdot\partial\mathbf r_k/\partial q_i$로 E-L 방정식의 우변에 들어간다.`,
    body: R`
해밀턴 원리를 비보존력까지 넓힌 형태: $\delta\int L\,dt+\int\sum_k\mathbf F_k\cdot\delta\mathbf r_k\,dt=0$. $\delta\mathbf r_k=\sum_i\frac{\partial\mathbf r_k}{\partial q_i}\delta q_i$이므로 비보존력의 가상일은 $\sum_iQ_i\delta q_i$. 부분적분 뒤 $\delta q_i$의 계수를 0으로: $\frac{d}{dt}L_{\dot q_i}-L_{q_i}=Q_i$.
$Q^T\dot q=\sum_k\mathbf F_k\cdot\dot{\mathbf r}_k$ — 그 힘들의 일률.`,
    note: R`$q_i$가 각이면 $Q_i$는 토크(N·m)입니다. 필기의 “$q_i$ 방향의 비보존력의 합”은 $q_i$가 길이일 때의 특수한 경우입니다.` },
  { ch: 'ch08', id: 'cyclic', title: '순환 좌표와 보존량', keys: ['순환 좌표'],
    tags: 'cyclic coordinate ignorable conserved momentum 순환 좌표 보존량',
    stmt: R`$\partial L/\partial q_j=0$이고 $Q_j=0$이면 $p_j=\partial L/\partial\dot q_j$는 일정하다.`,
    body: R`
$j$번째 E-L 방정식이 $\frac{d}{dt}p_j=\partial L/\partial q_j+Q_j=0$이 됩니다.`,
    note: R`$L$이 $t$를 직접 포함하지 않으면 $h=\sum\dot q_ip_i-L$이 보존(야코비 적분). $T$가 $\dot q$의 이차 동차식이면 $h=T+V$.` },
  );
})();
