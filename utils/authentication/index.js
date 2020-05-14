import client from '../axios';
import cookie from 'cookie';

// called in getServerSideProps
export async function isAuthenticated(req, res) {
  try {
    const response = await client.get('/api/silentLogin', {
      headers: {
        cookie: req.headers.cookie,
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function isAuthenticatedFailureRouteBackToLogin(req, res) {
  try {
    const response = await client.get('/api/silentLogin', {
      headers: {
        cookie: req.headers.cookie,
      },
    });
    return response.data;
  } catch (error) {
    res.writeHead(302, { Location: '/login' });
    res.end();
    return null;
  }
}
