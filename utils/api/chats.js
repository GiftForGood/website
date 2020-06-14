import { db, firebaseAuth, firebase } from '../firebase';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { USER_CHATS_BATCH_SIZE, CHAT_MESSAGES_BATCH_SIZE } from './constants';
import { wishes, donations } from '../constants/postType';
import { npo, donor } from '../constants/userType';
import { PENDING } from '../constants/postStatus';
import { IMAGE, TEXT, CALENDAR } from '../constants/chatContentType';
import { ON, OFF } from '../constants/chatStatus';
import { uploadImage } from './common/images';
import ChatError from './error/chatError';

const chatsCollection = db.collection('chats');

class ChatsAPI {
  /**
   * Get a batch of chats for a NPO. Does not include chat messages, only the chat that belongs to the NPO. Only return results of USER_CHATS_BATCH_SIZE
   * @param {string} id The id of the NPO
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of chats belonging to a NPO
   */
  async getChatsForNPO(id, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return chatsCollection
        .where('npo.id', '==', id)
        .orderBy('lastMessage.dateTime', 'desc')
        .limit(USER_CHATS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return chatsCollection
        .where('npo.id', '==', id)
        .orderBy('lastMessage.dateTime', 'desc')
        .startAfter(lastQueriedDocument)
        .limit(USER_CHATS_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get a batch of chats for a donor. Does not include chat messages, only the chat that belongs to the donor. Only return results of USER_CHATS_BATCH_SIZE
   * @param {string} id The id of the donor
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of chats belonging to a donor
   */
  async getChatsForDonor(id, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return chatsCollection
        .where('donor.id', '==', id)
        .orderBy('lastMessage.dateTime', 'desc')
        .limit(USER_CHATS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return chatsCollection
        .where('donor.id', '==', id)
        .orderBy('lastMessage.dateTime', 'desc')
        .startAfter(lastQueriedDocument)
        .limit(USER_CHATS_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get a chat by id. Does not include the chat messages
   * @param {string} id The chat id
   * @throws {FirebaseError}
   * @return {object} A firebase document of the chat
   */
  async getChat(id) {
    return chatsCollection.doc(id).get();
  }

  /**
   * Subscribe to chats belonging to a NPO. Does not include chat messages
   * It will also return a USER_CHATS_BATCH_SIZE of chats belonging to the NPO on the initial subscription
   * It is recommended to use this function to fetch the first batch of chats and use the getChatsForNPO to get older chats
   * @param {string} id The id of the NPO
   * @param {function} callback The function to call to handle the new chat message
   * @throws {FirebaseError}
   * @return {function} The subscriber function. Needed to unsubscribe from the listener
   */
  async subscribeToChatsForNPO(id, callback) {
    return chatsCollection
      .where('npo.id', '==', id)
      .orderBy('lastMessage.dateTime', 'desc')
      .limit(USER_CHATS_BATCH_SIZE)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            callback(change.doc);
          }
        });
      });
  }

  /**
   * Subscribe to chats belonging to a donor. Does nto include chat messages
   * It will also return a USER_CHATS_BATCH_SIZE of chats belonging to the donor on the initial subscription
   * It is recommended to use this function to fetch the first batch of chats and use the getChatsForDonor to get older chats
   * @param {string} id The id of the donor
   * @param {function} callback The function to call to handle the new chat message
   * @throws {FirebaseError}
   * @return {function} The subscriber function. Needed to unsubscribe from the listener
   */
  async subscribeToChatsForDonor(id, callback) {
    return chatsCollection
      .where('donor.id', '==', id)
      .orderBy('lastMessage.dateTime', 'desc')
      .limit(USER_CHATS_BATCH_SIZE)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            callback(change.doc);
          }
        });
      });
  }

  /**
   * Unsubscribe from chats.
   * @param {function} unsubscribeFunction The function to unsubscribe to. It is the function that is returned when subscribing to the chat messages
   * @throws {ChatError}
   */
  async unsubscribeToChats(unsubscribeFunction) {
    if (typeof unsubscribeFunction !== 'function') {
      throw new ChatError('invalid-unsubscribe-function', 'only can unsubscribe using a function');
    }

    unsubscribeFunction();
  }

  /**
   * Create a chat message for a wish without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} wishId The id of the wish
   * @param {string} contentType The type of the message
   * @param {string/object} content The content of the message
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {object} A firebase documents of the created chat message
   */
  async createChatMessageForWish(wishId, contentType, content) {
    this._validateChatMessages(contentType, [content]);

    const [wishInfo, donorInfo] = await Promise.all([this._getWishInfo(wishId), this._getCurrentDonorInfo()]);
    const npoInfo = await this._getNPOInfo(wishInfo.user.userId);
    await this._validateChat(wishInfo.wishId, npoInfo.userId, donorInfo.userId);

    const chatDoc = await this._createChatForWish(wishInfo, npoInfo, donorInfo);
    const chatInfo = chatDoc.data();
    // Assumes that only donor can start a conversation on a wish
    const chatMessage = await this._createChatMessage(chatInfo.chatId, donor, donorInfo, contentType, content);
    this._updateChat(chatInfo, donor, 1, chatMessage.data());

    return chatMessage;
  }

  /**
   * Create chat messages for a wish of the same content type without an existing chat. It will create a new chat and add the chat messages within it
   * @param {string} wishId The id of the wish
   * @param {string} contentType The type of the message
   * @param {array} contents A list of content of the messages. Messages are created in the order in the list
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} A list of firebase documents of the created chat messages
   */
  async createChatMessagesForWish(wishId, contentType, contents) {
    this._validateChatMessages(contentType, contents);

    const [wishInfo, donorInfo] = await Promise.all([this._getWishInfo(wishId), this._getCurrentDonorInfo()]);
    const npoInfo = await this._getNPOInfo(wishInfo.user.userId);
    await this._validateChat(wishInfo.wishId, npoInfo.userId, donorInfo.userId);

    const chatDoc = await this._createChatForWish(wishInfo, npoInfo, donorInfo);
    const chatInfo = chatDoc.data();
    // Assumes that only donor can start a conversation on a wish
    const chatMessages = await this._createChatMessages(chatInfo.chatId, donor, donorInfo, contentType, contents);
    const numberOfMessages = chatMessages.length;
    const lastChatMessage = chatMessages[chatMessages.length - 1].data();
    this._updateChat(chatInfo, donor, numberOfMessages, lastChatMessage);

    return chatMessages;
  }

  /**
   * Create a chat message for a donation without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} donationId The id of the donation
   * @param {string} contentType The type of the message
   * @param {string/object} content The content of the message
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created chat message
   */
  async createChatMessageForDonation(donationId, contentType, content) {
    this._validateChatMessages(contentType, [content]);

    const [donationInfo, npoInfo] = await Promise.all([this._getDonationInfo(donationId), this._getCurrentNPOInfo()]);
    const donorInfo = await this._getDonorInfo(donationInfo.user.userId);
    await this._validateChat(donationInfo.donationId, npoInfo.userId, donorInfo.userId);

    const chatDoc = await this._createChatForDonation(donationInfo, npoInfo, donorInfo);
    const chatInfo = chatDoc.data();
    // Assumes that only npo can start a conversation on a donation
    const chatMessage = await this._createChatMessage(chatInfo.chatId, npo, npoInfo, contentType, content);
    this._updateChat(chatInfo, npo, 1, chatMessage.data());

    return chatMessage;
  }

  /**
   * Create chat messages for a donation of the same content type without an existing chat. It will create a new chat and add the chat messages within it
   * @param {string} donationId The id of the donation
   * @param {string} contentType The type of the message
   * @param {array} contents A list of contents of the messages. Messages are created in the order in the list
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} A list of firebase documents of the created chat messages
   */
  async createChatMessagesForDonation(donationId, contentType, contents) {
    this._validateChatMessages(contentType, contents);

    const [donationInfo, npoInfo] = await Promise.all([this._getDonationInfo(donationId), this._getCurrentNPOInfo()]);
    const donorInfo = await this._getDonorInfo(donationInfo.user.userId);
    await this._validateChat(donationInfo.donationId, npoInfo.userId, donorInfo.userId);

    const chatDoc = await this._createChatForDonation(donationInfo, npoInfo, donorInfo);
    const chatInfo = chatDoc.data();
    // Assumes that only npo can start a conversation on a donation
    const chatMessages = await this._createChatMessages(chatInfo.chatId, npo, npoInfo, contentType, contents);
    const numberOfMessages = chatMessages.length;
    const lastChatMessage = chatMessages[chatMessages.length - 1].data();
    this._updateChat(chatInfo, npo, numberOfMessages, lastChatMessage);

    return chatMessages;
  }

  /**
   * Create a chat message
   * @param {string} id The id of the chat that tbe message belongs to
   * @param {string} contentType The type of the message
   * @param {string/object} content The content of the message
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created chat message
   */
  async createChatMessage(id, contentType, content) {
    this._validateChatMessages(contentType, [content]);

    const userId = firebaseAuth.currentUser.uid;
    const [userTypeInfo, chatDoc] = await Promise.all([this._getCurrentUserInfo(), this.getChat(id)]);
    const userTypes = userTypeInfo.type;
    const chatInfo = chatDoc.data();

    let userInfo;
    let userType;
    if (userTypes.includes(npo)) {
      userInfo = await this._getNPOInfo(userId);
      userType = npo;
    } else if (userTypes.includes(donor)) {
      userInfo = await this._getDonorInfo(userId);
      userType = donor;
    } else {
      throw new ChatError('invalid-user-type');
    }

    const chatMessage = await this._createChatMessage(id, userType, userInfo, contentType, content);
    this._updateChat(chatInfo, userType, 1, chatMessage.data());

    return chatMessage;
  }

  /**
   * Create create chat messages of the same content type.
   * @param {string} id The id of the chat that tbe message belongs to
   * @param {string} contentType The type of the message
   * @param {array} contents A list of content of the messages. Messages are created in the order in the list
   *  string: Represent a text, link or a calendar text
   *  object: Represent a file or and image
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of the created chat messages
   */
  async createChatMessages(id, contentType, contents) {
    this._validateChatMessages(contentType, contents);

    const userId = firebaseAuth.currentUser.uid;
    const [userTypeInfo, chatDoc] = await Promise.all([this._getCurrentUserInfo(), this.getChat(id)]);
    const userTypes = userTypeInfo.type;
    const chatInfo = chatDoc.data();

    let userInfo;
    let userType;
    if (userTypes.includes(npo)) {
      userInfo = await this._getNPOInfo(userId);
      userType = npo;
    } else if (userTypes.includes(donor)) {
      userInfo = await this._getDonorInfo(userId);
      userType = donor;
    } else {
      throw new ChatError('invalid-user-type');
    }

    const chatMessages = await this._createChatMessages(id, userType, userInfo, contentType, contents);
    const numberOfMessages = chatMessages.length;
    const lastChatMessage = chatMessages[chatMessages.length - 1].data();
    this._updateChat(chatInfo, userType, numberOfMessages, lastChatMessage);

    return chatMessages;
  }

  /**
   * Get a batch of messages belonging to a chat. The messages returned are sort in reversed timestamp. Only return results of CHAT_MESSAGES_BATCH_SIZE
   * @param {string} id The chat id
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of chat messages belonging to a chat
   */
  async getChatMessages(id, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return chatsCollection
        .doc(id)
        .collection('messages')
        .orderBy('dateTime', 'desc')
        .limit(CHAT_MESSAGES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return chatsCollection
        .doc(id)
        .collection('messages')
        .orderBy('dateTime', 'desc')
        .startAfter(lastQueriedDocument)
        .limit(CHAT_MESSAGES_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Subscribe to messages belonging a chat
   * It will also return a CHAT_MESSAGES_BATCH_SIZE of chat messages belonging to the chat on the initial subscription
   * It is recommended to use this function to fetch the first batch of chat messages and use the getChatMessages to get older chat messages
   * @param {string} id The id of the chat
   * @param {function} callback The function to call to handle the new chat message
   * @throws {FirebaseError}
   * @return {function} The subscriber function. Needed to unsubscribe from the listener
   */
  async subscribeToChatMessages(id, callback) {
    await this._updateChatStatus(id, ON);

    return chatsCollection
      .doc(id)
      .collection('messages')
      .orderBy('dateTime', 'desc')
      .limit(CHAT_MESSAGES_BATCH_SIZE)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            callback(change.doc);
          }
        });
      });
  }

  /**
   * Unsubscribe from messages belonging to a chat
   * @param {string} id The id of the chat
   * @param {function} unsubscribeFunction The function to unsubscribe to. It is the function that is returned when subscribing to the chat messages
   * @throws {ChatError}
   */
  async unsubscribeFromChatMessages(id, unsubscribeFunction) {
    if (typeof unsubscribeFunction !== 'function') {
      throw new ChatError('invalid-unsubscribe-function', 'only can unsubscribe using a function');
    }

    await this._updateChatStatus(id, OFF);
    unsubscribeFunction();
  }

  async _createChatForWish(wishInfo, npoInfo, donorInfo) {
    if (wishInfo.status !== PENDING) {
      throw new ChatError('invalid-post-status', 'only can start a chat on a pending wish');
    }

    const chatPost = {
      id: wishInfo.wishId,
      title: wishInfo.title,
      status: wishInfo.status,
      type: wishes,
    };

    const chatNPO = {
      name: wishInfo.user.userName,
      id: wishInfo.user.userId,
      profileImageUrl: wishInfo.user.profileImageUrl,
      status: OFF, // By default, status will always be off
      lastActiveDateTime: npoInfo.lastLoggedInDateTime, // However, does not reflect in the current NPO is online
      unreadCount: 0,
      organization: wishInfo.organization,
    };

    const chatDonor = {
      name: donorInfo.name,
      id: donorInfo.userId,
      profileImageUrl: donorInfo.profileImageUrl,
      status: OFF, // By default, status will always be off
      lastActiveDateTime: Date.now(),
      unreadCount: 0,
    };

    let newChat = chatsCollection.doc();
    const data = {
      chatId: newChat.id,
      post: chatPost,
      [npo]: chatNPO,
      [donor]: chatDonor,
    };
    await newChat.set(data);

    return newChat.get();
  }

  async _createChatForDonation(donationInfo, npoInfo, donorInfo) {
    if (donationInfo.status !== PENDING) {
      throw new ChatError('invalid-post-status', 'only can start a chat on a pending donation');
    }

    const chatPost = {
      id: donationInfo.donationId,
      title: donationInfo.title,
      status: donationInfo.status,
      type: donations,
    };

    const chatNPO = {
      name: npoInfo.name,
      id: npoInfo.userId,
      profileImageUrl: npoInfo.profileImageUrl,
      status: OFF, // By default, status will always be off
      lastActiveDateTime: Date.now(),
      unreadCount: 0,
      organization: npoInfo.organization,
    };

    const chatDonor = {
      name: donationInfo.user.userName,
      id: donationInfo.user.userId,
      profileImageUrl: donationInfo.user.profileImageUrl,
      status: OFF, // By default, status will always be off
      lastActiveDateTime: donorInfo.lastLoggedInDateTime, // However, does not reflect in the current donor is online
      unreadCount: 0,
    };

    let newChat = chatsCollection.doc();
    const data = {
      chatId: newChat.id,
      post: chatPost,
      [npo]: chatNPO,
      [donor]: chatDonor,
    };
    await newChat.set(data);

    return newChat.get();
  }

  async _createChatMessages(chatId, senderType, senderInfo, contentType, contents) {
    let imageUrls = [];
    if (contentType === IMAGE) {
      imageUrls = await this._uploadImages(chatId, senderInfo.userId, contents);
    }

    const contentsToUpload = contentType !== IMAGE ? contents : imageUrls;
    const chatMessagesPromise = contentsToUpload.map((contentToUpload) => {
      return this._createMessage(chatId, senderType, senderInfo, contentType, contentToUpload);
    });

    return await Promise.all(chatMessagesPromise);
  }

  async _createChatMessage(chatId, senderType, senderInfo, contentType, content) {
    let imageUrl;
    if (contentType === IMAGE) {
      const imageUrls = await this._uploadImages(chatId, senderInfo.userId, [content]);
      imageUrl = imageUrls[0];
    }

    const contentToUpload = contentType !== IMAGE ? content : imageUrl;
    return this._createMessage(chatId, senderType, senderInfo, contentType, contentToUpload);
  }

  // Assumes that the content are the final content to upload to firestore. e.g. image should be uploaded and given as a string
  async _createMessage(chatId, senderType, senderInfo, contentType, content) {
    const messageSenderInfo = {
      id: senderInfo.userId,
      name: senderInfo.name,
      profileImageUrl: senderInfo.profileImageUrl,
      type: senderType,
    };

    const data = {
      dateTime: Date.now(),
      content: content,
      contentType: contentType,
      sender: messageSenderInfo,
    };

    const chatDoc = chatsCollection.doc(chatId);
    const chatMessageDoc = chatDoc.collection('messages').doc();
    await chatMessageDoc.set(data);

    return chatMessageDoc.get();
  }

  async _updateChat(chatInfo, senderType, numberOfMessages, message) {
    const lastMessage = {
      dateTime: message.dateTime,
      content: message.content,
      contentType: message.contentType,
    };

    const receiverType = this._getReceiverType(senderType);
    const lastActiveDateTimeField = `${senderType}.lastActiveDateTime`;
    const receiverUnreadCountField = `${receiverType}.unreadCount`;
    const receiverStatusField = `${receiverType}.status`;

    let data = {
      [lastActiveDateTimeField]: message.dateTime,
      lastMessage: lastMessage,
    };

    if (chatInfo[receiverType]['status'] != ON) {
      data[receiverUnreadCountField] = firebase.firestore.FieldValue.increment(numberOfMessages);
    }

    chatsCollection.doc(chatInfo.chatId).update(data);
  }

  async _updateChatStatus(id, status) {
    const user = firebaseAuth.currentUser;
    if (user == null) {
      throw new ChatError('invalid-user-id');
    }
    const userId = user.uid;

    const doc = chatsCollection.doc(id);
    const snapshot = await doc.get();
    if (!snapshot.exists) {
      throw new ChatError('invalid-chat-id', 'chat does not exist');
    }
    const chat = snapshot.data();

    let userType;
    if (chat.donor.id === userId) {
      userType = donor;
    } else if (chat.npo.id === userId) {
      userType = npo;
    } else {
      throw new ChatError('invalid-user-type');
    }

    const statusField = `${userType}.status`;
    const unreadCountField = `${userType}.unreadCount`;
    const lastActiveDateTimeField = `${userType}.lastActiveDateTime`;
    let data = {
      [statusField]: status,
      [lastActiveDateTimeField]: Date.now(),
    };

    // Only should read the message when the user is on the chat
    if (status === ON) {
      data[unreadCountField] = 0;
    }

    doc.update(data);
  }

  // Not used at the moment. Might need to use it if we decided to actively managed uses lastActiveDateTimeField
  async _readMessage(chatId, chatInfo, chatMessageInfo) {
    const userId = firebaseAuth.currentUser.uid;
    if (userId === chatMessageInfo.sender.id) {
      return;
    }

    const receiverType = this._getReceiverType(chatMessageInfo.sender.type);
    const unreadCountField = `${receiverType}.unreadCount`;
    const lastActiveDateTimeField = `${receiverType}.lastActiveDateTime`;
    const data = {
      [unreadCountField]: 0,
      [lastActiveDateTimeField]: Date.now(),
    };

    chatsCollection.doc(chatId).update(data);
  }

  async _uploadImages(chatId, senderId, images) {
    let imageInfos = [];
    const pathToUpload = `chats/${chatId}/${senderId}/`;

    for (const image of images) {
      const ext = path.extname(image.name);
      const imageName = `${chatId}_${senderId}_${Date.now()}_${uuidv4()}${ext}`;
      imageInfos.push({ [imageName]: image });
    }

    const imagesPromise = imageInfos.map((imageInfo) => {
      return uploadImage(Object.values(imageInfo)[0], Object.keys(imageInfo)[0], pathToUpload);
    });

    return await Promise.all(imagesPromise);
  }

  _getReceiverType(senderType) {
    if (senderType === npo) {
      return donor;
    } else if (senderType === donor) {
      return npo;
    } else {
      throw new ChatError('invalid-user-type');
    }
  }

  async _getCurrentUserInfo() {
    const user = firebaseAuth.currentUser;

    if (user == null) {
      throw new ChatError('invalid-user-id');
    }

    const userId = user.uid;
    return this._getUserTypeInfo(userId);
  }

  async _getUserTypeInfo(id) {
    const snapshot = await db.collection('users').doc(id).get();

    if (!snapshot.exists) {
      throw new ChatError('invalid-user-id', 'user does not exist');
    }

    return snapshot.data();
  }

  async _getCurrentNPOInfo() {
    const user = firebaseAuth.currentUser;

    if (user == null) {
      throw new ChatError('invalid-user-id');
    }

    const npoId = user.uid;
    return this._getNPOInfo(npoId);
  }

  async _getNPOInfo(id) {
    const snapshot = await db.collection('npos').doc(id).get();

    if (!snapshot.exists) {
      throw new ChatError('invalid-npo-id', 'npo does not exist');
    }

    return snapshot.data();
  }

  async _getCurrentDonorInfo() {
    const user = firebaseAuth.currentUser;

    if (user == null) {
      throw new ChatError('invalid-user-id');
    }

    const donorId = user.uid;
    return this._getDonorInfo(donorId);
  }

  async _getDonorInfo(id) {
    const snapshot = await db.collection('donors').doc(id).get();

    if (!snapshot.exists) {
      throw new ChatError('invalid-donor-id', 'donor does not exist');
    }

    return snapshot.data();
  }

  async _getWishInfo(id) {
    const snapshot = await db.collection('wishes').doc(id).get();

    if (!snapshot.exists) {
      throw new ChatError('invalid-wish-id', 'wish does not exist');
    }

    return snapshot.data();
  }

  async _getDonationInfo(id) {
    const snapshot = await db.collection('donations').doc(id).get();

    if (!snapshot.exists) {
      throw new ChatError('invalid-donation-id', 'donation does not exist');
    }

    return snapshot.data();
  }

  async _validateChat(postId, npoId, donorId) {
    const snapshot = await chatsCollection
      .where('post.id', '==', postId)
      .where('npo.id', '==', npoId)
      .where('donor.id', '==', donorId)
      .get();

    if (!snapshot.empty) {
      throw new ChatError('unable-to-create-chat', 'Chat already exists');
    }
  }

  _validateChatMessages(contentType, contents) {
    this._validateContentType(contentType);
    this._validateContents(contentType, contents);
    if (contentType === IMAGE) {
      this._validateImageExtensions(contents);
    }
  }

  _validateContentType(contentType) {
    const validContentType = [TEXT, IMAGE, CALENDAR];

    if (!validContentType.includes(contentType)) {
      throw new ChatError('invalid-content-type', `Only ${validContentType.join(', ')} are valid content type`);
    }
  }

  _validateContents(contentType, contents) {
    if (contents.length <= 0) {
      throw new ChatError('invalid-content-length', 'need to have a least one content');
    }

    for (const content of contents) {
      if (contentType === IMAGE && typeof content === 'string') {
        throw new ChatError('invalid-content-specified', 'specified content type of image, but got string');
      }

      if (contentType !== IMAGE && typeof content !== 'string') {
        throw new ChatError(
          'invalid-content-specified',
          `specified content type of non-image, but got ${typeof content}`
        );
      }
    }
  }

  _validateImageExtensions(images) {
    const validExtensions = ['.jpg', '.jpeg', '.png'];

    for (const image of images) {
      if (image == null) {
        throw new ChatError('invalid-image', 'provided image is null');
      }

      if (typeof image === 'string') {
        throw new ChatError('invalid-image', 'provided image cannot be type of string');
      }

      const imageExt = path.extname(image.name).toLowerCase();
      if (!validExtensions.includes(imageExt)) {
        throw new ChatError('invalid-image-extension', `Only ${validExtensions.join(', ')} are valid image extensions`);
      }
    }
  }
}

export default ChatsAPI;
