import React from 'react';

import QnA from '../QnA';

const WhereToViewPostHistory = () => {
  const question = 'Where can I view my post history?';
  const Answer = () => {
    return (
      <>
        <p>
          Click on the profile icon on the top right to view your profile and all your posts, including ongoing,
          completed and deleted posts
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default WhereToViewPostHistory;
