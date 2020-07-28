import React from 'react';
import styled from 'styled-components';
import { Stack, CardSection, Text } from '@kiwicom/orbit-components/lib';
import { getTimeDifferenceFromNow } from '../../../utils/api/time';
import CardHeader from './CardHeader';
import { useRouter } from 'next/router';

const ClickableDiv = styled.a`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
`;

const OneLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 1.5em;
  max-height: 1.5em;
  font-size: 14px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-word;
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
  word-break: break-word;
`;

const CardContentContainer = styled.div`
  width: 100%;
  height: 100px;
`;

const CardDescription = ({ title, description }) => {
  return (
    <Stack direction="column" spacing="tight">
      <OneLineTextContainer>
        <Text size="normal" weight="bold">
          {title}
        </Text>
      </OneLineTextContainer>
      <TwoLineTextContainer>{description}</TwoLineTextContainer>
    </Stack>
  );
};

/**
 * TODO: implement and pass the distance between NPO and Donor
 */
const CardContent = ({ name, imageUrl, title, description, postedDateTime }) => {
  const timeAgo = getTimeDifferenceFromNow(postedDateTime);
  return (
    <CardContentContainer>
      <div style={{ marginBottom: '1vh' }}>
        <CardHeader name={name} imageUrl={imageUrl} timeAgo={timeAgo} />
      </div>
      <CardDescription title={title} description={description} />
    </CardContentContainer>
  );
};

/**
 *
 * @param {string} id is the wish post id
 * @param {string} name is the NPO organization name
 * @param {string} title is the title of the wish
 * @param {string} description is the description of the wish
 * @param {string} imageUrl is the url to the avatar image of the NPO user
 * @param {string} postedDateTime is the time posted for wish in milliseconds
 * @param {string} postHref is the link url to direct users to after clicking the wish card
 * @param {string} categoryId is the category id
 * @param {string} categoryName is the category name of the wish currently displayed in
 */
const GroupWishCard = ({ name, title, description, imageUrl, postedDateTime, postHref, categoryId, categoryName }) => {
  const router = useRouter();
  const handleOnClickWishPost = (event) => {
    event.preventDefault();
    router.push({
      pathname: postHref,
      query: { categoryId: categoryId, categoryName: categoryName },
    });
  };
  return (
    <CardSection
      header={
        <CardContent
          name={name}
          title={title}
          description={description}
          imageUrl={imageUrl}
          postedDateTime={postedDateTime}
        />
      }
    >
      <ClickableDiv href={postHref} onClick={handleOnClickWishPost} />
    </CardSection>
  );
};

export default GroupWishCard;
