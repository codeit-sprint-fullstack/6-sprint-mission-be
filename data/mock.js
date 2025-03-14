export const productsMockData = Array.from({ length: 100 }, (_, index) => {
  const products = [
    {
      name: '프리미엄 기계식 키보드',
      description:
        '청축 스위치가 장착된 게이밍용 기계식 키보드입니다. RGB 백라이트 기능을 지원합니다.',
      price: 159000,
      tags: ['키보드', '게이밍', '컴퓨터용품'],
      likes: [],
    },
    {
      name: '무선 블루투스 이어버드',
      description:
        '최대 24시간 재생 가능한 고음질 무선 이어버드입니다. 노이즈 캔슬링 기능 탑재.',
      price: 89000,
      tags: ['이어폰', '블루투스', '음향기기'],
      likes: [],
    },
    {
      name: '울트라 와이드 모니터',
      description:
        '34인치 커브드 디스플레이로 몰입감 있는 작업환경을 제공합니다.',
      price: 549000,
      tags: ['모니터', '컴퓨터용품', '사무용품'],
      likes: [],
    },
    {
      name: '스마트 로봇 청소기',
      description:
        'AI 매핑 기술이 적용된 스마트한 로봇청소기입니다. 자동 충전 기능 포함.',
      price: 399000,
      tags: ['가전제품', '청소기', '스마트홈'],
      likes: [],
    },
    {
      name: '프리미엄 커피메이커',
      description:
        '원터치 추출 시스템으로 편리하게 즐기는 홈카페. 온도 조절 기능 포함.',
      price: 279000,
      tags: ['주방가전', '커피', '생활용품'],
      likes: [],
    },
    {
      name: '스마트 워치',
      description: '심박수와 운동량을 측정하는 최신형 스마트워치입니다.',
      price: 299000,
      tags: ['웨어러블', '전자기기', '스마트기기'],
      likes: [],
    },
    {
      name: '게이밍 마우스',
      description: '고성능 센서가 탑재된 프로페셔널 게이밍 마우스입니다.',
      price: 89000,
      tags: ['마우스', '게이밍', '컴퓨터용품'],
      likes: [],
    },
    {
      name: '공기청정기',
      description: '4단계 필터 시스템으로 미세먼지를 99.9% 제거합니다.',
      price: 399000,
      tags: ['가전제품', '공기청정기', '생활가전'],
      likes: [],
    },
    {
      name: '스마트 도어락',
      description:
        '지문인식과 비밀번호로 안전하게 출입할 수 있는 도어락입니다.',
      price: 259000,
      tags: ['보안용품', '스마트홈', '생활용품'],
      likes: [],
    },
    {
      name: '블루투스 스피커',
      description:
        '360도 서라운드 사운드를 지원하는 프리미엄 블루투스 스피커입니다.',
      price: 159000,
      tags: ['스피커', '음향기기', '블루투스'],
      likes: [],
    },
  ];

  // 10개의 기본 제품에서 랜덤하게 선택
  const randomProduct = products[Math.floor(Math.random() * products.length)];

  // 가격 변동을 주기 위해 ±20% 범위 내에서 랜덤 조정
  const priceVariation = randomProduct.price * (0.8 + Math.random() * 0.4);

  return {
    ...randomProduct,
    name: `${randomProduct.name} ${index + 1}호`,
    price: Math.round(priceVariation / 1000) * 1000, // 1000원 단위로 반올림
  };
});
