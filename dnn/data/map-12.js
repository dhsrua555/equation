/* 논리 지도 — 12 학습률 스케줄과 배치 정규화. 앞 절반은 “처음엔 크게, 나중엔 작게”, 뒤 절반은 “층마다 표준화 + 되돌릴 자유”와
   그 효과·논쟁. 단원 첫머리의 쉬운 요약(easy), 지도(nodes·rows·edges), 각 절과 소제목(at)의 위치 표시를 함께 적습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 12,
    easy: R`
학습률은 경사하강법이 한 번에 움직이는 거리이고, 모든 최적화기에서 가장 중요한 초매개변수(hyperparameter)입니다. 그릇 바닥으로 공을 굴린다고 생각하면, 너무 크면 반대편 벽을 넘어 날아가고(폭발), 너무 작으면 하루 종일 걸리며, 적당히 크면 바닥 근처까지 빨리 가지만 벽 사이를 오가며 바닥에 닿지 못합니다.

그래서 답은 **처음엔 크게, 나중엔 작게**입니다. 시간에 따라 학습률을 줄이는 모양이 **학습률 감소 스케줄**(계단, 코사인, 선형, 역제곱근)이고, 맨 처음 큰 학습률로 손실이 폭발하지 않도록 0에서 조금씩 올리는 **워밍업**(warmup)을 붙이기도 합니다.

후반부의 **배치 정규화**(batch normalization, BN)는 각 층의 출력을 시험 점수의 표준점수처럼 바꾸는 층입니다. 미니배치에서 특성마다 평균을 빼고 표준편차로 나눈 뒤, 학습 가능한 손잡이 $\gamma,\beta$로 $y=\gamma\hat x+\beta$처럼 다시 늘리고 옮길 자유를 줍니다. 추론 때는 배치 대신 학습 중 기록한 이동평균을 써서 BN이 ‘곱하고 더하기’ 하나가 되고, 앞 층에 합쳐 추가 비용이 0이 됩니다.

BN을 쓰면 깊은 신경망이 훨씬 쉽게 학습되고, 더 큰 학습률을 쓸 수 있으며, 초기화에도 덜 민감해집니다. 그런데 왜 그런지는 아직 논쟁 중입니다. 처음에는 ‘층 입력의 분포가 흔들리는 것(**내부 공변량 이동**)을 줄여서’라고 설명했지만, 실험은 그 흔들림이 줄지 않아도 학습이 좋아짐을 보였고, 지금은 ‘손실 곡면을 매끈하게 만들어서’라는 설명이 유력합니다.`,
    easyEn: R`
The learning rate is how far gradient descent moves in one step, and it is the most important hyperparameter of every optimizer. Picture a ball rolled toward the bottom of a bowl: too large and it flies over the opposite wall (explosion), too small and it takes all day, and fairly large gets it near the bottom quickly but then it bounces between the walls and never reaches the bottom.

So the answer is **large at first, small later**. The shape in which the rate is lowered over time is a **learning rate decay schedule** (step, cosine, linear, inverse square root), and a **warmup** that raises the rate gradually from 0 is often added at the very start so that a large rate does not make the loss explode.

The second half introduces **batch normalization** (BN), a layer that turns each layer’s outputs into something like standard scores on an exam. In a minibatch it subtracts the mean of each feature and divides by its standard deviation, then gives the freedom to stretch and shift back with learnable knobs $\gamma,\beta$, as in $y=\gamma\hat x+\beta$. At test time it uses running averages recorded during training instead of the batch, so BN becomes a single multiply-and-add, which can be fused into the previous layer at zero extra cost.

With BN, deep networks train much more easily, larger learning rates can be used, and the initialization matters less. Why this happens is still debated, though. The first explanation was that BN reduces the wobbling of each layer’s input distribution (**internal covariate shift**), but experiments showed that training improves even when that wobbling does not shrink, and the explanation now favored is that BN makes the loss surface smoother.`,
    nodes: [
      { id: 'curves', role: 'q', k: '12.1', t: R`학습률과 네 학습 곡선`, en: R`Learning rate: four curves`,
        d: R`모든 최적화기의 핵심 초매개변수는 학습률입니다. 매우 높으면 폭발, 낮으면 느림, 높으면 빨리 내려가다 정체, 적당하면 좋음 — 크기 순서는 b<d<c<a입니다.`,
        dEn: R`The learning rate is the key hyperparameter of every optimizer. Very high explodes, low is slow, high drops fast and then plateaus, good is good — in increasing order b<d<c<a.` },
      { id: 'stall', role: 'lim', k: '12.1', at: '**왜 (c)는', t: R`큰 학습률은 높은 곳에서 정체`, en: R`A high rate stalls high up`,
        d: R`곡률 $\beta$인 방향에서 $\eta$가 $2/\beta$에 가까우면 매 걸음 벽을 건너뛰어 거의 줄지 않고, SGD의 잡음은 손실을 ‘잡음 바닥’ 위에 묶어 둡니다. 둘 다 $\eta$를 줄이면 풀립니다.`,
        dEn: R`Along a direction of curvature $\beta$, an $\eta$ close to $2/\beta$ jumps across the bowl at every step and barely goes down, and the noise of SGD holds the loss above a “noise floor”. Lowering $\eta$ cures both.` },
      { id: 'sched', role: 'res', k: '12.2', t: R`감소 스케줄과 워밍업`, en: R`Decay schedules and warmup`,
        d: R`계단·코사인·선형·역제곱근으로 학습률을 줄이고, 초반에는 0에서 선형으로 올리는 워밍업으로 폭발을 막습니다. 끝에서 0이 되는 스케줄은 마지막 잡음을 거의 없앱니다.`,
        dEn: R`Lower the rate in steps, along a cosine, linearly, or as an inverse square root, and prevent an early explosion with a warmup that rises linearly from 0. Schedules that end at 0 remove almost all the noise at the end.` },
      { id: 'bntrain', role: 'def', k: '12.3', t: R`BN: 특성마다 표준화`, en: R`BN: standardize each feature`,
        d: R`미니배치에서 특성마다 평균·분산을 구해 평균 0·분산 1로 맞춘 뒤 $y=\gamma\hat x+\beta$로 되돌릴 자유를 줍니다. 그래서 표현력은 그대로이고, 미분 가능해 역전파도 됩니다.`,
        dEn: R`Compute the mean and variance of each feature over the minibatch, bring it to mean 0 and variance 1, and leave the freedom to undo this with $y=\gamma\hat x+\beta$. The expressive power is unchanged, and it is differentiable, so backpropagation works.` },
      { id: 'bntest', role: 'fix', k: '12.4', t: R`추론: 이동평균으로`, en: R`Test time: running averages`,
        d: R`추론 때는 배치가 작거나 $N=1$일 수 있어, 학습 중 누적한 이동평균을 씁니다. 모든 값이 상수가 되어 BN은 채널별 아핀변환 $y=a_jx+b_j$가 됩니다.`,
        dEn: R`At test time the batch may be small or even $N=1$, so the running averages accumulated during training are used. Every value is then a constant, and BN becomes a per-channel affine map $y=a_jx+b_j$.` },
      { id: 'fuse', role: 'app', k: '12.4', at: '**앞 층과 합치기(fusing).**', t: R`앞 층에 합치기`, en: R`Fusing into the previous layer`,
        d: R`아핀변환이 된 BN을 바로 앞 완전연결층 $x=Wu+c$에 흡수하면 $W'=\diag(a)W$, $c'=\diag(a)c+b_{\text{BN}}$. 추론 비용이 0이 됩니다.`,
        dEn: R`Absorbing the now-affine BN into the fully connected layer $x=Wu+c$ just before it gives $W'=\diag(a)W$, $c'=\diag(a)c+b_{\text{BN}}$. The cost at inference becomes zero.` },
      { id: 'effects', role: 'res', k: '12.5', t: R`BN의 효과`, en: R`What BN buys`,
        d: R`깊은 신경망을 훨씬 쉽게 학습하고, 더 큰 학습률·빠른 수렴, 초기화에 덜 민감함, 미니배치 잡음의 규제 효과, 테스트 비용 0을 얻습니다.`,
        dEn: R`Deep networks become much easier to train, with larger learning rates and faster convergence, less sensitivity to initialization, a regularizing effect from minibatch noise, and zero extra cost at test time.` },
      { id: 'scale', role: 'step', k: '12.5', at: ':::key 배치 정규화의 스케일 불변성', t: R`스케일 불변성`, en: R`Scale invariance`,
        d: R`BN 앞의 가중치를 $\alpha$배 해도 출력이 같고 기울기는 $\frac1\alpha$배가 됩니다. 가중치가 커지면 유효 학습률이 저절로 작아지는 ‘브레이크’가 큰 학습률을 견디게 합니다.`,
        dEn: R`Scaling the weights before BN by $\alpha$ leaves the output unchanged and scales the gradient by $\frac1\alpha$. Larger weights automatically mean a smaller effective learning rate, a built-in brake that lets BN tolerate large rates.` },
      { id: 'ics', role: 'q', k: '12.5', at: ':::hand 수업 필기 — 공변량 이동', t: R`내부 공변량 이동(ICS)`, en: R`Internal covariate shift (ICS)`,
        d: R`공변량 이동은 $P(X)$만 바뀌고 $P(Y\mid X)$는 그대로인 상황입니다. 학습 중 앞 층이 바뀌어 층 입력의 분포가 흔들리는 것이 ICS이고, 원래 가설은 ‘BN이 ICS를 줄인다’입니다.`,
        dEn: R`Covariate shift: $P(X)$ changes while $P(Y\mid X)$ stays the same. ICS is the wobbling of a layer’s input distribution as earlier layers change during training, and the original hypothesis was that BN reduces ICS.` },
      { id: 'debate', role: 'alt', k: '12.5', at: '**이론적 정당화(슬라이드 44)**', t: R`논쟁: 매끈한 손실 곡면`, en: R`Debate: a smoother loss surface`,
        d: R`실험에서 BN은 측정된 ICS를 줄이지 않는데도 학습을 개선했습니다. 대안 설명은 BN이 손실 곡면을 매끈하게 해 최적화를 쉽게 한다는 것으로, 13단원의 $\beta$-매끄러움과 이어집니다.`,
        dEn: R`In experiments BN improved training without reducing the measured ICS. The alternative explanation is that BN smooths the loss surface and so makes optimization easier, which links to the $\beta$-smoothness of Unit 13.` },
    ],
    rows: [['curves'], ['stall'], ['sched'], ['bntrain'], ['bntest', 'effects'], ['fuse', 'scale'], [null, 'ics'], [null, 'debate']],
    edges: [
      ['curves', 'stall', R`(c)는 왜 멈추나?`, R`why does (c) stall?`],
      ['stall', 'sched', R`처음 크게, 나중 작게`, R`large first, small later`],
      ['bntrain', 'bntest', R`추론 때는?`, R`at test time?`],
      ['bntrain', 'effects', R`무엇이 좋아지나`, R`what it buys`],
      ['bntest', 'fuse', R`곱하고 더하기니까`, R`it is just affine`],
      ['effects', 'scale', R`큰 학습률의 이유`, R`why large rates work`],
      ['scale', 'ics', R`이론적 이유는?`, R`but the theory?`],
      ['ics', 'debate', R`실험으로 검증`, R`put to the test`],
    ],
  });
})();
