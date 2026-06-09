<!-- 다음 세션(사람/AI)을 위한 상세 인수인계서. 메모리(~/.claude/.../memory/)가 이 문서를 가리킴 -->
# 인수인계서 (HANDOVER)

> 채팅이 바뀌면 AI는 이전 대화를 기억 못 한다. 이 문서 + 메모리로 이어간다.
> **이어가는 법**: ① 자동 로드된 메모리 읽기 → ② 이 문서 읽기 → ③ 관련 `checklist.md`/`integration-*.md` 확인 → ④ 코드 확인 후 작업.
> **주의**: 이 문서의 "현재 상태"는 작성 시점 기준. 코드/`git log`로 항상 재확인할 것.

---

## 1. 프로젝트 한 줄 요약

다마고치류 **모바일 웹 키우기 게임**. React 단일 `src/App.jsx`(2300+줄), Vite 빌드, 인라인 스타일, `localStorage`(키 `tama_v2`). 상세 규칙은 레포 루트 **`CLAUDE.md`**(P1~P9 + 프로젝트 지침). 반드시 먼저 읽을 것.

핵심 제약(자주 어기는 것).
- **외부 라이브러리 무단 추가 금지**(P1). 추가 시 사용자 승인 필요.
- 상태는 `pet` / `daily` / `inv` 3개 최상위 객체만(P2).
- 화면 전환은 `screen` state 하나, 팝업은 `popup` state(P3).
- 수치·콘텐츠는 파일 상단 마스터 상수에만, 로직에 하드코딩 금지(P5).
- 한국어 출력은 마침표로 끝내기(콜론 금지, P5 지침).
- 새 소스 파일 첫 줄에 한국어 역할 주석(P6).
- 비자명 작업은 plan·checklist·context-notes 먼저(P7).

---

## 2. 이번 작업 줄기 (펫 모션 → 통합 → PWA)

브랜치 **`pet-motion-poc`** 에서 진행. 시간순.

