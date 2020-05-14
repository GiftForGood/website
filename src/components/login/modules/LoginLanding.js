import React from 'react';
import { withRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Text, Heading, Grid, TextLink, Stack } from '@kiwicom/orbit-components/lib';

import { setIsNpoLogin, setIsDonorLogin } from '../actions';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

import NpoSessionCard from '../../card/NpoSessionCard';
import DonorSessionCard from '../../card/DonorSessionCard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.largeMobile(css`
    height: 100%;
    justify-content: center;
  `)};
`;
const LoginLanding = (props, state) => {
  const dispatch = useDispatch();

  const handleNpoOnClick = () => {
    dispatch(setIsNpoLogin());
  };

  const handleDonorOnClick = () => {
    dispatch(setIsDonorLogin());
  };

  return (
    <Container>
      <Text align="center" as="div">
        <Heading spaceAfter="largest" size="large" weight="bold">
          Login
        </Heading>
        <Text size="large" spaceAfter="large">
          Welcome back.
        </Text>
      </Text>

      <Stack spaceAfter="largest">
        <Grid
          desktop={{
            columns: 'repeat(2, 1fr)',
            gap: '40px',
          }}
          gap="20px"
          spaceAfter="largest"
        >
          <NpoSessionCard onClick={handleNpoOnClick} buttonTitle={'Login'} />
          <DonorSessionCard onClick={handleDonorOnClick} buttonTitle={'Login'} />
        </Grid>
      </Stack>

      <Text>
        Don't have an account?{' '}
        <TextLink href="/register" stopPropagation>
          Register
        </TextLink>
        .
      </Text>
    </Container>
  );
};

export default withRouter(LoginLanding);
