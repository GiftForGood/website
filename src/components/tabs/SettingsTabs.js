import React from 'react';
import VerticalTabs from '@components/tabs/VerticalTabs';
import { TABS } from '@constants/settings';
import PropTypes from 'prop-types';

const SettingsTabs = ({ activeTab }) => {
  return (
    <VerticalTabs>
      <div label={TABS.EDIT_PROFILE} href="/settings/profile" active={activeTab === TABS.EDIT_PROFILE} />

      <div label={TABS.NPO_APPLICATION} href="/settings/npo-application" active={activeTab === TABS.NPO_APPLICATION} />
    </VerticalTabs>
  );
};

SettingsTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default SettingsTabs;
