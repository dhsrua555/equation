/* 논리 지도 — 13 하강 보조정리와 경사하강법의 수렴. 단원 첫머리의 쉬운 요약(easy)과 지도(nodes·rows·edges).
   절 안의 긴 증명(5주차 필기의 (⇒) 증명, 하강 보조정리의 증명, 가변 보폭 SGD의 수렴 증명)은 소제목·필기 상자(at)에 위치 표시를 붙여 따라가게 합니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 13,
    easy: R`
경사하강법은 기울기의 반대 방향으로 조금씩 걸어 함수의 바닥을 찾는 방법입니다. 1차 테일러 근사로 보면 그 방향이 가장 가파른 내리막인 것은 분명하지만, 근사는 근사일 뿐입니다. 이 단원의 질문은 “어떤 조건에서, 한 걸음이 **반드시** 함수를 줄이는가?”입니다.

열쇠는 **β-매끄러움**(β-smoothness), 곧 기울기가 갑자기 바뀌지 않는다(곡률이 $\beta$ 이하)는 조건입니다. 이 조건이 있으면 함수는 지금 위치에서 그린 포물선 아래에 놓인다는 **하강 보조정리**(descent lemma) $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$가 성립합니다. 증명은 한 변수 함수 $g(t)$로 줄여 연쇄법칙, 적분형 테일러 공식, 헤시안의 상한 세 단계를 밟고, 마지막 단계의 헤시안 상한은 5주차 필기에서 따로 증명합니다.

이 포물선에 실제 걸음 $-\eta\nabla f$를 넣으면 학습률이 $\eta<2/\beta$일 때 한 걸음마다 반드시 내려간다는 결론이 나옵니다. 걸음들을 모두 더하면(망원급수) 기울기가 얼마나 빨리 0에 다가가는지도 알 수 있습니다. 실제 신경망의 손실은 이 가정을 만족하지 않지만, 이 분석은 “곡률이 크면 학습률을 작게” 같은 감각을 줍니다.

마지막으로 정확한 기울기 대신 평균적으로만 맞는 잡음 섞인 기울기로 걷는 **확률적 경사하강법**(SGD)으로 넓힙니다. 학습률을 고정하면 잡음 때문에 ‘잡음 바닥’에 머물지만, 걸음 수 $T$에 맞춰 학습률을 $1/\sqrt T$로 두면 기울기 크기의 제곱이 $O(1/\sqrt T)$로 0에 다가갑니다. 전역 최소가 아니라 기울기가 작은 점(정류점 근처)에 대한 보장이며, 학습률을 줄여 가야 하는 이론적 이유가 됩니다.`,
    easyEn: R`
Gradient descent finds the bottom of a function by walking, a little at a time, against the gradient. The first-order Taylor approximation makes it clear that this is the steepest way down, but an approximation is only an approximation. This unit asks: under what condition does one step **always** lower the function?

The key is **β-smoothness**: the gradient does not change abruptly (the curvature is at most $\beta$). Under this condition the **descent lemma** holds, $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$: the function lies below a parabola drawn at the current point. The proof reduces everything to a function of one variable, $g(t)$, and takes three steps (the chain rule, Taylor’s formula with integral remainder, and a bound on the Hessian); that Hessian bound is proved separately in the Week 5 notes.

Putting the actual step $-\eta\nabla f$ into this parabola shows that every step goes down for sure when the learning rate satisfies $\eta<2/\beta$. Adding up all the steps (a telescoping sum) also tells us how fast the gradient approaches 0. The losses of real neural networks do not satisfy this assumption, but the analysis gives a feel for things like “large curvature calls for a small learning rate”.

Finally, we extend this to **stochastic gradient descent** (SGD), which walks with a noisy gradient that is right only on average. With a fixed learning rate the noise keeps it at a “noise floor”, but setting the rate to $1/\sqrt T$ for $T$ steps makes the squared size of the gradient approach 0 as $O(1/\sqrt T)$. The guarantee is about a point with a small gradient (near a stationary point), not the global minimum, and it is the theoretical reason for lowering the learning rate over time.`,
    nodes: [
      { id: 'gd', role: 'q', k: '13.1', t: R`GD는 왜 내려가나?`, en: R`Why does GD go downhill?`,
        d: R`갱신 $x_{t+1}=x_t-\eta\nabla f(x_t)$의 방향을 1차 테일러 근사와 코시-슈바르츠로 정당화합니다: 가장 가파른 내리막은 $-\nabla f/\lVert\nabla f\rVert$. 그러나 근사일 뿐이라 엄밀한 보장이 필요합니다.`,
        dEn: R`The first-order Taylor approximation and Cauchy–Schwarz justify the direction of $x_{t+1}=x_t-\eta\nabla f(x_t)$: the steepest way down is $-\nabla f/\lVert\nabla f\rVert$. But it is only an approximation, so a rigorous guarantee is needed.` },
      { id: 'smooth', role: 'def', k: '13.2', t: R`β-매끄러움`, en: R`β-smoothness`,
        d: R`기울기가 $\beta$-립시츠: $\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert$. 곡률의 상한이라는 뜻이고, $C^2$이면 $-\beta I\preceq\nabla^2f\preceq\beta I$와 같습니다.`,
        dEn: R`The gradient is $\beta$-Lipschitz: $\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert$. It is an upper bound on the curvature, and for $C^2$ functions it is equivalent to $-\beta I\preceq\nabla^2f\preceq\beta I$.` },
      { id: 'hess', role: 'tool', k: '13.2', at: '### 5주차 필기: (⇒)', t: R`(⇒) 증명: $\nabla^2f\preceq\beta I$`, en: R`Proof of (⇒): $\nabla^2f\preceq\beta I$`,
        d: R`기울기의 차를 헤시안의 적분 (★)로 쓰고 $(y-x)$와 내적한 뒤, $y=x+hv$, $h\to0$으로 $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$를 얻습니다. 하강 보조정리 증명의 ③에 쓰입니다.`,
        dEn: R`Write the difference of gradients as an integral of the Hessian (★), take the inner product with $y-x$, then set $y=x+hv$ and let $h\to0$ to get $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$. This is what step ③ of the descent lemma uses.` },
      { id: 'lemma', role: 'res', k: '13.3', t: R`하강 보조정리`, en: R`The descent lemma`,
        d: R`$f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$: 함수는 각 점에서 그린 포물선(이차 상한) 아래에 있습니다. 1차 근사의 오차가 $\frac\beta2\lVert y-x\rVert^2$을 넘지 않습니다.`,
        dEn: R`$f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$: the function lies below the parabola (quadratic upper bound) drawn at each point. The error of the first-order approximation never exceeds $\frac\beta2\lVert y-x\rVert^2$.` },
      { id: 'lproof', role: 'step', k: '13.3', at: ':::hand 수업 필기 — 증명', t: R`증명: $g(t)$와 ①②③`, en: R`Proof: $g(t)$ and ①②③`,
        d: R`$g(t)=f(x+t(y-x))$로 한 변수로 줄인 뒤 ① 연쇄법칙으로 $g''$, ② 적분형 나머지의 테일러 공식, ③ 헤시안 상한으로 나머지를 $\frac\beta2\lVert y-x\rVert^2$ 이하로 누릅니다. 뒤 문단들이 각 단계의 근거입니다.`,
        dEn: R`Reduce to one variable with $g(t)=f(x+t(y-x))$, then ① get $g''$ by the chain rule, ② use Taylor’s formula with integral remainder, and ③ bound the remainder by $\frac\beta2\lVert y-x\rVert^2$ with the Hessian bound. The paragraphs after it justify each step.` },
      { id: 'decr', role: 'res', k: '13.4', t: R`한 걸음 감소: $\eta<2/\beta$`, en: R`One-step decrease: $\eta<2/\beta$`,
        d: R`보조정리에 $y=x_t-\eta\nabla f(x_t)$를 넣으면 $f(x_{t+1})\le f(x_t)-(\eta-\frac{\beta\eta^2}2)\lVert\nabla f(x_t)\rVert^2$. $0<\eta<2/\beta$이면 반드시 내려가고, $\eta=1/\beta$에서 감소량이 최대입니다.`,
        dEn: R`Putting $y=x_t-\eta\nabla f(x_t)$ into the lemma gives $f(x_{t+1})\le f(x_t)-(\eta-\frac{\beta\eta^2}2)\lVert\nabla f(x_t)\rVert^2$. For $0<\eta<2/\beta$ it always goes down, and the guaranteed decrease is largest at $\eta=1/\beta$.` },
      { id: 'rate', role: 'step', k: '13.4', at: '**수렴 속도(보충).**', t: R`망원급수로 수렴 속도`, en: R`Rate by telescoping`,
        d: R`$\eta=1/\beta$의 감소량을 $T$걸음 더하면 가운데 항이 지워져 $\min_t\lVert\nabla f(x_t)\rVert^2\le2\beta(f(x_0)-f^*)/T$. 볼록성 없이 정류점으로 가는 보장이고, 볼록이면 함수값이 $O(1/T)$로 수렴합니다.`,
        dEn: R`Summing the decrease with $\eta=1/\beta$ over $T$ steps cancels the middle terms: $\min_t\lVert\nabla f(x_t)\rVert^2\le2\beta(f(x_0)-f^*)/T$. This guarantees a stationary point without convexity; with convexity the function value converges as $O(1/T)$.` },
      { id: 'dl', role: 'lim', k: '13.5', t: R`딥러닝에선 가정이 깨짐`, en: R`Deep nets are not smooth`,
        d: R`ReLU의 꺾임과 커지는 곡률 때문에 신경망의 손실은 보통 $\beta$-매끄럽지 않습니다. 그래서 결론은 보장이 아니라 ‘곡률이 크면 학습률을 작게’ 같은 정성적 통찰입니다.`,
        dEn: R`Because of ReLU’s kinks and curvature that grows with the weights, neural network losses are usually not $\beta$-smooth. So the conclusions are not guarantees but qualitative insights such as “large curvature, small learning rate”.` },
      { id: 'sgd', role: 'step', k: '13.6', t: R`확률적 경사하강 보조정리`, en: R`The SGD lemma`,
        d: R`불편 추정 기울기로 걸으면 한 걸음 부등식에 잡음 항 $\frac L2\eta^2\E_t\lVert\tilde\nabla f\rVert^2$이 붙습니다. 고정 $\eta$로는 ‘잡음 바닥’에 머물러, 학습률을 줄여야 할 이유가 생깁니다.`,
        dEn: R`Walking with an unbiased estimate of the gradient adds a noise term $\frac L2\eta^2\E_t\lVert\tilde\nabla f\rVert^2$ to the one-step inequality. With a fixed $\eta$ it stays at a “noise floor”, which is why the learning rate must be lowered.` },
      { id: 'sgdproof', role: 'step', k: '13.6', at: '### 5주차 필기: 가변 보폭', t: R`세 가정과 한 걸음 (4)`, en: R`Setup and one step (4)`,
        d: R`$x_{t+1}=x_t-\eta_tg_t$에 ① $L$-매끄러움 ② 불편성 ③ $\E[\lVert g_t\rVert^2\mid x_t]\le G$를 가정합니다. ①에 한 걸음을 넣고 조건부 기댓값을 취하면 한 걸음 부등식 (4)가 나옵니다.`,
        dEn: R`For $x_{t+1}=x_t-\eta_tg_t$ assume ① $L$-smoothness, ② unbiasedness, ③ $\E[\lVert g_t\rVert^2\mid x_t]\le G$. Putting one step into ① and taking the conditional expectation gives the one-step inequality (4).` },
      { id: 'tower', role: 'step', k: '13.6', at: ':::hand 수업 필기 — 탑 성질과 망원급수', t: R`탑 성질과 망원급수 (6)`, en: R`Tower property, telescoping (6)`,
        d: R`③으로 잡음 항을 $G$로 누르고 탑 성질로 전체 기댓값을 취한 뒤 $t=1,\dots,T$를 더하면, 가운데 항이 지워져 식 (6) $\sum_t\eta_t\E\lVert\nabla f(x_t)\rVert^2\le f(x_1)-f_*+\frac L2G\sum_t\eta_t^2$이 됩니다.`,
        dEn: R`Bound the noise term by $G$ with ③, take full expectations with the tower property, and sum over $t=1,\dots,T$: the middle terms cancel, giving (6), $\sum_t\eta_t\E\lVert\nabla f(x_t)\rVert^2\le f(x_1)-f_*+\frac L2G\sum_t\eta_t^2$.` },
      { id: 'sgdres', role: 'res', k: '13.6', at: ':::key 가변 보폭 SGD의 수렴', t: R`SGD의 $O(1/\sqrt T)$ 수렴`, en: R`SGD converges as $O(1/\sqrt T)$`,
        d: R`(6)을 $\sum_t\eta_t$로 나누면 $\min_t\E\lVert\nabla f(x_t)\rVert^2$의 상한이 나옵니다. 고정 보폭이면 $\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$이고, $\eta=c/\sqrt T$로 두면 $O(1/\sqrt T)$입니다.`,
        dEn: R`Dividing (6) by $\sum_t\eta_t$ bounds $\min_t\E\lVert\nabla f(x_t)\rVert^2$. With a fixed step it is $\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$, and choosing $\eta=c/\sqrt T$ makes it $O(1/\sqrt T)$.` },
    ],
    rows: [['gd'], ['smooth'], ['hess', 'lemma'], ['lproof'], ['decr'], ['rate', 'dl', 'sgd'], [null, null, 'sgdproof'], [null, null, 'tower'], [null, null, 'sgdres']],
    edges: [
      ['gd', 'smooth', R`엄밀하게 하려면`, R`to make it rigorous`],
      ['smooth', 'hess', R`헤시안으로 보면`, R`via the Hessian`],
      ['smooth', 'lemma', R`포물선 상한`, R`a parabola above $f$`],
      ['hess', 'lproof', R`3단계의 근거`, R`used in step 3`],
      ['lemma', 'lproof', R`증명`, R`its proof`],
      ['lproof', 'decr', R`GD 한 걸음 대입`, R`plug in a GD step`],
      ['decr', 'rate', R`모두 더하면`, R`sum all steps`],
      ['decr', 'dl', R`신경망에선?`, R`in real nets?`],
      ['decr', 'sgd', R`잡음 섞인 기울기`, R`noisy gradient`],
      ['sgd', 'sgdproof', R`가변 보폭으로`, R`with varying steps`],
      ['sgdproof', 'tower', R`기댓값 취해 더하기`, R`expect, then sum`],
      ['tower', 'sgdres', R`$\sum_t\eta_t$로 나누기`, R`divide by $\sum_t\eta_t$`],
    ],
  });
})();
