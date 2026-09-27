/* 05 검사 체적과 질량 보존 — White 3.1–3.3 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 5, part: 'B', title: '검사 체적과 질량 보존', en: 'Control Volumes & Conservation of Mass', ref: 'White 3.1–3.3', plot: 'flRTT',
    fig: R`점선 상자(검사 체적)를 지나가는 유선들. 상자 안에 쌓이지 않는 한 들어온 만큼 나간다`,
    tagline: R`흘러가는 유체 덩어리를 끝까지 쫓는 대신, 공간에 창문을 하나 정해 두고 그 창을 드나드는 양을 셉니다.`,
    summary: R`역학의 기본 법칙(질량, 운동량, 각운동량, 에너지)은 정해진 입자들의 모임인 **계(system)**에 대해 쓰여 있습니다. 유체는 입자들이 흩어져 계를 따라가기 어려우므로 공간에 고정한 영역인 **검사 체적(control volume)**을 씁니다. 둘을 잇는 다리가 **레이놀즈 수송 정리** $\dfrac{dB_{\text{계}}}{dt}=\dfrac{d}{dt}\displaystyle\int_{CV}\beta\rho\,d\mathcal V+\int_{CS}\beta\rho(\mathbf V\cdot\mathbf n)\,dA$입니다. 계의 변화율은 검사 체적 안에 쌓이는 양과 검사면을 통해 빠져나가는 알짜 양의 합입니다. $B$를 질량으로 두면 질량 보존: 정상 흐름에서 $\sum\dot m_{\text{in}}=\sum\dot m_{\text{out}}$, 1차원 입출구에서 $\rho_1A_1V_1=\rho_2A_2V_2$, 탱크처럼 쌓이는 경우 $dm_{CV}/dt=\sum\dot m_{\text{in}}-\sum\dot m_{\text{out}}$.`,
    goals: [
      R`계와 검사 체적의 차이를 설명하고, 문제에 맞는 검사 체적을 고를 수 있다`,
      R`속도 분포를 적분해 체적 유량, 질량 유량, 평균 속도를 구할 수 있다`,
      R`레이놀즈 수송 정리의 각 항의 뜻을 설명하고 1차원 입출구 형태로 쓸 수 있다`,
      R`정상 흐름의 질량 보존으로 관과 분기관의 속도를 구할 수 있다`,
      R`탱크의 수위 변화처럼 비정상 흐름의 질량 수지를 세우고 풀 수 있다`,
    ],
    secTitles: { '3.1': '계와 검사 체적', '3.2': '레이놀즈 수송 정리', '3.3a': '정상 흐름의 질량 보존', '3.3b': '비정상 흐름의 질량 보존' },
    sections: [
      { k: '3.1', p: 139, title: '계와 검사 체적, 그리고 유량', body: R`
질점역학과 고체역학에서는 정해진 물체를 따라가며 법칙을 적용했습니다. 유체에서 “정해진 입자들의 모임” — **계** — 는 흐르면서 늘어나고 찢어져 모양을 쫓기 어렵습니다. 그래서 대부분의 공학 문제는 공간에 고정한 영역, **검사 체적**(CV)과 그 경계인 **검사면**(CS)을 기준으로 풉니다. 기본 법칙 넷은 모두 계에 대한 것입니다.

$$\frac{dm}{dt}\Big|_{\text{계}}=0,\qquad\sum\mathbf F=\frac{d(m\mathbf V)}{dt}\Big|_{\text{계}},\qquad\sum\mathbf M_O=\frac{d\mathbf H_O}{dt}\Big|_{\text{계}},\qquad\dot Q-\dot W=\frac{dE}{dt}\Big|_{\text{계}}$$

검사면을 통해 드나드는 양을 세려면 한 면을 지나는 유량이 필요합니다. 넓이 요소 $dA$의 바깥 법선을 $\mathbf n$이라 하면 $dt$ 동안 지나가는 유체는 밑넓이 $dA$, 높이 $(\mathbf V\cdot\mathbf n)dt$인 기울어진 기둥입니다.

:::key 체적 유량과 질량 유량
$$Q=\int_A(\mathbf V\cdot\mathbf n)\,dA,\qquad\dot m=\int_A\rho(\mathbf V\cdot\mathbf n)\,dA,\qquad V_{\text{평균}}=\frac QA$$
면에 나란한 속도 성분은 면을 지나가지 않는다. 밀도가 일정하면 $\dot m=\rho Q$.
:::

:::ex 예제 1 — 층류 관 유동
반지름 $R$인 관에서 속도가 $u=u_{\max}(1-r^2/R^2)$이다. 유량과 평균 속도는?
---
고리 넓이 $dA=2\pi r\,dr$에서 $Q=\displaystyle\int_0^R u_{\max}\Big(1-\frac{r^2}{R^2}\Big)2\pi r\,dr=2\pi u_{\max}\Big(\frac{R^2}2-\frac{R^2}4\Big)=\frac{\pi R^2u_{\max}}2$.
$V_{\text{평균}}=Q/(\pi R^2)=u_{\max}/2$. 층류에서 평균 속도는 중심 속도의 절반입니다.
:::

:::ex 예제 2 — 비스듬한 면
균일한 속도 3 m/s가 넓이 0.5 m²인 평면을 지난다. 평면의 법선이 흐름과 60°를 이룰 때 유량은?
---
$Q=VA\cos60°=3(0.5)(0.5)=0.75$ m³/s. 흐름에 수직인 면으로 투영한 넓이 $A\cos\theta$만 셉니다.
:::
` },
      { k: '3.2', p: 143, title: '레이놀즈 수송 정리', body: R`
계의 임의의 성질 $B$(질량, 운동량, 에너지…)와 그 단위 질량당 값 $\beta=dB/dm$을 생각합니다. 시각 $t$에 계와 검사 체적이 겹치도록 잡으면, $dt$ 뒤 계는 출구로 조금 빠져나가고 입구 쪽 뒤에 빈자리를 남깁니다. 그래서
$$B_{\text{계}}(t+dt)=B_{CV}(t+dt)+(\text{출구로 나간 몫})-(\text{입구로 들어온 몫}).$$
$B_{\text{계}}(t)=B_{CV}(t)$를 빼고 $dt$로 나누면 다음을 얻습니다.

:::key 레이놀즈 수송 정리 (고정 검사 체적)
$$\frac{dB_{\text{계}}}{dt}=\frac{d}{dt}\int_{CV}\beta\rho\,d\mathcal V+\int_{CS}\beta\rho(\mathbf V\cdot\mathbf n)\,dA$$
첫째 항은 검사 체적 안에 쌓이는 비율, 둘째 항은 검사면을 통한 알짜 유출(유출은 $\mathbf V\cdot\mathbf n>0$, 유입은 $<0$).
:::

:::fig fCV
:::

:::key 1차원 입출구
각 입출구에서 성질이 단면에 고르게 퍼져 있고 흐름이 단면에 수직이면
$$\int_{CS}\beta\rho(\mathbf V\cdot\mathbf n)\,dA=\sum_{\text{out}}\beta_i\dot m_i-\sum_{\text{in}}\beta_i\dot m_i$$
:::

**움직이는 검사 체적**(속도 $\mathbf V_s$로 평행 이동)에서는 둘째 항의 속도를 상대 속도 $\mathbf V_r=\mathbf V-\mathbf V_s$로 바꿉니다. 유체가 면을 가로지르는 것은 면에 대한 상대 운동이기 때문입니다. 모양이 변하는 검사 체적(부푸는 풍선)에서는 첫째 항을 시간에 따라 바뀌는 영역에서 적분합니다.

| $B$ | $\beta=dB/dm$ | 얻는 식 |
|---|---|---|
| 질량 $m$ | 1 | 질량 보존 (3.3) |
| 운동량 $m\mathbf V$ | $\mathbf V$ | 운동량 방정식 (3.4) |
| 각운동량 $\mathbf H_O$ | $\mathbf r\times\mathbf V$ | 각운동량 방정식 (3.6) |
| 에너지 $E$ | $e$ | 에너지 방정식 (3.7) |

:::note 라이프니츠 규칙과의 관계
1차원에서 $\dfrac{d}{dt}\displaystyle\int_{a(t)}^{b(t)}f(x,t)\,dx=\int_a^b\frac{\partial f}{\partial t}dx+f(b,t)\frac{db}{dt}-f(a,t)\frac{da}{dt}$입니다. 경계가 움직이며 쓸고 지나가는 양이 끝점 항으로 나옵니다. 수송 정리는 이것을 3차원 영역으로 옮기고, 경계의 움직임 대신 유체가 경계를 가로지르는 흐름을 센 것입니다.
:::
` },
      { k: '3.3a', p: 150, title: '정상 흐름의 질량 보존', body: R`
$B=m$, $\beta=1$이면 계의 질량은 변하지 않으므로 좌변이 0입니다.
$$0=\frac{d}{dt}\int_{CV}\rho\,d\mathcal V+\int_{CS}\rho(\mathbf V\cdot\mathbf n)\,dA$$

:::key 정상 흐름의 연속 방정식
$$\sum_{\text{in}}\dot m_i=\sum_{\text{out}}\dot m_i,\qquad\text{하나의 관: }\rho_1A_1V_1=\rho_2A_2V_2$$
비압축성이면 체적 유량이 보존된다: $\sum Q_{\text{in}}=\sum Q_{\text{out}}$, $A_1V_1=A_2V_2$. 액체로 가득 찬 단단한 용기에서는 흐름이 비정상이어도 성립한다.
:::

:::ex 예제 3 — 노즐
지름 3 cm 호스에서 물이 2 m/s로 흐르다가 지름 1 cm 노즐로 나간다. 분출 속도는?
---
$V_2=V_1(d_1/d_2)^2=2(9)=18$ m/s. 지름이 1/3이면 속도는 9배.
:::

:::ex 예제 4 — 분기관
물 0.05 m³/s가 T자관으로 들어와, 지름 8 cm 출구로 4 m/s, 나머지는 지름 10 cm 출구로 나간다. 두 번째 출구의 속도는?
---
$Q_2=4\pi(0.04)^2=0.0201$ m³/s, $Q_3=0.05-0.0201=0.0299$ m³/s, $V_3=Q_3/(\pi\,0.05^2)=3.81$ m/s.
:::

:::tip 검사 체적을 고르는 요령
입출구 단면이 흐름에 수직이 되게 자르고, 성질이 고르게 알려진 곳(관의 단면, 대기로 나가는 분류)을 지나게 하세요. 모르는 양이 있는 곳을 가로지르면 그것이 식에 들어옵니다. 구하려는 것이 있는 곳을 지나야 합니다.
:::
` },
      { k: '3.3b', p: 152, title: '비정상 흐름: 쌓이고 비는 검사 체적', body: R`
검사 체적 안의 질량 $m_{CV}=\int_{CV}\rho\,d\mathcal V$가 변하면 첫째 항이 살아 있습니다.

:::key 비정상 질량 수지
$$\frac{dm_{CV}}{dt}=\sum_{\text{in}}\dot m_i-\sum_{\text{out}}\dot m_i$$
단면적 $A_t$인 탱크에 밀도 $\rho$인 액체가 높이 $h$까지 차 있으면 $\rho A_t\dfrac{dh}{dt}=\dot m_{\text{in}}-\dot m_{\text{out}}$.
:::

:::ex 예제 5 — 물탱크
지름 1 m 원통 탱크로 20 L/s가 들어가고 12 L/s가 나간다. 수위는 얼마나 빨리 오르는가?
---
$dh/dt=(0.020-0.012)/(\pi\,0.5^2)=0.0102$ m/s ≈ 10.2 mm/s.
:::

:::ex 예제 6 — 압축 공기 탱크
부피 0.5 m³ 탱크에 공기를 0.02 kg/s로 넣는다. 온도가 300 K로 일정하면 압력은 얼마나 빨리 오르는가?
---
$\mathcal V\,d\rho/dt=\dot m$ → $d\rho/dt=0.04$ kg/(m³·s). $p=\rho RT$에서 $dp/dt=RT\,d\rho/dt=287(300)(0.04)=3444$ Pa/s ≈ 3.44 kPa/s.
:::

:::ex 예제 7 — 수위에 따라 줄어드는 유출
넓이 1 m² 탱크의 바닥 구멍으로 $Q=k\sqrt h$($k=0.01\ \text{m}^{2.5}/\text{s}$)가 나간다. 수위가 4 m에서 1 m로 내려가는 시간은?
---
$A\,dh/dt=-k\sqrt h$ → $\displaystyle\int_4^1\frac{dh}{\sqrt h}=-\frac kA t$ → $2(\sqrt4-\sqrt1)=0.01t$, $t=200$ s. 유출이 $\sqrt h$에 비례하는 이유는 7단원의 토리첼리 식에서 나옵니다.
:::

:::warn 부호
$\mathbf V\cdot\mathbf n$의 $\mathbf n$은 **바깥** 법선입니다. 들어오는 흐름은 음수로 들어가므로, 1차원 형태에서는 부호를 식에 따로 붙인 $\sum_{\text{out}}-\sum_{\text{in}}$을 쓰고 유량 자체는 양수로 다루면 헷갈리지 않습니다.
:::
` },
    ],
    problems: [
      { sec: '3.1', type: 'num', lv: 1, q: R`지름 4 cm 관의 층류 속도 분포가 $u=u_{\max}(1-r^2/R^2)$이고 $u_{\max}=2$ m/s다. 체적 유량(L/s)은?`, ans: 'pi*0.02^2*2/2*1000', ansTex: R`1.257`,
        sol: R`$Q=\pi R^2u_{\max}/2=\pi(0.02)^2(1)=1.257\times10^{-3}$ m³/s.` },
      { sec: '3.1', type: 'num', lv: 2, q: R`두 평판 사이 흐름의 속도가 $u=U(y/h)^{1/7}$ ($0\le y\le h$)이다. 평균 속도는 $U$의 몇 배인가?`, ans: '7/8', ansTex: R`0.875`,
        sol: R`$\dfrac1h\displaystyle\int_0^hU(y/h)^{1/7}dy=U\cdot\dfrac{1}{1+1/7}=\dfrac78U$.` },
      { sec: '3.1', type: 'num', lv: 1, q: R`균일한 속도 3 m/s가 넓이 0.5 m² 평면을 지나는데, 평면의 법선이 흐름 방향과 60°를 이룬다. 체적 유량(m³/s)은?`, ans: '3*0.5*cos(pi/3)', ansTex: R`0.75`,
        sol: R`$Q=VA\cos\theta=0.75$ m³/s.` },
      { sec: '3.1', type: 'mc', lv: 1, q: R`계(system)와 검사 체적(control volume)의 차이로 옳은 것은?`,
        choices: [R`계는 공간에 고정되고, 검사 체적은 유체와 함께 움직인다`, R`계는 정해진 질량이고, 검사 체적은 질량이 드나들 수 있는 공간 영역이다`, R`둘은 같은 개념이다`, R`검사 체적에서는 질량 보존이 성립하지 않는다`], ans: 1,
        sol: R`계는 같은 입자들의 모임이라 질량이 일정합니다. 검사 체적은 공간의 영역이고 그 경계를 통해 질량이 드나듭니다.` },
      { sec: '3.2', type: 'mc', lv: 2, q: R`레이놀즈 수송 정리의 검사면 적분 $\int_{CS}\beta\rho(\mathbf V\cdot\mathbf n)dA$가 뜻하는 것은?`,
        choices: [R`검사 체적 안에 쌓이는 $B$의 비율`, R`검사면을 통해 나가는 $B$의 비율에서 들어오는 비율을 뺀 것`, R`계에 작용하는 외력`, R`$B$의 공간 평균`], ans: 1,
        sol: R`$\mathbf V\cdot\mathbf n$은 유출에서 양, 유입에서 음이므로 적분은 알짜 유출률입니다.` },
      { sec: '3.2', type: 'mc', lv: 2, q: R`속도 $\mathbf V_s$로 움직이는 검사 체적에 수송 정리를 적용할 때 검사면 적분에 넣는 속도는?`,
        choices: [R`유체의 절대 속도 $\mathbf V$`, R`검사 체적의 속도 $\mathbf V_s$`, R`상대 속도 $\mathbf V-\mathbf V_s$`, R`$\mathbf V+\mathbf V_s$`], ans: 2,
        sol: R`유체가 면을 가로지르는 비율은 면에 대한 상대 속도로 정해집니다.` },
      { sec: '3.2', type: 'num', lv: 2, q: R`라이프니츠 규칙으로 $\dfrac{d}{dt}\displaystyle\int_0^{t^2}x\,dx$를 $t=2$에서 구하세요.`, ans: '16', ansTex: R`16`,
        sol: R`피적분 함수가 $t$에 무관하므로 끝점 항만 남습니다: $f(b)\,db/dt=t^2\cdot2t=2t^3=16$. 직접 적분 $t^4/2$의 미분과 같습니다.` },
      { sec: '3.3a', type: 'num', lv: 1, q: R`지름 3 cm 호스에서 물이 2 m/s로 흐르다가 지름 1 cm 노즐로 나간다. 분출 속도(m/s)는?`, ans: '18', ansTex: R`18`,
        sol: R`$V_2=V_1(d_1/d_2)^2=18$ m/s.` },
      { sec: '3.3a', type: 'num', lv: 2, q: R`물 0.05 m³/s가 T자관으로 들어와 지름 8 cm 출구로 4 m/s, 나머지는 지름 10 cm 출구로 나간다. 두 번째 출구의 속도(m/s)는?`, ans: '(0.05-4*pi*0.04^2)/(pi*0.05^2)', ansTex: R`3.81`,
        sol: R`$Q_3=0.05-0.0201=0.0299$, $V_3=0.0299/0.007854=3.81$ m/s.` },
      { sec: '3.3a', type: 'num', lv: 2, q: R`단면적이 일정한 덕트에서 공기가 가열되어 밀도가 1.2에서 0.8 kg/m³로 줄었다. 입구 속도가 100 m/s이면 출구 속도(m/s)는?`, ans: '150', ansTex: R`150`,
        sol: R`$\rho_1V_1=\rho_2V_2$ → $V_2=1.2(100)/0.8=150$ m/s. 기체는 체적 유량이 아니라 질량 유량이 보존됩니다.` },
      { sec: '3.3b', type: 'num', lv: 2, q: R`지름 1 m 원통 탱크로 20 L/s가 들어가고 12 L/s가 나간다. 수위 상승 속도(mm/s)는?`, ans: '0.008/(pi*0.25)*1000', ansTex: R`10.2`,
        sol: R`$dh/dt=0.008/0.7854=0.0102$ m/s.` },
      { sec: '3.3b', type: 'num', lv: 3, q: R`부피 0.5 m³ 탱크에 공기를 0.02 kg/s로 넣는다. 온도가 300 K로 일정할 때 압력 상승률(kPa/s)은?`, ans: '287*300*0.02/0.5/1000', ansTex: R`3.44`,
        sol: R`$dp/dt=RT\,\dot m/\mathcal V=287(300)(0.04)=3444$ Pa/s.` },
      { sec: '3.3b', type: 'num', lv: 3, q: R`넓이 1 m² 탱크의 바닥 구멍으로 $Q=k\sqrt h$ ($k=0.01\ \text{m}^{2.5}/\text{s}$)가 나간다. 수위가 4 m에서 1 m가 되는 시간(s)은?`, ans: '200', ansTex: R`200`,
        sol: R`$A\,dh/dt=-k\sqrt h$ 적분: $t=\dfrac{2A}{k}(\sqrt{h_0}-\sqrt{h_1})=200$ s.` },
      { sec: '3.3b', type: 'mc', lv: 2, q: R`물이 가득 찬 단단한 밀폐 용기에 두 관이 연결되어 있다. 들어오는 유량이 시간에 따라 변할 때 옳은 것은?`,
        choices: [R`나가는 유량은 들어오는 유량과 매 순간 같다`, R`나가는 유량은 일정하다`, R`비정상 흐름이므로 질량 보존을 쓸 수 없다`, R`용기 안 질량이 늘어난다`], ans: 0,
        sol: R`비압축성 유체가 단단한 용기를 채우고 있으면 $m_{CV}$가 변할 수 없으므로 $Q_{\text{in}}=Q_{\text{out}}$이 매 순간 성립합니다.` },
      { sec: '3.2', type: 'open', lv: 2, proof: true, q: R`입구 1, 출구 2가 하나씩인 고정 검사 체적에 대해, 시각 $t$에 검사 체적과 겹치는 계를 잡아 1차원 입출구 형태의 수송 정리 $\dfrac{dB_{\text{계}}}{dt}=\dfrac{dB_{CV}}{dt}+\beta_2\dot m_2-\beta_1\dot m_1$을 유도하세요.`,
        sol: R`
시각 $t$: $B_{\text{계}}(t)=B_{CV}(t)$.
시각 $t+dt$: 계는 출구 밖으로 두께 $V_2dt$만큼 나갔고, 입구 쪽에서는 두께 $V_1dt$만큼 아직 검사 체적 안으로 들어오지 않은 새 유체가 빈자리를 채웠습니다(그 새 유체는 계에 속하지 않음). 따라서
$B_{\text{계}}(t+dt)=B_{CV}(t+dt)+\beta_2\rho_2A_2V_2dt-\beta_1\rho_1A_1V_1dt$.
빼고 $dt$로 나누면 $\dfrac{B_{\text{계}}(t+dt)-B_{\text{계}}(t)}{dt}=\dfrac{B_{CV}(t+dt)-B_{CV}(t)}{dt}+\beta_2\dot m_2-\beta_1\dot m_1$, $dt\to0$에서 원하는 식입니다.`,
        rubric: R`
- 두 시각에서 계와 검사 체적의 관계 — 4점
- 나간 몫과 들어온 몫을 $\beta\rho AV\,dt$로 표현 — 4점
- 극한 — 2점` },
    ],
  });
})();
