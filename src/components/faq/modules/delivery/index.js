import React from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import CanIDropOffDonations from './CanIDropOffDonations';
import WhoPaysForDeliveries from './WhoPaysForDeliveries';
import WhoArrangesDelivery from './WhoArrangesDelivery';
import WhoReceivesDelivery from './WhoReceivesDelivery';
import Topic from '../Topic';

const Delivery = () => {
  const AllQuestionAndAnswers = () => {
    return (
      <Stack direction="column">
        <WhoArrangesDelivery />
        <WhoPaysForDeliveries />
        <CanIDropOffDonations />
        <WhoReceivesDelivery />
      </Stack>
    );
  };
  return <Topic title="Delivery" contents={<AllQuestionAndAnswers />} />;
};

export default Delivery;
