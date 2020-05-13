import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Card, CardSection, Button, Text } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import styled from 'styled-components';
import Avatar from '../../ImageHolder/Avatar';
import GreySubtleButton from '../../Button/Button';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';

const TopCategoriesContainer = styled.div`
  text-align: center;
  width: 90%;
  margin: 0 auto;
  margin-bottom: 2vh;
`;

const ResizableTitle = styled.div`
  font-size: calc(10px + 0.5vw);
  font-weight: bold;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 3px;
  box-shadow: 0px 0px 10px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  width: 100%;
`;

const GreyText = styled.div`
  color: #707070;
`;

const CardHeaderContainer = styled.div`
  display: inline-block;
  width: 100%;
  margin-bottom: 1vh;
`;

const ClickableDiv = styled.a`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
`;

const AvatarDetails = ({ name, distance }) => {
  return (
    <div style={{ width: 'fit-content', float: 'left', margin: '0 auto', marginLeft: '5px' }}>
      <Stack direction="column" spacing="extraTight">
        <Text size="small">{name}</Text>
        <Text size="small">{distance}km away</Text>
      </Stack>
    </div>
  );
};

const TimePosted = ({ numberOfHoursAgo }) => {
  return (
    <div style={{ float: 'right' }}>
      <Text size="small">{numberOfHoursAgo} hour(s) ago</Text>
    </div>
  );
};

const CardHeader = ({ name, imageUrl }) => {
  return (
    <CardHeaderContainer>
      <div style={{ float: 'left' }}>
        <Avatar imageUrl={imageUrl} />
      </div>
      <AvatarDetails name={name} distance="2.5" />
      <TimePosted numberOfHoursAgo="1" />
    </CardHeaderContainer>
  );
};

const CardDescription = ({ title, description }) => {
  return (
    <Stack direction="column" spacing="tight">
      <Text size="normal" weight="bold">
        {title}
      </Text>
      <Text as="small">{description}</Text>
    </Stack>
  );
};

const CardContent = ({ title, description, name, imageUrl }) => {
  return (
    <div style={{ width: '100%' }}>
      <CardHeader name={name} imageUrl={imageUrl} />
      <CardDescription title={title} description={description} />
    </div>
  );
};

const CategoryHeader = ({ title }) => {
  return (
    <div style={{ width: '100%' }}>
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
    </div>
  );
};

