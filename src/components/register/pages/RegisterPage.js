import React, { useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { getName, getContactNumber, getOrganization, getCurrentPage } from '../selectors';

import {
	setNpoOrganizationDetails,
	setIsNpoRegister,
	setIsNpoDetails,
	setIsDonorRegister,
	setIsBackToLanding,
	setIsBackToNpoRegister,
} from '../actions';

import { LANDING, NPO_REGISTER, DONOR_REGISTER, NPO_DETAILS } from '../utils/SubPages';

import RegisterLanding from '../modules/RegisterLanding';
import RegisterBackground from '../modules/RegisterBackground';
import RegisterNpoOrganization from '../modules/RegisterNpoOrganization';
import RegisterNpoDetails from '../modules/RegisterNpoDetails';
import RegisterDonor from '../modules/RegisterDonor';

const RegisterPage = (props, state) => {
	const currentPage = useSelector(getCurrentPage);

	function rightRegister(currentPage) {
		switch (currentPage) {
			case LANDING:
				return <RegisterLanding />;
			case NPO_REGISTER:
				return <RegisterNpoOrganization />;
			case DONOR_REGISTER:
				return <RegisterDonor />;
			case NPO_DETAILS:
				return <RegisterNpoDetails />;
			default:
				return <RegisterLanding />;
		}
	}

	return (
		<div>
			<RegisterBackground />
			{rightRegister(currentPage)}
		</div>
	);
};

export default withRouter(RegisterPage);
