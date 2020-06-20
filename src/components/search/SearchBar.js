import React from 'react';
import { InputField, ButtonLink } from '@kiwicom/orbit-components/lib';
import Close from '@kiwicom/orbit-components/lib/icons/Close';


const SearchBar = ({ currentRefinement, isSearchStalled, refine }) => (
  <form noValidate action="" role="search">
    <InputField
      inputMode="search"
      placeholder="Search for wishes or donations"
      value={currentRefinement}
      onChange={(event) => refine(event.currentTarget.value)}
      suffix={<ButtonLink iconLeft={<Close />} onClick={() => refine('')} size="normal" transparent />}
    />
    {isSearchStalled ? 'My search is stalled' : ''}
  </form>
);

export default SearchBar;
