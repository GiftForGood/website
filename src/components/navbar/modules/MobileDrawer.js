import React from 'react';
import { Stack, ButtonLink, Separator, Drawer } from '@kiwicom/orbit-components';
import CallToActionButton from '@components/buttons/CallToActionButton';

const MobileDrawer = ({ shown, onClose }) => {
  return (
    <Drawer shown={shown} position="left" onClose={onClose} suppressed={false}>
      <Stack direction="column">
        <Stack direction="column" spacing="tight">
          <ButtonLink transparent type="secondary" href={'/'}>
            Wishes
          </ButtonLink>
          <ButtonLink transparent type="secondary" href={'/donations'}>
            Donations
          </ButtonLink>
          <ButtonLink transparent type="secondary" href={'/npos'}>
            NPOs
          </ButtonLink>
          <CallToActionButton fullWidth={true} />
        </Stack>

        <Separator fullWidth />

        <Stack direction="column" spacing="tight">
          <ButtonLink transparent href="/about" type="secondary">
            About Us
          </ButtonLink>
          <ButtonLink transparent href="/privacy-policy" type="secondary">
            Privacy Policy
          </ButtonLink>
          <ButtonLink transparent href="/terms-and-conditions" type="secondary">
            Terms and Conditions
          </ButtonLink>
          <ButtonLink transparent href="/partners" type="secondary">
            Partners
          </ButtonLink>
          <ButtonLink transparent href="/delivery-partners" type="secondary">
            Delivery Partners
          </ButtonLink>
          <ButtonLink transparent href="https://dsc.comp.nus.edu.sg" type="secondary">
            Developer Student Club
          </ButtonLink>
          <ButtonLink transparent href="/contact" type="secondary">
            Contact Us
          </ButtonLink>
          <ButtonLink transparent href="/faq" type="secondary">
            FAQ
          </ButtonLink>
          <ButtonLink transparent href="/credits" type="secondary">
            Credits
          </ButtonLink>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default MobileDrawer;
