/* 논리 지도 — 14 실전 최적화: 모멘텀과 적응형 학습률. 나쁜 조건수라는 문제에서 출발해 두 갈래의 해결책
   (모멘텀 · 적응형 학습률)이 Adam에서 만나는 흐름을 그립니다. 그리는 쪽은 core/app.js의 unitMap·secMarks입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 14,
    easy: R`
경사하강법(GD)은 기울기의 반대 방향으로 조금씩 걸어 손실의 바닥을 찾습니다. 그런데 손실이 좁고 긴 협곡처럼 한 방향은 가파르고 다른 방향은 거의 평평하면 문제가 생깁니다. 가파른 쪽에 맞춰 걸음을 줄이면 평평한 쪽으로는 거의 나아가지 못하고, 걸음을 키우면 벽을 넘어 튀어 나갑니다. 두 곡률의 비가 **조건수**(condition number)이고, 수업의 예 $f=\frac12x_1^2+\frac{100}2x_2^2$ (조건수 100)에서 GD는 40걸음 뒤에도 출발점에서 절반도 못 옵니다.

해결책은 두 갈래입니다. 첫째는 **모멘텀**(momentum)입니다. 무거운 공처럼 지난 걸음들의 속도를 이어 가면, 좌우로 번갈아 튀는 성분은 서로 상쇄되고 한 방향으로 꾸준한 성분은 쌓여 빨라집니다. **네스테로프** 모멘텀은 속도대로 먼저 가 볼 곳에서 기울기를 재어 지나침을 줄입니다.

둘째는 좌표마다 걸음의 크기를 다르게 하는 **적응형 학습률**입니다. 기울기가 늘 컸던(가파른) 좌표는 걸음을 줄이고, 늘 작았던(평평한) 좌표는 걸음을 키웁니다. **AdaGrad**는 지금까지의 기울기 제곱을 모두 더해 그 제곱근으로 나누는데, 그 합이 계속 커져 학습률이 0으로 줄어듭니다. **RMSProp**은 최근 기울기에 무게를 더 주는 지수이동평균으로 이를 고칩니다.

**Adam**은 두 갈래를 합칩니다. 방향은 기울기의 이동평균(모멘텀)으로, 크기는 기울기 제곱의 이동평균(RMSProp)으로 정하고, 두 평균이 0에서 시작해 처음에 작게 치우치는 것을 **편향 보정** $\hat m=m/(1-\beta^t)$로 바로잡습니다. 초매개변수에 덜 민감해서 실전의 기본값으로 많이 쓰입니다.`,
    easyEn: R`
Gradient descent (GD) finds the bottom of the loss by walking a little at a time against the gradient. Trouble starts when the loss is like a long, narrow canyon: steep in one direction and almost flat in another. Shrink the step to suit the steep side and you barely move along the flat side; enlarge it and you bounce over the wall. The ratio of the two curvatures is the **condition number**, and on the class example $f=\frac12x_1^2+\frac{100}2x_2^2$ (condition number 100) GD has not covered even half the distance after 40 steps.

There are two families of remedies. The first is **momentum**. Like a heavy ball, keep the velocity of the past steps: components that bounce left and right cancel each other, while a component that keeps pointing the same way piles up and speeds up. **Nesterov** momentum measures the gradient at the point the velocity is about to reach, which reduces overshooting.

The second is an **adaptive learning rate** that gives each coordinate its own step size. A coordinate whose gradients have always been large (steep) gets smaller steps; one whose gradients have been small (flat) gets larger steps. **AdaGrad** adds up all past squared gradients and divides by the square root, but that sum keeps growing, so the learning rate decays to zero. **RMSProp** fixes this with an exponential moving average that weights recent gradients more.

**Adam** combines the two families. The direction comes from a moving average of the gradients (momentum), the size from a moving average of the squared gradients (RMSProp), and because both averages start at zero and are biased low at first, a **bias correction** $\hat m=m/(1-\beta^t)$ sets them right. Being less sensitive to its hyperparameters, it is the common default in practice.`,
    nodes: [
      { id: 'cond', role: 'q', k: '14.1', t: R`방향마다 가파름이 다르면?`, en: R`Steep one way, flat the other?`,
        d: R`손실이 한 방향은 가파르고 다른 방향은 완만하면 GD는 어떻게 될까요? 헤시안 고윳값의 비, 곧 조건수 $\kappa=\lambda_{\max}/\lambda_{\min}$이 그 정도를 잽니다.`,
        dEn: R`What does GD do when the loss is steep in one direction and shallow in another? The ratio of Hessian eigenvalues, the condition number $\kappa=\lambda_{\max}/\lambda_{\min}$, measures how bad it is.` },
      { id: 'zig', role: 'lim', k: '14.1', at: '### 수업 필기의 계산', t: R`GD는 느리게 지그재그`, en: R`GD zigzags slowly`,
        d: R`발산하지 않으려면 $\alpha<0.02$인데, 그러면 완만한 $x_1$은 한 걸음에 2%도 줄지 않습니다. 가장 좋은 고정 학습률로도 축소율은 $\frac{\kappa-1}{\kappa+1}$입니다.`,
        dEn: R`To avoid divergence we need $\alpha<0.02$, and then the shallow $x_1$ shrinks by less than 2% per step. Even the best fixed learning rate only reaches the rate $\frac{\kappa-1}{\kappa+1}$.` },
      { id: 'precond', role: 'idea', k: '14.1', at: '### 더 깊이: 뉴턴법과 전처리', t: R`좌표마다 곡률로 나누기`, en: R`Divide by curvature per coordinate`,
        d: R`뉴턴법 $x\leftarrow x-H^{-1}\nabla f$는 이차함수를 한 걸음에 풀지만 신경망의 헤시안은 너무 큽니다. 대각만 쓰는 대각 전처리가 적응형 방법의 뿌리입니다.`,
        dEn: R`Newton's method $x\leftarrow x-H^{-1}\nabla f$ solves a quadratic in one step, but a neural network's Hessian is far too big. Keeping only its diagonal (diagonal preconditioning) is the root of the adaptive methods.` },
      { id: 'mom', role: 'fix', k: '14.2', t: R`모멘텀: 속도를 쌓기`, en: R`Momentum: build up velocity`,
        d: R`$v\leftarrow\rho v-\alpha\nabla f$, $x\leftarrow x+v$. 속도는 과거 기울기의 지수 가중합이라, 꾸준한 방향은 유효 학습률이 $\frac{\alpha}{1-\rho}$로 커지고 번갈아 튀는 방향은 상쇄됩니다.`,
        dEn: R`$v\leftarrow\rho v-\alpha\nabla f$, $x\leftarrow x+v$. The velocity is an exponentially weighted sum of past gradients, so in a steady direction the effective learning rate grows to $\frac{\alpha}{1-\rho}$, and a bouncing direction cancels out.` },
      { id: 'nest', role: 'alt', k: '14.2', at: '### 네스테로프 모멘텀', t: R`네스테로프: 앞을 내다보기`, en: R`Nesterov: look ahead`,
        d: R`속도대로 가면 도착할 앞 지점 $x+\rho v$에서 기울기를 잽니다. 이미 지나쳤으면 미리 되돌려, 수업 예제에서 모멘텀($-0.9$)보다 최솟점에 가까운 $-0.72$에 섭니다.`,
        dEn: R`Measure the gradient at the look-ahead point $x+\rho v$ where the velocity would land. If that point has already overshot, it pulls back early: in the class example it stops at $-0.72$, closer to the minimum than momentum's $-0.9$.` },
      { id: 'ada', role: 'fix', k: '14.3', t: R`AdaGrad: 좌표별 학습률`, en: R`AdaGrad: per-coordinate rates`,
        d: R`좌표마다 기울기 제곱을 누적해 $\sqrt{\sum g^2}$로 나눕니다. 첫걸음은 모든 좌표가 같은 거리 $\alpha$라, 가파른 방향은 감쇠되고 완만한 방향은 빨라집니다.`,
        dEn: R`Accumulate the squared gradients of each coordinate and divide by $\sqrt{\sum g^2}$. On the first step every coordinate moves the same distance $\alpha$, so steep directions are damped and flat ones sped up.` },
      { id: 'rms', role: 'fix', k: '14.3', at: '### RMSProp', t: R`RMSProp: 최근만 기억`, en: R`RMSProp: remember the recent`,
        d: R`AdaGrad는 합이 계속 커져 걸음이 $\alpha/\sqrt t$처럼 줄다가 학습이 멈춥니다. 제곱의 지수이동평균을 쓰면 기울기 크기가 일정할 때 걸음이 $\alpha$로 유지됩니다.`,
        dEn: R`In AdaGrad the sum keeps growing, so the step shrinks like $\alpha/\sqrt t$ until learning stalls. With an exponential moving average of the squares, the step stays at $\alpha$ when the gradient size is constant.` },
      { id: 'adam0', role: 'step', k: '14.4', t: R`Adam = 모멘텀 + RMSProp`, en: R`Adam = momentum + RMSProp`,
        d: R`방향은 기울기의 이동평균 $m_1$(1차 모멘트)로, 크기는 제곱의 이동평균 $m_2$(2차 모멘트)로 나눠 정합니다: $x\leftarrow x-\alpha\,m_1/(\sqrt{m_2}+\epsilon)$.`,
        dEn: R`The direction comes from the moving average of gradients $m_1$ (first moment), the size from dividing by the moving average of squares $m_2$ (second moment): $x\leftarrow x-\alpha\,m_1/(\sqrt{m_2}+\epsilon)$.` },
      { id: 'adam', role: 'res', k: '14.4', at: '### Adam (완성형', t: R`편향 보정까지 한 Adam`, en: R`Adam with bias correction`,
        d: R`0에서 시작한 평균은 $\E[m_t]=(1-\beta^t)\bar g$로 작게 치우칩니다. $1-\beta^t$로 나눠 바로잡으면 첫걸음이 좌표마다 정확히 $\alpha$입니다(보정 없이는 약 $3.16\alpha$).`,
        dEn: R`Averages started at 0 are biased low: $\E[m_t]=(1-\beta^t)\bar g$. Dividing by $1-\beta^t$ sets this right, and the first step is exactly $\alpha$ in each coordinate (about $3.16\alpha$ without it).` },
      { id: 'sum', role: 'view', k: '14.5', t: R`방향과 크기로 정리`, en: R`Sorted by direction and size`,
        d: R`모든 방법은 GD에서 나와, 과거 방향을 기억하는가(모멘텀)와 좌표마다 크기를 바꾸는가(적응형)로 갈립니다. 어느 것이든 학습률이 가장 중요한 초매개변수입니다.`,
        dEn: R`Every method grows out of GD and differs in whether it remembers past directions (momentum) and whether it scales each coordinate (adaptive). In all of them the learning rate is the most important hyperparameter.` },
    ],
    rows: [['cond'], ['zig'], ['mom', 'precond'], ['nest', 'ada'], [null, 'rms'], ['adam0'], ['adam'], ['sum']],
    edges: [
      ['cond', 'zig', R`GD로 내려가면`, R`run GD`],
      ['zig', 'mom', R`방향을 기억`, R`remember the direction`],
      ['zig', 'precond', R`곡률로 나누면?`, R`divide by curvature?`],
      ['mom', 'nest', R`앞에서 재면`, R`measure ahead`],
      ['precond', 'ada', R`곡률 대신 기울기로`, R`gradients, not curvature`],
      ['ada', 'rms', R`합이 계속 커지면?`, R`sum keeps growing?`],
      ['rms', 'adam0', R`+ 모멘텀`, R`+ momentum`],
      ['adam0', 'adam', R`첫걸음이 3배?`, R`first step 3× too big?`],
      ['adam', 'sum', R`한 표로`, R`all in one table`],
    ],
  });
})();
