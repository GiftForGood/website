import { db, firebaseAuth, firebase } from '../firebase';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { USER_CHATS_BATCH_SIZE, CHAT_MESSAGES_BATCH_SIZE } from './constants';
import { wishes, donations } from '../constants/postType';
import { npo, donor } from '../constants/userType';
import { PENDING } from '../constants/postStatus';
import { IMAGE, TEXT, CALENDAR } from '../constants/chatContentType';
import { ON, OFF } from '../constants/chatStatus';
import { ADDED, MODIFIED } from '../constants/chatSubscriptionChange';
import { uploadImage } from './common/images';
import { getCurrentUser } from './common/user';
import ChatError from './error/chatError';

const chatsCollection = db.collection('chats');

class ChatsAPI {
  /**
   * Get a batch of chats for the current logged in user. Does not include chat messages. Only return results of USER_CHATS_BATCH_SIZE
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of chats belonging to the current logged in user
   */
  async getChats(lastQueriedDocument = null) {
    const user = await getCurrentUser();
    if (user === null) {
      throw new ChatError('invalid-user-id');
    }
    const userId = user.uid;
    const userType = await this._getUserTypeInfo(userId);
    const userIdField = `${userType}.id`;

    if (lastQueriedDocument == null) {
      // First page
      return chatsCollection
        .where(userIdField, '==', userId)
        .orderBy('lastMessage.dateTime', 'desc')
        .limit(USER_CHATS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return chatsCollection
        .where(userIdField, '==', userId)
        .orderBy('lastMessage.dateTime', 'desc')
        .startAfter(lastQueriedDocument)
        .limit(USER_CHATS_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get a batch of chats for the current logged in user for a post. Does not include chat messages. Only return results of USER_CHATS_BATCH_SIZE
   * @param {string} postId
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of chats belonging to the current logged in user
   */
  async getChatsForPost(postId, lastQueriedDocument = null) {
    const user = await getCurrentUser();
    if (user === null) {
      throw new ChatError('invalid-user-id');
    }
    const userId = user.uid;
    const userType = await this._getUserTypeInfo(userId);
    const userIdField = `${userType}.id`;

    if (lastQueriedDocument == null) {
      // First page
      return chatsCollection
        .where(userIdField, '==', userId)
        .where('post.id', '==', postId)
        .orderBy('lastMessage.dateTime', 'desc')
        .limit(USER_CHATS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return chatsCollection
        .where(userIdField, '==', userId)
        .where('post.id', '==', postId)
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
   * Subscribe to chats belonging to the current logged in user. Does not include chat messages
   * @param {function(string, object): void} callback The function to call to handle the change in chats.
   * The callback will return a USER_CHATS_BATCH_SIZE of chats belonging to the user on the initial subscription
   * It is recommended to use this function to fetch the first batch of chats and use the getChatsForNPO / getChatsForDonor to get older chats
   *  The first argument is type. The type of change of the chat. Refer to the constant file `chatSubscriptionChange` to see which are the changed provided
   *  The second argument is doc. The firebase document that is changed
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {function} The subscriber function. Needed to unsubscribe from the listener
   */
  async subscribeToChats(callback) {
    const user = await getCurrentUser();
    if (user === null) {
      throw new ChatError('invalid-user-id');
    }
    const userId = user.uid;
    const userType = await this._getUserTypeInfo(userId);
    const userIdField = `${userType}.id`;

    return chatsCollection
      .where(userIdField, '==', userId)
      .orderBy('lastMessage.dateTime', 'desc')
      .limit(USER_CHATS_BATCH_SIZE)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            callback(ADDED, change.doc);
          }
          if (change.type === 'modified') {
            callback(MODIFIED, change.doc);
          }
        });
      });
  }

  /**
   * Subscribe to chats belonging to the current logged in user for a post. Does not include chat messages
   * @param {string} postId. The id of a post that belong to the current logged in user
   * @param {function(string, object): void} callback The function to call to handle the change in chats
   * The callback will also return a USER_CHATS_BATCH_SIZE of chats belonging to the user for a post on the initial subscription
   * It is recommended to use this function to fetch the first batch of chats and use the getChatsForNPO / getChatsForDonor to get older chats
   *  The first argument is type. The type of change of the chat. Refer to the constant file `chatSubscriptionChange` to see which are the changed provided
   *  The second argument is doc. The firebase document that is changed
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {function} The subscriber function. Needed to unsubscribe from the listener
   */
  async subscribeToChatsForPost(postId, callback) {
    const user = await getCurrentUser();
    if (user === null) {
      throw new ChatError('invalid-user-id');
    }
    const userId = user.uid;
    const userType = await this._getUserTypeInfo(userId);
    const userIdField = `${userType}.id`;

    return chatsCollection
      .where(userIdField, '==', userId)
      .where('post.id', '==', postId)
      .orderBy('lastMessage.dateTime', 'desc')
      .limit(USER_CHATS_BATCH_SIZE)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            callback(ADDED, change.doc);
          }
          if (change.type === 'modified') {
            callback(MODIFIED, change.doc);
          }
        });
      });
  }

  /**
   * Unsubscribe from chats. Able to unsubscribe to chat belonging to a user and well as a user post
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
   * Create a single text chat message for a wish without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} wishId The id of the wish
   * @param {string} text A text message
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {object} chatMessageDoc: The firebase document for the create chat message
   */
  async sendInitialTextMessageForWish(wishId, text) {
    const [chat, messages] = await this.sendInitialTextMessagesForWish(wishId, [text]);
    return [chat, messages[0]];
  }

  /**
   * Create a single calendar chat message for a wish without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} wishId The id of the wish
   * @param {string} text A calendar messages
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {object} chatMessageDoc: The firebase document for the create chat message
   */
  async sendInitialCalendarMessageForWish(wishId, calendar) {
    const [chat, messages] = await this.sendInitialCalendarMessagesForWish(wishId, [calendar]);
    return [chat, messages[0]];
  }

  /**
   * Create a single image chat message for a wish without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} wishId The id of the wish
   * @param {object} text A image messages.
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {object} chatMessageDoc: The firebase document for the create chat message
   */
  async sendInitialImageMessageForWish(wishId, image) {
    const [chat, messages] = await this.sendInitialImageMessagesForWish(wishId, [image]);
    return [chat, messages[0]];
  }

  /**
   * Create text chat messages for a wish without an existing chat. It will create a new chat and add the chat messages within it
   * @param {string} wishId The id of the wish
   * @param {array} texts A list of text messages. Messages are created in the order in the list
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {array} chatMessagesDocs: A list of firebase documents of the created chat messages
   */
  async sendInitialTextMessagesForWish(wishId, texts) {
    this._validateChatMessages(TEXT, texts);

    const [chatDoc, donorInfo] = await this._fetchInfoAndCreateChatForWish(wishId);
    const chatInfo = chatDoc.data();
    const chatMessages = await this._sendTextMessages(chatInfo.chatId, texts, chatInfo, donor, donorInfo);
    return [chatDoc, chatMessages];
  }

  /**
   * Create calendar chat messages for a wish without an existing chat. It will create a new chat and add the chat messages within it
   * @param {string} wishId The id of the wish
   * @param {array} calendar A list of calendar messages. Messages are created in the order in the list
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {array} chatMessagesDocs: A list of firebase documents of the created chat messages
   */
  async sendInitialCalendarMessagesForWish(wishId, calendars) {
    this._validateChatMessages(CALENDAR, calendars);

    const [chatDoc, donorInfo] = await this._fetchInfoAndCreateChatForWish(wishId);
    const chatInfo = chatDoc.data();
    const chatMessages = await this._sendCalendarMessages(chatInfo.chatId, calendars, chatInfo, donor, donorInfo);
    return [chatDoc, chatMessages];
  }

  /**
   * Create image chat messages for a wish without an existing chat. It will create a new chat and add the chat messages within it
   * @param {string} wishId The id of the wish
   * @param {array} images A list of image messages. Messages are created in the order in the list
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {array} chatMessagesDocs: A list of firebase documents of the created chat messages
   */
  async sendInitialImageMessagesForWish(wishId, images) {
    this._validateChatMessages(IMAGE, images);

    const [chatDoc, donorInfo] = await this._fetchInfoAndCreateChatForWish(wishId);
    const chatInfo = chatDoc.data();
    const chatMessages = await this._sendImageMessages(chatInfo.chatId, images, chatInfo, donor, donorInfo);
    return [chatDoc, chatMessages];
  }

  /**
   * Create a single text chat message for a donation without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} donationId The id of the donation
   * @param {string} text A text message
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {object} chatMessageDoc: The firebase document for the create chat message
   */
  async sendInitialTextMessageForDonation(donationId, text) {
    const [chat, messages] = await this.sendInitialTextMessagesForDonation(donationId, [text]);
    return [chat, messages[0]];
  }

  /**
   * Create a single calendar chat message for a donation without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} donationId The id of the donation
   * @param {string} text A calendar messages
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {object} chatMessageDoc: The firebase document for the create chat message
   */
  async sendInitialCalendarMessageForDonation(donationId, calendar) {
    const [chat, messages] = await this.sendInitialCalendarMessagesForDonation(donationId, [calendar]);
    return [chat, messages[0]];
  }

  /**
   * Create a single image chat message for a donation without an existing chat. It will create a new chat and add the chat message within it
   * @param {string} donationId The id of the donation
   * @param {object} text A image messages.
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {object} chatMessageDoc: The firebase document for the create chat message
   */
  async sendInitialImageMessageForDonation(donationId, image) {
    const [chat, messages] = await this.sendInitialImageMessagesForDonation(donationId, [image]);
    return [chat, messages[0]];
  }

  /**
   * Create text chat messages for a donation without an existing chat. It will create a new chat and add the chat messages within it
   * @param {string} donationId The id of the donation
   * @param {array} texts A list of text messages. Messages are created in the order in the list
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {array} chatMessagesDocs: A list of firebase documents of the created chat messages
   */
  async sendInitialTextMessagesForDonation(donationId, texts) {
    this._validateChatMessages(TEXT, texts);

    const [chatDoc, npoInfo] = await this._fetchInfoAndCreateChatForDonation(donationId);
    const chatInfo = chatDoc.data();
    const chatMessages = await this._sendTextMessages(chatInfo.chatId, texts, chatInfo, npo, npoInfo);
    return [chatDoc, chatMessages];
  }

  /**
   * Create calendar chat messages for a donation without an existing chat. It will create a new chat and add the chat messages within it
   * @param {string} donationId The id of the donation
   * @param {array} calendar A list of calendar messages. Messages are created in the order in the list
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {array} chatMessagesDocs: A list of firebase documents of the created chat messages
   */
  async sendInitialCalendarMessagesForDonation(donationId, calendars) {
    this._validateChatMessages(CALENDAR, calendars);

    const [chatDoc, npoInfo] = await this._fetchInfoAndCreateChatForDonation(donationId);
    const chatInfo = chatDoc.data();
    const chatMessages = await this._sendCalendarMessages(chatInfo.chatId, calendars, chatInfo, npo, npoInfo);
    return [chatDoc, chatMessages];
  }

  /**
   * Create image chat messages for a donation without an existing chat. It will create a new chat and add the chat messages within it
   * @param {string} donationId The id of the donation
   * @param {array} texts A list of image messages. Messages are created in the order in the list
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} [chatDoc, chatMessageDoc]
   *  {object} chatDoc: The firebase document for the created chat
   *  {array} chatMessagesDocs: A list of firebase documents of the created chat messages
   */
  async sendInitialImageMessagesForDonation(donationId, images) {
    this._validateChatMessages(IMAGE, images);

    const [chatDoc, npoInfo] = await this._fetchInfoAndCreateChatForDonation(donationId);
    const chatInfo = chatDoc.data();
    const chatMessages = await this._sendImageMessages(chatInfo.chatId, images, chatInfo, npo, npoInfo);
    return [chatDoc, chatMessages];
  }

  /**
   * Create a chat message for text. Text message includes regular text and url
   * @param {string} id The id of the chat that tbe message belongs to
   * @param {string} text The text message
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created chat message
   */
  async sendTextMessage(id, text) {
    const messages = await this._sendTextMessages(id, [text]);
    return messages[0];
  }

  /**
   * Create a chat message for calendar
   * @param {string} id The id of the chat that tbe message belongs to
   * @param {string} calendar The calendar message
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created chat message
   */
  async sendCalendarMessage(id, calendar) {
    const messages = await this._sendCalendarMessages(id, [calendar]);
    return messages[0];
  }

  /**
   * Create a chat message for image
   * @param {string} id The id of the chat that tbe message belongs to
   * @param {object} image The image message
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created chat message
   */
  async sendImageMessage(id, image) {
    const messages = await this._sendImageMessages(id, [image]);
    return messages[0];
  }

  /**
   * Create multiple text messages. Text message includes regular text and url
   * @param {string} id The id of the chat that tbe message belongs to
   * @param {array} texts A list of text messages. Messages are created in the order in the list
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of the created chat messages
   */
  async sendTextMessages(id, texts) {
    return this._sendTextMessages(id, texts);
  }

  /**
   * Create multiple calendar messages.
   * @param {string} id The id of the chat that tbe message belongs to
   * @param {array} calendars A list of calendar messages. Messages are created in the order in the list
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of the created chat messages
   */
  async sendCalendarMessages(id, calendars) {
    return this._sendCalendarMessages(id, calendars);
  }

  /**
   * Create multiple image messages.
   * @param {string} id The id of the chat that tbe message belongs to
   * @param {array} images A list of image messages. Messages are created in the order in the list
   * @throws {ChatError}
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of the created chat messages
   */
  async sendImageMessages(id, images) {
    return this._sendImageMessages(id, images);
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
   * Activate a user presence on a chat
   * @param {string} id The id of the chat
   * @param {string} userId The id of the user
   * @throws {ChatError}
   * @throws {FirebaseError}
   */
  async activateUserChatPresence(id, userId) {
    const userChatStatusDatabaseRef = firebase.database().ref(`chatStatuses/${id}/users/${userId}`);
    const userChatStatusFirestoreRef = chatsCollection.doc(id);

    const chatFirebaseSnapshot = await userChatStatusFirestoreRef.get();
    const chat = chatFirebaseSnapshot.data();
    let userType;
    if (chat.donor.id === userId) {
      userType = donor;
    } else if (chat.npo.id === userId) {
      userType = npo;
    } else {
      throw new ChatError('invalid-user-type');
    }

    const isOfflineForDatabase = {
      status: OFF,
      lastActiveDateTime: firebase.database.ServerValue.TIMESTAMP,
    };
    const isOnlineForDatabase = {
      status: ON,
      lastActiveDateTime: firebase.database.ServerValue.TIMESTAMP,
    };
    const isOfflineForFirestore = {
      [`${userType}.status`]: OFF,
      [`${userType}.lastActiveDateTime`]: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const isOnlineForFirestore = {
      [`${userType}.status`]: ON,
      [`${userType}.lastActiveDateTime`]: firebase.firestore.FieldValue.serverTimestamp(),
      [`${userType}.unreadCount`]: 0,
    };

    firebase
      .database()
      .ref('.info/connected')
      .on('value', (snapshot) => {
        if (snapshot.val() == false) {
          userChatStatusFirestoreRef.update(isOfflineForFirestore);
          return;
        }

        userChatStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(() => {
            userChatStatusDatabaseRef.set(isOnlineForDatabase);
            userChatStatusFirestoreRef.update(isOnlineForFirestore);
          });
      });
  }

  /**
   * Deactivate a user presence on a chat
   * @param {string} id The id of the chat
   * @param {string} userId The id of the user
   */
  deactivateUserChatPresence(id, userId) {
    firebase.database().ref('.info/connected').off();
    firebase
      .database()
      .ref('chatStatuses/' + id + '/users/' + userId)
      .set({
        status: OFF,
        lastActiveDateTime: firebase.database.ServerValue.TIMESTAMP,
      });
  }

  /**
   * Subscribe to messages belonging a chat
   * @param {string} id The id of the chat
   * @param {string} userId The id of the user
   * @param {function(object): void} callback The function to call to handle the new chat message
   * It will also return a CHAT_MESSAGES_BATCH_SIZE of chat messages belonging to the chat on the initial subscription
   * It is recommended to use this function to fetch the first batch of chat messages and use the getChatMessages to get older chat messages
   *  The first argument is doc. The firebase document that is changed
   * @throws {FirebaseError}
   * @return {function} The subscriber function. Needed to unsubscribe from the listener
   */
  async subscribeToChatMessages(id, userId, callback) {
    return chatsCollection
      .doc(id)
      .collection('messages')
      .orderBy('dateTime', 'desc')
      .limit(CHAT_MESSAGES_BATCH_SIZE)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          // note that change type `removed`, `added`, `modified` is called for newly sent messages, while change
          // type `added` is only called for loading the first batch of messages
          const data = change.doc.data();
          if (!data.dateTime && snapshot.metadata.hasPendingWrites) {
            return;
          }

          // change type `added` is for loading first batch of messages
          // change type `modified` is for newly sent messages
          // link: https://medium.com/firebase-developers/the-secrets-of-firestore-fieldvalue-servertimestamp-revealed-29dd7a38a82b
          if (change.type === 'modified' || change.type === 'added') {
            callback(change.doc);
          }
        });
      });
  }

  /**
   * Unsubscribe from messages belonging to a chat
   * @param {string} id The id of the chat
   * @param {string} userId The id of the user
   * @param {function} unsubscribeFunction The function to unsubscribe to. It is the function that is returned when subscribing to the chat messages
   * @throws {ChatError}
   */
  async unsubscribeFromChatMessages(id, userId, unsubscribeFunction) {
    if (typeof unsubscribeFunction !== 'function') {
      throw new ChatError('invalid-unsubscribe-function', 'only can unsubscribe using a function');
    }

    unsubscribeFunction();
  }

  async _fetchInfoAndCreateChatForWish(wishId) {
    const [wishInfo, donorInfo] = await Promise.all([this._getWishInfo(wishId), this._getCurrentDonorInfo()]);
    const npoInfo = await this._getNPOInfo(wishInfo.user.userId);
    await this._validateChat(wishInfo.wishId, npoInfo.userId, donorInfo.userId);

    const chatDoc = await this._createChatForWish(wishInfo, npoInfo, donorInfo);
    this._RTDBCreateChatPresence(chatDoc.id, npoInfo, donorInfo);

    return [chatDoc, donorInfo];
  }

  async _createChatForWish(wishInfo, npoInfo, donorInfo) {
    // TODO: Refractor
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
      lastActiveDateTime: firebase.firestore.FieldValue.serverTimestamp(), // However, does not reflect in the current NPO is online
      unreadCount: 0,
      organization: wishInfo.organization,
    };

    const chatDonor = {
      name: donorInfo.name,
      id: donorInfo.userId,
      profileImageUrl: donorInfo.profileImageUrl,
      status: OFF, // By default, status will always be off
      lastActiveDateTime: firebase.firestore.FieldValue.serverTimestamp(),
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

  async _fetchInfoAndCreateChatForDonation(donationId) {
    const [donationInfo, npoInfo] = await Promise.all([this._getDonationInfo(donationId), this._getCurrentNPOInfo()]);
    const donorInfo = await this._getDonorInfo(donationInfo.user.userId);
    await this._validateChat(donationInfo.donationId, npoInfo.userId, donorInfo.userId);

    const chatDoc = await this._createChatForDonation(donationInfo, npoInfo, donorInfo);
    this._RTDBCreateChatPresence(chatDoc.id, npoInfo, donorInfo);

    return [chatDoc, npoInfo];
  }

  async _createChatForDonation(donationInfo, npoInfo, donorInfo) {
    // TODO: Refractor
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
      lastActiveDateTime: firebase.firestore.FieldValue.serverTimestamp(),
      unreadCount: 0,
      organization: npoInfo.organization,
    };

    const chatDonor = {
      name: donationInfo.user.userName,
      id: donationInfo.user.userId,
      profileImageUrl: donationInfo.user.profileImageUrl,
      status: OFF, // By default, status will always be off
      lastActiveDateTime: firebase.firestore.FieldValue.serverTimestamp(), // However, does not reflect in the current donor is online
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

  async _RTDBCreateChatPresence(chatId, npoInfo, donorInfo) {
    const userInfos = {
      [npoInfo.userId]: {
        status: OFF,
        lastActiveDateTime: firebase.database.ServerValue.TIMESTAMP,
      },
      [donorInfo.userId]: {
        status: OFF,
        lastActiveDateTime: firebase.database.ServerValue.TIMESTAMP,
      },
    };

    firebase
      .database()
      .ref('chatStatuses/' + chatId)
      .set({
        users: userInfos,
      });
  }

  async _sendTextMessages(chatId, texts, chatInfo = null, senderType = null, senderInfo = null) {
    this._validateContents(texts);
    this._validateTextContents(TEXT, texts);

    return this._sendChatMessages(chatId, TEXT, texts, chatInfo, senderType, senderInfo);
  }

  async _sendCalendarMessages(chatId, calendars, chatInfo = null, senderType = null, senderInfo = null) {
    this._validateContents(calendars);
    this._validateTextContents(CALENDAR, calendars);

    return this._sendChatMessages(chatId, CALENDAR, calendars, chatInfo, senderType, senderInfo);
  }

  async _sendImageMessages(chatId, images, chatInfo = null, senderType = null, senderInfo = null) {
    this._validateContents(images);
    this._validateImageContents(images);

    const userId = firebaseAuth.currentUser.uid;
    const imageUrls = await this._uploadImages(chatId, userId, images);

    return this._sendChatMessages(chatId, IMAGE, imageUrls, chatInfo, senderType, senderInfo);
  }

  async _sendChatMessages(chatId, contentType, contents, chatInfo, senderType, senderInfo) {
    if (chatInfo === null) {
      const chatDoc = await this.getChat(chatId);
      if (!chatDoc.exists) {
        throw new ChatError('invalid-chat', `chat of ${chatId} does not exist`);
      }
      chatInfo = chatDoc.data();
    }

    let userType = senderType;
    let userInfo = senderInfo;
    if (senderType === null || senderInfo === null) {
      [userType, userInfo] = await this._getCurrentUserTypeAndInfo();
    }

    const chatMessages = await this._createChatMessages(chatId, userType, userInfo, contentType, contents);
    const numberOfMessages = chatMessages.length;
    const lastChatMessage = chatMessages[chatMessages.length - 1].data();
    this._updateChat(chatInfo, userType, numberOfMessages, lastChatMessage);

    return chatMessages;
  }

  async _createChatMessages(chatId, senderType, senderInfo, contentType, contents) {
    const chatMessagesPromise = contents.map((content) => {
      return this._createChatMessage(chatId, senderType, senderInfo, contentType, content);
    });

    return await Promise.all(chatMessagesPromise);
  }

  async _createChatMessage(chatId, senderType, senderInfo, contentType, content) {
    const messageSenderInfo = {
      id: senderInfo.userId,
      name: senderInfo.name,
      profileImageUrl: senderInfo.profileImageUrl,
      type: senderType,
    };

    const data = {
      dateTime: firebase.firestore.FieldValue.serverTimestamp(),
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
      [lastActiveDateTimeField]: firebase.firestore.FieldValue.serverTimestamp(),
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

  async _getUserTypesInfo(id) {
    const snapshot = await db.collection('users').doc(id).get();

    if (!snapshot.exists) {
      throw new ChatError('invalid-user-id', 'user does not exist');
    }

    return snapshot.data();
  }

  async _getUserTypeInfo(id) {
    const snapshot = await db.collection('users').doc(id).get();

    if (!snapshot.exists) {
      throw new ChatError('invalid-user-id', 'user does not exist');
    }

    const userTypes = snapshot.data();
    if (userTypes.type.includes(npo)) {
      return npo;
    } else if (userTypes.type.includes(donor)) {
      return donor;
    } else {
      throw new ChatError('invalid-user-type');
    }
  }

  async _getCurrentUserTypeAndInfo() {
    const user = await getCurrentUser();
    if (user == null) {
      throw new ChatError('invalid-user-id');
    }

    const userId = user.uid;
    const userTypes = await this._getUserTypesInfo(userId);
    let userInfo;
    let userType;
    if (userTypes.type.includes(npo)) {
      userInfo = await this._getNPOInfo(userId);
      userType = npo;
    } else if (userTypes.type.includes(donor)) {
      userInfo = await this._getDonorInfo(userId);
      userType = donor;
    } else {
      throw new ChatError('invalid-user-type');
    }

    return [userType, userInfo];
  }

  async _getCurrentNPOInfo() {
    const user = await getCurrentUser();

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
    const user = await getCurrentUser();

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
    this._validateContents(contents);
    if (contentType === IMAGE) {
      this._validateImageContents(contents);
    } else {
      this._validateTextContents(contentType, contents);
    }
  }

  _validateContents(contents) {
    if (contents.length <= 0) {
      throw new ChatError('invalid-content-length', 'need to have a least one content');
    }
  }

  _validateTextContents(contentType, contents) {
    for (const content of contents) {
      if (typeof content !== 'string') {
        throw new ChatError(
          `invalid-${contentType}`,
          `type of ${contentType} can only be string. ${typeof content} provided`
        );
      }
    }
  }

  _validateImageContents(images) {
    const validExtensions = ['.jpg', '.jpeg', '.png'];

    for (const image of images) {
      if (image === null) {
        throw new ChatError('invalid-image', 'provided image is null');
      }

      if (typeof content === 'string') {
        throw new ChatError('invalid-image-content-specified', 'specified content type of image, but got string');
      }

      const imageExt = path.extname(image.name).toLowerCase();
      if (!validExtensions.includes(imageExt)) {
        throw new ChatError(
          'invalid-image-extension',
          `${imageExt} not allowed. Only ${validExtensions.join(', ')} are valid image extensions`
        );
      }
    }
  }
}

export default ChatsAPI;
