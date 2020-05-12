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
      <Avatar imageUrl={imageUrl} />
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
      user: {
        profileImageUrl: '/assets/wishes-banner.jpg',
        userName: 'hello',
        userId: 'id',
      },
      organization: {
        latitude: '102',
        longitude: '103',
        name: 'james',
      },
      postedDateTime: 1231321,
      description: 'Rice supply running out for a family of 5… ',
      title: 'Rice Supplies',
      wishesId: '1232wqqe2r4',
    },
    {
      user: {
        profileImageUrl: '/assets/wishes-banner.jpg',
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
        profileImageUrl: '/assets/wishes-banner.jpg',
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
        profileImageUrl: '/assets/wishes-banner.jpg',
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
        profileImageUrl: '/assets/wishes-banner.jpg',
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
        profileImageUrl: '/assets/wishes-banner.jpg',
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
        profileImageUrl: '/assets/wishes-banner.jpg',
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
        profileImageUrl: '/assets/wishes-banner.jpg',
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
        profileImageUrl: '/assets/wishes-banner.jpg',
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

  const getTopNCategoryCards = () => {
    const router = useRouter();
    return dummyWishesForTopThreeCategories.map((categoryWishes, i) => {
      const categoryHref = '/category/' + topThreeCategories[i];
      const handleClick = (event) => {
        event.preventDefault();
        router.push(categoryHref);
      };
      return (
        <CardWrapper key={topThreeCategories[i]}>
          <Card header={<CategoryHeader title={topThreeCategories[i]} />}>
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
      <Stack desktop={{ direction: 'row' }} direction="column" align="center" spacing="extraLoose">
        {getTopNCategoryCards()}
      </Stack>
    </TopCategoriesContainer>
  );
};

export default TopCategories;
