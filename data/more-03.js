/* 추가 연습문제 — 03 연립 ODE와 상평면 (Kreyszig 4.1–4.6). 같은 유형으로 새로 만든 문제입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 3,
    secTitles: { '4.1': '연립 ODE 모델', '4.2': '기본 이론', '4.3': '상수계수·상평면', '4.4': '임계점·안정성', '4.5': '비선형계', '4.6': '비동차 연립' },
    secs: ['4.1', '4.4', '4.4', '4.4', '4.3', '4.3', '4.5', '4.4', '4.3', '4.5'],
    problems: [
      { sec: '4.1', type: 'num', lv: 2, q: R`100 L 탱크 두 개가 관으로 연결되어 물이 2 L/min씩 서로 오간다. 처음 탱크 1에 소금 100 kg, 탱크 2에는 소금이 없다. 충분히 시간이 지난 뒤 탱크 1의 소금(kg)은?`, ans: '50', ansTex: R`50`,
        sol: R`
$y_1'=-0.02y_1+0.02y_2$, $y_2'=0.02y_1-0.02y_2$. 고유값 $0$ (고유벡터 $(1,1)$), $-0.04$ ($(1,-1)$).
$\mathbf y(0)=(100,0)=50(1,1)+50(1,-1)$이므로 $y_1=50+50e^{-0.04t}\to50$.` },
      { sec: '4.1', type: 'num', lv: 2, q: R`앞 문제에서 탱크 1의 소금이 75 kg이 되는 시각(분)은?`, ans: '25*ln(2)', ansTex: R`25\ln2\approx17.3`,
        sol: R`$50+50e^{-0.04t}=75$에서 $e^{-0.04t}=\tfrac12$, $t=\dfrac{\ln2}{0.04}=25\ln2$.` },
      { sec: '4.1', type: 'mc', lv: 1, q: R`$y'''=y$를 $y_1=y,\ y_2=y',\ y_3=y''$로 연립 ODE $\mathbf y'=A\mathbf y$로 쓸 때 $A$는?`,
        choices: [R`$\begin{pmatrix}0&1&0\\0&0&1\\1&0&0\end{pmatrix}$`, R`$\begin{pmatrix}1&0&0\\0&1&0\\0&0&1\end{pmatrix}$`, R`$\begin{pmatrix}0&0&1\\1&0&0\\0&1&0\end{pmatrix}$`, R`$\begin{pmatrix}0&1&0\\0&0&1\\0&0&1\end{pmatrix}$`], ans: 0,
        sol: R`$y_1'=y_2$, $y_2'=y_3$, $y_3'=y'''=y=y_1$.` },
      { sec: '4.2', type: 'num', lv: 2, q: R`해 $\mathbf y^{(1)}=\begin{pmatrix}e^{2t}\\e^{2t}\end{pmatrix}$, $\mathbf y^{(2)}=\begin{pmatrix}e^{-t}\\-2e^{-t}\end{pmatrix}$의 론스키안의 $t=0$에서의 값은?`, ans: '-3', ansTex: R`-3`,
        sol: R`$W=\det\begin{pmatrix}e^{2t}&e^{-t}\\e^{2t}&-2e^{-t}\end{pmatrix}=-2e^{t}-e^{t}=-3e^{t}$. $W(0)=-3\ne0$이므로 두 해는 기저입니다.` },
      { sec: '4.2', type: 'mc', lv: 1, q: R`$n\times n$ 상수계수 계 $\mathbf y'=A\mathbf y$의 일반해를 쓰는 데 필요한 것은?`,
        choices: [R`일차독립인 해 $n$개 (기저)`, R`해 1개와 초기조건`, R`고유값 $n$개가 모두 실수일 것`, R`$A$가 대칭일 것`], ans: 0,
        sol: R`해 공간은 $n$차원이므로 일차독립인 해 $n$개의 일차결합으로 모든 해를 씁니다. 고유값이 복소수이거나 중복이어도 기저는 항상 있습니다.` },
      { sec: '4.3', type: 'num', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}1&1\\4&1\end{pmatrix}\mathbf y,\ \mathbf y(0)=\begin{pmatrix}2\\0\end{pmatrix}$일 때 $y_2(\ln2)$는?`, ans: '15', ansTex: R`15`,
        sol: R`
$\lambda^2-2\lambda-3=0$에서 $\lambda=3$ (고유벡터 $(1,2)$), $\lambda=-1$ ($(1,-2)$). $c_1+c_2=2$, $2c_1-2c_2=0$에서 $c_1=c_2=1$.
$y_2=2e^{3t}-2e^{-t}$, $y_2(\ln2)=16-1=15$.` },
      { sec: '4.3', type: 'num', lv: 3, q: R`$\mathbf y'=\begin{pmatrix}-1&-4\\1&-1\end{pmatrix}\mathbf y,\ \mathbf y(0)=\begin{pmatrix}2\\0\end{pmatrix}$일 때 $y_2(\pi/4)$는?`, ans: 'e^(-pi/4)', ansTex: R`e^{-\pi/4}\approx0.456`,
        sol: R`
$\lambda=-1\pm2i$. $\lambda=-1+2i$의 고유벡터 $(2i,1)=(0,1)+i(2,0)$에서 실수해 $e^{-t}(-2\sin2t,\ \cos2t)$, $e^{-t}(2\cos2t,\ \sin2t)$.
초기조건에 맞는 것은 둘째 해이므로 $y_1=2e^{-t}\cos2t$, $y_2=e^{-t}\sin2t$. $y_2(\pi/4)=e^{-\pi/4}$.` },
      { sec: '4.3', type: 'open', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}4&-2\\1&1\end{pmatrix}\mathbf y$의 일반해를 구하고 임계점의 종류를 말하세요.`,
        sol: R`
$\lambda^2-5\lambda+6=0$에서 $\lambda=2$ (고유벡터 $(1,1)$), $\lambda=3$ ($(2,1)$).
$$\mathbf y=c_1\begin{pmatrix}1\\1\end{pmatrix}e^{2t}+c_2\begin{pmatrix}2\\1\end{pmatrix}e^{3t}$$
두 고유값이 양의 실수이므로 불안정한 마디점입니다.` },
      { sec: '4.3', type: 'num', lv: 3, q: R`$\mathbf y'=\begin{pmatrix}3&-1\\1&1\end{pmatrix}\mathbf y,\ \mathbf y(0)=\begin{pmatrix}1\\0\end{pmatrix}$일 때 $y_2(1)$은?`, ans: 'e^2', ansTex: R`e^2\approx7.389`,
        sol: R`
$(\lambda-2)^2=0$, 고유벡터 $\mathbf x=(1,1)$ 하나뿐. $(A-2I)\mathbf u=\mathbf x$에서 $\mathbf u=(1,0)$.
$\mathbf y=c_1\mathbf xe^{2t}+c_2(\mathbf xt+\mathbf u)e^{2t}$, 초기조건에서 $c_1=0$, $c_2=1$. $\mathbf y=(t+1,\ t)e^{2t}$, $y_2(1)=e^2$.` },
      { sec: '4.3', type: 'mc', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}1&2\\2&1\end{pmatrix}\mathbf y$ (안장점)에서 $t\to\infty$일 때 원점으로 다가가는 궤적은 어느 직선 위에 있는가?`,
        choices: [R`$y_2=-y_1$`, R`$y_2=y_1$`, R`$y_1=0$`, R`$y_2=0$`], ans: 0,
        sol: R`음의 고유값 $-1$의 고유벡터 $(1,-1)$ 방향의 해 $c(1,-1)e^{-t}$만 원점으로 갑니다. 다른 궤적은 $(1,1)$ 방향으로 멀어집니다.` },
      { sec: '4.3', type: 'num', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}-4&2\\2&-1\end{pmatrix}\mathbf y,\ \mathbf y(0)=\begin{pmatrix}0\\5\end{pmatrix}$일 때 $\displaystyle\lim_{t\to\infty}y_1(t)$는?`, ans: '2', ansTex: R`2`,
        sol: R`
$\tr=-5$, $\det=0$이므로 $\lambda=0$ ($(1,2)$), $\lambda=-5$ ($(2,-1)$). $(0,5)=2(1,2)-(2,-1)$.
$\mathbf y=2(1,2)-(2,-1)e^{-5t}\to(2,4)$이므로 극한은 2.` },
      { sec: '4.4', type: 'mc', lv: 1, q: R`$\mathbf y'=\begin{pmatrix}-2&0\\0&-5\end{pmatrix}\mathbf y$의 임계점은?`,
        choices: [R`안정하고 끌어당기는 마디점`, R`불안정한 마디점`, R`안장점`, R`중심`], ans: 0,
        sol: R`고유값 $-2,-5$ (같은 부호의 음의 실수). $p=-7<0$, $q=10>0$, $\Delta=9>0$.` },
      { sec: '4.4', type: 'mc', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}2&5\\-1&-2\end{pmatrix}\mathbf y$의 임계점은?`,
        choices: [R`안장점`, R`중심`, R`안정한 나선점`, R`불안정한 마디점`], ans: 1,
        sol: R`$p=0$, $q=-4+5=1>0$이므로 중심. 고유값 $\pm i$.` },
      { sec: '4.4', type: 'mc', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}1&2\\-2&1\end{pmatrix}\mathbf y$의 임계점은?`,
        choices: [R`안정한 나선점`, R`불안정한 나선점`, R`중심`, R`안장점`], ans: 1,
        sol: R`$p=2>0$, $q=1+4=5$, $\Delta=4-20<0$. 고유값 $1\pm2i$로 바깥으로 풀려 나가는 나선입니다.` },
      { sec: '4.4', type: 'num', lv: 2, q: R`$y''+cy'+4y=0\ (c>0)$을 연립계로 볼 때, 원점이 나선점에서 마디점으로 바뀌는 $c$의 값은?`, ans: '4', ansTex: R`4`,
        sol: R`$A=\begin{pmatrix}0&1\\-4&-c\end{pmatrix}$, $p=-c$, $q=4$, $\Delta=c^2-16$. $\Delta<0$ ($c<4$)이면 나선, $c\ge4$이면 마디점. 임계감쇠와 같은 조건입니다.` },
      { sec: '4.4', type: 'num', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}-0.5&-1\\1&-0.5\end{pmatrix}\mathbf y$의 궤적은 원점을 한 바퀴 돌 때마다 원점과의 거리가 몇 배가 되는가?`, ans: 'e^(-pi)', ansTex: R`e^{-\pi}\approx0.0432`,
        sol: R`고유값 $-0.5\pm i$이므로 해는 $e^{-0.5t}\times$(각속도 1의 회전). 한 바퀴는 $t=2\pi$이므로 $e^{-0.5\cdot2\pi}=e^{-\pi}$배.` },
      { sec: '4.5', type: 'mc', lv: 2, q: R`$y_1'=y_2,\ y_2'=-y_1+y_1^2$의 임계점 $(1,0)$의 종류는?`,
        choices: [R`안장점`, R`중심`, R`안정한 나선점`, R`불안정한 마디점`], ans: 0,
        sol: R`임계점은 $(0,0)$, $(1,0)$. $J=\begin{pmatrix}0&1\\-1+2y_1&0\end{pmatrix}$이므로 $(1,0)$에서 $\begin{pmatrix}0&1\\1&0\end{pmatrix}$, $q=-1<0$ → 안장점.` },
      { sec: '4.5', type: 'mc', lv: 2, q: R`포식자–피식자 모델 $y_1'=y_1(2-y_2),\ y_2'=y_2(y_1-3)$에서 원점이 아닌 임계점과 그 선형화된 종류는?`,
        choices: [R`$(3,2)$, 중심`, R`$(2,3)$, 안장점`, R`$(3,2)$, 안정한 나선점`, R`$(2,3)$, 중심`], ans: 0,
        sol: R`$y_2=2$, $y_1=3$. $J=\begin{pmatrix}2-y_2&-y_1\\y_2&y_1-3\end{pmatrix}=\begin{pmatrix}0&-3\\2&0\end{pmatrix}$, $p=0$, $q=6$ → 중심. 개체 수가 주기적으로 오르내립니다.` },
      { sec: '4.5', type: 'open', lv: 3, q: R`감쇠 진자 $\theta''+0.5\theta'+4\sin\theta=0$의 임계점 $(0,0)$과 $(\pi,0)$을 분류하세요.`,
        sol: R`
$y_1=\theta$, $y_2=\theta'$: $y_1'=y_2$, $y_2'=-4\sin y_1-0.5y_2$. $J=\begin{pmatrix}0&1\\-4\cos y_1&-0.5\end{pmatrix}$.
$(0,0)$: $p=-0.5$, $q=4$, $\Delta=0.25-16<0$ → 안정하고 끌어당기는 나선점 (흔들리며 멈춤).
$(\pi,0)$: $J=\begin{pmatrix}0&1\\4&-0.5\end{pmatrix}$, $q=-4<0$ → 안장점 (거꾸로 선 불안정 평형).
선형화가 나선점·안장점이므로 비선형계도 같은 종류입니다.` },
      { sec: '4.5', type: 'mc', lv: 3, q: R`비선형계를 임계점에서 선형화했더니 중심이 나왔다. 원래 비선형계에 대해 옳은 것은?`,
        choices: [R`반드시 중심이다`, R`중심이거나 나선점일 수 있다`, R`반드시 안장점이다`, R`반드시 불안정하다`], ans: 1,
        sol: R`중심은 선형화로 보존되지 않는 경계 경우입니다. 비선형 항에 따라 중심으로 남거나 안정·불안정 나선점이 될 수 있습니다.` },
      { sec: '4.6', type: 'num', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}2&1\\1&2\end{pmatrix}\mathbf y+\begin{pmatrix}3\\0\end{pmatrix}$의 상수 특수해 $\mathbf y^{(p)}$의 첫 성분은?`, ans: '-2', ansTex: R`-2`,
        sol: R`상수해이면 $\mathbf 0=A\mathbf v+\mathbf g$, 즉 $A\mathbf v=(-3,0)$. $\mathbf v=\tfrac13\begin{pmatrix}2&-1\\-1&2\end{pmatrix}\begin{pmatrix}-3\\0\end{pmatrix}=(-2,1)$.` },
      { sec: '4.6', type: 'num', lv: 3, q: R`$\mathbf y'=\begin{pmatrix}-3&1\\1&-3\end{pmatrix}\mathbf y+\begin{pmatrix}0\\5\end{pmatrix}e^{t}$의 특수해 $\mathbf ve^{t}$에서 $v_2$는?`, ans: '4/3', ansTex: R`\tfrac43`,
        sol: R`$1$은 고유값($-2,-4$)이 아니므로 $(I-A)\mathbf v=\mathbf g$. $\begin{pmatrix}4&-1\\-1&4\end{pmatrix}\mathbf v=\begin{pmatrix}0\\5\end{pmatrix}$에서 $\mathbf v=\tfrac1{15}(5,20)=(\tfrac13,\tfrac43)$.` },
      { sec: '4.6', type: 'open', lv: 3, q: R`$\mathbf y'=\begin{pmatrix}-3&1\\1&-3\end{pmatrix}\mathbf y+\begin{pmatrix}-6\\2\end{pmatrix}e^{-2t}$의 특수해를 구하세요.`,
        hint: R`$-2$가 고유값이므로 $\mathbf ute^{-2t}+\mathbf ve^{-2t}$로 둡니다.`,
        sol: R`
$\mathbf y^{(p)}=\mathbf ute^{-2t}+\mathbf ve^{-2t}$를 넣으면 $t$ 항에서 $(A+2I)\mathbf u=\mathbf 0$, 상수항에서 $(A+2I)\mathbf v=\mathbf u-\mathbf g$.
$\mathbf u=a(1,1)$이고 $A+2I=\begin{pmatrix}-1&1\\1&-1\end{pmatrix}$의 두 행이 부호만 반대이므로 우변 $(a+6,\ a-2)$도 그래야 합니다: $a+6=-(a-2)$, $a=-2$.
그러면 $-v_1+v_2=4$이고, 예를 들어 $\mathbf v=(0,4)$.
$$\mathbf y^{(p)}=\begin{pmatrix}-2t\\-2t+4\end{pmatrix}e^{-2t}$$
검산: 첫 성분 $(-2+4t)e^{-2t}=\big[-3(-2t)+(-2t+4)-6\big]e^{-2t}$ ✓` },
    ],
  });
})();
