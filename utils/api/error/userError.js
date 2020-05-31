class UserError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'error/' + code;
  }
}

export default UserError;
