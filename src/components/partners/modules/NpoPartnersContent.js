import React from 'react';
import styled from 'styled-components';
import { Stack, Text, Grid } from '@kiwicom/orbit-components/lib';
import { npoPartners } from '@constants/npoPartners';
import { colors } from '@constants/colors';

const MainContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 0 20px;
  width: 90%;
`;

const NpoPartnersContainer = styled.div``;

const CardContainer = styled.div`
  display: flex;
  border-radius: 3px;
  border: 1px solid ${colors.separator.background};
  min-height: 250px;
`;

const CardLogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
`;

const CardDescriptionContainer = styled.div`
  padding: 0 10px;
`;

const ThreeLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-word;
`;

const NpoPartnerCard = ({ npo }) => {
  return (
    <CardContainer>
      <Stack direction="column" justify="center" align="center">
        <CardLogoContainer>
          <img src={npo.imageUrl} width="100px" height="auto" />
        </CardLogoContainer>
        <CardDescriptionContainer>
          <ThreeLineTextContainer>
            <Text weight="bold" align="center">
              {npo.name}
            </Text>
          </ThreeLineTextContainer>
        </CardDescriptionContainer>
      </Stack>
    </CardContainer>
  );
};

const NpoPartnersContent = () => {
  return (
    <MainContainer>
      <NpoPartnersContainer>
        <Grid
          desktop={{ columns: '1fr 1fr 1fr 1fr 1fr' }}
          tablet={{ columns: '1fr 1fr 1fr 1fr' }}
          largeMobile={{ columns: '1fr 1fr 1fr' }}
          mediumMobile={{ columns: '1fr 1fr' }}
          columns="1fr 1fr"
          gap="20px"
        >
          {npoPartners.map((npo) => {
            return <NpoPartnerCard npo={npo} />;
          })}
        </Grid>
      </NpoPartnersContainer>
    </MainContainer>
  );
};

export default NpoPartnersContent;
