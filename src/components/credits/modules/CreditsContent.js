import React from 'react';
import styled from 'styled-components';
import { Heading } from '@kiwicom/orbit-components/lib';
import IconCredits from './IconCredits';
import ImageCredits from './ImageCredits';
import LibraryCredits from './LibraryCredits';
import { MaxWidthContainer } from '@components/containers';

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
