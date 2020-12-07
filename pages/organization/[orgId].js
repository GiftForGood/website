import React from 'react';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import { WISHES } from '@constants/search';
import OrganizationalPage from '@components/organization/pages/OrganizationalPage';
import OrganizationHeader from '@components/header/OrganizationHeader';

const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });
const BottomNavigation = dynamic(() => import('@components/navbar/modules/BottomNavigation'), { ssr: false });
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  const orgId = params.orgId;
  const organization = {
    name: 'My Organization',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta mattis leo, vitae sollicitudin nunc commodo sed. Sed ut venenatis nibh. Mauris et suscipit tellus. Nullam nunc ligula, suscipit eu magna eget, commodo vestibulum velit. Cras sed neque sed quam interdum aliquam. Morbi porttitor sapien quis lectus rhoncus luctus. Ut lorem elit, auctor at tincidunt in, commodo id nisl. Maecenas rutrum dignissim gravida. Donec et quam ut magna eleifend tristique. Fusce dictum pellentesque consequat. Duis blandit rhoncus diam. Nulla facilisi. Duis sit amet faucibus tortor, nec aliquam diam. Pellentesque in ornare lacus. Vestibulum in vestibulum nulla, et accumsan lectus.',
    coverPhotoUrl:
      'https://images.unsplash.com/photo-1606851453546-be5e6cd6935e?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
    profileImageUrl: {
      raw:
        'https://scontent.fsin3-1.fna.fbcdn.net/v/t1.0-9/16114543_10155535947879881_2569160211001506852_n.jpg?_nc_cat=105&ccb=2&_nc_sid=09cbfe&_nc_ohc=gAk5_6yCgeQAX9maL5Q&_nc_ht=scontent.fsin3-1.fna&oh=07ee6c9781b751bd6bc87cc628de3d05&oe=5FF11301',
    },
    id: 'WM1yRGqPIxrNiAc1vYpg',
  };
  return {
    props: {
      user,
      organization,
    },
  };
}

const Organization = ({ user, organization }) => {
  return (
    <SessionProvider user={user}>
      <Header title={`${organization.name} | GiftForGood`} />
      <OrganizationHeader title={`${organization.name}`} />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <OrganizationalPage organization={organization} />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default Organization;
