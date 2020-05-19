import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Button, Text } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import styled, { css } from 'styled-components';
import BlackText from '../../text/BlackText';
import HomePageWishCard from '../../card/HomePageWishCard';
import GreySubtleButton from '../../buttons/GreySubtleButton';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

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
  const [topCategoriesAndTheirWishes, setTopCategoriesAndTheirWishes] = useState([]);

  useEffect(() => {
    getTopCategoriesAndTheirWishes(numberOfPosts, numberOfCategories).then((result) =>
      setTopCategoriesAndTheirWishes(result)
    );
  }, []);

  const getTopCategoriesAndTheirWishes = async (numberOfPosts, numberOfCategories) => {
    const topCategories = await getTopCategories(numberOfCategories);
    const topWishes = await getTopWishesForCategories(topCategories, numberOfPosts);
    return mergeCategoriesAndWishes(topCategories, topWishes);
  };

  const getTopCategories = async (numberOfCategories) => {
    const rawCategories = await api.categories.getAll().catch((err) => console.error(err));
    return rawCategories.docs.slice(0, numberOfCategories).map((doc) => doc.data());
  };

  const getTopWishesForCategories = async (categories, numberOfPosts) => {
    let wishes = [];
    for (let i = 0; i < categories.length; i++) {
      const rawWishes = await api.wishes
        .getTopNPendingWishes(categories[i].id, numberOfPosts)
        .catch((err) => console.error(err));
      wishes = [...wishes, rawWishes.docs.map((doc) => doc.data())];
    }
    return wishes;
  };

  const mergeCategoriesAndWishes = (categories, wishes) => {
    const merged = [];
    categories.forEach((category, i) => {
      merged.push({ category: category, wishes: wishes[i] });
    });
    return merged;
  };

  const TopWishCards = () => {
    const router = useRouter();
    return topCategoriesAndTheirWishes.map((obj) => {
      const categoryHref = `/category/${obj.category.id}`;
      const handleViewAllButton = (event) => {
        event.preventDefault();
        router.push(categoryHref);
      };
      return (
        <WishesColumn key={obj.category.id}>
          <CategoryHeader title={obj.category.name}></CategoryHeader>
          {obj.wishes.map((wish) => {
            const wishPostHref = `/wishes/${wish.wishesId}`;
            return (
              <HomePageWishCard
                key={wish.wishesId}
                name={wish.organization.name}
                title={wish.title}
                description={wish.description}
                imageUrl={wish.user.profileImageUrl}
                postedDateTime={wish.postedDateTime}
                postHref={wishPostHref}
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
    });
  };

  return (
    <Stack desktop={{ direction: 'row' }} direction="column" align="start" spacing="extraLoose">
      {TopWishCards()}
    </Stack>
  );
};

export default TopWishes;
