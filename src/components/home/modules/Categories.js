import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Button } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import { dummyCategories } from '../../../../utils/dummyData/categories';
import SquareImageBox from '../../imageContainers/SquareImageBox';
import styled from 'styled-components';
import { ChevronRight, ChevronLeft } from "@kiwicom/orbit-components/lib/icons";

const Container = styled.div`
  margin: 0 auto;
`;

const CarouselContainer = styled.div`
  position: relative;
`;

const ResizableTitle = styled.div`
  font-size: calc(10px + 0.5vw);
  font-weight: bold;
  margin-bottom: 10px;
`;

const ScrollableRow = styled.div`
  width: fit-content;
  max-width: 95vw;
  overflow-x: hidden;
  scroll-behavior: smooth;
`;

const CarouselButton = styled.div`
  border: 0.5px solid white;
  border-radius: 25px;
  font-size: 10px;
  background: white;
  opacity: 50%;
  text-align: center;
  margin: 0.5vh auto;

  :hover {
    border-color: 1px solid white;
    opacity: 80%;
  }

  :focus {
    box-shadow: 0 0 0 3px #707070;
  }
`;

const CarouselArrow = styled.div`
  ${(props) => props.direction === "left" ? "left: -10px" : "right: -10px"};
  position: absolute;
  top: 50%;
  z-index: 10;
  width: fit-content;
  height: fit-content;
  transform: translate(0, -50%);
  background-color: 'grey';
`

const Categories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // use dummy data so that we don't incur a lot of reads while in development
      setCategories(dummyCategories);
    } else {
      getAllCategories();
    }
  }, []);

  const getAllCategories = () => {
    api.categories
      .getAll()
      .then((response) => {
        const data = [];
        response.docs.forEach((doc) => data.push(doc.data()));
        setCategories(data);
      })
      .catch((err) => {});
  };

  const RowOfCategories = () => {
    const router = useRouter();
    return (
      <Stack direction="row" align="center">
        {categories.map((category) => {
          const href = `/category/${category.id}`;
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

  const getScrollableWidth = () => document.getElementById('scrollableCategory').clientWidth;

  const scrollLeft = () => document.getElementById('scrollableCategory').scrollLeft -= getScrollableWidth();

  const scrollRight = () => document.getElementById('scrollableCategory').scrollLeft += getScrollableWidth();

  return (
    <Container>
      <ResizableTitle>Explore GiftForGood</ResizableTitle>
      <CarouselContainer>
        <CarouselArrow direction="left">
          <Button circled iconLeft={<ChevronLeft />} asComponent={CarouselButton} onClick={scrollLeft} type="white" size="small" />
        </CarouselArrow>
        <ScrollableRow id="scrollableCategory">
          <RowOfCategories />
        </ScrollableRow>
        <CarouselArrow direction="right">
          <Button circled iconLeft={<ChevronRight />} asComponent={CarouselButton} onClick={scrollRight} type="white" size="small" />
        </CarouselArrow>
      </CarouselContainer>
    </Container>
  );
};
export default Categories;
