import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Button, Text } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import styled from 'styled-components';
import BlackText from '../../text/BlackText';
import HomePageWishCard from '../../card/HomePageWishCard';
import GreySubtleButton from '../../buttons/GreySubtleButton';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import { dummyTopCategoriesAndTheirWishes } from '../../../../utils/dummyData/topCategoriesAndTheirWishes';

const TopWishesContainer = styled.div`
  text-align: center;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 2vh;
`;

const ResponsiveTitle = styled.div`
  font-size: calc(10px + 0.5vw);
  font-weight: bold;
`;

const WishesColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  width: 100%;
`;

const CategoryHeaderContainer = styled.div`
  height: fit-content;
  margin: 10px;
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
  const [topCategoriesAndTheirWishes, setTopCategoriesAndTheirWishes] = useState([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setTopCategoriesAndTheirWishes(dummyTopCategoriesAndTheirWishes);
    } else {
      getTopCategoriesAndTheirWishes(numberOfPosts, numberOfCategories);
    }
  }, []);

  const getTopCategoriesAndTheirWishes = (numberOfCategories, numberOfPosts) => {
    api.categories
      .getAll()
      .then((response) => {
        // get top {@numberOfCategories} categories
        const categories = [];
        response.docs.slice(0, numberOfCategories).forEach((doc) => categories.push(doc.data()));
        return categories;
      })
      .then((categories) => {
        // get {@numberOfPosts} wishes for each top categories
        getWishesForTopCategories(categories, numberOfPosts).then((topCategoriesAndTheirWishes) =>
          setTopCategoriesAndTheirWishes(topCategoriesAndTheirWishes)
        );
      })
      .catch((err) => {});
  };

  async function getWishesForTopCategories(categories, numberOfPosts) {
    let topCategoriesAndTheirWishes = [];
    for (let i = 0; i < categories.length; i++) {
      const response = await api.wishes.getTopNPendingWishes(categories[i].id, numberOfPosts);
      const category = categories[i];
      category.wishes = [];
      response.docs.forEach((doc) => category.wishes.push(doc.data()));
      topCategoriesAndTheirWishes = [...topCategoriesAndTheirWishes, category];
    }
    return topCategoriesAndTheirWishes;
  }

  const AllCards = () => {
    const router = useRouter();
    return topCategoriesAndTheirWishes.map((categoryWishes) => {
      const categoryHref = '/category/' + categoryWishes.id;
      const handleViewAllButton = (event) => {
        event.preventDefault();
        router.push(categoryHref);
      };
      return (
        <WishesColumn key={categoryWishes.id}>
          <CategoryHeader title={categoryWishes.name}></CategoryHeader>
          {categoryWishes.wishes.map((wish) => {
            const postHref = '/wishes/' + wish.wishesId;
            return (
              <HomePageWishCard
                key={wish.wishesId}
                name={wish.organization.name}
                title={wish.title}
                description={wish.description}
                imageUrl={wish.user.profileImageUrl}
                postedDateTime={wish.postedDateTime}
                href={postHref}
              />
            );
          })}
          <div style={{ margin: '0.5vh auto' }}>
            <Button size="small" asComponent={GreySubtleButton} onClick={handleViewAllButton}>
              <BlackText size="small">View all</BlackText>
            </Button>
          </div>
        </WishesColumn>
      );
    });
  };

  return (
    <TopWishesContainer>
      <ResponsiveTitle style={{ marginBottom: '1vh' }}>Top Categories</ResponsiveTitle>
      <Stack desktop={{ direction: 'row' }} direction="column" align="start" spacing="extraLoose">
        {AllCards()}
      </Stack>
    </TopWishesContainer>
  );
};

export default TopWishes;
