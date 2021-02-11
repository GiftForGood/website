import React from 'react';

import QnA from '../QnA';

const HowToBeCorporateDonor = () => {
  const question = 'If I am interested in being a corporate donor, how can I help?';
  const Answer = () => {
    return (
      <>
        <p>
          If you wish to be a corporate donor, do contact us via partnerships@giftforgood.io and we will reply within 3
          working days.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowToBeCorporateDonor;
