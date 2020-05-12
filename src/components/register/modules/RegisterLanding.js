import React from 'react';
import { withRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Text, Heading, Grid, TextLink, Stack } from '@kiwicom/orbit-components/lib';

import { setIsNpoRegister, setIsDonorRegister } from '../actions';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

import NpoRegistrationCard from '../../card/NpoRegistrationCard';
import DonorRegistrationCard from '../../card/DonorRegistrationCard';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	
	${media.largeMobile(css`
		height: 100%;
		justify-content: center;
	`)};
`;
const RegisterLanding = (props, state) => {
	const dispatch = useDispatch();

	const handleNpoOnClick = () => {
		dispatch(setIsNpoRegister());
	};

	const handleDonorOnClick = () => {
		dispatch(setIsDonorRegister());
	};

	return (
		<Container>
			<Text align="center" as="div">
				<Heading spaceAfter="largest" size="large" weight="bold">
					Join GiftForGood
				</Heading>
			</Text>

			<Stack spaceAfter="largest">
			<Grid
				desktop={{
					columns: 'repeat(2, 1fr)',
					gap: '40px',
				}}
				gap="20px"
				spaceAfter="largest"
			>
				<NpoRegistrationCard onClick={handleNpoOnClick} />
				<DonorRegistrationCard onClick={handleDonorOnClick} />
			</Grid>
			</Stack>
			

			<Text>
				Already have an account?{' '}
				<TextLink external href="https://www.google.com" stopPropagation>
					Login
				</TextLink>
				.
			</Text>
		</Container>
	);
};

export default withRouter(RegisterLanding);
