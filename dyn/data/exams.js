/* 실전 모의고사 — 연습문제·과제와 겹치지 않는 별도 문항. 수업의 시험 형식(75분, 10문제)을 따랐습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x1', roman: 'I', kind: '중간고사 범위', title: '질점의 동역학과 라그랑주 역학', scopeText: '01–08 단원과 09단원 앞부분 · 필기 3월 4일–4월 15일',
    desc: '운동학(직교·극좌표), 운동 방정식과 마찰, 궤도, 에너지, 충돌, 질점계와 로켓, 변분법과 라그랑주 방정식. 수업의 중간고사처럼 75분 10문제입니다.',
    minutes: 75, plot: 'dyProj',
    problems: [
      { ch: 'ch01', type: 'num', lv: 2, pts: 8, q: R`$x(t)=t^3-9t^2+24t$ (m, s)인 질점이 $0\le t\le5$ s 동안 움직인 거리(m)는?`, ans: '28', ansTex: R`28\ \text{m}`,
        sol: R`$v=3(t-2)(t-4)$. $x(0)=0$, $x(2)=20$, $x(4)=16$, $x(5)=20$. 거리 $20+4+4=28$ m.` },
      { ch: 'ch02', type: 'num', lv: 1, pts: 8, q: R`평지에서 25 m/s, 40°로 던진 공의 최고 높이(m)는? ($g=9.81$)`, ans: '(25*sin(40*pi/180))^2/(2*9.81)', ansTex: R`13.2\ \text{m}`,
        sol: R`$(v_0\sin\alpha)^2/(2g)=16.07^2/19.62=13.16$ m.` },
      { ch: 'ch02', type: 'num', lv: 2, pts: 10, q: R`$r=0.5+0.2t$ (m), $\theta=2t$ (rad)인 질점의 $t=1$ s에서 가속도 크기(m/s²)는?`, ans: 'sqrt(2.8^2+0.8^2)', ansTex: R`2.91`,
        sol: R`$r=0.7$, $\dot r=0.2$, $\ddot r=0$, $\dot\theta=2$, $\ddot\theta=0$. $a_r=-0.7(4)=-2.8$, $a_\theta=2(0.2)(2)=0.8$. $\sqrt{7.84+0.64}=2.91$ m/s².` },
      { ch: 'ch03', type: 'num', lv: 2, pts: 10, q: R`경사 30°인 면 위의 5 kg 블록($\mu_k=0.2$)이 꼭대기의 도르래를 지나는 줄로 매달린 4 kg 블록과 이어져 있다. 매달린 블록이 내려갈 때 가속도(m/s²)는?`, ans: '(4*9.81-5*9.81*0.5-0.2*5*9.81*cos(pi/6))/9', ansTex: R`0.691`,
        sol: R`경사 블록: $T-mg\sin30°-\mu mg\cos30°=5a$. 매달린 블록: $4g-T=4a$. 더하면 $9a=39.24-24.53-8.50=6.22$, $a=0.691$ m/s².` },
      { ch: 'ch04', type: 'num', lv: 1, pts: 8, q: R`고도 800 km 원 궤도 위성의 속력(km/s)은? ($R=6370$ km, $GM=3.98\times10^{14}$ m³/s²)`, ans: 'sqrt(3.98e14/7.17e6)/1000', ansTex: R`7.45`,
        sol: R`$r=7.17\times10^6$ m, $v=\sqrt{GM/r}=7450$ m/s.` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 10, q: R`2 kg 블록이 반지름 1.5 m인 매끄러운 4분원 트랙의 꼭대기에서 정지 상태로 미끄러져 내려와 $\mu_k=0.3$인 수평면으로 나아간다. 수평면에서 멈출 때까지의 거리(m)는?`, ans: '1.5/0.3', ansTex: R`5\ \text{m}`,
        sol: R`$mgR=\mu mg\,s$ → $s=R/\mu=5$ m. 질량과 무관합니다.` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 10, q: R`1 kg 공 A가 5 m/s로 정지한 2 kg 공 B와 정면 충돌한다($e=0.5$). 충돌 후 B의 속도(m/s)는?`, ans: '(5+0.5*5)/3', ansTex: R`2.5`,
        sol: R`$v_B'=(m_Av_A+m_Ae(v_A-v_B))/(m_A+m_B)=(5+2.5)/3=2.5$ m/s. ($v_A'=0$.)` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 10, q: R`$\int_0^1(\dot x^2+4x)\,dt$를 $x(0)=x(1)=0$으로 최소화하는 곡선에서 $x(0.5)$는?`, ans: '-0.25', ansTex: R`-\tfrac14`,
        sol: R`E-L: $2\ddot x-4=0$ → $x=t^2+At$. $x(1)=0$ → $A=-1$. $x(0.5)=0.25-0.5=-0.25$.` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 8, q: R`외력이 없는 곳에서 로켓이 상대 속도 2200 m/s로 가스를 뿜어 질량이 1500 kg에서 600 kg이 되었다. 속도 증가(m/s)는?`, ans: '2200*ln(2.5)', ansTex: R`2016`,
        sol: R`$u\ln(m_1/m_2)=2200\ln2.5=2016$ m/s.` },
      { ch: 'ch08', type: 'open', lv: 3, pts: 18, proof: true, q: R`길이가 늘어날 수 있는 진자(용수철 진자): 질량 $m$이 강성 $k$, 자연 길이 $l_0$인 스프링 끝에 달려 연직면에서 흔들린다. 일반화 좌표 $r$(스프링 길이)과 $\theta$(연직에서의 각)로 라그랑지안을 세우고 두 운동 방정식을 유도하세요.`,
        sol: R`
속도: $\mathbf v=\dot r\mathbf e_r+r\dot\theta\mathbf e_\theta$ → $T=\tfrac12m(\dot r^2+r^2\dot\theta^2)$.
퍼텐셜(매단 점 기준, 아래가 $\theta=0$): $V=-mgr\cos\theta+\tfrac12k(r-l_0)^2$.
$L=\tfrac12m(\dot r^2+r^2\dot\theta^2)+mgr\cos\theta-\tfrac12k(r-l_0)^2$.
$r$: $\frac{d}{dt}(m\dot r)-\big(mr\dot\theta^2+mg\cos\theta-k(r-l_0)\big)=0$ → $m\ddot r-mr\dot\theta^2-mg\cos\theta+k(r-l_0)=0$.
$\theta$: $\frac{d}{dt}(mr^2\dot\theta)+mgr\sin\theta=0$ → $r\ddot\theta+2\dot r\dot\theta+g\sin\theta=0$.
확인: $k\to\infty$($r=l_0$ 고정)이면 둘째 식이 단진자 $l\ddot\theta+g\sin\theta=0$.`,
        rubric: R`
- 운동에너지(극좌표) — 4점
- 퍼텐셜(중력 + 스프링) — 4점
- $r$ 방정식 — 4점
- $\theta$ 방정식 — 4점
- 극한 확인 — 2점` },
    ],
  },
  {
    id: 'x2', roman: 'II', kind: '기말고사 범위', title: '강체의 동역학 (종합)', scopeText: '09–15 단원 중심, 전 범위 · 필기 4월 20일–6월 8일',
    desc: '평면 운동학과 코리올리, 운동 방정식과 구름, 에너지, 충격량과 편심 충돌, 관성 텐서, 3차원 운동 방정식. 수업의 기말고사처럼 75분 10문제, 교재·필기를 보며 풀어도 되는 형식입니다.',
    minutes: 75, plot: 'dyPrecession',
    problems: [
      { ch: 'ch09', type: 'num', lv: 1, pts: 8, q: R`길이 2.5 m 막대의 끝 $A$가 바닥을 따라 0.8 m/s로 벽에서 멀어지고 끝 $B$는 벽을 따라 미끄러진다. 막대가 벽과 40°를 이루는 순간 $B$의 속력(m/s)은?`, ans: '0.8*tan(40*pi/180)', ansTex: R`0.671`,
        sol: R`$v_B=v_A\tan\theta=0.8\tan40°=0.671$ m/s.` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 10, q: R`일정한 $\Omega=5$ rad/s로 도는 팔 위의 고리가 $r=0.3$ m에서 팔에 대해 0.6 m/s로 바깥으로 움직인다(상대 가속도 0). 절대 가속도 크기(m/s²)는?`, ans: 'sqrt(7.5^2+36)', ansTex: R`9.60`,
        sol: R`구심 $\Omega^2r=7.5$, 코리올리 $2\Omega v=6$. $\sqrt{56.25+36}=9.60$ m/s².` },
      { ch: 'ch11', type: 'num', lv: 1, pts: 8, q: R`경사 25°인 면을 미끄러지지 않고 구르는 속찬 구의 가속도(m/s²)는?`, ans: '5/7*9.81*sin(25*pi/180)', ansTex: R`2.96`,
        sol: R`$\tfrac57g\sin25°=2.96$ m/s².` },
      { ch: 'ch11', type: 'num', lv: 1, pts: 8, q: R`한 끝이 핀인 길이 0.8 m 막대를 수평에서 놓은 순간의 각가속도(rad/s²)는?`, ans: '3*9.81/1.6', ansTex: R`18.4`,
        sol: R`$3g/(2L)=18.4$ rad/s².` },
      { ch: 'ch12', type: 'num', lv: 2, pts: 10, q: R`원판이 정지 상태에서 높이 2 m를 미끄러지지 않고 굴러 내려왔다. 속력(m/s)은?`, ans: 'sqrt(4*9.81*2/3)', ansTex: R`5.11`,
        sol: R`$mgh=\tfrac34mv^2$ → $v=\sqrt{4gh/3}=5.11$ m/s.` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 10, q: R`수평으로 2.4 m/s로 떨어지던 길이 1 m 막대의 한 끝이 턱에 걸려(되튀지 않음) 돌기 시작한다. 직후 각속도(rad/s)는?`, ans: '3*2.4/2', ansTex: R`3.6`,
        sol: R`턱에 대한 각운동량 보존: $mv\tfrac L2=\tfrac13mL^2\omega$ → $\omega=3v/(2L)=3.6$ rad/s.` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 10, q: R`관성 행렬 $\begin{pmatrix}4&-1&0\\-1&4&0\\0&0&2\end{pmatrix}$ kg·m²의 가장 큰 주관성 모멘트는?`, ans: '5', ansTex: R`5`,
        sol: R`블록 $\begin{pmatrix}4&-1\\-1&4\end{pmatrix}$의 고윳값 $4\pm1$ → 3, 5. 그리고 2. 최대 5(주축 $\tfrac1{\sqrt2}(1,-1,0)$).` },
      { ch: 'ch15', type: 'num', lv: 2, pts: 10, q: R`질량 0.4 kg 두 개를 반길이 0.25 m 막대 양끝에 달아 가운데를 연직축에 20°로 고정하고 30 rad/s로 돌린다. 축이 받아야 하는 모멘트(N·m)는?`, ans: '2*0.4*0.0625*900*sin(20*pi/180)*cos(20*pi/180)', ansTex: R`14.5`,
        sol: R`$2ml^2\omega^2\sin\alpha\cos\alpha=45(0.3214)=14.46$ N·m.` },
      { ch: 'ch14', type: 'mc', lv: 1, pts: 6, q: R`균일한 원기둥의 중심을 지나는 축 중 주축이 **아닐 수 있는** 것은?`,
        choices: [R`원기둥의 대칭축`, R`대칭축에 수직인 축`, R`대칭축과 30°를 이루는 축`, R`위의 세 축은 모두 늘 주축이다`], ans: 2,
        sol: R`대칭축과 그에 수직인 모든 축은 대칭면에 수직이라 주축입니다. 30° 기운 축은 곱관성 모멘트가 생겨 주축이 아닙니다(단, 높이와 반지름이 $I_\parallel=I_\perp$가 되는 특별한 비율이면 모든 축이 주축).` },
      { ch: 'ch13', type: 'open', lv: 3, pts: 20, proof: true, q: R`매끄러운 수평면에 정지한 균일 막대(질량 $M$, 길이 $L$)를 질량 $m$인 공이 막대에 수직으로 속도 $v_0$로 친다. 맞는 점은 막대 중심에서 $b$이고 반발 계수는 $e$다. 충격량 $J$, 막대 질량 중심의 속도, 각속도를 구하고, $m=M$, $e=1$, $b=L/4$일 때 $v_G/v_0$를 계산하세요.`,
        sol: R`
공: $mv_0-J=mv'$. 막대: $J=Mv_G$, $Jb=\tfrac1{12}ML^2\omega$ → $\omega=\dfrac{12Jb}{ML^2}$.
맞은 점(접촉점)의 속도: $v_G+\omega b=\dfrac JM\Big(1+\dfrac{12b^2}{L^2}\Big)=\dfrac JM\kappa$.
반발(접촉점 속도로): $\dfrac JM\kappa-v'=ev_0$. $v'=v_0-J/m$을 넣으면 $J\Big(\dfrac\kappa M+\dfrac1m\Big)=(1+e)v_0$.
$J=\dfrac{(1+e)v_0}{\kappa/M+1/m}$, $v_G=J/M$, $\omega=12Jb/(ML^2)$.
$m=M$, $e=1$, $b=L/4$: $\kappa=1.75$, $v_G=\dfrac{2v_0}{2.75}=0.727v_0$, $\omega=\dfrac{12(0.727v_0)(L/4)}{L^2}=2.18v_0/L$.`,
        rubric: R`
- 공과 막대의 선운동량 식 — 4점
- 막대의 각운동량 식 — 4점
- 접촉점 속도로 반발 계수 — 6점
- 연립한 일반해 — 4점
- 수치 — 2점` },
    ],
  },
  );
})();
