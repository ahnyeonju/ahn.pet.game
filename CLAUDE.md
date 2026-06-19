# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. No Closing Colons (Korean Output)

**End Korean sentences with a period, not a colon.**

When the user writes in Korean, your output is also Korean:
- Don't end sentences with `:` even if the next line is a list or example.
- LLMs trained on English docs leak the colon habit into Korean. Catch it.
- The test: every Korean sentence terminator should be `.`, `?`, or `!` — not `:`.
- Colons are fine inside code, key-value pairs, or labels. Not as sentence enders.

## 6. File Header Comments in Korean

**First line of every new source file: a one-line Korean comment stating its role.**

When creating a new file:
- TypeScript/JavaScript: `// 사용자 인증 상태를 관리하는 Context Provider`
- Python: `# KIS API 호출을 비동기로 래핑하는 클라이언트`
- SQL: `-- 일별 집계 결과를 저장하는 머티리얼라이즈드 뷰`
- Place it directly under required directives (`'use client'`, `'use server'`, shebang).
- Skip config files (`*.config.ts`, `package.json`, etc.).

Why: agents read files selectively, not whole codebases. A one-line Korean header gives instant context so the next session (human or agent) can navigate without re-reading the entire file.

## 7. Plan + Checklist + Context Notes

**Before any non-trivial task, produce three artifacts. Don't start coding without them.**

- **Plan** — what we're building and why.
- **Checklist** (`checklist.md`) — concrete tasks as checkboxes. Tick as you go.
- **Context Notes** (`context-notes.md`) — decisions made during the work and the reasoning behind them. Append continuously.

If the user gives only a plan and asks you to start coding, stop and ask: "Should I create the checklist and context notes first?" The next session — yours or someone else's — needs the notes to pick up where you left off without re-deriving every decision.

## 8. Run Tests Before Marking Complete

**If you touched code, run the tests before saying "done".**

- `npm test`, `pytest`, `cargo test`, whatever the project uses — run it.
- If tests pass, report results. If they fail, fix and re-run.
- No test setup? At minimum, verify the project builds/compiles.
- Run tests proactively, before the user signals "끝", "완료", "다 됐어" — not after.

This is the step LLMs skip most often. Treat it as non-negotiable.

## 9. Semantic Commits

**Commit when one logical change is complete. Don't wait for the user to ask.**

- The test: "Can I describe this commit in one sentence?" If yes, commit. If no, the changes are still mixed — split them.
- Good: "auth 미들웨어 추가". Bad: "auth 추가하고 UI도 고치고 버그도 수정" (split into 3).
- Don't accumulate 20 unrelated edits and lose the ability to roll back individually.
- Don't commit just to commit — meaningful units only.

Note: For solo prototypes or throwaway scripts, group commits loosely if it slows you down. The point is reversibility, not ceremony.

## 10. Read Errors, Don't Guess

**Read the actual error/log line. Don't pattern-match from memory.**

When something fails:
- Read the full error message and stack trace.
- Check the actual log output, not what you assume it should say.
- Don't apply a "common fix" before confirming the cause.
- If unclear, add a print/log to verify state — then fix.

This is the step LLMs skip most often after "run tests". They guess from error keywords and apply the most-recent-pattern fix. That's how a one-line bug becomes a three-file refactor.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# 프로젝트: 다마고치류 모바일 웹 키우기 게임

아래 섹션은 이 프로젝트에만 적용되는 추가 지침이다.
게임 수치(성장도, 확률, 미션 보상 등)와 콘텐츠 디테일은 별도 기획 문서에서 관리하며,
이 지침서에는 고정되지 않는다.

---

## P1. 기술 스택 고정

**이미 결정된 스택을 무단으로 바꾸지 않는다.**

