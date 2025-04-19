// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 랜덤 추출 도우미 함수
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const titles = [
  "오늘의 다짐",
  "점심 뭐 먹지?",
  "날씨가 너무 좋아요",
  "프론트엔드 공부 중입니다",
  "백엔드는 재미있어요",
  "책 추천 받아요",
  "영화 뭐 볼까요?",
  "React 너무 어렵다",
  "이번 주 목표 공유",
  "코딩 테스트 망했어요",
  "좋은 카페 아시나요?",
  "제주도 여행 후기",
  "사이드 프로젝트 소개",
  "좋은 팀원이 필요해요",
  "개발자 이직 이야기",
  "토이 프로젝트 자랑",
  "오늘의 회고",
  "유익한 강의 추천",
  "오픈소스 기여 후기",
  "포트폴리오 피드백 부탁드려요",
];

const contents = [
  "안녕하세요! 오늘도 열심히 살아봅시다 💪",
  "이런 날은 밖에 나가고 싶어요!",
  "이 기능은 어떻게 구현하는 게 좋을까요?",
  "혹시 이 오류 아시는 분 계신가요?",
  "매일 조금씩 발전하고 싶어요.",
  "좋은 글 잘 보고 갑니다 😊",
  "고민이 많았던 하루였어요.",
  "드디어 이 기능을 완성했어요!",
  "커피 없이는 못 살겠어요 ☕",
  "내일도 화이팅입니다!",
];

const commentSamples = [
  "정말 공감돼요!",
  "좋은 정보 감사합니다 😊",
  "도움이 많이 됐어요.",
  "저도 비슷한 경험이 있어요!",
  "응원할게요!",
  "자세한 설명 감사합니다!",
];

const boardTypes = ["freeboard"];

async function main() {
  console.log("🌱 시드 데이터 20개 생성 중...");

  for (let i = 0; i < 20; i++) {
    const article = await prisma.article.create({
      data: {
        title: titles[i % titles.length],
        content: pickRandom(contents),
        comments: {
          create: [
            {
              content: pickRandom(commentSamples),
              boardType: pickRandom(boardTypes),
            },
            {
              content: pickRandom(commentSamples),
              boardType: pickRandom(boardTypes),
            },
          ],
        },
      },
    });

    console.log(`✅ ${i + 1}번째 게시글 생성 완료`);
  }

  console.log("🎉 총 20개의 시드 데이터 삽입 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 에러 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
