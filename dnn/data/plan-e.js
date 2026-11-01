/* 증명의 길잡이 — 19단원(순환 신경망)의 긴 증명(본문 600자 이상). 형식은 plan-a.js와 같습니다:
   쉬운 요약(easy)과 단계(nodes), 각 단계의 at은 한국어 본문에서 그 단계가 시작하는 조각의 첫머리입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.plans = EM.plans || {};
(function () {
  const R = String.raw;
  Object.assign(EM.plans, {
    'ch19-twostep': {
      easy: R`두 시점짜리 RNN에서 매개변수 다섯 개의 기울기를 모두 구합니다. 요령은 하나입니다. 매개변수가 손실에 닿는 **경로**를 먼저 모두 적고, 경로마다 국소 미분을 곱한 뒤 더합니다. $V$와 $c$는 출력에만 들어가 경로가 시점마다 하나라 쉽고, $W$·$U$·$b$는 두 시점에서 쓰이는 데다 $h_1$이 다시 $h_2$로 들어가므로 경로가 셋입니다.

국소 미분은 모두 $\tanh'=1-h^2$ 하나로 정리됩니다. 마지막에 같은 식을 $\delta_t=\partial L/\partial a_t$로 묶으면, 세 항짜리 식이 “$\delta_t$ × (그 매개변수에 곱해진 것)”의 합으로 줄어 검산이 쉬워집니다.`,
      easyEn: R`We find the gradients of all five parameters of a two-step RNN. There is one trick: first write down every **path** from the parameter to the loss, multiply the local derivatives along each path, and add. $V$ and $c$ enter only the outputs, so they have one path per step and are easy; $W$, $U$, $b$ are used at both steps, and $h_1$ feeds into $h_2$ again, so they have three paths.

All the local derivatives reduce to the single fact $\tanh'=1-h^2$. At the end, bundling the same formula with $\delta_t=\partial L/\partial a_t$ shrinks the three-term formula to a sum of “$\delta_t$ × (what multiplies that parameter)”, which makes checking easy.`,
      nodes: [
        { id: 'paths', at: '**순전파와 경로.**', t: R`경로 세기`, en: R`Count the paths`,
          d: R`$V$, $c$는 $L_t$마다 경로 하나, $W$, $U$, $b$는 $L_1$로 하나, $L_2$로 둘($h_2$ 직접, $h_1$을 거쳐)입니다.`,
          dEn: R`$V$ and $c$ have one path per $L_t$; $W$, $U$, $b$ have one to $L_1$ and two to $L_2$ (directly into $h_2$, and through $h_1$).` },
        { id: 'local', at: '**국소 미분.**', t: R`국소 미분`, en: R`Local derivatives`,
          d: R`$\partial h_t/\partial a_t=1-h_t^2$, $\partial a_t/\partial W=h_{t-1}$ 등, 시간을 가로지르는 $\partial h_2/\partial h_1=(1-h_2^2)W$, 출력 쪽 $\partial L_t/\partial h_t=(Y_t-Z_t)V$.`,
          dEn: R`$\partial h_t/\partial a_t=1-h_t^2$, $\partial a_t/\partial W=h_{t-1}$ and so on, $\partial h_2/\partial h_1=(1-h_2^2)W$ across time, and $\partial L_t/\partial h_t=(Y_t-Z_t)V$ on the output side.` },
        { id: 'vc', at: '**V와 c.**', t: R`쉬운 둘: $V$, $c$`, en: R`The easy two: $V$, $c$`,
          d: R`출력에만 들어가므로 시점에 대한 합 $\sum_t(Y_t-Z_t)h_t$, $\sum_t(Y_t-Z_t)$.`,
          dEn: R`They enter only the outputs, so the sums over steps $\sum_t(Y_t-Z_t)h_t$ and $\sum_t(Y_t-Z_t)$.` },
        { id: 'w', at: '**W.**', t: R`$W$: 세 경로의 합`, en: R`$W$: sum of three paths`,
          d: R`경로마다 곱을 쓰고 더합니다. 둘째 항은 $h_1$을 고정한 직접 경로, 셋째 항이 $h_1$을 거치는 간접 경로입니다.`,
          dEn: R`Write the product along each path and add. The second term is the direct path with $h_1$ fixed, the third the indirect path through $h_1$.` },
        { id: 'ub', at: '**U와 b.**', t: R`$U$, $b$: 마지막 인수만 바꾸기`, en: R`$U$, $b$: change the last factor`,
          d: R`경로는 같고 $h_{s-1}$ 자리에 $X_s$, $1$이 들어갑니다.`,
          dEn: R`The paths are the same, with $X_s$ and $1$ in place of $h_{s-1}$.` },
        { id: 'delta', at: '**δ로 묶기.**', t: R`δ로 묶어 검산`, en: R`Bundle with δ to check`,
          d: R`$\delta_2$, $\delta_1$을 거꾸로 구하면 $\partial L/\partial W=\delta_1h_0+\delta_2h_1$처럼 세 항이 두 곱으로 줄어듭니다.`,
          dEn: R`Computing $\delta_2$ and then $\delta_1$ backward shrinks the three terms to two products, as in $\partial L/\partial W=\delta_1h_0+\delta_2h_1$.` },
      ],
    },
    'ch19-bptt': {
      easy: R`길이 $T$인 벡터 RNN 전체의 기울기를 한 번의 역방향 계산으로 얻는 점화식을 보입니다. 핵심은 $h_t$가 손실에 닿는 길이 정확히 두 갈래라는 것입니다. 바로 위의 출력 $Y_t$를 거쳐 $L_t$로 가는 길과, 다음 상태 $h_{t+1}$을 거쳐 뒤의 모든 손실로 가는 길입니다.

두 갈래의 몫을 더하면 $\mathbf g_t$의 점화식이 되고, $\tanh$의 미분을 곱해 $\boldsymbol\delta_t$로 내립니다. 마지막으로 공유된 매개변수의 기울기는 시점마다 쓰인 복사본들의 기울기를 더한 것이라는 원리로 $\sum_t\boldsymbol\delta_th_{t-1}^T$를 얻습니다.`,
      easyEn: R`We show the recursion that gives the gradient of a whole vector RNN of length $T$ in a single backward computation. The key is that $h_t$ reaches the loss along exactly two branches: through the output $Y_t$ right above it to $L_t$, and through the next state $h_{t+1}$ to every later loss.

Adding the shares of the two branches gives the recursion for $\mathbf g_t$, and multiplying by the derivative of $\tanh$ brings it down to $\boldsymbol\delta_t$. Finally, the principle that the gradient of a shared parameter is the sum of the gradients of the copies used at each step gives $\sum_t\boldsymbol\delta_th_{t-1}^T$.`,
      nodes: [
        { id: 'two', at: '**$h_t$의 두 영향.**', t: R`$h_t$의 두 갈래`, en: R`The two branches of $h_t$`,
          d: R`$Y_t$를 거쳐 $L_t$로, $a_{t+1}$을 거쳐 뒤의 손실로. 전치 야코비안을 곱해 더하면 $\mathbf g_t=V^T(Y_t-Z_t)+W^T\boldsymbol\delta_{t+1}$.`,
          dEn: R`Through $Y_t$ to $L_t$, and through $a_{t+1}$ to the later losses. Multiplying by transposed Jacobians and adding gives $\mathbf g_t=V^T(Y_t-Z_t)+W^T\boldsymbol\delta_{t+1}$.` },
        { id: 'down', at: '**$a_t$로 내리기.**', t: R`$a_t$로 내리기`, en: R`Down to $a_t$`,
          d: R`성분별 $\tanh$의 야코비안 $\diag(1-h_t^2)$를 곱해 $\boldsymbol\delta_t$를 얻고, $\boldsymbol\delta_{T+1}=\mathbf 0$에서 거꾸로 계산합니다.`,
          dEn: R`Multiply by the Jacobian $\diag(1-h_t^2)$ of the elementwise $\tanh$ to get $\boldsymbol\delta_t$, and compute backward from $\boldsymbol\delta_{T+1}=\mathbf 0$.` },
        { id: 'shared', at: '**공유된 매개변수.**', t: R`복사본의 기울기를 더하기`, en: R`Add the gradients of the copies`,
          d: R`시점 $t$의 복사본은 $a_t$에만 들어가 몫이 $\boldsymbol\delta_th_{t-1}^T$이고, 공유된 $W$의 기울기는 그 합입니다.`,
          dEn: R`The copy at step $t$ enters only $a_t$, with share $\boldsymbol\delta_th_{t-1}^T$, and the gradient of the shared $W$ is their sum.` },
        { id: 'out', at: '**V와 c.**', t: R`출력 매개변수`, en: R`Output parameters`,
          d: R`$V$, $c$는 $Y_t$에만 들어가므로 시점에 대한 합으로 바로 나옵니다.`,
          dEn: R`$V$ and $c$ enter only $Y_t$, so they come out directly as sums over steps.` },
      ],
    },
    'ch19-multicell': {
      easy: R`슬라이드 10과 13의 공식, 곧 순환 매개변수의 기울기가 “각 시점의 $\partial\mathcal L/\partial h_\ell$ × 그 시점에서 직접 쓰인 몫”의 합이라는 것을 증명합니다. 먼저 바깥 층 $f=Ah_L+b$에서 $\tilde\theta$가 $h_L$을 통해서만 들어감을 확인합니다.

본론은 $h_L$을 $\tilde\theta$로 전미분한 것을 시점별로 펼치는 일이고, 귀납법이 깔끔합니다. 한 걸음에서 $\tilde\theta$는 직접, 그리고 바로 앞 상태를 통해 들어가므로, 앞 상태에 귀납 가정을 넣으면 야코비안의 곱이 하나씩 길어집니다. 마지막으로 $q=\phi(Wh+Uu+c)$일 때 이 곱을 한 번의 역방향 점화식으로 계산하는 법을 봅니다.`,
      easyEn: R`We prove the formula of slides 10 and 13: the gradient of the recurrent parameters is the sum of “$\partial\mathcal L/\partial h_\ell$ at each step × the share used directly at that step”. First we check, at the outer layer $f=Ah_L+b$, that $\tilde\theta$ enters only through $h_L$.

The main work is unrolling the total derivative of $h_L$ with respect to $\tilde\theta$ step by step, and induction does it cleanly. At one step $\tilde\theta$ enters directly and through the previous state, so substituting the induction hypothesis for the previous state lengthens the product of Jacobians by one. Finally we see how, for $q=\phi(Wh+Uu+c)$, this product is computed by a single backward recursion.`,
      nodes: [
        { id: 'outer', at: '**바깥 층.**', t: R`바깥 층`, en: R`The outer layer`,
          d: R`$\partial f/\partial A=h_L$, $\partial f/\partial b=1$, $\partial f/\partial\tilde\theta=A\,dh_L/d\tilde\theta$.`,
          dEn: R`$\partial f/\partial A=h_L$, $\partial f/\partial b=1$, $\partial f/\partial\tilde\theta=A\,dh_L/d\tilde\theta$.` },
        { id: 'induct', at: '**펼치기 (귀납법).**', t: R`귀납법으로 펼치기`, en: R`Unroll by induction`,
          d: R`$L=1$은 바로 성립하고, 한 걸음은 직접 몫 $+$ (야코비안) × (앞 상태의 전미분)입니다.`,
          dEn: R`$L=1$ holds at once, and one step is the direct share $+$ (Jacobian) × (total derivative of the previous state).` },
        { id: 'merge', at: '여기에 귀납 가정', t: R`곱을 합치기`, en: R`Merge the products`,
          d: R`귀납 가정을 넣으면 $\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_\ell}=\frac{\partial h_L}{\partial h_\ell}$로 항들이 하나로 정리됩니다.`,
          dEn: R`Substituting the hypothesis, $\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_\ell}=\frac{\partial h_L}{\partial h_\ell}$ collects the terms into one sum.` },
        { id: 'total', at: '**합치기.**', t: R`손실까지`, en: R`Up to the loss`,
          d: R`$\frac{\partial\mathcal L}{\partial f}A\frac{\partial h_L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_\ell}$을 알아보면 슬라이드의 식입니다.`,
          dEn: R`Recognizing $\frac{\partial\mathcal L}{\partial f}A\frac{\partial h_L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_\ell}$ gives the slides' formula.` },
        { id: 'rec', at: '**점화식.**', t: R`한 번의 역방향 계산`, en: R`One backward pass`,
          d: R`$\frac{\partial h_{\ell+1}}{\partial h_\ell}=\diag(\phi'(a_{\ell+1}))W$이므로 $\delta_\ell=\delta_{\ell+1}\diag(\phi'(a_{\ell+1}))W$.`,
          dEn: R`Since $\frac{\partial h_{\ell+1}}{\partial h_\ell}=\diag(\phi'(a_{\ell+1}))W$, $\delta_\ell=\delta_{\ell+1}\diag(\phi'(a_{\ell+1}))W$.` },
      ],
    },
    'ch19-jacprod': {
      easy: R`먼 시점의 기울기 $\partial\mathcal L/\partial h_\ell$은 한 걸음 야코비안 $L-\ell$개의 곱이므로, 한 걸음의 크기를 누르면 곱 전체를 누를 수 있습니다. 한 걸음 야코비안은 $\diag(\phi'(a))W$이고, 대각행렬의 노름은 가장 큰 대각 성분이라 $\gamma$를 넘지 않습니다.

노름의 곱 부등식을 $L-\ell$번 쓰면 $(\gamma\lVert W\rVert_2)^{L-\ell}$이라는 상한이 나옵니다. 이 수가 1보다 작으면 소실은 확실하고, 폭발하려면 1보다 커야 합니다. 거꾸로는 성립하지 않는다는 점(포화)도 짚습니다.`,
      easyEn: R`The gradient at a distant step, $\partial\mathcal L/\partial h_\ell$, is a product of $L-\ell$ one-step Jacobians, so bounding the size of one step bounds the whole product. The one-step Jacobian is $\diag(\phi'(a))W$, and the norm of a diagonal matrix is its largest diagonal entry, which does not exceed $\gamma$.

Using submultiplicativity of the norm $L-\ell$ times gives the bound $(\gamma\lVert W\rVert_2)^{L-\ell}$. If this number is below 1, vanishing is certain, and for explosion it must be above 1. We also note that the converses fail (saturation).`,
      nodes: [
        { id: 'jac', at: '**한 걸음의 야코비안.**', t: R`한 걸음의 야코비안`, en: R`The one-step Jacobian`,
          d: R`$\frac{\partial h_{k+1}}{\partial h_k}=\diag(\phi'(a_{k+1}))W$.`,
          dEn: R`$\frac{\partial h_{k+1}}{\partial h_k}=\diag(\phi'(a_{k+1}))W$.` },
        { id: 'diag', at: '**대각행렬의 노름.**', t: R`대각 부분은 $\gamma$ 이하`, en: R`The diagonal part is at most $\gamma$`,
          d: R`$\lVert\diag(d)\rVert_2=\max_i\lvert d_i\rvert\le\gamma$.`,
          dEn: R`$\lVert\diag(d)\rVert_2=\max_i\lvert d_i\rvert\le\gamma$.` },
        { id: 'prod', at: '**곱 부등식.**', t: R`곱의 상한`, en: R`Bound the product`,
          d: R`$\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert$를 $L-\ell$번 써서 $(\gamma\lVert W\rVert_2)^{L-\ell}$.`,
          dEn: R`Use $\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert$ $L-\ell$ times to get $(\gamma\lVert W\rVert_2)^{L-\ell}$.` },
        { id: 'cond', at: '**두 조건.**', t: R`충분조건과 필요조건`, en: R`Sufficient and necessary`,
          d: R`$\rho<1$이면 소실(충분), 폭발하려면 $\rho>1$(필요). 포화 때문에 역은 성립하지 않습니다.`,
          dEn: R`$\rho<1$ forces vanishing (sufficient); explosion needs $\rho>1$ (necessary). Saturation makes the converses fail.` },
        { id: 'ex', at: '**스칼라 예.**', t: R`스칼라에서 $w^{L-\ell}$`, en: R`$w^{L-\ell}$ in the scalar case`,
          d: R`$0.9^{100}$과 $1.1^{100}$이 두 극단을 보여 줍니다.`,
          dEn: R`$0.9^{100}$ and $1.1^{100}$ show the two extremes.` },
      ],
    },
    'ch19-clip': {
      easy: R`잘라내기 식을 경우로 나눠 보면 슬라이드의 두 경우가 그대로 나오고, 곱해지는 수가 양수라 방향이 지켜지며 크기가 $\min(\lVert\mathbf g\rVert,v)$임을 바로 읽을 수 있습니다. 마지막으로 슬라이드처럼 max로 쓰면 무엇이 틀어지는지 확인합니다.`,
      easyEn: R`Splitting the clipping formula into cases gives exactly the two cases of the slide; since the multiplier is positive, the direction is kept, and the size $\min(\lVert\mathbf g\rVert,v)$ can be read off at once. Finally we check what goes wrong if it is written with max as on the slide.`,
      nodes: [
        { id: 'cases', at: '**경우 나눔.**', t: R`두 경우`, en: R`Two cases`,
          d: R`$\lVert\mathbf g\rVert\le v$이면 그대로, 아니면 $\frac{v}{\lVert\mathbf g\rVert}$배.`,
          dEn: R`Unchanged if $\lVert\mathbf g\rVert\le v$, otherwise scaled by $\frac{v}{\lVert\mathbf g\rVert}$.` },
        { id: 'dir', at: '**방향과 크기.**', t: R`방향과 크기`, en: R`Direction and size`,
          d: R`양수배이므로 같은 방향, 크기는 $\min(\lVert\mathbf g\rVert,v)$.`,
          dEn: R`A positive multiple, so the same direction; the size is $\min(\lVert\mathbf g\rVert,v)$.` },
        { id: 'max', at: '**max로 쓰면.**', t: R`max의 문제`, en: R`The trouble with max`,
          d: R`작은 기울기를 크기 $v$로 키우고 큰 기울기는 줄이지 못합니다.`,
          dEn: R`It enlarges small gradients to size $v$ and fails to shrink large ones.` },
      ],
    },
  });
})();
