// Credits:
// - https://github.com/kiwicom/orbit-components/blob/master/src/InputField/index.js

import React from 'react';
import styled from 'styled-components';
import { css } from 'styled-components';
import convertHexToRgba from '@kiwicom/orbit-design-tokens/lib/convertHexToRgba';

const formElementFocus = () => css`
  box-shadow: ${({ theme, error }) =>
    error
      ? `inset 0 0 0 1px ${theme.orbit.paletteRedNormal}, 0 0 0 3px ${convertHexToRgba(
          theme.orbit.paletteRedNormal,
          15
        )};`
      : `inset 0 0 0 1px ${theme.orbit.borderColorInputFocus}, 0 0 0 3px ${convertHexToRgba(
          theme.orbit.borderColorInputFocus,
          15
        )};`};
`;

const Text = styled.p`
  margin: 8px auto;
`;

const Error = styled(Text)`
  font-size: 12px;
  color: #d21c1c;
  font-weight: 500;
  line-height: 16px;
  width: 100%;
  margin-top: 2px;
  position: relative;
  top: 100%;
  max-height: 16px;
  font-family: 'Roboto', -apple-system, '.SFNSText-Regular', 'San Francisco', 'Segoe UI', 'Helvetica Neue',
    'Lucida Grande', sans-serif;
  margin-bottom: 40px;
`;

const Help = styled(Text)`
  font-size: 12px;
  color: #5f738c;
  font-weight: 400;
  line-height: 16px;
  width: 100%;
  margin-top: 2px;
  position: relative;
  top: 100%;
  max-height: 16px;
  font-family: 'Roboto', -apple-system, '.SFNSText-Regular', 'San Francisco', 'Segoe UI', 'Helvetica Neue',
    'Lucida Grande', sans-serif;
  margin-bottom: 40px;
`;

const Wrapper = styled.div`
  position: relative;
  display: block;
  z-index: 2;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Input = styled.input`
  -webkit-appearance: none; 
  font-family: 'Roboto', -apple-system, '.SFNSText-Regular', 'San Francisco', 'Segoe UI', 'Helvetica Neue',
    'Lucida Grande', sans-serif;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  position: relative;
  padding: 0 12px;
  border: none;
  box-shadow: inset 0 0 0
    ${({ theme, error }) =>
      `${theme.orbit.borderWidthInput} ${error ? theme.orbit.borderColorInputError : theme.orbit.borderColorInput}`};

  background-color: ${({ disabled, theme }) =>
    disabled ? theme.orbit.backgroundInputDisabled : theme.orbit.backgroundInput};
  margin: 0;
  height: 44px;
  border-radius: ${({ theme }) => theme.orbit.borderRadiusNormal};

  &:focus {
    outline: none;
    ${formElementFocus}
  }

  &::placeholder {
    color: ${({ theme }) => theme.orbit.colorPlaceholderInput};
    opacity: 1;
  }
`;

const StyledAsterisk = styled.span`
  font-weight: ${({ theme }) => theme.orbit.fontWeightBold};
  color: ${({ theme, filled }) => (filled ? theme.orbit.colorTextError : theme.orbit.colorFormLabelFilled)};
  font-size: ${({ theme }) => theme.orbit.fontSizeFormLabel};
  vertical-align: top;
`;

const FormLabel = styled(({ className, children, required, filled, dataTest, id }) => (
  <span className={className} data-test={dataTest} id={id}>
    {required && (
      <StyledAsterisk aria-hidden="true" filled={filled}>
        *{' '}
      </StyledAsterisk>
    )}
    <span>{children}</span>
  </span>
))`
  display: block;
  font-family: ${({ theme }) => theme.orbit.fontFamily};
  font-size: ${({ theme }) => theme.orbit.fontSizeFormLabel};
  color: ${({ theme, filled, disabled }) =>
    !filled || disabled ? theme.orbit.colorFormLabel : theme.orbit.colorFormLabelFilled};
  line-height: ${({ theme }) => theme.orbit.lineHeightTextSmall};
  margin-bottom: ${({ theme }) => theme.orbit.spaceXXSmall};
`;

const TextField = styled(
  ({ id, name, value, placeholder, isTouched, help, type, onChange, disabled, className, error, label, required }) => {
    return (
      <div className={className}>
        {label && (
          <FormLabel filled={!!value} required={required}>
            {label}
          </FormLabel>
        )}
        <Wrapper>
          <Input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            error={error}
          />
        </Wrapper>

        {help && !error && <Help>{help}</Help>}
        {error && <Error>{error}</Error>}
      </div>
    );
  }
)``;

export default TextField;
