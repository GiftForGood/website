import React, { useState } from 'react';
import { Button, InputField, Stack, Text, SocialButton, Heading, Alert } from '@kiwicom/orbit-components/lib';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled, { css } from 'styled-components';
import ForgetPasswordButton from '../../buttons/ForgetPasswordButton';
import { companyIconImagePath } from '../../../../utils/constants/imagePaths';
import api from '../../../../utils/api';

const Logo = styled.img`
  height: 100px;
  width: 100px;
`;

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasSentEmail, setHasSentEmail] = useState(false);

  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  };

  const handleFormSubmission = async (values) => {
    try {
      setIsLoading(true);
      const { email } = values;
      await api.auth.sendPasswordResetEmail(email)
      setHasSentEmail(true);
      setIsLoading(false);
      displayAlert(
        'Successfully sent',
        `We've successfully sent an email to ${values.email}. Click the link in the email to reset your password.`,
        'success'
      );
      formik.setSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      formik.setSubmitting(false);
      if (error.code === 'auth/invalid-email') {
        displayAlert('Invalid Email Provided', error.message, 'critical');
      } else if (error.code === 'auth/user-not-found') {
        displayAlert('User not found', error.message, 'critical');
      } else {
        displayAlert('Error', error.message, 'critical');
      }
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(''),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmission(values);
    },
  });

  return (
    <div>
      <Text align="center" as="div" spaceAfter="largest">
        <Stack direction="column" align="center" justify="center">
          <Logo src={companyIconImagePath} />
          <Heading size="large" weight="bold">
            Forget your password?
          </Heading>
          <Text align="center">
            Enter the email address associated with your account and we’ll send you a link to reset your password.
          </Text>
        </Stack>
      </Text>

      {showAlert ? (
        <Alert icon title={alertTitle} type={alertType} spaceAfter="normal">
          {alertDescription}
        </Alert>
      ) : null}

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing="comfy" spaceAfter="normal">
          <InputField
            type="email"
            label="Email"
            name="email"
            disabled={formik.isSubmitting}
            error={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
            {...formik.getFieldProps('email')}
          />

          <Button
            submit
            fullWidth={true}
            asComponent={ForgetPasswordButton}
            loading={isLoading}
            disabled={!formik.dirty}
          >
            {hasSentEmail ? "Resend the password reset link": "Send a password reset link"}
          </Button>
        </Stack>
      </form>

      
    </div>
  );
};

export default ForgetPassword;
