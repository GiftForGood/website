import React from 'react';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';

// components
import LoginLanding from './components/LoginLanding';
import LoginNpo from './components/LoginNpo';
import LoginDonor from './components/LoginDonor';

// hooks
import { useSelector } from 'react-redux';

// constants and utils
import { LANDING, NPO_LOGIN, DONOR_LOGIN } from './constants';

// redux
import { getCurrentPage } from './redux';

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

const LoginPage = ({ redirectUrlAfterLogin }) => {
  const currentPage = useSelector(getCurrentPage);

  function panel(currentPage) {
    switch (currentPage) {
      case LANDING:
        return <LoginLanding />;
      case NPO_LOGIN:
        return <LoginNpo redirectUrlAfterLogin={redirectUrlAfterLogin} />;
      case DONOR_LOGIN:
        return <LoginDonor redirectUrlAfterLogin={redirectUrlAfterLogin} />;
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
