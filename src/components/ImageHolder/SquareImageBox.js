import { Text } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';

const SquareBox = styled.div`
  width: calc(75px + 2vw);
  height: calc(75px + 2vw);
  min-width: 80px;
  min-height: 80px;
  position: relative;
`;

const CaptionInBox = styled.div`
  position: absolute;
  top: 80%;
  left: 10%;
  overflow-x: hidden;
`;

const styles = {
  imageStyle: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(70%)',
    borderRadius: '1vw',
  },
};

const SquareImageBox = ({ imageUrl, caption, captionSize, captionType }) => {
  return (
    <SquareBox>
      <img style={styles.imageStyle} src={imageUrl} />
      <CaptionInBox>
        {/* 
          captionType: primary, secondary, info, success, warning, critical, white
          captionSize: small, normal, large
        */}
        <Text type={captionType || 'white'} size={captionSize || 'small'}>
          {caption}
        </Text>
      </CaptionInBox>
    </SquareBox>
  );
};

export default SquareImageBox;
