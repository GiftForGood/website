import runMiddleware from '../middleware';
import sessionHandler from '../session/sessionHandler';
import firebase from '../admin-firebase';

export async function isAuthenticated(req, res) {
  await runMiddleware(req, res, sessionHandler);
  const user = req.session && req.session.decodedToken ? req.session.decodedToken : null;
  let token = req.session.token;
  if (user) {
    try {
      await firebase.auth().verifyIdToken(token);
      return user;
    } catch (error) {
      return null;
    }
  }
  if (!user) {
    console.log('Fail redirect to test page');
    return user;
  }
}

export async function isAuthenticatedFailureRouteBackToLogin(req, res) {
  await runMiddleware(req, res, sessionHandler);
  const user = req.session && req.session.decodedToken ? req.session.decodedToken : null;
  if (!user) {
    res.writeHead(302, { Location: '/login' });
    res.end();
    return;
  }
}
