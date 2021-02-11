import React from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import HowToReportUser from './HowToReportUser';
import Topic from '../Topic';

const Reporting = () => {
  const AllQuestionAndAnswers = () => {
    return (
      <Stack direction="column">
        <HowToReportUser />
      </Stack>
    );
  };
  return <Topic title="Reporting" contents={<AllQuestionAndAnswers />} />;
};

export default Reporting;
