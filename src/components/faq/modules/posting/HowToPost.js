import React from 'react';

import QnA from '../QnA';

const HowToPost = () => {
  const question = 'How do I post wishes/donations?';
  const Answer = () => {
    return (
      <>
        <p>
          - Click on the red “Post” button on the top right. <br /> - Fill up the details of your request.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowToPost;
