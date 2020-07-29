import { useState, useEffect } from 'react';

/**
 * Credits to @deckele in stackoverflow:
 * https://codesandbox.io/s/lpn3261j99?file=/src/index.tsx:1072-1121
 *
 * Creates a delay before unmounting so that the animation gets to run before the component
 * gets unmounted. Returns shouldRender that determines whether to unmount component.
 */
const useDelayUnmount = (isShow, delayTime) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isShow && !shouldRender) {
      setShouldRender(true);
    } else if (!isShow && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime);
    }
    return () => clearTimeout(timeoutId);
  }, [isShow, delayTime, shouldRender]);
  return shouldRender;
};

export default useDelayUnmount;
