import moment from 'moment';

moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: 'just now',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    w: '1w',
    ww: '%dw',
    M: '1mo',
    MM: '%dmo',
    y: '1yr',
    yy: '%dyr',
  },
});

export const getTimeDifferenceFromNow = (timeInMilliSeconds) => {
  let momentTime = moment(timeInMilliSeconds);
  return momentTime.fromNow();
};

export const getFormattedDate = (timeInMilliSeconds) => {
  return moment(timeInMilliSeconds).format('DD/MM/YYYY');
};

export const getExpireWishDate = () => {
  let currentDateTime = Date.now();
  return moment(currentDateTime).add(1, 'month').format('DD MMM YYYY');
};

export const getExpireWishDateFormat = (timeInMilliSeconds) => {
  return moment(timeInMilliSeconds).format('DD MMM YYYY');
};

export const getDay = (timeInMilliSeconds) => {
  return moment(timeInMilliSeconds).format('DD');
}

export const getMonth = (timeInMilliSeconds) => {
  return moment(timeInMilliSeconds).format('MM');
}

export const getYear = (timeInMilliSeconds) => {
  return moment(timeInMilliSeconds).format('YYYY');
}


