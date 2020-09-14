import React from 'react';
import { ButtonLink } from '@kiwicom/orbit-components/lib';

const Tab = ({ label, onClick, activeTab, href }) => {
  const tabOnClick = () => {
    onClick(label);
  };

  return (
    <div onClick={tabOnClick}>
      <ButtonLink type={activeTab ? 'primary' : 'secondary'} href={href}>
        {label}
      </ButtonLink>
    </div>
  );
};

export default Tab;
