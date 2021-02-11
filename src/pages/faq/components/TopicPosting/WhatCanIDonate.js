import React from 'react';

import QnA from '../QnA';

const WhatCanIDonate = () => {
  const question = 'What can I donate on GfG?';
  const Answer = () => {
    return (
      <>
        <p>GfG allows in-kind donations of various items listed below (based on categories)</p>
        <ul>
          <li>Apparel</li>
          <li>Baby Needs</li>
          <li>Electronics</li>
          <li>Food</li>
          <li>Furniture</li>
          <li>Kitchenware</li>
          <li>Medical Equipment</li>
          <li>Personal Protection Equipment</li>
          <li>Sports Equipment</li>
          <li>Stationery</li>
          <li>Toys and Games</li>
        </ul>
      </>
    );
  };

  return <QnA question={question} answer={<Answer />} />;
};

export default WhatCanIDonate;
