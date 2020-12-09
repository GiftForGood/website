import React from 'react';

import QnA from '../QnA';

const WhoCanRegisterAsNpo = () => {
  const question = 'Who can register for a NPO account?';
  const Answer = () => {
    return (
      <>
        <p>
          All local NPOs are welcome to join our platform. Do write in to partnerships@giftforgood.io if you are an NPO
          that has not contacted us before.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default WhoCanRegisterAsNpo;
