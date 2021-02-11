import React from 'react';

import QnA from '../QnA';

const HowItWorks = () => {
  const question = 'How does GiftforGood work?';
  const Answer = () => {
    return (
      <>
        <img src="https://res.cloudinary.com/giftforgood/image/upload/v1600010548/faq/how_does_giftforgood_work_irtf9t.svg" />
        <ol>
          <li>
            Register for an account. (
            <a href="https://www.giftforgood.io/register" target="_blank">
              giftforgood.io/register
            </a>
            )
          </li>
          <li>Post the items that you would like to donate.</li>
          <li>Browse through NPO wishes to find any similar wishes.</li>
          <li>Chat with NPOs to confirm donation details.</li>
        </ol>
        <p>
          *Note:
          <ol>
            <li>Please chat with NPOs first to confirm your donation, before dropping off/delivering any items.</li>
            <li>
              If your item is not found on Wishes page, please be patient and wait for NPOs to respond to your listings.
            </li>
          </ol>
          For more information, please read through FAQs or contact{' '}
          <a href="mailto: hello@giftforgood.io">hello@giftforgood.io</a>
        </p>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default HowItWorks;
