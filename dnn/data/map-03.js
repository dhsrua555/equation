/* 논리 지도 — 03 엔트로피, KL 발산, 상호정보량. 단원 첫머리의 쉬운 요약(easy), 생각의 흐름을 그린 지도(nodes·rows·edges),
   그리고 각 절 머리와 소제목(at)에 붙는 위치 표시. 형식은 map-01.js와 같습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 3,
    easy: R`
이 단원의 질문은 ‘정보와 불확실성을 숫자로 잴 수 있을까’입니다. 출발점은 **놀라움**입니다. 드문 일이 일어날수록 더 놀랍고, 서로 무관한 두 일의 놀라움은 더해져야 합니다. 이 두 요구를 만족하는 함수가 로그라서, 확률 $p$인 사건의 **정보량**은 $-\log p$입니다. 그 평균이 **엔트로피** $H(X)=-\sum_xp(x)\log p(x)$이고, 답을 알아내는 데 필요한 예/아니오 질문의 평균 개수라고 생각하면 됩니다.

다음으로 두 분포를 비교합니다. 진짜 분포가 $p$인데 $q$라고 믿고 압축 부호를 짜면 평균적으로 부호가 길어지는데, 그 손해가 **KL 발산** $\KL(p\Vert q)$입니다. 이 단원의 중심 결과인 Theorem 1은 이 손해가 결코 음수가 아니고 $p=q$일 때만 0이라는 것이며, 증명 도구는 볼록함수에 관한 **젠센 부등식** 하나입니다.

이 한 가지 사실에서 나머지가 줄줄이 나옵니다. 두 확률변수가 공유하는 정보인 **상호정보량**은 0 이상이므로 ‘다른 변수를 알면 불확실성은 평균적으로 줄어든다’가 됩니다. **교차 엔트로피**(cross-entropy)는 엔트로피 + KL이므로, 분류 모델의 손실을 줄이는 것이 곧 KL을 줄이는 것, 즉 최대가능도 추정임이 보입니다.

마지막으로 KL의 불편함, 곧 순서를 바꾸면 값이 달라지고 무한대가 될 수도 있다는 점을 고칩니다. 두 분포를 반반 섞은 분포와 비교하는 **젠센-섀넌(JS) 발산**은 순서와 무관하고 언제나 $\log2$ 이하이며, 두 분포가 같을 때만 0입니다. 그 핵심 성질도 Theorem 1과 그 등호 조건에서 바로 나옵니다.`,
    easyEn: R`
The question of this unit is whether information and uncertainty can be measured with numbers. The starting point is **surprise**. The rarer an event, the more surprising it is, and the surprises of two unrelated events should add up. The function that meets both demands is the logarithm, so the **information** of an event with probability $p$ is $-\log p$. Its average is the **entropy** $H(X)=-\sum_xp(x)\log p(x)$, which you can think of as the average number of yes/no questions needed to find the answer.

Next we compare two distributions. If the true distribution is $p$ but we design a compression code believing it is $q$, the code gets longer on average; that loss is the **KL divergence** $\KL(p\Vert q)$. The central result of the unit, Theorem 1, says this loss is never negative and is 0 only when $p=q$. Its proof needs a single tool, **Jensen's inequality** for convex functions.

From this one fact the rest follows in a chain. The **mutual information**, the information two random variables share, is at least 0, so “knowing another variable reduces uncertainty on average”. The **cross-entropy** is entropy + KL, so lowering a classifier's loss is the same as lowering a KL divergence, that is, maximum likelihood estimation.

Finally we repair the inconveniences of KL: its value changes when the order is swapped, and it can be infinite. The **Jensen–Shannon (JS) divergence**, which compares both distributions with their half-and-half mixture, does not depend on the order, never exceeds $\log2$, and is 0 only when the two distributions are equal. Its key properties, too, come straight from Theorem 1 and its equality condition.`,
    nodes: [
      { id: 'info', role: 'def', k: '3.1', t: R`정보량 $-\log p$`, en: R`Information $-\log p$`,
        d: R`드문 사건일수록 크고, 독립인 사건끼리는 더해져야 한다는 두 요구에서 로그가 나옵니다. 이 단원의 모든 양이 이 ‘놀라움’에서 출발합니다.`,
        dEn: R`Two demands (larger for rarer events, additive for independent ones) force a logarithm. Every quantity in this unit starts from this “surprise”.` },
      { id: 'ent', role: 'def', k: '3.1', at: ':::key 엔트로피', t: R`엔트로피 = 평균 놀라움`, en: R`Entropy = average surprise`,
        d: R`$H(X)=-\sum_xp(x)\log p(x)$는 답을 알아내는 데 드는 평균 질문 수입니다. $0\le H(X)\le\log K$이고, 균등분포가 가장 불확실합니다.`,
        dEn: R`$H(X)=-\sum_xp(x)\log p(x)$ is the average number of questions needed to find the answer. $0\le H(X)\le\log K$, and the uniform distribution is the most uncertain.` },
      { id: 'chain', role: 'tool', k: '3.2', t: R`연쇄법칙`, en: R`The chain rule`,
        d: R`$X$를 먼저 알아낸 뒤 남은 $Y$를 알아내면 되므로 $H(X,Y)=H(X)+H(Y\mid X)$입니다. 조건부 엔트로피와 이 법칙이 상호정보량(3.4절)의 재료입니다.`,
        dEn: R`Find $X$ first, then what is left of $Y$: $H(X,Y)=H(X)+H(Y\mid X)$. Conditional entropy and this rule are the ingredients of mutual information (§3.4).` },
      { id: 'kl', role: 'def', k: '3.3', t: R`KL 발산`, en: R`KL divergence`,
        d: R`$\KL(p\Vert q)=\sum_xp(x)\log\frac{p(x)}{q(x)}$는 참분포 $p$ 대신 $q$를 쓸 때의 평균 손해입니다. 대칭이 아니어서 거리는 아닙니다.`,
        dEn: R`$\KL(p\Vert q)=\sum_xp(x)\log\frac{p(x)}{q(x)}$ is the average loss from using $q$ in place of the true $p$. It is not symmetric, so it is not a distance.` },
      { id: 'jensen', role: 'tool', k: '3.3', at: '### 도구: 젠센 부등식', t: R`젠센 부등식`, en: R`Jensen's inequality`,
        d: R`볼록함수 $\varphi$에 대해 $\varphi(\E X)\le\E\varphi(X)$이고, 순볼록이면 등호는 $X$가 상수일 때뿐입니다. 이 단원의 부등식을 모두 이 도구 하나로 증명합니다.`,
        dEn: R`For a convex $\varphi$, $\varphi(\E X)\le\E\varphi(X)$; if $\varphi$ is strictly convex, equality holds only when $X$ is constant. Every inequality in this unit is proved with this one tool.` },
      { id: 'thm1', role: 'res', k: '3.3', at: '### Theorem 1', t: R`KL 비음성 (Theorem 1)`, en: R`Theorem 1: $\KL\ge0$`,
        d: R`$-\log$가 볼록이라 젠센에서 $\KL(p\Vert q)\ge0$이고, 등호는 $p=q$일 때뿐입니다. 뒤 세 절의 부등식이 모두 이 정리에서 나옵니다.`,
        dEn: R`Since $-\log$ is convex, Jensen gives $\KL(p\Vert q)\ge0$, with equality only when $p=q$. The inequalities of the next three sections all come from this theorem.` },
      { id: 'mi', role: 'step', k: '3.4', t: R`상호정보량`, en: R`Mutual information`,
        d: R`$I(X;Y)=\KL\big(p(x,y)\Vert p(x)p(y)\big)=H(Y)-H(Y\mid X)$, 곧 $X$를 알면 줄어드는 $Y$의 불확실성입니다. $I\ge0$이라 조건을 걸면 엔트로피가 평균적으로 줄어듭니다.`,
        dEn: R`$I(X;Y)=\KL\big(p(x,y)\Vert p(x)p(y)\big)=H(Y)-H(Y\mid X)$, the uncertainty about $Y$ removed by knowing $X$. Since $I\ge0$, conditioning reduces entropy on average.` },
      { id: 'ce', role: 'app', k: '3.5', t: R`교차 엔트로피`, en: R`Cross-entropy`,
        d: R`$H_p(q)=H(p)+\KL(p\Vert q)\ge H(p)$. 원-핫 레이블이면 $-\log q(\text{정답})$이 되어, 교차 엔트로피 최소화 = KL 최소화 = MLE입니다.`,
        dEn: R`$H_p(q)=H(p)+\KL(p\Vert q)\ge H(p)$. With a one-hot label it is $-\log q(\text{correct class})$, so minimizing cross-entropy = minimizing KL = MLE.` },
      { id: 'js', role: 'fix', k: '3.6', t: R`JS 발산`, en: R`JS divergence`,
        d: R`KL은 대칭이 아니고 무한대가 될 수 있습니다. 섞은 분포 $m=\frac12(p+q)$에 대한 두 KL의 평균으로 바꾸면 순서와 무관하고, 분모가 0이 되지 않습니다.`,
        dEn: R`KL is not symmetric and can be infinite. Averaging the two KLs to the mixture $m=\frac12(p+q)$ makes it independent of the order, and the denominator never vanishes.` },
      { id: 'jsprops', role: 'res', k: '3.6', at: '### Problem Set 1 문제 1', t: R`JS의 성질 (i)–(iv)`, en: R`Properties (i)–(iv) of JS`,
        d: R`비음성·동일성은 Theorem 1과 그 등호 조건에서, 대칭성은 $m$의 대칭에서 나오고, $D_{JS}\le\log2$입니다. 끝으로 엔트로피와 상호정보량으로 다시 읽습니다.`,
        dEn: R`Non-negativity and identity come from Theorem 1 and its equality condition, symmetry from the symmetry of $m$, and $D_{JS}\le\log2$. The section ends by rereading it through entropy and mutual information.` },
    ],
    rows: [['info'], ['ent', 'kl', 'jensen'], ['chain', 'thm1', null], ['mi', 'ce', 'js'], [null, null, 'jsprops']],
    edges: [
      ['info', 'ent', R`평균하면`, R`average it`],
      ['info', 'kl', R`$q$를 쓰는 손해`, R`cost of using $q$`],
      ['ent', 'chain', R`두 변수로`, R`two variables`],
      ['kl', 'thm1', R`늘 0 이상?`, R`always $\ge0$?`],
      ['jensen', 'thm1'],
      ['chain', 'mi'],
      ['thm1', 'mi', R`$I\ge0$`, R`$I\ge0$`],
      ['thm1', 'ce', R`$\ge$ 엔트로피`, R`$\ge$ entropy`],
      ['thm1', 'js', R`대칭으로 보완`, R`symmetric fix`],
      ['js', 'jsprops', R`세 성질 증명`, R`prove the properties`],
    ],
  });
})();
