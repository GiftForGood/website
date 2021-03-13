import React from 'react';

import QnA from '../QnA';

const HowToReportUser = () => {
  const question = 'How should I report a post or user?';
  const Answer = () => {
    return (
      <>
        <p>Please write in to partnerships@giftforgood.io with a screenshot and we will reply within 3 working days.</p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowToReportUser;
