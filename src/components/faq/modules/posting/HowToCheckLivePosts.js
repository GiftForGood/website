import React from 'react';

import QnA from '../QnA';

const HowToCheckLivePosts = () => {
  const question = 'How do I check whether my posts are still live?';
  const Answer = () => {
    return (
      <>
        <p>
          View your profile to check the status of your post. If it is “Ongoing”, your post is still live. If it is
          “Completed” or “Closed”, it is no longer live.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowToCheckLivePosts;
