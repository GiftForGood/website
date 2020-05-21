import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import Categories from './Categories';
import WishCard from '../card/WishCard';
import BlackText from '../text/BlackText';
import GreySubtleButton from '../buttons/GreySubtleButton';
import { Stack, ChoiceGroup, Radio, Grid, Separator } from '@kiwicom/orbit-components/lib';
import * as WishesSortTypeConstant from '../../../utils/constants/wishesSortType';
import { WISHES_BATCH_SIZE } from '../../../utils/api/constants';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

const ViewCategoryContainer = styled.div`
  width: 90vw;
  max-width: 1280px;
  margin: 0 auto;
  margin-bottom: 40px;
`;

const WishesContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
  ${media.largeMobile(css`
    margin: 0;
  `)}
`;

const ButtonContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const ViewCategoryPage = ({ categoryDetails }) => {
  const category = categoryDetails;
  const [filter, setFilter] = useState(WishesSortTypeConstant.TIMESTAMP);
  // note that the wishes are in terms of documents, use data() to get data within
  const [allWishes, setAllWishes] = useState([]);
  const [hasAllLoaded, setHasAllLoaded] = useState(false);
  const [numberOfBatchesLoaded, setNumberOfBatchesLoaded] = useState(1);

  // toggled whenever filter changes, loads the same number of batches that were loaded previously, but with
  // a different filter
  useEffect(() => {
    getNBatchesOfWishes(category.id, filter, numberOfBatchesLoaded).then((newWishes) => {
      setAllWishes(newWishes);
    });
  }, [filter]);

  /**
   * TO ASK: do we need to have another api method that allows to specify the number of
   * documents to query, instead of the batch size? In this way, I don't need a for loop
   * and have multiple calls to firestore.
   */
  const getNBatchesOfWishes = async (categoryId, filter, numberOfBatchesLoaded) => {
    let rawWishes = [];
    for (let i = 0; i < numberOfBatchesLoaded; i++) {
      let nextBatchOfRawWishes = [];
      if (rawWishes.length === 0) {
        // get the first batch of wishes
        nextBatchOfRawWishes = await getNextBatchOfWishes(categoryId, filter, null).catch((err) => console.error(err));
      } else {
        // get the next batch of wishes w.r.t the last queried document
        const lastQueriedDocument = rawWishes[rawWishes.length - 1];
        nextBatchOfRawWishes = await getNextBatchOfWishes(categoryId, filter, lastQueriedDocument).catch((err) =>
          console.error(err)
        );
      }
      if (nextBatchOfRawWishes.length > 0) {
        rawWishes = rawWishes.concat(nextBatchOfRawWishes);
      }
    }
    return rawWishes;
  };

  /**
   * Note that this function returns WISHES_BATCH_SIZE - 1 amount of documents,
   * instead of WISHES_BATCH_SIZE, as the last document is to see whether we
   * have loaded all wishes.
   */
  const getNextBatchOfWishes = async (categoryId, filter, lastQueriedDocument) => {
    // only time stamp should be reversed as it is from newest to oldest
    const isReverse = filter === WishesSortTypeConstant.TIMESTAMP ? true : false;
    const rawWishes = await api.wishes
      .getPendingWishesForCategory(categoryId, filter, isReverse, lastQueriedDocument)
      .catch((err) => console.error(err));
    const numberOfDocumentsReturned = rawWishes.docs.length;
    if (numberOfDocumentsReturned < WISHES_BATCH_SIZE) {
      // loaded all documents already
      setHasAllLoaded(true);
      return rawWishes.docs;
    }
    // have not loaded all documents, returned WISHES_BATCH_SIZE - 1 of documents
    return rawWishes.docs.slice(0, WISHES_BATCH_SIZE - 1);
  };

  const displayAllWishes = () => {
    if (allWishes.length === 0) {
      return;
    }
    return allWishes.map((wish) => {
      const { wishesId, categories, organization, title, description, user, postedDateTime, isBumped } = wish.data();
      const postHref = `/wishes/${wishesId}`;
      const categoryTags = categories.map((category) => category.name);
      return (
        <WishCard
          key={wishesId}
          name={organization.name}
          title={title}
          description={description}
          profileImageUrl={user.profileImageUrl}
          postedDateTime={postedDateTime}
          postHref={postHref}
          categoryTags={categoryTags}
          isBumped={isBumped}
        />
      );
    });
  };

  const FilterBy = () => {
    const handleSelect = (event) => {
      setFilter(event.target.value);
    };
    return (
      <div style={{ marginTop: '20px' }}>
        <BlackText style={{ marginBottom: '10px' }} size="large">
          Filter By
        </BlackText>
        <Separator />
        <ChoiceGroup style={{ flexDirection: 'row' }} onChange={(event) => handleSelect(event)}>
          <Radio
            label="Newest - Oldest"
            checked={filter === WishesSortTypeConstant.TIMESTAMP}
            value={WishesSortTypeConstant.TIMESTAMP}
          />
          <Radio
            label="Nearest - Furthest"
            checked={filter === WishesSortTypeConstant.DISTANCE}
            value={WishesSortTypeConstant.DISTANCE}
          />
          <Radio
            label="NPOs (A - Z)"
            checked={filter === WishesSortTypeConstant.NPO_NAME}
            value={WishesSortTypeConstant.NPO_NAME}
          />
        </ChoiceGroup>
      </div>
    );
  };

  const handleOnClickSeeMore = () => {
    // TODO: load more wishes
    getNextBatchOfWishes(category.id, filter, allWishes[allWishes.length - 1]).then((newWishes) => {
      if (newWishes.length > 0) {
        setAllWishes(allWishes.concat(newWishes));
        setNumberOfBatchesLoaded(numberOfBatchesLoaded + 1);
      }
    });
  };

  return (
    <ViewCategoryContainer>
      <Categories />
      <Grid
        columnGap="20px"
        tablet={{
          columns: '1fr 5fr',
        }}
        rows="1fr auto"
      >
        <FilterBy />
        <div style={{ marginTop: '20px' }}>
          <BlackText style={{ marginBottom: '10px' }} size="large">
            {category.name}
          </BlackText>
          <WishesContainer>
            <Grid
              inline={true}
              largeDesktop={{
                columns: '1fr 1fr 1fr',
              }}
              largeMobile={{
                columns: '1fr 1fr',
              }}
              rows="auto"
              gap="20px"
              columns="1fr"
            >
              {displayAllWishes()}
            </Grid>
            <br />
            {!hasAllLoaded && (
              <ButtonContainer>
                <GreySubtleButton onClick={handleOnClickSeeMore} style={{ marginTop: '15px' }} type="normal">
                  <BlackText style={{ padding: '5px' }} size="medium">
                    See more
                  </BlackText>
                </GreySubtleButton>
              </ButtonContainer>
            )}
          </WishesContainer>
        </div>
      </Grid>
    </ViewCategoryContainer>
  );
};

export default ViewCategoryPage;
