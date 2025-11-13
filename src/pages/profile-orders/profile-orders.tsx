import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { selectFeedOrders } from '../../services/slices/feed';
import { getMyOrders } from '../../services/slices/feed';
import { useEffect } from 'react';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const isLoading = useSelector((state) => state.feed.isLoading);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
