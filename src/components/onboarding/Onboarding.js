import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal, Text, Stack } from '@kiwicom/orbit-components/lib';
import { ModalSection, ModalHeader } from '@kiwicom/orbit-components/lib/Modal';
import { Carousel } from 'react-responsive-carousel';
import Button from '@kiwicom/orbit-components/lib/Button';
import ButtonLink from '@kiwicom/orbit-components/lib/ButtonLink';
import { onboardingDonor, onboardingNpo } from '@constants/onboarding';
import { DONOR } from '@constants/usersType';
import { colors } from '@constants/colors';
import BlueButton from '@components/buttons/BlueButton';
import RedButton from '@components/buttons/RedButton';
import Linkify from 'react-linkify';
import { useRouter } from 'next/router';

const Image = styled.img`
  height: 200px;
  width: 100%;
  margin-bottom: 50px;
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

const Onboarding = ({ type, show = false, name = '' }) => {
  const router = useRouter();
  const [shown, setShown] = useState(show);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [onboardingContent, setOnboardingContent] = useState(type === DONOR ? onboardingDonor : onboardingNpo);
  const [buttonLabel, setButtonLabel] = useState('Next');

  const updateCurrentSlide = (index) => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
  };

  const closeOnboarding = () => {
    setShown(false);
    router.push('/', '/', {
      shallow: true,
    });
  };

  return (
    <>
      {shown ? (
        <Modal onClose={closeOnboarding} size="small">
          <ModalHeader title={`Welcome, ${name}!`}></ModalHeader>
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
              {onboardingContent.map((content) => (
                <BannerContent src={content.src} description={content.description} />
              ))}
            </Carousel>

            <Stack direction="row" justify="between">
              <ButtonLink onClick={closeOnboarding} type="secondary">
                Skip intro
              </ButtonLink>
              <Button
                asComponent={type === DONOR ? RedButton : BlueButton}
                onClick={() => {
                  setCurrentSlide(currentSlide + 1);
                  if (currentSlide + 2 === onboardingContent.length) {
                    setButtonLabel('Done');
                  }
                  if (currentSlide + 1 === onboardingContent.length) {
                    closeOnboarding();
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

Onboarding.propTypes = {
  type: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

export default Onboarding;
