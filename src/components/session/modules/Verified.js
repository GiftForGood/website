import useUser from '../../../components/session/modules/useUser';

const Verified = (props) => {
  const user = useUser();

  // user is initially null --> populated with user info. null should disable children.
  if (user === null) {
    return props.children({
      isDisabled: true,
    });
  }

  // NPO
  if (user.npo && user.emailVerified && user.isVerifiedByAdmin) {
    return props.children({
      isDisabled: false,
    });
  }

  // Donor
  if (user.donor && user.emailVerified) {
    return props.children({
      isDisabled: false,
    });
  }

  return props.children({
    isDisabled: true,
  });
};

export default Verified;
