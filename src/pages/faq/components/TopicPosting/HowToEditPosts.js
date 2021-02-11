import React from 'react';

import QnA from '../QnA';

const HowToEditPosts = () => {
  const question = 'How do I edit my active posts?';
  const Answer = () => {
    return (
      <>
        <p>
          Please click into your post. Beside your profile name, you will find a “three vertical dots” button which you
          can click on. You may then click on “edit post”.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowToEditPosts;
