<!-- 날씨-창문 레이어 개편의 결정·이유 기록 -->
# 날씨-창문 레이어 개편 컨텍스트 노트

## 문제
- 기존 `WeatherFX`는 shell 최상위 `inset:0 zIndex:1`로 **화면 전체**에 눈/비를 뿌림 → 방 안 전체에 내리는 어색함. 미션·뽑기 등 모든 화면에도 떨어짐.
- `window`는 `DECOR_CATEGORIES`에 묶여 데코와 동일한 드래그 오버레이로만 렌더됨(독립 레이어 아님).
- 기본 방(`RoomBackground`)에는 하드코딩된 그려진 창문 6개가 따로 있음(상점 win_001과 별개).

## 사용자 결정 (2026-06-11)
1. 상점 창문 아이템: **드래그 배치 유지**(고정 구조물 아님). → window는 DECOR_CATEGORIES에 그대로 두되 렌더만 분리.
2. 기본 방 그려진 창문 6개에도 **날씨 표시**. → 창문 없는 기본 방도 창문 안에서 날씨 보임.
3. 유리 마스크 자산 **지금 제작**. → win_001_mask.png 생성.

## 채택 설계 (스펙 단순화)
- 스펙의 "weather를 background 뒤에 깔고 배경 투명으로 비춤"은 **배경의 의도치 않은 투명 영역 누수** 위험이 상시 존재 → 기각.
- 대신 **날씨를 전역 레이어로 두지 않고 창문 유리에만 인스턴스로 클립**. 전역 weather가 없으니 외곽 누수 문제 원천 소멸(스펙 11 자동 충족).
- 레이어: `배경(0) → [창문: 유리 클립 날씨 → 프레임 PNG 위] → 데코 → 펫 → UI`.
- 클립 우선순위: `weatherMask`(CSS mask-image) 있으면 사용, 없으면 `weatherArea` %사각형 클립(fallback). 둘 다 없으면 부모(이미 overflow:hidden인 유리 div)에 그대로 채움.

## 마스크 생성 방법 (재현용)
- win_001.png(790×790)에서 경계 flood-fill로 **외곽 투명**을 걸러내고, 안쪽 투명(유리 칸) 중 큰 연결요소(>2000px)만 판유리로 인정 → 그 bbox를 흰색으로 채워 `win_001_mask.png` 저장.
- 좌측 셔터 손잡이 구멍 같은 작은 내부 투명은 제외됨.
- 유리 bbox: left 32.28%, top 27.47%, width 36.84%, height 44.3% → 이 값이 `weatherArea` fallback.
- win_001은 유리가 사각형이라 mask와 weatherArea가 사실상 동일. mask 경로 메커니즘은 **추후 비사각형 창문(원형 등)** 위해 존재.

## 파티클 애니메이션
- 기존 `snowfall`/`rainfall`은 `translateY(100vh)` → 작은 유리 박스에선 순식간에 통과해 밀도 낮음.
- 창문용 `snowfallW`/`rainfallW` 추가: `top` -10%→110% (부모 높이 기준) + 약한 translateX 드리프트.

## 개정 (2026-06-11, 사용자 피드백 후)
- 사용자가 모델 변경. 이전: 창문별 박스기준 파티클(`WeatherParticles`/`snowfallW`). 변경 후:
  - 날씨는 **원래 전체 화면 기준** `WeatherFX`(translateY 100vh, 원본 카운트)로 복원. 낙하 속도는 신경 안 씀.
  - 창문 유리 = 벽(배경)을 **뚫어 "바깥"으로** → 유리 영역에 **하늘 그라데이션(`WEATHER_SKY`) + `WeatherFX`** 깔고 프레임 PNG가 위에서 덮음.
  - 즉 유리 너머로 분홍 벽이 아니라 하늘+날씨가 보임(날씨 없을 때도 하늘은 보임 — 기본 방 창문과 동일).
- `WindowOutside`(신규)가 sky+WeatherFX를 weatherArea(우선)/weatherMask/부모 순으로 클립.
- `WEATHER_SKY` 상수를 top-level로 hoist(P5) — 기본 방 창문(RoomBackground)·상점 창문이 공유.
- `snowfallW`/`rainfallW` 키프레임, `WeatherParticles`/`WindowWeather` 제거.
- win_001은 유리가 사각형이라 weatherArea(사각형)로 충분 → 렌더는 area 우선. mask 필드·파일은 향후 비정형 창문용으로 보존.

## 개정 2 (2026-06-11, "창문마다 개별 파티클" 피드백 후)
- 문제: `WindowOutside`의 `WeatherFX`가 각 창문의 작은 유리 박스 기준으로 렌더 → 창문마다 독립된 미니 눈밭.
- 해결: 날씨 파티클 필드를 **컨테이너(방) 좌표에 정렬**. DecorationOverlay에서 유리(weatherArea) 좌상단을 컨테이너 px로 구해(`glassLeft/glassTop`) 필드를 음수 오프셋(`fieldX=-glassLeft` 등), 필드 크기는 컨테이너(box.w×box.h)로 둠.
  - 결과: 모든 창문이 같은 하나의 하늘 레이아웃의 다른 부분을 들여다봄. 스크롤 시 창밖 하늘이 제자리에 있는 원경 패럴랙스. 파티클이 방 스케일 → 미니 눈밭이 아니라 진짜 창밖 하늘.
  - 한계: 각 창문은 여전히 별도 `WeatherFX` 인스턴스라 공간 정렬은 같지만 애니메이션 위상은 다를 수 있음(창문 1개면 무관, 여러 개여도 벽으로 분리돼 연속성 안 보임).
- `weatherMask` 필드·win_001_mask.png는 현재 렌더에서 미사용(area+오프셋 방식 채택). 향후 비정형 창문용으로 보존 — 불필요하면 제거 가능.
- 기본 방 그려진 창문 6개는 사용자가 "OK"라 그대로(각자 box-scale `WeatherFX`).

## 주의
- 페인팅 순서: 같은 stacking 안에서 absolute는 static 형제보다 위에 그려짐 → 프레임 `<img>`에 `position:relative; zIndex:1`, 날씨 레이어 `zIndex:0`으로 두어야 프레임이 날씨 위에 옴.
- 마스크 PNG는 프레임 PNG와 동일 종횡비(정사각)여야 `mask-size:100% 100%`가 정확히 정렬됨.
