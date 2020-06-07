import { db, firebaseAuth, firebaseStorage } from '../firebase';
import { wishes, donations } from '../constants/postType';
import ChatError from './error/chatError';

const chatsCollection = db.collection('chats');

class ChatsAPI {
  /**
   * Create a chat for a wish
   * @param {string} wishId The id of the wish
   * @throws {FirebaseError}
   * @returns {object} A firebase document of the created chat
   */
  async createChatForWish(wishId) {}

  /**
   * Create a chat for a donation
   * @param {string} donationId The id of the donation
   * @throws {FirebaseError}
   * @returns {object} A firebase document of the created chat
   */
  async createChatForDonation(donationId) {}

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
   * Subscribe to chats belonging to a NPO. Does not include chat messages
   * @param {string} id The id of the NPO
   * @return {function} The subscriber function. Needed to unsubscribe from the listener
   */
  async subscribeToChatForNPO(id) {}

  /**
   * Subscribe to chats belonging to a donor. Does nto include chat messages
   * @param {string} id The id of the donor
   * @return {function} The subscriber function. Needed to unsubscribe from the listener
   */
  async subscribeToChatForDonor(id) {}

  /**
   * Unsubscribe from chats.  
   * @param {function} func The subscriber function
   */
  async unsubscribeToChat(func) {}

  /**
   * Create a chat message for a wish without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} wishId The id of the wish
   * @param {string} contentType The type of the message
   * @param {string/object} content The content of the message
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @param {string} senderId The id of the sender that send the message
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created chat message
   */
  async createChatMessageForWish(wishId, contentType, content, senderId) {}

  /**
   * Create a chat message for a donation without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} donationId The id of the donation
   * @param {string} contentType The type of the message
   * @param {string/object} content The content of the message
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @param {string} senderId The id of the sender that send the message
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created chat message
   */
  async createChatMessageForDonation(donationId, contentType, content, senderId) {}

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
   * Subscribe to messages belonging a chat
   * @param {string} id The id of the chat
   * @return {function} The subscriber function. Needed to unsubscribe from the listener
   */
  async subscribeToChatMessages(id) {}

  /**
   * Unsubscribe from messages belonging to a chat 
   * @param {function} func The subscriber function
   */
  async unsubscribeFromChatMessages(func) {}
}

export default ChatsAPI;
