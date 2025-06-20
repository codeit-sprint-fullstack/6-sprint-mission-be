const prisma = require("./client.prisma");

async function main() {
  await prisma.item.deleteMany();
  await prisma.article.deleteMany();

  const items = [];
  const articles = [];

  for (let i = 1; i <= 10; i++) {
    items.push(
      prisma.item.create({
        data: {
          name: `${i}번째 아이템`,
          description: "좋아요",
          price: i * 10000,
          tags: ["전자"],
        },
      })
    );
  }
  await Promise.all(items);
  for (let i = 1; i <= 10; i++) {
    articles.push(
      prisma.article.create({
        data: {
          title: `${i}번째 아티클`,
          content: "좋아요",
        },
      })
    );
  }
  await Promise.all(articles);
}

main()
  .catch((e) => console.log(e))
  .finally(() => prisma.$disconnect);
