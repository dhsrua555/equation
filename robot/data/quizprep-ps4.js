/* 과제형 연습문제 — Problem Set #4(동차 변환과 좌표계 사슬, D-H 매개변수)와 같은 유형의 짧은 문제를 8·9단원에 덧붙입니다.
   quiz 태그로 과제 풀이 탭의 “같은 유형 더 풀기”와 이어집니다. 수치는 손으로, 그리고 perl로 검산했습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({ n: 8, problems: [
    { sec: '3.3.1c', type: 'num', lv: 1, q: R`카메라 {c}가 물체 {d} 바로 위 3에 있고 아래를 본다: $\hat x_c=\hat y_d$, $\hat y_c=\hat x_d$, $\hat z_c=-\hat z_d$. $T_{dc}$의 위치 부분의 $z$ 성분은?`, ans: '3', ansTex: R`3`, quiz: 'ps4-p1',
      sol: R`{c}의 원점은 {d}의 원점에서 $\hat z_d$ 방향으로 3이므로 $p_{dc}=(0,0,3)$. (거꾸로 $p_{cd}=(0,0,3)$도 $\hat z_c$가 아래라 같은 값이 됩니다.)` },
    { sec: '3.3.1b', type: 'num', lv: 2, q: R`{a}에서 본 {b}의 원점이 $(1,2,3)$이고 $R_{ab}=\mathrm{Rot}(\hat z,90°)$이다. {a}의 좌표로 $(1,5,3)$에 있는 점을 {b}의 좌표로 쓰면 $x$ 성분은?`, ans: '3', ansTex: R`3`, quiz: 'ps4-p3',
      sol: R`먼저 빼고 돌립니다: $r_a=(0,3,0)$, $r_b=R_{ab}^Tr_a=\mathrm{Rot}(\hat z,-90°)(0,3,0)=(3,0,0)$.` },
    { sec: '3.3.1c', type: 'num', lv: 2, q: R`반지름 $R_2=2$인 궤도를 속력 $v_2=1$로 도는 위성(문제 2의 위성 2와 같은 모양, $t=0$에 $(0,R_2,0)$에서 $-\hat x_0$ 쪽으로 출발)이 $t=2\pi/3$일 때 {0}에서 본 $y$ 좌표는?`, ans: '1', ansTex: R`1`, quiz: 'ps4-p2',
      sol: R`돈 각 $\phi=v_2t/R_2=\pi/3$, 위치 $R_2(-\sin\phi,\cos\phi,0)=(-\sqrt3,1,0)$ → $y=1$.` },
    { sec: '3.3.1c', type: 'num', lv: 2, q: R`문제 4의 탁자에서 $v_1=1$일 때 $t=\pi$에 차 1의 {0}에서의 $x$ 좌표는? (탁자 중심 $(1,1,2)$, 반지름 2, $t=0$에 중심의 $+\hat y_0$ 쪽 테두리에서 반시계로 출발)`, ans: '-1', ansTex: R`-1`, quiz: 'ps4-p4',
      sol: R`$\psi=v_1t/2=\pi/2$. $p_{01}=(1-2\sin\psi,\ 1+2\cos\psi,\ 2)=(-1,1,2)$.` },
  ] });
  EM.more.push({ n: 9, problems: [
    { sec: 'C.1', type: 'num', lv: 2, q: R`나란한 두 회전축(둘 다 $\hat y$ 방향)이 $\hat x$ 방향으로 $\sqrt3$, $\hat z$ 방향으로 1만큼 어긋나 있다. 두 축 사이의 D-H 링크 길이 $a$는?`, ans: '2', ansTex: R`2`, quiz: 'ps4-p7',
      sol: R`$a$는 공통 수선의 길이 $\sqrt{(\sqrt3)^2+1^2}=2$입니다(문제 7의 축 2–3과 같은 모양).` },
    { sec: 'C.1b', type: 'mc', lv: 1, q: R`병진 관절 $i$의 D-H 매개변수 가운데 관절 변수인 것은?`, choices: [R`$\alpha_{i-1}$`, R`$a_{i-1}$`, R`$d_i$`, R`$\phi_i$`], ans: 2, quiz: 'ps4-p6',
      sol: R`병진 관절은 $\hat z_i$를 따라 미끄러지므로 $d_i$가 변수이고 $\phi_i$는 상수입니다.` },
    { sec: 'C.3', type: 'num', lv: 1, q: R`문제 5의 PRRRRR 팔에서 $L_2=0.5$, $L_3=0.4$이다. D-H 표의 $a_3+a_4$는?`, ans: '0.9', ansTex: R`0.9`, quiz: 'ps4-p5',
      sol: R`평행한 축 3–4, 4–5 사이의 공통 수선 길이가 $a_3=L_2$, $a_4=L_3$입니다: $0.5+0.4=0.9$.` },
  ] });
})();
