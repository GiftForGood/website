import React from 'react';
import { Text } from '@kiwicom/orbit-components/lib';
import Stack from '@kiwicom/orbit-components/lib/Stack';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { colors } from '../../../utils/constants/colors';

const SquareBox = styled.div`
  width: calc(60px + 2vw);
  height: calc(60px + 2vw);
  min-width: 75px;
  min-height: 75px;
  position: relative;
  background: url(${(props) => props.src});
  background-size: cover;
  border-radius: 1vw;

  :hover {
    background-color: ${colors.categoryHover};
  }
`;

const CaptionInBox = styled.div`
  overflow-x: hidden;
`;

const ImageContainer = styled.div`
  padding: 0px 10px 0px 0px;

  ${media.largeMobile(css`
    padding: 0px 10px 0px 10px;
  `)};
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
    <ImageContainer>
      <Stack>
        <SquareBox src={imageUrl}></SquareBox>
        <CaptionInBox>
          <Text type={captionType || 'primary'} size={captionSize || 'small'} align="center">
            {caption}
          </Text>
        </CaptionInBox>
      </Stack>
    </ImageContainer>
  );
};

export default SquareImageBox;
