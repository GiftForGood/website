import React from 'react';

import QnA from '../QnA';

const HowToRegisterAsNpo = () => {
  const question = 'How do I register for a NPO account?';
  const Answer = () => {
    return (
      <>
        <p>
          Click on the ‘Register’ button on the top right and Sign up for an NPO account. You may then fill in the
          details of your organisation and we will verify your account. Once you have received a confirmation email,
          your account is ready for use.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowToRegisterAsNpo;
