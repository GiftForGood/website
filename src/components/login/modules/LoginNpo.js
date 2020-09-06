import React, { useState } from 'react';
import { Button, InputField, Stack, Text, Heading, Alert, TextLink } from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';

import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { setIsBackToLanding } from '../actions';
import styled from 'styled-components';
import { colors } from '@constants/colors';
import BlueButton from '../../buttons/BlueButton';
import api from '../../../../utils/api';
import client from '../../../../utils/axios';
import { useRouter } from 'next/router';

const HeadingColor = styled.div`
  color: ${colors.npoBackground};
`;

const LoginNpo = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const [token, user, userDoc] = await api.auth.loginNPO(values.email, values.password);
      let userData = userDoc.data();
      let response = await client.post('/api/sessionLogin', { token });
      if (response.status === 200) {
        router.push('/');
      } else {
        throw response.error;
      }
    } catch (error) {
      console.error(error);
      await api.auth.logout();
      setIsLoading(false);
      formik.setSubmitting(false);
      if (error.code === 'auth/user-disabled') {
        displayAlert('User has been disabled, please contact administrator.', error.message, 'critical');
      } else if (error.code === 'auth/invalid-email') {
        displayAlert('Invalid Email', error.message, 'critical');
      } else if (error.code === 'auth/user-not-found') {
        displayAlert('User does not exists', error.message, 'critical');
      } else if (error.code === 'auth/wrong-password') {
        displayAlert('Either email or password is wrong', error.message, 'critical');
      } else if (error.code === 'auth/unable-to-create-user') {
        displayAlert('Error', error.message, 'critical');
      } else if (error.code === 'auth/invalid-user') {
        displayAlert('Error', error.message, 'critical');
      } else {
        displayAlert('Error', error.message, 'critical');
      }
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
        spaceAfter="large"
      />
      <Text align="center" as="div" spaceAfter="largest">
        <Stack direction="row" align="center" justify="center">
          <Heading size="large" weight="bold">
            I am a
          </Heading>
          <Heading size="large" weight="bold">
            <HeadingColor>Non Profit Organization</HeadingColor>
          </Heading>
        </Stack>
      </Text>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing="extraLoose">
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
            help={
              <div>
                <TextLink type="secondary" href="/forget-password">
                  Forget password?
                </TextLink>
              </div>
            }
          />

          <Button submit fullWidth={true} asComponent={BlueButton} loading={isLoading}>
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

export default LoginNpo;
