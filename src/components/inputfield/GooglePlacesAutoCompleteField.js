import React, { useState, useEffect, useRef } from 'react';
import { InputField } from '@kiwicom/orbit-components/lib';
import { GOOGLE_PLACE_AUTOCOMPLETE_URL } from '../../../utils/constants/thirdPartyAPIUrl';
import useLocalStorage from '../../../utils/hooks/useLocalStorage';

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};

const unloadScript = () => {
  const allScripts = document.getElementsByTagName('script');
  [].filter.call(allScripts, (scpt) => scpt.src.indexOf('libraries=places') >= 0)[0].remove();

  window.google = {};
};

/**
 * The field that has google places auto complete.
 * @param {string} label is the label of the InputField
 * @param {boolean} storeLocally is to set if the location is stored locally on device
 * @param {string} help is the help label of the InputField
 * @param {string} storageKey is the key to storeLocally using localStorage
 * @param {function} onChange is the function called whenever the field changes
 * @param {string} error is the error for the field
 * @param {boolean} disabled is to disable the field
 */
const GooglePlacesAutoCompleteField = ({ label, storeLocally, help, storageKey, onChange, error, disabled }) => {
  const autoCompleteRef = useRef(null);
  const [location, setLocation] = useLocalStorage(storageKey, '');
  const [query, setQuery] = useState(location);

  useEffect(() => {
    onChange(location);
    loadScript(GOOGLE_PLACE_AUTOCOMPLETE_URL, () => handleScriptLoad(setQuery, autoCompleteRef));

    return function cleanup() {
      unloadScript();
    };
  }, []);

  useEffect(() => {
    setQuery(location);
  }, [location]);

  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current, {
      componentRestrictions: { country: 'sg' },
    });
    autoComplete.setFields(['address_components', 'formatted_address']);
    autoComplete.addListener('place_changed', () => handlePlaceSelect(updateQuery));
  };

  const handlePlaceSelect = async (updateQuery) => {
    const addressObject = autoComplete.getPlace();
    const { formatted_address } = addressObject;
    updateQuery(formatted_address);
    onChange(formatted_address);
    if (storeLocally) {
      setLocation(formatted_address);
    }
  };

  return (
    <InputField
      disabled={disabled}
      label={label}
      ref={autoCompleteRef}
      onChange={(event) => {
        setQuery(event.target.value);
      }}
      placeholder=""
      value={query}
      error={error}
      help={help}
    />
  );
};

export default GooglePlacesAutoCompleteField;
