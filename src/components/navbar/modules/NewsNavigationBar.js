import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Text, Stack } from '@kiwicom/orbit-components';
import { colors } from '../../../../utils/constants/colors';

const Container = styled.div`
  display: ${({ shown }) => (shown ? 'flex' : 'none')};
  background-color: ${colors.newsBackground};
  z-index: 700;
  padding: 10px;
`;

const NewsNavigationBar = ({ show = false }) => {
  const [shown, setShown] = useState(show);

  return (
    <Container shown={shown}>
      <Stack justify="center" align="center" direction="row">
        <Text>
          Disclaimer: This website is still under development and all posts are meant for illustration purposes only.
          The official launch of GiftForGood will be in Sept 2020.
        </Text>
      </Stack>
    </Container>
  );
};

export default NewsNavigationBar;
