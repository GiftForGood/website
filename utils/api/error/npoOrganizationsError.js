class NPOOrganizationsError extends Error {
  constructor(code, message = '') {
    super(message);
    this.name = this.constructor.name;
    this.code = 'npoOrganization/' + code;
  }
}

export default NPOOrganizationsError;
