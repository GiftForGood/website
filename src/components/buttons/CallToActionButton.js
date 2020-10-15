import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button, Tooltip } from '@kiwicom/orbit-components/';
import { colors } from '@constants/colors';
import useUser from '../session/modules/useUser';
import Verified from '../session/modules/Verified';
import { useRouter } from 'next/router';
import {
  logMobilePostDonationToAnalytics,
  logDesktopPostDonationToAnalytics,
  logMobilePostWishToAnalytics,
  logDesktopPostWishToAnalytics,
} from '@utils/analytics';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { NOT_VERIFIED_MESSAGE_NPO, NOT_VERIFIED_MESSAGE_DONOR } from '@constants/callToActionButton';

const CallToActionButtonStyle = styled.button`
  background: ${colors.donorBackground};
  height: 30px;

  :active {
    background: ${colors.donorHoverActive};
  }

  :hover {
    background: ${colors.donorHoverActive};
  }

  :focus:not(:focus-visible) {
    background: ${colors.donorHoverActive};
    box-shadow: 0 0 0 3px rgba(222, 24, 24, 0.5) ;
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(222, 24, 24, 0.5);
  }
`;

const BottomCallToActionButtonStyle = styled.button`
  background: ${colors.donorBackground};
  height: 40px;
  border-radius: 30px;

  :active {
    background: ${colors.donorHoverActive};
  }

  :hover {
    background: ${colors.donorHoverActive};
  }

  :focus:not(:focus-visible) {
    background: ${colors.donorHoverActive};
    box-shadow: 0 0 0 3px rgba(222, 24, 24, 0.5) ;
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(222, 24, 24, 0.5);
  }
`;

const CallToActionButton = ({ fullWidth, rounded }) => {
  const user = useUser();
  const router = useRouter();
  const { isDesktop } = useMediaQuery();

  const onButtonClick = () => {
    if (user.npo) {
      if (isDesktop) {
        logDesktopPostWishToAnalytics();
      } else {
        logMobilePostWishToAnalytics();
      }
      router.push('/wishes/create');
    } else if (user.donor) {
      if (isDesktop) {
        logDesktopPostDonationToAnalytics();
      } else {
        logMobilePostDonationToAnalytics();
      }
      router.push('/donations/create');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Verified>
      {({ isDisabled }) => (
        <Tooltip content={user.donor ? NOT_VERIFIED_MESSAGE_DONOR : NOT_VERIFIED_MESSAGE_NPO} enabled={isDisabled}>
          <Button
            fullWidth={fullWidth}
            asComponent={rounded ? BottomCallToActionButtonStyle : CallToActionButtonStyle}
            size="normal"
            disabled={isDisabled}
            onClick={onButtonClick}
          >
            {user.donor ? 'Donate' : 'Post'}
          </Button>
        </Tooltip>
      )}
    </Verified>
  );
};

export default CallToActionButton;
