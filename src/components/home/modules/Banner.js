import React from 'react';

import { Stack } from '@kiwicom/orbit-components/lib';
import SearchBar from './SearchBar';
import styled from 'styled-components';
import { bannerImagePath } from '../../../../utils/constants/imagePaths';

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

const BannerImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${(props) => props.src});
  background-size: cover;
  background-position: 50% 50%;
`;

const SearchBarContainer = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  width: 50%;
  min-width: 15rem;
  transform: translate(-50%, -50%);
`;

const title = 'GiftForGood.sg';
const subTitle = 'Giving back to the society that needs your help';

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
    <BannerImageContainer src={bannerImagePath}>
      <Stack align="center">
        <BannerText />
        <SearchBarContainer>
          <SearchBar />
        </SearchBarContainer>
      </Stack>
    </BannerImageContainer>
  );
};

export default Banner;
