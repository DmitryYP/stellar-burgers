import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { selectUserError } from '../../services/slices/user';
import { useSelector, useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/user';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from '../../utils/useForm';
import { ChangeEvent } from 'react';

export const Login: FC = () => {
  const error = useSelector(selectUserError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email: values.email, password: values.password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={values.email}
      setEmail={(value) =>
        handleChange({
          target: { name: 'email', value }
        } as ChangeEvent<HTMLInputElement>)
      }
      password={values.password}
      setPassword={(value) =>
        handleChange({
          target: { name: 'password', value }
        } as ChangeEvent<HTMLInputElement>)
      }
      handleSubmit={handleSubmit}
    />
  );
};
