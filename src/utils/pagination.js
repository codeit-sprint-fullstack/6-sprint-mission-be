function getOffset(query) {
  const offset = parseInt(query.skip, 10) || 0;
  const limit = parseInt(query.take, 10) || 5;

  return { skip: offset, take: limit };
}

function getCursor(query) {
  const cursor = query.cursor;
  const limit = parseInt(query.take) || 3;

  if (cursor) {
    return {
      cursor: { id: cursor },
      limit,
      skip: 1,
    };
  } else {
    return { take: limit };
  }
}

const pagination = { getOffset, getCursor };

module.exports = pagination;
