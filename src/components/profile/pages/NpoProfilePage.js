import React, { useState, useEffect } from 'react';
import { Stack, Text } from '@kiwicom/orbit-components/lib';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';
import ProfileDetails from '../modules/ProfileDetails';
import ReviewCard from '../modules/ReviewCard';
import ReviewHeader from '../modules/ReviewHeader';
import ProfileHeaderBar from '../modules/ProfileHeaderBar';
import { npo } from '../../../../utils/constants/userType';
import { getTimeDifferenceFromNow } from '../../../../utils/api/time';
import { dummyReviews } from '../../../../utils/dummyData/reviews';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  box-sizing: border-box;
  padding-top: 0px;
  padding-bottom: 30px;
`;

const ProfilePanelWrapper = styled.div`
  padding: 30px 25px 30px 30px;
  ${media.desktop(css`
    padding: 50px 25px 30px 40px;
  `)};
`;

const ReviewCardWrapper = styled.div`
  padding: 0px 30px 0px 30px;
  ${media.desktop(css`
    padding: 0px 100px 0px 100px;
  `)};
`;

const NpoProfilePage = () => {
  const [isShowPastWishes, setIsShowPastWishes] = useState(false);
  const [isShowReviews, setIsShowReviews] = useState(true);

  const ProfilePanel = () => {
    return (
      <ProfilePanelWrapper>
        <ProfileDetails
          profileImageUrl={
            'https://scontent.fsin2-1.fna.fbcdn.net/v/t31.0-8/14068403_10154431080563334_6781105024257460002_o.jpg?_nc_cat=100&_nc_sid=85a577&_nc_ohc=oekhBOFHfEcAX-SCBuZ&_nc_ht=scontent.fsin2-1.fna&oh=09dc538e527423303e582fd0d5fe5e6e&oe=5EF5B4AC'
          }
          npoOrgName={'Funan Pte Ltd.'}
          userRating={5}
          npoOrgAddress={'Blk 3  Choa Chu Kang Grove Singapore  688237'}
          npoContact={'6276 3818'}
          userType={npo}
        />
      </ProfilePanelWrapper>
    );
  };

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

  return (
    <Wrapper>
      <Grid desktop={{ columns: '1fr 5fr' }}>
        <ProfilePanel />
        <Stack>
          <ProfileHeaderBar
            isShowPastWishes={isShowPastWishes}
            isShowReviews={isShowReviews}
            setIsShowPastWishes={setIsShowPastWishes}
            setIsShowReviews={setIsShowReviews}
          />
          {isShowReviews && <ReviewPanel />}
          {isShowPastWishes && <Text>show past wishes</Text>}
        </Stack>
      </Grid>
    </Wrapper>
  );
};

export default NpoProfilePage;
