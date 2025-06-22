interface LikeParams {
  id: number;
  userId: number;
  productId: number | null;
  articleId: number | null;
  createdAt: Date;
}

export class Like {
  /** ID */
  private _id: number;

  /** 사용자 ID */
  private _userId: number;

  /** 상품 ID */
  private _productId: number | null;

  /** 게시글 ID */
  private _articleId: number | null;

  /** 생성시각 */
  private _createdAt: Date;

  constructor(param: LikeParams) {
    this._id = param.id;
    this._userId = param.userId;
    this._productId = param.productId;
    this._articleId = param.articleId;
    this._createdAt = param.createdAt;
  }

  getId(): number {
    return this._id;
  }

  getUserId(): number {
    return this._userId;
  }

  getProductId(): number | null {
    return this._productId;
  }

  getArticleId(): number | null {
    return this._articleId;
  }

  getCreatedAt(): Date {
    return this._createdAt;
  }
}
