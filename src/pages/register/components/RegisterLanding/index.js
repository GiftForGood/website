import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// hoc
import { withRouter } from 'next/router';

// hooks
import { useDispatch } from 'react-redux';

// components
import { Text, Heading, Grid, TextLink, Stack } from '@kiwicom/orbit-components/lib';
import NpoSessionCard from '@components/card/NpoSessionCard';
import DonorSessionCard from '@components/card/DonorSessionCard';
import Image from 'next/image';

// redux
import { setIsNpoRegister, setIsDonorRegister } from '../../redux';

// constants
import { companyIconImagePath } from '@constants/imagePaths';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.largeMobile(css`
    height: 100%;
    justify-content: center;
  `)};
`;
const RegisterLanding = (props, state) => {
  const dispatch = useDispatch();

  const handleNpoOnClick = () => {
    dispatch(setIsNpoRegister());
  };

  const handleDonorOnClick = () => {
    dispatch(setIsDonorRegister());
  };

  return (
    <Container>
      <Text align="center" as="div">
        <a href="/">
          <Image src={companyIconImagePath} height="100px" width="100px" />
        </a>

        <Heading spaceAfter="largest" size="large" weight="bold">
          Join GiftForGood
        </Heading>
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
          <NpoSessionCard onClick={handleNpoOnClick} buttonTitle={'Sign Up'} />
          <DonorSessionCard onClick={handleDonorOnClick} buttonTitle={'Sign Up'} />
        </Grid>
      </Stack>

      <Text>
        Already have an account?{' '}
        <TextLink href="/login" stopPropagation>
          Login
        </TextLink>
        .
      </Text>
    </Container>
  );
};

export default withRouter(RegisterLanding);
