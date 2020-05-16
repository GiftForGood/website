import admin from '../../utils/admin-firebase';
import cookie from 'cookie';
import AuthError from '../../utils/api/error/authError';

async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case 'GET':
      const cookies = cookie.parse(req.headers.cookie || '');
      const sessionCookie = cookies.session || '';
      // Verify the session cookie. In this case an additional check is added to detect
      // if the user's Firebase session was revoked, user deleted/disabled, etc.
      try {
        let decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
        let user = await getUser(decodedClaims);
        res.json({
          user: {
            ...user,
            donor: decodedClaims.donor,
            npo: decodedClaims.npo,
            emailVerified: decodedClaims.emailVerified
          },
        });
      } catch (error) {
        // Session cookie is unavailable or invalid. Force user to login.
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

async function getUser(decodedClaims) {
  if (decodedClaims.donor) {
    try {
      let doc = await admin.firestore().collection('donors').doc(decodedClaims.uid).get();
      return doc.data();
    } catch (error) {
      throw new AuthError('user-does-not-exist', 'User does not exists');
    }
  } else if (decodedClaims.npo) {
    try {
      let doc = await admin.firestore().collection('npos').doc(decodedClaims.uid).get();
      return doc.data();
    } catch (error) {
      throw new AuthError('user-does-not-exist', 'User does not exists');
    }
  }
}

export default handler;
