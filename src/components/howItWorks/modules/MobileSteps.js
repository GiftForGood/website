import React, { useState } from 'react';
import styled from 'styled-components';
import { DONOR } from '@constants/usersType';
import SlideShow from '../modules/SlideShow';

import { howItWorksDonor, howItWorksNpo } from '@constants/howItWorks';
import { howItWorksDonorImagePath, howItWorksNpoImagePath } from '@constants/imagePaths';

const BannerImage = styled.img`
  border-radius: 15px;
  cursor: pointer;
  max-height: 250px;
  object-fit: cover;
  width: 100%;
`;

const MobileSteps = ({ type }) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const bannerImageSrc = type === DONOR ? howItWorksDonorImagePath : howItWorksNpoImagePath;
  const contents = type === DONOR ? howItWorksDonor : howItWorksNpo;
  return (
    <>
      <BannerImage src={bannerImageSrc} onClick={() => setIsShowModal(true)} />
      <SlideShow show={isShowModal} closeSlideShow={() => setIsShowModal(false)} contents={contents} type={type} />
    </>
  );
};

export default MobileSteps;
