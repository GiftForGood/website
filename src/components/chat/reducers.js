import initialState from './initialState';

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'chat/SET_SELECTED_CHAT_ID':
      return {
        ...state,
        selectedChatId: action.chatId,
      };

    case 'chat/SET_IS_NEW_CHAT':
      return {
        ...state,
        isNewChat: action.isNewChat,
      };

    case 'chat/SET_HAS_ERROR':
      return {
        ...state,
        hasError: action.hasError,
      };

    case 'chat/SET_POST_TYPE':
      return {
        ...state,
        postType: action.postType,
      };

    case 'chat/SET_POST_ID':
      return {
        ...state,
        postId: action.postId,
      };

    case 'chat/SET_IS_VIEWING_CHATS_FOR_MY_POST':
      return {
        ...state,
        isViewingChatsForMyPost: action.isViewingChatsForMyPost,
      };

    case 'chat/SET_USER':
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
};

export default chatReducer;
