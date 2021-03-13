import React from 'react';

import QnA from '../QnA';

const HowToRegisterAsDonor = () => {
  const question = 'How do I register for a donor account?';
  const Answer = () => {
    return (
      <>
        <p>
          In order to register for a donor account, click ‘Register’ via the https://www.giftforgood.io/ website and
          sign up now. You can either sign up using your google email or any other email to be a donor.{' '}
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowToRegisterAsDonor;
