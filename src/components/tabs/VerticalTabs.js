import React, { useState } from 'react';
import Tab from '@components/tabs/Tab';

const VerticalTabs = ({ children }) => {
  return (
    <div>
      {children.map((child) => {
        const { label, href, active } = child.props;

        return <Tab activeTab={active} key={label} label={label} onClick={(tabLabel) => {}} href={href} />;
      })}
    </div>
  );
};

export default VerticalTabs;
