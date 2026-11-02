/* 증명의 길잡이 — 17단원의 긴 증명(본문 600자 이상). 형식은 plan-a.js와 같습니다:
   쉬운 요약(easy)과 단계(nodes), 각 단계의 at은 한국어 본문에서 그 단계가 시작하는 조각의 첫머리입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.plans = EM.plans || {};
(function () {
  const R = String.raw;
  Object.assign(EM.plans, {
    'ch17-closure': {
      easy: R`닫힘 $\overline U$는 $U$의 수열이 닿을 수 있는 모든 극한입니다. 두 극한을 선형결합하면, 수열들을 같은 방식으로 선형결합한 수열이 그 결합에 수렴하므로 $\overline U$도 부분공간입니다. 조밀성의 $\varepsilon$ 정의는 “$\varepsilon=\frac1k$마다 가까운 원소를 고르면 수열이 된다”로 바꿔 읽으면 곧 닫힘이 전체라는 말과 같아집니다.`,
      easyEn: R`The closure $\overline U$ is every limit that sequences in $U$ can reach. If we combine two limits linearly, the same linear combination of the sequences converges to that combination, so $\overline U$ is a subspace too. Reading the $\varepsilon$ definition of density as “picking a close element for each $\varepsilon=\frac1k$ gives a sequence” turns it into the statement that the closure is everything.`,
      nodes: [
        { id: 'sub', at: '**부분공간.**', t: R`극한의 선형결합`, en: R`Linear combinations of limits`,
          d: R`$u_k\to f$, $v_k\to g$이면 $au_k+bv_k\in U$이고 삼각부등식으로 $af+bg$에 수렴합니다.`,
          dEn: R`If $u_k\to f$ and $v_k\to g$, then $au_k+bv_k\in U$ converges to $af+bg$ by the triangle inequality.` },
        { id: 'fwd', at: '**조밀 ⇒', t: R`조밀이면 닫힘이 전체`, en: R`Dense means the closure is everything`,
          d: R`$\varepsilon=\frac1k$마다 원소를 하나씩 고르면 $f$에 수렴하는 수열이 됩니다.`,
          dEn: R`Picking one element for each $\varepsilon=\frac1k$ gives a sequence converging to $f$.` },
        { id: 'back', at: R`**$\overline U=X$ ⇒`, t: R`거꾸로`, en: R`And back`,
          d: R`수렴하는 수열의 뒷부분은 주어진 $\varepsilon$ 안에 들어옵니다.`,
          dEn: R`The tail of a converging sequence falls within any given $\varepsilon$.` },
      ],
    },
    'ch17-lemma1': {
      easy: R`“모든 뉴런과의 적분이 0인 측도는 0”을 보이려면, 뉴런에서 시작해 측도를 확정할 만큼 많은 함수로 넓혀 가면 됩니다. 먼저 뉴런을 한없이 가파르게 만들면 반공간 위에서 1인 계단이 되므로, 모든 반공간과 초평면의 측도가 0임을 얻습니다.

다음으로 한 방향 $w$를 고정하고 $w^Tx$의 함수만 봅니다. 반공간의 측도가 0이면 구간의 지시함수, 계단 함수와의 적분이 0이고, 계단 함수로 $\cos$, $\sin$을 균등 근사하면 측도의 푸리에 변환이 모든 곳에서 0이 됩니다. 푸리에 변환이 0인 측도는 0이라는 유일성 정리로 끝납니다.`,
      easyEn: R`To show “a measure whose integral against every neuron is 0 is 0,” we start from neurons and widen to enough functions to pin the measure down. First, making a neuron infinitely steep turns it into a step that is 1 on a half-space, so every half-space and hyperplane has measure 0.

Next we fix one direction $w$ and look only at functions of $w^Tx$. If half-spaces have measure 0, so do integrals against indicators of intervals and step functions, and approximating $\cos$ and $\sin$ uniformly by step functions makes the Fourier transform of the measure 0 everywhere. The uniqueness theorem — a measure with zero Fourier transform is 0 — finishes it.`,
      nodes: [
        { id: 'prep', at: '**준비.**', t: R`유계성과 부호 측도`, en: R`Boundedness and signed measures`,
          d: R`$\sigma$는 양 끝 극한이 있는 연속 함수라 유계입니다. $\mu=\mu^+-\mu^-$로 나누어 각각에 유계 수렴 정리를 씁니다.`,
          dEn: R`$\sigma$ is continuous with limits at both ends, so it is bounded. Split $\mu=\mu^+-\mu^-$ and apply bounded convergence to each.` },
        { id: 'steep', at: '**1단계', t: R`가파른 뉴런 → 계단`, en: R`Steep neuron → step`,
          d: R`$\sigma(\lambda(w^Tx+\theta)+\varphi)$도 뉴런이라 적분이 0이고, $\lambda\to\infty$의 극한에서 $\mu(H^+)+\sigma(\varphi)\mu(\Pi)=0$을 얻습니다.`,
          dEn: R`$\sigma(\lambda(w^Tx+\theta)+\varphi)$ is also a neuron, so its integral is 0, and the limit $\lambda\to\infty$ gives $\mu(H^+)+\sigma(\varphi)\mu(\Pi)=0$.` },
        { id: 'half', at: '**2단계', t: R`반공간·초평면의 측도 0`, en: R`Half-spaces and hyperplanes: measure 0`,
          d: R`$\varphi\to\mp\infty$로 보내 $\mu(H^+)=0$과 $\mu(\Pi)=0$을 따로 떼어 냅니다.`,
          dEn: R`Sending $\varphi\to\mp\infty$ separates $\mu(H^+)=0$ and $\mu(\Pi)=0$.` },
        { id: 'dir', at: '**3단계', t: R`한 방향의 범함수`, en: R`A functional in one direction`,
          d: R`$F(h)=\int h(w^Tx)\,d\mu$는 계단 함수에서 0이고, 계단 함수의 균등 극한인 $\cos$, $\sin$에서도 0입니다.`,
          dEn: R`$F(h)=\int h(w^Tx)\,d\mu$ is 0 on step functions, hence on $\cos$ and $\sin$, their uniform limits.` },
        { id: 'fourier', at: '**4단계', t: R`푸리에 변환의 유일성`, en: R`Uniqueness of the Fourier transform`,
          d: R`$\hat\mu(w)=F(\cos)-iF(\sin)=0$이 모든 $w$에서 성립하므로 $\mu=0$입니다.`,
          dEn: R`$\hat\mu(w)=F(\cos)-iF(\sin)=0$ holds for every $w$, so $\mu=0$.` },
      ],
    },
    'ch17-lemma3': {
      easy: R`조밀하지 않으면 닫힘 $\overline U$ 밖에 점 $f_0$이 있고, 닫힘이 닫혀 있으므로 $f_0$에서 $\overline U$까지의 거리 $d$는 양수입니다. $\overline U$와 $f_0$으로 만든 작은 공간에서는 “$f_0$ 방향의 성분 × $d$”라는 범함수를 손으로 정의할 수 있고, 거리의 정의 덕분에 노름 한계 1을 지킵니다. 한-바나흐 정리가 이것을 한계를 지키며 전체 공간으로 넓혀 줍니다.`,
      easyEn: R`If $U$ is not dense, there is a point $f_0$ outside the closure $\overline U$, and since the closure is closed, the distance $d$ from $f_0$ to $\overline U$ is positive. On the small space built from $\overline U$ and $f_0$ we can define by hand the functional “component in the direction of $f_0$ × $d$,” which keeps the norm bound 1 thanks to the definition of distance. The Hahn–Banach theorem extends it to the whole space while keeping the bound.`,
      nodes: [
        { id: 'pick', at: '**점 고르기.**', t: R`양의 거리 $d$`, en: R`A positive distance $d$`,
          d: R`$f_0\notin\overline U$이고 $\overline U$가 닫혀 있으므로 $d=\inf_{u\in\overline U}\lVert f_0-u\rVert>0$입니다.`,
          dEn: R`$f_0\notin\overline U$ and $\overline U$ is closed, so $d=\inf_{u\in\overline U}\lVert f_0-u\rVert>0$.` },
        { id: 'def', at: '**작은 공간에서 정의.**', t: R`$L_0(u+tf_0)=td$`, en: R`$L_0(u+tf_0)=td$`,
          d: R`표현 $u+tf_0$이 유일해 잘 정의되고, $\overline U$에서 0, $f_0$에서 $d$입니다.`,
          dEn: R`The representation $u+tf_0$ is unique, so it is well defined; it is 0 on $\overline U$ and $d$ at $f_0$.` },
        { id: 'bound', at: '**유계성.**', t: R`노름 한계 1`, en: R`Norm bound 1`,
          d: R`$\lVert u+tf_0\rVert=\lvert t\rvert\lVert f_0+u/t\rVert\ge\lvert t\rvert d$.`,
          dEn: R`$\lVert u+tf_0\rVert=\lvert t\rvert\lVert f_0+u/t\rVert\ge\lvert t\rvert d$.` },
        { id: 'ext', at: '**확장.**', t: R`한-바나흐 확장`, en: R`Hahn–Banach extension`,
          d: R`같은 한계로 $X$ 전체에 넓히면 $L|_U=0$, $L(f_0)=d\ne0$인 유계 $L$이 됩니다.`,
          dEn: R`Extending to all of $X$ with the same bound gives a bounded $L$ with $L|_U=0$ and $L(f_0)=d\ne0$.` },
      ],
    },
    'ch17-cybenko': {
      easy: R`정리는 두 조각으로 나뉩니다. “연속 시그모이드는 판별적이다”(보조정리 1)와 “연속 판별 함수로 만든 망은 조밀하다”(보조정리 5). 여기서는 둘째를 귀류법으로 보입니다.

망들의 모임 $U$는 $C(I_n)$의 부분공간이고(연속성), 조밀하지 않다고 가정하면 보조정리 4가 $U$의 모든 함수와 적분이 0인 0 아닌 측도를 줍니다. 뉴런 하나짜리 망도 $U$에 있으니 이 측도는 모든 뉴런과의 적분이 0이고, 판별성 때문에 측도는 0이어야 합니다. 모순입니다.`,
      easyEn: R`The theorem splits into two pieces: “a continuous sigmoid is discriminatory” (Lemma 1) and “networks built from a continuous discriminatory function are dense” (Lemma 5). Here we prove the second by contradiction.

The set $U$ of networks is a subspace of $C(I_n)$ (continuity), and if we assume it is not dense, Lemma 4 gives a nonzero measure whose integral against every function in $U$ is 0. A one-neuron network is also in $U$, so this measure has integral 0 against every neuron, and discrimination forces the measure to be 0. A contradiction.`,
      nodes: [
        { id: 'split', at: '**보조정리 5부터.**', t: R`보조정리 1 + 5`, en: R`Lemma 1 + Lemma 5`,
          d: R`연속 시그모이드는 판별적이므로(보조정리 1) “연속 판별 함수의 망은 조밀하다”만 보이면 됩니다.`,
          dEn: R`A continuous sigmoid is discriminatory (Lemma 1), so it suffices to show “networks of a continuous discriminatory function are dense.”` },
        { id: 'sub', at: '**부분공간.**', t: R`$U$는 $C(I_n)$의 부분공간`, en: R`$U$ is a subspace of $C(I_n)$`,
          d: R`유한합은 합·실수배에 닫혀 있고, $\sigma$의 연속성으로 각 $G$가 연속입니다.`,
          dEn: R`Finite sums are closed under sums and scalar multiples, and each $G$ is continuous because $\sigma$ is.` },
        { id: 'neg', at: '**귀류 가정.**', t: R`$\overline U\ne C(I_n)$`, en: R`$\overline U\ne C(I_n)$`,
          d: R`부정하는 것은 조밀성, 곧 닫힘이 전체라는 것입니다.`,
          dEn: R`What is negated is density, that is, that the closure is everything.` },
        { id: 'l4', at: '**보조정리 4.**', t: R`보이지 않는 측도 $\mu\ne0$`, en: R`An invisible measure $\mu\ne0$`,
          d: R`$U$의 모든 함수와의 적분이 0인 0 아닌 측도가 있습니다.`,
          dEn: R`There is a nonzero measure whose integral against every function in $U$ is 0.` },
        { id: 'one', at: '**뉴런 하나로.**', t: R`$N=1$, $\alpha_1=1$`, en: R`$N=1$, $\alpha_1=1$`,
          d: R`뉴런 하나짜리 망을 넣으면 모든 $w,\theta$에서 $\int\sigma(w^Tx+\theta)\,d\mu=0$.`,
          dEn: R`Putting in a one-neuron network gives $\int\sigma(w^Tx+\theta)\,d\mu=0$ for every $w,\theta$.` },
        { id: 'contra', at: '**모순.**', t: R`판별성 ⇒ $\mu=0$ ↯`, en: R`Discrimination ⇒ $\mu=0$ ↯`,
          d: R`$\mu=0$과 $\mu\ne0$이 부딪히므로 $U$는 조밀합니다.`,
          dEn: R`$\mu=0$ collides with $\mu\ne0$, so $U$ is dense.` },
      ],
    },
  });
})();
