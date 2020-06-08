import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import CreateDonationPanel from '../modules/createDonationPanel';

const Container = styled.div`
  display: flex;
  justify-content: center;

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

const CreateWishPage = () => {
  return (
    <Container>
      <Wrapper>
        <CreateDonationPanel />
      </Wrapper>
    </Container>
  );
};

export default CreateWishPage;
