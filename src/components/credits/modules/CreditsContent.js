import React from 'react';
import styled from 'styled-components';
import { Heading } from '@kiwicom/orbit-components/lib';
import IconCredits from './IconCredits';
import ImageCredits from './ImageCredits';
import LibraryCredits from './LibraryCredits';

const CreditsContainer = styled.div`
  position: relative;
  max-width: 1280px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0 50px;
`;

const CreditsTitleContainer = styled.div`
  margin: 0 auto;
  margin-bottom: 30px;
  margin-top: 30px;
`;

const CreditDetailsContainer = styled.div``;

const CreditsContent = () => {
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

export default CreditsContent;
