import React from 'react';

import QnA from '../QnA';

const CanIDeletePostHistory = () => {
  const question = 'Can I delete my post history?';
  const Answer = () => {
    return (
      <>
        <p>No, you cannot delete your post history.</p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default CanIDeletePostHistory;
