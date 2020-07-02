import React from 'react';
import { isAuthenticated } from '../utils/authentication/authentication';
import Error from 'next/error';
import ActionPage from '../src/components/action/pages/ActionPage';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

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
  max-width: 700px;

  ${media.largeMobile(css`
    margin-top: 0px;
    width: 60%;
  `)};

  ${media.largeDesktop(css`
    width: 40%;
  `)};
`;

export async function getServerSideProps({ params, req, res, query }) {
  const { mode } = query; // resetPassword, verifyEmail
  const { oobCode, apiKey, continueUrl } = query;
  let isError = true;
  if (mode && oobCode && apiKey) {
    isError = false;
  }
  return {
    props: {
      isError,
      mode,
      oobCode,
      continueUrl,
    },
  };
}

const Action = ({ isError, mode, oobCode, continueUrl }) => {
  if (isError) {
    return <Error statusCode={404} />;
  }

  return (
    <Wrapper>
      <Container>
        <Panel>
          <ActionPage mode={mode} oobCode={oobCode} continueUrl={continueUrl} />
        </Panel>
      </Container>
    </Wrapper>
  );
};

export default Action;
