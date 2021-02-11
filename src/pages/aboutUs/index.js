import React from 'react';
import Banner from '@pages/aboutUs/components/Banner';
import HowItWorks from '@pages/aboutUs/components/HowItWorks';
import Stats from '@pages/aboutUs/components/Stats';
import CallToAction from '@pages/aboutUs/components/CallToAction';

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
