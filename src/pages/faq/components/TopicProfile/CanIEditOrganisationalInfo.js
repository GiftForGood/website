import React from 'react';

import QnA from '../QnA';

const CanIEditOrganisationalInfo = () => {
  const question = 'Can I edit my organisational information?';
  const Answer = () => {
    return (
      <>
        <p>
          NPO users are currently not able to edit their organisational information. Please write in to
          partnerships@giftforgood.io with your proposed edits and we will reply within 3 business days.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default CanIEditOrganisationalInfo;
