import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Button, Text } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import styled from 'styled-components';
import BlackText from '../../text/BlackText';
import GreySubtleButton from '../../buttons/GreySubtleButton';
import DonationCard from '../../card/DonationCard';
import { dummyTopCategoriesAndTheirDonations } from '../../../../utils/dummyData/topCategoriesAndTheirDonations';
import CarouselScrollButton from '../../buttons/CarouselScrollButton';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const CategoryHeader = styled.div`
  align-items: center;
  display: flex;
`;

const LeftAnchor = styled.div`
  float: left;
  margin: 0px auto 0px 0px;
`;

const RightAnchor = styled.div`
  float: right;
`;

const DonationsRow = styled.div`
  max-width: 1280px;
  overflow-x: scroll;
  scroll-behavior: smooth;
  position: relative;
  padding: 10px 3px 10px 3px;
`;

const CarouselContainer = styled.div`
  position: relative;
`;

const TopDonationCardsContainer = styled.div`
  width: 100%;
`;

const TopDonations = ({ numberOfPosts, numberOfCategories }) => {
  const [topCategoriesAndTheirDonations, setTopCategoriesAndTheirDonations] = useState([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setTopCategoriesAndTheirDonations(dummyTopCategoriesAndTheirDonations);
    } else {
      getTopCategoriesAndTheirDonations(numberOfPosts, numberOfCategories);
    }
  }, []);

  // async function getTopCategoriesAndTheirDonations(numberOfCategories, numberOfPosts) {
  //   const topNCategories = await getTopNCategories(numberOfCategories);
  //   const donationsForTopCategories = await getDonationsForTopCategories(topNCategories, numberOfPosts);
  //   return combineCategoriesWithTheirDonations(topNCategories, donationsForTopCategories);
  // };

  // async function getTopNCategories(numberOfCategories) {
  //   const rawCategories = await api.categories.getAll();
  //   return rawCategories.docs.slice(0, numberOfCategories).map((doc) => doc.data());
  // }

  // async function getDonationsForTopCategories(categories, numberOfPosts) {
  //   let donationsForTopCategories = [];
  //   for (let i = 0; i < categories.length; i++) {
  //     const rawDonations = await api.donations.getTopNPendingDonations(categories[i].id, numberOfPosts);
  //     const donations = rawDonations.docs.map((doc) => doc.data());
  //     donationsForTopCategories = [...donationsForTopCategories, donations];
  //   }
  //   return donationsForTopCategories;
  // }

  // const combineCategoriesWithTheirDonations = (categories, donations) => {
  //   const combined = [];
  //   categories.forEach((category, i) => {
  //     const categoryAndDonations = {};
  //     categoryAndDonations.category = category;
  //     categoryAndDonations.donations = donations[i];
  //     combined.push(categoryAndDonations);
  //   });
  //   return combined;
  // }

  const getTopCategoriesAndTheirDonations = (numberOfCategories, numberOfPosts) => {
    api.categories
      .getAll()
      .then((response) => {
        // get top {@numberOfCategories} categories
        const categories = [];
        response.docs.slice(0, numberOfCategories).forEach((doc) => categories.push(doc.data()));
        return categories;
      })
      .then((categories) => {
        // get {@numberOfPosts} donations for each top categories
        getDonationsForTopCategories(categories, numberOfPosts).then((topCategoriesAndTheirWishes) =>
          setTopCategoriesAndTheirDonations(topCategoriesAndTheirWishes)
        );
      })
      .catch((err) => console.error(err));
  };

  async function getDonationsForTopCategories(categories, numberOfPosts) {
    let topCategoriesAndTheirDonations = [];
    for (let i = 0; i < categories.length; i++) {
      const response = await api.donations.getTopNPendingDonations(categories[i].id, numberOfPosts);
      const category = categories[i];
      category.donations = [];
      response.docs.forEach((doc) => category.wishes.push(doc.data()));
      topCategoriesAndTheirDonations = [...topCategoriesAndTheirDonations, category];
    }
    return topCategoriesAndTheirDonations;
  }

  const TopDonationCards = () => {
    const router = useRouter();
    const { isDesktop } = useMediaQuery();
    return topCategoriesAndTheirDonations.map((categoryDonations) => {
      const categoryHref = `/category/${categoryDonations.id}`;
      const handleViewAllButton = (event) => {
        event.preventDefault();
        router.push(categoryHref);
      };
      return (
        <TopDonationCardsContainer key={categoryDonations.id}>
          <CategoryHeader>
            <LeftAnchor>
              <Text size="normal" weight="bold">
                {categoryDonations.name}
              </Text>
            </LeftAnchor>
            <RightAnchor>
              <Button size="small" asComponent={GreySubtleButton} onClick={handleViewAllButton}>
                <BlackText size="small">View all</BlackText>
              </Button>
            </RightAnchor>
          </CategoryHeader>
          <CarouselContainer>
            {isDesktop && <CarouselScrollButton direction="left" size="normal" scrollableId={categoryDonations.id} />}
            <DonationsRow id={categoryDonations.id}>
              <Stack direction="row" align="start" spacing="extraLoose">
                {categoryDonations.donations.map((donation) => {
                  const donationPostHref = `/donations/${donation.donationId}`;
                  return (
                    <DonationCard
                      name={donation.user.userName}
                      title={donation.title}
                      description={donation.description}
                      profileImageUrl={donation.user.profileImageUrl}
                      postedDateTime={donation.postedDateTime}
                      coverImageUrl={donation.coverImageUrl}
                      postHref={donationPostHref}
                      location="NUS SoC"
                    ></DonationCard>
                  );
                })}
              </Stack>
            </DonationsRow>
            {isDesktop && <CarouselScrollButton direction="right" size="normal" scrollableId={categoryDonations.id} />}
          </CarouselContainer>
        </TopDonationCardsContainer>
      );
    });
  };

  return (
    <Stack direction="column" align="start" spacing="natural">
      {TopDonationCards()}
    </Stack>
  );
};

export default TopDonations;
