import runMiddleware from '../middleware';
import sessionHandler from '../session/sessionHandler';
//import firebase from '../admin-firebase';
import 'isomorphic-unfetch';
export async function isAuthenticated() {
  // //await runMiddleware(req, res, sessionHandler);
  // const user = req.session && req.session.decodedToken ? req.session.decodedToken : null;
  const response = await fetch('http://localhost:3000/api/silentLogin', {
    method: 'POST',
    credentials: 'same-origin',
  });
  const data = await response.json()
  console.log(data);

  // let token = req.session.token;
  // if (user) {
  //   try {
  //     //await firebase.auth().verifyIdToken(token);
  //     return user;
  //   } catch (error) {
  //     return null;
  //   }
  // }
  // if (!user) {
  //   console.log('Fail redirect to test page');
  //   return user;
  // }
}

export async function isAuthenticatedFailureRouteBackToLogin(req, res) {
  //await runMiddleware(req, res, sessionHandler);
  const user = req.session && req.session.decodedToken ? req.session.decodedToken : null;
  if (!user) {
    res.writeHead(302, { Location: '/login' });
    res.end();
    return;
  }
}
