import React from 'react';

import QnA from '../QnA';

const LimitsOnNumberOfPosts = () => {
  const question = 'Are there any limits to the number of posts?';
  const Answer = () => {
    return (
      <>
        <p>
          There is currently no limit to the number of posts, but keep in mind that your post will only be up for 4
          weeks
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default LimitsOnNumberOfPosts;
