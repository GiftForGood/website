import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack, Button, Text } from '@kiwicom/orbit-components/lib';
import api from '@api';
import styled from 'styled-components';
import BlackText from '../../text/BlackText';
import GreySubtleButton from '../../buttons/GreySubtleButton';
import DonationCard from '../../card/DonationCard';
import CarouselScrollButton from '../../buttons/CarouselScrollButton';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import { getFormattedDate } from '@api/time';

import { InstantSearch, connectHits, Configure } from 'react-instantsearch-dom';
import { getByCategoryIdAndStatus } from '@utils/algolia/filteringRules';
import { getTopNCategoriesFromAlgolia, sortObjectEntries } from './algoliaHelpers';
import { searchClient } from '@utils/algolia';

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
  const router = useRouter();
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    getTopNCategories().then((categories) => {
      getTopNCategoriesFromAlgolia('donations').then(({ hits, facets }) => {
        if (facets['categories.id'] === undefined || Object.keys(facets['categories.id']).length === 0) {
          return;
        }
        const sorted = sortObjectEntries(facets['categories.id']);
        if (sorted.length >= numberOfCategories) {
          const topNCategoriesIds = sorted.slice(0, numberOfCategories);
          const topNCategories = categories.filter((category) => {
            if (topNCategoriesIds.includes(category.id)) {
              return true;
            }
            return false;
          });
          setTopCategories(topNCategories);
        } else if (sorted.length > 0 && sorted.length < numberOfCategories) {
          const topCategories = categories.filter((category) => {
            if (sorted.includes(category.id)) {
              return true;
            }
            return false;
          });
          setTopCategories(topCategories);
        }
      });
    });
  }, []);

  const getTopNCategories = async () => {
    const rawCategories = await api.categories.getAll().catch((err) => console.error(err));
    return rawCategories.docs.map((doc) => doc.data());
  };

  const TopDonationsRow = ({ hits, category }) => {
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
              {hits.map((donation) => {
                const donationPostHref = `/donations/${donation.objectID}`;
                const profileHref = `/profile/${donation.user.userId}`;
                const validPeriod = `${getFormattedDate(donation.validPeriodFrom)} - ${getFormattedDate(
                  donation.validPeriodTo
                )}`;
                return (
                  <DonationCard
                    key={`${category.id}-${donation.objectID}`}
                    name={donation.user.userName}
                    title={donation.title}
                    description={donation.description}
                    profileImageUrl={donation.user.profileImageUrl}
                    postedDateTime={donation.postedDateTime}
                    coverImageUrl={donation.coverImageUrl}
                    postHref={donationPostHref}
                    profileHref={profileHref}
                    validPeriod={validPeriod}
                    itemCondition={donation.itemCondition}
                    categoryId={category.id}
                    categoryName={category.name}
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

  const TopCategories = connectHits(TopDonationsRow);

  return (
    <Stack direction="column" align="start" spacing="natural">
      {topCategories.map((category) => (
        <InstantSearch searchClient={searchClient} indexName="donations">
          <TopCategories category={category} />
          <Configure filters={getByCategoryIdAndStatus(category.id, 'pending')} hitsPerPage={numberOfPosts} />
        </InstantSearch>
      ))}
    </Stack>
  );
};

export default TopDonations;
