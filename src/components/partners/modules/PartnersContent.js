import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { Heading, Stack, Text, Grid, Tile } from '@kiwicom/orbit-components/lib';
import api from '@api';

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

const PartnersSection = ({ partners }) => {
  return (
    <Stack direction="column" spacing="loose">
      {partners.map((partner, index) => {
        return (
          <Tile key={index} href={partner.data().siteUrl} external>
            <CardContainer>
              <Grid tablet={{ columns: '1fr 1fr' }} gap="20px">
                <LogoContainer>
                  <img src={partner.data().imageUrl} width="200px" height="auto" />
                </LogoContainer>
                <DetailsContainer>
                  <Stack spacing="none" spaceAfter="large">
                    <Heading type="title2">About {partner.data().name}</Heading>
                  </Stack>
                  <Text>{partner.data().description}</Text>
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
  const [partners, setPartners] = useState([]);

  const getAllPartners = async () => {
    api.partners
      .getAll()
      .then((res) => {
        setPartners(res.docs);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getAllPartners();
  }, []);

  return (
    <MainContainer>
      <Heading as="h1" type="display" spaceAfter="largest">
        Partners
      </Heading>
      <PartnersContainer>
        <PartnersSection partners={partners} />
      </PartnersContainer>
    </MainContainer>
  );
};

export default PartnersContent;
