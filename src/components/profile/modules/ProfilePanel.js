import React from 'react';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';
import { npo } from '../../../../utils/constants/userType';
import ProfileDetails from './ProfileDetails';

const ProfilePanelWrapper = styled.div`
  padding: 30px 25px 30px 30px;
  ${media.desktop(css`
    padding: 50px 25px 30px 40px;
  `)};
`;

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

export default ProfilePanel;
