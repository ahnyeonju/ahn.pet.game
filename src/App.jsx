// 세이브 코드 압축/해제에 사용하는 LZString 라이브러리 (인라인, CDN 불필요)
import { useState, useEffect, useCallback, useRef } from "react";

const LZString = (function() {
  var f = String.fromCharCode;
  var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var baseReverseDic = {};
  function getBaseValue(alphabet, character) {
    if (!baseReverseDic[alphabet]) {
      baseReverseDic[alphabet] = {};
      for (var i=0; i<alphabet.length; i++) baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
    return baseReverseDic[alphabet][character];
  }
  var LZString = {
    compressToBase64: function(input) {
      if (input == null) return "";
      var res = LZString._compress(input, 6, function(a) { return keyStrBase64.charAt(a); });
      switch (res.length % 4) { case 0: return res; case 1: return res+"==="; case 2: return res+"=="; case 3: return res+"="; }
    },
    decompressFromBase64: function(input) {
      if (input == null) return "";
      if (input == "") return null;
      return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
    },
    _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
      if (uncompressed == null) return "";
      var i, value, context_dictionary={}, context_dictionaryToCreate={}, context_c="", context_wc="", context_w="",
          context_enlargeIn=2, context_dictSize=3, context_numBits=2, context_data=[], context_data_val=0, context_data_position=0, ii;
      for (ii=0; ii<uncompressed.length; ii+=1) {
        context_c = uncompressed.charAt(ii);
        if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) { context_dictionary[context_c] = context_dictSize++; context_dictionaryToCreate[context_c] = true; }
        context_wc = context_w + context_c;
        if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) { context_w = context_wc; } else {
          if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            if (context_w.charCodeAt(0)<256) {
              for (i=0; i<context_numBits; i++) { context_data_val=(context_data_val<<1); if (context_data_position==bitsPerChar-1) { context_data_position=0; context_data.push(getCharFromInt(context_data_val)); context_data_val=0; } else context_data_position++; }
              value = context_w.charCodeAt(0);
              for (i=0; i<8; i++) { context_data_val=(context_data_val<<1)|(value&1); if (context_data_position==bitsPerChar-1) { context_data_position=0; context_data.push(getCharFromInt(context_data_val)); context_data_val=0; } else context_data_position++; value=value>>1; }
            } else {
              value=1; for (i=0; i<context_numBits; i++) { context_data_val=(context_data_val<<1)|value; if (context_data_position==bitsPerChar-1) { context_data_position=0; context_data.push(getCharFromInt(context_data_val)); context_data_val=0; } else context_data_position++; value=0; }
              value=context_w.charCodeAt(0); for (i=0; i<16; i++) { context_data_val=(context_data_val<<1)|(value&1); if (context_data_position==bitsPerChar-1) { context_data_position=0; context_data.push(getCharFromInt(context_data_val)); context_data_val=0; } else context_data_position++; value=value>>1; }
            }
            context_enlargeIn--; if (context_enlargeIn==0) { context_enlargeIn=Math.pow(2,context_numBits); context_numBits++; }
            delete context_dictionaryToCreate[context_w];
          } else {
            value=context_dictionary[context_w]; for (i=0; i<context_numBits; i++) { context_data_val=(context_data_val<<1)|(value&1); if (context_data_position==bitsPerChar-1) { context_data_position=0; context_data.push(getCharFromInt(context_data_val)); context_data_val=0; } else context_data_position++; value=value>>1; }
          }
          context_enlargeIn--; if (context_enlargeIn==0) { context_enlargeIn=Math.pow(2,context_numBits); context_numBits++; }
          context_dictionary[context_wc]=context_dictSize++; context_w=String(context_c);
        }
      }
      if (context_w !== "") {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0; i<context_numBits; i++) { context_data_val=(context_data_val<<1); if (context_data_position==bitsPerChar-1) { context_data_position=0; context_data.push(getCharFromInt(context_data_val)); context_data_val=0; } else context_data_position++; }
            value=context_w.charCodeAt(0); for (i=0; i<8; i++) { context_data_val=(context_data_val<<1)|(value&1); if (context_data_position==bitsPerChar-1) { context_data_position=0; context_data.push(getCharFromInt(context_data_val)); context_data_val=0; } else context_data_position++; value=value>>1; }
          } else {
            value=1; for (i=0; i<context_numBits; i++) { context_data_val=(context_data_val<<1)|value; if (context_data_position==bitsPerChar-1) { context_data_position=0; context_data.push(getCharFromInt(context_data_val)); context_data_val=0; } else context_data_position++; value=0; }
            value=context_w.charCodeAt(0); for (i=0; i<16; i++) { context_data_val=(context_data_val<<1)|(value&1); if (context_data_position==bitsPerChar-1) { context_data_position=0; context_data.push(getCharFromInt(context_data_val)); context_data_val=0; } else context_data_position++; value=value>>1; }
          }
          context_enlargeIn--; if (context_enlargeIn==0) { context_enlargeIn=Math.pow(2,context_numBits); context_numBits++; }
          delete context_dictionaryToCreate[context_w];
        } else {
          value=context_dictionary[context_w]; for (i=0; i<context_numBits; i++) { context_data_val=(context_data_val<<1)|(value&1); if (context_data_position==bitsPerChar-1) { context_data_position=0; context_data.push(getCharFromInt(context_data_val)); context_data_val=0; } else context_data_position++; value=value>>1; }
        }
        context_enlargeIn--; if (context_enlargeIn==0) { context_enlargeIn=Math.pow(2,context_numBits); context_numBits++; }
      }
      value=2; for (i=0; i<context_numBits; i++) { context_data_val=(context_data_val<<1)|(value&1); if (context_data_position==bitsPerChar-1) { context_data_position=0; context_data.push(getCharFromInt(context_data_val)); context_data_val=0; } else context_data_position++; value=value>>1; }
      while (true) { context_data_val=(context_data_val<<1); if (context_data_position==bitsPerChar-1) { context_data.push(getCharFromInt(context_data_val)); break; } else context_data_position++; }
      return context_data.join('');
    },
    _decompress: function(length, resetValue, getNextValue) {
      var dictionary=[], next, enlargeIn=4, dictSize=4, numBits=3, entry="", result=[], i, w, bits, resb, maxpower, power, c,
          data={val:getNextValue(0), position:resetValue, index:1};
      for (i=0; i<3; i+=1) dictionary[i]=i;
      bits=0; maxpower=Math.pow(2,2); power=1;
      while (power!=maxpower) { resb=data.val&data.position; data.position>>=1; if (data.position==0) { data.position=resetValue; data.val=getNextValue(data.index++); } bits|=(resb>0?1:0)*power; power<<=1; }
      switch (next=bits) {
        case 0: bits=0; maxpower=Math.pow(2,8); power=1; while (power!=maxpower) { resb=data.val&data.position; data.position>>=1; if (data.position==0) { data.position=resetValue; data.val=getNextValue(data.index++); } bits|=(resb>0?1:0)*power; power<<=1; } c=f(bits); break;
        case 1: bits=0; maxpower=Math.pow(2,16); power=1; while (power!=maxpower) { resb=data.val&data.position; data.position>>=1; if (data.position==0) { data.position=resetValue; data.val=getNextValue(data.index++); } bits|=(resb>0?1:0)*power; power<<=1; } c=f(bits); break;
        case 2: return "";
      }
      dictionary[3]=c; w=c; result.push(c);
      while (true) {
        if (data.index>length) return "";
        bits=0; maxpower=Math.pow(2,numBits); power=1;
        while (power!=maxpower) { resb=data.val&data.position; data.position>>=1; if (data.position==0) { data.position=resetValue; data.val=getNextValue(data.index++); } bits|=(resb>0?1:0)*power; power<<=1; }
        switch (c=bits) {
          case 0: bits=0; maxpower=Math.pow(2,8); power=1; while (power!=maxpower) { resb=data.val&data.position; data.position>>=1; if (data.position==0) { data.position=resetValue; data.val=getNextValue(data.index++); } bits|=(resb>0?1:0)*power; power<<=1; } dictionary[dictSize++]=f(bits); c=dictSize-1; enlargeIn--; break;
          case 1: bits=0; maxpower=Math.pow(2,16); power=1; while (power!=maxpower) { resb=data.val&data.position; data.position>>=1; if (data.position==0) { data.position=resetValue; data.val=getNextValue(data.index++); } bits|=(resb>0?1:0)*power; power<<=1; } dictionary[dictSize++]=f(bits); c=dictSize-1; enlargeIn--; break;
          case 2: return result.join('');
        }
        if (enlargeIn==0) { enlargeIn=Math.pow(2,numBits); numBits++; }
        if (dictionary[c]) { entry=dictionary[c]; } else { if (c===dictSize) { entry=w+w.charAt(0); } else { return null; } }
        result.push(entry);
        dictionary[dictSize++]=w+entry.charAt(0);
        enlargeIn--;
        w=entry;
        if (enlargeIn==0) { enlargeIn=Math.pow(2,numBits); numBits++; }
      }
    }
  };
  return LZString;
})();

// ===================================================
// 마스터 데이터
// ===================================================
const GROWTH_THRESHOLDS = { stage2: 40, stage3: 100 };

const TRAITS = {
  energetic:    { label: "활발함", color: "#FF6B6B", emoji: "⚡" },
  intelligent:  { label: "지성",   color: "#4ECDC4", emoji: "📚" },
  affectionate: { label: "애정",   color: "#FF8FA3", emoji: "💕" },
  lucky:        { label: "행운",   color: "#FFD93D", emoji: "🍀" },
  fashionable:  { label: "꾸밈",   color: "#C77DFF", emoji: "✨" },
  gluttonous:   { label: "식탐",   color: "#F4A261", emoji: "🍰" },
};

// 키 = 주 성향. 가장 높은 성향이 곧 최종 형태로 결정됨(determineFinalForm).
// secondary는 동점 시 타이브레이크 + 설정 플레이버 용도. skill/skillEmoji는 미구현(표시만).
const FINAL_FORMS = {
  energetic:    { name: "장난꾸러기형", emoji: "🐱", secondary: "gluttonous",   skill: "장난치기",  skillEmoji: "😆", color: "#FF6B6B", shopUnlocks: ["bg_001", "win_001", "deco_001"] },
  intelligent:  { name: "똑똑형",      emoji: "🦉", secondary: "energetic",    skill: "꿈 해몽",    skillEmoji: "🌙", color: "#4ECDC4", shopUnlocks: ["bg_002", "win_002", "deco_001"] },
  affectionate: { name: "포근형",      emoji: "🐻", secondary: "intelligent",  skill: "응원 메시지",skillEmoji: "🌸", color: "#FF8FA3", shopUnlocks: ["bg_003", "win_001", "deco_001"] },
  lucky:        { name: "신비형",      emoji: "🦄", secondary: "affectionate", skill: "오늘의 운세",skillEmoji: "🔮", color: "#FFD93D", shopUnlocks: ["bg_004", "win_002", "deco_001"] },
  fashionable:  { name: "패션형",      emoji: "🦊", secondary: "lucky",        skill: "행운의 컬러",skillEmoji: "👗", color: "#C77DFF", shopUnlocks: ["bg_001", "win_002", "deco_001"] },
  gluttonous:   { name: "먹보형",      emoji: "🐼", secondary: "fashionable",  skill: "오늘 뭐 먹을까?",skillEmoji: "🍜", color: "#F4A261", shopUnlocks: ["bg_002", "win_001", "deco_001"] },
};

// 모든 3단계 펫이 공통 기본 탑재하는 기능. FINAL_FORMS.skill은 형태별 고유 스킬(기본 기능과 별개).
const BASE_SKILL = { name: "펫 챗봇", emoji: "💬" };


const EGG_OPTIONS = [
  { id: "egg_red",    color: "#FFCDD2", label: "붉은 알",  hint: "따뜻한 기운" },
  { id: "egg_blue",   color: "#BBDEFB", label: "파란 알",  hint: "시원한 바람" },
  { id: "egg_green",  color: "#C8E6C9", label: "초록 알",  hint: "싱그러운 향기" },
  { id: "egg_yellow", color: "#FFF9C4", label: "노란 알",  hint: "반짝반짝 빛" },
  { id: "egg_purple", color: "#E1BEE7", label: "보라 알",  hint: "신비로운 기운" },
  { id: "egg_pink",   color: "#FCE4EC", label: "분홍 알",  hint: "달콤한 느낌" },
];

const GIFT_MASTER = [
  { id:"g01", name:"반짝이는 공",    grade:"normal",    trait:"energetic",    val:1, emoji:"🎾" },
  { id:"g02", name:"두꺼운 백과사전",grade:"normal",    trait:"intelligent",  val:1, emoji:"📚" },
  { id:"g03", name:"하트 쿠션",      grade:"normal",    trait:"affectionate", val:1, emoji:"🫶" },
  { id:"g04", name:"행운의 클로버",  grade:"normal",    trait:"lucky",        val:1, emoji:"🍀" },
  { id:"g05", name:"리본 헤어핀",    grade:"normal",    trait:"fashionable",  val:1, emoji:"🎀" },
  { id:"g06", name:"맛있는 쿠키",    grade:"normal",    trait:"gluttonous",   val:1, emoji:"🍪" },
  { id:"g07", name:"황금 트로피",    grade:"rare",      trait:"energetic",    val:2, emoji:"🏆" },
  { id:"g08", name:"마법 책",        grade:"rare",      trait:"intelligent",  val:2, emoji:"✨" },
  { id:"g09", name:"포옹 인형",      grade:"rare",      trait:"affectionate", val:2, emoji:"🧸" },
  { id:"g10", name:"무지개 편자",    grade:"rare",      trait:"lucky",        val:2, emoji:"🌈" },
  { id:"g11", name:"다이아 왕관",    grade:"rare",      trait:"fashionable",  val:2, emoji:"👑" },
  { id:"g12", name:"특제 케이크",    grade:"rare",      trait:"gluttonous",   val:2, emoji:"🎂" },
  { id:"g13", name:"번개 결정체",    grade:"superrare", trait:"energetic",    val:3, emoji:"⚡" },
  { id:"g14", name:"전설의 마법서",  grade:"superrare", trait:"intelligent",  val:3, emoji:"📖" },
  { id:"g15", name:"별빛 하트",      grade:"superrare", trait:"affectionate", val:3, emoji:"💫" },
  { id:"g16", name:"황금 행운석",    grade:"superrare", trait:"lucky",        val:3, emoji:"🌟" },
  { id:"g17", name:"무지개 드레스",  grade:"superrare", trait:"fashionable",  val:3, emoji:"🦋" },
  { id:"g18", name:"무지개 케이크",  grade:"superrare", trait:"gluttonous",   val:3, emoji:"🍰" },
];

const RANDOM_EVENTS = [
  { type:"aurora",  name:"오로라가 뜨는 날",  emoji:"🌌", effect:"오늘 성장도 2배!", desc:"신비로운 오로라가 펼쳐졌어요" },
  { type:"gift",    name:"반짝이는 선물 발견", emoji:"🎁", effect:"뽑기 티켓 +1",    desc:"어디선가 선물이 나타났어요" },
  { type:"mess",    name:"어질러진 방",        emoji:"🧹", effect:"재화 +20",        desc:"청소하고 나니 재화가 생겼어요" },
  { type:"rainbow", name:"무지개가 뜨는 날",   emoji:"🌈", effect:"성향 스탯 +1 선택",desc:"무지개 빛이 성향을 키워줘요" },
];

const WEATHER_LIST = ["sunny","rain","snow","cloudy"];
// 날씨 메타(라벨·이모지). 하늘 색은 WEATHER_SKY 한 곳으로 일원화(창문·투명배경 백드롭 공유).
const WEATHER_META = {
  sunny:  { label:"맑음", emoji:"☀️" },
  rain:   { label:"비",   emoji:"🌧️" },
  snow:   { label:"눈",   emoji:"❄️" },
  cloudy: { label:"흐림", emoji:"☁️" },
  night:  { label:"밤",   emoji:"🌙" },
  sunset: { label:"노을", emoji:"🌅" },
};

// 날씨 하늘 그라데이션 — 모든 날씨 표현의 단일 소스. 창문(WindowOutside·RoomBackground)·투명 배경 백드롭이 공유.
const WEATHER_SKY = {
  sunny:  'linear-gradient(180deg,#7EC4F5 0%,#B8C6F0 52%,#FBD3E0 100%)',  // 파스텔 블루→라벤더→핑크
  rain:   'linear-gradient(180deg,#8FA6C4 0%,#BCC9DC 100%)',             // 칙칙함↓, 부드러운 블루그레이
  snow:   'linear-gradient(180deg,#C3D8F0 0%,#EEF5FC 100%)',             // 보송한 아이시 파스텔
  cloudy: 'linear-gradient(180deg,#B6C0CF 0%,#E0E6EE 100%)',             // 밝은 라벤더그레이
  night:  'linear-gradient(180deg,#2E2C54 0%,#5B4E86 55%,#B98AAE 100%)', // 드리미 트와일라잇(인디고→퍼플→핑크)
  sunset: 'linear-gradient(180deg,#8FA8E0 0%,#F2B6C6 52%,#FFD9B0 100%)', // 파스텔 노을(블루→핑크→피치)
};

// 날씨별 하늘 이미지(선택) — 확장자 없는 "베이스 경로". 값을 비우면 그라데이션만 사용.
// WEATHER_IMG_EXTS 순서대로 레이어를 쌓아, 존재하는 파일이 표시됨 → sunny.webp/png/jpg 아무거나 넣어도 동작.
// 어떤 이미지도 없으면 WEATHER_SKY 그라데이션으로 폴백. WeatherFX(비·눈)는 항상 위에 유지.
const WEATHER_IMG_EXTS = ["webp", "png", "jpg"];  // 우선순위 순(앞이 위 레이어). 확장자 추가 가능.
const WEATHER_SKY_IMG = {
  sunny:  "/images/weather/sunny",
  rain:   "/images/weather/rain",
  snow:   "/images/weather/snow",
  cloudy: "/images/weather/cloudy",
  night:  "/images/weather/night",
  sunset: "/images/weather/sunset",
};
// 날씨 하늘의 CSS background 값 — 베이스 경로가 있으면 확장자별 url 레이어(존재하는 것만 표시) + 그라데이션 폴백.
function weatherSky(weather) {
  const grad = WEATHER_SKY[weather] || WEATHER_SKY.sunny;
  const base = WEATHER_SKY_IMG[weather];
  if (!base) return grad;
  const layers = WEATHER_IMG_EXTS.map(ext => `url(${base}.${ext}) center/cover no-repeat`);
  return `${layers.join(", ")}, ${grad}`;
}

// 밝은 날씨 배경 위 흰 글씨 가독성용 그림자(투명 UI 공통). 날씨 무관하게 대비 확보.
const TEXT_SH = "0 1px 3px rgba(0,0,0,.7)";
// 풀스크린(상점·미션·뽑기 등) 밝은 테마. 날씨 무관 고정. 허니/베이지 배경 + 진한 갈색 글씨.
const SCREEN_BG     = "linear-gradient(180deg,#F5E6C8 0%,#E8D49E 100%)";
const INK           = "#5A3E1B";              // 본문 진한 갈색 글씨
const INK_SUB       = "rgba(90,62,27,.6)";    // 보조 글씨
const INK_FAINT     = "rgba(90,62,27,.4)";    // 흐린 글씨
const CARD_BG       = "rgba(255,255,255,.45)"; // 크림 카드 배경
const CARD_BG_DIM   = "rgba(255,255,255,.28)"; // 미보유/비활성 카드
const CARD_BORDER   = "rgba(120,90,50,.28)";   // 카드 테두리
const PANEL_BTN     = "rgba(120,90,50,.16)";   // 작은 버튼/칩 배경
const WEATHER_HOURS    = { nightStart: 20, nightEnd: 6, sunsetStart: 17 };
const DAILY_EVENT_CHANCE = 0.30;
const GACHA_RATES      = { superrare: 3, rare: 20 };

// 상점 상품 목록. owned/equipped는 inv.shopItems에 분리 저장.
// 상품 추가 시 이 배열에 객체 1개만 추가하면 UI 자동 렌더링.
// 뽑기 선물(GIFT_MASTER)을 상점 판매용으로 파생 — 이름·이모지·성향·등급을 그대로 재사용(중복 입력 없음).
// GIFT_MASTER 한 곳만 수정하면 뽑기·상점 모두 반영. 가격은 등급별, 구매는 handleShopBuy의 gift_item 분기 사용.
const GIFT_GRADE_LABEL = { normal:"일반", rare:"희귀", superrare:"초레어" };
const GIFT_SHOP_PRICE  = { normal: 8, rare: 18, superrare: 35 };  // 상점 구매가(등급별)
const GIFT_SELL_PRICE  = { normal: 3, rare: 5, superrare: 8 };    // 선물함 판매가(등급별, 개당)
const GIFT_SHOP_ITEMS = GIFT_MASTER.map(g => ({
  id: `gift_${g.id}`, category: "gift_item", giftRef: g.id,
  price: GIFT_SHOP_PRICE[g.grade],
  name: g.name, emoji: g.emoji, grade: g.grade, trait: g.trait, traitValue: g.val,
  imagePath: g.imagePath ?? null,
  description: `${TRAITS[g.trait].label} 성향 +${g.val} · ${GIFT_GRADE_LABEL[g.grade]} 선물`,
}));

// 진화형별 전용 상점 아이템. inv.formEvents[formKey].shopEventDone이 true일 때만 상점에 노출됨.
// asset은 확장자 없는 경로 — ShopItemImage가 webp/png/jpg 순으로 시도.
// 아이템 추가 시 이 배열에만 추가하면 Shop·구매·저장 모두 자동 반영.
const FORM_SHOP_ITEMS = [
  { id:"bg_energetic_001",     formKey:"energetic",    category:"background", name:"활기찬 놀이터",    price:40, asset:"/images/shop/backgrounds/bg_energetic_001",     description:"장난꾸러기형 전용 활기찬 놀이터 배경이에요." },
  { id:"deco_energetic_001",   formKey:"energetic",    category:"decoration", name:"장난감 바구니",    price:20, asset:"/images/shop/decorations/deco_energetic_001",   description:"장난감이 가득한 바구니 장식이에요." },
  { id:"bg_intelligent_001",   formKey:"intelligent",  category:"background", name:"별빛 서재",        price:40, asset:"/images/shop/backgrounds/bg_intelligent_001",    description:"똑똑형 전용 별빛 서재 배경이에요." },
  { id:"deco_intelligent_001", formKey:"intelligent",  category:"decoration", name:"책 탑",            price:20, asset:"/images/shop/decorations/deco_intelligent_001",  description:"높이 쌓인 책 탑 장식이에요." },
  { id:"bg_affectionate_001",  formKey:"affectionate", category:"background", name:"포근한 침대방",    price:40, asset:"/images/shop/backgrounds/bg_affectionate_001",   description:"포근형 전용 아늑한 방 배경이에요." },
  { id:"deco_affectionate_001",formKey:"affectionate", category:"decoration", name:"하트 쿠션",        price:20, asset:"/images/shop/decorations/deco_affectionate_001", description:"포근한 하트 쿠션 장식이에요." },
  { id:"bg_lucky_001",         formKey:"lucky",        category:"background", name:"마법의 별숲",      price:40, asset:"/images/shop/backgrounds/bg_lucky_001",          description:"신비형 전용 마법의 별숲 배경이에요." },
  { id:"deco_lucky_001",       formKey:"lucky",        category:"decoration", name:"행운의 별",        price:20, asset:"/images/shop/decorations/deco_lucky_001",        description:"빛나는 행운의 별 장식이에요." },
  { id:"bg_fashionable_001",   formKey:"fashionable",  category:"background", name:"패션 스튜디오",    price:40, asset:"/images/shop/backgrounds/bg_fashionable_001",    description:"패션형 전용 스튜디오 배경이에요." },
  { id:"deco_fashionable_001", formKey:"fashionable",  category:"decoration", name:"드레스 행거",      price:20, asset:"/images/shop/decorations/deco_fashionable_001",  description:"예쁜 옷이 걸린 행거 장식이에요." },
  { id:"bg_gluttonous_001",    formKey:"gluttonous",   category:"background", name:"달콤한 과자 나라", price:40, asset:"/images/shop/backgrounds/bg_gluttonous_001",     description:"먹보형 전용 달콤한 과자 나라 배경이에요." },
  { id:"deco_gluttonous_001",  formKey:"gluttonous",   category:"decoration", name:"배추 의자",        price:20, asset:"/images/shop/decorations/deco_gluttonous_001",   description:"먹보형 전용 아늑한 배추 의자예요.",
    interaction: { enabled:true, type:"composite", compositeAsset:"/images/shop/interactions/deco_gluttonous_001_pet", allowedForms:["gluttonous"], hitRadiusPx:260, compositeWidthPx:600 } },
];

const SHOP_MASTER = [
  // ── background ──────────────────────────────────────────
  {
    id: "bg_default",
    name: "기본 날씨 배경",
    category: "background",
    price: 0,
    imagePath: null,
    description: "날씨에 따라 변하는 기본 배경",
    isDefault: true,
  },
  // 예시 (파일 추가 후 price/description 수정):
  { id:"bg_001", name:"오로라 설산", category:"background", price:30, imagePath:"/images/shop/backgrounds/bg_001.png", description:"신비로운 우주 배경" },
  { id:"bg_002", name:"크리스마스 배경", category:"background", price:30, imagePath:"/images/shop/backgrounds/bg_002.png", description:"크리스마스의 아늑한 배경" },
  { id:"bg_003", name:"따듯한 집안", category:"background", price:30, imagePath:"/images/shop/backgrounds/bg_003.png", description:"따뜻한 집안 배경" },
  { id:"bg_004", name:"해질녘 바다", category:"background", price:30, imagePath:"/images/shop/backgrounds/bg_004.png", description:"노을이 지는 바닷가 배경" },  

  // ── decoration ───────────────────────────────────────────
  // 예시:
  { id:"deco_001", name:"야옹 이글루", category:"decoration", price:15, imagePath:"/images/shop/decorations/deco_001.png", description:"밖은 서늘하지만 안쪽은 아늑한 야옹이 이글루에요." },

  // ── window ───────────────────────────────────────────────
  // decoration과 동일하게 방에 배치되지만 벽(상단) 영역에만 놓인다.
  // weatherMask: 유리 모양 알파 마스크 PNG(창문 PNG와 같은 해상도). 불투명 영역만 하늘이 비침 → 곡선 창도 지원.
  { id:"win_001", name:"동그란 창문", category:"window", price:10, imagePath:"/images/shop/windows/win_001.png", description:"벽에 다는 아늑한 동그란 창문이에요.",
    weatherMask:"/images/shop/windows/win_001_mask.png" },
  { id:"win_002", name:"하트 창문", category:"window", price:10, imagePath:"/images/shop/windows/win_002.png", description:"벽에 다는 하트 창문이에요.",
    weatherMask:"/images/shop/windows/win_002_mask.png" },

  // ── gift_item ── 뽑기 선물(GIFT_MASTER)을 파생 주입. 구매 즉시 inv.gifts에 인스턴스 추가(handleShopBuy).
  ...GIFT_SHOP_ITEMS,

  // ── form_exclusive ── 진화형 이벤트 확인 후 노출되는 전용 아이템. Shop에서 formKey로 필터링.
  ...FORM_SHOP_ITEMS,
];

// 이미지가 없을 때 카테고리별 이모지 fallback
const CATEGORY_FALLBACK = {
  background:  "🖼️",
  decoration:  "🎪",
  window:      "🪟",
  gift_item:   "🎁",
  special:     "⭐",
};

// 방에 오버레이로 배치되고 "장식" 탭에 함께 표시되는 카테고리
const DECOR_CATEGORIES = ["decoration", "window"];
// 카테고리별 1회 구매 시 지급되는 개수. 창문은 묶음 6개, 장식품은 1개씩 무한 구매.
// 보유 개수만큼 같은 종류를 방에 여러 개 배치할 수 있다(placedDecos).
const PURCHASE_QTY = { window: 6, decoration: 1 };
// 카테고리별 방 배치 y 범위(%)와 기본 배치 y. 창문은 벽(상단)에만 놓인다.
const PLACEMENT_BOUNDS = {
  decoration: { minY: 5, maxY: 95, defY: 50 },
  window:     { minY: 5, maxY: 45, defY: 25 },
};
const placementBounds = (category) => PLACEMENT_BOUNDS[category] || PLACEMENT_BOUNDS.decoration;
// 데코 가로 배치 범위(%) — 방 전체(가로 3배=300%) 기준. 첫 1/3이 아닌 전 영역에 배치.
const DECOR_X = { min: 3, max: 297 };

// 기준 해상도 — 유니티 Canvas Scaler의 Reference Resolution 개념.
// 방에 배치되는 오브젝트(데코) 크기는 절대 px이 아니라, 에셋 원본 px을 이 기준 폭으로 나눈
// 비율(PPU=1)을 실제 컨테이너 폭에 곱해 정한다. → 기기마다 화면 폭 대비 동일 비율, 종횡비 유지.
const REFERENCE_RESOLUTION = { width: 1080, height: 2340 }; // 9:19.5 FHD+
// 펫 디자인 폭(기준 1080 기준 px). 데코와 동일 공식으로 크기 산출 → 데코·배경과 비율 고정.
const PET_REF_WIDTH = 320;

// 펫이 바닥에 서 있는 기준선 (% from top). 데코의 발(바닥 접점)이 이 값보다 아래면
// 데코가 펫 앞으로, 위면 펫이 데코 앞으로 렌더된다 (2.5D Y-정렬).
const PET_BASE_Y = 65;
// z-index 밴드: 게임 오브젝트(배경·펫·데코)는 0~150에서 바닥선 기준 정렬, UI는 그 위.
const Z_UI = { panel: 200, evoBubble: 250, decorCtrl: 300 };

const MISSION_REWARDS  = {
  feed:        { growth: 5,  statusKey: "hunger",    statusGain: 30 },
  clean:       { growth: 4,  statusKey: "cleanness", statusGain: 30 },
  play:        { growth: 8,  statusKey: "mood",      statusGain: 30 },
  gift:        { currency: 5 },
  statusCheck: { currency: 10 },
  allComplete: { tickets: 2 },
};

const EVENT_REWARDS    = {
  gift:    { tickets: 1 },
  mess:    { currency: 20 },
  aurora:  { growthMultiplier: 2 },
  rainbow: { traitGain: 1 },
};

const INITIAL_STATUS   = { hunger: 80, mood: 80, cleanness: 80 };
const INITIAL_TICKETS  = 3;

const MINIGAME_CONFIG  = { numMin: 2, numRange: 8, wrongCount: 3, wrongRange: 10, wrongOffset: 5, timerIcon: "/images/minigame/timer", timerIconSize: 44 };

// ===================================================
// 유틸
// ===================================================
const getTodayStr = () => new Date().toISOString().split("T")[0];

function getWeather() {
  const h = new Date().getHours();
  if (h >= WEATHER_HOURS.nightStart || h < WEATHER_HOURS.nightEnd) return "night";
  if (h >= WEATHER_HOURS.sunsetStart && h < WEATHER_HOURS.nightStart) return "sunset";
  return WEATHER_LIST[parseInt(getTodayStr().replace(/-/g,"")) % 4];
}

function drawGift() {
  const r = Math.random() * 100;
  const grade = r < GACHA_RATES.superrare ? "superrare" : r < GACHA_RATES.rare ? "rare" : "normal";
  const pool = GIFT_MASTER.filter(g => g.grade === grade);
  const base = pool[Math.floor(Math.random() * pool.length)];
  return { ...base, traitValue: base.val, instanceId: `${Date.now()}_${Math.random()}` };
}

function determineFinalForm(traits, giftHistory) {
  // 가장 높은 성향이 곧 최종 형태(키=성향). 동점 시 부 성향 → 선물 이력 → 랜덤 순으로 타이브레이크.
  const maxVal = Math.max(...Object.values(traits));
  const tops = Object.keys(traits).filter(k => traits[k] === maxVal);
  if (tops.length === 1) return tops[0];
  // 1차: 후보들 중 각자의 부 성향 값이 가장 높은 쪽.
  // 부 성향 키 자체가 동점 후보(tops)에 속하면 자기 자신을 참조하는 셈이므로 0으로 처리.
  const secScore = k => { const sec = FINAL_FORMS[k].secondary; return tops.includes(sec) ? 0 : traits[sec]; };
  const secMax = Math.max(...tops.map(secScore));
  const secWinners = tops.filter(k => secScore(k) === secMax);
  if (secWinners.length === 1) return secWinners[0];
  // 2차: 선물 이력에서 마지막으로 준 성향 → 그래도 없으면 랜덤
  const lastTrait = [...giftHistory].reverse().find(g => secWinners.includes(g.trait))?.trait;
  return lastTrait || secWinners[Math.floor(Math.random() * secWinners.length)];
}

