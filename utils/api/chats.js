import { db } from '../firebase';

class ChatsAPI {
  /**
   * Create a chat for a wish 
   * @param {string} wishId The id of the wish
   * @param {string} npoId The id of the NPO
   * @param {string} donorId The id of the donor 
   * @throws {FirebaseError}
   * @returns {object} A firebase document of the created chat
   */
  async createChatForWish(wishId, npoId, donorId) {}

  /**
   * Create a chat for a donation
   * @param {string} donationId The id of the donation
   * @param {string} npoId The id of the NPO
   * @param {string} donorId The id of the donor 
   * @throws {ChatError}
   * @returns {object} A firebase document of the created chat
   */
  async createChatForDonation(donationId, npoId, donorId) {}

  /**
   * Get a batch of chats for a NPO. Does not include chat messages, only the chat that belongs to the NPO. Only return results of USER_CHATS_BATCH_SIZE
   * @param {string} id The id of the NPO 
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of chats belonging to a NPO
   */
  async getChatsForNPO(id, lastQueriedDocument) {}

  /**
   * Get a batch of chats for a donor. Does not include chat messages, only the chat that belongs to the donor. Only return results of USER_CHATS_BATCH_SIZE
   * @param {string} id The id of the donor 
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of chats belonging to a donor
   */
  async getChatsForDonor(id, lastQueriedDocument) {}

  /**
   * Create a chat message for a wish without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} wishId The id of the wish
   * @param {string} npoId The id of the NPO
   * @param {string} donorId The id of the donor 
   * @param {string} contentType The type of the message
   * @param {string/object} content The content of the message
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @param {string} senderId The id of the sender that send the message
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created chat message
   */
  async createChatMessageForWish(wishId, npoId, donorId, contentType, content, senderId) {}

  /**
   * Create a chat message for a donation without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} donationId The id of the donation
   * @param {string} npoId The id of the NPO
   * @param {string} donorId The id of the donor 
   * @param {string} contentType The type of the message
   * @param {string/object} content The content of the message
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @param {string} senderId The id of the sender that send the message
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created chat message
   */
  async createChatMessageForDonation(donationId, npoId, donorId, contentType, content, senderId) {}

  /**
   * Create a chat message
   * @param {string} id The id of the chat that tbe message belongs to
   * @param {string} contentType The type of the message
   * @param {string/object} content The content of the message
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @param {string} senderId The id of the sender that send the message
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created chat message
   */
  async createChatMessage(id, contentType, content, senderId) {}

  /**
   * Create create chat messages of the same content type. 
   * @param {string} id The id of the chat that tbe message belongs to
   * @param {string} contentType The type of the message
   * @param {string/object} contents A list of content of the messages
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @param {string} senderId The id of the sender that send the message
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of the created chat messages
   */
  async createChatMessages(id, contentType, contents, senderId) {}

  /**
   * Get a batch of messages belonging to a chat. The messages returned are sort in reversed timestamp. Only return results of CHAT_MESSAGES_BATCH_SIZE
   * @param {string} id The chat id
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of chat messages belonging to a chat
   */
  async getChatMessages(id, lastQueriedDocument) {}

  /**
   * Subscribe to a chat
   * @param {string} id The id of the chat
   * @return {function} The subscriber function. Needed to unsubscribe from the listener 
   */
  async subscribeToChat(id) {}

  /**
   * Unsubscribe from a chat
   * @param {function} func The subscriber function
   */
  async unsubscribeFromChat(func) {}
}

export default ChatsAPI;