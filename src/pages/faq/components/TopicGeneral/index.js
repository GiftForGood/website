import React from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import HowItWorks from './HowItWorks';
import Topic from '../Topic';

const General = () => {
  const AllQuestionAndAnswers = () => {
    return (
      <Stack direction="column">
        <HowItWorks />
      </Stack>
    );
  };
  return <Topic title="General" contents={<AllQuestionAndAnswers />} />;
};

export default General;
