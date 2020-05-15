import React from 'react';

import Banner from '../modules/Banner';
import Categories from '../modules/Categories';
import TopCategories from '../modules/TopCategories';
import { Grid } from '@kiwicom/orbit-components/lib';
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

const numberOfPostsPerCategory = 3;
const numberOfCategories = 3;

const HomePage = () => {
  return (
    <HomePageContainer>
      <Grid style={styles.homePageComponents} rows="3fr 1fr auto" rowGap="1vh" columns="1fr">
        <Banner />
        <Categories />
        <TopCategories numberOfPosts={numberOfPostsPerCategory} numberOfCategories={numberOfCategories} />
      </Grid>
    </HomePageContainer>
  );
};

export default HomePage;
