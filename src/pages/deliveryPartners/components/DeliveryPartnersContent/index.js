import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
import { MaxWidthContainer } from '@components/containers';
import { Heading, Stack, Text, TextLink, Grid, Tile } from '@kiwicom/orbit-components/lib';

// utils
import api from '@api';

const MainContainer = styled(MaxWidthContainer)`
  margin-bottom: 50px;
  padding: 0 20px;
`;

const PartnersContainer = styled.div`
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
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

const DeliveryPartnersSection = ({ deliveryPartners }) => {
  return (
    <Stack direction="column" spacing="loose">
      {deliveryPartners.map((partner) => {
        return (
          <Tile href={partner.data().url} external>
            <CardContainer>
              <Grid tablet={{ columns: '1fr 1fr' }} gap="20px">
                <LogoContainer>
                  <img src={partner.data().imageUrl} width="250px" height="auto" />
                </LogoContainer>
                <DetailsContainer>
                  <Stack spacing="none" spaceAfter="large">
                    <Text weight="bold">{partner.data().name}</Text>
                    <Text>PromoCode: {partner.data().promoCode ? partner.data().promoCode : 'Not Required'}</Text>
                    <TextLink external href={partner.data().url}>
                      {partner.data().url}
                    </TextLink>
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

const DeliveryPartnersContent = () => {
  const [deliveryPartners, setDeliveryPartners] = useState([]);

  const getAllDeliveryPartners = async () => {
    api.logistics
      .getAll()
      .then((res) => {
        setDeliveryPartners(res.docs);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getAllDeliveryPartners();
  }, []);

  return (
    <MainContainer>
      <Heading as="h1" type="display" spaceAfter="normal">
        Delivery Partners
      </Heading>
      <Text type="secondary" spaceAfter="largest">
        *You are not obliged to use our delivery partners.
      </Text>
      <PartnersContainer>
        <DeliveryPartnersSection deliveryPartners={deliveryPartners} />
      </PartnersContainer>
    </MainContainer>
  );
};

export default DeliveryPartnersContent;
