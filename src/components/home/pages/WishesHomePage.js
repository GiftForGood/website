import React from 'react';
import Banner from '../modules/Banner';
import Categories from '../../category/modules/Categories';
import TopWishes from '../modules/TopWishes';
import { Grid } from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { wishesHomePageDetails } from '../../../../utils/constants/homePageDetails';

const WishesHomePageContainer = styled.div`
  display: flex;
`;

const ResponsiveTitle = styled.div`
  font-size: calc(14px + 0.5vw);
  font-weight: bold;
  margin-bottom: 17.5px;
  ${media.desktop(css`
    margin-bottom: 27.5px;
  `)};
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

const TopWishesContainer = styled.div`
  width: 90vw;
  max-width: 1280px;
  margin: 0 auto;
  margin-bottom: 40px;
`;

const WishesHomePage = () => {
  const {
    numberOfPostsPerCategory,
    numberOfCategories,
    categoriesTitle,
    topCategoriesTitle,
    pageType,
  } = wishesHomePageDetails;
  return (
    <WishesHomePageContainer>
      <Grid
        style={styles.gridContainer}
        rows="2fr 1fr auto"
        rowGap="25px"
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
        <TopWishesContainer>
          <ResponsiveTitle>{topCategoriesTitle}</ResponsiveTitle>
          <TopWishes numberOfPosts={numberOfPostsPerCategory} numberOfCategories={numberOfCategories} />
        </TopWishesContainer>
      </Grid>
    </WishesHomePageContainer>
  );
};

export default WishesHomePage;
