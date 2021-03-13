import React from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import CanIEditOrganisationalInfo from './CanIEditOrganisationalInfo';
import HowToBeCorporateDonor from './HowToBeCorporateDonor';
import HowToUpdateProfile from './HowToUpdateProfile';
import Topic from '../Topic';

const Profile = () => {
  const AllQuestionAndAnswers = () => {
    return (
      <Stack direction="column">
        <HowToUpdateProfile />
        <CanIEditOrganisationalInfo />
        <HowToBeCorporateDonor />
      </Stack>
    );
  };
  return <Topic title="Profile" contents={<AllQuestionAndAnswers />} />;
};

export default Profile;
