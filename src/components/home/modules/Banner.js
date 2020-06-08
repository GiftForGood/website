import React, { useState, useEffect } from 'react';
import SearchBar from '../../search/SearchBar';
import styled, { css } from 'styled-components';
import { wishesBannerImagePath, donationsBannerImagePath } from '../../../../utils/constants/imagePaths';
import { wishesHomePageDetails, donationsHomePageDetails } from '../../../../utils/constants/homePageDetails';
import api from '../../../../utils/api/';
import { Grid } from '@kiwicom/orbit-components/lib';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import BannerCarousel from './BannerCarousel';

const TitleArea = styled.div`
  position: absolute;
  color: white;
  left: 50%;
  top: 35%;
  width: 70%;
  ${media.desktop(css`
    top: 40%;
    width: 50%;
  `)};
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
  position: relative;
  height: 100%;
  width: 100%;
  margin: 0 auto;
`;

// only display when it is desktop
const AdvertisementContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: none;
  ${media.desktop(css`
    display: inherit;
  `)};
`;

const BannerContainer = styled.div`
  ${media.desktop(css`
    width: 90vw;
  `)};
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
`;

/**
 * @param {string} type can be donation or wish type
 */
const Banner = ({ type }) => {
  return (
    <BannerContainer>
      <Grid
        style={{ height: '100%', width: '100%' }}
        columns="1fr"
        desktop={{
          columns: '2fr 1fr',
          columnGap: '25px',
        }}
      >
        <BannerCarousel />
        <AdvertisementContainer></AdvertisementContainer>
      </Grid>
    </BannerContainer>
  );
};

export default Banner;
