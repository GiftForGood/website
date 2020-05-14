import React, { useState } from 'react';
import { Button, InputField, Stack, Text, SocialButton, Heading, Alert } from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';

import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { setIsBackToLanding } from '../actions';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import RedButton from '../../button/RedButton';
import api from '../../../../utils/api';
import 'isomorphic-unfetch';
import { useRouter, withRouter } from 'next/router';
import client from '../../../../utils/axios';

const HeadingColor = styled.div`
  color: ${colors.donorBackground};
`;

const LoginDonor = () => {
  const dispatch = useDispatch();
  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const router = useRouter();

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  };

  const handleBackToLandingOnClick = () => {
    dispatch(setIsBackToLanding());
  };

  const handleFormSubmission = async (values) => {
    try {
      const [token, user, userDoc] = await api.auth.loginDonorWithEmailAndPassword(values.email, values.password);
      let response = await client.post('/api/sessionLogin', { token });
      if (response.status === 200) {
        //TODO: store inside redux store
        router.push('/');
      } else {
        throw response.error;
      }
    } catch (error) {
      console.log(error.details);
      displayAlert('Error', error.details, 'critical');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const [token, user, userDoc] = await api.auth.loginDonorWithGoogle();
      let response = await client.post('/api/sessionLogin', { token });
      if (response.status === 200) {
        //TODO: store inside redux store
        router.push('/');
      } else {
        throw response.error;
      }
    } catch (error) {
      console.log(error);
      displayAlert('Error', error.details, 'critical');
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Required'),
    password: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
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
      <SocialButton type="google" fullWidth={true} spaceAfter="normal" onClick={handleGoogleLogin}>
        Login with Google
      </SocialButton>
      <Text align="center" spaceAfter="normal">
        OR
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing="comfy" spaceAfter="normal">
          <InputField
            type="email"
            label="Email"
            name="email"
            error={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
            {...formik.getFieldProps('email')}
          />

          <InputField
            type="password"
            label="Password"
            name="password"
            spaceAfter={'normal'}
            error={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
            {...formik.getFieldProps('password')}
          />

          <Button submit fullWidth={true} asComponent={RedButton}>
            Login
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

export default withRouter(LoginDonor);
