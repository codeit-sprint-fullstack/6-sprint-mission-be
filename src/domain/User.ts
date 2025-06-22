interface UserParams {
  id: number;
  email: string;
  password: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  /** ID */
  private _id: number;

  /** 이메일 */
  private _email: string;

  /** 비밀번호 */
  private _password: string;

  /** 닉네임 */
  private _nickname: string;

  /** 이미지 */
  private _image: string | null

  /** 생성시각 */
  private _createdAt: Date;

  /** 마지막 수정시각 */
  private _updatedAt: Date;

  constructor(param: UserParams) {
    this._id = param.id;
    this._email = param.email;
    this._password = param.password;
    this._nickname = param.nickname;
    this._image = param.image;
    this._createdAt = param.createdAt;
    this._updatedAt = param.updatedAt;
  }

  getId(): number {
    return this._id;
  }

  getEmail(): string {
    return this._email;
  }

  getNickname(): string {
    return this._nickname;
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

  setImage(image: string): void {
    this._image = image;
  }

  setPassword(password: string): void {
    this._password = password;
  }

  checkPassword(password: string): boolean {
    return this._password === password;
  }
}
