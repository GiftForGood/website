import React from 'react';
import styled from 'styled-components';
import { Button } from '@kiwicom/orbit-components/';
import { colors } from '../../../utils/constants/colors';
import useUser from '../session/modules/useUser';
import Verified from '../session/modules/Verified';
import { useRouter } from 'next/router';

const CallToActionButtonStyle = styled.button`
  background: ${colors.donorBackground};
  height: 30px;

  :active {
    background: ${colors.donorHoverActive};
  }

  :hover {
    background: ${colors.donorHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(222, 24, 24, 0.5);
  }
`;

const CallToActionButton = ({ fullWidth }) => {
  const user = useUser();
  const router = useRouter();

  const onButtonClick = () => {
    if (user.npo) {
      router.push('/wishes/create');
    } else if (user.donor) {
      router.push('/donations/create');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Verified>
      {({ isDisabled }) => (
        <Button
          fullWidth={fullWidth}
          asComponent={CallToActionButtonStyle}
          size="normal"
          disabled={isDisabled}
          onClick={onButtonClick}
        >
          {user.donor ? 'Donate' : 'Post'}
        </Button>
      )}
    </Verified>
  );
};

export default CallToActionButton;
