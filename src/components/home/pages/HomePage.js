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
  margin-bottom: 20px;
`;

const CategoriesContainer = styled.div`
  margin: 0 auto;
  width: 90vw;
  max-width: 1280px;
`;

const styles = {
  gridContainer: {
    height: '100%',
    width: '100vw',
  },
};

const TopDonationsContainer = styled.div`
  width: 90vw;
  max-width: 1280px;
  margin: 0 auto;
  margin-bottom: 40px;
  overflow-x: hidden;
`;

const TopWishesContainer = styled.div`
  text-align: center;
  width: 90vw;
  max-width: 1280px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 30px;
`;

const numberOfPostsPerCategory = 3;
const numberOfCategories = 3;
const categoriesTitle = 'Explore GiftForGood';
const topCategoriesTitle = 'Top Categories';

const HomePage = ({ ...props }) => {
  // TODO: default to wishes home page for now, will modify when the data for logged in user is ready
  let { pageType } = props;
  pageType = pageType || 'wishes';
  return (
    <HomePageContainer>
      <Grid
        style={styles.gridContainer}
        rows="2fr 1fr auto"
        rowGap="20px"
        columns="1fr"
        desktop={{
          rows: '3fr 1fr auto',
          rowGap: '30px',
        }}
      >
        <Banner type={pageType} />
        <CategoriesContainer>
          <ResponsiveTitle>{categoriesTitle}</ResponsiveTitle>
          <Categories />
        </CategoriesContainer>
        {pageType === 'donation' ? (
          <TopDonationsContainer>
            <ResponsiveTitle>{topCategoriesTitle}</ResponsiveTitle>
            <TopDonations numberOfPosts={numberOfPostsPerCategory} numberOfCategories={numberOfCategories} />
          </TopDonationsContainer>
        ) : (
          <TopWishesContainer>
            <ResponsiveTitle>{topCategoriesTitle}</ResponsiveTitle>
            <TopWishes numberOfPosts={numberOfPostsPerCategory} numberOfCategories={numberOfCategories} />
          </TopWishesContainer>
        )}
      </Grid>
    </HomePageContainer>
  );
};

export default HomePage;
