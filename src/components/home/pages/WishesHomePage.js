import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Banner from '../modules/Banner';
import Categories from '../../category/modules/Categories';
import TopWishes from '../modules/TopWishes';
import { Grid } from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { wishesHomePageDetails } from '@constants/homePageDetails';
import { MaxWidthContainer } from '@components/containers';
import useLocalStorage from '@utils/hooks/useLocalStorage';
import { gridRowsWithHowItWorks, gridRows } from '@constants/homePageGridRows';

const HowItWorks = dynamic(() => import('@components/howItWorks/pages/HowItWorks'), { ssr: false });

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
    <WishesHomePageContainer>
      <Grid
        style={styles.gridContainer}
        rows={mobileGridRules.rows}
        rowGap="25px"
        columns="1fr"
        largeDesktop={largeDesktopGridRules}
        desktop={desktopGridRules}
        tablet={tabletGridRules}
        largeMobile={mobileGridRules}
        mediumMobile={mobileGridRules}
      >
        <Banner type={pageType} />

        {isShowHowItWorks && <HowItWorks setIsShowHowItWorks={setIsShowHowItWorks} />}

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
