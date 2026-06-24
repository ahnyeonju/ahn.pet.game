<!-- 다음 세션(사람/AI)을 위한 상세 인수인계서. 메모리(~/.claude/.../memory/)가 이 문서를 가리킴 -->
# 인수인계서 (HANDOVER)

> 채팅이 바뀌면 AI는 이전 대화를 기억 못 한다. 이 문서 + 메모리로 이어간다.
> **이어가는 법**: ① 자동 로드된 메모리 읽기 → ② 이 문서 읽기 → ③ `context-notes.md`(결정 로그)·활성 `checklist.md` 확인 → ④ 코드/`git log` 재확인 후 작업.
> **주의**: "현재 상태"는 작성 시점 기준. 코드/`git log`로 항상 재확인할 것.

---

## 1. 프로젝트 한 줄 요약

다마고치류 **모바일 웹 키우기 게임**. React 단일 `src/App.jsx`, Vite 빌드, 인라인 스타일, `localStorage`(키 `tama_v2`).

**규칙은 레포 루트 `CLAUDE.md`(P1~P9)가 단일 출처 — 반드시 먼저 읽을 것.** (여기서 P 내용을 중복하지 않는다. 자주 어기는 것: 라이브러리 무단추가 금지 P1 / 상태 3객체 P2 / screen·popup 분리 P3 / 수치는 마스터 상수 P5 / 한국어 마침표 종결 / 새 파일 한국어 헤더 P6 / 비자명 작업은 plan·checklist·context-notes P7.)

---

## 2. 작업 줄기 (시간순, 브랜치 `pet-motion-poc`)

1. **펫 자율 이동** — Spine 기각, 애니 WebP `<img>` 채택. `WanderingPet`/`WanderingPetActive`로 정적 중앙 펫 대체. 크기·Y정렬은 데코와 동일 월드 기준.
2. **꾸미기** — 데코·창문(window category)을 방 전체(월드)에 배치 + 배경 스크롤.
3. **PWA 오프라인** — `vite-plugin-pwa` + 폰트 self-host(CDN 제거).
4. **펫 액션/연출** — 밥먹기(eat 모션 + 밥 아이콘 `FOOD_ICON`), 감정 모션, 진화 색종이 파티클(`EvoConfetti`).
5. **밝은 테마** — 풀스크린을 허니베이지로 통일(`SCREEN_BG`·`INK*`·`CARD_*`), home은 날씨 배경 유지.
6. **날씨 일원화** — 하늘 단일 소스 `WEATHER_SKY`(+`weatherSky()` 이미지 폴백 `WEATHER_SKY_IMG`/`WEATHER_IMG_EXTS`) + `WeatherFX`(비·눈 파티클). 창문·투명배경 백드롭이 공유. `WEATHER_META`는 라벨·이모지만(`.bg` 제거).
7. **진화 규칙** — `determineFinalForm`이 **가장 높은 성향 = 최종 폼**(랜덤·게이트 제거, pMin/sMin 삭제). 동점은 부 성향→선물이력→랜덤.
8. **스킬** — `BASE_SKILL`(펫 챗봇, 모든 3단계 공통) + 폼별 고유 스킬(`FINAL_FORMS.skill`, 미구현 표시).
9. **하단바 개편** — 4탭 [돌보기·대회·놀러가기·소셜]. 돌보기=액션시트(밥/놀기/청소/선물). 대회=미구현(`PlaceholderScreen`).
10. **놀러가기(멀티 Phase 1)** — 무서버 코드 방문(아래 §3·context-notes).
11. **소셜(AR 펫 카메라)** — `getUserMedia` 위 펫 배치·자이로·줌·사진 보관함(아래 §3).
12. **HTTPS dev** — `@vitejs/plugin-basic-ssl`(dev 전용) + `npm run dev:phone`(폰 카메라 테스트용).

---

## 3. 핵심 결정과 이유 (바꾸기 전 반드시 이해)

- **무서버·무외부서비스 철학** — 멀티(놀러가기/소셜)·NFC 전부 외부 서버/유료티어 없이. 업체 소멸·과부하 위험 회피.
- **WebP 채택 / Spine 기각** — 경량 우선. WebP 클립은 회사 Spine에서 export(코드로 못 만듦).
- **펫 = 월드(방) 좌표 앵커** — 배경 가로 300% 파노라마. 펫이 배경에 박혀 스크롤에 같이 밀림. rAF가 `scrollXRef`로 실시간 scrollX 읽음. 행동상태는 ref+rAF 로컬(영구상태 미저장).
- **펫 외형 = 순수 함수** — `petDirOf/petEmojiOf/petNameOf/petImgOf/petMotionOf/petColorOf`. App의 `getPet*`가 위임, 놀러가기 방문 렌더도 공유. 경로는 폼별 `{egg}/stage{N}` 또는 `stage3/{finalForm}`. **3단계 에셋 미존재 → 이모지/정적 폴백.**
- **놀러가기 Phase 1** — `makeVisitCode`/`parseVisitCode`(렌더 최소 데이터만 LZString 압축, 세이브 코드와 별개). `VisitHome`이 방 영역만 읽기전용 재사용 + 집주인·내 펫 동반. **Phase 2 = WebRTC P2P + 코드 핸드셰이크(무서버 라이브 미러링)** 예정.
- **소셜 AR** — 라이브러리 0(`getUserMedia`·`<canvas>` 합성·`DeviceOrientation`·IndexedDB). 카메라 초점 제어는 기기 의존(일부는 `manual`만 노출 → 자동초점 강제 불가, 줌만 슬라이더). 사진은 즉시저장 안 하고 **IndexedDB 보관함**(썸네일→그리드→전체보기 저장/공유/삭제).
- **폰트 self-host** — CDN 런타임 캐시 불안정 → 오프라인 실패. woff2 직접 호스팅 + precache.

