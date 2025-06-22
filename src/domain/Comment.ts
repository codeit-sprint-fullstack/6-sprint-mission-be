interface CommentParams {
  id: number;
  writerId: number;
  articleId: number | null;
  productId: number | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Comment {
  /** ID */
  private _id: number;

  /** 작성자 ID */
  private _writerId: number;

  /** 게시글 ID */
  private _articleId: number | null;

  /** 상품 ID */
  private _productId: number | null;

  /** 내용 */
  private _content: string;

  /** 작성시각 */
  private _createdAt: Date;

  /** 마지막 수정시각 */
  private _updatedAt: Date;

  constructor(param: CommentParams) {
    this._id = param.id;
    this._writerId = param.writerId;
    this._articleId = param.articleId;
    this._productId = param.productId;
    this._content = param.content;
    this._createdAt = param.createdAt;
    this._updatedAt = param.updatedAt;
  }

  getId(): number {
    return this._id;
  }

  getWriterId(): number {
    return this._writerId;
  }

  getArticleId(): number | null {
    return this._articleId;
  }

  getProductId(): number | null {
    return this._productId;
  }

  getContent(): string {
    return this._content;
  }

  getCreatedAt(): Date {
    return this._createdAt;
  }

  getUpdatedAt(): Date {
    return this._updatedAt;
  }
}
