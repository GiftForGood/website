import api from '../utils/api';
import { useState, useEffect } from 'react';
import { REGISTRY_OF_SOCIETIES } from '../utils/constants/npoRegisteredRegistrar';
import { NEW, USED } from '../utils/constants/itemCondition';
// import { IMAGE, TEXT, CALENDAR } from '../utils/constants/chatContentType';
// import { ADDED, MODIFIED } from '../utils/constants/chatSubscriptionChange';

function HomePage() {
  // useEffect(() => {
  //    api.chats.subscribeToChats(subCallback).then((toSub) => {
  //      console.log('FE sub');
  //      console.log(typeof toSub);
  //      setSubFunc(() => toSub);
  //   });

  //   return function cleanup() {
  //     console.log("unsub")
  //     api.chats.unsubscribeToChats(subFunc);
  //   }
  // }, [])

  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [img3, setImg3] = useState(null);
  const [img4, setImg4] = useState(null);
  const [subFunc, setSubFunc] = useState(null);

  const imgOne = (event) => {
    setImg1(event.target.files[0]);
  };

  const imgTwo = (event) => {
    setImg2(event.target.files[0]);
  };

  const imgThree = (event) => {
    setImg3(event.target.files[0]);
  };

  const imgFour = (event) => {
    setImg4(event.target.files[0]);
  };

  const callAPI = () => {
    api.chats
      .sendInitialImageMessageForDonation('4RqUXdjKTrDV35I18Hsn', img1)
      .then(([chatDoc, msgDoc]) => {
        console.log(chatDoc.data());
        console.log(msgDoc.data());
        console.log('from cr8');
        console.log('');
      })
      .catch((err) => console.log(err));

    // api.chats
    //   .sendInitialImageMessagesForDonation('4RqUXdjKTrDV35I18Hsn',[img1, img2])
    //   .then((ss) => ss.forEach((doc) => console.log(doc.data())))
    //   .catch((err) => console.log(err));

    // api.chats
    //   .getChatMessages('hIhlAyBxOqBdd5JpP7lR')
    //   .then((ss) => {
    //     console.log('page1');
    //     ss.forEach((doc) => console.log(doc.data()));

    //     api.chats.getChatMessages('hIhlAyBxOqBdd5JpP7lR').then((ss2) => {
    //       console.log('page2');
    //       ss2.forEach((doc2) => console.log(doc2.data()));
    //     });
    //   })
    //   .catch((err) => console.log(err));

    // api.chats
    //   .getChatsForPost('Vb1ho399JmLw0ZxMWEqn')
    //   .then((ss) => {
    //     console.log('page1');
    //     ss.forEach((doc) => console.log(doc.data()));

    //     let lastDoc = ss.docs[ss.docs.length - 1];
    //     api.chats.getChatsForPost('Vb1ho399JmLw0ZxMWEqn', lastDoc).then((ss2) => {
    //       console.log('page2');
    //       ss2.forEach((doc2) => console.log(doc2.data()));
    //     });
    //   })
    //   .catch((err) => console.log(err));
  };

  const newMsg = () => {
    // api.chats
    //   .sendImageMessages('HcMZ2AtVi68cZDpehfvL', [img1, img2])
    //   .then((ss) => ss.forEach((doc) => console.log(doc.data())))
    //   .catch((err) => console.log(err));

    // api.chats
    // .sendCalendarMessages('HcMZ2AtVi68cZDpehfvL', ['12 Jun (Fri), 9 AM - 10 AM', '15 Jun (Mon), 9 AM - 10 AM'])
    // .then((ss) => ss.forEach((doc) => console.log(doc.data())))
    // .catch((err) => console.log(err));

    api.chats
      .sendTextMessage('r7943x3d0OoXTVUFU3Ra', 'Last for the night')
      .then((doc) => {
        console.log(doc.data());
        console.log('from cr8');
        console.log('');
      })
      .catch((err) => console.log(err));
  };

  const subCallback = (type, doc) => {
    console.log('from callback baby');
    console.log(type);
    console.log(doc.data());
    console.log('');
  };

  const subChat = () => {
    // api.chats.subscribeToChatMessages('cVKL56sHN5HaE2IQCD0m', subCallback).then((toSub) => {
    //   console.log('FE sub');
    //   console.log(typeof toSub);
    //   setSubFunc(() => toSub);
    // });

    // api.chats.subscribeToChats(subCallback).then((toSub) => {
    //   console.log('FE sub');
    //   console.log(typeof toSub);
    //   setSubFunc(() => toSub);
    // });

    api.chats.subscribeToChatsForPost('Vb1ho399JmLw0ZxMWEqn', subCallback).then((toSub) => {
      console.log('FE sub');
      console.log(typeof toSub);
      setSubFunc(() => toSub);
    });
  };

  const unsubChat = () => {
    console.log('FE unsub');
    // api.chats.unsubscribeFromChatMessages('cVKL56sHN5HaE2IQCD0m', subFunc);
    api.chats.unsubscribeToChats(subFunc);
  };

  const myAPI = () => {
    // api.donations.create(
    //   'K',
    //   'CH',
    //   ['IwmfcaTjKqrnviMxHQ5G'],
    //   25, 7, 2020,
    //   30, 7, 2020,
    //   '',
    //   ['Woodlands MRT'],
    //   USED,
    //   img1,
    //   [img1, img2, img3, img4]
    // )
    // .then(doc => console.log(doc.data()))
    // .catch(err => console.log(err))

    // api.donations
    //   .update(
    //     'e29yAg9BMn7undSFVRsI',
    //     'Macbook Air',
    //     'The new and amazing Macbook Air',
    //     ['IwmfcaTjKqrnviMxHQ5G'],
    //     25,
    //     7,
    //     2020,
    //     30,
    //     7,
    //     2020,
    //     '',
    //     ['Woodlands MRT'],
    //     USED,
    //     img1,
    //     [
    //       'https://firebasestorage.googleapis.com/v0/b/giftforgood.appspot.com/o/donors%2Fry0paEJwh7cBmdMUhQepeTTnFjd2%2Fdonations%2Fe29yAg9BMn7undSFVRsI%2Fe29yAg9BMn7undSFVRsI_1593174791993_8116dfbf-36d5-498b-8642-eeeefa1760d5.jpg?alt=media&token=8f519bce-3140-416e-b4ae-a284b6121bc1',
    //       'https://firebasestorage.googleapis.com/v0/b/giftforgood.appspot.com/o/donors%2Fry0paEJwh7cBmdMUhQepeTTnFjd2%2Fdonations%2Fe29yAg9BMn7undSFVRsI%2Fe29yAg9BMn7undSFVRsI_1593174791993_ba2bc23b-6e7e-469d-93cd-e0dd2f896f99.jpg?alt=media&token=8e4e8c57-7de5-4daa-be3a-c80b617b11e4',
    //       img1,
    //     ]
    //   )
    //   .then((doc) => console.log(doc.data()))
    //   .catch((err) => console.log(err));

    api.users
      .updateNPO('Yuan Lia Ni Shi', 12345678, img1)
      .then((doc) => console.log(doc.data()))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <input type="file" onChange={imgOne} />
      <input type="file" onChange={imgTwo} />
      <input type="file" onChange={imgThree} />
      <input type="file" onChange={imgFour} />
      <button onClick={callAPI}>cr8</button>
      <button onClick={newMsg}>new</button>
      <button onClick={subChat}>sub</button>
      <button onClick={unsubChat}>unsub</button>
      <button onClick={myAPI}>API</button>
    </div>
  );
}

export default HomePage;
