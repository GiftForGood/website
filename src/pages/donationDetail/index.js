import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import { DonationInformation, ImagePanel } from './components';
import DonorInformation from '../../components/postDetails/UserInfoCard';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import BreadcrumbsPanel from '../../components/postDetails/BreadcrumbsPanel';

// constants and utils
import { viewedDonationDetails } from '@utils/algolia/insights';
import { donations } from '@constants/postType';
import { donor as donorType, npo as npoType } from '@constants/userType';

// hooks
import useUser from '@components/session/modules/useUser';

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
  const loginUserType = user == null ? '' : user.user.donor ? donorType : npoType;
  const userObject = useUser();

  useEffect(() => {
    viewedDonationDetails(userObject, donationId);
  }, []);

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
            loginUserType={loginUserType}
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
          />
          <DonorInformation
            postType={donations}
            postUserId={donation.user.userId}
            postUserName={donation.user.userName}
            profileImageUrl={donation.user.profileImageUrl}
          />
        </RightPanel>
      </Grid>
    </Wrapper>
  );
};

export default DonationPage;
