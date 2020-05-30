import React, { useState } from 'react';
import CardHeader from '../card/CardHeader';
import { Stack, Text, Grid, Modal, ModalSection, ModalHeader, ModalFooter, Badge } from '@kiwicom/orbit-components/lib';
import { getTimeDifferenceFromNow } from '../../../utils/api/time';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import Button from '@kiwicom/orbit-components/lib/Button';
import moment from 'moment';
import api from '../../../utils/api';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  width: 315px;
  height: 350px;
  min-width: 315px;
  min-height: 350px;
  text-align: left;
  ${media.desktop(css`
    width: 345px;
    height: 400px;
    min-width: 345px;
    min-height: 400px;
  `)}
  position: relative;
`;

const CardHeaderContainer = styled.div`
  padding: 10px;
  display: flex;
`;

const ThreeLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 1.5em;
  max-height: 4.5em;
  font-size: 14px;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const EightLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 1.5em;
  max-height: 12em;
  font-size: 14px;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
`;

const CardDescriptionContainer = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
`;

const CardDescriptionFooterContainer = styled.div`
  margin: 10px;
  ${media.desktop(css`
    margin: 14px;
  `)}
  display: flex;
  align-items: center;
`;

const ClickableDiv = styled.a`
  position: absolute;
  width: 100%;
  height: ${props => props.isMine ? "82" : "100"}%;
  top: 0;
  left: 0;
  z-index: 1;
`;

const BadgeWrapper = styled.div`
  margin-bottom: 8px !important;
`;

const CardDescription = ({ title, description }) => {
  return (
    <Stack direction="column" spacing="tight">
      <ThreeLineTextContainer>
        <Text size="normal" weight="bold">
          {title}
        </Text>
      </ThreeLineTextContainer>
      <EightLineTextContainer>{description}</EightLineTextContainer>
    </Stack>
  );
};

const Tags = ({ categoryTags, wishId }) => {
  return (
    <Stack direction="row" wrap={true} spacing="condensed" desktop={{ spacing: 'natural' }}>
      {categoryTags.map((category) => {
        return (
          <BadgeWrapper key={`${wishId}-${category}`}>
            <Badge type="neutral">{category}</Badge>
          </BadgeWrapper>
        );
      })}
    </Stack>
  );
};

/**
 *
 * @param {number} index is the index of the card in the array
 * @param {string} wishId is the wish's id
 * @param {string} name is the NPO organization's name
 * @param {string} title is the title of the wish
 * @param {string} description is the description of the wish
 * @param {string} profileImageUrl is the url to the avatar image of the wish user
 * @param {string} postedDateTime is the time posted for wish in milliseconds
 * @param {string} postHref is the link url to direct users to after clicking the wish card
 * @param {string[]} categoryTags are the category names that the wish is under
 * @param {boolean} isBumped is whether the wish post is bumped
 * @param {string} expireDateTime is the expire date time of the post
 * @param {function} bumpCallback is to update the caller past wishes
 * @param {boolean} isMine is to know if the card belongs to the user
 */
const WishCard = ({
  index,
  wishId,
  name,
  title,
  description,
  profileImageUrl,
  postedDateTime,
  postHref,
  categoryTags = [],
  isBumped,
  expireDateTime,
  bumpCallback,
  isMine,
}) => {
  const [openBumpModal, setOpenBumpModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const timeAgo = getTimeDifferenceFromNow(postedDateTime);
  const router = useRouter();
  const handleOnClickWishPost = (event) => {
    event.preventDefault();
    router.push(postHref);
  };
  const newExpiryDateTime = moment(expireDateTime).add(1, 'week').format('DD MMM YYYY');

  const onBumpCardClick = () => {
    setOpenBumpModal(true);
  };

  const onCloseModal = () => {
    setOpenBumpModal(false);
  };

  const onBumpClicked = () => {
    setLoading(true);
    api.wishes
      .bumpWish(wishId)
      .then((updatedWish) => {
        setOpenBumpModal(false);
        bumpCallback(index, updatedWish);
      })
      .catch((error) => {
        setOpenBumpModal(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <CardContainer>
        <Grid style={{ height: '100%', paddingLeft: '10px', paddingRight: '10px' }} rows="2fr 6fr 2fr" cols="1fr">
          <CardHeaderContainer>
            <CardHeader name={name} imageUrl={profileImageUrl} timeAgo={timeAgo} isBumped={isBumped} />
          </CardHeaderContainer>
          <CardDescriptionContainer>
            <CardDescription title={title} description={description} />
          </CardDescriptionContainer>
          <CardDescriptionFooterContainer>
            {isMine ? (
              <Button fullWidth disabled={isBumped} onClick={onBumpCardClick}>
                Bump
              </Button>
            ) : (
              <Tags categoryTags={categoryTags} wishId={wishId} />
            )}
          </CardDescriptionFooterContainer>
        </Grid>
        <ClickableDiv href={postHref} onClick={handleOnClickWishPost} isMine={isMine}/>
      </CardContainer>

      {openBumpModal ? (
        <Modal size="small" onClose={onCloseModal}>
          <ModalHeader title="Bump your Wish"></ModalHeader>
          <ModalSection>
            <Text>
              Bumping your post means that your wish will expire <u>1 week</u> later than the stipulated date.
            </Text>
            <br />
            <Text>
              Wish will now expire on: <strong>{newExpiryDateTime}</strong>
            </Text>
          </ModalSection>
          <ModalFooter flex={['0 0 auto', '1 1 100%']}>
            <Button type="secondary" onClick={onCloseModal}>
              Cancel
            </Button>
            <Button fullWidth loading={loading} onClick={onBumpClicked}>
              Bump
            </Button>
          </ModalFooter>
        </Modal>
      ) : null}
    </>
  );
};

export default WishCard;
