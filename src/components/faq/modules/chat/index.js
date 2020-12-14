import React from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import IsMyChatPublic from './IsMyChatPublic';
import WillIBeNotified from './WillIBeNotified';
import Topic from '../Topic';

const Chat = () => {
  const AllQuestionAndAnswers = () => {
    return (
      <Stack direction="column">
        <IsMyChatPublic />
        <WillIBeNotified />
      </Stack>
    );
  };
  return <Topic title="Chat" contents={<AllQuestionAndAnswers />} />;
};

export default Chat;
