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

const FINAL_FORMS = {
  energetic:    { name: "장난꾸러기형", emoji: "🐱", primary: "energetic",    pMin: 8, secondary: "gluttonous",   sMin: 3, skill: "펫 챗봇",    skillEmoji: "💬", color: "#FF6B6B" },
  intelligent:  { name: "똑똑형",      emoji: "🦉", primary: "intelligent",  pMin: 8, secondary: "energetic",    sMin: 3, skill: "꿈 해몽",    skillEmoji: "🌙", color: "#4ECDC4" },
  affectionate: { name: "포근형",      emoji: "🐻", primary: "affectionate", pMin: 8, secondary: "intelligent",  sMin: 3, skill: "응원 메시지",skillEmoji: "🌸", color: "#FF8FA3" },
  lucky:        { name: "신비형",      emoji: "🦄", primary: "lucky",        pMin: 8, secondary: "affectionate", sMin: 3, skill: "오늘의 운세",skillEmoji: "🔮", color: "#FFD93D" },
  fashionable:  { name: "패션형",      emoji: "🦊", primary: "fashionable",  pMin: 8, secondary: "lucky",        sMin: 3, skill: "응원 메시지",skillEmoji: "👗", color: "#C77DFF" },
  gluttonous:   { name: "먹보형",      emoji: "🐼", primary: "gluttonous",   pMin: 8, secondary: "fashionable",  sMin: 3, skill: "오늘의 운세",skillEmoji: "🍜", color: "#F4A261" },
};


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
const WEATHER_META = {
  sunny:  { label:"맑음", emoji:"☀️", bg:"linear-gradient(170deg,#87CEEB 0%,#B8E4F9 40%,#D4F5C4 100%)" },
  rain:   { label:"비",   emoji:"🌧️", bg:"linear-gradient(170deg,#607D8B 0%,#90A4AE 50%,#B0BEC5 100%)" },
  snow:   { label:"눈",   emoji:"❄️", bg:"linear-gradient(170deg,#BBDEFB 0%,#E3F2FD 50%,#F5F5F5 100%)" },
  cloudy: { label:"흐림", emoji:"☁️", bg:"linear-gradient(170deg,#B0BEC5 0%,#CFD8DC 60%,#ECEFF1 100%)" },
  night:  { label:"밤",   emoji:"🌙", bg:"linear-gradient(170deg,#0D1B2A 0%,#1B2A4A 50%,#2A3B5A 100%)" },
  sunset: { label:"노을", emoji:"🌅", bg:"linear-gradient(170deg,#FF7043 0%,#FFA726 50%,#FFE082 100%)" },
};

const WEATHER_HOURS    = { nightStart: 20, nightEnd: 6, sunsetStart: 17 };
const DAILY_EVENT_CHANCE = 0.30;
const GACHA_RATES      = { superrare: 3, rare: 20 };

// 상점 상품 목록. owned/equipped는 inv.shopItems에 분리 저장.
// 상품 추가 시 이 배열에 객체 1개만 추가하면 UI 자동 렌더링.
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

  // ── decoration ───────────────────────────────────────────
  // 예시:
  { id:"deco_001", name:"야옹 이글루", category:"decoration", price:15, imagePath:"/images/shop/decorations/deco_001.png", description:"밖은 서늘하지만 안쪽은 아늑한 야옹이 이글루에요." },

  // ── window ───────────────────────────────────────────────
  // decoration과 동일하게 방에 배치되지만 벽(상단) 영역에만 놓인다.
  { id:"win_001", name:"동그란 창문", category:"window", price:10, imagePath:"/images/shop/windows/win_001.png", description:"벽에 다는 아늑한 동그란 창문이에요." },

  // ── gift_item ────────────────────────────────────────────
  // 구매 즉시 inv.gifts에 인스턴스 추가. giftRef = GIFT_MASTER.id
  // 예시:
  // { id:"gift_shop_001", name:"번개 결정체", category:"gift_item", price:20, imagePath:"/images/shop/gifts/gift_shop_001.png", description:"활발함 +3 초레어", giftRef:"g13" },
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

const MINIGAME_CONFIG  = { numMin: 2, numRange: 8, wrongCount: 3, wrongRange: 10, wrongOffset: 5 };

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
  // 주·부 성향 조건을 모두 충족하는 폼 목록 → 여러 개면 랜덤 선택
  const qualifying = Object.entries(FINAL_FORMS).filter(([, form]) =>
    traits[form.primary] >= form.pMin && traits[form.secondary] >= form.sMin
  );
  if (qualifying.length > 0) return qualifying[Math.floor(Math.random() * qualifying.length)][0];
  // 조건 미충족 시 폴백: 최고 성향 기준, 동점이면 선물 이력 → 랜덤
  const maxVal = Math.max(...Object.values(traits));
  const tops = Object.keys(traits).filter(k => traits[k] === maxVal);
  if (tops.length === 1) return tops[0];
  const lastTrait = [...giftHistory].reverse().find(g => tops.includes(g.trait))?.trait;
  return lastTrait || tops[Math.floor(Math.random() * tops.length)];
}

const rollDailyEvent = () => Math.random() <= DAILY_EVENT_CHANCE
  ? RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)] : null;

// ===================================================
// 초기 상태
// ===================================================
const DEFAULT_PET = {
  stage: 1, growthPoint: 0,
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
};

const loadState = () => { try { const r=localStorage.getItem("tama_v2"); return r?JSON.parse(r):null; } catch{return null;} };
const saveState = s => { try { localStorage.setItem("tama_v2",JSON.stringify(s)); } catch{} };

