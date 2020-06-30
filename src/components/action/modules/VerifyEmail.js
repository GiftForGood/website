import React, { useEffect, useState } from 'react';
import api from '../../../../utils/api';
import { Loading, Button, Text, Heading, Stack } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';
import { companyIconImagePath } from '../../../../utils/constants/imagePaths';

const Logo = styled.img`
  height: 100px;
  width: 100px;
`;

const VerifyEmail = ({ oobCode, continueUrl }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (oobCode) {
      api.auth
        .verifyEmailVerificationCode(oobCode)
        .then((resp) => {
          console.log(resp);
          setIsVerified(true);
        })
        .catch((error) => {
          console.error(error);
          setIsError(true);
        });
    }
  }, [oobCode]);

  if (!isVerified && !isError) {
    return (
      <Text align="center" as="div" spaceAfter="largest">
        <Loading text="Please wait, while we verify your email" type="inlineLoader" />
      </Text>
    );
  }

  if (!isVerified && isError) {
    return (
      <Text align="center" as="div" spaceAfter="largest">
        <Text  align="center">Code is invalid or expired. Please verify your email again.</Text>
      </Text>
    );
  }

  return (
    <div>
      <Text align="center" as="div" spaceAfter="largest">
        <Stack direction="column" align="center" justify="center">
          <Logo src={companyIconImagePath} />
          <Heading size="large" weight="bold">
            You are verified
          </Heading>
          <Text align="center">Click the button below to continue.</Text>

          <Button href={continueUrl} size="normal">
            Continue
          </Button>
        </Stack>
      </Text>
    </div>
  );
};

export default VerifyEmail;
