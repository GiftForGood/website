import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentPage } from '../selectors';
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

export default RegisterPage;
