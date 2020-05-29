class WishError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'wish/' + code;
  }
}

export default WishError;
