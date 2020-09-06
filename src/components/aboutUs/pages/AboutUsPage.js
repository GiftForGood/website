import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import Banner from '../modules/Banner';
import TeamDescription from '../modules/TeamDescription';
import { Heading, Alert, Stack } from '@kiwicom/orbit-components/lib';

const AboutUsPage = () => {
  return (
    <>
      <Banner />
      <TeamDescription />
    </>
  );
};

export default AboutUsPage;
