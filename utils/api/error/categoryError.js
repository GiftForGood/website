class CategoryError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'category/' + code;
  }
}

export default CategoryError;
