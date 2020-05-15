import moment from 'moment';

export const getTimeDifferenceFromNow = (timeInMilliSeconds) => {
  let momentTime = moment.unix(timeInMilliSeconds / 1000);
  return momentTime.fromNow();
};
