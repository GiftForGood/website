import React from 'react';

import QnA from '../QnA';

const WhoReceivesDelivery = () => {
  const question = 'Who will receive the delivery?';
  const Answer = () => {
    return (
      <>
        <p>
          The delivery will be either received by the NPO or directly to the beneficiary. This will be up to each
          individual NPOs on delivery address.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default WhoReceivesDelivery;
