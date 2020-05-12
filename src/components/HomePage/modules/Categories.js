import React, { useState, useEffect } from 'react';
import { Stack, Text } from '@kiwicom/orbit-components/lib';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import api from '../../../../utils/api/index';
import styled from 'styled-components';

const Container = styled.div`
  margin: 0 auto;
`;

const CategoryBox = styled.div`
  width: calc(75px + 2vw);
  height: calc(75px + 2vw);
  min-width: 75px;
  min-height: 75px;
  border-radius: 1vw;
  background-color: black;
  position: relative;
`;

const ResizableTitle = styled.div`
  font-size: calc(10px + 0.5vw);
  font-weight: bold;
`;

const CategoryNameInBox = styled.div`
  position: absolute;
  top: 80%;
  left: 10%;
`;

const ScrollableRow = styled.div`
  width: fit-content;
  max-width: 95vw;
  overflow-x: scroll;
`;

const dummyCategoriesData = [
  {
    iconUrl: 'url',
    id: '123',
    imageUrl: '123',
    name: 'necessities',
  },
  {
    iconUrl: 'url',
    id: '123',
    imageUrl: '123',
    name: 'furniture',
  },
  {
    iconUrl: 'url',
    id: '123',
    imageUrl: '123',
    name: 'house',
  },
  {
    iconUrl: 'url',
    id: '123',
    imageUrl: '123',
    name: 'flat',
  },
  {
    iconUrl: 'url',
    id: '123',
    imageUrl: '123',
    name: 'flrewrewdsat',
  },
  {
    iconUrl: 'url',
    id: '123',
    imageUrl: '123',
    name: 'flatdsdfds',
  },
  {
    iconUrl: 'url',
    id: '123',
    imageUrl: '123',
    name: 'dasdsad',
  },
  {
    iconUrl: 'url',
    id: '123',
    imageUrl: '123',
    name: 'eqrewq',
  },
  {
    iconUrl: 'url',
    id: '123',
    imageUrl: '123',
    name: 'dfsf',
  },
  {
    iconUrl: 'url',
    id: '123',
    imageUrl: '123',
    name: 'dasddfssad',
  },
];

const Categories = () => {
  const [categoriesObj, setCategoriesObj] = useState({});
  useEffect(() => {
    // setCategoriesObj(api.categories.getAll());
  });

  const CategoryRow = () => {
    return (
      <Stack direction="row" align="center">
        {dummyCategoriesData.map((category) => (
          <CategoryBox key={category.name}>
            <Text type="white">{category.imageUrl}</Text>
            <Desktop>
              <CategoryNameInBox>
                <Text type="white">{category.name}</Text>
              </CategoryNameInBox>
            </Desktop>
            <Mobile>
              <CategoryNameInBox>
                <Text type="white" size="small">
                  {category.name}
                </Text>
              </CategoryNameInBox>
            </Mobile>
          </CategoryBox>
        ))}
      </Stack>
    );
  };

  return (
    <Container>
      <ResizableTitle>Explore GiftForGood</ResizableTitle>
      <ScrollableRow>
        <CategoryRow />
      </ScrollableRow>
    </Container>
  );
};

export default Categories;
