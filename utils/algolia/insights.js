import { insight } from '@utils/algolia';

// Clicks
export const clickedOnWish = (userObject, objectID) => {
  insight('clickedObjectIDs', {
    userToken: userObject?.userId,
    index: 'wishes',
    eventName: 'Clicked on a wish',
    objectIDs: [objectID],
  });
};

export const clickedOnDonation = (userObject, objectID) => {
  insight('clickedObjectIDs', {
    userToken: userObject?.userId,
    index: 'donations',
    eventName: 'Clicked on a donation',
    objectIDs: [objectID],
  });
};

export const clickedOnStartChatWithWish = (userObject, objectID) => {
  insight('clickedObjectIDs', {
    userToken: userObject?.userId,
    index: 'wishes',
    eventName: 'Clicked on start chat with wish',
    objectIDs: [objectID],
  });
};

export const clickedOnStartChatWithDonation = (userObject, objectID) => {
  insight('clickedObjectIDs', {
    userToken: userObject?.userId,
    index: 'donations',
    eventName: 'Clicked on start chat with donation',
    objectIDs: [objectID],
  });
};

// Views
export const viewedWishDetails = (userObject, objectID) => {
  insight('viewedObjectIDs', {
    userToken: userObject?.userId,
    index: 'wishes',
    eventName: 'View Wish Detail Page',
    objectIDs: [objectID],
  });
};

export const viewedDonationDetails = (userObject, objectID) => {
  insight('viewedObjectIDs', {
    userToken: userObject?.userId,
    index: 'donations',
    eventName: 'View Donation Detail Page',
    objectIDs: [objectID],
  });
};

// Conversions
export const createdWish = (userObject, objectID) => {
  insight('convertedObjectIDs', {
    userToken: userObject?.userId,
    index: 'wishes',
    eventName: 'Created a wish',
    objectIDs: [objectID],
  });
};

export const createdDonation = (userObject, objectID) => {
  insight('convertedObjectIDs', {
    userToken: userObject?.userId,
    index: 'donations',
    eventName: 'Created a donation',
    objectIDs: [objectID],
  });
};
