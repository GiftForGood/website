import React from 'react';
import dynamic from 'next/dynamic';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../utils/authentication/authentication';
import api from '../../utils/api';
import ChatPage from '../../src/components/chat/pages/ChatPage';
import { useRouter } from 'next/router';
import { donations, wishes } from '../../utils/constants/postType';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

/**
 * URL when viewing all of your chats, or viewing all of your chats for a particular post that you created
 *
 * viewing all of your chats: /chat
 * viewing all of your chats for a particular post you created: /chat?postId=[postId]
 * viewing all of your chats, but selected a chat to view its messages: /chat?chatId=[chatId]
 * viewing all of your chats for a particular post you created, but selected a chat: /chat?chatId=[chatId]&postId=[postId]
 */
export async function getServerSideProps({ params, req, res, query }) {
  const user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }

  const chatId = query.chatId ? query.chatId : null;
  const postId = query.postId ? query.postId : null;
  const isViewingChatsForMyPost = postId ? true : false;
  const postType = user.user.donor ? donations : wishes;

  /**
   * Check if logged in user is the post owner, if chats for a particular post is queried
   */
  if (postId) {
    const rawPost = await api[postType].get(postId).catch((err) => console.error(err));
    if (!rawPost.exists) {
      // given postId does not exist
      res.writeHead(302, { Location: '/' });
      res.end();
    }
    const post = rawPost.data();
    if (post.user.userId !== user.user.userId) {
      // logged in user is not the owner
      res.writeHead(302, { Location: '/' });
      res.end();
    }
  }
  return {
    props: {
      chatId,
      postId,
      user,
      isViewingChatsForMyPost,
      postType,
    },
  };
}

const ViewOwnChats = ({ user, chatId, postId, isViewingChatsForMyPost, postType }) => {
  const router = useRouter();
  /**
   * Check if logged in user is part of the chat
   */
  if (chatId) {
    api.chats
      .getChat(chatId)
      .then((rawChat) => {
        console.log(rawChat);
        if (!rawChat.exists) {
          // given chatId does not exist
          router.push('/');
        }
        const chat = rawChat.data();
        if (chat.npo.id !== user.user.userId && chat.donor.id !== user.user.userId) {
          router.push('/');
        }
      })
      .catch((err) => console.error(err));
  }
  return (
    <SessionProvider user={user}>
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

export default ViewOwnChats;
