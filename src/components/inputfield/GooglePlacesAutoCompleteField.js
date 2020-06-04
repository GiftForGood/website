import React, { useState, useEffect, useRef } from 'react';
import { InputField } from '@kiwicom/orbit-components/lib';
import { GOOGLE_PLACE_AUTOCOMPLETE_URL } from '../../../utils/constants/thirdPartyAPIUrl';

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

function handleScriptLoad(updateQuery, autoCompleteRef) {
  autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current, {
    componentRestrictions: { country: 'sg' },
  });
  autoComplete.setFields(['address_components', 'formatted_address']);
  autoComplete.addListener('place_changed', () => handlePlaceSelect(updateQuery));
}

async function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
  console.log(addressObject);
}

const SearchLocationInput = ({ label }) => {
  const [query, setQuery] = useState('');
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(GOOGLE_PLACE_AUTOCOMPLETE_URL, () => handleScriptLoad(setQuery, autoCompleteRef));

    return function cleanup() {
      unloadScript();
    };
  }, []);

  return (
    <InputField
      label={label}
      ref={autoCompleteRef}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="xyz"
      value={query}
    />
  );
};

export default SearchLocationInput;
