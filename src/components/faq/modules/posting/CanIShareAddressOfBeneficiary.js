import React from 'react';

import QnA from '../QnA';

const CanIShareAddressOfBeneficiary = () => {
  const question = 'Can I share the address of the beneficiary with the donor?';
  const Answer = () => {
    return (
      <>
        <p>
          If the PDPA guidelines of your organisation allows, you are free to share your address with the donor so that
          he/she can schedule the delivery
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default CanIShareAddressOfBeneficiary;
