/* 증명 — 17 선형대수학(강의 PPT). keys는 lec-17.js의 key/thm 상자 제목과 정확히 같아야 합니다.
   슬라이드에서 “확인하시오”, “Why?”로 남긴 곳은 src에 슬라이드 번호를 적었습니다. */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 1절 벡터공간
  { ch: 'ch17', id: 'vs-basic', title: '공리에서 나오는 벡터공간의 기본 성질', keys: ['공리에서 바로 나오는 성질'],
    tags: 'vector space axioms zero vector additive inverse unique 벡터공간 공리 영벡터 역원 유일',
    stmt: R`벡터공간 $V$에서 영벡터와 각 벡터의 역원은 유일하고, 모든 $v\in V$, $a\in\mathbb F$에 대하여 $0v=0$, $a0=0$, $(-1)v=-v$이다.`,
    body: R`
**영벡터의 유일성.** $0$과 $0'$이 모두 (V3)을 만족하면 $0'=0'+0=0+0'=0$. (첫 등호는 $0$이 영벡터, 둘째는 (V2), 셋째는 $0'$이 영벡터.)

**역원의 유일성.** $v+w=0$이고 $v+w'=0$이면
$$w=w+0=w+(v+w')=(w+v)+w'=0+w'=w'.$$
(V3, V1, V2를 차례로 썼습니다.)

**$0v=0$.** (V7)로 $0v=(0+0)v=0v+0v$. 양변에 $0v$의 역원 $u$를 더하면 왼쪽은 $0v+u=0$, 오른쪽은 $(0v+0v)+u=0v+(0v+u)=0v+0=0v$. 따라서 $0=0v$.

**$a0=0$.** (V8)로 $a0=a(0+0)=a0+a0$이고, 같은 방법으로 $a0=0$.

**$(-1)v=-v$.** $v+(-1)v=1v+(-1)v=\big(1+(-1)\big)v=0v=0$ (V5, V7, 위의 결과). 즉 $(-1)v$는 $v$의 역원이고, 역원은 유일하므로 $(-1)v=-v$.` },
  { ch: 'ch17', id: 'subspace-test', title: '부분공간 판정법', keys: ['부분공간 판정법'],
    tags: 'subspace test closed under addition scalar multiplication 부분공간 판정 닫힘',
    stmt: R`$W\subseteq V$가 (1) $0\in W$ (2) 덧셈에 닫힘 (3) 상수곱에 닫힘을 만족하면 $W$는 $V$의 부분공간이다. 거꾸로 부분공간이면 세 조건을 만족한다.`,
    body: R`
(2), (3)에 의해 $V$의 덧셈과 상수곱을 $W$로 제한한 것이 $W\times W\to W$, $\mathbb F\times W\to W$로 잘 정의됩니다.

(V1), (V2), (V5)–(V8)은 “$V$의 **모든** 원소에 대해 성립하는 등식”이므로 $W$의 원소에 대해서도 성립합니다.

(V3): $0\in W$이고 모든 $v\in W$에 대해 $v+0=v$.

(V4): $u\in W$이면 (3)에서 $(-1)u\in W$이고, 기본 성질에 의해 $(-1)u=-u$이므로 $u$의 역원이 $W$ 안에 있습니다.

따라서 $W$는 벡터공간, 즉 $W\le V$입니다.

**역.** $W$가 부분공간이면 닫힘은 정의에 들어 있습니다. $W$의 영벡터 $0_W$는 $0_W+0_W=0_W$를 만족하는데, $V$에서 양변에 $0_W$의 역원을 더하면 $0_W=0_V$. 따라서 $0_V\in W$.`,
    note: R`(1)은 “$W\ne\varnothing$”으로 바꿔도 됩니다. $u\in W$가 하나라도 있으면 (3)에서 $0u=0\in W$이기 때문입니다. 답안에서는 $0\in W$를 직접 확인하는 것이 가장 안전합니다.` },
  { ch: 'ch17', id: 'span-smallest', title: '생성공간은 S를 포함하는 가장 작은 부분공간', keys: ['생성공간은 부분공간'],
    tags: 'span smallest subspace linear combination 생성공간 일차결합 가장 작은 부분공간',
    stmt: R`공집합이 아닌 $S\subseteq V$에 대하여 $\operatorname{span}(S)$는 $S$를 포함하는 부분공간이고, $S$를 포함하는 모든 부분공간 $U$에 대해 $\operatorname{span}(S)\subseteq U$이다.`,
    body: R`
**부분공간.** $v\in S$ 하나를 잡으면 $0=0v\in\operatorname{span}(S)$. 두 일차결합 $\sum_{i=1}^ma_iu_i$, $\sum_{j=1}^nb_jw_j$ ($u_i,w_j\in S$)의 합은 $m+n$개 항의 일차결합이므로 다시 $\operatorname{span}(S)$에 있습니다. $c\sum a_iu_i=\sum(ca_i)u_i$도 마찬가지. 판정법에 의해 부분공간입니다.

**$S$를 포함.** $v\in S$이면 $v=1v\in\operatorname{span}(S)$.

**가장 작음.** $U\le V$가 $S\subseteq U$이면, $U$는 상수곱과 덧셈에 닫혀 있으므로 $a_iv_i\in U$이고, 항의 개수에 대한 귀납법으로 유한 합 $\sum_{i=1}^na_iv_i\in U$. 따라서 $\operatorname{span}(S)\subseteq U$.` },
  { ch: 'ch17', id: 'basis-exists', title: '모든 벡터공간은 기저를 갖는다', keys: ['기저의 존재'],
    tags: 'basis existence finite generated Zorn lemma maximal independent 기저 존재 초른 보조정리',
    stmt: R`모든 벡터공간은 기저를 갖는다. (유한개의 벡터로 생성되는 경우를 완전히 증명하고, 일반적인 경우는 초른 보조정리로 보인다.)`,
    body: R`
**유한개로 생성되는 경우.** $V=\operatorname{span}\{u_1,\dots,u_k\}$라 하자($V=\{0\}$이면 공집합이 기저). $V$를 생성하는 $\{u_1,\dots,u_k\}$의 부분집합 중 원소 수가 가장 적은 것 $\beta$를 고릅니다.

$\beta$가 일차종속이라 가정하면 계수가 모두 0은 아닌 $\sum_{v\in\beta}a_vv=0$이 있고, $a_{v_0}\ne0$인 $v_0$에 대해
$$v_0=-\frac1{a_{v_0}}\sum_{v\ne v_0}a_vv\in\operatorname{span}(\beta\setminus\{v_0\}).$$
그러면 $\beta$의 일차결합에 나오는 $v_0$를 이 식으로 바꿔 쓸 수 있으므로 $\beta\setminus\{v_0\}$도 $V$를 생성합니다. 이는 $\beta$가 가장 작다는 것에 모순. 따라서 $\beta$는 일차독립이고 $V$를 생성하므로 기저입니다.

**일반적인 경우.** 일차독립인 부분집합 전체를 포함 관계로 순서를 줍니다. 사슬(서로 포함 관계로 비교되는 모임)의 합집합은 다시 일차독립입니다. 일차독립은 유한 부분집합마다 확인하는 성질이고, 유한개의 원소는 사슬의 한 집합에 모두 들어 있기 때문입니다. 초른 보조정리로 극대인 일차독립 집합 $\beta$가 존재합니다.

$\operatorname{span}(\beta)\ne V$라면 $v\notin\operatorname{span}(\beta)$를 잡을 수 있고, $\beta\cup\{v\}$는 일차독립입니다($av+\sum a_iv_i=0$에서 $a\ne0$이면 $v\in\operatorname{span}\beta$가 되어 모순이므로 $a=0$, 그러면 나머지도 0). 이는 극대성에 모순이므로 $\operatorname{span}(\beta)=V$, 즉 $\beta$가 기저입니다.`,
    note: R`무한차원에서 초른 보조정리(선택공리와 동치)가 필요하다는 것은, $C[a,b]$ 같은 공간의 기저를 구체적으로 적을 수 없다는 뜻이기도 합니다. 그래서 함수 공간에서는 무한 합을 허용하는 정규직교기저(힐베르트 공간)를 대신 씁니다.` },
  { ch: 'ch17', id: 'basis-size', title: '두 기저의 크기는 같다 (교환 보조정리)', keys: ['기저의 크기는 같다'],
    tags: 'dimension well defined replacement exchange lemma Steinitz basis size 기저 크기 차원 교환 보조정리',
    stmt: R`$V$가 $n$개의 벡터로 생성되면 $V$의 일차독립인 집합의 원소는 많아야 $n$개이다. 따라서 유한차원 벡터공간의 두 기저는 크기가 같다.`,
    body: R`
**교환 보조정리.** $V=\operatorname{span}\{w_1,\dots,w_n\}$이고 $\{u_1,\dots,u_m\}$이 일차독립이라 하자. $k=0,1,\dots,\min(m,n)$에 대해 “(번호를 적절히 바꾸면) $\{u_1,\dots,u_k,w_{k+1},\dots,w_n\}$이 $V$를 생성한다”를 귀납법으로 보입니다.

$k=0$이면 가정 그대로입니다. $k$에서 성립하고 $k\lt m$이라 하자. $u_{k+1}$을 생성 집합으로 쓰면
$$u_{k+1}=\sum_{i=1}^kb_iu_i+\sum_{j=k+1}^nc_jw_j.$$
모든 $c_j=0$이면 $u_{k+1}\in\operatorname{span}\{u_1,\dots,u_k\}$가 되어 독립성에 모순입니다. 따라서 어떤 $c_j\ne0$이고, 번호를 바꿔 $c_{k+1}\ne0$이라 하면
$$w_{k+1}=\frac1{c_{k+1}}\Big(u_{k+1}-\sum_ib_iu_i-\sum_{j\ge k+2}c_jw_j\Big)\in\operatorname{span}\{u_1,\dots,u_{k+1},w_{k+2},\dots,w_n\}.$$
그러므로 $w_{k+1}$을 $u_{k+1}$로 바꿔도 여전히 $V$를 생성합니다. 이 과정에서 매번 $w$가 하나 남아 있어야 하므로($c_j\ne0$인 $j\ge k+1$이 존재) $m\le n$입니다. 실제로 $m\gt n$이면 $n$번 교환한 뒤 $\{u_1,\dots,u_n\}$이 $V$를 생성하여 $u_{n+1}\in\operatorname{span}\{u_1,\dots,u_n\}$이 되므로 모순입니다.

**결론.** $\beta,\gamma$가 기저이고 $\lvert\beta\rvert=n$, $\lvert\gamma\rvert=m$이면, $\gamma$는 독립이고 $\beta$는 생성하므로 $m\le n$. 역할을 바꾸면 $n\le m$. 따라서 $m=n$.`,
    note: R`무한차원에서도 $\lvert\beta\rvert=\lvert\gamma\rvert$가 성립합니다. $\gamma$의 각 원소는 $\beta$의 **유한** 부분집합으로 쓰이고 $\beta$의 모든 원소가 그중 어딘가에 쓰여야 하므로, $\lvert\beta\rvert\le\aleph_0\cdot\lvert\gamma\rvert=\lvert\gamma\rvert$가 되는 기수 계산을 씁니다(슬라이드 10의 집합론이 필요한 이유).` },
  { ch: 'ch17', id: 'coord-unique', title: '기저에 대한 좌표의 유일성', keys: ['기저에 대한 좌표의 유일성'],
    tags: 'coordinates unique representation basis 좌표 유일 표현 기저',
    stmt: R`$\beta=\{v_1,\dots,v_n\}$이 기저이면 모든 $v\in V$는 $v=\sum a_iv_i$로 유일하게 쓰인다. 거꾸로 모든 벡터가 유일하게 쓰이면 $\beta$는 기저이다.`,
    body: R`
**존재.** $\operatorname{span}(\beta)=V$이므로 어떤 $a_i$로 $v=\sum a_iv_i$.

**유일.** $v=\sum a_iv_i=\sum b_iv_i$이면 빼서 $\sum(a_i-b_i)v_i=0$. $\beta$가 일차독립이므로 모든 $a_i-b_i=0$.

**역.** 모든 벡터가 일차결합으로 쓰이므로 $\beta$는 $V$를 생성합니다. $\sum a_iv_i=0=\sum0\cdot v_i$에서 표현의 유일성으로 $a_i=0$이므로 일차독립입니다.` },
  { ch: 'ch17', id: 'countable', title: '정수와 유리수는 셀 수 있다', keys: ['셀 수 있는 무한집합'],
    tags: 'countable integers rationals aleph null bijection 가산 셀 수 있는 정수 유리수 일대일대응',
    stmt: R`$\mathbb Z$와 $\mathbb Q$는 $\mathbb N=\{1,2,3,\dots\}$과 기수가 같다.`,
    body: R`
**$\mathbb Z$.** $f:\mathbb N\to\mathbb Z$를 $f(n)=\frac n2$ ($n$ 짝수), $f(n)=-\frac{n-1}2$ ($n$ 홀수)로 두면 $f(1),f(2),f(3),f(4),f(5),\dots=0,1,-1,2,-2,\dots$입니다. 역함수 $g(k)=2k$ ($k\gt0$), $g(k)=1-2k$ ($k\le0$)가 있으므로 전단사입니다.

**$\mathbb N\times\mathbb N$.** $h(p,q)=2^{p-1}(2q-1)$은 $\mathbb N\times\mathbb N\to\mathbb N$의 전단사입니다. 모든 자연수는 “2의 거듭제곱 × 홀수”로 유일하게 쓰이기 때문입니다.

**$\mathbb Q$.** 양의 유리수를 기약분수 $\frac pq$로 쓰고 $(p,q)\in\mathbb N\times\mathbb N$을 대응시키면 단사입니다. 따라서 양의 유리수 전체 $\mathbb Q^+$는 $\mathbb N$의 무한 부분집합과 짝지어지고, $\mathbb N$의 무한 부분집합은 작은 순서대로 번호를 붙이면 $\mathbb N$과 전단사이므로 $\lvert\mathbb Q^+\rvert=\aleph_0$. 끝으로 $\mathbb Q=\mathbb Q^-\cup\{0\}\cup\mathbb Q^+$를 $\mathbb Z$와 같은 방법(0, 양, 음을 번갈아)으로 나열하면 $\lvert\mathbb Q\rvert=\aleph_0$입니다.`,
    note: R`수업의 “대각선을 따라 나열하기”는 $\mathbb N\times\mathbb N$을 한 줄로 세우는 그림이고, $h$는 그것을 식으로 쓴 것입니다.` },
  { ch: 'ch17', id: 'cantor', title: '칸토어의 대각선 논법: 실수는 셀 수 없다', keys: ['칸토어의 대각선 논법'],
    tags: 'Cantor diagonal argument uncountable reals continuum 칸토어 대각선 논법 비가산 실수',
    stmt: R`구간 $(0,1)$은 셀 수 없다. 따라서 $\mathbb R$도 셀 수 없다.`,
    body: R`
귀류법. $(0,1)$의 모든 원소를 $x_1,x_2,x_3,\dots$로 나열할 수 있다고 하자. 각 $x_n$을 **9가 끝없이 이어지지 않는** 소수 전개
$$x_n=0.d_{n1}d_{n2}d_{n3}\cdots$$
로 씁니다. (예: $0.1999\cdots=0.2000\cdots$이므로 뒤쪽을 택합니다. 이렇게 정하면 전개가 유일합니다.)

새 수 $y=0.e_1e_2e_3\cdots$를 $e_n=5$ ($d_{nn}\ne5$일 때), $e_n=4$ ($d_{nn}=5$일 때)로 정합니다. $y$의 자리는 4와 5뿐이므로 $0\lt y\lt1$이고, 9가 이어지지 않으므로 이것이 $y$의 유일한 전개입니다.

모든 $n$에 대해 $e_n\ne d_{nn}$이므로 $y$와 $x_n$은 $n$번째 자리가 다르고, 전개가 유일하므로 $y\ne x_n$. 즉 $y$는 목록에 없는데 $y\in(0,1)$ — 모순입니다. 따라서 $(0,1)$은 셀 수 없습니다.

$\phi(x)=\tan\big(\pi(x-\frac12)\big)$는 $(0,1)$에서 $\mathbb R$로의 전단사이므로 $\lvert\mathbb R\rvert=\lvert(0,1)\rvert$이고, $\mathbb R$도 셀 수 없습니다.`,
    note: R`이진 전개로 같은 논증을 하면 $(0,1)$의 수와 $\mathbb N$의 부분집합(1이 나오는 자리들의 집합)을 대응시킬 수 있어, $\lvert\mathbb R\rvert=\lvert\mathcal P(\mathbb N)\rvert=2^{\aleph_0}$이 됩니다(세부는 범위 밖).` },
  // ───── 2절 선형사상
  { ch: 'ch17', id: 'lin-basic', title: '선형사상의 기본 성질', keys: ['선형사상의 기본 성질'],
    tags: 'linear map zero to zero negation linear combination 선형사상 기본 성질 L(0)=0',
    stmt: R`$L:V\to W$가 선형이면 $L(0)=0$, $L(-v)=-L(v)$, $L\big(\sum_{i=1}^na_iv_i\big)=\sum_{i=1}^na_iL(v_i)$.`,
    body: R`
$L(0)=L(0\cdot0)=0\cdot L(0)=0$ (상수곱 조건과 $0w=0$).

$L(-v)=L\big((-1)v\big)=(-1)L(v)=-L(v)$.

일차결합은 $n$에 대한 귀납법: $n=1$이면 $L(a_1v_1)=a_1L(v_1)$. $n-1$에서 성립하면
$$L\Big(\sum_{i=1}^na_iv_i\Big)=L\Big(\sum_{i=1}^{n-1}a_iv_i\Big)+L(a_nv_n)=\sum_{i=1}^{n-1}a_iL(v_i)+a_nL(v_n).$$` },
  { ch: 'ch17', id: 'lin-ext', title: '선형확장정리', keys: ['선형확장정리'],
    tags: 'linear extension theorem basis determines linear map matrix representation 선형확장정리 기저 함숫값 결정',
    src: '강의 PPT · 슬라이드 18',
    stmt: R`$\{v_1,\dots,v_n\}$이 $V$의 기저이고 $w_1,\dots,w_n\in W$이면 $L(v_i)=w_i$인 선형사상 $L:V\to W$가 유일하게 존재한다.`,
    body: R`
**정의.** $v\in V$의 좌표 $v=\sum a_iv_i$는 유일하므로 $L(v):=\sum a_iw_i$가 잘 정의됩니다. $v=v_j$의 좌표는 $a_j=1$, 나머지 0이므로 $L(v_j)=w_j$.

**선형.** $v=\sum a_iv_i$, $u=\sum b_iv_i$이면 $v+u=\sum(a_i+b_i)v_i$이고 이것이 $v+u$의 (유일한) 좌표이므로
$$L(v+u)=\sum(a_i+b_i)w_i=L(v)+L(u),\qquad L(tv)=\sum ta_iw_i=tL(v).$$

**유일.** $M$도 선형이고 $M(v_i)=w_i$이면 $M(v)=M\big(\sum a_iv_i\big)=\sum a_iM(v_i)=\sum a_iw_i=L(v)$.`,
    note: R`$V=\mathbb F^n$, $W=\mathbb F^m$, 표준기저이면 $A=[\,L(e_1)\ \cdots\ L(e_n)\,]$로 $L=L_A$입니다. “모든 선형사상 $\mathbb F^n\to\mathbb F^m$은 행렬 곱”이라는 사실이 이 정리에서 나옵니다.` },
  { ch: 'ch17', id: 'ker-im', title: '커널과 이미지는 부분공간, 단사 ⇔ 커널이 {0}', keys: ['커널과 이미지는 부분공간'],
    tags: 'kernel image subspace injective null space range 커널 이미지 부분공간 단사',
    stmt: R`선형사상 $L:V\to W$에 대하여 $\ker L\le V$, $\operatorname{im}L\le W$이고, $L$이 단사 $\iff\ker L=\{0\}$.`,
    body: R`
**커널.** $L(0)=0$이므로 $0\in\ker L$. $L(v)=L(w)=0$이면 $L(v+w)=0$, $L(cv)=cL(v)=0$.

**이미지.** $0=L(0)\in\operatorname{im}L$. $L(v)+L(w)=L(v+w)$, $cL(v)=L(cv)$도 이미지에 있습니다.

**단사.** ($\Rightarrow$) $v\in\ker L$이면 $L(v)=0=L(0)$이므로 단사성에서 $v=0$. ($\Leftarrow$) $L(v)=L(w)$이면 $L(v-w)=0$, 즉 $v-w\in\ker L=\{0\}$이라 $v=w$.` },
  { ch: 'ch17', id: 'rank-nullity', title: '차원정리', keys: ['차원정리'],
    tags: 'rank nullity dimension theorem kernel image 차원정리 계수 퇴화차수',
    stmt: R`$V$가 유한차원이면 선형사상 $L:V\to W$에 대하여 $\dim\ker L+\dim\operatorname{im}L=\dim V$.`,
    body: R`
$\dim V=n$. $\ker L\le V$이므로 유한차원이고, 기저 $\{u_1,\dots,u_k\}$를 잡습니다.

**기저의 확장.** 이 독립 집합에 $\operatorname{span}$에 없는 벡터를 하나씩 더하면 독립성이 유지됩니다(기저의 존재 증명과 같은 논리). 독립 집합의 크기는 $n$을 넘을 수 없으므로(교환 보조정리) 이 과정은 멈추고, 멈춘 때는 $V$를 생성합니다. 그래서 $V$의 기저 $\{u_1,\dots,u_k,v_1,\dots,v_r\}$ ($k+r=n$)를 얻습니다.

**주장: $\{L(v_1),\dots,L(v_r)\}$은 $\operatorname{im}L$의 기저.**
- 생성: $v=\sum a_iu_i+\sum b_jv_j$이면 $L(v)=\sum a_iL(u_i)+\sum b_jL(v_j)=\sum b_jL(v_j)$ ($L(u_i)=0$).
- 독립: $\sum c_jL(v_j)=0$이면 $L\big(\sum c_jv_j\big)=0$이므로 $\sum c_jv_j\in\ker L$, 즉 $\sum c_jv_j=\sum d_iu_i$. 그러면 $\sum c_jv_j-\sum d_iu_i=0$이고, 전체가 $V$의 기저이므로 모든 $c_j=d_i=0$.

따라서 $\dim\operatorname{im}L=r=n-k=\dim V-\dim\ker L$.` },
  { ch: 'ch17', id: 'eig-indep', title: '서로 다른 고윳값의 고유벡터는 일차독립', keys: ['서로 다른 고윳값의 고유벡터는 일차독립'],
    tags: 'eigenvectors distinct eigenvalues linearly independent 고유벡터 서로 다른 고윳값 일차독립',
    stmt: R`$L(v_i)=\lambda_iv_i$, $v_i\ne0$이고 $\lambda_1,\dots,\lambda_k$가 서로 다르면 $\{v_1,\dots,v_k\}$는 일차독립이다.`,
    body: R`
$k$에 대한 귀납법. $k=1$이면 $v_1\ne0$이라 독립입니다. $k-1$개에서 성립한다고 하고
$$a_1v_1+\cdots+a_kv_k=0\qquad(*)$$
라 하자. $L$을 적용하면 $a_1\lambda_1v_1+\cdots+a_k\lambda_kv_k=0$. 여기서 $(*)$의 $\lambda_k$배를 빼면
$$a_1(\lambda_1-\lambda_k)v_1+\cdots+a_{k-1}(\lambda_{k-1}-\lambda_k)v_{k-1}=0.$$
귀납 가정으로 $a_i(\lambda_i-\lambda_k)=0$이고 $\lambda_i\ne\lambda_k$이므로 $a_i=0$ ($i\lt k$). 그러면 $(*)$에서 $a_kv_k=0$이고 $v_k\ne0$이라 $a_k=0$.` },
  // ───── 3절 내적
  { ch: 'ch17', id: 'conj-lin', title: '내적의 둘째 자리는 켤레 선형', keys: ['둘째 자리의 켤레 선형성'],
    tags: 'conjugate linear second argument inner product sesquilinear 켤레 선형 둘째 자리 내적',
    src: '강의 PPT · 슬라이드 26',
    stmt: R`내적공간에서 $\langle u,v+w\rangle=\langle u,v\rangle+\langle u,w\rangle$, $\langle u,cv\rangle=\bar c\langle u,v\rangle$이고, $\langle v,v\rangle\in\mathbb R$, $\langle0,v\rangle=\langle v,0\rangle=0$.`,
    body: R`
성질 3 → 1 → 3 순으로:
$$\langle u,v+w\rangle=\overline{\langle v+w,u\rangle}=\overline{\langle v,u\rangle+\langle w,u\rangle}=\overline{\langle v,u\rangle}+\overline{\langle w,u\rangle}=\langle u,v\rangle+\langle u,w\rangle.$$
성질 3 → 2 → 3 순으로:
$$\langle u,cv\rangle=\overline{\langle cv,u\rangle}=\overline{c\langle v,u\rangle}=\bar c\,\overline{\langle v,u\rangle}=\bar c\langle u,v\rangle.$$
성질 3에서 $u=v$로 두면 $\langle v,v\rangle=\overline{\langle v,v\rangle}$이므로 실수. 성질 2에서 $c=0$으로 두면 $\langle0,v\rangle=\langle0\cdot v,v\rangle=0\langle v,v\rangle=0$이고, 켤레를 취하면 $\langle v,0\rangle=0$.` },
  { ch: 'ch17', id: 'cauchy-schwarz', title: '코시-슈바르츠 부등식', keys: ['코시-슈바르츠 부등식'],
    tags: 'Cauchy Schwarz inequality inner product norm projection 코시 슈바르츠 부등식',
    stmt: R`내적공간에서 $\lvert\langle u,v\rangle\rvert\le\|u\|\,\|v\|$이고, 등호는 $u,v$가 일차종속일 때만 성립한다.`,
    body: R`
$v=0$이면 양변이 0이고 $\{u,0\}$은 종속입니다. $v\ne0$이라 하고
$$c=\frac{\langle u,v\rangle}{\|v\|^2},\qquad w=u-cv$$
로 둡니다(정사영을 뺀 나머지). $\langle w,v\rangle=\langle u,v\rangle-c\langle v,v\rangle=0$이므로 $w\perp v$, 따라서 $w\perp cv$입니다.

$u=w+cv$에 피타고라스 정리를 쓰면
$$\|u\|^2=\|w\|^2+\|cv\|^2=\|w\|^2+\lvert c\rvert^2\|v\|^2\ge\lvert c\rvert^2\|v\|^2=\frac{\lvert\langle u,v\rangle\rvert^2}{\|v\|^2}.$$
양변에 $\|v\|^2$을 곱하고 제곱근을 취하면 부등식입니다.

등호는 $\|w\|=0$, 즉 $u=cv$일 때입니다. 거꾸로 $u=cv$이면 $\lvert\langle cv,v\rangle\rvert=\lvert c\rvert\|v\|^2=\|u\|\|v\|$.` },
  { ch: 'ch17', id: 'triangle', title: '삼각부등식', keys: ['삼각부등식'],
    tags: 'triangle inequality norm inner product parallelogram 삼각부등식 노름 평행사변형',
    stmt: R`내적공간에서 $\|u+v\|\le\|u\|+\|v\|$.`,
    body: R`
$$\|u+v\|^2=\langle u+v,u+v\rangle=\|u\|^2+\langle u,v\rangle+\langle v,u\rangle+\|v\|^2=\|u\|^2+2\operatorname{Re}\langle u,v\rangle+\|v\|^2.$$
$\operatorname{Re}z\le\lvert z\rvert$와 코시-슈바르츠 부등식으로
$$\|u+v\|^2\le\|u\|^2+2\|u\|\|v\|+\|v\|^2=(\|u\|+\|v\|)^2.$$
양변이 음이 아니므로 제곱근을 취하면 됩니다.`,
    note: R`같은 전개를 $u-v$에도 하고 더하면 교차항이 상쇄되어 평행사변형 등식 $\|u+v\|^2+\|u-v\|^2=2\|u\|^2+2\|v\|^2$이 나옵니다. 내적에서 온 노름인지 판정하는 기준입니다.` },
  { ch: 'ch17', id: 'orth-indep', title: '직교집합은 일차독립', keys: ['직교집합은 일차독립'],
    tags: 'orthogonal set linearly independent nonzero 직교집합 일차독립',
    stmt: R`영벡터를 포함하지 않는 직교집합은 일차독립이다.`,
    body: R`
$S$의 유한개 원소 $v_1,\dots,v_n$에 대해 $\sum_ia_iv_i=0$이라 하자. 각 $j$에 대해 $v_j$와 내적하면
$$0=\Big\langle\sum_ia_iv_i,v_j\Big\rangle=\sum_ia_i\langle v_i,v_j\rangle=a_j\|v_j\|^2$$
(서로 다른 $i\ne j$에서 $\langle v_i,v_j\rangle=0$). $v_j\ne0$이므로 $\|v_j\|^2\gt0$이고 $a_j=0$입니다.` },
  { ch: 'ch17', id: 'pythagoras', title: '피타고라스 정리', keys: ['피타고라스 정리'],
    tags: 'Pythagorean theorem orthogonal norm squared 피타고라스 직교',
    stmt: R`$v\perp w$이면 $\|v+w\|^2=\|v\|^2+\|w\|^2$. 서로 직교하는 $v_1,\dots,v_m$에 대해 $\|\sum v_i\|^2=\sum\|v_i\|^2$.`,
    body: R`
$$\|v+w\|^2=\langle v,v\rangle+\langle v,w\rangle+\langle w,v\rangle+\langle w,w\rangle=\|v\|^2+0+0+\|w\|^2.$$
$m$개이면 $\big\|\sum_iv_i\big\|^2=\sum_{i,j}\langle v_i,v_j\rangle$에서 $i\ne j$인 항이 모두 0이라 $\sum_i\|v_i\|^2$.` },
  { ch: 'ch17', id: 'orth-expansion', title: '직교기저에 대한 전개 (계수 = 내적 ÷ 노름제곱)', keys: ['직교기저에 대한 전개'],
    tags: 'orthogonal basis expansion coefficients Fourier coefficients 직교기저 전개 계수 푸리에 계수',
    stmt: R`$\{v_1,\dots,v_n\}$이 직교기저이면 $v=\sum_i\frac{\langle v,v_i\rangle}{\|v_i\|^2}v_i$.`,
    body: R`
기저이므로 $v=\sum_ic_iv_i$로 쓸 수 있습니다. $v_j$와 내적하면 직교성으로 $\langle v,v_j\rangle=c_j\|v_j\|^2$, 즉 $c_j=\frac{\langle v,v_j\rangle}{\|v_j\|^2}$. 정규직교기저이면 $\|v_j\|=1$이라 $c_j=\langle v,v_j\rangle$.` },
  { ch: 'ch17', id: 'projection', title: '정사영의 나머지는 직교한다', keys: ['정사영'],
    tags: 'orthogonal projection onto a vector residual orthogonal closest point line 정사영 직교 가장 가까운',
    src: '강의 PPT · 슬라이드 35 (확인하시오)',
    stmt: R`$v\ne0$이면 $u-\frac{\langle u,v\rangle}{\|v\|^2}v$는 $v$와 직교하고, 정사영 $p=\frac{\langle u,v\rangle}{\|v\|^2}v$는 직선 $\{tv\}$ 위에서 $u$에 가장 가까운 점이다.`,
    body: R`
**직교.** 첫 자리의 선형성으로
$$\Big\langle u-\frac{\langle u,v\rangle}{\|v\|^2}v,\ v\Big\rangle=\langle u,v\rangle-\frac{\langle u,v\rangle}{\|v\|^2}\langle v,v\rangle=0.$$

**가장 가까움.** 직선 위의 임의의 점 $tv$에 대해 $u-tv=(u-p)+(p-tv)$이고 $u-p\perp v$, $p-tv$는 $v$의 상수배이므로 피타고라스 정리로
$$\|u-tv\|^2=\|u-p\|^2+\|p-tv\|^2\ge\|u-p\|^2,$$
등호는 $tv=p$일 때뿐입니다.` },
  { ch: 'ch17', id: 'best-approx', title: '최선 근사 정리', keys: ['최선 근사 정리', '근사 오차'],
    tags: 'best approximation theorem orthogonal projection subspace least squares error 최선 근사 정사영 부분공간 최소제곱',
    src: '강의 PPT · 슬라이드 37',
    stmt: R`$W$가 유한차원 부분공간이고 $\{v_1,\dots,v_m\}$이 $W$의 정규직교기저일 때 $w=\sum_{i=1}^m\langle v,v_i\rangle v_i$이면 $v-w\perp W$이고, $w$는 $v$에 가장 가까운 $W$의 유일한 벡터이다. 또 $\|v-w\|^2=\|v\|^2-\sum_i\lvert\langle v,v_i\rangle\rvert^2$.`,
    body: R`
**(1) $v-w\perp W$.** 정규직교성 $\langle v_i,v_j\rangle=\delta_{ij}$로
$$\langle v-w,v_j\rangle=\langle v,v_j\rangle-\sum_i\langle v,v_i\rangle\langle v_i,v_j\rangle=\langle v,v_j\rangle-\langle v,v_j\rangle=0.$$
$v-w$가 기저의 모든 원소와 직교하므로 그 일차결합인 $W$의 모든 원소와 직교합니다(둘째 자리의 켤레 선형성).

**(2) 가장 가깝고 유일.** $u\in W$이면 $w-u\in W$이므로 $(v-w)\perp(w-u)$. 피타고라스 정리로
$$\|v-u\|^2=\|(v-w)+(w-u)\|^2=\|v-w\|^2+\|w-u\|^2\ge\|v-w\|^2.$$
등호는 $\|w-u\|=0$, 즉 $u=w$일 때뿐입니다.

**(3) 오차.** $v=w+(v-w)$이고 $w\perp v-w$이므로 $\|v\|^2=\|w\|^2+\|v-w\|^2$. 또 서로 직교하는 $\langle v,v_i\rangle v_i$들의 피타고라스로 $\|w\|^2=\sum_i\lvert\langle v,v_i\rangle\rvert^2$. 따라서 $\|v-w\|^2=\|v\|^2-\sum_i\lvert\langle v,v_i\rangle\rvert^2$.`,
    note: R`직교기저(정규화 안 함)이면 $v_i$ 대신 $\frac{v_i}{\|v_i\|}$에 적용해 $w=\sum\frac{\langle v,v_i\rangle}{\|v_i\|^2}v_i$를 얻습니다. 기저가 직교가 아니면 조건 (1) $\langle v-w,v_j\rangle=0$을 연립방정식(정규방정식)으로 풀면 됩니다. 강의의 $\sin x$의 5차 근사가 그 예입니다.` },
  { ch: 'ch17', id: 'fourier-best', title: '삼각다항식 최선 근사는 푸리에 부분합이다', keys: ['삼각다항식 최선 근사 = 푸리에 부분합'],
    tags: 'Fourier partial sum best approximation trigonometric polynomial Euler formulas minimum square error 푸리에 부분합 최선 근사 오일러 공식 최소 제곱 오차',
    src: '강의 PPT · 슬라이드 41 (과제)',
    stmt: R`$[-\pi,\pi]$의 정적분 내적에서 $W=\operatorname{span}\{1,\cos x,\sin x,\dots,\cos Nx,\sin Nx\}$에 대한 $f$의 정사영은 푸리에 부분합 $a_0+\sum_{n=1}^N(a_n\cos nx+b_n\sin nx)$이고, 오차는 $\int_{-\pi}^{\pi}f^2dx-\pi\big(2a_0^2+\sum_{n=1}^N(a_n^2+b_n^2)\big)$이다.`,
    body: R`
$\{1,\cos nx,\sin nx\}_{n\le N}$은 직교기저이고(곱을 합으로 바꾸는 공식) 노름제곱은 $\|1\|^2=2\pi$, $\|\cos nx\|^2=\|\sin nx\|^2=\pi$입니다. 최선 근사 정리(직교기저 판)에서 정사영의 계수는
$$\frac{\langle f,1\rangle}{2\pi}=\frac1{2\pi}\int_{-\pi}^{\pi}f\,dx=a_0,\qquad\frac{\langle f,\cos nx\rangle}{\pi}=a_n,\qquad\frac{\langle f,\sin nx\rangle}{\pi}=b_n$$
로 오일러 공식 그대로입니다.

오차: $\|f-w\|^2=\|f\|^2-\sum\frac{\lvert\langle f,v_i\rangle\rvert^2}{\|v_i\|^2}$에 $\langle f,1\rangle=2\pi a_0$, $\langle f,\cos nx\rangle=\pi a_n$, $\langle f,\sin nx\rangle=\pi b_n$을 넣으면
$$\|f-w\|^2=\int_{-\pi}^{\pi}f^2dx-\Big(\frac{(2\pi a_0)^2}{2\pi}+\sum_{n=1}^N\frac{(\pi a_n)^2+(\pi b_n)^2}{\pi}\Big)=\int_{-\pi}^{\pi}f^2dx-\pi\Big(2a_0^2+\sum_{n=1}^N(a_n^2+b_n^2)\Big).$$` },
  { ch: 'ch17', id: 'bessel', title: '베셀 부등식', keys: ['베셀 부등식'],
    tags: 'Bessel inequality orthonormal set Fourier coefficients tend to zero 베셀 부등식 정규직교',
    src: '강의 PPT · 슬라이드 42 (Why?)',
    stmt: R`정규직교집합 $\{v_1,\dots,v_m\}$과 $v$에 대하여 $\sum_{i=1}^m\lvert\langle v,v_i\rangle\rvert^2\le\|v\|^2$. 무한 정규직교집합 $\{v_i\}_{i\ge1}$이면 $\sum_{i=1}^\infty\lvert\langle v,v_i\rangle\rvert^2\le\|v\|^2$이고 $\langle v,v_i\rangle\to0$.`,
    body: R`
**유한.** $W=\operatorname{span}\{v_1,\dots,v_m\}$ (유한차원)에 최선 근사 정리의 오차 공식을 쓰면
$$0\le\|v-w\|^2=\|v\|^2-\sum_{i=1}^m\lvert\langle v,v_i\rangle\rvert^2.$$
(강의의 “Why? → 앞의 정리”가 이것입니다.)

**무한.** 각 $m$에 대해 부분합 $\sum_{i=1}^m\lvert\langle v,v_i\rangle\rvert^2\le\|v\|^2$이고 항이 음이 아니므로, 부분합은 증가하고 위로 유계입니다. 따라서 급수는 수렴하고 합은 $\|v\|^2$ 이하. 수렴하는 급수의 항은 0으로 가므로 $\langle v,v_i\rangle\to0$.`,
    note: R`푸리에 급수에 적용하면 $2a_0^2+\sum(a_n^2+b_n^2)\le\frac1\pi\int_{-\pi}^{\pi}f^2dx$이고, 특히 $a_n,b_n\to0$ (리만-르베그 보조정리의 제곱적분 판)입니다.` },
  { ch: 'ch17', id: 'parseval', title: '파세발 항등식', keys: ['파세발 항등식'],
    tags: 'Parseval identity Hilbert space complete orthonormal basis Fourier series 파세발 항등식 힐베르트 공간 완비 정규직교기저',
    src: '강의 PPT · 슬라이드 44',
    stmt: R`힐베르트 공간 $V$의 정규직교기저 $\{v_1,v_2,\dots\}$ (모든 $v$가 $v=\sum_{i=1}^\infty\langle v,v_i\rangle v_i$로 노름 수렴하는 완비 정규직교계)에 대하여 $\|v\|^2=\sum_{i=1}^\infty\lvert\langle v,v_i\rangle\rvert^2$.`,
    body: R`
부분합 $w_m=\sum_{i=1}^m\langle v,v_i\rangle v_i$는 $W_m=\operatorname{span}\{v_1,\dots,v_m\}$에 대한 정사영이므로, 최선 근사 정리의 오차 공식에서
$$\|v-w_m\|^2=\|v\|^2-\sum_{i=1}^m\lvert\langle v,v_i\rangle\rvert^2.$$
정규직교기저라는 가정은 $w_m\to v$, 즉 $\|v-w_m\|\to0$을 뜻합니다. $m\to\infty$로 보내면 왼쪽이 0으로 가므로
$$\|v\|^2=\lim_{m\to\infty}\sum_{i=1}^m\lvert\langle v,v_i\rangle\rvert^2=\sum_{i=1}^\infty\lvert\langle v,v_i\rangle\rvert^2.$$`,
    note: R`완비성(힐베르트 공간)은 베셀 부등식으로 수렴이 보장된 급수 $\sum\langle v,v_i\rangle v_i$가 공간 **안에** 극한을 갖게 해 줍니다. 부분합들이 코시 수열이기 때문입니다: $\|w_m-w_k\|^2=\sum_{i=k+1}^m\lvert\langle v,v_i\rangle\rvert^2\to0$. 삼각함수계 $\{\frac1{\sqrt{2\pi}},\frac{\cos nx}{\sqrt\pi},\frac{\sin nx}{\sqrt\pi}\}$가 $L^2[-\pi,\pi]$의 정규직교기저라는 사실(완비성)은 더 깊은 정리이고, 그것을 인정하면 $\frac1\pi\int_{-\pi}^{\pi}f^2dx=2a_0^2+\sum(a_n^2+b_n^2)$이 됩니다.` },
  );
})();
