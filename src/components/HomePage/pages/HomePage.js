import React, { useState, useEffect } from 'react';

import Banner from '../modules/Banner';
import Categories from '../modules/Categories';
import TopCategories from '../modules/TopCategories';
import { Grid } from '@kiwicom/orbit-components/lib';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import styled from 'styled-components';

const HomePageContainer = styled.div`
  display: flex;
`;

const styles = {
  homePageComponents: {
    height: '100%',
    width: '100vw',
  },
};

const HomePage = () => {
  return (
    <HomePageContainer>
      <Grid style={styles.homePageComponents} rows="3fr 1fr auto" rowGap="1vh" columns="1fr">
        <Banner />
        <Categories />
        <TopCategories />
      </Grid>
    </HomePageContainer>
  );
};

export default HomePage;
