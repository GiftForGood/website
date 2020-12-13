import React from 'react';

import QnA from '../QnA';

const WhatLocationForWishes = () => {
  const question = 'Which location should I use in my “Wishes” post?';
  const Answer = () => {
    return (
      <>
        <p>
          We recommend you to use the address of your centre. We strongly advise against listing your beneficiaries’
          address here. You may inform donors of the beneficiary’s addresses at their consent in a private message.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default WhatLocationForWishes;
