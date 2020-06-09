import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { Stack } from '@kiwicom/orbit-components/lib';
import CarouselBannerButton from '../../buttons/CarouselBannerButton';

const DisplayImageContainer = styled.div`
  height: 100vw;
  width: 100vw;
  min-width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  ${media.desktop(css`
    width: 500px;
    height: 500px;
  `)};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const NonSelectedThumbnailContainer = styled.div`
  padding-top: 20px;
  width: calc(75px + 2vw);
  height: calc(75px + 2vw);
  min-width: 75px;
  min-height: 75px;
  display: flex;
  opacity: 0.5;
  :hover {
    cursor: pointer;
    opacity: 1;
  }
  ${media.desktop(css`
    width: 110px;
    height: 110px;
  `)};
`;

const SelectedThumbnailContainer = styled.div`
  padding-top: 20px;
  width: calc(75px + 2vw);
  height: calc(75px + 2vw);
  min-width: 75px;
  min-height: 75px;
  display: flex;
  opacity: 1;
  :hover {
    cursor: pointer;
  }
  ${media.desktop(css`
    width: 110px;
    height: 110px;
  `)};
`;

const ImagePanel = ({ images }) => {
  const [displayImage, setDisplayImage] = useState(images[0]);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);

  const handleThumbnailClick = (index) => {
    setDisplayImage(images[index]);
    setSelectedThumbnailIndex(index);
  };

  const handleNextClick = () => {
    const nextThumbnailIndex = selectedThumbnailIndex + 1;
    if (nextThumbnailIndex >= images.length) {
      return;
    }
    setDisplayImage(images[nextThumbnailIndex]);
    setSelectedThumbnailIndex(nextThumbnailIndex);
  };

  const handlePrevClick = () => {
    const prevThumbnailIndex = selectedThumbnailIndex - 1;
    if (prevThumbnailIndex < 0) {
      return;
    }
    setDisplayImage(images[prevThumbnailIndex]);
    setSelectedThumbnailIndex(prevThumbnailIndex);
  };

  const Thumbnails = () => {
    return images.map((image, index) => {
      if (index === selectedThumbnailIndex) {
        return (
          <SelectedThumbnailContainer key={index} onClick={() => handleThumbnailClick(index)}>
            <Image src={image} />
          </SelectedThumbnailContainer>
        );
      } else {
        return (
          <NonSelectedThumbnailContainer key={index} onClick={() => handleThumbnailClick(index)}>
            <Image src={image} />
          </NonSelectedThumbnailContainer>
        );
      }
    });
  };

  return (
    <>
      <DisplayImageContainer>
        <CarouselBannerButton direction="left" size="normal" onClickHandler={handlePrevClick} />
        <Image src={displayImage} />
        <CarouselBannerButton direction="right" size="normal" onClickHandler={handleNextClick} />
      </DisplayImageContainer>
      <Stack direction="row" desktop={{ justify: images.length === 4 ? 'between' : 'start' }}>
        <Thumbnails />
      </Stack>
    </>
  );
};

export default ImagePanel;
