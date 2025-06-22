interface ArticleParams {
  id: number;
  writerId: number;
  title: string;
  content: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  likes: { userId: number }[];
}

export class Article {
  /** ID */
  private _id: number;

  /** 작성자 ID */
  private _writerId: number;

  /** 제목 */
  private _title: string;

  /** 내용 */
  private _content: string;

  /** 이미지 */
  private _image: string | null;

  /** 작성시각 */
  private _createdAt: Date;

  /** 마지막 수정시각 */
  private _updatedAt: Date;

  /** 좋아요 목록 */
  private _likes: { userId: number }[];


    constructor(param: ArticleParams) {
        this._id = param.id;
        this._writerId = param.writerId;
        this._title = param.title;
        this._content = param.content;
        this._image = param.image;
        this._createdAt = param.createdAt;
        this._updatedAt = param.updatedAt;
        this._likes = param.likes;
    }

      getId(): number {
        return this._id;
      }

      getWriterId(): number {
        return this._writerId;
      }

      getTitle(): string {
        return this._title;
      }

      getContent(): string {
        return this._content;
      }

      getImage(): string | null {
        return this._image;
      }

      getCreatedAt(): Date {
        return this._createdAt;
      }

      getUpdatedAt(): Date {
        return this._updatedAt;
      }

      getIsFavorite(userId: number): boolean {
        if (!userId) return false;
        return this._likes.some((like: { userId: number }) => like.userId === userId);
      }

      getFavoriteCount(): number {
        return this._likes.length;
      }
    }