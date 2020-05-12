import React from 'react';
import styled from 'styled-components';
import { Text, Heading, Button } from '@kiwicom/orbit-components/lib';

const BlueButton = styled.button`
	background: #065ef5;

	:active {
		background: #0554dc;
	}

	:hover {
		background: #0554dc;
	}

	:focus {
		box-shadow: 0 0 0 3px rgba(4, 65, 170, 0.5);
	}
`;

const CardWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border-radius: 3px;
	box-shadow: 0px 0px 2px 0px rgba(37, 42, 49, 0.16), 0px 1px 4px 0px rgba(37, 42, 49, 0.12);
	height: 275px;
`;
const Description = styled.div`
	font-family: 'Roboto', -apple-system, '.SFNSText-Regular', 'San Francisco', 'Segoe UI', 'Helvetica Neue',
		'Lucida Grande', sans-serif;
	font-size: 14px;
	color: #252a31;
	line-height: 20px;
	-webkit-text-size-adjust: 100%;
	width: 100%;
	margin-top: 4px;
`;

const CardContent = styled.div`
	padding: 24px;
`;

const CardAction = styled.div`
	padding: 24px;
`;

const HeadingColor = styled.div`
	color: #065ef5;
`;

const Card = ({ onClick }) => {
	const Title = () => {
		return (
			<div>
				<Text size="large">I am a</Text>
				<Heading type="title2">
					<HeadingColor> Non Profit Organization</HeadingColor>
				</Heading>
			</div>
		);
	};

	return (
		<CardWrapper>
			<CardContent>
				<Title />
				<Description>
					As a Non Profit Organization, you can gain access to thousands of donors and even see what other Non Profit
					Organizations are requesting.
				</Description>
			</CardContent>

			<CardAction>
				<Button fullWidth={true} size="small" asComponent={BlueButton} onClick={onClick}>
					Sign up
				</Button>
			</CardAction>
		</CardWrapper>
	);
};

export default Card;
