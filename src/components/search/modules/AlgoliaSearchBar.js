import React, { useState } from 'react';
import { InputField, ButtonLink } from '@kiwicom/orbit-components/lib';
import Close from '@kiwicom/orbit-components/lib/icons/Close';
import useDebouncedEffect from '@utils/hooks/useDebouncedEffect';

// Added 500ms of delay so that search does not incur so much request.
const SearchBar = ({ currentRefinement, isSearchStalled, refine, inputRef }) => {
  const [search, setSearch] = useState('');
  const onChange = (e) => {
    setSearch(e.target.value);
  };

  useDebouncedEffect(
    () => {
      refine(search);
    },
    500,
    [search]
  );

  return (
    <InputField
      ref={inputRef}
      inputMode="search"
      placeholder="Search for wishes or donations"
      value={search}
      onChange={onChange}
      suffix={
        <ButtonLink
          iconLeft={<Close />}
          onClick={() => {
            refine('');
            setSearch('');
          }}
          size="normal"
          transparent
        />
      }
    />
  );
};

export default SearchBar;
