import React, { useState, useEffect } from 'react';
import { Stack, Card, CardSection, Button } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import styled from 'styled-components';

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

const CenteredButton = styled.div`
  margin: 0.5vh auto;
`;

const GreySubtleButton = styled.button`
  border: 0.5px solid #707070;
  border-radius: 25px;
  font-size: 10px;
  background: Transparent;
  text-align: center;
  margin: 0.5vh auto;

  :active {
    border-color: 1px solid #707070;
    background: Transparent;
    color: #707070;
	}

	:hover {
		border-color: 1px solid #707070;
    background: Transparent;
    color: #707070;
  }
  
  :focus {
		box-shadow: 0 0 0 3px #707070;
	}
`;

const TopCategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 3px;
  box-shadow: 0px 0px 2px 0px rgba(37, 42, 49, 0.16), 0px 1px 4px 0px rgba(37, 42, 49, 0.12);
  width: 100%;
`;

const GreyText = styled.div`
  color: #707070;
`;


const dummyWishesForTopThreeCategories = [
  [
    {
      user: {
        profileImageUrl: 'url',
        userName: 'hello',
        userId: 'id',
      },
      organization: {
        latitude: '102',
        longitude: '103',
        name: 'james',
      },
      postedDateTime: 1231321,
      description: 'Post',
      title: '1.1',
      wishesId: '1232wqqe2r4',
    },
    {
      user: {
        profileImageUrl: 'url',
        userName: 'hello',
        userId: 'id',
      },
      organization: {
        latitude: '102',
        longitude: '103',
        name: 'james',
      },
      postedDateTime: 1231321,
      description: 'Post',
      title: '1.2',
      wishesId: '1232e2rcxz4',
    },
    {
      user: {
        profileImageUrl: 'url',
        userName: 'hello',
        userId: 'id',
      },
      organization: {
        latitude: '102',
        longitude: '103',
        name: 'james',
      },
      postedDateTime: 1231321,
      description: 'Post',
      title: '1.3',
      wishesId: '1232fdge2r4',
    },
  ],
  [
    {
      user: {
        profileImageUrl: 'url',
        userName: 'hello',
        userId: 'id',
      },
      organization: {
        latitude: '102',
        longitude: '103',
        name: 'james',
      },
      postedDateTime: 1231321,
      description: 'Post',
      title: '2.1',
      wishesId: '12wew32e2r4',
    },
    {
      user: {
        profileImageUrl: 'url',
        userName: 'hello',
        userId: 'id',
      },
      organization: {
        latitude: '102',
        longitude: '103',
        name: 'james',
      },
      postedDateTime: 1231321,
      description: 'Post',
      title: '2.2',
      wishesId: '1232fdsfde2r4',
    },
    {
      user: {
        profileImageUrl: 'url',
        userName: 'hello',
        userId: 'id',
      },
      organization: {
        latitude: '102',
        longitude: '103',
        name: 'james',
      },
      postedDateTime: 1231321,
      description: 'Post',
      title: '2.3',
      wishesId: '1232fdse2r4',
    },
  ],
  [
    {
      user: {
        profileImageUrl: 'url',
        userName: 'hello',
        userId: 'id',
      },
      organization: {
        latitude: '102',
        longitude: '103',
        name: 'james',
      },
      postedDateTime: 1231321,
      description: 'Post',
      title: '3.1',
      wishesId: '1232efds2r4',
    },
    {
      user: {
        profileImageUrl: 'url',
        userName: 'hello',
        userId: 'id',
      },
      organization: {
        latitude: '102',
        longitude: '103',
        name: 'james',
      },
      postedDateTime: 1231321,
      description: 'Post',
      title: '3.2',
      wishesId: '123few2e2r4',
    },
    {
      user: {
        profileImageUrl: 'url',
        userName: 'hello',
        userId: 'id',
      },
      organization: {
        latitude: '102',
        longitude: '103',
        name: 'james',
      },
      postedDateTime: 1231321,
      description: 'Post',
      title: '3.3',
      wishesId: '1232fdse2r4',
    },
  ],
];

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
    return dummyWishesForTopThreeCategories.map((categoryWishes, i) => {
      return (
        <TopCategoryCard key={topThreeCategories[i]}>
          <Card
          title={topThreeCategories[i]}
          asComponent={TopCategoryCard}
          >
          {categoryWishes.map((wish) => {
            return (
              <CardSection key={wish.wishesId} title={wish.organization.name}>
                {wish.title + ' ' + wish.description}
              </CardSection>
            );
          })}
            <CenteredButton>
              <Button size="small" asComponent={GreySubtleButton} onClick={function () {}}>
                <GreyText>
                  View all
                </GreyText>
              </Button>
            </CenteredButton>
          </Card>
        </TopCategoryCard>
      );
    });
  };

  return (
    <TopCategoriesContainer>
      <ResizableTitle style={{ marginBottom: '1vh' }}>Top Categories</ResizableTitle>
      <Stack desktop={{ direction: 'row' }} direction="column" align="center">
        {getWishesForCategories()}
      </Stack>
    </TopCategoriesContainer>
  );
};

export default TopCategories;
