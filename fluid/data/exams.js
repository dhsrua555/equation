/* 실전 모의고사 — 연습문제와 겹치지 않는 별도 문항. 75분, 10문제로 구성했습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x1', roman: 'I', kind: '중간고사 범위', title: '정수역학, 검사 체적, 미분 해석', scopeText: '01–09 단원 · White 1–4장',
    desc: '유체의 성질, 정수압과 마노미터, 잠긴 면의 힘, 부력과 안정성, 강체 운동, 질량·운동량·에너지의 검사 체적 해석, 미분 방정식과 정확해. 75분 10문제입니다.',
    minutes: 75, plot: 'flBernoulli',
    problems: [
      { ch: 'ch01', type: 'num', lv: 1, pts: 8, q: R`넓이 0.5 m² 판을 두께 1 mm 기름막($\mu=0.3$ Pa·s) 위에서 2 m/s로 끈다. 필요한 힘(N)은?`, ans: '0.3*0.5*2/0.001', ansTex: R`300\ \text{N}`,
        sol: R`선형 분포 $\tau=\mu V/h=600$ Pa, $F=\tau A=300$ N.` },
      { ch: 'ch02', type: 'num', lv: 2, pts: 10, q: R`같은 높이의 두 물관 A, B를 수은 U자관으로 잇자 수은 면의 높이 차가 0.2 m(A 쪽이 낮음)였다. $p_A-p_B$ (kPa)는? ($\gamma_{\text{Hg}}=133\,100$, $\gamma_w=9790$ N/m³)`, ans: '(133100-9790)*0.2/1000', ansTex: R`24.7\ \text{kPa}`,
        sol: R`A에서 내려가 수은을 지나 B로: $p_A+\gamma_w(a+0.2)-\gamma_{\text{Hg}}(0.2)-\gamma_wa=p_B$ → $p_A-p_B=(\gamma_{\text{Hg}}-\gamma_w)(0.2)=24.7$ kPa. 관 속 물 기둥이 수은 기둥 일부를 상쇄하는 것을 빠뜨리지 않아야 합니다.` },
      { ch: 'ch03', type: 'num', lv: 2, pts: 10, q: R`폭 2 m, 높이 3 m 연직 직사각형 수문의 윗변이 수면 아래 1 m에 있다. 물이 수문에 가하는 합력(kN)은? ($\gamma=9790$)`, ans: '9790*2.5*6/1000', ansTex: R`146.9\ \text{kN}`,
        sol: R`$h_{cg}=2.5$ m, $F=\gamma h_{cg}A=9790(2.5)(6)=146.9$ kN. 압력 중심은 도심보다 $I_{xx}/(h_{cg}A)=4.5/15=0.3$ m 아래입니다.` },
      { ch: 'ch04', type: 'num', lv: 2, pts: 8, q: R`한 변 0.5 m인 정육면체 나무($SG=0.6$, 균질)가 물에 한 면을 아래로 하고 떠 있다. 메타센터 높이 $\overline{GM}$ (cm)은?`, ans: '(0.15+0.5^4/12/(0.25*0.3)-0.25)*100', ansTex: R`-3.06\ \text{cm}`,
        sol: R`흘수 0.3 m, $B$는 바닥에서 0.15 m, $G$는 0.25 m. $\overline{BM}=\dfrac{0.5\cdot0.5^3/12}{0.5\cdot0.5\cdot0.3}=0.0694$ m. $\overline{GM}=0.15+0.0694-0.25=-0.031$ m — 음수라 이 자세로는 불안정하고, 기울어진 자세로 뜹니다.` },
      { ch: 'ch05', type: 'num', lv: 1, pts: 8, q: R`기체가 지름 10 cm 관에서 밀도 5 kg/m³, 속도 20 m/s로 흐르다 지름 5 cm 관으로 들어가 밀도가 4 kg/m³이 되었다(정상). 속도(m/s)는?`, ans: '5*20*4/4', ansTex: R`100`,
        sol: R`$\rho_1A_1V_1=\rho_2A_2V_2$ → $V_2=\dfrac{5}{4}(2)^2(20)=100$ m/s.` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 10, q: R`지름 3 cm, 속도 20 m/s 수평 물줄기가 수레 위의 날개에 맞아 연직 위로 90° 꺾인다. 수레가 분류 방향으로 5 m/s로 움직일 때 수레를 붙잡는 수평력(N)은? ($\rho=998$)`, ans: '998*pi*0.015^2*15^2', ansTex: R`158.7\ \text{N}`,
        sol: R`수레와 함께 움직이는 검사 체적: 상대 속도 15 m/s, 닿는 질량 유량 $\rho A(V-U)=10.58$ kg/s. 나갈 때 수평 상대 속도 0 → $F_x=\rho A(V-U)^2(1-\cos90°)=158.7$ N.` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 10, q: R`펌프가 열린 저수조의 물 0.01 m³/s를 10 m 높은 곳의 노즐로 보내 15 m/s로 대기에 뿜는다. 관로 손실이 4 m일 때 유체가 받는 동력(kW)은? ($\gamma=9790$)`, ans: '9790*0.01*(10+15^2/19.62+4)/1000', ansTex: R`2.49\ \text{kW}`,
        sol: R`수면(1)과 노즐 출구(2): $h_p=z_2+\dfrac{V_2^2}{2g}+h_f=10+11.47+4=25.47$ m. $P=\gamma Qh_p=2.49$ kW.` },
      { ch: 'ch08', type: 'num', lv: 2, pts: 8, q: R`비압축성 2차원 흐름에서 $u=2xy$이고 $v(x,0)=0$이다. 점 (1, 1)에서 가속도의 $x$ 성분은?`, ans: '2', ansTex: R`2`,
        sol: R`연속: $\partial v/\partial y=-2y$ → $v=-y^2$. $a_x=u\,\partial u/\partial x+v\,\partial u/\partial y=2xy(2y)+(-y^2)(2x)=2xy^2=2$.` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 10, q: R`간격 4 mm인 두 정지 평판 사이로 기름($\mu=0.5$ Pa·s)이 $dp/dx=-50\,000$ Pa/m로 흐른다. 폭 1 m당 유량(L/s)은?`, ans: '2*0.002^3/(3*0.5)*50000*1000', ansTex: R`0.533`,
        sol: R`$h=2$ mm, $q=\dfrac{2h^3}{3\mu}\Big(-\dfrac{dp}{dx}\Big)=\dfrac{2(8\times10^{-9})}{1.5}(50\,000)=5.33\times10^{-4}$ m²/s.` },
      { ch: 'ch04', type: 'open', lv: 3, pts: 18, proof: true, q: R`반지름 $R$ 원통 용기에 물을 높이 $h_0$까지 채우고 각속도 $\Omega$로 강체처럼 돌린다(중심이 바닥에 닿지 않음). (1) 압력 분포와 수면 모양을 유도하고, (2) 바닥이 받는 전체 압력 힘(계기압)이 돌기 전과 같은 $\gamma\pi R^2h_0$임을 보이세요.`,
        sol: R`
(1) $\nabla p=\rho(\mathbf g-\mathbf a)$, $\mathbf a=-r\Omega^2\mathbf e_r$: $\partial p/\partial r=\rho r\Omega^2$, $\partial p/\partial z=-\rho g$ → $p=p_a+\tfrac12\rho\Omega^2r^2-\rho g(z-z_0)$ ($z_0$: 중심 수면). 수면 $p=p_a$: $z_s(r)=z_0+\dfrac{\Omega^2r^2}{2g}$.
부피 보존 $\int_0^Rz_s2\pi r\,dr=\pi R^2h_0$ → $z_0=h_0-\dfrac{\Omega^2R^2}{4g}$.
(2) 바닥($z=0$)의 계기압 $p-p_a=\tfrac12\rho\Omega^2r^2+\rho gz_0=\rho g\,z_s(r)$ — 그 위 수면까지의 물 깊이 그대로.
$F=\displaystyle\int_0^R\rho g\,z_s(r)\,2\pi r\,dr=\rho g\int_0^Rz_s2\pi r\,dr=\gamma\pi R^2h_0$.
연직 방향 가속도가 없고 옆벽이 연직이라 연직 힘을 주지 않으므로, 바닥이 물 전체의 무게를 받친다는 것과 같습니다.`,
        rubric: R`
- 압력 기울기와 적분 — 5점
- 수면과 부피 보존 — 5점
- 바닥 압력 = 깊이 × γ — 4점
- 적분과 물리적 해석 — 4점` },
    ],
  },
  {
    id: 'x2', roman: 'II', kind: '기말고사 범위', title: '차원 해석, 관 유동, 외부 유동', scopeText: '10–15 단원 · White 5–8장',
    desc: 'Π 정리와 상사, 층류·난류 관 유동과 무디 선도, 부차 손실과 관로, 경계층, 항력과 양력, 퍼텐셜 유동. 75분 10문제입니다.',
    minutes: 75, plot: 'flMoody',
    problems: [
      { ch: 'ch10', type: 'num', lv: 1, pts: 8, q: R`펌프 동력 $P$가 유량 $Q$, 회전 속도 $\omega$, 지름 $D$, 밀도 $\rho$, 점성 계수 $\mu$에 의존한다. 무차원 그룹은 몇 개인가?`, ans: '3', ansTex: R`3`,
        sol: R`$n=6$, $j=3$ → 3개: $P/(\rho\omega^3D^5)$, $Q/(\omega D^3)$, $\rho\omega D^2/\mu$.` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 10, q: R`지름 0.2 m 펌프가 1800 rpm에서 0.05 m³/s를 낸다. 닮은꼴인 지름 0.3 m 펌프가 1200 rpm으로 같은 무차원 운전점에서 돌 때 유량(m³/s)은?`, ans: '0.05*(1200/1800)*1.5^3', ansTex: R`0.1125`,
        sol: R`$Q/(\omega D^3)$ 일정 → $Q_2=0.05\Big(\dfrac{1200}{1800}\Big)(1.5)^3=0.1125$ m³/s.` },
      { ch: 'ch11', type: 'num', lv: 1, pts: 8, q: R`기름($\mu=0.05$ Pa·s, $\rho=870$)이 지름 2 cm 수평관에 0.2 L/s로 흐른다. 10 m 동안의 압력 강하(kPa)는?`, ans: '32*0.05*10*(0.0002/(pi*0.01^2))/0.02^2/1000', ansTex: R`25.5\ \text{kPa}`,
        sol: R`$V=0.637$ m/s, $Re=870(0.637)(0.02)/0.05=222$(층류). $\Delta p=32\mu LV/D^2=25.5$ kPa.` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 10, q: R`$Re=5\times10^4$, $\varepsilon/D=0.001$일 때 할란드 식의 마찰 계수는?`, ans: '1/(-1.8*log10(6.9/5e4+(0.001/3.7)^1.11))^2', ansTex: R`0.0237`,
        sol: R`$6.9/Re=1.38\times10^{-4}$, $(0.001/3.7)^{1.11}=1.09\times10^{-4}$, $1/\sqrt f=-1.8\log_{10}(2.47\times10^{-4})=6.49$ → $f=0.0237$.` },
      { ch: 'ch12', type: 'num', lv: 2, pts: 10, q: R`지름 4 cm 관이 지름 8 cm 관으로 갑자기 넓어지고 물 5 L/s가 흐른다. 급확대 손실 수두(m)는?`, ans: '(0.005/(pi*0.02^2)-0.005/(pi*0.04^2))^2/19.62', ansTex: R`0.454\ \text{m}`,
        sol: R`$V_1=3.98$, $V_2=0.995$ m/s. $(V_1-V_2)^2/2g=0.454$ m.` },
      { ch: 'ch12', type: 'num', lv: 3, pts: 10, q: R`수면 차 10 m인 두 저수조를 길이 50 m, 지름 5 cm 관($f=0.025$)으로 잇고 부차 손실 계수의 합이 1.5다. 유량(L/s)은?`, ans: 'sqrt(2*9.81*10/(0.025*1000+1.5))*pi*0.025^2*1000', ansTex: R`5.34`,
        sol: R`$10=\dfrac{V^2}{2g}(25+1.5)$ → $V=2.72$ m/s, $Q=5.34\times10^{-3}$ m³/s. (출구 손실 1과 입구 0.5를 합친 것이 1.5입니다.)` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 8, q: R`물($\nu=10^{-6}$)이 0.5 m/s로 평판을 지난다. 앞전에서 0.4 m인 곳의 층류 경계층 두께(mm)는?`, ans: '5*0.4/sqrt(0.5*0.4/1e-6)*1000', ansTex: R`4.47`,
        sol: R`$Re_x=2\times10^5$, $\delta=5.0x/\sqrt{Re_x}=4.47$ mm.` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 10, q: R`지름 1 cm 얼음 우박($\rho_s=917$)이 공기($\rho=1.2$) 속에서 떨어진다. $C_D=0.47$로 할 때 종단 속도(m/s)는?`, ans: 'sqrt((917-1.2)*9.81*(2/3)*0.01/(0.47*0.5*1.2))', ansTex: R`14.6`,
        sol: R`$(\rho_s-\rho)g\tfrac\pi6D^3=C_D\tfrac12\rho V^2\tfrac\pi4D^2$ → $V^2=\dfrac{(\rho_s-\rho)g(2D/3)}{C_D\rho/2}=212$, $V=14.6$ m/s. $Re\approx10^4$로 $C_D$ 가정이 맞습니다.` },
      { ch: 'ch15', type: 'num', lv: 2, pts: 8, q: R`반지름 0.2 m 원기둥에 공기($\rho=1.2$)가 5 m/s로 흐른다. 두 정체점이 $\theta=210°$, $330°$에 오도록 순환을 주면 단위 길이당 양력(N/m)은?`, ans: '1.2*5*4*pi*5*0.2*0.5', ansTex: R`37.7`,
        sol: R`$\sin\theta_s=-\Gamma/(4\pi Ua)=-0.5$ → $\Gamma=2\pi Ua=6.28$ m²/s. $L=\rho U\Gamma=37.7$ N/m.` },
      { ch: 'ch13', type: 'open', lv: 3, pts: 18, proof: true, q: R`평판 층류 경계층의 속도 분포를 직선 $u/U=y/\delta$로 가정하고 운동량 적분식으로 $\delta/x$와 $c_f$를 $Re_x$로 구하세요. 블라시우스 해($5.0$, $0.664$)와 비교하고, 가정한 분포의 어떤 점이 오차를 만드는지 설명하세요.`,
        sol: R`
$\theta=\delta\displaystyle\int_0^1\eta(1-\eta)d\eta=\dfrac\delta6$, $\tau_w=\mu U/\delta$.
$\dfrac{\mu U}\delta=\rho U^2\dfrac16\dfrac{d\delta}{dx}$ → $\delta\,d\delta=\dfrac{6\nu}Udx$ → $\delta^2=\dfrac{12\nu x}U$, $\dfrac\delta x=\dfrac{\sqrt{12}}{\sqrt{Re_x}}=\dfrac{3.46}{\sqrt{Re_x}}$.
$c_f=\dfrac{\mu U/\delta}{\frac12\rho U^2}=\dfrac{2}{Re_x(\delta/x)}=\dfrac{0.577}{\sqrt{Re_x}}$.
블라시우스와 비교: 두께 31% 작게, $c_f$ 13% 작게. 직선 분포는 벽 기울기가 $U/\delta$로 작고(실제 분포는 벽 근처가 더 가파름), 경계층 끝에서 기울기가 갑자기 0으로 꺾여 매끈하게 $U$에 다가가지 못합니다. 그래도 적분량 $\theta$는 비교적 잘 맞아 차수와 $Re_x^{-1/2}$ 의존성은 정확합니다.`,
        rubric: R`
- 운동량 두께와 벽 전단 — 5점
- 미분 방정식과 $\delta/x$ — 5점
- $c_f$ — 4점
- 비교와 오차 원인 — 4점` },
    ],
  },
  );
})();
