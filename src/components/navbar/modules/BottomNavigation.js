import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import CallToActionButton from '../../buttons/CallToActionButton';
import transition from '@kiwicom/orbit-components/lib/utils/transition';
import { BOTTOMBAR_HEIGHT } from '@constants/navbar';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const BottomNavigationContainer = styled.div`
  bottom: 0px;
  position: fixed;
  padding-bottom: 20px;
  z-index: 700;
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  transition: ${transition(['transform'], 'normal', 'ease-in-out')};
  transform: translate3d(0, ${({ shown }) => (shown ? '0' : `1000px`)}, 0);
`;

const BottomNavigation = () => {
  const [shown, setShown] = useState(true);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);
  const { isDesktop } = useMediaQuery();

  const handleNavigationBarPosition = useCallback(() => {
    const currentScrollPosition =
      window.scrollY || window.pageYOffset || (document.documentElement && document.documentElement.scrollTop);

    if (prevScrollPosition < currentScrollPosition && currentScrollPosition > BOTTOMBAR_HEIGHT) {
      setShown(false);
    } else {
      setShown(true);
    }

    setPrevScrollPosition(currentScrollPosition);
  }, [prevScrollPosition, setShown]);

  useEffect(() => {
    window.addEventListener('scroll', handleNavigationBarPosition);
    return () => {
      window.removeEventListener('scroll', handleNavigationBarPosition);
    };
  });

  if (isDesktop) {
    return null;
  }

  return (
    <BottomNavigationContainer shown={shown}>
      <CallToActionButton rounded />
    </BottomNavigationContainer>
  );
};

export default BottomNavigation;
