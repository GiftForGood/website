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
import { getFormattedDate } from '../../../../utils/api/time';

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
  // assumes that there are only 3 top categories
  const [firstTopCategoryAndDonations, setFirstTopCategoryAndDonations] = useState({});
  const [secondTopCategoryAndDonations, setSecondTopCategoryAndDonations] = useState({});
  const [thirdTopCategoryAndDonations, setThirdTopCategoryAndDonations] = useState({});
  const router = useRouter();

  useEffect(() => {
    getTopNCategories(numberOfCategories).then((categories) => {
      // set all three top categories and their donations in parallel
      getTopDonationForCategory(categories[0], numberOfPosts).then((result) => {
        setFirstTopCategoryAndDonations(result);
      });
      getTopDonationForCategory(categories[1], numberOfPosts).then((result) => {
        setSecondTopCategoryAndDonations(result);
      });
      getTopDonationForCategory(categories[2], numberOfPosts).then((result) => {
        setThirdTopCategoryAndDonations(result);
      });
    });
  }, []);

  const getTopDonationForCategory = async (category, numberOfPosts) => {
    const rawDonations = await api.donations
      .getTopNPendingDonationsForCategory(category.id, numberOfPosts)
      .catch((err) => console.error(err));
    return { category: category, donations: rawDonations.docs.map((doc) => doc.data()) };
  };

  const getTopNCategories = async (numberOfCategories) => {
    const rawCategories = await api.categories.getAll().catch((err) => console.error(err));
    return rawCategories.docs.slice(0, numberOfCategories).map((doc) => doc.data());
  };

  const TopDonationsRow = (topCategoryAndDonations) => {
    // haven't loaded the data yet
    if (Object.keys(topCategoryAndDonations).length === 0) {
      return;
    }
    const { category, donations } = topCategoryAndDonations;
    const categoryHref = `/donations/category/${category.id}`;
    const handleViewAllButton = (event) => {
      event.preventDefault();
      router.push(categoryHref);
    };
    const getScrollableWidth = () => document.getElementById(category.id).clientWidth;
    const handleScrollLeft = () => (document.getElementById(category.id).scrollLeft -= getScrollableWidth());
    const handleScrollRight = () => (document.getElementById(category.id).scrollLeft += getScrollableWidth());
    return (
      <TopDonationCardsContainer key={category.id}>
        <CategoryHeader>
          <LeftAnchor>
            <Text size="normal" weight="bold">
              {category.name}
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
            <CarouselScrollButton direction="left" size="normal" onClickHandler={handleScrollLeft} />
          </Desktop>
          <DonationsRow id={category.id} className="scrollableDonation">
            <Stack direction="row" align="start" spacing="extraLoose">
              {donations.map((donation) => {
                const donationPostHref = `/donations/${donation.donationId}`;
                const locations = donation.locations.map((location) => {
                  return location.name;
                });
                const validPeriod = `${getFormattedDate(donation.validPeriodFrom)} - ${getFormattedDate(
                  donation.validPeriodTo
                )}`;
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
                    validPeriod={validPeriod}
                    locations={locations.join(', ')}
                  ></DonationCard>
                );
              })}
            </Stack>
          </DonationsRow>
          <Desktop>
            <CarouselScrollButton direction="right" size="normal" onClickHandler={handleScrollRight} />
          </Desktop>
        </CarouselContainer>
      </TopDonationCardsContainer>
    );
  };

  return (
    <Stack direction="column" align="start" spacing="natural">
      {TopDonationsRow(firstTopCategoryAndDonations)}
      {TopDonationsRow(secondTopCategoryAndDonations)}
      {TopDonationsRow(thirdTopCategoryAndDonations)}
    </Stack>
  );
};

export default TopDonations;
