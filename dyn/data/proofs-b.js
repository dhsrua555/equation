/* 유도 — 09 질점계·평면 운동학 … 15 3차원 강체
   src가 있는 항목은 수업 필기(차은혁 교수, 2026-1)를 따른 것입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 09
  { ch: 'ch09', id: 'comMotion', title: '질량 중심의 운동 방정식', keys: ['질량 중심과 그 운동'], src: '수업 필기 · 4월 8일',
    tags: 'center of mass system of particles internal forces cancel 질량 중심 질점계 내력',
    stmt: R`질점계에서 $\sum\mathbf F_{\text{ext}}=M\mathbf a_G$, $\mathbf L=M\mathbf v_G$.`,
    body: R`
질점 $i$: $\mathbf F_i+\sum_{j\ne i}\mathbf f_{ij}=m_i\mathbf a_i$. 모두 더하면 내력은 쌍마다 $\mathbf f_{ij}+\mathbf f_{ji}=\mathbf 0$(제3법칙)으로 사라져 $\sum\mathbf F_i=\sum m_i\mathbf a_i$.
$\mathbf r_G=\sum m_i\mathbf r_i/M$를 두 번 미분하면 $M\mathbf a_G=\sum m_i\mathbf a_i$.`,
    note: R`관성틀에서만 성립합니다. 가속하는 틀에서는 각 질점에 관성력 $-m_i\mathbf a_{\text{틀}}$을 더해야 합니다(필기 4월 8일).` },
  { ch: 'ch09', id: 'koenig', title: '쾨니히 분해', keys: ['쾨니히 분해', '질점계의 일-에너지 식'], src: '수업 필기 · 4월 13일, 15일',
    tags: 'Koenig theorem kinetic energy center of mass relative motion 쾨니히 운동에너지 상대 운동',
    stmt: R`$T=\tfrac12M\bar v^2+\sum\tfrac12m_iv_i'^2$.`,
    body: R`
$\mathbf v_i=\bar{\mathbf v}+\mathbf v_i'$. $\sum\tfrac12m_i\lvert\bar{\mathbf v}+\mathbf v_i'\rvert^2=\tfrac12M\bar v^2+\bar{\mathbf v}\cdot\sum m_i\mathbf v_i'+\sum\tfrac12m_iv_i'^2$.
$\sum m_i\mathbf r_i'=\mathbf 0$(질량 중심에서 잰 위치의 가중합)을 미분하면 $\sum m_i\mathbf v_i'=\mathbf 0$.`,
    note: R`내력은 운동량은 못 바꾸지만 일은 할 수 있습니다(스프링으로 이어진 두 질점).` },
  { ch: 'ch09', id: 'rocket', title: '질량이 변하는 계의 운동 방정식', keys: ['질량이 변하는 계의 운동 방정식'], src: '수업 필기 · 4월 15일, 20일',
    tags: 'variable mass rocket thrust Tsiolkovsky 질량 변화 로켓 추력',
    stmt: R`상대 속도 $u$로 질량을 내뿜는 물체: $m\frac{dv}{dt}=\sum F+u\lvert\dot m\rvert$, 외력 없으면 $\Delta v=u\ln(m_1/m_2)$.`,
    body: R`
계 = 시각 $t$의 전체(질량 일정). $t$: $(m+dm)v$. $t+dt$: $m(v+dv)+dm(v-u)$. 차 $=m\,dv-u\,dm=\sum F\,dt$(2차 항 버림).
외력 0: $m\,dv=u\,dm_{\text{잃음}}=-u\,dm_{\text{로켓}}$ → $dv=-u\,dm/m$ → $v_2-v_1=u\ln(m_1/m_2)$.`,
    note: R`필기의 두 형태는 $dm$의 부호 약속(잃은 질량 vs 로켓 질량의 변화)만 다릅니다.` },
  { ch: 'ch09', id: 'relVel', title: '강체 두 점의 상대 속도', keys: ['평면 운동의 속도'], src: '보강 필기',
    tags: 'rigid body relative velocity omega cross r plane motion 강체 상대 속도',
    stmt: R`강체 위의 두 점: $\mathbf v_B=\mathbf v_A+\boldsymbol\omega\times\mathbf r_{B/A}$.`,
    body: R`
강체에서 $\lvert\mathbf r_{B/A}\rvert$가 일정하므로 $\mathbf r_{B/A}\cdot\dot{\mathbf r}_{B/A}=0$ — $\dot{\mathbf r}_{B/A}$는 $\mathbf r_{B/A}$에 수직. 평면에서 $\mathbf r_{B/A}=r(\cos\phi,\sin\phi)$로 두면 $\dot{\mathbf r}_{B/A}=r\dot\phi(-\sin\phi,\cos\phi)=\dot\phi\mathbf k\times\mathbf r_{B/A}$. 강체의 모든 선분은 같은 각만큼 돌므로 $\dot\phi=\omega$가 점과 무관합니다.
$\mathbf r_B=\mathbf r_A+\mathbf r_{B/A}$를 미분하면 결론.`,
    note: R`“모든 선분이 같은 각만큼 돈다”가 강체 각속도가 하나인 이유입니다(두 선분 사이 각이 일정).` },
  { ch: 'ch09', id: 'instCenter', title: '순간 중심과 구름 조건', keys: ['순간 중심', '미끄러지지 않고 구르는 바퀴'], src: '보강 필기',
    tags: 'instantaneous center of rotation rolling without slipping 순간 중심 구름',
    stmt: R`$\omega\ne0$이면 속도가 0인 점 $C$가 있고 $\mathbf v_P=\boldsymbol\omega\times\mathbf r_{P/C}$. 구르는 바퀴는 접촉점이 $C$라 $v_G=r\omega$.`,
    body: R`
$\mathbf v_C=\mathbf v_A+\omega\mathbf k\times\mathbf r_{C/A}=\mathbf 0$을 풀면 $\mathbf r_{C/A}=\dfrac{\mathbf k\times\mathbf v_A}{\omega}$(평면, $\mathbf k\times(\mathbf k\times\mathbf r)=-\mathbf r$ 사용) — 유일하게 존재.
그러면 $\mathbf v_P=\mathbf v_C+\boldsymbol\omega\times\mathbf r_{P/C}=\boldsymbol\omega\times\mathbf r_{P/C}$.
구름: 바닥에 대한 접촉점의 상대 속도가 0(미끄러짐 없음)이므로 접촉점이 $C$, $v_G=\omega r$.`,
    note: R`$C$의 가속도는 일반적으로 0이 아닙니다(바퀴의 접촉점 가속도 $r\omega^2$).` },
  { ch: 'ch09', id: 'relAcc', title: '강체 두 점의 상대 가속도', keys: ['평면 운동의 가속도'], src: '보강 필기',
    tags: 'relative acceleration rigid body tangential normal 상대 가속도 강체',
    stmt: R`$\mathbf a_B=\mathbf a_A+\boldsymbol\alpha\times\mathbf r_{B/A}-\omega^2\mathbf r_{B/A}$ (평면).`,
    body: R`
$\mathbf v_B=\mathbf v_A+\boldsymbol\omega\times\mathbf r_{B/A}$를 미분: $\mathbf a_B=\mathbf a_A+\boldsymbol\alpha\times\mathbf r_{B/A}+\boldsymbol\omega\times(\boldsymbol\omega\times\mathbf r_{B/A})$. 평면에서 $\boldsymbol\omega\perp\mathbf r$이라 $\boldsymbol\omega\times(\boldsymbol\omega\times\mathbf r)=\boldsymbol\omega(\boldsymbol\omega\cdot\mathbf r)-\omega^2\mathbf r=-\omega^2\mathbf r$.`,
    note: R`접선 성분 $r\alpha$, 법선(중심 쪽) 성분 $r\omega^2$ — 원운동의 두 가속도입니다.` },
  // ───── 10
  { ch: 'ch10', id: 'unitRot', title: '회전 틀 단위벡터의 도함수', keys: ['회전 틀 단위벡터의 도함수', '회전 틀에서의 미분 규칙'], src: '수업 필기 · 4월 27일',
    tags: 'rotating frame unit vector derivative transport theorem 회전 틀 단위벡터 미분 규칙',
    stmt: R`$d\mathbf i/dt=\boldsymbol\Omega\times\mathbf i$ 등이고, 따라서 $(\dot{\mathbf Q})_{OXY}=(\dot{\mathbf Q})_{oxy}+\boldsymbol\Omega\times\mathbf Q$.`,
    body: R`
$\mathbf i$를 원점에서 그리면 끝점은 틀과 함께 원점 둘레로 순수 회전: $\dot{\mathbf i}=\boldsymbol\Omega\times\mathbf i$.
$\mathbf Q=Q_x\mathbf i+Q_y\mathbf j+Q_z\mathbf k$를 곱 규칙으로 미분: $(\dot Q_x\mathbf i+\dot Q_y\mathbf j+\dot Q_z\mathbf k)+\boldsymbol\Omega\times(Q_x\mathbf i+Q_y\mathbf j+Q_z\mathbf k)$.`,
    note: R`$\mathbf Q=\boldsymbol\Omega$이면 $\boldsymbol\Omega\times\boldsymbol\Omega=\mathbf 0$이라 두 틀에서 본 $\dot{\boldsymbol\Omega}$가 같습니다.` },
  { ch: 'ch10', id: 'coriolis', title: '절대 가속도와 코리올리 항', keys: ['절대 속도', '절대 가속도'], src: '수업 필기 · 4월 27일, 29일',
    tags: 'Coriolis acceleration absolute acceleration rotating frame 코리올리 절대 가속도',
    stmt: R`$\mathbf a_P=\mathbf a_o+(\ddot{\mathbf r})_{oxy}+\dot{\boldsymbol\Omega}\times\mathbf r+\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)+2\boldsymbol\Omega\times(\dot{\mathbf r})_{oxy}$.`,
    body: R`
$\mathbf v_P=\mathbf v_o+(\dot{\mathbf r})_{oxy}+\boldsymbol\Omega\times\mathbf r$(규칙을 $\mathbf r$에).
$\frac{d}{dt}(\dot{\mathbf r})_{oxy}=(\ddot{\mathbf r})_{oxy}+\boldsymbol\Omega\times(\dot{\mathbf r})_{oxy}$(규칙).
$\frac{d}{dt}(\boldsymbol\Omega\times\mathbf r)=\dot{\boldsymbol\Omega}\times\mathbf r+\boldsymbol\Omega\times[(\dot{\mathbf r})_{oxy}+\boldsymbol\Omega\times\mathbf r]$.
더하면 $\boldsymbol\Omega\times(\dot{\mathbf r})_{oxy}$가 두 번 — 코리올리 항.`,
    note: R`극좌표($\Omega=\dot\theta$, $\mathbf r=r\mathbf e_r$ 틀)에 적용하면 2단원의 극좌표 가속도가 그대로 나옵니다.` },
  { ch: 'ch10', id: 'omegaDot', title: '겹친 회전의 각가속도', keys: ['각속도의 변화율'],
    tags: 'angular acceleration composite rotation precession spin 겹친 회전 각가속도',
    stmt: R`$\boldsymbol\omega=\boldsymbol\Omega_1+\boldsymbol\omega_2$($\boldsymbol\omega_2$는 틀에 대한 회전)이면 $\dot{\boldsymbol\omega}=\dot{\boldsymbol\Omega}_1+(\dot{\boldsymbol\omega}_2)_{oxy}+\boldsymbol\Omega_1\times\boldsymbol\omega_2$.`,
    body: R`
규칙을 $\mathbf Q=\boldsymbol\omega$에: $\dot{\boldsymbol\omega}=(\dot{\boldsymbol\omega})_{oxy}+\boldsymbol\Omega_1\times\boldsymbol\omega$. $(\dot{\boldsymbol\omega})_{oxy}=(\dot{\boldsymbol\Omega}_1)_{oxy}+(\dot{\boldsymbol\omega}_2)_{oxy}$이고 $(\dot{\boldsymbol\Omega}_1)_{oxy}=\dot{\boldsymbol\Omega}_1$, $\boldsymbol\Omega_1\times\boldsymbol\Omega_1=\mathbf 0$.`,
    note: R`크기가 일정한 자전과 세차만 있어도 $\boldsymbol\Omega_1\times\boldsymbol\omega_2\ne\mathbf 0$ — 15단원 자이로 효과의 근원입니다.` },
  // ───── 11
  { ch: 'ch11', id: 'sumMIalpha', title: 'ΣM_G = I_G α', keys: ['강체의 평면 운동 방정식'], src: '수업 필기 · 5월 4일',
    tags: 'rigid body equation of motion moment of inertia angular acceleration 강체 운동 방정식 관성 모멘트',
    stmt: R`평면 운동하는 강체에서 $\sum M_G=I_G\alpha$, $I_G=\int r'^2dm$.`,
    body: R`
질량 중심 기준 상대 위치 $\mathbf r_i'$, 상대 속도 $\boldsymbol\omega\times\mathbf r_i'$. $\mathbf H_G=\sum\mathbf r_i'\times m_i(\boldsymbol\omega\times\mathbf r_i')=\sum m_i r_i'^2\boldsymbol\omega$(평면에서 $\mathbf r'\perp\boldsymbol\omega$라 $\mathbf r'\times(\boldsymbol\omega\times\mathbf r')=r'^2\boldsymbol\omega$) $=I_G\omega\mathbf k$.
질점계의 $\dot{\mathbf H}_G=\sum\mathbf M_G$(9단원, 질량 중심이 가속해도 성립)에서 $I_G\alpha=\sum M_G$.`,
    note: R`필기는 질점 하나에서 $\frac{d}{dt}(\mathbf r\times m\mathbf v)=mr^2\alpha\mathbf k$(구심 항은 외적 0)을 보이고 합으로 넓혔습니다.` },
  { ch: 'ch11', id: 'inertiaTable', title: '원판·판·속 빈 구의 관성 모멘트', keys: ['관성 모멘트와 대표 값'], src: '수업 필기 · 5월 4일',
    tags: 'moment of inertia disk plate hollow sphere rod integration 관성 모멘트 원판 판 속 빈 구 막대',
    stmt: R`원판 $\tfrac12MR^2$, 직사각형 판 $\tfrac1{12}M(a^2+b^2)$, 속 빈 구 $\tfrac23MR^2$, 막대 $\tfrac1{12}ML^2$.`,
    body: R`
원판: $dm=\rho t\,r\,dr\,d\theta$, $\int_0^{2\pi}\int_0^Rr^3\rho t\,dr\,d\theta=\tfrac12\rho t\pi R^4$.
판: $\rho t\iint(x^2+y^2)dx\,dy=\rho t(\tfrac{a^3b}{12}+\tfrac{ab^3}{12})$.
속 빈 구: 띠의 질량 $\rho2\pi R^2\sin\theta\,d\theta$, 거리 $R\sin\theta$ → $2\pi\rho R^4\int_0^\pi\sin^3\theta\,d\theta=2\pi\rho R^4\cdot\tfrac43$, $M=4\pi R^2\rho$.
막대: $\int_{-L/2}^{L/2}x^2\frac ML\,dx=\tfrac1{12}ML^2$.`,
    note: R`속찬 구 $\tfrac25MR^2$은 얇은 껍질 $\tfrac23(dm)r^2$을 $r$로 적분해 얻습니다: $\int_0^R\tfrac23r^2\cdot\rho4\pi r^2dr=\tfrac8{15}\pi\rho R^5=\tfrac25MR^2$.` },
  { ch: 'ch11', id: 'parallel', title: '평행축 정리', keys: ['평행축 정리'], src: '수업 필기 · 5월 6일',
    tags: 'parallel axis theorem moment of inertia 평행축 정리',
    stmt: R`$I_O=I_G+md^2$.`,
    body: R`
$O$ 기준 $(x,y)=(\bar x+x',\bar y+y')$. $\int(x^2+y^2)dm=m(\bar x^2+\bar y^2)+\int(x'^2+y'^2)dm+2\bar x\int x'dm+2\bar y\int y'dm$. 질량 중심의 정의로 마지막 두 적분이 0.`,
    note: R`$md^2\ge0$이라 도심축이 평행한 축들 중 최소입니다.` },
  { ch: 'ch11', id: 'fixedAxis', title: '핀으로 받친 막대를 놓는 순간', keys: ['고정축 회전'], src: '수업 필기 · 5월 6일',
    tags: 'fixed axis rotation pinned rod released reaction 고정축 회전 핀 막대 반력',
    stmt: R`수평 막대(한 끝 핀)를 놓는 순간 $\alpha=3g/(2L)$, 핀 반력 $\tfrac14mg$(위), 수평 반력 0.`,
    body: R`
$\sum M_P=mg\tfrac L2=I_P\alpha=\tfrac13mL^2\alpha$. $a_{Gt}=\tfrac L2\alpha=\tfrac34g$(아래), $a_{Gn}=\tfrac L2\omega^2=0$.
$\sum F_y$: $R_y-mg=-\tfrac34mg$. $\sum F_x=ma_{Gn}=0$.`,
    note: R`$G$에 대한 모멘트로 풀면 $R_y\tfrac L2=\tfrac1{12}mL^2\alpha$와 $\sum F_y$를 연립해야 하지만 같은 답입니다.` },
  { ch: 'ch11', id: 'rolling', title: '경사면을 구르는 물체', keys: ['구름의 두 조건 (필기)'], src: '수업 필기 · 5월 11일',
    tags: 'rolling incline static friction radius of gyration slipping 구름 경사면 정지 마찰 미끄러짐',
    stmt: R`회전 반지름 $k$인 물체가 미끄러지지 않고 구르면 $a=\dfrac{g\sin\theta}{1+k^2/r^2}$, $f=\dfrac{mg\sin\theta\,k^2/r^2}{1+k^2/r^2}$. 원판은 $\tan\theta\le3\mu_s$일 때만 구른다.`,
    body: R`
$mg\sin\theta-f=ma$, $fr=mk^2\alpha$, $a=r\alpha$ → $f=mk^2a/r^2$ → $a(1+k^2/r^2)=g\sin\theta$.
원판 $k^2=r^2/2$: $f=\tfrac13mg\sin\theta\le\mu_smg\cos\theta\iff\tan\theta\le3\mu_s$.
넘으면 $f=\mu_kmg\cos\theta$, $a=g(\sin\theta-\mu_k\cos\theta)$, $\alpha=\mu_kmg\cos\theta\,r/(mk^2)$.`,
    note: R`고리($k=r$) $\tfrac12g\sin\theta$ < 원판 $\tfrac23$ < 속찬 구 $\tfrac57$.` },
  { ch: 'ch11', id: 'percussion', title: '타격 중심', keys: ['타격 중심'], src: '수업 필기 · 5월 13일, 18일',
    tags: 'center of percussion pivot reaction sweet spot 타격 중심 핀 반력',
    stmt: R`핀에서 $\bar r$에 질량 중심이 있는 물체의 $G$ 너머 $x=I_G/(m\bar r)$인 점(핀에서 $I_O/(m\bar r)$)에 힘을 주면 핀의 수평 반력이 0이다.`,
    body: R`
$F-N=m\bar r\alpha$, $xF+\bar rN=I_G\alpha$. 첫 식에 $I_G/(m\bar r)$를 곱해 빼면 $N\big(\bar r+\tfrac{I_G}{m\bar r}\big)=\big(\tfrac{I_G}{m\bar r}-x\big)F$.
$N=0\iff x=I_G/(m\bar r)$. 핀에서 $\bar r+I_G/(m\bar r)=(m\bar r^2+I_G)/(m\bar r)=I_O/(m\bar r)$.`,
    note: R`막대(끝이 핀): $\tfrac23L$. 필기 5월 18일은 이를 차량의 뒷차축에 적용해 뒷바퀴 힘과 무관한 점을 찾았습니다.` },
  // ───── 12
  { ch: 'ch12', id: 'rigidKE', title: '강체의 운동에너지', keys: ['강체의 운동에너지'], src: '수업 필기 · 5월 11일',
    tags: 'kinetic energy rigid body translation rotation 강체 운동에너지 병진 회전',
    stmt: R`$T=\tfrac12mv_G^2+\tfrac12I_G\omega^2$, 고정축이면 $\tfrac12I_O\omega^2$.`,
    body: R`
쾨니히 분해의 상대 운동이 $G$에 대한 회전($v_i'=\omega r_i'$)이라 $\sum\tfrac12m_iv_i'^2=\tfrac12I_G\omega^2$. 고정축: $v_G=\omega d$와 평행축 정리.`,
    note: R`순간 중심 $C$에 대한 $\tfrac12I_C\omega^2$도 같은 값입니다(속도만 따지는 순간 식).` },
  { ch: 'ch12', id: 'rigidWork', title: '강체에 한 일: 병진 + 회전', keys: ['강체에 한 일', '강체에 전달되는 일률'], src: '수업 필기 · 5월 11일',
    tags: 'work on rigid body couple moment rotation 강체 일 우력 회전',
    stmt: R`$U=\int\sum\mathbf F\cdot d\mathbf r_G+\int\sum M_G\,d\theta$, 일률 $P=\sum\mathbf F\cdot\mathbf v_G+\sum M_G\omega$.`,
    body: R`
힘 $\mathbf F_k$의 작용점 변위 $d\mathbf r_k=d\mathbf r_G+d\boldsymbol\theta\times\mathbf r_k'$. $\mathbf F_k\cdot(d\boldsymbol\theta\times\mathbf r_k')=d\boldsymbol\theta\cdot(\mathbf r_k'\times\mathbf F_k)$(삼중곱 순환). 모든 힘을 더하면 결론.`,
    note: R`우력은 알짜힘이 0이라 병진 몫이 없지만 $M\,d\theta$의 일을 합니다(필기의 막대 예).` },
  { ch: 'ch12', id: 'rollNoWork', title: '구르는 바퀴의 마찰은 일을 하지 않는다', keys: ['구름 마찰의 일', '강체의 에너지 식'], src: '수업 필기 · 5월 11일',
    tags: 'rolling friction no work contact point zero velocity energy conservation 구름 마찰 일',
    stmt: R`미끄러지지 않고 구르면 접촉력은 일을 하지 않아 $T+V$가 보존된다(다른 비보존력이 없을 때).`,
    body: R`
방법 1: $P=\mathbf f\cdot\mathbf v_C$, $\mathbf v_C=\mathbf 0$. 방법 2: $-fv_G+rf\omega=-f(v_G-r\omega)=0$.`,
    note: R`굴러 내려온 원판: $mgh=\tfrac34mv^2$ → $v=\sqrt{4gh/3}$.` },
  // ───── 13
  { ch: 'ch13', id: 'HP', title: '임의의 점에 대한 강체의 각운동량', keys: ['강체의 운동량'], src: '수업 필기 · 5월 13일',
    tags: 'angular momentum about arbitrary point rigid body 각운동량 임의의 점',
    stmt: R`$\mathbf H_P=\mathbf H_G+\mathbf r_{G/P}\times m\mathbf v_G$, 평면에서 $H_P=I_G\omega+mv_Gd_\perp$.`,
    body: R`
$\mathbf H_P=\sum(\mathbf r_{G/P}+\mathbf r_i')\times m_i\mathbf v_i=\mathbf r_{G/P}\times\sum m_i\mathbf v_i+\sum\mathbf r_i'\times m_i\mathbf v_i$. 첫 항 $=\mathbf r_{G/P}\times m\mathbf v_G$. 둘째 항에서 $\mathbf v_i=\mathbf v_G+\mathbf v_i'$로 나누면 $\big(\sum m_i\mathbf r_i'\big)\times\mathbf v_G=\mathbf 0$이라 $\mathbf H_G$.`,
    note: R`고정점 $P$에서 $H_P=I_P\omega$와 같습니다($v_G=\omega d$, 평행축 정리).` },
  { ch: 'ch13', id: 'rigidImpulse', title: '강체의 충격량-운동량 원리와 각운동량 보존', keys: ['강체의 충격량-운동량 원리', '각운동량 보존'], src: '수업 필기 · 5월 13일',
    tags: 'impulse momentum rigid body conservation of angular momentum 강체 충격량 각운동량 보존',
    stmt: R`$m\mathbf v_{G1}+\int\sum\mathbf F\,dt=m\mathbf v_{G2}$, $H_{G1}+\int\sum M_G\,dt=H_{G2}$. 충격력이 모두 $P$를 지나면 $H_P$ 보존.`,
    body: R`
$\sum\mathbf F=m\mathbf a_G$와 $\sum M_G=\dot H_G$를 시간으로 적분. 고정점(또는 충돌 동안 거의 움직이지 않는 점) $P$에 대해 $\sum M_P=\dot H_P$를 적분하면, 충격 모멘트가 0일 때 $H_P$가 변하지 않습니다.`,
    note: R`턱에 걸리는 막대: $mv\tfrac L2=\tfrac13mL^2\omega$ → $\omega=\tfrac{3v}{2L}$.` },
  { ch: 'ch13', id: 'eccentric', title: '편심 충돌의 반발 계수', keys: ['편심 충돌의 반발 계수', '풀이 순서'], src: '수업 필기 · 5월 13일, 18일',
    tags: 'eccentric impact coefficient of restitution contact point phases compression restitution 편심 충돌 반발 계수 접촉점',
    stmt: R`압축 충격량 $\int P$, 복원 충격량 $\int R$로 $e=\int R/\int P$이면 $e=\dfrac{(v_B')_n-(v_A')_n}{(v_A)_n-(v_B)_n}$($v$: 접촉점 속도).`,
    body: R`
물체 $A$(법선 성분, 충격력은 $-P$, $-R$): 병진 $m(v_{G})_n-\int P=m(u_G)_n$, $m(u_G)_n-\int R=m(v_G')_n$ → 병진 성분의 비가 $e$.
회전: 팔 $\rho$(= $\mathbf r_{C/G}$의 법선 수직 성분) → $I\omega-\rho\int P=I\omega^\star$, $I\omega^\star-\rho\int R=I\omega'$ → 각속도 변화의 비도 $e$.
접촉점 법선 속도 $v_n=v_{G,n}+\rho\omega$(일차 결합)도 같은 비: $e=\dfrac{(u_A)_n-(v_A')_n}{(v_A)_n-(u_A)_n}$. $B$도 같고, 압축 끝에 $(u_A)_n=(u_B)_n=u$. 비의 합성($a/b=c/d=e\Rightarrow(a+c)/(b+d)=e$)으로 $u$를 지우면 결론.`,
    note: R`필기가 “다음 시간에 확인”이라 남긴 회전 식의 비는 같은 충격량에 같은 팔을 곱했기 때문에 성립합니다. 팔이 충돌 동안 일정하다는 것(충돌 시간이 짧음)이 가정입니다.` },
  // ───── 14
  { ch: 'ch14', id: 'H3D', title: '3차원 각운동량과 관성 행렬', keys: ['3차원 각운동량'], src: '수업 필기 · 5월 18일',
    tags: 'angular momentum three dimensions inertia matrix products of inertia 3차원 각운동량 관성 행렬 곱관성',
    stmt: R`$H_x=I_x\omega_x-I_{xy}\omega_y-I_{xz}\omega_z$ 등(교재 표기, $I_{xy}=\int xy\,dm$).`,
    body: R`
$\mathbf r'\times(\boldsymbol\omega\times\mathbf r')=\boldsymbol\omega(\mathbf r'\cdot\mathbf r')-\mathbf r'(\mathbf r'\cdot\boldsymbol\omega)$. $x$ 성분: $\omega_x(x^2+y^2+z^2)-x(x\omega_x+y\omega_y+z\omega_z)=\omega_x(y^2+z^2)-\omega_yxy-\omega_zxz$. 질량으로 적분.`,
    note: R`텐서로 $H_i=\sum_jI_{ij}\omega_j$, $I_{ij}=\int(r^2\delta_{ij}-x_ix_j)dm$ — 같은 계산의 한 줄 표현입니다.` },
  { ch: 'ch14', id: 'tensorNotation', title: '관성 텐서의 두 표기', keys: ['관성 텐서 (텐서 표기)'], src: '수업 필기 · 5월 25일(보강), 6월 1일',
    tags: 'inertia tensor notation Kronecker delta sign convention products of inertia 관성 텐서 표기 크로네커 델타 부호',
    stmt: R`$I_{ij}=\int(r^2\delta_{ij}-x_ix_j)dm$의 비대각은 $-\int x_ix_j\,dm$ — 교재 표기의 행렬 성분 $-I_{xy}$와 같다.`,
    body: R`
$i=j=1$: $r^2-x^2=y^2+z^2$. $i\ne j$: $\delta_{ij}=0$이라 $-\int x_ix_jdm$. 교재는 $I_{xy}:=\int xy\,dm$을 정의하고 행렬에 $-I_{xy}$를 넣으므로 두 행렬은 성분마다 같습니다.`,
    note: R`필기 5월 18일의 예는 텐서식 $I_{xy}=-2$를 교재식 틀 $[\ \cdot\ ,-I_{xy}]$에 넣지 않고 그대로 넣어 맞는 행렬을 얻었습니다. 풀이 중에 틀을 섞으면 부호가 뒤집히니 한 가지만 쓰세요.` },
  { ch: 'ch14', id: 'principal', title: '주축의 존재와 대각화', keys: ['주축과 주관성 모멘트'], src: '수업 필기 · 5월 27일, 6월 1일',
    tags: 'principal axes eigenvalues eigenvectors symmetric matrix diagonalization 주축 고윳값 고유벡터 대각화',
    stmt: R`관성 행렬은 실대칭이라 직교하는 세 고유벡터(주축)와 실수 고윳값(주관성 모멘트)을 가진다. 주축 둘레의 회전에서 $\mathbf H\parallel\boldsymbol\omega$.`,
    body: R`
실대칭 행렬의 스펙트럼 정리: $I=Q\Lambda Q^T$, $Q$는 직교행렬(열이 고유벡터), $\Lambda$는 실수 대각. 고윳값은 $\mathbf v^TI\mathbf v=\int\lvert\mathbf v\times\mathbf r\rvert^2dm\ge0$(단위 $\mathbf v$)이라 음이 아닙니다.
$\boldsymbol\omega=\omega\mathbf v_k$이면 $\mathbf H=I\boldsymbol\omega=\lambda_k\omega\mathbf v_k$.`,
    note: R`아령 예: 고윳값 $0,4,4$ — 중근이면 그 고유공간의 모든 방향이 주축입니다.` },
  { ch: 'ch14', id: 'mirror', title: '거울 대칭면에 수직인 축은 주축', keys: ['거울 대칭과 주축 (필기의 Fact)'], src: '보강 필기 · 5월 25일, 6월 1일',
    tags: 'mirror symmetry principal axis product of inertia zero 거울 대칭 주축 곱관성',
    stmt: R`$yz$ 평면에 대해 거울 대칭이면 $\int xy\,dm=\int xz\,dm=0$이고 $x$축이 주축이다. 원점을 평면 위의 다른 점으로 옮겨도 같으므로, 대칭면에 수직인 모든 축이 주축이다.`,
    body: R`
$(x,y,z)$와 $(-x,y,z)$의 질량 요소가 같아 $xy\,dm$과 $xz\,dm$이 쌍마다 상쇄. 그러면 $I\mathbf i=(I_x,0,0)^T$ — $\mathbf i$가 고유벡터.
평면 위의 다른 점을 원점으로 잡아도 그 점에서 평면에 수직인 축에 대해 같은 대칭 논증이 성립합니다.`,
    note: R`원판의 $\int xy\,dm=0$을 적분 없이 얻는 방법입니다(보강 필기).` },
  { ch: 'ch14', id: 'parallel3D', title: '3차원 평행축 정리', keys: ['3차원 평행축 정리'], src: '보강 필기 · 5월 25일',
    tags: 'parallel axis theorem three dimensions inertia tensor 3차원 평행축 정리 관성 텐서',
    stmt: R`$I_{ij,O}=I_{ij,G}+m(r_G^2\delta_{ij}-x_{iG}x_{jG})$.`,
    body: R`
$\mathbf r=\mathbf r_G+\mathbf r'$을 넣어 전개하면 $\mathbf r_G$만의 항, $\mathbf r'$만의 항($I_{ij,G}$), 교차항($\int\mathbf r'dm$에 비례)으로 나뉘고 교차항은 0.`,
    note: R`대각 성분은 2차원 정리 $I+md^2$, 비대각은 $-mx_Gy_G$가 더해집니다(교재 표기로 $I_{xy,O}=I_{xy,G}+mx_Gy_G$).` },
  { ch: 'ch14', id: 'KE3D', title: '3차원 운동에너지', keys: ['3차원 운동에너지'], src: '보강 필기 · 5월 25일, 5월 27일',
    tags: 'kinetic energy three dimensions omega transpose I omega Lagrange identity 3차원 운동에너지',
    stmt: R`고정점 $O$에 대한 회전: $T=\tfrac12\boldsymbol\omega^TI_O\boldsymbol\omega$. 일반 운동: $T=\tfrac12mv_G^2+\tfrac12\boldsymbol\omega^TI_G\boldsymbol\omega$.`,
    body: R`
$\lvert\boldsymbol\omega\times\mathbf r\rvert^2=\omega^2r^2-(\boldsymbol\omega\cdot\mathbf r)^2=\sum_{ij}\omega_i\omega_j(r^2\delta_{ij}-x_ix_j)$. $\tfrac12\int dm$을 하면 $\tfrac12\sum_{ij}I_{ij}\omega_i\omega_j$.
일반 운동은 쾨니히 분해의 상대 운동에 이 식을 $G$에 대해 적용.`,
    note: R`또는 $T=\tfrac12\boldsymbol\omega\cdot\mathbf H$. 주축이면 $\tfrac12(\lambda_1\omega_1^2+\lambda_2\omega_2^2+\lambda_3\omega_3^2)$.` },
  // ───── 15
  { ch: 'ch15', id: 'bodyFrame', title: '물체 틀에서의 모멘트 식', keys: ['3차원 강체의 운동 방정식', '회전 틀로 옮긴 모멘트 식'], src: '수업 필기 · 6월 1일, 8일',
    tags: 'body frame H dot omega cross H 3D rigid body equation 물체 틀 3차원 운동 방정식',
    stmt: R`$\sum\mathbf M_G=(\dot{\mathbf H}_G)_{oxyz}+\boldsymbol\Omega\times\mathbf H_G$.`,
    body: R`
관성틀에서 $\sum\mathbf M_G=\dot{\mathbf H}_G$(질점계 결과). $\mathbf H_G$를 각속도 $\boldsymbol\Omega$로 도는 틀의 성분으로 쓰고 10단원의 미분 규칙을 적용.`,
    note: R`틀을 물체에 붙이면 관성 행렬이 상수라 $(\dot{\mathbf H})_{oxyz}=I\dot{\boldsymbol\omega}$(성분의 도함수).` },
  { ch: 'ch15', id: 'euler', title: '오일러 방정식', keys: ['오일러 방정식 (주축, 물체에 붙인 틀)'],
    tags: 'Euler equations principal axes body frame 오일러 방정식 주축',
    stmt: R`$\sum M_x=I_x\dot\omega_x-(I_y-I_z)\omega_y\omega_z$ 외 순환.`,
    body: R`
주축: $\mathbf H=(I_x\omega_x,I_y\omega_y,I_z\omega_z)$. $(\boldsymbol\omega\times\mathbf H)_x=\omega_yI_z\omega_z-\omega_zI_y\omega_y=(I_z-I_y)\omega_y\omega_z$.`,
    note: R`모멘트가 없으면 가운데 주축 둘레의 회전이 불안정합니다.` },
  { ch: 'ch15', id: 'dynBalance', title: '기울어진 아령의 축 모멘트', keys: ['동적 균형'], src: '수업 필기 · 6월 1일',
    tags: 'dynamic balance bearing reactions tilted rod product of inertia 동적 균형 베어링 반력',
    stmt: R`축과 $\alpha$로 기운 아령(질량 $m$ 두 개, 반길이 $l$)을 $\omega$로 돌리면 $\sum\mathbf M=2ml^2\omega^2\sin\alpha\cos\alpha\,\mathbf i_{\text{body}}$.`,
    body: R`
물체 틀: $I_{yz}=-2ml^2\sin\alpha\cos\alpha$(텐서), $I_{zz}=2ml^2\sin^2\alpha$, $I_{xz}=0$. $\mathbf H=I\omega\mathbf k=(0,I_{yz}\omega,I_{zz}\omega)$, 틀에서 일정.
$\sum\mathbf M=\omega\mathbf k\times\mathbf H=-I_{yz}\omega^2\mathbf i$.
전역 틀(필기의 방법 1): $\mathbf H=2m(-\rho z_0\omega\cos\theta,-\rho z_0\omega\sin\theta,\rho^2\omega)$, $\theta=\omega t$를 미분하면 $2m\rho z_0\omega^2(\sin\theta,-\cos\theta,0)$ — 같은 벡터.`,
    note: R`$\alpha=0$ 또는 $90°$(주축)이면 모멘트 0. 질량 중심이 축 위에 있어도 곱관성 모멘트가 있으면 축이 흔들립니다.` },
  { ch: 'ch15', id: 'gyro', title: '굴림 원판과 자이로 모멘트', keys: ['수평축 자이로스코프의 세차'], src: '수업 필기 · 6월 8일',
    tags: 'gyroscopic moment precession rolling disk axle normal force 자이로 모멘트 세차 굴림 원판',
    stmt: R`축에 붙인 틀의 각속도 $\boldsymbol\Omega$가 자전 각운동량 $I\omega_s\mathbf i$에 수직이면 필요한 모멘트는 $\boldsymbol\Omega\times I\omega_s\mathbf i$. 수평축 자이로는 $\Omega=mgd/(I\omega_s)$로 세차하고, 굴림 원판은 $N=mg+\tfrac12mr^3\omega_1^2/L^2$.`,
    body: R`
틀에서 $\mathbf H$의 성분이 일정하면 $\dot{\mathbf H}=\boldsymbol\Omega\times\mathbf H$. $\boldsymbol\Omega\parallel\mathbf j$이면 $\mathbf H$의 $\mathbf j$ 성분은 외적에 기여하지 않고 $\Omega\mathbf j\times I\omega_s\mathbf i=-I\omega_s\Omega\mathbf k$.
자이로: 중력 모멘트 $-mgd\mathbf k$와 같게 → $\Omega=mgd/(I\omega_s)$.
굴림 원판: $\Omega=-\tfrac rL\omega_1$, $\dot{\mathbf H}_O=\tfrac rL\cdot\tfrac12mr^2\omega_1^2\mathbf k$ = 모멘트 $L(N-mg)\mathbf k$.`,
    note: R`자이로 식은 축이 수평이고 세차가 자전보다 훨씬 느릴 때의 결과입니다(굴림 원판은 구름 조건으로 정확히 성립).` },
  );
})();
