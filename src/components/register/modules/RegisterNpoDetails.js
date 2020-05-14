import React, { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import { Button, InputField, Stack } from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';

import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { setIsBackToNpoRegister, setNpoDetails } from '../actions';
import BlueButton from '../../button/BlueButton';
import TermsAndConditionModal from './TermsAndConditionModal';
import api from '../../../../utils/api';

const RegisterNpoDetails = () => {
  const dispatch = useDispatch();
  const [openTnC, setOpenTnC] = useState(false);
  const [tnc, setTnC] = useState('');
  const [values, setValues] = useState({});

  useEffect(() => {
    api.termsandconditions.get().then((doc) => {
      setTnC(doc.data().content);
    });
  }, []);

  const handleBackToNpoRegisterOnClick = () => {
    dispatch(setIsBackToNpoRegister());
  };

  const handleFormSubmission = () => {
    dispatch(setNpoDetails(values.name, values.mobileNumber));
    console.log('handleFormSubmission',values)
    // TODO: API to call Firebase
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
      .required('Required.')
      .matches(/^[6|8|9]\d{7}$/, 'Phone number is not valid'),
    email: Yup.string().email().required('Required'),
    password: Yup.string()
      .required('Required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Please create a password with at least 12 characters, comprimising a mix of uppercase and lowercase letters, numbers and symbols'
      ),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
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
            label="Name"
            name="name"
            placeholder="Your full name"
            error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
            {...formik.getFieldProps('name')}
          />

          <InputField
            label="Mobile Number"
            name="mobileNumber"
            placeholder="Mobile Number or Your desk number"
            error={formik.touched.mobileNumber && formik.errors.mobileNumber ? formik.errors.mobileNumber : ''}
            {...formik.getFieldProps('mobileNumber')}
          />

          <InputField
            type="email"
            value="name@example.co"
            label="Email"
            name="email"
            placeholder="e.g. name@email.com"
            help="Please use your work email"
            error={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
            {...formik.getFieldProps('email')}
          />

          <InputField
            type="password"
            label="Create a password"
            name="password"
            help="Please create a password with at least 12 characters, comprimising a mix of uppercase and lowercase letters, numbers and symbols"
            error={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
            {...formik.getFieldProps('password')}
          />

          <InputField
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

          <Button submit fullWidth={true} asComponent={BlueButton}>
            Register
          </Button>
        </Stack>
      </form>

      {openTnC ? <TermsAndConditionModal onClose={handleModal} tnc={tnc} onSubmit={handleFormSubmission}/> : null}
    </div>
  );
};

export default withRouter(RegisterNpoDetails);
