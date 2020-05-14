import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
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

const dummyCategoriesData = [
  {
    iconUrl: 'dailynecessities_icon',
    name: 'Daily Necessities',
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588842156/dailynecessities.jpg',
    id: '3ZurlkyhxGG6jYiuzoKB',
  },
  {
    iconUrl: 'stationery_icon',
    name: 'Stationery',
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588842198/stationery.jpg',
    id: '49yM4ELhrrFWr6phmP8d',
  },
  {
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588838805/toysandgames.jpg',
    id: 'GYYRGfzyq67KIj17gVwZ',
    name: 'Toys and Games',
    iconUrl: 'toysandgames_icon',
  },
  {
    iconUrl: 'fake_url',
    name: 'Electronics',
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588842147/electronic.jpg',
    id: 'IwmfcaTjKqrnviMxHQ5G',
  },
  {
    iconUrl: 'food_icon',
    name: 'Food',
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588842129/food.jpg',
    id: 'LokORpW2MEKJx1ayG3h6',
  },
  {
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588838797/sportequipment.jpg',
    id: 'QGnaiZt0eoGIMVQZ4qwn',
    name: 'Sport Equipment',
    iconUrl: 'N.A.',
  },
  {
    name: 'Others',
    iconUrl: 'N.A.',
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588838786/other.jpg',
    id: 'QRniNylLwFLDmQByh9BA',
  },
  {
    id: 'bYh4RKtS4grMNIzBsM4o',
    name: 'Medical Equipment',
    iconUrl: 'N.A.',
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588838774/medicalequipment.jpg',
  },
  {
    id: 'fw6cW4v1m8haLe5rSix4',
    name: 'Apparel',
    iconUrl: 'fake',
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588842183/apparel.jpg',
  },
  {
    id: 'k5rck4Q08gHvtRncXhJE',
    iconUrl: 'icon',
    name: 'Baby Needs',
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588842133/babyneeds.jpg',
  },
  {
    name: 'Kitchenware',
    iconUrl: 'N.A.',
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588842219/kitchenware.jpg',
    id: 'l61OrCHqvqagENbJr6BY',
  },
  {
    iconUrl: 'fake_url',
    name: 'Furniture',
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1588842161/furniture.jpg',
    id: 'svFwKXrxv0KFkPc5oh95',
  },
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // when testing, remove this as we can just use our dummy data
    // api.categories
    //   .getAll()
    //   .then((response) => {
    //     const data = [];
    //     response.docs.forEach((doc) => {
    //       data.push(doc.data());
    //     });
    //     setCategories(data);
    //     console.log(data);
    //   })
    //   .catch((err) => {})

    // when not testing, remove this
    setCategories(dummyCategoriesData);
  }, []);

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
