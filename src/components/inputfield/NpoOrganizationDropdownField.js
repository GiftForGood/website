import React, { useState, useRef, useEffect } from 'react';
import Popover from 'react-tiny-popover';
import styled from 'styled-components';
import { ListChoice, InputField } from '@kiwicom/orbit-components/lib';
import useDebouncedEffect from '@utils/hooks/useDebouncedEffect';
import BlackText from '../text/BlackText';
import { InstantSearch, connectSearchBox, Index, Configure, connectHits } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY);

const ContentContainer = styled.div`
  background: white;
  padding: 0px 10px 8px 10px;
`;

const NoMatchFoundContainer = styled.div`
  background: white;
  padding: 10px 10px 10px 10px;
`;

const NpoOrganizationDropdownField = ({ onSelected, error, label, disabled, value }) => {
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <InstantSearch searchClient={searchClient} indexName="organizations">
      <Popover
        isOpen={isOpen}
        position={['bottom']}
        disableReposition
        onClickOutside={() => {
          setIsOpen(false);
        }}
        containerStyle={{
          zIndex: 1000,
          width: '300px',
          boxShadow: '0 8px 13px 0 rgba(44, 44, 45, 0.27)',
          borderRadius: '5px',
          position: 'fixed',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
        align="start"
        transitionDuration={0.1}
        content={({ position, nudgedLeft, nudgedTop, targetRect, popoverRect }) => {
          return (
            <ContentContainer>
              <>
                <Index indexName="organizations">
                  <CustomHits
                    onClick={(name) => {
                      onSelected(name);
                      setSelected(name);
                      setIsOpen(false);
                    }}
                  />
                  <Configure hitsPerPage={8} />
                </Index>
              </>
            </ContentContainer>
          );
        }}
      >
        <div onClick={() => setIsOpen(true)}>
          <CustomSearchBox inputRef={inputRef} error={error} label={label} disabled={disabled} value={selected} />
        </div>
      </Popover>
    </InstantSearch>
  );
};

const NpoOrganizationInputField = ({
  currentRefinement,
  isSearchStalled,
  refine,
  inputRef,
  error,
  label,
  disabled,
  value,
}) => {
  const [search, setSearch] = useState('');

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  // Only search after 100ms after the user stop typing. This is to prevent hanging in searching the long list.
  useDebouncedEffect(
    () => {
      refine(search);
    },
    100,
    [search]
  );

  useEffect(() => {
    setSearch(value);
  }, [value]);

  return (
    <InputField
      ref={inputRef}
      placeholder="Organization"
      value={search}
      onChange={onChange}
      error={error}
      label={label}
      disabled={disabled}
    />
  );
};

const Results = ({ hits, onClick }) => {
  const handleOnClick = (name) => {
    onClick(name);
  };

  const NoMatchFoundText = () => (
    <NoMatchFoundContainer>
      <BlackText size="normal">No match found</BlackText>
    </NoMatchFoundContainer>
  );

  if (hits.length === 0) {
    return <NoMatchFoundText />;
  }

  return (
    <>
      {hits.map((hit) => (
        <ListChoice title={hit.name} onClick={() => handleOnClick(hit.name)} key={hit.objectID} />
      ))}
    </>
  );
};

const CustomSearchBox = connectSearchBox(NpoOrganizationInputField);
const CustomHits = connectHits(Results);

export default NpoOrganizationDropdownField;
