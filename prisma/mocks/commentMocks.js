export const CommentMocks = [
    // Article당 1개 (총 30개)
    {
        content: 'Article 1의 첫 번째 댓글입니다.',
        userId: 1,
        articleId: 1,
    },
    {
        content: 'Article 2의 첫 번째 댓글입니다.',
        userId: 2,
        articleId: 2,
    },
    {
        content: 'Article 3의 첫 번째 댓글입니다.',
        userId: 3,
        articleId: 3,
    },
    {
        content: 'Article 4의 첫 번째 댓글입니다.',
        userId: 4,
        articleId: 4,
    },
    {
        content: 'Article 5의 첫 번째 댓글입니다.',
        userId: 5,
        articleId: 5,
    },
    {
        content: 'Article 6의 첫 번째 댓글입니다.',
        userId: 6,
        articleId: 6,
    },
    {
        content: 'Article 7의 첫 번째 댓글입니다.',
        userId: 7,
        articleId: 7,
    },
    {
        content: 'Article 8의 첫 번째 댓글입니다.',
        userId: 8,
        articleId: 8,
    },
    {
        content: 'Article 9의 첫 번째 댓글입니다.',
        userId: 9,
        articleId: 9,
    },
    {
        content: 'Article 10의 첫 번째 댓글입니다.',
        userId: 10,
        articleId: 10,
    },
    {
        content: 'Article 11의 첫 번째 댓글입니다.',
        userId: 11,
        articleId: 11,
    },
    {
        content: 'Article 12의 첫 번째 댓글입니다.',
        userId: 12,
        articleId: 12,
    },
    {
        content: 'Article 13의 첫 번째 댓글입니다.',
        userId: 13,
        articleId: 13,
    },
    {
        content: 'Article 14의 첫 번째 댓글입니다.',
        userId: 14,
        articleId: 14,
    },
    {
        content: 'Article 15의 첫 번째 댓글입니다.',
        userId: 15,
        articleId: 15,
    },
    {
        content: 'Article 16의 첫 번째 댓글입니다.',
        userId: 1,
        articleId: 16,
    },
    {
        content: 'Article 17의 첫 번째 댓글입니다.',
        userId: 2,
        articleId: 17,
    },
    {
        content: 'Article 18의 첫 번째 댓글입니다.',
        userId: 3,
        articleId: 18,
    },
    {
        content: 'Article 19의 첫 번째 댓글입니다.',
        userId: 4,
        articleId: 19,
    },
    {
        content: 'Article 20의 첫 번째 댓글입니다.',
        userId: 5,
        articleId: 20,
    },
    {
        content: 'Article 21의 첫 번째 댓글입니다.',
        userId: 6,
        articleId: 21,
    },
    {
        content: 'Article 22의 첫 번째 댓글입니다.',
        userId: 7,
        articleId: 22,
    },
    {
        content: 'Article 23의 첫 번째 댓글입니다.',
        userId: 8,
        articleId: 23,
    },
    {
        content: 'Article 24의 첫 번째 댓글입니다.',
        userId: 9,
        articleId: 24,
    },
    {
        content: 'Article 25의 첫 번째 댓글입니다.',
        userId: 10,
        articleId: 25,
    },
    {
        content: 'Article 26의 첫 번째 댓글입니다.',
        userId: 11,
        articleId: 26,
    },
    {
        content: 'Article 27의 첫 번째 댓글입니다.',
        userId: 12,
        articleId: 27,
    },
    {
        content: 'Article 28의 첫 번째 댓글입니다.',
        userId: 13,
        articleId: 28,
    },
    {
        content: 'Article 29의 첫 번째 댓글입니다.',
        userId: 14,
        articleId: 29,
    },
    {
        content: 'Article 30의 첫 번째 댓글입니다.',
        userId: 15,
        articleId: 30,
    },

    // Product당 2개 (총 60개)
    ...Array.from({ length: 30 }, (_, i) => [
        {
            content: `Product ${i + 1}의 첫 번째 댓글입니다.`,
            userId: ((i + 1) % 15) + 1,
            productId: i + 1,
        },
        {
            content: `Product ${i + 1}의 두 번째 댓글입니다.`,
            userId: ((i + 2) % 15) + 1,
            productId: i + 1,
        },
    ]).flat(),
];
