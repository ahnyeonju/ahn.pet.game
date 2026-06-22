# 창문(window) 아이템 — 컨텍스트 노트

## 결정 사항 (사용자 확인됨)
- 모델링: 새 최상위 `category: "window"` 추가. decoration과 별개 category라 구별 태그는 불필요(category 자체가 구별자).
- 상점 노출: 별도 탭이 아니라 기존 "장식" 탭 안에 decoration과 함께 표시.
- 창문 전용 동작: **상단(벽) 영역에만 배치** 1개만 선택됨.
  - 펫 뒤 레이어 / 별도 슬라이드는 선택 안 됨 → zIndex·슬라이드는 기존 장식과 동일.

## 구현 방식
- `DECOR_CATEGORIES = ["decoration", "window"]` — 방에 오버레이로 배치되고 "장식" 탭에 함께 표시되는 카테고리. 기존 `category === "decoration"` 분기를 이 배열 `includes`로 확장.
- `PLACEMENT_BOUNDS` — 카테고리별 배치 y 범위(%)와 기본 y. 창문은 minY~maxY를 상단(벽)으로 제한. DecorationOverlay 드래그 클램프와 신규 아이템 기본 위치에 사용.
- 창문은 기존 장식과 동일하게 DecorationOverlay로 렌더·드래그·고정·삭제, scrollX 슬라이드 동작 그대로.

## 주의
- RoomBackground 안의 하드코딩 창문(벽 그림)은 이번 작업과 별개. 건드리지 않음.
- localStorage 스키마 변경 없음(shopItems 구조 그대로) → 버전 유지(P2).
- 창문 이미지 미존재 시 ShopItemImage가 CATEGORY_FALLBACK[🪟]로 폴백.

---

# 데코/배경 크기 — 기준 해상도 비율 방식 (유니티식)

## 결정 (사용자 확인됨)
- 절대 px 대신 유니티 Canvas Scaler/PPU 개념을 웹에 대응.
- `REFERENCE_RESOLUTION = {width:1080, height:2340}` (9:19.5 FHD+) 기준 상수 도입.
- 방 데코 크기 = 에셋 원본 px ÷ 기준 폭 × 실제 컨테이너 폭 × (item.scale ?? 1). PPU=1로 간주, 폭 기준 매치.
- `width`만 지정 + `height:auto` → 종횡비 유지, 절대 안 깨짐.

## 구현
- DecorationOverlay에서 ShopItemImage(60px 정사각 고정) 대신 비율 기반 img 직접 렌더.
  - naturalWidth(onLoad), 컨테이너 폭(resize 측정)으로 dispW 계산.
  - 이미지 로드 실패 시 CATEGORY_FALLBACK 이모지로 폴백.
- per-item `scale` 옵션(기본 1) — 특정 에셋만 미세조정용. 사이즈 하드코딩 금지.
- 상점/패널 썸네일(ShopItemImage)은 UI라 현행 고정 유지.
- 배경: 기존 objectFit:cover라 비왜곡 유지. 300% 파노라마 슬라이드는 기존 합의 동작 그대로.

## 알려진 점 / 추후 조정
- deco_001(730px)은 730/1080 ≈ 화면 폭 68%로 커짐. 의도보다 크면 에셋 재export 또는 scale로 조정.

---

# 펫 ↔ 데코 2.5D Y-정렬 (앞/뒤 레이어)

## 결정 (사용자 요청)
- 바닥 기준선을 정해, 데코의 발(바닥 접점)이 펫 기준선보다 아래면 데코가 펫 앞, 위면 펫 뒤.

## 구현
- `PET_BASE_Y = 65` (% from top) — 펫이 서 있는 바닥선. 펫 블록 zIndex = round(PET_BASE_Y).
- 데코 baseY = 중심 y + (스프라이트 절반 높이 / 컨테이너 높이 × 100). depthZ = round(clamp(baseY,1,150)).
- z 밴드: 게임 오브젝트(배경0 · 펫/데코 1~150 바닥선 정렬) < UI(`Z_UI.panel 200`, `evoBubble 250`, `decorCtrl 300`).
- 사이드 패널을 10→200으로 올려 항상 데코 위. (이전엔 데코15 > 패널10 이었음 — 가장자리 데코가 패널을 덮던 동작이 반대로 바뀜.)

## 튜닝 포인트
- 펫 발 위치가 안 맞으면 `PET_BASE_Y` 조정.
- 데코가 너무 일찍/늦게 앞으로 오면 같은 상수로 임계값 조정.

---

# 놀러가기 (멀티) — Phase 1: 오프라인 집 코드 방문

