class ChatError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'chat/' + code;
  }
}

export default ChatError;
