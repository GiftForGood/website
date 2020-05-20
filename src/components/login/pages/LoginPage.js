import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentPage } from '../selectors';
import { LANDING, NPO_LOGIN, DONOR_LOGIN } from '../utils/SubPages';

import LoginLanding from '../modules/LoginLanding';
import LoginNpo from '../modules/LoginNpo';
import LoginDonor from '../modules/LoginDonor';

import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  box-sizing: border-box;

  ${media.largeMobile(css`
    height: 100vh;
  `)};
`;

const Container = styled.div`
  ${media.largeMobile(css`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  `)};
`;

const Panel = styled.div`
  margin-right: auto;
  margin-left: auto;
  padding-left: 12px;
  padding-right: 12px;
  min-width: 400px;
  margin-top: 50px;
  max-width: 1000px;

  ${media.largeMobile(css`
    margin-top: 0px;
    width: 60%;
  `)};

  ${media.largeDesktop(css`
    width: 40%;
  `)};
`;

const LoginPage = (props, state) => {
  const currentPage = useSelector(getCurrentPage);

  function panel(currentPage) {
    switch (currentPage) {
      case LANDING:
        return <LoginLanding />;
      case NPO_LOGIN:
        return <LoginNpo />;
      case DONOR_LOGIN:
        return <LoginDonor />;
      default:
        return <LoginLanding />;
    }
  }

  return (
    <Wrapper>
      <Container>
        <Panel>{panel(currentPage)}</Panel>
      </Container>
    </Wrapper>
  );
};

export default LoginPage;
