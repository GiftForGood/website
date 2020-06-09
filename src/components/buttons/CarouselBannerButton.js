import styled from 'styled-components';
import { Button } from '@kiwicom/orbit-components/lib';
import { ChevronRight, ChevronLeft } from '@kiwicom/orbit-components/lib/icons';
import { colors } from '../../../utils/constants/colors';

const CarouselButton = styled.div`
  background: Gainsboro;
  opacity: 60%;
  :hover {
    border-color: 1px solid ${colors.subtleGrey};
    opacity: 90%;
  }
  :focus {
    box-shadow: 0 0 0 3px ${colors.subtleGrey};
  }
`;

const CarouselArrow = styled.div`
  ${(props) => (props.direction === 'left' ? 'left: -10px' : 'right: -10px')};
  position: absolute;
  top: 50%;
  z-index: 10;
  transform: translate(0, -50%);
`;

/**
 *
 * @param {string} size can be small, normal or large
 * @param {string} direction can be left or right
 * @param {string} onClickHandler is the event to fire when button is clicked
 */
const CarouselBannerButton = ({ size, direction, onClickHandler }) => {
  return (
    <CarouselArrow direction={direction}>
      <Button
        circled
        iconLeft={direction === 'left' ? <ChevronLeft /> : <ChevronRight />}
        asComponent={CarouselButton}
        onClick={onClickHandler}
        type="white"
        size={size}
      />
    </CarouselArrow>
  );
};

export default CarouselBannerButton;
