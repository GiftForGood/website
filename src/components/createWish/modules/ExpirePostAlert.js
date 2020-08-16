import React from 'react';
import { Alert, Tooltip, TextLink } from '@kiwicom/orbit-components/lib';

const ExpirePostAlert = () => {
  return (
    <Alert icon title="How long will my post stay on the platform?" spaceAfter="none">
      Your wish will stay on the platform for <b>1 month</b>. You can choose to{' '}
      <Tooltip
        content={
          <div>
            Bumping will extend your post by <b>1 more week</b> and bring your wish to the top of the list temporarily.
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
