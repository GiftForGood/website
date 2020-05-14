import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import { dummyCategories } from '../../../../utils/dummyData/categories';
import SquareImageBox from '../../imageContainers/SquareImageBox';
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
