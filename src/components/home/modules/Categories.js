import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import SquareImageBox from '../../imageContainers/SquareImageBox';
import styled from 'styled-components';
import CarouselScrollButton from '../../buttons/CarouselScrollButton';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';

// The home page is structured using a grid and the row of categories has 
// 1fr of height space, so during initial load when the categories are not 
// populated from firestore, the categories row occupies less space which 
// makes the initial home page look smaller than it is after populating all data.
// The min-height property prevents that by having a height that matches
// the real height after populating the categories. Note that the min-height
// is the same as the SquareImageBox height.
const RowOfCategoriesContainer = styled.div`
  position: relative;
  display: flex;
  min-height: calc(75px + 2vw);
`;

const ScrollableRow = styled.div`
  width: 90vw;
  max-width: 1280px;
  overflow-x: scroll;
  scroll-behavior: smooth;
`;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getAllCategories().then((categories) => setCategories(categories));
  }, []);

  const getAllCategories = async () => {
    const rawCategories = await api.categories.getAll().catch((err) => console.error(err));
    return rawCategories.docs.map((doc) => doc.data());
  };

  const RowOfCategories = () => {
    const router = useRouter();
    return (
      <Stack direction="row" align="center" spacing="natural">
        {categories.map((category) => {
          const href = `/category/${category.id}`;
          const handleClickOnCategory = (event) => {
            event.preventDefault();
            router.push(href);
          };
          return (
            <a href={href} onClick={handleClickOnCategory} key={category.id}>
              <SquareImageBox imageUrl={category.imageUrl} caption={category.name} />
            </a>
          );
        })}
      </Stack>
    );
  };

  return (
    <RowOfCategoriesContainer>
      <Desktop>
        <CarouselScrollButton size="small" direction="left" scrollableId="scrollableCategory" />
      </Desktop>
      <ScrollableRow id="scrollableCategory">
        <RowOfCategories />
      </ScrollableRow>
      <Desktop>
        <CarouselScrollButton size="small" direction="right" scrollableId="scrollableCategory" />
      </Desktop>
    </RowOfCategoriesContainer>
  );
};
export default Categories;
