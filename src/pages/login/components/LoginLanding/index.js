import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
import { Text, Heading, Grid, TextLink, Stack } from '@kiwicom/orbit-components/lib';
import Image from 'next/image';
import NpoSessionCard from '@components/card/NpoSessionCard';
import DonorSessionCard from '@components/card/DonorSessionCard';

// hooks
import { useDispatch } from 'react-redux';
import { withRouter } from 'next/router';

// constants and utils
import { companyIconImagePath } from '@constants/imagePaths';

// redux
import { setIsNpoLogin, setIsDonorLogin } from '../../redux';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;

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
        <a href="/">
          <Image src={companyIconImagePath} height="100px" width="100px" />
        </a>
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
