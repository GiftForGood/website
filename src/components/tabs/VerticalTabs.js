import React, { useState } from 'react';
import Tab from '@components/tabs/Tab';
import PropTypes from 'prop-types';

/**
 * VerticalTabs works slightly differently than other Tabs components. It only renders
 * the label of the tab but not the content of the tab.
 */
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

VerticalTabs.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
};

export default VerticalTabs;
