import React, { useState, useEffect } from 'react';

import { Stack, Text } from '@kiwicom/orbit-components/lib';
import BannerImage from '../../ImageHolder/BannerImage';
import SearchBar from './SearchBar';
import styled from 'styled-components';

const TitleArea = styled.div`
  position: absolute;
  color: white;
  top: 35%;
  left: 50%;
  width: 50%;
  transform: translate(-50%, -50%);
`;

const Title = styled.div`
  font-size: calc(10px + 1vw);
  font-weight: bold;
`;

const SubTitle = styled.div`
  font-size: calc(10px + 0.5vw);
  margin-top: 10px;
`;

const BannerContainer = styled.div`
  position: relative;
`;

const title = 'GiftForGood.sg';
const subTitle = 'Giving back to the society that needs your help';
const bannerImageUrl = '/assets/wishes-banner.jpg';

const BannerText = () => {
  return (
    <TitleArea>
      <Title>{title}</Title>
      <SubTitle>{subTitle}</SubTitle>
    </TitleArea>
  );
};

const Banner = () => {
  return (
    <BannerContainer>
      <Stack align="center">
        <BannerImage imageUrl={bannerImageUrl} />
        <BannerText />
        <SearchBar />
      </Stack>
    </BannerContainer>
  );
};

export default Banner;
