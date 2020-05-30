/**
 * Checks if a user is a NPO
 *  user: A user from isAuthenticated
 *  res: The response from getServerSideProps
 *  destination: An object containing "Location" [Optional]
 *
 * Eg:
 *   isNpo(user, res, { Location: '/register'});
 *   let isNpoUser = isNPO(user, res);
 */
export function isNpo(user, res, destination = {}) {
  try {
    // NPO
    if (user.npo) {
      return true;
    }

    // Not NPO
    if (!destination.hasOwnProperty('Location')) {
      return false;
    }
    throw new Error('Wrong user type');
  } catch (error) {
    res.writeHead(302, destination);
    res.end();
    return null;
  }
}

/**
 * Checks if a user is a Donor
 *  user: A user from isAuthenticated
 *  res: The response from getServerSideProps
 *  destination: An object containing "Location" [Optional]
 *
 * Eg:
 *   isDonor(user, res, { Location: '/register'});
 *   let isDonorUser = isDonor(user, res);
 */
export function isDonor(user, res, destination = {}) {
  try {
    // Donor
    if (user.donor) {
      return true;
    }

    // No Donor
    if (!destination.hasOwnProperty('Location')) {
      return false;
    }
    throw new Error('Wrong user type');
  } catch (error) {
    res.writeHead(302, destination);
    res.end();
    return null;
  }
}