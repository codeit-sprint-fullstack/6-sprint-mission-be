const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 1. 자유게시판 글 10개 생성
  for (let i = 1; i <= 10; i++) {
    await prisma.article.create({
      data: {
        title: `자유게시판 글 ${i}`,
        content: `이것은 자유게시판의 ${i}번째 글입니다.`,
        boardType: 'freeboard',
      },
    })
  }

  // 2. 상품 게시판 글 10개 생성
  for (let i = 1; i <= 10; i++) {
    await prisma.article.create({
      data: {
        title: `상품 게시글 ${i}`,
        content: `이것은 상품 설명 ${i}번입니다.`,
        boardType: 'market',
        price: 10000 + i * 500,
        intro: `상품 ${i}의 간단 소개입니다.`,
        tag: `태그${i}`,
      },
    })
  }

  // 3. 각 게시글에 댓글 추가
  // 모든 게시글 가져오기
  const articles = await prisma.article.findMany();

  // 각 게시글마다 2~5개의 댓글 추가
  for (const article of articles) {
    // 각 게시글마다 랜덤한 댓글 수 생성 (2~5개)
    const commentCount = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 1; i <= commentCount; i++) {
      await prisma.comment.create({
        data: {
          content: `${article.title}에 대한 ${i}번째 댓글입니다. 좋은 게시글이네요!`,
          articleId: article.id
        }
      });
    }
  }
}

main()
  .then(async () => {
    console.log('✅ Seed 완료!')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })