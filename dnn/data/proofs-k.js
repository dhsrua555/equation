/* 증명 — 17단원: 8주차 수요일(10/21) 필기의 보편 근사 정리(Cybenko 1989).
   보조정리 4·5와 Cybenko 정리는 강의 필기, 보조정리 1·3과 나머지는 수업에서 생략하거나 결과만 쓴 것을 증명한 것입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  { ch: 'ch17', id: 'errsplit', title: '오차 분해와 각 항의 부호', keys: ['오차 분해'],
    tags: 'error decomposition approximation estimation generalization optimization excess risk 오차 분해 근사 일반화 최적화 초과 위험',
    stmt: R`$f^*$가 모든 함수 가운데, $f_{\mathcal F}$가 $\mathcal F$ 안에서 위험 $\mathcal R$이 최소이고 $\hat f_n,f_{\mathrm{alg}}\in\mathcal F$이면
$$\mathcal R(f_{\mathrm{alg}})-\mathcal R(f^*)=\big[\mathcal R(f_{\mathrm{alg}})-\mathcal R(\hat f_n)\big]+\big[\mathcal R(\hat f_n)-\mathcal R(f_{\mathcal F})\big]+\big[\mathcal R(f_{\mathcal F})-\mathcal R(f^*)\big]$$
이고, 둘째(일반화)와 셋째(근사) 항은 $0$ 이상이다.`,
    body: R`
**항등식.** 우변에서 $\mathcal R(\hat f_n)$과 $\mathcal R(f_{\mathcal F})$가 한 번은 더해지고 한 번은 빠지므로(망원합) 좌변만 남습니다.

**근사 항.** $f^*$는 모든 함수 가운데 위험이 최소이고 $f_{\mathcal F}$도 그 함수 가운데 하나이므로 $\mathcal R(f_{\mathcal F})\ge\mathcal R(f^*)$.

**일반화 항.** $f_{\mathcal F}$는 $\mathcal F$ 안에서 위험이 최소이고 $\hat f_n\in\mathcal F$이므로 $\mathcal R(\hat f_n)\ge\mathcal R(f_{\mathcal F})$.

**최적화 항.** $\hat f_n$이 최소로 하는 것은 경험적 위험 $\widehat{\mathcal R}_n$이지 $\mathcal R$이 아니므로 $\mathcal R(f_{\mathrm{alg}})$과 $\mathcal R(\hat f_n)$의 크기 관계는 정해지지 않습니다.`,
    note: R`최소점이 존재하지 않으면 $f_{\mathcal F}$, $f^*$ 대신 하한(inf)을 쓰면 같은 결론이 나옵니다.` },
  { ch: 'ch17', id: 'closure', title: '부분공간의 닫힘과 조밀성', keys: ['최대 노름과 조밀성'],
    tags: 'closure dense subspace limit sequence normed space 닫힘 조밀 부분공간 수열 극한',
    stmt: R`노름 공간 $X$의 선형 부분공간 $U$에 대해 닫힘 $\overline U$($U$의 수열의 극한 전체)는 선형 부분공간이고, $U$가 조밀하다는 것은 $\overline U=X$와 같다.`,
    body: R`
**부분공간.** $f,g\in\overline U$, $a,b\in\mathbb R$이면 $u_k\to f$, $v_k\to g$인 $u_k,v_k\in U$가 있습니다. $U$가 부분공간이므로 $au_k+bv_k\in U$이고, 삼각부등식과 노름의 동차성으로
$$\lVert(au_k+bv_k)-(af+bg)\rVert\le\lvert a\rvert\lVert u_k-f\rVert+\lvert b\rvert\lVert v_k-g\rVert\to0.$$
따라서 $af+bg\in\overline U$이고, $0\in U\subseteq\overline U$입니다.

**조밀 ⇒ $\overline U=X$.** $f\in X$에 대해 $\varepsilon=\frac1k$마다 $\lVert f-u_k\rVert<\frac1k$인 $u_k\in U$를 고르면 $u_k\to f$, 곧 $f\in\overline U$.

**$\overline U=X$ ⇒ 조밀.** $f\in X=\overline U$이면 $u_k\to f$인 $u_k\in U$가 있어, 주어진 $\varepsilon$에 대해 충분히 큰 $k$에서 $\lVert f-u_k\rVert<\varepsilon$.`,
    note: R`같은 논리로, 유계 선형 범함수 $L$이 $U$에서 $0$이면 $L(f)=\lim L(u_k)=0$이므로 $\overline U$에서도 $0$입니다. 그래서 조밀한 부분공간은 0이 아닌 $L$로 “소멸”시킬 수 없습니다.` },
  { ch: 'ch17', id: 'lemma1', title: '보조정리 1: 연속 시그모이드는 판별 함수다', keys: ['시그모이드와 판별 함수'],
    tags: 'discriminatory sigmoid Cybenko lemma 1 half-space Fourier transform bounded convergence 판별 함수 시그모이드 반공간 푸리에 변환 유계 수렴',
    stmt: R`$\sigma:\mathbb R\to\mathbb R$이 연속이고 $\sigma(t)\to0$ ($t\to-\infty$), $\sigma(t)\to1$ ($t\to\infty$)이라 하자. $\mu\in M(I_n)$가 모든 $w\in\mathbb R^n$, $\theta\in\mathbb R$에 대해 $\int_{I_n}\sigma(w^Tx+\theta)\,d\mu(x)=0$이면 $\mu=0$이다.`,
    body: R`
**준비.** $\sigma$는 연속이고 양 끝에서 유한한 극한을 가지므로 유계입니다: $\lvert t\rvert>T$에서 극한과 $1$ 이내이고, $[-T,T]$에서는 연속 함수라 최댓값이 있습니다. $\lvert\sigma\rvert\le M$이라 합니다. 부호 측도는 $\mu=\mu^+-\mu^-$ (두 유한 측도)로 쓰고, 극한과 적분의 교환은 각각에 유계 수렴 정리를 써서 합니다.

**1단계: 가파른 뉴런의 극한.** $w,\theta,\varphi$를 고정하고 $\sigma_\lambda(x)=\sigma\big(\lambda(w^Tx+\theta)+\varphi\big)$라 두면, 이것도 뉴런 $\sigma(w'^Tx+\theta')$ ($w'=\lambda w$, $\theta'=\lambda\theta+\varphi$)이므로 가정에 의해 $\int\sigma_\lambda\,d\mu=0$입니다. $\lambda\to\infty$이면 점마다
$$\sigma_\lambda(x)\to\gamma(x)=\begin{cases}1&w^Tx+\theta>0\\0&w^Tx+\theta<0\\\sigma(\varphi)&w^Tx+\theta=0\end{cases}$$
이고 $\lvert\sigma_\lambda\rvert\le M$이므로 유계 수렴 정리로 $0=\int\sigma_\lambda\,d\mu\to\int\gamma\,d\mu$. 반공간 $H^+=\{w^Tx+\theta>0\}$과 초평면 $\Pi=\{w^Tx+\theta=0\}$ (모두 $I_n$과의 교집합)에 대해
$$\mu(H^+)+\sigma(\varphi)\,\mu(\Pi)=0\qquad\forall\varphi\in\mathbb R.$$

**2단계: 반공간과 초평면의 측도가 0.** $\varphi\to-\infty$이면 $\sigma(\varphi)\to0$이므로 $\mu(H^+)=0$, $\varphi\to\infty$이면 $\mu(H^+)+\mu(\Pi)=0$이므로 $\mu(\Pi)=0$. $w,\theta$가 임의이므로 모든 열린 반공간과 초평면의 측도가 $0$이고, 둘을 합친 닫힌 반공간도 마찬가지입니다.

**3단계: 한 방향의 범함수.** 방향 $w$를 고정하고, 유계 보렐 함수 $h:\mathbb R\to\mathbb R$에 대해 $F(h)=\int_{I_n}h(w^Tx)\,d\mu(x)$라 둡니다. $F$는 선형이고 $\lvert F(h)\rvert\le\sup_{t\in J}\lvert h(t)\rvert\cdot\lvert\mu\rvert(I_n)$인데, $x\in I_n$이면 $w^Tx\in J=[-\lVert w\rVert_1,\lVert w\rVert_1]$이므로 $J$ 위의 값만 중요합니다. $h=\mathbf 1_{[c,\infty)}$이면 $F(h)=\mu(\{w^Tx\ge c\})=0$ (2단계의 닫힌 반공간)이므로 $\mathbf 1_{[a,b)}=\mathbf 1_{[a,\infty)}-\mathbf 1_{[b,\infty)}$와 그 선형결합인 모든 계단 함수 $s$에서 $F(s)=0$입니다. $\cos$은 컴팩트 구간 $J$에서 균등연속이므로 $\sup_J\lvert\cos-s_k\rvert\to0$인 계단 함수 $s_k$가 있고, $\lvert F(\cos)\rvert=\lvert F(\cos-s_k)\rvert\le\sup_J\lvert\cos-s_k\rvert\,\lvert\mu\rvert(I_n)\to0$. 같은 방법으로 $F(\sin)=0$입니다.

**4단계: 푸리에 변환.** 따라서 모든 $w\in\mathbb R^n$에서
$$\hat\mu(w)=\int_{I_n}e^{-iw^Tx}\,d\mu(x)=F(\cos)-iF(\sin)=0.$$
유한 부호 측도는 푸리에 변환으로 유일하게 정해지므로(푸리에-스틸체스 변환의 유일성) $\mu=0$입니다. ∎`,
    note: R`이 증명은 연속성을 1단계의 유계성에만 쓰므로 유계이고 측정가능한 시그모이드(예: 계단 함수)에서도 그대로 성립합니다. 다만 그때는 $G$가 연속이 아니라 Cybenko 정리의 결론이 $C(I_n)$이 아닌 $L^1$ 근사로 바뀝니다. 수업에서는 증명을 생략했습니다.` },
  { ch: 'ch17', id: 'lemma3', title: '보조정리 3: 조밀하지 않은 부분공간을 소멸시키는 범함수', keys: ['보조정리 3·4'],
    tags: 'Hahn-Banach corollary bounded linear functional distance closure non-dense 한-바나흐 따름정리 유계 선형 범함수 거리 닫힘',
    stmt: R`노름 공간 $X$의 선형 부분공간 $U$가 조밀하지 않으면($\overline U\ne X$), $L|_U=0$이고 $L\ne0$인 유계 선형 범함수 $L:X\to\mathbb R$이 있다. (한-바나흐 확장 정리를 사실로 쓴다: 부분공간 $V$ 위의 선형 범함수 $L_0$이 $\lvert L_0(v)\rvert\le C\lVert v\rVert$이면, 같은 한계를 지키는 $X$ 전체의 선형 확장이 있다.)`,
    body: R`
**점 고르기.** $\overline U\ne X$이므로 $f_0\in X\setminus\overline U$를 고릅니다. $d=\inf_{u\in\overline U}\lVert f_0-u\rVert$라 두면 $d>0$입니다. $d=0$이라면 $\lVert f_0-u_k\rVert\to0$인 $u_k\in\overline U$가 있어 $f_0$이 $\overline U$의 원소의 극한, 곧 $f_0\in\overline U$(닫힘은 닫혀 있음)가 되어 모순입니다.

**작은 공간에서 정의.** $V=\{u+tf_0:\ u\in\overline U,\ t\in\mathbb R\}$ 위에 $L_0(u+tf_0)=td$로 둡니다. 표현이 유일하므로 잘 정의됩니다: $u+tf_0=u'+t'f_0$이고 $t\ne t'$이면 $f_0=\frac{u'-u}{t-t'}\in\overline U$ (부분공간)이 되어 모순이므로 $t=t'$, $u=u'$입니다. $L_0$은 선형이고, $\overline U$에서 $0$, $L_0(f_0)=d\ne0$입니다.

**유계성.** $t\ne0$이면 $-u/t\in\overline U$이므로
$$\lVert u+tf_0\rVert=\lvert t\rvert\,\Big\lVert f_0-\Big(-\frac ut\Big)\Big\rVert\ge\lvert t\rvert d=\lvert L_0(u+tf_0)\rvert,$$
$t=0$이면 $L_0=0$이므로 자명합니다. 곧 $\lvert L_0(v)\rvert\le\lVert v\rVert$ ($v\in V$).

**확장.** 한-바나흐 정리로 $\lvert L(f)\rvert\le\lVert f\rVert$인 $X$ 위의 선형 확장 $L$을 얻습니다. $L$은 유계이고 $L|_U=0$ ($U\subseteq\overline U$), $L(f_0)=d\ne0$이므로 $L\ne0$입니다. ∎`,
    note: R`$U$가 조밀하면 이런 $L$은 없습니다: 유계 $L$이 $U$에서 $0$이면 연속성으로 $\overline U=X$ 전체에서 $0$입니다. 수업에서는 증명을 생략했습니다.` },
  { ch: 'ch17', id: 'lemma4', title: '보조정리 4: 리스 표현으로 얻는 소멸 측도', keys: ['보조정리 3·4'], src: '강의 필기 · W8 수',
    tags: 'Riesz representation theorem measure annihilate non-dense subspace lemma 4 리스 표현 정리 측도 조밀하지 않은 부분공간',
    stmt: R`$U$가 $C(I_n)$의 조밀하지 않은 선형 부분공간이면 $\mu\ne0$인 $\mu\in M(I_n)$가 있어 $\int_{I_n}h\,d\mu=0$ ($\forall h\in U$)이다.`,
    body: R`
**1단계: 범함수.** $X=C(I_n)$ (최대 노름)은 노름 공간이고 $U$는 그 안의 조밀하지 않은 선형 부분공간이므로, 보조정리 3에 의해 유계 선형 범함수 $L:C(I_n)\to\mathbb R$이 있어 $L\ne0$이고 $L|_U=0$입니다.

**2단계: 측도로 바꾸기.** $I_n=[0,1]^n$은 $\mathbb R^n$의 컴팩트 집합이고 $L$은 $C(I_n)$ 위의 유계 선형 범함수이므로, 리스 표현 정리에 의해 유한 부호 측도 $\mu\in M(I_n)$가 있어
$$L(f)=\int_{I_n}f\,d\mu\qquad\forall f\in C(I_n).$$

**3단계: $U$에서 0.** $h\in U$이면 $\int_{I_n}h\,d\mu=L(h)=0$.

**4단계: $\mu\ne0$.** $L\ne0$이므로 $L(f_0)\ne0$인 $f_0\in C(I_n)$이 있습니다. $\mu=0$이라면 $\int f_0\,d\mu=0$이어야 하는데 이 값은 $L(f_0)\ne0$이므로 $\mu\ne0$입니다. ∎`,
    note: R`필기의 진술에는 $\mu\ne0$이 빠져 있고, 마지막 줄의 $L(f)$는 $L(h)$입니다. $\mu\ne0$이 없으면 $\mu=0$이 언제나 결론을 만족하므로 보조정리가 쓸모없어집니다.` },
  { ch: 'ch17', id: 'cybenko', title: '보편 근사 정리 (Cybenko 1989)', keys: ['보편 근사 정리 (Cybenko 1989)'], src: '강의 필기 · W8 수',
    tags: 'universal approximation theorem UAT Cybenko lemma 5 dense one hidden layer sigmoid contradiction 보편 근사 정리 조밀 은닉층 귀류법',
    stmt: R`$\sigma$가 연속 시그모이드이면 $G(x)=\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)$ ($N\in\mathbb N$, $w_j\in\mathbb R^n$, $\alpha_j,\theta_j\in\mathbb R$) 꼴의 함수들은 $C(I_n)$에서 조밀하다. 곧 모든 $f\in C(I_n)$와 $\varepsilon>0$에 대해 $\lvert f(x)-G(x)\rvert<\varepsilon$ ($\forall x\in I_n$)인 $G$가 있다.`,
    body: R`
**보조정리 5부터.** $\sigma$가 연속이고 판별적이면 결론이 성립함을 보입니다. 연속 시그모이드는 보조정리 1에 의해 판별적이므로 이것으로 정리가 증명됩니다.

**부분공간.** $U$를 위 꼴의 유한합 전체라 합니다. 두 원소의 합은 뉴런을 이어 붙인 유한합이고, 실수배는 $\alpha_j$를 바꾼 유한합이며, $\alpha_1=0$이면 영함수입니다. $\sigma$가 연속이므로 각 $G$는 연속 함수의 합성과 합으로 연속이고, 따라서 $U$는 $C(I_n)$의 선형 부분공간입니다.

**귀류 가정.** $U$가 $C(I_n)$에서 조밀하지 않다, 곧 $\overline U\ne C(I_n)$이라 가정합니다.

**보조정리 4.** $\mu\ne0$인 $\mu\in M(I_n)$가 있어 모든 $h\in U$에 대해 $\int_{I_n}h\,d\mu=0$, 곧
$$\sum_{j=1}^N\alpha_j\int_{I_n}\sigma(w_j^Tx+\theta_j)\,d\mu(x)=0\qquad\forall N,\ w_j,\ \alpha_j,\ \theta_j.$$

**뉴런 하나로.** $N=1$, $\alpha_1=1$로 두면 $\int_{I_n}\sigma(w^Tx+\theta)\,d\mu(x)=0$ ($\forall w\in\mathbb R^n$, $\theta\in\mathbb R$).

**모순.** $\sigma$가 판별적이므로 $\mu=0$. 이는 $\mu\ne0$과 모순이므로 $\overline U=C(I_n)$, 곧 $U$는 조밀합니다. 조밀성의 정의를 풀어 쓰면 결론의 $\varepsilon$ 부등식입니다. ∎`,
    note: R`부정하는 것은 “$U\ne C(I_n)$”이 아니라 “$\overline U\ne C(I_n)$”입니다. 정리는 $N$의 크기, 가중치를 찾는 방법, 일반화에 대해 아무것도 말하지 않습니다. 같은 증명이 $I_n$ 대신 임의의 컴팩트 $K\subset\mathbb R^n$에서도 성립합니다.` },
  );
})();
