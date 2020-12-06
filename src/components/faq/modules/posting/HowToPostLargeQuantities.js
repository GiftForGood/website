import React from 'react';

import QnA from '../QnA';

const HowToPostLargeQuantities = () => {
  const question = 'How should I list large quantities of items?';
  const Answer = () => {
    return (
      <>
        <p>
          - For wishes, we recommend creating one post per item. You may state the quantity of items you need within the
          description. You only need to complete the post after all quantities of the item have been fulfilled.
          <br />- For Donations, add the quantity amount in either the title or description below.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowToPostLargeQuantities;
