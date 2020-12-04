import React from 'react';
import DonorEditProfilePanel from '../modules/DonorEditProfilePanel';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { MaxWidthContainer } from '@components/containers';

const Container = styled(MaxWidthContainer)`
  display: flex;
  justify-content: center;

  width: 100%;
  margin-top: 25px;

  ${media.largeMobile(css`
    width: 90vw;
    margin: 0 auto;
    padding-top: 80px;
    padding-bottom: 100px;
  `)};
`;

const DonorSettingProfilePage = () => {
  return (
    <Container>
      <DonorEditProfilePanel />
    </Container>
  );
};

export default DonorSettingProfilePage;
