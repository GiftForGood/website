import React, { useState, useEffect } from 'react';
import CardHeader from '../card/CardHeader';
import { Stack, Text, Grid } from '@kiwicom/orbit-components/lib';
import { getTimeDifferenceFromNow } from '@api/time';
import GreyText from '../text/GreyText';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { PENDING } from '@constants/postStatus';
import DonationCardStatus from './DonationCardStatus';
import { colors } from '@constants/colors';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  width: 300px;
  height: 400px;
  min-width: 300px;
  min-height: 400px;
  ${media.desktop(css`
    width: 350px;
    height: 450px;
    min-width: 350px;
    min-height: 450px;
  `)}
  position: relative;
`;

const CardHeaderContainer = styled.div`
  padding: 10px 20px 10px 20px;
  display: flex;
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
  word-break: break-word;
`;

// note that card image container takes 3/6 fractions of the entire height of card
const CardImageContainer = styled.div`
  height: 100%;
  width: 100%;
  min-height: calc(3 * 400px / 6);
  max-height: calc(3 * 400px / 6);
  ${media.desktop(css`
    min-height: calc(3 * 450px / 6);
    max-height: calc(3 * 450px / 6);
  `)}
  position: relative;
  background-color: ${colors.imageLoadingBackground};
`;

const CardImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const CardDescriptionContainer = styled.div`
  margin: 10px 20px 10px 20px;
  display: flex;
  flex-direction: column;
`;

const CardDescriptionFooterContainer = styled.div`
  bottom: 0;
  text-align: start;
`;

const ClickableDiv = styled.a`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
`;

const CardDescription = ({ title, description }) => {
  return (
    <Stack direction="column" spacing="tight">
      <OneLineTextContainer>
        <Text size="normal" weight="bold">
          {title}
        </Text>
      </OneLineTextContainer>
      <TwoLineTextContainer>
        <pre>{description}</pre>
      </TwoLineTextContainer>
    </Stack>
  );
};

const CardDescriptionFooter = ({ validPeriod, itemCondition }) => {
  return (
    <>
      <GreyText size="small">Valid period: {validPeriod || 'N.A.'}</GreyText>
      <GreyText size="small">Condition: {itemCondition}</GreyText>
    </>
  );
};

/**
 *
 * @param {string} name is the donor's user name
 * @param {string} title is the title of the donation
 * @param {string} description is the description of the donation
 * @param {string} profileImageUrl is the url to the avatar image of the donor user
 * @param {object | string} coverImageUrl is the url(s) to the cover image of the donation post
 * @param {string} postedDateTime is the time posted for donation in milliseconds
 * @param {string} postHref is the link url to direct users to after clicking the donation card
 * @param {string} itemCondition is the condition of the donation item
 * @param {string} status is the current status of the donation post, if not provided, the status won't be shown in card
 * @param {string} validPeriod is the validity period of the donation post
 * @param {string} categoryId is the category id
 * @param {string} categoryName is the category name of the donation currently displayed in
 */
const DonationCard = ({
  name,
  title,
  description,
  profileImageUrl,
  coverImageUrl,
  postedDateTime,
  postHref,
  profileHref,
  itemCondition,
  status = null,
  validPeriod,
  categoryId,
  categoryName,
  onClick,
}) => {
  const [hasImage, setHasImage] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const timeAgo = getTimeDifferenceFromNow(postedDateTime);
  const router = useRouter();

  const handleOnClickDonationPost = (event) => {
    event.preventDefault();
    onClick();
    router.push({
      pathname: postHref,
      query: { categoryId: categoryId, categoryName: categoryName },
    });
  };

  const handleImageOnError = () => {
    setHasImage(false);
    setImageUrl(coverImageUrl.raw);
    setHasImage(true);
  };

  useEffect(() => {
    if (coverImageUrl) {
      setHasImage(true);
      // Checks if its Firebase URL
      if (typeof coverImageUrl === 'object' && coverImageUrl !== null) {
        setImageUrl(coverImageUrl.small);
      } else {
        setImageUrl(coverImageUrl);
      }
    } else {
      setHasImage(false);
    }
  }, [coverImageUrl]);

  return (
    <CardContainer>
      <Grid style={{ height: '100%' }} rows="1fr 3fr 2fr" cols="1fr">
        <CardHeaderContainer>
          <CardHeader name={name} imageUrl={profileImageUrl} timeAgo={timeAgo} profileHref={profileHref} />
        </CardHeaderContainer>
        <CardImageContainer>
          {hasImage ? <CardImage src={imageUrl} loading="lazy" onError={handleImageOnError} /> : null}

          {/* status label will only be shown if status is provided and it is not pending */}
          {status != null && status != PENDING && <DonationCardStatus status={status} />}
        </CardImageContainer>
        <CardDescriptionContainer>
          <CardDescription title={title} description={description} />
          <CardDescriptionFooterContainer>
            <CardDescriptionFooter validPeriod={validPeriod} itemCondition={itemCondition} />
          </CardDescriptionFooterContainer>
        </CardDescriptionContainer>
      </Grid>
      <ClickableDiv href={postHref} onClick={handleOnClickDonationPost} />
    </CardContainer>
  );
};

export default DonationCard;
