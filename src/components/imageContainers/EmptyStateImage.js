import React from 'react';
import BlackText from '@components/text/BlackText';
import { Stack } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';

const EmptyStateImg = styled.img`
  height: 20%;
  width: 30%;
`;

const EmptyStateImage = ({ label }) => {
  return (
    <Stack justify="center" align="center" direction="column">
      <EmptyStateImg
        src={'https://res.cloudinary.com/giftforgood/image/upload/v1600521695/empty-state/undraw_empty_xct9_g1ndx6.svg'}
      />
      <BlackText size="medium">{label}</BlackText>
    </Stack>
  );
};

export default EmptyStateImage;