## 결정 (사용자 확인됨)
- 멀티는 **무서버·코드 기반**으로 간다. 외부 서비스(무료 티어 포함) 의존 금지 — 업체 소멸·과부하 위험 회피가 목적.
- Phase 1 = 친구가 준 "집 코드"로 친구 집을 **읽기전용 방문**. (SNS 피드는 보류 — 공유 색인 필요해 무서버와 충돌)
- 향후 Phase 2 = 온라인 라이브(둘 다 접속 시 펫 위치 완전 미러링). **WebRTC P2P + 코드 핸드셰이크 시그널링**으로 무서버 유지. 한계: 연결 코드 2회 교환(clunky), 엄격 NAT는 TURN 없이 실패. 펫 모션을 "원격 데이터 구동" 모드로 분리하는 게 주 작업.

## 구현 (Phase 1)
- `petDirOf/petEmojiOf/petNameOf/petImgOf/petMotionOf/petColorOf` — 펫 외형 순수 함수로 추출. App의 `getPet*`가 위임, 방문 렌더도 공유(DRY). (StatusPopup이 prop으로 petName/petMotion/petEmoji를 받아 충돌 → `Of` 접미사로 회피)
- `makeVisitCode(egg,pet,inv)` / `parseVisitCode(code)` — 세이브 코드와 별개. 렌더 최소 데이터만: `{ v:1, egg, pet:{stage,finalForm,name}, bg(장착 배경 id), decos(placedDecos) }`. 세이브 코드와 동일하게 LZString 압축.
- `VisitHome` — 홈 중앙 영역(RoomBackground+DecorationOverlay+WanderingPet+스크롤)만 재사용한 읽기전용 렌더. 상단/하단 바·패널·액션 없음. DecorationOverlay는 `draggable={false}`(홈 일반 모드와 동일 경로).
- `OutingScreen`(screen `outing`) — "친구 집 방문"(코드 붙여넣기) + "내 집 코드"(복사). visit 상태면 VisitHome 렌더.

## 주의 / 알려진 점
- 방문 시 펫은 **로컬에서 자율 이동**(스냅샷 외형만, 실시간 동기화 아님 — Phase 2 영역). 방문자가 펫을 탭/드래그해도 **로컬 연출일 뿐 친구 데이터에 영향 없음**.
- 친구가 보유한 배경/장식은 SHOP_MASTER(공유 마스터)에서 해석되므로 방문자 미보유여도 정상 렌더.
- 코드 불러오기 실패 시 현재 상태 안 건드리고 에러 메시지만(세이브 코드 원칙과 동일).
- localStorage 스키마 변경 없음 → 버전 유지(P2).

---

# 청소 모드 — 미니 인터랙션 (거품/샤워/빗질)

## 결정 (사용자 확인됨)
- 청소하기 = 꾸미기 모드형 **home 오버레이**(`CleaningOverlay`, 별도 screen 아님). 펫은 화면 중앙 정적 고정, 펫/배경 드래그 잠금(오버레이가 포인터 독점).
- 도구 3개(거품 🧽 / 샤워 🚿 / 빗질 🖌️) **자유 전환**, 순서 강제 없음. 선택 도구 강조.
- **하나라도 완료하면 끝** — `isCleaningCompleted = foam||shower||brush`. V는 anyDone일 때만 활성.
- **V**: 기존 `onClean`(App `handleClean`: 청결+30·미션 마킹·devMode P9) **재사용** 후 종료. **X**: 미커밋(미션·보상·저장 없음) + 이펙트 정리(언마운트).
- 이펙트 톤: 포켓몬류 참고 — 거품=폭신한 흰 덩어리(잔류), 샤워=물줄기+거품 씻김, 빗질=4갈래 반짝임 별. 라이브러리 0(CSS/DOM).

## 구현
- `CLEAN_TOOLS`(아이콘 한 곳 관리, 이모지 fallback) / `CLEAN_TH`(도구별 완료 누적 드래그 px). 아이콘 이미지 교체 시 `CLEAN_TOOLS`만 수정.
- 스크럽 판정: 펫 img 바운딩 **타원 근사**(픽셀 마스킹 불가) 안에서만 카운트/스폰. 누적 드래그량으로 진행, 18px마다 이펙트 스폰(throttle).
- 거품=잔류 state(최대 ~44개), 샤워=거품 거리<46px 제거 + 물줄기 단명, 빗질=반짝임 단명(setTimeout 제거).
- 진입: 돌보기 액션시트 "청소" → `setIsCleanMode(true)`. CleaningOverlay는 `petImg`만 받음(HomeLayout `getPetImg()`).

## 주의 / 추후
- 픽셀 단위 펫 모양 마스킹은 미적용(타원 근사). 더 정밀히 하려면 펫 알파 마스크 필요.
- 이펙트는 모두 컴포넌트 state → 언마운트 시 자동 정리. 누수 없음.
- 아이콘 이미지 에셋 들어오면 `CLEAN_TOOLS`에 경로 추가(현재 이모지).
