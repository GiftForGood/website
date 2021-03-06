import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Stack } from '@kiwicom/orbit-components';
import TopLeftNavigation from './TopLeftNavigation';
import TopRightNavigation from './TopRightNavigation';
import MobileTopNavigation from './MobileTopNavigation';
import styled, { css } from 'styled-components';
import EmailVerificationNavigationBar from './EmailVerificationNavigationBar';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import useUser from '../../session/modules/useUser';
import transition from '@kiwicom/orbit-components/lib/utils/transition';
import NewsNavigationBar from '../modules/NewsNavigationBar';
import { useDispatch } from 'react-redux';
import { setNavbarHeight } from '../actions';
import MobileDrawer from './MobileDrawer';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const TopNavigationBarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  flex-direction: column;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  z-index: 100;
  transition: ${transition(['transform'], 'normal', 'ease-in-out')};
  transform: translate3d(0, ${({ shown, height }) => (shown ? '0' : `-${height}px`)}, 0);

  ${media.tablet(css`
    transform: translate3d(0, ${({ shown, height }) => (shown ? '0' : `-${height}px`)}, 0);
  `)};
`;

const NavigationBarContainer = styled.div`
  background: ${({ theme }) => theme.orbit.paletteWhite};
  box-shadow: ${({ theme }) => theme.orbit.boxShadowFixed};
  display: flex;
  flex-flow: row nowrap;
  padding-left: 12px;
  padding-right: 20px;
  padding-top: 4px;
  padding-bottom: 4px;

  ${media.largeMobile(css`
    padding-top: 10px;
    padding-bottom: 10px;
  `)};
`;

const FakeContainer = styled.div`
  display: flex;
  height: ${(props) => props.height}px;
`;

const TopNavigationBar = ({ showNews, searchDefaultIndex }) => {
  const user = useUser();
  const [showDrawer, setShowDrawer] = useState(false);
  const [shown, setShown] = useState(true);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);
  const dispatch = useDispatch();
  const { isDesktop } = useMediaQuery();

  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  const onHamburgerClick = () => {
    setShowDrawer(true);
  };

  const onHamburgerClose = () => {
    setShowDrawer(false);
  };

  const handleNavigationBarPosition = useCallback(() => {
    const currentScrollPosition =
      window.scrollY || window.pageYOffset || (document.documentElement && document.documentElement.scrollTop);

    if (prevScrollPosition < currentScrollPosition && currentScrollPosition > height) {
      setShown(false);
    } else {
      setShown(true);
    }

    setPrevScrollPosition(currentScrollPosition);
  }, [prevScrollPosition, setShown, height]);

  useEffect(() => {
    window.addEventListener('scroll', handleNavigationBarPosition);
    return () => {
      window.removeEventListener('scroll', handleNavigationBarPosition);
    };
  });

  useEffect(() => {
    setHeight(ref.current.clientHeight);
    dispatch(setNavbarHeight(ref.current.clientHeight));
  });

  return (
    <>
      <TopNavigationBarContainer shown={shown} ref={ref} height={height}>
        <NewsNavigationBar />
        <EmailVerificationNavigationBar />

        <NavigationBarContainer>
          {isDesktop ? (
            <Stack justify="between" spacing="none">
              <TopLeftNavigation />
              <TopRightNavigation />
            </Stack>
          ) : (
            <MobileTopNavigation onHamburgerClick={onHamburgerClick} />
          )}
        </NavigationBarContainer>
      </TopNavigationBarContainer>

      <FakeContainer height={height} />

      <MobileDrawer shown={showDrawer} onClose={onHamburgerClose} />
    </>
  );
};

export default TopNavigationBar;
