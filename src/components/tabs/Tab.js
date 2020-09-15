import React from 'react';
import { ButtonLink } from '@kiwicom/orbit-components/lib';
import PropTypes from 'prop-types';

const Tab = ({ label, onClick, active, href }) => {
  const tabOnClick = () => {
    onClick(label);
  };

  return (
    <div onClick={tabOnClick}>
      <ButtonLink type={active ? 'primary' : 'secondary'} href={href}>
        {label}
      </ButtonLink>
    </div>
  );
};

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  href: PropTypes.string.isRequired,
};

export default Tab;
