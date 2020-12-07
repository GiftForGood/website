import React from 'react';

import QnA from '../QnA';

const HowIsNpoVerified = () => {
  const question = 'How are NPOs verified?';
  const Answer = () => {
    return (
      <>
        <p>
          Once you have registered for an account, the admins will verify your account and you will receive a
          confirmation email.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowIsNpoVerified;
