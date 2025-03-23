const prisma = require("./client.prisma");
async function main() {
  // delete existing data first
  console.log("존재하는 게시글 목록 삭제중...");
  await prisma.article.deleteMany();

  // seed mock up articles
  console.log("Seeding articles...");
  const articles = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.article.create({
        data: {
          title: `${i + 1}번째 게시글`,
          content: "와우 너무 재밌다",
        },
      })
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
