import React, { useState } from 'react';
import { Button, InputField, Stack, Text, SocialButton, Heading, Alert } from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';

import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { setIsBackToLanding } from '../actions';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import RedButton from '../../buttons/RedButton';
import api from '../../../../utils/api';
import { useRouter } from 'next/router';
import client from '../../../../utils/axios';
import Field from '../../inputfield';

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
        router.push('/');
      } else {
        throw response.error;
      }
    } catch (error) {
      console.error(error);
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
        router.push('/');
      } else {
        throw response.error;
      }
    } catch (error) {
      console.error(error);
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
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#\$%\^&\*\-\+\=\?\;\:\[\]\{\}\|\`\~\"\'\_])(?=.{12,})/,
        'Please create a password with at least 12 characters, comprising a mix of uppercase and lowercase letters, numbers and symbols'
      ),
    passwordConfirmation: Yup.string().required('Required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
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
            placeholder="e.g. name@email.com"
            error={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
            {...formik.getFieldProps('email')}
          />

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

          <Button submit fullWidth={true} asComponent={RedButton} disabled={formik.isSubmitting} loading={isLoading}>
            Register
          </Button>
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
