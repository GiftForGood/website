import moment from 'moment';

export const getTimeDifferenceFromNow = (timeInMilliSeconds) => {
  let momentTime = moment.unix(timeInMilliSeconds / 1000);
  return momentTime.fromNow();
};

export const getFormattedDate = (timeInMilliSeconds) => {
  return moment(timeInMilliSeconds).format('DD/MM/YYYY');
};
