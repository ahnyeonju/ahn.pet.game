<!-- 날씨를 창문 유리 안에서만 보이게 하는 레이어 개편 체크리스트 -->
# 날씨-창문 레이어 개편 체크리스트

- [x] 박스 높이 기준 키프레임 추가 (`snowfallW`/`rainfallW`)
- [x] `WeatherParticles`(파티클) + `WindowWeather`(마스크/area 클립) 컴포넌트 작성, 기존 `WeatherFX` 대체
- [x] shell 최상위 전역 날씨 렌더 제거 (전체 화면 날씨 중단)
- [x] 창문 마스터(win_001)에 `weatherMask` + `weatherArea` 필드 추가
- [x] win_001_mask.png 생성 (유리 bbox 흰색 마스크)
- [x] 기본 방 그려진 창문 6개 유리에 날씨 주입
- [x] DecorationOverlay window 카테고리: 프레임 PNG 뒤에 클립 날씨 주입, HomeLayout에서 weather 전달
- [x] `npm run build` 통과
- [ ] dev에서 눈/비 × (기본방 / 상점창문) 가독 확인 ← 사용자 확인 단계
