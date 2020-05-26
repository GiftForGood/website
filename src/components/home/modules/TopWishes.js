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
  // assumes that there are only 3 top categories
  const [firstTopCategoryAndWishes, setFirstTopCategoryAndWishes] = useState({});
  const [secondTopCategoryAndWishes, setSecondTopCategoryAndWishes] = useState({});
  const [thirdTopCategoryAndWishes, setThirdTopCategoryAndWishes] = useState({});
  const router = useRouter();

  useEffect(() => {
    getTopCategories(numberOfCategories).then((categories) => {
      // set all three top categories and their wishes in parallel
      getTopWishesForCategory(categories[0], numberOfPosts).then((result) => {
        setFirstTopCategoryAndWishes(result);
      });
      getTopWishesForCategory(categories[1], numberOfPosts).then((result) => {
        setSecondTopCategoryAndWishes(result);
      });
      getTopWishesForCategory(categories[2], numberOfPosts).then((result) => {
        setThirdTopCategoryAndWishes(result);
      });
    });
  }, []);

  const getTopCategories = async (numberOfCategories) => {
    const rawCategories = await api.categories.getAll().catch((err) => console.error(err));
    return rawCategories.docs.slice(0, numberOfCategories).map((doc) => doc.data());
  };

  const getTopWishesForCategory = async (category, numberOfPosts) => {
    const rawWishes = await api.wishes
      .getTopNPendingWishes(category.id, numberOfPosts)
      .catch((err) => console.error(err));
    return { category: category, wishes: rawWishes.docs.map((doc) => doc.data()) };
  };

  const TopWishesColumn = (topCategoryAndWishes) => {
    // haven't loaded the data yet
    if (Object.keys(topCategoryAndWishes).length === 0) {
      return;
    }
    const { category, wishes } = topCategoryAndWishes;
    const categoryHref = `/wishes/category/${category.id}`;
    const handleViewAllButton = (event) => {
      event.preventDefault();
      router.push(categoryHref);
    };
    return (
      <WishesColumn key={category.id}>
        <CategoryHeader title={category.name}></CategoryHeader>
        {wishes.map((wish) => {
          const wishPostHref = `/wishes/${wish.wishesId}`;
          return (
            <GroupWishCard
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
  };

  return (
    <Stack desktop={{ direction: 'row' }} direction="column" align="start" spacing="extraLoose">
      {TopWishesColumn(firstTopCategoryAndWishes)}
      {TopWishesColumn(secondTopCategoryAndWishes)}
      {TopWishesColumn(thirdTopCategoryAndWishes)}
    </Stack>
  );
};

export default TopWishes;
