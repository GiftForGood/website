import 'firebase/analytics';
import { firebase } from '../firebase';

export const initGA = () => {
  firebase.analytics();
};

export const logPageView = () => {
  firebase.analytics().setCurrentScreen(window.location.pathname);
};

export const logStartChatToAnalytics = () => {
  firebase.analytics().logEvent('start_chat_with_donation_or_wish');
};

export const logMobilePostDonationToAnalytics = () => {
  firebase.analytics().logEvent('clicked_mobile_post_donation');
};

export const logDesktopPostDonationToAnalytics = () => {
  firebase.analytics().logEvent('clicked_desktop_post_donation');
};

export const logMobilePostWishToAnalytics = () => {
  firebase.analytics().logEvent('clicked_mobile_post_wish');
};

export const logDesktopPostWishToAnalytics = () => {
  firebase.analytics().logEvent('clicked_desktop_post_wish');
};

export const logSuccessfullyCreatedDonation = () => {
  firebase.analytics().logEvent('successfully_created_donation');
};

export const logSuccessfullyCreatedWish = () => {
  firebase.analytics().logEvent('successfully_created_wish');
};