| 영역 | 결정값 | 변경 조건 |
|---|---|---|
| 프레임워크 | React (단일 `.jsx` 파일, Vite 빌드 기준) | 사용자 명시 승인 필요 |
| 상태 관리 | `useState` / `useEffect` (외부 라이브러리 없음) | 복잡도가 명백히 요구될 때만 도입 제안 |
| 저장소 | `localStorage` (키: `tama_v2`) | 서버 연동 요구 시 별도 논의 |
| 스타일링 | 인라인 스타일 (CSS-in-JS 없음, 단일 `<style>` 태그) | 변경 전 반드시 질문 |
| 폰트 | Google Fonts — Nunito + Jua | 디자인 변경 시에만 교체 |
| AI 연동 | Anthropic API (고유 스킬용, 현재 미구현 상태 유지) | 사용자가 "구현해줘" 명시 시에만 작성 |
| 세이브 압축 | `lz-string` (소스 인라인, 세이브 코드 전용) | 이 용도 외 사용 금지 |

스택 외 라이브러리(Framer Motion, Zustand 등)를 도입하고 싶을 때는
먼저 이유와 대안을 제시하고 승인을 받는다. 무단 추가 금지.

---

## P2. 데이터 구조 원칙

**상태는 세 개의 최상위 객체로만 관리한다.**

```
pet      — 펫의 현재 상태 (단계, 성장도, 성향 스탯, 케어 상태)
daily    — 당일 미션 완료 여부, 이벤트, 날씨 멀티플라이어
inv      — 인벤토리 (선물 목록, 티켓, 재화, 해금된 도감 목록, 상점 보유/장착 아이템 `shopItems`)
```

- `ghist` (선물 이력)는 진화 동점 처리 전용 보조 배열이다. 다른 용도로 사용하지 않는다.
- 새 상태가 필요할 때 기존 객체 안에 넣을 수 있으면 최상위 추가보다 우선한다.
- `localStorage` 키는 스키마가 깨질 만한 변경이 있을 때만 버전을 올린다 (`tama_v3` 등). 사소한 필드 추가는 버전을 올리지 않는다.

---

## P3. 화면 전환 구조

**`screen` state 하나로 모든 화면을 전환한다. 라우터를 도입하지 않는다.**

현재 등록된 화면 값.

```
egg_select / home / minigame / mission / gacha / giftbox / collection / shop / skill / competition / outing / social
```

`competition`(대회) · `outing`(놀러가기) · `social`(소셜)은 하단 바에서 진입하는 미구현 화면이다.
공용 `PlaceholderScreen`으로 "준비 중" 안내만 표시한다 (P6). 로직은 "구현해줘" 시 작성한다.

새 화면을 추가할 때는 위 목록에 append하고, `App()` 렌더 블록에 조건부 렌더를 추가한다.
기존 화면의 이름을 바꾸거나 분기를 중첩하지 않는다.

팝업은 `popup` state로 별도 관리한다 (`status / newpet / event / rainbow / evolution / settings`).
`devpanel`은 DEV 전용 팝업이다 (P9). 화면과 팝업을 혼용하지 않는다. 화면은 전체를 교체하고, 팝업은 오버레이로 띄운다.

---

## P4. UI 레이아웃 원칙

**4방향 영역 배치를 유지한다. 영역 간 역할이 섞이지 않도록 한다.**

```
┌─────────────── 상단 바 ───────────────┐  시스템 요소
│ 펫 프로필 | 재화 | 티켓 | 미션 | 설정 | 공유 │
├────────┬──────────────┬────────┤
│        │              │        │
│  좌측  │   펫 + 게이지  │  우측  │  날씨·이벤트 / 펫 / 뽑기·도감 등
│        │              │        │
├────────┴──────────────┴────────┤
│  하단 바: 돌보기 | 대회 | 놀러가기 | 소셜  │  진입 탭
└────────────────────────────────┘
```

- **상단**: 시스템 요소 (프로필, 재화, 미션 상태, 설정, 공유)
- **좌측**: 상황 정보 (날씨, 랜덤 이벤트). 인터랙션이 있어도 이 영역을 벗어나지 않는다.
- **우측**: 육성 외 기능 (뽑기, 선물함, 도감, 상점 등). 새 기능은 여기에 추가한다.
- **하단**: 4개 진입 탭 (돌보기 / 대회 / 놀러가기 / 소셜). **돌보기** 탭은 핵심 육성 액션(밥·놀기·청소·선물)을 액션시트(바 위 팝업)로 펼친다. 대회·놀러가기·소셜은 각 화면(`screen`)으로 진입하는 미구현 기능이다. 탭을 4개 초과로 늘릴 때는 사용자에게 확인한다.
- **중앙**: 펫과 핵심 게이지만. 텍스트와 버튼을 추가하지 않는다.

