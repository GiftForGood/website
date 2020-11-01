import React from 'react';
import styled from 'styled-components';
import { Stack, Text } from '@kiwicom/orbit-components/lib';
import { useRouter } from 'next/router';

const RoundedContainer = styled.div`
  background-color: white;
  display: flex;
  box-shadow: 0px 0px 5px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  height: 28px;
  border-radius: 30px;
  margin-bottom: 1em;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
`;

const IconImage = styled.img`
  height: 22px;
  width: 22px;
`;

const SeasonalLargeTag = ({ name, iconUrl, hashtag = '' }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/wishes/category?q=${hashtag}`);
  };

  return (
    <RoundedContainer onClick={handleClick}>
      <Stack direction="row" spacing="compact" align="center">
        <IconImage src={iconUrl} />
        <Text size="large">{name}</Text>
      </Stack>
    </RoundedContainer>
  );
};

export default SeasonalLargeTag;
