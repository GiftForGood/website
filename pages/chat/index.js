import React from 'react';
import dynamic from 'next/dynamic';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import api from '@api';
import Error from 'next/error';
import ChatPage from '@components/chat/pages/ChatPage';
import Header from '@components/header';
import { donations, wishes } from '@constants/postType';

const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

/**
 *
 * URL when viewing all chats, creating a new chat or viewing an existing chat for a post
 * Viewing all chats: /chat
 * Viewing chats for a specific post: /chat?postId=[postId]&postType=[postType]
 *
 */
export async function getServerSideProps({ params, req, res, query }) {
  const user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: `/login?redirect=${req.url}` });
    res.end();
  }

  if (!user.user.emailVerified) {
    // user is not email verified
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

  /**
   * Check if logged in user is the post owner, if chats for a particular post is queried
   */
  if (postType && postId) {
    const rawPost = await api[postType].get(postId).catch((err) => console.error(err));
    if (!rawPost.exists) {
      // given postId does not exist
      return {
        props: {
          hasError: true,
        },
      };
    }
    const post = rawPost.data();
    isViewingChatsForMyPost = post.user.userId === user.user.userId;

    if (
      !isViewingChatsForMyPost &&
      ((user.user.donor && postType === donations) || (user.user.npo && postType === wishes))
    ) {
      // creating a new chat, but is donor -> donation, npo -> wishes
      return {
        props: {
          hasError: true,
        },
      };
    }
  }

  return {
    props: {
      postId,
      chatId,
      user,
      isViewingChatsForMyPost,
      postType,
    },
  };
}

const ViewChats = ({ user, postId, chatId, isViewingChatsForMyPost, postType, hasError }) => {
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
        isViewingChatsForMyPost={isViewingChatsForMyPost}
        postType={postType}
      />
    </SessionProvider>
  );
};

export default ViewChats;
