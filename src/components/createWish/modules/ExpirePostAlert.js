import React from 'react';
import { Alert, Tooltip, TextLink } from '@kiwicom/orbit-components/lib';
import { BUMP_DURATION } from '@constants/wishes';

const ExpirePostAlert = () => {
  return (
    <Alert icon title="How long will my post stay on the platform?" spaceAfter="none">
      Your wish will stay on the platform for <b>1 month</b>. You can choose to{' '}
      <Tooltip
        content={
          <div>
            Bumping will extend your post by <b>{BUMP_DURATION} more week</b> and bring your wish to the top of the list temporarily.
          </div>
        }
        preferredPosition="left"
      >
        <TextLink>bump</TextLink>
      </Tooltip>{' '}
      it once any time after you have posted it.
    </Alert>
  );
};

export default ExpirePostAlert;
