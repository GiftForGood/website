import React from 'react';
import MaxWithContainer from '@components/containers/maxWidthContainer'
import { PRIVACY_POLICY } from '@constants/legal';

const PrivacyPolicy = () => {

  const createHTML = () => {
    return { __html: PRIVACY_POLICY };
  };

  return (
    <MaxWithContainer>
       <div dangerouslySetInnerHTML={createHTML()} />
    </MaxWithContainer>
  )
}

export default PrivacyPolicy;