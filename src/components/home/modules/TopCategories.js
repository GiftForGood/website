import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Card, CardSection, Button, Text } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import styled from 'styled-components';
import BlackText from '../../text/BlackText';
import CardHeader from '../../card/CardHeader';
import GreySubtleButton from '../../buttons/GreySubtleButton';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import { dummyTopCategoriesAndTheirWishes } from '../../../../utils/dummyData/topCategoriesAndTheirWishes';
import { getTimeDifferenceFromNow } from '../../../../utils/api/time';

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
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  width: 100%;
`;

const ClickableDiv = styled.a`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
`;

const TwoLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 1.5em;
  max-height: 3em;
  font-size: 14px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: start;
  color: black;
`;

const CardDescription = ({ title, description }) => {
  return (
    <Stack direction="column" spacing="tight">
      <Text size="normal" weight="bold">
        {title}
      </Text>
      <TwoLineTextContainer>{description}</TwoLineTextContainer>
    </Stack>
  );
};

/**
 * TODO: implement and pass the distance between NPO and Donor
 */
const CardContent = ({ title, description, name, imageUrl, postedDateTime }) => {
  const timeAgo = getTimeDifferenceFromNow(postedDateTime);
  return (
    <div style={{ width: '100%', height: '100px' }}>
      <CardHeader name={name} imageUrl={imageUrl} timeAgo={timeAgo} />
      <CardDescription title={title} description={description} />
    </div>
  );
};

const CategoryHeader = ({ title }) => {
  return (
    <div style={{ width: '100%', height: 'fit-content' }}>
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

const TopCategories = ({ numberOfPosts, numberOfCategories }) => {
  const [topCategoriesAndTheirWishes, setTopCategoriesAndTheirWishes] = useState([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setTopCategoriesAndTheirWishes(dummyTopCategoriesAndTheirWishes);
    } else {
      getTopCategoriesAndTheirWishes(numberOfPosts, numberOfCategories);
    }
  }, []);

  const getTopCategoriesAndTheirWishes = (numberOfCategories, numberOfPosts) => {
    api.categories
      .getAll()
      .then((response) => {
        // get top {@numberOfCategories} categories
        const categories = [];
        response.docs.slice(0, numberOfCategories).forEach((doc) => categories.push(doc.data()));
        return categories;
      })
      .then((categories) => {
        // get {@numberOfPosts} wishes for each top categories
        getWishesForTopCategories(categories, numberOfPosts).then((topCategoriesAndTheirWishes) =>
          setTopCategoriesAndTheirWishes(topCategoriesAndTheirWishes)
        );
      })
      .catch((err) => {});
  };

  async function getWishesForTopCategories(categories, numberOfPosts) {
    let topCategoriesAndTheirWishes = [];
    for (let i = 0; i < categories.length; i++) {
      const response = await api.wishes.getTopNPendingWishes(categories[i].id, numberOfPosts);
      const category = categories[i];
      category.wishes = [];
      response.docs.forEach((doc) => category.wishes.push(doc.data()));
      topCategoriesAndTheirWishes = [...topCategoriesAndTheirWishes, category];
    }
    return topCategoriesAndTheirWishes;
  }

  const getTopNCategoryCards = () => {
    const router = useRouter();
    return topCategoriesAndTheirWishes.map((categoryWishes) => {
      const categoryHref = '/category/' + categoryWishes.id;
      const handleViewAllButton = (event) => {
        event.preventDefault();
        router.push(categoryHref);
      };
      return (
        <CardWrapper key={categoryWishes.id}>
          <Card header={<CategoryHeader title={categoryWishes.name} />}>
            {categoryWishes.wishes.map((wish) => {
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
                      postedDateTime={wish.postedDateTime}
                    />
                  }
                >
                  <ClickableDiv href={postHref} />
                </CardSection>
              );
            })}
            <Button size="small" asComponent={GreySubtleButton} onClick={handleViewAllButton}>
              <BlackText size="small">View all</BlackText>
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
