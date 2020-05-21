import React from 'react';
import { ButtonLink } from '@kiwicom/orbit-components/';

const LogoButton = ({ src, height, href }) => {
  return (
    <ButtonLink transparent type="secondary" href={href}>
      <img src={src} alt="logo" height={height} />
    </ButtonLink>
  );
};

export default LogoButton;
