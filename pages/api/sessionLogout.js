import admin from '../../utils/admin-firebase';

async function handler(req, res) {
  if (req.method === 'POST') {
    const sessionCookie = req.cookies.session || '';
    res.clearCookie('session');
    admin
      .auth()
      .verifySessionCookie(sessionCookie)
      .then((decodedClaims) => {
        return admin.auth().revokeRefreshTokens(decodedClaims.sub);
      })
      .then(() => {
        res.json({ status: true });
      })
      .catch((error) => {
        res.status(401).json({
          error: {
            message: 'Unauthorized request',
          },
        });
      });
  }
}

export default handler;
