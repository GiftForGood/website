import React from 'react';
import ProfileAvatar from '@components/imageContainers/ProfileAvatar';
import RatingStars from '../../ratingStars';
import styled from 'styled-components';
import { colors } from '@constants/colors';
import { Stack, Text, Separator, Loading } from '@kiwicom/orbit-components/lib';

const ReviewCardContainer = styled.div`
  padding: 0px 20px 0px 20px;
`;

const ReviewCard = ({ isLoading, reviewByImageUrl, reviewByName, reviewRating, reviewDescription, reviewDateTime }) => {
  return (
    <Stack spaceAfter="medium">
      <Separator />
      <ReviewCardContainer>
        <Loading loading={isLoading} text="Please wait, fetching reviews..." type="pageLoader">
          <Stack direction="column" spacing="condensed">
            <Stack direction="row" spacing="condensed">
              <ProfileAvatar imageUrl={reviewByImageUrl} />
              <Stack direction="column" shrink spacing="none">
                <Text>
                  {reviewByName} ∙ {reviewDateTime}
                </Text>
                <RatingStars rating={reviewRating} size="small" color={colors.ratingStarBackground} showEmpty />
              </Stack>
            </Stack>
            <Text>{reviewDescription}</Text>
          </Stack>
        </Loading>
      </ReviewCardContainer>
    </Stack>
  );
};

export default ReviewCard;
