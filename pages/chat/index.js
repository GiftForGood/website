import React from 'react';
import dynamic from 'next/dynamic';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../utils/authentication/authentication';
import api from '../../utils/api';
import Error from 'next/error';
import ChatPage from '../../src/components/chat/pages/ChatPage';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
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
    return {
      props: {
        hasError: true,
      },
    };
  }

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
  }

  return {
    props: {
      postId,
      user,
      isViewingChatsForMyPost,
      postType,
    },
  };
}

const ViewOwnChats = ({ user, postId, isViewingChatsForMyPost, postType, hasError }) => {
  if (hasError) {
    return <Error />;
  }

  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <ChatPage user={user} postId={postId} isViewingChatsForMyPost={isViewingChatsForMyPost} postType={postType} />
    </SessionProvider>
  );
};

export default ViewOwnChats;
