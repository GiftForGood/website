import React from 'react';

import QnA from '../QnA';

const WhatCanIRequest = () => {
  const question = 'What can I request for on GfG?';
  const Answer = () => {
    return (
      <>
        <p>Items that you require for your organisation/clients’ needs e.g food, clothing, furniture, electronics.</p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default WhatCanIRequest;
