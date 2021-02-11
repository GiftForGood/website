import React from 'react';

import QnA from '../QnA';

const CanIDropOffDonations = () => {
  const question = 'Can I drop off donated items?';
  const Answer = () => {
    return (
      <>
        <p>
          Yes. Before dropping off your items, please check with the NPO on the centre address, opening hours and
          whether there is space to hold your donated items.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default CanIDropOffDonations;
