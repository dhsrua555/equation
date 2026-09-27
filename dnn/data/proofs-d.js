/* 증명 — Part D: 13 하강 보조정리와 경사하강법의 수렴 (4주차 수요일 필기) */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  { ch: 'ch13', id: 'steepest', title: '최급강하 방향은 기울기의 반대 방향', keys: ['최급강하 방향'], src: '강의 필기 · W4 수',
    tags: 'steepest descent direction Cauchy Schwarz Taylor gradient 최급강하 코시 슈바르츠 테일러',
    stmt: R`$\nabla f(x)\ne0$이면 $\min_{\lVert v\rVert=1}\langle\nabla f(x),v\rangle=-\lVert\nabla f(x)\rVert$이고, 최소는 $v=-\nabla f(x)/\lVert\nabla f(x)\rVert$에서만 달성된다.`,
    body: R`
코시-슈바르츠 부등식 $\lvert\langle a,v\rangle\rvert\le\lVert a\rVert\lVert v\rVert$에서 $\lVert v\rVert=1$이면
$$\langle\nabla f(x),v\rangle\ge-\lVert\nabla f(x)\rVert.$$
$v^*=-\nabla f(x)/\lVert\nabla f(x)\rVert$를 넣으면 $\langle\nabla f(x),v^*\rangle=-\lVert\nabla f(x)\rVert^2/\lVert\nabla f(x)\rVert=-\lVert\nabla f(x)\rVert$이므로 하한이 달성됩니다.
**유일성.** 코시-슈바르츠의 등호는 $v$가 $\nabla f(x)$의 스칼라배일 때뿐이고, 단위벡터이면서 내적이 음수이려면 $v=v^*$.

**GD와의 연결.** 1차 근사 $f(x+\eta v)\approx f(x)+\eta\langle\nabla f(x),v\rangle$을 가장 많이 줄이는 방향이 $v^*$이므로 $x_{t+1}=x_t-\eta\frac{\nabla f(x_t)}{\lVert\nabla f(x_t)\rVert}$, 그리고 $\eta'=\eta/\lVert\nabla f(x_t)\rVert$로 흡수하면 $x_{t+1}=x_t-\eta'\nabla f(x_t)$.`,
    note: R`이 논증은 “1차 근사가 좋은 작은 보폭”에서의 직관입니다. 얼마나 작아야 실제로 감소하는지는 하강 보조정리가 정량적으로 답합니다($\eta<2/\beta$).` },
  { ch: 'ch13', id: 'lipschitzhess', title: '립시츠 기울기와 헤시안의 한계 (③)', keys: ['β-매끄러움과 헤시안'], src: '강의 필기 · W4 수(2) ③',
    tags: 'Lipschitz gradient Hessian bound smoothness positive semidefinite 립시츠 헤시안 매끄러움',
    stmt: R`$f\in C^2(\mathbb R^d)$에 대해 다음은 동치이다.
(a) $\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert$ ($\forall x,y$)
(b) $\lVert\nabla^2f(x)\rVert_2\le\beta$ ($\forall x$), 즉 $-\beta I\preceq\nabla^2f(x)\preceq\beta I$.
특히 (a)이면 $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ ($\forall x,v$).`,
    body: R`
**(a)⇒(b).** $x,v$를 고정합니다. $\nabla f$가 미분가능하므로 방향미분으로
$$\nabla^2f(x)v=\lim_{s\to0}\frac{\nabla f(x+sv)-\nabla f(x)}s.$$
(a)에서 $\Big\lVert\frac{\nabla f(x+sv)-\nabla f(x)}s\Big\rVert\le\frac{\beta\lvert s\rvert\lVert v\rVert}{\lvert s\rvert}=\beta\lVert v\rVert$이고 노름은 연속이므로 $\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert$. 모든 $v$에서 성립하므로 연산자 노름 $\lVert\nabla^2f(x)\rVert_2\le\beta$. 대칭행렬에서 이는 모든 고윳값이 $[-\beta,\beta]$에 있다는 뜻이고, 코시-슈바르츠로
$$\lvert v^T\nabla^2f(x)v\rvert\le\lVert v\rVert\,\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert^2.$$

**(b)⇒(a).** 미적분학의 기본정리를 벡터값 함수 $t\mapsto\nabla f(y+t(x-y))$에 적용하면
$$\nabla f(x)-\nabla f(y)=\int_0^1\nabla^2f\big(y+t(x-y)\big)(x-y)\,dt,$$
$$\lVert\nabla f(x)-\nabla f(y)\rVert\le\int_0^1\lVert\nabla^2f(\cdot)\rVert_2\lVert x-y\rVert\,dt\le\beta\lVert x-y\rVert.$$`,
    note: R`필기: “note: $\forall v$, $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2\iff\nabla^2f(x)\preceq\beta I$. We want $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ — Next class.” 하강 보조정리에는 위쪽 한계 $\nabla^2f\preceq\beta I$만 필요합니다. 아래쪽 한계 $-\beta I$는 $f(y)\ge f(x)+\langle\nabla f(x),y-x\rangle-\frac\beta2\lVert y-x\rVert^2$을 줍니다.` },
  { ch: 'ch13', id: 'gchain', title: '보조함수 g(t)의 도함수 (①)', keys: ['하강 보조정리 (Lemma 3.1)'], src: '강의 필기 · W4 수(2) ①',
    tags: 'chain rule auxiliary function directional derivative Hessian 연쇄법칙 보조함수 방향도함수',
    stmt: R`$f\in C^2$, $p=y-x$, $z(t)=x+tp$, $g(t)=f(z(t))$이면 $g'(t)=p^T\nabla f(z(t))$, $g''(t)=p^T\nabla^2f(z(t))\,p$.`,
    body: R`
$z'(t)=p$ ($n\times1$ 열벡터). 다변수 연쇄법칙 $g'(t)=Df(z(t))\,z'(t)$에서 $Df(z)=\nabla f(z)^T$는 $1\times n$ 행벡터이므로
$$g'(t)=\nabla f(z(t))^Tp=p^T\nabla f(z(t))\qquad(1\times n\ \text{곱하기}\ n\times1=1\times1).$$
$p$는 상수이므로 $g''(t)=p^T\frac{d}{dt}\nabla f(z(t))$. 사상 $\nabla f:\mathbb R^n\to\mathbb R^n$의 도함수(야코비안)는 헤시안 $D(\nabla f)(z)=\nabla^2f(z)$이므로 다시 연쇄법칙으로
$$\frac d{dt}\nabla f(z(t))=\nabla^2f(z(t))\,z'(t)=\nabla^2f(z(t))\,p\qquad(n\times n\ \text{곱하기}\ n\times1),$$
$$g''(t)=p^T\nabla^2f(z(t))\,p=(y-x)^T\nabla^2f\big(x+t(y-x)\big)(y-x).$$` },
  { ch: 'ch13', id: 'taylorint', title: '적분형 나머지를 가진 테일러 공식 (②)', keys: ['하강 보조정리 (Lemma 3.1)'], src: '강의 필기 · W4 수(2) ② D.I.Y.',
    tags: 'Taylor integral remainder integration by parts fundamental theorem 테일러 적분형 나머지 부분적분',
    stmt: R`$g\in C^2[0,1]$이면 $g(1)=g(0)+g'(0)+\displaystyle\int_0^1(1-s)g''(s)\,ds$.`,
    body: R`
미적분학의 기본정리로 $g(1)=g(0)+\int_0^1g'(s)\,ds$. 부분적분 $\int_0^1u\,dv=[uv]_0^1-\int_0^1v\,du$에서 $u=g'(s)$, $dv=ds$로 두고 $v$를 $s-1=-(1-s)$로 고르면 (적분상수를 이렇게 고르는 것이 요령)
$$\int_0^1g'(s)\,ds=\Big[-(1-s)g'(s)\Big]_0^1+\int_0^1(1-s)g''(s)\,ds=\big(0+g'(0)\big)+\int_0^1(1-s)g''(s)\,ds.$$
대입하면 결과입니다.

**필기의 방식.** $u=1-s$, $v'=g''(s)$로 두면 $\int_0^1(1-s)g''(s)ds=\big[(1-s)g'(s)\big]_0^1+\int_0^1g'(s)ds=-g'(0)+g(1)-g(0)$, 이를 정리해도 같은 식입니다.`,
    note: R`일반형은 $g(1)=\sum_{k=0}^{n}\frac{g^{(k)}(0)}{k!}+\int_0^1\frac{(1-s)^n}{n!}g^{(n+1)}(s)ds$. 하강 보조정리는 $n=1$인 경우입니다.` },
  { ch: 'ch13', id: 'descent', title: '하강 보조정리 (Lemma 3.1)', keys: ['하강 보조정리 (Lemma 3.1)'], src: '강의 필기 · W4 수(2)',
    tags: 'descent lemma smoothness quadratic upper bound Lemma 3.1 하강 보조정리 매끄러움 이차 상한',
    stmt: R`$f:\mathbb R^d\to\mathbb R$이 연속 미분가능하고 $\nabla f$가 $\beta$-립시츠이면 모든 $x,y$에 대해
$$f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2.$$`,
    body: R`
**증명 1 (필기, $f\in C^2$).** $g(t)=f(x+t(y-x))$.
① $g'(t)=\langle\nabla f(x+t(y-x)),y-x\rangle$, $g''(t)=(y-x)^T\nabla^2f(x+t(y-x))(y-x)$.
② $g(1)=g(0)+g'(0)+\int_0^1(1-s)g''(s)ds$. 여기서 $g(0)=f(x)$, $g(1)=f(y)$, $g'(0)=\langle\nabla f(x),y-x\rangle$이므로
$$f(y)=f(x)+\langle\nabla f(x),y-x\rangle+\int_0^1(1-s)(y-x)^T\nabla^2f(x+s(y-x))(y-x)\,ds.\qquad(*)$$
③ $\beta$-매끄러움에서 모든 $v$에 대해 $v^T\nabla^2fv\le\beta\lVert v\rVert^2$. $1-s\ge0$이므로
$$\int_0^1(1-s)(y-x)^T\nabla^2f(\cdot)(y-x)\,ds\le\beta\lVert y-x\rVert^2\int_0^1(1-s)\,ds=\frac\beta2\lVert y-x\rVert^2.$$
$(*)$에 넣으면 결과입니다.

**증명 2 ($f\in C^1$만 가정).** $h(t)=f(x+t(y-x))$는 $C^1$이고 $h'(t)=\langle\nabla f(x+t(y-x)),y-x\rangle$. 미적분학의 기본정리로
$$f(y)-f(x)-\langle\nabla f(x),y-x\rangle=\int_0^1\big\langle\nabla f(x+t(y-x))-\nabla f(x),\,y-x\big\rangle dt.$$
코시-슈바르츠와 립시츠 조건 $\lVert\nabla f(x+t(y-x))-\nabla f(x)\rVert\le\beta t\lVert y-x\rVert$로 피적분함수는 $\le\beta t\lVert y-x\rVert^2$이므로 우변 $\le\beta\lVert y-x\rVert^2\int_0^1t\,dt=\frac\beta2\lVert y-x\rVert^2$.`,
    note: R`슬라이드의 정리는 $C^1$ 가정으로 적혀 있고, 수업 필기는 $C^2$를 가정한 증명입니다(필기 여백의 “$C^2$”). 증명 2는 헤시안 없이 같은 결론을 줍니다. 기하학적으로는 “$f$의 그래프가 각 점에서 곡률 $\beta$인 포물선 아래에 있다”는 뜻입니다.` },
  { ch: 'ch13', id: 'gdstep', title: '경사하강법 한 걸음의 감소 부등식', keys: ['경사하강법의 감소 조건'], src: '강의 필기 · W4 수',
    tags: 'gradient descent sufficient decrease step size 2/beta 경사하강 감소 보폭',
    stmt: R`$f$가 $\beta$-매끄럽고 $x_{t+1}=x_t-\eta\nabla f(x_t)$이면 $f(x_{t+1})\le f(x_t)-\big(\eta-\frac{\beta\eta^2}2\big)\lVert\nabla f(x_t)\rVert^2$. 따라서 $0<\eta<2/\beta$이면 $f(x_{t+1})\le f(x_t)$.`,
    body: R`
하강 보조정리에 $x=x_t$, $y=x_{t+1}$을 넣고 $x_{t+1}-x_t=-\eta\nabla f(x_t)$를 씁니다.
$$\begin{aligned}f(x_{t+1})&\le f(x_t)+\langle\nabla f(x_t),-\eta\nabla f(x_t)\rangle+\frac\beta2\lVert-\eta\nabla f(x_t)\rVert^2\\&=f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac{\beta\eta^2}2\lVert\nabla f(x_t)\rVert^2=f(x_t)-\Big(\eta-\frac{\beta\eta^2}2\Big)\lVert\nabla f(x_t)\rVert^2.\end{aligned}$$
$\eta-\frac{\beta\eta^2}2=\eta\big(1-\frac{\beta\eta}2\big)>0\iff0<\eta<\frac2\beta$. 이때 오른쪽 둘째 항이 $\le0$이라 $f(x_{t+1})\le f(x_t)$이고, $\nabla f(x_t)\ne0$이면 순감소입니다.

**최적 보폭.** $\phi(\eta)=\eta-\frac\beta2\eta^2$는 $\eta=1/\beta$에서 최대 $\frac1{2\beta}$이므로 $f(x_{t+1})\le f(x_t)-\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2$.` },
  { ch: 'ch13', id: 'gdrate', title: '비볼록 매끄러운 함수에서 GD의 수렴 속도', keys: ['경사하강법의 감소 조건'],
    tags: 'convergence rate nonconvex stationary point telescoping 수렴 속도 비볼록 정류점 망원급수',
    stmt: R`$f$가 $\beta$-매끄럽고 아래로 유계($f\ge f^*$)이며 $\eta=1/\beta$이면 $\min_{0\le t<T}\lVert\nabla f(x_t)\rVert^2\le\frac{2\beta(f(x_0)-f^*)}T$.`,
    body: R`
한 걸음 감소 부등식 $\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2\le f(x_t)-f(x_{t+1})$을 $t=0,\dots,T-1$에 대해 더하면 우변이 망원급수가 되어
$$\frac1{2\beta}\sum_{t=0}^{T-1}\lVert\nabla f(x_t)\rVert^2\le f(x_0)-f(x_T)\le f(x_0)-f^*.$$
최솟값은 평균 이하이므로 $\min_t\lVert\nabla f(x_t)\rVert^2\le\frac1T\sum_t\lVert\nabla f(x_t)\rVert^2\le\frac{2\beta(f(x_0)-f^*)}T$.`,
    note: R`볼록성이 없으므로 정류점(기울기 0)에 가까워진다는 결론까지만 얻습니다. 안장점이나 국소 최소일 수 있습니다. $f$가 볼록이면 $f(x_T)-f^*\le\frac{\beta\lVert x_0-x^*\rVert^2}{2T}$라는 더 강한 결과가 있습니다.` },
  { ch: 'ch13', id: 'sgdlemma', title: '확률적 경사하강 보조정리', keys: ['확률적 경사하강 보조정리'],
    tags: 'stochastic gradient descent lemma expectation unbiased variance SGD 확률적 경사하강 보조정리 기댓값 불편 분산',
    stmt: R`$f$가 $L$-매끄럽고 $x_{t+1}=x_t-\eta\tilde\nabla f(x_t)$, $\E_t[\tilde\nabla f(x_t)]=\nabla f(x_t)$ ($\E_t[\cdot]=\E[\cdot\mid x_t]$)이면
$$\E_t[f(x_{t+1})]\le f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac L2\eta^2\E_t\big[\lVert\tilde\nabla f(x_t)\rVert^2\big].$$`,
    body: R`
하강 보조정리를 $x=x_t$, $y=x_{t+1}$에 적용하면(확률 1로 성립하는 부등식)
$$f(x_{t+1})\le f(x_t)-\eta\langle\nabla f(x_t),\tilde\nabla f(x_t)\rangle+\frac L2\eta^2\lVert\tilde\nabla f(x_t)\rVert^2.$$
양변에 $\E_t$를 취합니다. $x_t$가 주어지면 $f(x_t)$와 $\nabla f(x_t)$는 상수이므로
$$\E_t\langle\nabla f(x_t),\tilde\nabla f(x_t)\rangle=\langle\nabla f(x_t),\E_t\tilde\nabla f(x_t)\rangle=\lVert\nabla f(x_t)\rVert^2.$$
나머지 항은 그대로 두면 결과입니다.`,
    note: R`$\E_t\lVert\tilde\nabla f\rVert^2=\lVert\nabla f\rVert^2+\E_t\lVert\tilde\nabla f-\nabla f\rVert^2$ (2차 모멘트 = 평균의 제곱 + 분산)이므로 결과를 $\E_tf(x_{t+1})\le f(x_t)-\eta\big(1-\frac{L\eta}2\big)\lVert\nabla f\rVert^2+\frac{L\eta^2}2\Var_t(\tilde\nabla f)$로 쓸 수 있습니다. 분산이 0이면 GD의 감소 부등식과 같고, 분산이 크면 감소를 보장하는 $\eta$가 작아집니다.` },
  { ch: 'ch13', id: 'sgdsum', title: 'SGD의 합산 부등식과 학습률', keys: ['확률적 경사하강 보조정리'],
    tags: 'SGD summation bound noise floor learning rate decay telescoping 합산 잡음 바닥 학습률',
    stmt: R`위 가정에 $\E_t\lVert\tilde\nabla f(x_t)\rVert^2\le G$ ($\forall t$)를 더하면
$$\sum_{t=0}^{T-1}\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_0)-f^*}\eta+\frac L2\eta GT,$$
특히 $\eta=\sqrt{\frac{2(f(x_0)-f^*)}{LGT}}$이면 $\frac1T\sum_t\E\lVert\nabla f(x_t)\rVert^2\le\sqrt{\frac{2LG(f(x_0)-f^*)}T}$.`,
    body: R`
보조정리와 $G$ 상한에서 $\eta\lVert\nabla f(x_t)\rVert^2\le f(x_t)-\E_tf(x_{t+1})+\frac L2\eta^2G$, 즉 (슬라이드 10)
$$\lVert\nabla f(x_t)\rVert^2\le\frac1\eta\E_t\big[f(x_t)-f(x_{t+1})\big]+\frac L2\eta G.$$
전체 기댓값을 취하면(탑 성질 $\E[\E_t[\cdot]]=\E[\cdot]$) $\E\lVert\nabla f(x_t)\rVert^2\le\frac1\eta\big(\E f(x_t)-\E f(x_{t+1})\big)+\frac L2\eta G$. $t=0,\dots,T-1$에 대해 더하면 망원급수가 되어
$$\sum_t\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_0)-\E f(x_T)}\eta+\frac L2\eta GT\le\frac{f(x_0)-f^*}\eta+\frac L2\eta GT.$$
$T$로 나눈 우변 $\frac{\Delta}{\eta T}+\frac{LG}2\eta$ ($\Delta=f(x_0)-f^*$)는 산술-기하 평균으로 $\eta=\sqrt{2\Delta/(LGT)}$에서 최소 $2\sqrt{\frac{\Delta LG}{2T}}=\sqrt{\frac{2LG\Delta}T}$.`,
    note: R`$\eta$를 고정하면 $T\to\infty$에서도 $\frac L2\eta G$가 남습니다(잡음 바닥). 슬라이드는 합산 부등식을 $\sum_t\E_t[\cdot]$로 적었는데, 망원급수를 만들려면 모든 항을 같은 (전체) 기댓값으로 맞추는 탑 성질 단계가 필요합니다.` },
  );
})();