const rollDailyEvent = () => Math.random() <= DAILY_EVENT_CHANCE
  ? RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)] : null;

// ===================================================
// 초기 상태
// ===================================================
const PET_NAME_MAX  = 8;                              // 펫 이름 최대 글자수
const PET_NAME_RE   = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]+$/; // 한글·영문·숫자만 (특수문자·공백 제외)
const DEFAULT_PET = {
  name: "", stage: 1, growthPoint: 0,
  traits: { energetic:0, intelligent:0, affectionate:0, lucky:0, fashionable:0, gluttonous:0 },
  finalForm: null,
  status: { ...INITIAL_STATUS },
};
const DEFAULT_DAILY = {
  date:"", missions:{ feed:false, play:false, clean:false, gift:false, statusCheck:false, allCompleted:false },
  claimed:{ feed:false, play:false, clean:false, gift:false, statusCheck:false, allComplete:false },
  giftCount:0, freeGachaDone:false,
  event:null, eventRewardClaimed:false, growthMultiplier:1, rainbowDone:false,
};
const DEFAULT_INV = {
  gifts:[], tickets:INITIAL_TICKETS, currency:0, unlockedPets:[],
  shopItems: { bg_default: { owned:true, equipped:true } },
  placedDecos: [],  // 방에 배치된 데코/창문 인스턴스 [{ iid, itemId, position:{x,y}, isFixed }]
  formEvents: {},   // { [formKey]: { shopEventDone: true } } — 형태별 1회성 이벤트 완료 여부
};

const loadState = () => { try { const r=localStorage.getItem("tama_v2"); return r?JSON.parse(r):null; } catch{return null;} };

// 불러온 inv를 현재 스키마로 정규화. 구버전(shopItems에 position을 들고 있던 단일 데코)을
// placedDecos 인스턴스 + count 보유 모델로 이주한다. 신규 세이브는 변경 없이 통과.
const normalizeInv = (raw) => {
  const inv = { ...DEFAULT_INV, ...raw };
  inv.placedDecos = Array.isArray(inv.placedDecos) ? [...inv.placedDecos] : [];
  const shop = { ...inv.shopItems };
  Object.entries(shop).forEach(([id, s]) => {
    const m = SHOP_MASTER.find(x => x.id === id);
    if (!m || !DECOR_CATEGORIES.includes(m.category)) return;
    if (s.count == null) {  // 구스키마: count 없음 → 이주
      if (s.equipped && s.position) {
        inv.placedDecos.push({ iid:`${id}_mig`, itemId:id, position:s.position, isFixed:s.isFixed ?? false });
      }
      shop[id] = { owned:true, count: PURCHASE_QTY[m.category] ?? 1 };
    }
  });
  inv.shopItems = shop;
  if (!inv.formEvents || typeof inv.formEvents !== "object") inv.formEvents = {};
  return inv;
};
const saveState = s => { try { localStorage.setItem("tama_v2",JSON.stringify(s)); } catch{} };

// ===================================================
// CSS
// ===================================================
const CSS = `
/* 폰트 self-host (CDN 의존 제거, 오프라인 보장 — P8 철학). public/fonts/ 의 woff2 사용 */
@font-face{font-family:'Nunito';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/nunito-500.woff2') format('woff2');}
@font-face{font-family:'Nunito';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/nunito-700.woff2') format('woff2');}
@font-face{font-family:'Nunito';font-style:normal;font-weight:800;font-display:swap;src:url('/fonts/nunito-800.woff2') format('woff2');}
@font-face{font-family:'Nunito';font-style:normal;font-weight:900;font-display:swap;src:url('/fonts/nunito-900.woff2') format('woff2');}
@font-face{font-family:'Jua';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/jua-400.woff2') format('woff2');}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
body{font-family:'Nunito',sans-serif;background:#111;display:flex;justify-content:center;align-items:center;min-height:100dvh;overflow:hidden;}
.shell{width:min(100vw,420px);flex-shrink:0;height:100dvh;position:relative;overflow:hidden;box-shadow:0 0 80px rgba(0,0,0,.7);}
@media(min-width:480px){.shell{border-radius:36px;height:910px;max-height:910px;}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes pop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(255,215,0,.4)}50%{box-shadow:0 0 70px rgba(255,215,0,.9)}}
@keyframes snowfall{0%{transform:translateY(-10px) translateX(0);opacity:1}100%{transform:translateY(100vh) translateX(30px);opacity:0}}
@keyframes rainfall{0%{transform:translateY(-10px);opacity:1}100%{transform:translateY(100vh);opacity:.3}}
@keyframes tooltipIn{from{opacity:0;transform:scale(.8) translateY(4px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes confettiBurst{0%{transform:translate(-50%,-50%) rotate(0) scale(.3);opacity:0}8%{opacity:1}68%{opacity:1}100%{transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) rotate(var(--rot)) scale(.85);opacity:0}}
@keyframes foamPop{from{transform:translate(-50%,-50%) scale(0);opacity:0}60%{transform:translate(-50%,-50%) scale(1.12)}to{transform:translate(-50%,-50%) scale(1);opacity:1}}
@keyframes sprayFly{0%{transform:translate(-50%,-50%) rotate(var(--rot)) scaleY(.35);opacity:0}18%{opacity:.95}100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) rotate(var(--rot)) scaleY(1.2);opacity:0}}
@keyframes sparkleTwinkle{0%{transform:translate(-50%,-50%) scale(0) rotate(0);opacity:0}40%{transform:translate(-50%,-50%) scale(1) rotate(25deg);opacity:1}100%{transform:translate(-50%,-50%) scale(0) rotate(60deg);opacity:0}}
@keyframes sparkleLoop{0%,100%{transform:translate(-50%,-50%) scale(.35) rotate(0);opacity:.2}50%{transform:translate(-50%,-50%) scale(1) rotate(22deg);opacity:1}}
.btn-action{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:none;cursor:pointer;transition:transform .15s,opacity .15s;}
.btn-action:active{transform:scale(.9);}
.btn-side{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:none;cursor:pointer;transition:transform .15s;}
.btn-side:active{transform:scale(.88);}
`;

// ===================================================
// 앱
// ===================================================
// 큰 이벤트 팝업(EventPopup) 비활성화 스위치. false면 좌측 미니 팝업(이벤트 카드+툴팁)만 사용.
// 컴포넌트·렌더·트리거는 보존 — 나중에 true로 바꾸면 자동 팝업 재활성.
const EVENT_POPUP_ENABLED = false;

export default function App() {
  const saved = loadState();
  const [screen, setScreen] = useState(saved?.egg ? "home" : "egg_select");  // egg 미선택(첫 시작·새 펫 대기)이면 알 선택 화면
  const [egg,    setEgg]    = useState(saved?.egg   || null);
  const [pet,    setPet]    = useState(saved?.pet   || DEFAULT_PET);
  const [daily,  setDaily]  = useState(saved?.daily || DEFAULT_DAILY);
  const [inv,    setInv]    = useState(saved?.inv ? normalizeInv(saved.inv) : DEFAULT_INV);
  const [ghist,  setGhist]  = useState(saved?.ghist || []);
  const [popup,  setPopup]  = useState(null);
  const [evoData,setEvoData]= useState(null);
  const [toast,  setToast]  = useState(null);
  const [game,   setGame]   = useState(null);
  const [selGift,setSelGift]= useState(null);
  const [lastDraw,setLastDraw]= useState(null);
  const [devMode,    setDevMode]    = useState(false);
  const [shopBubbleLocked, setShopBubbleLocked] = useState(false);
  const [devWeather, setDevWeather] = useState(null); // null = 실제 날씨 사용
  const newPetRef = useRef(false);  // "다른 펫 키우기" 진입 시 handleEggSelect가 inv·daily를 보존하도록 표시
  const [feedTick, setFeedTick] = useState(0);  // 밥 줄 때마다 증가 → 펫이 밥 먹는 연출 트리거

  const weather = (import.meta.env.DEV && devWeather) ? devWeather : getWeather();
  const wm = WEATHER_META[weather];

  // 매일 초기화
  useEffect(() => {
    const today = getTodayStr();
    if (daily.date !== today) {
      const ev = rollDailyEvent();
      setDaily({ ...DEFAULT_DAILY, date:today, event:ev, growthMultiplier: ev?.type==="aurora"?EVENT_REWARDS.aurora.growthMultiplier:1 });
      if (ev && EVENT_POPUP_ENABLED && screen !== "egg_select") setTimeout(() => setPopup("event"), 900);  // 큰 팝업 비활성(미니만)·펫 선택화면 제외
    }
  }, []);

  // 저장
  useEffect(() => {
    if (screen !== "egg_select") saveState({ egg, pet, daily, inv, ghist });
  }, [egg, pet, daily, inv, ghist, screen]);


  const showToast = useCallback((msg, type="ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2300);
  }, []);

  const markMissionDone = useCallback((key) => {
    if (daily.missions[key]) { showToast("이미 완료한 미션이에요!", "warn"); return false; }
    const nm = { ...daily.missions, [key]:true };
    if (["feed","play","clean","gift","statusCheck"].every(k => nm[k])) nm.allCompleted = true;
    setDaily(d => ({ ...d, missions:nm }));
    return true;
  }, [daily.missions, showToast]);

  const claimReward = useCallback((key) => {
    const cl = daily.claimed || {};
    if (key === "allComplete") {
      if (cl.allComplete) return;
      if (!["feed","play","clean","gift","statusCheck"].every(k => cl[k])) return;
      setDaily(d => ({ ...d, claimed: { ...(d.claimed||{}), allComplete:true } }));
      setInv(i => ({ ...i, tickets: i.tickets + MISSION_REWARDS.allComplete.tickets }));
      showToast(`🎫 전체 완료 보너스! 티켓 ${MISSION_REWARDS.allComplete.tickets}장!`, "gold");
      return;
    }
    if (!daily.missions[key] || cl[key]) return;
    setDaily(d => ({ ...d, claimed: { ...(d.claimed||{}), [key]:true } }));
    if (MISSION_REWARDS[key]?.currency > 0) {
      setInv(i => ({ ...i, currency: i.currency + MISSION_REWARDS[key].currency }));
      showToast(`💰 재화 +${MISSION_REWARDS[key].currency}`);
    } else if (MISSION_REWARDS[key]?.growth > 0) {
      setPet(p => ({ ...p, growthPoint: p.growthPoint + MISSION_REWARDS[key].growth * daily.growthMultiplier }));
      showToast(`🌱 성장 +${MISSION_REWARDS[key].growth * daily.growthMultiplier}${daily.growthMultiplier > 1 ? " 2배 적용!" : ""}`);
    } else {
      showToast("✅ 보상 수령!");
    }
  }, [daily, showToast]);

  // 액션
  // 액션은 여러 번 실행(상태 회복·모션 매번), 미션 마킹(보상)은 하루 1회.
  const handleFeed  = () => {
    setPet(p=>({...p,status:{...p.status,hunger:Math.min(100,p.status.hunger+MISSION_REWARDS.feed.statusGain)}})); setFeedTick(t=>t+1);
    const first = !devMode && !daily.missions.feed; if(first) markMissionDone("feed");
    showToast(devMode ? "🔧 [DEV] 밥 효과 적용" : first ? "🍚 밥을 줬어요! 미션에서 보상을 받으세요." : "🍚 냠냠~ 잘 먹었어요!");
  };
  const handleClean = () => {
    setPet(p=>({...p,status:{...p.status,cleanness:Math.min(100,p.status.cleanness+MISSION_REWARDS.clean.statusGain)}}));
    const first = !devMode && !daily.missions.clean; if(first) markMissionDone("clean");
    showToast(devMode ? "🔧 [DEV] 씻기 효과 적용" : first ? "🛁 깨끗해졌어요! 미션에서 보상을 받으세요." : "🛁 깨끗해졌어요!");
  };
  const handleStatusCheck = () => { if(!devMode && !daily.missions.statusCheck) markMissionDone("statusCheck"); setPopup("status"); };
  const handlePlay = () => {
    const a=Math.floor(Math.random()*MINIGAME_CONFIG.numRange)+MINIGAME_CONFIG.numMin, b=Math.floor(Math.random()*MINIGAME_CONFIG.numRange)+MINIGAME_CONFIG.numMin, ans=a*b;
    const wrongs=[]; while(wrongs.length<MINIGAME_CONFIG.wrongCount){ const w=ans+(Math.floor(Math.random()*MINIGAME_CONFIG.wrongRange)-MINIGAME_CONFIG.wrongOffset); if(w!==ans&&w>0&&!wrongs.includes(w)) wrongs.push(w); }
    setGame({ a, b, answer:ans, choices:[ans,...wrongs].sort(()=>Math.random()-.5), done:false, startTime:Date.now() });
    setScreen("minigame");
  };
  const handleGameAnswer = choice => {
    if(choice===game.answer){
      const elapsed = (Date.now() - game.startTime) / 1000;
      const isPerfect = elapsed <= 3;
      setGame(g=>({...g,done:true,correct:true,elapsed,isPerfect}));
      setTimeout(()=>{ const first = !devMode && !daily.missions.play; if(first) markMissionDone("play"); setPet(p=>({...p,status:{...p.status,mood:Math.min(100,p.status.mood+MISSION_REWARDS.play.statusGain)}})); showToast(devMode?"🔧 [DEV] 정답!":first?"🎮 정답! 미션에서 보상을 받으세요.":"🎮 정답! 잘했어요!"); setScreen("home"); setGame(null); },900);
    } else {
      setGame(g=>({...g,done:true,correct:false}));
      setTimeout(()=>{ showToast("틀렸어요! 다시 도전하세요","warn"); setScreen("home"); setGame(null); },900);
    }
  };
  const handleGiftGive = () => {
    if(!selGift){ showToast("선물을 선택하세요","warn"); return; }
    const giftCount = daily.giftCount ?? 0;
    if(!devMode && giftCount >= 2){ showToast("오늘 선물을 모두 줬어요! (2/2)","warn"); return; }
    const g = inv.gifts.find(g=>g.instanceId===selGift); if(!g) return;
    setInv(i=>({...i, gifts:i.gifts.filter(x=>x.instanceId!==selGift)}));
    setPet(p=>({...p, traits:{...p.traits,[g.trait]:p.traits[g.trait]+g.traitValue}}));
    setGhist(h=>[...h,{trait:g.trait,grade:g.grade,traitValue:g.traitValue,at:Date.now()}]);
    const newCount = giftCount + 1;
    if(!devMode) {
      setDaily(d => {
        const nm = newCount === 1 ? { ...d.missions, gift:true } : d.missions;
        if(newCount === 1 && ["feed","play","clean","gift","statusCheck"].every(k=>nm[k])) nm.allCompleted = true;
        return { ...d, giftCount:newCount, missions:nm };
      });
    }
    const suffix = devMode ? " 🔧" : newCount === 1 ? " — 미션에서 보상을 받으세요." : "";
    showToast(`🎁 ${g.name} 선물! ${TRAITS[g.trait].label} +${g.traitValue}${suffix}`);
    setSelGift(null);
  };
  // 선물 판매 — 같은 종류(id) 중 qty개를 재화로 교환. 등급별 개당가(GIFT_SELL_PRICE) × qty 누적.
  const handleGiftSell = (giftId, qty) => {
    const same = inv.gifts.filter(g => g.id === giftId);
    if(same.length === 0) return;
    const n = Math.max(1, Math.min(qty, same.length));
    const gain = GIFT_SELL_PRICE[same[0].grade] * n;
    const removeIds = new Set(same.slice(-n).map(g => g.instanceId));  // 뒤에서 n개 제거(그룹 대표 인스턴스 보존)
    setInv(i => ({ ...i, currency: i.currency + gain, gifts: i.gifts.filter(g => !removeIds.has(g.instanceId)) }));
    showToast(`💰 ${same[0].name} ${n}개 판매 +${gain}`);
    if(n >= same.length) setSelGift(null);  // 다 팔면 팝업 닫기
  };
  // ─── Dev 전용 액션 (DevPanel에서만 호출, import.meta.env.DEV 게이트) ───
  const devSetGrowth    = v   => setPet(p=>({...p,growthPoint:Math.max(0,Math.min(999,parseInt(v)||0))}));
  const devSetTrait     = (t,d)=> setPet(p=>({...p,traits:{...p.traits,[t]:Math.max(0,p.traits[t]+d)}}));
  const devForceForm    = fk  => { setPet(p=>({...p,stage:3,finalForm:fk,growthPoint:GROWTH_THRESHOLDS.stage3})); setInv(i=>({...i,unlockedPets:[...new Set([...i.unlockedPets,fk])]})); showToast(`🔧 ${FINAL_FORMS[fk].name} 강제 적용`); setPopup(null); };
  const devForceEvo     = s   => { if(s===2){ setEvoData({stage:2,finalForm:null}); } else { setEvoData({stage:3,finalForm:determineFinalForm(pet.traits,ghist)}); } setPopup("evolution"); };
  const devResetPet     = ()  => { setPet(p=>({...DEFAULT_PET,name:p.name})); setPopup(null); showToast("🔧 펫 리셋 (stage1·성장0)"); };  // 이름·알 유지, 단계·성장·성향·폼·케어 초기화
  const devResetDay     = ()  => { const ev=rollDailyEvent(); setDaily({...DEFAULT_DAILY,date:getTodayStr(),event:ev,growthMultiplier:ev?.type==="aurora"?EVENT_REWARDS.aurora.growthMultiplier:1}); if(ev && EVENT_POPUP_ENABLED) setTimeout(()=>setPopup("event"),900); showToast("🔧 하루 초기화"); };
  const devFillMissions = ()  => { setDaily(d=>({...d,missions:{...d.missions,feed:true,play:true,clean:true,gift:true,statusCheck:true,allCompleted:true}})); showToast("🔧 미션 모두 완료 처리"); };
  const devClaimAll     = ()  => {
    const cl = daily.claimed || {};
    let growth = 0, currency = 0, tickets = 0;
    ["feed","play","clean"].forEach(k => { if (daily.missions[k] && !cl[k]) growth += MISSION_REWARDS[k].growth * daily.growthMultiplier; });
    ["gift","statusCheck"].forEach(k => { if (daily.missions[k] && !cl[k]) currency += MISSION_REWARDS[k].currency; });
    if (daily.missions.allCompleted && !cl.allComplete) tickets += MISSION_REWARDS.allComplete.tickets;
    if (growth) setPet(p => ({ ...p, growthPoint: p.growthPoint + growth }));
    if (currency || tickets) setInv(i => ({ ...i, currency: i.currency + currency, tickets: i.tickets + tickets }));
    setDaily(d => ({ ...d, claimed: { feed:true, play:true, clean:true, gift:true, statusCheck:true, allComplete:true } }));
    showToast(`🔧 보상 수령: 성장 +${growth}, 재화 +${currency}, 티켓 +${tickets}`);
  };
  const devRollEvent    = ()  => { const ev=rollDailyEvent(); setDaily(d=>({...d,event:ev,eventRewardClaimed:false,growthMultiplier:ev?.type==="aurora"?EVENT_REWARDS.aurora.growthMultiplier:1})); if(ev && EVENT_POPUP_ENABLED) setTimeout(()=>setPopup("event"),300); showToast(ev?`🔧 이벤트: ${ev.name}`:"🔧 이벤트 없음 (30% 미달)"); };
  const devResetAll     = ()  => { const ev=rollDailyEvent(); setEgg(null); setPet(DEFAULT_PET); setDaily({...DEFAULT_DAILY,date:getTodayStr(),event:ev,growthMultiplier:ev?.type==="aurora"?EVENT_REWARDS.aurora.growthMultiplier:1}); setInv(DEFAULT_INV); setGhist([]); setPopup(null); setScreen("egg_select"); localStorage.removeItem("tama_v2"); showToast("🔧 전체 초기화 완료"); };

  const handleDraw = (isFree=false) => {
    if(isFree && daily.freeGachaDone){ showToast("오늘 무료 뽑기는 이미 사용했어요!","warn"); return; }
    if(!isFree && inv.tickets<1){ showToast("티켓이 없어요!","warn"); return; }
    const g = drawGift();
    if(isFree) { setInv(i=>({...i,gifts:[...i.gifts,g]})); setDaily(d=>({...d,freeGachaDone:true})); }
    else        { setInv(i=>({...i,tickets:i.tickets-1,gifts:[...i.gifts,g]})); }
    setLastDraw(g);
    showToast(`${g.grade==="superrare"?"🌟초레어":g.grade==="rare"?"💙희귀":"⚪일반"} ${g.name}!`, g.grade==="superrare"?"gold":"ok");
  };
  // ── 상점 핸들러 ──────────────────────────────────────────
  const handleShopBuy = (itemId) => {
    const item = SHOP_MASTER.find(i => i.id === itemId);
    if (!item || item.isDefault) return;
    const si = inv.shopItems[itemId];
    const stackable = DECOR_CATEGORIES.includes(item.category);  // 창문·장식품은 재구매로 수량 누적
    if (si?.owned && !stackable) { showToast("이미 보유한 상품이에요.", "warn"); return; }
    if (inv.currency < item.price) { showToast("재화가 부족해요!", "warn"); return; }

    if (item.category === "gift_item") {
      // 소모품 — inv.gifts에 즉시 인스턴스 추가
      const ref = GIFT_MASTER.find(g => g.id === item.giftRef);
      if (!ref) return;
      const instance = { ...ref, instanceId: `${ref.id}_${Date.now()}`, traitValue: ref.val };
      setInv(i => ({ ...i, currency: i.currency - item.price, gifts: [...i.gifts, instance] }));
    } else if (stackable) {
      // decoration / window — count 누적(창문 +6, 장식품 +1). 배치는 꾸미기 모드에서.
      const qty = PURCHASE_QTY[item.category] ?? 1;
      setInv(i => {
        const count = (i.shopItems[itemId]?.count || 0) + qty;
        return { ...i, currency: i.currency - item.price, shopItems: { ...i.shopItems, [itemId]: { owned:true, count } } };
      });
      showToast(`💰 -${item.price}  「${item.name}」 ${qty}개 구매 완료!`);
      return;
    } else {
      // background — owned/equipped 1개
      setInv(i => ({ ...i, currency: i.currency - item.price, shopItems: { ...i.shopItems, [itemId]: { owned:true, equipped:false } } }));
    }
    showToast(`💰 -${item.price}  「${item.name}」 구매 완료!`);
  };

  const handleShopEquip = (itemId) => {
    const item = SHOP_MASTER.find(i => i.id === itemId);
    if (!item) return;
    const si = inv.shopItems[itemId];
    if (!si?.owned && !item.isDefault) return;

    setInv(i => {
      const next = { ...i.shopItems };
      if (item.category === "background") {
        // 기존 background equipped 모두 해제 후 선택 항목 장착
        Object.keys(next).forEach(id => {
          const m = SHOP_MASTER.find(x => x.id === id);
          if (m?.category === "background") next[id] = { ...next[id], equipped: false };
        });
        // bg_default는 항상 owned
        if (itemId === "bg_default") next["bg_default"] = { owned:true, equipped:true };
        else next[itemId] = { ...next[itemId], equipped: true };
      } else if (DECOR_CATEGORIES.includes(item.category)) {
        next[itemId] = { ...next[itemId], equipped: !next[itemId]?.equipped };
      }
      return { ...i, shopItems: next };
    });
  };

  // 꾸미기 완료 시 draft 상태를 inv에 반영. draftDecos는 iid 키의 인스턴스 맵.
  const handleDecorSave = (draftBg, draftDecos) => {
    setInv(i => {
      const next = { ...i.shopItems };
      // 배경 — 기존 equipped 전부 해제 후 draft 적용
      Object.keys(next).forEach(id => {
        const m = SHOP_MASTER.find(x => x.id === id);
        if (m?.category === "background") next[id] = { ...next[id], equipped: false };
      });
      if (draftBg === "bg_default") next["bg_default"] = { owned: true, equipped: true };
      else if (draftBg && next[draftBg]) next[draftBg] = { ...next[draftBg], equipped: true };
      else next["bg_default"] = { owned: true, equipped: true };
      // 장식품/창문 — draft 인스턴스 맵을 placedDecos 배열로 저장(보유 count는 그대로)
      const placedDecos = Object.entries(draftDecos).map(([iid, s]) => ({
        iid, itemId: s.itemId, position: s.position, isFixed: s.isFixed ?? false,
      }));
      return { ...i, shopItems: next, placedDecos };
    });
  };
  // ─────────────────────────────────────────────────────────

  const handleEventReward = () => {
    const ev = daily.event; if(!ev||daily.eventRewardClaimed) return;
    if(ev.type==="gift")  { setInv(i=>({...i,tickets:i.tickets+EVENT_REWARDS.gift.tickets})); showToast(`🎫 티켓 +${EVENT_REWARDS.gift.tickets}`); }
    else if(ev.type==="mess")  { setInv(i=>({...i,currency:i.currency+EVENT_REWARDS.mess.currency})); showToast(`💰 재화 +${EVENT_REWARDS.mess.currency}`); }
    else if(ev.type==="rainbow"){ setPopup("rainbow"); return; }
    setDaily(d=>({...d,eventRewardClaimed:true})); setPopup(null);
  };
  const handleRainbow = trait => {
    setPet(p=>({...p,traits:{...p.traits,[trait]:p.traits[trait]+EVENT_REWARDS.rainbow.traitGain}}));
    setDaily(d=>({...d,eventRewardClaimed:true,rainbowDone:true}));
    showToast(`${TRAITS[trait].emoji} ${TRAITS[trait].label} +${EVENT_REWARDS.rainbow.traitGain}`); setPopup(null);
  };
  const handleEvoConfirm = () => {
    if(!evoData) return;
    setPet(p=>({...p,stage:evoData.stage,finalForm:evoData.finalForm||null}));
    if(evoData.finalForm) setInv(i=>({...i,unlockedPets:[...new Set([...i.unlockedPets,evoData.finalForm])]}));
    setEvoData(null); setPopup(null);
  };
  const canEvolve =
    (pet.stage === 1 && pet.growthPoint >= GROWTH_THRESHOLDS.stage2) ||
    (pet.stage === 2 && pet.growthPoint >= GROWTH_THRESHOLDS.stage3);
  const handleEvolve = () => {
    if (!canEvolve) return;
    if (pet.stage === 1) {
      setEvoData({ stage: 2, finalForm: null });
    } else {
      setEvoData({ stage: 3, finalForm: determineFinalForm(pet.traits, ghist) });
    }
    setPopup("evolution");
  };
  const handleEggSelect = (id, name) => {
    const newPet = { ...DEFAULT_PET, name };
    const keep = newPetRef.current; newPetRef.current = false;  // 다른 펫 키우기면 inv·daily 유지(처음 시작은 초기화)
    setEgg(id); setPet(newPet); setScreen("home");
    saveState({
      egg:id, pet:newPet,
      daily: keep ? daily : { ...DEFAULT_DAILY, date:getTodayStr() },
      inv:   keep ? inv   : DEFAULT_INV,
      ghist:[],
    });
  };
  // 다 키운 펫(최종 진화 완료)을 도감에 남기고 새 펫을 처음부터. inv·daily 유지, pet·egg·ghist만 초기화.
  const startNewPet = () => {
    newPetRef.current = true;
    setEgg(null); setPet(DEFAULT_PET); setGhist([]);
    setPopup(null); setScreen("egg_select");
    saveState({ egg:null, pet:DEFAULT_PET, daily, inv, ghist:[] });
  };
  const handleFormShopEvent = () => {
    const form = pet.finalForm ? FINAL_FORMS[pet.finalForm] : null;
    if (!form) return;
    const newShopItems = { ...inv.shopItems };
    (form.shopUnlocks || []).forEach(id => {
      if (!newShopItems[id]) newShopItems[id] = { owned: true, equipped: false };
    });
    setInv(i => ({
      ...i,
      currency: i.currency + 10,
      shopItems: newShopItems,
      formEvents: { ...i.formEvents, [pet.finalForm]: { shopEventDone: true } },
    }));
    setPopup(null);
    setScreen("shop");
  };

  const handleShare = () => {
    const text = `내 펫 ${getPetName()}을(를) 키우고 있어요! 🥚 함께 키워볼까요?`;
    if(navigator.share) navigator.share({ title:"내 펫 자랑", text, url: window.location.href }).catch(()=>{});
    else { navigator.clipboard?.writeText(text); showToast("📋 링크 복사됨!"); }
  };

  const handleExport = () => LZString.compressToBase64(JSON.stringify({ egg, pet, daily, inv, ghist }));

  const handleImport = (code) => {
    try {
      const data = JSON.parse(LZString.decompressFromBase64(code));
      if (!data.pet || !data.daily || !data.inv) return false;
      setEgg(data.egg);
      setPet(data.pet);
      setDaily(data.daily);
      setInv(normalizeInv(data.inv));
      setGhist(data.ghist || []);
      saveState({ egg:data.egg, pet:data.pet, daily:data.daily, inv:data.inv, ghist:data.ghist||[] });
      setPopup(null);
      setScreen("home");
      showToast("✅ 세이브 불러오기 성공!");
      return true;
    } catch {
      return false;
    }
  };

  const getPetEmoji = () => petEmojiOf(pet);
  const getPetName  = () => petNameOf(pet);
  const getPetImg   = () => petImgOf(egg, pet);
  const getPetMotion = () => petMotionOf(egg, pet);

  const growthMax = pet.stage===1 ? GROWTH_THRESHOLDS.stage2 : GROWTH_THRESHOLDS.stage3;
  const growthPct = Math.min(100,(pet.growthPoint/growthMax)*100);
  const missionDone = ["feed","play","clean","gift","statusCheck"].filter(k=>daily.missions[k]).length;

  return (
    <>
      <style>{CSS}</style>
      <div className="shell" style={{ background: screen!=="home" ? SCREEN_BG : weatherSky(weather), transition:"background 1.2s ease" }}>
        {toast && <Toast {...toast}/>}

        {screen==="egg_select" && <EggSelect onSelect={handleEggSelect}/>}

        {screen==="home" && (
          <HomeLayout
            pet={pet} daily={daily} inv={inv} weather={weather} wm={wm}
            growthPct={growthPct} growthMax={growthMax} missionDone={missionDone}
            getPetEmoji={getPetEmoji} getPetName={getPetName} getPetImg={getPetImg} getPetMotion={getPetMotion}
            canEvolve={canEvolve} feedSignal={feedTick}
            onFeed={handleFeed} onPlay={handlePlay} onClean={handleClean}
            onGiftNav={()=>setScreen("giftbox")} onStatusCheck={handleStatusCheck}
            onNav={setScreen} onShare={handleShare} onSettings={()=>setPopup("settings")} onEventClaim={handleEventReward}
            onDecorSave={handleDecorSave}
            onFormShopEvent={()=>{ setShopBubbleLocked(false); setPopup("formShopEvent"); }}
            onShopBubbleLock={()=>setShopBubbleLocked(true)}
          />
        )}

        {screen==="minigame" && game && <MiniGame game={game} onAnswer={handleGameAnswer} onBack={()=>setScreen("home")}/>}
        {screen==="mission"  && <MissionScreen daily={daily} onClaim={claimReward} onBack={()=>setScreen("home")}/>}
        {screen==="gacha"    && <GachaScreen inv={inv} daily={daily} lastDraw={lastDraw} onDraw={handleDraw} onBack={()=>setScreen("home")}/>}
        {screen==="giftbox"  && <GiftBox inv={inv} daily={daily} sel={selGift} onSel={setSelGift} onGive={handleGiftGive} onSell={handleGiftSell} onBack={()=>setScreen("home")}/>}
        {screen==="collection"&&<Collection inv={inv} onBack={()=>setScreen("home")}/>}
        {screen==="shop"     && <Shop inv={inv} onBuy={handleShopBuy} onBack={()=>setScreen("home")}/>}
        {screen==="skill"    && <SkillScreen pet={pet} onBack={()=>setScreen("home")}/>}
        {screen==="competition" && <PlaceholderScreen emoji="🏆" title="대회"     desc="다른 펫들과 실력을 겨루는 대회예요." onBack={()=>setScreen("home")}/>}
        {screen==="outing"      && <OutingScreen egg={egg} pet={pet} inv={inv} weather={weather} onBack={()=>setScreen("home")}/>}
        {screen==="social"      && <ARSocialScreen egg={egg} pet={pet} onBack={()=>setScreen("home")}/>}

        {popup==="status"    && <StatusPopup pet={pet} growthMax={growthMax} canEvolve={canEvolve} onEvolve={handleEvolve} onNewPet={()=>setPopup("newpet")} onClose={()=>setPopup(null)} petName={getPetName()} petMotion={getPetMotion()} petEmoji={getPetEmoji()}/>}
        {popup==="newpet"    && <NewPetConfirmPopup petName={getPetName()} onConfirm={startNewPet} onCancel={()=>setPopup("status")}/>}
        {popup==="event"     && daily.event && <EventPopup event={daily.event} claimed={daily.eventRewardClaimed} onClaim={handleEventReward} onClose={()=>setPopup(null)}/>}
        {popup==="rainbow"   && <RainbowPopup onChoose={handleRainbow} onClose={()=>setPopup(null)}/>}
        {popup==="evolution" && evoData && <EvoPopup data={evoData} egg={egg} onConfirm={handleEvoConfirm}/>}
        {popup==="settings"  && <SettingsPopup onClose={()=>setPopup(null)} onExport={handleExport} onImport={handleImport}/>}
        {popup==="formShopEvent" && pet.finalForm && <FormShopEventPopup form={FINAL_FORMS[pet.finalForm]} onConfirm={handleFormShopEvent} onClose={()=>setPopup(null)}/>}
        {shopBubbleLocked && <div style={{position:"absolute",inset:0,zIndex:8000}}/>}
        {popup==="devpanel" && import.meta.env.DEV && (
          <DevPanel
            pet={pet} daily={daily} devMode={devMode} devWeather={devWeather}
            onToggleDevMode={()=>setDevMode(d=>!d)}
            onClose={()=>setPopup(null)}
            onSetGrowth={devSetGrowth} onSetTrait={devSetTrait}
            onForceForm={devForceForm} onForceEvo={devForceEvo} onResetPet={devResetPet}
            onResetDay={devResetDay} onFillMissions={devFillMissions} onClaimAll={devClaimAll}
            onRollEvent={devRollEvent} onSetWeather={setDevWeather}
            onResetAll={devResetAll}
          />
        )}
        {import.meta.env.DEV && (
          <button
            onClick={()=>setPopup(p=>p==="devpanel"?null:"devpanel")}
            style={{position:"absolute",top:4,left:4,zIndex:9000,background:devMode?"#FF5722":"rgba(20,20,20,.85)",border:`1.5px solid ${devMode?"#FF5722":"rgba(255,87,34,.5)"}`,borderRadius:6,padding:"3px 8px",color:devMode?"#fff":"rgba(255,87,34,.8)",fontSize:9,fontWeight:900,cursor:"pointer",letterSpacing:0.5,lineHeight:1.6}}
          >
            {devMode?"🔧 DEV ON":"🔧 DEV"}
          </button>
        )}
      </div>
    </>
  );
}

