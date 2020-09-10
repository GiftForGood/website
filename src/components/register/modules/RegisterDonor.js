import React, { useState } from 'react';
import {
  Button,
  InputField,
  Stack,
  Text,
  SocialButton,
  Heading,
  Alert,
  ButtonLink,
} from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';

import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { setIsBackToLanding } from '../actions';
import styled from 'styled-components';
import { colors } from '@constants/colors';
import RedButton from '../../buttons/RedButton';
import api from '@api';
import { useRouter } from 'next/router';
import client from '@utils/axios';
import { timeout } from '../utils/timeout';
import PasswordStrength from './PasswordStrength';
import { Check } from '@kiwicom/orbit-components/lib/icons';
import CheckIconWrapper from './CheckIconWrapper';
import TextLink from '@kiwicom/orbit-components/lib/TextLink';

const HeadingColor = styled.div`
  color: ${colors.donorBackground};
`;

const RegisterDonor = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [isPasswordSecure, setIsPasswordSecure] = useState(false);

  const handleBackToLandingOnClick = () => {
    dispatch(setIsBackToLanding());
  };

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  };

  const handleFormSubmission = async (values) => {
    try {
      setIsLoading(true);
      const [token, user, userDoc] = await api.auth.registerDonorWithEmailAndPassword(values.email, values.password);
      await api.auth.sendVerificationEmail();
      displayAlert('Successfully Registered!', `A verification email has been sent to ${user.email}`, 'success');
      let response = await client.post('/api/sessionLogin', { token });
      if (response.status === 200) {
        await timeout(1000);
        router.push('/');
      } else {
        throw response.error;
      }
    } catch (error) {
      console.error(error);
      await api.auth.logout();
      setIsLoading(false);
      formik.setSubmitting(false);
      if (error.code === 'auth/email-already-in-use') {
        displayAlert('Email already in use', error.message, 'critical');
      } else if (error.code === 'auth/invalid-email') {
        displayAlert('Invalid Email', error.message, 'critical');
      } else if (error.code === 'auth/unable-to-create-user') {
        displayAlert('Error', error.message, 'critical');
      } else {
        displayAlert('Error', error.message, 'critical');
      }
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);
      const [token, user, userDoc] = await api.auth.registerDonorWithGoogle();
      let response = await client.post('/api/sessionLogin', { token });
      if (response.status === 200) {
        await timeout(1000);
        router.push('/');
      } else {
        throw response.error;
      }
    } catch (error) {
      console.error(error);
      await api.auth.logout();
      setGoogleLoading(false);
      if (error.code === 'auth/unable-to-create-user') {
        displayAlert('Error', error.message, 'critical');
      } else {
        displayAlert('Error', error.message, 'critical');
      }
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email').required('Required'),
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
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmission(values);
    },
  });

  return (
    <div>
      <Button
        type="secondary"
        circled
        iconLeft={<ChevronLeft />}
        onClick={handleBackToLandingOnClick}
        spaceAfter="normal"
      />
      <Text align="center" as="div" spaceAfter="largest">
        <Stack direction="row" align="center" justify="center">
          <Heading size="large" weight="bold">
            I am a
          </Heading>
          <Heading size="large" weight="bold">
            <HeadingColor>Donor</HeadingColor>
          </Heading>
        </Stack>
      </Text>
      <SocialButton
        type="google"
        fullWidth={true}
        spaceAfter="normal"
        onClick={handleGoogleRegister}
        loading={googleLoading}
        disabled={isLoading}
      >
        Sign in with Google
      </SocialButton>
      <Text align="center" spaceAfter="normal">
        OR
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing="comfy" spaceAfter="normal">
          <InputField
            disabled={formik.isSubmitting}
            type="email"
            value="name@example.co"
            label="Email"
            name="email"
            autoComplete="email"
            placeholder="e.g. name@email.com"
            error={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
            {...formik.getFieldProps('email')}
          />

          <Stack spacing="none">
            <InputField
              disabled={formik.isSubmitting}
              type="password"
              label="Create a password"
              name="password"
              autoComplete="new-password"
              error={formik.touched.password && formik.errors.password ? true : false}
              {...formik.getFieldProps('password')}
              suffix={
                isPasswordSecure ? (
                  <CheckIconWrapper>
                    <Check />
                  </CheckIconWrapper>
                ) : null
              }
            />

            {formik.touched.password && formik.errors.password ? (
              <Text size="small" type="critical" weight="bold">
                {formik.errors.password}
              </Text>
            ) : (
              <Text size="small" type="secondary">
                Please create a password with at least 12 characters, comprising a mix of uppercase and lowercase
                letters, numbers and symbols
              </Text>
            )}
          </Stack>

          <PasswordStrength
            password={formik.values.password}
            show={formik.errors.password && formik.values.password.length > 0 ? true : false}
            onSecure={() => {
              setIsPasswordSecure(true);
            }}
            onNotSecure={() => {
              setIsPasswordSecure(false);
            }}
          />

          <InputField
            disabled={formik.isSubmitting}
            type="password"
            label="Confirm password"
            name="passwordConfirm"
            autoComplete="new-password"
            error={
              formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
                ? formik.errors.passwordConfirmation
                : ''
            }
            {...formik.getFieldProps('passwordConfirmation')}
          />

          <Button
            submit
            fullWidth={true}
            asComponent={RedButton}
            disabled={formik.isSubmitting}
            loading={isLoading}
            disabled={googleLoading}
          >
            Register
          </Button>
          <Text align="center" type="secondary">
            By joining, you agree to the{' '}
            <TextLink type="secondary" external href="https://www.giftforgood.io/privacy-policy">
              Privacy Policy
            </TextLink>{' '}
            and our{' '}
            <TextLink type="secondary" external href="https://www.giftforgood.io/terms-and-conditions">
              Terms and Conditions
            </TextLink>
            .
          </Text>
        </Stack>
      </form>

      {showAlert ? (
        <Alert icon title={alertTitle} type={alertType}>
          {alertDescription}
        </Alert>
      ) : null}
    </div>
  );
};

export default RegisterDonor;
