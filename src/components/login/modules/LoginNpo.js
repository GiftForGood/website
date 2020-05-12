import React from 'react';
import { Button, InputField, Stack, Text, SocialButton, Heading } from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';

import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { setIsBackToLanding } from '../actions';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import BlueButton from '../../button/BlueButton';

const HeadingColor = styled.div`
	color: ${colors.npoBackground};
`;

const LoginNpo = () => {
	const dispatch = useDispatch();

	const handleBackToLandingOnClick = () => {
		dispatch(setIsBackToLanding());
	};

	const handleFormSubmission = (values) => {
		// TODO: API to call Firebase
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
						<HeadingColor>Non Profit Organization</HeadingColor>
					</Heading>
				</Stack>
			</Text>

			<form onSubmit={formik.handleSubmit}>
				<Stack spacing="comfy">
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

					<Button submit fullWidth={true} asComponent={BlueButton}>
						Login
					</Button>
				</Stack>
			</form>
		</div>
	);
};

export default LoginNpo;
