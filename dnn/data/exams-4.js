/* Quiz 3 대비 모의고사 A — 10주차 수요일–11주차 수요일(22–23단원). 연습문제와 겹치지 않는 별도 문항이고, 두 문항 모두 (a)(b)(c)로 나뉜 서술형이며
   채점 기준을 붙였습니다. manifest에서 exams-3.js 앞에 두어 모의고사 페이지에서 Quiz 3 묶음이 먼저 보이게 합니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  const G = 'Quiz 3 대비 · 10주차 수–11주차 수';
  EM.exams.push(
  {
    id: 'q3a', roman: 'A', group: G,
    groupDesc: '22–23단원(선형 어텐션과 비전 트랜스포머, 생성 모델: 최대가능도·ELBO·VAE) 범위의 실전형 한 세트입니다. 1번은 선형 어텐션을 손으로 계산하고 전역·윈도 어텐션의 비용을 유도하며, 2번은 ELBO를 세우고 가우시안 KL과 재매개변수화의 기울기를 계산합니다. 두 문항 모두 (a)(b)(c) 소문항으로 나뉘고 채점 기준이 붙어 있습니다.',
    kind: 'Quiz 3 실전형', title: '어텐션의 비용과 VAE의 유도', scopeText: '22–23 단원',
    desc: '선형 어텐션의 출력을 직접 계산하고 셀프 어텐션과 윈도 어텐션의 비용을 유도한 뒤, 젠센 부등식으로 ELBO를 세우고 가우시안 KL과 재매개변수화의 기울기를 숫자로 확인합니다.',
    minutes: 50, plot: 'elbo',
    problems: [
      { ch: 'ch22', type: 'open', lv: 3, pts: 50, q: R`선형 어텐션과 윈도 어텐션의 계산을 다룬다. 행렬 곱 ($m\times n$)$\cdot$($n\times k$)의 비용은 곱셈 $mnk$번으로 센다.
(a) 토큰 세 개의 키 특성 $\phi(\mathbf k_1)=(1,0)$, $\phi(\mathbf k_2)=(0,1)$, $\phi(\mathbf k_3)=(1,1)$, 스칼라 값 $v_1=1$, $v_2=2$, $v_3=3$, 질의 특성 $\phi(\mathbf q_1)=(2,1)$이 주어졌다. $S=\sum_j\phi(\mathbf k_j)v_j$와 $Z=\sum_j\phi(\mathbf k_j)$를 구하고 선형 어텐션의 출력 $\tilde v_1=\phi(\mathbf q_1)^TS/\phi(\mathbf q_1)^TZ$를 계산하시오. 같은 값을 유사도 $\phi(\mathbf q_1)^T\phi(\mathbf k_j)$의 가중 평균으로 직접 확인하시오.
(b) 토큰 $N$개, 차원 $C$, 헤드 $h$개의 셀프 어텐션의 비용이 $4NC^2+2N^2C$이고, 겹치지 않는 $M\times M$ 창 안에서만 하는 윈도 어텐션의 비용이 $4NC^2+2NM^2C$임을 유도하시오. 투영 $W_Q,W_K,W_V,W_O\in\mathbb R^{C\times C}$를 쓰고 소프트맥스의 비용은 무시하며, 어떤 가정을 썼는지 밝히고 $h$가 결과에 나타나지 않는 이유를 쓰시오.
(c) $56\times56$ 특징 지도($N=56^2$), $C=96$, $M=7$일 때 창의 수, 두 방식의 어텐션 항의 비 $2N^2C/2NM^2C$, 두 방식의 전체 비용을 구하시오.`,
        sol: R`
**(a)** $S=1\cdot(1,0)+2\cdot(0,1)+3\cdot(1,1)=(4,5)$, $Z=(1,0)+(0,1)+(1,1)=(2,2)$입니다. $\phi(\mathbf q_1)^TS=2\cdot4+1\cdot5=13$, $\phi(\mathbf q_1)^TZ=2\cdot2+1\cdot2=6$이므로 $\tilde v_1=\boxed{13/6}\approx2.17$입니다. 직접 계산하면 유사도는 $\phi(\mathbf q_1)^T\phi(\mathbf k_j)=2,1,3$이고 $\frac{2\cdot1+1\cdot2+3\cdot3}{2+1+3}=\frac{13}6$으로 같습니다. 선형 어텐션은 $S$, $Z$를 한 번 만들어 모든 질의가 함께 씁니다.
**(b)** 가정: 입력 $X\in\mathbb R^{N\times C}$, 헤드마다 $C/h$차원, $h\mid C$, 창의 수 $N/M^2$이 정수. 투영 $XW_Q$, $XW_K$, $XW_V$는 각각 ($N\times C$)$\cdot$($C\times C$)라 $NC^2$이고 출력 투영도 $NC^2$이라 합이 $4NC^2$입니다. 헤드 하나에서 $Q_hK_h^T$는 ($N\times\frac Ch$)$\cdot$($\frac Ch\times N$)이라 $N^2\frac Ch$, $A_hV_h$는 ($N\times N$)$\cdot$($N\times\frac Ch$)라 $N^2\frac Ch$입니다. 헤드 $h$개를 더하면
$$h\cdot2N^2\frac Ch=2N^2C$$
이므로 $h$가 지워지고 전역 셀프 어텐션은 $4NC^2+2N^2C$입니다. 헤드는 $C$차원을 나눠 가질 뿐 전체 차원은 그대로이기 때문입니다. 윈도 어텐션에서 투영은 토큰마다 하므로 그대로 $4NC^2$이고, 창 하나는 토큰 $M^2$개의 셀프 어텐션이라 어텐션 항이 $2(M^2)^2C$, 창은 $N/M^2$개이므로
$$\frac N{M^2}\cdot2M^4C=2NM^2C$$
입니다. 합은 $4NC^2+2NM^2C$.
**(c)** $N=3136$, 창은 $3136/49=\boxed{64}$개, 어텐션 항의 비는 $\frac{2N^2C}{2NM^2C}=\frac N{M^2}=\boxed{64}$입니다. $4NC^2=115{,}605{,}504$, $2N^2C=1{,}888{,}223{,}232$, $2NM^2C=29{,}503{,}488$이므로 전역은 $\boxed{2{,}003{,}828{,}736}\approx2.0\times10^9$, 윈도는 $\boxed{145{,}108{,}992}\approx1.45\times10^8$이고 전체 비용의 비는 약 $13.8$입니다. 전역에서는 어텐션 항이 약 $94\%$를 차지하지만 윈도에서는 투영 항이 약 $80\%$를 차지합니다.`,
        rubric: R`
- (a) $S=(4,5)$, $Z=(2,2)$ — 6점
- (a) $\tilde v_1=13/6$과 유사도 가중 평균으로 확인 — 8점
- (b) 투영 비용 $4NC^2$ — 8점
- (b) 헤드마다 $2N^2C/h$, 합해 $2N^2C$이고 $h$가 지워지는 이유 — 10점
- (b) 창 $N/M^2$개 곱하기 $2M^4C$로 $2NM^2C$, 가정을 밝힘 — 8점
- (c) 창 64개와 비 64 — 4점
- (c) 두 방식의 전체 비용(비 약 13.8) — 6점` },
      { ch: 'ch23', type: 'open', lv: 3, pts: 50, q: R`사전분포 $p(\mathbf z)=\N(\mathbf 0,I)$, 디코더 $p_\theta(\mathbf x\mid\mathbf z)$, 인코더 $q_\phi(\mathbf z\mid\mathbf x)$로 된 VAE를 생각한다.
(a) $\log p_\theta(\mathbf x)\ge\E_{q_\phi}[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z))$를 유도하시오. 쓰는 부등식과 $q_\phi$에 필요한 가정을 밝히고 등호가 언제 성립하는지 쓰시오.
(b) 1차원 $q=\N(\mu,\sigma^2)$, $p=\N(0,1)$에 대해 $\KL(q\,\|\,p)=\frac12(\sigma^2+\mu^2-1-\log\sigma^2)$를 유도하고, $\mu=2$, $\sigma^2=1$일 때의 값을 구하시오.
(c) 1차원 VAE의 인코더가 $\mu=2$, $\sigma=1$을 내고, 잡음 $\varepsilon=-0.5$를 뽑아 $z=\mu+\sigma\varepsilon$으로 재매개변수화한다. 디코더는 $f(z)=wz$ ($w=2$), 자료는 $x=4$, 복원 손실은 $R=\frac12(x-f(z))^2$이다. $z$, $R$, $\partial R/\partial\mu$, $\partial R/\partial\sigma$와 KL 항 $\frac12(\sigma^2+\mu^2-1-\log\sigma^2)$의 $\mu$, $\sigma$에 대한 기울기를 구하고, 표본 하나로 얻은 $\partial R/\partial\mu$가 무엇의 불편 추정량인지 쓰시오.`,
        sol: R`
**(a)** 가정: $p_\theta(\mathbf x)>0$이고 $q_\phi(\mathbf z\mid\mathbf x)$는 $p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)>0$인 모든 $\mathbf z$에서 양수인 밀도. 그러면 $q_\phi$를 곱하고 나눠 적분을 기댓값으로 쓸 수 있고, $\log$가 오목하다는 젠센 부등식 $\log\E[Y]\ge\E[\log Y]$로
$$\log p_\theta(\mathbf x)=\log\E_{q_\phi}\Big[\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q_\phi(\mathbf z\mid\mathbf x)}\Big]\ge\E_{q_\phi}\Big[\log\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q_\phi(\mathbf z\mid\mathbf x)}\Big]=\E_{q_\phi}[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z))$$
입니다. 마지막 등호는 로그를 둘로 나누고 $\E_q[\log(p/q)]=-\KL(q\,\|\,p)$를 쓴 것입니다. 등호는 비 $p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)/q_\phi(\mathbf z\mid\mathbf x)$가 상수일 때, 곧 $q_\phi(\mathbf z\mid\mathbf x)=p_\theta(\mathbf z\mid\mathbf x)$일 때 성립하고, 일반적으로 틈은 $\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p_\theta(\mathbf z\mid\mathbf x))$입니다.
**(b)** $\log\frac{q(z)}{p(z)}=-\frac12\log\sigma^2-\frac{(z-\mu)^2}{2\sigma^2}+\frac{z^2}2$이고 $z\sim q$에서 $\E[(z-\mu)^2]=\sigma^2$, $\E[z^2]=\sigma^2+\mu^2$이므로
$$\KL(q\,\|\,p)=-\frac12\log\sigma^2-\frac12+\frac{\sigma^2+\mu^2}2=\frac12\big(\sigma^2+\mu^2-1-\log\sigma^2\big)$$
입니다. $\mu=2$, $\sigma^2=1$이면 $\frac12(1+4-1-0)=\boxed{2}$.
**(c)** $z=2+1\cdot(-0.5)=\boxed{1.5}$, $f(z)=3$, $R=\frac12(4-3)^2=\boxed{0.5}$입니다. $\frac{\partial R}{\partial z}=-(x-wz)\,w=-2$이고 $\frac{\partial z}{\partial\mu}=1$, $\frac{\partial z}{\partial\sigma}=\varepsilon=-0.5$이므로
$$\frac{\partial R}{\partial\mu}=-2\cdot1=\boxed{-2},\qquad\frac{\partial R}{\partial\sigma}=-2\cdot(-0.5)=\boxed{1}.$$
KL 항의 기울기는 $\frac{\partial}{\partial\mu}=\mu=\boxed{2}$, $\frac{\partial}{\partial\sigma}=\frac12\big(2\sigma-\frac2\sigma\big)=\sigma-\frac1\sigma=\boxed{0}$입니다. 표본 하나의 $\partial R/\partial\mu$는 $\frac{\partial}{\partial\mu}\E_{z\sim\N(\mu,\sigma^2)}[R(z)]$의 불편 추정량입니다. 실제로 $\E[R]=\frac12\big((x-w\mu)^2+w^2\sigma^2\big)$이라 참 기울기는 $\partial/\partial\mu=-w(x-w\mu)=0$, $\partial/\partial\sigma=w^2\sigma=4$이고, 표본 하나의 값 $-2$, $1$은 이것을 평균으로만 맞춥니다.`,
        rubric: R`
- (a) $q_\phi$를 곱하고 나눠 기댓값으로 쓰고 받침 가정을 밝힘 — 6점
- (a) 젠센 부등식(로그의 오목성)으로 하한 — 6점
- (a) 두 항으로 나눠 KL로 씀 — 4점
- (a) 등호 조건(사후분포) 또는 틈이 사후분포와의 KL — 4점
- (b) 로그 밀도의 차와 두 기댓값 — 10점
- (b) 값 $2$ — 2점
- (c) $z=1.5$, $R=0.5$ — 4점
- (c) 연쇄법칙으로 $\partial R/\partial\mu=-2$, $\partial R/\partial\sigma=1$ — 8점
- (c) KL 기울기 $2$, $0$ — 4점
- (c) 불편 추정의 대상 $\partial\E[R]/\partial\mu$ — 2점` },
    ],
  },
  );
})();
