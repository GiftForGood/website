import React from 'react';

// components
import { Badge } from '@kiwicom/orbit-components/';

// constants
import { STATUS } from '@constants/npoApplication';

const BadgeStatus = ({ status }) => {
  switch (status) {
    case STATUS.PENDING:
      return <Badge>{status.toUpperCase()}</Badge>;
    case STATUS.ACCEPTED:
      return <Badge type="successInverted">{status.toUpperCase()}</Badge>;
    case STATUS.RESUBMISSION:
      return <Badge type="warningInverted">{status.toUpperCase()}</Badge>;
    case STATUS.REJECTED:
      return <Badge type="criticalInverted">{status.toUpperCase()}</Badge>;
    case STATUS.REVIEWING:
      return <Badge type="dark">{status.toUpperCase()}</Badge>;
    default:
      return <Badge type="dark">{'Loading'}</Badge>;
  }
};

export default BadgeStatus;
