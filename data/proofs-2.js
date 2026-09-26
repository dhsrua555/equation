/* 증명 — 03 연립 ODE, 04 급수해, 05 라플라스 변환 */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 03
  { ch: 'ch03', id: 'reduce-order', title: 'n계 ODE와 1계 연립 ODE의 동치성', keys: ['n계 ODE → 1계 연립'],
    tags: 'higher order to first order system companion matrix 고계 1계 연립 변환 동치',
    stmt: R`$y^{(n)}=F(t,y,\dots,y^{(n-1)})$의 해 $y$와, $y_1'=y_2,\dots,y_{n-1}'=y_n,\ y_n'=F(t,y_1,\dots,y_n)$의 해 $(y_1,\dots,y_n)$은 $y_k=y^{(k-1)}$로 일대일 대응한다.`,
    body: R`
$y$가 해이면 $y_k=y^{(k-1)}$로 두었을 때 $y_k'=y^{(k)}=y_{k+1}$ ($k<n$)이고 $y_n'=y^{(n)}=F(t,y_1,\dots,y_n)$이므로 연립계의 해입니다.

거꾸로 $(y_1,\dots,y_n)$이 연립계의 해이면 $y_2=y_1'$, $y_3=y_2'=y_1''$, …, $y_n=y_1^{(n-1)}$이고, 마지막 식이 $y_1^{(n)}=F(t,y_1,y_1',\dots,y_1^{(n-1)})$이므로 $y=y_1$이 원래 방정식의 해입니다. 초기조건 $y(t_0),\dots,y^{(n-1)}(t_0)$은 벡터 초기조건 $\mathbf y(t_0)$와 같습니다.

선형 상수계수이면 $A$의 특성다항식이 원래 방정식의 특성다항식과 같습니다(동반행렬).` },
  { ch: 'ch03', id: 'eigmethod', title: '고유값 방법이 일반해를 주는 이유', keys: ['고유값 방법'],
    tags: 'eigenvalue method system general solution 고유값 방법 연립 일반해',
    stmt: R`$A\mathbf x=\lambda\mathbf x$이면 $\mathbf y=\mathbf xe^{\lambda t}$는 $\mathbf y'=A\mathbf y$의 해이다. 독립인 고유벡터가 $n$개이면 모든 해는 $\sum c_j\mathbf x^{(j)}e^{\lambda_jt}$ 꼴이다.`,
    body: R`
$\mathbf y=\mathbf xe^{\lambda t}$이면 $\mathbf y'=\lambda\mathbf xe^{\lambda t}=(A\mathbf x)e^{\lambda t}=A\mathbf y$입니다. 계가 선형이므로 해들의 일차결합도 해입니다.

$\mathbf y(t)=\sum c_j\mathbf x^{(j)}e^{\lambda_jt}$에서 $t=0$을 넣으면 $\mathbf y(0)=X\mathbf c$ ($X$는 고유벡터를 열로 모은 행렬)입니다. 고유벡터가 독립이면 $X$가 가역이므로 임의의 초기값 $\mathbf y(0)$에 맞는 $\mathbf c=X^{-1}\mathbf y(0)$를 고를 수 있습니다. 유일성 정리에 의해 모든 해가 이 꼴입니다.

실제로 이 해들의 론스키안은 $\det X\cdot e^{(\lambda_1+\cdots+\lambda_n)t}\ne0$입니다.` },
  { ch: 'ch03', id: 'repeated', title: '중복 고유값의 두 번째 해', keys: ['고유값 방법'],
    tags: 'repeated eigenvalue generalized eigenvector defective 중복 고유값 일반화 고유벡터',
    stmt: R`$(A-\lambda I)\mathbf x=\mathbf 0$, $(A-\lambda I)\mathbf u=\mathbf x$이면 $\mathbf y=\mathbf x\,te^{\lambda t}+\mathbf u\,e^{\lambda t}$는 $\mathbf y'=A\mathbf y$의 해이다.`,
    body: R`
미분하면
$$\mathbf y'=\mathbf xe^{\lambda t}+\lambda\mathbf x\,te^{\lambda t}+\lambda\mathbf u\,e^{\lambda t}$$
한편 $A\mathbf x=\lambda\mathbf x$, $A\mathbf u=\lambda\mathbf u+\mathbf x$이므로
$$A\mathbf y=A\mathbf x\,te^{\lambda t}+A\mathbf u\,e^{\lambda t}=\lambda\mathbf x\,te^{\lambda t}+(\lambda\mathbf u+\mathbf x)e^{\lambda t}$$
두 식이 같습니다. $\mathbf x\,te^{\lambda t}$만으로는 $\mathbf xe^{\lambda t}$ 항이 남아 해가 되지 않으므로 $\mathbf u$가 필요합니다.` },
  { ch: 'ch03', id: 'complexeig', title: '복소 고유값에서 실수해 만들기', keys: ['고유값 방법'],
    tags: 'complex eigenvalue real solution 복소 고유값 실수해',
    stmt: R`실행렬 $A$의 고유값 $\lambda=\alpha+i\beta$, 고유벡터 $\mathbf x=\mathbf a+i\mathbf b$에 대해 $e^{\alpha t}(\mathbf a\cos\beta t-\mathbf b\sin\beta t)$와 $e^{\alpha t}(\mathbf a\sin\beta t+\mathbf b\cos\beta t)$는 실수해이다.`,
    body: R`
$\mathbf z=\mathbf xe^{\lambda t}$는 복소해입니다. $A$가 실수이므로
$$(\Re\mathbf z)'=\Re(\mathbf z')=\Re(A\mathbf z)=A\,\Re\mathbf z$$
허수부도 같습니다. 오일러 공식으로 전개하면
$$(\mathbf a+i\mathbf b)e^{\alpha t}(\cos\beta t+i\sin\beta t)=e^{\alpha t}\big[(\mathbf a\cos\beta t-\mathbf b\sin\beta t)+i(\mathbf a\sin\beta t+\mathbf b\cos\beta t)\big]$$
실수부와 허수부가 위의 두 해입니다. 켤레 고유값 $\bar\lambda$는 새로운 실수해를 주지 않습니다.` },
  { ch: 'ch03', id: 'classify', title: '대각합과 행렬식에 의한 임계점 분류', keys: ['임계점의 종류'],
    tags: 'critical point classification trace determinant stability node saddle center spiral 임계점 분류 안정성 대각합 행렬식',
    stmt: R`$2\times2$ 행렬 $A$의 고유값은 $\lambda^2-p\lambda+q=0$ ($p=\tr A$, $q=\det A$)의 근이며, 임계점의 종류와 안정성은 $p$, $q$, $\Delta=p^2-4q$로 결정된다.`,
    body: R`
$$\det(A-\lambda I)=(a_{11}-\lambda)(a_{22}-\lambda)-a_{12}a_{21}=\lambda^2-(a_{11}+a_{22})\lambda+\det A$$
이므로 $\lambda_1+\lambda_2=p$, $\lambda_1\lambda_2=q$, $\lambda=\tfrac12(p\pm\sqrt\Delta)$입니다.

- $q<0$: 곱이 음수이므로 부호가 다른 두 실근. 한 방향으로는 자라고 다른 방향으로는 줄어드는 **안장점**(불안정).
- $q>0,\ \Delta\ge0$: 부호가 같은 두 실근이고 부호는 $p$와 같음. **마디점**, $p<0$이면 안정.
- $\Delta<0$: $\lambda=\tfrac p2\pm i\omega$. 해는 $e^{pt/2}(\cos\omega t,\sin\omega t)$의 결합이므로 $p\ne0$이면 **나선점**, $p=0$이면 주기해인 **중심**.

모든 해가 0으로 가려면 두 고유값의 실수부가 모두 음수여야 하고, 이는 $p<0$, $q>0$과 같습니다.` },
  { ch: 'ch03', id: 'linearization', title: '비선형계의 선형화', keys: [],
    tags: 'linearization jacobian nonlinear 선형화 야코비 비선형 진자',
    sketch: R`선형화 정리(푸앵카레–랴푸노프)의 증명은 길어 생략하고, 선형화 식의 유도와 중심이 보존되지 않는 예를 보입니다.`,
    stmt: R`$\mathbf f(\mathbf y_0)=\mathbf 0$일 때 $\tilde{\mathbf y}=\mathbf y-\mathbf y_0$는 $\tilde{\mathbf y}'=J\tilde{\mathbf y}+\mathbf h(\tilde{\mathbf y})$, $|\mathbf h|=o(|\tilde{\mathbf y}|)$를 만족한다. 선형화한 계가 마디·안장·나선이면 원래 계도 같은 종류이지만, 중심은 보존되지 않을 수 있다.`,
    body: R`
테일러 전개로 $\mathbf f(\mathbf y)=\mathbf f(\mathbf y_0)+J(\mathbf y-\mathbf y_0)+\mathbf h$이고 $\mathbf f(\mathbf y_0)=\mathbf 0$이므로 위 식이 나옵니다. 임계점 근처에서는 $\mathbf h$가 $J\tilde{\mathbf y}$보다 훨씬 작아 선형 항이 궤적의 모양을 정합니다.

**중심이 깨지는 예.** $y_1'=y_2-y_1r^2$, $y_2'=-y_1-y_2r^2$ ($r^2=y_1^2+y_2^2$)의 선형화는 $\begin{pmatrix}0&1\\-1&0\end{pmatrix}$로 중심입니다. 그러나
$$rr'=y_1y_1'+y_2y_2'=-(y_1^2+y_2^2)r^2=-r^4$$
이므로 $r'=-r^3<0$이고, 실제 궤적은 원점으로 감겨 들어가는 나선입니다. 선형화에서 $p=0$인 경우는 비선형 항이 안정성을 결정합니다.` },
  // ───── 04
  { ch: 'ch04', id: 'shift', title: '급수 지수 옮기기', keys: ['지수 옮기기'],
    tags: 'index shift power series 지수 옮기기 거듭제곱급수',
    stmt: R`$y=\sum a_mx^m$이면 $y'=\sum_{s\ge0}(s+1)a_{s+1}x^s$, $y''=\sum_{s\ge0}(s+2)(s+1)a_{s+2}x^s$.`,
    body: R`
항별 미분으로 $y''=\sum_{m=0}^\infty m(m-1)a_mx^{m-2}$. $m=0,1$ 항은 계수가 0이므로 합은 $m=2$부터 시작합니다. $s=m-2$로 바꾸면 $m=s+2$이고 $s$는 0부터 시작하므로
$$y''=\sum_{s=0}^\infty(s+2)(s+1)a_{s+2}x^s$$
$y'$도 같은 방법($s=m-1$)입니다. 수렴반경 안에서는 항별 미분이 허용됩니다.` },
  { ch: 'ch04', id: 'legendre-rec', title: '르장드르 방정식의 점화식', keys: ['르장드르 다항식'],
    tags: 'legendre recurrence 르장드르 점화식 다항식',
    stmt: R`$(1-x^2)y''-2xy'+n(n+1)y=0$의 급수해 계수는 $a_{s+2}=-\dfrac{(n-s)(n+s+1)}{(s+2)(s+1)}a_s$를 만족한다.`,
    body: R`
$y=\sum a_mx^m$을 넣고 $x^s$의 계수를 모읍니다.
- $y''$에서: $(s+2)(s+1)a_{s+2}$
- $-x^2y''$에서: $-s(s-1)a_s$
- $-2xy'$에서: $-2sa_s$
- $n(n+1)y$에서: $n(n+1)a_s$

합이 0이어야 하고, $-s(s-1)-2s+n(n+1)=n(n+1)-s(s+1)=(n-s)(n+s+1)$이므로
$$(s+2)(s+1)a_{s+2}+(n-s)(n+s+1)a_s=0$$
$s=n$이면 $a_{n+2}=0$이 되어, $n$과 홀짝이 같은 쪽 급수는 차수 $n$에서 끝나는 다항식이 됩니다.` },
  { ch: 'ch04', id: 'legendre-orth', title: '르장드르 다항식의 직교성과 노름', keys: ['르장드르 다항식'],
    tags: 'legendre orthogonality norm rodrigues 르장드르 직교성 노름 로드리게스',
    stmt: R`$\displaystyle\int_{-1}^{1}P_mP_n\,dx=0\ (m\ne n)$, $\displaystyle\int_{-1}^{1}P_n^2\,dx=\frac{2}{2n+1}$.`,
    body: R`
**직교성.** 르장드르 방정식은 $\big[(1-x^2)P_n'\big]'+n(n+1)P_n=0$으로 쓸 수 있습니다. 이 식에 $P_m$을, $m$에 대한 식에 $P_n$을 곱해 빼고 적분하면
$$\int_{-1}^1\Big\{P_m\big[(1-x^2)P_n'\big]'-P_n\big[(1-x^2)P_m'\big]'\Big\}dx+\big[n(n+1)-m(m+1)\big]\int_{-1}^1P_mP_n\,dx=0$$
첫 적분의 피적분함수는 $\big[(1-x^2)(P_mP_n'-P_nP_m')\big]'$이고 $x=\pm1$에서 $1-x^2=0$이므로 0입니다. $m\ne n$이면 대괄호가 0이 아니므로 $\int P_mP_n=0$.

**노름.** 로드리게스 공식 $P_n=\dfrac1{2^nn!}D^nu$, $u=(x^2-1)^n$을 쓰고 $n$번 부분적분합니다. $k<n$이면 $D^ku$는 $x=\pm1$에서 0이므로 경계항이 모두 사라지고, $D^{2n}u=(2n)!$입니다.
$$\int_{-1}^1P_n^2dx=\frac{(2n)!}{(2^nn!)^2}\int_{-1}^1(1-x^2)^ndx=\frac{(2n)!}{(2^nn!)^2}\cdot\frac{2^{2n+1}(n!)^2}{(2n+1)!}=\frac{2}{2n+1}$$
마지막 적분은 $x=\sin\theta$로 치환해 얻는 왈리스 적분입니다.` },
  { ch: 'ch04', id: 'indicial', title: '결정방정식의 유도와 세 경우', keys: ['결정방정식과 세 경우'],
    tags: 'frobenius indicial equation regular singular 프로베니우스 결정방정식 정칙 특이점',
    stmt: R`$x^2y''+xb(x)y'+c(x)y=0$에 $y=x^r\sum a_mx^m$ ($a_0\ne0$)을 넣으면 $r(r-1)+b_0r+c_0=0$이 나온다.`,
    body: R`
$b=\sum b_kx^k$, $c=\sum c_kx^k$로 두고 $y=\sum a_mx^{m+r}$를 넣으면 가장 낮은 거듭제곱 $x^r$의 계수는
$$\big[r(r-1)+b_0r+c_0\big]a_0=0$$
$a_0\ne0$이므로 결정방정식을 얻습니다. $I(r)=r(r-1)+b_0r+c_0$이라 하면 $x^{m+r}$의 계수에서
$$I(m+r)\,a_m=-(\text{$a_0,\dots,a_{m-1}$의 일차결합})$$
이 나옵니다.

- 큰 근 $r_1$에서는 $I(m+r_1)\ne0$ ($m\ge1$)이라 모든 $a_m$이 정해집니다.
- 작은 근 $r_2$에서 $r_1-r_2=N$이 양의 정수이면 $I(r_2+N)=I(r_1)=0$이라 $m=N$에서 점화식이 막힐 수 있습니다. 그래서 $\ln x$ 항이 필요할 수 있습니다(경우 3).
- 중근이면 급수해가 하나뿐이고, 계수 내림법을 쓰면 $\ln x$ 항이 나타납니다(경우 2).` },
  { ch: 'ch04', id: 'gamma', title: '감마 함수의 성질', keys: ['감마 함수'],
    tags: 'gamma function factorial gaussian integral 감마 함수 계승 가우스 적분',
    stmt: R`$\Gamma(\nu+1)=\nu\Gamma(\nu)$, $\Gamma(n+1)=n!$, $\Gamma(\tfrac12)=\sqrt\pi$.`,
    body: R`
부분적분으로 ($\nu>0$)
$$\Gamma(\nu+1)=\int_0^\infty e^{-t}t^{\nu}dt=\Big[-e^{-t}t^{\nu}\Big]_0^\infty+\nu\int_0^\infty e^{-t}t^{\nu-1}dt=\nu\Gamma(\nu)$$
$\Gamma(1)=\int_0^\infty e^{-t}dt=1$이므로 귀납적으로 $\Gamma(n+1)=n!$.

$\Gamma(\tfrac12)=\int_0^\infty e^{-t}t^{-1/2}dt$에서 $t=u^2$이면 $2\int_0^\infty e^{-u^2}du=\int_{-\infty}^\infty e^{-u^2}du=:I$. 극좌표로
$$I^2=\iint_{\mathbb R^2}e^{-(x^2+y^2)}dx\,dy=\int_0^{2\pi}\!\!\int_0^\infty e^{-r^2}r\,dr\,d\theta=\pi$$
이므로 $\Gamma(\tfrac12)=\sqrt\pi$.` },
  { ch: 'ch04', id: 'bessel-id', title: '베셀 함수의 미분 항등식과 $J_{1/2}$', keys: ['베셀 함수'],
    tags: 'bessel identity recurrence derivative 베셀 항등식 점화식 미분',
    stmt: R`$(x^\nu J_\nu)'=x^\nu J_{\nu-1}$, $(x^{-\nu}J_\nu)'=-x^{-\nu}J_{\nu+1}$이고, 이로부터 $J_{\nu-1}+J_{\nu+1}=\frac{2\nu}xJ_\nu$, $J_{\nu-1}-J_{\nu+1}=2J_\nu'$. 또 $J_{1/2}=\sqrt{2/(\pi x)}\sin x$.`,
    body: R`
$x^\nu J_\nu=\sum\dfrac{(-1)^mx^{2m+2\nu}}{2^{2m+\nu}m!\,\Gamma(\nu+m+1)}$을 항별 미분하고 $2m+2\nu=2(\nu+m)$, $\Gamma(\nu+m+1)=(\nu+m)\Gamma(\nu+m)$을 쓰면
$$(x^\nu J_\nu)'=\sum\frac{(-1)^mx^{2m+2\nu-1}}{2^{2m+\nu-1}m!\,\Gamma(\nu+m)}=x^\nu\sum\frac{(-1)^mx^{2m+\nu-1}}{2^{2m+\nu-1}m!\,\Gamma\big((\nu-1)+m+1\big)}=x^\nu J_{\nu-1}$$
두 번째 식은 $x^{-\nu}J_\nu$를 미분하면 $m=0$ 항이 사라지고, $m=k+1$로 옮기면 $-x^{-\nu}J_{\nu+1}$이 됩니다.

두 식을 전개하면 $J_\nu'+\frac\nu xJ_\nu=J_{\nu-1}$, $J_\nu'-\frac\nu xJ_\nu=-J_{\nu+1}$. 빼면 첫 점화식, 더하면 둘째 점화식입니다.

$\nu=\tfrac12$: $\Gamma(m+\tfrac32)=\dfrac{(2m+1)!\sqrt\pi}{2^{2m+1}m!}$을 넣으면 각 항이 $\sqrt{\dfrac{2}{\pi x}}\cdot\dfrac{(-1)^mx^{2m+1}}{(2m+1)!}$이 되어, 합은 $\sqrt{2/(\pi x)}\,\sin x$입니다.` },
  // ───── 05
  { ch: 'ch05', id: 'basic-table', title: '기본 라플라스 변환의 계산', keys: ['기본 변환표'],
    tags: 'laplace transform table exponential power cosine sine 라플라스 변환표 지수 거듭제곱 삼각',
    stmt: R`$\mathcal L(e^{at})=\frac1{s-a}$, $\mathcal L(t^{a})=\frac{\Gamma(a+1)}{s^{a+1}}$, $\mathcal L(\cos\omega t)=\frac{s}{s^2+\omega^2}$, $\mathcal L(\sin\omega t)=\frac{\omega}{s^2+\omega^2}$, $\mathcal L(\cosh at)=\frac{s}{s^2-a^2}$, $\mathcal L(\sinh at)=\frac{a}{s^2-a^2}$.`,
    body: R`
**지수.** $s>a$이면 $\displaystyle\int_0^\infty e^{-(s-a)t}dt=\frac1{s-a}$. $a=0$이면 $\mathcal L(1)=\frac1s$.

**거듭제곱.** $st=x$로 치환하면
$$\int_0^\infty e^{-st}t^{a}dt=\frac1{s^{a+1}}\int_0^\infty e^{-x}x^{a}dx=\frac{\Gamma(a+1)}{s^{a+1}}$$
$a=n$이면 $n!/s^{n+1}$.

**삼각함수.** 선형성과 $e^{i\omega t}=\cos\omega t+i\sin\omega t$로
$$\mathcal L(e^{i\omega t})=\frac1{s-i\omega}=\frac{s+i\omega}{s^2+\omega^2}$$
실수부와 허수부가 각각 $\cos$, $\sin$의 변환입니다.

**쌍곡선함수.** $\cosh at=\tfrac12(e^{at}+e^{-at})$이므로 $\tfrac12\Big(\frac1{s-a}+\frac1{s+a}\Big)=\frac{s}{s^2-a^2}$. $\sinh$도 같습니다.` },
  { ch: 'ch05', id: 's-shift', title: 's-이동 정리', keys: ['s-이동 (제1이동정리)'],
    tags: 'first shifting theorem s-shifting 제1이동정리 s이동',
    stmt: R`$\mathcal L\{e^{at}f(t)\}=F(s-a)$.`,
    body: R`
$$\mathcal L\{e^{at}f\}=\int_0^\infty e^{-st}e^{at}f(t)\,dt=\int_0^\infty e^{-(s-a)t}f(t)\,dt=F(s-a)$$
적분이 존재하려면 $s-a$가 $F$의 존재 범위에 있어야 합니다. 역변환은 같은 식을 거꾸로 읽은 것입니다.` },
  { ch: 'ch05', id: 'derivative', title: '도함수와 적분의 라플라스 변환', keys: ['도함수와 적분의 변환'],
    tags: 'laplace derivative integral initial value 라플라스 도함수 적분 초기값 부분적분',
    stmt: R`$f$가 연속이고 지수 차수이며 $f'$이 구간별 연속이면 $\mathcal L(f')=sF-f(0)$. 따라서 $\mathcal L(f'')=s^2F-sf(0)-f'(0)$, $\mathcal L\{\int_0^tf\,d\tau\}=F/s$.`,
    body: R`
부분적분하면
$$\int_0^\infty e^{-st}f'(t)\,dt=\Big[e^{-st}f(t)\Big]_0^\infty+s\int_0^\infty e^{-st}f(t)\,dt=-f(0)+sF(s)$$
$|f|\le Me^{kt}$이고 $s>k$이면 $e^{-st}f(t)\to0$이기 때문입니다.

$f''$에 두 번 적용하면 $\mathcal L(f'')=s\mathcal L(f')-f'(0)=s^2F-sf(0)-f'(0)$.

적분: $g(t)=\int_0^tf\,d\tau$라 하면 $g'=f$, $g(0)=0$이므로 $F=\mathcal L(g')=s\,\mathcal L(g)$, 즉 $\mathcal L(g)=F/s$.` },
  { ch: 'ch05', id: 't-shift', title: 't-이동 정리', keys: ['t-이동 (제2이동정리)'],
    tags: 'second shifting theorem unit step heaviside t-shifting 제2이동정리 단위계단',
    stmt: R`$\mathcal L\{f(t-a)u(t-a)\}=e^{-as}F(s)$ ($a\ge0$).`,
    body: R`
$t<a$에서는 $u(t-a)=0$이므로
$$\mathcal L\{f(t-a)u(t-a)\}=\int_a^\infty e^{-st}f(t-a)\,dt$$
$\tau=t-a$로 치환하면
$$\int_0^\infty e^{-s(\tau+a)}f(\tau)\,d\tau=e^{-as}F(s)$$
$f=1$이면 $\mathcal L\{u(t-a)\}=e^{-as}/s$. 다른 꼴 $\mathcal L\{g(t)u(t-a)\}=e^{-as}\mathcal L\{g(t+a)\}$는 $f(\tau)=g(\tau+a)$로 두면 같은 식입니다.` },
  { ch: 'ch05', id: 'delta', title: '디랙 델타의 라플라스 변환', keys: [],
    tags: 'dirac delta impulse 디랙 델타 충격',
    stmt: R`$\mathcal L\{\delta(t-a)\}=e^{-as}$.`,
    body: R`
델타를 넓이 1인 짧은 펄스 $f_k=\dfrac1k\big[u(t-a)-u(t-a-k)\big]$의 극한($k\to0$)으로 봅니다.
$$\mathcal L(f_k)=\frac1{ks}\big(e^{-as}-e^{-(a+k)s}\big)=e^{-as}\,\frac{1-e^{-ks}}{ks}$$
로피탈 정리로 $\dfrac{1-e^{-ks}}{ks}\to1$이므로 극한은 $e^{-as}$입니다. 선별성질 $\int g(t)\delta(t-a)\,dt=g(a)$에 $g=e^{-st}$를 넣어도 같은 결과입니다.` },
  { ch: 'ch05', id: 'partial-fraction', title: '부분분수 계수의 가림법', keys: [],
    tags: 'partial fraction cover-up heaviside inverse laplace 부분분수 가림법 헤비사이드 역변환',
    stmt: R`$a$가 분모의 단순근이면 $F(s)$의 부분분수 전개에서 $\dfrac{A}{s-a}$의 계수는 $A=\big[(s-a)F(s)\big]_{s=a}$. 특히 $F=P/Q$이면 $A=P(a)/Q'(a)$.`,
    body: R`
$F(s)=\dfrac{A}{s-a}+R(s)$로 쓰면 $R$은 $s=a$에서 유한합니다. 양변에 $s-a$를 곱하면
$$(s-a)F(s)=A+(s-a)R(s)$$
$s\to a$로 보내면 $A$만 남습니다. $Q(a)=0$이면 $\dfrac{s-a}{Q(s)}\to\dfrac1{Q'(a)}$이므로 $A=\dfrac{P(a)}{Q'(a)}$. 따라서 서로 다른 단순근만 있으면
$$\mathcal L^{-1}\Big\{\frac{P}{Q}\Big\}=\sum_k\frac{P(a_k)}{Q'(a_k)}e^{a_kt}$$` },
  { ch: 'ch05', id: 'convolution', title: '합성곱 정리', keys: ['합성곱 정리'],
    tags: 'convolution theorem 합성곱 정리 적분 순서',
    stmt: R`$\mathcal L(f*g)=F(s)G(s)$, $(f*g)(t)=\displaystyle\int_0^tf(\tau)g(t-\tau)\,d\tau$.`,
    body: R`
고정된 $\tau$에 대해 $G(s)=\int_0^\infty e^{-sp}g(p)\,dp$에서 $p=t-\tau$로 치환하면 $G(s)=e^{s\tau}\int_\tau^\infty e^{-st}g(t-\tau)\,dt$. 따라서
$$F(s)G(s)=\int_0^\infty f(\tau)\,e^{-s\tau}G(s)\,d\tau=\int_0^\infty\!\!\int_\tau^\infty e^{-st}f(\tau)g(t-\tau)\,dt\,d\tau$$
적분 영역은 $0\le\tau\le t<\infty$이므로 순서를 바꾸면
$$\int_0^\infty e^{-st}\Big[\int_0^tf(\tau)g(t-\tau)\,d\tau\Big]dt=\mathcal L(f*g)$$
($s$가 충분히 크면 절대수렴하므로 순서 교환이 허용됩니다.) $\tau\to t-\tau$ 치환으로 $f*g=g*f$도 확인됩니다.` },
  { ch: 'ch05', id: 'sdiff', title: '$tf(t)$와 $f(t)/t$의 변환', keys: ['기타 성질'],
    tags: 'differentiation of transform integration of transform s-derivative 변환의 미분 변환의 적분',
    stmt: R`$\mathcal L\{tf(t)\}=-F'(s)$, $\mathcal L\Big\{\dfrac{f(t)}{t}\Big\}=\displaystyle\int_s^\infty F(\sigma)\,d\sigma$.`,
    body: R`
적분 기호 안에서 $s$로 미분하면 (지수 차수 함수에 대해 허용됨)
$$F'(s)=\int_0^\infty\frac{\partial}{\partial s}e^{-st}f(t)\,dt=-\int_0^\infty e^{-st}\,tf(t)\,dt=-\mathcal L\{tf\}$$
두 번째 식: $g=f/t$로 두면 $f=tg$이므로 $F=-G'$. $G(s)\to0$ ($s\to\infty$)이므로
$$G(s)=-\int_\infty^sF(\sigma)\,d\sigma=\int_s^\infty F(\sigma)\,d\sigma$$` },
  { ch: 'ch05', id: 'periodic', title: '주기함수의 라플라스 변환', keys: ['기타 성질'],
    tags: 'periodic function laplace geometric series 주기함수 등비급수',
    stmt: R`주기 $p$인 $f$에 대해 $\mathcal L(f)=\dfrac{1}{1-e^{-ps}}\displaystyle\int_0^pe^{-st}f(t)\,dt$.`,
    body: R`
적분 구간을 한 주기씩 나누고 $t=\tau+np$로 치환하면 $f(\tau+np)=f(\tau)$이므로
$$\mathcal L(f)=\sum_{n=0}^\infty\int_{np}^{(n+1)p}e^{-st}f\,dt=\sum_{n=0}^\infty e^{-nps}\int_0^pe^{-s\tau}f(\tau)\,d\tau$$
$s>0$이면 $e^{-ps}<1$이라 등비급수 $\sum e^{-nps}=\dfrac1{1-e^{-ps}}$입니다.` },
  );
})();