// ===================================================
// CSS
// ===================================================
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&family=Jua&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
body{font-family:'Nunito',sans-serif;background:#111;display:flex;justify-content:center;align-items:center;min-height:100vh;overflow:hidden;}
.shell{width:100%;max-width:420px;height:100dvh;max-height:910px;position:relative;overflow:hidden;box-shadow:0 0 80px rgba(0,0,0,.7);}
@media(min-width:480px){.shell{border-radius:36px;height:910px;}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes pop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(255,215,0,.4)}50%{box-shadow:0 0 70px rgba(255,215,0,.9)}}
@keyframes snowfall{0%{transform:translateY(-10px) translateX(0);opacity:1}100%{transform:translateY(100vh) translateX(30px);opacity:0}}
@keyframes rainfall{0%{transform:translateY(-10px);opacity:1}100%{transform:translateY(100vh);opacity:.3}}
@keyframes tooltipIn{from{opacity:0;transform:scale(.8) translateY(4px)}to{opacity:1;transform:scale(1) translateY(0)}}
.btn-action{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:none;cursor:pointer;transition:transform .15s,opacity .15s;}
.btn-action:active{transform:scale(.9);}
.btn-side{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:none;cursor:pointer;transition:transform .15s;}
.btn-side:active{transform:scale(.88);}
`;

// ===================================================
// 앱
// ===================================================
export default function App() {
  const saved = loadState();
  const [screen, setScreen] = useState(saved ? "home" : "egg_select");
  const [egg,    setEgg]    = useState(saved?.egg   || null);
  const [pet,    setPet]    = useState(saved?.pet   || DEFAULT_PET);
  const [daily,  setDaily]  = useState(saved?.daily || DEFAULT_DAILY);
  const [inv,    setInv]    = useState(saved?.inv ? { ...DEFAULT_INV, ...saved.inv } : DEFAULT_INV);
  const [ghist,  setGhist]  = useState(saved?.ghist || []);
  const [popup,  setPopup]  = useState(null);
  const [evoData,setEvoData]= useState(null);
  const [toast,  setToast]  = useState(null);
  const [game,   setGame]   = useState(null);
  const [selGift,setSelGift]= useState(null);
  const [lastDraw,setLastDraw]= useState(null);
  const [devMode,    setDevMode]    = useState(false);
  const [devWeather, setDevWeather] = useState(null); // null = 실제 날씨 사용

  const weather = (import.meta.env.DEV && devWeather) ? devWeather : getWeather();
  const wm = WEATHER_META[weather];

  // 매일 초기화
  useEffect(() => {
    const today = getTodayStr();
    if (daily.date !== today) {
      const ev = rollDailyEvent();
      setDaily({ ...DEFAULT_DAILY, date:today, event:ev, growthMultiplier: ev?.type==="aurora"?EVENT_REWARDS.aurora.growthMultiplier:1 });
      if (ev) setTimeout(() => setPopup("event"), 900);
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
  const handleFeed  = () => { if(devMode){ setPet(p=>({...p,status:{...p.status,hunger:Math.min(100,p.status.hunger+MISSION_REWARDS.feed.statusGain)}})); showToast("🔧 [DEV] 밥 효과 적용"); return; } if(markMissionDone("feed"))  { setPet(p=>({...p,status:{...p.status,hunger:Math.min(100,p.status.hunger+MISSION_REWARDS.feed.statusGain)}})); showToast("🍚 밥을 줬어요! 미션에서 보상을 받으세요."); } };
  const handleClean = () => { if(devMode){ setPet(p=>({...p,status:{...p.status,cleanness:Math.min(100,p.status.cleanness+MISSION_REWARDS.clean.statusGain)}})); showToast("🔧 [DEV] 청소 효과 적용"); return; } if(markMissionDone("clean")) { setPet(p=>({...p,status:{...p.status,cleanness:Math.min(100,p.status.cleanness+MISSION_REWARDS.clean.statusGain)}})); showToast("🛁 청소했어요! 미션에서 보상을 받으세요."); } };
  const handleStatusCheck = () => { if(!devMode && !daily.missions.statusCheck) markMissionDone("statusCheck"); setPopup("status"); };
  const handlePlay = () => {
    if(!devMode && daily.missions.play){ showToast("이미 완료!", "warn"); return; }
    const a=Math.floor(Math.random()*MINIGAME_CONFIG.numRange)+MINIGAME_CONFIG.numMin, b=Math.floor(Math.random()*MINIGAME_CONFIG.numRange)+MINIGAME_CONFIG.numMin, ans=a*b;
    const wrongs=[]; while(wrongs.length<MINIGAME_CONFIG.wrongCount){ const w=ans+(Math.floor(Math.random()*MINIGAME_CONFIG.wrongRange)-MINIGAME_CONFIG.wrongOffset); if(w!==ans&&w>0&&!wrongs.includes(w)) wrongs.push(w); }
    setGame({ a, b, answer:ans, choices:[ans,...wrongs].sort(()=>Math.random()-.5), done:false });
    setScreen("minigame");
  };
  const handleGameAnswer = choice => {
    if(choice===game.answer){
      setGame(g=>({...g,done:true,correct:true}));
      setTimeout(()=>{ if(!devMode) markMissionDone("play"); setPet(p=>({...p,status:{...p.status,mood:Math.min(100,p.status.mood+MISSION_REWARDS.play.statusGain)}})); showToast(devMode?"🔧 [DEV] 정답!":"🎮 정답! 미션에서 보상을 받으세요."); setScreen("home"); setGame(null); },900);
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
  // ─── Dev 전용 액션 (DevPanel에서만 호출, import.meta.env.DEV 게이트) ───
  const devSetGrowth    = v   => setPet(p=>({...p,growthPoint:Math.max(0,Math.min(999,parseInt(v)||0))}));
  const devSetTrait     = (t,d)=> setPet(p=>({...p,traits:{...p.traits,[t]:Math.max(0,p.traits[t]+d)}}));
  const devForceForm    = fk  => { setPet(p=>({...p,stage:3,finalForm:fk,growthPoint:GROWTH_THRESHOLDS.stage3})); setInv(i=>({...i,unlockedPets:[...new Set([...i.unlockedPets,fk])]})); showToast(`🔧 ${FINAL_FORMS[fk].name} 강제 적용`); setPopup(null); };
  const devForceEvo     = s   => { if(s===2){ setEvoData({stage:2,finalForm:null}); } else { setEvoData({stage:3,finalForm:determineFinalForm(pet.traits,ghist)}); } setPopup("evolution"); };
  const devResetDay     = ()  => { const ev=rollDailyEvent(); setDaily({...DEFAULT_DAILY,date:getTodayStr(),event:ev,growthMultiplier:ev?.type==="aurora"?EVENT_REWARDS.aurora.growthMultiplier:1}); if(ev) setTimeout(()=>setPopup("event"),900); showToast("🔧 하루 초기화"); };
  const devFillMissions = ()  => { setDaily(d=>({...d,missions:{...d.missions,feed:true,play:true,clean:true,gift:true,statusCheck:true,allCompleted:true}})); showToast("🔧 미션 모두 완료 처리"); };
  const devClaimAll     = ()  => { setDaily(d=>({...d,claimed:{feed:true,play:true,clean:true,gift:true,statusCheck:true,allComplete:true}})); showToast("🔧 모든 보상 수령 처리"); };
  const devRollEvent    = ()  => { const ev=rollDailyEvent(); setDaily(d=>({...d,event:ev,eventRewardClaimed:false,growthMultiplier:ev?.type==="aurora"?EVENT_REWARDS.aurora.growthMultiplier:1})); if(ev) setTimeout(()=>setPopup("event"),300); showToast(ev?`🔧 이벤트: ${ev.name}`:"🔧 이벤트 없음 (30% 미달)"); };
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
    if (si?.owned) { showToast("이미 보유한 상품이에요.", "warn"); return; }
    if (inv.currency < item.price) { showToast("재화가 부족해요!", "warn"); return; }

    if (item.category === "gift_item") {
      // 소모품 — inv.gifts에 즉시 인스턴스 추가
      const ref = GIFT_MASTER.find(g => g.id === item.giftRef);
      if (!ref) return;
      const instance = { ...ref, instanceId: `${ref.id}_${Date.now()}`, traitValue: ref.val };
      setInv(i => ({ ...i, currency: i.currency - item.price, gifts: [...i.gifts, instance] }));
    } else {
      // background / decoration / window — shopItems에 owned 기록
      const initItem = DECOR_CATEGORIES.includes(item.category)
        ? { owned:true, equipped:false, isFixed:false, position:{ x:50, y:placementBounds(item.category).defY } }
        : { owned:true, equipped:false };
      setInv(i => ({ ...i, currency: i.currency - item.price, shopItems: { ...i.shopItems, [itemId]: initItem } }));
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

  // 꾸미기 완료 시 draft 상태를 inv에 반영
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
      // 장식품/창문 — 기존 equipped 전부 해제 후 draft 적용
      SHOP_MASTER.filter(m => DECOR_CATEGORIES.includes(m.category)).forEach(m => {
        if (next[m.id]) next[m.id] = { ...next[m.id], equipped: false };
      });
      Object.entries(draftDecos).forEach(([id, state]) => {
        if (next[id]) next[id] = { ...next[id], ...state, equipped: true };
      });
      return { ...i, shopItems: next };
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
  const handleEggSelect = id => {
    setEgg(id); setScreen("home");
    saveState({ egg:id, pet:DEFAULT_PET, daily:{...DEFAULT_DAILY,date:getTodayStr()}, inv:DEFAULT_INV, ghist:[] });
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
      setInv(data.inv);
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

  const getPetEmoji = () => pet.stage===3&&pet.finalForm ? FINAL_FORMS[pet.finalForm]?.emoji||"✨" : pet.stage===2?"🐣":"🥚";
  const getPetName  = () => pet.stage===3&&pet.finalForm ? FINAL_FORMS[pet.finalForm]?.name||"최종체" : pet.stage===2?"성장체":"아기 펫";
  const getPetImg   = () => { if(pet.stage===3&&pet.finalForm) return `/images/pets/stage3/${pet.finalForm}.png`; if(pet.stage===2) return "/images/pets/stage2/growth.png"; return `/images/pets/stage1/${egg||"default"}.png`; };
  // 모션 에셋 경로 — 폼별 파이프라인. 현재 전 폼 미보유 → 공용 _test 사용(v1).
  // TODO(per-form): 폼별 에셋 생기면 stage/finalForm 기준 경로 반환하도록 확장.
  const getPetMotion = () => ({ stand: "/images/pets/_test/stand.webp", walk: "/images/pets/_test/walk.webp" });

  const growthMax = pet.stage===1 ? GROWTH_THRESHOLDS.stage2 : GROWTH_THRESHOLDS.stage3;
  const growthPct = Math.min(100,(pet.growthPoint/growthMax)*100);
  const missionDone = ["feed","play","clean","gift","statusCheck"].filter(k=>daily.missions[k]).length;

  return (
    <>
      <style>{CSS}</style>
      <div className="shell" style={{ background: wm.bg, transition:"background 1.2s ease" }}>
        <WeatherFX weather={weather}/>
        {toast && <Toast {...toast}/>}

        {screen==="egg_select" && <EggSelect onSelect={handleEggSelect}/>}

        {screen==="home" && (
          <HomeLayout
            pet={pet} daily={daily} inv={inv} weather={weather} wm={wm}
            growthPct={growthPct} growthMax={growthMax} missionDone={missionDone}
            getPetEmoji={getPetEmoji} getPetName={getPetName} getPetImg={getPetImg} getPetMotion={getPetMotion}
            canEvolve={canEvolve}
            onFeed={handleFeed} onPlay={handlePlay} onClean={handleClean}
            onGiftNav={()=>setScreen("giftbox")} onStatusCheck={handleStatusCheck}
            onNav={setScreen} onShare={handleShare} onSettings={()=>setPopup("settings")} onEventClaim={handleEventReward}
            onDecorSave={handleDecorSave}
          />
        )}

        {screen==="minigame" && game && <MiniGame game={game} onAnswer={handleGameAnswer} onBack={()=>setScreen("home")}/>}
        {screen==="mission"  && <MissionScreen daily={daily} onClaim={claimReward} onBack={()=>setScreen("home")}/>}
        {screen==="gacha"    && <GachaScreen inv={inv} daily={daily} lastDraw={lastDraw} onDraw={handleDraw} onBack={()=>setScreen("home")}/>}
        {screen==="giftbox"  && <GiftBox inv={inv} daily={daily} sel={selGift} onSel={setSelGift} onGive={handleGiftGive} onBack={()=>setScreen("home")}/>}
        {screen==="collection"&&<Collection inv={inv} onBack={()=>setScreen("home")}/>}
        {screen==="shop"     && <Shop inv={inv} onBuy={handleShopBuy} onBack={()=>setScreen("home")}/>}
        {screen==="skill"    && <SkillScreen pet={pet} onBack={()=>setScreen("home")}/>}

        {popup==="status"    && <StatusPopup pet={pet} growthMax={growthMax} canEvolve={canEvolve} onEvolve={handleEvolve} onClose={()=>setPopup(null)}/>}
        {popup==="event"     && daily.event && <EventPopup event={daily.event} claimed={daily.eventRewardClaimed} onClaim={handleEventReward} onClose={()=>setPopup(null)}/>}
        {popup==="rainbow"   && <RainbowPopup onChoose={handleRainbow} onClose={()=>setPopup(null)}/>}
        {popup==="evolution" && evoData && <EvoPopup data={evoData} onConfirm={handleEvoConfirm}/>}
        {popup==="settings"  && <SettingsPopup onClose={()=>setPopup(null)} onExport={handleExport} onImport={handleImport}/>}
        {popup==="devpanel" && import.meta.env.DEV && (
          <DevPanel
            pet={pet} daily={daily} devMode={devMode} devWeather={devWeather}
            onToggleDevMode={()=>setDevMode(d=>!d)}
            onClose={()=>setPopup(null)}
            onSetGrowth={devSetGrowth} onSetTrait={devSetTrait}
            onForceForm={devForceForm} onForceEvo={devForceEvo}
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
// 날씨 FX
// ===================================================
function WeatherFX({ weather }) {
  if (weather==="snow") return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:1}}>
      {[...Array(16)].map((_,i)=>(
        <div key={i} style={{position:"absolute",top:-10,left:`${5+i*6}%`,width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,.85)",animation:`snowfall ${2+i*.2}s linear ${i*.18}s infinite`}}/>
      ))}
    </div>
  );
  if (weather==="rain") return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:1}}>
      {[...Array(22)].map((_,i)=>(
        <div key={i} style={{position:"absolute",top:-10,left:`${i*4.5}%`,width:1.5,height:16,background:"rgba(180,220,255,.55)",animation:`rainfall ${.55+i*.03}s linear ${i*.06}s infinite`}}/>
      ))}
    </div>
  );
  return null;
}

// ===================================================
// 토스트
// ===================================================
function Toast({ msg, type }) {
  const bg = type==="gold"?"linear-gradient(135deg,#F7971E,#FFD200)":type==="warn"?"linear-gradient(135deg,#FF6B6B,#FF8E53)":"linear-gradient(135deg,#43C6AC,#4ECDC4)";
  return (
    <div style={{position:"absolute",top:56,left:"50%",transform:"translateX(-50%)",background:bg,color:"#fff",padding:"9px 20px",borderRadius:24,fontWeight:800,fontSize:13,zIndex:9999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.25)",animation:"pop .3s ease"}}>
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
  standAfterDrop: 2000, oneShotMs: 1300, bubbleMs: 1800,
  tapWindow: 1200, tapsForEmotion: 3, dragThresh: 8,
  floorTopPct: 0.64, floorBottomPct: 0.97,  // 펫 발이 머무는 마루 밴드(컨테이너 높이 대비)
};
const PET_LINES = ["안녕!", "배고파…", "놀자 놀자~", "오늘 기분 좋아", "쓰담쓰담 해줘", "히힝~", "어디 가?"];
const PET_EMOTIONS = [
  { motion: "angry", line: "그만 만져!" },
  { motion: "sad", line: "흑흑…" },
  { motion: "surprise", line: "꺄악!" },
  { motion: "smug", line: "흥칫뿡" },
];

// 모션 에셋 유무를 확인해 wandering / 정적 fallback 결정
function WanderingPet({ containerRef, scrollXRef, motion, staticImg, staticEmoji, petName, petColor }) {
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
      <div style={{position:"absolute",left:"50%",bottom:"32%",transform:"translateX(-50%)",display:"flex",flexDirection:"column-reverse",alignItems:"center",gap:4,zIndex:Math.round(PET_BASE_Y),pointerEvents:"none",textAlign:"center"}}>
        <div style={{animation:"float 3s ease-in-out infinite",filter:`drop-shadow(0 8px 24px ${petColor}99)`,userSelect:"none"}}>
          <PetSprite size={96} emoji={staticEmoji} imgSrc={staticImg}/>
        </div>
        <div style={{fontFamily:"'Jua',sans-serif",fontSize:14,color:"#fff",textShadow:"0 2px 10px rgba(0,0,0,.65)",whiteSpace:"nowrap"}}>{petName}</div>
      </div>
    );
  }
  return <WanderingPetActive containerRef={containerRef} scrollXRef={scrollXRef} motion={motion} petName={petName} petColor={petColor}/>;
}

function WanderingPetActive({ containerRef, scrollXRef, motion, petName, petColor }) {
  const wrapRef = useRef(null), imgRef = useRef(null), bubbleRef = useRef(null), bubbleTextRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrap = wrapRef.current, img = imgRef.current, bubble = bubbleRef.current, bubbleText = bubbleTextRef.current;
    if (!container || !wrap || !img) return;

    const C = PET_MOTION_CFG;
    const MOTIONS = { stand: motion.stand, walk: motion.walk };  // 키→src. 없는 키(감정)는 stand로
    const STATE_MOTION = { idle: "stand", walk: "walk", grabbed: "stand" };
    const now = () => performance.now();

    let W = 0, H = 0, floorTop = 0, floorBottom = 0, petSize = 0;
    const pet = { x: 0, y: 0, facing: 1, state: "idle", oneShotMotion: null };
    let home = { x: 0, y: 0 }, target = null;
    let walkUntil = 0, walkCount = 0, idleUntil = 0, motionUntil = 0, bubbleUntil = 0, curSrc = "";

    function resize() {
      W = container.clientWidth; H = container.clientHeight;
      floorTop = H * C.floorTopPct; floorBottom = H * C.floorBottomPct;
      petSize = Math.round((PET_REF_WIDTH / REFERENCE_RESOLUTION.width) * W); // 데코와 동일 공식
      wrap.style.width = petSize + "px"; wrap.style.height = petSize + "px";
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
    function showBubble(text) { bubbleText.textContent = text; bubbleUntil = now() + C.bubbleMs; }
    function playOneShot(key) { pet.oneShotMotion = key; pet.state = "oneshot"; motionUntil = now() + C.oneShotMs; target = null; }
    function triggerEmotion() {
      const e = PET_EMOTIONS[Math.floor(Math.random() * PET_EMOTIONS.length)];
      playOneShot(e.motion); showBubble(e.line);
    }

    function render() {
      const key = pet.state === "oneshot" ? pet.oneShotMotion : (STATE_MOTION[pet.state] || "stand");
      const src = MOTIONS[key] || MOTIONS.stand;  // 감정 등 자산 없는 키 → stand
      if (src !== curSrc) { img.src = src; curSrc = src; }  // 바뀔 때만(애니 리셋 방지)
      wrap.style.transform = `translate(${pet.x - scrollXRef.current - petSize / 2}px, ${pet.y - petSize / 2}px)`;  // 월드→화면: scrollX만큼 밀림(배경에 박힘)
      img.style.transform = `scaleX(${pet.facing})`;
      const footPct = ((pet.y + petSize / 2) / H) * 100;  // 동적 Y-정렬(데코와 동일 스케일)
      wrap.style.zIndex = String(Math.round(Math.min(150, Math.max(1, footPct))));
      bubble.style.opacity = (now() < bubbleUntil && pet.state !== "grabbed") ? "1" : "0";
    }

    let rafId = 0;
    function tick() {
      const t = now();
      switch (pet.state) {
        case "grabbed": break;
        case "oneshot": if (t >= motionUntil) { pet.state = "idle"; idleUntil = t + 400; } break;
        case "walk": if (target) moveToward(); else pet.state = "idle"; break;
        default: if (t >= idleUntil) pickTarget();
      }
      render();
      rafId = requestAnimationFrame(tick);
    }

    // ── 입력: 탭=대사/감정, 길게 끌기=잡아서 옮기기(월드 좌표). 펫 위 조작은 배경 스크롤로 안 샘 ──
    let down = null, lastTap = 0, tapCount = 0;
    function handleTap() {
      const t = now();
      tapCount = (t - lastTap < C.tapWindow) ? tapCount + 1 : 1; lastTap = t;
      if (tapCount >= C.tapsForEmotion) { tapCount = 0; triggerEmotion(); }
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
    function onDown(e) { e.preventDefault(); wrap.setPointerCapture?.(e.pointerId); down = { x: e.clientX, y: e.clientY, dragging: false }; }
    function onMove(e) {
      if (!down) return;
      if (!down.dragging && Math.hypot(e.clientX - down.x, e.clientY - down.y) > C.dragThresh) { down.dragging = true; pet.state = "grabbed"; target = null; }
      if (down.dragging) { const p = worldXY(e); pet.x = p.x; pet.y = p.y; }
    }
    function onUp() {
      if (!down) return;
      if (down.dragging) { home = { x: pet.x, y: pet.y }; pet.state = "idle"; idleUntil = now() + C.standAfterDrop; } // 내려놓은 자리 = 새 활동중심
      else handleTap();
      down = null;
    }
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", resize);

    resize();
    home = clampFloor((scrollXRef?.current || 0) + W / 2, H * 0.78);  // 초기 활동 중심 = 현재 보이는 방 중앙(월드)
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
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,gap:20,animation:"fadeUp .5s ease"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:8}}>🌟</div>
        <h1 style={{fontFamily:"'Jua',sans-serif",fontSize:26,color:"#fff",textShadow:"0 2px 12px rgba(0,0,0,.4)",marginBottom:4}}>펫을 선택하세요</h1>
        <p style={{color:"rgba(255,255,255,.7)",fontSize:13}}>어떤 알에서 어떤 펫이 나올지 몰라요!</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,width:"100%"}}>
        {EGG_OPTIONS.map(e=>(
          <button key={e.id} onMouseEnter={()=>setHov(e.id)} onMouseLeave={()=>setHov(null)} onClick={()=>onSelect(e.id)}
            style={{background:hov===e.id?e.color:"rgba(255,255,255,.15)",border:`2px solid ${hov===e.id?"rgba(0,0,0,.15)":"rgba(255,255,255,.25)"}`,borderRadius:20,padding:"16px 8px",cursor:"pointer",transform:hov===e.id?"scale(1.06)":"scale(1)",transition:"all .2s",backdropFilter:"blur(8px)"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:5}}>
              <PetSprite size={38} emoji="🥚" imgSrc={`/images/pets/stage1/${e.id}.png`}/>
            </div>
            <div style={{fontFamily:"'Jua',sans-serif",fontSize:12,color:hov===e.id?"#333":"#fff",fontWeight:700}}>{e.label}</div>
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
// isFixed=false: 드래그 가능 / isFixed=true: 위치 고정
function DecorationOverlay({ item, itemState, containerRef, draggable, onFixToggle, onRemove, onMove, onDragStart, scrollX = 0 }) {
  const [localPos, setLocalPos] = useState(itemState.position);
  const dragRef = useRef({ active:false, startX:0, startY:0, startPos:{x:0,y:0} });

  useEffect(() => { setLocalPos(itemState.position); }, [itemState.position]);

  // 기준 해상도 비율 기반 크기 — 원본 px ÷ 기준 폭 × 실제 컨테이너 폭 × scale
  const [natural, setNatural] = useState(null);   // 에셋 원본 px {w,h}
  const [box, setBox]         = useState({ w:0, h:0 }); // 컨테이너(화면) px
  const [imgFailed, setImgFailed] = useState(false);
  useEffect(() => { setImgFailed(false); }, [item.imagePath]);
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
    if (!draggable || itemState.isFixed) return;
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

  return (
    // 비꾸미기 모드: pointerEvents none으로 배경 드래그 이벤트를 가로채지 않음
    <div
      onTouchStart={draggable ? handleTouchStart : undefined}
      onTouchMove={draggable ? handleTouchMove : undefined}
      onTouchEnd={draggable ? handleTouchEnd : undefined}
      style={{
        position:"absolute", left:`calc(${localPos.x}% - ${scrollX}px)`, top:`${localPos.y}%`,
        transform:"translate(-50%,-50%)", zIndex:depthZ,
        touchAction: (draggable && !fixed) ? "none" : "auto",
        userSelect:"none",
        pointerEvents: draggable ? "auto" : "none",
      }}
    >
      <div style={{position:"relative"}}>
        {item.imagePath && !imgFailed ? (
          <img src={item.imagePath} alt="" draggable={false}
            onError={() => setImgFailed(true)}
            onLoad={e => setNatural({ w:e.target.naturalWidth, h:e.target.naturalHeight })}
            style={{ width: dispW ?? 60, height:"auto", display:"block", pointerEvents:"none" }}/>
        ) : (
          <span style={{ fontSize: Math.round((dispW ?? 60) * 0.62), lineHeight:1 }}>
            {CATEGORY_FALLBACK[item.category] || "🛍️"}
          </span>
        )}

        {/* 꾸미기 모드에서만 조작 버튼 표시 */}
        {draggable && (
          <div style={{
            position:"absolute", top:-28, left:"50%", transform:"translateX(-50%)",
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
  getPetEmoji, getPetName, getPetImg, getPetMotion, canEvolve,
  onFeed, onPlay, onClean, onGiftNav, onStatusCheck, onNav, onShare, onSettings, onEventClaim,
  onDecorSave,
}) {
  const hasEvent = daily.event && !daily.eventRewardClaimed;
  const petColor = pet.stage===3&&pet.finalForm ? FINAL_FORMS[pet.finalForm].color : "#88d8b0";

  const [evoBubbleDismissed, setEvoBubbleDismissed] = useState(false);
  useEffect(() => { if (!canEvolve) setEvoBubbleDismissed(false); }, [canEvolve]);

  // ── 꾸미기 draft 상태 ────────────────────────────────────
  const [isDecorMode, setIsDecorMode]         = useState(false);
  const [draftBg, setDraftBg]                 = useState(null);       // equipped background id
  const [draftDecos, setDraftDecos]           = useState({});          // {[id]: {isFixed, position}}
  const [isDecorPanelOpen, setIsDecorPanelOpen] = useState(true);
  const [isDraggingDecor, setIsDraggingDecor] = useState(false);

  const enterDecorMode = () => {
    const currentBg = (SHOP_MASTER.find(i => i.category==="background" && inv.shopItems?.[i.id]?.equipped) || {id:"bg_default"}).id;
    const initDecos = {};
    SHOP_MASTER.filter(i => DECOR_CATEGORIES.includes(i.category) && inv.shopItems?.[i.id]?.equipped).forEach(item => {
      const si = inv.shopItems[item.id];
      initDecos[item.id] = { isFixed: si.isFixed ?? false, position: si.position ?? { x:50, y:placementBounds(item.category).defY } };
    });
    setDraftBg(currentBg);
    setDraftDecos(initDecos);
    setIsDecorMode(true);
    setIsDecorPanelOpen(true);
    setIsDraggingDecor(false);
  };

  const completeDecor = () => {
    onDecorSave(draftBg, draftDecos);
    setIsDecorMode(false);
  };

  const cancelDecor = () => {
    setIsDecorMode(false);
    setDraftBg(null);
    setDraftDecos({});
  };

  // draft 장식품 핸들러
  const handleDraftFixToggle = (itemId) => {
    setDraftDecos(prev => ({ ...prev, [itemId]: { ...prev[itemId], isFixed: !prev[itemId].isFixed } }));
  };
  const handleDraftRemove = (itemId) => {
    setDraftDecos(prev => { const n={...prev}; delete n[itemId]; return n; });
  };
  const handleDraftMove = (itemId, pos) => {
    setDraftDecos(prev => ({ ...prev, [itemId]: { ...prev[itemId], position: pos } }));
  };
  const handleDraftAdd = (itemId) => {
    if (draftDecos[itemId]) return; // 이미 배치됨
    const cat = SHOP_MASTER.find(i => i.id === itemId)?.category;
    const w = midRef.current?.offsetWidth || 0;  // 현재 보이는 화면 중앙(월드 x%)에 생성
    const x = w ? Math.max(DECOR_X.min, Math.min(DECOR_X.max, ((scrollX + w / 2) / w) * 100)) : 50;
    setDraftDecos(prev => ({ ...prev, [itemId]: { isFixed: false, position: { x, y:placementBounds(cat).defY } } }));
  };

  // 렌더에 사용할 배경/장식품 (꾸미기 모드면 draft, 아니면 실제 inv)
  const displayBg = isDecorMode
    ? SHOP_MASTER.find(i => i.id === draftBg) || null
    : SHOP_MASTER.find(i => i.category==="background" && inv.shopItems?.[i.id]?.equipped) || null;

  const displayDecos = isDecorMode
    ? SHOP_MASTER.filter(i => DECOR_CATEGORIES.includes(i.category) && draftDecos[i.id])
    : SHOP_MASTER.filter(i => DECOR_CATEGORIES.includes(i.category) && inv.shopItems?.[i.id]?.equipped);

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

        {/* 장식품 오버레이 — 꾸미기 모드: draft 기준, 일반: inv 기준 */}
        {displayDecos.map(item => (
          <DecorationOverlay
            key={item.id}
            item={item}
            itemState={isDecorMode ? draftDecos[item.id] : inv.shopItems[item.id]}
            containerRef={midRef}
            draggable={isDecorMode}
            onFixToggle={isDecorMode ? () => handleDraftFixToggle(item.id) : undefined}
            onRemove={isDecorMode ? () => handleDraftRemove(item.id) : undefined}
            onMove={isDecorMode ? pos => handleDraftMove(item.id, pos) : undefined}
            onDragStart={isDecorMode ? () => { setIsDraggingDecor(true); setIsDecorPanelOpen(false); } : undefined}
            scrollX={scrollX}
          />
        ))}

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
            onDecoToggle={(id) => {
              if (draftDecos[id]) handleDraftRemove(id);
              else handleDraftAdd(id);
            }}
          />
        )}
      </div>

      {!isDecorMode && <BottomBar daily={daily} inv={inv} onFeed={onFeed} onPlay={onPlay} onClean={onClean} onGiftNav={onGiftNav}/>}
    </div>
  );
}

// ===================================================
// 방 배경 (가로 3배, 슬라이드 가능)
// ===================================================
function RoomBackground({ weather, scrollX, equippedBg }) {
  // 커스텀 배경 이미지가 장착된 경우 이미지로 대체
  if (equippedBg?.imagePath) {
    return (
      <div style={{position:"absolute",inset:0,overflow:"hidden",zIndex:0}}>
        <img src={equippedBg.imagePath} alt=""
          style={{position:"absolute",top:0,bottom:0,left:0,width:"300%",height:"100%",
                  objectFit:"cover",display:"block",
                  transform:`translateX(${-scrollX}px)`,willChange:"transform"}}/>
      </div>
    );
  }
  const skies = {
    sunny:  { bg:'linear-gradient(180deg,#5BB8F5 0%,#A8D8F0 55%,#D4EFD0 100%)', icon:'☀️' },
    rain:   { bg:'linear-gradient(180deg,#3D5A66 0%,#6E96A4 100%)',              icon:'🌧️' },
    snow:   { bg:'linear-gradient(180deg,#9BBFE8 0%,#D9EDF9 100%)',              icon:'❄️' },
    cloudy: { bg:'linear-gradient(180deg,#7A98A4 0%,#C4D4DA 100%)',              icon:'☁️' },
    night:  { bg:'linear-gradient(180deg,#08102A 0%,#152040 100%)',              icon:'🌙' },
    sunset: { bg:'linear-gradient(180deg,#C0300A 0%,#F4951A 55%,#FFD870 100%)', icon:'🌅' },
  };
  const sky = skies[weather] || skies.sunny;

  // 창문 6개: 배경(3x width)에서 0.25W, 0.75W, 1.25W, 1.75W, 2.25W, 2.75W 위치
  // 3x 기준 % → 8.33%, 25%, 41.67%, 58.33%, 75%, 91.67%
  const winLeft = ['8.33%','25%','41.67%','58.33%','75%','91.67%'];

  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',zIndex:0}}>
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
        {winLeft.map((left, i) => (
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
              background:sky.bg,
              borderRadius:3,
              overflow:'hidden', position:'relative',
            }}>
              {/* 창틀 세로 */}
              <div style={{position:'absolute',top:0,left:'50%',width:3,height:'100%',background:'rgba(80,40,8,0.75)',transform:'translateX(-50%)',zIndex:1}}/>
              {/* 창틀 가로 */}
              <div style={{position:'absolute',top:'42%',left:0,width:'100%',height:3,background:'rgba(80,40,8,0.75)',transform:'translateY(-50%)',zIndex:1}}/>
            </div>
          </div>
        ))}

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
          <div style={{fontFamily:"'Jua',sans-serif",fontSize:12,color:"#fff",lineHeight:1.2}}>{getPetName()}</div>
          <div style={{width:50,height:4,background:"rgba(0,0,0,.15)",borderRadius:4,overflow:"hidden",marginTop:2}}>
            <div style={{width:`${growthPct}%`,height:"100%",background:growthPct>80?"#FFD700":"#4CAF50",borderRadius:4,transition:"width .8s"}}/>
          </div>
        </div>
      </button>

      {/* 재화 */}
      <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.2)",borderRadius:14,padding:"4px 10px",flexShrink:0}}>
        <span style={{fontSize:14}}>💰</span>
        <span style={{fontWeight:800,fontSize:13,color:"#fff"}}>{inv.currency}</span>
      </div>

      {/* 티켓 */}
      <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.2)",borderRadius:14,padding:"4px 10px",flexShrink:0}}>
        <span style={{fontSize:14}}>🎫</span>
        <span style={{fontWeight:800,fontSize:13,color:"#fff"}}>{inv.tickets}</span>
      </div>

      <div style={{flex:1}}/>

      {/* 미션 버튼 */}
      <button onClick={onMission} style={{position:"relative",background:"rgba(255,255,255,.2)",border:"1.5px solid rgba(255,255,255,.3)",borderRadius:14,padding:"5px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
        <span style={{fontSize:15}}>📋</span>
        <div style={{width:28,height:3,background:"rgba(0,0,0,.15)",borderRadius:2,overflow:"hidden"}}>
          <div style={{width:`${(missionDone/5)*100}%`,height:"100%",background:"#FFD700",borderRadius:2}}/>
        </div>
        <span style={{fontSize:8,color:"rgba(255,255,255,.65)",fontWeight:700,letterSpacing:-0.3}}>{resetIn}</span>
        {daily.missions.allCompleted&&<div style={{position:"absolute",top:-4,right:-4,width:10,height:10,background:"#FF5722",borderRadius:"50%"}}/>}
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
        <span style={{fontSize:9,fontWeight:700,color:"#fff",marginTop:2}}>{wm.label}</span>
      </div>

      {/* 이벤트 카드 */}
      {daily.event && (
        <button
          onClick={()=>setEvOpen(v=>!v)}
          style={{display:"flex",flexDirection:"column",alignItems:"center",background:hasEvent?"rgba(255,220,50,.35)":"rgba(255,255,255,.12)",backdropFilter:"blur(8px)",borderRadius:16,padding:"8px 0",width:52,border:`1.5px solid ${hasEvent?"rgba(255,220,50,.6)":"rgba(255,255,255,.2)"}`,cursor:"pointer",position:"relative"}}>
          <span style={{fontSize:20}}>{daily.event.emoji}</span>
          <span style={{fontSize:9,fontWeight:700,color:"#fff",marginTop:2}}>이벤트</span>
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
          <span style={{fontSize:9,fontWeight:700,color:"#fff",marginTop:2}}>{item.label}</span>
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
function BottomBar({ daily, inv, onFeed, onPlay, onClean, onGiftNav }) {
  const actions = [
    { emoji:"🍚", label:"밥 주기",   done:daily.missions.feed,  onClick:onFeed,   color:"#FF7043" },
    { emoji:"🎮", label:"놀아주기",  done:daily.missions.play,  onClick:onPlay,   color:"#42A5F5" },
    { emoji:"🛁", label:"청소하기",  done:daily.missions.clean, onClick:onClean,  color:"#66BB6A" },
    { emoji:"🎁", label:"선물주기",  done:daily.missions.gift,  onClick:onGiftNav,color:"#FFA726" },
  ];
  return (
    <div style={{background:"rgba(80,40,20,.45)",backdropFilter:"blur(14px)",borderTop:"1.5px solid rgba(255,255,255,.15)",padding:"10px 12px 12px",display:"flex",gap:8,flexShrink:0}}>
      {actions.map(a=>(
        <button key={a.label} className="btn-action" onClick={a.onClick}
          style={{flex:1,background:a.done?"rgba(255,255,255,.08)":`${a.color}44`,border:`1.5px solid ${a.done?"rgba(255,255,255,.1)":`${a.color}88`}`,borderRadius:18,padding:"10px 4px",opacity:a.done ? 0.55 : 1}}>
          <span style={{fontSize:26,filter:a.done?"grayscale(1)":"none"}}>{a.emoji}</span>
          <span style={{fontSize:10,fontWeight:800,color:a.done?"rgba(255,255,255,.35)":"#fff"}}>{a.label}</span>
          {a.done&&<span style={{fontSize:9,color:"#4ECB71",fontWeight:700}}>✓ 완료</span>}
        </button>
      ))}
    </div>
  );
}

// ===================================================
// 미니게임
// ===================================================
function MiniGame({ game, onAnswer, onBack }) {
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:24,animation:"fadeUp .3s ease"}}>
      <button onClick={onBack} style={{alignSelf:"flex-start",background:"rgba(255,255,255,.2)",border:"none",borderRadius:20,padding:"8px 16px",color:"#fff",fontWeight:700,cursor:"pointer"}}>← 뒤로</button>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:44,marginBottom:8}}>🎮</div>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:22,color:"#fff",marginBottom:4}}>놀아주기 미니게임</h2>
        <p style={{color:"rgba(255,255,255,.6)",fontSize:13}}>정답을 맞혀보세요!</p>
      </div>
      <div style={{background:"rgba(255,255,255,.18)",backdropFilter:"blur(12px)",borderRadius:24,padding:"28px 40px",textAlign:"center",border:"2px solid rgba(255,255,255,.3)"}}>
        <p style={{color:"rgba(255,255,255,.6)",fontSize:13,marginBottom:8}}>다음을 계산하세요</p>
        <p style={{fontFamily:"'Jua',sans-serif",fontSize:44,color:"#fff",textShadow:"0 2px 12px rgba(0,0,0,.3)"}}>{game.a} × {game.b} = ?</p>
      </div>
      {game.done
        ? <div style={{fontSize:64,animation:"pop .4s ease"}}>{game.correct?"🎉":"😢"}</div>
        : <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,width:"100%"}}>
            {game.choices.map((c,i)=>(
              <button key={i} onClick={()=>onAnswer(c)} style={{background:"rgba(255,255,255,.2)",border:"2px solid rgba(255,255,255,.35)",borderRadius:18,padding:"18px",fontSize:26,fontWeight:900,color:"#fff",cursor:"pointer",fontFamily:"'Jua',sans-serif"}}>
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
    { key:"clean",       emoji:"🛁", label:"청소하기",        rewardIcon:"🌱", rewardLabel:mult?`성장 +${MISSION_REWARDS.clean.growth*2} (2배)`:`성장 +${MISSION_REWARDS.clean.growth}` },
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
    <div style={{height:"100%",display:"flex",flexDirection:"column",padding:18,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:20,padding:"8px 14px",color:"#fff",fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:"#fff"}}>📋 오늘의 미션</h2>
        <span style={{marginLeft:"auto",fontSize:13,color:"rgba(255,255,255,.6)"}}>{done}/5 완료</span>
      </div>

      {/* 초기화 시간 */}
      <div style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,.35)",marginBottom:6}}>🕛 매일 자정(00:00) 초기화</div>

      {/* 진행도 바 */}
      <div style={{background:"rgba(0,0,0,.15)",borderRadius:10,height:8,overflow:"hidden",marginBottom:14}}>
        <div style={{width:`${(done/5)*100}%`,height:"100%",background:"linear-gradient(90deg,#F7971E,#FFD200)",borderRadius:10,transition:"width .5s"}}/>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
        {missions.map(ms=>{
          const state = getState(ms.key);
          return (
            <div key={ms.key} style={{
              background: state==="claimed"?"rgba(78,203,113,.18)":state==="claimable"?"rgba(255,215,0,.12)":"rgba(255,255,255,.10)",
              border:`1.5px solid ${state==="claimed"?"rgba(78,203,113,.4)":state==="claimable"?"rgba(255,215,0,.45)":"rgba(255,255,255,.18)"}`,
              borderRadius:16,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,backdropFilter:"blur(8px)"
            }}>
              <span style={{fontSize:24}}>{ms.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:state==="todo"?"rgba(255,255,255,.4)":"#fff",fontSize:14}}>{ms.label}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.11)",borderRadius:12,padding:"4px 9px"}}>
                <span style={{fontSize:13}}>{ms.rewardIcon}</span>
                <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.8)"}}>{ms.rewardLabel}</span>
              </div>
              {state==="todo"     && <span style={{fontSize:17,marginLeft:2}}>⬜</span>}
              {state==="claimable"&& <button onClick={()=>onClaim(ms.key)} style={{background:"linear-gradient(135deg,#F7971E,#FFD200)",border:"none",borderRadius:11,padding:"5px 10px",fontSize:11,fontWeight:800,color:"#fff",cursor:"pointer",whiteSpace:"nowrap",marginLeft:2}}>받기</button>}
              {state==="claimed"  && <span style={{fontSize:17,marginLeft:2}}>✅</span>}
            </div>
          );
        })}

        {/* 전체 완료 보너스 */}
        <div style={{
          background: cl.allComplete?"rgba(78,203,113,.18)":allBonusClaimable?"rgba(255,215,0,.18)":"rgba(255,255,255,.07)",
          border:`1.5px solid ${cl.allComplete?"rgba(78,203,113,.4)":allBonusClaimable?"rgba(255,215,0,.5)":"rgba(255,255,255,.14)"}`,
          borderRadius:16,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,backdropFilter:"blur(8px)",marginTop:2
        }}>
          <span style={{fontSize:24}}>🎫</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,color:cl.allComplete?"#4ECB71":allBonusClaimable?"#FFD700":"rgba(255,255,255,.4)",fontSize:14}}>전체 완료 보너스</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.35)"}}>모든 보상 수령 후 획득</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.11)",borderRadius:12,padding:"4px 9px"}}>
            <span style={{fontSize:13}}>🎫</span>
            <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.8)"}}>×{MISSION_REWARDS.allComplete.tickets}</span>
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
  const gc = { normal:"#aaa", rare:"#4FC3F7", superrare:"#FFD700" };
  const gl = { normal:"⚪ 일반", rare:"💙 희귀", superrare:"🌟 초레어" };
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",padding:20,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,alignSelf:"flex-start"}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:20,padding:"8px 14px",color:"#fff",fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:"#fff"}}>🎰 선물뽑기</h2>
      </div>
      <div style={{background:"rgba(255,255,255,.12)",border:"2px solid rgba(255,255,255,.25)",borderRadius:28,padding:"32px 20px",textAlign:"center",width:"100%",backdropFilter:"blur(12px)",marginBottom:20}}>
        <div style={{fontSize:72,marginBottom:12,animation:spinning?"float .4s ease infinite":"float 3s ease-in-out infinite"}}>{spinning?"✨":lastDraw?lastDraw.emoji:"🎁"}</div>
        {lastDraw&&!spinning&&(
          <div style={{animation:"pop .4s ease"}}>
            <div style={{fontSize:13,color:gc[lastDraw.grade],fontWeight:800,marginBottom:4}}>{gl[lastDraw.grade]}</div>
            <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>{lastDraw.name}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.6)",marginTop:4}}>{TRAITS[lastDraw.trait].emoji} {TRAITS[lastDraw.trait].label} +{lastDraw.traitValue}</div>
          </div>
        )}
      </div>
      <button onClick={doFreeSpin} disabled={daily.freeGachaDone||spinning}
        style={{background:daily.freeGachaDone?"rgba(255,255,255,.1)":"linear-gradient(135deg,#43a047,#66bb6a)",border:"none",borderRadius:20,padding:"14px 40px",fontSize:15,fontWeight:800,color:"#fff",cursor:daily.freeGachaDone?"not-allowed":"pointer",width:"100%",marginBottom:10,fontFamily:"'Jua',sans-serif",boxShadow:daily.freeGachaDone?"none":"0 4px 20px rgba(67,160,71,.4)"}}>
        {daily.freeGachaDone?"오늘 무료 뽑기 완료 ✓":"🎁 무료 뽑기 1회 (매일)"}
      </button>
      <button onClick={doSpin} disabled={inv.tickets<1||spinning}
        style={{background:inv.tickets>0?"linear-gradient(135deg,#F7971E,#FFD200)":"rgba(255,255,255,.15)",border:"none",borderRadius:20,padding:"14px 40px",fontSize:15,fontWeight:800,color:"#fff",cursor:inv.tickets>0?"pointer":"not-allowed",width:"100%",marginBottom:10,fontFamily:"'Jua',sans-serif",boxShadow:inv.tickets>0?"0 4px 20px rgba(247,151,30,.4)":"none"}}>
        🎫 뽑기 1회 (티켓 1장)
      </button>
      <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginBottom:14}}>보유 티켓: {inv.tickets}장</div>
      <div style={{background:"rgba(255,255,255,.08)",borderRadius:14,padding:"12px 20px",width:"100%",fontSize:12,color:"rgba(255,255,255,.6)",display:"flex",flexDirection:"column",gap:5}}>
        {[["⚪ 일반","#aaa","80%","+1"],["💙 희귀","#4FC3F7","17%","+2"],["🌟 초레어","#FFD700","3%","+3"]].map(([n,c,p,v])=>(
          <div key={n} style={{display:"flex",justifyContent:"space-between"}}><span style={{color:c}}>{n}</span><span>{p} · 성향 {v}</span></div>
        ))}
      </div>
    </div>
  );
}

// ===================================================
// 선물함
// ===================================================
function GiftBox({ inv, daily, sel, onSel, onGive, onBack }) {
  const selected = inv.gifts.find(g=>g.instanceId===sel);
  const gc = { normal:"rgba(255,255,255,.15)", rare:"rgba(79,195,247,.25)", superrare:"rgba(255,215,0,.25)" };
  const gb = { normal:"rgba(255,255,255,.2)", rare:"#4FC3F7", superrare:"#FFD700" };
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",padding:18,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:20,padding:"8px 14px",color:"#fff",fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:"#fff"}}>🎁 선물함</h2>
        <span style={{marginLeft:"auto",fontSize:13,color:"rgba(255,255,255,.5)"}}>{inv.gifts.length}개</span>
      </div>
      {inv.gifts.length===0
        ? <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,color:"rgba(255,255,255,.4)"}}>
            <span style={{fontSize:48}}>📭</span><p style={{fontSize:13}}>선물이 없어요. 뽑기를 해보세요!</p>
          </div>
        : <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,flex:1,overflowY:"auto",marginBottom:10}}>
              {inv.gifts.map(g=>(
                <button key={g.instanceId} onClick={()=>onSel(g.instanceId===sel?null:g.instanceId)}
                  style={{background:g.instanceId===sel?gc[g.grade]:"rgba(255,255,255,.1)",border:`2px solid ${g.instanceId===sel?gb[g.grade]:"rgba(255,255,255,.2)"}`,borderRadius:16,padding:"10px 6px",cursor:"pointer",textAlign:"center",transform:g.instanceId===sel?"scale(1.05)":"scale(1)",transition:"all .2s"}}>
                  <div style={{fontSize:26,marginBottom:3}}>{g.emoji}</div>
                  <div style={{fontSize:10,fontWeight:700,color:"#fff"}}>{g.name}</div>
                  <div style={{fontSize:10,color:TRAITS[g.trait].color,marginTop:2}}>{TRAITS[g.trait].emoji}+{g.traitValue}</div>
                </button>
              ))}
            </div>
            {selected&&(
              <div style={{background:"rgba(255,255,255,.14)",borderRadius:18,padding:"14px",backdropFilter:"blur(10px)",border:"1.5px solid rgba(255,255,255,.25)"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <span style={{fontSize:32}}>{selected.emoji}</span>
                  <div><div style={{fontWeight:700,color:"#fff"}}>{selected.name}</div><div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>{{normal:"일반",rare:"희귀",superrare:"초레어"}[selected.grade]}</div></div>
                </div>
                <button onClick={onGive} disabled={(daily.giftCount??0)>=2}
                  style={{width:"100%",background:(daily.giftCount??0)>=2?"rgba(255,255,255,.1)":"linear-gradient(135deg,#FF6B6B,#FF8E53)",border:"none",borderRadius:14,padding:"11px",fontSize:14,fontWeight:800,color:(daily.giftCount??0)>=2?"rgba(255,255,255,.3)":"#fff",cursor:(daily.giftCount??0)>=2?"not-allowed":"pointer",fontFamily:"'Jua',sans-serif"}}>
                  {(daily.giftCount??0)>=2?"오늘 선물 완료 (2/2) ✓":`이 선물 주기 🎁 (${daily.giftCount??0}/2)`}
                </button>
              </div>
            )}
          </>
      }
    </div>
  );
}

// ===================================================
// 도감
// ===================================================
function Collection({ inv, onBack }) {
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",padding:18,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:20,padding:"8px 14px",color:"#fff",fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:"#fff"}}>📖 도감</h2>
        <span style={{marginLeft:"auto",fontSize:13,color:"rgba(255,255,255,.5)"}}>{inv.unlockedPets.length}/6</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {Object.entries(FINAL_FORMS).map(([key,form])=>{
          const unlocked = inv.unlockedPets.includes(key);
          return (
            <div key={key} style={{background:unlocked?`${form.color}28`:"rgba(255,255,255,.07)",border:`1.5px solid ${unlocked?form.color+"55":"rgba(255,255,255,.12)"}`,borderRadius:18,padding:"16px 6px",textAlign:"center",backdropFilter:"blur(8px)"}}>
              <div style={{fontSize:40,marginBottom:5,filter:unlocked?"none":"grayscale(1) brightness(.3)"}}>{form.emoji}</div>
              <div style={{fontSize:11,fontWeight:700,color:unlocked?"#fff":"rgba(255,255,255,.25)"}}>{unlocked?form.name:"???"}</div>
              {unlocked&&<div style={{fontSize:10,color:TRAITS[key].color,marginTop:3}}>{TRAITS[key].emoji} {TRAITS[key].label}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================================================
// 상점
// ===================================================
// 상품 이미지 — 로드 실패 시 카테고리별 이모지 fallback
function ShopItemImage({ item, size=64 }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [item.imagePath]);
  const fallback = CATEGORY_FALLBACK[item.category] || "🛍️";
  if (item.imagePath && !failed) {
    return (
      <img src={item.imagePath} alt="" onError={() => setFailed(true)}
        style={{width:size,height:size,maxWidth:size,maxHeight:size,objectFit:"contain",display:"block"}}/>
    );
  }
  return <span style={{fontSize:Math.round(size*0.62),lineHeight:1}}>{fallback}</span>;
}

// ===================================================
// 꾸미기 모드 하단 패널 (홈에서만 사용)
// ===================================================
function DecorateModePanel({ inv, draftBg, draftDecos, isOpen, onToggle, onBgSelect, onDecoToggle }) {
  const ownedBgs   = SHOP_MASTER.filter(i => i.category === "background" && (inv.shopItems?.[i.id]?.owned || i.isDefault));
  const ownedDecos = SHOP_MASTER.filter(i => DECOR_CATEGORIES.includes(i.category) && inv.shopItems?.[i.id]?.owned);

  const Tile = ({ item, active, onTap }) => (
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

  return (
    <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:Z_UI.decorCtrl}}>
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
                  <Tile key={item.id} item={item}
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
                  <Tile key={item.id} item={item}
                    active={!!draftDecos[item.id]}
                    onTap={() => onDecoToggle(item.id)}/>
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
        {!item.isDefault && owned && (
          <div style={{fontSize:13,fontWeight:800,color:"rgba(80,220,120,.9)"}}>✓ 보유 중</div>
        )}
        {!item.isDefault && !owned && (
          <div style={{fontSize:14,fontWeight:800,color:canAfford?"#FFD700":"#FF6B6B"}}>
            💰 {item.price}{!canAfford && "  (재화 부족)"}
          </div>
        )}

        {/* 미보유 시에만 구매 버튼 */}
        {!owned && !item.isDefault && (
          <button onClick={()=>{ onBuy(item.id); onClose(); }} disabled={!canAfford}
            style={{width:"100%",maxWidth:280,padding:"12px 0",borderRadius:14,border:"none",
              cursor:canAfford?"pointer":"not-allowed",
              background:canAfford?"linear-gradient(135deg,#F7971E,#FFD200)":"rgba(255,255,255,.1)",
              color:"#fff",fontWeight:800,fontSize:15,fontFamily:"'Nunito',sans-serif"}}>
            {canAfford?"구매하기":"재화가 부족해요"}
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

  const sorted = SHOP_MASTER
    .filter(i => tab === "decoration" ? DECOR_CATEGORIES.includes(i.category) : i.category === tab)
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
        <button onClick={onBack} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:20,padding:"8px 14px",color:"#fff",fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:"#fff"}}>🏪 상점</h2>
        <div style={{marginLeft:"auto",background:"rgba(255,255,255,.2)",borderRadius:14,padding:"4px 12px",fontSize:13,fontWeight:800,color:"#FFD700"}}>
          💰 {inv.currency}
        </div>
      </div>

      {/* 카테고리 탭 + 정렬 아이콘 */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 20px 10px",flexShrink:0}}>
        <div style={{display:"flex",gap:6,flex:1}}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)}
              style={{flex:1,padding:"8px 0",borderRadius:12,border:"none",cursor:"pointer",
                background:tab===t.key?"rgba(255,255,255,.9)":"rgba(255,255,255,.15)",
                color:tab===t.key?"#333":"#fff",fontWeight:700,fontSize:13,fontFamily:"'Nunito',sans-serif"}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* 정렬 아이콘 버튼 + 팝업 */}
        <div ref={sortRef} style={{position:"relative",flexShrink:0}}>
          <button
            onClick={()=>setSortOpen(o=>!o)}
            style={{width:38,height:38,borderRadius:10,border:"none",cursor:"pointer",
              background:sortOpen?"rgba(255,255,255,.88)":"rgba(255,255,255,.18)",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
            {/* 3줄 정렬 아이콘 */}
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <rect x="0" y="0"  width="18" height="2.2" rx="1.1" fill={sortOpen?"#333":"#fff"}/>
              <rect x="2" y="5.9" width="14" height="2.2" rx="1.1" fill={sortOpen?"#333":"#fff"}/>
              <rect x="5" y="11.8" width="8"  height="2.2" rx="1.1" fill={sortOpen?"#333":"#fff"}/>
            </svg>
          </button>

          {sortOpen && (
            <div style={{position:"absolute",top:44,right:0,zIndex:50,
              background:"rgba(30,20,60,.96)",borderRadius:12,overflow:"hidden",
              boxShadow:"0 4px 20px rgba(0,0,0,.4)",minWidth:90}}>
              {SORT_OPTIONS.map(s=>(
                <button key={s.key}
                  onClick={()=>{ setSort(s.key); setSortOpen(false); }}
                  style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"11px 14px",
                    border:"none",cursor:"pointer",background:"transparent",textAlign:"left",
                    fontFamily:"'Nunito',sans-serif",fontSize:13,fontWeight:700,
                    color:sort===s.key?"#FFD700":"rgba(255,255,255,.8)"}}>
                  <span style={{width:12,fontSize:10,color:"#FFD700"}}>
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
            <p style={{color:"rgba(255,255,255,.5)",fontSize:13}}>준비 중이에요!</p>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {sorted.map(item=>{
              const si      = inv.shopItems?.[item.id];
              const owned   = si?.owned || item.isDefault;
              const canAfford = inv.currency >= item.price;
              return (
                <div key={item.id} onClick={()=>setSelectedItem(item)} style={{
                  background:owned?"rgba(255,255,255,.15)":"rgba(255,255,255,.08)",
                  border:`1.5px solid ${owned?"rgba(255,255,255,.35)":"rgba(255,255,255,.15)"}`,
                  borderRadius:18,padding:"14px 10px",display:"flex",flexDirection:"column",
                  alignItems:"center",gap:8,backdropFilter:"blur(8px)",cursor:"pointer"}}>

                  <div style={{width:64,height:64,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <ShopItemImage item={item} size={64}/>
                  </div>

                  <div style={{fontFamily:"'Jua',sans-serif",fontSize:13,color:"#fff",textAlign:"center",
                    wordBreak:"keep-all",WebkitLineClamp:2,overflow:"hidden",
                    display:"-webkit-box",WebkitBoxOrient:"vertical"}}>
                    {item.name}
                  </div>

                  <div style={{fontSize:11,fontWeight:800,
                    color:item.isDefault||owned?"rgba(80,220,120,.8)":canAfford?"#FFD700":"#FF6B6B"}}>
                    {item.isDefault?"기본 제공":owned?"✓ 보유 중":`💰 ${item.price}`}
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
        <button onClick={onBack} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:20,padding:"8px 14px",color:"#fff",fontWeight:700,cursor:"pointer"}}>←</button>
        <h2 style={{fontFamily:"'Jua',sans-serif",fontSize:20,color:"#fff"}}>⚡ 고유 스킬</h2>
      </div>
      {form&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:18,width:"100%"}}>
          <div style={{fontSize:76}}>{form.skillEmoji}</div>
          <h3 style={{fontFamily:"'Jua',sans-serif",fontSize:22,color:"#fff"}}>{form.skill}</h3>
          <div style={{background:"rgba(255,255,255,.1)",border:"2px dashed rgba(255,255,255,.3)",borderRadius:20,padding:"22px",width:"100%",textAlign:"center",backdropFilter:"blur(8px)"}}>
            <div style={{fontSize:30,marginBottom:10}}>🔧</div>
            <p style={{color:"rgba(255,255,255,.6)",fontSize:13,lineHeight:1.7}}>이 스킬은 향후 업데이트에서<br/>사용 가능해질 예정이에요.<br/><br/><span style={{color:form.color,fontWeight:700}}>"{form.name}"</span>의<br/><span style={{color:"#FFD700"}}>{form.skillEmoji} {form.skill}</span>을 기대해 주세요!</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================================================
// 팝업: 내 펫 상태 (? 버블 포함)
// ===================================================
function StatusPopup({ pet, growthMax, canEvolve, onEvolve, onClose }) {
  const [tipStatus, setTipStatus] = useState(false);
  const [tipTrait,  setTipTrait]  = useState(false);
  const maxTrait = Math.max(...Object.values(pet.traits));

  return (
    <Overlay>
      <div style={{background:"rgba(16,14,36,.96)",backdropFilter:"blur(22px)",borderRadius:28,padding:"22px 20px",width:"92%",maxWidth:360,border:"1.5px solid rgba(255,255,255,.15)",animation:"slideUp .35s ease",maxHeight:"88vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{fontFamily:"'Jua',sans-serif",fontSize:19,color:"#fff"}}>💖 내 펫 상태</h3>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:14,padding:"5px 11px",color:"#fff",cursor:"pointer",fontWeight:700}}>✕</button>
        </div>

        {/* 기본 수치 */}
        <div style={{background:"rgba(255,255,255,.07)",borderRadius:16,padding:"12px 14px",marginBottom:12}}>
          {[["현재 단계",`${pet.stage}단계 · ${["아기","성장체","최종체"][pet.stage-1]}`],["성장도",`${pet.growthPoint} / ${growthMax}`],["다음 진화까지",pet.stage===3?"최종 진화 완료":`${Math.max(0,growthMax-pet.growthPoint)} 남음`]].map(([l,v])=>(
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
                  배고픔·기분·청결은 시간이 지나면 감소해요. 밥주기·놀아주기·청소하기로 채울 수 있어요. 게임 성장에는 직접 영향을 주지 않아요.
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
                  선물을 줄수록 해당 성향이 올라가요. 3단계 진화 시 가장 높은 성향에 따라 최종 캐릭터가 결정돼요. (주 성향 ≥8 + 부 성향 ≥3 필요)
                  <button onClick={()=>setTipTrait(false)} style={{position:"absolute",top:4,right:6,background:"none",border:"none",color:"rgba(255,255,255,.4)",cursor:"pointer",fontSize:11}}>✕</button>
                </div>
              )}
            </div>
          </div>
          {Object.entries(TRAITS).map(([key,t])=>{
            const val = pet.traits[key];
            const isTop = val===maxTrait&&maxTrait>0;
            const form = FINAL_FORMS[key];
            const pOk = val>=form.pMin, sVal=pet.traits[form.secondary], sOk=sVal>=form.sMin;
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
                  <div style={{fontSize:9,color:"rgba(255,255,255,.35)",marginTop:2}}>
                    {t.emoji}≥{form.pMin} {pOk?"✓":`(${val}/${form.pMin})`} · {TRAITS[form.secondary].emoji}≥{form.sMin} {sOk?"✓":`(${sVal}/${form.sMin})`}
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
function EvoPopup({ data, onConfirm }) {
  const is3 = data.stage===3;
  const form = is3&&data.finalForm ? FINAL_FORMS[data.finalForm] : null;
  return (
    <Overlay style={{zIndex:10000}}>
      <div style={{background:is3?"rgba(8,6,20,.98)":"rgba(16,14,36,.96)",backdropFilter:"blur(20px)",borderRadius:32,padding:"38px 26px",width:"88%",maxWidth:360,textAlign:"center",border:`2px solid ${is3?"#FFD700":"rgba(255,255,255,.2)"}`,animation:is3?"glow 2s ease infinite, pop .5s ease":"pop .4s ease"}}>
        <div style={{fontSize:15,color:is3?"#FFD700":"rgba(255,255,255,.55)",marginBottom:6,fontWeight:700}}>{is3?"✨ 최종 진화!":"🎉 진화!"}</div>
        <div style={{marginBottom:14,animation:"float 2s ease-in-out infinite",display:"flex",justifyContent:"center"}}>
          <PetSprite size={84} emoji={form?form.emoji:"🐣"} imgSrc={form?`/images/pets/stage3/${data.finalForm}.png`:"/images/pets/stage2/growth.png"}/>
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
function DevPanel({ pet, daily, devMode, devWeather, onToggleDevMode, onClose, onSetGrowth, onSetTrait, onForceForm, onForceEvo, onResetDay, onFillMissions, onClaimAll, onRollEvent, onSetWeather, onResetAll }) {
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
        </div>
        <div style={{fontSize:9,color:"rgba(255,255,255,.3)"}}>진화 팝업을 직접 트리거. 2단계는 stage 변경 없이 팝업만 발생.</div>
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
