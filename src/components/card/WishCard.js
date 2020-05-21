import CardHeader from '../card/CardHeader';
import { Stack, Text, Grid } from '@kiwicom/orbit-components/lib';
import { getTimeDifferenceFromNow } from '../../../utils/api/time';
import GreyText from '../text/GreyText';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import { colors } from '../../../utils/constants/colors';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  width: 275px;
  height: 300px;
  min-width: 275px;
  min-height: 300px;
  ${media.desktop(css`
    width: calc(275px + 5vw);
    height: calc(300px + 5vw);
    min-width: 275px;
    min-height: 300px;
  `)}
  position: relative;
`;

const CardHeaderContainer = styled.div`
  padding: 10px;
  display: flex;
`;

const FiveLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 1.5em;
  max-height: 7.5em;
  font-size: 14px;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
`;

const CardDescriptionContainer = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
`;

const CardDescriptionFooterContainer = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const ClickableDiv = styled.a`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
`;

const TagContainer = styled.div`
  text-align: center;
  width: 90px;
  height: 30px;
  border-radius: 25px;
  background-color: ${colors.categoryTagsFill};
  border: 1px solid ${colors.subtleGrey};
`;

const CardDescription = ({ title, description }) => {
  return (
    <Stack direction="column" spacing="tight">
      <Text size="normal" weight="bold">
        {title}
      </Text>
      <FiveLineTextContainer>{description}</FiveLineTextContainer>
    </Stack>
  );
};

const Tags = ({ categoryTags }) => {
  return (
    <Stack row="1fr 1fr 1fr" rowGap="natural">
      {categoryTags.map((category) => {
        return (
          <TagContainer key={category}>
            <GreyText style={{ verticalAlign: 'middle', lineHeight: '30px' }} size="tiny">
              {category}
            </GreyText>
          </TagContainer>
        );
      })}
    </Stack>
  );
};

/**
 *
 * @param {string} name is the NPO organization's name
 * @param {string} title is the title of the wish
 * @param {string} description is the description of the wish
 * @param {string} profileImageUrl is the url to the avatar image of the wish user
 * @param {string} postedDateTime is the time posted for wish in milliseconds
 * @param {string} postHref is the link url to direct users to after clicking the donation card
 * @param {string[]} categoryTags are the category names that the wish is under
 * @param {boolean} isBumped is whether the wish post is bumped
 */
const WishCard = ({ name, title, description, profileImageUrl, postedDateTime, postHref, categoryTags, isBumped }) => {
  const timeAgo = getTimeDifferenceFromNow(postedDateTime);
  const router = useRouter();
  const handleOnClickWishPost = (event) => {
    event.preventDefault();
    router.push(postHref);
  };
  return (
    <CardContainer>
      <Grid style={{ height: '100%' }} rows="2fr 6fr 2fr" cols="1fr">
        <CardHeaderContainer>
          <CardHeader name={name} imageUrl={profileImageUrl} timeAgo={timeAgo} isBumped={isBumped} />
        </CardHeaderContainer>
        <CardDescriptionContainer>
          <CardDescription title={title} description={description} />
        </CardDescriptionContainer>
        <CardDescriptionFooterContainer>
          <Tags categoryTags={categoryTags} />
        </CardDescriptionFooterContainer>
      </Grid>
      <ClickableDiv href={postHref} onClick={handleOnClickWishPost} />
    </CardContainer>
  );
};

export default WishCard;
