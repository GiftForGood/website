import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import CreateDonationPanel from '../modules/createDonationPanel';
import { Heading, Alert, Stack } from '@kiwicom/orbit-components/lib';

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  max-width: 1280px;
  margin-top: 25px;
  margin-bottom: 40px;

  ${media.largeMobile(css`
    width: 90vw;
    margin: 0 auto;
    padding-top: 80px;
    padding-bottom: 100px;
  `)};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${media.largeMobile(css`
    max-width: 1280px;
  `)};

  ${media.desktop(css`
    flex-direction: row;
    justify-content: center;
  `)}
`;

const HeadingWrapper = styled.div`
  margin-left: 20px;
  margin-right: 20px;

  ${media.largeMobile(css`
    margin-right: 0;
  `)}
`;

const CreateWishPage = () => {
  return (
    <Container>
      <HeadingWrapper>
        <Stack spacing="loose">
          <Heading>What are you donating today?</Heading>
          <Alert icon title="Some additional information" type="info">
            As a donor, you are <b>encouraged</b> to cover the delivery cost (if there is) to the specified location.
            This is to encourage donations of good and usable items to the beneficiaries or organizations.
          </Alert>
        </Stack>
      </HeadingWrapper>

      <Wrapper>
        <CreateDonationPanel mode="create" />
      </Wrapper>
    </Container>
  );
};

export default CreateWishPage;
