import React from 'react';
import styled from 'styled-components';
import accountCircle from '../../../public/assets/account-circle.svg';

const CircularImage = styled.img`
  width: ${(props) => (props.width ? props.width : 40)}px;
  height: ${(props) => (props.height ? props.height : 40)}px;
  min-width: ${(props) => (props.width ? props.width : 40)}px;
  min-height: ${(props) => (props.height ? props.height : 40)}px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileAvatar = ({ imageUrl = "", height, width }) => {
  return (
    <>
      {imageUrl ? (
        <CircularImage src={imageUrl} height={height} width={width} />
      ) : (
        <CircularImage src={accountCircle} height={height} width={width} />
      )}
    </>
  );
};

export default ProfileAvatar;
