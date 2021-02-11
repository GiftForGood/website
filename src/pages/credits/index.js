import React from 'react';
import styled from 'styled-components';

// components
import { Heading } from '@kiwicom/orbit-components/lib';
import { MaxWidthContainer } from '@components/containers';
import { IconCredits, ImageCredits, LibraryCredits } from './components';

const CreditsContainer = styled(MaxWidthContainer)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  margin-top: 0;
  margin-bottom: 0;
  width: auto;
`;

const CreditsTitleContainer = styled.div`
  margin: 0 auto;
  margin-bottom: 30px;
  margin-top: 30px;
`;

const CreditDetailsContainer = styled.div``;

const CreditsPage = () => {
  return (
    <CreditsContainer>
      <CreditsTitleContainer>
        <Heading as="h1" type="display">
          Credits
        </Heading>
      </CreditsTitleContainer>
      <CreditDetailsContainer>
        <IconCredits />
        <ImageCredits />
        <LibraryCredits />
      </CreditDetailsContainer>
    </CreditsContainer>
  );
};

export default CreditsPage;
