import React from 'react';
import styled from 'styled-components';
import { Button } from '@kiwicom/orbit-components/';
import { colors } from '../../../utils/constants/colors';
import useUser from '../session/modules/useUser';

const CallToActionButtonStyle = styled.button`
  background: ${colors.donorBackground};
  height: 30px;

  :active {
    background: ${colors.donorHoverActive};
  }

  :hover {
    background: ${colors.donorHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(222, 24, 24, 0.5);
  }
`;

const CallToActionButton = ({ fullWidth }) => {
  // const user = useUser();
  const user = {
    userId: '1231',
    name: 'Marcus',
    profileImageUrl: '',
    reviewRating: 0,
    hasAcceptedTermsOfService: true,
    isBlocked: false,
    isForcedRefreshRequired: false,
    joinedDateTime: 'now',
    lastLoggedInDateTime: 'now',
    npo: true,
    emailVerified: false,
  };

  const onButtonClick = () => {};
  if (!user) {
    return null;
  }

  return (
    <Button
      fullWidth={fullWidth}
      asComponent={CallToActionButtonStyle}
      size="normal"
      disabled={!user.emailVerified}
      onClick={onButtonClick}
    >
      {user.donor ? 'Donations' : 'Post'}
    </Button>
  );
};

export default CallToActionButton;
