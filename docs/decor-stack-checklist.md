<!-- 창문/장식품 다중 배치(스택) 기능 작업 체크리스트 -->
# 꾸미기 다중 배치(스택) 체크리스트

요구사항: 창문 1개 구매 시 6개 지급(재구매 시 +6), 장식품은 무한 구매(구매당 +1, "구매 완료" 표시 없음), 배경은 기존대로 1개. 보유한 개수만큼 같은 종류를 방에 여러 개 배치.

- [x] `PURCHASE_QTY` 마스터 상수 추가 (window:6, decoration:1)
- [x] `DEFAULT_INV`에 `placedDecos: []` 추가
- [x] `normalizeInv()` 마이그레이션 함수 (구버전 shopItems position → placedDecos, count 부여)
- [x] inv useState 초기화 + handleImport에 normalizeInv 적용
- [x] `handleShopBuy` — 창문/장식품 count 누적, 재구매 허용
- [x] `handleDecorSave` — draftDecos(iid 키) → placedDecos 배열로 저장
- [x] `enterDecorMode` — placedDecos → draftDecos(iid 키) 복원
- [x] draft 핸들러 itemId→iid 키 전환, `handleDraftAdd`에 잔여 개수 가드
- [x] `displayDecos` 인스턴스 리스트로 전환, 렌더 key=iid
- [x] `DecorateModePanel` — 탭=인스턴스 추가, 잔여 개수 뱃지/0개 비활성
- [x] 상점 목록/상세팝업 — 스택 아이템 차단 해제 + 보유 개수 표시
- [x] `npm run build` 통과
