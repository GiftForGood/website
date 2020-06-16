import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { Stack } from '@kiwicom/orbit-components/lib';
import CarouselScrollButton from '../../buttons/CarouselScrollButton';
import { Carousel } from 'react-responsive-carousel';
import { colors } from '../../../../utils/constants/colors';

const CarouselImage = styled.img`
  height: 100vw;
  width: 100vw;
  object-fit: cover;
  background-color: ${colors.imageLoadingBackground};
  ${media.desktop(css`
    width: 500px;
    height: 500px;
  `)};
`;

const ImageCarouselContainer = styled.div`
  min-width: 100%;
  ${media.desktop(css`
    width: 500px;
    padding-bottom: 20px;
  `)};
`;

const ThumbnailImage = styled.img`
  background-color: ${colors.imageLoadingBackground};
  object-fit: cover;
  width: calc(75px + 2vw);
  height: calc(75px + 2vw);
  min-width: 75px;
  min-height: 75px;
  opacity: ${(props) => (props.selected ? '1' : '0.5')};
  :hover {
    cursor: pointer;
    opacity: 1;
  }
  ${media.desktop(css`
    width: 110px;
    height: 110px;
  `)};
`;

const ImagePanel = ({ images }) => {
  const { isDesktop } = useMediaQuery();
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [largeImages, setLargeImages] = useState(images);

  const handleThumbnailClick = (index) => {
    setSelectedThumbnailIndex(index);
  };

  const updateThumbnailIndex = (index) => {
    if (index === null) {
      return;
    }
    // Timeout is for the sliding transition time
    setTimeout(() => {
      setSelectedThumbnailIndex(index);
    }, 350);
  };

  useEffect(() => {
    if (images) {
      const newLargeImages = images.map((img) => {
        const lastIndexOfDot = img.lastIndexOf('.');
        const newLargeImageUrl = img.substring(0, lastIndexOfDot) + '_1000x1000' + img.substring(lastIndexOfDot);
        return newLargeImageUrl;
      });
      setLargeImages(newLargeImages);
    }
  }, [images]);

  const ImageCarousel = () => {
    return (
      <Carousel
        showThumbs={false}
        showStatus={false}
        swipeable={isDesktop ? false : true}
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && <CarouselScrollButton direction="right" onClickHandler={onClickHandler} size="normal" />
        }
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && <CarouselScrollButton direction="left" onClickHandler={onClickHandler} size="normal" />
        }
        selectedItem={selectedThumbnailIndex}
        onChange={(index) => updateThumbnailIndex(isDesktop ? index : null)}
      >
        {largeImages.map((image, index) => {
          return <CarouselImage key={index} src={image} />;
        })}
      </Carousel>
    );
  };

  const Thumbnails = () => {
    return largeImages.map((image, index) => {
      return (
        <ThumbnailImage
          key={index}
          src={image}
          selected={index === selectedThumbnailIndex}
          onClick={() => handleThumbnailClick(index)}
        />
      );
    });
  };

  return (
    <>
      <ImageCarouselContainer>
        <ImageCarousel />
      </ImageCarouselContainer>
      {isDesktop ? (
        <Stack direction="row" desktop={{ justify: images.length === 4 ? 'between' : 'start' }}>
          <Thumbnails />
        </Stack>
      ) : null}
    </>
  );
};

export default ImagePanel;
