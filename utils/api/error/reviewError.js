class ReviewError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'review/' + code;
  }
}

export default ReviewError;