각 영역의 너비·높이를 임의로 변경하지 않는다. 레이아웃 변경은 사용자 요청이 있을 때만.

---

## P5. 게임 수치와 콘텐츠는 코드에서 분리한다

**수치는 파일 상단 마스터 데이터 상수에만 존재해야 한다. 로직 내부에 하드코딩하지 않는다.**

좋은 예시.
```js
// 상단 상수
const GROWTH_THRESHOLDS = { stage2: 40, stage3: 100 };

// 로직
if (pet.growthPoint >= GROWTH_THRESHOLDS.stage2) { ... }
```

나쁜 예시.
```js
if (pet.growthPoint >= 40) { ... }  // 40이 뭔지 코드만 보면 모른다
```

마스터 데이터 상수 목록 (현재).
- `GROWTH_THRESHOLDS` — 진화 임계값
- `TRAITS` — 성향 메타데이터
- `FINAL_FORMS` — 최종 진화 정의 (키=주 성향, 부 성향은 동점 타이브레이크, 형태별 고유 스킬)
- `BASE_SKILL` — 모든 3단계 펫 공통 기본 기능(펫 챗봇)
- `EGG_OPTIONS` — 알 선택지
- `GIFT_MASTER` — 선물 아이템 목록 (상점 `SHOP_MASTER`도 여기서 파생)
- `SHOP_MASTER` — 상점 상품 목록
- `MISSION_REWARDS` — 미션별 보상
- `RANDOM_EVENTS` / `EVENT_REWARDS` — 랜덤 이벤트 및 보상
- `WEATHER_META` — 날씨 라벨·이모지
- `WEATHER_SKY` / `WEATHER_SKY_IMG` — 날씨 하늘 그라데이션(단일 소스) 및 선택적 이미지 경로
- `FOOD_ICON` — 먹기 연출 밥 아이콘

새 콘텐츠를 추가할 때는 반드시 이 상수들에 먼저 등록한 뒤 로직을 작성한다.

---

## P6. 미구현 기능 처리 원칙

**"향후 추가 예정" 기능은 구조만 잡고 동작하지 않는 상태로 둔다.**

현재 미구현 상태인 기능.
- 고유 스킬 (Anthropic API 연동) — 스킬 화면은 존재하나 API 호출 없음.
- 대회 / 놀러가기 / 소셜 — 하단 바 탭·화면(`PlaceholderScreen`)은 존재하나 "준비 중" 안내만 있고 로직 없음.

(참고: 상점 구매·세이브 코드 내보내기/불러오기는 이미 구현됨. 설정 팝업은 세이브 코드 기능을 담당한다 — P8.)

원칙.
- 미구현 기능의 UI(버튼, 화면)는 그대로 유지한다. 삭제하지 않는다.
- 미구현 상태임을 사용자에게 안내하는 텍스트를 화면에 표시한다.
- 사용자가 "구현해줘"라고 명시할 때만 실제 로직을 작성한다.
- 미구현 기능에 임시 더미 로직(랜덤 응답 등)을 넣지 않는다.

---

## P7. 하루 초기화 로직 주의

**날짜 비교는 항상 `getTodayStr()` 기준으로 한다. `Date` 객체를 직접 비교하지 않는다.**

```js
// 올바른 방식
const today = getTodayStr(); // "YYYY-MM-DD"
if (daily.date !== today) { /* 초기화 */ }

// 금지
if (new Date() > lastDate) { /* 타임존 버그 가능성 있음 */ }
```

`localStorage`에서 불러온 `daily.date`가 오늘과 다르면 `DEFAULT_DAILY`로 초기화한다.
초기화 시 이전 날의 이벤트·미션 상태를 이월하지 않는다.

---

---

## P8. 세이브 코드 (기기 간 이전)

**localStorage 외에 텍스트 코드 방식의 세이브 내보내기/불러오기를 지원한다.**

진입점: 상단 바 설정(⚙️) 버튼 → `popup = "settings"` 팝업 내부.

동작 방식.

