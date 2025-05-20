// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시딩 시작...");

  // 기존 데이터 삭제 (순서 중요)
  await prisma.articleLike.deleteMany();
  await prisma.articleComment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  기존 데이터 삭제 완료");

  // 사용자 데이터 생성
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "alice@example.com",
        nickname: "앨리스",
        encryptedPassword: await bcrypt.hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        nickname: "밥",
        encryptedPassword: await bcrypt.hash("password123", 10),
      },
    }),
    prisma.user.create({
      data: {
        email: "charlie@example.com",
        nickname: "찰리",
        encryptedPassword: await bcrypt.hash("password123", 10),
      },
    }),
  ]);

  console.log("👥 사용자 데이터 생성 완료");

  // 상품 데이터 생성 (10개) - 모든 이미지 동일
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "맥북 프로 14인치",
        description:
          "2023년 맥북 프로 14인치입니다. M2 Pro 칩셋이 탑재되어 있어 성능이 매우 뛰어납니다. 거의 새것 같은 상태로 판매합니다.",
        price: 2800000,
        images: ["uploads/img_default.png"],
        tags: ["노트북", "애플", "맥북"],
        ownerId: users[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "아이폰 15 프로",
        description:
          "아이폰 15 프로 256GB 딥 퍼플입니다. 액정 보호필름과 케이스 포함해서 판매합니다.",
        price: 1500000,
        images: ["uploads/img_default.png"],
        tags: ["스마트폰", "애플", "아이폰"],
        ownerId: users[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "에어팟 프로 2세대",
        description:
          "에어팟 프로 2세대입니다. 노이즈 캔슬링 기능이 훌륭하고 거의 사용하지 않아서 상태 좋습니다.",
        price: 280000,
        images: ["uploads/img_default.png"],
        tags: ["이어폰", "애플", "블루투스"],
        ownerId: users[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "나이키 에어맥스 270",
        description:
          "나이키 에어맥스 270 245mm입니다. 몇 번만 신어서 깨끗한 상태입니다.",
        price: 120000,
        images: ["uploads/img_default.png"],
        tags: ["운동화", "나이키", "신발"],
        ownerId: users[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "로지텍 MX Keys",
        description:
          "로지텍 무선 키보드 MX Keys입니다. 타자감이 부드럽고 백라이트도 지원합니다.",
        price: 150000,
        images: ["uploads/img_default.png"],
        tags: ["키보드", "로지텍", "무선"],
        ownerId: users[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "갤럭시 워치 6",
        description:
          "삼성 갤럭시 워치 6 클래식 47mm 실버입니다. 거의 새것 같은 상태입니다.",
        price: 350000,
        images: ["uploads/img_default.png"],
        tags: ["스마트워치", "삼성", "갤럭시"],
        ownerId: users[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "아이패드 에어 5세대",
        description:
          "아이패드 에어 5세대 256GB 스타라이트입니다. 애플 펜슬과 키보드 케이스 포함합니다.",
        price: 950000,
        images: ["uploads/img_default.png"],
        tags: ["태블릿", "애플", "아이패드"],
        ownerId: users[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "소니 WH-1000XM5",
        description:
          "소니 무선 헤드폰 WH-1000XM5입니다. 노이즈 캔슬링 최고급 모델이고 상태 좋습니다.",
        price: 380000,
        images: ["uploads/img_default.png"],
        tags: ["헤드폰", "소니", "노이즈캔슬링"],
        ownerId: users[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "닌텐도 스위치 OLED",
        description:
          "닌텐도 스위치 OLED 모델입니다. 젤다의 전설 등 게임 몇 개와 함께 판매합니다.",
        price: 450000,
        images: ["uploads/img_default.png"],
        tags: ["게임기", "닌텐도", "스위치"],
        ownerId: users[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "다이슨 청소기 V15",
        description:
          "다이슨 무선 청소기 V15 디텍트입니다. 레이저로 먼지를 찾아서 청소하는 최신 모델입니다.",
        price: 720000,
        images: ["uploads/img_default.png"],
        tags: ["청소기", "다이슨", "무선"],
        ownerId: users[0].id,
      },
    }),
  ]);

  console.log("🛍️  상품 데이터 생성 완료");

  // 좋아요 데이터 생성 (몇 개 상품에 좋아요 추가)
  await Promise.all([
    prisma.like.create({
      data: {
        userId: users[1].id,
        productId: products[0].id, // 맥북에 좋아요
      },
    }),
    prisma.like.create({
      data: {
        userId: users[2].id,
        productId: products[0].id, // 맥북에 좋아요
      },
    }),
    prisma.like.create({
      data: {
        userId: users[0].id,
        productId: products[1].id, // 아이폰에 좋아요
      },
    }),
    prisma.like.create({
      data: {
        userId: users[2].id,
        productId: products[1].id, // 아이폰에 좋아요
      },
    }),
    prisma.like.create({
      data: {
        userId: users[1].id,
        productId: products[6].id, // 아이패드에 좋아요
      },
    }),
  ]);

  console.log("❤️  좋아요 데이터 생성 완료");

  // 댓글 데이터 생성
  await Promise.all([
    prisma.comment.create({
      data: {
        content: "상태가 정말 좋아 보이네요! 직거래 가능한가요?",
        userId: users[1].id,
        productId: products[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "가격 조금 더 깎아주실 수 있나요?",
        userId: users[2].id,
        productId: products[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "어느 지역에서 거래 가능한지 알 수 있을까요?",
        userId: users[0].id,
        productId: products[8].id,
      },
    }),
  ]);

  console.log("💬 댓글 데이터 생성 완료");

  // 게시글 데이터 생성
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: "프로그래밍 입문자를 위한 추천 책",
        content:
          '안녕하세요! 저는 최근에 개발 공부를 시작했는데요, 입문자에게 정말 도움이 된 책들을 공유하고 싶습니다.\n\n1. "모던 자바스크립트 Deep Dive" - 자바스크립트의 기본 개념부터 고급 내용까지 자세히 설명되어 있어요.\n2. "클린 코드" - 좋은 코드를 작성하는 방법에 대해 배울 수 있습니다.\n3. "HTTP 완벽 가이드" - 웹 개발자라면 꼭 알아야 할 HTTP에 대한 지식을 얻을 수 있어요.\n\n여러분의 추천 책도 댓글로 알려주세요!',
        userId: users[0].id,
      },
    }),
    prisma.article.create({
      data: {
        title: "주말에 가볼만한 서울 근교 여행지 추천",
        content:
          "주말마다 같은 곳만 가기 지루하시죠? 서울에서 1-2시간 거리에 있는 좋은 여행지를 소개합니다.\n\n1. 가평 - 쁘띠프랑스, 아침고요수목원 등 볼거리가 많아요.\n2. 양평 - 두물머리, 세미원 등 자연 경관이 아름다워요.\n3. 인천 영종도 - 바다도 보고 신선한 해산물도 즐길 수 있어요.\n\n다들 어디로 여행 다니시나요? 좋은 장소 있으면 공유해주세요!",
        userId: users[1].id,
      },
    }),
    prisma.article.create({
      data: {
        title: "요즘 인기있는 OTT 드라마 추천해주세요",
        content:
          "안녕하세요, 요즘 시간이 생겨서 재밌는 드라마를 찾고 있어요. 넷플릭스, 디즈니플러스, 티빙 등 어떤 OTT든 상관없어요! 장르는 미스터리나 스릴러를 좋아하는데, 로맨스나 판타지도 재밌으면 괜찮아요. 여러분이 최근에 본 드라마 중 강추하는 것이 있다면 알려주세요!",
        userId: users[2].id,
      },
    }),
    prisma.article.create({
      data: {
        title: "효율적인 공부 방법 공유합니다",
        content:
          "안녕하세요, 저는 대학생인데 몇 가지 효과적인 공부 방법을 공유하고 싶어요.\n\n1. 포모도로 기법 - 25분 집중, 5분 휴식을 반복합니다.\n2. 페인만 기법 - 배운 내용을 마치 다른 사람에게 설명하듯 정리합니다.\n3. 스페이스드 리피티션 - 일정한 간격으로 복습하면 장기 기억에 도움이 됩니다.\n\n여러분만의 공부 비법이 있다면 댓글로 알려주세요!",
        userId: users[0].id,
      },
    }),
    prisma.article.create({
      data: {
        title: "요즘 핫한 맛집 추천 부탁드려요",
        content:
          "서울에 새로 생긴 맛집이나 인기있는 맛집 추천 부탁드려요! 특히 연남동, 홍대, 이태원 쪽에 있는 맛집 정보 찾고 있어요. 분위기 좋고 맛있는 식당이면 어떤 종류든 좋습니다. 최근에 가보신 곳 중에 괜찮은 곳 있으면 알려주세요!",
        userId: users[1].id,
      },
    }),
  ]);

  console.log("📝 게시글 데이터 생성 완료");

  // 게시글 좋아요 데이터 생성
  await Promise.all([
    prisma.articleLike.create({
      data: {
        userId: users[1].id,
        articleId: articles[0].id,
      },
    }),
    prisma.articleLike.create({
      data: {
        userId: users[2].id,
        articleId: articles[0].id,
      },
    }),
    prisma.articleLike.create({
      data: {
        userId: users[0].id,
        articleId: articles[1].id,
      },
    }),
    prisma.articleLike.create({
      data: {
        userId: users[2].id,
        articleId: articles[1].id,
      },
    }),
    prisma.articleLike.create({
      data: {
        userId: users[0].id,
        articleId: articles[2].id,
      },
    }),
    prisma.articleLike.create({
      data: {
        userId: users[1].id,
        articleId: articles[3].id,
      },
    }),
  ]);

  console.log("❤️ 게시글 좋아요 데이터 생성 완료");

  // 게시글 댓글 데이터 생성
  await Promise.all([
    prisma.articleComment.create({
      data: {
        content:
          '저도 "모던 자바스크립트 Deep Dive" 책 정말 추천해요! 기초부터 탄탄하게 잡을 수 있었어요.',
        userId: users[1].id,
        articleId: articles[0].id,
      },
    }),
    prisma.articleComment.create({
      data: {
        content:
          '"You Don\'t Know JS" 시리즈도 정말 좋아요. 자바스크립트 깊이 이해하기에 좋습니다.',
        userId: users[2].id,
        articleId: articles[0].id,
      },
    }),
    prisma.articleComment.create({
      data: {
        content:
          "춘천도 좋은 여행지예요! KTX 타고 1시간이면 가고, 남이섬, 김유정역 등 볼거리가 많답니다.",
        userId: users[0].id,
        articleId: articles[1].id,
      },
    }),
    prisma.articleComment.create({
      data: {
        content:
          '요즘 넷플릭스에서 "오징어 게임" 시즌2 정말 재밌게 보고 있어요. 강추합니다!',
        userId: users[0].id,
        articleId: articles[2].id,
      },
    }),
    prisma.articleComment.create({
      data: {
        content: '티빙의 "환혼" 시리즈도 판타지 좋아하시면 추천드려요.',
        userId: users[1].id,
        articleId: articles[2].id,
      },
    }),
    prisma.articleComment.create({
      data: {
        content:
          "저는 콘셉트 맵핑 방법을 활용하는데 효과가 좋더라고요. 개념들 사이의 관계를 시각화하면 이해가 더 잘 됩니다.",
        userId: users[2].id,
        articleId: articles[3].id,
      },
    }),
  ]);

  console.log("💬 게시글 댓글 데이터 생성 완료");
  console.log("✅ 시딩 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시딩 중 오류 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
