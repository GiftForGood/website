import React, { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import { Button, InputField, Stack, Alert, Text, ButtonLink, Tooltip, TextLink } from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';

import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { setIsBackToNpoRegister, setNpoDetails } from '../actions';
import { getOrganization } from '../selectors';
import BlueButton from '../../buttons/BlueButton';
import TermsAndConditionModal from './TermsAndConditionModal';
import api from '@api';
import client from '@utils/axios';
import { useRouter } from 'next/router';
import { timeout } from '../utils/timeout';

import PasswordStrength from './PasswordStrength';
import { Check } from '@kiwicom/orbit-components/lib/icons';
import CheckIconWrapper from './CheckIconWrapper';

const RegisterNpoDetails = () => {
  const dispatch = useDispatch();
  const [openTnC, setOpenTnC] = useState(false);
  const [tnc, setTnC] = useState('');
  const [values, setValues] = useState({});
  const organization = useSelector(getOrganization);
  const router = useRouter();

  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isPasswordSecure, setIsPasswordSecure] = useState(false);

  useEffect(() => {
    api.legal.get('tnc_npo').then((doc) => {
      setTnC(doc.data().content);
    });
  }, []);

  const handleBackToNpoRegisterOnClick = () => {
    dispatch(setIsBackToNpoRegister());
  };

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  };

  const handleFormSubmission = async () => {
    handleModal();
    setIsLoading(true);
    setShowAlert(false);
    dispatch(setNpoDetails(values.name, values.mobileNumber));
    try {
      let name = values.name;
      let contact = values.mobileNumber;
      let email = values.email;
      let password = values.password;
      let organizationName = organization.name;
      let registrationNumber = organization.registrationNumber;
      let activities = organization.activities;
      const [token, user, userDoc] = await api.auth.registerNPO(
        name,
        contact,
        email,
        password,
        organizationName,
        registrationNumber,
        activities
      );
      await api.auth.sendVerificationEmail();
      displayAlert(
        'Successfully Registered!',
        `A verification email has been sent to ${user.email}. Remember to check your junk email too!`,
        'success'
      );
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

  const handleModal = () => {
    if (openTnC) {
      setOpenTnC(false);
    } else {
      setOpenTnC(true);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    mobileNumber: Yup.string()
      .required('Required')
      .matches(/^[6|8|9]\d{7}$/, 'Phone number is not valid'),
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
      name: '',
      mobileNumber: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleModal();
      setValues(values);
    },
  });

  return (
    <div>
      <Button
        type="secondary"
        circled
        iconLeft={<ChevronLeft />}
        onClick={handleBackToNpoRegisterOnClick}
        spaceAfter="normal"
      />
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing="loose">
          <InputField
            disabled={formik.isSubmitting}
            label="Name"
            name="name"
            placeholder="Your full name"
            error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
            {...formik.getFieldProps('name')}
            help={
              <Tooltip
                content="Use your own name even though there might be multiple people sharing a single account."
                enabled
                preferredAlign="start"
                preferredPosition="bottom"
                size="medium"
              >
                <span>Not sure whose name to put?</span>
              </Tooltip>
            }
          />
          <InputField
            prefix="+65"
            disabled={formik.isSubmitting}
            label="Mobile Number"
            name="mobileNumber"
            placeholder="Mobile Number or Your desk number"
            error={formik.touched.mobileNumber && formik.errors.mobileNumber ? formik.errors.mobileNumber : ''}
            {...formik.getFieldProps('mobileNumber')}
          />
          <InputField
            disabled={formik.isSubmitting}
            type="email"
            value="name@example.co"
            label="Email"
            name="email"
            autoComplete="email"
            placeholder="e.g. name@email.com"
            help="Please use your work email"
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
          {showAlert ? (
            <Alert icon title={alertTitle} type={alertType}>
              {alertDescription}
            </Alert>
          ) : null}
          <Button submit fullWidth={true} asComponent={BlueButton} loading={isLoading}>
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

      {openTnC ? <TermsAndConditionModal onClose={handleModal} tnc={tnc} onSubmit={handleFormSubmission} /> : null}
    </div>
  );
};

export default withRouter(RegisterNpoDetails);