// ===================================================
// 날씨 FX — 전체 화면 기준 파티클. 부모가 overflow:hidden이면 그 영역에만 클립됨.
// ===================================================
function WeatherFX({ weather }) {
  // 음수 delay(-위상)로 로드 시 이미 떨어지는 중인 상태부터 시작 → 위에서 처음 떨어지는 어색함 제거.
  // 위상은 각 파티클 주기에 황금비(0.618)로 분산해 화면 전체에 고르게 깔림.
  if (weather==="snow") return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {[...Array(16)].map((_,i)=>{
        const dur = 2 + i*.2, phase = ((i*.618)%1)*dur;
        return <div key={i} style={{position:"absolute",top:-10,left:`${5+i*6}%`,width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,.85)",animation:`snowfall ${dur}s linear -${phase.toFixed(2)}s infinite`}}/>;
      })}
    </div>
  );
  if (weather==="rain") return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {[...Array(22)].map((_,i)=>{
        const dur = .55 + i*.03, phase = ((i*.618)%1)*dur;
        return <div key={i} style={{position:"absolute",top:-10,left:`${i*4.5}%`,width:1.5,height:16,background:"rgba(180,220,255,.55)",animation:`rainfall ${dur}s linear -${phase.toFixed(2)}s infinite`}}/>;
      })}
    </div>
  );
  return null;
}

// 창문 유리 너머 "바깥" — 벽(배경)을 뚫고 하늘 + 날씨를 보여줌. 유리 모양은 알파 마스크 PNG로 클립(곡선 지원).
// 날씨 파티클 필드는 컨테이너(방) 좌표에 정렬(fieldX/Y/W/H) → 모든 창문이 같은 하나의 하늘을 공유
// (창문별 독립 파티클이 아니라 한 하늘의 다른 부분을 들여다봄). 프레임 PNG가 위(zIndex 1)에서 덮음.
function WindowOutside({ weather, mask, fieldX, fieldY, fieldW, fieldH }) {
  const sky = weatherSky(weather);
  // 마스크는 창문 PNG와 같은 영역(inset:0)을 덮고 100% 100%로 정렬. 불투명 픽셀에서만 하늘이 보임.
  const maskStyle = {
    WebkitMaskImage:`url(${mask})`, maskImage:`url(${mask})`,
    WebkitMaskSize:"100% 100%", maskSize:"100% 100%",
    WebkitMaskRepeat:"no-repeat", maskRepeat:"no-repeat",
  };
  return (
    <div style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden",...maskStyle}}>
      {fieldW>0 ? (
        // 그라데이션·파티클 모두 방 컨테이너 좌표(필드)에 정렬 → 모든 창문이 하나의 연속된 하늘 공유
        <div style={{position:"absolute",left:fieldX,top:fieldY,width:fieldW,height:fieldH,background:sky}}>
          <WeatherFX weather={weather}/>
        </div>
      ) : (
        <div style={{position:"absolute",inset:0,background:sky}}/>
      )}
    </div>
  );
}

// ===================================================
// 토스트
// ===================================================
function Toast({ msg, type }) {
  const bg = type==="gold"?"linear-gradient(135deg,#F7971E,#FFD200)":type==="warn"?"linear-gradient(135deg,#FF6B6B,#FF8E53)":"linear-gradient(135deg,#43C6AC,#4ECDC4)";
  return (
    <div style={{position:"absolute",top:56,left:0,right:0,margin:"0 auto",width:"fit-content",maxWidth:"90%",background:bg,color:"#fff",padding:"9px 20px",borderRadius:24,fontWeight:800,fontSize:13,zIndex:9999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.25)",animation:"pop .3s ease"}}>
      {msg}
    </div>
  );
}

// ===================================================
// 알 선택
// ===================================================
// 이미지 파일이 존재하면 <img>, 로드 실패(파일 없음)이면 이모지 fallback으로 렌더
// public/images/pets/ 에 파일만 넣으면 자동 적용됨
// ===================================================
function PetSprite({ size, emoji, imgSrc, style = {} }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [imgSrc]);

  if (!failed) {
    return (
      <img
        src={imgSrc}
        alt=""
        onError={() => setFailed(true)}
        style={{
          width: size, height: size,
          maxWidth: size, maxHeight: size,
          objectFit: "contain",
          display: "block",
          ...style,
        }}
      />
    );
  }
  return <span style={{ fontSize: size, lineHeight: 1, display: "inline-block", ...style }}>{emoji}</span>;
}

// ===================================================
// 펫 자율 행동 (보행/드래그/말풍선/연타감정) — POC 이식
// 수치·대사는 아래 마스터 상수에만. 시각 교체 지점은 MOTIONS(렌더 레이어).
// ===================================================
const PET_MOTION_CFG = {
  speed: 0.4, roamRadius: 110, arrive: 4,
  walkMin: 4000, walkMax: 7000,
  idleMin: 3000, idleMax: 8000,
  longRestEvery: 3, longRestMs: 12000,
  standAfterDrop: 2000, oneShotMs: 3000, bubbleMs: 1800,  // oneShotMs: 감정 모션 재생 시간(webp 1루프 ~1.1s → 약 2~3회 반복)
  feedMs: 5000,  // 밥 먹는 연출(밥 이미지 옆에 표시 + 멈춤) 지속 시간
  tapWindow: 1200, tapsForEmotion: 3, dragThresh: 8,
  floorTopPct: 0.64, floorBottomPct: 0.97,  // 펫 발이 머무는 마루 밴드(컨테이너 높이 대비)
};
const PET_LINES = ["안녕!", "배고파…", "놀자 놀자~", "오늘 기분 좋아", "쓰담쓰담 해줘", "히힝~", "어디 가?"];
const PET_EMOTIONS = [
  { motion: "angry", line: "그만 만져!" },
  { motion: "sad", line: "흑흑…" },
  { motion: "surprise", line: "꺄악!" },
];
// 먹기 모션 때 펫 옆에 뜨는 밥 아이콘. imgs를 순서대로 시도(png→webp), 전부 실패 시 emoji 폴백.
const FOOD_ICON = { imgs: ["/images/icons/food.png", "/images/icons/food.webp"], emoji: "🍚" };

// ── 펫 외형 순수 함수 (App의 getPet* 및 놀러가기 방문 렌더가 공유) ──
function petDirOf(egg, pet) { return pet.stage===3&&pet.finalForm ? `stage3/${pet.finalForm}` : `${egg||"egg_red"}/stage${pet.stage}`; }
function petEmojiOf(pet) { return pet.stage===3&&pet.finalForm ? FINAL_FORMS[pet.finalForm]?.emoji||"✨" : pet.stage===2?"🐣":"🥚"; }
function petNameOf(pet) { return pet.name || (pet.stage===3&&pet.finalForm ? FINAL_FORMS[pet.finalForm]?.name||`${pet.stage}단계` : `${pet.stage}단계`); }
function petImgOf(egg, pet) { return `/images/pets/${petDirOf(egg,pet)}/static.png`; }
function petMotionOf(egg, pet) {
  const dir = petDirOf(egg, pet);
  const m = { stand:`/images/pets/${dir}/stand.webp`, walk:`/images/pets/${dir}/walk.webp` };
  PET_EMOTIONS.forEach(e => { m[e.motion] = `/images/pets/${dir}/${e.motion}.webp`; });
  m.eat = `/images/pets/${dir}/eat.webp`;
  return m;
}
function petColorOf(pet) { return pet.stage===3&&pet.finalForm ? FINAL_FORMS[pet.finalForm].color : "#88d8b0"; }

// 모션 에셋 유무를 확인해 wandering / 정적 fallback 결정
function WanderingPet({ containerRef, scrollXRef, motion, staticImg, staticEmoji, petName, petColor, feedSignal, homeBiasX = 0, showShopBubble, onShopBubble, onShopBubbleLock, interactiveDecosRef, activeInteractionRef, onInteractionStart, onInteractionEnd }) {
  const [ready, setReady] = useState(null); // null=확인중, true=모션, false=정적fallback
  useEffect(() => {
    if (!motion?.stand || !motion?.walk) { setReady(false); return; }
    let alive = true, loaded = 0;
    const ok = () => { if (alive && ++loaded === 2) setReady(true); };
    const fail = () => { if (alive) setReady(false); };
    const ims = [motion.stand, motion.walk].map(src => {
      const im = new Image(); im.onload = ok; im.onerror = fail; im.src = src; return im;
    });
    return () => { alive = false; ims.forEach(im => { im.onload = im.onerror = null; }); };
  }, [motion?.stand, motion?.walk]);

  if (ready !== true) {
    // 정적 fallback — 기존 중앙 고정 펫과 동일 (모션 에셋 없는 폼)
    return (
      <div style={{position:"absolute",left:"50%",bottom:"32%",transform:`translateX(calc(-50% + ${homeBiasX}px))`,display:"flex",flexDirection:"column-reverse",alignItems:"center",gap:4,zIndex:Math.round(PET_BASE_Y),pointerEvents:"none",textAlign:"center"}}>
        <div style={{animation:"float 3s ease-in-out infinite",filter:`drop-shadow(0 8px 24px ${petColor}99)`,userSelect:"none"}}>
          <PetSprite size={96} emoji={staticEmoji} imgSrc={staticImg}/>
        </div>
        <div style={{fontFamily:"'Jua',sans-serif",fontSize:14,color:"#fff",textShadow:"0 2px 10px rgba(0,0,0,.65)",whiteSpace:"nowrap"}}>{petName}</div>
      </div>
    );
  }
  return <WanderingPetActive containerRef={containerRef} scrollXRef={scrollXRef} motion={motion} petName={petName} petColor={petColor} feedSignal={feedSignal} homeBiasX={homeBiasX} showShopBubble={showShopBubble} onShopBubble={onShopBubble} onShopBubbleLock={onShopBubbleLock} interactiveDecosRef={interactiveDecosRef} activeInteractionRef={activeInteractionRef} onInteractionStart={onInteractionStart} onInteractionEnd={onInteractionEnd}/>;
}

function WanderingPetActive({ containerRef, scrollXRef, motion, petName, petColor, feedSignal, homeBiasX = 0, showShopBubble, onShopBubble, onShopBubbleLock, interactiveDecosRef, activeInteractionRef, onInteractionStart, onInteractionEnd }) {
  const wrapRef = useRef(null), imgRef = useRef(null), bubbleRef = useRef(null), bubbleTextRef = useRef(null), foodRef = useRef(null);
  const feedSignalRef = useRef(feedSignal);
  useEffect(() => { feedSignalRef.current = feedSignal; }, [feedSignal]);  // 밥 신호를 루프가 ref로 읽음(루프 재시작 방지)
  const homeInitRef = useRef(false);  // true=진화 등 재실행, false=첫 마운트
  const showShopBubbleRef = useRef(showShopBubble);
  const onShopBubbleRef = useRef(onShopBubble);
  const onShopBubbleLockRef = useRef(onShopBubbleLock);
  const bubbleLockedRef = useRef(false);
  const onInteractionStartRef = useRef(onInteractionStart);
  const onInteractionEndRef   = useRef(onInteractionEnd);
  useEffect(() => {
    showShopBubbleRef.current = showShopBubble;
    if (!showShopBubble) bubbleLockedRef.current = false; // 확인 완료 후 리셋
  }, [showShopBubble]);
  useEffect(() => { onShopBubbleRef.current = onShopBubble; }, [onShopBubble]);
  useEffect(() => { onShopBubbleLockRef.current = onShopBubbleLock; }, [onShopBubbleLock]);
  useEffect(() => { onInteractionStartRef.current = onInteractionStart; }, [onInteractionStart]);
  useEffect(() => { onInteractionEndRef.current = onInteractionEnd; }, [onInteractionEnd]);

  useEffect(() => {
    const container = containerRef.current;
    const wrap = wrapRef.current, img = imgRef.current, bubble = bubbleRef.current, bubbleText = bubbleTextRef.current;
    if (!container || !wrap || !img) return;

    const C = PET_MOTION_CFG;
    const MOTIONS = { ...motion };  // stand·walk + 감정 키. 로드 실패 src는 failedSrc에 기록해 stand로
    const failedSrc = new Set();
    img.onerror = () => { failedSrc.add(curSrc); if (curSrc !== MOTIONS.stand) { curSrc = MOTIONS.stand; img.src = MOTIONS.stand; } };
    const STATE_MOTION = { idle: "stand", walk: "walk", grabbed: "stand", eating: "eat" };
    const now = () => performance.now();

    let W = 0, H = 0, floorTop = 0, floorBottom = 0, petSize = 0;
    const pet = { x: 0, y: 0, facing: 1, state: "idle", oneShotMotion: null };
    let home = { x: 0, y: 0 }, target = null;
    let walkUntil = 0, walkCount = 0, idleUntil = 0, motionUntil = 0, bubbleUntil = 0, curSrc = "";
    let eatUntil = 0, seenFeed = feedSignalRef.current;  // 밥 먹는 연출 종료시각 / 마지막으로 처리한 밥 신호

    function resize() {
      W = container.clientWidth; H = container.clientHeight;
      floorTop = H * C.floorTopPct; floorBottom = H * C.floorBottomPct;
      petSize = Math.round((PET_REF_WIDTH / REFERENCE_RESOLUTION.width) * W); // 데코와 동일 공식
      wrap.style.width = petSize + "px"; wrap.style.height = petSize + "px";
      if (foodRef.current) foodRef.current.style.fontSize = Math.round(petSize * 0.34) + "px";  // 밥 이미지 크기 = 펫 비례
    }
    function clampFloor(x, y) {  // x=월드 좌표(방 폭 3W), 발(중심+half)이 마루 밴드 안에 머물도록
      const half = petSize / 2;
      return {
        x: Math.max(half, Math.min(3 * W - half, x)),
        y: Math.max(floorTop - half, Math.min(floorBottom - half, y)),
      };
    }
    function roamPoint() {
      const r = Math.random() * C.roamRadius, a = Math.random() * Math.PI * 2;
      return clampFloor(home.x + Math.cos(a) * r, home.y + Math.sin(a) * r);
    }
    function pickTarget() {
      walkUntil = now() + C.walkMin + Math.random() * (C.walkMax - C.walkMin);
      target = roamPoint(); pet.state = "walk";
    }
    function moveToward() {
      const dx = target.x - pet.x, dy = target.y - pet.y, d = Math.hypot(dx, dy);
      if (d <= C.arrive) {
        if (now() < walkUntil) { target = roamPoint(); return; } // 걷기 시간 남음 → 이어 잡기
        target = null; pet.state = "idle"; walkCount++;
        idleUntil = now() + (walkCount % C.longRestEvery === 0
          ? C.longRestMs : C.idleMin + Math.random() * (C.idleMax - C.idleMin));
        return;
      }
      pet.x += (dx / d) * C.speed; pet.y += (dy / d) * C.speed;
      if (Math.abs(dx) > 0.5) pet.facing = dx > 0 ? 1 : -1;
    }
    function showBubble(text, ms = C.bubbleMs) { bubbleText.textContent = text; bubbleUntil = now() + ms; }
    function playOneShot(key) { pet.oneShotMotion = key; pet.state = "oneshot"; motionUntil = now() + C.oneShotMs; target = null; }
    function triggerEmotion() {
      const e = PET_EMOTIONS[Math.floor(Math.random() * PET_EMOTIONS.length)];
      playOneShot(e.motion); showBubble(e.line, C.oneShotMs);  // 말풍선을 감정 모션 길이만큼 유지
    }
    function startEating() {  // 멈춰서 밥 먹는 연출(보는 방향 옆에 밥 이미지) — feedMs 동안
      pet.state = "eating"; target = null; eatUntil = now() + C.feedMs;
      showBubble("냠냠~", C.feedMs);
    }

    function render() {
      const key = pet.state === "oneshot" ? pet.oneShotMotion : (STATE_MOTION[pet.state] || "stand");
      let src = MOTIONS[key] || MOTIONS.stand;  // 키→src
      if (failedSrc.has(src)) src = MOTIONS.stand;  // 로드 실패한 감정 webp는 stand로 폴백
      if (src !== curSrc) { img.src = src; curSrc = src; }  // 바뀔 때만(애니 리셋 방지)
      img.style.opacity = activeInteractionRef?.current ? "0" : "1";
      wrap.style.transform = `translate(${pet.x - scrollXRef.current - petSize / 2}px, ${pet.y - petSize / 2}px)`;  // 월드→화면: scrollX만큼 밀림(배경에 박힘)
      img.style.transform = `scaleX(${pet.facing})`;
      const footPct = ((pet.y + petSize / 2) / H) * 100;  // 동적 Y-정렬(데코와 동일 스케일)
      wrap.style.zIndex = String(Math.round(Math.min(150, Math.max(1, footPct))));
      bubble.style.opacity = (now() < bubbleUntil && pet.state !== "grabbed") ? "1" : "0";
      // 밥 이미지 — 먹는 중에만, 펫이 보는 방향(facing) 옆에 표시
      if (foodRef.current) {
        const eating = pet.state === "eating";
        foodRef.current.style.opacity = eating ? "1" : "0";
        foodRef.current.style.left = pet.facing > 0 ? "54%" : "-10%";
      }
    }

    let rafId = 0;
    function tick() {
      const t = now();
      if (feedSignalRef.current !== seenFeed) { seenFeed = feedSignalRef.current; if (pet.state !== "grabbed") startEating(); }
      switch (pet.state) {
        case "grabbed": break;
        case "oneshot": if (t >= motionUntil) { pet.state = "idle"; idleUntil = t + 400; } break;
        case "eating":  if (t >= eatUntil)    { pet.state = "idle"; idleUntil = t + 400; } break;
        case "walk": if (target) moveToward(); else pet.state = "idle"; break;
        default: if (t >= idleUntil) pickTarget();
      }
      // 상점 이벤트 말풍선 — 말풍선이 꺼지면 다시 표시
      if (showShopBubbleRef.current && !bubbleLockedRef.current && pet.state !== "grabbed" && pet.state !== "oneshot" && t >= bubbleUntil) {
        showBubble("저기 혹시 바빠?", 2500);
      }
      render();
      rafId = requestAnimationFrame(tick);
    }

    // ── 입력: 탭=대사/감정, 길게 끌기=잡아서 옮기기(월드 좌표). 펫 위 조작은 배경 스크롤로 안 샘 ──
    let down = null, lastTap = 0, tapCount = 0;
    function handleTap() {
      if (pet.state === "oneshot") return;
      const t = now();
      tapCount = (t - lastTap < C.tapWindow) ? tapCount + 1 : 1; lastTap = t;
      if (tapCount >= C.tapsForEmotion) { tapCount = 0; triggerEmotion(); }
      else if (showShopBubbleRef.current) {
        bubbleLockedRef.current = true;
        onShopBubbleLockRef.current?.();
        const replies = ["보여줄게 있어!", "있잖아, 그게…", "오~ 들어봐!"];
        showBubble(replies[Math.floor(Math.random() * replies.length)], 2000);
        if (pet.state === "walk") { target = null; pet.state = "idle"; }
        idleUntil = t + 700;
        setTimeout(() => { if (onShopBubbleRef.current) onShopBubbleRef.current(); }, 2100);
      }
      else {
        showBubble(PET_LINES[Math.floor(Math.random() * PET_LINES.length)]);
        if (pet.state === "walk") { target = null; pet.state = "idle"; }
        idleUntil = t + 700;
      }
    }
    function worldXY(e) {  // 화면 좌표 → 월드(방) 좌표
      const r = container.getBoundingClientRect();
      return clampFloor((e.clientX - r.left) + scrollXRef.current, e.clientY - r.top);
    }
    function onDown(e) {
      e.preventDefault(); wrap.setPointerCapture?.(e.pointerId);
      // 잡는 순간 기존 상호작용 해제
      if (activeInteractionRef?.current) {
        activeInteractionRef.current = null;
        onInteractionEndRef.current?.();
      }
      down = { x: e.clientX, y: e.clientY, dragging: false };
    }
    function onMove(e) {
      if (!down) return;
      if (!down.dragging && Math.hypot(e.clientX - down.x, e.clientY - down.y) > C.dragThresh) { down.dragging = true; pet.state = "grabbed"; target = null; }
      if (down.dragging) { const p = worldXY(e); pet.x = p.x; pet.y = p.y; }
    }
    function onUp() {
      if (!down) return;
      if (down.dragging) {
        home = { x: pet.x, y: pet.y }; pet.state = "idle"; idleUntil = now() + C.standAfterDrop;
        // 상호작용 가구 히트 판정 (interactiveDecosRef: 현재 펫이 쓸 수 있는 가구만 담겨 있음)
        const decos = interactiveDecosRef?.current || [];
        let hit = null;
        for (const d of decos) {
          const furX = (d.pos.x / 100) * W;
          const furY = (d.pos.y / 100) * H;
          const hitR = ((d.item.interaction.hitRadiusPx ?? 220) / 1080) * W;
          if (Math.hypot(pet.x - furX, pet.y - furY) < hitR + petSize / 2) { hit = d; break; }
        }
        if (hit) onInteractionStartRef.current?.(hit.iid, hit.item);
      } else handleTap();
      down = null;
    }
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", resize);

    resize();
    const initSX = homeInitRef.current ? (scrollXRef?.current || 0) : W;  // 첫 마운트=룸 중앙(W), 재실행(진화)=실제 scrollX
    homeInitRef.current = true;
    home = clampFloor(initSX + W / 2 + homeBiasX, H * 0.78);
    pet.x = home.x; pet.y = home.y;
    idleUntil = now() + 500;
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
    };
  }, [containerRef, motion.stand, motion.walk]);

  return (
    <div ref={wrapRef} data-pet style={{ position:"absolute", left:0, top:0, touchAction:"none", cursor:"grab", userSelect:"none", WebkitUserSelect:"none", willChange:"transform" }}>
      <img ref={imgRef} alt="" draggable={false}
        style={{ width:"100%", height:"100%", objectFit:"contain", display:"block", pointerEvents:"none", filter:`drop-shadow(0 6px 16px ${petColor}88)` }}/>
      {/* 밥 아이콘 — 먹는 중 펫 보는 방향 옆에 표시(render에서 opacity·left 제어). img 우선, 실패 시 emoji 폴백 */}
      <div ref={foodRef} style={{ position:"absolute", top:"52%", lineHeight:1, opacity:0, transition:"opacity .2s", pointerEvents:"none", animation:"float 1s ease-in-out infinite" }}>
        <img src={FOOD_ICON.imgs[0]} alt="" draggable={false} data-i="0"
          onError={e => { const el=e.currentTarget, n=+el.dataset.i+1;
            if (n < FOOD_ICON.imgs.length) { el.dataset.i=n; el.src=FOOD_ICON.imgs[n]; }
            else { el.style.display="none"; el.nextSibling.style.display="inline"; } }}
          style={{ width:"2.2em", height:"2.2em", objectFit:"contain", display:"block" }}/>
        <span style={{ display:"none" }}>{FOOD_ICON.emoji}</span>
      </div>
      <div ref={bubbleRef} style={{ position:"absolute", left:"50%", bottom:"104%", transform:"translateX(-50%)", background:"#fff", border:"2px solid #333", borderRadius:12, padding:"5px 10px", fontSize:12, fontWeight:800, color:"#222", whiteSpace:"nowrap", opacity:0, transition:"opacity .12s", pointerEvents:"none", fontFamily:"'Jua',sans-serif" }}>
        <span ref={bubbleTextRef}></span>
        <span style={{ position:"absolute", left:"50%", bottom:-7, transform:"translateX(-50%)", width:0, height:0, borderLeft:"6px solid transparent", borderRight:"6px solid transparent", borderTop:"7px solid #333" }}/>
      </div>
      <div style={{ position:"absolute", left:"50%", top:"102%", transform:"translateX(-50%)", fontFamily:"'Jua',sans-serif", fontSize:13, color:"#fff", textShadow:"0 2px 10px rgba(0,0,0,.65)", whiteSpace:"nowrap", pointerEvents:"none" }}>{petName}</div>
    </div>
  );
}

