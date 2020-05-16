import CardHeader from '../card/CardHeader';
import { Stack, Text, Grid } from '@kiwicom/orbit-components/lib';
import { getTimeDifferenceFromNow } from '../../../utils/api/time';
import GreyText from '../text/GreyText';
import styled from 'styled-components';
import { defaultPostImagePath } from '../../../utils/constants/imagePaths';
import { useRouter } from 'next/router';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  width: 300px;
  height: 400px;
  min-width: 300px;
  min-height: 400px;
  ${(props) => {
    if (props.isDesktop === true) {
      return 'width: 350px; height: 450px; min-width: 350px; min-height: 450px;';
    }
  }}
  position: relative;
  scroll-snap-align: center;
`;

const CardHeaderContainer = styled.div`
  margin: 10px 10px 0 10px;
`;

const ThreeLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 1.5em;
  max-height: 3em;
  font-size: 14px;
  -webkit-line-clamp: 2;
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

const CardDescription = ({ ...props }) => {
  const { title, description } = props;
  return (
    <Stack direction="column" spacing="tight">
      <Text size="normal" weight="bold">
        {title}
      </Text>
      <ThreeLineTextContainer>{description}</ThreeLineTextContainer>
    </Stack>
  );
};

const CardDescriptionFooter = ({ ...props }) => {
  const { validPeriod, location } = props;
  return (
    <div style={{ bottom: 0, textAlign: 'start' }}>
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

const DonationCard = ({ ...props }) => {
  const timeAgo = getTimeDifferenceFromNow(props.postedDateTime);
  const router = useRouter();
  const handleDonationPostOnClick = (event) => {
    event.preventDefault();
    router.push(props.postHref);
  };
  const { isDesktop } = useMediaQuery();
  return (
    <CardContainer isDesktop={isDesktop}>
      <Grid style={{ height: '100%' }} rows="1fr 3fr 2fr" cols="1fr">
        <CardHeaderContainer>
          <CardHeader name={props.name} imageUrl={props.profileImageUrl} timeAgo={timeAgo} />
        </CardHeaderContainer>
        <CardImage imageUrl={props.coverImageUrl || defaultPostImagePath} />
        <CardDescriptionContainer>
          <CardDescription title={props.title} description={props.description} />
          <CardDescriptionFooter
            validPeriod={props.validPeriod || '10/05/2020 - 10/05/2021'}
            location={props.location}
          />
        </CardDescriptionContainer>
      </Grid>
      <ClickableDiv href={props.postHref} onClick={handleDonationPostOnClick} />
    </CardContainer>
  );
};

export default DonationCard;
