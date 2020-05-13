import { Text } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';

const SquareBox = styled.div`
  width: calc(75px + 2vw);
  height: calc(75px + 2vw);
  min-width: 75px;
  min-height: 75px;
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${(props) => props.src});
  background-size: cover;
  border-radius: 1vw;
`;

const CaptionInBox = styled.div`
  position: absolute;
  bottom: 5%;
  left: 5%;
  overflow-x: hidden;
`;

/**
 *
 * @param {string} imageUrl: the url of the image
 * @param {string} caption: the text displayed within the image
 * @param {string} captionSize: small, normal, large
 * @param {string} captionType: primary, secondary, info, success, warning, critical, white
 */
const SquareImageBox = ({ imageUrl, caption, captionSize, captionType }) => {
  return (
    <SquareBox src={imageUrl}>
      <CaptionInBox>
        <Text type={captionType || 'white'} size={captionSize || 'small'}>
          {caption}
        </Text>
      </CaptionInBox>
    </SquareBox>
  );
};

export default SquareImageBox;
