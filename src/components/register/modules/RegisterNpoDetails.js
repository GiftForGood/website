import React, { useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import { Button, InputField, Stack, Checkbox, Text, TextLink } from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';

import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { setIsBackToNpoRegister, setNpoDetails } from '../actions';

const RegisterNpoDetails = () => {
	const dispatch = useDispatch();

	const handleBackToLandingOnClick = () => {
		dispatch(setIsBackToNpoRegister());
	};

	const handleFormSubmission = (values) => {
		dispatch(setNpoDetails(values.name, values.mobileNumber))
		// TODO: API to call Firebase 
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
		termsAndCondition: Yup.boolean().required('Required').oneOf([true], 'You must accept the terms and conditions'),
	});

	const formik = useFormik({
		initialValues: {
			name: '',
			mobileNumber: '',
			email: '',
			password: '',
			passwordConfirmation: '',
			termsAndCondition: false,
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			handleFormSubmission(values);
		},
	});

	return (
		<div>
			<Button circled iconLeft={<ChevronLeft />} onClick={handleBackToLandingOnClick} />
			<form onSubmit={formik.handleSubmit}>
				<Stack>
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

					<Checkbox
						checked={formik.values.termsAndCondition}
						label={
							<Text>
								I agree to the{' '}
								<TextLink external href="https://www.google.com" stopPropagation>
									Terms and Conditions
								</TextLink>
								.
							</Text>
						}
						{...formik.getFieldProps('termsAndCondition')}
						hasError={
							formik.touched.termsAndCondition && formik.errors.termsAndCondition ? formik.errors.termsAndCondition : ''
						}
					/>

					<Button submit fullWidth={true}>
						Register
					</Button>
				</Stack>
			</form>
		</div>
	);
};

export default withRouter(RegisterNpoDetails);
