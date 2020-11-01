import React, { useState, useEffect, useContext, createContext } from 'react';
import { remoteConfig } from '@utils/firebase';

const RemoteConfigContext = createContext({
  configs: null,
});

export function RemoteConfigProvider({ children }) {
  const [configs, setConfig] = useState(null);

  useEffect(() => {
    remoteConfig.fetchAndActivate().then(() => {
      const allConfig = remoteConfig.getAll();
      const entries = Object.entries(allConfig);
      let parsedConfigs = {};
      entries.forEach((entry) => {
        let key = entry[0];
        let value = entry[1].asString();

        if (value) {
          parsedConfigs[key] = JSON.parse(value);
        } else {
          parsedConfigs[key] = value;
        }
      });
      setConfig(parsedConfigs);
    });
  }, []);

  return <RemoteConfigContext.Provider value={{ configs }}>{children}</RemoteConfigContext.Provider>;
}

export const useRemoteConfig = () => {
  return useContext(RemoteConfigContext);
};
