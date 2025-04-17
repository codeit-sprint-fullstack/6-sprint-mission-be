// 게시글 mock data
const mockArticles = [
  {
    title: "오늘 날씨 어때요?",
    content: "비가 오려나 싶었는데 해가 떴네요.",
    createdAt: "2025-04-16T10:00:00Z",
    updatedAt: "2025-04-16T12:00:00Z",
  },
  {
    title: "React에서 상태 관리 어떻게 하세요?",
    content: "Redux랑 Recoil 중에 뭐가 나을까요?",
    createdAt: "2025-04-15T10:00:00Z",
    updatedAt: "2025-04-15T12:00:00Z",
  },
  {
    title: "스터디 같이 하실 분!",
    content: "매주 수요일 저녁에 온라인 스터디 진행해요.",
    createdAt: "2025-04-14T10:00:00Z",
    updatedAt: "2025-04-14T12:00:00Z",
  },
  {
    title: "개발 슬럼프 극복 방법",
    content: "요즘 너무 하기 싫은데 다들 어떻게 극복하세요?",
    createdAt: "2025-04-13T10:00:00Z",
    updatedAt: "2025-04-13T12:00:00Z",
  },
  {
    title: "넷플릭스 추천 좀!",
    content: "재밌게 본 드라마나 영화 추천해주세요~",
    createdAt: "2025-04-12T10:00:00Z",
    updatedAt: "2025-04-12T12:00:00Z",
  },
  {
    title: "포트폴리오 피드백 받을 수 있을까요?",
    content: "링크 올릴게요, 피드백 부탁드려요!",
    createdAt: "2025-04-11T10:00:00Z",
    updatedAt: "2025-04-11T12:00:00Z",
  },
  {
    title: "카페에서 코딩하기 좋은 곳",
    content: "서울에 괜찮은 카페 아시면 추천 부탁드려요!",
    createdAt: "2025-04-10T10:00:00Z",
    updatedAt: "2025-04-10T12:00:00Z",
  },
  {
    title: "Mac vs Windows 개발환경",
    content: "개발자분들은 어떤 OS 쓰시나요?",
    createdAt: "2025-04-09T10:00:00Z",
    updatedAt: "2025-04-09T12:00:00Z",
  },
  {
    title: "JS에서 깊은 복사하는 법",
    content: "lodash 말고 직접 구현해보려는데 어려워요.",
    createdAt: "2025-04-08T10:00:00Z",
    updatedAt: "2025-04-08T12:00:00Z",
  },
  {
    title: "자바스크립트 재미있어요",
    content: "처음엔 어렵더니 이제 좀 이해가 되네요!",
    createdAt: "2025-04-07T10:00:00Z",
    updatedAt: "2025-04-07T12:00:00Z",
  },
  {
    title: "알고리즘 스터디 인원 구해요",
    content: "백준 골드 이상 목표입니다.",
    createdAt: "2025-04-06T10:00:00Z",
    updatedAt: "2025-04-06T12:00:00Z",
  },
  {
    title: "취준 스트레스 어떻게 푸세요?",
    content: "면접 앞두고 너무 떨려요ㅠㅠ",
    createdAt: "2025-04-05T10:00:00Z",
    updatedAt: "2025-04-05T12:00:00Z",
  },
  {
    title: "이력서 양식 추천",
    content: "깔끔한 이력서 템플릿 있을까요?",
    createdAt: "2025-04-04T10:00:00Z",
    updatedAt: "2025-04-04T12:00:00Z",
  },
  {
    title: "컴퓨터 책상 추천좀요",
    content: "책상이 너무 작아서 바꾸고 싶은데 추천좀요",
    createdAt: "2025-04-03T10:00:00Z",
    updatedAt: "2025-04-03T12:00:00Z",
  },
  {
    title: "토이프로젝트 아이디어",
    content: "간단하면서도 임팩트 있는 거 없을까요?",
    createdAt: "2025-04-02T10:00:00Z",
    updatedAt: "2025-04-02T12:00:00Z",
  },
  {
    title: "다들 몇 시에 코딩하세요?",
    content: "저는 밤 10시 이후가 집중 잘 되네요.",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-01T12:00:00Z",
  },
  {
    title: "TypeScript 처음 써봤어요",
    content: "처음엔 헷갈리는데 확실히 안정성이 있네요.",
    createdAt: "2025-03-31T10:00:00Z",
    updatedAt: "2025-03-31T12:00:00Z",
  },
  {
    title: "다크모드 vs 라이트모드",
    content: "개발할 땐 다크모드, 눈은 아픈데 멋있어요.",
    createdAt: "2025-03-30T10:00:00Z",
    updatedAt: "2025-03-30T12:00:00Z",
  },
  {
    title: "스터디 장소 추천",
    content: "오프라인으로 모임 가질만한 카페 있을까요?",
    createdAt: "2025-03-29T10:00:00Z",
    updatedAt: "2025-03-29T12:00:00Z",
  },
  {
    title: "프론트엔드 로드맵 공유",
    content: "제가 정리한 로드맵 공유해요. 피드백 환영!",
    createdAt: "2025-03-28T10:00:00Z",
    updatedAt: "2025-03-28T12:00:00Z",
  },
];

// 상품 mock data
const mockProducts = [
  {
    name: "에어팟 프로 2세대",
    description: "거의 새거입니다. 노이즈 캔슬링 잘 됩니다.",
    price: 210000,
    tages: ["전자기기", "이어폰"],
  },
  {
    name: "아이패드 미니 6",
    description: "애플펜슬 2세대와 함께 판매합니다.",
    price: 580000,
    tages: ["태블릿", "애플", "학습용"],
  },
  {
    name: "스탠딩 책상",
    description: "높이 조절 가능하고 상태 좋아요!",
    price: 95000,
    tages: ["가구", "책상", "홈오피스"],
  },
  {
    name: "닌텐도 스위치",
    description: "조이콘 포함, 마리오카트도 함께 드려요.",
    price: 270000,
    tages: ["게임기", "닌텐도", "마리오"],
  },
  {
    name: "LG 그램 14인치",
    description: "출퇴근용으로 사용, 배터리 짱짱합니다.",
    price: 850000,
    tages: ["노트북", "LG", "그램"],
  },
  {
    name: "독서대",
    description: "공부할 때 아주 유용해요. 나무 재질입니다.",
    price: 12000,
    tages: ["문구", "공부", "책상용품"],
  },
  {
    name: "캠핑 의자",
    description: "2개 세트로 팝니다. 접이식입니다.",
    price: 30000,
    tages: ["캠핑", "야외", "의자"],
  },
  {
    name: "샤오미 전동 칫솔",
    description: "미사용 새 제품입니다.",
    price: 18000,
    tages: ["생활용품", "칫솔", "샤오미"],
  },
  {
    name: "소니 블루투스 스피커",
    description: "야외에서 잘 쓰던 제품입니다. 소리 좋아요.",
    price: 55000,
    tages: ["음향기기", "소니", "스피커"],
  },
  {
    name: "한컴타자 연습 책",
    description: "자녀 교육용으로 추천합니다.",
    price: 7000,
    tages: ["도서", "교육", "한글"],
  },
];

// 댓글 mock data
const mockComments = [
  { content: "좋은 정보 감사합니다!" },
  { content: "혹시 사용기간이 어떻게 되실까요?" },
  { content: "Prettier랑 ESLint 추천드려요." },
];

module.exports = {
  mockArticles,
  mockProducts,
  mockComments,
};
