/* 유도 — 중간고사 1 범위에 새로 넣은 단원: 05 움직이는 좌표계, 07 오일러 각, 08 동차 변환, 09 D-H, 10단원의 SO(3) 공 */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 05
  { ch: 'ch05', id: 'axisDeriv', title: '물체 축의 미분은 각속도와의 외적이다', keys: ['물체 축의 미분'], src: '강의 자료 · Week 4',
    tags: 'unit axis derivative angular velocity cross product 축 미분 각속도 외적 단위 벡터',
    stmt: R`물체에 붙은 좌표계의 단위 축 $\hat x_b(t)$는 $\dot{\hat x}_b=\omega\times\hat x_b$를 만족한다. 여기서 $\omega$는 물체의 각속도이고 세 축에 대해 같은 벡터다.`,
    body: R`
**길이가 일정하다.** $\hat x_b\cdot\hat x_b=1$을 미분하면 $2\hat x_b\cdot\dot{\hat x}_b=0$이므로 $\dot{\hat x}_b\perp\hat x_b$. 같은 식으로 $\hat x_b\cdot\hat y_b=0$을 미분하면 $\dot{\hat x}_b\cdot\hat y_b=-\hat x_b\cdot\dot{\hat y}_b$ (세 쌍 모두).
**행렬로.** 세 축을 열로 모은 $R$은 $R^TR=I$이고 미분하면 $\dot R^TR+R^T\dot R=0$, 곧 $\dot RR^T$의 전치가 $R\dot R^T=-(\dot RR^T)$이므로 $\dot RR^T$는 반대칭 행렬입니다. 반대칭 행렬은 어떤 벡터 $\omega$에 대해 $[\omega]$로 쓸 수 있으므로 $\dot R=[\omega]R$, 열마다 $\dot{\hat x}_b=\omega\times\hat x_b$.
**$\omega$가 각속도인 이유.** 짧은 시간 $\Delta t$ 동안의 회전을 축 $\hat w$, 각 $\Delta\theta$로 쓰면 로드리게스 공식에서 $R(t+\Delta t)\approx(I+\Delta\theta[\hat w])R(t)$. 양변에서 $R(t)$를 빼고 $\Delta t$로 나누면 $\dot R=\dot\theta[\hat w]R$ → $\omega=\hat w\dot\theta$.`,
    note: R`세 축의 미분이 모두 **같은** $\omega$로 적힌다는 것이 핵심입니다. 세 축이 서로 수직을 유지하며 함께 돌기 때문입니다.` },
  { ch: 'ch05', id: 'angVelAdd', title: '좌표계를 이으면 각속도가 더해진다', keys: ['각속도의 덧셈'], src: '강의 자료 · Week 4',
    tags: 'angular velocity addition composition frames 각속도 덧셈 합성',
    stmt: R`$R_{sc}(t)=R_{sb}(t)R_{bc}(t)$이면 {s}에서 적은 각속도는 $\omega_{sc}=\omega_{sb}+R_{sb}\,\omega_{bc}$이다. 여기서 $\omega_{bc}$는 {b}에서 적은 {c}의 각속도.`,
    body: R`
곱의 미분: $\dot R_{sc}=\dot R_{sb}R_{bc}+R_{sb}\dot R_{bc}$. 오른쪽에 $R_{sc}^T=R_{bc}^TR_{sb}^T$를 곱하면
$$\dot R_{sc}R_{sc}^T=\dot R_{sb}R_{sb}^T+R_{sb}(\dot R_{bc}R_{bc}^T)R_{sb}^T=[\omega_{sb}]+R_{sb}[\omega_{bc}]R_{sb}^T.$$
반대칭 행렬의 켤레 항등식 $R[\omega]R^T=[R\omega]$로 둘째 항은 $[R_{sb}\omega_{bc}]$. 따라서 $[\omega_{sc}]=[\omega_{sb}+R_{sb}\omega_{bc}]$.`,
    note: R`관절이 직렬로 이어진 로봇에서 링크의 각속도는 관절 속도 × (그 순간의 관절 축)의 합입니다. 14단원 야코비안의 위 세 행이 바로 이것입니다.` },
  { ch: 'ch05', id: 'movingVel', title: '움직이는 좌표계로 본 점의 속도', keys: ['움직이는 좌표계의 속도'], src: '강의 자료 · Week 4',
    tags: 'moving frame velocity relative velocity transport 움직이는 좌표계 속도 상대 속도',
    stmt: R`원점 $o_b$, 각속도 $\omega$로 움직이는 {b}에서 좌표 $(x,y,z)$로 적힌 점의 속도는 $v_p=\dot o_b+v_{\text{rel}}+\omega\times r$, $r=p-o_b$, $v_{\text{rel}}=\dot x\hat x_b+\dot y\hat y_b+\dot z\hat z_b$.`,
    body: R`
$p=o_b+x\hat x_b+y\hat y_b+z\hat z_b$를 곱의 미분으로 미분하면
$$\dot p=\dot o_b+(\dot x\hat x_b+\dot y\hat y_b+\dot z\hat z_b)+(x\dot{\hat x}_b+y\dot{\hat y}_b+z\dot{\hat z}_b).$$
셋째 묶음에 $\dot{\hat x}_b=\omega\times\hat x_b$ 등을 넣고 외적의 선형성으로 묶으면 $\omega\times(x\hat x_b+y\hat y_b+z\hat z_b)=\omega\times r$.
같은 식을 행렬로 쓰면 $p=o_b+Rr_b$에서 $\dot p=\dot o_b+R\dot r_b+\dot Rr_b=\dot o_b+R\dot r_b+[\omega_s]Rr_b$로, $R\dot r_b=v_{\text{rel}}$, $Rr_b=r$입니다.`,
    note: R`점이 {b}에 고정되어 있으면($v_{\text{rel}}=0$) 강체의 속도 공식 $v_p=v_o+\omega\times r$이 됩니다. 11단원의 트위스트는 이 식을 여섯 성분으로 묶은 것입니다.` },
  { ch: 'ch05', id: 'movingAcc', title: '가속도의 다섯 항과 코리올리 항', keys: ['움직이는 좌표계의 가속도'], src: '강의 자료 · Week 4',
    tags: 'coriolis centripetal tangential acceleration moving frame 코리올리 구심 접선 가속도',
    stmt: R`위의 점의 가속도는 $a_p=\ddot o_b+a_{\text{rel}}+2\omega\times v_{\text{rel}}+\dot\omega\times r+\omega\times(\omega\times r)$이다.`,
    body: R`
{b}의 축으로 적힌 벡터 $u=u_1\hat x_b+u_2\hat y_b+u_3\hat z_b$의 미분은 축의 미분 규칙으로 $\dot u=\mathring u+\omega\times u$, $\mathring u=\dot u_1\hat x_b+\dot u_2\hat y_b+\dot u_3\hat z_b$(성분만 미분한 것).
속도 $v_p=\dot o_b+v_{\text{rel}}+\omega\times r$를 미분합니다.
- $\dfrac d{dt}v_{\text{rel}}=\mathring v_{\text{rel}}+\omega\times v_{\text{rel}}=a_{\text{rel}}+\omega\times v_{\text{rel}}$.
- $\dfrac d{dt}(\omega\times r)=\dot\omega\times r+\omega\times\dot r$, 그리고 $\dot r=\mathring r+\omega\times r=v_{\text{rel}}+\omega\times r$.
더하면 $a_p=\ddot o_b+a_{\text{rel}}+\omega\times v_{\text{rel}}+\dot\omega\times r+\omega\times v_{\text{rel}}+\omega\times(\omega\times r)$, 같은 항 둘을 묶어 $2\omega\times v_{\text{rel}}$.`,
    note: R`$\omega\times(\omega\times r)=-\lVert\omega\rVert^2r_\perp$($r_\perp$는 $r$의 회전축에 수직인 성분)이므로 구심 항은 늘 축을 향하고 크기가 $\lVert\omega\rVert^2\lVert r_\perp\rVert$입니다.` },
  // ───── 07
  { ch: 'ch07', id: 'eulerZYX', title: 'ZYX 오일러 각: 짐벌과 움직이는 축', keys: ['ZYX 오일러 각'], src: '강의 자료 · Week 4',
    tags: 'euler angles zyx gimbal moving axes post multiplication 오일러 각 짐벌 물체 축',
    stmt: R`관절 1, 2, 3의 축이 영 자세에서 $\hat z,\hat y,\hat x$인 짐벌의 방향은 $R_{03}=\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\gamma)$이고, 이것은 물체를 물체 축 $\hat z_b\to\hat y_b\to\hat x_b$ 순서로 돌린 결과와 같다.`,
    body: R`
영 자세에서 {0}–{3}이 겹치게 링크 좌표계를 붙이면, 관절 $i$는 {i−1}의 한 좌표축 둘레의 기본 회전이므로 $R_{01}=\mathrm{Rot}(\hat z,\alpha)$, $R_{12}=\mathrm{Rot}(\hat y,\beta)$, $R_{23}=\mathrm{Rot}(\hat x,\gamma)$. 아래첨자 지우기로 $R_{03}=R_{01}R_{12}R_{23}$.
물체 축 해석: $R_{sb}=I$에서 시작해 물체 축 둘레의 회전은 뒷곱이므로 $\hat z_b$ 둘레 $\alpha$ → $R=\mathrm{Rot}(\hat z,\alpha)$, 새 $\hat y_b$ 둘레 $\beta$ → $R\,\mathrm{Rot}(\hat y,\beta)$, 새 $\hat x_b$ 둘레 $\gamma$ → $R\,\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\gamma)$. 같은 곱입니다.
곱을 전개하면 (B.1)이 나옵니다(첫째 열 $\mathrm{Rot}(\hat z,\alpha)(c_\beta,0,-s_\beta)$, 셋째 행 $(-s_\beta,c_\beta s_\gamma,c_\beta c_\gamma)$ 등).`,
    note: R`짐벌에서는 관절 3이 관절 2에 실려 함께 돌기 때문에 “움직이는 축”이 자연스럽게 생깁니다.` },
  { ch: 'ch07', id: 'eulerInverse', title: '오일러 각의 역문제: 해의 존재와 짐벌 록', keys: ['ZYX 오일러 각 구하기 (atan2)', '짐벌 록 (오일러 각의 특이점)'], src: '강의 자료 · Week 4',
    tags: 'inverse euler atan2 gimbal lock singularity existence 오일러 역문제 짐벌 록 특이점',
    stmt: R`모든 $R\in SO(3)$에 대해 (B.1)을 만족하는 $(\alpha,\beta,\gamma)$가 있다. $r_{31}\ne\pm1$이면 해는 두 개이고, $r_{31}=\mp1$($\beta=\pm90°$)이면 $\alpha\mp\gamma$만 정해지는 무수히 많은 해가 있다.`,
    body: R`
**$\beta$.** $R$의 셋째 행 $(r_{31},r_{32},r_{33})$은 단위 벡터이므로 $r_{31}\in[-1,1]$, $\sin\beta=-r_{31}$을 만족하는 $\beta$가 $[-90°,90°]$에 있습니다. 첫째 열도 단위 벡터라 $r_{11}^2+r_{21}^2=1-r_{31}^2=\cos^2\beta$.
**$\cos\beta\ne0$.** 첫째 열 $(r_{11},r_{21})=\cos\beta(\cos\alpha,\sin\alpha)$, 셋째 행의 $(r_{33},r_{32})=\cos\beta(\cos\gamma,\sin\gamma)$이므로 $\alpha,\gamma$가 atan2로 하나씩 정해집니다. 그렇게 만든 $R'=R(\alpha,\beta,\gamma)$는 첫째 열과 셋째 행이 $R$과 같습니다. 두 회전 행렬의 첫째 열 $c$와 셋째 행이 같으면, 둘째·셋째 열은 $c$에 수직인 평면의 정규 직교 기저이고 셋째 행 성분까지 같으므로 일치합니다(오른손 조건으로 부호까지). 따라서 $R'=R$. $\cos\beta$의 부호를 반대로 고르면 $(\alpha+\pi,\pi-\beta,\gamma+\pi)$가 또 하나의 해입니다.
**$\cos\beta=0$.** $\beta=90°$를 넣으면 (B.1)의 첫 두 행은 $\sin(\gamma-\alpha)$, $\cos(\gamma-\alpha)$로만 이루어지고($\beta=-90°$이면 $\gamma+\alpha$), 첫째 열은 $(0,0,\mp1)$. $R$이 그 꼴이므로 $\gamma-\alpha$(또는 $\gamma+\alpha$)를 atan2로 정하면 해가 되고, 그 차(합)를 유지하는 모든 쌍이 해입니다.`,
    note: R`짐벌 록은 회전 자체의 특이성이 아니라 세 각이라는 좌표의 특이점입니다. 같은 자세를 지수 좌표(10단원)로 적으면 아무 문제가 없습니다.` },
  { ch: 'ch07', id: 'rpyEqZyx', title: '고정 축 XYZ = 물체 축 ZYX', keys: ['XYZ 롤-피치-요 = ZYX 오일러 각'], src: '강의 자료 · Week 4',
    tags: 'roll pitch yaw fixed axes body axes reverse order 롤 피치 요 고정 축 물체 축',
    stmt: R`고정 축 $\hat x,\hat y,\hat z$ 둘레로 차례로 $\gamma,\beta,\alpha$ 돌린 결과와, 물체 축 $\hat z_b,\hat y_b,\hat x_b$ 둘레로 차례로 $\alpha,\beta,\gamma$ 돌린 결과는 같은 행렬 $\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\gamma)$이다.`,
    body: R`
고정 축 회전은 앞곱이므로 $I\to\mathrm{Rot}(\hat x,\gamma)\to\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\gamma)\to\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\gamma)$.
물체 축 회전은 뒷곱이므로 $I\to\mathrm{Rot}(\hat z,\alpha)\to\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat y,\beta)\to\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat x,\gamma)$.
두 결과가 같습니다. 일반적으로 $R_1R_2\cdots R_k$는 “고정 축으로 $R_k$부터 거꾸로” 또는 “물체 축으로 $R_1$부터 차례로” 읽을 수 있습니다.`,
    note: R`앞곱이 고정 축인 이유: $R'=\mathrm{Rot}(\hat\omega,\theta)R$의 열은 $R$의 열(물체 축)을 고정 좌표계에서 읽은 축 $\hat\omega$ 둘레로 돌린 것입니다(6단원).` },
  { ch: 'ch07', id: 'eulerAxes', title: 'ZYZ 오일러 각과 축의 직교 조건', keys: ['ZYZ·ZXZ 오일러 각'],
    tags: 'zyz zxz euler angles orthogonal axes condition inverse 오일러 각 직교 조건',
    stmt: R`축 1 ⊥ 축 2, 축 2 ⊥ 축 3이면 $\mathrm{Rot}(\text{축 1},\alpha)\mathrm{Rot}(\text{축 2},\beta)\mathrm{Rot}(\text{축 3},\gamma)$로 모든 회전을 나타낼 수 있다. ZYZ의 역문제는 $\beta=\operatorname{atan2}(\sqrt{r_{31}^2+r_{32}^2},r_{33})$, $\alpha=\operatorname{atan2}(r_{23},r_{13})$, $\gamma=\operatorname{atan2}(r_{32},-r_{31})$.`,
    sketch: true,
    body: R`
**ZYZ에서.** $R=\mathrm{Rot}(\hat z,\alpha)\mathrm{Rot}(\hat y,\beta)\mathrm{Rot}(\hat z,\gamma)$는 $\hat z$ 축을 $R\hat z=\mathrm{Rot}(\hat z,\alpha)(\sin\beta,0,\cos\beta)$로 보냅니다. 임의의 단위 벡터는 구면 좌표(방위 $\alpha$, 극각 $\beta\in[0,\pi]$)로 이렇게 쓸 수 있으므로 $R\hat z$를 원하는 셋째 열에 맞출 수 있고, 남은 자유는 그 축 둘레의 회전 $\gamma$입니다. 셋째 열 $(c_\alpha s_\beta,s_\alpha s_\beta,c_\beta)$와 셋째 행 $(-s_\beta c_\gamma,s_\beta s_\gamma,c_\beta)$에서 공식이 나옵니다($\sin\beta\gt0$).
**일반 조건.** 축 2가 축 1과 수직이면 $\mathrm{Rot}(\text{축 1},\alpha)\mathrm{Rot}(\text{축 2},\beta)$가 축 3을 구면 전체로 보낼 수 있고(축 3 ⊥ 축 2이므로 $\beta$로 축 3과 축 1 사이의 각을 $0$–$\pi$로 바꿀 수 있음), 남은 축 3 둘레의 회전이 나머지 자유도를 채웁니다. 축 2가 축 1과 같으면 처음 두 회전이 합쳐져 매개변수가 둘로 줄어듭니다.`,
    note: R`ZXZ도 같은 방식이며 Problem Set #3 다섯째 문제에 전개가 있습니다.` },
  // ───── 08
  { ch: 'ch08', id: 'se3PrePost', title: '동차 변환의 앞곱은 고정 기준, 뒷곱은 물체 기준', keys: ['동차 변환의 앞곱과 뒷곱'],
    tags: 'homogeneous transformation pre multiply post multiply fixed body frame 앞곱 뒷곱 고정 물체',
    stmt: R`$T=\mathrm{Trans}(p)\mathrm{Rot}(\hat\omega,\theta)$에 대해 $TT_{sb}$는 {b}를 {s}의 원점을 지나는 축 $\hat\omega$(={s}에서 읽음) 둘레로 $\theta$ 돌린 뒤 {s}에서 잰 $p$만큼 옮긴 것이고, $T_{sb}T$는 {b}를 {b}의 축으로 잰 $p$만큼 옮긴 뒤 옮겨진 원점을 지나는 축 $\hat\omega$(={b}에서 읽음) 둘레로 돌린 것이다.`,
    body: R`
$T_{sb}=(R,q)$라 하자. $TT_{sb}=(R_\omega R,\ R_\omega q+p)$: 방향의 열(물체 축)이 고정 축 $\hat\omega$ 둘레로 돌고, 원점 $q$도 같은 축 둘레로 돈 뒤 $p$가 더해집니다 — 모든 것이 {s}의 원점과 축 기준.
$T_{sb}T=(RR_\omega,\ Rp+q)$: 원점은 $q$에서 $Rp$, 곧 {b}의 축으로 적힌 $p$만큼 옮겨지고, 방향은 $RR_\omega=\mathrm{Rot}(R\hat\omega,\theta)R$ — {s}에서 본 축 $R\hat\omega$(= {b}의 축 $\hat\omega$) 둘레의 회전입니다. 회전은 옮겨진 원점에서 일어나도 원점의 위치를 바꾸지 않으므로 “옮긴 뒤 그 자리에서 돈다”가 됩니다.`,
    note: R`곱을 왼쪽부터 읽으면 물체 기준, 오른쪽부터 읽으면 고정 기준이라는 7단원의 규칙이 동차 변환에서도 그대로입니다.` },
  { ch: 'ch08', id: 'chainRule', title: '좌표계 사슬과 두 가지 해석', keys: ['좌표계 사슬', '점의 좌표 바꾸기와 점 옮기기'],
    tags: 'frame chain subscript cancellation change of coordinates displacement 좌표계 사슬 좌표 바꾸기 점 옮기기',
    stmt: R`좌표계 $x=f_0,f_1,\dots,f_k=y$를 잇는 길에서 $T_{xy}=T_{f_0f_1}T_{f_1f_2}\cdots T_{f_{k-1}f_k}$이고, 거꾸로 지나는 화살표는 역행렬로 바꾼다. 같은 곱 $Tp$는 $T$를 $T_{ab}$로 보면 좌표 바꾸기, 변환으로 보면 점 옮기기다.`,
    body: R`
**사슬.** 한 점의 좌표에 대해 $p_{f_{i-1}}=T_{f_{i-1}f_i}p_{f_i}$(좌표 바꾸기의 정의)를 차례로 적용하면 $p_x=T_{f_0f_1}\cdots T_{f_{k-1}f_k}p_y$이고, 이것이 모든 점에 대해 성립하므로 $T_{xy}$는 그 곱입니다. 주어진 것이 $T_{f_if_{i-1}}$(반대 방향)이면 $T_{f_{i-1}f_i}=T_{f_if_{i-1}}^{-1}$.
**두 해석.** $p_a=T_{ab}p_b$는 점은 그대로 두고 그 점을 적는 수만 {b}에서 {a}로 바꾼 것입니다. 한편 한 좌표계 안에서 $p'=Tp$는 $p$를 $T$만큼 돌리고 옮긴 다른 점입니다. 행렬 곱은 같지만 “$T$의 아래첨자가 $p$의 좌표계와 맞물리는가”로 구별합니다: $T_{sb}p_b$는 맞물리므로 좌표 바꾸기, $T_{sb}p_s$는 맞물리지 않으므로 점 옮기기.`,
    note: R`방향 벡터는 마지막 성분이 0인 $(v,0)$이라 사슬에서 회전 부분만 곱해집니다.` },
  // ───── 09
  { ch: 'ch09', id: 'dhMatrix', title: 'D-H 링크 변환의 행렬', keys: ['D-H 링크 변환', 'D-H 매개변수의 정의'],
    tags: 'denavit hartenberg link transform matrix twist length offset joint angle D-H 링크 변환',
    stmt: R`D-H 규칙으로 정한 이웃 좌표계 사이의 변환은 $T_{i-1,i}=\mathrm{Rot}(\hat x,\alpha_{i-1})\mathrm{Trans}(\hat x,a_{i-1})\mathrm{Trans}(\hat z,d_i)\mathrm{Rot}(\hat z,\phi_i)$이다.`,
    body: R`
{i−1}에서 출발해 움직이는 축 기준으로 차례로 옮깁니다(뒷곱). (1) $\hat x_{i-1}$ 둘레로 $\alpha_{i-1}$: $\hat z$가 축 $i$와 나란해짐(꼬임의 정의). (2) $\hat x$를 따라 $a_{i-1}$: 공통 수선의 반대쪽 끝, 곧 축 $i$ 위의 점에 도착(길이의 정의). (3) 이제 $\hat z$가 축 $i$와 겹치므로 $\hat z$를 따라 $d_i$: {i}의 원점(오프셋의 정의). (4) $\hat z$ 둘레로 $\phi_i$: $\hat x$가 $\hat x_i$와 겹침(관절 각의 정의).
행렬로 곱하면 $\begin{bmatrix}c_\phi&-s_\phi&0&a\\s_\phi c_\alpha&c_\phi c_\alpha&-s_\alpha&-ds_\alpha\\s_\phi s_\alpha&c_\phi s_\alpha&c_\alpha&dc_\alpha\\0&0&0&1\end{bmatrix}$. (1)(2)는 같은 축 $\hat x$, (3)(4)는 같은 축 $\hat z$의 회전·이동이라 서로 교환됩니다.`,
    note: R`다른 책의 표준 D-H는 $\mathrm{Rot}(\hat z,\theta_i)\mathrm{Trans}(\hat z,d_i)\mathrm{Trans}(\hat x,a_i)\mathrm{Rot}(\hat x,\alpha_i)$로 순서와 아래첨자가 다릅니다.` },
  { ch: 'ch09', id: 'dhFour', title: 'D-H에는 왜 네 수면 충분한가', keys: ['D-H 링크 좌표계 정하기', 'D-H 좌표계를 정하는 특수한 경우'],
    tags: 'why four parameters common normal constraints denavit hartenberg 네 매개변수 공통 수선',
    stmt: R`D-H 규칙($\hat z_i$는 관절 축, $\hat x_{i-1}$은 공통 수선 방향, 원점은 공통 수선의 발)을 따르면 $T_{i-1,i}$는 여섯이 아니라 네 개의 수로 정해진다. 대신 이 규칙을 만족하지 않는 좌표계 쌍은 D-H로 적을 수 없다.`,
    body: R`
두 좌표계 사이의 일반 변환은 6자유도입니다. D-H 규칙은 두 조건을 강제합니다. (가) $\hat x_{i-1}\perp\hat z_i$: 공통 수선은 두 축에 모두 수직. (나) $\hat x_{i-1}$을 품은 직선이 축 $i$($\hat z_i$를 품은 직선)와 **만난다**: 공통 수선의 끝이 축 $i$ 위에 있음. 두 조건이 자유도를 하나씩 없애 $6-2=4$.
남은 넷이 정확히 $\alpha,a,d,\phi$임은 위의 분해에서 보입니다: $\hat x_{i-1}$ 둘레 회전과 이동, $\hat z_i$ 둘레 회전과 이동 — 네 개의 1자유도 운동이 (가)(나)를 지키는 모든 변환을 만듭니다.
반대로 {a}에서 {b}로 $\hat y_a$ 방향으로만 옮긴 경우처럼 (가) 또는 (나)를 어기는 변환은 이 네 운동으로 만들 수 없습니다.`,
    note: R`두 축이 만나면(가)의 수직 방향이 두 가지, 평행하면 (나)의 교점 위치가 무수히 많아집니다 — 9단원 §C.1b의 특수한 경우들입니다.` },
  { ch: 'ch09', id: 'dhToPoe', title: 'D-H 곱에서 지수곱 공식으로', keys: ['D-H에서 지수곱으로', 'D-H 정기구학'],
    tags: 'denavit hartenberg product of exponentials relation M e^A conjugation 지수곱 D-H 관계',
    stmt: R`회전 관절만 있는 사슬에서 $T_{0n}=M_1e^{[A_1]\theta_1}\cdots M_ne^{[A_n]\theta_n}=e^{[\mathcal S_1]\theta_1}\cdots e^{[\mathcal S_n]\theta_n}M$, $[\mathcal S_i]=(M_1\cdots M_{i-1})[A_i](M_1\cdots M_{i-1})^{-1}$, $M=M_1\cdots M_n$.`,
    body: R`
$M_i=\mathrm{Rot}(\hat x,\alpha_{i-1})\mathrm{Trans}(\hat x,a_{i-1})\mathrm{Trans}(\hat z,d_i)$는 상수이고 $\mathrm{Rot}(\hat z,\theta_i)=e^{[A_i]\theta_i}$, $A_i=(0,0,1,0,0,0)$.
행렬 항등식 $Ne^{P}N^{-1}=e^{NPN^{-1}}$(급수의 각 항에서 $N^{-1}N$이 지워짐)을 $Ne^P=e^{NPN^{-1}}N$ 꼴로 왼쪽부터 씁니다. $M_1e^{[A_1]\theta_1}=e^{[\mathcal S_1]\theta_1}M_1$, 다음으로 $M_1M_2e^{[A_2]\theta_2}=e^{[\mathcal S_2]\theta_2}M_1M_2$, … $n$번 하면 모든 지수 인자가 왼쪽으로 모이고 오른쪽에 $M=M_1\cdots M_n$이 남습니다.
$[\mathcal S_i]=N[A_i]N^{-1}$, $N=M_1\cdots M_{i-1}=T_{0,i}(0)$는 11단원의 트위스트 좌표 바꾸기 $\mathcal S_i=[\mathrm{Ad}_N]A_i$입니다: {i}에서 본 관절 축 $A_i$를 영 자세의 {0}에서 본 것.`,
    note: R`병진 관절이면 $\mathrm{Trans}(\hat z,d_i)$와 $\mathrm{Rot}(\hat z,\phi_i)$의 순서를 바꿔 같은 꼴을 만듭니다(같은 축이라 교환 가능).` },
  // ───── 10 (new section)
  { ch: 'ch10', id: 'so3Ball', title: 'SO(3)는 맞은편 겉면을 붙인 반지름 π의 공', keys: ['SO(3)의 지수 좌표 공'],
    tags: 'SO(3) ball radius pi antipodal exponential coordinates RP3 지수 좌표 공 맞은편',
    stmt: R`$r\mapsto e^{[r]}$는 공 $\{\lVert r\rVert\le\pi\}$에서 $SO(3)$ 위로 가는 사상이며, 공의 안쪽에서는 일대일이고 겉면에서는 정확히 맞은편 두 점 $r,-r$이 같은 회전으로 간다.`,
    body: R`
**위로.** 행렬 로그(10단원 §3.2.3b)는 모든 $R$에 대해 $\theta\in[0,\pi]$인 $\hat\omega\theta$를 줍니다. 따라서 모든 회전은 공 안의 어떤 점의 상입니다.
**안쪽에서 일대일.** $e^{[r]}=R$이면 대각합에서 $1+2\cos\lVert r\rVert=\operatorname{tr}R$이라 $\theta=\lVert r\rVert\in[0,\pi]$가 정해지고, $0\lt\theta\lt\pi$이면 $\sin\theta\ne0$이라 $[\hat\omega]=(R-R^T)/(2\sin\theta)$로 축도 정해집니다. $\theta=0$이면 $r=0$뿐. 그러므로 $\lVert r\rVert\lt\pi$인 두 점이 같은 회전이면 같은 점입니다.
**겉면.** $\theta=\pi$이면 로드리게스 공식에서 $\sin\pi=0$이라 $e^{[\hat\omega]\pi}=I+2[\hat\omega]^2=2\hat\omega\hat\omega^T-I$ — $\hat\omega$의 부호와 무관합니다. 거꾸로 $2\hat\omega\hat\omega^T-I=2\hat u\hat u^T-I$이면 $\hat\omega\hat\omega^T=\hat u\hat u^T$라 $\hat u=\pm\hat\omega$. 따라서 겉면에서는 정확히 $r$과 $-r$이 겹칩니다.`,
    note: R`그래서 $SO(3)$는 위상적으로 3차원 사영 공간 $\mathbb{RP}^3$이고, 2단원에서 말한 “한 바퀴 고리는 줄어들지 않지만 두 바퀴 고리는 줄어든다”가 이 그림에서 보입니다.` },
  );
})();
