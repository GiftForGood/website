export function setSelectedChatId(chatId) {
  return {
    type: 'chat/SET_SELECTED_CHAT_ID',
    chatId,
  };
}

export function setIsNewChat(isNewChat) {
  return {
    type: 'chat/SET_IS_NEW_CHAT',
    isNewChat,
  };
}

export function setHasError(hasError) {
  return {
    type: 'chat/SET_HAS_ERROR',
    hasError,
  };
}

export function setPostType(postType) {
  return {
    type: 'chat/SET_POST_TYPE',
    postType,
  };
}

export function setPostId(postId) {
  return {
    type: 'chat/SET_POST_ID',
    postId,
  };
}

export function setIsViewingChatsForMyPost(isViewingChatsForMyPost) {
  return {
    type: 'chat/SET_IS_VIEWING_CHATS_FOR_MY_POST',
    isViewingChatsForMyPost,
  };
}

export function setUser(user) {
  return {
    type: 'chat/SET_USER',
    user,
  };
}
