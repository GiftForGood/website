import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import SquareImageBox from '../../imageContainers/SquareImageBox';
import styled from 'styled-components';
import CarouselScrollButton from '../../buttons/CarouselScrollButton';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import { allCategoriesImagePath } from '../../../../utils/constants/imagePaths';
import CategoryImageBox from '../../imageContainers/CategoryImageBox';

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

const Clickable = styled.a`
  text-decoration: none;
`;

// To represent the category for all wishes, note that it does not have id property
const allCategory = {
  imageUrl: allCategoriesImagePath,
  name: 'All',
};

/**
 * @param {string} type can be 'wishes' or 'donations'
 */
const Categories = ({ type }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getAllCategories().then((newCategories) => {
      newCategories.unshift(allCategory); // add the 'all' to the front of array
      setCategories(newCategories);
    });
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
          const href = category.id ? `/${type}/category/${category.id}` : `/${type}/category`;
          const handleOnClickCategory = (event) => {
            event.preventDefault();
            router.push(href);
          };
          return (
            <Clickable href={href} onClick={handleOnClickCategory} key={category.name}>
              <CategoryImageBox imageUrl={category.imageUrl} caption={category.name} />
            </Clickable>
          );
        })}
      </Stack>
    );
  };

  const scrollableId = 'scrollableCategory';
  const getScrollableWidth = () => document.getElementById(scrollableId).clientWidth;
  const handleScrollLeft = () => (document.getElementById(scrollableId).scrollLeft -= getScrollableWidth());
  const handleScrollRight = () => (document.getElementById(scrollableId).scrollLeft += getScrollableWidth());

  return (
    <RowOfCategoriesContainer>
      <Desktop>
        <CarouselScrollButton size="small" direction="left" onClickHandler={handleScrollLeft} />
      </Desktop>
      <ScrollableRow id="scrollableCategory">
        <RowOfCategories />
      </ScrollableRow>
      <Desktop>
        <CarouselScrollButton size="small" direction="right" onClickHandler={handleScrollRight} />
      </Desktop>
    </RowOfCategoriesContainer>
  );
};
export default Categories;
