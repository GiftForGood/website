import React, { useState, useEffect } from 'react';

import Banner from '../modules/Banner';
import Categories from '../modules/Categories';
import TopCategories from '../modules/TopCategories';
import { Grid } from '@kiwicom/orbit-components/lib';

const styles = {
  homePage: {
    height: '100vh',
    width: '100vw',
  },
};

const HomePage = () => {
  return (
    <div>
      <Grid style={styles.homePage} rows="2fr 1fr 3fr" rowGap="0.5vh" columns="1fr">
        <Banner />
        <Categories />
        <TopCategories />
      </Grid>
    </div>
  );
};

export default HomePage;
