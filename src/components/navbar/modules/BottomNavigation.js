import React from 'react';
import styled from 'styled-components';
import { BOTTOMBAR_HEIGHT } from '@constants/navbar';
import { Stack, Text } from '@kiwicom/orbit-components';
import { AccountCircle, Messages, Plus, StarFull } from '@kiwicom/orbit-components/lib/icons';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { useRouter } from 'next/router';
import useUser from '../../session/modules/useUser';
import {
  logMobilePostDonationToAnalytics,
  logDesktopPostDonationToAnalytics,
  logMobilePostWishToAnalytics,
  logDesktopPostWishToAnalytics,
} from '@utils/analytics';

const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${BOTTOMBAR_HEIGHT}px;
  width: 100%;
  background-color: #ffffff;
  border: #eeeeee;
  border-top-style: solid;
  border-top-width: 0.5px;
  display: flex;
  align-items: center;
  z-index: 100;
`;

const BottomNavContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  width: 100%;
`;

const BottonNavItem = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding: 8px 0;

  :hover {
    background-color: #f5f7f9;
  }
`;

const EmptyRowNav = styled.div`
  height: ${BOTTOMBAR_HEIGHT}px;
`;

const BottomNavigation = () => {
  const { isDesktop } = useMediaQuery();
  const router = useRouter();
  const user = useUser();

  if (isDesktop) {
    return null;
  }

  const handleWishPageClick = () => {
    router.push('/');
  };

  const handleDonationPageClick = () => {
    router.push('/donations');
  };

  const handlePostPageClick = () => {
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

  const handleChatPageClick = () => {
    router.push('/chat');
  };

  const handleProfilePageClick = () => {
    router.push(`/profile/${user.userId}`);
  };

  return (
    <>
      <EmptyRowNav />
      <BottomNav>
        <BottomNavContainer>
          <Stack justify="center" align="center" spacing="none" direction="row">
            <BottonNavItem onClick={handleWishPageClick}>
              <StarFull />
              <Text>Wishes</Text>
            </BottonNavItem>

            <BottonNavItem onClick={handleDonationPageClick}>
              <StarFull />
              <Text>Donations</Text>
            </BottonNavItem>

            {user && (
              <>
                <BottonNavItem onClick={handlePostPageClick}>
                  <Plus />
                  <Text>{user.npo ? 'Post' : 'Donate'}</Text>
                </BottonNavItem>
                <BottonNavItem onClick={handleChatPageClick}>
                  <Messages />
                  <Text>Chat</Text>
                </BottonNavItem>
                <BottonNavItem onClick={handleProfilePageClick}>
                  <AccountCircle />
                  <Text>Me</Text>
                </BottonNavItem>
              </>
            )}
          </Stack>
        </BottomNavContainer>
      </BottomNav>
    </>
  );
};

export default BottomNavigation;
