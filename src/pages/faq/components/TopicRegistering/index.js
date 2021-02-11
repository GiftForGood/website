import React from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import HowIsNpoVerified from './HowIsNpoVerified';
import HowToRegisterAsNpo from './HowToRegisterAsNpo';
import HowToRegisterAsDonor from './HowToRegisterAsDonor';
import WhoCanRegisterAsNpo from './WhoCanRegisterAsNpo';
import WhoCanRegisterAsDonor from './WhoCanRegisterAsDonor';
import Topic from '../Topic';

const Registering = () => {
  const AllQuestionAndAnswers = () => {
    return (
      <Stack direction="column">
        <HowToRegisterAsNpo />
        <HowToRegisterAsDonor />
        <WhoCanRegisterAsNpo />
        <WhoCanRegisterAsDonor />
        <HowIsNpoVerified />
      </Stack>
    );
  };
  return <Topic title="Registering" contents={<AllQuestionAndAnswers />} />;
};

export default Registering;
