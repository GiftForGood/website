import React, { useState, useEffect } from 'react';
import { Stack, Text } from '@kiwicom/orbit-components/lib';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import api from '../../../../utils/api/index';
import styled from 'styled-components';

const Container = styled.div`
  margin: 0 auto;
`;

const SquareBox = styled.div`
  width: calc(75px + 2vw);
  height: calc(75px + 2vw);
  min-width: 75px;
  min-height: 75px;
  border-radius: 1vw;
  position: relative;
`;

const ResizableTitle = styled.div`
  font-size: calc(10px + 0.5vw);
  font-weight: bold;
  margin-bottom: 10px;
`;

const CaptionInBox = styled.div`
  position: absolute;
  top: 80%;
  left: 10%;
`;

const ScrollableRow = styled.div`
  width: fit-content;
  max-width: 95vw;
  overflow-x: scroll;
`;

const styles = {
  imageStyle: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(70%)',
  }
}

const SquareImageBox = ({imageUrl, caption, captionSize, captionType}) => {
  return (
    <SquareBox>
      <img style={styles.imageStyle} src={imageUrl} />
      <CaptionInBox>
        {/* 
          captionType: primary, secondary, info, success, warning, critical, white
          captionSize: small, normal, large
        */}
        <Text type={captionType || "white"} size={captionSize || "small"}>
          {caption}
        </Text>
      </CaptionInBox>
    </SquareBox>
  );
};

const dummyCategoriesData = [
  {
    iconUrl: 'url',
    id: '1234',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'necessities',
  },
  {
    iconUrl: 'url',
    id: '123435',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'furniture',
  },
  {
    iconUrl: 'url',
    id: '12546543',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'house',
  },
  {
    iconUrl: 'url',
    id: '15454623',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'flat',
  },
  {
    iconUrl: 'url',
    id: '123423423',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'flrewrewdsat',
  },
  {
    iconUrl: 'url',
    id: '126587683',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'flatdsdfds',
  },
  {
    iconUrl: 'url',
    id: '987',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'dasdsad',
  },
  {
    iconUrl: 'url',
    id: '1298793',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'eqrewq',
  },
  {
    iconUrl: 'url',
    id: '129873',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'dfsf',
  },
  {
    iconUrl: 'url',
    id: '12798873',
    imageUrl: '/assets/wishes-banner.jpg',
    name: 'dasddfssad',
  },
];

const Categories = () => {
  const [categoriesObj, setCategoriesObj] = useState({});
  useEffect(() => {
    // setCategoriesObj(api.categories.getAll());
  });

  const CategoryRow = () => {
    return (
      <Stack direction="row" align="center">
        {dummyCategoriesData.map((category) => (
          <SquareImageBox key={category.id} imageUrl={category.imageUrl} caption={category.name} captionSize="small" />
        ))}
      </Stack>
    );
  };

  return (
    <Container>
      <ResizableTitle>Explore GiftForGood</ResizableTitle>
      <ScrollableRow>
        <CategoryRow />
      </ScrollableRow>
    </Container>
  );
};

export default Categories;
