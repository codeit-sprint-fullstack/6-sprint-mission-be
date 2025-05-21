export const CommentMocks = [
    // ✅ Article당 1개 (총 30개)
    ...Array.from({ length: 30 }, (_, i) => ({
        content: `Article ${i + 1}의 첫 번째 댓글입니다.`,
        userId: ((i + 1) % 15) + 1,
        type: 'article',
        tableId: i + 1,
        articleId: i + 1,
    })),

    // ✅ Product당 2개 (총 60개)
    ...Array.from({ length: 30 }, (_, i) => [
        {
            content: `Product ${i + 1}의 첫 번째 댓글입니다.`,
            userId: ((i + 1) % 15) + 1,
            type: 'product',
            tableId: i + 1,
            productId: i + 1,
        },
        {
            content: `Product ${i + 1}의 두 번째 댓글입니다.`,
            userId: ((i + 2) % 15) + 1,
            type: 'product',
            tableId: i + 1,
            productId: i + 1,
        },
    ]).flat(),
];
