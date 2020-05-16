import CardHeader from '../card/CardHeader';
import { Stack, Text, Grid } from '@kiwicom/orbit-components/lib';
import { getTimeDifferenceFromNow } from '../../../utils/api/time';
import GreyText from '../text/GreyText';
import styled from 'styled-components';
import { defaultPostImagePath } from '../../../utils/constants/imagePaths';
import { useRouter } from 'next/router';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  width: 350px;
  height: 450px;
  min-width: 350px;
  min-height: 450px;
  position: relative;
`;

const CardHeaderContainer = styled.div`
  margin: 10px 10px 0 10px;
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
  text-align: start;
  color: black;
`;

const CardImage = styled.div`
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  height: 100%;
  width: 100%;
  background-position: center;
`;

const CardDescriptionContainer = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
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
      <Text size="normal" weight="bold">
        {title}
      </Text>
      <ThreeLineTextContainer>{description}</ThreeLineTextContainer>
    </Stack>
  );
};

const CardDescriptionFooter = ({ validPeriod, location }) => {
  return (
    <div style={{ bottom: 0 }}>
      <GreyText size="small">Valid period: {validPeriod}</GreyText>
      <GreyText size="small">Location: {location}</GreyText>
    </div>
  );
};

/**
 *
 * @param {string} name is the donor's user name
 * @param {string} title is the title of the donation
 * @param {string} description is the description of the donation
 * @param {string} profileImageUrl is the url to the avatar image of the donor user
 * @param {string} coverImageUrl is the url to the cover image of the donation post
 * @param {string} postedDateTime is the time posted for donation in milliseconds
 * @param {string} postHref is the link url to direct users to after clicking the donation card
 */

const DonationCard = ({
  name,
  title,
  description,
  profileImageUrl,
  postedDateTime,
  coverImageUrl,
  validPeriod,
  location,
  postHref,
}) => {
  const timeAgo = getTimeDifferenceFromNow(postedDateTime);
  const router = useRouter();
  const handleClickOnDonationPost = (event) => {
    event.preventDefault();
    router.push(postHref);
  };
  return (
    <CardContainer>
      <Grid style={{ height: '100%' }} rows="1fr 3fr 2fr" cols="1fr">
        <CardHeaderContainer>
          <CardHeader name={name} imageUrl={profileImageUrl} timeAgo={timeAgo} />
        </CardHeaderContainer>
        <CardImage imageUrl={coverImageUrl || defaultPostImagePath} />
        <CardDescriptionContainer>
          <CardDescription title={title} description={description} />
          <CardDescriptionFooter validPeriod={validPeriod || '10/05/2020 - 10/05/2021'} location={location} />
        </CardDescriptionContainer>
      </Grid>
      <ClickableDiv href={postHref} onClick={handleClickOnDonationPost} />
    </CardContainer>
  );
};

export default DonationCard;
