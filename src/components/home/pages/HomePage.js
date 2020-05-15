import React from 'react';
import Banner from '../modules/Banner';
import Categories from '../modules/Categories';
import TopWishes from '../modules/TopWishes';
import { Grid } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';

const HomePageContainer = styled.div`
  display: flex;
`;

const ResizableTitle = styled.div`
  font-size: calc(10px + 0.5vw);
  font-weight: bold;
`;

const CategoriesContainer = styled.div`
  margin: 0 auto;
`;

const styles = {
  gridContainer: {
    height: '100%',
    width: '100vw',
  },
};

const numberOfPostsPerCategory = 3;
const numberOfCategories = 3;

const HomePage = () => {
  return (
    <HomePageContainer>
      <Grid style={styles.gridContainer} rows="3fr 1fr auto" rowGap="1vh" columns="1fr">
        <Banner />
        <CategoriesContainer>
          <ResizableTitle>Explore GiftForGood</ResizableTitle>
          <Categories />
        </CategoriesContainer>
        <TopWishes numberOfPosts={numberOfPostsPerCategory} numberOfCategories={numberOfCategories} />
      </Grid>
    </HomePageContainer>
  );
};

export default HomePage;
