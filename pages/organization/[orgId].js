import React from 'react';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import { WISHES } from '@constants/search';
import OrganizationalPage from '@components/organization/pages/OrganizationalPage';
import OrganizationHeader from '@components/header/OrganizationHeader';
import api from '@api';
import Error from 'next/error';

const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });
const BottomNavigation = dynamic(() => import('@components/navbar/modules/BottomNavigation'), { ssr: false });
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  const orgId = params.orgId;
  const npoOrgSnapshot = await api.npoOrganization.getById(orgId);
  let isMine = false;
  let organization = null;
  if (npoOrgSnapshot.exists) {
    organization = npoOrgSnapshot.data();
  }
  if (user?.organization?.id === organization?.id) {
    isMine = true;
  }

  return {
    props: {
      user,
      organization,
      isMine,
    },
  };
}

const Organization = ({ user, organization, isMine }) => {
  if (organization === null) {
    return <Error statusCode={404} />;
  }

  return (
    <SessionProvider user={user}>
      <Header title={`${organization.name} | GiftForGood`} />
      <OrganizationHeader title={`${organization.name}`} />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <OrganizationalPage organization={organization} isMine={isMine} />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default Organization;
