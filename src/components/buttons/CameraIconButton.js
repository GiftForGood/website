import React from 'react';
import Camera from '@kiwicom/orbit-components/lib/icons/Camera';
import { ButtonPrimitive } from '@kiwicom/orbit-components/lib';

const CameraIconButton = ({ onClick, height = '44px', width = '44px' }) => {
  return (
    <ButtonPrimitive
      circled
      asComponent="button"
      background="rgba(255,255,255,0.3)"
      backgroundActive="rgba(255,255,255,0.5)"
      backgroundFocus="rgba(255,255,255,0.5)"
      backgroundHover="rgba(255,255,255,0.5)"
      boxShadow="0 8px 8px -6px rgba(0,0,0,.25)"
      boxShadowActive="0 8px 8px -6px rgba(0,0,0,.25)"
      boxShadowFocus="0 8px 8px -6px rgba(0,0,0,.25)"
      boxShadowHover="0 8px 8px -6px rgba(0,0,0,.25)"
      fontWeight="700"
      height={height}
      width={width}
      iconRight={<Camera />}
      icons={{
        foreground: 'white',
        foregroundActive: 'white',
        foregroundHover: 'white',
        width: '24px',
      }}
      onClick={onClick}
      padding="0"
      size="normal"
    ></ButtonPrimitive>
  );
};

export default CameraIconButton;
