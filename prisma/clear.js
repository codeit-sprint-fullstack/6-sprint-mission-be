// prisma/clear.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 기존 데이터 삭제 중...");

  // 댓글 먼저 삭제해야 외래키 제약 조건 충돌이 안 나요
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();

  console.log("✅ 모든 데이터 삭제 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
