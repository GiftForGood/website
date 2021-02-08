import { useState, useEffect } from 'react';

function useDraftedInput(key, initialValue) {
  // assumption: keys that include a keyword null represents a variable that does not exist
  if (key.includes('null')) {
    return useState(initialValue);
  }

  if (process.browser) {
    const [storedInputValue, setStoredInputValue] = useState(() => {
      try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // If error also return initialValue
        console.error(error);
        return initialValue;
      }
    });

    useEffect(() => {
      // reset item value when key changes
      const item = window.localStorage.getItem(key);
      setStoredInputValue(item ? JSON.parse(item) : initialValue);

      return () => {
        // remove draft input if empty string
        if (JSON.parse(window.localStorage.getItem(key)) === '') {
          window.localStorage.removeItem(key);
        }
      };
    }, [key]);

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedInputValue) : value;
        // Save state
        setStoredInputValue(valueToStore);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.error(error);
      }
    };

    return [storedInputValue, setValue];
  } else {
    return [];
  }
}

export default useDraftedInput;
