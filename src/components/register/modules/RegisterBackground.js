import React, { useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';
import { Text, Heading } from '@kiwicom/orbit-components/lib';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { leftRegistrationPanelImagePath } from '../../../../utils/constants/imagePaths';

const Wrapper = styled.div`
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: #111111;
  flex: 1;
  display: block;
  position: relative;
  background-image: url(${leftRegistrationPanelImagePath});
`;

const Content = styled.div`
  position: relative;
  padding: 30px 12px;
  z-index: 10;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;

  :before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #111111;
    opacity: 0.4;
    z-index: -1;
  }

  ${media.largeMobile(css`
    padding: 8% 10%;
  `)};
`;

const RegisterBackground = (props, state) => {
  const { isMediumMobile, isDesktop, isTablet } = useMediaQuery();
  return (
    <>
      {isDesktop || isTablet ? (
        <Wrapper>
          <Content>
            <Heading inverted={true} type={isMediumMobile ? 'display' : 'title2'} spaceAfter="normal">
              Gifting starts with you
            </Heading>
            <Text type="white" size={isMediumMobile ? 'large' : 'normal'}>
              Access our platform to help those in need
            </Text>
          </Content>
        </Wrapper>
      ) : null}
    </>
  );
};
export default RegisterBackground;
