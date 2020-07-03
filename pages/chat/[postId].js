import React from 'react';
import dynamic from 'next/dynamic';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../utils/authentication/authentication';
import api from '../../utils/api';
import { useRouter } from 'next/router';
import ChatPage from '../../src/components/chat/pages/ChatPage';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

/**
 * URL when creating a new chat or viewing an existing chat for another user's post
 * e.g. /chat/[postId]?postType=[postType]
 */
export async function getServerSideProps({ params, req, res, query }) {
  const user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  const postId = params.postId ? params.postId : null;
  const postType = query.postType ? query.postType : null;

  /**
   * Check if both postId and postType is provided
   */
  if (!postId || !postType) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }

  /**
   * Check if post exists
   */
  const rawPost = await api[postType].get(postId).catch((err) => console.error(err));
  if (!rawPost.exists) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }

  return {
    props: {
      postId,
      user,
      postType,
    },
  };
}

const Chats = ({ user, postId, postType }) => {
  const router = useRouter();
  /**
   * Check if chat has already been created for post, if yes, redirect them to /chat?chatId=[chatId]
   */
  api.chats
    .getChatsForPost(postId)
    .then((rawChat) => {
      if (rawChat.exists) {
        const chat = rawChat.docs[0].data(); // assumption: should only have one chat since the chat is for another user's post
        router.push(`/chat/chatId=${chat.chatId}`);
      }
    })
    .catch((err) => console.error(err));

  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <ChatPage user={user} postId={postId} postType={postType} />
    </SessionProvider>
  );
};

export default Chats;
