import React from 'react';
import DonorEditProfilePanel from '../modules/DonorEditProfilePanel';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

const Container = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1280px;
  margin-top: 25px;
  margin-bottom: 40px;

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
