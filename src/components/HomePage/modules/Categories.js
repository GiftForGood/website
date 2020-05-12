import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import SquareImageBox from '../../ImageHolder/SquareImageBox';
import styled from 'styled-components';

const Container = styled.div`
  margin: 0 auto;
`;

const ResizableTitle = styled.div`
  font-size: calc(10px + 0.5vw);
  font-weight: bold;
  margin-bottom: 10px;
`;

const ScrollableRow = styled.div`
  width: fit-content;
  max-width: 95vw;
  overflow-x: scroll;
`;

const dummyCategoriesData = [
  {
    iconUrl: 'url',
    id: '1234',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'necessities',
  },
  {
    iconUrl: 'url',
    id: '123435',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'furniture',
  },
  {
    iconUrl: 'url',
    id: '12546543',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'house',
  },
  {
    iconUrl: 'url',
    id: '15454623',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'flat',
  },
  {
    iconUrl: 'url',
    id: '123423423',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'flrewrewdsat',
  },
  {
    iconUrl: 'url',
    id: '126587683',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'flatdsdfds',
  },
  {
    iconUrl: 'url',
    id: '987',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'dasdsad',
  },
  {
    iconUrl: 'url',
    id: '1298793',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'eqrewq',
  },
  {
    iconUrl: 'url',
    id: '129873',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'dfsf',
  },
  {
    iconUrl: 'url',
    id: '12798873',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'dasddfssad',
  },
];

const Categories = () => {
  const [categoriesObj, setCategoriesObj] = useState({});
  useEffect(() => {
    // setCategoriesObj(api.categories.getAll());
  });

  const RowOfCategories = () => {
    const router = useRouter();
    return (
      <Stack direction="row" align="center">
        {dummyCategoriesData.map((category) => {
          const href = '/category/' + category.name;
          const handleClick = (event) => {
            event.preventDefault();
            router.push(href);
          };
          return (
            <a href={href} onClick={handleClick} key={category.id}>
              <SquareImageBox imageUrl={category.imageUrl} caption={category.name} />
            </a>
          );
        })}
      </Stack>
    );
  };

  return (
    <Container>
      <ResizableTitle>Explore GiftForGood</ResizableTitle>
      <ScrollableRow>
        <RowOfCategories />
      </ScrollableRow>
    </Container>
  );
};

export default Categories;