1. **탐색** — 펫을 화면에서 자율 이동시키기. Spine(스파인) 런타임은 기각(라이브러리 462KB+WebGL+라이선스, P1). **애니메이션 WebP `<img>` 채택**. idle↔walk 하드컷 끊김은 사용자 수용.
2. **POC** — `public/images/pets/_originals/pet-behavior-test.html` (단독, file://로 열림). 보행·드래그·말풍선·연타감정 상태머신. 이모지→WebP 교체 후 검증.
3. **크기 기준** — 펫 크기를 화면(vmin)이 아니라 **게임 월드 기준**으로. 데코와 동일 공식 `(디자인px / REFERENCE_RESOLUTION.width) × 컨테이너폭`. `REFERENCE_RESOLUTION={1080,2340}`, `PET_REF_WIDTH=320`.
4. **본 게임 통합** — `WanderingPet`/`WanderingPetActive` 컴포넌트로 기존 정적 중앙 펫 대체. 상세: `_originals/integration-plan.md`·`integration-checklist.md`.
5. **꾸미기 개선** — 데코를 방 전체(월드)에 배치 + 꾸미기 중 배경 스크롤.
6. **PWA 오프라인** — `vite-plugin-pwa` 도입(사용자 승인). 폰트 self-host로 CDN 제거. NFC 시나리오(첫 탭 다운로드→오프라인 플레이) 동작.

---

## 3. 핵심 결정과 이유 (바꾸기 전 반드시 이해)

- **WebP 채택 / Spine 기각** — 무라이브러리·NFC 경량 우선. WebP 클립은 회사 Spine 소스에서 export 필요(코드로 못 만듦). Spine 원본은 용량 문제로 삭제됨(필요 시 회사 Spine에서 재export).
- **펫 = 월드(방) 좌표 앵커** — 배경이 가로 300% 파노라마(스크롤). 펫이 배경에 "박혀" 스크롤에 같이 밀림(사용자가 "화면 고정" 대신 "방에 박힘" 선택). 렌더 `translate(pet.x − scrollX − half)`, `scrollXRef`로 rAF가 실시간 scrollX 읽음.
- **행동상태는 영구상태(pet/daily/inv)에 안 넣음** — ref+rAF 로컬. 세이브/로드 무영향.
- **크기·Y정렬은 데코와 동일 기준** — `REFERENCE_RESOLUTION` 1080, 펫 z=현재 발높이%(데코 depthZ 공식과 동일 스케일).
- **모션 에셋 = 폼별 파이프라인, v1은 공용 `_test`** — `getPetMotion()`이 진입점(현재 `/images/pets/_test/{walk,stand}.webp` 반환). 폼별 에셋 생기면 이 함수만 확장.
- **폰트 self-host** — Google Fonts CDN 런타임 캐시는 첫 로드 타이밍에 불안정 → 오프라인 실패. woff2를 `public/fonts/`에 직접 호스팅 + precache. CDN 의존 0 (CLAUDE.md P8 철학과 일치).

---

## 4. 함정 / 반드시 알아야 할 것

- **오프라인/PWA 테스트는 `npm run build` + `npm run preview`로만.** dev 서버(`npm run dev`)는 SW 비활성이라 오프라인 안 됨. (사용자가 dev에서 오프라인 테스트하다 막혔던 적 있음.)
- **Google Fonts CDN 다시 넣지 말 것.** 폰트는 self-host 됨. Nunito는 원래 한글 없음(한글 본문은 시스템 폰트 fallback, CDN일 때도 동일). Jua만 한글 글리프 있음(368KB woff2).
- **펫 입력 모델** — 펫 위=탭/드래그(펫 조작), 빈 곳=배경 스크롤. `[data-pet]` 가드 + `touchAction:none` + `setPointerCapture`로 구분. 이 4개 중 하나라도 빼면 충돌남.
- **여러 탭(다른 대화)에서 App.jsx 동시 작업 금지** — 자동 변경이 서로 덮어써서 충돌난 적 있음. App.jsx 작업은 한 탭에서만.
- **실배포는 HTTPS 필수**(SW 동작 조건). NFC URL을 `https://`로.
- **꾸미기: 예전 저장 데코는 왼쪽 1/3에 있음** — 좌표계 변경 전 데이터라, 중앙 시작 시 화면 밖(왼쪽)에 있을 수 있음. 왼쪽 스크롤하면 보임. 새 데코는 화면 중앙 생성.

---

## 5. 파일 지도

- `src/App.jsx` — 게임 전체. 펫: `WanderingPet`/`WanderingPetActive`(PetSprite 아래). 데코: `DecorationOverlay`. 마스터 상수: 파일 상단(`REFERENCE_RESOLUTION`, `PET_REF_WIDTH`, `PET_MOTION_CFG`, `PET_LINES`, `PET_EMOTIONS`, `DECOR_X`, `PLACEMENT_BOUNDS` 등).
- `vite.config.js` — VitePWA 설정(manifest, precache, 이미지 런타임 캐시).
- `public/fonts/` — self-host woff2 (nunito-500/700/800/900, jua-400).
- `public/icon-192.png` / `icon-512.png` — PWA 아이콘(순수 Python 생성, 교체 가능).
- `public/images/pets/_test/{walk,stand}.webp` — v1 공용 펫 모션.
- `public/images/pets/_originals/` — 펫 모션 POC 산출물: `pet-behavior-test.html`(단독 프로토타입), `walk/stand.webp`(POC 사본), `checklist.md`·`context-notes.md`·`integration-plan.md`·`integration-checklist.md`.

---

## 6. 현재 상태 (재확인 필수 — git log로)

- 브랜치 `pet-motion-poc`, **main 미머지·원격 미push**(전부 로컬). 머지: `git checkout main && git merge pet-motion-poc`.
- 작성 시점 커밋(최신순): 폰트 self-host → PWA → 꾸미기 → 본게임 통합 → 통합 plan문서 → 펫 크기 월드기준 → 펫 POC.
- `명령어` 파일은 무관(처음부터 untracked). 건드리지 말 것.

---

## 7. 다음 단계 (TODO)

- [ ] **per-form 모션 에셋** 들어오면 `getPetMotion()`을 폼별 경로로 확장, `_test` fallback 제거.
- [ ] **감정 전용 WebP**(angry 등) → `PET_EMOTIONS`의 motion 키에 매핑(현재 stand로 대체 중).
- [ ] 말풍선 대사·감정 콘텐츠 최종본(현재 placeholder).
- [ ] PWA 아이콘을 정식 디자인으로 교체(현재 임시 알 캐릭터).
- [ ] `pet-motion-poc` → main 머지 / 원격 push (사용자 결정).
