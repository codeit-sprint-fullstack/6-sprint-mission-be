interface Like {
  userId: number;
}

interface ProductParams {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  likes?: { userId: number }[];
}

export class Product {
  /** ID */
  private _id: number;

  /** 작성자 ID */
  private _ownerId: number;

  /** 상품명 */
  private _name: string;

  /** 상품 설명 */
  private _description: string;

  /** 판매 가격 */
  private _price: number;

  /** 해시 태그 목록 */
  private _tags: string[];

  /** 이미지 목록 */
  private _images: string[];

  /** 생성시각 */
  private _createdAt: Date;

  /** 마지막 수정시각 */
  private _updatedAt: Date;

  /** 좋아요 목록 */
  private _likes: Like[];

  constructor(param: ProductParams) {
    this._id = param.id;
    this._ownerId = param.ownerId;
    this._name = param.name;
    this._description = param.description;
    this._price = param.price;
    this._tags = [...param.tags]; // 깊은 복사
    this._images = [...param.images];
    this._createdAt = param.createdAt;
    this._updatedAt = param.updatedAt;
    this._likes = param.likes ? [...param.likes] : [];
  }

  getId(): number {
    return this._id;
  }

  getOwnerId(): number {
    return this._ownerId;
  }

  getName(): string {
    return this._name;
  }

  getDescription(): string {
    return this._description;
  }

  getPrice(): number {
    return this._price;
  }

  getTags(): string[] {
    return [...this._tags]; // 외부 변경 방지
  }

  getImages(): string[] {
    return [...this._images];
  }

  getCreatedAt(): Date {
    return this._createdAt;
  }

  getUpdatedAt(): Date {
    return this._updatedAt;
  }

  getIsFavorite(userId: number): boolean {
    if (!userId) return false;
    return this._likes.some((like) => like.userId === userId);
  }

  getFavoriteCount(): number {
    return this._likes.length;
  }
}
