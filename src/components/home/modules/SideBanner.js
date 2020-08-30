import React, { useEffect, useState } from 'react';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

const BannerImage = styled.img`
  height: 100%;
  max-height: 325px;
  object-fit: cover;
  padding: 10px;
  border-radius: 15px;

  ${media.desktop(css`
    padding: 0px;
    border-radius: 15px;
    max-height: 325px;
  `)};
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

const SideBanner = () => {
  const [sideBanners, setSideBanners] = useState([]);

  useEffect(() => {
    getAllSideBannerImages().then((bannerImages) => {
      setSideBanners(bannerImages);
    });
  }, []);

  const getAllSideBannerImages = async () => {
    const bannerSnapshot = await api.banners.getAllSide().catch((err) => console.error(err));
    return bannerSnapshot.docs.map((bannerDoc) => bannerDoc.data());
  };

  return (
    <div>
      {sideBanners.map((banner) => (
        <>
          <BannerImage src={banner.imageUrl} />
          <ClickableDiv href={banner.link} target="_blank" />
        </>
      ))}
    </div>
  );
};

export default SideBanner;
