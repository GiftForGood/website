import React from 'react';

import QnA from '../QnA';

const HowToUpdateProfile = () => {
  const question = 'How do I update my profile?';
  const Answer = () => {
    return (
      <>
        <p>You may click on your profile picture, “view profile” and the button “edit profile”.</p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowToUpdateProfile;
