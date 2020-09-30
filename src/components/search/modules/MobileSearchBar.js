import React, { useState } from 'react';
import { Stack, ButtonLink, InputField, Tag, ListChoice } from '@kiwicom/orbit-components/';
import { Search } from '@kiwicom/orbit-components/lib/icons';
import { WISHES, DONATIONS, NPOS } from '@constants/search';

const MobileSearchBar = ({ onEnterPressed }) => {
  const [searchIndex, setSearchIndex] = useState(WISHES);
  const [searchQuery, setSearchQuery] = useState('');

  const onChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  return (
    <Stack>
      <InputField
        inputMode="search"
        placeholder="Search for wishes, donations or npos"
        tags={
          <>
            <Tag selected>{searchIndex}</Tag>
          </>
        }
        suffix={
          <ButtonLink
            iconLeft={<Search />}
            size="normal"
            transparent
            onClick={() => {
              onEnterPressed(searchQuery, searchIndex.toLowerCase());
            }}
          />
        }
        value={searchQuery}
        onChange={onChange}
        onKeyDown={(event) => {
          if (event.keyCode === 13) {
            onEnterPressed(searchQuery, searchIndex.toLowerCase());
          }
        }}
      />

      <ListChoice onClick={() => setSearchIndex(WISHES)} selectable selected={searchIndex === WISHES} title={WISHES} />
      <ListChoice
        onClick={() => setSearchIndex(DONATIONS)}
        selectable
        selected={searchIndex === DONATIONS}
        title={DONATIONS}
      />
      <ListChoice onClick={() => setSearchIndex(NPOS)} selectable selected={searchIndex === NPOS} title={NPOS} />
    </Stack>
  );
};

export default MobileSearchBar;
