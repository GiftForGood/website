import { getUser } from '../selectors';
import { useSelector } from 'react-redux';

const useUser = () => {
  const user = useSelector(getUser);
  return user;
};

export default useUser;
