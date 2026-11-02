/* 논리 지도 — 17 보편 근사 정리. 오차를 세 조각으로 나눈 뒤 근사 문제를 말할 언어(측도, 노름, 조밀성)를 갖추고,
   한-바나흐와 리스 표현 정리로 보조정리 4를 만든 다음 판별성과 함께 Cybenko 정리에 닿는 흐름을 그립니다. 그리는 쪽은 core/app.js의 unitMap·secMarks입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 17,
    easy: R`
우리가 학습으로 얻은 신경망은 정말 원하는 함수와 얼마나 떨어져 있을까요? 그 거리는 세 조각입니다. 망 구조가 애초에 그 함수를 흉내 낼 수 있는지(**근사**), 유한한 자료로 고른 함수가 처음 보는 자료에도 통하는지(**일반화**), 경사하강법이 그 함수를 실제로 찾았는지(**최적화**). 이 단원은 첫째 질문에 “할 수 있다”고 답하는 **보편 근사 정리**를 증명합니다.

정리를 정확히 말하려면 말이 필요합니다. 집합의 크기를 재는 **측도**(음수도 허용하는 부호 측도까지), 두 함수의 거리를 가장 크게 벌어진 곳의 차이로 재는 **최대 노름**, 그리고 어떤 목표에든 원하는 만큼 가까운 원소가 있다는 **조밀성**입니다. 정리는 “은닉층 하나짜리 망들의 모임이 연속 함수 공간에서 조밀하다”는 말입니다.

증명은 귀류법입니다. 망들이 조밀하지 않다면, 한-바나흐 정리가 망들에는 모두 0을 내놓지만 0은 아닌 측정 장치를 주고, 리스 표현 정리가 그 장치를 0 아닌 측도에 대한 적분으로 바꿉니다(보조정리 4). 그런데 시그모이드는 **판별 함수**라서 모든 뉴런과의 적분이 0인 측도는 0뿐입니다. 모순이므로 망들은 조밀합니다.

마지막으로 정리가 말하지 않는 것을 확인합니다. 뉴런이 몇 개 필요한지, 가중치를 어떻게 찾는지, 유한한 자료로 배울 수 있는지는 이 정리의 몫이 아닙니다. 1차원에서 손으로 지어 보면 격자 방식은 차원마다 뉴런이 곱으로 늘어나는데, 이 문제를 18단원의 바론 정리가 다룹니다.`,
    easyEn: R`
How far is the network we get from training from the function we really want? The distance comes in three pieces: whether the architecture can imitate that function in the first place (**approximation**), whether a function chosen from finite data also works on data it has never seen (**generalization**), and whether gradient descent actually found that function (**optimization**). This unit proves the **universal approximation theorem**, which answers the first question with “it can.”

To state the theorem precisely we need words: a **measure** that gives sets a size (including signed measures, which allow negatives), the **max norm** that measures the distance between two functions as the difference where they are farthest apart, and **density**, which says there is an element as close as we like to any target. The theorem says “the set of one-hidden-layer networks is dense in the space of continuous functions.”

The proof is by contradiction. If the networks are not dense, the Hahn–Banach theorem gives a measuring device that returns 0 on every network but is not 0 itself, and the Riesz representation theorem turns that device into an integral against a nonzero measure (Lemma 4). But a sigmoid is a **discriminatory function**, so the only measure whose integral against every neuron is 0 is the zero measure. This is a contradiction, so the networks are dense.

Finally we check what the theorem does not say. How many neurons are needed, how to find the weights, and whether they can be learned from finite data are not its business. Building a network by hand in one dimension shows that a grid construction multiplies the neurons across dimensions — a problem that Barron’s theorem in Unit 18 takes up.`,
    nodes: [
      { id: 'err', role: 'q', k: '17.1', t: R`원하는 함수와 얼마나 떨어져 있나?`, en: R`How far from the function we want?`,
        d: R`필기 첫 쪽의 그림: 가설 클래스(상자)와 그 밖의 이상적 목표 $f^*$, 그리고 opt·gen·app 세 화살표.`,
        dEn: R`The figure on the first page of the notes: the hypothesis class (a box), the ideal target $f^*$ outside it, and the three arrows opt, gen, and app.` },
      { id: 'split', role: 'def', k: '17.1', at: ':::key 오차 분해', t: R`근사·일반화·최적화 오차`, en: R`Approximation, generalization, optimization`,
        d: R`$\mathcal R(f_{\mathrm{alg}})-\mathcal R(f^*)$를 세 항으로 나누고, 근사(이 단원), 일반화(18단원), 최적화(13–14단원)가 하나씩 맡습니다.`,
        dEn: R`Split $\mathcal R(f_{\mathrm{alg}})-\mathcal R(f^*)$ into three terms, taken on by approximation (this unit), generalization (Unit 18), and optimization (Units 13–14).` },
      { id: 'meas', role: 'def', k: '17.2', t: R`측도와 부호 측도`, en: R`Measures and signed measures`,
        d: R`$\mu(\varnothing)=0$과 가산 가법성. 부호 측도는 음수를 허용하고, $\mu=0$은 모든 보렐 집합에서 0이라는 강한 조건입니다.`,
        dEn: R`$\mu(\varnothing)=0$ and countable additivity. A signed measure allows negatives, and $\mu=0$ is the strong condition of being 0 on every Borel set.` },
      { id: 'dense', role: 'def', k: '17.3', t: R`최대 노름과 조밀성`, en: R`Max norm and density`,
        d: R`$\lVert f\rVert_\infty=\max\lvert f\rvert$로 재면 근사는 균등 근사입니다. 조밀 $\iff$ 닫힘이 전체이고, 조밀하지 않음은 진부분공간과 다릅니다.`,
        dEn: R`Measured by $\lVert f\rVert_\infty=\max\lvert f\rvert$, approximation is uniform approximation. Dense $\iff$ the closure is everything, and not dense differs from proper subspace.` },
      { id: 'disc', role: 'def', k: '17.4', at: ':::key 시그모이드와 판별 함수', t: R`판별 함수`, en: R`Discriminatory functions`,
        d: R`모든 뉴런 $\sigma(w^Tx+\theta)$와의 적분이 0인 측도는 0뿐. 연속 시그모이드는 판별적입니다(보조정리 1, 증명은 수업에서 생략).`,
        dEn: R`The only measure with integral 0 against every neuron $\sigma(w^Tx+\theta)$ is 0. Continuous sigmoids are discriminatory (Lemma 1, proof skipped in class).` },
      { id: 'hb', role: 'tool', k: '17.5', at: ':::hand 수업 필기 — 보조정리 3과 4', t: R`한-바나흐 따름정리`, en: R`The Hahn–Banach corollary`,
        d: R`조밀하지 않은 부분공간 $U$에는 $L|_U=0$이고 $L\ne0$인 유계 선형 범함수가 있습니다(보조정리 3).`,
        dEn: R`A non-dense subspace $U$ has a bounded linear functional with $L|_U=0$ and $L\ne0$ (Lemma 3).` },
      { id: 'rrt', role: 'tool', k: '17.5', at: ':::key 리스 표현 정리', t: R`리스 표현 정리`, en: R`The Riesz representation theorem`,
        d: R`$C(K)$ 위의 유계 선형 범함수는 모두 유일한 유한 부호 측도에 대한 적분 $\int f\,d\mu$입니다.`,
        dEn: R`Every bounded linear functional on $C(K)$ is an integral $\int f\,d\mu$ against a unique finite signed measure.` },
      { id: 'l4', role: 'res', k: '17.5', at: ':::key 보조정리 3·4', t: R`보조정리 4: 보이지 않는 측도`, en: R`Lemma 4: an invisible measure`,
        d: R`$U$가 조밀하지 않으면 $U$의 모든 함수와 적분이 0인 $\mu\ne0$이 있습니다. 필기에 빠진 $\mu\ne0$이 핵심입니다.`,
        dEn: R`If $U$ is not dense, some $\mu\ne0$ has integral 0 against every function in $U$. The $\mu\ne0$ missing from the notes is the key.` },
      { id: 'l5', role: 'step', k: '17.6', at: ':::hand 수업 필기 — 보조정리 5', t: R`귀류법: 보조정리 5`, en: R`Contradiction: Lemma 5`,
        d: R`$\overline U\ne C(I_n)$이라 하면 보조정리 4의 $\mu\ne0$이 뉴런 하나에도 보이지 않아, 판별성으로 $\mu=0$ — 모순.`,
        dEn: R`If $\overline U\ne C(I_n)$, the $\mu\ne0$ of Lemma 4 is invisible even to a single neuron, so discrimination gives $\mu=0$ — a contradiction.` },
      { id: 'uat', role: 'res', k: '17.6', at: ':::key 보편 근사 정리', t: R`Cybenko 정리`, en: R`Cybenko’s theorem`,
        d: R`연속 시그모이드의 은닉층 하나짜리 망은 $C(I_n)$에서 조밀: 모든 $x$에서 $\varepsilon$ 이내로 근사됩니다.`,
        dEn: R`One-hidden-layer networks of a continuous sigmoid are dense in $C(I_n)$: they approximate within $\varepsilon$ at every $x$.` },
      { id: 'stair', role: 'ex', k: '17.6', at: '**한 차원에서 직접', t: R`1차원의 계단 근사`, en: R`A staircase in one dimension`,
        d: R`뉴런 하나가 계단 하나. $f(x)=x$는 오차 $\frac1{2N}$이지만, 같은 격자는 $n$차원에서 뉴런 $N^n$개가 필요합니다.`,
        dEn: R`One neuron per step. $f(x)=x$ has error $\frac1{2N}$, but the same grid needs $N^n$ neurons in $n$ dimensions.` },
      { id: 'limits', role: 'lim', k: '17.6', at: '### 더 깊이', t: R`정리가 말하지 않는 것`, en: R`What the theorem does not say`,
        d: R`뉴런 수, 가중치를 찾는 법, 일반화, 컴팩트 집합 밖. 뉴런 수는 18단원의 바론 정리가 $C^2/N$으로 답합니다.`,
        dEn: R`The number of neurons, how to find the weights, generalization, outside compact sets. Barron’s theorem in Unit 18 answers the number of neurons with $C^2/N$.` },
    ],
    rows: [['err'], ['split'], ['meas', 'dense'], ['rrt', 'hb'], ['disc', 'l4'], ['l5'], ['uat'], ['stair', 'limits']],
    edges: [
      ['err', 'split', R`세 조각으로`, R`into three pieces`],
      ['split', 'meas', R`근사를 말하려면`, R`to state approximation`],
      ['split', 'dense', R`“가깝다”의 뜻`, R`what “close” means`],
      ['meas', 'rrt', R`범함수 = 적분`, R`functional = integral`],
      ['dense', 'hb', R`조밀하지 않으면`, R`if not dense`],
      ['rrt', 'l4', R`측도로 바꾸기`, R`into a measure`],
      ['hb', 'l4', R`$U$에서 0인 $L$`, R`an $L$ that is 0 on $U$`],
      ['disc', 'l5', R`뉴런마다 0이면`, R`0 on every neuron`],
      ['l4', 'l5', R`귀류 가정`, R`assume not dense`],
      ['l5', 'uat', R`연속 시그모이드`, R`continuous sigmoid`],
      ['uat', 'stair', R`손으로 지으면`, R`build by hand`],
      ['uat', 'limits', R`말하지 않는 것`, R`what it leaves out`],
    ],
  });
})();
