import styled from 'styled-components';

const CircularImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const Avatar = ({ imageUrl }) => {
  return <CircularImage src={imageUrl} />;
};

export default Avatar;
