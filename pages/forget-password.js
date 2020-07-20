import React from 'react';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';
import Header from '../src/components/header';
import ForgetPasswordPage from '../src/components/forgetPassword/pages/ForgetPasswordPage';

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
const ForgetPassword = () => {
  return (
    <Wrapper>
      <Header title="Forget Password | GiftForGood"/>
      <Container>
        <Panel>
          <ForgetPasswordPage />
        </Panel>
      </Container>
    </Wrapper>
  );
};

export default ForgetPassword;
