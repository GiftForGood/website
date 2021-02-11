import React from 'react';

import QnA from '../QnA';

const WhoArrangesDelivery = () => {
  const question = 'Who arranges for delivery?';
  const Answer = () => {
    return (
      <>
        <p>
          Please check with the NPO to confirm the delivery arrangement. Depending on the confidentiality of
          beneficiaries' addresses, some NPOs would prefer to arrange the delivery. In cases where NPOs obtain consent
          from beneficiaries to share their addresses, NPOs may require your assistance to arrange for delivery instead.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default WhoArrangesDelivery;
