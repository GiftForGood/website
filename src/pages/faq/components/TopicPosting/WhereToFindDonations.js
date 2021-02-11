import React from 'react';

import QnA from '../QnA';

const WhereToFindDonations = () => {
  const question = 'Where can I find the item listing by donors?';
  const Answer = () => {
    return (
      <>
        <p>
          - Using the search bar on top, you can change the dropdown button to “Donations” and searching for items.{' '}
          <br />- On the donation post, you can start a chat with the donor and ask them what you would like to know
          about the item.
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default WhereToFindDonations;
