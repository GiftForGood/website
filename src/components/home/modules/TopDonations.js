import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Button, Text } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api/index';
import styled from 'styled-components';
import BlackText from '../../text/BlackText';
import GreySubtleButton from '../../buttons/GreySubtleButton';
import DonationCard from '../../card/DonationCard';
import CarouselScrollButton from '../../buttons/CarouselScrollButton';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';

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
  display: flex;
`;

const TopDonationCardsContainer = styled.div`
  width: 100%;
`;

const TopDonations = ({ numberOfPosts, numberOfCategories }) => {
  const [topCategoriesAndTheirDonations, setTopCategoriesAndTheirDonations] = useState([]);

  useEffect(() => {
    getTopCategoriesAndTheirDonations(numberOfPosts, numberOfCategories).then((result) =>
      setTopCategoriesAndTheirDonations(result)
    );
  }, []);

  const getTopCategoriesAndTheirDonations = async (numberOfPosts, numberOfCategories) => {
    const topNCategories = await getTopNCategories(numberOfCategories);
    const donationsForTopCategories = await getDonationsForTopCategories(topNCategories, numberOfPosts);
    return mergeCategoriesAndDonations(topNCategories, donationsForTopCategories);
  };

  const getTopNCategories = async (numberOfCategories) => {
    const rawCategories = await api.categories.getAll().catch((err) => console.error(err));
    return rawCategories.docs.slice(0, numberOfCategories).map((doc) => doc.data());
  };

  const getDonationsForTopCategories = async (categories, numberOfPosts) => {
    let donationsForTopCategories = [];
    for (let i = 0; i < categories.length; i++) {
      const rawDonations = await api.donations
        .getTopNPendingDonationsForCategory(categories[i].id, numberOfPosts)
        .catch((err) => console.error(err));
      donationsForTopCategories = [...donationsForTopCategories, rawDonations.docs.map((doc) => doc.data())];
    }
    return donationsForTopCategories;
  };

  const mergeCategoriesAndDonations = (categories, donations) => {
    const merged = [];
    categories.forEach((category, i) => {
      merged.push({ category: category, donations: donations[i] });
    });
    return merged;
  };

  const TopDonationCards = () => {
    const router = useRouter();
    return topCategoriesAndTheirDonations.map((obj) => {
      const categoryHref = `/donations/category/${obj.category.id}`;
      const handleViewAllButton = (event) => {
        event.preventDefault();
        router.push(categoryHref);
      };
      return (
        <TopDonationCardsContainer key={obj.category.id}>
          <CategoryHeader>
            <LeftAnchor>
              <Text size="normal" weight="bold">
                {obj.category.name}
              </Text>
            </LeftAnchor>
            <RightAnchor>
              <Button size="small" asComponent={GreySubtleButton} onClick={handleViewAllButton}>
                <BlackText size="small">View all</BlackText>
              </Button>
            </RightAnchor>
          </CategoryHeader>
          <CarouselContainer>
            <Desktop>
              <CarouselScrollButton direction="left" size="normal" scrollableId={obj.category.id} />
            </Desktop>
            <DonationsRow id={obj.category.id} className="scrollableDonation">
              <Stack direction="row" align="start" spacing="extraLoose">
                {obj.donations.map((donation) => {
                  const donationPostHref = `/donations/${donation.donationId}`;
                  const locations = donation.locations.map((location) => {
                    return location.name;
                  });
                  return (
                    <DonationCard
                      key={donation.donationId}
                      name={donation.user.userName}
                      title={donation.title}
                      description={donation.description}
                      profileImageUrl={donation.user.profileImageUrl}
                      postedDateTime={donation.postedDateTime}
                      coverImageUrl={donation.coverImageUrl}
                      postHref={donationPostHref}
                      location={locations.join(', ')}
                    ></DonationCard>
                  );
                })}
              </Stack>
            </DonationsRow>
            <Desktop>
              <CarouselScrollButton direction="right" size="normal" scrollableId={obj.category.id} />
            </Desktop>
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
