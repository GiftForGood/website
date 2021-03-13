import React, { useEffect, useState } from 'react';

// components
import { Stack, Text } from '@kiwicom/orbit-components/lib';
import { Close, Check } from '@kiwicom/orbit-components/lib/icons';

// constants
import { colors } from '@constants/colors';

const PasswordStrength = ({ password, show, onSecure, onNotSecure }) => {
  const [isMinimum12Chars, setMinimum12Chars] = useState(false);
  const [isAtLeastOneUppercaseChar, setIsAtLeastOneUppercaseChar] = useState(false);
  const [isAtLeastOneLowercaseChar, setIsAtLeastOneLowercaseChar] = useState(false);
  const [isAtLeastOneSpecialChar, setIsAtLeastOneSpecialChar] = useState(false);
  const [isAtLeastOneDigit, setIsAtLeastOneDigit] = useState(false);

  const testMinimum12Chars = (password) => {
    const tester = new RegExp(/^(?=.{12,})/);
    return tester.test(password);
  };

  const testAtLeastOneUppercaseChar = (password) => {
    const tester = new RegExp(/^(?=.*[A-Z])/);
    return tester.test(password);
  };

  const testAtLeastOneLowercaseChar = (password) => {
    const tester = new RegExp(/^(?=.*[a-z])/);
    return tester.test(password);
  };

  const testAtLeastOneSpecialChar = (password) => {
    const tester = new RegExp(/^(?=.*[\!\@\#\$%\^&\*\-\+\=\?\;\:\[\]\{\}\|\`\~\"\'\_\.])/);
    return tester.test(password);
  };

  const testAtLeastOneDigit = (password) => {
    const tester = new RegExp(/^(?=.*[0-9])/);
    return tester.test(password);
  };

  useEffect(() => {
    if (password) {
      const min12 = testMinimum12Chars(password);
      const oneUppercase = testAtLeastOneUppercaseChar(password);
      const oneLowercase = testAtLeastOneLowercaseChar(password);
      const oneSpecialChar = testAtLeastOneSpecialChar(password);
      const oneDigit = testAtLeastOneDigit(password);
      setMinimum12Chars(min12);
      setIsAtLeastOneUppercaseChar(oneUppercase);
      setIsAtLeastOneLowercaseChar(oneLowercase);
      setIsAtLeastOneSpecialChar(oneSpecialChar);
      setIsAtLeastOneDigit(oneDigit);
      if (min12 && oneLowercase && oneUppercase && oneSpecialChar && oneDigit) {
        onSecure();
      } else {
        onNotSecure();
      }
    } else {
      onNotSecure();
    }
  }, [password]);

  if (!show) {
    return <div></div>;
  }

  return (
    <Stack>
      <Rule pass={isMinimum12Chars} title="Minimum 12 characters" />
      <Rule pass={isAtLeastOneUppercaseChar} title="At least 1 uppercase character" />
      <Rule pass={isAtLeastOneLowercaseChar} title="At least 1 lowercase character" />
      <Rule pass={isAtLeastOneSpecialChar} title="At least 1 special symbol" />
      <Rule pass={isAtLeastOneDigit} title="At least 1 number" />
    </Stack>
  );
};

const Rule = ({ pass, title }) => {
  return (
    <Stack direction="row">
      {pass ? (
        <Check customColor={colors.passwordText.correct} size="small" />
      ) : (
        <Close customColor={colors.passwordText.wrong} size="small" />
      )}
      <Text size="small">{title}</Text>
    </Stack>
  );
};

export default PasswordStrength;
