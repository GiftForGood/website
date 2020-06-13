import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { Stack, Button } from '@kiwicom/orbit-components/';
import CallToActionButton from '../../buttons/CallToActionButton';

const BottomNavigationContainer = styled.div`
  bottom: 0px;
  position: fixed;
  padding-bottom: 20px;
  z-index: 700;
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
`;

const BottomNavigation = () => {
  return (
    <BottomNavigationContainer>
      <CallToActionButton rounded />
    </BottomNavigationContainer>
  );
};

export default BottomNavigation;
