import 'firebase/analytics';
import { firebase } from '../firebase';

export const initGA = () => {
  firebase.analytics();
};

export const logPageView = () => {
  firebase.analytics().setCurrentScreen(window.location.pathname);
};
