import React, { useState, useEffect } from 'react';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';

// components
import { ReviewCard, ReviewHeader } from './components';

// constants and utils
import { getTimeDifferenceFromNow } from '@api/time';
import { dummyReviews } from '@utils/dummyData/reviews';

const ReviewCardWrapper = styled.div`
  padding: 0px 30px 0px 30px;
  ${media.desktop(css`
    padding: 0px 100px 0px 100px;
  `)};
`;

const ReviewPanel = () => {
  const [reviews, setReviews] = useState([{ loading: true }]);
  useEffect(() => {
    setReviews(dummyReviews);
  }, []);
  return (
    <>
      <ReviewHeader userRating={5} numOfReviews={5} />
      <ReviewCardWrapper>
        {reviews.map((review, index) => {
          const timeAgo = getTimeDifferenceFromNow(review.dateTime);
          return (
            <ReviewCard
              key={index}
              isLoading={review.loading || false}
              reviewByImageUrl={review.reviewBy ? review.reviewBy.imageUrl : ''}
              reviewByName={review.reviewBy ? review.reviewBy.name : ''}
              reviewRating={review.rating}
              reviewDescription={review.description}
              reviewDateTime={timeAgo}
            />
          );
        })}
      </ReviewCardWrapper>
    </>
  );
};

export default ReviewPanel;
