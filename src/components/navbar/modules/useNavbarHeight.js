import { getHeight } from '../selectors';
import { useSelector } from 'react-redux';

const useNavbarHeight = () => {
  const user = useSelector(getHeight);
  return user;
};

export default useNavbarHeight;
