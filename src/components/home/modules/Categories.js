import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import { dummyCategories } from '../../../../utils/dummyData/categories';
import SquareImageBox from '../../imageContainers/SquareImageBox';
import styled from 'styled-components';
import CarouselScrollButton from '../../buttons/CarouselScrollButton';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';

const CarouselContainer = styled.div`
  position: relative;
`;

// need the padding so that hovering each category will be able to zoom out
const ScrollableRow = styled.div`
  width: 90vw;
  max-width: 1280px;
  overflow-x: scroll;
  scroll-behavior: smooth;
`;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') {
    // use dummy data so that we don't incur a lot of reads while in development
    setCategories(dummyCategories);
    // } else {
    //   getAllCategories();
    // }
  }, []);

  const getAllCategories = () => {
    api.categories
      .getAll()
      .then((response) => {
        const data = [];
        response.docs.forEach((doc) => data.push(doc.data()));
        setCategories(data);
      })
      .catch((err) => console.error(err));
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
    <CarouselContainer>
      <Desktop>
        <CarouselScrollButton size="small" direction="left" scrollableId="scrollableCategory" />
      </Desktop>
      <ScrollableRow id="scrollableCategory">
        <RowOfCategories />
      </ScrollableRow>
      <Desktop>
        <CarouselScrollButton size="small" direction="right" scrollableId="scrollableCategory" />
      </Desktop>
    </CarouselContainer>
  );
};
export default Categories;
