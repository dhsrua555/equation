/* 기초 수학 05 — 해석의 도구: 립시츠 조건, 부등식, 균등수렴 */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 5, part: 'C', title: '해석의 도구', en: 'Tools of Analysis', ref: '해석학 입문', plot: 'lipschitz',
    fig: R`립시츠 원뿔: $\lvert f(x)-f(a)\rvert\le L\lvert x-a\rvert$인 함수는 기울기 $\pm L$ 사이에 갇힌다`,
    tagline: R`“얼마나 빨리 변하는가”에 상한을 두는 립시츠 조건, 크기를 누르는 부등식, 극한과 적분의 순서를 바꿔도 되는 조건.`,
    summary: R`존재·유일성 정리, 수치해법의 오차 누적, 경사하강법의 수렴, KL 발산이 음수가 아니라는 사실은 모두 몇 개의 부등식으로 증명됩니다. 함수가 변하는 속도에 상한을 두는 **립시츠 조건**과 그 결과인 **그론월 부등식**과 **축소 사상 정리**, 크기를 누르는 **코시-슈바르츠·젠센 부등식**, 그리고 급수를 항별로 적분·미분해도 되는 조건인 **균등수렴**을 다룹니다.`,
    goals: [
      R`함수가 립시츠인지 판정하고 평균값 정리로 립시츠 상수를 구할 수 있다`,
      R`그론월 부등식으로 두 해의 차이가 지수적으로만 벌어진다는 것을 말할 수 있다`,
      R`고정점 반복이 수렴하는 조건을 축소 사상 정리로 확인할 수 있다`,
      R`코시-슈바르츠·젠센 부등식과 $1+x\le e^x$를 써서 간단한 상한을 증명할 수 있다`,
      R`점별수렴과 균등수렴을 구별하고 바이어슈트라스 M-판정을 쓸 수 있다`,
    ],
    sections: [
      { k: '5.1', src: '해석학 입문 · 연속성', title: '립시츠 조건', body: R`
연속성은 “입력이 조금 변하면 출력도 조금 변한다”는 말이지만 **얼마나** 조금인지는 말하지 않습니다. 립시츠 조건은 그 비율에 상한을 둡니다.

:::key 립시츠 조건
구간 $I$의 모든 $x,y$에 대해
$$\lvert f(x)-f(y)\rvert\le L\lvert x-y\rvert$$
인 상수 $L$이 있으면 $f$는 $I$에서 **립시츠**이고, $L$을 립시츠 상수라 합니다. 미분방정식 $y'=f(x,y)$에서는 $y$에 대해 $\lvert f(x,y_1)-f(x,y_2)\rvert\le L\lvert y_1-y_2\rvert$를 요구합니다.
:::

**판정.** $I$에서 $\lvert f'\rvert\le L$이면 평균값 정리[[ch01:1.2|평균값 정리: 함수값의 차이 = 도함수 × 입력의 차이.]]로 곧바로 립시츠 상수 $L$입니다. 거꾸로 립시츠 함수는 연속이지만 미분가능하지 않을 수 있습니다: $\lvert x\rvert$는 $L=1$인 립시츠 함수입니다.

:::ex 예제 1 (립시츠가 아닌 연속함수)
$f(y)=\sqrt{\lvert y\rvert}$는 $0$ 근처에서 립시츠인가?
---
$\dfrac{\lvert f(y)-f(0)\rvert}{\lvert y-0\rvert}=\dfrac1{\sqrt{\lvert y\rvert}}\to\infty$라서 어떤 $L$로도 누를 수 없습니다. 그래서 $y'=\sqrt{\lvert y\rvert}$, $y(0)=0$은 $y\equiv0$ 말고도 $y=x^2/4$ ($x\ge0$) 같은 해를 가져 유일성이 깨집니다.
:::

립시츠 조건이 중요한 이유는 **두 해의 차이가 지수적으로만 벌어진다**는 다음 부등식 때문입니다.

:::key 그론월 부등식
$u\ge0$이 연속이고 $u(x)\le u(x_0)+L\displaystyle\int_{x_0}^{x}u(s)\,ds$ ($x\ge x_0$)이면
$$u(x)\le u(x_0)\,e^{L(x-x_0)}$$
$y'=f(x,y)$의 두 해에 대해 $u=\lvert y_1-y_2\rvert$로 쓰면 $\lvert y_1(x)-y_2(x)\rvert\le\lvert y_1(x_0)-y_2(x_0)\rvert\,e^{L\lvert x-x_0\rvert}$입니다.
:::

초기값이 같으면 오른쪽이 0이라 두 해가 같습니다(유일성). 초기값이 조금 다르면 차이가 $e^{L\lvert x-x_0\rvert}$배까지만 커집니다(초기값에 대한 연속성). 오일러 방법의 오차 누적 증명에 나오는 $e^{L(X-x_0)}$도 같은 모양입니다.

**고정점 반복.** $x=g(x)$를 $x_{n+1}=g(x_n)$으로 풀 때도 립시츠 상수가 모든 것을 정합니다.

:::key 축소 사상 정리
$g$가 닫힌 구간 $I$를 $I$ 안으로 보내고 립시츠 상수 $L<1$이면, $I$에 고정점 $x^*=g(x^*)$가 **하나뿐**이고 어떤 $x_0\in I$에서 시작해도 반복이 수렴합니다.
$$\lvert x_n-x^*\rvert\le L^n\lvert x_0-x^*\rvert\le\frac{L^n}{1-L}\lvert x_1-x_0\rvert$$
:::

:::ex 예제 2 ($x=\cos x$)
$x_{n+1}=\cos x_n$이 $[0,1]$의 어느 점에서 시작해도 수렴함을 보이세요.
---
$\cos$은 $[0,1]$을 $[\cos1,1]\subset[0,1]$로 보내고, $\lvert(\cos x)'\rvert=\lvert\sin x\rvert\le\sin1\approx0.84<1$입니다. 축소 사상 정리로 유일한 고정점 $x^*\approx0.739085$로 수렴합니다. 오차는 한 번에 최소 $0.84$배로 줄어듭니다.
:::

:::idea 피카르 반복과 β-매끄러움
존재·유일성 정리의 피카르 반복 $y_{n+1}(x)=y_0+\int_{x_0}^xf(t,y_n(t))\,dt$는 함수 공간에서의 고정점 반복이고, 립시츠 조건이 짧은 구간에서 이 사상을 축소 사상으로 만듭니다. 최적화에서 “$f$가 β-매끄럽다”는 것은 **기울기** $\nabla f$가 립시츠 상수 $\beta$를 갖는다는 뜻입니다.
:::
` },
      { k: '5.2', src: '해석학 입문 · 부등식', title: '부등식 모음', body: R`
증명에서 “크기를 누른다”는 단계는 거의 다음 몇 개의 부등식입니다.

**삼각부등식.** $\lvert a+b\rvert\le\lvert a\rvert+\lvert b\rvert$, 거꾸로 $\big\lvert\lvert a\rvert-\lvert b\rvert\big\rvert\le\lvert a-b\rvert$. 복소수와 벡터에서도, 적분에서도 $\left\lvert\int f\right\rvert\le\int\lvert f\rvert$로 성립합니다.

:::key 코시-슈바르츠 부등식
내적공간에서 $\lvert\langle\mathbf u,\mathbf v\rangle\rvert\le\lVert\mathbf u\rVert\,\lVert\mathbf v\rVert$. 등호는 $\mathbf u,\mathbf v$가 평행할 때만 성립합니다.
$$\Big(\sum a_kb_k\Big)^2\le\sum a_k^2\sum b_k^2,\qquad \left(\int fg\right)^2\le\int f^2\int g^2$$
:::

두 벡터 사이의 각 $\cos\theta=\dfrac{\langle\mathbf u,\mathbf v\rangle}{\lVert\mathbf u\rVert\lVert\mathbf v\rVert}$가 $[-1,1]$에 들어가는 이유, 상관계수의 절댓값이 1 이하인 이유가 이 부등식입니다.

**지수와 로그의 부등식.** 모든 실수 $x$에 대해
$$1+x\le e^x,\qquad \ln x\le x-1\quad(x>0)$$
곡선 $e^x$가 $x=0$에서의 접선 $1+x$보다 늘 위에 있다는 것(볼록성)이고, 둘째 식은 첫째 식에 $\ln$을 씌운 것입니다. $(1+hL)^N\le e^{hLN}$처럼 거듭제곱을 지수로 바꿀 때 씁니다.

**볼록함수와 젠센 부등식.** $\varphi$가 볼록이면(그래프 위의 두 점을 이은 선분이 그래프 위에 있으면) 평균을 먼저 취하는 쪽이 작습니다.

:::key 젠센 부등식
$\varphi$가 볼록이고 $w_k\ge0$, $\sum w_k=1$이면
$$\varphi\Big(\sum w_kx_k\Big)\le\sum w_k\varphi(x_k),\qquad \text{확률로 쓰면}\quad \varphi\big(\mathbb E[X]\big)\le\mathbb E\big[\varphi(X)\big]$$
$\varphi$가 오목이면 부등호가 반대입니다.
:::

$\varphi(x)=x^2$이면 $(\mathbb E X)^2\le\mathbb E[X^2]$, 곧 분산이 0 이상이라는 말입니다. $\varphi=-\ln$이면 산술평균 ≥ 기하평균이 나옵니다.

:::ex 예제 1 (KL 발산은 0 이상)
확률분포 $p,q$에 대해 $\displaystyle\sum_kp_k\ln\frac{p_k}{q_k}\ge0$임을 보이세요.
---
$\ln x\le x-1$을 쓰면
$$-\sum_kp_k\ln\frac{p_k}{q_k}=\sum_kp_k\ln\frac{q_k}{p_k}\le\sum_kp_k\Big(\frac{q_k}{p_k}-1\Big)=\sum_kq_k-\sum_kp_k\le0$$
따라서 KL 발산은 0 이상이고, 등호는 모든 $k$에서 $q_k=p_k$일 때입니다. 젠센 부등식으로도 같은 결과가 나옵니다.
:::

:::ex 예제 2 (베르누이 부등식)
$x\ge-1$, 자연수 $n$에 대해 $(1+x)^n\ge1+nx$임을 보이세요.
---
$n=1$이면 등호. $(1+x)^n\ge1+nx$라 하면 $1+x\ge0$을 곱해 $(1+x)^{n+1}\ge(1+nx)(1+x)=1+(n+1)x+nx^2\ge1+(n+1)x$. 수학적 귀납법으로 성립합니다.
:::
` },
      { k: '5.3', src: '해석학 입문 · 함수열', title: '균등수렴', body: R`
함수열 $f_n\to f$에는 두 가지 뜻이 있습니다. **점별수렴**은 각 $x$마다 $f_n(x)\to f(x)$라는 뜻이고, **균등수렴**은 모든 $x$에서 **한꺼번에** 가까워진다는 뜻입니다.
$$\sup_{x\in I}\lvert f_n(x)-f(x)\rvert\to0$$
점별수렴만으로는 연속성, 적분, 미분이 극한으로 넘어가지 않습니다.

:::ex 예제 1 ($x^n$)
$[0,1]$에서 $f_n(x)=x^n$은 어디로, 어떻게 수렴하는가?
---
$0\le x<1$에서 $x^n\to0$, $x=1$에서 $1$이라 극한함수는 불연속입니다. 연속함수들의 극한이 불연속이 되었으므로 균등수렴이 아닙니다(실제로 $\sup\lvert x^n-f\rvert=1$). 구간을 $[0,0.9]$로 줄이면 $\sup=0.9^n\to0$이라 균등수렴합니다.
:::

:::key 균등수렴과 그 효과
$I$에서 $f_n\to f$가 균등수렴하면
1. $f_n$이 모두 연속이면 $f$도 연속
2. $\displaystyle\int_a^b f_n\,dx\to\int_a^b f\,dx$ (극한과 적분의 순서를 바꿔도 된다)
3. 미분은 더 까다롭다: $f_n'$이 균등수렴하고 $f_n$이 한 점에서 수렴하면 $f'=\lim f_n'$
:::

급수 $\sum u_k(x)$는 부분합의 함수열로 보면 됩니다. 균등수렴을 확인하는 가장 쉬운 방법은 다음 판정입니다.

:::thm 바이어슈트라스 M-판정
$I$에서 $\lvert u_k(x)\rvert\le M_k$이고 $\sum M_k$가 수렴하면 $\sum u_k(x)$는 $I$에서 균등수렴(그리고 절대수렴)합니다.
:::

예를 들어 $\sum\frac{\sin kx}{k^2}$는 $M_k=\frac1{k^2}$로 모든 실수에서 균등수렴하므로 연속함수이고 항별로 적분할 수 있습니다. 거듭제곱급수는 수렴반지름보다 작은 닫힌 구간 $\lvert x-x_0\rvert\le r<R$에서 균등수렴하므로, 수렴 구간 안에서 항별 적분·미분이 정당합니다[[ch03:3.3|거듭제곱급수와 수렴반지름: 수렴 구간 안에서는 다항식처럼 다룬다.]].

:::ex 예제 2 (적분이 극한과 바뀌지 않는 경우)
$f_n(x)=nxe^{-nx^2}$는 $[0,1]$에서 $0$으로 점별수렴하지만 $\int_0^1f_n\,dx\to\tfrac12$임을 보이세요.
---
$x=0$이면 $f_n=0$이고, $x>0$이면 지수가 이겨 $f_n(x)\to0$입니다. 그런데
$$\int_0^1nxe^{-nx^2}dx=\Big[-\tfrac12e^{-nx^2}\Big]_0^1=\tfrac12\big(1-e^{-n}\big)\to\tfrac12\ne0$$
봉우리가 $x=\frac1{\sqrt{2n}}$ 근처로 몰리면서 높이 $\sqrt{n/(2e)}$로 솟기 때문에 균등수렴이 아닙니다.
:::

:::warn 불연속함수의 푸리에 급수
연속함수의 균등극한은 연속이므로, 계단함수 같은 불연속함수의 푸리에 급수는 균등수렴할 수 없습니다. 불연속점 근처에서 부분합이 약 9% 튀어 오르는 깁스 현상이 그 흔적입니다.
:::
` },
    ],
    problems: [
      { sec: '5.1', type: 'num', lv: 1, q: R`$f(x)=\sin(2x)$의 실수 전체에서의 가장 작은 립시츠 상수는?`, ans: '2', ansTex: R`2`,
        sol: R`$\lvert f'\rvert=\lvert2\cos2x\rvert\le2$이고 $x=0$에서 2가 되므로 가장 작은 상수는 2입니다.` },
      { sec: '5.1', type: 'mc', lv: 2, q: R`$y'=f(x,y)$, $y(0)=0$의 해가 유일하다고 **보장되지 않는** 경우는?`,
        choices: [R`$f=y^{2/3}$`, R`$f=\sin y$`, R`$f=xy$`, R`$f=e^x-y$`], ans: 0,
        sol: R`$y^{2/3}$은 $y=0$에서 $\partial f/\partial y=\tfrac23y^{-1/3}$이 발산하고 립시츠가 아닙니다. 실제로 $y\equiv0$과 $y=x^3/27$이 모두 해입니다. 나머지는 $f_y$가 유계라 립시츠입니다.` },
      { sec: '5.1', type: 'num', lv: 2, q: R`$g(x)=\tfrac12\cos x$의 고정점 반복에서 오차가 한 걸음마다 줄어드는 비율의 상한(립시츠 상수)은?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`$\lvert g'\rvert=\tfrac12\lvert\sin x\rvert\le\tfrac12$. 따라서 $\lvert x_{n+1}-x^*\rvert\le\tfrac12\lvert x_n-x^*\rvert$입니다.` },
      { sec: '5.2', type: 'num', lv: 2, q: R`$x+2y+2z=9$ 위에서 $x^2+y^2+z^2$의 최솟값은? (코시-슈바르츠 이용)`, ans: '9', ansTex: R`9`,
        sol: R`$81=(x+2y+2z)^2\le(1+4+4)(x^2+y^2+z^2)$이므로 $x^2+y^2+z^2\ge9$. 등호는 $(x,y,z)\parallel(1,2,2)$, 곧 $(1,2,2)$에서 성립합니다.` },
      { sec: '5.2', type: 'mc', lv: 2, q: R`양수 $a,b$에 대해 젠센 부등식을 오목함수 $\ln$에 쓰면 얻는 것은?`,
        choices: [R`$\ln\frac{a+b}2\ge\frac{\ln a+\ln b}2$, 곧 $\frac{a+b}2\ge\sqrt{ab}$`, R`$\ln\frac{a+b}2\le\frac{\ln a+\ln b}2$`, R`$\frac{a+b}{2}\le\sqrt{ab}$`, R`$\ln(a+b)=\ln a+\ln b$`], ans: 0,
        sol: R`오목함수에서는 $\varphi(\text{평균})\ge\text{평균}(\varphi)$. $\frac{\ln a+\ln b}{2}=\ln\sqrt{ab}$이므로 산술-기하 평균 부등식이 나옵니다.` },
      { sec: '5.3', type: 'mc', lv: 2, q: R`다음 중 $[0,1]$에서 $0$으로 **균등수렴**하는 함수열은?`,
        choices: [R`$\dfrac{x}{n}$`, R`$x^n$`, R`$nxe^{-nx^2}$`, R`$\dfrac{nx}{1+n^2x^2}$`], ans: 0,
        sol: R`$\sup\frac xn=\frac1n\to0$. $x^n$은 극한이 불연속, $nxe^{-nx^2}$와 $\frac{nx}{1+n^2x^2}$는 각각 $x=\frac1{\sqrt{2n}}$, $x=\frac1n$에서 최댓값이 $\sqrt{n/(2e)}$, $\frac12$로 0으로 가지 않습니다.` },
      { sec: '5.3', type: 'open', lv: 3, q: R`$\displaystyle\sum_{k=1}^\infty\frac{\cos kx}{k^3}$이 모든 실수에서 미분가능하고 도함수가 $-\sum\frac{\sin kx}{k^2}$임을 보이세요.`,
        sol: R`항별 미분한 급수 $-\sum\frac{\sin kx}{k^2}$는 $M_k=\frac1{k^2}$로 M-판정에 의해 균등수렴하고, 원래 급수도 $M_k=\frac1{k^3}$로 (특히 한 점에서) 수렴합니다. 균등수렴의 효과 3번에 의해 원래 급수는 미분가능하고 도함수는 항별 미분과 같습니다.` },
    ],
  });
})();
