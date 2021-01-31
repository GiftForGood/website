import React from 'react';

import QnA from '../QnA';

const CanICompleteWish = () => {
  const question = 'Can I complete the wish?';
  const Answer = () => {
    return (
      <>
        <p>
          You can only complete your own “Wishes” post. We recommend that you complete your “Wishes” post after you or
          your client has received the item from the donor. The complete button can be found in the top right corner of
          each chat.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default CanICompleteWish;
