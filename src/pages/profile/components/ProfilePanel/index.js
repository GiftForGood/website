import React from 'react';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';

// constants
import { npo } from '@constants/userType';

// components
import { ProfileDetails } from './components';

const ProfilePanelWrapper = styled.div`
  padding: 30px 25px 30px 30px;
  ${media.desktop(css`
    padding: 50px 25px 30px 40px;
  `)};
`;

const ProfilePanel = ({ user }) => {
  return (
    <ProfilePanelWrapper>
      <ProfileDetails
        profileImageUrl={user ? user.profileImageUrl : ''}
        npoOrgName={user ? (user.organization ? user.organization.name : '') : ''}
        npoOrgAddress={user ? (user.organization ? user.organization.address : '') : ''}
        npoContact={user ? (user.organization ? user.organization.contact : '') : ''}
        name={user ? user.name : ''}
        isNpoVerifiedByAdmin={user ? user.isVerifiedByAdmin : ''}
        userType={npo}
        npoOrgId={user?.organization?.id}
      />
    </ProfilePanelWrapper>
  );
};

export default ProfilePanel;
