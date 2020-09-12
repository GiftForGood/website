import React from 'react';
import MaxWithContainer from '@components/containers/maxWidthContainer';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import api from '@api';
import Quill from '@components/legal/module/Quill';

const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getStaticProps() {
  let dataSnapshot = await api.legal.get('privacy_policy');
  return {
    props: {
      legal: dataSnapshot.exists ? dataSnapshot.data() : null,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}

const PrivacyPolicy = ({ legal }) => {
  return (
    <>
      <Header title="Privacy Policy | GiftForGood" />
      <MaxWithContainer>
        <Quill content={legal ? legal.content : null} />
      </MaxWithContainer>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