---

## 4. 함정 / 반드시 알아야 할 것

- **오프라인/PWA 테스트는 `npm run build` + `npm run preview`로만.** dev 서버는 SW 비활성.
- **카메라(소셜 AR)는 보안 컨텍스트 필요** — 폰 테스트는 `npm run dev:phone`(HTTPS, basic-ssl) → `https://<LAN IP>:5173`(자체서명 경고 "계속"). 일반 `npm run dev`/`http://`는 카메라 차단.
- **Google Fonts CDN 다시 넣지 말 것.** self-host 됨. Jua만 한글 글리프.
- **펫 입력 모델** — 펫 위=탭/드래그, 빈 곳=배경 스크롤. `[data-pet]` 가드 + `touchAction:none` + `setPointerCapture`. 하나라도 빼면 충돌.
- **여러 탭(다른 대화)에서 App.jsx 동시 작업 금지** — 자동 변경 충돌.
- **실배포는 HTTPS 필수**(SW·카메라). 
- **모바일 뷰포트는 `100dvh`** — body·.shell 모두 `100dvh`로 통일(예전 `100vh` letterbox 잘림 해결). 데스크톱만 910px 프레임.
- **꾸미기: 아주 예전 저장 데코는 화면 왼쪽 밖**(좌표계 변경 전 데이터). 왼쪽 스크롤하면 보임.

---

## 5. 파일 지도

- `src/App.jsx` — 게임 전체(단일 파일).
  - 펫: `WanderingPet`/`WanderingPetActive`, 외형 순수함수 `pet*Of`.
  - 데코·창문: `DecorationOverlay`. 방: `RoomBackground`.
  - 화면: `HomeLayout`/`BottomBar`, `MissionScreen`/`Shop`/`GachaScreen`/`GiftBox`/`Collection`/`SkillScreen`/`EggSelect`, `OutingScreen`(+`VisitHome`), `ARSocialScreen`, `PlaceholderScreen`(대회).
  - 날씨: `WEATHER_SKY`/`WEATHER_SKY_IMG`/`weatherSky()`/`WeatherFX`.
  - 사진 보관함: IndexedDB 헬퍼 `savePhoto`/`loadPhotos`/`deletePhoto`.
  - 마스터 상수: 파일 상단 (목록은 CLAUDE.md P5 참조).
- `vite.config.js` — VitePWA + (HTTPS env 시) basic-ssl.
- `package.json` — `dev` / `dev:phone`(HTTPS=1 vite --host) / `build` / `preview`.
- `public/fonts/` — self-host woff2. `public/images/` — pets(알·stage별), shop, weather, icons.
- `public/images/pets/_originals/` — 펫 모션 POC 산출물(별개, 게임 미사용).

---

## 6. 현재 상태 (재확인 필수 — git log로)

- 브랜치 **`pet-motion-poc`**, **원격(origin) push됨 + PR #1(→ main) 열림. main 미머지.**
- 미구현(P6): **고유 스킬(Anthropic API)**, **대회(competition)**. (상점·세이브코드·놀러가기·소셜은 구현됨.)
- `명령어` 파일은 개인 메모(untracked) — 커밋 제외. 건드리지 말 것.

---

## 7. 배포 (GitHub Pages)

**공개 URL (NFC 스티커 등록용)**
```
https://ahnyeonju.github.io/ahn.pet.game/
```

**레포 구조**
- `origin` → `https://github.com/ahnyeonju/tama-game` (private, 개발 히스토리 보존)
- `public` → `https://github.com/ahnyeonju/ahn.pet.game` (public, Pages 배포용)

**업데이트 push 명령 (매번 두 줄 실행)**
```bash
git push origin pet-motion-poc          # private 레포 (개발 히스토리)
git push public public-main:main        # public 레포 → Actions 자동 빌드 (~30초 후 반영)
```

**자동화 흐름**
```
git push public → GitHub Actions (npm ci + npm run build) → gh-pages 브랜치 → Pages 배포
```

**주의사항**
- 공개 레포(`ahn.pet.game`)에는 저작권 문제 이미지 제외 후 push할 것.
- `vite.config.js`에 `base: '/ahn.pet.game/'` 설정됨. 이걸 제거하면 로컬도 망가짐.
- `src/App.jsx` 최상단에 `const BASE = import.meta.env.BASE_URL;` 선언됨. 이미지·폰트 경로가 전부 이 변수로 시작함.
- 공개 레포 로컬 브랜치명: `public-main` → 원격 `main` 으로 push.

---

## 8. 다음 단계 (TODO)

- [ ] **놀러가기 Phase 2** — WebRTC P2P + 코드 핸드셰이크 라이브 미러링(무서버). 펫 모션을 "원격 데이터 구동" 모드로 분리가 주 작업.
- [ ] **NFC** — 안드로이드 웹(Web NFC)에서 세이브 코드 ↔ 태그. iOS 웹은 불가(보너스 기능으로).
- [ ] **3단계(stage3) 펫 에셋** — 현재 폴더 비어 이모지 폴백. 에셋 들어오면 자동 적용.
- [ ] **고유 스킬(AI)·대회** — 사용자 "구현해줘" 시 작성(P6).
- [ ] PWA 아이콘 정식 디자인 교체.
- [ ] `pet-motion-poc` → main 머지(사용자 결정, PR #1).
