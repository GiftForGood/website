import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
import { NpoEditProfilePanel } from './components';
import { Stack } from '@kiwicom/orbit-components/lib';
import SettingsTabs from '@components/tabs/SettingsTabs';
import { MaxWidthContainer } from '@components/containers';

// constants
import { TABS } from '@constants/settings';

const Container = styled(MaxWidthContainer)`
  display: flex;
  justify-content: center;

  width: 100%;
  margin-top: 25px;

  ${media.largeMobile(css`
    width: 90vw;
    margin: 0 auto;
    padding-top: 80px;
    padding-bottom: 100px;
  `)};
`;

const NpoSettingProfilePage = () => {
  return (
    <Container>
      <Stack justify="center" direction="column" desktop={{ direction: 'row' }}>
        <SettingsTabs activeTab={TABS.EDIT_PROFILE} />
        <NpoEditProfilePanel />
      </Stack>
    </Container>
  );
};

export default NpoSettingProfilePage;
