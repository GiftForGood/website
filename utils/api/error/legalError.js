class LegalError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'legal/' + code;
  }
}

export default LegalError;
