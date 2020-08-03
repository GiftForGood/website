import React, { useState, useRef, useEffect } from 'react';
import Popover from 'react-tiny-popover';
import styled from 'styled-components';
import { ListChoice, InputField } from '@kiwicom/orbit-components/lib';
import client from '../../../utils/axios';

const ContentContainer = styled.div`
  background: white;
  padding: 0px 10px 8px 10px;
`;

const MrtDropdownField = ({ onSelectedStation, error, label, disabled, value }) => {
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');

  useEffect(() => {
    client.get('/api/mrt').then((resp) => {
      setStations(resp.data);
      setCurrentList(resp.data);
    });
  }, []);

  useEffect(() => {
    setSelectedStation(value);
  }, [value]);

  const setMrtValue = (station) => {
    setSelectedStation(station.name);
    onSelectedStation(station.name);
  };
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
        width: '250px',
        boxShadow: '0 8px 13px 0 rgba(44, 44, 45, 0.27)',
        borderRadius: '5px',
        position: 'fixed',
        maxHeight: '500px',
        overflowY: 'auto',
      }}
      align="start"
      transitionDuration={0.1}
      content={({ position, nudgedLeft, nudgedTop, targetRect, popoverRect }) => {
        return (
          <ContentContainer>
            <>
              {currentList.map((station) => {
                return (
                  <ListChoice
                    title={station.name}
                    onClick={() => {
                      setMrtValue(station);
                      setIsOpen(false);
                    }}
                  />
                );
              })}
            </>
          </ContentContainer>
        );
      }}
    >
      <div onClick={() => setIsOpen(true)}>
        <MRTInputField
          inputRef={inputRef}
          stations={stations}
          currentList={currentList}
          setCurrentList={setCurrentList}
          value={selectedStation}
          label={label}
          error={error}
          disabled={disabled}
        />
      </div>
    </Popover>
  );
};

const MRTInputField = ({ inputRef, stations, setCurrentList, value, error, label, disabled }) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const onChange = (e) => {
    setSearch(e.target.value);
    let filter = e.target.value;
    let shouldBeInList = [];
    for (let i = 0; i < stations.length; i++) {
      if (stations[i].name.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
        shouldBeInList.push(stations[i]);
      }
    }
    setCurrentList(shouldBeInList);
  };

  return (
    <InputField
      ref={inputRef}
      placeholder="Choose an MRT Station"
      value={search}
      onChange={onChange}
      error={error}
      label={label}
      disabled={disabled}
    />
  );
};

export default MrtDropdownField;
