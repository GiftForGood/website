import React, { useEffect, useState } from 'react';
import api from '../../../../utils/api';
import { Loading, Button, Text, Heading, Stack, InputField } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';
import { companyIconImagePath } from '@constants/imagePaths';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Field from '../../inputfield';

const Logo = styled.img`
  height: 100px;
  width: 100px;
`;

const Container = styled.div`
  width: 100%;
`;

const ResetPassword = ({ oobCode, continueUrl }) => {
  const [userEmail, setUserEmail] = useState('');
  const [isError, setIsError] = useState(false);
  const [isPasswordResetSuccess, setIsPasswordResetSuccess] = useState(false);

  useEffect(() => {
    if (oobCode) {
      api.auth
        .verifyPasswordResetCode(oobCode)
        .then((email) => {
          setUserEmail(email);
        })
        .catch((error) => {
          console.error(error);
          setIsError(error);
        });
    }
  }, [oobCode]);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#\$%\^&\*\-\+\=\?\;\:\[\]\{\}\|\`\~\"\'\_\.])(?=.{12,})/,
        'Please create a password with at least 12 characters, comprising a mix of uppercase and lowercase letters, numbers and symbols'
      ),
    passwordConfirmation: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handlePasswordReset(values);
    },
  });

  const handlePasswordReset = async (values) => {
    try {
      const { password } = values;
      await api.auth.resetPassword(oobCode, password);
      setIsPasswordResetSuccess(true);
    } catch (error) {
      console.error(error);
      setUserEmail('');
      setIsError(true);
    }
  };

  if (userEmail.length === 0 && !isError) {
    return (
      <Text align="center" as="div" spaceAfter="largest">
        <Loading text="Please wait, while we verify your request" type="inlineLoader" />
      </Text>
    );
  }

  if (userEmail.length === 0 && isError) {
    return (
      <Text align="center" as="div" spaceAfter="largest">
        <Text align="center">Code is invalid or expired. Please request to reset your password again.</Text>
      </Text>
    );
  }

  return (
    <Container>
      <form onSubmit={formik.handleSubmit}>
        <Stack direction="column" align="center" justify="center">
          <Logo src={companyIconImagePath} />
          <Heading size="large" weight="bold">
            Reset Password
          </Heading>

          <Text weight="bold">{userEmail}</Text>
        </Stack>
        <Stack direction="column" align="" justify="center">
          <Field
            disabled={formik.isSubmitting}
            type="password"
            label="Create a password"
            name="password"
            help="Please create a password with at least 12 characters, comprising a mix of uppercase and lowercase letters, numbers and symbols"
            error={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
            {...formik.getFieldProps('password')}
          />

          <InputField
            disabled={formik.isSubmitting}
            type="password"
            label="Confirm password"
            name="passwordConfirm"
            error={
              formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
                ? formik.errors.passwordConfirmation
                : ''
            }
            {...formik.getFieldProps('passwordConfirmation')}
          />

          <Button
            fullWidth
            disabled={formik.isSubmitting || isPasswordResetSuccess}
            onClick={() => formik.submitForm()}
          >
            {isPasswordResetSuccess ? 'Password successfully reset' : 'Reset your password'}
          </Button>

          {isPasswordResetSuccess ? (
            <>
              <Text align="center">Click the button below to continue.</Text>
              <Button href={continueUrl} size="normal" fullWidth>
                Continue
              </Button>
            </>
          ) : null}
        </Stack>
      </form>
    </Container>
  );
};

export default ResetPassword;
