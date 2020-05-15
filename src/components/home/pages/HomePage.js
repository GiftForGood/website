import React from 'react';

import Banner from '../modules/Banner';
import Categories from '../modules/Categories';
import TopCategories from '../modules/TopCategories';
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

const numberOfPostsPerCategory = 3;
const numberOfCategories = 3;

const HomePage = () => {
  return (
    <HomePageContainer>
      <Grid rows="3fr 1fr auto" rowGap="1vh" columns="1fr">
        <Banner />
        <CategoriesContainer>
          <ResizableTitle>Explore GiftForGood</ResizableTitle>
          <Categories />
        </CategoriesContainer>
        <TopCategories numberOfPosts={numberOfPostsPerCategory} numberOfCategories={numberOfCategories} />
      </Grid>
    </HomePageContainer>
  );
};

export default HomePage;
