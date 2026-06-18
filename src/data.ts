// Police Metamorphosis Photo Booth Data & Asset Handlers

export interface UniformTemplate {
  id: string;
  name: string;
  subName: string;
  type: 'patrol' | 'traffic' | 'swat' | 'coast';
  color: string;
  badgeHex: string;
  description: string;
}

export interface AccessorySticker {
  id: string;
  name: string;
  emoji: string;
  category: 'hat' | 'eyewear' | 'badge' | 'prop';
  svgPath?: string;
  width: number;
  height: number;
}

export const UNIFORM_TEMPLATES: UniformTemplate[] = [
  {
    id: "patrol",
    name: "경찰관",
    subName: "용감한 삼총사 순찰대원",
    type: "patrol",
    color: "#1e3a8a", // navy
    badgeHex: "#fbbf24", // gold
    description: "멋진 정복을 완벽하게 갖춰 입은 대표 경찰관!"
  },
  {
    id: "traffic",
    name: "교통지킴이",
    subName: "안전제일 하이웨이 지킴이",
    type: "traffic",
    color: "#eab308", // bright yellow
    badgeHex: "#94a3b8", // silver
    description: "반짝반짝 하이웨이를 안전하게 지도하는 교통 경찰관!"
  },
  {
    id: "swat",
    name: "특공대",
    subName: "골목대장 대테러 요원",
    type: "swat",
    color: "#1e293b", // dark slate
    badgeHex: "#38bdf8", // cyber blue
    description: "위험에 처한 힘없는 친구들을 지켜주는 최고 요원!"
  },
  {
    id: "coast",
    name: "해양경찰관",
    subName: "해상 수호 해피 세일러",
    type: "coast",
    color: "#ffffff", // white
    badgeHex: "#fbbf24", // gold
    description: "넘실거리는 시원한 파도를 가르며 지구를 지키는 바다 요정!"
  }
];

export const POLICE_STICKERS: AccessorySticker[] = [
  // Hats (Updated to exactly requested hats)
  { id: "hat_blue", name: "경찰 모자(파란색)", emoji: "👮", category: "hat", width: 120, height: 90 },
  { id: "hat_yellow", name: "교통모자(노란색)", emoji: "🧑‍✈️", category: "hat", width: 120, height: 90 },
  { id: "hat_swat_black", name: "경찰특공대 모자(검정색)", emoji: "🪖", category: "hat", width: 110, height: 90 },
  { id: "hat_coast_white", name: "해양 경찰 흰색", emoji: "🧑‍✈️", category: "hat", width: 120, height: 90 },
  
  // Badges & Glasses
  { id: "prop_glasses", name: "보잉 선글라스", emoji: "🕶️", category: "eyewear", width: 100, height: 50 },
  { id: "prop_star", name: "별 뱃지", emoji: "⭐", category: "badge", width: 70, height: 70 },
  { id: "prop_sheriff", name: "보안관 방패", emoji: "🛡️", category: "badge", width: 85, height: 95 },
  
  // Props
  { id: "prop_siren", name: "귀여운 벨", emoji: "🚨", category: "prop", width: 80, height: 80 },
  { id: "prop_car", name: "미니 경찰차", emoji: "🚔", category: "prop", width: 130, height: 90 },
  { id: "prop_glass", name: "수색 돋보기", emoji: "🔍", category: "prop", width: 80, height: 80 }
];

// Fun titles for the Kindergarten Police Identification Card
export const DEPARTMENT_OPTIONS = [
  "유치원 안전 지킴이"
];

// Praises that Kindergarten children usually do
export const COMPLIMENT_OPTIONS = [
  { label: "🤝 사이좋게 양보하는 친구", value: "친구들과 사이좋게 놀고 먼저 차례를 양보하는 착한 마음씨" },
  { label: "🧸 장난감을 스스로 장난감장에 정리하는 대원", value: "놀이가 끝난 뒤 장난감을 제자리에 스스로 깔끔히 정리하는 습관" },
  { label: "🍚 반찬 투정 않고 냠냠 골고루 잘 먹는 대원", value: "매일 음식을 남기지 않고 골고루 튼튼하게 골고루 잘 먹는 태도" },
  { label: "🚦 횡단보도를 조심히 건너는 질서의 달인", value: "신호등을 잘 확인하고 차례를 지켜 길을 안전하게 건너는 안전의식" },
  { label: "👋 상냥하게 먼저 인사하는 약속 대장", value: "매일 아침 선생님과 친구들에게 큰 소리로 밝고 귀엽게 인사하는 자세" },
  { label: "🐱 작고 가녀린 생명을 보호하는 동정심 요정", value: "길가의 아기 고양이나 들꽃도 밟지 않고 지켜주는 넓고 상냥한 사랑" }
];
