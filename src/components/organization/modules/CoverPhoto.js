import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import CameraIconButton from '@components/buttons/CameraIconButton';
import { v4 as uuidv4 } from 'uuid';
import { Button, Stack } from '@kiwicom/orbit-components/lib';
import { colors } from '@constants/colors';
import { MAXIMUM_FILE_SIZE_LIMIT } from '@constants/files';

const Container = styled.div`
  position: relative;
  display: flex;
  max-height: 250px;
  height: 250px;
  background-color: ${colors.primaryBlue.background};

  ${media.largeMobile(css`
    max-height: 350px;
    max-width: 1280px;
  `)};
`;

const Image = styled.img`
  min-height: 100%;
  min-width: 100%;
  object-fit: cover;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 10px;
`;

const CoverPhoto = ({ onImageSelected, src, showEdit, children, onError }) => {
  const [hasUpload, setHasUpload] = useState(false);
  const inputFile = useRef(null);
  const [file, setFile] = useState(null);

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const onCoverPhotoChange = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAXIMUM_FILE_SIZE_LIMIT) {
        onError('Unable to upload files that are more than 25mb');
        return;
      }

      setHasUpload(true);
      const updatedFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: uuidv4(),
      });
      setFile(updatedFile);
    }
  };

  const SaveAndCancel = () => {
    return (
      <Stack>
        <Button size="small" type="neutral" onClick={() => setHasUpload(false)}>
          Cancel
        </Button>
        <Button
          size="small"
          width="100%"
          onClick={() => {
            onImageSelected(file);
          }}
        >
          Save
        </Button>
      </Stack>
    );
  };

  return (
    <Container>
      <Image src={hasUpload ? file.preview : src} />
      <input
        type="file"
        id="coverPhoto"
        ref={inputFile}
        style={{ display: 'none' }}
        accept=".png, .jpg, .jpeg"
        onChange={onCoverPhotoChange}
      />
      {showEdit ? (
        <ButtonContainer>
          {hasUpload ? <SaveAndCancel /> : <CameraIconButton onClick={onButtonClick} />}
        </ButtonContainer>
      ) : null}

      {children}
    </Container>
  );
};

export default CoverPhoto;
