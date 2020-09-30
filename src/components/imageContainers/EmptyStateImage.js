import React from 'react';
import BlackText from '@components/text/BlackText';
import { Stack } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';
import { emptyStateImagePath } from '@constants/imagePaths';

const EmptyStateImg = styled.img`
  height: 20%;
  width: 30%;
`;

const EmptyStateImage = ({ label }) => {
  return (
    <Stack justify="center" align="center" direction="column">
      <EmptyStateImg src={emptyStateImagePath} />
      <BlackText size="medium">{label}</BlackText>
    </Stack>
  );
};

export default EmptyStateImage;
