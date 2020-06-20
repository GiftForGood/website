import React from 'react';
import dynamic from 'next/dynamic';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../utils/authentication/authentication';
import api from '../../utils/api';
import ChatPage from '../../src/components/chat/pages/ChatPage';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

// This is the URL to view your own chats
export async function getServerSideProps({ params, req, res, query }) {
  const user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }

  const postId = query.postId ? query.postId : null;
  const postType = query.postType ? query.postType : null;
  if (!postId || !postType) {
    // postId or postType not provided
    res.writeHead(302, { Location: '/' });
    res.end();
  }

  const rawPost = await api[postType].get(postId).catch((err) => console.error(err));
  // invalid id as post does not exist
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
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <ChatPage user={user} postId={postId} postType={postType} />
    </SessionProvider>
  );
};

export default Chats;
