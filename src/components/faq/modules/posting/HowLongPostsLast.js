import React from 'react';

import QnA from '../QnA';

const HowLongPostsLast = () => {
  const question = 'How long will my post stay up on the “Wishes” or Donations” page?';
  const Answer = () => {
    return (
      <>
        <p>
          {' '}
          - For wishes, your post will only be up for 4 weeks, after which you can still see your post on your profile
          page but not on the main Wishes page.
          <br /> - For donations, posts on the donation page will be up for the valid period specified when creating the
          post.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowLongPostsLast;
