import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Stack } from '@kiwicom/orbit-components';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import transition from '@kiwicom/orbit-components/lib/utils/transition';
import { useDispatch } from 'react-redux';
import { setNavbarHeight } from '../actions';
import StaticLeftNavigation from './StaticLeftNavigation';
import MobileDrawer from './MobileDrawer';

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
  const [showDrawer, setShowDrawer] = useState(false);
  const [shown, setShown] = useState(true);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);
  const dispatch = useDispatch();

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
        <NavigationBarContainer>
          <Stack justify="between" spacing="none">
            <StaticLeftNavigation onHamburgerClick={onHamburgerClick} />
          </Stack>
        </NavigationBarContainer>
      </TopNavigationBarContainer>

      <FakeContainer height={height} />

      <MobileDrawer shown={showDrawer} onClose={onHamburgerClose} />
    </>
  );
};

export default TopNavigationBar;
