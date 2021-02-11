import React from 'react';

import QnA from '../QnA';

const CanIEditCompletedWishes = () => {
  const question = 'Can I edit my completed posts?';
  const Answer = () => {
    return (
      <>
        <p>No, you cannot edit your completed post.</p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default CanIEditCompletedWishes;
