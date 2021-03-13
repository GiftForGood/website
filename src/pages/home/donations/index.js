import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
import { Banner } from '../components';
import Categories from '@components/category/modules/Categories';
import { TopDonations } from './components';
import { Grid } from '@kiwicom/orbit-components/lib';
import { MaxWidthContainer } from '@components/containers';

// constants and utils
import { donationsHomePageDetails } from '@constants/homePageDetails';
import { gridRowsWithHowItWorks, gridRows } from '@constants/homePageGridRows';

// hooks
import useLocalStorage from '@utils/hooks/useLocalStorage';

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

const TopDonationsContainer = styled(MaxWidthContainer)`
  overflow-x: hidden;
  margin-top: 0;
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
