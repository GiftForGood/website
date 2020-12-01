import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Stack, TextLink } from '@kiwicom/orbit-components/lib';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import DesktopSteps from '../modules/DesktopSteps';
import MobileSteps from '../modules/MobileSteps';

import { colors } from '@constants/colors';
import { DONOR, NPO } from '@constants/usersType';

const Container = styled.div`
  margin: 0 auto;
  margin-bottom: 20px;
  max-width: 1280px;
  padding: 5px;
  width: 90vw;
`;

const UndoContainer = styled.div`
  margin: 0 auto;
`;

const ResponsiveTitle = styled.div`
  font-size: calc(14px + 0.5vw);
  font-weight: bold;
  width: fit-content;
`;

const unselectedLink = styled.a`
  color: ${colors.subtleGrey};
  text-decoration: none;

  :hover {
    color: ${colors.ratingStarBackground};
    text-decoration: underline;
  }
`;

const selectedLink = styled.a`
  color: ${colors.ratingStarBackground};
  text-decoration: underline;

  :hover {
    color: ${colors.ratingStarBackground};
    text-decoration: none;
  }
`;

const HowItWorks = ({ setIsShowHowItWorks }) => {
  const [currentTab, setCurrentTab] = useState(NPO);
  const [shouldShowUndo, setShouldShowUndo] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const { isDesktop } = useMediaQuery();

  useEffect(() => {
    if (timerId && !shouldShowUndo) {
      clearTimeout(timerId); // cancel timeout if clicked undo
    }
    if (shouldShowUndo) {
      let id = setTimeout(() => {
        setIsShowHowItWorks(false);
      }, 5000);
      setTimerId(id);
    }
  }, [shouldShowUndo]);

  if (shouldShowUndo) {
    return (
      <UndoContainer>
        <TextLink size="normal" onClick={() => setShouldShowUndo(false)}>
          Undo
        </TextLink>
      </UndoContainer>
    );
  }

  return (
    <Container>
      <Stack direction="row" justify="between" spaceAfter="medium">
        <ResponsiveTitle>How it works</ResponsiveTitle>
        <TextLink size="small" onClick={() => setShouldShowUndo(true)}>
          Don't show me again
        </TextLink>
      </Stack>
      <Stack direction="row" spacing="loose" spaceAfter="large" shrink>
        <TextLink
          type="secondary"
          asComponent={currentTab === NPO ? selectedLink : unselectedLink}
          onClick={() => setCurrentTab(NPO)}
        >
          I am a NPO
        </TextLink>
        <TextLink
          type="secondary"
          asComponent={currentTab === DONOR ? selectedLink : unselectedLink}
          onClick={() => setCurrentTab(DONOR)}
        >
          I am a Donor
        </TextLink>
      </Stack>
      {isDesktop ? <DesktopSteps type={currentTab} /> : <MobileSteps type={currentTab} />}
    </Container>
  );
};

export default HowItWorks;
