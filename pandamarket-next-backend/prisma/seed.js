import prisma from "./client.js";

async function main() {
  await prisma.comment.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.user.deleteMany({});

  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        nickname: `user${i}`,
        email: `user${i}@naver.com`,
        encryptedPassword: "12345678",
        image: `example.com`,
      },
    });

    await prisma.item.create({
      data: {
        name: `Item ${i}`,
        description: `This is item number ${i}`,
        price: 3000 * i,
        image: `example.com`,
        tags: ["tag1", "tag2"],
        userId: user.id,
      },
    });
  }

  console.log("시드 데이터 생성");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
