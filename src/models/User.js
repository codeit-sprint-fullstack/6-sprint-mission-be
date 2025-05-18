export class User {
  /** ID */
  _id;

  /** Email */
  _email;

  /** Nickname */
  _nickname;

  /** Image URL */
  _image;

  /** Encrypted Password */
  _encryptedPassword;

  /** Creation Timestamp */
  _createdAt;

  /** Last Update Timestamp */
  _updatedAt;

  constructor(param) {
    this._id = param.id;
    this._email = param.email;
    this._nickname = param.nickname;
    this._image = param.image ?? null;
    this._encryptedPassword = param.encryptedPassword;
    this._createdAt = param.createdAt;
    this._updatedAt = param.updatedAt;
  }

  getId() {
    return this._id;
  }

  getEmail() {
    return this._email;
  }

  getNickname() {
    return this._nickname;
  }

  getImage() {
    return this._image;
  }

  getEncryptedPassword() {
    return this._encryptedPassword;
  }

  getCreatedAt() {
    return this._createdAt;
  }

  getUpdatedAt() {
    return this._updatedAt;
  }
}
