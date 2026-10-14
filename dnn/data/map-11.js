/* 논리 지도 — 11 가중치 초기화. 단원 첫머리의 쉬운 요약(easy), “신호의 크기를 층마다 보존하라”는 원칙에서 Xavier·He로 가는 지도,
   그리고 각 절 머리와 소제목(at)에 붙는 위치 표시. 한국어(t·d·easy)와 영어(en·dEn·easyEn)를 함께 적습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 11,
    easy: R`
신경망 학습은 가중치를 무작위 값으로 정해 놓고 출발합니다. 이 단원의 질문은 그 첫 값을 얼마나 크게 잡아야 하느냐입니다. 신호는 층을 지날 때마다 가중치와 곱해지므로, 가중치가 조금 작으면 귓속말 전달 놀이처럼 신호가 층마다 줄어 위층에서는 거의 0이 되고, 조금 크면 신호가 부풀어 tanh가 $\pm1$에 달라붙는 **포화**(saturation)가 일어납니다. 어느 쪽이든 기울기가 사라져 학습이 멈춥니다.

해결의 원칙은 하나입니다. **층마다 신호의 크기를 그대로 보존**하도록 가중치의 분산을 고르는 것입니다. 서로 독립인 무작위 값 $D_{in}$개를 곱해 더하면 분산이 $D_{in}$배가 되므로, 가중치의 분산을 $1/D_{in}$로 두면 정확히 상쇄됩니다. 이것이 **Xavier 초기화** $\sigma^2=1/D_{in}$입니다.

ReLU는 음수를 0으로 버려 신호의 에너지(2차 모멘트)를 매 층 절반으로 만듭니다. 그래서 분산을 두 배로 키워 미리 보상한 것이 **He 초기화** $\sigma^2=2/D_{in}$이고, 수업에서는 정규분포의 적분으로 ‘정확히 절반’임을 확인했습니다.

마지막으로 크기와 별개로 지킬 것이 하나 있습니다. 모든 가중치를 같은 값으로 두면 같은 층의 뉴런들이 영원히 똑같이 움직이므로, 무작위로 **대칭을 깨야** 합니다. 이렇게 잡은 출발점에서도 학습을 더 안정시키는 장치(배치 정규화)는 다음 단원에서 봅니다.`,
    easyEn: R`
Training a neural network starts from weights set to random values. This unit asks how large those first values should be. A signal is multiplied by the weights at every layer, so if the weights are a little too small the signal shrinks layer after layer, like a whisper passed down a line, until it is almost zero at the top; if they are a little too large the signal swells and tanh sticks to $\pm1$, which is called **saturation**. Either way the gradient vanishes and learning stops.

The remedy rests on one principle: choose the variance of the weights so that **the size of the signal is preserved from layer to layer**. Multiplying $D_{in}$ independent random values by weights and adding them multiplies the variance by $D_{in}$, so a weight variance of $1/D_{in}$ cancels this exactly. That is **Xavier initialization**, $\sigma^2=1/D_{in}$.

ReLU throws away the negative values, which halves the energy of the signal (its second moment) at every layer. Doubling the variance in advance to make up for this gives **He initialization**, $\sigma^2=2/D_{in}$; in class we checked, by integrating over the normal distribution, that exactly half of it is lost.

Finally, there is one more rule that has nothing to do with the size. If every weight starts at the same value, the neurons of a layer move identically forever, so the initialization must be random to **break the symmetry**. A device that makes training more stable even from such a starting point (batch normalization) comes in the next unit.`,
    nodes: [
      { id: 'q', role: 'q', k: '11.1', t: R`초깃값은 얼마나 크게?`, en: R`How large should weights start?`,
        d: R`은닉 4096개짜리 6층 tanh 신경망에서 가중치의 표준편차만 바꿔 가며 층별 활성화를 봅니다. 출발점의 크기가 학습을 살리기도 죽이기도 합니다.`,
        dEn: R`In a 6-layer tanh network with 4096 hidden units, we change only the standard deviation of the weights and watch the activations layer by layer. The size of the starting point can make or break training.` },
      { id: 'small', role: 'lim', k: '11.1', at: '**너무 작게**', t: R`너무 작으면: 신호 소멸`, en: R`Too small: the signal dies`,
        d: R`$0.01\times$randn이면 활성화의 표준편차가 층마다 줄어 위층에서 거의 0입니다. $\partial L/\partial W=\delta z^T$의 $z\approx0$이라 기울기가 사라져 학습이 멈춥니다.`,
        dEn: R`With $0.01\times$randn the standard deviation of the activations shrinks at every layer and is almost zero at the top. In $\partial L/\partial W=\delta z^T$ we have $z\approx0$, so the gradient vanishes and learning stops.` },
      { id: 'big', role: 'lim', k: '11.1', at: '**너무 크게**', t: R`너무 크면: tanh 포화`, en: R`Too large: tanh saturates`,
        d: R`$0.05\times$randn이면 활성화가 $\pm1$에 몰려 tanh가 포화합니다. 이번에는 역방향 신호에서 $\sigma'\approx0$이 기울기를 끊어 역시 학습이 멈춥니다.`,
        dEn: R`With $0.05\times$randn the activations crowd at $\pm1$ and tanh saturates. This time $\sigma'\approx0$ cuts the backward signal, and learning stops just the same.` },
      { id: 'rule', role: 'idea', k: '11.1', at: '**왜 0.01이면 줄고', t: R`원칙: 층마다 1배`, en: R`Principle: a factor of 1 per layer`,
        d: R`입력 합의 표준편차는 대략 $\sqrt D\times$(가중치 표준편차)$\times$(입력 크기)입니다. $D=4096$에서 $0.01$이면 0.64배, $0.05$면 3.2배이고, $1/\sqrt D$이면 정확히 1배입니다.`,
        dEn: R`The standard deviation of the input sum is roughly $\sqrt D\times$(weight std)$\times$(input size). With $D=4096$, $0.01$ gives a factor of 0.64 and $0.05$ a factor of 3.2, while $1/\sqrt D$ gives exactly 1.` },
      { id: 'xavier', role: 'res', k: '11.2', t: R`Xavier: $\sigma^2=1/D_{in}$`, en: R`Xavier: $\sigma^2=1/D_{in}$`,
        d: R`독립·평균 0 가정에서 $\Var(y)=D_{in}\sigma^2v$를 유도하고, 출력 분산이 입력 분산 $v$와 같도록 $\sigma^2=1/D_{in}$로 정합니다. 입력이 평균 0이라는 가정을 씁니다.`,
        dEn: R`Under independence and zero means we derive $\Var(y)=D_{in}\sigma^2v$, and choose $\sigma^2=1/D_{in}$ so that the output variance equals the input variance $v$. It uses the assumption that the inputs have mean 0.` },
      { id: 'back', role: 'view', k: '11.2', at: '**역방향 조건의 유도.**', t: R`역방향과 Glorot의 절충`, en: R`Backward pass, Glorot’s compromise`,
        d: R`역전파의 기울기 분산을 보존하려면 $\sigma^2=1/D_{out}$입니다. 폭이 다르면 둘을 함께 맞출 수 없어 절충한 $\frac2{D_{in}+D_{out}}$이 Glorot & Bengio의 원래 식입니다.`,
        dEn: R`Preserving the variance of the backpropagated gradient needs $\sigma^2=1/D_{out}$. When the widths differ, both cannot hold, and the compromise $\frac2{D_{in}+D_{out}}$ is Glorot & Bengio’s original formula.` },
      { id: 'relu', role: 'lim', k: '11.3', t: R`ReLU에선 Xavier가 무너짐`, en: R`Xavier collapses under ReLU`,
        d: R`ReLU는 음수 절반을 0으로 잘라 2차 모멘트를 매 층 절반으로 만듭니다. 0 중심 활성화를 가정한 Xavier로는 활성화가 다시 0으로 무너집니다.`,
        dEn: R`ReLU cuts the negative half to 0 and so halves the second moment at every layer. With Xavier, which assumed a zero-centered activation, the activations collapse toward 0 again.` },
      { id: 'he', role: 'res', k: '11.3', at: ':::key He 초기화', t: R`He: $\sigma^2=2/D_{in}$`, en: R`He: $\sigma^2=2/D_{in}$`,
        d: R`$z\sim\N(0,q)$의 적분으로 $\E[h^2]=q/2$를 구하고, 2차 모멘트 보존 $\tfrac12D_{in}\sigma^2v=v$에서 $\sigma^2=2/D_{in}$을 얻습니다. 절반으로 줄 몫을 미리 2배로 보상합니다.`,
        dEn: R`Integrating over $z\sim\N(0,q)$ gives $\E[h^2]=q/2$, and preserving the second moment, $\tfrac12D_{in}\sigma^2v=v$, gives $\sigma^2=2/D_{in}$. The halving is paid back in advance by a factor of 2.` },
      { id: 'assume', role: 'check', k: '11.3', at: ':::note 가정을 정확히 하면', t: R`가정 점검: 2차 모멘트`, en: R`Exact assumptions: second moment`,
        d: R`ReLU 출력은 평균이 0이 아니므로 분산이 아니라 2차 모멘트 $\E[x^2]$를 보존해야 합니다. $\E[h^2]=\frac12\E[z^2]$에는 정규분포가 아니라 $z$의 대칭만 있으면 됩니다.`,
        dEn: R`A ReLU output does not have mean 0, so what must be preserved is the second moment $\E[x^2]$, not the variance. $\E[h^2]=\frac12\E[z^2]$ needs only that $z$ is symmetric, not that it is normal.` },
      { id: 'sym', role: 'check', k: '11.4', t: R`대칭 깨기: 왜 무작위인가`, en: R`Breaking symmetry: why random`,
        d: R`같은 값으로 시작하면 같은 층의 뉴런들이 같은 출력·기울기·갱신을 받아 영원히 같습니다(귀납법). 그래서 크기만이 아니라 무작위성도 필요합니다.`,
        dEn: R`If they start equal, the neurons of a layer get the same outputs, gradients and updates and stay equal forever (by induction). So the initialization needs randomness, not just the right size.` },
    ],
    rows: [['q'], ['small', 'big'], ['rule'], ['xavier'], ['back', 'relu'], [null, 'he'], ['assume', 'sym']],
    edges: [
      ['q', 'small', R`작게 잡으면`, R`if too small`],
      ['q', 'big', R`크게 잡으면`, R`if too large`],
      ['small', 'rule', R`약 0.64배씩`, R`about ×0.64 a layer`],
      ['big', 'rule', R`입력 합 3.2배`, R`the sum grows ×3.2`],
      ['rule', 'xavier', R`정확히 계산`, R`compute it exactly`],
      ['xavier', 'back', R`역방향에서도`, R`backward too`],
      ['xavier', 'relu', R`ReLU라면?`, R`with ReLU?`],
      ['relu', 'he', R`분산을 2배로`, R`double the variance`],
      ['he', 'assume', R`가정 점검`, R`check the assumptions`],
      ['he', 'sym', R`크기 말고 또 하나`, R`besides the size`],
    ],
  });
})();
