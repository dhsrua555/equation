/* 기초 수학 04 — 다변수 미적분: 편미분과 선형 근사, 연쇄법칙과 야코비 행렬, 헤시안 */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 4, part: 'C', title: '다변수 미적분', en: 'Calculus of Several Variables', ref: '미적분학 II · 다변수', plot: 'saddle',
    fig: R`$f=x^3-3x+y^2$의 등고선: 극솟점 $(1,0)$과 안장점 $(-1,0)$`,
    tagline: R`변수가 여럿이어도 미분은 여전히 “가까이서 보면 선형”이고, 그 선형 사상을 행렬로 적습니다.`,
    summary: R`완전미분방정식, 기울기와 방향도함수, 좌표변환과 야코비안, 역전파, 볼록성 판정은 모두 다변수 미분의 세 가지 사실에 기댑니다. 선형 근사를 주는 **전미분**, 합성함수의 미분을 행렬 곱으로 적는 **연쇄법칙**, 그리고 2차 근사의 계수인 **헤시안**입니다.`,
    goals: [
      R`편미분과 기울기를 구하고 전미분으로 오차 전파를 어림할 수 있다`,
      R`다변수 연쇄법칙을 나무 그림과 야코비 행렬 곱으로 쓸 수 있다`,
      R`극좌표 변환에서 편미분과 넓이 요소 $r\,dr\,d\theta$를 유도할 수 있다`,
      R`헤시안으로 임계점을 극대·극소·안장점으로 분류할 수 있다`,
    ],
    sections: [
      { k: '4.1', src: '미적분학 II · 편미분', title: '편미분과 선형 근사', body: R`
**편미분** $f_x=\dfrac{\partial f}{\partial x}$는 다른 변수를 상수로 두고 한 변수로만 미분한 것입니다. 편미분을 모은 벡터가 **기울기** $\nabla f=(f_x,f_y)$입니다.

편미분이 있다는 것만으로는 부족하고, 모든 방향의 변화를 한꺼번에 선형으로 어림할 수 있어야 **미분가능**하다고 합니다.

:::key 전미분과 선형 근사
$f$가 $(a,b)$에서 미분가능하면
$$f(a+h,\,b+k)=f(a,b)+f_x\,h+f_y\,k+o\big(\sqrt{h^2+k^2}\big)$$
곧 접평면 $z=f(a,b)+f_x(x-a)+f_y(y-b)$가 $f$를 가장 잘 어림하는 평면이고, 전미분 $df=f_x\,dx+f_y\,dy$가 작은 변화의 크기를 줍니다. 편미분이 연속이면 미분가능합니다.
:::

**방향도함수.** 단위벡터 $\mathbf u$ 방향의 변화율은 $D_{\mathbf u}f=\nabla f\cdot\mathbf u$입니다. $\mathbf u$가 $\nabla f$와 같은 방향일 때 가장 크므로, $\nabla f$는 가장 가파르게 올라가는 방향이고 그 반대 방향이 경사하강법이 걷는 방향입니다.

:::thm 혼합 편미분의 순서 (슈바르츠)
$f_{xy}$와 $f_{yx}$가 연속이면 $f_{xy}=f_{yx}$입니다.
:::

이 정리가 완전미분방정식의 판정 $M_y=N_x$와 $\operatorname{curl}(\nabla f)=\mathbf 0$의 근거입니다: $M=f_x$, $N=f_y$이면 $M_y=f_{xy}=f_{yx}=N_x$.

:::ex 예제 1 (오차 전파)
원기둥의 반지름을 $r=3\pm0.01$, 높이를 $h=5\pm0.02$로 쟀다. 부피 $V=\pi r^2h$의 오차를 어림하세요.
---
$dV=2\pi rh\,dr+\pi r^2\,dh=2\pi\cdot15\cdot0.01+9\pi\cdot0.02=0.3\pi+0.18\pi=0.48\pi\approx1.51$. 부피 $45\pi\approx141.4$에 대해 약 $1.1\%$입니다. 상대오차로 보면 $\dfrac{dV}{V}=2\dfrac{dr}{r}+\dfrac{dh}{h}$로, 제곱으로 들어가는 반지름의 오차가 두 배로 반영됩니다.
:::

:::warn 편미분이 있어도 연속이 아닐 수 있다
$f(x,y)=\dfrac{xy}{x^2+y^2}$ ($f(0,0)=0$)은 원점에서 $f_x=f_y=0$이지만, 직선 $y=x$를 따라가면 $f=\tfrac12$이라 원점에서 연속조차 아닙니다. 축 방향만 보는 편미분은 다른 방향의 행동을 알려 주지 않습니다.
:::
` },
      { k: '4.2', src: '미적분학 II · 연쇄법칙', title: '연쇄법칙과 야코비 행렬', body: R`
$z=f(x,y)$에서 $x,y$가 다시 $t$의 함수이면, $t$의 작은 변화가 $x$와 $y$를 거쳐 $z$에 전해진 양을 더합니다.
$$\frac{dz}{dt}=\frac{\partial f}{\partial x}\frac{dx}{dt}+\frac{\partial f}{\partial y}\frac{dy}{dt}$$
변수에서 변수로 가는 **모든 경로의 곱을 더한다**고 기억하면 됩니다(나무 그림).

:::key 다변수 연쇄법칙
$\mathbf g:\mathbb R^n\to\mathbb R^m$, $\mathbf f:\mathbb R^m\to\mathbb R^p$가 미분가능하면
$$D(\mathbf f\circ\mathbf g)(\mathbf x)=D\mathbf f\big(\mathbf g(\mathbf x)\big)\,D\mathbf g(\mathbf x)$$
$D\mathbf g$는 $(i,j)$ 성분이 $\partial g_i/\partial x_j$인 $m\times n$ **야코비 행렬**입니다. 합성의 미분은 야코비 행렬의 곱입니다.
:::

역전파는 이 곱을 **출력 쪽에서부터** 계산하는 순서일 뿐입니다. 손실이 스칼라이므로 오른쪽 끝의 행벡터에 야코비 행렬을 차례로 곱해 가면 중간 결과가 늘 벡터로 남아 계산이 싸집니다.

**극좌표.** $x=r\cos\theta$, $y=r\sin\theta$이면
$$f_r=f_x\cos\theta+f_y\sin\theta,\qquad f_\theta=-f_x\,r\sin\theta+f_y\,r\cos\theta$$
좌표변환의 야코비 행렬식은
$$\det\frac{\partial(x,y)}{\partial(r,\theta)}=\begin{vmatrix}\cos\theta&-r\sin\theta\\ \sin\theta&r\cos\theta\end{vmatrix}=r$$
이고, 이 값이 적분의 넓이 요소 $dx\,dy=r\,dr\,d\theta$가 됩니다. 일반적으로 변수변환은 $\lvert\det J\rvert$만큼 넓이(부피)를 늘립니다.

**음함수 미분.** $F(x,y)=0$이 $y=y(x)$를 정하면 $F_x+F_y\,y'=0$에서 $y'=-F_x/F_y$입니다. 곡선족의 미분방정식과 직교 궤적을 구할 때 쓰는 식입니다.

:::ex 예제 1
$w=x^2+y^2$, $x=s+t$, $y=s-t$일 때 $\partial w/\partial s$를 연쇄법칙으로 구하고 직접 대입해 확인하세요.
---
$w_s=w_x\,x_s+w_y\,y_s=2x\cdot1+2y\cdot1=2(s+t)+2(s-t)=4s$. 직접 대입하면 $w=2s^2+2t^2$이라 $w_s=4s$로 같습니다.
:::

:::ex 예제 2 (행렬로 쓰기)
$\mathbf g(x,y)=(xy,\ x+y)$, $f(u,v)=u^2+v$일 때 $(x,y)=(1,2)$에서 $\nabla(f\circ\mathbf g)$는?
---
$\mathbf g(1,2)=(2,3)$, $Df=(2u,\ 1)=(4,\ 1)$, $D\mathbf g=\begin{pmatrix}y&x\\1&1\end{pmatrix}=\begin{pmatrix}2&1\\1&1\end{pmatrix}$.
$$(4,\ 1)\begin{pmatrix}2&1\\1&1\end{pmatrix}=(9,\ 5)$$
직접 계산해도 $f\circ\mathbf g=x^2y^2+x+y$, $\nabla=(2xy^2+1,\ 2x^2y+1)=(9,\ 5)$입니다.
:::
` },
      { k: '4.3', src: '미적분학 II · 극값', title: '다변수 테일러 전개와 헤시안', body: R`
한 변수에서 $f(a+h)\approx f(a)+f'(a)h+\tfrac12f''(a)h^2$이었던 것을 여러 변수로 옮깁니다. 2계 도함수 자리에 **헤시안 행렬** $H=\big(\partial^2f/\partial x_i\partial x_j\big)$이 들어가고, 혼합 편미분이 같으므로 $H$는 대칭입니다.

:::key 2차 테일러 전개
$$f(\mathbf x+\mathbf h)=f(\mathbf x)+\nabla f(\mathbf x)\cdot\mathbf h+\frac12\,\mathbf h^{\mathsf T}H(\mathbf x)\,\mathbf h+o\big(\lVert\mathbf h\rVert^2\big)$$
:::

유도는 한 변수로 돌아가는 것이 가장 쉽습니다. $g(t)=f(\mathbf x+t\mathbf h)$라 두면 연쇄법칙[[ch04:4.2|연쇄법칙: 합성함수의 미분은 야코비 행렬의 곱.]]으로 $g'(0)=\nabla f\cdot\mathbf h$, $g''(0)=\mathbf h^{\mathsf T}H\mathbf h$이고, 여기에 한 변수 테일러 정리[[ch01:1.3|한 변수 테일러 정리와 라그랑주 나머지항.]]를 쓰면 됩니다.

임계점($\nabla f=\mathbf 0$)에서는 1차 항이 사라지므로 $f$의 모양은 이차형식 $\mathbf h^{\mathsf T}H\mathbf h$가 정합니다.

:::key 헤시안과 극값 판정
$\nabla f(\mathbf x)=\mathbf 0$일 때
- $H$가 양의 정부호(고유값이 모두 양수)이면 극소
- $H$가 음의 정부호(고유값이 모두 음수)이면 극대
- 양수와 음수 고유값이 섞여 있으면 안장점

두 변수에서는 $D=f_{xx}f_{yy}-f_{xy}^2$로 판정합니다. $D>0$이고 $f_{xx}>0$이면 극소, $D>0$이고 $f_{xx}<0$이면 극대, $D<0$이면 안장점, $D=0$이면 이것만으로는 알 수 없습니다.
:::

양의 정부호 판정은 선형대수의 이차형식·고유값 이야기 그대로입니다. 또 $H$가 **어디서나** 양의 준정부호이면 $f$는 볼록함수이고, 볼록함수의 임계점은 곧 최솟점입니다. 로지스틱 회귀의 손실이 좋은 이유가 이것이고, 경사하강법의 수렴 증명(하강 보조정리)은 $H$의 크기에 상한 $\beta$를 두는 데서 시작합니다.

:::ex 예제 1
$f(x,y)=x^3-3x+y^2$의 임계점을 분류하세요.
---
$\nabla f=(3x^2-3,\ 2y)=\mathbf 0$에서 $(\pm1,0)$. $H=\begin{pmatrix}6x&0\\0&2\end{pmatrix}$.
$(1,0)$: $H=\operatorname{diag}(6,2)$, 양의 정부호 → 극소($f=-2$).
$(-1,0)$: $H=\operatorname{diag}(-6,2)$, 부호가 섞임 → 안장점.
:::

:::ex 예제 2
$f(x,y)=e^x\cos y$를 원점에서 2차까지 전개하세요.
---
$f=1$, $f_x=1$, $f_y=0$, $f_{xx}=1$, $f_{xy}=0$, $f_{yy}=-1$. 따라서 $f\approx1+x+\tfrac12\big(x^2-y^2\big)$. 2차 부분 $x^2-y^2$은 부정부호라서 원점 근처의 등고선은 쌍곡선 모양입니다($e^x\cos y$는 복소함수 $e^z$의 실수부라서 조화함수이고, 조화함수의 헤시안은 대각합이 0입니다).
:::
` },
    ],
    problems: [
      { sec: '4.1', type: 'num', lv: 1, q: R`$f(x,y)=x^2y+\sin(xy)$일 때 $f_x(1,0)$은?`, ans: '0', ansTex: R`0`,
        sol: R`$f_x=2xy+y\cos(xy)$이므로 $(1,0)$에서 $0$.` },
      { sec: '4.1', type: 'num', lv: 2, q: R`$f(x,y)=x^2+3y^2$의 점 $(1,1)$에서 방향 $\mathbf u=\big(\tfrac35,\tfrac45\big)$의 방향도함수는?`, ans: '6', ansTex: R`6`,
        sol: R`$\nabla f=(2x,6y)=(2,6)$. $D_{\mathbf u}f=2\cdot\tfrac35+6\cdot\tfrac45=\tfrac{6+24}5=6$.` },
      { sec: '4.2', type: 'num', lv: 2, q: R`$z=x^2y$, $x=\cos t$, $y=\sin t$일 때 $t=0$에서 $dz/dt$는?`, ans: '1', ansTex: R`1`,
        sol: R`$z_t=2xy\,x'+x^2\,y'=2xy(-\sin t)+x^2\cos t$. $t=0$에서 $x=1$, $y=0$이므로 $0+1\cdot1=1$.` },
      { sec: '4.2', type: 'mc', lv: 2, q: R`구면좌표 $x=\rho\sin\phi\cos\theta$, $y=\rho\sin\phi\sin\theta$, $z=\rho\cos\phi$의 부피 요소는?`,
        choices: [R`$\rho^2\sin\phi\,d\rho\,d\phi\,d\theta$`, R`$\rho\,d\rho\,d\phi\,d\theta$`, R`$\rho^2\,d\rho\,d\phi\,d\theta$`, R`$\rho\sin\phi\,d\rho\,d\phi\,d\theta$`], ans: 0,
        sol: R`야코비 행렬식의 절댓값이 $\rho^2\sin\phi$입니다. 반지름 $a$인 구의 부피 $\int_0^{2\pi}\!\int_0^\pi\!\int_0^a\rho^2\sin\phi\,d\rho\,d\phi\,d\theta=\tfrac43\pi a^3$으로 확인할 수 있습니다.` },
      { sec: '4.3', type: 'mc', lv: 2, q: R`$f(x,y)=x^2+4xy+y^2$의 원점은?`,
        choices: [R`극소점`, R`극대점`, R`안장점`, R`판정 불가`], ans: 2,
        sol: R`$H=\begin{pmatrix}2&4\\4&2\end{pmatrix}$, $D=4-16=-12<0$이므로 안장점. 고유값은 $6$과 $-2$입니다.` },
      { sec: '4.3', type: 'num', lv: 2, q: R`$f(x,y)=x^2-xy+y^2-3x$의 최솟값은?`, ans: '-3', ansTex: R`-3`,
        sol: R`$f_x=2x-y-3=0$, $f_y=-x+2y=0$에서 $x=2$, $y=1$. $H=\begin{pmatrix}2&-1\\-1&2\end{pmatrix}$는 양의 정부호($D=3>0$, $f_{xx}>0$)이고 어디서나 같으므로 볼록, 따라서 최솟값 $f(2,1)=4-2+1-6=-3$.` },
      { sec: '4.3', type: 'open', lv: 3, q: R`$f(\mathbf x)=\tfrac12\mathbf x^{\mathsf T}A\mathbf x-\mathbf b^{\mathsf T}\mathbf x$ ($A$는 대칭 양의 정부호)의 기울기와 헤시안을 구하고, 최솟점이 $A\mathbf x=\mathbf b$의 해임을 보이세요.`,
        sol: R`$\nabla f=A\mathbf x-\mathbf b$, $H=A$. $A$가 양의 정부호이므로 $f$는 (강)볼록이고 임계점이 유일한 최솟점입니다. 임계점 조건 $\nabla f=\mathbf 0$이 곧 $A\mathbf x=\mathbf b$입니다. 최소제곱의 정규방정식 $X^{\mathsf T}X\mathbf w=X^{\mathsf T}\mathbf y$가 이 꼴입니다.` },
    ],
  });
})();
