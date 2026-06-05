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
