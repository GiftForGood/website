import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
import { Stack } from '@kiwicom/orbit-components/lib';
import CarouselScrollButton from '@components/buttons/CarouselScrollButton';
import { Carousel } from 'react-responsive-carousel';

// constants
import { colors } from '@constants/colors';

// hooks
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const CarouselImage = styled.img`
  height: 100vw;
  width: 100vw;
  object-fit: cover;
  background-color: ${colors.imageLoading.background};
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
  background-color: ${colors.imageLoading.background};
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

/**
 * @param {object} images is the array of object imagesUrl.
 */
const ImagePanel = ({ images }) => {
  const { isDesktop } = useMediaQuery();
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [largeImages, setLargeImages] = useState(null);

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

  const handleOnImageError = () => {
    const newLargeImages = images.map((img) => img.raw);
    setLargeImages(newLargeImages);
  };

  useEffect(() => {
    if (images) {
      const newLargeImages = images.map((img) => img.large);
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
        {largeImages &&
          largeImages.map((image, index) => {
            return <CarouselImage key={index} src={image} onError={handleOnImageError} />;
          })}
      </Carousel>
    );
  };

  const Thumbnails = () => {
    return (
      largeImages &&
      largeImages.map((image, index) => {
        return (
          <ThumbnailImage
            key={index}
            src={image}
            selected={index === selectedThumbnailIndex}
            onClick={() => handleThumbnailClick(index)}
          />
        );
      })
    );
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
