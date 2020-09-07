import React, { useState } from 'react';
import MaxWidthContainer from '@components/containers/maxWidthContainer';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import { TNC_GENERAL, TNC_NPO, TNC_DONOR } from '@constants/legal';
import Stack from '@kiwicom/orbit-components/lib/Stack';
import { ListChoice } from '@kiwicom/orbit-components/lib/';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import { WISHES } from '@constants/search';

const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });
const BottomNavigation = dynamic(() => import('@components/navbar/modules/BottomNavigation'), { ssr: false });
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      user,
    },
  };
}

const TermsAndConditions = ({ user }) => {
  const [html, setHtml] = useState(TNC_GENERAL);

  const createHTML = () => {
    return { __html: html };
  };

  return (
    <SessionProvider user={user}>
      <Header title="Terms and Conditions | GiftForGood" />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <MaxWidthContainer>
        <Grid
          columnGap="20px"
          desktop={{
            columns: '8fr 2fr',
          }}
        >
          <div dangerouslySetInnerHTML={createHTML()} />
          <Stack>
            <ListChoice title="General terms and conditions" onClick={() => setHtml(TNC_GENERAL)} />
            <ListChoice
              title="Terms and conditions of use for registered charities, organisations and groups"
              onClick={() => setHtml(TNC_NPO)}
            />
            <ListChoice title="Terms and conditions of use for donors" onClick={() => setHtml(TNC_DONOR)} />
          </Stack>
        </Grid>
      </MaxWidthContainer>
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default TermsAndConditions;
