class AuthError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'auth/' + code;
  }
}

export default AuthError;
