import React from 'react';
import styled, { css } from 'styled-components';
import { Grid } from '@kiwicom/orbit-components/lib';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import BannerCarousel from './BannerCarousel';

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
