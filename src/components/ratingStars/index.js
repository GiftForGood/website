// Credits:
// - https://github.com/kiwicom/orbit-components/blob/master/src/RatingStars/index.js

import React from 'react';
import styled from 'styled-components';
import { StarEmpty, StarFull } from '@kiwicom/orbit-components/lib/icons/';

const StyledRatingStars = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-shrink: 0;
  svg {
    flex-shrink: 0;
  }
`;

const RatingStars = ({ rating, size, color, showEmpty }) => {
  const MAX_STARS = 5;
  const ratingRounded = Math.round(rating);
  const starsCount = showEmpty ? MAX_STARS : ratingRounded;
  return (
    <StyledRatingStars>
      {Array(...Array(starsCount)).map((_, index) => {
        const key = `star-${index}`;
        return index <= ratingRounded - 1 ? (
          <StarFull key={key} size={size} customColor={color} />
        ) : (
          <StarEmpty key={key} size={size} color="tertiary" />
        );
      })}
    </StyledRatingStars>
  );
};

export default RatingStars;
