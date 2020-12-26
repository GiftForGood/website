import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import Banner from '../modules/Banner';
import TeamDescription from '../modules/TeamDescription';
import { Heading, Alert, Stack } from '@kiwicom/orbit-components/lib';
import HowItWorks from '@components/aboutUs/modules/HowItWorks';
import Stats from '@components/aboutUs/modules/Stats';
const AboutUsPage = () => {
  return (
    <>
      <Banner />
      <HowItWorks />
      <Stats />
      <TeamDescription />
    </>
  );
};

export default AboutUsPage;
