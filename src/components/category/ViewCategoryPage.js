import React, { useState } from 'react';
import api from '../../../utils/api';
import Categories from './Categories';
import WishCard from '../card/WishCard';
import BlackText from '../text/BlackText';
import GreySubtleButton from '../buttons/GreySubtleButton';
import { Stack, ChoiceGroup, Radio, Grid, Separator } from '@kiwicom/orbit-components/lib';
import * as WishesSortTypeConstant from '../../../utils/constants/wishesSortType';
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

const ViewCategoryPage = ({ categoryDetails, firstBatchOfWishes }) => {
  const category = categoryDetails;
  const [filter, setFilter] = useState(WishesSortTypeConstant.TIMESTAMP);
  const [allWishes, setAllWishes] = useState(firstBatchOfWishes);

  const displayAllWishes = () => {
    return allWishes.map((wish) => {
      const postHref = `/wishes/${wish.wishesId}`;
      const categoryTags = wish.categories.map((category) => category.name);
      return (
        <WishCard
          key={wish.wishesId}
          name={wish.organization.name}
          title={wish.title}
          description={wish.description}
          profileImageUrl={wish.user.profileImageUrl}
          postedDateTime={wish.postedDateTime}
          postHref={postHref}
          categoryTags={categoryTags}
          isBumped={wish.isBumped}
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
            <ButtonContainer>
              <GreySubtleButton style={{ marginTop: '15px' }} type="normal">
                <BlackText style={{ padding: '5px' }} size="medium">
                  See more
                </BlackText>
              </GreySubtleButton>
            </ButtonContainer>
          </WishesContainer>
        </div>
      </Grid>
    </ViewCategoryContainer>
  );
};

export default ViewCategoryPage;
