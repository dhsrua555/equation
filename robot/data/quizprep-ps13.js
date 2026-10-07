/* 과제형 연습문제 — Problem Set #1(자유도와 C-공간), #3(회전 행렬)과 같은 유형의 짧은 문제를 1·2·6단원에 덧붙입니다.
   quiz 태그로 과제 풀이 탭의 “같은 유형 더 풀기”와 이어집니다. 수치는 perl로 검산했습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({ n: 1, problems: [
    { sec: '2.1', type: 'num', lv: 1, q: R`4차원 공간에 있는 강체의 자유도는?`, ans: '10', ansTex: R`10`, quiz: 'ps1-p1',
      sol: R`점을 차례로 놓으면 $4+3+2+1=10$ ($=n(n+1)/2$).` },
    { sec: '2.1', type: 'num', lv: 2, q: R`같은 강체의 자유도 가운데 회전 자유도는 몇 개인가?`, ans: '6', ansTex: R`6`, quiz: 'ps1-p1',
      sol: R`병진 4를 빼면 $10-4=6=\binom42$ — 회전은 좌표 평면마다 하나입니다.` },
    { sec: '2.2a', type: 'num', lv: 1, q: R`평면 기구의 한 핀에 링크 4개가 함께 꽂혀 있다. 이 핀은 회전 관절 몇 개로 세는가?`, ans: '3', ansTex: R`3`, quiz: 'ps1-p2',
      sol: R`첫 링크에 나머지 셋이 하나씩 붙는다고 보면 $4-1=3$개.` },
    { sec: '2.2a', type: 'num', lv: 2, q: R`평면 기구가 바닥을 포함한 링크 8개와 회전 관절 10개(겹친 관절을 따로 센 수)로 이루어져 있다. 그뤼블러 자유도는?`, ans: '1', ansTex: R`1`, quiz: 'ps1-p2',
      sol: R`$3(8-1-10)+10=1$.` },
    { sec: '2.2a', type: 'num', lv: 2, q: R`교재 연습문제 2.19의 두 팔 로봇에서 상자가 탁자 위를 미끄러지지 못하고 탁자에 고정되어 있다면 자유도는?`, ans: '3', ansTex: R`3`, quiz: 'ps1-p3',
      sol: R`손+상자+손이 바닥과 한 덩어리: $N=6$(바닥, 몸통, 위팔 2, 아래팔 2), $J=7$(R 3, S 4), $\sum f=15$ → $6(6-1-7)+15=3$. 허리 1 + 팔꿈치 회전 2.` },
  ] });
  EM.more.push({ n: 2, problems: [
    { sec: '2.5', type: 'num', lv: 1, q: R`링크 길이가 3과 1인 평면 2R 팔(관절 제한 없음)의 작업 공간은 고리다. 안쪽 반지름은?`, ans: '2', ansTex: R`2`, quiz: 'ps1-p4',
      sol: R`$\lvert3-1\rvert=2$, 바깥 반지름은 $3+1=4$.` },
    { sec: '2.3a', type: 'mc', lv: 1, q: R`같은 2R 팔의 C-공간은?`,
      choices: [R`반지름 2와 4 사이의 고리`, R`토러스 $T^2$`, R`구면 $S^2$`, R`$\mathbb R^2$`], ans: 1, quiz: 'ps1-p4',
      sol: R`관절 각 둘이 각각 원이므로 $S^1\times S^1=T^2$. 고리는 작업 공간입니다.` },
  ] });
  EM.more.push({ n: 6, problems: [
    { sec: '3.2.1a', type: 'num', lv: 1, q: R`{s}에서 {a}의 $\hat x_a$가 $(0,1,0)$, $\hat y_a$가 $(0,0,1)$ 방향이다. $R_{sa}$의 (1, 3) 성분은?`, ans: '1', ansTex: R`1`, quiz: 'ps3-p1',
      sol: R`$\hat z_a=\hat x_a\times\hat y_a=(1,0,0)$이므로 $R_{sa}=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$.` },
    { sec: '3.2.1b', type: 'num', lv: 2, q: R`$R_{sa}=\mathrm{Rot}(\hat z,90°)$이고 각속도가 {s}에서 $\omega_s=(1,2,3)$이다. $\omega_a$의 $x$ 성분은?`, ans: '2', ansTex: R`2`, quiz: 'ps3-p1',
      sol: R`$\omega_a=R_{sa}^T\omega_s=\mathrm{Rot}(\hat z,-90°)(1,2,3)=(2,-1,3)$.` },
    { sec: '3.2.1b', type: 'mc', lv: 2, q: R`$R_{sb}$와 {s}의 좌표 $p_s$가 있을 때 $R_{sb}p_s$의 뜻은?`,
      choices: [R`같은 점을 {b}의 좌표로 적은 것`, R`점을 $R_{sb}$만큼 돌린 새 점을 {s}의 좌표로 적은 것`, R`같은 점을 {s}의 좌표로 다시 적은 것`, R`정의되지 않는다`], ans: 1, quiz: 'ps3-p1',
      sol: R`아래첨자가 맞물리지 않으므로($R_{sb}$ 뒤에 {b} 좌표가 와야 좌표 바꾸기) 점 옮기기입니다. 좌표 바꾸기는 $R_{sb}^Tp_s=R_{bs}p_s$.` },
  ] });
})();
