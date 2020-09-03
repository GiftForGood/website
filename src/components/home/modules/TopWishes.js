import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Button, Text } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import styled, { css } from 'styled-components';
import BlackText from '../../text/BlackText';
import GroupWishCard from '../../card/GroupWishCard';
import GreySubtleButton from '../../buttons/GreySubtleButton';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

import { InstantSearch, connectHits, Configure } from 'react-instantsearch-dom';
import { getByCategoryIdAndStatusAndNotExpired } from '../../../../utils/algolia/filteringRules';
import algoliasearch from 'algoliasearch/lite';
const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);

// note that the width of each wish column in desktop is calculated using
// (full width which is 100% - (2 * spacing in between each column which is 40px)) / 3
const WishesColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  width: 100%;
  ${media.desktop(css`
    width: calc((100% - 80px) / 3);
  `)}
`;

const CategoryHeaderContainer = styled.div`
  height: fit-content;
  margin: 10px;
  text-align: center;
`;

const ViewAllButtonContainer = styled.div`
  margin: 0.5vh auto;
  margin-bottom: 15px;
  ${media.desktop(css`
    margin-bottom: 25px;
  `)};
`;

const CategoryHeader = ({ title }) => {
  return (
    <CategoryHeaderContainer>
      <Desktop>
        <Text size="large" align="center" weight="bold">
          {title}
        </Text>
      </Desktop>
      <Mobile>
        <Text size="normal" align="center" weight="bold">
          {title}
        </Text>
      </Mobile>
    </CategoryHeaderContainer>
  );
};

const TopWishes = ({ numberOfPosts, numberOfCategories }) => {
  const router = useRouter();

  const [topCategories, setTopCategories] = useState([]);

  const [firstTopCategory, setFirstTopCategory] = useState({});
  const [secondTopCategory, setSecondTopCategory] = useState({});
  const [thirdTopCategory, setThirdTopCategory] = useState({});
  

  const getTopNCategoriesFromAlgolia = async () => {
    const index = searchClient.initIndex('wishes');
    return index.search('', {
      facets: ['categories.id'],
      facetFilters: [['status:pending']],
    });
  };

  const sortObjectEntries = (obj) => {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map((element) => element[0]);
  };

  useEffect(() => {
    getAllCategories().then((categories) => {
      getTopNCategoriesFromAlgolia().then(({ hits, facets }) => {
        const sorted = sortObjectEntries(facets['categories.id']);
        if (sorted.length >= 3) {
          const top3CategoriesIds = sorted.slice(0, 3);
          const top3Categories = categories.filter((category) => {
            if (top3CategoriesIds.includes(category.id)) {
              return true;
            }
            return false;
          });
          setTopCategories(top3Categories);
        } else if (sorted.length > 0 && sorted.length < 3) {
          const topCategories = categories.filter((category) => {
            if (sorted.includes(category.id)) {
              return true;
            }
            return false;
          });
          setTopCategories(topCategories);
        }
      });
    });
  }, []);

  const getAllCategories = async () => {
    const rawCategories = await api.categories.getAll().catch((err) => console.error(err));
    return rawCategories.docs.map((doc) => doc.data());
  };

  const TopWishesColumn = ({ wishes, category }) => {
    const categoryHref = `/wishes/category/${category.id}`;
    const handleViewAllButton = (event) => {
      event.preventDefault();
      router.push(categoryHref);
    };
    return (
      <WishesColumn key={category.id}>
        <CategoryHeader title={category.name}></CategoryHeader>
        {wishes.map((wish) => {
          const wishPostHref = `/wishes/${wish.wishId}`;
          const profileHref = `/profile/${wish.user.userId}`;
          return (
            <GroupWishCard
              key={wish.wishId}
              name={wish.organization.name}
              title={wish.title}
              description={wish.description}
              imageUrl={wish.user.profileImageUrl}
              postedDateTime={wish.postedDateTime}
              postHref={wishPostHref}
              profileHref={profileHref}
              categoryId={category.id}
              categoryName={category.name}
            />
          );
        })}
        <ViewAllButtonContainer>
          <Button size="small" asComponent={GreySubtleButton} onClick={handleViewAllButton}>
            <BlackText size="small">View all</BlackText>
          </Button>
        </ViewAllButtonContainer>
      </WishesColumn>
    );
  };

  const Hits = ({ hits, category }) => (
    <>
      <TopWishesColumn wishes={hits} category={category}/>
    </>
  );
  const TopCategories = connectHits(Hits);

  return (
    <Stack desktop={{ direction: 'row' }} direction="column" align="start" spacing="extraLoose">
      {topCategories.map((category) => (
        <InstantSearch searchClient={searchClient} indexName="wishes">
          <TopCategories category={category}/>
          <Configure
            filters={getByCategoryIdAndStatusAndNotExpired(category.id, 'pending', Date.now())}
            hitsPerPage={'5'}
          />
        </InstantSearch>
      ))}
    </Stack>
  );
};

export default TopWishes;
