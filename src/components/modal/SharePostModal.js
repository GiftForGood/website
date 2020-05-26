import React, { useState } from 'react';
import Modal, { ModalSection } from '@kiwicom/orbit-components/lib/Modal';
import { ButtonLink, Heading, Stack } from '@kiwicom/orbit-components/lib';
import { Facebook, Twitter, Link } from '@kiwicom/orbit-components/lib/icons';

const SharePostModal = ({ postId, postUrl, postType, onClose }) => {
  console.log(postType);
  const isWishPost = postType === 'wish';
  const twitterShareHref = `https://twitter.com/intent/tweet?text=Check%20out%20this%20${
    isWishPost ? 'wish' : 'donation'
  }%20from%20GiftForGood!%20${postUrl}`;
  const facebookShareHref = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgiftforgood.io%2F${
    isWishPost ? 'wishes' : 'donation'
  }%2F${postId}%2F&amp;`;

  const [copyLink, setCopyLink] = useState(false);

  const handleCopyLinkOnClick = () => {
    navigator.clipboard.writeText(postUrl);
    setCopyLink(true);
  };

  return (
    <Modal size="small" onClose={onClose}>
      <ModalSection>
        <Heading type="title2" spaceAfter="medium">
          Share
        </Heading>
        <Stack align="start" justify="start" direction="column" spacing="tight">
          <ButtonLink
            size="large"
            transparent
            external
            type="secondary"
            iconLeft={<Facebook />}
            href={facebookShareHref}
          >
            Facebook
          </ButtonLink>
          <ButtonLink size="large" transparent external type="secondary" iconLeft={<Twitter />} href={twitterShareHref}>
            Twitter
          </ButtonLink>
          {/* Some browsers might not support Clipboard, will be hidden instead */}
          {navigator.clipboard && (
            <ButtonLink size="large" transparent type="secondary" iconLeft={<Link />} onClick={handleCopyLinkOnClick}>
              {copyLink ? 'Link copied!' : 'Copy link'}
            </ButtonLink>
          )}
        </Stack>
      </ModalSection>
    </Modal>
  );
};

export default SharePostModal;
