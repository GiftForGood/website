import React from 'react';

import QnA from '../QnA';

const ReopenExpiredWishes = () => {
  const question = 'Can I reopen my expired posts?';
  const Answer = () => {
    return (
      <>
        <p>
          If your request is still ongoing after 4 weeks and you still need the item, you can go on to your profile and
          “Bump” that post.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default ReopenExpiredWishes;
