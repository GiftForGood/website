import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import api from '../../../../utils/api/';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import CarouselScrollButton from '../../buttons/CarouselScrollButton';
import { Carousel } from 'react-responsive-carousel';

const BannerImage = styled.img`
  height: fit-content;
  max-height: 250px;
  ${media.desktop(css`
    border-radius: 15px;
    max-height: 325px;
  `)};
  object-fit: cover;
`;

const ClickableDiv = styled.a`
  cursor: pointer;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
`;

const getAllBannerImages = async () => {
  const bannerSnapshot = await api.banners.getAll().catch((err) => console.error(err));
  return bannerSnapshot.docs.map((bannerDoc) => bannerDoc.data());
};

const BannerCarousel = () => {
  const [bannerImages, setBannerImages] = useState([]);
  const { isDesktop } = useMediaQuery();

  useEffect(() => {
    getAllBannerImages().then((bannerImages) => {
      setBannerImages(bannerImages);
    });
  }, []);

  if (bannerImages.length === 0) {
    return null;
  }

  return (
    <Carousel
      showThumbs={false}
      showStatus={false}
      autoPlay
      infiniteLoop
      interval={3000}
      renderArrowNext={(onClickHandler, hasNext, label) =>
        hasNext && <CarouselScrollButton direction="right" onClickHandler={onClickHandler} size="normal" />
      }
      renderArrowPrev={(onClickHandler, hasPrev, label) =>
        hasPrev && <CarouselScrollButton direction="left" onClickHandler={onClickHandler} size="normal" />
      }
      showArrows={isDesktop}
      stopOnHover
    >
      {bannerImages.map((bannerImage) => {
        const { imageUrl, link, index } = bannerImage;
        return (
          <div key={index}>
            <BannerImage src={imageUrl} />
            <ClickableDiv onClick={() => window.open(link, '_blank')} />
          </div>
        );
      })}
    </Carousel>
  );
};

export default BannerCarousel;
