# 창문(window) 아이템 구현 체크리스트

새 `category: "window"` 추가. 상점 "장식" 탭에 decoration과 함께 표시.
창문 전용 동작은 "상단(벽) 영역에만 배치" 하나만 (나머지는 장식과 동일).

- [x] 1. 마스터 데이터: SHOP_MASTER에 window 예시 아이템 + CATEGORY_FALLBACK에 🪟 + `DECOR_CATEGORIES` / `PLACEMENT_BOUNDS` 상수 추가 → 빌드 통과
- [x] 2. 구매/장착/저장 로직: `=== "decoration"` 분기를 `DECOR_CATEGORIES.includes()`로 확장, 카테고리별 기본 배치 위치 적용 → 빌드 통과
- [x] 3. 꾸미기 모드(enterDecorMode, displayDecos, handleDraftAdd)에 window 포함 → 빌드 통과
- [x] 4. DecorateModePanel ownedDecos에 window 포함 → 빌드 통과
- [x] 5. DecorationOverlay: item.category 기준으로 y 배치 범위 제한(창문=상단) → 빌드 통과
- [x] 6. 상점 탭 필터: "장식" 탭에서 decoration+window 함께 표시 → 빌드 통과
- [x] 7. 최종 빌드 + 동작 확인 → `npm run build` 통과
