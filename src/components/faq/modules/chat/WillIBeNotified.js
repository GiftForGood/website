import React from 'react';

import QnA from '../QnA';

const WillIBeNotified = () => {
  const question = 'Will I be notified of any new chat messages?';
  const Answer = () => {
    return (
      <>
        <p>Yes. You will receive an email notification for new unread messages.</p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default WillIBeNotified;
