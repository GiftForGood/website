import React from 'react';

import QnA from '../QnA';

const IsMyChatPublic = () => {
  const question = 'Is my chat public?';
  const Answer = () => {
    return (
      <>
        <p>Your chat will be private between yourself and the opposite party.</p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default IsMyChatPublic;
