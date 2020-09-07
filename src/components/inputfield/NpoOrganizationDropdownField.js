import React, { useState, useRef, useEffect } from 'react';
import Popover from 'react-tiny-popover';
import styled from 'styled-components';
import { ListChoice, InputField, ButtonLink, Loading } from '@kiwicom/orbit-components/lib';
import { ChevronDown } from '@kiwicom/orbit-components/lib/icons';
import useDebouncedEffect from '@utils/hooks/useDebouncedEffect';
import BlackText from '../text/BlackText';

const ContentContainer = styled.div`
  background: white;
  padding: 0px 10px 8px 10px;
`;

const NoMatchFoundContainer = styled.div`
  background: white;
  padding: 10px 10px 10px 10px;
`;

const NpoOrganizationDropdownField = ({ onSelected, error, label, disabled, value, options }) => {
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const [values, setValues] = useState([]);
  const [selected, setSelected] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (options) {
      setValues(options);
      setCurrentList(options);
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const setValue = (value) => {
    setSelected(value);
    onSelected(value);
  };

  const NoMatchFoundText = () => (
    <NoMatchFoundContainer>
      <BlackText size="normal">No match found</BlackText>
    </NoMatchFoundContainer>
  );

  return (
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
              {loading ? (
                <Loading />
              ) : currentList.length === 0 ? (
                <NoMatchFoundText />
              ) : (
                currentList.map((data) => {
                  return (
                    <ListChoice
                      key={data.label}
                      title={data.label}
                      onClick={() => {
                        setValue(data.value);
                        setIsOpen(false);
                      }}
                    />
                  );
                })
              )}
            </>
          </ContentContainer>
        );
      }}
    >
      <div onClick={() => setIsOpen(true)}>
        <NpoOrganizationInputField
          inputRef={inputRef}
          options={values}
          currentList={currentList}
          setCurrentList={setCurrentList}
          value={selected}
          label={label}
          error={error}
          disabled={disabled}
        />
      </div>
    </Popover>
  );
};

const NpoOrganizationInputField = ({ inputRef, options, setCurrentList, value, error, label, disabled }) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  // Only search after 100ms after the user stop typing. This is to prevent hanging in searching the long list.
  useDebouncedEffect(
    () => {
      let filter = search;
      let shouldBeInList = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].label.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
          shouldBeInList.push(options[i]);
        }
      }
      setCurrentList(shouldBeInList);
    },
    100,
    [search]
  );

  return (
    <InputField
      ref={inputRef}
      placeholder="Organization"
      value={search}
      onChange={onChange}
      error={error}
      label={label}
      disabled={disabled}
      suffix={<ButtonLink iconLeft={<ChevronDown />} size="normal" transparent />}
    />
  );
};

export default NpoOrganizationDropdownField;
