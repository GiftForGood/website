import React from 'react';
import dynamic from 'next/dynamic';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../utils/authentication/authentication';
import api from '../../utils/api';
import ChatPage from '../../src/components/chat/pages/ChatPage';
import Error from 'next/error';
import Header from '../../src/components/header';

const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

/**
 *
 * URL when a chat is selected
 * e.g. /chat/[chatId]?postId=[postId]&postType=[postType]
 * postId and postType are used to filter chats based on a post
 *
 */
export async function getServerSideProps({ params, req, res, query }) {
  const user = await isAuthenticated(req, res);
  if (!user) {
    return {
      props: {
        hasError: true,
      },
    };
  }
  const chatId = query.chatId ? query.chatId : null;
  const postId = query.postId ? query.postId : null;
  const postType = query.postType ? query.postType : null;
  let isViewingChatsForMyPost = false;

  if (postId && postType) {
    // Check if post exists
    const rawPost = await api[postType].get(postId).catch((err) => console.error(err));
    if (!rawPost.exists) {
      return {
        props: {
          hasError: true,
        },
      };
    }
    const post = rawPost.data();
    isViewingChatsForMyPost = post.user.userId === user.user.userId;
  }

  return {
    props: {
      chatId,
      postId,
      user,
      postType,
      isViewingChatsForMyPost,
    },
  };
}

const Chats = ({ user, chatId, postId, postType, isViewingChatsForMyPost, hasError }) => {
  if (hasError) {
    return <Error />;
  }

  return (
    <SessionProvider user={user}>
      <Header title="Chats | GiftForGood" />
      <TopNavigationBar />
      <ChatPage
        user={user}
        chatId={chatId}
        postId={postId}
        postType={postType}
        isViewingChatsForMyPost={isViewingChatsForMyPost}
      />
    </SessionProvider>
  );
};

export default Chats;
