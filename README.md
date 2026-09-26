<p align="center"><a href="https://dhsrua555.github.io/engineering-math/"><img src="assets/banner.png" alt="Équation 공학수학 — 개념, 연습문제, 증명, 모의고사" width="100%"></a></p>

# Équation 공학수학

공학수학 시험 대비 사이트입니다. Kreyszig, *Advanced Engineering Mathematics* (10판)의 장 구성을 따라 14개 단원을 정리했습니다.

**사이트:** https://dhsrua555.github.io/engineering-math/

## 구성

- **개념 정리** — 단원마다 핵심 공식, 예제 풀이, 시험 포인트, 자주 하는 실수
- **연습문제 147개** — 객관식·단답형은 자동 채점, 서술형은 모범 풀이와 비교해 자가 채점
- **실전 모의고사 4회** — 타이머, 자동 제출, 단원별 득점 분석, 서술형 채점 기준
- **증명 102개** — 핵심 공식 상자마다 증명이 연결되어 있고, 증명 찾기 페이지에서 공식 이름·사람 이름·영어 용어로 검색
- **맞춤 모의고사 · 오답노트 · 공식집**

| Part | 단원 |
|---|---|
| A 상미분방정식 | 01 1계 ODE · 02 2계·고계 선형 ODE · 03 연립 ODE와 상평면 · 04 급수해와 특수함수 · 05 라플라스 변환 |
| B 선형대수 · 벡터 미적분 | 06 행렬과 연립일차방정식 · 07 고유값 문제 · 08 벡터 미분 · 09 벡터 적분과 적분 정리 |
| C 푸리에 해석 · PDE | 10 푸리에 급수·적분·변환 · 11 편미분방정식 |
| D 복소해석 | 12 복소수와 해석함수 · 13 복소적분 · 14 급수와 유수 적분 |

## 단답형 입력

분수 `3/2`, 원주율 `pi`, 자연상수 `e`, 제곱근 `sqrt(3)`, 허수 `i`를 쓸 수 있습니다. 예: `2*pi*i`, `1-e^(-1)`, `(-2+2i)/3`

풀이 기록과 점수는 브라우저의 localStorage에만 저장됩니다.

## 파일 구조

```
index.html          페이지 뼈대
assets/app.js       화면, 라우팅, 채점, 모의고사
assets/calc.js      단답형 답 계산기 (복소수 지원)
assets/plots.js     단원별 곡선 그림 (canvas)
assets/style.css    스타일
assets/katex.css    KaTeX 스타일 (폰트 내장, MIT)
data/partA–D.js     단원별 개념과 연습문제
data/exams.js       모의고사 문항
data/proofs-1..6.js  단원별 증명 (01–02, 03–05, 06–07, 08–09, 10–11, 12–14)
tools/banner.html   배너 원본 (1280×640 스크린샷 → assets/banner.png, assets/og.png)
```

문제를 추가하거나 고치려면 `data/` 파일만 수정하면 됩니다. 내용은 `String.raw` 템플릿 문자열이라 LaTeX 안에 `${`를 쓰지 않도록 주의하세요.

로컬에서 보려면 `index.html`을 브라우저로 열면 됩니다. 수식 렌더링(KaTeX)과 글꼴은 CDN에서 불러오므로 인터넷 연결이 필요합니다.
