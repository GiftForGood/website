import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Text, Stack } from '@kiwicom/orbit-components';
import { colors } from '@constants/colors';

const Container = styled.div`
  display: ${({ shown }) => (shown ? 'flex' : 'none')};
  background-color: ${colors.newsBar.background};
  z-index: 700;
  padding: 10px;
`;

const NewsNavigationBar = ({ show = false }) => {
  const [shown, setShown] = useState(show);

  return (
    <Container shown={shown}>
      <Stack justify="center" align="center" direction="row">
        <Text>Soft launch (08/09 - 13/09): We are currently onboarding NPOs only</Text>
      </Stack>
    </Container>
  );
};

export default NewsNavigationBar;
