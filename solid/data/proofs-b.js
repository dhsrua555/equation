/* 유도 — 09 보의 전단 응력 … 15 좌굴
   src가 있는 항목은 오정훈 교수님의 강의 슬라이드 흐름을 따른 것입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 09
  { ch: 'ch09', id: 'VQIt', title: '전단 흐름과 전단 응력 공식 τ = VQ/It', keys: ['전단 흐름', '보의 전단 응력 공식'], src: '강의 슬라이드 · Lecture 7 B',
    tags: 'shear flow VQ/I horizontal shear first moment of area 전단 흐름 수평 전단 1차 모멘트',
    stmt: R`전단력 $V$를 받는 보에서, 높이 $y_1$ 수평면의 단위 길이당 전단력은 $q=VQ/I$, 평균 전단 응력은 $\tau=VQ/(It)$이다. $Q=\int_{A'}y\,dA$($A'$: $y_1$ 바깥쪽 넓이).`,
    body: R`
길이 $\Delta x$ 요소의 바깥쪽 부분 $A'$을 떼어 냅니다. 굽힘 응력 $\sigma=-My/I$의 합력은 왼쪽 면 $-MQ/I$, 오른쪽 면 $-(M+\Delta M)Q/I$.
수평(축) 방향 평형: 아래 수평면의 전단력 $\Delta H$가 차이를 메웁니다: $\Delta H=\Delta M\,Q/I$.
$\Delta M=V\Delta x$(7단원 $dM/dx=V$)이므로 $q=\Delta H/\Delta x=VQ/I$.
폭 $t$로 나누면 수평면의 평균 전단 응력 $\tau_{yx}=VQ/(It)$, 대칭(2단원)으로 단면의 $\tau_{xy}$도 같습니다.`,
    note: R`$t$에 대해 평균한 값입니다. 폭이 넓은 플랜지나 원형 단면의 가장자리처럼 $t$가 높이에 비해 크면 폭 방향으로 분포가 고르지 않습니다.` },
  { ch: 'ch09', id: 'rectTau', title: '직사각형 단면의 포물선 분포', keys: ['직사각형 단면의 전단 응력'], src: '강의 슬라이드 · Lecture 7 B (For Rectangular Case)',
    tags: 'rectangular section parabolic shear stress 3V/2A 직사각형 포물선 전단 응력',
    stmt: R`폭 $b$, 높이 $2c$인 직사각형에서 $\tau=\frac{3V}{2A}\big(1-\frac{y^2}{c^2}\big)$, $\tau_{\max}=\frac{3V}{2A}$.`,
    body: R`
$y$ 위쪽 넓이 $A'=b(c-y)$, 도심 $\bar y'=\tfrac{c+y}2$ → $Q=\tfrac b2(c^2-y^2)$. $I=\tfrac{b(2c)^3}{12}=\tfrac23bc^3$, $t=b$.
$\tau=\dfrac{V\cdot\frac b2(c^2-y^2)}{\frac23bc^3\cdot b}=\dfrac{3V}{4bc}\Big(1-\dfrac{y^2}{c^2}\Big)=\dfrac{3V}{2A}\Big(1-\dfrac{y^2}{c^2}\Big)$ ($A=2bc$).
확인: $\int\tau\,dA=\tfrac{3V}{2A}b\int_{-c}^{c}(1-y^2/c^2)dy=\tfrac{3V}{2A}b\cdot\tfrac43c=V$.`,
    note: R`적분 검산으로 “분포의 합이 전단력”임을 확인하는 습관이 공식의 오기를 잡아 줍니다.` },
  { ch: 'ch09', id: 'thinFlow', title: '얇은 벽 단면에서 전단 흐름의 연속', keys: ['얇은 벽 단면의 전단 흐름'], src: '강의 슬라이드 · Lecture 7 C',
    tags: 'thin-walled open section shear flow continuity junction 얇은 벽 전단 흐름 연속 접합점',
    stmt: R`얇은 벽 단면의 전단 흐름 $q(s)=VQ(s)/I$는 자유단에서 0이고, 벽이 만나는 점에서 들어오는 흐름의 합과 나가는 흐름의 합이 같다.`,
    body: R`
벽을 따라 $s$ 지점에서 자르면 떼어 낸 조각(자유단부터 $s$까지)의 $Q(s)$로 $q(s)=VQ(s)/I$(앞의 유도에서 수평면 대신 벽을 가로지르는 면). 자유단에서 떼어 낼 넓이가 0이라 $q=0$.
접합점 근처의 작은 조각을 떼어 축방향 평형을 쓰면, 조각을 둘러싼 벽 절단면들의 전단력 합이 굽힘 응력 합력의 변화와 같아야 합니다. 조각의 넓이가 0으로 가면 굽힘 항이 사라져 $\sum q_{\text{in}}=\sum q_{\text{out}}$.`,
    note: R`예: I형 보에서 위 플랜지의 왼쪽·오른쪽 흐름이 각각 $q_f$로 웹 꼭대기에 모여 웹에는 $2q_f$가 흘러 들어갑니다.` },
  { ch: 'ch09', id: 'fastener', title: '조립 보의 연결재 힘', keys: ['연결재의 힘'], src: '강의 슬라이드 · Lecture 7 C (Advantage of Shear Flow)',
    tags: 'built-up beam nail bolt spacing shear flow 조립 보 못 볼트 간격',
    stmt: R`간격 $s$로 박은 연결재가 부재 사이의 전단 흐름을 모두 받으면 한 줄의 연결재 하나의 힘은 $F=qs=\frac{VQ}{I}s$.`,
    body: R`
붙잡힌 조각과 나머지 사이의 경계면에 단위 길이당 $q=VQ/I$의 전단력이 필요합니다(유도는 앞의 $\tau=VQ/It$와 같고 $Q$는 붙잡힌 조각의 1차 모멘트). 연결재가 없으면 이 힘을 줄 것이 연결재뿐이므로, 길이 $s$ 구간의 전단력 $qs$를 그 구간의 연결재가 받습니다. 줄이 $n$개면 $qs/n$.`,
    note: R`연결재 사이에서 접촉면 마찰이 일부를 받지만 설계에서는 무시합니다(보수적).` },
  // ───── 10
  { ch: 'ch10', id: 'elastic', title: '탄성 곡선의 미분방정식', keys: ['탄성 곡선의 미분방정식'], src: '강의 슬라이드 · Lecture 8 A',
    tags: 'elastic curve curvature small slope 탄성 곡선 곡률 작은 기울기',
    stmt: R`작은 기울기에서 탄성 곡선은 $EIv''=M(x)$를 만족한다.`,
    body: R`
8단원: 곡률 $1/\rho=M/(EI)$(순수 굽힘에서 유도했지만, 가늘고 긴 보에서는 전단력이 있어도 굽힘 응력이 같다고 봅니다).
평면 곡선 $v(x)$의 곡률: $\kappa=\dfrac{v''}{(1+v'^2)^{3/2}}$(부호: 위로 오목이면 양).
$|v'|\ll1$이면 $(1+v'^2)^{3/2}\approx1$이므로 $\kappa\approx v''$. 두 식을 같게 두면 $EIv''=M$.
부호: 양의 $M$(처짐)은 위로 오목, 곧 $v''>0$ — 교재 규약과 맞습니다.`,
    note: R`$v'=0.01$이면 오차는 $1.5\times10^{-4}$ 비율입니다. 낚싯대처럼 기울기가 큰 경우에는 “엘라스티카” 비선형 방정식이 필요합니다.` },
  { ch: 'ch10', id: 'standard', title: '대표 처짐 공식의 유도', keys: ['대표 처짐 공식'], src: '강의 슬라이드 · Lecture 8 A (Example 1–3)',
    tags: 'deflection formulas simply supported uniform load central load 5wL^4/384 처짐 공식 단순보 등분포 중앙 하중',
    stmt: R`단순보(길이 $L$)의 최대 처짐은 균일하중 $w$에서 $5wL^4/(384EI)$, 가운데 집중하중 $P$에서 $PL^3/(48EI)$이다.`,
    body: R`
**균일하중.** $M=\tfrac w2(Lx-x^2)$. $EIv'=\tfrac w2(\tfrac L2x^2-\tfrac13x^3)+C_1$, $EIv=\tfrac w2(\tfrac L6x^3-\tfrac1{12}x^4)+C_1x+C_2$.
$v(0)=0\Rightarrow C_2=0$, $v(L)=0\Rightarrow C_1=-\tfrac{wL^3}{24}$. 따라서 $v=-\tfrac{w}{24EI}(x^4-2Lx^3+L^3x)$.
$x=L/2$: $\tfrac{L^4}{16}-\tfrac{L^4}4+\tfrac{L^4}2=\tfrac{5L^4}{16}$, $v_{\max}=-\tfrac{5wL^4}{384EI}$.
**가운데 하중.** 대칭이라 왼쪽 절반($M=Px/2$)만: $EIv'=\tfrac P4x^2+C_1$, 가운데 기울기 0에서 $C_1=-\tfrac{PL^2}{16}$. $EIv=\tfrac P{12}x^3-\tfrac{PL^2}{16}x$($v(0)=0$). $x=L/2$: $\tfrac{PL^3}{96}-\tfrac{PL^3}{32}=-\tfrac{PL^3}{48}$.`,
    note: R`대칭을 쓰면 적분 구간이 반으로 줄고 조건 “가운데 기울기 0”이 연속 조건을 대신합니다.` },
  { ch: 'ch10', id: 'fourth', title: '보의 4계 방정식', keys: ['보의 4계 방정식'], src: '강의 슬라이드 · Lecture 8 A (Combining all Equations)',
    tags: 'fourth-order beam equation boundary conditions 4계 방정식 경계 조건',
    stmt: R`$EI$가 일정하면 $EIv''''=-w$, $EIv'''=V$, $EIv''=M$.`,
    body: R`
$EIv''=M$을 $x$로 미분하고 $dM/dx=V$를 쓰면 $EIv'''=V$. 한 번 더 미분해 $dV/dx=-w$를 쓰면 $EIv''''=-w$.
해에는 적분 상수 네 개가 있고, 양끝에서 두 개씩: 고정($v=v'=0$), 핀($v=0$, $v''=0$), 자유($v''=0$, $v'''=0$). 힘 조건이 $v''$, $v'''$로 들어가므로 반력을 몰라도 풀립니다.`,
    note: R`$EI$가 $x$에 따라 변하면 $(EIv'')''=-w$로 써야 합니다.` },
  // ───── 11
  { ch: 'ch11', id: 'superpos', title: '중첩의 원리가 성립하는 이유', keys: ['중첩의 원리'], src: '강의 슬라이드 · Lecture 9 A',
    tags: 'superposition linearity small deformation linear elastic 중첩 선형 미소 변형',
    stmt: R`선형 탄성 재료와 미소 변형(평형을 변형 전 형상에서 씀)이면 하중 $P_1$, $P_2$의 응답은 각 응답의 합이다.`,
    body: R`
세 식을 봅니다. 평형(변형 전 형상에서): 하중에 대해 선형. 기하(미소 변형): 변위에 대해 선형. 재료(훅): 선형.
$(\sigma_1,\varepsilon_1,u_1)$이 $P_1$의 해, $(\sigma_2,\varepsilon_2,u_2)$가 $P_2$의 해이면 합 $(\sigma_1+\sigma_2,\dots)$을 세 식에 넣으면 하중 $P_1+P_2$의 식이 모두 성립합니다(선형 식의 합). 경계 조건도 선형(예: $v=0$)이면 합이 만족합니다. 해가 유일하므로(탄성 문제의 유일성) 이것이 $P_1+P_2$의 해입니다.`,
    note: R`하나라도 비선형이면 깨집니다: 항복(재료), 큰 처짐(기하), 좌굴처럼 축력이 변형된 형상에서 모멘트를 만드는 경우(평형을 변형 후 형상에서 써야 함), 접촉·틈.` },
  { ch: 'ch11', id: 'redundant', title: '여분 반력을 중첩으로 구하기', keys: ['여분 반력의 적합 조건'], src: '강의 슬라이드 · Lecture 9 A (Example 2)',
    tags: 'redundant reaction propped cantilever superposition compatibility 여분 반력 중첩 적합',
    stmt: R`한쪽 고정·한쪽 롤러 보(균일 $w$)의 롤러 반력은 $3wL/8$, 균일하중 단순보를 가운데서 추가로 받치면 가운데 반력은 $5wL/8$이다.`,
    body: R`
**롤러 반력.** 롤러를 떼면 외팔보: 끝 처짐 $wL^4/(8EI)$(아래). 끝의 힘 $R$만 걸면 $RL^3/(3EI)$(위). 롤러는 처짐 0: $RL^3/3=wL^4/8$, $R=3wL/8$.
**가운데 받침.** 떼면 단순보 가운데 처짐 $5wL^4/(384EI)$. 가운데 힘 $R$은 $RL^3/(48EI)$. 같게: $R=\tfrac{5wL^4}{384}\cdot\tfrac{48}{L^3}=\tfrac{5wL}{8}$.`,
    note: R`두 번째 결과로 양끝 반력은 각 $3wL/16$입니다. 연속보가 단순보보다 가운데 지점에 하중을 몰아준다는 것을 보여 줍니다.` },
  { ch: 'ch11', id: 'forceCouple', title: '힘을 한 점으로 옮기면 힘과 우력이 된다', keys: ['조합 하중의 풀이 순서'], src: '강의 슬라이드 · Lecture 9 B',
    tags: 'equivalent force-couple system combined loading section 등가 힘 우력 조합 하중',
    stmt: R`점 $A$의 힘 $\mathbf F$는 점 $O$의 같은 힘 $\mathbf F$와 우력 $\mathbf M_O=\mathbf r_{A/O}\times\mathbf F$의 조합과 강체 평형에서 같다.`,
    body: R`
$O$에 $\mathbf F$와 $-\mathbf F$를 더해도(합 0) 효과가 같습니다. 이제 $A$의 $\mathbf F$와 $O$의 $-\mathbf F$는 우력이고 모멘트는 $\mathbf r_{A/O}\times\mathbf F$(1단원). 남은 것은 $O$의 $\mathbf F$와 이 우력.
단면에서 이 우력과 힘을 단면의 축에 따라 나누면: 축방향 힘 → 축력, 단면 안의 힘 → 전단력, 축에 대한 우력 성분 → 비틀림, 단면 안의 축에 대한 성분 → 굽힘 모멘트.`,
    note: R`“강체 평형에서 같다”이므로, 이 대체는 관심 단면 **바깥**의 하중에만 적용합니다. 하중점 가까이의 국부 응력은 다를 수 있습니다(생브낭 원리).` },
  // ───── 12
  { ch: 'ch12', id: 'transform', title: '평면 응력의 변환 공식', keys: ['평면 응력의 변환 공식'], src: '강의 슬라이드 · Lecture 10 A',
    tags: 'stress transformation wedge equilibrium double angle 응력 변환 쐐기 평형 배각',
    stmt: R`$x'$축이 $x$축에서 반시계로 $\theta$이면 $\sigma_{x'}=\tfrac{\sigma_x+\sigma_y}2+\tfrac{\sigma_x-\sigma_y}2\cos2\theta+\tau_{xy}\sin2\theta$, $\tau_{x'y'}=-\tfrac{\sigma_x-\sigma_y}2\sin2\theta+\tau_{xy}\cos2\theta$.`,
    body: R`
법선이 $x'$인 경사면(넓이 $\Delta A$)과 음의 $x$면($\Delta A\cos\theta$), 음의 $y$면($\Delta A\sin\theta$)으로 된 쐐기.
음의 면들의 힘: $x$면 $(-\sigma_x,-\tau_{xy})\Delta A\cos\theta$, $y$면 $(-\tau_{xy},-\sigma_y)\Delta A\sin\theta$.
$x'=(\cos\theta,\sin\theta)$ 방향: $\sigma_{x'}=\sigma_x\cos^2\theta+\sigma_y\sin^2\theta+2\tau_{xy}\sin\theta\cos\theta$.
$y'=(-\sin\theta,\cos\theta)$ 방향: $\tau_{x'y'}=-(\sigma_x-\sigma_y)\sin\theta\cos\theta+\tau_{xy}(\cos^2\theta-\sin^2\theta)$.
배각 공식으로 정리하면 결론.`,
    note: R`행렬로는 $[\sigma']=Q^T[\sigma]Q$, $Q=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}$입니다. 주응력은 이 대칭 행렬의 고유값이고 주방향은 고유벡터입니다[[@em:ch07:8.3|대칭 행렬의 고유값은 실수이고 고유벡터는 서로 직교합니다.]].` },
  { ch: 'ch12', id: 'principal', title: '주응력과 면내 최대 전단 응력', keys: ['주응력과 주평면', '면내 최대 전단 응력'], src: '강의 슬라이드 · Lecture 10 C',
    tags: 'principal stresses principal planes maximum shear 주응력 주평면 최대 전단',
    stmt: R`$\sigma_{\max,\min}=\sigma_{\text{ave}}\pm R$ ($\tan2\theta_p=2\tau_{xy}/(\sigma_x-\sigma_y)$, 그 면의 전단 0), $\tau_{\max}=R$ ($\theta_s=\theta_p\pm45°$, 그 면의 수직 응력 $\sigma_{\text{ave}}$).`,
    body: R`
$a=\tfrac{\sigma_x-\sigma_y}2$라 하면 $\sigma_{x'}-\sigma_{\text{ave}}=a\cos2\theta+\tau_{xy}\sin2\theta=R\cos(2\theta-2\theta_p)$, $R=\sqrt{a^2+\tau_{xy}^2}$, $\tan2\theta_p=\tau_{xy}/a$(삼각함수 합성).
따라서 $\sigma_{x'}$의 최대·최소는 $\sigma_{\text{ave}}\pm R$이고 $\theta=\theta_p,\theta_p+90°$에서. 그때 $\tau_{x'y'}=-a\sin2\theta+\tau_{xy}\cos2\theta=-R\sin(2\theta-2\theta_p)=0$.
$\tau_{x'y'}=-R\sin(2\theta-2\theta_p)$의 최대 크기는 $R$이고 $2\theta-2\theta_p=\pm90°$, 곧 $\theta=\theta_p\pm45°$. 그 면의 수직 응력은 $\sigma_{\text{ave}}+R\cos(\pm90°)=\sigma_{\text{ave}}$.`,
    note: R`$\sigma_{x'}+\sigma_{y'}$가 불변이라 한 면이 최대면 직각인 면이 최소입니다.` },
  { ch: 'ch12', id: 'mohr', title: '모어 원: 원의 방정식과 2θ 대응', keys: ['모어 원 그리기 (교재 규약)'], src: '강의 슬라이드 · Lecture 10 C',
    tags: 'Mohr circle 2 theta rotation convention 모어 원 회전 규약',
    stmt: R`모든 면의 $(\sigma_{x'},\tau_{x'y'})$는 중심 $(\sigma_{\text{ave}},0)$, 반지름 $R$인 원 위에 있다. 점 $(\sigma_{x'},-\tau_{x'y'})$를 찍으면 요소의 반시계 회전 $\theta$는 원 위의 반시계 회전 $2\theta$에 대응한다.`,
    body: R`
앞의 결과 $\sigma_{x'}-\sigma_{\text{ave}}=R\cos(2\theta-2\theta_p)$, $-\tau_{x'y'}=R\sin(2\theta-2\theta_p)$.
점 $(\sigma_{x'},-\tau_{x'y'})$는 중심에서 각 $2\theta-2\theta_p$ 방향으로 $R$ 떨어진 점입니다. $\theta$가 반시계로 늘면 이 각도 반시계로 두 배 빠르게 늘어납니다. $\theta=0$에서 점은 $X=(\sigma_x,-\tau_{xy})$.
면 $y$($\theta=90°$)는 $2\theta=180°$ 반대편, $(\sigma_y,+\tau_{xy})$가 $Y$입니다.`,
    note: R`$\tau$를 아래로 양으로 그리고 $(\sigma_x,\tau_{xy})$를 찍는 규약도 있습니다(회전 방향이 뒤집힘). 어느 규약이든 한 문제 안에서 일관되게 쓰면 됩니다.` },
  { ch: 'ch12', id: 'absMax', title: '평면 응력의 절대 최대 전단 응력', keys: ['절대 최대 전단 응력'],
    tags: 'absolute maximum shear stress three Mohr circles plane stress 절대 최대 전단 세 원',
    stmt: R`주응력이 $\sigma_1\ge\sigma_2\ge\sigma_3$이면 모든 면 가운데 최대 전단 응력은 $(\sigma_1-\sigma_3)/2$이다. 평면 응력에서는 $\{\sigma_a,\sigma_b,0\}$ 중 최대와 최소의 차의 절반.`,
    body: R`
주축 좌표에서 요소를 한 주축을 중심으로 돌리면 나머지 두 주응력만 섞이므로 그 회전의 면들은 두 주응력을 지름 끝으로 하는 모어 원 위에 있습니다. 세 주축에 대한 원 세 개가 생기고, 일반 방향의 면은 세 원 사이의 영역에 있다는 것이 알려져 있습니다(교재 7.4절). 따라서 전단 응력의 최대는 가장 큰 원의 반지름 $(\sigma_1-\sigma_3)/2$.
평면 응력은 면에 수직인 방향이 주방향이고 그 주응력이 0입니다.`,
    note: R`“세 원 사이 영역” 부분은 교재도 증명 없이 씁니다. 시험에서는 세 원의 반지름을 비교하는 것으로 충분합니다.` },
  { ch: 'ch12', id: 'strainTr', title: '변형률 변환 공식', keys: ['변형률 변환 공식'], src: '강의 슬라이드 · Lecture 10 B',
    tags: 'strain transformation gamma/2 tensor strain 변형률 변환 텐서',
    stmt: R`변형률은 응력 변환 공식에서 $\sigma\to\varepsilon$, $\tau\to\gamma/2$로 바꾼 식을 따른다.`,
    body: R`
3단원 유도: 방향 $\mathbf n$의 수직 변형률은 $\varepsilon_n=\mathbf n^T[\varepsilon]\mathbf n$, $[\varepsilon]$의 비대각은 $\gamma/2$. $\mathbf n=(\cos\theta,\sin\theta)$면 $\varepsilon_{x'}=\varepsilon_x\cos^2\theta+\varepsilon_y\sin^2\theta+\gamma_{xy}\sin\theta\cos\theta$ — 응력의 $\sigma_{x'}$ 식에서 $\tau_{xy}$ 자리에 $\gamma_{xy}/2$가 들어간 꼴입니다.
전단: $x'$, $y'$ 두 선분의 직각 변화 $\gamma_{x'y'}=2\,\mathbf e_{x'}^T[\varepsilon]\mathbf e_{y'}$를 계산하면 $\tfrac{\gamma_{x'y'}}2=-\tfrac{\varepsilon_x-\varepsilon_y}2\sin2\theta+\tfrac{\gamma_{xy}}2\cos2\theta$.`,
    note: R`행렬 $[\varepsilon]$이 응력 행렬과 같은 법칙 $Q^T[\varepsilon]Q$로 바뀌기 때문입니다. 모어 원, 주변형률, 최대 전단 변형률이 모두 그대로 옮겨집니다.` },
  { ch: 'ch12', id: 'rosette', title: '45° 로제트의 풀이', keys: ['로제트의 식'], src: '강의 슬라이드 · Lecture 10 D',
    tags: 'strain rosette 45 degree gauge 스트레인 로제트 게이지',
    stmt: R`0°, 45°, 90° 게이지의 읽음 $\varepsilon_a,\varepsilon_b,\varepsilon_c$에서 $\varepsilon_x=\varepsilon_a$, $\varepsilon_y=\varepsilon_c$, $\gamma_{xy}=2\varepsilon_b-\varepsilon_a-\varepsilon_c$.`,
    body: R`
$\varepsilon_\theta=\varepsilon_x\cos^2\theta+\varepsilon_y\sin^2\theta+\gamma_{xy}\sin\theta\cos\theta$에 넣습니다.
$\theta=0$: $\varepsilon_a=\varepsilon_x$. $\theta=90°$: $\varepsilon_c=\varepsilon_y$. $\theta=45°$: $\varepsilon_b=\tfrac12\varepsilon_x+\tfrac12\varepsilon_y+\tfrac12\gamma_{xy}$.
마지막 식에서 $\gamma_{xy}=2\varepsilon_b-\varepsilon_a-\varepsilon_c$.`,
    note: R`60° 로제트(0°, 60°, 120°)도 같은 식 세 개를 연립해 풉니다.` },
  // ───── 13
  { ch: 'ch13', id: 'vessel', title: '얇은 원통의 원주 응력과 축 응력', keys: ['원통의 원주 응력과 축 응력'], src: '강의 슬라이드 · Lecture 10 (add) B',
    tags: 'thin-walled cylinder hoop stress longitudinal stress pressure vessel 원통 원주 응력 축 응력 압력 용기',
    stmt: R`$\sigma_1=pr/t$, $\sigma_2=pr/(2t)$.`,
    body: R`
**원주.** 길이 $\Delta x$ 원통을 지름면으로 반 자른 반원통. 압력의 수직 성분 합: $\int_0^\pi p\sin\phi\,(r\,d\phi\,\Delta x)=2pr\Delta x$. 두 벽 단면의 힘 $2\sigma_1t\Delta x$. 같게: $\sigma_1=pr/t$.
**축.** 축에 수직으로 자른 한쪽(끝판 포함). 끝판을 미는 힘 $p\pi r^2$(곡면이어도 축방향 투영 넓이 $\pi r^2$). 벽 단면의 힘 $\sigma_2\cdot2\pi rt$. 같게: $\sigma_2=pr/(2t)$.`,
    note: R`곡면에 작용하는 압력의 합력은 투영 넓이 × 압력입니다(적분이 투영으로 바뀜). 유체역학의 곡면 수평력과 같은 원리입니다.` },
  { ch: 'ch13', id: 'sphere', title: '구형 용기의 막 응력', keys: ['구형 압력 용기'], src: '강의 슬라이드 · Lecture 10 (add) B',
    tags: 'spherical pressure vessel membrane stress 구형 압력 용기',
    stmt: R`구형 용기의 벽 응력은 모든 방향에서 $pr/(2t)$이다.`,
    body: R`
대칭으로 벽의 모든 방향이 동등하고 전단이 없습니다. 중심을 지나는 평면으로 반 자르면, 반구를 미는 압력 합 $p\pi r^2$(투영)을 절단면의 벽 $2\pi rt$가 받습니다: $\sigma=pr/(2t)$.`,
    note: R`원통의 원주 응력의 절반이라, 같은 압력과 반지름이면 구는 절반 두께로 충분합니다.` },
  { ch: 'ch13', id: 'vesselShear', title: '원통 벽의 면내·절대 최대 전단', keys: ['원통 벽의 전단 응력'],
    tags: 'pressure vessel maximum shear absolute in-plane 압력 용기 최대 전단 절대',
    stmt: R`원통 벽의 면내 최대 전단은 $pr/(4t)$, 바깥면의 절대 최대 전단은 $pr/(2t)$.`,
    body: R`
면내 주응력 $\sigma_1=pr/t$, $\sigma_2=pr/(2t)$. 면내: $(\sigma_1-\sigma_2)/2=pr/(4t)$.
바깥면의 세 번째 주응력 0을 넣으면 가장 큰 원은 $\sigma_1$과 0을 잇는 원: $(\sigma_1-0)/2=pr/(2t)$ — 면내 값의 두 배. 이 전단면은 벽 두께 방향으로 45° 기운 면입니다.`,
    note: R`안쪽면은 $\sigma_3=-p$라 $(pr/t+p)/2$. $t/r$이 작으면 차이가 무시됩니다.` },
  { ch: 'ch13', id: 'thinTube', title: '얇은 원통의 비틀림·굽힘 근사', keys: ['얇은 벽 원통의 추가 응력'],
    tags: 'thin-walled tube torsion bending approximation 얇은 관 비틀림 굽힘 근사',
    stmt: R`평균 반지름 $r_m$, 두께 $t$인 얇은 관: $J\approx2\pi r_m^3t$, $I\approx\pi r_m^3t$이므로 $\tau=T/(2\pi r_m^2t)$, $\sigma=Mr_m/I=M/(\pi r_m^2t)$.`,
    body: R`
$J=\tfrac\pi2(c_2^4-c_1^4)=\tfrac\pi2(c_2^2+c_1^2)(c_2+c_1)(c_2-c_1)$. $c_{1,2}=r_m\mp t/2$이면 $c_2^2+c_1^2\approx2r_m^2$, $c_2+c_1=2r_m$, $c_2-c_1=t$라 $J\approx2\pi r_m^3t$. $I=J/2$.
$\tau=Tr_m/J=T/(2\pi r_m^2t)$ — 브레트 공식 $T/(2tA)$에 $A=\pi r_m^2$를 넣은 것과 같습니다.`,
    note: R`$t/r_m=0.1$이면 $J$의 근사 오차는 약 0.25%입니다.` },
  // ───── 14
  { ch: 'ch14', id: 'genHooke', title: '일반화된 훅의 법칙', keys: ['일반화된 훅의 법칙 (등방성)'], src: '강의 슬라이드 · Lecture 11 A',
    tags: 'generalized Hooke law isotropic superposition plane stress inverse 일반화된 훅 등방성 평면 응력',
    stmt: R`등방성 선형 탄성: $\varepsilon_x=\tfrac1E[\sigma_x-\nu(\sigma_y+\sigma_z)]$ 등, $\gamma=\tau/G$. 평면 응력에서 $\sigma_x=\tfrac{E}{1-\nu^2}(\varepsilon_x+\nu\varepsilon_y)$.`,
    body: R`
$\sigma_x$ 하나: $x$로 $\sigma_x/E$, $y,z$로 $-\nu\sigma_x/E$(4단원). $\sigma_y$, $\sigma_z$도 마찬가지. 선형이므로 합: $\varepsilon_x=\sigma_x/E-\nu\sigma_y/E-\nu\sigma_z/E$.
등방성이면 수직 응력은 직각을 바꾸지 않고(대칭), 전단 응력은 길이를 바꾸지 않아 $\gamma_{xy}=\tau_{xy}/G$만 남습니다.
평면 응력($\sigma_z=0$)의 두 식 $E\varepsilon_x=\sigma_x-\nu\sigma_y$, $E\varepsilon_y=\sigma_y-\nu\sigma_x$를 연립: $E(\varepsilon_x+\nu\varepsilon_y)=(1-\nu^2)\sigma_x$.`,
    note: R`평면 응력이어도 $\varepsilon_z=-\tfrac\nu E(\sigma_x+\sigma_y)\ne0$입니다. 두께가 변하지 못하는 평면 변형률 상태와 구분하세요.` },
  { ch: 'ch14', id: 'bulk', title: '팽창률과 체적 탄성 계수', keys: ['팽창률과 체적 탄성 계수'],
    tags: 'dilatation bulk modulus volumetric strain hydrostatic 팽창률 체적 탄성 계수 정수압',
    stmt: R`$e=\varepsilon_x+\varepsilon_y+\varepsilon_z=\tfrac{1-2\nu}E(\sigma_x+\sigma_y+\sigma_z)$, 정수압에서 $k=E/[3(1-2\nu)]$.`,
    body: R`
부피비 $(1+\varepsilon_x)(1+\varepsilon_y)(1+\varepsilon_z)=1+\varepsilon_x+\varepsilon_y+\varepsilon_z+O(\varepsilon^2)$(전단 변형률은 1차에서 부피를 바꾸지 않음).
일반화된 훅의 법칙 세 식을 더하면 $e=\tfrac1E[(1-2\nu)(\sigma_x+\sigma_y+\sigma_z)]$.
정수압 $-p$: $e=-3p(1-2\nu)/E=-p/k$.`,
    note: R`$k>0$에서 $\nu<1/2$; $G>0$에서 $\nu>-1$. 등방성 재료의 $\nu$가 $(-1,\ 1/2)$에 있는 이유입니다.` },
  { ch: 'ch14', id: 'EGnu', title: 'E, ν, G의 관계', keys: ['전단 탄성 계수와 E, ν'], src: '강의 슬라이드 · Lecture 11 A (Shear Modulus vs Young’s Modulus)',
    tags: 'shear modulus relation pure shear 45 degree E nu G 전단 탄성 계수 관계 순수 전단',
    stmt: R`$G=E/[2(1+\nu)]$.`,
    body: R`
순수 전단 $\tau_{xy}=\tau$의 모어 원: 중심 원점, 반지름 $\tau$ → 45° 방향 주응력 $\pm\tau$.
주축에서 $\varepsilon_1=\tfrac1E(\tau-\nu(-\tau))=\tfrac{(1+\nu)\tau}E$.
원래 축에서 $\varepsilon_x=\varepsilon_y=0$, $\gamma_{xy}=\tau/G$ → 변형률 변환으로 45° 방향 $\varepsilon=\gamma_{xy}/2=\tau/(2G)$.
같은 방향의 같은 변형률: $\tfrac{1+\nu}E=\tfrac1{2G}$.`,
    note: R`등방성이라 주응력 방향과 주변형률 방향이 같다는 사실을 썼습니다.` },
  { ch: 'ch14', id: 'tresca', title: '트레스카 항복 조건', keys: ['트레스카 기준 (최대 전단 응력)'], src: '강의 슬라이드 · Lecture 11 B',
    tags: 'Tresca maximum shear stress yield criterion hexagon 트레스카 최대 전단 항복 육각형',
    stmt: R`절대 최대 전단 응력이 $\sigma_Y/2$에 이르면 항복한다고 보면, 평면 응력에서 조건은 $\max(|\sigma_a|,|\sigma_b|,|\sigma_a-\sigma_b|)=\sigma_Y$.`,
    body: R`
단축 인장에서 항복할 때 주응력 $\sigma_Y,0,0$이라 절대 최대 전단은 $\sigma_Y/2$. 이 값을 재료의 한계로 봅니다.
평면 응력의 세 주응력 $\sigma_a,\sigma_b,0$에서 절대 최대 전단은 $\tfrac12\max(|\sigma_a|,|\sigma_b|,|\sigma_a-\sigma_b|)$(12단원). $=\sigma_Y/2$로 두면 조건. 주응력 평면에서 육각형이 됩니다.`,
    note: R`금속의 항복이 결정면의 미끄럼(전단)이라는 물리적 그림에 가장 가까운 기준입니다.` },
  { ch: 'ch14', id: 'vonMises', title: '폰 미제스 등가 응력', keys: ['폰 미제스 기준 (최대 뒤틀림 에너지)'], src: '강의 슬라이드 · Lecture 11 B',
    tags: 'von Mises distortion energy equivalent stress yield ellipse 폰 미제스 뒤틀림 에너지 등가 응력',
    stmt: R`평면 응력에서 폰 미제스 조건 $\sigma_a^2-\sigma_a\sigma_b+\sigma_b^2=\sigma_Y^2$는 $\sigma_x^2-\sigma_x\sigma_y+\sigma_y^2+3\tau_{xy}^2=\sigma_Y^2$와 같다.`,
    body: R`
**에너지.** 변형 에너지 밀도 $u=\tfrac1{2E}[\sigma_a^2+\sigma_b^2+\sigma_c^2-2\nu(\sigma_a\sigma_b+\sigma_b\sigma_c+\sigma_c\sigma_a)]$에서 부피 변화 몫 $\tfrac{1-2\nu}{6E}(\sigma_a+\sigma_b+\sigma_c)^2$를 빼면 뒤틀림 에너지 $u_d=\tfrac{1+\nu}{6E}[(\sigma_a-\sigma_b)^2+(\sigma_b-\sigma_c)^2+(\sigma_c-\sigma_a)^2]$. 단축 항복의 $u_d$와 같게 두고 $\sigma_c=0$: $(\sigma_a-\sigma_b)^2+\sigma_a^2+\sigma_b^2=2\sigma_Y^2$, 곧 $\sigma_a^2-\sigma_a\sigma_b+\sigma_b^2=\sigma_Y^2$.
**성분으로.** $\sigma_a+\sigma_b=\sigma_x+\sigma_y$, $\sigma_a\sigma_b=\sigma_x\sigma_y-\tau_{xy}^2$(행렬의 대각합과 행렬식). $\sigma_a^2-\sigma_a\sigma_b+\sigma_b^2=(\sigma_a+\sigma_b)^2-3\sigma_a\sigma_b=(\sigma_x+\sigma_y)^2-3\sigma_x\sigma_y+3\tau_{xy}^2$.`,
    note: R`축 표면($\sigma_y=0$)이면 $\sqrt{\sigma^2+3\tau^2}$. 트레스카는 $\sqrt{\sigma^2+4\tau^2}$입니다.` },
  { ch: 'ch14', id: 'brittle', title: '취성 재료의 파괴 기준', keys: ['최대 수직 응력 기준 (랭킨)', '모어 기준 (쿨롱-모어 직선 근사)'],
    tags: 'brittle fracture maximum normal stress Rankine Mohr Coulomb criterion 취성 파괴 최대 수직 응력 모어',
    stmt: R`최대 수직 응력 기준: $|\sigma_{a,b}|<\sigma_U$. 모어 기준(직선 근사): $\sigma_a>0>\sigma_b$에서 $\sigma_a/\sigma_{UT}-\sigma_b/\sigma_{UC}=1$이 파괴 경계.`,
    body: R`
**최대 수직 응력.** 취성 재료는 가장 큰 인장 수직 응력의 면에서 균열이 열린다고 보고, 단축 시험의 강도와 비교합니다.
**모어 기준.** 단축 인장($\sigma_{UT}$, 0)과 단축 압축(0, $-\sigma_{UC}$) 시험의 모어 원 두 개에 공통 접선(파괴 포락선)을 긋고, 어떤 상태의 원이 포락선에 닿으면 파괴로 봅니다. 포락선을 직선으로 두면, 원 $(\sigma_a,\sigma_b)$가 포락선에 닿는 조건은 두 시험 원 사이의 선형 보간이 되어 $\sigma_a/\sigma_{UT}-\sigma_b/\sigma_{UC}=1$입니다(1·3사분면은 한 시험의 원이 곧 한계).`,
    note: R`$\sigma_{UT}=\sigma_{UC}$이면 모어 직선 기준은 트레스카와 같은 육각형이 됩니다.` },
  // ───── 15
  { ch: 'ch15', id: 'springBar', title: '스프링으로 받친 강체 막대의 임계 하중', keys: ['좌굴의 판정'], src: '강의 슬라이드 · Lecture 12 A',
    tags: 'stability rigid bar spring critical load neutral equilibrium 안정성 강체 막대 스프링 임계 하중 중립 평형',
    stmt: R`아래끝 핀, 위끝 수평 스프링 $k$인 강체 막대(길이 $L$)의 임계 하중은 $P_{cr}=kL$.`,
    body: R`
위끝을 $u$만큼(작은 각) 밀어 휜 상태를 만듭니다. 핀 $O$에 대한 모멘트: 스프링 $ku$가 팔 $L$로 되돌림 $kuL$, 하중 $P$가 팔 $u$로 넘어뜨림 $Pu$.
알짜 되돌림 모멘트 $(kL-P)u$. $P<kL$이면 교란의 반대로 작용해 안정, $P>kL$이면 교란을 키워 불안정. $P=kL$이면 모든 작은 $u$에서 0 — 중립 평형이 임계 상태.`,
    note: R`퍼텐셜 에너지로도: $\Pi=\tfrac12ku^2-P(L-\sqrt{L^2-u^2})\approx\tfrac12(k-P/L)u^2$. $u=0$이 극소(안정)일 조건이 $P<kL$입니다.` },
  { ch: 'ch15', id: 'euler', title: '오일러 좌굴 하중', keys: ['좌굴 방정식과 오일러 하중'], src: '강의 슬라이드 · Lecture 12 B',
    tags: 'Euler buckling load pin-ended column eigenvalue mode shape 오일러 좌굴 핀 기둥 고유값 모드',
    stmt: R`양끝 핀 기둥의 좌굴 하중은 $P=n^2\pi^2EI/L^2$, 가장 작은 $P_{cr}=\pi^2EI/L^2$, 모양 $\sin(\pi x/L)$.`,
    body: R`
휜 상태 $v(x)$에서 위쪽 조각의 평형: 단면 모멘트 $M=-Pv$. $EIv''=M$에서 $v''+k^2v=0$, $k^2=P/(EI)$.
해 $v=A\sin kx+B\cos kx$. $v(0)=0\Rightarrow B=0$. $v(L)=0\Rightarrow A\sin kL=0$.
$A\ne0$(휜 상태)이려면 $kL=n\pi$, $P=n^2\pi^2EI/L^2$. 기둥은 하중을 올리며 처음 만나는 $n=1$에서 좌굴합니다.`,
    note: R`$n=2$ 이상의 모드는 가운데를 가새로 받쳐 $n=1$을 막을 때 나타납니다(유효 길이가 절반).` },
  { ch: 'ch15', id: 'effLen', title: '끝 조건과 유효 길이', keys: ['유효 길이'], src: '강의 슬라이드 · Lecture 12 B (For other cases)',
    tags: 'effective length end conditions fixed free fixed-pinned tan kL = kL 유효 길이 끝 조건 고정 자유',
    stmt: R`고정-자유 $L_e=2L$, 고정-고정 $L_e=0.5L$, 고정-핀 $L_e\approx0.699L$.`,
    body: R`
**고정-자유.** 아래 고정, 위 자유(끝 처짐 $\delta$). 위쪽 조각: $M=P(\delta-v)$, $EIv''+Pv=P\delta$. 해 $v=\delta(1-\cos kx)$가 $v(0)=v'(0)=0$을 만족하고, $v(L)=\delta$에서 $\cos kL=0$, $kL=\pi/2$. $P_{cr}=\pi^2EI/(2L)^2$.
**고정-고정.** 대칭 모양 $v=\tfrac\delta2(1-\cos\tfrac{2\pi x}L)$이 양끝 $v=v'=0$을 만족하고 $EIv''''+Pv''=0$의 해이려면 $P=4\pi^2EI/L^2$, 곧 $L_e=L/2$.
**고정-핀.** 핀 쪽에 수평 반력 $R$이 생겨 $EIv''+Pv=R(L-x)$. 해와 세 조건($v(0)=v'(0)=0$, $v(L)=0$)에서 $\tan kL=kL$, 첫 양근 $kL=4.4934$. $L_e=\pi/k=0.699L$.`,
    note: R`실제 설계에서는 완전 고정이 어렵다고 보고 권장 유효 길이를 조금 크게(고정-고정 $0.65L$ 등) 잡기도 합니다.` },
  { ch: 'ch15', id: 'critStress', title: '임계 응력과 오일러 영역', keys: ['임계 응력'],
    tags: 'critical stress slenderness ratio radius of gyration Euler validity 임계 응력 세장비 회전 반지름',
    stmt: R`$\sigma_{cr}=\pi^2E/(L_e/r)^2$이고, 오일러 공식은 $L_e/r\ge\pi\sqrt{E/\sigma_Y}$에서 유효하다.`,
    body: R`
$I=Ar^2$을 $P_{cr}=\pi^2EI/L_e^2$에 넣고 $A$로 나누면 $\sigma_{cr}=\pi^2E r^2/L_e^2$.
유도는 선형 탄성($\sigma=E\varepsilon$)을 가정하므로 좌굴 전 응력 $\sigma_{cr}$이 항복 강도 이하여야 합니다: $\pi^2E/(L_e/r)^2\le\sigma_Y\iff L_e/r\ge\pi\sqrt{E/\sigma_Y}$.`,
    note: R`경계 근처의 중간 기둥은 잔류 응력과 초기 굽음 때문에 오일러 곡선보다 낮은 하중에서 파손되어, 설계 규정은 경험식을 씁니다(교재 10.3절).` },
  );
})();
