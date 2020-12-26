import React from 'react';
import Banner from '../modules/Banner';
import HowItWorks from '@components/aboutUs/modules/HowItWorks';
import Stats from '@components/aboutUs/modules/Stats';
import CallToAction from '@components/aboutUs/modules/CallToAction'

const AboutUsPage = () => {
  return (
    <>
      <Banner />
      <HowItWorks />
      <Stats />
      <CallToAction />
    </>
  );
};

export default AboutUsPage;
