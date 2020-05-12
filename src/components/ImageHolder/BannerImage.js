import styled from 'styled-components';

const BannerImageContainer = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  filter: brightness(70%);
`;

const BannerImage = ({ imageUrl }) => {
  return (
    <div>
      <BannerImageContainer src={imageUrl} />
    </div>
  );
};

export default BannerImage;
