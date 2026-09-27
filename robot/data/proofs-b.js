/* 유도 — Part B·C: 08 나사 운동과 렌치 … 14 궤적 생성 */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 08
  { ch: 'ch08', id: 'screwExpG', title: '나사 운동의 행렬 지수와 G(θ)', keys: ['나사 운동의 행렬 지수'],
    tags: 'matrix exponential screw motion G theta series SE(3) 행렬 지수 나사 운동',
    stmt: R`$\lVert\omega\rVert=1$이면 $e^{[\mathcal S]\theta}=\begin{bmatrix}e^{[\omega]\theta}&G(\theta)v\\0&1\end{bmatrix}$, $G(\theta)=I\theta+(1-\cos\theta)[\omega]+(\theta-\sin\theta)[\omega]^2$이다.`,
    body: R`
$[\mathcal S]=\begin{bmatrix}[\omega]&v\\0&0\end{bmatrix}$의 거듭제곱은 $[\mathcal S]^n=\begin{bmatrix}[\omega]^n&[\omega]^{n-1}v\\0&0\end{bmatrix}$ ($n\ge1$).
급수의 왼쪽 위 블록은 $e^{[\omega]\theta}$, 오른쪽 위는 $\Big(I\theta+\dfrac{\theta^2}{2!}[\omega]+\dfrac{\theta^3}{3!}[\omega]^2+\cdots\Big)v$.
$[\omega]^3=-[\omega]$로 묶으면 $[\omega]$의 계수 $\dfrac{\theta^2}{2!}-\dfrac{\theta^4}{4!}+\cdots=1-\cos\theta$, $[\omega]^2$의 계수 $\dfrac{\theta^3}{3!}-\dfrac{\theta^5}{5!}+\cdots=\theta-\sin\theta$.
순수 병진($\omega=0$)이면 $[\mathcal S]^2=0$이라 $e^{[\mathcal S]\theta}=I+[\mathcal S]\theta$.`,
    note: R`$G(\theta)=\int_0^\theta e^{[\omega]t}dt$이기도 합니다: 매 순간 회전된 방향으로 $v$만큼 밀린 것을 모두 더한 것.` },
  { ch: 'ch08', id: 'ginverse', title: 'G(θ)의 역행렬 공식', keys: ['행렬 로그 (T에서 나사 운동으로)'],
    tags: 'SE(3) logarithm G inverse cot half angle 행렬 로그 역행렬',
    stmt: R`$0<\theta<2\pi$에서 $G^{-1}(\theta)=\frac1\theta I-\frac12[\omega]+\Big(\frac1\theta-\frac12\cot\frac\theta2\Big)[\omega]^2$이다.`,
    body: R`
$W=[\omega]$, $W^3=-W$, $W^4=-W^2$. $H=aI+bW+cW^2$ ($a=1/\theta$, $b=-\tfrac12$, $c=1/\theta-\tfrac12\cot\tfrac\theta2$)로 $GH$를 전개합니다.
$I$: $\theta a=1$.
$W$: $\theta b+(1-\cos\theta)a-(1-\cos\theta)c-(\theta-\sin\theta)b=b\sin\theta+(1-\cos\theta)\tfrac12\cot\tfrac\theta2$. $(1-\cos\theta)\cot\tfrac\theta2=2\sin^2\tfrac\theta2\cdot\dfrac{\cos\frac\theta2}{\sin\frac\theta2}=\sin\theta$ → $-\tfrac12\sin\theta+\tfrac12\sin\theta=0$.
$W^2$: $\theta c+(1-\cos\theta)b+(\theta-\sin\theta)a-(\theta-\sin\theta)c=c\sin\theta-\tfrac12(1-\cos\theta)+1-\tfrac{\sin\theta}\theta$. $c\sin\theta=\tfrac{\sin\theta}\theta-\cos^2\tfrac\theta2$ → 합 $-\cos^2\tfrac\theta2+\tfrac12+\tfrac12\cos\theta=0$.
따라서 $GH=I$.`,
    note: R`$\theta\to0$이면 $G\approx\theta I$라 $G^{-1}\approx I/\theta$; 공식의 $[\omega]^2$ 계수는 $\theta/12$ 정도로 작아집니다. $R=I$인 경우는 순수 병진으로 따로 처리합니다.` },
  { ch: 'ch08', id: 'wrenchPower', title: '렌치의 변환은 동력 불변에서 나온다', keys: ['렌치와 좌표 변환'],
    tags: 'wrench transformation power invariance adjoint transpose 렌치 변환 동력',
    stmt: R`$\mathcal V_a=[\mathrm{Ad}_{T_{ab}}]\mathcal V_b$이고 $\mathcal V_a^T\mathcal F_a=\mathcal V_b^T\mathcal F_b$이면 $\mathcal F_b=[\mathrm{Ad}_{T_{ab}}]^T\mathcal F_a$이다.`,
    body: R`
$\mathcal V_b^T\mathcal F_b=\mathcal V_a^T\mathcal F_a=\mathcal V_b^T[\mathrm{Ad}_{T_{ab}}]^T\mathcal F_a$가 모든 $\mathcal V_b$에 대해 성립 → $\mathcal F_b=[\mathrm{Ad}_{T_{ab}}]^T\mathcal F_a$.
성분: $m_b=R^T(m_a-p\times f_a)$, $f_b=R^Tf_a$ ($T_{ab}=(R,p)$). 모멘트 기준점을 $p$로 옮기고 좌표축을 {b}로 돌린 것입니다.`,
    note: R`동력이 좌표계에 무관한 것은 물리적 사실(에너지)이고, 그 사실이 렌치의 변환 규칙을 정합니다. 트위스트가 $\mathrm{Ad}$로, 렌치가 $\mathrm{Ad}^T$로 변하는 “쌍대” 관계입니다.` },
  // ───── 09
  { ch: 'ch09', id: 'poeInduction', title: '지수곱 공식: n개 관절', keys: ['지수곱 공식 (공간 형태)'],
    tags: 'product of exponentials forward kinematics induction space form 지수곱 정기구학',
    stmt: R`$n$관절 직렬 팔의 끝점 자세는 $T(\theta)=e^{[\mathcal S_1]\theta_1}\cdots e^{[\mathcal S_n]\theta_n}M$이다($\mathcal S_i$는 영 자세의 나사 축을 {s}로 쓴 것).`,
    body: R`
$k=n,n-1,\dots,1$ 순서로 관절 $k$를 $\theta_k$만큼 움직인다고 봅니다. 관절 $k$를 움직일 때 관절 $1,\dots,k-1$은 아직 영 자세 그대로이므로 관절 $k$의 축도 영 자세의 $\mathcal S_k$입니다(앞 관절이 축을 옮기지 않았으므로). 관절 $k$ 바깥 부분 전체 — 이미 움직인 관절 $k+1,\dots,n$과 끝점 포함 — 가 강체처럼 $e^{[\mathcal S_k]\theta_k}$만큼 움직입니다.
귀납: 관절 $k+1..n$을 움직인 뒤 끝점이 $T_{k+1}=e^{[\mathcal S_{k+1}]\theta_{k+1}}\cdots e^{[\mathcal S_n]\theta_n}M$이면, 관절 $k$ 뒤 끝점은 $e^{[\mathcal S_k]\theta_k}T_{k+1}$.
$k=1$까지 가면 공식. 최종 자세는 관절각에만 의존하고 움직인 순서와 무관하므로 이것이 $T(\theta)$입니다.`,
    note: R`반대로 바닥 관절부터 움직이면 뒤쪽 관절의 축이 이미 옮겨져 있어, 각 단계에서 축을 다시 계산해야 합니다 — 결과는 같지만 훨씬 번거롭습니다.` },
  { ch: 'ch09', id: 'poeBodyForm', title: '물체 형태의 지수곱 공식', keys: ['지수곱 공식 (물체 형태)'],
    tags: 'body form product of exponentials adjoint similarity matrix exponential 물체 형태 지수곱',
    stmt: R`$\mathcal B_i=[\mathrm{Ad}_{M^{-1}}]\mathcal S_i$로 두면 $T(\theta)=Me^{[\mathcal B_1]\theta_1}\cdots e^{[\mathcal B_n]\theta_n}$이다.`,
    body: R`
행렬 지수와 닮음 변환: $e^{P^{-1}AP}=P^{-1}e^AP$ (급수의 각 항 $(P^{-1}AP)^k=P^{-1}A^kP$).
그래서 $e^{[\mathcal S]\theta}M=M\,M^{-1}e^{[\mathcal S]\theta}M=Me^{M^{-1}[\mathcal S]M\theta}$이고, $M^{-1}[\mathcal S]M=[\mathrm{Ad}_{M^{-1}}\mathcal S]$.
$T=e^{[\mathcal S_1]\theta_1}\cdots e^{[\mathcal S_n]\theta_n}M$에서 $M$을 오른쪽 끝부터 한 칸씩 왼쪽으로 옮길 때마다 지나친 지수의 나사가 $\mathcal B_i$로 바뀝니다: $\cdots e^{[\mathcal S_n]\theta_n}M=\cdots Me^{[\mathcal B_n]\theta_n}$, 다음 $e^{[\mathcal S_{n-1}]\theta_{n-1}}M=Me^{[\mathcal B_{n-1}]\theta_{n-1}}$, … .`,
    note: R`$\mathcal B_i$는 영 자세에서 관절 $i$의 축을 끝점 좌표계 {b}로 쓴 것 — 손끝에 붙은 카메라에서 본 관절 축입니다.` },
  // ───── 10
  { ch: 'ch10', id: 'jac2RDet', title: '2R 팔의 야코비안과 행렬식', keys: ['평면 2R 팔의 야코비안'],
    tags: '2R planar Jacobian determinant singularity sine 2R 야코비안 행렬식',
    stmt: R`평면 2R 팔의 야코비안은 $\begin{bmatrix}-L_1s_1-L_2s_{12}&-L_2s_{12}\\L_1c_1+L_2c_{12}&L_2c_{12}\end{bmatrix}$이고 $\det J=L_1L_2\sin\theta_2$이다.`,
    body: R`
$x=L_1c_1+L_2c_{12}$를 시간으로 미분: $\dot x=-L_1s_1\dot\theta_1-L_2s_{12}(\dot\theta_1+\dot\theta_2)$. 같은 방법으로 $\dot y$. 계수를 모으면 $J$.
$\det J=(-L_1s_1-L_2s_{12})L_2c_{12}+L_2s_{12}(L_1c_1+L_2c_{12})=L_1L_2(s_{12}c_1-s_1c_{12})=L_1L_2\sin(\theta_1+\theta_2-\theta_1)=L_1L_2\sin\theta_2$.`,
    note: R`행렬식이 $\theta_1$에 무관한 것은 팔 전체를 돌려도(바닥 관절) 특이성이 변하지 않기 때문입니다.` },
  { ch: 'ch10', id: 'spaceJacCols', title: '공간 야코비안의 열 공식', keys: ['공간 야코비안'],
    tags: 'space Jacobian columns adjoint product of exponentials derivative 공간 야코비안 열',
    stmt: R`$T=e^{[\mathcal S_1]\theta_1}\cdots e^{[\mathcal S_n]\theta_n}M$이면 $\dot TT^{-1}=\sum_i[J_{si}]\dot\theta_i$, $J_{si}=[\mathrm{Ad}_{e^{[\mathcal S_1]\theta_1}\cdots e^{[\mathcal S_{i-1}]\theta_{i-1}}}]\mathcal S_i$이다.`,
    body: R`
$E_i=e^{[\mathcal S_i]\theta_i}$, $\dot E_i=[\mathcal S_i]E_i\dot\theta_i$. 곱의 미분에서 $i$번째 항은 $E_1\cdots E_{i-1}[\mathcal S_i]E_i\cdots E_nM\dot\theta_i$.
오른쪽에 $T^{-1}=M^{-1}E_n^{-1}\cdots E_1^{-1}$을 곱하면 $E_i\cdots E_nM$이 상쇄되어 $(E_1\cdots E_{i-1})[\mathcal S_i](E_1\cdots E_{i-1})^{-1}\dot\theta_i$.
$P[\mathcal S]P^{-1}=[\mathrm{Ad}_P\mathcal S]$이므로 결과.`,
    note: R`$E_1\cdots E_{i-1}$은 앞 관절들의 운동이므로, $J_{si}$는 “앞 관절들이 옮겨 놓은 관절 $i$의 축”입니다. 뒤쪽 관절각은 들어가지 않습니다.` },
  { ch: 'ch10', id: 'bodyJacRel', title: '물체 야코비안과 두 야코비안의 관계', keys: ['물체 야코비안'],
    tags: 'body Jacobian relation adjoint space Jacobian 물체 야코비안 관계',
    stmt: R`$T=Me^{[\mathcal B_1]\theta_1}\cdots e^{[\mathcal B_n]\theta_n}$이면 $J_{bi}=[\mathrm{Ad}_{e^{-[\mathcal B_n]\theta_n}\cdots e^{-[\mathcal B_{i+1}]\theta_{i+1}}}]\mathcal B_i$이고, $J_s=[\mathrm{Ad}_{T_{sb}}]J_b$이다.`,
    body: R`
$T^{-1}\dot T$의 $i$번째 항: $(E_{i+1}\cdots E_n)^{-1}[\mathcal B_i](E_{i+1}\cdots E_n)\dot\theta_i$ ($E_j=e^{[\mathcal B_j]\theta_j}$; 앞쪽 $ME_1\cdots E_{i-1}$은 $T^{-1}$과 상쇄). $(E_{i+1}\cdots E_n)^{-1}=e^{-[\mathcal B_n]\theta_n}\cdots e^{-[\mathcal B_{i+1}]\theta_{i+1}}$이므로 결과.
관계: $\mathcal V_s=[\mathrm{Ad}_{T_{sb}}]\mathcal V_b$가 모든 $\dot\theta$에 대해 성립 → $J_s\dot\theta=[\mathrm{Ad}_{T_{sb}}]J_b\dot\theta$ → $J_s=[\mathrm{Ad}_{T_{sb}}]J_b$.`,
    note: R`$[\mathrm{Ad}_T]$는 가역이라 $J_s$와 $J_b$의 계수가 같고, 특이점도 같습니다(11단원).` },
  // ───── 11
  { ch: 'ch11', id: 'staticsProof', title: '정역학 관계', keys: ['정역학 관계'],
    tags: 'statics Jacobian transpose torque wrench power virtual work 정역학 야코비안 전치',
    stmt: R`정적 평형에서 끝점이 환경에 렌치 $\mathcal F$를 가하려면 관절 토크 $\tau=J^T(\theta)\mathcal F$가 필요하다.`,
    body: R`
관절이 한 일률 $\tau^T\dot\theta$가 끝점이 환경에 한 일률 $\mathcal F^T\mathcal V$와 같습니다(정적이라 운동에너지 변화 없음, 중력은 따로 $g(\theta)$로 더함, 마찰 무시).
$\tau^T\dot\theta=\mathcal F^TJ\dot\theta=(J^T\mathcal F)^T\dot\theta$가 모든 $\dot\theta$에 대해 성립 → $\tau=J^T\mathcal F$.
같은 좌표계끼리 짝지어야 합니다: $\tau=J_s^T\mathcal F_s=J_b^T\mathcal F_b$. 두 식은 $J_s=[\mathrm{Ad}]J_b$, $\mathcal F_b=[\mathrm{Ad}]^T\mathcal F_s$로 일치합니다.`,
    note: R`가상 일의 원리로도 같은 결과가 나옵니다: 가상 변위 $\delta\theta$에 대해 $\tau^T\delta\theta=\mathcal F^TJ\delta\theta$.` },
  { ch: 'ch11', id: 'singInvariant', title: '특이점은 좌표계 선택과 무관하다', keys: ['기구학적 특이점'],
    tags: 'kinematic singularity rank invariance frame choice 특이점 계수 불변',
    stmt: R`고정 좌표계나 끝점 좌표계를 다르게 잡아도 $J$의 계수는 변하지 않는다.`,
    body: R`
{s}를 {s′}로 바꾸면($T_{s's}$ 고정) 공간 트위스트가 $\mathcal V_{s'}=[\mathrm{Ad}_{T_{s's}}]\mathcal V_s$로 바뀌므로 $J_{s'}=[\mathrm{Ad}_{T_{s's}}]J_s$. 수반 행렬은 가역($[\mathrm{Ad}_T]^{-1}=[\mathrm{Ad}_{T^{-1}}]$)이라 계수가 같습니다.
{b}를 {b′}로 바꿔도 같은 이유로 $J_{b'}=[\mathrm{Ad}_{T_{b'b}}]J_b$. 그리고 $J_s=[\mathrm{Ad}_{T_{sb}}]J_b$.
따라서 “계수가 떨어진다”는 성질은 팔과 관절각만의 성질입니다.`,
    note: R`해석적 야코비안(오일러 각 등)은 좌표의 특이점까지 섞여 있어 이 불변성이 없습니다. 짐벌 잠김이 팔의 특이점인지 좌표의 특이점인지 구분해야 합니다.` },
  { ch: 'ch11', id: 'manipSVD', title: '조작성 타원체: 특잇값 분해로 보기', keys: ['조작성 타원체와 지표'],
    tags: 'manipulability ellipsoid SVD singular values JJ^T force ellipsoid 조작성 타원체 특잇값',
    stmt: R`$J$($m\times n$, 계수 $m$)에 대해 $\{J\dot\theta:\lVert\dot\theta\rVert\le1\}=\{\mathcal V:\mathcal V^T(JJ^T)^{-1}\mathcal V\le1\}$이고, 반축은 $JJ^T$의 고유벡터 방향으로 $\sqrt{\lambda_i}$(= $J$의 특잇값)이다.`,
    body: R`
특잇값 분해 $J=U\Sigma V^T$ ($U$, $V$ 직교, $\Sigma=[\mathrm{diag}(\sigma_i)\ 0]$, $\sigma_i>0$). $z=V^T\dot\theta$도 단위 공 전체를 돕니다($V$가 직교).
$\mathcal V=U\Sigma z$, $w=U^T\mathcal V=\Sigma z$ → $w_i=\sigma_iz_i$ ($i\le m$). $\lVert z\rVert\le1$을 만족하는 $z$로 만들 수 있는 $w$는 정확히 $\sum(w_i/\sigma_i)^2\le1$ — 반축 $\sigma_i$인 타원체(남는 $z$ 성분은 0으로 두면 됨).
$JJ^T=U\Sigma\Sigma^TU^T=U\,\mathrm{diag}(\sigma_i^2)U^T$ → 고윳값 $\lambda_i=\sigma_i^2$, 고유벡터는 $U$의 열. $\sum w_i^2/\sigma_i^2=\mathcal V^TU\mathrm{diag}(\sigma_i^{-2})U^T\mathcal V=\mathcal V^T(JJ^T)^{-1}\mathcal V$.
힘: $\tau=J^Tf$, $\lVert\tau\rVert\le1$인 $f$는 $f^TJJ^Tf\le1$ — 같은 축, 반축 $1/\sigma_i$.`,
    note: R`$\mu_3=\sqrt{\det JJ^T}=\prod\sigma_i$는 타원체 부피에 비례하고, 정사각 $J$면 $\lvert\det J\rvert$입니다.` },
  // ───── 12
  { ch: 'ch12', id: 'ik2RProof', title: '2R 팔 역기구학 공식', keys: ['평면 2R 팔의 역기구학'],
    tags: 'inverse kinematics 2R law of cosines atan2 elbow up down 역기구학 코사인 법칙',
    stmt: R`$\cos\theta_2=\dfrac{x^2+y^2-L_1^2-L_2^2}{2L_1L_2}$, $\theta_1=\operatorname{atan2}(y,x)-\operatorname{atan2}(L_2s_2,L_1+L_2c_2)$.`,
    body: R`
거리: $x^2+y^2=L_1^2+L_2^2+2L_1L_2c_2$ (끝점 식을 제곱해 더하고 $c_1c_{12}+s_1s_{12}=c_2$).
$\theta_1$: 합의 공식으로 $x=k_1c_1-k_2s_1$, $y=k_1s_1+k_2c_1$ ($k_1=L_1+L_2c_2$, $k_2=L_2s_2$). $k_1=\rho\cos\gamma$, $k_2=\rho\sin\gamma$로 쓰면 $x=\rho\cos(\theta_1+\gamma)$, $y=\rho\sin(\theta_1+\gamma)$ → $\theta_1+\gamma=\operatorname{atan2}(y,x)$, $\gamma=\operatorname{atan2}(k_2,k_1)$.
$s_2=\pm\sqrt{1-c_2^2}$의 부호마다 해 하나.`,
    note: R`$\rho=\sqrt{k_1^2+k_2^2}=\sqrt{x^2+y^2}$라 $\rho>0$(끝점이 원점이 아님)이면 atan2가 잘 정의됩니다. $L_1=L_2$이고 목표가 원점이면 $\theta_1$은 아무 값이나 되는 특이한 경우입니다.` },
  { ch: 'ch12', id: 'newtonStep', title: '뉴턴-랩슨 반복과 2차 수렴', keys: ['뉴턴-랩슨 역기구학'],
    tags: 'Newton Raphson inverse kinematics linearization quadratic convergence 뉴턴 랩슨 수렴',
    stmt: R`$f(\theta)=x_d$를 $\theta^{k+1}=\theta^k+J^{-1}(\theta^k)(x_d-f(\theta^k))$로 풀면, 해 $\theta^*$ 근처에서 $J(\theta^*)$가 가역이고 $f$가 매끄러울 때 오차가 $\lVert\theta^{k+1}-\theta^*\rVert\le C\lVert\theta^k-\theta^*\rVert^2$로 줄어든다.`,
    body: R`
유도: $f(\theta^k+\Delta)\approx f(\theta^k)+J(\theta^k)\Delta=x_d$ → $\Delta=J^{-1}(x_d-f(\theta^k))$.
수렴(1차원으로 보이면): $e_k=\theta^k-\theta^*$. 테일러: $0=f(\theta^*)-x_d=f(\theta^k)-x_d-f'(\theta^k)e_k+\tfrac12f''(\xi)e_k^2$.
$\theta^{k+1}=\theta^k-\dfrac{f(\theta^k)-x_d}{f'(\theta^k)}$에 넣으면 $e_{k+1}=e_k-\dfrac{f'(\theta^k)e_k-\frac12f''(\xi)e_k^2}{f'(\theta^k)}=\dfrac{f''(\xi)}{2f'(\theta^k)}e_k^2$.
$f'(\theta^*)\ne0$이면 근처에서 $\lvert f''/(2f')\rvert\le C$ → 2차 수렴. 여러 변수에서도 같은 계산이 행렬로 성립합니다.`,
    note: R`$f'$(야코비안)이 0에 가까우면(특이점) $C$가 커져 수렴이 무너집니다. 관절이 남으면 $J^{-1}$ 대신 $J^\dagger$를 씁니다.` },
  { ch: 'ch12', id: 'pinvMinNorm', title: '의사역행렬은 최소 노름 해를 준다', keys: ['의사역행렬'],
    tags: 'pseudoinverse minimum norm least squares redundancy null space 의사역행렬 최소 노름 최소 제곱',
    stmt: R`$J$($m\times n$, $n>m$, 계수 $m$)에서 $J^\dagger=J^T(JJ^T)^{-1}$이면 $\dot\theta^*=J^\dagger\mathcal V$는 $J\dot\theta=\mathcal V$의 해 중 노름이 가장 작다. $n<m$(계수 $n$)이면 $(J^TJ)^{-1}J^T\mathcal V$가 $\lVert J\dot\theta-\mathcal V\rVert$를 최소로 한다.`,
    body: R`
해인지: $J\dot\theta^*=JJ^T(JJ^T)^{-1}\mathcal V=\mathcal V$.
최소: 다른 해는 $\dot\theta=\dot\theta^*+n$, $Jn=0$. $\dot\theta^*=J^Ty$ 꼴이므로 $n\cdot\dot\theta^*=n^TJ^Ty=(Jn)^Ty=0$. 피타고라스로 $\lVert\dot\theta\rVert^2=\lVert\dot\theta^*\rVert^2+\lVert n\rVert^2\ge\lVert\dot\theta^*\rVert^2$.
최소 제곱: $\lVert J\dot\theta-\mathcal V\rVert^2$의 기울기 $2J^T(J\dot\theta-\mathcal V)=0$ → 정규 방정식 $J^TJ\dot\theta=J^T\mathcal V$, $J^TJ$ 가역.`,
    note: R`영공간 투영 $(I-J^\dagger J)w$를 더해도 끝점 속도가 변하지 않는 것도 $J(I-J^\dagger J)=J-J=0$으로 바로 보입니다.` },
  // ───── 13
  { ch: 'ch13', id: 'genForceTorque', title: '관절 토크가 일반화 힘인 이유', keys: ['로봇의 라그랑주 방정식'],
    tags: 'generalized force joint torque Lagrange virtual work constraint forces 일반화 힘 관절 토크',
    stmt: R`관절각을 일반화 좌표로 쓰면 관절 $i$의 모터 토크(병진 관절은 힘) $\tau_i$가 그 좌표의 일반화 힘이고, $\tau_i=\frac{d}{dt}\frac{\partial\mathcal L}{\partial\dot\theta_i}-\frac{\partial\mathcal L}{\partial\theta_i}$이다.`,
    body: R`
일반화 힘은 가상 변위 $\delta\theta$에 대해 비보존력이 한 가상 일 $\delta W=\sum Q_i\delta\theta_i$의 계수입니다.
모터 토크 $\tau_i$는 관절 $i$의 두 링크 사이에 작용하는 우력이고, 관절각이 $\delta\theta_i$ 변하면 일 $\tau_i\delta\theta_i$를 합니다(작용-반작용 우력의 일은 상대 회전각에만 의존). 따라서 $Q_i=\tau_i$.
관절 반력(링크끼리 미는 힘)은 관절이 허용하는 운동에 수직이라 가상 일이 0 — 식에 나타나지 않습니다. 중력은 보존력이라 $\mathcal P$로 들어갑니다.
동역학의 오일러-라그랑주 방정식 $\frac{d}{dt}\frac{\partial\mathcal L}{\partial\dot q}-\frac{\partial\mathcal L}{\partial q}=Q$에 넣으면 결과.`,
    note: R`관절 마찰 같은 비보존력은 $Q_i=\tau_i-\tau_{\text{마찰},i}$처럼 일반화 힘에 더합니다.` },
  { ch: 'ch13', id: 'christoffel', title: '표준형과 크리스토펠 기호, 그리고 Ṁ − 2C의 반대칭', keys: ['동역학의 표준형'],
    tags: 'Christoffel symbols Coriolis centripetal mass matrix skew symmetric standard form 크리스토펠 코리올리 원심',
    stmt: R`$\mathcal K=\tfrac12\dot\theta^TM(\theta)\dot\theta$, $\mathcal P(\theta)$이면 $\tau=M\ddot\theta+c+g$, $c_i=\sum_{j,k}\Gamma_{ijk}\dot\theta_j\dot\theta_k$, $g_i=\partial\mathcal P/\partial\theta_i$이다. $C_{ij}=\sum_k\Gamma_{ijk}\dot\theta_k$로 두면 $\dot M-2C$는 반대칭이다.`,
    body: R`
$\dfrac{\partial\mathcal K}{\partial\dot\theta_i}=\sum_jm_{ij}\dot\theta_j$ → $\dfrac{d}{dt}(\cdot)=\sum_jm_{ij}\ddot\theta_j+\sum_{j,k}\dfrac{\partial m_{ij}}{\partial\theta_k}\dot\theta_j\dot\theta_k$.
$\dfrac{\partial\mathcal K}{\partial\theta_i}=\tfrac12\sum_{j,k}\dfrac{\partial m_{jk}}{\partial\theta_i}\dot\theta_j\dot\theta_k$.
빼고, 첫 합을 $j,k$에 대칭화하면 $\sum_{j,k}\tfrac12\big(\partial_km_{ij}+\partial_jm_{ik}-\partial_im_{jk}\big)\dot\theta_j\dot\theta_k=c_i$. 여기에 $g_i$를 더하면 표준형.
반대칭: $(\dot M)_{ij}=\sum_k\partial_km_{ij}\dot\theta_k$, $2C_{ij}=\sum_k(\partial_km_{ij}+\partial_jm_{ik}-\partial_im_{jk})\dot\theta_k$.
$(\dot M-2C)_{ij}=\sum_k(\partial_im_{jk}-\partial_jm_{ik})\dot\theta_k$ — $i,j$를 바꾸면 부호가 바뀝니다.`,
    note: R`반대칭성은 $\dot\theta^T(\dot M-2C)\dot\theta=0$, 곧 “속도 항이 에너지를 만들지 않는다”는 뜻이고, 로봇 제어의 안정성 증명에 자주 쓰입니다.` },
  { ch: 'ch13', id: 'massPD', title: '질량 행렬과 끝점의 겉보기 질량', keys: ['질량 행렬의 성질'],
    tags: 'mass matrix positive definite apparent inertia task space 질량 행렬 겉보기 질량',
    stmt: R`$M(\theta)$는 대칭 양의 정부호이다. $J$가 가역이면 끝점 속도 $\mathcal V$로 쓴 운동에너지는 $\tfrac12\mathcal V^T\Lambda\mathcal V$, $\Lambda=J^{-T}MJ^{-1}$이다.`,
    body: R`
대칭: 이차 형식 $\tfrac12\dot\theta^TM\dot\theta$에서 $M$을 $(M+M^T)/2$로 바꿔도 같으므로 대칭으로 잡습니다(라그랑주 계산에서 자연히 대칭).
양의 정부호: 각 링크의 운동에너지 $\tfrac12m\lVert v\rVert^2+\tfrac12\omega^T\mathcal I\omega\ge0$이고, $\dot\theta\ne0$이면 움직이는 링크가 있어 합이 양수(관절이 독립이므로).
끝점: $\dot\theta=J^{-1}\mathcal V$를 넣으면 $\tfrac12\mathcal V^TJ^{-T}MJ^{-1}\mathcal V$.`,
    note: R`$\Lambda$는 끝점을 방향 $u$로 밀 때 느끼는 관성이 방향마다 다르다는 것을 보여 줍니다. 조작성 타원체(11단원)와 비슷하게 관성 타원체를 그릴 수 있습니다.` },
  // ───── 14
  { ch: 'ch14', id: 'trajChain', title: '궤적의 속도와 가속도', keys: ['궤적 = 경로 ∘ 시간 스케일링'],
    tags: 'trajectory path time scaling chain rule velocity acceleration 궤적 경로 시간 스케일링',
    stmt: R`$\theta(t)=\theta(s(t))$이면 $\dot\theta=\theta'(s)\dot s$, $\ddot\theta=\theta'(s)\ddot s+\theta''(s)\dot s^2$이다.`,
    body: R`
연쇄 법칙: $\dfrac{d\theta}{dt}=\dfrac{d\theta}{ds}\dfrac{ds}{dt}$.
한 번 더: $\dfrac{d}{dt}\big(\theta'(s)\dot s\big)=\dfrac{d\theta'}{dt}\dot s+\theta'\ddot s=\theta''(s)\dot s\cdot\dot s+\theta'(s)\ddot s$.`,
    note: R`직선 경로에서는 $\theta''=0$이라 $\ddot\theta=\theta'\ddot s$ — 가속도가 시간 스케일링에서만 옵니다.` },
  { ch: 'ch14', id: 'screwStraight', title: 'SE(3)에서의 “직선”은 물체 트위스트가 일정한 경로다', keys: ['직선 경로'],
    tags: 'straight line SE(3) constant twist screw path matrix log 직선 경로 일정한 트위스트',
    stmt: R`$X(s)=X_{\text{start}}\exp\big(\log(X_{\text{start}}^{-1}X_{\text{end}})s\big)$는 $X(0)=X_{\text{start}}$, $X(1)=X_{\text{end}}$이고, $X^{-1}dX/ds$가 상수이다.`,
    body: R`
$[\mathcal V]=\log(X_{\text{start}}^{-1}X_{\text{end}})$로 두면 $X(s)=X_{\text{start}}e^{[\mathcal V]s}$. $s=0$: $X_{\text{start}}$. $s=1$: $X_{\text{start}}X_{\text{start}}^{-1}X_{\text{end}}$.
$\dfrac{dX}{ds}=X_{\text{start}}e^{[\mathcal V]s}[\mathcal V]=X[\mathcal V]$ → $X^{-1}\dfrac{dX}{ds}=[\mathcal V]$ — 일정한 물체 트위스트. 한 나사 축을 따라 일정한 비율로 도는 운동입니다.`,
    note: R`물체 좌표계 원점의 경로는 나선일 수 있어 공간에서 곧은 선이 아닙니다. 원점을 곧게 보내려면 위치와 회전을 따로 보간합니다.` },
  { ch: 'ch14', id: 'quinticDerive', title: '5차 다항식 시간 스케일링', keys: ['3차·5차 다항식 시간 스케일링'],
    tags: 'quintic polynomial time scaling boundary conditions maximum velocity acceleration 5차 다항식',
    stmt: R`$s(0)=0$, $s(1)=1$ (시간 $\tau=t/T$), 양 끝에서 $s'=s''=0$인 5차 다항식은 $s=10\tau^3-15\tau^4+6\tau^5$이고, 최대 $\dot s=\frac{15}{8T}$, 최대 $\lvert\ddot s\rvert=\frac{10}{\sqrt3T^2}$이다.`,
    body: R`
$\tau=0$ 조건 셋이 $a_0=a_1=a_2=0$을 줍니다. $s=a_3\tau^3+a_4\tau^4+a_5\tau^5$에 $\tau=1$ 조건 셋:
$a_3+a_4+a_5=1$, $3a_3+4a_4+5a_5=0$, $6a_3+12a_4+20a_5=0$ → $a_3=10$, $a_4=-15$, $a_5=6$.
$s'=30\tau^2-60\tau^3+30\tau^4=30\tau^2(1-\tau)^2$, 최대는 $\tau=\tfrac12$: $30/16=15/8$ → $\dot s_{\max}=\frac{15}{8T}$.
$s''=60\tau-180\tau^2+120\tau^3$, $s'''=60-360\tau+360\tau^2=0$ → $\tau=\tfrac12\mp\tfrac{\sqrt3}6$. 그곳에서 $\lvert s''\rvert=\tfrac{10}{\sqrt3}$ → $\ddot s_{\max}=\frac{10}{\sqrt3T^2}$.`,
    note: R`3차는 같은 방법으로 $3\tau^2-2\tau^3$, 최대 속도 $\frac3{2T}$(14단원 연습 문제). 5차는 부드러운 대신 최대 속도가 25% 큽니다.` },
  { ch: 'ch14', id: 'trapTime', title: '사다리꼴 프로파일의 총 시간', keys: ['사다리꼴 속도 프로파일'],
    tags: 'trapezoidal velocity profile total time acceleration cruise 사다리꼴 속도',
    stmt: R`$s$를 0에서 1까지 가속도 $a$, 최대 속도 $v$의 사다리꼴로 움직이면 $v^2/a\le1$일 때 $T=\dfrac{a+v^2}{va}$이다.`,
    body: R`
가속 시간 $t_a=v/a$, 그 동안 거리 $\tfrac12at_a^2=\dfrac{v^2}{2a}$. 감속도 같음.
등속 구간의 거리 $1-\dfrac{v^2}a$ (0 이상이어야 하므로 $v^2/a\le1$), 시간 $\dfrac{1-v^2/a}v$.
$T=2\dfrac va+\dfrac1v-\dfrac va=\dfrac va+\dfrac1v=\dfrac{v^2+a}{va}$.`,
    note: R`$v^2/a>1$이면 $v$에 닿기 전에 감속해야 해 삼각형 프로파일이 됩니다: 중간 속도 $\sqrt a$, $T=2/\sqrt a$.` },
  { ch: 'ch14', id: 'viaCoeffs', title: '경유점 3차 다항식의 계수', keys: ['경유점 사이의 3차 다항식'],
    tags: 'via points cubic polynomial coefficients position velocity continuity 경유점 3차 다항식',
    stmt: R`구간 시작에서 위치 $\beta_j$, 속도 $\dot\beta_j$, 끝($\Delta T$ 뒤)에서 $\beta_{j+1}$, $\dot\beta_{j+1}$을 맞추는 3차식의 계수는 본문의 $a_0,\dots,a_3$이다.`,
    body: R`
$\beta(\Delta t)=a_0+a_1\Delta t+a_2\Delta t^2+a_3\Delta t^3$. 시작 조건: $a_0=\beta_j$, $a_1=\dot\beta_j$.
끝 조건: $a_2\Delta T^2+a_3\Delta T^3=\beta_{j+1}-\beta_j-\dot\beta_j\Delta T\equiv P$, $2a_2\Delta T+3a_3\Delta T^2=\dot\beta_{j+1}-\dot\beta_j\equiv V$.
풀면 $a_3=\dfrac{V\Delta T-2P}{\Delta T^3}$, $a_2=\dfrac{3P-V\Delta T}{\Delta T^2}$.
대입: $a_2=\dfrac{3\beta_{j+1}-3\beta_j-2\dot\beta_j\Delta T-\dot\beta_{j+1}\Delta T}{\Delta T^2}$, $a_3=\dfrac{2\beta_j+(\dot\beta_j+\dot\beta_{j+1})\Delta T-2\beta_{j+1}}{\Delta T^3}$.`,
    note: R`이웃 구간과 위치·속도는 이어지지만 가속도는 끊길 수 있습니다. 가속도까지 잇고 싶으면 5차 구간이나 스플라인을 씁니다.` },
  );
})();
