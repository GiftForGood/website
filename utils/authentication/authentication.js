import client from '../axios';
import cookie from 'cookie';

/**
 * Checks if a user is authenticated or not.
 *  req: The request from getServerSideProps
 *  res: The response from getServerSideProps
 */
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

/**
 * Checks if a user is authenticated or not. If not, route them back to login page.
 *  req: The request from getServerSideProps
 *  res: The response from getServerSideProps
 */
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
