import React, { useState, useEffect } from 'react';
import { Stack, Card, CardSection, Text } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import styled from 'styled-components';

const TopCategoriesContainer = styled.div`
  text-align: center;
`;

const ResizableTitle = styled.div`
  font-size: calc(10px + 1vw);
  font-weight: bold;
`;

const TopCategories = () => {
  const topThreeCategories = ['apparel', 'electronics', 'furniture'];
  const [wishesOfTopThreeCategories, setWishesOfTopThreeCategories] = useState([]);
  const numberOfCategories = 3;

  // useEffect(() => {
  //   setWishesOfTopThreeCategories(
  //     topThreeCategories.map((category) => {
  //       api.wishes.getTopNPendingWishes(category, numberOfCategories);
  //     })
  //   );
  // });

  const getWishesForCategories = () => {
    wishesOfTopThreeCategories.map((category) => {
      <Card></Card>;
    });
  };

  return (
    <TopCategoriesContainer>
      <ResizableTitle>
        Top Categories
      </ResizableTitle>
      <Stack largeDesktop={{ direction: 'row' }} largeMobile={{ direction: 'column' }} align="center">
        {getWishesForCategories()}
      </Stack>
    </TopCategoriesContainer>
  );
};

export default TopCategories;
