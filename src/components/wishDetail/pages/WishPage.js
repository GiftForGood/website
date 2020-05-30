import React from 'react';
import styled, { css } from 'styled-components';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import WishInformation from '../modules/WishInformation';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import Map from '../modules/Map';
import NpoInformation from '../../postDetails/UserInfoCard';
import { wishes } from '../../../../utils/constants/postType';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import BreadcrumbsPanel from '../../postDetails/BreadcrumbsPanel';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  box-sizing: border-box;
`;

const RightPanel = styled.div`
  padding: 30px 30px 30px 30px;
`;

const LeftPanel = styled.div`
  height: 320px;
  width: 100%;

  ${media.desktop(css`
    width: 100%;
    min-height: 640px;
  `)};
`;

const BreadcrumbsWrapper = styled.div`
  padding: 15px 0px 15px 40px;
`;

const WishPage = ({ wishId, wishDetails, npoDetails, user, prevHref, categoryName }) => {
  const wish = wishDetails;
  const npo = npoDetails;
  const categoryTags = wish.categories.map((category) => category.name);
  const loginUserId = user == null ? '' : user.user.userId;

  return (
    <Wrapper>
      <Desktop>
        <BreadcrumbsWrapper>
          <BreadcrumbsPanel postType={wishes} prevHref={prevHref} categoryName={categoryName} />
        </BreadcrumbsWrapper>
      </Desktop>
      <Grid desktop={{ columns: '1fr 1fr', gap: '10px' }}>
        <LeftPanel id="map">
          <Map
            lat={wish.organization.latitude}
            lng={wish.organization.longitude}
            npoOrgName={wish.organization.name}
            npoOrgAddress={wish.organization.address}
          />
        </LeftPanel>
        <RightPanel>
          <WishInformation
            loginUserId={loginUserId}
            wishUserId={wish.user.userId}
            wishUserName={wish.user.userName}
            profileImageUrl={wish.user.profileImageUrl}
            npoOrgName={wish.organization.name}
            wishId={wishId}
            title={wish.title}
            description={wish.description}
            status={wish.status}
            categoryTags={categoryTags}
          />
          <NpoInformation
            postType={wishes}
            postUserId={wish.user.userId}
            postUserName={wish.user.userName}
            profileImageUrl={wish.user.profileImageUrl}
            npoOrgName={wish.organization.name}
            postUserReviewRating={npo.reviewRating}
            isNpoVerifiedByAdmin={npo.isVerifiedByAdmin}
          />
        </RightPanel>
      </Grid>
    </Wrapper>
  );
};

export default WishPage;
