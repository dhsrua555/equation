/* 10 규제와 안정성 — UML 13장, 강의 노트 “Derivation of the Ridge Regression Solution” (13.1.1), “Proof of Theorem 13.2”, “Proof of Corollary 13.7”, “Variant of Corollary 13.11”, “Strong Convexity with Respect to General Norms” (Exercise 13.4) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 10, part: 'B', title: '규제와 안정성', en: 'Regularization and Stability', ref: 'UML 13장', plot: 'ridge',
    fig: R`릿지 규제의 경로: 규제 세기 λ를 키우면(오른쪽) 계수들이 서로 다른 속도로 0을 향해 줄어듭니다`,
    tagline: R`표본 하나를 바꿔도 출력이 거의 변하지 않는 알고리즘은 과적합하지 않습니다. 강볼록한 규제항이 그 안정성을 만들어 줍니다.`,
    summary: R`**규제 손실 최소화**(RLM) $A(S)=\argmin_w\,[L_S(w)+\lambda\lVert w\rVert^2]$를 분석합니다. 먼저 제곱 손실에서는 **릿지 회귀**가 되고, 규제 덕분에 $(2\lambda mI+A)w=b$의 해가 언제나 유일합니다. 일반화의 열쇠는 **안정성**입니다: 기대 일반화 간격 $\E[L_\cD(A(S))-L_S(A(S))]$는 “훈련 예제 하나를 새 예제로 바꿨을 때 그 점에서의 손실 변화”의 기댓값과 **정확히 같습니다**(정리 13.2). 규제항 $\lambda\lVert w\rVert^2$는 $2\lambda$-**강볼록**이라 목적함수의 최소점이 표본 하나에 크게 흔들리지 않고, 손실이 $\rho$-립시츠이면 안정성 $2\rho^2/(\lambda m)$, 음이 아닌 $\beta$-매끄러움이면 $\frac{48\beta}{\lambda m}\E[L_S]$를 얻습니다. 적합과 안정성의 균형 $\lambda\lVert w^\star\rVert^2+\frac{2\rho^2}{\lambda m}$을 최적화하면 볼록-립시츠-유계 문제가 $m\ge8\rho^2B^2/\varepsilon^2$에서 학습가능합니다. 강의 노트는 매끄러운 경우의 상수를 바로잡고(288), 일반 노름으로 확장합니다.`,
    goals: [
      R`릿지 회귀의 정규방정식 $(2\lambda mI+A)w=b$를 유도하고 해가 유일한 이유를 설명할 수 있다`,
      R`한 점 바꾸기로 기대 일반화 간격을 나타내는 정리 13.2를 대칭성 논법으로 증명할 수 있다`,
      R`강볼록성의 성질(합, 최소점 근처의 이차 증가)을 쓰고 RLM의 안정성 부등식을 유도할 수 있다`,
      R`립시츠 손실에서 안정성 $2\rho^2/(\lambda m)$과 오라클 부등식, 표본 복잡도 $8\rho^2B^2/\varepsilon^2$을 유도할 수 있다`,
      R`매끄럽고 음이 아닌 손실에서 자기 유계성으로 안정성을 누르고, 상수를 확인할 수 있다`,
    ],
    secTitles: { '13.1': 'RLM', '13.1b': '릿지 회귀', '13.2': '안정성과 과적합', '13.3': '강볼록성', '13.3b': '립시츠 손실', '13.3c': '매끄러운 손실', '13.4': '균형', '13.4b': '일반 노름' },
    sections: [
      { k: '13.1', p: 171, title: '규제 손실 최소화', body: R`
:::def 규제 손실 최소화 (RLM)
규제 함수 $R:\mathbb R^d\to\mathbb R$에 대해
$$A(S)\in\argmin_w\big(L_S(w)+R(w)\big).$$
이 과목에서는 주로 **티호노프 규제** $R(w)=\lambda\lVert w\rVert^2$ ($\lambda>0$)를 씁니다.
:::

해석은 두 가지입니다.
- **SRM의 연속판**: $\cH_1\subset\cH_2\subset\dots$, $\cH_i=\{w:\lVert w\rVert^2\le i\}$로 보면 $\lambda\lVert w\rVert^2$은 “복잡한 클래스일수록 큰 벌점”입니다.
- **안정화 장치**: 이 장의 주제. 규제항이 목적함수를 강볼록하게 만들어, 표본이 조금 바뀌어도 해가 조금만 움직이게 합니다.

:::note 용어
regularization은 “규제”, normalization(배치 정규화 등)은 “정규화”로 구분해 씁니다. 의료 인공지능 과목의 가중치 감쇠가 같은 티호노프 규제입니다[[@med:ch11:9.2|가중치 감쇠 $\frac\lambda2\lVert w\rVert^2$.]].
:::
` },
      { k: '13.1b', p: 172, src: '강의 노트 · 13.1.1', title: '릿지 회귀', body: R`
제곱 손실의 RLM:
$$J(w)=\lambda\lVert w\rVert^2+\frac1m\sum_{i=1}^m\tfrac12\big(\langle w,x_i\rangle-y_i\big)^2,\qquad A=\sum_ix_ix_i^\top,\quad b=\sum_iy_ix_i.$$

:::key 릿지 회귀의 닫힌 해
$w$가 $J$의 최소점 $\iff(2\lambda mI+A)w=b$. 행렬 $2\lambda mI+A$는 대칭 양의 정부호라 가역이고, 최소점은 유일하게
$$w=(2\lambda mI+A)^{-1}b.$$
:::

:::hand 강의 노트 — 계산
$\nabla\lambda\lVert w\rVert^2=2\lambda w$, $\nabla\tfrac12(x_i^\top w-y_i)^2=(x_i^\top w-y_i)x_i$이고 $\sum_i(x_i^\top w-y_i)x_i=Aw-b$. 따라서
$$\nabla J(w)=2\lambda w+\tfrac1m(Aw-b)=0\iff(2\lambda mI+A)w=b.$$
$A$는 $v^\top Av=\sum(x_i^\top v)^2\ge0$이라 양의 준정부호, 여기에 $2\lambda mI$($\lambda>0$)를 더하면 $v\ne0$에서 $v^\top(\cdot)v\ge2\lambda m\lVert v\rVert^2>0$. 헤시안 $2\lambda I+\frac1mA\succ0$이라 $J$는 강볼록이고, 기울기가 0인 점이 유일한 전역 최소점입니다.
:::

:::tip 9단원과 비교
규제 없는 최소제곱은 $A$가 특이하면 해가 무수히 많아 유사역행렬로 최소 노름 해를 골라야 했습니다. 릿지에서는 $\lambda>0$ 하나로 $A$가 특이해도($m<d$라도) 해가 유일합니다. $\lambda\to0^+$이면 릿지 해는 바로 그 최소 노름 해 $A^+b$로 수렴합니다.
:::
` },
      { k: '13.2', p: 173, src: '강의 노트 · Theorem 13.2', title: '안정한 규칙은 과적합하지 않는다', body: R`
$S=(z_1,\dots,z_m)$과 새 예제 $z'$에서 **한 점 바꾸기** 표본 $S^{(i)}=(z_1,\dots,z_{i-1},z',z_{i+1},\dots,z_m)$을 만듭니다.

:::key 안정성 = 일반화 간격
$S\sim\cD^m$, $z'\sim\cD$ 독립, $i\sim U[m]$이면 모든 학습기 $A$에 대해
$$\E_S\big[L_\cD(A(S))-L_S(A(S))\big]=\E_{(S,z')\sim\cD^{m+1},\,i\sim U(m)}\big[\ell(A(S^{(i)}),z_i)-\ell(A(S),z_i)\big].$$
:::

:::hand 강의 노트 — 두 변수를 바꿔치기
**참 위험 쪽.** $\E_S[L_\cD(A(S))]=\E_{S,z'}[\ell(A(S),z')]$. 튜플 $(z_1,..,z_i,..,z_m,z')$와 $(z_1,..,z',..,z_m,z_i)$는 i.i.d. 변수 두 개의 자리만 바꾼 것이라 **분포가 같습니다**. 앞 튜플에서 $\ell(A(S),z')$는 뒤 튜플에서 $\ell(A(S^{(i)}),z_i)$에 해당하므로 $\E[\ell(A(S),z')]=\E[\ell(A(S^{(i)}),z_i)]$ (모든 $i$). $i$에 대해 평균해도 같습니다.

**경험적 위험 쪽.** $\E_S[L_S(A(S))]=\frac1m\sum_i\E[\ell(A(S),z_i)]=\E_{S,i}[\ell(A(S),z_i)]$, $z'$를 끼워 넣어도 값은 그대로.

두 식을 빼면 정리가 됩니다.
:::

$\ell(A(S^{(i)}),z_i)$는 $z_i$를 **보지 않은** 모델의 $z_i$ 위 손실이고 $\ell(A(S),z_i)$는 **본** 모델의 손실입니다. 그 차이가 작으면 — 즉 알고리즘이 한 점에 민감하지 않으면 — 과적합하지 않습니다.

:::def 평균 한 점 바꾸기 안정성
$\epsilon:\mathbb N\to\mathbb R$이 단조감소일 때, 모든 $\cD$에서
$$\E_{(S,z')\sim\cD^{m+1},\,i\sim U(m)}\big[\ell(A(S^{(i)}),z_i)-\ell(A(S),z_i)\big]\le\epsilon(m)$$
이면 $A$는 비율 $\epsilon(m)$로 **평균 한 점 바꾸기 안정**(on-average-replace-one-stable)하다.
:::
` },
      { k: '13.3', p: 174, title: '강볼록성: 티호노프 규제는 안정화한다', body: R`
:::def 강볼록성
$f$가 **$\lambda$-강볼록**: 모든 $w,u$, $\alpha\in(0,1)$에서
$$f(\alpha w+(1-\alpha)u)\le\alpha f(w)+(1-\alpha)f(u)-\frac\lambda2\alpha(1-\alpha)\lVert w-u\rVert^2.$$
:::

:::key 강볼록 함수의 성질
1. $f(w)=\lambda\lVert w\rVert^2$은 $2\lambda$-강볼록이다.
2. $f$가 $\lambda$-강볼록이고 $g$가 볼록이면 $f+g$는 $\lambda$-강볼록이다.
3. $f$가 $\lambda$-강볼록이고 $u$가 최소점이면 모든 $w$에서 $f(w)-f(u)\ge\frac\lambda2\lVert w-u\rVert^2$.
:::

1은 항등식 $\alpha\lVert w\rVert^2+(1-\alpha)\lVert u\rVert^2-\lVert\alpha w+(1-\alpha)u\rVert^2=\alpha(1-\alpha)\lVert w-u\rVert^2$, 2는 두 부등식을 더한 것입니다. 3은 정의를 $\alpha$로 나눠 $\frac{f(u+\alpha(w-u))-f(u)}\alpha\le f(w)-f(u)-\frac\lambda2(1-\alpha)\lVert w-u\rVert^2$로 쓰고, 좌변이 최소점에서 $\ge0$임을 쓴 뒤 $\alpha\to0$.

**RLM의 안정성 부등식.** $f_S(w)=L_S(w)+\lambda\lVert w\rVert^2$은 $2\lambda$-강볼록입니다. $u=A(S)$, $v=A(S^{(i)})$에 3을 쓰면 $f_S(v)-f_S(u)\ge\lambda\lVert v-u\rVert^2$. 한편 $v$는 $f_{S^{(i)}}$의 최소점이므로
$$f_S(v)-f_S(u)=\underbrace{f_{S^{(i)}}(v)-f_{S^{(i)}}(u)}_{\le0}+\frac{\ell(v,z_i)-\ell(u,z_i)}m+\frac{\ell(u,z')-\ell(v,z')}m.$$

:::key 티호노프 규제의 안정성 부등식
$$\lambda\lVert A(S^{(i)})-A(S)\rVert^2\le\frac{\ell(A(S^{(i)}),z_i)-\ell(A(S),z_i)}m+\frac{\ell(A(S),z')-\ell(A(S^{(i)}),z')}m.$$
:::

규제항이 서로 상쇄되고, 두 표본이 다른 **한 점**의 손실만 남는 것이 핵심입니다.
` },
      { k: '13.3b', p: 176, title: '립시츠 손실', body: R`
손실이 $\rho$-립시츠이면 안정성 부등식의 우변이 $\frac{2\rho\lVert v-u\rVert}m$ 이하이므로 $\lVert v-u\rVert\le\frac{2\rho}{\lambda m}$이고, 다시 립시츠성으로 손실 차이를 누릅니다.

:::key 립시츠 손실에서 RLM의 안정성
손실이 볼록이고 $\rho$-립시츠이면 규제 $\lambda\lVert w\rVert^2$의 RLM은 비율 $\frac{2\rho^2}{\lambda m}$로 평균 한 점 바꾸기 안정하고
$$\E_S\big[L_\cD(A(S))-L_S(A(S))\big]\le\frac{2\rho^2}{\lambda m}.$$
:::

$\lambda$가 클수록 안정적(간격↓)이지만, 다음 절에서 보듯 훈련 오차 쪽 대가를 치릅니다.
` },
      { k: '13.3c', p: 177, src: '강의 노트 · Corollary 13.7', title: '매끄럽고 음이 아닌 손실', body: R`
립시츠 대신 $\beta$-매끄러움과 $\ell\ge0$을 가정합니다. 이때 쓰는 두 도구는 매끄러움의 이차 상한과 **자기 유계성** $\lVert\nabla\ell\rVert^2\le2\beta\ell$입니다(9단원).

:::key 매끄러운 손실에서 RLM의 안정성
손실이 볼록, $\beta$-매끄러움, 음이 아니고 $\lambda\ge\frac{2\beta}m$이면
$$\E\big[\ell(A(S^{(i)}),z_i)-\ell(A(S),z_i)\big]\le\frac{48\beta}{\lambda m}\E_S\big[L_S(A(S))\big].$$
:::

증명의 흐름: $D=\lVert v-u\rVert$, $a=\sqrt{\ell(u,z_i)}$, $b=\sqrt{\ell(v,z')}$라 두면 이차 상한과 자기 유계성으로 $\ell(v,z_i)-\ell(u,z_i)\le\sqrt{2\beta}\,aD+\frac\beta2D^2$(그리고 $z'$ 쪽도 같음). 안정성 부등식에 넣고 $\lambda-\frac\beta m\ge\frac\lambda2$를 쓰면 $D\le\frac{2\sqrt{2\beta}}{\lambda m}(a+b)$. 다시 넣어 정리하면 손실 차이 $\le\frac{12\beta}{\lambda m}(a^2+b^2)$이고, 대칭성으로 $\E[a^2]=\E[b^2]=\E[L_S(A(S))]$라 $\frac{24\beta}{\lambda m}\E[L_S]$ — 교재의 48보다 좋은 상수입니다.

:::warn 강의 노트의 한 곳
강의 노트는 같은 계산을 한 점을 **뺀** 표본 $S^{(i)}=S\setminus\{z_i\}$로 했습니다. 그런데 $\nabla L_S(w)=\frac1m\nabla\ell(w,z_i)+\frac{m-1}m\nabla L_{S^{(i)}}(w)$를 대입하는 단계에서 $\nabla L_S(w)-\nabla L_{S^{(i)}}(w_i)$를 $\frac1m\nabla\ell(w,z_i)+\frac{m-1}m\big(\nabla L_{S^{(i)}}(w)-\nabla L_{S^{(i)}}(w_i)\big)$로 적어 $-\frac1m\nabla L_{S^{(i)}}(w_i)$ 항이 빠졌습니다. 교재처럼 한 점을 **바꾸는** 표본을 쓰면 규제항과 나머지 $m-1$개 손실이 정확히 상쇄되어 이 문제가 생기지 않습니다. 증명 페이지는 이 방식으로 적었습니다.
:::
` },
      { k: '13.4', p: 178, src: '강의 노트 · Corollary 13.11', title: '적합과 안정성의 균형', body: R`
$$\E_S[L_\cD(A(S))]=\underbrace{\E_S[L_S(A(S))]}_{\text{적합}}+\underbrace{\E_S[L_\cD(A(S))-L_S(A(S))]}_{\text{안정성}}.$$
$\lambda$가 크면 안정성 항이 작지만 규제 때문에 훈련 오차(적합 항)가 커집니다. 적합 항은 RLM의 정의로 누릅니다: 임의의 $w^\star$에 대해 $L_S(A(S))\le L_S(A(S))+\lambda\lVert A(S)\rVert^2\le L_S(w^\star)+\lambda\lVert w^\star\rVert^2$, 기댓값을 취하면 $\E[L_S(w^\star)]=L_\cD(w^\star)$.

:::key 립시츠 손실의 오라클 부등식
손실이 볼록이고 $\rho$-립시츠이면 모든 $w^\star$에 대해
$$\E_S[L_\cD(A(S))]\le L_\cD(w^\star)+\lambda\lVert w^\star\rVert^2+\frac{2\rho^2}{\lambda m}.$$
볼록-립시츠-유계($\rho,B$) 문제에서 $\lambda=\sqrt{\frac{2\rho^2}{B^2m}}$로 두면 $\E[L_\cD(A(S))]\le\min_{w\in\cH}L_\cD(w)+\rho B\sqrt{\frac8m}$이고, $m\ge\frac{8\rho^2B^2}{\varepsilon^2}$이면 기대 초과 위험이 $\varepsilon$ 이하.
:::

$\lambda B^2+\frac{2\rho^2}{\lambda m}$은 산술–기하 평균으로 $\lambda=\sqrt{2\rho^2/(B^2m)}$에서 최소 $2\sqrt{2\rho^2B^2/m}=\rho B\sqrt{8/m}$.

**매끄러운 경우.** 안정성 상한을 넣으면 $\lambda\ge\frac{2\beta}m$에서
$$\E[L_\cD(A(S))]\le\Big(1+\frac{48\beta}{\lambda m}\Big)\E[L_S(A(S))]\le\Big(1+\frac{48\beta}{\lambda m}\Big)\big(L_\cD(w^\star)+\lambda\lVert w^\star\rVert^2\big).$$

:::key 볼록-매끄러움-유계 문제의 학습가능성
볼록-매끄러움-유계($\beta,B$) 문제에서 $0\in\cH$, $\ell(0,z)\le1$이라 하자. $\varepsilon\in(0,1)$, $\lambda=\frac\varepsilon{3B^2}$, $m\ge\frac{288\beta B^2}{\varepsilon^2}$이면 모든 $\cD$에서 $\E_S[L_\cD(A(S))]\le\min_{w\in\cH}L_\cD(w)+\varepsilon$.
:::

:::hand 강의 노트 — 150이 아니라 288
교재(따름정리 13.11)는 $m\ge150\beta B^2/\varepsilon^2$로 적었지만, 그 값으로는 $\frac{48\beta}{\lambda m}\le\frac{144}{150}\varepsilon=0.96\varepsilon$밖에 얻지 못하고, $L^\star=\min L_\cD\le1$만 아는 상황에서 $(1+0.96\varepsilon)(L^\star+\frac\varepsilon3)$은 $L^\star+\varepsilon$ 아래로 내려오지 않습니다. $288$이면 $\frac{48\beta}{\lambda m}=\frac{144\beta B^2}{\varepsilon m}\le\frac\varepsilon2$이고
$$\Big(1+\frac\varepsilon2\Big)\Big(L^\star+\frac\varepsilon3\Big)=L^\star+\frac\varepsilon3+\frac\varepsilon2L^\star+\frac{\varepsilon^2}6\le L^\star+\frac\varepsilon3+\frac\varepsilon2+\frac\varepsilon6=L^\star+\varepsilon.$$
($L^\star\le L_\cD(0)\le1$, $\varepsilon^2\le\varepsilon$.)
:::
` },
      { k: '13.4b', p: 181, src: '강의 노트 · Exercise 13.4', title: '일반 노름으로 넓히기', body: R`
지금까지의 논증은 유클리드 노름의 특별한 항등식을 쓰지 않았습니다. 강의 노트는 이를 임의의 노름 $\lVert\cdot\rVert$로 넓힙니다. **쌍대 노름**은 $\lVert g\rVert_\ast=\sup_{\lVert u\rVert\le1}\langle g,u\rangle$이고, 일반화된 횔더 부등식 $\lvert\langle g,u\rangle\rvert\le\lVert g\rVert_\ast\lVert u\rVert$가 코시–슈바르츠를 대신합니다.

:::key 일반 노름에서의 RLM 안정성
각 $\ell(\cdot,z)$가 볼록이고 노름 $\lVert\cdot\rVert$에 대해 $\rho$-립시츠이며, 규제 $R$이 같은 노름에 대해 $2\lambda$-강볼록이면 $A(S)=\argmin_w[L_S(w)+R(w)]$는 모든 $z$에서
$$\lvert\ell(A(S),z)-\ell(A(S^{(i)}),z)\rvert\le\frac{\rho^2}{\lambda m}\le\frac{2\rho^2}{\lambda m}$$
이고, 따라서 모든 $w$에 대해 $\E_S[L_\cD(A(S))]\le L_\cD(w)+R(w)+\frac{2\rho^2}{\lambda m}$.
:::

증명은 두 목적함수 $F_S$, $F_{S^{(i)}}$ **각각**의 최소점 근처 이차 증가를 더하는 것입니다: $F_S(v)-F_S(w)\ge\lambda\lVert v-w\rVert^2$, $F_{S^{(i)}}(w)-F_{S^{(i)}}(v)\ge\lambda\lVert w-v\rVert^2$. 더하면 규제가 사라지고 $2\lambda\lVert w-v\rVert^2\le\frac{2\rho}m\lVert w-v\rVert$라 $\lVert w-v\rVert\le\frac\rho{\lambda m}$. 한쪽만 쓴 유클리드 증명보다 상수가 절반입니다.

:::note 왜 필요한가
$q\in(1,2]$이면 $\frac12\lVert w\rVert_q^2$은 $\lVert\cdot\rVert_q$에 대해 $(q-1)$-강볼록이라, $R(w)=\frac\lambda{q-1}\lVert w\rVert_q^2$은 $\ell_q$ 노름에 대해 $2\lambda$-강볼록입니다. 이때 손실의 립시츠 상수는 쌍대 노름 $\ell_p$ ($\frac1p+\frac1q=1$)로 재므로, 희소한 문제에서 $q$를 1 가까이 잡으면 유클리드 분석보다 차원에 훨씬 덜 기대는 상한을 얻습니다. 이런 “노름 맞추기”가 온라인 학습의 거울 하강법으로 이어집니다.
:::
` },
    ],
    problems: [
      { sec: '13.1b', type: 'mc', lv: 1, q: R`릿지 목적함수 $\lambda\lVert w\rVert^2+\frac1{2m}\sum(\langle w,x_i\rangle-y_i)^2$의 최소점이 만족하는 식은?`,
        choices: [R`$Aw=b$`, R`$(\lambda I+A)w=b$`, R`$(2\lambda mI+A)w=b$`, R`$(2\lambda I+A)w=mb$`], ans: 2,
        sol: R`$\nabla=2\lambda w+\frac1m(Aw-b)=0$에 $m$을 곱하면 $(2\lambda mI+A)w=b$.` },
      { sec: '13.1b', type: 'num', lv: 2, q: R`1차원, 자료 $(x,y)=(1,2),(2,2)$, $m=2$, $\lambda=0.5$인 릿지 해 $w=(2\lambda m+A)^{-1}b$는?`, ans: '6/7', ansTex: R`\tfrac{6}{2+5}=\tfrac67`,
        sol: R`$A=1+4=5$, $b=2+4=6$, $2\lambda m=2$. $w=6/7\approx0.857$. 규제 없는 해 $6/5$보다 0 쪽으로 줄었습니다.` },
      { sec: '13.2', type: 'mc', lv: 2, q: R`정리 13.2의 우변 $\ell(A(S^{(i)}),z_i)-\ell(A(S),z_i)$에서 $A(S^{(i)})$는?`,
        choices: [R`$z_i$를 두 번 본 모델`, R`$z_i$를 보지 않은(대신 $z'$를 본) 모델`, R`$z'$를 보지 않은 모델`, R`표본 전체를 무시한 모델`], ans: 1,
        sol: R`$S^{(i)}$는 $z_i$ 자리에 $z'$를 넣은 표본입니다. 보지 않은 점에서의 손실 − 본 점에서의 손실이 일반화 간격입니다.` },
      { sec: '13.2', type: 'mc', lv: 3, q: R`정리 13.2의 증명에서 $\E[\ell(A(S),z')]=\E[\ell(A(S^{(i)}),z_i)]$가 성립하는 근거는?`,
        choices: [R`$A$가 ERM이라서`, R`$z_i$와 $z'$가 i.i.d.라 둘의 자리를 바꿔도 $(S,z')$의 결합분포가 같아서`, R`손실이 유계라서`, R`$A$가 안정해서`], ans: 1,
        sol: R`어떤 학습기에도 성립하는 항등식이고, 필요한 것은 i.i.d.뿐입니다.` },
      { sec: '13.3', type: 'num', lv: 1, q: R`$f(w)=3\lVert w\rVert^2$은 몇-강볼록인가?`, ans: '6', ansTex: R`2\cdot3=6`,
        sol: R`$\lambda\lVert w\rVert^2$은 $2\lambda$-강볼록.` },
      { sec: '13.3', type: 'num', lv: 2, q: R`$f$가 $4$-강볼록이고 최소점 $u$에서 $f(u)=1$이면, $\lVert w-u\rVert=0.5$인 $w$에서 $f(w)$의 하한은?`, ans: '1.5', ansTex: R`1+\tfrac42(0.25)=1.5`,
        sol: R`$f(w)-f(u)\ge\frac\lambda2\lVert w-u\rVert^2=2\cdot0.25=0.5$.` },
      { sec: '13.3b', type: 'num', lv: 1, q: R`$\rho=1$, $\lambda=0.01$, $m=1000$일 때 립시츠 손실 RLM의 안정성 상한 $2\rho^2/(\lambda m)$은?`, ans: '0.2', ansTex: R`0.2`,
        sol: R`$2/(0.01\cdot1000)=0.2$.` },
      { sec: '13.4', type: 'num', lv: 2, q: R`볼록-립시츠-유계 문제에서 $\rho=1$, $B=2$, $\varepsilon=0.1$일 때 표본 수 $8\rho^2B^2/\varepsilon^2$은?`, ans: '3200', ansTex: R`3200`,
        sol: R`$8\cdot1\cdot4/0.01=3200$.` },
      { sec: '13.4', type: 'num', lv: 2, q: R`같은 문제에서 $m=800$일 때 최적의 $\lambda=\sqrt{2\rho^2/(B^2m)}$은?`, ans: '0.025', ansTex: R`\sqrt{2/3200}=0.025`,
        sol: R`$\sqrt{2/(4\cdot800)}=\sqrt{1/1600}=0.025$. 이때 상한 $\rho B\sqrt{8/m}=2\sqrt{0.01}=0.2$.` },
      { sec: '13.4', type: 'mc', lv: 2, q: R`오라클 부등식 $L_\cD(w^\star)+\lambda\lVert w^\star\rVert^2+\frac{2\rho^2}{\lambda m}$에서 $\lambda$를 키우면?`,
        choices: [R`적합 항(규제 대가)↑, 안정성 항↓`, R`둘 다↓`, R`적합 항↓, 안정성 항↑`, R`변화 없음`], ans: 0,
        sol: R`$\lambda\lVert w^\star\rVert^2$은 커지고 $\frac{2\rho^2}{\lambda m}$은 작아집니다. 이 균형이 편향-복잡도 균형의 규제판입니다.` },
      { sec: '13.4', type: 'mc', lv: 3, q: R`강의 노트가 따름정리 13.11의 표본 수 상수를 150에서 288로 바꾼 이유는?`,
        choices: [R`증명을 더 짧게 하려고`, R`150으로는 $\frac{48\beta}{\lambda m}\le0.96\varepsilon$밖에 안 되어 $L^\star\le1$만으로 $\min L+\varepsilon$을 보장하지 못하므로`, R`매끄러움 상수가 달라서`, R`$\lambda$를 바꿨기 때문에`], ans: 1,
        sol: R`288이면 $\frac{48\beta}{\lambda m}\le\frac\varepsilon2$가 되어 $(1+\frac\varepsilon2)(L^\star+\frac\varepsilon3)\le L^\star+\varepsilon$이 닫힙니다.` },
      { sec: '13.3', type: 'open', lv: 2, proof: true, q: R`$f_S(w)=L_S(w)+\lambda\lVert w\rVert^2$ (손실은 볼록)에 대해 $\lambda\lVert A(S^{(i)})-A(S)\rVert^2\le\frac1m\big[\ell(A(S^{(i)}),z_i)-\ell(A(S),z_i)+\ell(A(S),z')-\ell(A(S^{(i)}),z')\big]$임을 증명하고, 손실이 $\rho$-립시츠이면 안정성이 $2\rho^2/(\lambda m)$ 이하임을 보이세요.`,
        sol: R`
$u=A(S)$, $v=A(S^{(i)})$. $\lambda\lVert w\rVert^2$은 $2\lambda$-강볼록, $L_S$는 볼록이라 $f_S$는 $2\lambda$-강볼록. 최소점 $u$에서 $f_S(v)-f_S(u)\ge\lambda\lVert v-u\rVert^2$.
$L_S(w)=L_{S^{(i)}}(w)+\frac{\ell(w,z_i)-\ell(w,z')}m$이므로
$f_S(v)-f_S(u)=[f_{S^{(i)}}(v)-f_{S^{(i)}}(u)]+\frac{\ell(v,z_i)-\ell(u,z_i)}m+\frac{\ell(u,z')-\ell(v,z')}m$, 첫 괄호는 $v$가 $f_{S^{(i)}}$의 최소점이라 $\le0$. 합치면 부등식.
립시츠: 우변 $\le\frac{2\rho}m\lVert v-u\rVert$. 따라서 $\lVert v-u\rVert\le\frac{2\rho}{\lambda m}$ (0이면 자명). 다시 $\ell(v,z_i)-\ell(u,z_i)\le\rho\lVert v-u\rVert\le\frac{2\rho^2}{\lambda m}$. 기댓값을 취하면 안정성 비율 $\frac{2\rho^2}{\lambda m}$.`,
        rubric: R`
- 강볼록성 성질 3의 적용 — 3점
- $L_S$와 $L_{S^{(i)}}$의 차이로 분해, 최소성으로 첫 항 ≤ 0 — 4점
- 립시츠로 거리와 손실 차이 — 3점` },
      { sec: '13.4', type: 'open', lv: 2, proof: true, q: R`손실이 볼록, $\rho$-립시츠일 때 오라클 부등식 $\E[L_\cD(A(S))]\le L_\cD(w^\star)+\lambda\lVert w^\star\rVert^2+\frac{2\rho^2}{\lambda m}$을 유도하고, $\lVert w^\star\rVert\le B$에서 $\lambda$를 최적화해 $m\ge8\rho^2B^2/\varepsilon^2$이면 초과 위험이 $\varepsilon$ 이하임을 보이세요.`,
        sol: R`
$\E[L_\cD(A(S))]=\E[L_S(A(S))]+\E[L_\cD(A(S))-L_S(A(S))]$. 둘째 항은 정리 13.2와 안정성으로 $\le\frac{2\rho^2}{\lambda m}$.
첫째: $L_S(A(S))\le L_S(A(S))+\lambda\lVert A(S)\rVert^2\le L_S(w^\star)+\lambda\lVert w^\star\rVert^2$ (RLM의 최소성). $\E_S[L_S(w^\star)]=L_\cD(w^\star)$ ($w^\star$는 고정).
합치면 오라클 부등식. $w^\star\in\argmin_{\cH}L_\cD$, $\lVert w^\star\rVert^2\le B^2$: 우변 $\le\min L+\lambda B^2+\frac{2\rho^2}{\lambda m}$. $\lambda=\sqrt{2\rho^2/(B^2m)}$에서 $\lambda B^2=\frac{2\rho^2}{\lambda m}=\rho B\sqrt{2/m}$, 합 $\rho B\sqrt{8/m}\le\varepsilon\iff m\ge8\rho^2B^2/\varepsilon^2$.`,
        rubric: R`
- 적합 + 안정성 분해 — 2점
- 적합 항을 RLM 최소성과 $\E L_S(w^\star)=L_\cD(w^\star)$로 — 4점
- $\lambda$ 최적화와 표본 수 — 4점` },
    ],
  });
})();
