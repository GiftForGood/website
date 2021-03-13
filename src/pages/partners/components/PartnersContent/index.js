import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
import { Heading, Stack, Text, Grid, Tile, TextLink } from '@kiwicom/orbit-components/lib';

// constants and utils
import { partners } from '@constants/partners';

const MainContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 0 20px;
  width: 90%;
`;

const PartnersContainer = styled.div`
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0px;
  ${media.tablet(css`
    padding: 0;
  `)}
`;

const DetailsContainer = styled.div`
  margin: auto 0;
  padding-bottom: 8px;
  ${media.tablet(css`
    padding-bottom: 0;
  `)}
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  ${media.tablet(css`
    min-height: 250px;
  `)}
`;

const PartnersSection = () => {
  return (
    <Stack direction="column" spacing="loose">
      {partners.map((partner, index) => {
        return (
          <Tile key={index} href={partner.siteUrl} external>
            <CardContainer>
              <Grid tablet={{ columns: '1fr 1fr' }} gap="20px">
                <LogoContainer>
                  <img src={partner.imageUrl} width="200px" height="auto" />
                </LogoContainer>
                <DetailsContainer>
                  <Stack spacing="none" spaceAfter="large">
                    <Heading type="title2">About {partner.name}</Heading>
                  </Stack>
                  <Text as="span">{partner.description}</Text>
                  <Text as="span">
                    Visit us at{' '}
                    <TextLink external standAlone stopPropagation href="https://www.cityofgood.sg">
                      www.cityofgood.sg
                    </TextLink>
                    .
                    <br />
                    <br />
                    NVPC provides strategic advice and assistance in supporting the sustainable growth of GiftforGood.
                  </Text>
                </DetailsContainer>
              </Grid>
            </CardContainer>
          </Tile>
        );
      })}
    </Stack>
  );
};

const PartnersContent = () => {
  return (
    <MainContainer>
      <Heading as="h1" type="display" spaceAfter="largest">
        Partners
      </Heading>
      <PartnersContainer>
        <PartnersSection />
      </PartnersContainer>
    </MainContainer>
  );
};

export default PartnersContent;
