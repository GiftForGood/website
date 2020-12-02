import React, { useState } from 'react';
import { MaxWidthContainer } from '@components/containers';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import Stack from '@kiwicom/orbit-components/lib/Stack';
import { ListChoice } from '@kiwicom/orbit-components/lib/';
import dynamic from 'next/dynamic';
import Header from '@components/header';

import api from '@api';
import Quill from '@components/legal/module/Quill';
import { LEGAL_TYPE } from '@constants/legal';

import StaticNavbar from '@components/navbar/modules/StaticNavbar';

const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getStaticProps() {
  let dataSnapshotGeneral = await api.legal.get(LEGAL_TYPE.TNC_GENERAL);
  let dataSnapshotNPO = await api.legal.get(LEGAL_TYPE.TNC_NPO);
  let dataSnapshotDonor = await api.legal.get(LEGAL_TYPE.TNC_DONOR);

  return {
    props: {
      legalGeneral: dataSnapshotGeneral.exists ? dataSnapshotGeneral.data() : null,
      legalNPO: dataSnapshotNPO.exists ? dataSnapshotNPO.data() : null,
      legalDonor: dataSnapshotDonor.exists ? dataSnapshotDonor.data() : null,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 60 second
    revalidate: 60, // In seconds
  };
}

const TermsAndConditions = ({ legalGeneral, legalNPO, legalDonor }) => {
  const [html, setHtml] = useState(legalGeneral);

  return (
    <>
      <Header title="Terms and Conditions | GiftForGood" />
      <StaticNavbar />
      <MaxWidthContainer>
        <Grid
          columnGap="20px"
          desktop={{
            columns: '8fr 2fr',
          }}
        >
          <Quill content={html.content} />
          <Stack>
            <ListChoice title="General terms and conditions" onClick={() => setHtml(legalGeneral)} />
            <ListChoice
              title="Terms and conditions of use for registered charities, organisations and groups"
              onClick={() => setHtml(legalNPO)}
            />
            <ListChoice title="Terms and conditions of use for donors" onClick={() => setHtml(legalDonor)} />
          </Stack>
        </Grid>
      </MaxWidthContainer>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
