import React from 'react';

import QnA from '../QnA';

const HowToWriteWishDescriptions = () => {
  const question = 'What should I write in my “Wishes” post description?';
  const Answer = () => {
    return (
      <>
        <p>
          - For example your title can be “Biscuits” <br />- In the description you can state that you want the biscuits
          to be “halal, individually-packed” etc
          <br />- If you aren’t sure what details you need to include, we have included a few tips at the bottom to
          guide you in “How you can write better”
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowToWriteWishDescriptions;
