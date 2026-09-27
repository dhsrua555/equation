/* 08 유체 운동의 미분 방정식 — White 4.1–4.6 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 8, part: 'B', title: '유체 운동의 미분 방정식', en: 'Differential Relations for Fluid Flow', ref: 'White 4.1–4.6', plot: 'flNS',
    fig: R`두 평판 사이 흐름의 속도 분포족. 나비에-스토크스 식의 가장 단순한 정확해들이다`,
    tagline: R`검사 체적을 한없이 작게 줄이면, 적분식은 점마다 성립하는 미분 방정식이 됩니다. 속도장 전체를 구하는 도구입니다.`,
    summary: R`검사 체적 해석은 알짜 힘과 유량만 주고 흐름의 세부는 알려 주지 않습니다. 작은 상자에 같은 법칙을 적용하면 점마다 성립하는 식을 얻습니다. 유체 입자의 가속도는 **물질 도함수** $\dfrac{D\mathbf V}{Dt}=\dfrac{\partial\mathbf V}{\partial t}+(\mathbf V\cdot\nabla)\mathbf V$ — 정상 흐름에서도 대류 항 때문에 가속합니다. 질량 보존은 **연속 방정식** $\partial\rho/\partial t+\nabla\cdot(\rho\mathbf V)=0$, 비압축성이면 $\nabla\cdot\mathbf V=0$. 운동량은 $\rho\,D\mathbf V/Dt=\rho\mathbf g+\nabla\cdot\boldsymbol\tau$이고, 뉴턴 유체의 구성 관계를 넣으면 **나비에-스토크스 식** $\rho\,D\mathbf V/Dt=\rho\mathbf g-\nabla p+\mu\nabla^2\mathbf V$(비압축성, $\mu$ 일정)입니다. 점성을 빼면 오일러 식. 각운동량은 응력 텐서가 대칭임을, 에너지는 온도장의 식을 줍니다. 벽에서 미끄러짐 없음, 자유 표면에서 압력과 전단 조건 같은 **경계 조건**이 있어야 해가 정해집니다.`,
    goals: [
      R`주어진 속도장에서 물질 도함수로 가속도(국소 + 대류)를 계산할 수 있다`,
      R`작은 상자의 질량 수지로 연속 방정식을 유도하고, 비압축성 조건을 확인할 수 있다`,
      R`연속 방정식으로 모르는 속도 성분을 구할 수 있다`,
      R`나비에-스토크스 식의 각 항의 뜻과 가정을 설명할 수 있다`,
      R`벽, 입출구, 자유 표면의 경계 조건을 쓸 수 있다`,
    ],
    secTitles: { '4.1': '가속도장', '4.2': '연속 방정식', '4.3': '나비에-스토크스 식', '4.5': '에너지 방정식', '4.6': '경계 조건' },
    sections: [
      { k: '4.1', p: 230, title: '유체의 가속도장: 물질 도함수', body: R`
속도장 $\mathbf V(x,y,z,t)$에서 입자는 $dt$ 동안 $(u\,dt,v\,dt,w\,dt)$만큼 옮겨 가므로, 입자가 느끼는 속도 변화는 시간 변화와 위치 변화를 모두 담습니다.

:::key 물질 도함수와 가속도
$$\frac{D}{Dt}=\frac{\partial}{\partial t}+u\frac{\partial}{\partial x}+v\frac{\partial}{\partial y}+w\frac{\partial}{\partial z}=\frac{\partial}{\partial t}+(\mathbf V\cdot\nabla)$$
$$\mathbf a=\frac{D\mathbf V}{Dt}=\underbrace{\frac{\partial\mathbf V}{\partial t}}_{\text{국소}}+\underbrace{(\mathbf V\cdot\nabla)\mathbf V}_{\text{대류}}$$
:::

같은 연산자가 온도, 밀도 같은 모든 성질에 쓰입니다: $DT/Dt$는 입자가 느끼는 온도 변화율입니다.

:::ex 예제 1 — 정체점 유동
$u=2x$, $v=-2y$(s⁻¹ 단위 계수)인 정상 흐름에서 점 (1, 1) m의 가속도는?
---
$a_x=u\,\partial u/\partial x+v\,\partial u/\partial y=2x(2)+0=4x$, $a_y=u\,\partial v/\partial x+v\,\partial v/\partial y=0+(-2y)(-2)=4y$.
(1, 1)에서 $\mathbf a=(4,4)$ m/s², 크기 5.66 m/s². 흐름은 정상이지만 입자는 벽 쪽으로 오며 느려지고 옆으로 빠르게 퍼집니다.
:::

:::ex 예제 2 — 노즐의 1차원 근사
노즐 축을 따라 $u=U_0(1+x/L)$이다. $x=L$에서 가속도는?
---
$a_x=u\,du/dx=U_0(1+x/L)(U_0/L)$ → $x=L$에서 $2U_0^2/L$. $U_0=2$ m/s, $L=1$ m이면 8 m/s².
:::
` },
      { k: '4.2', p: 232, title: '질량 보존: 연속 방정식', body: R`
크기 $dx\times dy\times dz$인 고정 상자에서, $x$ 방향으로 나가는 질량 유량과 들어오는 유량의 차이는 $\dfrac{\partial(\rho u)}{\partial x}dx\,dy\,dz$입니다. 세 방향을 더한 알짜 유출이 상자 안 질량의 감소율과 같습니다.

:::fig fBox
:::

:::key 연속 방정식
$$\frac{\partial\rho}{\partial t}+\nabla\cdot(\rho\mathbf V)=0\qquad\Longleftrightarrow\qquad\frac{D\rho}{Dt}+\rho\,\nabla\cdot\mathbf V=0$$
비압축성($D\rho/Dt=0$): $\nabla\cdot\mathbf V=\dfrac{\partial u}{\partial x}+\dfrac{\partial v}{\partial y}+\dfrac{\partial w}{\partial z}=0$.
원통 좌표: $\dfrac1r\dfrac{\partial(rv_r)}{\partial r}+\dfrac1r\dfrac{\partial v_\theta}{\partial\theta}+\dfrac{\partial v_z}{\partial z}=0$.
:::

$\nabla\cdot\mathbf V$는 입자 부피의 상대 팽창률입니다. 비압축성은 “입자의 부피가 변하지 않는다”는 뜻이지 밀도가 어디서나 같다는 뜻은 아닙니다(층을 이룬 바닷물).

:::ex 예제 3 — 모르는 성분 찾기
비압축성 2차원 흐름에서 $u=3x^2-y^2$이고 $v(x,0)=0$이다. $v$는?
---
$\partial v/\partial y=-\partial u/\partial x=-6x$ → $v=-6xy+f(x)$. $v(x,0)=0$에서 $f=0$, $v=-6xy$.
:::

:::ex 예제 4 — 압축성 흐름
밀도가 공간에서 고른($\rho=1.2$ kg/m³) 순간, 속도가 $u=-10x$ (s⁻¹)로 압축되고 있다. 밀도 변화율은?
---
$\partial\rho/\partial t=-\rho\,\partial u/\partial x-u\,\partial\rho/\partial x=-1.2(-10)-0=12$ kg/(m³·s). 압축되는 곳에서 밀도가 올라갑니다.
:::
` },
      { k: '4.3', p: 238, title: '운동량: 오일러 식과 나비에-스토크스 식', body: R`
작은 상자에 뉴턴의 제2법칙을 쓰면, 표면력은 면마다 다른 응력의 **차이**로 들어옵니다.
$$\rho\frac{D\mathbf V}{Dt}=\rho\mathbf g+\nabla\cdot\boldsymbol\tau_{ij}$$
$\boldsymbol\tau_{ij}$는 압력과 점성 응력을 함께 담은 응력 텐서입니다(고체역학의 응력 텐서와 같은 대상[[@solid:ch02:1.4|응력 텐서. 한 점의 응력은 아홉 성분의 텐서이고, 모멘트 평형에서 대칭입니다.]]).

:::key 오일러 식 (비점성)
$$\rho\frac{D\mathbf V}{Dt}=\rho\mathbf g-\nabla p$$
:::

뉴턴 유체에서 응력은 압력과 변형률 속도에 비례하는 점성 응력의 합입니다(비압축성).
$$\tau_{xx}=-p+2\mu\frac{\partial u}{\partial x},\qquad\tau_{xy}=\mu\Big(\frac{\partial u}{\partial y}+\frac{\partial v}{\partial x}\Big),\ \dots$$

:::key 나비에-스토크스 식 (비압축성, μ 일정)
$$\rho\frac{D\mathbf V}{Dt}=\rho\mathbf g-\nabla p+\mu\nabla^2\mathbf V$$
$x$ 성분: $\rho\Big(\dfrac{\partial u}{\partial t}+u\dfrac{\partial u}{\partial x}+v\dfrac{\partial u}{\partial y}+w\dfrac{\partial u}{\partial z}\Big)=\rho g_x-\dfrac{\partial p}{\partial x}+\mu\Big(\dfrac{\partial^2u}{\partial x^2}+\dfrac{\partial^2u}{\partial y^2}+\dfrac{\partial^2u}{\partial z^2}\Big)$.
미지수 $u,v,w,p$ 넷에 식이 넷(연속 + 운동량 셋)이라 닫혀 있다.
:::

왼쪽의 대류 항 $(\mathbf V\cdot\nabla)\mathbf V$가 비선형이라 일반해가 없습니다. 그래서 대류 항이 사라지는 특별한 흐름(9단원의 평판·관 흐름), 점성을 무시한 흐름(퍼텐셜 유동), 벽 근처만 다루는 근사(경계층)로 나누어 풉니다.

:::note 각운동량 방정식이 주는 것 (White 4.4)
작은 상자의 각운동량 방정식은 새로운 식을 주지 않고, 상자가 작아질 때 $\tau_{xy}=\tau_{yx}$ 같은 **응력 텐서의 대칭**만 남깁니다. 고체에서와 같은 결론입니다.
:::

:::ex 예제 5 — 평판 사이의 흐름 확인
두 평판($y=\pm h$) 사이의 정상 흐름 $u=U_0(1-y^2/h^2)$, $v=w=0$에서 압력 기울기는? ($U_0=0.5$ m/s, $h=1$ cm, $\mu=0.001$ Pa·s)
---
연속: $\partial u/\partial x=0$ ✓. $x$ 운동량에서 대류 항은 $u\,\partial u/\partial x=0$, 남는 것은 $0=-\partial p/\partial x+\mu\,d^2u/dy^2$.
$d^2u/dy^2=-2U_0/h^2$ → $\partial p/\partial x=-2\mu U_0/h^2=-2(0.001)(0.5)/10^{-4}=-10$ Pa/m.
:::
` },
      { k: '4.5', p: 246, title: '에너지 방정식', body: R`
같은 방법으로 제1법칙을 작은 상자에 쓰면, 열전도(푸리에 법칙 $\mathbf q=-k\nabla T$)와 점성 소산이 들어간 온도의 식을 얻습니다. 비압축성에 가깝고 물성이 일정하면

:::key 에너지 방정식 (비압축성 근사)
$$\rho c_p\frac{DT}{Dt}=k\nabla^2T+\Phi,\qquad\Phi=\mu\Big[2\Big(\frac{\partial u}{\partial x}\Big)^2+2\Big(\frac{\partial v}{\partial y}\Big)^2+2\Big(\frac{\partial w}{\partial z}\Big)^2+\Big(\frac{\partial u}{\partial y}+\frac{\partial v}{\partial x}\Big)^2+\cdots\Big]$$
점성 소산 $\Phi$는 제곱의 합이라 **항상 0 이상**이다. 점성은 운동에너지를 열로 바꿀 뿐 되돌리지 않는다.
:::

밀도와 점성이 온도에 거의 무관하면 속도장(연속 + 운동량)을 먼저 풀고, 그 결과를 넣어 온도장을 나중에 풉니다(결합이 한 방향).
` },
      { k: '4.6', p: 249, title: '경계 조건', body: R`
미분 방정식의 해를 하나로 정하는 것은 경계 조건입니다.

:::key 대표적인 경계 조건
- **고체 벽**: 미끄러짐 없음 $\mathbf V_{\text{유체}}=\mathbf V_{\text{벽}}$, 온도 $T_{\text{유체}}=T_{\text{벽}}$(또는 열유속 지정).
- **입구·출구**: 속도(또는 압력)와 온도 분포를 지정.
- **자유 표면**(액체-기체): 운동학 조건 — 표면의 입자는 표면에 남는다, $w=D\eta/Dt$. 역학 조건 — 압력이 기체의 압력과 같고(표면장력이 있으면 $\Delta p=Y(1/R_1+1/R_2)$만큼 차이), 전단 응력은 거의 0.
:::

:::ex 예제 6
반지름 10 cm 축이 300 rpm으로 돌고 있다. 축 표면에 닿은 기름의 속도는?
---
미끄러짐 없음: $v_\theta=R\omega=0.1(31.4)=3.14$ m/s(원주 방향).
:::

:::tip 비점성 흐름의 경계 조건
점성을 빼면 방정식의 차수가 낮아져 조건 하나를 버려야 합니다. 비점성 해석에서는 벽에서 **법선 속도만 0**($\mathbf V\cdot\mathbf n=0$)으로 두고 미끄러짐을 허용합니다. 벽 근처의 얇은 층(경계층, 13단원)이 그 차이를 메웁니다.
:::
` },
    ],
    problems: [
      { sec: '4.1', type: 'num', lv: 1, q: R`정상 흐름 $u=2x$, $v=-2y$에서 점 (1, 1)의 가속도 크기(m/s²)는?`, ans: 'sqrt(32)', ansTex: R`5.66`,
        sol: R`$\mathbf a=(4x,4y)=(4,4)$, 크기 $4\sqrt2$.` },
      { sec: '4.1', type: 'num', lv: 2, q: R`노즐 축을 따라 $u=U_0(1+x/L)$, $U_0=2$ m/s, $L=1$ m이다. $x=L$에서 가속도(m/s²)는?`, ans: '8', ansTex: R`8`,
        sol: R`$u\,du/dx=2U_0^2/L=8$.` },
      { sec: '4.1', type: 'num', lv: 2, q: R`속도장 $u=xt$, $v=-yt$에서 점 (1, 0), $t=2$ s의 $a_x$는?`, ans: '5', ansTex: R`5`,
        sol: R`$a_x=\partial u/\partial t+u\,\partial u/\partial x=x+(xt)(t)=1+4=5$.` },
      { sec: '4.1', type: 'mc', lv: 1, q: R`정상 흐름에 대해 옳은 것은?`,
        choices: [R`유체 입자의 가속도는 항상 0이다`, R`국소 가속도는 0이지만 대류 가속도는 0이 아닐 수 있다`, R`대류 가속도는 0이지만 국소 가속도는 0이 아닐 수 있다`, R`유선과 경로선이 다르다`], ans: 1,
        sol: R`정상이면 $\partial\mathbf V/\partial t=0$이지만 입자가 속도가 다른 곳으로 옮겨 가면 가속합니다(노즐).` },
      { sec: '4.2', type: 'mc', lv: 2, q: R`다음 중 비압축성 연속 방정식을 만족하는 2차원 속도장은?`,
        choices: [R`$u=x^2,\ v=y^2$`, R`$u=2xy,\ v=-y^2$`, R`$u=x,\ v=y$`, R`$u=y,\ v=x^2+y$`], ans: 1,
        sol: R`$\partial u/\partial x+\partial v/\partial y=2y-2y=0$.` },
      { sec: '4.2', type: 'num', lv: 2, q: R`비압축성 2차원 흐름에서 $u=3x^2-y^2$, $v(x,0)=0$이다. 점 (1, 2)의 $v$는?`, ans: '-12', ansTex: R`-12`,
        sol: R`$v=-6xy=-12$.` },
      { sec: '4.2', type: 'num', lv: 2, q: R`밀도가 공간에서 고른($1.2$ kg/m³) 순간 $u=-10x$ (s⁻¹), $v=w=0$이다. $\partial\rho/\partial t$ (kg/(m³·s))는?`, ans: '12', ansTex: R`12`,
        sol: R`$-\rho\,\partial u/\partial x=12$.` },
      { sec: '4.2', type: 'mc', lv: 2, q: R`원통 좌표에서 $v_r=C/r$, $v_\theta=v_z=0$인 흐름(원점 제외)에 대해 옳은 것은?`,
        choices: [R`압축성이다`, R`비압축성 연속 방정식을 만족한다`, R`$C$가 음수일 때만 비압축성이다`, R`회전 흐름이다`], ans: 1,
        sol: R`$\frac1r\partial(rv_r)/\partial r=\frac1r\partial C/\partial r=0$. 원점에서 솟아나는 선 원천입니다.` },
      { sec: '4.3', type: 'num', lv: 2, q: R`두 평판($y=\pm h$) 사이 정상 흐름 $u=U_0(1-y^2/h^2)$에서 $U_0=0.5$ m/s, $h=0.01$ m, $\mu=0.001$ Pa·s일 때 $\partial p/\partial x$ (Pa/m)는?`, ans: '-10', ansTex: R`-10`,
        sol: R`$\partial p/\partial x=\mu\,d^2u/dy^2=-2\mu U_0/h^2=-10$ Pa/m.` },
      { sec: '4.3', type: 'mc', lv: 2, q: R`비압축성 나비에-스토크스 식 $\rho D\mathbf V/Dt=\rho\mathbf g-\nabla p+\mu\nabla^2\mathbf V$의 가정이 **아닌** 것은?`,
        choices: [R`뉴턴 유체`, R`점성 계수 일정`, R`비압축성`, R`비회전 흐름`], ans: 3,
        sol: R`회전 여부는 가정이 아닙니다. 비회전을 가정하면 점성 항의 역할이 달라지는데, 그것은 퍼텐셜 유동(9, 15단원)의 이야기입니다.` },
      { sec: '4.3', type: 'mc', lv: 1, q: R`나비에-스토크스 식에 일반해가 없는 주된 이유는?`,
        choices: [R`미지수가 식보다 많다`, R`대류 가속도 항 $(\mathbf V\cdot\nabla)\mathbf V$가 비선형이다`, R`압력 항이 있다`, R`중력 항이 있다`], ans: 1,
        sol: R`식의 수는 미지수와 같습니다. 비선형 대류 항이 중첩을 막고 난류 같은 복잡한 해를 낳습니다.` },
      { sec: '4.5', type: 'mc', lv: 2, q: R`점성 소산 함수 $\Phi$에 대해 옳은 것은?`,
        choices: [R`음수일 수 있다`, R`제곱의 합이라 항상 0 이상이다`, R`비점성 흐름에서 가장 크다`, R`압력에 비례한다`], ans: 1,
        sol: R`$\Phi$는 변형률 속도 성분의 제곱의 합에 $\mu$를 곱한 것입니다. 점성은 역학적 에너지를 열로만 바꿉니다.` },
      { sec: '4.6', type: 'num', lv: 1, q: R`반지름 10 cm 축이 300 rpm으로 돈다. 축 표면에 닿은 기름의 속도(m/s)는?`, ans: '0.1*300*2*pi/60', ansTex: R`3.14`,
        sol: R`미끄러짐 없음: $R\omega=3.14$ m/s.` },
      { sec: '4.6', type: 'mc', lv: 2, q: R`표면장력을 무시할 때 물-공기 자유 표면의 역학적 경계 조건은?`,
        choices: [R`속도 0`, R`압력이 대기압과 같고 전단 응력이 거의 0`, R`온도가 일정`, R`법선 속도 0`], ans: 1,
        sol: R`공기의 점성이 작아 표면을 끄는 전단이 작고, 압력은 연속입니다.` },
      { sec: '4.2', type: 'open', lv: 2, proof: true, q: R`크기 $dx\times dy\times dz$인 고정된 작은 상자에 질량 보존을 적용해 연속 방정식 $\partial\rho/\partial t+\nabla\cdot(\rho\mathbf V)=0$을 유도하고, 비압축성이면 $\nabla\cdot\mathbf V=0$이 됨을 보이세요.`,
        sol: R`
상자 안 질량 $\rho\,dx\,dy\,dz$의 변화율: $\dfrac{\partial\rho}{\partial t}dx\,dy\,dz$.
$x$ 방향: 왼쪽 면으로 $\rho u\,dy\,dz$ 유입, 오른쪽 면으로 $\big[\rho u+\frac{\partial(\rho u)}{\partial x}dx\big]dy\,dz$ 유출(테일러 전개의 1차 항). 알짜 유출 $\frac{\partial(\rho u)}{\partial x}dx\,dy\,dz$. $y,z$도 같음.
질량 보존(변화율 + 알짜 유출 = 0): $\Big[\dfrac{\partial\rho}{\partial t}+\dfrac{\partial(\rho u)}{\partial x}+\dfrac{\partial(\rho v)}{\partial y}+\dfrac{\partial(\rho w)}{\partial z}\Big]dx\,dy\,dz=0$ → 연속 방정식.
곱의 미분으로 풀면 $\dfrac{\partial\rho}{\partial t}+\mathbf V\cdot\nabla\rho+\rho\nabla\cdot\mathbf V=\dfrac{D\rho}{Dt}+\rho\nabla\cdot\mathbf V=0$. 비압축성은 $D\rho/Dt=0$(입자의 밀도 불변)이므로 $\nabla\cdot\mathbf V=0$.`,
        rubric: R`
- 상자 안 질량 변화율 — 2점
- 면마다 유출입과 테일러 전개 — 4점
- 합산과 극한 — 2점
- 물질 도함수 형태와 비압축성 — 2점` },
    ],
  });
})();
