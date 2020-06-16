import React from 'react';
import styled, { css } from 'styled-components';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { donations } from '../../../../utils/constants/postType';
import DonationInformation from '../modules/DonationInformation';
import DonorInformation from '../../postDetails/UserInfoCard';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import BreadcrumbsPanel from '../../postDetails/BreadcrumbsPanel';
import ImagePanel from '../modules/ImagePanel';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  box-sizing: border-box;
`;

const RightPanel = styled.div`
  padding: 30px 30px 30px 30px;
`;

const LeftPanel = styled.div`
  padding-left: 0px;

  ${media.desktop(css`
    padding-left: 40px;
    margin: 0;
  `)};
`;

const BreadcrumbsWrapper = styled.div`
  padding: 15px 0px 15px 40px;
`;

const DonationPage = ({ donationId, donationDetails, donorDetails, user, prevHref, categoryName }) => {
  const donation = donationDetails;
  const donor = donorDetails;
  const categoryTags = donation.categories.map((category) => category.name);
  const loginUserId = user == null ? '' : user.user.userId;

  return (
    <Wrapper>
      <Desktop>
        <BreadcrumbsWrapper>
          <BreadcrumbsPanel postType={donations} prevHref={prevHref} categoryName={categoryName} />
        </BreadcrumbsWrapper>
      </Desktop>
      <Grid desktop={{ columns: 'auto 1fr', gap: '10px' }}>
        <LeftPanel>
          <ImagePanel images={donation.imageUrls} />
        </LeftPanel>
        <RightPanel>
          <DonationInformation
            loginUserId={loginUserId}
            donationUserId={donation.user.userId}
            donationUserName={donation.user.userName}
            profileImageUrl={donation.user.profileImageUrl}
            donationId={donationId}
            title={donation.title}
            description={donation.description}
            status={donation.status}
            dimensions={donation.dimensions}
            itemCondition={donation.itemCondition}
            validPeriodFrom={donation.validPeriodFrom}
            validPeriodTo={donation.validPeriodTo}
            locations={donation.locations}
            categoryTags={categoryTags}
            postUserReviewRating={donor.reviewRating}
          />
          <DonorInformation
            postType={donations}
            postUserId={donation.user.userId}
            postUserName={donation.user.userName}
            profileImageUrl={donation.user.profileImageUrl}
            postUserReviewRating={donor.reviewRating}
          />
        </RightPanel>
      </Grid>
    </Wrapper>
  );
};

export default DonationPage;
