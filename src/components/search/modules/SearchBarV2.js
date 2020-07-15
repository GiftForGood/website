import React, { useState } from 'react';
import { InputField, ButtonLink, Popover, ListChoice, Button, Stack } from '@kiwicom/orbit-components/lib';
import Close from '@kiwicom/orbit-components/lib/icons/Close';
import ChevronDown from '@kiwicom/orbit-components/lib/icons/ChevronDown';
import styled, { css } from 'styled-components';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

const SearchWrapper = styled.div`
  border-radius: ${({ theme }) => theme.orbit.borderRadiusNormal};
  box-shadow: inset 0 0 0
    ${({ theme, error }) =>
      `${theme.orbit.borderWidthInput} ${error ? theme.orbit.borderColorInputError : theme.orbit.borderColorInput}`};
`;

const ButtonWrapper = styled.div`
  min-width: 125px;
  width: 95vw;
  ${media.largeMobile(css`
    width: 0;
  `)};
`;

const SearchBar = ({ onEnterPressed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('Wishes');
  const { isDesktop, isTablet } = useMediaQuery();

  const onChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  return (
    <SearchWrapper>
      <Stack
        spacing="none"
        direction="column"
        tablet={{
          spacing: 'none',
          direction: 'row',
        }}
        desktop={{
          spacing: 'none',
          direction: 'row',
        }}
      >
        {isDesktop || isTablet ? null : (
          <Stack justify="center">
            <Popover
              content={
                <div>
                  <ListChoice title="Wishes" onClick={() => setSelectedIndex('Wishes')} />
                  <ListChoice title="Donations" onClick={() => setSelectedIndex('Donations')} />
                </div>
              }
              noPadding
              preferredPosition="bottom"
            >
              <ButtonWrapper>
                <ButtonLink iconRight={<ChevronDown />} size="normal" transparent type="secondary" fullWidth>
                  {selectedIndex}
                </ButtonLink>
              </ButtonWrapper>
            </Popover>
          </Stack>
        )}

        {isDesktop || isTablet ? (
          <Popover
            content={
              <div>
                <ListChoice title="Wishes" onClick={() => setSelectedIndex('Wishes')} />
                <ListChoice title="Donations" onClick={() => setSelectedIndex('Donations')} />
              </div>
            }
            noPadding
            preferredPosition="bottom"
          >
            <ButtonWrapper>
              <ButtonLink iconRight={<ChevronDown />} size="normal" transparent type="secondary" fullWidth>
                {selectedIndex}
              </ButtonLink>
            </ButtonWrapper>
          </Popover>
        ) : null}

        <InputField
          inputMode="search"
          placeholder="Search for wishes or donations"
          value={searchQuery}
          onChange={onChange}
          suffix={
            <ButtonLink
              iconLeft={<Close />}
              onClick={() => {
                setSearchQuery('');
              }}
              size="normal"
              transparent
            />
          }
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              onEnterPressed(searchQuery, selectedIndex.toLowerCase());
            }
          }}
        />
      </Stack>
    </SearchWrapper>
  );
};

export default SearchBar;
