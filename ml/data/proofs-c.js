/* 증명 — Part B (2): 11 확률적 경사하강법, 12 SVM, 13 커널 방법
   src가 있는 항목은 김경수 교수님의 증명 노트를 따라간 것입니다. 노트에서 생략된 단계를 채우고, 바로잡을 곳은 note에 적었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 11
  { ch: 'ch11', id: 'gdLemma', title: 'GD 보조정리 (Lemma 14.1)', keys: ['GD 보조정리'], src: '강의 노트 · Lemma 14.1',
    tags: 'gradient descent lemma 14.1 telescoping polarization step size 1/sqrt T 경사하강 망원합 극화 항등식 보폭',
    stmt: R`$w^{(1)}=0$, $w^{(t+1)}=w^{(t)}-\eta v_t$이면 모든 $w^\star$에서 $\sum_{t=1}^T\langle w^{(t)}-w^\star,v_t\rangle\le\frac{\lVert w^\star\rVert^2}{2\eta}+\frac\eta2\sum_t\lVert v_t\rVert^2$. 특히 $\lVert w^\star\rVert\le B$, $\lVert v_t\rVert\le\rho$, $\eta=\frac B{\rho\sqrt T}$이면 평균이 $\frac{B\rho}{\sqrt T}$ 이하.`,
    body: R`
**1. 갱신식으로 바꾸기.** $v_t=\frac1\eta(w^{(t)}-w^{(t+1)})$이므로 $\langle w^{(t)}-w^\star,v_t\rangle=\frac1\eta\langle a,a-b\rangle$, 여기서 $a=w^{(t)}-w^\star$, $b=w^{(t+1)}-w^\star$ ($a-b=w^{(t)}-w^{(t+1)}$).

**2. 극화 항등식.** $\lVert a-b\rVert^2=\lVert a\rVert^2+\lVert b\rVert^2-2\langle a,b\rangle$에서 $2\langle a,a-b\rangle=2\lVert a\rVert^2-2\langle a,b\rangle=\lVert a\rVert^2-\lVert b\rVert^2+\lVert a-b\rVert^2$.

**3. 한 걸음의 등식.** $\lVert a-b\rVert^2=\eta^2\lVert v_t\rVert^2$이므로
$$\langle w^{(t)}-w^\star,v_t\rangle=\frac1{2\eta}\Big(\lVert w^{(t)}-w^\star\rVert^2-\lVert w^{(t+1)}-w^\star\rVert^2\Big)+\frac\eta2\lVert v_t\rVert^2.$$

**4. 망원합.** $t=1..T$로 더하면 괄호 부분은 $\lVert w^{(1)}-w^\star\rVert^2-\lVert w^{(T+1)}-w^\star\rVert^2\le\lVert w^\star\rVert^2$ ($w^{(1)}=0$, 음수 항 버림).

**5. 보폭.** 유계 가정에서 $\frac1T\sum\langle\cdot\rangle\le\frac{B^2}{2\eta T}+\frac{\eta\rho^2}2$. $\eta$로 미분해 0: $-\frac{B^2}{2\eta^2T}+\frac{\rho^2}2=0\iff\eta=\frac B{\rho\sqrt T}$. 대입하면 두 항이 각각 $\frac{B\rho}{2\sqrt T}$, 합 $\frac{B\rho}{\sqrt T}$.`,
    note: R`$\{v_t\}$는 **아무 벡터열**이어도 됩니다 — 기울기일 필요도, 결정적일 필요도 없습니다. 그래서 같은 보조정리가 GD, 부분기울기 하강, SGD(표본 경로마다), 온라인 학습(21장)에 모두 쓰입니다.` },
  { ch: 'ch11', id: 'gdConvex', title: '볼록-립시츠 함수에서 GD의 수렴', keys: ['볼록-립시츠 함수에서 GD의 수렴'],
    tags: 'gradient descent convergence convex Lipschitz average iterate Jensen B rho over sqrt T 수렴 젠센',
    stmt: R`$f$ 볼록, $\rho$-립시츠, $w^\star\in\argmin_{\lVert w\rVert\le B}f$, $\eta=\frac B{\rho\sqrt T}$이면 $f(\bar w)-f(w^\star)\le\frac{B\rho}{\sqrt T}$.`,
    body: R`
$v_t=\nabla f(w^{(t)})$ (또는 부분기울기). 립시츠라 $\lVert v_t\rVert\le\rho$.

**젠센.** $f(\bar w)=f\big(\frac1T\sum w^{(t)}\big)\le\frac1T\sum f(w^{(t)})$[[@base:ch05:5.2|젠센 부등식.]].

**1차 조건.** 볼록이므로 $f(w^\star)\ge f(w^{(t)})+\langle v_t,w^\star-w^{(t)}\rangle$, 즉 $f(w^{(t)})-f(w^\star)\le\langle w^{(t)}-w^\star,v_t\rangle$.

**합치기.** $f(\bar w)-f(w^\star)\le\frac1T\sum_t\langle w^{(t)}-w^\star,v_t\rangle\le\frac{B\rho}{\sqrt T}$ (GD 보조정리).`,
    note: R`결론은 **평균** 반복값에 대한 것입니다. 볼록-립시츠 함수에서는 마지막 반복값이 진동할 수 있어 평균이 표준 출력입니다.` },
  { ch: 'ch11', id: 'lipSubgrad', title: '립시츠 볼록함수 ⇔ 부분기울기 유계 (Lemma 14.7)', keys: ['립시츠 ⇔ 부분기울기 유계'],
    tags: 'Lipschitz subgradient bounded norm lemma 14.7 립시츠 부분기울기',
    stmt: R`열린 볼록집합 $A$ 위의 볼록함수 $f$가 $\rho$-립시츠 $\iff$ 모든 $w\in A$, $v\in\partial f(w)$에서 $\lVert v\rVert\le\rho$.`,
    body: R`
**(⇒)** $v\in\partial f(w)$, $v\ne0$. $A$가 열려 있어 작은 $\epsilon>0$에서 $u=w+\epsilon\frac v{\lVert v\rVert}\in A$. 부분기울기 부등식 $f(u)-f(w)\ge\langle v,u-w\rangle=\epsilon\lVert v\rVert$, 립시츠로 $f(u)-f(w)\le\rho\epsilon$. 그러므로 $\lVert v\rVert\le\rho$.

**(⇐)** $w,u\in A$, $v\in\partial f(w)$. $f(w)-f(u)\le\langle v,w-u\rangle\le\lVert v\rVert\lVert w-u\rVert\le\rho\lVert w-u\rVert$. $u$에서의 부분기울기로 대칭 부등식 $f(u)-f(w)\le\rho\lVert w-u\rVert$. 합쳐 $\lvert f(w)-f(u)\rvert\le\rho\lVert w-u\rVert$.`,
    note: R`(⇐)에서는 두 점 모두에 부분기울기가 있어야 하는데, 열린 볼록집합 위의 볼록함수는 모든 점에서 부분기울기를 가집니다(분리 초평면 정리).` },
  { ch: 'ch11', id: 'sgd', title: 'SGD의 수렴 (정리 14.8)', keys: ['SGD의 수렴'],
    tags: 'stochastic gradient descent convergence theorem 14.8 unbiased subgradient conditional expectation tower property SGD 수렴 불편 탑 성질',
    stmt: R`$f$ 볼록, $w^\star\in\argmin_{\lVert w\rVert\le B}f$, $\E[v_t\mid w^{(t)}]\in\partial f(w^{(t)})$, 확률 1로 $\lVert v_t\rVert\le\rho$, $\eta=\frac B{\rho\sqrt T}$이면 $\E[f(\bar w)]-f(w^\star)\le\frac{B\rho}{\sqrt T}$.`,
    body: R`
$v_{1:t}$를 처음 $t$개의 무작위 벡터라 하면 $w^{(t)}$는 $v_{1:t-1}$의 함수입니다.

**1. 젠센.** $\E[f(\bar w)]-f(w^\star)\le\frac1T\sum_t\E[f(w^{(t)})-f(w^\star)]$.

**2. 부분기울기.** $g_t:=\E[v_t\mid w^{(t)}]\in\partial f(w^{(t)})$이므로 $f(w^{(t)})-f(w^\star)\le\langle w^{(t)}-w^\star,g_t\rangle$.

**3. 탑 성질.** $w^{(t)}-w^\star$는 $w^{(t)}$가 주어지면 상수이므로
$$\E\langle w^{(t)}-w^\star,v_t\rangle=\E\big[\E[\langle w^{(t)}-w^\star,v_t\rangle\mid w^{(t)}]\big]=\E\langle w^{(t)}-w^\star,g_t\rangle.$$
(엄밀히는 $v_{1:t-1}$로 조건을 걸어도 같습니다.)

**4. GD 보조정리를 경로마다.** 모든 실현에서 $\sum_t\langle w^{(t)}-w^\star,v_t\rangle\le\frac{B^2}{2\eta}+\frac{\eta T\rho^2}2$. 기댓값을 취하고 1–3을 쓰면
$$\E[f(\bar w)]-f(w^\star)\le\frac1T\E\sum_t\langle w^{(t)}-w^\star,v_t\rangle\le\frac{B^2}{2\eta T}+\frac{\eta\rho^2}2=\frac{B\rho}{\sqrt T}.$$`,
    note: R`$v_t$와 $w^{(t)}$는 독립이 **아닙니다**(같은 과거). 필요한 것은 조건부 불편성뿐이고, 3단계가 그것을 쓰는 정확한 자리입니다.` },
  { ch: 'ch11', id: 'projection', title: '볼록집합으로의 사영은 거리를 늘리지 않는다 (Lemma 14.9)', keys: ['사영은 거리를 늘리지 않는다'],
    tags: 'projection convex set nonexpansive projected SGD lemma 14.9 사영 볼록집합',
    stmt: R`$\cH$가 닫힌 볼록집합, $v=\Pi_\cH(w)$이면 모든 $u\in\cH$에서 $\lVert w-u\rVert^2-\lVert v-u\rVert^2\ge\lVert w-v\rVert^2\ge0$.`,
    body: R`
**1. 최적 조건.** $v$는 볼록함수 $\phi(x)=\lVert x-w\rVert^2$의 $\cH$ 위 최소점입니다. $u\in\cH$, $\alpha\in(0,1]$에서 $v+\alpha(u-v)\in\cH$이므로 $\phi(v+\alpha(u-v))\ge\phi(v)$:
$$\lVert v-w\rVert^2+2\alpha\langle v-w,u-v\rangle+\alpha^2\lVert u-v\rVert^2\ge\lVert v-w\rVert^2.$$
$\alpha$로 나누고 $\alpha\to0^+$: $\langle v-w,u-v\rangle\ge0$, 즉 $\langle w-v,u-v\rangle\le0$.

**2. 전개.** $\lVert w-u\rVert^2=\lVert(w-v)+(v-u)\rVert^2=\lVert w-v\rVert^2+\lVert v-u\rVert^2+2\langle w-v,v-u\rangle$. 1에서 $\langle w-v,v-u\rangle=-\langle w-v,u-v\rangle\ge0$이므로 결론.`,
    note: R`사영 SGD에서 $w^{(t+1)}=\Pi_\cH(w^{(t)}-\eta v_t)$이면 $\lVert w^{(t+1)}-w^\star\rVert^2\le\lVert w^{(t)}-\eta v_t-w^\star\rVert^2$ ($w^\star\in\cH$). GD 보조정리의 한 걸음 등식이 부등식으로 바뀔 뿐 방향이 같아, 모든 상한이 그대로 성립합니다.` },
  { ch: 'ch11', id: 'strongFirst', title: '강볼록성의 1차 조건 (Claim 14.10)', keys: ['강볼록성의 1차 조건'], src: '강의 노트 · Claim 14.10',
    tags: 'strong convexity first order characterization subgradient claim 14.10 강볼록 1차 조건',
    stmt: R`$f$가 $\lambda$-강볼록이고 $v\in\partial f(w)$이면 모든 $u$에서 $f(u)\ge f(w)+\langle v,u-w\rangle+\frac\lambda2\lVert u-w\rVert^2$. 동치로 $\langle w-u,v\rangle\ge f(w)-f(u)+\frac\lambda2\lVert w-u\rVert^2$.`,
    body: R`
**1. 강볼록성을 선분에.** $t\in(0,1]$에서
$$f(w+t(u-w))\le(1-t)f(w)+tf(u)-\frac\lambda2t(1-t)\lVert u-w\rVert^2.$$
$f(w)$를 빼고 $t$로 나누면
$$\frac{f(w+t(u-w))-f(w)}t\le f(u)-f(w)-\frac\lambda2(1-t)\lVert u-w\rVert^2.$$

**2. 부분기울기로 좌변을 아래에서.** $z=w+t(u-w)$에 부분기울기 부등식: $f(z)\ge f(w)+t\langle v,u-w\rangle$, 즉 좌변 $\ge\langle v,u-w\rangle$.

**3. 극한.** $\langle v,u-w\rangle\le f(u)-f(w)-\frac\lambda2(1-t)\lVert u-w\rVert^2$에서 $t\to0^+$이면 첫 형태. 항을 옮기면 둘째 형태.`,
    note: R`보통의 볼록함수 부등식 $f(u)\ge f(w)+\langle v,u-w\rangle$에 이차항 $\frac\lambda2\lVert u-w\rVert^2$이 더해진 것입니다. 강볼록 SGD 분석에서 이 이차항이 매 단계 “거리 제곱 줄이기”를 도와 $\log T/T$ 속도를 만듭니다.` },
  { ch: 'ch11', id: 'sgdStrong', title: '강볼록 함수에서 SGD (정리 14.11)', keys: ['강볼록 함수에서 SGD'],
    tags: 'SGD strongly convex step size 1/(lambda t) log T over T theorem 14.11 강볼록 SGD 보폭',
    stmt: R`$f$가 $\lambda$-강볼록, $\E\lVert v_t\rVert^2\le\rho^2$, $\E[v_t\mid w^{(t)}]\in\partial f(w^{(t)})$, $\eta_t=\frac1{\lambda t}$(사영 포함 가능)이면 $\E[f(\bar w)]-f(w^\star)\le\frac{\rho^2}{2\lambda T}(1+\ln T)$.`,
    body: R`
$g_t=\E[v_t\mid w^{(t)}]$, $a_t=\E\lVert w^{(t)}-w^\star\rVert^2$.

**1. 강볼록 1차 조건.** $\langle w^{(t)}-w^\star,g_t\rangle\ge f(w^{(t)})-f(w^\star)+\frac\lambda2\lVert w^{(t)}-w^\star\rVert^2$.

**2. 한 걸음.** 사영이 거리를 늘리지 않으므로
$$\lVert w^{(t+1)}-w^\star\rVert^2\le\lVert w^{(t)}-\eta_tv_t-w^\star\rVert^2=\lVert w^{(t)}-w^\star\rVert^2-2\eta_t\langle w^{(t)}-w^\star,v_t\rangle+\eta_t^2\lVert v_t\rVert^2.$$
기댓값과 탑 성질로 $\E\langle w^{(t)}-w^\star,g_t\rangle\le\frac{a_t-a_{t+1}}{2\eta_t}+\frac{\eta_t\rho^2}2$.

**3. 합치기.** 1과 2에서
$$\E[f(w^{(t)})-f(w^\star)]\le\frac{a_t-a_{t+1}}{2\eta_t}-\frac\lambda2a_t+\frac{\eta_t\rho^2}2=\frac\lambda2\big[(t-1)a_t-ta_{t+1}\big]+\frac{\rho^2}{2\lambda t}.$$
($\frac1{2\eta_t}=\frac{\lambda t}2$.)

**4. 망원합.** $\sum_{t=1}^T[(t-1)a_t-ta_{t+1}]=0\cdot a_1-Ta_{T+1}\le0$. 그리고 $\sum_{t=1}^T\frac1t\le1+\ln T$.

**5. 젠센.** $\E[f(\bar w)]-f(w^\star)\le\frac1T\sum_t\E[f(w^{(t)})-f(w^\star)]\le\frac{\rho^2}{2\lambda T}(1+\ln T)$.`,
    note: R`핵심은 3단계에서 $-\frac\lambda2a_t$가 $\frac{a_t}{2\eta_t}$의 계수를 $\frac{\lambda(t-1)}2$로 낮춰, 합이 “$(t-1)a_t-ta_{t+1}$” 꼴의 완전한 망원합이 되는 것입니다. 보폭 $\eta_t=\frac1{\lambda t}$는 바로 이 상쇄가 일어나도록 고른 것입니다.` },
  { ch: 'ch11', id: 'sgdRisk', title: 'SGD로 참 위험을 직접 최소화 (따름정리 14.12)', keys: ['SGD로 위험을 직접 최소화'], src: '강의 노트 · Corollary 14.12',
    tags: 'SGD risk minimization unbiased subgradient convex Lipschitz bounded corollary 14.12 sample complexity 참 위험 불편 부분기울기',
    stmt: R`볼록-립시츠-유계($\rho,B$) 문제에서 매 단계 새 $z_t\sim\cD$로 $v_t\in\partial\ell(w^{(t)},z_t)$를 쓰는 SGD를 $T\ge\frac{B^2\rho^2}{\varepsilon^2}$번($\eta=\frac B{\rho\sqrt T}$) 돌리면 $\E[L_\cD(\bar w)]\le\min_{\cH}L_\cD+\varepsilon$.`,
    body: R`
**1. 불편성.** $w$를 고정하고 $z\sim\cD$, $v\in\partial\ell(w,z)$. 모든 $u$에서 $\ell(u,z)-\ell(w,z)\ge\langle u-w,v\rangle$. $z$에 대한 기댓값: $L_\cD(u)-L_\cD(w)\ge\langle u-w,\E v\rangle$. 즉 $\E v\in\partial L_\cD(w)$. SGD에서 $z_t$는 과거와 독립이므로 $\E[v_t\mid w^{(t)}]\in\partial L_\cD(w^{(t)})$.

**2. 유계.** $\ell(\cdot,z_t)$가 $\rho$-립시츠라 부분기울기 노름 $\le\rho$ (Lemma 14.7). $w^\star\in\argmin_\cH L_\cD$는 $\lVert w^\star\rVert\le B$.

**3. 적용.** SGD 수렴 정리를 $f=L_\cD$에 쓰면 $\E[L_\cD(\bar w)]-L_\cD(w^\star)\le\frac{B\rho}{\sqrt T}$. $T\ge\frac{B^2\rho^2}{\varepsilon^2}$이면 $\frac{B\rho}{\sqrt T}\le\varepsilon$. (반복값이 $\cH$ 밖으로 나갈 수 있으면 사영을 넣습니다.)`,
    note: R`예제 하나를 한 번씩 쓰므로 $T$가 곧 표본 수입니다. 볼록-립시츠-유계 문제의 표본 복잡도가 RLM(13장)과 SGD 모두에서 $O(B^2\rho^2/\varepsilon^2)$로 같다는 것이 이 장의 결론입니다.` },
  { ch: 'ch11', id: 'sgdRLM', title: 'SGD로 규제 손실 최소화 (14.5.3)', keys: ['SGD로 규제 손실 최소화'], src: '강의 노트 · 14.5.3',
    tags: 'SGD regularized loss minimization strongly convex iterate formula 2 rho bound 규제 손실 SGD 반복값',
    stmt: R`$f(w)=\frac\lambda2\lVert w\rVert^2+L_S(w)$, 손실이 볼록·$\rho$-립시츠, $\eta_t=\frac1{\lambda t}$, $w^{(1)}=0$, $g_t=\lambda w^{(t)}+v_t$ ($v_t\in\partial\ell(w^{(t)},z)$, $z\sim U(S)$)이면 $w^{(t+1)}=-\frac1{\lambda t}\sum_{i\le t}v_i$, $\lVert g_t\rVert\le2\rho$, $\E[f(\bar w)]-f(w^\star)\le\frac{2\rho^2}{\lambda T}(1+\ln T)$.`,
    body: R`
**1. 강볼록.** $\frac\lambda2\lVert w\rVert^2$은 $\lambda$-강볼록(성질 (1)에서 $\lambda/2$ 대입), $L_S$는 볼록이라 $f$는 $\lambda$-강볼록.

**2. 불편성.** $z$가 $S$에서 균등하면 $\E[v_t\mid w^{(t)}]=\frac1m\sum_iv_i^{(t)}\in\partial L_S(w^{(t)})$ (볼록함수 합의 부분미분은 부분미분의 합을 포함). 여기에 $\nabla\frac\lambda2\lVert w\rVert^2=\lambda w$를 더하면 $\E[g_t\mid w^{(t)}]\in\partial f(w^{(t)})$.

**3. 반복값의 닫힌 꼴.** $w^{(t+1)}=w^{(t)}-\frac1{\lambda t}(\lambda w^{(t)}+v_t)=\frac{t-1}tw^{(t)}-\frac1{\lambda t}v_t$. 귀납: $t=1$이면 $w^{(2)}=-\frac1\lambda v_1$. $w^{(t)}=-\frac1{\lambda(t-1)}\sum_{i<t}v_i$이면 $\frac{t-1}tw^{(t)}=-\frac1{\lambda t}\sum_{i<t}v_i$, 더하면 $w^{(t+1)}=-\frac1{\lambda t}\sum_{i\le t}v_i$.

**4. 유계.** $\lVert v_i\rVert\le\rho$ (립시츠)이므로 $t\ge2$에서 $\lVert\lambda w^{(t)}\rVert=\big\lVert\frac1{t-1}\sum_{i<t}v_i\big\rVert\le\rho$, $t=1$에서는 0. 따라서 $\lVert g_t\rVert\le2\rho$.

**5. 적용.** 강볼록 SGD 정리를 $\rho\to2\rho$로 쓰면 $\E[f(\bar w)]-f(w^\star)\le\frac{(2\rho)^2}{2\lambda T}(1+\ln T)=\frac{2\rho^2}{\lambda T}(1+\ln T)$.`,
    note: R`교재는 결론을 $\frac{4\rho^2}{\lambda T}(1+\log T)$로 적어 인수 2만큼 여유를 둡니다(여전히 참). 3단계의 닫힌 꼴은 “$\lambda w$는 지금까지 본 부분기울기의 평균의 반대”라는 뜻이고, 커널 SVM의 SGD(16장)가 계수만 저장해도 되는 이유입니다.` },
  // ───── 12
  { ch: 'ch12', id: 'distance', title: '점과 초평면 사이의 거리 (Claim 15.1)', keys: ['점과 초평면 사이의 거리'],
    tags: 'distance point hyperplane margin claim 15.1 Cauchy-Schwarz 거리 초평면 마진',
    stmt: R`$\lVert w\rVert=1$이면 $\min\{\lVert x-v\rVert:\langle w,v\rangle+b=0\}=\lvert\langle w,x\rangle+b\rvert$.`,
    body: R`
**달성.** $v=x-(\langle w,x\rangle+b)w$. $\langle w,v\rangle+b=\langle w,x\rangle-(\langle w,x\rangle+b)\lVert w\rVert^2+b=0$이라 초평면 위. $\lVert x-v\rVert=\lvert\langle w,x\rangle+b\rvert\lVert w\rVert=\lvert\langle w,x\rangle+b\rvert$.

**하한.** 초평면 위의 임의의 $u$에서 $\langle w,u\rangle=-b$이므로
$$\lvert\langle w,x\rangle+b\rvert=\lvert\langle w,x-u\rangle\rvert\le\lVert w\rVert\lVert x-u\rVert=\lVert x-u\rVert.$$`,
    note: R`$\lVert w\rVert\ne1$이면 거리는 $\frac{\lvert\langle w,x\rangle+b\rvert}{\lVert w\rVert}$. 하드 SVM의 이차계획 표현에서 마진이 $\frac1{\lVert w_0\rVert}$인 이유입니다.` },
  { ch: 'ch12', id: 'svmEquiv', title: '하드 SVM의 두 표현의 동치', keys: ['하드 SVM의 두 표현'], src: '강의 노트 · Eq. (15.1)',
    tags: 'hard SVM equivalence formulations absolute value signed margin separable Eq 15.1 하드 SVM 동치',
    stmt: R`분리 가능한 자료에서 (A) $\max_{\lVert w\rVert=1}\min_i\lvert\langle w,x_i\rangle+b\rvert$ s.t. $y_i(\langle w,x_i\rangle+b)>0$과 (B) $\max_{\lVert w\rVert=1}\min_iy_i(\langle w,x_i\rangle+b)$는 최적값과 최적해 집합이 같다.`,
    body: R`
$G=\{(w,b):\lVert w\rVert=1,\ y_i(\langle w,x_i\rangle+b)>0\ \forall i\}$. 분리 가능하고 분리하는 $w$를 정규화할 수 있으므로 $G\ne\emptyset$.

**1.** (A)는 정의상 $G$ 위에서 $\min_i\lvert\langle w,x_i\rangle+b\rvert$를 최대화하는 문제.

**2. $G$ 위에서 항별 등식.** $(w,b)\in G$, 임의의 $i$: $y_i=1$이면 $\langle w,x_i\rangle+b>0$이라 $\lvert\cdot\rvert=\langle w,x_i\rangle+b=y_i(\cdot)$. $y_i=-1$이면 $-(\langle w,x_i\rangle+b)>0$이라 $\lvert\cdot\rvert=-(\cdot)=y_i(\cdot)$. 최솟값도 같음.

**3. (B)의 최적해는 $G$ 안.** $\gamma(w,b)=\min_iy_i(\langle w,x_i\rangle+b)$. $(\tilde w,\tilde b)\in G$에서 $\gamma>0$이므로 (B)의 최적값 $>0$. 최적해 $(w,b)$에서 $\min_iy_i(\cdot)>0$ — 모든 항이 양수라 $(w,b)\in G$. 또 $G$ 밖의 점은 $\gamma\le0$이라 최적일 수 없습니다.

**4. 결론.** (B)는 사실상 $G$ 위의 최적화이고, $G$ 위에서 목적함수가 (A)와 같으므로 두 문제의 최적값과 최적해가 같습니다.`,
    note: R`절댓값(기하학적 거리)과 부호 곱(분류가 맞는지까지 반영)의 차이는 **틀린 점**에서만 드러납니다. 분리 가능하면 최적해가 틀린 점을 만들지 않으므로 차이가 사라집니다.` },
  { ch: 'ch12', id: 'svmQP', title: '하드 SVM의 이차계획 표현 (Lemma 15.2)', keys: ['하드 SVM의 이차계획 표현'],
    tags: 'hard SVM quadratic program scaling margin 1 over norm lemma 15.2 이차계획 척도',
    stmt: R`$(w_0,b_0)=\argmin\lVert w\rVert^2$ s.t. $y_i(\langle w,x_i\rangle+b)\ge1$이면 $(\hat w,\hat b)=(w_0,b_0)/\lVert w_0\rVert$는 (B)의 최적해이고 마진은 $1/\lVert w_0\rVert$.`,
    body: R`
(B)의 최적해를 $(w^\ast,b^\ast)$, 마진 $\gamma^\ast=\min_iy_i(\langle w^\ast,x_i\rangle+b^\ast)>0$이라 합시다.

**1. $\lVert w_0\rVert\le1/\gamma^\ast$.** $(w^\ast/\gamma^\ast,b^\ast/\gamma^\ast)$는 모든 $i$에서 $y_i(\cdot)\ge1$이라 이차계획의 실현가능해이고 노름은 $1/\gamma^\ast$. $w_0$는 최소 노름이므로 $\lVert w_0\rVert\le1/\gamma^\ast$.

**2. $(\hat w,\hat b)$의 마진.** $\lVert\hat w\rVert=1$이고 $y_i(\langle\hat w,x_i\rangle+\hat b)=\frac{y_i(\langle w_0,x_i\rangle+b_0)}{\lVert w_0\rVert}\ge\frac1{\lVert w_0\rVert}\ge\gamma^\ast$.

**3.** $(\hat w,\hat b)$는 (B)의 실현가능해이면서 목적값이 최적값 $\gamma^\ast$ 이상이므로 최적해이고, 마진은 정확히 $\gamma^\ast=1/\lVert w_0\rVert$.`,
    note: R`“$\lVert w\rVert=1$ 고정, 마진 최대화”와 “마진 1 고정, 노름 최소화”는 척도 불변성으로 같은 문제입니다. 뒤의 것은 볼록 이차계획이라 효율적으로 풀립니다.` },
  { ch: 'ch12', id: 'softHinge', title: '소프트 SVM은 힌지 손실의 RLM이다', keys: ['소프트 SVM = 힌지 손실 + 규제'],
    tags: 'soft SVM slack variables hinge loss regularized loss minimization equivalence 소프트 SVM 여유 변수 힌지',
    stmt: R`$\min_{w,b,\xi}\lambda\lVert w\rVert^2+\frac1m\sum\xi_i$ s.t. $y_i(\langle w,x_i\rangle+b)\ge1-\xi_i$, $\xi_i\ge0$은 $\min_{w,b}\lambda\lVert w\rVert^2+L^{\mathrm{hinge}}_S((w,b))$와 최적값·최적 $(w,b)$가 같다.`,
    body: R`
$(w,b)$를 고정하면 $\xi$에 대한 문제는 좌표별로 분리됩니다: $\xi_i\ge0$, $\xi_i\ge1-y_i(\langle w,x_i\rangle+b)$ 아래에서 $\xi_i$를 최소로. 두 하한의 최댓값이 최적이므로 $\xi_i^\ast=\max\{0,1-y_i(\langle w,x_i\rangle+b)\}$. 따라서
$$\min_\xi\Big(\lambda\lVert w\rVert^2+\frac1m\sum_i\xi_i\Big)=\lambda\lVert w\rVert^2+L^{\mathrm{hinge}}_S((w,b)).$$
$\min_{w,b,\xi}=\min_{w,b}\min_\xi$이므로 두 문제의 최적값이 같고, 최적 $(w,b)$도 같습니다.`,
    note: R`이 동치 덕분에 소프트 SVM은 “규제 + $\lVert x\rVert$-립시츠 볼록 손실”이 되어 13장 안정성 분석과 14장 SGD가 그대로 적용됩니다.` },
  { ch: 'ch12', id: 'weakDuality', title: '약한 쌍대성: min max ≥ max min', keys: ['약한 쌍대성'], src: '강의 노트 · Exercise 15.4',
    tags: 'weak duality minimax inequality exercise 15.4 약한 쌍대성 최소최대',
    stmt: R`집합 $\cX,\cY$와 $f:\cX\times\cY\to\mathbb R$ (관련 최대·최소가 존재)에 대해 $\min_x\max_yf(x,y)\ge\max_y\min_xf(x,y)$.`,
    body: R`
$g(x)=\max_yf(x,y)$, $h(y)=\min_xf(x,y)$.

**1.** 임의의 $x,y$에서 $h(y)\le f(x,y)\le g(x)$ (최소는 모든 원소 이하, 최대는 모든 원소 이상).

**2.** $y$를 고정하면 $h(y)$는 $\{g(x):x\in\cX\}$의 하계이므로 $h(y)\le\min_xg(x)$.

**3.** 이것이 모든 $y$에서 성립하므로 $\max_yh(y)\le\min_xg(x)$.

예: $\cX=\cY=\{-1,1\}$, $f(x,y)=xy$이면 $\min_x\max_y xy=1$, $\max_y\min_x xy=-1$ — 등호가 성립하지 않을 수 있습니다.`,
    note: R`직관: 나중에 고르는 쪽이 유리합니다. min max에서는 $y$가 $x$를 보고 고르고, max min에서는 $x$가 $y$를 보고 고릅니다. 볼록–오목이고 적당한 조건(슬레이터 등)이 있으면 등호가 성립합니다 — 강한 쌍대성.` },
  { ch: 'ch12', id: 'svmDual', title: '하드·소프트 SVM의 쌍대 문제', keys: ['SVM의 쌍대 문제'], src: '강의 노트 · 15장 보충(볼록 최적화)',
    tags: 'SVM dual problem Lagrangian KKT box constraint strong duality Slater 쌍대 문제 라그랑지안 상자 제약',
    stmt: R`하드 SVM $\min\frac12\lVert w\rVert^2$ s.t. $y_i\langle w,x_i\rangle\ge1$의 쌍대는 $\max_{\alpha\ge0}\sum\alpha_i-\frac12\lVert\sum\alpha_iy_ix_i\rVert^2$ ($w=\sum\alpha_iy_ix_i$). 소프트 SVM $\min\lambda\lVert w\rVert^2+\frac1m\sum\xi_i$의 쌍대는 $\max_{0\le\alpha_i\le1/m}\sum\alpha_i-\frac1{4\lambda}\lVert\sum\alpha_iy_ix_i\rVert^2$ ($w=\frac1{2\lambda}\sum\alpha_iy_ix_i$).`,
    body: R`
**하드.** $\mathcal L(w,\alpha)=\frac12\lVert w\rVert^2+\sum_i\alpha_i(1-y_i\langle w,x_i\rangle)$. $\max_{\alpha\ge0}\mathcal L(w,\alpha)$는 제약을 만족하면 $\frac12\lVert w\rVert^2$(최대는 $\alpha=0$), 어기면 $+\infty$. 원문제 $=\min_w\max_{\alpha\ge0}\mathcal L$. 목적이 볼록, 제약이 아핀이고 실현가능하므로 강한 쌍대성이 성립해 $=\max_{\alpha\ge0}\min_w\mathcal L$. 안쪽은 $w$의 강볼록 이차식: $\nabla_w\mathcal L=w-\sum\alpha_iy_ix_i=0$. 대입:
$$\tfrac12\Big\lVert\sum_i\alpha_iy_ix_i\Big\rVert^2+\sum\alpha_i-\Big\lVert\sum_i\alpha_iy_ix_i\Big\rVert^2=\sum\alpha_i-\tfrac12\sum_{i,j}\alpha_i\alpha_jy_iy_j\langle x_i,x_j\rangle.$$

**소프트.** 승수 $\alpha_i\ge0$ (마진 제약), $\mu_i\ge0$ ($\xi_i\ge0$):
$$\mathcal L=\lambda\lVert w\rVert^2+\frac1m\sum\xi_i+\sum\alpha_i(1-\xi_i-y_i\langle w,x_i\rangle)-\sum\mu_i\xi_i.$$
정류: $\nabla_w=2\lambda w-\sum\alpha_iy_ix_i=0\Rightarrow w=\frac1{2\lambda}\sum\alpha_iy_ix_i$; $\partial_{\xi_i}=\frac1m-\alpha_i-\mu_i=0$. $\mu_i\ge0$이라 $\alpha_i\le\frac1m$, 그리고 $\xi$ 항은 사라집니다. 대입하면 $\lambda\lVert w\rVert^2-2\lambda\lVert w\rVert^2+\sum\alpha_i=\sum\alpha_i-\lambda\lVert w\rVert^2=\sum\alpha_i-\frac1{4\lambda}\lVert\sum\alpha_iy_ix_i\rVert^2$.`,
    note: R`제약이 아핀이면 강한 쌍대성(과 KKT의 필요성)이 슬레이터 조건 없이도 성립합니다(선형 제약 자격). 강의 노트는 일반 볼록 제약에서 프리츠 존 조건 → 슬레이터 아래 KKT → 강한 쌍대성의 순서로 증명했습니다. 쌍대 문제가 $x_i$를 **내적으로만** 쓰는 것이 커널 방법의 출발점입니다.` },
  { ch: 'ch12', id: 'supportVec', title: '하드 SVM의 해는 서포트 벡터의 결합이다 (정리 15.8)', keys: ['서포트 벡터'],
    tags: 'support vectors KKT complementary slackness theorem 15.8 서포트 벡터 상보 여유',
    stmt: R`동차 하드 SVM의 해 $w_0$와 $I=\{i:y_i\langle w_0,x_i\rangle=1\}$에 대해 $w_0=\sum_{i\in I}\alpha_iy_ix_i$ ($\alpha_i\ge0$).`,
    body: R`
문제 $\min\frac12\lVert w\rVert^2$ s.t. $g_i(w)=1-y_i\langle w,x_i\rangle\le0$은 볼록 목적과 아핀 제약이므로 최적해 $w_0$에서 KKT 조건이 성립합니다: $\alpha\ge0$이 있어
- 정류: $w_0-\sum_i\alpha_iy_ix_i=0$,
- 상보 여유: $\alpha_i(1-y_i\langle w_0,x_i\rangle)=0$.

상보 여유에서 $y_i\langle w_0,x_i\rangle>1$인 $i$는 $\alpha_i=0$. 제약이 실현가능해이므로 나머지는 $y_i\langle w_0,x_i\rangle=1$, 즉 $i\in I$. 정류 조건에서 합이 $I$ 위로만 남습니다. ($y_i=\pm1$이므로 교재처럼 $\alpha_iy_i$를 하나의 계수로 묶어 $w_0=\sum_{i\in I}\tilde\alpha_ix_i$로 써도 같습니다.)`,
    note: R`서포트 벡터가 아닌 점을 지우거나 마진 밖에서 움직여도 KKT 조건이 그대로 성립하므로 해가 변하지 않습니다. 서포트 벡터의 수가 적으면 “압축”으로 일반화 상한을 얻을 수도 있습니다(교재 30장).` },
  // ───── 13
  { ch: 'ch13', id: 'representer', title: '표현자 정리', keys: ['표현자 정리'], src: '강의 노트 · 16장 보충',
    tags: 'representer theorem orthogonal decomposition Pythagoras kernel trick feature space 표현자 정리 직교 분해',
    stmt: R`$f:\mathbb R^m\to\mathbb R$ 임의, $R:\mathbb R_+\to\mathbb R$ 비감소이면 $\min_{w\in\mathcal H}f(\langle w,\psi(x_1)\rangle,\dots,\langle w,\psi(x_m)\rangle)+R(\lVert w\rVert)$에 (최적해가 있다면) $w=\sum\alpha_i\psi(x_i)$ 꼴의 최적해가 있다.`,
    body: R`
**1. 직교 분해.** $V=\operatorname{span}\{\psi(x_1),\dots,\psi(x_m)\}$은 유한차원 부분공간이라 닫혀 있고, 힐베르트 공간의 사영 정리로 모든 $w$는 $w=w_\parallel+w_\perp$ ($w_\parallel\in V$, $w_\perp\perp V$)로 유일하게 분해되며 $\lVert w\rVert^2=\lVert w_\parallel\rVert^2+\lVert w_\perp\rVert^2$.

**2. 첫 항 불변.** $\psi(x_i)\in V$이므로 $\langle w,\psi(x_i)\rangle=\langle w_\parallel,\psi(x_i)\rangle+\langle w_\perp,\psi(x_i)\rangle=\langle w_\parallel,\psi(x_i)\rangle$.

**3. 둘째 항 감소.** $\lVert w_\parallel\rVert\le\lVert w\rVert$, $R$ 비감소 ⇒ $R(\lVert w_\parallel\rVert)\le R(\lVert w\rVert)$.

**4.** 따라서 목적값$(w_\parallel)\le$ 목적값$(w)$. 최적해 $w^\ast$에 적용하면 $w^\ast_\parallel$도 최적해이고 $V$에 속하므로 $\sum\alpha_i\psi(x_i)$ 꼴.`,
    note: R`$R$이 **순증가**이면 $w_\perp\ne0$인 해는 엄격히 나빠지므로, 모든 최적해가 $V$ 안에 있습니다. $R$의 단조성이 빠지면(예: $\lVert w\rVert$가 클수록 벌점이 작아지는 규제) 결론이 틀릴 수 있습니다.` },
  { ch: 'ch13', id: 'kernelFeatures', title: '다항식·가우시안 커널의 특징', keys: ['대표적인 커널'],
    tags: 'polynomial kernel Gaussian RBF kernel feature map infinite dimensional tensor 다항식 커널 가우시안 커널 특징 사상',
    stmt: R`$(1+\langle x,x'\rangle)^k=\langle\psi(x),\psi(x')\rangle$인 유한차원 $\psi$가 있고, 1차원 가우시안 커널 $e^{-(x-x')^2/2}$는 $\psi(x)_n=\frac{x^n}{\sqrt{n!}}e^{-x^2/2}$ ($n\ge0$)의 내적이다.`,
    body: R`
**다항식.** 이항정리로 $(1+\langle x,x'\rangle)^k=\sum_{j=0}^k\binom kj\langle x,x'\rangle^j$. 그리고
$$\langle x,x'\rangle^j=\Big(\sum_ix_ix'_i\Big)^j=\sum_{i_1,\dots,i_j}(x_{i_1}\cdots x_{i_j})(x'_{i_1}\cdots x'_{i_j})=\langle x^{\otimes j},x'^{\otimes j}\rangle.$$
$\psi(x)=\big(\sqrt{\binom kj}\,x^{\otimes j}\big)_{j=0}^k$로 두면 $\langle\psi(x),\psi(x')\rangle=\sum_j\binom kj\langle x,x'\rangle^j$. 성분은 차수 $\le k$인 단항식들입니다.

**가우시안.** $e^{-(x-x')^2/2}=e^{-x^2/2}e^{-x'^2/2}e^{xx'}$이고 $e^{xx'}=\sum_{n\ge0}\frac{(xx')^n}{n!}$(모든 실수에서 절대수렴)이므로
$$e^{-(x-x')^2/2}=\sum_{n\ge0}\Big(\frac{x^n}{\sqrt{n!}}e^{-x^2/2}\Big)\Big(\frac{x'^n}{\sqrt{n!}}e^{-x'^2/2}\Big)=\langle\psi(x),\psi(x')\rangle_{\ell_2}.$$
$\sum_n\psi(x)_n^2=e^{-x^2}e^{x^2}=1<\infty$라 $\psi(x)\in\ell_2$.`,
    note: R`다항식 커널은 계산이 $O(n)$인데 특징은 $\binom{n+k}k$개, 가우시안은 특징이 무한개입니다. 그래서 $\psi$를 쓰지 않고 $K$만 쓰는 것이 필수입니다.` },
  { ch: 'ch13', id: 'kernelRules', title: '커널의 닫힘 규칙과 슈어 곱 정리', keys: ['커널을 만드는 규칙'], src: '강의 노트 · DSML 6장 보충',
    tags: 'kernel closure rules Schur product theorem Hadamard PSD power series 커널 닫힘 슈어 곱 아다마르',
    stmt: R`커널 $K_1,K_2$에 대해 $aK_1$ ($a\ge0$), $K_1+K_2$, $K_1K_2$, $K_1(\phi(x),\phi(x'))$, $\sum_na_nK_1^n$ ($a_n\ge0$, 수렴)은 커널이다.`,
    body: R`
판정 정리에 따라 그람 행렬의 대칭·양의 준정부호성을 보이면 됩니다.

- $aK_1$, $K_1+K_2$: $c^\top(aG_1)c=a\,c^\top G_1c\ge0$, $c^\top(G_1+G_2)c\ge0$.
- **곱 (슈어 곱 정리).** 곱의 그람 행렬은 아다마르 곱 $G_1\circ G_2$. $G_2=\sum_k\lambda_ku_ku_k^\top$ ($\lambda_k\ge0$)로 스펙트럼 분해하면 $(G_1\circ G_2)_{ij}=\sum_k\lambda_k(u_k)_i(G_1)_{ij}(u_k)_j$이라
$$c^\top(G_1\circ G_2)c=\sum_k\lambda_k(c\circ u_k)^\top G_1(c\circ u_k)\ge0.$$
- 합성: $x_i$ 대신 $\phi(x_i)$로 만든 그람 행렬이므로 그대로 양의 준정부호.
- 거듭제곱급수: $K_1^n$은 곱 규칙의 반복, 음이 아닌 계수의 유한합은 커널, 극한에서 $c^\top Gc\ge0$은 보존됩니다.`,
    note: R`예: $e^{\langle x,x'\rangle/\sigma}=\sum_n\frac{\langle x,x'\rangle^n}{\sigma^nn!}$은 커널. 여기에 $f(x)f(x')$ ($f(x)=e^{-\lVert x\rVert^2/2\sigma}$, 특징 하나짜리 커널)를 곱하면 $e^{-\lVert x-x'\rVert^2/2\sigma}$ — 가우시안 커널이 커널임이 규칙만으로 나옵니다.` },
  { ch: 'ch13', id: 'mercer', title: '커널 ⇔ 모든 그람 행렬이 양의 준정부호 (Lemma 16.2)', keys: ['커널의 특징 (Lemma 16.2)'], src: '강의 노트 · Lemma 16.2',
    tags: 'kernel characterization positive semidefinite Gram matrix RKHS construction Moore-Aronszajn reproducing property 커널 판정 재생 커널 힐베르트 공간',
    stmt: R`대칭 $K$가 어떤 힐베르트 공간의 내적 $\langle\psi(x),\psi(x')\rangle$일 필요충분조건은 모든 유한 점 집합의 그람 행렬이 양의 준정부호인 것이다.`,
    body: R`
**필요.** $c^\top Gc=\lVert\sum_ic_i\psi(x_i)\rVert^2\ge0$.

**충분 (공간을 만든다).**
1. $F_0=\{f=\sum_{i=1}^r\alpha_iK(\cdot,x_i)\}$ — 유한 결합으로 이루어진 함수들의 벡터공간.
2. $f=\sum_i\alpha_iK(\cdot,x_i)$, $g=\sum_j\beta_jK(\cdot,x'_j)$에 대해 $\langle f,g\rangle_0=\sum_{i,j}\alpha_i\beta_jK(x_i,x'_j)$. 이 값은 $=\sum_j\beta_jf(x'_j)=\sum_i\alpha_ig(x_i)$라 **표현 방식과 무관**합니다(함수 $f$, $g$의 값만으로 정해짐). 쌍선형·대칭이고, 가정으로 $\langle f,f\rangle_0\ge0$.
3. **재생 성질.** $\langle f,K(\cdot,x)\rangle_0=f(x)$.
4. **양의 정부호.** 양의 준정부호 쌍선형형식에도 코시–슈바르츠가 성립하므로 $\lvert f(x)\rvert=\lvert\langle f,K(\cdot,x)\rangle_0\rvert\le\sqrt{\langle f,f\rangle_0K(x,x)}$. 따라서 $\langle f,f\rangle_0=0$이면 $f\equiv0$ — $\langle\cdot,\cdot\rangle_0$은 내적입니다.
5. 완비화하면 힐베르트 공간 $\mathcal H$. $\psi(x)=K(\cdot,x)$로 두면 $\langle\psi(x),\psi(x')\rangle=K(x,x')$.`,
    note: R`강의 노트는 4단계 대신 “노름 0인 원소들을 같게 보는 몫공간”을 만들었습니다. $F_0$의 원소를 함수 자체로 보면 재생 성질 때문에 노름 0인 원소가 0 함수뿐이라 몫을 취할 필요가 없다는 점이 위 판본의 차이입니다. 만들어진 $\mathcal H$가 $K$의 재생 커널 힐베르트 공간(RKHS)입니다.` },
  { ch: 'ch13', id: 'kernelSGD', title: '커널 SVM의 SGD = 특징 공간 SGD', keys: ['커널 SGD와 특징 공간 SGD의 동치'], src: '강의 노트 · 16장 보충',
    tags: 'kernel SGD soft SVM equivalence coefficients induction feature space 커널 SGD 동치 귀납법',
    stmt: R`커널 소프트 SVM의 SGD에서 모든 $t$에 대해 $\theta^{(t)}=\sum_j\beta^{(t)}_j\psi(x_j)$, $w^{(t)}=\sum_j\alpha^{(t)}_j\psi(x_j)$이고, 출력이 특징 공간 SGD의 출력과 같다.`,
    body: R`
두 알고리즘이 같은 난수($i_t$의 선택)를 쓴다고 하고 $t$에 대한 귀납법.

**기저.** $\theta^{(1)}=0=\sum_j0\cdot\psi(x_j)$, $\beta^{(1)}=0$.

**단계.** $\theta^{(t)}=\sum_j\beta^{(t)}_j\psi(x_j)$라 하면 $w^{(t)}=\frac1{\lambda t}\theta^{(t)}=\sum_j\alpha^{(t)}_j\psi(x_j)$ ($\alpha^{(t)}=\frac1{\lambda t}\beta^{(t)}$). 뽑힌 $i$에 대해
$$y_i\langle w^{(t)},\psi(x_i)\rangle=y_i\sum_j\alpha^{(t)}_j\langle\psi(x_j),\psi(x_i)\rangle=y_i\sum_j\alpha^{(t)}_jK(x_j,x_i),$$
그래서 두 알고리즘의 **마진 판정이 같습니다**. 판정이 참이면 특징 공간은 $\theta^{(t+1)}=\theta^{(t)}+y_i\psi(x_i)=\sum_j\beta^{(t)}_j\psi(x_j)+y_i\psi(x_i)$, 커널판은 $\beta^{(t+1)}_i=\beta^{(t)}_i+y_i$ — 같은 벡터. 거짓이면 둘 다 그대로.

**출력.** 모든 $t$에서 $w^{(t)}$가 같으므로 평균 $\bar w=\sum_j\bar\alpha_j\psi(x_j)$도 같습니다.`,
    note: R`커널 알고리즘은 근사가 아니라 **좌표만 바꾼 같은 알고리즘**입니다. 그래서 특징 공간 SGD의 수렴 상한(14.5.3)이 커널판에도 그대로 성립합니다.` },
  { ch: 'ch13', id: 'kernelRidge', title: '커널 릿지 회귀의 해', keys: ['커널 릿지 회귀의 해'], src: '강의 노트 · DSML 6장 보충',
    tags: 'kernel ridge regression normal equations Gram matrix representer 커널 릿지 정규방정식 그람 행렬',
    stmt: R`$J(\alpha)=\frac1n\lVert y-K\alpha\rVert^2+\lambda\alpha^\top K\alpha$ ($K\succeq0$, $\lambda>0$)의 최소점으로 $\alpha^\ast=(K+n\lambda I)^{-1}y$를 쓸 수 있고, 예측 $\hat f(x)=k_x^\top\alpha^\ast$는 최소점의 선택과 무관하다.`,
    body: R`
**1. 볼록.** 헤시안 $\frac2nK^\top K+2\lambda K=\frac2nK^2+2\lambda K\succeq0$ ($K\succeq0$ 대칭).

**2. 기울기.** $\nabla J=-\frac2nK(y-K\alpha)+2\lambda K\alpha=\frac2nK\big((K+n\lambda I)\alpha-y\big)$.

**3. 해.** $K+n\lambda I\succ0$이라 가역이고, $\alpha^\ast=(K+n\lambda I)^{-1}y$에서 괄호가 0이라 $\nabla J=0$. 볼록함수의 정류점이므로 최소점.

**4. 예측의 유일성.** 원래 문제는 RKHS에서 $\min_f\frac1n\sum(y_i-f(x_i))^2+\lambda\lVert f\rVert^2$이고 $\lambda\lVert f\rVert^2$ 때문에 강볼록이라 최적 함수 $f^\ast$가 유일합니다. 표현자 정리로 $f^\ast=\sum_j\alpha_jK(\cdot,x_j)$이고 $\alpha$가 여럿이어도(K가 특이할 때) 같은 함수를 나타내므로 $\hat f(x)=\sum_j\alpha^\ast_jK(x_j,x)=k_x^\top\alpha^\ast$는 같습니다.`,
    note: R`보충 노트는 편향처럼 규제하지 않는 성분(널 공간 기저 $Q$)을 더한 일반형 $\min\frac1n\lVert y-K\alpha-Q\beta\rVert^2+\lambda\alpha^\top K\alpha$의 블록 정규방정식도 유도하고, 3차 평활 스플라인이 그 특수한 경우임을 보였습니다.` },
  { ch: 'ch13', id: 'gpPosterior', title: '가우시안 과정 회귀의 예측 분포', keys: ['가우시안 과정의 예측 분포'], src: '강의 노트 · DSML 6장 보충',
    tags: 'Gaussian process regression posterior predictive mean variance conditioning kernel ridge connection 가우시안 과정 예측 분포 조건부',
    stmt: R`$g\sim\mathcal{GP}(0,K)$, $y_i=g(x_i)+\varepsilon_i$, $\varepsilon\sim\N(0,\sigma^2I)$ 독립이면 $g(x)\mid y\sim\N\big(k_x^\top(K+\sigma^2I)^{-1}y,\ K(x,x)-k_x^\top(K+\sigma^2I)^{-1}k_x\big)$.`,
    body: R`
**1. 결합분포.** $(g(x_1),\dots,g(x_n),g(x))$는 평균 0, 공분산이 $K$의 값인 가우시안이고 $\varepsilon$은 독립이므로
$$\begin{pmatrix}y\\g(x)\end{pmatrix}\sim\N\left(0,\begin{pmatrix}K+\sigma^2I&k_x\\k_x^\top&K(x,x)\end{pmatrix}\right),$$
$\Cov(y,g(x))=\Cov(g(x_{1:n}),g(x))=k_x$ (잡음은 $g(x)$와 독립).

**2. 가우시안 조건부 공식.** $(a,b)$가 평균 0 결합 가우시안, $\Sigma_{aa}$ 가역이면 $b\mid a\sim\N(\Sigma_{ba}\Sigma_{aa}^{-1}a,\ \Sigma_{bb}-\Sigma_{ba}\Sigma_{aa}^{-1}\Sigma_{ab})$. (증명: $b-\Sigma_{ba}\Sigma_{aa}^{-1}a$는 $a$와 공분산 0인 결합 가우시안이라 독립이고, 그 분산이 $\Sigma_{bb}-\Sigma_{ba}\Sigma_{aa}^{-1}\Sigma_{ab}$.)

**3. 대입.** $a=y$, $b=g(x)$, $\Sigma_{aa}=K+\sigma^2I$ ($\sigma^2>0$이라 가역), $\Sigma_{ba}=k_x^\top$.`,
    note: R`예측 평균은 $n\lambda=\sigma^2$인 커널 릿지 회귀와 같습니다. 분산은 관측과 무관하게 입력 위치만으로 정해지고, 훈련점에서 멀어질수록 사전분산 $K(x,x)$로 돌아갑니다. 노트는 커널 모수를 고르는 로그 주변가능도 $-\frac12y^\top K_y^{-1}y-\frac12\ln\det K_y-\frac n2\ln2\pi$와 그 기울기도 유도했습니다.` },
  );
})();
