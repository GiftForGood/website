import React from 'react';
import { MaxWidthContainer } from '@components/containers';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import api from '@api';
import Quill from '@components/legal/module/Quill';
import { LEGAL_TYPE } from '@constants/legal';
import StaticNavbar from '@components/navbar/modules/StaticNavbar';

const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getStaticProps() {
  let dataSnapshot = await api.legal.get(LEGAL_TYPE.PRIVACY_POLICY);
  return {
    props: {
      legal: dataSnapshot.exists ? dataSnapshot.data() : null,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 60 second
    revalidate: 60, // In seconds
  };
}

const PrivacyPolicy = ({ legal }) => {
  return (
    <>
      <Header title="Privacy Policy | GiftForGood" />
      <StaticNavbar />
      <MaxWidthContainer>
        <Quill content={legal ? legal.content : null} />
      </MaxWidthContainer>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
