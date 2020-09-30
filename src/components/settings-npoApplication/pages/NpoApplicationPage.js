import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import NpoApplicationPanel from '../modules/NpoApplicationPanel';
import SettingsTabs from '@components/tabs/SettingsTabs';
import { Stack } from '@kiwicom/orbit-components/lib';
import { TABS } from '@constants/settings';

const Container = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1280px;
  margin-top: 25px;
  margin-bottom: 40px;

  ${media.largeMobile(css`
    width: 90vw;
    margin: 0 auto;
    padding-top: 80px;
    padding-bottom: 100px;
  `)};
`;

const NpoApplicationPage = () => {
  return (
    <Container>
      <Stack justify="center" direction="column" desktop={{ direction: 'row' }}>
        <SettingsTabs activeTab={TABS.NPO_APPLICATION} />
        <NpoApplicationPanel />
      </Stack>
    </Container>
  );
};

export default NpoApplicationPage;
