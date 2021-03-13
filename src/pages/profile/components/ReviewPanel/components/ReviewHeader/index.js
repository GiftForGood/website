import React from 'react';
import { Stack, Text, Heading } from '@kiwicom/orbit-components/lib';

const ReviewHeader = ({ userRating, numOfReviews }) => {
  return (
    <Stack direction="row" justify="center" align="center" spacing="condensed">
      <Heading>{userRating.toFixed(2)}</Heading>
      <Text weight="bold">out of 5</Text>
      <Text>{numOfReviews > 1 ? `(${numOfReviews} reviews)` : '(1 review)'}</Text>
    </Stack>
  );
};

export default ReviewHeader;
