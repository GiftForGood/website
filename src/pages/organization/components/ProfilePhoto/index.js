import React, { useRef, useState } from 'react';
import styled from 'styled-components';

// components
import CameraIconButton from '@components/buttons/CameraIconButton';
import { Button, Stack } from '@kiwicom/orbit-components/lib';

// constants and utils
import { v4 as uuidv4 } from 'uuid';
import { colors } from '@constants/colors';
import { MAXIMUM_FILE_SIZE_LIMIT } from '@constants/files';

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

const ProfilePhoto = ({ onImageSelected, src, showEdit, onError }) => {
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

  const handleCancel = () => setHasUpload(false);

  const handleSave = () => onImageSelected(file);

  const hiddenInputStyle = { display: 'none' };

  const SaveAndCancel = () => {
    return (
      <Stack direction="row">
        <Button size="small" type="neutral" onClick={handleCancel}>
          Cancel
        </Button>
        <Button size="small" onClick={handleSave}>
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
        style={hiddenInputStyle}
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