// ===================================================
function EggSelect({ onSelect }) {
  const [hov, setHov] = useState(null);
  const [name, setName] = useState("");
  const trimmed = name.trim();
  const nameValid = trimmed.length >= 1 && trimmed.length <= PET_NAME_MAX && PET_NAME_RE.test(trimmed);
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,gap:20,animation:"fadeUp .5s ease"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:8}}>🌟</div>
        <h1 style={{fontFamily:"'Jua',sans-serif",fontSize:26,color:INK,marginBottom:4}}>펫을 선택하세요</h1>
        <p style={{color:INK_SUB,fontSize:13}}>어떤 알에서 어떤 펫이 나올지 몰라요!</p>
      </div>
      <div style={{width:"100%"}}>
        <input value={name} onChange={e=>setName(e.target.value.slice(0,PET_NAME_MAX))} maxLength={PET_NAME_MAX} placeholder="펫 이름을 지어주세요"
          style={{width:"100%",boxSizing:"border-box",background:CARD_BG,border:`2px solid ${nameValid?"rgba(136,196,96,.8)":CARD_BORDER}`,borderRadius:16,padding:"12px 14px",fontFamily:"'Jua',sans-serif",fontSize:15,color:INK,textAlign:"center",outline:"none"}}/>
        <p style={{color:INK_FAINT,fontSize:11,marginTop:6,textAlign:"center"}}>한글·영문·숫자 {PET_NAME_MAX}자 이하 (특수문자·공백 제외)</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,width:"100%",opacity:nameValid?1:.4,pointerEvents:nameValid?"auto":"none",transition:"opacity .2s"}}>
        {EGG_OPTIONS.map(e=>(
          <button key={e.id} onMouseEnter={()=>setHov(e.id)} onMouseLeave={()=>setHov(null)} onClick={()=>onSelect(e.id, trimmed)}
            style={{background:hov===e.id?e.color:CARD_BG,border:`2px solid ${hov===e.id?"rgba(0,0,0,.15)":CARD_BORDER}`,borderRadius:20,padding:"16px 8px",cursor:"pointer",transform:hov===e.id?"scale(1.06)":"scale(1)",transition:"all .2s",backdropFilter:"blur(8px)"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:5}}>
              <PetSprite size={38} emoji="🥚" imgSrc={`/images/pets/${e.id}/stage1/static.png`}/>
            </div>
            <div style={{fontFamily:"'Jua',sans-serif",fontSize:12,color:INK,fontWeight:700}}>{e.label}</div>
            {hov===e.id&&<div style={{fontSize:10,color:"#555",marginTop:3}}>{e.hint}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===================================================
// 홈 레이아웃
// ===================================================
// 홈 꾸미기 모드 장식품 오버레이
// 펫+가구 합성 이미지 오버레이 — 상호작용 중에만 렌더. 가구와 동일 좌표계에 배치.
// compositeAsset(확장자 없음) → webp/png/jpg 순으로 탐색 (로드 실패 시 자동 전환).
function CompositeOverlay({ item, pos, scrollX, containerRef }) {
  const ia = item.interaction;
  const [box, setBox] = useState({ w:0, h:0 });
  const [extIdx, setExtIdx] = useState(0);
  useEffect(() => {
    const measure = () => setBox({ w: containerRef.current?.offsetWidth||0, h: containerRef.current?.offsetHeight||0 });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [containerRef]);
  useEffect(() => { setExtIdx(0); }, [ia.compositeAsset]);

  const dispW = box.w ? ((ia.compositeWidthPx ?? 400) / REFERENCE_RESOLUTION.width) * box.w : 0;
  const baseY = pos.y;  // 가구 중심 y% 그대로 사용 — 합성 이미지가 가구를 포함하므로 위치 일치
  const depthZ = Math.round(Math.min(150, Math.max(1, baseY))) + 1;

  if (!ia.compositeAsset || extIdx >= SHOP_IMG_EXTS.length) return null;
  return (
    <div style={{
      position:"absolute", left:`calc(${pos.x}% - ${scrollX}px)`, top:`${pos.y}%`,
      transform:"translate(-50%,-50%)", zIndex:depthZ, pointerEvents:"none",
      animation:"fadeIn .15s ease",
    }}>
      <img
        src={`${ia.compositeAsset}.${SHOP_IMG_EXTS[extIdx]}`}
        alt="" draggable={false}
        onError={() => setExtIdx(i => i + 1)}
        style={{ width: dispW || "auto", height:"auto", display:"block" }}
      />
    </div>
  );
}

// isFixed=false: 드래그 가능 / isFixed=true: 위치 고정
function DecorationOverlay({ item, itemState, containerRef, draggable, selected, onSelect, onFixToggle, onRemove, onMove, onDragStart, scrollX = 0, weather, isInteracting = false }) {
  const [localPos, setLocalPos] = useState(itemState.position);
  const dragRef = useRef({ active:false, startX:0, startY:0, startPos:{x:0,y:0} });

  useEffect(() => { setLocalPos(itemState.position); }, [itemState.position]);

  // 기준 해상도 비율 기반 크기 — 원본 px ÷ 기준 폭 × 실제 컨테이너 폭 × scale
  const [natural, setNatural] = useState(null);   // 에셋 원본 px {w,h}
  const [box, setBox]         = useState({ w:0, h:0 }); // 컨테이너(화면) px
  // asset 다중 확장자 탐색 (SHOP_IMG_EXTS 순서: webp→png→jpg)
  const [assetExtIdx, setAssetExtIdx] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const imgKey = item.asset || item.imagePath || "";
  useEffect(() => { setImgFailed(false); setAssetExtIdx(0); }, [imgKey]);
  useEffect(() => {
    const measure = () => setBox({ w: containerRef.current?.offsetWidth || 0, h: containerRef.current?.offsetHeight || 0 });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [containerRef]);
  const dispW = (natural && box.w)
    ? (natural.w / REFERENCE_RESOLUTION.width) * box.w * (item.scale ?? 1)
    : null;

  // 바닥 접점(발) y = 중심 y + 스프라이트 절반 높이(컨테이너 높이 대비 %). Y-정렬 키로 사용.
  const dispH    = (dispW && natural) ? dispW * (natural.h / natural.w) : 0;
  const baseY    = (dispH && box.h) ? localPos.y + (dispH / 2) / box.h * 100 : localPos.y;
  const depthZ   = Math.round(Math.min(150, Math.max(1, baseY)));

  const handleTouchStart = (e) => {
    if (!draggable) return;
    onSelect?.();                       // 탭한 데코만 선택(고정 여부 무관)
    if (itemState.isFixed) return;      // 고정이면 드래그 안 함
    e.stopPropagation();
    onDragStart?.();
    const t = e.touches[0];
    dragRef.current = { active:true, startX:t.clientX, startY:t.clientY, startPos:{...localPos} };
  };
  const handleTouchMove = (e) => {
    if (!draggable || !dragRef.current.active) return;
    e.stopPropagation();
    const t = e.touches[0];
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const dx = ((t.clientX - dragRef.current.startX) / width)  * 100;
    const dy = ((t.clientY - dragRef.current.startY) / height) * 100;
    const b = placementBounds(item.category);
    setLocalPos({
      x: Math.max(DECOR_X.min, Math.min(DECOR_X.max, dragRef.current.startPos.x + dx)),  // 월드 전체(3W)
      y: Math.max(b.minY, Math.min(b.maxY, dragRef.current.startPos.y + dy)),
    });
  };
  const handleTouchEnd = () => {
    if (!draggable || !dragRef.current.active) return;
    dragRef.current.active = false;
    onMove(localPos);
  };

  const fixed = itemState.isFixed;
  // 조작 버튼은 기본 데코 위(top:-28). 데코가 화면 상단이라 위 공간이 부족하면 아래로 뒤집어 안 가려지게.
  const flipBtnsBelow = box.h ? ((localPos.y/100)*box.h - (dispH||60)/2) < 44 : false;

  // 창문: 날씨 필드를 컨테이너(방) 좌표에 정렬 → 모든 창문이 같은 하늘을 공유(개별 파티클 X).
  // 마스크는 창문 래퍼(inset:0)를 덮으므로, 래퍼 좌상단을 컨테이너 px로 구해 그만큼 필드를 음수 오프셋한다.
  let outside = null;
  if (item.category==="window" && item.weatherMask && box.w && dispW) {
    const wrapLeft = (localPos.x/100)*box.w - scrollX - dispW/2;  // 래퍼 좌상단 x (컨테이너 px)
    const wrapTop  = (localPos.y/100)*box.h - dispH/2;            // 래퍼 좌상단 y
    outside = { mask:item.weatherMask, fieldX:-wrapLeft, fieldY:-wrapTop, fieldW:box.w, fieldH:box.h };
  }

  return (
    // 비꾸미기 모드: pointerEvents none으로 배경 드래그 이벤트를 가로채지 않음
    <div
      onTouchStart={draggable ? handleTouchStart : undefined}
      onTouchMove={draggable ? handleTouchMove : undefined}
      onTouchEnd={draggable ? handleTouchEnd : undefined}
      onClick={draggable ? (e)=>{ e.stopPropagation(); onSelect?.(); } : undefined}
      style={{
        position:"absolute", left:`calc(${localPos.x}% - ${scrollX}px)`, top:`${localPos.y}%`,
        transform:"translate(-50%,-50%)", zIndex: selected ? Math.max(depthZ, 160) : depthZ,
        touchAction: (draggable && !fixed) ? "none" : "auto",
        userSelect:"none",
        pointerEvents: draggable ? "auto" : "none",
      }}
    >
      <div style={{position:"relative"}}>
        {/* 창문: 프레임 PNG 뒤(zIndex 0)에 유리 클립 날씨 → 프레임이 위(zIndex 1)에서 덮음 */}
        {outside && <WindowOutside weather={weather} {...outside}/>}
        {/* asset(다중 확장자 자동탐색) → imagePath(레거시 고정경로) → 이모지 fallback */}
        {item.asset && assetExtIdx < SHOP_IMG_EXTS.length ? (
          <img src={`${item.asset}.${SHOP_IMG_EXTS[assetExtIdx]}`} alt="" draggable={false}
            onError={() => setAssetExtIdx(i => i + 1)}
            onLoad={e => setNatural({ w:e.target.naturalWidth, h:e.target.naturalHeight })}
            style={{ width: dispW ?? 60, height:"auto", display:"block", pointerEvents:"none", position:"relative", zIndex:1, opacity: isInteracting ? 0 : 1, transition:"opacity .15s" }}/>
        ) : item.imagePath && !imgFailed ? (
          <img src={item.imagePath} alt="" draggable={false}
            onError={() => setImgFailed(true)}
            onLoad={e => setNatural({ w:e.target.naturalWidth, h:e.target.naturalHeight })}
            style={{ width: dispW ?? 60, height:"auto", display:"block", pointerEvents:"none", position:"relative", zIndex:1, opacity: isInteracting ? 0 : 1, transition:"opacity .15s" }}/>
        ) : (
          <span style={{ fontSize: Math.round((dispW ?? 60) * 0.62), lineHeight:1 }}>
            {CATEGORY_FALLBACK[item.category] || "🛍️"}
          </span>
        )}

        {/* 꾸미기 모드 + 선택된 데코만 조작 버튼 표시 */}
        {draggable && selected && (
          <div style={{
            position:"absolute", top: flipBtnsBelow ? "calc(100% + 6px)" : -28, left:"50%", transform:"translateX(-50%)",
            display:"flex", gap:4, whiteSpace:"nowrap",
          }}>
            <button
              onClick={e=>{ e.stopPropagation(); onFixToggle(); }}
              style={{
                padding:"3px 9px", borderRadius:8, border:"none", cursor:"pointer",
                fontSize:11, fontWeight:800, color:"#fff",
                background: fixed ? "rgba(255,180,0,.9)" : "rgba(80,80,80,.75)",
              }}>
              {fixed ? "📌 고정됨" : "📌 고정"}
            </button>
            <button
              onClick={e=>{ e.stopPropagation(); onRemove(); }}
              style={{
                padding:"3px 8px", borderRadius:8, border:"none", cursor:"pointer",
                fontSize:11, fontWeight:800, color:"#fff",
                background:"rgba(200,40,40,.85)",
              }}>
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeLayout({
  pet, daily, inv, weather, wm, growthPct, growthMax, missionDone,
  getPetEmoji, getPetName, getPetImg, getPetMotion, canEvolve, feedSignal,
  onFeed, onPlay, onClean, onGiftNav, onStatusCheck, onNav, onShare, onSettings, onEventClaim,
  onDecorSave, onFormShopEvent, onShopBubbleLock,
}) {
  const hasEvent = daily.event && !daily.eventRewardClaimed;
  const petColor = pet.stage===3&&pet.finalForm ? FINAL_FORMS[pet.finalForm].color : "#88d8b0";

  // 가구 상호작용 — 현재 펫이 쓸 수 있는 가구만 ref에 유지, RAF loop가 드롭 판정 시 읽음
  const [activeInteractionIid, setActiveInteractionIid] = useState(null);
  const activeInteractionRef  = useRef(null);
  const interactiveDecosRef   = useRef([]);
  const pendingInteractionIid = useRef(null);
  useEffect(() => { activeInteractionRef.current = activeInteractionIid; }, [activeInteractionIid]);

  // 현재 펫이 상호작용 가능한 배치된 가구 목록 유지
  useEffect(() => {
    if (isDecorMode) { interactiveDecosRef.current = []; return; }
    interactiveDecosRef.current = (inv.placedDecos || [])
      .map(p => ({ iid:p.iid, item:SHOP_MASTER.find(m=>m.id===p.itemId), pos:p.position }))
      .filter(({ item }) => {
        if (!item?.interaction?.enabled) return false;
        if (pet.stage !== 3 || !pet.finalForm) return false;
        if (item.interaction.allowedForms && !item.interaction.allowedForms.includes(pet.finalForm)) return false;
        return true;
      });
  }, [inv.placedDecos, pet.stage, pet.finalForm, isDecorMode]);

  // 상호작용 시작: 합성 이미지 미리 로드 후 activeInteractionIid 확정 (깜빡임 방지)
  const handleInteractionStart = useCallback((iid, item) => {
    if (!item?.interaction?.compositeAsset) return;
    pendingInteractionIid.current = iid;
    let tried = 0;
    function tryLoad(extIdx) {
      if (extIdx >= SHOP_IMG_EXTS.length) return;  // 모든 확장자 실패 → 상호작용 미발동
      const img = new Image();
      img.onload = () => { if (pendingInteractionIid.current === iid) setActiveInteractionIid(iid); };
      img.onerror = () => tryLoad(extIdx + 1);
      img.src = `${item.interaction.compositeAsset}.${SHOP_IMG_EXTS[extIdx]}`;
    }
    tryLoad(0);
  }, []);
  const handleInteractionEnd = useCallback(() => {
    pendingInteractionIid.current = null;
    setActiveInteractionIid(null);
  }, []);

  // 꾸미기 모드 진입 시 상호작용 해제
  useEffect(() => { if (isDecorMode) { pendingInteractionIid.current = null; setActiveInteractionIid(null); } }, [isDecorMode]);

  const [evoBubbleDismissed, setEvoBubbleDismissed] = useState(false);
  useEffect(() => { if (!canEvolve) setEvoBubbleDismissed(false); }, [canEvolve]);

  // ── 꾸미기 draft 상태 ────────────────────────────────────
  const [isDecorMode, setIsDecorMode]         = useState(false);
  const [draftBg, setDraftBg]                 = useState(null);       // equipped background id
  const [draftDecos, setDraftDecos]           = useState({});          // {[iid]: {itemId, isFixed, position}}
  const [isDecorPanelOpen, setIsDecorPanelOpen] = useState(true);
  const [isDraggingDecor, setIsDraggingDecor] = useState(false);
  const [selectedDecoIid, setSelectedDecoIid] = useState(null);  // 선택된 데코(이 데코만 조작 버튼 표시)
  const [isCleanMode, setIsCleanMode] = useState(false);         // 청소 모드 오버레이
  const iidRef = useRef(0);  // 새 배치 인스턴스 iid 생성용 카운터

  const enterDecorMode = () => {
    const currentBg = (SHOP_MASTER.find(i => i.category==="background" && inv.shopItems?.[i.id]?.equipped) || {id:"bg_default"}).id;
    const initDecos = {};
    (inv.placedDecos || []).forEach(p => {
      initDecos[p.iid] = { itemId: p.itemId, isFixed: p.isFixed ?? false, position: p.position };
    });
    setDraftBg(currentBg);
    setDraftDecos(initDecos);
    setIsDecorMode(true);
    setIsDecorPanelOpen(true);
    setIsDraggingDecor(false);
    setSelectedDecoIid(null);   // 진입 시 아무것도 선택 안 됨(버튼 숨김)
  };

  const completeDecor = () => {
    onDecorSave(draftBg, draftDecos);
    setIsDecorMode(false);
    setSelectedDecoIid(null);
  };

  const cancelDecor = () => {
    setIsDecorMode(false);
    setDraftBg(null);
    setDraftDecos({});
    setSelectedDecoIid(null);
  };

  // draft 장식품 핸들러 — iid(인스턴스) 단위
  const handleDraftFixToggle = (iid) => {
    setDraftDecos(prev => ({ ...prev, [iid]: { ...prev[iid], isFixed: !prev[iid].isFixed } }));
  };
  const handleDraftRemove = (iid) => {
    setDraftDecos(prev => { const n={...prev}; delete n[iid]; return n; });
  };
  const handleDraftRemoveAll = (itemId) => {
    setDraftDecos(prev => {
      const n = {...prev};
      Object.keys(n).forEach(iid => { if (n[iid].itemId === itemId) delete n[iid]; });
      return n;
    });
    setSelectedDecoIid(null);
  };
  const handleDraftMove = (iid, pos) => {
    setDraftDecos(prev => ({ ...prev, [iid]: { ...prev[iid], position: pos } }));
  };
  const handleDraftAdd = (itemId) => {
    const cat = SHOP_MASTER.find(i => i.id === itemId)?.category;
    if (!cat) return;
    const owned  = inv.shopItems?.[itemId]?.count || 0;
    const placed = Object.values(draftDecos).filter(s => s.itemId === itemId).length;
    if (placed >= owned) return;  // 보유 개수만큼만 배치
    const w = midRef.current?.offsetWidth || 0;  // 현재 보이는 화면 중앙(월드 x%)에 생성
    const x = w ? Math.max(DECOR_X.min, Math.min(DECOR_X.max, ((scrollX + w / 2) / w) * 100)) : 50;
    const iid = `${itemId}_${Date.now()}_${iidRef.current++}`;
    setDraftDecos(prev => ({ ...prev, [iid]: { itemId, isFixed: false, position: { x, y:placementBounds(cat).defY } } }));
    setSelectedDecoIid(iid);   // 새로 놓은 데코 자동 선택(바로 조작 버튼 표시)
  };

  // 렌더에 사용할 배경 (꾸미기 모드면 draft, 아니면 실제 inv)
  const displayBg = isDecorMode
    ? SHOP_MASTER.find(i => i.id === draftBg) || null
    : SHOP_MASTER.find(i => i.category==="background" && inv.shopItems?.[i.id]?.equipped) || null;

  // 배치된 데코/창문 인스턴스 리스트 [{ iid, item, state }]
  const displayDecos = (isDecorMode
    ? Object.entries(draftDecos).map(([iid, s]) => ({ iid, item: SHOP_MASTER.find(m => m.id === s.itemId), state: s }))
    : (inv.placedDecos || []).map(p => ({ iid: p.iid, item: SHOP_MASTER.find(m => m.id === p.itemId), state: p }))
  ).filter(d => d.item);

  const [scrollX, setScrollX] = useState(0);
  const scrollXRef = useRef(0);  // rAF(펫)에서 실시간 scrollX 읽기용
  useEffect(() => { scrollXRef.current = scrollX; }, [scrollX]);
  const bgDragRef = useRef({ active:false, startX:0, startScroll:0 });
  const midRef    = useRef(null);

  const onTouchStart = (e) => {
    if (e.target.closest?.("[data-pet]")) return;  // 펫 위 조작은 펫이 처리 (배경 스크롤 억제)
    bgDragRef.current = { active:true, startX:e.touches[0].clientX, startScroll:scrollX };
  };
  const onTouchMove = (e) => {
    if (!bgDragRef.current.active) return;
    const w = midRef.current?.offsetWidth || 320;
    const delta = bgDragRef.current.startX - e.touches[0].clientX;
    setScrollX(Math.max(0, Math.min(w*2, bgDragRef.current.startScroll + delta)));
  };
  const onTouchEnd = () => { bgDragRef.current.active = false; };

  // 배경(가로 3배) 중앙에서 시작 → 좌우 양방향 스크롤 가능
  useEffect(() => {
    let raf;
    const center = () => {
      const w = midRef.current?.offsetWidth || 0;
      if (w) setScrollX(w);                     // 중앙(가운데 1/3) 표시
      else raf = requestAnimationFrame(center); // 아직 레이아웃 전이면 다음 프레임 재시도
    };
    center();
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>

      <TopBar
        pet={pet} inv={inv} daily={daily} growthPct={growthPct} growthMax={growthMax}
        getPetEmoji={getPetEmoji} getPetName={getPetName} getPetImg={getPetImg} missionDone={missionDone}
        onStatusCheck={onStatusCheck} onMission={()=>onNav("mission")} onShare={onShare} onSkill={()=>onNav("skill")} onSettings={onSettings}
      />

      {/* 중앙 영역: 스크롤 배경 + 고정 펫 + 고정 패널 */}
      <div
        ref={midRef}
        style={{flex:1,position:"relative",overflow:"hidden",minHeight:0}}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <RoomBackground weather={weather} scrollX={scrollX} equippedBg={displayBg}/>

        {/* 장식품 오버레이 — 꾸미기 모드: draft 기준, 일반: inv 기준. 인스턴스(iid)마다 1개 렌더 */}
        {displayDecos.map(({ iid, item, state }) => (
          <DecorationOverlay
            key={iid}
            item={item}
            itemState={state}
            containerRef={midRef}
            draggable={isDecorMode}
            selected={isDecorMode && selectedDecoIid === iid}
            onSelect={isDecorMode ? () => setSelectedDecoIid(iid) : undefined}
            onFixToggle={isDecorMode ? () => handleDraftFixToggle(iid) : undefined}
            onRemove={isDecorMode ? () => handleDraftRemove(iid) : undefined}
            onMove={isDecorMode ? pos => handleDraftMove(iid, pos) : undefined}
            onDragStart={isDecorMode ? () => { setIsDraggingDecor(true); setIsDecorPanelOpen(false); } : undefined}
            scrollX={scrollX}
            weather={weather}
            isInteracting={!isDecorMode && activeInteractionIid === iid}
          />
        ))}

        {/* 합성 이미지 오버레이 — 상호작용 가구 위에 펫+가구 합성 이미지 표시 */}
        {!isDecorMode && activeInteractionIid && (() => {
          const d = displayDecos.find(x => x.iid === activeInteractionIid);
          if (!d?.item?.interaction?.compositeAsset) return null;
          return <CompositeOverlay key={activeInteractionIid} item={d.item} pos={d.state.position} scrollX={scrollX} containerRef={midRef}/>;
        })()}

        {/* 꾸미기 모드 — 상단 완료/취소 바 */}
        {isDecorMode && (
          <div style={{position:"absolute",top:0,left:0,right:0,zIndex:Z_UI.decorCtrl,
            display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"10px 14px",background:"rgba(0,0,0,.35)",backdropFilter:"blur(6px)"}}>
            <button onClick={cancelDecor}
              style={{background:"rgba(255,255,255,.18)",border:"none",borderRadius:12,
                padding:"8px 18px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>
              취소
            </button>
            <span style={{fontFamily:"'Jua',sans-serif",fontSize:14,color:"rgba(255,255,255,.8)"}}>
              🎨 꾸미기 모드
            </span>
            <button onClick={completeDecor}
              style={{background:"linear-gradient(135deg,#4CAF50,#81C784)",border:"none",borderRadius:12,
                padding:"8px 18px",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>
              완료
            </button>
          </div>
        )}

        {/* 진화 가능 말풍선 */}
        {!isDecorMode && canEvolve && !evoBubbleDismissed && (
          <div
            onClick={() => { setEvoBubbleDismissed(true); onStatusCheck(); }}
            style={{position:"absolute",top:10,left:12,zIndex:Z_UI.evoBubble,cursor:"pointer",animation:"pop .35s ease"}}
          >
            <div style={{width:0,height:0,borderLeft:"9px solid transparent",borderRight:"9px solid transparent",borderBottom:"10px solid rgba(255,255,255,.95)",marginLeft:18}}/>
            <div style={{background:"rgba(255,255,255,.95)",borderRadius:14,padding:"9px 14px",boxShadow:"0 4px 20px rgba(0,0,0,.3)",fontSize:13,fontWeight:800,color:"#333",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}}>
              ✨ 진화 가능! 탭해서 진화하기
            </div>
          </div>
        )}

        {/* 펫 — 자율 행동 (보행·드래그·말풍선). 꾸미기 모드에선 숨김 */}
        {!isDecorMode && (
          <WanderingPet
            containerRef={midRef}
            scrollXRef={scrollXRef}
            motion={getPetMotion()}
            staticImg={getPetImg()}
            staticEmoji={getPetEmoji()}
            petName={getPetName()}
            petColor={petColor}
            feedSignal={feedSignal}
            showShopBubble={pet.stage===3 && !!pet.finalForm && !inv.formEvents?.[pet.finalForm]?.shopEventDone}
            onShopBubble={onFormShopEvent}
            onShopBubbleLock={onShopBubbleLock}
            interactiveDecosRef={interactiveDecosRef}
            activeInteractionRef={activeInteractionRef}
            onInteractionStart={handleInteractionStart}
            onInteractionEnd={handleInteractionEnd}
          />
        )}

        {/* 좌측 패널 */}
        {!isDecorMode && (
          <div style={{position:"absolute",top:0,left:0,bottom:0,width:62,zIndex:Z_UI.panel}}>
            <LeftPanel weather={weather} wm={wm} daily={daily} hasEvent={hasEvent} onNav={onNav} onEventClaim={onEventClaim}/>
          </div>
        )}

        {/* 우측 패널 */}
        {!isDecorMode && (
          <div style={{position:"absolute",top:0,right:0,bottom:0,width:62,zIndex:Z_UI.panel}}>
            <RightPanel inv={inv} pet={pet} onNav={(s) => {
              if (s === "decorate") { enterDecorMode(); return; }
              onNav(s);
            }}/>
          </div>
        )}

        {/* 꾸미기 모드 — 하단 보유 아이템 패널 */}
        {isDecorMode && (
          <DecorateModePanel
            inv={inv}
            draftBg={draftBg}
            draftDecos={draftDecos}
            isOpen={isDecorPanelOpen && !isDraggingDecor}
            onToggle={() => { setIsDecorPanelOpen(o=>!o); setIsDraggingDecor(false); }}
            onBgSelect={(id) => setDraftBg(id)}
            onDecoAdd={(id) => handleDraftAdd(id)}
            onDecoRemoveAll={(id) => handleDraftRemoveAll(id)}
          />
        )}
      </div>

      {!isDecorMode && <BottomBar daily={daily} inv={inv} onFeed={onFeed} onPlay={onPlay} onClean={()=>setIsCleanMode(true)} onGiftNav={onGiftNav} onNav={onNav}/>}

      {/* 청소 모드 오버레이 — V 완료 시 기존 onClean(handleClean: 청결+미션) 재사용, X는 미커밋 */}
      {isCleanMode && <CleaningOverlay petImg={getPetMotion().stand} petFallback={getPetImg()} onComplete={onClean} onExit={()=>setIsCleanMode(false)}/>}
    </div>
  );
}

// ===================================================
// 방 배경 (가로 3배, 슬라이드 가능)
// ===================================================
function RoomBackground({ weather, scrollX, equippedBg }) {
  // 뷰포트 px 측정 — 기본 창문들이 같은 하늘(뷰포트 좌표 정렬 날씨 필드)을 공유하기 위함
  const vpRef = useRef(null);
  const [vp, setVp] = useState({ w:0, h:0 });
  useEffect(() => {
    const measure = () => setVp({ w: vpRef.current?.offsetWidth || 0, h: vpRef.current?.offsetHeight || 0 });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // 커스텀 배경 이미지가 장착된 경우 이미지로 대체.
  // 이미지 뒤에 날씨 백드롭(창문과 동일한 WEATHER_SKY + WeatherFX) → 투명 영역(예: 바닥만 있는 PNG)으로 같은 날씨가 비침.
  if (equippedBg?.imagePath) {
    return (
      <div style={{position:"absolute",inset:0,overflow:"hidden",zIndex:0}}>
        <div style={{position:"absolute",inset:0,background:weatherSky(weather)}}/>
        <WeatherFX weather={weather}/>
        <img src={equippedBg.imagePath} alt=""
          style={{position:"absolute",top:0,bottom:0,left:0,width:"300%",height:"100%",
                  objectFit:"cover",display:"block",
                  transform:`translateX(${-scrollX}px)`,willChange:"transform"}}/>
      </div>
    );
  }
  const skyBg = weatherSky(weather);

  // 창문 6개: 배경(3x width)에서 0.25W, 0.75W, 1.25W, 1.75W, 2.25W, 2.75W 위치
  // 3x 기준 % → 8.33%, 25%, 41.67%, 58.33%, 75%, 91.67%
  const winLeft = ['8.33%','25%','41.67%','58.33%','75%','91.67%'];

  return (
    <div ref={vpRef} style={{position:'absolute',inset:0,overflow:'hidden',zIndex:0}}>
      <div style={{
        position:'absolute', top:0, bottom:0, left:0,
        width:'300%',
        transform:`translateX(${-scrollX}px)`,
        willChange:'transform',
      }}>
        {/* 벽 */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, bottom:'38%',
          background:'linear-gradient(180deg,#EDE0C4 0%,#D9C49A 100%)',
        }}/>

        {/* 창문들 */}
        {winLeft.map((left, i) => {
          // 유리 좌상단을 뷰포트 px로 환산 → 날씨 필드를 그만큼 음수 오프셋해 모든 창문이 한 하늘을 공유.
          // 배경 이동 div는 300%(=3*vp.w) 폭이며 translateX(-scrollX)로 스크롤됨. padding 4px만큼 유리가 안쪽.
          const glassLeft = (parseFloat(left)/100)*(3*vp.w) - 65 + 4 - scrollX;
          const glassTop  = 0.06*vp.h + 4;
          return (
          <div key={i} style={{
            position:'absolute', left:`calc(${left} - 65px)`, top:'6%',
            width:130, height:185,
            background:'#5C3010',
            borderRadius:6, padding:4,
            boxShadow:'0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
            zIndex:2,
          }}>
            {/* 창문 유리 (이모티콘 없이 하늘색만) */}
            <div style={{
              width:'100%', height:'100%',
              background:skyBg,
              borderRadius:3,
              overflow:'hidden', position:'relative',
            }}>
              {/* 유리 안 날씨 — 뷰포트 좌표 정렬 필드(한 하늘 공유). overflow:hidden으로 유리에만 클립 */}
              {vp.w>0 ? (
                <div style={{position:'absolute',left:-glassLeft,top:-glassTop,width:vp.w,height:vp.h}}>
                  <WeatherFX weather={weather}/>
                </div>
              ) : <WeatherFX weather={weather}/>}
              {/* 창틀 세로 */}
              <div style={{position:'absolute',top:0,left:'50%',width:3,height:'100%',background:'rgba(80,40,8,0.75)',transform:'translateX(-50%)',zIndex:1}}/>
              {/* 창틀 가로 */}
              <div style={{position:'absolute',top:'42%',left:0,width:'100%',height:3,background:'rgba(80,40,8,0.75)',transform:'translateY(-50%)',zIndex:1}}/>
            </div>
          </div>
          );
        })}

        {/* 걸레받이 */}
        <div style={{
          position:'absolute', bottom:'38%', left:0, right:0,
          height:10, background:'rgba(100,58,18,0.65)',
          boxShadow:'0 -1px 0 rgba(255,255,255,0.1)',
        }}/>

        {/* 바닥 (나무 마루) */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:'38%',
          overflow:'hidden',
          background:'repeating-linear-gradient(90deg,#C2884A 0px,#C2884A 58px,#A86C32 59px,#B87840 60px)',
        }}>
          {/* 마루 가로 결 */}
          {[22,44,66,88].map(y=>(
            <div key={y} style={{
              position:'absolute', top:`${y}%`, left:0, right:0,
              height:1, background:'rgba(70,38,8,0.28)',
            }}/>
          ))}
          {/* 바닥 상단 하이라이트 */}
          <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'rgba(255,255,255,0.12)'}}/>
        </div>
      </div>
    </div>
  );
}

// ===================================================
// 상단 바
// ===================================================
function TopBar({ pet, inv, daily, growthPct, growthMax, getPetEmoji, getPetName, getPetImg, missionDone, onStatusCheck, onMission, onShare, onSkill, onSettings }) {
  const [resetIn, setResetIn] = useState('');

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const midnight = new Date(now); midnight.setHours(24,0,0,0);
      const diff = midnight - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setResetIn(`${h}h ${String(m).padStart(2,'0')}m`);
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{background:"rgba(255,255,255,.18)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,.2)",padding:"8px 12px",display:"flex",alignItems:"center",gap:8,zIndex:10,flexShrink:0}}>

      {/* 펫 프로필 버튼 */}
      <button onClick={onStatusCheck} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.25)",border:"2px solid rgba(255,255,255,.4)",borderRadius:18,padding:"5px 10px 5px 6px",cursor:"pointer",flexShrink:0}}>
        <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <PetSprite size={20} emoji={getPetEmoji()} imgSrc={getPetImg()}/>
        </div>
        <div style={{textAlign:"left"}}>
          <div style={{fontFamily:"'Jua',sans-serif",fontSize:12,color:"#fff",lineHeight:1.2,textShadow:TEXT_SH}}>{getPetName()}</div>
          <div style={{width:50,height:4,background:"rgba(0,0,0,.15)",borderRadius:4,overflow:"hidden",marginTop:2}}>
            <div style={{width:`${growthPct}%`,height:"100%",background:growthPct>80?"#FFD700":"#4CAF50",borderRadius:4,transition:"width .8s"}}/>
          </div>
        </div>
      </button>

      {/* 재화 */}
      <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.2)",borderRadius:14,padding:"4px 10px",flexShrink:0}}>
        <span style={{fontSize:14}}>💰</span>
        <span style={{fontWeight:800,fontSize:13,color:"#fff",textShadow:TEXT_SH}}>{inv.currency}</span>
      </div>

      {/* 티켓 */}
      <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.2)",borderRadius:14,padding:"4px 10px",flexShrink:0}}>
        <span style={{fontSize:14}}>🎫</span>
        <span style={{fontWeight:800,fontSize:13,color:"#fff",textShadow:TEXT_SH}}>{inv.tickets}</span>
      </div>

      <div style={{flex:1}}/>

      {/* 미션 버튼 */}
      <button onClick={onMission} style={{position:"relative",background:"rgba(255,255,255,.2)",border:"1.5px solid rgba(255,255,255,.3)",borderRadius:14,padding:"5px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
        <span style={{fontSize:15}}>📋</span>
        <div style={{width:28,height:3,background:"rgba(0,0,0,.15)",borderRadius:2,overflow:"hidden"}}>
          <div style={{width:`${(missionDone/5)*100}%`,height:"100%",background:"#FFD700",borderRadius:2}}/>
        </div>
        <span style={{fontSize:8,color:"rgba(255,255,255,.65)",fontWeight:700,letterSpacing:-0.3,textShadow:TEXT_SH}}>{resetIn}</span>
        {daily.missions.allCompleted && !daily.claimed?.allComplete && <div style={{position:"absolute",top:-4,right:-4,width:10,height:10,background:"#FF5722",borderRadius:"50%"}}/>}
      </button>

      {/* 설정 */}
      <button
        onClick={onSettings}
        style={{background:"rgba(255,255,255,.2)",border:"1.5px solid rgba(255,255,255,.3)",borderRadius:14,padding:"6px 10px",cursor:"pointer",fontSize:16}}>
        ⚙️
      </button>

      {/* 공유 */}
      <div style={{position:"relative"}}>
        <button
          onClick={onShare}
          style={{background:"rgba(255,255,255,.2)",border:"1.5px solid rgba(255,255,255,.3)",borderRadius:14,padding:"6px 10px",cursor:"pointer",fontSize:16}}>
          📤
        </button>
      </div>
    </div>
  );
}

// ===================================================
// 좌측 패널 (날씨 + 이벤트)
// ===================================================
function LeftPanel({ weather, wm, daily, hasEvent, onNav, onEventClaim }) {
  const [evOpen, setEvOpen] = useState(false);

  useEffect(() => {
    if (hasEvent) setTimeout(() => setEvOpen(true), 1200);
  }, [hasEvent]);

  return (
    <div style={{width:62,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:12,paddingBottom:12,gap:12,flexShrink:0,position:"relative"}}>

      {/* 날씨 카드 */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",background:"rgba(255,255,255,.22)",backdropFilter:"blur(8px)",borderRadius:16,padding:"8px 0",width:52,border:"1.5px solid rgba(255,255,255,.3)"}}>
        <span style={{fontSize:20}}>{wm.emoji}</span>
        <span style={{fontSize:9,fontWeight:700,color:"#fff",marginTop:2,textShadow:TEXT_SH}}>{wm.label}</span>
      </div>

      {/* 이벤트 카드 */}
      {daily.event && (
        <button
          onClick={()=>setEvOpen(v=>!v)}
          style={{display:"flex",flexDirection:"column",alignItems:"center",background:hasEvent?"rgba(255,220,50,.35)":"rgba(255,255,255,.12)",backdropFilter:"blur(8px)",borderRadius:16,padding:"8px 0",width:52,border:`1.5px solid ${hasEvent?"rgba(255,220,50,.6)":"rgba(255,255,255,.2)"}`,cursor:"pointer",position:"relative"}}>
          <span style={{fontSize:20}}>{daily.event.emoji}</span>
          <span style={{fontSize:9,fontWeight:700,color:"#fff",marginTop:2,textShadow:TEXT_SH}}>이벤트</span>
          {hasEvent&&<div style={{position:"absolute",top:-4,right:-4,width:10,height:10,background:"#FF5722",borderRadius:"50%"}}/>}
        </button>
      )}

      {/* 이벤트 툴팁 */}
      {evOpen && daily.event && (
        <div style={{position:"absolute",left:66,top:120,background:"rgba(20,20,50,.94)",backdropFilter:"blur(12px)",borderRadius:16,padding:"12px",zIndex:50,width:170,border:"1.5px solid rgba(255,255,255,.2)",animation:"tooltipIn .2s ease"}}>
          <div style={{fontFamily:"'Jua',sans-serif",fontSize:13,color:"#fff",marginBottom:4}}>{daily.event.name}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.6)",marginBottom:8}}>{daily.event.desc}</div>
          <div style={{fontSize:12,fontWeight:800,color:"#FFD700"}}>{daily.event.effect}</div>
          {!daily.eventRewardClaimed&&(
            <button onClick={()=>{onEventClaim();setEvOpen(false);}} style={{marginTop:8,width:"100%",background:"linear-gradient(135deg,#F7971E,#FFD200)",border:"none",borderRadius:10,padding:"7px",fontSize:12,fontWeight:800,color:"#fff",cursor:"pointer"}}>
              보상 받기 →
            </button>
          )}
          {daily.eventRewardClaimed&&<div style={{marginTop:6,fontSize:11,color:"#4ECB71",fontWeight:700}}>✓ 수령 완료</div>}
          <button onClick={()=>setEvOpen(false)} style={{position:"absolute",top:6,right:8,background:"none",border:"none",color:"rgba(255,255,255,.4)",cursor:"pointer",fontSize:12}}>✕</button>
        </div>
      )}
    </div>
  );
}

// ===================================================
// 우측 패널 (육성외 기능)
// ===================================================
function RightPanel({ inv, pet, onNav }) {
  const items = [
    { emoji:"🎰", label:"뽑기",   screen:"gacha",      badge: inv.tickets > 0 ? inv.tickets : null },
    { emoji:"🎁", label:"선물함", screen:"giftbox",    badge: inv.gifts.length > 0 ? inv.gifts.length : null },
    { emoji:"📖", label:"도감",   screen:"collection", badge: inv.unlockedPets.length > 0 ? inv.unlockedPets.length : null },
    { emoji:"🏪", label:"상점",   screen:"shop",       badge: null },
    { emoji:"🎨", label:"꾸미기", screen:"decorate",   badge: null },
  ];
  if (pet.stage===3) items.push({ emoji:"⚡", label:"스킬", screen:"skill", badge:"NEW" });

  return (
    <div style={{width:62,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:12,paddingBottom:12,gap:10,flexShrink:0}}>
      {items.map(item=>(
        <button key={item.screen} className="btn-side" onClick={()=>onNav(item.screen)}
          style={{background:"rgba(255,255,255,.22)",backdropFilter:"blur(8px)",borderRadius:16,padding:"8px 0",width:52,border:"1.5px solid rgba(255,255,255,.3)",position:"relative"}}>
          <span style={{fontSize:20}}>{item.emoji}</span>
          <span style={{fontSize:9,fontWeight:700,color:"#fff",marginTop:2,textShadow:TEXT_SH}}>{item.label}</span>
          {item.badge!==null&&(
            <div style={{position:"absolute",top:-5,right:-5,background:"#FF5722",borderRadius:10,minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff",padding:"0 3px"}}>
              {item.badge}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// ===================================================
// 하단 바 (밥/놀기/청소/선물)
// ===================================================
// 하단 바: [돌보기][대회][놀러가기][소셜]. 돌보기 탭 → 4개 돌보기 액션을 액션시트(바 위 팝업)로 펼침.
function BottomBar({ daily, inv, onFeed, onPlay, onClean, onGiftNav, onNav }) {
  const [careOpen, setCareOpen] = useState(false);
  const careActions = [
    { emoji:"🍚", label:"밥 주기",   done:daily.missions.feed,  onClick:onFeed,   color:"#FF7043" },
    { emoji:"🎮", label:"놀아주기",  done:daily.missions.play,  onClick:onPlay,   color:"#42A5F5" },
    { emoji:"🛁", label:"씻기기",    done:daily.missions.clean, onClick:onClean,  color:"#66BB6A" },
    { emoji:"🎁", label:"선물주기",  done:daily.missions.gift,  onClick:onGiftNav,color:"#FFA726" },
  ];
  const tabs = [
    { emoji:"💗", label:"돌보기",   color:"#FF7043", active:careOpen, onClick:()=>setCareOpen(v=>!v) },
    { emoji:"🏆", label:"대회",     color:"#AB47BC", onClick:()=>onNav("competition") },
    { emoji:"🎡", label:"놀러가기", color:"#26A69A", onClick:()=>onNav("outing") },
    { emoji:"👥", label:"소셜",     color:"#5C6BC0", onClick:()=>onNav("social") },
  ];
  return (
    <div style={{position:"relative",flexShrink:0}}>
      {/* 돌보기 액션시트 — 바 위로 펼침. 바깥 탭 시 닫힘 */}
      {careOpen && (
        <>
          <div onClick={()=>setCareOpen(false)} style={{position:"fixed",inset:0,zIndex:40}}/>
          <div style={{position:"absolute",bottom:"calc(100% + 6px)",left:8,right:8,zIndex:41,background:"rgba(80,40,20,.6)",backdropFilter:"blur(14px)",border:"1.5px solid rgba(255,255,255,.18)",borderRadius:18,padding:"8px",display:"flex",gap:8,animation:"fadeUp .2s ease"}}>
            {careActions.map(a=>{
              const hasDone = careActions.some(x=>x.done);
              const labelStyle = {fontSize:10,fontWeight:800,color:a.done?"rgba(255,255,255,.7)":"#fff",lineHeight:1.2};
              if (a.done && hasDone) Object.assign(labelStyle, {maxHeight:"12px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:"16px"});
              return (
                <button key={a.label} className="btn-action" onClick={()=>{ setCareOpen(false); a.onClick(); }}
                  style={{flex:1,position:"relative",background:a.done?`${a.color}33`:`${a.color}44`,border:`1.5px solid ${a.done?`${a.color}66`:`${a.color}88`}`,borderRadius:14,padding:"10px 4px",opacity:a.done?0.88:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"2px",minHeight:68}}>
                  <span style={{fontSize:24,filter:a.done?"grayscale(.35)":"none",flexShrink:0}}>{a.emoji}</span>
                  <span style={labelStyle}>{a.label}</span>
                  {a.done && <span style={{position:"absolute",bottom:3,left:0,right:0,textAlign:"center",fontSize:9,color:"#4ECB71",fontWeight:700}}>✓ 완료</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
      <div style={{background:"rgba(80,40,20,.45)",backdropFilter:"blur(14px)",borderTop:"1.5px solid rgba(255,255,255,.15)",padding:"10px 12px 12px",display:"flex",gap:8}}>
        {tabs.map(t=>(
          <button key={t.label} className="btn-action" onClick={t.onClick}
            style={{flex:1,background:t.active?`${t.color}66`:`${t.color}44`,border:`1.5px solid ${t.active?`${t.color}cc`:`${t.color}88`}`,borderRadius:18,padding:"10px 4px"}}>
            <span style={{fontSize:26}}>{t.emoji}</span>
            <span style={{fontSize:10,fontWeight:800,color:"#fff"}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ===================================================
// 청소 모드 — 거품/샤워/빗질 도구로 펫을 문질러 청소(미니 인터랙션). home 오버레이.
// 하나라도 완료하면 V 활성 → onComplete(기존 handleClean: 청결+미션). X는 미커밋.
// ===================================================
// img = 확장자 없는 베이스 경로. CLEAN_IMG_EXTS 순서로 시도 → 다 없으면 icon(이모지) 폴백. webp/png/jpg 무관.
const CLEAN_IMG_EXTS = ["webp", "png", "jpg"];
const CLEAN_TOOLS = [
  { key:"foam",   icon:"🧽", label:"거품내기", img:"/images/clean/sponge" },
  { key:"shower", icon:"🚿", label:"샤워",     img:"/images/clean/shower" },
  { key:"brush",  icon:"🖌️", label:"빗질",     img:"/images/clean/brush" },
];
// 씻기 배경 — /images/clean/background.{webp,png,jpg} 있으면 사용, 없으면 그라데이션 폴백(CSS 다중 background).
const CLEAN_BG_CSS = [
  ...CLEAN_IMG_EXTS.map(ext => `url(/images/clean/background.${ext}) center/cover no-repeat`),
  "linear-gradient(180deg,#BFE6F5 0%,#D9F0FA 55%,#EAF7FC 100%)",
].join(", ");
const CLEAN_TH = 1200;  // 도구별 완료 누적 드래그 px(조정 가능)

// 도구 아이콘 — 베이스 경로에 확장자(webp→png→jpg) 차례로 시도, 다 실패 시 이모지 폴백
function CleanToolIcon({ t, size }) {
  const [extIdx, setExtIdx] = useState(0);
  useEffect(() => { setExtIdx(0); }, [t.img]);
  if (t.img && extIdx < CLEAN_IMG_EXTS.length)
    return <img src={`${t.img}.${CLEAN_IMG_EXTS[extIdx]}`} alt="" draggable={false}
      onError={()=>setExtIdx(i=>i+1)} style={{width:size,height:size,objectFit:"contain",display:"block"}}/>;
  return <span style={{fontSize:Math.round(size*0.92),lineHeight:1}}>{t.icon}</span>;
}

function CleaningOverlay({ petImg, petFallback, onComplete, onExit }) {
  const [tool, setTool] = useState("foam");
  const [progress, setProgress] = useState({ foam:0, shower:0, brush:0 });
  const [bubbles, setBubbles] = useState([]);    // 잔류 거품 {id,x,y,s}
  const [fx, setFx] = useState([]);              // 물줄기·반짝임(단명) {id,x,y,kind}
  const [cursor, setCursor] = useState(null);    // 도구 커서 {x,y}
  const dragRef = useRef(false), lastRef = useRef(null), spawnRef = useRef(0), idRef = useRef(0);
  const wrapRef = useRef(null), petRef = useRef(null);
  const toolRef = useRef(tool); useEffect(() => { toolRef.current = tool; }, [tool]);  // 인터벌이 현재 도구 읽기용

  const done = { foam: progress.foam>=CLEAN_TH, shower: progress.shower>=CLEAN_TH, brush: progress.brush>=CLEAN_TH };
  const anyDone = done.foam || done.shower || done.brush;

  // 빗질 누적 → 펫 둘레 반짝임 레벨(1~3). 진행도는 안 줄어드니 도구 바꿔도 유지됨.
  const shineLevel = progress.brush>=CLEAN_TH ? 3 : progress.brush>=CLEAN_TH*0.6 ? 2 : progress.brush>=CLEAN_TH*0.3 ? 1 : 0;
  const shineCount = [0,5,9,14][shineLevel];
  // 반짝임 슬롯 — 황금각으로 사방 균등 배치(어떤 개수를 잘라도 한쪽에 안 몰림). 펫 둘레를 골고루 감쌈.
  const [shineSlots] = useState(() => Array.from({ length:14 }, (_, i) => {
    const a = i * 2.39996323;                          // 황금각(≈137.5°) → prefix도 균등
    const rr = 0.74 + (i % 4) * 0.11 + Math.random()*0.1;  // 반경 다양(안쪽~둘레)
    return { dx: Math.cos(a)*168*rr, dy: Math.sin(a)*150*rr, s: 14+Math.random()*12, dur: 1.1+Math.random()*0.8, delay: (i%7)*0.16 };
  }));

  const addFx = (x, y, kind, extra={}) => {
    const id = idRef.current++;
    setFx(f => [...f, { id, x, y, kind, ...extra }]);
    setTimeout(() => setFx(f => f.filter(e => e.id !== id)), kind==="spray" ? 520 : 700);
  };

  // 샤워 분사(화면좌표 cx,cy) — 이동/홀드 공용. 펫 영역 안에서만.
  const showerAt = (cx, cy) => {
    const petBox = petRef.current?.getBoundingClientRect(), wrap = wrapRef.current?.getBoundingClientRect();
    if (!petBox || !wrap) return;
    const pcx=petBox.left+petBox.width/2, pcy=petBox.top+petBox.height/2, rx=petBox.width/2, ry=petBox.height/2;
    if (((cx-pcx)/rx)**2 + ((cy-pcy)/ry)**2 > 1.05) return;
    const x = cx - wrap.left, y = cy - wrap.top;
    for (let i=0; i<5; i++) {                                  // 대각선(좌하향) 물줄기 다발
      const ang = (130 + (Math.random()*40-20)) * Math.PI/180; // 중심 130°, ±20°
      const dist = 52 + Math.random()*56;
      addFx(x, y, "spray", { dx:Math.cos(ang)*dist, dy:Math.sin(ang)*dist, rot:ang*180/Math.PI-90 });
    }
    setBubbles(b => b.filter(bu => Math.hypot(bu.x-x, bu.y-y) > 28));  // 거품 씻겨나감 작을수록 더 적은 범위
    setProgress(p => ({ ...p, shower: Math.min(CLEAN_TH, p.shower + 14) }));  // 홀드 중 진행
  };
  // 누르고 있는 동안 샤워 물 계속 분사(움직이지 않아도)
  useEffect(() => {
    const id = setInterval(() => {
      if (dragRef.current && toolRef.current==="shower" && lastRef.current) showerAt(lastRef.current.x, lastRef.current.y);
    }, 55);
    return () => clearInterval(id);
  }, []);

  const scrub = (cx, cy) => {
    const petBox = petRef.current?.getBoundingClientRect(), wrap = wrapRef.current?.getBoundingClientRect();
    if (!petBox || !wrap) return;
    // 펫 영역(타원 근사) 안에서만 — 표면 마스킹
    const pcx=petBox.left+petBox.width/2, pcy=petBox.top+petBox.height/2, rx=petBox.width/2, ry=petBox.height/2;
    if (((cx-pcx)/rx)**2 + ((cy-pcy)/ry)**2 > 1.05) return;
    const x = cx - wrap.left, y = cy - wrap.top;
    const last = lastRef.current; const d = last ? Math.hypot(cx-last.x, cy-last.y) : 0;
    // 스폰 간격 제한(누적 18px마다)
    spawnRef.current += d;
    const emit = spawnRef.current >= 18; if (emit) spawnRef.current = 0;
    if (tool==="foam" && emit) {
      setBubbles(b => [...b.slice(-44), { id:idRef.current++, x, y, s:22+Math.random()*22 }]);
    } else if (tool==="brush" && emit) {
      addFx(x + (Math.random()*40-20), y + (Math.random()*40-20), "sparkle");
    }
    // 샤워는 인터벌이 홀드 중 계속 처리 → 여기선 분사·진행 안 함
    if (tool!=="shower" && last) setProgress(p => {
      const nv = Math.min(CLEAN_TH, p[tool] + d);
      return nv === p[tool] ? p : { ...p, [tool]: nv };
    });
  };

  const pos = (e) => { const t = e.touches?.[0]; return { x:(t||e).clientX, y:(t||e).clientY }; };
  const down = (e) => { dragRef.current = true; const p = pos(e); lastRef.current = p; scrub(p.x, p.y); };
  const move = (e) => {
    const p = pos(e); const wrap = wrapRef.current?.getBoundingClientRect();
    if (wrap) setCursor({ x:p.x-wrap.left, y:p.y-wrap.top });
    if (dragRef.current) { scrub(p.x, p.y); lastRef.current = p; }
  };
  const up = () => { dragRef.current = false; lastRef.current = null; };

  const cur = CLEAN_TOOLS.find(t => t.key===tool);

  return (
    <div ref={wrapRef}
      onTouchStart={down} onTouchMove={e=>{e.preventDefault();move(e);}} onTouchEnd={up}
      onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up}
      style={{position:"absolute",inset:0,zIndex:Z_UI.decorCtrl,overflow:"hidden",touchAction:"none",cursor:"none",
        background:CLEAN_BG_CSS}}>

      {/* 펫 (중앙 고정 정적) */}
      <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}>
        <img ref={petRef} src={petImg} alt="" draggable={false}
          onError={e => { if (petFallback && e.currentTarget.src !== location.origin+petFallback) e.currentTarget.src = petFallback; }}
          style={{width:200,height:"auto",display:"block",filter:"drop-shadow(0 10px 22px rgba(0,0,0,.25))"}}/>
      </div>

      {/* 펫 둘레 반짝임 — 빗질 누적 레벨(1~3)로 개수↑. 도구 바꿔도 유지(progress.brush 기반) */}
      {shineSlots.slice(0, shineCount).map((s, i) => (
        <div key={i} style={{position:"absolute",left:`calc(50% + ${s.dx}px)`,top:`calc(50% + ${s.dy}px)`,
          fontSize:s.s,color:"#fff",textShadow:"0 0 8px #fff,0 0 5px #BFE6F5",pointerEvents:"none",lineHeight:1,
          animation:`sparkleLoop ${s.dur}s ease-in-out ${s.delay}s infinite`}}>✦</div>
      ))}

      {/* 잔류 거품 — 폭신한 흰 덩어리 */}
      {bubbles.map(b => (
        <div key={b.id} style={{position:"absolute",left:b.x,top:b.y,width:b.s,height:b.s,transform:"translate(-50%,-50%)",
          borderRadius:"50%",background:"radial-gradient(circle at 38% 34%,#fff 0%,#fff 58%,rgba(255,255,255,.72) 100%)",
          boxShadow:"0 0 0 3px rgba(255,255,255,.55), 6px 2px 0 -2px rgba(255,255,255,.85), -6px 3px 0 -2px rgba(255,255,255,.8)",
          animation:"foamPop .25s ease",pointerEvents:"none"}}/>
      ))}

      {/* 단명 이펙트 — 물줄기(대각선 분사) / 반짝임 */}
      {fx.map(e => e.kind==="spray" ? (
        <div key={e.id} style={{position:"absolute",left:e.x,top:e.y,width:4,height:24,transformOrigin:"center",
          "--dx":`${e.dx}px`,"--dy":`${e.dy}px`,"--rot":`${e.rot}deg`,
          borderRadius:4,background:"linear-gradient(180deg,rgba(150,222,255,.95),rgba(205,242,255,.08))",
          animation:"sprayFly .5s ease-out forwards",pointerEvents:"none"}}/>
      ) : (
        <div key={e.id} style={{position:"absolute",left:e.x,top:e.y,fontSize:22,transform:"translate(-50%,-50%)",
          color:"#fff",textShadow:"0 0 8px #fff,0 0 4px #BFE6F5",animation:"sparkleTwinkle .7s ease forwards",pointerEvents:"none"}}>✦</div>
      ))}

      {/* 도구 커서 */}
      {cursor && <div style={{position:"absolute",left:cursor.x,top:cursor.y,transform:"translate(-50%,-50%)",pointerEvents:"none",filter:"drop-shadow(0 2px 4px rgba(0,0,0,.35))"}}><CleanToolIcon t={cur} size={70}/></div>}

      {/* 상단: X 종료 / V 완료 */}
      <div style={{position:"absolute",top:0,left:0,right:0,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",pointerEvents:"none"}}>
        <button onClick={onExit} style={{pointerEvents:"auto",width:42,height:42,borderRadius:"50%",border:"none",background:"rgba(0,0,0,.4)",color:"#fff",fontSize:18,fontWeight:800,cursor:"pointer"}}>✕</button>
        <span style={{fontFamily:"'Jua',sans-serif",fontSize:15,color:"#3A6B82",textShadow:"0 1px 3px rgba(255,255,255,.7)"}}>🫧 씻기기</span>
        <button onClick={()=>{ if(anyDone){ onComplete(); onExit(); } }} disabled={!anyDone}
          style={{pointerEvents:"auto",width:42,height:42,borderRadius:"50%",border:"none",background:anyDone?"linear-gradient(135deg,#4CAF50,#8BC34A)":"rgba(0,0,0,.25)",color:"#fff",fontSize:20,fontWeight:800,cursor:anyDone?"pointer":"not-allowed",boxShadow:anyDone?"0 3px 12px rgba(76,175,80,.5)":"none"}}>✓</button>
      </div>

      {/* 하단: 도구 3개 (자유 전환, 선택 강조, 완료 ✓) */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,display:"flex",justifyContent:"center",gap:14,padding:"16px",paddingBottom:"calc(16px + env(safe-area-inset-bottom,0px))"}}>
        {CLEAN_TOOLS.map(t => (
          <button key={t.key} onClick={()=>setTool(t.key)}
            style={{position:"relative",width:62,height:62,borderRadius:18,cursor:"pointer",
              border: tool===t.key?"3px solid #FFD200":"2px solid rgba(255,255,255,.7)",
              background: tool===t.key?"rgba(247,151,30,.92)":"rgba(0,0,0,.4)",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,color:"#fff"}}>
            <CleanToolIcon t={t} size={26}/>
            <span style={{fontSize:9,fontWeight:800}}>{t.label}</span>
            {done[t.key] && <span style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:"#4CAF50",color:"#fff",fontSize:12,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===================================================
// 미니게임
// ===================================================
const TIMER_IMG_EXTS = ["webp", "png", "jpg"];

function TimerIcon({ src, fallback, size = 24 }) {
  const [extIdx, setExtIdx] = useState(0);
  useEffect(() => { setExtIdx(0); }, [src]);
  if (src && !src.includes("/") && src.length === 2) {
    return <div style={{fontSize:size}}>{src}</div>;
  }
  if (src && extIdx < TIMER_IMG_EXTS.length) {
    return <img src={`${src}.${TIMER_IMG_EXTS[extIdx]}`} alt="timer" draggable={false}
      onError={()=>setExtIdx(i=>i+1)} style={{width:size,height:size,display:"block"}}/>;
  }
  return <div style={{fontSize:size}}>{fallback}</div>;
}

function MiniGame({ game, onAnswer, onBack }) {
  const [elapsed, setElapsed] = useState(0);
  const TIME_LIMIT = 10;
  useEffect(() => {
    if (game.done) return;
    const id = setInterval(() => {
      const e = (Date.now() - game.startTime) / 1000;
      setElapsed(Math.min(e, TIME_LIMIT + 1));
    }, 50);
    return () => clearInterval(id);
  }, [game.done, game.startTime]);

  const progress = Math.max(0, (TIME_LIMIT - elapsed) / TIME_LIMIT);
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:24,animation:"fadeUp .3s ease"}}>
      <button onClick={onBack} style={{alignSelf:"flex-start",background:PANEL_BTN,border:"none",borderRadius:20,padding:"8px 16px",color:INK,fontWeight:700,cursor:"pointer"}}>← 뒤로</button>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:44,marginBottom:8}}>🎮</div>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:22,color:INK,marginBottom:4}}>놀아주기 미니게임</h2>
        <p style={{color:INK_SUB,fontSize:13}}>정답을 맞혀보세요!</p>
      </div>
      <div style={{background:CARD_BG,backdropFilter:"blur(12px)",borderRadius:24,padding:"28px 40px",textAlign:"center",border:`2px solid ${CARD_BORDER}`}}>
        <p style={{color:INK_SUB,fontSize:13,marginBottom:8}}>다음을 계산하세요</p>
        <p style={{fontFamily:"'Jua',sans-serif",fontSize:44,color:INK}}>{game.a} × {game.b} = ?</p>
      </div>
      {!game.done && (
        <div style={{width:"100%",maxWidth:280,position:"relative"}}>
          <div style={{background:"rgba(0,0,0,.15)",borderRadius:12,height:14,overflow:"visible",border:`1px solid rgba(255,255,255,.2)`,position:"relative"}}>
            <div style={{width:`${progress*100}%`,height:"100%",background:"linear-gradient(90deg,#66BB6A,#4CAF50)",transition:"width .05s linear",borderRadius:12}}/>
            <div style={{position:"absolute",left:"70%",top:0,bottom:0,width:1.5,background:"#FFD700",zIndex:2}}/>
            <div style={{position:"absolute",left:-8,top:"50%",transform:"translateY(-50%)",zIndex:3}}>
              <TimerIcon src={MINIGAME_CONFIG.timerIcon} fallback="⏱️" size={MINIGAME_CONFIG.timerIconSize}/>
            </div>
          </div>
        </div>
      )}
      {game.done
        ? <div style={{textAlign:"center",animation:"pop .4s ease",width:"100%"}}>
            <div style={{fontSize:64}}>{game.correct?"🎉":"😢"}</div>
            {game.correct && (() => {
              const text = game.isPerfect ? "Perfect!" : "Good!";
              const fg = game.isPerfect
                ? "linear-gradient(180deg,#FFE566 0%,#FF9900 100%)"
                : "linear-gradient(180deg,#6EE56E 0%,#2E9E2E 100%)";
              const stroke = game.isPerfect ? "#C05000" : "#0A5A0A";
              const fs = game.isPerfect ? 40 : 34;
              const common = {fontFamily:"'Jua',sans-serif",fontSize:fs,fontWeight:900,letterSpacing:2,margin:0,position:"absolute",top:0,left:0,right:0,textAlign:"center"};
              return (
                <div style={{position:"relative",height:fs*1.4,marginTop:8,width:"100%"}}>
                  <p style={{...common,WebkitTextStroke:`8px ${stroke}`,color:stroke}}>{text}</p>
                  <p style={{...common,background:fg,WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent"}}>{text}</p>
                </div>
              );
            })()}
          </div>
        : <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,width:"100%"}}>
            {game.choices.map((c,i)=>(
              <button key={i} onClick={()=>onAnswer(c)} style={{background:CARD_BG,border:`2px solid ${CARD_BORDER}`,borderRadius:18,padding:"18px",fontSize:26,fontWeight:900,color:INK,cursor:"pointer",fontFamily:"'Jua',sans-serif"}}>
                {c}
              </button>
            ))}
          </div>
      }
    </div>
  );
}

// ===================================================
// 미션 화면 (행동 완료 후 보상 수령 분리)
// ===================================================
function MissionScreen({ daily, onClaim, onBack }) {
  const mult = daily.growthMultiplier > 1;
  const cl = daily.claimed || {};
  const missions = [
    { key:"feed",        emoji:"🍚", label:"밥 주기",         rewardIcon:"🌱", rewardLabel:mult?`성장 +${MISSION_REWARDS.feed.growth*2} (2배)`:`성장 +${MISSION_REWARDS.feed.growth}` },
    { key:"play",        emoji:"🎮", label:"놀아주기",        rewardIcon:"🌿", rewardLabel:mult?`성장 +${MISSION_REWARDS.play.growth*2} (2배)`:`성장 +${MISSION_REWARDS.play.growth}` },
    { key:"clean",       emoji:"🛁", label:"씻기기",          rewardIcon:"🌱", rewardLabel:mult?`성장 +${MISSION_REWARDS.clean.growth*2} (2배)`:`성장 +${MISSION_REWARDS.clean.growth}` },
    { key:"gift",        emoji:"🎁", label:"선물주기",        rewardIcon:"💰", rewardLabel:`재화 +${MISSION_REWARDS.gift.currency}` },
    { key:"statusCheck", emoji:"💖", label:"내 펫 상태 확인", rewardIcon:"💰", rewardLabel:`재화 +${MISSION_REWARDS.statusCheck.currency}` },
  ];
  const done = missions.filter(ms=>daily.missions[ms.key]).length;
  const allBonusClaimable = daily.missions.allCompleted && missions.every(ms=>cl[ms.key]) && !cl.allComplete;

  const getState = (key) => {
    if (!daily.missions[key]) return "todo";
    if (!cl[key]) return "claimable";
    return "claimed";
  };

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden",animation:"fadeUp .3s ease"}}>
      {/* ── 고정 헤더 영역 (디자인 유지) ── */}
      <div style={{flexShrink:0,padding:"18px 18px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <button onClick={onBack} style={{background:PANEL_BTN,border:"none",borderRadius:20,padding:"8px 14px",color:INK,fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:INK}}>📋 오늘의 미션</h2>
        <span style={{marginLeft:"auto",fontSize:13,color:INK_SUB}}>{done}/5 완료</span>
      </div>

      {/* 초기화 시간 */}
      <div style={{textAlign:"center",fontSize:11,color:INK_FAINT,marginBottom:6}}>🕛 매일 자정(00:00) 초기화</div>

      {/* 진행도 바 */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        <span style={{fontSize:11,fontWeight:700,color:INK_SUB}}>달성률</span>
        <span style={{fontSize:11,fontWeight:800,color:"#C8881A"}}>{Math.round((done/5)*100)}%</span>
      </div>
      <div style={{background:"rgba(0,0,0,.15)",borderRadius:10,height:8,overflow:"hidden",marginBottom:14}}>
        <div style={{width:`${(done/5)*100}%`,height:"100%",background:"linear-gradient(90deg,#F7971E,#FFD200)",borderRadius:10,transition:"width .5s"}}/>
      </div>
      </div>{/* ── 고정 헤더 끝 ── */}

      {/* ── 스크롤 콘텐츠 (상태 변화 흡수 → 프레임 불변) ── */}
      <div style={{flex:1,overflowY:"auto",minHeight:0,padding:"0 18px 18px",display:"flex",flexDirection:"column",gap:8}}>
        {missions.map(ms=>{
          const state = getState(ms.key);
          return (
            <div key={ms.key} style={{
              background: state==="claimed"?"rgba(78,203,113,.22)":state==="claimable"?"rgba(255,193,7,.28)":CARD_BG,
              border:`1.5px solid ${state==="claimed"?"rgba(78,203,113,.5)":state==="claimable"?"rgba(240,170,20,.55)":CARD_BORDER}`,
              borderRadius:16,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,backdropFilter:"blur(8px)"
            }}>
              <span style={{fontSize:24}}>{ms.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:state==="todo"?INK_FAINT:INK,fontSize:14}}>{ms.label}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4,background:PANEL_BTN,borderRadius:12,padding:"4px 9px"}}>
                <span style={{fontSize:13}}>{ms.rewardIcon}</span>
                <span style={{fontSize:11,fontWeight:700,color:INK_SUB}}>{ms.rewardLabel}</span>
              </div>
              {state==="todo"     && <span style={{fontSize:17,marginLeft:2}}>⬜</span>}
              {state==="claimable"&& <button onClick={()=>onClaim(ms.key)} style={{background:"linear-gradient(135deg,#F7971E,#FFD200)",border:"none",borderRadius:11,padding:"5px 10px",fontSize:11,fontWeight:800,color:"#fff",cursor:"pointer",whiteSpace:"nowrap",marginLeft:2}}>받기</button>}
              {state==="claimed"  && <span style={{fontSize:17,marginLeft:2}}>✅</span>}
            </div>
          );
        })}

        {/* 전체 완료 보너스 */}
        <div style={{
          background: cl.allComplete?"rgba(78,203,113,.22)":allBonusClaimable?"rgba(255,193,7,.3)":CARD_BG_DIM,
          border:`1.5px solid ${cl.allComplete?"rgba(78,203,113,.5)":allBonusClaimable?"rgba(240,170,20,.6)":CARD_BORDER}`,
          borderRadius:16,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,backdropFilter:"blur(8px)",marginTop:2
        }}>
          <span style={{fontSize:24}}>🎫</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,color:cl.allComplete?"#2E9E50":allBonusClaimable?"#C8881A":INK_FAINT,fontSize:14}}>전체 완료 보너스</div>
            <div style={{fontSize:10,color:INK_FAINT}}>모든 보상 수령 후 획득</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4,background:PANEL_BTN,borderRadius:12,padding:"4px 9px"}}>
            <span style={{fontSize:13}}>🎫</span>
            <span style={{fontSize:11,fontWeight:700,color:INK_SUB}}>×{MISSION_REWARDS.allComplete.tickets}</span>
          </div>
          {cl.allComplete        && <span style={{fontSize:17,marginLeft:2}}>✅</span>}
          {allBonusClaimable     && <button onClick={()=>onClaim("allComplete")} style={{background:"linear-gradient(135deg,#F7971E,#FFD200)",border:"none",borderRadius:11,padding:"5px 10px",fontSize:11,fontWeight:800,color:"#fff",cursor:"pointer",whiteSpace:"nowrap",marginLeft:2}}>받기</button>}
          {!cl.allComplete&&!allBonusClaimable && <span style={{fontSize:17,marginLeft:2}}>⬜</span>}
        </div>
      </div>
    </div>
  );
}

// ===================================================
// 선물뽑기
// ===================================================
function GachaScreen({ inv, daily, lastDraw, onDraw, onBack }) {
  const [spinning, setSpinning] = useState(false);
  const doSpin     = () => { if(inv.tickets<1||spinning) return; setSpinning(true); setTimeout(()=>{ onDraw(false); setSpinning(false); },700); };
  const doFreeSpin = () => { if(daily.freeGachaDone||spinning) return; setSpinning(true); setTimeout(()=>{ onDraw(true); setSpinning(false); },700); };
  const gc = { normal:"#8a7355", rare:"#1E88C7", superrare:"#C8881A" };
  const gl = { normal:"⚪ 일반", rare:"💙 희귀", superrare:"🌟 초레어" };
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",padding:20,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,alignSelf:"flex-start"}}>
        <button onClick={onBack} style={{background:PANEL_BTN,border:"none",borderRadius:20,padding:"8px 14px",color:INK,fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:INK}}>🎰 선물뽑기</h2>
      </div>
      <div style={{background:CARD_BG,border:`2px solid ${CARD_BORDER}`,borderRadius:28,padding:"32px 20px",textAlign:"center",width:"100%",backdropFilter:"blur(12px)",marginBottom:20}}>
        <div style={{fontSize:72,marginBottom:12,animation:spinning?"float .4s ease infinite":"float 3s ease-in-out infinite"}}>{spinning?"✨":lastDraw?lastDraw.emoji:"🎁"}</div>
        {lastDraw&&!spinning&&(
          <div style={{animation:"pop .4s ease"}}>
            <div style={{fontSize:13,color:gc[lastDraw.grade],fontWeight:800,marginBottom:4}}>{gl[lastDraw.grade]}</div>
            <div style={{fontSize:18,fontWeight:700,color:INK}}>{lastDraw.name}</div>
            <div style={{fontSize:13,color:INK_SUB,marginTop:4}}>{TRAITS[lastDraw.trait].emoji} {TRAITS[lastDraw.trait].label} +{lastDraw.traitValue}</div>
          </div>
        )}
      </div>
      <button onClick={doFreeSpin} disabled={daily.freeGachaDone||spinning}
        style={{background:daily.freeGachaDone?CARD_BG_DIM:"linear-gradient(135deg,#43a047,#66bb6a)",border:"none",borderRadius:20,padding:"14px 40px",fontSize:15,fontWeight:800,color:daily.freeGachaDone?INK_SUB:"#fff",cursor:daily.freeGachaDone?"not-allowed":"pointer",width:"100%",marginBottom:10,fontFamily:"'Jua',sans-serif",boxShadow:daily.freeGachaDone?"none":"0 4px 20px rgba(67,160,71,.4)"}}>
        {daily.freeGachaDone?"오늘 무료 뽑기 완료 ✓":"🎁 무료 뽑기 1회 (매일)"}
      </button>
      <button onClick={doSpin} disabled={inv.tickets<1||spinning}
        style={{background:inv.tickets>0?"linear-gradient(135deg,#F7971E,#FFD200)":CARD_BG_DIM,border:"none",borderRadius:20,padding:"14px 40px",fontSize:15,fontWeight:800,color:inv.tickets>0?"#fff":INK_SUB,cursor:inv.tickets>0?"pointer":"not-allowed",width:"100%",marginBottom:10,fontFamily:"'Jua',sans-serif",boxShadow:inv.tickets>0?"0 4px 20px rgba(247,151,30,.4)":"none"}}>
        🎫 뽑기 1회 (티켓 1장)
      </button>
      <div style={{color:INK_SUB,fontSize:12,marginBottom:14}}>보유 티켓: {inv.tickets}장</div>
      <div style={{background:CARD_BG_DIM,borderRadius:14,padding:"12px 20px",width:"100%",fontSize:12,color:INK_SUB,display:"flex",flexDirection:"column",gap:5}}>
        {[["⚪ 일반","#8a7355","80%","+1"],["💙 희귀","#1E88C7","17%","+2"],["🌟 초레어","#C8881A","3%","+3"]].map(([n,c,p,v])=>(
          <div key={n} style={{display:"flex",justifyContent:"space-between"}}><span style={{color:c}}>{n}</span><span>{p} · 성향 {v}</span></div>
        ))}
      </div>
    </div>
  );
}

// ===================================================
// 선물함
// ===================================================
// 선물 이미지 — imagePath 있으면 이미지, 없거나 로드 실패면 이모지 fallback
function GiftImage({ gift, size = 100 }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [gift?.imagePath]);
  if (gift?.imagePath && !failed) {
    return <img src={gift.imagePath} alt="" onError={() => setFailed(true)}
      style={{width:size,height:size,objectFit:"contain",display:"block"}}/>;
  }
  return <span style={{fontSize:Math.round(size*0.78),lineHeight:1}}>{gift?.emoji || "🎁"}</span>;
}

// 선물 상세 팝업 — 상점 팝업과 동일 패턴(바텀시트 + 배경탭/X 닫기). 선물주기는 기존 로직 연결.
function GiftDetailPopup({ gift, count, daily, onGive, onSell, onClose }) {
  const done = (daily.giftCount ?? 0) >= 2;
  const tr = TRAITS[gift.trait];
  const gradeLabel = { normal:"일반", rare:"희귀", superrare:"초레어" }[gift.grade];
  const unitPrice = GIFT_SELL_PRICE[gift.grade];
  const [sellMode, setSellMode] = useState(false);
  const [qty, setQty] = useState(1);
  const [confirmGive, setConfirmGive] = useState(false);
  useEffect(() => { setQty(q => Math.max(1, Math.min(q, count))); }, [count]);  // 보유 수량 변동 시 qty 보정
  return (
    <div onClick={onClose}
      style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,.65)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()}
        style={{width:"100%",maxWidth:430,background:"linear-gradient(160deg,#3a2d6e,#5b3fa0)",borderRadius:"24px 24px 0 0",padding:"24px 24px 36px",display:"flex",flexDirection:"column",alignItems:"center",gap:13,animation:"fadeUp .25s ease",position:"relative"}}>
        {/* 선물 주기 확인 팝업 */}
        {confirmGive && (
          <div onClick={()=>setConfirmGive(false)}
            style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div onClick={e=>e.stopPropagation()}
              style={{background:"#1e1438",border:"1.5px solid rgba(255,255,255,.2)",borderRadius:20,padding:"28px 24px",width:"80%",maxWidth:300,textAlign:"center"}}>
              <div style={{fontSize:36,marginBottom:10}}>🎁</div>
              <div style={{fontSize:15,fontWeight:800,color:"#fff",marginBottom:6}}>{gift.name}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:20}}>선물을 줄까요?</div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setConfirmGive(false)}
                  style={{flex:1,padding:"10px 0",borderRadius:12,border:"1.5px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.08)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Jua',sans-serif"}}>
                  취소
                </button>
                <button onClick={()=>{ setConfirmGive(false); onGive(); }}
                  style={{flex:1,padding:"10px 0",borderRadius:12,border:"none",background:"linear-gradient(135deg,#FF6B6B,#FF8E53)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Jua',sans-serif"}}>
                  확인🎁
                </button>
              </div>
            </div>
          </div>
        )}
        {/* 닫기 */}
        <button onClick={onClose}
          style={{position:"absolute",top:14,right:18,background:"rgba(255,255,255,.15)",border:"none",borderRadius:"50%",width:30,height:30,fontSize:16,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        {/* 이미지 */}
        <div style={{width:120,height:120,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.1)",borderRadius:20}}>
          <GiftImage gift={gift} size={100}/>
        </div>
        {/* 이름 + 등급 */}
        <div style={{fontFamily:"'Jua',sans-serif",fontSize:18,color:"#fff",textAlign:"center"}}>{gift.name}</div>
        <div style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,.6)",background:"rgba(255,255,255,.1)",borderRadius:10,padding:"3px 12px"}}>{gradeLabel}</div>
        {/* 설명 (데이터 파생) */}
        <div style={{fontSize:13,color:"rgba(255,255,255,.65)",textAlign:"center",lineHeight:1.6,maxWidth:280}}>
          주면 {tr.emoji} {tr.label} 성향이 <b style={{color:tr.color}}>+{gift.traitValue}</b> 올라요.
        </div>
        {/* 보유 수량 */}
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)"}}>보유 수량 <b style={{color:"#fff"}}>{count}개</b></div>
        {/* 선물 주기 | 판매 (나란히) */}
        <div style={{display:"flex",gap:10,width:"100%",maxWidth:280}}>
          <button onClick={done ? undefined : () => setConfirmGive(true)} disabled={done}
            style={{flex:1.3,padding:"12px 0",borderRadius:14,border:"none",cursor:done?"not-allowed":"pointer",background:done?"rgba(255,255,255,.1)":"linear-gradient(135deg,#FF6B6B,#FF8E53)",color:done?"rgba(255,255,255,.3)":"#fff",fontWeight:800,fontSize:14,fontFamily:"'Jua',sans-serif"}}>
            {done ? "선물 완료 ✓" : `선물 주기 🎁 (${daily.giftCount??0}/2)`}
          </button>
          <button onClick={()=>setSellMode(s=>!s)}
            style={{flex:1,padding:"12px 0",borderRadius:14,border:"none",cursor:"pointer",background:sellMode?"rgba(67,160,71,.55)":"linear-gradient(135deg,#43a047,#66bb6a)",color:"#fff",fontWeight:800,fontSize:14,fontFamily:"'Jua',sans-serif"}}>
            판매 💰
          </button>
        </div>
        {/* 판매 패널 — 수량 선택 후 OK */}
        {sellMode && (
          <div style={{width:"100%",maxWidth:280,background:"rgba(0,0,0,.22)",borderRadius:14,padding:"14px",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
            <div style={{fontSize:12,color:"rgba(255,255,255,.7)"}}>개당 <b style={{color:"#FFD700"}}>{unitPrice}💰</b></div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))}
                style={{width:34,height:34,borderRadius:"50%",border:"none",background:"rgba(255,255,255,.15)",color:"#fff",fontSize:20,fontWeight:800,cursor:"pointer"}}>−</button>
              <span style={{fontFamily:"'Jua',sans-serif",fontSize:16,color:"#fff",minWidth:54,textAlign:"center"}}>{qty} / {count}</span>
              <button onClick={()=>setQty(q=>Math.min(count,q+1))}
                style={{width:34,height:34,borderRadius:"50%",border:"none",background:"rgba(255,255,255,.15)",color:"#fff",fontSize:20,fontWeight:800,cursor:"pointer"}}>+</button>
            </div>
            <button onClick={()=>onSell(gift.id, qty)}
              style={{width:"100%",padding:"11px 0",borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#F7971E,#FFD200)",color:"#fff",fontWeight:800,fontSize:14,fontFamily:"'Jua',sans-serif"}}>
              {qty}개 판매하고 +{unitPrice*qty}💰 받기 (OK)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GiftBox({ inv, daily, sel, onSel, onGive, onSell, onBack }) {
  const selected = inv.gifts.find(g => g.instanceId === sel);
  const selCount = selected ? inv.gifts.filter(g => g.id === selected.id).length : 0;
  // 종류별 그룹 (master id 기준) — 카드 1개 = 1종류, count로 보유 수량 표시
  const groups = Object.values(inv.gifts.reduce((acc, g) => {
    if (!acc[g.id]) acc[g.id] = { ...g, count: 0, first: g.instanceId };
    acc[g.id].count++;
    return acc;
  }, {}));
  const gradeStyle = {
    normal:    { label:"일반",   color:"rgba(90,62,27,.5)",  bg:"rgba(120,90,50,.1)" },
    rare:      { label:"희귀",   color:"#4FC3F7",            bg:"rgba(79,195,247,.15)" },
    superrare: { label:"초레어", color:"#E0A91E",            bg:"rgba(255,193,7,.18)" },
  };
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",padding:18,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <button onClick={onBack} style={{background:PANEL_BTN,border:"none",borderRadius:20,padding:"8px 14px",color:INK,fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:INK}}>🎁 선물함</h2>
        <span style={{marginLeft:"auto",fontSize:13,color:INK_SUB}}>{inv.gifts.length}개</span>
      </div>
      {inv.gifts.length === 0
        ? <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,color:INK_FAINT}}>
            <span style={{fontSize:48}}>📭</span><p style={{fontSize:13}}>선물이 없어요. 뽑기를 해보세요!</p>
          </div>
        : <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,flex:1,overflowY:"auto",alignContent:"start",paddingBottom:8}}>
            {groups.map(g=>{
              const gs = gradeStyle[g.grade];
              return (
                <button key={g.id} onClick={()=>onSel(g.first)}
                  style={{background:CARD_BG,border:`1.5px solid ${CARD_BORDER}`,borderRadius:18,padding:"16px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <div style={{fontSize:40,lineHeight:1}}>{g.emoji}</div>
                  <div style={{fontSize:12,fontWeight:800,color:INK}}>{g.name}</div>
                  <div style={{fontSize:11,color:TRAITS[g.trait].color,whiteSpace:"nowrap"}}>
                    {TRAITS[g.trait].emoji} +{g.traitValue}
                    {g.count>1 && <span style={{color:INK_SUB}}> · {g.count}개 보유</span>}
                  </div>
                  <div style={{fontSize:10,fontWeight:800,color:gs.color,background:gs.bg,borderRadius:8,padding:"2px 8px",marginTop:2}}>
                    {gs.label}
                  </div>
                </button>
              );
            })}
          </div>
      }
      {/* 상세 팝업 — sel(selGift) 구동. 주면 handleGiftGive가 setSelGift(null) → 자동 닫힘 */}
      {selected && (
        <GiftDetailPopup gift={selected} count={selCount} daily={daily} onGive={onGive} onSell={onSell} onClose={()=>onSel(null)}/>
      )}
    </div>
  );
}

// ===================================================
// 도감
// ===================================================
function CollectionDetailPopup({ formKey, form, onClose }) {
  const trait = TRAITS[formKey];
  return (
    <Overlay>
      <div style={{background:"rgba(16,14,36,.96)",backdropFilter:"blur(20px)",borderRadius:28,padding:"28px 24px",width:"90%",maxWidth:340,border:`1.5px solid ${form.color}44`,animation:"slideUp .35s ease",textAlign:"center",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"rgba(255,255,255,.12)",border:"none",borderRadius:14,padding:"5px 11px",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:14}}>✕</button>
        <div style={{fontSize:60,marginBottom:10}}>{form.emoji}</div>
        <h3 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:"#fff",marginBottom:14}}>{form.name}</h3>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          <div style={{background:`${form.color}22`,border:`1.5px solid ${form.color}55`,borderRadius:14,padding:"10px 16px",textAlign:"center"}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:4}}>주 성향</div>
            <div style={{fontSize:15,fontWeight:800,color:form.color}}>{trait.label} {trait.emoji}</div>
          </div>
          <div style={{background:"rgba(255,255,255,.07)",border:"1.5px solid rgba(255,255,255,.12)",borderRadius:14,padding:"10px 16px",textAlign:"center"}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:4}}>고유 스킬</div>
            <div style={{fontSize:15,fontWeight:800,color:"#fff"}}>{form.skill} {form.skillEmoji}</div>
          </div>
        </div>
        <button onClick={onClose} style={{width:"100%",background:`linear-gradient(135deg,${form.color},${form.color}99)`,border:"none",borderRadius:14,padding:"12px",fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"'Jua',sans-serif"}}>
          확인
        </button>
      </div>
    </Overlay>
  );
}

function Collection({ inv, onBack }) {
  const [selectedKey, setSelectedKey] = useState(null);
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",padding:18,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <button onClick={onBack} style={{background:PANEL_BTN,border:"none",borderRadius:20,padding:"8px 14px",color:INK,fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:INK}}>📖 도감</h2>
        <span style={{marginLeft:"auto",fontSize:13,color:INK_SUB}}>{inv.unlockedPets.length}/6</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {Object.entries(FINAL_FORMS).map(([key,form])=>{
          const unlocked = inv.unlockedPets.includes(key);
          return (
            <div key={key} onClick={()=>unlocked&&setSelectedKey(key)}
              style={{background:unlocked?CARD_BG:CARD_BG_DIM,border:`1.5px solid ${CARD_BORDER}`,borderRadius:18,padding:"16px 6px",textAlign:"center",backdropFilter:"blur(8px)",cursor:unlocked?"pointer":"default"}}>
              <div style={{fontSize:40,marginBottom:5,filter:unlocked?"none":"grayscale(1) brightness(.3)"}}>{form.emoji}</div>
              <div style={{fontSize:11,fontWeight:700,color:unlocked?INK:INK_FAINT}}>{unlocked?form.name:"???"}</div>
              {unlocked&&<div style={{fontSize:10,color:TRAITS[key].color,marginTop:3}}>{TRAITS[key].emoji} {TRAITS[key].label}</div>}
            </div>
          );
        })}
      </div>
      {selectedKey && (
        <CollectionDetailPopup
          formKey={selectedKey}
          form={FINAL_FORMS[selectedKey]}
          onClose={()=>setSelectedKey(null)}
        />
      )}
    </div>
  );
}

// ===================================================
// 상점
// ===================================================
// 상품 이미지 — 로드 실패 시 카테고리별 이모지 fallback
const SHOP_IMG_EXTS = ["webp", "png", "jpg"];
function ShopItemImage({ item, size=64 }) {
  const [extIdx, setExtIdx] = useState(0);
  const [legacyFailed, setLegacyFailed] = useState(false);
  useEffect(() => { setExtIdx(0); setLegacyFailed(false); }, [item.id]);
  const fallback = item.emoji || CATEGORY_FALLBACK[item.category] || "🛍️";
  if (item.asset) {
    if (extIdx < SHOP_IMG_EXTS.length)
      return <img src={`${item.asset}.${SHOP_IMG_EXTS[extIdx]}`} alt="" onError={()=>setExtIdx(i=>i+1)}
        style={{width:size,height:size,maxWidth:size,maxHeight:size,objectFit:"contain",display:"block"}}/>;
  } else if (item.imagePath && !legacyFailed) {
    return <img src={item.imagePath} alt="" onError={()=>setLegacyFailed(true)}
      style={{width:size,height:size,maxWidth:size,maxHeight:size,objectFit:"contain",display:"block"}}/>;
  }
  return <span style={{fontSize:Math.round(size*0.62),lineHeight:1}}>{fallback}</span>;
}

// ===================================================
// 꾸미기 모드 하단 패널 (홈에서만 사용)
// ===================================================
function DecorateModePanel({ inv, draftBg, draftDecos, isOpen, onToggle, onBgSelect, onDecoAdd, onDecoRemoveAll }) {
  const [confirmItem, setConfirmItem] = useState(null);  // 전부 치우기 확인 팝업 대상 아이템
  const ownedBgs   = SHOP_MASTER.filter(i => i.category === "background" && (inv.shopItems?.[i.id]?.owned || i.isDefault));
  const ownedDecos = SHOP_MASTER.filter(i => DECOR_CATEGORIES.includes(i.category) && (inv.shopItems?.[i.id]?.count || 0) > 0);
  // 종류별 현재 배치된(draft) 인스턴스 수 — 잔여 개수 표시용
  const placedCount = {};
  Object.values(draftDecos).forEach(s => { placedCount[s.itemId] = (placedCount[s.itemId] || 0) + 1; });

  // 배경 타일 — 선택 토글
  const BgTile = ({ item, active, onTap }) => (
    <div onClick={onTap}
      style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,
        padding:"8px 6px",borderRadius:14,cursor:"pointer",minWidth:68,
        background:active?"rgba(255,255,255,.25)":"rgba(255,255,255,.08)",
        border:`1.5px solid ${active?"rgba(255,255,255,.5)":"rgba(255,255,255,.15)"}`}}>
      <div style={{width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <ShopItemImage item={item} size={44}/>
      </div>
      <div style={{fontSize:10,color:"#fff",fontFamily:"'Jua',sans-serif",textAlign:"center",
        wordBreak:"keep-all",maxWidth:64,overflow:"hidden",
        display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
        {item.name}
      </div>
      {active && (
        <div style={{fontSize:9,background:"rgba(80,200,100,.35)",borderRadius:6,
          padding:"2px 6px",color:"#7FFFD4",fontWeight:800}}>
          ✓ 선택됨
        </div>
      )}
    </div>
  );

  // 데코/창문 타일 — 탭하면 1개씩 추가. 잔여(보유−배치)가 0이면 비활성.
  const DecoTile = ({ item }) => {
    const owned = inv.shopItems?.[item.id]?.count || 0;
    const placed = placedCount[item.id] || 0;
    const remain = owned - placed;
    const disabled = remain <= 0;
    return (
      <div onClick={disabled ? () => setConfirmItem(item) : () => onDecoAdd(item.id)}
        style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,
          padding:"8px 6px",borderRadius:14,cursor:disabled?"default":"pointer",minWidth:68,
          opacity:disabled?0.45:1,
          background:placed>0?"rgba(255,255,255,.18)":"rgba(255,255,255,.08)",
          border:`1.5px solid ${placed>0?"rgba(255,255,255,.4)":"rgba(255,255,255,.15)"}`}}>
        <div style={{width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <ShopItemImage item={item} size={44}/>
        </div>
        <div style={{fontSize:10,color:"#fff",fontFamily:"'Jua',sans-serif",textAlign:"center",
          wordBreak:"keep-all",maxWidth:64,overflow:"hidden",
          display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
          {item.name}
        </div>
        <div style={{fontSize:9,background:"rgba(0,0,0,.3)",borderRadius:6,
          padding:"2px 6px",color:disabled?"#FF9B9B":"#7FFFD4",fontWeight:800}}>
          {disabled ? "다 놓음" : `+추가 ${remain}/${owned}`}
        </div>
      </div>
    );
  };

  return (
    <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:Z_UI.decorCtrl}}>

      {/* 전부 치우기 확인 팝업 */}
      {confirmItem && (
        <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.55)"}}>
          <div style={{background:"#1e1438",border:"1.5px solid rgba(255,255,255,.2)",borderRadius:20,padding:"24px 20px",width:"80%",maxWidth:300,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:10}}>🗑️</div>
            <div style={{fontSize:15,fontWeight:800,color:"#fff",marginBottom:6}}>{confirmItem.name}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.65)",marginBottom:20}}>방에 놓은 걸 전부 치울까요?</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={() => setConfirmItem(null)}
                style={{flex:1,padding:"10px 0",borderRadius:12,border:"1.5px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.08)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                아니요
              </button>
              <button onClick={() => { onDecoRemoveAll(confirmItem.id); setConfirmItem(null); }}
                style={{flex:1,padding:"10px 0",borderRadius:12,border:"none",background:"#e05555",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer"}}>
                치울게요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토글 핸들 */}
      <div onClick={onToggle}
        style={{display:"flex",justifyContent:"center",alignItems:"center",
          background:"rgba(30,20,60,.88)",borderRadius:"14px 14px 0 0",
          padding:"8px 0",cursor:"pointer",gap:6}}>
        <span style={{fontSize:12,color:"rgba(255,255,255,.7)",fontWeight:700}}>
          {isOpen ? "▼ 아이템 선택" : "▲ 아이템 선택"}
        </span>
      </div>

      {/* 패널 본체 */}
      {isOpen && (
        <div style={{background:"rgba(30,20,60,.92)",padding:"12px 16px 24px",
          maxHeight:"38vh",overflowY:"auto"}}>

          {/* 배경 섹션 */}
          {ownedBgs.length > 0 && (
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.45)",
                marginBottom:8,letterSpacing:1}}>배경</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {ownedBgs.map(item => (
                  <BgTile key={item.id} item={item}
                    active={draftBg === item.id}
                    onTap={() => onBgSelect(item.id)}/>
                ))}
              </div>
            </div>
          )}

          {/* 장식품 섹션 */}
          <div>
            <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.45)",
              marginBottom:8,letterSpacing:1}}>장식품</div>
            {ownedDecos.length === 0 ? (
              <div style={{fontSize:12,color:"rgba(255,255,255,.3)",padding:"4px 0"}}>
                보유한 장식품이 없어요. 상점에서 구매하세요.
              </div>
            ) : (
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {ownedDecos.map(item => (
                  <DecoTile key={item.id} item={item}/>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ShopDetailPopup({ item, inv, onBuy, onClose }) {
  const si = inv.shopItems?.[item.id];
  const owned = si?.owned || item.isDefault;
  const canAfford = inv.currency >= item.price;
  const stackable = DECOR_CATEGORIES.includes(item.category);  // 창문·장식품: 재구매로 수량 누적
  const count = si?.count || 0;
  const showBuy = !item.isDefault && (stackable || !owned);   // 스택 아이템은 항상 구매 가능

  return (
    <div
      onClick={onClose}
      style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,.65)",
        display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div
        onClick={e=>e.stopPropagation()}
        style={{width:"100%",maxWidth:430,background:"linear-gradient(160deg,#3a2d6e,#5b3fa0)",
          borderRadius:"24px 24px 0 0",padding:"24px 24px 36px",
          display:"flex",flexDirection:"column",alignItems:"center",gap:16,
          animation:"fadeUp .25s ease",position:"relative"}}>

        {/* 닫기 */}
        <button onClick={onClose}
          style={{position:"absolute",top:14,right:18,background:"rgba(255,255,255,.15)",
            border:"none",borderRadius:"50%",width:30,height:30,fontSize:16,
            cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
          ✕
        </button>

        {/* 큰 이미지 */}
        <div style={{width:120,height:120,display:"flex",alignItems:"center",justifyContent:"center",
          background:"rgba(255,255,255,.1)",borderRadius:20}}>
          <ShopItemImage item={item} size={100}/>
        </div>

        {/* 상품명 */}
        <div style={{fontFamily:"'Jua',sans-serif",fontSize:18,color:"#fff",textAlign:"center"}}>{item.name}</div>

        {/* 설명 */}
        <div style={{fontSize:13,color:"rgba(255,255,255,.65)",textAlign:"center",lineHeight:1.6,maxWidth:280}}>
          {item.description}
        </div>

        {/* 상태/가격 표시 */}
        {item.isDefault && (
          <div style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>기본 제공</div>
        )}
        {stackable && count > 0 && (
          <div style={{fontSize:13,fontWeight:800,color:"rgba(80,220,120,.9)"}}>✓ 보유 {count}개</div>
        )}
        {!item.isDefault && !stackable && owned && (
          <div style={{fontSize:13,fontWeight:800,color:"rgba(80,220,120,.9)"}}>✓ 보유 중</div>
        )}
        {showBuy && (
          <div style={{fontSize:14,fontWeight:800,color:canAfford?"#FFD700":"#FF6B6B"}}>
            💰 {item.price}{!canAfford && "  (재화 부족)"}
          </div>
        )}

        {/* 구매 버튼 — 스택 아이템은 보유 중에도 노출(재구매) */}
        {showBuy && (
          <button onClick={()=>{ onBuy(item.id); onClose(); }} disabled={!canAfford}
            style={{width:"100%",maxWidth:280,padding:"12px 0",borderRadius:14,border:"none",
              cursor:canAfford?"pointer":"not-allowed",
              background:canAfford?"linear-gradient(135deg,#F7971E,#FFD200)":"rgba(255,255,255,.1)",
              color:"#fff",fontWeight:800,fontSize:15,fontFamily:"'Nunito',sans-serif"}}>
            {canAfford?(stackable && count>0 ? "더 구매하기" : "구매하기"):"재화가 부족해요"}
          </button>
        )}
      </div>
    </div>
  );
}

function Shop({ inv, onBuy, onBack }) {
  const TABS = [
    { key:"background", label:"배경" },
    { key:"decoration", label:"장식" },
    { key:"gift_item",  label:"선물" },
  ];
  const SORT_OPTIONS = [
    { key:"name",  label:"이름순" },
    { key:"price", label:"가격순" },
  ];
  const [tab, setTab] = useState("background");
  const [sort, setSort] = useState("name"); // "name" | "price"
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const sortRef = useRef(null);

  useEffect(() => {
    if (!sortOpen) return;
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [sortOpen]);

  const isUnlocked = (item) => !item.formKey || inv.formEvents?.[item.formKey]?.shopEventDone;

  const sorted = SHOP_MASTER
    .filter(i => (tab === "decoration" ? DECOR_CATEGORIES.includes(i.category) : i.category === tab) && isUnlocked(i))
    .slice()
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : a.name.localeCompare(b.name, "ko")
    );

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",animation:"fadeUp .3s ease",position:"relative"}}>

      {/* 헤더 */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"16px 20px 0",flexShrink:0}}>
        <button onClick={onBack} style={{background:PANEL_BTN,border:"none",borderRadius:20,padding:"8px 14px",color:INK,fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:INK}}>🏪 상점</h2>
        <div style={{marginLeft:"auto",background:PANEL_BTN,borderRadius:14,padding:"4px 12px",fontSize:13,fontWeight:800,color:"#C8881A"}}>
          💰 {inv.currency}
        </div>
      </div>

      {/* 카테고리 탭 + 정렬 아이콘 */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 20px 10px",flexShrink:0}}>
        <div style={{display:"flex",gap:6,flex:1}}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)}
              style={{flex:1,padding:"8px 0",borderRadius:12,border:"none",cursor:"pointer",
                background:tab===t.key?"#FFF7E6":CARD_BG,
                color:tab===t.key?INK:INK_SUB,fontWeight:700,fontSize:13,fontFamily:"'Nunito',sans-serif"}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* 정렬 아이콘 버튼 + 팝업 */}
        <div ref={sortRef} style={{position:"relative",flexShrink:0}}>
          <button
            onClick={()=>setSortOpen(o=>!o)}
            style={{width:38,height:38,borderRadius:10,border:"none",cursor:"pointer",
              background:sortOpen?"#FFF7E6":CARD_BG,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
            {/* 3줄 정렬 아이콘 */}
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <rect x="0" y="0"  width="18" height="2.2" rx="1.1" fill={INK}/>
              <rect x="2" y="5.9" width="14" height="2.2" rx="1.1" fill={INK}/>
              <rect x="5" y="11.8" width="8"  height="2.2" rx="1.1" fill={INK}/>
            </svg>
          </button>

          {sortOpen && (
            <div style={{position:"absolute",top:44,right:0,zIndex:50,
              background:"#FFF7E6",borderRadius:12,overflow:"hidden",
              boxShadow:"0 4px 20px rgba(80,55,20,.3)",minWidth:90,border:`1.5px solid ${CARD_BORDER}`}}>
              {SORT_OPTIONS.map(s=>(
                <button key={s.key}
                  onClick={()=>{ setSort(s.key); setSortOpen(false); }}
                  style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"11px 14px",
                    border:"none",cursor:"pointer",background:"transparent",textAlign:"left",
                    fontFamily:"'Nunito',sans-serif",fontSize:13,fontWeight:700,
                    color:sort===s.key?"#C8881A":INK_SUB}}>
                  <span style={{width:12,fontSize:10,color:"#C8881A"}}>
                    {sort===s.key?"▶":""}
                  </span>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 상품 그리드 */}
      <div style={{flex:1,overflowY:"auto",padding:"0 20px 24px"}}>
        {sorted.length===0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:12}}>
            <span style={{fontSize:48}}>{CATEGORY_FALLBACK[tab]}</span>
            <p style={{color:INK_SUB,fontSize:13}}>준비 중이에요!</p>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {sorted.map(item=>{
              const si      = inv.shopItems?.[item.id];
              const owned   = si?.owned || item.isDefault;
              const canAfford = inv.currency >= item.price;
              const stackable = DECOR_CATEGORIES.includes(item.category);  // 창문·장식품: 재구매 가능
              const count   = si?.count || 0;
              const has     = item.isDefault || (stackable ? count > 0 : owned);
              return (
                <div key={item.id} onClick={()=>setSelectedItem(item)} style={{
                  background:has?CARD_BG:CARD_BG_DIM,
                  border:`1.5px solid ${CARD_BORDER}`,
                  borderRadius:18,padding:"14px 10px",display:"flex",flexDirection:"column",
                  alignItems:"center",gap:8,backdropFilter:"blur(8px)",cursor:"pointer"}}>

                  <div style={{width:64,height:64,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <ShopItemImage item={item} size={64}/>
                  </div>

                  <div style={{fontFamily:"'Jua',sans-serif",fontSize:13,color:INK,textAlign:"center",
                    wordBreak:"keep-all",WebkitLineClamp:2,overflow:"hidden",
                    display:"-webkit-box",WebkitBoxOrient:"vertical"}}>
                    {item.name}
                  </div>

                  <div style={{fontSize:11,fontWeight:800,
                    color:item.isDefault?"#3E9E54":canAfford?"#C8881A":"#D9483B"}}>
                    {item.isDefault
                      ? "기본 제공"
                      : stackable
                        ? (count>0 ? `보유 ${count} · 💰${item.price}` : `💰 ${item.price}`)
                        : owned ? "✓ 보유 중" : `💰 ${item.price}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 상세 팝업 */}
      {selectedItem && (
        <ShopDetailPopup
          item={selectedItem}
          inv={inv}
          onBuy={onBuy}
          onClose={()=>setSelectedItem(null)}
        />
      )}
    </div>
  );
}

// ===================================================
// 스킬
// ===================================================
function SkillScreen({ pet, onBack }) {
  const form = pet.finalForm ? FINAL_FORMS[pet.finalForm] : null;
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",padding:20,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,alignSelf:"flex-start"}}>
        <button onClick={onBack} style={{background:PANEL_BTN,border:"none",borderRadius:20,padding:"8px 14px",color:INK,fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:INK}}>⚡ 펫 스킬</h2>
      </div>
      {form&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,width:"100%"}}>
          {/* 기본 기능 — 모든 3단계 펫 공통 */}
          <div style={{background:CARD_BG,border:`2px solid ${CARD_BORDER}`,borderRadius:20,padding:"18px",width:"100%",textAlign:"center",backdropFilter:"blur(8px)"}}>
            <div style={{fontSize:11,fontWeight:700,color:INK_SUB,marginBottom:6}}>기본 기능 · 모든 펫 공통</div>
            <div style={{fontSize:52}}>{BASE_SKILL.emoji}</div>
            <h3 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:INK,marginTop:4}}>{BASE_SKILL.name}</h3>
          </div>
          {/* 고유 스킬 — 형태별 */}
          <div style={{background:CARD_BG,border:`2px dashed ${CARD_BORDER}`,borderRadius:20,padding:"18px",width:"100%",textAlign:"center",backdropFilter:"blur(8px)"}}>
            <div style={{fontSize:11,fontWeight:700,color:INK_SUB,marginBottom:6}}>고유 스킬 · <span style={{color:form.color}}>{form.name}</span> 전용</div>
            <div style={{fontSize:52}}>{form.skillEmoji}</div>
            <h3 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:INK,marginTop:4}}>{form.skill}</h3>
            <p style={{color:INK_SUB,fontSize:12,marginTop:8}}>🔧 향후 업데이트에서 사용 가능해질 예정이에요.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================================================
// 미구현 기능 화면 (대회·놀러가기·소셜) — 구조만, "준비 중" 안내만 표시(P6). 로직은 "구현해줘" 시 작성.
// ===================================================
function PlaceholderScreen({ emoji, title, desc, onBack }) {
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",padding:20,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,alignSelf:"flex-start"}}>
        <button onClick={onBack} style={{background:PANEL_BTN,border:"none",borderRadius:20,padding:"8px 14px",color:INK,fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:INK}}>{emoji} {title}</h2>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,width:"100%"}}>
        <div style={{fontSize:80,opacity:.45}}>{emoji}</div>
        <div style={{background:CARD_BG,border:`2px dashed ${CARD_BORDER}`,borderRadius:20,padding:"22px",width:"100%",textAlign:"center",backdropFilter:"blur(8px)"}}>
          <div style={{fontSize:28,marginBottom:10}}>🔧</div>
          <p style={{color:INK_SUB,fontSize:13,lineHeight:1.7}}>{desc}<br/><br/>준비 중인 기능이에요. 곧 만나요!</p>
        </div>
      </div>
    </div>
  );
}

// ===================================================
// 놀러가기 (Phase 1) — 친구 집 코드를 받아 읽기전용으로 렌더. 무서버·코드 기반.
// ===================================================
// 방문 코드: 친구 집 렌더에 필요한 최소 데이터(외형·배경·장식)만 LZString 압축. 세이브 코드와 별개.
function makeVisitCode(egg, pet, inv) {
  const bg = (SHOP_MASTER.find(i => i.category==="background" && inv.shopItems?.[i.id]?.equipped) || {}).id || null;
  const payload = { v:1, egg, pet:{ stage:pet.stage, finalForm:pet.finalForm||null, name:pet.name||"" }, bg, decos: inv.placedDecos || [] };
  return LZString.compressToBase64(JSON.stringify(payload));
}
function parseVisitCode(code) {
  try {
    const data = JSON.parse(LZString.decompressFromBase64((code||"").trim()));
    if (!data || data.v !== 1 || !data.pet || typeof data.pet.stage !== "number") return null;
    return data;
  } catch { return null; }
}

// 친구 집 읽기전용 렌더 — 방 배경+장식+펫+스크롤만 재사용. 액션·패널·상단/하단 바 없음.
function VisitHome({ data, myEgg, myPet, weather, onExit }) {
  const egg = data.egg, vpet = data.pet;
  const displayBg = SHOP_MASTER.find(i => i.id === data.bg) || null;
  const displayDecos = (data.decos || [])
    .map(p => ({ iid: p.iid, item: SHOP_MASTER.find(m => m.id === p.itemId), state: p }))
    .filter(d => d.item);

  const midRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const scrollXRef = useRef(0);
  useEffect(() => { scrollXRef.current = scrollX; }, [scrollX]);
  const dragRef = useRef({ active:false, startX:0, startScroll:0 });
  const onTouchStart = (e) => { if (e.target.closest?.("[data-pet]")) return; dragRef.current = { active:true, startX:e.touches[0].clientX, startScroll:scrollX }; };
  const onTouchMove  = (e) => { if (!dragRef.current.active) return; const w = midRef.current?.offsetWidth || 320; const d = dragRef.current.startX - e.touches[0].clientX; setScrollX(Math.max(0, Math.min(w*2, dragRef.current.startScroll + d))); };
  const onTouchEnd   = () => { dragRef.current.active = false; };
  useEffect(() => {
    let raf;
    const center = () => { const w = midRef.current?.offsetWidth || 0; if (w) setScrollX(w); else raf = requestAnimationFrame(center); };
    center();
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",animation:"fadeUp .3s ease"}}>
      <div style={{flexShrink:0,display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"rgba(80,40,20,.45)",backdropFilter:"blur(12px)",zIndex:Z_UI.panel}}>
        <button onClick={onExit} style={{background:"rgba(255,255,255,.22)",border:"none",borderRadius:18,padding:"7px 14px",color:"#fff",fontWeight:700,cursor:"pointer",textShadow:TEXT_SH}}>← 나가기</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:17,color:"#fff",textShadow:TEXT_SH}}>🏠 {petNameOf(vpet)}의 집</h2>
        <span style={{marginLeft:"auto",fontSize:11,color:"rgba(255,255,255,.8)",textShadow:TEXT_SH}}>내 펫과 함께 구경</span>
      </div>
      <div ref={midRef} style={{flex:1,position:"relative",overflow:"hidden",minHeight:0}}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <RoomBackground weather={weather} scrollX={scrollX} equippedBg={displayBg}/>
        {displayDecos.map(({ iid, item, state }) => (
          <DecorationOverlay key={iid} item={item} itemState={state} containerRef={midRef} draggable={false} scrollX={scrollX} weather={weather}/>
        ))}
        {/* 집주인 펫 (방문 코드 외형) — 탭·드래그는 로컬 연출, 친구 데이터 불변 */}
        <WanderingPet
          containerRef={midRef} scrollXRef={scrollXRef}
          motion={petMotionOf(egg, vpet)} staticImg={petImgOf(egg, vpet)} staticEmoji={petEmojiOf(vpet)}
          petName={`${petNameOf(vpet)} *`} petColor={petColorOf(vpet)} feedSignal={0} homeBiasX={-70}
        />
        {/* 방문자(내) 펫 — 친구 집에 함께 등장. 돌보기 없음(상태 변화 없음) */}
        {myPet && (
          <WanderingPet
            containerRef={midRef} scrollXRef={scrollXRef}
            motion={petMotionOf(myEgg, myPet)} staticImg={petImgOf(myEgg, myPet)} staticEmoji={petEmojiOf(myPet)}
            petName={petNameOf(myPet)} petColor={petColorOf(myPet)} feedSignal={0} homeBiasX={70}
          />
        )}
      </div>
    </div>
  );
}

// 놀러가기 화면 — 내 집 코드 공유 + 친구 코드로 방문(읽기전용).
function OutingScreen({ egg, pet, inv, weather, onBack }) {
  const [myCode] = useState(() => makeVisitCode(egg, pet, inv));
  const [input, setInput] = useState("");
  const [visit, setVisit] = useState(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  const doCopy = () => { try { navigator.clipboard?.writeText(myCode); setCopied(true); setTimeout(()=>setCopied(false), 1500); } catch {} };
  const doVisit = () => {
    if (input.trim() === myCode.trim()) { setErr("내 집은 놀러갈 수 없어요."); return; }
    const data = parseVisitCode(input);
    if (!data) { setErr("코드를 읽을 수 없어요. 다시 확인해 주세요."); return; }
    setErr(""); setVisit(data);
  };

  if (visit) return <VisitHome data={visit} myEgg={egg} myPet={pet} weather={weather} onExit={()=>setVisit(null)}/>;

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",padding:20,gap:16,animation:"fadeUp .3s ease",overflowY:"auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onBack} style={{background:PANEL_BTN,border:"none",borderRadius:20,padding:"8px 14px",color:INK,fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:INK}}>🎡 놀러가기</h2>
      </div>

      <div style={{background:CARD_BG,border:`1.5px solid ${CARD_BORDER}`,borderRadius:18,padding:"16px"}}>
        <div style={{fontWeight:800,color:INK,marginBottom:8}}>친구 집 방문</div>
        <textarea value={input} onChange={e=>{ setInput(e.target.value); setErr(""); }} placeholder="친구가 준 집 코드를 붙여넣어요"
          style={{width:"100%",boxSizing:"border-box",height:70,resize:"none",borderRadius:12,border:`1.5px solid ${CARD_BORDER}`,padding:"10px",fontSize:12,fontFamily:"monospace",color:INK,background:"rgba(255,255,255,.5)",outline:"none"}}/>
        {err && <div style={{color:"#D9483B",fontSize:12,marginTop:6,fontWeight:700}}>{err}</div>}
        <button onClick={doVisit} disabled={!input.trim()} style={{width:"100%",marginTop:10,background:input.trim()?"linear-gradient(135deg,#26A69A,#4DB6AC)":CARD_BG_DIM,border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:800,color:input.trim()?"#fff":INK_SUB,cursor:input.trim()?"pointer":"not-allowed",fontFamily:"'Jua',sans-serif"}}>방문하기</button>
      </div>

      <div style={{background:CARD_BG,border:`1.5px solid ${CARD_BORDER}`,borderRadius:18,padding:"16px"}}>
        <div style={{fontWeight:800,color:INK,marginBottom:8}}>내 집 코드 (친구에게 공유)</div>
        <textarea readOnly value={myCode} onFocus={e=>e.target.select()}
          style={{width:"100%",boxSizing:"border-box",height:70,resize:"none",borderRadius:12,border:`1.5px solid ${CARD_BORDER}`,padding:"10px",fontSize:12,fontFamily:"monospace",color:INK_SUB,background:"rgba(255,255,255,.4)",outline:"none"}}/>
        <button onClick={doCopy} style={{width:"100%",marginTop:10,background:CARD_BG_DIM,border:`1.5px solid ${CARD_BORDER}`,borderRadius:14,padding:"12px",fontSize:14,fontWeight:800,color:INK,cursor:"pointer",fontFamily:"'Jua',sans-serif"}}>{copied?"✓ 복사됨":"📋 코드 복사"}</button>
        <p style={{color:INK_FAINT,fontSize:11,marginTop:8,lineHeight:1.6}}>이 코드를 친구에게 주면 친구가 내 집을 구경할 수 있어요. 외부 서버 없이 코드로만 동작해요.</p>
      </div>
    </div>
  );
}

// ===================================================
// 소셜 — AR 펫 카메라. 카메라 영상 위에 펫을 올려 이동·핀치 크기·회전, 모션 고정, 캡처(공유/저장).
// 라이브러리 없음: getUserMedia + canvas 합성. 카메라는 HTTPS 또는 localhost에서만 동작.
// ===================================================
const AR_MOTIONS = [
  { key:"stand",    icon:"🧍", label:"기본" },
  { key:"walk",     icon:"🚶", label:"걷기" },
  { key:"angry",    icon:"😠", label:"화남" },
  { key:"sad",      icon:"😢", label:"슬픔" },
  { key:"surprise", icon:"😲", label:"놀람" },
  { key:"eat",      icon:"🍚", label:"먹기" },
];
const AR_PET_BASE = 150;  // 펫 기본 표시 폭(px). scale로 확대·축소.

// ── AR 사진 보관함 (IndexedDB, 로컬·무서버). 캡처 이미지를 blob으로 저장/조회/삭제 ──
const PHOTO_DB = "tama_photos", PHOTO_STORE = "photos";
function photoDB() {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(PHOTO_DB, 1);
    r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(PHOTO_STORE)) r.result.createObjectStore(PHOTO_STORE, { keyPath:"id" }); };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function savePhoto(blob, id) {
  const db = await photoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, "readwrite");
    tx.objectStore(PHOTO_STORE).put({ id, blob });
    tx.oncomplete = () => resolve(id); tx.onerror = () => reject(tx.error);
  });
}
async function loadPhotos() {
  const db = await photoDB();
  return new Promise((resolve, reject) => {
    const rq = db.transaction(PHOTO_STORE, "readonly").objectStore(PHOTO_STORE).getAll();
    rq.onsuccess = () => resolve((rq.result || []).sort((a, b) => b.id - a.id));  // 최신순
    rq.onerror = () => reject(rq.error);
  });
}
async function deletePhoto(id) {
  const db = await photoDB();
  return new Promise((resolve) => {
    const tx = db.transaction(PHOTO_STORE, "readwrite");
    tx.objectStore(PHOTO_STORE).delete(id); tx.oncomplete = () => resolve();
  });
}

function ARSocialScreen({ egg, pet, onBack }) {
  const videoRef = useRef(null), wrapRef = useRef(null), petImgRef = useRef(null);
  const [camState, setCamState] = useState("loading");   // loading | on | denied
  const [motionKey, setMotionKey] = useState("stand");
  const [menuOpen, setMenuOpen] = useState(false);
  const [tf, setTf] = useState({ x:0, y:0, s:1, r:0 });   // 펫 중심 x,y(px) / scale / rotation(deg)
  const tfRef = useRef(tf); useEffect(() => { tfRef.current = tf; }, [tf]);
  const gRef = useRef(null);
  const touchedAt = useRef(0);  // 최근 터치 시각 — 터치 후 합성 mouse 이벤트(ghost) 무시용
  const [arLock, setArLock] = useState(false);     // 자이로 고정 ON/OFF
  const [gyro, setGyro] = useState({ dx:0, dy:0 }); // 기울기 기반 펫 화면 오프셋(px)
  const orientRef = useRef(null), baseRef = useRef(null), smoothRef = useRef({ dx:0, dy:0 });
  const trackRef = useRef(null), streamRef = useRef(null);  // 카메라 트랙(재초점)·스트림(전환 시 정리)
  const [facing, setFacing] = useState("environment");      // 후면(environment) / 전면(user)
  const facingRef = useRef("environment");
  const [zoomRange, setZoomRange] = useState(null);        // 줌 {min,max,step} (지원 기기만)
  const [zoomVal, setZoomVal] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);         // 줌 슬라이더 펼침
  const [photos, setPhotos] = useState([]);                // 보관함 [{id, blob, url}] 최신순
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [viewerId, setViewerId] = useState(null);          // 전체보기 중인 사진 id
  const motion = petMotionOf(egg, pet);
  const motionSrc = motion[motionKey] || motion.stand;
  const fallbackSrc = petImgOf(egg, pet);

  // 카메라 시작 — facingMode(앞/뒤). 고해상도(가능한 한 크게) + 자동초점 best-effort(지원 기기만). 줌 범위 캡처.
  const startCam = async (mode) => {
    facingRef.current = mode;
    streamRef.current?.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode:{ ideal:mode }, width:{ ideal:2560 }, height:{ ideal:1440 } }, audio:false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise(res => { videoRef.current.onloadedmetadata = res; });
        await videoRef.current.play?.().catch(()=>{});
      }
      const track = stream.getVideoTracks?.()[0];
      trackRef.current = track || null;
      const caps = track?.getCapabilities?.() || {};
      const settings = track?.getSettings?.() || {};
      setZoomRange(caps.zoom && caps.zoom.max > caps.zoom.min ? caps.zoom : null);
      if (caps.zoom) setZoomVal(settings.zoom ?? caps.zoom.min);
      try { await track?.applyConstraints({ advanced:[{ focusMode:"continuous" }] }); } catch {}  // 자동초점 지원 기기만
      setCamState("on");
    } catch (e) { console.warn("[AR] 카메라 시작 실패:", e); setCamState("denied"); }
  };
  const setZoom  = (v) => { setZoomVal(v); try { trackRef.current?.applyConstraints({ advanced:[{ zoom:v }] }).catch(()=>{}); } catch {} };
  useEffect(() => { startCam("environment"); return () => { streamRef.current?.getTracks().forEach(t => t.stop()); }; }, []);
  // 보관함 로드(최신순) → blob에 object URL 부여. 언마운트 시 URL 해제.
  useEffect(() => {
    let urls = [];
    loadPhotos().then(list => {
      const withUrl = list.map(p => ({ ...p, url: URL.createObjectURL(p.blob) }));
      urls = withUrl.map(p => p.url);
      setPhotos(withUrl);
    }).catch(()=>{});
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, []);
  // 앞/뒤 카메라 전환
  const flipCam = () => { const next = facingRef.current === "environment" ? "user" : "environment"; setFacing(next); setCamState("loading"); startCam(next); };

  // 펫 초기 위치 = 화면 중앙 하단
  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    setTf({ x: el.clientWidth/2, y: el.clientHeight*0.62, s:1, r:0 });
  }, []);

  // ── 제스처: 1손가락=이동, 2손가락=핀치 크기+회전. 탭(이동 없음)=모션 메뉴 토글 ──
  const touchStart = (e) => {
    e.preventDefault();
    touchedAt.current = Date.now();
    const ts = e.touches;
    if (ts.length === 1) gRef.current = { mode:"move", sx:ts[0].clientX, sy:ts[0].clientY, base:{...tfRef.current}, moved:false };
    else if (ts.length === 2) {
      const [a,b]=ts, dist=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY), ang=Math.atan2(b.clientY-a.clientY,b.clientX-a.clientX)*180/Math.PI;
      gRef.current = { mode:"pinch", dist, ang, base:{...tfRef.current}, moved:true };
    }
  };
  const touchMove = (e) => {
    e.preventDefault();
    const g = gRef.current; if (!g) return;
    const ts = e.touches;
    if (g.mode==="move" && ts.length===1) {
      const dx=ts[0].clientX-g.sx, dy=ts[0].clientY-g.sy;
      if (Math.hypot(dx,dy)>4) g.moved=true;
      setTf({ ...g.base, x:g.base.x+dx, y:g.base.y+dy });
    } else if (g.mode==="pinch" && ts.length===2) {
      const [a,b]=ts, dist=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY), ang=Math.atan2(b.clientY-a.clientY,b.clientX-a.clientX)*180/Math.PI;
      setTf({ ...g.base, s:Math.max(0.3,Math.min(4, g.base.s*(dist/g.dist))), r:g.base.r+(ang-g.ang) });
    }
  };
  const touchEnd = (e) => {
    touchedAt.current = Date.now();
    const g = gRef.current;
    if (g && g.mode==="move" && !g.moved) setMenuOpen(o=>!o);
    if (e.touches.length===0) gRef.current=null;
  };
  // 데스크톱 보조: 마우스 드래그=이동, 휠=크기, Shift+휠=회전. (터치 직후 합성 mouse 이벤트는 무시)
  const isGhost = () => Date.now() - touchedAt.current < 700;
  const mouseDown = (e) => { if(isGhost())return; gRef.current = { mode:"move", sx:e.clientX, sy:e.clientY, base:{...tfRef.current}, moved:false }; };
  const mouseMove = (e) => { const g=gRef.current; if(!g||g.mode!=="move")return; const dx=e.clientX-g.sx,dy=e.clientY-g.sy; if(Math.hypot(dx,dy)>4)g.moved=true; setTf({...g.base,x:g.base.x+dx,y:g.base.y+dy}); };
  const mouseUp = (e) => { if(isGhost())return; const g=gRef.current; if(g&&!g.moved) setMenuOpen(o=>!o); gRef.current=null; };
  const wheel = (e) => { e.preventDefault(); const t=tfRef.current; if(e.shiftKey) setTf({...t,r:t.r+(e.deltaY>0?6:-6)}); else setTf({...t,s:Math.max(0.3,Math.min(4,t.s*(e.deltaY>0?0.94:1.06)))}); };

  // ── 자이로 고정 AR: 폰 기울임에 따라 펫이 공간에 박힌 듯 반대로 이동. iOS는 권한 팝업(사용자 제스처) 필요 ──
  const toggleAR = async () => {
    if (arLock) {  // 끄기
      if (orientRef.current) window.removeEventListener("deviceorientation", orientRef.current);
      orientRef.current = null; baseRef.current = null; smoothRef.current = { dx:0, dy:0 }; setGyro({ dx:0, dy:0 }); setArLock(false);
      return;
    }
    try {
      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === "function") {
        if (await DOE.requestPermission() !== "granted") return;
      }
    } catch { return; }
    // gamma(좌우 기울기)·beta(상하 기울기)만 사용 — alpha(나침반)는 위아래 기울일 때 요동쳐서 축이 섞임(짐벌락).
    smoothRef.current = { dx:0, dy:0 };
    const handler = (e) => {
      const b=e.beta, g=e.gamma;
      if (b==null && g==null) return;
      if (!baseRef.current) { baseRef.current = { b, g }; return; }   // 첫 값=기준
      const base = baseRef.current;
      const K=6;                                          // 클램프 없음 → 많이 기울이면 펫이 화면 밖으로
      const tx = ((g||0)-(base.g||0))*K;                  // 좌우 = gamma
      const ty = ((b||0)-(base.b||0))*K;                  // 상하 = beta
      const p = smoothRef.current;                                       // 저역통과(부드럽게)
      const dx = p.dx + (tx-p.dx)*0.2, dy = p.dy + (ty-p.dy)*0.2;
      smoothRef.current = { dx, dy };
      setGyro({ dx, dy });
    };
    orientRef.current = handler;
    window.addEventListener("deviceorientation", handler);
    setArLock(true);
  };
  useEffect(() => () => { if (orientRef.current) window.removeEventListener("deviceorientation", orientRef.current); }, []);

  // 위치 초기화 — 펫을 화면 중앙·기본 크기/회전으로, 자이로 기준도 현재 시점으로 재설정(못 찾을 때 복구)
  const resetPet = () => {
    const el = wrapRef.current;
    if (el) setTf({ x: el.clientWidth/2, y: el.clientHeight*0.62, s:1, r:0 });
    baseRef.current = null; smoothRef.current = { dx:0, dy:0 }; setGyro({ dx:0, dy:0 });
  };

  // ── 캡처: 카메라 프레임 + 펫(이동·크기·회전 반영) 합성 → 공유 또는 저장 ──
  const capture = () => {
    const video=videoRef.current, wrap=wrapRef.current, img=petImgRef.current;
    if (!wrap) return;
    const W=wrap.clientWidth, H=wrap.clientHeight, dpr=window.devicePixelRatio||1;
    const cv=document.createElement("canvas"); cv.width=W*dpr; cv.height=H*dpr;
    const ctx=cv.getContext("2d"); ctx.scale(dpr,dpr);
    if (camState==="on" && video?.videoWidth) {  // 카메라 cover
      const vw=video.videoWidth, vh=video.videoHeight, sc=Math.max(W/vw,H/vh), dw=vw*sc, dh=vh*sc;
      ctx.drawImage(video,(W-dw)/2,(H-dh)/2,dw,dh);
    } else { ctx.fillStyle="#cfd8dc"; ctx.fillRect(0,0,W,H); }
    if (img && img.complete && img.naturalWidth) {
      const t=tfRef.current, ar=img.naturalWidth/img.naturalHeight, w=AR_PET_BASE, h=AR_PET_BASE/ar;
      ctx.save(); ctx.translate(t.x+gyro.dx, t.y+gyro.dy); ctx.rotate(t.r*Math.PI/180); ctx.scale(t.s,t.s);
      ctx.filter="drop-shadow(0 8px 18px rgba(0,0,0,.4))";
      ctx.drawImage(img,-w/2,-h/2,w,h); ctx.filter="none"; ctx.restore();
    }
    cv.toBlob(async (blob) => {
      if (!blob) return;
      const id = Date.now();
      try { await savePhoto(blob, id); } catch {}
      setPhotos(prev => [{ id, blob, url: URL.createObjectURL(blob) }, ...prev]);  // 보관함에 적재(즉시 저장 안 함)
    }, "image/png");
  };

  // 사진 저장(다운로드) / 공유 / 삭제 — 전체보기에서 사용
  const savePhotoFile = (p) => { const a=document.createElement("a"); a.href=p.url; a.download=`pet-ar-${p.id}.png`; a.click(); };
  const sharePhoto = async (p) => {
    try { const file=new File([p.blob], `pet-ar-${p.id}.png`, { type:"image/png" });
      if (navigator.canShare?.({ files:[file] })) { await navigator.share({ files:[file], title:"내 펫 AR" }); return; } } catch {}
    savePhotoFile(p);  // 공유 미지원/취소 시 저장으로 폴백
  };
  const removePhoto = async (p) => {
    try { await deletePhoto(p.id); } catch {}
    URL.revokeObjectURL(p.url);
    setPhotos(prev => prev.filter(x => x.id !== p.id));
    setViewerId(null);
  };
  const viewer = photos.find(p => p.id === viewerId) || null;

  return (
    <div ref={wrapRef} style={{position:"absolute",inset:0,overflow:"hidden",background:"#222",userSelect:"none",touchAction:"none"}}
      onMouseMove={mouseMove} onMouseUp={mouseUp}>
      <video ref={videoRef} playsInline muted autoPlay onClick={()=>setZoomOpen(false)} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",display:camState==="on"?"block":"none"}}/>
      {camState!=="on" && (
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,background:"linear-gradient(180deg,#90A4AE,#CFD8DC)",textAlign:"center",padding:24}}>
          <div style={{fontSize:48}}>📷</div>
          <p style={{color:"#37474F",fontSize:14,fontWeight:800,lineHeight:1.6}}>
            {camState==="loading" ? "카메라를 켜는 중…" : "카메라를 사용할 수 없어요.\n권한을 허용했는지, HTTPS(또는 localhost)인지 확인해 주세요."}
          </p>
          <p style={{color:"#546E7A",fontSize:12}}>카메라 없이도 펫 배치·캡처는 가능해요(단색 배경).</p>
        </div>
      )}

      {/* 펫 — 이동·크기·회전 (+ 자이로 오프셋) */}
      <div style={{position:"absolute",left:tf.x+gyro.dx,top:tf.y+gyro.dy,transform:`translate(-50%,-50%) rotate(${tf.r}deg) scale(${tf.s})`,transformOrigin:"center",cursor:"grab",touchAction:"none"}}
        onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd} onMouseDown={mouseDown} onWheel={wheel}>
        <img ref={petImgRef} src={motionSrc} alt="" draggable={false}
          onError={e => { if (e.currentTarget.src !== location.origin+fallbackSrc) e.currentTarget.src = fallbackSrc; }}
          style={{width:AR_PET_BASE,height:"auto",display:"block",pointerEvents:"none",filter:"drop-shadow(0 8px 18px rgba(0,0,0,.4))"}}/>
      </div>

      {/* 모션 라디얼 메뉴 — 펫 중심 기준 원형 배치(펫 변형과 무관하게 고정 크기) */}
      {menuOpen && (
        <div style={{position:"absolute",left:tf.x+gyro.dx,top:tf.y+gyro.dy,width:0,height:0,zIndex:Z_UI.panel}}>
          {AR_MOTIONS.map((m,i) => {
            const a=(i/AR_MOTIONS.length)*Math.PI*2 - Math.PI/2, R=88;
            return (
              <button key={m.key} onClick={()=>{ setMotionKey(m.key); setMenuOpen(false); }}
                style={{position:"absolute",left:Math.cos(a)*R,top:Math.sin(a)*R,transform:"translate(-50%,-50%)",
                  width:48,height:48,borderRadius:"50%",border:motionKey===m.key?"2px solid #FFD200":"2px solid rgba(255,255,255,.7)",
                  background:motionKey===m.key?"rgba(247,151,30,.92)":"rgba(0,0,0,.55)",backdropFilter:"blur(4px)",
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,cursor:"pointer",color:"#fff"}}>
                <span style={{fontSize:18,lineHeight:1}}>{m.icon}</span>
                <span style={{fontSize:8,fontWeight:800}}>{m.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 상단 바 */}
      <div style={{position:"absolute",top:0,left:0,right:0,display:"flex",alignItems:"center",gap:8,padding:"12px 14px",zIndex:Z_UI.decorCtrl}}>
        <button onClick={onBack} style={{background:"rgba(0,0,0,.45)",border:"none",borderRadius:18,padding:"7px 12px",color:"#fff",fontWeight:700,cursor:"pointer"}}>←</button>
        <span style={{fontFamily:"'Jua',sans-serif",fontSize:15,color:"#fff",textShadow:"0 1px 4px rgba(0,0,0,.6)"}}>AR 카메라</span>
        <button onClick={flipCam} title="앞/뒤 카메라 전환" style={{marginLeft:"auto",background:"rgba(0,0,0,.45)",border:"1.5px solid rgba(255,255,255,.4)",borderRadius:18,padding:"7px 11px",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>🪞</button>
        <button onClick={resetPet} title="위치 초기화" style={{background:"rgba(0,0,0,.45)",border:"1.5px solid rgba(255,255,255,.4)",borderRadius:18,padding:"7px 11px",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>↺</button>
        <button onClick={toggleAR} title="자이로 AR 고정" style={{background:arLock?"rgba(247,151,30,.92)":"rgba(0,0,0,.45)",border:arLock?"1.5px solid #FFD200":"1.5px solid rgba(255,255,255,.4)",borderRadius:18,padding:"7px 11px",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>🧭</button>
      </div>
      {/* 조작 힌트 */}
      <div style={{position:"absolute",top:52,right:14,fontSize:10,color:"rgba(255,255,255,.85)",textShadow:"0 1px 4px rgba(0,0,0,.6)",textAlign:"right",lineHeight:1.4,zIndex:Z_UI.decorCtrl,pointerEvents:"none"}}>🪞앞뒤 · 🧭AR고정<br/>펫: 탭=모션 · 드래그=이동 · 두손가락=크기·회전</div>

      {/* 줌 슬라이더 — 🔍 버튼으로 펼침, 배경 탭하면 닫힘 */}
      {zoomOpen && zoomRange && (
        <div style={{position:"absolute",bottom:104,left:16,right:16,zIndex:Z_UI.decorCtrl}}>
          <label style={{display:"flex",alignItems:"center",gap:10,background:"rgba(0,0,0,.6)",backdropFilter:"blur(6px)",borderRadius:16,padding:"10px 16px",animation:"fadeUp .2s ease"}}>
            <span style={{fontSize:16}}>🔍</span>
            <input type="range" min={zoomRange.min} max={zoomRange.max} step={zoomRange.step||0.1} value={zoomVal}
              onChange={e=>setZoom(Number(e.target.value))} style={{flex:1,accentColor:"#FFD200"}}/>
            <span style={{fontSize:11,color:"#fff",fontWeight:700,width:38,textAlign:"right"}}>{Number(zoomVal).toFixed(1)}×</span>
          </label>
        </div>
      )}

      {/* 하단 캡처 버튼 (+ 왼쪽 줌 토글) */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,display:"flex",alignItems:"center",justifyContent:"center",padding:"18px",paddingBottom:"calc(18px + env(safe-area-inset-bottom,0px))",zIndex:Z_UI.decorCtrl}}>
        {zoomRange && (
          <button onClick={()=>setZoomOpen(o=>!o)} title="줌" style={{position:"absolute",left:32,bottom:26,width:48,height:48,borderRadius:"50%",border:zoomOpen?"2px solid #FFD200":"2px solid rgba(255,255,255,.6)",background:zoomOpen?"rgba(247,151,30,.92)":"rgba(0,0,0,.45)",color:"#fff",fontSize:20,cursor:"pointer"}}>🔍</button>
        )}
        <button onClick={capture} style={{width:68,height:68,borderRadius:"50%",border:"4px solid rgba(255,255,255,.85)",background:"rgba(255,255,255,.25)",backdropFilter:"blur(4px)",fontSize:26,cursor:"pointer"}}>📸</button>
        {/* 보관함 썸네일(최신 사진) — 촬영 버튼 오른쪽 */}
        {photos.length > 0 && (
          <button onClick={()=>setGalleryOpen(true)} title="보관함" style={{position:"absolute",right:30,bottom:20,width:56,height:56,borderRadius:14,border:"2px solid rgba(255,255,255,.85)",overflow:"hidden",padding:0,cursor:"pointer",background:"#000",boxShadow:"0 2px 10px rgba(0,0,0,.45)"}}>
            <img src={photos[0].url} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
          </button>
        )}
      </div>

      {/* 보관함 그리드 */}
      {galleryOpen && (
        <div style={{position:"absolute",inset:0,zIndex:10001,background:"rgba(10,8,20,.97)",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",flexShrink:0}}>
            <button onClick={()=>setGalleryOpen(false)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:16,padding:"7px 14px",color:"#fff",fontWeight:700,cursor:"pointer"}}>← 닫기</button>
            <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:18,color:"#fff"}}>📸 보관함</h2>
            <span style={{marginLeft:"auto",fontSize:12,color:"rgba(255,255,255,.6)"}}>{photos.length}장</span>
          </div>
          {photos.length===0
            ? <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.5)",fontSize:14}}>아직 찍은 사진이 없어요</div>
            : <div style={{flex:1,overflowY:"auto",padding:"0 12px 16px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,alignContent:"start"}}>
                {photos.map(p=>(
                  <button key={p.id} onClick={()=>setViewerId(p.id)} style={{aspectRatio:"1",border:"none",padding:0,borderRadius:10,overflow:"hidden",cursor:"pointer",background:"#000"}}>
                    <img src={p.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  </button>
                ))}
              </div>
          }
        </div>
      )}

      {/* 전체보기 — 저장·공유·삭제 */}
      {viewer && (
        <div style={{position:"absolute",inset:0,zIndex:10002,background:"rgba(0,0,0,.95)",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",justifyContent:"flex-end",padding:"12px 16px",flexShrink:0}}>
            <button onClick={()=>setViewerId(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:16,padding:"7px 13px",color:"#fff",fontWeight:700,cursor:"pointer"}}>✕</button>
          </div>
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 12px",minHeight:0}}>
            <img src={viewer.url} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",borderRadius:10}}/>
          </div>
          <div style={{display:"flex",gap:10,padding:"16px",justifyContent:"center",flexShrink:0}}>
            <button onClick={()=>savePhotoFile(viewer)} style={{background:"rgba(255,255,255,.16)",border:"1.5px solid rgba(255,255,255,.4)",borderRadius:14,padding:"11px 18px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer"}}>💾 저장</button>
            <button onClick={()=>sharePhoto(viewer)} style={{background:"linear-gradient(135deg,#26A69A,#4DB6AC)",border:"none",borderRadius:14,padding:"11px 18px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer"}}>📤 공유</button>
            <button onClick={()=>removePhoto(viewer)} style={{background:"rgba(217,72,59,.85)",border:"none",borderRadius:14,padding:"11px 18px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer"}}>🗑️ 삭제</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================================================
// 팝업: 내 펫 상태 (? 버블 포함)
// ===================================================
function StatusPopup({ pet, growthMax, canEvolve, onEvolve, onNewPet, onClose, petName, petMotion, petEmoji }) {
  const [tipStatus, setTipStatus] = useState(false);
  const [tipTrait,  setTipTrait]  = useState(false);
  const maxTrait = Math.max(...Object.values(pet.traits));

  // 펫 이미지 클릭 반응 — 메인과 동일: 단일 탭=랜덤 대사, 연타(tapsForEmotion회)=감정(대사+모션)
  // 모션 키→src는 메인 렌더 레이어와 동일하게 petMotion[key] || stand. 감정 webp 들어오면 자동 재생.
  const resolveMotion = key => petMotion?.[key] || petMotion?.stand;
  const [bubble, setBubble] = useState(null);
  const [motionSrc, setMotionSrc] = useState(petMotion?.stand);
  const [pop, setPop] = useState(false);
  const tapRef = useRef({ last:0, count:0 });
  const emoting = useRef(false);  // 감정 재생 중 플래그
  const bubbleTimer = useRef(null), popTimer = useRef(null), motionTimer = useRef(null);
  useEffect(() => () => { clearTimeout(bubbleTimer.current); clearTimeout(popTimer.current); clearTimeout(motionTimer.current); }, []);
  const handlePetReact = () => {
    if (emoting.current) return;  // 감정 재생 중엔 탭 무시(다른 말풍선 안 뜨게)
    const t = Date.now(), r = tapRef.current;
    r.count = (t - r.last < PET_MOTION_CFG.tapWindow) ? r.count + 1 : 1; r.last = t;
    let bubbleDur = PET_MOTION_CFG.bubbleMs;
    if (r.count >= PET_MOTION_CFG.tapsForEmotion) {
      r.count = 0; emoting.current = true;
      const e = PET_EMOTIONS[Math.floor(Math.random()*PET_EMOTIONS.length)];
      setBubble(e.line);
      // 감정 webp 사전 로드 → 있으면 재생, 없으면(로드 실패) stand로 폴백(이모지 안 뜨게)
      const src = resolveMotion(e.motion);
      const probe = new Image();
      probe.onload  = () => setMotionSrc(src);
      probe.onerror = () => setMotionSrc(petMotion?.stand);
      probe.src = src;
      bubbleDur = PET_MOTION_CFG.oneShotMs;    // 말풍선을 감정 모션 길이만큼 유지
      clearTimeout(motionTimer.current); motionTimer.current = setTimeout(() => { setMotionSrc(petMotion?.stand); emoting.current = false; }, PET_MOTION_CFG.oneShotMs);
    } else {
      setBubble(PET_LINES[Math.floor(Math.random()*PET_LINES.length)]);
    }
    clearTimeout(bubbleTimer.current); bubbleTimer.current = setTimeout(() => setBubble(null), bubbleDur);
    setPop(true); clearTimeout(popTimer.current); popTimer.current = setTimeout(() => setPop(false), 240);
  };

  return (
    <Overlay>
      <div style={{background:"rgba(16,14,36,.96)",backdropFilter:"blur(22px)",borderRadius:28,padding:"22px 20px",width:"92%",maxWidth:360,border:"1.5px solid rgba(255,255,255,.15)",animation:"slideUp .35s ease",maxHeight:"88vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{fontFamily:"'Jua',sans-serif",fontSize:19,color:"#fff"}}>💖 내 펫 상태</h3>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:14,padding:"5px 11px",color:"#fff",cursor:"pointer",fontWeight:700}}>✕</button>
        </div>

        {/* 펫 stand 모습 + 닉네임 — 클릭 시 메인처럼 랜덤 반응 */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:16}}>
          <div onClick={handlePetReact} style={{position:"relative",cursor:"pointer",transform:pop?"scale(1.08)":"scale(1)",transition:"transform .18s ease",WebkitTapHighlightColor:"transparent"}}>
            {bubble && (
              // 바깥: translateX(-50%) 정적 중앙 정렬 / 안쪽: tooltipIn 애니(transform 분리 → 우측 드리프트 방지)
              <div style={{position:"absolute",left:"50%",bottom:"104%",transform:"translateX(-50%)",zIndex:5,pointerEvents:"none"}}>
                <div style={{background:"#fff",border:"2px solid #333",borderRadius:12,padding:"5px 10px",fontSize:12,fontWeight:800,color:"#222",whiteSpace:"nowrap",fontFamily:"'Jua',sans-serif",animation:"tooltipIn .2s ease"}}>{bubble}</div>
              </div>
            )}
            <PetSprite size={104} imgSrc={motionSrc} emoji={petEmoji}/>
          </div>
          <div style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:"#fff",marginTop:6,textShadow:"0 2px 10px rgba(0,0,0,.4)"}}>{petName}</div>
        </div>

        {/* 기본 수치 */}
        <div style={{background:"rgba(255,255,255,.07)",borderRadius:16,padding:"12px 14px",marginBottom:12}}>
          {[["현재 단계",pet.stage===3&&pet.finalForm?`3단계 · ${FINAL_FORMS[pet.finalForm]?.name||"3단계"}`:`${pet.stage}단계`],["성장도",`${pet.growthPoint} / ${growthMax}`],["다음 진화까지",pet.stage===3?"최종 진화 완료":`${Math.max(0,growthMax-pet.growthPoint)} 남음`]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"rgba(255,255,255,.7)",marginBottom:6}}>
              <span>{l}</span><span style={{color:"#fff",fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>

        {/* 펫 상태 - ? 버튼 */}
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>— 펫 상태 —</span>
            <div style={{position:"relative"}}>
              <button onClick={()=>setTipStatus(v=>!v)} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:"50%",width:18,height:18,fontSize:10,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>?</button>
              {tipStatus&&(
                <div style={{position:"absolute",right:0,top:"120%",background:"rgba(20,20,50,.97)",border:"1px solid rgba(255,255,255,.2)",borderRadius:12,padding:"10px 12px",width:190,zIndex:200,animation:"tooltipIn .2s ease",fontSize:11,color:"rgba(255,255,255,.8)",lineHeight:1.6}}>
                  배고픔·기분·청결은 시간이 지나면 감소해요. 밥주기·놀아주기·씻기기로 채울 수 있어요. 게임 성장에는 직접 영향을 주지 않아요.
                  <button onClick={()=>setTipStatus(false)} style={{position:"absolute",top:4,right:6,background:"none",border:"none",color:"rgba(255,255,255,.4)",cursor:"pointer",fontSize:11}}>✕</button>
                </div>
              )}
            </div>
          </div>
          {[["🍚","배고픔","hunger","#FF7043"],["😊","기분","mood","#42A5F5"],["🛁","청결","cleanness","#66BB6A"]].map(([e,l,k,c])=>(
            <div key={k} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,.7)",marginBottom:3}}><span>{e} {l}</span><span>{pet.status[k]}%</span></div>
              <div style={{background:"rgba(255,255,255,.1)",borderRadius:6,height:7,overflow:"hidden"}}>
                <div style={{width:`${pet.status[k]}%`,height:"100%",background:pet.status[k]>60?c:pet.status[k]>30?"#FF9800":"#F44336",borderRadius:6,transition:"width .5s"}}/>
              </div>
            </div>
          ))}
        </div>

        {/* 진화 성향 게이지 - ? 버튼 */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>— 진화 성향 게이지 —</span>
            <div style={{position:"relative"}}>
              <button onClick={()=>setTipTrait(v=>!v)} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:"50%",width:18,height:18,fontSize:10,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>?</button>
              {tipTrait&&(
                <div style={{position:"absolute",right:0,top:"120%",background:"rgba(20,20,50,.97)",border:"1px solid rgba(255,255,255,.2)",borderRadius:12,padding:"10px 12px",width:200,zIndex:200,animation:"tooltipIn .2s ease",fontSize:11,color:"rgba(255,255,255,.8)",lineHeight:1.6}}>
                  선물을 줄수록 해당 성향이 올라가요. 3단계 진화 시 가장 높은 성향(★)이 최종 캐릭터를 결정해요. 키우고 싶은 형태의 성향을 집중해서 올려보세요!
                  <button onClick={()=>setTipTrait(false)} style={{position:"absolute",top:4,right:6,background:"none",border:"none",color:"rgba(255,255,255,.4)",cursor:"pointer",fontSize:11}}>✕</button>
                </div>
              )}
            </div>
          </div>
          {Object.entries(TRAITS).map(([key,t])=>{
            const val = pet.traits[key];
            const isTop = val===maxTrait&&maxTrait>0;
            const form = FINAL_FORMS[key];
            return (
              <div key={key} style={{marginBottom:9}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                  <span style={{color:isTop?t.color:"rgba(255,255,255,.7)"}}>{t.emoji} {t.label}{isTop?" ★":""}</span>
                  <span style={{color:"rgba(255,255,255,.6)"}}>{val}</span>
                </div>
                <div style={{background:"rgba(255,255,255,.1)",borderRadius:6,height:6,overflow:"hidden"}}>
                  <div style={{width:`${Math.min(100,val*8)}%`,height:"100%",background:t.color,borderRadius:6,transition:"width .5s",opacity:isTop?1:.6}}/>
                </div>
                {pet.stage===2&&(
                  <div style={{fontSize:9,color:isTop?t.color:"rgba(255,255,255,.35)",marginTop:2}}>
                    → {form.emoji} {form.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 진화 가능 버튼 */}
        {canEvolve && (
          <button onClick={onEvolve} style={{width:"100%",marginTop:16,background:"linear-gradient(135deg,#7B2FBE,#E040FB)",border:"none",borderRadius:14,padding:"13px",fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"'Jua',sans-serif",letterSpacing:0.5,boxShadow:"0 4px 20px rgba(224,64,251,.4)"}}>
            ✨ 진화 가능! 진화하기
          </button>
        )}
        {!canEvolve && pet.stage===3 && pet.finalForm && (
          <button onClick={onNewPet} style={{width:"100%",marginTop:16,background:"linear-gradient(135deg,#43a047,#66bb6a)",border:"none",borderRadius:14,padding:"13px",fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"'Jua',sans-serif",letterSpacing:0.5,boxShadow:"0 4px 20px rgba(67,160,71,.4)"}}>
            🥚 다른 펫 키우기
            <div style={{fontSize:11,fontWeight:700,opacity:.85,marginTop:2}}>기존 펫은 도감에 등록돼요</div>
          </button>
        )}
      </div>
    </Overlay>
  );
}

// ===================================================
// 팝업: 이벤트
// ===================================================
function EventPopup({ event, claimed, onClaim, onClose }) {
  return (
    <Overlay>
      <div style={{background:"rgba(16,14,36,.96)",backdropFilter:"blur(20px)",borderRadius:28,padding:"30px 24px",width:"86%",maxWidth:340,textAlign:"center",border:"1.5px solid rgba(255,255,255,.15)",animation:"pop .4s ease"}}>
        <div style={{fontSize:60,marginBottom:10}}>{event.emoji}</div>
        <h3 style={{fontFamily:"'Jua',sans-serif",fontSize:19,color:"#fff",marginBottom:6}}>{event.name}</h3>
        <p style={{color:"rgba(255,255,255,.55)",fontSize:13,marginBottom:16}}>{event.desc}</p>
        <div style={{background:"rgba(255,255,255,.1)",borderRadius:12,padding:"8px 14px",fontSize:13,fontWeight:800,color:"#FFD700",marginBottom:18}}>{event.effect}</div>
        {!claimed
          ? <button onClick={onClaim} style={{width:"100%",background:"linear-gradient(135deg,#F7971E,#FFD200)",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"'Jua',sans-serif",marginBottom:8}}>보상 받기</button>
          : <div style={{color:"#4ECB71",fontWeight:700,marginBottom:8}}>✓ 보상 수령 완료</div>
        }
        <button onClick={onClose} style={{background:"transparent",border:"none",color:"rgba(255,255,255,.35)",cursor:"pointer",fontSize:13}}>닫기</button>
      </div>
    </Overlay>
  );
}

// ===================================================
// 팝업: 무지개
// ===================================================
function RainbowPopup({ onChoose, onClose }) {
  return (
    <Overlay>
      <div style={{background:"rgba(16,14,36,.96)",backdropFilter:"blur(20px)",borderRadius:28,padding:"22px 20px",width:"90%",maxWidth:360,border:"1.5px solid rgba(255,255,255,.15)",animation:"slideUp .35s ease"}}>
        <h3 style={{fontFamily:"'Jua',sans-serif",fontSize:19,color:"#fff",textAlign:"center",marginBottom:5}}>🌈 무지개가 뜨는 날</h3>
        <p style={{color:"rgba(255,255,255,.55)",fontSize:12,textAlign:"center",marginBottom:16}}>키우고 싶은 성향을 선택하세요 (+1)</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          {Object.entries(TRAITS).map(([key,t])=>(
            <button key={key} onClick={()=>onChoose(key)} style={{background:`${t.color}22`,border:`2px solid ${t.color}66`,borderRadius:14,padding:"12px 6px",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:3}}>{t.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{t.label}</div>
            </button>
          ))}
        </div>
      </div>
    </Overlay>
  );
}

// ===================================================
// 팝업: 진화
// ===================================================
// 진화 축하 색종이 파티클 — 중앙에서 가장자리로 팡 터지며 회전·페이드. 마운트 시 1회 재생.
const CONFETTI_COLORS = ["#FF5252","#FFD740","#40C4FF","#69F0AE","#E040FB","#FF6E40","#FFFFFF","#FFAB40"];
function EvoConfetti({ count = 100 }) {
  const [pieces] = useState(() => {
    const W = Math.min(window.innerWidth, 420), H = Math.min(window.innerHeight, 910);
    const reach = Math.hypot(W, H) / 2;  // shell 대각 절반 ≈ 가장자리(넘치면 overflow로 잘림)
    return Array.from({ length: count }, (_, i) => {
      const a = Math.random() * Math.PI * 2, d = reach * (0.5 + Math.random() * 0.7);
      const round = Math.random() < 0.3, w = 6 + Math.random() * 7;
      return {
        tx: Math.cos(a) * d, ty: Math.sin(a) * d, rot: Math.random() * 720 - 360,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        w, h: round ? w : 10 + Math.random() * 10, round,
        delay: Math.random() * 0.1, dur: 0.9 + Math.random() * 0.7,
      };
    });
  });
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:10002}}>
      {pieces.map((p, i) => (
        <span key={i} style={{
          position:"absolute", left:"50%", top:"46%", width:p.w, height:p.h,
          background:p.color, borderRadius:p.round?"50%":2,
          "--tx":`${p.tx}px`, "--ty":`${p.ty}px`, "--rot":`${p.rot}deg`,
          animation:`confettiBurst ${p.dur}s cubic-bezier(.12,.6,.35,1) ${p.delay}s both`,
        }}/>
      ))}
    </div>
  );
}

function EvoPopup({ data, egg, onConfirm }) {
  const is3 = data.stage===3;
  const form = is3&&data.finalForm ? FINAL_FORMS[data.finalForm] : null;
  return (
    <Overlay style={{zIndex:10000}}>
      <EvoConfetti count={is3?130:90}/>
      <div style={{background:is3?"rgba(8,6,20,.98)":"rgba(16,14,36,.96)",backdropFilter:"blur(20px)",borderRadius:32,padding:"38px 26px",width:"88%",maxWidth:360,textAlign:"center",border:`2px solid ${is3?"#FFD700":"rgba(255,255,255,.2)"}`,animation:is3?"glow 2s ease infinite, pop .5s ease":"pop .4s ease"}}>
        <div style={{fontSize:15,color:is3?"#FFD700":"rgba(255,255,255,.55)",marginBottom:6,fontWeight:700}}>{is3?"✨ 최종 진화!":"🎉 진화!"}</div>
        <div style={{marginBottom:14,animation:"float 2s ease-in-out infinite",display:"flex",justifyContent:"center"}}>
          <PetSprite size={84} emoji={form?form.emoji:"🐣"} imgSrc={form?`/images/pets/stage3/${data.finalForm}/static.png`:`/images/pets/${egg||"egg_red"}/stage2/static.png`}/>
        </div>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:23,color:"#fff",marginBottom:5}}>{form?form.name:"성장체"}</h2>
        <p style={{color:"rgba(255,255,255,.55)",fontSize:13,marginBottom:is3?14:22}}>{is3?"드디어 최종 진화했어요!":"한 단계 더 성장했어요!"}</p>
        {is3&&form&&(
          <div style={{background:"rgba(255,215,0,.12)",border:"1.5px solid rgba(255,215,0,.4)",borderRadius:14,padding:"10px",marginBottom:18}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:3}}>고유 스킬 해금 (향후 업데이트)</div>
            <div style={{fontSize:15,fontWeight:700,color:"#FFD700"}}>{form.skillEmoji} {form.skill}</div>
          </div>
        )}
        <button onClick={onConfirm} style={{width:"100%",background:is3?"linear-gradient(135deg,#FFD700,#FF8C00)":"linear-gradient(135deg,#4CAF50,#8BC34A)",border:"none",borderRadius:16,padding:"13px",fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"'Jua',sans-serif"}}>확인!</button>
      </div>
    </Overlay>
  );
}

// ===================================================
// 팝업: 다른 펫 키우기 확인 (최종 진화 완료 펫 → 새 펫 시작)
// ===================================================
function NewPetConfirmPopup({ petName, onConfirm, onCancel }) {
  return (
    <Overlay style={{zIndex:10000}}>
      <div style={{background:"rgba(16,14,36,.97)",backdropFilter:"blur(20px)",borderRadius:28,padding:"30px 24px",width:"86%",maxWidth:340,textAlign:"center",border:"1.5px solid rgba(255,255,255,.15)",animation:"pop .35s ease"}}>
        <div style={{fontSize:48,marginBottom:10}}>🥚</div>
        <h3 style={{fontFamily:"'Jua',sans-serif",fontSize:19,color:"#fff",marginBottom:8}}>다른 펫 키우기</h3>
        <p style={{color:"rgba(255,255,255,.6)",fontSize:13,marginBottom:6,lineHeight:1.5}}><b style={{color:"#fff"}}>{petName}</b>은(는) 도감에 등록돼 있어요.<br/>새 펫을 처음부터 키울까요?</p>
        <p style={{color:"rgba(255,255,255,.4)",fontSize:11,marginBottom:18}}>재화·티켓·선물·도감·방 꾸미기는 그대로 유지돼요.</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={{flex:1,background:"rgba(255,255,255,.12)",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"'Jua',sans-serif"}}>취소</button>
          <button onClick={onConfirm} style={{flex:1.4,background:"linear-gradient(135deg,#43a047,#66bb6a)",border:"none",borderRadius:14,padding:"12px",fontSize:14,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"'Jua',sans-serif",boxShadow:"0 4px 20px rgba(67,160,71,.4)"}}>새 펫 키우기</button>
        </div>
      </div>
    </Overlay>
  );
}

// ===================================================
// Dev Mode Panel — import.meta.env.DEV 환경에서만 렌더됨
// ===================================================
function DevBtn({ onClick, color="#546E7A", children, small }) {
  return (
    <button onClick={onClick} style={{background:color+"28",border:`1px solid ${color}77`,borderRadius:7,padding:small?"3px 8px":"5px 10px",color:"#fff",fontSize:small?10:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Nunito',sans-serif"}}>
      {children}
    </button>
  );
}
function DevSection({ title, children }) {
  return (
    <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
      <div style={{fontSize:9,fontWeight:900,color:"rgba(255,87,34,.7)",marginBottom:7,letterSpacing:1}}>{title}</div>
      {children}
    </div>
  );
}
function DevPanel({ pet, daily, devMode, devWeather, onToggleDevMode, onClose, onSetGrowth, onSetTrait, onForceForm, onForceEvo, onResetPet, onResetDay, onFillMissions, onClaimAll, onRollEvent, onSetWeather, onResetAll }) {
  const [growthInput, setGrowthInput] = useState(String(pet.growthPoint));
  return (
    <div style={{position:"absolute",inset:0,zIndex:8000,background:"rgba(0,0,0,.88)",backdropFilter:"blur(6px)",display:"flex",flexDirection:"column",overflowY:"auto",padding:"12px 14px"}}>
      {/* 헤더 */}
      <div style={{display:"flex",alignItems:"center",marginBottom:10,flexShrink:0}}>
        <span style={{fontSize:14,fontWeight:900,color:"#FF5722",fontFamily:"'Nunito',sans-serif",letterSpacing:0.5}}>🔧 Dev Mode Panel</span>
        <div onClick={onToggleDevMode} title="Dev 제한 무시 ON/OFF" style={{marginLeft:10,width:36,height:20,borderRadius:10,background:devMode?"#FF5722":"rgba(255,255,255,.15)",position:"relative",cursor:"pointer",transition:"background .2s",flexShrink:0}}>
          <div style={{position:"absolute",top:3,left:devMode?17:3,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
        </div>
        <span style={{fontSize:10,color:devMode?"#FF5722":"rgba(255,255,255,.35)",marginLeft:6}}>{devMode?"제한 무시 ON":"제한 무시 OFF"}</span>
        <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:18,cursor:"pointer",lineHeight:1}}>✕</button>
      </div>

      {/* 일일 초기화 */}
      <DevSection title="일일 상태 조작">
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          <DevBtn onClick={onResetDay}       color="#4FC3F7">🔄 하루 초기화</DevBtn>
          <DevBtn onClick={onFillMissions}   color="#66BB6A">✅ 미션 모두 완료</DevBtn>
          <DevBtn onClick={onClaimAll}       color="#FFB74D">💰 보상 모두 수령</DevBtn>
        </div>
      </DevSection>

      <DevSection title="날씨 강제 설정">
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
          {Object.entries(WEATHER_META).map(([key,w])=>(
            <DevBtn key={key} small onClick={()=>onSetWeather(key)} color={devWeather===key?"#FF5722":"#546E7A"}>
              {w.emoji} {w.label}
            </DevBtn>
          ))}
          <DevBtn small onClick={()=>onSetWeather(null)} color="#37474F">↺ 실제 날씨</DevBtn>
        </div>
        <div style={{fontSize:9,color:"rgba(255,255,255,.3)"}}>현재: {devWeather?`강제 ${WEATHER_META[devWeather]?.label}`:"실제 날씨 (날짜 기반)"}</div>
      </DevSection>

      <DevSection title="이벤트 재롤">
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:4}}>
          <DevBtn onClick={onRollEvent} color="#9C27B0">🎲 이벤트 재롤 (30%)</DevBtn>
        </div>
        <div style={{fontSize:9,color:"rgba(255,255,255,.3)"}}>현재: {daily.event?daily.event.name:"없음"}</div>
      </DevSection>

      <DevSection title="전체 데이터 초기화">
        <button onClick={onResetAll} style={{width:"100%",background:"rgba(244,67,54,.18)",border:"1.5px solid rgba(244,67,54,.6)",borderRadius:8,padding:"8px",color:"#FF5252",fontSize:12,fontWeight:900,cursor:"pointer",fontFamily:"'Nunito',sans-serif",letterSpacing:0.5}}>
          ⚠️ 전체 초기화 (알 선택 화면으로)
        </button>
        <div style={{fontSize:9,color:"rgba(255,255,255,.3)",marginTop:4}}>localStorage 삭제 + 모든 상태 리셋</div>
      </DevSection>

      {/* 성장도 */}
      <DevSection title="성장도 설정">
        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:5}}>
          <input type="number" value={growthInput} onChange={e=>setGrowthInput(e.target.value)}
            style={{flex:1,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:8,padding:"5px 8px",color:"#fff",fontSize:12,fontFamily:"'Nunito',sans-serif"}}/>
          <DevBtn onClick={()=>onSetGrowth(growthInput)} color="#42A5F5">적용</DevBtn>
        </div>
        <div style={{display:"flex",gap:4}}>
          {[0,40,100].map(v=>(
            <DevBtn key={v} small onClick={()=>{setGrowthInput(String(v));onSetGrowth(v);}} color="#546E7A">→{v}</DevBtn>
          ))}
        </div>
      </DevSection>

      {/* 성향 */}
      <DevSection title="성향 직접 설정">
        {Object.entries(TRAITS).map(([key,t])=>(
          <div key={key} style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
            <span style={{fontSize:11,width:62,color:t.color,fontWeight:700,flexShrink:0}}>{t.emoji} {t.label}</span>
            <DevBtn small onClick={()=>onSetTrait(key,-1)} color="#546E7A">－</DevBtn>
            <span style={{color:"#fff",fontSize:12,width:18,textAlign:"center",flexShrink:0}}>{pet.traits[key]}</span>
            <DevBtn small onClick={()=>onSetTrait(key,1)}  color="#546E7A">＋</DevBtn>
            <DevBtn small onClick={()=>onSetTrait(key,Math.max(0,8-pet.traits[key]))} color="#7E57C2">→8</DevBtn>
            <DevBtn small onClick={()=>onSetTrait(key,-pet.traits[key])} color="#37474F">0</DevBtn>
          </div>
        ))}
      </DevSection>

      {/* 강제 진화 */}
      <DevSection title="강제 진화 트리거 (진화 팝업 발생)">
        <div style={{display:"flex",gap:5,marginBottom:4}}>
          <DevBtn onClick={()=>onForceEvo(2)} color="#26A69A">🥚→🐣 2단계</DevBtn>
          <DevBtn onClick={()=>onForceEvo(3)} color="#AB47BC">🐣→✨ 3단계</DevBtn>
          <DevBtn onClick={onResetPet} color="#EC407A">🥚 알 단계로</DevBtn>
        </div>
        <div style={{fontSize:9,color:"rgba(255,255,255,.3)"}}>진화 팝업을 직접 트리거. 2단계는 stage 변경 없이 팝업만 발생. 알 단계로 = stage1·성장0·성향0으로 리셋(이름 유지).</div>
      </DevSection>

      {/* 최종 폼 강제 */}
      <DevSection title="최종 폼 강제 적용 (팝업 없이 즉시)">
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {Object.entries(FINAL_FORMS).map(([key,form])=>(
            <DevBtn key={key} small onClick={()=>onForceForm(key)} color={form.color}>
              {form.emoji} {form.name}
            </DevBtn>
          ))}
        </div>
      </DevSection>

      {/* 현재 상태 */}
      <DevSection title="현재 상태">
        <div style={{fontSize:10,color:"rgba(255,255,255,.55)",lineHeight:1.8,fontFamily:"monospace"}}>
          <div>stage: {pet.stage} | growth: {pet.growthPoint} | finalForm: {pet.finalForm||"none"}</div>
          <div>missions: {Object.entries(daily.missions).filter(([,v])=>v).map(([k])=>k).join(", ")||"없음"}</div>
          <div>claimed:  {Object.entries(daily.claimed||{}).filter(([,v])=>v).map(([k])=>k).join(", ")||"없음"}</div>
        </div>
      </DevSection>
    </div>
  );
}

// ===================================================
// 팝업: 3단계 펫 상점 이벤트 (1회성)
// ===================================================
function FormShopEventPopup({ form, onConfirm, onClose }) {
  return (
    <Overlay>
      <div style={{background:"rgba(16,14,36,.96)",backdropFilter:"blur(20px)",borderRadius:28,padding:"26px 22px",width:"90%",maxWidth:360,border:"1.5px solid rgba(255,255,255,.15)",animation:"slideUp .35s ease",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:10}}>🛍️</div>
        <h3 style={{fontFamily:"'Jua',sans-serif",fontSize:19,color:"#fff",marginBottom:6}}>새로운 아이템 해금!</h3>
        <p style={{color:"rgba(255,255,255,.7)",fontSize:13,lineHeight:1.7,marginBottom:18}}>
          상점에 특별한 아이템이<br/>추가됐다고 해요!<br/>상점으로 가볼까요?
        </p>
        <div style={{background:`${form.color}22`,border:`1.5px solid ${form.color}66`,borderRadius:12,padding:"8px 16px",display:"inline-block",fontSize:13,fontWeight:800,color:form.color,marginBottom:20}}>
          💰 재화 +10
        </div>
        <button
          onClick={onConfirm}
          style={{display:"block",width:"100%",background:`linear-gradient(135deg,${form.color},${form.color}99)`,border:"none",borderRadius:14,padding:"13px",fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"'Jua',sans-serif"}}
        >
          확인
        </button>
      </div>
    </Overlay>
  );
}

// 팝업: 설정 (세이브 코드 내보내기/불러오기)
// ===================================================
function SettingsPopup({ onClose, onExport, onImport }) {
  const [exportCode, setExportCode] = useState("");
  const [importCode, setImportCode] = useState("");
  const [error, setError]           = useState("");
  const [copied, setCopied]         = useState(false);

  const handleExport = () => setExportCode(onExport());

  const handleCopy = () => {
    navigator.clipboard?.writeText(exportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    setError("");
    const ok = onImport(importCode.trim());
    if (!ok) setError("코드가 올바르지 않아요. 다시 확인해 주세요.");
  };

  return (
    <Overlay>
      <div style={{background:"rgba(16,14,36,.96)",backdropFilter:"blur(22px)",borderRadius:28,padding:"22px 20px",width:"92%",maxWidth:360,border:"1.5px solid rgba(255,255,255,.15)",animation:"slideUp .35s ease",maxHeight:"88vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h3 style={{fontFamily:"'Jua',sans-serif",fontSize:19,color:"#fff"}}>⚙️ 설정</h3>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:14,padding:"5px 11px",color:"#fff",cursor:"pointer",fontWeight:700}}>✕</button>
        </div>

        {/* 내보내기 */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.7)",marginBottom:8}}>📤 세이브 코드 내보내기</div>
          <button onClick={handleExport} style={{width:"100%",background:"linear-gradient(135deg,#4ECDC4,#43C6AC)",border:"none",borderRadius:14,padding:"10px",fontSize:13,fontWeight:800,color:"#fff",cursor:"pointer",marginBottom:8,fontFamily:"'Jua',sans-serif"}}>
            코드 생성하기
          </button>
          {exportCode && (
            <>
              <textarea readOnly value={exportCode}
                style={{width:"100%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.2)",borderRadius:12,padding:"10px",color:"#fff",fontSize:11,fontFamily:"monospace",resize:"none",height:72,outline:"none",display:"block"}}
              />
              <button onClick={handleCopy}
                style={{width:"100%",background:copied?"rgba(78,203,113,.25)":"rgba(255,255,255,.1)",border:`1px solid ${copied?"#4ECB71":"rgba(255,255,255,.2)"}`,borderRadius:12,padding:"8px",fontSize:12,fontWeight:700,color:copied?"#4ECB71":"#fff",cursor:"pointer",marginTop:5}}>
                {copied ? "✓ 복사됨!" : "📋 복사하기"}
              </button>
            </>
          )}
        </div>

        {/* 불러오기 */}
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.7)",marginBottom:8}}>📥 세이브 코드 불러오기</div>
          <textarea
            value={importCode}
            onChange={e => { setImportCode(e.target.value); setError(""); }}
            placeholder="코드를 여기에 붙여넣으세요..."
            style={{width:"100%",background:"rgba(255,255,255,.08)",border:`1px solid ${error?"#FF6B6B":"rgba(255,255,255,.2)"}`,borderRadius:12,padding:"10px",color:"#fff",fontSize:11,fontFamily:"monospace",resize:"none",height:72,outline:"none",display:"block"}}
          />
          {error && <div style={{fontSize:11,color:"#FF6B6B",marginTop:5,fontWeight:600}}>{error}</div>}
          <button onClick={handleImport} disabled={!importCode.trim()}
            style={{width:"100%",background:importCode.trim()?"linear-gradient(135deg,#FF6B6B,#FF8E53)":"rgba(255,255,255,.08)",border:"none",borderRadius:14,padding:"10px",fontSize:13,fontWeight:800,color:importCode.trim()?"#fff":"rgba(255,255,255,.3)",cursor:importCode.trim()?"pointer":"not-allowed",marginTop:8,fontFamily:"'Jua',sans-serif"}}>
            불러오기 (현재 데이터 덮어씀)
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// ===================================================
// 오버레이
// ===================================================
function Overlay({ children, style }) {
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,backdropFilter:"blur(4px)",...style}}>
      {children}
    </div>
  );
}
