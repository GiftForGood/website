import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MAXIMUM_ALLOWED_PHOTOS } from '../../../../utils/constants/donorUploadPhoto';
import { Text, ButtonPrimitive } from '@kiwicom/orbit-components/lib';
import { v4 as uuidv4 } from 'uuid';
import Remove from '@kiwicom/orbit-components/lib/icons/Remove';

const getColor = (props) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const DragNDropContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const Container = styled.div`
  padding: 20px;

  ${media.largeMobile(css`
    min-width: 500px;
  `)};

  ${media.desktop(css`
    min-height: 300px;
  `)};
`;

const HorizontalImagesContainer = styled.div`
  display: flex;
  overflow: auto;
`;

const DraggableImageContainer = styled.div`
  ${(props) => props.draggableStyle}
`;

const NormalText = styled.p`
  margin: 8px auto;
`;

const Error = styled(NormalText)`
  font-size: 12px;
  color: #d21c1c;
  font-weight: 500;
  line-height: 16px;
  width: 100%;
  margin-top: 2px;
  top: 100%;
  max-height: 16px;
  font-family: 'Roboto', -apple-system, '.SFNSText-Regular', 'San Francisco', 'Segoe UI', 'Helvetica Neue',
    'Lucida Grande', sans-serif;
  margin-bottom: 40px;
`;

const ImageWrapper = styled.img`
  margin: 10px;
  height: 100px;
  width: 100px;
  object-fit: cover;
  object-position: center;
`;

const DeleteWrapper = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  margin: 12px;
`;

const CoverTextWrapper = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  background-color: black;
  border-radius: 5px;

  width: 100px;
`;

const ImageContainer = styled.div`
  position: relative;
`;
const Image = ({ src, onDeleteClick }) => {
  return (
    <ImageContainer>
      <ImageWrapper src={src} />
      <DeleteWrapper>
        <ButtonPrimitive
          circled
          iconLeft={<Remove />}
          height="26px"
          icons={{ width: '14px' }}
          backgroundActive={'#CAD4DE'}
          boxShadowActive={`inset 0 0 6px 3px rgba(37,42,49,0.08)`}
          onClick={onDeleteClick}
        />
      </DeleteWrapper>
    </ImageContainer>
  );
};

const DragNDropInputField = ({ onChange, error }) => {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
  });
  const [selectedImages, setSelectedImages] = useState([]);

  // Only take maximum 4 images.
  const populateSelectedImages = () => {
    if (acceptedFiles.length > 0 && selectedImages.length <= MAXIMUM_ALLOWED_PHOTOS - 1) {
      const allowedRemainingImages = MAXIMUM_ALLOWED_PHOTOS - selectedImages.length;
      const acceptedImages = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: uuidv4(),
        })
      );
      if (allowedRemainingImages > 0) {
        const allowedImages = acceptedImages.splice(0, allowedRemainingImages);
        setSelectedImages([...selectedImages, ...allowedImages]);
        onChange([...selectedImages, ...allowedImages]);
      }
    }
  };

  useEffect(() => {
    populateSelectedImages();
  }, [acceptedFiles]);

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      selectedImages.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [selectedImages]
  );

  const onDragEnd = (result) => {
    if (!result.destination) {
      // dropped outside the list
      return;
    }
    const items = reorder(selectedImages, result.source.index, result.destination.index);
    setSelectedImages(items);
  };

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDeleteClick = (index) => {
    let cloneSelectedImages = [...selectedImages];
    cloneSelectedImages.splice(index, 1);
    setSelectedImages(cloneSelectedImages);
  };

  return (
    <Container>
      <DragNDropContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop up to {MAXIMUM_ALLOWED_PHOTOS} photos, or click to select photos</p>
      </DragNDropContainer>
      {error && <Error>{error}</Error>}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <HorizontalImagesContainer ref={provided.innerRef} {...provided.droppableProps}>
              {selectedImages.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <DraggableImageContainer
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      draggableStyle={provided.draggableProps.style}
                    >
                      <Image src={item.preview} onDeleteClick={() => onDeleteClick(index)} />
                    </DraggableImageContainer>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </HorizontalImagesContainer>
          )}
        </Droppable>
      </DragDropContext>

      {selectedImages.length > 0 ? (
        <CoverTextWrapper>
          <Text type="white" align="center">
            Cover
          </Text>
        </CoverTextWrapper>
      ) : null}
    </Container>
  );
};

export default DragNDropInputField;
