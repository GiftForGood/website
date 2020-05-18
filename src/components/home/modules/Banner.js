import React from 'react';
import SearchBar from './SearchBar';
import styled, { css } from 'styled-components';
import { wishesBannerImagePath, donationsBannerImagePath } from '../../../../utils/constants/imagePaths';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

const TitleArea = styled.div`
  position: absolute;
  color: white;
  top: 40%;
  left: 50%;
  width: 50%;
  max-width: 1920px;
  transform: translate(-50%, -50%);
`;

const Title = styled.div`
  font-size: calc(14px + 1vw);
  font-weight: bold;
`;

const SubTitle = styled.div`
  font-size: calc(14px + 0.5vw);
  margin-top: 10px;
`;

const BannerContentContainer = styled.div`
  max-width: 1920px;
  position: relative;
  height: 100%;
  width: 100%;
  margin: 0 auto;
`;

const BannerImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${(props) => props.src});
  background-size: cover;
  background-position: 50% 50%;
`;

const SearchBarContainer = styled.div`
  position: absolute;
  top: 70%;
  width: 70%;
  ${media.desktop(css`
    top: 65%;
    width: 50%;
  `)};
  left: 50%;
  max-width: 960px;
  min-width: 15rem;
  transform: translate(-50%, -50%);
`;

const wishesHomePageTitle = 'GiftForGood.io';
const donationsHomePageTitle = 'Donations';
const subTitle = 'Giving back to the society that needs your help';

const BannerText = ({ ...props }) => {
  const { title, subTitle } = props;
  return (
    <TitleArea>
      <Title>{title}</Title>
      <SubTitle>{subTitle}</SubTitle>
    </TitleArea>
  );
};

/**
 *
 * @param {string} type can be donation or wish type
 */
const Banner = ({ type }) => {
  return (
    <BannerImageContainer src={type === 'donation' ? donationsBannerImagePath : wishesBannerImagePath}>
      <BannerContentContainer>
        <BannerText title={type === 'donation' ? donationsHomePageTitle : wishesHomePageTitle} subTitle={subTitle} />
        <SearchBarContainer>
          <SearchBar />
        </SearchBarContainer>
      </BannerContentContainer>
    </BannerImageContainer>
  );
};

export default Banner;
