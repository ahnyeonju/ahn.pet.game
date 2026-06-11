<!-- 창문/장식품 다중 배치 기능: 설계 결정과 근거 기록 -->
# 꾸미기 다중 배치 컨텍스트 노트

## 핵심 결정
- **데이터 모델 전환**: 기존 `inv.shopItems[itemId] = {owned, equipped, isFixed, position}`(아이템 1종=방 1개)에서, 배치 데이터를 별도 인스턴스 배열 `inv.placedDecos = [{ iid, itemId, position, isFixed }]`로 분리. 같은 종류 N개 배치를 위해 필수.
- **보유 수량은 shopItems에 유지**: 데코/창문 `shopItems[id] = { owned:true, count }`. count = 구매로 누적된 보유 개수. 배치 가능 잔여 = count − (placedDecos 중 해당 itemId 개수).
- **카테고리별 구매 규칙** (사용자 확정):
  - 창문: 1회 구매 = +6 (`PURCHASE_QTY.window`), 재구매 시 +6 더. "구매 완료" 차단 없음.
  - 장식품: 1회 구매 = +1, 무한 구매. 차단 없음.
  - 배경: 기존대로 owned/equipped 1개, 재구매 차단.
- **수치는 마스터 상수**(P5): `PURCHASE_QTY`에만 둠. 로직에 6/1 하드코딩 금지.
- **상태 최상위 추가 아님**(P2): `placedDecos`는 기존 `inv` 객체 안에 넣음.

## 마이그레이션
- 구버전 세이브는 데코가 shopItems에 position을 들고 equipped로 표시됨. `normalizeInv()`가 로드 시 count 없는 데코 항목을 감지 → equipped+position이면 placedDecos 1개로 이주, count는 PURCHASE_QTY 기본값 부여.
- `iid`는 `${itemId}_mig` 등 단일값. 신규 배치는 `${itemId}_${Date.now()}_${counter}`.

## 영향 안 준 것
- `handleShopEquip`는 이전부터 호출처 없음(데코 장착은 꾸미기 모드가 대체). 이번 변경과 무관하므로 삭제하지 않고 유지(P3).
- 펫/날씨 창문 하늘 로직(WindowOutside)은 그대로. 인스턴스마다 자기 위치 기준으로 동일 동작.