- **내보내기**: `{ egg, pet, daily, inv, ghist }` 전체를 `JSON.stringify` 후 `LZString.compressToBase64`로 압축해 텍스트로 표시. 사용자가 복사해 보관.
- **불러오기**: 텍스트 입력창에 코드를 붙여넣으면 `LZString.decompressFromBase64` 후 `JSON.parse`해 상태에 반영. 성공 시 홈 화면으로 전환.

```js
// 내보내기
const code = LZString.compressToBase64(JSON.stringify({ egg, pet, daily, inv, ghist }));

// 불러오기
const data = JSON.parse(LZString.decompressFromBase64(code));
// egg, pet, daily, inv, ghist 각각 setState
```

원칙.

- LZString 소스는 CDN이 아닌 파일 내부에 직접 인라인한다. 오프라인/CDN 장애 대비.
- 불러오기 실패(디코딩 오류, 스키마 불일치) 시 현재 상태를 건드리지 않고 에러 메시지만 표시한다.
- 불러오기 성공 시 `localStorage`도 즉시 덮어쓴다 (`saveState` 호출).
- 세이브 코드는 외부 서버로 전송하지 않는다. 클라이언트 전용.
- 설정 팝업은 `popup = "settings"`로 관리한다. 새 화면(`screen`)으로 분리하지 않는다.

---

---

## P9. Dev Mode

**개발자 전용 기능. 운영 빌드에는 절대 노출되지 않는다.**

진입점: `import.meta.env.DEV`가 `true`일 때만 렌더되는 `🔧 DEV` 버튼 (화면 좌상단 절대 위치).

구조.

- `devMode` state (`boolean`) — ON 시 하루 제한 무시. 토글은 DevPanel 내부 스위치로만 변경.
- `popup = "devpanel"` — DevPanel을 오버레이로 표시. 새 screen 으로 분리하지 않는다.
- `DevPanel`, `DevSection`, `DevBtn` 컴포넌트는 SettingsPopup 바로 위에 배치한다.

운영 환경 차단 원칙.

- 버튼, 패널, DevPanel·DevSection·DevBtn 컴포넌트는 모두 `import.meta.env.DEV` 조건 내부 또는 DEV 전용 블록에 위치한다.
- `vite build` 시 Vite가 `import.meta.env.DEV`를 `false`로 치환 → dead-code elimination으로 번들에서 제거된다.
- DevPanel을 삭제하거나 숨길 때는 `import.meta.env.DEV` 게이트 블록 전체를 제거한다.

Dev 전용 액션 함수 목록 (App 컴포넌트 내부, handleDraw 바로 위).

```js
devSetGrowth(v)         // 성장도 직접 설정 (0–999)
devSetTrait(trait, d)   // 성향 ±d 조정
devForceForm(formKey)   // 최종 폼 즉시 강제 적용 (팝업 없음)
devForceEvo(stage)      // 진화 트리거: stage 낮추고 growthPoint 임계값 설정 → checkEvolution 발동
devResetDay()           // daily를 DEFAULT_DAILY로 초기화 (date는 오늘 유지)
devFillMissions()       // 모든 미션 완료 상태로 강제 설정
devClaimAll()           // 모든 보상 수령 상태로 강제 설정
```

`devMode` ON 시 핸들러 동작 변화.

| 핸들러 | 일반 모드 | devMode ON |
|---|---|---|
| `handleFeed` | `markMissionDone` → 미션 완료 마킹 후 status 적용 | 미션 무시, status만 반복 적용 |
| `handleClean` | 동일 | 동일 |
| `handlePlay` | `daily.missions.play` 완료면 차단 | 차단 없이 미니게임 반복 실행 가능 |
| `handleGameAnswer` (정답) | `markMissionDone("play")` 호출 | 마킹 없이 mood만 적용 |
| `handleGiftGive` | `daily.missions.gift` 완료면 차단 | 차단 없이 선물 반복 가능, 미션 마킹 없음 |
| `handleStatusCheck` | `markMissionDone("statusCheck")` 호출 | 마킹 없이 팝업만 열림 |

---

**이 프로젝트 지침이 잘 작동하고 있다면** 수치를 바꿀 때 마스터 상수만 수정하면 되고,
새 화면을 추가할 때 기존 화면이 깨지지 않으며,
레이아웃 4방향 구조가 어떤 기능 추가 후에도 유지된다.
