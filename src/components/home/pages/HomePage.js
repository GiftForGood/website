import React, { setState } from 'react';
import Banner from '../modules/Banner';
import Categories from '../modules/Categories';
import TopWishes from '../modules/TopWishes';
import TopDonations from '../modules/TopDonations';
import { Grid } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';

const HomePageContainer = styled.div`
  display: flex;
`;

const ResponsiveTitle = styled.div`
  font-size: calc(14px + 0.5vw);
  font-weight: bold;
  margin-bottom: 15px;
`;

const CategoriesContainer = styled.div`
  margin: 0 auto;
  max-width: 1920px;
  overflow-x: hidden;
`;

const styles = {
  gridContainer: {
    height: '100%',
    width: '100vw',
  },
};

const TopCategoriesContainer = styled.div`
  text-align: center;
  width: 90%;
  max-width: 1920px;
  margin: 0 auto;
  margin-bottom: 2vh;
`;

const numberOfPostsPerCategory = 3;
const numberOfCategories = 3;

const HomePage = ({ ...props }) => {
  // TODO: default to wishes home page for now, will modify when the data for logged in user is ready
  const { pageType } = props;
  return (
    <HomePageContainer>
      <Grid style={styles.gridContainer} rows="3fr 1fr auto" rowGap="1vh" columns="1fr">
        <Banner type={pageType || 'wishes'} />
        <CategoriesContainer>
          <ResponsiveTitle>Explore GiftForGood</ResponsiveTitle>
          <Categories />
        </CategoriesContainer>
        <TopCategoriesContainer>
          <ResponsiveTitle>Top Categories</ResponsiveTitle>
          {pageType === 'donation' ? (
            <TopDonations numberOfPosts={numberOfPostsPerCategory} numberOfCategories={numberOfCategories} />
          ) : (
            <TopWishes numberOfPosts={numberOfPostsPerCategory} numberOfCategories={numberOfCategories} />
          )}
        </TopCategoriesContainer>
      </Grid>
    </HomePageContainer>
  );
};

export default HomePage;
