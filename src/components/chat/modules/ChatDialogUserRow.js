import React, { useState, useEffect } from 'react';
import { Button, Stack } from '@kiwicom/orbit-components/lib';
import CalendarModal from '../../calendar/modules/CalendarModal';
import ProfileAvatar from '../../imageContainers/ProfileAvatar';
import BlackText from '../../text/BlackText';
import RatingStars from '../../ratingStars';
import api from '../../../../utils/api';
import SuggestDateButton from '../../../components/buttons/ChatSuggestDatesButton';
import CompleteButton from '../../../components/buttons/ChatCompleteButton';
import styled, { css } from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import { CardSection } from '@kiwicom/orbit-components/lib/Card';

const AvatarContainer = styled.div`
  float: left;
  width: fit-content;
`;

const ButtonsContainer = styled.div`
  width: fit-content;
`;

/**
 *
 * @param {string} name is the name of the opposite user
 * @param {string} profileImageUrl is the url of the opposite user's profile image
 * @param {string} rating is the rating of the opposite user
 */
const ChatDialogUserRow = ({ name, profileImageUrl, rating }) => {
  const [showSuggestDateModal, setShowSuggestDateModal] = useState(false);

  const handleShowSuggestDateModal = () => setShowSuggestDateModal(true);
  const handleCloseSuggestDateModal = () => setShowSuggestDateModal(false);
  const handleCompletePost = () => console.log('complete post');
  return (
    <CardSection>
      <Stack tablet={{ direction: 'row', justify: 'between', align: 'center' }} direction="column">
        <AvatarContainer>
          <Stack direction="row" align="center">
            <ProfileAvatar imageUrl={profileImageUrl} />
            <Stack direction="column" align="start" spacing="extraTight">
              <BlackText size="small">{name}</BlackText>
              <RatingStars rating={rating} showEmpty color={colors.ratingStarBackground} size="small" />
            </Stack>
          </Stack>
        </AvatarContainer>
        <ButtonsContainer>
          <Stack direction="row" spacing="condensed">
            <Button size="small" onClick={handleShowSuggestDateModal} asComponent={SuggestDateButton}>
              Suggest Dates
            </Button>
            <CalendarModal onShow={showSuggestDateModal} onHide={handleCloseSuggestDateModal} />
            <Button size="small" onClick={handleCompletePost} asComponent={CompleteButton}>
              Complete
            </Button>
          </Stack>
        </ButtonsContainer>
      </Stack>
    </CardSection>
  );
};

export default ChatDialogUserRow;
