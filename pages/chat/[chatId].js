import React from 'react';
import dynamic from 'next/dynamic';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../utils/authentication/authentication';
import { useRouter } from 'next/router';
import api from '../../utils/api';
import ChatPage from '../../src/components/chat/pages/ChatPage';
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
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  const chatId = params.chatId ? params.chatId : null;
  const postId = query.postId ? query.postId : null;
  const postType = query.postType ? query.postType : null;
  let isViewingChatsForMyPost = false;

  if (postId && postId) {
    // Check if post exists
    const rawPost = await api[postType].get(postId).catch((err) => console.error(err));
    if (!rawPost.exists) {
      res.writeHead(302, { Location: '/' });
      res.end();
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

const Chats = ({ user, chatId, postId, postType, isViewingChatsForMyPost }) => {
  const router = useRouter();
  if (chatId) {
    api.chats
      .getChat(chatId)
      .then((rawChat) => {
        // Check if chat exists
        if (!rawChat.exists) {
          router.push('/');
        }
        const chat = rawChat.data();
        // Check if logged in user is part of the chat
        if (chat.npo.id !== user.user.userId && chat.donor.id !== user.user.userId) {
          router.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <SessionProvider user={user}>
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
