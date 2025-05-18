const modelType = {
  article: "likes",
  product: "likes",
};

function getSort(model, order = "최신순") {
  const sortOptions = ["최신순", "좋아요순"];

  if (!sortOptions.includes(order))
    throw new Error("'최신순'과 '좋아요순' 중 하나를 선택하세요.");

  if (order === "좋아요순") {
    const likesRef = modelType[model];

    const likes = {
      [likesRef]: {
        _count: "desc",
      },
    };

    return likes;
  } else {
    return { createdAt: "desc" };
  }
}

module.exports = getSort;
