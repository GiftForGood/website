import styled from 'styled-components';
import { Button } from '@kiwicom/orbit-components/lib';
import { ChevronRight, ChevronLeft } from '@kiwicom/orbit-components/lib/icons';

const CarouselButton = styled.div`
  border: 0.5px solid white;
  border-radius: 25px;
  font-size: 10px;
  background: white;
  opacity: 60%;
  text-align: center;
  margin: 0.5vh auto;

  :hover {
    border-color: 1px solid white;
    opacity: 90%;
  }

  :focus {
    box-shadow: 0 0 0 3px #707070;
  }
`;

const CarouselArrow = styled.div`
  ${(props) => (props.direction === 'left' ? 'left: -10px' : 'right: -10px')};
  position: absolute;
  top: 50%;
  z-index: 10;
  width: fit-content;
  height: fit-content;
  transform: translate(0, -50%);
  background-color: 'grey';
`;

/**
 *
 * @param {string} size can be small, normal or large
 * @param {string} direction can be left or right
 * @param {string} scrollableId is the html id of the scrollable component that is scrolled when clicking on button
 */
const CarouselScrollButton = ({ ...props }) => {
  const { size, direction, scrollableId } = props;
  const getScrollableWidth = () => document.getElementById(scrollableId).clientWidth;
  const handleScrollLeft = () => (document.getElementById(scrollableId).scrollLeft -= getScrollableWidth());
  const handleScrollRight = () => (document.getElementById(scrollableId).scrollLeft += getScrollableWidth());

  return (
    <CarouselArrow direction={direction}>
      <Button
        circled
        iconLeft={direction === 'left' ? <ChevronLeft /> : <ChevronRight />}
        asComponent={CarouselButton}
        onClick={direction === 'left' ? handleScrollLeft : handleScrollRight}
        type="white"
        size={size}
      />
    </CarouselArrow>
  );
};

export default CarouselScrollButton;
