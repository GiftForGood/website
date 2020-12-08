import React from 'react';
import Banner from '../modules/Banner';
import Categories from '../../category/modules/Categories';
import TopWishes from '../modules/TopWishes';
import { Grid } from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { wishesHomePageDetails } from '@constants/homePageDetails';
import { MaxWidthContainer } from '@components/containers';

const WishesHomePageContainer = styled.div`
  display: flex;
  ${media.desktop(css`
    margin-top: 30px;
  `)};
`;

const ResponsiveTitle = styled.div`
  font-size: calc(14px + 0.5vw);
  font-weight: bold;
  margin-bottom: 17.5px;
  ${media.desktop(css`
    margin-bottom: 27.5px;
  `)};
`;

const CategoriesContainer = styled(MaxWidthContainer)`
  margin-top: 0;
  margin-bottom: 0;
`;

const styles = {
  gridContainer: {
    height: '100%',
    width: '100vw',
  },
};

const TopWishesContainer = styled(MaxWidthContainer)`
  overflow-x: hidden;
  margin-top: 0;
  padding: 0 5px 5px 5px;
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
        rows="1fr 0.5fr auto"
        rowGap="25px"
        columns="1fr"
        desktop={{
          rows: '1.5fr 1fr auto',
          rowGap: '30px',
        }}
      >
        <Banner type={pageType} />

        <CategoriesContainer>
          <ResponsiveTitle>{categoriesTitle}</ResponsiveTitle>
          <Categories type="wishes" />
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
