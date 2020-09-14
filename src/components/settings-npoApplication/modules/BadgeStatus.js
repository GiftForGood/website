import React from 'react';
import { STATUS } from '@constants/npoApplication';
import { Badge } from '@kiwicom/orbit-components/';

const BadgeStatus = ({ status }) => {
  if (status === STATUS.PENDING) {
    return <Badge>{status.toUpperCase()}</Badge>;
  } else if (status === STATUS.ACCEPTED) {
    return <Badge type="successInverted">{status.toUpperCase()}</Badge>;
  } else if (status === STATUS.RESUBMISSION) {
    return <Badge type="warningInverted">{status.toUpperCase()}</Badge>;
  } else if (status === STATUS.REJECTED) {
    return <Badge type="criticalInverted">{status.toUpperCase()}</Badge>;
  } else if (status === STATUS.REVIEWING) {
    return <Badge type="dark">{status.toUpperCase()}</Badge>;
  } else {
    return <Badge type="dark">{'Loading'}</Badge>;
  }
};

export default BadgeStatus;
