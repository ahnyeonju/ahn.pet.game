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
