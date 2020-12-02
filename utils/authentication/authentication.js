import cookie from 'cookie';
import admin from '@utils/admin-firebase';
import AuthError from '@api/error/authError';
import { deserializeFirestoreTimestampToUnixTimestampNode } from '@utils/firebase/deserializerNode';

/**
 * Checks if a user is authenticated or not.
 *  req: The request from getServerSideProps
 *  res: The response from getServerSideProps
 */
export async function isAuthenticated(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const sessionCookie = cookies.session || '';
  // Verify the session cookie. In this case an additional check is added to detect
  // if the user's Firebase session was revoked, user deleted/disabled, etc.
  try {
    let decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
    let currentUser = await admin.auth().getUser(decodedClaims.uid);
    let user = await getUser(currentUser.customClaims, currentUser.uid);

    // Checking for user type from 3 different sources because Cloud function doesnt update the claims fast enough.
    const donor = decodedClaims?.donor || user?.user.donor || currentUser.customClaims?.donor || false;
    const npo = decodedClaims?.npo || user?.npo || currentUser.customClaims?.npo || false;
    const isClaimSet = currentUser.customClaims?.donor || currentUser.customClaims?.npo || false;

    let data = {
      user: {
        ...user,
        donor: donor,
        npo: npo,
        emailVerified: currentUser.emailVerified,
        email: decodedClaims.email,
        isClaimSet: isClaimSet,
      },
    };
    deserializeFirestoreTimestampToUnixTimestampNode(data);
    return data;
  } catch (error) {
    console.error('silentLogin', error);
    return null;
  }
}

async function getUser(decodedClaims, uid) {
  try {
    if (decodedClaims && decodedClaims.donor) {
      let doc = await admin.firestore().collection('donors').doc(uid).get();
      return doc.data();
    }

    if (decodedClaims && decodedClaims.npo) {
      let doc = await admin.firestore().collection('npos').doc(uid).get();
      return doc.data();
    }

    let doc = await admin.firestore().collection('donors').doc(uid).get();
    if (doc.exists) {
      return doc.data();
    } else {
      let doc = await admin.firestore().collection('npos').doc(uid).get();
      return doc.data();
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw new AuthError('user-does-not-exist', 'User does not exists');
    } else {
      throw new Error('Unknown error in getUser');
    }
  }
}
