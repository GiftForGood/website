import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import ProfileAvatar from '@components/imageContainers/ProfileAvatar';
import BlackText from '@components/text/BlackText';
import GreyText from '@components/text/GreyText';
import BlueButton from '@components/buttons/BlueButton';
import { Button } from '@kiwicom/orbit-components/lib';
import { colors } from '@constants/colors';

const BorderContainer = styled.div`
  border-radius: 5px;
  border: 1px solid ${colors.nposCardBorder};
  transition: border-color 0.1s ease-in-out;
  display: flex;
  flex-direction: column;
  width: 100%;

  :hover {
    border-color: ${colors.nposCardBorderHover};
  }
`;

const Anchor = styled.a`
  padding: 16px;
  color: #111;
  flex-grow: 1;
  text-decoration: none;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 16px;
`;

const CardProfileImage = styled.div`
  margin-right: 16px;
`;

const CardHeaderContent = styled.div`
  max-width: calc(100% - 80px);
`;

const CardButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NpoUserCard = ({ userId, name, organization, profileImageUrl, href, onClick }) => {
  const onCardClicked = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <BorderContainer>
      <Anchor href={href} onClick={onCardClicked}>
        <CardHeader>
          <CardProfileImage>
            <ProfileAvatar imageUrl={profileImageUrl.small} height="64" width="64" />
          </CardProfileImage>

          <CardHeaderContent>
            <BlackText weight="bold" size="medium">
              {organization?.name}
            </BlackText>
            <GreyText weight="normal" size="small">
              {name}
            </GreyText>
            <GreyText weight="normal" size="small">
              {organization?.sector}
            </GreyText>
          </CardHeaderContent>
        </CardHeader>

        <CardButtonContainer>
          <Button fullWidth={true} size="small" asComponent={BlueButton} onClick={onClick}>
            View Profile
          </Button>
        </CardButtonContainer>
      </Anchor>
    </BorderContainer>
  );
};

NpoUserCard.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  organization: PropTypes.object.isRequired,
  profileImageUrl: PropTypes.object.isRequired,
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default NpoUserCard;
