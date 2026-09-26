/* 추가 연습문제 — 06 행렬과 연립일차방정식 (Kreyszig 7.1–7.8). 같은 유형으로 새로 만든 문제입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 6,
    secTitles: { '7.1': '덧셈·스칼라배', '7.2': '행렬 곱', '7.3': '가우스 소거법', '7.4': '일차독립·계수', '7.5': '해의 존재·유일성', '7.7': '행렬식·크래머', '7.8': '역행렬' },
    secs: ['7.7', '7.2', '7.4', '7.5', '7.8', '7.3', '7.7', '7.5', '7.4', '7.7', '7.3'],
    problems: [
      { sec: '7.1', type: 'num', lv: 1, q: R`$A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$, $B=\begin{pmatrix}0&-1\\5&2\end{pmatrix}$일 때 $2A-B$의 (2,1) 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$2\cdot3-5=1$.` },
      { sec: '7.1', type: 'mc', lv: 1, q: R`$A=\begin{pmatrix}1&4\\2&3\end{pmatrix}$를 대칭 부분과 반대칭 부분의 합으로 쓸 때 대칭 부분은?`,
        choices: [R`$\begin{pmatrix}1&3\\3&3\end{pmatrix}$`, R`$\begin{pmatrix}1&4\\4&3\end{pmatrix}$`, R`$\begin{pmatrix}1&2\\2&3\end{pmatrix}$`, R`$\begin{pmatrix}0&1\\-1&0\end{pmatrix}$`], ans: 0,
        sol: R`$\tfrac12(A+A^T)=\tfrac12\begin{pmatrix}2&6\\6&6\end{pmatrix}$. 반대칭 부분은 $\begin{pmatrix}0&1\\-1&0\end{pmatrix}$.` },
      { sec: '7.2', type: 'num', lv: 1, q: R`$\begin{pmatrix}1&2\\3&4\end{pmatrix}\begin{pmatrix}5\\6\end{pmatrix}$의 둘째 성분은?`, ans: '39', ansTex: R`39`,
        sol: R`$3\cdot5+4\cdot6=39$. (첫째 성분은 17)` },
      { sec: '7.2', type: 'num', lv: 2, q: R`$A=\begin{pmatrix}1&1\\0&1\end{pmatrix}$일 때 $A^{10}$의 (1,2) 성분은?`, ans: '10', ansTex: R`10`,
        sol: R`귀납적으로 $A^n=\begin{pmatrix}1&n\\0&1\end{pmatrix}$ (곱할 때마다 오른쪽 위에 1씩 더해짐).` },
      { sec: '7.2', type: 'mc', lv: 2, q: R`다음 중 $A\ne0$, $B\ne0$인데 $AB=0$인 쌍은?`,
        choices: [R`$A=\begin{pmatrix}1&1\\1&1\end{pmatrix},\ B=\begin{pmatrix}1&-1\\-1&1\end{pmatrix}$`, R`$A=\begin{pmatrix}1&2\\3&4\end{pmatrix},\ B=I$`, R`$A=\begin{pmatrix}1&1\\0&1\end{pmatrix},\ B=\begin{pmatrix}1&-1\\0&1\end{pmatrix}$`, R`$A=\begin{pmatrix}2&0\\0&3\end{pmatrix},\ B=\begin{pmatrix}1&1\\1&1\end{pmatrix}$`], ans: 0,
        sol: R`①: 각 행 $(1,1)$과 각 열 $(1,-1)^T$의 내적이 0이라 $AB=0$. ③은 $AB=I$입니다. 행렬에서는 $AB=0$이어도 $A=0$ 또는 $B=0$이 아닐 수 있습니다.` },
      { sec: '7.2', type: 'num', lv: 2, q: R`$A=\begin{pmatrix}1&2\\0&1\end{pmatrix}$, $B=\begin{pmatrix}3&0\\1&2\end{pmatrix}$일 때 $\tr(BA)$는?`, ans: '7', ansTex: R`7`,
        sol: R`$BA=\begin{pmatrix}3&6\\1&4\end{pmatrix}$이므로 7. $AB=\begin{pmatrix}5&4\\1&2\end{pmatrix}$도 대각합 7로, $AB\ne BA$여도 $\tr(AB)=\tr(BA)$입니다.` },
      { sec: '7.2', type: 'mc', lv: 2, q: R`정사각행렬 $A,B$에 대해 $(A+B)^2$와 항상 같은 것은?`,
        choices: [R`$A^2+2AB+B^2$`, R`$A^2+AB+BA+B^2$`, R`$A^2+B^2$`, R`$A^2+2BA+B^2$`], ans: 1,
        sol: R`$(A+B)(A+B)=A^2+AB+BA+B^2$. $AB=BA$일 때만 $2AB$로 합칠 수 있습니다.` },
      { sec: '7.3', type: 'num', lv: 1, q: R`$x+2y=5,\ 3x-y=1$의 해에서 $x+y$는?`, ans: '3', ansTex: R`3`,
        sol: R`둘째 식에서 $y=3x-1$, 첫째에 넣으면 $7x-2=5$, $x=1$, $y=2$.` },
      { sec: '7.3', type: 'num', lv: 2, q: R`$x+y+z=6,\ x+2y+3z=14,\ x+4y+9z=36$의 해에서 $z$는?`, ans: '3', ansTex: R`3`,
        sol: R`$R_2-R_1$: $y+2z=8$. $R_3-R_1$: $3y+8z=30$. $y=8-2z$를 넣으면 $24+2z=30$, $z=3$, $y=2$, $x=1$.` },
      { sec: '7.3', type: 'mc', lv: 1, q: R`가우스 소거 결과 첨가행렬에 $[\,0\ \ 0\ \ 0\ \ |\ \ 1\,]$ 행이 나왔다. 옳은 것은?`,
        choices: [R`해가 없다`, R`해가 유일하다`, R`해가 무수히 많다`, R`자명해만 있다`], ans: 0,
        sol: R`$0x+0y+0z=1$이라는 모순 식이므로 연립방정식은 해가 없습니다.` },
      { sec: '7.3', type: 'open', lv: 2, q: R`$x_1-x_2+2x_3=1,\ 2x_1-x_2+3x_3=4,\ x_1+x_3=3$의 일반해를 구하세요.`,
        sol: R`
$$\left[\begin{array}{ccc|c}1&-1&2&1\\2&-1&3&4\\1&0&1&3\end{array}\right]\to\left[\begin{array}{ccc|c}1&-1&2&1\\0&1&-1&2\\0&1&-1&2\end{array}\right]\to\left[\begin{array}{ccc|c}1&-1&2&1\\0&1&-1&2\\0&0&0&0\end{array}\right]$$
계수 2이므로 $x_3=t$: $x_2=2+t$, $x_1=1+x_2-2x_3=3-t$.
$$\mathbf x=(3,2,0)+t(-1,1,1)$$` },
      { sec: '7.4', type: 'num', lv: 2, q: R`$\operatorname{rank}\begin{pmatrix}1&2&3&4\\2&4&6&8\\1&1&1&1\end{pmatrix}$은?`, ans: '2', ansTex: R`2`,
        sol: R`둘째 행은 첫째 행의 2배, 첫째와 셋째 행은 비례하지 않으므로 계수 2.` },
      { sec: '7.4', type: 'num', lv: 1, q: R`$\begin{pmatrix}1&2\\2&k\end{pmatrix}$의 계수가 1이 되는 $k$는?`, ans: '4', ansTex: R`4`,
        sol: R`두 행이 비례하려면 $\det=k-4=0$.` },
      { sec: '7.4', type: 'mc', lv: 2, q: R`$(1,0,1)$, $(0,1,1)$, $(1,1,2)$가 생성하는 공간의 차원은?`,
        choices: [R`1`, R`2`, R`3`, R`0`], ans: 1,
        sol: R`셋째 벡터는 앞 두 벡터의 합이고, 앞 두 벡터는 독립이므로 차원 2 (평면).` },
      { sec: '7.4', type: 'mc', lv: 1, q: R`$\mathbb R^3$의 벡터 4개에 대해 옳은 것은?`,
        choices: [R`항상 일차종속이다`, R`항상 일차독립이다`, R`영벡터가 없으면 독립이다`, R`서로 수직이면 독립이다`], ans: 0,
        sol: R`성분이 $n$개인 벡터는 $n+1$개 이상이면 항상 종속입니다(계수는 3을 넘을 수 없음).` },
      { sec: '7.5', type: 'mc', lv: 2, q: R`$3\times3$ 행렬 $A$에 대해 $\operatorname{rank}A=2$, $\operatorname{rank}[A\ \mathbf b]=3$이면?`,
        choices: [R`해가 없다`, R`해가 유일하다`, R`자유변수 1개로 무수히 많다`, R`자유변수 2개로 무수히 많다`], ans: 0,
        sol: R`첨가행렬의 계수가 더 크면 모순 식이 생겨 해가 없습니다.` },
      { sec: '7.5', type: 'num', lv: 3, q: R`$x+y+kz=1,\ x+ky+z=1,\ kx+y+z=1$이 해를 무수히 많이 갖는 $k$는?`, ans: '1', ansTex: R`1`,
        sol: R`
계수 행렬식 $=-(k-1)^2(k+2)$. 해가 유일하지 않은 것은 $k=1$ 또는 $k=-2$.
$k=1$: 세 식이 모두 $x+y+z=1$ → 무수히 많음. $k=-2$: 세 식을 더하면 $0=3$ → 해 없음.` },
      { sec: '7.5', type: 'num', lv: 2, q: R`미지수 5개, 방정식 3개인 동차 연립방정식의 해공간의 차원은 최소 얼마인가?`, ans: '2', ansTex: R`2`,
        sol: R`계수는 최대 3이므로 $\operatorname{nullity}=5-\operatorname{rank}\ge2$. 항상 자명하지 않은 해가 있습니다.` },
      { sec: '7.7', type: 'num', lv: 1, q: R`$\det\begin{pmatrix}1&0&2\\0&3&0\\4&0&5\end{pmatrix}$은?`, ans: '-9', ansTex: R`-9`,
        sol: R`둘째 행으로 전개: $3\cdot\det\begin{pmatrix}1&2\\4&5\end{pmatrix}=3(5-8)=-9$.` },
      { sec: '7.7', type: 'num', lv: 2, q: R`$\det\begin{pmatrix}2&1&0&3\\0&-1&4&1\\0&0&3&2\\0&0&0&\tfrac12\end{pmatrix}$은?`, ans: '-3', ansTex: R`-3`,
        sol: R`위삼각행렬이므로 대각성분의 곱 $2\cdot(-1)\cdot3\cdot\tfrac12=-3$.` },
      { sec: '7.7', type: 'num', lv: 2, q: R`$3\times3$ 행렬 $A$의 행렬식이 5이다. 두 행을 바꾸고 한 행에 3을 곱한 행렬 $B$의 행렬식은?`, ans: '-15', ansTex: R`-15`,
        sol: R`행 교환으로 $-5$, 한 행에 3을 곱해 $-15$.` },
      { sec: '7.7', type: 'num', lv: 2, q: R`$\det\begin{pmatrix}1&1&1\\1&2&3\\1&4&9\end{pmatrix}$은?`, ans: '2', ansTex: R`2`,
        sol: R`첫 행 전개: $(18-12)-(9-3)+(4-2)=2$. 방데르몽드 행렬식 $(2-1)(3-1)(3-2)=2$와 같습니다.` },
      { sec: '7.7', type: 'num', lv: 3, q: R`크래머 공식으로 $x+y=3,\ y+z=5,\ x+z=4$를 풀 때 $y$는?`, ans: '2', ansTex: R`2`,
        sol: R`
$D=\det\begin{pmatrix}1&1&0\\0&1&1\\1&0&1\end{pmatrix}=2$, $D_2=\det\begin{pmatrix}1&3&0\\0&5&1\\1&4&1\end{pmatrix}=1(5-4)-3(0-1)=4$. $y=4/2=2$.
(세 식을 더하면 $x+y+z=6$이라 $x=1$, $y=2$, $z=3$으로도 확인)` },
      { sec: '7.8', type: 'num', lv: 2, q: R`$A=\begin{pmatrix}1&2&0\\0&1&0\\0&0&2\end{pmatrix}$일 때 $A^{-1}$의 (1,2) 성분은?`, ans: '-2', ansTex: R`-2`,
        sol: R`블록 대각: $\begin{pmatrix}1&2\\0&1\end{pmatrix}^{-1}=\begin{pmatrix}1&-2\\0&1\end{pmatrix}$, 나머지 블록은 $\tfrac12$.` },
      { sec: '7.8', type: 'open', lv: 2, q: R`가우스–조르단 소거로 $A=\begin{pmatrix}2&1\\1&1\end{pmatrix}$의 역행렬을 구하세요.`,
        sol: R`
$$\left[\begin{array}{cc|cc}2&1&1&0\\1&1&0&1\end{array}\right]\to\left[\begin{array}{cc|cc}1&1&0&1\\2&1&1&0\end{array}\right]\to\left[\begin{array}{cc|cc}1&1&0&1\\0&-1&1&-2\end{array}\right]\to\left[\begin{array}{cc|cc}1&0&1&-1\\0&1&-1&2\end{array}\right]$$
$A^{-1}=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}$. ($\det A=1$이므로 2×2 공식과 일치)` },
      { sec: '7.8', type: 'num', lv: 2, q: R`$A=\operatorname{diag}(2,4,5)$일 때 $\tr(A^{-1})$은?`, ans: '19/20', ansTex: R`\tfrac{19}{20}`,
        sol: R`대각행렬의 역행렬은 대각성분의 역수: $\tfrac12+\tfrac14+\tfrac15=\tfrac{19}{20}$.` },
      { sec: '7.8', type: 'mc', lv: 2, q: R`가역행렬 $A$에 대해 $(A^T)^{-1}$과 같은 것은?`,
        choices: [R`$(A^{-1})^T$`, R`$A$`, R`$-A^{-1}$`, R`$A^TA$`], ans: 0,
        sol: R`$A^T(A^{-1})^T=(A^{-1}A)^T=I^T=I$이므로 $(A^T)^{-1}=(A^{-1})^T$.` },
    ],
  });
})();
