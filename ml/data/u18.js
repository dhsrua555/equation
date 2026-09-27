/* 18 차원 축소 — UML 23장, 강의 노트 “Dimensionality Reduction: PCA, Random Projections, Compressed Sensing”, DSML 6장 보충(커널 PCA) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 18, part: 'C', title: '차원 축소: PCA, 랜덤 사영, 압축 센싱', en: 'Dimensionality Reduction', ref: 'UML 23장', plot: 'pca',
    fig: R`길쭉한 점구름과 그 주성분 축(굵은 선), 둘째 축(가는 선), 그리고 각 점에서 첫 주성분으로 내린 사영`,
    tagline: R`고차원 자료를 적은 수의 좌표로 줄이는 세 가지 방법입니다. 자료에 맞춘 최적의 선형 압축, 자료를 보지 않는 무작위 압축, 그리고 희소성을 이용한 복원.`,
    summary: R`$\mathbb R^d$의 자료를 $\mathbb R^n$ ($n\ll d$)으로 줄입니다. **주성분 분석**(PCA)은 선형 압축 $W$와 복원 $U$로 제곱 복원 오차를 최소로 하는 문제이고, 해는 $A=\sum_ix_ix_i^\top$의 **가장 큰 고윳값 $n$개의 고유벡터**입니다 — 분산을 가장 많이 보존하는 방향. $d\gg m$이면 $m\times m$ 그람 행렬의 고유벡터로 같은 답을 싸게 얻고, 내적만 쓰므로 **커널 PCA**로 넓어집니다. **랜덤 사영**은 자료를 보지 않고 가우시안 행렬 $W$를 곱해도, $n=O(\log\lvert Q\rvert/\varepsilon^2)$이면 유한 집합 $Q$의 모든 노름을 $1\pm\varepsilon$배 안으로 보존합니다(**존슨–린덴스트라우스**). 차원 $d$와 무관하다는 것이 핵심입니다. **압축 센싱**은 $s$-희소 벡터를 $n=O(s\log(d/s))$개의 선형 측정으로 **정확히** 복원합니다: 측정 행렬이 **제한 등거리 성질**(RIP)을 가지면 $\ell_0$ 최소화의 해가 원래 벡터이고, 볼록한 $\ell_1$ 최소화(기저 추구)도 같은 답을 주며, 가우시안 무작위 행렬은 높은 확률로 RIP를 가집니다.`,
    goals: [
      R`PCA 문제에서 최적 복원 행렬의 열이 정규직교이고 $W=U^\top$임을 보이고, 해가 최대 고유벡터들임을 증명할 수 있다`,
      R`$d\gg m$일 때 그람 행렬의 고유벡터로 PCA를 계산하고, 커널 PCA로 확장할 수 있다`,
      R`카이제곱 집중과 합집합 상한으로 존슨–린덴스트라우스 보조정리를 증명할 수 있다`,
      R`제한 등거리 성질을 정의하고, RIP 행렬에서 $\ell_0$ 최소화가 희소 벡터를 정확히 복원함을 보일 수 있다`,
      R`$\ell_1$ 최소화(기저 추구)가 선형계획이며, RIP 조건에서 $\ell_0$와 같은 해를 줌을 설명할 수 있다`,
    ],
    secTitles: { '23.1': 'PCA', '23.1b': '큰 d, 커널 PCA', '23.2': '랜덤 사영', '23.3': '압축 센싱', '23.3b': 'ℓ1 복원' },
    sections: [
      { k: '23.1', p: 324, src: '강의 노트 · 23장 3절', title: '주성분 분석', body: R`
:::def PCA 문제
$x_1,\dots,x_m\in\mathbb R^d$ (보통 평균을 빼서 중심화)에 대해 압축 $W\in\mathbb R^{n\times d}$, 복원 $U\in\mathbb R^{d\times n}$을 찾아
$$\min_{W,U}\sum_{i=1}^m\lVert x_i-UWx_i\rVert_2^2.$$
:::

**1단계 — 최적 $U$는 정규직교, $W=U^\top$.** 어떤 $(W,U)$든 $UW$의 치역은 $n$차원 이하 부분공간이고, 각 $x$를 그 부분공간의 점으로 보낼 때 가장 가까운 점은 정사영입니다. 부분공간의 정규직교 기저를 열로 둔 $V$에 대해 정사영은 $VV^\top x$이므로 $(V^\top,V)$가 적어도 같은 성능입니다.

**2단계 — 대각합 최대화.** $U^\top U=I$이면 $\lVert x-UU^\top x\rVert^2=\lVert x\rVert^2-\operatorname{tr}(U^\top xx^\top U)$. 그러므로 문제는
$$\max_{U^\top U=I}\operatorname{tr}\big(U^\top AU\big),\qquad A=\sum_ix_ix_i^\top.$$

:::key PCA의 해
$A$의 가장 큰 고윳값 $n$개에 대응하는 정규직교 고유벡터 $u_1,\dots,u_n$을 열로 둔 $U$와 $W=U^\top$이 PCA의 해이다. 최소 복원 오차는 버린 고윳값의 합 $\sum_{j>n}\lambda_j$이다.
:::

증명 요지: $A=VDV^\top$, $B=V^\top U$라 두면 $\operatorname{tr}(U^\top AU)=\sum_j\lambda_j\beta_j$, $\beta_j=\lVert B_{j\cdot}\rVert^2\in[0,1]$, $\sum_j\beta_j=n$. 이런 $\beta$로 만들 수 있는 최대는 큰 고윳값 $n$개에 1씩 주는 것이고, 최대 고유벡터들이 이를 이룹니다.

:::note 분산 최대화로 보기
중심화된 자료에서 $u^\top Au=\sum_i\langle u,x_i\rangle^2$은 방향 $u$로의 사영의 분산(×$m$)입니다. 첫 주성분은 레일리 몫 $\frac{u^\top Au}{u^\top u}$의 최대점 — 분산이 가장 큰 방향 — 이고, 다음 성분은 앞 성분과 직교하는 방향 중 분산이 가장 큰 방향입니다[[@em:ch07:8.4|대칭행렬의 고유분해와 이차형식.]].
:::
` },
      { k: '23.1b', p: 326, src: '강의 노트 · 23장 3절, DSML 6장 보충', title: '큰 d에서의 PCA와 커널 PCA', body: R`
$X\in\mathbb R^{m\times d}$ (행이 $x_i^\top$)이면 $A=X^\top X$ ($d\times d$). $d\gg m$이면 $d\times d$ 고유분해가 비쌉니다.

:::key d가 m보다 클 때의 PCA
$B=XX^\top$ ($m\times m$, $B_{ij}=\langle x_i,x_j\rangle$)의 고유벡터 $v$ ($Bv=\lambda v$, $\lambda>0$)에 대해 $u=\frac{X^\top v}{\lVert X^\top v\rVert}$는 $A$의 고윳값 $\lambda$의 단위 고유벡터이다.
:::

$A(X^\top v)=X^\top XX^\top v=X^\top Bv=\lambda X^\top v$. 그리고 $\lVert X^\top v\rVert^2=v^\top Bv=\lambda\lVert v\rVert^2>0$이라 0이 아닙니다. 계산량 $O(m^3+m^2d)$.

**SVD와의 관계.** $X=U\Sigma V^\top$이면 $A=V\Sigma^2V^\top$, $B=U\Sigma^2U^\top$ — PCA의 주성분은 $X$의 오른쪽 특이벡터이고, 에카르트–영 정리에 따라 계수 $n$ 근사 중 프로베니우스 오차가 가장 작은 것은 특이값 $n$개로 자른 SVD입니다.

**커널 PCA.** 위 계산은 $x_i$를 내적 $\langle x_i,x_j\rangle$으로만 씁니다. 그러므로 특징 사상 $\psi$의 커널 $K(x_i,x_j)$로 그람 행렬을 바꾸면 특징 공간의 PCA가 됩니다. 새 점 $x$의 $k$번째 성분 좌표는 $\frac1{\sqrt{\lambda_k}}\sum_iv_{k,i}K(x_i,x)$. 특징 공간에서의 중심화는 $\tilde K=HKH$, $H=I-\frac1m\mathbf 1\mathbf 1^\top$로 합니다.
` },
      { k: '23.2', p: 329, src: '강의 노트 · 23장 4절', title: '랜덤 사영과 존슨–린덴스트라우스', body: R`
PCA와 달리 **자료를 보지 않고** 무작위 선형사상 $W\in\mathbb R^{n\times d}$ (원소 i.i.d. $\N(0,\frac1n)$)로 줄입니다. 놀랍게도 유한 집합의 기하가 거의 보존됩니다.

:::key 카이제곱 집중
$Z\sim\chi^2_n$ (표준정규 $n$개 제곱합), $0<\varepsilon\le1$이면
$$\Prob\big(Z\ge(1+\varepsilon)n\big)\le e^{-n\varepsilon^2/8},\qquad\Prob\big(Z\le(1-\varepsilon)n\big)\le e^{-n\varepsilon^2/4}.$$
고정된 $x\ne0$에 대해 $n\lVert Wx\rVert^2/\lVert x\rVert^2\sim\chi^2_n$이므로 $\Prob\big(\big\lvert\frac{\lVert Wx\rVert^2}{\lVert x\rVert^2}-1\big\rvert>\varepsilon\big)\le2e^{-n\varepsilon^2/8}$.
:::

위 꼬리는 적률생성함수 $\E e^{tZ}=(1-2t)^{-n/2}$와 마르코프로 $\inf_t e^{-tn(1+\varepsilon)}(1-2t)^{-n/2}=e^{-\frac n2(\varepsilon-\ln(1+\varepsilon))}$이고, $0<\varepsilon\le1$에서 $\varepsilon-\ln(1+\varepsilon)\ge\frac{\varepsilon^2}4$입니다.

:::key 존슨–린덴스트라우스 보조정리
유한 집합 $Q\subset\mathbb R^d$, $0<\varepsilon\le1$, $\delta\in(0,1)$, $n\ge\frac{8\ln(2\lvert Q\rvert/\delta)}{\varepsilon^2}$이면 확률 $1-\delta$ 이상으로 모든 $x\in Q$에서
$$(1-\varepsilon)\lVert x\rVert^2\le\lVert Wx\rVert^2\le(1+\varepsilon)\lVert x\rVert^2.$$
:::

한 점의 실패 확률 $2e^{-n\varepsilon^2/8}$에 합집합 상한. $m$개 점의 모든 **쌍의 거리**를 보존하려면 차이 벡터 $\le m^2$개에 적용하면 되므로 $n=O(\log m/\varepsilon^2)$ — **원래 차원 $d$와 무관**합니다. 극화 항등식 $\langle u,v\rangle=\frac14(\lVert u+v\rVert^2-\lVert u-v\rVert^2)$로 단위 벡터들의 내적도 $\pm\varepsilon$ 안에서 보존됩니다.

:::warn 교재 부록의 상수에 대해
교재(보조정리 B.12, 23.3, 23.4)는 위 꼬리를 $\varepsilon\in(0,3)$에서 $e^{-\varepsilon^2n/6}$로 적었지만, 증명의 한 단계 $(1-2\lambda)^{-n/2}\le e^{\lambda n}$은 부등호 방향이 반대입니다($1-a\le e^{-a}$이므로 오히려 $\ge$). 참 지수는 $\frac n2(\varepsilon-\ln(1+\varepsilon))$이라, 예컨대 $\varepsilon=2$, $n=100$이면 약 $45$로 $\frac{\varepsilon^2n}6\approx67$보다 작습니다 — 즉 교재의 상한은 큰 $\varepsilon$에서 성립하지 않습니다. 강의 노트는 $0<\varepsilon\le1$과 상수 8로 올바르게 적었고, 여기서도 그것을 따릅니다. ($\varepsilon\le\frac12$ 정도로 제한하면 교재의 상수 6도 맞습니다.)
:::
` },
      { k: '23.3', p: 330, src: '강의 노트 · 23장 5절', title: '압축 센싱과 제한 등거리 성질', body: R`
$x\in\mathbb R^d$가 **$s$-희소**($\lVert x\rVert_0\le s$, 0이 아닌 성분이 $s$개 이하)라면 측정 $y=Wx\in\mathbb R^n$을 $n\ll d$개만 해도 $x$를 정확히 되찾을 수 있을까요? 희소성 없이는 불가능합니다($n<d$이면 $W$의 영공간이 0이 아니라 $x$와 $x+z$를 구별할 수 없음).

:::def 제한 등거리 성질 (RIP)
$W\in\mathbb R^{n\times d}$가 **$(\varepsilon,s)$-RIP**: $\lVert x\rVert_0\le s$인 모든 $x\ne0$에서
$$\left\lvert\frac{\lVert Wx\rVert_2^2}{\lVert x\rVert_2^2}-1\right\rvert\le\varepsilon.$$
:::

:::key RIP 행렬의 ℓ0 복원
$\varepsilon<1$이고 $W$가 $(\varepsilon,2s)$-RIP이면, $\lVert x\rVert_0\le s$, $y=Wx$에 대해 $\tilde x\in\argmin_{v:Wv=y}\lVert v\rVert_0$는 $\tilde x=x$이다.
:::

$\tilde x\ne x$라 하면 $\lVert\tilde x\rVert_0\le\lVert x\rVert_0\le s$이므로 $x-\tilde x$는 $2s$-희소이고 0이 아닙니다. $W(x-\tilde x)=y-y=0$이라 $\frac{\lVert W(x-\tilde x)\rVert^2}{\lVert x-\tilde x\rVert^2}=0$, $\lvert0-1\rvert=1>\varepsilon$ — RIP에 모순.

**무작위 행렬은 RIP를 가진다.** 원소가 i.i.d. $\N(0,\frac1n)$인 $W$와 임의의 정규직교 $U$에 대해
$$n\ge100\,\frac{s\ln\big(40d/(\delta\varepsilon)\big)}{\varepsilon^2}$$
이면 확률 $1-\delta$ 이상으로 $WU$가 $(\varepsilon,s)$-RIP입니다. 증명은 JL의 확장: $s$-희소 벡터들의 부분공간 $\binom ds$개 각각에서 단위구를 유한 그물로 덮고 JL을 적용합니다. 그래서 측정 수는 $s\log d$ 정도면 됩니다. ($U$가 있으므로 어떤 정규직교 기저에서 희소한 신호 — 예: 웨이블릿 계수가 희소한 영상 — 에도 통합니다.)
` },
      { k: '23.3b', p: 332, src: '강의 노트 · 23장 5절', title: 'ℓ1 최소화로 복원하기', body: R`
$\ell_0$ 최소화는 조합적이라 계산이 어렵습니다. 볼록 완화 $\ell_1$을 씁니다:
$$x^\star\in\argmin_{v:\,Wv=y}\lVert v\rVert_1.$$
$v=v^+-v^-$ ($v^\pm\ge0$)로 쓰면 $\min\mathbf 1^\top(v^++v^-)$ s.t. $W(v^+-v^-)=y$, $v^\pm\ge0$ — **선형계획**(기저 추구)입니다.

:::key ℓ1 최소화의 안정적 복원
$\varepsilon<\frac1{1+\sqrt2}$이고 $W$가 $(\varepsilon,2s)$-RIP이면, 임의의 $x$와 $y=Wx$에 대해
$$\lVert x^\star-x\rVert_2\le2\,\frac{1+\rho}{1-\rho}\,s^{-1/2}\,\lVert x-x_s\rVert_1,\qquad\rho=\frac{\sqrt2\,\varepsilon}{1-\varepsilon}<1,$$
여기서 $x_s$는 $x$의 크기 상위 $s$개 성분만 남긴 벡터. 특히 $x$가 $s$-희소이면 $x^\star=x$ — $\ell_1$과 $\ell_0$ 최소화가 같은 답을 준다.
:::

증명 요지(강의 노트 5.7절): $h=x^\star-x$는 $Wh=0$. $x_s$의 지지집합 $T_0$ 밖을 $h$의 크기 순으로 $s$개씩 블록 $T_1,T_2,\dots$로 나누면 (1) $\ell_1$ 최적성으로 $T_0$ 밖의 $h$가 안쪽보다 크지 않고(원뿔 조건), (2) 블록 꼬리 부등식 $\sum_{j\ge2}\lVert h_{T_j}\rVert_2\le s^{-1/2}\lVert h_{T_0^c}\rVert_1$, (3) RIP의 근사 직교성 $\lvert\langle Wa,Wb\rangle\rvert\le\varepsilon\lVert a\rVert\lVert b\rVert$ (서로소 지지집합)을 합쳐 $\lVert h_{T_0\cup T_1}\rVert_2$를 스스로의 $\rho$배 + 꼬리로 누릅니다. $\rho<1$이라 정리됩니다.

:::note PCA와 압축 센싱
PCA는 **자료에 맞춘** 최적의 선형 압축이지만 복원은 근사입니다. 압축 센싱은 **자료를 보지 않는** 무작위 압축인데, 희소성이라는 사전 지식 덕분에 복원이 **정확**합니다. 대신 복원은 선형이 아니라 최적화 문제를 풀어야 합니다.
:::
` },
    ],
    problems: [
      { sec: '23.1', type: 'mc', lv: 1, q: R`PCA의 첫 주성분은 무엇인가?`,
        choices: [R`$A=\sum x_ix_i^\top$의 가장 작은 고윳값의 고유벡터`, R`$A$의 가장 큰 고윳값의 고유벡터 (사영 분산이 최대인 방향)`, R`자료의 평균 벡터`, R`임의의 단위벡터`], ans: 1,
        sol: R`$\max_{\lVert u\rVert=1}u^\top Au$의 해는 최대 고유벡터입니다(레일리 몫).` },
      { sec: '23.1', type: 'num', lv: 2, q: R`$A$의 고윳값이 $10,5,2,1$일 때 $n=2$로 PCA를 하면 최소 복원 오차는?`, ans: '3', ansTex: R`2+1=3`,
        sol: R`버린 고윳값의 합 $2+1=3$. 보존 비율 $15/18\approx83\%$.` },
      { sec: '23.1', type: 'num', lv: 2, q: R`2차원 중심화된 자료 $(2,2),(-2,-2),(1,-1),(-1,1)$에서 $A=\sum x_ix_i^\top$의 가장 큰 고윳값은?`, ans: '16', ansTex: R`16`,
        sol: R`$A=\begin{pmatrix}4+4+1+1&4+4-1-1\\\cdot&10\end{pmatrix}=\begin{pmatrix}10&6\\6&10\end{pmatrix}$. 고윳값 $16$ (방향 $(1,1)$), $4$ (방향 $(1,-1)$).` },
      { sec: '23.1b', type: 'mc', lv: 2, q: R`$d=10^6$, $m=500$일 때 PCA를 싸게 계산하는 방법은?`,
        choices: [R`$d\times d$ 행렬 $X^\top X$를 고유분해한다`, R`$m\times m$ 그람 행렬 $XX^\top$의 고유벡터 $v$로 $u\propto X^\top v$를 만든다`, R`무작위 방향을 고른다`, R`$d$를 줄일 수 없다`], ans: 1,
        sol: R`$X^\top XX^\top v=\lambda X^\top v$. $500\times500$ 문제로 바뀝니다.` },
      { sec: '23.2', type: 'num', lv: 1, q: R`$\lvert Q\rvert=1000$, $\varepsilon=0.1$, $\delta=0.01$일 때 JL이 요구하는 차원 $n\ge8\ln(2\lvert Q\rvert/\delta)/\varepsilon^2$의 최솟값은? (올림)`, ans: '9765', ansTex: R`\lceil800\ln(2\times10^5)\rceil=9765`,
        sol: R`$\ln(2\times10^5)=\ln2+5\ln10=12.206$, $800\times12.206=9764.9$이므로 9765.` },
      { sec: '23.2', type: 'mc', lv: 2, q: R`JL 보조정리의 차원 $n$이 기대지 **않는** 것은?`,
        choices: [R`점의 개수 $\lvert Q\rvert$`, R`허용 오차 $\varepsilon$`, R`원래 차원 $d$`, R`실패 확률 $\delta$`], ans: 2,
        sol: R`$n=O(\ln(\lvert Q\rvert/\delta)/\varepsilon^2)$. 원래 차원이 얼마든 상관없습니다.` },
      { sec: '23.2', type: 'num', lv: 3, q: R`$\chi^2_n$의 위 꼬리 체르노프 지수 $\frac n2(\varepsilon-\ln(1+\varepsilon))$를 $n=100$, $\varepsilon=2$에서 계산하면? (소수 둘째 자리)`, ans: '50*(2-ln(3))', ansTex: R`50(2-\ln3)\approx45.07`,
        sol: R`$50(2-1.0986)=45.07$. 교재식 $\varepsilon^2n/6\approx66.7$보다 작아, 교재의 큰 $\varepsilon$ 상한이 성립하지 않음을 보여 줍니다.` },
      { sec: '23.3', type: 'mc', lv: 2, q: R`$(\varepsilon,2s)$-RIP 행렬에서 $s$-희소 벡터가 $\ell_0$ 최소화로 유일하게 복원되는 핵심 이유는?`,
        choices: [R`$W$가 가역이라서`, R`두 $s$-희소 해의 차이는 $2s$-희소이고, RIP이면 $2s$-희소한 0 아닌 벡터를 0으로 보낼 수 없어서`, R`$\ell_0$가 볼록이라서`, R`$n\ge d$라서`], ans: 1,
        sol: R`$W(x-\tilde x)=0$이면 RIP 비가 0이라 $\lvert0-1\rvert\le\varepsilon<1$에 모순.` },
      { sec: '23.3', type: 'mc', lv: 1, q: R`$\lVert(0,3,0,0,-1,0)\rVert_0$과 $\lVert\cdot\rVert_1$은?`,
        choices: [R`2와 4`, R`2와 2`, R`6과 4`, R`4와 2`], ans: 0,
        sol: R`0이 아닌 성분 2개, 절댓값 합 $3+1=4$.` },
      { sec: '23.3b', type: 'num', lv: 2, q: R`ℓ1 복원 정리에서 $\varepsilon=0.2$이면 $\rho=\sqrt2\varepsilon/(1-\varepsilon)$은? (소수 넷째 자리)`, ans: 'sqrt(2)*0.2/0.8', ansTex: R`\approx0.3536`,
        sol: R`$1.4142\times0.2/0.8\approx0.3536<1$. 조건 $\varepsilon<\frac1{1+\sqrt2}\approx0.414$을 만족합니다.` },
      { sec: '23.3b', type: 'mc', lv: 2, q: R`기저 추구 $\min\lVert v\rVert_1$ s.t. $Wv=y$를 선형계획으로 바꾸는 방법은?`,
        choices: [R`$v$를 정규화한다`, R`$v=v^+-v^-$, $v^\pm\ge0$로 쪼개 목적함수 $\mathbf1^\top(v^++v^-)$를 쓴다`, R`제곱 노름으로 바꾼다`, R`$W$를 대각화한다`], ans: 1,
        sol: R`최적해에서 $v_i^+v_i^-=0$이 되어 $\mathbf1^\top(v^++v^-)=\lVert v\rVert_1$입니다.` },
      { sec: '23.1', type: 'open', lv: 3, proof: true, q: R`$U^\top U=I_n$인 $U\in\mathbb R^{d\times n}$에 대해 $\operatorname{tr}(U^\top AU)$ ($A\succeq0$ 대칭, 고윳값 $\lambda_1\ge\dots\ge\lambda_d$)의 최댓값이 $\sum_{j\le n}\lambda_j$이고 최대 고유벡터들로 이루어짐을 증명하세요.`,
        sol: R`
$A=VDV^\top$, $B=V^\top U$ ($d\times n$). $B^\top B=U^\top VV^\top U=I$라 $B$의 열은 정규직교.
$\operatorname{tr}(U^\top AU)=\operatorname{tr}(B^\top DB)=\sum_j\lambda_j\beta_j$, $\beta_j=\sum_{i}B_{ji}^2$ ($B$의 $j$행 노름 제곱).
$\sum_j\beta_j=\lVert B\rVert_F^2=n$. 또 $B$의 열을 정규직교 기저 $\tilde B\in\mathbb R^{d\times d}$로 넓히면 $\tilde B$의 각 행 노름 제곱이 1이라 $\beta_j\le1$.
$0\le\beta_j\le1$, $\sum\beta_j=n$일 때 $\sum\lambda_j\beta_j\le\sum_{j\le n}\lambda_j$ (큰 계수에 무게를 몰아줄 때 최대). $U=[u_1,\dots,u_n]$ (최대 고유벡터)이면 $\beta=(1,\dots,1,0,\dots)$로 등호.`,
        rubric: R`
- $B=V^\top U$로 바꾸고 $\sum\lambda_j\beta_j$ 표현 — 3점
- $\sum\beta_j=n$, $0\le\beta_j\le1$ — 4점
- 최대와 달성 — 3점` },
      { sec: '23.2', type: 'open', lv: 2, proof: true, q: R`고정된 $x\ne0$에 대해 $\Prob(\lvert\lVert Wx\rVert^2/\lVert x\rVert^2-1\rvert>\varepsilon)\le2e^{-n\varepsilon^2/8}$ ($0<\varepsilon\le1$, $W$ 원소 i.i.d. $\N(0,1/n)$)을 받아들이고, 존슨–린덴스트라우스 보조정리를 증명하세요. 또 $m$개 점의 모든 쌍의 거리를 보존하는 데 필요한 차원을 쓰세요.`,
        sol: R`
$Q$의 각 $x$에 대해 실패 사건 $E_x$의 확률 $\le2e^{-n\varepsilon^2/8}$. 합집합 상한: $\Prob(\bigcup_xE_x)\le2\lvert Q\rvert e^{-n\varepsilon^2/8}$.
$n\ge8\ln(2\lvert Q\rvert/\delta)/\varepsilon^2\iff2\lvert Q\rvert e^{-n\varepsilon^2/8}\le\delta$. 따라서 확률 $1-\delta$ 이상으로 모든 $x\in Q$에서 $(1-\varepsilon)\lVert x\rVert^2\le\lVert Wx\rVert^2\le(1+\varepsilon)\lVert x\rVert^2$.
쌍의 거리: $Q=\{x_i-x_j\}$ ($\le m^2$개)에 적용하고 $W$가 선형이라 $W(x_i-x_j)=Wx_i-Wx_j$. 필요한 차원 $n\ge8\ln(2m^2/\delta)/\varepsilon^2$.`,
        rubric: R`
- 합집합 상한 — 3점
- $n$ 조건과 $\delta$의 동치 — 3점
- 차이 벡터와 선형성으로 거리 보존 — 4점` },
    ],
  });
})();
