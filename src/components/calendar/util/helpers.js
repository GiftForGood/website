import moment from 'moment';

export function getMomentDateFromCalendarJSDate(dayElement) {
  return moment([dayElement.year, dayElement.month - 1, dayElement.date]);
}
