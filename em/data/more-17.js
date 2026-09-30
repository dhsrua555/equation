/* 17 선형대수학(강의 PPT) — 연습문제. 강의 슬라이드의 정의·정리를 시험 문제 모양으로 바꿔 새로 만들었습니다.
   quiz: 'hw1-pN'은 Homework #1의 문제 N과 같은 유형(퀴즈풀이 탭과 서로 링크됩니다). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({ n: 17, problems: [
    // ── 1.1 벡터공간
    { sec: '1.1', type: 'mc', lv: 1, q: R`보통의 덧셈과 상수곱으로 **벡터공간이 아닌** 것은?`,
      choices: [R`$\mathcal P_3(\mathbb R)$ (3차 이하 실계수 다항식 전체)`, R`$\{f\in C[0,1]:f(0)=0\}$`, R`$\{f\in C[0,1]:f(0)=1\}$`, R`$M_{2,3}(\mathbb R)$`], ans: 2,
      sol: R`$\{f:f(0)=1\}$에는 영함수가 없고(영함수의 값은 0), 덧셈에도 닫혀 있지 않습니다($f(0)+g(0)=2$). 나머지는 모두 영벡터를 포함하고 연산에 닫혀 있습니다.` },
    { sec: '1.1', type: 'mc', lv: 2, q: R`$\mathbb R^2$에 덧셈은 보통대로, 상수곱은 $c(x,y)=(cx,\ 0)$으로 정의할 때 성립하지 **않는** 규칙은?`,
      choices: [R`(V2) 교환법칙`, R`(V3) 영벡터의 존재`, R`(V5) $1v=v$`, R`(V8) $a(v+w)=av+aw$`], ans: 2,
      sol: R`$1(x,y)=(x,0)$이므로 $y\ne0$이면 $1v\ne v$. 덧셈이 보통이라 (V2), (V3)은 그대로이고, (V8)은 $a\big((x,y)+(x',y')\big)=(a(x+x'),0)=(ax,0)+(ax',0)$로 성립합니다.` },
    { sec: '1.1', type: 'open', lv: 2, proof: true, q: R`벡터공간의 공리 (V1)–(V8)만 써서 다음을 증명하시오. (1) $0v=0$ (2) $(-1)v=-v$ (여기서 $-v$는 $v$의 역원)`,
      hint: R`$0=0+0$에 (V7)을 쓰고, 역원을 양변에 더하세요. (2)는 $v+(-1)v$를 계산해 역원의 유일성을 씁니다.`,
      sol: R`
**(1)** (V7)로 $0v=(0+0)v=0v+0v$. 양변에 $0v$의 역원 $w$ (V4)를 더하면 왼쪽은 $0v+w=0$, 오른쪽은 $(0v+0v)+w=0v+(0v+w)=0v+0=0v$ (V1, V3). 따라서 $0=0v$.
**(2)** $v+(-1)v=1v+(-1)v=(1+(-1))v=0v=0$ (V5, V7, (1)). 즉 $(-1)v$는 $v$의 역원입니다. 역원은 유일하므로($w,w'$가 모두 역원이면 $w=w+(v+w')=(w+v)+w'=w'$) $(-1)v=-v$.`,
      rubric: R`
- (1)에서 (V7)로 $0v=0v+0v$를 얻음 — 2점
- 역원을 더해 $0v=0$ (결합법칙·영벡터 사용 명시) — 2점
- (2)에서 $v+(-1)v=0$ 계산 — 2점
- 역원의 유일성으로 결론 — 2점` },
    // ── 1.2 부분공간
    { sec: '1.2', type: 'mc', lv: 1, q: R`$\mathbb R^3$의 부분공간인 것은?`,
      choices: [R`$\{(x,y,z):x+y+z=0\}$`, R`$\{(x,y,z):x+y+z=1\}$`, R`$\{(x,y,z):x\ge0\}$`, R`$\{(x,y,z):xy=0\}$`], ans: 0,
      sol: R`원점을 지나는 평면은 부분공간입니다. $x+y+z=1$은 $0$이 없고, $x\ge0$은 $-1$배에 닫혀 있지 않으며, $xy=0$ (두 평면의 합집합)은 $(1,0,0)+(0,1,0)=(1,1,0)$이 빠져 덧셈에 닫혀 있지 않습니다.` },
    { sec: '1.2', type: 'num', lv: 2, q: R`$W=\{p\in\mathcal P_3(\mathbb R):p(1)=0,\ p(-1)=0\}$의 차원은?`, ans: '2', ansTex: R`2`,
      sol: R`$p(\pm1)=0$이면 $p=(x^2-1)(ax+b)$이므로 $W=\operatorname{span}\{x^2-1,\ x(x^2-1)\}$이고 두 다항식은 독립입니다. 차원정리로 보면 $T(p)=(p(1),p(-1))$은 $\mathcal P_3\to\mathbb R^2$의 전사 선형사상이라 $\dim\ker T=4-2=2$.` },
    { sec: '1.2', type: 'open', lv: 2, q: R`$W=\{A\in M_{2,2}(\mathbb R):A^t=A\}$ (대칭행렬 전체)가 $M_{2,2}(\mathbb R)$의 부분공간임을 보이고, 기저와 차원을 구하시오.`,
      sol: R`
**부분공간.** $0^t=0$이므로 $0\in W$. $A,B\in W$이면 $(A+B)^t=A^t+B^t=A+B$, $(cA)^t=cA^t=cA$. 따라서 $W\le M_{2,2}$.
**기저.** $A=\begin{pmatrix}a&b\\b&d\end{pmatrix}=a\begin{pmatrix}1&0\\0&0\end{pmatrix}+b\begin{pmatrix}0&1\\1&0\end{pmatrix}+d\begin{pmatrix}0&0\\0&1\end{pmatrix}$이므로 세 행렬이 $W$를 생성하고, 일차결합이 0이면 성분을 비교해 $a=b=d=0$이라 독립입니다. 따라서 $\dim W=3$. (일반적으로 $n\times n$ 대칭행렬 공간의 차원은 $\frac{n(n+1)}2$.)`,
      rubric: R`
- 영행렬 포함, 덧셈·상수곱에 닫힘 — 3점
- 생성하는 세 행렬 제시 — 2점
- 일차독립 확인과 차원 3 — 2점` },
    { sec: '1.2', type: 'mc', lv: 2, q: R`$W_1,W_2$가 벡터공간 $V$의 부분공간일 때 항상 옳은 것은?`,
      choices: [R`$W_1\cap W_2$는 $V$의 부분공간이다`, R`$W_1\cup W_2$는 $V$의 부분공간이다`, R`$W_1\cup W_2=V$이다`, R`$W_1\cap W_2=\{0\}$이다`], ans: 0,
      sol: R`교집합은 $0$을 포함하고, 두 부분공간 각각에서 닫혀 있으므로 교집합에서도 닫혀 있습니다. 합집합은 일반적으로 부분공간이 아닙니다($x$축 $\cup$ $y$축).` },
    // ── 1.3 일차독립, 기저, 차원
    { sec: '1.3', type: 'mc', lv: 1, q: R`$\mathcal P_2(\mathbb R)$에서 일차독립인 집합은?`,
      choices: [R`$\{1+x,\ 1-x,\ x^2\}$`, R`$\{1,\ x,\ 1+x\}$`, R`$\{x,\ x^2,\ x+x^2\}$`, R`$\{1,\ 2,\ x\}$`], ans: 0,
      sol: R`$a(1+x)+b(1-x)+cx^2=0$이면 $a+b=0$, $a-b=0$, $c=0$이므로 독립. 나머지는 각각 $1+x=1\cdot1+1\cdot x$, $x+x^2=x+x^2$, $2=2\cdot1$로 종속입니다.` },
    { sec: '1.3', type: 'num', lv: 1, q: R`$\dim M_{2,3}(\mathbb R)$은?`, ans: '6', ansTex: R`6`,
      sol: R`$(i,j)$ 성분만 1인 행렬 $E_{ij}$ ($i=1,2$, $j=1,2,3$) 6개가 기저입니다.` },
    { sec: '1.3', type: 'num', lv: 2, q: R`복소수 전체 $\mathbb C$를 **실수체 $\mathbb R$ 위의** 벡터공간으로 볼 때 차원 $\dim_{\mathbb R}\mathbb C$는?`, ans: '2', ansTex: R`2`,
      sol: R`$a+bi=a\cdot1+b\cdot i$ ($a,b\in\mathbb R$)이고 $1,i$는 실수 계수로 독립이므로 기저는 $\{1,i\}$, 차원 2. 복소수 위의 벡터공간으로 보면 $\{1\}$이 기저라 $\dim_{\mathbb C}\mathbb C=1$입니다.` },
    { sec: '1.3', type: 'mc', lv: 2, q: R`$\mathbb R^2$의 두 벡터 $(1,k)$, $(k,4)$가 **일차종속**이 되는 $k$는?`,
      choices: [R`$k=\pm2$`, R`$k=\pm4$`, R`$k=0$`, R`어떤 $k$에서도 독립`], ans: 0,
      sol: R`두 벡터가 종속 $\iff$ 행렬식 $\begin{vmatrix}1&k\\k&4\end{vmatrix}=4-k^2=0\iff k=\pm2$. 예: $k=2$이면 $(2,4)=2(1,2)$.` },
    { sec: '1.3', type: 'open', lv: 2, quiz: 'hw1-p2', q: R`$\beta=\{1,\ x,\ \tfrac12(3x^2-1)\}$이 $\mathcal P_2(\mathbb R)$의 기저임을 보이고, $\beta$에 대한 $x^2$의 좌표를 구하시오.`,
      sol: R`
**독립.** $a+bx+\frac c2(3x^2-1)=0$이면 $x^2$의 계수 $\frac{3c}2=0$, $x$의 계수 $b=0$, 상수 $a-\frac c2=0$이므로 $a=b=c=0$.
**기저.** $\dim\mathcal P_2(\mathbb R)=3$이고 독립인 벡터가 3개이므로 기저입니다.
**좌표.** $x^2=\alpha+\beta x+\frac\gamma2(3x^2-1)$에서 $\frac{3\gamma}2=1$, $\beta=0$, $\alpha-\frac\gamma2=0$이므로 $\gamma=\frac23$, $\alpha=\frac13$. 좌표 $(\frac13,\ 0,\ \frac23)$.
(3.2 ①의 직교성을 쓰면 $\alpha=\frac{\langle x^2,1\rangle}{\|1\|^2}=\frac{2/3}2=\frac13$, $\gamma=\frac{\langle x^2,P_2\rangle}{\|P_2\|^2}=\frac{4/15}{2/5}=\frac23$으로 바로 나옵니다.)`,
      rubric: R`
- 일차독립을 계수 비교로 보임 — 3점
- 차원 3을 근거로 기저 결론 — 2점
- 좌표 $(\frac13,0,\frac23)$ — 3점` },
    // ── 1.4 집합론
    { sec: '1.4', type: 'mc', lv: 1, q: R`다음 중 **셀 수 없는** 집합은?`,
      choices: [R`$\mathbb N$`, R`$\mathbb Z$`, R`$\mathbb Q$`, R`$\mathbb R$`], ans: 3,
      sol: R`$\mathbb N,\mathbb Z,\mathbb Q$는 모두 기수가 $\aleph_0$ (셀 수 있음), $\mathbb R$은 칸토어의 대각선 논법에 의해 셀 수 없습니다(기수 $2^{\aleph_0}$).` },
    { sec: '1.4', type: 'mc', lv: 2, q: R`기수가 $\aleph_0$인 (셀 수 있는 무한) 집합은?`,
      choices: [R`유리수 계수 다항식 전체 $\mathbb Q[t]$`, R`구간 $[0,1]$`, R`$\mathbb N$의 부분집합 전체`, R`실수열 전체`], ans: 0,
      sol: R`차수가 $n$인 유리계수 다항식은 $\mathbb Q^{n+1}$의 원소로 셀 수 있고, 셀 수 있는 집합들의 셀 수 있는 합집합은 셀 수 있으므로 $\mathbb Q[t]$는 가산입니다. $[0,1]$과 $\mathbb N$의 부분집합 전체는 기수가 $2^{\aleph_0}$이고, 실수열 전체는 그 이상입니다.` },
    { sec: '1.4', type: 'open', lv: 3, proof: true, q: R`구간 $(0,1)$이 셀 수 없음을 칸토어의 대각선 논법으로 증명하시오.`,
      hint: R`$(0,1)$의 원소를 $x_1,x_2,\dots$로 모두 나열할 수 있다고 가정하고, $n$번째 자리가 $x_n$의 $n$번째 자리와 다른 수를 만드세요. 소수 전개가 둘인 수(…0999…)를 피하는 방법도 적으세요.`,
      sol: R`
귀류법. $(0,1)=\{x_1,x_2,x_3,\dots\}$로 나열된다고 하자. 각 $x_n$을 **9가 끝없이 이어지지 않는** 소수 전개 $x_n=0.d_{n1}d_{n2}d_{n3}\dots$로 쓴다(이렇게 정하면 전개가 유일).
$y=0.e_1e_2e_3\dots$를 $e_n=5$ ($d_{nn}\ne5$일 때), $e_n=4$ ($d_{nn}=5$일 때)로 정한다. $y$의 자리는 4 또는 5뿐이므로 $0\lt y\lt1$이고, 9가 이어지지 않으므로 이것이 $y$의 유일한 전개이다.
모든 $n$에 대해 $e_n\ne d_{nn}$이므로 $y$와 $x_n$은 $n$번째 자리가 다르고, 두 수의 유일한 전개가 다르므로 $y\ne x_n$. 따라서 $y$는 목록에 없는데 $y\in(0,1)$ — 모순. 그러므로 $(0,1)$은 셀 수 없다. $\blacksquare$`,
      rubric: R`
- 모든 원소를 나열할 수 있다는 가정(귀류법) — 2점
- 대각선의 자리를 바꿔 새 수를 만듦 — 3점
- 새 수가 목록의 모든 수와 다름을 설명 — 2점
- 소수 전개의 유일성(…999 문제)을 처리 — 1점` },
    // ── 2.1 선형사상
    { sec: '2.1', type: 'mc', lv: 1, q: R`선형사상 $\mathbb R^2\to\mathbb R^2$인 것은?`,
      choices: [R`$L(x,y)=(x+1,\ y)$`, R`$L(x,y)=(2x-y,\ 3y)$`, R`$L(x,y)=(x^2,\ y)$`, R`$L(x,y)=(xy,\ x)$`], ans: 1,
      sol: R`$(2x-y,3y)$는 행렬 $\begin{pmatrix}2&-1\\0&3\end{pmatrix}$의 곱이라 선형. 첫째는 $L(0)\ne0$, 셋째·넷째는 $L(2v)\ne2L(v)$ (예: $v=(1,1)$).` },
    { sec: '2.1', type: 'mc', lv: 1, q: R`$f:\mathbb R\to\mathbb R$, $f(x)=2x+1$이 선형사상이 **아닌** 가장 간단한 이유는?`,
      choices: [R`$f(0)=1\ne0$`, R`$f$가 일대일이 아니다`, R`$f$의 그래프가 직선이 아니다`, R`$f$가 미분가능하지 않다`], ans: 0,
      sol: R`선형사상은 항상 $L(0)=0$입니다. $f(0)=1$이므로 선형이 아닙니다(아핀 사상).` },
    { sec: '2.1', type: 'open', lv: 2, q: R`$T:\mathcal P_2(\mathbb R)\to\mathbb R^2$, $T(p)=\big(p(0),\ p(1)\big)$가 선형임을 보이고 $\ker T$와 $\operatorname{im}T$를 구하여 차원정리를 확인하시오.`,
      sol: R`
**선형.** $T(p+q)=(p(0)+q(0),\ p(1)+q(1))=T(p)+T(q)$, $T(cp)=cT(p)$.
**커널.** $p(0)=p(1)=0$이면 $p=cx(x-1)$이므로 $\ker T=\operatorname{span}\{x^2-x\}$, 차원 1.
**이미지.** $T(1-x)=(1,0)$, $T(x)=(0,1)$이므로 $\operatorname{im}T=\mathbb R^2$, 차원 2.
**확인.** $1+2=3=\dim\mathcal P_2$ ✓.`,
      rubric: R`
- 두 선형 조건 확인 — 2점
- 커널 $\operatorname{span}\{x^2-x\}$ — 2점
- 이미지 $\mathbb R^2$ (근거 포함) — 2점
- 차원정리 확인 — 1점` },
    // ── 2.2 예: 행렬, 미분, 적분
    { sec: '2.2', type: 'num', lv: 2, q: R`$D:\mathcal P_3(\mathbb R)\to\mathcal P_3(\mathbb R)$, $D(p)=p'$을 기저 $\{1,x,x^2,x^3\}$로 나타낸 $4\times4$ 행렬의 계수(rank)는?`, ans: '3', ansTex: R`3`,
      sol: R`행렬의 열은 $D(1)=0$, $D(x)=1$, $D(x^2)=2x$, $D(x^3)=3x^2$의 좌표 $(0,0,0,0)$, $(1,0,0,0)$, $(0,2,0,0)$, $(0,0,3,0)$. 독립인 열이 3개이므로 계수 3 ($=\dim\operatorname{im}D=\dim\mathcal P_2$).` },
    { sec: '2.2', type: 'mc', lv: 2, q: R`$\mathcal C^\infty$ 위의 사상 중 선형이 **아닌** 것은?`,
      choices: [R`$f\mapsto f'+3f$`, R`$f\mapsto\int_0^1f(t)\,dt$`, R`$f\mapsto xf(x)$`, R`$f\mapsto f\,f'$`], ans: 3,
      sol: R`$(2f)(2f)'=4ff'\ne2ff'$이므로 $f\mapsto ff'$는 선형이 아닙니다. 나머지는 미분·적분·곱하기의 선형성으로 선형입니다.` },
    { sec: '2.2', type: 'open', lv: 2, quiz: 'hw1-p5', q: R`$L[y]=y''+3y'+2y$가 $\mathcal C^\infty$ 위의 선형연산자임을 보이고, $\ker L$의 기저를 구하시오. 또 $L[y_p]=f$인 $y_p$가 하나 있으면 $L[y]=f$의 모든 해가 $y_p+(\ker L\text{의 원소})$임을 보이시오.`,
      sol: R`
**선형.** $L[y+z]=(y+z)''+3(y+z)'+2(y+z)=L[y]+L[z]$, $L[cy]=cL[y]$ (미분의 선형성).
**커널.** $y=e^{\lambda x}$를 넣으면 $(\lambda^2+3\lambda+2)e^{\lambda x}=0$에서 $\lambda=-1,-2$. $\ker L$은 2계 선형 동차 ODE의 해공간이라 2차원이고, $e^{-x},e^{-2x}$는 독립(론스키안 $-e^{-3x}\ne0$)이므로 기저 $\{e^{-x},e^{-2x}\}$.
**해 구조.** $L[y]=f$이면 $L[y-y_p]=f-f=0$이라 $y-y_p\in\ker L$. 거꾸로 $h\in\ker L$이면 $L[y_p+h]=f+0=f$. 따라서 해 전체 $=\{y_p+c_1e^{-x}+c_2e^{-2x}\}$.`,
      rubric: R`
- 선형성 확인 — 2점
- 커널의 기저 $e^{-x},e^{-2x}$ (독립 근거) — 3점
- 해 구조의 두 방향 — 3점` },
    // ── 2.3 선형확장정리
    { sec: '2.3', type: 'mc', lv: 2, q: R`$L:\mathbb R^2\to\mathbb R^2$가 선형이고 $L(1,1)=(2,0)$, $L(1,-1)=(0,4)$이면 $L(x,y)$는?`,
      choices: [R`$(x+y,\ 2x-2y)$`, R`$(2x,\ 4y)$`, R`$(x-y,\ 2x+2y)$`, R`$(2x+2y,\ 4x-4y)$`], ans: 0,
      sol: R`$(x,y)=\frac{x+y}2(1,1)+\frac{x-y}2(1,-1)$이므로 $L(x,y)=\frac{x+y}2(2,0)+\frac{x-y}2(0,4)=(x+y,\ 2x-2y)$. 검산: $L(1,1)=(2,0)$, $L(1,-1)=(0,4)$ ✓.` },
    { sec: '2.3', type: 'num', lv: 2, q: R`$L:\mathcal P_2(\mathbb R)\to\mathbb R$이 선형이고 $L(1)=2$, $L(x)=0$, $L(x^2)=\frac23$일 때 $L(3x^2-1)$은?`, ans: '0', ansTex: R`0`,
      sol: R`$L(3x^2-1)=3L(x^2)-L(1)=2-2=0$. 이 $L$은 기저에서 값이 같으므로 $p\mapsto\int_{-1}^1p\,dx$ 자체입니다(선형확장정리의 유일성).` },
    { sec: '2.3', type: 'mc', lv: 2, q: R`$L(1,0)=(1,-1)$, $L(0,1)=(1,1)$인 선형사상 $L:\mathbb R^2\to\mathbb R^2$에 대해 $L(3,-2)$는?`,
      choices: [R`$(1,\ -5)$`, R`$(5,\ -1)$`, R`$(1,\ 5)$`, R`$(-1,\ -5)$`], ans: 0,
      sol: R`$L(a,b)=(a+b,\ -a+b)$ (슬라이드 18)에 $(3,-2)$를 넣으면 $(1,\ -5)$.` },
    // ── 2.4 커널, 이미지, 차원정리
    { sec: '2.4', type: 'num', lv: 1, q: R`$3\times5$ 행렬 $A$의 계수가 2이면 $L_A:\mathbb R^5\to\mathbb R^3$의 $\dim\ker L_A$는?`, ans: '3', ansTex: R`3`,
      sol: R`차원정리: $\dim\ker+\dim\operatorname{im}=\dim\mathbb R^5=5$, $\dim\operatorname{im}=\operatorname{rank}A=2$이므로 $3$.` },
    { sec: '2.4', type: 'num', lv: 2, q: R`$L:\mathcal P_3(\mathbb R)\to\mathbb R$, $L(p)=\int_{-1}^1p(x)\,dx$의 $\dim\ker L$은?`, ans: '3', ansTex: R`3`,
      sol: R`$L(1)=2\ne0$이므로 $\operatorname{im}L=\mathbb R$ (차원 1). $\dim\mathcal P_3=4$이므로 $\dim\ker L=3$ (기저 예: $x,\ x^3,\ x^2-\frac13$).` },
    { sec: '2.4', type: 'mc', lv: 2, q: R`선형사상 $L:\mathbb R^4\to\mathbb R^2$에 대해 **항상** 옳은 것은?`,
      choices: [R`$\dim\ker L\ge2$`, R`$L$은 단사이다`, R`$L$은 전사이다`, R`$\dim\operatorname{im}L=2$`], ans: 0,
      sol: R`$\dim\operatorname{im}L\le2$이므로 $\dim\ker L=4-\dim\operatorname{im}L\ge2$. 영사상이면 전사가 아니고 $\dim\operatorname{im}L=0$이므로 나머지는 항상 옳지는 않습니다.` },
    { sec: '2.4', type: 'open', lv: 3, proof: true, q: R`선형사상 $L:V\to W$에 대하여 (1) $\ker L$이 $V$의 부분공간임을 보이고, (2) $L$이 단사 $\iff\ker L=\{0\}$임을 증명하시오.`,
      sol: R`
**(1)** $L(0)=0$이므로 $0\in\ker L$. $v,w\in\ker L$이면 $L(v+w)=L(v)+L(w)=0$, $L(cv)=cL(v)=0$. 부분공간 판정법으로 $\ker L\le V$.
**(2)** ($\Rightarrow$) $v\in\ker L$이면 $L(v)=0=L(0)$이고 단사이므로 $v=0$.
($\Leftarrow$) $L(v)=L(w)$이면 $L(v-w)=L(v)-L(w)=0$이라 $v-w\in\ker L=\{0\}$, 즉 $v=w$. $\blacksquare$`,
      rubric: R`
- (1) 영벡터·두 닫힘 — 3점
- (2) ($\Rightarrow$) — 2점
- (2) ($\Leftarrow$) 선형성으로 $L(v-w)=0$ — 3점` },
    // ── 2.5 고윳값
    { sec: '2.5', type: 'mc', lv: 2, q: R`$L(a,b)=(a+b,\ -a+b)$의 고윳값에 대해 옳은 것은?`,
      choices: [R`$\mathbb F=\mathbb R$에서는 고윳값이 없고, $\mathbb F=\mathbb C$에서는 $1\pm i$이다`, R`$\mathbb F=\mathbb R$에서 고윳값은 $1$과 $-1$이다`, R`$\mathbb F=\mathbb R$에서 고윳값은 $\sqrt2$이다`, R`어떤 체에서도 고윳값이 없다`], ans: 0,
      sol: R`특성방정식 $(1-\lambda)^2+1=0$의 근은 $1\pm i$. 실수 근이 없으므로 실벡터공간에서는 고윳값이 없습니다($\sqrt2$배 확대와 $-45^\circ$ 회전).` },
    { sec: '2.5', type: 'num', lv: 2, q: R`$T:\mathcal P_3(\mathbb R)\to\mathcal P_3(\mathbb R)$, $T(p)=x\,p'(x)$의 서로 다른 고윳값을 모두 더하면?`, ans: '6', ansTex: R`6`,
      sol: R`$T(x^k)=kx^k$ ($k=0,1,2,3$)이므로 고윳값은 $0,1,2,3$, 합 6.` },
    { sec: '2.5', type: 'mc', lv: 1, q: R`$D^2=\dfrac{d^2}{dx^2}$의 고윳값 $-4$에 속하는 고유벡터는?`,
      choices: [R`$\sin2x$`, R`$e^{2x}$`, R`$x^2$`, R`$\sin4x$`], ans: 0,
      sol: R`$(\sin2x)''=-4\sin2x$. $e^{2x}$는 고윳값 $4$, $\sin4x$는 $-16$에 속하고, $(x^2)''=2$는 $x^2$의 상수배가 아닙니다.` },
    // ── 3.1 ① 내적의 정의
    { sec: '3.1', type: 'mc', lv: 2, q: R`$\mathbb R^2$에서 내적인 것은? ($\mathbf x=(x_1,x_2)$, $\mathbf y=(y_1,y_2)$)`,
      choices: [R`$x_1y_1-x_2y_2$`, R`$x_1y_1$`, R`$2x_1y_1+x_1y_2+x_2y_1+x_2y_2$`, R`$x_1y_2+x_2y_1$`], ans: 2,
      sol: R`셋째는 $\langle\mathbf x,\mathbf x\rangle=x_1^2+(x_1+x_2)^2$이 0이 아닌 $\mathbf x$에서 양수라 내적. 첫째는 $(0,1)$에서 $-1$, 둘째는 $(0,1)$에서 0, 넷째는 $(1,-1)$에서 $-2$라 양정이 깨집니다.` },
    { sec: '3.1', type: 'open', lv: 2, quiz: 'hw1-p1', q: R`$\mathcal P_2(\mathbb R)$에서 $\langle p,q\rangle=p(0)q(0)+p(1)q(1)+p(2)q(2)$가 내적임을 보이시오. 또 같은 식이 $\mathcal P_3(\mathbb R)$에서는 내적이 아닌 이유를 설명하시오.`,
      hint: R`성질 1–3은 식을 펼치면 됩니다. 성질 4에서 $\langle p,p\rangle=0$이면 $p$가 세 근을 가진다는 것을 쓰세요.`,
      sol: R`
**1, 2.** $\langle p+r,q\rangle=\sum_{k=0}^2(p(k)+r(k))q(k)=\langle p,q\rangle+\langle r,q\rangle$, $\langle cp,q\rangle=c\langle p,q\rangle$.
**3.** 실수이고 식이 $p,q$에 대칭이므로 $\langle q,p\rangle=\langle p,q\rangle$.
**4.** $\langle p,p\rangle=p(0)^2+p(1)^2+p(2)^2\ge0$. 0이면 $p(0)=p(1)=p(2)=0$ — 2차 이하 다항식이 서로 다른 근을 3개 가지므로 $p=0$. 따라서 $p\ne0$이면 $\langle p,p\rangle\gt0$.
**$\mathcal P_3$에서는** $p(x)=x(x-1)(x-2)\ne0$인데 $\langle p,p\rangle=0$이라 성질 4가 깨집니다.`,
      rubric: R`
- 성질 1, 2 — 2점
- 성질 3 (대칭) — 1점
- 성질 4: $\ge0$과 “0이면 세 근 → $p=0$” — 3점
- $\mathcal P_3$ 반례 — 2점` },
    { sec: '3.1', type: 'mc', lv: 2, quiz: 'hw1-p1', q: R`$M_{2,2}(\mathbb R)$에서 $\langle A,B\rangle=\operatorname{tr}(AB)$ (전치 없음)가 내적이 **아님**을 보이는 행렬은?`,
      choices: [R`$A=\begin{pmatrix}0&1\\-1&0\end{pmatrix}$`, R`$A=\begin{pmatrix}1&0\\0&1\end{pmatrix}$`, R`$A=\begin{pmatrix}1&0\\0&0\end{pmatrix}$`, R`$A=\begin{pmatrix}2&1\\1&2\end{pmatrix}$`], ans: 0,
      sol: R`$A=\begin{pmatrix}0&1\\-1&0\end{pmatrix}$이면 $A^2=-I$라 $\operatorname{tr}(AA)=-2\lt0$: 양정이 깨집니다. 전치를 넣은 $\operatorname{tr}(AA^t)=\sum a_{ij}^2$이어야 제곱의 합이 됩니다(과제 1번).` },
    { sec: '3.1', type: 'open', lv: 2, quiz: 'hw1-p1', q: R`$C[0,1]$에서 $\langle f,g\rangle=\int_0^1x\,f(x)g(x)\,dx$가 내적임을 보이시오. (가중함수 $x$는 $x=0$에서 0이 됨에 주의)`,
      sol: R`
**1, 2.** 적분의 선형성. **3.** 실숫값이라 대칭.
**4.** $\langle f,f\rangle=\int_0^1xf(x)^2dx\ge0$ ($x\ge0$). $f\ne0$이면 연속성 때문에 $f(x_0)\ne0$인 $x_0\in(0,1)$이 있고(끝점에서만 0이 아니어도 연속이면 근처의 내부 점에서 0이 아님), $x_0$ 근처 구간 $I\subset(0,1)$에서 $xf(x)^2\ge c\gt0$. 따라서 $\int_0^1xf^2\ge\int_Ixf^2\gt0$.
가중함수가 한 점에서 0이 되는 것은 문제되지 않습니다. **구간에서** 0이 되면 양정이 깨질 수 있습니다.`,
      rubric: R`
- 성질 1–3 — 3점
- $\ge0$ — 1점
- $f\ne0$이면 내부의 구간에서 적분이 양수임을 연속성으로 설명 — 4점` },
    // ── 3.1 ② 내적의 예
    { sec: '3.1b', type: 'num', lv: 1, q: R`$[-1,1]$의 정적분 내적에서 $\langle1+x,\ 1-x\rangle$는?`, ans: '4/3', ansTex: R`\tfrac43`,
      sol: R`$\int_{-1}^1(1-x^2)\,dx=2-\frac23=\frac43$.` },
    { sec: '3.1b', type: 'mc', lv: 2, q: R`$\mathbb C^2$의 점곱 $a\cdot b=\sum a_i\overline{b_i}$로 $a=(1,i)$의 $a\cdot a$는?`,
      choices: [R`$2$`, R`$0$`, R`$1+i$`, R`$-2$`], ans: 0,
      sol: R`$1\cdot\bar1+i\cdot\bar i=1+i(-i)=1+1=2$. 켤레 없이 $a^ta=1+i^2=0$으로 계산하면 영이 아닌 벡터의 “길이”가 0이 되어 내적이 아닙니다.` },
    { sec: '3.1b', type: 'num', lv: 2, q: R`$[-1,1]$의 정적분 내적에서 $\langle e^x,\ x\rangle$는? (정확한 값)`, ans: '2/e', ansTex: R`\tfrac2e\approx0.7358`,
      sol: R`$\int_{-1}^1xe^xdx=\big[(x-1)e^x\big]_{-1}^1=0-(-2e^{-1})=\frac2e$.` },
    // ── 3.1 ③ 노름
    { sec: '3.1c', type: 'num', lv: 1, q: R`$[-1,1]$의 정적분 내적에서 $\|x\|$는?`, ans: 'sqrt(2/3)', ansTex: R`\sqrt{2/3}\approx0.8165`,
      sol: R`$\|x\|^2=\int_{-1}^1x^2dx=\frac23$.` },
    { sec: '3.1c', type: 'num', lv: 2, q: R`$[-\pi,\pi]$의 정적분 내적에서 $\|\sin x+\cos x\|^2$은?`, ans: '2*pi', ansTex: R`2\pi`,
      sol: R`$\sin x\perp\cos x$이므로 피타고라스: $\|\sin x\|^2+\|\cos x\|^2=\pi+\pi=2\pi$.` },
    { sec: '3.1c', type: 'open', lv: 3, proof: true, q: R`내적공간에서 코시-슈바르츠 부등식 $\lvert\langle u,v\rangle\rvert\le\|u\|\,\|v\|$를 증명하시오.`,
      hint: R`$v\ne0$이면 $u$에서 $v$ 방향 정사영을 뺀 $w=u-\frac{\langle u,v\rangle}{\|v\|^2}v$가 $v$와 직교합니다. 피타고라스 정리를 쓰세요.`,
      sol: R`
$v=0$이면 양변이 0. $v\ne0$이면 $c=\frac{\langle u,v\rangle}{\|v\|^2}$, $w=u-cv$로 두면 $\langle w,v\rangle=\langle u,v\rangle-c\|v\|^2=0$. $u=w+cv$이고 $w\perp cv$이므로 피타고라스 정리로
$$\|u\|^2=\|w\|^2+\lvert c\rvert^2\|v\|^2\ge\lvert c\rvert^2\|v\|^2=\frac{\lvert\langle u,v\rangle\rvert^2}{\|v\|^2}.$$
양변에 $\|v\|^2$을 곱하고 제곱근을 취하면 $\lvert\langle u,v\rangle\rvert\le\|u\|\|v\|$. 등호는 $w=0$, 즉 $u=cv$ (일차종속)일 때입니다. $\blacksquare$`,
      rubric: R`
- $v=0$ 처리 — 1점
- 정사영을 뺀 $w$가 $v$와 직교함 — 3점
- 피타고라스로 부등식 — 3점
- 등호 조건 — 1점` },
    { sec: '3.1c', type: 'mc', lv: 2, q: R`$\mathbb R^2$의 노름 중 **내적에서 오지 않는** 것은?`,
      choices: [R`$\|\mathbf x\|_1=\lvert x_1\rvert+\lvert x_2\rvert$`, R`$\sqrt{x_1^2+x_2^2}$`, R`$\sqrt{2x_1^2+x_2^2}$`, R`$\sqrt{x_1^2+2x_1x_2+2x_2^2}$`], ans: 0,
      sol: R`$\|\cdot\|_1$은 평행사변형 등식이 깨집니다: $u=(1,0)$, $v=(0,1)$에서 $\|u+v\|^2+\|u-v\|^2=8\ne4=2\|u\|^2+2\|v\|^2$. 나머지는 $\sqrt{\mathbf x^TA\mathbf x}$ ($A$ 양의 정부호) 꼴입니다.` },
    // ── 3.2 ① 직교성
    { sec: '3.2', type: 'num', lv: 2, quiz: 'hw1-p2', q: R`$[-1,1]$의 정적분 내적에서 $\big\|\tfrac12(3x^2-1)\big\|^2$은?`, ans: '2/5', ansTex: R`\tfrac25`,
      sol: R`$\frac14\int_{-1}^1(9x^4-6x^2+1)\,dx=\frac14\big(\frac{18}5-4+2\big)=\frac14\cdot\frac85=\frac25$. 계수 $\frac12$도 제곱되어 $\frac14$가 됩니다.` },
    { sec: '3.2', type: 'open', lv: 2, quiz: 'hw1-p2', q: R`$C[0,\pi]$에 $\langle f,g\rangle=\int_0^\pi f(x)g(x)\,dx$를 줄 때 $\{1,\ \cos x,\ \cos2x\}$가 직교집합임을 보이고, 정규직교집합으로 만드시오.`,
      sol: R`
**직교.** $\int_0^\pi\cos x\,dx=0$, $\int_0^\pi\cos2x\,dx=0$, $\int_0^\pi\cos x\cos2x\,dx=\frac12\int_0^\pi(\cos x+\cos3x)\,dx=0$.
**노름.** $\|1\|^2=\pi$, $\|\cos x\|^2=\int_0^\pi\frac{1+\cos2x}2dx=\frac\pi2$, $\|\cos2x\|^2=\frac\pi2$.
**정규직교집합.** $\Big\{\frac1{\sqrt\pi},\ \sqrt{\frac2\pi}\cos x,\ \sqrt{\frac2\pi}\cos2x\Big\}$. 반구간 $[0,\pi]$에서는 코사인들끼리 직교합니다(반구간 전개의 바탕).`,
      rubric: R`
- 세 쌍의 내적이 0 — 3점
- 노름제곱 $\pi,\frac\pi2,\frac\pi2$ — 3점
- 정규직교집합 — 2점` },
    { sec: '3.2', type: 'num', lv: 2, q: R`$1+x+x^2$을 $[-1,1]$의 직교기저 $\{1,\ x,\ \tfrac12(3x^2-1)\}$로 전개할 때 $\tfrac12(3x^2-1)$의 계수는?`, ans: '2/3', ansTex: R`\tfrac23`,
      sol: R`$\frac{\langle1+x+x^2,P_2\rangle}{\|P_2\|^2}=\frac{\langle x^2,P_2\rangle}{2/5}=\frac{4/15}{2/5}=\frac23$ ($\langle1,P_2\rangle=\langle x,P_2\rangle=0$).` },
    { sec: '3.2', type: 'open', lv: 3, proof: true, q: R`영벡터를 포함하지 않는 직교집합 $\{v_1,\dots,v_n\}$이 일차독립임을 증명하시오. 또 이것이 $V$의 기저이면 $v=\sum_i\frac{\langle v,v_i\rangle}{\|v_i\|^2}v_i$임을 보이시오.`,
      sol: R`
**독립.** $\sum_ia_iv_i=0$과 $v_j$의 내적을 취하면 $\sum_ia_i\langle v_i,v_j\rangle=a_j\|v_j\|^2=0$ (직교성). $v_j\ne0$이라 $\|v_j\|^2\gt0$이므로 $a_j=0$. 모든 $j$에 대해 성립.
**전개.** 기저이므로 $v=\sum_ic_iv_i$. $v_j$와 내적하면 $\langle v,v_j\rangle=c_j\|v_j\|^2$, 즉 $c_j=\frac{\langle v,v_j\rangle}{\|v_j\|^2}$. $\blacksquare$`,
      rubric: R`
- 일차결합과 $v_j$의 내적 — 3점
- $\|v_j\|^2\gt0$으로 $a_j=0$ — 2점
- 계수 공식 유도 — 3점` },
    // ── 3.2 ② 정사영과 최선 근사
    { sec: '3.2b', type: 'num', lv: 2, q: R`$[-1,1]$의 정적분 내적에서 $x^3$에 가장 가까운 1차 이하 다항식을 $w=cx$라 할 때 $c$는?`, ans: '3/5', ansTex: R`\tfrac35`,
      sol: R`$\langle x^3,1\rangle=0$, $\frac{\langle x^3,x\rangle}{\|x\|^2}=\frac{2/5}{2/3}=\frac35$.` },
    { sec: '3.2b', type: 'num', lv: 2, quiz: 'hw1-p2', q: R`$[-1,1]$의 정적분 내적에서 $e^x$에 가장 가까운 **상수함수**는? (정확한 값)`, ans: 'sinh(1)', ansTex: R`\sinh1=\tfrac{e-e^{-1}}2\approx1.1752`,
      sol: R`상수함수 공간의 직교기저 $\{1\}$로 정사영: $\frac{\langle e^x,1\rangle}{\|1\|^2}=\frac{e-e^{-1}}2=\sinh1$. 제곱 오차가 최소인 상수는 **평균값**입니다.` },
    { sec: '3.2b', type: 'open', lv: 3, quiz: 'hw1-p2', q: R`$[-1,1]$의 정적분 내적에서 $\lvert x\rvert$에 가장 가까운 2차 이하 다항식을 구하시오.`,
      hint: R`직교기저 $\{1,x,P_2\}$, $P_2=\frac12(3x^2-1)$을 쓰고, $\lvert x\rvert$가 우함수라는 것을 먼저 쓰세요.`,
      sol: R`
직교기저 $\{1,x,P_2\}$ (노름제곱 $2,\frac23,\frac25$).
- $\langle\lvert x\rvert,1\rangle=2\int_0^1x\,dx=1$ → 계수 $\frac12$.
- $\langle\lvert x\rvert,x\rangle=0$ (기함수) → 계수 0.
- $\langle\lvert x\rvert,P_2\rangle=2\int_0^1x\cdot\frac{3x^2-1}2dx=\int_0^1(3x^3-x)\,dx=\frac34-\frac12=\frac14$ → 계수 $\frac{1/4}{2/5}=\frac58$.
$$w=\frac12+\frac58\cdot\frac12(3x^2-1)=\frac3{16}+\frac{15}{16}x^2\approx0.1875+0.9375x^2$$
검산: $\int_{-1}^1w\,dx=\frac38+\frac58=1=\int_{-1}^1\lvert x\rvert dx$ ✓ (정사영은 $1$과의 내적을 보존).`,
      rubric: R`
- 직교기저와 노름제곱 — 2점
- 세 내적 (대칭 사용) — 4점
- 최종 다항식 $\frac3{16}+\frac{15}{16}x^2$ — 2점` },
    { sec: '3.2b', type: 'open', lv: 2, q: R`$\mathbb R^3$에서 $v=(1,2,3)$을 $W=\operatorname{span}\{(1,1,0),(1,-1,1)\}$에 정사영한 $w$와, $v$에서 $W$까지의 거리를 구하시오.`,
      sol: R`
두 벡터의 점곱이 0이므로 직교기저(노름제곱 2, 3). $w=\frac32(1,1,0)+\frac23(1,-1,1)=\big(\frac{13}6,\frac56,\frac23\big)$.
$v-w=\frac76(-1,1,2)$는 두 기저벡터와 직교 ✓. 거리 $\|v-w\|=\frac76\sqrt6=\frac7{\sqrt6}\approx2.858$.`,
      rubric: R`
- 직교 확인 — 1점
- 계수 $\frac32,\frac23$과 $w$ — 3점
- 거리 — 2점` },
    { sec: '3.2b', type: 'mc', lv: 2, q: R`$\{v_1,v_2\}$가 부분공간 $W$의 **직교기저**(정규화하지 않음)일 때, $v$를 $W$에 정사영한 벡터는?`,
      choices: [R`$\dfrac{\langle v,v_1\rangle}{\|v_1\|^2}v_1+\dfrac{\langle v,v_2\rangle}{\|v_2\|^2}v_2$`, R`$\langle v,v_1\rangle v_1+\langle v,v_2\rangle v_2$`, R`$\dfrac{\langle v,v_1\rangle}{\|v_1\|}v_1+\dfrac{\langle v,v_2\rangle}{\|v_2\|}v_2$`, R`$\dfrac{\langle v_1,v_2\rangle}{\|v\|^2}v$`], ans: 0,
      sol: R`정규화한 $\frac{v_i}{\|v_i\|}$로 정규직교 공식을 쓰면 $\big\langle v,\frac{v_i}{\|v_i\|}\big\rangle\frac{v_i}{\|v_i\|}=\frac{\langle v,v_i\rangle}{\|v_i\|^2}v_i$. 둘째는 정규직교기저일 때만 맞습니다.` },
    // ── 3.2 ③ 함수의 근사
    { sec: '3.2c', type: 'mc', lv: 2, q: R`주기 $2\pi$인 연속함수의 공간에서 $W=\operatorname{span}\{1,\cos x,\sin x,\dots,\cos Nx,\sin Nx\}$ (정적분 내적 $\int_{-\pi}^{\pi}$)일 때, $f$에 가장 가까운 $W$의 원소는?`,
      choices: [R`$f$의 푸리에 급수의 $N$번째 부분합`, R`$f$의 $N$차 테일러 다항식`, R`$f(0)+f'(0)\sin x$`, R`$W$의 원소 중 $f$와 한 점에서 같은 것`], ans: 0,
      sol: R`$W$의 기저가 직교이므로 정사영의 계수는 $\frac{\langle f,\cos nx\rangle}{\pi}$, $\frac{\langle f,\sin nx\rangle}{\pi}$, $\frac{\langle f,1\rangle}{2\pi}$ — 오일러 공식 그대로입니다(슬라이드 41의 과제).` },
    { sec: '3.2c', type: 'num', lv: 2, q: R`$f(x)=x$ ($-\pi\lt x\lt\pi$)에 가장 가까운 $\operatorname{span}\{1,\cos x,\sin x\}$의 원소를 $b_1\sin x$라 할 때 $b_1$은?`, ans: '2', ansTex: R`2`,
      sol: R`$b_1=\frac1\pi\int_{-\pi}^{\pi}x\sin x\,dx=\frac1\pi\cdot2\pi=2$. ($a_0=a_1=0$: 기함수)` },
    { sec: '3.2c', type: 'num', lv: 3, q: R`위 문제의 최소 제곱 오차 $E^*=\int_{-\pi}^{\pi}(x-2\sin x)^2dx$는? (정확한 값)`, ans: '2*pi^3/3-4*pi', ansTex: R`\tfrac{2\pi^3}3-4\pi\approx8.104`,
      sol: R`$E^*=\|f\|^2-\pi b_1^2=\frac{2\pi^3}3-4\pi$. (직접 계산: $\int x^2-4\int x\sin x+4\int\sin^2x=\frac{2\pi^3}3-8\pi+4\pi$.)` },
    { sec: '3.2c', type: 'mc', lv: 2, q: R`$[-\pi,\pi]$에서 $\sin x$의 5차 최선 근사(정적분 내적으로 정사영)와 5차 테일러 다항식을 비교한 설명으로 옳은 것은?`,
      choices: [R`최선 근사는 구간 전체의 제곱 오차가 작고, 테일러는 원점 근처에서 정확하지만 구간 끝에서 크게 벗어난다`, R`두 다항식은 같다`, R`테일러 다항식의 제곱 오차가 더 작다`, R`최선 근사는 $x=0$에서 $\sin x$와 도함수까지 일치한다`], ans: 0,
      sol: R`최선 근사는 $\int_{-\pi}^{\pi}(\sin x-p)^2dx$를 최소로 하므로 오차가 구간 전체에 고르게 퍼집니다(끝점 오차 약 $0.016$). 테일러는 $x=0$에서 도함수를 맞출 뿐이라 $x=\pm\pi$에서 오차가 $0.524$입니다. 최선 근사의 기울기는 $0.9879\ne1$이라 $x=0$에서 도함수가 맞지 않습니다.` },
    // ── 3.2 ④ 베셀, 힐베르트, 파세발
    { sec: '3.2d', type: 'open', lv: 2, proof: true, q: R`유한 정규직교집합 $\{v_1,\dots,v_m\}$에 대해 베셀 부등식 $\sum_{i=1}^m\lvert\langle v,v_i\rangle\rvert^2\le\|v\|^2$을 최선 근사 정리로부터 유도하시오.`,
      sol: R`
$w=\sum_i\langle v,v_i\rangle v_i$로 두면 최선 근사 정리에서 $v-w\perp W\ni w$. 피타고라스 정리로 $\|v\|^2=\|w\|^2+\|v-w\|^2\ge\|w\|^2$. 정규직교성으로 $\|w\|^2=\sum_i\lvert\langle v,v_i\rangle\rvert^2$ (서로 직교하는 벡터의 피타고라스, $\|v_i\|=1$). 따라서 베셀 부등식. $\blacksquare$`,
      rubric: R`
- 정사영 $w$와 $v-w\perp w$ — 3점
- 피타고라스로 $\|v\|^2\ge\|w\|^2$ — 2점
- $\|w\|^2=\sum\lvert\langle v,v_i\rangle\rvert^2$ — 2점` },
    { sec: '3.2d', type: 'num', lv: 2, quiz: 'hw1-p3', q: R`$f(x)=x$ ($-\pi\lt x\lt\pi$)의 푸리에 계수 $b_n=\frac{2(-1)^{n+1}}n$에 파세발 항등식 $\frac1\pi\int_{-\pi}^{\pi}f^2dx=2a_0^2+\sum(a_n^2+b_n^2)$을 적용해 얻는 $\sum_{n=1}^\infty\frac1{n^2}$의 값은?`, ans: 'pi^2/6', ansTex: R`\tfrac{\pi^2}6`,
      sol: R`$\frac1\pi\cdot\frac{2\pi^3}3=\frac{2\pi^2}3=\sum\frac4{n^2}$이므로 $\sum\frac1{n^2}=\frac{\pi^2}6$.` },
    { sec: '3.2d', type: 'mc', lv: 2, q: R`힐베르트 공간인 것은?`,
      choices: [R`점곱을 준 $\mathbb R^n$`, R`정적분 내적을 준 $C[-\pi,\pi]$`, R`정적분 내적을 준 다항식 전체 $\mathbb R[t]$ (구간 $[-1,1]$)`, R`노름만 있고 내적이 없는 공간`], ans: 0,
      sol: R`유한차원 내적공간은 완비입니다. $C[-\pi,\pi]$와 다항식 공간은 정적분 노름으로 수렴하는 수열의 극한(불연속 함수, 다항식이 아닌 함수)이 공간 밖에 있을 수 있어 완비가 아닙니다. 힐베르트 공간은 **내적**공간이어야 합니다.` },
    { sec: '3.2d', type: 'num', lv: 3, q: R`사각파 $f=-1$ ($-\pi\lt x\lt0$), $f=1$ ($0\lt x\lt\pi$)의 계수 $b_n=\frac4{n\pi}$ ($n$ 홀수)에 파세발 항등식을 적용해 $\sum_{n\text{ 홀수}}\frac1{n^2}$을 구하시오.`, ans: 'pi^2/8', ansTex: R`\tfrac{\pi^2}8`,
      sol: R`$\frac1\pi\int_{-\pi}^{\pi}1\,dx=2=\sum_{n\text{ 홀수}}\frac{16}{n^2\pi^2}$이므로 $\frac{\pi^2}8$.` },
    { sec: '3.2d', type: 'mc', lv: 2, q: R`베셀 부등식과 파세발 항등식에 대해 옳은 것은?`,
      choices: [R`베셀 부등식은 임의의 정규직교집합에서 성립하고, 파세발 항등식은 (완비) 정규직교기저에서 성립한다`, R`둘 다 모든 정규직교집합에서 등식이다`, R`파세발 항등식은 유한 정규직교집합에서만 성립한다`, R`베셀 부등식은 힐베르트 공간에서만 성립한다`], ans: 0,
      sol: R`베셀은 정사영이 원래 벡터보다 길 수 없다는 것이라 모든 내적공간·정규직교집합에서 성립합니다. 등식(파세발)은 정규직교계가 공간 전체를 (무한 합으로) 생성할 때, 즉 완비일 때만입니다.` },
  ] });
})();
