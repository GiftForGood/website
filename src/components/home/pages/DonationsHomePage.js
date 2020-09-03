import React from 'react';
import Banner from '../modules/Banner';
import Categories from '../../category/modules/Categories';
import TopDonations from '../modules/TopDonations';
import { Grid } from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { donationsHomePageDetails } from '../../../../utils/constants/homePageDetails';

const HomePageContainer = styled.div`
  display: flex;
  ${media.desktop(css`
    margin-top: 30px;
  `)};
`;

const ResponsiveTitle = styled.div`
  font-size: calc(14px + 0.5vw);
  font-weight: bold;
  margin-bottom: 10px;
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

const TopDonationsContainer = styled.div`
  width: 90vw;
  max-width: 1280px;
  margin: 0 auto;
  margin-bottom: 40px;
  overflow-x: hidden;
`;

const DonationsHomePage = () => {
  const {
    numberOfPostsPerCategory,
    numberOfCategories,
    categoriesTitle,
    topCategoriesTitle,
    pageType,
  } = donationsHomePageDetails;
  return (
    <HomePageContainer>
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
          <Categories type="donations" />
        </CategoriesContainer>
        <TopDonationsContainer>
          <ResponsiveTitle>{topCategoriesTitle}</ResponsiveTitle>
          <TopDonations numberOfPosts={numberOfPostsPerCategory} numberOfCategories={numberOfCategories} />
        </TopDonationsContainer>
      </Grid>
    </HomePageContainer>
  );
};

export default DonationsHomePage;
