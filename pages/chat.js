import React, { useState } from 'react';
import { Button, Text } from '@kiwicom/orbit-components/lib';
import CalendarModal from '../src/components/calendar/modules/CalendarModal';

const ChatPage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModel = () => setShowModal(false);

  return (
    <div>
      <Text as="p">Welcome to Chat Page!</Text>
      <Button onClick={handleShowModal}>Suggest Dates</Button>
      <CalendarModal onShow={showModal} onHide={handleCloseModel} />
    </div>
  );
};

export default ChatPage;
