import React from 'react';

import QnA from '../QnA';

const WhoPaysForDeliveries = () => {
  const question = 'Who will pay for deliveries of the items?';
  const Answer = () => {
    return (
      <>
        <p>
          - We encourage donors to pay for the deliveries through our user education efforts. For example, when donors
          create a post, we have a banner prompting donors to sponsor the delivery of their donations. <br />- We have
          partnered with GOGOX and Red Sun Movers to provide subsidised delivery rates for in-kind donations facilitated
          via GfG <br />- However, if you (as the donor) are unable to cover the delivery costs, do inform the NPOs to
          make the necessary delivery arrangements.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default WhoPaysForDeliveries;
