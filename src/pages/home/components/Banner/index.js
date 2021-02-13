import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
import { Grid } from '@kiwicom/orbit-components/lib';
import { BannerCarousel, SideBanner } from './components';
import { MaxWidthContainer } from '@components/containers';

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

const BannerContainer = styled(MaxWidthContainer)`
  ${media.desktop(css`
    width: 90vw;
  `)};
  width: 100%;
  height: 100%;
  margin-top: 0;
  margin-bottom: 0;
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
        <AdvertisementContainer>
          <SideBanner />
        </AdvertisementContainer>
      </Grid>
    </BannerContainer>
  );
};

export default Banner;
