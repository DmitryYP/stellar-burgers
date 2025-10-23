import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { selectUserError } from '../../services/slices/user';
import { useSelector, useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/user';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const error = useSelector(selectUserError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
