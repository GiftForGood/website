import admin from '../../utils/admin-firebase';
import cookie from 'cookie';
import AuthError from '../../utils/api/error/authError';
import { cors } from '../../utils/middleware/cors';

async function handler(req, res) {
  await cors(req, res);

  const { method } = req;
  switch (method) {
    case 'GET':
      const cookies = cookie.parse(req.headers.cookie || '');
      const sessionCookie = cookies.session || '';
      // Verify the session cookie. In this case an additional check is added to detect
      // if the user's Firebase session was revoked, user deleted/disabled, etc.
      try {
        let decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
        let currentUser = await admin.auth().getUser(decodedClaims.uid);
        let user = await getUser(currentUser.customClaims, currentUser.uid);

        // Checking for user type from 3 different sources because Cloud function doesnt update the claims fast enough.
        const donor =
          (decodedClaims && decodedClaims.donor) ||
          (user && user.donor) ||
          (currentUser.customClaims && currentUser.customClaims.donor) ||
          false;

        const npo =
          (decodedClaims && decodedClaims.npo) ||
          (user && user.npo) ||
          (currentUser.customClaims && currentUser.customClaims.npo) ||
          false;

        const isClaimSet =
          (currentUser.customClaims && currentUser.customClaims.donor) ||
          (currentUser.customClaims && currentUser.customClaims.npo) ||
          false;

        res.json({
          user: {
            ...user,
            donor: donor,
            npo: npo,
            emailVerified: currentUser.emailVerified,
            email: decodedClaims.email,
            isClaimSet: isClaimSet,
          },
        });
      } catch (error) {
        // Session cookie is unavailable or invalid. Force user to login.
        console.error('silentLogin', error);
        res.status(401).json({
          error: {
            message: 'Unauthorized request',
          },
        });
      }

      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getUser(decodedClaims, uid) {
  if (decodedClaims && decodedClaims.donor) {
    try {
      let doc = await admin.firestore().collection('donors').doc(uid).get();
      return doc.data();
    } catch (error) {
      throw new AuthError('user-does-not-exist', 'User does not exists');
    }
  } else if (decodedClaims && decodedClaims.npo) {
    try {
      let doc = await admin.firestore().collection('npos').doc(uid).get();
      return doc.data();
    } catch (error) {
      throw new AuthError('user-does-not-exist', 'User does not exists');
    }
  } else {
    try {
      let doc = await admin.firestore().collection('donors').doc(uid).get();
      if (doc.exists) {
        return doc.data();
      } else {
        let doc = await admin.firestore().collection('npos').doc(uid).get();
        return doc.data();
      }
    } catch (error) {
      throw new AuthError('user-does-not-exist', 'User does not exists');
    }
  }
}

export default handler;
