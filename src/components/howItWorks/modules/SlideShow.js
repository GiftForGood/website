import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal, Text, Stack } from '@kiwicom/orbit-components/lib';
import { ModalSection, ModalHeader } from '@kiwicom/orbit-components/lib/Modal';
import { Carousel } from 'react-responsive-carousel';
import Button from '@kiwicom/orbit-components/lib/Button';
import ButtonLink from '@kiwicom/orbit-components/lib/ButtonLink';
import { DONOR } from '@constants/usersType';
import { colors } from '@constants/colors';
import BlueButton from '@components/buttons/BlueButton';
import RedButton from '@components/buttons/RedButton';
import Linkify from 'react-linkify';

const Image = styled.img`
  height: 120px;
  width: 100%;
  margin-bottom: 30px;
`;

const BannerContentContainer = styled.div`
  margin-bottom: 50px;
`;

const Indicator = styled.li`
  background: ${({ selected, type }) =>
    selected ? (type === DONOR ? colors.donorBackground : colors.npoBackground) : '#bdbdbd'};
  width: 10px;
  height: 10px;
  display: inline-block;
  margin: 0 8px;
  border-radius: 10px;
`;

const BannerContent = ({ src, description }) => {
  return (
    <BannerContentContainer>
      <Image src={src} />

      <Linkify
        componentDecorator={(decoratedHref, decoratedText, key) => (
          <a target="blank" href={decoratedHref} key={key}>
            {decoratedText}
          </a>
        )}
      >
        <Text align="center">{description}</Text>
      </Linkify>
    </BannerContentContainer>
  );
};

const SlideShow = ({ contents, closeSlideShow, type, show = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [buttonLabel, setButtonLabel] = useState('Next');

  const updateCurrentSlide = (index) => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
  };

  const closeAndResetSlideShow = () => {
    setCurrentSlide(0);
    closeSlideShow();
  };

  return (
    <>
      {show ? (
        <Modal onClose={closeAndResetSlideShow} size="small">
          <ModalHeader title={`How it works as a ${type.toUpperCase()}`}></ModalHeader>
          <ModalSection>
            <Carousel
              showThumbs={false}
              showStatus={false}
              autoPlay={false}
              stopOnHover
              showArrows={false}
              selectedItem={currentSlide}
              onChange={updateCurrentSlide}
              renderIndicator={(onClickHandler, isSelected, index, label) => {
                if (isSelected) {
                  return <Indicator selected={isSelected} type={type} />;
                }
                return (
                  <Indicator
                    onClick={onClickHandler}
                    onKeyDown={onClickHandler}
                    value={index}
                    key={index}
                    role="button"
                    tabIndex={0}
                    title={`${label} ${index + 1}`}
                    aria-label={`${label} ${index + 1}`}
                    type={type}
                  />
                );
              }}
            >
              {contents.map((content) => (
                <BannerContent src={content.src} description={content.description} />
              ))}
            </Carousel>

            <Stack direction="row" justify="between">
              <ButtonLink onClick={closeAndResetSlideShow} type="secondary">
                Close
              </ButtonLink>
              <Button
                asComponent={type === DONOR ? RedButton : BlueButton}
                onClick={() => {
                  setCurrentSlide(currentSlide + 1);
                  if (currentSlide + 2 === contents.length) {
                    setButtonLabel('Done');
                  }
                  if (currentSlide + 1 === contents.length) {
                    closeSlideShow();
                  }
                }}
              >
                {buttonLabel}
              </Button>
            </Stack>
          </ModalSection>
        </Modal>
      ) : null}
    </>
  );
};

SlideShow.propTypes = {
  type: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  contents: PropTypes.array.isRequired,
};

export default SlideShow;
