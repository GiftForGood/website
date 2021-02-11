import React from 'react';

import QnA from '../QnA';

const WhoCanRegisterAsDonor = () => {
  const question = 'Who can register for a donor account?';
  const Answer = () => {
    return (
      <>
        <p>
          Anyone can register for a donor account as long as you are interested in donating items to NPOs in Singapore.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default WhoCanRegisterAsDonor;
