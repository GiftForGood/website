/**
 * Checks if a user is verified by email or by admin.
 *  user: A user from isAuthenticated
 *  res: The response from getServerSideProps
 *  destination: An object containing "Location" [Optional]
 *
 * Eg:
 *   let isVerifiedUser = isVerified(user, res, { Location: '/register'});
 *   let isVerifiedUser = isVerified(user, res);
 */
export function isVerified(user, res, destination = {}) {
  try {
    // NPO
    if (user.npo && user.emailVerified && user.isVerifiedByAdmin) {
      return true;
    }

    // Donor
    if (user.donor && user.emailVerified) {
      return true;
    }

    // No Donor/NPO
    if (!destination.hasOwnProperty('Location')) {
      return false;
    }
    throw new Error('Not Verified');
  } catch (error) {
    res.writeHead(302, destination);
    res.end();
    return null;
  }
}
