import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Banner from '../modules/Banner';
import Categories from '../../category/modules/Categories';
import TopDonations from '../modules/TopDonations';
import { Grid } from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { donationsHomePageDetails } from '@constants/homePageDetails';
import RoutingCarousel from '@components/carousel/RoutingCarousel';
import useLocalStorage from '@utils/hooks/useLocalStorage';
import { gridRowsWithHowItWorks, gridRows } from '@constants/homePageGridRows';

const HowItWorks = dynamic(() => import('@components/howItWorks/pages/HowItWorks'), { ssr: false });

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
  const [isShowHowItWorks, setIsShowHowItWorks] = useLocalStorage('isShowHowItWorks', true);
  const [largeDesktopGridRules, setLargeDesktopGridRules] = useState({
    rows: isShowHowItWorks ? gridRowsWithHowItWorks.largeDesktop : gridRows.largeDesktop,
    rowGap: '30px',
  });
  const [desktopGridRules, setDesktopGridRules] = useState({
    rows: isShowHowItWorks ? gridRowsWithHowItWorks.desktop : gridRows.desktop,
  });
  const [tabletGridRules, setTabletGridRules] = useState({
    rows: isShowHowItWorks ? gridRowsWithHowItWorks.tablet : gridRows.tablet,
  });
  const [mobileGridRules, setMobileGridRules] = useState({
    rows: isShowHowItWorks ? gridRowsWithHowItWorks.mobile : gridRows.mobile,
  });

  useEffect(() => {
    setLargeDesktopGridRules({ rows: isShowHowItWorks ? gridRowsWithHowItWorks.largeDesktop : gridRows.largeDesktop });
    setDesktopGridRules({ rows: isShowHowItWorks ? gridRowsWithHowItWorks.desktop : gridRows.desktop });
    setTabletGridRules({ rows: isShowHowItWorks ? gridRowsWithHowItWorks.tablet : gridRows.tablet });
    setMobileGridRules({ rows: isShowHowItWorks ? gridRowsWithHowItWorks.mobile : gridRows.mobile });
  }, [isShowHowItWorks]);

  return (
    <HomePageContainer>
      <Grid
        style={styles.gridContainer}
        rows={mobileGridRules.rows}
        rowGap="25px"
        columns="1fr"
        largeDesktop={largeDesktopGridRules}
        desktop={desktopGridRules}
        tablet={tabletGridRules}
        largeMobile={mobileGridRules}
      >
        <Banner type={pageType} />
        {isShowHowItWorks && <HowItWorks setIsShowHowItWorks={setIsShowHowItWorks} />}
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
