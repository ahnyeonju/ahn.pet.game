# 펫 에셋 폴더 규칙

알(EGG_OPTIONS) 종류별로 단계(stage1/2/3)마다 모션·감정 webp를 넣는다.

## 폴더 구조

1·2단계는 **알별**로, 3단계는 **성향 기반 최종진화체별**로 나뉜다.

```
pets/
  {알id}/
    stage1/   ← 알 부화 직후 단계 (알별)
    stage2/   ← 성장 단계 (알별)
  stage3/
    {진화체}/  ← 최종 단계 (알 무관, 성향으로 결정)
```

알 id 6종: `egg_red` `egg_blue` `egg_green` `egg_yellow` `egg_purple` `egg_pink`
진화체 6종(FINAL_FORMS): `energetic` `intelligent` `affectionate` `lucky` `fashionable` `gluttonous`

## 각 stage 폴더에 넣을 파일

| 파일명 | 용도 | 비고 |
|---|---|---|
| `static.png` | 정적 이미지(멈춘 그림) | 상단 프로필·모션 fallback에 사용 |
| `stand.webp` | 가만히 있는 모션 | 모션 활성화에 필수 |
| `walk.webp` | 걷는 모션 | 모션 활성화에 필수 |
| `angry.webp` | 감정: 화남 | PET_EMOTIONS `angry` |
| `sad.webp` | 감정: 슬픔 | PET_EMOTIONS `sad` |
| `surprise.webp` | 감정: 놀람 | PET_EMOTIONS `surprise` |
| `smug.webp` | 감정: 의기양양 | PET_EMOTIONS `smug` |

- `static.png`가 없으면 이모지로 자동 fallback.
- `stand`/`walk` 둘 다 있어야 배회 모션이 켜진다. 없으면 `static.png`로 자동 fallback.
- 감정 파일은 연타 시 1회 재생. 없으면 `stand`로 fallback(말풍선만 표시).
- 감정 키 이름은 `App.jsx`의 `PET_EMOTIONS[].motion` 값과 일치해야 한다.

## 경로 해석 (App.jsx)

정적·모션 모두 같은 폴더를 본다.

- 1·2단계: `pets/{egg}/stage{pet.stage}/` 안의 `static.png` · `stand.webp` · `walk.webp`
- 3단계: `pets/stage3/{finalForm}/` 안의 `static.png` · `stand.webp` · `walk.webp`

해석 함수는 `getPetImg()`(정적)·`getPetMotion()`(모션)이며 분기 규칙이 동일하다.
감정 모션을 켜려면 `getPetMotion()` 반환 객체에 감정 키도 추가해야 한다(현재는 stand/walk만 반환).
