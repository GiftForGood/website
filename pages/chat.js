import React from 'react';
import dynamic from 'next/dynamic';
import SessionProvider from '../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../utils/authentication/authentication';
import ChatPage from '../src/components/chat/pages/ChatPage';
const TopNavigationBar = dynamic(() => import('../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

export async function getServerSideProps({ params, req, res, query }) {
  const user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  return {
    props: {
      user,
    },
  };
}

const Chat = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <ChatPage user={user} />
    </SessionProvider>
  );
};

export default Chat;
