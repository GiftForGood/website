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

const CategoryHeader = styled.div`
  align-items: center;
  display: flex;
  padding: 10px;
`;

const LeftAnchor = styled.div`
  float: left;
  margin: 0px auto 0px 5px;
`;

const RightAnchor = styled.div`
  float: right;
`;

const DonationsRow = styled.div`
  width: fit-content;
  max-width: 90vw;
  overflow-x: hidden;
  scroll-behavior: smooth;
  position: relative;
  padding: 10px;
`;

const CarouselContainer = styled.div`
  position: relative;
`;

const TopDonations = ({ numberOfPosts, numberOfCategories }) => {
  const [topCategoriesAndTheirDonations, setTopCategoriesAndTheirDonations] = useState([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setTopCategoriesAndTheirDonations(dummyTopCategoriesAndTheirDonations);
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
    return topCategoriesAndTheirDonations.map((categoryDonations) => {
      const categoryHref = '/category/' + categoryDonations.id;
      const handleViewAllButton = (event) => {
        event.preventDefault();
        router.push(categoryHref);
      };
      return (
        <div key={categoryDonations.id}>
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
            <CarouselScrollButton direction="left" size="normal" scrollableId={categoryDonations.id} />
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
            <CarouselScrollButton direction="right" size="normal" scrollableId={categoryDonations.id} />
          </CarouselContainer>
        </div>
      );
    });
  };

  return (
    <Stack direction="column" align="start" spacing="extraLoose">
      {TopDonationCards()}
    </Stack>
  );
};

export default TopDonations;
