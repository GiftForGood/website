import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import CameraIconButton from '@components/buttons/CameraIconButton';
import { v4 as uuidv4 } from 'uuid';
import { Button, Stack } from '@kiwicom/orbit-components/lib';
import { colors } from '@constants/colors';

const Container = styled.div`
  position: relative;
  display: flex;
  height: 150px;
  width: 150px;
`;

const Image = styled.img`
  min-height: 100%;
  min-width: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 5px solid white;
  background-color: ${colors.primaryBlue.focus};
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const ProfilePhoto = ({ onImageSelected, src, showEdit }) => {
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
      <Stack direction="row">
        <Button size="small" type="neutral" onClick={() => setHasUpload(false)}>
          Cancel
        </Button>
        <Button
          size="small"
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
    </Container>
  );
};

export default ProfilePhoto;