const dummyWishesForTopThreeCategories = [
  [
    {
      "expireDateTime": 1591894762124,
      "wishesId": "OJxYnK5jhQrG1quNg08y",
      "user": {
        "userId": "5oBhU2SGiKEKOzNLa2zt",
        "userName": "hello world",
        "profileImageUrl": "https://res.cloudinary.com/giftforgood/image/upload/v1589378414/profile.jpg"
      },
      "categories": [
        {
          "name": "Food",
          "iconUrl": "food_icon",
          "imageUrl": "https://res.cloudinary.com/giftforgood/image/upload/v1588842129/food.jpg",
          "id": "LokORpW2MEKJx1ayG3h6"
        },
        {
          "name": "Daily Necessities",
          "iconUrl": "dailynecessities_icon",
          "imageUrl": "https://res.cloudinary.com/giftforgood/image/upload/v1588842156/dailynecessities.jpg",
          "id": "3ZurlkyhxGG6jYiuzoKB"
        }
      ],
      "postedDateTime": 1589216362124,
      "description": "Tamago",
      "isBumped": false,
      "status": "pending",
      "updatedDateTime": 1589216362124,
      "title": "Eggs Supplies",
      "lastActionByUserDateTime": 1589216362124,
      "organization": {
        "address": "Queenstown MRT",
        "latitude": "1.294835",
        "name": "name",
        "longitude": "103.805901"
      }
    },
    {
      "updatedDateTime": 1589217667843,
      "title": "Rice Supplies",
      "lastActionByUserDateTime": 1589216337607,
      "organization": {
        "address": "Queenstown MRT",
        "latitude": "1.294835",
        "name": "name",
        "longitude": "103.805901"
      },
      "expireDateTime": 1591894737607,
      "user": {
        "profileImageUrl": "https://res.cloudinary.com/giftforgood/image/upload/v1589378414/profile.jpg",
        "userId": "5oBhU2SGiKEKOzNLa2zt",
        "userName": "hello world"
      },
      "wishesId": "AMydcz5OjklcBRMZeN1L",
      "categories": [
        {
          "name": "Food",
          "iconUrl": "food_icon",
          "imageUrl": "https://res.cloudinary.com/giftforgood/image/upload/v1588842129/food.jpg",
          "id": "LokORpW2MEKJx1ayG3h6"
        }
      ],
      "postedDateTime": 1589216337607,
      "description": "I need rice",
      "isBumped": false,
      "status": "pending"
    }
  ],
  [
    {
      "isBumped": false,
      "status": "pending",
      "wishesId": "gjodjpc2oYgQvNJO3Tlp",
      "user": {
        "profileImageUrl": "https://res.cloudinary.com/giftforgood/image/upload/v1589378414/profile.jpg",
        "userId": "5oBhU2SGiKEKOzNLa2zt",
        "userName": "hello world"
      },
      "categories": [
        {
          "name": "Furniture",
          "iconUrl": "fake_url",
          "imageUrl": "https://res.cloudinary.com/giftforgood/image/upload/v1588842161/furniture.jpg",
          "id": "svFwKXrxv0KFkPc5oh95"
        }
      ],
      "lastActionByUserDateTime": {
        "seconds": 1589299200,
        "nanoseconds": 0
      },
      "postedDateTime": {
        "seconds": 1589299200,
        "nanoseconds": 0
      },
      "organization": {
        "latitude": "1.2936",
        "name": "Happiness NGO",
        "longitude": "103.7845",
        "address": "Kent Ridge"
      },
      "title": "Tables",
      "description": "I need tables",
      "expireDateTime": {
        "seconds": 1589904000,
        "nanoseconds": 0
      }
    }
  ],
  [
    {
      "updatedDateTime": 1589216145488,
      "title": "Macbook Pro",
      "lastActionByUserDateTime": 1589216145488,
      "organization": {
        "name": "name",
        "longitude": "103.805901",
        "address": "Queenstown MRT",
        "latitude": "1.294835"
      },
      "expireDateTime": 1591894545488,
      "user": {
        "userId": "5oBhU2SGiKEKOzNLa2zt",
        "userName": "hello world",
        "profileImageUrl": "https://res.cloudinary.com/giftforgood/image/upload/v1589378414/profile.jpg"
      },
      "wishesId": "QmJfzd8LngQrlJfIiQNe",
      "categories": [
        {
          "name": "Electronics",
          "iconUrl": "fake_url",
          "imageUrl": "https://res.cloudinary.com/giftforgood/image/upload/v1588842147/electronic.jpg",
          "id": "IwmfcaTjKqrnviMxHQ5G"
        }
      ],
      "postedDateTime": 1589216145488,
      "description": "The new macbook pro 16-inch. 16GB RAM",
      "status": "pending",
      "isBumped": false
    }
  ]
];

const TopCategories = ({ numberOfPosts, numberOfCategories }) => {
  const topThreeCategoriesId = ['LokORpW2MEKJx1ayG3h6', 'svFwKXrxv0KFkPc5oh95', 'IwmfcaTjKqrnviMxHQ5G'];
  const topThreeCategoriesName = ['Food', 'Furniture', 'Electronics'];
  const [wishesOfTopThreeCategories, setWishesOfTopThreeCategories] = useState([]);


  const getTopNCategoryCards = () => {
    const router = useRouter();
    return dummyWishesForTopThreeCategories.map((categoryWishes, i) => {
      const categoryHref = '/category/' + topThreeCategoriesId[i];
      const handleClick = (event) => {
        event.preventDefault();
        router.push(categoryHref);
      };
      return (
        <CardWrapper key={topThreeCategoriesId[i]}>
          <Card header={<CategoryHeader title={topThreeCategoriesName[i]} />}>
            {categoryWishes.map((wish) => {
              const postHref = '/wishes/' + wish.wishesId;
              return (
                <CardSection
                  key={wish.wishesId}
                  header={
                    <CardContent
                      name={wish.organization.name}
                      title={wish.title}
                      description={wish.description}
                      imageUrl={wish.user.profileImageUrl}
                    />
                  }
                >
                  <ClickableDiv href={postHref} onClick={handleClick} />
                </CardSection>
              );
            })}
            <Button size="small" asComponent={GreySubtleButton} onClick={handleClick}>
              <GreyText>View all</GreyText>
            </Button>
          </Card>
        </CardWrapper>
      );
    });
  };

  return (
    <TopCategoriesContainer>
      <ResizableTitle style={{ marginBottom: '1vh' }}>Top Categories</ResizableTitle>
      <Stack desktop={{ direction: 'row' }} direction="column" align="start" spacing="extraLoose">
        {getTopNCategoryCards()}
      </Stack>
    </TopCategoriesContainer>
  );
};

export default TopCategories;
